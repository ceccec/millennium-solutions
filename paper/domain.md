---
title: "The reach of the diagonal is the domain you read against, and nine folds past nine"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `domain.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/domain.lean</code> · namespace <code>Domain</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

src/iso/80000-2-mathematics/closure.lean proved that the diagonal over ℤ/9 escapes a list of nine named properties and
stops dead at ten, and wrote that up as "the diagonal runs out at nine". The author's correction, in six

It is not a metaphor and it is not an objection to the theorem, which stands. It names the assumption
underneath it. "Nine" was a property of the DOMAIN THAT FILE CHOSE — `List.range 9`, the residues — and
this deposit defines a larger one on the very page the nine came from. src/iso/9001-governance/index.lean:167 reads

    sequence = [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]

Eleven positions. The span, then the triad, then NINE, then ZERO, then back to ONE. The two positions it
has beyond the nine residues are precisely the fold (9 ≡ 0 mod 9) and the reflection (refl 9 = 10 − 9 =
1) that closes the loop, which is the correction, stated as arithmetic: theorem 2 below.

So the diagonal's reach is eleven here, not nine. Same construction, same ring, same deposit — a
different domain, because the structure supplies one and the earlier file did not use it. THE LIMIT WAS
NEVER A PROPERTY OF THE STRUCTURE. It is the length of whatever you read against, which theorem 6 states
at both sizes so the pattern cannot be mistaken for a fact about ℤ/9.

THEOREM 8 IS A WITHDRAWAL. The sentence "the diagonal runs out at nine" is decided false as a statement
about this deposit, and it is decided false in the same tactic that proved the theorem it was written to
summarise. The theorem in closure.lean was right; the sentence around it was not, and a sentence that
overstates a correct theorem is the failure this tree keeps finding in itself.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>sequence := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
residues := List.range 9</code></pre>

<div class="thm" id="thm-domain-the_sequence_is_eleven_positions_that_return_to_one">
<p class="thm-label"><strong>Theorem 720</strong> (<code>the_sequence_is_eleven_positions_that_return_to_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_sequence_is_eleven_positions_that_return_to_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>sequence</mi><mo>|</mo></mrow><mo>=</mo><mn>11</mn></mrow><mo>∧</mo><mrow><mrow><mi>head</mi><mo>(</mo><mi>sequence</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>last</mi><mo>(</mo><mi>sequence</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>sequence</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>d</mi><mo>mod</mo><mn>9</mn></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mi>sequence</mi><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>sequence.length == 11 &amp;&amp; sequence.head? == sequence.getLast? &amp;&amp; sequence.eraseDups.length == 10 &amp;&amp; (sequence.map (fun d =&gt; d % 9)).eraseDups.length == 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{sequence}\right| = 11 \land \operatorname{head}\left(\mathrm{sequence}\right) = \operatorname{last}\left(\mathrm{sequence}\right) \land \left|\operatorname{dedup}\left(\mathrm{sequence}\right)\right| = 10 \land \left|\operatorname{dedup}\left(\{\, d \bmod 9 \mid d \in \mathrm{sequence} \,\}\right)\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE SEQUENCE IS ELEVEN LONG AND CLOSES ──────────────────────────────────────────────────────────── Eleven positions carrying ten distinct values and nine distinct residues, beginning and ending at one.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-nine_folds_to_zero_and_reflects_to_one">
<p class="thm-label"><strong>Theorem 721</strong> (<code>nine_folds_to_zero_and_reflects_to_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_nine_folds_to_zero_and_reflects_to_one.html">sealed</a>.</p>
<pre class="thm-statement"><code>9 % 9 == 0 &amp;&amp; refl 9 == 1 &amp;&amp; sequence.getD 8 0 == 9 &amp;&amp; sequence.getD 9 0 == 0 &amp;&amp; sequence.getD 10 0 == 1</code></pre>
</div>
<p class="thm-remark">── 2 · NINE FOLDING ZERO REFLECTS ONE ──────────────────────────────────────────────────────────────────── The correction itself, as arithmetic. Nine folds to zero under the ring and reflects to one under the tens-complement, and those are the two positions the sequence holds past the residues.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-the_sequence_exceeds_the_residues_by_the_fold_and_the_return">
<p class="thm-label"><strong>Theorem 722</strong> (<code>the_sequence_exceeds_the_residues_by_the_fold_and_the_return</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_sequence_exceeds_the_residues_by_the_fold_and_the_return.html">sealed</a>.</p>
<pre class="thm-statement"><code>sequence.length - residues.length == 2 &amp;&amp; residues.length == 9 &amp;&amp; sequence.drop 9 == [0, 1] &amp;&amp; (sequence.drop 9).map refl == [10, 9]</code></pre>
</div>
<p class="thm-remark">── 3 · THE TWO EXTRA POSITIONS ARE EXACTLY THE FOLD AND THE RETURN ─────────────────────────────────────── Eleven minus nine is two, and the two are named rather than counted: the fold to zero and the return to one. Without this, theorem 6's jump from nine to eleven is a coincidence of list lengths.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-the_diagonal_escapes_nine_over_nine_and_eleven_over_eleven">
<p class="thm-label"><strong>Theorem 723</strong> (<code>the_diagonal_escapes_nine_over_nine_and_eleven_over_eleven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_diagonal_escapes_nine_over_nine_and_eleven_over_eleven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>escapes</mi><mo>(</mo><mn>9</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mi>escapes</mi><mo>(</mo><mn>11</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>11</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>escapes 9 (identityRows 9) &amp;&amp; escapes 11 (identityRows 11)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{escapes}\mathopen{}\left(9,\,\mathrm{identityRows}\mathopen{}\left(9\right)\right) \land \mathrm{escapes}\mathopen{}\left(11,\,\mathrm{identityRows}\mathopen{}\left(11\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE DIAGONAL ESCAPES A LIST AS LONG AS ITS DOMAIN ───────────────────────────────────────────────── Nine properties over nine positions: escaped. Eleven over eleven: escaped. Same construction, and the second is out of reach of a domain of nine.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-the_diagonal_fails_on_a_list_one_longer_than_its_domain">
<p class="thm-label"><strong>Theorem 724</strong> (<code>the_diagonal_fails_on_a_list_one_longer_than_its_domain</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_diagonal_fails_on_a_list_one_longer_than_its_domain.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>¬</mo><mrow><mi>escapes</mi><mo>(</mo><mn>9</mn><mo>,</mo><mrow><mrow><mi>identityRows</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>⧺</mo><mrow><mo>[</mo><mrow><mi>diagOver</mi><mo>(</mo><mn>9</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mi>escapes</mi><mo>(</mo><mn>11</mn><mo>,</mo><mrow><mrow><mi>identityRows</mi><mo>(</mo><mn>11</mn><mo>)</mo></mrow><mo>⧺</mo><mrow><mo>[</mo><mrow><mi>diagOver</mi><mo>(</mo><mn>11</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>11</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>!escapes 9 (identityRows 9 ++ [diagOver 9 (identityRows 9)]) &amp;&amp; !escapes 11 (identityRows 11 ++ [diagOver 11 (identityRows 11)])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \mathrm{escapes}\mathopen{}\left(9,\,\mathrm{identityRows}\mathopen{}\left(9\right) \mathbin{+\!\!+} [\mathrm{diagOver}\mathopen{}\left(9,\,\mathrm{identityRows}\mathopen{}\left(9\right)\right)]\right) \land \lnot \mathrm{escapes}\mathopen{}\left(11,\,\mathrm{identityRows}\mathopen{}\left(11\right) \mathbin{+\!\!+} [\mathrm{diagOver}\mathopen{}\left(11,\,\mathrm{identityRows}\mathopen{}\left(11\right)\right)]\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · AND FAILS ON A LIST ONE LONGER THAN ITS DOMAIN ──────────────────────────────────────────────────── THE CONTROL, AND THE SHAPE OF THE LIMIT. The tenth property over nine positions is never consulted, so the diagonal cannot be shown to differ from it. Both sizes, so the failure is the rule and not an accident of nine.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-the_reach_of_the_diagonal_is_the_length_of_its_domain">
<p class="thm-label"><strong>Theorem 725</strong> (<code>the_reach_of_the_diagonal_is_the_length_of_its_domain</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_reach_of_the_diagonal_is_the_length_of_its_domain.html">sealed</a>.</p>
<pre class="thm-statement"><code>((List.range 12).drop 1).all (fun n =&gt; escapes n (identityRows n) &amp;&amp; !escapes n (identityRows n ++ [diagOver n (identityRows n)]))</code></pre>
</div>
<p class="thm-remark">── 6 · SO THE BOUND IS THE DOMAIN, NOT THE STRUCTURE ───────────────────────────────────────────────────── Stated across every width in range rather than at the two sizes this deposit happens to use, so it cannot be read as a fact about ℤ/9. At EVERY width the diagonal escapes a list of that width and fails on one longer — both halves, because the first alone is satisfied by a construction that escapes everything and the second alone by one that escapes nothing. WRITTEN FIRST AS `escapes n (identityRows n) == (n != 0)`, WHICH THE KERNEL REFUSED AT n = 0. An empty list of properties is escaped vacuously — `List.all` again — and I had asserted the opposite in order to make the statement look like it said something about zero. It said something false about zero and nothing at all about the bound. The form below carries the bound and needs no special case.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 12 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-the_eleven_positions_are_a_walk_of_nine_residues_that_returns">
<p class="thm-label"><strong>Theorem 726</strong> (<code>the_eleven_positions_are_a_walk_of_nine_residues_that_returns</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_eleven_positions_are_a_walk_of_nine_residues_that_returns.html">sealed</a>.</p>
<pre class="thm-statement"><code>(sequence.map (fun d =&gt; d % 9)).eraseDups.length == 9 &amp;&amp; (sequence.map (fun d =&gt; d % 9)).getD 8 99 == (sequence.map (fun d =&gt; d % 9)).getD 9 88 &amp;&amp; (sequence.map (fun d =&gt; d % 9)).getD 0 77 == (sequence.map (fun d =&gt; d % 9)).getD 10 66</code></pre>
</div>
<p class="thm-remark">── 7 · THE FOLD IS WHAT MAKES THE LARGER DOMAIN LEGITIMATE ─────────────────────────────────────────────── Eleven positions over a nine-element ring is only sound because two positions repeat residues: 9 ≡ 0 and the final 1 ≡ the first. The sequence is a walk that returns, not eleven distinct things, and saying so is what stops "eleven" from being an inflation of "nine".</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-domain-the_diagonal_does_not_run_out_at_nine">
<p class="thm-label"><strong>Theorem 727</strong> (<code>the_diagonal_does_not_run_out_at_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_domain_the_diagonal_does_not_run_out_at_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>escapes</mi><mo>(</mo><mn>9</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mi>escapes</mi><mo>(</mo><mn>9</mn><mo>,</mo><mrow><mrow><mi>identityRows</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>⧺</mo><mrow><mo>[</mo><mrow><mi>diagOver</mi><mo>(</mo><mn>9</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mi>escapes</mi><mo>(</mo><mn>11</mn><mo>,</mo><mrow><mi>identityRows</mi><mo>(</mo><mn>11</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mn>11</mn><mo>&gt;</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>escapes 9 (identityRows 9) &amp;&amp; !escapes 9 (identityRows 9 ++ [diagOver 9 (identityRows 9)]) &amp;&amp; escapes 11 (identityRows 11) &amp;&amp; 11 &gt; 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{escapes}\mathopen{}\left(9,\,\mathrm{identityRows}\mathopen{}\left(9\right)\right) \land \lnot \mathrm{escapes}\mathopen{}\left(9,\,\mathrm{identityRows}\mathopen{}\left(9\right) \mathbin{+\!\!+} [\mathrm{diagOver}\mathopen{}\left(9,\,\mathrm{identityRows}\mathopen{}\left(9\right)\right)]\right) \land \mathrm{escapes}\mathopen{}\left(11,\,\mathrm{identityRows}\mathopen{}\left(11\right)\right) \land 11 &gt; 9</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE SENTENCE THAT IS WITHDRAWN ──────────────────────────────────────────────────────────────────── closure.lean's theorem is untouched and still holds: over the nine residues, the diagonal escapes nine and stops at ten. What is withdrawn is the sentence written around it — "the diagonal runs out at nine" — which said of this deposit what was only true of one chosen domain. Decided here, so the withdrawal is a theorem and not a note: nine is not the reach, because eleven is reached.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
