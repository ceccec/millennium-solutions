import Demand
import Sequences
set_option maxRecDepth 8000000
set_option maxHeartbeats 4000000
-- title: The named theorems people ask for
-- wing: the floor
-- prior_art: named
-- prior_art_domain: elementary number theory, named results
-- prior_art_note: Legendre’s three-square theorem — Adrien-Marie Legendre, 1797; Carmichael numbers — Robert Carmichael, 1910; amicable pairs — known to antiquity
--
-- The third and last tier the search data supports. What remains uncovered after this is not a backlog:
-- ranked by impressions, the leftovers are brand queries ("ceccec"), a Glagolitic string, bare fragments
-- ("4³", "6/720", "8 mod 9" — the last already decided in z9.lean), and the real-analysis cluster that was
-- refused in demand2.lean and stays refused. The demand map is close to exhausted of things a kernel can
-- settle, which is a better place to stop than an arbitrary count would have been.
--
-- Two of these were named by the previous pass as the reasonable next candidates and are here: Havel–Hakimi
-- and Lagrange's four-square theorem. Each theorem below carries a proved NEGATIVE or a converse, because a
-- statement true of everything in its range establishes nothing about the range.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Demand3

open Demand Sequences

-- ── 1 · WILSON'S THEOREM, and its converse, which is the half that makes it a test. (p−1)! ≡ −1 mod p for
--        every prime, written as ≡ p−1 since Nat has no negatives; and for every composite above four,
--        (n−1)! ≡ 0. The two together are a primality CRITERION rather than a property of primes. ──
theorem wilsons_theorem_and_its_converse :
  ((List.range' 2 18).all (fun p => ¬ isPrime p || Sequences.fact (p - 1) % p == p - 1)) ∧
  ((List.range' 5 15).all (fun n => isPrime n || Sequences.fact (n - 1) % n == 0)) := by decide

-- ── 2 · LAGRANGE'S FOUR-SQUARE THEOREM over the range the kernel can exhaust: every natural number is a sum
--        of four squares. The negative is what gives it content — THREE squares do not suffice, and 7 is the
--        first witness, which is exactly the excluded form Legendre's theorem describes in demand.lean. ──
def isSumOfFour (n : Nat) : Bool :=
  (List.range 9).any (fun a => (List.range 9).any (fun b => (List.range 9).any (fun c =>
    (List.range 9).any (fun d => a*a + b*b + c*c + d*d == n))))
def isSumOfThree (n : Nat) : Bool :=
  (List.range 9).any (fun a => (List.range 9).any (fun b => (List.range 9).any (fun c =>
    a*a + b*b + c*c == n)))

theorem every_number_is_a_sum_of_four_squares :
  (List.range 60).all isSumOfFour ∧ isSumOfThree 7 = false ∧ isSumOfFour 7 = true := by decide

-- ── 3 · THE CANTOR PAIRING FUNCTION is a bijection ℕ² → ℕ. Injectivity is checked over an 8×8 block by
--        counting distinct images, and surjectivity onto an initial segment by checking that the block's
--        images cover 0..35 exactly — a pairing that is merely injective would leave holes. ──
def cantor (a b : Nat) : Nat := (a + b) * (a + b + 1) / 2 + b
def block : List Nat := (List.range 8).flatMap (fun a => (List.range 8).map (fun b => cantor a b))

theorem the_cantor_pairing_is_injective_and_covers_an_initial_segment :
  block.eraseDups.length = 64 ∧ ((List.range 36).all (fun n => block.contains n)) := by decide

-- ── 4 · REPUNIT DIVISIBILITY: 3 divides R_n exactly when 3 divides n, and 7 divides R_n exactly when 6
--        divides n. Both stated as iff over the range, so the pattern is decided in both directions rather
--        than sampled where it happens to hold. ──
def repunit : Nat → Nat
  | 0 => 0
  | Nat.succ n => 10 * repunit n + 1

theorem repunit_divisibility_by_three_and_seven :
  ((List.range' 1 18).all (fun n => (repunit n % 3 == 0) == (n % 3 == 0))) ∧
  ((List.range' 1 18).all (fun n => (repunit n % 7 == 0) == (n % 6 == 0))) := by decide

-- ── 5 · THE EULER CHARACTERISTIC of a closed orientable surface of genus g is 2 − 2g. Written 2 + 2·0 − 2g
--        would truncate in ℕ, so the identity is stated as χ + 2g = 2 with χ carried as its own value —
--        the same ℕ-subtraction trap that made an earlier draft "prove" 4 = 2. ──
def chi (g : Nat) : Int := 2 - 2 * (g : Int)

theorem the_euler_characteristic_of_a_genus_g_surface :
  ((List.range 12).all (fun g => chi g + 2 * (g : Int) == 2)) ∧ chi 0 = 2 ∧ chi 1 = 0 ∧ chi 2 = -2 := by decide

-- ── 6 · A NUMBER HAS AN ODD NUMBER OF DIVISORS EXACTLY WHEN IT IS A PERFECT SQUARE — the divisors pair off
--        as d with n/d, and only a square has a divisor paired with itself. Decided as an iff to 120. ──
def isSquare (n : Nat) : Bool := (List.range 12).any (fun k => k * k == n)

theorem odd_divisor_count_iff_perfect_square :
  (List.range' 1 120).all (fun n => ((divisors n).length % 2 == 1) == isSquare n) := by decide

-- ── 7 · HAVEL–HAKIMI, at the sizes the kernel can hold. A degree sequence is graphical exactly when the
--        reduction — remove the largest degree d, subtract one from the next d entries, re-sort — reaches
--        all zeros. The sort is a structural insertion sort: Nat's own mergeSort is well-founded and would
--        cost this file its axiom-free status. Stated with both a graphical sequence and a non-graphical one,
--        since a test that only ever says yes is not a test. ──
def ins (x : Nat) : List Nat → List Nat
  | [] => [x]
  | y :: ys => if x ≥ y then x :: y :: ys else y :: ins x ys
def sortDesc : List Nat → List Nat
  | [] => []
  | x :: xs => ins x (sortDesc xs)
-- FEASIBILITY IS CHECKED BEFORE SUBTRACTING, and that is the whole correctness of this definition in ℕ.
-- The reduction subtracts one from the next d entries; if any of them is already 0 the real algorithm goes
-- negative and reports NOT graphical, but ℕ truncates 0 − 1 to 0, so the subtraction silently succeeds and
-- every sequence comes out graphical. [3,3,1,1] is the witness: it is not graphical, and the truncating
-- version proved it was. The kernel refuted the theorem, in the file where I had just written a comment
-- warning about this exact trap two theorems earlier.
def feasible (d : Nat) (rest : List Nat) : Bool :=
  rest.length ≥ d && (rest.take d).all (fun x => x ≥ 1)
def step : List Nat → List Nat
  | [] => []
  | d :: rest => sortDesc ((rest.take d).map (fun x => x - 1) ++ rest.drop d)
def hh : Nat → List Nat → Bool
  | 0, l => l.all (fun x => x == 0)
  | Nat.succ f, l =>
      let s := sortDesc l
      if s.all (fun x => x == 0) then true
      else match s with
        | [] => true
        | d :: rest => if feasible d rest then hh f (step s) else false

theorem havel_hakimi_decides_graphical_sequences :
  hh 12 [3, 3, 3, 3] = true ∧ hh 12 [2, 2, 2] = true ∧
  hh 12 [3, 3, 1, 1] = false ∧ hh 12 [4, 1, 1, 1, 1] = true ∧ hh 12 [5, 1, 1, 1, 1] = false := by decide

end Demand3
