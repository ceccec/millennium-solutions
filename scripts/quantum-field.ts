#!/usr/bin/env node
// THE FIELD AGREES WITH THE PROOF, or the build fails.
//
// src/quantum/field.ts computes the geometry the /quantum page renders. A picture derived from a
// transcription is only as good as the transcription, so this gate recomputes the figures and compares
// them with the kernel's.
//
// THE EXPECTED VALUES ARE READ OUT OF THE LEAN STATEMENTS, never typed here. A gate holding its own copy
// of `24` and checking TypeScript against it certifies that two things this file chose agree — the shape
// removed from index.lean and found again in eight proof files this session. Here the numbers come from
// the theorem text, so editing the Lean moves the target and editing the TypeScript fails the gate.
import { leanTheorems } from '../src/api/index.ts'
import { agreesWithLean } from '../src/quantum/field.ts'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

const stmt = (name: string): string => {
  const t = leanTheorems().find((x) => x.name === name && x.file.endsWith('quantum.lean'))
  if (!t) { fail(`quantum.lean has no theorem named ${name} — the field is transcribed from a proof that is gone`); return '' }
  return t.statement
}

/** Every numeral a statement is decided against, in order of appearance. */
const numerals = (s: string): number[] => (s.match(/=\s*(\d+)/g) ?? []).map((m) => +m.replace(/\D/g, ''))

const got = agreesWithLean()
const CHECKS: [string, string, number][] = [
  ['perms_of_four_is_factorial', 'perms_of_four_is_factorial', got.perms_of_four_is_factorial],
  ['superposition_collapses_to_one', 'superposition_collapses_to_one', got.superposition_collapses_to_one],
  ['the_uncanonicalised_fold_gives_many_answers', 'the_uncanonicalised_fold_gives_many_answers', got.the_uncanonicalised_fold_gives_many_answers],
]
for (const [label, name, value] of CHECKS) {
  const s = stmt(name); if (!s) continue
  const want = numerals(s)[0]
  if (want === undefined) fail(`${name}: no numeral found in its statement, so nothing can be compared`)
  else if (want !== value) fail(`${label}: quantum.lean decides ${want}, src/quantum/field.ts computes ${value}`)
}

// the limit theorem carries two numerals — the multisets and the receipts they collapse onto
const inj = stmt('the_receipt_is_not_injective')
if (inj) {
  const [sets, receipts] = numerals(inj)
  if (sets !== got.the_receipt_is_not_injective_sets)
    fail(`the_receipt_is_not_injective: quantum.lean decides ${sets} multisets, the field builds ${got.the_receipt_is_not_injective_sets}`)
  if (receipts !== got.the_receipt_is_not_injective_receipts)
    fail(`the_receipt_is_not_injective: quantum.lean decides ${receipts} receipts, the field builds ${got.the_receipt_is_not_injective_receipts}`)
}

console.log(bad
  ? `\n✗ quantum-field: ${bad} disagreement(s) — the rendered field does not match src/proof/quantum.lean`
  : `\n✓ quantum-field: the geometry agrees with the kernel — ${got.perms_of_four_is_factorial} orderings collapse to `
    + `${got.superposition_collapses_to_one} receipt where the uncanonicalised control gives `
    + `${got.the_uncanonicalised_fold_gives_many_answers}; ${got.the_receipt_is_not_injective_sets} multisets share `
    + `${got.the_receipt_is_not_injective_receipts} receipts, every figure read from the theorem it renders`)
process.exit(bad ? 1 : 0)
