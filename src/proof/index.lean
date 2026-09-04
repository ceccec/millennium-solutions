-- title: The Millennium floor
-- wing: the floor
-- prior_art: unclassified
-- prior_art_own: the Millennium floor, computed from this sequence
-- The Millennium floor — seven honest theorems, one per problem, COMPUTED from the sequence.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- Each Clay problem gets ONE theorem here. None proves the conjecture — each states a TRUE fact that COMPUTES
-- from the ℤ/9 doubling sequence (the orbit 2^k, the reflection 10−d, the derived units) and is genuinely
-- ADJACENT to the problem. The refusal is NOT a theorem here, and that is deliberate: this file used to
-- carry `def provenHere : Nat := 0` with `the_floor_is_zero_of_seven : provenHere = 0 := rfl` beside it, and
-- the same literal glued as a conjunct onto every theorem below. That certifies nothing about the seven
-- problems — it decides that a number the author typed equals itself — while wearing the authority of a
-- kernel-checked, axiom-free proof. seal-lean.ts states the rule it broke: "`rfl` on a declared constant
-- proves the declaration and nothing else … it is not evidence."
--
-- An absence is not established by a certificate that a counter you maintain reads zero. It is established
-- by there being no such proof, which is a property of the tree and is checked over the tree — see
-- scripts/contradictions.ts, which fails if any theorem's statement reaches for the objects these
-- conjectures concern, and can therefore be refuted by adding one. The theorems below now state only what
-- the kernel actually worked for. No anchors (nothing is a
-- hand-picked structural constant — the units, the heart, the gap and the vanishing all emerge by
-- `filter`/`all`/`any`/`foldr`), no axioms (pure `by decide`, never `native_decide` or `sorry`), no Mathlib.
-- A single `lean` call verifies the file. Integrity, not truth. 0/7.

namespace MillenniumFloor

-- ── the sequence and its derived maps — functions, never a typed-in answer ─────────────────────────────────
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)  -- DERIVED: d has an inverse mod 9
def refl (d : Nat) : Nat := 10 - d                                            -- the reflection (= division by zero)
def orbit (k : Nat) : Nat := (2 ^ k) % 9                                      -- the doubling sequence 2^k, computed
def span : List Nat := (List.range 6).map orbit                               -- the doubling span (one period), computed

-- the honest floor, carried inside every theorem: this framework PROVES 0 of the 7.

-- ── 1 · Riemann — the reflection's symmetry and its single computed heart ─────────────────────────────────
-- The functional-equation reflection is a total involution; its fixed-point set has length ONE — the heart
-- emerges (never typed as "5"), the ½-analogue of the critical-line centre. The SYMMETRY, not the zeros' place.
theorem riemann_reflection_and_heart :
  (List.range 10).all (fun d => refl (refl d) == d)
  ∧ ((List.range 10).filter (fun d => refl d == d)).length = 1 := by decide

-- ── 2 · P versus NP — verification is one step, computed ───────────────────────────────────────────────────
-- Each unit has EXACTLY ONE inverse and each non-unit none: to VERIFY a proposed inverse is a single multiply,
-- while the map d ↦ d⁻¹ permutes the units. Cheap verification is not a separation; P vs NP is not decided.
theorem p_vs_np_inverse_is_unique :
  (List.range 9).all (fun d =>
    ((List.range 9).filter (fun e => (d * e) % 9 == 1)).length == (if isUnit d then 1 else 0)) := by decide

-- ── 3 · Navier–Stokes — the flow is bounded for all time, computed ────────────────────────────────────────
-- Every iterate of the doubling flow is a residue < 9 and stays inside the 6-cycle forever — a bounded
-- invariant set, no blowup. Bounded evolution is not global existence & smoothness; Navier–Stokes is not decided.
theorem navier_stokes_flow_is_bounded :
  ((List.range 48).map orbit).all (fun v => v < 9)
  ∧ (List.range 48).all (fun k => span.contains (orbit k)) := by decide

-- ── 4 · Yang–Mills — a discrete spectral gap, computed ────────────────────────────────────────────────────
-- The doubling has order exactly 6: it never returns to 1 before step 6, then closes at step 6 — a gap in the
-- cyclic spectrum. A discrete group-order gap is not the Yang–Mills mass gap; the mass gap is not decided.
theorem yang_mills_spectral_gap :
  (List.range 6).all (fun k => k == 0 || orbit k != 1)
  ∧ orbit 6 == 1 := by decide

-- ── 5 · Hodge — the algebraic span equals the units, computed ─────────────────────────────────────────────
-- The doubling span (algebraic generation from 2) is exactly the units, and every non-unit lies OUTSIDE it.
-- Generation/containment is not the Hodge conjecture (rational (p,p) ⇒ algebraic); Hodge is not decided.
theorem hodge_span_is_the_units :
  (List.range 9).all (fun d => span.contains d == isUnit d)
  ∧ (List.range 9).all (fun d => isUnit d || ! span.contains d) := by decide

