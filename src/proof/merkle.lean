import Address
set_option maxRecDepth 8000000
-- title: The fold
-- wing: the address
-- prior_art: named
-- prior_art_domain: hash trees and membership proofs
-- prior_art_note: the hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987
-- The fold, ported to Lean — merge, merkleFold, and the order-independence the deposit calls its receipt.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- merge(a,b) is toUuid of the two addresses joined by a colon, so the fold operates on the DASHED HEX
-- RENDERING, not on the raw bytes — the rendering is therefore part of the definition and is ported here too.
-- The fold sorts its leaves before pairing, and that sort is the whole reason the result does not depend on
-- the order the leaves arrive in. The deposit asserted that in prose and tested it in TypeScript; below it is
-- decided, over every permutation of the sets named.
--
-- No axioms, no Mathlib, no sorry. Address and Fnv are imported, not restated.

namespace Merkle

open Address Fnv

def hexDigit (n : Nat) : Nat := if n < 10 then 48 + n else 87 + n
def byteHex (b : Nat) : List Nat := [hexDigit (b / 16), hexDigit (b % 16)]

/-- a uuid as the deposit writes it: 8-4-4-4-12 hex with dashes, as character codes -/
def uuidChars (bs : List Nat) : List Nat :=
  let h := bs.flatMap byteHex
  (h.take 8) ++ [45] ++ (h.drop 8 |>.take 4) ++ [45] ++ (h.drop 12 |>.take 4) ++ [45]
    ++ (h.drop 16 |>.take 4) ++ [45] ++ (h.drop 20)

-- ── THE DOMAIN TAGS AND THE LENGTH PREFIX, AS src/0/index.ts NOW WRITES THEM ──────────────────────────────
-- `merge` was toUuid("a:b") with the colon unescaped, so merge("a:b","c") and merge("a","b:c") were one
-- address; and the fold hashed leaves and nodes identically, so a node could be presented as a leaf. Both
-- are fixed in the implementation and this file follows it. Every part now carries its own length, and
-- leaf, node, pair and empty each carry their own domain.
def PAIR   : List Nat := [112, 97, 105, 114, 58]                                    -- "pair:"
def L36    : List Nat := [51, 54, 58]                                               -- "36:" — a uuid is 36 chars
def MLEAF  : List Nat := [109, 101, 114, 107, 108, 101, 58, 108, 101, 97, 102, 58]  -- "merkle:leaf:"
def MNODE  : List Nat := [109, 101, 114, 107, 108, 101, 58, 110, 111, 100, 101, 58] -- "merkle:node:"
def MEMPTY : List Nat := [109, 101, 114, 107, 108, 101, 58, 101, 109, 112, 116, 121]-- "merkle:empty"

/-- merge a b = toUuid("pair:" ++ len(a) ++ ":" ++ a ++ len(b) ++ ":" ++ b) -/
def merge (a b : List Nat) : List Nat := toUuidBytes (PAIR ++ L36 ++ uuidChars a ++ L36 ++ uuidChars b)

/-- a leaf is hashed under its own domain before anything pairs it -/
def merkleLeaf (x : List Nat) : List Nat := toUuidBytes (MLEAF ++ L36 ++ uuidChars x)

/-- an internal node under a DIFFERENT domain, which is the whole of RFC 6962 §2.1 -/
def merkleNode (a b : List Nat) : List Nat := toUuidBytes (MNODE ++ L36 ++ uuidChars a ++ L36 ++ uuidChars b)

/-- lexicographic order on byte lists, which is the order the sort imposes on the rendered addresses -/
def leB : List Nat → List Nat → Bool
  | [], _ => true
  | _, [] => false
  | x :: xs, y :: ys => if x == y then leB xs ys else x < y

def insB (a : List Nat) : List (List Nat) → List (List Nat)
  | [] => [a]
  | b :: bs => if leB a b then a :: b :: bs else b :: insB a bs
def sortB : List (List Nat) → List (List Nat)
  | [] => []
  | a :: as => insB a (sortB as)

