---
title: "The prior-art verdict is total, exclusive, and never improved by silence"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `verdict.lean`

<p class="paper-src"><code>src/iso/690-record/verdict.lean</code> · namespace <code>Verdict</code> · 8 theorems · wing <code>the record</code></p>

WHY THIS FILE EXISTS.

src/iso/690-record/priorart.lean's kind 2 — the only class allowed to claim novelty — rests on a record whose rows
each carry a VERDICT: CANDIDATES, NONE_FOUND, NONE_FOUND_PARTIAL, NOT_MEASURED, TOO_FEW_TERMS. Those
verdicts are what a reader of this deposit is asked to believe about prior art, and the rule producing
them was four lines of TypeScript in src/novelty/index.ts that nothing verified.

The rule is arithmetic over two counts — how many hits cleared the relevance floor, and how many sources
failed to answer — so it is the one kind of question this deposit settles by exhaustion. Decided here
over every combination in range, and the properties that matter are not "it returns a string":

  TOTAL       every input gets a verdict; there is no state the rule falls through
  EXCLUSIVE   never two verdicts for one input, so a row cannot be read two ways
  MONOTONE    a source going silent NEVER improves the verdict — the property that stops an outage from
              being recorded as a clean search, which is the failure mode that would matter
  GROUNDED    NONE_FOUND requires every source to have answered; anything less is NONE_FOUND_PARTIAL

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>sources := 5
R := List.range 8</code></pre>

