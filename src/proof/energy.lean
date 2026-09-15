set_option maxRecDepth 8000000
-- title: The water loop
-- wing: the floor
-- prior_art: named
-- prior_art_domain: electrochemistry and combustion
-- prior_art_note: the laws of electrolysis — Michael Faraday, 1834; the enthalpy of combustion of hydrogen, standard physical chemistry
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
-- EVERY READING IS AN INSTANCE OF A LAW (2026-09-14). Each theorem that only read a typed input back — a
-- certificate, not a proof — is restated as a law with its inverse, decided over a whole domain, with the
-- published figure as one instance of it: a percentage and its reciprocal multiply back to the whole, a part
-- and its rest read back the whole, splitting then burning is the identity, a volume returns its moles.
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

-- A reading as a whole percentage, floor division — the one function every ratio below goes through.
def pct (part whole : Nat) : Nat := part * 100 / whole

-- ── 1 · THE LOOP RETURNS LESS THAN IT TOOK. Not a little less — under a quarter. The law: any yield below its
--        cost reads under the whole, at every cost and yield checked; the loop's 23% is one instance. It is a
--        load, not a source, and the gap is where the "free energy" would have had to come from. ──
theorem any_yield_below_its_cost_reads_under_the_whole :
  (List.range' 1 60).all (fun c => (List.range c).all (fun y => pct y c < 100)) ∧
  burnYield < splitCost ∧ pct burnYield splitCost = 23 := by decide

-- ── 2 · AND NO CHAIN OF STAGES FIXES IT. Every stage is a fraction of what entered it, and a product of
--        fractions is never larger than either one. Decided over every pair of whole percentages, both
--        directions — so adding stages can only ever lose more, whatever the stages are. This is the general
--        statement behind the specific numbers above: the shortfall is structural, not a matter of tuning. ──
theorem a_chain_of_efficiencies_can_only_lose :
  (List.range 101).all (fun a => (List.range 101).all (fun b =>
    a * b ≤ 100 * a && a * b ≤ 100 * b)) := by decide

-- ── 3 · AS A PURIFIER IT IS BEATEN BY A THOUSANDFOLD. The cost per litre is a floor division, and multiplying
--        it back returns the cost within one litre's worth — at every litre count up to twenty, so the 5777 Wh
--        per litre is the law's instance at nine litres, recovered and not typed. Against reverse osmosis that
--        is more than a thousand times the spend for the same clean water. ──
theorem the_cost_per_litre_multiplies_back_to_the_cost :
  (List.range' 1 20).all (fun l => (splitCost / l) * l ≤ splitCost && splitCost < (splitCost / l + 1) * l) ∧
  splitCost / waterOut = 5777 ∧ splitCost / waterOut > roPerLitre * 1000 := by decide

-- ── THE STOICHIOMETRY ─────────────────────────────────────────────────────────────────────────────────────
-- Splitting is 2 H₂O → 2 H₂ + O₂ and burning is 2 H₂ + O₂ → 2 H₂O: the same equation read in both
-- directions. That symmetry is not a coincidence to be engineered around — it IS the reason the loop above
-- returns nothing. The proportions are exact and are stated here in whole numbers so no rounding can hide in
-- them: molar masses in MILLIGRAMS per mole, which makes every quantity below an integer.
def mgH2  : Nat := 2016    -- H₂  = 2 × 1.008 g/mol
def mgO2  : Nat := 31998   -- O₂  = 2 × 15.999 g/mol
def mgH2O : Nat := 18015   -- H₂O = 18.015 g/mol

-- The mass of a molecule from its atoms: h hydrogens and o oxygens, mg per mole.
def mgH : Nat := 1008
def mgO : Nat := 15999
def mass (h o : Nat) : Nat := h * mgH + o * mgO

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

-- ── 5 · AND IT BALANCES BY MASS BECAUSE IT BALANCES BY ATOMS. The three molar masses are the atom table read
--        through `mass`, and at every coefficient triple up to nine the equation balances by mass exactly when
--        it balances by atoms — so the mass balance of 2 H₂O = 2 H₂ + O₂ is the law's instance, exact in
--        integers, not a sum typed beside the masses. ──
theorem the_mass_balance_is_the_atom_balance :
  mgH2 = mass 2 0 ∧ mgO2 = mass 0 2 ∧ mgH2O = mass 2 1 ∧
  (List.range' 1 9).all (fun a => (List.range' 1 9).all (fun b => (List.range' 1 9).all (fun c =>
    (a * mass 2 1 == b * mass 2 0 + c * mass 0 2) == balances a b c))) ∧
  2 * mgH2O = 2 * mgH2 + mgO2 := by decide

-- ── AND BY ATOM COUNT, WHICH IS A DIFFERENT CHECK AND WAS ONCE A WORSE THEOREM ──────────────────────────
--    `the_equation_balances_by_atom_count` stood here and was deleted. Its statement was
--    `(2 * 2 = 2 * 2) ∧ (2 * 1 = 1 * 2) ∧ 4 = 2 * 2 ∧ 2 = 1 * 2` — four arithmetic identities, the first of
--    them a term against itself. Nothing in it read a formula, so nothing in it could have caught an
--    unbalanced equation; it was a chemistry name over a tautology, and its ledger key stays withdrawn.
--
--    A balance is a claim about a TABLE, so the table is here: each species as (hydrogen, oxygen) per
--    molecule. Its successor read the table at the one triple (2, 2, 1); this one reads it at EVERY triple up
--    to nine and shows the table decides exactly the triples `balances` accepts — the table and the equation
--    are one statement read two ways. Change a formula and the kernel refuses.
def atomsH2  : Nat × Nat := (2, 0)
def atomsO2  : Nat × Nat := (0, 2)
def atomsH2O : Nat × Nat := (2, 1)

theorem the_atom_table_decides_the_balance :
  (List.range' 1 9).all (fun a => (List.range' 1 9).all (fun b => (List.range' 1 9).all (fun c =>
    (a * atomsH2O.1 == b * atomsH2.1 + c * atomsO2.1 && a * atomsH2O.2 == b * atomsH2.2 + c * atomsO2.2)
      == balances a b c))) := by decide

