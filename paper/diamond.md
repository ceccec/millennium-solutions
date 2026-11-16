---
title: "diamond"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `diamond.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/diamond.lean</code> · namespace <code>diamond</code> · 1 theorems · wing <code>unassigned</code></p>

lean/diamond.lean — the diamond involution r(d) = 10 − d on the digits 1..9, as a theorem the kernel checks.
The audit in scripts/mcp.ts reads its verdict from here (lean_ask), not from a JavaScript loop over a literal range.
Decided over a finite list, so it depends on no axiom beyond the kernel.

<div class="thm" id="thm-diamond-diamond_involution">
<p class="thm-label"><strong>Theorem 189</strong> (<code>diamond_involution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diamond_diamond_involution.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>diamond</mi><mo>(</mo><mrow><mi>diamond</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 9).all (fun d =&gt; diamond (diamond d) == d) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{1,\dots,9\},\; \mathrm{diamond}\mathopen{}\left(\mathrm{diamond}\mathopen{}\left(d\right)\right) = d = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

</div>
