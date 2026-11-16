---
title: "Definitions in mechanical.lean"
---

[← axiom index](/AXIOMS)

## `mechanical.lean` — 5 definition(s), 127 theorem(s)

```lean
def M9 (n : Nat) : Nat := n % 9
def DR (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9
def gRange : List Nat := [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
def dbl : Nat → Nat
def forgetful (_ : Nat) : Nat := 0
```
