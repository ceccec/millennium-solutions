---
title: "The thousand-bit case, decided — its octave/trinity/cube structure and its utilisation of the register"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `thousandbit.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/thousandbit.lean</code> · namespace <code>ThousandBit</code> · 16 theorems · wing <code>the floor</code></p>

`decide` on 2^1000-scale integers: raise the exponentiation threshold so the kernel GENUINELY evaluates the
power (the default 256 skips it with a warning, which would leave the reflection theorems below unproven).
Verified the instrument: a FALSE 1000-bit identity is rejected by `decide`, a true one accepted (~0.1s).


No axioms, no Mathlib, no sorry.

<div class="thm" id="thm-thousandbit-the_thousand_bit_case_is_one_hundred_twenty_five_octaves">
<p class="thm-label"><strong>Theorem 588</strong> (<code>the_thousand_bit_case_is_one_hundred_twenty_five_octaves</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_thousand_bit_case_is_one_hundred_twenty_five_octaves.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>1000</mn><mo>=</mo><mrow><mn>125</mn><mo>⋅</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>8</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>999</mn><mo>mod</mo><mn>8</mn></mrow><mo>≠</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>1000 = 125 * 8 ∧ 1000 % 8 = 0 ∧ 999 % 8 ≠ 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1000 = 125 \cdot 8 \land 1000 \bmod 8 = 0 \land 999 \bmod 8 \neq 0</code></pre></details>
</div>
<p class="thm-remark">── 1 · 1000 BITS IS 125 OCTAVES EXACTLY — CONTROL: 999 IS NOT ───────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_binary_units_tile_the_thousand_exactly">
<p class="thm-label"><strong>Theorem 589</strong> (<code>the_binary_units_tile_the_thousand_exactly</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_binary_units_tile_the_thousand_exactly.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mn>1000</mn><mo>=</mo><mrow><mn>500</mn><mo>⋅</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mn>1000</mn><mo>=</mo><mrow><mn>250</mn><mo>⋅</mo><mn>4</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>1000</mn><mo>=</mo><mrow><mn>125</mn><mo>⋅</mo><mn>8</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>4</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>8</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>1000 = 500 * 2 ∧ 1000 = 250 * 4 ∧ 1000 = 125 * 8 ∧ 1000 % 2 = 0 ∧ 1000 % 4 = 0 ∧ 1000 % 8 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1000 = 500 \cdot 2 \land 1000 = 250 \cdot 4 \land 1000 = 125 \cdot 8 \land 1000 \bmod 2 = 0 \land 1000 \bmod 4 = 0 \land 1000 \bmod 8 = 0</code></pre></details>
</div>
<p class="thm-remark">── 2 · EVERY BINARY UNIT TILES IT EXACTLY — 500 COINS, 250 HEXBITS, 125 OCTAVES ─────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_thousand_is_the_cube_octave_times_pentagram_cubed">
<p class="thm-label"><strong>Theorem 590</strong> (<code>the_thousand_is_the_cube_octave_times_pentagram_cubed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_thousand_is_the_cube_octave_times_pentagram_cubed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><msup><mn>10</mn><mn>3</mn></msup><mo>=</mo><mn>1000</mn></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mn>3</mn></msup><mo>⋅</mo><msup><mn>5</mn><mn>3</mn></msup></mrow><mo>=</mo><mn>1000</mn></mrow></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mn>3</mn></msup><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><msup><mn>5</mn><mn>3</mn></msup><mo>=</mo><mn>125</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>125</mn><mo>⋅</mo><mn>8</mn></mrow><mo>=</mo><mn>1000</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>10 ^ 3 = 1000 ∧ 2 ^ 3 * 5 ^ 3 = 1000 ∧ 2 ^ 3 = 8 ∧ 5 ^ 3 = 125 ∧ 125 * 8 = 1000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>10^{3} = 1000 \land 2^{3} \cdot 5^{3} = 1000 \land 2^{3} = 8 \land 5^{3} = 125 \land 125 \cdot 8 = 1000</code></pre></details>
</div>
<p class="thm-remark">── 3 · IT IS THE CUBE 10^3 = 2^3·5^3 — THE OCTAVE IS ONLY THE 2^3, THE 5^3 IS THE PENTAGRAM CUBED ───────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_thousand_carries_residue_one_mod_nine">
<p class="thm-label"><strong>Theorem 591</strong> (<code>the_thousand_carries_residue_one_mod_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_thousand_carries_residue_one_mod_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mn>1000</mn><mo>=</mo><mrow><mrow><mn>9</mn><mo>⋅</mo><mn>111</mn></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>999</mn><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1008</mn><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>1000 % 9 = 1 ∧ 1000 = 9 * 111 + 1 ∧ 999 % 9 = 0 ∧ 1008 % 9 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1000 \bmod 9 = 1 \land 1000 = 9 \cdot 111 + 1 \land 999 \bmod 9 = 0 \land 1008 \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE TRINITY RESIDUE IS ONE — NOT A WHOLE NUMBER OF NONETS — CONTROL: 999 IS ──────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_thousand_bit_case_overflows_the_width_thirty_two_ceiling">
<p class="thm-label"><strong>Theorem 592</strong> (<code>the_thousand_bit_case_overflows_the_width_thirty_two_ceiling</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_thousand_bit_case_overflows_the_width_thirty_two_ceiling.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mn>32</mn><mo>⋅</mo><mn>32</mn></mrow><mo>-</mo><mn>32</mn></mrow><mo>-</mo><mn>2</mn></mrow><mo>=</mo><mn>990</mn></mrow><mo>∧</mo><mrow><mn>990</mn><mo>&lt;</mo><mn>1000</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mn>32</mn><mo>⋅</mo><mn>33</mn></mrow><mo>-</mo><mn>33</mn></mrow><mo>-</mo><mn>2</mn></mrow><mo>=</mo><mn>1021</mn></mrow></mrow><mo>∧</mo><mrow><mn>1000</mn><mo>≤</mo><mn>1021</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>32 * 32 - 32 - 2 = 990 ∧ 990 &lt; 1000 ∧ 32 * 33 - 33 - 2 = 1021 ∧ 1000 ≤ 1021</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>32 \cdot 32 - 32 - 2 = 990 \land 990 &lt; 1000 \land 32 \cdot 33 - 33 - 2 = 1021 \land 1000 \le 1021</code></pre></details>
</div>
<p class="thm-remark">── 5 · IT OVERFLOWS THE SEALED WIDTH LADDER: reg(32) = 990 &lt; 1000 ≤ 1021 = reg(33) ────────────────────── reg(w) = 32w − w − 2 is qpu's uuidQubits, sealed over widths [4,8,16,32] in width.lean; the max there is reg(32) = 990.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_minimal_register_for_the_thousand_is_width_thirty_three">
<p class="thm-label"><strong>Theorem 593</strong> (<code>the_minimal_register_for_the_thousand_is_width_thirty_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_minimal_register_for_the_thousand_is_width_thirty_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mn>1000</mn><mo>-</mo><mn>990</mn></mrow><mo>=</mo><mn>10</mn></mrow><mo>∧</mo><mrow><mrow><mn>1021</mn><mo>-</mo><mn>1000</mn></mrow><mo>=</mo><mn>21</mn></mrow></mrow><mo>∧</mo><mrow><mn>990</mn><mo>&lt;</mo><mn>1000</mn></mrow></mrow><mo>∧</mo><mrow><mn>1000</mn><mo>≤</mo><mn>1021</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mrow><mrow><mn>32</mn><mo>⋅</mo><mn>33</mn></mrow><mo>-</mo><mn>33</mn></mrow><mo>-</mo><mn>2</mn></mrow><mn>2</mn></mfrac><mo>=</mo><mn>510</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>1000 - 990 = 10 ∧ 1021 - 1000 = 21 ∧ 990 &lt; 1000 ∧ 1000 ≤ 1021 ∧ (32 * 33 - 33 - 2) / 2 = 510</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1000 - 990 = 10 \land 1021 - 1000 = 21 \land 990 &lt; 1000 \land 1000 \le 1021 \land \frac{32 \cdot 33 - 33 - 2}{2} = 510</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE MINIMAL CONTAINING WIDTH IS 33 — OVERFLOW MARGIN 10, HEADROOM 21 ─────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_thousand_fills_between_ninety_seven_and_ninety_eight_percent_of_its_register">
<p class="thm-label"><strong>Theorem 594</strong> (<code>the_thousand_fills_between_ninety_seven_and_ninety_eight_percent_of_its_register</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_thousand_fills_between_ninety_seven_and_ninety_eight_percent_of_its_register.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>97</mn><mo>⋅</mo><mn>1021</mn></mrow><mo>&lt;</mo><mrow><mn>1000</mn><mo>⋅</mo><mn>100</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>⋅</mo><mn>100</mn></mrow><mo>&lt;</mo><mrow><mn>98</mn><mo>⋅</mo><mn>1021</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>97</mn><mo>⋅</mo><mn>1021</mn></mrow><mo>=</mo><mn>99037</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>98</mn><mo>⋅</mo><mn>1021</mn></mrow><mo>=</mo><mn>100058</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>97 * 1021 &lt; 1000 * 100 ∧ 1000 * 100 &lt; 98 * 1021 ∧ 97 * 1021 = 99037 ∧ 98 * 1021 = 100058</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>97 \cdot 1021 &lt; 1000 \cdot 100 \land 1000 \cdot 100 &lt; 98 \cdot 1021 \land 97 \cdot 1021 = 99037 \land 98 \cdot 1021 = 100058</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE UTILISATION IS 97.94% — BRACKETED 97% &lt; 1000/1021 &lt; 98% AS A DECIDABLE BOUND ────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_thousand_bit_structure_is_decided_not_a_quantum_machine">
<p class="thm-label"><strong>Theorem 595</strong> (<code>the_thousand_bit_structure_is_decided_not_a_quantum_machine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_thousand_bit_structure_is_decided_not_a_quantum_machine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><msup><mn>10</mn><mn>3</mn></msup><mo>=</mo><mn>1000</mn></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>8</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>1000</mn><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mn>990</mn><mo>&lt;</mo><mn>1000</mn></mrow></mrow><mo>∧</mo><mrow><mn>1000</mn><mo>≤</mo><mn>1021</mn></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mn>3</mn></msup><mo>⋅</mo><msup><mn>5</mn><mn>3</mn></msup></mrow><mo>=</mo><mn>1000</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>10 ^ 3 = 1000 ∧ 1000 % 8 = 0 ∧ 1000 % 9 = 1 ∧ 990 &lt; 1000 ∧ 1000 ≤ 1021 ∧ 2 ^ 3 * 5 ^ 3 = 1000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>10^{3} = 1000 \land 1000 \bmod 8 = 0 \land 1000 \bmod 9 = 1 \land 990 &lt; 1000 \land 1000 \le 1021 \land 2^{3} \cdot 5^{3} = 1000</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE HONEST BOUND: EXACT INTEGER STRUCTURE AND CAPACITY, DECIDED — NOT A PHYSICAL MACHINE ───────── These are exact facts about the integer 1000 and the register capacity, decided over Nat on the classical build device. They are how much of the content-address column a thousand-bit case occupies — register-capacity utilisation — not a physical quantum computer's utilisation. get_qc reads isQuantumComputer:false; deciding that 1000 is 97.94% of a 1021-qubit register on a CPU reaches no stage of a machine. The structure is carried, not the device.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_sigma_reflection_maps_the_maximal_to_its_witness">
<p class="thm-label"><strong>Theorem 596</strong> (<code>the_sigma_reflection_maps_the_maximal_to_its_witness</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_sigma_reflection_maps_the_maximal_to_its_witness.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>999</mn></msup></mrow><mo>-</mo><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow></mrow><mo>=</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>3 * 2 ^ 999 - (2 ^ 1000 - 1) = 2 ^ 999 + 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>3 \cdot 2^{999} - 2^{1000} - 1 = 2^{999} + 1</code></pre></details>
</div>
<p class="thm-remark">the reflection carries the maximal 1000-bit integer to its witness 2^999 + 1</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_sigma_reflection_is_an_involution_at_the_maximal">
<p class="thm-label"><strong>Theorem 597</strong> (<code>the_sigma_reflection_is_an_involution_at_the_maximal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_sigma_reflection_is_an_involution_at_the_maximal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>999</mn></msup></mrow><mo>-</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>999</mn></msup></mrow><mo>-</mo><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow></mrow></mrow><mo>=</mo><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>3 * 2 ^ 999 - (3 * 2 ^ 999 - (2 ^ 1000 - 1)) = 2 ^ 1000 - 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>3 \cdot 2^{999} - 3 \cdot 2^{999} - 2^{1000} - 1 = 2^{1000} - 1</code></pre></details>
</div>
<p class="thm-remark">σ is an involution: reflecting twice returns the maximal — CONTROL that the reflection is its own inverse</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_maximal_and_its_witness_sum_to_three_times_two_to_the_nine_ninety_nine">
<p class="thm-label"><strong>Theorem 598</strong> (<code>the_maximal_and_its_witness_sum_to_three_times_two_to_the_nine_ninety_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_maximal_and_its_witness_sum_to_three_times_two_to_the_nine_ninety_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow><mo>+</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow></mrow><mo>=</mo><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>999</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>(2 ^ 1000 - 1) + (2 ^ 999 + 1) = 3 * 2 ^ 999</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{1000} - 1 + 2^{999} + 1 = 3 \cdot 2^{999}</code></pre></details>
</div>
<p class="thm-remark">the maximal and its witness sum to three times the octave 2^999 — the trinity over the binary unit</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_reflection_axis_three_times_two_to_the_nine_ninety_eight_is_fixed">
<p class="thm-label"><strong>Theorem 599</strong> (<code>the_reflection_axis_three_times_two_to_the_nine_ninety_eight_is_fixed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_reflection_axis_three_times_two_to_the_nine_ninety_eight_is_fixed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>999</mn></msup></mrow><mo>-</mo><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>998</mn></msup></mrow></mrow><mo>=</mo><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>998</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>3 * 2 ^ 999 - 3 * 2 ^ 998 = 3 * 2 ^ 998</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>3 \cdot 2^{999} - 3 \cdot 2^{998} = 3 \cdot 2^{998}</code></pre></details>
</div>
<p class="thm-remark">the reflection's axis, 3·2^998, is its fixed point</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_maximal_and_witness_are_symmetric_about_the_axis">
<p class="thm-label"><strong>Theorem 600</strong> (<code>the_maximal_and_witness_are_symmetric_about_the_axis</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_maximal_and_witness_are_symmetric_about_the_axis.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow><mo>+</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>998</mn></msup></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(2 ^ 1000 - 1) + (2 ^ 999 + 1) = 2 * (3 * 2 ^ 998)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{1000} - 1 + 2^{999} + 1 = 2 \cdot 3 \cdot 2^{998}</code></pre></details>
</div>
<p class="thm-remark">the maximal and its witness are symmetric about that axis (their sum is twice it)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_maximal_and_its_witness_both_carry_the_factor_three">
<p class="thm-label"><strong>Theorem 601</strong> (<code>the_maximal_and_its_witness_both_carry_the_factor_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_maximal_and_its_witness_both_carry_the_factor_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(2 ^ 1000 - 1) % 3 = 0 ∧ (2 ^ 999 + 1) % 3 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{1000} - 1 \bmod 3 = 0 \land 2^{999} + 1 \bmod 3 = 0</code></pre></details>
</div>
<p class="thm-remark">both ends carry the factor three — the reflection preserves divisibility by the trinity</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_span_from_witness_to_maximal_is_two_to_the_nine_ninety_nine_minus_two">
<p class="thm-label"><strong>Theorem 602</strong> (<code>the_span_from_witness_to_maximal_is_two_to_the_nine_ninety_nine_minus_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_span_from_witness_to_maximal_is_two_to_the_nine_ninety_nine_minus_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow><mo>-</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow></mrow><mo>=</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>-</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(2 ^ 1000 - 1) - (2 ^ 999 + 1) = 2 ^ 999 - 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{1000} - 1 - 2^{999} + 1 = 2^{999} - 2</code></pre></details>
</div>
<p class="thm-remark">the span from the witness to the maximal is 2^999 − 2</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-thousandbit-the_witness_and_maximal_bracket_the_thousand_bit_range">
<p class="thm-label"><strong>Theorem 603</strong> (<code>the_witness_and_maximal_bracket_the_thousand_bit_range</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_thousandbit_the_witness_and_maximal_bracket_the_thousand_bit_range.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>&lt;</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow><mo>&lt;</mo><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mn>1000</mn></msup><mo>-</mo><mn>1</mn></mrow><mo>&lt;</mo><msup><mn>2</mn><mn>1000</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 999 &lt; 2 ^ 999 + 1 ∧ 2 ^ 999 + 1 &lt; 2 ^ 1000 - 1 ∧ 2 ^ 1000 - 1 &lt; 2 ^ 1000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{999} &lt; 2^{999} + 1 \land 2^{999} + 1 &lt; 2^{1000} - 1 \land 2^{1000} - 1 &lt; 2^{1000}</code></pre></details>
</div>
<p class="thm-remark">the witness and the maximal bracket the thousand-bit range, in order</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
