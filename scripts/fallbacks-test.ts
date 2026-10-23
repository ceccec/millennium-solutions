#!/usr/bin/env node
// FALLBACKS-TEST — the automatic recoveries work: the router reads every dash variant, web_fetch finds a link that exists
// only in the raw HTML without being told to look there, and web_fetch reads a PDF's text. The two web cases need the
// network: in CI an absent network fails, locally it skips, as the environment rule states.
//
//   node scripts/fallbacks-test.ts
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { probe, skipOrFail } from './environment.ts'
import { route } from '../src/answer/route.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const main = async () => {
  let failed = 0
  const dash = route('the Navier‐Stokes existence problem') // U+2010 hyphen
  const emdash = route('Yang—Mills mass gap') // U+2014 em dash
  for (const [name, got, want] of [['hyphen variant routes as Clay', dash, 'clay'], ['em dash variant routes as Clay', emdash, 'clay']] as const) {
    const ok = got === want
    if (!ok) failed++
    console.log(`${ok ? '✓' : '✗'} ${name}: ${got}`)
  }

  const env = await probe()
  if (!env.net.present) {
    if (skipOrFail('net', env.net.why) === 'FAIL') {
      console.log(`✗ CI does not skip: network absent (${env.net.why})`)
      process.exit(1)
    }
    console.log(`· the web cases are SKIPPED: network absent (${env.net.why}); a skipped check is not a pass`)
    console.log(`\n${failed === 0 ? '✓' : '✗'} fallbacks: the local cases pass; the network cases are unmeasured`)
    process.exit(failed === 0 ? 0 : 1)
  }

  const webCases: { name: string; args: object; check: (j: { status?: string; matches?: number; view?: string }) => boolean }[] = [
    { name: 'a link only in the raw HTML is found without asking for raw', args: { url: 'https://www.claymath.org/millennium-problems/rules/', pattern: 'href="[^"]*\\.pdf', window: 40 }, check: (j) => j.status === 'FETCHED' && (j.matches ?? 0) >= 1 && j.view === 'raw' },
    { name: 'the rules PDF text is read, and §6 is found', args: { url: 'https://www.claymath.org/wp-content/uploads/2022/03/millennium_prize_rules_0.pdf', pattern: 'Publication\\s+of\\s+a\\s+Proposed', window: 40 }, check: (j) => j.status === 'FETCHED' && (j.matches ?? 0) >= 1 },
  ]
  for (const c of webCases) {
    const run = spawnSync('node', ['scripts/mcp-call.ts', 'web_fetch', JSON.stringify(c.args)], { cwd: ROOT, encoding: 'utf8', timeout: 300_000 })
    let j: { status?: string; matches?: number; view?: string } = {}
    try { j = JSON.parse(String(run.stdout)) } catch { /* stays empty: fails */ }
    const ok = c.check(j)
    if (!ok) failed++
    console.log(`${ok ? '✓' : '✗'} ${c.name}: ${j.status ?? 'NO ANSWER'}, ${j.matches ?? 0} match(es), view ${j.view ?? '-'}`)
  }
  console.log(`\n${failed === 0 ? '✓' : '✗'} fallbacks: ${4 - failed}/4 cases as required`)
  process.exit(failed === 0 ? 0 : 1)
}
main()
