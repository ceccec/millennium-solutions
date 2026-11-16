---
title: "Definitions in authority.lean"
---

[← axiom index](/AXIOMS)

## `authority.lean` — 7 definition(s), 8 theorem(s)

```lean
def sealed : List Nat := [0, 1, 2, 3, 4, 5, 6, 7]
def withdrawn : List Nat := [2, 5]
def live : List Nat := sealed.filter (fun k => ! withdrawn.contains k)
def carriesRider : List Nat := [0, 1, 3, 4, 6]
def isVerdict : List Nat := [1, 6, 7]
def bits : Nat → List Nat := fun m => sealed.filter (fun i => (m >>> i) % 2 == 1)
def cleared : List Nat := [3, 4]
```
