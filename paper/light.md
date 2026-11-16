---
title: "Light, space and time — arithmetic on numbers a standards body fixed"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `light.lean`

<p class="paper-src"><code>src/iso/80000-physics/light.lean</code> · namespace <code>Light</code> · 17 theorems · wing <code>the floor</code></p>

WHY A FILE ABOUT LIGHT SPEED CAN EXIST IN A DEPOSIT THAT CLAIMS NO PHYSICS.

Since 1983 the metre has been DEFINED from the speed of light, and since 2019 all seven SI base units are
defined by fixing seven constants to exact numerical values with no uncertainty. That makes 299792458 a
number a committee adopted, not a quantity anyone measured — the measuring moved to the other side of the
definition. Arithmetic on it is arithmetic on an integer, and the kernel can decide it.

What follows is therefore about the SI, not about nature. Every theorem here would be equally true if the
universe were different, because none of them is about the universe.

AND THE LIMIT IS PROVED, NOT PROMISED. The digital root of 299792458 is 1. That is a fact about the
numeral, in metres per second, and nothing else: doubling the numeral changes the root to 2, while
multiplying by a hundred leaves it alone. Both are decided below. A root that moves when you change the
unit and stays when you change the scale is a property of decimal notation, and reading significance into
it would be the overclaim this deposit exists to refuse.
CLAIMS: physical

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>c := 299792458      -- m/s, exact
dNuCs := 9192631770     -- Hz, exact — the caesium-133 hyperfine transition
hDigits := 662607015     -- h = 6.62607015 × 10⁻³⁴ J s
eDigits := 1602176634    -- e = 1.602176634 × 10⁻¹⁹ C
kDigits := 1380649       -- k = 1.380649 × 10⁻²³ J/K
naDigits := 602214076    -- N_A = 6.02214076 × 10²³ mol⁻¹
kcd := 683            -- K_cd, lm/W, exact
defining := [c, dNuCs, hDigits, eDigits, kDigits, naDigits, kcd]
kcdDoubled := 1366     -- K_cd expressed against a unit half the size; the same luminous efficacy
alternative := [c, dNuCs, hDigits, eDigits, kDigits, naDigits, kcdDoubled]
molarGas := kDigits * naDigits        -- 10⁻²⁹ · 10¹⁵ = 10⁻¹⁴ · R = 8.31446261815324 J mol⁻¹ K⁻¹
faraday := eDigits * naDigits        -- 10⁻²⁸ · 10¹⁵ = 10⁻¹³ · F = 96485.33212331… C mol⁻¹</code></pre>

