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

-- ── THE UNIT GROUP OF ℤ/9, WHICH IS THE GROUP THIS WHOLE DEPOSIT IS BUILT ON ────────────────────────────
--
--    scripts/candidates.ts proposed `units_are_six` as the heir for seven different withdrawn rows, all of
--    them about (ℤ/9)*, and it was wrong every time: knowing the group has six elements decides none of
--    what those rows claim. They are real statements and each needed its own theorem. That the ranking
--    proposed one theorem for seven claims is exactly why it writes nothing.

-- ── the six units fall into three additive-inverse pairs, each summing to nine ───────────────────────────
theorem the_units_of_z9_form_three_pairs_summing_to_nine :
  ((unitsMod 9).filter (fun u => u < 9 - u)).length = 3 ∧
  (unitsMod 9).all (fun u => (unitsMod 9).contains (9 - u) && u + (9 - u) == 9) := by decide

-- ── the Cayley table is a Latin square: every row AND every column is a permutation of the units ─────────
--    Rows alone would suffice in an abelian group, but only if commutativity were already stated. Both are
--    decided here rather than one being inferred from something this theorem does not say.
theorem the_multiplication_table_of_the_z9_units_is_a_latin_square :
  (unitsMod 9).all (fun a =>
    ((unitsMod 9).map (fun b => a * b % 9)).eraseDups.length == (unitsMod 9).length &&
    ((unitsMod 9).map (fun b => a * b % 9)).all (fun x => (unitsMod 9).contains x)) ∧
  (unitsMod 9).all (fun b =>
    ((unitsMod 9).map (fun a => a * b % 9)).eraseDups.length == (unitsMod 9).length &&
    ((unitsMod 9).map (fun a => a * b % 9)).all (fun x => (unitsMod 9).contains x)) := by decide

-- ── the count of primitive roots is φ(φ(n)), wherever a primitive root exists at all ────────────────────
--    Range 2…60, because the row it carries says "over the moduli up to 60" and 18 is not 60. The theorem
--    moved to the claim rather than the claim being read down to the theorem.
set_option maxRecDepth 2000000 in
set_option maxHeartbeats 2000000 in
theorem the_count_of_primitive_roots_is_phi_of_phi :
  (List.range' 2 59).all (fun n => !(hasPrimitiveRoot n) ||
    ((unitsMod n).filter (fun g => ordMod g n == (unitsMod n).length)).length == totient (totient n)) := by decide

-- ── the order spectrum realises Gauss's divisor sum: φ(d) units of order d, and the φ's sum to the group ─
--    The divisors are computed, not listed: a typed [1, 2, 3, 6] would be the answer written into the
--    question, and the second conjunct is Σ_{d | 6} φ(d) = 6, which is the statement the first one realises.
theorem the_order_spectrum_of_the_z9_units_realises_gauss_divisor_sum :
  ((List.range' 1 6).filter (fun d => 6 % d == 0)).all (fun d =>
    ((unitsMod 9).filter (fun g => ordMod g 9 == d)).length == totient d) ∧
  (((List.range' 1 6).filter (fun d => 6 % d == 0)).map totient).foldl (· + ·) 0 = 6 := by decide

-- ── Gauss's generalisation of Wilson: the product of the units is −1 exactly where a primitive root exists,
--    and +1 everywhere else. Wilson's theorem is the prime case of this, and the split is Gauss's. ────────
set_option maxRecDepth 2000000 in
set_option maxHeartbeats 2000000 in
theorem the_product_of_the_units_is_minus_one_exactly_where_gauss_says :
  (List.range' 2 59).all (fun n =>
    ((unitsMod n).foldl (fun a u => a * u % n) 1) == (if gaussCyclic n then n - 1 else 1)) := by decide

-- ── three is a primitive root mod seven, and seven is six units plus the one non-unit ────────────────────
theorem three_is_a_primitive_root_mod_seven_and_seven_is_six_plus_one :
  ordMod 3 7 = 6 ∧ (unitsMod 7).length = 6 ∧ (List.range 7).length = (unitsMod 7).length + 1 := by decide

-- ── the order-six unit group splits as a reflection times a trinity ──────────────────────────────────────
--    u ↦ (u³, u⁴) is the splitting, and it works because 3 + 4 = 7 ≡ 1 in the exponent group of order six.
--    The two factors have two and three values, which is the C2 × C3 the Chinese remainder theorem predicts.
theorem the_z9_unit_group_splits_as_reflection_times_trinity :
  (unitsMod 9).all (fun u => powMod u 3 9 * powMod u 4 9 % 9 == u) ∧
  ((unitsMod 9).map (fun u => powMod u 3 9)).eraseDups.length = 2 ∧
  ((unitsMod 9).map (fun u => powMod u 4 9)).eraseDups.length = 3 := by decide

-- ── what these settle ──
def settledHere : Nat := 13
theorem classical_settles_its_range : settledHere = 13 := rfl

end Classical
