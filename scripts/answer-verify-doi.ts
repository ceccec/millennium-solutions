#!/usr/bin/env node
// ANSWER-VERIFY-DOI — the C3 verifier: resolves one DOI through the MCP and returns SOURCED or UNKNOWN.
//
//   node scripts/answer-verify-doi.ts <doi>
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decideC3, type DoiReport } from '../src/answer/verify-doi.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const doi = (process.argv[2] ?? '').trim()
if (!doi) {
  console.log(JSON.stringify({ value: 'UNKNOWN', reason: 'usage: answer-verify-doi.ts <doi>' }))
  process.exit(0)
}
const cff = readFileSync(resolve(ROOT, 'CITATION.cff'), 'utf8')
const canonicalTitle = /^title:\s*"(.+)"\s*$/m.exec(cff)?.[1] ?? ''
const titleHead = canonicalTitle.split(':')[0]!.replace(/^The\s+/, '').trim()

const run = spawnSync('node', ['scripts/mcp-call.ts', 'web_fetch', JSON.stringify({ url: `https://doi.org/${doi}`, pattern: '<title>[^<]{0,200}</title>', window: 0, raw: true })], { cwd: ROOT, encoding: 'utf8', timeout: 180_000 })
let report: DoiReport = { status: 'UNPARSED', title: null }
try {
  const j = JSON.parse(String(run.stdout)) as { status: string; passages?: string[] }
  const raw = (j.passages?.[0] ?? '').replace(/<\/?title>/g, '').replace(/\s*\|\s*Zenodo\s*$/, '').replace(/\s+/g, ' ').trim()
  report = { status: j.status, title: raw || null }
} catch { /* stays UNPARSED: UNKNOWN */ }
const d = decideC3(report, titleHead)
console.log(JSON.stringify({
  value: d.value,
  doi,
  reason: d.reason,
  certificate: d.value === 'SOURCED' ? { type: 'C3', doi, record: report.title } : null,
  checkedBy: 'web_fetch via mcp-call',
}, null, 1))