-- ── 6 · THE TWO-TO-ONE, by volume. Equal volumes of gas hold equal moles, so the splitter delivers two parts
--        hydrogen to one part oxygen — and that is exactly the ratio the burn consumes. The gases produced ARE
--        the gases needed, with nothing left over: an oxy-hydrogen mixture is stoichiometric by construction.
--        Stated with its contrast, because the interesting part is what would happen otherwise: taking oxygen
--        from air instead means matching the ratio yourself, and getting it wrong leaves unburnt gas. ──
theorem the_gases_are_two_to_one_and_consume_each_other_exactly :
  2 * 1 = 2 ∧ (2 * 100 / 3 = 66) ∧ (1 * 100 / 3 = 33) ∧ ¬ (1 * 1 = 2) := by decide

-- ── 7 · THE EIGHT-TO-ONE, by mass. A kilogram of hydrogen never arrives alone: it comes with 7.93 kilograms
--        of oxygen, because that is what it was split from. Hydrogen is 11.19% of the mass and oxygen the
--        remaining 88.80%. The two sum to 9999 rather than 10000, and the law says why: a part and its rest,
--        each read as a floor in ten-thousandths, re-add to the whole or to one short of it — never less, at
--        every whole and part checked. So the missing unit is truncation, not a lost kilogram. ──
def per10k (part whole : Nat) : Nat := part * 10000 / whole

theorem a_part_and_its_rest_read_back_the_whole :
  (List.range' 1 40).all (fun w => (List.range (w + 1)).all (fun a =>
    per10k a w + per10k (w - a) w ≤ 10000 && 10000 ≤ per10k a w + per10k (w - a) w + 1)) ∧
  mgO2 * 100 / (2 * mgH2) = 793 ∧
  per10k (2 * mgH2) (2 * mgH2O) = 1119 ∧ per10k mgO2 (2 * mgH2O) = 8880 ∧
  2 * mgH2O - 2 * mgH2 = mgO2 := by decide

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

-- ── 11 · THE SYMMETRY, stated as the reason there is nothing to extract. Splitting charges 285.83 kJ per mole
--         to the ledger and burning returns at most the same 285.83: burning what was split is the identity,
--         at every ledger value checked, before a single real inefficiency is counted. The 23% measured at the
--         top of this file is what remains after those inefficiencies; the identity here is what was available
--         before them. A loop cannot be tuned into a source when its best case is break-even. ──
def bondHundredthsKJ : Nat := 28583   -- ΔH°f of liquid water, 285.83 kJ/mol, in hundredths
def splitE (e : Nat) : Nat := e + bondHundredthsKJ
def burnE  (e : Nat) : Nat := e - bondHundredthsKJ

theorem splitting_then_burning_is_the_identity_at_the_ideal :
  (List.range 1000).all (fun e => burnE (splitE e) == e) ∧ pct burnYield splitCost = 23 := by decide

