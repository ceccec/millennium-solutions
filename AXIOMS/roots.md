---
title: "Definitions in roots.lean"
---

[← axiom index](/AXIOMS)

## `roots.lean` — 6 definition(s), 7 theorem(s)

```lean
def step : Nat → Nat → Nat → Nat → Nat
def iroot (k n : Nat) : Nat := if n < 2 then n else step 400 k n n
def frac64 (k p : Nat) : Nat := iroot k (p * 2 ^ (64 * k)) % 2 ^ 64
def isPrime (n : Nat) : Bool := n >= 2 && ((List.range' 2 (n - 2)).all (fun d => d * d > n || n % d != 0))
def firstPrimes (bound count : Nat) : List Nat := ((List.range' 2 bound).filter isPrime).take count
def settledHere : Nat := 7
```
