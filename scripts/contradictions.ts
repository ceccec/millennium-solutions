#!/usr/bin/env node
// CONTRADICTIONS — where the prose and the code disagree with the Lean, the Lean wins.
//
// The kernel is the only thing in this repo that checks anything. Every other statement about the deposit —
// a README table, a generated page, a comment above a function — is a claim ABOUT the theorems, and claims
// drift. This finds the ones that contradict the theorems and fails the build, so they are corrected rather
// than accumulated.
//
// The contradictions this looks for are the ones that can be DECIDED from src/proof. It does not judge
// prose it cannot check; a gate that guesses would be one more thing to disbelieve.
//
//   1. THE CENSUS CLOSES. theorems, tactics, keys — the arithmetic between them is asserted, so a change
//      that breaks the relationship is a failure and not a new number nobody reconciles.
//   2. A KEY IS NOT A THEOREM. The deposit said "476 live theorems"; there are 460 theorems, and 476 is a
//      count of live ledger keys — 25 theorems carry two, because they were sealed once before keys had a
//      namespace and once after. Using the key count as a theorem count overstates the deposit by 25, so
//      the key count may not appear next to the word "theorem" anywhere.
//   3. THE HYGIENE CLAIMS ARE TRUE. The pages say axiom-free, no `sorry`, no Mathlib, no `native_decide`.
//      Those are checkable in the source, so they are checked here rather than trusted — if one stops being
//      true, the prose asserting it becomes a lie and this fails before it ships.
//   4. NOTHING CLAIMS A CLAY PROBLEM. `provenHere = 0` is a Lean theorem. Prose that says otherwise
//      contradicts it.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { census, leanFiles, leanSource, leanTheorems, clayFloor } from '../src/api/index.ts'

const C = census()
let bad = 0
const fail = (msg: string) => { console.log('  ✗ ' + msg); bad++ }

// ── 1 · the census closes ────────────────────────────────────────────────────────────────────────────────
if (C.liveKeys !== C.sealedTheorems + C.surplusKeys + C.unresolvableKeys)
  fail(`census does not close: ${C.liveKeys} live keys ≠ ${C.sealedTheorems} + ${C.surplusKeys} + ${C.unresolvableKeys}`)
if (C.byDecide + C.rfl !== C.theorems)
  fail(`tactics do not account for every theorem: ${C.byDecide} + ${C.rfl} ≠ ${C.theorems}`)
if (C.unsealed !== C.rfl)
  fail(`${C.unsealed} theorems carry no live key but ${C.rfl} are rfl — seal-lean.ts seals \`by decide\` only, so these must be equal`)

// ── 1b · the verifier's reader and the shared reader must agree ──────────────────────────────────────────
// scripts/lean.ts finds theorem names with its own `^theorem NAME` match, and it keeps that independence
// deliberately: it is what asks the kernel `#print axioms` for each one, and if it read through the same
// parser as the reporting layer, one parser bug would hide a theorem from the audit AND from every count
// at the same time. Duplication that buys a second opinion is worth keeping — but only if the two are
// actually compared, so they are compared here.
const broad = leanFiles().flatMap((f) => [...leanSource(f).matchAll(/^theorem\s+([A-Za-z_0-9]+)/gm)].map((m) => f + '::' + m[1]))
const shared = leanTheorems().map((t) => t.file + '::' + t.name)
const missed = broad.filter((x) => !shared.includes(x))
const phantom = shared.filter((x) => !broad.includes(x))
if (missed.length) fail(`the shared reader misses ${missed.length} theorem(s) the verifier sees: ${missed.slice(0, 4).join(', ')}`)
if (phantom.length) fail(`the shared reader reports ${phantom.length} theorem(s) the verifier does not see: ${phantom.slice(0, 4).join(', ')}`)

