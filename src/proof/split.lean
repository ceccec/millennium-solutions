-- title: The digit split
-- wing: the ring
-- prior_art: unclassified
-- The ten digits read in order and grouped 0 | 12 | 3 | 45 | 6 | 78 | 9 — and what that grouping is.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- Written out, the digits 0..9 split into seven tokens that alternate single, pair, single, pair, single,
-- pair, single:
--
--     0   12   3   45   6   78   9
--
-- The grouping is not a choice. The singles {0,3,6,9} are exactly the NON-UNITS of ℤ/9 together with the
-- void — the digits with no multiplicative inverse, gcd(d,9) ≠ 1 — and the pairs {12,45,78} are exactly the
-- units {1,2,4,5,7,8} in consecutive order, each pair sitting between two non-units. The alternation IS the
-- unit / non-unit alternation of the ring, read off the number line.
--
-- And every token, single or pair, is a multiple of three:
--
--     0 = 3·0    3 = 3·1    6 = 3·2    9 = 3·3        the singles, 3·0 through 3·3
--     12 = 3·4   45 = 3·15  78 = 3·26                 the pairs
--
-- So the split is the ideal 3ℤ, twice over: the singles because they are the non-units, and the pairs
-- because concatenating each consecutive unit pair lands back inside it. The set is closed under addition,
-- subtraction and multiplication, and DIVISION IS THE ONE OPERATION THAT LEAVES IT — 12/3 = 4, 45/9 = 5,
-- 6/3 = 2 are all outside. That asymmetry is the content: three of the four operations keep the structure
-- and the fourth is how you get out of it.
--
-- Everything below is decided over the whole set; nothing is asserted about digits in general.

namespace Split

def tokens : List Nat := [0, 12, 3, 45, 6, 78, 9]
def singles : List Nat := [0, 3, 6, 9]
def pairs : List Nat := [12, 45, 78]
def unitsOf9 : List Nat := [1, 2, 4, 5, 7, 8]

-- ── THE GROUPING IS THE RING'S OWN, not a reading imposed on it ──────────────────────────────────────────
-- A digit is a unit of ℤ/9 exactly when some other digit multiplies with it to 1. The singles are precisely
-- the digits for which no such partner exists.
def isUnit9 (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)

theorem the_singles_are_exactly_the_non_units :
  ((List.range 10).filter (fun d => ! isUnit9 d)) = [0, 3, 6, 9]
  ∧ singles = [0, 3, 6, 9] := by decide

theorem the_pairs_are_exactly_the_units_in_order :
  ((List.range 10).filter isUnit9) = unitsOf9
  ∧ unitsOf9 = [1, 2, 4, 5, 7, 8] := by decide

-- Each pair is two CONSECUTIVE units, and the concatenation is what the token spells.
theorem each_pair_is_two_consecutive_units :
  12 = 1 * 10 + 2 ∧ 45 = 4 * 10 + 5 ∧ 78 = 7 * 10 + 8
  ∧ 2 = 1 + 1 ∧ 5 = 4 + 1 ∧ 8 = 7 + 1 := by decide

-- ── EVERY TOKEN IS A MULTIPLE OF THREE ───────────────────────────────────────────────────────────────────
-- The singles because they are the non-units — 3 ∣ d is the same condition as gcd(d,9) ≠ 1 for a digit —
-- and the pairs because concatenating a consecutive unit pair lands back inside the ideal.
theorem every_token_is_a_multiple_of_three :
  tokens.all (fun t => t % 3 == 0) := by decide

theorem the_tokens_are_three_times_these :
  tokens.map (fun t => t / 3) = [0, 4, 1, 15, 2, 26, 3] := by decide

-- ── CLOSED UNDER THREE OPERATIONS, AND DIVISION IS THE WAY OUT ───────────────────────────────────────────
-- Addition, subtraction and multiplication keep every result inside the ideal. Subtraction is stated on the
-- ordered pairs only, since Nat truncates.
theorem addition_and_multiplication_stay_inside :
  tokens.all (fun a => tokens.all (fun b => (a + b) % 3 == 0 && (a * b) % 3 == 0)) := by decide

