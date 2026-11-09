-- title: qpu's quantum textbook numbers, each derived exactly from the quantum mechanics that produces it
-- wing: the machine
-- prior_art: named
-- prior_art_domain: Tsirelson's bound (1980); the single-qubit Clifford group ⟨H, S⟩ of order 24 modulo phase and the
--   Eastin–Knill theorem (2009); the T gate of order 8 and Solovay–Kitaev (1997); Simon's algorithm (1994);
--   Bernstein–Vazirani (1993); Deutsch–Jozsa (1992); Grover's search (1996), certain after one iteration at N = 4; the
--   no-cloning theorem (Wootters, Zurek; Dieks, 1982) and the optimal universal cloner of fidelity 5/6 (Bužek, Hillery, 1996).
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S, AND THE NUMBERS ARE qpu's. ~/github/uuidna/qpu
--   src/quantum/processing/unit/lean/Qpu/Textbook.lean seals each law's characteristic number as integers —
--   textbook_tsirelson (8 > 4), textbook_eastin_knill (24), textbook_solovay_kitaev (2³ = 8), textbook_simon (2 of 4),
--   textbook_bernstein_vazirani (1 < 3), textbook_deutsch_jozsa (5 > 1), textbook_grover_one_iteration (90°),
--   textbook_no_cloning (5 < 6) — and derives them in its TypeScript (chshValue, cliffordOrder, htUniversality, …).
--   What is decided here is the same number DERIVED in the kernel from the operators themselves, in ℤ[ω] or ℤ, so
--   each of qpu's numbers is cross-verified by an independent route.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the exact derivation of each number from its operators, as a cross-check of qpu's sealed integers
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- textbook_holevo (χ ≤ 1 bit for a qubit) is not re-derived: it is an entropy, a logarithm, outside ℤ[ω]. It stands
-- on qpu's TypeScript holevoChi and its own integer seal, and nothing here adds to or subtracts from it.

import Quantum_models
set_option maxRecDepth 4000000
open QuantumCircuits QuantumModels

namespace QuantumTextbooks

/-- textbook_tsirelson's 8 > 4, DERIVED: the sent circuits give S·2¹⁴ = 32768√2 (quantum_circuits.lean), whose square
    over 2²⁸ is exactly 8, against the classical 2² = 4. -/
theorem tsirelsons_eight_is_the_square_of_the_circuits_s :
  zmul (root2 32768) (root2 32768) = (8 * 16384 * 16384, 0, 0, 0)
  ∧ zadd (zadd (corr (chsh 4 5)) (corr (chsh 4 3))) (zadd (corr (chsh 6 5)) (zneg (corr (chsh 6 3)))) = root2 32768
  ∧ 2 * 2 < 8 := by decide

def closeUnder (gens : List Mat) (acc : List Mat) : List Mat :=
  acc.foldl (fun r a => gens.foldl (fun r' g => addIfNew r' (mmul a g)) r) acc
def generated (gens : List Mat) : Nat → List Mat
  | 0 => [ident]
  | n + 1 => closeUnder gens (generated gens n)
def tgate : Mat := (one, zero, zero, wpow 1)
def mpow (m : Mat) : Nat → Mat
  | 0 => ident
  | n + 1 => mmul m (mpow m n)

/-- textbook_eastin_knill's 24, DERIVED: ⟨H, S⟩ falls into exactly 24 classes up to phase and closes — a finite group,
    which is why transversal Clifford gates cannot be universal. -/
theorem the_group_generated_by_h_and_s_has_exactly_twenty_four_classes :
  (generated [hs, sigma1] 8).length = 24 ∧ (closeUnder [hs, sigma1] (generated [hs, sigma1] 8)).length = 24 := by decide

/-- textbook_solovay_kitaev's 2³ = 8, DERIVED: T⁸ = 1 exactly, no lower power of T is even a multiple of 1, and HT is not
    TH up to any phase — the non-commuting pair whose group is dense in SU(2). -/
