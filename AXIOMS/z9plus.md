---
title: "Definitions in z9plus.lean"
---

[← axiom index](/AXIOMS)

## `z9plus.lean` — 16 definition(s), 48 theorem(s)

```lean
def m9 (n : Nat) : Nat := n % 9
def R : List Nat := List.range 9
def pw (b e : Nat) : Nat := m9 (b ^ e)
def generates (g : Nat) : Bool := ((List.range' 1 6).map (fun k => pw g k)).eraseDups.length == 6
def dr (n : Nat) : Nat := if n == 0 then 0 else if m9 n == 0 then 9 else m9 n
def ord (u : Nat) : Nat := ((List.range' 1 6).filter (fun k => pw u k == 1)).headD 0
def refl (d : Nat) : Nat := 10 - d
def orbit6 : List Nat := (List.range 6).map (fun k => pw 2 k)
def dbl (d : Nat) : Nat := m9 (d * 2)
def rfl9 (d : Nat) : Nat := m9 (10 - d)
def grow (s : List Nat) : List Nat := (s ++ s.map dbl ++ s.map rfl9).eraseDups
def closure : Nat → List Nat → List Nat
def fib : Nat → Nat
def fib9 (n : Nat) : Nat := m9 (fib n)
def gcdF : Nat → Nat → Nat → Nat
def gcd9 (a b : Nat) : Nat := gcdF (a + b + 1) a b
```
