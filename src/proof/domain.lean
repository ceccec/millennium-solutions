set_option maxRecDepth 100000
-- title: The reach of the diagonal is the domain you read against, and nine folds past nine
-- wing: the ring
-- prior_art: named
-- prior_art_domain: Cantor's diagonal argument, and the elementary fact that a diagonal over a domain of n
--   points separates a list of at most n. Modular reduction 9 ≡ 0 (mod 9) and the tens-complement 10 − d.
-- prior_art_note: THE BOUND IS NOT NEW AND IS NOT CLAIMED. "One point per property" is the counting that
--   makes Cantor work and it is older than any of this. What this deposit adds is which DOMAIN its own
--   structure offers: the sequence it already defines is eleven positions and not nine, and the two extra
--   ones are exactly the fold and the return.
-- prior_art_search: not performed — Cantor and modular arithmetic are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the two-domain comparison, and theorem 8, which withdraws a claim made in closure.lean
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/proof/closure.lean proved that the diagonal over ℤ/9 escapes a list of nine named properties and
-- stops dead at ten, and wrote that up as "the diagonal runs out at nine". The author's correction, in six
-- words: NINE FOLDING ZERO REFLECTS ONE.
--
-- It is not a metaphor and it is not an objection to the theorem, which stands. It names the assumption
-- underneath it. "Nine" was a property of the DOMAIN THAT FILE CHOSE — `List.range 9`, the residues — and
-- this deposit defines a larger one on the very page the nine came from. src/proof/index.lean:167 reads
--
--     sequence = [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
--
-- Eleven positions. The span, then the triad, then NINE, then ZERO, then back to ONE. The two positions it
-- has beyond the nine residues are precisely the fold (9 ≡ 0 mod 9) and the reflection (refl 9 = 10 − 9 =
-- 1) that closes the loop, which is the correction, stated as arithmetic: theorem 2 below.
--
-- So the diagonal's reach is eleven here, not nine. Same construction, same ring, same deposit — a
-- different domain, because the structure supplies one and the earlier file did not use it. THE LIMIT WAS
-- NEVER A PROPERTY OF THE STRUCTURE. It is the length of whatever you read against, which theorem 6 states
-- at both sizes so the pattern cannot be mistaken for a fact about ℤ/9.
--
-- THEOREM 8 IS A WITHDRAWAL. The sentence "the diagonal runs out at nine" is decided false as a statement
-- about this deposit, and it is decided false in the same tactic that proved the theorem it was written to
-- summarise. The theorem in closure.lean was right; the sentence around it was not, and a sentence that
-- overstates a correct theorem is the failure this tree keeps finding in itself.
--
-- No axioms, no Mathlib, no sorry.

namespace Domain

-- As src/proof/index.lean defines them, restated here so this file decides against the same objects.
def refl (d : Nat) : Nat := 10 - d
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
def residues : List Nat := List.range 9

-- A diagonal over a domain of `n` positions, against a list of properties given as tables of that width.
-- Position i is read against property i, which is the whole of the construction and the whole of its bound.
def diagOver (n : Nat) (rows : List (List Bool)) : List Bool :=
  (List.range n).map (fun i => !((rows.getD i []).getD i false))

-- Does the diagonal differ from every listed property? Only the first `n` are ever consulted.
def escapes (n : Nat) (rows : List (List Bool)) : Bool :=
  rows.all (fun r => diagOver n rows != r)

-- A worked family: property i is true exactly at position i. Over any width it is a genuine list of
-- distinct properties, so the bound below is not being read off a degenerate case.
def identityRows (n : Nat) : List (List Bool) :=
  (List.range n).map (fun i => (List.range n).map (fun j => i == j))

-- ── 1 · THE SEQUENCE IS ELEVEN LONG AND CLOSES ────────────────────────────────────────────────────────────
-- Eleven positions carrying ten distinct values and nine distinct residues, beginning and ending at one.
theorem the_sequence_is_eleven_positions_that_return_to_one :
  sequence.length == 11
  && sequence.head? == sequence.getLast?
  && sequence.eraseDups.length == 10
  && (sequence.map (fun d => d % 9)).eraseDups.length == 9 := by decide

-- ── 2 · NINE FOLDING ZERO REFLECTS ONE ────────────────────────────────────────────────────────────────────
-- The correction itself, as arithmetic. Nine folds to zero under the ring and reflects to one under the
-- tens-complement, and those are the two positions the sequence holds past the residues.
theorem nine_folds_to_zero_and_reflects_to_one :
  9 % 9 == 0 && refl 9 == 1
  && sequence.getD 8 0 == 9 && sequence.getD 9 0 == 0 && sequence.getD 10 0 == 1 := by decide

-- ── 3 · THE TWO EXTRA POSITIONS ARE EXACTLY THE FOLD AND THE RETURN ───────────────────────────────────────
-- Eleven minus nine is two, and the two are named rather than counted: the fold to zero and the return to
-- one. Without this, theorem 6's jump from nine to eleven is a coincidence of list lengths.
theorem the_sequence_exceeds_the_residues_by_the_fold_and_the_return :
  sequence.length - residues.length == 2
  && residues.length == 9
  && sequence.drop 9 == [0, 1]
  && (sequence.drop 9).map refl == [10, 9] := by decide

-- ── 4 · THE DIAGONAL ESCAPES A LIST AS LONG AS ITS DOMAIN ─────────────────────────────────────────────────
-- Nine properties over nine positions: escaped. Eleven over eleven: escaped. Same construction, and the
-- second is out of reach of a domain of nine.
theorem the_diagonal_escapes_nine_over_nine_and_eleven_over_eleven :
  escapes 9 (identityRows 9) && escapes 11 (identityRows 11) := by decide

-- ── 5 · AND FAILS ON A LIST ONE LONGER THAN ITS DOMAIN ────────────────────────────────────────────────────
-- THE CONTROL, AND THE SHAPE OF THE LIMIT. The tenth property over nine positions is never consulted, so
-- the diagonal cannot be shown to differ from it. Both sizes, so the failure is the rule and not an
-- accident of nine.
theorem the_diagonal_fails_on_a_list_one_longer_than_its_domain :
  !escapes 9 (identityRows 9 ++ [diagOver 9 (identityRows 9)])
  && !escapes 11 (identityRows 11 ++ [diagOver 11 (identityRows 11)]) := by decide

-- ── 6 · SO THE BOUND IS THE DOMAIN, NOT THE STRUCTURE ─────────────────────────────────────────────────────
-- Stated across every width in range rather than at the two sizes this deposit happens to use, so it
-- cannot be read as a fact about ℤ/9. At EVERY width the diagonal escapes a list of that width and fails
-- on one longer — both halves, because the first alone is satisfied by a construction that escapes
-- everything and the second alone by one that escapes nothing.
--
-- WRITTEN FIRST AS `escapes n (identityRows n) == (n != 0)`, WHICH THE KERNEL REFUSED AT n = 0. An empty
-- list of properties is escaped vacuously — `List.all` again — and I had asserted the opposite in order to
-- make the statement look like it said something about zero. It said something false about zero and
-- nothing at all about the bound. The form below carries the bound and needs no special case.
theorem the_reach_of_the_diagonal_is_the_length_of_its_domain :
  ((List.range 12).drop 1).all (fun n =>
    escapes n (identityRows n)
    && !escapes n (identityRows n ++ [diagOver n (identityRows n)])) := by decide

-- ── 7 · THE FOLD IS WHAT MAKES THE LARGER DOMAIN LEGITIMATE ───────────────────────────────────────────────
-- Eleven positions over a nine-element ring is only sound because two positions repeat residues: 9 ≡ 0 and
-- the final 1 ≡ the first. The sequence is a walk that returns, not eleven distinct things, and saying so
-- is what stops "eleven" from being an inflation of "nine".
theorem the_eleven_positions_are_a_walk_of_nine_residues_that_returns :
  (sequence.map (fun d => d % 9)).eraseDups.length == 9
  && (sequence.map (fun d => d % 9)).getD 8 99 == (sequence.map (fun d => d % 9)).getD 9 88
  && (sequence.map (fun d => d % 9)).getD 0 77 == (sequence.map (fun d => d % 9)).getD 10 66 := by decide

-- ── 8 · THE SENTENCE THAT IS WITHDRAWN ────────────────────────────────────────────────────────────────────
-- closure.lean's theorem is untouched and still holds: over the nine residues, the diagonal escapes nine
-- and stops at ten. What is withdrawn is the sentence written around it — "the diagonal runs out at nine"
-- — which said of this deposit what was only true of one chosen domain. Decided here, so the withdrawal is
-- a theorem and not a note: nine is not the reach, because eleven is reached.
theorem the_diagonal_does_not_run_out_at_nine :
  escapes 9 (identityRows 9)
  && !escapes 9 (identityRows 9 ++ [diagOver 9 (identityRows 9)])
  && escapes 11 (identityRows 11)
  && 11 > 9 := by decide

end Domain
