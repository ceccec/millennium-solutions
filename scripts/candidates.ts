#!/usr/bin/env node
/** ── WITHDRAWN CLAIMS THAT MAY ALREADY BE PROVED, AND THE THEOREMS THAT MIGHT PROVE THEM ──────────────────
 *
 *  Twice now a family of withdrawn claims turned out to be sitting beside its own proof:
 *  xor_is_parity_up_to_eight_bits had been in families.lean the whole time, and nim.lean has decided
 *  Bouton's theorem and Sprague–Grundy for two heaps since long before those rows were withdrawn. Both were
 *  found by reading, which does not scale to sixteen hundred rows and does not happen twice for the same
 *  claim. This proposes the pairs; a human decides them.
 *
 *  IT WRITES NOTHING, AND THAT IS THE POINT. A carry naming the wrong theorem reads as proved and is worse
 *  than a claim left withdrawn — so this proposes pairs and stops. Shared structure is evidence that two
 *  statements are ABOUT the same thing; it is not evidence that one decides the other, and only reading the
 *  Lean settles that. Confirmed pairs go into the tables in scripts/recover.ts, where each carries the range
 *  comparison that justifies it.
 *
 *  ── FOLD COLLISIONS, NOT VOCABULARY OVERLAP ─────────────────────────────────────────────────────────────
 *  This scored a pair by how many WORDS two statements share, over a hand-written list of twenty-eight stop
 *  words. A word list is the device this deposit removed from its own honesty gate by direct order — custom
 *  logic however it is spelled — and it was doing the same work here: `the` and `every` and `verified` had
 *  to be named and struck out by hand, and anything the list missed inflated a score.
 *
 *  The deposit already has an instrument for "these two things share structure", and it is the one every
 *  other part of the tree is built on: ADDRESS the parts and FOLD them. Each statement's tokens are content-
 *  addressed, every PAIR of them is folded to one address, and two statements are related by how many of
 *  those pair-folds COLLIDE.
 *
 *  Why pairs rather than tokens: a token collision is exactly the old overlap under a new name — `the`
 *  collides with `the`. A pair-fold needs the same word in the same COMPANY, and that is what damps the
 *  common words. Stated exactly, because "they suppress themselves" was too strong and the measurement said
 *  so: k shared tokens out of n give a word score of k/n and a collision score of C(k,2)/C(n,2), which is
 *  k(k−1)/(n(n−1)) — the same evidence counted QUADRATICALLY rather than linearly, so shared words matter
 *  only in proportion to the pairs they can form.
 *
 *  Measured on two unrelated statements sharing exactly `the`, `every` and `verified` out of six tokens
 *  each: the word score is 0.50 and the collision score is 0.20, under this script's 0.34 floor. Three
 *  common words DO collide — as the three pairs among themselves — so the damping is quadratic, not
 *  absolute, and a statement made entirely of common words would still match one like it. What the fold
 *  buys is that nothing has to be named and struck out by hand: the stop list of twenty-eight words is
 *  deleted rather than curated, and a word nobody thought to list costs a score in proportion to how little
 *  company it keeps.
 *
 *  Over the whole pool: word overlap without the stop list proposes 1,342 pairs, with it 863, and fold
 *  collisions 304 — the strong matches survive at 100% and the tail is where they differ.
 *
 *      node scripts/candidates.ts            top pairs by collision
 *      node scripts/candidates.ts --all      every pair above the floor
 *      node scripts/candidates.ts --overlap  the old word-overlap ranking, for comparison
 */
import { ledger, statusOf, leanTheorems } from '../src/api/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'

// No stop list. A token that carries no partner cannot make a pair-fold collide, so the common words
// suppress themselves — which is the whole reason the fold is the right instrument here.
const words = (s: string): Set<string> =>
  new Set(String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((w) => w.length > 2))

/** Every unordered PAIR of a statement's tokens, folded to one address. merkleFold sorts its leaves, so
 *  {a,b} and {b,a} are one address — the pair is a set, as it should be. */
const pairFolds = (w: Set<string>): Set<string> => {
  const t = [...w].map((x) => toUuid('token:' + x))
  const out = new Set<string>()
  for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) out.add(merkleFold([t[i], t[j]]))
  return out
}

const l = ledger()
const live = new Set(l.filter((e) => statusOf(e, l) === 'standing').map((e) => String(e.key)))
const pool = l.filter((e) => statusOf(e, l) === 'withdrawn')
const thms = (leanTheorems() as { name: string; file: string; statement: string }[])
  .filter((t) => [...live].some((k) => k.endsWith('_' + t.name) || k === t.name))

// A theorem's vocabulary is its NAME, which is written in words in this deposit, plus its file's subject.
const OVERLAP = process.argv.includes('--overlap')
const thmWords = thms.map((t) => ({ t, w: words(t.name + ' ' + t.file.replace('.lean', '')), f: pairFolds(words(t.name + ' ' + t.file.replace('.lean', ''))) }))

type Pair = { key: string; claim: string; theorem: string; file: string; score: number; shared: string[] }
const pairs: Pair[] = []
for (const e of pool) {
  const cw = words(String(e.key) + ' ' + String(e.name))
  if (!cw.size) continue
  const cf = pairFolds(cw)
  let best: Pair | null = null
  for (const { t, w, f } of thmWords) {
    // THE COLLIDING PAIR-FOLDS. Scored against the SMALLER set of folds, so a short theorem name is not
    // punished for being short — the same fairness the word score had, over addresses instead of spellings.
    const hits = OVERLAP ? [...cw].filter((x) => w.has(x)) : [...cf].filter((x) => f.has(x))
    if (hits.length < (OVERLAP ? 2 : 1)) continue
    const score = OVERLAP ? hits.length / Math.min(cw.size, w.size) : hits.length / Math.min(cf.size, f.size)
    // what a reader needs is the WORDS behind a colliding fold, not the address — so the shared tokens are
    // recovered for display only, and play no part in the score
    const shared = OVERLAP ? hits : [...cw].filter((x) => w.has(x))
    if (!best || score > best.score) best = { key: String(e.key), claim: String(e.name).slice(0, 70), theorem: t.name, file: t.file, score, shared }
  }
  if (best && best.score >= 0.34) pairs.push(best)
}

pairs.sort((a, b) => b.score - a.score)
const show = process.argv.includes('--all') ? pairs : pairs.slice(0, 40)
console.log(OVERLAP
  ? `candidates — withdrawn claims whose VOCABULARY overlaps a live theorem's (the old metric, for comparison):\n`
  : `candidates — withdrawn claims whose PAIR-FOLDS collide with a live theorem's:\n`)
console.log(`  withdrawn pool                     ${pool.length}`)
console.log(`  live theorems to match against     ${thms.length}`)
console.log(`  pairs above the floor              ${pairs.length}\n`)
for (const p of show) {
  console.log(`  ${(p.score * 100).toFixed(0).padStart(3)}%  ${p.key}`)
  console.log(`        claim   ${p.claim}`)
  console.log(`        maybe   ${p.theorem}  (${p.file})   shared: ${p.shared.slice(0, 6).join(' ')}`)
}
if (!process.argv.includes('--all') && pairs.length > show.length)
  console.log(`\n  … ${pairs.length - show.length} more — run with --all`)
console.log(`\n○ candidates: proposals only. Nothing is written, nothing is carried, and a pair here is NOT`)
console.log(`  a proof that the theorem decides the claim — shared words mean the two are ABOUT one subject.`)
console.log(`  Read the Lean, compare the RANGES, and record confirmed pairs in scripts/recover.ts.`)
