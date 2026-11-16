---
title: "Definitions in coin.lean"
---

[← axiom index](/AXIOMS)

## `coin.lean` — 7 definition(s), 12 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d
def tetA : List Nat := [1, 4, 7]
def tetB : List Nat := [2, 5, 8]
def axis : List Nat := [3, 6, 9]
def digits : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
def fall (n : Nat) : Nat := if n == 0 then 9 else 1 + (n - 1) % 9
def nonzero : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9]
```
