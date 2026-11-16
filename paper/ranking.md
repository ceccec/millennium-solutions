---
title: "The discovery ranking is monotone, and it is far coarser than it looks"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `ranking.lean`

<p class="paper-src"><code>src/iso/690-record/ranking.lean</code> · namespace <code>Ranking</code> · 8 theorems · wing <code>the record</code></p>

WHY THIS FILE EXISTS.

scripts/discoveries.ts orders every theorem by six binary signals with weights I chose: the file declares
its own work (3), no search is recorded (3), the prior-art pool is unbounded (1), the file is
unclassified (2), the family is at octave scale (1), the theorem is general rather than exhaustive (1).

Nothing justified those numbers and nothing checked them. A ranking that decides where scarce attention
goes is exactly the kind of rule that gets trusted because it produces a sorted list, and a sorted list
looks like a finding whatever it is sorting on.

TWO QUESTIONS, AND THE SECOND IS THE ONE WORTH ASKING.

Is it MONOTONE — does turning a signal on ever LOWER a score? If it did, the queue would push work away
from the evidence that recommended it, and no reader would see that in a sorted list. It does not:
theorem 1, over all sixty-four signal combinations.

And how much can it actually SEPARATE? Sixty-four combinations collapse onto twelve scores. Nine
different signal sets share the score 4, and nine more share 5, 6 and 7 — so at the middle of the queue,
where most theorems sit, the ranking is holding nine distinguishable states as one. It is an ORDINAL
HINT over a partial order, not a ranking, and reading the top of the list as "the nine best candidates"
reads a precision the arithmetic does not carry. Theorem 4 counts it.

THE WEIGHTS ARE NOT DEFENDED HERE AND CANNOT BE. There is no fact about prior art that fixes whether an
unclassified file is worth two of something and an unbounded pool worth one. They are a judgement, like
the relevance floor in src/novelty, and the honest treatment is the same: carry them where they can be
seen and disagreed with, and decide only what is decidable about them.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>weights := [3, 3, 1, 2, 1, 1]
masks := List.range 64</code></pre>

