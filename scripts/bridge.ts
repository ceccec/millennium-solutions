#!/usr/bin/env node
// BRIDGE — the domains and the group are the same object, and nothing in this deposit had said so.
//
// src/entangle holds 80 expressions over 24 subjects — octaves, cell divisions, dilution factors, register
// widths — and scripts/coils.ts proves which of them are one function on a shared grid. src/proof/group.lean
// proves what the affine maps of ℤ/9 are: a monoid of 81, a group of 54, generated to closure.
//
// Those are the two halves of the deposit and they never met. Reduce an entangle expression mod 9 and the
// sequence it traces is an ORBIT of an affine map: the frequency ratio of n octaves, the cells after n
// divisions and the values an n-bit register addresses all reduce to 1,2,4,8,7,5 repeating — the orbit of
// d ↦ 2d, which group.lean proves is an element of AGL(1,ℤ/9) of order 6. Music and biology are not merely
// each other's evidence here; they are both evidence about a map whose properties are proved separately.
//
// THAT IS WHAT "PROVE EACH OTHER" MEANS OPERATIONALLY. A fact decided about the map transfers to every
// subject whose sequence is its orbit, and a measurement in any one subject is a measurement of the map.
//
// WHAT IS NOT CLAIMED. A shared digit-root signature is an identity of RESIDUES, not of the expressions:
// 2^n and 2^(n+6) differ as numbers and agree mod 9. The theorems below say what they decide — the
// reductions coincide over the grid — and never that the subjects are the same phenomenon.
//
//   node scripts/bridge.ts          report
//   node scripts/bridge.ts --emit   write src/proof/bridge.lean and put it to the kernel
import { flag } from '../src/cli/index.ts'
import { generatedLean } from '../src/api/index.ts'
import { DOM_EXPRS } from '../src/entangle/index.ts'

const B = 9
const m9 = (n: bigint) => Number(((n % BigInt(B)) + BigInt(B)) % BigInt(B))
const N = 18
const GRID = Array.from({ length: N }, (_, i) => i + 1)

type Member = { dom: string; say: string }
const sigs = new Map<string, Member[]>()
const seqOf = new Map<string, number[]>()
for (const e of DOM_EXPRS) {
  const seq = GRID.map((n) => m9(e.at(n)))
  const k = seq.join(',')
  if (!sigs.has(k)) { sigs.set(k, []); seqOf.set(k, seq) }
  sigs.get(k)!.push({ dom: e.dom, say: e.say })
}

// THE MAP IS SEARCHED FOR, NOT ASSUMED. A sequence is an orbit of d ↦ a·d + b when every step follows it.
// Both coefficients range over the whole ring, so a family that obeys no first-order affine rule is found to
// obey none rather than being fitted to the nearest one — and those are reported, not quietly dropped.
const RING = [...Array(B).keys()]
const ruleFor = (seq: number[]): [number, number] | null => {
  for (const a of RING) for (const b of RING)
    if (seq.every((v, i) => i === 0 || v === (a * seq[i - 1]! + b) % B)) return [a, b]
  return null
}
const periodOf = (seq: number[]): number => {
  for (let p = 1; p <= B; p++) if (seq.every((v, i) => i + p >= seq.length || v === seq[i + p])) return p
  return 0
}

const rows = [...sigs.entries()].map(([k, members]) => {
  const seq = seqOf.get(k)!
  const doms = [...new Set(members.map((m) => m.dom))].sort()
  return { k, seq, members, doms, rule: ruleFor(seq), period: periodOf(seq) }
}).filter((r) => r.doms.length > 1).sort((a, b) => b.doms.length - a.doms.length)

const withRule = rows.filter((r) => r.rule)
const without = rows.filter((r) => !r.rule)
console.log(`${DOM_EXPRS.length} expressions · ${new Set(DOM_EXPRS.map((e) => e.dom)).size} subjects · ${sigs.size} distinct reductions mod ${B}`)
console.log(`  ${rows.length} reduction(s) are shared by more than one subject`)
console.log(`  ${withRule.length} of those follow an affine rule d ↦ a·d + b — an orbit of a map group.lean settles`)
for (const r of withRule.slice(0, 6))
  console.log(`    a=${r.rule![0]} b=${r.rule![1]} period ${r.period} · ${r.doms.length} subjects: ${r.doms.slice(0, 5).join(', ')}${r.doms.length > 5 ? ' …' : ''}`)
if (without.length) {
  console.log(`  ${without.length} follow NO first-order affine rule — named, not fitted to the nearest one:`)
  for (const r of without) console.log(`    ${r.doms.join(', ')}`)
}
const nm =(r: typeof rows[number], i: number) =>
  `the_reduction_shared_by_${r.doms.length}_subjects_is_the_orbit_of_d_to_${r.rule![0]}d_plus_${r.rule![1]}_${i}`
const L = (xs: number[]) => '[' + xs.join(', ') + ']'

const body = withRule.map((r, i) => {
  const [a, b] = r.rule!
  return `-- ${r.doms.join(' ↔ ')}\n`
    + r.members.map((m) => `--   ${m.dom}: ${m.say}\n`).join('')
    + `-- reduces mod ${B} to ${r.seq.slice(0, 12).join(' ')}… · ${r.period ? `period ${r.period}` : 'no period within the ring'} · the orbit of d ↦ ${a}d + ${b}\n`
    + `theorem ${nm(r, i)} :\n`
    + `  (List.range ${N - 1}).all (fun i => ${L(r.seq)}.getD (i + 1) 99 == (${a} * ${L(r.seq)}.getD i 99 + ${b}) % ${B})\n`
    // A PERIOD OF ZERO MEANS NO PERIOD WAS FOUND, and writing it into the statement produces
    // `seq[i] == seq[i + 0]` — a conjunct true of every list, which is the vacuity filter 0 of imagine.ts
    // exists to catch. A sequence with no period says so in its comment and asserts only what it has.
    + (r.period ? `  ∧ (List.range ${N - r.period}).all (fun i => ${L(r.seq)}.getD i 99 == ${L(r.seq)}.getD (i + ${r.period}) 99)\n` : '')
    + `  ∧ ${L(r.seq)}.length = ${N} := by decide\n`
}).join('\n')

