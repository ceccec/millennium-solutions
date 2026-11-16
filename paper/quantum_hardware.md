---
title: "When a quantum device's counts are above the classical bound, decided on exact integers"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_hardware.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_hardware.lean</code> · namespace <code>QuantumHardware</code> · 8 theorems · wing <code>the machine</code></p>

WHAT THIS DECIDES AND WHAT IT REFUSES TO SAY. Per CHSH setting i, D_i = n00 + n11 − n01 − n10 and N_i is its shots,
so E_i = D_i / N_i. S > 2 is decided as D₀N₁N₂N₃ + D₁N₀N₂N₃ + D₂N₀N₁N₃ − D₃N₀N₁N₂ > 2·N₀N₁N₂N₃, with no division.
The kernel decides the rule and the classical bound. It decides nothing about any device: whether a run's counts
came from a quantum processor is the provider's job record, read by scripts/quantum-hardware.ts, never this file.

<div class="thm" id="thm-quantum_hardware-every_deterministic_local_strategy_gives_chsh_plus_or_minus_two">
<p class="thm-label"><strong>Theorem 1355</strong> (<code>every_deterministic_local_strategy_gives_chsh_plus_or_minus_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_every_deterministic_local_strategy_gives_chsh_plus_or_minus_two.html">sealed</a>.</p>
<pre class="thm-statement"><code>[1, -1].all (fun a0 : Int =&gt; [1, -1].all (fun a1 : Int =&gt; [1, -1].all (fun b0 : Int =&gt; [1, -1].all (fun b1 : Int =&gt; let s := a0 * b0 + a0 * b1 + a1 * b0 - a1 * b1; s == 2 || s == -2)))) = true</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-the_classical_strategy_at_s_two_is_not_above_classical">
<p class="thm-label"><strong>Theorem 1356</strong> (<code>the_classical_strategy_at_s_two_is_not_above_classical</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_the_classical_strategy_at_s_two_is_not_above_classical.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>aboveClassical</mi><mo>(</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>aboveClassical 1000 1000 1000 1000 1000 1000 1000 1000 = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{aboveClassical}\mathopen{}\left(1000,\,1000,\,1000,\,1000,\,1000,\,1000,\,1000,\,1000\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-one_count_above_s_two_is_above_classical">
<p class="thm-label"><strong>Theorem 1357</strong> (<code>one_count_above_s_two_is_above_classical</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_one_count_above_s_two_is_above_classical.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>aboveClassical</mi><mo>(</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>998</mn><mo>,</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>aboveClassical 1000 1000 1000 1000 1000 1000 998 1000 = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{aboveClassical}\mathopen{}\left(1000,\,1000,\,1000,\,1000,\,1000,\,1000,\,998,\,1000\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-one_count_below_s_two_is_not_above_classical">
<p class="thm-label"><strong>Theorem 1358</strong> (<code>one_count_below_s_two_is_not_above_classical</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_one_count_below_s_two_is_not_above_classical.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>aboveClassical</mi><mo>(</mo><mn>998</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>aboveClassical 998 1000 1000 1000 1000 1000 1000 1000 = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{aboveClassical}\mathopen{}\left(998,\,1000,\,1000,\,1000,\,1000,\,1000,\,1000,\,1000\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-uniform_noise_is_not_above_classical">
<p class="thm-label"><strong>Theorem 1359</strong> (<code>uniform_noise_is_not_above_classical</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_uniform_noise_is_not_above_classical.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>aboveClassical</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1000</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>aboveClassical 0 1000 0 1000 0 1000 0 1000 = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{aboveClassical}\mathopen{}\left(0,\,1000,\,0,\,1000,\,0,\,1000,\,0,\,1000\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-ideal_counts_at_ten_thousand_shots_are_above_classical">
<p class="thm-label"><strong>Theorem 1360</strong> (<code>ideal_counts_at_ten_thousand_shots_are_above_classical</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_ideal_counts_at_ten_thousand_shots_are_above_classical.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mn>4268</mn><mo>+</mo><mn>732</mn></mrow><mo>+</mo><mn>732</mn></mrow><mo>+</mo><mn>4268</mn></mrow><mo>=</mo><mn>10000</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mn>4268</mn><mo>+</mo><mn>4268</mn></mrow><mo>-</mo><mn>732</mn></mrow><mo>-</mo><mn>732</mn></mrow><mo>=</mo><mn>7072</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>aboveClassical</mi><mo>(</mo><mn>7072</mn><mo>,</mo><mn>10000</mn><mo>,</mo><mn>7072</mn><mo>,</mo><mn>10000</mn><mo>,</mo><mn>7072</mn><mo>,</mo><mn>10000</mn><mo>,</mo><mrow><mo>−</mo><mn>7072</mn></mrow><mo>,</mo><mn>10000</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>4268 + 732 + 732 + 4268 = 10000 ∧ 4268 + 4268 - 732 - 732 = 7072 ∧ aboveClassical 7072 10000 7072 10000 7072 10000 (-7072) 10000 = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>4268 + 732 + 732 + 4268 = 10000 \land 4268 + 4268 - 732 - 732 = 7072 \land \mathrm{aboveClassical}\mathopen{}\left(7072,\,10000,\,7072,\,10000,\,7072,\,10000,\,-7072,\,10000\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-register_bit_zero_is_alice_and_bit_one_is_bob">
<p class="thm-label"><strong>Theorem 1361</strong> (<code>register_bit_zero_is_alice_and_bit_one_is_bob</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_register_bit_zero_is_alice_and_bit_one_is_bob.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mrow><mo>(</mo><mrow><mi>v</mi><mo>mod</mo><mn>2</mn></mrow><mo>,</mo><mrow><mfrac><mi>v</mi><mn>2</mn></mfrac><mo>mod</mo><mn>2</mn></mrow><mo>)</mo></mrow><mo>∣</mo><mi>v</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 4).map (fun v =&gt; (v % 2, v / 2 % 2)) = [(0, 0), (1, 0), (0, 1), (1, 1)]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, \left(v \bmod 2,\,\frac{v}{2} \bmod 2\right) \mid v \in \{0,\dots,3\} \,\} = [\left(0,\,0\right),\,\left(1,\,0\right),\,\left(0,\,1\right),\,\left(1,\,1\right)]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_hardware-the_one_count_control_is_four_hundred_ninety_nine_agreements_short_of_five_hundred">
<p class="thm-label"><strong>Theorem 1362</strong> (<code>the_one_count_control_is_four_hundred_ninety_nine_agreements_short_of_five_hundred</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumhardware_the_one_count_control_is_four_hundred_ninety_nine_agreements_short_of_five_hundred.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>(</mo><mrow><mrow><mrow><mn>499</mn><mo>+</mo><mn>500</mn></mrow><mo>-</mo><mn>1</mn></mrow><mo>-</mo><mn>0</mn></mrow><mo>:</mo><mi>Int</mi><mo>)</mo></mrow><mo>=</mo><mn>998</mn></mrow><mo>∧</mo><mrow><mrow><mo>(</mo><mrow><mrow><mrow><mn>499</mn><mo>+</mo><mn>1</mn></mrow><mo>+</mo><mn>0</mn></mrow><mo>+</mo><mn>500</mn></mrow><mo>:</mo><mi>Int</mi><mo>)</mo></mrow><mo>=</mo><mn>1000</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(499 + 500 - 1 - 0 : Int) = 998 ∧ (499 + 1 + 0 + 500 : Int) = 1000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left(499 + 500 - 1 - 0 : \mathbb{Z}\right) = 998 \land \left(499 + 1 + 0 + 500 : \mathbb{Z}\right) = 1000</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
