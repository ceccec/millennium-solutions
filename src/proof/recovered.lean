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

def units : List Nat := [1, 2, 4, 5, 7, 8]
def triad : List Nat := [3, 6, 9]
def pow9 (b k : Nat) : Nat := (List.range k).foldl (fun a _ => a * b % 9) 1

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
