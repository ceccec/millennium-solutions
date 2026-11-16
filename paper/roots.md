---
title: "The constants, derived from what they are"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `roots.lean`

<p class="paper-src"><code>src/iso/iec-18033-cryptography/roots.lean</code> · namespace <code>Roots</code> · 7 theorems · wing <code>the floor</code></p>

src/iso/iec-18033-cryptography/hash/sha512.ts used to carry eighty-eight hexadecimal literals. It computes them now, from the
definition FIPS gives — and that trade is only a gain if the computation is right. A wrong root gives a
hash that is self-consistent, round-trips perfectly, and is not SHA-512; the old literals at least had
the property that someone had once copied them from the standard.

So the derivation is decided here, and the pins below are the point rather than a lapse: `merge_agrees`
in merkle.lean does the same thing for the fold. A published value written down and compared against a
computation is an AGREEMENT check, which is the opposite of a typed constant standing in for one.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>settledHere := 7</code></pre>

<div class="thm" id="thm-roots-the_cube_root_is_the_floor">
<p class="thm-label"><strong>Theorem 529</strong> (<code>the_cube_root_is_the_floor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_cube_root_is_the_floor.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><msup><mrow><mi>iroot</mi><mo>(</mo><mn>3</mn><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>192</mn></msup></mrow><mo>)</mo></mrow><mn>3</mn></msup><mo>≤</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>192</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>iroot 3 (2 * 2 ^ 192) ^ 3 &lt;= 2 * 2 ^ 192</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{iroot}\mathopen{}\left(3,\,2 \cdot 2^{192}\right)^{3} \le 2 \cdot 2^{192}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-roots-the_cube_root_is_not_one_short">
<p class="thm-label"><strong>Theorem 530</strong> (<code>the_cube_root_is_not_one_short</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_cube_root_is_not_one_short.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>192</mn></msup></mrow><mo>&lt;</mo><msup><mrow><mrow><mi>iroot</mi><mo>(</mo><mn>3</mn><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>192</mn></msup></mrow><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow><mn>3</mn></msup></mrow></math></div>
<pre class="thm-statement"><code>2 * 2 ^ 192 &lt; (iroot 3 (2 * 2 ^ 192) + 1) ^ 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2 \cdot 2^{192} &lt; \mathrm{iroot}\mathopen{}\left(3,\,2 \cdot 2^{192}\right) + 1^{3}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-roots-the_square_root_is_the_floor_and_not_one_short">
<p class="thm-label"><strong>Theorem 531</strong> (<code>the_square_root_is_the_floor_and_not_one_short</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_square_root_is_the_floor_and_not_one_short.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><msup><mrow><mi>iroot</mi><mo>(</mo><mn>2</mn><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>128</mn></msup></mrow><mo>)</mo></mrow><mn>2</mn></msup><mo>≤</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>128</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>128</mn></msup></mrow><mo>&lt;</mo><msup><mrow><mrow><mi>iroot</mi><mo>(</mo><mn>2</mn><mo>,</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>128</mn></msup></mrow><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow><mn>2</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>iroot 2 (2 * 2 ^ 128) ^ 2 &lt;= 2 * 2 ^ 128 ∧ 2 * 2 ^ 128 &lt; (iroot 2 (2 * 2 ^ 128) + 1) ^ 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{iroot}\mathopen{}\left(2,\,2 \cdot 2^{128}\right)^{2} \le 2 \cdot 2^{128} \land 2 \cdot 2^{128} &lt; \mathrm{iroot}\mathopen{}\left(2,\,2 \cdot 2^{128}\right) + 1^{2}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-roots-the_prime_generator_is_complete">
<p class="thm-label"><strong>Theorem 532</strong> (<code>the_prime_generator_is_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_prime_generator_is_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>firstPrimes</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>11</mn><mo>,</mo><mn>13</mn><mo>,</mo><mn>17</mn><mo>,</mo><mn>19</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mi>firstPrimes</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>,</mo><mi>isPrime</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>∣</mo><mi>isPrime</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>firstPrimes 40 8 = [2, 3, 5, 7, 11, 13, 17, 19] ∧ (firstPrimes 40 8).all isPrime ∧ ((List.range' 2 18).filter isPrime).length = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{firstPrimes}\mathopen{}\left(40,\,8\right) = [2,\,3,\,5,\,7,\,11,\,13,\,17,\,19] \land \forall x \in \mathrm{firstPrimes}\mathopen{}\left(40,\,8\right),\; \mathrm{isPrime}\mathopen{}\left(x\right) \land \left|\{\, x \in \{2,\dots,19\} \mid \mathrm{isPrime}\mathopen{}\left(x\right) \,\}\right| = 8</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 144 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-roots-the_first_round_constant_is_that_cube_root_fraction">
<p class="thm-label"><strong>Theorem 533</strong> (<code>the_first_round_constant_is_that_cube_root_fraction</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_first_round_constant_is_that_cube_root_fraction.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>frac64</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>0</mn><mo>(</mo><mi>x428a2f98d728ae22</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>frac64 3 2 = 0x428a2f98d728ae22</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{frac64}\mathopen{}\left(3,\,2\right) = 0\mathopen{}\left(\mathrm{x428a2f98d728ae22}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-roots-the_first_initial_value_is_that_square_root_fraction">
<p class="thm-label"><strong>Theorem 534</strong> (<code>the_first_initial_value_is_that_square_root_fraction</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_first_initial_value_is_that_square_root_fraction.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>frac64</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>0</mn><mo>(</mo><mi>x6a09e667f3bcc908</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>frac64 2 2 = 0x6a09e667f3bcc908</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{frac64}\mathopen{}\left(2,\,2\right) = 0\mathopen{}\left(\mathrm{x6a09e667f3bcc908}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-roots-the_cube_and_the_square_do_not_agree">
<p class="thm-label"><strong>Theorem 535</strong> (<code>the_cube_and_the_square_do_not_agree</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_roots_the_cube_and_the_square_do_not_agree.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>frac64</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>frac64</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>frac64</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>frac64</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>frac64 3 2 != frac64 2 2 ∧ frac64 3 3 != frac64 2 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{frac64}\mathopen{}\left(3,\,2\right) \neq \mathrm{frac64}\mathopen{}\left(2,\,2\right) \land \mathrm{frac64}\mathopen{}\left(3,\,3\right) \neq \mathrm{frac64}\mathopen{}\left(2,\,3\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
