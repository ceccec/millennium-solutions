---
title: "Definitions in merkle.lean"
---

[← axiom index](/AXIOMS)

## `merkle.lean` — 26 definition(s), 16 theorem(s)

```lean
def hexDigit (n : Nat) : Nat := if n < 10 then 48 + n else 87 + n
def byteHex (b : Nat) : List Nat := [hexDigit (b / 16), hexDigit (b % 16)]
def uuidChars (bs : List Nat) : List Nat :=
def PAIR : List Nat := [112, 97, 105, 114, 58]                                    -- "pair:"
def L36 : List Nat := [51, 54, 58]                                               -- "36:" — a uuid is 36 chars
def MLEAF : List Nat := [109, 101, 114, 107, 108, 101, 58, 108, 101, 97, 102, 58]  -- "merkle:leaf:"
def MNODE : List Nat := [109, 101, 114, 107, 108, 101, 58, 110, 111, 100, 101, 58] -- "merkle:node:"
def MEMPTY : List Nat := [109, 101, 114, 107, 108, 101, 58, 101, 109, 112, 116, 121]-- "merkle:empty"
def merge (a b : List Nat) : List Nat := toUuidBytes (PAIR ++ L36 ++ uuidChars a ++ L36 ++ uuidChars b)
def merkleLeaf (x : List Nat) : List Nat := toUuidBytes (MLEAF ++ L36 ++ uuidChars x)
def merkleNode (a b : List Nat) : List Nat := toUuidBytes (MNODE ++ L36 ++ uuidChars a ++ L36 ++ uuidChars b)
def leB : List Nat → List Nat → Bool
def insB (a : List Nat) : List (List Nat) → List (List Nat)
def sortB : List (List Nat) → List (List Nat)
def pairUp : List (List Nat) → List (List Nat)
def foldF : Nat → List (List Nat) → List (List Nat)
def merkleFold (leaves : List (List Nat)) : List Nat :=
def A : List Nat := toUuidBytes [97]     -- address of "a"
def C : List Nat := toUuidBytes [99]     -- address of "c"
def B : List Nat := toUuidBytes [98]     -- address of "b"
def settledHere : Nat := 16
def interleave (x : List Nat) : List (List Nat) → List (List (List Nat))
def perms : List (List Nat) → List (List (List Nat))
def D : List Nat := toUuidBytes [100]  -- address of "d"
def E : List Nat := toUuidBytes [101]    -- address of "e", a leaf none of A B C D is
def setAt (l : List (List Nat)) (i : Nat) (x : List Nat) : List (List Nat) :=
```
