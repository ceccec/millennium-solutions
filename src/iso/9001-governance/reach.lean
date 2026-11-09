set_option maxRecDepth 8000000
-- title: What exhaustion reaches, and what lies outside it
-- wing: the floor
-- prior_art: named
-- prior_art_domain: elementary set theory — the naturals are not exhausted by any finite list
-- prior_art_note: that no finite set contains every natural number is Euclid's argument in form and is as
--   old as mathematics; the deposit claims none of it. What is its own here is the decision over its OWN
--   bounds, and the statement of where that decision stops.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- THE QUESTION, asked directly: does a `by decide` proof of a Clay conjecture exist in this deposit?
--
-- The honest way to answer is not prose. `by decide` proves a proposition by walking its domain and
-- reporting what it found; it needs a Decidable instance, and it gets one by the domain being finite. Every
-- theorem in this tree is of that kind, and the largest domain any of them walks is 152,568,360,000 cases.
-- Each of the seven Clay conjectures quantifies over an infinite set. So the question is whether an
-- exhaustion can reach past its own bound.
--
-- It cannot, and that is decided below at fifty bounds: for each n, walking the first n naturals does not
-- reach n. Not once, at a flattering bound — at every one of them.
--
-- WHAT IS NOT PROVED HERE, said as plainly as what is. This decides the statement AT FIFTY BOUNDS. The
-- universal "for every n" needs induction, and induction is not exhaustion — it is the tactic this deposit
-- does not use, because its rule is that a theorem walks its domain. So the file demonstrates the boundary
-- at every bound it checks and does not claim the quantifier. A reader who wants the universal has it from
-- Euclid and does not need this deposit for it.
--
-- The answer to the question, then: no. Not because the seven are hard, and not because the effort was not
-- made — because the method reaches exactly as far as it counts, and a conjecture over an infinite domain
-- lies outside every count. That is a fact about `decide`, not a verdict on the conjectures.

namespace Reach

def bounds : List Nat := List.range' 1 50

-- ── 1 · AN EXHAUSTION DOES NOT REACH ITS OWN BOUND ──────────────────────────────────────────────────────
-- Walking the first n naturals produces exactly n of them, and n is not among them. Checked at fifty
-- bounds, so this is not one convenient n.
theorem exhaustion_never_reaches_its_own_bound :
  bounds.all (fun n => (List.range n).length == n && ¬ (List.range n).contains n) := by decide

-- ── 2 · AND SOMETHING ALWAYS LIES OUTSIDE ───────────────────────────────────────────────────────────────
-- The successor of the bound is outside the walk, at every bound checked. This is the shape of the whole
-- limit: whatever finite domain a theorem here exhausts, the naturals continue past it.
theorem the_successor_of_every_bound_lies_outside :
  bounds.all (fun n => ¬ (List.range n).contains (n + 1)) := by decide

-- ── 3 · GROWING THE BOUND DOES NOT CLOSE THE GAP ────────────────────────────────────────────────────────
-- Doubling the domain leaves the same hole. An exhaustion is not made complete by being made larger, which
-- is why no amount of compute turns this method into a proof over an infinite domain.
theorem doubling_the_domain_leaves_the_same_hole :
  bounds.all (fun n => ¬ (List.range (2 * n)).contains (2 * n)) := by decide

-- ── 4 · THE DEPOSIT'S OWN LARGEST DOMAIN IS STILL A BOUND ───────────────────────────────────────────────
-- 152,568,360,000 is the largest case-count any theorem in this tree walks. It is enormous and it is finite,
-- and the naturals do not stop there. Stated as a LAW with its inverse — the successor leaves every bound, the
-- predecessor brings it back, and the step flips parity — decided at every bound above AND at the largest
-- domain, so the number is an instance of the law rather than a value read back (2026-09-14).
def largestDomainHere : Nat := 152568360000

theorem the_successor_leaves_every_domain_and_the_predecessor_returns :
  (bounds ++ [largestDomainHere]).all (fun n =>
    n + 1 > n && (n + 1) - 1 == n && (n + 1) % 2 != n % 2) := by decide

