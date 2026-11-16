---
title: "Definitions in qpu_fold.lean"
---

[← axiom index](/AXIOMS)

## `qpu_fold.lean` — 14 definition(s), 8 theorem(s)

```lean
def mask : Nat := 65536
def prime : Nat := 435
def bit (n i : Nat) : Nat := n / 2 ^ i % 2
def xor16 (a b : Nat) : Nat := (List.range 16).foldl (fun acc i => acc + ((bit a i + bit b i) % 2) * 2 ^ i) 0
def t0 (h0 c : Nat) : Nat := xor16 h0 c * prime
def t1 (h0 h1 c : Nat) : Nat := h1 * prime + t0 h0 c / mask
def t2 (h0 h1 h2 c : Nat) : Nat := h2 * prime + xor16 h0 c * 256 + t1 h0 h1 c / mask
def newH3 (h0 h1 h2 h3 c : Nat) : Nat := (h3 * prime + h1 * 256 + t2 h0 h1 h2 c / mask) % mask
def W : Nat := 4
def Pbits : Nat := 8
def coinOf (state : Nat) : Nat := state          -- the address as a function of the state (an embedding)
def stateOf (text : Nat) : Nat := text % 2 ^ W   -- distinct texts collapse onto 2^W states
def coin (text : Nat) : Nat := coinOf (stateOf text)
def pairFill (a b : Nat) : Nat := a * 2 ^ W + b
```
