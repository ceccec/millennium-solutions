---
title: "Definitions in handle.lean"
---

[← axiom index](/AXIOMS)

## `handle.lean` — 9 definition(s), 8 theorem(s)

```lean
def nib (n i : Nat) : Nat := (n >>> (4 * i)) % 16
def fromNibs (a b c d : Nat) : Nat := a + 16 * b + 256 * c + 4096 * d
def groups : List Nat := [8, 4, 4, 4, 12]
def space : Nat := 65536
def addr (m : Nat) : Nat := m % 16
def under (h m : Nat) : Nat × Nat := (h, addr m)
def sealAt (m step : Nat) : Nat := (m * 7 + step * 13) % 256
def fold4 (a b c d : Nat) : Nat := (((a * 31 + b) * 31 + c) * 31 + d) % 65536
def perms : List (List Nat) :=
```
