-- title: Theorems
-- wing: the machine
-- prior_art: unclassified
-- prior_art_pool: bounded
--   a universal property over a finite set; searchable as stated.
--   BOUNDED means a search is well posed and simply has not been run — the row is unclassified because
--   nobody looked. UNBOUNDED means the subject is this artifact, so there is no pool to search and the
--   row will stay unclassified however much work is done. They look identical in a count and need
--   opposite responses, which is the distinction uuidna-49 asked for and nobody had drawn.
-- prior_art_own: the universal property, computed from this sequence
-- The universal property — honestly, and COMPUTED from the sequence.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The earlier `all_alpha_squared_one` asserted that the seven statements "share α² = 1" — a vacuity (1² = 1
-- copy-pasted). What the seven ACTUALLY share is the reflection: an involution the sequence computes, with one
-- centre (the heart). That shared structure is real; it is still not a proof of any conjecture. No anchors, no
-- axioms, every proof `by decide`, no Mathlib. The floor holds: 0/7.

namespace MillenniumFloor.Universal

def refl (d : Nat) : Nat := 10 - d  -- the shared reflection r(d) = 10 − d (the ½/heart-analogue centre)

-- The universal law, computed: the reflection is a TOTAL involution on every residue, with exactly one shared
-- fixed centre — the structure every one of the seven framings borrows. It is not "α² = 1", and it is not a proof.
theorem universal_reflection_involution :
  (List.range 11).all (fun d => refl (refl d) == d)                     -- σ ∘ σ = id everywhere — the shared involution
  ∧ ((List.range 10).filter (fun d => refl d == d)).length = 1          -- exactly ONE shared centre (the heart), computed
  := by decide

-- ── the centre, NAMED rather than counted ──
-- The theorem above proves there is exactly ONE centre. A count is not an identification: it says a heart
-- exists without saying where it beats. Here it is, computed — the filter returns the singleton [5].
theorem universal_centre_is_five :
  ((List.range 10).filter (fun d => refl d == d)) = [5] := by decide

-- ── what the reflection conserves ──
-- Every residue and its reflection sum to ten. This is the reason there is exactly one centre: a fixed point
-- needs d + d = 10, and 10 is even, so exactly one d satisfies it. The conservation law is the whole structure.
theorem universal_pairs_sum_to_ten :
  (List.range 11).all (fun d => d + refl d == 10) := by decide

-- ── the reflection is a bijection of the domain, computed as an ordering ──
-- Stronger than the involution and cheaper than a permutation argument: the image of 0…10 under the
-- reflection IS 0…10 read backwards. Nothing is lost and nothing is repeated, and the witness is an equation.
theorem universal_reflection_reverses_the_domain :
  (List.range 11).map refl = (List.range 11).reverse := by decide

-- ── WHERE IT STOPS. The involution is not universal over ℕ, and the boundary is stated, not hidden ──
-- Natural subtraction truncates: above ten, `refl d` is 0 and `refl (refl d)` is 10 for every input. So the
-- involution holds on 0…10 and FAILS at every residue above it. The first theorem says `List.range 11` and
-- means it. A boundary you can compute is a boundary you have not overclaimed past.
theorem universal_reflection_is_not_an_involution_above_ten :
  ((List.range 10).map (fun k => k + 11)).all (fun d => ¬ (refl (refl d) == d)) := by decide

-- ── the vortex has its OWN reflection, and it is a different map ──
-- ℤ/9 reflects by d ↦ (9 − d) mod 9. That map permutes the six units among themselves. The millennium
-- reflection does NOT stay inside them: it sends the unit 1 to 9, which is not a unit. Two reflections, two domains.
theorem universal_z9_reflection_permutes_the_units :
  ([1, 2, 4, 5, 7, 8].map (fun d => (9 - d) % 9)) = [8, 7, 5, 4, 2, 1] := by decide

theorem universal_millennium_reflection_escapes_the_units :
  ¬ ([1, 2, 4, 5, 7, 8].all (fun u => [1, 2, 4, 5, 7, 8].contains (refl u))) := by decide

-- ── and yet they are the SAME map, shifted by one ──
-- This is what the singleton family was standing on alone. Reduced mod nine, the millennium reflection is the
-- vortex reflection plus one, at every residue 0…9. The shared structure the seven framings borrow is not a
-- separate object: it is ℤ/9's own involution, displaced by a single step. Still not a proof of any conjecture.
theorem universal_reflection_is_the_vortex_reflection_shifted :
  (List.range 10).all (fun d => (10 - d) % 9 == ((9 - d) % 9 + 1) % 9) := by decide

end MillenniumFloor.Universal