-- ── AND FOR EVERY n, WHICH NO EXHAUSTION ABOVE CAN SAY. The file's point is that `decide` stops at its bound;
--    this is what goes past it: a PROOF that the predecessor returns every successor, for all naturals at once.
--    It is the only kind of statement that reaches an unbounded domain, and it rests on the standard axiom
--    propext, printed by lean.ts. ──
theorem the_predecessor_returns_every_successor : ∀ n : Nat, (n + 1) - 1 = n := by
  intro n; exact Nat.add_sub_cancel n 1

-- ── 5 · A THEOREM NAMED FOR THE CLAY PROBLEMS THAT DECIDED NOTHING ABOUT THEM — DELETED ─────────────────
-- `this_file_settles_none_of_the_seven` stood here and decided:
--
--     (bounds.filter (fun n => (List.range n).contains n)).length = 0  ∧  bounds.length = 50
--
-- `List.range n` is [0 … n-1] and NEVER contains n. The predicate is always false, the filter is always
-- empty, and the first conjunct holds for ANY list at all — it cannot fail. The second is a count. Nothing
-- in the proposition mentions a Clay problem, and the NAME asserted that this file settles none of them.
--
-- The comment above it argued it was written "rather than as a bare constant compared to itself — that
-- shape was removed from index.lean earlier and is not coming back through this door." It came back through
-- that door in a costume: an always-false predicate is a self-certifying literal one notation along, and
-- recognising the first shape did not confer recognition of the second.
--
-- THE FLOOR IS TRUE AND IS HELD WHERE IT CAN BE. That this deposit settles no Clay problem is a fact about
-- its TEXT — which theorem names and statements appear — and Lean cannot read its own text. It is decided
-- by scripts/contradictions.ts, which catches 960 Clay overclaim phrasings and is run on every commit, and
-- by claims-gate and boundaries. A refusal belongs in the layer that can observe it, and a Lean theorem
-- named for one it cannot observe is worse than no theorem: it reads as a kernel-checked proof of a
-- statement the kernel never saw.


-- ── the three bounded rows above, proved for every bound — no list of bounds ─────────────────────────────────
-- the file's own point, now without a range: no exhaustion over 0..n-1 contains n, n + 1, or (at 2n) 2n.
theorem exhaustion_never_reaches_its_own_bound_for_every_n : ∀ n : Nat, (List.range n).length = n ∧ n ∉ List.range n := by
  intro n
  exact ⟨List.length_range n, fun h => Nat.lt_irrefl n (List.mem_range.mp h)⟩
theorem the_successor_of_every_bound_lies_outside_for_every_n : ∀ n : Nat, n + 1 ∉ List.range n := by
  intro n h
  exact Nat.lt_irrefl n (Nat.lt_trans (Nat.lt_succ_self n) (List.mem_range.mp h))
theorem doubling_the_domain_leaves_the_same_hole_for_every_n : ∀ n : Nat, 2 * n ∉ List.range (2 * n) := by
  intro n h
  exact Nat.lt_irrefl (2 * n) (List.mem_range.mp h)


-- ── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
theorem the_successor_returns_every_positive_predecessor : ∀ n : Nat, 0 < n → (n - 1) + 1 = n := by
  intro n h; omega

theorem exhaustion_reaches_everything_below_its_bound_for_every_n : ∀ n k : Nat, k < n → k ∈ List.range n := by
  intro n k h; exact List.mem_range.mpr h

theorem the_predecessor_of_every_positive_bound_lies_inside : ∀ n : Nat, 0 < n → n - 1 ∈ List.range n := by
  intro n h; exact List.mem_range.mpr (by omega)


-- ── reflections, from the extra batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
theorem halving_the_domain_keeps_the_half_inside_for_every_n : ∀ n : Nat, 0 < n → n ∈ List.range (2 * n) := by
  intro n h; exact List.mem_range.mpr (by omega)

end Reach
