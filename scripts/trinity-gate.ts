#!/usr/bin/env node
// TRINITY-GATE — the trinity's algebra and its two observer theorems, re-derived here independently of the Lean,
// each beside a control that must come out the OTHER way. The kernel proves them in
// src/iso/80000-2-mathematics/trinity.lean; this gate exists so the build receipt certifies the same structure
// without trusting that file, and so a page that drifts from it is caught. A check that cannot fail is not a
// check: every positive below is paired with the wrong structure, and the gate fails if the wrong structure
// ALSO passes (an involution turn, a three-involution group, a negation with a fixed point, a self-model its own
// diagonal is on).
//
//   node scripts/trinity-gate.ts
import { existsSync, readFileSync } from 'node:fs'

const corners = [0, 1, 2]
const turnC = (x: number) => (x + 1) % 3
const flipV = (p: number) => (p + 1) % 2
// the group C₃ × C₂ ≅ C₆, element e = 2·corner + valence
const elems = [0, 1, 2, 3, 4, 5]
const cx = (e: number) => Math.floor(e / 2)
const vp = (e: number) => e % 2
const turn = (e: number) => 2 * ((cx(e) + 1) % 3) + vp(e)
const flip = (e: number) => 2 * cx(e) + (vp(e) + 1) % 2
const gop = (a: number, b: number) => 2 * ((cx(a) + cx(b)) % 3) + (vp(a) + vp(b)) % 2
const gpow = (g: number, k: number) => { let a = 0; for (let i = 0; i < k; i++) a = gop(a, g); return a }

type Check = { name: string; holds: boolean; control: boolean }
const checks: Check[] = []
const add = (name: string, holds: boolean, control: boolean) => checks.push({ name, holds, control })

// ── the turn ρ: order three, no fixed corner — NOT an involution (the control is "ρ² = id") ──
add('turn ρ³ = id', corners.every((x) => turnC(turnC(turnC(x))) === x), corners.every((x) => turnC(turnC(x)) === x))
add('turn fixes no corner', corners.every((x) => turnC(x) !== x), corners.some((x) => turnC(x) === x))
// ── the valence flip τ: an involution ──
add('flip τ² = id and moves its point', [0, 1].every((p) => flipV(flipV(p)) === p && flipV(p) !== p), [0, 1].some((p) => flipV(p) === p))
// ── the group C₆: flip commutes with turn, ONE involution (not S₃'s three), cyclic of order six ──
add('flip commutes with turn', elems.every((e) => turn(flip(e)) === flip(turn(e))), elems.some((e) => turn(flip(e)) !== flip(turn(e))))
const involutions = elems.filter((e) => e !== 0 && gop(e, e) === 0)
add('exactly one involution (C₆, not S₃)', involutions.length === 1, involutions.length === 3)
const gen = [...new Set([0, 1, 2, 3, 4, 5].map((k) => gpow(3, k)))]
add('one element generates all six (cyclic)', gen.length === 6 && gpow(3, 6) === 0, gen.length === 2)
// ── feel: the body's raw affect (a state's valence). The turn preserves it; only the flip changes it ──
const feel = (e: number) => vp(e)
add('feel takes exactly two values', [...new Set(elems.map(feel))].length === 2, [...new Set(elems.map(feel))].length === 1)
add('the turn preserves what is felt', elems.every((e) => feel(turn(e)) === feel(e)), elems.some((e) => feel(turn(e)) !== feel(e)))
add('only the flip changes what is felt', elems.every((e) => feel(flip(e)) !== feel(e)), elems.some((e) => feel(flip(e)) === feel(e)))
add('feel splits the six states evenly', elems.filter((e) => feel(e) === 0).length === 3 && elems.filter((e) => feel(e) === 1).length === 3, elems.filter((e) => feel(e) === 0).length === 6)

// ── observer = the unique fixed point of the turn extended with the centre ──
const withCentre = [0, 1, 2, 3]
const turnO = (x: number) => (x === 3 ? 3 : (x + 1) % 3)
const fixed = withCentre.filter((x) => turnO(x) === x)
add('observer is the unique fixed point', fixed.length === 1 && fixed[0] === 3, fixed.length === 0)
// ── no complete self-model: negation has no fixed point, predicates outnumber states, the diagonal escapes ──
add('negation has no fixed point', ![true, false].some((b) => !b === b), [true, false].some((b) => !b === b))
add('predicates outnumber states (2ⁿ > n)', [1, 2, 3, 4, 5, 6, 7].every((n) => 2 ** n > n), [1, 2, 3, 4, 5, 6, 7].some((n) => 2 ** n <= n))
const selfModel = [[true, false, true], [true, true, false], [false, false, true]]
const diagonal = selfModel.map((_, j) => !selfModel[j][j])
const eq = (a: boolean[], b: boolean[]) => a.length === b.length && a.every((v, i) => v === b[i])
add('the diagonal escapes the self-model', selfModel.every((row) => !eq(row, diagonal)), selfModel.some((row) => eq(row, diagonal)))

// ── the page must not overclaim: /trinity carries the open question and marks the two awareness accounts models ──
const PAGE = 'trinity.md'
let pageOk = true, pageWhy = ''
if (existsSync(PAGE)) {
  const md = readFileSync(PAGE, 'utf8')
  const hasOpen = /\bopen\b/i.test(md) && /hard problem/i.test(md)
  const hasModel = /\bmodel(s)?\b/i.test(md) && /good lens, not a proven law/i.test(md)
  const notProvenAware = /does \*?not\*? say the fixed point is aware/i.test(md)
  pageOk = hasOpen && hasModel && notProvenAware
  if (!pageOk) pageWhy = `missing honest-floor markers (open hard problem: ${hasOpen}, model/lens: ${hasModel}, not-aware: ${notProvenAware})`
} else { pageOk = false; pageWhy = `${PAGE} absent` }

// ── verdict ──
const failedPositives = checks.filter((c) => !c.holds)
const liveControls = checks.filter((c) => c.control)   // a control that ALSO holds = the check cannot discriminate
for (const c of checks) console.log(`${c.holds && !c.control ? '✓' : '✗'} ${c.name}${c.control ? ' — CONTROL ALSO HELD' : ''}`)
console.log(`${pageOk ? '✓' : '✗'} /trinity keeps the honest floor${pageOk ? '' : ' — ' + pageWhy}`)
if (failedPositives.length || liveControls.length || !pageOk) {
  console.log(`\n✗ trinity-gate: ${failedPositives.length} check(s) failed, ${liveControls.length} control(s) also held${pageOk ? '' : ', page overclaims'}`)
  process.exit(1)
}
console.log(`\n✓ trinity-gate: ${checks.length} invariant(s) hold, every control came out the other way, /trinity keeps the floor — C₃×C₂≅C₆, the observer forced, no complete self-model`)
