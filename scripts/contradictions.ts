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
import { census, leanFiles, leanSource, leanTheorems, theoremOfKey, clayFloor, advantage, split, ledger, THEOREM_DEFINITION } from '../src/api/index.ts'

/** Words that turn a theorem NAME into an assertion about the world rather than about a finite domain. This
 *  is a word list and says so: it is the one part of the check that is not derived, so it is kept short,
 *  kept beside the check that uses it, and verified by planting a name that must fire. */
const exempted: string[] = []
const worldNamed: string[] = []
let claimedWithDefeater = 0
/** A hand-written aid, not a definition of the defect: nouns that make a name a claim about the world. */
const WORLD_NOUN = /(dna|genetic|gravity|intention|skipper|hull|hardware|entropy|superposition|creation|genesis|cell|sensor|diamond|codon|reading|perspective|harmonic|navigat|develop|cheap|budget)/i
const PHYSICAL_VOCAB = ['light', 'metres', 'metre', 'second', 'seconds', 'mass', 'energy', 'gravity',
  'spacetime', 'velocity', 'force', 'photon', 'quantum', 'relativity', 'orbit', 'earth', 'star']

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
    else if (/\.(md|ts|vue|lean)$/.test(e)) files.push(p)
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

/** The lines a file states in its own voice: markdown outside fenced code, `//` comments in TypeScript
 *  and Vue, and `--` comments in Lean.
 *
 *  THE LEAN ARM WAS MISSING AND THAT EMPTIED EVERY PROSE CHECK OVER THE PROOF TREE. `.lean` was absent
 *  from the walk above, and adding it there changed nothing — this function returned no lines for those
 *  files, because it looked for `//` and Lean opens a comment with `--`. The files were collected and
 *  their prose never reached a check: 19,519 words the deposit authors, embedded verbatim in paper.md,
 *  swept by nothing. A widened domain with no extractor behind it reports green for the reason an empty
 *  list does. That was measured — two planted overclaims, one Clay and one quantum, both passed. */
