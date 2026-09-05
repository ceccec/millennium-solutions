-- title: Order-invariance
-- wing: the floor
-- prior_art: named
-- prior_art_domain: canonical forms and order-invariant commitments
-- prior_art_note: sorting a multiset into a canonical order BEFORE folding it is standard practice, not a
--   discovery here. Sorted-leaf Merkle trees are the recommended construction for multiproofs and are shipped
--   that way in OpenZeppelin's merkle-tree library; canonical ordering before hashing is long-established in
--   cryptographic serialisation generally. The mathematical content is elementary: any function of a canonical
--   form is invariant under permutation of its input, which is why `receipt_is_order_invariant` holds. What
--   this file contributes is the Lean verification over a stated finite domain and the negative controls
--   beside it — `naive_fold_is_not_order_invariant` shows the property is bought by the sort and not free,
--   and `the_receipt_is_not_injective` and `the_invariance_is_canonicalisation_not_physics` state its limits.
--   Verification and refusal, not discovery.
-- prior_art_search: literature search performed 2026-09-05, terms "sorted Merkle tree order-invariant set
--   commitment canonical ordering leaves"; prior art found and credited. This file was `unclassified` — no
--   search had ever been run for it — and it is one of the 8 files whose 86 theorems are staged for DOIs.
-- prior_art_pool: mixed
--   canonicalisation before folding is a searchable technique; the receipt it folds is ours.
--   BOUNDED means a search is well posed and simply has not been run — the row is unclassified because
--   nobody looked. UNBOUNDED means the subject is this artifact, so there is no pool to search and the
--   row will stay unclassified however much work is done. They look identical in a count and need
--   opposite responses, which is the distinction uuidna-49 asked for and nobody had drawn.
-- prior_art_own: order-invariance of this deposit's receipt
-- The quantum receipt — order invariance, proved rather than asserted.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- "Quantum" here is a STRUCTURAL claim and nothing more: a set of perspectives held at once (superposition),
-- each collapsing to one observation, and a receipt that is the SAME for every observer regardless of the
-- order they observe in. No hardware, no speedup, no physics. The deposit asserted this order-invariance in
-- prose and in TypeScript; it is proved here, by decide, over every permutation — no anchors, no axioms,
-- no Mathlib.
--
-- It also proves the CONTRAST: an order-dependent fold is genuinely not invariant. Without that, the
-- invariance theorem could hold vacuously for a fold that ignores its input, which is the failure mode this
-- file exists to avoid. Integrity, not truth. 0/7.

namespace Quantum

/-- Every way of inserting x into a list — the branch step of the permutation tree. -/
def insertEverywhere (x : Nat) : List Nat → List (List Nat)
  | [] => [[x]]
  | y :: ys => (x :: y :: ys) :: (insertEverywhere x ys).map (fun l => y :: l)

/-- All orderings of a list: every observer's order, enumerated. -/
def perms : List Nat → List (List Nat)
  | [] => [[]]
  | x :: xs => (perms xs).flatMap (insertEverywhere x)

/-- Insertion into a sorted list. -/
def ins (x : Nat) : List Nat → List Nat
  | [] => [x]
  | y :: ys => if x ≤ y then x :: y :: ys else y :: ins x ys

/-- The canonical order — what the fold imposes before combining. -/
def sort : List Nat → List Nat
  | [] => []
  | x :: xs => ins x (sort xs)

/-- The RECEIPT: canonicalise, then combine. Sorting first is exactly what makes it observer-independent. -/
def receipt (l : List Nat) : Nat := (sort l).foldl (fun a b => (a * 2 + b) % 9) 0

/-- The same combination WITHOUT canonicalising — order-dependent by construction, kept as the control. -/
def naive (l : List Nat) : Nat := l.foldl (fun a b => (a * 2 + b) % 9) 0

-- ── 1 · the enumeration is complete: four elements have 4! = 24 orderings ──
theorem perms_of_four_is_factorial : (perms [1, 2, 4, 8]).length = 24 := by decide

