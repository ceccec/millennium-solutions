#!/usr/bin/env node
// ANSWER-VERIFY-ARITH — the C2 verifier. The arithmetic decision is in Lean (src/proof/arith.lean); this script only
// PROPOSES. task-route finds a factor or proves a prime, and the proposed claim is compiled by the Lean kernel together
// with the definitions. The verdict is TRUE or FALSE only if the kernel accepts the claim with no axiom beyond the
// standard ones. A claim the kernel refuses, or cannot finish in time, is UNKNOWN.
//
//   echo 91 | node scripts/answer-verify-arith.ts
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decideC2, type RouteReport } from '../src/answer/verify-arith.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const input = readFileSync(0, 'utf8').trim()

type Claim = { value: 'TRUE' | 'FALSE'; statement: string; witness: { factor: string; cofactor: string } | null }

const proposeFrom = (report: RouteReport): Claim | null => {
  const d = decideC2(report)
  if (d.value === 'FALSE' && d.witness) {
    return { value: 'FALSE', statement: `Answer.Arith.verdictOf ${input} (some (${d.witness.factor}, ${d.witness.cofactor})) = Answer.Arith.Value.FALSE`, witness: d.witness }
  }
  if (d.value === 'TRUE') return { value: 'TRUE', statement: `Answer.Arith.verdictOf ${input} none = Answer.Arith.Value.TRUE`, witness: null }
  return null
}

const kernelCheck = (claim: Claim): { ok: boolean; why: string } => {
  // the claim is a theorem outside the namespace, so lean-ask can audit its axioms by its bare name
  const source = readFileSync(resolve(ROOT, 'src/proof/arith.lean'), 'utf8') + `\ntheorem claim : ${claim.statement} := by decide\n`
  const run = spawnSync('node', ['scripts/lean-ask.ts'], { cwd: ROOT, input: source, encoding: 'utf8', timeout: 300_000 })
  let ask: { compiles?: boolean; sorry?: boolean; axioms?: string[]; messages?: string[] } = {}
  try { ask = JSON.parse(String(run.stdout)) } catch { return { ok: false, why: 'the kernel gave no answer' } }
  if (!ask.compiles) return { ok: false, why: 'the kernel refused the claim: ' + (ask.messages ?? []).slice(0, 2).join(' | ').slice(0, 300) }
  if (ask.sorry) return { ok: false, why: 'the claim uses an unfinished proof' }
  const bad = (ask.axioms ?? []).filter((a) => !/does not depend on any axioms|standard axioms: propext|Quot\.sound/.test(a))
  if (bad.length) return { ok: false, why: 'the claim depends on a non-standard axiom' }
  return { ok: true, why: 'the Lean kernel accepted the claim' }
}

let report: RouteReport = {}
const run = spawnSync('node', ['scripts/task-route.ts'], { cwd: ROOT, input, encoding: 'utf8', timeout: 120_000 })
try { report = JSON.parse(String(run.stdout)) as RouteReport } catch { /* stays empty: UNKNOWN */ }

const claim = /^[+-]?\d+$/.test(input) ? proposeFrom(report) : null
const checked = claim ? kernelCheck(claim) : { ok: false, why: claim ? '' : 'no claim was proposed: no proved prime and no factor was reported' }
const value = claim && checked.ok ? claim.value : 'UNKNOWN'
console.log(JSON.stringify({
  value,
  question: `is ${input} prime?`,
  reason: value === 'UNKNOWN' ? checked.why : `${claim!.value}: ${checked.why}`,
  certificate: value === 'UNKNOWN' ? null : { type: 'C2', statement: claim!.statement, witness: claim!.witness ?? { compositeBase: 'trial division, kernel-checked' } },
  checkedBy: 'lean-kernel (src/proof/arith.lean) via task-route proposal',
}, null, 1))
