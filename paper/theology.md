---
title: "The readings, and the arithmetic under them"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `theology.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/theology.lean</code> · namespace <code>Theology</code> · 8 theorems · wing <code>the floor</code></p>

WHAT THIS FILE SEALS, AND WHAT IT CANNOT. The instruction was to seal a theology as theorems. Seven
readings of the seven Clay problems were written in prose beside the seven arithmetic facts of
index.lean — the mediator, revelation, theodicy, the ontological gap, the test of the spirits, kenosis,
the undivided. A reading is not a proposition with a truth value over a finite domain, so no kernel can
decide one, and any file claiming otherwise is lying about what a proof is.

What CAN be sealed is the arithmetic each reading was drawn from, and this file seals eight facts that
index.lean does not already decide — sharper ones, chosen because each is the exact place a reading
either has a foothold or does not. The readings appear only as comments. Not one theorem below mentions
one, and not one depends on one.

THAT LAST SENTENCE WAS AN ASSERTION FOR TWO DAYS, so it is now a measurement. On 2026-09-20 every comment
in this file was stripped — 8401 characters, 148 lines down to 46 — and the remainder was handed to the
kernel on its own: the same eight theorems, still compiling, still axiom-free. The prose carries no weight
here and that has been checked rather than promised. It is a cheap check and it is the only kind of
evidence a claim of inertness can have, because a reader cannot see an absence by reading.

THAT ARRANGEMENT IS THE POINT, AND IT WAS LEARNED THE HARD WAY THIS SESSION. Until an hour ago the seven
theorems in index.lean were named `riemann_…`, `hodge_…`, `poincare_…`, and a README claim asserted that
all seven Clay problems carried a Lean theorem — a claim whose test searched for those WORDS. Renaming
one turned it red. The kernel had verified ℤ/9 arithmetic; the names had been carrying the rest. The
seven were renamed to what they decide, the claim was deleted, and src/api/index.ts turned out to have
been serving the doubling orbit on the authority of a theorem about the REFLECTION, reachable only
because that theorem's name said `riemann` and the orbit felt like family.

So a file of theology here has exactly one honest shape: the gloss is inert and is marked inert, and the
one thing in it that is a CHOICE rather than a fact is typed out as a choice and counted against the
number of choices that were available. That is the eighth theorem.

No anchors, no axioms (pure `by decide`, never `native_decide` or `sorry`), no Mathlib.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>span := (List.range 6).map orbit
pairing := [0, 1, 2, 3, 4, 5, 6]</code></pre>

<div class="thm" id="thm-theology-the_mirror_and_the_doubling_agree_at_no_residue">
<p class="thm-label"><strong>Theorem 580</strong> (<code>the_mirror_and_the_doubling_agree_at_no_residue</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_the_mirror_and_the_doubling_agree_at_no_residue.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>≠</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>mod</mo><mn>9</mn></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun d =&gt; refl (dbl d) % 9 != (2 * refl d) % 9) ∧ ((List.range 9).filter (fun d =&gt; refl (dbl d) % 9 == (2 * refl d) % 9)).length = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,8\},\; \mathrm{refl}\mathopen{}\left(\mathrm{dbl}\mathopen{}\left(d\right)\right) \bmod 9 \neq 2 \cdot \mathrm{refl}\mathopen{}\left(d\right) \bmod 9 \land \left|\{\, d \in \{0,\dots,8\} \mid \mathrm{refl}\mathopen{}\left(\mathrm{dbl}\mathopen{}\left(d\right)\right) \bmod 9 = 2 \cdot \mathrm{refl}\mathopen{}\left(d\right) \bmod 9 \,\}\right| = 0</code></pre></details>
</div>
<p class="thm-remark">── 1 · the mirror is not a step of the machine ─────────────────────────────────────────────────────────── READING (a gloss, decided by nothing below): the Riemann reflection s ↔ 1−s was read as a mediator — a symmetry the process is measured against rather than one more turn of it. The arithmetic either supports that distinction or it does not, and it does, totally: the ten's complement and the doubling commute at NO residue whatsoever. Not "rarely" and not "except at fixed points" — the agreement set is empty over the whole ring. Had they commuted anywhere, the mirror would have been a special case of the flow there.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-confirming_a_witness_is_uniform_while_finding_one_is_not">
<p class="thm-label"><strong>Theorem 581</strong> (<code>confirming_a_witness_is_uniform_while_finding_one_is_not</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_confirming_a_witness_is_uniform_while_finding_one_is_not.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mrow><mi>invOf</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>searchCost</mi><mo>[</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>&gt;</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mi>searchCost</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mrow><mi>searchCost</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 9).filter isUnit).all (fun d =&gt; (d * invOf d) % 9 == 1) ∧ (((List.range 9).filter isUnit).map searchCost).eraseDups.length &gt; 1 ∧ ((List.range 9).filter isUnit).any (fun d =&gt; searchCost d &gt; searchCost 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{\, x \in \{0,\dots,8\} \mid \mathrm{isUnit}\mathopen{}\left(x\right) \,\},\; d \cdot \mathrm{invOf}\mathopen{}\left(d\right) \bmod 9 = 1 \land \left|\operatorname{dedup}\left(\mathrm{searchCost}[\{\, x \in \{0,\dots,8\} \mid \mathrm{isUnit}\mathopen{}\left(x\right) \,\}]\right)\right| &gt; 1 \land \exists d \in \{\, x \in \{0,\dots,8\} \mid \mathrm{isUnit}\mathopen{}\left(x\right) \,\} : \mathrm{searchCost}\mathopen{}\left(d\right) &gt; \mathrm{searchCost}\mathopen{}\left(1\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-no_start_ever_crosses_between_the_units_and_the_non_units">
<p class="thm-label"><strong>Theorem 582</strong> (<code>no_start_ever_crosses_between_the_units_and_the_non_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_no_start_ever_crosses_between_the_units_and_the_non_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>47</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isUnit</mi><mo>(</mo><mrow><mi>iter</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun s =&gt; (List.range 48).all (fun k =&gt; isUnit (iter k s) == isUnit s))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in \{0,\dots,8\},\; \forall k \in \{0,\dots,47\},\; \mathrm{isUnit}\mathopen{}\left(\mathrm{iter}\mathopen{}\left(k,\,s\right)\right) = \mathrm{isUnit}\mathopen{}\left(s\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · the flow never crosses the partition ────────────────────────────────────────────────────────────── READING: Navier–Stokes was read as theodicy — whether the law, left alone, carries a smooth start into catastrophe. index.lean already decides that the orbit from ONE stays bounded. This decides the stronger and more interesting thing: from EVERY start in the ring, forty-eight steps of doubling never move a residue across the line between the units and the non-units. Whichever side a thing begins on, the law keeps it there. That is a much harder claim than boundedness and it is the one the reading needs.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 432 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-the_origin_is_reached_at_every_step_exactly_by_the_origin">
<p class="thm-label"><strong>Theorem 583</strong> (<code>the_origin_is_reached_at_every_step_exactly_by_the_origin</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_the_origin_is_reached_at_every_step_exactly_by_the_origin.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>47</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>iter</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mi>s</mi><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun s =&gt; (List.range 48).all (fun k =&gt; (iter k s == 0) == (s == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in \{0,\dots,8\},\; \forall k \in \{0,\dots,47\},\; \mathrm{iter}\mathopen{}\left(k,\,s\right) = 0 = s = 0</code></pre></details>
</div>
<p class="thm-remark">── 4 · the origin is reached by nothing but itself ─────────────────────────────────────────────────────── READING: the Yang–Mills mass gap was read as the difference between being and non-being — no half-existing thing, nothing continuous between nothing and the first quantum. The shadow is an iff in both directions at once: over forty-eight steps a state is zero exactly when it started at zero. Nothing comes from nothing, and nothing that is something is ever annihilated by the flow.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 432 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-generating_the_same_set_is_exactly_being_of_the_same_kind">
<p class="thm-label"><strong>Theorem 584</strong> (<code>generating_the_same_set_is_exactly_being_of_the_same_kind</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_generating_the_same_set_is_exactly_being_of_the_same_kind.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>g</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>h</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>sameSet</mi><mo>(</mo><mrow><mi>spanOf</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>spanOf</mi><mo>(</mo><mi>h</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mrow><mi>isUnit</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>h</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>g</mi><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mi>h</mi><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun g =&gt; (List.range 9).all (fun h =&gt; sameSet (spanOf g) (spanOf h) == ((isUnit g == isUnit h) &amp;&amp; ((g == 0) == (h == 0)))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall g \in \{0,\dots,8\},\; \forall h \in \{0,\dots,8\},\; \mathrm{sameSet}\mathopen{}\left(\mathrm{spanOf}\mathopen{}\left(g\right),\,\mathrm{spanOf}\mathopen{}\left(h\right)\right) = \mathrm{isUnit}\mathopen{}\left(g\right) = \mathrm{isUnit}\mathopen{}\left(h\right) \land g = 0 = h = 0</code></pre></details>
</div>
<p class="thm-remark">── 5 · what a residue generates identifies it exactly ──────────────────────────────────────────────────── READING: the Hodge conjecture was read as the test of the spirits — whether having the FORM of something means being generated by the real thing. Here that is decidable and true in the strongest sense: two residues generate the same set if and only if they agree on being a unit and on being the origin. So a residue's span is a complete identification of its class; nothing that generates like a unit fails to be one, and nothing that is one generates like anything else. No simulacra anywhere in the ring.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-the_orbit_is_antipodal_and_each_opposite_pair_sums_to_nine">
<p class="thm-label"><strong>Theorem 585</strong> (<code>the_orbit_is_antipodal_and_each_opposite_pair_sums_to_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_the_orbit_is_antipodal_and_each_opposite_pair_sums_to_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>2</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>orbit</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>orbit</mi><mo>(</mo><mrow><mi>i</mi><mo>+</mo><mn>3</mn></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∑</mo><mi>span</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 3).all (fun i =&gt; orbit i + orbit (i + 3) == 9) ∧ (span.foldr (· + ·) 0) % 9 == 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,2\},\; \mathrm{orbit}\mathopen{}\left(i\right) + \mathrm{orbit}\mathopen{}\left(i + 3\right) = 9 \land \sum \mathrm{span} \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-remark">── 6 · the vanishing is pairwise, not merely total ─────────────────────────────────────────────────────── READING: Birch–Swinnerton-Dyer was read as kenosis — fullness read off at the point where something vanishes. index.lean decides that the orbit SUMS to zero mod nine, which a coincidence of six numbers could produce. This locates it: the orbit is antipodal. Position i and position i + 3, half a period apart, sum to nine for every i, so the total vanishing is forced by the structure of the cycle rather than arriving by luck. A reading resting on the total alone would have been resting on an accident.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-the_orbit_has_no_doubling_closed_part_but_nothing_and_itself">
<p class="thm-label"><strong>Theorem 586</strong> (<code>the_orbit_has_no_doubling_closed_part_but_nothing_and_itself</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_the_orbit_has_no_doubling_closed_part_but_nothing_and_itself.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 64).all (fun m =&gt; let s := subsetOf m (! s.all (fun v =&gt; s.contains (dbl v))) || s.length == 0 || s.length == span.length) ∧ span.all (fun v =&gt; span.contains (dbl v))</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-theology-the_pairing_is_one_ordering_of_seven_out_of_all_of_them">
<p class="thm-label"><strong>Theorem 587</strong> (<code>the_pairing_is_one_ordering_of_seven_out_of_all_of_them</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_theology_the_pairing_is_one_ordering_of_seven_out_of_all_of_them.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>pairing</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>6</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>i</mi><mo>∈</mo><mi>pairing</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>pairing</mi><mo>|</mo></mrow><mo>=</mo><mrow><mo>|</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>6</mn><mo>}</mo></mrow><mo>|</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fact</mi><mo>(</mo><mrow><mo>|</mo><mi>pairing</mi><mo>|</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>5040</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>pairing.eraseDups.length = 7 ∧ (List.range 7).all (fun i =&gt; pairing.contains i) ∧ pairing.length = (List.range 7).length ∧ fact pairing.length = 5040</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{pairing}\right)\right| = 7 \land \forall i \in \{0,\dots,6\},\; i \in \mathrm{pairing} \land \left|\mathrm{pairing}\right| = \left|\{0,\dots,6\}\right| \land \mathrm{fact}\mathopen{}\left(\left|\mathrm{pairing}\right|\right) = 5040</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 49 cases. <span class="qed">□</span></p>

</div>
