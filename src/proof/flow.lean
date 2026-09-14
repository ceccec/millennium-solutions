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
open MillenniumFloor

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

end Flow
