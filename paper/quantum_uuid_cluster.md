---
title: "124 qubits from the UUID — the Mermin lead 2⁶¹, the odd bound, and the 124-qubit cluster state, as coins"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_uuid_cluster.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_uuid_cluster.lean</code> · namespace <code>QuantumUuidCluster</code> · 8 theorems · wing <code>the machine</code></p>

WHAT IT REFUSES TO SAY. A stabilizer state is exactly what a classical computer describes in polynomial time; that
is why 124 qubits fit in this file, and why nothing here is a quantum device or its output.

<div class="thm" id="thm-quantum_uuid_cluster-the_124_qubit_ghz_state_leads_every_classical_assignment_by_two_to_the_sixty_first">
<p class="thm-label"><strong>Theorem 1411</strong> (<code>the_124_qubit_ghz_state_leads_every_classical_assignment_by_two_to_the_sixty_first</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_the_124_qubit_ghz_state_leads_every_classical_assignment_by_two_to_the_sixty_first.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><msup><mn>2</mn><mn>4</mn></msup><mo>=</mo><mn>16</mn></mrow><mo>∧</mo><mrow><mrow><mn>128</mn><mo>-</mo><mn>4</mn></mrow><mo>=</mo><mn>124</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mn>128</mn><mo>-</mo><mn>4</mn></mrow><mo>-</mo><mn>2</mn></mrow><mo>=</mo><mn>122</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>123</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>124</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mfrac><mn>124</mn><mn>2</mn></mfrac></msup><mo>⋅</mo><msup><mn>2</mn><mn>61</mn></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mn>124</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>(2 ^ 4 = 16 ∧ 128 - 4 = 124 ∧ 128 - 4 - 2 = 122) ∧ particleSum 0 + particleSum 1 + particleSum 2 + particleSum 3 + particleSum 4 + particleSum 5 + particleSum 6 + particleSum 7 = 2 * 2 ^ 123 ∧ reach 124 = [0, 2, 4, 6] ∧ 2 ^ (124 / 2) * 2 ^ 61 = 2 ^ (124 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{4} = 16 \land 128 - 4 = 124 \land 128 - 4 - 2 = 122 \land \mathrm{particleSum}\mathopen{}\left(0\right) + \mathrm{particleSum}\mathopen{}\left(1\right) + \mathrm{particleSum}\mathopen{}\left(2\right) + \mathrm{particleSum}\mathopen{}\left(3\right) + \mathrm{particleSum}\mathopen{}\left(4\right) + \mathrm{particleSum}\mathopen{}\left(5\right) + \mathrm{particleSum}\mathopen{}\left(6\right) + \mathrm{particleSum}\mathopen{}\left(7\right) = 2 \cdot 2^{123} \land \mathrm{reach}\mathopen{}\left(124\right) = [0,\,2,\,4,\,6] \land 2^{\frac{124}{2}} \cdot 2^{61} = 2^{124 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  refine</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-at_odd_widths_the_classical_phase_stands_on_odd_eighths_and_the_bound_is_two_to_the_half_of_n_minus_one">
<p class="thm-label"><strong>Theorem 1412</strong> (<code>at_odd_widths_the_classical_phase_stands_on_odd_eighths_and_the_bound_is_two_to_the_half_of_n_minus_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_at_odd_widths_the_classical_phase_stands_on_odd_eighths_and_the_bound_is_two_to_the_half_of_n_minus_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>[3, 5, 7, 9].all (fun n =&gt; expectationsReal n &amp;&amp; twiceQuantum n == 2 * 2 ^ (n - 1) &amp;&amp; reach n == [1, 3, 5, 7]) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in [3,\,5,\,7,\,9],\; \mathrm{expectationsReal}\mathopen{}\left(n\right) \land \mathrm{twiceQuantum}\mathopen{}\left(n\right) = 2 \cdot 2^{n - 1} \land \mathrm{reach}\mathopen{}\left(n\right) = [1,\,3,\,5,\,7] = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-every_generator_of_the_124_qubit_cluster_is_z_x_z_on_its_neighbours">
<p class="thm-label"><strong>Theorem 1413</strong> (<code>every_generator_of_the_124_qubit_cluster_is_z_x_z_on_its_neighbours</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_every_generator_of_the_124_qubit_cluster_is_z_x_z_on_its_neighbours.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>123</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>gen</mi><mo>(</mo><mn>124</mn><mo>,</mo><mi>j</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>want</mi><mo>(</mo><mn>124</mn><mo>,</mo><mi>j</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 124).all (fun j =&gt; gen 124 j == want 124 j) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall j \in \{0,\dots,123\},\; \mathrm{gen}\mathopen{}\left(124,\,j\right) = \mathrm{want}\mathopen{}\left(124,\,j\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 124 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-generators_zero_to_sixty_one_have_exactly_the_z_x_z_bit_pattern">
<p class="thm-label"><strong>Theorem 1414</strong> (<code>generators_zero_to_sixty_one_have_exactly_the_z_x_z_bit_pattern</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_generators_zero_to_sixty_one_have_exactly_the_z_x_z_bit_pattern.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>61</mn><mo>}</mo></mrow><mo>,</mo><mi>patterned</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 62).all patterned = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{0,\dots,61\},\; \mathrm{patterned}\mathopen{}\left(x\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 62 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-generators_sixty_two_to_one_twenty_three_have_exactly_the_z_x_z_bit_pattern">
<p class="thm-label"><strong>Theorem 1415</strong> (<code>generators_sixty_two_to_one_twenty_three_have_exactly_the_z_x_z_bit_pattern</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_generators_sixty_two_to_one_twenty_three_have_exactly_the_z_x_z_bit_pattern.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>62</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>123</mn><mo>}</mo></mrow><mo>,</mo><mi>patterned</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 62 62).all patterned = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{62,\dots,123\},\; \mathrm{patterned}\mathopen{}\left(x\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 62 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-generators_zero_to_sixty_one_commute_with_all_124">
<p class="thm-label"><strong>Theorem 1416</strong> (<code>generators_zero_to_sixty_one_commute_with_all_124</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_generators_zero_to_sixty_one_commute_with_all_124.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>61</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>123</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>commutes</mi><mo>(</mo><mn>124</mn><mo>,</mo><mi>i</mi><mo>,</mo><mi>j</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 62).all (fun i =&gt; (List.range 124).all (fun j =&gt; commutes 124 i j)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,61\},\; \forall j \in \{0,\dots,123\},\; \mathrm{commutes}\mathopen{}\left(124,\,i,\,j\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7,688 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-generators_sixty_two_to_one_twenty_three_commute_with_all_124">
<p class="thm-label"><strong>Theorem 1417</strong> (<code>generators_sixty_two_to_one_twenty_three_commute_with_all_124</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_generators_sixty_two_to_one_twenty_three_commute_with_all_124.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>62</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>123</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>123</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>commutes</mi><mo>(</mo><mn>124</mn><mo>,</mo><mi>i</mi><mo>,</mo><mi>j</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 62 62).all (fun i =&gt; (List.range 124).all (fun j =&gt; commutes 124 i j)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{62,\dots,123\},\; \forall j \in \{0,\dots,123\},\; \mathrm{commutes}\mathopen{}\left(124,\,i,\,j\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7,688 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_uuid_cluster-without_the_chain_or_with_a_ring_the_linear_cluster_form_fails">
<p class="thm-label"><strong>Theorem 1418</strong> (<code>without_the_chain_or_with_a_ring_the_linear_cluster_form_fails</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumuuidcluster_without_the_chain_or_with_a_ring_the_linear_cluster_form_fails.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>123</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>(</mo><msup><mn>2</mn><mi>j</mi></msup><mo>,</mo><mn>0</mn><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>want</mi><mo>(</mo><mn>124</mn><mo>,</mo><mi>j</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>cz</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>123</mn><mo>,</mo><mrow><mi>gen</mi><mo>(</mo><mn>124</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>want</mi><mo>(</mo><mn>124</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>cz</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>123</mn><mo>,</mo><mrow><mi>gen</mi><mo>(</mo><mn>124</mn><mo>,</mo><mn>123</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>want</mi><mo>(</mo><mn>124</mn><mo>,</mo><mn>123</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 124).all (fun j =&gt; (2 ^ j, 0, false) != want 124 j) = true ∧ cz 0 123 (gen 124 0) != want 124 0 ∧ cz 0 123 (gen 124 123) != want 124 123</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall j \in \{0,\dots,123\},\; \left(2^{j},\,0,\,\mathrm{false}\right) \neq \mathrm{want}\mathopen{}\left(124,\,j\right) = \mathrm{true} \land \mathrm{cz}\mathopen{}\left(0,\,123,\,\mathrm{gen}\mathopen{}\left(124,\,0\right)\right) \neq \mathrm{want}\mathopen{}\left(124,\,0\right) \land \mathrm{cz}\mathopen{}\left(0,\,123,\,\mathrm{gen}\mathopen{}\left(124,\,123\right)\right) \neq \mathrm{want}\mathopen{}\left(124,\,123\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 124 cases. <span class="qed">□</span></p>

</div>
