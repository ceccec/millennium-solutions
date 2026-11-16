---
title: "Definitions in involution.lean"
---

[← axiom index](/AXIOMS)

## `involution.lean` — 7 definition(s), 8 theorem(s)

```lean
def matchings : Nat → List Nat → List (List (Nat × Nat))
def nine : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8]
def all : List (List (Nat × Nat)) := matchings 10 nine
def fixedPoints (m : List (Nat × Nat)) : Nat := (m.filter (fun p => p.1 == p.2)).length
def swaps (m : List (Nat × Nat)) : List (Nat × Nat) := m.filter (fun p => p.1 != p.2)
def constantSum (m : List (Nat × Nat)) : Bool :=
def coinLike : List (Nat × Nat) := [(0, 0), (1, 8), (2, 7), (3, 6), (4, 5)]
```
