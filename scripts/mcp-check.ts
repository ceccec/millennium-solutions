#!/usr/bin/env node
// MCP-CHECK — the saved workflow for the MCP surface, run end to end and reported as one verdict.
//
//   node scripts/mcp-check.ts            run the checks
//   node scripts/mcp-check.ts --build    rebuild dist/ first, so the published smoke test reads the current source
//
// Every check is run by the tool that owns it, never by a hand-written copy of the check:
//   · the development server's `audit` (every tool declared and handled, the diamond theorem read from Lean)
//   · the development server's `leads` (the open questions, derived from the tree)
//   · scripts/mcp-gate.ts (each tool's declared needs match its handler)
//   · scripts/hardcode-gate.ts (no literal restates a computed set)
//   · the published entry point, over stdio: it starts, lists its tools, and serves content_address
//
// It exits non-zero if any check fails. Open leads are reported, not failed, as the leads tool itself intends.
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const build = process.argv.includes('--build')

type Check = { name: string; ok: boolean; detail: string }
const checks: Check[] = []

// One JSON-RPC session: initialize, then the requests given, then read back the responses by id.
function session(entry: string[], requests: object[]): Map<number, unknown> {
  const init = [
    { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'mcp-check', version: '1' } } },
    { jsonrpc: '2.0', method: 'notifications/initialized' },
    ...requests,
  ]
  const out = spawnSync('node', entry, { cwd: ROOT, input: init.map((m) => JSON.stringify(m)).join('\n') + '\n', encoding: 'utf8', timeout: 900_000 })
  const byId = new Map<number, unknown>()
  for (const line of String(out.stdout).split('\n').filter(Boolean)) {
    const j = JSON.parse(line) as { id?: number; result?: unknown; error?: unknown }
    if (j.id !== undefined) byId.set(j.id, j.result ?? { error: j.error })
  }
  return byId
}

// Calls one tool of the development server through call_tool, and returns its text payload.
const devCall = (name: string, args: object = {}) => {
  const r = session(['scripts/mcp.ts'], [{ jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'call_tool', arguments: { name, arguments: args } } }]).get(2) as { content?: { text: string }[]; error?: unknown }
  if (!r?.content?.[0]) throw new Error(`no answer from ${name}: ${JSON.stringify(r)}`)
  return r.content[0].text
}

const run = (name: string, cmd: string, args: string[]) => {
  const r = spawnSync(cmd, args, { cwd: ROOT, encoding: 'utf8', timeout: 900_000 })
  const tail = String(r.stdout + r.stderr).trim().split('\n').slice(-1)[0] ?? ''
  checks.push({ name, ok: r.status === 0, detail: tail.slice(0, 200) })
}

if (build) run('rebuild dist', 'npm', ['run', '--silent', 'build:dist'])

try {
  const audit = JSON.parse(devCall('audit')) as { allComputeTrue: boolean; undeclared: string[]; orphans: string[]; tools: number }
  checks.push({
    name: 'audit (development server)',
    ok: audit.allComputeTrue && audit.undeclared.length === 0 && audit.orphans.length === 0,
    detail: `${audit.tools} tools · undeclared ${audit.undeclared.length} · orphans ${audit.orphans.length}`,
  })
} catch (e) {
  checks.push({ name: 'audit (development server)', ok: false, detail: String(e).slice(0, 200) })
}

let openLeads = 'unknown'
try {
  const leads = devCall('leads')
  const m = leads.match(/leads: (\d+) open area\(s\), (\d+) item\(s\)/)
  openLeads = m ? `${m[1]} open areas, ${m[2]} items` : 'no summary line'
  checks.push({ name: 'leads (derived from the tree)', ok: true, detail: openLeads + ' (reported, not failed)' })
} catch (e) {
  checks.push({ name: 'leads (derived from the tree)', ok: false, detail: String(e).slice(0, 200) })
}

run('mcp-gate', 'node', ['scripts/mcp-gate.ts'])
run('hardcode-gate', 'node', ['scripts/hardcode-gate.ts'])

try {
  const published = session(['dist/mcp.bin.js'], [
    { jsonrpc: '2.0', id: 2, method: 'tools/list' },
    { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'call_tool', arguments: { name: 'content_address', arguments: { text: 'hello' } } } },
  ])
  const names = ((published.get(2) as { tools?: { name: string }[] })?.tools ?? []).map((t) => t.name)
  const addr = published.get(3) as { content?: { text: string }[]; error?: unknown }
  const uuid = addr?.content?.[0] ? (JSON.parse(addr.content[0].text) as { uuid?: string }).uuid : undefined
  checks.push({
    name: 'published entry point (dist/mcp.bin.js)',
    ok: names.includes('call_tool') && names.includes('list_tools') && !!uuid,
    detail: `tools: ${names.join(', ')} · content_address ${uuid ? 'answered' : 'missing'}`,
  })
} catch (e) {
  checks.push({ name: 'published entry point (dist/mcp.bin.js)', ok: false, detail: String(e).slice(0, 200) })
}

for (const c of checks) console.log(`${c.ok ? '✓' : '✗'} ${c.name} — ${c.detail}`)
const failed = checks.filter((c) => !c.ok)
console.log(failed.length === 0 ? '\n✓ mcp-check: every check passes' : `\n✗ mcp-check: ${failed.length} check(s) fail`)
process.exit(failed.length === 0 ? 0 : 1)
