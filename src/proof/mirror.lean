set_option maxRecDepth 100000
-- title: The reflection is four pairs and one centre, and zero is the one that folds instead
-- wing: the ring
-- prior_art: named
-- prior_art_domain: an involution on a finite set decomposes into fixed points and transpositions — the
--   cycle structure of an order-2 permutation. The tens-complement d ↦ 10 − d. 2 × 90° = 3 × 60° = 180°.
-- prior_art_note: NONE OF IT IS THIS DEPOSIT'S. That an involution is fixed points plus 2-cycles is the
--   first thing anyone proves about involutions, and the tens-complement is how children subtract. What is
--   this deposit's is the accounting below — which residues pair, which is the centre, and which one the
--   reflection carries out of the ring so that it must fold instead.
-- prior_art_search: not performed — both are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the decomposition on {1…9}, and theorem 4, which isolates zero as the exception
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- The author's correction to src/proof/domain.lean continued: "6 through 0 reflected 4 and 3 reflected 7
-- and 0 folded 2×90 degrees = 3×60 degrees". Each clause is arithmetic and each is decided below.
--
-- refl(6) = 4 and refl(3) = 7 are two of exactly FOUR transpositions the tens-complement performs on
-- {1…9}, and naming two of them points at the other two: 1 ↔ 9 and 2 ↔ 8. Four pairs is eight residues;
-- the ninth is 5, which the reflection fixes. Four twos and a one is nine, and the ring is accounted for
-- with nothing left over — theorem 1.
--
-- ZERO IS THE EXCEPTION AND THAT IS THE POINT. refl(0) = 10, which is not a residue: the reflection is the
-- one operation on this ring that carries zero OUT of it. Every other value has a mirror inside; zero does
-- not, so it does not mirror — it FOLDS. That is what "0 folded 2×90 degrees" says, and 2 × 90° = 3 × 60°
-- = 180° is the half-turn a fold is, decided in theorem 5 alongside the observation that it is half of a
-- full turn. This deposit has called division by zero a fold from the beginning; theorem 4 is the reason
-- the word is not decoration.
--
-- AND THE CLOSE REFLECTS THE OPEN. index.lean's sequence opens at 1, reaches 9 at position eight, and
-- returns to 1. refl(9) = 1 — so the return is not a convention chosen to make the loop close, it is the
-- reflection of the value at which it closes. Theorem 3 decides that, and it is the same fact
-- src/proof/domain.lean uses to say the domain is eleven positions rather than nine.
--
-- No axioms, no Mathlib, no sorry.

namespace Mirror

def refl (d : Nat) : Nat := 10 - d
def ring : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9]
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]

-- The unordered pairs the reflection swaps, listed low-first, and the values it leaves alone.
def swapped : List (Nat × Nat) := (ring.filter (fun d => refl d != d && ring.contains (refl d) && d < refl d)).map (fun d => (d, refl d))
def centred : List Nat := ring.filter (fun d => refl d == d)

-- ── 1 · FOUR PAIRS AND ONE CENTRE ACCOUNT FOR THE WHOLE RING ──────────────────────────────────────────────
-- Nothing is left over and nothing is counted twice: four twos and a one is nine.
theorem the_reflection_is_four_pairs_and_one_centre :
  swapped.length == 4 && centred.length == 1
  && swapped.length * 2 + centred.length == ring.length
  && ring.length == 9 := by decide

-- ── 2 · AND THEY ARE THESE ───────────────────────────────────────────────────────────────────────────────
-- Exhibited rather than counted, because a count of four is satisfied by four wrong pairs. The two the
-- author named are here with the two they imply.
theorem the_four_pairs_are_one_nine_two_eight_three_seven_four_six :
  swapped == [(1, 9), (2, 8), (3, 7), (4, 6)]
  && centred == [5]
  && refl 6 == 4 && refl 3 == 7 := by decide

