// THE SEVEN, in problem order — the qualified outlet and the honest bound for each Clay problem this
// framework has a theorem ADJACENT to. This lived only in theorem/[key].paths.ts, so the collected paper had
// no way to say which of its theorems sit at the Millennium floor without the bounds being retyped into a
// second place — and a retyped bound is a bound that can drift from the one the theorem page shows.
//
// The `bound` is the load-bearing field. It states what the theorem actually establishes and, explicitly,
// what it does NOT: none of these is the conjecture, and provenHere = 0.
export const MILLENNIUM: Record<string, { problem: string; name: string; bound: string; outlet: string; outletName: string; outlet2?: string; outlet2Name?: string }> = {
  riemann_reflection_and_heart: {
    problem: 'Riemann Hypothesis',
    name: "Riemann — the reflection's symmetry and its one computed heart",
    bound: 'the functional-equation symmetry axis and its ½-analogue centre (the heart, computed as the reflection’s unique fixed point) — not where the ζ-zeros lie',
    outlet: 'https://www.claymath.org/millennium/riemann-hypothesis/',
    outletName: 'Clay Mathematics Institute — Riemann Hypothesis' },
  p_vs_np_inverse_is_unique: {
    problem: 'P versus NP',
    name: 'P vs NP — a unique inverse, verification in one step',
    bound: 'each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact, not a separation of the classes',
    outlet: 'https://www.claymath.org/millennium/p-vs-np/',
    outletName: 'Clay Mathematics Institute — P vs NP' },
  navier_stokes_flow_is_bounded: {
    problem: 'Navier–Stokes Existence & Smoothness',
    name: 'Navier–Stokes — the doubling flow is bounded for all time',
    bound: 'every iterate stays inside a bounded 6-cycle forever (no blowup) — bounded evolution, not global existence & smoothness',
    outlet: 'https://www.claymath.org/millennium/navier-stokes-equation/',
    outletName: 'Clay Mathematics Institute — Navier–Stokes Equation' },
  yang_mills_spectral_gap: {
    problem: 'Yang–Mills Existence & Mass Gap',
    name: 'Yang–Mills — a discrete spectral gap (order exactly 6)',
    bound: 'the doubling has order exactly 6 — a discrete gap in the cyclic spectrum, not the Yang–Mills mass gap',
    outlet: 'https://www.claymath.org/millennium/yang-mills-the-maths-gap/',
    outletName: 'Clay Mathematics Institute — Yang–Mills & the Mass Gap' },
  hodge_span_is_the_units: {
    problem: 'Hodge Conjecture',
    name: 'Hodge — the algebraic span equals the units',
    bound: 'the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment, not rational (p,p) ⇒ algebraic',
    outlet: 'https://www.claymath.org/millennium/hodge-conjecture/',
    outletName: 'Clay Mathematics Institute — Hodge Conjecture' },
  birch_swinnerton_dyer_vanishing: {
    problem: 'Birch and Swinnerton-Dyer Conjecture',
    name: 'Birch–Swinnerton-Dyer — a computed vanishing mod 9',
    bound: 'the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing, not the rank ↔ order-of-vanishing-of-L correspondence',
    outlet: 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/',
    outletName: 'Clay Mathematics Institute — Birch and Swinnerton-Dyer Conjecture' },
  poincare_single_closed_loop: {
    problem: 'Poincaré Conjecture (resolved)',
    name: 'Poincaré — one closed loop, no holes',
    bound: "the sequence closes into a single simple loop of six distinct steps — not the 3-sphere characterization; Poincaré is Perelman's theorem (2003), not proved here",
    outlet: 'https://www.claymath.org/millennium/poincare-conjecture/',
    outletName: 'Clay Mathematics Institute — Poincaré Conjecture',
    outlet2: 'https://arxiv.org/abs/math/0211159',
    outlet2Name: 'Perelman, G. — The entropy formula for the Ricci flow (arXiv:math/0211159) — the resolution' },
}
