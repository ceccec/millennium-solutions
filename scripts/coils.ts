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
 *  CROSS-FORMULATION IS NOT ABOUT ℤ/9. The clustering is "evaluate every expression at every point of a
 *  grid and group by the resulting vector", and the grid can be anything finite. So the engine takes a
 *  LIST OF VOCABULARIES and the ring is only the first of them. The second is the address layout, where a
 *  capacity and a birthday exponent are expressions over (width, reserved) — and where the deposit's prose
 *  had been quoting 2^128 for a space that holds 2^122, because the honest figure existed as a bit count
 *  and never as the number anyone actually cites.
 *
 *  Adding a vocabulary is adding a grid and some expressions. Nothing else changes, and every coil it finds
 *  is found the same way as every other.
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

// ── VOCABULARY 2 · THE ADDRESS LAYOUT ────────────────────────────────────────────────────────────────────
// The grid is every reservation from 0 to 32 bits of a 128-bit container; an expression is a number
// computed at each point, and two expressions coil when they agree at every point. This is where the
// deposit's own overclaim lives: `2 ^ 128` and `2 ^ (128 - reserved)` are NOT in the same coil, and prose
// had been using one for the other.
type NumExpr = { say: string; lean: string; at: (r: number) => bigint }
const GRID = Array.from({ length: 33 }, (_, i) => i)
const numExprs: NumExpr[] = [
  { say: 'the container size 2^128', lean: '2 ^ 128', at: () => 2n ** 128n },
  { say: 'the capacity 2^(128-reserved)', lean: '2 ^ (128 - r)', at: (r) => 2n ** BigInt(128 - r) },
  { say: 'the container divided by the reservation', lean: '2 ^ 128 / 2 ^ r', at: (r) => 2n ** 128n / 2n ** BigInt(r) },
  { say: 'the container shifted right by the reservation', lean: '2 ^ 128 / 2 ^ r', at: (r) => (2n ** 128n) >> BigInt(r) },
  { say: 'the birthday bound on the capacity', lean: '2 ^ ((128 - r) / 2)', at: (r) => 2n ** BigInt(Math.floor((128 - r) / 2)) },
  { say: 'the birthday bound on the container', lean: '2 ^ 64', at: () => 2n ** 64n },
  { say: 'the reservation cost', lean: '2 ^ r', at: (r) => 2n ** BigInt(r) },
  { say: 'the capacity times the reservation cost', lean: '2 ^ (128 - r) * 2 ^ r', at: (r) => 2n ** BigInt(128 - r) * 2n ** BigInt(r) },
]
const numBy = new Map<string, NumExpr[]>()
for (const e of numExprs) { const k = GRID.map(e.at).join('|'); if (!numBy.has(k)) numBy.set(k, []); numBy.get(k)!.push(e) }
const numCoils = [...numBy.values()].filter((g) => g.length > 1).sort((a, b) => b.length - a.length)
const numPairs = numCoils.reduce((a, g) => a + (g.length * (g.length - 1)) / 2, 0)

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

// ── WHICH COILS CROSS A DOMAIN, AND WHICH STAY HOME ──────────────────────────────────────────────────────
// A coil says two expressions compute the same thing. That is worth most when the two come from DIFFERENT
// domains — the units are group theory, the doubling orbit is a discrete dynamical system, the reflection
// is geometry, the squares and cubes are elementary number theory. A coil spanning them says one result
// answers a question asked in several languages, which is what lets a result in one domain explain a
// problem in another. A coil whose members all sit in one domain is a restatement inside that domain: true,
// and explaining nothing across.
//
// The domains are DECLARED, not guessed — each name below is the field the deposit's own vocabulary places
// that object in, and an expression inherits the domain of the map or set it is built from.
const DOMAIN: Record<string, string> = {
  units: 'group theory', triad: 'group theory', selfinv: 'group theory', primitives: 'group theory',
  orbit: 'dynamics', double: 'dynamics', quadruple: 'dynamics', octuple: 'dynamics',
  reflect: 'geometry', negate: 'geometry', reflfixed: 'geometry',
  tetA: 'geometry', tetB: 'geometry',
  square: 'number theory', cube: 'number theory', squares: 'number theory', cubes: 'number theory',
  triple: 'number theory', quintuple: 'number theory', sextuple: 'number theory', septuple: 'number theory',
  all: 'the ring',
}
const domainsOf = (say: string) => [...new Set(Object.keys(DOMAIN).filter((k) => new RegExp('\\b' + k + '\\b', 'i').test(say)).map((k) => DOMAIN[k]))]
const spans = coils.map((g) => ({ g, doms: [...new Set(g.flatMap((e) => domainsOf(e.say)))].filter((d) => d !== 'the ring') }))
const crossing = spans.filter((x) => x.doms.length > 1).sort((a, b) => b.doms.length - a.doms.length)

console.log(`  ring     : ${exprs.length} expressions · ${by.size} distinct extensions · ${coils.length} coils · ${pairs} pairs that prove each other`)
console.log(`  address  : ${numExprs.length} expressions over ${GRID.length} reservations · ${numBy.size} distinct values · ${numCoils.length} coils · ${numPairs} pairs`)
for (const g of numCoils) console.log(`  · ${g.length} ways: ${g.map((e) => e.say).join(' = ')}`)
// THE SPLIT IS THE FINDING. Expressions that do NOT coil are the ones prose must never interchange, and
// the container size against the capacity is exactly such a pair.
const alone = numExprs.filter((e) => !numCoils.some((g) => g.includes(e)))
if (alone.length) console.log(`  · ${alone.length} address expression(s) coil with NOTHING — never interchangeable: ${alone.map((e) => e.say).join(' · ')}`)
console.log(`  CROSS-DOMAIN: ${crossing.length} of ${coils.length} coils span more than one declared domain — those are the ones`)
console.log(`  that let a result in one field answer a question asked in another. ${coils.length - crossing.length} stay inside one.`)
for (const x of crossing.slice(0, 5)) console.log(`  ✳ {${x.g[0].set.join(',')}}  ${x.doms.join(' ↔ ')}  — ${x.g.length} ways`)
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

// ── THE ADDRESS COILS, EMITTED THE SAME WAY ──────────────────────────────────────────────────────────────
// One theorem per coil: the members agree at every reservation in the grid. And one theorem for the pair
// that does NOT coil, because "these two are never interchangeable" is the statement prose needed and
// never had — it is what makes quoting the container size as the capacity contradict the kernel.
const numBody = numCoils.map((g, i) => {
  const conj = g.slice(1).map((e) => `(${g[0].lean}) == (${e.lean})`).join('\n       && ')
  return `-- ${g.map((e) => e.say).join(' = ')}\n`
    + `theorem the_address_coil_${['first','second','third','fourth'][i] ?? String(i)}_holds_at_every_reservation :\n`
    + `  (List.range 33).all (fun r => ${conj}) := by decide\n`
}).join('\n')
  + `\n-- AND THE ONE THAT IS NOT A COIL. The container size and the capacity agree ONLY when nothing is\n`
  + `-- reserved, so substituting one for the other asserts a reservation of zero — which RFC 9562 forbids.\n`
  + `theorem the_container_and_the_capacity_are_not_interchangeable :\n`
  + `  (List.range 33).all (fun r => ((2 ^ 128) == (2 ^ (128 - r))) == (r == 0)) := by decide\n`

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
${numBody}
end Coils
`)
console.log(`\n✓ coils: ${coils.length} coil(s) written to src/proof/coils.lean — run npm run lean to put them to the kernel`)