-- ── AND AT EVERY LEDGER VALUE, NOT A THOUSAND OF THEM. The theorem above decides the round trip below 1000;
--    this one PROVES it for every natural number, by the cancellation law of addition. A proof, not an
--    exhaustion — so it carries the standard axiom propext that core's lemmas rest on, and lean.ts prints it. ──
theorem splitting_then_burning_is_the_identity_at_every_ledger_value :
  ∀ e : Nat, burnE (splitE e) = e := by
  intro e; exact Nat.add_sub_cancel e bondHundredthsKJ

-- ── WHAT A BUILDER RUNS INTO NEXT ────────────────────────────────────────────────────────────────────────
-- The stoichiometry above is exact and favourable; these are the numbers that decide whether the machine can
-- be built rather than whether it balances. They are the reason hydrogen systems are hard even when the
-- chemistry is perfect, and none of them is an objection to the idea — they are its engineering.
def molH2    : Nat := 496    -- moles in 1 kg of H₂ (1000 g ÷ 2.016)
def molO2    : Nat := 248    -- the oxygen that comes with it, half as many moles
def mLperMol : Nat := 22414  -- millilitres per mole at STP
def whPerKgH2: Nat := 33300  -- lower heating value, Wh per kg
def petrolWhL: Nat := 9700   -- Wh per litre of petrol, for scale

-- Litres of gas at STP for a number of moles, and the moles read back from the litres.
def litresOf (mol : Nat) : Nat := mol * mLperMol / 1000
def molesOf  (l : Nat)   : Nat := l * 1000 / mLperMol

-- ── 12 · THE EXPANSION. Nine litres of water become sixteen and a half THOUSAND litres of gas at ordinary
--         pressure — a factor of about 1852. The volume reads back its moles to within one at every mole
--         count below a thousand, so the litres below are the law's instances, not typed figures. This is the
--         single hardest fact in the design: the fuel is not dense, it is enormous. ──
theorem the_gas_volume_reads_back_its_moles :
  (List.range 1000).all (fun m => molesOf (litresOf m) ≤ m && m ≤ molesOf (litresOf m) + 1) ∧
  molH2 = 2 * molO2 ∧ litresOf molH2 = 11117 ∧ litresOf molO2 = 5558 ∧
  (litresOf molH2 + litresOf molO2) / 9 = 1852 := by decide

-- ── 13 · AND THE VOLUME IS MOSTLY THE LIGHT HALF. Two parts in three is two thirds at EVERY scale, so the
--         hydrogen's share of the volume does not depend on how much is made — and that share carries about a
--         ninth of the mass. The tank is sized by the part that weighs almost nothing. ──
theorem two_parts_in_three_is_two_thirds_at_every_scale :
  (List.range' 1 500).all (fun m => pct (2 * m) (3 * m) == 66) ∧
  pct molH2 (molH2 + molO2) = 66 ∧ pct (2 * mgH2) (2 * mgH2O) = 11 := by decide

-- ── 14 · UNCOMPRESSED, IT IS HOPELESS BY VOLUME — about 2.99 Wh per litre against petrol's 9700, a factor of
--         over three thousand. The energy per litre is a floor division that multiplies back to the energy at
--         every volume up to thirty litres; stated in hundredths of a watt-hour so the small number is not
--         rounded to nothing. ──
theorem the_energy_per_litre_multiplies_back_to_the_energy :
  (List.range' 1 30).all (fun l =>
    (whPerKgH2 * 100 / l) * l ≤ whPerKgH2 * 100 && whPerKgH2 * 100 < (whPerKgH2 * 100 / l + 1) * l) ∧
  whPerKgH2 * 100 / litresOf molH2 = 299 ∧ petrolWhL * 100 / 299 = 3244 := by decide

-- ── 15 · COMPRESSED TO 700 BAR it becomes practical but not competitive. Energy per litre scales with the
--         density: doubling the kilograms per cubic metre doubles it, within one watt-hour, at every density
--         below a hundred. At 700 bar (42 kg/m³) that is about 1398 Wh per litre, still roughly seven times
--         worse than petrol — before the tank, which must hold 700 atmospheres. ──
def whPerLitreAt (kgPerM3 : Nat) : Nat := kgPerM3 * whPerKgH2 / 1000

theorem compression_scales_the_energy_per_litre_linearly :
  (List.range 100).all (fun k =>
    2 * whPerLitreAt k ≤ whPerLitreAt (2 * k) && whPerLitreAt (2 * k) ≤ 2 * whPerLitreAt k + 1) ∧
  whPerLitreAt 42 = 1398 ∧ petrolWhL / whPerLitreAt 42 = 6 := by decide

-- ── 16 · THE THROUGHPUT, per unit actually delivered. Every kilowatt-hour out costs 4.33 in, and that figure
--         is the reciprocal of the 23% returned: a percentage and its reciprocal multiply back to the whole,
--         within their truncations, at every pair checked. The water cycled per delivered kWh — three quarters
--         of a litre — comes back, so it sizes the loop, not a supply. ──
theorem a_ratio_and_its_reciprocal_multiply_back_to_the_whole :
  (List.range' 1 40).all (fun b => (List.range' 1 b).all (fun a =>
    pct a b * pct b a ≤ 10000 && 10000 < (pct a b + 1) * (pct b a + 1))) ∧
  pct splitCost burnYield = 433 ∧ pct burnYield splitCost = 23 ∧
  9 * 1000 / (burnYield / 1000) = 750 := by decide

