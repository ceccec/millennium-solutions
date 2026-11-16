---
title: "Definitions in families.lean"
---

[← axiom index](/AXIOMS)

## `families.lean` — 44 definition(s), 63 theorem(s)

```lean
def primesUpTo30 : List Nat := [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))
def gcdFuel : Nat → Nat → Nat → Nat
def gcd ' (a b : Nat) : Nat := gcdFuel (a + b + 1) a b
def totient (n : Nat) : Nat := ((List.range n).filter (fun a => gcd' a n == 1)).length
def popcount (n : Nat) : Nat := ((List.range 16).filter (fun i => (n >>> i) % 2 == 1)).length
def isPrime (n : Nat) : Bool := n ≥ 2 && (List.range' 2 (n - 2)).all (fun d => n % d != 0)
def unitsMod (m : Nat) : List Nat := (List.range m).filter (fun a => gcd' a m == 1)
def powMod (g k m : Nat) : Nat := (List.range k).foldl (fun a _ => a * g % m) (1 % m)
def ordMod (g m : Nat) : Nat := ((List.range' 1 m).find? (fun k => powMod g k m == 1)).getD 0
def hasPrimitiveRoot (m : Nat) : Bool := (unitsMod m).any (fun g => ordMod g m == (unitsMod m).length)
def isOddPrimePower (n : Nat) : Bool :=
def gaussCyclic (m : Nat) : Bool :=
def permutesZ9 (k : Nat) : Bool := (List.range 9).all (fun y => (List.range 9).any (fun d => k * d % 9 == y))
def addOrbit (k : Nat) : List Nat := (List.range 9).map (fun t => (List.range t).foldl (fun a _ => (a + k) % 9) 0)
def addGeneratesZ9 (k : Nat) : Bool := (List.range 9).all (fun y => (addOrbit k).contains y)
def invOf (d : Nat) : Option Nat := (List.range 9).find? (fun e => d * e % 9 == 1)
def powSum (k n : Nat) : Nat := ((List.range' 1 n).map (fun i => i ^ k)).foldl (· + ·) 0
def faulhaber (k n : Nat) : Nat :=
def digitsF : Nat → Nat → List Nat
def digitsOf (n : Nat) : List Nat := digitsF (n + 1) n
def reverseDigits (n : Nat) : Nat := (digitsOf n).foldl (fun a d => a * 10 + d) 0
def digitalRoot (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9
def rootSum (g m : Nat) : Nat := ((List.range (ordMod g m)).map (fun k => powMod g k m)).foldl (· + ·) 0
def vpF : Nat → Nat → Nat → Nat
def vp (p n : Nat) : Nat := vpF 20 p n
def isSumOfTwoSquares (n : Nat) : Bool :=
def everyThreeModFourPrimeIsEven (n : Nat) : Bool :=
def digitSquareSum (n : Nat) : Nat := ((digitsOf n).map (fun d => d * d)).foldl (· + ·) 0
def iterF : Nat → Nat → Nat
def polyRec : Nat → Nat → Nat
def fibPair : Nat → Nat × Nat
def fib (n : Nat) : Nat := (fibPair n).1
def digitSum (n : Nat) : Nat := (digitsOf n).foldl (· + ·) 0
def cfPair : Nat → Nat × Nat
def catalanList : Nat → List Nat
def pisano (m : Nat) : Nat := ((List.range' 1 100).find? (fun k => fib k % m == 0 && fib (k + 1) % m == 1)).getD 0
def interleaveN (x : Nat) : List Nat → List (List Nat)
def permsN : List Nat → List (List Nat)
def isInvolution (p : List Nat) : Bool := (List.range p.length).all (fun i => p.getD (p.getD i 0) 0 == i)
def telephone : Nat → Nat
def schlafli : List (Nat × Nat) :=
def settledHere : Nat := 42
```
