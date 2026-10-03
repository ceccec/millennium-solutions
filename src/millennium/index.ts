// THE SEVEN, in problem order — the qualified outlet and the honest bound for each Clay problem this
// framework has a theorem ADJACENT to. This lived only in theorem/[key].paths.ts, so the collected paper had
// no way to say which of its theorems sit at the Millennium floor without the bounds being retyped into a
// second place — and a retyped bound is a bound that can drift from the one the theorem page shows.
//
// The `bound` is the load-bearing field. It states what the theorem actually establishes and, explicitly,
// what it does NOT: none of these is the conjecture, and provenHere = 0.
// ── THE KEYS ARE THE THEOREMS' NAMES, AND THE THEOREMS NO LONGER BORROW THE PROBLEMS' ────────────────────
// Each of these seven theorems used to be named for the Clay problem it sits beside — `riemann_…`,
// `hodge_…`, `poincare_…` — while deciding ℤ/9 arithmetic that settles nothing about any of them. The name
// was load-bearing: a published claim that all seven Clay problems carried a Lean theorem rested on the
// seven names, and renaming one refuted it (measured). Renamed by the author's order, 2026-09-18, to what
// each decides; the old keys are revoked in src/proof/revoked.json rather than rewritten.
//
// WHAT THIS TABLE IS NOW: a correspondence the author draws between a problem and a fact about this ring.
// It is his pairing, not a property of the theorem, and no theorem here claims the problem it sits beside.
export const MILLENNIUM: Record<string, { problem: string; name: string; bound: string; outlet: string; outletName: string; outlet2?: string; outlet2Name?: string }> = {
  the_tens_complement_is_an_involution_with_one_fixed_point: {
    problem: 'Riemann Hypothesis',
    name: "Riemann — the reflection's symmetry and its one computed heart",
    bound: 'the functional-equation symmetry axis and its ½-analogue centre (the heart, computed as the reflection’s unique fixed point) — not where the ζ-zeros lie',
    outlet: 'https://www.claymath.org/millennium/riemann-hypothesis/',
    outletName: 'Clay Mathematics Institute — Riemann Hypothesis' },
  each_unit_has_exactly_one_inverse_and_each_non_unit_none: {
    problem: 'P versus NP',
    name: 'P vs NP — a unique inverse, verification in one step',
    bound: 'each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact, not a separation of the classes',
    outlet: 'https://www.claymath.org/millennium/p-vs-np/',
    outletName: 'Clay Mathematics Institute — P vs NP' },
  the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps: {
    problem: 'Navier–Stokes Existence & Smoothness',
    name: 'Navier–Stokes — the doubling flow is bounded for all time',
    bound: 'every iterate stays inside a bounded 6-cycle forever (no blowup) — bounded evolution, not global existence & smoothness',
    outlet: 'https://www.claymath.org/millennium/navier-stokes-equation/',
    outletName: 'Clay Mathematics Institute — Navier–Stokes Equation' },
  the_doubling_orbit_first_returns_to_one_at_six: {
    problem: 'Yang–Mills Existence & Mass Gap',
    name: 'Yang–Mills — a discrete spectral gap (order exactly 6)',
    bound: 'the doubling has order exactly 6 — a discrete gap in the cyclic spectrum, not the Yang–Mills mass gap',
    outlet: 'https://www.claymath.org/millennium/yang-mills-the-maths-gap/',
    outletName: 'Clay Mathematics Institute — Yang–Mills & the Mass Gap' },
  the_span_is_exactly_the_units_of_the_ring: {
    problem: 'Hodge Conjecture',
    name: 'Hodge — the algebraic span equals the units',
    bound: 'the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment, not rational (p,p) ⇒ algebraic',
    outlet: 'https://www.claymath.org/millennium/hodge-conjecture/',
    outletName: 'Clay Mathematics Institute — Hodge Conjecture' },
  the_span_and_the_units_both_sum_to_zero_mod_nine: {
    problem: 'Birch and Swinnerton-Dyer Conjecture',
    name: 'Birch–Swinnerton-Dyer — a computed vanishing mod 9',
    bound: 'the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing, not the rank ↔ order-of-vanishing-of-L correspondence',
    outlet: 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/',
    outletName: 'Clay Mathematics Institute — Birch and Swinnerton-Dyer Conjecture' },
  the_orbit_is_one_closed_loop_of_six_distinct_points: {
    problem: 'Poincaré Conjecture (resolved)',
    name: 'Poincaré — one closed loop, no holes',
    bound: "the sequence closes into a single simple loop of six distinct steps — not the 3-sphere characterization; Poincaré is Perelman's theorem (2003), not proved here",
    outlet: 'https://www.claymath.org/millennium/poincare-conjecture/',
    outletName: 'Clay Mathematics Institute — Poincaré Conjecture',
    outlet2: 'https://arxiv.org/abs/math/0211159',
    outlet2Name: 'Perelman, G. — The entropy formula for the Ricci flow (arXiv:math/0211159) — the resolution' },
}