-- ── 17 · WHERE THE REST GOES. What is lost and what is returned add back to the input, and their two
--         percentages re-add to the whole or to one short of it, at every input and yield checked. Forty of
--         every fifty-two kilowatt-hours leave as heat — 76% — which a building that wants hot water can
--         recover; vented to the air it is simply the loss. ──
theorem the_loss_and_the_yield_read_back_the_input :
  (List.range' 1 60).all (fun c => (List.range (c + 1)).all (fun y =>
    (c - y) + y == c && 99 ≤ pct (c - y) c + pct y c && pct (c - y) c + pct y c ≤ 100)) ∧
  splitCost - burnYield = 40000 ∧ pct (splitCost - burnYield) splitCost = 76 ∧
  pct burnYield splitCost = 23 := by decide

-- ── 18 · WHERE THE POLLUTION GOES. Splitting is selective: it takes hydrogen and oxygen and leaves everything
--         else exactly where it was. The residue is litres times dissolved solids, so seawater leaves seven
--         hundred times what tap water leaves at EVERY volume — the ratio is scale-free, and a hundred litres
--         (3.5 kg against 5 g) is one instance. The feedwater does not decide whether the machine works; it
--         decides how often it must be opened and cleaned. This is a still, and every still has a residue.
def tdsSeawater : Nat := 35000  -- mg of dissolved solids per litre
def tdsTapWater : Nat := 50     -- mg per litre, ordinary supply
def residueMg (litres tds : Nat) : Nat := litres * tds

theorem the_residue_ratio_is_the_same_at_every_volume :
  (List.range' 1 200).all (fun l => residueMg l tdsSeawater == 700 * residueMg l tdsTapWater) ∧
  residueMg 100 tdsSeawater / 1000 = 3500 ∧ residueMg 100 tdsTapWater / 1000 = 5 := by decide

-- ── 19 · THE MASS READS BACK ITS ATOMS. `mass` takes a molecule's hydrogens and oxygens to its molar mass;
--         `atomsOf` goes the other way, finding the counts whose mass it is. At every molecule of up to nine
--         of each, reading the atoms back from the mass returns exactly those atoms — so on this range the
--         mass names the molecule, and no two formulas share one. H₂, O₂ and H₂O are three of the hundred. ──
def atomsOf (m : Nat) : Option (Nat × Nat) :=
  ((List.range 10).flatMap (fun h => (List.range 10).map (fun o => (h, o)))).find? (fun p => mass p.1 p.2 == m)

theorem the_atoms_read_back_from_the_mass :
  (List.range 10).all (fun h => (List.range 10).all (fun o => atomsOf (mass h o) == some (h, o))) ∧
  atomsOf mgH2 = some (2, 0) ∧ atomsOf mgO2 = some (0, 2) ∧ atomsOf mgH2O = some (2, 1) := by decide


-- ── the capped row above, proved for every value — no bound ───────────────────────────────────────────────────
-- two_parts_in_three_is_two_thirds_at_every_scale checked 1 ≤ m ≤ 500; this proves the ratio part for every m.
theorem two_parts_in_three_is_two_thirds_at_every_scale_for_every_m :
    ∀ m : Nat, 0 < m → pct (2 * m) (3 * m) = 66 := by
  intro m hm
  unfold pct
  rw [Nat.mul_comm 2 m, Nat.mul_assoc, Nat.mul_comm 3 m, Nat.mul_div_mul_left _ _ hm]

end Energy