theorem subtraction_stays_inside :
  tokens.all (fun a => tokens.all (fun b => a < b || (a - b) % 3 == 0)) := by decide

-- The contrast, without which the closure above could be read as a property of arithmetic rather than of
-- this set: division genuinely escapes, and here are the exact quotients that do it.
theorem division_is_the_operation_that_leaves :
  12 / 3 = 4 ∧ 4 % 3 != 0
  ∧ 45 / 9 = 5 ∧ 5 % 3 != 0
  ∧ 6 / 3 = 2 ∧ 2 % 3 != 0 := by decide

-- ── THE DIGITAL ROOTS LAND ON THE TRINITY AND THE VOID ───────────────────────────────────────────────────
-- Reducing each token mod 9 sends it to {0,3,6,9} — the same four digits the singles already are. The
-- grouping is fixed by the reduction it survives.
theorem the_roots_are_the_singles :
  tokens.map (fun t => t % 9) = [0, 3, 3, 0, 6, 6, 0] := by decide

theorem every_root_is_a_single :
  tokens.all (fun t => singles.contains (if t % 9 == 0 then (if t == 0 then 0 else 9) else t % 9)) := by decide


-- ── ACCOUNTING THE TWO COINS ─────────────────────────────────────────────────────────────────────────────
-- The deposit's fair-exchange unit is TWO coins — 110 − 108 = 2 = −χ for genus 2, conserved per receipt.
-- Deducting them from a token's multiplier is deducting 3·2 = 6 from the token itself, because every token
-- is 3k: 78 = 3·26 becomes 3·(26−2) = 72, and 72 = 8·9.
--
-- Repeated deduction then sorts the seven into exactly two classes, and the sorting is not by size:
--
--     0, 6, 12, 78   reach the void — 78 in thirteen deductions, 78 = 6·13
--     3, 45, 9       halt at 3 and cannot pay again
--
-- A token is exhaustible by the coin exactly when 6 divides it, and every token that is not halts on THREE —
-- the generator of the ideal the whole split lives in. The coin cannot spend the generator.
def coins : Nat := 2
def coinStep : Nat := 3 * coins

theorem the_coin_step_is_three_times_the_two_coins :
  coins = 2 ∧ coinStep = 6 ∧ coinStep = 3 * 2 := by decide

theorem accounting_the_coins_on_the_last_pair :
  78 = 3 * 26 ∧ 3 * (26 - coins) = 72 ∧ 72 = 8 * 9 := by decide

-- The two classes, named rather than counted.
theorem the_exhaustible_tokens_are_those_six_divides :
  (tokens.filter (fun t => t % coinStep == 0)) = [0, 12, 6, 78] := by decide

theorem the_rest_halt_on_the_generator :
  (tokens.filter (fun t => t % coinStep != 0)) = [3, 45, 9]
  ∧ (tokens.filter (fun t => t % coinStep != 0)).all (fun t => t % coinStep == 3) := by decide

-- Every token falls in one class or the other: there is no third remainder, which is what makes the
-- partition a partition and not a pair of examples.
theorem every_token_is_void_bound_or_halts_on_three :
  tokens.all (fun t => t % coinStep == 0 || t % coinStep == 3) := by decide

-- I tried to write the opposite of this and the kernel refused it. The claim was that a bare step of 2
-- sorts the seven differently from the coin step of 3·2 — that the scaling into the ideal is what does the
-- work. It is FALSE, and the reason is the better fact: every token is already a multiple of three, so
-- 2 ∣ t and 6 ∣ t are the SAME condition here. The coin does not need to be scaled to sort them; the ideal
-- has already done that half of the work.
theorem inside_this_ideal_the_bare_coin_sorts_as_the_scaled_one :
  (tokens.filter (fun t => t % 2 == 0)) = (tokens.filter (fun t => t % coinStep == 0))
  ∧ tokens.all (fun t => (t % 2 == 0) == (t % coinStep == 0)) := by decide


end Split
