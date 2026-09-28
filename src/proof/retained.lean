import Z9
set_option maxRecDepth 8000000
-- title: Sealed before the vocabulary moved, and still decided
-- wing: the imagined
-- prior_art: unclassified
-- RETAINED — scripts/imagine.ts sealed these when its map table was hand-written, and its derived
-- enumeration does not propose them. Nothing about them was refuted: each is copied here exactly as the
-- generator last wrote it, and the kernel decides every one on every run. The ledger is append-only, so a
-- sealed key whose source disappears is an orphan the record cannot honestly resolve — keeping the source is
-- the only answer that neither withdraws a proved fact nor claims a carrier that does not prove it.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Imagined

open Z9

-- the squares mod nine is closed under quadrupling
theorem squares_is_closed_under_quadruple :
  [0, 1, 4, 7].all (fun d => [0, 1, 4, 7].contains (m9 (4 * d))) := by decide

-- the cubes mod nine is closed under negation
theorem cubes_is_closed_under_negate :
  [0, 1, 8].all (fun d => [0, 1, 8].contains (m9 (9 - d))) := by decide

-- the self-inverse residues is closed under negation
theorem selfinv_is_closed_under_negate :
  [1, 8].all (fun d => [1, 8].contains (m9 (9 - d))) := by decide

-- the cubes mod nine is closed under cubing
theorem cubes_is_closed_under_cube :
  [0, 1, 8].all (fun d => [0, 1, 8].contains (m9 (d * d * d))) := by decide

-- the squares mod nine is closed under multiplication by seven
theorem squares_is_closed_under_septuple :
  [0, 1, 4, 7].all (fun d => [0, 1, 4, 7].contains (m9 (7 * d))) := by decide

-- the cubes mod nine is closed under multiplication by eight
theorem cubes_is_closed_under_octuple :
  [0, 1, 8].all (fun d => [0, 1, 8].contains (m9 (8 * d))) := by decide

-- the self-inverse residues is closed under multiplication by eight
theorem selfinv_is_closed_under_octuple :
  [1, 8].all (fun d => [1, 8].contains (m9 (8 * d))) := by decide

-- cubing is its own inverse on the cubes mod nine
theorem cube_is_involutive_on_cubes :
  [0, 1, 8].all (fun d => (fun x => m9 (x * x * x)) (m9 (d * d * d)) == d) := by decide

-- doubling sends every element of the residues the reflection fixes to a single value
theorem double_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (2 * d))).eraseDups.length = 1 := by decide

-- tripling sends every element of the residues the reflection fixes to a single value
theorem triple_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (3 * d))).eraseDups.length = 1 := by decide

-- negation sends every element of the residues the reflection fixes to a single value
theorem negate_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (9 - d))).eraseDups.length = 1 := by decide

-- multiplication by five sends every element of the residues the reflection fixes to a single value
theorem quintuple_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (5 * d))).eraseDups.length = 1 := by decide

-- multiplication by six sends every element of the residues the reflection fixes to a single value
theorem sextuple_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (6 * d))).eraseDups.length = 1 := by decide

-- multiplication by seven sends every element of the residues the reflection fixes to a single value
theorem septuple_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (7 * d))).eraseDups.length = 1 := by decide

-- multiplication by eight sends every element of the residues the reflection fixes to a single value
theorem octuple_collapses_reflfixed_to_one_value :
  ([5].map (fun d => m9 (8 * d))).eraseDups.length = 1 := by decide

end Imagined
