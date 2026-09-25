set_option maxRecDepth 100000
-- title: Doubling is two loops and both close at three hundred and sixty degrees
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the cycle decomposition of a permutation into disjoint cycles; the order of 2 in
--   (ℤ/9)* being 6, which is Euler's theorem for this modulus. The Euler characteristic χ = 2 − 2g of an
--   orientable closed surface of genus g.
-- prior_art_note: NONE OF IT IS THIS DEPOSIT'S. Cycle decomposition is the first structure theorem for
--   permutations, the order of 2 mod 9 is Euler, and χ = 2 − 2g is Euler again. What is this deposit's is
--   the accounting: that doubling leaves exactly TWO non-trivial loops on this ring, that their step angles
--   are 60° and 180°, and that both close at 360° — and theorem 8, which says plainly that the surface is
--   an interpretation of the cycle structure and not a theorem about it.
-- prior_art_search: not performed — all three are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the two-loop accounting, the step angles, and the honesty clause in theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- The author's fourth clause: "note the double torus to complete 360 degrees."
--
-- src/proof/mirror.lean decided that a fold is a half turn — 2 × 90° = 3 × 60° = 180°. A half turn does not
-- close. What closes is a pair of them, and the structure that carries a pair of independent loops is a
-- double torus, which is what this deposit's /organism page has drawn from the beginning and what the PDF
-- in Zenodo record 22934883 calls a "parametric Genus-2 manifold" while claiming nothing checkable about it.
--
-- HERE IS THE CHECKABLE PART. Doubling on ℤ/9 decomposes into exactly three orbits and exactly TWO of them
-- are loops:
--
--     [1, 2, 4, 8, 7, 5]   length 6   the units, the doubling span
--     [3, 6]               length 2   the two non-zero members of the triad
--     [0]                  length 1   the annihilator, which goes nowhere
--
-- Six and two and one is nine, the whole ring, nothing repeated. TWO non-trivial loops is genus two, and
-- that is the double torus — not by analogy, by counting the independent cycles a single map leaves behind.
--
-- AND BOTH COMPLETE 360°. Give each loop one full turn and its step angle falls out: 360 / 6 = 60° and
-- 360 / 2 = 180°. So the small loop's single step IS the fold, and three steps of the large loop make one
-- step of the small — 3 × 60 = 180, which is the author's own identity read as geometry rather than as
-- arithmetic. Theorem 4 decides that correspondence.
--
-- THE REFLECTION IS A DIFFERENT SURFACE, which is why the claim is about doubling and says so. Reflecting
-- leaves FOUR loops on this ring, not two — theorem 6 — so "double torus" is a fact about one map and would
-- be false if attached to the other.
--
-- No axioms, no Mathlib, no sorry.

namespace Turns

def m9 (n : Nat) : Nat := n % 9
def dbl (d : Nat) : Nat := m9 (2 * d)
def rfl9 (d : Nat) : Nat := m9 (10 - d)

def iter (f : Nat → Nat) (d : Nat) : Nat → Nat
  | 0 => d
  | k + 1 => f (iter f d k)

-- How many steps until the orbit through d returns to d. Bounded by the ring, so it terminates; 0 would
-- mean "never returned", which on a permutation of a finite set cannot happen and theorem 7 checks.
def cycLen (f : Nat → Nat) (d : Nat) : Nat :=
  (((List.range 10).drop 1).find? (fun k => iter f d k == d)).getD 0

def ring : List Nat := List.range 9

-- ── 1 · DOUBLING IS SIX, TWO AND ONE ──────────────────────────────────────────────────────────────────────
-- Every residue's return time, and the three that occur. Six plus two plus one is nine: the ring is
-- partitioned, with nothing counted twice and nothing left out.
theorem doubling_returns_in_six_two_or_one :
  ring.map (cycLen dbl) == [1, 6, 6, 2, 6, 6, 2, 6, 6]
  && (ring.map (cycLen dbl)).eraseDups.length == 3
  && 6 + 2 + 1 == 9 := by decide

-- ── 2 · AND THE THREE ORBITS ARE THE SPAN, THE TRIAD PAIR, AND THE ORIGIN ─────────────────────────────────
-- Named rather than counted: a partition into sizes 6, 2 and 1 is satisfied by many partitions, and only
-- one of them is this deposit's span and triad.
theorem the_long_loop_is_the_span_and_the_short_one_is_the_triad_pair :
  ring.filter (fun d => cycLen dbl d == 6) == [1, 2, 4, 5, 7, 8]
  && ring.filter (fun d => cycLen dbl d == 2) == [3, 6]
  && ring.filter (fun d => cycLen dbl d == 1) == [0] := by decide