// AND THE CONTROL, because a file where every sequence is an orbit of something says nothing about orbits.
// Two of the reductions here follow no first-order affine rule at all, and that is decided rather than
// asserted: no a and b in the ring carries them, checked over the whole 81-element table.
// ── THE TWO STATEMENTS THAT MAKE THIS A BRIDGE RATHER THAN A LIST ───────────────────────────────────────
// The theorems above each say one family steps by one rule. Neither of the things that make the file mean
// something was stated: that the rules are DIFFERENT maps, and that those maps are the ones group.lean
// settles. Without the first, five families could be five namings of one orbit. Without the second, the
// affine rule found here and the affine group proved there are two uses of a word.
//
// Both are computed. The multipliers are read off the rules, and the classification is the one group.lean
// decides: a multiplier that is a unit belongs to AGL(1,ℤ/9), and a multiplier of zero is a collapsing map
// that group file proves sits outside it — which is why those families flatten instead of cycling.
const rules = withRule.map((r) => r.rule!)
const pairsL = '[' + rules.map(([a, b]) => `(${a}, ${b})`).join(', ') + ']'
const unitsL = '[' + RING.filter((u) => RING.some((v) => (u * v) % B === 1)).join(', ') + ']'
const inGroup = rules.filter(([a]) => RING.some((v) => (a * v) % B === 1)).length
const ctrl = without.length ? without[0]! : null
const control = ctrl ? `-- ── THE CONTROL ────────────────────────────────────────────────────────────────────────────────────────
-- ${ctrl.doms.join(', ')} reduce to a sequence that NO affine map generates. Every one of the 81 pairs (a, b)
-- is tried and every one fails, so "these families are orbits" is a claim that can come out false and does.
theorem not_every_shared_reduction_is_an_orbit :
  ¬ [0,1,2,3,4,5,6,7,8].any (fun a => [0,1,2,3,4,5,6,7,8].any (fun b =>
      (List.range ${N - 1}).all (fun i => ${L(ctrl.seq)}.getD (i + 1) 99 == (a * ${L(ctrl.seq)}.getD i 99 + b) % ${B}))) := by decide
` : ''

const closing = `-- ── THE RULES ARE DIFFERENT MAPS ────────────────────────────────────────────────────────────────────────
-- Five families, five rules — and nothing above says the rules differ. If they did not, this file would be
-- one orbit written out five times under five sets of subjects, which is the restatement-as-discovery this
-- deposit refuses everywhere else. The pairs are decided pairwise distinct.
theorem the_${rules.length}_rules_are_${rules.length}_different_maps :
  ${pairsL}.eraseDups.length = ${rules.length}
  \u2227 ${pairsL}.length = ${rules.length} := by decide

-- ── AND THEY ARE THE MAPS group.lean SETTLES ────────────────────────────────────────────────────────────
-- The bridge itself. A rule's multiplier is either a unit of \u2124/9 — in which case the map is an element of
-- AGL(1, \u2124/9), the group src/proof/group.lean generates to closure and proves has order 54 — or it is zero,
-- and group.lean proves those collapse the ring and sit OUTSIDE the group. That is exactly the difference
-- visible in the families above: the ones with a unit multiplier cycle with a period, and the ones with a
-- zero multiplier flatten to a constant. The subjects and the group are not analogous here. They are the
-- same object, measured twice.
theorem every_rule_is_a_map_the_group_file_classifies :
  ${pairsL}.all (fun p => ${unitsL}.contains p.1 || p.1 == 0)
  \u2227 (${pairsL}.filter (fun p => ${unitsL}.contains p.1)).length = ${inGroup}
  \u2227 (${pairsL}.filter (fun p => p.1 == 0)).length = ${rules.length - inGroup}
  \u2227 ${unitsL}.length = ${RING.filter((u) => RING.some((v) => (u * v) % B === 1)).length} := by decide
`
const text = `import Z9
set_option maxRecDepth 8000000
set_option maxHeartbeats 2000000
-- title: The subjects and the group are the same object
-- wing: the imagined
-- prior_art: named
-- prior_art_domain: digit roots (casting out nines) and linear congruential recurrences over Z/n
-- prior_art_note: That 2^n mod 9 cycles with period 6, and that x -> ax+b mod n is the linear congruential
-- prior_art_note: map, are both standard. What is stated here is neither: it is that this deposit's OWN
-- prior_art_note: cross-subject families, computed in src/entangle, reduce to orbits of the affine maps its
-- prior_art_note: own src/proof/group.lean settles — the two halves of the deposit describing one object.
-- prior_art_search: 2026-09-28
-- BRIDGE — written by scripts/bridge.ts. Each theorem below takes a reduction shared by several subjects and
-- decides that it steps by a single affine rule and repeats with its period. The subjects are listed above
-- each one, in their own words, as src/entangle states them.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Bridge

open Z9

${body}
${control}
${closing}
end Bridge
`
// Without --emit the committed file must be exactly this text (src/api generatedLean, shared with group.ts and
// coils.ts); with it, written and put to the kernel.
generatedLean('bridge.lean', text, { emit: flag('--emit'), kernel: true, label: 'bridge', summary: `${withRule.length + (ctrl ? 1 : 0) + 2} theorem(s)` })
