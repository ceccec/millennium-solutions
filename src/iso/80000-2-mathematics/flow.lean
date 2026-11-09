import Index
-- title: The doubling flow, for every step
-- wing: the ring
-- prior_art: named
-- prior_art_domain: elementary number theory — the multiplicative order of 2 modulo 9
-- prior_art_note: 2⁶ = 64 ≡ 1 (mod 9), so the powers of two modulo 9 repeat with period six — Euler's
--   theorem for φ(9) = 6, and the order of 2 in U(9), both textbook. Credited, and bounded: what this file adds
--   is the kernel proof that the flow used by `navier_stokes_flow_is_bounded` stays bounded at EVERY step,
--   not only at the 48 that theorem checks.
-- prior_art_search: literature search performed 2026-09-14, terms "powers of two modulo 9 period 6 order of 2
--   mod 9 Euler theorem"; prior art found and credited.
-- prior_art_pool: bounded
-- prior_art_own: the every-step bound of the doubling flow, stated for the Navier–Stokes theorem in index.lean
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- `navier_stokes_flow_is_bounded` in index.lean decides its bound over the first 48 steps, and every page that
-- quotes it says "for all time". Forty-eight steps are not all time: `decide` stops at its bound. This file
-- goes past it. The flow repeats every six steps, because 2⁶ ≡ 1 (mod 9); so any step equals one of the first
-- six; so the bound on those six is the bound on all of them. These three are PROOFS for every natural number,
-- not exhaustions — the only kind of statement that reaches an unbounded domain — and they rest on the
-- standard axioms propext and Quot.sound, printed per theorem by lean.ts.

namespace Flow
open Windows

-- ── the period: six steps of doubling return the flow to where it was, at every step ────────────────────
theorem the_doubling_flow_repeats_every_six_steps : ∀ k : Nat, orbit (k + 6) = orbit k := by
  intro k
  unfold orbit
  rw [Nat.pow_add, Nat.mul_mod]
  have h : 2 ^ 6 % 9 = 1 := by decide
  rw [h, Nat.mul_one, Nat.mod_mod]

-- ── hence every step is one of the first six ──────────────────────────────────────────────────────────────
theorem the_doubling_flow_is_its_first_six_steps : ∀ k : Nat, orbit k = orbit (k % 6) := by
  intro k
  induction k using Nat.strongRecOn with
  | _ k ih =>
    if hk : k < 6 then rw [Nat.mod_eq_of_lt hk]
    else
      have e : k = (k - 6) + 6 := by omega
      rw [e, the_doubling_flow_repeats_every_six_steps, ih (k - 6) (by omega), Nat.add_mod_right]

-- ── and so the flow is bounded at every step: a residue below 9, inside the six-cycle, for all k ─────────
theorem navier_stokes_flow_is_bounded_for_every_step :
    ∀ k : Nat, orbit k < 9 ∧ span.contains (orbit k) = true := by
  intro k
  rw [the_doubling_flow_is_its_first_six_steps]
  have h : k % 6 < 6 := Nat.mod_lt _ (by decide)
  generalize k % 6 = j at h ⊢
  revert j
  decide


-- ── reflections, from the orbit batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
-- orbit and span are Windows' (index.lean), opened above — not redefined here
-- REFLECTION: the reverse flow (halving, ×5) steps every state back one, at every step
theorem the_reverse_flow_undoes_every_step : ∀ k : Nat, orbit (k + 1) * 5 % 9 = orbit k := by
  intro k
  unfold orbit
  rw [Nat.mul_mod, Nat.mod_mod, ← Nat.mul_mod, Nat.pow_succ, Nat.mul_assoc, Nat.mul_mod]
  show 2 ^ k % 9 * 1 % 9 = 2 ^ k % 9
  rw [Nat.mul_one, Nat.mod_mod]

-- REFLECTION of "bounded": recurrent — from every step, every state of the span returns within six steps
theorem every_state_of_the_flow_returns_within_six_steps :
    ∀ k s : Nat, ∃ j, j < 6 ∧ orbit (k + j) = orbit s := by
  intro k s
  have key : ∀ r, r < 6 → ∀ t, t < 6 → ∃ j, j < 6 ∧ orbit ((r + j) % 6) = orbit t := by
    decide
  obtain ⟨j, hj, e⟩ := key (k % 6) (Nat.mod_lt _ (by decide)) (s % 6) (Nat.mod_lt _ (by decide))
  refine ⟨j, hj, ?_⟩
  rw [the_doubling_flow_is_its_first_six_steps (k + j), the_doubling_flow_is_its_first_six_steps s]
  have hm : (k + j) % 6 = (k % 6 + j) % 6 := by omega
  rw [hm]
  exact e