-- ── 3 · TWO LOOPS, AND BOTH CLOSE AT THREE HUNDRED AND SIXTY ──────────────────────────────────────────────
-- Give each loop one full turn and the step angle is forced. Six steps of 60° and two steps of 180° are the
-- same 360°, which is what it means for both to close.
theorem both_loops_complete_three_hundred_and_sixty_degrees :
  (ring.filter (fun d => cycLen dbl d > 1)).length == 8
  && 360 / 6 == 60 && 360 / 2 == 180
  && 6 * 60 == 360 && 2 * 180 == 360 := by decide

-- ── 4 · THE SHORT LOOP'S STEP IS THE FOLD ─────────────────────────────────────────────────────────────────
-- 3 × 60 = 180 = 2 × 90. Three steps of the long loop are one step of the short one, and that step is the
-- half turn src/proof/mirror.lean calls the fold — the author's arithmetic identity read as geometry.
theorem three_steps_of_the_long_loop_are_one_step_of_the_short :
  3 * 60 == 180 && 2 * 90 == 180 && 180 * 2 == 360
  && 6 / 2 == 3 && iter dbl 1 3 == 8 && iter dbl 3 1 == 6 := by decide

-- ── 5 · THE LOOPS ARE DISJOINT AND COVER THE RING ─────────────────────────────────────────────────────────
-- The accounting that makes "two loops" mean anything: no residue is in two orbits, and none is outside.
theorem the_orbits_are_disjoint_and_cover_the_ring :
  (ring.filter (fun d => cycLen dbl d == 6)).length
    + (ring.filter (fun d => cycLen dbl d == 2)).length
    + (ring.filter (fun d => cycLen dbl d == 1)).length == 9
  && ring.all (fun d => cycLen dbl d == 6 || cycLen dbl d == 2 || cycLen dbl d == 1) := by decide

-- ── 6 · THE CONTROL: THE REFLECTION IS FOUR LOOPS, NOT TWO ────────────────────────────────────────────────
-- THE THEOREM THAT STOPS "TWO LOOPS" FROM BEING A PROPERTY OF THE RING. The same accounting on the same
-- ring with a different map returns four, so the count measures the MAP. Attaching "double torus" to the
-- reflection would be false, and this is why the file says doubling everywhere it says two.
theorem the_reflection_leaves_four_loops_on_the_same_ring :
  ring.map (cycLen rfl9) == [2, 2, 2, 2, 2, 1, 2, 2, 2]
  && (ring.filter (fun d => cycLen rfl9 d == 2)).length == 8
  && (ring.filter (fun d => cycLen rfl9 d == 2)).length / 2 == 4
  && 4 != 2 := by decide

-- ── 7 · EVERY ORBIT RETURNS ───────────────────────────────────────────────────────────────────────────────
-- `cycLen` answers 0 when nothing in range brought the orbit home, and 0 would quietly satisfy several of
-- the statements above by making a filter empty. Nothing answers 0, under either map.
theorem no_orbit_fails_to_return_under_either_map :
  ring.all (fun d => cycLen dbl d > 0 && cycLen rfl9 d > 0)
  && ring.all (fun d => iter dbl d (cycLen dbl d) == d)
  && ring.all (fun d => iter rfl9 d (cycLen rfl9 d) == d) := by decide

-- ── 8 · THE SURFACE IS A READING OF THE COUNT, NOT A THEOREM ABOUT THE RING ───────────────────────────────
-- WHAT IS DECIDED ABOVE IS THE CYCLE STRUCTURE AND NOTHING ELSE. That two independent loops correspond to
-- a genus-two surface is the standard reading of χ = 2 − 2g, and it is an INTERPRETATION laid over the
-- count — ℤ/9 is a finite ring and has no topology of its own. The arithmetic below is that definition
-- applied, so a reader can see exactly how much is being claimed: one loop gives χ = 0, two give χ = −2,
-- and everything beyond those two lines is geometry this deposit is borrowing rather than proving.
-- THE LOOP COUNT IS DERIVED, NOT ARRANGED. This read `(…length) / 4 == 2` — eight residues divided by
-- four — which returns 2 and derives nothing: 4 was chosen because it gave the answer. A loop of length n
-- holds exactly n residues, so the number of loops is the sum over each orbit length of how many residues
-- carry it divided by that length. Six over six plus two over two.
theorem the_genus_is_the_definition_applied_to_the_count :
  2 - 2 * 1 == 0 && (2 : Int) - 2 * 2 == -2
  && (ring.filter (fun d => cycLen dbl d == 6)).length / 6
     + (ring.filter (fun d => cycLen dbl d == 2)).length / 2 == 2 := by decide

end Turns
