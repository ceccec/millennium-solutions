---
title: "Definitions in nucleus.lean"
---

[← axiom index](/AXIOMS)

## `nucleus.lean` — 8 definition(s), 8 theorem(s)

```lean
def caps : List Nat := [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
def total (l : List Nat) : Nat := l.foldr (· + ·) 0
def prefixes : List Nat := (List.range (caps.length + 1)).map (fun i => total (caps.take i))
def marks : List Nat := [1, 3, 6, 7, 11, 16, 22]        -- the positions, from the filling order above
def closures : List Nat := marks.map (fun i => total (caps.take i))
def numerators : List Nat := [1, 1, 1, 8, 7, 5, 1, 2, 9]
def denominators : List Nat := [2, 2, 2, 7, 5, 3, 2, 3]
def product (l : List Nat) : Nat := l.foldr (· * ·) 1
```
