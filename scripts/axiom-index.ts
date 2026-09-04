#!/usr/bin/env node
// THE AXIOM INDEX — what this deposit does not assume, proved; and what it does assume, listed.
//
// "Axiom-free" is measured on every build: scripts/lean.ts appends `#print axioms` to each declaration and
// fails the build on any dependency. It is a real property and it is checked. What it is NOT is
// assumption-free, and a research record that reports the first without the second is incomplete in a way
// that flatters it. Every theorem rests on definitions, and each definition is a choice someone made.
//
// So this index has two halves, and the second is the longer one:
//
//   THE AXIOMS NOT USED — Lean 4's three, named, with what each would buy and what stands in its place
//     here. Verified against a NEGATIVE CONTROL that carries all three, because "no axioms found" reads
//     identically whether the check works or is pointed at nothing.
//
//   THE DEFINITIONS USED — every `def` and `abbrev` in src/proof, with its body. These are the primitives.
//     A theorem about `fall` is a theorem about the digital root only because `fall` is defined to be it;
//     read the definition or the theorem means nothing. That is the honest base of the research.
import { writeFileSync, readFileSync, readdirSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { leanTheorems, leanFiles, leanSource } from '../src/api/index.ts'

const CONTROL = 'src/proof/fixtures/axiom-control.lean'
const TOOLCHAIN = (() => {
  for (const c of ['src/proof/lean-toolchain', 'lean-toolchain'])
    if (existsSync(c)) return readFileSync(c, 'utf8').trim()
  return '(unknown)'
})()
const EXPECT_FREE = "'axiom_free_by_decision' does not depend on any axioms"
const EXPECT_ALL3 = "'needs_all_three' depends on axioms: [propext, Classical.choice, Quot.sound]"

/** Lean 4's axiom base. Three, and no more — this is the whole of what a Lean proof can assume. */
const AXIOMS = [
  { name: 'propext', buys: 'propositional extensionality — two propositions that imply each other are EQUAL, '
    + 'so one can be rewritten as the other',
    instead: 'nothing here rewrites a proposition into another. A statement is evaluated on its own terms over '
    + 'a finite domain, and equality of propositions never has to be asserted because no proposition is ever '
    + 'substituted for another.' },
  { name: 'Classical.choice', buys: 'the axiom of choice, and with it excluded middle — every proposition is '
    + 'true or false whether or not anything can decide which',
    instead: 'DECIDABILITY, which is the strictly stronger thing over a finite domain: not "p or not p" as a '
    + 'principle, but the kernel walking every case and reporting which. `by decide` needs no oracle because '
    + 'it does the work. This is the exact trade the deposit is built on, and it is why every domain here is '
    + 'finite: an infinite domain cannot be exhausted, so it would need the axiom back.' },
  { name: 'Quot.sound', buys: 'quotient soundness — elements related by an equivalence become equal in the quotient',
    instead: 'no quotient is formed. Where a quotient would be natural — ℤ/9 — the deposit works with the '
    + 'representatives 0..8 and `% 9` directly, so the ring is a computation on Nat rather than a quotient type. '
    + 'Concretely: `fall`, `refl` and the residue maps are functions on Nat that the kernel evaluates.' },
]

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

// ── the control, run before the report is believed ───────────────────────────────────────────────────────
// The pins in the fixture are `#guard_msgs`-guarded, so Lean CONSUMES the info line when they match and
// raises a mismatch error when they do not. The check is therefore "does the fixture elaborate", not
// "does it print what I expected" — my first version searched for the printed text and failed the moment
// the pin started working, which is a good reminder that a check must be re-read after the thing it
// checks changes shape.
//
// Compiling proves the footprints are exactly as pinned. Reading the source proves the pins still SAY the
// right thing: a fixture whose assertions were deleted or weakened would compile just as quietly.
let control = ''
let compiles = true
try { execSync('lake env lean axiom-control.lean', { cwd: 'src/proof/fixtures', encoding: 'utf8' }) }
catch (e) { compiles = false; control = String((e as { stdout?: string }).stdout ?? (e as Error).message) }
const fixture = existsSync(CONTROL) ? readFileSync(CONTROL, 'utf8') : ''
const pinnedFree = fixture.includes(`/-- info: ${EXPECT_FREE} -/`)
const pinnedAll3 = fixture.includes(`/-- info: ${EXPECT_ALL3} -/`)
const guards = (fixture.match(/#guard_msgs in/g) ?? []).length
if (!compiles) fail(`the negative control does not elaborate — a pinned axiom footprint no longer matches, so `
  + `"no theorem depends on an axiom" cannot be relied on until this is understood:\n      ${control.trim().split('\n').slice(0, 4).join('\n      ')}`)
if (!pinnedFree) fail(`${CONTROL} no longer pins the axiom-free footprint`)
if (!pinnedAll3) fail(`${CONTROL} no longer pins the all-three footprint — the control cannot show the check distinguishes`)
if (guards < 2) fail(`${CONTROL} has ${guards} \`#guard_msgs\` guard(s); both footprints must be pinned or the fixture only compiles, it does not assert`)
const controlOk = compiles && pinnedFree && pinnedAll3 && guards >= 2

// ── every declaration in the tree, and every definition under them ───────────────────────────────────────
const T = leanTheorems()
type Def = { file: string; kind: string; name: string; body: string }
const defs: Def[] = []
for (const f of leanFiles()) {
  const src = leanSource(f)
  for (const m of src.matchAll(/^(def|abbrev)\s+(\w+)([^\n]*)$/gm))
    defs.push({ file: f, kind: m[1], name: m[2], body: (m[3] ?? '').trim() })
}
for (const f of leanFiles())
  if (/^axiom\s+/m.test(leanSource(f))) fail(`src/proof/${f} declares an axiom of its own`)

// ── the page ─────────────────────────────────────────────────────────────────────────────────────────────
const n = (x: number) => x.toLocaleString('en-US')
let o = `---\ntitle: The axiom index — what is not assumed, and what is\n---\n\n`
o += `# The axiom index\n\n`
o += `Every declaration in \`src/proof\` is checked with \`#print axioms\` on each build, and a dependency on any\n`
o += `axiom fails the build rather than earning a footnote. All **${n(T.length)}** report the same thing:\n`
o += `*does not depend on any axioms*.\n\n`
o += `That is a real property, and it is not the whole picture. **Axiom-free is not assumption-free.** These\n`
o += `theorems rest on **${n(defs.length)}** definitions, and every one of them is a choice. A theorem about\n`
o += `\`fall\` is a theorem about the digital root only because \`fall\` is *defined* to be it. Both halves are\n`
o += `indexed below, and the second is the longer one.\n\n`

o += `## The check can tell the difference\n\n`
o += `"No theorem depends on an axiom" reads identically whether the check works or is pointed at nothing, so\n`
o += `a negative control is kept at [\`${CONTROL}\`](https://github.com/ceccec/millennium-solutions/blob/main/${CONTROL})\n`
o += `and run by this page's generator. It holds two theorems about the same kind of fact — one decided, one\n`
o += `obtained classically — and Lean reports:\n\n`
o += '```\n' + EXPECT_FREE + '\n' + EXPECT_ALL3 + '\n```\n\n'
o += `One appeal to excluded middle costs all three axioms. That contrast is the reason the arithmetic here is\n`
o += `decided rather than argued, and it is measured on every run rather than asserted once.\n\n`

o += `## The three axioms of Lean 4, and what stands in each one's place\n\n`
for (const a of AXIOMS) {
  o += `### \`${a.name}\`\n\n**What it buys.** ${a.buys}.\n\n**What is here instead.** ${a.instead}\n\n`
}
o += `There is no fourth. Lean 4's axiom base is exactly these three, so an index of them is complete rather\n`
o += `than a selection — and "depends on no axioms" means depends on none of these three, which is the whole\n`
o += `of what could have been depended on.\n\n`

o += `## What this check cannot see, and why it does not bite here\n\n`
o += `\`#print axioms\` had a known gap: \`Lean.collectAxioms\` did not collect axioms referenced *by other\n`
o += `axioms' types*, so a declaration could report a shorter list than it truly depended on — the reported\n`
o += `example is a \`native_decide\` proof showing \`[Lean.ofReduceBool]\` while missing \`[Lean.trustCompiler]\`\n`
o += `([leanprover/lean4#8840](https://github.com/leanprover/lean4/issues/8840), fixed by\n`
o += `[#8842](https://github.com/leanprover/lean4/pull/8842), merged 8 July 2025).\n\n`
o += `**This tree is pinned to \`${TOOLCHAIN}\`, which predates that fix.** Stating it plainly rather than\n`
o += `leaving it out: the tool this deposit's central claim rests on had a bug, and the toolchain here is on\n`
o += `the wrong side of it.\n\n`
o += `It cannot hide anything here, and the reason is structural rather than lucky. The gap is about axioms\n`
o += `referenced by OTHER AXIOMS. This tree declares no axioms of its own — checked — and forbids\n`
o += `\`native_decide\`, which is the one route in the reported example by which a stock axiom acquires a\n`
o += `dependency of its own. With zero axioms anywhere in the picture there is no transitive edge to miss.\n`
o += `That argument would collapse the moment a single \`axiom\` or one \`native_decide\` entered the tree, which\n`
o += `is why both are build failures and not conventions.\n\n`

o += `## Prior art, and the practice this follows\n\n`
o += `Auditing a Lean library's axiom footprint is established practice and this deposit did not invent it.\n`
o += `[\`leanprover-community/axiom-audit\`](https://github.com/leanprover-community/axiom-audit) does exactly\n`
o += `what \`scripts/lean.ts\` does — fails CI when a declaration transitively depends on an axiom outside an\n`
o += `allowlist, catching \`sorry\` (as \`sorryAx\`), \`native_decide\` (as \`Lean.ofReduceBool\`) and home-rolled\n`
o += `axioms — with the same default allowlist of the three above. Its documentation credits Robin Arnez for a\n`
o += `Mathlib-wide collection and Kim Morrison for an earlier library audit.\n\n`
o += `One thing it does better, recorded here as a lead rather than a claim: it inspects the **kernel\n`
o += `environment** from compiled \`.olean\` files instead of parsing source, which catches what a text search\n`
o += `misses. This deposit's per-theorem check is a real \`#print axioms\` elaboration and so is sound, but its\n`
o += `"declares no axiom of its own" test is a source-text match, and that is the weaker method by exactly the\n`
o += `margin that tool names.\n\n`
o += `The pins in the control fixture follow the community practice of guarding \`#print axioms\` with\n`
o += `\`#guard_msgs\`, which turns the axiom footprint into an executable regression test: the assertion is\n`
o += `checked by the elaborator, and drift fails the build with a mismatch instead of passing unnoticed.\n\n`

o += `## What IS assumed: the ${n(defs.length)} definitions\n\n`
o += `Each of these is a primitive of this deposit — not derived, not proved, chosen. They are listed in full\n`
o += `because a reader checking a theorem must be able to read the definition it is about, and because a\n`
o += `deposit that reports its axiom count and hides its definition count is reporting the flattering half.\n\n`
const byFile = new Map<string, Def[]>()
for (const d of defs) byFile.set(d.file, [...(byFile.get(d.file) ?? []), d])
for (const [file, ds] of [...byFile].sort()) {
  const uses = T.filter((t) => t.file === file).length
  o += `### \`${file}\` — ${ds.length} definition(s), ${uses} theorem(s)\n\n`
  o += '```lean\n' + ds.map((d) => `${d.kind} ${d.name}${d.body ? ' ' + d.body : ''}`).join('\n') + '\n```\n\n'
}
o += `---\n\n**${n(T.length)}** declarations, **0** axiom dependencies, **${n(defs.length)}** definitions they rest on.\n`
o += `A content-address proves integrity, not truth, and an axiom index proves neither: it states what was\n`
o += `assumed, so a reader can disagree with the assumptions rather than guess at them. \`0/7\`.\n`

writeFileSync('AXIOMS.md', o)
console.log(bad
  ? `\n✗ axiom-index: ${bad} finding(s)`
  : `\n✓ axiom-index: ${n(T.length)} declarations depend on 0 of Lean's 3 axioms — verified against a control that `
    + `carries all three — and rest on ${n(defs.length)} definitions, every one listed → AXIOMS.md`)
process.exit(bad ? 1 : 0)
