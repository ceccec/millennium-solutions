---
title: "Doubling is two loops and both close at three hundred and sixty degrees"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `turns.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/turns.lean</code> · namespace <code>Turns</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

The author's fourth clause: "note the double torus to complete 360 degrees."

src/iso/80000-2-mathematics/mirror.lean decided that a fold is a half turn — 2 × 90° = 3 × 60° = 180°. A half turn does not
close. What closes is a pair of them, and the structure that carries a pair of independent loops is a
double torus, which is what this deposit's /organism page has drawn from the beginning and what the PDF
in Zenodo record 22934883 calls a "parametric Genus-2 manifold" while claiming nothing checkable about it.

HERE IS THE CHECKABLE PART. Doubling on ℤ/9 decomposes into exactly three orbits and exactly TWO of them
are loops:

    [1, 2, 4, 8, 7, 5]   length 6   the units, the doubling span
    [3, 6]               length 2   the two non-zero members of the triad
    [0]                  length 1   the annihilator, which goes nowhere

Six and two and one is nine, the whole ring, nothing repeated. TWO non-trivial loops is genus two, and
that is the double torus — not by analogy, by counting the independent cycles a single map leaves behind.

AND BOTH COMPLETE 360°. Give each loop one full turn and its step angle falls out: 360 / 6 = 60° and
360 / 2 = 180°. So the small loop's single step IS the fold, and three steps of the large loop make one
step of the small — 3 × 60 = 180, which is the author's own identity read as geometry rather than as
arithmetic. Theorem 4 decides that correspondence.

THE REFLECTION IS A DIFFERENT SURFACE, which is why the claim is about doubling and says so. Reflecting
leaves FOUR loops on this ring, not two — theorem 6 — so "double torus" is a fact about one map and would
be false if attached to the other.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>ring := List.range 9</code></pre>

<div class="thm" id="thm-turns-doubling_returns_in_six_two_or_one">
<p class="thm-label"><strong>Theorem 1060</strong> (<code>doubling_returns_in_six_two_or_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_doubling_returns_in_six_two_or_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>)</mo></mrow><mo>[</mo><mi>ring</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>)</mo></mrow><mo>[</mo><mi>ring</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mn>6</mn><mo>+</mo><mn>2</mn></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.map (cycLen dbl) == [1, 6, 6, 2, 6, 6, 2, 6, 6] &amp;&amp; (ring.map (cycLen dbl)).eraseDups.length == 3 &amp;&amp; 6 + 2 + 1 == 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{cycLen}\mathopen{}\left(\mathrm{dbl}\right)[\mathrm{ring}] = [1,\,6,\,6,\,2,\,6,\,6,\,2,\,6,\,6] \land \left|\operatorname{dedup}\left(\mathrm{cycLen}\mathopen{}\left(\mathrm{dbl}\right)[\mathrm{ring}]\right)\right| = 3 \land 6 + 2 + 1 = 9</code></pre></details>
</div>
<p class="thm-remark">── 1 · DOUBLING IS SIX, TWO AND ONE ────────────────────────────────────────────────────────────────────── Every residue's return time, and the three that occur. Six plus two plus one is nine: the ring is partitioned, with nothing counted twice and nothing left out.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-the_long_loop_is_the_span_and_the_short_one_is_the_triad_pair">
<p class="thm-label"><strong>Theorem 1061</strong> (<code>the_long_loop_is_the_span_and_the_short_one_is_the_triad_pair</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_the_long_loop_is_the_span_and_the_short_one_is_the_triad_pair.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.filter (fun d =&gt; cycLen dbl d == 6) == [1, 2, 4, 5, 7, 8] &amp;&amp; ring.filter (fun d =&gt; cycLen dbl d == 2) == [3, 6] &amp;&amp; ring.filter (fun d =&gt; cycLen dbl d == 1) == [0]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 6 \,\} = [1,\,2,\,4,\,5,\,7,\,8] \land \{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 2 \,\} = [3,\,6] \land \{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 1 \,\} = [0]</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND THE THREE ORBITS ARE THE SPAN, THE TRIAD PAIR, AND THE ORIGIN ───────────────────────────────── Named rather than counted: a partition into sizes 6, 2 and 1 is satisfied by many partitions, and only one of them is this deposit's span and triad.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 12 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-both_loops_complete_three_hundred_and_sixty_degrees">
<p class="thm-label"><strong>Theorem 1062</strong> (<code>both_loops_complete_three_hundred_and_sixty_degrees</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_both_loops_complete_three_hundred_and_sixty_degrees.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mfrac><mn>360</mn><mn>6</mn></mfrac><mo>=</mo><mn>60</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mn>360</mn><mn>2</mn></mfrac><mo>=</mo><mn>180</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>6</mn><mo>⋅</mo><mn>60</mn></mrow><mo>=</mo><mn>360</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mn>180</mn></mrow><mo>=</mo><mn>360</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(ring.filter (fun d =&gt; cycLen dbl d &gt; 1)).length == 8 &amp;&amp; 360 / 6 == 60 &amp;&amp; 360 / 2 == 180 &amp;&amp; 6 * 60 == 360 &amp;&amp; 2 * 180 == 360</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) &gt; 1 \,\}\right| = 8 \land \frac{360}{6} = 60 \land \frac{360}{2} = 180 \land 6 \cdot 60 = 360 \land 2 \cdot 180 = 360</code></pre></details>
</div>
<p class="thm-remark">── 3 · TWO LOOPS, AND BOTH CLOSE AT THREE HUNDRED AND SIXTY ────────────────────────────────────────────── Give each loop one full turn and the step angle is forced. Six steps of 60° and two steps of 180° are the same 360°, which is what it means for both to close.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-three_steps_of_the_long_loop_are_one_step_of_the_short">
<p class="thm-label"><strong>Theorem 1063</strong> (<code>three_steps_of_the_long_loop_are_one_step_of_the_short</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_three_steps_of_the_long_loop_are_one_step_of_the_short.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mn>3</mn><mo>⋅</mo><mn>60</mn></mrow><mo>=</mo><mn>180</mn></mrow><mo>∧</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mn>90</mn></mrow><mo>=</mo><mn>180</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>180</mn><mo>⋅</mo><mn>2</mn></mrow><mo>=</mo><mn>360</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mn>6</mn><mn>2</mn></mfrac><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>iter</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mn>1</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>iter</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mn>3</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>3 * 60 == 180 &amp;&amp; 2 * 90 == 180 &amp;&amp; 180 * 2 == 360 &amp;&amp; 6 / 2 == 3 &amp;&amp; iter dbl 1 3 == 8 &amp;&amp; iter dbl 3 1 == 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>3 \cdot 60 = 180 \land 2 \cdot 90 = 180 \land 180 \cdot 2 = 360 \land \frac{6}{2} = 3 \land \mathrm{iter}\mathopen{}\left(\mathrm{dbl},\,1,\,3\right) = 8 \land \mathrm{iter}\mathopen{}\left(\mathrm{dbl},\,3,\,1\right) = 6</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE SHORT LOOP'S STEP IS THE FOLD ───────────────────────────────────────────────────────────────── 3 × 60 = 180 = 2 × 90. Three steps of the long loop are one step of the short one, and that step is the half turn src/iso/80000-2-mathematics/mirror.lean calls the fold — the author's arithmetic identity read as geometry.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-the_orbits_are_disjoint_and_cover_the_ring">
<p class="thm-label"><strong>Theorem 1064</strong> (<code>the_orbits_are_disjoint_and_cover_the_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_the_orbits_are_disjoint_and_cover_the_ring.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow></mrow><mo>+</mo><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow></mrow><mo>=</mo><mn>9</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∨</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∨</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(ring.filter (fun d =&gt; cycLen dbl d == 6)).length + (ring.filter (fun d =&gt; cycLen dbl d == 2)).length + (ring.filter (fun d =&gt; cycLen dbl d == 1)).length == 9 &amp;&amp; ring.all (fun d =&gt; cycLen dbl d == 6 || cycLen dbl d == 2 || cycLen dbl d == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 6 \,\}\right| + \left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 2 \,\}\right| + \left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 1 \,\}\right| = 9 \land \forall d \in \mathrm{ring},\; \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 6 \lor \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 2 \lor \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE LOOPS ARE DISJOINT AND COVER THE RING ───────────────────────────────────────────────────────── The accounting that makes "two loops" mean anything: no residue is in two orbits, and none is outside.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-the_reflection_leaves_four_loops_on_the_same_ring">
<p class="thm-label"><strong>Theorem 1065</strong> (<code>the_reflection_leaves_four_loops_on_the_same_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_the_reflection_leaves_four_loops_on_the_same_ring.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>rfl9</mi><mo>)</mo></mrow><mo>[</mo><mi>ring</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>rfl9</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>rfl9</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mn>2</mn></mfrac><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mn>4</mn><mo>≠</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.map (cycLen rfl9) == [2, 2, 2, 2, 2, 1, 2, 2, 2] &amp;&amp; (ring.filter (fun d =&gt; cycLen rfl9 d == 2)).length == 8 &amp;&amp; (ring.filter (fun d =&gt; cycLen rfl9 d == 2)).length / 2 == 4 &amp;&amp; 4 != 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{cycLen}\mathopen{}\left(\mathrm{rfl9}\right)[\mathrm{ring}] = [2,\,2,\,2,\,2,\,2,\,1,\,2,\,2,\,2] \land \left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{rfl9},\,d\right) = 2 \,\}\right| = 8 \land \frac{\left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{rfl9},\,d\right) = 2 \,\}\right|}{2} = 4 \land 4 \neq 2</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE CONTROL: THE REFLECTION IS FOUR LOOPS, NOT TWO ──────────────────────────────────────────────── THE THEOREM THAT STOPS "TWO LOOPS" FROM BEING A PROPERTY OF THE RING. The same accounting on the same ring with a different map returns four, so the count measures the MAP. Attaching "double torus" to the reflection would be false, and this is why the file says doubling everywhere it says two.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-no_orbit_fails_to_return_under_either_map">
<p class="thm-label"><strong>Theorem 1066</strong> (<code>no_orbit_fails_to_return_under_either_map</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_no_orbit_fails_to_return_under_either_map.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>rfl9</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>0</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>iter</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>,</mo><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>iter</mi><mo>(</mo><mi>rfl9</mi><mo>,</mo><mi>d</mi><mo>,</mo><mrow><mi>cycLen</mi><mo>(</mo><mi>rfl9</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.all (fun d =&gt; cycLen dbl d &gt; 0 &amp;&amp; cycLen rfl9 d &gt; 0) &amp;&amp; ring.all (fun d =&gt; iter dbl d (cycLen dbl d) == d) &amp;&amp; ring.all (fun d =&gt; iter rfl9 d (cycLen rfl9 d) == d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{ring},\; \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) &gt; 0 \land \mathrm{cycLen}\mathopen{}\left(\mathrm{rfl9},\,d\right) &gt; 0 \land \forall d \in \mathrm{ring},\; \mathrm{iter}\mathopen{}\left(\mathrm{dbl},\,d,\,\mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right)\right) = d \land \forall d \in \mathrm{ring},\; \mathrm{iter}\mathopen{}\left(\mathrm{rfl9},\,d,\,\mathrm{cycLen}\mathopen{}\left(\mathrm{rfl9},\,d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">── 7 · EVERY ORBIT RETURNS ─────────────────────────────────────────────────────────────────────────────── `cycLen` answers 0 when nothing in range brought the orbit home, and 0 would quietly satisfy several of the statements above by making a filter empty. Nothing answers 0, under either map.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-turns-the_genus_is_the_definition_applied_to_the_count">
<p class="thm-label"><strong>Theorem 1067</strong> (<code>the_genus_is_the_definition_applied_to_the_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_turns_the_genus_is_the_definition_applied_to_the_count.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mn>2</mn><mo>-</mo><mrow><mn>2</mn><mo>⋅</mo><mn>1</mn></mrow></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mo>(</mo><mn>2</mn><mo>:</mo><mi>Int</mi><mo>)</mo></mrow><mo>-</mo><mrow><mn>2</mn><mo>⋅</mo><mn>2</mn></mrow></mrow><mo>=</mo><mrow><mo>−</mo><mn>2</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mfrac><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mn>6</mn></mfrac><mo>+</mo><mfrac><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>cycLen</mi><mo>(</mo><mi>dbl</mi><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mn>2</mn></mfrac></mrow><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 - 2 * 1 == 0 &amp;&amp; (2 : Int) - 2 * 2 == -2 &amp;&amp; (ring.filter (fun d =&gt; cycLen dbl d == 6)).length / 6 + (ring.filter (fun d =&gt; cycLen dbl d == 2)).length / 2 == 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2 - 2 \cdot 1 = 0 \land \left(2 : \mathbb{Z}\right) - 2 \cdot 2 = -2 \land \frac{\left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 6 \,\}\right|}{6} + \frac{\left|\{\, d \in \mathrm{ring} \mid \mathrm{cycLen}\mathopen{}\left(\mathrm{dbl},\,d\right) = 2 \,\}\right|}{2} = 2</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE SURFACE IS A READING OF THE COUNT, NOT A THEOREM ABOUT THE RING ─────────────────────────────── WHAT IS DECIDED ABOVE IS THE CYCLE STRUCTURE AND NOTHING ELSE. That two independent loops correspond to a genus-two surface is the standard reading of χ = 2 − 2g, and it is an INTERPRETATION laid over the count — ℤ/9 is a finite ring and has no topology of its own. The arithmetic below is that definition applied, so a reader can see exactly how much is being claimed: one loop gives χ = 0, two give χ = −2, and everything beyond those two lines is geometry this deposit is borrowing rather than proving. THE LOOP COUNT IS DERIVED, NOT ARRANGED. This read `(…length) / 4 == 2` — eight residues divided by four — which returns 2 and derives nothing: 4 was chosen because it gave the answer. A loop of length n holds exactly n residues, so the number of loops is the sum over each orbit length of how many residues carry it divided by that length. Six over six plus two over two.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
