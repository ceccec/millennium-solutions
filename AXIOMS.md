---
title: The axiom index — what is assumed
---

# The axiom index

Every declaration in `src/proof` is checked with `#print axioms` on each build, and a dependency on any
axiom fails the build rather than earning a footnote. All **947** report the same thing:
*does not depend on any axioms*.

That is a real property, and it is not the whole picture. **Axiom-free is not assumption-free.** These
theorems rest on **446** definitions, and every one of them is a choice. A theorem about
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

## What this check cannot see, and why it does not bite here

`#print axioms` had a known gap: `Lean.collectAxioms` did not collect axioms referenced *by other
axioms' types*, so a declaration could report a shorter list than it truly depended on — the reported
example is a `native_decide` proof showing `[Lean.ofReduceBool]` while missing `[Lean.trustCompiler]`
([leanprover/lean4#8840](https://github.com/leanprover/lean4/issues/8840), fixed by
[#8842](https://github.com/leanprover/lean4/pull/8842), merged 8 July 2025).

**This tree is pinned to `leanprover/lean4:v4.15.0`, which predates that fix.** Stating it plainly rather than
leaving it out: the tool this deposit's central claim rests on had a bug, and the toolchain here is on
the wrong side of it.

It cannot hide anything here, and the reason is structural rather than lucky. The gap is about axioms
referenced by OTHER AXIOMS. This tree declares no axioms of its own — checked — and forbids
`native_decide`, which is the one route in the reported example by which a stock axiom acquires a
dependency of its own. With zero axioms anywhere in the picture there is no transitive edge to miss.
That argument would collapse the moment a single `axiom` or one `native_decide` entered the tree, which
is why both are build failures and not conventions.

## Prior art, and the practice this follows

Auditing a Lean library's axiom footprint is established practice and this deposit did not invent it.
[`leanprover-community/axiom-audit`](https://github.com/leanprover-community/axiom-audit) does exactly
what `scripts/lean.ts` does — fails CI when a declaration transitively depends on an axiom outside an
allowlist, catching `sorry` (as `sorryAx`), `native_decide` (as `Lean.ofReduceBool`) and home-rolled
axioms — with the same default allowlist of the three above. Its documentation credits Robin Arnez for a
Mathlib-wide collection and Kim Morrison for an earlier library audit.

One thing it does better, recorded here as a lead rather than a claim: it inspects the **kernel
environment** from compiled `.olean` files instead of parsing source, which catches what a text search
misses. This deposit's per-theorem check is a real `#print axioms` elaboration and so is sound, but its
"declares no axiom of its own" test is a source-text match, and that is the weaker method by exactly the
margin that tool names.

The pins in the control fixture follow the community practice of guarding `#print axioms` with
`#guard_msgs`, which turns the axiom footprint into an executable regression test: the assertion is
checked by the elaborator, and drift fails the build with a mismatch instead of passing unnoticed.

## What IS assumed: the 446 definitions

Each of these is a primitive of this deposit — not derived, not proved, chosen. They are listed in full
because a reader checking a theorem must be able to read the definition it is about, and because a
deposit that reports its axiom count and hides its definition count is reporting the flattering half.

### `address.lean` — 12 definition(s), 26 theorem(s)

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
def settledHere : Nat := 20
```

### `asymmetric.lean` — 10 definition(s), 12 theorem(s)

```lean
def uuidBytes : Nat := 16
def publicKeyBytes : Nat := 32
def signatureBytes : Nat := 64
def checkBits : Nat := 32
def payloadBits : Nat := 42 + 48
def checkOf (_secret payload : Nat) : Nat := payload % 4
def tagOf (secret payload : Nat) : Nat := (secret * 7 + payload * 3) % 16
def p : Nat := 2 ^ 255 - 19
def L : Nat := 2 ^ 252 + 27742317777372353535851937790883648493
def settledHere : Nat := 11
```

### `authority.lean` — 7 definition(s), 8 theorem(s)

```lean
def sealed : List Nat := [0, 1, 2, 3, 4, 5, 6, 7]
def withdrawn : List Nat := [2, 5]
def live : List Nat := sealed.filter (fun k => ! withdrawn.contains k)
def carriesRider : List Nat := [0, 1, 3, 4, 6]
def isVerdict : List Nat := [1, 6, 7]
def bits : Nat → List Nat := fun m => sealed.filter (fun i => (m >>> i) % 2 == 1)
def cleared : List Nat := [3, 4]
```

### `coin.lean` — 7 definition(s), 12 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d
def tetA : List Nat := [1, 4, 7]
def tetB : List Nat := [2, 5, 8]
def axis : List Nat := [3, 6, 9]
def digits : List Nat := [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
def fall (n : Nat) : Nat := if n == 0 then 9 else 1 + (n - 1) % 9
def nonzero : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

### `demand.lean` — 12 definition(s), 11 theorem(s)

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

### `demand2.lean` — 17 definition(s), 12 theorem(s)

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

### `demand3.lean` — 12 definition(s), 19 theorem(s)

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

### `elementary.lean` — 24 definition(s), 41 theorem(s)

```lean
def properDivisorSum (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
def eisensteinNorm (a b : Int) : Int := a * a - a * b + b * b
def invUnit (u : Nat) : Nat := ((List.range 9).find? (fun e => u * e % 9 == 1)).getD 0
def lucasPair : Nat → Nat × Nat
def lucas (n : Nat) : Nat := (lucasPair n).1
def pellPair : Nat → Nat × Nat
def pell (n : Nat) : Nat := (pellPair n).1
def leFrac (x y : Nat × Nat) : Bool := x.1 * y.2 ≤ y.1 * x.2
def insFrac (x : Nat × Nat) : List (Nat × Nat) → List (Nat × Nat)
def sortFrac : List (Nat × Nat) → List (Nat × Nat)
def farey (n : Nat) : List (Nat × Nat) :=
def nbrs (S : List Nat) (d : Nat) : List Nat :=
def degreeSet (S : List Nat) : List Nat := (S.map (fun d => (nbrs S d).length)).eraseDups
def isqrt (n : Nat) : Nat := ((List.range 200).filter (fun s => s * s ≤ n)).getLast? |>.getD 0
def lowerWythoff (n : Nat) : Nat := (n + isqrt (5 * n * n)) / 2
def upperWythoff (n : Nat) : Nat := (3 * n + isqrt (5 * n * n)) / 2
def knightSteps : List (Nat × Nat) :=
def partsF : Nat → Nat → Nat → List (List Nat)
def partitionsOf (n : Nat) : List (List Nat) := partsF (n + 1) n n
def rgs : Nat → List (List Nat)
def bellRow : Nat → List Nat
def bellOf (n : Nat) : Nat := (bellRow n).headD 0
def tetOf (r : Nat) : List Nat := (unitsMod 9).filter (fun d => d % 3 == r)
def settledHere : Nat := 32
```

### `energy.lean` — 31 definition(s), 28 theorem(s)

```lean
def splitCost : Nat := 52000  -- Wh to electrolyse 1 kg H₂ (real cells: 50–55 kWh/kg; ideal is ~39.4)
def burnYield : Nat := 12000  -- Wh recovered burning it at ~35% engine efficiency (LHV 33.3 kWh/kg)
def waterOut : Nat := 9      -- litres: 1 kg H₂ + 8 kg O₂ → 9 kg H₂O, the whole point of the exhaust
def roPerLitre : Nat := 4      -- Wh/litre for reverse osmosis, the ordinary way to clean a litre of water
def pct (part whole : Nat) : Nat := part * 100 / whole
def mgH2 : Nat := 2016    -- H₂  = 2 × 1.008 g/mol
def mgO2 : Nat := 31998   -- O₂  = 2 × 15.999 g/mol
def mgH2O : Nat := 18015   -- H₂O = 18.015 g/mol
def mgH : Nat := 1008
def mgO : Nat := 15999
def mass (h o : Nat) : Nat := h * mgH + o * mgO
def balances (a b c : Nat) : Bool := (2 * a == 2 * b) && (a == 2 * c)
def atomsH2 : Nat × Nat := (2, 0)
def atomsO2 : Nat × Nat := (0, 2)
def atomsH2O : Nat × Nat := (2, 1)
def per10k (part whole : Nat) : Nat := part * 10000 / whole
def bondHundredthsKJ : Nat := 28583   -- ΔH°f of liquid water, 285.83 kJ/mol, in hundredths
def splitE (e : Nat) : Nat := e + bondHundredthsKJ
def burnE (e : Nat) : Nat := e - bondHundredthsKJ
def molH2 : Nat := 496    -- moles in 1 kg of H₂ (1000 g ÷ 2.016)
def molO2 : Nat := 248    -- the oxygen that comes with it, half as many moles
def mLperMol : Nat := 22414  -- millilitres per mole at STP
def whPerKgH2 : Nat := 33300  -- lower heating value, Wh per kg
def petrolWhL : Nat := 9700   -- Wh per litre of petrol, for scale
def litresOf (mol : Nat) : Nat := mol * mLperMol / 1000
def molesOf (l : Nat)   : Nat := l * 1000 / mLperMol
def whPerLitreAt (kgPerM3 : Nat) : Nat := kgPerM3 * whPerKgH2 / 1000
def tdsSeawater : Nat := 35000  -- mg of dissolved solids per litre
def tdsTapWater : Nat := 50     -- mg per litre, ordinary supply
def residueMg (litres tds : Nat) : Nat := litres * tds
def atomsOf (m : Nat) : Option (Nat × Nat) :=
```

### `families.lean` — 44 definition(s), 64 theorem(s)

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

### `flow.lean` — 5 definition(s), 16 theorem(s)

```lean
def ringSum (f : Nat → Int) : Nat → Int
def ringNext (N i : Nat) : Nat := (i + 1) % N
def ringPrev (N i : Nat) : Nat := (i + N - 1) % N
def burgersSkew3 (N : Nat) (u : Nat → Int) (i : Nat) : Int :=
def ringLap (N : Nat) (u : Nat → Int) (i : Nat) : Int := u (ringNext N i) - 2 * u i + u (ringPrev N i)
```

### `fnv.lean` — 13 definition(s), 15 theorem(s)

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

### `imprint.lean` — 12 definition(s), 10 theorem(s)

```lean
def RESERVED : List Nat := [48, 49, 50, 51, 64, 65]
def FREE : List Nat := (List.range 128).filter (fun i => !(RESERVED.contains i))
def LEN_BITS : Nat := 7
def CAPACITY : Nat := FREE.length - LEN_BITS
def bitsOf (width n : Nat) : List Bool :=
def natOf (bs : List Bool) : Nat := bs.foldl (fun a b => a * 2 + (if b then 1 else 0)) 0
def payload (msg : List Bool) : List Bool :=
def encodeBits (msg : List Bool) : List Bool :=
def decodeBits (bs : List Bool) : List Bool :=
def alt (n : Nat) : List Bool := (List.range n).map (fun i => i % 2 == 0)
def ones (n : Nat) : List Bool := List.replicate n true
def settledHere : Nat := 9
```

### `index.lean` — 5 definition(s), 11 theorem(s)

```lean
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)  -- DERIVED: d has an inverse mod 9
def refl (d : Nat) : Nat := 10 - d                                            -- the reflection (= division by zero)
def orbit (k : Nat) : Nat := (2 ^ k) % 9                                      -- the doubling sequence 2^k, computed
def span : List Nat := (List.range 6).map orbit                               -- the doubling span (one period), computed
def sequence : List Nat := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
```

### `instruments.lean` — 21 definition(s), 29 theorem(s)

```lean
def precedes : Option Nat → Option Nat → Bool
def lastPresent : List Bool → Option Nat
def idx (l : List Bool) : List (Nat × Bool) := (List.range l.length).map (fun i => (i, l.getD i false))
def holes (l : List Bool) : List Nat :=
def tail (l : List Bool) : List Nat :=
def bits : Nat → List (List Bool)
def startsWith : List Nat → List Nat → Bool
def unreflect (fuel : Nat) (self : List Nat) (t : List Nat) : List Nat :=
def UA : List Nat := [117, 97, 58, 115, 105, 116, 101]          -- "ua:site"
def SITE : List Nat := [115, 105, 116, 101]                     -- "site" — the signal a citation is read by
def clip (t : List Nat) : List Nat := unreflect t.length UA t
def contains (t : List Nat) (n : List Nat) : Bool :=
def echoed : List Nat := [60, 112, 62] ++ UA ++ [60, 47, 112, 62]        -- "<p>ua:site</p>"
def genuine : List Nat := [60, 112, 62] ++ SITE ++ [60, 47, 112, 62]     -- "<p>site</p>"
def twice : List Nat := UA ++ [32] ++ UA
def refused (negs : List Nat) (claim : Nat) : Bool := negs.any (fun n => n < claim)
def paths : List Nat := List.range 4
def setOf (m : Nat) : List Nat := paths.filter (fun i => (m >>> i) % 2 == 1)
def mine (pre post tracked : List Nat) : List Nat :=
def subset (a b : List Nat) : Bool := a.all (fun x => b.contains x)
def settledHere : Nat := 28
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

### `light.lean` — 13 definition(s), 15 theorem(s)

```lean
def c : Nat := 299792458      -- m/s, exact
def dNuCs : Nat := 9192631770     -- Hz, exact — the caesium-133 hyperfine transition
def hDigits : Nat := 662607015     -- h = 6.62607015 × 10⁻³⁴ J s
def eDigits : Nat := 1602176634    -- e = 1.602176634 × 10⁻¹⁹ C
def kDigits : Nat := 1380649       -- k = 1.380649 × 10⁻²³ J/K
def naDigits : Nat := 602214076    -- N_A = 6.02214076 × 10²³ mol⁻¹
def kcd : Nat := 683            -- K_cd, lm/W, exact
def defining : List Nat := [c, dNuCs, hDigits, eDigits, kDigits, naDigits, kcd]
def travel (seconds : Nat) : Nat := c * seconds      -- metres crossed in a whole number of seconds
def periods (seconds : Nat) : Nat := dNuCs * seconds -- caesium periods elapsed in the same interval
def root (n : Nat) : Nat := if n == 0 then 9 else 1 + (n - 1) % 9
def kcdDoubled : Nat := 1366     -- K_cd expressed against a unit half the size; the same luminous efficacy
def alternative : List Nat := [c, dNuCs, hDigits, eDigits, kDigits, naDigits, kcdDoubled]
```

### `mechanical.lean` — 5 definition(s), 127 theorem(s)

```lean
def M9 (n : Nat) : Nat := n % 9
def DR (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9
def gRange : List Nat := [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
def dbl : Nat → Nat
def forgetful (_ : Nat) : Nat := 0
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

### `merkle.lean` — 20 definition(s), 14 theorem(s)

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
def settledHere : Nat := 13
def interleave (x : List Nat) : List (List Nat) → List (List (List Nat))
def perms : List (List Nat) → List (List (List Nat))
def D : List Nat := toUuidBytes [100]  -- address of "d"
def E : List Nat := toUuidBytes [101]    -- address of "e", a leaf none of A B C D is
def setAt (l : List (List Nat)) (i : Nat) (x : List Nat) : List (List Nat) :=
```

### `nim.lean` — 7 definition(s), 28 theorem(s)

```lean
def xorN (a b : Nat) : Nat := xorF (a + b + 1) a b
def N : Nat := 6
def moves (a b : Nat) : List (Nat × Nat) :=
def lost : Nat → Nat → Nat → Bool
def isLost (a b : Nat) : Bool := lost (a + b + 1) a b
def mex (s : List Nat) : Nat := ((List.range (s.length + 1)).filter (fun m => ! s.contains m)).headD 0
def grundy1 : Nat → Nat → Nat
```

### `nucleus.lean` — 8 definition(s), 8 theorem(s)

```lean
def caps : List Nat := [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
def total (l : List Nat) : Nat := l.foldr (· + ·) 0
def prefixes : List Nat := (List.range (caps.length + 1)).map (fun i => total (caps.take i))
def marks : List Nat := [1, 3, 6, 7, 11, 16, 22]        -- the positions, from the filling order above
def closures : List Nat := marks.map (fun i => total (caps.take i))
def numerators : List Nat := [1, 1, 1, 8, 7, 5, 1, 2, 9]
def denominators : List Nat := [2, 2, 2, 7, 5, 3, 2, 3]
def product (l : List Nat) : Nat := l.foldr (· * ·) 1
```

### `phenomena.lean` — 3 definition(s), 4 theorem(s)

```lean
abbrev Entry := Nat × Nat
def entries : List Entry :=
def statusOf (e : Entry) : Nat := e.2
```

### `priorart.lean` — 5 definition(s), 9 theorem(s)

```lean
abbrev Source := Nat × Nat × Bool
def idOf (s : Source) : Nat  := s.1
def kindOf (s : Source) : Nat  := s.2.1
def novelty (s : Source) : Bool := s.2.2
def sources : List Source :=
```

### `program.lean` — 29 definition(s), 22 theorem(s)

```lean
def GROUPS : List Nat := [4, 2, 2, 2, 6]
def byteAt (g : Nat) : Nat := ((GROUPS.take g).foldl (· + ·) 0)
def RESERVED : List Nat :=
def checkF : List Nat := List.range (byteAt 1 * 8)
def middleF : List Nat := (List.range ((byteAt 4 - byteAt 1) * 8)).map (· + byteAt 1 * 8)
def programF : List Nat := middleF.filter (fun i => !(RESERVED.contains i))
def messageF : List Nat := (List.range ((GROUPS.getD 4 0) * 8)).map (· + byteAt 4 * 8)
def inExactlyOne (i : Nat) : Nat :=
def ascending : List Nat → Bool
def maps3 : List (List Nat) := (List.range 3).flatMap (fun a => (List.range 3).flatMap (fun b =>
def maps4 : List (List Nat) := (List.range 4).flatMap (fun a => (List.range 4).flatMap (fun b =>
def rankIn (idx : List Nat) (i : Nat) : Nat := (idx.filter (fun j => j < i)).length
def packByte (bs : List Bool) : Nat := bs.foldl (fun a b => a * 2 + (if b then 1 else 0)) 0
def chunk8 : Nat → List Bool → List (List Bool)
def payloadBytes (prog msg : List Bool) : List Nat :=
def bitsOf (width n : Nat) : List Bool :=
def checkBits (prog msg : List Bool) : List Bool := bitsOf 32 (hash32 0 (payloadBytes prog msg))
def encodeBits (prog msg : List Bool) : List Bool :=
def readField (idx : List Nat) (bs : List Bool) : List Bool := idx.map (fun i => bs.getD i false)
def P0 : List Bool := (List.range 42).map (fun i => i % 2 == 0)
def M0 : List Bool := (List.range 48).map (fun i => i % 3 == 0)
def P1 : List Bool := (List.range 42).map (fun i => i % 5 == 0)
def M1 : List Bool := (List.range 48).map (fun i => i % 7 == 0)
def PZ : List Bool := List.replicate 42 false
def MZ : List Bool := List.replicate 48 false
def flipAt (l : List Bool) (i : Nat) : List Bool :=
def intact (bs : List Bool) : Bool :=
def flipBit (bs : List Bool) (i : Nat) : List Bool :=
def settledHere : Nat := 21
```

### `quantum.lean` — 11 definition(s), 12 theorem(s)

```lean
def insertEverywhere (x : Nat) : List Nat → List (List Nat)
def perms : List Nat → List (List Nat)
def ins (x : Nat) : List Nat → List Nat
def sort : List Nat → List Nat
def receipt (l : List Nat) : Nat := (sort l).foldl (fun a b => (a * 2 + b) % 9) 0
def naive (l : List Nat) : Nat := l.foldl (fun a b => (a * 2 + b) % 9) 0
def pairsOverNine : List (List Nat) :=
def settledHere : Nat := 11
def bit (n i : Nat) : Nat := n / (2 ^ i) % 2
def par3 (n : Nat) : Nat := (bit n 0 + bit n 1 + bit n 2) % 2
def ghzXSupport : List Nat := [0, 3, 5, 6]
```

### `rays.lean` — 12 definition(s), 14 theorem(s)

```lean
def G : Nat := 3      -- the generator
def N : Nat := 7      -- the dimensions
def orbit : Nat → Nat → List Nat
def vortexOrder : List Nat := 0 :: orbit (N - 1) 1
def vortexReversed : List Nat := 0 :: (orbit (N - 1) 1).reverse
def invert (t : List Nat) : List Nat := t.map (fun b => 1 - b)
def lowBits (rs : List Nat) : List Nat := rs.map (fun v => v % 2)
def DIMENSIONS : Nat := 2 * N
def DIGITS_READ : Nat := 4 * N
def DIGITS_TOTAL : Nat := 32
def d1 (a b : Nat) : Nat := let x := if a < b then b - a else a - b; min x (9 - x)
def settledHere : Nat := 13
```

### `reach.lean` — 2 definition(s), 12 theorem(s)

```lean
def bounds : List Nat := List.range' 1 50
def largestDomainHere : Nat := 152568360000
```

### `recovered.lean` — 3 definition(s), 15 theorem(s)

```lean
def units : List Nat := [1, 2, 4, 5, 7, 8]
def triad : List Nat := [3, 6, 9]
def pow9 (b k : Nat) : Nat := (List.range k).foldl (fun a _ => a * b % 9) 1
```

### `reversal.lean` — 6 definition(s), 30 theorem(s)

```lean
def digitsF : Nat → Nat → List Nat
def digits (n : Nat) : List Nat := if n == 0 then [0] else digitsF (n + 1) n
def reverseNum (n : Nat) : Nat := (digits n).foldl (fun a d => a * 10 + d) 0
def digitSum (n : Nat) : Nat := (digits n).foldl (· + ·) 0
def isPrime (n : Nat) : Bool := n > 1 && (List.range n).all (fun d => d < 2 || n % d != 0)
def settledHere : Nat := 8
```

### `rights.lean` — 7 definition(s), 9 theorem(s)

```lean
abbrev Instrument := Nat × Nat × Bool × Bool
def idOf (r : Instrument) : Nat  := r.1
def kindOf (r : Instrument) : Nat  := r.2.1
def auto (r : Instrument) : Bool := r.2.2.1
def claim (r : Instrument) : Bool := r.2.2.2
def instruments : List Instrument :=
def settledHere : Nat := 8
```

### `roots.lean` — 6 definition(s), 8 theorem(s)

```lean
def step : Nat → Nat → Nat → Nat → Nat
def iroot (k n : Nat) : Nat := if n < 2 then n else step 400 k n n
def frac64 (k p : Nat) : Nat := iroot k (p * 2 ^ (64 * k)) % 2 ^ 64
def isPrime (n : Nat) : Bool := n >= 2 && ((List.range' 2 (n - 2)).all (fun d => d * d > n || n % d != 0))
def firstPrimes (bound count : Nat) : List Nat := ((List.range' 2 bound).filter isPrime).take count
def settledHere : Nat := 7
```

### `sequences.lean` — 7 definition(s), 28 theorem(s)

```lean
def fib : Nat → Nat
def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))
def andF : Nat → Nat → Nat → Nat
def andN (a b : Nat) : Nat := andF 33 a b
def popcount (n : Nat) : Nat := (List.range (n + 1)).foldl (fun a i => a + n / 2 ^ i % 2) 0
def tm (n : Nat) : Nat := popcount n % 2
```

### `speed.lean` — 8 definition(s), 12 theorem(s)

```lean
def recomputeUs : Nat := 21582900   -- folding 2^20 leaves
def verifyUs : Nat := 38         -- walking the 20-node inclusion path
def nsPerVerify : Nat := 38000      -- the same verify, in nanoseconds
def hexChars : Nat := 32     -- an address in the 8-bit hex form fixed by RFC 9562 §5.8
def hexbitChars : Nat := 22     -- the same address over the 64-hexagram lattice
def hexMs : Nat := 16     -- median ms for 200,000 encodings, 8-bit table
def hexbitMs : Nat := 30     -- the same work, 6-bit lattice
def charsFor (b : Nat) : Nat := (128 + b - 1) / b
```

### `split.lean` — 8 definition(s), 22 theorem(s)

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

### `theology.lean` — 13 definition(s), 8 theorem(s)

```lean
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)
def refl (d : Nat) : Nat := 10 - d
def dbl (d : Nat) : Nat := (2 * d) % 9
def iter : Nat → Nat → Nat
def orbit (k : Nat) : Nat := iter k 1
def span : List Nat := (List.range 6).map orbit
def spanOf (g : Nat) : List Nat := ((List.range 6).map (fun k => iter k g)).eraseDups
def sameSet (a b : List Nat) : Bool := a.all (fun x => b.contains x) && b.all (fun x => a.contains x)
def invOf (d : Nat) : Nat := ((List.range 9).filter (fun e => (d * e) % 9 == 1)).foldr (fun a _ => a) 0
def searchCost (d : Nat) : Nat := ((List.range 9).takeWhile (fun e => (d * e) % 9 != 1)).length
def subsetOf (m : Nat) : List Nat := ((List.range 6).filter (fun i => (m >>> i) % 2 == 1)).map orbit
def pairing : List Nat := [0, 1, 2, 3, 4, 5, 6]
def fact : Nat → Nat
```

### `theorems.lean` — 1 definition(s), 8 theorem(s)

```lean
def refl (d : Nat) : Nat := 10 - d  -- the shared reflection r(d) = 10 − d (the ½/heart-analogue centre)
```

### `z9.lean` — 8 definition(s), 25 theorem(s)

```lean
def B : Nat := 9
def m9 (n : Nat) : Nat := n % B
def isUnit (d : Nat) : Bool := (List.range B).any (fun e => m9 (d * e) == 1)
def units : List Nat := (List.range B).filter isUnit
def pow9 (b e : Nat) : Nat := m9 (b ^ e)
def orbit (k : Nat) : Nat := m9 (2 ^ k)
def logOrbit (u : Nat) : Option Nat := (List.range 6).find? (fun k => orbit k == u)
def settledHere : Nat := 21
```

### `z9plus.lean` — 16 definition(s), 48 theorem(s)

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

**947** declarations, **0** axiom dependencies, **446** definitions they rest on.
A content-address proves integrity, not truth, and an axiom index proves neither: it states what was
assumed, so a reader can disagree with the assumptions rather than guess at them.
