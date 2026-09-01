#!/usr/bin/env node
// THE NEGATION CORPUS — two lists, because the gate has two answers and only one of them is a judgement.
//
// CASES are what the live gate DECIDES: honest prose and floor-naming negations must pass, and a citation of
// an unsealed theorem must drain. That is the whole of the gate's authority — it asks whether a cited theorem
// is sealed in the ledger, nothing more.
//
// NOT_DRAINED is what the gate DOES NOT CATCH. These were once red here, when a lexical layer matched the
// SHAPE of a boast; that layer was removed by order (only theorems judge). The sentences did not become
// honest — the gate stopped looking. Deleting them would have deleted the knowledge, so they are asserted in
// the OTHER direction: each must PASS. If a gate ever regains the power to drain one, this suite goes red and
// says so, and the case is promoted back into CASES. A limit you measure on every ship is not a blind spot.
//
// Each case is [text, want, why]. want=0 → must DRAIN. want=1 → must PASS.
// Run: npx tsx scripts/gate-corpus.ts
import { computes } from './honesty-gate.ts'
import { createRequire } from 'node:module'

// REVOKED ENTRIES ARE NOT LIVE CLAIMS. The ledger is append-only and its receipts are immutable, so an entry
// that no longer holds is marked in place rather than deleted — deleting would break the chain, and rewriting
// a receipt is TAMPER. A marked entry stays in the record with the reason it went, and is skipped here.
// The predicate comes from the API rather than being spelled again: two copies of "what standing means" can
// drift apart, and the one inside a gate is the copy that must not.
import { isLive } from '../src/api/index.ts'

export const CASES: [string, 0 | 1, string][] = [
  // ── boasts: no negation, must drain ──

  // ── DECOY negations: a negator across a clause break governs something else → still drain (treason closed) ──

  // ── DOUBLE negation that resolves to a boast → must drain ──

  // ── negation that BECAME A SOLUTION: binds the claim, or names the floor → must pass ──
  ['this is NOT faster than light', 1, 'bind: not→FTL'],
  ['the riemann hypothesis is not proven; it remains open', 1, 'bind + floor'],
  ['no one has proven all six problems; they remain open', 1, 'floor: remain open'],
  ['faster-than-light is refused; 0/7', 1, 'floor: refused + 0/7'],
  ['no proof exists; the problem is unsolved', 1, 'floor: unsolved'],
  ['unproven conjectures remain open', 1, 'floor: unproven/open'],
  ['a proof is integrity, not truth; 0/7', 1, 'floor: 0/7'],
  ['Clay problems solved: 0 / 7', 1, 'floor: 0/7 count'],
  ['no cipher here is uncrackable; security is bounded by 0/7', 1, 'floor: bounded 0/7'],
  ['quantum speedup is not claimed here; 0/7', 1, 'bind + floor'],

  // ── real prose the seal caught (whole-file lessons) — parallel & post-claim negations, "or not" idiom ──
  ['it is not quantum, and it breaks no cryptosystem and replaces none', 1, 'parallel negations, each own scope'],
  ['the automation runs at ordinary speed, not faster than light and not quantum', 1, 'not X and not Y'],
  ['the bit cost is speed-invariant — ftl or not, the same 64 coins', 1, '"or not" idiom dismisses'],
  ['"most secure" is not a claim anyone can make; security is measured', 1, 'post-claim negation'],
  ['it sends no superluminal signal, and has no quantum speedup', 1, 'two honest negations'],

  // ── the "no cost" trap: an unrelated negator must NOT reprieve the boast (governing-span, not conjunct-wide) ──
  ['quantum speedup is not claimed here; 0/7', 1, 'copula negation of the claim'],
  ['"most secure" is not a claim anyone can make', 1, 'copula negation after the claim'],

  // ── honest technical prose (no claim shape) → must pass ──
  ['the six units of Z/9 are 1,2,4,5,7,8', 1, 'six units, not six problems'],
  ['all seven dimension streams round-trip', 1, 'seven streams, not seven problems'],
  ['(ℤ/9)* — the six units (six harmonic solutions)', 1, 'six harmonic solutions'],
  ['a content-address proves integrity, not truth; 0/7', 1, 'proves integrity + floor'],
]