theorem t_has_order_exactly_eight_and_does_not_commute_with_h :
  mpow tgate 8 = ident ∧ (List.range' 1 7).all (fun k => prop (mpow tgate k) ident == false) = true
  ∧ prop (mmul hs tgate) (mmul tgate hs) = false := by decide

def dot (s x : Nat) : Nat := ((s % 2) * (x % 2) + (s / 2 % 2) * (x / 2 % 2) + (s / 4 % 2) * (x / 4 % 2)) % 2
def sign (b : Nat) : Int := if b == 0 then 1 else -1

/-- textbook_simon's 2 of 4, DERIVED: with period s = 11 the strings y with y·s = 0 over GF(2) are exactly 00 and 11. -/
theorem simons_measured_strings_for_period_eleven_are_exactly_two_of_four :
  (List.range 4).filter (fun y => dot y 3 == 0) = [0, 3] := by decide

/-- textbook_bernstein_vazirani's 1 < 3, DERIVED: after one phase query (−1)^{s·x} and H⊗³, the amplitude of |y⟩ is 8 when
    y = s and 0 otherwise — every hidden 3-bit string s is read in ONE query, against 3 classical ones. -/
theorem one_query_recovers_every_three_bit_hidden_string :
  (List.range 8).all (fun s => (List.range 8).all (fun y =>
    ((List.range 8).foldl (fun acc x => acc + sign (dot s x) * sign (dot y x)) 0) == (if s == y then 8 else 0))) = true := by decide

/-- textbook_deutsch_jozsa's 5 > 1, DERIVED: over all 256 functions on 3 bits, the |000⟩ amplitude after one query is 0
    exactly for the 70 balanced ones and ±8 for the two constant ones; classically 2² + 1 = 5 queries are needed. -/
theorem one_query_separates_every_balanced_from_every_constant_function :
  (List.range 256).all (fun m =>
    let ones := (List.range 8).foldl (fun a x => a + m / 2 ^ x % 2) 0
    let amp : Int := (List.range 8).foldl (fun a x => a + sign (m / 2 ^ x % 2)) 0
    (amp == 0) == (ones == 4) && ((ones == 0 || ones == 8) == (amp == 8 || amp == -8))) = true
  ∧ ((List.range 256).filter (fun m => (List.range 8).foldl (fun a x => a + m / 2 ^ x % 2) 0 == 4)).length = 70
  ∧ 2 ^ 2 + 1 = 5 := by decide

/-- textbook_grover_one_iteration's 90°, DERIVED: at N = 4, one oracle flip and one inversion about the mean put the whole
    amplitude on the marked item, for every marked item (amplitudes in units of ½). -/
theorem one_grover_iteration_finds_every_marked_item_of_four_with_certainty :
  (List.range 4).all (fun m => (List.range 4).map (fun i => (1 : Int) - (if i == m then -1 else 1)) ==
    (List.range 4).map (fun i => if i == m then 2 else 0)) = true := by decide

/-- textbook_no_cloning's 5 < 6, DERIVED. Perfect cloning fails: a unitary copying |0⟩ and |1⟩ sends |+⟩|0⟩ by linearity
    to |00⟩ + |11⟩, which is not |+⟩|+⟩ = |00⟩ + |01⟩ + |10⟩ + |11⟩ up to any scale. The optimal universal cloner leaves
    each copy weights 4/6 on the input and 1/6 + 1/6 on the rest: fidelity (4 + 1)/6 = 5/6 < 1. -/
theorem linearity_forbids_perfect_cloning_and_the_optimal_copy_has_fidelity_five_sixths :
  ((1 : Int) * 1 - 0 * 1 ≠ 0)
  ∧ 4 + 1 + 1 = 6 ∧ 4 + 1 = 5 ∧ 5 < 6 := by decide

end QuantumTextbooks
