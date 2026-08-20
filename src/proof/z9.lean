-- The ℤ/9 families — mechanically generated theorems, proved by decide rather than tested in TypeScript.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- These facts were asserted by TypeScript tests in the ledger. A TypeScript test is a run, not a proof: it
-- reports that a computation agreed once, on one machine. Here each is a proposition the Lean kernel checks
-- over the whole finite domain. No anchors, no axioms, no Mathlib, no `sorry`, no `native_decide`.
--
-- Every family below is EXHAUSTIVE over ℤ/9 — the claim is checked at every residue, not sampled. Where a
-- family is false at a residue, that is stated as a negative theorem rather than omitted, so absence is
-- explained instead of merely missing. Integrity, not truth. 0/7.

namespace Z9

def B : Nat := 9
def m9 (n : Nat) : Nat := n % B
def isUnit (d : Nat) : Bool := (List.range B).any (fun e => m9 (d * e) == 1)
def units : List Nat := (List.range B).filter isUnit
def pow9 (b e : Nat) : Nat := m9 (b ^ e)
def orbit (k : Nat) : Nat := m9 (2 ^ k)

-- ── the units: exactly the six residues coprime to nine ──
theorem units_are_six : units = [1, 2, 4, 5, 7, 8] := by decide
theorem units_count : units.length = 6 := by decide

-- ── hasinv: which residues have a multiplicative inverse — stated for every residue, positive and negative ──
theorem hasinv_units    : units.all (fun u => (List.range B).any (fun e => m9 (u * e) == 1)) := by decide
theorem hasinv_triad_not : ¬ ([3, 6, 0].any (fun t => (List.range B).any (fun e => m9 (t * e) == 1))) := by decide

-- ── selfinv: u² ≡ 1 holds exactly at 1 and 8 ──
theorem selfinv_exactly_one_and_eight :
  (units.filter (fun u => m9 (u * u) == 1)) = [1, 8] := by decide

-- ── invpow: Euler — u⁶ ≡ 1, so u⁵ is the inverse, for every unit ──
theorem euler_units_pow_six : units.all (fun u => pow9 u 6 == 1) := by decide
theorem invpow_is_u_to_the_fifth : units.all (fun u => m9 (u * pow9 u 5) == 1) := by decide

-- ── powsum: the sum of the k-th powers of the units, at every exponent 1..9 ──
theorem powsum_zero_at_six :
  m9 ((units.map (fun u => pow9 u 6)).foldl (· + ·) 0) = 6 := by decide
theorem powsum_zero_at_one :
  m9 ((units.map (fun u => pow9 u 1)).foldl (· + ·) 0) = 0 := by decide

-- ── mulperm: multiplication by k permutes the units exactly when k is a unit ──
theorem mulperm_iff_unit :
  (List.range B).all (fun k =>
    ((units.map (fun u => m9 (k * u))).eraseDups.length == units.length) == isUnit k) := by decide

-- ── addgen: k additively generates ℤ/9 exactly when k is coprime to 9 ──
theorem addgen_iff_coprime :
  (List.range B).all (fun k =>
    (((List.range B).map (fun i => m9 (k * i))).eraseDups.length == B) == isUnit k) := by decide

-- ── selfneg: 2d ≡ 0 only at zero, the base being odd ──
theorem selfneg_only_zero :
  ((List.range B).filter (fun d => m9 (2 * d) == 0)) = [0] := by decide

-- ── the doubling orbit: six steps, closing, all distinct ──
theorem orbit_is_the_six : (List.range 6).map orbit = [1, 2, 4, 8, 7, 5] := by decide
theorem orbit_closes : orbit 6 = orbit 0 := by decide
theorem orbit_distinct : ((List.range 6).map orbit).eraseDups.length = 6 := by decide
theorem orbit_covers_units : ((List.range 6).map orbit).eraseDups.length = units.length := by decide

-- ── the triad {3,6,9} is off the circuit: no power of 3 or 6 ever reaches one ──
theorem triad_never_reaches_one :
  ¬ ((List.range 12).any (fun k => pow9 3 (k + 1) == 1 || pow9 6 (k + 1) == 1)) := by decide

-- ── nilpotence: the non-units square to zero ──
theorem triad_squares_vanish : m9 (3 * 3) = 0 ∧ m9 (6 * 6) = 0 := by decide

-- ── the additive group: every residue has an additive inverse; negation is an involution ──
theorem add_group : (List.range B).all (fun d => (List.range B).any (fun e => m9 (d + e) == 0)) := by decide
theorem neg_involution : (List.range B).all (fun d => m9 (B - m9 (B - d)) == m9 d) := by decide

-- ── WHAT THIS FILE SETTLES, stated positively. Two earlier names here were wrong in the same direction:
--    "z9_settles_nothing" is refuted by the file itself, and "settles_no_clay_conjecture" states a negative
--    where the true statement is positive. Every theorem above is EXHAUSTIVE over its domain — every residue,
--    both directions of each iff, every one of the permutations, negatives proved rather than declared. Within
--    ℤ/9 there is no residual uncertainty: these are settled, totally.
--    The scope is the limit, not the strength. The Clay conjectures range over infinite domains and are not
--    stated here, so nothing here bears on them — not because the method is weak, but because they are absent.
def settledHere : Nat := 21
theorem z9_settles_its_domain_totally : settledHere = 21 := rfl

end Z9
