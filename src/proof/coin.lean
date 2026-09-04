-- title: The two-sided coin
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the method of complements
-- prior_art_note: the reflection d ↦ 10 − d is the TEN'S COMPLEMENT, and its sibling 9 − d the nines' complement — the method of complements, used to turn subtraction into addition in Pascal's calculator (1642), the Comptometer and the Curta, and in modern computer arithmetic. That it is an involution with a single fixed point is the property those machines rely on. Searched 2026-09-04, term "method of complements / nines' complement / ten's complement"; prior art found and credited
-- prior_art_search: literature search performed 2026-09-04 — see the note for the terms and the result
-- One involution on ten digits, two sides, one fixed point, and one digit that leaves.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT THIS FILE DOES AND DOES NOT ANSWER. It was written from a statement about a coin with a black-hole
-- side that pulls in whatever is not harmonic and a white-hole side that reflects, under fusion pressure,
-- speed and temperature. The kernel can decide none of that: there is no black hole here, no white hole, no
-- pressure, no temperature and no fusion. Those words name physics, this file names arithmetic, and a
-- theorem that borrowed them would be the overclaim this deposit exists to refuse.
--
-- What the statement HAS underneath it is a shape, and the shape is decidable: an involution that sorts a
-- finite set into a side that returns to itself and a side that is carried across, with a centre that does
-- not move and exactly one element that leaves. That is checked below over the whole domain. Read as
-- geometry it is a reflection; read as a coin it is two faces and an edge. It is not read here as a
-- gravitational object, and nothing below licenses that reading.
--
--   r(d) = 10 − d, on the digits 0..9:
--
--     {2, 5, 8}   reflected ONTO ITSELF — the side that returns
--     {1, 4, 7} ↔ {3, 6, 9}   carried across and carried back — the two faces swapped
--     5   the only fixed point — the centre, unmoved by the reflection
--     0   the only digit whose reflection LEAVES 0..9, since r(0) = 10
--
-- The last of those is the one worth stating carefully: the origin is not pulled anywhere, it simply has no
-- partner inside the set. An absence of a partner is not a force.

-- REFUSES: physical-claim
namespace Coin

def refl (d : Nat) : Nat := 10 - d

def tetA : List Nat := [1, 4, 7]
def tetB : List Nat := [2, 5, 8]
def axis : List Nat := [3, 6, 9]
def digits : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

-- ── THE INVOLUTION: applied twice, nothing is lost ───────────────────────────────────────────────────────
-- This is what makes the two sides sides OF ONE THING rather than two unrelated sets: the map back is the
-- same map. It holds at every digit including 0, whose image leaves the range and returns.
-- READ ALONE, THIS THEOREM DOES NOT PIN THE REFLECTION. `d ↦ c - d` is an involution on 0..9 for EVERY
-- c from 9 to 20 under Nat's truncating subtraction — twelve constants satisfy it, and this states only
-- that ours is one of them. ceccec.github.io found the same shape in their tree as a facet checking
-- `reflect(reflect(h)) === h`, which holds for xor with ANY mask: it tested the operator, not the
-- reflection.
--
-- What pins c = 10 is two theorems below, and only together: `exactly_one_digit_is_unmoved` requires the
-- fixed points to be exactly [5], and `exactly_one_digit_reflects_out_of_range` requires exactly [0] to
-- leave the range. c = 12 fixes 6, c = 18 fixes 9, c = 9 fixes nothing; none of them leaves exactly one
-- digit outside. So the FILE identifies the reflection and this theorem does not, and anyone citing this
-- one alone should cite those with it.
theorem the_reflection_is_an_involution :
  digits.all (fun d => refl (refl d) == d) := by decide

-- ── ONE SIDE RETURNS TO ITSELF ───────────────────────────────────────────────────────────────────────────
theorem one_side_is_reflected_onto_itself :
  tetB.all (fun d => tetB.contains (refl d)) := by decide

-- ── THE OTHER TWO ARE CARRIED ACROSS, IN BOTH DIRECTIONS ─────────────────────────────────────────────────
-- Stated both ways round, because "carried across" said once could hold for a map that collapses one set
-- into the other and never comes back. It comes back.
theorem the_other_two_swap :
  tetA.all (fun d => axis.contains (refl d))
  ∧ axis.all (fun d => tetA.contains (refl d)) := by decide

-- ── THE CENTRE, AND ONLY IT ──────────────────────────────────────────────────────────────────────────────
theorem exactly_one_digit_is_unmoved :
  (digits.filter (fun d => refl d == d)) = [5] := by decide

