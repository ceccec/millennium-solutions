---
title: "Definitions in separation.lean"
---

[← axiom index](/AXIOMS)

## `separation.lean` — 6 definition(s), 8 theorem(s)

```lean
def hubs : List Nat := [0, 1, 2]
def labels : List Nat := List.range 28
def ring (_hub : Nat) : List Nat := labels
def window (hub : Nat) : List Nat := labels.filter (fun d => d % 3 == hub)
def pairs : List (Nat × Nat) := hubs.flatMap (fun a => (hubs.filter (fun b => b != a)).map (fun b => (a, b)))
def valuesTaken (f : Nat → List Nat) : Nat :=
```