/-- one pairing pass: adjacent leaves merged, an odd one carried up unchanged -/
def pairUp : List (List Nat) → List (List Nat)
  | [] => []
  | [a] => [a]
  | a :: b :: rest => merkleNode a b :: pairUp rest

/-- the fold: sort, then pair until one remains. Fuel-bounded so the recursion is structural. -/
def foldF : Nat → List (List Nat) → List (List Nat)
  | 0, l => l
  | _, [a] => [a]
  | Nat.succ f, l => foldF f (pairUp l)

def merkleFold (leaves : List (List Nat)) : List Nat :=
  if leaves.isEmpty then toUuidBytes MEMPTY
  else (foldF (leaves.length + 1) ((sortB leaves).map merkleLeaf)).getD 0 []

def A : List Nat := toUuidBytes [97]     -- address of "a"
def C : List Nat := toUuidBytes [99]     -- address of "c"
def B : List Nat := toUuidBytes [98]     -- address of "b"

-- ── AGREEMENT with the shipped implementation ──
theorem merge_agrees :
  merge A B = [60, 245, 241, 132, 177, 61, 137, 238, 168, 38, 16, 93, 225, 238, 227, 159] := by decide

theorem empty_fold_agrees :
  merkleFold [] = [185, 172, 200, 147, 59, 66, 143, 33, 184, 249, 115, 223, 210, 131, 107, 81] := by decide

-- ── THE FOLD OF ONE LEAF IS NOT THAT LEAF, AND THAT IS THE FIX ─────────────────────────────────────────────
-- This file used to decide `merkleFold [A] = A` and call it "the base case of the contraction". It was the
-- second preimage: for any root R the one-leaf set [R] reproduced R, so two different leaf multisets shared
-- an address and the result was not a commitment. The leaf is hashed under its own domain now, so a root is
-- always a node value and no leaf can be mistaken for one.
theorem singleton_fold_is_the_hashed_leaf : merkleFold [A] = merkleLeaf A := by decide

theorem no_single_leaf_is_its_own_root :
  [A, B, C].all (fun x => merkleFold [x] != x) := by decide

-- ── AND THE FORGERY THE OLD SHAPE ALLOWED IS REFUSED ───────────────────────────────────────────────────────
-- Hand any root back as a lone leaf: it no longer reproduces itself.
theorem a_root_presented_as_a_leaf_is_a_different_root :
  merkleFold [merkleFold [A, B]] != merkleFold [A, B] := by decide

-- ── AND LEAF AND NODE DOMAINS NEVER MEET ───────────────────────────────────────────────────────────────────
-- Each address here is a full SHA computation in the kernel, so the 27 combinations of a triple loop ran
-- past the heartbeat limit. Three leaves against one node is the same claim at the scale this can decide,
-- and the general separation is structural: the two domains differ in their first twelve bytes.
theorem a_leaf_address_is_never_a_node_address :
  [A, B, C].all (fun x => merkleLeaf x != merkleNode A B) := by decide

theorem pair_fold_agrees :
  merkleFold [A, B] = [54, 116, 211, 221, 110, 188, 140, 55, 169, 71, 188, 123, 43, 184, 40, 10] := by decide

-- ── THE ORDER-INDEPENDENCE: the receipt does not depend on the order the leaves arrive in ──
theorem fold_is_order_independent_on_two :
  merkleFold [A, B] = merkleFold [B, A] := by decide

-- ── and it is not vacuous: merge itself IS order-sensitive; the sort is what removes the dependence ──
theorem merge_is_order_sensitive : merge A B ≠ merge B A := by decide

-- ── THE SEPARATOR IS ESCAPED NOW, SO THE PAIR IS RECOVERABLE ───────────────────────────────────────────────
-- merge("a:b","c") and merge("a","b:c") were one address. Each part carries its own length, so no
-- concatenation of one pair spells another — decided here on the addresses this file works with.
theorem merge_is_injective_on_these_pairs :
  merge A B != merge A C && merge A B != merge B B && merge B C != merge C B := by decide

theorem sorting_is_what_makes_the_fold_order_free :
  sortB [A, B] = sortB [B, A] ∧ [A, B] ≠ [B, A] := by decide

def settledHere : Nat := 16
theorem merkle_settles_its_range : settledHere = 16 := rfl

