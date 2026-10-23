#!/usr/bin/env node
// ANSWER-TOOL-TEST — the `answer` MCP tool, called through the server, answers one question of each kind as the rules require.
// The DOI case needs the network; without it the suite is SKIPPED, which is not a pass.
//
//   node scripts/answer-tool-test.ts
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { probe, skipOrFail } from './environment.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const canonical = /^doi:\s*"?([^"\s]+)"?/m.exec(readFileSync(resolve(ROOT, 'CITATION.cff'), 'utf8'))?.[1] ?? ''
const LEAN = 'theorem two_plus_two : 2 + 2 = 4 := by decide'
const CASES: { name: string; question: string; want: string; network?: boolean }[] = [
  { name: 'an integer: 91 is FALSE', question: '91', want: 'FALSE' },
  { name: 'a Lean theorem that compiles: TRUE', question: LEAN, want: 'TRUE' },
  { name: 'the canonical DOI: SOURCED', question: canonical, want: 'SOURCED', network: true },
  { name: 'a Clay problem: UNKNOWN', question: 'the Riemann Hypothesis', want: 'UNKNOWN' },
  { name: 'a text question: UNKNOWN', question: 'what is the weather in Sofia', want: 'UNKNOWN' },
]

const main = async () => {
  const env = await probe()
  let failed = 0
  for (const c of CASES) {
    if (c.network && !env.net.present) {
      if (skipOrFail('net', env.net.why) === 'FAIL') {
        console.log(`✗ ${c.name}: FAILED — CI does not skip: network absent (${env.net.why})`)
        failed++
        continue
      }
      console.log(`· ${c.name}: SKIPPED — needs the network: ${env.net.why}`)
      continue
    }
    const run = spawnSync('node', ['scripts/mcp-call.ts', 'answer', JSON.stringify({ question: c.question })], { cwd: ROOT, encoding: 'utf8', timeout: 900_000 })
    let got = 'NO ANSWER'
    try { got = (JSON.parse(String(run.stdout)) as { value: string }).value } catch { /* stays NO ANSWER */ }
    const ok = got === c.want
    if (!ok) failed++
    console.log(`${ok ? '✓' : '✗'} ${c.name}: ${got}${ok ? '' : ` (expected ${c.want})`}`)
  }
  console.log(`\n${failed === 0 ? '✓' : '✗'} answer-tool: ${CASES.length - failed}/${CASES.length} cases as required${env.net.present ? '' : ' (DOI case skipped)'}`)
  process.exit(failed === 0 ? 0 : 1)
}
main()
