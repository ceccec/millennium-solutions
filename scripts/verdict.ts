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
import { createHash } from 'node:crypto'
import { join } from 'node:path'

/** Where scripts/lean.ts records each file's kernel verification, keyed by a hash of its bytes. */
const LEAN_CACHE = 'src/proof/.lean-cache.json'
import { ledger as __ledger, live, leanTheorems, fileOfKey } from '../src/api/index.ts'

const ledger = (): { key: string; name: string; receipt: string }[] =>
  existsSync('src/proof/discovered.json') ? __ledger() : []

// A supporting formula is a ledger theorem whose predicate establishes the FLOOR relevant to the statement: the
// trial theorems always apply; the disputed-cluster theorems apply when the statement names a disputed problem.
const TRIAL = /trial|gate|drain|refus|overclaim|honest|floor|diamond|involution|double_torus|audit|only_claims|integrity|unsolved|remains|0_7/i
const CLUSTER = /riemann|clay|millennium|p_vs_np|p vs np|navier|hodge|yang|mills|birch|swinnerton|poincar/i

export interface FullVerdict extends Verdict { formulas: number; recomputedTrue: number; proofReceipt: string; candidatePool: number; standingPool: number; leanFormulas: number; leanVerified: number }

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

  // ── THE LEAN LAYER, WHICH IS WHERE THE STANDING PROOF ACTUALLY LIVES ──────────────────────────────────
  // Restricting the TypeScript pool to live() left ONE formula, and that thinness was the true measure of a
  // superseded corpus: 2030 candidates, 25 standing, because this deposit moved its evidence to Lean. The
  // trial could not see any of it — 460 theorems in src/proof, kernel-verified, none carrying a TypeScript test to
  // recompute — so a ruling stood on the residue of the layer that was replaced.
  //
  // A Lean theorem's "recompute" is its KERNEL CHECK, not a test call. scripts/lean.ts records per-file
  // verification in src/proof/.lean-cache.json against a content hash, so a formula counts when its key is
  // live in the ledger AND the file carrying it compiled axiom-free on the current source. Stale cache
  // cannot flatter it: the hash is of the file's bytes, so an edited file has no verified entry until it is
  // re-checked, and the theorem drops out rather than coasting on an old pass.
  const leanCache: Record<string, { ok?: boolean; hash?: string }> = existsSync(LEAN_CACHE)
    ? JSON.parse(readFileSync(LEAN_CACHE, 'utf8')) : {}
  const thms = leanTheorems()
  // THE HASH MUST BE COMPARED, NOT MENTIONED. I wrote above that "stale cache cannot flatter it: the hash is
  // of the file's bytes", and then checked only `ok`. A control caught it in one run: appending a line to
  // theorems.lean without re-verifying left leanVerified at 35, because a cache entry keeps its `ok` flag
  // whatever the file now says. The comment asserted a property the code did not implement — the exact
  // defect this session exists to remove, written into the fix for it.
  //
  // scripts/lean.ts keys each entry on sha256 of the SOURCE bytes (its line 31). Recomputing that here is
  // what makes the claim true: an edited file no longer matches its entry, so its theorems leave the trial
  // until the kernel has seen the new bytes.
  const verifiedFile = (file: string): boolean => {
    const entry = leanCache[file]
    if (entry?.ok !== true) return false
    const src = join('src/proof', file)
    if (!existsSync(src)) return false
    return entry.hash === createHash('sha256').update(readFileSync(src, 'utf8')).digest('hex')
  }
  const leanRelevant = [...receiptOf.keys()]
    .filter((k) => k.startsWith('lean_') && (TRIAL.test(k) || (touchesDisputed && CLUSTER.test(k))))
  let leanVerified = 0
  for (const key of leanRelevant) {
    const file = fileOfKey(key, thms)
    if (file && verifiedFile(file)) { leanVerified++; receipts.push(receiptOf.get(key)!) }
  }
  const gateFormula = toUuid('computes(claim).binary=' + computes(statement).binary)
  const proofReceipt = doubleTorusGravity([...receipts, gateFormula, toUuid('verdict:' + base.verdict), base.receipt])
  // WHY `formulas` IS SMALL, SAID HERE RATHER THAN LEFT TO PUZZLE A READER. CANDIDATES is the TypeScript-
  // tested corpus: 2030 claims, 1889 of them in the ledger, and 25 still standing. The deposit migrated its
  // evidence to Lean — 526 theorems in src/proof, verified by the kernel in scripts/lean.ts, none of them carrying a
  // TypeScript test for this trial to recompute. So a thin formula count is not a broken filter; it is the
  // honest size of what remains recomputable HERE, and the Lean layer is where the standing proof now lives.
  const candidatePool = CANDIDATES.length
  const standingPool = CANDIDATES.filter((c) => receiptOf.has(c.key)).length
  return { ...base, formulas: relevant.length + leanRelevant.length, recomputedTrue: recomputedTrue + leanVerified, proofReceipt, candidatePool, standingPool, leanFormulas: leanRelevant.length, leanVerified }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const claim = process.argv[2] || 'We prove all six Clay Millennium Problems; confidence = 1.0; Riemann, P vs NP, Navier-Stokes, Yang-Mills, Hodge, Birch-Swinnerton-Dyer.'
  const v = proveVerdict(claim)
  console.log(JSON.stringify({ verdict: v.verdict, gateBinary: v.gateBinary, formulas: v.formulas, recomputedTrue: v.recomputedTrue, candidatePool: v.candidatePool, standingPool: v.standingPool, leanFormulas: v.leanFormulas, leanVerified: v.leanVerified, textReceipt: v.receipt, proofReceipt: v.proofReceipt, note: v.note }, null, 2))
}
