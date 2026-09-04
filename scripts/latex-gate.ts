#!/usr/bin/env node
// LATEX GATE — the typeset formula must be the theorem, or it must not be shown.
//
// src/latex renders a Lean statement as mathematics. That is a translation, and a wrong translation is
// worse than no translation: it reads as a theorem and is not one. Two failures already happened while it
// was being written, and both were silent — no exception, wrong output:
//
//   · the lexer folded `axis.contains d` into one identifier and printed `axis.contains(d)` instead of
//     `d ∈ axis`;
//   · `then` and `else` lex as identifiers, so application ate them and `if _ then _ else _` mis-parsed.
//
// So this gate holds two checks, because neither alone is enough:
//
//   1. ROUND-TRIP over every real statement. The parsed tree is written back out as Lean and the token
//      sequence compared with the source. Anything dropped, duplicated or reordered fails. Its limit is
//      stated in src/latex: it ignores grouping, so it does not check precedence.
//   2. PRECEDENCE, against Lean's own table, as explicit cases. This is exactly what the round-trip cannot
//      see, so it is written out rather than assumed — `a + b * c` must group as `a + (b * c)` and not as
//      `(a + b) * c`, and both round-trip identically.
//
// Coverage is reported and NOT enforced: a statement this grammar does not know falls back to verbatim
// Lean, which is correct. What is enforced is that nothing it DOES render is rendered wrongly.
import { leanTheorems } from '../src/api/index.ts'
import { toLatex, toMathML, roundTrips, unparse, parse } from '../src/latex/index.ts'

let bad = 0

// ── 1 · precedence, written out ──────────────────────────────────────────────────────────────────────────
// `unparse` prints fully parenthesised, so the expected string IS the grouping.
const PRECEDENCE: [string, string][] = [
  ['a + b * c', '(a + (b * c))'],
  ['a * b + c', '((a * b) + c)'],
  ['a - b - c', '((a - b) - c)'],
  ['a / b / c', '((a / b) / c)'],
  ['a ^ b ^ c', '(a ^ (b ^ c))'],
  ['a % b == c', '((a % b) == c)'],
  ['a * b % c', '((a * b) % c)'],
  ['¬ a ∧ b', '((¬ a) ∧ b)'],
  ['a ∧ b ∨ c', '((a ∧ b) ∨ c)'],
  ['a = b ∧ c = d', '((a = b) ∧ (c = d))'],
  ['a ∨ b → c', '((a ∨ b) → c)'],
  ['f x + 1', '((f x) + 1)'],
  ['f x y', '((f x) y)'],
  ['xs.length + 1', '((xs).length + 1)'],
]
for (const [src, want] of PRECEDENCE) {
  let got: string
  try { got = unparse(parse(src)) } catch (e: unknown) { got = 'THREW: ' + (e as Error).message }
  if (got !== want) { console.log(`  ✗ precedence: ${src}\n      expected ${want}\n      got      ${got}`); bad++ }
}

// ── 2 · round-trip over every statement that renders ─────────────────────────────────────────────────────
const T = leanTheorems()
let rendered = 0, verbatim = 0
const failures: string[] = []
for (const t of T) {
  const tex = toLatex(t.statement)
  const mml = toMathML(t.statement)
  if (tex === null) { verbatim++; continue }
  rendered++
  if (mml === null) { failures.push(t.name + ' (LaTeX rendered, MathML did not — one tree, two emitters, so they must agree)'); continue }
  if (!roundTrips(t.statement)) { failures.push(t.name + ' (round-trip)'); continue }
  // THE TWO EMITTERS MUST PRINT THE SAME NUMBERS. They read one tree, which is why the module says they
  // cannot disagree — and they did: the literal-bound simplification for ranges was written only in the
  // LaTeX path, so one theorem printed {0,…,8} typeset and {0,…,9−1} in its LaTeX. Comparing the numerals
  // each emits catches that class. (Read <mn> elements, not the tag-stripped text: stripping glues
  // adjacent numbers into one — 6 and 16 became 616 — and the check then reports differences that are
  // not there.)
  // Digits inside an identifier are not numbers: LaTeX writes `H2O` as \mathrm{H2O}, and counting that 2
  // as a numeral made this check report 173 differences that were entirely its own. Name wrappers are
  // removed before the numerals are read, so both sides count literals only.
  // WELL-FORMED, not merely present. The numeral comparison below would pass a mismatched or unclosed tag
  // just as happily, and a browser handed broken MathML renders something other than the theorem. Tags must
  // nest and close — checked here because a lot of this emitter was written today.
  const stack: string[] = []
  for (const tag of mml.matchAll(/<(\/?)([a-zA-Z]+)[^>]*?(\/?)>/g)) {
    const [, close, name, self] = tag
    if (self) continue
    if (close) { if (stack.pop() !== name) { failures.push(`${t.name} (MathML: mismatched </${name}>)`); break } }
    else stack.push(name)
  }
  if (stack.length) failures.push(`${t.name} (MathML: unclosed <${stack[stack.length - 1]}>)`)

  const texNums = (tex.replace(/\\(?:mathrm|operatorname|text)\{[^{}]*\}/g, '') .match(/\d+/g) ?? []).join(',')
  const mmlNums = [...mml.matchAll(/<mn>(\d+)<\/mn>/g)].map((m) => m[1]).join(',')
  if (texNums !== mmlNums) failures.push(`${t.name} (emitters disagree: LaTeX ${texNums} vs MathML ${mmlNums})`)
}
for (const f of failures.slice(0, 10)) console.log('  ✗ ' + f)
bad += failures.length

const pct = ((100 * rendered) / T.length).toFixed(1)
console.log(bad
  ? `\n✗ latex-gate: ${bad} finding(s) — a statement renders as mathematics that is not the statement`
  : `\n✓ latex-gate: ${rendered}/${T.length} statements typeset (${pct}%), each round-trip clean; ${verbatim} fall back to verbatim Lean; ${PRECEDENCE.length} precedence cases hold`)
process.exit(bad ? 1 : 0)
