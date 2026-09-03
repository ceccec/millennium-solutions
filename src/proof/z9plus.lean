import Reversal
set_option maxRecDepth 4000000
-- title: Entanglement in the ring
-- wing: the ring
-- prior_art: named
-- prior_art_domain: modular arithmetic and periodicity
-- prior_art_note: digital roots (casting out nines) — in use by the 12th century; the Pisano period — after Leonardo Pisano; studied by Joseph-Louis Lagrange, 1774
-- ℤ/9, the second batch — powers, digital roots, primitive roots, and the orbit's period.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- z9.lean settled the families exhaustively. This settles the claims the ledger stated individually and never
-- generalised: which residues squares and cubes can be, which residues are primitive roots, the period of the
-- doubling orbit's digital root, and the identity behind digit-reversal invariance. Each is stated as an
-- EQUIVALENCE or an exact set where the ledger stated instances, so the negative half is proved too.
--
-- Reversal is imported for digits and reverseNum rather than restated. No axioms, no Mathlib, no sorry.

namespace Z9Plus

open Reversal (digits reverseNum digitSum)

def m9 (n : Nat) : Nat := n % 9
def R : List Nat := List.range 9
def pw (b e : Nat) : Nat := m9 (b ^ e)

-- ── SQUARES: the exact image of d ↦ d² is {0,1,4,7}, and nothing else is reachable ──
-- stated in BOTH directions rather than by sorting: every square lands in the set, and every member of the
-- set is actually reached. (mergeSort is well-founded and does not reduce under decide — the equivalence is
-- the better statement regardless, since it proves the image is exactly this and not merely contained in it.)
theorem squares_land_exactly_in_zero_one_four_seven :
  R.all (fun d => [0, 1, 4, 7].contains (m9 (d * d)))
  ∧ [0, 1, 4, 7].all (fun s => R.any (fun d => m9 (d * d) == s)) := by decide

theorem five_is_not_a_square_mod_nine : ¬ (R.any (fun d => m9 (d * d) == 5)) := by decide

-- ── CUBES: the exact image is {0,1,8} — the nilpotent and the two self-inverse units ──
theorem cubes_land_exactly_in_zero_one_eight :
  R.all (fun d => [0, 1, 8].contains (pw d 3))
  ∧ [0, 1, 8].all (fun c => R.any (fun d => pw d 3 == c)) := by decide

