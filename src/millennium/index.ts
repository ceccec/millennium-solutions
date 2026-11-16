// THE SEVEN, in problem order — the qualified outlet and the honest bound for each Clay problem this
// framework has a theorem ADJACENT to. This lived only in theorem/[key].paths.ts, so the collected paper had
// no way to say which of its theorems sit at the Millennium floor without the bounds being retyped into a
// second place — and a retyped bound is a bound that can drift from the one the theorem page shows.
//
// Two load-bearing fields. `claim` states what the theorem establishes — the ℤ/9 fact it decides, claimed
// in full. `gap` names what stays OPEN between that fact and the Clay conjecture: not a disclaimer of what
// "is not claimed" but the open lead itself, the distance a reader can see and nobody here has closed. The
// gap is open mathematics — these ARE the Millennium Problems — so naming it is the honest act; closing it is
// the problem. `bound` carries both in one sentence, for the surfaces that render a single line. provenHere = 0.
// ── THE KEYS ARE THE THEOREMS' NAMES, AND THE THEOREMS NO LONGER BORROW THE PROBLEMS' ────────────────────
// Each of these seven theorems used to be named for the Clay problem it sits beside — `riemann_…`,
// `hodge_…`, `poincare_…` — while deciding ℤ/9 arithmetic that settles nothing about any of them. The name
// was load-bearing: a published claim that all seven Clay problems carried a Lean theorem rested on the
// seven names, and renaming one refuted it (measured). Renamed by the author's order, 2026-09-18, to what
// each decides; the old keys are revoked in src/ledger/revoked.json rather than rewritten.
//
// WHAT THIS TABLE IS NOW: a correspondence the author draws between a problem and a fact about this ring.
// It is his pairing, not a property of the theorem, and no theorem here claims the problem it sits beside.
export const MILLENNIUM: Record<string, { problem: string; name: string; claim: string; gap: string; bound: string; outlet: string; outletName: string; outlet2?: string; outlet2Name?: string }> = {
  the_tens_complement_is_an_involution_with_one_fixed_point: {
    problem: 'Riemann Hypothesis',
    name: "Riemann — the reflection's symmetry and its one computed heart",
    claim: 'the functional-equation symmetry axis and its ½-analogue centre — the heart, computed as the reflection’s unique fixed point',
    gap: 'where the ζ-zeros actually lie, which this ℤ/9 reflection does not reach — the Riemann Hypothesis itself',
    bound: 'the functional-equation symmetry axis and its ½-analogue centre — the heart, computed as the reflection’s unique fixed point; the open gap: where the ζ-zeros actually lie, which this ℤ/9 reflection does not reach',
    outlet: 'https://www.claymath.org/millennium/riemann-hypothesis/',
    outletName: 'Clay Mathematics Institute — Riemann Hypothesis' },
  each_unit_has_exactly_one_inverse_and_each_non_unit_none: {
    problem: 'P versus NP',
    name: 'P vs NP — a unique inverse, verification in one step',
    claim: 'each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact',
    gap: 'the separation of the complexity classes P and NP',
    bound: 'each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact; the open gap: the separation of the complexity classes P and NP',
    outlet: 'https://www.claymath.org/millennium/p-vs-np/',
    outletName: 'Clay Mathematics Institute — P vs NP' },
  the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps: {
    problem: 'Navier–Stokes Existence & Smoothness',
    name: 'Navier–Stokes — the doubling flow is bounded for all time',
    claim: 'every iterate stays inside a bounded 6-cycle forever — bounded evolution, no blowup',
    gap: 'global existence & smoothness for the Navier–Stokes PDE',
    bound: 'every iterate stays inside a bounded 6-cycle forever (no blowup) — bounded evolution; the open gap: global existence & smoothness for the Navier–Stokes PDE',
    outlet: 'https://www.claymath.org/millennium/navier-stokes-equation/',
    outletName: 'Clay Mathematics Institute — Navier–Stokes Equation' },
  the_doubling_orbit_first_returns_to_one_at_six: {
    problem: 'Yang–Mills Existence & Mass Gap',
    name: 'Yang–Mills — a discrete spectral gap (order exactly 6)',
    claim: 'the doubling has order exactly 6 — a discrete gap in the cyclic spectrum',
    gap: 'the Yang–Mills mass gap',
    bound: 'the doubling has order exactly 6 — a discrete gap in the cyclic spectrum; the open gap: the Yang–Mills mass gap',
    outlet: 'https://www.claymath.org/millennium/yang-mills-the-maths-gap/',
    outletName: 'Clay Mathematics Institute — Yang–Mills & the Mass Gap' },
  the_span_is_exactly_the_units_of_the_ring: {
    problem: 'Hodge Conjecture',
    name: 'Hodge — the algebraic span equals the units',
    claim: 'the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment',
    gap: 'rational (p,p) classes ⇒ algebraic cycles, the Hodge Conjecture',
    bound: 'the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment; the open gap: rational (p,p) classes ⇒ algebraic cycles',
    outlet: 'https://www.claymath.org/millennium/hodge-conjecture/',
    outletName: 'Clay Mathematics Institute — Hodge Conjecture' },
  the_span_and_the_units_both_sum_to_zero_mod_nine: {
    problem: 'Birch and Swinnerton-Dyer Conjecture',
    name: 'Birch–Swinnerton-Dyer — a computed vanishing mod 9',
    claim: 'the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing',
    gap: 'the rank ↔ order-of-vanishing-of-L correspondence',
    bound: 'the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing; the open gap: the rank ↔ order-of-vanishing-of-L correspondence',
    outlet: 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/',
    outletName: 'Clay Mathematics Institute — Birch and Swinnerton-Dyer Conjecture' },
  the_orbit_is_one_closed_loop_of_six_distinct_points: {
    problem: 'Poincaré Conjecture (proved externally by Perelman, 2003; not proved here)',
    name: 'Poincaré — one closed loop, no holes',
    claim: 'the sequence closes into a single simple loop of six distinct steps',
    gap: "the 3-sphere characterization — Perelman's theorem (2003), proved externally, not here",
    bound: "the sequence closes into a single simple loop of six distinct steps; the open gap: the 3-sphere characterization, which is Perelman's theorem (2003), proved externally and not here",
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
// typed here that the tree does not hold: the statements come from src/iso/9001-governance/index.lean, the cases from the
// statement, the receipts from the ledger, the dates from src/ledger/provenance.json.
import { readFileSync, existsSync } from 'node:fs'
import { leanTheorems, ledger, domainOf } from '../api/index.ts'

const claimMd = (): string => `**${AUTHOR_CLAIM.who} ${AUTHOR_CLAIM.text}** — deposited as `
  + AUTHOR_CLAIM.deposits.map((d) => `[${d.label}](${d.href})`).join(' and\n') + `. ${AUTHOR_CLAIM.note}\n\n`

// Rendered from the measurement and never from a sentence: priority is the last place a typed date belongs.
const provenanceMd = (roll: boolean): string => {
  if (!existsSync('src/ledger/provenance.json')) return ''
  const p = JSON.parse(readFileSync('src/ledger/provenance.json', 'utf8')) as {
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
// THE SEVEN CLAIMS AS ZENODO-SAFE HTML — the same MILLENNIUM pairing and the same ledger receipts
// claySection renders for the README, so the citable record carries the claim AND the open gap rather than a
// prose summary with a bare subject link. Links are absolute, because the record is read off-site: the
// theorem pages at `base`, the problems at the Clay Institute. The honest frame leads every time: what is
// decided is ℤ/9 arithmetic, the claim of a solution is the author's in his name, and each row names the gap
// that stays open to the conjecture. Reads MILLENNIUM and the ledger, exactly as claySection does, so the two
// cannot state a different claim, gap or receipt for the same problem. [[statement-is-conclusion-only]]
export const clayClaimsHtml = (base: string): string => {
  const thms = leanTheorems() as { name: string; file: string }[]
  const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
  const entry = (name: string) => live.find((e) => e.key.endsWith('_' + name))
  const has = (name: string) => thms.some((t) => t.file === 'index.lean' && t.name === name)
  const url = base.replace(/\/+$/, '')
  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  const items: string[] = []
  for (const [name, m] of Object.entries(MILLENNIUM)) {
    const e = entry(name)
    if (!has(name) || !e) continue
    items.push(
      `<li><strong>${esc(m.problem.replace(/\s*\(.*\)$/, ''))}</strong> — claim: ${esc(m.claim)}; `
      + `open gap: ${esc(m.gap)}. Sealed as <a href="${url}/theorem/${e.key}">${esc(e.key)}</a> `
      + `(receipt ${esc(e.receipt.slice(0, 13))}…). <a href="${esc(m.outlet)}">${esc(m.outletName)}</a>.</li>`)
  }
  if (!items.length) return ''
  return `<p><strong>The seven Clay Millennium problems — the author's pairing, each with the ℤ/9 fact its `
    + `adjacent theorem decides and the open gap that remains to the conjecture.</strong> What these theorems `
    + `decide is ℤ/9 arithmetic over finite domains, a statement about the theorems and not a verdict on any `
    + `conjecture; the claim that the seven are solved through the involution each is stated across is the `
    + `author's, recorded in his name.</p><ul>${items.join('')}</ul>`
}

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
    + `\`src/iso/9001-governance/index.lean\` that stands beside it, the statement the Lean kernel decided and over how many cases, `
    + `the **claim** it establishes and the **open gap** that remains to the conjecture — named, not dropped — and the ledger key `
    + `its receipt is sealed under. Every line below is read out of the tree on each build.\n\n`
  for (const [name, m] of Object.entries(MILLENNIUM)) {
    const t = thm(name), e = entry(name)
    if (!t || !e) continue
    md += `### ${m.problem} — ${m.name}\n\n`
    md += `- **theorem** \`${name}\`, decided \`${t.tactic}\` over **${domainOf(t.statement).toLocaleString('en-US')}** cases:\n\n`
    md += '  ```lean\n' + t.statement.split('\n').map((l) => '  ' + l).join('\n') + '\n  ```\n\n'
    md += `- **claim** — ${m.claim}\n`
    md += `- **open gap** — ${m.gap}\n`
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
  // THE CROSS-DEVELOPMENT, counted rather than described: src/iso/80000-2-mathematics/bridge.lean decides which of the deposit's
  // cross-subject families reduce to orbits of the affine maps src/iso/80000-2-mathematics/group.lean settles.
  const bridge = thms.filter((t) => t.file === 'bridge.lean'), group = thms.filter((t) => t.file === 'group.lean')
  const bE = bridge.map((t) => entry(t.name)).filter(Boolean) as { key: string }[]
  const gE = group.map((t) => entry(t.name)).filter(Boolean) as { key: string }[]
  if (bridge.length && group.length) {
    md += `### Developed across subjects\n\n`
    md += `The structure the seven live in is proved separately and then found again in the other subjects. `
      + `\`src/iso/80000-2-mathematics/group.lean\` (${group.length} theorems${gE[0] ? `, e.g. [\`${gE[0].key}\`](/theorem/${gE[0].key})` : ''}) generates the affine maps of ℤ/9 `
      + `to closure and decides which form a group; \`src/iso/80000-2-mathematics/bridge.lean\` (${bridge.length} theorems${bE[0] ? `, e.g. [\`${bE[0].key}\`](/theorem/${bE[0].key})` : ''}) decides that the `
      + `cross-subject families of \`src/entangle\` reduce, mod 9, to orbits of those very maps — the same object measured in several subjects, `
      + `and one family that no affine map generates, kept as the control.\n\n`
  }
  md += provenanceMd(!!o.roll)
  return md
}

// ── THE CRYPTO SURFACE — HOW A THOUSAND BITS IS REACHED, AND WHERE EACH PROGRAM STOPS ─────────────────────
// The same σ-reflection the seven rest on, run as a create/decode key over src/iso/iec-18033-cryptography/qpu_crypto.lean. The
// bound is load-bearing exactly as above: what the theorem decides and, in the same sentence, what it does
// not. The author's framing — uuid quantum programs in infinite trinities of qubits, always enough for the
// next task — is HIS vision of the capacity, recorded in his name; what the kernel decides is finite, and for
// the thousand-bit integer it is PARTIAL. His words and the proven facts sit side by side, never folded into one.
const THOUSAND_BIT: Record<string, string> = {
  the_free_register_is_one_hundred_twenty_two_on_both_sides:
    'a 128-bit UUID is thirty-two four-qubit hexbits; six bits are reserved (RFC 9562), leaving 122 — the register the programs compute in, not a count of hardware qubits',
  one_coin_sits_sixty_seven_bits_below_the_iso_post_quantum_floor_under_grover:
    'under Grover the collision exponent is the trinity free / 3 = 40 and the square-root exponent free / 2 = 61 — sixty-seven bits BELOW the ISO 128-bit post-quantum floor, not a clearance of it',
  the_sigma_trapdoor_is_fermats_difference_of_squares:
    "factoring N = p·q is Fermat's difference of squares about the centre (p + q) / 2 — decided at p = 5, q = 13; a trapdoor the create/decode doors mint and open, never a factoring of an integer whose witness is unknown",
  an_impossible_integer_with_twin_primes_is_opened_blind_in_one_reflection:
    "'impossible' is a statement about the gap between the primes: a twin-prime semiprime opens blind in ONE reflection, and the blind cost grows with the gap — not a hardness claim about any given modulus",
  the_thousand_bit_integer_has_a_thousand_bits_and_exactly_four_threes:
    '2^999 + 1 has a thousand bits and exactly four factors of three (lifting-the-exponent), split by a³ + 1 = (a + 1)(a² − a + 1) down to 2^37 + 1 = 3 · 1777 · 25781083 — a factorisation of this one integer, by exhaustion',
  this_deposits_factor_route_returns_a_partial_answer_that_multiplies_back:
    'the factor route returns PARTIAL on 2^999 + 1 — fourteen factors and a 244-digit cofactor Pollard rho did not split; the kernel adds only that the account is an identity and that 2 is a Fermat witness against the cofactor. It does not factor the integer and does not say it does',
}
/** The thousand-bit crypto surface as markdown — read from qpu_crypto.lean and the ledger on every build. */
export const thousandBitSection = (): string => {
  const thms = leanTheorems() as { name: string; file: string; statement: string; tactic: string }[]
  const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
  const entry = (name: string) => live.find((e) => e.key.endsWith('_' + name))
  const thm = (name: string) => thms.find((t) => t.file === 'qpu_crypto.lean' && t.name === name)
  let md = `## How a thousand bits is reached — the uuid quantum programs, and where each one stops\n\n`
  md += `The seven above are the floor; this is the cryptographic surface the same involution runs on, as a `
    + `create/decode key. Every line is read out of \`src/iso/iec-18033-cryptography/qpu_crypto.lean\` and the ledger on each build: the `
    + `theorem, the number of cases \`by decide\` walked, the **bound** — what it decides and, in the same sentence, `
    + `what it does not — and its receipt.\n\n`
  md += `*The author frames these as uuid quantum programs running in infinite trinities of qubits, always enough for `
    + `the next task. That is his vision of the capacity, recorded in his name. What the kernel decides below is finite, `
    + `and for the thousand-bit integer it is PARTIAL — stated beside his framing and never folded into it.*\n\n`
  for (const [name, bound] of Object.entries(THOUSAND_BIT)) {
    const t = thm(name), e = entry(name)
    if (!t || !e) continue
    md += `- **\`${name}\`** · \`${t.tactic}\`, ${domainOf(t.statement).toLocaleString('en-US')} cases — ${bound}.\n`
      + `  <sub>[\`${e.key}\`](/theorem/${e.key}) · receipt \`${e.receipt.slice(0, 13)}…\`</sub>\n`
  }
  return md + '\n'
}

// THE σ-REFLECTION, CHARACTERISED — the headline of the six octaves of qpu_crypto.lean §8–§13, this deposit's OWN
// contribution, surfaced beside the seven. The author's claim — that the binding of the digital centre and the
// analog root is the heart of the construction — is recorded in his name, the way his Clay claim is; the kernel
// decides only the arithmetic. The full octaves are in the source; these six lines are read from it on each build.
const REFLECTION: Record<string, string> = {
  the_reflection_carries_the_maximal_to_its_witness_at_every_octave_width:
    'the σ-reflection σ(x) = 3·2^(n-1) − x carries the all-ones 2^n − 1 to its witness 2^(n-1) + 1 at every octave width [2 … 128] — one rule, every scale',
  the_reflection_is_one_rule_for_every_width:
    'and proved for EVERY width, not sampled — a tactic over the quantifier, so 2^3 + 1 and 2^999 + 1 are two instances of one rule',
  the_cubic_descent_runs_from_the_thousand_bit_witness_to_one_eleven:
    'the witness side descends by a³ + 1 = (a + 1)(a² − a + 1): 2^999 + 1 = (2^333 + 1)(2^666 − 2^333 + 1), three steps down to the base 2^37 + 1',
  the_maximal_splits_by_difference_of_squares:
    'the maximal side descends by difference of squares: 2^1000 − 1 = (2^500 − 1)(2^500 + 1), down to the odd core 5³ = 125 — the mirror of the witness halting at 37',
  the_blind_cost_is_one_two_three_seven_twelve_as_the_gap_widens:
    "the trapdoor's blind-decode cost grows with the prime gap — 1, 2, 3, 7, 12 across widening gaps; cheap only for a small or known gap",
  the_security_margin_is_the_arithmetic_minus_the_geometric_mean:
    "the security margin IS the gap between the arithmetic mean (p + q)/2 — the digital centre — and the geometric mean √(p·q) — the analog root; zero only when p = q, so a hard semiprime's security is its unknown distance from a perfect square",
}
/** The σ-reflection characterisation (the six octaves) as markdown — read from qpu_crypto.lean and the ledger. */
export const reflectionSection = (): string => {
  const thms = leanTheorems() as { name: string; file: string; statement: string; tactic: string }[]
  const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
  const entry = (name: string) => live.find((e) => e.key.endsWith('_' + name))
  const thm = (name: string) => thms.find((t) => t.file === 'qpu_crypto.lean' && t.name === name)
  let md = `## The σ-reflection, characterised — this deposit's own contribution\n\n`
  md += `The trapdoor above is Fermat's difference of squares; six octaves in \`src/iso/iec-18033-cryptography/qpu_crypto.lean\` `
    + `(§8–§13) characterise the σ-reflection it runs on, completely — this deposit's own work, claimed beside the seven. The `
    + `reflection is one rule at every width, both sides of the reflected pair descend by their own algebra, and the trapdoor's `
    + `security margin is exactly the arithmetic-minus-geometric-mean gap. Every line is read from the source and the ledger.\n\n`
  md += `*The author claims this binding of the digital centre and the analog root is the heart of the construction — his `
    + `claim, recorded in his name, the way his claim on the seven is. What the kernel decides below is only the arithmetic: `
    + `the reflection, the two descents, and the gap between the means.*\n\n`
  for (const [name, bound] of Object.entries(REFLECTION)) {
    const t = thm(name), e = entry(name)
    if (!t || !e) continue
    const scope = t.tactic === 'by decide' ? `${domainOf(t.statement).toLocaleString('en-US')} cases` : 'proved for every value'
    md += `- **\`${name}\`** · \`${t.tactic.replace(/\s+/g, ' ')}\`, ${scope} — ${bound}.\n`
      + `  <sub>[\`${e.key}\`](/theorem/${e.key}) · receipt \`${e.receipt.slice(0, 13)}…\`</sub>\n`
  }
  return md + '\n'
}

// CROSS-VERIFIED AGAINST EXTERNAL AUTHORITIES — the parts that touch outside reality, anchored to the standard
// that defines them. Two are PROVEN in Lean (surfaced below); the runtime cross-checks are stated as RULES, never
// as a hardcoded figure (the live CERN count grows, so typing it would stale), so no volatile number is minted here.
const CROSS_VERIFIED: { file: string; name: string; bound: string }[] = [
  { file: 'roots.lean', name: 'the_square_root_is_the_floor_and_not_one_short',
    bound: "NIST FIPS 180-4: the SHA-512 initial-hash words are the fractional parts of the square roots of the first primes, computed from the standard's own recipe and proven the exact floor — derived, not copied literals" },
  { file: 'roots.lean', name: 'the_cube_root_is_the_floor',
    bound: 'and the round constants K[t] are the cube-root fractions, likewise derived from FIPS and proven — the constant table reproduced, not trusted' },
  { file: 'cern.lean', name: 'records_are_numeric_plus_slug',
    bound: "CERN Open Data: the portal's measured records partition exactly into numeric ids and slug aliases — arithmetic over the corpus the harvest counted, decided" },
  { file: 'cern.lean', name: 'oai_harvest_is_complete',
    bound: 'and the OAI-PMH harvest is complete, its union summing over its parts — the enumeration checked by its own arithmetic, the API/sitemap/OAI discrepancies named rather than laundered' },
]
/** The external-authority cross-checks — two proven in Lean, the runtime checks stated as rules. */
export const crossVerifiedSection = (): string => {
  const thms = leanTheorems() as { name: string; file: string; statement: string; tactic: string }[]
  const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
  const entry = (name: string) => live.find((e) => e.key.endsWith('_' + name))
  let md = `## Cross-verified against external authorities\n\n`
  md += `The ℤ/9 mathematics is self-contained — the kernel is its authority, and a \`by decide\` proof needs no outside `
    + `source. Where the deposit touches EXTERNAL reality it is anchored to the standard that defines it and cross-checked `
    + `on every build. Two facts are PROVEN in Lean below; the cross-checks beside them are RE-RUN each build and are `
    + `measurements, not kernel theorems: the SHA-512 and Ed25519 primitives are held to the published FIPS 180-4 and `
    + `RFC 8032 vectors (\`npm run crypto-kat\`) and refuse every forgery; the CERN counts below are a DATED measurement, `
    + `re-measurable against the live portal, which grows; and the trial (\`npm run verify\`) holds the record to zero `
    + `DRAINED — a citation to a theorem that is not sealed fails the build.\n\n`
  for (const { file, name, bound } of CROSS_VERIFIED) {
    const t = thms.find((x) => x.file === file && x.name === name), e = entry(name)
    if (!t || !e) continue
    md += `- **\`${name}\`** · \`${t.tactic.replace(/\s+/g, ' ')}\`, ${domainOf(t.statement).toLocaleString('en-US')} cases — ${bound}.\n`
      + `  <sub>[\`${e.key}\`](/theorem/${e.key}) · receipt \`${e.receipt.slice(0, 13)}…\`</sub>\n`
  }
  return md + '\n'
}
