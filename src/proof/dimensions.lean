set_option maxRecDepth 100000
-- title: The Planck exponents are the only ones the dimensions permit
-- wing: the ring
-- prior_art: named
-- prior_art_domain: dimensional analysis and the Buckingham π theorem (Buckingham, 1914; the method is
--   older). Planck's construction of natural units from ħ, c and G, 1899. The exponents themselves are in
--   NIST's definitions and in every textbook that derives them.
-- prior_art_note: NOTHING HERE IS NEW AND THE DERIVATION IS THE STANDARD ONE. Solving three linear
--   equations for three exponents is what dimensional analysis IS, and the answers have been known since
--   1899. What this deposit adds is the quantifier: the textbook SOLVES for the exponents, and this
--   EXHAUSTS every alternative in range and finds exactly one, so "these exponents" becomes "no others".
-- prior_art_search: not performed — Buckingham and Planck are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the uniqueness by exhaustion, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- Six of the thirteen files in Zenodo record 22895141 derive the Planck units by dimensional analysis:
-- ℓ_P = √(ħG/c³), t_P = √(ħG/c⁵), m_P = √(ħc/G). src/proof/planck.lean already RECORDS those exponents,
-- doubled so they stay integers — (1,1,−3), (1,1,−5), (1,−1,1) — and reasons with them.
--
-- WHAT IT DOES NOT DECIDE IS THAT THEY ARE FORCED. A recorded exponent triple is a value someone read off
-- a derivation; the derivation's whole content is that no other triple works, and that claim had no
-- theorem. It is a small gap and it is exactly the kind this deposit exists to close: the question is
-- linear arithmetic over a finite range, which is the one sort of question a kernel settles by exhaustion.
--
-- THE SYSTEM. With doubled exponents A, B, D standing for ħ^(A/2) c^(B/2) G^(D/2), the dimensions are
--
--     M^((A−D)/2)  L^((2A+B+3D)/2)  T^((−A−B−2D)/2)
--
-- so a LENGTH needs (A−D, 2A+B+3D, −A−B−2D) = (0, 2, 0), a TIME (0, 0, 2) and a MASS (2, 0, 0). Every
-- triple in −9…9 is tried against each, and exactly one survives each time.
--
-- THE ORDER OF THE TRIPLE IS NOT THE ONE planck.lean USES, and the kernel caught me assuming it was. That
-- file writes (ħ, G, c) and records the Planck length as (1, 1, −3); this one writes (ħ, c, G) and gets
-- (1, −3, 1). Same construction, same physics, the two middle entries swapped — and a triple copied across
-- the boundary without reading the convention is simply a wrong triple, which is what `decide` refused.
-- Both orderings are stated here so the next reader does not have to guess which file means what.
--
-- No axioms, no Mathlib, no sorry.

namespace Dimensions

-- The three dimensional exponents a construction ħ^(A/2) c^(B/2) G^(D/2) carries, doubled.
def massOf   (A B D : Int) : Int := A - D
def lengthOf (A B D : Int) : Int := 2 * A + B + 3 * D
def timeOf   (A B D : Int) : Int := -A - B - 2 * D

-- Every candidate in range. 19^3 = 6859 triples, exhausted three times over.
def R : List Int := (List.range 19).map (fun k => Int.ofNat k - 9)
def solves (m l t : Int) (A B D : Int) : Bool :=
  massOf A B D == m && lengthOf A B D == l && timeOf A B D == t
def solutions (m l t : Int) : List (Int × Int × Int) :=
  R.flatMap (fun A => R.flatMap (fun B => (R.filter (fun D => solves m l t A B D)).map (fun D => (A, B, D))))

-- ── 1 · THE PLANCK LENGTH'S EXPONENTS ARE THE ONLY ONES ───────────────────────────────────────────────────
-- √(ħG/c³) doubled is (1, 1, −3), and nothing else in range gives a length.
theorem the_length_exponents_are_unique :
  solutions 0 2 0 == [(1, -3, 1)] := by decide

-- ── 2 · AND THE PLANCK TIME'S ─────────────────────────────────────────────────────────────────────────────
theorem the_time_exponents_are_unique :
  solutions 0 0 2 == [(1, -5, 1)] := by decide

