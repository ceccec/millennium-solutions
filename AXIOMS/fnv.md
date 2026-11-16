---
title: "Definitions in fnv.lean"
---

[← axiom index](/AXIOMS)

## `fnv.lean` — 13 definition(s), 14 theorem(s)

```lean
def xorF : Nat → Nat → Nat → Nat
def M32 : Nat := 4294967296
def xor32 (a b : Nat) : Nat := xorF 33 a b
def shr (n k : Nat) : Nat := n / (2 ^ k)
def mul32 (a b : Nat) : Nat := (a * b) % M32
def FNV_OFFSET : Nat := 2166136261   -- 0x811c9dc5
def FNV_PRIME : Nat := 16777619     -- 0x01000193
def MIX1 : Nat := 2246822507         -- 0x85ebca6b
def MIX2 : Nat := 3266489909         -- 0xc2b2ae35
def step (h c : Nat) : Nat :=
def avalanche (h : Nat) : Nat :=
def hash32 (seed : Nat) (cs : List Nat) : Nat := avalanche (cs.foldl step (xor32 FNV_OFFSET seed))
def settledHere : Nat := 12
```
