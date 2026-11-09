-- title: Every quantum computing model ISO/IEC 4879 names, one exact instance each, decided over the cyclotomic integers
-- wing: the machine
-- prior_art: named
-- prior_art_domain: ISO/IEC 4879:2024 — circuit-based §3.4.13 (decided in quantum_circuits.lean), one-way §3.4.14,
--   adiabatic §3.4.15, topological §3.4.16, the quantum annealer §3.4.31 and boson sampling §3.5.8; measurement-based
--   computation and gate teleportation on a cluster state (Raussendorf, Briegel, 2001); Ising anyons, whose braids give
--   the Clifford gates and are not universal alone (Kitaev 2003; Bravyi, Kitaev 2005); the Hong–Ou–Mandel dip (1987)
--   and the permanent as the amplitude of boson sampling (Aaronson, Arkhipov, 2011); the adiabatic theorem's gap
--   condition (Farhi, Goldstone, Gutmann, Sipser, 2000); the frustrated antiferromagnetic triangle.
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S. Each theorem decides one small, exact instance of a named
--   model in ℤ[ω] (ω = e^{iπ/4}) or in the integers. That is §3.4.22 by definition — a classical program computing what
--   a model's ideal device would — and never evidence that any device computes it.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the choice of instance per model, its exact transcription, and the control beside each
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT IT DECIDES. Each model at its known optimum: the one-way pattern for every π/4 angle and both outcomes, the
-- whole group Ising braids generate (24 classes, closed), every balanced beam splitter, the adiabatic gap for every
-- rational schedule point (proved for every value, not sampled), and the frustrated triangle's whole spectrum.

import Quantum_circuits
open QuantumCircuits

namespace QuantumModels

def sgn (m : Nat) (x : Zw) : Zw := if m == 0 then x else zneg x

-- ── ONE-WAY (§3.4.14): input ψ = |0⟩ + ω|1⟩ on qubit 0, |+⟩ on qubit 1, CZ, then measure qubit 0 against
--    ⟨0| ± ω^k⟨1|. Outcome m leaves qubit 1 in X^m·H·RZ(kπ/4)·ψ — the gate is applied by measuring. ──────────────

def psi0 : Zw := (1, 0, 0, 0)
def psi1 : Zw := (0, 1, 0, 0)
def oneWay (cz : Bool) (k m : Nat) : Zw × Zw :=
  let s3 := if cz then zneg psi1 else psi1
  (zadd psi0 (sgn m (zmul (wpow k) psi1)), zadd psi0 (sgn m (zmul (wpow k) s3)))
def gateOut (k m : Nat) : Zw × Zw :=
  let b := zmul (wpow k) psi1
  let h := (zadd psi0 b, zadd psi0 (zneg b))
  if m == 0 then h else (h.2, h.1)

theorem one_way_measurement_applies_h_rz_for_every_angle_and_both_outcomes :
  (List.range 8).all (fun k => (List.range 2).all (fun m => oneWay true k m == gateOut k m)) = true := by decide

/-- REFUTED CONTROL: without the cluster's CZ, measuring qubit 0 does not carry the gate to qubit 1. -/
theorem one_way_without_the_cluster_bond_does_not_apply_the_gate :
  oneWay false 0 0 ≠ gateOut 0 0 := by decide

-- ── TOPOLOGICAL (§3.4.16): Ising anyons. σ₁ = diag(1, i) and σ₂ = H·σ₁·H (scaled by 2) on the fusion space. ────

abbrev Mat := Zw × Zw × Zw × Zw
def mmul (a b : Mat) : Mat :=
  (zadd (zmul a.1 b.1) (zmul a.2.1 b.2.2.1), zadd (zmul a.1 b.2.1) (zmul a.2.1 b.2.2.2),
   zadd (zmul a.2.2.1 b.1) (zmul a.2.2.2 b.2.2.1), zadd (zmul a.2.2.1 b.2.1) (zmul a.2.2.2 b.2.2.2))
def zero : Zw := (0, 0, 0, 0)
def one : Zw := (1, 0, 0, 0)
/-- equal up to a nonzero scalar (a global phase and a scale): every 2×2 cross product of entries vanishes -/
def prop (a b : Mat) : Bool :=
  let v := [a.1, a.2.1, a.2.2.1, a.2.2.2]; let w := [b.1, b.2.1, b.2.2.1, b.2.2.2]
  (List.range 4).all (fun i => (List.range 4).all (fun j => zmul (v.getD i zero) (w.getD j zero) == zmul (v.getD j zero) (w.getD i zero)))
  && v.any (· != zero)
