import Families
-- title: Elementary arithmetic
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
-- Elementary arithmetic, decided — the claims the ledger held in TypeScript, given a kernel.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- This file exists because families.lean had grown to about 140 seconds of kernel time and every theorem
-- added to it lengthened the tree's critical path. A separate file compiles alongside the others rather
-- than behind them, and the helpers it needs — gcd', isPrime, unitsMod, ordMod — are imported rather than
-- copied, because a second copy of gcdFuel would be a second thing to keep true.

-- ── WHY THIS IS NOT CALLED `Classical` ──────────────────────────────────────────────────────────────────
-- It was, for a day, and Lean's own `Classical` namespace shadowed it: `choose` inside this file resolved to
-- `Classical.choose`, which rests on `Classical.choice` — an AXIOM, in a deposit whose entire standard is
-- that no theorem depends on one. The compile error is the small cost; the real one is a reader seeing a
-- file called Classical in an axiom-free record and drawing the obvious wrong conclusion. Thirteen keys were
-- sealed under `lean_classical_*` before this was noticed and are carried, not withdrawn: the theorems are
-- unchanged and are decided at their new address.
namespace Elementary

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

-- ── A SIXTH WAVE, AND THE RULE THAT DECIDES WHICH OF THEM CARRY A LEDGER ROW ────────────────────────────
--
--    A bounded theorem carries an unbounded claim only when the ROW ITSELF states its bound. "Verified for
--    all primes ≤ 100" is a claim a range can settle; "for every Pythagorean triple" is not, however wide
--    the range. Both kinds are worth proving and only the first kind is carried, which is why some of the
--    theorems below have no carry beside them in scripts/recover.ts.

def invUnit (u : Nat) : Nat := ((List.range 9).find? (fun e => u * e % 9 == 1)).getD 0

