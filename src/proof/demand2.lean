import Families
set_option maxRecDepth 8000000
set_option maxHeartbeats 4000000
-- title: The next tier of what is asked for
-- wing: the floor
-- prior_art: named
-- prior_art_domain: elementary number theory, second tier
-- prior_art_note: Wilson’s theorem — John Wilson; first proved by Joseph-Louis Lagrange, 1771; the Catalan conjecture on consecutive perfect powers — Eugène Catalan, 1844; proved by Preda Mihăilescu, 2002
--
-- THE SECOND COURSE OF THE SAME FLOOR. `demand.lean` closed the top eight topics in src/demand/queries.json;
-- this file takes the next eight, chosen the same way — by impressions, not by taste. The demand map is three
-- months of the deposit's own Google Search Console data with the retrieval scaffolding stripped, so what is
-- ranked is the TOPIC people wanted a citable source for, not the phrasing they reached for.
--
-- Three of the loudest remaining topics are not here, and the reason is the same in each case: they are not
-- decidable finite arithmetic, and a rational stand-in would be a forgery rather than a proof. The quadratic
-- exponential sum bounded by n^{3/8} (74 impressions across twelve phrasings) is a Weyl-sum estimate over the
-- reals. Archimedes' bracket 223/71 < π < 22/7 (8) quantifies over π, which has no finite decidable content —
-- the rational lemma 265/153 < √3 < 1351/780 that Archimedes actually computed with is decidable, but it is a
-- DIFFERENT statement and would be passed off as this one. ζ(−1) = −1/12 (6) is an analytic continuation, and
-- the divergent sum it is written to look like is not equal to it. Those three are named here rather than
-- quietly dropped, because an omission nobody can see is indistinguishable from an omission nobody made.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Demand2

open Families

