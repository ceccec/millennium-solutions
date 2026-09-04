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
import { census, leanFiles, leanSource, leanTheorems, clayFloor, advantage, ledger, THEOREM_DEFINITION } from '../src/api/index.ts'

const ledgerTotal = (ledger() as unknown[]).length

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
// NOT ONLY THE KEY COUNT. This checked the live-key number and nothing else, and speedup.md was published
// saying "generated from the 2380 theorems" — the LEDGER ENTRY count, most of which are withdrawn — three
// lines after the same file said "the 2380 receipts" correctly. Every count that is not the theorem count
// is forbidden next to the word, and each is named so the failure says which number was mistaken for it.
//
// The theorem count itself is THEOREM_DEFINITION in src/api: a declaration the kernel accepts, sorry-free
// and axiom-free, closed by exhaustion. A key is an address; an entry is a receipt.
const NOT_THEOREM_COUNTS: [number, string][] = [
  [C.liveKeys, `the live KEY count — an address, and ${C.surplusKeys} theorems carry two`],
  [ledgerTotal, `the LEDGER ENTRY count — a receipt, and ${ledgerTotal - C.liveKeys} of them are withdrawn`],
  [C.theorems, `the KERNEL-ACCEPTED DECLARATION count — ${C.rfl} of those close by rfl, which seal-lean.ts calls "a declaration, not algebra"`],
]

/** A PARTITIVE IS NOT A MISCOUNT. "483 of those 491 are THEOREMS" names the smaller number as the subject
 *  and the larger as the pool it is drawn from — which is the correct sentence, and the one this deposit
 *  should be writing. Only a number that is itself being quantified as theorems fires. */
