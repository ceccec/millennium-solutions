set_option maxRecDepth 100000
-- title: Why an array is the criterion of a cross formula and a hash cannot be one
-- wing: the ring
-- prior_art: named
-- prior_art_domain: extensional equality of functions over a finite domain; the pigeonhole principle; the
--   fibre of a map. All three are elementary and none is this deposit's.
-- prior_art_note: NOT THIS DEPOSIT'S. That two functions agreeing at every point of a finite domain are the
--   same function is the definition of extensionality; that a map from a larger finite set to a smaller one
--   repeats a value is Dirichlet's pigeonhole. What is this deposit's is only the application: deciding that
--   its OWN cross-formula machinery rests on the first and that its OWN addresses are excluded by the second.
-- prior_art_search: not performed — both are named above.
-- prior_art_pool: bounded
-- prior_art_own: the application to this tree's coils and receipts, and the separations
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- THE QUESTION THIS ANSWERS, asked directly: why are arrays and hashes not the RESULT of cross formulas?
--
-- It was answered in prose first and that is not an answer here. A result this deposit has only stated is
-- not a result, so it is decided below.
--
-- AND THE FIRST ANSWER GIVEN HERE WAS THE WRONG ONE. Asked why arrays and hashes are not results of cross
-- formulas, this file originally argued that they cannot be: the array is the criterion, the hash is excluded.
-- That answers a different question. BOTH ARE RESULTS, plainly:
--
--   · AN ARRAY IS THE IMAGE OF A GRID UNDER A FORMULA. `ext f = grid.map f` — the extension is COMPUTED, and
--     every array in this deposit's vocabulary arrives that way. It is then also the criterion by which two
--     expressions are compared, which is what confused the first answer: being the yardstick does not stop it
--     being an output. It is both, and theorem 1 decides the second while theorems 9 and 10 decide the first.
--   · A HASH IS A FOLD, WHICH IS A FORMULA OVER AN ARRAY. merkleFold combines a list into one value;
--     toUuid composes; the ledger's receipt chain is a RECURRENCE, receipt[i] from receipt[i-1] and key[i].
--     Each address is the result of applying a formula, and the whole ledger is the result of iterating one.
--
-- What is true, and was mistaken for the answer, is NARROWER and is kept below as its own claim: an agreement
-- between two hash OUTPUTS does not give an identity between their INPUTS. That is a fact about collisions,
-- not about whether a hash is computed by a formula — it obviously is.
--
-- No axioms, no Mathlib, no sorry.

namespace Extension

def grid : List Nat := List.range 12

-- Two expressions over the grid, as functions. `ext` is their extension: the array of what they compute.
def ext (f : Nat → Nat) : List Nat := grid.map f

-- A small hash, and the one this deposit actually uses in miniature: the digit root lands in nine values.
def dr (n : Nat) : Nat := if n = 0 then 0 else 1 + (n - 1) % 9

-- ── 1 · THE EXTENSION IS THE CRITERION, AND IT DECIDES BOTH WAYS ──────────────────────────────────────────
-- Coiling over a finite grid is EXACTLY array equality: agreement at every point gives the same array, and
-- the same array gives agreement at every point. That is why the array is the input to the verdict — the
-- verdict is a function of it, and a function cannot produce its own argument.
theorem coiling_over_a_grid_is_exactly_equality_of_extensions :
  (grid.all (fun n => (fun k => 2 * k) n == (fun k => k + k) n)) == (ext (fun k => 2 * k) == ext (fun k => k + k))
  ∧ (grid.all (fun n => (fun k => 2 * k) n == (fun k => 3 * k) n)) == (ext (fun k => 2 * k) == ext (fun k => 3 * k))
  ∧ ext (fun k => 2 * k) = ext (fun k => k + k)
  ∧ ext (fun k => 2 * k) ≠ ext (fun k => 3 * k) := by decide

