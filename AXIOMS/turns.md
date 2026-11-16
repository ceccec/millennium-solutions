---
title: "Definitions in turns.lean"
---

[← axiom index](/AXIOMS)

## `turns.lean` — 6 definition(s), 8 theorem(s)

```lean
def m9 (n : Nat) : Nat := n % 9
def dbl (d : Nat) : Nat := m9 (2 * d)
def rfl9 (d : Nat) : Nat := m9 (10 - d)
def iter (f : Nat → Nat) (d : Nat) : Nat → Nat
def cycLen (f : Nat → Nat) (d : Nat) : Nat :=
def ring : List Nat := List.range 9
```
