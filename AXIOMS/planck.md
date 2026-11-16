---
title: "Definitions in planck.lean"
---

[← axiom index](/AXIOMS)

## `planck.lean` — 50 definition(s), 35 theorem(s)

```lean
def ellP : Nat := 1616255       -- 1.616255(18) e-35 m
def ellPUnc : Nat := 18
def tP : Nat := 5391247         -- 5.391247(60) e-44 s
def tPUnc : Nat := 60
def mP : Nat := 2176434         -- 2.176434(24) e-8 kg
def mPUnc : Nat := 24
def bigG : Nat := 667430        -- 6.67430(15) e-11 m^3 kg^-1 s^-2
def bigGUnc : Nat := 15
def ppm (digits unc : Nat) : Nat := unc * 1000000 / digits
def window : List Nat := (List.range (2 * ellPUnc + 1)).map (fun i => ellP - ellPUnc + i)
def dr (n : Nat) : Nat := if n = 0 then 0 else 1 + (n - 1) % 9
def orbit : List Nat := [1, 2, 4, 8, 7, 5]
def axis : List Nat := [3, 6, 9]
def seeds : List Nat := [1, 2, 3, 4, 5, 6, 7, 8, 9, 108, 432, 1836, 5040]
def products : List Nat :=
abbrev Dim := Int × Int × Int
def dimEllP : Dim := (1, 1, -3)
def dimTP : Dim := (1, 1, -5)
def dimMP : Dim := (1, -1, 1)
def dmul (x y : Dim) : Dim := (x.1 + y.1, x.2.1 + y.2.1, x.2.2 + y.2.2)
def ddiv (x y : Dim) : Dim := (x.1 - y.1, x.2.1 - y.2.1, x.2.2 - y.2.2)
def planckDims : List Dim := [dimEllP, dimTP, dimMP]
def gPpm (d : Dim) : Nat := d.2.1.natAbs * 11
def cDefined : Nat := 299792458
def ratioFromDigits : Nat := ellP * 1000000000 / tP
def strip (p : Nat) : Nat → Nat → Nat
def latticePrimes : List Nat := [2, 3, 5, 7, 17]
def smoothPart (n : Nat) : Nat := latticePrimes.foldl (fun m p => strip p 40 m) n
def reachable (n : Nat) : Bool := smoothPart n == 1
def ppm4 (digits unc : Nat) : Nat := unc * 10000000000 / digits
def ellPInches : Nat := ellP * 10000000 / 254
def halfUlpPpm4 (digits : Nat) : Nat := 5000000000 / digits
def displayBudget : Nat := (halfUlpPpm4 ellP + halfUlpPpm4 tP) * cDefined / 10000000000
def hbar : Nat := 1054571817    -- 1.054571817 e-34 J s, CODATA's rounding of h / 2π
def missPpb (a b : Nat) : Nat := (if a > b then a - b else b - a) * 1000000000 / b
def quantumLhs : Nat := ellP * mP * cDefined          -- scaled 10^-55
def quantumRhs : Nat := hbar * 1000000000000          -- 10^-43 brought to 10^-55
def gravityLhs : Nat := ellP * cDefined * cDefined              -- 10^-41
def gravityRhs : Nat := mP * bigG * 100000000000                -- 10^-14 · 10^-16 = 10^-30, × 10^11 → 10^-41
def acoustic : Nat := 432
def tPtimesAcoustic : Nat := tP * acoustic        -- scaled 10^-50, as tP is
def cSq : Nat := cDefined * cDefined                      -- 8.9875517873681764e16 m²/s², exact
def eCharge : Nat := 1602176634                           -- 1.602176634e-19 C, SI-defined (light.lean)
def planckEnergyMantissa : Nat := mP * cSq / eCharge      -- ×10⁵ GeV
def massWindow : List Nat := (List.range (2 * mPUnc + 1)).map (fun i => mP - mPUnc + i)
def lhcGeV : Nat := 13600                                  -- 13.6 TeV, LHC Run 3
def dimE8 : Nat := 248
def dimSO (n : Nat) : Nat := n * (n - 1) / 2
def divisorsBelow (n : Nat) : Nat := ((List.range' 1 (n - 1)).filter (fun d => n % d == 0)).foldl (· + ·) 0
def transverse (d : Nat) : Nat := d - 2
```
