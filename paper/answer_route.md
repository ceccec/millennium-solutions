---
title: "The router's priority, as kernel-checked rules"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `answer_route.lean`

<p class="paper-src"><code>src/iso/9001-governance/answer_route.lean</code> · namespace <code>AnswerRoute</code> · 6 theorems · wing <code>the floor</code></p>

prior-art note: not applicable — the priority of the answer system's router, docs/ANSWER-SYSTEM.md


WHAT THIS DECIDES AND WHAT IT DOES NOT. src/answer/route.ts reads a question's text and sets four features: an integer,
a Lean theorem, a DOI, a Clay problem name. The priority that picks one kind from those features is decided here, over
every combination of the four (2^4 = 16). The reading of the text stays in route.ts and is not a finite domain, so no
theorem here says which question has which feature.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>allBools := [false, true]
allFeatures := allBools.flatMap fun i =&gt; allBools.flatMap fun l =&gt; allBools.flatMap fun p =&gt; allBools.flatMap fun c =&gt;</code></pre>

<div class="thm" id="thm-answer_route-integer_wins">
<p class="thm-label"><strong>Theorem 245</strong> (<code>integer_wins</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answerroute_integer_wins.html">sealed</a>.</p>
<pre class="thm-statement"><code>allFeatures.all (fun f =&gt; !f.integer || route f == Kind.integer) = true</code></pre>
</div>
<p class="thm-remark">── THE PRIORITY, PER RULE ─────────────────────────────────────────────────────────────────────────────── An integer is routed to the arithmetic kind whatever else the question holds.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_route-lean_wins_over_the_rest">
<p class="thm-label"><strong>Theorem 246</strong> (<code>lean_wins_over_the_rest</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answerroute_lean_wins_over_the_rest.html">sealed</a>.</p>
<pre class="thm-statement"><code>allFeatures.all (fun f =&gt; !(!f.integer &amp;&amp; f.lean) || route f == Kind.lean) = true</code></pre>
</div>
<p class="thm-remark">A Lean theorem is routed to Lean whenever it is not an integer.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_route-publication_wins_over_clay_and_text">
<p class="thm-label"><strong>Theorem 247</strong> (<code>publication_wins_over_clay_and_text</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answerroute_publication_wins_over_clay_and_text.html">sealed</a>.</p>
<pre class="thm-statement"><code>allFeatures.all (fun f =&gt; !(!f.integer &amp;&amp; !f.lean &amp;&amp; f.publication) || route f == Kind.publication) = true</code></pre>
</div>
<p class="thm-remark">A DOI is routed to publication when it is neither an integer nor a Lean theorem.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_route-clay_wins_over_text">
<p class="thm-label"><strong>Theorem 248</strong> (<code>clay_wins_over_text</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answerroute_clay_wins_over_text.html">sealed</a>.</p>
<pre class="thm-statement"><code>allFeatures.all (fun f =&gt; !(!f.integer &amp;&amp; !f.lean &amp;&amp; !f.publication &amp;&amp; f.clay) || route f == Kind.clay) = true</code></pre>
</div>
<p class="thm-remark">A Clay problem name is routed to Clay when nothing above it applies.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_route-text_only_when_nothing_else_holds">
<p class="thm-label"><strong>Theorem 249</strong> (<code>text_only_when_nothing_else_holds</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answerroute_text_only_when_nothing_else_holds.html">sealed</a>.</p>
<pre class="thm-statement"><code>allFeatures.all (fun f =&gt; (route f == Kind.text) == (!f.integer &amp;&amp; !f.lean &amp;&amp; !f.publication &amp;&amp; !f.clay)) = true</code></pre>
</div>
<p class="thm-remark">Text is the remainder, and only the remainder.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_route-the_kinds_cover_the_sixteen">
<p class="thm-label"><strong>Theorem 250</strong> (<code>the_kinds_cover_the_sixteen</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answerroute_the_kinds_cover_the_sixteen.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>f</mi><mo>∈</mo><mi>allFeatures</mi><mo>∣</mo><mrow><mrow><mi>route</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>Kind.integer</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>f</mi><mo>∈</mo><mi>allFeatures</mi><mo>∣</mo><mrow><mrow><mi>route</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>Kind.lean</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>f</mi><mo>∈</mo><mi>allFeatures</mi><mo>∣</mo><mrow><mrow><mi>route</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>Kind.publication</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>f</mi><mo>∈</mo><mi>allFeatures</mi><mo>∣</mo><mrow><mrow><mi>route</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>Kind.clay</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>f</mi><mo>∈</mo><mi>allFeatures</mi><mo>∣</mo><mrow><mrow><mi>route</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>Kind.text</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(allFeatures.filter (fun f =&gt; route f == Kind.integer)).length = 8 ∧ (allFeatures.filter (fun f =&gt; route f == Kind.lean)).length = 4 ∧ (allFeatures.filter (fun f =&gt; route f == Kind.publication)).length = 2 ∧ (allFeatures.filter (fun f =&gt; route f == Kind.clay)).length = 1 ∧ (allFeatures.filter (fun f =&gt; route f == Kind.text)).length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, f \in \mathrm{allFeatures} \mid \mathrm{route}\mathopen{}\left(f\right) = \mathrm{Kind.integer} \,\}\right| = 8 \land \left|\{\, f \in \mathrm{allFeatures} \mid \mathrm{route}\mathopen{}\left(f\right) = \mathrm{Kind.lean} \,\}\right| = 4 \land \left|\{\, f \in \mathrm{allFeatures} \mid \mathrm{route}\mathopen{}\left(f\right) = \mathrm{Kind.publication} \,\}\right| = 2 \land \left|\{\, f \in \mathrm{allFeatures} \mid \mathrm{route}\mathopen{}\left(f\right) = \mathrm{Kind.clay} \,\}\right| = 1 \land \left|\{\, f \in \mathrm{allFeatures} \mid \mathrm{route}\mathopen{}\left(f\right) = \mathrm{Kind.text} \,\}\right| = 1</code></pre></details>
</div>
<p class="thm-remark">── THE COUNT: how many of the 16 feature combinations reach each kind ───────────────────────────────── integer 8 · lean 4 · publication 2 · clay 1 · text 1, total 16.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
