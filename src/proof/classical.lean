import Families
-- title: Classical arithmetic
-- wing: the ring
-- prior_art: named
-- prior_art_domain: elementary number theory and combinatorial game theory
-- prior_art_note: Euclid (Elements IX.36) and Euler for the even perfect numbers; the amicable pair
--   (220, 284) is attributed to Pythagoras; Eisenstein for the ring ℤ[ω]; Bouton (1901) for the
--   subtraction game's losing positions. None of these results is this deposit's. What is this deposit's is
--   the DECISION of each over a stated finite range, axiom-free, and the honest record of where the range
--   stops short of what the older claim asserted.
-- prior_art_search: the results are named in every undergraduate text; no search was needed to find them.
-- prior_art_pool: named
-- Classical arithmetic, decided — the claims the ledger held in TypeScript, given a kernel.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- This file exists because families.lean had grown to about 140 seconds of kernel time and every theorem
-- added to it lengthened the tree's critical path. A separate file compiles alongside the others rather
-- than behind them, and the helpers it needs — gcd', isPrime, unitsMod, ordMod — are imported rather than
-- copied, because a second copy of gcdFuel would be a second thing to keep true.

namespace Classical

open Families

/-- the sum of the proper divisors — every divisor below n itself -/
def properDivisorSum (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0

-- ── EUCLID'S FORM. 2^(p−1)(2^p − 1) is perfect whenever 2^p − 1 is prime ─────────────────────────────────
--    Stated with its hypothesis attached rather than as a list of four numbers that happen to be perfect.
--    The range stops at p = 7 for a reason worth stating: the next case, p = 13, is 33 550 336, and the
--    divisor sum walks every number below it. That is a longer computation, not a harder theorem.
set_option maxRecDepth 2000000 in
theorem euclids_form_is_perfect_at_every_mersenne_prime_to_seven :
  [2, 3, 5, 7].all (fun p =>
    !(isPrime (2 ^ p - 1)) || properDivisorSum (2 ^ (p - 1) * (2 ^ p - 1)) == 2 ^ (p - 1) * (2 ^ p - 1)) := by decide

-- ── and the hypothesis is not decoration: at p = 11 the Mersenne number is composite ─────────────────────
--    Without this, the theorem above is four cases where the guard happens to be true, and a reader has no
--    way to see that the guard ever does anything. 2^11 − 1 = 2047 = 23 · 89.
theorem the_mersenne_hypothesis_is_real_at_eleven :
  isPrime (2 ^ 11 - 1) = false ∧ 23 * 89 = 2 ^ 11 - 1 := by decide

-- ── the amicable pair: each is the other's proper-divisor sum, and NEITHER is its own ────────────────────
set_option maxRecDepth 2000000 in
theorem the_amicable_pair_is_mutual_and_neither_is_perfect :
  properDivisorSum 220 = 284 ∧ properDivisorSum 284 = 220 ∧
  properDivisorSum 220 ≠ 220 ∧ properDivisorSum 284 ≠ 284 := by decide

-- ── the primitive roots mod nine are exactly two and five ────────────────────────────────────────────────
--    families.lean decides that a primitive root EXISTS at 9. Which ones they are is a different statement,
--    and the ledger's row claims the stronger one: a residue is a primitive root exactly when its powers
--    run through all six units, and only 2 and 5 do.
theorem the_primitive_roots_mod_nine_are_exactly_two_and_five :
  (unitsMod 9).filter (fun g => ordMod g 9 == 6) = [2, 5] := by decide

/-- the norm on the Eisenstein integers a + bω, where ω is a primitive cube root of unity -/
def eisensteinNorm (a b : Int) : Int := a * a - a * b + b * b

-- ── the Eisenstein integers have exactly six units ───────────────────────────────────────────────────────
--    The units are the norm-1 elements. Searched over the box −3…3 in both coordinates, which is wider than
--    it needs to be: the norm is a positive definite form, so nothing outside can have norm 1, and finding
--    exactly six inside a box that could have held more is the content.
theorem the_eisenstein_units_are_exactly_six :
  (((List.range 7).flatMap (fun (i : Nat) =>
      (List.range 7).map (fun (j : Nat) => (((i : Int) - 3, (j : Int) - 3) : Int × Int)))).filter
    (fun p => eisensteinNorm p.1 p.2 == 1)).length = 6 := by decide

-- ── the subtraction game {1,2,3}: the mover loses exactly at the multiples of four ───────────────────────
--    Both halves, which is what makes it the theorem rather than a pattern: from a multiple of four every
--    legal move leaves a non-multiple, and from a non-multiple some legal move reaches one.
theorem the_subtraction_game_loses_exactly_at_the_multiples_of_four :
  (List.range 41).all (fun n =>
    if n % 4 == 0 then [1, 2, 3].all (fun m => !(m ≤ n) || (n - m) % 4 != 0)
    else [1, 2, 3].any (fun m => m ≤ n && (n - m) % 4 == 0)) := by decide

-- ── what these settle ──
def settledHere : Nat := 6
theorem classical_settles_its_range : settledHere = 6 := rfl

end Classical