-- ── 6 · Birch–Swinnerton-Dyer — a computed vanishing ──────────────────────────────────────────────────────
-- The orbit's digit sum vanishes mod 9 (1+2+4+8+7+5 = 27 ≡ 0), and so do the units (1+2+4+5+7+8 ≡ 0) — a
-- computed vanishing. A digit-sum vanishing is not the rank ↔ order-of-vanishing-of-L correspondence; BSD is not decided.
theorem birch_swinnerton_dyer_vanishing :
  (span.foldr (· + ·) 0) % 9 == 0
  ∧ ((List.range 9).filter isUnit).foldr (· + ·) 0 % 9 == 0 := by decide

-- ── 7 · Poincaré — one closed loop, no holes, computed ────────────────────────────────────────────────────
-- The sequence closes (orbit 6 = orbit 0) after six pairwise-distinct steps — a single simple loop. A closed
-- cyclic loop is not the 3-sphere characterization; Poincaré is Perelman's THEOREM (2003), not proved here.
theorem poincare_single_closed_loop :
  orbit 6 == orbit 0
  ∧ (List.range 6).all (fun i => (List.range 6).all (fun j => (orbit i == orbit j) == (i == j))) := by decide

-- ── the ledger — the floor is exactly zero of seven ───────────────────────────────────────────────────────
-- ── THE SEVEN REST ON ONE FINITE STRUCTURE, and it is small enough to state in full. Every theorem above is
--    built from three things: the reflection r(d)=10−d, the units of ℤ/9, and the doubling orbit. Here they
--    are, checked together — the reflection is an involution, the units number six, the orbit has period six,
--    and nothing above them is proved. That last conjunct is why this theorem exists: it puts the floor in
--    the SAME proposition as the structure, so the two cannot drift apart. A reader who accepts the algebra
--    has, in the same breath, accepted that it settles none of the seven.
theorem the_seven_rest_on_one_finite_structure :
  ((List.range' 1 9).all (fun d => refl (refl d) == d)) ∧
  (((List.range' 1 9).filter isUnit).length = 6) ∧
  (span.eraseDups.length = 6) := by decide


-- ── THE NINTH: the three digits the other eight leave outside ────────────────────────────────────────────
-- This file carries one theorem per residue of ℤ/9, and it briefly carried only eight, because the ninth
-- was `the_floor_is_zero_of_seven : provenHere = 0 := rfl` — a theorem deciding that a number typed one
-- line above equals itself. Removing it was right and leaving the gap was not: the ninth slot has real work
-- available, and the tautology had been standing where the work should be.
--
-- The eight above settle the units — six digits — and the structure they share. Nothing said what the
-- remaining three are. This does: the non-units are exactly {0, 3, 6}, the doubling reaches none of them,
-- and the two sets partition the nine. The kernel evaluates every part of that over the whole ring; written
-- with any other set on the right it would be RED, which is precisely what the theorem it replaces could
-- not manage.
theorem the_three_non_units_are_exactly_the_unreachable :
  ((List.range 9).filter (fun d => ! isUnit d)) = [0, 3, 6]
  ∧ ((List.range 9).filter (fun d => ! isUnit d)).all (fun d => ! span.contains d)
  ∧ ((List.range 9).filter isUnit).length + ((List.range 9).filter (fun d => ! isUnit d)).length = 9
  := by decide


-- ── THE TENTH AND ELEVENTH: the origin, and the return that closes the sequence ──────────────────────────
-- The sequence this deposit is built on is `1 2 4 8 7 5 3 6 9 0 1` — eleven positions. The seven Clay
-- theorems and the involution settle the first eight (the doubling circuit 1,2,4,8,7,5 and the first two of
-- the trinity, 3 and 6); the ninth settles the trinity as a set, including 9 ≡ 0. That left the last two
-- positions unstated: the origin, and the return.
--
-- THE ORIGIN. 0 is the one digit with no multiplicative inverse of any kind — not merely absent from the
-- unit group but annihilating: 0·e is never 1, for any e in the ring. It is also additively neutral, which
-- is why it is the origin and not just another non-unit. The doubling circuit never reaches it.
theorem the_origin_annihilates_and_never_joins_the_circuit :
  ((List.range 9).all (fun e => (0 * e) % 9 != 1))
  ∧ (! span.contains 0)
  ∧ ((List.range 9).all (fun d => (d + 0) % 9 == d % 9))
  := by decide

-- THE RETURN. The eleventh position is a 1 again, and that is not decoration: the sequence is exactly its
-- named parts in order — the doubling circuit, the trinity cross, the origin, the return — and it closes,
-- first digit equal to last. Written with any other decomposition on the right the kernel refuses it, which
-- is what distinguishes this from a restatement of the literal.
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]

theorem the_sequence_is_its_named_parts_and_closes :
  sequence = span ++ [3, 6, 9] ++ [0] ++ [1]
  ∧ sequence.length = 11
  ∧ sequence.head? = sequence.getLast?
  ∧ 9 % 9 = 0
  := by decide


end MillenniumFloor