-- ── 2 · AGREEMENT ON A PREFIX IS NOT AGREEMENT, WHICH IS WHY THE WHOLE ARRAY IS NEEDED ─────────────────────
-- If a coil could be settled by part of the extension, the array would not be the criterion — a sample would.
-- It cannot: these two agree on the first nine points of the grid and part at the tenth. THIS IS NOT A TOY.
-- An outside catalogue was asked to corroborate one of this deposit's identities on eight terms and returned
-- "the positive integers" for the digit root, because the two are indistinguishable until the tenth. The
-- search was widened after the fact; the reason it had to be is decided here.
theorem agreement_on_a_prefix_is_not_agreement :
  (List.range' 1 9).all (fun n => dr n == n)
  ∧ dr 10 != 10
  ∧ ext dr ≠ ext (fun k => k)
  ∧ ((List.range' 1 9).map dr) = ((List.range' 1 9).map (fun k => k)) := by decide

-- ── 3 · A HASH COLLIDES BY COUNTING ALONE, BEFORE ANY QUESTION OF QUALITY ──────────────────────────────────
-- Ten inputs into nine values must repeat one: the pigeonhole, decided here rather than cited. So a hash has
-- fibres with more than one element BY CONSTRUCTION, and no amount of care removes them.
theorem a_hash_into_nine_values_must_repeat :
  ((List.range' 1 10).map dr).eraseDups.length < (List.range' 1 10).length
  ∧ ((List.range' 1 10).map dr).eraseDups.length = 9
  ∧ (List.range' 1 10).length = 10 := by decide

-- ── 4 · AND A COLLISION DOES NOT LIFT TO AN IDENTITY — THE WHOLE ANSWER, IN ONE LINE ───────────────────────
-- 1 and 10 share a digit root. If an agreement of OUTPUTS were a cross formula, that would make them the same
-- input. It does not: they differ, they differ as extensions, and the functions that produced them differ at
-- points the hash never sees. A coil transfers everything about two expressions; a collision transfers nothing.
theorem a_collision_does_not_lift_to_an_identity :
  dr 1 = dr 10
  ∧ (1 : Nat) ≠ 10
  ∧ ext (fun _ => 1) ≠ ext (fun _ => 10)
  ∧ ¬ (grid.all (fun n => (n + 1) == (n + 10))) := by decide

-- ── 5 · WHAT A HASH DESTROYS IS EXACTLY WHAT A COIL NEEDS ─────────────────────────────────────────────────
-- A coil is decided by the whole extension, so it needs every point recoverable. A hash keeps one value and
-- discards the rest — that is its purpose. Counted here: the grid has twelve points and the digit roots of it
-- take nine values, so the map from extension to hash is not reversible and the deficit is the information a
-- coil would have used.
-- THE COUNT IS TEN AND NOT NINE, AND THE KERNEL SAID SO. I wrote nine from the shape of the thing — a digit
-- root "lands in nine values" — and forgot that this grid starts at zero, whose root is zero and is a tenth
-- value the nine never included. The deficit is 2, not 3. Guessing a count from the name of a structure is
-- exactly the error this file exists to decide against.
theorem the_hash_keeps_one_value_and_a_coil_needs_all_of_them :
  grid.length = 12
  ∧ (grid.map dr).eraseDups.length = 10
  ∧ (grid.map dr).eraseDups.length < grid.length
  ∧ grid.length - (grid.map dr).eraseDups.length = 2
  -- and away from zero it really is nine, which is the statement I meant
  ∧ ((List.range' 1 20).map dr).eraseDups.length = 9 := by decide

-- ── 6 · BUT ORDER-INVARIANCE IS AN IDENTITY, AND IT IS WHAT A HASH CAN HAVE ────────────────────────────────
-- This is the half that is not a refusal. A hash read over a CANONICALISED input agrees at every point of the
-- permutation space, which is a cross formula in the full sense — and it is the one this deposit's receipt
-- rests on. src/proof/quantum.lean decides it over every permutation and names the mechanism: a sort.
-- Here it is stated as what it is — an identity of the STRUCTURE, never of the values.
def perms3 : List (List Nat) :=
  [[1, 2, 4], [1, 4, 2], [2, 1, 4], [2, 4, 1], [4, 1, 2], [4, 2, 1]]
def canon (l : List Nat) : List Nat := l.foldl (fun acc x => acc ++ [x]) [] |>.eraseDups
def sum3 (l : List Nat) : Nat := l.foldl (· + ·) 0

theorem order_invariance_is_the_identity_a_hash_can_have :
  perms3.all (fun p => sum3 p == sum3 [1, 2, 4])
  ∧ perms3.all (fun p => dr (sum3 p) == dr (sum3 [1, 2, 4]))
  ∧ perms3.length = 6
  ∧ (perms3.map sum3).eraseDups.length = 1 := by decide

-- ── 7 · AND DETERMINISM IS THE ONLY THING A VALUE ALONE GIVES ──────────────────────────────────────────────
-- The same input yields the same address at every point — that is a real law and it is what makes a
-- content-address a join key. It is also the LIMIT of what a value gives: it says the map is a function, and
-- says nothing whatever about two different inputs that happen to land together.
-- AND THE PERIOD HAS AN EXCEPTION AT ZERO, which the kernel refused my first version for missing: dr 0 = 0
-- while dr 9 = 9, so the nine-periodicity holds from one and not from zero. Named rather than stepped over by
-- starting the range at 1 — the boundary is the only interesting point in it.
theorem determinism_is_a_law_and_it_is_the_last_one_a_value_gives :
  grid.all (fun n => dr n == dr n)
  ∧ (List.range' 1 20).all (fun n => dr n == dr (n + 9))
  ∧ dr 0 ≠ dr 9
  ∧ ¬ grid.all (fun n => (dr n == dr (n + 1))) := by decide

-- ── 8 · THE ASYMMETRY, STATED SO NEITHER SIDE IS OVERSOLD ─────────────────────────────────────────────────
-- An identity survives being asked at a new point; a collision need not. Extend the grid and the doubling
-- identity still holds everywhere, while the digit-root agreement that held to nine has already broken. That
-- is the difference between a law and an accident, decided rather than described — and it is why arrays are
-- the criterion, why hashes are excluded from being results, and why the structure of a hash is not.
theorem an_identity_survives_a_wider_grid_and_a_collision_need_not :
  (List.range 40).all (fun n => 2 * n == n + n)
  ∧ ¬ (List.range 40).all (fun n => dr n == n)
  ∧ (List.range' 1 9).all (fun n => dr n == n)
  ∧ ((List.range 40).filter (fun n => dr n == n)).length = 10 := by decide

-- ── 9 · AN ARRAY IS THE RESULT OF A FORMULA — the half the first answer left out ───────────────────────────
-- The extension is not given, it is COMPUTED: apply the expression at every point and collect. So an array is
-- an output before it is ever a criterion, and the two roles are not in tension. Decided by exhibiting the
-- same array reached from three different formulas, none of which was written down as a list.
theorem an_array_is_the_image_of_a_grid_under_a_formula :
  ext (fun k => 2 * k) = grid.map (fun k => 2 * k)
  ∧ ext (fun k => k + k) = ext (fun k => 2 * k)
  ∧ ext (fun k => 2 * k) = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22]
  -- and the grid itself is generated, not listed
  ∧ grid = List.range 12
  ∧ grid.length = 12 := by decide

-- ── 10 · AND A HASH IS A FOLD, WHICH IS A FORMULA OVER THAT ARRAY ──────────────────────────────────────────
-- A combining function applied across a list is a formula and its value is the result. Decided here on the
-- digit-root fold: the same answer whatever order the sum is taken in, because addition is what it folds —
-- which is ALSO why the order-invariance above is available. The chain form is the same shape one step on:
-- each value computed from the one before, which is what this deposit's receipts are.
def foldSum (l : List Nat) : Nat := l.foldl (· + ·) 0
def chain : Nat → Nat → Nat
  | 0, a => a
  | (k + 1), a => chain k (dr (a + k + 1))

theorem a_hash_is_a_fold_and_a_chain_is_a_recurrence :
  foldSum (ext (fun k => 2 * k)) = 132
  ∧ dr (foldSum (ext (fun k => 2 * k))) = 6
  ∧ foldSum [1, 2, 4] = foldSum [4, 2, 1]
  -- the recurrence: each step is a formula of the step before, which is the receipt chain in miniature
  ∧ chain 3 0 = dr (dr (dr (0 + 3) + 2) + 1)
  ∧ chain 0 7 = 7 := by decide

-- ── 11 · SO THE CYCLE CLOSES: FORMULA → ARRAY → FORMULA → VALUE ───────────────────────────────────────────
-- A grid is generated by a formula, an expression maps it to an array, a fold maps that array to one value,
-- and the value is compared by the same equality that decides coiling. Nothing in that chain is given; every
-- step is computed. That is the sense in which arrays and hashes ARE results of cross formulas, and the first
-- answer this file gave denied it by answering a narrower question.
theorem every_step_from_grid_to_address_is_computed :
  grid = List.range 12
  ∧ ext (fun k => 2 * k) = grid.map (fun k => 2 * k)
  ∧ foldSum (ext (fun k => 2 * k)) = 132
  ∧ dr (foldSum (ext (fun k => 2 * k))) = 6
  -- and the comparison at the end is the same equality the coil is decided by
  ∧ (ext (fun k => 2 * k) == ext (fun k => k + k)) = true := by decide

end Extension
