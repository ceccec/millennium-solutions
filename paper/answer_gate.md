---
title: "The certificate gate, as kernel-checked rules"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `answer_gate.lean`

<p class="paper-src"><code>src/iso/9001-governance/answer_gate.lean</code> · namespace <code>AnswerGate</code> · 7 theorems · wing <code>the floor</code></p>

prior-art note: not applicable — rules of the answer system, docs/ANSWER-SYSTEM.md


THE RULES (docs/ANSWER-SYSTEM.md, "Answer rules"): TRUE and FALSE need a proof certificate (C1 or C2); SOURCED needs a
DOI certificate (C3); UNKNOWN carries no certificate and names its blocking step; every answer names what checked it.
An answer is a record of flags. The gate decides it by `ok`, and scripts/answer-gate.ts asks the kernel for each
stored answer, so the verdict is the kernel's and not a TypeScript function's.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>allVals := [Val.TRUE, Val.FALSE, Val.SOURCED, Val.UNKNOWN]
allCerts := [Cert.none, Cert.C1, Cert.C2, Cert.C3, Cert.other]
allBools := [false, true]
allFlags := allVals.flatMap fun v =&gt; allCerts.flatMap fun c =&gt; allBools.flatMap fun ch =&gt; allBools.flatMap fun b =&gt;</code></pre>

<div class="thm" id="thm-answer_gate-exactly_eleven_are_accepted">
<p class="thm-label"><strong>Theorem 238</strong> (<code>exactly_eleven_are_accepted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_exactly_eleven_are_accepted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>allFlags</mi><mo>∣</mo><mi>ok</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>11</mn></mrow></math></div>
<pre class="thm-statement"><code>(allFlags.filter ok).length = 11</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, x \in \mathrm{allFlags} \mid \mathrm{ok}\mathopen{}\left(x\right) \,\}\right| = 11</code></pre></details>
</div>
<p class="thm-remark">── THE EXTENT OF THE RULES, COUNTED: exactly these 11 of the 80 flag combinations are accepted ─────────── TRUE: a C1 or C2 certificate (2), a checker (1), blocking step either way (2): 4. FALSE: the same, 4. SOURCED: a C3 certificate (1), a checker (1), blocking step either way (2): 2. UNKNOWN: no certificate (1), a blocking step (1), a checker (1): 1. Total 4 + 4 + 2 + 1 = 11.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_gate-truth_without_a_proof_is_refused">
<p class="thm-label"><strong>Theorem 239</strong> (<code>truth_without_a_proof_is_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_truth_without_a_proof_is_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>ok</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>ok f = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ok}\mathopen{}\left(f\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">── THE REFUSALS, EACH AS ITS OWN THEOREM ─────────────────────────────────────────────────────────────── TRUE without a proof is refused, whatever else is set.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_gate-falsehood_without_a_proof_is_refused">
<p class="thm-label"><strong>Theorem 240</strong> (<code>falsehood_without_a_proof_is_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_falsehood_without_a_proof_is_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>ok</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>ok f = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ok}\mathopen{}\left(f\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">FALSE without a proof is refused, whatever else is set.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_gate-sourced_without_a_doi_is_refused">
<p class="thm-label"><strong>Theorem 241</strong> (<code>sourced_without_a_doi_is_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_sourced_without_a_doi_is_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>ok</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>ok f = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ok}\mathopen{}\left(f\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">SOURCED without a DOI certificate is refused.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_gate-unknown_with_a_certificate_is_refused">
<p class="thm-label"><strong>Theorem 242</strong> (<code>unknown_with_a_certificate_is_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_unknown_with_a_certificate_is_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>ok</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>ok f = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ok}\mathopen{}\left(f\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">UNKNOWN that carries a certificate is refused.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_gate-unknown_without_a_blocking_step_is_refused">
<p class="thm-label"><strong>Theorem 243</strong> (<code>unknown_without_a_blocking_step_is_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_unknown_without_a_blocking_step_is_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>ok</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>ok f = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ok}\mathopen{}\left(f\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">UNKNOWN without a blocking step is refused.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-answer_gate-unchecked_is_refused">
<p class="thm-label"><strong>Theorem 244</strong> (<code>unchecked_is_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_answergate_unchecked_is_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>ok</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>ok f = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ok}\mathopen{}\left(f\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">An answer that names no checker is refused, whatever its value.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  unfold</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
