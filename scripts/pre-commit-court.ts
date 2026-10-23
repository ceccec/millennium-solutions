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
    ? viaMcpAsync('connect', { connector: 'qpu', tool: 'court', arguments: { court: true, full: true } })
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
    const held = /held\\?":\s*(\d+),\s*\\?"of\\?":\s*(\d+)/.exec(text) ?? /"held":\s*(\d+),\s*"of":\s*(\d+)/.exec(text)
    if (!held) {
      lines.push({ court: 'qpu court', verdict: 'FAIL', detail: 'the court did not return a held count through the connector' })
    } else {
      const [, h, o] = held
      const pass = h === o
      // THE TEACHER: name each case whose OWN gate does not hold. A case's gate verdict is the first `holds` in its gate
      // object; nested fields (the law.* checks) also say `holds` and must not be read as the case's verdict.
      const unescaped = text.replace(/\\"/g, '"')
      const failing = [...unescaped.matchAll(/"case":"([^"]+)","gate":\{[^{}]*?"holds":(true|false)/g)].filter((m) => m[2] === 'false').map((m) => m[1])
      const named = failing.length ? ` — failing case(s): ${failing.join(', ')}` : ''
      lines.push({ court: 'qpu court', verdict: pass ? 'PASS' : 'FAIL', detail: `${h} of ${o} of its cases hold${named}${pass ? '' : ': the commit is refused until all hold'}` })
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
