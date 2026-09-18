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
