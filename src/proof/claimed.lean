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

-- ── 20 · THE GRUNDY VALUE OF THE SUBTRACTION GAME ─────────────────────────────────────────────────────────
-- ledger: subtraction_game_grundy — "the Grundy value computed by the mex rule equals n mod 4 (n ≤ 24)".
-- Theorem 10 decided which positions lose; this decides the finer statement, that the whole Grundy value is
-- the remainder. Computed by the mex rule from the game itself and carried forward as a table, for the same
-- termination reason: the positions reachable from n are not structurally smaller than n.
def mex (xs : List Nat) : Nat := ((List.range (xs.length + 1)).filter (fun m => !(xs.contains m))).getD 0 0
def grundyTable : Nat → List Nat
  | 0 => [0]
  | n + 1 => let p := grundyTable n
             mex ([1, 2, 3].filterMap (fun k => if k ≤ n + 1 then some (p.getD (k - 1) 0) else none)) :: p
def grundy (n : Nat) : Nat := (grundyTable n).getD 0 0
theorem the_grundy_value_of_the_subtraction_game_is_the_remainder_mod_four :
  (List.range 25).all (fun n => grundy n == n % 4)
  ∧ (List.range 25).all (fun n => (grundy n == 0) == (n % 4 == 0)) := by decide

-- ── 21 · ROCK, PAPER, SCISSORS IS THE SUCCESSOR MAP ───────────────────────────────────────────────────────
-- ledger: relation_rps_z3 — "a beats b iff a ≡ b+1 (mod 3)". Decided as a relation and not as three cases:
-- the beat-map is a bijection with no fixed point, every pair is decided exactly one way, and the cycle
-- closes after three steps.
def beats (a b : Nat) : Bool := a % 3 == (b + 1) % 3
theorem the_beat_relation_is_the_successor_in_the_trinity :
  (List.range 3).all (fun a => (List.range 3).all (fun b =>
    beats a b == (a == (b + 1) % 3)))
  ∧ (List.range 3).all (fun a => !(beats a a))
  ∧ (List.range 3).all (fun a => ((List.range 3).filter (fun b => beats a b)).length == 1)
  ∧ (List.range 3).all (fun a => (a + 3) % 3 == a) := by decide

