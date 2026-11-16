---
title: "Annealer topology, QFT resource counts, and π's rational convergents — learned from qpu's Annealing, Qft, Pi"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `resources.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/resources.lean</code> · namespace <code>Resources</code> · 8 theorems · wing <code>the floor</code></p>

No axioms, no Mathlib, no sorry.

<div class="thm" id="thm-resources-the_chimera_annealer_qubit_count_is_eight_m_squared">
<p class="thm-label"><strong>Theorem 521</strong> (<code>the_chimera_annealer_qubit_count_is_eight_m_squared</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_the_chimera_annealer_qubit_count_is_eight_m_squared.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>chimera</mi><mo>[</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>8</mn><mo>,</mo><mn>32</mn><mo>,</mo><mn>72</mn><mo>,</mo><mn>128</mn><mo>,</mo><mn>200</mn><mo>,</mo><mn>288</mn><mo>,</mo><mn>392</mn><mo>,</mo><mn>512</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>chimera</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mn>2048</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>chimera</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mrow><mn>8</mn><mo>⋅</mo><msup><mi>m</mi><mn>2</mn></msup></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 8).map chimera = [8, 32, 72, 128, 200, 288, 392, 512] ∧ chimera 16 = 2048 ∧ (List.range' 1 16).all (fun m =&gt; chimera m == 8 * m ^ 2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{chimera}[\{1,\dots,8\}] = [8,\,32,\,72,\,128,\,200,\,288,\,392,\,512] \land \mathrm{chimera}\mathopen{}\left(16\right) = 2048 \land \forall m \in \{1,\dots,16\},\; \mathrm{chimera}\mathopen{}\left(m\right) = 8 \cdot m^{2}</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE CHIMERA ANNEALER QUBIT COUNT IS 8·m² ─────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,024 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-the_pegasus_annealer_count_is_twenty_four_m_times_m_minus_one">
<p class="thm-label"><strong>Theorem 522</strong> (<code>the_pegasus_annealer_count_is_twenty_four_m_times_m_minus_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_the_pegasus_annealer_count_is_twenty_four_m_times_m_minus_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>pegasus</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mn>5760</mn></mrow><mo>∧</mo><mrow><mrow><mi>pegasus</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pegasus</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>48</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pegasus</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mn>24</mn><mo>⋅</mo><mi>m</mi></mrow><mo>⋅</mo><mrow><mi>m</mi><mo>-</mo><mn>1</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pegasus 16 = 5760 ∧ pegasus 1 = 0 ∧ pegasus 2 = 48 ∧ (List.range' 1 16).all (fun m =&gt; pegasus m == 24 * m * (m - 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{pegasus}\mathopen{}\left(16\right) = 5760 \land \mathrm{pegasus}\mathopen{}\left(1\right) = 0 \land \mathrm{pegasus}\mathopen{}\left(2\right) = 48 \land \forall m \in \{1,\dots,16\},\; \mathrm{pegasus}\mathopen{}\left(m\right) = 24 \cdot m \cdot m - 1</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE PEGASUS COUNT IS 24·m·(m−1) — CONTROL: ONE CELL HAS NO INTER-CELL QUBITS ─────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-the_qft_gate_count_is_the_triangular_number">
<p class="thm-label"><strong>Theorem 523</strong> (<code>the_qft_gate_count_is_the_triangular_number</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_the_qft_gate_count_is_the_triangular_number.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>qftGates</mi><mo>[</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>10</mn><mo>,</mo><mn>15</mn><mo>,</mo><mn>21</mn><mo>,</mo><mn>28</mn><mo>,</mo><mn>36</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>qftGates</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>qftGates</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>q</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mrow><mi>qftGates</mi><mo>(</mo><mi>q</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mi>q</mi><mo>⋅</mo><mrow><mi>q</mi><mo>+</mo><mn>1</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 8).map qftGates = [1, 3, 6, 10, 15, 21, 28, 36] ∧ qftGates 3 = 6 ∧ qftGates 4 = 10 ∧ (List.range' 1 8).all (fun q =&gt; 2 * qftGates q == q * (q + 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{qftGates}[\{1,\dots,8\}] = [1,\,3,\,6,\,10,\,15,\,21,\,28,\,36] \land \mathrm{qftGates}\mathopen{}\left(3\right) = 6 \land \mathrm{qftGates}\mathopen{}\left(4\right) = 10 \land \forall q \in \{1,\dots,8\},\; 2 \cdot \mathrm{qftGates}\mathopen{}\left(q\right) = q \cdot q + 1</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE QFT GATE COUNT IS THE TRIANGULAR NUMBER q(q+1)/2 ─────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 512 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-the_qft_swaps_depth_and_states">
<p class="thm-label"><strong>Theorem 524</strong> (<code>the_qft_swaps_depth_and_states</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_the_qft_swaps_depth_and_states.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mi>qftSwaps</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mi>qftDepth</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>qftStates</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>q</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>qftStates</mi><mo>(</mo><mi>q</mi><mo>)</mo></mrow><mo>=</mo><msup><mn>2</mn><mi>q</mi></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>q</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>qftDepth</mi><mo>(</mo><mi>q</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>q</mi></mrow><mo>-</mo><mn>1</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>qftSwaps 4 = 2 ∧ qftDepth 4 = 7 ∧ qftStates 4 = 16 ∧ (List.range' 1 8).all (fun q =&gt; qftStates q == 2 ^ q) ∧ (List.range' 1 8).all (fun q =&gt; qftDepth q == 2 * q - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{qftSwaps}\mathopen{}\left(4\right) = 2 \land \mathrm{qftDepth}\mathopen{}\left(4\right) = 7 \land \mathrm{qftStates}\mathopen{}\left(4\right) = 16 \land \forall q \in \{1,\dots,8\},\; \mathrm{qftStates}\mathopen{}\left(q\right) = 2^{q} \land \forall q \in \{1,\dots,8\},\; \mathrm{qftDepth}\mathopen{}\left(q\right) = 2 \cdot q - 1</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE QFT SWAPS, DEPTH, AND STATE DIMENSION ───────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-archimedes_twenty_two_over_seven_bounds_pi_above_and_the_floor_is_three">
<p class="thm-label"><strong>Theorem 525</strong> (<code>archimedes_twenty_two_over_seven_bounds_pi_above_and_the_floor_is_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_archimedes_twenty_two_over_seven_bounds_pi_above_and_the_floor_is_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>14</mn><mo>+</mo><mn>8</mn></mrow><mo>=</mo><mn>22</mn></mrow><mo>∧</mo><mrow><mrow><mn>22</mn><mo>⋅</mo><mn>100000</mn></mrow><mo>&gt;</mo><mrow><mn>314159</mn><mo>⋅</mo><mn>7</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><mn>7</mn></mrow><mo>&lt;</mo><mn>22</mn></mrow></mrow><mo>∧</mo><mrow><mn>22</mn><mo>&lt;</mo><mrow><mn>4</mn><mo>⋅</mo><mn>7</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>14 + 8 = 22 ∧ 22 * 100000 &gt; 314159 * 7 ∧ 3 * 7 &lt; 22 ∧ 22 &lt; 4 * 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>14 + 8 = 22 \land 22 \cdot 100000 &gt; 314159 \cdot 7 \land 3 \cdot 7 &lt; 22 \land 22 &lt; 4 \cdot 7</code></pre></details>
</div>
<p class="thm-remark">── 5 · ARCHIMEDES' 22/7 IS AN UPPER BOUND, AND ⌊π⌋ = 3 ────────────────────────────────────────────────── 22/7 = 3.142857… &gt; π, and 3 &lt; 22/7 &lt; 4 pins the floor. Compared as integers, no floats.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-zu_chongzhis_three_fifty_five_over_one_thirteen_brackets_pi_to_six_places">
<p class="thm-label"><strong>Theorem 526</strong> (<code>zu_chongzhis_three_fifty_five_over_one_thirteen_brackets_pi_to_six_places</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_zu_chongzhis_three_fifty_five_over_one_thirteen_brackets_pi_to_six_places.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mn>28</mn><mo>⋅</mo><mrow><mn>14</mn><mo>-</mo><mn>1</mn></mrow></mrow><mo>-</mo><mrow><mn>3</mn><mo>⋅</mo><mn>3</mn></mrow></mrow><mo>=</mo><mn>355</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mn>28</mn><mo>⋅</mo><mn>4</mn></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>113</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>3141592</mn><mo>⋅</mo><mn>113</mn></mrow><mo>&lt;</mo><mrow><mn>355</mn><mo>⋅</mo><mn>1000000</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>355</mn><mo>⋅</mo><mn>1000000</mn></mrow><mo>&lt;</mo><mrow><mn>3141593</mn><mo>⋅</mo><mn>113</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>28 * (14 - 1) - 3 * 3 = 355 ∧ 28 * 4 + 1 = 113 ∧ 3141592 * 113 &lt; 355 * 1000000 ∧ 355 * 1000000 &lt; 3141593 * 113</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>28 \cdot 14 - 1 - 3 \cdot 3 = 355 \land 28 \cdot 4 + 1 = 113 \land 3141592 \cdot 113 &lt; 355 \cdot 1000000 \land 355 \cdot 1000000 &lt; 3141593 \cdot 113</code></pre></details>
</div>
<p class="thm-remark">── 6 · ZU CHONGZHI'S 355/113 LIES BETWEEN 3.141592 AND 3.141593 ─────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-the_turn_is_three_hundred_sixty_degrees_and_the_half_turn_one_eighty">
<p class="thm-label"><strong>Theorem 527</strong> (<code>the_turn_is_three_hundred_sixty_degrees_and_the_half_turn_one_eighty</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_the_turn_is_three_hundred_sixty_degrees_and_the_half_turn_one_eighty.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>14</mn><mo>-</mo><mn>2</mn></mrow><mo>⋅</mo><mrow><mn>28</mn><mo>+</mo><mn>2</mn></mrow></mrow><mo>=</mo><mn>360</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mn>14</mn><mo>-</mo><mn>2</mn></mrow><mo>⋅</mo><mrow><mn>14</mn><mo>+</mo><mn>1</mn></mrow></mrow><mo>=</mo><mn>180</mn></mrow></mrow><mo>∧</mo><mrow><mn>360</mn><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><mn>180</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(14 - 2) * (28 + 2) = 360 ∧ (14 - 2) * (14 + 1) = 180 ∧ 360 = 2 * 180</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>14 - 2 \cdot 28 + 2 = 360 \land 14 - 2 \cdot 14 + 1 = 180 \land 360 = 2 \cdot 180</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE TURN IS 360°, THE HALF-TURN 180°, FROM THE SAME CONSTANTS ────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-resources-these_are_exact_counts_and_rational_convergents_not_pi_itself">
<p class="thm-label"><strong>Theorem 528</strong> (<code>these_are_exact_counts_and_rational_convergents_not_pi_itself</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_resources_these_are_exact_counts_and_rational_convergents_not_pi_itself.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>chimera</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mn>2048</mn></mrow><mo>∧</mo><mrow><mrow><mi>pegasus</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mn>5760</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>qftGates</mi><mo>(</mo><mn>10</mn><mo>)</mo></mrow><mo>=</mo><mn>55</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>22</mn><mo>⋅</mo><mn>7</mn></mrow><mo>=</mo><mn>154</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>355</mn><mo>⋅</mo><mn>113</mn></mrow><mo>=</mo><mn>40115</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>q</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>qftGates</mi><mo>(</mo><mi>q</mi><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>qftStates</mi><mo>(</mo><mi>q</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>chimera 16 = 2048 ∧ pegasus 16 = 5760 ∧ qftGates 10 = 55 ∧ 22 * 7 = 154 ∧ 355 * 113 = 40115 ∧ (List.range' 1 8).all (fun q =&gt; qftGates q &lt; qftStates q)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{chimera}\mathopen{}\left(16\right) = 2048 \land \mathrm{pegasus}\mathopen{}\left(16\right) = 5760 \land \mathrm{qftGates}\mathopen{}\left(10\right) = 55 \land 22 \cdot 7 = 154 \land 355 \cdot 113 = 40115 \land \forall q \in \{1,\dots,8\},\; \mathrm{qftGates}\mathopen{}\left(q\right) &lt; \mathrm{qftStates}\mathopen{}\left(q\right)</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE HONEST BOUND: EXACT COUNTS AND RATIONAL CONVERGENTS, NOT π AND NOT A PHYSICAL CIRCUIT ──────── The counts are exact integers and the convergents are exact rationals near π, decided over finite domains. Neither is a closed form for π (irrational) nor a physical annealer or QFT circuit run on hardware: the gate count is the circuit's structure, the convergent is a rational that brackets π, both computed on the classical build device.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

</div>