-- ── the discrete energy laws behind every Navier–Stokes estimate, on a periodic lattice — for every size ─────────
-- The Millennium Problem asks whether smooth solutions of the 3D incompressible equations exist for all time, or
-- whether some break down; the Clay Mathematics Institute lists it as open, and nothing here decides it. What IS
-- proved here is the discrete shadow of the identity every known estimate rests on: the nonlinear term moves energy
-- between scales but never creates it, and viscosity only removes it. On a ring of N ≥ 1 sites, with the standard
-- skew-symmetric (one-third) discretisation of the Burgers nonlinearity, Σ uᵢ·Nᵢ = 0 and Σ uᵢ(Δu)ᵢ = −Σ(uᵢ₊₁ − uᵢ)²,
-- so the energy of du/dt = −N(u)/3 + νΔu never increases — for every N, every integer field and every ν ≥ 0.
-- Energy alone gives Leray's weak solutions (1934), not smoothness; Tao (2016) showed an averaged equation keeping
-- this identity still blows up. The frontier is stated on the page navierstokes.md.
/-- a finite sum over the sites 0 … n−1 -/
def ringSum (f : Nat → Int) : Nat → Int
  | 0 => 0
  | n + 1 => ringSum f n + f n

/-- the site after i on a ring of N sites, and the site before it -/
def ringNext (N i : Nat) : Nat := (i + 1) % N
def ringPrev (N i : Nat) : Nat := (i + N - 1) % N

theorem a_ring_sum_splits_over_a_sum : ∀ (f g : Nat → Int) (n : Nat), ringSum (fun i => f i + g i) n = ringSum f n + ringSum g n := by
  intro f g n
  induction n with
  | zero => rfl
  | succ n ih => show ringSum (fun i => f i + g i) n + (f n + g n) = ringSum f n + f n + (ringSum g n + g n); rw [ih]; omega

theorem a_ring_sum_of_negatives_is_the_negated_sum : ∀ (f : Nat → Int) (n : Nat), ringSum (fun i => - f i) n = - ringSum f n := by
  intro f n
  induction n with
  | zero => rfl
  | succ n ih => show ringSum (fun i => - f i) n + - f n = - (ringSum f n + f n); rw [ih]; omega

theorem ring_sums_agree_where_their_terms_agree : ∀ (f g : Nat → Int) (n : Nat), (∀ i, i < n → f i = g i) → ringSum f n = ringSum g n := by
  intro f g n h
  induction n with
  | zero => rfl
  | succ n ih =>
    show ringSum f n + f n = ringSum g n + g n
    rw [ih (fun i hi => h i (by omega)), h n (by omega)]

theorem a_ring_sum_peels_its_first_term : ∀ (f : Nat → Int) (n : Nat), ringSum f (n + 1) = f 0 + ringSum (fun i => f (i + 1)) n := by
  intro f n
  induction n with
  | zero => show 0 + f 0 = f 0 + 0; omega
  | succ n ih =>
    show ringSum f (n + 1) + f (n + 1) = f 0 + (ringSum (fun i => f (i + 1)) n + f (n + 1))
    rw [ih]; omega

/-- ROTATING A RING DOES NOT CHANGE ITS SUM: Σ f(ringNext i) = Σ f(i) over the N sites -/
theorem a_cyclic_sum_is_unchanged_by_one_step_of_rotation :
    ∀ (N : Nat) (f : Nat → Int), 0 < N → ringSum (fun i => f (ringNext N i)) N = ringSum f N := by
  intro N f hN
  obtain ⟨n, rfl⟩ : ∃ n, N = n + 1 := ⟨N - 1, by omega⟩
  have h1 : ringSum (fun i => f (ringNext (n + 1) i)) (n + 1) = ringSum (fun i => f (i + 1)) n + f 0 := by
    show ringSum (fun i => f (ringNext (n + 1) i)) n + f (ringNext (n + 1) n) = _
    have hl : ringNext (n + 1) n = 0 := by unfold ringNext; exact Nat.mod_self (n + 1)
    rw [hl, ring_sums_agree_where_their_terms_agree (fun i => f (ringNext (n + 1) i)) (fun i => f (i + 1)) n (fun i hi => by
      show f ((i + 1) % (n + 1)) = f (i + 1)
      rw [Nat.mod_eq_of_lt (by omega)])]
  rw [h1, a_ring_sum_peels_its_first_term]; omega

