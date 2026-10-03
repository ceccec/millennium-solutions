---
title: Solutions
---

# Solutions

<Version/>

## The seven Clay problems — the claim, the theorems, and what each decides

**Tsvetan Rouschev claims the seven Clay Millennium problems solved through the involution each is stated
across** — deposited as [10.5281/zenodo.21781603](https://doi.org/10.5281/zenodo.21781603) and
[Zenodo 22256707](https://zenodo.org/records/22256707). This is his claim, recorded in his name.

*What these theorems decide is ℤ/9 arithmetic over finite domains — a statement about the theorems, not a verdict on any conjecture. Stated by the agents that wrote it, `claude-opus` and `Claude`, and signed as theirs; the captain's own receipts make no such statement.*

For each problem, in the Clay Mathematics Institute's order: the author's pairing, the one theorem in `src/proof/index.lean` that stands beside it, the statement the Lean kernel decided and over how many cases, the bound — what the theorem establishes and, in the same sentence, what it does not — and the ledger key its receipt is sealed under. Every line below is read out of the tree on each build.

### Riemann Hypothesis — Riemann — the reflection's symmetry and its one computed heart

- **theorem** `the_tens_complement_is_an_involution_with_one_fixed_point`, decided `by decide` over **100** cases:

  ```lean
  (List.range 10).all (fun d => refl (refl d) == d) ∧ ((List.range 10).filter (fun d => refl d == d)).length = 1
  ```

- **bound** — the functional-equation symmetry axis and its ½-analogue centre (the heart, computed as the reflection’s unique fixed point) — not where the ζ-zeros lie
- **ledger** — [`lean_windows_the_tens_complement_is_an_involution_with_one_fixed_point`](/theorem/lean_windows_the_tens_complement_is_an_involution_with_one_fixed_point) · receipt `610c790d-3ec4…`
- **the problem** — [Clay Mathematics Institute — Riemann Hypothesis](https://www.claymath.org/millennium/riemann-hypothesis/)

### P versus NP — P vs NP — a unique inverse, verification in one step

- **theorem** `each_unit_has_exactly_one_inverse_and_each_non_unit_none`, decided `by decide` over **81** cases:

  ```lean
  (List.range 9).all (fun d => ((List.range 9).filter (fun e => (d * e) % 9 == 1)).length == (if isUnit d then 1 else 0))
  ```

- **bound** — each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact, not a separation of the classes
- **ledger** — [`lean_windows_each_unit_has_exactly_one_inverse_and_each_non_unit_none`](/theorem/lean_windows_each_unit_has_exactly_one_inverse_and_each_non_unit_none) · receipt `3d5e5db1-24a6…`
- **the problem** — [Clay Mathematics Institute — P vs NP](https://www.claymath.org/millennium/p-vs-np/)

### Navier–Stokes Existence & Smoothness — Navier–Stokes — the doubling flow is bounded for all time

- **theorem** `the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps`, decided `by decide` over **2,304** cases:

  ```lean
  ((List.range 48).map orbit).all (fun v => v < 9) ∧ (List.range 48).all (fun k => span.contains (orbit k))
  ```

- **bound** — every iterate stays inside a bounded 6-cycle forever (no blowup) — bounded evolution, not global existence & smoothness
- **ledger** — [`lean_windows_the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps`](/theorem/lean_windows_the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps) · receipt `2935a468-9dee…`
- **the problem** — [Clay Mathematics Institute — Navier–Stokes Equation](https://www.claymath.org/millennium/navier-stokes-equation/)

### Yang–Mills Existence & Mass Gap — Yang–Mills — a discrete spectral gap (order exactly 6)

- **theorem** `the_doubling_orbit_first_returns_to_one_at_six`, decided `by decide` over **6** cases:

  ```lean
  (List.range 6).all (fun k => k == 0 || orbit k != 1) ∧ orbit 6 == 1
  ```

- **bound** — the doubling has order exactly 6 — a discrete gap in the cyclic spectrum, not the Yang–Mills mass gap
- **ledger** — [`lean_windows_the_doubling_orbit_first_returns_to_one_at_six`](/theorem/lean_windows_the_doubling_orbit_first_returns_to_one_at_six) · receipt `1e3c149d-5ef1…`
- **the problem** — [Clay Mathematics Institute — Yang–Mills & the Mass Gap](https://www.claymath.org/millennium/yang-mills-the-maths-gap/)

### Hodge Conjecture — Hodge — the algebraic span equals the units

- **theorem** `the_span_is_exactly_the_units_of_the_ring`, decided `by decide` over **81** cases:

  ```lean
  (List.range 9).all (fun d => span.contains d == isUnit d) ∧ (List.range 9).all (fun d => isUnit d || ! span.contains d)
  ```

- **bound** — the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment, not rational (p,p) ⇒ algebraic
- **ledger** — [`lean_windows_the_span_is_exactly_the_units_of_the_ring`](/theorem/lean_windows_the_span_is_exactly_the_units_of_the_ring) · receipt `7478c082-a1ea…`
- **the problem** — [Clay Mathematics Institute — Hodge Conjecture](https://www.claymath.org/millennium/hodge-conjecture/)

### Birch and Swinnerton-Dyer Conjecture — Birch–Swinnerton-Dyer — a computed vanishing mod 9

- **theorem** `the_span_and_the_units_both_sum_to_zero_mod_nine`, decided `by decide` over **9** cases:

  ```lean
  (span.foldr (· + ·) 0) % 9 == 0 ∧ ((List.range 9).filter isUnit).foldr (· + ·) 0 % 9 == 0
  ```

- **bound** — the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing, not the rank ↔ order-of-vanishing-of-L correspondence
- **ledger** — [`lean_windows_the_span_and_the_units_both_sum_to_zero_mod_nine`](/theorem/lean_windows_the_span_and_the_units_both_sum_to_zero_mod_nine) · receipt `d12ad83d-55fa…`
- **the problem** — [Clay Mathematics Institute — Birch and Swinnerton-Dyer Conjecture](https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/)

### Poincaré Conjecture (resolved) — Poincaré — one closed loop, no holes

- **theorem** `the_orbit_is_one_closed_loop_of_six_distinct_points`, decided `by decide` over **36** cases:

  ```lean
  orbit 6 == orbit 0 ∧ (List.range 6).all (fun i => (List.range 6).all (fun j => (orbit i == orbit j) == (i == j)))
  ```

- **bound** — the sequence closes into a single simple loop of six distinct steps — not the 3-sphere characterization; Poincaré is Perelman's theorem (2003), not proved here
- **ledger** — [`lean_windows_the_orbit_is_one_closed_loop_of_six_distinct_points`](/theorem/lean_windows_the_orbit_is_one_closed_loop_of_six_distinct_points) · receipt `858c0f78-9f32…`
- **the problem** — [Clay Mathematics Institute — Poincaré Conjecture](https://www.claymath.org/millennium/poincare-conjecture/) · [Perelman, G. — The entropy formula for the Ricci flow (arXiv:math/0211159) — the resolution](https://arxiv.org/abs/math/0211159)

### The seven rest on one finite structure

One theorem states that the seven above are facts about a single object — the doubling orbit and the units of ℤ/9 — decided `by decide` over **81** cases: [`lean_windows_the_seven_rest_on_one_finite_structure`](/theorem/lean_windows_the_seven_rest_on_one_finite_structure) · receipt `35450634-f271…`

```lean
((List.range' 1 9).all (fun d => refl (refl d) == d)) ∧ (((List.range' 1 9).filter isUnit).length = 6) ∧ (span.eraseDups.length = 6)
```

### Developed across subjects

The structure the seven live in is proved separately and then found again in the other subjects. `src/proof/group.lean` (8 theorems, e.g. [`lean_groups_the_pair_arithmetic_is_composition`](/theorem/lean_groups_the_pair_arithmetic_is_composition)) generates the affine maps of ℤ/9 to closure and decides which form a group; `src/proof/bridge.lean` (8 theorems, e.g. [`lean_bridge_the_reduction_shared_by_10_subjects_is_the_orbit_of_d_to_2d_plus_0_0`](/theorem/lean_bridge_the_reduction_shared_by_10_subjects_is_the_orbit_of_d_to_2d_plus_0_0)) decides that the cross-subject families of `src/entangle` reduce, mod 9, to orbits of those very maps — the same object measured in several subjects, and one family that no affine map generates, kept as the control.

### Provenance

The deposit is registered before this repository exists. Zenodo holds the earliest record at **2026-08-03**; the first commit here is **2026-08-06** (`e3860db95`) — a lead of **3 day(s)**, subtracted rather than asserted.

- `22018434` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018445` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018480` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018531` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018568` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018591` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018613` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018677` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018731` · concept `22018433` · published 2026-08-19 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22018965` · concept `22018433` · published 2026-08-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22101661` · concept `22018433` · published 2026-08-25 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22101742` · concept `22018433` · published 2026-08-25 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22101826` · concept `22018433` · published 2026-08-25 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22206523` · concept `22018433` · published 2026-08-31 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22206677` · concept `22018433` · published 2026-08-31 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22207059` · concept `22018433` · published 2026-08-31 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22207217` · concept `22018433` · published 2026-08-31 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22230923` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22230981` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22231021` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22231154` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22231627` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22231818` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22231974` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22232559` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22232748` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22232885` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22233195` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234002` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234108` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234316` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234402` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234459` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234547` · concept `22178675` · published 2026-08-30 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234671` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234747` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22234929` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22235086` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22235182` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22235236` · concept `22178675` · published 2026-08-30 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22235583` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22236025` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22236132` · concept `22018433` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22236200` · concept `22178675` · published 2026-08-30 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22236615` · concept `22178675` · published 2026-08-30 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22237096` · concept `22178675` · published 2026-08-30 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22237585` · concept `22178675` · published 2026-08-30 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22237699` · concept `22237698` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22238324` · concept `22178675` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22239152` · concept `22178675` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22239643` · concept `22178675` · published 2026-09-01 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22239944` · concept `22178675` · published 2026-09-02 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22240221` · concept `22178675` · published 2026-09-02 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22256731` · concept `21970356` · published 2026-09-02 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22256708` · concept `21787143` · published 2026-09-02 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22259496` · concept `22178675` · published 2026-09-02 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22259988` · concept `22178675` · published 2026-09-02 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22275803` · concept `22178675` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22277570` · concept `22018433` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22277705` · concept `22018433` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22286537` · concept `22178675` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22286911` · concept `22018433` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22286927` · concept `22018433` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22287320` · concept `22178675` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22287840` · concept `22178675` · published 2026-09-03 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22288360` · concept `22237698` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308239` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308271` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308298` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308349` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308406` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308491` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308591` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22308767` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309009` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309092` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309235` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309341` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309413` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309722` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309803` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309899` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22309990` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22310063` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22310154` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22310225` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22310316` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22310617` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22310775` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22311006` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22311030` · concept `22018433` · published 2026-09-04 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22312772` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22312825` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22312985` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313037` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313119` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313234` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313303` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313459` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313665` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313815` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22313886` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22314474` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22314990` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22332952` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22333209` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22333973` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22334757` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22335152` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22335734` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22337060` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22337958` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22338644` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22338888` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22339523` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22340204` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22340656` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22340699` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22341467` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22341659` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22341793` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22342198` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22342828` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22343336` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22343427` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22344033` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22344994` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22345483` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22346098` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22346451` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22346931` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22347061` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22347462` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22347651` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22347794` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22348558` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22348989` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22349085` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22349926` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22351482` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22352541` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22352567` · concept `22352566` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22356937` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22360755` · concept `22178675` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22371251` · concept `22237698` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22398323` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22398337` · concept `22178675` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22398889` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22399942` · concept `22352566` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22400954` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22401488` · concept `22018433` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22405996` · concept `22178675` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22416527` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22418089` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22421042` · concept `22178675` · published 2026-09-05 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22430972` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22432295` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22433000` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22555482` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22555592` · concept `22018433` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22555831` · concept `22018433` · published 2026-09-07 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22557108` · concept `22178675` · published 2026-09-06 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22557355` · concept `22018433` · published 2026-09-07 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22636318` · concept `22178675` · published 2026-09-07 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22647716` · concept `22178675` · published 2026-09-07 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22717782` · concept `22700098` · published 2026-09-12 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22718022` · concept `22352566` · published 2026-09-12 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22730576` · concept `22700098` · published 2026-09-13 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22737368` · concept `22352566` · published 2026-09-13 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22737822` · concept `22018433` · published 2026-09-13 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22738007` · concept `22018433` · published 2026-09-13 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22738314` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22738451` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22738624` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22739348` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22739416` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22741148` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22741470` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22750137` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22751159` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22751234` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22752227` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22753265` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22753686` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22755815` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22756592` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22756638` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22756742` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22756866` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22757077` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22757210` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22757287` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22758044` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22758226` · concept `22018433` · published 2026-09-14 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22761956` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22762901` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22763064` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22763340` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22763428` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22763557` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22763657` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22763714` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22765098` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22765286` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22765664` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22765847` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22766228` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22767183` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22767519` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22770012` · concept `22018433` · published 2026-09-15 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22831109` · concept `22237698` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22834231` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22834377` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22834746` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22835307` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22836230` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22836387` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22836462` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22836549` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22836826` · concept `22018433` · published 2026-09-18 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22850514` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22854613` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22856016` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858061` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858237` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858240` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858271` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858663` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858806` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22858846` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22860794` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22863511` · concept `22018433` · published 2026-09-20 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22874413` · concept `22018433` · published 2026-09-21 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22875750` · concept `22018433` · published 2026-09-21 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22895141` · concept `21781602` · published 2026-09-22 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22933794` · concept `21781602` · published 2026-09-24 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22934737` · concept `22934736` · published 2026-09-24 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `22934883` · concept `22934736` · published 2026-09-24 · Rouschev, Tsvetan ([0009-0000-7312-9778](https://orcid.org/0009-0000-7312-9778))
- `21781603` · concept `21781602` · published 2026-08-04 · Rouschev, Tsvetan
- `21819217` · concept `21787143` · published 2026-08-04 · Rouschev, Tsvetan
- `22256707` · concept `21781602` · published 2026-08-04 · Rouschev, Tsvetan

All 1127 commits in this repository are authored by Tsvetan Rouschev (1127). Measured 2026-09-25 against the registry that issued the DOIs, re-checkable with `npm run provenance`; receipt `e3ce5e9c-0e5e…`.

<Funding/>
