import Z9
set_option maxRecDepth 8000000
-- A TIME BUDGET, NOT A SOUNDNESS SETTING. Theorem 1 checks every pair of the 81 maps at every residue —
-- 81 x 81 x 9 cases — and the default heartbeat limit stops the elaborator partway through and
-- reports a timeout, which this generator first printed as a refusal. The kernel was never in doubt about
-- the mathematics; it was not given long enough to finish counting. maxHeartbeats is already carried by
-- eleven files here for the same reason. Nothing about what decide must establish is relaxed by it.
set_option maxHeartbeats 2000000
-- title: The structure the statements live in
-- wing: the imagined
-- prior_art: named
-- prior_art_domain: the one-dimensional affine group AGL(1,n) over Z/n — standard finite group theory
-- prior_art_note: AGL(1,n) has order phi(n)*n, which for n=9 is 6*9=54. Nothing here claims the group is new.
-- prior_art_note: What is new is that this deposit's own derived map table is stated as the monoid it is,
-- prior_art_note: with the group inside it named, generated to closure, and checked against invertibility.
-- prior_art_search: 2026-09-28
-- NOTE ON THE FIELD ABOVE: prior_art is a CLASSIFICATION — named, unclassified or none-known — and this
-- generator first wrote a sentence into it. scripts/priorart.ts rejected the file and the deploy went red;
-- the prose belongs in prior_art_note, which is what it is for.
-- GROUP — written by scripts/group.ts. qpu.uuidna.com, asked to prove one of this deposit's map statements,
-- refused it as UNVERIFIED and said what it wanted instead: name the finite structure the claim lives in,
-- generate from the generators to closure, and assert the closure property or the cardinality. The tens of
-- thousands of individual map statements in src/proof/imagined*.lean are instances of the eight theorems here.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Groups

open Z9

