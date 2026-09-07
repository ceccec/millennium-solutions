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
 *  than a claim left withdrawn — so this ranks candidates by shared vocabulary and stops. Vocabulary overlap
 *  is evidence that two statements are ABOUT the same thing; it is not evidence that one decides the other,
 *  and only reading the Lean settles that. Confirmed pairs go into the tables in scripts/recover.ts, where
 *  each carries the range comparison that justifies it.
 *
 *      node scripts/candidates.ts            top pairs by overlap
 *      node scripts/candidates.ts --all      every pair above the floor
 */
import { ledger, statusOf, leanTheorems } from '../src/api/index.ts'

const STOP = new Set(['the', 'a', 'an', 'is', 'are', 'of', 'in', 'to', 'and', 'or', 'for', 'at', 'by', 'its',
  'it', 'that', 'this', 'with', 'on', 'as', 'not', 'no', 'every', 'all', 'each', 'one', 'two', 'be', 'from',
  'their', 'they', 'which', 'has', 'have', 'was', 'were', 'so', 'than', 'then', 'over', 'up', 'out', 'into',
  'verified', 'exhaustively', 'exhaustive', 'decidable', 'decided', 'computed', 'integrity', 'truth', 'here'])

const words = (s: string): Set<string> =>
  new Set(String(s).toLowerCase().replace(/[^a-z0-9]+/g, ' ').split(' ').filter((w) => w.length > 2 && !STOP.has(w)))

const l = ledger()
const live = new Set(l.filter((e) => statusOf(e, l) === 'standing').map((e) => String(e.key)))
const pool = l.filter((e) => statusOf(e, l) === 'withdrawn')
const thms = (leanTheorems() as { name: string; file: string; statement: string }[])
  .filter((t) => [...live].some((k) => k.endsWith('_' + t.name) || k === t.name))

// A theorem's vocabulary is its NAME, which is written in words in this deposit, plus its file's subject.
const thmWords = thms.map((t) => ({ t, w: words(t.name + ' ' + t.file.replace('.lean', '')) }))

type Pair = { key: string; claim: string; theorem: string; file: string; score: number; shared: string[] }
const pairs: Pair[] = []
for (const e of pool) {
  const cw = words(String(e.key) + ' ' + String(e.name))
  if (!cw.size) continue
  let best: Pair | null = null
  for (const { t, w } of thmWords) {
    const shared = [...cw].filter((x) => w.has(x))
    if (shared.length < 2) continue
    // Jaccard against the SMALLER set, so a short theorem name is not punished for being short
    const score = shared.length / Math.min(cw.size, w.size)
    if (!best || score > best.score) best = { key: String(e.key), claim: String(e.name).slice(0, 70), theorem: t.name, file: t.file, score, shared }
  }
  if (best && best.score >= 0.34) pairs.push(best)
}

pairs.sort((a, b) => b.score - a.score)
const show = process.argv.includes('--all') ? pairs : pairs.slice(0, 40)
console.log(`candidates — withdrawn claims whose vocabulary overlaps a live theorem's:\n`)
console.log(`  withdrawn pool                     ${pool.length}`)
console.log(`  live theorems to match against     ${thms.length}`)
console.log(`  pairs above the overlap floor       ${pairs.length}\n`)
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
