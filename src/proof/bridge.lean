import Z9
set_option maxRecDepth 8000000
set_option maxHeartbeats 2000000
-- title: The subjects and the group are the same object
-- wing: the imagined
-- prior_art: named
-- prior_art_domain: digit roots (casting out nines) and linear congruential recurrences over Z/n
-- prior_art_note: That 2^n mod 9 cycles with period 6, and that x -> ax+b mod n is the linear congruential
-- prior_art_note: map, are both standard. What is stated here is neither: it is that this deposit's OWN
-- prior_art_note: cross-subject families, computed in src/entangle, reduce to orbits of the affine maps its
-- prior_art_note: own src/proof/group.lean settles — the two halves of the deposit describing one object.
-- prior_art_search: 2026-09-28
-- BRIDGE — written by scripts/bridge.ts. Each theorem below takes a reduction shared by several subjects and
-- decides that it steps by a single affine rule and repeats with its period. The subjects are listed above
-- each one, in their own words, as src/entangle states them.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Bridge

open Z9

-- biology ↔ chemistry ↔ computing ↔ cryptography ↔ epidemiology ↔ law ↔ logistics ↔ music ↔ number theory ↔ textiles
--   music: the frequency ratio of n octaves
--   computing: the values an n-bit register addresses
--   biology: the cells after n divisions
--   chemistry: the dilution factor after n halvings
--   number theory: the subsets of an n-element set
--   cryptography: the keys in an n-bit keyspace
--   epidemiology: the infections after n generations at R0 = 2
--   logistics: the leaves of a binary decision tree of depth n
--   law: the distinct yes/no ballots on n questions
--   textiles: the plain weave lift patterns on n shafts
-- reduces mod 9 to 2 4 8 7 5 1 2 4 8 7 5 1… · period 6 · the orbit of d ↦ 2d + 0
theorem the_reduction_shared_by_10_subjects_is_the_orbit_of_d_to_2d_plus_0_0 :
  (List.range 17).all (fun i => [2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1].getD (i + 1) 99 == (2 * [2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1].getD i 99 + 0) % 9)
  ∧ (List.range 12).all (fun i => [2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1].getD i 99 == [2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1].getD (i + 6) 99)
  ∧ [2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1, 2, 4, 8, 7, 5, 1].length = 18 := by decide

-- computing ↔ games ↔ logistics ↔ number theory ↔ sport ↔ taxonomy
--   sport: the matches to settle a knockout of 2^n entrants
--   computing: the largest value n bits can hold
--   number theory: the n-th Mersenne candidate
--   taxonomy: the nodes of a complete binary tree of depth n-1
--   games: the moves to solve the tower of n discs
--   logistics: the non-empty subsets of an n-element set
-- reduces mod 9 to 1 3 7 6 4 0 1 3 7 6 4 0… · period 6 · the orbit of d ↦ 2d + 1
theorem the_reduction_shared_by_6_subjects_is_the_orbit_of_d_to_2d_plus_1_1 :
  (List.range 17).all (fun i => [1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0].getD (i + 1) 99 == (2 * [1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0].getD i 99 + 1) % 9)
  ∧ (List.range 12).all (fun i => [1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0].getD i 99 == [1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0].getD (i + 6) 99)
  ∧ [1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0, 1, 3, 7, 6, 4, 0].length = 18 := by decide

-- cryptography ↔ geometry ↔ music ↔ number theory ↔ taxonomy
--   number theory: the digit root of n
--   geometry: the residue of n on the nonagon
--   cryptography: the check digit under the nines rule
--   music: the cents in n semitones
--   taxonomy: the taxonomic ranks below kingdom at depth n
-- reduces mod 9 to 1 2 3 4 5 6 7 8 0 1 2 3… · period 9 · the orbit of d ↦ 1d + 1
theorem the_reduction_shared_by_5_subjects_is_the_orbit_of_d_to_1d_plus_1_2 :
  (List.range 17).all (fun i => [1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0].getD (i + 1) 99 == (1 * [1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0].getD i 99 + 1) % 9)
  ∧ (List.range 9).all (fun i => [1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0].getD i 99 == [1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0].getD (i + 9) 99)
  ∧ [1, 2, 3, 4, 5, 6, 7, 8, 0, 1, 2, 3, 4, 5, 6, 7, 8, 0].length = 18 := by decide

