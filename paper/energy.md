---
title: "The water loop"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `energy.lean`

<p class="paper-src"><code>src/iso/80000-physics/energy.lean</code> · namespace <code>Energy</code> · 28 theorems · wing <code>the floor</code></p>

THE WATER LOOP, ACCOUNTED. Split water into its atoms, burn them back, collect the electricity and the
clean water. Every step of that is real and buildable. The question is only ever the ledger, so here it is.

WHAT THIS FILE PROVES AND WHAT IT DOES NOT. Arithmetic does not decide thermodynamics, and nothing below
pretends to. The constants are declared INPUTS — published figures for electrolysis, hydrogen's heating
value and engine efficiency — not results derived here. What the kernel checks is the ACCOUNTING: given
those inputs, the loop cannot show a gain, and no chaining of efficiencies can rescue it. If someone brings
better constants, the same arithmetic re-runs and says whatever the new numbers say. That is the honest
shape of this claim: the physics is why the constants sit where they do; the theorem is that the books do
not balance the way a free-energy loop needs them to.

EVERY READING IS AN INSTANCE OF A LAW (2026-09-14). Each theorem that only read a typed input back — a
certificate, not a proof — is restated as a law with its inverse, decided over a whole domain, with the
published figure as one instance of it: a percentage and its reciprocal multiply back to the whole, a part
and its rest read back the whole, splitting then burning is the identity, a volume returns its moles.

Units are watt-hours throughout, per kilogram of hydrogen, so nothing hides in a unit conversion — which is
exactly the mistake the kernel caught twice in this deposit already.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>splitCost := 52000  -- Wh to electrolyse 1 kg H₂ (real cells: 50–55 kWh/kg; ideal is ~39.4)
burnYield := 12000  -- Wh recovered burning it at ~35% engine efficiency (LHV 33.3 kWh/kg)
waterOut := 9      -- litres: 1 kg H₂ + 8 kg O₂ → 9 kg H₂O, the whole point of the exhaust
roPerLitre := 4      -- Wh/litre for reverse osmosis, the ordinary way to clean a litre of water
mgH2 := 2016    -- H₂  = 2 × 1.008 g/mol
mgO2 := 31998   -- O₂  = 2 × 15.999 g/mol
mgH2O := 18015   -- H₂O = 18.015 g/mol
mgH := 1008
mgO := 15999
atomsH2 := (2, 0)
atomsO2 := (0, 2)
atomsH2O := (2, 1)
bondHundredthsKJ := 28583   -- ΔH°f of liquid water, 285.83 kJ/mol, in hundredths
molH2 := 496    -- moles in 1 kg of H₂ (1000 g ÷ 2.016)
molO2 := 248    -- the oxygen that comes with it, half as many moles
mLperMol := 22414  -- millilitres per mole at STP
whPerKgH2 := 33300  -- lower heating value, Wh per kg
petrolWhL := 9700   -- Wh per litre of petrol, for scale
tdsSeawater := 35000  -- mg of dissolved solids per litre
tdsTapWater := 50     -- mg per litre, ordinary supply</code></pre>

