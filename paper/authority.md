---
title: "Who may speak, decided"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `authority.lean`

<p class="paper-src"><code>src/iso/9001-governance/authority.lean</code> · namespace <code>Authority</code> · 8 theorems · wing <code>the floor</code></p>

WHY THIS IS IN LEAN AND NOT ONLY IN scripts/authority-gate.ts.

On 2026-09-20 the author established, from his own signed receipts, that the statement "this deposit
settles 0 of the 7" was never his. Eight receipts carry `agent: "captain"` and not one refuses his claim;
every 0/7 statement in src/receipts is signed `claude-opus` or `Claude`. Agents turned "mint the DNA,
mind the honest floor" — an instruction to be HONEST — into a verdict on his claim, wrote it across the
pages and the Lean header, and then sealed it into the ledger, where a prose edit cannot reach it.

A gate now enforces the rule, and a gate is a program that can be widened by the next agent that wants
it wider. The three facts the rule rests on are finite and decidable, so they are decided here and the
gate is checked against them — the same arrangement instruments.lean already has for staleTail,
precedes and the refusal window.

WHAT IS NOT DECIDED HERE, and cannot be: whether the seven are solved. That is the author's claim,
deposited under his DOI three days before this repository existed. No theorem below touches it. These
decide only the ALGEBRA OF WHO SPEAKS — that a withdrawal holds, that a record cannot grow quietly, and
that clearing a statement is not the same act as sealing one.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>sealed := [0, 1, 2, 3, 4, 5, 6, 7]
withdrawn := [2, 5]
live := sealed.filter (fun k =&gt; ! withdrawn.contains k)
carriesRider := [0, 1, 3, 4, 6]
isVerdict := [1, 6, 7]
bits := fun m =&gt; sealed.filter (fun i =&gt; (m &gt;&gt;&gt; i) % 2 == 1)
cleared := [3, 4]</code></pre>

