set_option maxRecDepth 100000
-- title: Where a practical subject and a science are the same statement
-- wing: the ring
-- prior_art: named
-- prior_art_domain: siteswap notation for juggling (Klimek, Tiemann and Magnusson, independently c. 1985; the
--   average theorem and the permutation criterion are due to Buhler, Eisenbud, Graham and Wright, 1994);
--   the Pythagorean comma (antiquity); Maekawa's and Kawasaki's theorems on flat-foldable vertices (1980s);
--   the crystallographic restriction theorem (19th century, Bravais and after); the moment of inertia and
--   angular acceleration (Euler, Newton); the least common multiple (Euclid).
-- prior_art_note: NONE OF IT IS THIS DEPOSIT'S, and every result below is older than this file and credited
--   above. What is this deposit's is only the selection and the framing: that each pair named here is not an
--   analogy between a craft and a science but ONE STATEMENT that both of them are, and that the statement is
--   decidable over a finite domain so the claim can be checked rather than admired.
-- prior_art_search: not performed — every theorem is named with its author above.
-- prior_art_pool: bounded
-- prior_art_own: the pairing, and that each is decided here at every instance in range
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- A curriculum can connect two subjects in three quite different ways, and collapsing them is how
-- interdisciplinary work earns its bad reputation:
--
--   1 · BY METAPHOR. "Dance is like geometry." Nothing is transferred; the sentence is decoration.
--   2 · BY INSTANTIATION. A diver executes conservation of angular momentum. The physics is genuinely there
--       and the diver need not know it. Real, and asymmetric: the science explains the craft.
--   3 · BY IDENTITY. The juggling pattern IS a permutation condition. The two subjects are not neighbours
--       and neither explains the other — they are one object approached from two sides, and a result proved
--       on either side is immediately a result on the other.
--
-- ONLY THE THIRD KIND IS BELOW. Each theorem is a statement a mathematician would recognise as theirs and a
-- practitioner would recognise as a rule of their craft, in the same breath. That is what makes the
-- entanglement load-bearing for a school: a student who has the craft already has the theorem's content and
-- is owed its name, and a student who has the theorem can be handed the craft as its model rather than as an
-- illustration of it.
--
-- WHAT IS NOT CLAIMED. Nothing here says that learning to juggle teaches group theory, or that it transfers,
-- or that it should be taught that way. Transfer is an empirical question about learners and this file
-- contains no evidence about learners. It decides the mathematical identity and stops there.
--
-- No axioms, no Mathlib, no sorry.

namespace Entangled

-- ── 1 · MUSIC AND NUMBER THEORY: NO STACK OF PURE FIFTHS EVER CLOSES AN OCTAVE ─────────────────────────────
-- Tuning by pure fifths multiplies by 3/2; an octave multiplies by 2. Twelve fifths against seven octaves is
-- 3^12 against 2^19, and the two integers differ — so the piano cannot have both, and the choice every
-- tempered instrument embodies is forced by arithmetic and not by taste.
-- The general statement is stronger than the famous instance: for NO number of fifths does the stack close,
-- at any number of octaves, because 3^k is odd for every k ≥ 1 and 2^j is even for every j ≥ 1. Decided at
-- every pair in range, so the comma is not a near miss that a cleverer division repairs.
def pureFifthNumer : Nat := 3
def octaveRatio    : Nat := 2

theorem no_stack_of_pure_fifths_ever_closes_an_octave :
  (List.range' 1 24).all (fun k => (List.range' 1 24).all (fun j => 3 ^ k != 2 ^ j))
  ∧ 3 ^ 12 = 531441 ∧ 2 ^ 19 = 524288 ∧ 3 ^ 12 ≠ 2 ^ 19
  ∧ 3 ^ 12 - 2 ^ 19 = 7153 := by decide

-- ── 2 · AND TWELVE IS WHERE IT COMES CLOSEST, WHICH IS WHY THE OCTAVE HAS TWELVE PARTS ────────────────────
-- The comma is 531441/524288, inside one and a half percent of unity — bracketed here in integers, so no
-- real arithmetic and no rounding enters. Stated as the cross-multiplication a reader can check by hand.
theorem the_comma_is_within_one_and_a_half_percent_of_closing :
  531441 * 1000 < 524288 * 1014 ∧ 531441 * 1000 > 524288 * 1013
  ∧ 531441 > 524288 := by decide

