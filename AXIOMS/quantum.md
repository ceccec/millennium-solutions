---
title: "Definitions in quantum.lean"
---

[← axiom index](/AXIOMS)

## `quantum.lean` — 11 definition(s), 11 theorem(s)

```lean
def insertEverywhere (x : Nat) : List Nat → List (List Nat)
def perms : List Nat → List (List Nat)
def ins (x : Nat) : List Nat → List Nat
def sort : List Nat → List Nat
def receipt (l : List Nat) : Nat := (sort l).foldl (fun a b => (a * 2 + b) % 9) 0
def naive (l : List Nat) : Nat := l.foldl (fun a b => (a * 2 + b) % 9) 0
def pairsOverNine : List (List Nat) :=
def settledHere : Nat := 11
def bit (n i : Nat) : Nat := n / (2 ^ i) % 2
def par3 (n : Nat) : Nat := (bit n 0 + bit n 1 + bit n 2) % 2
def ghzXSupport : List Nat := [0, 3, 5, 6]
```