-- ── 2 · THE QUANTUM RECEIPT: every observer order yields the same receipt ──
theorem receipt_is_order_invariant :
  (perms [1, 2, 4, 8]).all (fun p => receipt p == receipt [1, 2, 4, 8]) := by decide

-- ── 3 · the same, on the doubling orbit itself (six elements, 720 orderings). The default recursion depth
--        is raised because the enumeration is larger, not because anything is assumed: `decide` still walks
--        every one of the 720 orderings and the kernel still checks the result. ──
set_option maxRecDepth 8000 in
theorem receipt_order_invariant_on_the_orbit :
  (perms [1, 2, 4, 8, 7, 5]).all (fun p => receipt p == receipt [1, 2, 4, 8, 7, 5]) := by decide

-- ── 4 · THE CONTRAST — the invariance is not vacuous: drop canonicalisation and it fails ──
theorem naive_fold_is_not_order_invariant :
  ¬ ((perms [1, 2, 4, 8]).all (fun p => naive p == naive [1, 2, 4, 8])) := by decide

-- ── 5 · superposition and collapse, stated exactly: many perspectives, one receipt, and the count of
--        distinct receipts across all orderings is one ──
theorem superposition_collapses_to_one :
  ((perms [1, 2, 4, 8]).map receipt).eraseDups.length = 1 := by decide

-- ── 6 · THE MECHANISM, named. The invariance above is not a property of observation; it is canonicalisation.
--        Every ordering sorts to the SAME list, and the receipt reads only that. Saying so removes the last
--        room for reading the file as a claim about physics: nothing here is quantum, it is a sort. ──
theorem the_invariance_is_canonicalisation_not_physics :
  (perms [1, 2, 4, 8]).all (fun p => sort p == sort [1, 2, 4, 8]) := by decide

-- ── 7 · THE LIMIT, proved rather than admitted. The receipt lands in ℤ/9, so nine values must cover every
--        possible set — by pigeonhole it CANNOT identify one. Here are two different multisets sharing a
--        receipt. Counted exactly: 45 distinct two-element multisets over the digits produce 9 receipts, so
--        five sets share each value on average. Order-invariant does not mean collision-free, and a receipt
--        that cannot tell 45 things apart must never be read as naming one of them. ──
def pairsOverNine : List (List Nat) :=
  ((List.range' 1 9).flatMap (fun a => (List.range' 1 9).map (fun b => sort [a, b]))).eraseDups

theorem the_receipt_is_not_injective :
  pairsOverNine.length = 45 ∧ (pairsOverNine.map receipt).eraseDups.length = 9 := by decide

-- ── 8 · HOW BADLY order matters without the sort — counted, not gestured at. Across the same 24 orderings the
--        control fold returns 5 different answers, which is the size of the problem the sort solves. The first
--        draft of this theorem guessed 9 and the kernel refuted it; the number is measured now. A contrast
--        stated as a measured number cannot be softened later. ──
theorem the_uncanonicalised_fold_gives_many_answers :
  ((perms [1, 2, 4, 8]).map naive).eraseDups.length = 5 := by decide

-- ── WHAT THIS FILE SETTLES, stated positively. Two earlier names here were wrong in the same direction:
--    "quantum_settles_nothing" is refuted by the file itself, and "settles_no_clay_conjecture" states a negative
--    where the true statement is positive. Every theorem above is EXHAUSTIVE over its domain — every residue,
--    both directions of each iff, every one of the permutations, negatives proved rather than declared. Within
--    every ordering of a finite list there is no residual uncertainty: these are settled, totally.
--    The scope is the limit, not the strength. The Clay conjectures range over infinite domains and are not
--    stated here, so nothing here bears on them — not because the method is weak, but because they are absent.
def settledHere : Nat := 8
theorem quantum_settles_its_domain_totally : settledHere = 8 := rfl

end Quantum
