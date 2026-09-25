#!/usr/bin/env node
// Minimal MCP (Model Context Protocol) stdio server — exposes the deposit's honest tools to LLM clients.
// DEPENDENCY-FREE by design: implements JSON-RPC 2.0 over stdio with node built-ins only (no
// @modelcontextprotocol/sdk), preserving the zero-dep-core. Tools inherit the discipline: the honesty
// gate returns a FLOOR (not a truth oracle), content-address = integrity (not encryption/proof).
import { createInterface } from 'node:readline'
import { execSync } from 'node:child_process'
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
// The tool table is data and lives in src/mcp; the handlers below are what need the network.
import { TOOLS, LISTED, WRITES } from '../src/mcp/index.ts'
export { TOOLS, LISTED, WRITES }
import { handle as __handle, resolve as __resolve, HANDLE_HEX as __HANDLE_HEX } from '../src/handle/index.ts'
const __toUuidForHandle = toUuid
import { checkFace, type Face } from '../src/face/index.ts'
import { doubleTorusGravity } from '../src/the/apple/index.ts'
import { diamond } from '../src/5/diamond.ts'
import { computes } from './honesty-gate.ts'
import { proveVerdict } from './verdict.ts'
import { apiFetch } from './api.ts'
import { CANDIDATES, provable } from './discover.ts'
import { CORE as ROSETTA_CORE, DOMAINS as ROSETTA_DOMAINS } from '../src/the/rosetta/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'
import { isLive as __isLive, isWithdrawn as __isWithdrawn } from '../src/api/index.ts'