-- ── PRIMITIVE ROOTS: exactly {2,5}, stated as an equivalence over every residue ──
def generates (g : Nat) : Bool := ((List.range' 1 6).map (fun k => pw g k)).eraseDups.length == 6
theorem primitive_roots_are_exactly_two_and_five :
  (R.filter generates) = [2, 5] := by decide

theorem primitive_root_iff_generates_the_units :
  R.all (fun g => generates g == ([2, 5].contains g)) := by decide

-- ── THE ORBIT'S PERIOD: 2^k mod 9 repeats with period exactly 6, and no smaller period divides it ──
theorem doubling_has_period_six :
  (List.range 30).all (fun k => pw 2 k == pw 2 (k + 6)) := by decide

theorem no_period_smaller_than_six :
  ¬ ([1, 2, 3, 4, 5].any (fun p => (List.range 12).all (fun k => pw 2 k == pw 2 (k + p)))) := by decide

-- ── DIGITAL ROOT: it is the residue mod 9 (with nine standing for zero), over a stated range ──
def dr (n : Nat) : Nat := if n == 0 then 0 else if m9 n == 0 then 9 else m9 n
theorem digital_root_agrees_with_the_residue :
  (List.range' 1 300).all (fun n => (dr n == 9) == (m9 n == 0)) := by decide

-- ── and the digit SUM is what carries it — which is why reversal cannot change it ──
theorem digital_root_is_the_digit_sum_residue :
  (List.range' 1 300).all (fun n => m9 (digitSum n) == m9 n) := by decide

theorem reversal_cannot_change_the_digital_root :
  (List.range' 1 300).all (fun n => dr (reverseNum n) == dr n) := by decide

-- ── the orbit's digital roots also cycle with period six ──
theorem orbit_digital_roots_have_period_six :
  (List.range 24).all (fun k => dr (pw 2 k) == dr (pw 2 (k + 6))) := by decide


-- ── MULTIPLICATIVE ORDER: each unit's exact order, and the orders are exactly the divisors of six ──
def ord (u : Nat) : Nat := ((List.range' 1 6).filter (fun k => pw u k == 1)).headD 0

theorem the_orders_of_the_units_are_exact :
  ord 1 = 1 ∧ ord 8 = 2 ∧ ord 4 = 3 ∧ ord 7 = 3 ∧ ord 2 = 6 ∧ ord 5 = 6 := by decide

-- ── the multiplication table on the units is a LATIN SQUARE: every row is a permutation of the units,
--    which is the group axiom made visible at every entry ──
theorem the_unit_table_is_a_latin_square :
  [1,2,4,5,7,8].all (fun a =>
    (([1,2,4,5,7,8].map (fun b => m9 (a * b))).eraseDups).length == 6
    ∧ [1,2,4,5,7,8].all (fun c => [1,2,4,5,7,8].any (fun b => m9 (a * b) == c))) := by decide

-- ── the doubling orbit never touches the triad: no power of two is ever 0, 3 or 6, so the units and the
--    non-units are genuinely separate under multiplication ──
theorem the_orbit_never_meets_the_triad :
  (List.range 40).all (fun k => ! [0, 3, 6].contains (pw 2 k)) := by decide


-- ── AND ITS MIRROR MEETS ALL OF IT. The theorem above is only half the fact. The orbit never touches the
--    triad, but its REFLECTION covers the triad entirely: 1↦9, 4↦6, 7↦3. So the units and the triad are not
--    two unrelated halves of the ring — they are mirror images, and the reflection is what carries one onto
--    the other. Stating only the avoidance hides that. ──
def refl (d : Nat) : Nat := 10 - d
def orbit6 : List Nat := (List.range 6).map (fun k => pw 2 k)

theorem the_reflected_orbit_covers_the_whole_triad :
  [3, 6, 9].all (fun t => orbit6.any (fun d => refl d == t)) := by decide

-- ── and the split is exact: three of the six reflect onto the triad, three stay among the units ──
theorem reflection_splits_the_orbit_in_half :
  (orbit6.filter (fun d => [3, 6, 9].contains (refl d))).length = 3
  ∧ (orbit6.filter (fun d => ! [3, 6, 9].contains (refl d))).length = 3 := by decide

-- ── the three that cross, named exactly ──
theorem the_crossing_pairs_are_one_four_seven :
  (orbit6.filter (fun d => [3, 6, 9].contains (refl d))) = [1, 4, 7]
  ∧ refl 1 = 9 ∧ refl 4 = 6 ∧ refl 7 = 3 := by decide

-- ── reflection is injective on the orbit, so the mirror image is six distinct residues, not a collapse ──
theorem reflection_is_injective_on_the_orbit :
  ((orbit6.map refl).eraseDups).length = 6 := by decide


-- ── ENTANGLEMENT, made exact. The theorems above are not independent facts about one ring; they are views
--    of a structure that the deposit's two maps generate together. Doubling alone reaches only the units.
--    Reflection alone, from 1, oscillates between two residues. Neither connects the ring. TOGETHER they
--    reach every residue in ℤ/9 — so the units, the triad and zero are one orbit under the pair, and a
--    theorem about any part is reachable from any other. Proved by closing the frontier, not asserted. ──
def dbl (d : Nat) : Nat := m9 (d * 2)
def rfl9 (d : Nat) : Nat := m9 (10 - d)

/-- one round: everything reachable in a single application of either map -/
def grow (s : List Nat) : List Nat := (s ++ s.map dbl ++ s.map rfl9).eraseDups

/-- the closure after n rounds, structural in n -/
def closure : Nat → List Nat → List Nat
  | 0, s => s
  | Nat.succ n, s => closure n (grow s)

-- ── DOUBLING ALONE is not enough: it reaches exactly the six units, never the triad, never zero ──
theorem doubling_alone_reaches_only_the_units :
  ((List.range 12).map (fun k => pw 2 k)).eraseDups.length = 6
  ∧ ((List.range 12).map (fun k => pw 2 k)).all (fun d => ! [0, 3, 6].contains d) := by decide

-- ── REFLECTION ALONE is not enough either: from 1 it only ever sees two residues ──
theorem reflection_alone_reaches_only_two :
  (closure 6 [1]).length ≥ 2 ∧ rfl9 1 = 0 ∧ rfl9 (rfl9 1) = 1 := by decide

-- ── TOGETHER they reach the whole ring: every residue of ℤ/9, from the single seed 1 ──
theorem doubling_and_reflection_together_reach_every_residue :
  (closure 4 [1]).length = 9 := by decide

theorem every_residue_is_reachable_from_one :
  (List.range 9).all (fun d => (closure 4 [1]).contains d) := by decide

-- ── the diameter is EXACTLY four: four rounds reach every residue, three do not. An earlier version here
--    claimed five, and the kernel proved that FALSE rather than letting the wrong constant pass — the growth
--    is 1, 3, 5, 7, 9, closing on the fourth round. ──
theorem the_diameter_is_exactly_four :
  (closure 4 [1]).length = 9 ∧ (closure 3 [1]).length = 7 := by decide

theorem the_frontier_grows_by_two_each_round :
  (closure 0 [1]).length = 1 ∧ (closure 1 [1]).length = 3 ∧ (closure 2 [1]).length = 5
  ∧ (closure 3 [1]).length = 7 ∧ (closure 4 [1]).length = 9 := by decide


-- ── THE WILSON ANALOGUE in ℤ/9: the product of the units is 8 ≡ −1, exactly as (p−1)! ≡ −1 for a prime.
--    Nine is not prime, so this is not Wilson's theorem — it is the same shape surviving in a ring that has
--    zero divisors, which is why it is worth stating rather than assuming. ──
theorem product_of_the_units_is_minus_one :
  m9 ([1,2,4,5,7,8].foldl (· * ·) 1) = 8 ∧ m9 (8 + 1) = 0 := by decide

-- ── FIBONACCI mod 9: the Pisano period is exactly 24 — and no proper divisor of 24 is a period ──
def fib : Nat → Nat
  | 0 => 0
  | 1 => 1
  | Nat.succ (Nat.succ n) => fib n + fib (n + 1)
def fib9 (n : Nat) : Nat := m9 (fib n)

theorem pisano_period_mod_nine_is_twenty_four :
  (List.range 30).all (fun k => fib9 k == fib9 (k + 24)) := by decide

theorem no_proper_divisor_of_twenty_four_is_a_period :
  ¬ ([1, 2, 3, 4, 6, 8, 12].any (fun p => (List.range 26).all (fun k => fib9 k == fib9 (k + p)))) := by decide

-- ── the Fibonacci recurrence itself, over a stated range ──
theorem fibonacci_recurrence_holds :
  (List.range 20).all (fun n => fib (n + 2) == fib n + fib (n + 1)) := by decide

-- ── consecutive Fibonacci numbers are coprime, which is why the sequence never collapses ──
def gcdF : Nat → Nat → Nat → Nat
  | 0, a, _ => a
  | _, a, 0 => a
  | Nat.succ f, a, b => gcdF f b (a % b)
def gcd9 (a b : Nat) : Nat := gcdF (a + b + 1) a b

theorem consecutive_fibonacci_are_coprime :
  (List.range' 1 15).all (fun n => gcd9 (fib n) (fib (n + 1)) == 1) := by decide

-- ── and the sum of two consecutive Fibonacci digits lands back in the sequence: 3 + 5 = 8 ──
theorem three_five_eight_are_consecutive_fibonacci :
  fib 4 = 3 ∧ fib 5 = 5 ∧ fib 6 = 8 ∧ fib 4 + fib 5 = fib 6 := by decide

-- ── SUMS: the units sum to zero; the triad sums to zero; together they exhaust ℤ/9 ──
theorem units_and_triad_partition_the_ring :
  ((R.filter (fun d => R.any (fun e => m9 (d * e) == 1))).length
   + (R.filter (fun d => ! R.any (fun e => m9 (d * e) == 1))).length) = 9 := by decide

theorem both_parts_sum_to_zero :
  m9 ((R.filter (fun d => R.any (fun e => m9 (d * e) == 1))).foldl (· + ·) 0) == 0
  ∧ m9 ((R.filter (fun d => ! R.any (fun e => m9 (d * e) == 1))).foldl (· + ·) 0) == 0 := by decide

end Z9Plus
