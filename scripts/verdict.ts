#!/usr/bin/env node
// THE FULL TRIAL (en banc) — the valid, formula-backed ruling. It complements, and never replaces, the floor
// trial adjudicate(): that one is O(1) and ledger-INDEPENDENT on purpose (three sealed theorems require it —
// the_trial_is_ledger_independent, the_verdict_is_constant_work, the_trial_responds_at_constant_time), a fast
// first pass. This full trial is the opposite by design: it READS the ledger, RECOMPUTES every supporting
// theorem's formula (test() === true), and FOLDS their receipts with the gate formula and the verdict into ONE
// proof-of-verdict receipt via double-torus gravity. Valid because every cited formula recomputes; reproducible
// by anyone; cost O(supporting theorems), not O(1). Integrity, not truth. 0/7.
import { adjudicate, type Verdict } from './adjudicate.ts'
import { computes } from './honesty-gate.ts'
import { CANDIDATES } from './discover.ts'
import { doubleTorusGravity } from '../src/the/apple/index.ts'
import { toUuid } from '../src/0/index.ts'
import { readFileSync, existsSync } from 'node:fs'
import { ledger as __ledger, live } from '../src/api/index.ts'

const ledger = (): { key: string; name: string; receipt: string }[] =>
  existsSync('src/proof/discovered.json') ? __ledger() : []

// A supporting formula is a ledger theorem whose predicate establishes the FLOOR relevant to the statement: the
// trial theorems always apply; the disputed-cluster theorems apply when the statement names a disputed problem.
const TRIAL = /trial|gate|drain|refus|overclaim|honest|floor|diamond|involution|double_torus|audit|only_claims|integrity|unsolved|remains|0_7/i
const CLUSTER = /riemann|clay|millennium|p_vs_np|p vs np|navier|hodge|yang|mills|birch|swinnerton|poincar/i

export interface FullVerdict extends Verdict { formulas: number; recomputedTrue: number; proofReceipt: string; candidatePool: number; standingPool: number }

export function proveVerdict(statement: string, decidableTest?: () => boolean): FullVerdict {
  const base = adjudicate(statement, decidableTest)
  // STANDING ENTRIES ONLY. This read ledger(), which is the APPEND-ONLY record — withdrawn entries included.
  // Measured: of the 282 keys the TRIAL filter selects, 235 are WITHDRAWN, 12 carried and 35 standing. So a
  // ruling's "supporting formulas" were five-sixths claims that nothing proves, and the 94-of-251 recompute
  // ratio was not a puzzle — it was the withdrawn ones failing their own tests, as they should.
  //
  // A formula cited in support of a verdict has to be one that stands. Carried entries are excluded too:
  // their statement is proved at ANOTHER key, which is the key that should be cited, not this one.
  const receiptOf = new Map(live().map((e) => [e.key, e.receipt]))
  const s = statement.toLowerCase()
  const touchesDisputed = CLUSTER.test(s)
  const relevant = CANDIDATES.filter((c) => (TRIAL.test(c.key) || (touchesDisputed && CLUSTER.test(c.key))) && receiptOf.has(c.key))
  let recomputedTrue = 0
  const receipts: string[] = []
  for (const c of relevant) {
    let ok = false; try { ok = c.test() === true } catch { ok = false }
    if (ok) { recomputedTrue++; receipts.push(receiptOf.get(c.key)!) }
  }
  const gateFormula = toUuid('computes(claim).binary=' + computes(statement).binary)
  const proofReceipt = doubleTorusGravity([...receipts, gateFormula, toUuid('verdict:' + base.verdict), base.receipt])
  // WHY `formulas` IS SMALL, SAID HERE RATHER THAN LEFT TO PUZZLE A READER. CANDIDATES is the TypeScript-
  // tested corpus: 2030 claims, 1889 of them in the ledger, and 25 still standing. The deposit migrated its
  // evidence to Lean — 476 live theorems, verified by the kernel in scripts/lean.ts, none of them carrying a
  // TypeScript test for this trial to recompute. So a thin formula count is not a broken filter; it is the
  // honest size of what remains recomputable HERE, and the Lean layer is where the standing proof now lives.
  const candidatePool = CANDIDATES.length
  const standingPool = CANDIDATES.filter((c) => receiptOf.has(c.key)).length
  return { ...base, formulas: relevant.length, recomputedTrue, proofReceipt, candidatePool, standingPool }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const claim = process.argv[2] || 'We prove all six Clay Millennium Problems; confidence = 1.0; Riemann, P vs NP, Navier-Stokes, Yang-Mills, Hodge, Birch-Swinnerton-Dyer.'
  const v = proveVerdict(claim)
  console.log(JSON.stringify({ verdict: v.verdict, gateBinary: v.gateBinary, formulas: v.formulas, recomputedTrue: v.recomputedTrue, candidatePool: v.candidatePool, standingPool: v.standingPool, textReceipt: v.receipt, proofReceipt: v.proofReceipt, note: v.note }, null, 2))
}