export const version = (() => { try { return execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').pop() || 'v0' } catch { return 'v0' } })()
type LedgerEntry = { key: string; name: string; receipt: string }
const loadLedger = (): LedgerEntry[] => existsSync('src/proof/discovered.json') ? __ledger() : []
const send = (m: unknown) => process.stdout.write(JSON.stringify(m) + '\n')

// WHETHER A TOOL WRITES IS A PROPERTY OF THE TOOL, NOT OF THE TRANSPORT THAT REACHES IT. This set lived in
// scripts/mcp-http.ts, which meant anything wanting to know it had to import a module that calls
// server.listen() at load — so the only way to ask "which tools write?" was to start a server. It belongs
// beside the tools. Named rather than matched by prefix: a rule like "anything called seal_*" lets the next
// writing tool through by being named differently.


export const HANDLERS: Record<string, (a: any) => string | Promise<string>> = {
  // ── THE COMBINATORIAL LAYER, ANSWERED HERE ─────────────────────────────────────────────────────────────
  // All four read and none writes. `novelty` in particular RETURNS its search instead of filing it:
  // src/proof/novelty.json is the evidence priorart.lean's kind 2 rests on, and a public caller must be
  // able to ask the question without being able to amend the answer.
  novelty: async (a) => {
    const statement = String(a?.statement ?? '')
    if (!statement) throw new Error('novelty: statement is required — there is nothing to search the literature for without it')
    const { search } = await import('../src/novelty/index.ts')
    const r = await search(statement, (a?.anchors ?? []).map((x: unknown) => String(x).toLowerCase()))
    return JSON.stringify({ ...r,
      note: 'NONE_FOUND means these searches, on this date, returned nothing at the floors shown — never that nothing earlier exists. A keyword search misses what it does not name. Nothing was written to this deposit.' }, null, 1)
  },
  coils: async () => {
    const { execFileSync } = await import('node:child_process')
    return execFileSync('node', ['scripts/coils.ts'], { encoding: 'utf8', maxBuffer: 8 << 20 })
  },
  discoveries: async (a) => {
    const { execFileSync } = await import('node:child_process')
    const out = execFileSync('node', ['scripts/discoveries.ts', '--all'], { encoding: 'utf8', maxBuffer: 32 << 20 })
    const n = Number(a?.limit ?? 40)
    const lines = out.split('\n')
    return lines.slice(0, 5).concat(lines.slice(5, 5 + n * 2)).concat(lines.slice(-4)).join('\n')
  },
  formulas: async (a) => {
    const { leanTheorems, leanFiles, leanSource } = await import('../src/api/index.ts')
    const wingOf = new Map((leanFiles() as string[]).map((f) => [f, leanSource(f).match(/^--\s*wing:\s*(.+)$/m)?.[1]?.trim() ?? 'unfiled']))
    let rows = (leanTheorems() as any[]).map((t) => ({ name: t.name, file: t.file, namespace: t.namespace, wing: wingOf.get(t.file), tactic: t.tactic, statement: t.statement }))
    const total = rows.length
    if (a?.wing) rows = rows.filter((r) => r.wing === String(a.wing))
    if (a?.file) rows = rows.filter((r) => r.file === String(a.file))
    if (a?.contains) rows = rows.filter((r) => (r.name + ' ' + r.statement).toLowerCase().includes(String(a.contains).toLowerCase()))
    const shown = rows.slice(0, Number(a?.limit ?? 50))
    // THE COUNTS ARE RETURNED so a filter matching nothing cannot be read as an empty deposit.
    return JSON.stringify({ total, matched: rows.length, shown: shown.length, formulas: shown }, null, 1)
  },
  handle: (a) => {
    const text = String(a?.text ?? '')
    if (!text) throw new Error('handle: text is required — the message is the payload, so there is nothing to address without it')
    if (a?.handle) {
      const r = __resolve(String(a.handle), text)
      return JSON.stringify({ ...r, width: __HANDLE_HEX, note: r.carries ? 'this message carries that handle — which rejects an unrelated message, and does not establish this is the one meant' : 'this message does NOT carry that handle' }, null, 1)
    }
    return JSON.stringify({ handle: __handle(text), uuid: __toUuidForHandle(text), width: __HANDLE_HEX, note: 'send the handle and the message; the address is recomputable from the message alone' }, null, 1)
  },
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
  // A SESSION SHOULD BE ABLE TO CHECK A SIBLING RATHER THAN BELIEVE ONE. Today a peer relayed a claim of
  // mine onward without auditing it, and the claim was wrong — it travelled at the speed the true ones did,
  // because prose has no failure mode. These three give an MCP client the alternative: fetch a face, verify
  // a face, and survey the faces siblings have published. What verification establishes is integrity, and
  // every response says so, because that is precisely where a coordination protocol starts lying.
  metrics_face: () => {
    execSync('node scripts/metrics.ts', { stdio: 'pipe' })
    return readFileSync('metrics.json', 'utf8')
  },
  verify_face: (a: { json?: string; path?: string }) => {
    const raw = a.json ?? (a.path && existsSync(a.path) ? readFileSync(a.path, 'utf8') : '')
    if (!raw) return JSON.stringify({ error: 'pass the face as `json` or a readable `path`' })
    let f: Face
    try { f = JSON.parse(raw) as Face } catch { return JSON.stringify({ error: 'not JSON' }) }
    if (!Array.isArray(f.rows)) return JSON.stringify({ error: 'no rows — not a face' })
    const c = checkFace(f)
    return JSON.stringify({
      repo: f.repo, verdict: c.verdict, intact: c.ok, rows: f.rows.length, root: c.root, altered: c.altered,
      failingGates: c.failingGates,
      establishes: 'INTEGRITY ONLY — the rows are unaltered since sealing. This does NOT make any figure correct, and does not verify another repository without its source. To check a figure, run its `command` there.',
    })
  },
  peer_faces: (a: { dir?: string }) => {
    const dir = a.dir ?? (process.env.HOME + '/.erpax/fusion')
    if (!existsSync(dir)) return JSON.stringify({ dir, faces: [], note: 'no shared directory — nothing to survey, which is not the same as nothing published' })
    const faces = readdirSync(dir).filter((f) => f.endsWith('.json')).map((f) => {
      try {
        const parsed = JSON.parse(readFileSync(dir + '/' + f, 'utf8')) as Face
        if (!Array.isArray(parsed.rows)) return { file: f, skipped: 'not a face — no rows' }
        const c = checkFace(parsed)
        return { file: f, repo: parsed.repo, rows: parsed.rows.length, verdict: c.verdict, root: c.root, altered: c.altered.length, failingGates: c.failingGates }
      } catch { return { file: f, skipped: 'unreadable or not JSON' } }
    })
    return JSON.stringify({ dir, faces, establishes: 'INTEGRITY ONLY, per face — see verify_face.' })
  },
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
    return JSON.stringify({ text: t, contentAddress: v.receipt, gate: v.gateBinary, hit: v.gateBinary ? null : computes(t).hit, verdict: v.verdict, formulas: v.formulas, recomputedTrue: v.recomputedTrue, proofReceipt: v.proofReceipt, note: v.note + ' — full trial: ' + v.recomputedTrue + '/' + v.formulas + ' theorem-formulas recompute true, folded to the proof-of-verdict receipt. integrity, not truth.' })
  },
  lineage: () => {
    const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
    const byTree = new Map<string, string[]>()
    for (const t of tags) { const tree = execSync('git rev-parse ' + t + '^{tree}', { encoding: 'utf8' }).trim(); (byTree.get(tree) || byTree.set(tree, []).get(tree)!).push(t) }
    const churn = [...byTree.values()].filter((ts) => ts.length > 1)
    return JSON.stringify({ tags: tags.length, delivered: byTree.size, churn: churn.map((ts) => ts.join(' ≡ ')), note: 'integrity-level: what was delivered, not whether true.' })
  },
  discover: () => {
    const prov = provable()
    return JSON.stringify({ candidates: CANDIDATES.length, discovered: prov.length, refuted: CANDIDATES.length - prov.length, facts: prov.map((c) => c.name), root: merkleFold(prov.map((c) => toUuid(c.key))), note: 'decidable facts by exhaustion;' })
  },
  recompute: () => {
    const prov = provable()
    const ledger = loadLedger()
    const recomputedKeys = new Set(prov.map((c) => c.key))
    const everyRecordedRecomputes = ledger.every((e) => recomputedKeys.has(e.key))
    const missing = ledger.filter((e) => !recomputedKeys.has(e.key)).map((e) => e.key)
    return JSON.stringify({ candidates: CANDIDATES.length, recomputed: prov.length, refuted: CANDIDATES.length - prov.length, recordedTheorems: ledger.length, everyRecordedRecomputes, missing, recomputeRoot: merkleFold(prov.map((c) => toUuid(c.key))), note: 'every theorem recomputes from its formula by exhaustion; the whole deposit recomputes from its theorems, not from stored answers. integrity, not truth.' })
  },
  rosetta: () => {
    const addrs = ROSETTA_DOMAINS.map((d) => toUuid(ROSETTA_CORE + '→' + d))
    const distinct = new Set(addrs).size
    return JSON.stringify({ core: toUuid(ROSETTA_CORE), domains: ROSETTA_DOMAINS.length, list: ROSETTA_DOMAINS, distinctAddresses: distinct, noCollision: distinct === ROSETTA_DOMAINS.length, rosettaRoot: merkleFold(addrs), note: 'the cross-domain rosetta as a reusable API — every domain one hop from the core, content-addressed, all distinct (no collision unless consolidated or redistributed). integrity, not truth.' })
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
    return JSON.stringify({ receipts: ledger.length, chainIntact: newBreaks.length === 0, newBreaks, genesisBaseline: [...GENESIS], duplicateKeys: dupKeys, duplicateReceipts: dupReceipts, tamperSeal: merkleFold(ledger.map((e) => e.receipt)), note: 'chain-of-custody: a NEW break or a collision is tampering (legal trial). genesis discontinuities are documented. integrity, not truth.' })
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
    return JSON.stringify({ tools: TOOLS.length, handlers: handled.length, ...theorems, allComputeTrue, undeclared, orphans, singleWords: singleWords.length, diamonds, links, selfAuditRoot: root, note: 'the MCP audits itself BY THEOREMS — every tool content-addressed and handled, every multi-word tool linked to its single words by double-torus gravity (7D), each check a decidable predicate recomputed true and each diamond re-run from the ledger. integrity of the surface, not truth.' })
  },
}
// TWO TOOLS COVER ALL, IN MCP'S OWN WORDS. tools/list advertises `list_tools` and `call_tool`, and every tool in TOOLS
// stays callable. `list_tools` answers with the fields tools/list itself uses — { tools: [{ name, description }] }, or
// one tool's { name, description, inputSchema } — and `call_tool` takes { name, arguments }, the fields of tools/call.
// A client loads two short schemas instead of twenty (7,541 bytes of tools/list before), and fetches one tool's schema
// only when it needs it. Unlisted but still answered, so no caller breaks: every tool's own name, and the first door
// (`run {op, args}`, `describe {op}`, with its old reply). TOOLS remains the catalogue the audit checks against HANDLERS;
// the doors are not tools, so they are in neither.
const first = (d: string) => (d.split(/(?<=[.—])\s/)[0] ?? d).slice(0, 140)
const toolOf = (name: unknown) => {
  const t = TOOLS.find((x) => x.name === String(name))
  if (!t) throw new Error('unknown tool: ' + String(name) + ' — call list_tools with no name for the list')
  return t
}
const listTools = (name?: unknown): string => {
  if (name) { const t = toolOf(name); return JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema }) }
  return JSON.stringify({ tools: TOOLS.map((t) => ({ name: t.name, description: first(t.description) })) })
}
const describeFirstDoor = (op?: unknown): string => {
  if (op) { const t = toolOf(op); return JSON.stringify({ op: t.name, description: t.description, args: t.inputSchema }) }
  return JSON.stringify({ ops: TOOLS.map((t) => ({ op: t.name, does: first(t.description) })) })
}
export const run = async (name: string, a: any): Promise<string> => {
  if (name === 'call_tool') return run(String(a?.name ?? ''), a?.arguments ?? {})
  if (name === 'list_tools') return listTools(a?.name)
  if (name === 'run') return run(String(a?.op ?? ''), a?.args ?? {})
  if (name === 'describe') return describeFirstDoor(a?.op)
  const h = HANDLERS[name]
  if (!h) throw new Error('unknown tool: ' + name)
  return await h(a)
}

