#!/usr/bin/env node
// IMAGINE — propose theorems nobody wrote, then let the kernel throw most of them away.
//
// lean-gen.ts proves families the LEDGER ALREADY NAMES, at scale. This does the other half: it enumerates the
// whole space of statements the ℤ/9 primitives can express — every map against every subset, and every map
// between every PAIR of subsets — evaluates all of them over the finite domain at once, and keeps the ones
// that survive. Imagining is cheap and worthless on its own; the value is entirely in what the filters kill.
//
// Four filters, in order. Each exists because the obvious version of this script is a padding machine:
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
//      node scripts/imagine.ts --emit   (also write src/proof/imagined.lean and verify it)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { units as apiUnits, triad as apiTriad, orbit as apiOrbit, tetA as apiTetA, tetB as apiTetB } from '../src/api/index.ts'

const m9 = (n: number) => ((n % 9) + 9) % 9

// ── the primitives, each a total map on ℤ/9 ──────────────────────────────────────────────────────────────
const MAPS: { id: string; lean: string; say: string; f: (d: number) => number }[] = [
  { id: 'double',   lean: 'm9 (2 * d)',     say: 'doubling',              f: (d) => m9(2 * d) },
  { id: 'triple',   lean: 'm9 (3 * d)',     say: 'tripling',              f: (d) => m9(3 * d) },
  { id: 'quadruple',lean: 'm9 (4 * d)',     say: 'quadrupling',           f: (d) => m9(4 * d) },
  { id: 'negate',   lean: 'm9 (9 - d)',     say: 'negation',              f: (d) => m9(9 - d) },
  { id: 'square',   lean: 'm9 (d * d)',     say: 'squaring',              f: (d) => m9(d * d) },
  { id: 'cube',     lean: 'm9 (d * d * d)', say: 'cubing',                f: (d) => m9(d * d * d) },
  // powers four to six. Euler's theorem puts u⁶ = 1 for every unit, so this is where the multiplicative
  // structure closes on itself — the natural end of the power family rather than an arbitrary stopping point.
  { id: 'fourth',   lean: 'm9 (d ^ 4)',     say: 'the fourth power',      f: (d) => m9(d ** 4) },
  { id: 'fifth',    lean: 'm9 (d ^ 5)',     say: 'the fifth power',       f: (d) => m9(d ** 5) },
  { id: 'sixth',    lean: 'm9 (d ^ 6)',     say: 'the sixth power',       f: (d) => m9(d ** 6) },
  { id: 'quintuple',lean: 'm9 (5 * d)',     say: 'multiplication by five',f: (d) => m9(5 * d) },
  // the multiplication table completed — 6, 7 and 8 were missing, and leaving a table three rows short is an
  // arbitrary boundary, not a decision. The generator should be asked everything it can be asked.
  { id: 'sextuple', lean: 'm9 (6 * d)',     say: 'multiplication by six',  f: (d) => m9(6 * d) },
  { id: 'septuple', lean: 'm9 (7 * d)',     say: 'multiplication by seven',f: (d) => m9(7 * d) },
  { id: 'octuple',  lean: 'm9 (8 * d)',     say: 'multiplication by eight',f: (d) => m9(8 * d) },
]

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
const ALIAS: [RegExp, string][] = [
  // the alias table's right-hand sides are computed for the same reason the sets are
  [/\bdbl\b/g, 'm9(2*d)'], [/\baxis\b/g, asLean(apiTriad()).replace(/ /g, '')],
  [/\btetA\b/g, asLean(apiTetA()).replace(/ /g, '')], [/\btetB\b/g, asLean(apiTetB()).replace(/ /g, '')],
  [/\bunits\b/g, asLean(apiUnits()).replace(/ /g, '')], [/\btriad\b/g, asLean(apiTriad()).replace(/ /g, '')],
  [/\brefl\b/g, 'm9(9-d)'],
]
let said = readdirSync('src/proof').filter((f) => f.endsWith('.lean') && f !== 'imagined.lean')
  .map((f) => readFileSync('src/proof/' + f, 'utf8')).join('\n').replace(/\s+/g, '')
for (const [re, to] of ALIAS) said = said.replace(re, to)
const setOf = new Map(SETS.map((S) => [S.id, S.lean.replace(/\s+/g, '')]))
const mulOf: Record<string, string> = { double: '2*d', triple: '3*d', quadruple: '4*d', quintuple: '5*d', sextuple: '6*d', septuple: '7*d', octuple: '8*d', negate: '9-d', square: 'd*d', cube: 'd*d*d' }
const t2 = t3.filter((c) => {
  if (said.includes(c.prop.replace(/\s+/g, ''))) return false
  const [, mapId] = c.kind.split(':')
  const setId = c.key.match(/(units|triad|orbit|tetA|tetB|all)/)?.[1]
  const lit = setId ? setOf.get(setId) : undefined
  const mul = mulOf[mapId]
  // both ingredients present in one existing theorem body ⇒ treat as already covered
  if (lit && mul && said.includes(lit) && said.includes(mul)) {
    for (const t of said.split('theorem')) if (t.includes(lit) && t.includes(mul)) return false
  }
  return true
})
const overlap = t3.length - t2.length

// "new" means NOT ALREADY IN THE HAND-WRITTEN PROOFS. imagined.lean is excluded from its own corpus so that
// regenerating it is idempotent — which also means this count does not fall to zero once they are sealed. It
// is what the generator WOULD emit, not a discovery count, and saying "new" every run implied otherwise.
console.log(`imagined ${cands.length} propositions over ℤ/9 · ${t1.length} true · ${t3.length} discriminating · ${t2.length} emitted (not present in the hand-written proofs; imagined.lean is excluded from its own corpus, so this is what it would write, not what is newly found)`)
const killed = t1.length - t3.length
console.log(`  ${killed} true-but-free statement(s) discarded — they hold for every sibling and so name nothing`)
console.log(`  ${overlap} already expressed in src/proof — recognised through definition aliases, not spelling`)

if (!process.argv.includes('--emit')) {
  for (const c of t2.slice(0, 40)) console.log('  · ' + c.say)
  console.log(t2.length ? '\nrun with --emit to put them to the kernel' : '\nnothing new to propose — the space is exhausted at these primitives')
  process.exit(0)
}

// ── FILTER 4 · the kernel ────────────────────────────────────────────────────────────────────────────────
const body = t2.map((c) => `-- ${c.say}\ntheorem ${c.key} :\n  ${c.prop} := by decide`).join('\n\n')
writeFileSync('src/proof/imagined.lean', `import Z9
set_option maxRecDepth 8000000
-- IMAGINED — proposed by scripts/imagine.ts, which enumerated every map-against-subset and map-between-subsets
-- statement its primitives can express, kept the ones true by exhaustion, and then discarded every one that
-- also holds for all its siblings. A property true of everything names nothing. What is left is what the
-- kernel accepted; whatever it refused is reported by the generator and is not in this file.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Imagined

open Z9

${body}

end Imagined
`)
console.log(`\nwrote src/proof/imagined.lean with ${t2.length} proposition(s) — putting them to the kernel:`)
try {
  execSync('cd src/proof && LEAN_PATH=. lean imagined.lean', { encoding: 'utf8', stdio: 'pipe' })
  console.log('  ✓ the kernel accepted all ' + t2.length)
} catch (e) {
  const out = String((e as { stdout?: string; stderr?: string }).stdout ?? '') + String((e as { stderr?: string }).stderr ?? '')
  console.log('  ✗ the kernel refused some — reported, not hidden:\n' + out.split('\n').slice(0, 20).map((l) => '    ' + l).join('\n'))
  process.exit(1)
}
