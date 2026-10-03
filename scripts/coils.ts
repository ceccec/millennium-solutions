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
 *    node scripts/coils.ts            report the coils AND CHECK src/proof/coils.lean against them
 *    node scripts/coils.ts --emit     write src/proof/coils.lean and put it to the kernel
 *
 *  WITHOUT --emit THIS CHECKS, AND IT FAILS ON A DIFFERENCE. It used to print the report and exit 0, which
 *  made it a generator that is IN the `gates` chain and still could not catch its own drift: the vocabulary
 *  could grow, a coil could appear or change shape, and src/proof/coils.lean would keep compiling the old
 *  clustering while every gate read green. This deposit already carries that defect by name — "a derived
 *  file whose generator is in no chain step drifts and ships" — and being in the chain is not the property
 *  that matters. FAILING is. scripts/settled.ts was written with the check and this one was not, which is
 *  the asymmetry FINDINGS.md 7o named and this closes. */
import { generatedLean } from '../src/api/index.ts'
import { DOM_EXPRS, ALL_DOMS, type DomExpr } from '../src/entangle/index.ts'
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

// ── VOCABULARY 3 · ONE GRID FOR EVERY SCIENCE, WHICH IS THE ONLY WAY A CROSS-DOMAIN COIL CAN APPEAR ───────
//
// The two vocabularies above each live inside one subject, so their coils are cross-domain only in the weak
// sense that one object wears several names. This one is the experiment proper: a SINGLE dimensionless grid
// n = 1..20, and expressions drawn from music, biology, chemistry, sport, juggling, botany, computing,
// metrology, geometry and number theory evaluated on it. Two expressions coil when they agree at EVERY n.
//
// THAT IS WHAT MAKES THE RESULT MEAN ANYTHING. Put each subject on its own grid and entanglement is
// unmeasurable by construction — nothing from chemistry can ever equal anything from music because the two
// are never asked the same question. Put them on one grid and the question becomes decidable, and it can come
// back either way. So this vocabulary can REFUTE an entanglement as easily as confirm one, which is the
// property the claim needs and the reason the non-coiling expressions are reported as loudly as the coils.
//
// WHAT A COIL HERE DOES AND DOES NOT ESTABLISH. It establishes that two subjects are counting the same thing:
// a knockout tournament and an n-bit register are both 2^n − 1, exactly, at every n, and that is an identity
// rather than a resemblance. It does NOT establish that either subject explains the other, that the identity
// is interesting, or that a student who learns one has learned the other. Those are different claims and two
// of them are empirical.
// The vocabulary itself moved to src/entangle/index.ts and grew from 37 expressions over 11 domains to 80
// over 24. It is data and it belongs beside the other registries rather than inside the generator that reads
// it — the same split src/mcp/index.ts records the reason for, and it is what let the widening happen without
// this file growing at all.
const N = Array.from({ length: 20 }, (_, i) => i + 1)
const domExprs = DOM_EXPRS

