set_option maxRecDepth 8000000
-- title: What exhaustion reaches, and what lies outside it
-- wing: the floor
-- prior_art: named
-- prior_art_domain: elementary set theory — the naturals are not exhausted by any finite list
-- prior_art_note: that no finite set contains every natural number is Euclid's argument in form and is as
--   old as mathematics; the deposit claims none of it. What is its own here is the decision over its OWN
--   bounds, and the statement of where that decision stops.
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
-- and the naturals do not stop there. Stated with the number so the point cannot be read as rhetorical.
def largestDomainHere : Nat := 152568360000

theorem even_the_largest_domain_here_has_an_outside :
  largestDomainHere + 1 > largestDomainHere
  ∧ largestDomainHere % 2 = 0
  ∧ (largestDomainHere + 1) % 2 = 1 := by decide

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

end Reach
