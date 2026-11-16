---
title: "Definitions in digits.lean"
---

[← axiom index](/AXIOMS)

## `digits.lean` — 4 definition(s), 8 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d
def refl2 (n : Nat) : Nat := refl (n / 10) * 10 + refl (n % 10)
def refl3 (n : Nat) : Nat := refl (n / 100) * 100 + refl (n / 10 % 10) * 10 + refl (n % 10)
def pairNums : List Nat := [1, 2, 3, 4, 5].map (fun a => a * 10 + refl a)
```
