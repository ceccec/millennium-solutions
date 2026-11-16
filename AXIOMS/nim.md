---
title: "Definitions in nim.lean"
---

[← axiom index](/AXIOMS)

## `nim.lean` — 7 definition(s), 28 theorem(s)

```lean
def xorN (a b : Nat) : Nat := xorF (a + b + 1) a b
def N : Nat := 6
def moves (a b : Nat) : List (Nat × Nat) :=
def lost : Nat → Nat → Nat → Bool
def isLost (a b : Nat) : Bool := lost (a + b + 1) a b
def mex (s : List Nat) : Nat := ((List.range (s.length + 1)).filter (fun m => ! s.contains m)).headD 0
def grundy1 : Nat → Nat → Nat
```