def sigma1 : Mat := (one, zero, zero, wpow 2)
def hs : Mat := (one, one, one, zneg one)
def sigma2 : Mat := mmul hs (mmul sigma1 hs)
def ident : Mat := (one, zero, zero, one)

theorem ising_anyon_braids_satisfy_the_braid_relation :
  prop (mmul sigma1 (mmul sigma2 sigma1)) (mmul sigma2 (mmul sigma1 sigma2)) = true := by decide

def addIfNew (acc : List Mat) (m : Mat) : List Mat := if acc.any (fun a => prop a m) then acc else acc ++ [m]
def grow (acc : List Mat) : List Mat := acc.foldl (fun r a => addIfNew (addIfNew r (mmul a sigma1)) (mmul a sigma2)) acc
def braidGroup : Nat → List Mat
  | 0 => [ident]
  | n + 1 => grow (braidGroup n)

/-- THE WHOLE GROUP, NOT A SAMPLE: the words in σ₁, σ₂ fall into exactly 24 classes up to a global phase and close
    there — one more round of multiplication adds none. 24 is the order of the single-qubit Clifford group modulo
    phase (Wikipedia, "Clifford group"), so Ising braiding reaches the Clifford gates and nothing beyond: a finite
    group, not a universal gate set. The last conjunct is the instrument's own control: `prop` refuses σ₁ ∝ 1. -/
theorem ising_anyon_braids_generate_exactly_the_twenty_four_clifford_classes :
  (braidGroup 8).length = 24 ∧ (grow (braidGroup 8)).length = 24 ∧ prop sigma1 ident = false := by decide

-- ── BOSON SAMPLING (§3.5.8): two photons into a 50:50 beam splitter U = [[1, i], [i, 1]]/√2. The coincidence
--    amplitude is the permanent of U. ──────────────────────────────────────────────────────────────────────────

def u00 : Zw := one
def u01 : Zw := wpow 2
def u10 : Zw := wpow 2
def u11 : Zw := one
def perm : Zw := zadd (zmul u00 u11) (zmul u01 u10)

/-- a balanced beam splitter [[1, ω^a], [ω^b, −ω^(a+b)]]/√2, every phase pair on the π/4 grid -/
def splitter (a b : Nat) : Mat := (one, wpow a, wpow b, zneg (wpow (a + b)))
def permOf (u : Mat) : Zw := zadd (zmul u.1 u.2.2.2) (zmul u.2.1 u.2.2.1)
def unitary2 (u : Mat) : Bool :=
  zadd (norm u.1) (norm u.2.1) == (2, 0, 0, 0) && zadd (norm u.2.2.1) (norm u.2.2.2) == (2, 0, 0, 0)
  && zadd (zmul u.1 (zconj u.2.2.1)) (zmul u.2.1 (zconj u.2.2.2)) == zero

/-- Hong–Ou–Mandel at its optimum, for EVERY balanced splitter: all 64 phase pairs are unitary and give a coincidence
    amplitude of exactly 0 — a dip of full depth, which no classical source reaches — and the [[1, i], [i, 1]] splitter
    bunches both ways half the time (×4). -/
theorem every_balanced_beam_splitter_gives_a_full_depth_hong_ou_mandel_dip :
  (List.range 8).all (fun a => (List.range 8).all (fun b => unitary2 (splitter a b) && permOf (splitter a b) == zero)) = true
  ∧ perm = zero ∧ zadd (zadd (norm (zmul u00 u10)) (norm (zmul u00 u10))) (zadd (norm (zmul u01 u11)) (norm (zmul u01 u11))) = (4, 0, 0, 0) := by decide

/-- REFUTED CONTROL: distinguishable (classical) photons coincide half the time, 2 of 4 — the dip is quantum. -/
theorem distinguishable_photons_coincide_half_the_time :
  zadd (norm (zmul u00 u11)) (norm (zmul u01 u10)) = (2, 0, 0, 0) ∧ norm perm = zero := by decide

