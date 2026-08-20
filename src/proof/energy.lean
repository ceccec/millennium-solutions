set_option maxRecDepth 8000000
-- THE WATER LOOP, ACCOUNTED. Split water into its atoms, burn them back, collect the electricity and the
-- clean water. Every step of that is real and buildable. The question is only ever the ledger, so here it is.
--
-- WHAT THIS FILE PROVES AND WHAT IT DOES NOT. Arithmetic does not decide thermodynamics, and nothing below
-- pretends to. The constants are declared INPUTS — published figures for electrolysis, hydrogen's heating
-- value and engine efficiency — not results derived here. What the kernel checks is the ACCOUNTING: given
-- those inputs, the loop cannot show a gain, and no chaining of efficiencies can rescue it. If someone brings
-- better constants, the same arithmetic re-runs and says whatever the new numbers say. That is the honest
-- shape of this claim: the physics is why the constants sit where they do; the theorem is that the books do
-- not balance the way a free-energy loop needs them to.
--
-- Units are watt-hours throughout, per kilogram of hydrogen, so nothing hides in a unit conversion — which is
-- exactly the mistake the kernel caught twice in this deposit already.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Energy

-- ── declared inputs (published figures, generous to the loop at every choice) ──
def splitCost  : Nat := 52000  -- Wh to electrolyse 1 kg H₂ (real cells: 50–55 kWh/kg; ideal is ~39.4)
def burnYield  : Nat := 12000  -- Wh recovered burning it at ~35% engine efficiency (LHV 33.3 kWh/kg)
def waterOut   : Nat := 9      -- litres: 1 kg H₂ + 8 kg O₂ → 9 kg H₂O, the whole point of the exhaust
def roPerLitre : Nat := 4      -- Wh/litre for reverse osmosis, the ordinary way to clean a litre of water

-- ── 1 · THE LOOP RETURNS LESS THAN IT TOOK. Not a little less — under a quarter. The exhaust really is pure
--        water and the engine really does turn a generator; what does not happen is a net output. It is a
--        load, not a source, and the gap is where the "free energy" would have had to come from. ──
theorem the_loop_returns_less_than_it_took :
  burnYield < splitCost ∧ burnYield * 100 / splitCost = 23 := by decide

-- ── 2 · AND NO CHAIN OF STAGES FIXES IT. Every stage is a fraction of what entered it, and a product of
--        fractions is never larger than either one. Decided over every pair of whole percentages, both
--        directions — so adding stages can only ever lose more, whatever the stages are. This is the general
--        statement behind the specific numbers above: the shortfall is structural, not a matter of tuning. ──
theorem a_chain_of_efficiencies_can_only_lose :
  (List.range 101).all (fun a => (List.range 101).all (fun b =>
    a * b ≤ 100 * a && a * b ≤ 100 * b)) := by decide

-- ── 3 · AS A PURIFIER IT IS BEATEN BY A THOUSANDFOLD. Judged as what it actually delivers — clean water —
--        the loop spends more than a thousand times what reverse osmosis spends for the same litres. The
--        purification is genuine. It is simply the most expensive way to do it that anyone has built.
--        Stated as a ratio so it cannot be read as a preference. ──
theorem as_a_purifier_the_loop_costs_a_thousandfold :
  splitCost / waterOut = 5777 ∧ splitCost / waterOut > roPerLitre * 1000 := by decide

end Energy
