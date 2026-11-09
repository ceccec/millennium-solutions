import Z9
set_option maxRecDepth 8000000
-- title: Recovered — claims that computed and were withdrawn for want of a proof
-- wing: the returned
-- prior_art: named
-- prior_art_domain: elementary number theory — the unit group of ℤ/9
-- prior_art_note: every fact here is standard: the units of ℤ/9 are {1,2,4,5,7,8}, their product is −1
--   (Wilson), 2 generates them with order 6, and the Pisano period of Fibonacci mod 9 is 24. Textbook
--   material, credited. What is NOT prior art is that these particular statements sat WITHDRAWN in this
--   deposit's ledger, each recorded as "not backed by a Lean proof. Its evidence is a TypeScript test",
--   while every one is decidable in a line.
-- prior_art_search: literature search performed 2026-09-05, terms "units and non-units of Z/9 multiplicative
--   inverses group of units modulo 9"; prior art found and credited.
--
-- WITHDRAWAL WAS NEVER THE ONLY OPTION. Each theorem below returns one claim to the record. The evidence
-- that existed was a TypeScript run — a computation that agreed once on one machine. The kernel walks the
-- whole stated domain. That was the gap, and closing it is arithmetic.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Recovered

-- DERIVED, NOT RESTATED. This read `[1, 2, 4, 5, 7, 8]` — the units of ℤ/9, written out by hand beside
-- z9.lean, which DERIVES the same list as `(List.range B).filter isUnit`. Two definitions of one set, and
-- the hand-written one cannot be wrong in a way anything notices: it is not checked against the derivation,
-- it IS a second derivation. scripts/hardcode-gate.ts exists to catch exactly this and excludes .lean on
-- the ground that "the .lean proofs state these sets on purpose, being the source" — true of z9.lean, which
-- computes it, and false of this file, which copied it.
def units : List Nat := Z9.units
def triad : List Nat := [3, 6, 9]
-- THE SAME DEFECT AGAIN, ONE LINE DOWN. z9.lean defines pow9 as `m9 (b ^ e)`; this folded a multiplication
-- k times. Two algorithms for one function, neither checked against the other, and a theorem here proving
-- something about "pow9" proves it about THIS one only. Derived from the same place the units now come from.
def pow9 (b k : Nat) : Nat := Z9.pow9 b k

theorem units_sum_zero : (units.foldl (· + ·) 0) = 27 ∧ (units.foldl (· + ·) 0) % 9 = 0 := by decide

theorem self_inverse_1_8 :
  ((List.range 9).filter (fun d => d * d % 9 == 1)) = [1, 8] := by decide

theorem triad_nilpotent : triad.all (fun d => d * d % 9 == 0) := by decide

theorem triad_sum_zero : (triad.foldl (· + ·) 0) = 18 ∧ (triad.foldl (· + ·) 0) % 9 = 0 := by decide

theorem units_product_neg1 : (units.foldl (· * ·) 1) % 9 = 8 := by decide

theorem order_of_2_is_6 :
  pow9 2 6 = 1 ∧ ((List.range' 1 5).all (fun k => pow9 2 k != 1)) := by decide

theorem sum_1_to_9_zero :
  ((List.range' 1 9).foldl (· + ·) 0) = 45 ∧ ((List.range' 1 9).foldl (· + ·) 0) % 9 = 0 := by decide

theorem doubling_digitroot_period6 :
  ((List.range 6).map (fun k => pow9 2 k)) = [1, 2, 4, 8, 7, 5] ∧ pow9 2 6 = pow9 2 0 := by decide

theorem unit_exp_id_k6 : units.all (fun u => pow9 u 6 == 1) := by decide
theorem unit_exp_id_k12 : units.all (fun u => pow9 u 12 == 1) := by decide
theorem unit_exp_id_k18 : units.all (fun u => pow9 u 18 == 1) := by decide

theorem powperm_k5 : (units.map (fun u => pow9 u 5)).eraseDups.length = 6 := by decide
theorem powperm_k7 : (units.map (fun u => pow9 u 7)).eraseDups.length = 6 := by decide

theorem qr_u1 : (List.range 9).any (fun d => d * d % 9 == 1) := by decide
theorem qr_u4 : (List.range 9).any (fun d => d * d % 9 == 4) := by decide

end Recovered
