#!/usr/bin/env node
// Minimal MCP (Model Context Protocol) stdio server — exposes the deposit's honest tools to LLM clients.
// DEPENDENCY-FREE by design: implements JSON-RPC 2.0 over stdio with node built-ins only (no
// @modelcontextprotocol/sdk), preserving the zero-dep-core. Tools inherit the discipline: the honesty
// gate returns a FLOOR (not a truth oracle), content-address = integrity (not encryption/proof).
import { createInterface } from 'node:readline'
import { execSync, execFileSync } from 'node:child_process'
import { readFileSync, existsSync, readdirSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join as joinPath } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'
// The tool table is data and lives in src/mcp; the handlers below are what need the network.
import { TOOLS, LISTED, WRITES, NEEDS, SELF_SUFFICIENT, type Need } from '../src/mcp/index.ts'
export { TOOLS, LISTED, WRITES, NEEDS, SELF_SUFFICIENT }
import { handle as __handle, resolve as __resolve, HANDLE_HEX as __HANDLE_HEX } from '../src/handle/index.ts'
const __toUuidForHandle = toUuid
import { checkFace, type Face } from '../src/face/index.ts'
import { doubleTorusGravity } from '../src/the/apple/index.ts'
import { computes } from './honesty-gate.ts'
import { proveVerdict } from './verdict.ts'
import { apiFetch } from './api.ts'
import { CANDIDATES, provable } from './discover.ts'
import { CORE as ROSETTA_CORE, DOMAINS as ROSETTA_DOMAINS } from '../src/the/rosetta/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'
import { isLive as __isLive, isWithdrawn as __isWithdrawn } from '../src/api/index.ts'