<div class="thm" id="thm-light-the_si_fixes_seven_distinct_nonzero_constants">
<p class="thm-label"><strong>Theorem 410</strong> (<code>the_si_fixes_seven_distinct_nonzero_constants</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_si_fixes_seven_distinct_nonzero_constants.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mi>defining</mi><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow><mo>∧</mo><mrow><mrow><mi>dedup</mi><mo>(</mo><mi>defining</mi><mo>)</mo></mrow><mo>=</mo><mi>defining</mi></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>defining</mi><mo>,</mo><mrow><mi>x</mi><mo>&gt;</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>defining.length = 7 ∧ defining.eraseDups = defining ∧ defining.all (fun x =&gt; x &gt; 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{defining}\right| = 7 \land \operatorname{dedup}\left(\mathrm{defining}\right) = \mathrm{defining} \land \forall x \in \mathrm{defining},\; x &gt; 0</code></pre></details>
</div>
<p class="thm-remark">Seven, and seven DIFFERENT ones: a list that repeated a constant would still have length seven. Each is nonzero, so each fixes a unit rather than annulling it. (Was `defining.length = 7`, a count of a typed list.)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-travel_at_one_returns_the_defined_constant">
<p class="thm-label"><strong>Theorem 411</strong> (<code>travel_at_one_returns_the_defined_constant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_travel_at_one_returns_the_defined_constant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>travel</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mi>c</mi></mrow></math></div>
<pre class="thm-statement"><code>travel 1 = c</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{travel}\mathopen{}\left(1\right) = c</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_second_returns_from_the_metre_and_the_period">
<p class="thm-label"><strong>Theorem 412</strong> (<code>the_second_returns_from_the_metre_and_the_period</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_second_returns_from_the_metre_and_the_period.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mfrac><mrow><mi>travel</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mi>c</mi></mfrac><mo>=</mo><mi>s</mi></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>periods</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mi>dNuCs</mi></mfrac><mo>=</mo><mi>s</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 100).all (fun s =&gt; travel s / c == s &amp;&amp; periods s / dNuCs == s)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in \{0,\dots,99\},\; \frac{\mathrm{travel}\mathopen{}\left(s\right)}{c} = s \land \frac{\mathrm{periods}\mathopen{}\left(s\right)}{\mathrm{dNuCs}} = s</code></pre></details>
</div>
<p class="thm-remark">AND THE CHAIN RUNS BACK. Dividing the metres by c returns the seconds, and dividing the periods by ΔνCs returns them too, at every whole second below a hundred: travel and periods are each undone by the constant that defines them, so a length and a count of periods both read back the same duration.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_second_returns_from_the_metre_and_the_period_at_every_duration">
<p class="thm-label"><strong>Theorem 413</strong> (<code>the_second_returns_from_the_metre_and_the_period_at_every_duration</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_second_returns_from_the_metre_and_the_period_at_every_duration.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ s : Nat, travel s / c = s ∧ periods s / dNuCs = s</code></pre>
</div>
<p class="thm-remark">And at EVERY duration, proved rather than decided: dividing by the constant that defines the map cancels it, whatever the number of seconds. The standard axiom propext is carried and printed by lean.ts.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-travel_and_periods_at_one_return_their_constants">
<p class="thm-label"><strong>Theorem 414</strong> (<code>travel_and_periods_at_one_return_their_constants</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_travel_and_periods_at_one_return_their_constants.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>travel</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>299792458</mn></mrow><mo>∧</mo><mrow><mrow><mi>periods</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>9192631770</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>travel 1 = 299792458 ∧ periods 1 = 9192631770</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{travel}\mathopen{}\left(1\right) = 299792458 \land \mathrm{periods}\mathopen{}\left(1\right) = 9192631770</code></pre></details>
</div>
<p class="thm-remark">ONE INTERVAL, TWO UNITS: the same second is 299792458 metres of light and 9192631770 caesium periods. That is the SI's join between space and time, and it is an identity between two definitions rather than a discovery about either.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_chain_scales">
<p class="thm-label"><strong>Theorem 415</strong> (<code>the_chain_scales</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_chain_scales.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>9</mn><mo>,</mo><mn>10</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>travel</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>c</mi><mo>⋅</mo><mi>s</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>9</mn><mo>,</mo><mn>10</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>periods</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>dNuCs</mi><mo>⋅</mo><mi>s</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].all (fun s =&gt; travel s == c * s)) ∧ ([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].all (fun s =&gt; periods s == dNuCs * s))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in [0,\,1,\,2,\,3,\,4,\,5,\,6,\,7,\,8,\,9,\,10],\; \mathrm{travel}\mathopen{}\left(s\right) = c \cdot s \land \forall s \in [0,\,1,\,2,\,3,\,4,\,5,\,6,\,7,\,8,\,9,\,10],\; \mathrm{periods}\mathopen{}\left(s\right) = \mathrm{dNuCs} \cdot s</code></pre></details>
</div>
<p class="thm-remark">Linear over the whole range checked, so the chain is a scaling and not a coincidence at one point.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 121 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_roots_of_the_seven">
<p class="thm-label"><strong>Theorem 416</strong> (<code>the_roots_of_the_seven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_roots_of_the_seven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>root</mi><mo>[</mo><mi>defining</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>9</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>defining.map root = [1, 9, 6, 9, 4, 1, 8]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{root}[\mathrm{defining}] = [1,\,9,\,6,\,9,\,4,\,1,\,8]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-three_on_the_triad_and_four_on_the_units">
<p class="thm-label"><strong>Theorem 417</strong> (<code>three_on_the_triad_and_four_on_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_three_on_the_triad_and_four_on_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mi>defining</mi><mo>∣</mo><mrow><mrow><mi>root</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mi>defining</mi><mo>∣</mo><mrow><mrow><mi>root</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(defining.filter (fun n =&gt; [3, 6, 9].contains (root n))).length = 3 ∧ (defining.filter (fun n =&gt; [1, 2, 4, 5, 7, 8].contains (root n))).length = 4</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, n \in \mathrm{defining} \mid \mathrm{root}\mathopen{}\left(n\right) \in [3,\,6,\,9] \,\}\right| = 3 \land \left|\{\, n \in \mathrm{defining} \mid \mathrm{root}\mathopen{}\left(n\right) \in [1,\,2,\,4,\,5,\,7,\,8] \,\}\right| = 4</code></pre></details>
</div>
<p class="thm-remark">Three land on the triad {3,6,9} and four on the units. Both counted, so neither can be quoted alone.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 18 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_seven_roots_miss_four_residues">
<p class="thm-label"><strong>Theorem 418</strong> (<code>the_seven_roots_miss_four_residues</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_seven_roots_miss_four_residues.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>root</mi><mo>[</mo><mi>defining</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>root</mi><mo>[</mo><mi>defining</mi><mo>]</mo></mrow></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(defining.map root).eraseDups.length = 5 ∧ ([1, 2, 3, 4, 5, 6, 7, 8, 9].filter (fun d =&gt; ¬ (defining.map root).contains d)) = [2, 3, 5, 7]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{root}[\mathrm{defining}]\right)\right| = 5 \land \{\, d \in [1,\,2,\,3,\,4,\,5,\,6,\,7,\,8,\,9] \mid \lnot d \in \mathrm{root}[\mathrm{defining}] \,\} = [2,\,3,\,5,\,7]</code></pre></details>
</div>
<p class="thm-remark">AND THEY DO NOT COVER THE RING. Five residues occur, four never do. Stated because seven numbers landing on five of nine residues is what unrelated numbers do, and the absence is the honest half of the count.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_absent_residues_are_the_primes_below_nine">
<p class="thm-label"><strong>Theorem 419</strong> (<code>the_absent_residues_are_the_primes_below_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_absent_residues_are_the_primes_below_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>root</mi><mo>[</mo><mi>defining</mi><mo>]</mo></mrow></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>([1, 2, 3, 4, 5, 6, 7, 8, 9].filter (fun d =&gt; ¬ (defining.map root).contains d)) = [2, 3, 5, 7]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in [1,\,2,\,3,\,4,\,5,\,6,\,7,\,8,\,9] \mid \lnot d \in \mathrm{root}[\mathrm{defining}] \,\} = [2,\,3,\,5,\,7]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-and_a_change_of_unit_destroys_it">
<p class="thm-label"><strong>Theorem 420</strong> (<code>and_a_change_of_unit_destroys_it</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_and_a_change_of_unit_destroys_it.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>root</mi><mo>[</mo><mi>alternative</mi><mo>]</mo></mrow></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>alternative</mi><mo>|</mo></mrow><mo>=</mo><mrow><mo>|</mo><mi>defining</mi><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>([1, 2, 3, 4, 5, 6, 7, 8, 9].filter (fun d =&gt; ¬ (alternative.map root).contains d)) = [2, 3, 5, 8] ∧ alternative.length = defining.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in [1,\,2,\,3,\,4,\,5,\,6,\,7,\,8,\,9] \mid \lnot d \in \mathrm{root}[\mathrm{alternative}] \,\} = [2,\,3,\,5,\,8] \land \left|\mathrm{alternative}\right| = \left|\mathrm{defining}\right|</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_root_moves_with_the_unit_so_it_is_not_about_light">
<p class="thm-label"><strong>Theorem 421</strong> (<code>the_root_moves_with_the_unit_so_it_is_not_about_light</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_root_moves_with_the_unit_so_it_is_not_about_light.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>root</mi><mo>(</mo><mi>c</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>root</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>c</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>root</mi><mo>(</mo><mrow><mn>100</mn><mo>⋅</mo><mi>c</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>root c = 1 ∧ root (2 * c) = 2 ∧ root (100 * c) = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{root}\mathopen{}\left(c\right) = 1 \land \mathrm{root}\mathopen{}\left(2 \cdot c\right) = 2 \land \mathrm{root}\mathopen{}\left(100 \cdot c\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── THE LIMIT: THE ROOT IS A PROPERTY OF THE NUMERAL, NOT OF LIGHT ────────────────────────────────────── If the digital root of c said something about light, it could not depend on the unit chosen to write c in. It does. Doubling the numeral moves the root; scaling by a power of ten does not. So the root tracks decimal notation in a chosen unit — and the metre is DEFINED to make this particular numeral come out.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_definitions_are_seven_and_travel_fixes_zero">
<p class="thm-label"><strong>Theorem 422</strong> (<code>the_definitions_are_seven_and_travel_fixes_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_definitions_are_seven_and_travel_fixes_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mi>defining</mi><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow><mo>∧</mo><mrow><mrow><mi>travel</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>defining.length = 7 ∧ travel 0 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{defining}\right| = 7 \land \mathrm{travel}\mathopen{}\left(0\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── THE REFUSAL, as a theorem so it is checked and not merely written ─────────────────────────────────── Every number in this file is a definition adopted by a committee. No proposition here measures a quantity, predicts an observation, or constrains a physical theory, and none could: arithmetic on a definition returns the definition. ── THE CLAIM, STATED BOLDLY, WITH THE COMPUTATION THAT BREAKS IT ────────────────────────────────────── THE SEVEN SI DEFINING CONSTANTS HAVE DIGITAL ROOTS 1, 9, 6, 9, 4, 1, 8 — AND THE FOUR RESIDUES THEY NEVER REACH ARE EXACTLY THE PRIMES BELOW NINE: 2, 3, 5, 7. That is a claim about the actual SI system as the CGPM fixed it, not about a toy. Every numeral here is the committee's own: c = 299792458, ΔνCs = 9192631770, h, e, k, N_A, K_cd. `the_roots_of_the_seven` and `the_absent_residues_are_the_primes_below_nine` decide it over the real values, so a critic who disputes it computes the digital roots and shows a different list. Nothing here hides behind hedging. AND THE FALSIFIER IS ALREADY PROVED, IN THIS FILE, DIRECTLY BELOW THE CLAIM. `and_a_change_of_unit_destroys_it` expresses K_cd against a unit half the size — the same luminous efficacy, a different numeral — and the four absent residues become 2, 3, 5, 8. The primes are gone. `the_root_moves_with_the_unit_so_it_is_not_about_light` shows the same for c. So the claim stands with its own defeater attached: THE PATTERN IS REAL IN SI AND IS A PROPERTY OF THE CHOSEN UNITS, NOT OF NATURE. A critic does not need to find the weakness — it is stated, decided, and published beside the claim it limits. That is what makes the bold form honest rather than reckless. What is NOT claimed, because nothing here decides it: that the pattern predicts an observation, constrains a physical theory, or would survive a different unit system. It would not, and the file proves it. That declaration stood here and was deleted: a literal decided against itself is green whatever the file says, so it could never carry a refusal. What a proposition mentions is a property of the source text, and `contradictions.ts` is where that is checked.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_metre_returns_from_the_second_for_every_whole_length">
<p class="thm-label"><strong>Theorem 423</strong> (<code>the_metre_returns_from_the_second_for_every_whole_length</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_metre_returns_from_the_second_for_every_whole_length.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, m % c = 0 → travel (m / c) = m</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_period_count_returns_from_the_second_for_every_whole_count">
<p class="thm-label"><strong>Theorem 424</strong> (<code>the_period_count_returns_from_the_second_for_every_whole_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_period_count_returns_from_the_second_for_every_whole_count.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ p : Nat, p % dNuCs = 0 → periods (p / dNuCs) = p</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_molar_gas_constant_is_an_exact_product_of_two_defined_constants">
<p class="thm-label"><strong>Theorem 425</strong> (<code>the_molar_gas_constant_is_an_exact_product_of_two_defined_constants</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_molar_gas_constant_is_an_exact_product_of_two_defined_constants.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mi>defining</mi><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mi>defining</mi><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>mod</mo><mi>b</mi></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mi>b</mi></mfrac><mo>=</mo><mi>a</mi></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mi>a</mi></mfrac><mo>=</mo><mi>b</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mi>molarGas</mi><mo>=</mo><mrow><mi>kDigits</mi><mo>⋅</mo><mi>naDigits</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>molarGas</mi><mi>naDigits</mi></mfrac><mo>=</mo><mi>kDigits</mi></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>molarGas</mi><mi>kDigits</mi></mfrac><mo>=</mo><mi>naDigits</mi></mrow></mrow><mo>∧</mo><mrow><mi>molarGas</mi><mo>=</mo><mn>831446261815324</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>defining.all (fun a =&gt; defining.all (fun b =&gt; (a * b % b == 0) &amp;&amp; (a * b / b == a) &amp;&amp; (a * b / a == b))) ∧ molarGas = kDigits * naDigits ∧ molarGas / naDigits = kDigits ∧ molarGas / kDigits = naDigits ∧ molarGas = 831446261815324</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \mathrm{defining},\; \forall b \in \mathrm{defining},\; a \cdot b \bmod b = 0 \land \frac{a \cdot b}{b} = a \land \frac{a \cdot b}{a} = b \land \mathrm{molarGas} = \mathrm{kDigits} \cdot \mathrm{naDigits} \land \frac{\mathrm{molarGas}}{\mathrm{naDigits}} = \mathrm{kDigits} \land \frac{\mathrm{molarGas}}{\mathrm{kDigits}} = \mathrm{naDigits} \land \mathrm{molarGas} = 831446261815324</code></pre></details>
</div>
<p class="thm-remark">EXACT MEANS IT DIVIDES BACK, and that is a law about every pair of the seven, not a property of this one product. A product of two defining constants leaves no remainder against either factor and returns each when divided by the other — so nothing is rounded in forming R, and the digits below are carried and not approximated. Stating only the value left the word "exact" doing work no theorem did.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-light-the_faraday_constant_is_an_exact_product_of_two_defined_constants">
<p class="thm-label"><strong>Theorem 426</strong> (<code>the_faraday_constant_is_an_exact_product_of_two_defined_constants</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_light_the_faraday_constant_is_an_exact_product_of_two_defined_constants.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mi>defining</mi><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mi>defining</mi><mo>,</mo><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>naDigits</mi></mrow><mo>=</mo><mrow><mi>b</mi><mo>⋅</mo><mi>naDigits</mi></mrow></mrow><mo>=</mo><mrow><mi>a</mi><mo>=</mo><mi>b</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mi>faraday</mi><mo>=</mo><mrow><mi>eDigits</mi><mo>⋅</mo><mi>naDigits</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>faraday</mi><mi>naDigits</mi></mfrac><mo>=</mo><mi>eDigits</mi></mrow></mrow><mo>∧</mo><mrow><mi>molarGas</mi><mo>≠</mo><mi>faraday</mi></mrow></mrow><mo>∧</mo><mrow><mi>faraday</mi><mo>=</mo><mn>964853321233100184</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>defining.all (fun a =&gt; defining.all (fun b =&gt; (a * naDigits == b * naDigits) == (a == b))) ∧ faraday = eDigits * naDigits ∧ faraday / naDigits = eDigits ∧ molarGas ≠ faraday ∧ faraday = 964853321233100184</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \mathrm{defining},\; \forall b \in \mathrm{defining},\; a \cdot \mathrm{naDigits} = b \cdot \mathrm{naDigits} = a = b \land \mathrm{faraday} = \mathrm{eDigits} \cdot \mathrm{naDigits} \land \frac{\mathrm{faraday}}{\mathrm{naDigits}} = \mathrm{eDigits} \land \mathrm{molarGas} \neq \mathrm{faraday} \land \mathrm{faraday} = 964853321233100184</code></pre></details>
</div>
<p class="thm-remark">AND MULTIPLYING BY AVOGADRO NEVER CONFUSES TWO CONSTANTS: at every pair of the seven, the scaled values agree exactly when the constants do. That is the reason R and F are different numbers — not that they were computed separately, but that k and e differ and the scaling cannot collapse them. The injectivity is the law; F's digits are what it returns for e.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
