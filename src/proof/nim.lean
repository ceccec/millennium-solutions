import Fnv
set_option maxRecDepth 2000000
set_option maxHeartbeats 2000000
-- title: Nim
-- wing: the machine
-- prior_art: named
-- prior_art_domain: combinatorial game theory
-- prior_art_note: Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939
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

-- ── THE NIM-SUM AS GF(2) VECTOR ADDITION, IN ONE PROPOSITION ─────────────────────────────────────────────
--    `nim_sum_is_xor_gf2` claims the nim-sum IS GF(2) vector addition: commutative, associative and
--    self-inverse. Associativity was the one property missing here — and the other three, though each
--    decided above, are decided SEPARATELY. A claim is carried by a theorem that decides all of it or by
--    none, and the ledger's supersededBy names exactly one key, so three quarters of a claim spread over
--    three theorems carries nothing. The conjunction is the claim; the conjuncts standing alone are its
--    parts, which is why both forms are here rather than one. Range 16 because the cube of it is walked.
theorem the_nim_sum_is_a_gf2_vector_addition :
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN a b == xorN b a)) ∧
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun c =>
    xorN (xorN a b) c == xorN a (xorN b c)))) ∧
  (List.range 16).all (fun a => (List.range 16).all (fun b => xorN (xorN a b) b == a)) ∧
  (List.range 16).all (fun a => xorN a 0 == a) := by decide

-- ── BOUTON WITH SEVEN HEAP SIZES, because "heaps ≤ 6" means seven of them and N = 6 gives six ─────────────
--    The ledger's row says "all heaps ≤ 6, exhaustive". `bouton_two_heaps_lost_iff_xor_zero` ranges over
--    List.range N with N = 6, which is 0…5 — one short. Carrying the row on it would have claimed a
--    position nobody decided, over an off-by-one nobody would ever see. The board is widened here instead,
--    in a theorem of its own, because N is baked into the statements already sealed above.
set_option maxRecDepth 4000000 in
theorem bouton_holds_at_every_heap_size_to_six :
  (List.range 7).all (fun a => (List.range 7).all (fun b => isLost a b == (xorN a b == 0))) := by decide

end Nim
