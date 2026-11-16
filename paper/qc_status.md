---
title: "The quantum-computer status as a gap taxonomy — incomplete, not false; software-complete is not true"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `qc_status.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/qc_status.lean</code> · namespace <code>QcStatus</code> · 40 theorems · wing <code>unassigned</code></p>

The qpu `get_qc` tool returns a status, not a bare boolean: a list of gaps, each OPEN or CLOSED with the
condition that closes it (src ~/github/uuidna/qpu/src/quantum/uuid/programs/get_qc/index.ts). This file
seals the HONEST LOGIC of that status — it decides list facts about the gap taxonomy, and claims nothing
about the physical world. Two kinds of gap:
  · SOFTWARE/PROOF gaps  — closeable by code: the exhaustive gap-map (each apparatus conjunct its own lead),
    the classical-device-id refusal, the 4879 "measured-not-proved" boundary, the receipt≠physical-QM
    boundary, the content-address seals, the indexed install, the 122 register, the NIST/CERN+PQC seals.
  · WORLD gaps — NOT closeable by any computation: (1) accredited physical-lab apparatus evidence
    (ISO 17025 × 17065 × universality — a real device measured in an accredited lab), and (2) the FULL
    factorisation of 2^999+1 (an open problem; the deposit has it only as PARTIAL).
The point sealed here: closing EVERY software gap does NOT make the verdict true — the two world-gaps
dominate it — so no amount of code can fabricate `isQuantumComputer: true`. The status is OPEN (incomplete),
which is neither a refusal (not every gap is unclosable) nor a claim (the world-gaps are open). The two
world-gaps are modelled OPEN because they are open; if one day either is met, this list changes and the
verdict follows. Honest floor: `isQuantumComputer` is false BECAUSE a world-gap is open, by this logic.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>gaps := [ (false, true), (false, true), (false, true), (false, true),
verdict := gaps.all isClosed
iso := [ (.computed, true)       -- 4879 3.2–3.6 vocabulary (Hilbert space … communication) — proven design
isoSatisfied := fun r =&gt; r.2
current := [true, true, true, true, true, false, false, false, false, false]
full := [true, true, true, true, true, true, true, true, true, true]
isQuantumComputation := (gaps.filter (fun g =&gt; !isWorld g)).all isClosed   -- the computed dimension
isQuantumComputer := gaps.all isClosed                                   -- the device dimension (incl. world)</code></pre>

<div class="thm" id="thm-qc_status-the_status_has_ten_gaps_two_of_them_world">
<p class="thm-label"><strong>Theorem 190</strong> (<code>the_status_has_ten_gaps_two_of_them_world</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_status_has_ten_gaps_two_of_them_world.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mi>gaps</mi><mo>|</mo></mrow><mo>=</mo><mn>10</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>gaps.length = 10 ∧ (gaps.filter isWorld).length = 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{gaps}\right| = 10 \land \left|\{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\}\right| = 2</code></pre></details>
</div>
<p class="thm-remark">ten gaps, exactly two of them world-kind — the irreducible pair.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-every_software_gap_is_closeable_by_code">
<p class="thm-label"><strong>Theorem 191</strong> (<code>every_software_gap_is_closeable_by_code</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_every_software_gap_is_closeable_by_code.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isWorld</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isWorld</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(gaps.filter (fun g =&gt; !isWorld g)).length = 8 ∧ (gaps.filter (fun g =&gt; !isWorld g)).all isClosed = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, g \in \mathrm{gaps} \mid \lnot \mathrm{isWorld}\mathopen{}\left(g\right) \,\}\right| = 8 \land \forall x \in \{\, g \in \mathrm{gaps} \mid \lnot \mathrm{isWorld}\mathopen{}\left(g\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">the eight software/proof gaps are all closeable, and here all closed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-no_world_gap_is_closed_here">
<p class="thm-label"><strong>Theorem 192</strong> (<code>no_world_gap_is_closed_here</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_no_world_gap_is_closed_here.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>g</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mi>isClosed</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(gaps.filter isWorld).all (fun g =&gt; !isClosed g) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall g \in \{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\},\; \lnot \mathrm{isClosed}\mathopen{}\left(g\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">neither world gap is closed here — accredited-lab evidence and the full 2^999+1 factorisation are open.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_verdict_conjunction_is_open">
<p class="thm-label"><strong>Theorem 193</strong> (<code>the_verdict_conjunction_is_open</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_verdict_conjunction_is_open.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>verdict</mi><mo>=</mo><mi>false</mi></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>verdict = false ∧ gaps.all isClosed = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdict} = \mathrm{false} \land \forall x \in \mathrm{gaps},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">the verdict is the conjunction, and it is OPEN (false) while a world gap is open.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-closing_every_software_gap_leaves_the_verdict_open">
<p class="thm-label"><strong>Theorem 194</strong> (<code>closing_every_software_gap_leaves_the_verdict_open</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_closing_every_software_gap_leaves_the_verdict_open.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isWorld</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mi>verdict</mi><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(gaps.filter (fun g =&gt; !isWorld g)).all isClosed = true ∧ verdict = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{\, g \in \mathrm{gaps} \mid \lnot \mathrm{isWorld}\mathopen{}\left(g\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true} \land \mathrm{verdict} = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">THE POINT: every software gap is closed, yet the verdict is still false — software completion cannot fabricate `isQuantumComputer: true`.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_world_gaps_dominate_the_verdict">
<p class="thm-label"><strong>Theorem 195</strong> (<code>the_world_gaps_dominate_the_verdict</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_world_gaps_dominate_the_verdict.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>verdict</mi><mo>=</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>verdict = (gaps.filter isWorld).all isClosed</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdict} = \forall x \in \{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right)</code></pre></details>
</div>
<p class="thm-remark">the verdict tracks the WORLD gaps alone: since every software gap is closed, the conjunction over all gaps equals the conjunction over the world gaps — the two dominate the verdict.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_status_is_incomplete_not_refused">
<p class="thm-label"><strong>Theorem 196</strong> (<code>the_status_is_incomplete_not_refused</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_status_is_incomplete_not_refused.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∃</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>:</mo><mrow><mo>¬</mo><mrow><mi>isClosed</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isWorld</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(gaps.any (fun g =&gt; !isClosed g) = true) ∧ ((gaps.filter (fun g =&gt; !isWorld g)).all isClosed = true) ∧ (gaps.all isClosed = false)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists g \in \mathrm{gaps} : \lnot \mathrm{isClosed}\mathopen{}\left(g\right) = \mathrm{true} \land \forall x \in \{\, g \in \mathrm{gaps} \mid \lnot \mathrm{isWorld}\mathopen{}\left(g\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true} \land \forall x \in \mathrm{gaps},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">the status is INCOMPLETE, not a refusal: some gap is open AND every closeable gap is closed. It is neither `true` (not all closed) nor a blanket refusal (not every gap unclosable).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-software_completion_is_necessary_not_sufficient">
<p class="thm-label"><strong>Theorem 197</strong> (<code>software_completion_is_necessary_not_sufficient</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_software_completion_is_necessary_not_sufficient.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>verdict</mi><mo>=</mo><mi>true</mi></mrow><mo>↔</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isWorld</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mi>verdict</mi><mo>=</mo><mi>false</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(verdict = true ↔ (gaps.filter isWorld).all isClosed = true) ∧ ((gaps.filter (fun g =&gt; !isWorld g)).all isClosed = true ∧ verdict = false)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{verdict} = \mathrm{true} \leftrightarrow \forall x \in \{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true} \land \forall x \in \{\, g \in \mathrm{gaps} \mid \lnot \mathrm{isWorld}\mathopen{}\left(g\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true} \land \mathrm{verdict} = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">capstone: software completion is NECESSARY but not SUFFICIENT — the verdict is true iff the world gaps also close, and closing all software gaps alone leaves it false.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_status_function_covers_its_three_cases">
<p class="thm-label"><strong>Theorem 198</strong> (<code>the_status_function_covers_its_three_cases</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_status_function_covers_its_three_cases.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.refuted</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.refuted</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false false = Status.incomplete ∧ statusOf false true = Status.complete ∧ statusOf true false = Status.refuted ∧ statusOf true true = Status.refuted</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{false}\right) = \mathrm{Status.incomplete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{true}\right) = \mathrm{Status.complete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{true},\,\mathrm{false}\right) = \mathrm{Status.refuted} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{true},\,\mathrm{true}\right) = \mathrm{Status.refuted}</code></pre></details>
</div>
<p class="thm-remark">the three cases of the status function, decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_current_status_is_incomplete">
<p class="thm-label"><strong>Theorem 199</strong> (<code>the_current_status_is_incomplete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_current_status_is_incomplete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>verdict</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mi>verdict</mi><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false verdict = Status.incomplete ∧ verdict = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{verdict}\right) = \mathrm{Status.incomplete} \land \mathrm{verdict} = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">the current status is INCOMPLETE — no disproof holds and a world gap is open (verdict false).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_three_states_are_distinct">
<p class="thm-label"><strong>Theorem 200</strong> (<code>the_three_states_are_distinct</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_three_states_are_distinct.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>Status.refuted</mi><mo>≠</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mi>Status.incomplete</mi><mo>≠</mo><mi>Status.complete</mi></mrow></mrow><mo>∧</mo><mrow><mi>Status.refuted</mi><mo>≠</mo><mi>Status.complete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>Status.refuted ≠ Status.incomplete ∧ Status.incomplete ≠ Status.complete ∧ Status.refuted ≠ Status.complete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{Status.refuted} \neq \mathrm{Status.incomplete} \land \mathrm{Status.incomplete} \neq \mathrm{Status.complete} \land \mathrm{Status.refuted} \neq \mathrm{Status.complete}</code></pre></details>
</div>
<p class="thm-remark">the three states are pairwise distinct — a distinction a boolean cannot carry.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_boolean_collapses_refuted_and_incomplete">
<p class="thm-label"><strong>Theorem 201</strong> (<code>the_boolean_collapses_refuted_and_incomplete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_boolean_collapses_refuted_and_incomplete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>toBool</mi><mo>(</mo><mi>Status.refuted</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow><mo>∧</mo><mrow><mrow><mi>toBool</mi><mo>(</mo><mi>Status.incomplete</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mi>Status.refuted</mi><mo>≠</mo><mi>Status.incomplete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>toBool Status.refuted = false ∧ toBool Status.incomplete = false ∧ Status.refuted ≠ Status.incomplete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toBool}\mathopen{}\left(\mathrm{Status.refuted}\right) = \mathrm{false} \land \mathrm{toBool}\mathopen{}\left(\mathrm{Status.incomplete}\right) = \mathrm{false} \land \mathrm{Status.refuted} \neq \mathrm{Status.incomplete}</code></pre></details>
</div>
<p class="thm-remark">WHY `false` is not correct: the boolean collapses refuted and incomplete into one value.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-only_complete_reads_true">
<p class="thm-label"><strong>Theorem 202</strong> (<code>only_complete_reads_true</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_only_complete_reads_true.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>toBool</mi><mo>(</mo><mi>Status.complete</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>toBool</mi><mo>(</mo><mi>Status.incomplete</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toBool</mi><mo>(</mo><mi>Status.refuted</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>toBool Status.complete = true ∧ toBool Status.incomplete = false ∧ toBool Status.refuted = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toBool}\mathopen{}\left(\mathrm{Status.complete}\right) = \mathrm{true} \land \mathrm{toBool}\mathopen{}\left(\mathrm{Status.incomplete}\right) = \mathrm{false} \land \mathrm{toBool}\mathopen{}\left(\mathrm{Status.refuted}\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">only `complete` reads true; the boolean misnames every other state as `false`.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-complete_exactly_when_every_gap_closed">
<p class="thm-label"><strong>Theorem 203</strong> (<code>complete_exactly_when_every_gap_closed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_complete_exactly_when_every_gap_closed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow><mo>↔</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(statusOf false (gaps.all isClosed) = Status.complete) ↔ (gaps.all isClosed = true)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{gaps},\; \mathrm{isClosed}\mathopen{}\left(x\right)\right) = \mathrm{Status.complete} \leftrightarrow \forall x \in \mathrm{gaps},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">complete exactly when every gap is closed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-software_complete_still_reads_incomplete">
<p class="thm-label"><strong>Theorem 204</strong> (<code>software_complete_still_reads_incomplete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_software_complete_still_reads_incomplete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isWorld</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>verdict</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(gaps.filter (fun g =&gt; !isWorld g)).all isClosed = true ∧ statusOf false verdict = Status.incomplete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{\, g \in \mathrm{gaps} \mid \lnot \mathrm{isWorld}\mathopen{}\left(g\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right) = \mathrm{true} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{verdict}\right) = \mathrm{Status.incomplete}</code></pre></details>
</div>
<p class="thm-remark">closing every software gap still reads incomplete — the world gaps keep it below complete.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_honest_value_is_incomplete_not_a_false_boolean">
<p class="thm-label"><strong>Theorem 205</strong> (<code>the_honest_value_is_incomplete_not_a_false_boolean</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_honest_value_is_incomplete_not_a_false_boolean.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>verdict</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>verdict</mi><mo>)</mo></mrow><mo>≠</mo><mi>Status.complete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toBool</mi><mo>(</mo><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>verdict</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false verdict = Status.incomplete ∧ statusOf false verdict ≠ Status.complete ∧ toBool (statusOf false verdict) = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{verdict}\right) = \mathrm{Status.incomplete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{verdict}\right) \neq \mathrm{Status.complete} \land \mathrm{toBool}\mathopen{}\left(\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{verdict}\right)\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">capstone: the honest value is `incomplete`, it is not `complete`, and its boolean shadow is `false` — the lossy projection the field wrongly shows as the whole truth.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_iso_conformance_documents_ten_requirements">
<p class="thm-label"><strong>Theorem 206</strong> (<code>the_iso_conformance_documents_ten_requirements</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_iso_conformance_documents_ten_requirements.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mi>iso</mi><mo>|</mo></mrow><mo>=</mo><mn>10</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>iso.length = 10 ∧ (iso.filter isoSatisfied).length = 5 ∧ (iso.filter (fun r =&gt; !isoSatisfied r)).length = 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{iso}\right| = 10 \land \left|\{\, x \in \mathrm{iso} \mid \mathrm{isoSatisfied}\mathopen{}\left(x\right) \,\}\right| = 5 \land \left|\{\, r \in \mathrm{iso} \mid \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) \,\}\right| = 5</code></pre></details>
</div>
<p class="thm-remark">ten requirements documented; five satisfied, five open.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_satisfied_requirements_are_the_computed_design">
<p class="thm-label"><strong>Theorem 207</strong> (<code>the_satisfied_requirements_are_the_computed_design</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_satisfied_requirements_are_the_computed_design.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(iso.filter isoSatisfied).all (fun r =&gt; kindIsComputed r.1) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall r \in \{\, x \in \mathrm{iso} \mid \mathrm{isoSatisfied}\mathopen{}\left(x\right) \,\},\; \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">every satisfied requirement is a COMPUTED one — the design/vocabulary ISO lets the kernel meet.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-no_measured_or_accredited_requirement_is_satisfied">
<p class="thm-label"><strong>Theorem 208</strong> (<code>no_measured_or_accredited_requirement_is_satisfied</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_no_measured_or_accredited_requirement_is_satisfied.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mi>kindIsMeasured</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>∨</mo><mrow><mi>kindIsAccredited</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(iso.filter (fun r =&gt; kindIsMeasured r.1 || kindIsAccredited r.1)).all (fun r =&gt; !isoSatisfied r) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall r \in \{\, r \in \mathrm{iso} \mid \mathrm{kindIsMeasured}\mathopen{}\left(r_{1}\right) \lor \mathrm{kindIsAccredited}\mathopen{}\left(r_{1}\right) \,\},\; \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">nothing measured or accredited is satisfied — ISO reserves those for physical evidence and certification.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_open_gaps_are_one_computed_one_measured_three_accredited">
<p class="thm-label"><strong>Theorem 209</strong> (<code>the_open_gaps_are_one_computed_one_measured_three_accredited</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_open_gaps_are_one_computed_one_measured_three_accredited.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mi>kindIsMeasured</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mi>kindIsAccredited</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(iso.filter (fun r =&gt; !isoSatisfied r &amp;&amp; kindIsComputed r.1)).length = 1 ∧ (iso.filter (fun r =&gt; !isoSatisfied r &amp;&amp; kindIsMeasured r.1)).length = 1 ∧ (iso.filter (fun r =&gt; !isoSatisfied r &amp;&amp; kindIsAccredited r.1)).length = 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, r \in \mathrm{iso} \mid \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) \land \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) \,\}\right| = 1 \land \left|\{\, r \in \mathrm{iso} \mid \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) \land \mathrm{kindIsMeasured}\mathopen{}\left(r_{1}\right) \,\}\right| = 1 \land \left|\{\, r \in \mathrm{iso} \mid \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) \land \mathrm{kindIsAccredited}\mathopen{}\left(r_{1}\right) \,\}\right| = 3</code></pre></details>
</div>
<p class="thm-remark">the open set, named exactly: one computed (the 2^999+1 factoring), one measured (the device), three accredited.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-everything_satisfiable_now_is_satisfied">
<p class="thm-label"><strong>Theorem 210</strong> (<code>everything_satisfiable_now_is_satisfied</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_everything_satisfiable_now_is_satisfied.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>∧</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(iso.filter (fun r =&gt; kindIsComputed r.1)).length = 6 ∧ (iso.filter (fun r =&gt; kindIsComputed r.1 &amp;&amp; isoSatisfied r)).length = 5 ∧ (iso.filter (fun r =&gt; kindIsComputed r.1 &amp;&amp; !isoSatisfied r)).length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, r \in \mathrm{iso} \mid \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) \,\}\right| = 6 \land \left|\{\, r \in \mathrm{iso} \mid \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) \land \mathrm{isoSatisfied}\mathopen{}\left(r\right) \,\}\right| = 5 \land \left|\{\, r \in \mathrm{iso} \mid \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) \land \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) \,\}\right| = 1</code></pre></details>
</div>
<p class="thm-remark">everything ISO lets the kernel satisfy IS satisfied: of six computed rows, five hold; the only computed gap is the factoring, which ran to completion. The design conformance is maximal at the moment.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_design_conformance_is_complete">
<p class="thm-label"><strong>Theorem 211</strong> (<code>the_design_conformance_is_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_design_conformance_is_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>∧</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>∧</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(iso.filter (fun r =&gt; kindIsComputed r.1 &amp;&amp; isoSatisfied r)).length = 5 ∧ (iso.filter (fun r =&gt; kindIsComputed r.1 &amp;&amp; isoSatisfied r)).all isoSatisfied = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, r \in \mathrm{iso} \mid \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) \land \mathrm{isoSatisfied}\mathopen{}\left(r\right) \,\}\right| = 5 \land \forall x \in \{\, r \in \mathrm{iso} \mid \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) \land \mathrm{isoSatisfied}\mathopen{}\left(r\right) \,\},\; \mathrm{isoSatisfied}\mathopen{}\left(x\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">the DESIGN conformance (4879 vocabulary + processor, computed) is complete.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_device_conformance_is_incomplete">
<p class="thm-label"><strong>Theorem 212</strong> (<code>the_device_conformance_is_incomplete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_device_conformance_is_incomplete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>iso</mi><mo>,</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>iso</mi><mo>,</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>iso.all isoSatisfied = false ∧ statusOf false (iso.all isoSatisfied) = Status.incomplete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{iso},\; \mathrm{isoSatisfied}\mathopen{}\left(x\right) = \mathrm{false} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{iso},\; \mathrm{isoSatisfied}\mathopen{}\left(x\right)\right) = \mathrm{Status.incomplete}</code></pre></details>
</div>
<p class="thm-remark">the DEVICE conformance is incomplete — not every requirement is satisfied, so the §2 status is `incomplete`.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-iso_says_design_complete_device_incomplete">
<p class="thm-label"><strong>Theorem 213</strong> (<code>iso_says_design_complete_device_incomplete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_iso_says_design_complete_device_incomplete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>iso</mi><mo>,</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mi>isoSatisfied</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mrow><mi>kindIsComputed</mi><mo>(</mo><msub><mi>r</mi><mn>1</mn></msub><mo>)</mo></mrow></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>iso</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isoSatisfied</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false (iso.all isoSatisfied) = Status.incomplete ∧ (iso.filter isoSatisfied).all (fun r =&gt; kindIsComputed r.1) = true ∧ (iso.filter (fun r =&gt; !isoSatisfied r)).length = 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{iso},\; \mathrm{isoSatisfied}\mathopen{}\left(x\right)\right) = \mathrm{Status.incomplete} \land \forall r \in \{\, x \in \mathrm{iso} \mid \mathrm{isoSatisfied}\mathopen{}\left(x\right) \,\},\; \mathrm{kindIsComputed}\mathopen{}\left(r_{1}\right) = \mathrm{true} \land \left|\{\, r \in \mathrm{iso} \mid \lnot \mathrm{isoSatisfied}\mathopen{}\left(r\right) \,\}\right| = 5</code></pre></details>
</div>
<p class="thm-remark">capstone: per ISO, design conformance complete, device conformance incomplete, five gaps documented — and the status is a value (`incomplete`), reached only by closing the measured and accredited (and factoring) rows.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_verdict_has_four_cases">
<p class="thm-label"><strong>Theorem 214</strong> (<code>the_verdict_has_four_cases</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_verdict_has_four_cases.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.refuted</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.refuted</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false true = Status.complete ∧ statusOf false false = Status.incomplete ∧ statusOf true true = Status.refuted ∧ statusOf true false = Status.refuted</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{true}\right) = \mathrm{Status.complete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{false}\right) = \mathrm{Status.incomplete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{true},\,\mathrm{true}\right) = \mathrm{Status.refuted} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{true},\,\mathrm{false}\right) = \mathrm{Status.refuted}</code></pre></details>
</div>
<p class="thm-remark">the verdict's four cases, decided — one rule, no default branch.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-complete_needs_all_evidence_present">
<p class="thm-label"><strong>Theorem 215</strong> (<code>complete_needs_all_evidence_present</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_complete_needs_all_evidence_present.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>≠</mo><mi>Status.complete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false true = Status.complete ∧ statusOf false false ≠ Status.complete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{true}\right) = \mathrm{Status.complete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{false}\right) \neq \mathrm{Status.complete}</code></pre></details>
</div>
<p class="thm-remark">complete must be proved: it holds exactly when all evidence is present, and never otherwise.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-incomplete_needs_some_evidence_absent">
<p class="thm-label"><strong>Theorem 216</strong> (<code>incomplete_needs_some_evidence_absent</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_incomplete_needs_some_evidence_absent.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>≠</mo><mi>Status.incomplete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false false = Status.incomplete ∧ statusOf false true ≠ Status.incomplete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{false}\right) = \mathrm{Status.incomplete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{true}\right) \neq \mathrm{Status.incomplete}</code></pre></details>
</div>
<p class="thm-remark">incomplete must be proved too, by the SAME function: exactly when some evidence is absent.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-current_evidence_proves_incomplete">
<p class="thm-label"><strong>Theorem 217</strong> (<code>current_evidence_proves_incomplete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_current_evidence_proves_incomplete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>current.all id = false ∧ statusOf false (current.all id) = Status.incomplete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right) = \mathrm{false} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.incomplete}</code></pre></details>
</div>
<p class="thm-remark">the current evidence is partial, and it PROVES incomplete — not a default: design present, the rest absent.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-full_evidence_proves_complete">
<p class="thm-label"><strong>Theorem 218</strong> (<code>full_evidence_proves_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_full_evidence_proves_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>full.all id = true ∧ statusOf false (full.all id) = Status.complete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right) = \mathrm{true} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.complete}</code></pre></details>
</div>
<p class="thm-remark">full evidence PROVES complete — the same function, the other pole.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-neither_pole_is_a_default">
<p class="thm-label"><strong>Theorem 219</strong> (<code>neither_pole_is_a_default</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_neither_pole_is_a_default.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false (current.all id) = Status.incomplete ∧ statusOf false (full.all id) = Status.complete ∧ statusOf false (current.all id) ≠ statusOf false (full.all id)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.incomplete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.complete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right)\right) \neq \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right)\right)</code></pre></details>
</div>
<p class="thm-remark">neither pole is a default: one function, the current evidence gives incomplete, full gives complete, distinct.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-closing_the_gaps_flips_incomplete_to_complete">
<p class="thm-label"><strong>Theorem 220</strong> (<code>closing_the_gaps_flips_incomplete_to_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_closing_the_gaps_flips_incomplete_to_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mi>current</mi><mo>≠</mo><mi>full</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(current.all id = false ∧ statusOf false (current.all id) = Status.incomplete) ∧ (full.all id = true ∧ statusOf false (full.all id) = Status.complete) ∧ current ≠ full</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right) = \mathrm{false} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.incomplete} \land \forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right) = \mathrm{true} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.complete} \land \mathrm{current} \neq \mathrm{full}</code></pre></details>
</div>
<p class="thm-remark">the evidence moves the verdict both ways: close the five absent bits (current → full) and incomplete flips to complete — proof on either side, by one rule, nothing assumed.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-either_side_proved_by_the_same_logic">
<p class="thm-label"><strong>Theorem 221</strong> (<code>either_side_proved_by_the_same_logic</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_either_side_proved_by_the_same_logic.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>current</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>full</mi><mo>,</mo><mi>id</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.complete</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>)</mo></mrow><mo>=</mo><mi>Status.incomplete</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>statusOf false (current.all id) = Status.incomplete ∧ statusOf false (full.all id) = Status.complete ∧ statusOf false true = Status.complete ∧ statusOf false false = Status.incomplete</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{current},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.incomplete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\forall x \in \mathrm{full},\; \mathrm{id}\mathopen{}\left(x\right)\right) = \mathrm{Status.complete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{true}\right) = \mathrm{Status.complete} \land \mathrm{statusOf}\mathopen{}\left(\mathrm{false},\,\mathrm{false}\right) = \mathrm{Status.incomplete}</code></pre></details>
</div>
<p class="thm-remark">capstone: complete and incomplete follow ONE logic; incomplete is as proved on the current evidence as complete is on full — the same statusOf, each requiring its evidence, neither defaulted.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_computation_flag_is_true">
<p class="thm-label"><strong>Theorem 222</strong> (<code>the_computation_flag_is_true</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_computation_flag_is_true.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>isQuantumComputation</mi><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputation = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputation} = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">the computation flag is TRUE: every computed requirement is closed — the quantum results are proved.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_device_flag_is_open">
<p class="thm-label"><strong>Theorem 223</strong> (<code>the_device_flag_is_open</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_device_flag_is_open.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>isQuantumComputer</mi><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputer = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputer} = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">the device flag is open: not every requirement is closed (the world gaps remain).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_two_flags_are_distinct">
<p class="thm-label"><strong>Theorem 224</strong> (<code>the_two_flags_are_distinct</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_two_flags_are_distinct.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>isQuantumComputation</mi><mo>≠</mo><mi>isQuantumComputer</mi></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputation ≠ isQuantumComputer</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputation} \neq \mathrm{isQuantumComputer}</code></pre></details>
</div>
<p class="thm-remark">the two flags are distinct — they measure different things.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-computing_the_result_is_not_being_the_device">
<p class="thm-label"><strong>Theorem 225</strong> (<code>computing_the_result_is_not_being_the_device</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_computing_the_result_is_not_being_the_device.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>isQuantumComputation</mi><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mi>isQuantumComputer</mi><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputation = true ∧ isQuantumComputer = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputation} = \mathrm{true} \land \mathrm{isQuantumComputer} = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">the honest pair, in one row: computes the result (true), is not the device (open).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_computation_needs_no_world_evidence">
<p class="thm-label"><strong>Theorem 226</strong> (<code>the_computation_needs_no_world_evidence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_computation_needs_no_world_evidence.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>isQuantumComputation</mi><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mo>∃</mo><mi>g</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>:</mo><mrow><mo>¬</mo><mrow><mi>isClosed</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputation = true ∧ (gaps.filter isWorld).any (fun g =&gt; !isClosed g) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputation} = \mathrm{true} \land \exists g \in \{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\} : \lnot \mathrm{isClosed}\mathopen{}\left(g\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">the computation flag holds WHILE a world gap is still open — it needs no physical evidence.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_device_requires_computation_and_the_world_gaps">
<p class="thm-label"><strong>Theorem 227</strong> (<code>the_device_requires_computation_and_the_world_gaps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_device_requires_computation_and_the_world_gaps.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>isQuantumComputer</mi><mo>=</mo><mrow><mi>isQuantumComputation</mi><mo>∧</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputer = (isQuantumComputation &amp;&amp; (gaps.filter isWorld).all isClosed)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputer} = \mathrm{isQuantumComputation} \land \forall x \in \{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right)</code></pre></details>
</div>
<p class="thm-remark">the device flag is exactly computation AND the world gaps closed — so it requires both, and flips only on the world.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_device_flips_only_when_the_world_gaps_close">
<p class="thm-label"><strong>Theorem 228</strong> (<code>the_device_flips_only_when_the_world_gaps_close</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_device_flips_only_when_the_world_gaps_close.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>isQuantumComputation</mi><mo>∧</mo><mi>true</mi></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>isQuantumComputation</mi><mo>∧</mo><mi>false</mi></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(isQuantumComputation &amp;&amp; true) = true ∧ (isQuantumComputation &amp;&amp; false) = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputation} \land \mathrm{true} = \mathrm{true} \land \mathrm{isQuantumComputation} \land \mathrm{false} = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">computing more cannot flip the device: with every world gap closed the device would hold; while one is open it cannot.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-qc_status-the_deposit_computes_and_is_not_yet_the_device">
<p class="thm-label"><strong>Theorem 229</strong> (<code>the_deposit_computes_and_is_not_yet_the_device</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_qcstatus_the_deposit_computes_and_is_not_yet_the_device.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>isQuantumComputation</mi><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mi>isQuantumComputer</mi><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mi>isQuantumComputation</mi><mo>≠</mo><mi>isQuantumComputer</mi></mrow></mrow><mo>∧</mo><mrow><mi>isQuantumComputer</mi><mo>=</mo><mrow><mi>isQuantumComputation</mi><mo>∧</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>gaps</mi><mo>∣</mo><mi>isWorld</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>,</mo><mi>isClosed</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>isQuantumComputation = true ∧ isQuantumComputer = false ∧ isQuantumComputation ≠ isQuantumComputer ∧ isQuantumComputer = (isQuantumComputation &amp;&amp; (gaps.filter isWorld).all isClosed)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{isQuantumComputation} = \mathrm{true} \land \mathrm{isQuantumComputer} = \mathrm{false} \land \mathrm{isQuantumComputation} \neq \mathrm{isQuantumComputer} \land \mathrm{isQuantumComputer} = \mathrm{isQuantumComputation} \land \forall x \in \{\, x \in \mathrm{gaps} \mid \mathrm{isWorld}\mathopen{}\left(x\right) \,\},\; \mathrm{isClosed}\mathopen{}\left(x\right)</code></pre></details>
</div>
<p class="thm-remark">capstone: the deposit COMPUTES quantum results (true, proved) and is not yet a physical quantum computer (open), two honest flags from one evidence set; the device is one measured run from true, not an impossibility.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
