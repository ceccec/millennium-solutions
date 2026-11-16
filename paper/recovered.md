---
title: "Recovered — claims that computed and were withdrawn for want of a proof"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `recovered.lean`

<p class="paper-src"><code>src/iso/690-record/recovered.lean</code> · namespace <code>Recovered</code> · 15 theorems · wing <code>the returned</code></p>

WITHDRAWAL WAS NEVER THE ONLY OPTION. Each theorem below returns one claim to the record. The evidence
that existed was a TypeScript run — a computation that agreed once on one machine. The kernel walks the
whole stated domain. That was the gap, and closing it is arithmetic.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>units := Z9.units
triad := [3, 6, 9]</code></pre>

<div class="thm" id="thm-recovered-units_sum_zero">
<p class="thm-label"><strong>Theorem 1577</strong> (<code>units_sum_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_units_sum_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∑</mo><mi>units</mi></mrow><mo>=</mo><mn>27</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∑</mo><mi>units</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(units.foldl (· + ·) 0) = 27 ∧ (units.foldl (· + ·) 0) % 9 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\sum \mathrm{units} = 27 \land \sum \mathrm{units} \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-self_inverse_1_8">
<p class="thm-label"><strong>Theorem 1578</strong> (<code>self_inverse_1_8</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_self_inverse_1_8.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 9).filter (fun d =&gt; d * d % 9 == 1)) = [1, 8]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \{0,\dots,8\} \mid d \cdot d \bmod 9 = 1 \,\} = [1,\,8]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 18 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-triad_nilpotent">
<p class="thm-label"><strong>Theorem 1579</strong> (<code>triad_nilpotent</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_triad_nilpotent.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>triad</mi><mo>,</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>triad.all (fun d =&gt; d * d % 9 == 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{triad},\; d \cdot d \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-triad_sum_zero">
<p class="thm-label"><strong>Theorem 1580</strong> (<code>triad_sum_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_triad_sum_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∑</mo><mi>triad</mi></mrow><mo>=</mo><mn>18</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∑</mo><mi>triad</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(triad.foldl (· + ·) 0) = 18 ∧ (triad.foldl (· + ·) 0) % 9 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\sum \mathrm{triad} = 18 \land \sum \mathrm{triad} \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-units_product_neg1">
<p class="thm-label"><strong>Theorem 1581</strong> (<code>units_product_neg1</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_units_product_neg1.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>fold</mi><mo>(</mo><mrow><mo>(</mo><mo>·</mo><mo>⋅</mo><mo>·</mo><mo>)</mo></mrow><mo>,</mo><mi>units</mi><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>8</mn></mrow></math></div>
<pre class="thm-statement"><code>(units.foldl (· * ·) 1) % 9 = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\operatorname{fold}_{(\cdot\,\cdot\,\cdot)}\left(\mathrm{units},\, 1\right) \bmod 9 = 8</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-order_of_2_is_6">
<p class="thm-label"><strong>Theorem 1582</strong> (<code>order_of_2_is_6</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_order_of_2_is_6.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>pow9</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pow9</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>≠</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pow9 2 6 = 1 ∧ ((List.range' 1 5).all (fun k =&gt; pow9 2 k != 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{pow9}\mathopen{}\left(2,\,6\right) = 1 \land \forall k \in \{1,\dots,5\},\; \mathrm{pow9}\mathopen{}\left(2,\,k\right) \neq 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 5 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-sum_1_to_9_zero">
<p class="thm-label"><strong>Theorem 1583</strong> (<code>sum_1_to_9_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_sum_1_to_9_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow></mrow><mo>=</mo><mn>45</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 1 9).foldl (· + ·) 0) = 45 ∧ ((List.range' 1 9).foldl (· + ·) 0) % 9 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\sum \{1,\dots,9\} = 45 \land \sum \{1,\dots,9\} \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-doubling_digitroot_period6">
<p class="thm-label"><strong>Theorem 1584</strong> (<code>doubling_digitroot_period6</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_doubling_digitroot_period6.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mrow><mi>pow9</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>pow9</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mrow><mi>pow9</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 6).map (fun k =&gt; pow9 2 k)) = [1, 2, 4, 8, 7, 5] ∧ pow9 2 6 = pow9 2 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, \mathrm{pow9}\mathopen{}\left(2,\,k\right) \mid k \in \{0,\dots,5\} \,\} = [1,\,2,\,4,\,8,\,7,\,5] \land \mathrm{pow9}\mathopen{}\left(2,\,6\right) = \mathrm{pow9}\mathopen{}\left(2,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-unit_exp_id_k6">
<p class="thm-label"><strong>Theorem 1585</strong> (<code>unit_exp_id_k6</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_unit_exp_id_k6.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mi>units</mi><mo>,</mo><mrow><mrow><mi>pow9</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>units.all (fun u =&gt; pow9 u 6 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall u \in \mathrm{units},\; \mathrm{pow9}\mathopen{}\left(u,\,6\right) = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-unit_exp_id_k12">
<p class="thm-label"><strong>Theorem 1586</strong> (<code>unit_exp_id_k12</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_unit_exp_id_k12.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mi>units</mi><mo>,</mo><mrow><mrow><mi>pow9</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>12</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>units.all (fun u =&gt; pow9 u 12 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall u \in \mathrm{units},\; \mathrm{pow9}\mathopen{}\left(u,\,12\right) = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-unit_exp_id_k18">
<p class="thm-label"><strong>Theorem 1587</strong> (<code>unit_exp_id_k18</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_unit_exp_id_k18.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mi>units</mi><mo>,</mo><mrow><mrow><mi>pow9</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>18</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>units.all (fun u =&gt; pow9 u 18 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall u \in \mathrm{units},\; \mathrm{pow9}\mathopen{}\left(u,\,18\right) = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-powperm_k5">
<p class="thm-label"><strong>Theorem 1588</strong> (<code>powperm_k5</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_powperm_k5.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>pow9</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>∣</mo><mi>u</mi><mo>∈</mo><mi>units</mi><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></math></div>
<pre class="thm-statement"><code>(units.map (fun u =&gt; pow9 u 5)).eraseDups.length = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{pow9}\mathopen{}\left(u,\,5\right) \mid u \in \mathrm{units} \,\}\right)\right| = 6</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-powperm_k7">
<p class="thm-label"><strong>Theorem 1589</strong> (<code>powperm_k7</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_powperm_k7.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>pow9</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>7</mn><mo>)</mo></mrow><mo>∣</mo><mi>u</mi><mo>∈</mo><mi>units</mi><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></math></div>
<pre class="thm-statement"><code>(units.map (fun u =&gt; pow9 u 7)).eraseDups.length = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{pow9}\mathopen{}\left(u,\,7\right) \mid u \in \mathrm{units} \,\}\right)\right| = 6</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-qr_u1">
<p class="thm-label"><strong>Theorem 1590</strong> (<code>qr_u1</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_qr_u1.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∃</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).any (fun d =&gt; d * d % 9 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists d \in \{0,\dots,8\} : d \cdot d \bmod 9 = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-recovered-qr_u4">
<p class="thm-label"><strong>Theorem 1591</strong> (<code>qr_u4</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_recovered_qr_u4.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∃</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>4</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).any (fun d =&gt; d * d % 9 == 4)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists d \in \{0,\dots,8\} : d \cdot d \bmod 9 = 4</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

</div>
