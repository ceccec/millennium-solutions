-- title: The three facts the unchecked files held alone
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the nuclear shell model, and the proton-to-electron mass ratio
-- prior_art_note: THE PHYSICS IS NOT THIS DEPOSIT'S AND NONE OF IT IS CLAIMED. The shell model and its
--   closed-shell numbers 2, 8, 20, 28, 50, 82, 126 are Maria Goeppert Mayer and J. Hans D. Jensen, 1949,
--   who shared the 1963 Nobel Prize for them; the level capacities below are 2j+1 in the standard filling
--   order, which is textbook. The proton-to-electron mass ratio is measured, and CODATA publishes it. What
--   is decided here is ARITHMETIC over lists of small naturals and nothing else: that certain prefix sums
--   of a typed capacity list take certain values, that a product of numerators equals a product of
--   denominators, and that one integer is not another. No theorem below decides anything about a nucleus.
-- prior_art_search: not performed for these rows — the sources are named above rather than searched for,
--   which is kind 1 and not kind 2. Nothing here claims a search returned nothing.
-- prior_art_pool: bounded
-- prior_art_own: nothing; this file exists to bring three facts under the kernel, not to find them
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS. Fifteen .lean files sat outside src/proof — Vortex.lean and the per-digit
-- src/<d>/vortex.lean set — and every one of them began `import Mathlib`. scripts/lean.ts reads only
-- src/proof, so no gate ever compiled them; the repository has no lake-manifest.json and no .lake, so
-- Mathlib was never fetched and they have never been built here at all. They were published as the "formal
-- layer" on /proofs, next to theorems the kernel checks on every run, and the page's own note that no
-- toolchain is checked in is easy to read past when the heading says Proofs.
--
-- Nearly all of what they held is decided already, axiom-free and Mathlib-free, in this directory: 3² ≡ 0,
-- the inverse pairs, the doubling circuit and its order, the ten's complement and its fixed digit, the
-- (ℤ/7)* orbit, 432 = 2⁴·3³. Those were two derivations of one fact, and the second derivation was the
-- unchecked one. THREE facts existed nowhere else, so they are brought here before anything is removed —
-- deleting a file that holds the only copy of something is not a purge, it is a loss.
--
-- No Mathlib, no axioms, no sorry. `List.sum` belongs to a library this tree does not take, so the folds
-- are written out.

namespace Nucleus

-- ── 1 · the capacities, and the prefixes that were marked ─────────────────────────────────────────────────
def caps : List Nat := [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
def total (l : List Nat) : Nat := l.foldr (· + ·) 0
def prefixes : List Nat := (List.range (caps.length + 1)).map (fun i => total (caps.take i))
def marks : List Nat := [1, 3, 6, 7, 11, 16, 22]        -- the positions, from the filling order above
def closures : List Nat := marks.map (fun i => total (caps.take i))

-- Every capacity is even — 2j+1 summed over the two signs of m_j. Derived over the list, not asserted.
theorem every_capacity_is_even : caps.all (fun c => c % 2 == 0) := by decide

-- The seven marked prefixes take the seven published values. The PAIRING of position to value is the
-- physics and is credited above; that these sums are those numbers is what the kernel decides.
theorem the_seven_marked_prefixes_take_the_published_values :
  closures = [2, 8, 20, 28, 50, 82, 126] := by decide

-- Each of the seven is reached ONCE across every prefix, so the marks are not one choice among many that
-- would have produced the same list — a weaker file could have hidden an arbitrary pick behind a true sum.
theorem each_of_the_seven_is_reached_exactly_once_among_all_prefixes :
  closures.all (fun m => (prefixes.filter (fun p => p == m)).length == 1) := by decide

-- The list closes on the last of them: the capacities sum to exactly the largest.
theorem the_capacities_sum_to_the_last_of_the_seven :
  total caps = 126 ∧ total caps = closures.foldr (fun a b => max a b) 0 := by decide

-- And they increase strictly, which is what lets them be read as successive closures at all.
theorem the_seven_increase_strictly :
  (List.range (closures.length - 1)).all (fun i => closures.getD i 0 < closures.getD (i + 1) 0) := by decide

-- ── 2 · the self-seal product ─────────────────────────────────────────────────────────────────────────────
-- src/5/vortex.lean stated (1/2)(1/2)(1/2)(8/7)(7/5)(5/3)(1/2)(2/3)·9 = 1 over ℚ, which needs a rational
-- field this tree does not carry. Cleared of denominators it is an identity between two products of small
-- naturals, decidable here. Both sides come to 5040 — the same 5040 that theology.lean counts as 7!, which
-- is worth saying only because it is the kind of coincidence a reader will spot and an author should not
-- dress up: two products of small integers landing on the same number is not evidence of anything.
def numerators : List Nat := [1, 1, 1, 8, 7, 5, 1, 2, 9]
def denominators : List Nat := [2, 2, 2, 7, 5, 3, 2, 3]
def product (l : List Nat) : Nat := l.foldr (· * ·) 1
theorem the_seal_multiplies_back_to_one :
  product numerators = product denominators := by decide

-- ── 3 · the mass-ratio fit, and the refusal that came with it ─────────────────────────────────────────────
-- 108 · 17 = 1836 is exact. The measured proton-to-electron mass ratio is not 1836; it is 1836.1527…, so
-- the fit MISSES, and src/8/nucleus/proton-mass.lean said so in its own header — the one unchecked file
-- that carried its refusal with it. Comparing without a rational type: scale both by ten thousand.
theorem the_fit_is_an_exact_integer_identity : 108 * 17 = 1836 := by decide
theorem the_fit_is_not_the_measured_ratio : 1836 * 10000 ≠ 18361527 := by decide

end Nucleus
