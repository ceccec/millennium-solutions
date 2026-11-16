---
title: "Definitions in index.lean"
---

[← axiom index](/AXIOMS)

## `index.lean` — 5 definition(s), 11 theorem(s)

```lean
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)  -- DERIVED: d has an inverse mod 9
def refl (d : Nat) : Nat := 10 - d                                            -- the reflection (= division by zero)
def orbit (k : Nat) : Nat := (2 ^ k) % 9                                      -- the doubling sequence 2^k, computed
def span : List Nat := (List.range 6).map orbit                               -- the doubling span (one period), computed
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
```