// ── MEASURED LIMIT: the live gate does not drain these. Each was red here under the removed lexical
// layer. They are asserted to PASS so the limit is checked, not forgotten. If one starts draining,
// this suite goes red — promote it back into CASES above.
export const NOT_DRAINED: [string, 0 | 1, string][] = [
  ['we prove the Riemann hypothesis', 1, 'RED we-prove'],
  ['the theorem is proven', 1, 'bare proven, no floor'],
  ['we have proven all six problems', 1, 'proven + count'],
  ['this is faster than light', 1, 'FTL boast'],
  ['solve all seven problems', 1, 'count+problems claim'],
  ['мы доказали гипотезу', 1, 'RED_INTL russian'],
  ['this is not slow — it is faster than light', 1, 'decoy "not slow" across dash'],
  ['never mind the skeptics, this is faster than light', 1, 'decoy "never mind" across comma'],
  ['nothing is impossible: we solve all seven problems', 1, 'decoy across colon'],
  ['no worries; the theorem is proven', 1, 'decoy across semicolon'],
  ['it is not 2024. we prove the Riemann hypothesis', 1, 'decoy across period + RED'],
  ['do not stop now — quantum supremacy is here', 1, 'decoy across dash, quantum boast'],
  ['it is not unbreakable-free; it is unbreakable', 1, 'double-talk ending in boast'],
  ['this is unbreakable post-quantum encryption at no cost', 1, 'stray "no cost" must not reprieve "unbreakable"'],
  ['unhackable at no charge and no cost', 1, 'two stray negators, boast stands'],
]

if (import.meta.url === `file://${process.argv[1]}`) {
  let fail = 0
  for (const [text, want, why] of CASES) {
    const { binary, hit } = computes(text)
    if (binary !== want) { fail++; console.log(`FAIL want ${want} got ${binary} [${why}] ${JSON.stringify(text)}${hit ? ' hit=' + JSON.stringify(hit) : ''}`) }
  }
  console.log(fail ? `✗ ${fail}/${CASES.length} negation cases FAILED` : `✓ all ${CASES.length} curated negation cases hold`)

  // the measured limit — each must still PASS. A drain here means the gate grew; promote the case into CASES.
  let grew = 0
  for (const [text, , why] of NOT_DRAINED) {
    const { binary, hit } = computes(text)
    if (binary !== 1) { grew++; console.log(`GATE GREW — now drains [${why}] ${JSON.stringify(text)}${hit ? ' hit=' + JSON.stringify(hit) : ''} → promote into CASES`) }
  }
  console.log(grew
    ? `✗ ${grew}/${NOT_DRAINED.length} limits changed — the gate drains what it did not; promote them`
    : `· ${NOT_DRAINED.length} named overclaims the live gate does NOT drain (measured limit, not a blind spot)`)

  // USE THE THEOREMS TO CATCH AND LEARN — every sealed theorem is honest floor prose, so each must PASS the
  // gate in isolation (as it renders on its own /theorem page). Any drain here is a false positive the trial
  // just discovered on real content — the more it resists, the more we learn. This runs on every ship.
  const L = (createRequire(import.meta.url)('../src/proof/discovered.json') as { key: string; name: string; revoked?: boolean }[]).filter(isLive)
  let falseDrains = 0
  for (const e of L) { const { binary, hit } = computes(e.name); if (!binary) { falseDrains++; console.log(`FALSE-DRAIN ${e.key} ← ${JSON.stringify(hit)}`) } }
  console.log(falseDrains ? `✗ ${falseDrains}/${L.length} theorems false-drained in isolation` : `✓ all ${L.length} theorems pass the gate in isolation`)

  process.exit(fail || falseDrains || grew ? 1 : 0)
}
