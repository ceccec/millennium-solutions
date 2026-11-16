---
title: "Definitions in demand2.lean"
---

[← axiom index](/AXIOMS)

## `demand2.lean` — 17 definition(s), 12 theorem(s)

```lean
def sumPow (p n : Nat) : Nat := (List.range' 1 n).foldl (fun a k => a + k ^ p) 0
def tri (n : Nat) : Nat := n * (n + 1) / 2
def isSquareBelow (bound m : Nat) : Bool := (List.range bound).any (fun r => r * r == m)
def pts : List (Int × Int) :=
def triples : List ((Int × Int) × (Int × Int) × (Int × Int)) :=
def cross (a b c : Int × Int) : Int := (b.1 - a.1) * (c.2 - a.2) - (c.1 - a.1) * (b.2 - a.2)
def interiorCount (a b c : Int × Int) : Int :=
def boundaryCount (a b c : Int × Int) : Int :=
def tuples : Nat → Nat → List (List Nat)
def permsOf (n : Nat) : List (List Nat) := (tuples n n).filter (fun r => r.eraseDups.length == n)
def discord (n : Nat) (r s : List Nat) : Bool := (List.range n).all (fun j => ¬ (r.getD j 0 == s.getD j 0))
def countRows : Nat → Nat → List (List Nat) → List (List Nat) → Nat
def latinSquares (n : Nat) : Nat := countRows n n (permsOf n) []
def crtCoversAllPairs (m n : Nat) : Bool :=
def perfectPowersUpTo (bound : Nat) : List Nat :=
def pp2000 : List Nat := perfectPowersUpTo 2000
def aliquot (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
```
