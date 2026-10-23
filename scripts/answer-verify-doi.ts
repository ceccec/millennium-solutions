#!/usr/bin/env node
// ANSWER-VERIFY-DOI — the C3 verifier: resolves one DOI through the MCP and returns SOURCED or UNKNOWN.
//
//   node scripts/answer-verify-doi.ts <doi>
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

// THE DOI IS THE PRIMARY SOURCE. The registry answers content negotiation with the record's own metadata (CSL JSON:
// its title, type and publisher), so the title is read from the record and not scraped from a landing page's HTML.
let report: DoiReport = { status: 'UNPARSED', title: null }
try {
  const res = await fetch(`https://doi.org/${doi}`, { headers: { Accept: 'application/vnd.citationstyles.csl+json' }, redirect: 'follow', signal: AbortSignal.timeout(30_000) })
  if (!res.ok) report = { status: `HTTP ${res.status}`, title: null }
  else {
    const meta = (await res.json()) as { title?: string | string[] }
    const title = Array.isArray(meta.title) ? meta.title[0] : meta.title
    report = { status: 'FETCHED', title: title?.replace(/\s+/g, ' ').trim() || null }
  }
} catch (e) { report = { status: `UNREACHABLE (${(e as Error).name})`, title: null } }
const d = decideC3(report, titleHead)
console.log(JSON.stringify({
  value: d.value,
  doi,
  reason: d.reason,
  certificate: d.value === 'SOURCED' ? { type: 'C3', doi, record: report.title } : null,
  checkedBy: 'doi registry, content negotiation (CSL JSON)',
}, null, 1))
