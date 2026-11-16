---
title: "Definitions in qpu.lean"
---

[← axiom index](/AXIOMS)

## `qpu.lean` — 35 definition(s), 24 theorem(s)

```lean
def coins : Nat := 2
def rays : Nat := 7
def faces : Nat := 14
def vertices : Nat := 8
def hexbit : Nat := 4
def bits : Nat := 32
def qubits : Nat := 3
def levels : Nat := 2
def clayMint (k : Nat) : Nat := 2 ^ k
def clayN : Nat := ["quantum", "processing", "unit"].length
def claySeed : Nat := clayMint (clayN - clayN)
def clayCoins : Nat := claySeed + claySeed
def clayRays : Nat := clayN + clayCoins + clayCoins
def clayVertices : Nat := clayMint clayN
def clayHexbit : Nat := clayMint clayCoins
def clayBits : Nat := clayMint (clayN + clayCoins)
def clayFaces : Nat := clayVertices + clayHexbit + clayCoins
def clayPlane : Nat := clayCoins * clayCoins * clayRays
def clayAmplitudes : Nat := clayMint clayBits
def clayChimera (m : Nat) : Nat := clayVertices * m ^ 2
def clayQaoaZz (p e : Nat) : Nat := p * e
def clayGroverSize (k : Nat) : Nat := clayMint (2 * k)
def clayQftStates (q : Nat) : Nat := 2 ^ q
def clayQftGates (q : Nat) : Nat := q * (q + 1) / 2
def clayTriangular : Nat → Nat
def clayChoose : Nat → Nat → Nat
def clayIsingFusion (m : Nat) : Nat := clayMint (m - claySeed)
def clayCoil : Nat := clayCoins * clayRays
def clayQaoaParams (p : Nat) : Nat := clayCoins * p
def clayPowMod (a e m : Nat) : Nat := a ^ e % m
def digitsIn (b : Nat) : Nat → Nat → List Nat
def ofDigits (b : Nat) (ds : List Nat) : Nat := ds.foldl (fun acc d => acc * b + d) 0
def rayRoundTrip (k n : Nat) : Nat := ofDigits (2 ^ k) (digitsIn (2 ^ k) (n + 1) n)
def mirrorNat (fuel n : Nat) : Nat :=
def bitLen (fuel n : Nat) : Nat := (digitsIn 2 fuel n).length
```
