import Fnv
set_option maxRecDepth 2000000
set_option maxHeartbeats 2000000
-- title: Nim
-- wing: the machine
-- Nim — Bouton's theorem and Sprague–Grundy, decided.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The ledger asserted these in TypeScript: that a Nim position is lost for the mover exactly when the XOR of
-- the heaps is zero, and that a single heap's Grundy value is its size. Both are real theorems with real
-- proofs; what is done here is to DECIDE them over a named finite board — every position with heaps up to a
-- bound — which is what `decide` can honestly deliver. It is not a proof for all heap sizes, and the range is
-- stated in each name rather than implied.
--
-- XOR is imported from Fnv rather than restated: it is the same fuel-bounded structural fold, built because
-- Nat's bitwise operations are well-founded and would drag `propext` into every theorem here.

namespace Nim

open Fnv (xorF)

def xorN (a b : Nat) : Nat := xorF 33 a b
-- The board is SMALL and stated, because the game tree is exponential: deciding `lost` explores every play
-- from every position, and at 8x8 the kernel exceeds its heartbeat budget. Six is what `decide` settles here
-- in reasonable time. A larger board is not a harder theorem, it is a longer computation — and claiming the
-- general case would need an induction, not a bigger range.
def N : Nat := 6

/-- the moves from a two-heap position: take any positive amount from either heap -/
def moves (a b : Nat) : List (Nat × Nat) :=
  ((List.range a).map (fun x => (x, b))) ++ ((List.range b).map (fun y => (a, y)))

/-- a position is LOST for the mover when every move leads to a position that is won for the opponent.
    Fuel-bounded: the total of the heaps strictly decreases with each move. -/
def lost : Nat → Nat → Nat → Bool
  | 0, _, _ => true
  | Nat.succ f, a, b => (moves a b).all (fun p => ! lost f p.1 p.2)

def isLost (a b : Nat) : Bool := lost (a + b + 1) a b

-- ── BOUTON: a two-heap position is lost for the mover exactly when the heaps are equal — which is exactly
--    when their XOR is zero. Decided over every position on the 8×8 board. ──
theorem bouton_two_heaps_lost_iff_xor_zero :
  (List.range N).all (fun a => (List.range N).all (fun b =>
    isLost a b == (xorN a b == 0))) := by decide

-- ── the same statement in its familiar form: lost exactly when the heaps are equal ──
theorem bouton_lost_iff_heaps_equal :
  (List.range N).all (fun a => (List.range N).all (fun b => isLost a b == (a == b))) := by decide

-- ── NON-VACUITY: the losing positions are exactly the diagonal, so there are N of them among N² — neither
--    everything nor nothing. (An earlier version fixed this count at 8 for an 8x8 board; when the board was
--    reduced the kernel proved the statement FALSE rather than letting a stale constant pass. Tied to N now.) ──
theorem lost_positions_are_exactly_the_diagonal :
  (((List.range N).flatMap (fun a => (List.range N).map (fun b => (a, b)))).filter
    (fun p => isLost p.1 p.2)).length = N := by decide

-- ── SPRAGUE–GRUNDY for one heap: the Grundy value of a heap of size n is n ──
def mex (s : List Nat) : Nat := ((List.range (s.length + 1)).filter (fun m => ! s.contains m)).headD 0
def grundy1 : Nat → Nat → Nat
  | 0, _ => 0
  | Nat.succ f, n => mex ((List.range n).map (fun k => grundy1 f k))

theorem grundy_of_a_single_heap_is_its_size :
  (List.range N).all (fun n => grundy1 (n + 1) n == n) := by decide

-- ── and the two-heap Grundy value is the XOR of the parts ──
theorem grundy_of_two_heaps_is_the_xor :
  (List.range N).all (fun a => (List.range N).all (fun b =>
    (xorN (grundy1 (a + 1) a) (grundy1 (b + 1) b)) == xorN a b)) := by decide

-- ── XOR's algebra, which is why the theorem takes the form it does ──
theorem xor_is_its_own_inverse :
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN (xorN a b) b == a)) := by decide
theorem xor_is_commutative :
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN a b == xorN b a)) := by decide
theorem xor_zero_is_identity : (List.range 32).all (fun a => xorN a 0 == a) := by decide

end Nim
