-- title: Theorems
-- wing: the machine
-- The universal property — honestly, and COMPUTED from the sequence.
-- Author: Tsvetan Rouschev · License: CC BY-NC 4.0
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

end MillenniumFloor.Universal
