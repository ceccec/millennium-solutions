---
title: "Definitions in qpu_crypto.lean"
---

[← axiom index](/AXIOMS)

## `qpu_crypto.lean` — 48 definition(s), 64 theorem(s)

```lean
def sealModulus : Nat := Qpu.rays * (Qpu.faces - 1)
def sealExponent : Nat := Qpu.rays
def sealFold : Nat := 2 ^ Qpu.qubits
def totient : Nat := (Qpu.rays - 1) * (Qpu.faces - 1 - 1)
def rsaInverse : Nat := 31
def rsa (e r : Nat) : Nat := r ^ e % sealModulus
def sealOf (r : Nat) : Nat := 1 + rsa sealExponent r % sealFold
def permutes (e : Nat) : Bool := (List.range sealModulus).all (fun y => ((List.range sealModulus).filter (fun r => rsa e r == y)).length == 1)
def nibbleCount (v : Nat) : Nat := ((List.range sealModulus).filter (fun r => sealOf r == v)).length
def qpuRegister (width : Nat) : Nat := 32 * width - width - 2
def groverExponent : Nat := Capacity.free / 2
def collisionExponent : Nat := Capacity.free / 3
def isoFloor : Nat := 128
def powMod (a e m : Nat) : Nat := a ^ e % m
def periodAux : Nat → Nat → Nat → Nat → Nat
def period (a m : Nat) : Nat := periodAux m a m 1
def shorBase : Nat := 2 ^ Qpu.qubits
def gcdAux : Nat → Nat → Nat → Nat
def gcd (a b : Nat) : Nat := gcdAux (a + b) a b
def units : List Nat := (List.range' 2 (sealModulus - 2)).filter (fun a => gcd a sealModulus == 1)
def oddPeriod (a : Nat) : Bool := period a sealModulus % 2 == 1
def landsOnMinusOne (a : Nat) : Bool := period a sealModulus % 2 == 0 && powMod a (period a sealModulus / 2) sealModulus == sealModulus - 1
def splitsBy (a : Nat) : Bool := !(oddPeriod a || landsOnMinusOne a)
def isPrime (n : Nat) : Bool := n ≥ 2 && (List.range' 2 (n - 2)).all (fun d => n % d != 0)
def oddPrimes : List Nat := (List.range' 3 27).filter isPrime
def small : List Nat := (List.range' 3 17).filter isPrime
def splits (N : Nat) : List (Nat × Nat) := ((List.range' 2 N).filter (fun u => N % u == 0 && u * u ≤ N)).map (fun u => (u, N / u))
def ceilSqrt (N : Nat) : Nat := ((List.range' 0 (N + 1)).find? (fun x => x * x ≥ N)).getD 0
def witness (p q : Nat) : Nat := (p + q) / 2
def decodes (N x : Nat) : Bool := (List.range' 0 (x - 1)).any (fun b => (x - b) * (x + b) == N)
def blind (p q : Nat) : Nat := witness p q - ceilSqrt (p * q) + 1
def thousand : Nat := 2 ^ 999 + 1
def found : List Nat := [3, 3, 3, 3, 19, 1777, 3331, 17539, 23977, 87211, 304363, 25781083, 5814899281, 97377658867]
def cofactor : Nat := 3609104950099351833043508337831612057396401348775709961277801618185533776454902446192620269318904367011984674065478055484306453675012250321071523714940753877783971448660823020399749748515419197076882611704620121314559503976901003284138222351507
def powModAux : Nat → Nat → Nat → Nat → Nat → Nat
def powModBin (b e m : Nat) : Nat := powModAux 1024 (b % m) e m (1 % m)
def glOrder : Nat → Nat → Nat
def gl (nn : Nat) : Nat := glOrder nn nn
def smallPrime (n : Nat) : Bool := n ≥ 2 && (List.range' 2 99).all (fun d => d * d > n || n % d != 0)
def triangular (q : Nat) : Nat := q * (q + 1) / 2
def milu : Nat × Nat := (Qpu.clayPlane * (Qpu.faces - 1) - Qpu.qubits * Qpu.qubits, Qpu.clayPlane * Qpu.hexbit + 1)
def groverIters (num den k : Nat) : Nat := num * 2 ^ k / (4 * den)
def scaleCapacity (s : Nat) : Nat := 16 ^ s * (4 * s)
def reflCentre (n : Nat) : Nat := 3 * 2 ^ (n - 1)
def reflSigma (n x : Nat) : Nat := reflCentre n - x
def reflMaximal (n : Nat) : Nat := 2 ^ n - 1
def reflWitness (n : Nat) : Nat := 2 ^ (n - 1) + 1
def reflWidths : List Nat := [2, 4, 8, 16, 32, 64, 128]
```