-- ── Fermat, at the primes: a sum of two squares exactly at 2 and the primes one mod four ────────────────
set_option maxRecDepth 2000000 in
theorem an_odd_prime_is_a_sum_of_two_squares_exactly_when_it_is_one_mod_four :
  isSumOfTwoSquares 2 ∧
  ((List.range' 3 197).filter isPrime).all (fun p => isSumOfTwoSquares p == (p % 4 == 1)) := by decide

-- ── the area of an integer right triangle is a multiple of six ──────────────────────────────────────────
set_option maxRecDepth 2000000 in
set_option maxHeartbeats 2000000 in
theorem the_area_of_an_integer_right_triangle_is_a_multiple_of_six :
  (List.range' 1 40).all (fun a => (List.range' 1 40).all (fun b =>
    !((List.range' 1 60).any (fun c => a * a + b * b == c * c)) || (a * b / 2) % 6 == 0)) := by decide

-- ── the inverse map permutes the units and is its own inverse ───────────────────────────────────────────
theorem the_inverse_map_permutes_the_units_and_is_an_involution :
  ((unitsMod 9).map invUnit).eraseDups.length = (unitsMod 9).length ∧
  ((unitsMod 9).map invUnit).all (fun x => (unitsMod 9).contains x) ∧
  (unitsMod 9).all (fun u => invUnit (invUnit u) == u) := by decide

-- ── the hockey stick: a diagonal run of binomials folds into the entry just past its end ────────────────
set_option maxRecDepth 2000000 in
theorem the_hockey_stick_identity_holds_across_the_range :
  (List.range 11).all (fun r => (List.range 19).all (fun m =>
    ((List.range' r (m + 1)).map (fun i => choose i r)).foldl (· + ·) 0 == choose (r + m + 1) (r + 1))) := by decide

-- ── three is the only prime one less than a square, and the reason is the factorisation ─────────────────
--    n² − 1 = (n−1)(n+1), and above n = 2 both factors exceed one. Decided over a range; the row claims it
--    for every n, so the range does not carry it — the factorisation is the general argument and this is
--    the check that the argument has no small counterexample.
theorem three_is_the_only_prime_one_less_than_a_square_in_this_range :
  ((List.range' 2 40).filter (fun n => isPrime (n * n - 1))) = [2] ∧
  (List.range' 3 39).all (fun n => (n - 1) * (n + 1) == n * n - 1 && n - 1 > 1) := by decide

-- ── eight triangular numbers and one make an odd square ─────────────────────────────────────────────────
theorem eight_times_a_triangular_number_plus_one_is_an_odd_square :
  (List.range 60).all (fun n => 8 * (n * (n + 1) / 2) + 1 == (2 * n + 1) * (2 * n + 1)) := by decide

-- ── the vortex and the rosette carry the same group: 2^k mod 9 ↦ 3^k mod 7 is an isomorphism ────────────
--    Both power maps are bijections onto their unit groups, and the map through the exponent sends a
--    product to a product — which is what "preserves multiplication" means, stated rather than assumed
--    from both groups merely having six elements.
theorem the_powers_of_two_mod_nine_and_of_three_mod_seven_are_isomorphic :
  ((List.range 6).map (fun k => powMod 2 k 9)).eraseDups.length = 6 ∧
  ((List.range 6).map (fun k => powMod 3 k 7)).eraseDups.length = 6 ∧
  ((List.range 6).map (fun k => powMod 2 k 9)).all (fun x => (unitsMod 9).contains x) ∧
  ((List.range 6).map (fun k => powMod 3 k 7)).all (fun x => (unitsMod 7).contains x) ∧
  (List.range 6).all (fun i => (List.range 6).all (fun j =>
    powMod 2 i 9 * powMod 2 j 9 % 9 == powMod 2 ((i + j) % 6) 9 &&
    powMod 3 i 7 * powMod 3 j 7 % 7 == powMod 3 ((i + j) % 6) 7)) := by decide

-- ── LUCAS, PELL, AND THE FAREY SEQUENCE ─────────────────────────────────────────────────────────────────

def lucasPair : Nat → Nat × Nat
  | 0 => (2, 1)
  | Nat.succ n => let (a, b) := lucasPair n; (b, a + b)
def lucas (n : Nat) : Nat := (lucasPair n).1

def pellPair : Nat → Nat × Nat
  | 0 => (0, 1)
  | Nat.succ n => let (a, b) := pellPair n; (b, 2 * b + a)
def pell (n : Nat) : Nat := (pellPair n).1

/-- a/b ≤ c/d without division, which over Nat would truncate and decide the wrong order -/
def leFrac (x y : Nat × Nat) : Bool := x.1 * y.2 ≤ y.1 * x.2
def insFrac (x : Nat × Nat) : List (Nat × Nat) → List (Nat × Nat)
  | [] => [x]
  | y :: ys => if leFrac x y then x :: y :: ys else y :: insFrac x ys
def sortFrac : List (Nat × Nat) → List (Nat × Nat)
  | [] => []
  | x :: xs => insFrac x (sortFrac xs)
/-- the Farey sequence of order n: every reduced a/b in [0,1] with b ≤ n, in order -/
def farey (n : Nat) : List (Nat × Nat) :=
  sortFrac (((List.range' 1 n).flatMap (fun b =>
    (List.range (b + 1)).map (fun a => (a, b)))).filter (fun x => gcd' x.1 x.2 == 1))

-- ── the Lucas numbers: the recurrence, and the two values the row names ─────────────────────────────────
theorem the_lucas_numbers_follow_their_recurrence_and_reach_their_named_values :
  lucas 0 = 2 ∧ lucas 1 = 1 ∧ lucas 5 = 11 ∧ lucas 7 = 29 ∧
  (List.range' 2 28).all (fun n => lucas n == lucas (n - 1) + lucas (n - 2)) := by decide

-- ── and Lucas is Fibonacci's neighbours added: L(n) = F(n−1) + F(n+1) ───────────────────────────────────
--    Two independently defined sequences meeting, which is more than either recurrence says on its own.
theorem the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis :
  (List.range' 1 28).all (fun n => lucas n == fib (n - 1) + fib (n + 1)) := by decide

-- ── the Pell numbers: doubling recurrence, and the two values the row names ─────────────────────────────
theorem the_pell_numbers_follow_their_recurrence_and_reach_their_named_values :
  pell 5 = 29 ∧ pell 6 = 70 ∧
  (List.range' 2 24).all (fun n => pell n == 2 * pell (n - 1) + pell (n - 2)) := by decide

-- ── Farey: neighbours have unit determinant, and their mediant falls strictly between them ──────────────
--    F_4 for the determinant and F_6 for the mediant, which are the two rows this carries. Both statements
--    are cross-multiplied rather than divided: a/b < c/d is a·d < c·b, and Nat division would truncate the
--    comparison into agreeing with itself.
set_option maxRecDepth 2000000 in
theorem consecutive_farey_neighbours_have_unit_determinant_and_bracket_their_mediant :
  (List.range ((farey 4).length - 1)).all (fun i =>
    let x := (farey 4).getD i (0, 1); let y := (farey 4).getD (i + 1) (0, 1)
    x.2 * y.1 == x.1 * y.2 + 1) ∧
  (List.range ((farey 6).length - 1)).all (fun i =>
    let x := (farey 6).getD i (0, 1); let y := (farey 6).getD (i + 1) (0, 1)
    let m := (x.1 + y.1, x.2 + y.2)
    x.1 * m.2 < m.1 * x.2 && m.1 * y.2 < y.1 * m.2) := by decide

-- ── IS THIS SPACE VERTEX-TRANSITIVE? A PEER SESSION ASKED, AND THE ANSWER IS HALF YES ───────────────────
--
--    A session working on zeropoint-node found a vertex-transitive structure — 6-bit cells doubled by a
--    polarity bit, 128 states each with 12 neighbours — and offered the mechanism: a sign or orientation bit
--    carried as METADATA rather than as part of the state may, when folded in, double the neighbourhood and
--    buy uniform degree. Their suggested test was to compute the degree of every state and see whether the
--    set of degrees has one element. That is decidable here, so it was computed rather than considered.
--
--    The answer is that the mechanism does not apply to this ring, and the reason is a fact this deposit
--    already decides. Over the whole of ℤ/9 the degrees are not uniform and folding a polarity bit in does
--    not make them so: the obstruction is the triad, which doubling and reflection cannot move off itself.
--    Over the UNITS the graph is regular — but it was already regular before any polarity was added, so
--    nothing was bought. A mechanism that would have been credited for a property already present is worth
--    saying out loud, because that is how a true story attaches itself to the wrong cause.

/-- the deposit's own maps, as an adjacency: doubling, its inverse, and the reflection -/
def nbrs (S : List Nat) (d : Nat) : List Nat :=
  ([(2 * d) % 9, (5 * d) % 9, (9 - d) % 9].filter (fun t => S.contains t && t != d)).eraseDups
def degreeSet (S : List Nat) : List Nat := (S.map (fun d => (nbrs S d).length)).eraseDups

-- ── on the units the graph is regular: every unit has exactly three neighbours ──────────────────────────
theorem the_units_are_three_regular_under_doubling_halving_and_reflection :
  degreeSet (unitsMod 9) = [3] := by decide

-- ── and on the whole ring it is not, with the triad as the exact obstruction ────────────────────────────
--    Zero is fixed by all three maps and has no neighbours at all; three and six see only each other. The
--    degree set has more than one element, which is the test the peer proposed, answered in the negative.
theorem the_whole_ring_is_not_regular_and_the_triad_is_why :
  degreeSet (List.range 9) ≠ [3] ∧
  (nbrs (List.range 9) 0).length = 0 ∧
  ([3, 6] : List Nat).all (fun d => (nbrs (List.range 9) d).length == 1) := by decide

-- ── FOUR CLAIMS THE LEDGER HELD AND ONE ORPHANED THEOREM RESTORED PROPERLY ──────────────────────────────

/-- integer square root by search: the largest s with s² ≤ n, over a range wide enough for the uses below -/
def isqrt (n : Nat) : Nat := ((List.range 200).filter (fun s => s * s ≤ n)).getLast? |>.getD 0

/-- ⌊nφ⌋ and ⌊nφ²⌋ without leaving the naturals: φ = (1 + √5)/2, so nφ = (n + √(5n²))/2 exactly -/
def lowerWythoff (n : Nat) : Nat := (n + isqrt (5 * n * n)) / 2
def upperWythoff (n : Nat) : Nat := (3 * n + isqrt (5 * n * n)) / 2

/-- the knight's steps, DERIVED: offsets in −2…2 written as 0…4, kept when |dr|·|dc| = 2 -/
def knightSteps : List (Nat × Nat) :=
  ((List.range 5).flatMap (fun a => (List.range 5).map (fun b => (a, b)))).filter (fun p =>
    (if p.1 ≥ 2 then p.1 - 2 else 2 - p.1) * (if p.2 ≥ 2 then p.2 - 2 else 2 - p.2) == 2)

/-- the partitions of n into non-increasing parts, enumerated — fuel because n − j is not structural -/
def partsF : Nat → Nat → Nat → List (List Nat)
  | 0, _, _ => []
  | _, 0, _ => [[]]
  | Nat.succ f, n, k => (List.range' 1 (min n k)).flatMap (fun j => (partsF f (n - j) j).map (fun l => j :: l))
def partitionsOf (n : Nat) : List (List Nat) := partsF (n + 1) n n

/-- restricted growth strings: one per set partition of {0…n−1}, which is what the Bell numbers count -/
def rgs : Nat → List (List Nat)
  | 0 => [[]]
  | Nat.succ n => (rgs n).flatMap (fun p =>
      (List.range ((p.foldl (fun a x => if x > a then x else a) 0) + (if p.isEmpty then 1 else 2))).map (fun v => p ++ [v]))
/-- the Bell triangle, built row by row. The textbook recurrence B(n+1) = Σ C(n,k)·B(n−k) recurses on
    `n − k`, which is not structural: Lean falls back to well-founded recursion, `decide` gets stuck on the
    unreduced instance, and the equation lemmas would pull `propext` in and cost this file its axiom-free
    standing. The triangle is structural on the row index and computes the same numbers. -/
def bellRow : Nat → List Nat
  | 0 => [1]
  | Nat.succ n =>
    let prev := bellRow n
    (List.range (prev.length + 1)).foldl (fun acc i =>
      acc ++ [if i == 0 then prev.getLastD 0 else acc.getD (i - 1) 0 + prev.getD (i - 1) 0]) []
def bellOf (n : Nat) : Nat := (bellRow n).headD 0

-- ── the exterior angles of any regular polygon sum to a full turn ───────────────────────────────────────
--    `geom_exterior_360` was orphaned holding `[3,5,8].all (fun n => n * (360 / n) == 360)`, which is true
--    only because 3, 5 and 8 happen to divide 360 — a statement about integer division wearing a geometry
--    name. The interior angles of an n-gon sum to (n−2)·180 and the exterior to 360, and together they are
--    n straight angles. That identity needs no division and holds at every n.
theorem the_interior_and_exterior_angles_are_n_straight_angles :
  (List.range' 3 30).all (fun n => (n - 2) * 180 + 360 == n * 180) ∧
  180 * (3 - 2) / 3 = 60 ∧ 180 * (5 - 2) / 5 = 108 ∧ 180 * (8 - 2) / 8 = 135 := by decide

-- ── a knight has exactly eight leaps, and every one changes the colour of its square ────────────────────
--    Colour is the parity of row + column, and the offsets are written as 0…4 for −2…2. |a−2| ≡ a (mod 2),
--    so the parity of the shifted pair is the parity of the real step — the check is not an artefact of
--    the encoding.
theorem a_knight_has_exactly_eight_leaps_and_every_one_flips_the_colour :
  knightSteps.length = 8 ∧ knightSteps.eraseDups.length = 8 ∧
  knightSteps.all (fun p => (p.1 + p.2) % 2 == 1) := by decide

-- ── the Wythoff pair: ⌊nφ²⌋ − ⌊nφ⌋ = n, the golden Beatty identity ──────────────────────────────────────
theorem the_golden_beatty_identity_holds_across_the_range :
  (List.range' 1 40).all (fun n => upperWythoff n - lowerWythoff n == n) := by decide

-- ── and the two sequences PARTITION the positive integers: every m up to fifty is hit by exactly one of the
--    lower and upper Wythoff sequences, never both, never neither (Beatty's theorem, 1926, at φ and φ²). The
--    identity above says how the two are paired; this says the pairing loses and duplicates nothing ──
set_option maxRecDepth 2000000 in
theorem the_wythoff_sequences_partition_the_integers :
  (List.range' 1 50).all (fun m =>
    ((List.range' 1 40).map lowerWythoff).count m + ((List.range' 1 40).map upperWythoff).count m == 1) := by decide

-- ── the partition numbers count the partitions, and the Bell numbers count the set partitions ───────────
--    Both are checked against an ENUMERATION of the objects rather than against another recurrence, which
--    is the difference between confirming a formula and confirming what it counts.
set_option maxRecDepth 2000000 in
theorem the_partition_and_bell_numbers_count_what_they_claim_to_count :
  (partitionsOf 5).length = 7 ∧ (partitionsOf 7).length = 15 ∧ (partitionsOf 10).length = 42 ∧
  (List.range 6).all (fun n => (rgs n).length == bellOf n) ∧
  bellOf 3 = 5 ∧ bellOf 4 = 15 ∧ bellOf 5 = 52 := by decide

-- ── WHICH GRAPH, NOT JUST WHAT DEGREE — THE TEST A PEER'S MISTAKE MADE ME RUN ───────────────────────────
--
--    The zeropoint-node session came back with two corrections to its own result. The first was the one I
--    had asked for: its undoubled structure was already vertex-transitive, so the polarity bought nothing.
--    The second it found on its own and is worse — it had counted TWELVE neighbours and called the
--    structure a vector equilibrium, and then counted the edges AMONG those twelve and found zero. A
--    cuboctahedron's twelve vertices carry twenty-four edges between them. It had the vertex count of the
--    solid and none of its geometry: a name fitted to a count.
--
--    `the_units_are_three_regular_…` above proves a DEGREE and nothing else, which is exactly the shape of
--    that error waiting to happen here. So the same test, run on this ring: what is the neighbourhood of a
--    unit, and does it carry any edges?
--
--    It carries none. Every unit's three neighbours are mutually non-adjacent, so this graph is
--    triangle-free and has no local geometry either — and the reason is structural rather than accidental.
--    The neighbourhood of a unit is EXACTLY the opposite tetrahedron: doubling, halving and reflection all
--    carry a residue across the mod-3 classes, so the graph is the complete bipartite one between them.
--    The merkaba's two tetrahedra, which this deposit already decides are exchanged by doubling, turn out
--    to be the bipartition. Nothing here is a solid; it is K(3,3) wearing the ring's own split.

/-- the two tetrahedra, DERIVED as the mod-3 classes of the units rather than written out -/
def tetOf (r : Nat) : List Nat := (unitsMod 9).filter (fun d => d % 3 == r)

theorem the_unit_graph_is_complete_bipartite_between_the_two_tetrahedra :
  (tetOf 1).length = 3 ∧ (tetOf 2).length = 3 ∧
  (tetOf 1).all (fun d => (nbrs (unitsMod 9) d).length == 3 &&
    (nbrs (unitsMod 9) d).all (fun t => (tetOf 2).contains t)) ∧
  (tetOf 2).all (fun d => (nbrs (unitsMod 9) d).length == 3 &&
    (nbrs (unitsMod 9) d).all (fun t => (tetOf 1).contains t)) ∧
  -- and every neighbourhood is an INDEPENDENT set: three vertices, no edge among them
  (unitsMod 9).all (fun d => (nbrs (unitsMod 9) d).all (fun x =>
    (nbrs (unitsMod 9) d).all (fun y => x == y || !((nbrs (unitsMod 9) x).contains y)))) := by decide

-- ── what these settle ──
def settledHere : Nat := 32
theorem elementary_settles_its_range : settledHere = 32 := rfl


-- ── the capped rows above, proved for every value — no bound ──────────────────────────────────────────────────
-- the_interior_and_exterior_angles_are_n_straight_angles checked 3 ≤ n ≤ 32; this proves it for every n ≥ 2.
theorem the_interior_and_exterior_angles_are_n_straight_angles_for_every_n :
    ∀ n : Nat, 2 ≤ n → (n - 2) * 180 + 360 = n * 180 := by
  intro n h
  omega

theorem a_product_of_consecutive_numbers_is_even : ∀ n : Nat, n * (n + 1) % 2 = 0 := by
  intro n
  rcases Nat.mod_two_eq_zero_or_one n with h | h <;> simp [Nat.mul_mod, Nat.add_mod, h]

-- eight_times_a_triangular_number_plus_one_is_an_odd_square checked n < 60; this proves it for every n.
theorem eight_times_a_triangular_number_plus_one_is_an_odd_square_for_every_n :
    ∀ n : Nat, 8 * (n * (n + 1) / 2) + 1 = (2 * n + 1) * (2 * n + 1) := by
  intro n
  have hdiv : n * (n + 1) / 2 * 2 = n * (n + 1) :=
    Nat.div_mul_cancel (Nat.dvd_of_mod_eq_zero (a_product_of_consecutive_numbers_is_even n))
  have hexp : (2 * n + 1) * (2 * n + 1) = 4 * (n * (n + 1)) + 1 := by
    rw [Nat.mul_add n n 1, Nat.mul_one, Nat.add_mul, Nat.mul_add, Nat.mul_add, Nat.mul_one, Nat.one_mul]
    rw [Nat.mul_assoc 2 n (2 * n), Nat.mul_comm n (2 * n), Nat.mul_assoc 2 n n]
    omega
  rw [hexp]
  omega


-- ── the capped row above, proved for every value — no bound ──────────────────────────────────────────────────
-- the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis was checked n ≤ 28; this proves it for every n.
theorem the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis_for_every_n :
    ∀ n : Nat, lucas (n + 1) = fib n + fib (n + 2) := by
  have key : ∀ n : Nat, lucas (n + 1) = fib n + fib (n + 2) ∧ lucas (n + 2) = fib (n + 1) + fib (n + 3) := by
    intro n
    induction n with
    | zero => decide
    | succ n ih =>
      refine ⟨ih.2, ?_⟩
      have l : lucas (n + 3) = lucas (n + 1) + lucas (n + 2) := rfl
      have f4 : fib (n + 4) = fib (n + 2) + fib (n + 3) := rfl
      have f2 : fib (n + 2) = fib n + fib (n + 1) := rfl
      show lucas (n + 3) = fib (n + 2) + fib (n + 4)
      rw [l, ih.1, ih.2, f4]
      omega
  intro n
  exact (key n).1


-- ── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
theorem the_polygon_side_count_reads_back_from_its_angle_sum : ∀ n : Nat, 2 ≤ n → ((n - 2) * 180 + 360) / 180 = n := by
  intro n h; omega

theorem every_odd_square_one_more_than_eight_times_m_makes_m_triangular :
    ∀ m r : Nat, 8 * m + 1 = r * r → m = r / 2 * (r / 2 + 1) / 2 := by
  intro m r h
  have hodd : r % 2 = 1 := by
    rcases Nat.mod_two_eq_zero_or_one r with e | e
    · have : r * r % 2 = 0 := by simp [Nat.mul_mod, e]
      omega
    · exact e
  obtain ⟨t, rfl⟩ : ∃ t, r = 2 * t + 1 := ⟨r / 2, by omega⟩
  rw [show (2 * t + 1) / 2 = t by omega]
  have hexp : (2 * t + 1) * (2 * t + 1) = 4 * (t * (t + 1)) + 1 := by
    rw [Nat.mul_add t t 1, Nat.mul_one, Nat.add_mul, Nat.mul_add, Nat.mul_add, Nat.mul_one, Nat.one_mul]
    rw [Nat.mul_assoc 2 t (2 * t), Nat.mul_comm t (2 * t), Nat.mul_assoc 2 t t]
    omega
  have hev := a_product_of_consecutive_numbers_is_even t
  rw [hexp] at h
  generalize t * (t + 1) = P at h hev ⊢
  omega


-- ── reflections, from the sums batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
-- REFLECTION of the Lucas law: the Fibonacci numbers read back from the neighbouring Lucas numbers
theorem the_fibonaccis_are_a_fifth_of_the_neighbouring_lucas_numbers_for_every_n :
    ∀ n : Nat, 5 * fib (n + 1) = lucas n + lucas (n + 2) := by
  intro n
  cases n with
  | zero => decide
  | succ n =>
    have l1 := the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis_for_every_n n
    have l3 := the_lucas_numbers_are_the_sum_of_the_neighbouring_fibonaccis_for_every_n (n + 2)
    have f2 : fib (n + 2) = fib n + fib (n + 1) := rfl
    have f3 : fib (n + 3) = fib (n + 1) + fib (n + 2) := rfl
    have f4 : fib (n + 4) = fib (n + 2) + fib (n + 3) := rfl
    show 5 * fib (n + 2) = lucas (n + 1) + lucas (n + 2 + 1)
    rw [l1, l3, show n + 2 + 2 = n + 4 from rfl, f4]
    omega


-- ── reflections, from the extra batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
theorem half_a_product_of_consecutive_numbers_multiplies_back_for_every_n :
    ∀ n : Nat, n * (n + 1) / 2 * 2 = n * (n + 1) := by
  intro n
  exact Nat.div_mul_cancel (Nat.dvd_of_mod_eq_zero (a_product_of_consecutive_numbers_is_even n))

end Elementary