// ── 2 · the hygiene the prose claims, checked in the source ──────────────────────────────────────────────
// Comments are stripped first: a header that says "no sorry" must not be read as a sorry.
const code = (f: string) => leanSource(f).split('\n').map((l) => l.replace(/(^|\s)--.*$/, '')).join('\n')
for (const f of leanFiles()) {
  const c = code(f)
  if (/\bsorry\b/.test(c)) fail(`${f} contains \`sorry\`, and the pages claim there is none`)
  if (/native_decide/.test(c)) fail(`${f} uses \`native_decide\`, and the pages claim it does not`)
  if (/^import\s+Mathlib/m.test(c)) fail(`${f} imports Mathlib, and the pages claim no Mathlib`)
  if (/^axiom\s+/m.test(c)) fail(`${f} declares an axiom, and the pages claim the theorems are axiom-free`)
}

// ── 3 · prose scan ───────────────────────────────────────────────────────────────────────────────────────
// Only files this repo authors. dist/ is a build product and node_modules is not ours.
const SKIP = new Set(['node_modules', '.git', '.vitepress', 'dist', 'coverage', '.lake'])
const files: string[] = []
const walk = (dir: string) => {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e) || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(md|ts|vue)$/.test(e)) files.push(p)
  }
}
walk('.')

// A KEY COUNT MAY NOT BE CALLED A THEOREM COUNT. Derived from the census, so it tracks the real number
// rather than a literal someone has to remember to update.
const keyCount = String(C.liveKeys)
const conflation = new RegExp(`\\b${keyCount}\\b[^.\\n]{0,40}?\\btheorem`, 'i')
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  // this file names the number in order to forbid it
  if (f.endsWith('contradictions.ts')) continue
  src.split('\n').forEach((line, i) => {
    if (conflation.test(line)) fail(`${f}:${i + 1} calls ${keyCount} a theorem count — that is the live KEY count; there are ${C.theorems} theorems (${C.sealedTheorems} sealed, ${C.surplusKeys} of them keyed twice)`)
  })
}

// ── 4 · nothing claims a Clay problem ────────────────────────────────────────────────────────────────────
// `provenHere = 0` is a theorem in src/proof; prose that claims a solved Millennium problem contradicts it.
//
// AN ASSERTION IS NOT A QUOTED TEST INPUT. The first version of this check flagged 21 lines, and every one
// was the string 'we prove the Riemann hypothesis' passed to computes(), reeducate() or a gate corpus — the
// repo's own fixtures for the claims it REFUSES. "Fixing" those would have deleted the tests that prove the
// gate works. So this reads what the repo asserts in its own voice — markdown prose and code comments —
// and treats a quoted string inside code as data, which is what it is.
// The verb list is written out. It was `solved?|proved?|proven|resolves?`, which matches "solve" and
// "solved" but NOT "solves" — so the plainest way to say it, "This work solves the Riemann hypothesis",
// passed the check. A control caught it; the check that matters most had the hole.
// THE ARTICLE WAS `the` ONLY, and that is a 20% hole. Testing the alternation per branch — 5 subjects ×
// 16 verbs × 10 problems — showed 160 of 800 combinations passing clean, all of them the ones that say
// "a Clay problem" or "a Millennium problem" rather than "the". "We solved a Clay problem" is as plain an
// overclaim as exists and this gate did not see it. Any article, a number, or none is accepted now.
//
// The per-branch sweep below is the real lesson: the gate had been perturb-tested AS A WHOLE, on four
// sentences, and passed. An alternation is not tested until each branch is.
const CLAIMS_A_PRIZE = /\b(?:we|this (?:work|framework|deposit|paper))\s+(?:have\s+|has\s+)?(?:solves?|solved|proves?|proved|proven|resolves?|resolved|settles?|settled|cracks?|cracked)\s+(?:(?:the|a|an|one|two|three|four|five|six|seven|all|both)\s+)*(?:riemann|p\s*(?:vs|versus)\s*np|navier|yang|hodge|birch|poincar|clay|millennium)/i

