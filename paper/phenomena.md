---
title: "Every phenomenon this deposit touches, and the rule for the rest"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `phenomena.lean`

<p class="paper-src"><code>src/iso/9001-governance/phenomena.lean</code> · namespace <code>Phenomena</code> · 4 theorems · wing <code>the floor</code></p>

ADDRESSING PHENOMENA WITHOUT CLAIMING ANY.

Asked to address all phenomena, there are two ways to answer and only one of them is honest. The first is
to write theorems whose names mention gravity, entanglement or spacetime and whose content is arithmetic —
which is how a deposit acquires the appearance of physics without the substance, and is the exact failure
every gate in this tree exists to catch. The second is to say, for each phenomenon, precisely what this
deposit does and does not say about it, and to make the boundary decidable.

This file does the second. A phenomenon enters under one of two statuses and no other:

  0 — DEFINITIONAL. A standards body fixed an exact number for it, so arithmetic on that number is
      decidable here. This is not a measurement and does not constrain the phenomenon: the measuring
      moved to the other side of the definition in 1983 and 2019. See light.lean.

  1 — NAMED PRIOR ART. A classical result with an earlier author, restated and credited. See energy.lean.


Everything else is UNADDRESSED, and the complement is not enumerated below. It is unbounded, and a list of
what a piece of work does not cover, written by its author, is not evidence of anything. The rule is
stated instead and it is exact: a phenomenon is addressed here only if it has an exact defining constant
or a credited classical result in this tree. Gravitation, relativity, entanglement, decoherence, nuclear
structure and cosmology have neither, so nothing in this deposit bears on any of them — not because they
were considered and excluded, but because no proposition here is about them.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>entries := [ (1, 0)   -- duration — the caesium-133 hyperfine transition frequency, exact</code></pre>

<div class="thm" id="thm-phenomena-every_phenomenon_is_definitional_or_credited">
<p class="thm-label"><strong>Theorem 443</strong> (<code>every_phenomenon_is_definitional_or_credited</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_phenomena_every_phenomenon_is_definitional_or_credited.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>entries</mi><mo>,</mo><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>∨</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>entries.all (fun e =&gt; statusOf e == 0 || statusOf e == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{entries},\; \mathrm{statusOf}\mathopen{}\left(e\right) = 0 \lor \mathrm{statusOf}\mathopen{}\left(e\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── THE TABLE IS CLOSED: every entry is definitional or credited, and nothing else ──────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-phenomena-seven_definitional_and_two_credited">
<p class="thm-label"><strong>Theorem 444</strong> (<code>seven_definitional_and_two_credited</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_phenomena_seven_definitional_and_two_credited.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>entries</mi><mo>∣</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>entries</mi><mo>∣</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>entries</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(entries.filter (fun e =&gt; statusOf e == 0)).length = 7 ∧ (entries.filter (fun e =&gt; statusOf e == 1)).length = 2 ∧ entries.length = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, e \in \mathrm{entries} \mid \mathrm{statusOf}\mathopen{}\left(e\right) = 0 \,\}\right| = 7 \land \left|\{\, e \in \mathrm{entries} \mid \mathrm{statusOf}\mathopen{}\left(e\right) = 1 \,\}\right| = 2 \land \left|\mathrm{entries}\right| = 9</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-phenomena-the_definitional_half_is_the_whole_si">
<p class="thm-label"><strong>Theorem 445</strong> (<code>the_definitional_half_is_the_whole_si</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_phenomena_the_definitional_half_is_the_whole_si.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>entries</mi><mo>∣</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow></math></div>
<pre class="thm-statement"><code>(entries.filter (fun e =&gt; statusOf e == 0)).length = 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, e \in \mathrm{entries} \mid \mathrm{statusOf}\mathopen{}\left(e\right) = 0 \,\}\right| = 7</code></pre></details>
</div>
<p class="thm-remark">The seven definitional entries are the seven SI base quantities — the whole of what the SI fixes, so this half of the table is complete rather than selected.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-phenomena-the_table_is_closed_and_that_is_all_this_file_decides">
<p class="thm-label"><strong>Theorem 446</strong> (<code>the_table_is_closed_and_that_is_all_this_file_decides</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_phenomena_the_table_is_closed_and_that_is_all_this_file_decides.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>entries</mi><mo>,</mo><mrow><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>∨</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>entries</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>entries</mi><mo>∣</mo><mrow><mrow><mi>statusOf</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>entries.all (fun e =&gt; statusOf e == 0 || statusOf e == 1) ∧ entries.length = 9 ∧ (entries.filter (fun e =&gt; statusOf e == 0)).length = 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{entries},\; \mathrm{statusOf}\mathopen{}\left(e\right) = 0 \lor \mathrm{statusOf}\mathopen{}\left(e\right) = 1 \land \left|\mathrm{entries}\right| = 9 \land \left|\{\, e \in \mathrm{entries} \mid \mathrm{statusOf}\mathopen{}\left(e\right) = 0 \,\}\right| = 7</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
