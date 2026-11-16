---
title: "Definitions in synthesis.lean"
---

[← axiom index](/AXIOMS)

## `synthesis.lean` — 8 definition(s), 8 theorem(s)

```lean
def sympProd : Nat → Nat                                  -- ∏_{j=1}^{k} (4^j − 1)
def symp (nn : Nat) : Nat := 2 ^ (nn * nn) * sympProd nn   -- |Sp(2n, 2)|
def clifford (nn : Nat) : Nat := 2 ^ (2 * nn) * symp nn        -- |C_n|, the n-qubit Clifford group
def fib : Nat → Nat                                       -- Fibonacci-anyon fusion dimension
def ising (m : Nat) : Nat := 2 ^ (m - 1)                  -- Ising-anyon fusion dimension (m pairs)
def qaoaParams (p : Nat)   : Nat := 2 * p                 -- two variational parameters per layer
def qaoaZz (p e : Nat) : Nat := p * e                 -- cost-layer ZZ gates over e edges, p layers
def qaoaX (p q : Nat) : Nat := p * q                 -- mixer X gates over q qubits, p layers
```
