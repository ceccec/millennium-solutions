---
title: "Counting Rocks — the counting identities"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `counting-rocks.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/counting-rocks.lean</code> · namespace <code>CountingRocks</code> · 9 theorems · wing <code>the ring</code></p>

Counting identities from Counting Rocks!, decided by the kernel over the ranges the theorems state.


Section numbers in each comment are the book's. The book's text is not copied; only its formulas and values are restated.
The Catalan numbers, the Cayley count of labeled trees, and the other sections are not in this file yet.

<div class="thm" id="thm-counting-rocks-pascal_rule">
<p class="thm-label"><strong>Theorem 682</strong> (<code>pascal_rule</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_pascal_rule.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n &lt; 12, ∀ k &lt; n, choose (n+1) (k+1) = choose n k + choose n (k+1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-row_sum_is_power_of_two">
<p class="thm-label"><strong>Theorem 683</strong> (<code>row_sum_is_power_of_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_row_sum_is_power_of_two.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n &lt; 12, rowSum n = 2^n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-handshakes_five_people">
<p class="thm-label"><strong>Theorem 684</strong> (<code>handshakes_five_people</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_handshakes_five_people.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>handshakes</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow></math></div>
<pre class="thm-statement"><code>handshakes 5 = 10</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{handshakes}\mathopen{}\left(5\right) = 10</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-degrees_sum_to_twice_handshakes">
<p class="thm-label"><strong>Theorem 685</strong> (<code>degrees_sum_to_twice_handshakes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_degrees_sum_to_twice_handshakes.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n &lt; 60, n * (n-1) = 2 * handshakes n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-four_objects_have_24_orderings">
<p class="thm-label"><strong>Theorem 686</strong> (<code>four_objects_have_24_orderings</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_four_objects_have_24_orderings.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>fact</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>24</mn></mrow></math></div>
<pre class="thm-statement"><code>fact 4 = 24</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fact}\mathopen{}\left(4\right) = 24</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-derangement_values">
<p class="thm-label"><strong>Theorem 687</strong> (<code>derangement_values</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_derangement_values.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>der</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mi>der</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>der</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>44</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>der</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>265</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>der</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mn>1854</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>der</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mn>14833</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>der 3 = 2 ∧ der 4 = 9 ∧ der 5 = 44 ∧ der 6 = 265 ∧ der 7 = 1854 ∧ der 8 = 14833</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{der}\mathopen{}\left(3\right) = 2 \land \mathrm{der}\mathopen{}\left(4\right) = 9 \land \mathrm{der}\mathopen{}\left(5\right) = 44 \land \mathrm{der}\mathopen{}\left(6\right) = 265 \land \mathrm{der}\mathopen{}\left(7\right) = 1854 \land \mathrm{der}\mathopen{}\left(8\right) = 14833</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-derangement_second_recurrence">
<p class="thm-label"><strong>Theorem 688</strong> (<code>derangement_second_recurrence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_derangement_second_recurrence.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n &lt; 12, 2 ≤ n → (der n : Int) = (n : Int) * (der (n-1) : Int) + (if n % 2 = 0 then 1 else -1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-fibonacci_ten">
<p class="thm-label"><strong>Theorem 689</strong> (<code>fibonacci_ten</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_fibonacci_ten.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>fib</mi><mo>(</mo><mn>10</mn><mo>)</mo></mrow><mo>=</mo><mn>55</mn></mrow></math></div>
<pre class="thm-statement"><code>fib 10 = 55</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fib}\mathopen{}\left(10\right) = 55</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-counting-rocks-fibonacci_partial_sums">
<p class="thm-label"><strong>Theorem 690</strong> (<code>fibonacci_partial_sums</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_countingrocks_fibonacci_partial_sums.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n &lt; 20, 1 ≤ n → (List.range n).foldl (fun acc k =&gt; acc + fib (k+1)) 0 + 1 = fib (n+2)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