-- The affine maps of ℤ/9 as pairs (a, b), standing for d ↦ a·d + b. A map IS its pair here, which is
-- why equality of maps is decidable: two pairs are the same map exactly when they act the same, and over a
-- ring this small that is settled by the pair alone.
def A : Type := Nat × Nat
def ap (p : Nat × Nat) (d : Nat) : Nat := (p.1 * d + p.2) % 9
def cmp (p q : Nat × Nat) : Nat × Nat := ((p.1 * q.1) % 9, (p.1 * q.2 + p.2) % 9)
def aff : List (Nat × Nat) := [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4), (0, 5), (0, 6), (0, 7), (0, 8), (1, 0), (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (2, 0), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (3, 0), (3, 1), (3, 2), (3, 3), (3, 4), (3, 5), (3, 6), (3, 7), (3, 8), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (5, 0), (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (6, 0), (6, 1), (6, 2), (6, 3), (6, 4), (6, 5), (6, 6), (6, 7), (6, 8), (7, 0), (7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 7), (7, 8), (8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8)]
def agl : List (Nat × Nat) := [(1, 0), (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (2, 0), (2, 1), (2, 2), (2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (4, 0), (4, 1), (4, 2), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (5, 0), (5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (7, 0), (7, 1), (7, 2), (7, 3), (7, 4), (7, 5), (7, 6), (7, 7), (7, 8), (8, 0), (8, 1), (8, 2), (8, 3), (8, 4), (8, 5), (8, 6), (8, 7), (8, 8)]
def one : Nat × Nat := (1, 0)

-- ── 1 · COMPOSITION IS THE SAME MAP EITHER WAY IT IS COMPUTED ────────────────────────────────────────────
-- The pair arithmetic has to BE composition before anything below means what it says. Applying the composite
-- and applying one map after the other agree at every residue, for every pair of the 81 — which
-- is what licenses the rest of this file to reason about pairs instead of about functions.
theorem the_pair_arithmetic_is_composition :
  aff.all (fun p => aff.all (fun q => [0,1,2,3,4,5,6,7,8].all (fun d => ap (cmp p q) d == ap p (ap q d)))) := by decide

-- ── 2 · THE 81 AFFINE MAPS ARE CLOSED UNDER COMPOSITION, SO THEY ARE A MONOID ─────────────────────────
-- Every "this composite is that map" theorem the enumeration proves is an instance of this one statement.
theorem the_affine_maps_are_closed_under_composition :
  aff.all (fun p => aff.all (fun q => aff.contains (cmp p q)))
  ∧ aff.contains one
  ∧ aff.all (fun p => cmp p one == p && cmp one p == p)
  ∧ aff.length = 81 := by decide

-- ── 3 · AND THEY ARE NOT A GROUP — EXACTLY 54 OF THEM INVERT ──────────────────────────────────────────
-- The distinction nothing in the deposit had stated. A map whose multiplier is not a unit destroys
-- information: it cannot be undone, so the monoid is not a group, and saying "the affine maps of ℤ/9" as
-- though they were one is the kind of near-miss that survives because it is almost right.
theorem exactly_54_of_the_81_affine_maps_have_an_inverse :
  (aff.filter (fun p => aff.any (fun q => cmp p q == one && cmp q p == one))).length = 54
  ∧ 54 < 81 := by decide

-- ── 4 · THE INVERTIBLE ONES ARE AGL(1, ℤ/9), GENERATED FROM 2 GENERATORS TO CLOSURE ─────────────────────
-- Generated, not selected: scripts/group.ts walks the shift and a primitive multiplier to closure and the
-- 54 elements are what the walk reaches. This theorem is the walk's result put to the kernel — the set is
-- closed, contains the identity, every element has an inverse INSIDE it, and its order is 6 × 9.
theorem the_invertible_affine_maps_are_a_group_of_order_54 :
  agl.all (fun p => agl.all (fun q => agl.contains (cmp p q)))
  ∧ agl.contains one
  ∧ agl.all (fun p => agl.any (fun q => cmp p q == one && cmp q p == one))
  ∧ agl.length = 54
  ∧ 54 = 6 * 9 := by decide

-- ── 5 · THE GROUP IS EXACTLY THE INVERTIBLE SET, WHICH IS WHAT MAKES 4 A THEOREM ABOUT 3 ─────────────────
-- Two descriptions reached two ways — one by walking generators, one by testing each map for an inverse —
-- and they name the same 54 maps. Corroboration is the weakest evidence this repository accepts, so it is
-- stated as an identity of sets rather than as two counts that happen to agree.
theorem the_generated_group_is_exactly_the_invertible_set :
  agl.all (fun p => aff.any (fun q => cmp p q == one && cmp q p == one))
  ∧ (aff.filter (fun p => aff.any (fun q => cmp p q == one && cmp q p == one))).all (fun p => agl.contains p)
  ∧ agl.length = (aff.filter (fun p => aff.any (fun q => cmp p q == one && cmp q p == one))).length := by decide

-- ── 7 · THE GROUP IS NOT ABELIAN, WHICH IS WHY "DO THESE TWO COMMUTE" IS A QUESTION AT ALL ──────────────
-- imagine.ts asks it once per pair of maps per set and decides each instance separately. One witness settles
-- the general shape: two elements of the group whose composites differ, taken from the walk rather than
-- chosen. If the group were abelian every one of those thousands of statements would hold for free, and
-- filter 3 would have discarded the family as naming nothing.
theorem the_group_is_not_abelian :
  cmp (1, 1) (2, 0)
    != cmp (2, 0) (1, 1)
  ∧ agl.contains (1, 1)
  ∧ agl.contains (2, 0)
  ∧ ¬ agl.all (fun p => agl.all (fun q => cmp p q == cmp q p)) := by decide

-- ── 8 · AND ITS CENTRE IS THE IDENTITY ALONE, WHICH IS THE STRONGEST FORM OF THAT ────────────────────────
-- Not merely non-abelian: NOTHING but the identity commutes with everything. So every commuting pair in the
-- corpus commutes for a reason local to that pair, never because the element is central — which is what
-- makes each of those statements carry information instead of restating a property of the group.
theorem the_centre_of_the_group_is_the_identity_alone :
  (agl.filter (fun p => agl.all (fun q => cmp p q == cmp q p))).length = 1
  ∧ (agl.filter (fun p => agl.all (fun q => cmp p q == cmp q p))) = [one]
  ∧ 1 < agl.length := by decide

-- ── 6 · AND THE 9 MAPS THAT COLLAPSE THE RING SIT OUTSIDE IT ──────────────────────────────────────
-- Every "collapses to one value" theorem in the corpus is this: a multiplier of zero sends the whole ring to
-- one residue. They are outside the group for the same reason they collapse — no inverse can recover what a
-- constant map threw away.
theorem the_9_collapsing_maps_are_exactly_those_outside_the_group_that_kill_the_ring :
  (aff.filter (fun p => ([0,1,2,3,4,5,6,7,8].map (fun d => ap p d)).eraseDups.length == 1)).length = 9
  ∧ (aff.filter (fun p => ([0,1,2,3,4,5,6,7,8].map (fun d => ap p d)).eraseDups.length == 1)).all
      (fun p => ! agl.contains p) := by decide

end Groups