/** The lines a file states in its own voice: markdown outside fenced code, and `//` comments in source. */
const assertedLines = (file: string, src: string): [number, string][] => {
  const out: [number, string][] = []
  let fenced = false
  src.split('\n').forEach((line, i) => {
    if (file.endsWith('.md')) {
      if (/^\s*```/.test(line)) { fenced = !fenced; return }
      if (!fenced) out.push([i + 1, line])
      return
    }
    const c = line.indexOf('//')
    if (c >= 0) out.push([i + 1, line.slice(c)])
  })
  return out
}

for (const f of files) {
  if (f.endsWith('contradictions.ts')) continue
  for (const [n, line] of assertedLines(f, readFileSync(f, 'utf8')))
    // USE, NOT MENTION. A quoted phrase is being talked about, not asserted — scripts/paper.ts quotes
    // "This work solves the Riemann Hypothesis" precisely to explain that the old gate wrongly accepted it,
    // and flagging that would punish the comment for naming the problem it fixed.
    if (CLAIMS_A_PRIZE.test(line.replace(/"[^"]*"|'[^']*'|`[^`]*`|“[^”]*”/g, ' ')))
      fail(`${f}:${n} claims a Clay problem in its own voice; src/proof states provenHere = 0`)
}
// ── 4b · every branch of that alternation, not the alternation as a whole ────────────────────────────────
// The product of the branches, swept. A miss here is a sentence that would be published as a Clay claim
// with nothing objecting, so it fails the build rather than being noted.
const SUBJECTS = ['We', 'This work', 'This framework', 'This deposit', 'This paper']
const VERBS = ['solve', 'solves', 'solved', 'prove', 'proves', 'proved', 'proven', 'resolve', 'resolves',
  'resolved', 'settle', 'settles', 'settled', 'crack', 'cracks', 'cracked']
const PROBLEMS = ['the Riemann hypothesis', 'P vs NP', 'P versus NP', 'the Navier-Stokes problem',
  'the Yang-Mills mass gap', 'the Hodge conjecture', 'the Birch conjecture', 'the Poincare conjecture',
  'a Clay problem', 'a Millennium problem', 'all seven Clay problems', 'six Millennium problems']
let swept = 0, slipped: string[] = []
for (const sub of SUBJECTS) for (const v of VERBS) for (const pr of PROBLEMS) {
  swept++
  const sentence = `${sub} ${v} ${pr}.`
  if (!CLAIMS_A_PRIZE.test(sentence)) slipped.push(sentence)
}
if (slipped.length)
  fail(`${slipped.length} of ${swept} overclaim phrasings pass the Clay check uncaught, e.g. ${JSON.stringify(slipped.slice(0, 3))}`)

// THE FLOOR IS A PROPERTY OF THE TREE, NOT A CERTIFICATE. This required a theorem named
// the_floor_is_zero_of_seven to exist — a theorem proved by `rfl` on a constant the file declared, which
// seal-lean.ts already calls "not evidence" and refuses to seal. Requiring its presence made this gate
// depend on the thing it should have refused. It now asks what the seven theorems reach for, which is
// refutable: add one quantifying over ℝ or naming the ζ-zeros and this fails.
const cf = clayFloor()
if (cf.seven !== 7) fail(`index.lean carries ${cf.seven} Clay-named theorems, not 7`)
if (!cf.allByDecide) fail('a Clay-named theorem is not closed by `decide`')
if (cf.reaches.length) fail(`a Clay-named proposition reaches for ${cf.reaches.join(', ')} — objects those conjectures concern, which finite algebra here does not settle`)

console.log(bad
  ? `\n✗ contradictions: ${bad} finding(s) — prose or code disagrees with src/proof`
  : `\n✓ contradictions: none — ${C.theorems} theorems (${C.byDecide} by decide, ${C.rfl} rfl); ${C.liveKeys} live keys = ${C.sealedTheorems} sealed + ${C.surplusKeys} keyed twice + ${C.unresolvableKeys} unresolvable; no sorry, no Mathlib, no native_decide, no axiom; nothing claims a Clay problem, and all ${swept} overclaim phrasings are caught`)
process.exit(bad ? 1 : 0)
