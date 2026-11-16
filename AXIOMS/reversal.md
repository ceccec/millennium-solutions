---
title: "Definitions in reversal.lean"
---

[← axiom index](/AXIOMS)

## `reversal.lean` — 6 definition(s), 29 theorem(s)

```lean
def digitsF : Nat → Nat → List Nat
def digits (n : Nat) : List Nat := if n == 0 then [0] else digitsF (n + 1) n
def reverseNum (n : Nat) : Nat := (digits n).foldl (fun a d => a * 10 + d) 0
def digitSum (n : Nat) : Nat := (digits n).foldl (· + ·) 0
def isPrime (n : Nat) : Bool := n > 1 && (List.range n).all (fun d => d < 2 || n % d != 0)
def settledHere : Nat := 8
```
