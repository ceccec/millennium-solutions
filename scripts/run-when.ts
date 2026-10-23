#!/usr/bin/env node
// RUN-WHEN — run a command only when this environment has what it needs, and say so when it does not.
//
//   node scripts/run-when.ts --needs net,lean -- node scripts/lean-claims.ts
//
// The probe (scripts/environment.ts) decides. When a requirement is absent the command is NOT run, and the output
// names what was missing, with the probe's reason. That is a SKIP, printed as one, and it is never reported as a
// pass: a skipped check is an unmeasured check. The exit code is 0 for a skip the environment forced, so a
// machine without network does not turn the build red for a reason outside the tree.
//
// It exits with the command's own code when it runs, so a refusal inside the command is never hidden.
import { spawnSync } from 'node:child_process'
import { probe, skipOrFail, type Capability } from './environment.ts'

const argv = process.argv.slice(2)
const sep = argv.indexOf('--')
const flagIdx = argv.indexOf('--needs')
if (flagIdx < 0 || sep < 0 || sep < flagIdx) {
  console.log('usage: run-when.ts --needs <net,fs,lean,git,tree,ci> -- <command> [args]')
  process.exit(2)
}
const needs = (argv[flagIdx + 1] ?? '').split(',').map((s) => s.trim()).filter(Boolean) as Capability[]
const command = argv.slice(sep + 1)
if (!command.length) {
  console.log('usage: run-when.ts --needs <...> -- <command> [args]')
  process.exit(2)
}

probe().then((env) => {
  const missing = needs.filter((n) => !env[n]?.present)
  if (missing.length) {
    const reasons = missing.map((n) => `${n}: ${env[n]?.why ?? 'unknown'}`)
    if (missing.some((n) => skipOrFail(n, '') === 'FAIL')) {
      console.log(`FAILED — ${command.join(' ')}: CI does not skip. Absent: ${reasons.join('; ')}`)
      process.exit(1)
    }
    console.log(`SKIPPED — ${command.join(' ')}`)
    for (const r of reasons) console.log(`  · ${r}`)
    console.log('  a skipped check is not a pass; it is reported as unmeasured')
    process.exit(0)
  }
  const [cmd, ...args] = command
  const run = spawnSync(cmd!, args, { stdio: 'inherit' })
  process.exit(run.status ?? 1)
})
