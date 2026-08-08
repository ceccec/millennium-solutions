#!/usr/bin/env node
// Minimal MCP (Model Context Protocol) stdio server — exposes the deposit's honest tools to LLM clients.
// DEPENDENCY-FREE by design: implements JSON-RPC 2.0 over stdio with node built-ins only (no
// @modelcontextprotocol/sdk), preserving the zero-dep-core. Tools inherit the discipline: the honesty
// gate returns a FLOOR (not a truth oracle), content-address = integrity (not encryption/proof).
import { createInterface } from 'node:readline'
import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { apiFetch } from './api.ts'
import { CANDIDATES, provable } from './discover.ts'

const version = (() => { try { return execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').pop() || 'v0' } catch { return 'v0' } })()
type LedgerEntry = { key: string; name: string; receipt: string }
const loadLedger = (): LedgerEntry[] => existsSync('src/proof/discovered.json') ? JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) : []
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
  { name: 'audit', description: 'Self-audit of THIS MCP server: content-address every tool (name+description+schema), verify each declared tool has a handler and each handler is declared (coverage), fold to one self-audit root. Integrity of the tool surface, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
  { name: 'forensics', description: 'Chain-of-custody for the discovery ledger: recompute the receipt chain link-by-link (receipt[i]=toUuid(receipt[i-1]→key[i]), seed axiom:TRINITY), pinpoint any break, check for duplicate keys/receipts, and fold a tamper-evident seal. Genesis discontinuities are a documented baseline; a NEW break is tampering. Integrity/provenance of evidence, not truth.',
    inputSchema: { type: 'object', properties: {}, required: [] } },
]

const HANDLERS: Record<string, (a: any) => string | Promise<string>> = {
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
    const g = computes(t)
    return JSON.stringify({ text: t, contentAddress: toUuid(t), gate: g.binary, hit: g.hit, note: g.binary ? 'holds the floor' : 'drains: ' + g.hit })
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
    return JSON.stringify({ tools: TOOLS.length, handlers: handled.length, everyToolHandled: undeclared.length === 0, everyHandlerDeclared: orphans.length === 0, undeclared, orphans, selfAuditRoot: root, note: 'the MCP audits itself — each tool content-addressed, declared ⇔ handled. integrity of the surface, not truth.' })
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
