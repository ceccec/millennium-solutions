---
title: "Sealed before the vocabulary moved, and still decided"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `retained.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/retained.lean</code> · namespace <code>Imagined</code> · 15 theorems · wing <code>the imagined</code></p>

RETAINED —scripts/imagine.ts sealed these when its map table was hand-written, and its derived
enumeration does not propose them. Nothing about them was refuted: each is copied here exactly as the
generator last wrote it, and the kernel decides every one on every run. The ledger is append-only, so a
sealed key whose source disappears is an orphan the record cannot honestly resolve — keeping the source is
the only answer that neither withdraws a proved fact nor claims a carrier that does not prove it.

<div class="thm" id="thm-retained-squares_is_closed_under_quadruple">
<p class="thm-label"><strong>Theorem 1156</strong> (<code>squares_is_closed_under_quadruple</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_squares_is_closed_under_quadruple.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>4</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1, 4, 7].all (fun d =&gt; [0, 1, 4, 7].contains (m9 (4 * d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [0,\,1,\,4,\,7],\; \mathrm{m9}\mathopen{}\left(4 \cdot d\right) \in [0,\,1,\,4,\,7]</code></pre></details>
</div>
<p class="thm-remark">the squares mod nine is closed under quadrupling</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-cubes_is_closed_under_negate">
<p class="thm-label"><strong>Theorem 1157</strong> (<code>cubes_is_closed_under_negate</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_cubes_is_closed_under_negate.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1, 8].all (fun d =&gt; [0, 1, 8].contains (m9 (9 - d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [0,\,1,\,8],\; \mathrm{m9}\mathopen{}\left(9 - d\right) \in [0,\,1,\,8]</code></pre></details>
</div>
<p class="thm-remark">the cubes mod nine is closed under negation</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-selfinv_is_closed_under_negate">
<p class="thm-label"><strong>Theorem 1158</strong> (<code>selfinv_is_closed_under_negate</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_selfinv_is_closed_under_negate.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[1, 8].all (fun d =&gt; [1, 8].contains (m9 (9 - d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [1,\,8],\; \mathrm{m9}\mathopen{}\left(9 - d\right) \in [1,\,8]</code></pre></details>
</div>
<p class="thm-remark">the self-inverse residues is closed under negation</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-cubes_is_closed_under_cube">
<p class="thm-label"><strong>Theorem 1159</strong> (<code>cubes_is_closed_under_cube</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_cubes_is_closed_under_cube.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1, 8].all (fun d =&gt; [0, 1, 8].contains (m9 (d * d * d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [0,\,1,\,8],\; \mathrm{m9}\mathopen{}\left(d \cdot d \cdot d\right) \in [0,\,1,\,8]</code></pre></details>
</div>
<p class="thm-remark">the cubes mod nine is closed under cubing</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-squares_is_closed_under_septuple">
<p class="thm-label"><strong>Theorem 1160</strong> (<code>squares_is_closed_under_septuple</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_squares_is_closed_under_septuple.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>7</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1, 4, 7].all (fun d =&gt; [0, 1, 4, 7].contains (m9 (7 * d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [0,\,1,\,4,\,7],\; \mathrm{m9}\mathopen{}\left(7 \cdot d\right) \in [0,\,1,\,4,\,7]</code></pre></details>
</div>
<p class="thm-remark">the squares mod nine is closed under multiplication by seven</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-cubes_is_closed_under_octuple">
<p class="thm-label"><strong>Theorem 1161</strong> (<code>cubes_is_closed_under_octuple</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_cubes_is_closed_under_octuple.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>8</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1, 8].all (fun d =&gt; [0, 1, 8].contains (m9 (8 * d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [0,\,1,\,8],\; \mathrm{m9}\mathopen{}\left(8 \cdot d\right) \in [0,\,1,\,8]</code></pre></details>
</div>
<p class="thm-remark">the cubes mod nine is closed under multiplication by eight</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-selfinv_is_closed_under_octuple">
<p class="thm-label"><strong>Theorem 1162</strong> (<code>selfinv_is_closed_under_octuple</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_selfinv_is_closed_under_octuple.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>8</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[1, 8].all (fun d =&gt; [1, 8].contains (m9 (8 * d)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [1,\,8],\; \mathrm{m9}\mathopen{}\left(8 \cdot d\right) \in [1,\,8]</code></pre></details>
</div>
<p class="thm-remark">the self-inverse residues is closed under multiplication by eight</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-cube_is_involutive_on_cubes">
<p class="thm-label"><strong>Theorem 1163</strong> (<code>cube_is_involutive_on_cubes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_cube_is_involutive_on_cubes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>x</mi><mo>↦</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mrow><mi>x</mi><mo>⋅</mo><mi>x</mi></mrow><mo>⋅</mo><mi>x</mi></mrow><mo>)</mo></mrow></mrow><mo>(</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1, 8].all (fun d =&gt; (fun x =&gt; m9 (x * x * x)) (m9 (d * d * d)) == d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in [0,\,1,\,8],\; x \mapsto \mathrm{m9}\mathopen{}\left(x \cdot x \cdot x\right)\mathopen{}\left(\mathrm{m9}\mathopen{}\left(d \cdot d \cdot d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">cubing is its own inverse on the cubes mod nine</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-double_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1164</strong> (<code>double_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_double_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (2 * d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(2 \cdot d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">doubling sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-triple_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1165</strong> (<code>triple_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_triple_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>3</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (3 * d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(3 \cdot d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">tripling sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-negate_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1166</strong> (<code>negate_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_negate_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (9 - d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(9 - d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">negation sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-quintuple_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1167</strong> (<code>quintuple_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_quintuple_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>5</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (5 * d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(5 \cdot d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">multiplication by five sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-sextuple_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1168</strong> (<code>sextuple_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_sextuple_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>6</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (6 * d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(6 \cdot d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">multiplication by six sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-septuple_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1169</strong> (<code>septuple_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_septuple_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>7</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (7 * d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(7 \cdot d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">multiplication by seven sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-retained-octuple_collapses_reflfixed_to_one_value">
<p class="thm-label"><strong>Theorem 1170</strong> (<code>octuple_collapses_reflfixed_to_one_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imagined_octuple_collapses_reflfixed_to_one_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mn>8</mn><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>([5].map (fun d =&gt; m9 (8 * d))).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(8 \cdot d\right) \mid d \in [5] \,\}\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">multiplication by eight sends every element of the residues the reflection fixes to a single value</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
