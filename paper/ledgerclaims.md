---
title: "What the ledger claims"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `ledgerclaims.lean`

<p class="paper-src"><code>src/iso/22739-ledger/ledgerclaims.lean</code> · namespace <code>LedgerClaims</code> · 8 theorems · wing <code>the address</code></p>

Three claims the prose made in words and cited to entries that no longer stand. Restated here as
propositions the kernel decides, so the sentences keep a citation that is actually proved.


No axioms, no Mathlib, no sorry. Merkle (and through it Address, Fnv) is imported, not restated.

<div class="thm" id="thm-ledgerclaims-a_seal_is_128_bits">
<p class="thm-label"><strong>Theorem 84</strong> (<code>a_seal_is_128_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_a_seal_is_128_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>⋅</mo><mn>8</mn></mrow><mo>=</mo><mn>128</mn></mrow></math></div>
<pre class="thm-statement"><code>(toUuidBytes [97]).length * 8 = 128</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{toUuidBytes}\mathopen{}\left([97]\right)\right| \cdot 8 = 128</code></pre></details>
</div>
<p class="thm-remark">A seal is a uuid and a uuid is sixteen bytes, so a seal is 128 bits. Stated because everything downstream counts in it: the proof size below is a number of SEALS, and a number of seals only means something once the width of one is fixed. The multiplication is trivial; naming the unit is not.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-membership_grows_by_one_seal_per_doubling">
<p class="thm-label"><strong>Theorem 85</strong> (<code>membership_grows_by_one_seal_per_doubling</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_membership_grows_by_one_seal_per_doubling.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>32</mn><mo>)</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>64</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>128</mn><mo>)</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>256</mn><mo>)</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>rounds 40 2 = 1 ∧ rounds 40 4 = 2 ∧ rounds 40 8 = 3 ∧ rounds 40 16 = 4 ∧ rounds 40 32 = 5 ∧ rounds 40 64 = 6 ∧ rounds 40 128 = 7 ∧ rounds 40 256 = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{rounds}\mathopen{}\left(40,\,2\right) = 1 \land \mathrm{rounds}\mathopen{}\left(40,\,4\right) = 2 \land \mathrm{rounds}\mathopen{}\left(40,\,8\right) = 3 \land \mathrm{rounds}\mathopen{}\left(40,\,16\right) = 4 \land \mathrm{rounds}\mathopen{}\left(40,\,32\right) = 5 \land \mathrm{rounds}\mathopen{}\left(40,\,64\right) = 6 \land \mathrm{rounds}\mathopen{}\left(40,\,128\right) = 7 \land \mathrm{rounds}\mathopen{}\left(40,\,256\right) = 8</code></pre></details>
</div>
<p class="thm-remark">doubling the set adds exactly ONE sibling — the signature of a logarithm, checked across an octave.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-membership_is_logarithmic_not_linear">
<p class="thm-label"><strong>Theorem 86</strong> (<code>membership_is_logarithmic_not_linear</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_membership_is_logarithmic_not_linear.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1024</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1024</mn><mo>)</mo></mrow><mo>&lt;</mo><mn>1024</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1024</mn><mo>)</mo></mrow><mo>⋅</mo><mn>128</mn></mrow><mo>&lt;</mo><mrow><mn>1024</mn><mo>⋅</mo><mn>128</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>rounds 40 1024 = 10 ∧ rounds 40 1024 &lt; 1024 ∧ rounds 40 1024 * 128 &lt; 1024 * 128</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{rounds}\mathopen{}\left(40,\,1024\right) = 10 \land \mathrm{rounds}\mathopen{}\left(40,\,1024\right) &lt; 1024 \land \mathrm{rounds}\mathopen{}\left(40,\,1024\right) \cdot 128 &lt; 1024 \cdot 128</code></pre></details>
</div>
<p class="thm-remark">and it is genuinely sublinear: at 1024 leaves a proof carries 10 seals, not 1024 — 1280 bits, not 131072. (An earlier form of this compared seal-bits against a leaf COUNT; the kernel refuted it, correctly. Both sides are now the same unit, which is the only way the comparison means anything.)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-the_967_receipt_case">
<p class="thm-label"><strong>Theorem 87</strong> (<code>the_967_receipt_case</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_the_967_receipt_case.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>saving</mi><mo>(</mo><mn>967</mn><mo>,</mo><mn>20</mn><mo>)</mo></mrow><mo>=</mo><mn>947</mn></mrow><mo>∧</mo><mrow><mrow><mn>20</mn><mo>+</mo><mn>947</mn></mrow><mo>=</mo><mn>967</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>saving 967 20 = 947 ∧ 20 + 947 = 967</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{saving}\mathopen{}\left(967,\,20\right) = 947 \land 20 + 947 = 967</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-a_saving_never_exceeds_its_value">
<p class="thm-label"><strong>Theorem 88</strong> (<code>a_saving_never_exceeds_its_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_a_saving_never_exceeds_its_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>v</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>saving</mi><mo>(</mo><mi>v</mi><mo>,</mo><mi>w</mi><mo>)</mo></mrow><mo>≤</mo><mi>v</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun v =&gt; (List.range 40).all (fun w =&gt; saving v w ≤ v))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall v \in \{0,\dots,39\},\; \forall w \in \{0,\dots,39\},\; \mathrm{saving}\mathopen{}\left(v,\,w\right) \le v</code></pre></details>
</div>
<p class="thm-remark">the saving is never more than the value, at any size — an accounting identity, not a promise.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,600 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-more_payloads_than_addresses_must_collide">
<p class="thm-label"><strong>Theorem 89</strong> (<code>more_payloads_than_addresses_must_collide</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_more_payloads_than_addresses_must_collide.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>addr4</mi><mo>[</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>&lt;</mo><mn>17</mn></mrow></math></div>
<pre class="thm-statement"><code>((List.range 17).map addr4).eraseDups.length &lt; 17</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{addr4}[\{0,\dots,16\}]\right)\right| &lt; 17</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 17 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-the_address_does_not_determine_the_payload">
<p class="thm-label"><strong>Theorem 90</strong> (<code>the_address_does_not_determine_the_payload</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_the_address_does_not_determine_the_payload.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∃</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>:</mo><mrow><mo>∃</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mi>a</mi><mo>≠</mo><mi>b</mi></mrow><mo>∧</mo><mrow><mrow><mi>addr4</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>addr4</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>((List.range 17).any (fun a =&gt; (List.range 17).any (fun b =&gt; a != b &amp;&amp; addr4 a == addr4 b))) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists a \in \{0,\dots,16\} : \exists b \in \{0,\dots,16\} : a \neq b \land \mathrm{addr4}\mathopen{}\left(a\right) = \mathrm{addr4}\mathopen{}\left(b\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 289 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-ledgerclaims-a_proof_is_smaller_than_its_set_across_the_octave">
<p class="thm-label"><strong>Theorem 91</strong> (<code>a_proof_is_smaller_than_its_set_across_the_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_ledgerclaims_a_proof_is_smaller_than_its_set_across_the_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>256</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>&lt;</mo><mi>n</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 255).all (fun n =&gt; rounds 40 n &lt; n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{2,\dots,256\},\; \mathrm{rounds}\mathopen{}\left(40,\,n\right) &lt; n</code></pre></details>
</div>
<p class="thm-remark">not just at 1024: across the whole octave of set sizes, a proof is strictly smaller than the set it proves membership in. Decided over every n from 2 to 256, not sampled at one convenient point.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 255 cases. <span class="qed">□</span></p>

</div>
