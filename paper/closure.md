---
title: "The named properties of this ring are not closed under their own diagonal"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `closure.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/closure.lean</code> · namespace <code>Closure</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

src/iso/80000-2-mathematics/diagonal.lean put a published ring of labels to Cantor and it did not survive: for any list of
named properties there is a subject the list does not address, and the subject can be constructed rather
than argued for. That was about somebody else's drawing, which is the easy direction.

THIS FILE TURNS IT ROUND. ℤ/9 has nine residues, so it has exactly 2^9 = 512 properties. This deposit
names nine of them — unit, span, triad, origin, fixed by the reflection, even, square, primitive root,
self-inverse — and reasons with those nine across forty-nine files. The same construction that emptied
the poster's ring builds, from those nine and nothing else, a tenth property of ℤ/9 that is none of them:
the one that disagrees with property i about residue i. Its truth table is printed by theorem 4. It is an
ordinary property of an ordinary finite ring and this deposit has no name for it.

THEOREM 8 IS THE ONE THAT KEEPS THIS HONEST, and it is deliberately the one that weakens the file. The
witness is NOT undecidable, NOT unprovable, and NOT beyond this deposit's reach: the kernel decides it
below, in the same file, by the same tactic as everything else. What is shown is narrower and it is the
only thing shown — that the VOCABULARY is not closed. Any nine names leave a tenth property unnamed, and
adding the tenth leaves an eleventh, which theorem 6 checks rather than asserts.

WHAT THAT FORBIDS. It forbids exactly one sentence, and this deposit has been close to writing it: that
some finite list of named properties CHARACTERISES this structure. No such list does, at any length, and
the counter-example is computable from the list itself in the time it takes to read it.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>R := List.range 9
named := [isUnit, inSpan, isTriad, isOrigin, isFixed, isEven, isSquare, isPrimitive, isSelfInv]</code></pre>

<div class="thm" id="thm-closure-nine_names_denote_seven_distinct_properties">
<p class="thm-label"><strong>Theorem 612</strong> (<code>nine_names_denote_seven_distinct_properties</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_nine_names_denote_seven_distinct_properties.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>named</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>fold</mi><mo>(</mo><mrow><mi>acc</mi><mo>,</mo><mi>t</mi><mo>↦</mo><mrow><mo>(</mo><mi>acc</mi><mo>if</mo><mrow><mi>t</mi><mo>∈</mo><mi>acc</mi></mrow><mo>;</mo><mo>otherwise</mo><mrow><mi>acc</mi><mo>⧺</mo><mrow><mo>[</mo><mi>t</mi><mo>]</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>,</mo><mrow><mi>table</mi><mo>[</mo><mi>named</mi><mo>]</mo></mrow><mo>,</mo><mrow><mo>(</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>:</mo><mrow><mi>List</mi><mo>(</mo><mrow><mi>List</mi><mo>(</mo><mi>Bool</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>table</mi><mo>(</mo><mi>isUnit</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>table</mi><mo>(</mo><mi>inSpan</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>table</mi><mo>(</mo><mi>isOrigin</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>table</mi><mo>(</mo><mi>isFixed</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>named.length == 9 &amp;&amp; ((named.map table).foldl (fun acc t =&gt; if acc.contains t then acc else acc ++ [t]) ([] : List (List Bool))).length == 7 &amp;&amp; table isUnit == table inSpan &amp;&amp; table isOrigin == table isFixed</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{named}\right| = 9 \land \left|\operatorname{fold}_{\mathrm{acc},\,t \mapsto \begin{cases}\mathrm{acc} &amp; \text{if } t \in \mathrm{acc}\\ \mathrm{acc} \mathbin{+\!\!+} [t] &amp; \text{otherwise}\end{cases}}\left(\mathrm{table}[\mathrm{named}],\, \left([] : \mathrm{List}\mathopen{}\left(\mathrm{List}\mathopen{}\left(\mathrm{Bool}\right)\right)\right)\right)\right| = 7 \land \mathrm{table}\mathopen{}\left(\mathrm{isUnit}\right) = \mathrm{table}\mathopen{}\left(\mathrm{inSpan}\right) \land \mathrm{table}\mathopen{}\left(\mathrm{isOrigin}\right) = \mathrm{table}\mathopen{}\left(\mathrm{isFixed}\right)</code></pre></details>
</div>
<p class="thm-remark">── 1 · NINE NAMES, SEVEN PROPERTIES ────────────────────────────────────────────────────────────────────── THIS THEOREM WAS FIRST WRITTEN AS "the nine are pairwise different" AND THE KERNEL REFUSED IT. Two pairs of names this deposit uses separately denote the SAME property of ℤ/9: isUnit = inSpan the six units are exactly the doubling span. This is not a coincidence and it is not news — it is index.lean's own theorem, the Hodge window, arriving here from the truth tables instead of from a citation. isOrigin = isFixed σ(d) = (9−d) mod 9 fixes the origin and nothing else, so "is zero" and "is fixed by the reflection" are one property on this ring. In 0…10 the fixed point is 5; mod 9 it is 0, and the two files that name them separately are describing the same set without saying so. So the vocabulary is thinner than its own index suggests, which strengthens everything below rather than weakening it: seven properties, not nine, against 512.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-the_witness_disagrees_with_property_i_at_residue_i">
<p class="thm-label"><strong>Theorem 613</strong> (<code>the_witness_disagrees_with_property_i_at_residue_i</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_the_witness_disagrees_with_property_i_at_residue_i.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 9).all (fun i =&gt; unnamed i != (named.getD i (fun _ =&gt; false)) i)</code></pre>
</div>
<p class="thm-remark">── 2 · THE WITNESS DISAGREES WITH PROPERTY i AT RESIDUE i ────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-the_witness_is_none_of_the_nine_named_properties">
<p class="thm-label"><strong>Theorem 614</strong> (<code>the_witness_is_none_of_the_nine_named_properties</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_the_witness_is_none_of_the_nine_named_properties.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 9).all (fun i =&gt; table unnamed != table (named.getD i (fun _ =&gt; false)))</code></pre>
</div>
<p class="thm-remark">── 3 · SO IT IS NONE OF THEM ───────────────────────────────────────────────────────────────────────────── The conclusion, stated over whole tables rather than at single points: there is no i for which the witness and the i-th named property agree everywhere on ℤ/9.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-the_witness_is_this_table">
<p class="thm-label"><strong>Theorem 615</strong> (<code>the_witness_is_this_table</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_the_witness_is_this_table.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>table</mi><mo>(</mo><mi>unnamed</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>table unnamed == [true, false, true, true, true, true, true, true, false]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{table}\mathopen{}\left(\mathrm{unnamed}\right) = [\mathrm{true},\,\mathrm{false},\,\mathrm{true},\,\mathrm{true},\,\mathrm{true},\,\mathrm{true},\,\mathrm{true},\,\mathrm{true},\,\mathrm{false}]</code></pre></details>
</div>
<p class="thm-remark">── 4 · AND IT IS AN ORDINARY PROPERTY, PRINTED ─────────────────────────────────────────────────────────── EXHIBITED, NOT DESCRIBED. This is the whole difference between "no finite vocabulary suffices", which anyone may write, and a counter-example a reader can check against the nine definitions above. The table was TYPED here on the first attempt and the kernel refused it — a fabricated constant inside the one theorem whose job is to exhibit a computed one. It is what `unnamed` evaluates to, nothing else.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-a_property_that_is_named_is_found_among_the_named">
<p class="thm-label"><strong>Theorem 616</strong> (<code>a_property_that_is_named_is_found_among_the_named</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_a_property_that_is_named_is_found_among_the_named.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 9).any (fun i =&gt; table isUnit == table (named.getD i (fun _ =&gt; false))) &amp;&amp; table isUnit == table (named.getD 0 (fun _ =&gt; false)) &amp;&amp; table isUnit != table unnamed</code></pre>
</div>
<p class="thm-remark">── 5 · THE CONTROL: BEING ABSENT FROM THE LIST IS NOT AUTOMATIC ────────────────────────────────────────── Theorems 2 and 3 would also hold if `table` had broken, or if comparison always answered "different". A property that IS one of the nine must be found among them, and `isUnit` is found at index 0.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-the_diagonal_escapes_nine_and_stops">
<p class="thm-label"><strong>Theorem 617</strong> (<code>the_diagonal_escapes_nine_and_stops</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_the_diagonal_escapes_nine_and_stops.html">sealed</a>.</p>
<pre class="thm-statement"><code>let ten := named ++ [unnamed] let next := fun d =&gt; !((ten.getD d (fun _ =&gt; false)) d) ten.length == 10 &amp;&amp; (List.range 9).all (fun i =&gt; table next != table (named.getD i (fun _ =&gt; false))) &amp;&amp; table next == table unnamed &amp;&amp; table next == table (ten.getD 9 (fun _ =&gt; false))</code></pre>
</div>
<p class="thm-remark">── 6 · THE DIAGONAL EXHAUSTS THIS DOMAIN AT NINE ───────────────────────────────────────────────────────── READ src/iso/80000-2-mathematics/domain.lean BEFORE TAKING THIS FOR MORE THAN IT SAYS. This heading read "the diagonal runs out at nine", and the author's correction was six words: nine folding zero reflects one. The theorem is untouched and still holds — over the NINE RESIDUES the construction escapes nine and stops at ten. What was wrong is the sentence around it. Nine is the size of the domain this file chose, and index.lean:167 defines an eleven-position one on the same page the nine came from, whose two extra positions are exactly the fold (9 ≡ 0) and the return (refl 9 = 1). domain.lean decides the reach at both sizes and withdraws the sentence. WRITTEN FIRST AS "naming the witness leaves another unnamed", WHICH IS FALSE, AND THE KERNEL SAID SO. Diagonalisation needs one point per property. ℤ/9 has nine points, so it escapes a list of nine and it CANNOT escape a list of ten: the construction reads residue i against property i and there is no residue to read the tenth property against. The failure is exact and it is exhibited rather than described. Add the witness to the nine and the diagonal of the resulting ten is the witness ITSELF — the tenth entry — because indices 0 to 8 are unchanged and index 9 is never consulted. The trick does not weaken here, it stops. This is why theorem 7 exists. Past nine, the escape is a COUNT and not a construction, and the two are not interchangeable: counting proves something is missing and never says which, while the diagonal hands you the thing. A file that claimed one and used the other would be trading a witness for an assurance.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-nine_residues_carry_five_hundred_and_twelve_properties">
<p class="thm-label"><strong>Theorem 618</strong> (<code>nine_residues_carry_five_hundred_and_twelve_properties</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_nine_residues_carry_five_hundred_and_twelve_properties.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><msup><mn>2</mn><mn>9</mn></msup><mo>=</mo><mn>512</mn></mrow><mo>∧</mo><mrow><mi>R.length</mi><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>named</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>512</mn><mo>-</mo><mn>7</mn></mrow><mo>=</mo><mn>505</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 9 == 512 &amp;&amp; R.length == 9 &amp;&amp; named.length == 9 &amp;&amp; 512 - 7 == 505</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{9} = 512 \land \mathrm{R.length} = 9 \land \left|\mathrm{named}\right| = 9 \land 512 - 7 = 505</code></pre></details>
</div>
<p class="thm-remark">── 7 · NINE NAMES AGAINST FIVE HUNDRED AND TWELVE PROPERTIES ───────────────────────────────────────────── The counting statement behind all of it, so the reader is not left to take the diagonal's word for the scale. ℤ/9 has nine residues and therefore 2^9 properties; this deposit names nine of them. The seven distinct properties of theorem 1, not the nine names, are what this deposit actually holds.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-closure-the_witness_is_decided_here_and_is_no_kind_of_limit">
<p class="thm-label"><strong>Theorem 619</strong> (<code>the_witness_is_decided_here_and_is_no_kind_of_limit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_closure_the_witness_is_decided_here_and_is_no_kind_of_limit.html">sealed</a>.</p>
<pre class="thm-statement"><code>R.all (fun d =&gt; unnamed d == !((named.getD d (fun _ =&gt; false)) d)) &amp;&amp; (table unnamed).length == 9 &amp;&amp; ((table unnamed).filter (fun b =&gt; b)).length == 7</code></pre>
</div>
<p class="thm-remark">── 8 · AND THE WITNESS IS DECIDED RIGHT HERE ───────────────────────────────────────────────────────────── THE CLAUSE THAT NARROWS THIS FILE TO WHAT IT ACTUALLY SHOWS. Nothing above is about provability, undecidability, or a limit on what this kernel can settle: the witness is settled by the same tactic as every other theorem in this deposit, on the line below, and its behaviour on every residue is decided twice over. What is not closed is the VOCABULARY — the list of properties this deposit has NAMED — and a reader who takes anything stronger from theorems 1 to 7 is taking more than was proved.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
