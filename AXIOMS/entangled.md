---
title: "Definitions in entangled.lean"
---

[← axiom index](/AXIOMS)

## `entangled.lean` — 9 definition(s), 8 theorem(s)

```lean
def pureFifthNumer : Nat := 3
def octaveRatio : Nat := 2
def lands (s : List Nat) : List Nat :=
def valid (s : List Nat) : Bool := (lands s).eraseDups.length == s.length
def throws (s : List Nat) : Nat := s.foldl (· + ·) 0
def closesAt (k m : Nat) : Nat :=
def inertia (i0 m r : Nat) : Nat := i0 + 2 * m * r * r
def traces : List Int := [-2, -1, 0, 1, 2]
def orderOfTrace : Int → Nat
```
