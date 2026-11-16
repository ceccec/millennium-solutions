---
title: "Definitions in sequences.lean"
---

[← axiom index](/AXIOMS)

## `sequences.lean` — 7 definition(s), 28 theorem(s)

```lean
def fib : Nat → Nat
def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))
def andF : Nat → Nat → Nat → Nat
def andN (a b : Nat) : Nat := andF 33 a b
def popcount (n : Nat) : Nat := (List.range (n + 1)).foldl (fun a i => a + n / 2 ^ i % 2) 0
def tm (n : Nat) : Nat := popcount n % 2
```
