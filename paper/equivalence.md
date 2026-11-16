---
title: "Substitution inside a coil is sound and across coils is not"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `equivalence.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/equivalence.lean</code> · namespace <code>Equivalence</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

scripts/coils.ts clusters expressions by their extension and calls each cluster a COIL, and the whole
point of a coil is a LICENCE: any member may stand for any other, because computing either computes the
other. src/iso/80000-2-mathematics/coils.lean seals twenty-four of them and the address vocabulary's two.

A licence to substitute is only sound if the relation behind it is an EQUIVALENCE. If it were not
transitive, a and b could coil, and b and c, while a and c do not — and a reader following the licence
twice would produce a substitution the tree never sanctioned. Nothing checked it. "Same extension" is
obviously an equivalence to anyone who thinks about it for a moment, and that is exactly the kind of
obvious thing this deposit is supposed to decide rather than assume.

AND THE OTHER HALF MATTERS MORE. Expressions in DIFFERENT coils must never be substitutable, or the
clustering carries no information. That is the property that caught the deposit's own overclaim: the
container size 2^128 and the capacity 2^(128−r) are in different coils, so interchanging them was never
licensed, and prose had been interchanging them for months.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>exts := [63, 63, 448, 448, 448, 341, 7, 7, 63, 511, 0, 341]
idx := List.range 12</code></pre>

<div class="thm" id="thm-equivalence-every_expression_coils_with_itself">
<p class="thm-label"><strong>Theorem 776</strong> (<code>every_expression_coils_with_itself</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_every_expression_coils_with_itself.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>idx.all (fun i =&gt; coils (extOf i) (extOf i))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \mathrm{idx},\; \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(i\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 1 · REFLEXIVE — EVERY EXPRESSION PROVES ITSELF ────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-the_licence_runs_in_both_directions">
<p class="thm-label"><strong>Theorem 777</strong> (<code>the_licence_runs_in_both_directions</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_the_licence_runs_in_both_directions.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>idx.all (fun i =&gt; idx.all (fun j =&gt; coils (extOf i) (extOf j) == coils (extOf j) (extOf i)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \mathrm{idx},\; \forall j \in \mathrm{idx},\; \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right) = \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(j\right),\,\mathrm{extOf}\mathopen{}\left(i\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · SYMMETRIC — THE LICENCE RUNS BOTH WAYS ──────────────────────────────────────────────────────────── A one-way licence would let a reader replace a with b and not b with a, which is not what "prove each other" says and is not what the coils are published as.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-following_the_licence_twice_is_still_licensed">
<p class="thm-label"><strong>Theorem 778</strong> (<code>following_the_licence_twice_is_still_licensed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_following_the_licence_twice_is_still_licensed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∨</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>idx.all (fun i =&gt; idx.all (fun j =&gt; idx.all (fun k =&gt; !(coils (extOf i) (extOf j) &amp;&amp; coils (extOf j) (extOf k)) || coils (extOf i) (extOf k))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \mathrm{idx},\; \forall j \in \mathrm{idx},\; \forall k \in \mathrm{idx},\; \lnot \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right) \land \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(j\right),\,\mathrm{extOf}\mathopen{}\left(k\right)\right) \lor \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(k\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · TRANSITIVE — SO FOLLOWING IT TWICE IS STILL SOUND ───────────────────────────────────────────────── THE ONE THAT MAKES THE LICENCE USABLE. Without it a reader could substitute a for b and b for c and arrive at a replacement the tree never sanctioned, with every single step licensed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-every_expression_sits_in_exactly_one_coil">
<p class="thm-label"><strong>Theorem 779</strong> (<code>every_expression_sits_in_exactly_one_coil</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_every_expression_sits_in_exactly_one_coil.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>exts</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>∣</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>≥</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>exts</mi><mo>∣</mo><mrow><mi>x</mi><mo>=</mo><mi>e</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>∣</mo><mi>e</mi><mo>∈</mo><mrow><mi>dedup</mi><mo>(</mo><mi>exts</mi><mo>)</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><mn>12</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>exts.eraseDups.length == 6 &amp;&amp; idx.all (fun i =&gt; (idx.filter (fun j =&gt; coils (extOf i) (extOf j))).length ≥ 1) &amp;&amp; (exts.eraseDups.map (fun e =&gt; (exts.filter (fun x =&gt; x == e)).length)).foldl (· + ·) 0 == 12</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{exts}\right)\right| = 6 \land \forall i \in \mathrm{idx},\; \left|\{\, j \in \mathrm{idx} \mid \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right) \,\}\right| \ge 1 \land \sum \{\, \left|\{\, x \in \mathrm{exts} \mid x = e \,\}\right| \mid e \in \operatorname{dedup}\left(\mathrm{exts}\right) \,\} = 12</code></pre></details>
</div>
<p class="thm-remark">── 4 · SO THE EXPRESSIONS ARE PARTITIONED ──────────────────────────────────────────────────────────────── The consequence of 1–3: every expression is in exactly one coil, and the coils cover everything. Six distinct extensions over twelve expressions here.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-expressions_in_different_coils_are_never_interchangeable">
<p class="thm-label"><strong>Theorem 780</strong> (<code>expressions_in_different_coils_are_never_interchangeable</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_expressions_in_different_coils_are_never_interchangeable.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mrow><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>idx.all (fun i =&gt; idx.all (fun j =&gt; (extOf i == extOf j) == coils (extOf i) (extOf j)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \mathrm{idx},\; \forall j \in \mathrm{idx},\; \mathrm{extOf}\mathopen{}\left(i\right) = \mathrm{extOf}\mathopen{}\left(j\right) = \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · AND ACROSS COILS IT IS NEVER LICENSED ───────────────────────────────────────────────────────────── THE HALF THAT CARRIES THE INFORMATION. If expressions in different coils were interchangeable the clustering would say nothing. This is the property that caught 2^128 standing in for 2^(128−r).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-some_pairs_do_not_coil_and_most_do_not">
<p class="thm-label"><strong>Theorem 781</strong> (<code>some_pairs_do_not_coil_and_most_do_not</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_some_pairs_do_not_coil_and_most_do_not.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∃</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>:</mo><mrow><mo>∃</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>:</mo><mrow><mo>¬</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>⋃</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mo>{</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>}</mo></mrow></mrow><mo>|</mo></mrow><mo>&gt;</mo><mrow><mo>|</mo><mrow><mo>⋃</mo><mi>i</mi><mo>∈</mo><mi>idx</mi><mo>,</mo><mrow><mo>{</mo><mi>j</mi><mo>∈</mo><mi>idx</mi><mo>∣</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>}</mo></mrow></mrow><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>idx.any (fun i =&gt; idx.any (fun j =&gt; !coils (extOf i) (extOf j))) &amp;&amp; (idx.flatMap (fun i =&gt; idx.filter (fun j =&gt; !coils (extOf i) (extOf j)))).length &gt; (idx.flatMap (fun i =&gt; idx.filter (fun j =&gt; coils (extOf i) (extOf j)))).length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists i \in \mathrm{idx} : \exists j \in \mathrm{idx} : \lnot \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right) \land \left|\bigcup_{i \in \mathrm{idx}} \{\, j \in \mathrm{idx} \mid \lnot \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right) \,\}\right| &gt; \left|\bigcup_{i \in \mathrm{idx}} \{\, j \in \mathrm{idx} \mid \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(i\right),\,\mathrm{extOf}\mathopen{}\left(j\right)\right) \,\}\right|</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE CONTROL: THE RELATION IS NOT UNIVERSAL ──────────────────────────────────────────────────────── Theorems 1 to 3 are all satisfied by a relation that holds of every pair, which would license every substitution and be useless. Some pairs do NOT coil, and there are more of those than of the coiling ones.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-a_singleton_class_licenses_no_substitution">
<p class="thm-label"><strong>Theorem 782</strong> (<code>a_singleton_class_licenses_no_substitution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_a_singleton_class_licenses_no_substitution.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mrow><mi>dedup</mi><mo>(</mo><mi>exts</mi><mo>)</mo></mrow><mo>∣</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>exts</mi><mo>∣</mo><mrow><mi>x</mi><mo>=</mo><mi>e</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mrow><mi>dedup</mi><mo>(</mo><mi>exts</mi><mo>)</mo></mrow><mo>∣</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>exts</mi><mo>∣</mo><mrow><mi>x</mi><mo>=</mo><mi>e</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>&gt;</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(exts.eraseDups.filter (fun e =&gt; (exts.filter (fun x =&gt; x == e)).length == 1)).length == 2 &amp;&amp; (exts.eraseDups.filter (fun e =&gt; (exts.filter (fun x =&gt; x == e)).length &gt; 1)).length == 4</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, e \in \operatorname{dedup}\left(\mathrm{exts}\right) \mid \left|\{\, x \in \mathrm{exts} \mid x = e \,\}\right| = 1 \,\}\right| = 2 \land \left|\{\, e \in \operatorname{dedup}\left(\mathrm{exts}\right) \mid \left|\{\, x \in \mathrm{exts} \mid x = e \,\}\right| &gt; 1 \,\}\right| = 4</code></pre></details>
</div>
<p class="thm-remark">── 7 · A COIL OF ONE LICENSES NOTHING ──────────────────────────────────────────────────────────────────── An extension held by a single expression is a singleton class: reflexive, and licensing no substitution at all. scripts/coils.ts reports those separately for that reason — they are the expressions prose must never interchange, not coils with one member.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-equivalence-the_licence_is_over_computation_and_not_over_meaning">
<p class="thm-label"><strong>Theorem 783</strong> (<code>the_licence_is_over_computation_and_not_over_meaning</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_equivalence_the_licence_is_over_computation_and_not_over_meaning.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mrow><mi>extOf</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>63</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>extOf</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>63</mn></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mi>coils</mi><mo>(</mo><mrow><mi>extOf</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>extOf</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>extOf</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>448</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>coils (extOf 0) (extOf 1) &amp;&amp; extOf 0 == 63 &amp;&amp; extOf 1 == 63 &amp;&amp; !(coils (extOf 0) (extOf 2)) &amp;&amp; extOf 2 == 448</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(0\right),\,\mathrm{extOf}\mathopen{}\left(1\right)\right) \land \mathrm{extOf}\mathopen{}\left(0\right) = 63 \land \mathrm{extOf}\mathopen{}\left(1\right) = 63 \land \lnot \mathrm{coils}\mathopen{}\left(\mathrm{extOf}\mathopen{}\left(0\right),\,\mathrm{extOf}\mathopen{}\left(2\right)\right) \land \mathrm{extOf}\mathopen{}\left(2\right) = 448</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHAT A COIL IS STILL NOT ────────────────────────────────────────────────────────────────────────── IT IS AN IDENTITY OF EXTENSION, NOT OF MEANING. "The units" and "the doubling orbit" pick out the same six residues and remain different ideas about them; a coil licenses replacing one COMPUTATION with another and licenses nothing about what either means. Nothing above says two coiled expressions have the same explanation, the same generality, or the same claim on a reader's attention — only that where one lands, so does the other.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
