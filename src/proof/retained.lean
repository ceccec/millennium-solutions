import Z9
set_option maxRecDepth 8000000
-- title: Sealed before the vocabulary moved, and still decided
-- wing: the imagined
-- prior_art: named
-- prior_art_domain: elementary number theory — the unit group of Z/9 and the closure of its residue subsets under affine maps
-- prior_art_note: every theorem here is one residue subset of Z/9 carried into itself by one affine map d ↦ a·d + b, an instance of the
-- prior_art_note: monoid of 81 maps src/proof/group.lean settles. Standard elementary number theory; nothing here is claimed new.
-- prior_art_search: the 15 theorems keep their lean_imagined_* keys (the namespace is unchanged) and were searched under them on 2026-09-25
-- prior_art_search: and 2026-09-26, recorded in src/proof/novelty.json — zbMATH Open, OpenAlex, Crossref, arXiv and the OEIS. 13 NONE_FOUND;
-- prior_art_search: 2 CANDIDATES: squares_is_closed_under_quadruple (OEIS A160120 and A085787 catalogue the set, one zbMATH hit) and
-- prior_art_search: cubes_is_closed_under_cube (two Crossref hits on "modular cubes" — the keyword, not the mathematics — with zbMATH and
-- prior_art_search: OpenAlex not measured that run). A NONE_FOUND is what these searches returned on that date, never that nothing earlier exists.
-- RETAINED —scripts/imagine.ts sealed these when its map table was hand-written, and its derived
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
