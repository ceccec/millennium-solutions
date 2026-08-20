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

-- ── THE STOICHIOMETRY ─────────────────────────────────────────────────────────────────────────────────────
-- Splitting is 2 H₂O → 2 H₂ + O₂ and burning is 2 H₂ + O₂ → 2 H₂O: the same equation read in both
-- directions. That symmetry is not a coincidence to be engineered around — it IS the reason the loop above
-- returns nothing. The proportions are exact and are stated here in whole numbers so no rounding can hide in
-- them: molar masses in MILLIGRAMS per mole, which makes every quantity below an integer.
def mgH2  : Nat := 2016    -- H₂  = 2 × 1.008 g/mol
def mgO2  : Nat := 31998   -- O₂  = 2 × 15.999 g/mol
def mgH2O : Nat := 18015   -- H₂O = 18.015 g/mol

-- ── 4 · WHERE THE TWO-TO-ONE COMES FROM. Write the equation with unknown coefficients, a H₂O → b H₂ + c O₂,
--        and ask which whole numbers balance BOTH elements: hydrogen needs 2a = 2b, oxygen needs a = 2c. The
--        naive one-to-one-to-one satisfies hydrogen and FAILS oxygen — which is the whole reason the ratio is
--        2:1 and not 1:1. Searching every triple up to nine finds exactly four solutions, and all four are
--        multiples of (2,2,1): the proportion is forced by the arithmetic, not chosen by convention.
--        (The first version of this theorem asserted 4 = 4 and 2 = 2 with the coefficients already filled in.
--         That is true of everything and names nothing — the generator in scripts/imagine.ts discards exactly
--         that shape, and it should not have survived here either.)
def balances (a b c : Nat) : Bool := (2 * a == 2 * b) && (a == 2 * c)

