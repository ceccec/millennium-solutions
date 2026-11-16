---
title: "Definitions in light.lean"
---

[← axiom index](/AXIOMS)

## `light.lean` — 15 definition(s), 17 theorem(s)

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
def molarGas : Nat := kDigits * naDigits        -- 10⁻²⁹ · 10¹⁵ = 10⁻¹⁴ · R = 8.31446261815324 J mol⁻¹ K⁻¹
def faraday : Nat := eDigits * naDigits        -- 10⁻²⁸ · 10¹⁵ = 10⁻¹³ · F = 96485.33212331… C mol⁻¹
```
