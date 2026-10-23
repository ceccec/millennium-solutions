#!/usr/bin/env node
// PUSH WHEN GREEN — the push decision is the gates' verdict, not a judgement made by hand.
//
//   node scripts/push-when-green.ts
//
// It runs the push gate (scripts/gate-parallel.ts --push, the same checks the pre-push hook runs). If every check passes,
// it pushes the current branch to origin. If any check refuses, it pushes nothing and prints the refusing stream.
// It never skips a hook and never passes --no-verify: the push is the gate's outcome, or it does not happen.
import { spawnSync } from 'node:child_process'

const gate = spawnSync('node', ['scripts/gate-parallel.ts', '--push'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 1_800_000 })
const refused = `${gate.stdout ?? ''}${gate.stderr ?? ''}`.split('\n').filter((l) => /refused by|failed \(exit/.test(l))
if (gate.status !== 0) {
  console.log(`✗ push-when-green: the push gate refused, nothing pushed`)
  for (const l of refused) console.log(`  ${l.trim()}`)
  process.exit(1)
}
const push = spawnSync('git', ['push', 'origin', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 1_800_000 })
if (push.status !== 0) { console.log(`✗ push-when-green: the gate passed but git push failed: ${(push.stderr ?? '').trim().slice(0, 300)}`); process.exit(1) }
console.log('✓ push-when-green: the push gate passed and the branch was pushed to origin')
