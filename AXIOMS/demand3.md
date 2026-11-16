---
title: "Definitions in demand3.lean"
---

[← axiom index](/AXIOMS)

## `demand3.lean` — 12 definition(s), 19 theorem(s)

```lean
def isSumOfFour (n : Nat) : Bool :=
def isSumOfThree (n : Nat) : Bool :=
def cantor (a b : Nat) : Nat := (a + b) * (a + b + 1) / 2 + b
def block : List Nat := (List.range 8).flatMap (fun a => (List.range 8).map (fun b => cantor a b))
def repunit : Nat → Nat
def chi (g : Nat) : Int := 2 - 2 * (g : Int)
def isSquare (n : Nat) : Bool := (List.range 12).any (fun k => k * k == n)
def ins (x : Nat) : List Nat → List Nat
def sortDesc : List Nat → List Nat
def feasible (d : Nat) (rest : List Nat) : Bool :=
def step : List Nat → List Nat
def hh : Nat → List Nat → Bool
```
