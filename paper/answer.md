---
title: "answer"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `answer.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/answer.lean</code> · namespace <code>Answer</code> · 8 theorems · wing <code>unassigned</code></p>

lean/answer.lean — the pure decisions of the answer system (src/answer/verify-lean.ts and verify-arith.ts), stated
and proved. These are the rules the TypeScript decision functions implement; the link between the two is a runtime
test until the TypeScript is generated from this file.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>allBools := [false, true]
allReports := allBools.flatMap fun a =&gt; allBools.flatMap fun c =&gt; allBools.flatMap fun s =&gt; allBools.flatMap fun n =&gt; [⟨a, c, s, n⟩]
allVerdicts := [Verdict.prime, Verdict.composite, Verdict.probablePrime, Verdict.other]
allRoutes := allVerdicts.flatMap fun v =&gt; allBools.flatMap fun p =&gt; allBools.flatMap fun f =&gt; [⟨v, p, f⟩]</code></pre>

<div class="thm" id="thm-answer-c1_true_only_when_clean">
<p class="thm-label"><strong>Theorem 174</strong> (<code>c1_true_only_when_clean</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_c1_true_only_when_clean.html">sealed</a>.</p>
<pre class="thm-statement"><code>r.answered = true ∧ r.compiles = true ∧ r.hasSorry = false ∧ r.noAxioms = true</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-c2_probable_prime_is_unknown">
<p class="thm-label"><strong>Theorem 175</strong> (<code>c2_probable_prime_is_unknown</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_c2_probable_prime_is_unknown.html">sealed</a>.</p>
<pre class="thm-statement"><code>decideC2 { verdict := Verdict.probablePrime, proved := p, factorChecked := f } = Value.UNKNOWN</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-c2_true_only_for_proved_prime">
<p class="thm-label"><strong>Theorem 176</strong> (<code>c2_true_only_for_proved_prime</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_c2_true_only_for_proved_prime.html">sealed</a>.</p>
<pre class="thm-statement"><code>r.verdict = Verdict.prime ∧ r.proved = true</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-c2_false_only_for_checked_composite">
<p class="thm-label"><strong>Theorem 177</strong> (<code>c2_false_only_for_checked_composite</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_c2_false_only_for_checked_composite.html">sealed</a>.</p>
<pre class="thm-statement"><code>r.verdict = Verdict.composite ∧ r.factorChecked = true</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-c1_exhaustive">
<p class="thm-label"><strong>Theorem 178</strong> (<code>c1_exhaustive</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_c1_exhaustive.html">sealed</a>.</p>
<pre class="thm-statement"><code>allReports.all (fun r =&gt; (decideC1 r == Value.TRUE) == (r.answered &amp;&amp; r.compiles &amp;&amp; !r.hasSorry &amp;&amp; r.noAxioms)) = true</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-c2_exhaustive">
<p class="thm-label"><strong>Theorem 179</strong> (<code>c2_exhaustive</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_c2_exhaustive.html">sealed</a>.</p>
<pre class="thm-statement"><code>allRoutes.all (fun r =&gt; (decideC2 r == Value.TRUE) == (r.verdict == Verdict.prime &amp;&amp; r.proved) &amp;&amp; (decideC2 r == Value.FALSE) == (!(r.verdict == Verdict.prime &amp;&amp; r.proved) &amp;&amp; r.verdict == Verdict.composite &amp;&amp; r.factorChecked)) = true</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-gate_matches_rules">
<p class="thm-label"><strong>Theorem 180</strong> (<code>gate_matches_rules</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_gate_matches_rules.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>v</mi><mo>∈</mo><mrow><mo>[</mo><mi>Val.TRUE</mi><mo>,</mo><mi>Val.FALSE</mi><mo>,</mo><mi>Val.SOURCED</mi><mo>,</mo><mi>Val.UNKNOWN</mi><mo>]</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>[</mo><mi>Cert.none</mi><mo>,</mo><mi>Cert.C1</mi><mo>,</mo><mi>Cert.C2</mi><mo>,</mo><mi>Cert.C3</mi><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>gateOk</mi><mo>(</mo><mi>v</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>ruleOk</mi><mo>(</mo><mi>v</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>[Val.TRUE, Val.FALSE, Val.SOURCED, Val.UNKNOWN].all (fun v =&gt; [Cert.none, Cert.C1, Cert.C2, Cert.C3].all (fun c =&gt; gateOk v c == ruleOk v c)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall v \in [\mathrm{Val.TRUE},\,\mathrm{Val.FALSE},\,\mathrm{Val.SOURCED},\,\mathrm{Val.UNKNOWN}],\; \forall c \in [\mathrm{Cert.none},\,\mathrm{Cert.C1},\,\mathrm{Cert.C2},\,\mathrm{Cert.C3}],\; \mathrm{gateOk}\mathopen{}\left(v,\,c\right) = \mathrm{ruleOk}\mathopen{}\left(v,\,c\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer-gate_refuses_uncertified_truth">
<p class="thm-label"><strong>Theorem 181</strong> (<code>gate_refuses_uncertified_truth</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answer_gate_refuses_uncertified_truth.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>v</mi><mo>∈</mo><mrow><mo>[</mo><mi>Val.TRUE</mi><mo>,</mo><mi>Val.FALSE</mi><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>gateOk</mi><mo>(</mo><mi>v</mi><mo>,</mo><mi>Cert.none</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>[Val.TRUE, Val.FALSE].all (fun v =&gt; gateOk v Cert.none == false) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall v \in [\mathrm{Val.TRUE},\,\mathrm{Val.FALSE}],\; \mathrm{gateOk}\mathopen{}\left(v,\,\mathrm{Cert.none}\right) = \mathrm{false} = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
