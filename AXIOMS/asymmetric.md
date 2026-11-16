---
title: "Definitions in asymmetric.lean"
---

[← axiom index](/AXIOMS)

## `asymmetric.lean` — 13 definition(s), 11 theorem(s)

```lean
def uuidBytes : Nat := 16
def publicKeyBytes : Nat := 32
def signatureBytes : Nat := 64
def checkBits : Nat := 32
def payloadBits : Nat := 42 + 48
def bitsOf (n : Nat) : Nat := 8 * n
def containersOf (n : Nat) : Nat := (n + uuidBytes - 1) / uuidBytes
def widths : List Nat := List.range (8 * uuidBytes + 1)
def checkOf (_secret payload : Nat) : Nat := payload % 4
def tagOf (secret payload : Nat) : Nat := (secret * 7 + payload * 3) % 16
def p : Nat := 2 ^ 255 - 19
def L : Nat := 2 ^ 252 + 27742317777372353535851937790883648493
def settledHere : Nat := 11
```
