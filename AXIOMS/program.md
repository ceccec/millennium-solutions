---
title: "Definitions in program.lean"
---

[← axiom index](/AXIOMS)

## `program.lean` — 29 definition(s), 21 theorem(s)

```lean
def GROUPS : List Nat := [4, 2, 2, 2, 6]
def byteAt (g : Nat) : Nat := ((GROUPS.take g).foldl (· + ·) 0)
def RESERVED : List Nat :=
def checkF : List Nat := List.range (byteAt 1 * 8)
def middleF : List Nat := (List.range ((byteAt 4 - byteAt 1) * 8)).map (· + byteAt 1 * 8)
def programF : List Nat := middleF.filter (fun i => !(RESERVED.contains i))
def messageF : List Nat := (List.range ((GROUPS.getD 4 0) * 8)).map (· + byteAt 4 * 8)
def inExactlyOne (i : Nat) : Nat :=
def ascending : List Nat → Bool
def maps3 : List (List Nat) := (List.range 3).flatMap (fun a => (List.range 3).flatMap (fun b =>
def maps4 : List (List Nat) := (List.range 4).flatMap (fun a => (List.range 4).flatMap (fun b =>
def rankIn (idx : List Nat) (i : Nat) : Nat := (idx.filter (fun j => j < i)).length
def packByte (bs : List Bool) : Nat := bs.foldl (fun a b => a * 2 + (if b then 1 else 0)) 0
def chunk8 : Nat → List Bool → List (List Bool)
def payloadBytes (prog msg : List Bool) : List Nat :=
def bitsOf (width n : Nat) : List Bool :=
def checkBits (prog msg : List Bool) : List Bool := bitsOf 32 (hash32 0 (payloadBytes prog msg))
def encodeBits (prog msg : List Bool) : List Bool :=
def readField (idx : List Nat) (bs : List Bool) : List Bool := idx.map (fun i => bs.getD i false)
def P0 : List Bool := (List.range 42).map (fun i => i % 2 == 0)
def M0 : List Bool := (List.range 48).map (fun i => i % 3 == 0)
def P1 : List Bool := (List.range 42).map (fun i => i % 5 == 0)
def M1 : List Bool := (List.range 48).map (fun i => i % 7 == 0)
def PZ : List Bool := List.replicate 42 false
def MZ : List Bool := List.replicate 48 false
def flipAt (l : List Bool) (i : Nat) : List Bool :=
def intact (bs : List Bool) : Bool :=
def flipBit (bs : List Bool) (i : Nat) : List Bool :=
def settledHere : Nat := 21
```