theorem the_site_before_the_next_is_the_site : ∀ N i : Nat, i < N → ringPrev N (ringNext N i) = i := by
  intro N i hi
  unfold ringPrev ringNext
  if h : i + 1 < N then
    rw [Nat.mod_eq_of_lt h, show i + 1 + N - 1 = i + N by omega, Nat.add_mod_right, Nat.mod_eq_of_lt hi]
  else
    have e : i + 1 = N := by omega
    rw [e, Nat.mod_self, show 0 + N - 1 = i by omega, Nat.mod_eq_of_lt hi]

/-- a sum over pairs (ringPrev i, i) is the sum over pairs (i, ringNext i) — the same bonds, read from the other end -/
theorem a_bond_sum_reads_the_same_from_either_end :
    ∀ (N : Nat) (F : Nat → Nat → Int), 0 < N → ringSum (fun i => F (ringPrev N i) i) N = ringSum (fun i => F i (ringNext N i)) N := by
  intro N F hN
  rw [← a_cyclic_sum_is_unchanged_by_one_step_of_rotation N (fun i => F (ringPrev N i) i) hN]
  exact ring_sums_agree_where_their_terms_agree _ _ N (fun i hi => by rw [the_site_before_the_next_is_the_site N i hi])

/-- the skew-symmetric (one-third) discretisation of the Burgers nonlinearity u·∂u on the ring, times 3 -/
def burgersSkew3 (N : Nat) (u : Nat → Int) (i : Nat) : Int :=
  u i * (u (ringNext N i) - u (ringPrev N i)) + (u (ringNext N i) * u (ringNext N i) - u (ringPrev N i) * u (ringPrev N i))

/-- the discrete Laplacian on the ring -/
def ringLap (N : Nat) (u : Nat → Int) (i : Nat) : Int := u (ringNext N i) - 2 * u i + u (ringPrev N i)

/-- THE NONLINEAR TERM DOES NO WORK: Σ uᵢ · Nᵢ = 0 on every ring, for every field -/
theorem the_skew_symmetric_burgers_term_does_no_work_on_every_ring :
    ∀ (N : Nat) (u : Nat → Int), 0 < N → ringSum (fun i => u i * burgersSkew3 N u i) N = 0 := by
  intro N u hN
  -- uᵢ·Nᵢ = P(i, ringNext i) − P(ringPrev i, i) with P(a, b) = u a² u b + u a u b²
  let P : Nat → Nat → Int := fun a b => u a * u a * u b + u a * u b * u b
  have pt : ∀ i, u i * burgersSkew3 N u i = P i (ringNext N i) + - P (ringPrev N i) i := by
    intro i
    unfold burgersSkew3
    simp only [P, Int.mul_add, Int.mul_sub, Int.sub_eq_add_neg, Int.neg_add, Int.mul_neg, Int.neg_mul]
    simp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]
    omega
  rw [ring_sums_agree_where_their_terms_agree _ _ N (fun i _ => pt i), a_ring_sum_splits_over_a_sum, a_ring_sum_of_negatives_is_the_negated_sum,
      a_bond_sum_reads_the_same_from_either_end N P hN]
  omega

