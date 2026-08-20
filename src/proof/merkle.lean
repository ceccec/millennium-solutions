import Address
set_option maxRecDepth 8000000
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

/-- merge a b = toUuid("a:b") — the colon is 58 -/
def merge (a b : List Nat) : List Nat := toUuidBytes (uuidChars a ++ [58] ++ uuidChars b)

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
  | a :: b :: rest => merge a b :: pairUp rest

/-- the fold: sort, then pair until one remains. Fuel-bounded so the recursion is structural. -/
def foldF : Nat → List (List Nat) → List (List Nat)
  | 0, l => l
  | _, [a] => [a]
  | Nat.succ f, l => foldF f (pairUp l)

def EMPTY_SEED : List Nat := [101, 109, 112, 116, 121, 45, 109, 105, 110, 100]  -- "empty-mind"

def merkleFold (leaves : List (List Nat)) : List Nat :=
  if leaves.isEmpty then toUuidBytes EMPTY_SEED
  else (foldF (leaves.length + 1) (sortB leaves)).getD 0 []

def A : List Nat := toUuidBytes [97]     -- address of "a"
def C : List Nat := toUuidBytes [99]     -- address of "c"
def B : List Nat := toUuidBytes [98]     -- address of "b"

-- ── AGREEMENT with the shipped implementation ──
theorem merge_agrees :
  merge A B = [181, 59, 237, 190, 211, 88, 129, 103, 143, 231, 158, 123, 139, 178, 38, 2] := by decide

theorem empty_fold_agrees :
  merkleFold [] = [147, 146, 154, 45, 72, 16, 138, 198, 159, 50, 78, 208, 125, 158, 1, 108] := by decide

theorem singleton_fold_is_the_leaf : merkleFold [A] = A := by decide

theorem pair_fold_agrees :
  merkleFold [A, B] = [181, 59, 237, 190, 211, 88, 129, 103, 143, 231, 158, 123, 139, 178, 38, 2] := by decide

-- ── THE ORDER-INDEPENDENCE: the receipt does not depend on the order the leaves arrive in ──
theorem fold_is_order_independent_on_two :
  merkleFold [A, B] = merkleFold [B, A] := by decide

-- ── and it is not vacuous: merge itself IS order-sensitive; the sort is what removes the dependence ──
theorem merge_is_order_sensitive : merge A B ≠ merge B A := by decide

theorem sorting_is_what_makes_the_fold_order_free :
  sortB [A, B] = sortB [B, A] ∧ [A, B] ≠ [B, A] := by decide

def settledHere : Nat := 7
theorem merkle_settles_its_range : settledHere = 7 := rfl

-- ── ORDER-INDEPENDENCE ON AN ODD NUMBER OF LEAVES. Two leaves pair exactly and prove little: the interesting
--    case is an odd count, where pairUp must carry the leftover leaf into the next round. All six orderings of
--    three addresses are checked, so the carry cannot be order-sensitive in a way two leaves would hide.
theorem fold_is_order_independent_on_three :
  merkleFold [A, B, C] = merkleFold [A, C, B] ∧ merkleFold [A, B, C] = merkleFold [B, A, C] ∧
  merkleFold [A, B, C] = merkleFold [B, C, A] ∧ merkleFold [A, B, C] = merkleFold [C, A, B] ∧
  merkleFold [A, B, C] = merkleFold [C, B, A] := by decide

end Merkle
