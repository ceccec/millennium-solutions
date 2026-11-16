---
title: "Definitions in asymmetry.lean"
---

[← axiom index](/AXIOMS)

## `asymmetry.lean` — 7 definition(s), 8 theorem(s)

```lean
def m9 (n : Nat) : Nat := n % 9
def ring : List Nat := List.range 9
def refl (d : Nat) : Nat := m9 (10 - d)
def dbl (d : Nat) : Nat := m9 (2 * d)
def sq (d : Nat) : Nat := m9 (d * d)
def image (f : Nat → Nat) : List Nat := (ring.map f).eraseDups
def injective (f : Nat → Nat) : Bool := (image f).length == ring.length
```