<div class="thm" id="thm-verdict-every_input_receives_one_of_the_five_verdicts">
<p class="thm-label"><strong>Theorem 1489</strong> (<code>every_input_receives_one_of_the_five_verdicts</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_every_input_receives_one_of_the_five_verdicts.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>k</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>≤</mo><mn>4</mn></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun k =&gt; R.all (fun r =&gt; R.all (fun s =&gt; verdict k r s ≤ 4)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(k \mapsto \mathrm{R.all}\mathopen{}\left(r \mapsto \mathrm{R.all}\mathopen{}\left(s \mapsto \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) \le 4\right)\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 1 · TOTAL — EVERY INPUT GETS A VERDICT ──────────────────────────────────────────────────────────────── No combination falls through to something outside the five, which is what a classification must mean.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-the_five_classes_do_not_overlap">
<p class="thm-label"><strong>Theorem 1490</strong> (<code>the_five_classes_do_not_overlap</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_the_five_classes_do_not_overlap.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>k</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mi>k</mi><mo>&lt;</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>=</mo><mrow><mrow><mi>k</mi><mo>≥</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mi>r</mi><mo>&gt;</mo><mn>0</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>=</mo><mrow><mrow><mrow><mi>k</mi><mo>≥</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mi>r</mi><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>s</mi><mo>≥</mo><mi>sources</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mi>k</mi><mo>≥</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mi>r</mi><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>s</mi><mo>&gt;</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>s</mi><mo>&lt;</mo><mi>sources</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>=</mo><mrow><mrow><mrow><mi>k</mi><mo>≥</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mi>r</mi><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>s</mi><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun k =&gt; R.all (fun r =&gt; R.all (fun s =&gt; (verdict k r s == 0) == (k &lt; 2) &amp;&amp; (verdict k r s == 1) == (k ≥ 2 &amp;&amp; r &gt; 0) &amp;&amp; (verdict k r s == 4) == (k ≥ 2 &amp;&amp; r == 0 &amp;&amp; s ≥ sources) &amp;&amp; (verdict k r s == 3) == (k ≥ 2 &amp;&amp; r == 0 &amp;&amp; s &gt; 0 &amp;&amp; s &lt; sources) &amp;&amp; (verdict k r s == 2) == (k ≥ 2 &amp;&amp; r == 0 &amp;&amp; s == 0))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(k \mapsto \mathrm{R.all}\mathopen{}\left(r \mapsto \mathrm{R.all}\mathopen{}\left(s \mapsto \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 0 = k &lt; 2 \land \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 1 = k \ge 2 \land r &gt; 0 \land \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 4 = k \ge 2 \land r = 0 \land s \ge \mathrm{sources} \land \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 3 = k \ge 2 \land r = 0 \land s &gt; 0 \land s &lt; \mathrm{sources} \land \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 2 = k \ge 2 \land r = 0 \land s = 0\right)\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · EXCLUSIVE — NEVER TWO READINGS OF ONE ROW ───────────────────────────────────────────────────────── The verdict is a function, so exclusivity is the statement that it agrees with itself on equal inputs — trivial for a function and NOT trivial for the property a reader depends on, which is that the five classes do not overlap. Stated as: each verdict value is produced by a condition no other value shares.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-a_source_going_silent_never_cleans_the_verdict">
<p class="thm-label"><strong>Theorem 1491</strong> (<code>a_source_going_silent_never_cleans_the_verdict</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_a_source_going_silent_never_cleans_the_verdict.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>k</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∨</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mrow><mi>s</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>≥</mo><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun k =&gt; R.all (fun r =&gt; R.all (fun s =&gt; (verdict k r s == 1) || verdict k r (s + 1) ≥ verdict k r s)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(k \mapsto \mathrm{R.all}\mathopen{}\left(r \mapsto \mathrm{R.all}\mathopen{}\left(s \mapsto \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 1 \lor \mathrm{verdict}\mathopen{}\left(k,\,r,\,s + 1\right) \ge \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right)\right)\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · SILENCE NEVER IMPROVES THE VERDICT ──────────────────────────────────────────────────────────────── THE ONE THAT MATTERS. If a source going quiet could turn NONE_FOUND_PARTIAL into NONE_FOUND, an outage would be recorded as a clean search — the record would report "nothing found" when the truth is "nobody looked". Decided: adding silence never moves the verdict toward the cleaner class.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-the_clean_verdict_is_reachable_only_from_complete_evidence">
<p class="thm-label"><strong>Theorem 1492</strong> (<code>the_clean_verdict_is_reachable_only_from_complete_evidence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_the_clean_verdict_is_reachable_only_from_complete_evidence.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>k</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mrow><mo>¬</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∨</mo><mrow><mrow><mrow><mi>s</mi><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mi>r</mi><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>k</mi><mo>≥</mo><mn>2</mn></mrow></mrow></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun k =&gt; R.all (fun r =&gt; R.all (fun s =&gt; !(verdict k r s == 2) || (s == 0 &amp;&amp; r == 0 &amp;&amp; k ≥ 2))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(k \mapsto \mathrm{R.all}\mathopen{}\left(r \mapsto \mathrm{R.all}\mathopen{}\left(s \mapsto \lnot \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 2 \lor s = 0 \land r = 0 \land k \ge 2\right)\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · NONE_FOUND REQUIRES EVERY SOURCE TO HAVE ANSWERED ───────────────────────────────────────────────── The verdict this deposit's kind 2 rests on is the strictest, and it is reachable only from complete evidence. One unanswered source and it is NONE_FOUND_PARTIAL, which the record names and re-searches.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-a_relevant_hit_outranks_any_amount_of_silence">
<p class="thm-label"><strong>Theorem 1493</strong> (<code>a_relevant_hit_outranks_any_amount_of_silence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_a_relevant_hit_outranks_any_amount_of_silence.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>k</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mrow><mo>¬</mo><mrow><mrow><mi>k</mi><mo>≥</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mi>r</mi><mo>&gt;</mo><mn>0</mn></mrow></mrow></mrow><mo>∨</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun k =&gt; R.all (fun r =&gt; R.all (fun s =&gt; !(k ≥ 2 &amp;&amp; r &gt; 0) || verdict k r s == 1)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(k \mapsto \mathrm{R.all}\mathopen{}\left(r \mapsto \mathrm{R.all}\mathopen{}\left(s \mapsto \lnot k \ge 2 \land r &gt; 0 \lor \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right) = 1\right)\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · EVIDENCE OUTRANKS SILENCE ───────────────────────────────────────────────────────────────────────── A relevant hit is CANDIDATES however many sources failed: something was found, and what else might have been found does not unfind it. The asymmetry is deliberate and is stated rather than left implicit.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-all_five_verdicts_occur">
<p class="thm-label"><strong>Theorem 1494</strong> (<code>all_five_verdicts_occur</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_all_five_verdicts_occur.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>R.flatMap</mi><mo>(</mo><mrow><mi>k</mi><mo>↦</mo><mrow><mi>R.flatMap</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.map</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mi>verdict</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></math></div>
<pre class="thm-statement"><code>(R.flatMap (fun k =&gt; R.flatMap (fun r =&gt; R.map (fun s =&gt; verdict k r s)))).eraseDups.length == 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{R.flatMap}\mathopen{}\left(k \mapsto \mathrm{R.flatMap}\mathopen{}\left(r \mapsto \mathrm{R.map}\mathopen{}\left(s \mapsto \mathrm{verdict}\mathopen{}\left(k,\,r,\,s\right)\right)\right)\right)\right)\right| = 5</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE CONTROL: THE RULE IS NOT CONSTANT ───────────────────────────────────────────────────────────── Theorems 1, 3 and 4 are all satisfied by a rule that always returns one value, which would be a much worse defect and would make this file evidence of the wrong thing. All five verdicts occur.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-too_few_terms_precedes_every_other_test">
<p class="thm-label"><strong>Theorem 1495</strong> (<code>too_few_terms_precedes_every_other_test</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_too_few_terms_precedes_every_other_test.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>s</mi><mo>↦</mo><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>0</mn><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>r</mi><mo>,</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun r =&gt; R.all (fun s =&gt; verdict 0 r s == 0 &amp;&amp; verdict 1 r s == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(r \mapsto \mathrm{R.all}\mathopen{}\left(s \mapsto \mathrm{verdict}\mathopen{}\left(0,\,r,\,s\right) = 0 \land \mathrm{verdict}\mathopen{}\left(1,\,r,\,s\right) = 0\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── 7 · TOO FEW TERMS IS NOT A RESULT ABOUT THE LITERATURE ──────────────────────────────────────────────── It precedes every other test, because a statement offering fewer than two distinctive terms was never searched for — recording it as NONE_FOUND would be the record's own worst overclaim, a clean verdict on a search that did not happen.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-verdict-the_rule_is_decided_and_the_search_quality_is_not">
<p class="thm-label"><strong>Theorem 1496</strong> (<code>the_rule_is_decided_and_the_search_quality_is_not</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_verdict_the_rule_is_decided_and_the_search_quality_is_not.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>5</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>5</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>5</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>5</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>verdict</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>9</mn><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>sources</mi><mo>=</mo><mn>5</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>verdict 5 0 0 == 2 &amp;&amp; verdict 5 1 0 == 1 &amp;&amp; verdict 5 0 5 == 4 &amp;&amp; verdict 5 0 1 == 3 &amp;&amp; verdict 1 9 9 == 0 &amp;&amp; sources == 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdict}\mathopen{}\left(5,\,0,\,0\right) = 2 \land \mathrm{verdict}\mathopen{}\left(5,\,1,\,0\right) = 1 \land \mathrm{verdict}\mathopen{}\left(5,\,0,\,5\right) = 4 \land \mathrm{verdict}\mathopen{}\left(5,\,0,\,1\right) = 3 \land \mathrm{verdict}\mathopen{}\left(1,\,9,\,9\right) = 0 \land \mathrm{sources} = 5</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHAT THE CLEAN VERDICT STILL DOES NOT SAY ───────────────────────────────────────────────────────── NONE_FOUND means every source answered and nothing cleared the floor, ON THE DAY, AT THAT FLOOR, IN THAT MANY RESULTS. It does not mean nothing earlier exists, and no arithmetic here could make it mean that: a keyword search misses what it does not name, and the floor is a judgement about how much noise to accept. What is decided above is that the rule is total, exclusive and never flattered by silence. Whether the literature was actually searched well is not a property of the rule, and this file does not claim it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
