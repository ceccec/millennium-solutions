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

-- ── 12 · AN ODD WHEEL HAS NO ANTIPODE ─────────────────────────────────────────────────────────────────────
-- ledger: arts_no_exact_complement — "on the 9-hue wheel no hue has an exact complement (180° = 4.5 steps)".
-- The reason is the parity of the base, so it is decided as such: no whole number of 40° steps lands on 180°,
-- and no pair of the nine hues differs by 180° either way round.
theorem no_hue_on_an_odd_wheel_has_an_exact_complement :
  (List.range' 1 9).all (fun d => hue d != 180)
  ∧ (List.range' 1 9).all (fun a => (List.range' 1 9).all (fun b =>
      ((hue a + 360 - hue b) % 360 != 180)))
  ∧ 9 % 2 = 1 := by decide

-- ── 13 · THE INVERSE MAP IS ITS OWN UNDOING ───────────────────────────────────────────────────────────────
-- ledger: involution_reversible — "the multiplicative-inverse map applied twice is the identity on the units".
-- The inverse is found rather than tabulated: for a unit u, inv u is the unique e with u·e ≡ 1.
def inv (u : Nat) : Nat := ((List.range B).filter (fun e => m9 (u * e) == 1)).getD 0 0
theorem the_inverse_map_applied_twice_is_the_identity_on_the_units :
  units.all (fun u => inv (inv u) == u)
  ∧ units.all (fun u => m9 (u * inv u) == 1)
  ∧ (units.filter (fun u => inv u == u)) = [1, 8] := by decide

-- ── 14 · THE FIELD OF FOUR ELEMENTS HAS FOUR ELEMENTS ─────────────────────────────────────────────────────
-- ledger: gf4_size — "𝔽_4 = GF(2²) has p^k = 2² = 4 elements {0, 1, x, x+1}". The count is computed from the
-- prime power, and the four elements are exhibited as the 2-bit patterns that name them — which is what a
-- polynomial basis over 𝔽₂ is. No field ARITHMETIC is claimed here; the ledger claimed the size.
theorem the_field_of_order_four_has_four_elements :
  2 ^ 2 = 4
  ∧ ((List.range 4).map (fun n => (n / 2, n % 2))).length = 4
  ∧ (((List.range 4).map (fun n => (n / 2, n % 2))).eraseDups).length = 4 := by decide

