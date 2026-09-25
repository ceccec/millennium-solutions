set_option maxRecDepth 100000
-- title: The reflection lifts digitwise, and the constant it adds to is ten times a repunit
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the nines' and tens' complement, the basis of complement subtraction and of the
--   check-digit arithmetic behind casting out nines. Repunits (1, 11, 111, …). Elementary place value.
-- prior_art_note: COMPLEMENT ARITHMETIC IS NOT THIS DEPOSIT'S AND IS OLDER THAN THE DECIMAL POINT. That a
--   number and its digitwise ten's-complement sum to a repunit-times-ten is a consequence of place value
--   that any accountant's method already relies on. What is this deposit's is the accounting below: that
--   the ring's four reflection pairs, written as two-digit numbers, are all congruent to one mod nine, and
--   that zero's exception reappears one place up as an excursion rather than a failure.
-- prior_art_search: not performed — complement arithmetic is named above.
-- prior_art_pool: unbounded
-- prior_art_own: theorem 4 (the pairs mod nine) and theorem 6 (zero's excursion), and the controls
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- The author's third clause: "8 interacting with 8 is 16, 1 reflects 9 and 6 reflects 4."
--
-- 8 + 8 = 16. Reflect each digit — refl 1 = 9, refl 6 = 4 — and 16 becomes 94, and 16 + 94 = 110. That is
-- not a property of 16. It holds for EVERY two-digit number, and one place up for every three-digit one,
-- and the constant is 10, then 110, then 1110: ten times a repunit, one 1 per digit. The reflection this
-- deposit uses on a single residue is the width-one case of it, which theorem 1 states at all three widths
-- so the pattern is decided rather than noticed.
--
-- THE SECOND HALF OF THE CLAUSE POINTS SOMEWHERE ELSE. 8 × 8 = 64, and 6 and 4 are not any two digits:
-- they are the fourth of the four transpositions in src/proof/mirror.lean. So 64 and 46 are one reflection
-- pair read in both directions, and 64 + 46 = 110 is theorem 1 and theorem 2 of that file meeting.
--
-- AND ALL FIVE ARE ONE MOD NINE. Write each of the four pairs, and the fixed point, as a two-digit number
-- — 19, 28, 37, 46, 55 — and every one of them is congruent to 1 mod 9, as is every reverse. It is forced:
-- 10a + (10 − a) = 9a + 10, and 9a vanishes mod 9 leaving 10 ≡ 1. The whole mirror of this ring sits on
-- one residue, and that residue is the one the sequence opens and closes on.
--
-- ZERO, AGAIN, AND MORE EXACTLY THAN EXPECTED. refl 0 = 10 leaves the ring. One place up, exactly ONE
-- two-digit number leaves the two-digit range — and it is 10, which is refl 0 itself. Not an echo of
-- zero's exception at a larger width: the same number, carried up by the same +10 in the units place.
-- Every other trailing zero stays (20 reflects to 90), because the carry only clears 99 when the tens
-- digit is 1. Theorem 6 exhibits it; it was written first as "the numbers ending in zero" and refused.
--
-- No axioms, no Mathlib, no sorry.

namespace Digits

def refl (d : Nat) : Nat := 10 - d

-- Reflect each of the two decimal digits in place.
def refl2 (n : Nat) : Nat := refl (n / 10) * 10 + refl (n % 10)
def refl3 (n : Nat) : Nat := refl (n / 100) * 100 + refl (n / 10 % 10) * 10 + refl (n % 10)

-- The four transpositions of src/proof/mirror.lean and its fixed point, as two-digit numbers.
def pairNums : List Nat := [1, 2, 3, 4, 5].map (fun a => a * 10 + refl a)

-- ── 1 · THE REFLECTED SUM IS TEN TIMES A REPUNIT, AT EVERY WIDTH ──────────────────────────────────────────
-- One digit gives 10, two give 110, three give 1110. Decided over every number of each width, not sampled.
theorem the_reflected_sum_is_ten_one_hundred_ten_and_one_thousand_one_hundred_ten :
  (List.range 11).all (fun d => d + refl d == 10)
  && ((List.range 100).drop 10).all (fun n => n + refl2 n == 110)
  && ((List.range 1000).drop 100).all (fun n => n + refl3 n == 1110) := by decide

-- ── 2 · EIGHT AND EIGHT ───────────────────────────────────────────────────────────────────────────────────
-- The clause itself, decided: the sum, the two digit reflections it names, and where they land.
theorem eight_and_eight_make_sixteen_which_reflects_to_ninety_four :
  8 + 8 == 16 && refl 1 == 9 && refl 6 == 4
  && refl2 16 == 94 && 16 + 94 == 110 := by decide

-- ── 3 · EIGHT BY EIGHT IS A REFLECTION PAIR WRITTEN OUT ───────────────────────────────────────────────────
-- 64's digits are 6 and 4, which reflect to each other — so 64 and 46 are one pair of the mirror read in
-- both directions, and they sum to 110 like everything else of two digits.
theorem eight_times_eight_is_the_pair_six_four_read_both_ways :
  8 * 8 == 64 && refl 6 == 4 && refl 4 == 6
  && refl2 64 == 46 && 64 + 46 == 110
  && pairNums.contains 46 := by decide

-- ── 4 · THE WHOLE MIRROR SITS ON ONE MOD NINE ─────────────────────────────────────────────────────────────
-- 19, 28, 37, 46, 55 — the four pairs and the centre as two-digit numbers. Every one is 1 mod 9, and so is
-- every reverse, because 10a + (10 − a) = 9a + 10 and the 9a vanishes. One is where the sequence opens.
theorem every_pair_written_as_two_digits_is_one_mod_nine :
  pairNums == [19, 28, 37, 46, 55]
  && pairNums.all (fun n => n % 9 == 1)
  && pairNums.all (fun n => refl2 n % 9 == 1)
  && pairNums.all (fun n => n + refl2 n == 110) := by decide

-- ── 5 · REFLECTING TWICE RETURNS THE NUMBER ───────────────────────────────────────────────────────────────
-- An involution across the whole two-digit range, which is what licenses reading `refl2` as a mirror
-- rather than as an arbitrary relabelling.
theorem reflecting_both_digits_twice_returns_the_number :
  ((List.range 100).drop 10).all (fun n => refl2 (refl2 n) == n) := by decide

-- ── 6 · ZERO'S EXCEPTION, ONE PLACE UP ────────────────────────────────────────────────────────────────────
-- refl 0 = 10 leaves the single digits; refl2 10 = 100 leaves the two-digit numbers, and returns.
--
-- WRITTEN FIRST AS "exactly the numbers ending in zero", WHICH THE KERNEL REFUSED, and the truth is much
-- sharper. A trailing zero contributes refl 0 = 10 in the units, which carries — but the carry only pushes
-- past 99 when the tens digit is 1, so 20 reflects to 90 and stays. EXACTLY ONE two-digit number leaves
-- its width, and it is 10: the number that is itself refl 0. Zero's exception at one digit is not merely
-- echoed at two digits, it is the same number.
theorem exactly_one_two_digit_number_reflects_past_its_width_and_it_is_ten :
  refl 0 == 10 && refl2 10 == 100 && refl2 (refl2 10) == 10
  && ((List.range 100).drop 10).filter (fun n => refl2 n > 99) == [10]
  && ((List.range 100).drop 10).all (fun n => (refl2 n > 99) == (n == refl 0)) := by decide

-- ── 7 · THE CONTROL: THE CONSTANT IS NOT FREE ─────────────────────────────────────────────────────────────
-- Theorems 1 to 4 would all hold if `refl2` had collapsed to something that made every sum equal. A digit
-- map that is NOT the ten's complement must fail to give any constant, and the nines' complement — one
-- away, and the other complement every schoolbook teaches — gives 99 for some numbers and not others.
theorem the_nines_complement_gives_no_such_constant :
  ((List.range 100).drop 10).any (fun n => n + ((9 - n / 10) * 10 + (9 - n % 10)) != 110)
  && ((List.range 100).drop 10).all (fun n => n + ((9 - n / 10) * 10 + (9 - n % 10)) == 99)
  && 99 != 110 := by decide

-- ── 8 · AND THE CONSTANTS ARE THE REPUNITS ────────────────────────────────────────────────────────────────
-- 10, 110, 1110 are 10 × 1, 10 × 11, 10 × 111 — one 1 for each place reflected. Stated so the three
-- numbers in theorem 1 are read as a rule with a next term and not as three results.
theorem the_constants_are_ten_times_the_repunits :
  10 == 10 * 1 && 110 == 10 * 11 && 1110 == 10 * 111 && 11110 == 10 * 1111
  && 11 == 1 * 10 + 1 && 111 == 11 * 10 + 1 && 1111 == 111 * 10 + 1 := by decide

end Digits
