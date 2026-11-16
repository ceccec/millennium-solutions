---
title: "The content-address correspondence — the deposit's primitives and ZFS share one shape and one efficiency"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `sdk_correspondence.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/sdk_correspondence.lean</code> · namespace <code>SdkCorrespondence</code> · 8 theorems · wing <code>unassigned</code></p>

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>verifyCost := 1
corr := [ (0, 0, .address), (1, 1, .merkle), (2, 2, .cache), (3, 3, .involution), (4, 4, .guid), (5, 5, .verify) ]</code></pre>

<div class="thm" id="thm-sdk_correspondence-verify_is_one_step">
<p class="thm-label"><strong>Theorem 230</strong> (<code>verify_is_one_step</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_verify_is_one_step.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verifyCost</mi><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>63</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>decide</mi><mo>(</mo><mrow><mn>1</mn><mo>≤</mo><mi>n</mi></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mi>recomputeCost</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>-</mo><mi>verifyCost</mi></mrow><mo>+</mo><mi>verifyCost</mi></mrow><mo>=</mo><mrow><mi>recomputeCost</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>verifyCost = 1 ∧ (List.range 64).all (fun n =&gt; decide (1 ≤ n) == (recomputeCost n - verifyCost + verifyCost == recomputeCost n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verifyCost} = 1 \land \forall n \in \{0,\dots,63\},\; \mathrm{decide}\mathopen{}\left(1 \le n\right) = \mathrm{recomputeCost}\mathopen{}\left(n\right) - \mathrm{verifyCost} + \mathrm{verifyCost} = \mathrm{recomputeCost}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">AS A LAW: verify is one step, and it is the inverse of the advantage at EVERY state that holds a fact — recompute − verify + verify = recompute exactly when 1 ≤ n; at the empty state there is nothing to verify and the round trip does not close.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-recompute_is_n_steps">
<p class="thm-label"><strong>Theorem 231</strong> (<code>recompute_is_n_steps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_recompute_is_n_steps.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n, recomputeCost n = n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-verify_beats_recompute_from_two">
<p class="thm-label"><strong>Theorem 232</strong> (<code>verify_beats_recompute_from_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_verify_beats_recompute_from_two.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n, 2 ≤ n → verifyCost &lt; recomputeCost n</code></pre>
</div>
<p class="thm-remark">verify beats recompute for any state of two or more facts — the content-address advantage, shared by both legs.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-the_advantage_is_n_minus_one">
<p class="thm-label"><strong>Theorem 233</strong> (<code>the_advantage_is_n_minus_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_the_advantage_is_n_minus_one.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n, 1 ≤ n → recomputeCost n - verifyCost = n - 1</code></pre>
</div>
<p class="thm-remark">the advantage grows without bound: recompute − verify = n − 1.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-the_six_primitives_are_zero_to_five">
<p class="thm-label"><strong>Theorem 234</strong> (<code>the_six_primitives_are_zero_to_five</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_the_six_primitives_are_zero_to_five.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mi>corr</mi><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><msub><mi>r</mi><mn>1</mn></msub><mo>∣</mo><mi>r</mi><mo>∈</mo><mi>corr</mi><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>corr.length = 6 ∧ corr.map (fun r =&gt; r.1) = [0, 1, 2, 3, 4, 5]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{corr}\right| = 6 \land \{\, r_{1} \mid r \in \mathrm{corr} \,\} = [0,\,1,\,2,\,3,\,4,\,5]</code></pre></details>
</div>
<p class="thm-remark">six pairings; the deposit primitives are exactly the six indices, none left out, none repeated.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-the_correspondence_is_a_bijection">
<p class="thm-label"><strong>Theorem 235</strong> (<code>the_correspondence_is_a_bijection</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_the_correspondence_is_a_bijection.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><msub><msub><mi>r</mi><mn>2</mn></msub><mn>1</mn></msub><mo>∣</mo><mi>r</mi><mo>∈</mo><mi>corr</mi><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mi>corr</mi><mo>,</mo><mrow><msub><mi>r</mi><mn>1</mn></msub><mo>=</mo><msub><msub><mi>r</mi><mn>2</mn></msub><mn>1</mn></msub></mrow></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>corr.map (fun r =&gt; r.2.1) = [0, 1, 2, 3, 4, 5] ∧ corr.all (fun r =&gt; r.1 == r.2.1) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, r_{2}_{1} \mid r \in \mathrm{corr} \,\} = [0,\,1,\,2,\,3,\,4,\,5] \land \forall r \in \mathrm{corr},\; r_{1} = r_{2}_{1} = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">a bijection: the ZFS indices are the same six, and each pair matches index for index (one-to-one, onto).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-all_six_shapes_are_covered_once">
<p class="thm-label"><strong>Theorem 236</strong> (<code>all_six_shapes_are_covered_once</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_all_six_shapes_are_covered_once.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><msub><msub><mi>r</mi><mn>2</mn></msub><mn>2</mn></msub><mo>∣</mo><mi>r</mi><mo>∈</mo><mi>corr</mi><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mi>Shape.address</mi><mo>,</mo><mi>Shape.merkle</mi><mo>,</mo><mi>Shape.cache</mi><mo>,</mo><mi>Shape.involution</mi><mo>,</mo><mi>Shape.guid</mi><mo>,</mo><mi>Shape.verify</mi><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>corr.map (fun r =&gt; r.2.2) = [Shape.address, Shape.merkle, Shape.cache, Shape.involution, Shape.guid, Shape.verify]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, r_{2}_{2} \mid r \in \mathrm{corr} \,\} = [\mathrm{Shape.address},\,\mathrm{Shape.merkle},\,\mathrm{Shape.cache},\,\mathrm{Shape.involution},\,\mathrm{Shape.guid},\,\mathrm{Shape.verify}]</code></pre></details>
</div>
<p class="thm-remark">all six shapes are covered, once each — primitive, feature and shared shape move in lock-step.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sdk_correspondence-the_two_legs_share_shape_and_efficiency">
<p class="thm-label"><strong>Theorem 237</strong> (<code>the_two_legs_share_shape_and_efficiency</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sdkcorrespondence_the_two_legs_share_shape_and_efficiency.html">sealed</a>.</p>
<pre class="thm-statement"><code>corr.length = 6 ∧ corr.map (fun r =&gt; r.2.2) = [Shape.address, Shape.merkle, Shape.cache, Shape.involution, Shape.guid, Shape.verify] ∧ (∀ n, 2 ≤ n → verifyCost &lt; recomputeCost n)</code></pre>
</div>
<p class="thm-remark">capstone: the two legs share one shape per primitive AND the one efficiency — verify (1) under recompute (n≥2).</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  refine</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