const domBy = new Map<string, DomExpr[]>()
for (const e of domExprs) { const k = N.map(e.at).join('|'); if (!domBy.has(k)) domBy.set(k, []); domBy.get(k)!.push(e) }
const domCoils = [...domBy.values()].filter((g) => g.length > 1).sort((a, b) => b.length - a.length)
const domAlone = domExprs.filter((e) => !domCoils.some((g) => g.includes(e)))
const domSpanning = domCoils.filter((g) => new Set(g.map((e) => e.dom)).size > 1)
// which domains are joined by at least one exact identity — the adjacency the experiment measures
const adj = new Map<string, Set<string>>()
for (const g of domSpanning) {
  const ds = [...new Set(g.map((e) => e.dom))]
  for (const a of ds) for (const b of ds) if (a !== b) adj.set(a, (adj.get(a) ?? new Set()).add(b))
}
const isolated = ALL_DOMS.filter((d) => !adj.has(d))
// ── IS THE ENTANGLEMENT GRAPH CONNECTED? A domain having SOME neighbour is weaker than every domain being
// reachable from every other, and the difference is exactly the difference between "things are related here
// and there" and "all of it hangs together". Computed by flooding from one domain: if the flood reaches all
// of them there is one component, and the identity relation joins the whole set through a shared substrate.
const components = (() => {
  const seen = new Set<string>(), comps: string[][] = []
  for (const start of ALL_DOMS) {
    if (seen.has(start)) continue
    const stack = [start], comp: string[] = []
    while (stack.length) {
      const d = stack.pop()!
      if (seen.has(d)) continue
      seen.add(d); comp.push(d)
      for (const n of adj.get(d) ?? []) if (!seen.has(n)) stack.push(n)
    }
    comps.push(comp.sort())
  }
  return comps.sort((a, b) => b.length - a.length)
})()
// the hubs: how many other domains each is joined to, which says where the shared counting laws sit
const degree = ALL_DOMS.map((d) => ({ d, n: adj.get(d)?.size ?? 0 })).sort((a, b) => b.n - a.n)

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
// ── VOCABULARY 3 · THE CROSS-DOMAIN EXPERIMENT, REPORTED IN BOTH DIRECTIONS ──────────────────────────────
console.log(`\n  one grid, every science: ${domExprs.length} expressions from ${ALL_DOMS.length} domains over n = 1..${N.length}`)
console.log(`  ${domBy.size} distinct value-vectors · ${domCoils.length} coils · ${domSpanning.length} of them SPAN DOMAINS · ${domAlone.length} coil with nothing`)
for (const g of domSpanning) {
  const ds = [...new Set(g.map((e) => e.dom))].sort()
  console.log(`  ✳ ${ds.join(' ↔ ')}`)
  for (const e of g) console.log(`      ${e.dom.padEnd(14)} ${e.say}`)
  console.log(`      one expression: ${g[0].lean} — equal at every n in range, not approximately`)
}
const sameDomOnly = domCoils.filter((g) => new Set(g.map((e) => e.dom)).size === 1)
for (const g of sameDomOnly) console.log(`  · within ${g[0].dom} alone: ${g.map((e) => e.say).join(' = ')}`)
if (domAlone.length) {
  console.log(`\n  AND ${domAlone.length} EXPRESSION(S) COIL WITH NOTHING — the result that keeps the claim honest:`)
  for (const e of domAlone) console.log(`      ${e.dom.padEnd(14)} ${e.say}  (${e.lean})`)
  console.log(`      These are not failures of the experiment, they ARE the experiment: a grid on which`)
  console.log(`      everything coiled would have stopped discriminating and could confirm nothing. The staircase`)
  console.log(`      sum n(n+1)/2 sits one index from the handshake count n(n-1)/2 and does NOT join it, which is`)
  console.log(`      the near miss that shows the test can separate things that look alike.`)
}
console.log(`\n  THE MEASURED ADJACENCY — which domains are joined by at least one exact identity:`)
for (const d of ALL_DOMS) {
  const n = adj.get(d)
  console.log(`      ${d.padEnd(14)} ${n ? [...n].sort().join(' ') : '— joined to none of the others on this grid'}`)
}
console.log(`\n  WHAT THIS SHOWS, STATED AT ITS ACTUAL STRENGTH. ${domSpanning.length} identities each hold exactly, at`)
console.log(`  every point, across ${new Set(domSpanning.flatMap((g) => g.map((e) => e.dom))).size} of the ${ALL_DOMS.length} domains — a knockout bracket and an n-bit`)
console.log(`  register are the same integer; phyllotaxis, breeding pairs and Zeckendorf are one recursion; RNA`)
console.log(`  folds, balanced brackets and polygon triangulations are one sequence. Those are identities, not`)
console.log(`  resemblances, and they are decided rather than argued.`)
console.log(`\n  AND THE GRAPH IS ${components.length === 1 ? 'CONNECTED' : 'NOT CONNECTED'}: ${components.length} component(s) over ${ALL_DOMS.length} domains.`)
if (components.length === 1) {
  console.log(`  Every domain on this grid is reachable from every other through a chain of exact identities. That is`)
  console.log(`  a stronger statement than "each has a neighbour" and it is the one worth making: the eleven subjects`)
  console.log(`  are not eleven islands with some bridges, they are ONE component. Where the chain runs through is`)
  console.log(`  measurable too — by degree: ${degree.slice(0, 3).map((x) => `${x.d} (${x.n})`).join(', ')} carry the most edges, and a`)
  console.log(`  path from metrology to juggling exists only through chemistry, which is what "shared substrate"`)
  console.log(`  means when it is measured instead of asserted.`)
} else {
  console.log(`  ${components.length} separate components, so the subjects do NOT all hang together on this grid:`)
  for (const c of components) console.log(`      ${c.join(' ')}`)
}
console.log(`\n  WHAT IS STILL NOT SHOWN. ${domAlone.length} expression(s) here coil with nothing and`)
console.log(`  ${isolated.length} domain(s) are joined to no other on this grid. Entanglement is PERVASIVE and it is NOT`)
console.log(`  TOTAL, and both halves are computed from the same run — which is the only reason either is worth`)
console.log(`  reporting. A claim that all is entangled would be refuted by this file's own output, so the file`)
console.log(`  does not make it. What nature supplies is a small stock of counting laws that many subjects draw`)
console.log(`  on; what it does not supply is interchangeability between subjects that draw on different ones.`)