<div class="thm" id="thm-energy-any_yield_below_its_cost_reads_under_the_whole">
<p class="thm-label"><strong>Theorem 322</strong> (<code>any_yield_below_its_cost_reads_under_the_whole</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_any_yield_below_its_cost_reads_under_the_whole.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>60</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>y</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>c</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>y</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>&lt;</mo><mn>100</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mi>burnYield</mi><mo>&lt;</mo><mi>splitCost</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>burnYield</mi><mo>,</mo><mi>splitCost</mi><mo>)</mo></mrow><mo>=</mo><mn>23</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 60).all (fun c =&gt; (List.range c).all (fun y =&gt; pct y c &lt; 100)) ∧ burnYield &lt; splitCost ∧ pct burnYield splitCost = 23</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{1,\dots,60\},\; \forall y \in \{0,\dots,c-1\},\; \mathrm{pct}\mathopen{}\left(y,\,c\right) &lt; 100 \land \mathrm{burnYield} &lt; \mathrm{splitCost} \land \mathrm{pct}\mathopen{}\left(\mathrm{burnYield},\,\mathrm{splitCost}\right) = 23</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE LOOP RETURNS LESS THAN IT TOOK. Not a little less — under a quarter. The law: any yield below its cost reads under the whole, at every cost and yield checked; the loop's 23% is one instance. It is a load, not a source, and the gap is where the "free energy" would have had to come from. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-a_chain_of_efficiencies_can_only_lose">
<p class="thm-label"><strong>Theorem 323</strong> (<code>a_chain_of_efficiencies_can_only_lose</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_a_chain_of_efficiencies_can_only_lose.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>100</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>100</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>≤</mo><mrow><mn>100</mn><mo>⋅</mo><mi>a</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>≤</mo><mrow><mn>100</mn><mo>⋅</mo><mi>b</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 101).all (fun a =&gt; (List.range 101).all (fun b =&gt; a * b ≤ 100 * a &amp;&amp; a * b ≤ 100 * b))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,100\},\; \forall b \in \{0,\dots,100\},\; a \cdot b \le 100 \cdot a \land a \cdot b \le 100 \cdot b</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND NO CHAIN OF STAGES FIXES IT. Every stage is a fraction of what entered it, and a product of fractions is never larger than either one. Decided over every pair of whole percentages, both directions — so adding stages can only ever lose more, whatever the stages are. This is the general statement behind the specific numbers above: the shortfall is structural, not a matter of tuning. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10,201 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_cost_per_litre_multiplies_back_to_the_cost">
<p class="thm-label"><strong>Theorem 324</strong> (<code>the_cost_per_litre_multiplies_back_to_the_cost</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_cost_per_litre_multiplies_back_to_the_cost.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>l</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mfrac><mi>splitCost</mi><mi>l</mi></mfrac><mo>⋅</mo><mi>l</mi></mrow><mo>≤</mo><mi>splitCost</mi></mrow><mo>∧</mo><mrow><mi>splitCost</mi><mo>&lt;</mo><mrow><mrow><mfrac><mi>splitCost</mi><mi>l</mi></mfrac><mo>+</mo><mn>1</mn></mrow><mo>⋅</mo><mi>l</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>splitCost</mi><mi>waterOut</mi></mfrac><mo>=</mo><mn>5777</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>splitCost</mi><mi>waterOut</mi></mfrac><mo>&gt;</mo><mrow><mi>roPerLitre</mi><mo>⋅</mo><mn>1000</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 20).all (fun l =&gt; (splitCost / l) * l ≤ splitCost &amp;&amp; splitCost &lt; (splitCost / l + 1) * l) ∧ splitCost / waterOut = 5777 ∧ splitCost / waterOut &gt; roPerLitre * 1000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall l \in \{1,\dots,20\},\; \frac{\mathrm{splitCost}}{l} \cdot l \le \mathrm{splitCost} \land \mathrm{splitCost} &lt; \frac{\mathrm{splitCost}}{l} + 1 \cdot l \land \frac{\mathrm{splitCost}}{\mathrm{waterOut}} = 5777 \land \frac{\mathrm{splitCost}}{\mathrm{waterOut}} &gt; \mathrm{roPerLitre} \cdot 1000</code></pre></details>
</div>
<p class="thm-remark">── 3 · AS A PURIFIER IT IS BEATEN BY A THOUSANDFOLD. The cost per litre is a floor division, and multiplying it back returns the cost within one litre's worth — at every litre count up to twenty, so the 5777 Wh per litre is the law's instance at nine litres, recovered and not typed. Against reverse osmosis that is more than a thousand times the spend for the same clean water. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_two_to_one_is_forced_by_the_oxygen">
<p class="thm-label"><strong>Theorem 325</strong> (<code>the_two_to_one_is_forced_by_the_oxygen</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_two_to_one_is_forced_by_the_oxygen.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>balances</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>balances</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>⋃</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>⋃</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>{</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mi>balances</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>}</mo></mrow></mrow></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>balances</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>balances</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>balances</mi><mo>(</mo><mn>8</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>balances 2 2 1 = true ∧ balances 1 1 1 = false ∧ (((List.range' 1 9).flatMap (fun a =&gt; (List.range' 1 9).flatMap (fun b =&gt; (List.range' 1 9).filter (fun c =&gt; balances a b c)))).length = 4) ∧ balances 4 4 2 = true ∧ balances 6 6 3 = true ∧ balances 8 8 4 = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{balances}\mathopen{}\left(2,\,2,\,1\right) = \mathrm{true} \land \mathrm{balances}\mathopen{}\left(1,\,1,\,1\right) = \mathrm{false} \land \left|\bigcup_{a \in \{1,\dots,9\}} \bigcup_{b \in \{1,\dots,9\}} \{\, c \in \{1,\dots,9\} \mid \mathrm{balances}\mathopen{}\left(a,\,b,\,c\right) \,\}\right| = 4 \land \mathrm{balances}\mathopen{}\left(4,\,4,\,2\right) = \mathrm{true} \land \mathrm{balances}\mathopen{}\left(6,\,6,\,3\right) = \mathrm{true} \land \mathrm{balances}\mathopen{}\left(8,\,8,\,4\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_mass_balance_is_the_atom_balance">
<p class="thm-label"><strong>Theorem 326</strong> (<code>the_mass_balance_is_the_atom_balance</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_mass_balance_is_the_atom_balance.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>mgH2</mi><mo>=</mo><mrow><mi>mass</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mi>mgO2</mi><mo>=</mo><mrow><mi>mass</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mi>mgH2O</mi><mo>=</mo><mrow><mi>mass</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mrow><mi>mass</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mrow><mi>b</mi><mo>⋅</mo><mrow><mi>mass</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>c</mi><mo>⋅</mo><mrow><mi>mass</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow></mrow></mrow></mrow><mo>=</mo><mrow><mi>balances</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>=</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2</mi></mrow><mo>+</mo><mi>mgO2</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>mgH2 = mass 2 0 ∧ mgO2 = mass 0 2 ∧ mgH2O = mass 2 1 ∧ (List.range' 1 9).all (fun a =&gt; (List.range' 1 9).all (fun b =&gt; (List.range' 1 9).all (fun c =&gt; (a * mass 2 1 == b * mass 2 0 + c * mass 0 2) == balances a b c))) ∧ 2 * mgH2O = 2 * mgH2 + mgO2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{mgH2} = \mathrm{mass}\mathopen{}\left(2,\,0\right) \land \mathrm{mgO2} = \mathrm{mass}\mathopen{}\left(0,\,2\right) \land \mathrm{mgH2O} = \mathrm{mass}\mathopen{}\left(2,\,1\right) \land \forall a \in \{1,\dots,9\},\; \forall b \in \{1,\dots,9\},\; \forall c \in \{1,\dots,9\},\; a \cdot \mathrm{mass}\mathopen{}\left(2,\,1\right) = b \cdot \mathrm{mass}\mathopen{}\left(2,\,0\right) + c \cdot \mathrm{mass}\mathopen{}\left(0,\,2\right) = \mathrm{balances}\mathopen{}\left(a,\,b,\,c\right) \land 2 \cdot \mathrm{mgH2O} = 2 \cdot \mathrm{mgH2} + \mathrm{mgO2}</code></pre></details>
</div>
<p class="thm-remark">── 5 · AND IT BALANCES BY MASS BECAUSE IT BALANCES BY ATOMS. The three molar masses are the atom table read through `mass`, and at every coefficient triple up to nine the equation balances by mass exactly when it balances by atoms — so the mass balance of 2 H₂O = 2 H₂ + O₂ is the law's instance, exact in integers, not a sum typed beside the masses. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_atom_table_decides_the_balance">
<p class="thm-label"><strong>Theorem 327</strong> (<code>the_atom_table_decides_the_balance</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_atom_table_decides_the_balance.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><msub><mi>atomsH2O</mi><mn>1</mn></msub></mrow><mo>=</mo><mrow><mrow><mi>b</mi><mo>⋅</mo><msub><mi>atomsH2</mi><mn>1</mn></msub></mrow><mo>+</mo><mrow><mi>c</mi><mo>⋅</mo><msub><mi>atomsO2</mi><mn>1</mn></msub></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><msub><mi>atomsH2O</mi><mn>2</mn></msub></mrow><mo>=</mo><mrow><mrow><mi>b</mi><mo>⋅</mo><msub><mi>atomsH2</mi><mn>2</mn></msub></mrow><mo>+</mo><mrow><mi>c</mi><mo>⋅</mo><msub><mi>atomsO2</mi><mn>2</mn></msub></mrow></mrow></mrow></mrow><mo>=</mo><mrow><mi>balances</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 9).all (fun a =&gt; (List.range' 1 9).all (fun b =&gt; (List.range' 1 9).all (fun c =&gt; (a * atomsH2O.1 == b * atomsH2.1 + c * atomsO2.1 &amp;&amp; a * atomsH2O.2 == b * atomsH2.2 + c * atomsO2.2) == balances a b c)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{1,\dots,9\},\; \forall b \in \{1,\dots,9\},\; \forall c \in \{1,\dots,9\},\; a \cdot \mathrm{atomsH2O}_{1} = b \cdot \mathrm{atomsH2}_{1} + c \cdot \mathrm{atomsO2}_{1} \land a \cdot \mathrm{atomsH2O}_{2} = b \cdot \mathrm{atomsH2}_{2} + c \cdot \mathrm{atomsO2}_{2} = \mathrm{balances}\mathopen{}\left(a,\,b,\,c\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_gases_are_two_to_one_and_consume_each_other_exactly">
<p class="thm-label"><strong>Theorem 328</strong> (<code>the_gases_are_two_to_one_and_consume_each_other_exactly</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_gases_are_two_to_one_and_consume_each_other_exactly.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>2</mn><mo>⋅</mo><mn>1</mn></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mfrac><mrow><mn>2</mn><mo>⋅</mo><mn>100</mn></mrow><mn>3</mn></mfrac><mo>=</mo><mn>66</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mn>1</mn><mo>⋅</mo><mn>100</mn></mrow><mn>3</mn></mfrac><mo>=</mo><mn>33</mn></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mrow><mn>1</mn><mo>⋅</mo><mn>1</mn></mrow><mo>=</mo><mn>2</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 * 1 = 2 ∧ (2 * 100 / 3 = 66) ∧ (1 * 100 / 3 = 33) ∧ ¬ (1 * 1 = 2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2 \cdot 1 = 2 \land \frac{2 \cdot 100}{3} = 66 \land \frac{1 \cdot 100}{3} = 33 \land \lnot 1 \cdot 1 = 2</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE TWO-TO-ONE, by volume. Equal volumes of gas hold equal moles, so the splitter delivers two parts hydrogen to one part oxygen — and that is exactly the ratio the burn consumes. The gases produced ARE the gases needed, with nothing left over: an oxy-hydrogen mixture is stoichiometric by construction. Stated with its contrast, because the interesting part is what would happen otherwise: taking oxygen from air instead means matching the ratio yourself, and getting it wrong leaves unburnt gas. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-a_part_and_its_rest_read_back_the_whole">
<p class="thm-label"><strong>Theorem 329</strong> (<code>a_part_and_its_rest_read_back_the_whole</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_a_part_and_its_rest_read_back_the_whole.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>40</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>w</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>per10k</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>w</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>per10k</mi><mo>(</mo><mrow><mi>w</mi><mo>-</mo><mi>a</mi></mrow><mo>,</mo><mi>w</mi><mo>)</mo></mrow></mrow><mo>≤</mo><mn>10000</mn></mrow><mo>∧</mo><mrow><mn>10000</mn><mo>≤</mo><mrow><mrow><mrow><mi>per10k</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>w</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>per10k</mi><mo>(</mo><mrow><mi>w</mi><mo>-</mo><mi>a</mi></mrow><mo>,</mo><mi>w</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>mgO2</mi><mo>⋅</mo><mn>100</mn></mrow><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2</mi></mrow></mfrac><mo>=</mo><mn>793</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>per10k</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2</mi></mrow><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>1119</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>per10k</mi><mo>(</mo><mi>mgO2</mi><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>8880</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>-</mo><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2</mi></mrow></mrow><mo>=</mo><mi>mgO2</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 40).all (fun w =&gt; (List.range (w + 1)).all (fun a =&gt; per10k a w + per10k (w - a) w ≤ 10000 &amp;&amp; 10000 ≤ per10k a w + per10k (w - a) w + 1)) ∧ mgO2 * 100 / (2 * mgH2) = 793 ∧ per10k (2 * mgH2) (2 * mgH2O) = 1119 ∧ per10k mgO2 (2 * mgH2O) = 8880 ∧ 2 * mgH2O - 2 * mgH2 = mgO2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall w \in \{1,\dots,40\},\; \forall a \in \{0,\dots,w + 1-1\},\; \mathrm{per10k}\mathopen{}\left(a,\,w\right) + \mathrm{per10k}\mathopen{}\left(w - a,\,w\right) \le 10000 \land 10000 \le \mathrm{per10k}\mathopen{}\left(a,\,w\right) + \mathrm{per10k}\mathopen{}\left(w - a,\,w\right) + 1 \land \frac{\mathrm{mgO2} \cdot 100}{2 \cdot \mathrm{mgH2}} = 793 \land \mathrm{per10k}\mathopen{}\left(2 \cdot \mathrm{mgH2},\,2 \cdot \mathrm{mgH2O}\right) = 1119 \land \mathrm{per10k}\mathopen{}\left(\mathrm{mgO2},\,2 \cdot \mathrm{mgH2O}\right) = 8880 \land 2 \cdot \mathrm{mgH2O} - 2 \cdot \mathrm{mgH2} = \mathrm{mgO2}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-mass_is_conserved_at_every_scale_so_the_loop_cannot_make_water">
<p class="thm-label"><strong>Theorem 330</strong> (<code>mass_is_conserved_at_every_scale_so_the_loop_cannot_make_water</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_mass_is_conserved_at_every_scale_so_the_loop_cannot_make_water.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>100</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>=</mo><mrow><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>⋅</mo><mi>mgH2</mi></mrow><mo>+</mo><mrow><mi>n</mi><mo>⋅</mo><mi>mgO2</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>100</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>n</mi><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>=</mo><mrow><mrow><mi>n</mi><mo>⋅</mo><mi>mgH2</mi></mrow><mo>+</mo><mrow><mi>n</mi><mo>⋅</mo><mi>mgO2</mi></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 100).all (fun n =&gt; 2 * n * mgH2O == 2 * n * mgH2 + n * mgO2) ∧ ¬ ((List.range' 1 100).all (fun n =&gt; n * mgH2O == n * mgH2 + n * mgO2))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,100\},\; 2 \cdot n \cdot \mathrm{mgH2O} = 2 \cdot n \cdot \mathrm{mgH2} + n \cdot \mathrm{mgO2} \land \lnot \forall n \in \{1,\dots,100\},\; n \cdot \mathrm{mgH2O} = n \cdot \mathrm{mgH2} + n \cdot \mathrm{mgO2}</code></pre></details>
</div>
<p class="thm-remark">── 8 · MASS IS CONSERVED AT EVERY SCALE — so the loop CANNOT MAKE WATER. Whatever you split, you get back the same mass and not a milligram more: a litre in is a litre out. This is the statement that fixes what the machine is. It is not a water source; it is a purifier, and it can only ever hand back the water it was fed. Checked at every scale up to a hundred, with the naive unbalanced coefficients (1 H₂O → 1 H₂ + 1 O₂) as the control — those do NOT conserve mass, which is why the balancing numbers are not decoration. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-one_litre_split_returns_one_litre_burnt">
<p class="thm-label"><strong>Theorem 331</strong> (<code>one_litre_split_returns_one_litre_burnt</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_one_litre_split_returns_one_litre_burnt.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>111900</mn><mo>+</mo><mn>888100</mn></mrow><mo>=</mo><mn>1000000</mn></mrow><mo>∧</mo><mrow><mfrac><mrow><mn>888100</mn><mo>⋅</mo><mn>100</mn></mrow><mn>111900</mn></mfrac><mo>=</mo><mn>793</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>111900 + 888100 = 1000000 ∧ 888100 * 100 / 111900 = 793</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>111900 + 888100 = 1000000 \land \frac{888100 \cdot 100}{111900} = 793</code></pre></details>
</div>
<p class="thm-remark">── 9 · ONE LITRE IN, ONE LITRE OUT, in milligrams: a kilogram of water splits into 111.9 g of hydrogen and 888.1 g of oxygen, and burning those returns the kilogram. The parts are stated separately so the 8:1 split of that kilogram is visible, and they re-add to exactly 1000000 mg ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-only_oxy_hydrogen_burns_without_admitting_nitrogen">
<p class="thm-label"><strong>Theorem 332</strong> (<code>only_oxy_hydrogen_burns_without_admitting_nitrogen</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_only_oxy_hydrogen_burns_without_admitting_nitrogen.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mfrac><mrow><mn>7808</mn><mo>⋅</mo><mn>100</mn></mrow><mn>2095</mn></mfrac><mo>=</mo><mn>372</mn></mrow><mo>∧</mo><mrow><mrow><mn>0</mn><mo>⋅</mo><mn>372</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mn>372</mn><mo>=</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>7808 * 100 / 2095 = 372 ∧ 0 * 372 = 0 ∧ ¬ (372 = 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{7808 \cdot 100}{2095} = 372 \land 0 \cdot 372 = 0 \land \lnot 372 = 0</code></pre></details>
</div>
<p class="thm-remark">── 10 · WHY THE EXHAUST IS ONLY WATER — and the single condition on it. Burning in the co-produced oxygen admits no nitrogen at all. Burning in AIR drags 3.72 moles of N₂ through the flame for every mole of oxygen used (air is 78.08% N₂ against 20.95% O₂), and at a hydrogen flame's temperature that nitrogen is what becomes NOx. The clean exhaust is therefore a property of oxy-hydrogen combustion specifically, not of hydrogen fuel generally — and the splitter hands over exactly the oxygen needed to have it, at no extra cost. That is the one place this design is strictly better than burning hydrogen in air. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-splitting_then_burning_is_the_identity_at_the_ideal">
<p class="thm-label"><strong>Theorem 333</strong> (<code>splitting_then_burning_is_the_identity_at_the_ideal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_splitting_then_burning_is_the_identity_at_the_ideal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>999</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>burnE</mi><mo>(</mo><mrow><mi>splitE</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>e</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>burnYield</mi><mo>,</mo><mi>splitCost</mi><mo>)</mo></mrow><mo>=</mo><mn>23</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 1000).all (fun e =&gt; burnE (splitE e) == e) ∧ pct burnYield splitCost = 23</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \{0,\dots,999\},\; \mathrm{burnE}\mathopen{}\left(\mathrm{splitE}\mathopen{}\left(e\right)\right) = e \land \mathrm{pct}\mathopen{}\left(\mathrm{burnYield},\,\mathrm{splitCost}\right) = 23</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-splitting_then_burning_is_the_identity_at_every_ledger_value">
<p class="thm-label"><strong>Theorem 334</strong> (<code>splitting_then_burning_is_the_identity_at_every_ledger_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_splitting_then_burning_is_the_identity_at_every_ledger_value.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ e : Nat, burnE (splitE e) = e</code></pre>
</div>
<p class="thm-remark">── AND AT EVERY LEDGER VALUE, NOT A THOUSAND OF THEM. The theorem above decides the round trip below 1000; this one PROVES it for every natural number, by the cancellation law of addition. A proof, not an exhaustion — so it carries the standard axiom propext that core's lemmas rest on, and lean.ts prints it. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_gas_volume_reads_back_its_moles">
<p class="thm-label"><strong>Theorem 335</strong> (<code>the_gas_volume_reads_back_its_moles</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_gas_volume_reads_back_its_moles.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>999</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>molesOf</mi><mo>(</mo><mrow><mi>litresOf</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≤</mo><mi>m</mi></mrow><mo>∧</mo><mrow><mi>m</mi><mo>≤</mo><mrow><mrow><mi>molesOf</mi><mo>(</mo><mrow><mi>litresOf</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mi>molH2</mi><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><mi>molO2</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>litresOf</mi><mo>(</mo><mi>molH2</mi><mo>)</mo></mrow><mo>=</mo><mn>11117</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>litresOf</mi><mo>(</mo><mi>molO2</mi><mo>)</mo></mrow><mo>=</mo><mn>5558</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mrow><mi>litresOf</mi><mo>(</mo><mi>molH2</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>litresOf</mi><mo>(</mo><mi>molO2</mi><mo>)</mo></mrow></mrow><mn>9</mn></mfrac><mo>=</mo><mn>1852</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 1000).all (fun m =&gt; molesOf (litresOf m) ≤ m &amp;&amp; m ≤ molesOf (litresOf m) + 1) ∧ molH2 = 2 * molO2 ∧ litresOf molH2 = 11117 ∧ litresOf molO2 = 5558 ∧ (litresOf molH2 + litresOf molO2) / 9 = 1852</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{0,\dots,999\},\; \mathrm{molesOf}\mathopen{}\left(\mathrm{litresOf}\mathopen{}\left(m\right)\right) \le m \land m \le \mathrm{molesOf}\mathopen{}\left(\mathrm{litresOf}\mathopen{}\left(m\right)\right) + 1 \land \mathrm{molH2} = 2 \cdot \mathrm{molO2} \land \mathrm{litresOf}\mathopen{}\left(\mathrm{molH2}\right) = 11117 \land \mathrm{litresOf}\mathopen{}\left(\mathrm{molO2}\right) = 5558 \land \frac{\mathrm{litresOf}\mathopen{}\left(\mathrm{molH2}\right) + \mathrm{litresOf}\mathopen{}\left(\mathrm{molO2}\right)}{9} = 1852</code></pre></details>
</div>
<p class="thm-remark">── 12 · THE EXPANSION. Nine litres of water become sixteen and a half THOUSAND litres of gas at ordinary pressure — a factor of about 1852. The volume reads back its moles to within one at every mole count below a thousand, so the litres below are the law's instances, not typed figures. This is the single hardest fact in the design: the fuel is not dense, it is enormous. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-two_parts_in_three_is_two_thirds_at_every_scale">
<p class="thm-label"><strong>Theorem 336</strong> (<code>two_parts_in_three_is_two_thirds_at_every_scale</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_two_parts_in_three_is_two_thirds_at_every_scale.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>500</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>m</mi></mrow><mo>,</mo><mrow><mn>3</mn><mo>⋅</mo><mi>m</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>66</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>molH2</mi><mo>,</mo><mrow><mi>molH2</mi><mo>+</mo><mi>molO2</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>66</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2</mi></mrow><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><mi>mgH2O</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>11</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 500).all (fun m =&gt; pct (2 * m) (3 * m) == 66) ∧ pct molH2 (molH2 + molO2) = 66 ∧ pct (2 * mgH2) (2 * mgH2O) = 11</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{1,\dots,500\},\; \mathrm{pct}\mathopen{}\left(2 \cdot m,\,3 \cdot m\right) = 66 \land \mathrm{pct}\mathopen{}\left(\mathrm{molH2},\,\mathrm{molH2} + \mathrm{molO2}\right) = 66 \land \mathrm{pct}\mathopen{}\left(2 \cdot \mathrm{mgH2},\,2 \cdot \mathrm{mgH2O}\right) = 11</code></pre></details>
</div>
<p class="thm-remark">── 13 · AND THE VOLUME IS MOSTLY THE LIGHT HALF. Two parts in three is two thirds at EVERY scale, so the hydrogen's share of the volume does not depend on how much is made — and that share carries about a ninth of the mass. The tank is sized by the part that weighs almost nothing. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 500 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_energy_per_litre_multiplies_back_to_the_energy">
<p class="thm-label"><strong>Theorem 337</strong> (<code>the_energy_per_litre_multiplies_back_to_the_energy</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_energy_per_litre_multiplies_back_to_the_energy.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>l</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>30</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mfrac><mrow><mi>whPerKgH2</mi><mo>⋅</mo><mn>100</mn></mrow><mi>l</mi></mfrac><mo>⋅</mo><mi>l</mi></mrow><mo>≤</mo><mrow><mi>whPerKgH2</mi><mo>⋅</mo><mn>100</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>whPerKgH2</mi><mo>⋅</mo><mn>100</mn></mrow><mo>&lt;</mo><mrow><mrow><mfrac><mrow><mi>whPerKgH2</mi><mo>⋅</mo><mn>100</mn></mrow><mi>l</mi></mfrac><mo>+</mo><mn>1</mn></mrow><mo>⋅</mo><mi>l</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>whPerKgH2</mi><mo>⋅</mo><mn>100</mn></mrow><mrow><mi>litresOf</mi><mo>(</mo><mi>molH2</mi><mo>)</mo></mrow></mfrac><mo>=</mo><mn>299</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>petrolWhL</mi><mo>⋅</mo><mn>100</mn></mrow><mn>299</mn></mfrac><mo>=</mo><mn>3244</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 30).all (fun l =&gt; (whPerKgH2 * 100 / l) * l ≤ whPerKgH2 * 100 &amp;&amp; whPerKgH2 * 100 &lt; (whPerKgH2 * 100 / l + 1) * l) ∧ whPerKgH2 * 100 / litresOf molH2 = 299 ∧ petrolWhL * 100 / 299 = 3244</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall l \in \{1,\dots,30\},\; \frac{\mathrm{whPerKgH2} \cdot 100}{l} \cdot l \le \mathrm{whPerKgH2} \cdot 100 \land \mathrm{whPerKgH2} \cdot 100 &lt; \frac{\mathrm{whPerKgH2} \cdot 100}{l} + 1 \cdot l \land \frac{\mathrm{whPerKgH2} \cdot 100}{\mathrm{litresOf}\mathopen{}\left(\mathrm{molH2}\right)} = 299 \land \frac{\mathrm{petrolWhL} \cdot 100}{299} = 3244</code></pre></details>
</div>
<p class="thm-remark">── 14 · UNCOMPRESSED, IT IS HOPELESS BY VOLUME — about 2.99 Wh per litre against petrol's 9700, a factor of over three thousand. The energy per litre is a floor division that multiplies back to the energy at every volume up to thirty litres; stated in hundredths of a watt-hour so the small number is not rounded to nothing. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 30 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-compression_scales_the_energy_per_litre_linearly">
<p class="thm-label"><strong>Theorem 338</strong> (<code>compression_scales_the_energy_per_litre_linearly</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_compression_scales_the_energy_per_litre_linearly.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mn>2</mn><mo>⋅</mo><mrow><mi>whPerLitreAt</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow></mrow><mo>≤</mo><mrow><mi>whPerLitreAt</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>k</mi></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>whPerLitreAt</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>k</mi></mrow><mo>)</mo></mrow><mo>≤</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mrow><mi>whPerLitreAt</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>whPerLitreAt</mi><mo>(</mo><mn>42</mn><mo>)</mo></mrow><mo>=</mo><mn>1398</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>petrolWhL</mi><mrow><mi>whPerLitreAt</mi><mo>(</mo><mn>42</mn><mo>)</mo></mrow></mfrac><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 100).all (fun k =&gt; 2 * whPerLitreAt k ≤ whPerLitreAt (2 * k) &amp;&amp; whPerLitreAt (2 * k) ≤ 2 * whPerLitreAt k + 1) ∧ whPerLitreAt 42 = 1398 ∧ petrolWhL / whPerLitreAt 42 = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,99\},\; 2 \cdot \mathrm{whPerLitreAt}\mathopen{}\left(k\right) \le \mathrm{whPerLitreAt}\mathopen{}\left(2 \cdot k\right) \land \mathrm{whPerLitreAt}\mathopen{}\left(2 \cdot k\right) \le 2 \cdot \mathrm{whPerLitreAt}\mathopen{}\left(k\right) + 1 \land \mathrm{whPerLitreAt}\mathopen{}\left(42\right) = 1398 \land \frac{\mathrm{petrolWhL}}{\mathrm{whPerLitreAt}\mathopen{}\left(42\right)} = 6</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-a_ratio_and_its_reciprocal_multiply_back_to_the_whole">
<p class="thm-label"><strong>Theorem 339</strong> (<code>a_ratio_and_its_reciprocal_multiply_back_to_the_whole</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_a_ratio_and_its_reciprocal_multiply_back_to_the_whole.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>40</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mn>1</mn><mo>+</mo><mi>b</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>pct</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>pct</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo></mrow></mrow><mo>≤</mo><mn>10000</mn></mrow><mo>∧</mo><mrow><mn>10000</mn><mo>&lt;</mo><mrow><mrow><mrow><mi>pct</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow><mo>⋅</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>splitCost</mi><mo>,</mo><mi>burnYield</mi><mo>)</mo></mrow><mo>=</mo><mn>433</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>burnYield</mi><mo>,</mo><mi>splitCost</mi><mo>)</mo></mrow><mo>=</mo><mn>23</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mn>9</mn><mo>⋅</mo><mn>1000</mn></mrow><mfrac><mi>burnYield</mi><mn>1000</mn></mfrac></mfrac><mo>=</mo><mn>750</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 40).all (fun b =&gt; (List.range' 1 b).all (fun a =&gt; pct a b * pct b a ≤ 10000 &amp;&amp; 10000 &lt; (pct a b + 1) * (pct b a + 1))) ∧ pct splitCost burnYield = 433 ∧ pct burnYield splitCost = 23 ∧ 9 * 1000 / (burnYield / 1000) = 750</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{1,\dots,40\},\; \forall a \in \{1,\dots,1+b-1\},\; \mathrm{pct}\mathopen{}\left(a,\,b\right) \cdot \mathrm{pct}\mathopen{}\left(b,\,a\right) \le 10000 \land 10000 &lt; \mathrm{pct}\mathopen{}\left(a,\,b\right) + 1 \cdot \mathrm{pct}\mathopen{}\left(b,\,a\right) + 1 \land \mathrm{pct}\mathopen{}\left(\mathrm{splitCost},\,\mathrm{burnYield}\right) = 433 \land \mathrm{pct}\mathopen{}\left(\mathrm{burnYield},\,\mathrm{splitCost}\right) = 23 \land \frac{9 \cdot 1000}{\frac{\mathrm{burnYield}}{1000}} = 750</code></pre></details>
</div>
<p class="thm-remark">── 16 · THE THROUGHPUT, per unit actually delivered. Every kilowatt-hour out costs 4.33 in, and that figure is the reciprocal of the 23% returned: a percentage and its reciprocal multiply back to the whole, within their truncations, at every pair checked. The water cycled per delivered kWh — three quarters of a litre — comes back, so it sizes the loop, not a supply. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_loss_and_the_yield_read_back_the_input">
<p class="thm-label"><strong>Theorem 340</strong> (<code>the_loss_and_the_yield_read_back_the_input</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_loss_and_the_yield_read_back_the_input.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>60</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>y</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>c</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mi>c</mi><mo>-</mo><mi>y</mi></mrow><mo>+</mo><mi>y</mi></mrow><mo>=</mo><mi>c</mi></mrow><mo>∧</mo><mrow><mn>99</mn><mo>≤</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mrow><mi>c</mi><mo>-</mo><mi>y</mi></mrow><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>pct</mi><mo>(</mo><mi>y</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>pct</mi><mo>(</mo><mrow><mi>c</mi><mo>-</mo><mi>y</mi></mrow><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>pct</mi><mo>(</mo><mi>y</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow><mo>≤</mo><mn>100</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>splitCost</mi><mo>-</mo><mi>burnYield</mi></mrow><mo>=</mo><mn>40000</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mrow><mi>splitCost</mi><mo>-</mo><mi>burnYield</mi></mrow><mo>,</mo><mi>splitCost</mi><mo>)</mo></mrow><mo>=</mo><mn>76</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pct</mi><mo>(</mo><mi>burnYield</mi><mo>,</mo><mi>splitCost</mi><mo>)</mo></mrow><mo>=</mo><mn>23</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 60).all (fun c =&gt; (List.range (c + 1)).all (fun y =&gt; (c - y) + y == c &amp;&amp; 99 ≤ pct (c - y) c + pct y c &amp;&amp; pct (c - y) c + pct y c ≤ 100)) ∧ splitCost - burnYield = 40000 ∧ pct (splitCost - burnYield) splitCost = 76 ∧ pct burnYield splitCost = 23</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{1,\dots,60\},\; \forall y \in \{0,\dots,c + 1-1\},\; c - y + y = c \land 99 \le \mathrm{pct}\mathopen{}\left(c - y,\,c\right) + \mathrm{pct}\mathopen{}\left(y,\,c\right) \land \mathrm{pct}\mathopen{}\left(c - y,\,c\right) + \mathrm{pct}\mathopen{}\left(y,\,c\right) \le 100 \land \mathrm{splitCost} - \mathrm{burnYield} = 40000 \land \mathrm{pct}\mathopen{}\left(\mathrm{splitCost} - \mathrm{burnYield},\,\mathrm{splitCost}\right) = 76 \land \mathrm{pct}\mathopen{}\left(\mathrm{burnYield},\,\mathrm{splitCost}\right) = 23</code></pre></details>
</div>
<p class="thm-remark">── 17 · WHERE THE REST GOES. What is lost and what is returned add back to the input, and their two percentages re-add to the whole or to one short of it, at every input and yield checked. Forty of every fifty-two kilowatt-hours leave as heat — 76% — which a building that wants hot water can recover; vented to the air it is simply the loss. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_residue_ratio_is_the_same_at_every_volume">
<p class="thm-label"><strong>Theorem 341</strong> (<code>the_residue_ratio_is_the_same_at_every_volume</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_residue_ratio_is_the_same_at_every_volume.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>l</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>200</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>residueMg</mi><mo>(</mo><mi>l</mi><mo>,</mo><mi>tdsSeawater</mi><mo>)</mo></mrow><mo>=</mo><mrow><mn>700</mn><mo>⋅</mo><mrow><mi>residueMg</mi><mo>(</mo><mi>l</mi><mo>,</mo><mi>tdsTapWater</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>residueMg</mi><mo>(</mo><mn>100</mn><mo>,</mo><mi>tdsSeawater</mi><mo>)</mo></mrow><mn>1000</mn></mfrac><mo>=</mo><mn>3500</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>residueMg</mi><mo>(</mo><mn>100</mn><mo>,</mo><mi>tdsTapWater</mi><mo>)</mo></mrow><mn>1000</mn></mfrac><mo>=</mo><mn>5</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 200).all (fun l =&gt; residueMg l tdsSeawater == 700 * residueMg l tdsTapWater) ∧ residueMg 100 tdsSeawater / 1000 = 3500 ∧ residueMg 100 tdsTapWater / 1000 = 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall l \in \{1,\dots,200\},\; \mathrm{residueMg}\mathopen{}\left(l,\,\mathrm{tdsSeawater}\right) = 700 \cdot \mathrm{residueMg}\mathopen{}\left(l,\,\mathrm{tdsTapWater}\right) \land \frac{\mathrm{residueMg}\mathopen{}\left(100,\,\mathrm{tdsSeawater}\right)}{1000} = 3500 \land \frac{\mathrm{residueMg}\mathopen{}\left(100,\,\mathrm{tdsTapWater}\right)}{1000} = 5</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_atoms_read_back_from_the_mass">
<p class="thm-label"><strong>Theorem 342</strong> (<code>the_atoms_read_back_from_the_mass</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_atoms_read_back_from_the_mass.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>h</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>o</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>atomsOf</mi><mo>(</mo><mrow><mi>mass</mi><mo>(</mo><mi>h</mi><mo>,</mo><mi>o</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>some</mi><mo>(</mo><mrow><mo>(</mo><mi>h</mi><mo>,</mo><mi>o</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>atomsOf</mi><mo>(</mo><mi>mgH2</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>some</mi><mo>(</mo><mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>atomsOf</mi><mo>(</mo><mi>mgO2</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>some</mi><mo>(</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>atomsOf</mi><mo>(</mo><mi>mgH2O</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>some</mi><mo>(</mo><mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 10).all (fun h =&gt; (List.range 10).all (fun o =&gt; atomsOf (mass h o) == some (h, o))) ∧ atomsOf mgH2 = some (2, 0) ∧ atomsOf mgO2 = some (0, 2) ∧ atomsOf mgH2O = some (2, 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall h \in \{0,\dots,9\},\; \forall o \in \{0,\dots,9\},\; \mathrm{atomsOf}\mathopen{}\left(\mathrm{mass}\mathopen{}\left(h,\,o\right)\right) = \mathrm{some}\mathopen{}\left(\left(h,\,o\right)\right) \land \mathrm{atomsOf}\mathopen{}\left(\mathrm{mgH2}\right) = \mathrm{some}\mathopen{}\left(\left(2,\,0\right)\right) \land \mathrm{atomsOf}\mathopen{}\left(\mathrm{mgO2}\right) = \mathrm{some}\mathopen{}\left(\left(0,\,2\right)\right) \land \mathrm{atomsOf}\mathopen{}\left(\mathrm{mgH2O}\right) = \mathrm{some}\mathopen{}\left(\left(2,\,1\right)\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-two_parts_in_three_is_two_thirds_at_every_scale_for_every_m">
<p class="thm-label"><strong>Theorem 343</strong> (<code>two_parts_in_three_is_two_thirds_at_every_scale_for_every_m</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_two_parts_in_three_is_two_thirds_at_every_scale_for_every_m.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, 0 &lt; m → pct (2 * m) (3 * m) = 66</code></pre>
</div>
<p class="thm-remark">── the capped row above, proved for every value — no bound ─────────────────────────────────────────────────── two_parts_in_three_is_two_thirds_at_every_scale checked 1 ≤ m ≤ 500; this proves the ratio part for every m.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-burning_then_splitting_is_the_identity_above_the_bond">
<p class="thm-label"><strong>Theorem 344</strong> (<code>burning_then_splitting_is_the_identity_above_the_bond</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_burning_then_splitting_is_the_identity_above_the_bond.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ e : Nat, bondHundredthsKJ ≤ e → splitE (burnE e) = e</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-one_part_in_three_is_a_third_at_every_scale_for_every_m">
<p class="thm-label"><strong>Theorem 345</strong> (<code>one_part_in_three_is_a_third_at_every_scale_for_every_m</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_one_part_in_three_is_a_third_at_every_scale_for_every_m.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, 0 &lt; m → pct m (3 * m) = 33</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_gas_volume_reads_back_its_moles_for_every_m">
<p class="thm-label"><strong>Theorem 346</strong> (<code>the_gas_volume_reads_back_its_moles_for_every_m</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_gas_volume_reads_back_its_moles_for_every_m.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, molesOf (litresOf m) ≤ m ∧ m ≤ molesOf (litresOf m) + 1</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_mass_names_the_molecule_below_5333_hydrogens">
<p class="thm-label"><strong>Theorem 347</strong> (<code>the_mass_names_the_molecule_below_5333_hydrogens</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_mass_names_the_molecule_below_5333_hydrogens.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ h o h' o' : Nat, h &lt; 5333 → h' &lt; 5333 → mass h o = mass h' o' → h = h' ∧ o = o'</code></pre>
</div>
<p class="thm-remark">── reflections, from the extra batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── the_atoms_read_back_from_the_mass holds on h, o &lt; 10 and is FALSE in general: mass 5333 0 = mass 0 336. The true boundary: below 5333 hydrogens the mass names the molecule, at any oxygen count.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-the_boundary_is_sharp">
<p class="thm-label"><strong>Theorem 348</strong> (<code>the_boundary_is_sharp</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_the_boundary_is_sharp.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>mass</mi><mo>(</mo><mn>5333</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mrow><mi>mass</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>336</mn><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>mass 5333 0 = mass 0 336</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{mass}\mathopen{}\left(5333,\,0\right) = \mathrm{mass}\mathopen{}\left(0,\,336\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-energy-a_floor_division_multiplies_back_within_one_divisor">
<p class="thm-label"><strong>Theorem 349</strong> (<code>a_floor_division_multiplies_back_within_one_divisor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_energy_a_floor_division_multiplies_back_within_one_divisor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a l : Nat, 0 &lt; l → a / l * l ≤ a ∧ a &lt; (a / l + 1) * l</code></pre>
</div>
<p class="thm-remark">the_cost_per_litre / the_energy_per_litre / hexbits rows: a floor division multiplies back within one divisor</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
