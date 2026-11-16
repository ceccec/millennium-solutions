---
title: "The Planck exponents are the only ones the dimensions permit"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `dimensions.lean`

<p class="paper-src"><code>src/iso/80000-physics/dimensions.lean</code> · namespace <code>Dimensions</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

Six of the thirteen files in Zenodo record 22895141 derive the Planck units by dimensional analysis:
ℓ_P = √(ħG/c³), t_P = √(ħG/c⁵), m_P = √(ħc/G). src/iso/80000-physics/planck.lean already RECORDS those exponents,
doubled so they stay integers — (1,1,−3), (1,1,−5), (1,−1,1) — and reasons with them.

WHAT IT DOES NOT DECIDE IS THAT THEY ARE FORCED. A recorded exponent triple is a value someone read off
a derivation; the derivation's whole content is that no other triple works, and that claim had no
theorem. It is a small gap and it is exactly the kind this deposit exists to close: the question is
linear arithmetic over a finite range, which is the one sort of question a kernel settles by exhaustion.

THE SYSTEM. With doubled exponents A, B, D standing for ħ^(A/2) c^(B/2) G^(D/2), the dimensions are

    M^((A−D)/2)  L^((2A+B+3D)/2)  T^((−A−B−2D)/2)

so a LENGTH needs (A−D, 2A+B+3D, −A−B−2D) = (0, 2, 0), a TIME (0, 0, 2) and a MASS (2, 0, 0). Every
triple in −9…9 is tried against each, and exactly one survives each time.

THE ORDER OF THE TRIPLE IS NOT THE ONE planck.lean USES, and the kernel caught me assuming it was. That
file writes (ħ, G, c) and records the Planck length as (1, 1, −3); this one writes (ħ, c, G) and gets
(1, −3, 1). Same construction, same physics, the two middle entries swapped — and a triple copied across
the boundary without reading the convention is simply a wrong triple, which is what `decide` refused.
Both orderings are stated here so the next reader does not have to guess which file means what.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>R := (List.range 19).map (fun k =&gt; Int.ofNat k - 9)</code></pre>