console.log(`  CROSS-DOMAIN: ${crossing.length} of ${coils.length} coils span more than one declared domain — those are the ones`)
console.log(`  that let a result in one field answer a question asked in another. ${coils.length - crossing.length} stay inside one.`)
for (const x of crossing.slice(0, 5)) console.log(`  ✳ {${x.g[0].set.join(',')}}  ${x.doms.join(' ↔ ')}  — ${x.g.length} ways`)
for (const g of coils.slice(0, 8)) console.log(`  · {${g[0].set.join(',')}}  ${g.length} ways: ${g.slice(0, 4).map((e) => e.say).join(' = ')}${g.length > 4 ? ' = …' : ''}`)

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

// ── VOCABULARY 3, EMITTED ─────────────────────────────────────────────────────────────────────────────────
// One theorem per cross-domain coil: the expressions agree at every n in the range the theorem names. THE
// RANGE IS PER COIL AND IT IS STATED, because the kernel's cost is not uniform — powers and polynomials are
// cheap to twenty, a binomial by Pascal's recursion is not memoised in the kernel and doubles with every step,
// and a Catalan number through choose(2n,n) would make the file take minutes to prove what it proves in six.
// So each theorem carries the grid it was decided over rather than a grid chosen to look impressive, and a
// reader can see that the identity was checked at twenty points or at six.
const LEAN_N: Record<string, number> = { 'fib n': 16, 'chooseN 12 n': 12, 'catalan n': 6, 'fct n': 10, 'chooseN (2 * n) n': 8 }

/** The Lean form of an expression. `null` means this deposit has no cheap, axiom-free kernel definition for it
 *  yet, and the coil is then reported as a NAMED GAP rather than emitted.
 *
 *  TWO ARE NULL AND THEY STAY NULL FOR A REASON. Bell numbers and unrestricted partitions are decided in the
 *  TypeScript layer and corroborated by the catalogue (A000110, A000041), and both have kernel definitions that
 *  are either expensive or need a termination proof this file is not the place for. The tempting shortcut was
 *  to have the generator emit the computed sequence as a list and prove the members equal it — but that is a
 *  generator writing both sides of its own comparison. That is the certificate shape that was removed from 42
 *  theorems earlier today, and it would be worse here for wearing the look of proof. A named gap is honest;
 *  a self-satisfied theorem is not. */
