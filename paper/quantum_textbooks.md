---
title: "qpu's quantum textbook numbers, each derived exactly from the quantum mechanics that produces it"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_textbooks.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_textbooks.lean</code> · namespace <code>QuantumTextbooks</code> · 8 theorems · wing <code>the machine</code></p>

textbook_holevo (χ ≤ 1 bit for a qubit) is not re-derived: it is an entropy, a logarithm, outside ℤ[ω]. It stands
on qpu's TypeScript holevoChi and its own integer seal, and nothing here adds to or subtracts from it.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>tgate := (one, zero, zero, wpow 1)</code></pre>

<div class="thm" id="thm-quantum_textbooks-tsirelsons_eight_is_the_square_of_the_circuits_s">
<p class="thm-label"><strong>Theorem 1403</strong> (<code>tsirelsons_eight_is_the_square_of_the_circuits_s</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_tsirelsons_eight_is_the_square_of_the_circuits_s.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>zmul</mi><mo>(</mo><mrow><mi>root2</mi><mo>(</mo><mn>32768</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>root2</mi><mo>(</mo><mn>32768</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mrow><mrow><mn>8</mn><mo>⋅</mo><mn>16384</mn></mrow><mo>⋅</mo><mn>16384</mn></mrow><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>zneg</mi><mo>(</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>root2</mi><mo>(</mo><mn>32768</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mn>2</mn></mrow><mo>&lt;</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>zmul (root2 32768) (root2 32768) = (8 * 16384 * 16384, 0, 0, 0) ∧ zadd (zadd (corr (chsh 4 5)) (corr (chsh 4 3))) (zadd (corr (chsh 6 5)) (zneg (corr (chsh 6 3)))) = root2 32768 ∧ 2 * 2 &lt; 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{zmul}\mathopen{}\left(\mathrm{root2}\mathopen{}\left(32768\right),\,\mathrm{root2}\mathopen{}\left(32768\right)\right) = \left(8 \cdot 16384 \cdot 16384,\,0,\,0,\,0\right) \land \mathrm{zadd}\mathopen{}\left(\mathrm{zadd}\mathopen{}\left(\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,5\right)\right),\,\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,3\right)\right)\right),\,\mathrm{zadd}\mathopen{}\left(\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,5\right)\right),\,\mathrm{zneg}\mathopen{}\left(\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,3\right)\right)\right)\right)\right) = \mathrm{root2}\mathopen{}\left(32768\right) \land 2 \cdot 2 &lt; 8</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-the_group_generated_by_h_and_s_has_exactly_twenty_four_classes">
<p class="thm-label"><strong>Theorem 1404</strong> (<code>the_group_generated_by_h_and_s_has_exactly_twenty_four_classes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_the_group_generated_by_h_and_s_has_exactly_twenty_four_classes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>generated</mi><mo>(</mo><mrow><mo>[</mo><mi>hs</mi><mo>,</mo><mi>sigma1</mi><mo>]</mo></mrow><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>closeUnder</mi><mo>(</mo><mrow><mo>[</mo><mi>hs</mi><mo>,</mo><mi>sigma1</mi><mo>]</mo></mrow><mo>,</mo><mrow><mi>generated</mi><mo>(</mo><mrow><mo>[</mo><mi>hs</mi><mo>,</mo><mi>sigma1</mi><mo>]</mo></mrow><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(generated [hs, sigma1] 8).length = 24 ∧ (closeUnder [hs, sigma1] (generated [hs, sigma1] 8)).length = 24</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{generated}\mathopen{}\left([\mathrm{hs},\,\mathrm{sigma1}],\,8\right)\right| = 24 \land \left|\mathrm{closeUnder}\mathopen{}\left([\mathrm{hs},\,\mathrm{sigma1}],\,\mathrm{generated}\mathopen{}\left([\mathrm{hs},\,\mathrm{sigma1}],\,8\right)\right)\right| = 24</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-t_has_order_exactly_eight_and_does_not_commute_with_h">
<p class="thm-label"><strong>Theorem 1405</strong> (<code>t_has_order_exactly_eight_and_does_not_commute_with_h</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_t_has_order_exactly_eight_and_does_not_commute_with_h.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>mpow</mi><mo>(</mo><mi>tgate</mi><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mi>ident</mi></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>prop</mi><mo>(</mo><mrow><mi>mpow</mi><mo>(</mo><mi>tgate</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>,</mo><mi>ident</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>prop</mi><mo>(</mo><mrow><mi>mmul</mi><mo>(</mo><mi>hs</mi><mo>,</mo><mi>tgate</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>mmul</mi><mo>(</mo><mi>tgate</mi><mo>,</mo><mi>hs</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>mpow tgate 8 = ident ∧ (List.range' 1 7).all (fun k =&gt; prop (mpow tgate k) ident == false) = true ∧ prop (mmul hs tgate) (mmul tgate hs) = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{mpow}\mathopen{}\left(\mathrm{tgate},\,8\right) = \mathrm{ident} \land \forall k \in \{1,\dots,7\},\; \mathrm{prop}\mathopen{}\left(\mathrm{mpow}\mathopen{}\left(\mathrm{tgate},\,k\right),\,\mathrm{ident}\right) = \mathrm{false} = \mathrm{true} \land \mathrm{prop}\mathopen{}\left(\mathrm{mmul}\mathopen{}\left(\mathrm{hs},\,\mathrm{tgate}\right),\,\mathrm{mmul}\mathopen{}\left(\mathrm{tgate},\,\mathrm{hs}\right)\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-simons_measured_strings_for_period_eleven_are_exactly_two_of_four">
<p class="thm-label"><strong>Theorem 1406</strong> (<code>simons_measured_strings_for_period_eleven_are_exactly_two_of_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_simons_measured_strings_for_period_eleven_are_exactly_two_of_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>y</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>dot</mi><mo>(</mo><mi>y</mi><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 4).filter (fun y =&gt; dot y 3 == 0) = [0, 3]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, y \in \{0,\dots,3\} \mid \mathrm{dot}\mathopen{}\left(y,\,3\right) = 0 \,\} = [0,\,3]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-one_query_recovers_every_three_bit_hidden_string">
<p class="thm-label"><strong>Theorem 1407</strong> (<code>one_query_recovers_every_three_bit_hidden_string</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_one_query_recovers_every_three_bit_hidden_string.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>y</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>fold</mi><mo>(</mo><mrow><mi>acc</mi><mo>,</mo><mi>x</mi><mo>↦</mo><mrow><mi>acc</mi><mo>+</mo><mrow><mrow><mi>sign</mi><mo>(</mo><mrow><mi>dot</mi><mo>(</mo><mi>s</mi><mo>,</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>sign</mi><mo>(</mo><mrow><mi>dot</mi><mo>(</mo><mi>y</mi><mo>,</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow><mo>,</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>8</mn><mo>if</mo><mrow><mi>s</mi><mo>=</mo><mi>y</mi></mrow><mo>;</mo><mo>otherwise</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun s =&gt; (List.range 8).all (fun y =&gt; ((List.range 8).foldl (fun acc x =&gt; acc + sign (dot s x) * sign (dot y x)) 0) == (if s == y then 8 else 0))) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in \{0,\dots,7\},\; \forall y \in \{0,\dots,7\},\; \operatorname{fold}_{\mathrm{acc},\,x \mapsto \mathrm{acc} + \mathrm{sign}\mathopen{}\left(\mathrm{dot}\mathopen{}\left(s,\,x\right)\right) \cdot \mathrm{sign}\mathopen{}\left(\mathrm{dot}\mathopen{}\left(y,\,x\right)\right)}\left(\{0,\dots,7\},\, 0\right) = \begin{cases}8 &amp; \text{if } s = y\\ 0 &amp; \text{otherwise}\end{cases} = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 512 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-one_query_separates_every_balanced_from_every_constant_function">
<p class="thm-label"><strong>Theorem 1408</strong> (<code>one_query_separates_every_balanced_from_every_constant_function</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_one_query_separates_every_balanced_from_every_constant_function.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 256).all (fun m =&gt; let ones := (List.range 8).foldl (fun a x =&gt; a + m / 2 ^ x % 2) 0 let amp : Int := (List.range 8).foldl (fun a x =&gt; a + sign (m / 2 ^ x % 2)) 0 (amp == 0) == (ones == 4) &amp;&amp; ((ones == 0 || ones == 8) == (amp == 8 || amp == -8))) = true ∧ ((List.range 256).filter (fun m =&gt; (List.range 8).foldl (fun a x =&gt; a + m / 2 ^ x % 2) 0 == 4)).length = 70 ∧ 2 ^ 2 + 1 = 5</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 33,554,432 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-one_grover_iteration_finds_every_marked_item_of_four_with_certainty">
<p class="thm-label"><strong>Theorem 1409</strong> (<code>one_grover_iteration_finds_every_marked_item_of_four_with_certainty</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_one_grover_iteration_finds_every_marked_item_of_four_with_certainty.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>{</mo><mrow><mrow><mo>(</mo><mn>1</mn><mo>:</mo><mi>Int</mi><mo>)</mo></mrow><mo>-</mo><mrow><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>if</mo><mrow><mi>i</mi><mo>=</mo><mi>m</mi></mrow><mo>;</mo><mo>otherwise</mo><mn>1</mn><mo>)</mo></mrow></mrow><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>{</mo><mrow><mo>(</mo><mn>2</mn><mo>if</mo><mrow><mi>i</mi><mo>=</mo><mi>m</mi></mrow><mo>;</mo><mo>otherwise</mo><mn>0</mn><mo>)</mo></mrow><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>}</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 4).all (fun m =&gt; (List.range 4).map (fun i =&gt; (1 : Int) - (if i == m then -1 else 1)) == (List.range 4).map (fun i =&gt; if i == m then 2 else 0)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{0,\dots,3\},\; \{\, \left(1 : \mathbb{Z}\right) - \begin{cases}-1 &amp; \text{if } i = m\\ 1 &amp; \text{otherwise}\end{cases} \mid i \in \{0,\dots,3\} \,\} = \{\, \begin{cases}2 &amp; \text{if } i = m\\ 0 &amp; \text{otherwise}\end{cases} \mid i \in \{0,\dots,3\} \,\} = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_textbooks-linearity_forbids_perfect_cloning_and_the_optimal_copy_has_fidelity_five_sixths">
<p class="thm-label"><strong>Theorem 1410</strong> (<code>linearity_forbids_perfect_cloning_and_the_optimal_copy_has_fidelity_five_sixths</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumtextbooks_linearity_forbids_perfect_cloning_and_the_optimal_copy_has_fidelity_five_sixths.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mo>(</mo><mn>1</mn><mo>:</mo><mi>Int</mi><mo>)</mo></mrow><mo>⋅</mo><mn>1</mn></mrow><mo>-</mo><mrow><mn>0</mn><mo>⋅</mo><mn>1</mn></mrow></mrow><mo>≠</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mn>4</mn><mo>+</mo><mn>1</mn></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>4</mn><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mn>5</mn><mo>&lt;</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((1 : Int) * 1 - 0 * 1 ≠ 0) ∧ 4 + 1 + 1 = 6 ∧ 4 + 1 = 5 ∧ 5 &lt; 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left(1 : \mathbb{Z}\right) \cdot 1 - 0 \cdot 1 \neq 0 \land 4 + 1 + 1 = 6 \land 4 + 1 = 5 \land 5 &lt; 6</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
