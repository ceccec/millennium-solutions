---
title: "Definitions in theology.lean"
---

[← axiom index](/AXIOMS)

## `theology.lean` — 13 definition(s), 8 theorem(s)

```lean
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)
def refl (d : Nat) : Nat := 10 - d
def dbl (d : Nat) : Nat := (2 * d) % 9
def iter : Nat → Nat → Nat
def orbit (k : Nat) : Nat := iter k 1
def span : List Nat := (List.range 6).map orbit
def spanOf (g : Nat) : List Nat := ((List.range 6).map (fun k => iter k g)).eraseDups
def sameSet (a b : List Nat) : Bool := a.all (fun x => b.contains x) && b.all (fun x => a.contains x)
def invOf (d : Nat) : Nat := ((List.range 9).filter (fun e => (d * e) % 9 == 1)).foldr (fun a _ => a) 0
def searchCost (d : Nat) : Nat := ((List.range 9).takeWhile (fun e => (d * e) % 9 != 1)).length
def subsetOf (m : Nat) : List Nat := ((List.range 6).filter (fun i => (m >>> i) % 2 == 1)).map orbit
def pairing : List Nat := [0, 1, 2, 3, 4, 5, 6]
def fact : Nat → Nat
```
