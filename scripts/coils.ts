#!/usr/bin/env node
/** ── COILS — THE CROSS FORMULAS, DERIVED IN PAIRS ─────────────────────────────────────────────────────────
 *
 *  "Leave only cross formulas proving each other in clusters of lattice combinations" has been an open
 *  instruction in this tree for a long time, and it stayed open because I kept reaching for a list to write
 *  by hand and could not decide which lattice was the axis. It is not a list. The author's word for the
 *  mechanism is FUSION: coins fuse in pairs to coils.
 *
 *  A COIL is a set of two or more DIFFERENT expressions with the SAME extension over ℤ/9. Each pair inside
 *  one is two formulas proving each other — compute either and you have computed the other, so the pair is
 *  a cross formula and the coil is the cluster it belongs to. Nothing is chosen here: the expressions come
 *  from the same vocabulary scripts/imagine.ts proposes with, the extensions are computed, and the
 *  clustering is equality of extension. A coil nobody wrote appears the moment the vocabulary grows.
 *
 *  src/proof/closure.lean found ONE of these by hand and by accident — `isUnit` and `inSpan` turned out to
 *  denote the same set, which is this deposit's span-equals-units theorem arriving through a truth table.
 *  That coil has sixteen members. Finding the first fifteen by hand was never going to happen.
 *
 *  WHAT THIS IS NOT. A coil is an identity of EXTENSION, not of meaning: "the units" and "the doubling
 *  orbit" pick out the same six residues and are different ideas about them. The theorems it emits say
 *  exactly that the sets coincide, which is what was decided, and never that the ideas are the same.
 *
 *    node scripts/coils.ts            report the coils
 *    node scripts/coils.ts --emit     write src/proof/coils.lean and put it to the kernel */
import { writeFileSync } from 'node:fs'
import { units as apiUnits, triad as apiTriad, orbit as apiOrbit, tetA as apiTetA, tetB as apiTetB } from '../src/api/index.ts'

const m9 = (n: number) => ((n % 9) + 9) % 9
const RING = [0, 1, 2, 3, 4, 5, 6, 7, 8]

// The vocabulary, kept the same as scripts/imagine.ts on purpose: a coil this finds is a coil expressible
// in the language that generator already proposes in, not in a private one invented here.
const MAPS: [string, string, (d: number) => number][] = [
  ['double', 'm9 (2 * d)', (d) => m9(2 * d)], ['triple', 'm9 (3 * d)', (d) => m9(3 * d)],
  ['quadruple', 'm9 (4 * d)', (d) => m9(4 * d)], ['negate', 'm9 (9 - d)', (d) => m9(9 - d)],
  ['reflect', 'm9 (10 - d)', (d) => m9(10 - d)], ['square', 'm9 (d * d)', (d) => m9(d * d)],
  ['cube', 'm9 (d * d * d)', (d) => m9(d * d * d)], ['quintuple', 'm9 (5 * d)', (d) => m9(5 * d)],
  ['sextuple', 'm9 (6 * d)', (d) => m9(6 * d)], ['septuple', 'm9 (7 * d)', (d) => m9(7 * d)],
  ['octuple', 'm9 (8 * d)', (d) => m9(8 * d)],
]
// SERVED, NOT TYPED — the api refuses these if the theorem behind them stops standing.
const SETS: [string, number[]][] = [
  ['units', apiUnits().map(m9)], ['triad', apiTriad().map(m9)], ['orbit', apiOrbit().map(m9)],
  ['tetA', apiTetA().map(m9)], ['tetB', apiTetB().map(m9)], ['all', RING],
  ['squares', [...new Set(RING.map((d) => m9(d * d)))].sort((a, b) => a - b)],
  ['cubes', [...new Set(RING.map((d) => m9(d * d * d)))].sort((a, b) => a - b)],
  ['selfinv', RING.filter((d) => m9(d * d) === 1)],
  ['reflfixed', RING.filter((d) => m9(10 - d) === d)],
]

const sortU = (xs: number[]) => [...new Set(xs)].sort((a, b) => a - b)
const lean = (xs: number[]) => '[' + xs.join(', ') + ']'
type Expr = { say: string; lean: string; ext: string; set: number[] }
const exprs: Expr[] = []
const push = (say: string, l: string, set: number[]) => exprs.push({ say, lean: l, ext: sortU(set).join(','), set: sortU(set) })

// THE SET LITERAL KEEPS ITS OWN ORDER. Emitting the sorted form made "the set units" and "the set orbit"
// compile to the identical literal, so the theorem read `[1,2,4,5,7,8] == [1,2,4,5,7,8]` — true, and
// saying nothing about the two ideas it was supposed to identify. The orbit is [1,2,4,8,7,5]; that is the
// whole content of the coil and sorting it away deleted it.
for (const [id, S] of SETS) push(`the set ${id}`, lean(S), S)
// AND THE COMPARISON IS SET EQUALITY, NOT LIST EQUALITY. `mergeSort` does not reduce in this kernel —
// `decide` failed on every emitted theorem — and sorting was only ever there to make two orders match.
// Mutual containment plus a length on the deduped image is the same statement and needs no sort.
for (const [mid, mlean, f] of MAPS) for (const [sid, S] of SETS)
  push(`the image of ${sid} under ${mid}`, `IMAGE:${lean(S)}:${mlean}`, S.map(f))
for (const [mid, mlean, f] of MAPS)
  push(`the fixed points of ${mid}`, `[0,1,2,3,4,5,6,7,8].filter (fun d => ${mlean} == d)`, RING.filter((d) => f(d) === d))