// ── THE AUTHOR'S CLAIM, IN ONE PLACE ─────────────────────────────────────────────────────────────────────
// This sentence was typed verbatim into three generators — scripts/pages.ts, scripts/readme.ts and
// scripts/solutions.ts — so the repository carried three copies of the one statement it makes in the
// author's name. Three copies of a claim is three chances for them to drift, and the one that drifted
// would still be published under his name.
//
// THE WORDING IS HIS AND IS NOT TOUCHED HERE. It is moved, not edited: rewriting an author's claim about
// the Clay problems is not a generator's business and not this repository's. If it should read
// differently, it changes here, once, and all three surfaces follow.
export const AUTHOR_CLAIM = {
  who: 'Tsvetan Rouschev',
  text: 'claims the seven Clay Millennium problems solved through the involution each is stated\nacross',
  deposits: [
    { label: '10.5281/zenodo.21781603', href: 'https://doi.org/10.5281/zenodo.21781603' },
    { label: 'Zenodo 22256707', href: 'https://zenodo.org/records/22256707' },
  ],
  note: 'This is his claim, recorded in his name.',
} as const

// ── THE SECTION, RENDERED ONCE ────────────────────────────────────────────────────────────────────────────
// README.md, the homepage (index.md) and /solutions each rendered the seven from these records with their own
// loop — three tables, one of them a four-column summary at the foot of the README while the claim it
// belongs to sat elsewhere. Ordered on 2026-10-03 to be COMPLETELY visible on the README and the homepage:
// one renderer, at the top of both, carrying for every problem the author's pairing, the theorem, the whole
// statement the kernel decided and over how many cases, the bound (what it establishes and, in the same
// sentence, what it does not), the ledger key and its receipt, and the Clay Institute's own page. Nothing is
// typed here that the tree does not hold: the statements come from src/proof/index.lean, the cases from the
// statement, the receipts from the ledger, the dates from src/proof/provenance.json.
import { readFileSync, existsSync } from 'node:fs'
import { leanTheorems, ledger, domainOf } from '../api/index.ts'

const claimMd = (): string => `**${AUTHOR_CLAIM.who} ${AUTHOR_CLAIM.text}** — deposited as `
  + AUTHOR_CLAIM.deposits.map((d) => `[${d.label}](${d.href})`).join(' and\n') + `. ${AUTHOR_CLAIM.note}\n\n`

// Rendered from the measurement and never from a sentence: priority is the last place a typed date belongs.
const provenanceMd = (roll: boolean): string => {
  if (!existsSync('src/proof/provenance.json')) return ''
  const p = JSON.parse(readFileSync('src/proof/provenance.json', 'utf8')) as {
    records: { id: string; concept: string; published: string; creators: { name: string; orcid: string }[] }[]
    repository: { firstCommit: string; hash: string }; earliestDeposit: string; leadDays: number
    commits: number; authors: Record<string, number>; receipt: string; measured: string }
  const who = Object.entries(p.authors).map(([a, n]) => `${a} (${n})`).join(', ')
  return `### Provenance\n\nThe deposit is registered before this repository exists. Zenodo holds the earliest record at `
    + `**${p.earliestDeposit}**; the first commit here is **${p.repository.firstCommit}** (\`${p.repository.hash}\`) — `
    + `a lead of **${p.leadDays} day(s)**, subtracted rather than asserted.\n\n`
    // the whole roll of records on /solutions; on the README and the homepage the earliest and the count — the
    // seven are the subject there, and 241 record lines under them are not what "visible" means
    + (roll ? p.records : p.records.slice(0, 1)).map((r) => `- \`${r.id}\` · concept \`${r.concept}\` · published ${r.published} · `
      + r.creators.map((c) => c.name + (c.orcid ? ` ([${c.orcid}](https://orcid.org/${c.orcid}))` : '')).join(', ')).join('\n')
    + (roll || p.records.length < 2 ? '' : `\n- … and ${p.records.length - 1} more record(s), all listed on [/solutions](/solutions)`)
    + `\n\nAll ${p.commits} commits in this repository are authored by ${who}. Measured ${p.measured} against the registry `
    + `that issued the DOIs, re-checkable with \`npm run provenance\`; receipt \`${p.receipt.slice(0, 13)}…\`.\n\n`
}