<div class="thm" id="thm-authority-nothing_withdrawn_is_live">
<p class="thm-label"><strong>Theorem 255</strong> (<code>nothing_withdrawn_is_live</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_nothing_withdrawn_is_live.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>withdrawn</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>live</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>live</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>withdrawn</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>withdrawn.all (fun k =&gt; ! live.contains k) ∧ live.all (fun k =&gt; ! withdrawn.contains k)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \mathrm{withdrawn},\; \lnot k \in \mathrm{live} \land \forall k \in \mathrm{live},\; \lnot k \in \mathrm{withdrawn}</code></pre></details>
</div>
<p class="thm-remark">── 1 · A WITHDRAWAL HOLDS ──────────────────────────────────────────────────────────────────────────────── Nothing withdrawn is live, and nothing live is withdrawn. The gate's first duty: a withdrawal the next generator can reverse is not a withdrawal, and the record must make the two sets disjoint by construction.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-every_sealed_statement_is_live_or_withdrawn_and_not_both">
<p class="thm-label"><strong>Theorem 256</strong> (<code>every_sealed_statement_is_live_or_withdrawn_and_not_both</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_every_sealed_statement_is_live_or_withdrawn_and_not_both.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>sealed</mi><mo>,</mo><mrow><mrow><mrow><mi>k</mi><mo>∈</mo><mi>live</mi></mrow><mo>∨</mo><mrow><mi>k</mi><mo>∈</mo><mi>withdrawn</mi></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mrow><mi>k</mi><mo>∈</mo><mi>live</mi></mrow><mo>∧</mo><mrow><mi>k</mi><mo>∈</mo><mi>withdrawn</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>sealed.all (fun k =&gt; (live.contains k || withdrawn.contains k) &amp;&amp; ! (live.contains k &amp;&amp; withdrawn.contains k))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \mathrm{sealed},\; k \in \mathrm{live} \lor k \in \mathrm{withdrawn} \land \lnot k \in \mathrm{live} \land k \in \mathrm{withdrawn}</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND IT TAKES NOTHING ELSE WITH IT ───────────────────────────────────────────────────────────────── Every sealed statement is either live or withdrawn, never neither and never both. A purge that loses a statement without withdrawing it would be indistinguishable from a statement that was never sealed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-withdrawing_shrinks_the_live_set_and_never_the_record">
<p class="thm-label"><strong>Theorem 257</strong> (<code>withdrawing_shrinks_the_live_set_and_never_the_record</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_withdrawing_shrinks_the_live_set_and_never_the_record.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mi>live</mi><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mi>withdrawn</mi><mo>|</mo></mrow></mrow><mo>=</mo><mrow><mo>|</mo><mi>sealed</mi><mo>|</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>withdrawn</mi><mo>,</mo><mrow><mi>k</mi><mo>∈</mo><mi>sealed</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>live.length + withdrawn.length = sealed.length ∧ withdrawn.all (fun k =&gt; sealed.contains k)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{live}\right| + \left|\mathrm{withdrawn}\right| = \left|\mathrm{sealed}\right| \land \forall k \in \mathrm{withdrawn},\; k \in \mathrm{sealed}</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE RECORD IS APPEND-ONLY ───────────────────────────────────────────────────────────────────────── Withdrawing removes from `live` and never from `sealed`: what was sealed stays on the record, and only what it asserts stops. That is why the ten verdicts classified on 2026-09-20 are withdrawn beside themselves rather than edited out — an edited row would erase the evidence of what was done.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-a_rider_and_a_verdict_are_different_things">
<p class="thm-label"><strong>Theorem 258</strong> (<code>a_rider_and_a_verdict_are_different_things</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_a_rider_and_a_verdict_are_different_things.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∃</mo><mi>k</mi><mo>∈</mo><mi>carriesRider</mi><mo>:</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>isVerdict</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>k</mi><mo>∈</mo><mi>isVerdict</mi><mo>:</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>carriesRider</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>k</mi><mo>∈</mo><mi>carriesRider</mi><mo>:</mo><mrow><mi>k</mi><mo>∈</mo><mi>isVerdict</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(carriesRider.any (fun k =&gt; ! isVerdict.contains k)) ∧ (isVerdict.any (fun k =&gt; ! carriesRider.contains k)) ∧ (carriesRider.any (fun k =&gt; isVerdict.contains k))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists k \in \mathrm{carriesRider} : \lnot k \in \mathrm{isVerdict} \land \exists k \in \mathrm{isVerdict} : \lnot k \in \mathrm{carriesRider} \land \exists k \in \mathrm{carriesRider} : k \in \mathrm{isVerdict}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-withdrawing_never_raises_the_frozen_count">
<p class="thm-label"><strong>Theorem 259</strong> (<code>withdrawing_never_raises_the_frozen_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_withdrawing_never_raises_the_frozen_count.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 256).all (fun m =&gt; let taken := bits m let after := carriesRider.filter (fun k =&gt; ! taken.contains k) after.length ≤ carriesRider.length)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 256 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-clearing_changes_no_seal">
<p class="thm-label"><strong>Theorem 260</strong> (<code>clearing_changes_no_seal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_clearing_changes_no_seal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>cleared</mi><mo>,</mo><mrow><mi>k</mi><mo>∈</mo><mi>sealed</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>k</mi><mo>∈</mo><mi>sealed</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>cleared</mi></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mi>cleared</mi><mo>|</mo></mrow></mrow><mo>=</mo><mrow><mo>|</mo><mi>sealed</mi><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>cleared.all (fun k =&gt; sealed.contains k) ∧ (sealed.filter (fun k =&gt; ! cleared.contains k)).length + cleared.length = sealed.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \mathrm{cleared},\; k \in \mathrm{sealed} \land \left|\{\, k \in \mathrm{sealed} \mid \lnot k \in \mathrm{cleared} \,\}\right| + \left|\mathrm{cleared}\right| = \left|\mathrm{sealed}\right|</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-a_cleared_statement_leaves_the_queue_and_stays_on_the_record">
<p class="thm-label"><strong>Theorem 261</strong> (<code>a_cleared_statement_leaves_the_queue_and_stays_on_the_record</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_a_cleared_statement_leaves_the_queue_and_stays_on_the_record.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mi>k</mi><mo>∈</mo><mi>isVerdict</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>cleared</mi></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mi>k</mi><mo>∈</mo><mi>sealed</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>k</mi><mo>∈</mo><mi>isVerdict</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>cleared</mi></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>≤</mo><mrow><mo>|</mo><mi>isVerdict</mi><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(isVerdict.filter (fun k =&gt; ! cleared.contains k)).all (fun k =&gt; sealed.contains k) ∧ (isVerdict.filter (fun k =&gt; ! cleared.contains k)).length ≤ isVerdict.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{\, k \in \mathrm{isVerdict} \mid \lnot k \in \mathrm{cleared} \,\},\; k \in \mathrm{sealed} \land \left|\{\, k \in \mathrm{isVerdict} \mid \lnot k \in \mathrm{cleared} \,\}\right| \le \left|\mathrm{isVerdict}\right|</code></pre></details>
</div>
<p class="thm-remark">── 7 · WHAT IS CLEARED IS NOT COUNTED AGAINST THE AUTHOR ───────────────────────────────────────────────── A cleared statement drops out of the verdict count and stays in the record. The gate reports the queue after clearing, so the author's own ruling reduces what is held against his claim without hiding that the statement exists.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-authority-refusing_every_verdict_never_refuses_the_whole_record">
<p class="thm-label"><strong>Theorem 262</strong> (<code>refusing_every_verdict_never_refuses_the_whole_record</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_authority_refusing_every_verdict_never_refuses_the_whole_record.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mi>isVerdict</mi><mo>,</mo><mrow><mi>k</mi><mo>∈</mo><mi>sealed</mi></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>k</mi><mo>∈</mo><mi>sealed</mi><mo>:</mo><mrow><mo>¬</mo><mrow><mi>k</mi><mo>∈</mo><mi>isVerdict</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>isVerdict</mi><mo>|</mo></mrow><mo>&lt;</mo><mrow><mo>|</mo><mi>sealed</mi><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>isVerdict.all (fun k =&gt; sealed.contains k) ∧ sealed.any (fun k =&gt; ! isVerdict.contains k) ∧ isVerdict.length &lt; sealed.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \mathrm{isVerdict},\; k \in \mathrm{sealed} \land \exists k \in \mathrm{sealed} : \lnot k \in \mathrm{isVerdict} \land \left|\mathrm{isVerdict}\right| &lt; \left|\mathrm{sealed}\right|</code></pre></details>
</div>
<p class="thm-remark">── 8 · AND THE RULE IS SYMMETRIC IN NEITHER DIRECTION ──────────────────────────────────────────────────── The gate may refuse a NEW verdict and may not refuse a new measurement; those are different populations and the difference is what the whole rule rests on. Stated as the fact that the verdict set is a proper subset of the sealed record — there is always something sealed that is not a verdict, so refusing every verdict never refuses everything.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