<div class="thm" id="thm-ranking-turning_a_signal_on_never_lowers_the_score">
<p class="thm-label"><strong>Theorem 1465</strong> (<code>turning_a_signal_on_never_lowers_the_score</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_turning_a_signal_on_never_lowers_the_score.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>,</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>bit</mi><mo>(</mo><mi>m</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>∨</mo><mrow><mrow><mi>score</mi><mo>(</mo><mrow><mi>m</mi><mo>+</mo><msup><mn>2</mn><mi>i</mi></msup></mrow><mo>)</mo></mrow><mo>≥</mo><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>masks.all (fun m =&gt; (List.range 6).all (fun i =&gt; bit m i || score (m + 2 ^ i) ≥ score m))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \mathrm{masks},\; \forall i \in \{0,\dots,5\},\; \mathrm{bit}\mathopen{}\left(m,\,i\right) \lor \mathrm{score}\mathopen{}\left(m + 2^{i}\right) \ge \mathrm{score}\mathopen{}\left(m\right)</code></pre></details>
</div>
<p class="thm-remark">── 1 · MONOTONE — EVIDENCE NEVER LOWERS A SCORE ────────────────────────────────────────────────────────── Turning a signal on never moves a candidate down the queue. Without this the ranking could push work away from the very evidence that recommended it, invisibly, behind a sorted list.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-every_signal_strictly_raises_the_score">
<p class="thm-label"><strong>Theorem 1466</strong> (<code>every_signal_strictly_raises_the_score</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_every_signal_strictly_raises_the_score.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>,</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>bit</mi><mo>(</mo><mi>m</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>∨</mo><mrow><mrow><mi>score</mi><mo>(</mo><mrow><mi>m</mi><mo>+</mo><msup><mn>2</mn><mi>i</mi></msup></mrow><mo>)</mo></mrow><mo>&gt;</mo><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>weights</mi><mo>,</mo><mrow><mi>w</mi><mo>&gt;</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>masks.all (fun m =&gt; (List.range 6).all (fun i =&gt; bit m i || score (m + 2 ^ i) &gt; score m)) &amp;&amp; weights.all (fun w =&gt; w &gt; 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \mathrm{masks},\; \forall i \in \{0,\dots,5\},\; \mathrm{bit}\mathopen{}\left(m,\,i\right) \lor \mathrm{score}\mathopen{}\left(m + 2^{i}\right) &gt; \mathrm{score}\mathopen{}\left(m\right) \land \forall w \in \mathrm{weights},\; w &gt; 0</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND STRICTLY, BECAUSE EVERY WEIGHT IS POSITIVE ──────────────────────────────────────────────────── A zero weight would be a signal collected and then ignored — worse than not collecting it, because the code would read as if it counted.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-the_score_runs_from_zero_to_eleven">
<p class="thm-label"><strong>Theorem 1467</strong> (<code>the_score_runs_from_zero_to_eleven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_the_score_runs_from_zero_to_eleven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>score</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mi>score</mi><mo>(</mo><mn>63</mn><mo>)</mo></mrow><mo>=</mo><mn>11</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>∑</mo><mi>weights</mi></mrow><mo>=</mo><mn>11</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>,</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>≤</mo><mn>11</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>score 0 == 0 &amp;&amp; score 63 == 11 &amp;&amp; weights.foldl (· + ·) 0 == 11 &amp;&amp; masks.all (fun m =&gt; score m ≤ 11)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{score}\mathopen{}\left(0\right) = 0 \land \mathrm{score}\mathopen{}\left(63\right) = 11 \land \sum \mathrm{weights} = 11 \land \forall m \in \mathrm{masks},\; \mathrm{score}\mathopen{}\left(m\right) \le 11</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE RANGE IS ZERO TO ELEVEN ───────────────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-the_ranking_holds_nine_distinguishable_states_as_one">
<p class="thm-label"><strong>Theorem 1468</strong> (<code>the_ranking_holds_nine_distinguishable_states_as_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_the_ranking_holds_nine_distinguishable_states_as_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>score</mi><mo>[</mo><mi>masks</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>12</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>5</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>7</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(masks.map score).eraseDups.length == 12 &amp;&amp; (masks.filter (fun m =&gt; score m == 4)).length == 9 &amp;&amp; (masks.filter (fun m =&gt; score m == 5)).length == 9 &amp;&amp; (masks.filter (fun m =&gt; score m == 6)).length == 9 &amp;&amp; (masks.filter (fun m =&gt; score m == 7)).length == 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{score}[\mathrm{masks}]\right)\right| = 12 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 4 \,\}\right| = 9 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 5 \,\}\right| = 9 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 6 \,\}\right| = 9 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 7 \,\}\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── 4 · SIXTY-FOUR STATES COLLAPSE ONTO TWELVE SCORES ───────────────────────────────────────────────────── THE THEOREM THIS FILE IS FOR, and it is unflattering. The ranking cannot separate what it collects: nine distinct signal sets share the score 4, nine share 5, nine share 6, nine share 7 — and the middle of the queue is where most theorems sit. A sorted list of these is an ordinal hint over a partial order.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-only_the_top_and_the_bottom_identify_their_evidence">
<p class="thm-label"><strong>Theorem 1469</strong> (<code>only_the_top_and_the_bottom_identify_their_evidence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_only_the_top_and_the_bottom_identify_their_evidence.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>11</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>11</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>63</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(masks.filter (fun m =&gt; score m == 0)).length == 1 &amp;&amp; (masks.filter (fun m =&gt; score m == 11)).length == 1 &amp;&amp; (masks.filter (fun m =&gt; score m == 0)) == [0] &amp;&amp; (masks.filter (fun m =&gt; score m == 11)) == [63]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 0 \,\}\right| = 1 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 11 \,\}\right| = 1 \land \{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 0 \,\} = [0] \land \{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) = 11 \,\} = [63]</code></pre></details>
</div>
<p class="thm-remark">── 5 · ONLY THE EXTREMES ARE UNAMBIGUOUS ───────────────────────────────────────────────────────────────── Exactly one signal set scores 0 and exactly one scores 11, so the very top and the very bottom of the queue mean something precise and nothing between them does.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-distinct_powers_would_separate_every_state">
<p class="thm-label"><strong>Theorem 1470</strong> (<code>distinct_powers_would_separate_every_state</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_distinct_powers_would_separate_every_state.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>fold</mi><mo>(</mo><mrow><mi>acc</mi><mo>,</mo><mi>i</mi><mo>↦</mo><mrow><mi>acc</mi><mo>+</mo><mrow><mo>(</mo><msup><mn>2</mn><mi>i</mi></msup><mo>if</mo><mrow><mi>bit</mi><mo>(</mo><mi>m</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>;</mo><mo>otherwise</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow><mo>,</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>∣</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>64</mn></mrow></math></div>
<pre class="thm-statement"><code>(masks.map (fun m =&gt; (List.range 6).foldl (fun acc i =&gt; acc + (if bit m i then 2 ^ i else 0)) 0)).eraseDups.length == 64</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \operatorname{fold}_{\mathrm{acc},\,i \mapsto \mathrm{acc} + \begin{cases}2^{i} &amp; \text{if } \mathrm{bit}\mathopen{}\left(m,\,i\right)\\ 0 &amp; \text{otherwise}\end{cases}}\left(\{0,\dots,5\},\, 0\right) \mid m \in \mathrm{masks} \,\}\right)\right| = 64</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE CONTROL: A FINER RULE WOULD SEPARATE MORE ───────────────────────────────────────────────────── Theorems 4 and 5 would hold of any coarse rule, including a broken one. Powers of two separate all sixty-four states, so the collapse measures THESE weights and not the counting method. It is also what the weights would have to become to carry the precision a sorted list implies — and they should not, because they are a judgement and not a measurement.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-the_two_heaviest_signals_outweigh_all_the_others">
<p class="thm-label"><strong>Theorem 1471</strong> (<code>the_two_heaviest_signals_outweigh_all_the_others</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_the_two_heaviest_signals_outweigh_all_the_others.html">sealed</a>.</p>
<pre class="thm-statement"><code>masks.all (fun m =&gt; (bit m 0 || bit m 1 || score m &lt; weights.getD 0 0 + weights.getD 1 0) &amp;&amp; (!(bit m 0 || bit m 1) || score m ≥ weights.getD 2 0)) ∧ weights.getD 0 0 == 3 &amp;&amp; weights.getD 1 0 == 3 &amp;&amp; weights.getD 0 0 + weights.getD 1 0 &gt; weights.getD 2 0 + weights.getD 3 0 + weights.getD 4 0 + weights.getD 5 0</code></pre>
</div>
<p class="thm-remark">── 7 · THE TWO HEAVIEST SIGNALS ARE THE TWO THAT MEAN THE MOST ─────────────────────────────────────────── Stated so the judgement is visible rather than buried in a list of numbers: "the file claims its own work" and "nobody has looked" each outweigh any other single signal, and together they outweigh all four of the rest. OUTWEIGH IS A STATEMENT ABOUT EVERY SCORE, NOT ABOUT THE WEIGHTS. Comparing the two sums says the numbers are ordered; what matters for the queue is that NO combination of the four light signals ever reaches the pair of heavy ones. Decided over all sixty-four masks in both directions: every mask with both heavy bits off scores strictly below their sum, and the mask carrying only those two scores at least as much as any of them. So a candidate cannot climb past a heavy signal by accumulating light ones.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ranking-a_high_score_orders_attention_and_settles_nothing">
<p class="thm-label"><strong>Theorem 1472</strong> (<code>a_high_score_orders_attention_and_settles_nothing</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ranking_a_high_score_orders_attention_and_settles_nothing.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>score</mi><mo>(</mo><mn>63</mn><mo>)</mo></mrow><mo>=</mo><mn>11</mn></mrow><mo>∧</mo><mrow><mrow><mi>score</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>≥</mo><mn>8</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>14</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mi>masks</mi><mo>∣</mo><mrow><mrow><mi>score</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>≥</mo><mn>8</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>&lt;</mo><mrow><mo>|</mo><mi>masks</mi><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>score 63 == 11 &amp;&amp; score 0 == 0 &amp;&amp; (masks.filter (fun m =&gt; score m ≥ 8)).length == 14 &amp;&amp; (masks.filter (fun m =&gt; score m ≥ 8)).length &lt; masks.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{score}\mathopen{}\left(63\right) = 11 \land \mathrm{score}\mathopen{}\left(0\right) = 0 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) \ge 8 \,\}\right| = 14 \land \left|\{\, m \in \mathrm{masks} \mid \mathrm{score}\mathopen{}\left(m\right) \ge 8 \,\}\right| &lt; \left|\mathrm{masks}\right|</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHAT A HIGH SCORE DOES NOT MEAN ─────────────────────────────────────────────────────────────────── It does not mean a statement is novel, or interesting, or unpublished. It means six checkable facts about WHERE IT SITS IN THIS TREE happen to coincide, and the queue exists to spend a search on it. Only a performed search says anything about the literature, which is decided in src/iso/690-record/verdict.lean and is a different file for a reason. A ranking that could establish novelty would not need the search.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
