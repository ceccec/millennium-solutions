#!/usr/bin/env node
// COURT-TRIAL — a claim tried by both sides, decided by the kernel.
//
//   echo '2 + 2 = 4' | node scripts/court-trial.ts
//
// The DEFENCE compiles the claim as a Lean theorem: `theorem claim : <claim> := by decide`.
// The PROSECUTION compiles its negation: `theorem counter : ¬ (<claim>) := by decide`.
// The kernel decides each side. A side that compiles has proved its statement; a side that does not compile has not.
// The verdict follows from the two results and from nothing else:
//   SEALED   the defence proves the claim and the prosecution cannot prove its negation
//   REFUSED  the prosecution proves the negation, so the claim is false
//   UNKNOWN  neither side is proved: the trial does not decide the claim
// Nothing here is prose judgement. A claim that is not a Lean proposition cannot be tried, and is reported as NOT TRIABLE.
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const claim = readFileSync(0, 'utf8').trim()
if (!claim) {
  console.log(JSON.stringify({ verdict: 'NOT TRIABLE', why: 'no claim was given' }, null, 1))
  process.exit(1)
}

const trySide = (name: string, statement: string): { compiles: boolean; sorry: boolean; messages: string[] } => {
  const source = `theorem ${name} : ${statement} := by decide\n`
  const run = spawnSync('node', ['scripts/lean-ask.ts'], { cwd: ROOT, input: source, encoding: 'utf8', timeout: 300_000 })
  try {
    const ask = JSON.parse(String(run.stdout)) as { compiles: boolean; sorry: boolean; messages: string[] }
    return { compiles: ask.compiles, sorry: ask.sorry, messages: ask.messages.slice(0, 3) }
  } catch {
    return { compiles: false, sorry: true, messages: ['the kernel gave no answer'] }
  }
}

const defence = trySide('claim', claim)
const prosecution = trySide('counter', `¬ (${claim})`)
const proved = (s: { compiles: boolean; sorry: boolean }) => s.compiles && !s.sorry

// a claim that is not a Lean proposition fails both sides with the same elaboration error, and is not triable
const notTriable = !proved(defence) && !proved(prosecution) && defence.messages.some((m) => /unknown|expected|type mismatch|elaborat/i.test(m))
const verdict = notTriable ? 'NOT TRIABLE'
  : proved(defence) && !proved(prosecution) ? 'SEALED'
  : proved(prosecution) && !proved(defence) ? 'REFUSED'
  : 'UNKNOWN'
console.log(JSON.stringify({
  claim,
  verdict,
  defence: { proved: proved(defence) },
  prosecution: { proved: proved(prosecution) },
  checkedBy: 'lean-kernel (scripts/lean-ask.ts), both sides',
}, null, 1))
process.exit(verdict === 'SEALED' || verdict === 'REFUSED' ? 0 : 1)
