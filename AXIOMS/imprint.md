---
title: "Definitions in imprint.lean"
---

[← axiom index](/AXIOMS)

## `imprint.lean` — 12 definition(s), 9 theorem(s)

```lean
def RESERVED : List Nat := [48, 49, 50, 51, 64, 65]
def FREE : List Nat := (List.range 128).filter (fun i => !(RESERVED.contains i))
def LEN_BITS : Nat := 7
def CAPACITY : Nat := FREE.length - LEN_BITS
def bitsOf (width n : Nat) : List Bool :=
def natOf (bs : List Bool) : Nat := bs.foldl (fun a b => a * 2 + (if b then 1 else 0)) 0
def payload (msg : List Bool) : List Bool :=
def encodeBits (msg : List Bool) : List Bool :=
def decodeBits (bs : List Bool) : List Bool :=
def alt (n : Nat) : List Bool := (List.range n).map (fun i => i % 2 == 0)
def ones (n : Nat) : List Bool := List.replicate n true
def settledHere : Nat := 9
```
