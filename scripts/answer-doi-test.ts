#!/usr/bin/env node
// ANSWER-DOI-TEST — the C3 verifier: the canonical DOI is SOURCED, a DOI for a different record is UNKNOWN.
// Needs the network to resolve a DOI. Without it the suite is SKIPPED, which is not a pass.
//
//   node scripts/answer-doi-test.ts
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { probe, skipOrFail } from './environment.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const canonical = /^doi:\s*"?([^"\s]+)"?/m.exec(readFileSync(resolve(ROOT, 'CITATION.cff'), 'utf8'))?.[1] ?? ''
const OTHER = '10.5281/zenodo.21781602'
const CASES: { name: string; doi: string; want: 'SOURCED' | 'UNKNOWN' }[] = [
  { name: 'the canonical DOI (CITATION.cff)', doi: canonical, want: 'SOURCED' },
  { name: 'a DOI for a different record', doi: OTHER, want: 'UNKNOWN' },
]

const main = async () => {
  const env = await probe()
  if (!env.net.present) {
    if (skipOrFail('net', env.net.why) === 'FAIL') {
      console.log(`FAILED — CI does not skip: network absent (${env.net.why})`)
      process.exit(1)
    }
    console.log(`SKIPPED — the DOI cases need the network: ${env.net.why}`)
    console.log('  a skipped suite is not a pass; it is reported as unmeasured')
    process.exit(0)
  }
  let failed = 0
  for (const c of CASES) {
    const run = spawnSync('node', ['scripts/answer-verify-doi.ts', c.doi], { cwd: ROOT, encoding: 'utf8', timeout: 300_000 })
    let got = 'NO ANSWER'
    try { got = (JSON.parse(String(run.stdout)) as { value: string }).value } catch { /* stays NO ANSWER */ }
    const ok = got === c.want
    if (!ok) failed++
    console.log(`${ok ? '✓' : '✗'} ${c.name}: ${got}${ok ? '' : ` (expected ${c.want})`}`)
  }
  console.log(`\n${failed === 0 ? '✓' : '✗'} answer-doi: ${CASES.length - failed}/${CASES.length} cases as required`)
  process.exit(failed === 0 ? 0 : 1)
}
main()
