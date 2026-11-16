---
title: "A coverage figure is worth what its control does not already explain"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `discount.lean`

<p class="paper-src"><code>src/iso/22739-ledger/discount.lean</code> · namespace <code>Discount</code> · 6 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

Following the posters in Zenodo record 22934883 meant asking how much of their ring of domain labels
this deposit covers. The matcher was crude — does any word of the label appear anywhere in src/proof —
and it answered 15 of 28, which is 54% and is a flattering number about my own tree.

So it was run against a control ring of twenty-eight domains this deposit demonstrably says nothing
has a FALSE-POSITIVE FLOOR of about one in seven, earned on words like "tea", "shoe" and "competitive"
that occur in English prose and therefore in the comments of a Lean file.

54% is not the answer. 54% is the answer plus the floor, and the part of it that is not the floor is
eleven labels, not fifteen. The figure is reported discounted or it is not reported.

THE RULE IS DECIDED HERE, THE NUMBERS ARE NOT. Theorems 1 to 5 quantify over every raw count, floor and
population in range and say nothing about this particular measurement — so the rule cannot be tuned to
flatter the run that prompted it. Only theorem 6 names the measured triple, and it names it as a
citation to a run, not as a law.

No axioms, no Mathlib, no sorry.

<div class="thm" id="thm-discount-the_discount_never_raises_the_figure">
<p class="thm-label"><strong>Theorem 714</strong> (<code>the_discount_never_raises_the_figure</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_discount_the_discount_never_raises_the_figure.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>raw</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>fl</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>discounted</mi><mo>(</mo><mi>raw</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow><mo>≤</mo><mi>raw</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun raw =&gt; (List.range 30).all (fun fl =&gt; discounted raw fl ≤ raw))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{raw} \in \{0,\dots,29\},\; \forall \mathrm{fl} \in \{0,\dots,29\},\; \mathrm{discounted}\mathopen{}\left(\mathrm{raw},\,\mathrm{fl}\right) \le \mathrm{raw}</code></pre></details>
</div>
<p class="thm-remark">── 1 · DISCOUNTING NEVER INFLATES ──────────────────────────────────────────────────────────────────────── The property that makes this safe to apply everywhere: it can only ever lower a claim. A correction that could raise one would be a second way to overstate, wearing the clothes of caution.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-discount-a_figure_at_or_below_its_floor_is_worth_nothing">
<p class="thm-label"><strong>Theorem 715</strong> (<code>a_figure_at_or_below_its_floor_is_worth_nothing</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_discount_a_figure_at_or_below_its_floor_is_worth_nothing.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>raw</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>fl</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>raw</mi><mo>≤</mo><mi>fl</mi></mrow><mo>=</mo><mrow><mrow><mi>discounted</mi><mo>(</mo><mi>raw</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun raw =&gt; (List.range 30).all (fun fl =&gt; (raw ≤ fl) == (discounted raw fl == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{raw} \in \{0,\dots,29\},\; \forall \mathrm{fl} \in \{0,\dots,29\},\; \mathrm{raw} \le \mathrm{fl} = \mathrm{discounted}\mathopen{}\left(\mathrm{raw},\,\mathrm{fl}\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── 2 · A FIGURE AT OR BELOW ITS FLOOR IS WORTH NOTHING ─────────────────────────────────────────────────── Not "worth less" — worth nothing. A matcher that scores 4 on domains it knows nothing about has not established anything by scoring 4 on domains it might.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-discount-a_figure_above_its_floor_is_worth_something">
<p class="thm-label"><strong>Theorem 716</strong> (<code>a_figure_above_its_floor_is_worth_something</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_discount_a_figure_above_its_floor_is_worth_something.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>raw</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>fl</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>raw</mi><mo>&gt;</mo><mi>fl</mi></mrow><mo>=</mo><mrow><mrow><mi>discounted</mi><mo>(</mo><mi>raw</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun raw =&gt; (List.range 30).all (fun fl =&gt; (raw &gt; fl) == (discounted raw fl &gt; 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{raw} \in \{0,\dots,29\},\; \forall \mathrm{fl} \in \{0,\dots,29\},\; \mathrm{raw} &gt; \mathrm{fl} = \mathrm{discounted}\mathopen{}\left(\mathrm{raw},\,\mathrm{fl}\right) &gt; 0</code></pre></details>
</div>
<p class="thm-remark">── 3 · AND A FIGURE ABOVE ITS FLOOR IS WORTH SOMETHING ─────────────────────────────────────────────────── THE CONTROL ON THE CONTROL. Theorems 1 and 2 are both satisfied by a rule that always returns zero, which would be maximally cautious and useless. This requires the opposite answer whenever the raw count clears the floor, so the discount is a measurement and not a refusal.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-discount-the_discount_is_exactly_the_excess_over_the_control">
<p class="thm-label"><strong>Theorem 717</strong> (<code>the_discount_is_exactly_the_excess_over_the_control</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_discount_the_discount_is_exactly_the_excess_over_the_control.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>raw</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>fl</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>discounted</mi><mo>(</mo><mi>raw</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>min</mi><mo>(</mo><mi>raw</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow></mrow><mo>=</mo><mi>raw</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun raw =&gt; (List.range 30).all (fun fl =&gt; discounted raw fl + min raw fl == raw))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{raw} \in \{0,\dots,29\},\; \forall \mathrm{fl} \in \{0,\dots,29\},\; \mathrm{discounted}\mathopen{}\left(\mathrm{raw},\,\mathrm{fl}\right) + \mathrm{min}\mathopen{}\left(\mathrm{raw},\,\mathrm{fl}\right) = \mathrm{raw}</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE DISCOUNT IS EXACTLY THE EXCESS OVER THE CONTROL ─────────────────────────────────────────────── Stated as an identity rather than an inequality, so no slack hides in it: whatever clears the floor is counted in full, and nothing else is counted at all.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-discount-the_matcher_is_blind_below_its_floor_and_not_above">
<p class="thm-label"><strong>Theorem 718</strong> (<code>the_matcher_is_blind_below_its_floor_and_not_above</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_discount_the_matcher_is_blind_below_its_floor_and_not_above.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>fl</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mo>¬</mo><mrow><mrow><mi>a</mi><mo>≤</mo><mi>fl</mi></mrow><mo>∧</mo><mrow><mi>b</mi><mo>≤</mo><mi>fl</mi></mrow></mrow></mrow><mo>∨</mo><mrow><mrow><mi>discounted</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>discounted</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>¬</mo><mrow><mrow><mrow><mi>a</mi><mo>&gt;</mo><mi>fl</mi></mrow><mo>∧</mo><mrow><mi>b</mi><mo>&gt;</mo><mi>fl</mi></mrow></mrow><mo>∧</mo><mrow><mi>a</mi><mo>≠</mo><mi>b</mi></mrow></mrow></mrow><mo>∨</mo><mrow><mrow><mi>discounted</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>discounted</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>fl</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun fl =&gt; (List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (!(a ≤ fl &amp;&amp; b ≤ fl) || discounted a fl == discounted b fl) &amp;&amp; (!(a &gt; fl &amp;&amp; b &gt; fl &amp;&amp; a != b) || discounted a fl != discounted b fl))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{fl} \in \{0,\dots,15\},\; \forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \lnot a \le \mathrm{fl} \land b \le \mathrm{fl} \lor \mathrm{discounted}\mathopen{}\left(a,\,\mathrm{fl}\right) = \mathrm{discounted}\mathopen{}\left(b,\,\mathrm{fl}\right) \land \lnot a &gt; \mathrm{fl} \land b &gt; \mathrm{fl} \land a \neq b \lor \mathrm{discounted}\mathopen{}\left(a,\,\mathrm{fl}\right) \neq \mathrm{discounted}\mathopen{}\left(b,\,\mathrm{fl}\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · A MATCHER IS BLIND BELOW ITS OWN FLOOR ──────────────────────────────────────────────────────────── The consequence that matters for reading any coverage table: every raw count from zero up to the floor discounts to the same nothing, so this matcher cannot tell a tree that covers four of the labels from one that covers none. A gap is not a gap when the instrument invents one that size. WRITTEN ONCE AS `… → discounted a fl == discounted b fl || true`, WHICH IS THE DEFECT THIS TREE IS FOR. That version passed `decide` because `|| true` is true, and it was reached for because the claim it was decorating — that any two counts within the floor of EACH OTHER agree — is simply false: 10 and 9 discount to 8 and 7. The false claim was made unfalsifiable rather than dropped. What is true is the statement below, about counts below the floor rather than near one another, and it needs no decoration. The second conjunct is the control: the blindness is real, not vacuous — there are distinct counts that collapse together, and above the floor distinct counts stay distinct.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-discount-the_measured_ring_clears_its_floor_by_eleven">
<p class="thm-label"><strong>Theorem 719</strong> (<code>the_measured_ring_clears_its_floor_by_eleven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_discount_the_measured_ring_clears_its_floor_by_eleven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>discounted</mi><mo>(</mo><mn>15</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>11</mn></mrow><mo>∧</mo><mrow><mfrac><mrow><mrow><mi>discounted</mi><mo>(</mo><mn>15</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>⋅</mo><mn>100</mn></mrow><mn>28</mn></mfrac><mo>=</mo><mn>39</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mn>15</mn><mo>⋅</mo><mn>100</mn></mrow><mn>28</mn></mfrac><mo>=</mo><mn>53</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>discounted 15 4 == 11 &amp;&amp; discounted 15 4 * 100 / 28 == 39 &amp;&amp; 15 * 100 / 28 == 53</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{discounted}\mathopen{}\left(15,\,4\right) = 11 \land \frac{\mathrm{discounted}\mathopen{}\left(15,\,4\right) \cdot 100}{28} = 39 \land \frac{15 \cdot 100}{28} = 53</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE MEASURED TRIPLE, CITED TO ITS RUN ───────────────────────────────────────────────────────────── Measured 2026-09-25 against src/proof at 46 files: the ring of 28 labels from record 22934883 scored 15, the control ring of 28 domains this deposit is silent on scored 4. So the deposit's demonstrated reach over that ring is 11 labels and not 15 — and 11 of 28 is 39%, which is the figure that may be quoted. 15 of 28 is 53.6%. The run that produced it printed 54% because it rounded; the theorem below truncates and says 53. Both are that same ratio and neither is the figure to quote, which is why the arithmetic is recorded rather than a sentence: the rounding is visible instead of being a discrepancy someone finds. THESE THREE NUMBERS ARE A CITATION, NOT A LAW. They are what one crude matcher returned on one day against one tree; re-run it and they move. Theorems 1 to 5 do not.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