-- ── ADIABATIC (§3.4.15): H(s) = −(1 − s)X − sZ on one qubit has gap 2√((1 − s)² + s²), and the runtime scales as
--    1/g_min² (Wikipedia, "Adiabatic quantum computation"). At s = t/n, 2((n − t)² + t²) = n² + (2t − n)², so the
--    squared gap is never below half its endpoint value and reaches it when 2t = n: g_min = √2, at s = 1/2. ─────────

/-- For EVERY resolution n and EVERY point t — every rational s = t/n, so the whole schedule, not a sample — the identity
    holds, the squared gap is never below n²/2, and it reaches n²/2 at the midpoint 2t = n. Proved for every value on
    the standard axioms (propext, Quot.sound), not by exhaustion. -/
theorem the_adiabatic_gap_is_smallest_exactly_at_the_midpoint_at_every_resolution :
  ∀ n t : Int, 2 * ((n - t) ^ 2 + t ^ 2) = n ^ 2 + (2 * t - n) ^ 2 ∧ n ^ 2 ≤ 2 * ((n - t) ^ 2 + t ^ 2)
    ∧ 2 * ((2 * t - t) ^ 2 + t ^ 2) = (2 * t) ^ 2 := by
  have gi : ∀ n t : Int, 2 * ((n - t) ^ 2 + t ^ 2) = n ^ 2 + (2 * t - n) ^ 2 := by
    intro n t
    have e1 : (n - t) ^ 2 = n * n - 2 * (n * t) + t * t := by
      simp only [Int.pow_succ, Int.pow_zero, Int.one_mul, Int.sub_mul, Int.mul_sub, Int.mul_comm t n]; omega
    have e2 : (2 * t - n) ^ 2 = 4 * (t * t) - 4 * (n * t) + n * n := by
      have h : 2 * t = t + t := by omega
      rw [h]
      simp only [Int.pow_succ, Int.pow_zero, Int.one_mul, Int.sub_mul, Int.mul_sub, Int.add_mul, Int.mul_add, Int.mul_comm t n]; omega
    have e3 : t ^ 2 = t * t := by simp only [Int.pow_succ, Int.pow_zero, Int.one_mul]
    have e4 : n ^ 2 = n * n := by simp only [Int.pow_succ, Int.pow_zero, Int.one_mul]
    rw [e1, e2, e3, e4]; omega
  intro n t
  refine ⟨gi n t, ?_, ?_⟩
  · rw [gi]
    have h : 0 ≤ (2 * t - n) * (2 * t - n) := by
      rcases Int.le_total 0 (2 * t - n) with p | p
      · exact Int.mul_nonneg p p
      · have q := Int.mul_nonneg (Int.neg_nonneg_of_nonpos p) (Int.neg_nonneg_of_nonpos p)
        rwa [Int.neg_mul_neg] at q
    have e : (2 * t - n) ^ 2 = (2 * t - n) * (2 * t - n) := by simp only [Int.pow_succ, Int.pow_zero, Int.one_mul]
    rw [e]; omega
  · rw [gi]
    have z : 2 * t - 2 * t = 0 := by omega
    rw [z]; simp only [Int.pow_succ, Int.pow_zero, Int.one_mul, Int.mul_zero, Int.add_zero]

-- ── QUANTUM ANNEALER (§3.4.31): the target is a classical Ising minimum. The antiferromagnetic triangle
--    E = s₁s₂ + s₂s₃ + s₁s₃ is frustrated: its minimum −1 is reached by 6 of the 8 configurations. ─────────────────

def triangle : List Int :=
  [1, -1].flatMap (fun a : Int => [1, -1].flatMap (fun b : Int => [1, -1].map (fun c : Int => a * b + b * c + a * c)))

/-- The whole spectrum: six configurations at −1, and only all-up and all-down above them, at +3 (Wikipedia,
    "Geometrical frustration": sixfold degenerate). An annealer that returns −1 has found the optimum; nothing is lower. -/
theorem the_frustrated_triangle_has_a_six_fold_ground_state_at_minus_one :
  triangle.all (fun e => e ≥ -1) = true ∧ (triangle.filter (fun e => e == -1)).length = 6
  ∧ (triangle.filter (fun e => e == 3)).length = 2 ∧ triangle.length = 8 := by decide

end QuantumModels
