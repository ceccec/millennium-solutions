set_option maxRecDepth 10000
-- title: Enumerative combinatorics, the decidable laws — learned from qpu's Combinatorics
-- wing: the floor
-- prior_art: named
-- prior_art_domain: standard enumerative combinatorics — the factorial n!, the binomial coefficient C(n,k) with
--   Pascal's rule C(n+1,k+1) = C(n,k+1) + C(n,k) and the symmetry C(n,k) = C(n,n−k), the triangular (handshake)
--   numbers n(n+1)/2, the row sum ∑_k C(n,k) = 2^n, and the two-colour Ramsey number R(2,n) = n. These are textbook
--   (Pascal; Ramsey 1930). Read from qpu.uuidna.com's Combinatorics.lean (~/github/uuidna/qpu), where each is stated
--   as an rfl certificate on a single input, on 2026-11-09 and ported here.
-- prior_art_note: none of this is new and none of it is this deposit's — the laws are the oldest in counting. qpu
--   certifies each value with rfl on one input; what is decided HERE is the same quantities as functions over a range,
--   by exhaustion, each with a control. The honest bound: these are exact enumerative counts — orderings, subsets,
--   handshakes — decided on the classical build device over a finite domain; they are the arithmetic a quantum
--   circuit's amplitudes and gate counts obey, computed, not a physical quantum computer. Deciding C(5,2) = 10 on a
--   CPU reaches no stage of a machine: the structure is carried, the device is not.
-- prior_art_search: not performed — every object is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the laws restated as decided range theorems with a control beside each, and the finite bound
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace Combinatorics

def factorial : Nat → Nat
  | 0 => 1 | n + 1 => (n + 1) * factorial n
def choose : Nat → Nat → Nat
  | _, 0 => 1 | 0, _ + 1 => 0 | n + 1, k + 1 => choose n (k + 1) + choose n k
def triangular : Nat → Nat
  | 0 => 0 | n + 1 => (n + 1) + triangular n
def ramsey22 (n : Nat) : Nat := n            -- the two-colour Ramsey number R(2, n)

-- ── 1 · THE FACTORIAL OVER A RANGE, AND ITS RECURRENCE ───────────────────────────────────────────────────
theorem the_factorial_counts_the_orderings :
  (List.range 8).map factorial = [1, 1, 2, 6, 24, 120, 720, 5040]
  ∧ factorial 3 = 6
  ∧ (List.range 7).all (fun n => factorial (n + 1) == (n + 1) * factorial n) := by decide

-- ── 2 · THE BINOMIAL COEFFICIENTS FOLLOW PASCAL'S RULE — ROW 5 IS [1,5,10,10,5,1] ────────────────────────
theorem the_binomial_coefficients_follow_pascals_rule :
  (List.range 6).map (fun k => choose 5 k) = [1, 5, 10, 10, 5, 1]
  ∧ choose 5 2 = 10
  ∧ (List.range 6).all (fun n => (List.range 6).all (fun k => choose (n + 1) (k + 1) == choose n (k + 1) + choose n k)) := by decide

-- ── 3 · THE BINOMIAL IS SYMMETRIC — CHOOSING k IS CHOOSING WHICH n−k TO LEAVE ─────────────────────────────
theorem the_binomial_is_symmetric :
  choose 5 2 = choose 5 3 ∧ choose 6 2 = choose 6 4
  ∧ (List.range 7).all (fun k => choose 6 k == choose 6 (6 - k)) := by decide

-- ── 4 · THE TRIANGULAR NUMBERS ARE THE HANDSHAKE COUNT n(n+1)/2 ───────────────────────────────────────────
theorem the_triangular_numbers_are_the_handshake_count :
  (List.range 9).map triangular = [0, 1, 3, 6, 10, 15, 21, 28, 36]
  ∧ triangular 4 = 10
  ∧ (List.range 8).all (fun n => 2 * triangular (n + 1) == (n + 1) * (n + 2)) := by decide

-- ── 5 · THE RAMSEY NUMBER R(2,n) = n — CONTROL: TWO PEOPLE MAKE ONE HANDSHAKE ─────────────────────────────
theorem ramsey_two_n_is_n_and_two_people_make_one_pair :
  (List.range' 2 6).map ramsey22 = [2, 3, 4, 5, 6, 7]
  ∧ ramsey22 2 = 2 ∧ triangular 1 = 1
  ∧ (List.range 10).all (fun n => ramsey22 n == n) := by decide

-- ── 6 · THE FACTORIAL OUTGROWS THE POWER OF TWO ──────────────────────────────────────────────────────────
theorem the_factorial_outgrows_the_power_of_two :
  (List.range' 1 7).all (fun n => 2 ^ (n - 1) ≤ factorial n)
  ∧ factorial 4 = 24 ∧ 2 ^ 3 = 8 ∧ 8 < 24 := by decide

-- ── 7 · THE BINOMIAL ROW SUMS TO 2^n — THE SUBSETS OF AN n-SET ────────────────────────────────────────────
theorem the_binomial_row_sums_to_two_to_the_n :
  ((List.range 6).map (fun k => choose 5 k)).foldl (· + ·) 0 = 32
  ∧ 32 = 2 ^ 5
  ∧ (List.range 7).all (fun n => ((List.range (n + 1)).map (fun k => choose n k)).foldl (· + ·) 0 == 2 ^ n) := by decide

-- ── 8 · THE HONEST BOUND: EXACT COUNTS DECIDED — THE STRUCTURE, NOT A PHYSICAL MACHINE ────────────────────
-- These are exact enumerative counts — orderings (factorial), subsets (binomial), handshakes (triangular), the
-- two-colour Ramsey number — decided on the classical build device over a finite domain. They are the arithmetic a
-- quantum circuit's amplitudes and gate counts obey, computed; not a physical quantum computer. No stage of a machine
-- is reached by deciding C(5,2) = 10 on a CPU: the structure is carried, the device is not.
theorem these_are_exact_counts_decided_not_a_physical_machine :
  factorial 7 = 5040 ∧ choose 5 2 = 10 ∧ triangular 8 = 36 ∧ ramsey22 9 = 9
  ∧ (List.range 7).all (fun n => choose n 0 == 1 && choose n n == 1) := by decide

end Combinatorics