const by = new Map<string, Expr[]>()
for (const e of exprs) { if (!by.has(e.ext)) by.set(e.ext, []); by.get(e.ext)!.push(e) }
const coils = [...by.values()].filter((g) => g.length > 1).sort((a, b) => b.length - a.length)
const pairs = coils.reduce((a, g) => a + (g.length * (g.length - 1)) / 2, 0)

/** A COIL OF ONE IS NOT A COIL, AND AN EMPTY RUN IS NOT A CLEAN ONE. If the vocabulary collapses — every
 *  expression computing the same thing, or none of them clustering — the report below would read as a
 *  discovery either way. Both ends are refused. */
if (!exprs.length || by.size < 2 || coils.length === 0) {
  console.log(`✗ coils: ${exprs.length} expression(s) over ${by.size} extension(s), ${coils.length} coil(s) —`)
  console.log(`  a vocabulary that clusters into everything or nothing is a broken vocabulary, not a result.`)
  process.exit(1)
}

console.log(`  ${exprs.length} expressions · ${by.size} distinct extensions · ${coils.length} coils · ${pairs} pairs that prove each other`)
for (const g of coils.slice(0, 8)) console.log(`  · {${g[0].set.join(',')}}  ${g.length} ways: ${g.slice(0, 4).map((e) => e.say).join(' = ')}${g.length > 4 ? ' = …' : ''}`)

if (!process.argv.includes('--emit')) { console.log('\n  run with --emit to write src/proof/coils.lean'); process.exit(0) }

// ── EMIT ────────────────────────────────────────────────────────────────────────────────────────────────
// One theorem per coil, stating that every expression in it has the same extension. The name is derived
// from the residues, so a coil that changes shape changes address rather than silently restating.
const named = (xs: number[]) => xs.length === 0 ? 'nothing' : xs.map((d) => ['zero','one','two','three','four','five','six','seven','eight'][d]).join('_')
// EVERY COIL, NOT THE FIRST TWELVE. A generated file that emits a prefix of what it found is a hand-picked
// list wearing a generator's clothes, and the cut was at twelve for no reason but that twelve looked like
// enough. The clustering decides the count.
const body = coils.map((g) => {
  const target = lean(g[0].set)
  const asProp = (l: string): string => {
    // PARENTHESISED BEFORE THE FIELD. `[0,…].filter (fun d => p d).all (…)` parses as `.filter (fun d =>
    // p d .all …)` — the projection binds to the lambda body, not to the list — and Lean rejected it with
    // "invalid field notation". Only the fixed-point expressions end in a lambda, which is why eleven of
    // twelve theorems compiled and one did not.
    if (!l.startsWith('IMAGE:')) { const L = `(${l})`
      return `(${L}.all (fun x => ${target}.contains x) && ${target}.all (fun x => ${L}.contains x))` }
    const [, src, fn] = l.match(/^IMAGE:(.*):(.*)$/s)!
    const img = `(${src}.map (fun d => ${fn}))`
    return `(${img}.all (fun x => ${target}.contains x) && ${target}.all (fun x => ${img}.contains x) && ${img}.eraseDups.length == ${g[0].set.length})`
  }
  const conj = g.map((e) => asProp(e.lean)).join('\n  && ')
  return `-- ${g.length} expressions, one extension: ${g.map((e) => e.say).join(' = ')}\n`
    + `theorem the_coil_on_${named(g[0].set)}_has_${g.length}_expressions :\n  ${conj} := by decide\n`
}).join('\n')

writeFileSync('src/proof/coils.lean', `set_option maxRecDepth 100000
-- title: Expressions that compute the same residues, clustered
-- wing: the ring
-- prior_art: named
-- prior_art_domain: extensional equality of predicates over a finite set — that two definitions picking out
--   the same elements are the same subset. Elementary set theory and modular arithmetic.
-- prior_art_note: NOT THIS DEPOSIT'S. "Two descriptions of the same set are equal" is the definition of a
--   set. What is this deposit's is which descriptions in ITS vocabulary turn out to coincide, and that the
--   clustering is derived rather than listed — this file is generated by scripts/coils.ts and hand-editing
--   it would be overwritten.
-- prior_art_search: not performed — extensionality is named above.
-- prior_art_pool: unbounded
-- prior_art_own: the coils below, and that they are computed from the vocabulary rather than chosen
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- GENERATED BY scripts/coils.ts — DO NOT EDIT BY HAND.
--
-- A COIL is a set of two or more different expressions with the same extension over ℤ/9. Each pair inside
-- one is two formulas proving each other: compute either and the other is computed. ${exprs.length} expressions in
-- the vocabulary collapse to ${by.size} extensions, leaving ${coils.length} coils and ${pairs} such pairs.
--
-- src/proof/closure.lean found one of these by hand and by accident: \`isUnit\` and \`inSpan\` denote the same
-- six residues, which is this deposit's span-equals-units theorem arriving through a truth table. That coil
-- has sixteen members, and finding the other fifteen by hand was never going to happen.
--
-- A COIL IS AN IDENTITY OF EXTENSION, NOT OF MEANING. "The units" and "the doubling orbit" pick out the
-- same six residues and remain different ideas about them. What is decided below is that the sets coincide.
--
-- No axioms, no Mathlib, no sorry.

namespace Coils

def m9 (n : Nat) : Nat := n % 9

${body}
end Coils
`)
console.log(`\n✓ coils: ${coils.length} coil(s) written to src/proof/coils.lean — run npm run lean to put them to the kernel`)
