---
title: "The hexbit route's combinatorics"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `hexbit_route.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/hexbit_route.lean</code> · namespace <code>hexbit_route</code> · 3 theorems · wing <code>the floor</code></p>

The arithmetic that scripts/hexbit-route.ts depends on. A handle is the first 8 hex digits of a content address.
Each hex digit carries 4 bits, so a handle carries 8 × 4 = 32 bits, and the folders are 16^8 = 2^32 in number.

Each theorem below was put to the two-sided court (scripts/court-trial.ts, MCP `court_trial`) and returned SEALED.
The control, `16 ^ 8 = 4294967295`, is false by construction and returned REFUSED: a trial that could not refuse
would seal anything. The control is not compiled into this file, because a false theorem would break the build.

<div class="thm" id="thm-hexbit_route-handle_has_thirty_two_bits">
<p class="thm-label"><strong>Theorem 358</strong> (<code>handle_has_thirty_two_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_hexbit_route_handle_has_thirty_two_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>4</mn><mo>⋅</mo><mn>8</mn></mrow><mo>=</mo><mn>32</mn></mrow></math></div>
<pre class="thm-statement"><code>4 * 8 = 32</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>4 \cdot 8 = 32</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-hexbit_route-folders_are_sixteen_to_the_eight">
<p class="thm-label"><strong>Theorem 359</strong> (<code>folders_are_sixteen_to_the_eight</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_hexbit_route_folders_are_sixteen_to_the_eight.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><msup><mn>16</mn><mn>8</mn></msup><mo>=</mo><mn>4294967296</mn></mrow></math></div>
<pre class="thm-statement"><code>16 ^ 8 = 4294967296</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>16^{8} = 4294967296</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-hexbit_route-folders_are_two_to_the_thirty_two">
<p class="thm-label"><strong>Theorem 360</strong> (<code>folders_are_two_to_the_thirty_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_hexbit_route_folders_are_two_to_the_thirty_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><msup><mn>2</mn><mn>32</mn></msup><mo>=</mo><msup><mn>16</mn><mn>8</mn></msup></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 32 = 16 ^ 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{32} = 16^{8}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