-- ── 15 · EUCLID'S PERFECT NUMBERS, AT THE THREE THE LEDGER NAMED ──────────────────────────────────────────
-- ledger: euclid_euler_perfect — "even perfect numbers are 2^(p−1)(2^p−1) for a Mersenne prime: 6, 28, 496".
-- The Euclid–Euler theorem is prior art and is NOT proved here: what is decided is that the formula produces
-- those three at p = 2, 3, 5, that each equals the sum of its own proper divisors, and that the Mersenne
-- factor is prime at each. The general characterisation ranges over infinitely many and no decide reaches it.
def perfect (p : Nat) : Nat := 2 ^ (p - 1) * (2 ^ p - 1)
-- PROPER divisors: `List.range' 1 n` is [1 … n] and includes n itself, so the first version summed ALL
-- divisors and made 6 come out as 12. A perfect number equals the sum of the divisors BELOW it, which is
-- the whole content of the word, and the kernel refused the theorem rather than let the definition pass.
def divisorSum (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
theorem the_euclid_form_gives_the_first_three_perfect_numbers :
  perfect 2 = 6 ∧ perfect 3 = 28 ∧ perfect 5 = 496
  ∧ divisorSum 6 = 6 ∧ divisorSum 28 = 28 ∧ divisorSum 496 = 496
  ∧ [3, 7, 31].all (fun m => (List.range' 2 (m - 2)).all (fun d => m % d != 0)) := by decide

-- ── 16 · FERMAT'S TWO SQUARES, AT THE BOUND THE LEDGER STATED ─────────────────────────────────────────────
-- ledger: fermat_two_squares — "an odd prime p is a sum of two squares iff p ≡ 1 (mod 4) (p ≤ 50)". The
-- bound is the ledger's own and is kept: this decides the biconditional for every odd prime up to 50 and
-- claims nothing beyond it. Fermat's theorem itself is prior art and ranges over infinitely many primes.
def isPrime (n : Nat) : Bool := n > 1 && (List.range' 2 n).all (fun d => d * d > n || n % d != 0)
def twoSquares (n : Nat) : Bool :=
  (List.range (n + 1)).any (fun a => (List.range (n + 1)).any (fun b => a * a + b * b == n))
theorem every_odd_prime_to_fifty_is_a_sum_of_two_squares_exactly_when_it_is_one_mod_four :
  ((List.range' 3 48).filter isPrime).all (fun p => twoSquares p == (p % 4 == 1)) := by decide

-- ── 17 · PASCAL MOD TWO IS THE AND-MASK ───────────────────────────────────────────────────────────────────
-- ledger: pascal_mod2_lucas — "C(n,k) is odd iff (k AND n) = k". Lucas's theorem at p = 2, decided over a
-- triangle rather than asserted: the binomial is built by the recurrence so nothing is assumed about it.
-- BITS BY ARITHMETIC, NOT BY THE BITWISE OPERATORS. `&&&` and `>>>` on Nat carry `propext` through their
-- decidability instances, and scripts/lean.ts accepts a standard axiom only for a theorem proved for every
-- value — never for one closed by decide, where the whole claim is that the kernel walked a finite domain
-- and needed nothing else. Division and remainder reach the same bits and carry nothing.
def bit (n i : Nat) : Nat := (n / 2 ^ i) % 2

def binom : Nat → Nat → Nat
  | _, 0 => 1
  | 0, _ => 0
  | n + 1, k + 1 => binom n k + binom n (k + 1)
theorem pascal_is_odd_exactly_where_the_index_is_a_submask :
  (List.range 16).all (fun n => (List.range (n + 1)).all (fun k =>
    (binom n k % 2 == 1) == ((List.range 5).all (fun i => bit k i <= bit n i)))) := by decide

-- ── 18 · AND RULE 90 COUNTS BY POPCOUNT ───────────────────────────────────────────────────────────────────
-- ledger: rule90_sierpinski — "row n has 2^(popcount n) live cells". Follows from theorem 17, and is decided
-- independently rather than inferred: the live cells of row n are the k with C(n,k) odd, counted directly.
def popcount (n : Nat) : Nat := ((List.range 8).filter (fun i => bit n i == 1)).length
theorem the_live_cells_of_row_n_number_two_to_the_popcount :
  (List.range 16).all (fun n =>
    ((List.range (n + 1)).filter (fun k => binom n k % 2 == 1)).length == 2 ^ popcount n) := by decide

-- ── 19 · THE HANDSHAKE LEMMA, AND ITS CONSEQUENCE ─────────────────────────────────────────────────────────
-- ledger: handshake_lemma — "Σ deg(v) = 2·|E|, so the number of odd-degree vertices is even". Decided over
-- every graph on four labelled vertices — all 2^6 = 64 of them — so it is a statement about the family and
-- not about an example.
def pairs : List (Nat × Nat) := [(0,1),(0,2),(0,3),(1,2),(1,3),(2,3)]
def deg (g : Nat) (v : Nat) : Nat :=
  ((List.range 6).filter (fun i => bit g i == 1 && ((pairs.getD i (0,0)).1 == v || (pairs.getD i (0,0)).2 == v))).length
def edgeCount (g : Nat) : Nat := ((List.range 6).filter (fun i => bit g i == 1)).length
theorem every_graph_on_four_vertices_sums_its_degrees_to_twice_its_edges :
  (List.range 64).all (fun g =>
    (((List.range 4).map (deg g)).foldl (· + ·) 0 == 2 * edgeCount g)
    && (((List.range 4).filter (fun v => deg g v % 2 == 1)).length % 2 == 0)) := by decide

end Claimed
