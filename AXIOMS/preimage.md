---
title: "Definitions in preimage.lean"
---

[← axiom index](/AXIOMS)

## `preimage.lean` — 8 definition(s), 8 theorem(s)

```lean
def merge (a b : Nat) : Nat := 32 * a + b + 1024
def layer : List Nat → List Nat
def fold : Nat → List Nat → Nat
def foldOf (xs : List Nat) : Nat := fold 8 xs
def leafTag (x : Nat) : Nat := 2 * x + 1
def nodeTag (a b : Nat) : Nat := 2 * merge a b
def sep : Nat := 99
def mergeStr (a b : List Nat) : List Nat := a ++ [sep] ++ b
```