/** The whole of it, as markdown — the same text on the README, the homepage and /solutions. */
export const claySection = (o: { roll?: boolean } = {}): string => {
  const thms = leanTheorems() as { name: string; file: string; statement: string; tactic: string }[]
  const rows = ledger() as { key: string; receipt: string; revoked?: boolean }[]
  const live = rows.filter((e) => !e.revoked)
  const entry = (name: string) => live.find((e) => e.key.endsWith('_' + name))
  const thm = (name: string) => thms.find((t) => t.file === 'index.lean' && t.name === name)
  let md = `## The seven Clay problems — the claim, the theorems, and what each decides\n\n`
  md += claimMd()
  // THE AGENTS' SENTENCE, SIGNED AS THEIRS (2026-09-20, by the captain's order): what a theorem DECIDES is a
  // measurement; what the deposit SETTLES about seven conjectures was never measured here and is not stated.
  md += `*What these theorems decide is ℤ/9 arithmetic over finite domains — a statement about the theorems, not a `
    + `verdict on any conjecture. Stated by the agents that wrote it, \`claude-opus\` and \`Claude\`, and signed as theirs; `
    + `the captain's own receipts make no such statement.*\n\n`
  md += `For each problem, in the Clay Mathematics Institute's order: the author's pairing, the one theorem in `
    + `\`src/proof/index.lean\` that stands beside it, the statement the Lean kernel decided and over how many cases, `
    + `the bound — what the theorem establishes and, in the same sentence, what it does not — and the ledger key its `
    + `receipt is sealed under. Every line below is read out of the tree on each build.\n\n`
  for (const [name, m] of Object.entries(MILLENNIUM)) {
    const t = thm(name), e = entry(name)
    if (!t || !e) continue
    md += `### ${m.problem} — ${m.name}\n\n`
    md += `- **theorem** \`${name}\`, decided \`${t.tactic}\` over **${domainOf(t.statement).toLocaleString('en-US')}** cases:\n\n`
    md += '  ```lean\n' + t.statement.split('\n').map((l) => '  ' + l).join('\n') + '\n  ```\n\n'
    md += `- **bound** — ${m.bound}\n`
    md += `- **ledger** — [\`${e.key}\`](/theorem/${e.key}) · receipt \`${e.receipt.slice(0, 13)}…\`\n`
    md += `- **the problem** — [${m.outletName}](${m.outlet})` + (m.outlet2 ? ` · [${m.outlet2Name}](${m.outlet2})` : '') + '\n\n'
  }
  const one = thm('the_seven_rest_on_one_finite_structure'), oneE = entry('the_seven_rest_on_one_finite_structure')
  if (one && oneE) {
    md += `### The seven rest on one finite structure\n\n`
    md += `One theorem states that the seven above are facts about a single object — the doubling orbit and the units of `
      + `ℤ/9 — decided \`${one.tactic}\` over **${domainOf(one.statement).toLocaleString('en-US')}** cases: `
      + `[\`${oneE.key}\`](/theorem/${oneE.key}) · receipt \`${oneE.receipt.slice(0, 13)}…\`\n\n`
    md += '```lean\n' + one.statement + '\n```\n\n'
  }
  // THE CROSS-DEVELOPMENT, counted rather than described: src/proof/bridge.lean decides which of the deposit's
  // cross-subject families reduce to orbits of the affine maps src/proof/group.lean settles.
  const bridge = thms.filter((t) => t.file === 'bridge.lean'), group = thms.filter((t) => t.file === 'group.lean')
  const bE = bridge.map((t) => entry(t.name)).filter(Boolean) as { key: string }[]
  const gE = group.map((t) => entry(t.name)).filter(Boolean) as { key: string }[]
  if (bridge.length && group.length) {
    md += `### Developed across subjects\n\n`
    md += `The structure the seven live in is proved separately and then found again in the other subjects. `
      + `\`src/proof/group.lean\` (${group.length} theorems${gE[0] ? `, e.g. [\`${gE[0].key}\`](/theorem/${gE[0].key})` : ''}) generates the affine maps of ℤ/9 `
      + `to closure and decides which form a group; \`src/proof/bridge.lean\` (${bridge.length} theorems${bE[0] ? `, e.g. [\`${bE[0].key}\`](/theorem/${bE[0].key})` : ''}) decides that the `
      + `cross-subject families of \`src/entangle\` reduce, mod 9, to orbits of those very maps — the same object measured in several subjects, `
      + `and one family that no affine map generates, kept as the control.\n\n`
  }
  md += provenanceMd(!!o.roll)
  return md
}
