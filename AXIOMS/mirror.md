---
title: "Definitions in mirror.lean"
---

[← axiom index](/AXIOMS)

## `mirror.lean` — 5 definition(s), 8 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d
def ring : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9]
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
def swapped : List (Nat × Nat) := (ring.filter (fun d => refl d != d && ring.contains (refl d) && d < refl d)).map (fun d => (d, refl d))
def centred : List Nat := ring.filter (fun d => refl d == d)
```