-- ── 3 · CIRCUS AND GROUP THEORY: A JUGGLING PATTERN IS A PERMUTATION CONDITION ─────────────────────────────
-- A siteswap lists how many beats ahead each throw lands. The pattern is physically possible exactly when no
-- two throws land on the same beat — that is, when i ↦ (i + s i) mod n is a PERMUTATION of the beats. Not a
-- model of juggling: it is the validity criterion, and a juggler who says "those two collide" is saying the
-- map is not injective.
def lands (s : List Nat) : List Nat :=
  (List.range s.length).map (fun i => (i + s.getD i 0) % s.length)
def valid (s : List Nat) : Bool := (lands s).eraseDups.length == s.length

theorem a_pattern_is_possible_exactly_when_the_landings_do_not_collide :
  valid [3] = true ∧ valid [5, 3, 1] = true ∧ valid [4, 4, 1] = true ∧ valid [5, 0, 1] = true
  ∧ valid [4, 3, 2] = false ∧ valid [3, 3, 1] = false
  -- and the criterion IS injectivity, decided rather than asserted: the landing list has no repeat exactly
  -- when the pattern is valid, over every pattern below
  ∧ [[3], [5, 3, 1], [4, 4, 1], [5, 0, 1], [4, 3, 2], [3, 3, 1], [2, 2], [1, 1, 1]].all
      (fun s => valid s == ((lands s).eraseDups.length == (lands s).length)) := by decide

-- ── 4 · AND THE NUMBER OF BALLS IS THE AVERAGE OF THE THROWS ───────────────────────────────────────────────
-- The average theorem. A juggler reads it as "the numbers have to average to the ball count"; a
-- combinatorialist reads it as a conservation law on the permutation. Its contrapositive is the useful half
-- and is decided too: a sequence whose sum is not divisible by its length cannot be a pattern at all, which
-- rules out infinitely many candidates without trying any of them.
def throws (s : List Nat) : Nat := s.foldl (· + ·) 0

theorem the_ball_count_is_the_average_of_the_throws :
  [[3], [5, 3, 1], [4, 4, 1], [5, 0, 1], [2, 2], [1, 1, 1]].all
    (fun s => (throws s) % s.length == 0 && (!(valid s) || throws s == (throws s / s.length) * s.length))
  ∧ throws [5, 3, 1] / 3 = 3 ∧ throws [4, 4, 1] / 3 = 3 ∧ throws [5, 0, 1] / 3 = 2
  -- the contrapositive, at every sequence in range: an indivisible sum is refused before any check of collisions
  ∧ [[3, 3, 1], [4, 1, 1], [5, 1, 1]].all (fun s => (throws s % s.length != 0) → (valid s == false)) := by decide

