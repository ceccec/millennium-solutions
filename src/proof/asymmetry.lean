set_option maxRecDepth 100000
-- title: Two kinds of cross formula — one that runs both ways and one that does not
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the injectivity of a map on a finite set, and the involution; the one-way function of
--   cryptography, whose whole content is that a relation is easy in one direction and not the other.
-- prior_art_note: NONE OF IT IS THIS DEPOSIT'S. An involution is its own inverse by definition, a
--   non-injective map loses information by definition, and "easy forwards, hard backwards" is the premise
--   of public-key cryptography (Diffie–Hellman 1976). What is this deposit's is neither: it is that its own
--   cross formulas are sorted into the two kinds and the difference is decided rather than assumed, on the
--   ring it reasons about.
-- prior_art_search: not performed — all three are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the sorting below, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- scripts/coils.ts clusters expressions that compute the same thing and licenses substituting either for
-- the other. Every coil it finds is SYMMETRIC — the relation is equality of extension, which is an
-- equivalence, decided in src/proof/equivalence.lean. That is one kind of cross formula and the tree had
-- only that kind.
--
-- The other kind is the one this deposit is named for. A cross formula may run ONE WAY: from d you can
-- compute d² and from d² you cannot recover d, because two residues share a square. Knowing either end of
-- a symmetric pair gives you the other; knowing the image of an asymmetric map gives you a SET.
--
-- Both are decided here on the same ring, so the difference is a measurement and not a metaphor:
--
--     refl   d ↦ (10 − d) mod 9    injective, an involution — SYMMETRIC, runs both ways
--     double d ↦ 2d mod 9          injective, NOT an involution — invertible, but not by itself
--     square d ↦ d² mod 9          NOT injective, image of four — ASYMMETRIC, loses information
--
-- THE THIRD ROW IS WHY THE SECOND MATTERS. Invertible and symmetric are not the same thing, and a file
-- that showed only refl and square would suggest they were: doubling runs both ways and is nobody's own
-- inverse, which is the middle case that keeps the dichotomy honest.
--
-- No axioms, no Mathlib, no sorry.

namespace Asymmetry

def m9 (n : Nat) : Nat := n % 9
def ring : List Nat := List.range 9
def refl (d : Nat) : Nat := m9 (10 - d)
def dbl (d : Nat) : Nat := m9 (2 * d)
def sq (d : Nat) : Nat := m9 (d * d)

def image (f : Nat → Nat) : List Nat := (ring.map f).eraseDups
def injective (f : Nat → Nat) : Bool := (image f).length == ring.length

-- ── 1 · THE SYMMETRIC ONE RUNS BOTH WAYS BY ITSELF ────────────────────────────────────────────────────────
-- An involution: applying it twice returns. Either end of the pair gives the other, with no second map.
theorem the_reflection_is_its_own_inverse :
  ring.all (fun d => refl (refl d) == d) && injective refl := by decide

-- ── 2 · THE ASYMMETRIC ONE LOSES WHAT IT WAS GIVEN ────────────────────────────────────────────────────────
-- Squaring is not injective: nine residues land on four. From d² the residue d is not recoverable, and the
-- count of what is lost is stated rather than described.
theorem squaring_is_not_injective_and_its_image_is_four :
  !(injective sq) && (image sq).length == 4 && ring.length == 9 := by decide

-- ── 3 · AND EVERY SQUARE HAS A SECOND ROOT ────────────────────────────────────────────────────────────────
-- Not merely "some collision exists": for every residue there is a DIFFERENT one with the same square, so
-- the loss is total rather than occasional — knowing d² never narrows the answer to one.
theorem every_residue_shares_its_square_with_another :
  ring.all (fun d => ring.any (fun e => e != d && sq e == sq d)) := by decide

-- ── 4 · THE MIDDLE CASE, WHICH KEEPS THE DICHOTOMY HONEST ─────────────────────────────────────────────────
-- THE THEOREM THAT STOPS 1 AND 2 FROM READING AS "INVERTIBLE = SYMMETRIC". Doubling is injective, so it
-- runs both ways — and it is NOT its own inverse. Invertible and self-inverse are different properties, and
-- a file showing only refl and square would quietly conflate them.
theorem doubling_is_invertible_and_is_not_its_own_inverse :
  injective dbl && !(ring.all (fun d => dbl (dbl d) == d)) := by decide

-- ── 5 · WHAT THE ASYMMETRIC MAP RETURNS IS A SET, NOT A VALUE ─────────────────────────────────────────────
-- The practical content: inverting the symmetric map yields one residue, inverting the asymmetric one
-- yields a class of them. Two apiece here, and the classes partition the ring.
theorem inverting_the_symmetric_gives_one_and_the_asymmetric_gives_many :
  ring.all (fun d => (ring.filter (fun e => refl e == refl d)).length == 1)
  && ring.all (fun d => (ring.filter (fun e => sq e == sq d)).length > 1)
  && (ring.filter (fun e => sq e == sq 1)).length == 2 := by decide

-- ── 6 · THE TWO KINDS PROVE EACH OTHER BY CONTRAST ────────────────────────────────────────────────────────
-- Neither statement is worth anything alone: "runs both ways" means nothing without a map that does not,
-- and "loses information" means nothing without one that does not. Decided together on the same ring, over
-- the same domain, so the difference is between the maps and not between two ways of asking.
theorem each_kind_is_defined_by_the_other :
  (injective refl != injective sq)
  && ((image refl).length != (image sq).length)
  && (ring.all (fun d => refl (refl d) == d) != ring.all (fun d => sq (sq d) == d)) := by decide

-- ── 7 · THE SYMMETRIC MAP CARRIES THE ASYMMETRIC ONE'S IMAGE SOMEWHERE ELSE ───────────────────────────────
-- A cross formula between the two: reflecting the squares does not give the squares back. So the two
-- structures are genuinely different subsets and not the same set under two names — which is the coil test
-- from scripts/coils.ts, applied here and answering NO.
theorem the_squares_are_not_closed_under_the_reflection :
  !((image sq).all (fun d => (image sq).contains (refl d)))
  && (image sq).length == ((image sq).map refl).eraseDups.length := by decide

-- ── 8 · WHAT THIS DOES NOT SAY ABOUT CRYPTOGRAPHY ─────────────────────────────────────────────────────────
-- NOTHING HERE IS A ONE-WAY FUNCTION. Squaring on nine residues loses information and is inverted by
-- looking at all nine, which takes no time at all; a cryptographic one-way function is hard to invert at a
-- size where exhaustion is infeasible, and hardness is not a property this kernel can decide over a finite
-- domain it walks in full. What is decided is the SHAPE — that a relation can fail to run backwards — and
-- the shape is the thing this deposit's asymmetric wing is named for, not a claim about difficulty.
theorem the_shape_is_decided_and_the_difficulty_is_not :
  !(injective sq) && ring.length == 9
  && (ring.filter (fun e => sq e == 0)).length == 3 := by decide

end Asymmetry