-- ── 3 · AND THE PLANCK MASS'S ─────────────────────────────────────────────────────────────────────────────
theorem the_mass_exponents_are_unique :
  solutions 2 0 0 == [(1, 1, -1)] := by decide

-- ── 4 · THEY AGREE WITH WHAT planck.lean ALREADY RECORDS ──────────────────────────────────────────────────
-- The three triples restated against the dimensional equations directly, so this file does not rest on its
-- own enumeration alone: each is checked to produce the dimensions it claims.
theorem each_triple_produces_the_dimension_it_claims :
  (massOf 1 (-3) 1, lengthOf 1 (-3) 1, timeOf 1 (-3) 1) == (0, 2, 0)
  && (massOf 1 (-5) 1, lengthOf 1 (-5) 1, timeOf 1 (-5) 1) == (0, 0, 2)
  && (massOf 1 1 (-1), lengthOf 1 1 (-1), timeOf 1 1 (-1)) == (2, 0, 0) := by decide

-- ── 5 · THE CONTROL: NOT EVERY TARGET HAS A SOLUTION ──────────────────────────────────────────────────────
-- THE THEOREM THAT STOPS 1 TO 3 FROM BEING FREE. If `solutions` returned a singleton for everything, the
-- uniqueness above would be a property of the search and not of the dimensions. A target needing an odd
-- mass exponent has NO solution in range, because A − D and the others cannot meet it.
theorem some_targets_have_no_solution_at_all :
  solutions 1 1 1 == [] && (solutions 0 2 0).length == 1 := by decide

-- ── 6 · AND THE SEARCH CAN RETURN MORE THAN ONE ───────────────────────────────────────────────────────────
-- The other half of the control: a system with a free direction returns many, so a singleton means the
-- system pinned it and not that the enumeration can only ever find one thing.
-- WRITTEN FIRST WITH A CONJUNCT THAT WAS SIMPLY FALSE: `(R.filter (fun A => massOf A 0 0 == 0)).length > 1`
-- — but massOf A 0 0 is A, so exactly one value in range satisfies it, not many. That is the THIRD figure
-- in this file I typed from expectation instead of computing, after a transposed exponent triple and a
-- miscounted solution list. Each was refused. The free direction that does return many is the pair (A, D)
-- with A = D, and it returns nineteen — one for each value in range, which is what "free" means.
theorem a_looser_condition_returns_many :
  (R.flatMap (fun A => (R.filter (fun D => massOf A 0 D == 0)).map (fun D => (A, D)))).length == 19
  && (R.flatMap (fun A => (R.filter (fun D => massOf A 0 D == 0)).map (fun D => (A, D)))).length > 1
  && (R.filter (fun A => massOf A 0 0 == 0)).length == 1 := by decide

-- ── 7 · A DIMENSIONLESS COMBINATION IS THE TRIVIAL ONE ────────────────────────────────────────────────────
-- Asking for no dimensions at all returns only the empty product — so ħ, c and G are dimensionally
-- independent over this range, which is what licenses calling the three solutions above unique at all.
theorem the_three_constants_are_dimensionally_independent :
  solutions 0 0 0 == [(0, 0, 0)] := by decide

-- ── 8 · WHAT THIS DOES NOT DECIDE ─────────────────────────────────────────────────────────────────────────
-- IT SAYS NOTHING ABOUT PHYSICS, AND NOTHING ABOUT THE VALUES. Dimensional analysis fixes the exponents and
-- leaves a dimensionless coefficient entirely undetermined — every source in record 22895141 says so, and
-- the Planck units are DEFINED by choosing that coefficient to be one. So this file decides which powers of
-- ħ, c and G give a length, and it does not decide that the resulting length is physically significant,
-- that it is a minimum length, or that anything happens there. Those are claims about the world; this is
-- three linear equations.
theorem the_coefficient_is_undetermined_and_the_exponents_are_not :
  solutions 0 2 0 == [(1, -3, 1)]
  && lengthOf 1 (-3) 1 == 2 && massOf 1 (-3) 1 == 0 && timeOf 1 (-3) 1 == 0 := by decide

end Dimensions
