---
title: "Definitions in speed.lean"
---

[← axiom index](/AXIOMS)

## `speed.lean` — 20 definition(s), 28 theorem(s)

```lean
def recomputeUs : Nat := 21582900   -- folding 2^20 leaves
def verifyUs : Nat := 38         -- walking the 20-node inclusion path
def nsPerVerify : Nat := 38000      -- the same verify, in nanoseconds
def hexChars : Nat := 32     -- an address in the 8-bit hex form fixed by RFC 9562 §5.8
def hexbitChars : Nat := 22     -- the same address over the 64-hexagram lattice
def hexMs : Nat := 16     -- median ms for 200,000 encodings, 8-bit table
def hexbitMs : Nat := 30     -- the same work, 6-bit lattice
def charsFor (b : Nat) : Nat := (128 + b - 1) / b
def hexLo (x : Nat) : Nat := x % 16
def hexHi (x : Nat) : Nat := x / 16
def crossMul (a b : Nat) : Nat := (hexLo a * hexLo b + ((hexHi a * hexLo b + hexLo a * hexHi b) % 16) * 16) % 256
def perItem (F c n : Nat) : Nat := (F + n * c) / n
def wall (F c n k : Nat) : Nat := F + ((n + k - 1) / k) * c
def sortN : List Nat → List Nat
def foldHex (xs : List Nat) : Nat := (sortN xs).foldl (fun a d => (16 * a + d) % 4294967296) 7
def hexOf (xs : List Nat) : List Nat := xs.map (fun v => v / 256 % 16)
def measuredUnbounded : List Nat := [40459, 6912, 5184, 2661, 3370, 3820]
def measuredBounded : List Nat := [28667, 7337, 5143, 2654, 2940, 2748, 4373]
def fellTenfold (xs : List Nat) (i j : Nat) : Bool := xs.getD i 0 ≥ 10 * xs.getD j 0
def rises (xs : List Nat) (i j : Nat) : Bool := xs.getD j 0 > xs.getD i 0
```
