#!/usr/bin/env node
// RUN-SUITE SECURITY — the suite allowlist refuses every name that is not a listed suite, and runs the listed ones.
// Each name below must be REFUSED without reaching the shell; the listed control must be run. It calls the MCP client,
// so the test exercises the same path a client session uses, not a function imported around it.
//
//   node scripts/run-suite-security-test.ts
import { spawnSync } from 'node:child_process'

const call = (suite: string) => {
  const r = spawnSync('node', ['scripts/mcp-call.ts', 'run_suite', JSON.stringify({ suite })], { encoding: 'utf8', timeout: 900_000 })
  try { return JSON.parse(r.stdout) as { status: string } } catch { return { status: `UNPARSED(${r.status})` } }
}

const MUST_REFUSE = ['no-such-suite', '../etc/passwd', 'mcp-gate; echo PWNED', '$(echo PWNED)', 'mcp-gate && echo PWNED', '']
const MUST_RUN = ['hardcode-gate']

let bad = 0
for (const name of MUST_REFUSE) {
  const got = call(name).status
  const ok = got === 'REFUSED'
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} refused: ${JSON.stringify(name)} → ${got}`)
}
for (const name of MUST_RUN) {
  const got = call(name).status
  const ok = got === 'PASS'
  if (!ok) bad++
  console.log(`${ok ? '✓' : '✗'} listed suite runs: ${name} → ${got}`)
}
console.log(bad ? `✗ run-suite-security: ${bad} check(s) failed` : '✓ run-suite-security: every unlisted name is refused, the listed control runs')
process.exit(bad ? 1 : 0)
