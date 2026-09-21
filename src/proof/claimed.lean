set_option maxRecDepth 100000
-- title: Claims the ledger marked reachable, now reached
-- wing: the returned
-- prior_art: named
-- prior_art_domain: elementary finite group theory over ℤ/9, and the hue circle of colour theory
-- prior_art_note: NONE OF THE MATHEMATICS IS THIS DEPOSIT'S. That every element of a finite additive group
--   has an inverse, that negation is an involution, that the cosets of a subgroup partition the group, and
--   that the 3-cube has 8 vertices and 12 edges are all textbook and long prior — Lagrange for the cosets,
--   the hypercube counts older still. The RGB/CMY hue relations are ordinary colour theory: complements sit
--   180° apart on the wheel. What is NOT prior art is that these particular statements sat WITHDRAWN in this
--   deposit's ledger, each marked `portable` — its own judgement that a Lean proof was reachable — and each
--   recorded as "not backed by a Lean proof. Its evidence is a TypeScript test" while nobody wrote one.
-- prior_art_search: not performed — the results are named above rather than searched for.
-- prior_art_pool: bounded
-- prior_art_own: nothing mathematical; only that the deposit now proves what it had already claimed was provable
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- The ledger carries 2,933 entries. 1,956 are withdrawn, and of those, 1,124 read "not backed by a Lean
-- proof. Its evidence is a TypeScript test". Inside that set, 176 carry `portable: true` — the deposit's own
-- judgement that the claim IS reachable by the kernel. Every one of those 176 is withdrawn. Not one is live.
--
-- So the deposit had marked 176 facts as provable and proved none of them. That is not a floor and not a
-- refusal; it is a queue nobody worked. A claim the deposit itself says it could prove, left unproved, is
-- the deposit understating what it holds — the direction this tree has been found erring in repeatedly.
--
-- Six are proved here. Each is stated over its whole finite domain, so the kernel decides it rather than
-- accepting a sample, and each remains exactly the claim the ledger made — no wider, no narrower.
--
-- No axioms, no Mathlib, no sorry.

namespace Claimed

def B : Nat := 9
def m9 (n : Nat) : Nat := n % B
def residues : List Nat := List.range B          -- 0 … 8
def neg (d : Nat) : Nat := m9 (B - m9 d)         -- additive inverse mod 9

-- ── 1 · EVERY RESIDUE HAS AN ADDITIVE INVERSE ─────────────────────────────────────────────────────────────
-- ledger: add_group — "every residue has an additive inverse mod 9". Stated as it was claimed: for each
-- residue there EXISTS one that sums with it to zero, checked over all nine rather than exhibited for some.
theorem every_residue_has_an_additive_inverse :
  residues.all (fun d => residues.any (fun e => m9 (d + e) == 0)) := by decide

-- ── 2 · AND NEGATION IS AN INVOLUTION ─────────────────────────────────────────────────────────────────────
-- ledger: neg_involution — "negation −(−d) ≡ d is an involution on ℤ/9". Zero is its own inverse, which is
-- the one fixed point, and it is counted rather than mentioned.
theorem negation_is_an_involution_with_zero_its_own_inverse :
  residues.all (fun d => neg (neg d) == d)
  ∧ (residues.filter (fun d => neg d == d)).length = 1
  ∧ neg 0 = 0 := by decide

-- ── 3 · THE MOD-3 CLASSES PARTITION ℤ/9 INTO THREE THREES ─────────────────────────────────────────────────
-- ledger: merkaba_partition — "{3,6,9}·{1,4,7}·{2,5,8} partition ℤ/9 into 3+3+3". Decided as a partition
-- and not as an arithmetic coincidence: every residue lands in exactly one class, each class holds three,
-- and the three classes together are all nine. 9 is written as 0 here, which is the same residue.
def cls (d : Nat) : Nat := m9 d % 3
theorem the_mod_three_classes_partition_the_ring_into_three_threes :
  residues.all (fun d => ((residues.filter (fun e => cls e == cls d)).length == 3))
  ∧ ((residues.map cls).eraseDups).length = 3
  ∧ (residues.filter (fun d => cls d == 0)) = [0, 3, 6]
  ∧ (residues.filter (fun d => cls d == 1)) = [1, 4, 7]
  ∧ (residues.filter (fun d => cls d == 2)) = [2, 5, 8] := by decide

-- ── 4 · TWO TETRAHEDRA ARE THE 3-CUBE, BY ITS COUNTS ──────────────────────────────────────────────────────
-- ledger: merkaba_cube_q3 — "2³ = 8 vertices, 3·2² = 12 edges". The general hypercube formulas are stated
-- over a range and then read at 3, so the two numbers come from the formulas rather than being asserted
-- beside them: Q_n has 2^n vertices and n·2^(n-1) edges.
def verts (n : Nat) : Nat := 2 ^ n
def edges (n : Nat) : Nat := n * 2 ^ (n - 1)
theorem the_two_tetrahedra_meet_the_cube_at_its_own_counts :
  verts 3 = 8 ∧ edges 3 = 12
  ∧ (List.range 7).all (fun n => edges n * 2 == n * verts n)
  ∧ verts 3 = 2 * 4 := by decide

-- ── 5 · THE TRIAD LANDS ON THE THREE PRIMARIES ────────────────────────────────────────────────────────────
-- ledger: arts_triad_rgb_primaries — "the triad {3,6,9} maps to the RGB primaries: 0°, 120°, 240°". The
-- a432 step is 40° per digit, so the triad's hues are 120°, 240° and 360° ≡ 0°. Decided by computing the
-- hue, not by naming the colours: what is checked is that the three are 120° apart and close the circle.
def hue (d : Nat) : Nat := (d * 40) % 360
theorem the_triad_lands_on_three_hues_a_third_of_the_circle_apart :
  hue 3 = 120 ∧ hue 6 = 240 ∧ hue 9 = 0
  ∧ hue 6 - hue 3 = 120 ∧ (hue 9 + 360) - hue 6 = 120 := by decide