const partitive = (line: string, at: number) => /\bof\s+(those\s+)?$/i.test(line.slice(Math.max(0, at - 12), at))
for (const f of files) {
  if (f.endsWith('contradictions.ts')) continue
  const src = readFileSync(f, 'utf8')
  src.split('\n').forEach((line, i) => {
    for (const [n, what] of NOT_THEOREM_COUNTS) {
      if (n === C.byDecide) continue
      // The number must be QUANTIFYING the word, not merely near it. A 40-character window that allowed
      // punctuation flagged "the ledger is held at 2380 (the captain's cap): improving a theorem's name…",
      // where 2380 counts entries and the later clause is about something else entirely. Clause breaks end
      // the window, so only an adjectival run between the number and the noun counts.
      const hit = new RegExp(`\\b${n}\\b[^.\\n:;()\\[\\]]{0,25}?\\btheorem`, 'i').exec(line)
      if (hit && !partitive(line, hit.index))
        fail(`${f}:${i + 1} calls ${n} a theorem count — that is ${what}. Theorems: ${C.byDecide} (${THEOREM_DEFINITION})`)
    }
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

// ── 4c · nothing claims a quantum computer or a quantum speedup ──────────────────────────────────────────
// THE ASYMMETRY THIS CLOSES: the Clay floor is gated above by 960 swept phrasings, and the quantum floor —
// a claim of comparable consequence — had NO gate at all. It lived in prose (`quantum.lean`: "No hardware,
// no speedup, no physics"; WHITEPAPER: "Not a quantum computer") and in fixtures for the lexical gate that
// was REMOVED. A boundary held only by sentences is a boundary that survives exactly as long as nobody
// edits the sentences.
//
// What the deposit DOES claim is structural and stays claimed: order-invariance over every permutation
// (quantum.lean), and a verification path of log₂N rounds against N recomputations, whose ratio widens with
// every doubling (speed.lean). That is a classical, structural advantage and it is unbounded in N. It is
// not a faster clock, not hardware, and not a quantum algorithm.
//
// NEGATION IS NOT ASSERTION. "quantum speedup is not claimed here" and "Not a quantum computer" are the
// repo's own honest sentences and must pass; only an assertion fires. The negator is checked in the window
// BEFORE the claim, which is where a refusal puts it.
const QUANTUM_CLAIM = /\b(?:we|this (?:work|framework|deposit|paper|repo|system))\s+(?:have\s+|has\s+|is\s+|are\s+)?(?:a\s+|an\s+|the\s+)?(?:built|run|runs|uses?|achieves?|achieved|delivers?|delivered|demonstrates?|provides?|offers?)?\s*(?:a\s+|an\s+|the\s+)?(?:quantum\s+(?:computer|speedup|supremacy|advantage\s+in\s+time|hardware|processor)|qubit\s+hardware|shor'?s?\s+algorithm|grover'?s?\s+algorithm|exponential\s+speedup)/i
const NEGATOR = /\b(?:no|not|never|without|refus\w*|denie[sd]|drains?|neither|nor|is not|does not|claims? no)\b/i

for (const f of files) {
  if (f.endsWith('contradictions.ts')) continue
  for (const [n, line] of assertedLines(f, readFileSync(f, 'utf8'))) {
    const bare = line.replace(/"[^"]*"|'[^']*'|`[^`]*`|“[^”]*”/g, ' ')
    const m = QUANTUM_CLAIM.exec(bare)
    if (!m) continue
    // the refusal window: a negator anywhere before the claim in this line
    if (NEGATOR.test(bare.slice(0, m.index))) continue
    fail(`${f}:${n} claims a quantum computer or speedup in its own voice; quantum.lean states "No hardware, no speedup, no physics" and the advantage in speed.lean is log-rounds against N recomputations, which is classical`)
  }
}

// Per branch, like the Clay sweep — an alternation is not tested until each branch is.
const Q_SUBJ = ['We', 'This work', 'This framework', 'This deposit', 'This system']
const Q_VERB = ['built', 'run', 'use', 'achieve', 'deliver', 'demonstrate', 'provide']
const Q_OBJ = ['a quantum computer', 'a quantum speedup', 'quantum supremacy', 'qubit hardware',
  "Shor's algorithm", "Grover's algorithm", 'an exponential speedup', 'a quantum processor']
let qSwept = 0
const qSlipped: string[] = []
for (const sub of Q_SUBJ) for (const v of Q_VERB) for (const o of Q_OBJ) {
  qSwept++
  if (!QUANTUM_CLAIM.test(`${sub} ${v} ${o}.`)) qSlipped.push(`${sub} ${v} ${o}.`)
}
if (qSlipped.length)
  fail(`${qSlipped.length} of ${qSwept} quantum-overclaim phrasings pass uncaught, e.g. ${JSON.stringify(qSlipped.slice(0, 3))}`)

// AND THE HONEST SENTENCES MUST SURVIVE. A gate that also drains the repo's own refusals would force them
// out of the prose, which is the opposite of what it is for.
const HONEST = [
  'This deposit is not a quantum computer.',
  'quantum speedup is not claimed here; 0/7',
  'it sends no superluminal signal, and has no quantum speedup',
  'This work uses no quantum hardware.',
  'This framework provides no quantum advantage in time.',
]
for (const h of HONEST) {
  const m = QUANTUM_CLAIM.exec(h)
  if (m && !NEGATOR.test(h.slice(0, m.index)))
    fail(`the quantum check drains an honest refusal, which would push the boundary out of the prose: ${JSON.stringify(h)}`)
}

// ── 4d · THE INVERSE RATCHET: what is proved must also be said ───────────────────────────────────────────
// Every check above guards against claiming more than the evidence. Measured today, this repo claims LESS:
// all four overclaim gates return zero findings, while four of eight proved properties were absent from the
// pages a reader actually opens — the log-rounds path, the widening gap, the measured ratio, and priority.
// Understating a proved result is not modesty. It is a page that misinforms in the other direction, and it
// is the direction nothing here was watching.
//
// Each row names a property, the evidence that establishes it, and a pattern that shows it is stated. A row
// fails when the evidence stands and the page has gone quiet about it — which is what a regression looks
// like from this side.
const front = readFileSync('index.md', 'utf8') + readFileSync('README.md', 'utf8')
const PROVED: [string, RegExp, string][] = [
  ['kernel-checked theorem count',       /\b\d{3}\b[^.\n]{0,60}theorem/i,            'src/proof, #print axioms per theorem'],
  ['closed by decide, not sampled',      /by\s*`?decide`?/i,                          'the tactic recorded per theorem'],
  ['verification is log rounds, not N',  /log₂|log2|logarithmic/i,                     'speed.lean the_verify_path_is_the_exponent'],
  ['the gap widens at every doubling',   /widen|unbounded|every doubling/i,            'speed.lean the_gap_widens_with_every_doubling'],
  ['the measured ratio',                 new RegExp(String(advantage().ratio)),        'speed.lean the_measured_ratio_at_a_million_leaves'],
  ['order-invariant over permutations',  /order.invarian|permutation/i,                'quantum.lean receipt_is_order_invariant'],
  ['the chain verifies end to end',      /chain intact|append-only|recei/i,            'forensics over the whole ledger'],
]
for (const [claim, shown, evidence] of PROVED)
  if (!shown.test(front))
    fail(`the front pages do not state "${claim}" — it is established by ${evidence}. Proved and unsaid is an underclaim, and this repo's gates were all pointed the other way`)

// ── 5 · no assertion may certify an assignment ───────────────────────────────────────────────────────────
// The defect removed from src/proof/index.lean, swept across the tree. `def provenHere : Nat := 0` with a
// theorem deciding `provenHere = 0` certifies that a number the author typed equals itself; in TypeScript
// the same shape is `const solved = 0` followed by a test asserting `solved === 0`. erpax-94 found 507 of
// these in its own tree after I reported mine, which is why this is a standing check and not a one-off:
// the shape recurs wherever a value is declared and then confirmed rather than derived.
//
// It reads every `const NAME = <literal>` in a file and fails on any `NAME === <same literal>` in that same
// file. Deriving the value instead — from a function, a measurement, the tree — makes the comparison able
// to report something other than what was typed, which is the whole difference.
for (const f of files) {
  if (f.endsWith('contradictions.ts')) continue
  const src = readFileSync(f, 'utf8')
  const declared = new Map<string, string>()
  for (const m of src.matchAll(/^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=\s*(-?\d+|'[^']*'|"[^"]*"|true|false)\s*$/gm))
    declared.set(m[1], m[2].replace(/['"]/g, ''))
  for (const m of src.matchAll(/([A-Za-z_$][\w$]*)\s*===\s*(-?\d+|'[^']*'|"[^"]*"|true|false)/g)) {
    const lit = m[2].replace(/['"]/g, '')
    if (declared.get(m[1]) === lit)
      fail(`${f}:${src.slice(0, m.index).split('\n').length} asserts ${m[1]} === ${m[2]} where ${m[1]} is declared as that same literal in this file — an assertion certifying an assignment`)
  }
}

console.log(bad
  ? `\n✗ contradictions: ${bad} finding(s) — prose or code disagrees with src/proof`
  : `\n✓ contradictions: none — ${C.byDecide} theorems (closed by exhaustion) + ${C.rfl} rfl declarations = ${C.theorems} kernel-accepted; ${C.liveKeys} live keys = ${C.sealedTheorems} sealed + ${C.surplusKeys} keyed twice + ${C.unresolvableKeys} unresolvable; no sorry, no Mathlib, no native_decide, no axiom; nothing claims a Clay problem, all ${swept} Clay + ${qSwept} quantum overclaim phrasings are caught while ${HONEST.length} honest refusals survive; and ${PROVED.length} proved properties are stated on the pages, not only in the sources`)
process.exit(bad ? 1 : 0)
