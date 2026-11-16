---
title: "Definitions in rays.lean"
---

[← axiom index](/AXIOMS)

## `rays.lean` — 12 definition(s), 13 theorem(s)

```lean
def G : Nat := 3      -- the generator
def N : Nat := 7      -- the dimensions
def orbit : Nat → Nat → List Nat
def vortexOrder : List Nat := 0 :: orbit (N - 1) 1
def vortexReversed : List Nat := 0 :: (orbit (N - 1) 1).reverse
def invert (t : List Nat) : List Nat := t.map (fun b => 1 - b)
def lowBits (rs : List Nat) : List Nat := rs.map (fun v => v % 2)
def DIMENSIONS : Nat := 2 * N
def DIGITS_READ : Nat := 4 * N
def DIGITS_TOTAL : Nat := 32
def d1 (a b : Nat) : Nat := let x := if a < b then b - a else a - b; min x (9 - x)
def settledHere : Nat := 13
```
