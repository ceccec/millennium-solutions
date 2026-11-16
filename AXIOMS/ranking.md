---
title: "Definitions in ranking.lean"
---

[← axiom index](/AXIOMS)

## `ranking.lean` — 4 definition(s), 8 theorem(s)

```lean
def weights : List Nat := [3, 3, 1, 2, 1, 1]
def bit (m i : Nat) : Bool := (m / 2 ^ i) % 2 == 1
def score (m : Nat) : Nat :=
def masks : List Nat := List.range 64
```