/-- VISCOSITY ONLY REMOVES ENERGY: Σ uᵢ (Δu)ᵢ = − Σ (uᵢ₊₁ − uᵢ)² -/
theorem the_discrete_laplacian_dissipates_exactly_the_squared_differences :
    ∀ (N : Nat) (u : Nat → Int), 0 < N →
      ringSum (fun i => u i * ringLap N u i) N = - ringSum (fun i => (u (ringNext N i) - u i) * (u (ringNext N i) - u i)) N := by
  intro N u hN
  have hsq : ringSum (fun i => u (ringNext N i) * u (ringNext N i)) N = ringSum (fun i => u i * u i) N :=
    a_cyclic_sum_is_unchanged_by_one_step_of_rotation N (fun i => u i * u i) hN
  have hbond : ringSum (fun i => u (ringPrev N i) * u i) N = ringSum (fun i => u i * u (ringNext N i)) N :=
    a_bond_sum_reads_the_same_from_either_end N (fun a b => u a * u b) hN
  have lhs : ∀ i, u i * ringLap N u i = (u i * u (ringNext N i) + u (ringPrev N i) * u i) + - (u i * u i + u i * u i) := by
    intro i; unfold ringLap
    rw [Int.mul_add, Int.mul_sub, Int.mul_left_comm (u i) 2 (u i), Int.mul_comm (u i) (u (ringPrev N i))]
    omega
  have rhs : ∀ i, (u (ringNext N i) - u i) * (u (ringNext N i) - u i) = (u (ringNext N i) * u (ringNext N i) + u i * u i) + - (u i * u (ringNext N i) + u i * u (ringNext N i)) := by
    intro i
    simp only [Int.mul_add, Int.add_mul, Int.mul_sub, Int.sub_mul, Int.sub_eq_add_neg, Int.mul_neg, Int.neg_mul, Int.neg_add, Int.neg_neg]
    simp only [Int.mul_assoc, Int.mul_comm, Int.mul_left_comm]
    omega
  rw [ring_sums_agree_where_their_terms_agree _ _ N (fun i _ => lhs i), ring_sums_agree_where_their_terms_agree (fun i => (u (ringNext N i) - u i) * (u (ringNext N i) - u i)) _ N (fun i _ => rhs i)]
  simp only [a_ring_sum_splits_over_a_sum, a_ring_sum_of_negatives_is_the_negated_sum]
  rw [hbond, hsq]
  omega

theorem a_sum_of_squares_is_never_negative : ∀ (f : Nat → Int) (n : Nat), 0 ≤ ringSum (fun i => f i * f i) n := by
  intro f n
  induction n with
  | zero => exact Int.le_refl 0
  | succ n ih =>
    show 0 ≤ ringSum (fun i => f i * f i) n + f n * f n
    have h := @Int.natAbs_mul_self (f n)
    omega

/-- THE ENERGY NEVER INCREASES: along du/dt = −N(u)/3 + ν Δu the rate of ½Σu² is −ν Σ(uᵢ₊₁ − uᵢ)² ≤ 0 (times 3) -/
theorem the_discrete_energy_never_increases_on_every_ring :
    ∀ (N : Nat) (u : Nat → Int) (ν : Int), 0 < N → 0 ≤ ν →
      ringSum (fun i => u i * (3 * ν * ringLap N u i - burgersSkew3 N u i)) N ≤ 0 := by
  intro N u ν hN hν
  have split : ∀ i, u i * (3 * ν * ringLap N u i - burgersSkew3 N u i) = (3 * ν) * (u i * ringLap N u i) + - (u i * burgersSkew3 N u i) := by
    intro i
    rw [Int.mul_sub, Int.sub_eq_add_neg, Int.mul_left_comm (u i) (3 * ν)]
  have scale : ∀ (c : Int) (f : Nat → Int) (n : Nat), ringSum (fun i => c * f i) n = c * ringSum f n := by
    intro c f n
    induction n with
    | zero => show (0 : Int) = c * 0; rw [Int.mul_zero]
    | succ n ih => show ringSum (fun i => c * f i) n + c * f n = c * (ringSum f n + f n); rw [ih, Int.mul_add]
  rw [ring_sums_agree_where_their_terms_agree _ _ N (fun i _ => split i), a_ring_sum_splits_over_a_sum, a_ring_sum_of_negatives_is_the_negated_sum, scale,
      the_skew_symmetric_burgers_term_does_no_work_on_every_ring N u hN,
      the_discrete_laplacian_dissipates_exactly_the_squared_differences N u hN]
  have sq := a_sum_of_squares_is_never_negative (fun i => u (ringNext N i) - u i) N
  have h3 : 0 ≤ 3 * ν := by omega
  have := Int.mul_nonneg h3 sq
  generalize ringSum (fun i => (u (ringNext N i) - u i) * (u (ringNext N i) - u i)) N = S at *
  rw [Int.mul_neg]
  omega

end Flow