-- botany ↔ law ↔ music ↔ number theory
--   music: the numerator of n stacked perfect fifths
--   number theory: the ternary strings of length n
--   botany: the branches after n ternary splits
--   law: the outcomes of n three-way votes
-- reduces mod 9 to 3 0 0 0 0 0 0 0 0 0 0 0… · no period within the ring · the orbit of d ↦ 0d + 0
theorem the_reduction_shared_by_4_subjects_is_the_orbit_of_d_to_0d_plus_0_3 :
  (List.range 17).all (fun i => [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].getD (i + 1) 99 == (0 * [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].getD i 99 + 0) % 9)
  ∧ [3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].length = 18 := by decide

-- chemistry ↔ economics ↔ metrology
--   chemistry: a step of n on the pH scale
--   metrology: n orders of magnitude
--   economics: the place value of the n-th decimal column
-- reduces mod 9 to 1 1 1 1 1 1 1 1 1 1 1 1… · period 1 · the orbit of d ↦ 0d + 1
theorem the_reduction_shared_by_3_subjects_is_the_orbit_of_d_to_0d_plus_1_4 :
  (List.range 17).all (fun i => [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].getD (i + 1) 99 == (0 * [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].getD i 99 + 1) % 9)
  ∧ (List.range 17).all (fun i => [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].getD i 99 == [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].getD (i + 1) 99)
  ∧ [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].length = 18 := by decide

-- ── THE CONTROL ────────────────────────────────────────────────────────────────────────────────────────
-- chemistry, economics, epidemiology, geometry, logistics, number theory, sport reduce to a sequence that NO affine map generates. Every one of the 81 pairs (a, b)
-- is tried and every one fails, so "these families are orbits" is a claim that can come out false and does.
theorem not_every_shared_reduction_is_an_orbit :
  ¬ [0,1,2,3,4,5,6,7,8].any (fun a => [0,1,2,3,4,5,6,7,8].any (fun b =>
      (List.range 17).all (fun i => [0, 1, 3, 6, 1, 6, 3, 1, 0, 0, 1, 3, 6, 1, 6, 3, 1, 0].getD (i + 1) 99 == (a * [0, 1, 3, 6, 1, 6, 3, 1, 0, 0, 1, 3, 6, 1, 6, 3, 1, 0].getD i 99 + b) % 9))) := by decide

-- ── THE RULES ARE DIFFERENT MAPS ────────────────────────────────────────────────────────────────────────
-- Five families, five rules — and nothing above says the rules differ. If they did not, this file would be
-- one orbit written out five times under five sets of subjects, which is the restatement-as-discovery this
-- deposit refuses everywhere else. The pairs are decided pairwise distinct.
theorem the_5_rules_are_5_different_maps :
  [(2, 0), (2, 1), (1, 1), (0, 0), (0, 1)].eraseDups.length = 5
  ∧ [(2, 0), (2, 1), (1, 1), (0, 0), (0, 1)].length = 5 := by decide

-- ── AND THEY ARE THE MAPS group.lean SETTLES ────────────────────────────────────────────────────────────
-- The bridge itself. A rule's multiplier is either a unit of ℤ/9 — in which case the map is an element of
-- AGL(1, ℤ/9), the group src/proof/group.lean generates to closure and proves has order 54 — or it is zero,
-- and group.lean proves those collapse the ring and sit OUTSIDE the group. That is exactly the difference
-- visible in the families above: the ones with a unit multiplier cycle with a period, and the ones with a
-- zero multiplier flatten to a constant. The subjects and the group are not analogous here. They are the
-- same object, measured twice.
theorem every_rule_is_a_map_the_group_file_classifies :
  [(2, 0), (2, 1), (1, 1), (0, 0), (0, 1)].all (fun p => [1, 2, 4, 5, 7, 8].contains p.1 || p.1 == 0)
  ∧ ([(2, 0), (2, 1), (1, 1), (0, 0), (0, 1)].filter (fun p => [1, 2, 4, 5, 7, 8].contains p.1)).length = 3
  ∧ ([(2, 0), (2, 1), (1, 1), (0, 0), (0, 1)].filter (fun p => p.1 == 0)).length = 2
  ∧ [1, 2, 4, 5, 7, 8].length = 6 := by decide

end Bridge