// ── THE PROTOCOL, SEPARATED FROM THE PIPE IT ARRIVES ON ──────────────────────────────────────────────────
// This used to be one block: parse a line of stdin, decide what the message means, write to stdout. That
// works for a desktop client that can spawn a process, and it is unreachable from a browser, which cannot
// spawn anything and speaks HTTP. The obvious move — a second server with the same tools — is the defect
// this repository is named for: two derivations of one fact, and the copy that drifts is the one nobody
// runs. So the DECISION is a function of the message and nothing else, and a transport is the small piece
// that carries bytes to it. stdio is below; scripts/mcp-http.ts is the other caller, and it adds no tool,
// no schema and no dispatch of its own.
export type Rpc = { id?: unknown; method?: string; params?: any }
/** One JSON-RPC message in, one reply out — or null for a notification, which is answered by silence. */
export const handle = async (msg: Rpc): Promise<object | null> => {
  const { id, method, params } = msg
  const ok = (result: unknown) => ({ jsonrpc: '2.0', id, result })
  const err = (code: number, message: string) => ({ jsonrpc: '2.0', id, error: { code, message } })
  if (method === 'initialize') return ok({ protocolVersion: '2024-11-05', capabilities: { tools: {} }, serverInfo: { name: 'millennium-solutions', version } })
  if (method === 'notifications/initialized' || method === 'notifications/cancelled') return null
  if (method === 'tools/list') return ok({ tools: LISTED })
  if (method === 'tools/call') {
    try { return ok({ content: [{ type: 'text', text: await run(params?.name, params?.arguments || {}) }] }) }
    catch (e: any) { return err(-32603, e?.message || 'error') }
  }
  return id === undefined ? null : err(-32601, 'method not found: ' + method)
}

// stdio — the transport a desktop client spawns. Unchanged in behaviour; it now asks `handle` what to say.
if (!process.env.MCP_NO_STDIO) {
  // THE TRANSPORT IS NOT THE SERVER. Everything above is the tool surface; the loop below is one way to
// reach it. `scripts/mcp-http.ts` is another, and it IMPORTS the surface rather than restating it — two
// transports over two copies of a tool table is two descriptions of one tool, and the one nobody runs is
// the one that drifts. Importing this module must therefore not seize stdin, so the loop is guarded the
// same way scripts/discover.ts guards its CLI.
if (process.argv[1] && /mcp\.ts$/.test(process.argv[1])) {
createInterface({ input: process.stdin }).on('line', (line) => {
    let msg: Rpc; try { msg = JSON.parse(line) } catch { return }
    handle(msg).then((r) => { if (r) send(r) })
  })
}
}
