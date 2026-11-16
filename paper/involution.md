---
title: "What every involution gives, and what it does not"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `involution.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/involution.lean</code> · namespace <code>Involution</code> · 8 theorems · wing <code>the ring</code></p>

THE QUESTION, and it was asked as "do involutions always give a harmonic result?".

Two readings of "harmonic" are decided here over ALL 2620 involutions of a nine-element set, enumerated
rather than sampled. One holds everywhere. The other does not, and the second is the more useful answer,
because a claim that survives only on the examples someone happened to pick is the thing this deposit
exists to refuse.

  ALWAYS  — every involution fixes at least one point, and its fixed points are ODD in number.
            On nine elements the centre is never absent. There is no involution of ℤ/9 with nothing
            standing still, and that is not a property of the ones chosen here, it is a property of all
            of them.

  NOT ALWAYS — "every swapped pair sums to the same value", which is what `refl d = 10 - d` does and
            what makes the coin's two sides sides of one thing. That is RARE: 90 of 2620, about one in
            twenty-nine. It is a property of a particular involution, never of involutions.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>nine := [0, 1, 2, 3, 4, 5, 6, 7, 8]
all := matchings 10 nine
coinLike := [(0, 0), (1, 8), (2, 7), (3, 6), (4, 5)]</code></pre>

<div class="thm" id="thm-involution-there_are_2620_involutions_of_nine">
<p class="thm-label"><strong>Theorem 874</strong> (<code>there_are_2620_involutions_of_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_there_are_2620_involutions_of_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mi>all</mi><mo>|</mo></mrow><mo>=</mo><mn>2620</mn></mrow></math></div>
<pre class="thm-statement"><code>all.length = 2620</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{all}\right| = 2620</code></pre></details>
</div>
<p class="thm-remark">── THE ENUMERATION IS COMPLETE, stated first so every count below is over a domain of known size ───────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-the_fuel_was_not_the_limit">
<p class="thm-label"><strong>Theorem 875</strong> (<code>the_fuel_was_not_the_limit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_the_fuel_was_not_the_limit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>matchings</mi><mo>(</mo><mn>11</mn><mo>,</mo><mi>nine</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mrow><mo>|</mo><mi>all</mi><mo>|</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(matchings 11 nine).length = all.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{matchings}\mathopen{}\left(11,\,\mathrm{nine}\right)\right| = \left|\mathrm{all}\right|</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-every_involution_fixes_at_least_one_point">
<p class="thm-label"><strong>Theorem 876</strong> (<code>every_involution_fixes_at_least_one_point</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_every_involution_fixes_at_least_one_point.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>all</mi><mo>,</mo><mrow><mrow><mi>fixedPoints</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>≥</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>all.all (fun m =&gt; fixedPoints m ≥ 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \mathrm{all},\; \mathrm{fixedPoints}\mathopen{}\left(m\right) \ge 1</code></pre></details>
</div>
<p class="thm-remark">── WHAT ALWAYS HOLDS: the centre is never absent ─────────────────────────────────────────────────────── Both directions of the same fact. The first is what was asked; the second is why, and it is the sharper statement because it rules out two fixed points as firmly as it rules out none.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-the_fixed_points_are_always_odd">
<p class="thm-label"><strong>Theorem 877</strong> (<code>the_fixed_points_are_always_odd</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_the_fixed_points_are_always_odd.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>all</mi><mo>,</mo><mrow><mrow><mrow><mi>fixedPoints</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>all.all (fun m =&gt; fixedPoints m % 2 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \mathrm{all},\; \mathrm{fixedPoints}\mathopen{}\left(m\right) \bmod 2 = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-no_single_point_is_fixed_by_all">
<p class="thm-label"><strong>Theorem 878</strong> (<code>no_single_point_is_fixed_by_all</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_no_single_point_is_fixed_by_all.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>nine</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>all</mi><mo>,</mo><mrow><mrow><mo>(</mo><mi>d</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>m</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>nine.all (fun d =&gt; ¬ all.all (fun m =&gt; m.contains (d, d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{nine},\; \lnot \forall m \in \mathrm{all},\; \left(d,\,d\right) \in m</code></pre></details>
</div>
<p class="thm-remark">Nothing is fixed by every involution — the centre exists, but it is not the same centre. Stated so the theorem above cannot be misread as naming a universal fixed element.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-the_constant_sum_is_rare">
<p class="thm-label"><strong>Theorem 879</strong> (<code>the_constant_sum_is_rare</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_the_constant_sum_is_rare.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>all</mi><mo>∣</mo><mi>constantSum</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>90</mn></mrow></math></div>
<pre class="thm-statement"><code>(all.filter constantSum).length = 90</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, x \in \mathrm{all} \mid \mathrm{constantSum}\mathopen{}\left(x\right) \,\}\right| = 90</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-so_involutions_are_not_all_harmonic_in_that_sense">
<p class="thm-label"><strong>Theorem 880</strong> (<code>so_involutions_are_not_all_harmonic_in_that_sense</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_so_involutions_are_not_all_harmonic_in_that_sense.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>all</mi><mo>,</mo><mi>constantSum</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ all.all constantSum</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall x \in \mathrm{all},\; \mathrm{constantSum}\mathopen{}\left(x\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-involution-the_coins_reflection_is_harmonic_and_is_one_of_the_ninety">
<p class="thm-label"><strong>Theorem 881</strong> (<code>the_coins_reflection_is_harmonic_and_is_one_of_the_ninety</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_involution_the_coins_reflection_is_harmonic_and_is_one_of_the_ninety.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>constantSum</mi><mo>(</mo><mi>coinLike</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>fixedPoints</mi><mo>(</mo><mi>coinLike</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>swaps</mi><mo>(</mo><mi>coinLike</mi><mo>)</mo></mrow><mo>,</mo><mrow><mrow><msub><mi>p</mi><mn>1</mn></msub><mo>+</mo><msub><mi>p</mi><mn>2</mn></msub></mrow><mo>=</mo><mn>9</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>constantSum coinLike = true ∧ fixedPoints coinLike = 1 ∧ (swaps coinLike).all (fun p =&gt; p.1 + p.2 == 9)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{constantSum}\mathopen{}\left(\mathrm{coinLike}\right) = \mathrm{true} \land \mathrm{fixedPoints}\mathopen{}\left(\mathrm{coinLike}\right) = 1 \land \forall p \in \mathrm{swaps}\mathopen{}\left(\mathrm{coinLike}\right),\; p_{1} + p_{2} = 9</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
