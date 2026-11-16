---
title: "Definitions in energy.lean"
---

[← axiom index](/AXIOMS)

## `energy.lean` — 31 definition(s), 28 theorem(s)

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
