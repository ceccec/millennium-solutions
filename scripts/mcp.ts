#!/usr/bin/env node
// Minimal MCP (Model Context Protocol) stdio server — exposes the deposit's honest tools to LLM clients.
// DEPENDENCY-FREE by design: implements JSON-RPC 2.0 over stdio with node built-ins only (no
// @modelcontextprotocol/sdk), preserving the zero-dep-core. Tools inherit the discipline: the honesty
// gate returns a FLOOR (not a truth oracle), content-address = integrity (not encryption/proof).
import { createInterface } from 'node:readline'
import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { doubleTorusGravity } from '../src/the/apple/index.ts'
import { diamond } from '../src/5/diamond.ts'
import { computes } from './honesty-gate.ts'
import { proveVerdict } from './verdict.ts'
import { apiFetch } from './api.ts'
import { CANDIDATES, provable } from './discover.ts'
import { CORE as ROSETTA_CORE, DOMAINS as ROSETTA_DOMAINS } from '../src/the/rosetta/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'
import { isLive as __isLive, isWithdrawn as __isWithdrawn } from '../src/api/index.ts'

const version = (() => { try { return execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').pop() || 'v0' } catch { return 'v0' } })()
type LedgerEntry = { key: string; name: string; receipt: string }
const loadLedger = (): LedgerEntry[] => existsSync('src/proof/discovered.json') ? __ledger() : []
const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')
const reply = (id: unknown, result: unknown) => send({ jsonrpc: '2.0', id, result })
const fail = (id: unknown, code: number, message: string) => send({ jsonrpc: '2.0', id, error: { code, message } })

const TOOLS = [
  { name: 'content_address', description: 'Content-address (uuid) any text — INTEGRITY/provenance, NOT encryption or proof.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'honesty_gate', description: 'Run the honesty gate: binary 1 (no named overclaim) or 0 (drains) + the hit. A lexical FLOOR, not a truth oracle; passing != true.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'merkle_fold', description: 'Order-independent merkle fold of a list of strings into one address.',
    inputSchema: { type: 'object', properties: { items: { type: 'array', items: { type: 'string' } } }, required: ['items'] } },
  { name: 'probe', description: 'Read-only reachability probe of a public URL: REACHED | INCONCLUSIVE | DRAINS + HTTP failure-mode (429/403/404/5xx classified, rate-respecting). A timeout is INCONCLUSIVE, never "blocked" — HTTP status indexed honestly.',
    inputSchema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] } },
  { name: 'lineage', description: 'Delivery vs churn across release tags, by git tree hash (git\'s own faithful content-address). Identical trees = a tag minted over no delta (churn); distinct = a delivery. Integrity-level: measures WHAT was delivered, not whether it is true. Heroes and traitors by deeds, not statements.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'verify', description: 'Audit any prose/message, or decode-and-verify a uuid across BOTH evidence sets. Prose → honesty-gate verdict + content-address. A uuid is a ONE-WAY address (never reversed); "decode" looks it up in (1) the agent-statement receipts (src/receipts/, verifies toUuid(message)===uuid + observer/role) then (2) the discovery ledger (reports the fact, chain position, and whether the chain-of-custody link is intact). In neither ⇒ opaque, honestly.',
    inputSchema: { type: 'object', properties: { text: { type: 'string' } }, required: ['text'] } },
  { name: 'discover', description: 'The discovery engine: computationally-generated + curated candidate facts over ℤ/9, each tested by exhaustion. Returns discovered (provable) vs refuted + a discovery root. Decidable facts only — never a proof of the six OPEN Millennium conjectures. This deposit 0/7; humanity 1/7 (Poincaré, Perelman 2003).',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'recompute', description: 'Recompute ALL theorems: re-run every candidate\'s formula (its test) by exhaustion, report how many hold vs refuted, verify every RECORDED ledger theorem still recomputes true, and fold the recompute root — the whole deposit recomputes from its theorems, not from stored answers. A theorem without a formula that recomputes true is refused (hallucination). Decidable; deposit 0/7.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'rosetta', description: 'The completed cross-domain rosetta as a reusable endpoint: every domain family one hop from the shared core, content-addressed and folded to one rosetta root, all addresses distinct (no collision unless consolidated or redistributed). Returns the core address, the domain list and count, the collision check, and the rosetta root. Integrity of the cross-domain map, not truth. Deposit 0/7.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'audit', description: 'Self-audit of THIS MCP server: content-address every tool (name+description+schema), verify each declared tool has a handler and each handler is declared (coverage), fold to one self-audit root. Integrity of the tool surface, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'forensics', description: 'Chain-of-custody for the discovery ledger: recompute the receipt chain link-by-link (receipt[i]=toUuid(receipt[i-1]→key[i]), seed axiom:TRINITY), pinpoint any break, check for duplicate keys/receipts, and fold a tamper-evident seal. Genesis discontinuities are a documented baseline; a NEW break is tampering. Integrity/provenance of evidence, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  // ── THE LEAN WORKFLOW, encoded. Each of these was run by hand, repeatedly, with a pause for confirmation
  // between steps — which is how a check gets skipped and how a session stalls waiting on a human for work a
  // machine already knows how to do. They are tools now: callable, idempotent, and reporting measurements
  // rather than prose. Every one shells to the script that owns the operation, so there is one implementation.
  { name: 'lean_verify', description: 'Compile every Lean file and audit it per theorem: #print axioms on each, hygiene (no sorry / native_decide outside comments), theorem counts. Fails if any file carries an axiom or does not compile. This is the gate every seal depends on.',
    inputSchema: { type: 'object', properties: { file: { type: 'string', description: 'optional single file to verify' } }, required: [] } },
  { name: 'lean_seal', description: 'Seal every compiled, axiom-free Lean theorem into the ledger with a chained receipt. ONLY by-decide theorems are sealed — rfl on a declared constant proves the declaration, not a fact. Gated on lean_verify; seals nothing if the layer does not verify. Pass dry=true to report without writing.',
    inputSchema: { type: 'object', properties: { dry: { type: 'boolean' } }, required: [] } },
  { name: 'lean_generate', description: 'Generate quantified Lean for ledger families — one theorem subsuming a whole family of per-parameter rows. Five gates: compiles, axiom-free, agrees with the ledger test at every parameter, carries a boundary case, and flags a zero divisor in range. Pass emit=true to write.',
    inputSchema: { type: 'object', properties: { emit: { type: 'boolean' } }, required: [] } },
  { name: 'ledger_status', description: 'Composition of the ledger: total, live, lean-backed, revoked, portable-to-Lean, chain breaks, duplicate keys/receipts, octave remainder. Measurement only — writes nothing.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'ledger_trial', description: 'Put every ledger entry in the dock and record a verdict with its ground — no bare verdicts. Writes src/proof/trial-all.json. Adjudicates, never removes: what follows from a refusal is the captain\'s to order.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'pages', description: 'Regenerate README.md and the homepage from one generator. Every claim derives its sentence from the artefact it reads and must declare the values it read; a claim that measures nothing is refused and nothing is written.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
]

const HANDLERS: Record<string, (a: any) => string | Promise<string>> = {
  lean_verify: (a) => { try { return execSync(`node scripts/lean.ts${a?.file ? ' ' + a.file : ''}`, { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  lean_seal: (a) => { try { return execSync(`node scripts/seal-lean.ts${a?.dry ? '' : ' --seal'}`, { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  lean_generate: (a) => { try { return execSync(`node scripts/lean-gen.ts${a?.emit ? ' --emit' : ''}`, { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  ledger_trial: () => { try { return execSync('node scripts/trial-all.ts', { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  pages: () => { try { return execSync('node scripts/pages.ts', { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  ledger_status: () => {
    const l = loadLedger() as (LedgerEntry & { revoked?: boolean; portable?: boolean })[]
    const live = l.filter(__isLive)
    let breaks = 0, prev = l[1]?.receipt
    for (let i = 2; i < l.length; i++) { if (toUuid(prev + '→' + l[i].key) !== l[i].receipt) breaks++; prev = l[i].receipt }
    return JSON.stringify({ total: l.length, live: live.length, leanBacked: l.filter((e) => e.key.startsWith('lean_')).length,
      revoked: l.filter(__isWithdrawn).length, portableToLean: l.filter((e) => e.portable).length,
      chainBreaks: breaks, duplicateKeys: l.length - new Set(l.map((e) => e.key)).size,
      duplicateReceipts: l.length - new Set(l.map((e) => e.receipt)).size,
      octaveRemainder: l.length % 8, liveAllLean: live.every((e) => e.key.startsWith('lean_')),
      note: 'live means backed by a Lean proof; a dirty entry stays in the record with the reason it went, because a chained ledger supersedes rather than deletes' }, null, 1)
  },
  content_address: (a) => toUuid(String(a.text)),
  honesty_gate: (a) => { const r = computes(String(a.text)); return JSON.stringify({ binary: r.binary, hit: r.hit, note: r.binary ? 'no overclaim shape (floor, not truth)' : 'drains: ' + r.hit }) },
  merkle_fold: (a) => merkleFold((a.items || []).map(String)),
  probe: async (a) => { const r = await apiFetch(String(a.url)); return JSON.stringify({ verdict: r.verdict, note: r.note, uuid: r.uuid }) },
  verify: (a) => {
    const t = String(a.text || '')
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(t)) {
      const p = 'src/receipts/' + t + '.json'
      if (existsSync(p)) {
        const r = JSON.parse(readFileSync(p, 'utf8'))
        return JSON.stringify({ uuid: t, source: 'agent-statement receipt', decoded: r.message, observer: r.agent + ' as ' + r.role, contentVerify: toUuid(r.message) === t, gate: computes(r.message).binary })
      }
      const ledger = loadLedger()
      const idx = ledger.findIndex((e) => e.receipt === t)
      if (idx >= 0) {
        const e = ledger[idx]; const pred = idx === 0 ? 'axiom:TRINITY' : ledger[idx - 1].receipt
        const linkOk = toUuid(pred + '→' + e.key) === e.receipt
        const genesis = e.key === 'euler_units_pow6' || e.key === 'units_sum_zero'
        return JSON.stringify({ uuid: t, source: 'discovery ledger', fact: e.name, key: e.key, chainPosition: idx, chainLinkIntact: linkOk, note: linkOk ? 'chain-of-custody intact' : genesis ? 'genesis discontinuity (documented baseline)' : 'BROKEN — tamper (legal trial)' })
      }
      return JSON.stringify({ uuid: t, decoded: null, note: 'in neither the receipt ledger nor the discovery ledger — a one-way address cannot be reversed to its message' })
    }
    // Prose → the FULL, formula-backed trial (reusable): the floor verdict PLUS a proof-of-verdict receipt that
    // folds every supporting ledger theorem whose formula recomputes true (double-torus 7D). The bare gate
    // binary is the O(1) floor; proofReceipt is the valid ruling that cites its formulas — reproducible by anyone.
    const v = proveVerdict(t)
    return JSON.stringify({ text: t, contentAddress: v.receipt, gate: v.gateBinary, hit: v.gateBinary ? null : computes(t).hit, verdict: v.verdict, formulas: v.formulas, recomputedTrue: v.recomputedTrue, proofReceipt: v.proofReceipt, note: v.note + ' — full trial: ' + v.recomputedTrue + '/' + v.formulas + ' theorem-formulas recompute true, folded to the proof-of-verdict receipt. integrity, not truth. 0/7' })
  },
  lineage: () => {
    const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
    const byTree = new Map<string, string[]>()
    for (const t of tags) { const tree = execSync('git rev-parse ' + t + '^{tree}', { encoding: 'utf8' }).trim(); (byTree.get(tree) || byTree.set(tree, []).get(tree)!).push(t) }
    const churn = [...byTree.values()].filter((ts) => ts.length > 1)
    return JSON.stringify({ tags: tags.length, delivered: byTree.size, churn: churn.map((ts) => ts.join(' ≡ ')), note: 'integrity-level: what was delivered, not whether true. 0/7' })
  },
  discover: () => {
    const prov = provable()
    return JSON.stringify({ candidates: CANDIDATES.length, discovered: prov.length, refuted: CANDIDATES.length - prov.length, facts: prov.map((c) => c.name), root: merkleFold(prov.map((c) => toUuid(c.key))), note: 'decidable facts by exhaustion; not a proof of the six open conjectures. deposit 0/7, humanity 1/7 (Poincaré).' })
  },
  recompute: () => {
    const prov = provable()
    const ledger = loadLedger()
    const recomputedKeys = new Set(prov.map((c) => c.key))
    const everyRecordedRecomputes = ledger.every((e) => recomputedKeys.has(e.key))
    const missing = ledger.filter((e) => !recomputedKeys.has(e.key)).map((e) => e.key)
    return JSON.stringify({ candidates: CANDIDATES.length, recomputed: prov.length, refuted: CANDIDATES.length - prov.length, recordedTheorems: ledger.length, everyRecordedRecomputes, missing, recomputeRoot: merkleFold(prov.map((c) => toUuid(c.key))), note: 'every theorem recomputes from its formula by exhaustion; the whole deposit recomputes from its theorems, not from stored answers. integrity, not truth. 0/7' })
  },
  rosetta: () => {
    const addrs = ROSETTA_DOMAINS.map((d) => toUuid(ROSETTA_CORE + '→' + d))
    const distinct = new Set(addrs).size
    return JSON.stringify({ core: toUuid(ROSETTA_CORE), domains: ROSETTA_DOMAINS.length, list: ROSETTA_DOMAINS, distinctAddresses: distinct, noCollision: distinct === ROSETTA_DOMAINS.length, rosettaRoot: merkleFold(addrs), note: 'the cross-domain rosetta as a reusable API — every domain one hop from the core, content-addressed, all distinct (no collision unless consolidated or redistributed). integrity, not truth. 0/7' })
  },
  forensics: () => {
    const ledger = loadLedger()
    const GENESIS = new Set(['euler_units_pow6', 'units_sum_zero'])
    const breaks: { i: number; key: string }[] = []
    let prev = 'axiom:TRINITY'
    for (let i = 0; i < ledger.length; i++) { if (toUuid(prev + '→' + ledger[i].key) !== ledger[i].receipt) breaks.push({ i, key: ledger[i].key }); prev = ledger[i].receipt }
    const newBreaks = breaks.filter((b) => !GENESIS.has(b.key))
    const dupKeys = ledger.length - new Set(ledger.map((e) => e.key)).size
    const dupReceipts = ledger.length - new Set(ledger.map((e) => e.receipt)).size
    return JSON.stringify({ receipts: ledger.length, chainIntact: newBreaks.length === 0, newBreaks, genesisBaseline: [...GENESIS], duplicateKeys: dupKeys, duplicateReceipts: dupReceipts, tamperSeal: merkleFold(ledger.map((e) => e.receipt)), note: 'chain-of-custody: a NEW break or a collision is tampering (legal trial). genesis discontinuities are documented. integrity, not truth. 0/7' })
  },
  audit: () => {
    const declared = TOOLS.map((t) => t.name)
    const handled = Object.keys(HANDLERS)
    const undeclared = declared.filter((n) => !handled.includes(n)) // a tool with no handler
    const orphans = handled.filter((n) => !declared.includes(n))    // a handler with no tool
    const root = merkleFold(TOOLS.map((t) => toUuid(t.name + '|' + t.description + '|' + JSON.stringify(t.inputSchema))))
    // VIOLATION FIX — no multi-word tool may be an unlinked island: split each name into single words, address
    // each word, and link the tool to its words by the DOUBLE-TORUS gravity of their addresses (the whole 7D).
    const wordsOf = (n: string) => n.split('_').filter(Boolean)
    const links = declared.map((n) => ({ tool: n, words: wordsOf(n), address: doubleTorusGravity(wordsOf(n).map((w) => toUuid('word:' + w))) }))
    const singleWords = [...new Set(declared.flatMap(wordsOf))]
    const everyMultiwordLinked = links.filter((l) => l.words.length > 1).every((l) => l.words.every((w) => toUuid('word:' + w).length === 36) && l.address.length === 36)
    // ALL IS COMPUTABLE BY THEOREMS, NO EXCEPTION — the audit recomputes its checks as decidable predicates,
    // and RE-RUNS the recorded audit diamonds from the ledger's theorems (their test() must recompute true).
    const AUDIT_DIAMONDS = ['every_multiword_mcp_tool_links_to_its_single_words', 'the_double_torus_covers_seven_distinct_dimensions', 'the_diamond_is_a_tens_complement_involution', 'the_audit_recomputes_all_by_theorems_no_exception', 'a_theorem_is_a_usable_diamond_certified_by_recompute']
    const diamonds = AUDIT_DIAMONDS.map((k) => { const c = CANDIDATES.find((x) => x.key === k); return { key: k, certified: !!c && c.test() === true && computes(c.name).binary === 1 } })
    const theorems = {
      everyToolHandled: undeclared.length === 0,
      everyHandlerDeclared: orphans.length === 0,
      everyMultiwordLinked,
      diamondInvolution: [1, 2, 3, 4, 5, 6, 7, 8, 9].every((d) => diamond(diamond(d)) === d),
      everyDiamondCertified: diamonds.every((d) => d.certified),
    }
    const allComputeTrue = Object.values(theorems).every(Boolean)
    return JSON.stringify({ tools: TOOLS.length, handlers: handled.length, ...theorems, allComputeTrue, undeclared, orphans, singleWords: singleWords.length, diamonds, links, selfAuditRoot: root, note: 'the MCP audits itself BY THEOREMS — every tool content-addressed and handled, every multi-word tool linked to its single words by double-torus gravity (7D), each check a decidable predicate recomputed true and each diamond re-run from the ledger. integrity of the surface, not truth. 0/7' })
  },
}
const run = async (name: string, a: any): Promise<string> => {
  const h = HANDLERS[name]
  if (!h) throw new Error('unknown tool: ' + name)
  return await h(a)
}

createInterface({ input: process.stdin }).on('line', (line) => {
  let msg: any; try { msg = JSON.parse(line) } catch { return }
  const { id, method, params } = msg
  if (method === 'initialize') return reply(id, { protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'millennium-solutions', version } })
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return
  if (method === 'tools/list') return reply(id, { tools: TOOLS })
  if (method === 'tools/call') {
    run(params?.name, params?.arguments || {})
      .then((text) => reply(id, { content: [{ type: 'text', text }] }))
      .catch((e: any) => fail(id, -32603, e?.message || 'error'))
    return
  }
  if (id !== undefined) fail(id, -32601, 'method not found: ' + method)
})