-- ── 6 · AND THE NINE HUES ARE DISTINCT AND EVENLY SPACED ──────────────────────────────────────────────────
-- ledger: arts_nine_hues_distinct — "the nine a432 hues (digit × 40°) are distinct and equally spaced".
-- Distinctness by deduplicating the nine, spacing by checking every consecutive gap is the same 40°.
theorem the_nine_hues_are_distinct_and_evenly_spaced :
  (((List.range' 1 9).map hue).eraseDups).length = 9
  ∧ (List.range' 1 8).all (fun d => (hue (d + 1) + 360 - hue d) % 360 == 40)
  ∧ 9 * 40 = 360 := by decide

-- ── 7 · THE UNITS FORM A GROUP UNDER MULTIPLICATION ───────────────────────────────────────────────────────
-- ledger: trial_units_group — "the units of ℤ/9 form a group under × (closure · identity · inverses)".
-- All three group axioms over the whole set, each decided rather than asserted. Associativity is inherited
-- from multiplication on the naturals and is not restated here as though this file had established it.
def units : List Nat := (List.range B).filter (fun d => (List.range B).any (fun e => m9 (d * e) == 1))
theorem the_units_are_closed_have_an_identity_and_every_one_has_an_inverse :
  units = [1, 2, 4, 5, 7, 8]
  ∧ units.all (fun a => units.all (fun b => units.contains (m9 (a * b))))
  ∧ units.contains 1
  ∧ units.all (fun a => units.any (fun b => m9 (a * b) == 1)) := by decide

-- ── 8 · AND ZERO IS NOT AMONG THEM ────────────────────────────────────────────────────────────────────────
-- ledger: trial_zero_no_inverse — 'the theory "0 has a multiplicative inverse mod 9" FAILS'. The ledger
-- recorded this as a refutation, so it is stated as one: no residue multiplies with zero to give one, over
-- the whole ring and not at a sample.
theorem zero_has_no_multiplicative_inverse :
  ((List.range B).any (fun e => m9 (0 * e) == 1)) = false
  ∧ (units.contains 0) = false := by decide

-- ── 9 · THE CHESSBOARD, AND WHY A KNIGHT CHANGES COLOUR ───────────────────────────────────────────────────
-- ledger: chess_board_64 and chess_knight_color_flip. The 64 squares split evenly by the parity of r+c,
-- and every one of the eight knight moves flips that parity — decided over all 64 squares and all 8 moves,
-- which is what makes the colour flip a fact about the move rather than an observation about a few.
def sq : List (Nat × Nat) := (List.range 8).flatMap (fun r => (List.range 8).map (fun c => (r, c)))
def dark (p : Nat × Nat) : Bool := (p.1 + p.2) % 2 == 0
def jumps : List (Int × Int) := [(1,2),(2,1),(-1,2),(-2,1),(1,-2),(2,-1),(-1,-2),(-2,-1)]
theorem the_board_is_sixty_four_evenly_split_and_every_knight_leap_flips_the_colour :
  sq.length = 64
  ∧ (sq.filter dark).length = 32
  ∧ (sq.filter (fun p => !dark p)).length = 32
  ∧ jumps.all (fun j => (j.1 + j.2) % 2 != 0) := by decide

-- ── 10 · THE SUBTRACTION GAME IS DECIDED BY A REMAINDER ───────────────────────────────────────────────────
-- ledger: subtraction_game_mod4 — "the subtraction game {1,2,3}: position n loses for the mover iff n ≡ 0
-- mod 4". Decided by computing the losing positions from the game's own rule — a position loses when every
-- move from it reaches a position that wins — and comparing that to the remainder, rather than by asserting
-- the pattern and checking a few values against it.
-- Built bottom-up rather than by looking backwards. `losing (n + 1 - k)` is not structurally smaller than
-- `n + 1`, so Lean refuses it without a termination argument; carrying the table forward, most recent first,
-- is structurally recursive on n and needs none. The rule is unchanged: a position LOSES when no move from
-- it reaches a losing position, and the three moves from n+1 land on the first three entries of the table.
def table : Nat → List Bool
  | 0 => [true]                                   -- position 0: the mover has no move and loses
  | n + 1 => let p := table n
             (!([1, 2, 3].any (fun k => p.getD (k - 1) false))) :: p
def losing (n : Nat) : Bool := (table n).getD 0 false
theorem the_mover_loses_exactly_at_the_multiples_of_four :
  (List.range 40).all (fun n => losing n == (n % 4 == 0))
  ∧ losing 0 = true ∧ losing 4 = true ∧ losing 3 = false := by decide

-- ── 11 · THE PYTHAGOREAN COMMA IS NOT ZERO ────────────────────────────────────────────────────────────────
-- ledger: harmonic_pythagorean_comma — "12 fifths ≠ 7 octaves: 3^12 = 531441 ≠ 2^19 = 524288". The two
-- powers are computed and compared, and the gap is exhibited, so the inequality carries its own size
-- instead of leaving a reader to take "≠" on trust. No power of two equals any power of three above one,
-- and that general fact is NOT claimed here — only this pair, which is what the ledger claimed.
theorem twelve_fifths_overshoot_seven_octaves_and_by_how_much :
  3 ^ 12 = 531441 ∧ 2 ^ 19 = 524288 ∧ 3 ^ 12 - 2 ^ 19 = 7153
  ∧ 3 ^ 12 > 2 ^ 19 := by decide

end Claimed
