---
title: "Definitions in equivalence.lean"
---

[← axiom index](/AXIOMS)

## `equivalence.lean` — 4 definition(s), 8 theorem(s)

```lean
def exts : List Nat := [63, 63, 448, 448, 448, 341, 7, 7, 63, 511, 0, 341]
def coils (a b : Nat) : Bool := a == b
def idx : List Nat := List.range 12
def extOf (i : Nat) : Nat := exts.getD i 0
```
