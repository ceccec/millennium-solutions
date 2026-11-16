---
title: "The T-count wall — why a classical Pauli-path computation, which has no width limit, still cannot run Shor's circuit on a thousand-bit modulus, and why a physical processor is needed there: a statement about cost, not a factoring"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `t_count_wall.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/t_count_wall.lean</code> · namespace <code>TCountWall</code> · 8 theorems · wing <code>the floor</code></p>

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>w1 := (0, 1, 0, 0)          -- ω
w7 := (0, 0, 0, -1)         -- ω⁷ = ω̄ = −ω³
sevenT := [.h 2, .cx 1 2, .tdg 2, .cx 0 2, .t 2, .cx 1 2, .tdg 2, .cx 0 2, .t 1, .t 2, .h 2, .cx 0 1, .t 0, .tdg 1, .cx 0 1]</code></pre>

<div class="thm" id="thm-t_count_wall-the_toffoli_is_exactly_a_circuit_of_seven_t_gates">
<p class="thm-label"><strong>Theorem 572</strong> (<code>the_toffoli_is_exactly_a_circuit_of_seven_t_gates</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_the_toffoli_is_exactly_a_circuit_of_seven_t_gates.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>run</mi><mo>(</mo><mi>sevenT</mi><mo>,</mo><mrow><mi>basis</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>gen</mi><mo>(</mo><mrow><mi>j</mi><mo>↦</mo><mrow><mo>(</mo><mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>if</mo><mrow><mi>j</mi><mo>=</mo><mrow><mi>toffoliOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow></mrow><mo>;</mo><mo>otherwise</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>tGates</mi><mo>(</mo><mi>sevenT</mi><mo>)</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun i =&gt; run sevenT (basis i) == gen (fun j =&gt; if j == toffoliOf i then (2, 0, 0, 0) else (0, 0, 0, 0))) ∧ tGates sevenT = 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,7\},\; \mathrm{run}\mathopen{}\left(\mathrm{sevenT},\,\mathrm{basis}\mathopen{}\left(i\right)\right) = \mathrm{gen}\mathopen{}\left(j \mapsto \begin{cases}\left(2,\,0,\,0,\,0\right) &amp; \text{if } j = \mathrm{toffoliOf}\mathopen{}\left(i\right)\\ \left(0,\,0,\,0,\,0\right) &amp; \text{otherwise}\end{cases}\right) \land \mathrm{tGates}\mathopen{}\left(\mathrm{sevenT}\right) = 7</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE TOFFOLI IS SEVEN T GATES, EXACTLY ─────────────────────────────────────────────────────────────────── On all eight basis inputs the circuit equals the Toffoli (at the scale 2 of its two unnormalised H), and it holds seven T and T† gates. This is where "seven T per Toffoli" in every count below comes from: checked, not assumed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-the_schoolbook_shor_construction_has_t_count_twenty_eight_n_cubed">
<p class="thm-label"><strong>Theorem 573</strong> (<code>the_schoolbook_shor_construction_has_t_count_twenty_eight_n_cubed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_the_schoolbook_shor_construction_has_t_count_twenty_eight_n_cubed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>64</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>shorT</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mn>28</mn><mo>⋅</mo><msup><mi>n</mi><mn>3</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mn>28000000000</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 64).all (fun n =&gt; shorT n == 28 * n ^ 3) ∧ shorT 1000 = 28000000000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,64\},\; \mathrm{shorT}\mathopen{}\left(n\right) = 28 \cdot n^{3} \land \mathrm{shorT}\mathopen{}\left(1000\right) = 28000000000</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE CONSTRUCTION'S T-COUNT IS 28n³ ────────────────────────────────────────────────────────────────────── 2n multiplications × n additions × 2n Toffolis × 7 T = 28n³, for every n from 1 to 64, and at the thousand-bit modulus it is 28 000 000 000. An undercount for this construction — its modular reduction adds more — never an overcount.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-a_thousand_bit_shor_circuit_fits_in_seventeen_uuids_of_particles">
<p class="thm-label"><strong>Theorem 574</strong> (<code>a_thousand_bit_shor_circuit_fits_in_seventeen_uuids_of_particles</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_a_thousand_bit_shor_circuit_fits_in_seventeen_uuids_of_particles.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>shorQubits</mi><mo>(</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mn>2003</mn></mrow><mo>∧</mo><mrow><mn>2003</mn><mo>≤</mo><mrow><mn>17</mn><mo>⋅</mo><mn>122</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mn>2003</mn><mo>≤</mo><mrow><mn>16</mn><mo>⋅</mo><mn>122</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>shorQubits 1000 = 2003 ∧ 2003 ≤ 17 * 122 ∧ ¬ (2003 ≤ 16 * 122)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{shorQubits}\mathopen{}\left(1000\right) = 2003 \land 2003 \le 17 \cdot 122 \land \lnot 2003 \le 16 \cdot 122</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE WIDTH IS NOT THE WALL ─────────────────────────────────────────────────────────────────────────────── A thousand-bit modulus needs 2n + 3 = 2003 qubits: seventeen UUIDs' 122 particles hold them, sixteen do not. The UUID space holds 2^122 UUIDs. Width is free for Pauli paths (pauli_paths.lean); what remains is the T-count.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-the_pauli_path_worst_case_passes_ten_to_the_eighty_at_three_bits">
<p class="thm-label"><strong>Theorem 575</strong> (<code>the_pauli_path_worst_case_passes_ten_to_the_eighty_at_three_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_the_pauli_path_worst_case_passes_ten_to_the_eighty_at_three_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>224</mn></mrow><mo>∧</mo><mrow><mrow><mi>worstTerms</mi><mo>(</mo><mrow><mi>shorT</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>&lt;</mo><msup><mn>10</mn><mn>80</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>756</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>worstTerms</mi><mo>(</mo><mrow><mi>shorT</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>&gt;</mo><msup><mn>10</mn><mn>80</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>shorT 2 = 224 ∧ worstTerms (shorT 2) &lt; 10 ^ 80 ∧ shorT 3 = 756 ∧ worstTerms (shorT 3) &gt; 10 ^ 80</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{shorT}\mathopen{}\left(2\right) = 224 \land \mathrm{worstTerms}\mathopen{}\left(\mathrm{shorT}\mathopen{}\left(2\right)\right) &lt; 10^{80} \land \mathrm{shorT}\mathopen{}\left(3\right) = 756 \land \mathrm{worstTerms}\mathopen{}\left(\mathrm{shorT}\mathopen{}\left(3\right)\right) &gt; 10^{80}</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE WORST CASE PASSES 10⁸⁰ AT THREE BITS ──────────────────────────────────────────────────────────────── 2^T terms in the worst case: at n = 2 the construction's T-count is 224 and 2^224 &lt; 10⁸⁰; at n = 3 it is 756 and 2^756 &gt; 10⁸⁰. The worst case is pessimistic — light cones and cancellation can keep the true term count far lower — but it is the only bound the method guarantees, and it is already past any physical count of anything at three bits.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-the_floors_modulus_two_to_the_999_plus_one_has_exactly_a_thousand_bits">
<p class="thm-label"><strong>Theorem 576</strong> (<code>the_floors_modulus_two_to_the_999_plus_one_has_exactly_a_thousand_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_the_floors_modulus_two_to_the_999_plus_one_has_exactly_a_thousand_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>≤</mo><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mn>999</mn></msup><mo>+</mo><mn>1</mn></mrow><mo>&lt;</mo><msup><mn>2</mn><mn>1000</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mn>7</mn><mo>⋅</mo><mn>4</mn></mrow><mo>⋅</mo><msup><mn>1000</mn><mn>3</mn></msup></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 999 ≤ 2 ^ 999 + 1 ∧ 2 ^ 999 + 1 &lt; 2 ^ 1000 ∧ shorT 1000 = 7 * 4 * 1000 ^ 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{999} \le 2^{999} + 1 \land 2^{999} + 1 &lt; 2^{1000} \land \mathrm{shorT}\mathopen{}\left(1000\right) = 7 \cdot 4 \cdot 1000^{3}</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE THOUSAND-BIT MODULUS OF THE FLOOR IS A THOUSAND BITS ──────────────────────────────────────────────── qpu_crypto.lean §6 names N = 2^999 + 1 and leaves it unfactored here. It has exactly 1000 bits — at least 2^999, below 2^1000 — so the construction's T-count for it is shorT 1000, the 28·10⁹ of theorem 2.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-the_bound_depends_on_the_t_count_and_not_on_the_width">
<p class="thm-label"><strong>Theorem 577</strong> (<code>the_bound_depends_on_the_t_count_and_not_on_the_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_the_bound_depends_on_the_t_count_and_not_on_the_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>cost</mi><mo>(</mo><mi>t</mi><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mi>cost</mi><mo>(</mo><mi>t</mi><mo>,</mo><mn>2003</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>cost</mi><mo>(</mo><mrow><mi>t</mi><mo>+</mo><mn>1</mn></mrow><mo>,</mo><mn>2003</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><mrow><mi>cost</mi><mo>(</mo><mi>t</mi><mo>,</mo><mn>2003</mn><mo>)</mo></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>cost</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>2003</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun t =&gt; cost t 2 == cost t 2003 &amp;&amp; cost (t + 1) 2003 == 2 * cost t 2003) ∧ cost 0 2003 = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall t \in \{0,\dots,8\},\; \mathrm{cost}\mathopen{}\left(t,\,2\right) = \mathrm{cost}\mathopen{}\left(t,\,2003\right) \land \mathrm{cost}\mathopen{}\left(t + 1,\,2003\right) = 2 \cdot \mathrm{cost}\mathopen{}\left(t,\,2003\right) \land \mathrm{cost}\mathopen{}\left(0,\,2003\right) = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-a_constant_factor_saving_leaves_the_t_count_cubic">
<p class="thm-label"><strong>Theorem 578</strong> (<code>a_constant_factor_saving_leaves_the_t_count_cubic</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_a_constant_factor_saving_leaves_the_t_count_cubic.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>64</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mfrac><mrow><mi>shorT</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></mfrac><mo>⋅</mo><mn>2</mn></mrow><mo>=</mo><mrow><mi>shorT</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mfrac><mrow><mi>shorT</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>4</mn></mfrac><mo>⋅</mo><mn>4</mn></mrow><mo>=</mo><mrow><mi>shorT</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>shorT</mi><mo>(</mo><mn>1000</mn><mo>)</mo></mrow><mn>4</mn></mfrac><mo>&gt;</mo><msup><mn>10</mn><mn>9</mn></msup></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>shorT</mi><mo>(</mo><mn>1000</mn><mo>)</mo></mrow><mn>2</mn></mfrac><mo>&gt;</mo><msup><mn>10</mn><mn>9</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 64).all (fun n =&gt; shorT n / 2 * 2 == shorT n &amp;&amp; shorT n / 4 * 4 == shorT n) ∧ shorT 1000 / 4 &gt; 10 ^ 9 ∧ shorT 1000 / 2 &gt; 10 ^ 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,64\},\; \frac{\mathrm{shorT}\mathopen{}\left(n\right)}{2} \cdot 2 = \mathrm{shorT}\mathopen{}\left(n\right) \land \frac{\mathrm{shorT}\mathopen{}\left(n\right)}{4} \cdot 4 = \mathrm{shorT}\mathopen{}\left(n\right) \land \frac{\mathrm{shorT}\mathopen{}\left(1000\right)}{4} &gt; 10^{9} \land \frac{\mathrm{shorT}\mathopen{}\left(1000\right)}{2} &gt; 10^{9}</code></pre></details>
</div>
<p class="thm-remark">── 7 · A BETTER CONSTRUCTION MOVES THE WALL BY A CONSTANT, NOT OFF THE MAP ───────────────────────────────────── Halving the Toffolis per addition, or the additions per multiplication, divides the T-count by a constant; the count stays cubic in n, so the worst case stays 2^(c·n³). Decided for halving and quartering: at n = 1000 both still exceed 10⁹ T.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-t_count_wall-a_one_bit_instance_is_within_reach_and_the_thousand_bit_one_is_not">
<p class="thm-label"><strong>Theorem 579</strong> (<code>a_one_bit_instance_is_within_reach_and_the_thousand_bit_one_is_not</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_tcountwall_a_one_bit_instance_is_within_reach_and_the_thousand_bit_one_is_not.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>28</mn></mrow><mo>∧</mo><mrow><mrow><mi>worstTerms</mi><mo>(</mo><mrow><mi>shorT</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>&lt;</mo><msup><mn>10</mn><mn>9</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>1000</mn><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>shorT</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>⋅</mo><msup><mn>10</mn><mn>9</mn></msup></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>shorT 1 = 28 ∧ worstTerms (shorT 1) &lt; 10 ^ 9 ∧ shorT 1000 = shorT 1 * 10 ^ 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{shorT}\mathopen{}\left(1\right) = 28 \land \mathrm{worstTerms}\mathopen{}\left(\mathrm{shorT}\mathopen{}\left(1\right)\right) &lt; 10^{9} \land \mathrm{shorT}\mathopen{}\left(1000\right) = \mathrm{shorT}\mathopen{}\left(1\right) \cdot 10^{9}</code></pre></details>
</div>
<p class="thm-remark">── 8 · AND A SMALL MODULUS IS INSIDE THE WALL (control) ──────────────────────────────────────────────────────── The wall is located, not asserted everywhere: at n = 1 the construction's T-count is 28 and its worst case 2^28 terms is within reach, which is why the small instances the deposit does run (91 = 7 × 13 in qpu_crypto.lean) are classical work, and the thousand-bit one is not: its T-count is exactly 10⁹ times the one-bit count — 1000³, the cube of the ratio of the bit lengths — so its worst case is 2^(28·10⁹), not 2^28.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