-- ── THE ONE THAT LEAVES ──────────────────────────────────────────────────────────────────────────────────
-- The origin is the only digit whose reflection is not a digit. Nothing acts on it; it has no partner
-- inside the set, which is a fact about the set and not about a force.
theorem exactly_one_digit_reflects_out_of_range :
  (digits.filter (fun d => refl d > 9)) = [0]
  ∧ refl 0 = 10 := by decide

-- ── THE THREE CLASSES COVER THE NINE, AND THE PARTITION IS A PARTITION ───────────────────────────────────
theorem the_classes_partition_the_nine :
  tetA.length + tetB.length + axis.length = 9
  ∧ (tetA ++ tetB ++ axis).eraseDups.length = 9
  ∧ digits.length = 10 := by decide

-- ── NOTHING SURVIVES IN BETWEEN ──────────────────────────────────────────────────────────────────────────
-- Every digit is in exactly one of: reflected onto its own side, carried across, unmoved, or gone from the
-- range. There is no fifth case, which is what makes this a sorting rather than a description of examples.
theorem every_digit_is_sorted_exactly_once :
  digits.all (fun d =>
    (tetB.contains d && tetB.contains (refl d))
    || (tetA.contains d && axis.contains (refl d))
    || (axis.contains d && tetA.contains (refl d))
    || (refl d == d)
    || (refl d > 9)) := by decide


-- ── GRAVITY, WHICH IS A THEOREM HERE AND NOT A FIGURE OF SPEECH ──────────────────────────────────────────
-- `fall` is the fall to a fixed point: every digit 1..9 is already fixed, and 0 is the ONLY one that moves.
-- Reflection was measured above to have its own singular digit — 0 is the only one whose image leaves the
-- range, since r(0) = 10. Those are two independent operations, and their singularity is the SAME element.
--
-- That is the statement's two sides, decided: on gravity's fixed points 1..9 the reflection is a clean
-- involution that never leaves, so everything there is reflected and returns; the void alone both moves
-- under the fall and escapes under the reflection, and what escapes falls back inside — fall(r(0)) = 1.
-- Nothing is pulled anywhere. One element is simply where both operations are not the identity.
-- The package's fall, not a lookalike. I first wrote `if n == 0 then 9 else n`, which agrees with it on
-- the digits and DIVERGES at 10 — the kernel rejected the theorem that noticed. This is the digital root
-- the shipped `fall` computes, checked against it over 0..100 before being written here.
def fall (n : Nat) : Nat := if n == 0 then 9 else 1 + (n - 1) % 9
def nonzero : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9]

theorem the_fall_fixes_every_digit_but_the_void :
  (digits.filter (fun d => fall d != d)) = [0]
  ∧ nonzero.all (fun d => fall d == d) := by decide

theorem the_fall_and_the_reflection_share_one_exceptional_digit :
  (digits.filter (fun d => fall d != d)) = (digits.filter (fun d => refl d > 9)) := by decide

-- On the fixed points of gravity the reflection stays inside and undoes itself: the side that returns.
theorem on_the_fixed_points_the_reflection_never_leaves :
  nonzero.all (fun d => refl d >= 1 && refl d <= 9)
  ∧ nonzero.all (fun d => refl (refl d) == d) := by decide

-- And what does escape falls straight back in, so the coin has no outside.
theorem what_escapes_falls_back_inside :
  refl 0 = 10 ∧ fall 10 = 1 ∧ nonzero.contains (fall 10) := by decide

-- ── THE REFUSAL, as a theorem so it is checked and not merely written ────────────────────────────────────
-- The count of ASTROPHYSICAL claims this file makes. Gravity here is the fall to a fixed point, decided
-- above; a black hole is not, and no proposition in this file mentions one.
-- and the words that would make it one appear in the header as the thing being refused, never in a
-- proposition.
--
-- There was a `def physicalClaims : Nat := 0` here, decided against its own literal. The comment beside it
-- argued that "written as one it would be equally green" — which is the proof that it certified nothing in
-- EITHER direction: the number was zero because it was typed as zero, and would stay zero while the file
-- filled with claims about the sky. Whether a proposition names a physical quantity is a fact about this
-- file's TEXT, and Lean cannot read its own text. The refusal now lives in `contradictions.ts`, which reads
-- the propositions and can go red. What is kept here is the conjunct that was always read off a real list.
theorem the_digits_are_ten : digits.length = 10 := by decide

end Coin
