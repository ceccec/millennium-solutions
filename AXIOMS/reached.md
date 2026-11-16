---
title: "Definitions in reached.lean"
---

[← axiom index](/AXIOMS)

## `reached.lean` — 62 definition(s), 80 theorem(s)

```lean
def B : Nat := Z9.B
def m9 (n : Nat) : Nat := Z9.m9 n
def residues : List Nat := List.range B          -- 0 … 8
def neg (d : Nat) : Nat := m9 (B - m9 d)         -- additive inverse mod 9
def cls (d : Nat) : Nat := m9 d % 3
def verts (n : Nat) : Nat := 2 ^ n
def edges (n : Nat) : Nat := n * 2 ^ (n - 1)
def hue (d : Nat) : Nat := (d * 40) % 360
def units : List Nat := Z9.units
def sq : List (Nat × Nat) := (List.range 8).flatMap (fun r => (List.range 8).map (fun c => (r, c)))
def dark (p : Nat × Nat) : Bool := (p.1 + p.2) % 2 == 0
def jumps : List (Int × Int) := [(1,2),(2,1),(-1,2),(-2,1),(1,-2),(2,-1),(-1,-2),(-2,-1)]
def table : Nat → List Bool
def losing (n : Nat) : Bool := (table n).getD 0 false
def inv (u : Nat) : Nat := ((List.range B).filter (fun e => m9 (u * e) == 1)).getD 0 0
def perfect (p : Nat) : Nat := 2 ^ (p - 1) * (2 ^ p - 1)
def divisorSum (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
def isPrime (n : Nat) : Bool := n > 1 && (List.range' 2 n).all (fun d => d * d > n || n % d != 0)
def twoSquares (n : Nat) : Bool :=
def bit (n i : Nat) : Nat := (n / 2 ^ i) % 2
def binom : Nat → Nat → Nat
def popcount (n : Nat) : Nat := ((List.range 8).filter (fun i => bit n i == 1)).length
def pairs : List (Nat × Nat) := [(0,1),(0,2),(0,3),(1,2),(1,3),(2,3)]
def deg (g : Nat) (v : Nat) : Nat :=
def edgeCount (g : Nat) : Nat := ((List.range 6).filter (fun i => bit g i == 1)).length
def mex (xs : List Nat) : Nat := ((List.range (xs.length + 1)).filter (fun m => !(xs.contains m))).getD 0 0
def grundyTable : Nat → List Nat
def grundy (n : Nat) : Nat := (grundyTable n).getD 0 0
def beats (a b : Nat) : Bool := a % 3 == (b + 1) % 3
def digitsOf (v n len : Nat) : List Nat := (List.range len).map (fun i => (v / n ^ i) % n)
def partsFuel : Nat → Nat → Nat → Nat
def p (n : Nat) : Nat := partsFuel (n + n + 4) n n
def orbit : List Nat := (List.range 6).map (fun k => m9 (2 ^ (k + 1)))
def digitSum (n : Nat) : Nat := ((List.range 4).map (fun i => (n / 10 ^ i) % 10)).foldl (· + ·) 0
def collapse : Nat → Nat → Nat
def root (n : Nat) : Nat := collapse 8 n
def gcd9 (d : Nat) : Nat := ((List.range' 1 9).filter (fun g => d % g == 0 && 9 % g == 0)).foldl max 1
def refl10 (d : Nat) : Nat := 10 - d
def powersOf (u : Nat) : List Nat := (List.range 6).map (fun k => m9 (u ^ (k + 1)))
def phi (n : Nat) : Nat := ((List.range' 1 n).filter (fun d =>
def ind (u : Nat) : Nat := ((List.range 6).filter (fun k => m9 (2 ^ k) == u)).getD 0 0
def jos : Nat → Nat
def perms9 : List (List Nat) :=
def magicCentreAndCorners (sq : List Nat) : Bool :=
def fibPair : Nat → Nat × Nat
def sternF : Nat → Nat → Nat
def stern (n : Nat) : Nat := sternF 12 n
def gcdOf (a b : Nat) : Nat := ((List.range' 1 (min a b + 1)).filter (fun g => a % g == 0 && b % g == 0)).foldl max 1
def isQR (a p : Nat) : Bool := (List.range p).any (fun x => (x * x) % p == a % p)
def powers7 (u : Nat) : List Nat := (List.range 6).map (fun k => (u ^ (k + 1)) % 7)
def swap2 (n : Nat) : Nat := (n % 10) * 10 + (n / 10) % 10 + (n / 100) * 100
def addSpan (d : Nat) : List Nat := (List.range 9).map (fun k => m9 (k * d))
def axis3 : List Nat := [0, 3, 6]
def powMod (b m : Nat) : Nat → Nat
def fermatFools (n : Nat) : Bool := (List.range n).all (fun a => powMod a n n == a % n)
def fib : Nat → Nat
def collatzSteps : Nat → Nat → Bool
def divisorCount (n : Nat) : Nat := ((List.range' 1 n).filter (fun d => n % d == 0)).length
def derange : Nat → Nat
def lucas (n : Nat) : Nat := if n == 0 then 2 else fib (n - 1) + fib (n + 1)
def sumTo (n : Nat) : Nat := (List.range' 1 n).foldl (· + ·) 0
def largestPow2 (n : Nat) : Nat := ((List.range 12).map (fun k => 2 ^ k)).foldl (fun acc q => if q ≤ n then q else acc) 1
```
