#!/usr/bin/env node
// ANSWER-GATE — refuse stored or emitted answers that break the certificate rules. The rules are kernel-checked Lean
// (src/proof/answer_gate.lean): this script only reads each answer's flags and asks the kernel whether `AnswerGate.ok`
// holds for them. A flag set the kernel refuses is REFUSED. Reads a JSON array on stdin.
//
//   echo '[{"value":"TRUE","question":"q","checkedBy":"x"}]' | node scripts/answer-gate.ts
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const RULES = readFileSync(resolve(ROOT, 'src/proof/answer_gate.lean'), 'utf8')
const VALUES: Record<string, string> = { TRUE: 'TRUE', FALSE: 'FALSE', SOURCED: 'SOURCED', UNKNOWN: 'UNKNOWN' }

type Flags = { value: string; cert: 'none' | 'C1' | 'C2' | 'C3' | 'other'; checkedBy: boolean; blocking: boolean }
const flagsOf = (a: { value?: unknown; checkedBy?: unknown; blockingStep?: unknown; certificate?: { type?: unknown } | null }): Flags => {
  const t = a.certificate?.type
  const cert: Flags['cert'] = !a.certificate ? 'none' : t === 'C1' || t === 'C2' || t === 'C3' ? t : 'other'
  return { value: String(a.value), cert, checkedBy: typeof a.checkedBy === 'string' && a.checkedBy !== '', blocking: typeof a.blockingStep === 'string' && a.blockingStep !== '' }
}

// the kernel decides: a theorem that `ok` holds for these flags compiles only if the rules accept them
const kernelAccepts = (f: Flags): { accepted: boolean; why: string } => {
  const v = VALUES[f.value]
  if (!v) return { accepted: false, why: 'the value is not TRUE, FALSE, SOURCED, or UNKNOWN' }
  const c = { none: 'AnswerGate.Cert.none', C1: 'AnswerGate.Cert.C1', C2: 'AnswerGate.Cert.C2', C3: 'AnswerGate.Cert.C3', other: 'AnswerGate.Cert.other' }[f.cert]
  const source = RULES + `\ntheorem answer : AnswerGate.ok ⟨AnswerGate.Val.${v}, ${c}, ${f.checkedBy}, ${f.blocking}⟩ = true := by decide\n`
  const run = spawnSync('node', ['scripts/lean-ask.ts'], { cwd: ROOT, input: source, encoding: 'utf8', timeout: 300_000 })
  let ask: { compiles?: boolean; sorry?: boolean } = {}
  try { ask = JSON.parse(String(run.stdout)) } catch { return { accepted: false, why: 'the kernel gave no answer' } }
  // The source contains no sorry, so a placeholder can only come from a failed `decide`: the rule does not hold.
  if (ask.sorry || !ask.compiles) return { accepted: false, why: 'the kernel refuses these flags: the rule does not hold for them' }
  return ask.compiles ? { accepted: true, why: 'the kernel accepts these flags' } : { accepted: false, why: 'the kernel refuses these flags: the rule does not hold for them' }
}

let answers: unknown[]
try { answers = JSON.parse(readFileSync(0, 'utf8')) as unknown[] } catch { console.log('✗ answer-gate: the input is not a JSON array'); process.exit(1) }
const rows = answers.map((a, index) => {
  const f = flagsOf(a as Parameters<typeof flagsOf>[0])
  return { index, flags: f, ...kernelAccepts(f) }
})
const refused = rows.filter((r) => !r.accepted)
for (const r of rows) console.log(`${r.accepted ? '✓' : '✗'} answer ${r.index}: ${r.why}`)
console.log(`\n${refused.length === 0 ? '✓' : '✗'} answer-gate: ${rows.length - refused.length}/${rows.length} answers keep the rules (kernel-decided)`)
process.exit(refused.length === 0 ? 0 : 1)
