---
title: The axiom index — what is not assumed, and what is
---

# The axiom index

Every declaration in `src/proof` is checked with `#print axioms` on each build, and a dependency on any
axiom fails the build rather than earning a footnote. All **511** report the same thing:
*does not depend on any axioms*.

That is a real property, and it is not the whole picture. **Axiom-free is not assumption-free.** These
theorems rest on **209** definitions, and every one of them is a choice. A theorem about
`fall` is a theorem about the digital root only because `fall` is *defined* to be it. Both halves are
indexed below, and the second is the longer one.

## The check can tell the difference

"No theorem depends on an axiom" reads identically whether the check works or is pointed at nothing, so
a negative control is kept at [`src/proof/fixtures/axiom-control.lean`](https://github.com/ceccec/millennium-solutions/blob/main/src/proof/fixtures/axiom-control.lean)
and run by this page's generator. It holds two theorems about the same kind of fact — one decided, one
obtained classically — and Lean reports:

```
'axiom_free_by_decision' does not depend on any axioms
'needs_all_three' depends on axioms: [propext, Classical.choice, Quot.sound]
```

One appeal to excluded middle costs all three axioms. That contrast is the reason the arithmetic here is
decided rather than argued, and it is measured on every run rather than asserted once.

## The three axioms of Lean 4, and what stands in each one's place

### `propext`

**What it buys.** propositional extensionality — two propositions that imply each other are EQUAL, so one can be rewritten as the other.

**What is here instead.** nothing here rewrites a proposition into another. A statement is evaluated on its own terms over a finite domain, and equality of propositions never has to be asserted because no proposition is ever substituted for another.

### `Classical.choice`

**What it buys.** the axiom of choice, and with it excluded middle — every proposition is true or false whether or not anything can decide which.

**What is here instead.** DECIDABILITY, which is the strictly stronger thing over a finite domain: not "p or not p" as a principle, but the kernel walking every case and reporting which. `by decide` needs no oracle because it does the work. This is the exact trade the deposit is built on, and it is why every domain here is finite: an infinite domain cannot be exhausted, so it would need the axiom back.

### `Quot.sound`

**What it buys.** quotient soundness — elements related by an equivalence become equal in the quotient.

**What is here instead.** no quotient is formed. Where a quotient would be natural — ℤ/9 — the deposit works with the representatives 0..8 and `% 9` directly, so the ring is a computation on Nat rather than a quotient type. Concretely: `fall`, `refl` and the residue maps are functions on Nat that the kernel evaluates.

There is no fourth. Lean 4's axiom base is exactly these three, so an index of them is complete rather
than a selection — and "depends on no axioms" means depends on none of these three, which is the whole
of what could have been depended on.

## What IS assumed: the 209 definitions

Each of these is a primitive of this deposit — not derived, not proved, chosen. They are listed in full
because a reader checking a theorem must be able to read the definition it is about, and because a
deposit that reports its axiom count and hides its definition count is reporting the flattering half.

### `address.lean` — 12 definition(s), 14 theorem(s)

```lean
def andF : Nat → Nat → Nat → Nat
def orF : Nat → Nat → Nat → Nat
def and8 (a b : Nat) : Nat := andF 9 a b
def or8 (a b : Nat) : Nat := orF 9 a b
def SEEDS : List Nat := [0, 2654435769, 608135816, 3084996962]
def wordBytes (w : Nat) : List Nat := [shr w 24 % 256, shr w 16 % 256, shr w 8 % 256, w % 256]
def rawBytes (cs : List Nat) : List Nat := (SEEDS.map (fun s => hash32 s cs)).flatMap wordBytes
def stamp (bs : List Nat) : List Nat :=
def toUuidBytes (cs : List Nat) : List Nat := stamp (rawBytes cs)
def A : List Nat := [97]                                    -- "a"
def UUIDNA : List Nat := [117, 117, 105, 100, 110, 97]      -- "uuidna"
def settledHere : Nat := 13
```

### `coin.lean` — 8 definition(s), 12 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d
def tetA : List Nat := [1, 4, 7]
def tetB : List Nat := [2, 5, 8]
def axis : List Nat := [3, 6, 9]
def digits : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
def fall (n : Nat) : Nat := if n == 0 then 9 else 1 + (n - 1) % 9
def nonzero : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9]
def physicalClaims : Nat := 0
```

### `demand.lean` — 12 definition(s), 8 theorem(s)

```lean
def divisors (n : Nat) : List Nat := (List.range' 1 n).filter (fun d => n % d == 0)
def isSquarefree (n : Nat) : Bool := (List.range' 2 n).all (fun d => ¬ (n % (d * d) == 0))
def isPrime (p : Nat) : Bool := p > 1 && (List.range' 2 (p - 2)).all (fun q => ¬ (p % q == 0))
def omega (n : Nat) : Nat := ((List.range' 2 n).filter (fun p => n % p == 0 && isPrime p)).length
def mu (n : Nat) : Int := if n == 1 then 1 else if isSquarefree n then (if omega n % 2 == 0 then 1 else -1) else 0
def derange : Nat → Nat
def isSumOfThreeSquares (n : Nat) : Bool :=
def isExcludedForm (n : Nat) : Bool :=
def isComposite (n : Nat) : Bool := n > 1 && (List.range' 2 (n - 2)).any (fun d => n % d == 0)
def primeFactors (n : Nat) : List Nat := (List.range' 2 n).filter (fun p => n % p == 0 && isPrime p)
def isCarmichael (n : Nat) : Bool :=
def bitsF : Nat → Nat → Nat
```

### `demand2.lean` — 17 definition(s), 8 theorem(s)

```lean
def sumPow (p n : Nat) : Nat := (List.range' 1 n).foldl (fun a k => a + k ^ p) 0
def tri (n : Nat) : Nat := n * (n + 1) / 2
def isSquareBelow (bound m : Nat) : Bool := (List.range bound).any (fun r => r * r == m)
def pts : List (Int × Int) :=
def triples : List ((Int × Int) × (Int × Int) × (Int × Int)) :=
def cross (a b c : Int × Int) : Int := (b.1 - a.1) * (c.2 - a.2) - (c.1 - a.1) * (b.2 - a.2)
def interiorCount (a b c : Int × Int) : Int :=
def boundaryCount (a b c : Int × Int) : Int :=
def tuples : Nat → Nat → List (List Nat)
def permsOf (n : Nat) : List (List Nat) := (tuples n n).filter (fun r => r.eraseDups.length == n)
def discord (n : Nat) (r s : List Nat) : Bool := (List.range n).all (fun j => ¬ (r.getD j 0 == s.getD j 0))
def countRows : Nat → Nat → List (List Nat) → List (List Nat) → Nat
def latinSquares (n : Nat) : Nat := countRows n n (permsOf n) []
def crtCoversAllPairs (m n : Nat) : Bool :=
def perfectPowersUpTo (bound : Nat) : List Nat :=
def pp2000 : List Nat := perfectPowersUpTo 2000
def aliquot (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
```

### `demand3.lean` — 12 definition(s), 7 theorem(s)

```lean
def isSumOfFour (n : Nat) : Bool :=
def isSumOfThree (n : Nat) : Bool :=
def cantor (a b : Nat) : Nat := (a + b) * (a + b + 1) / 2 + b
def block : List Nat := (List.range 8).flatMap (fun a => (List.range 8).map (fun b => cantor a b))
def repunit : Nat → Nat
def chi (g : Nat) : Int := 2 - 2 * (g : Int)
def isSquare (n : Nat) : Bool := (List.range 12).any (fun k => k * k == n)
def ins (x : Nat) : List Nat → List Nat
def sortDesc : List Nat → List Nat
def feasible (d : Nat) (rest : List Nat) : Bool :=
def step : List Nat → List Nat
def hh : Nat → List Nat → Bool
```

### `energy.lean` — 15 definition(s), 18 theorem(s)

```lean
def splitCost : Nat := 52000  -- Wh to electrolyse 1 kg H₂ (real cells: 50–55 kWh/kg; ideal is ~39.4)
def burnYield : Nat := 12000  -- Wh recovered burning it at ~35% engine efficiency (LHV 33.3 kWh/kg)
def waterOut : Nat := 9      -- litres: 1 kg H₂ + 8 kg O₂ → 9 kg H₂O, the whole point of the exhaust
def roPerLitre : Nat := 4      -- Wh/litre for reverse osmosis, the ordinary way to clean a litre of water
def mgH2 : Nat := 2016    -- H₂  = 2 × 1.008 g/mol
def mgO2 : Nat := 31998   -- O₂  = 2 × 15.999 g/mol
def mgH2O : Nat := 18015   -- H₂O = 18.015 g/mol
def balances (a b c : Nat) : Bool := (2 * a == 2 * b) && (a == 2 * c)
def molH2 : Nat := 496    -- moles in 1 kg of H₂ (1000 g ÷ 2.016)
def molO2 : Nat := 248    -- the oxygen that comes with it, half as many moles
def mLperMol : Nat := 22414  -- millilitres per mole at STP
def whPerKgH2 : Nat := 33300  -- lower heating value, Wh per kg
def petrolWhL : Nat := 9700   -- Wh per litre of petrol, for scale
def tdsSeawater : Nat := 35000  -- mg of dissolved solids per litre
def tdsTapWater : Nat := 50     -- mg per litre, ordinary supply
```

### `families.lean` — 8 definition(s), 12 theorem(s)

```lean
def primesUpTo30 : List Nat := [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))
def gcdFuel : Nat → Nat → Nat → Nat
def gcd ' (a b : Nat) : Nat := gcdFuel (a + b + 1) a b
def totient (n : Nat) : Nat := ((List.range n).filter (fun a => gcd' a n == 1)).length
def popcount (n : Nat) : Nat := ((List.range 16).filter (fun i => (n >>> i) % 2 == 1)).length
def settledHere : Nat := 11
```

### `fnv.lean` — 13 definition(s), 13 theorem(s)

```lean
def xorF : Nat → Nat → Nat → Nat
def M32 : Nat := 4294967296
def xor32 (a b : Nat) : Nat := xorF 33 a b
def shr (n k : Nat) : Nat := n / (2 ^ k)
def mul32 (a b : Nat) : Nat := (a * b) % M32
def FNV_OFFSET : Nat := 2166136261   -- 0x811c9dc5
def FNV_PRIME : Nat := 16777619     -- 0x01000193
def MIX1 : Nat := 2246822507         -- 0x85ebca6b
def MIX2 : Nat := 3266489909         -- 0xc2b2ae35
def step (h c : Nat) : Nat :=
def avalanche (h : Nat) : Nat :=
def hash32 (seed : Nat) (cs : List Nat) : Nat := avalanche (cs.foldl step (xor32 FNV_OFFSET seed))
def settledHere : Nat := 12
```

### `index.lean` — 5 definition(s), 11 theorem(s)

```lean
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)  -- DERIVED: d has an inverse mod 9
def refl (d : Nat) : Nat := 10 - d                                            -- the reflection (= division by zero)
def orbit (k : Nat) : Nat := (2 ^ k) % 9                                      -- the doubling sequence 2^k, computed
def span : List Nat := (List.range 6).map orbit                               -- the doubling span (one period), computed
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
```

### `involution.lean` — 7 definition(s), 8 theorem(s)

```lean
def matchings : Nat → List Nat → List (List (Nat × Nat))
def nine : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8]
def all : List (List (Nat × Nat)) := matchings 10 nine
def fixedPoints (m : List (Nat × Nat)) : Nat := (m.filter (fun p => p.1 == p.2)).length
def swaps (m : List (Nat × Nat)) : List (Nat × Nat) := m.filter (fun p => p.1 != p.2)
def constantSum (m : List (Nat × Nat)) : Bool :=
def coinLike : List (Nat × Nat) := [(0, 0), (1, 8), (2, 7), (3, 6), (4, 5)]
```

### `ledgerclaims.lean` — 3 definition(s), 8 theorem(s)

```lean
def rounds : Nat → Nat → Nat
def saving (value verify : Nat) : Nat := value - verify
def addr4 (x : Nat) : Nat := x % 16
```

### `mechanical.lean` — 2 definition(s), 103 theorem(s)

```lean
def M9 (n : Nat) : Nat := n % 9
def DR (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9
```

### `merkaba.lean` — 6 definition(s), 8 theorem(s)

```lean
def axis : List Nat := [3, 6, 0]   -- {3,6,9} — the spindle
def tetA : List Nat := [1, 4, 7]
def tetB : List Nat := [2, 5, 8]
def dbl (l : List Nat) : List Nat := l.map (fun d => m9 (2 * d))
def tri (n : Nat) : Nat := n * (n + 1) / 2
def sumTri (n : Nat) : Nat := ((List.range' 1 n).map tri).foldl (· + ·) 0
```

### `merkle.lean` — 15 definition(s), 9 theorem(s)

```lean
def hexDigit (n : Nat) : Nat := if n < 10 then 48 + n else 87 + n
def byteHex (b : Nat) : List Nat := [hexDigit (b / 16), hexDigit (b % 16)]
def uuidChars (bs : List Nat) : List Nat :=
def merge (a b : List Nat) : List Nat := toUuidBytes (uuidChars a ++ [58] ++ uuidChars b)
def leB : List Nat → List Nat → Bool
def insB (a : List Nat) : List (List Nat) → List (List Nat)
def sortB : List (List Nat) → List (List Nat)
def pairUp : List (List Nat) → List (List Nat)
def foldF : Nat → List (List Nat) → List (List Nat)
def EMPTY_SEED : List Nat := [101, 109, 112, 116, 121, 45, 109, 105, 110, 100]  -- "empty-mind"
def merkleFold (leaves : List (List Nat)) : List Nat :=
def A : List Nat := toUuidBytes [97]     -- address of "a"
def C : List Nat := toUuidBytes [99]     -- address of "c"
def B : List Nat := toUuidBytes [98]     -- address of "b"
def settledHere : Nat := 8
```

### `nim.lean` — 7 definition(s), 8 theorem(s)

```lean
def xorN (a b : Nat) : Nat := xorF 33 a b
def N : Nat := 6
def moves (a b : Nat) : List (Nat × Nat) :=
def lost : Nat → Nat → Nat → Bool
def isLost (a b : Nat) : Bool := lost (a + b + 1) a b
def mex (s : List Nat) : Nat := ((List.range (s.length + 1)).filter (fun m => ! s.contains m)).headD 0
def grundy1 : Nat → Nat → Nat
```

### `priorart.lean` — 6 definition(s), 10 theorem(s)

```lean
abbrev Source := Nat × Nat × Bool
def idOf (s : Source) : Nat  := s.1
def kindOf (s : Source) : Nat  := s.2.1
def novelty (s : Source) : Bool := s.2.2
def sources : List Source :=
def noveltyEstablished : Nat := 0
```

### `quantum.lean` — 8 definition(s), 9 theorem(s)

```lean
def insertEverywhere (x : Nat) : List Nat → List (List Nat)
def perms : List Nat → List (List Nat)
def ins (x : Nat) : List Nat → List Nat
def sort : List Nat → List Nat
def receipt (l : List Nat) : Nat := (sort l).foldl (fun a b => (a * 2 + b) % 9) 0
def naive (l : List Nat) : Nat := l.foldl (fun a b => (a * 2 + b) % 9) 0
def pairsOverNine : List (List Nat) :=
def settledHere : Nat := 8
```

### `reversal.lean` — 6 definition(s), 9 theorem(s)

```lean
def digitsF : Nat → Nat → List Nat
def digits (n : Nat) : List Nat := if n == 0 then [0] else digitsF (n + 1) n
def reverseNum (n : Nat) : Nat := (digits n).foldl (fun a d => a * 10 + d) 0
def digitSum (n : Nat) : Nat := (digits n).foldl (· + ·) 0
def isPrime (n : Nat) : Bool := n > 1 && (List.range n).all (fun d => d < 2 || n % d != 0)
def settledHere : Nat := 8
```

### `rights.lean` — 7 definition(s), 8 theorem(s)

```lean
abbrev Instrument := Nat × Nat × Bool × Bool
def idOf (r : Instrument) : Nat  := r.1
def kindOf (r : Instrument) : Nat  := r.2.1
def auto (r : Instrument) : Bool := r.2.2.1
def claim (r : Instrument) : Bool := r.2.2.2
def instruments : List Instrument :=
def settledHere : Nat := 7
```

### `sequences.lean` — 5 definition(s), 8 theorem(s)

```lean
def fib : Nat → Nat
def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))
def andF : Nat → Nat → Nat → Nat
def andN (a b : Nat) : Nat := andF 33 a b
```

### `speed.lean` — 3 definition(s), 8 theorem(s)

```lean
def recomputeUs : Nat := 21582900   -- folding 2^20 leaves
def verifyUs : Nat := 38         -- walking the 20-node inclusion path
def nsPerVerify : Nat := 38000      -- the same verify, in nanoseconds
```

### `split.lean` — 8 definition(s), 19 theorem(s)

```lean
def tokens : List Nat := [0, 12, 3, 45, 6, 78, 9]
def singles : List Nat := [0, 3, 6, 9]
def pairs : List Nat := [12, 45, 78]
def unitsOf9 : List Nat := [1, 2, 4, 5, 7, 8]
def isUnit9 (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)
def coins : Nat := 2
def coinStep : Nat := 3 * coins
def sealBits : Nat := 128
```

### `theorems.lean` — 1 definition(s), 8 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d  -- the shared reflection r(d) = 10 − d (the ½/heart-analogue centre)
```

### `z9.lean` — 7 definition(s), 21 theorem(s)

```lean
def B : Nat := 9
def m9 (n : Nat) : Nat := n % B
def isUnit (d : Nat) : Bool := (List.range B).any (fun e => m9 (d * e) == 1)
def units : List Nat := (List.range B).filter isUnit
def pow9 (b e : Nat) : Nat := m9 (b ^ e)
def orbit (k : Nat) : Nat := m9 (2 ^ k)
def settledHere : Nat := 20
```

### `z9plus.lean` — 16 definition(s), 32 theorem(s)

```lean
def m9 (n : Nat) : Nat := n % 9
def R : List Nat := List.range 9
def pw (b e : Nat) : Nat := m9 (b ^ e)
def generates (g : Nat) : Bool := ((List.range' 1 6).map (fun k => pw g k)).eraseDups.length == 6
def dr (n : Nat) : Nat := if n == 0 then 0 else if m9 n == 0 then 9 else m9 n
def ord (u : Nat) : Nat := ((List.range' 1 6).filter (fun k => pw u k == 1)).headD 0
def refl (d : Nat) : Nat := 10 - d
def orbit6 : List Nat := (List.range 6).map (fun k => pw 2 k)
def dbl (d : Nat) : Nat := m9 (d * 2)
def rfl9 (d : Nat) : Nat := m9 (10 - d)
def grow (s : List Nat) : List Nat := (s ++ s.map dbl ++ s.map rfl9).eraseDups
def closure : Nat → List Nat → List Nat
def fib : Nat → Nat
def fib9 (n : Nat) : Nat := m9 (fib n)
def gcdF : Nat → Nat → Nat → Nat
def gcd9 (a b : Nat) : Nat := gcdF (a + b + 1) a b
```

---

**511** declarations, **0** axiom dependencies, **209** definitions they rest on.
A content-address proves integrity, not truth, and an axiom index proves neither: it states what was
assumed, so a reader can disagree with the assumptions rather than guess at them. `0/7`.
