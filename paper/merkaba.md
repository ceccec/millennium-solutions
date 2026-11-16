---
title: "The merkaba"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `merkaba.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/merkaba.lean</code> · namespace <code>Merkaba</code> · 8 theorems · wing <code>the ring</code></p>

The merkaba, as THIS deposit constructs it — ported to Lean so it stands on the kernel instead of on a
TypeScript test. Six entries under this name were revoked as dirty; every one of them that states finite
algebra is re-proved here, and the two that do not (a cosine field, a bond angle in degrees) are absent on
purpose — they are real trigonometry, not decidable arithmetic over ℤ/9, and padding them in would be the
exact dishonesty the revocation was for.

The construction: the mod-3 classes partition ℤ/9 into three triples — the AXIS {3,6,0} (the spindle) and
the two TETRAHEDRA {1,4,7} and {2,5,8}. Note 9 ≡ 0 here: `m9` is reduction mod 9, so the axis is written
with 0 where the prose writes 9. That is the same class, named by its residue.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>axis := [3, 6, 0]   -- {3,6,9} — the spindle
tetA := [1, 4, 7]
tetB := [2, 5, 8]</code></pre>

<div class="thm" id="thm-merkaba-the_three_classes_partition_z9">
<p class="thm-label"><strong>Theorem 882</strong> (<code>the_three_classes_partition_z9</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_the_three_classes_partition_z9.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>axis</mi><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>tetA</mi><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>tetB</mi><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mrow><mi>axis</mi><mo>⧺</mo><mi>tetA</mi></mrow><mo>⧺</mo><mi>tetB</mi></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mrow><mi>axis</mi><mo>⧺</mo><mi>tetA</mi></mrow><mo>⧺</mo><mi>tetB</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>axis.length = 3 ∧ tetA.length = 3 ∧ tetB.length = 3 ∧ (axis ++ tetA ++ tetB).eraseDups.length = 9 ∧ ((List.range 9).all (fun d =&gt; (axis ++ tetA ++ tetB).contains d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{axis}\right| = 3 \land \left|\mathrm{tetA}\right| = 3 \land \left|\mathrm{tetB}\right| = 3 \land \left|\operatorname{dedup}\left(\mathrm{axis} \mathbin{+\!\!+} \mathrm{tetA} \mathbin{+\!\!+} \mathrm{tetB}\right)\right| = 9 \land \forall d \in \{0,\dots,8\},\; d \in \mathrm{axis} \mathbin{+\!\!+} \mathrm{tetA} \mathbin{+\!\!+} \mathrm{tetB}</code></pre></details>
</div>
<p class="thm-remark">── 1 · the three classes partition ℤ/9 into 3+3+3 — disjoint, and together the whole ring ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-the_axis_is_closed_under_doubling">
<p class="thm-label"><strong>Theorem 883</strong> (<code>the_axis_is_closed_under_doubling</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_the_axis_is_closed_under_doubling.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>dbl</mi><mo>(</mo><mi>axis</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mi>axis</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(dbl axis).all (fun d =&gt; axis.contains d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{dbl}\mathopen{}\left(\mathrm{axis}\right),\; d \in \mathrm{axis}</code></pre></details>
</div>
<p class="thm-remark">── 2 · the axis is CLOSED under doubling — the spindle turns into itself, which is what makes it an axis ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-doubling_counter_rotates_the_two_tetrahedra">
<p class="thm-label"><strong>Theorem 884</strong> (<code>doubling_counter_rotates_the_two_tetrahedra</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_doubling_counter_rotates_the_two_tetrahedra.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>tetA</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>dbl</mi><mo>(</mo><mi>tetA</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mi>tetB</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>tetB</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>dbl</mi><mo>(</mo><mi>tetB</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mi>tetA</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(dbl tetA).eraseDups.length = 3 ∧ (dbl tetA).all (fun d =&gt; tetB.contains d) ∧ (dbl tetB).eraseDups.length = 3 ∧ (dbl tetB).all (fun d =&gt; tetA.contains d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{dbl}\mathopen{}\left(\mathrm{tetA}\right)\right)\right| = 3 \land \forall d \in \mathrm{dbl}\mathopen{}\left(\mathrm{tetA}\right),\; d \in \mathrm{tetB} \land \left|\operatorname{dedup}\left(\mathrm{dbl}\mathopen{}\left(\mathrm{tetB}\right)\right)\right| = 3 \land \forall d \in \mathrm{dbl}\mathopen{}\left(\mathrm{tetB}\right),\; d \in \mathrm{tetA}</code></pre></details>
</div>
<p class="thm-remark">── 3 · and the two tetrahedra do NOT close: doubling carries each ONTO THE OTHER. That exchange is the counter-rotation the name refers to — stated as two set equalities, in both directions, so it is a swap and not merely an inclusion that might collapse. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-the_counter_rotation_has_period_two">
<p class="thm-label"><strong>Theorem 885</strong> (<code>the_counter_rotation_has_period_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_the_counter_rotation_has_period_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>dbl</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>tetA</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mi>tetA</mi></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>dbl</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>tetB</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mi>tetB</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(dbl (dbl tetA)).all (fun d =&gt; tetA.contains d) ∧ (dbl (dbl tetB)).all (fun d =&gt; tetB.contains d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{dbl}\mathopen{}\left(\mathrm{dbl}\mathopen{}\left(\mathrm{tetA}\right)\right),\; d \in \mathrm{tetA} \land \forall d \in \mathrm{dbl}\mathopen{}\left(\mathrm{dbl}\mathopen{}\left(\mathrm{tetB}\right)\right),\; d \in \mathrm{tetB}</code></pre></details>
</div>
<p class="thm-remark">── 4 · doubling twice returns each tetrahedron to itself — the rotation has period two, so the pair really does turn against each other rather than drift ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-the_tetrahedra_residue_sums_cancel">
<p class="thm-label"><strong>Theorem 886</strong> (<code>the_tetrahedra_residue_sums_cancel</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_the_tetrahedra_residue_sums_cancel.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mo>∑</mo><mi>tetA</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mo>∑</mo><mi>tetB</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mrow><mo>∑</mo><mi>tetA</mi></mrow><mo>+</mo><mrow><mo>∑</mo><mi>tetB</mi></mrow></mrow><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>m9 (tetA.foldl (· + ·) 0) = 3 ∧ m9 (tetB.foldl (· + ·) 0) = 6 ∧ m9 (tetA.foldl (· + ·) 0 + tetB.foldl (· + ·) 0) = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{m9}\mathopen{}\left(\sum \mathrm{tetA}\right) = 3 \land \mathrm{m9}\mathopen{}\left(\sum \mathrm{tetB}\right) = 6 \land \mathrm{m9}\mathopen{}\left(\sum \mathrm{tetA} + \sum \mathrm{tetB}\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── 5 · the two tetrahedra's residue sums cancel: 1+4+7 ≡ 3, 2+5+8 ≡ 6, and 3+6 ≡ 0 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-one_tetrahedron_covers_half_the_units">
<p class="thm-label"><strong>Theorem 887</strong> (<code>one_tetrahedron_covers_half_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_one_tetrahedron_covers_half_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>units</mi><mo>∣</mo><mrow><mi>d</mi><mo>∈</mo><mi>tetA</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>units</mi><mo>∣</mo><mrow><mi>d</mi><mo>∈</mo><mi>tetB</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>units</mi><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(units.filter (fun d =&gt; tetA.contains d)).length = 3 ∧ (units.filter (fun d =&gt; tetB.contains d)).length = 3 ∧ units.length = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, d \in \mathrm{units} \mid d \in \mathrm{tetA} \,\}\right| = 3 \land \left|\{\, d \in \mathrm{units} \mid d \in \mathrm{tetB} \,\}\right| = 3 \land \left|\mathrm{units}\right| = 6</code></pre></details>
</div>
<p class="thm-remark">── 6 · ONE tetrahedron is not enough. It meets exactly three of the six units — half — so a claim resting on a single tetrahedron covers half the group and leaves the other half untouched. The revoked entry said "3 remain uncovered"; here that is both halves, counted. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-the_cube_and_the_tetrahedron_count_out">
<p class="thm-label"><strong>Theorem 888</strong> (<code>the_cube_and_the_tetrahedron_count_out</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_the_cube_and_the_tetrahedron_count_out.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>3</mn></msup><mo>=</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><msup><mn>2</mn><mn>2</mn></msup></mrow><mo>=</mo><mn>12</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mn>4</mn><mo>+</mo><mn>4</mn></mrow><mo>-</mo><mn>6</mn></mrow><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 3 = 8 ∧ 3 * 2 ^ 2 = 12 ∧ 4 + 4 - 6 = 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{3} = 8 \land 3 \cdot 2^{2} = 12 \land 4 + 4 - 6 = 2</code></pre></details>
</div>
<p class="thm-remark">── 7 · the two tetrahedra as the cube Q₃ — 2³ = 8 vertices, 3·2² = 12 edges — and the tetrahedron's own Euler characteristic V − E + F = 2, the self-dual solid on the sphere. Written V + F − E, not V − E + F: ℕ subtraction TRUNCATES, so 4 − 6 evaluates to 0 and the honest formula would have "proved" 4 = 2. The kernel caught exactly that here. Same lesson as the seal-bits theorem earlier — a comparison is only worth what its operands are.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkaba-stacked_triangles_are_tetrahedral">
<p class="thm-label"><strong>Theorem 889</strong> (<code>stacked_triangles_are_tetrahedral</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkaba_stacked_triangles_are_tetrahedral.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>40</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>sumTri</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mfrac><mrow><mrow><mi>n</mi><mo>⋅</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></mrow><mo>⋅</mo><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow></mrow><mn>6</mn></mfrac></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 40).all (fun n =&gt; sumTri n == n * (n + 1) * (n + 2) / 6)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,40\},\; \mathrm{sumTri}\mathopen{}\left(n\right) = \frac{n \cdot n + 1 \cdot n + 2}{6}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

</div>
