---
title: "Definitions in merkaba.lean"
---

[← axiom index](/AXIOMS)

## `merkaba.lean` — 6 definition(s), 8 theorem(s)

```lean
def axis : List Nat := [3, 6, 0]   -- {3,6,9} — the spindle
def tetA : List Nat := [1, 4, 7]
def tetB : List Nat := [2, 5, 8]
def dbl (l : List Nat) : List Nat := l.map (fun d => m9 (2 * d))
def tri (n : Nat) : Nat := n * (n + 1) / 2
def sumTri (n : Nat) : Nat := ((List.range' 1 n).map tri).foldl (· + ·) 0
```
