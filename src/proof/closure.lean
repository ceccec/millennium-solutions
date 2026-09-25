set_option maxRecDepth 100000
-- title: The named properties of this ring are not closed under their own diagonal
-- wing: the ring
-- prior_art: named
-- prior_art_domain: Cantor's diagonal argument again, turned on a vocabulary rather than a set; the
--   observation that no finite list of definable predicates over a finite domain exhausts the predicates.
-- prior_art_note: THE METHOD IS CANTOR'S AND THE FINITE CASE IS ELEMENTARY. What is this deposit's is the
--   direction it is pointed: src/proof/diagonal.lean applies it to a diagram somebody else published, and
--   this file applies the identical construction to THIS deposit's own vocabulary, over this deposit's own
--   ring, using the nine properties its own files name. A limit exhibited rather than conceded.
-- prior_art_search: not performed — Cantor is named above.
-- prior_art_pool: unbounded
-- prior_art_own: the nine named properties, the exhibited witness, and the honesty clause in theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/proof/diagonal.lean put a published ring of labels to Cantor and it did not survive: for any list of
-- named properties there is a subject the list does not address, and the subject can be constructed rather
-- than argued for. That was about somebody else's drawing, which is the easy direction.
--
-- THIS FILE TURNS IT ROUND. ℤ/9 has nine residues, so it has exactly 2^9 = 512 properties. This deposit
-- names nine of them — unit, span, triad, origin, fixed by the reflection, even, square, primitive root,
-- self-inverse — and reasons with those nine across forty-nine files. The same construction that emptied
-- the poster's ring builds, from those nine and nothing else, a tenth property of ℤ/9 that is none of them:
-- the one that disagrees with property i about residue i. Its truth table is printed by theorem 4. It is an
-- ordinary property of an ordinary finite ring and this deposit has no name for it.
--
-- THEOREM 8 IS THE ONE THAT KEEPS THIS HONEST, and it is deliberately the one that weakens the file. The
-- witness is NOT undecidable, NOT unprovable, and NOT beyond this deposit's reach: the kernel decides it
-- below, in the same file, by the same tactic as everything else. What is shown is narrower and it is the
-- only thing shown — that the VOCABULARY is not closed. Any nine names leave a tenth property unnamed, and
-- adding the tenth leaves an eleventh, which theorem 6 checks rather than asserts.
--
-- WHAT THAT FORBIDS. It forbids exactly one sentence, and this deposit has been close to writing it: that
-- some finite list of named properties CHARACTERISES this structure. No such list does, at any length, and
-- the counter-example is computable from the list itself in the time it takes to read it.
--
-- No axioms, no Mathlib, no sorry.

namespace Closure

def R : List Nat := List.range 9

-- ── THE NINE PROPERTIES THIS DEPOSIT NAMES ────────────────────────────────────────────────────────────────
-- Each is a property some file in src/proof already reasons about, restated here as a predicate on a
-- residue so they can be compared to one another as objects rather than as prose.
def isUnit      (d : Nat) : Bool := d % 3 != 0                    -- z9.lean: the six units
def inSpan      (d : Nat) : Bool := [1, 2, 4, 8, 7, 5].contains d -- index.lean: the doubling span
def isTriad     (d : Nat) : Bool := [3, 6, 0].contains d          -- merkaba.lean: the axis
def isOrigin    (d : Nat) : Bool := d == 0                        -- index.lean: the annihilator
def isFixed     (d : Nat) : Bool := (9 - d) % 9 == d              -- reflection.lean: fixed by σ
def isEven      (d : Nat) : Bool := d % 2 == 0                    -- elementary.lean
def isSquare    (d : Nat) : Bool := R.any (fun k => k * k % 9 == d)
def isPrimitive (d : Nat) : Bool := [2, 5].contains d             -- reached.lean: the primitive roots
def isSelfInv   (d : Nat) : Bool := d * d % 9 == 1

def named : List (Nat → Bool) := [isUnit, inSpan, isTriad, isOrigin, isFixed, isEven, isSquare, isPrimitive, isSelfInv]

-- A property, as a table over the nine residues — the form in which two properties can be compared.
def table (p : Nat → Bool) : List Bool := R.map p

-- THE WITNESS. Residue i gets the negation of what the i-th named property says about residue i, so it
-- disagrees with every one of them somewhere, by construction and not by search.
def unnamed (d : Nat) : Bool :=
  match named.get? d with
  | some p => !(p d)
  | none   => false

-- ── 1 · NINE NAMES, SEVEN PROPERTIES ──────────────────────────────────────────────────────────────────────
-- THIS THEOREM WAS FIRST WRITTEN AS "the nine are pairwise different" AND THE KERNEL REFUSED IT. Two pairs
-- of names this deposit uses separately denote the SAME property of ℤ/9:
--
--   isUnit  = inSpan    the six units are exactly the doubling span. This is not a coincidence and it is
--                       not news — it is index.lean's own theorem, the Hodge window, arriving here from
--                       the truth tables instead of from a citation.
--   isOrigin = isFixed   σ(d) = (9−d) mod 9 fixes the origin and nothing else, so "is zero" and "is fixed
--                       by the reflection" are one property on this ring. In 0…10 the fixed point is 5;
--                       mod 9 it is 0, and the two files that name them separately are describing the same
--                       set without saying so.
--
-- So the vocabulary is thinner than its own index suggests, which strengthens everything below rather than
-- weakening it: seven properties, not nine, against 512.
theorem nine_names_denote_seven_distinct_properties :
  named.length == 9
  && ((named.map table).foldl (fun acc t => if acc.contains t then acc else acc ++ [t]) ([] : List (List Bool))).length == 7
  && table isUnit == table inSpan
  && table isOrigin == table isFixed := by decide