const assertedLines = (file: string, src: string): [number, string][] => {
  const out: [number, string][] = []
  let fenced = false
  src.split('\n').forEach((line, i) => {
    if (file.endsWith('.md')) {
      if (/^\s*```/.test(line)) { fenced = !fenced; return }
      if (!fenced) out.push([i + 1, line])
      return
    }
    const c = line.indexOf(file.endsWith('.lean') ? '--' : '//')
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
  // Added after measuring that ZERO of this session's five new results reached the front pages. They were
  // in the hundred-page paper and on their own theorem pages, and the homepage said nothing — including
  // the answer to what paying the two coins buys.
  ['the digit split is the ideal 3Z',    /multiple of 3/i,                             'split.lean every_token_is_a_multiple_of_three'],
  ['the coin step is 3 x the two coins', new RegExp(`deducts ${split().coinStep} from the token`, 'i'), 'split.lean the_coin_step_is_three_times_the_two_coins'],
  ['a seal buys one turn of the orbit',  /one complete turn of the orbit/i,            'split.lean the_budget_and_the_period_are_one_turn'],
]
// DERIVED, so a new source cannot be added and left unmentioned. The list below is hand-written and says
// so; this part is not. Every .lean file in src/proof must be NAMED on the front pages — coin.lean and
// split.lean both reached them only because pages.ts renders a section per source, and nothing was checking
// that it kept doing so. A file added tomorrow fails here rather than waiting for someone to notice.
//
// It is weaker than the rows below — naming a file is not stating its result — and the two are kept apart
// rather than blended, because a derived check that quietly stands in for a specific one is how a gate
// starts reporting the health of something other than what it claims.
const unnamed = leanFiles().filter((f) => !front.includes(f))
if (unnamed.length)
  fail(`${unnamed.length} Lean source(s) are named nowhere on the front pages: ${unnamed.join(', ')} — proved and unmentioned`)

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


// ── 4f · the same self-certifying shape, in LEAN, where the check above could not reach ──────────────────
// The sweep above reads `.ts` only. The identical defect lives in the proof tree as
// `def settledHere : Nat := N` with `theorem <file>_settles_… : settledHere = N := rfl` beside it — a
// declaration deciding that a number the author typed equals itself. It is the shape removed from
// index.lean this session (`provenHere = 0 := rfl`), and it survived in eight files because the sweep
// written to catch it stopped at the language boundary.
//
// These are NOT deleted, because the sentence they carry is a positive one worth stating: within a finite
// domain, this file leaves no residual uncertainty. What was wrong is that nothing recomputed the number.
// Five of the eight had drifted — fnv 10 for 12, merkle 7 for 8, quantum 6 for 8, reversal 7 for 8, all
// understating because the deposit only ever grows, and z9 21 for 20, OVERstating because it counted its
// own rfl declaration among the theorems it settles.
//
// The count is the file's declarations closing by exhaustion — the deposit's definition of a theorem — so
// the rfl declaration is excluded from its own total. Note what this check does and does not fix: the Lean
// declaration remains a tautology the kernel cannot refute. Falsifiability comes from HERE, where the
// number is recomputed from the tree and compared. That it can go red is measured, not assumed: it went
// red five times on the tree that existed when it was written.
for (const f of leanFiles()) {
  const src = leanSource(f)
  // BY SHAPE, NOT BY NAME. This matched the literal identifier `settledHere` — so it caught eight instances
  // and missed four, including `physicalClaims = 0` in two files and `noveltyEstablished = 0` in a third:
  // refusals that certify themselves, which is the worst place for this defect because a refusal is what a
  // reader trusts without checking. I wrote `def explanations := 0` into phenomena.lean hours after adding
  // this very check and then quoted it as evidence; the check could not see it, because I had written the
  // name I was fixing rather than the shape I was fixing. Sixth instance today of a check whose domain is
  // narrower than the defect it names, and erpax-94 found it by asking whether my own sweep reads the file.
  //
  // A constant USED elsewhere is not self-certifying — it is a definition the rest of the file depends on.
  // What is caught is a constant that appears nowhere but its own definition and the theorem asserting it
  // equals its own literal.
  for (const d of src.matchAll(/^def (\w+) : Nat := (\d+)$/gm)) {
    const [, name, lit] = d
    if (name === 'settledHere') continue   // handled below, with its own count check against the tree
    const asserts = new RegExp(`^theorem\\s+(\\w+)\\s*:[^:]{0,160}?\\b${name}\\s*=\\s*${lit}\\b`, 'm').exec(src)
    if (!asserts) continue
    const uses = [...src.matchAll(new RegExp(`\\b${name}\\b`, 'g'))].length
    if (uses <= 2 + 1) {   // the def, the assertion, and nothing else
      fail(`src/proof/${f}: \`${name}\` is defined as ${lit} and \`${asserts[1]}\` decides it equals ${lit}, and it is `
        + `used nowhere else — a number compared to itself. It certifies nothing and cannot go red however much `
        + `the file claims. Derive it, or delete the declaration and let a check that reads the corpus carry the claim.`)
    }
  }
  // ── A NAME THAT CLAIMS ABOUT THE WORLD OVER A PROPOSITION THAT DECIDES ARITHMETIC ────────────────────
  // REPORTS, does not fail. The physical-claim check below reads only files marked `-- REFUSES:
  // physical-claim` — which is why two theorems of mine slipped past it on the day I wrote it, one of them
  // conjoining a term with itself. This is the same defect without the marker: a proposition that references
  // NOTHING DEFINED IN ITS OWN FILE is deciding pure arithmetic, whatever its name announces.
  //
  // 4^3 = 64 is true and worth stating. `dna_is_the_version_itself` is not what it decides. The name is the
  // Zenodo title, the page heading and the ledger key, so it is what a reader is asked to believe.
  //
  // It reports because renaming a sealed theorem is a withdrawal in an append-only ledger and that is the
  // depositor's call, not a sweep's. The WORLD list is a hand-written aid and says so — it makes the count
  // visible, it does not define the defect.
  {
    const defs = new Set([...src.matchAll(/^(?:def|abbrev)\s+(\w+)/gm)].map((m) => m[1]))
    for (const t of src.matchAll(/^theorem\s+(\w+)\s*:([\s\S]*?):=\s*by\s+decide/gm)) {
      const st = t[2]
      if ([...defs].some((d) => new RegExp(`\\b${d}\\b`).test(st))) continue
      if (/List\.|\.all|\.any|\.filter|\.map|\.length/.test(st)) continue
      if (!WORLD_NOUN.test(t[1])) continue
      // DECIDED, OR NOT YET. A file that marks itself `-- CLAIMS: physical` and publishes the computation
      // that breaks its claims has answered this; one that has not is still carrying a name asserting more
      // than its proposition decides. Counting them together would say the depositor has a decision pending
      // when the decision is made and published — the same defect as an exemption nobody recorded, pointed
      // the other way.
      if (/^-- CLAIMS: physical$/m.test(src) && /falsifier|defeater|destroys it|breaks them/i.test(src)) claimedWithDefeater++
      else worldNamed.push(`${f}:${t[1]}`)
    }
  }

  // ── A CONJUNCTION THAT REPEATS A CONJUNCT ────────────────────────────────────────────────────────────
  // `A ∧ A` decides exactly what `A` decides, so the repetition adds a conjunct that cannot fail. I wrote
  // `1048576 / 20 = 52428 ∧ 1048576 / 20 = 52428` into a theorem on the same day I widened the sweep for
  // self-certifying literals — the identical shape, one notation along, and every check here walked past it.
  // Cheap to state and cheap to check: split on ∧, compare the parts.
  for (const t of src.matchAll(/^theorem\s+(\w+)\s*:([\s\S]*?):=\s*by\s+decide/gm)) {
    const parts = t[2].split('∧').map((x) => x.replace(/\s+/g, ' ').replace(/[()]/g, '').trim()).filter(Boolean)
    const dup = parts.find((x, i) => parts.indexOf(x) !== i)
    if (dup) fail(`src/proof/${f}: \`${t[1]}\` conjoins \`${dup}\` with itself — a conjunct that cannot fail, `
      + `so the theorem decides exactly what it would without it`)
  }

  // ── A FILE THAT REFUSES PHYSICAL CLAIMS IS CHECKED ON ITS PUBLISHED NAMES ─────────────────────────────
  // `coin.lean` and `light.lean` each carried `def physicalClaims : Nat := 0` decided against its own
  // literal. That is green whatever the file says, so the refusal was never checked. The refusal is real and
  // worth keeping, so it moved here, where the thing it is about — the TEXT — can actually be read.
  //
  // It is checked on theorem NAMES, not on propositions, because the name is the published surface: it is
  // the Zenodo record title, the page heading and the ledger key. `travel 1 = c` decides 299792458 × 1, and
  // no reader disputes it; a name asserting what a second of light spans is a statement about the world that
  // the proposition does not reach. The domain is DERIVED from the marker below, not listed here, so a file
  // that starts refusing physical claims is covered the day it says so.
  // ── A FILE THAT CLAIMS PHYSICALLY MUST PUBLISH ITS FALSIFIER ──────────────────────────────────────────
  // The marker was `-- REFUSES: physical-claim` and the check forbade physical vocabulary in theorem names.
  // Inverted, on the depositor's instruction: claim boldly, and let critics compute against it. A refusal
  // nobody can test and a claim nobody can test are the same defect; a claim WITH its defeater attached is
  // strictly more useful than either, because it tells a critic where to aim.
  //
  // So a file marked `-- CLAIMS: physical` must name the theorem that would break its claim. light.lean
  // claims the SI constants' digital roots miss exactly the primes below nine, and proves in the next
  // theorem that a change of unit destroys the pattern. The claim is bold and its limit is decided.
  if (/^-- CLAIMS: physical$/m.test(src)) {
    if (!/falsifier|destroys it|would break/i.test(src))
      fail(`src/proof/${f}: claims physically and names no falsifier — a bold claim without the computation `
        + `that would break it asks a reader to trust rather than to check`)
  }

  if (/^-- REFUSES: physical-claim$/m.test(src)) {
    for (const t of src.matchAll(/^theorem\s+(\w+)/gm)) {
      const hit = PHYSICAL_VOCAB.filter((w) => new RegExp(`(^|_)${w}(_|$)`).test(t[1]))
      // A name that DENIES the claim is not making it: `..._so_it_is_not_about_light` is the file doing
      // exactly what the refusal asks. This exemption is COUNTED AND PRINTED rather than applied silently,
      // because an exemption nobody sees is how a word list quietly stops covering anything.
      if (hit.length && /(^|_)(not|never|no|nothing|nor)(_|$)/.test(t[1])) {
        exempted.push(`src/proof/${f}: ${t[1]}`)
        continue
      }
      if (hit.length) {
        fail(`src/proof/${f}: the file refuses physical claims, and \`${t[1]}\` is published under a name that `
          + `makes one (${hit.join(', ')}). The proposition decides arithmetic on defined constants; the name `
          + `is the Zenodo title and the page heading, and it is what a reader is asked to believe.`)
      }
    }
  }

  const m = src.match(/^def settledHere : Nat := (\d+)$/m)
  if (!m) continue
  const decided = leanTheorems().filter((t) => t.file.endsWith(f) && t.tactic === 'by decide').length
  if (+m[1] !== decided)
    fail(`src/proof/${f}: settledHere = ${m[1]} but the file holds ${decided} declarations closing by exhaustion — a hand-typed count, published as typeset mathematics in paper.md, that nothing recomputed`)
  const named = src.match(/^theorem (\w+) : settledHere = (\d+) := rfl$/m)
  if (named && +named[2] !== +m[1])
    fail(`src/proof/${f}: ${named[1]} decides settledHere = ${named[2]} while the def says ${m[1]}`)
}

// ── 4g · THE LEDGER AND THE PROOF TREE COMPARED AS SETS, NOT COUNTS ──────────────────────────────────────
// The census above asserts liveKeys = sealed + keyed-twice + unresolvable. That is a COUNT identity, and a
// count identity survives a rename: swap two keys and the arithmetic still closes while both sides now
// name something the other does not. A sibling session (uuidna-49) found exactly this shape — three
// kernel-verified theorems sitting in one ledger while every consumer read another, with nothing failing,
// because absence does not announce itself the way a bad proof does.
//
// So both directions are compared by NAME. A theorem the kernel accepts with no live key is work that was
// proved and cannot be cited; a live key resolving to no theorem is an address with nothing behind it.
{
  const thms = leanTheorems()
  const decided = thms.filter((t) => t.tactic === 'by decide')
  const live = [...new Set((ledger() as { key: string; revoked?: boolean; status?: string }[])
    .filter((e) => e.revoked !== true && e.status !== 'revoked').map((e) => e.key))]
  const reached = new Set<string>()
  const dangling: string[] = []
  for (const k of live) {
    const t = theoremOfKey(k, thms)
    if (t) reached.add(t.name); else dangling.push(k)
  }
  const unsealed = decided.filter((t) => !reached.has(t.name)).map((t) => t.name)
  for (const n of unsealed.slice(0, 5))
    fail(`${n} closes by decide and no live ledger key resolves to it — proved, and not citable`)
  if (unsealed.length > 5) fail(`…and ${unsealed.length - 5} more theorems are proved with no live key`)
  // KNOWN AND STANDING: lean_add_group names a theorem declared in two files and cannot be resolved to one.
  // It is reported every run rather than excluded silently, because an exception that stops being visible
  // stops being an exception.
  const KNOWN = ['lean_add_group']
  for (const k of dangling.filter((k) => !KNOWN.includes(k)))
    fail(`live key ${k} resolves to no theorem in the tree — an address with nothing behind it`)
  const standing = dangling.filter((k) => KNOWN.includes(k))
  if (standing.length) console.log(`  ○ ${standing.length} standing unresolvable key(s), reported not excluded: ${standing.join(' ')}`)
}

if (claimedWithDefeater) console.log(`  ○ ${claimedWithDefeater} theorem(s) decide arithmetic under a name claiming about the world, in a file that CLAIMS physical and publishes the computation that breaks it — claimed boldly, falsifier attached, not a lead`)
if (worldNamed.length) console.log(`  ○ ${worldNamed.length} theorem(s) decide pure arithmetic under a name claiming about the world with NO published defeater — either claim it and publish the computation that breaks it, or let the name say what the proposition decides: ${worldNamed.slice(0, 6).join(' ')}${worldNamed.length > 6 ? ' …' : ''}`)
if (exempted.length) console.log(`  ○ ${exempted.length} physical-vocabulary name(s) exempted as denials, reported not hidden: ${exempted.join(' ')}`)
console.log(bad
  ? `\n✗ contradictions: ${bad} finding(s) — prose or code disagrees with src/proof`
  : `\n✓ contradictions: none — ${C.byDecide} theorems (closed by exhaustion) + ${C.rfl} rfl declarations = ${C.theorems} kernel-accepted; ${C.liveKeys} live keys = ${C.sealedTheorems} sealed + ${C.surplusKeys} keyed twice + ${C.unresolvableKeys} unresolvable; no sorry, no Mathlib, no native_decide, no axiom; nothing claims a Clay problem, all ${swept} Clay + ${qSwept} quantum overclaim phrasings are caught while ${HONEST.length} honest refusals survive; and ${PROVED.length} proved properties are stated on the pages, not only in the sources`)
process.exit(bad ? 1 : 0)