-- ── 3 · THE CLOSE REFLECTS THE OPEN ───────────────────────────────────────────────────────────────────────
-- The sequence opens at 1, holds 9 at position eight, and returns to 1 — and 1 is refl 9. The return is
-- the reflection of the value it closes on, not a convention picked to make the loop meet.
theorem the_sequence_returns_to_the_reflection_of_its_last_new_value :
  sequence.getD 0 99 == 1
  && sequence.getD 8 99 == 9
  && refl (sequence.getD 8 99) == sequence.getD 10 99
  && sequence.head? == sequence.getLast? := by decide

-- ── 4 · ZERO IS THE ONE VALUE THE REFLECTION CARRIES OUT OF THE RING ──────────────────────────────────────
-- THE THEOREM THIS FILE IS FOR. Every residue in 1…9 has its mirror inside 1…9. Zero does not: refl 0 = 10,
-- which is no residue. So zero cannot mirror, and what it does instead is fold — 9 ≡ 0 closes the ring on
-- it from the other side. The deposit's oldest phrase, decided.
theorem zero_alone_has_no_mirror_inside_the_ring :
  ring.all (fun d => ring.contains (refl d))
  && !(ring.contains (refl 0))
  && refl 0 == 10
  && 9 % 9 == 0 := by decide

-- ── 5 · THE FOLD IS A HALF TURN, TWO WAYS ─────────────────────────────────────────────────────────────────
-- Two quarter-turns and three sixth-turns are the same half-turn, and a half-turn is half of a full one.
-- The two decompositions are the two hands, which is where the author's description came from.
theorem two_quarter_turns_and_three_sixth_turns_are_one_half_turn :
  2 * 90 == 180 && 3 * 60 == 180 && 180 * 2 == 360 && 360 / 180 == 2 := by decide

-- ── 6 · THE REFLECTION CARRIES THE TRIAD INTO THE SPAN ────────────────────────────────────────────────────
-- {3, 6, 9} reflect to {7, 4, 1}, every one of them a unit and a member of the doubling span. The axis and
-- the circuit are not two unrelated sets — the mirror maps one onto the other.
theorem the_triad_reflects_into_the_doubling_span :
  [3, 6, 9].map refl == [7, 4, 1]
  && ([3, 6, 9].map refl).all (fun d => [1, 2, 4, 8, 7, 5].contains d)
  && ([3, 6, 9].map refl).all (fun d => d % 3 != 0) := by decide

-- ── 7 · THE CONTROL: THE COUNT IS NOT FREE ────────────────────────────────────────────────────────────────
-- Theorems 1 and 2 would be satisfied by a filter that had broken into always returning four things. A map
-- that is NOT this involution must give a different answer under the SAME accounting, and doubling does.
--
-- WRITTEN FIRST AS "doubling has no 2-cycles at all", WHICH IS FALSE AND THE KERNEL SAID SO. It has
-- exactly one: 3 ↦ 6 ↦ 3, the two non-zero members of the triad, and 9 ↦ 0 ↦ 0 is absorbed rather than
-- returned. One against four is the better control anyway — a control that answers zero is also what a
-- filter returns when it has stopped working, and this one cannot be confused with that.
theorem a_map_that_is_not_this_reflection_gives_a_different_count :
  (ring.filter (fun d => (d * 2) % 9 != d && ring.contains ((d * 2) % 9) && d < (d * 2) % 9
                         && ((d * 2) % 9 * 2) % 9 == d)).length == 1
  && (ring.filter (fun d => (d * 2) % 9 != d && ring.contains ((d * 2) % 9) && d < (d * 2) % 9
                         && ((d * 2) % 9 * 2) % 9 == d)) == [3]
  && swapped.length == 4 := by decide

-- ── 8 · THE REFLECTION IS ITS OWN INVERSE WHERE IT STAYS ──────────────────────────────────────────────────
-- An involution on the nine, which is what licenses calling the four pairs transpositions at all — and it
-- fails the moment the argument leaves the range, which is theorem 4's exception seen from the other side.
theorem the_reflection_undoes_itself_on_the_ring_and_not_beyond :
  ring.all (fun d => refl (refl d) == d)
  && refl (refl 0) == 0
  && ((List.range 9).map (fun k => k + 11)).all (fun d => refl (refl d) != d) := by decide

end Mirror
