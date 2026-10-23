#!/usr/bin/env node
// ANSWER-VERIFY-LEAN — the C1 verifier: runs lean-ask on a Lean source and returns TRUE or UNKNOWN for one theorem.
//
//   node scripts/answer-verify-lean.ts <theoremName> < source.lean
//
// The checking is done by lean-ask (the kernel, and #print axioms). The decision is src/answer/verify-lean.ts.
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decideC1, type LeanAskReport } from '../src/answer/verify-lean.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const theorem = process.argv[2] ?? ''
if (!theorem) {
  console.log(JSON.stringify({ value: 'UNKNOWN', reason: 'usage: answer-verify-lean.ts <theoremName> < source' }))
  process.exit(0)
}
const source = readFileSync(0, 'utf8')
const run = spawnSync('node', ['scripts/lean-ask.ts'], { cwd: ROOT, input: source, encoding: 'utf8', timeout: 600_000 })
let report: LeanAskReport = { status: 'ABSENT', compiles: false, sorry: false, axioms: [] }
try { report = JSON.parse(String(run.stdout)) as LeanAskReport } catch { /* stays ABSENT: reported as UNKNOWN */ }
const decision = decideC1(report, theorem)
console.log(JSON.stringify({
  value: decision.value,
  theorem,
  reason: decision.reason,
  certificate: decision.value === 'TRUE' ? { type: 'C1', axioms: 'kernel-only', leanFile: 'the source given on stdin' } : null,
  checkedBy: 'lean-ask',
}, null, 1))
