---
title: "arith"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `arith.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/arith.lean</code> · namespace <code>Answer.Arith</code> · 7 theorems · wing <code>unassigned</code></p>

src/iso/80000-2-mathematics/arith.lean — the arithmetic decision of the answer system, as kernel-checked definitions.

The C2 verifier (src/answer/verify-arith.ts) PROPOSES a verdict: a prime to be proved by trial division, or a
composite with a factor. The kernel decides it here. A proposal the kernel cannot check comes back UNKNOWN, so a
wrong proposal can never become a TRUE or FALSE. The lemmas below say why a checked factor rules out primality, and
that a missing witness can never produce FALSE.

<div class="thm" id="thm-arith-factor_rules_out_prime">
<p class="thm-label"><strong>Theorem 182</strong> (<code>factor_rules_out_prime</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_factor_rules_out_prime.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>primeB</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>primeB n = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{primeB}\mathopen{}\left(n\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-arith-case_91_false">
<p class="thm-label"><strong>Theorem 183</strong> (<code>case_91_false</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_case_91_false.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verdictOf</mi><mo>(</mo><mn>91</mn><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mrow><mo>(</mo><mn>7</mn><mo>,</mo><mn>13</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Value.FALSE</mi></mrow></math></div>
<pre class="thm-statement"><code>verdictOf 91 (some (7, 13)) = Value.FALSE</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdictOf}\mathopen{}\left(91,\,\mathrm{some}\mathopen{}\left(\left(7,\,13\right)\right)\right) = \mathrm{Value.FALSE}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-arith-case_97_true">
<p class="thm-label"><strong>Theorem 184</strong> (<code>case_97_true</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_case_97_true.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verdictOf</mi><mo>(</mo><mn>97</mn><mo>,</mo><mi>none</mi><mo>)</mo></mrow><mo>=</mo><mi>Value.TRUE</mi></mrow></math></div>
<pre class="thm-statement"><code>verdictOf 97 none = Value.TRUE</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdictOf}\mathopen{}\left(97,\,\mathrm{none}\right) = \mathrm{Value.TRUE}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-arith-case_91_no_witness_unknown">
<p class="thm-label"><strong>Theorem 185</strong> (<code>case_91_no_witness_unknown</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_case_91_no_witness_unknown.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verdictOf</mi><mo>(</mo><mn>91</mn><mo>,</mo><mi>none</mi><mo>)</mo></mrow><mo>=</mo><mi>Value.UNKNOWN</mi></mrow></math></div>
<pre class="thm-statement"><code>verdictOf 91 none = Value.UNKNOWN</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdictOf}\mathopen{}\left(91,\,\mathrm{none}\right) = \mathrm{Value.UNKNOWN}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-arith-wrong_witness_refused">
<p class="thm-label"><strong>Theorem 186</strong> (<code>wrong_witness_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_wrong_witness_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verdictOf</mi><mo>(</mo><mn>97</mn><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mrow><mo>(</mo><mn>7</mn><mo>,</mo><mn>13</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Value.UNKNOWN</mi></mrow></math></div>
<pre class="thm-statement"><code>verdictOf 97 (some (7, 13)) = Value.UNKNOWN</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdictOf}\mathopen{}\left(97,\,\mathrm{some}\mathopen{}\left(\left(7,\,13\right)\right)\right) = \mathrm{Value.UNKNOWN}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-arith-no_witness_never_false">
<p class="thm-label"><strong>Theorem 187</strong> (<code>no_witness_never_false</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_no_witness_never_false.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verdictOf</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>none</mi><mo>)</mo></mrow><mo>≠</mo><mi>Value.FALSE</mi></mrow></math></div>
<pre class="thm-statement"><code>verdictOf n none ≠ Value.FALSE</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdictOf}\mathopen{}\left(n,\,\mathrm{none}\right) \neq \mathrm{Value.FALSE}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  show</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-arith-false_implies_not_prime">
<p class="thm-label"><strong>Theorem 188</strong> (<code>false_implies_not_prime</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer.arith_false_implies_not_prime.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>primeB</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>primeB n = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{primeB}\mathopen{}\left(n\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  obtain</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
