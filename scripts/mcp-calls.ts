#!/usr/bin/env node
// MCP-CALLS — every MCP call that can be made without a technical barrier, made once through the MCP client, and its reply checked.
//
//   node scripts/mcp-calls.ts
//
// Each call goes through scripts/mcp-call.ts, the same path a session uses. A call passes when the reply is non-empty and
// carries no error text. A call is skipped only for a technical reason, named in the output: it writes files, deploys,
// fans out to many network hosts, runs for minutes, or needs an input file this check does not have.
import { execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const CALLS: [string, Record<string, unknown>][] = [
  ['coils', {}], ['formulas', { limit: 3 }], ['content_address', { text: 'hello' }], ['merkle_fold', { items: ['a', 'b'] }],
  ['rosetta', {}], ['verify', {}], ['ledger_status', {}], ['metrics_face', {}], ['peer_faces', {}], ['entanglements', {}],
  ['leaks', {}], ['hexbit_route', { input: 'audit' }], ['constants_check', {}], ['prose_check', {}], ['theorem_only', {}],
  ['answer', { question: 'P vs NP' }], ['stall_check', { text: 'working' }], ['task_route', { input: '97' }],
  ['lean_ask', { source: 'theorem audit_two : 2 + 2 = 4 := by decide' }],
  ['lean_split', { source: 'theorem a : 1 = 1 := by decide\ntheorem b : 2 = 2 := by decide' }],
  ['honesty_gate', { text: 'the audit runs every read-only capability' }], ['handle', { text: 'audit' }],
  ['explain', { name: 'exactly_eleven_are_accepted' }], ['connect_status', { job: '00000000-0000-4000-8000-000000000000' }],
  ['run_suite', { suite: 'mcp-gate' }], ['lean_verify', {}], ['forensics', {}], ['lineage', {}], ['session_report', {}],
  ['ledger_trial', {}], ['recompute', {}], ['qpu_court_local', {}], ['leads', {}], ['discoveries', {}],
  ['connect', { connector: 'qpu', tool: 'court', arguments: {} }], ['clay_conditions', {}],
]
const SKIPPED: [string, string][] = [
  ['git_commit_paths', 'writes a commit to the repository'], ['pages', 'writes README and index'],
  ['lean_seal', 'writes the ledger'], ['lean_generate', 'writes Lean files'], ['discover', 'writes discoveries'],
  ['novelty', 'network search per statement, writes the record'], ['novelty_batch', 'network search, writes the record'],
  ['cern', 'network harvest of a public corpus, minutes'], ['pre_commit_e2e', 'runs the whole hook, minutes, and the court'],
  ['qpu_families', 'runs every family test, minutes'], ['lean_audit_library', 'builds a Lake library, minutes'],
  ['audit', 'compiles and audits every Lean file, minutes'], ['verify_face', 'needs a face file as input'],
  ['api_joins', 'network fan-out to several hosts'], ['web_search', 'network search, rate limits per host'],
  ['web_fetch', 'network fetch of a given page, needs a URL'], ['probe', 'network probe of a given URL'],
  ['readers', 'network fan-out to registries'], ['live', 'network fan-out to registries'],
  ['clay_online', 'network fan-out, one request per host'], ['links_check', 'network fan-out, one request per host'],
]

const rows: { name: string; status: 'PASS' | 'FAIL'; ms: number; why: string }[] = []
for (const [name, args] of CALLS) {
  const t0 = Date.now()
  let out = '', ok = false, why = ''
  try {
    out = execFileSync('node', ['scripts/mcp-call.ts', name, JSON.stringify(args)], { cwd: ROOT, encoding: 'utf8', timeout: 240000, maxBuffer: 8 << 20 }).trim()
    // an error is the client's or the server's refusal to answer; a verdict such as "3 of 3 conditions not met" is an answer
    ok = out.length > 0 && !/^no answer|^no response|not allowlisted|unknown tool/im.test(out.slice(0, 300))
    why = ok ? 'reply non-empty, no error text' : 'reply empty or carries an error'
  } catch (e) {
    why = String((e as { stderr?: string }).stderr ?? e).split('\n')[0]!.slice(0, 120)
  }
  rows.push({ name, status: ok ? 'PASS' : 'FAIL', ms: Date.now() - t0, why })
}
for (const r of rows) console.log(`${r.status}  ${String(r.ms).padStart(6)}ms  ${r.name.padEnd(18)} ${r.why}`)
for (const [name, reason] of SKIPPED) console.log(`SKIP             ${name.padEnd(18)} ${reason}`)
const failed = rows.filter((r) => r.status === 'FAIL')
console.log(`\n${failed.length === 0 ? '✓' : '✗'} mcp-calls: ${rows.length - failed.length} of ${rows.length} calls pass, ${SKIPPED.length} skipped for a technical reason`)
process.exit(failed.length === 0 ? 0 : 1)
