---
title: "Definitions in elementary.lean"
---

[← axiom index](/AXIOMS)

## `elementary.lean` — 24 definition(s), 40 theorem(s)

```lean
def properDivisorSum (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
def eisensteinNorm (a b : Int) : Int := a * a - a * b + b * b
def invUnit (u : Nat) : Nat := ((List.range 9).find? (fun e => u * e % 9 == 1)).getD 0
def lucasPair : Nat → Nat × Nat
def lucas (n : Nat) : Nat := (lucasPair n).1
def pellPair : Nat → Nat × Nat
def pell (n : Nat) : Nat := (pellPair n).1
def leFrac (x y : Nat × Nat) : Bool := x.1 * y.2 ≤ y.1 * x.2
def insFrac (x : Nat × Nat) : List (Nat × Nat) → List (Nat × Nat)
def sortFrac : List (Nat × Nat) → List (Nat × Nat)
def farey (n : Nat) : List (Nat × Nat) :=
def nbrs (S : List Nat) (d : Nat) : List Nat :=
def degreeSet (S : List Nat) : List Nat := (S.map (fun d => (nbrs S d).length)).eraseDups
def isqrt (n : Nat) : Nat := ((List.range 200).filter (fun s => s * s ≤ n)).getLast? |>.getD 0
def lowerWythoff (n : Nat) : Nat := (n + isqrt (5 * n * n)) / 2
def upperWythoff (n : Nat) : Nat := (3 * n + isqrt (5 * n * n)) / 2
def knightSteps : List (Nat × Nat) :=
def partsF : Nat → Nat → Nat → List (List Nat)
def partitionsOf (n : Nat) : List (List Nat) := partsF (n + 1) n n
def rgs : Nat → List (List Nat)
def bellRow : Nat → List Nat
def bellOf (n : Nat) : Nat := (bellRow n).headD 0
def tetOf (r : Nat) : List Nat := (unitsMod 9).filter (fun d => d % 3 == r)
def settledHere : Nat := 32
```