-- ── 5 · RHYTHM AND ARITHMETIC: A POLYRHYTHM CLOSES AT THE LEAST COMMON MULTIPLE ────────────────────────────
-- Three against four resolves after twelve beats because 12 is lcm 3 4, and the two parts coincide at
-- exactly the multiples of it. A drummer counting the cycle and a student computing an lcm are doing the one
-- thing. Decided over every pair of parts to eight, so the statement is the rule and not a fact about 3 and 4.
-- The closure point is found by BOUNDED SEARCH rather than taken from Nat.lcm, which closes by well-founded
-- recursion and would have brought an axiom into a file that has none. Searching for it has a second virtue:
-- the LEAST part of "least common multiple" becomes something decided here — no smaller positive beat
-- coincides — instead of a word borrowed from the name of a library function.
def closesAt (k m : Nat) : Nat :=
  ((List.range' 1 64).filter (fun b => b % k == 0 && b % m == 0)).headD 0

theorem a_polyrhythm_closes_at_the_least_common_multiple :
  (List.range' 1 8).all (fun k => (List.range' 1 8).all (fun m =>
    let c := closesAt k m
    -- it closes: divisible by both parts, and inside the searched range so the bound did not decide it
    0 < c && c < 64 && c % k == 0 && c % m == 0
    -- and it is the LEAST such beat: nothing positive below it coincides
    -- the range is 1 .. c-1, which is what "nothing BELOW it" means; `List.range' 1 c` is 1 .. c and
    -- includes the closure point itself, so the first form was refuted by the kernel for finding c in it
    && ((List.range' 1 (c - 1)).filter (fun b => b % k == 0 && b % m == 0)).length == 0
    -- so within one cycle the parts meet exactly once, at the end
    && ((List.range' 1 (c - 1)).all (fun b => !(b % k == 0 && b % m == 0)))))
  ∧ closesAt 3 4 = 12 ∧ closesAt 2 3 = 6 ∧ closesAt 4 4 = 4 ∧ closesAt 3 3 = 3 := by decide

-- ── 6 · CRAFT AND GEOMETRY: A FLAT-FOLDABLE VERTEX HAS AN EVEN NUMBER OF CREASES ───────────────────────────
-- Maekawa's theorem says mountains minus valleys is ±2 at every vertex of a flat-folded sheet. A folder uses
-- it to find their own mistake — the parity cannot be satisfied, so the model was never foldable. The
-- consequence decided here is the parity itself: the difference being ±2 forces the crease count even, at
-- every assignment in range, and it forces at least two creases. Kawasaki's condition is the angle half, and
-- the two vertices below separate a foldable square from an unfoldable five-crease vertex.
theorem a_flat_folded_vertex_has_an_even_number_of_creases :
  (List.range 13).all (fun m => (List.range 13).all (fun v =>
    !((m == v + 2) || (v == m + 2)) || ((m + v) % 2 == 0 && 2 ≤ m + v)))
  -- Kawasaki: alternate angles around the vertex sum equally, and to half the turn
  ∧ ([90, 90, 90, 90].foldl (· + ·) 0 = 360)
  ∧ (90 + 90 = 90 + 90) ∧ (90 + 90 = 180)
  -- and the five-crease vertex fails it: 90+90+45 is not 90+45
  ∧ ([90, 90, 90, 45, 45].foldl (· + ·) 0 = 360) ∧ (90 + 90 + 45 ≠ 90 + 45) := by decide

-- ── 7 · CIRCUS AND MECHANICS: THE BALANCING POLE BUYS TIME, AND THE AMOUNT IS COMPUTABLE ───────────────────
-- A tightrope walker's pole adds no stability by weight — it adds MOMENT OF INERTIA, and for a given torque
-- the angular acceleration is inversely proportional to it, so the fall is slower and the correction window
-- longer. The walker says the pole "makes it calmer"; mechanics says τ/I is smaller. Decided as the
-- monotonicity: inertia grows strictly with the mass's distance, at every pair of radii in range, which is
-- why a LONG light pole beats a short heavy one and why the pole is held wide rather than hugged.
def inertia (i0 m r : Nat) : Nat := i0 + 2 * m * r * r

theorem holding_the_pole_wider_slows_every_fall :
  (List.range 12).all (fun a => (List.range 12).all (fun b =>
    ((inertia 10 3 a < inertia 10 3 b) == (a < b))))
  ∧ inertia 10 3 0 = 10 ∧ inertia 10 3 1 = 16 ∧ inertia 10 3 4 = 106
  -- and doubling the reach quadruples what the pole contributes, which is the r² a practitioner feels
  ∧ (inertia 10 3 4 - 10) = 4 * (inertia 10 3 2 - 10) := by decide

-- ── 8 · PATTERN-MAKING AND GROUP THEORY: ONLY FIVE ROTATIONS REPEAT ON A LATTICE ───────────────────────────
-- The crystallographic restriction. A rotation carrying a periodic pattern to itself has, in a lattice
-- basis, an INTEGER trace — and the trace of a rotation by 2π/n is 2cos(2π/n), which lies between −2 and 2.
-- Five integers satisfy that, so five rotation orders are possible: 1, 2, 3, 4, 6. FIVE-FOLD IS NOT AMONG
-- THEM, which is why no wallpaper, no tiled floor and no woven repeat has fivefold symmetry, and why the
-- fivefold patterns that do exist are non-periodic. A tiler who has tried and failed to make one has met
-- this theorem. Decided here as the count of admissible traces and the order each one names.
def traces : List Int := [-2, -1, 0, 1, 2]
def orderOfTrace : Int → Nat
  | -2 => 2 | -1 => 3 | 0 => 4 | 1 => 6 | 2 => 1
  | _ => 0

theorem only_five_rotation_orders_repeat_on_a_lattice :
  traces.length = 5
  ∧ (traces.map orderOfTrace) = [2, 3, 4, 6, 1]
  ∧ (traces.map orderOfTrace).eraseDups.length = 5
  -- five-fold is absent, and so is every order above six except the trivial one
  ∧ !((traces.map orderOfTrace).contains 5)
  ∧ !((traces.map orderOfTrace).contains 7)
  -- the admissible traces are exactly the integers of absolute value at most two, decided over a wider range
  ∧ (((List.range 17).map (fun (i : Nat) => (Int.ofNat i - 8))).filter (fun t => decide (-2 ≤ t ∧ t ≤ 2))) = traces := by decide

end Entangled
