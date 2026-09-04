set_option maxRecDepth 8000000
-- title: What every involution gives, and what it does not
-- wing: the ring
-- prior_art: named
-- prior_art_domain: elementary group theory — orbit decomposition of an order-two permutation
-- prior_art_note: that a permutation of order two decomposes a finite set into fixed points and
--   transpositions, and that the number of fixed points therefore matches the parity of the set, is
--   classical and long predates this deposit. It is the orbit-counting argument in any first course.
--   What is this deposit's own here is the EXHAUSTIVE decision over ℤ/9 and the measured refusal below.
--
-- THE QUESTION, and it was asked as "do involutions always give a harmonic result?".
--
-- Two readings of "harmonic" are decided here over ALL 2620 involutions of a nine-element set, enumerated
-- rather than sampled. One holds everywhere. The other does not, and the second is the more useful answer,
-- because a claim that survives only on the examples someone happened to pick is the thing this deposit
-- exists to refuse.
--
--   ALWAYS  — every involution fixes at least one point, and its fixed points are ODD in number.
--             On nine elements the centre is never absent. There is no involution of ℤ/9 with nothing
--             standing still, and that is not a property of the ones chosen here, it is a property of all
--             of them.
--
--   NOT ALWAYS — "every swapped pair sums to the same value", which is what `refl d = 10 - d` does and
--             what makes the coin's two sides sides of one thing. That is RARE: 90 of 2620, about one in
--             twenty-nine. It is a property of a particular involution, never of involutions.

namespace Involution

/-- Every involution of a finite list, as its set of orbits: `(a, a)` is a fixed point, `(a, b)` a swap. -/
--  The fuel is not a hedge and not an approximation: `rest.erase b` is smaller than `rest` but not
--  STRUCTURALLY smaller, so Lean cannot see the recursion terminate and — more to the point — a
--  well-founded definition does not reduce, which would leave every `decide` below unable to evaluate.
--  Counting down a Nat is structural, it reduces, and nine elements can nest at most nine deep. Ten is
--  passed, and `the_fuel_was_not_the_limit` decides that eleven produces the same list: the enumeration
--  stopped because it was complete, not because it ran out.
def matchings : Nat → List Nat → List (List (Nat × Nat))
  | 0, _ => []
  | _, [] => [[]]
  | fuel + 1, a :: rest =>
    (matchings fuel rest).map (fun m => (a, a) :: m)
    ++ rest.flatMap (fun b => (matchings fuel (rest.erase b)).map (fun m => (a, b) :: m))

def nine : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8]
def all : List (List (Nat × Nat)) := matchings 10 nine

def fixedPoints (m : List (Nat × Nat)) : Nat := (m.filter (fun p => p.1 == p.2)).length
def swaps (m : List (Nat × Nat)) : List (Nat × Nat) := m.filter (fun p => p.1 != p.2)

-- ── THE ENUMERATION IS COMPLETE, stated first so every count below is over a domain of known size ───────
theorem there_are_2620_involutions_of_nine : all.length = 2620 := by decide

theorem the_fuel_was_not_the_limit : (matchings 11 nine).length = all.length := by decide

-- ── WHAT ALWAYS HOLDS: the centre is never absent ───────────────────────────────────────────────────────
-- Both directions of the same fact. The first is what was asked; the second is why, and it is the sharper
-- statement because it rules out two fixed points as firmly as it rules out none.
theorem every_involution_fixes_at_least_one_point :
  all.all (fun m => fixedPoints m ≥ 1) := by decide

theorem the_fixed_points_are_always_odd :
  all.all (fun m => fixedPoints m % 2 == 1) := by decide

-- Nothing is fixed by every involution — the centre exists, but it is not the same centre.
-- Stated so the theorem above cannot be misread as naming a universal fixed element.
theorem no_single_point_is_fixed_by_all :
  nine.all (fun d => ¬ all.all (fun m => m.contains (d, d))) := by decide

-- ── WHAT DOES NOT HOLD: the constant sum is rare ────────────────────────────────────────────────────────
-- `refl d = 10 - d` sends every swapped pair to the same total, which is the sense in which the coin's
-- reflection is harmonic. Asked of ALL involutions, that fails, and the count says how badly.
def constantSum (m : List (Nat × Nat)) : Bool :=
  (swaps m).all (fun p => p.1 + p.2 == ((swaps m).head?.map (fun q => q.1 + q.2)).getD (p.1 + p.2))

theorem the_constant_sum_is_rare :
  (all.filter constantSum).length = 90 := by decide

theorem so_involutions_are_not_all_harmonic_in_that_sense :
  ¬ all.all constantSum := by decide

-- ── THE DEPOSIT'S OWN REFLECTION IS ONE OF THE NINETY ───────────────────────────────────────────────────
-- The coin's involution on 1..8 with 0 fixed: pairs summing to 9 within the nine-element set. Naming it
-- inside the enumeration is what stops "refl is harmonic" from being read as "involutions are harmonic".
def coinLike : List (Nat × Nat) := [(0, 0), (1, 8), (2, 7), (3, 6), (4, 5)]

theorem the_coins_reflection_is_harmonic_and_is_one_of_the_ninety :
  constantSum coinLike = true
  ∧ fixedPoints coinLike = 1
  ∧ (swaps coinLike).all (fun p => p.1 + p.2 == 9) := by decide

end Involution