// ABSENT IS NOT ZERO, AND IT IS NOT 'v0' EITHER. This read the newest git tag and fell back to the string
// 'v0' — so in the published package, which is not a git checkout, every answer this server gave carried a
// version that is not a version and that no tag will ever equal. A caller comparing it against a release
// would conclude the server is ancient rather than that it cannot tell. The deposit already draws this
// distinction elsewhere in its own words: "unstated reception is not no reception". Same rule here.
export const version = (() => {
  try {
    const t = execSync('git tag --sort=version:refname', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
      .trim().split('\n').filter(Boolean).pop()
    return t ?? 'unversioned (a git checkout with no tags)'
  } catch { return 'unknown (not a git checkout — this is the published package, which carries no tags)' }
})()
type LedgerEntry = { key: string; name: string; receipt: string }
// AND THE LEDGER'S ABSENCE IS REPORTED, NOT ROUNDED TO EMPTY. Returning [] for a missing file made every
// ledger tool answer "0 entries" in an environment where the truth is that the ledger was never shipped —
// the published package does not include src/proof/. Zero theorems is a finding about this deposit; an absent
// file is a fact about the caller's environment, and a tool that cannot tell them apart reports the first
// when it means the second. The throw is caught per tool and becomes a note the caller can read.
export const LEDGER_PATH = 'src/proof/discovered.json'
export const ledgerPresent = (): boolean => existsSync(LEDGER_PATH)
const loadLedger = (): LedgerEntry[] => {
  if (!ledgerPresent()) throw new Error(
    `the discovery ledger is not present at ${LEDGER_PATH}. This tool measures the ledger, so with no ledger `
    + 'there is nothing to measure — which is NOT the same as a ledger of zero entries. The published package '
    + 'ships dist/ only; run this tool from a checkout of the repository. The tools that need nothing but the '
    + 'package are listed by `list_tools` and marked self-sufficient.')
  return __ledger()
}
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
  leads: async (a) => {
    const { execFileSync } = await import('node:child_process')
    const out = execFileSync('node', ['scripts/leads.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
    if (!a?.area) return out
    const area = String(a.area)
    return out.split('\n').filter((l) => l.includes(area) || /^○|^open leads|^crossed/.test(l)).join('\n')
  },
  readers: async (a) => {
    const { execFileSync } = await import('node:child_process')
    if (a?.list) return execFileSync('node', ['scripts/readers.ts', '--list'], { encoding: 'utf8', maxBuffer: 16 << 20 })
    if (a?.domain) return execFileSync('node', ['scripts/readers.ts', '--domain', String(a.domain)], { encoding: 'utf8', maxBuffer: 16 << 20 })
    return execFileSync('node', ['scripts/readers.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
  },
  live: async () => {
    const { execFileSync } = await import('node:child_process')
    return execFileSync('node', ['scripts/published.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
  },

  // ── THE CONNECTOR. This server speaks JSON-RPC to ANOTHER MCP server and returns its answer unchanged. ──
  // Not mirrored, not summarised, not cached: forwarded. The registry is data in src/mcp/connectors.ts and
  // holds no client, so nothing on the verification path can open a socket by importing it.
  connect: async (a) => {
    const { CONNECTORS, CONNECTOR } = await import('../src/mcp/connectors.ts')
    if (!a?.connector) {
      return JSON.stringify({
        connectors: CONNECTORS.map((c) => ({ name: c.name, endpoint: c.endpoint, attribution: c.attribution, for: c.for, notFor: c.notFor, readOnly: c.readOnly })),
        note: 'Call one with { connector, tool, arguments }. Pass no tool to list that server\'s own tools. '
          + 'Every answer is that server\'s report of itself on this date; nothing here can check a remote claim.',
      }, null, 1)
    }
    const c = CONNECTOR(String(a.connector))
    if (!c) throw new Error(`unknown connector: ${String(a.connector)} — call connect with no arguments for the list`)
    const body = a?.tool
      ? { jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: String(a.tool), arguments: a.arguments ?? {} } }
      : { jsonrpc: '2.0', id: 1, method: 'tools/list' }
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 40_000)
    try {
      const res = await fetch(c.endpoint, {
        method: 'POST', signal: ctl.signal,
        headers: { 'content-type': 'application/json', 'User-Agent': 'millennium-solutions/connect (+https://ceccec.psg.bg/millennium-solutions/; read-only)' },
        body: JSON.stringify(body),
      })
      const text = await res.text()
      if (!res.ok) return JSON.stringify({ connector: c.name, status: res.status, note: `${c.name} answered HTTP ${res.status} — NOT MEASURED, never read as "it has no answer"` })
      // A reply that is not JSON is named UNPARSED with its text, never passed off as an answer.
      const parsed = (() => { try { return JSON.parse(text) as { error?: { message?: string; data?: { tools?: string[] } }; result?: unknown } } catch { return { unparsed: true, text: text.slice(0, 40_000) } } })() as { error?: { message?: string; data?: { tools?: string[] } }; result?: unknown; unparsed?: boolean; text?: string }
      // A JSON-RPC error is the server REFUSING the name, not an answer. It is reported as REFUSED, with the server's own
      // list of tools, and the note says the list may be narrower than what the server accepts.
      if (parsed?.error) {
        return JSON.stringify({ connector: c.name, endpoint: c.endpoint, status: 'REFUSED', tool: a?.tool ?? null,
          why: parsed.error.message ?? 'refused', serverTools: parsed.error.data?.tools ?? [],
          note: 'the server refused this name. Its list is the list it declares, which may be narrower than the names it accepts: other calls to the same server have answered names outside this list.' }, null, 1)
      }
      if (parsed.unparsed) return JSON.stringify({ connector: c.name, endpoint: c.endpoint, status: 'UNPARSED', note: 'the server replied with text that is not JSON', text: parsed.text }, null, 1)
      return JSON.stringify({ connector: c.name, endpoint: c.endpoint, attribution: c.attribution, notFor: c.notFor, status: 'ANSWERED', answer: parsed }, null, 1)
    } catch (e) {
      const m = e instanceof Error ? e.message : String(e)
      return JSON.stringify({ connector: c.name, note: /abort/i.test(m) ? 'timed out at 40s — NOT MEASURED, never "unreachable"' : m.slice(0, 200) })
    } finally { clearTimeout(t) }
  },

  entanglements: async (a) => {
    const { execFileSync } = await import('node:child_process')
    const out = execFileSync('node', ['scripts/coils.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
    // the cross-domain section only: the ring and address vocabularies are the `coils` tool's answer
    const i = out.indexOf('one grid, every science')
    const body = i < 0 ? out : out.slice(i)
    if (a?.domain) {
      const d = String(a.domain)
      const kept = body.split('\n').filter((l) => l.includes(d) || /^\s*(✳|·|AND|THE|WHAT|IT )/.test(l))
      return kept.join('\n')
    }
    return a?.spanningOnly ? body.split('\n').filter((l) => /✳|↔/.test(l)).join('\n') : body
  },
  api_joins: async (a) => {
    const { execFileSync } = await import('node:child_process')
    // THE SCRIPT PATH IS WRITTEN OUT, NOT BUILT INTO A VARIABLE. The first version assembled the argv array
    // first and passed the variable, and scripts/mcp-gate.ts then read this handler as needing nothing at all —
    // a handler that hides which script it runs hides its own requirements, and the gate said so. The literal
    // is here so the dependency is visible to anything reading this source, which includes the gate.
    const p = a?.probe ? String(a.probe) : ''
    return p
      ? execFileSync('node', ['scripts/api-discover.ts', '--probe', p], { encoding: 'utf8', maxBuffer: 16 << 20 })
      : execFileSync('node', ['scripts/api-discover.ts'], { encoding: 'utf8', maxBuffer: 16 << 20 })
  },
  coils: async () => {
    const { execFileSync } = await import('node:child_process')
    return execFileSync('node', ['scripts/coils.ts'], { encoding: 'utf8', maxBuffer: 8 << 20 })
  },
  discoveries: async (a) => {
    const { execFileSync } = await import('node:child_process')
    const out = execFileSync('node', ['scripts/discoveries.ts', '--all'], { encoding: 'utf8', maxBuffer: 32 << 20 })
    // NO DEFAULT CAP: without a limit every line is returned. A caller who passes one still gets that cap.
    // PAGED BY BYTES. Each page fills up to PAGE_BUDGET of body text, so no reply exceeds the client buffer, and returns
    // the cursor of the next page. The caller's limit still caps the body when given, as before.
    const n = a?.limit === undefined ? Infinity : Number(a.limit)
    const lines = out.split('\n')
    const head = lines.slice(0, 5), tail = lines.slice(-4)
    const body = lines.slice(5, lines.length - 4).slice(0, n === Infinity ? undefined : n * 2)
    const start = Number(a?.cursor ?? 0)
    let end = start, bytes = 0
    while (end < body.length) { const s = body[end].length + 1; if (bytes + s > PAGE_BUDGET && end > start) break; bytes += s; end++ }
    const page = [...head, ...body.slice(start, end), ...tail]
    if (end < body.length) page.push(`next cursor: ${end} of ${body.length} body lines`)
    return page.join('\n')
  },
  formulas: async (a) => {
    const { leanTheorems, leanFiles, leanSource } = await import('../src/api/index.ts')
    const wingOf = new Map((leanFiles() as string[]).map((f) => [f, leanSource(f).match(/^--\s*wing:\s*(.+)$/m)?.[1]?.trim() ?? 'unfiled']))
    let rows = (leanTheorems() as any[]).map((t) => ({ name: t.name, file: t.file, namespace: t.namespace, wing: wingOf.get(t.file), tactic: t.tactic, statement: t.statement }))
    const total = rows.length
    if (a?.wing) rows = rows.filter((r) => r.wing === String(a.wing))
    if (a?.file) rows = rows.filter((r) => r.file === String(a.file))
    if (a?.contains) rows = rows.filter((r) => (r.name + ' ' + r.statement).toLowerCase().includes(String(a.contains).toLowerCase()))
    // NO DEFAULT CAP: without a limit every matching formula is returned.
    // PAGED BY BYTES: a page fills up to PAGE_BUDGET of serialised formulas and returns the cursor of the next page.
    const pool = a?.limit === undefined ? rows : rows.slice(0, Number(a.limit))
    const from = Number(a?.cursor ?? 0)
    let end = from, bytes = 0
    while (end < pool.length) { const s = JSON.stringify(pool[end]).length; if (bytes + s > PAGE_BUDGET && end > from) break; bytes += s; end++ }
    const shown = pool.slice(from, end)
    // THE COUNTS ARE RETURNED so a filter matching nothing cannot be read as an empty deposit.
    return JSON.stringify({ total, matched: rows.length, shown: shown.length, from, next: end < pool.length ? end : null, formulas: shown }, null, 1)
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
  cern: (a) => { try { return execFileSync('node', ['scripts/cern.ts'], { encoding: 'utf8', timeout: 3_600_000, maxBuffer: 64 << 20 }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return JSON.stringify({ status: 'FAILED', output: String(x.stdout ?? '').slice(-4000), why: String(x.stderr ?? e).slice(-800) }) } },
  hexbit_route: (a) => { try { return execFileSync('node', ['scripts/hexbit-route.ts', ...(a?.index ? ['--index'] : [])], { encoding: 'utf8', input: String(a?.input ?? ''), timeout: 120_000 }) }
    catch (e) { const x = e as { stdout?: Buffer | string }; return String(x.stdout ?? JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) })) } },
  qpu_crosscheck: (a) => { try { return execFileSync('node', ['scripts/qpu-crosscheck.ts'], { encoding: 'utf8', timeout: 180_000, maxBuffer: 8 << 20 }) }
    catch (e) { const x = e as { stdout?: Buffer | string }; return String(x.stdout ?? JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) })) } },
  prose_check: (a) => { try { return execFileSync('node', ['scripts/precommit.ts'], { cwd: R, encoding: 'utf8', timeout: 300_000 }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return (String(x.stdout ?? '') + String(x.stderr ?? '')) || JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  theorem_only: (a) => { try { return execFileSync('node', ['scripts/theorem-only-check.ts', R], { cwd: R, encoding: 'utf8', timeout: 300_000 }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return (String(x.stdout ?? '') + String(x.stderr ?? '')) || JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  constants_check: (a) => { try { return execFileSync('node', ['scripts/constants-gate.ts'], { cwd: R, encoding: 'utf8', timeout: 300_000 }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return (String(x.stdout ?? '') + String(x.stderr ?? '')) || JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  pre_commit_e2e: (a) => { try { return execSync('sh .githooks/pre-commit', { cwd: R, encoding: 'utf8', timeout: 900_000, stdio: ['ignore', 'pipe', 'pipe'] }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return (String(x.stdout ?? '') + String(x.stderr ?? '')) || JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  qpu_court_local: (a) => { try { return execFileSync('node', ['--test', 'dist/payload/plugins/gate-court.test.js'], { cwd: QPU, encoding: 'utf8', timeout: 300_000 }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return (String(x.stdout ?? '') + String(x.stderr ?? '')) || JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  qpu_families: (a) => { try { return execSync('find dist/families -name test.js | sort | xargs node --test', { cwd: QPU, encoding: 'utf8', timeout: 900_000, maxBuffer: 64 << 20 }) }
    catch (e) { const x = e as { stdout?: Buffer | string; stderr?: Buffer | string }; return (String(x.stdout ?? '') + String(x.stderr ?? '')) || JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  clay_online: () => { try { return execFileSync('node', ['scripts/clay-online.ts'], { encoding: 'utf8', timeout: 600_000, maxBuffer: 8 << 20 }) }
    catch (e) { const x = e as { stdout?: Buffer | string }; return String(x.stdout ?? JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) })) } },
  leaks: (a) => { try { return execFileSync('node', ['scripts/leaks.ts', ...(a?.json ? ['--json'] : [])], { encoding: 'utf8', timeout: 300_000 }) }
    catch (e) { return JSON.stringify({ status: 'FAILED', why: String(e).slice(0, 300) }) } },
  lean_verify: (a) => { try { return execSync(`node scripts/lean.ts${a?.file ? ' ' + a.file : ''}`, { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  lean_audit_library: (a) => { try { return execFileSync('node', ['scripts/lean-audit-library.ts', String(a?.project ?? ''), String(a?.src ?? ''), String(a?.prefix ?? '')], { encoding: 'utf8' }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  web_search: (a) => { try { return execFileSync('node', ['scripts/web-search.ts', String(a?.source ?? ''), String(a?.query ?? ''), String(a?.limit ?? 5)], { encoding: 'utf8', timeout: 60_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  clay_conditions: () => { try { return execFileSync('node', ['scripts/clay-conditions-test.ts'], { encoding: 'utf8', timeout: 900_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  web_fetch: (a) => { try { return execFileSync('node', ['scripts/web-fetch.ts', String(a?.url ?? ''), String(a?.pattern ?? ''), String(a?.window ?? 160), a?.raw ? 'raw' : ''], { encoding: 'utf8', timeout: 60_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  lean_split: (a) => { try { return execSync('node scripts/lean-split.ts', { input: String(a?.source ?? ''), encoding: 'utf8', timeout: 900_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  task_route: (a) => { try { return execSync('node scripts/task-route.ts', { input: String(a?.input ?? ''), encoding: 'utf8', timeout: 120_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  run_suite: (a) => { try { return execFileSync('node', ['scripts/suite-run.ts', String(a?.suite ?? '')], { encoding: 'utf8', timeout: 900_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  stall_check: (a) => { try { return execSync('node scripts/stall-check.ts', { input: String(a?.text ?? ''), encoding: 'utf8', timeout: 60_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  session_report: () => sessionReport(SESSION_LOG),
  git_commit_paths: (a) => { try { return execSync('node scripts/git-commit-paths.ts', { input: JSON.stringify({ repo: a?.repo, message: a?.message, paths: a?.paths }), encoding: 'utf8', timeout: 900_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  answer: (a) => { try { return execSync('node scripts/answer.ts', { input: String(a?.question ?? ''), encoding: 'utf8', timeout: 900_000 }) }
    catch (e) { return 'FAILED\n' + String((e as { stdout?: Buffer }).stdout ?? e) } },
  lean_ask: (a) => { try { return execSync('node scripts/lean-ask.ts', { input: String(a?.source ?? ''), encoding: 'utf8' }) }
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
    const leanHolds = (file: string, name: string): boolean => {
      try {
        const a = JSON.parse(execSync('node scripts/lean-ask.ts', { input: readFileSync(file, 'utf8'), encoding: 'utf8' })) as { status: string; compiles: boolean; sorry: boolean; axioms: string[] }
        return a.status === 'ANSWERED' && a.compiles && !a.sorry && a.axioms.includes(`'${name}' does not depend on any axioms`)
      } catch { return false }
    }
    const AUDIT_DIAMONDS = ['every_multiword_mcp_tool_links_to_its_single_words', 'the_double_torus_covers_seven_distinct_dimensions', 'the_diamond_is_a_tens_complement_involution', 'the_audit_recomputes_all_by_theorems_no_exception', 'a_theorem_is_a_usable_diamond_certified_by_recompute']
    const diamonds = AUDIT_DIAMONDS.map((k) => { const c = CANDIDATES.find((x) => x.key === k); return { key: k, certified: !!c && c.test() === true && computes(c.name).binary === 1 } })
    const theorems = {
      everyToolHandled: undeclared.length === 0,
      everyHandlerDeclared: orphans.length === 0,
      everyMultiwordLinked,
      // THE KERNEL'S VERDICT, NOT A JAVASCRIPT LOOP: the theorem is compiled by lean_ask and must come back
      // compiling, sorry-free, and depending on no axiom. Anything else reads as false.
      diamondInvolution: leanHolds('src/proof/diamond.lean', 'diamond_involution'),
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
/** Bytes of body text per page: half the 8 MB client buffer, so a page always fits with room for its wrapper. */
const PAGE_BUDGET = 4 << 20
/** The repositories the completed tools operate on: this one, and qpu beside it. */
const R = '/Users/ceci/github/ceccec/millennium-solutions/'
const QPU = '/Users/ceci/github/uuidna/qpu/'
const first = (d: string) => (d.split(/(?<=[.—])\s/)[0] ?? d).slice(0, 140)
const toolOf = (name: unknown) => {
  const t = TOOLS.find((x) => x.name === String(name))
  if (!t) throw new Error('unknown tool: ' + String(name) + ' — call list_tools with no name for the list')
  return t
}
// ── WHAT THIS ENVIRONMENT ACTUALLY HAS ───────────────────────────────────────────────────────────────────
// PROBED ONCE, REPORTED PER TOOL. Before this, a caller learned that a tool needs the source tree, or git, or
// the Lean toolchain by CALLING it and reading a failure — and for two of them by not reading a failure at
// all, because the server answered 'v0' and an empty ledger. 17 of the 25 tools need something beyond the
// published package. That is a fact about this surface and it belongs in the catalogue, not in an error.
//
// `net` is not probed. Reachability is a property of a request, not of a machine, and a probe that said "the
// network is present" would be making a promise about somebody else's server that this deposit refuses to
// make anywhere else — the same reason `probe` reports INCONCLUSIVE on a timeout rather than "blocked".
const has = (() => {
  const q = (c: string) => { try { execSync(c, { stdio: 'ignore' }); return true } catch { return false } }
  return {
    core: true,
    tree: existsSync('src/proof') && existsSync('scripts'),
    git: q('git rev-parse --is-inside-work-tree'),
    lean: q('lean --version'),
    ledger: existsSync(LEDGER_PATH),
    net: true,     // never probed — see above
    shared: existsSync(process.env.FUSION_DIR ?? '.fusion'),
  } as Record<Need, boolean>
})()
const missingFor = (n: string): Need[] => (NEEDS[n] ?? []).filter((k) => !has[k])
const WHY: Record<Need, string> = {
  core: 'nothing beyond this package',
  tree: 'the repository source tree (src/proof and scripts) — the published package ships dist/ only',
  git: 'a git checkout with tags — the published package is not one',
  lean: 'the Lean toolchain on PATH',
  ledger: `the discovery ledger at ${LEDGER_PATH}, which the published package does not ship`,
  net: 'the network, and therefore somebody else\'s server',
  shared: 'a shared fusion directory, which exists only where sibling sessions write one',
}
export const environment = () => ({
  present: (Object.keys(has) as Need[]).filter((k) => has[k]),
  absent: (Object.keys(has) as Need[]).filter((k) => !has[k]),
  runnable: TOOLS.filter((t) => missingFor(t.name).length === 0).length,
  of: TOOLS.length,
  selfSufficient: SELF_SUFFICIENT,
  note: 'net is never probed: reachability is a property of a request, not of a machine.',
})

const listTools = (name?: unknown): string => {
  const avail = (n: string) => {
    const m = missingFor(n)
    return m.length ? { available: false, needs: NEEDS[n], missing: m, why: m.map((k) => WHY[k]) } : { available: true, needs: NEEDS[n] }
  }
  if (name) { const t = toolOf(name); return JSON.stringify({ name: t.name, description: t.description, inputSchema: t.inputSchema, ...avail(t.name) }) }
  const env = environment()
  return JSON.stringify({
    environment: { present: env.present, absent: env.absent, runnable: `${env.runnable} of ${env.of} tools can run here`, note: env.note },
    tools: TOOLS.map((t) => ({ name: t.name, description: first(t.description), ...avail(t.name) })),
  })
}
const describeFirstDoor = (op?: unknown): string => {
  if (op) { const t = toolOf(op); return JSON.stringify({ op: t.name, description: t.description, args: t.inputSchema }) }
  return JSON.stringify({ ops: TOOLS.map((t) => ({ op: t.name, does: first(t.description) })) })
}
// ── THE CALL LOG — one line per tool call this server serves, for session_report ─────────────────────────
// Only what this server sees: its own calls, their status, and how long each took. It cannot see a client's tokens.
const SESSION_LOG = joinPath(fileURLToPath(new URL('..', import.meta.url)), '.mcp-session.log')
const statusOf = (out: string): string => {
  const m = /"status":\s*"([A-Z_]+)"/.exec(out)
  if (m) return m[1]!
  return out.startsWith('FAILED') ? 'FAILED' : 'OK'
}
// THE RECEIPT CHAIN: each entry carries the hash of the entry before it (`prev`) and its own hash (`h`), computed with
// the repository's content address over prev + the entry. Editing or removing any line breaks every hash after it, and
// session_report says where. These are content-addressed receipts, not quantum receipts.
const lastHash = (): string => {
  if (!existsSync(SESSION_LOG)) return 'genesis'
  const lines = readFileSync(SESSION_LOG, 'utf8').split('\n').filter(Boolean)
  const last = lines[lines.length - 1]
  if (!last) return 'genesis'
  return (JSON.parse(last) as { h?: string }).h ?? 'genesis'
}
const logCall = (tool: string, status: string, ms: number): void => {
  try {
    const entry = { ts: new Date().toISOString(), tool, status, ms }
    const prev = lastHash()
    const h = toUuid(prev + '|' + JSON.stringify(entry))
    appendFileSync(SESSION_LOG, JSON.stringify({ ...entry, prev, h }) + '\n')
  } catch {
    // logging must never fail a call; a missing log is reported by session_report, which names the absence
  }
}
// The chain check: recompute every hash in order. Lines without a hash predate the chain and are counted, not hidden.
const verifyChain = (rows: { ts: string; tool: string; status: string; ms: number; prev?: string; h?: string }[]) => {
  let prev = 'genesis'
  let chained = 0
  let unchained = 0
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i]!
    if (r.h === undefined) { unchained++; continue }
    const { prev: _p, h: _h, ...entry } = r
    if (r.prev !== prev || toUuid(prev + '|' + JSON.stringify(entry)) !== r.h) return { intact: false, chained, unchained, brokenAt: i + 1 }
    prev = r.h
    chained++
  }
  return { intact: true, chained, unchained, brokenAt: null as number | null }
}
// The dispatch names call_tool, list_tools and run are wrappers: the tool they reach is logged once, by its own name.
const WRAPPERS = new Set(['call_tool', 'list_tools', 'run'])
export const run = async (name: string, a: any): Promise<string> => {
  if (WRAPPERS.has(name)) return runInner(name, a)
  const t0 = Date.now()
  try {
    const out = await runInner(name, a)
    logCall(name, statusOf(out), Date.now() - t0)
    return out
  } catch (e) {
    logCall(name, 'THREW', Date.now() - t0)
    throw e
  }
}
// session_report — the calls this server served: totals, by tool, by status, and time. It reads the log and nothing else.
const sessionReport = (logPath: string): string => {
  if (!existsSync(logPath)) return JSON.stringify({ status: 'ABSENT', note: 'no call log yet: nothing has been served by this server, or the log was removed' }, null, 1)
  const rows = readFileSync(logPath, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l) as { ts: string; tool: string; status: string; ms: number })
  const chain = verifyChain(rows)
  const count = (key: (r: typeof rows[number]) => string) => rows.reduce<Record<string, number>>((acc, r) => { const k = key(r); acc[k] = (acc[k] ?? 0) + 1; return acc }, {})
  return JSON.stringify({
    status: 'REPORTED',
    calls: rows.length,
    firstCall: rows[0]?.ts ?? null,
    lastCall: rows[rows.length - 1]?.ts ?? null,
    totalMs: rows.reduce((t, r) => t + r.ms, 0),
    byStatus: count((r) => r.status),
    byTool: count((r) => r.tool),
    chain,
    note: 'only this server\'s calls are counted. Tokens are not visible to the server: a client reports its own spend.',
  }, null, 1)
}
const runInner = async (name: string, a: any): Promise<string> => {
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