-- ── 1 · Nicomachus's theorem — 9 impressions across four phrasings ("nicomachus's theorem", "sum of
--        consecutive cubes", "sum of consecutive cubes formula"). The sum of the first n cubes is the SQUARE
--        of the nth triangular number, checked to n = 40 in both of the forms it is asked in: against T_n²
--        and against (1+2+⋯+n)². The third clause is what keeps this from being a coincidence about sums —
--        the sum of the first n FOURTH powers is not a perfect square for any n from 2 to 20, so squareness
--        is a property of the cubes and not of power sums generally. n = 1 is carried as the boundary case
--        where it does hold, so the negative is a real dividing line rather than a blanket denial. ──
def sumPow (p n : Nat) : Nat := (List.range' 1 n).foldl (fun a k => a + k ^ p) 0
def tri (n : Nat) : Nat := n * (n + 1) / 2
-- squareness by trial root rather than by an integer square root: `bound` must exceed √m, and 900² far
-- exceeds the largest fourth-power sum tested here (Σ_{k≤20} k⁴ = 722666, whose root is under 851).
def isSquareBelow (bound m : Nat) : Bool := (List.range bound).any (fun r => r * r == m)

theorem nicomachus_sum_of_cubes_is_the_square_of_the_triangular_number :
  (List.range' 1 40).all (fun n => sumPow 3 n == tri n * tri n) ∧
  (List.range' 1 40).all (fun n => sumPow 3 n == sumPow 1 n * sumPow 1 n) ∧
  (List.range' 2 19).all (fun n => ¬ isSquareBelow 900 (sumPow 4 n)) ∧
  isSquareBelow 900 (sumPow 4 1) = true := by decide

-- ── 2 · Pick's theorem — 7 impressions across five phrasings. Area = I + B/2 − 1 for a lattice polygon;
--        halves do not live in ℤ, so it is stated in its doubled form 2·Area = 2I + B − 2, with 2·Area read
--        off the shoelace cross product exactly. Quantified over EVERY positively oriented lattice triangle
--        with vertices in the 4×4 grid. The second clause is the discriminator: dropping the −2 gives a
--        formula that holds for NOT ONE of those triangles, so the constant is pinned rather than assumed.
--        The last two clauses are the census, decided rather than asserted in this comment — there are 1548
--        such triangles, and 516 of them contain an interior lattice point, so the range is neither empty nor
--        degenerate and the interior term of the formula is carrying weight. ──
def pts : List (Int × Int) :=
  (List.range 4).flatMap (fun x => (List.range 4).map (fun y => (Int.ofNat x, Int.ofNat y)))
def triples : List ((Int × Int) × (Int × Int) × (Int × Int)) :=
  pts.flatMap (fun a => pts.flatMap (fun b => pts.map (fun c => (a, b, c))))
def cross (a b c : Int × Int) : Int := (b.1 - a.1) * (c.2 - a.2) - (c.1 - a.1) * (b.2 - a.2)
def interiorCount (a b c : Int × Int) : Int :=
  Int.ofNat (pts.filter (fun q => cross a b q > 0 && cross b c q > 0 && cross c a q > 0)).length
def boundaryCount (a b c : Int × Int) : Int :=
  Int.ofNat (pts.filter (fun q =>
    cross a b q ≥ 0 && cross b c q ≥ 0 && cross c a q ≥ 0 &&
    (cross a b q == 0 || cross b c q == 0 || cross c a q == 0))).length

theorem picks_theorem_holds_for_every_lattice_triangle_in_the_four_grid :
  pts.all (fun a => pts.all (fun b => pts.all (fun c =>
    cross a b c ≤ 0 || cross a b c == 2 * interiorCount a b c + boundaryCount a b c - 2))) ∧
  ¬ pts.any (fun a => pts.any (fun b => pts.any (fun c =>
    cross a b c > 0 && cross a b c == 2 * interiorCount a b c + boundaryCount a b c))) ∧
  (triples.filter (fun t => cross t.1 t.2.1 t.2.2 > 0)).length = 1548 ∧
  (triples.filter (fun t => cross t.1 t.2.1 t.2.2 > 0 && interiorCount t.1 t.2.1 t.2.2 > 0)).length = 516
    := by decide

-- ── 3 · Bézout's identity — 6 impressions across three phrasings. Both halves of the statement are decided,
--        because only together do they say that gcd is the LEAST positive combination rather than merely
--        SOME combination. Attainment: for every pair of a, b up to 30 there are coefficients under 31 with
--        a·x = b·y + gcd(a,b). Minimality: for every a, b, x, y up to 20, whenever a·x ≥ b·y the difference
--        is a multiple of gcd(a,b) — so nothing smaller and positive is ever reachable. The subtraction is
--        guarded by the inequality rather than performed, since ℕ subtraction truncates and a truncated 0
--        would satisfy the divisibility test for the wrong reason. The named instance is the textbook one:
--        gcd(240, 46) = 2 attained as 46·47 − 240·9. ──
theorem bezouts_identity_is_attained_and_no_smaller_combination_exists :
  (List.range' 1 30).all (fun a => (List.range' 1 30).all (fun b =>
    (List.range 31).any (fun x => (List.range 31).any (fun y =>
      a * x == b * y + Families.gcd' a b)))) ∧
  (List.range' 1 20).all (fun a => (List.range' 1 20).all (fun b =>
    (List.range 21).all (fun x => (List.range 21).all (fun y =>
      a * x < b * y || (a * x - b * y) % Families.gcd' a b == 0)))) ∧
  Families.gcd' 240 46 = 2 ∧ 46 * 47 = 240 * 9 + 2 := by decide

-- ── 4 · There are 576 Latin squares of order 4 — 6 impressions across four phrasings. Counted, not quoted:
--        every permutation of {0,1,2,3} is generated, and rows are added one at a time subject to the column
--        constraint, so the 576 is the size of an enumerated set. The orders 1, 2 and 3 are counted by the
--        same function in the same theorem, which is what rules out a counter that happens to return 576 —
--        it must also return 1, 2 and 12. The last clause separates the true count from the naive guess that
--        the rows are independent, which would give (4!)³ = 13824 for the last three rows. ──
def tuples : Nat → Nat → List (List Nat)
  | 0, _ => [[]]
  | Nat.succ k, n => (tuples k n).flatMap (fun t => (List.range n).map (fun v => v :: t))
def permsOf (n : Nat) : List (List Nat) := (tuples n n).filter (fun r => r.eraseDups.length == n)
def discord (n : Nat) (r s : List Nat) : Bool := (List.range n).all (fun j => ¬ (r.getD j 0 == s.getD j 0))
-- fuel is the number of rows still to place, so the recursion is structural: no well-founded measure, and
-- the permutation list is threaded through rather than rebuilt at every node.
def countRows : Nat → Nat → List (List Nat) → List (List Nat) → Nat
  | 0, _, _, _ => 1
  | Nat.succ k, n, ps, sofar =>
    ((ps.filter (fun r => sofar.all (fun p => discord n r p))).map
      (fun r => countRows k n ps (r :: sofar))).foldl (· + ·) 0
def latinSquares (n : Nat) : Nat := countRows n n (permsOf n) []

theorem the_latin_squares_of_order_four_number_five_hundred_and_seventy_six :
  latinSquares 4 = 576 ∧ latinSquares 3 = 12 ∧ latinSquares 2 = 2 ∧ latinSquares 1 = 1 ∧
  ¬ (latinSquares 4 = 24 * 24 * 24) := by decide

-- ── 5 · The closed form for the sum of fifth powers — 5 impressions across two phrasings, both of which
--        quote it as n²(n+1)²(2n²+2n−1)/12. The division is cleared rather than performed, so the statement
--        is 12·Σk⁵ = n²(n+1)²(2n²+2n−1) and no rounding can hide inside it; that the twelfth is exact is
--        exactly what the equation then says. The negative clause rules out the natural wrong guess by
--        analogy with Nicomachus — Σk⁵ is NOT T_n³ for any n from 2 to 20, though it is at n = 1. ──
theorem the_sum_of_fifth_powers_has_the_closed_form_asked_for :
  (List.range' 1 20).all (fun n => 12 * sumPow 5 n == n * n * (n + 1) * (n + 1) * (2 * n * n + 2 * n - 1)) ∧
  (List.range' 2 19).all (fun n => ¬ (sumPow 5 n == tri n * tri n * tri n)) ∧
  sumPow 5 1 = 1 ∧ sumPow 5 2 = 33 ∧ sumPow 5 4 = 1300 := by decide

-- ── 6 · The Chinese remainder theorem — 5 impressions across five phrasings, including Sunzi's by name.
--        Stated as an IFF over every pair of moduli from 1 to 9, which is what makes the coprimality
--        hypothesis load-bearing instead of decorative: the pair map x ↦ (x mod m, x mod n) covers every
--        residue pair below m·n EXACTLY when gcd(m,n) = 1, and demonstrably fails to cover when it does not.
--        The second clause is Sunzi's own problem, and it is stated as a uniqueness claim — the residue
--        conditions 2 mod 3, 3 mod 5, 2 mod 7 have exactly one solution below 105, and it is 23. ──
def crtCoversAllPairs (m n : Nat) : Bool :=
  (List.range m).all (fun a => (List.range n).all (fun b =>
    (List.range (m * n)).any (fun x => x % m == a && x % n == b)))

theorem the_chinese_remainder_theorem_holds_exactly_when_the_moduli_are_coprime :
  (List.range' 1 9).all (fun m => (List.range' 1 9).all (fun n =>
    crtCoversAllPairs m n == (Families.gcd' m n == 1))) ∧
  (List.range 105).filter (fun x => x % 3 == 2 && x % 5 == 3 && x % 7 == 2) = [23] := by decide

-- ── 7 · Catalan's conjecture, Mihăilescu's theorem — 4 impressions across three phrasings. 8 and 9 are the
--        only consecutive perfect powers. The general statement is Mihăilescu's and is not decidable; what is
--        decided here is the exhaustive range: below 2000 there are 55 distinct perfect powers, and exactly
--        one of them is followed immediately by another. Both numbers matter — the 55 is stated so that the
--        uniqueness cannot be explained away as a range too sparse to contain a second pair. ──
def perfectPowersUpTo (bound : Nat) : List Nat :=
  ((List.range' 2 43).flatMap (fun b => (List.range' 2 10).map (fun e => b ^ e))).filter
    (fun v => v ≤ bound) |>.eraseDups
def pp2000 : List Nat := perfectPowersUpTo 2000

theorem eight_and_nine_are_the_only_consecutive_perfect_powers_below_two_thousand :
  (List.range' 1 1999).filter (fun n => pp2000.contains n && pp2000.contains (n + 1)) = [8] ∧
  pp2000.length = 55 ∧ pp2000.contains 8 = true ∧ pp2000.contains 9 = true := by decide

-- ── 8 · 220 and 284 are amicable, and they are the smallest such pair — 4 impressions across four phrasings
--        ("220 and 284", "220 284", "divisors of 284", "smallest amicable numbers"). The aliquot sum is
--        computed from the proper divisors directly. The minimality clause is the exhaustive half: for every
--        a from 2 to 219 it is NOT the case that s(s(a)) = a with s(a) ≠ a, so no amicable pair has a member
--        below 220. The s(a) ≠ a guard is what separates amicable pairs from perfect numbers, and the last
--        clause names the two perfect numbers in that range so the guard is visibly doing something. ──
def aliquot (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0

theorem two_twenty_and_two_eighty_four_are_the_smallest_amicable_pair :
  aliquot 220 = 284 ∧ aliquot 284 = 220 ∧
  (List.range' 2 218).all (fun a => ¬ (aliquot (aliquot a) == a && ¬ (aliquot a == a))) ∧
  (List.range' 2 218).filter (fun a => aliquot a == a) = [6, 28] := by decide

end Demand2