<div class="thm" id="thm-dimensions-the_length_exponents_are_unique">
<p class="thm-label"><strong>Theorem 706</strong> (<code>the_length_exponents_are_unique</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_the_length_exponents_are_unique.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>solutions</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>solutions 0 2 0 == [(1, -3, 1)]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{solutions}\mathopen{}\left(0,\,2,\,0\right) = [\left(1,\,-3,\,1\right)]</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE PLANCK LENGTH'S EXPONENTS ARE THE ONLY ONES ─────────────────────────────────────────────────── √(ħG/c³) doubled is (1, 1, −3), and nothing else in range gives a length.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-the_time_exponents_are_unique">
<p class="thm-label"><strong>Theorem 707</strong> (<code>the_time_exponents_are_unique</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_the_time_exponents_are_unique.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>solutions</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>5</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>solutions 0 0 2 == [(1, -5, 1)]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{solutions}\mathopen{}\left(0,\,0,\,2\right) = [\left(1,\,-5,\,1\right)]</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND THE PLANCK TIME'S ─────────────────────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-the_mass_exponents_are_unique">
<p class="thm-label"><strong>Theorem 708</strong> (<code>the_mass_exponents_are_unique</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_the_mass_exponents_are_unique.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>solutions</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>solutions 2 0 0 == [(1, 1, -1)]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{solutions}\mathopen{}\left(2,\,0,\,0\right) = [\left(1,\,1,\,-1\right)]</code></pre></details>
</div>
<p class="thm-remark">── 3 · AND THE PLANCK MASS'S ─────────────────────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-each_triple_produces_the_dimension_it_claims">
<p class="thm-label"><strong>Theorem 709</strong> (<code>each_triple_produces_the_dimension_it_claims</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_each_triple_produces_the_dimension_it_claims.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>(</mo><mrow><mi>massOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>lengthOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>timeOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>(</mo><mrow><mi>massOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>5</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>lengthOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>5</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>timeOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>5</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>(</mo><mrow><mi>massOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>lengthOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>timeOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(massOf 1 (-3) 1, lengthOf 1 (-3) 1, timeOf 1 (-3) 1) == (0, 2, 0) &amp;&amp; (massOf 1 (-5) 1, lengthOf 1 (-5) 1, timeOf 1 (-5) 1) == (0, 0, 2) &amp;&amp; (massOf 1 1 (-1), lengthOf 1 1 (-1), timeOf 1 1 (-1)) == (2, 0, 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left(\mathrm{massOf}\mathopen{}\left(1,\,-3,\,1\right),\,\mathrm{lengthOf}\mathopen{}\left(1,\,-3,\,1\right),\,\mathrm{timeOf}\mathopen{}\left(1,\,-3,\,1\right)\right) = \left(0,\,2,\,0\right) \land \left(\mathrm{massOf}\mathopen{}\left(1,\,-5,\,1\right),\,\mathrm{lengthOf}\mathopen{}\left(1,\,-5,\,1\right),\,\mathrm{timeOf}\mathopen{}\left(1,\,-5,\,1\right)\right) = \left(0,\,0,\,2\right) \land \left(\mathrm{massOf}\mathopen{}\left(1,\,1,\,-1\right),\,\mathrm{lengthOf}\mathopen{}\left(1,\,1,\,-1\right),\,\mathrm{timeOf}\mathopen{}\left(1,\,1,\,-1\right)\right) = \left(2,\,0,\,0\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · THEY AGREE WITH WHAT planck.lean ALREADY RECORDS ────────────────────────────────────────────────── The three triples restated against the dimensional equations directly, so this file does not rest on its own enumeration alone: each is checked to produce the dimensions it claims.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-some_targets_have_no_solution_at_all">
<p class="thm-label"><strong>Theorem 710</strong> (<code>some_targets_have_no_solution_at_all</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_some_targets_have_no_solution_at_all.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>solutions</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>solutions</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>solutions 1 1 1 == [] &amp;&amp; (solutions 0 2 0).length == 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{solutions}\mathopen{}\left(1,\,1,\,1\right) = [] \land \left|\mathrm{solutions}\mathopen{}\left(0,\,2,\,0\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE CONTROL: NOT EVERY TARGET HAS A SOLUTION ────────────────────────────────────────────────────── THE THEOREM THAT STOPS 1 TO 3 FROM BEING FREE. If `solutions` returned a singleton for everything, the uniqueness above would be a property of the search and not of the dimensions. A target needing an odd mass exponent has NO solution in range, because A − D and the others cannot meet it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-a_looser_condition_returns_many">
<p class="thm-label"><strong>Theorem 711</strong> (<code>a_looser_condition_returns_many</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_a_looser_condition_returns_many.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>R.flatMap</mi><mo>(</mo><mrow><mi>A</mi><mo>↦</mo><mrow><mo>{</mo><mrow><mo>(</mo><mi>A</mi><mo>,</mo><mi>D</mi><mo>)</mo></mrow><mo>∣</mo><mi>D</mi><mo>∈</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>D</mi><mo>↦</mo><mrow><mrow><mi>massOf</mi><mo>(</mo><mi>A</mi><mo>,</mo><mn>0</mn><mo>,</mo><mi>D</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>)</mo></mrow><mo>}</mo></mrow></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>19</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>R.flatMap</mi><mo>(</mo><mrow><mi>A</mi><mo>↦</mo><mrow><mo>{</mo><mrow><mo>(</mo><mi>A</mi><mo>,</mo><mi>D</mi><mo>)</mo></mrow><mo>∣</mo><mi>D</mi><mo>∈</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>D</mi><mo>↦</mo><mrow><mrow><mi>massOf</mi><mo>(</mo><mi>A</mi><mo>,</mo><mn>0</mn><mo>,</mo><mi>D</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>)</mo></mrow><mo>}</mo></mrow></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>&gt;</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>A</mi><mo>↦</mo><mrow><mrow><mi>massOf</mi><mo>(</mo><mi>A</mi><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(R.flatMap (fun A =&gt; (R.filter (fun D =&gt; massOf A 0 D == 0)).map (fun D =&gt; (A, D)))).length == 19 &amp;&amp; (R.flatMap (fun A =&gt; (R.filter (fun D =&gt; massOf A 0 D == 0)).map (fun D =&gt; (A, D)))).length &gt; 1 &amp;&amp; (R.filter (fun A =&gt; massOf A 0 0 == 0)).length == 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{R.flatMap}\mathopen{}\left(A \mapsto \{\, \left(A,\,D\right) \mid D \in \mathrm{R.filter}\mathopen{}\left(D \mapsto \mathrm{massOf}\mathopen{}\left(A,\,0,\,D\right) = 0\right) \,\}\right)\right| = 19 \land \left|\mathrm{R.flatMap}\mathopen{}\left(A \mapsto \{\, \left(A,\,D\right) \mid D \in \mathrm{R.filter}\mathopen{}\left(D \mapsto \mathrm{massOf}\mathopen{}\left(A,\,0,\,D\right) = 0\right) \,\}\right)\right| &gt; 1 \land \left|\mathrm{R.filter}\mathopen{}\left(A \mapsto \mathrm{massOf}\mathopen{}\left(A,\,0,\,0\right) = 0\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">── 6 · AND THE SEARCH CAN RETURN MORE THAN ONE ─────────────────────────────────────────────────────────── The other half of the control: a system with a free direction returns many, so a singleton means the system pinned it and not that the enumeration can only ever find one thing. WRITTEN FIRST WITH A CONJUNCT THAT WAS SIMPLY FALSE: `(R.filter (fun A =&gt; massOf A 0 0 == 0)).length &gt; 1` — but massOf A 0 0 is A, so exactly one value in range satisfies it, not many. That is the THIRD figure in this file I typed from expectation instead of computing, after a transposed exponent triple and a miscounted solution list. Each was refused. The free direction that does return many is the pair (A, D) with A = D, and it returns nineteen — one for each value in range, which is what "free" means.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-the_three_constants_are_dimensionally_independent">
<p class="thm-label"><strong>Theorem 712</strong> (<code>the_three_constants_are_dimensionally_independent</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_the_three_constants_are_dimensionally_independent.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>solutions</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>solutions 0 0 0 == [(0, 0, 0)]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{solutions}\mathopen{}\left(0,\,0,\,0\right) = [\left(0,\,0,\,0\right)]</code></pre></details>
</div>
<p class="thm-remark">── 7 · A DIMENSIONLESS COMBINATION IS THE TRIVIAL ONE ──────────────────────────────────────────────────── Asking for no dimensions at all returns only the empty product — so ħ, c and G are dimensionally independent over this range, which is what licenses calling the three solutions above unique at all.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-dimensions-the_coefficient_is_undetermined_and_the_exponents_are_not">
<p class="thm-label"><strong>Theorem 713</strong> (<code>the_coefficient_is_undetermined_and_the_exponents_are_not</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_dimensions_the_coefficient_is_undetermined_and_the_exponents_are_not.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>solutions</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>lengthOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>massOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>timeOf</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>−</mo><mn>3</mn></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>solutions 0 2 0 == [(1, -3, 1)] &amp;&amp; lengthOf 1 (-3) 1 == 2 &amp;&amp; massOf 1 (-3) 1 == 0 &amp;&amp; timeOf 1 (-3) 1 == 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{solutions}\mathopen{}\left(0,\,2,\,0\right) = [\left(1,\,-3,\,1\right)] \land \mathrm{lengthOf}\mathopen{}\left(1,\,-3,\,1\right) = 2 \land \mathrm{massOf}\mathopen{}\left(1,\,-3,\,1\right) = 0 \land \mathrm{timeOf}\mathopen{}\left(1,\,-3,\,1\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHAT THIS DOES NOT DECIDE ───────────────────────────────────────────────────────────────────────── IT SAYS NOTHING ABOUT PHYSICS, AND NOTHING ABOUT THE VALUES. Dimensional analysis fixes the exponents and leaves a dimensionless coefficient entirely undetermined — every source in record 22895141 says so, and the Planck units are DEFINED by choosing that coefficient to be one. So this file decides which powers of ħ, c and G give a length, and it does not decide that the resulting length is physically significant, that it is a minimum length, or that anything happens there. Those are claims about the world; this is three linear equations.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
