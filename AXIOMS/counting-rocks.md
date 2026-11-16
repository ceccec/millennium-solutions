---
title: "Definitions in counting-rocks.lean"
---

[← axiom index](/AXIOMS)

## `counting-rocks.lean` — 6 definition(s), 9 theorem(s)

```lean
def fact : Nat → Nat
def choose (n k : Nat) : Nat := if k ≤ n then fact n / (fact k * fact (n - k)) else 0
def rowSum (n : Nat) : Nat := (List.range (n+1)).foldl (fun acc k => acc + choose n k) 0
def handshakes (n : Nat) : Nat := n * (n-1) / 2
def der : Nat → Nat
def fib : Nat → Nat
```