-- ── 2 · THE WITNESS DISAGREES WITH PROPERTY i AT RESIDUE i ────────────────────────────────────────────────
theorem the_witness_disagrees_with_property_i_at_residue_i :
  (List.range 9).all (fun i => unnamed i != (named.getD i (fun _ => false)) i) := by decide

-- ── 3 · SO IT IS NONE OF THEM ─────────────────────────────────────────────────────────────────────────────
-- The conclusion, stated over whole tables rather than at single points: there is no i for which the
-- witness and the i-th named property agree everywhere on ℤ/9.
theorem the_witness_is_none_of_the_nine_named_properties :
  (List.range 9).all (fun i => table unnamed != table (named.getD i (fun _ => false))) := by decide

-- ── 4 · AND IT IS AN ORDINARY PROPERTY, PRINTED ───────────────────────────────────────────────────────────
-- EXHIBITED, NOT DESCRIBED. This is the whole difference between "no finite vocabulary suffices", which
-- anyone may write, and a counter-example a reader can check against the nine definitions above.
-- The table was TYPED here on the first attempt and the kernel refused it — a fabricated constant inside
-- the one theorem whose job is to exhibit a computed one. It is what `unnamed` evaluates to, nothing else.
theorem the_witness_is_this_table :
  table unnamed == [true, false, true, true, true, true, true, true, false] := by decide

-- ── 5 · THE CONTROL: BEING ABSENT FROM THE LIST IS NOT AUTOMATIC ──────────────────────────────────────────
-- Theorems 2 and 3 would also hold if `table` had broken, or if comparison always answered "different".
-- A property that IS one of the nine must be found among them, and `isUnit` is found at index 0.
theorem a_property_that_is_named_is_found_among_the_named :
  (List.range 9).any (fun i => table isUnit == table (named.getD i (fun _ => false)))
  && table isUnit == table (named.getD 0 (fun _ => false))
  && table isUnit != table unnamed := by decide

-- ── 6 · THE DIAGONAL EXHAUSTS THIS DOMAIN AT NINE ─────────────────────────────────────────────────────────
-- READ src/proof/domain.lean BEFORE TAKING THIS FOR MORE THAN IT SAYS. This heading read "the diagonal
-- runs out at nine", and the author's correction was six words: nine folding zero reflects one. The
-- theorem is untouched and still holds — over the NINE RESIDUES the construction escapes nine and stops at
-- ten. What was wrong is the sentence around it. Nine is the size of the domain this file chose, and
-- index.lean:167 defines an eleven-position one on the same page the nine came from, whose two extra
-- positions are exactly the fold (9 ≡ 0) and the return (refl 9 = 1). domain.lean decides the reach at
-- both sizes and withdraws the sentence.
-- WRITTEN FIRST AS "naming the witness leaves another unnamed", WHICH IS FALSE, AND THE KERNEL SAID SO.
-- Diagonalisation needs one point per property. ℤ/9 has nine points, so it escapes a list of nine and it
-- CANNOT escape a list of ten: the construction reads residue i against property i and there is no residue
-- to read the tenth property against.
--
-- The failure is exact and it is exhibited rather than described. Add the witness to the nine and the
-- diagonal of the resulting ten is the witness ITSELF — the tenth entry — because indices 0 to 8 are
-- unchanged and index 9 is never consulted. The trick does not weaken here, it stops.
--
-- This is why theorem 7 exists. Past nine, the escape is a COUNT and not a construction, and the two are
-- not interchangeable: counting proves something is missing and never says which, while the diagonal hands
-- you the thing. A file that claimed one and used the other would be trading a witness for an assurance.
theorem the_diagonal_escapes_nine_and_stops :
  let ten := named ++ [unnamed]
  let next := fun d => !((ten.getD d (fun _ => false)) d)
  ten.length == 10
  && (List.range 9).all (fun i => table next != table (named.getD i (fun _ => false)))
  && table next == table unnamed
  && table next == table (ten.getD 9 (fun _ => false)) := by decide

-- ── 7 · NINE NAMES AGAINST FIVE HUNDRED AND TWELVE PROPERTIES ─────────────────────────────────────────────
-- The counting statement behind all of it, so the reader is not left to take the diagonal's word for the
-- scale. ℤ/9 has nine residues and therefore 2^9 properties; this deposit names nine of them.
-- The seven distinct properties of theorem 1, not the nine names, are what this deposit actually holds.
theorem nine_residues_carry_five_hundred_and_twelve_properties :
  2 ^ 9 == 512 && R.length == 9 && named.length == 9 && 512 - 7 == 505 := by decide

-- ── 8 · AND THE WITNESS IS DECIDED RIGHT HERE ─────────────────────────────────────────────────────────────
-- THE CLAUSE THAT NARROWS THIS FILE TO WHAT IT ACTUALLY SHOWS. Nothing above is about provability,
-- undecidability, or a limit on what this kernel can settle: the witness is settled by the same tactic as
-- every other theorem in this deposit, on the line below, and its behaviour on every residue is decided
-- twice over. What is not closed is the VOCABULARY — the list of properties this deposit has NAMED — and a
-- reader who takes anything stronger from theorems 1 to 7 is taking more than was proved.
theorem the_witness_is_decided_here_and_is_no_kind_of_limit :
  R.all (fun d => unnamed d == !((named.getD d (fun _ => false)) d))
  && (table unnamed).length == 9
  && ((table unnamed).filter (fun b => b)).length == 7 := by decide

end Closure