const leanOf = (e: DomExpr): string | null => {
  if (/\bbell n\b|\bparts n\b|\bmotzkin n\b|\bderange n\b|\blucas n\b/.test(e.lean)) return null
  return e.lean
    .replace(/\bfib n\b/, 'fibN n')
    .replace(/\bcatalan n\b/, 'catalanN n')
    .replace(/\bfct n\b/, 'fct n')
}
const emittable = domSpanning.filter((g) => leanOf(g[0]) !== null)
const notEmittable = domSpanning.filter((g) => leanOf(g[0]) === null)
const domBody = emittable.map((g, i) => {
  const lim = LEAN_N[g[0].lean] ?? 20
  const ds = [...new Set(g.map((e) => e.dom))].sort()
  // ── NAMED AFTER THE INVARIANT, NOT THE MEMBERS ──────────────────────────────────────────────────────────
  // The first version named each theorem after its DOMAIN LIST, and widening the vocabulary from 11 domains to
  // 24 changed every name and orphaned 11 sealed keys in one run. This tree already had the lesson written
  // down, in src/proof/rights.lean: "A name that enumerates cannot survive growth; a name that quantifies
  // can." I wrote a name that enumerates and the ledger paid for it the first time the vocabulary grew.
  // The expression IS the invariant — which subjects happen to share it is exactly the part that changes when
  // more subjects are added — so the name is the expression and adding a domain now leaves the key alone.
  const name = 'the_identity_of_' + (g[0].lean
    .replace(/\bchooseN\b/g, 'choose').replace(/\bfibN\b/g, 'fib').replace(/\bcatalanN\b/g, 'catalan')
    .replace(/\bfct\b/g, 'factorial').replace(/\^/g, '_to_the_').replace(/%/g, '_mod_')
    .replace(/\*/g, '_times_').replace(/\//g, '_over_').replace(/[+]/g, '_plus_').replace(/-/g, '_minus_')
    .replace(/[()]/g, '').replace(/\s+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '')
    .replace(/[^a-z0-9_]/g, '') || 'unnamed')
  const conj = g.slice(1).map((e) => `(${leanOf(g[0])}) == (${leanOf(e)})`).join('\n       && ')
  return `-- ${ds.join(' ↔ ')}\n`
    + g.map((e) => `--   ${e.dom}: ${e.say}\n`).join('')
    + `-- joined here by: ${ds.join(', ')}\n`
    + `theorem ${name} :\n`
    + `  (List.range' 1 ${lim}).all (fun n => ${conj || 'true'}) := by decide\n`
}).join('\n')
  + (notEmittable.length ? `\n-- ── ${notEmittable.length} CROSS-DOMAIN IDENTITIES NOT YET IN THE KERNEL ────────────────────────────\n`
    + `-- Decided in scripts/coils.ts over n = 1..20 and corroborated against the OEIS, but with no cheap\n`
    + `-- axiom-free definition here yet. NAMED rather than omitted — and deliberately not emitted as a list the\n`
    + `-- generator computed and then proved equal to itself. That is a generator writing both sides of its own\n`
    + `-- comparison, the certificate shape this deposit removed from 42 theorems today, and it would be worse\n`
    + `-- here for wearing the look of proof.\n`
    + notEmittable.map((g) => `--   ${[...new Set(g.map((e) => e.dom))].sort().join(' ↔ ')}  (${g[0].lean})\n`).join('') : '')

// AND THE NEGATIVE CONTROL, WHICH IS THE THEOREM THAT MAKES THE OTHERS MEAN ANYTHING. If everything on this
// grid agreed with everything, the coils above would be an artefact of a grid too coarse to tell anything
// apart. The staircase sum and the handshake count differ by one index and are decided DISTINCT at every n
// above zero; and four expressions in the vocabulary join nothing at all.
// ── THE GRAPH ITSELF, PUT TO THE KERNEL ──────────────────────────────────────────────────────────────────
// The report above computes that the entanglement graph is connected and prints it. Printing is not deciding,
// and in this deposit a result that only a report has seen is not a result. These three theorems are the claim
// "all of it hangs together" stated so the kernel can refuse it: the adjacency is emitted as edges, a bounded
// flood is run from one domain, and it must reach every other. If a future vocabulary disconnects the graph,
// the FILE STOPS COMPILING rather than the sentence quietly becoming false.
const domIndex = new Map(ALL_DOMS.map((d, i) => [d, i]))
const edgeList = [...adj.entries()].flatMap(([a, ns]) => [...ns].map((b) => [domIndex.get(a)!, domIndex.get(b)!]))
  .sort((x, y) => x[0] - y[0] || x[1] - y[1])
const metro = domIndex.get('metrology'), jug = domIndex.get('juggling'), chem = domIndex.get('chemistry')
const domGraph = `-- ── THE ENTANGLEMENT GRAPH, DECIDED ──────────────────────────────────────────────────────────────────────
-- The vertices are the ${ALL_DOMS.length} domains and an edge joins two that share at least one EXACT identity on the
-- shared grid above. Emitted from the clustering, so the graph is what the coils produced and not a picture
-- drawn afterwards.
def doms : List String := [${ALL_DOMS.map((d) => JSON.stringify(d)).join(', ')}]
def edges : List (Nat × Nat) := [${edgeList.map(([a, b]) => `(${a}, ${b})`).join(', ')}]
def nbrs (v : Nat) : List Nat := (edges.filter (fun e => e.1 == v)).map (fun e => e.2)
def step (s : List Nat) : List Nat := (s ++ s.flatMap nbrs).eraseDups
def flood : Nat → List Nat → List Nat
  | 0, s => s
  | (k + 1), s => flood k (step s)

-- 1 · CONNECTED. Flooding from one domain reaches every one of them, so no subject on this grid is an island:
-- each is joined to each through a chain of exact identities. This is the theorem the phrase "all is
-- entangled" should mean, and it is the strongest form of it that is true here.
theorem the_entanglement_graph_is_connected :
  (flood ${ALL_DOMS.length} [0]).eraseDups.length == doms.length
  ∧ doms.length == ${ALL_DOMS.length}
  ∧ (flood ${ALL_DOMS.length} [0]).eraseDups.length == ${ALL_DOMS.length} := by decide

-- 2 · AND NO VERTEX IS ISOLATED, which is the weaker statement, decided separately because the two are
-- different: a graph can have no isolated vertex and still fall into several components. Both hold here, and
-- keeping them apart is what stops the stronger one from resting on the weaker.
theorem no_domain_is_entangled_with_nothing :
  (List.range doms.length).all (fun v => (nbrs v).length > 0)
  ∧ (List.range doms.length).all (fun v => (nbrs v).all (fun w => w != v)) := by decide

-- 3 · THE SUBSTRATE IS A HUB AND NOT A UNIVERSAL GLUE. metrology and juggling share NO identity directly —
-- an order of magnitude and a juggling state count are not the same number — and they are joined only by
-- passing through chemistry. Decided as the two-step reach: juggling is absent from metrology's own
-- neighbourhood and present after two steps. "Shared substrate" measured instead of asserted.
theorem the_distant_pair_is_joined_only_through_a_hub :
  !((nbrs ${metro}).contains ${jug})
  ∧ (flood 2 [${metro}]).contains ${jug}
  ∧ (nbrs ${metro}).contains ${chem}
  ∧ (nbrs ${chem}).contains ${jug} := by decide

`

const domControl = `-- THE NEAR MISS THAT DOES NOT COIL. n(n+1)/2 and n(n-1)/2 sit one index apart, and if the
-- grid could not separate them it could not establish any of the identities above either.
theorem the_staircase_and_the_handshake_never_agree_above_zero :
  (List.range' 1 20).all (fun n => n * (n + 1) / 2 != n * (n - 1) / 2)
  ∧ (List.range' 1 20).all (fun n => n * (n + 1) / 2 == n * (n - 1) / 2 + n) := by decide

-- ── THE SEPARATIONS, WHICH ARE WHAT THE WIDENED GRID NEEDS MOST ───────────────────────────────────────────
-- Going from 11 domains to 24 doubled the chances that two expressions coincide by accident, so the theorems
-- that say things stay APART carry more weight than before, not less.

-- 1 · THE SAME RECURSION, DIFFERENT SEQUENCES. Lucas and Fibonacci obey F(n) = F(n-1) + F(n-2) identically and
-- differ only in the seed, which is enough: they agree at exactly one point in range and part company for
-- good after it. A grid that merged them would be merging a recursion with its own initial conditions.
def lucasAux : Nat → Nat → Nat → Nat
  | 0, a, _ => a
  | (n + 1), a, b => lucasAux n b (a + b)
def lucasN (n : Nat) : Nat := lucasAux n 2 1

theorem lucas_and_fibonacci_share_a_recursion_and_not_a_sequence :
  fibN 1 == lucasN 1
  ∧ (List.range' 2 18).all (fun n => fibN n != lucasN n)
  ∧ (List.range' 1 18).all (fun n => fibN (n + 2) == fibN (n + 1) + fibN n
      && lucasN (n + 2) == lucasN (n + 1) + lucasN n) := by decide

-- 2 · THE THREE POLYGON COUNTS STAY APART. Handshakes n(n-1)/2, the staircase n(n+1)/2 and a polygon's
-- diagonals n(n-3)/2 are three expressions within one index of each other, and all three appear in this
-- vocabulary under different subjects. They are pairwise distinct from n = 4 up; below that the degenerate
-- cases coincide, and the theorem states where rather than starting the range past the awkward part.
theorem the_three_polygon_counts_are_pairwise_distinct_from_four :
  (List.range' 4 17).all (fun n =>
    n * (n - 1) / 2 != n * (n + 1) / 2
    && n * (n - 1) / 2 != n * (n - 3) / 2
    && n * (n + 1) / 2 != n * (n - 3) / 2)
  ∧ (List.range' 1 20).all (fun n => n * (n + 1) / 2 == n * (n - 1) / 2 + n) := by decide

-- 3 · THE OCTAVE AND THE FIFTH MEET ONLY WHERE NOTHING IS STACKED. 2^n and 3^n coincide at n = 0 and nowhere
-- after, which is the same fact src/proof/entangled.lean states about the comma, arriving here from the other
-- side: the two coils are separate coils, and no amount of stacking merges them.
theorem the_octave_and_the_fifth_meet_only_at_zero :
  2 ^ 0 == 3 ^ 0
  ∧ (List.range' 1 20).all (fun n => 2 ^ n != 3 ^ n)
  ∧ (List.range' 1 20).all (fun n => 2 ^ n < 3 ^ n) := by decide

-- 4 · WHERE THE DIGIT ROOT LEAVES THE INTEGERS, AND WHY A SHORT SEARCH CANNOT SEE IT. The digit root of n
-- EQUALS n for every n up to nine and first differs at ten. That is not a curiosity here: an outside catalogue
-- was asked to corroborate this coil on its first eight terms and returned A000027, "the positive integers" —
-- a true answer to the question asked and the wrong sequence, because the two are indistinguishable until the
-- tenth term. The search was widened after this theorem was written, and the theorem is the reason it had to be.
theorem the_digit_root_leaves_the_integers_at_ten :
  (List.range' 1 9).all (fun n => (if n = 0 then 0 else 1 + (n - 1) % 9) == n)
  ∧ (if (10 : Nat) = 0 then 0 else 1 + (10 - 1) % 9) != 10
  ∧ (List.range' 10 11).all (fun n => (if n = 0 then 0 else 1 + (n - 1) % 9) != n) := by decide

-- AND THE FACTORIAL JOINS NOTHING: it outgrows every other expression here, so no identity can hold. The
-- boundary is named rather than stepped over — at n = 3 the factorial EQUALS the triangular number, both 6,
-- and only from 4 does it exceed it. The first version of this theorem asserted strict growth from 3 and the
-- kernel refused it. Moving the range to start at 4 would have hidden the one interesting point in it.
theorem the_factorial_outgrows_every_other_expression :
  fct 3 == 3 * 4 / 2
  ∧ (List.range' 4 16).all (fun n => fct n > 2 ^ n && fct n > n * (n + 1) / 2) := by decide
`

const OUT = 'src/proof/coils.lean'
const generated = `set_option maxRecDepth 100000
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
-- ── THE CROSS-DOMAIN VOCABULARY ───────────────────────────────────────────────────────────────────────────
-- The definitions the theorems below need, written for the KERNEL rather than for a reader. fibN carries two
-- accumulators instead of recursing twice, because the textbook two-call form is exponential and the kernel
-- does not memoise; chooseN is Pascal's recursion, which keeps every intermediate small; and fct is here only
-- so a theorem can state that the factorial outgrows the rest. None of them uses a library function that
-- closes by well-founded recursion — Nat.lcm did, and it brought an axiom into a file that had none.
def fct : Nat → Nat
  | 0 => 1
  | (n + 1) => (n + 1) * fct n

def fibAux : Nat → Nat → Nat → Nat
  | 0, a, _ => a
  | (n + 1), a, b => fibAux n b (a + b)
def fibN (n : Nat) : Nat := fibAux n 0 1

def chooseN : Nat → Nat → Nat
  | _, 0 => 1
  | 0, _ + 1 => 0
  | (n + 1), (k + 1) => chooseN n k + chooseN n (k + 1)

def catalanN (n : Nat) : Nat := chooseN (2 * n) n / (n + 1)

${domBody}
${domGraph}${domControl}
end Coils
`

// ── CHECK, OR WRITE WHEN ASKED ───────────────────────────────────────────────────────────────────────────
// The comparison is on the WHOLE generated file, not on the coil count. A count is the flattering number
// here: the vocabulary can change which expressions fall into which coil while the number of coils holds
// steady, and a check on the count would pass through exactly that. The bytes are what the kernel reads, so
// the bytes are what is compared — and the first differing line is printed, because "it differs" sends the
// reader to a 300-line diff while the line itself usually names the cause.
// The check itself is src/api generatedLean, shared with group.ts and bridge.ts since 2026-10-03 — it was
// written here first and copied twice.
generatedLean('coils.lean', generated, { emit: process.argv.includes('--emit'), label: 'coils', summary: `${coils.length} coil(s)` })