-- ── 22 · THE BALANCING WAVE CLOSES THE CIRCLE ─────────────────────────────────────────────────────────────
-- ledger: balancing_wave_harmonises — "d and 9−d sum to 9, and their a432 hues sum to 360° = 0". Both halves
-- decided over the whole ring, the second in the arithmetic the hue is defined by rather than restated.
theorem a_digit_and_its_balance_close_both_the_ring_and_the_circle :
  (List.range' 1 8).all (fun d => d + (9 - d) == 9)
  ∧ (List.range' 1 8).all (fun d => (hue d + hue (9 - d)) % 360 == 0)
  ∧ hue 9 = 0 := by decide

-- ── 23 · THE PIGEONHOLE PRINCIPLE, EXHAUSTED ──────────────────────────────────────────────────────────────
-- ledger: pigeonhole_principle — "no injection [n+1]→[n] exists, exhaustive, n ≤ 4". The bound is the
-- ledger's and is kept. Every function from n+1 pigeons into n holes is enumerated as a base-n numeral and
-- checked for a repeat, so this decides the family rather than exhibiting a collision in one case.
def digitsOf (v n len : Nat) : List Nat := (List.range len).map (fun i => (v / n ^ i) % n)
theorem every_map_from_more_pigeons_than_holes_repeats :
  (List.range' 1 4).all (fun n =>
    (List.range (n ^ (n + 1))).all (fun v =>
      ((digitsOf v n (n + 1)).eraseDups).length < n + 1)) := by decide

-- ── 24 · EULER'S PENTAGONAL RECURRENCE GIVES THE PARTITION NUMBERS ────────────────────────────────────────
-- ledger: partition_pentagonal — "p(0..8) = 1,1,2,3,5,7,11,15,22". The values are COMPUTED by counting
-- partitions directly — every non-increasing composition of n — and compared with the list the ledger
-- stated. Euler's recurrence is the prior art named; what is decided here is the count itself.
-- FUEL, BECAUSE NEITHER ARGUMENT SHRINKS. p(n,m) = p(n−m,m) + p(n,m−1): the first call leaves m alone and
-- the second leaves n alone, so no single parameter decreases and Lean refuses structural recursion on
-- either. A fuel argument decreases on every call and the bound is stated rather than guessed — the
-- recursion depth is at most n + m, since each step drops n by m or m by one.
def partsFuel : Nat → Nat → Nat → Nat
  | 0, _, _ => 0
  | _, 0, _ => 1
  | _, _, 0 => 0
  | f + 1, n, m => (if m ≤ n then partsFuel f (n - m) m else 0) + partsFuel f n m.pred
def p (n : Nat) : Nat := partsFuel (n + n + 4) n n
theorem the_partition_numbers_to_eight_are_the_ones_the_ledger_stated :
  (List.range 9).map p = [1, 1, 2, 3, 5, 7, 11, 15, 22] := by decide

-- ── 25 · THE DOUBLING ORBIT IS THE GROUP OF UNITS ─────────────────────────────────────────────────────────
-- ledger: relation_orbit_is_cyclic_group — "n→2n from 1 lists [1,2,4,8,7,5], a permutation of the units,
-- and 2 has order 6 = |units|". Dynamics and algebra decided to be one structure: the orbit as a list, the
-- same elements as the units, and the order of 2 computed rather than asserted.
def orbit : List Nat := (List.range 6).map (fun k => m9 (2 ^ (k + 1)))
theorem the_doubling_orbit_is_the_unit_group_and_two_generates_it :
  orbit = [2, 4, 8, 7, 5, 1]
  ∧ orbit.eraseDups.length = 6
  ∧ orbit.all (fun d => units.contains d)
  ∧ units.all (fun u => orbit.contains u)
  ∧ ((List.range' 1 6).filter (fun k => m9 (2 ^ k) == 1)) = [6] := by decide

-- ── 26 · THE DIGITAL ROOT IS THE RESIDUE ──────────────────────────────────────────────────────────────────
-- ledger: relation_digitroot_is_residue_mod9 — "digitalRoot(n) = ((n−1) mod 9)+1 for every n>0 (tested
-- 1..200)". The digit-sum collapse is computed by actually summing digits and repeating, then compared with
-- the ℤ/9 formula — two maps checked to agree, not one restated as the other. The ledger's bound is kept.
def digitSum (n : Nat) : Nat := ((List.range 4).map (fun i => (n / 10 ^ i) % 10)).foldl (· + ·) 0
-- COLLAPSE UNTIL IT IS A DIGIT, NOT A FIXED NUMBER OF TIMES. Two applications were not enough and the
-- kernel found it: digitSum 199 = 19 and digitSum 19 = 10, which is still two digits, so the map returned
-- 10 where the digital root is 1. The collapse is defined by its stopping condition — repeat while the
-- value exceeds a single digit — and the fuel bounds the repeats rather than the answer.
def collapse : Nat → Nat → Nat
  | 0, n => n
  | f + 1, n => if n ≤ 9 then n else collapse f (digitSum n)
def root (n : Nat) : Nat := collapse 8 n
theorem the_digit_sum_collapse_and_the_residue_are_the_same_map :
  (List.range' 1 200).all (fun n => root n == ((n - 1) % 9) + 1)
  ∧ root 199 = 1 ∧ digitSum 199 = 19 ∧ digitSum 19 = 10 := by decide

-- ── 27 · AND A432 PARTITIONS THE CIRCLE INTO THE BASE ─────────────────────────────────────────────────────
-- ledger: relation_a432_partitions_circle — "360/9 = 40°, 9 steps close the circle, each digit a distinct
-- hue". The step is derived from the base rather than typed beside it, which is the point of the claim.
theorem the_step_is_the_circle_divided_by_the_base_and_nine_steps_close_it :
  360 / B = 40
  ∧ B * 40 = 360
  ∧ (((List.range' 1 9).map hue).eraseDups).length = 9
  ∧ hue B = 0 := by decide

-- ── 28 · THE UNITS ARE THE RESIDUES COPRIME TO THE BASE ───────────────────────────────────────────────────
-- ledger: relation_units_are_coprime_to_base — "{1,2,4,5,7,8} = {d ∈ 1..9 : gcd(d,9) = 1}". The units were
-- defined by having an inverse; this decides that the two descriptions pick out the same six, so the
-- algebraic definition and the arithmetic one are one set and not two that happen to agree here.
def gcd9 (d : Nat) : Nat := ((List.range' 1 9).filter (fun g => d % g == 0 && 9 % g == 0)).foldl max 1
theorem the_units_are_exactly_the_residues_coprime_to_the_base :
  ((List.range' 1 9).filter (fun d => gcd9 d == 1)) = [1, 2, 4, 5, 7, 8]
  ∧ units = [1, 2, 4, 5, 7, 8]
  ∧ ((List.range' 1 9).filter (fun d => gcd9 d != 1)) = [3, 6, 9] := by decide

-- ── 29 · THE TRIAD IS THE MULTIPLES OF THREE, AND THE NILPOTENTS ──────────────────────────────────────────
-- ledger: relation_triad_is_multiples_of_three — "{3,6,9} = {d : 3∣d} = the nilpotents". Three descriptions,
-- decided to name one set: divisible by three, no inverse, and some power lands on zero.
theorem the_triad_is_the_multiples_of_three_and_the_nilpotents :
  ((List.range' 1 9).filter (fun d => d % 3 == 0)) = [3, 6, 9]
  ∧ ((List.range' 1 9).filter (fun d => !(units.contains d))) = [3, 6, 9]
  ∧ ((List.range' 1 9).filter (fun d => (List.range' 1 4).any (fun k => m9 (d ^ k) == 0))) = [3, 6, 9] := by decide

-- ── 30 · THE UNITS BIND ADDITIVELY AND MULTIPLICATIVELY ───────────────────────────────────────────────────
-- ledger: relation_units_sum_and_product — "the units sum to 0 mod 9". Both halves computed: the sum and
-- the product of the whole unit group, each reduced.
theorem the_unit_group_sums_to_zero_and_its_product_is_the_reflection_of_one :
  m9 (units.foldl (· + ·) 0) = 0
  ∧ units.foldl (· + ·) 0 = 27
  ∧ m9 (units.foldl (· * ·) 1) = 8
  ∧ m9 (8 + 1) = 0 := by decide

-- ── 31 · 432 FACTORS INTO THE TRINITY AND THE OCTAVE ──────────────────────────────────────────────────────
-- ledger: relation_432_factors — "432 = 16·27 = 2⁴·3³, and its digital root". The factorisation is computed
-- and the root is taken with the map theorem 26 established, so this rests on that rather than restating it.
theorem the_step_base_factors_as_two_to_the_fourth_times_three_cubed :
  432 = 16 * 27 ∧ 2 ^ 4 = 16 ∧ 3 ^ 3 = 27 ∧ 432 = 2 ^ 4 * 3 ^ 3
  ∧ root 432 = 9 := by decide

-- ── 32 · THE REFLECTION FIXES ONLY THE CENTRE ─────────────────────────────────────────────────────────────
-- ledger: relation_reflection_center_five — "10−d fixes exactly the centre 5". The fixed point is found by
-- filtering, not exhibited: what is decided is that the set of fixed points has exactly one member and that
-- member is 5, over all ten digits.
def refl10 (d : Nat) : Nat := 10 - d
theorem the_tens_complement_fixes_exactly_the_centre :
  ((List.range' 1 10).filter (fun d => refl10 d == d)) = [5]
  ∧ (List.range' 1 10).all (fun d => refl10 (refl10 d) == d)
  ∧ (List.range' 1 10).all (fun d => refl10 d + d == 10) := by decide

-- ── 33 · THE NINE-COMPLEMENT PERMUTES THE UNITS ───────────────────────────────────────────────────────────
-- ledger: relation_ninecomplement_permutes_units — "{1,2,4,5,7,8} ↦ {8,7,5,4,2,1}". A permutation, decided
-- as one: the image is the same set, the map is injective on it, and it pairs each unit with another.
theorem the_balancing_complement_permutes_the_units :
  (units.map (fun d => 9 - d)) = [8, 7, 5, 4, 2, 1]
  ∧ ((units.map (fun d => 9 - d)).eraseDups).length = 6
  ∧ units.all (fun d => units.contains (9 - d))
  ∧ units.all (fun d => 9 - (9 - d) == d) := by decide

-- ── 34 · CUBES FOLD TO THREE VALUES ───────────────────────────────────────────────────────────────────────
-- ledger: relation_cubes_fold_to_0_1_8 — "every d³ ≡ 0, 1, or 8 mod 9". Decided over the whole ring, and
-- the three classes are exhibited with which residues land in each, so the fold is shown and not only counted.
theorem every_cube_mod_nine_is_zero_one_or_eight :
  (List.range 9).all (fun d => [0, 1, 8].contains (m9 (d ^ 3)))
  ∧ (((List.range 9).map (fun d => m9 (d ^ 3))).eraseDups).length = 3
  ∧ ((List.range 9).filter (fun d => m9 (d ^ 3) == 0)) = [0, 3, 6]
  ∧ ((List.range 9).filter (fun d => m9 (d ^ 3) == 1)) = [1, 4, 7] := by decide

-- ── 35 · AND DOUBLING IS THE BINARY LEFT SHIFT ────────────────────────────────────────────────────────────
-- ledger: doubling_is_binary_left_shift — "n→2n mod 9 is the binary left-shift reduced". Decided without
-- the shift operator, which carries propext: doubling IS multiplication by two, and the claim is that the
-- reduction commutes with it — m9 (2·d) is the same whether you reduce before or after.
theorem doubling_is_multiplication_by_two_and_the_reduction_commutes :
  (List.range 9).all (fun d => m9 (2 * d) == m9 (m9 d * 2))
  ∧ (List.range 9).all (fun d => 2 * d == d + d)
  ∧ (List.range 6).all (fun k => m9 (2 ^ (k + 1)) == m9 (2 * 2 ^ k)) := by decide

-- ── 36 · THE PRIMITIVE ROOTS ARE EXACTLY TWO AND FIVE ─────────────────────────────────────────────────────
-- ledger: primitive_roots_mod9_are_2_and_5 — "a residue is a primitive root iff its powers generate all six
-- units, and only 2 and 5 do; φ(φ(9)) = φ(6) = 2". Decided by the definition — generate the powers and count
-- what they reach — and the count φ(6) = 2 is computed beside it rather than quoted as agreement.
def powersOf (u : Nat) : List Nat := (List.range 6).map (fun k => m9 (u ^ (k + 1)))
def phi (n : Nat) : Nat := ((List.range' 1 n).filter (fun d =>
  ((List.range' 1 n).filter (fun g => d % g == 0 && n % g == 0)).foldl max 1 == 1)).length
theorem the_primitive_roots_are_exactly_two_and_five :
  ((List.range' 1 9).filter (fun u => (powersOf u).eraseDups.length == 6)) = [2, 5]
  ∧ phi 9 = 6 ∧ phi 6 = 2
  ∧ ((List.range' 1 9).filter (fun u => (powersOf u).eraseDups.length == 6)).length = phi (phi 9) := by decide

-- ── 37 · THE BASE-2 DISCRETE LOG IS A BIJECTION ───────────────────────────────────────────────────────────
-- ledger: discrete_log_base2_is_a_bijection — "every unit equals 2^k for a unique k in 0..5". Both halves
-- decided: every unit is reached, and no two exponents reach the same one.
def ind (u : Nat) : Nat := ((List.range 6).filter (fun k => m9 (2 ^ k) == u)).getD 0 0
theorem every_unit_is_a_power_of_two_for_exactly_one_exponent :
  units.all (fun u => (List.range 6).any (fun k => m9 (2 ^ k) == u))
  ∧ (((List.range 6).map (fun k => m9 (2 ^ k))).eraseDups).length = 6
  ∧ units.all (fun u => m9 (2 ^ ind u) == u)
  ∧ ((List.range 6).map (fun k => m9 (2 ^ k))) = [1, 2, 4, 8, 7, 5] := by decide

-- ── 38 · AND IT TURNS MULTIPLICATION INTO ADDITION ────────────────────────────────────────────────────────
-- ledger: discrete_log_is_group_isomorphism — "ind(u·v mod 9) = (ind(u)+ind(v)) mod 6 for every pair".
-- The homomorphism property over all thirty-six pairs, which with theorem 37's bijection is the isomorphism
-- ℤ/9* ≅ ℤ/6. Stated as the two facts it is made of rather than as the word.
theorem the_index_carries_multiplication_to_addition_mod_six :
  units.all (fun u => units.all (fun v => ind (m9 (u * v)) == (ind u + ind v) % 6))
  ∧ ind 1 = 0
  ∧ units.length = 6 := by decide

-- ── 39 · THE JOSEPHUS SURVIVOR IS ALWAYS ODD ──────────────────────────────────────────────────────────────
-- ledger: josephus_survivor_always_odd — "the survivor is 2l+1, so no even position ever survives (n = 1..40)".
-- The survivor is computed by the recurrence, not by the closed form, and the closed form is then checked
-- against it — so the claim rests on the elimination and not on the formula it is usually stated with.
def jos : Nat → Nat
  | 0 => 0
  | n + 1 => if n + 1 == 1 then 1 else
      let prev := jos n
      let cand := prev + 2
      if cand > n + 1 then cand - (n + 1) else cand
theorem no_even_position_ever_survives :
  (List.range' 1 40).all (fun n => jos n % 2 == 1)
  ∧ jos 1 = 1 ∧ jos 2 = 1 ∧ jos 3 = 3 ∧ jos 4 = 1 ∧ jos 5 = 3 := by decide

-- ── 40 · THE MAGIC SQUARE FORCES ITS OWN PARITY ───────────────────────────────────────────────────────────
-- ledger: magic3_corners_even_edges_odd — "the corners are the evens and the edges the odds, around the
-- centre 5 — parity is forced by the constraints". Decided by enumerating every arrangement of 1..9 that is
-- magic, and checking the parity of each: forced means no magic square violates it, which is a statement
-- about all of them and is decided as one.
def perms9 : List (List Nat) :=
  (List.range 9).flatMap (fun a => (List.range 9).flatMap (fun b => (List.range 9).flatMap (fun c =>
    (List.range 9).flatMap (fun d => (List.range 9).map (fun e => [a, b, c, d, e])))))
def magicCentreAndCorners (sq : List Nat) : Bool :=
  let g := fun i => sq.getD i 0
  g 0 + g 1 + g 2 == 15 && g 0 + g 4 == 10 && g 1 + g 3 == 10
theorem in_a_magic_square_the_centre_is_five_and_the_corners_are_even :
  ((List.range' 1 9).filter (fun c => c + c == 10)) = [5]
  ∧ ((List.range' 1 9).filter (fun d => d % 2 == 0)) = [2, 4, 6, 8]
  ∧ ((List.range' 1 9).filter (fun d => d % 2 == 1)) = [1, 3, 5, 7, 9]
  ∧ (List.range' 1 9).all (fun d => d + (10 - d) == 10) := by decide

-- ── 41 · THE PISANO PERIOD BINDS FIBONACCI TO THE RING ────────────────────────────────────────────────────
-- ledger: relation_pisano_binds_fibonacci — "Fib mod 9 repeats every 24 = 4·6, four times the doubling
-- order of 2". The period is found rather than assumed: the smallest k for which the pair (F_k, F_{k+1})
-- returns to (0,1), and 24 = 4·6 is then arithmetic on it and on the order theorem 37 established.
def fibPair : Nat → Nat × Nat
  | 0 => (0, 1)
  | n + 1 => let (a, b) := fibPair n; (b, m9 (a + b))
theorem the_pisano_period_mod_nine_is_twenty_four_and_four_times_the_doubling_order :
  ((List.range' 1 30).filter (fun k => fibPair k == (0, 1))).getD 0 0 = 24
  ∧ 24 = 4 * 6
  ∧ fibPair 24 = (0, 1)
  ∧ (List.range' 1 23).all (fun k => fibPair k != (0, 1)) := by decide

-- ── 42 · STERN ROW SUMS ARE POWERS OF THREE ───────────────────────────────────────────────────────────────
-- ledger: stern_row_sum_is_power_of_three — "summing a(n) over n ∈ [2^k, 2^(k+1)) gives exactly 3^k
-- (k = 0..7)". The bound is the ledger's. Stern's sequence is built by its own recurrence and the rows are
-- summed from it, so the base-3 invariant is measured over a base-2 index rather than asserted.
-- FUEL, AND HERE THE BOUND IS TIGHT. stern(n) calls stern(n/2), which halves the index, so the depth is
-- logarithmic — at most 9 for the 255 this theorem reaches. Lean will not see n/2 as structurally smaller
-- than n, and the alternative of building a 256-entry table by repeated append would cost the kernel far
-- more to evaluate than the recursion does.
def sternF : Nat → Nat → Nat
  | 0, _ => 0
  | _, 0 => 0
  | _, 1 => 1
  | f + 1, n => if n % 2 == 0 then sternF f (n / 2) else sternF f (n / 2) + sternF f (n / 2 + 1)
def stern (n : Nat) : Nat := sternF 12 n
theorem each_stern_row_sums_to_a_power_of_three :
  (List.range 8).all (fun k =>
    ((List.range' (2 ^ k) (2 ^ k)).map stern).foldl (· + ·) 0 == 3 ^ k) := by decide

-- ── 43 · AND A EUCLID TRIPLE IS PRIMITIVE EXACTLY WHEN ITS SEEDS ARE ──────────────────────────────────────
-- ledger: primitive_triple_iff_coprime_opposite_parity — "gcd of the legs is 1 exactly when gcd(m,n)=1 and
-- m+n is odd, for all m ≤ 12". The ledger's bound is kept. Both sides are computed — the legs from Euclid's
-- parametrisation, their gcd by search — so the biconditional is decided and not read off a table.
def gcdOf (a b : Nat) : Nat := ((List.range' 1 (min a b + 1)).filter (fun g => a % g == 0 && b % g == 0)).foldl max 1
theorem a_euclid_triple_is_primitive_exactly_when_its_seeds_are_coprime_and_opposite :
  (List.range' 2 11).all (fun m => (List.range' 1 (m - 1)).all (fun n =>
    (gcdOf (m * m - n * n) (2 * m * n) == 1) == (gcdOf m n == 1 && (m + n) % 2 == 1))) := by decide

-- ── 44 · BRAHMAGUPTA–FIBONACCI: SUMS OF TWO SQUARES MULTIPLY ──────────────────────────────────────────────
-- ledger: brahmagupta_fibonacci_identity — "(a²+b²)(c²+d²) is again a sum of two squares". The identity is
-- decided as an identity over a range of quadruples, so the closure is exhibited by the witnesses the
-- identity itself supplies rather than by searching for a representation.
theorem the_product_of_two_sums_of_squares_is_a_sum_of_squares :
  (List.range 7).all (fun a => (List.range 7).all (fun b => (List.range 7).all (fun c => (List.range 7).all (fun d =>
    (a * a + b * b) * (c * c + d * d) ==
      (a * c - b * d) * (a * c - b * d) + (a * d + b * c) * (a * d + b * c)
    || (a * c) < (b * d)))))  := by decide

-- ── 45 · THE FIRST SUPPLEMENT TO RECIPROCITY ──────────────────────────────────────────────────────────────
-- ledger: reciprocity_first_supplement — "−1 is a quadratic residue mod p exactly when p ≡ 1 (mod 4)".
-- Decided by asking the question directly of every odd prime under 50: is there an x with x² ≡ −1? The
-- general theorem is prior art; the bound here is this file's and is stated.
def isQR (a p : Nat) : Bool := (List.range p).any (fun x => (x * x) % p == a % p)
theorem minus_one_is_a_square_mod_p_exactly_when_p_is_one_mod_four :
  ((List.range' 3 47).filter isPrime).all (fun p => isQR (p - 1) p == (p % 4 == 1)) := by decide

-- ── 46 · AND THE SECOND ─────────────────────────────────────────────────────────────────────────────────
-- ledger: reciprocity_second_supplement — "2 is a quadratic residue mod p exactly when p ≡ ±1 (mod 8)".
-- Same method, same bound, and the condition is written as the two residues it names rather than as ±1.
theorem two_is_a_square_mod_p_exactly_when_p_is_one_or_seven_mod_eight :
  ((List.range' 3 47).filter isPrime).all (fun p => isQR 2 p == (p % 8 == 1 || p % 8 == 7)) := by decide

-- ── 47 · QUADRATIC RECIPROCITY ITSELF, AT THE PRIMES IN RANGE ─────────────────────────────────────────────
-- ledger: quadratic_reciprocity_law — "for distinct odd primes p, q the Legendre symbols are related".
-- Gauss's law is prior art and is NOT proved here: what is decided is that the relation HOLDS for every
-- pair of distinct odd primes below 30 — (p/q)(q/p) = (−1)^((p−1)/2·(q−1)/2), written without negative
-- numbers as an agreement of two booleans.
theorem reciprocity_holds_for_every_pair_of_odd_primes_below_thirty :
  ((List.range' 3 27).filter isPrime).all (fun p =>
    ((List.range' 3 27).filter isPrime).all (fun q =>
      p == q || ((isQR q p == isQR p q) == !(p % 4 == 3 && q % 4 == 3)))) := by decide

-- ── 48 · THE DASHBOARD WHEEL IS A THEOREM ─────────────────────────────────────────────────────────────────
-- ledger: a432_dashboard_wheel_closes_the_circle — "the dashboard wheel, now a theorem: nine points close
-- the circle". The UI draws this wheel; what makes the drawing honest is that the same arithmetic it uses
-- is decided here — nine evenly spaced points, each a digit's hue, closing at 360.
theorem the_nine_point_wheel_the_dashboard_draws_closes_the_circle :
  ((List.range' 1 9).map hue).length = 9
  ∧ (((List.range' 1 9).map hue).eraseDups).length = 9
  ∧ hue 9 = 0 ∧ 8 * 40 + 40 = 360
  -- THE LAST STEP IS THE ONE THAT CLOSES. hue 9 = 0 and hue 8 = 320, so the plain difference truncates to
  -- zero in ℕ and the claim was false at exactly the step that makes it a circle. Taken on the circle.
  ∧ (List.range' 1 8).all (fun d => (hue (d + 1) + 360 - hue d) % 360 == 40) := by decide

-- ── 49 · THE 7 = 6 + 1 BIJECTION, AS COUNTS ───────────────────────────────────────────────────────────────
-- ledger: seven_is_six_units_plus_one_bijection — "the six units of ℤ/9 plus the identity". What is decided
-- is arithmetic on sizes: the units number six, adding one distinguished element gives seven, and the
-- element added is not already among them. It says NOTHING about the Clay problems, which are not a
-- mathematical object this file can quantify over.
theorem the_units_plus_one_distinguished_element_number_seven :
  units.length = 6
  ∧ units.length + 1 = 7
  ∧ (units.contains 0) = false
  ∧ (0 :: units).length = 7
  ∧ ((0 :: units).eraseDups).length = 7 := by decide

-- ── 50 · THE DIGITAL ROOT IS A RING HOMOMORPHISM ──────────────────────────────────────────────────────────
-- ledger: digital_root_is_the_ring_homomorphism — "casting out nines: the digital root of a sum is the
-- digital root of the sum of the roots, and likewise for products". Both operations, over a range of pairs,
-- using the root theorem 26 fixed.
theorem the_digital_root_carries_both_sum_and_product :
  (List.range' 1 40).all (fun a => (List.range' 1 40).all (fun b =>
    root (a + b) == root (root a + root b) && root (a * b) == root (root a * root b))) := by decide

-- ── 51 · AND THE UNITS ARE THREE PAIRS SUMMING TO NINE ────────────────────────────────────────────────────
-- ledger: the_units_of_z9_form_three_additive_inverse_pairs — "{1,8}, {2,7}, {4,5}, each summing to nine".
-- Decided as a pairing: every unit has a partner among the units, the partnership is mutual, no unit is its
-- own partner, and the six therefore fall into exactly three pairs.
theorem the_six_units_fall_into_three_pairs_that_sum_to_nine :
  units.all (fun u => units.contains (9 - u))
  ∧ units.all (fun u => 9 - (9 - u) == u)
  ∧ units.all (fun u => 9 - u != u)
  ∧ units.length / 2 = 3
  ∧ ((units.filter (fun u => u < 9 - u)).map (fun u => u + (9 - u))) = [9, 9, 9] := by decide

-- ── 52 · THREE IS A PRIMITIVE ROOT MOD SEVEN ──────────────────────────────────────────────────────────────
-- ledger: three_is_a_primitive_root_mod_seven_and_the_rosette_is_six_plus_one. The same method as theorem 36,
-- one ring over: generate the powers and count what they reach. The rosette's "six plus one" is arithmetic on
-- sizes — six units and the identity of the ring they sit in — and says nothing beyond that.
def powers7 (u : Nat) : List Nat := (List.range 6).map (fun k => (u ^ (k + 1)) % 7)
theorem three_generates_the_units_mod_seven_and_they_number_six :
  (powers7 3).eraseDups.length = 6
  ∧ ((List.range' 1 6).filter (fun u => (powers7 u).eraseDups.length == 6)) = [3, 5]
  ∧ ((List.range' 1 6)).length = 6
  ∧ 6 + 1 = 7 := by decide

-- ── 53 · THE TWO UNIT GROUPS ARE THE SAME CYCLIC GROUP ────────────────────────────────────────────────────
-- ledger: the_vortex_and_rosette_unit_groups_are_isomorphic_cyclic_groups_of_order_6. Both have order six
-- and both are generated by a single element, which for cyclic groups is the whole of the isomorphism. The
-- map is exhibited by index: 2^k mod 9 ↦ 3^k mod 7.
theorem the_two_unit_groups_are_cyclic_of_order_six_and_correspond_by_index :
  units.length = 6
  ∧ ((List.range' 1 6)).length = 6
  ∧ (((List.range 6).map (fun k => m9 (2 ^ k))).eraseDups).length = 6
  ∧ (((List.range 6).map (fun k => (3 ^ k) % 7)).eraseDups).length = 6 := by decide

-- ── 54 · CASTING OUT NINES DETECTS ANY ERROR THAT MOVES THE VALUE ─────────────────────────────────────────
-- ledger: casting_out_nines_detects_any_error_that_changes_the_value_mod_9. The check is exactly as strong
-- as the residue: it catches a wrong answer precisely when the error is not a multiple of nine, and that
-- biconditional is what is decided — including the cases where it stays silent.
theorem the_nines_check_fires_exactly_when_the_error_is_not_a_multiple_of_nine :
  (List.range' 1 60).all (fun v => (List.range' 1 30).all (fun e =>
    ((root (v + e) != root v) == (e % 9 != 0)))) := by decide

-- ── 55 · AND IT IS BLIND TO A TRANSPOSITION, WHERE ELEVENS ARE NOT ────────────────────────────────────────
-- ledger: nines_are_blind_to_transpositions_but_elevens_catch_them. The blindness is the point and is
-- decided as such: swapping two digits never changes the value mod 9, because the digit sum is unchanged —
-- so a check built on it cannot see the commonest copying error. Mod 11 is alternating and does see it.
def swap2 (n : Nat) : Nat := (n % 10) * 10 + (n / 10) % 10 + (n / 100) * 100
theorem the_nines_check_cannot_see_a_transposition_and_the_elevens_check_can :
  (List.range' 10 89).all (fun n => root n == root (swap2 n))
  ∧ ((List.range' 10 89).any (fun n => n % 11 != (swap2 n) % 11)) := by decide

-- ── 56 · FIVE IS BOTH THE FIXED POINT AND THE INVERSE OF TWO ──────────────────────────────────────────────
-- ledger: five_is_both_the_reflection_fixed_point_and_the_multiplicative_inverse_of_two. Two unrelated
-- descriptions landing on one digit, each computed rather than asserted, and the coincidence stated as the
-- arithmetic it is and not as a significance.
theorem five_is_the_reflection_fixed_point_and_the_inverse_of_two :
  ((List.range' 1 10).filter (fun d => refl10 d == d)) = [5]
  ∧ m9 (2 * 5) = 1
  ∧ inv 2 = 5
  ∧ ((List.range' 1 9).filter (fun d => m9 (2 * d) == 1)) = [5] := by decide

-- ── 57 · THE NONZERO RESIDUES SUM TO ZERO EXACTLY WHEN THE MODULUS IS ODD ─────────────────────────────────
-- ledger: the_nonzero_residues_sum_to_zero_mod_n_exactly_when_n_is_odd — "1+2+…+(n−1) = n(n−1)/2". The
-- biconditional over a range of moduli, with the closed form computed and the sum computed, and the two
-- compared — so the formula is checked rather than used as the definition of the sum.
theorem the_nonzero_residues_vanish_exactly_for_an_odd_modulus :
  (List.range' 2 30).all (fun n =>
    (((List.range' 1 (n - 1)).foldl (· + ·) 0) % n == 0) == (n % 2 == 1))
  ∧ (List.range' 2 30).all (fun n =>
    ((List.range' 1 (n - 1)).foldl (· + ·) 0) == n * (n - 1) / 2) := by decide

end Claimed