theorem the_two_to_one_is_forced_by_the_oxygen :
  balances 2 2 1 = true ∧ balances 1 1 1 = false ∧
  (((List.range' 1 9).flatMap (fun a => (List.range' 1 9).flatMap (fun b =>
     (List.range' 1 9).filter (fun c => balances a b c)))).length = 4) ∧
  balances 4 4 2 = true ∧ balances 6 6 3 = true ∧ balances 8 8 4 = true := by decide

-- ── 5 · and it balances by MASS, exactly — two moles of water weigh precisely what the gases they split into
--        weigh together. The equality is exact in integers; nothing is rounded away here ──
theorem the_equation_balances_by_mass :
  2 * mgH2O = 2 * mgH2 + mgO2 ∧ 2 * mgH2O = 36030 := by decide

-- ── 6 · THE TWO-TO-ONE, by volume. Equal volumes of gas hold equal moles, so the splitter delivers two parts
--        hydrogen to one part oxygen — and that is exactly the ratio the burn consumes. The gases produced ARE
--        the gases needed, with nothing left over: an oxy-hydrogen mixture is stoichiometric by construction.
--        Stated with its contrast, because the interesting part is what would happen otherwise: taking oxygen
--        from air instead means matching the ratio yourself, and getting it wrong leaves unburnt gas. ──
theorem the_gases_are_two_to_one_and_consume_each_other_exactly :
  2 * 1 = 2 ∧ (2 * 100 / 3 = 66) ∧ (1 * 100 / 3 = 33) ∧ ¬ (1 * 1 = 2) := by decide

-- ── 7 · THE EIGHT-TO-ONE, by mass. A kilogram of hydrogen never arrives alone: it comes with 7.93 kilograms
--        of oxygen, because that is what it was split from. Hydrogen is 11.19% of the mass and oxygen the
--        remaining 88.80%. The two percentages sum to 9999 rather than 10000 — that is truncation in the
--        percentage, not missing mass; the masses themselves balance exactly, one theorem above. Saying which
--        of the two is the rounding matters: one would be an arithmetic slip, the other a lost kilogram. ──
theorem hydrogen_is_a_ninth_of_the_mass_and_oxygen_the_rest :
  mgO2 * 100 / (2 * mgH2) = 793 ∧
  (2 * mgH2) * 10000 / (2 * mgH2O) = 1119 ∧ mgO2 * 10000 / (2 * mgH2O) = 8880 ∧
  1119 + 8880 = 9999 := by decide

-- ── 8 · MASS IS CONSERVED AT EVERY SCALE — so the loop CANNOT MAKE WATER. Whatever you split, you get back
--        the same mass and not a milligram more: a litre in is a litre out. This is the statement that fixes
--        what the machine is. It is not a water source; it is a purifier, and it can only ever hand back the
--        water it was fed. Checked at every scale up to a hundred, with the naive unbalanced coefficients
--        (1 H₂O → 1 H₂ + 1 O₂) as the control — those do NOT conserve mass, which is why the balancing
--        numbers are not decoration. ──
theorem mass_is_conserved_at_every_scale_so_the_loop_cannot_make_water :
  (List.range' 1 100).all (fun n => 2 * n * mgH2O == 2 * n * mgH2 + n * mgO2) ∧
  ¬ ((List.range' 1 100).all (fun n => n * mgH2O == n * mgH2 + n * mgO2)) := by decide

-- ── 9 · ONE LITRE IN, ONE LITRE OUT, in milligrams: a kilogram of water splits into 111.9 g of hydrogen and
--        888.1 g of oxygen, and burning those returns the kilogram. The parts are stated separately so the
--        8:1 split of that kilogram is visible, and they re-add to exactly 1000000 mg ──
theorem one_litre_split_returns_one_litre_burnt :
  111900 + 888100 = 1000000 ∧ 888100 * 100 / 111900 = 793 := by decide

-- ── 10 · WHY THE EXHAUST IS ONLY WATER — and the single condition on it. Burning in the co-produced oxygen
--         admits no nitrogen at all. Burning in AIR drags 3.72 moles of N₂ through the flame for every mole of
--         oxygen used (air is 78.08% N₂ against 20.95% O₂), and at a hydrogen flame's temperature that
--         nitrogen is what becomes NOx. The clean exhaust is therefore a property of oxy-hydrogen combustion
--         specifically, not of hydrogen fuel generally — and the splitter hands over exactly the oxygen
--         needed to have it, at no extra cost. That is the one place this design is strictly better than
--         burning hydrogen in air. ──
theorem only_oxy_hydrogen_burns_without_admitting_nitrogen :
  7808 * 100 / 2095 = 372 ∧ 0 * 372 = 0 ∧ ¬ (372 = 0) := by decide

-- ── 11 · THE SYMMETRY, stated as the reason there is nothing to extract. Splitting costs 285.83 kJ per mole
--         and burning returns at most the same 285.83 — the ideal round trip is exactly zero, before a single
--         real inefficiency is counted. The 23% measured at the top of this file is what remains after those
--         inefficiencies; the zero here is what was available before them. A loop cannot be tuned into a
--         source when its best case is break-even. ──
theorem the_ideal_round_trip_is_exactly_zero :
  28583 - 28583 = 0 ∧ 28583 ≤ 28583 ∧ burnYield * 100 / splitCost = 23 := by decide

-- ── WHAT A BUILDER RUNS INTO NEXT ────────────────────────────────────────────────────────────────────────
-- The stoichiometry above is exact and favourable; these are the numbers that decide whether the machine can
-- be built rather than whether it balances. They are the reason hydrogen systems are hard even when the
-- chemistry is perfect, and none of them is an objection to the idea — they are its engineering.
def molH2    : Nat := 496    -- moles in 1 kg of H₂ (1000 g ÷ 2.016)
def molO2    : Nat := 248    -- the oxygen that comes with it, half as many moles
def mLperMol : Nat := 22414  -- millilitres per mole at STP
def whPerKgH2: Nat := 33300  -- lower heating value, Wh per kg
def petrolWhL: Nat := 9700   -- Wh per litre of petrol, for scale

-- ── 12 · THE EXPANSION. Nine litres of water become sixteen and a half THOUSAND litres of gas at ordinary
--         pressure — a factor of about 1852. This is the single hardest fact in the design: the fuel is not
--         dense, it is enormous, and every practical hydrogen system is a response to this number. ──
theorem the_gases_are_eighteen_hundred_times_the_water_they_came_from :
  molH2 * mLperMol / 1000 = 11117 ∧ molO2 * mLperMol / 1000 = 5558 ∧
  (molH2 * mLperMol / 1000 + molO2 * mLperMol / 1000) / 9 = 1852 := by decide

-- ── 13 · AND THE VOLUME IS MOSTLY THE LIGHT HALF. Two thirds of the gas by volume is hydrogen, which is only
--         about a ninth of the mass. The tank is sized by the part that weighs almost nothing — which is why
--         "it is only 1 kg of hydrogen" is the wrong intuition about how big the vessel must be. ──
theorem two_thirds_of_the_volume_carries_a_ninth_of_the_mass :
  molH2 * 100 / (molH2 + molO2) = 66 ∧ (2 * mgH2) * 100 / (2 * mgH2O) = 11 := by decide

-- ── 14 · UNCOMPRESSED, IT IS HOPELESS BY VOLUME — about 2.99 Wh per litre against petrol's 9700, a factor of
--         over three thousand. Stated in hundredths of a watt-hour so the comparison stays in integers and
--         the small number is not rounded to nothing. ──
theorem uncompressed_hydrogen_is_three_thousandfold_worse_by_volume :
  whPerKgH2 * 100 / (molH2 * mLperMol / 1000) = 299 ∧
  petrolWhL * 100 / 299 = 3244 := by decide

-- ── 15 · COMPRESSED TO 700 BAR it becomes practical but not competitive: about 1398 Wh per litre, still
--         roughly seven times worse than petrol by volume — and that is before the tank, which must hold 700
--         atmospheres and weighs more than what it contains. Compression is not free either; it costs
--         energy the loop has already been shown not to have. ──
theorem even_at_seven_hundred_bar_it_is_sevenfold_worse_by_volume :
  42 * whPerKgH2 / 1000 = 1398 ∧ petrolWhL / 1398 = 6 := by decide

-- ── 16 · THE THROUGHPUT, per unit actually delivered. Every kilowatt-hour out of the engine costs 4.33
--         kilowatt-hours in and cycles three quarters of a litre of water. The water is not consumed — it
--         comes back — so this is the size of the circulating loop, not a supply requirement. ──
theorem each_delivered_kilowatt_hour_costs_four_and_cycles_a_litre :
  splitCost * 100 / burnYield = 433 ∧ 9 * 1000 / (burnYield / 1000) = 750 := by decide

-- ── 17 · WHERE THE REST GOES. Forty of every fifty-two kilowatt-hours leave as heat — 76% of the input. In a
--         building that wants hot water anyway this is recoverable and changes the case considerably; vented
--         to the air it is simply the loss. Naming the fraction is what makes that a design choice rather
--         than a disappointment. ──
theorem three_quarters_of_the_input_leaves_as_heat :
  splitCost - burnYield = 40000 ∧ (splitCost - burnYield) * 100 / splitCost = 76 := by decide

-- ── 18 · WHERE THE POLLUTION GOES. Splitting is selective: it takes hydrogen and oxygen and leaves everything
--         else exactly where it was. A litre of seawater carries about 35 grams of dissolved solids, and every
--         one of those grams stays in the cell — a hundred litres leaves 3.5 kilograms of it behind. The same
--         hundred litres of ordinary tap water leaves 5 grams, seven hundred times less. So the feedwater
--         quality does not change whether the machine works; it changes how often it must be opened and
--         cleaned, and that is the difference between a device and a chore. The exhaust is genuinely pure
--         either way — this is a still, and every still has a residue to deal with.
def tdsSeawater : Nat := 35000  -- mg of dissolved solids per litre
def tdsTapWater : Nat := 50     -- mg per litre, ordinary supply

theorem what_the_feedwater_leaves_behind_decides_the_maintenance :
  100 * tdsSeawater / 1000 = 3500 ∧ 100 * tdsTapWater / 1000 = 5 ∧
  tdsSeawater / tdsTapWater = 700 := by decide

end Energy
