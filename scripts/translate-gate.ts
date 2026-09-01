#!/usr/bin/env node
// TRANSLATE GATE — the traps, written down, so each is found once.
//
// A mistranslation that TYPE-CHECKS is the worst failure available here. The kernel cannot catch it (it is
// well-formed Lean), the agreement check cannot catch it (it compares truth VALUES, and a wrong statement can
// be true), and the ledger seals it. Every other error this session was recoverable by re-running something;
// that one is not, because the output is a receipted claim.
//
// It nearly happened. Resolving the deposit's shared `U` produced `let [1,2,4,5,7,8] := [1, 2]` for a test
// that rebinds U for the quaternions — valid Lean, entirely false, and caught only because I happened to test
// the shadowed case on purpose. Happening to test something is not a method.
//
// So each trap found is a case here: the input, and either the exact Lean expected or the refusal expected.
// They are not samples of what works. Every one is a specific way a rendering has gone wrong or could,
// and several are drawn from renderings that actually shipped before the kernel or a reading caught them.
import { translate } from '../src/prove/translate.ts'

type Case = { input: string; trap: string } & ({ lean: string } | { refused: RegExp })

const CASES: Case[] = [
  // ── the near-miss: a rebound name is a different name ──
  { input: '{ const U = [1, 2]; return U.length === 2 }', trap: 'a body that rebinds U must not get the ℤ/9 units',
    lean: 'let U := [1, 2]; U.length == 2' },
  { input: 'U.every((u) => m9(u * u) !== 0)', trap: 'the shared U resolves when it is NOT rebound',
    lean: '[1,2,4,5,7,8].all (fun u => M9 (u * u) != 0)' },

  // ── operators that mean different things in the two languages ──
  { input: 'relationXor(1, 1) === 0', trap: 'JS ^ is XOR and Lean ^ is a power — a bare ^ must never survive',
    refused: /\^|xor|no faithful/i },
  { input: '3 / 2 === 1', trap: 'JS division is exact, Nat division truncates — inexact division is refused',
    refused: /\// },
  { input: '(8 * 7) / 2 === 28', trap: 'an exact literal division is kept as written', lean: '(8 * 7) / 2 == 28' },

  // ── greedy patterns: the literal that ate its own delimiter ──
  { input: "toUuid('a') === toUuid('a')", trap: 'the literal must stop at its closing quote, not run to the next one',
    lean: 'Address.toUuidBytes [97] == Address.toUuidBytes [97]' },

  // ── precedence: a JS method chain is not a Lean application chain ──
  { input: 'Array.from({length: 22}, (_, n) => n).filter((n) => n >= 0).length === 22',
    trap: 'a projection after a call must bind to the RESULT, not to the function',
    lean: '((List.range 22).filter (fun n => n >= 0)).length == 22' },

  // ── substitution that only replaced the first occurrence ──
  { input: '[1, 2].every((d) => m9(d * d) === m9(d * d))', trap: 'every occurrence of a binder is substituted, not the first',
    lean: '[1, 2].all (fun d => M9 (d * d) == M9 (d * d))' },

  // ── a function with the same NAME and different behaviour on each side ──
  { input: "merkleFold(['a', 'b']) === merkleFold(['b', 'a'])",
    trap: 'TS merkleFold merges raw strings; the Lean port merges uuid byte-lists — refused, not approximated',
    refused: /merkleFold/ },
  { input: "toUuid('a').length === 36", trap: 'a uuid STRING is 36 chars where the byte list is 16 — length is not portable',
    refused: /toUuid|length/i },

  // ── the removed lexical gate: a claim about it is not renderable ──
  { input: "computes('we prove it').binary === 0", trap: 'the gate no longer drains; a claim about draining cannot be rendered',
    refused: /computes/ },

  // ── shapes that ARE mechanical, and must stay so ──
  { input: '{ for (let n = 0; n <= 8; n++) if (m9(n) !== n % 9) return false; return true }',
    trap: 'an early-return validation loop is a universal quantifier',
    lean: "(List.range' 0 9).all (fun n => ¬ (M9 (n) != n % 9))" },
  { input: '{ let s = 0; for (let k = 1; k <= 5; k++) s += k * k; return s === 55 }',
    trap: 'an accumulator loop is a map then a fold',
    lean: "let s := ((List.range' 1 5).map (fun k => k * k)).foldl (fun x y => x + y) 0; s == 55" },
  { input: 'm9(U.reduce((a, b) => a + b, 0)) === 0', trap: 'reduce with an explicit seed is a fold, and must reach the rules at all',
    lean: 'M9 ([1,2,4,5,7,8].foldl (fun a b => a + b) 0) == 0' },
  { input: 'all2((a, b) => NOT(AND(a, b)) === OR(NOT(a), NOT(b)))',
    trap: 'the bit connectives render arithmetically on {0,1}, with no bitwise operator',
    lean: '[0,1].all (fun a => [0,1].all (fun b => (1 - (a * b)) == ((1 - a) + (1 - b) - (1 - a) * (1 - b))))' },
]

let bad = 0
console.log(`translate — ${CASES.length} traps, each found once and written down:`)
for (const c of CASES) {
  const t = translate(c.input)
  if ('lean' in c) {
    const got = t.ok ? t.lean : `REFUSED (${'why' in t ? t.why : ''})`
    const ok = t.ok && t.lean === c.lean
    if (!ok) { bad++; console.log(`  ✗ ${c.trap}\n      in:       ${c.input.slice(0, 84)}\n      expected: ${c.lean}\n      got:      ${got.slice(0, 110)}`) }
  } else {
    const ok = !t.ok && c.refused.test('why' in t ? t.why : '')
    if (!ok) { bad++; console.log(`  ✗ ${c.trap}\n      in:  ${c.input.slice(0, 84)}\n      expected a refusal matching ${c.refused}, got ${t.ok ? 'a rendering: ' + t.lean.slice(0, 70) : 'a different refusal'}`) }
  }
}
console.log(bad
  ? `\n✗ translate-gate: ${bad} of ${CASES.length} traps are no longer guarded — a rendering may now state something other than its claim`
  : `\n✓ translate-gate: all ${CASES.length} traps guarded · a rendering that type-checks is not thereby correct, and these are the ways it has been wrong`)
process.exit(bad ? 1 : 0)
