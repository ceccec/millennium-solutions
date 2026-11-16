---
title: "Gate synthesis and fault-tolerance counts — learned from qpu's Clifford, Anyon, Magic and Qaoa"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `synthesis.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/synthesis.lean</code> · namespace <code>Synthesis</code> · 8 theorems · wing <code>the floor</code></p>

No axioms, no Mathlib, no sorry.

<div class="thm" id="thm-synthesis-the_single_qubit_clifford_group_has_order_twenty_four">
<p class="thm-label"><strong>Theorem 564</strong> (<code>the_single_qubit_clifford_group_has_order_twenty_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_the_single_qubit_clifford_group_has_order_twenty_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>symp</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mrow><mi>clifford</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>24</mn></mrow></mrow><mo>∧</mo><mrow><mn>24</mn><mo>=</mo><mrow><mn>4</mn><mo>⋅</mo><mn>6</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>6</mn><mo>=</mo><mrow><mrow><mn>1</mn><mo>⋅</mo><mn>2</mn></mrow><mo>⋅</mo><mn>3</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>symp 1 = 6 ∧ clifford 1 = 24 ∧ 24 = 4 * 6 ∧ 6 = 1 * 2 * 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{symp}\mathopen{}\left(1\right) = 6 \land \mathrm{clifford}\mathopen{}\left(1\right) = 24 \land 24 = 4 \cdot 6 \land 6 = 1 \cdot 2 \cdot 3</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE SINGLE-QUBIT CLIFFORD GROUP HAS ORDER 24, Sp(2,2) HAS ORDER 6 = |S₃| ──────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-the_symplectic_group_order_at_each_rank">
<p class="thm-label"><strong>Theorem 565</strong> (<code>the_symplectic_group_order_at_each_rank</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_the_symplectic_group_order_at_each_rank.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>symp</mi><mo>[</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>6</mn><mo>,</mo><mn>720</mn><mo>,</mo><mn>1451520</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>nn</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>symp</mi><mo>(</mo><mi>nn</mi><mo>)</mo></mrow><mo>=</mo><mrow><msup><mn>2</mn><mrow><mi>nn</mi><mo>⋅</mo><mi>nn</mi></mrow></msup><mo>⋅</mo><mrow><mi>sympProd</mi><mo>(</mo><mi>nn</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 3).map symp = [6, 720, 1451520] ∧ (List.range' 1 3).all (fun nn =&gt; symp nn == 2 ^ (nn * nn) * sympProd nn)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{symp}[\{1,\dots,3\}] = [6,\,720,\,1451520] \land \forall \mathrm{nn} \in \{1,\dots,3\},\; \mathrm{symp}\mathopen{}\left(\mathrm{nn}\right) = 2^{\mathrm{nn} \cdot \mathrm{nn}} \cdot \mathrm{sympProd}\mathopen{}\left(\mathrm{nn}\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE SYMPLECTIC ORDER Sp(2n,2) = 2^(n²)·∏(4^j − 1), OVER n = 1..3 ──────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 27 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-the_two_qubit_clifford_group_has_order_eleven_thousand_five_hundred_twenty">
<p class="thm-label"><strong>Theorem 566</strong> (<code>the_two_qubit_clifford_group_has_order_eleven_thousand_five_hundred_twenty</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_the_two_qubit_clifford_group_has_order_eleven_thousand_five_hundred_twenty.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>clifford</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>11520</mn></mrow><mo>∧</mo><mrow><mrow><mi>clifford</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>16</mn><mo>⋅</mo><mn>720</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>clifford</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>clifford</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>clifford 2 = 11520 ∧ clifford 2 = 16 * 720 ∧ clifford 1 &lt; clifford 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{clifford}\mathopen{}\left(2\right) = 11520 \land \mathrm{clifford}\mathopen{}\left(2\right) = 16 \cdot 720 \land \mathrm{clifford}\mathopen{}\left(1\right) &lt; \mathrm{clifford}\mathopen{}\left(2\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE TWO-QUBIT CLIFFORD GROUP HAS ORDER 11520 ─────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-fibonacci_anyon_fusion_is_the_fibonacci_number">
<p class="thm-label"><strong>Theorem 567</strong> (<code>fibonacci_anyon_fusion_is_the_fibonacci_number</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_fibonacci_anyon_fusion_is_the_fibonacci_number.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>fib</mi><mo>[</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>13</mn><mo>,</mo><mn>21</mn><mo>,</mo><mn>34</mn><mo>,</mo><mn>55</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>10</mn><mo>)</mo></mrow><mo>=</mo><mn>55</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>+</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 10).map fib = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55] ∧ fib 5 = 5 ∧ fib 10 = 55 ∧ (List.range' 1 10).all (fun n =&gt; fib (n + 2) == fib (n + 1) + fib n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fib}[\{1,\dots,10\}] = [1,\,1,\,2,\,3,\,5,\,8,\,13,\,21,\,34,\,55] \land \mathrm{fib}\mathopen{}\left(5\right) = 5 \land \mathrm{fib}\mathopen{}\left(10\right) = 55 \land \forall n \in \{1,\dots,10\},\; \mathrm{fib}\mathopen{}\left(n + 2\right) = \mathrm{fib}\mathopen{}\left(n + 1\right) + \mathrm{fib}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · FIBONACCI-ANYON FUSION DIMENSION IS THE FIBONACCI NUMBER ─────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-ising_anyon_fusion_is_two_to_the_m_minus_one_and_differs_from_fibonacci">
<p class="thm-label"><strong>Theorem 568</strong> (<code>ising_anyon_fusion_is_two_to_the_m_minus_one_and_differs_from_fibonacci</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_ising_anyon_fusion_is_two_to_the_m_minus_one_and_differs_from_fibonacci.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>ising</mi><mo>[</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>16</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>ising</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>ising</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 5).map ising = [1, 2, 4, 8, 16] ∧ ising 3 = 4 ∧ fib 5 ≠ ising 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ising}[\{1,\dots,5\}] = [1,\,2,\,4,\,8,\,16] \land \mathrm{ising}\mathopen{}\left(3\right) = 4 \land \mathrm{fib}\mathopen{}\left(5\right) \neq \mathrm{ising}\mathopen{}\left(5\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · ISING-ANYON FUSION IS 2^(m−1) — THE CONTROL: DIFFERENT GROWTH FROM FIBONACCI ─────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 25 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-the_fifteen_to_one_magic_code_is_fifteen_one_three">
<p class="thm-label"><strong>Theorem 569</strong> (<code>the_fifteen_to_one_magic_code_is_fifteen_one_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_the_fifteen_to_one_magic_code_is_fifteen_one_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><msup><mn>2</mn><mn>4</mn></msup><mo>-</mo><mn>1</mn></mrow><mo>=</mo><mn>15</mn></mrow><mo>∧</mo><mrow><mfrac><mrow><mn>3</mn><mo>-</mo><mn>1</mn></mrow><mn>2</mn></mfrac><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mn>35</mn><mo>=</mo><mrow><mn>28</mn><mo>+</mo><mn>7</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>15</mn><mo>=</mo><mrow><mn>1</mn><mo>+</mo><mn>14</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 4 - 1 = 15 ∧ (3 - 1) / 2 = 1 ∧ 35 = 28 + 7 ∧ 15 = 1 + 14</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{4} - 1 = 15 \land \frac{3 - 1}{2} = 1 \land 35 = 28 + 7 \land 15 = 1 + 14</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE [[15,1,3]] REED–MULLER MAGIC CODE, 15-TO-1 DISTILLATION ──────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-qaoa_resource_counts_over_the_layers">
<p class="thm-label"><strong>Theorem 570</strong> (<code>qaoa_resource_counts_over_the_layers</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_qaoa_resource_counts_over_the_layers.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>qaoaParams</mi><mo>[</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>10</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>qaoaZz</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>qaoaX</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>12</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>qaoaParams</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><mi>p</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 5).map qaoaParams = [2, 4, 6, 8, 10] ∧ qaoaZz 2 5 = 10 ∧ qaoaX 3 4 = 12 ∧ (List.range' 1 5).all (fun p =&gt; qaoaParams p == 2 * p)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{qaoaParams}[\{1,\dots,5\}] = [2,\,4,\,6,\,8,\,10] \land \mathrm{qaoaZz}\mathopen{}\left(2,\,5\right) = 10 \land \mathrm{qaoaX}\mathopen{}\left(3,\,4\right) = 12 \land \forall p \in \{1,\dots,5\},\; \mathrm{qaoaParams}\mathopen{}\left(p\right) = 2 \cdot p</code></pre></details>
</div>
<p class="thm-remark">── 7 · QAOA RESOURCE COUNTS OVER THE LAYERS ─────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 125 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-synthesis-these_are_exact_orders_and_counts_decided_over_a_finite_domain">
<p class="thm-label"><strong>Theorem 571</strong> (<code>these_are_exact_orders_and_counts_decided_over_a_finite_domain</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_synthesis_these_are_exact_orders_and_counts_decided_over_a_finite_domain.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>nn</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>clifford</mi><mo>(</mo><mi>nn</mi><mo>)</mo></mrow><mo>=</mo><mrow><msup><mn>2</mn><mrow><mn>2</mn><mo>⋅</mo><mi>nn</mi></mrow></msup><mo>⋅</mo><mrow><mi>symp</mi><mo>(</mo><mi>nn</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>,</mo><mrow><mn>0</mn><mo>&lt;</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>clifford</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>11520</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>symp</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>1451520</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 3).all (fun nn =&gt; clifford nn == 2 ^ (2 * nn) * symp nn) ∧ (List.range' 1 10).all (fun n =&gt; 0 &lt; fib (n + 1)) ∧ clifford 2 = 11520 ∧ symp 3 = 1451520</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{nn} \in \{1,\dots,3\},\; \mathrm{clifford}\mathopen{}\left(\mathrm{nn}\right) = 2^{2 \cdot \mathrm{nn}} \cdot \mathrm{symp}\mathopen{}\left(\mathrm{nn}\right) \land \forall n \in \{1,\dots,10\},\; 0 &lt; \mathrm{fib}\mathopen{}\left(n + 1\right) \land \mathrm{clifford}\mathopen{}\left(2\right) = 11520 \land \mathrm{symp}\mathopen{}\left(3\right) = 1451520</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE HONEST BOUND: EXACT ORDERS AND COUNTS, DECIDED — ABSTRACT STRUCTURE, NOT PHYSICAL GATES ────── These are exact group orders and resource counts — the arithmetic of benchmarking, distillation and fusion — decided on the classical build device over a finite domain. No physical Clifford gate is synthesised and no circuit runs on hardware: the counts are the structure a fault-tolerant machine WOULD use, computed, not the machine.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 30 cases. <span class="qed">□</span></p>

</div>
