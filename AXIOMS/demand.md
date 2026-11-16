---
title: "Definitions in demand.lean"
---

[← axiom index](/AXIOMS)

## `demand.lean` — 12 definition(s), 11 theorem(s)

```lean
def divisors (n : Nat) : List Nat := (List.range' 1 n).filter (fun d => n % d == 0)
def isSquarefree (n : Nat) : Bool := (List.range' 2 n).all (fun d => ¬ (n % (d * d) == 0))
def isPrime (p : Nat) : Bool := p > 1 && (List.range' 2 (p - 2)).all (fun q => ¬ (p % q == 0))
def omega (n : Nat) : Nat := ((List.range' 2 n).filter (fun p => n % p == 0 && isPrime p)).length
def mu (n : Nat) : Int := if n == 1 then 1 else if isSquarefree n then (if omega n % 2 == 0 then 1 else -1) else 0
def derange : Nat → Nat
def isSumOfThreeSquares (n : Nat) : Bool :=
def isExcludedForm (n : Nat) : Bool :=
def isComposite (n : Nat) : Bool := n > 1 && (List.range' 2 (n - 2)).any (fun d => n % d == 0)
def primeFactors (n : Nat) : List Nat := (List.range' 2 n).filter (fun p => n % p == 0 && isPrime p)
def isCarmichael (n : Nat) : Bool :=
def bitsF : Nat → Nat → Nat
```
