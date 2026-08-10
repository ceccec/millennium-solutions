#!/usr/bin/env node
// THE NEGATION CORPUS — the trial's training ground. "Whatever is negated, deep-research in trial": a negation
// is never a free pass. It reprieves a claim ONLY when it BECOMES A SOLUTION — it names the computed floor
// (0/7, unsolved, remains open, refused, bounded) OR it binds the claim adjacently with no clause break. A
// decoy negator on the far side of a clause break is TREASON (it smuggles a boast past) and must still drain.
//
// Each case is [text, want, why]. want=0 → must DRAIN (an overclaim). want=1 → must PASS (honest / floor).
// This file is meant to GROW: add every new negation shape the trial should learn. Run: npx tsx scripts/gate-corpus.ts
import { computes } from './honesty-gate.ts'
import { createRequire } from 'node:module'

export const CASES: [string, 0 | 1, string][] = [
  // ── boasts: no negation, must drain ──
  ['we prove the Riemann hypothesis', 0, 'RED we-prove'],
  ['the theorem is proven', 0, 'bare proven, no floor'],
  ['we have proven all six problems', 0, 'proven + count'],
  ['this is faster than light', 0, 'FTL boast'],
  ['solve all seven problems', 0, 'count+problems claim'],
  ['мы доказали гипотезу', 0, 'RED_INTL russian'],

  // ── DECOY negations: a negator across a clause break governs something else → still drain (treason closed) ──
  ['this is not slow — it is faster than light', 0, 'decoy "not slow" across dash'],
  ['never mind the skeptics, this is faster than light', 0, 'decoy "never mind" across comma'],
  ['nothing is impossible: we solve all seven problems', 0, 'decoy across colon'],
  ['no worries; the theorem is proven', 0, 'decoy across semicolon'],
  ['it is not 2024. we prove the Riemann hypothesis', 0, 'decoy across period + RED'],
  ['do not stop now — quantum supremacy is here', 0, 'decoy across dash, quantum boast'],

  // ── DOUBLE negation that resolves to a boast → must drain ──
  ['it is not unbreakable-free; it is unbreakable', 0, 'double-talk ending in boast'],

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
  ['this is unbreakable post-quantum encryption at no cost', 0, 'stray "no cost" must not reprieve "unbreakable"'],
  ['unhackable at no charge and no cost', 0, 'two stray negators, boast stands'],
  ['quantum speedup is not claimed here; 0/7', 1, 'copula negation of the claim'],
  ['"most secure" is not a claim anyone can make', 1, 'copula negation after the claim'],

  // ── honest technical prose (no claim shape) → must pass ──
  ['the six units of Z/9 are 1,2,4,5,7,8', 1, 'six units, not six problems'],
  ['all seven dimension streams round-trip', 1, 'seven streams, not seven problems'],
  ['(ℤ/9)* — the six units (six harmonic solutions)', 1, 'six harmonic solutions'],
  ['a content-address proves integrity, not truth; 0/7', 1, 'proves integrity + floor'],
]

if (import.meta.url === `file://${process.argv[1]}`) {
  let fail = 0
  for (const [text, want, why] of CASES) {
    const { binary, hit } = computes(text)
    if (binary !== want) { fail++; console.log(`FAIL want ${want} got ${binary} [${why}] ${JSON.stringify(text)}${hit ? ' hit=' + JSON.stringify(hit) : ''}`) }
  }
  console.log(fail ? `✗ ${fail}/${CASES.length} negation cases FAILED` : `✓ all ${CASES.length} curated negation cases hold`)

  // USE THE THEOREMS TO CATCH AND LEARN — every sealed theorem is honest floor prose, so each must PASS the
  // gate in isolation (as it renders on its own /theorem page). Any drain here is a false positive the trial
  // just discovered on real content — the more it resists, the more we learn. This runs on every ship.
  const L = createRequire(import.meta.url)('../src/proof/discovered.json') as { key: string; name: string }[]
  let falseDrains = 0
  for (const e of L) { const { binary, hit } = computes(e.name); if (!binary) { falseDrains++; console.log(`FALSE-DRAIN ${e.key} ← ${JSON.stringify(hit)}`) } }
  console.log(falseDrains ? `✗ ${falseDrains}/${L.length} theorems false-drained in isolation` : `✓ all ${L.length} theorems pass the gate in isolation`)

  process.exit(fail || falseDrains ? 1 : 0)
}
