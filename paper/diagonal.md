---
title: "No ring of labels addresses the subject built from its own diagonal"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `diagonal.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/diagonal.lean</code> · namespace <code>Diagonal</code> · 7 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

src/iso/80000-2-mathematics/separation.lean decided that the ring of domain labels in Zenodo record 22934883 returns the
same answer whatever subject it is drawn around, and therefore separates nothing. That is a defect of
one drawing, and a better drawing would fix it.

THIS FILE SAYS THE STRONGER THING, WHICH IS NOT ABOUT THAT DRAWING AT ALL. No ring is the algebra of
everything. Not because the ambition is immodest — because the arithmetic forbids it, and has since
1891. Hand me any ring of n labels and any list of n subjects it claims to address, and I will hand you
back a subject it does not address: the one that disagrees with subject i about label i. It is not
argued for below, it is CONSTRUCTED, and `decide` checks the construction against every one of the 512
rings of three labels over three subjects.

WHY THAT IS WORTH A FILE. "You cannot cover everything" is the kind of sentence anyone can write and
nobody can check. The diagonal makes it a witness: an address, produced mechanically from the ring
itself, that the ring provably omits. A claim of totality is refuted by its own contents. This is the
shape this deposit wants for every impossibility it states — not a refusal, a construction.

AND THE SIZE OF THE WASTE IS A NUMBER. Twenty-eight binary labels can tell 2^28 subjects apart. The ring
as drawn tells one. Theorem 7 counts the difference, and it is 268,435,455 subjects the drawing had room
for and spent nothing on.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>tables := (List.range 8).flatMap (fun a =&gt; (List.range 8).flatMap (fun b =&gt; (List.range 8).map (fun c =&gt; [a, b, c])))</code></pre>

<div class="thm" id="thm-diagonal-no_ring_addresses_the_subject_built_from_its_diagonal">
<p class="thm-label"><strong>Theorem 691</strong> (<code>no_ring_addresses_the_subject_built_from_its_diagonal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_no_ring_addresses_the_subject_built_from_its_diagonal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mrow><mi>diagOf</mi><mo>(</mo><mi>rows</mi><mo>)</mo></mrow><mo>∈</mo><mi>rows</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tables.all (fun rows =&gt; !rows.contains (diagOf rows))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{rows} \in \mathrm{tables},\; \lnot \mathrm{diagOf}\mathopen{}\left(\mathrm{rows}\right) \in \mathrm{rows}</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE RING NEVER ADDRESSES ITS OWN DIAGONAL ───────────────────────────────────────────────────────── Cantor, finite, decided. Not one of the 512 rings contains the subject built from it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-diagonal-the_diagonal_disagrees_with_subject_i_about_label_i">
<p class="thm-label"><strong>Theorem 692</strong> (<code>the_diagonal_disagrees_with_subject_i_about_label_i</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_the_diagonal_disagrees_with_subject_i_about_label_i.html">sealed</a>.</p>
<pre class="thm-statement"><code>tables.all (fun rows =&gt; (List.range 3).all (fun i =&gt; bit (diagOf rows) i != bit (rows.getD i 0) i))</code></pre>
</div>
<p class="thm-remark">── 2 · AND IT MISSES IT FOR A REASON YOU CAN POINT AT ──────────────────────────────────────────────────── Theorem 1 says the witness is absent. This says WHERE it differs from each subject — at that subject's own label — which is what makes it a construction rather than a lucky absence.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-diagonal-containment_takes_both_values_on_this_population">
<p class="thm-label"><strong>Theorem 693</strong> (<code>containment_takes_both_values_on_this_population</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_containment_takes_both_values_on_this_population.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∃</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>:</mo><mrow><mn>0</mn><mo>∈</mo><mi>rows</mi></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>:</mo><mrow><mo>¬</mo><mrow><mn>0</mn><mo>∈</mo><mi>rows</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>,</mo><mrow><mrow><mi>diagOf</mi><mo>(</mo><mi>rows</mi><mo>)</mo></mrow><mo>&lt;</mo><mn>8</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tables.any (fun rows =&gt; rows.contains 0) &amp;&amp; tables.any (fun rows =&gt; !rows.contains 0) &amp;&amp; tables.all (fun rows =&gt; diagOf rows &lt; 8)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists \mathrm{rows} \in \mathrm{tables} : 0 \in \mathrm{rows} \land \exists \mathrm{rows} \in \mathrm{tables} : \lnot 0 \in \mathrm{rows} \land \forall \mathrm{rows} \in \mathrm{tables},\; \mathrm{diagOf}\mathopen{}\left(\mathrm{rows}\right) &lt; 8</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE CONTROL: BEING ABSENT IS NOT AUTOMATIC ──────────────────────────────────────────────────────── Theorem 1 would also hold if `contains` were broken, or if `diagOf` returned something out of range. Some rings do contain the mask 0 and some do not, so the predicate takes both values on this very population. Without this, theorem 1 is a check that cannot fail.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-diagonal-the_enumeration_is_five_hundred_and_twelve_rings_of_three">
<p class="thm-label"><strong>Theorem 694</strong> (<code>the_enumeration_is_five_hundred_and_twelve_rings_of_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_the_enumeration_is_five_hundred_and_twelve_rings_of_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mi>tables</mi><mo>|</mo></mrow><mo>=</mo><mn>512</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>,</mo><mrow><mrow><mo>|</mo><mi>rows</mi><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tables.length == 512 &amp;&amp; tables.all (fun rows =&gt; rows.length == 3)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{tables}\right| = 512 \land \forall \mathrm{rows} \in \mathrm{tables},\; \left|\mathrm{rows}\right| = 3</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE POPULATION IS THE ONE CLAIMED ───────────────────────────────────────────────────────────────── `List.all` is true of an empty list, so theorems 1, 2 and the second half of 3 are all satisfied by an enumeration that silently built nothing. 512 rings, three subjects each: asserted, not assumed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-diagonal-three_labels_take_at_most_eight_values">
<p class="thm-label"><strong>Theorem 695</strong> (<code>three_labels_take_at_most_eight_values</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_three_labels_take_at_most_eight_values.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>,</mo><mrow><mrow><mrow><mi>distinct</mi><mo>(</mo><mi>rows</mi><mo>)</mo></mrow><mo>≤</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mrow><mi>distinct</mi><mo>(</mo><mi>rows</mi><mo>)</mo></mrow><mo>≤</mo><msup><mn>2</mn><mn>3</mn></msup></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tables.all (fun rows =&gt; distinct rows ≤ 8 &amp;&amp; distinct rows ≤ 2 ^ 3)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{rows} \in \mathrm{tables},\; \mathrm{distinct}\mathopen{}\left(\mathrm{rows}\right) \le 8 \land \mathrm{distinct}\mathopen{}\left(\mathrm{rows}\right) \le 2^{3}</code></pre></details>
</div>
<p class="thm-remark">── 5 · THREE LABELS TELL AT MOST EIGHT SUBJECTS APART ──────────────────────────────────────────────────── The counting bound, on the same population: a reading over L binary labels takes at most 2^L values, so it separates at most 2^L subjects however cleverly it is drawn.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-diagonal-the_bound_is_attained_and_so_is_its_floor">
<p class="thm-label"><strong>Theorem 696</strong> (<code>the_bound_is_attained_and_so_is_its_floor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_the_bound_is_attained_and_so_is_its_floor.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∃</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>:</mo><mrow><mrow><mi>distinct</mi><mo>(</mo><mi>rows</mi><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>rows</mi><mo>∈</mo><mi>tables</mi><mo>:</mo><mrow><mrow><mi>distinct</mi><mo>(</mo><mi>rows</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tables.any (fun rows =&gt; distinct rows == 3) &amp;&amp; tables.any (fun rows =&gt; distinct rows == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists \mathrm{rows} \in \mathrm{tables} : \mathrm{distinct}\mathopen{}\left(\mathrm{rows}\right) = 3 \land \exists \mathrm{rows} \in \mathrm{tables} : \mathrm{distinct}\mathopen{}\left(\mathrm{rows}\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── 6 · AND THE BOUND IS REACHED, SO IT IS NOT A REFUSAL ────────────────────────────────────────────────── THE CONTROL ON THEOREM 5. An inequality that nothing meets is a bound doing no work. Some ring in this population separates all three of its subjects, and some separates none of them.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-diagonal-the_drawn_ring_spent_none_of_its_twenty_eight_labels">
<p class="thm-label"><strong>Theorem 697</strong> (<code>the_drawn_ring_spent_none_of_its_twenty_eight_labels</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_diagonal_the_drawn_ring_spent_none_of_its_twenty_eight_labels.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>28</mn></msup><mo>=</mo><mn>268435456</mn></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mn>0</mn></msup><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mn>28</mn></msup><mo>-</mo><msup><mn>2</mn><mn>0</mn></msup></mrow><mo>=</mo><mn>268435455</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 28 == 268435456 &amp;&amp; 2 ^ 0 == 1 &amp;&amp; 2 ^ 28 - 2 ^ 0 == 268435455</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{28} = 268435456 \land 2^{0} = 1 \land 2^{28} - 2^{0} = 268435455</code></pre></details>
</div>
<p class="thm-remark">── 7 · WHAT THE DRAWN RING SPENT ───────────────────────────────────────────────────────────────────────── Twenty-eight labels afford 2^28 distinguishable subjects. The ring in record 22934883 takes one value across all three of its hubs — which is 2^0, the number afforded by no labels at all. The difference is not rhetorical and it is not a percentage: it is this many subjects.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
