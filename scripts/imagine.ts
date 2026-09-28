#!/usr/bin/env node
// IMAGINE — propose theorems nobody wrote, then let the kernel throw most of them away.
//
// lean-gen.ts proves families the LEDGER ALREADY NAMES, at scale. This does the other half: it enumerates the
// whole space of statements the ℤ/9 primitives can express — every map against every subset, and every map
// between every PAIR of subsets — evaluates all of them over the finite domain at once, and keeps the ones
// that survive. Imagining is cheap and worthless on its own; the value is entirely in what the filters kill.
//
// FIVE filters, in order. Each exists because the obvious version of this script is a padding machine:
//   0. CROSS-FORMULATED — the statement must relate two DIFFERENT expressions over an element it actually
//                      mentions. Deriving the map table reached the identity (whose composites are X == X)
//                      and the constant maps (which ignore the variable they quantify over); neither states
//                      anything, and the kernel was recursing to its depth limit on the first kind.
//   1. TRUE          — evaluated by exhaustion over the domain. Anything false is dropped, not weakened until
//                      it passes. A proposal is not a draft to be negotiated with.
//   2. NOT ALREADY SAID — a statement already expressed in src/proof/*.lean is not a discovery. Matched on the
//                      normalised proposition, not the name, so rewording cannot smuggle a duplicate through.
//   3. DISCRIMINATING — the statement must FAIL for at least one sibling in the same family. A property true
//                      of every subset says nothing about the one it names: "closed under the identity" holds
//                      everywhere and is worth nothing. This is the filter that kills most of them, and it is
//                      the reason the output is small.
//   4. KERNEL        — Lean must accept it and #print axioms must report none. The three filters above run in
//                      TypeScript, which reports that a computation agreed once; only the kernel checks the
//                      proposition. Anything the kernel refutes is reported, never quietly dropped.
//
// ON "EXHAUSTED", WHICH THIS GENERATOR NEVER IS. Its yield is a function of its VOCABULARY, not of the
// mathematics: the first version proposed 336 statements, adding the rest of the multiplication table took it
// to 480, the squares and cubes to 800, and powers four to six to 1040 — each extension producing genuinely
// new discriminating theorems the previous run could not express. Powers stop at six because Euler's theorem
// closes the unit structure there (u⁶ = 1), which is a reason rather than a stopping point; but d↦d⁷ is still
// a distinct map on ℤ/9, so even that boundary is a choice. Calling any state of this "exhausted" would be
// describing the vocabulary and crediting it to the domain. It is a knob, and the honest report is what it
// currently reaches, never that there is nothing left.
//
// Run: node scripts/imagine.ts          (propose and report)
//      node scripts/imagine.ts --emit   (also write src/proof/imagined*.lean and verify them)
import { existsSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { flag } from '../src/cli/index.ts'
import { execSync } from 'node:child_process'
import { createHash } from 'node:crypto'
// the cache scripts/lean.ts writes; its shape is that file's, read here and never written here.
const LEAN_CACHE = 'src/proof/.lean-cache.json'
const LEAN_CACHE_FORMAT = 3
import { units as apiUnits, triad as apiTriad, orbit as apiOrbit, tetA as apiTetA, tetB as apiTetB } from '../src/api/index.ts'
import { leanFiles } from '../src/api/index.ts'

const m9 = (n: number) => ((n % 9) + 9) % 9
const RING = [0, 1, 2, 3, 4, 5, 6, 7, 8]

// ── the primitives, each a total map on ℤ/9 ──────────────────────────────────────────────────────────────
// ── THE MAPS, DERIVED — BECAUSE A TYPED TABLE IS THE HAND STILL INSIDE THE MACHINE ───────────────────────
// This was a literal list, and every widening of it was a line somebody typed after noticing a question the
// generator could not ask: the rest of the multiplication table, the powers, the reflection, the shifts. The
// header of this file says the vocabulary is the limit and never that the vocabulary must be CHOSEN — and
// the note on the SETS table below already made the whole argument, about sets: computed, not typed, because
// a literal is a fourth copy of something the tree proves and nobody checks. It was never applied here.
// While it wasn't, the generator's reach was a record of what its author had thought of that week.
//
// So the maps are enumerated from the ring instead. ℤ/9's affine maps are d ↦ a·d + b over every a and b it
// has — 81 of them, and they CONTAIN every entry of the old table: each multiplication is b = 0, each shift
// is a = 1, negation is a = 8, and the reflection this deposit is named for is a = 8, b = 1. Not one of them
// has to be noticed. The powers are the non-affine family and Euler closes them at six, which is a reason
// rather than a stopping point. Two maps with the SAME EXTENSION are one map, so the enumeration is
// deduplicated by what the maps DO — the way this repository decides equality of expressions everywhere else.
type MapDef = { id: string; lean: string; say: string; f: (d: number) => number }
const MAPS: MapDef[] = []
const extSig = (f: (d: number) => number) => RING.map(f).join(',')
const takenMap = new Set<string>()
const offerMap = (m: MapDef) => { const g = extSig(m.f); if (takenMap.has(g)) return; takenMap.add(g); MAPS.push(m) }
// SPELLED THE WAY THE DEPOSIT ALREADY SPELLS THEM, WHICH IS NOT COSMETIC. The first derived version emitted
// `m9 (2 * d + 0)` for doubling. Filter 2 recognises a statement the tree already contains by its TEXT after
// expanding definitions, so a trailing `+ 0` made every multiplication theorem look new: the filter dropped
// 1117 candidates before this change and ZERO after it, which is the filter failing silently rather than the
// generator finding more. Each affine map is written in its shortest true form, so the enumeration meets the
// existing corpus in the same spelling it uses.
const affLean = (a: number, b: number) =>
  a === 0 ? `${b}`
  : a === 1 ? (b === 0 ? 'd' : `m9 (d + ${b})`)
  : b === 0 ? `m9 (${a} * d)`
  : `m9 (${a} * d + ${b})`
const affSay = (a: number, b: number) =>
  a === 0 ? `the constant ${b}`
  : a === 1 ? (b === 0 ? 'the identity' : `the shift by ${b}`)
  : b === 0 ? `multiplication by ${a}`
  : `d ↦ ${a}d + ${b}`
for (const a of RING) for (const b of RING)
  offerMap({ id: `aff_${a}_${b}`, lean: affLean(a, b), say: affSay(a, b), f: (d) => m9(a * d + b) })
for (const k of [2, 3, 4, 5, 6])
  offerMap({ id: `pow_${k}`, lean: `m9 (d ^ ${k})`, say: `the ${k}th power`, f: (d) => m9(d ** k) })
console.log(`  maps: ${MAPS.length} derived from the ring (81 affine + 5 powers, deduplicated by extension)`)

// ── the subsets, each a named structure the deposit already talks about ──────────────────────────────────
// THE SETS ARE COMPUTED, NOT TYPED. These were literals — a third copy of sets that src/0 computes and
// src/proof proves, checked by no gate at all. The generator would have gone on proposing theorems about
// ℤ/9 after the modulus moved, because its idea of the units was a row of digits nobody was checking. They
// are served through the API now, which refuses them if the theorem behind them stops standing.
const asLean = (xs: number[]) => '[' + xs.map((x) => m9(x)).join(', ') + ']'
const SETS: { id: string; lean: string; say: string; s: number[] }[] = [
  { id: 'units', lean: asLean(apiUnits()),   say: 'the units',                s: apiUnits().map(m9) },
  { id: 'triad', lean: asLean(apiTriad()),   say: 'the triad',                s: apiTriad().map(m9) },
  { id: 'orbit', lean: asLean(apiOrbit()),   say: 'the doubling orbit',       s: apiOrbit().map(m9) },
  { id: 'tetA',  lean: asLean(apiTetA()),    say: 'the first tetrahedron',    s: apiTetA() },
  { id: 'tetB',  lean: asLean(apiTetB()),    say: 'the second tetrahedron',   s: apiTetB() },
  { id: 'all',   lean: '[0,1,2,3,4,5,6,7,8]',say: 'the whole ring',           s: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  // the residues that are squares, and the ones that are cubes — the images of the two maps already in the
  // table above. A map's image is a structure in its own right, and asking what the OTHER maps do to it is a
  // question the generator could always have asked and was never given the vocabulary for.
  { id: 'squares', lean: '[0, 1, 4, 7]', say: 'the squares mod nine', s: [0, 1, 4, 7] },
  { id: 'cubes',   lean: '[0, 1, 8]',    say: 'the cubes mod nine',   s: [0, 1, 8] },
]
// ── THREE MORE STRUCTURES, DERIVED RATHER THAN LISTED ───────────────────────────────────────────────────
// src/proof/closure.lean named nine properties of ℤ/9 that this deposit reasons about, and three of them
// were structures this generator had no word for: the primitive roots, the self-inverse residues, and the
// residues the reflection fixes. Each is COMPUTED from the ring below — a literal here would be a fourth
// copy of a set the tree already proves, which is the defect the note above this table records.
const selfInv = RING.filter((d) => m9(d * d) === 1)
const reflFixed = RING.filter((d) => m9(10 - d) === d)
const isPrimitiveRoot = (g: number) => {
  const seen = new Set<number>()
  let x = 1
  for (let k = 1; k <= 9; k++) { x = m9(x * g); seen.add(x) }
  return apiUnits().map(m9).every((u) => seen.has(u)) && seen.size === apiUnits().length
}
const primitives = RING.filter(isPrimitiveRoot)
for (const [id, say, s] of [['primitives', 'the primitive roots', primitives],
                            ['selfinv', 'the self-inverse residues', selfInv],
                            ['reflfixed', 'the residues the reflection fixes', reflFixed]] as [string, string, number[]][]) {
  // A SET THAT CAME OUT EMPTY WOULD MAKE EVERY PROPOSAL ABOUT IT VACUOUSLY TRUE, and `all` over nothing is
  // the failure this repository keeps finding. An empty structure is dropped with its name said, not fed in.
  if (!s.length) { console.log(`  ○ ${say}: computed empty on this ring — not proposed about`); continue }
  SETS.push({ id, lean: asLean(s), say, s })
}

// ── EVERY MAP'S IMAGE AND FIXED SET, DERIVED — THE SET TABLE'S OWN PRINCIPLE, APPLIED TO ALL OF THEM ─────
// The note on `squares` and `cubes` above states the principle outright: a map's image is a structure in its
// own right, and asking what the OTHER maps do to it is a question the generator was never given the
// vocabulary for. It was then applied to exactly two maps, by hand, as literal lists — while the table holds
// twenty-two. The same is true of a map's FIXED SET: `reflfixed` is derived for the reflection alone.
//
// So both are derived for every map instead of typed for a favourite few. A set that comes out empty, or that
// duplicates one already in the table, is dropped with its reason — a second copy of the units under another
// name would make every statement about it a restatement, and an empty set makes them all vacuous.
const seen = new Set(SETS.map((S) => [...S.s].sort((a, b) => a - b).join(',')))
for (const m of MAPS) {
  for (const [suffix, say, s] of [
    ['image', `the image of ${m.say}`, [...new Set(RING.map(m.f))].sort((a, b) => a - b)],
    ['fixed', `the residues ${m.say} fixes`, RING.filter((d) => m.f(d) === d)],
  ] as [string, string, number[]][]) {
    const sig = s.join(',')
    if (!s.length) { console.log(`  ○ ${say}: computed empty on this ring — not proposed about`); continue }
    if (seen.has(sig)) continue
    seen.add(sig)
    SETS.push({ id: `${m.id}_${suffix}`, lean: asLean(s), say, s })
  }
}

type Cand = { key: string; prop: string; say: string; kind: string; holds: boolean }
const cands: Cand[] = []

// CLOSURE — f maps S into S.
for (const m of MAPS) for (const S of SETS) {
  const holds = S.s.every((d) => S.s.includes(m.f(d)))
  cands.push({ kind: 'closure:' + m.id, key: `${S.id}_is_closed_under_${m.id}`, holds,
    prop: `${S.lean}.all (fun d => ${S.lean}.contains (${m.lean}))`,
    say: `${S.say} is closed under ${m.say}` })
}
// INVOLUTION — f∘f is the identity on S.
for (const m of MAPS) for (const S of SETS) {
  const holds = S.s.every((d) => m.f(m.f(d)) === d)
  cands.push({ kind: 'involution:' + m.id, key: `${m.id}_is_involutive_on_${S.id}`, holds,
    // every occurrence of the bound variable, not the first: String.replace with a string argument
    // substitutes once, so `m9 (d * d)` became `m9 (x * d)` and the kernel refuted the result. It was right to.
    prop: `${S.lean}.all (fun d => (fun x => ${m.lean.replace(/\bd\b/g, 'x')}) (${m.lean}) == d)`,
    say: `${m.say} is its own inverse on ${S.say}` })
}
// EXCHANGE — f carries S onto a DIFFERENT set T.
for (const m of MAPS) for (const S of SETS) for (const T of SETS) {
  if (S.id === T.id) continue
  const holds = S.s.every((d) => T.s.includes(m.f(d))) && new Set(S.s.map(m.f)).size === T.s.length
  cands.push({ kind: 'exchange:' + m.id + ':' + T.id, key: `${m.id}_carries_${S.id}_onto_${T.id}`, holds,
    prop: `${S.lean}.all (fun d => ${T.lean}.contains (${m.lean})) ∧ (${S.lean}.map (fun d => ${m.lean})).eraseDups.length = ${T.s.length}`,
    say: `${m.say} carries ${S.say} onto ${T.say}` })
}
// COLLAPSE — f sends all of S to ONE value: the strongest possible statement about a map's image.
for (const m of MAPS) for (const S of SETS) {
  const img = new Set(S.s.map(m.f))
  const holds = img.size === 1
  cands.push({ kind: 'collapse:' + m.id, key: `${m.id}_collapses_${S.id}_to_one_value`, holds,
    prop: `(${S.lean}.map (fun d => ${m.lean})).eraseDups.length = 1`,
    say: `${m.say} sends every element of ${S.say} to a single value` })
}

// ── THE FOLD, WHICH THIS VOCABULARY HAD NO WORD FOR ──────────────────────────────────────────────────────
// Every relation above is POINTWISE: a map applied to each element of a set, compared elementwise. That is
// why the generator could never propose anything about an ARRAY as a whole, and why the statements answering
// "are arrays and hashes results of cross formulas" had to be written by hand into extension.lean — the
// generator existing to propose exactly those had no word for the operation that takes a list to a value.
//
// The fold is that word. It is the array→address step the whole deposit runs on: receipt chains, merkle
// roots and digit-root addresses are all a list collapsed by a commutative operation. Adding it asks five
// questions per map and set that no pointwise relation can express — and the SAME four filters judge them,
// so what survives is what the kernel keeps, not what was wanted.
const foldOf = (xs: number[]) => m9(xs.reduce((a, b) => a + b, 0))
const leanFold = (expr: string, S: string) => `m9 ((${S}.map (fun d => ${expr})).foldl (fun a b => a + b) 0)`
const sub = (lean: string, v: string) => lean.replace(/\bd\b/g, v)

for (const m of MAPS) for (const S of SETS) {
  const img = S.s.map(m.f)
  const plain = foldOf(S.s)
  // INJECTIVE — the fibres are singletons. A hash with a collision is not this, which is exactly the
  // distinction the arrays/hashes question turns on: a map's output agreeing does not lift to its input.
  cands.push({ kind: 'injective:' + m.id, key: `${m.id}_is_injective_on_${S.id}`,
    holds: new Set(img).size === S.s.length,
    prop: `(${S.lean}.map (fun d => ${m.lean})).eraseDups.length = ${S.s.length}`,
    say: `${m.say} collides nowhere on ${S.say} — every fibre is a single element` })
  // FOLD-HOMOMORPHISM — folding then mapping equals mapping then folding. The strongest thing that can be
  // said about a map against an array: the array may be collapsed before or after, and nobody can tell.
  cands.push({ kind: 'foldhom:' + m.id, key: `${m.id}_commutes_with_the_fold_on_${S.id}`,
    holds: foldOf(img) === m.f(plain),
    prop: `${leanFold(m.lean, S.lean)} = ${sub(m.lean, `(m9 (${S.lean}.foldl (fun a b => a + b) 0))`)}`,
    say: `${m.say} may be applied before or after folding ${S.say} — the address is the same` })
  // FOLD-FIXED — the map moves the elements and leaves the address alone. The array changes; the hash does
  // not. This is the collision phenomenon stated at the level of the whole list rather than one point.
  cands.push({ kind: 'foldfix:' + m.id, key: `${m.id}_leaves_the_address_of_${S.id}_unmoved`,
    holds: foldOf(img) === plain,
    prop: `${leanFold(m.lean, S.lean)} = m9 (${S.lean}.foldl (fun a b => a + b) 0)`,
    say: `${m.say} rewrites every element of ${S.say} and its folded address does not move` })
  // IDEMPOTENT — applying twice is applying once. Distinct from involution, which returns to the start.
  cands.push({ kind: 'idempotent:' + m.id, key: `${m.id}_is_idempotent_on_${S.id}`,
    holds: S.s.every((d) => m.f(m.f(d)) === m.f(d)),
    prop: `${S.lean}.all (fun d => ${sub(m.lean, `(${m.lean})`)} == ${m.lean})`,
    say: `applying ${m.say} twice to ${S.say} is the same as applying it once` })
  // ORDER THREE — three applications return every element. Involution is order two; this is the next one,
  // and the ring the deposit is named for is where order three lives.
  cands.push({ kind: 'order3:' + m.id, key: `${m.id}_has_order_three_on_${S.id}`,
    holds: S.s.every((d) => m.f(m.f(m.f(d))) === d),
    prop: `${S.lean}.all (fun d => ${sub(m.lean, `(${sub(m.lean, `(${m.lean})`)})`)} == d)`,
    say: `${m.say} applied three times returns every element of ${S.say}` })
}

// ── AND THE CHAIN, WHERE ORDER IS NOT FREE ───────────────────────────────────────────────────────────────
// The fold above is a SUM, and a sum is commutative: every question about the order of its list answers yes
// for free, which is why filter 3 discards most of them. That makes it the wrong instrument for the one
// property this deposit actually claims. A receipt chain is not a sum — each step reads the step before it
// (receipt[i] from receipt[i-1]), so its address depends on the order of the list, and order-invariance is
// something that must be EARNED there rather than inherited from the operation.
//
// So the chain is the second word, not a variant of the first: a * 2 + b, folded left. Where a chain's
// address survives reversal it is a fact about the set and the map, not about addition. Where it does not,
// the generator says so and the filters keep neither.
const chainOf = (xs: number[]) => xs.reduce((a, b) => m9(a * 2 + b), 0)
const leanChain = (expr: string, S: string) =>
  `(${S}.map (fun d => ${expr})).foldl (fun a b => m9 (a * 2 + b)) 0`

for (const m of MAPS) for (const S of SETS) {
  const img = S.s.map(m.f)
  // CHAIN-INVARIANT — the chained address does not move when the list is reversed. Under a sum this is
  // free; under a chain it is a genuine coincidence of the map and the set, and it is the only form in
  // which "order does not matter here" is worth sealing.
  cands.push({ kind: 'chainrev:' + m.id, key: `the_chain_of_${m.id}_over_${S.id}_survives_reversal`,
    holds: chainOf(img) === chainOf([...img].reverse()),
    prop: `${leanChain(m.lean, S.lean)} = ${leanChain(m.lean, `(${S.lean}).reverse`)}`,
    say: `chaining ${m.say} across ${S.say} gives the same address forwards and backwards` })
  // CHAIN-AGREES-WITH-SUM — the order-dependent fold and the order-free one land on the same address. Two
  // different machines reaching one answer is the corroboration this repository trusts least and checks most,
  // so where it happens it is stated rather than assumed.
  cands.push({ kind: 'chainsum:' + m.id, key: `the_chain_and_the_sum_of_${m.id}_over_${S.id}_agree`,
    holds: chainOf(img) === foldOf(img),
    prop: `${leanChain(m.lean, S.lean)} = ${leanFold(m.lean, S.lean)}`,
    say: `chaining and summing ${m.say} across ${S.say} reach the same address by different routes` })
}

// ── COMPOSITION, THE OTHER HALF OF "A FORMULA OF FORMULAS IS A FORMULA" ──────────────────────────────────
// Everything above asks about ONE map. But the maps are closed under composition — applying two of them in
// succession is a third thing that may or may not already be in the table — and the generator had no word
// for that either. Involution and idempotence are the two special cases it happened to have (f∘f = id and
// f∘f = f); the general question was never asked.
//
// Two forms. Whether a pair COMMUTES is the question of whether the order of two formulas matters, which is
// the pointwise twin of what the chain asks about a list. And whether a composite IS one of the maps already
// named closes the table: a composite that lands back inside the vocabulary is a relation between three
// things, and it is where the structure actually lives.
// A NOTE ON WHY THE COMPOSITE IS ASKED OVER THE RING ONLY. Two maps agreeing on a four-element subset is a
// coincidence of that subset, and with the table derived there are thousands of maps to coincide with: the
// subset-wise version proposes millions of accidents and calls them structure. "m after n is q" is a claim
// about the MAPS, so it is asked where the maps live. Composition is also LOOKED UP rather than searched —
// the composite's extension names its answer — which is the same equality-by-extension the table is built on.
const byExt = new Map<string, MapDef>()
for (const q of MAPS) byExt.set(extSig(q.f), q)

for (const m of MAPS) for (const n of MAPS) {
  if (m.id === n.id) continue
  const q = byExt.get(extSig((d) => m.f(n.f(d))))
  if (q && q.id !== m.id && q.id !== n.id)
    cands.push({ kind: 'composite', key: `${m.id}_after_${n.id}_is_${q.id}`, holds: true,
      prop: `[0,1,2,3,4,5,6,7,8].all (fun d => ${sub(m.lean, `(${n.lean})`)} == ${q.lean})`,
      say: `${m.say} after ${n.say} is ${q.say} on the whole ring` })
  for (const S of SETS) {
    cands.push({ kind: `commutes:${S.id}`, key: `${m.id}_and_${n.id}_commute_on_${S.id}`,
      holds: S.s.every((d) => m.f(n.f(d)) === n.f(m.f(d))),
      prop: `${S.lean}.all (fun d => ${sub(m.lean, `(${n.lean})`)} == ${sub(n.lean, `(${m.lean})`)})`,
      say: `${m.say} and ${n.say} may be applied in either order on ${S.say}` })
  }
}

// ── THE SETS AGAINST EACH OTHER, AND THE FIBRES ─────────────────────────────────────────────────────────
// A set only ever appears above as the thing a map is applied to. Their relations to ONE ANOTHER — which
// overlap, which cover the ring between them, which sits inside which — are structure the deposit reasons
// about constantly and the generator could not state. A set is an array; these are the relations between
// arrays, which is the same question one level up from the elements.
//
// And the fibres. A map's fibres over a set are themselves arrays, and they partition it: that is the exact
// shape of what a collision does, seen from the input side rather than the output side. Whether they all
// come out the SAME SIZE is the difference between a map that folds its domain evenly and one that does not,
// and it is decidable here.
for (const S of SETS) for (const T of SETS) {
  if (S.id === T.id) continue
  cands.push({ kind: 'disjoint', key: `${S.id}_and_${T.id}_share_no_element`,
    holds: !S.s.some((d) => T.s.includes(d)),
    prop: `${S.lean}.all (fun d => ! ${T.lean}.contains d)`,
    say: `${S.say} and ${T.say} have nothing in common` })
  cands.push({ kind: 'subset', key: `${S.id}_lies_inside_${T.id}`,
    holds: S.s.every((d) => T.s.includes(d)) && S.s.length < T.s.length,
    prop: `${S.lean}.all (fun d => ${T.lean}.contains d) ∧ ${S.s.length} < ${T.s.length}`,
    say: `every element of ${S.say} is an element of ${T.say}, and ${T.say} has more` })
  cands.push({ kind: 'covers', key: `${S.id}_and_${T.id}_cover_the_ring_between_them`,
    holds: RING.every((d) => S.s.includes(d) || T.s.includes(d)),
    prop: `[0,1,2,3,4,5,6,7,8].all (fun d => ${S.lean}.contains d || ${T.lean}.contains d)`,
    say: `${S.say} and ${T.say} between them reach every residue` })
}
for (const m of MAPS) for (const S of SETS) {
  const sizes = [...new Set(S.s.map(m.f))].map((v) => S.s.filter((d) => m.f(d) === v).length)
  cands.push({ kind: 'fibreregular:' + m.id, key: `the_fibres_of_${m.id}_over_${S.id}_are_all_the_same_size`,
    holds: sizes.length > 0 && new Set(sizes).size === 1,
    prop: `((${S.lean}.map (fun d => ${m.lean})).eraseDups.map `
        + `(fun v => (${S.lean}.filter (fun d => ${m.lean} == v)).length)).eraseDups.length = 1`,
    say: `${m.say} folds ${S.say} evenly — every fibre holds the same number of elements` })
}

// ── REORDERING THE ARRAY, WHICH IS WHAT THIS DEPOSIT MEANS BY QUANTUM ───────────────────────────────────
// quantum.lean settles what the word means here: nothing is quantum, it is a SORT — order-invariance bought
// by canonicalising before folding. That is the deposit's central claim about itself, and the generator had
// no word for it, because reversal (added with the chain above) is one reordering out of many and the one
// that says least.
//
// Two reorderings that say more. CANONICAL ORDER is the set written out in the ring's own order rather than
// in whatever order it was listed; if a chained address is the same either way, the listing order was never
// load-bearing, and that is the property the canonicalisation claim rests on. It is computed by filtering the
// ring, so nothing here needs a sort the kernel would have to be given. ROTATION is the array's own
// translation — the exact analogue, one level up, of the shifts just added to the map table, and a rotation
// that leaves a chained address alone is a genuine coincidence rather than a property of addition.
const canonOf = (xs: number[]) => RING.filter((d) => xs.includes(d))
const rotOf = (xs: number[]) => [...xs.slice(1), ...xs.slice(0, 1)]

for (const m of MAPS) for (const S of SETS) {
  if (S.s.length < 2) continue
  const canonLean = `([0,1,2,3,4,5,6,7,8].filter (fun d => ${S.lean}.contains d))`
  const rotLean = `((${S.lean}).drop 1 ++ (${S.lean}).take 1)`
  cands.push({ kind: 'canonorder:' + m.id, key: `the_chain_of_${m.id}_over_${S.id}_ignores_the_listing_order`,
    holds: chainOf(S.s.map(m.f)) === chainOf(canonOf(S.s).map(m.f)),
    prop: `${leanChain(m.lean, S.lean)} = ${leanChain(m.lean, canonLean)}`,
    say: `chaining ${m.say} across ${S.say} gives the same address whether the set is taken as listed or in the ring's own order` })
  cands.push({ kind: 'rotate:' + m.id, key: `the_chain_of_${m.id}_over_${S.id}_survives_rotation`,
    holds: chainOf(S.s.map(m.f)) === chainOf(rotOf(S.s).map(m.f)),
    prop: `${leanChain(m.lean, S.lean)} = ${leanChain(m.lean, rotLean)}`,
    say: `chaining ${m.say} across ${S.say} gives the same address after the array is rotated by one` })
}

// ── FILTER 0 · CROSS-FORMULATED — THE TWO SIDES MUST BE DIFFERENT THINGS PROVING EACH OTHER ──────────────
// With the map table derived rather than chosen, the enumeration reaches maps a hand-written table never
// contained, and two of them produce statements that are not statements about anything:
//
//   THE IDENTITY. `m after the identity is m` expands to X == X — the same expression on both sides, with
//   only parentheses between them. Nothing is being proved by anything; the kernel does not even get a
//   question. Ninety of these were what "the kernel refused some" was actually reporting: `decide` recursing
//   to its depth limit on a tautology it had no reason to be handed.
//
//   THE CONSTANT MAPS. d ↦ b ignores its argument, so `S.all (fun d => …)` never mentions d and says nothing
//   about S — the 2047 unused-variable warnings, which is Lean saying exactly this in its own words.
//
// Both are caught structurally, on the generated proposition, so no map needs excluding by name: a conjunct
// whose sides match once parentheses and spacing are taken out is a tautology, and a lambda whose body never
// uses its bound variable is not quantified over anything. This runs BEFORE the kernel, because a statement
// that relates nothing should never have been asked.
const bare = (x: string) => x.replace(/[()\s]/g, '')
const isTautology = (prop: string) => prop.split('∧').some((conj) => {
  const parts = conj.split(/==|(?<![<>!=])=(?!=)/)
  return parts.length === 2 && bare(parts[0]!) === bare(parts[1]!)
})
// balanced scan rather than a regex: a lambda body runs to its own closing bracket, and `[^)]*` stops at the
// first one, which is inside the body for every statement here.
const ignoresElement = (prop: string) => {
  for (let i = prop.indexOf('fun d =>'); i >= 0; i = prop.indexOf('fun d =>', i + 1)) {
    let depth = 1, j = i + 8
    for (; j < prop.length && depth > 0; j++) {
      if (prop[j] === '(') depth++
      else if (prop[j] === ')') depth--
    }
    if (!/\bd\b/.test(prop.slice(i + 8, j))) return true
  }
  return false
}
// AND ONE STATEMENT GETS ONE NAME. latex-gate found 199 pairs where two candidates are the SAME
// proposition: on a one-element set, "collapses to a single value" and "is injective" are both
// `(...).eraseDups.length = 1` — the same characters, twice, under two names. Two names for one statement is
// the exact opposite of two statements proving each other, and it inflates every count that reads the corpus
// while adding nothing. The first spelling wins, deterministically by key, so the choice is re-derivable.
const seenProp = new Set<string>()
const related = cands
  .filter((c) => !isTautology(c.prop) && !ignoresElement(c.prop))
  .sort((a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0)
  .filter((c) => { const k = c.prop.replace(/\s+/g, ''); if (seenProp.has(k)) return false; seenProp.add(k); return true })
console.log(`  ${cands.length - related.length} proposition(s) dropped as not cross-formulated `
  + `— the two sides were one expression, or the statement never mentioned the element it quantified over`)
// pushed one at a time, not spread: `cands.push(...related)` passes every element as an argument and
// overflowed the call stack at this scale. The spread was fine while the map table was typed.
cands.length = 0
for (const c of related) cands.push(c)

// ── FILTER 1 · true by exhaustion ────────────────────────────────────────────────────────────────────────
const t1 = cands.filter((c) => c.holds)

// ── FILTER 3 · discriminating: the same KIND must fail somewhere else, or the property is free ───────────
const byKind = new Map<string, Cand[]>()
for (const c of cands) (byKind.get(c.kind) ?? byKind.set(c.kind, []).get(c.kind)!).push(c)
const t3 = t1.filter((c) => (byKind.get(c.kind) ?? []).some((o) => !o.holds))

// ── FILTER 2 · not already said — SEMANTICALLY, not syntactically ────────────────────────────────────────
// Matching raw text was not enough: merkaba.lean writes the counter-rotation as `dbl tetA` where this
// generator writes the same fact with inline lists, so a syntactic filter re-proposed a theorem the deposit
// already had. Named definitions are expanded to their bodies before comparing, and a candidate is also
// dropped when an existing theorem mentions BOTH the same set and the same multiplier — the ingredients of a
// statement, not its spelling. A generator that cannot recognise its own output as already-known is a
// duplication machine with a progress bar.
function reflAlias(): [RegExp, string][] {
  const bodies = [...new Set(leanFiles()
    .flatMap((f) => [...readFileSync('src/proof/' + f, 'utf8').matchAll(/^def refl \(d : Nat\) : Nat := ([^\n]+?)\s*(?:--.*)?$/gm)]
      .map((m) => m[1]!.replace(/\s+/g, ''))))]
  return bodies.length === 1 ? [[/\brefl\b/g, `m9(${bodies[0]})`]] : []
}
const ALIAS: [RegExp, string][] = [
  // the alias table's right-hand sides are computed for the same reason the sets are
  [/\bdbl\b/g, 'm9(2*d)'], [/\baxis\b/g, asLean(apiTriad()).replace(/ /g, '')],
  [/\btetA\b/g, asLean(apiTetA()).replace(/ /g, '')], [/\btetB\b/g, asLean(apiTetB()).replace(/ /g, '')],
  [/\bunits\b/g, asLean(apiUnits()).replace(/ /g, '')], [/\btriad\b/g, asLean(apiTriad()).replace(/ /g, '')],
  // `refl` IS WHAT ITS DEFINITION SAYS. This entry was typed as m9(9-d) — negation — while every definition of refl
  // in src/proof is 10 − d, the ten-complement. So any theorem using refl read as a negation theorem, and a true
  // imagined theorem (negation carries tetA onto tetB) was dropped as "already said" by one that says something
  // else, and covered.json named that theorem as its carrier. The expansion is read from the definitions; if they
  // ever disagree, refl is not aliased at all rather than aliased wrong.
  ...reflAlias(),
]
// EVERY FILE THIS GENERATOR OWNS, not just the first one. The exclusion named `imagined.lean` literally,
// which was correct while the output was one file. The moment it shards, a shard that is NOT excluded makes
// every candidate look already-said and the generator emits nothing — failing closed, but silently and with
// a plausible number.
const MINE = /^imagined(_\d+)?\.lean$/
let said = leanFiles().filter((f) => !MINE.test(f))
  .map((f) => readFileSync('src/proof/' + f, 'utf8')).join('\n').replace(/\s+/g, '')
for (const [re, to] of ALIAS) said = said.replace(re, to)
const setOf = new Map(SETS.map((S) => [S.id, S.lean.replace(/\s+/g, '')]))
// DERIVED FROM THE MAP TABLE, FOR THE REASON THE MAP TABLE IS ITSELF DERIVED. This was a typed record keyed
// by map id — `double: '2*d'` and nine more — written when the ids were hand-chosen names. The moment the map
// table was enumerated from the ring, every key in it missed, and this filter stopped recognising ANYTHING as
// already said: 1117 candidates dropped before, zero after, with no error anywhere. A filter that silently
// stops filtering reads as a generator that has found more, which is the flattering direction to fail in.
// The multiplier of a map is its own Lean body, so it is taken from there and cannot fall out of step again.
const mulOf: Record<string, string> = Object.fromEntries(
  MAPS.map((m) => [m.id, m.lean.replace(/\s+/g, '').replace(/^m9\((.*)\)$/, '$1')]))
// WHO COVERS IT — recorded, not just counted. Dropping a candidate because the deposit already proves it is
// correct; dropping it SILENTLY is not. Two entries sealed from earlier runs of this generator were orphaned
// the moment a hand-written theorem expressed the same fact under a different name: the source vanished, the
// ledger still held the key, and nothing in the tree said where the statement had gone. seal-lean then offered
// to withdraw two facts that are, right now, checked by the kernel. The name of the covering theorem is the
// missing evidence, so it is written down and seal-lean reads it to mark supersession instead of loss.
// `said.split('theorem')` leaves every chunk starting with the SPACE that followed the keyword, and this
// anchored at position 0 — so it named 28 of 558 chunks, and those 28 were the accidents where the split
// happened to land mid-word. Every real theorem name was lost, and covered.json recorded the accidents:
// `the_rejected_command_gets_a_receipt` was filed as the covering theorem for three doubling statements it
// has nothing to do with. A wrong name in a coverage map is worse than an empty one, because "superseded,
// not lost" is a claim about WHICH theorem carries the fact.
const nameOf = (chunk: string) => chunk.match(/^\s*([A-Za-z_][A-Za-z0-9_'.]*)/)?.[1] ?? ''
const chunks = said.split('theorem')
// every theorem name the corpus actually declares — the set a carrier has to be in
const liveThmNames = new Set(leanFiles()
  .flatMap((f) => [...readFileSync('src/proof/' + f, 'utf8').matchAll(/^theorem\s+([A-Za-z_0-9']+)/gm)].map((m) => m[1]!)))
const coveredBy = new Map<string, string>()
const t2 = t3.filter((c) => {
  const flat = c.prop.replace(/\s+/g, '')
  // A CARRIER MUST BE A THEOREM THAT EXISTS. This took the name from whichever chunk contained the
  // flattened proposition, and `said.split('theorem')` puts the file PREAMBLE in a chunk too — so a match
  // landing there named `belowtouchesit.These`, prose with its whitespace stripped, as the theorem carrying
  // a fact. covered-gate caught it, twice, because a downstream sweep in supersede.ts could not: this file
  // rewrites covered.json from inside covered-gate's own run, so a fix after the gate never ran.
  // The slice(1) path below already required a real name; this one did not. It picks the first chunk that
  // holds the proposition AND names a theorem the corpus actually has, and records nothing when there is
  // none — an entry naming a theorem that does not exist reports a fact as carried when it is not.
  const verbatim = chunks.find((t) => t.includes(flat) && liveThmNames.has(nameOf(t)))
  if (verbatim) { coveredBy.set(c.key, nameOf(verbatim)); return false }
  if (chunks.some((t) => t.includes(flat))) return false
  const [, mapId] = c.kind.split(':')
  // THE SET NAMES WERE TYPED HERE TOO — six of them, while the table now derives thirty-odd. Longest match
  // first, so `tetA_image` is not read as the shorter id it happens to contain.
  const setId = SETS.map((S) => S.id).sort((a, b) => b.length - a.length).find((id) => c.key.includes(id))
  const lit = setId ? setOf.get(setId) : undefined
  const mul = mulOf[mapId]
  // both ingredients present in one existing theorem body ⇒ treat as already covered
  // A COVER MUST BE A NAMED THEOREM. `said.split('theorem')` puts the file PREAMBLE in chunks[0], and the
  // ingredient match was landing there — so a candidate was excluded as "already covered" by a chunk that is
  // not a theorem at all, and covered.json recorded an empty name for it. "Superseded, not lost" is a claim
  // about WHICH theorem carries the fact; with no name there is no claim, only an exclusion. If nothing
  // named matches, the candidate is not covered and stays in the emitted set.
  if (lit && mul && said.includes(lit) && said.includes(mul)) {
    for (const t of chunks.slice(1)) {
      if (!t.includes(lit) || !t.includes(mul)) continue
      const name = nameOf(t)
      if (!name) continue
      coveredBy.set(c.key, name)
      return false
    }
  }
  return true
})
// MERGE, DO NOT REPLACE. This wrote the file from `coveredBy` alone and erased every entry it had not just
// produced — a hand-written record of what carries `roots_of_unity_cancel` survived exactly until the next
// `--emit`, and gates-fire found it by running one. That is the SECOND generator here to overwrite a record
// a person put in its output: lean-gen.ts regenerated a prior-art header and replaced a credited attribution
// with a claim of no known prior art. Same shape, different file, and fixing the first instance did not fix
// the shape. An entry this run did not produce is somebody's record of where a proof went; it is kept, and a
// key this run DOES produce wins, because for that key this run is the newer evidence.
{
  const prior: Record<string, string> = existsSync('src/proof/covered.json')
    ? JSON.parse(readFileSync('src/proof/covered.json', 'utf8')) : {}
  const merged = { ...prior, ...Object.fromEntries([...coveredBy]) }
  writeFileSync('src/proof/covered.json', JSON.stringify(Object.fromEntries(Object.entries(merged).sort()), null, 2) + '\n')
}
const overlap = t3.length - t2.length

// "new" means NOT ALREADY IN THE HAND-WRITTEN PROOFS. Every file this generator owns is excluded from its own corpus so that
// regenerating it is idempotent — which also means this count does not fall to zero once they are sealed. It
// is what the generator WOULD emit, not a discovery count, and saying "new" every run implied otherwise.
console.log(`imagined ${cands.length} propositions over ℤ/9 · ${t1.length} true · ${t3.length} discriminating · ${t2.length} emitted (not present in the hand-written proofs; the generator's own files are excluded from its corpus, so this is what it would write, not what is newly found)`)
const killed = t1.length - t3.length
console.log(`  ${killed} true-but-free statement(s) discarded — they hold for every sibling and so name nothing`)
console.log(`  ${overlap} already expressed in src/proof — recognised through definition aliases, not spelling`)
console.log(`  covering theorem named for ${coveredBy.size} of them in src/proof/covered.json — a dropped candidate whose key is still sealed is superseded, not lost`)

if (!process.argv.includes('--emit')) {
  for (const c of t2.slice(0, 40)) console.log('  · ' + c.say)
  console.log(t2.length ? '\nrun with --emit to put them to the kernel' : '\nnothing new to propose — the space is exhausted at these primitives')
  process.exit(0)
}

// ── FILTER 4 · the kernel ────────────────────────────────────────────────────────────────────────────────
// ── A CEILING, BECAUSE THIS GENERATOR HAS NO OPINION ABOUT ENOUGH ───────────────────────────────────────
// Deriving the map table from the ring took this from 91 propositions to 24,742 in one run, and the deposit
// spent the rest of the day surviving it: the Lean corpus had to be sharded, then resharded for a smaller
// machine; the paper reached 52 MB and the directory 9.8 MB; the site build aborted on a 12 GB heap; three
// separate places grew their own copy of "which keys are computed"; and the ledger took 24,742 entries that
// are, overwhelmingly, ONE question asked once per pair per subset — 18,098 of them are "do these two maps
// commute here". Sixteen theorems in group.lean and bridge.lean say what all of that was reaching for.
//
// None of the filters below could have stopped it. Each one asks whether a single proposition is true, new,
// discriminating and cross-formulated, and every one of the 24,742 passed on its own terms. What nothing
// asked was whether the deposit was better for having them, and a generator cannot answer that — so it stops
// instead of deciding. Growth past what is already sealed needs --grow, said out loud, by someone who meant
// it. The ledger is append-only: what this writes cannot be taken back, which is the whole reason for a gate
// in front of it rather than an apology behind it.
const SEALED = (() => {
  try { return (JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) as unknown[]).length } catch { return 0 }
})()
if (t2.length > 0 && !flag('--grow')) {
  const already = new Set(leanFiles().filter(MINE.test.bind(MINE))
    .flatMap((f) => [...readFileSync('src/proof/' + f, 'utf8').matchAll(/^theorem\s+([A-Za-z_0-9]+)/gm)].map((m) => m[1]!)))
  const added = t2.filter((c) => !already.has(c.key)).length
  if (added > 0) {
    console.error(`\n✗ imagine: this run would add ${added} proposition(s) the corpus does not have, on top of ${already.size}.`)
    console.error(`  Every one passes every filter here; none of them answers whether the deposit is better for it.`)
    console.error(`  The ledger already holds ${SEALED} entries and cannot give them back. Re-run with --grow to mean it.`)
    process.exit(1)
  }
}

const blocks = t2.map((c) => `-- ${c.say}\ntheorem ${c.key} :\n  ${c.prop} := by decide`)

// ATTRIBUTION IS CARRIED FORWARD, NEVER REGENERATED AS `unclassified`. This header used to emit a fixed
// `-- prior_art: unclassified`, so re-running --emit ERASED a prior-art block that a later search had
// written into the file by hand: the doubling orbit is the unit group U(9), named with its search terms and
// date. The generator would have replaced a credited attribution with a claim of no known prior art, which
// is the one direction this repository must never move in — and it went unnoticed because --emit is not in
// ci:local and the file only drifts when someone runs it. gates-fire found it by running it.
//
// A prior-art search is a human act performed outside this program; nothing here can redo it, so nothing
// here may overwrite its record.
const PRIOR_ART_KEYS = ['prior_art', 'prior_art_domain', 'prior_art_note', 'prior_art_search']
const existing = existsSync('src/proof/imagined.lean') ? readFileSync('src/proof/imagined.lean', 'utf8') : ''
const carried = PRIOR_ART_KEYS
  .map((k) => existing.match(new RegExp(`^-- ${k}: .*$`, 'm'))?.[0])
  .filter((l): l is string => Boolean(l) && l !== '-- prior_art: unclassified')
const priorArt = carried.length ? carried.join('\n') : '-- prior_art: unclassified'

// ── SHARDED, BECAUSE A MODULE HAS A CEILING AND IT IS NOT A VERDICT ─────────────────────────────────────
// At 24941 theorems in one file the kernel reported "deep recursion detected" ninety times, and this script
// printed it as a refusal. It was not one: every failing theorem COMPILES ON ITS OWN. What ran out was the
// kernel's stack over one enormous module — a limit of the container, reported as a judgement on the
// contents, which is the same mislabel as calling a missing toolchain a refusal. The mathematics was never
// in question and nothing about it needed weakening.
//
// So the output is split into modules the kernel can hold, each self-contained on Z9 and compiled on its own.
// The shard size is a property of the machine rather than of the deposit, so it is stated here as one.
// SIZED FOR THE SMALLEST MACHINE THAT MUST COMPILE IT, WHICH IS NOT THIS ONE. 4000 per shard was chosen
// because it compiled here — ten cores and plenty of memory — and every shard was REFUSED on the GitHub
// runner, taking the release workflow red for 34 minutes while reporting only "does not compile". The file
// that a workstation accepts and a 4 GB runner kills is not a smaller claim, it is the same claim in a
// container that cannot hold it: the third time this session that a limit of the machine has been read as a
// judgement on the mathematics. A generated artefact has to compile where it is checked, so the size is set
// by the tightest checker rather than the loosest, and it is a measured constant with a reason, not a guess.
const PER_SHARD = 1000
const shards: string[][] = []
for (let i = 0; i < blocks.length; i += PER_SHARD) shards.push(blocks.slice(i, i + PER_SHARD))
if (!shards.length) shards.push([])
const shardName = (n: number) => n === 0 ? 'imagined.lean' : `imagined_${n + 1}.lean`
// shards left over from a larger previous run would otherwise stay on disk, be compiled by the corpus, and
// keep sealing theorems this run no longer proposes.
for (let n = shards.length; n < 64; n++) {
  const stale = 'src/proof/' + shardName(n)
  if (existsSync(stale)) { rmSync(stale); console.log(`  removed ${shardName(n)} — this run proposes fewer`) }
}
shards.forEach((part, n) => writeFileSync('src/proof/' + shardName(n), `import Z9
set_option maxRecDepth 8000000
-- title: What enumeration proposed and the kernel kept${shards.length > 1 ? ` (${n + 1} of ${shards.length})` : ''}
-- wing: the imagined
${priorArt}
-- IMAGINED — proposed by scripts/imagine.ts, which enumerated every map-against-subset and map-between-subsets
-- statement its primitives can express, kept the ones true by exhaustion, and then discarded every one that
-- also holds for all its siblings. A property true of everything names nothing. What is left is what the
-- kernel accepted; whatever it refused is reported by the generator and is not in this file.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Imagined

open Z9

${part.join('\n\n')}

end Imagined
`))
console.log(`\nwrote ${shards.length} file(s) with ${t2.length} proposition(s) — putting them to the kernel:`)
// NO TOOLCHAIN IS NOT A REFUSAL. Without `lean` on the PATH the shell answered "lean: command not found" and this
// printed it as "the kernel refused some" — the mislabel lean-agree.ts already fixed. CI installs no Lean, and
// covered-gate runs --emit, so the first deploy after that gate joined the chain went red on a kernel that was
// never asked. Absent is reported as absent, loudly, and is not a verdict: the propositions are put to the kernel
// where lean is installed — `npm run lean`, and the pre-commit hook.
const hasLean = (() => { try { execSync('lean --version', { stdio: 'pipe' }); return true } catch { return false } })()
if (!hasLean) {
  console.log('  ○ NOT CHECKED HERE — no Lean toolchain on this machine, so the kernel was not asked')
  console.log('    this does not mean they hold; they are checked where lean is installed (npm run lean, pre-commit).')
  process.exit(0)
}
// A WARNING IS NOT A REFUSAL. This read any non-zero exit as "the kernel refused some" and printed the first
// twenty lines of output — which, on a run with 2047 unused-variable warnings and 90 real errors, showed
// twenty warnings and not one error. The refusal was real and its reported cause was entirely wrong, so the
// defect looked cosmetic for as long as nobody scrolled. Errors and warnings are counted separately now and
// only errors decide the verdict; warnings are stated, because a warning this generator produces in bulk is
// a fact about its output even when the kernel accepts it.
const verdict = (out: string) => {
  const lines = out.split('\n')
  const errors = lines.filter((l) => /error:/.test(l))
  const warnings = lines.filter((l) => /warning:/.test(l))
  if (warnings.length) console.log(`  ○ ${warnings.length} warning(s) from the kernel — accepted, but said out loud`)
  return errors
}
try {
  // THE SAME CACHE scripts/lean.ts KEEPS, CONSULTED RATHER THAN REBUILT. This recompiled all seven shards on
  // every --emit, and --emit runs inside covered-gate in both the gates and the release chains — so the same
  // bytes were put to the kernel three times a run, minutes each. lean.ts already records the kernel's
  // verdict against the SHA-256 of each file's source; a shard whose bytes are unchanged has been checked, by
  // that record, and re-checking it is work with a foregone answer. This is a cache of work and never of
  // trust: it is keyed on the source, so a shard this run rewrote is compiled, and `lean --full` ignores it.
  const cached: Record<string, { hash: string; format: number; ok: boolean }> =
    existsSync(LEAN_CACHE) ? JSON.parse(readFileSync(LEAN_CACHE, 'utf8')) : {}
  const fresh = shards.map((_, n) => shardName(n)).filter((name) => {
    const hit = cached[name]
    return !(hit?.ok && hit.format === LEAN_CACHE_FORMAT
      && hit.hash === createHash('sha256').update(readFileSync('src/proof/' + name, 'utf8')).digest('hex'))
  })
  if (fresh.length < shards.length)
    console.log(`  · ${shards.length - fresh.length} shard(s) unchanged — the kernel's verdict on those exact bytes is on record`)
  const out = fresh.map((name) => String(execSync(`cd src/proof && LEAN_PATH=. lean ${name}`, { encoding: 'utf8', stdio: 'pipe' }))).join('\n')
  const errors = verdict(out)
  if (errors.length) { console.log('  ✗ ' + errors.length + ' refused:\n' + errors.slice(0, 10).map((l) => '    ' + l).join('\n')); process.exit(1) }
  console.log('  ✓ the kernel accepted all ' + t2.length)
} catch (e) {
  const out = String((e as { stdout?: string }).stdout ?? '') + String((e as { stderr?: string }).stderr ?? '')
  const errors = verdict(out)
  if (!errors.length) { console.log('  ✓ the kernel accepted all ' + t2.length + ' (non-zero exit carried no error line)'); }
  else { console.log(`  ✗ the kernel refused ${errors.length} — reported, not hidden:\n` + errors.slice(0, 10).map((l) => '    ' + l).join('\n')); process.exit(1) }
}
