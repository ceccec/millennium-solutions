---
title: "The three facts the unchecked files held alone"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `nucleus.lean`

<p class="paper-src"><code>src/iso/80000-physics/nucleus.lean</code> · namespace <code>Nucleus</code> · 8 theorems · wing <code>the floor</code></p>

WHY THIS FILE EXISTS. Fifteen .lean files sat outside src/proof — Vortex.lean and the per-digit
src/&lt;d&gt;/vortex.lean set — and every one of them began `import Mathlib`. scripts/lean.ts reads only
src/proof, so no gate ever compiled them; the repository has no lake-manifest.json and no .lake, so
Mathlib was never fetched and they have never been built here at all. They were published as the "formal
layer" on /proofs, next to theorems the kernel checks on every run, and the page's own note that no
toolchain is checked in is easy to read past when the heading says Proofs.

Nearly all of what they held is decided already, axiom-free and Mathlib-free, in this directory: 3² ≡ 0,
the inverse pairs, the doubling circuit and its order, the ten's complement and its fixed digit, the
(ℤ/7)* orbit, 432 = 2⁴·3³. Those were two derivations of one fact, and the second derivation was the
unchecked one. THREE facts existed nowhere else, so they are brought here before anything is removed —
deleting a file that holds the only copy of something is not a purge, it is a loss.

No Mathlib, no axioms, no sorry. `List.sum` belongs to a library this tree does not take, so the folds
are written out.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>caps := [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
prefixes := (List.range (caps.length + 1)).map (fun i =&gt; total (caps.take i))
marks := [1, 3, 6, 7, 11, 16, 22]        -- the positions, from the filling order above
closures := marks.map (fun i =&gt; total (caps.take i))
numerators := [1, 1, 1, 8, 7, 5, 1, 2, 9]
denominators := [2, 2, 2, 7, 5, 3, 2, 3]</code></pre>

<div class="thm" id="thm-nucleus-every_capacity_is_even">
<p class="thm-label"><strong>Theorem 427</strong> (<code>every_capacity_is_even</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_every_capacity_is_even.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mi>caps</mi><mo>,</mo><mrow><mrow><mi>c</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>caps.all (fun c =&gt; c % 2 == 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \mathrm{caps},\; c \bmod 2 = 0</code></pre></details>
</div>
<p class="thm-remark">Every capacity is even — 2j+1 summed over the two signs of m_j. Derived over the list, not asserted.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-the_seven_marked_prefixes_take_the_published_values">
<p class="thm-label"><strong>Theorem 428</strong> (<code>the_seven_marked_prefixes_take_the_published_values</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_the_seven_marked_prefixes_take_the_published_values.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>closures</mi><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>20</mn><mo>,</mo><mn>28</mn><mo>,</mo><mn>50</mn><mo>,</mo><mn>82</mn><mo>,</mo><mn>126</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>closures = [2, 8, 20, 28, 50, 82, 126]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{closures} = [2,\,8,\,20,\,28,\,50,\,82,\,126]</code></pre></details>
</div>
<p class="thm-remark">The seven marked prefixes take the seven published values. The PAIRING of position to value is the physics and is credited above; that these sums are those numbers is what the kernel decides.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-each_of_the_seven_is_reached_exactly_once_among_all_prefixes">
<p class="thm-label"><strong>Theorem 429</strong> (<code>each_of_the_seven_is_reached_exactly_once_among_all_prefixes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_each_of_the_seven_is_reached_exactly_once_among_all_prefixes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>closures</mi><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>p</mi><mo>∈</mo><mi>prefixes</mi><mo>∣</mo><mrow><mi>p</mi><mo>=</mo><mi>m</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>closures.all (fun m =&gt; (prefixes.filter (fun p =&gt; p == m)).length == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \mathrm{closures},\; \left|\{\, p \in \mathrm{prefixes} \mid p = m \,\}\right| = 1</code></pre></details>
</div>
<p class="thm-remark">Each of the seven is reached ONCE across every prefix, so the marks are not one choice among many that would have produced the same list — a weaker file could have hidden an arbitrary pick behind a true sum.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-the_capacities_sum_to_the_last_of_the_seven">
<p class="thm-label"><strong>Theorem 430</strong> (<code>the_capacities_sum_to_the_last_of_the_seven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_the_capacities_sum_to_the_last_of_the_seven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>total</mi><mo>(</mo><mi>caps</mi><mo>)</mo></mrow><mo>=</mo><mn>126</mn></mrow><mo>∧</mo><mrow><mrow><mi>total</mi><mo>(</mo><mi>caps</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>fold</mi><mo>(</mo><mrow><mi>a</mi><mo>,</mo><mi>b</mi><mo>↦</mo><mrow><mi>max</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>,</mo><mi>closures</mi><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>total caps = 126 ∧ total caps = closures.foldr (fun a b =&gt; max a b) 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{total}\mathopen{}\left(\mathrm{caps}\right) = 126 \land \mathrm{total}\mathopen{}\left(\mathrm{caps}\right) = \operatorname{fold}_{a,\,b \mapsto \mathrm{max}\mathopen{}\left(a,\,b\right)}\left(\mathrm{closures},\, 0\right)</code></pre></details>
</div>
<p class="thm-remark">The list closes on the last of them: the capacities sum to exactly the largest.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-the_seven_increase_strictly">
<p class="thm-label"><strong>Theorem 431</strong> (<code>the_seven_increase_strictly</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_the_seven_increase_strictly.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range (closures.length - 1)).all (fun i =&gt; closures.getD i 0 &lt; closures.getD (i + 1) 0)</code></pre>
</div>
<p class="thm-remark">And they increase strictly, which is what lets them be read as successive closures at all.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-the_seal_multiplies_back_to_one">
<p class="thm-label"><strong>Theorem 432</strong> (<code>the_seal_multiplies_back_to_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_the_seal_multiplies_back_to_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>product</mi><mo>(</mo><mi>numerators</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>product</mi><mo>(</mo><mi>denominators</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>product numerators = product denominators</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{product}\mathopen{}\left(\mathrm{numerators}\right) = \mathrm{product}\mathopen{}\left(\mathrm{denominators}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-the_fit_is_an_exact_integer_identity">
<p class="thm-label"><strong>Theorem 433</strong> (<code>the_fit_is_an_exact_integer_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_the_fit_is_an_exact_integer_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>108</mn><mo>⋅</mo><mn>17</mn></mrow><mo>=</mo><mn>1836</mn></mrow></math></div>
<pre class="thm-statement"><code>108 * 17 = 1836</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>108 \cdot 17 = 1836</code></pre></details>
</div>
<p class="thm-remark">── 3 · the mass-ratio fit, and the refusal that came with it ───────────────────────────────────────────── 108 · 17 = 1836 is exact. The measured proton-to-electron mass ratio is not 1836; it is 1836.1527…, so the fit MISSES, and src/8/nucleus/proton-mass.lean said so in its own header — the one unchecked file that carried its refusal with it. Comparing without a rational type: scale both by ten thousand.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nucleus-the_fit_is_not_the_measured_ratio">
<p class="thm-label"><strong>Theorem 434</strong> (<code>the_fit_is_not_the_measured_ratio</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nucleus_the_fit_is_not_the_measured_ratio.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>1836</mn><mo>⋅</mo><mn>10000</mn></mrow><mo>≠</mo><mn>18361527</mn></mrow></math></div>
<pre class="thm-statement"><code>1836 * 10000 ≠ 18361527</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1836 \cdot 10000 \neq 18361527</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