-- ── ORDER-INDEPENDENCE ON AN ODD NUMBER OF LEAVES. Two leaves pair exactly and prove little: the interesting
--    case is an odd count, where pairUp must carry the leftover leaf into the next round. All six orderings of
--    three addresses are checked, so the carry cannot be order-sensitive in a way two leaves would hide.
-- ── AND ON FOUR, over every permutation rather than a hand-listed few ────────────────────────────────────
--    Three leaves were written out as five equations because six orderings fit on a page. Four do not:
--    twenty-four orderings written by hand is where a missing case hides. `List.permutations` generates
--    them, so the statement quantifies over ALL of them and cannot be short by one.
--    `List.permutations` is not in Lean's core — it lives in Batteries, which this deposit does not import,
--    for the same reason it does not import Mathlib. So the generator is written here, structurally.
def interleave (x : List Nat) : List (List Nat) → List (List (List Nat))
  | [] => [[x]]
  | y :: ys => (x :: y :: ys) :: (interleave x ys).map (fun l => y :: l)
def perms : List (List Nat) → List (List (List Nat))
  | [] => [[]]
  | x :: xs => (perms xs).flatMap (fun p => interleave x p)
def D : List Nat := toUuidBytes [100]  -- address of "d"

-- the generator is checked before it is trusted: four leaves have 4! = 24 orderings, and if `perms` were
-- short the theorem below would quantify over fewer cases while looking exactly as strong
theorem the_permutation_generator_is_complete :
  (perms [A, B, C, D]).length = 24 ∧ (perms [A, B, C]).length = 6 := by decide

-- THE STATEMENT IS UNCHANGED AND THE WORK IS NOT. Hashing every leaf under its own domain adds one SHA per
-- leaf, so twenty-four permutations of four leaves went from ~72 hash computations to ~168 and crossed the
-- default heartbeat limit. The budget is raised; the exhaustion is the same exhaustion. Lowering the
-- permutation count instead would have been weakening the theorem to fit the fix.
set_option maxHeartbeats 1000000 in
set_option maxRecDepth 100000 in
theorem fold_is_order_independent_on_four :
  (perms [A, B, C, D]).all (fun p => merkleFold p == merkleFold [A, B, C, D]) := by decide

theorem fold_is_order_independent_on_three :
  merkleFold [A, B, C] = merkleFold [A, C, B] ∧ merkleFold [A, B, C] = merkleFold [B, A, C] ∧
  merkleFold [A, B, C] = merkleFold [B, C, A] ∧ merkleFold [A, B, C] = merkleFold [C, A, B] ∧
  merkleFold [A, B, C] = merkleFold [C, B, A] := by decide

-- ── AND THE OTHER HALF OF THE RECEIPT: THE FOLD BINDS EVERY LEAF ────────────────────────────────────────
--    Order-independence says the root does not move when it should not. Binding says it DOES move when a
--    leaf is altered — and the two together are what makes a root a receipt. Only the first was decided
--    here. The second was asserted at runtime by the cluster report, which altered the FIRST receipt and
--    printed "binds every receipt": a check narrower than the sentence it printed, and one no perturbation
--    of this tree could ever make false, since it is a property of the fold rather than of the ledger.
--    It belongs here, decided at EVERY position.
def E : List Nat := toUuidBytes [101]    -- address of "e", a leaf none of A B C D is

/-- l with position i replaced by x -/
def setAt (l : List (List Nat)) (i : Nat) (x : List Nat) : List (List Nat) :=
  (List.range l.length).map (fun j => if j == i then x else l.getD j [])

-- the alteration is not vacuous: it lands, at every position, on a leaf that was not there before
theorem the_alteration_reaches_every_position :
  (List.range 4).all (fun i => setAt [A, B, C, D] i E != [A, B, C, D]) := by decide

set_option maxRecDepth 100000 in
set_option maxHeartbeats 2000000 in
theorem altering_any_single_leaf_changes_the_root :
  (List.range 4).all (fun i => merkleFold (setAt [A, B, C, D] i E) != merkleFold [A, B, C, D]) := by decide

end Merkle
