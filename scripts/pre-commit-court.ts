#!/usr/bin/env node
// PRE-COMMIT-COURT — manual work goes to court before it is committed.
//
//   node scripts/pre-commit-court.ts
//
// Two courts sit in front of a commit, and both must answer before it lands:
//   1. THE LOCAL SUITES, run through the MCP (run_suite): mcp-gate, hardcode-gate, mcp-check, environment,
//      clay-conditions-self-test. Each returns PASS, FAIL, or SKIPPED. SKIPPED is not PASS; the environment
//      decided it could not be measured, so it is named in the verdict.
//   2. THE QPU COURT, asked through the connector (connect qpu court): it runs qpu's own gate cases and reports how many
//      hold. The court is a record of its own gates, not a judge of this commit, so the commit passes only when every
//      case holds. A court that answers with fewer than all held refuses the commit and names the count.
//
// A commit that names no manual change still runs both courts: the courts do not trust the commit's author.
// The verdict is printed as a list, one line per court, and the exit code is 0 only when nothing failed.
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { probe } from './environment.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SUITES = ['mcp-gate', 'hardcode-gate', 'mcp-check', 'environment', 'clay-conditions-self-test']

type Line = { court: string; verdict: 'PASS' | 'FAIL' | 'SKIPPED'; detail: string }
const lines: Line[] = []

const viaMcpAsync = (tool: string, args: object): Promise<string> =>
  new Promise((done) => {
    const child = spawn('node', ['scripts/mcp-call.ts', tool, JSON.stringify(args)], { cwd: ROOT })
    let out = ''
    child.stdout.on('data', (d: Buffer) => { out += d.toString() })
    child.stderr.on('data', (d: Buffer) => { out += d.toString() })
    child.on('close', () => done(out))
  })

const main = async () => {
  // The local suites are independent of one another, so they run at the same time, not one after another.
  // The remote court is requested at the same time as the local suites, so its network wait overlaps their runtime.
  const env0 = await probe()
  const courtRequest = env0.net.present
    // THE DOOR MOVED (2026-11-02): qpu.uuidna.com 1.4.0 serves no `court`; its `audit` replays every example and every
    // toolbox selftest and answers passed/total/failed with each check named — the same question under the name the
    // unit serves. A door the unit does not serve is SKIPPED, not FAIL: a moved door is not a defect in this tree.
    ? viaMcpAsync('connect', { connector: 'qpu', tool: 'audit', arguments: {} })
    : Promise.resolve('')
  const results = await Promise.all(SUITES.map(async (suite) => ({ suite, text: await viaMcpAsync('run_suite', { suite }) })))
  for (const { suite, text } of results) {
    const verdict = /"status": "(PASS|FAIL|SKIPPED)"/.exec(text)?.[1] as Line['verdict'] | undefined
    lines.push({ court: `local suite ${suite}`, verdict: verdict ?? 'FAIL', detail: verdict ? 'through the MCP run_suite' : 'no verdict returned through the MCP' })
  }

  const env = await probe()
  if (!env.net.present) {
    lines.push({ court: 'qpu court', verdict: 'SKIPPED', detail: `no network: ${env.net.why}. The commit is NOT cleared by the court` })
  } else {
    const text = await courtRequest
    const unescaped = text.replace(/\\"/g, '"')
    const total = /"total":\s*(\d+)/.exec(unescaped), passed = /"passed":\s*(\d+)/.exec(unescaped), failedN = /"failed":\s*(\d+)/.exec(unescaped)
    if (/"status":\s*"REFUSED"/.test(text) && /no tool audit/.test(text)) {
      lines.push({ court: 'qpu court', verdict: 'SKIPPED', detail: 'the unit serves no `audit` door today — a moved door, not a defect here. The commit is NOT cleared by the court' })
    } else if (!total || !passed) {
      lines.push({ court: 'qpu court', verdict: 'FAIL', detail: 'the audit did not return passed/total counts through the connector: ' + text.replace(/\s+/g, ' ').slice(0, 160) })
    } else {
      const pass = passed[1] === total[1] && (failedN ? failedN[1] === '0' : true)
      // THE TEACHER: name each check that did not pass, by the id the unit gives it.
      const failing = [...unescaped.matchAll(/"id":"([^"]+)","passed":false/g)].map((m) => m[1])
      const named = failing.length ? ` — failing check(s): ${failing.slice(0, 8).join(', ')}${failing.length > 8 ? ', …' : ''}` : ''
      lines.push({ court: 'qpu court', verdict: pass ? 'PASS' : 'FAIL', detail: `${passed[1]} of ${total[1]} of its checks pass${named}${pass ? '' : ': the commit is refused until all pass'}` })
    }
  }

  for (const l of lines) console.log(`${l.verdict === 'PASS' ? '✓' : l.verdict === 'SKIPPED' ? '·' : '✗'} ${l.court} — ${l.verdict}: ${l.detail}`)
  const failed = lines.filter((l) => l.verdict === 'FAIL')
  const skipped = lines.filter((l) => l.verdict === 'SKIPPED')
  if (failed.length) {
    console.log(`\n✗ pre-commit-court: refused — ${failed.length} court(s) failed${skipped.length ? `, ${skipped.length} not measured` : ''}`)
    process.exit(1)
  }
  console.log(`\n${skipped.length ? '·' : '✓'} pre-commit-court: ${skipped.length ? `cleared, with ${skipped.length} court(s) NOT measured` : 'every court cleared'}`)
  process.exit(0)
}

main()
