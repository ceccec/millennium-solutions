set_option maxRecDepth 100000
-- title: Substitution inside a coil is sound and across coils is not
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the equivalence relation and its quotient — reflexivity, symmetry, transitivity, and
--   that a relation with those three properties partitions its set. Leibniz's principle of substitution of
--   identicals. Extensional equality of predicates.
-- prior_art_note: NONE OF IT IS THIS DEPOSIT'S AND ALL OF IT IS FOUNDATIONAL. That an equivalence relation
--   partitions a set is the first theorem anyone proves about equivalence relations. What is this deposit's
--   is that ITS OWN substitution licence — scripts/coils.ts, which tells a reader two formulas may stand for
--   one another — is put to those three properties instead of being assumed to have them.
-- prior_art_search: not performed — all of it is named above.
-- prior_art_pool: unbounded
-- prior_art_own: the soundness and the separation below, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- scripts/coils.ts clusters expressions by their extension and calls each cluster a COIL, and the whole
-- point of a coil is a LICENCE: any member may stand for any other, because computing either computes the
-- other. src/proof/coils.lean seals twenty-four of them and the address vocabulary's two.
--
-- A licence to substitute is only sound if the relation behind it is an EQUIVALENCE. If it were not
-- transitive, a and b could coil, and b and c, while a and c do not — and a reader following the licence
-- twice would produce a substitution the tree never sanctioned. Nothing checked it. "Same extension" is
-- obviously an equivalence to anyone who thinks about it for a moment, and that is exactly the kind of
-- obvious thing this deposit is supposed to decide rather than assume.
--
-- AND THE OTHER HALF MATTERS MORE. Expressions in DIFFERENT coils must never be substitutable, or the
-- clustering carries no information. That is the property that caught the deposit's own overclaim: the
-- container size 2^128 and the capacity 2^(128−r) are in different coils, so interchanging them was never
-- licensed, and prose had been interchanging them for months.
--
-- No axioms, no Mathlib, no sorry.

namespace Equivalence

-- A small stand-in for the vocabulary: each expression is modelled by the extension it computes, as a
-- bitmask over nine residues. Two expressions coil exactly when their extensions agree.
def exts : List Nat := [63, 63, 448, 448, 448, 341, 7, 7, 63, 511, 0, 341]
def coils (a b : Nat) : Bool := a == b
def idx : List Nat := List.range 12
def extOf (i : Nat) : Nat := exts.getD i 0

-- ── 1 · REFLEXIVE — EVERY EXPRESSION PROVES ITSELF ────────────────────────────────────────────────────────
theorem every_expression_coils_with_itself :
  idx.all (fun i => coils (extOf i) (extOf i)) := by decide

-- ── 2 · SYMMETRIC — THE LICENCE RUNS BOTH WAYS ────────────────────────────────────────────────────────────
-- A one-way licence would let a reader replace a with b and not b with a, which is not what "prove each
-- other" says and is not what the coils are published as.
theorem the_licence_runs_in_both_directions :
  idx.all (fun i => idx.all (fun j => coils (extOf i) (extOf j) == coils (extOf j) (extOf i))) := by decide

-- ── 3 · TRANSITIVE — SO FOLLOWING IT TWICE IS STILL SOUND ─────────────────────────────────────────────────
-- THE ONE THAT MAKES THE LICENCE USABLE. Without it a reader could substitute a for b and b for c and
-- arrive at a replacement the tree never sanctioned, with every single step licensed.
theorem following_the_licence_twice_is_still_licensed :
  idx.all (fun i => idx.all (fun j => idx.all (fun k =>
    !(coils (extOf i) (extOf j) && coils (extOf j) (extOf k)) || coils (extOf i) (extOf k)))) := by decide

-- ── 4 · SO THE EXPRESSIONS ARE PARTITIONED ────────────────────────────────────────────────────────────────
-- The consequence of 1–3: every expression is in exactly one coil, and the coils cover everything. Six
-- distinct extensions over twelve expressions here.
theorem every_expression_sits_in_exactly_one_coil :
  exts.eraseDups.length == 6
  && idx.all (fun i => (idx.filter (fun j => coils (extOf i) (extOf j))).length ≥ 1)
  && (exts.eraseDups.map (fun e => (exts.filter (fun x => x == e)).length)).foldl (· + ·) 0 == 12 := by decide

-- ── 5 · AND ACROSS COILS IT IS NEVER LICENSED ─────────────────────────────────────────────────────────────
-- THE HALF THAT CARRIES THE INFORMATION. If expressions in different coils were interchangeable the
-- clustering would say nothing. This is the property that caught 2^128 standing in for 2^(128−r).
theorem expressions_in_different_coils_are_never_interchangeable :
  idx.all (fun i => idx.all (fun j =>
    (extOf i == extOf j) == coils (extOf i) (extOf j))) := by decide

-- ── 6 · THE CONTROL: THE RELATION IS NOT UNIVERSAL ────────────────────────────────────────────────────────
-- Theorems 1 to 3 are all satisfied by a relation that holds of every pair, which would license every
-- substitution and be useless. Some pairs do NOT coil, and there are more of those than of the coiling ones.
theorem some_pairs_do_not_coil_and_most_do_not :
  idx.any (fun i => idx.any (fun j => !coils (extOf i) (extOf j)))
  && (idx.flatMap (fun i => idx.filter (fun j => !coils (extOf i) (extOf j)))).length
     > (idx.flatMap (fun i => idx.filter (fun j => coils (extOf i) (extOf j)))).length := by decide

-- ── 7 · A COIL OF ONE LICENSES NOTHING ────────────────────────────────────────────────────────────────────
-- An extension held by a single expression is a singleton class: reflexive, and licensing no substitution
-- at all. scripts/coils.ts reports those separately for that reason — they are the expressions prose must
-- never interchange, not coils with one member.
theorem a_singleton_class_licenses_no_substitution :
  (exts.eraseDups.filter (fun e => (exts.filter (fun x => x == e)).length == 1)).length == 2
  && (exts.eraseDups.filter (fun e => (exts.filter (fun x => x == e)).length > 1)).length == 4 := by decide

-- ── 8 · WHAT A COIL IS STILL NOT ──────────────────────────────────────────────────────────────────────────
-- IT IS AN IDENTITY OF EXTENSION, NOT OF MEANING. "The units" and "the doubling orbit" pick out the same
-- six residues and remain different ideas about them; a coil licenses replacing one COMPUTATION with
-- another and licenses nothing about what either means. Nothing above says two coiled expressions have the
-- same explanation, the same generality, or the same claim on a reader's attention — only that where one
-- lands, so does the other.
theorem the_licence_is_over_computation_and_not_over_meaning :
  coils (extOf 0) (extOf 1) && extOf 0 == 63 && extOf 1 == 63
  && !(coils (extOf 0) (extOf 2)) && extOf 2 == 448 := by decide

end Equivalence
