---
title: "Definitions in split.lean"
---

[← axiom index](/AXIOMS)

## `split.lean` — 8 definition(s), 22 theorem(s)

```lean
def tokens : List Nat := [0, 12, 3, 45, 6, 78, 9]
def singles : List Nat := [0, 3, 6, 9]
def pairs : List Nat := [12, 45, 78]
def unitsOf9 : List Nat := [1, 2, 4, 5, 7, 8]
def isUnit9 (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)
def coins : Nat := 2
def coinStep : Nat := 3 * coins
def sealBits : Nat := 128
```
