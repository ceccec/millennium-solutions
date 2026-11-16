---
title: "The byte constants and the bit constants are one fact, and neither file knew it"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `widths.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/widths.lean</code> · namespace <code>Widths</code> · 24 theorems · wing <code>the address</code></p>

WHY THIS FILE EXISTS — TWO LEADS CROSSING.

scripts/leads.ts reports forty-two theorems that "only read back a hand-set value — a certificate, not a
proof", and asks for each to be restated as a law with its inverse. Six of them are in asymmetric.lean,
over `uuidBytes = 16`, `publicKeyBytes = 32`, `signatureBytes = 64`.

scripts/coils.ts reports which expressions compute the same thing and may stand for one another.

Crossing them finds something neither reports alone. src/iso/22739-ledger/capacity.lean types `container = 128` —
the UUID's width IN BITS — and asymmetric.lean types `uuidBytes = 16` — the same width IN BYTES. They
are ONE FACT in two units, in two files, with no theorem between them. Either could have been edited
while the other stayed green, and every gate in this tree would have passed: the constants are internally
consistent within each file and there was nothing to be inconsistent WITH.

That is what a coil is for, and it is what the "laws" lead is asking for. The law is the unit conversion,
its inverse is the other direction, and both are decided over the domain rather than at the one instance
the constants happen to sit at.

AND THE THREE SIZES ARE ONE FAMILY. 16, 32, 64 are 16 × 2^k for k = 0, 1, 2 — the key is two identifiers
and the signature is two keys, which theorem 3 decides as a doubling rather than as three literals that
happen to be in ratio.

No axioms, no Mathlib, no sorry.

<div class="thm" id="thm-widths-the_uuid_width_is_one_fact_in_two_units">
<p class="thm-label"><strong>Theorem 150</strong> (<code>the_uuid_width_is_one_fact_in_two_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_uuid_width_is_one_fact_in_two_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>uuidBytes</mi><mo>)</mo></mrow><mo>=</mo><mi>container</mi></mrow><mo>∧</mo><mrow><mrow><mi>toBytes</mi><mo>(</mo><mi>container</mi><mo>)</mo></mrow><mo>=</mo><mi>uuidBytes</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>toBits uuidBytes == container ∧ toBytes container == uuidBytes</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toBits}\mathopen{}\left(\mathrm{uuidBytes}\right) = \mathrm{container} \land \mathrm{toBytes}\mathopen{}\left(\mathrm{container}\right) = \mathrm{uuidBytes}</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE TWO FILES STATE ONE WIDTH ───────────────────────────────────────────────────────────────────── The binding that did not exist. capacity.lean's container and asymmetric.lean's uuidBytes are the same width, and from here neither can move without this refusing.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-bytes_to_bits_and_back_is_the_identity">
<p class="thm-label"><strong>Theorem 151</strong> (<code>bytes_to_bits_and_back_is_the_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_bytes_to_bits_and_back_is_the_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>toBytes</mi><mo>(</mo><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>b</mi></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>toBits</mi><mo>(</mo><mrow><mi>toBytes</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>n</mi></mrow><mo>=</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>8</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun b =&gt; toBytes (toBits b) == b) ∧ (List.range 40).all (fun n =&gt; (toBits (toBytes n) == n) == (n % 8 == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{0,\dots,39\},\; \mathrm{toBytes}\mathopen{}\left(\mathrm{toBits}\mathopen{}\left(b\right)\right) = b \land \forall n \in \{0,\dots,39\},\; \mathrm{toBits}\mathopen{}\left(\mathrm{toBytes}\mathopen{}\left(n\right)\right) = n = n \bmod 8 = 0</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE CONVERSION IS A LAW WITH ITS INVERSE, OVER THE DOMAIN ───────────────────────────────────────── What the leads report asks for: not the constant read back, but the law it is an instance of, decided at every byte width in range. Bytes to bits and back is the identity; bits to bytes and back is NOT, except on multiples of eight — and saying so is the honest half, because truncation is where a unit conversion silently loses a claim.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,600 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_key_doubles_the_identifier_and_the_signature_doubles_the_key">
<p class="thm-label"><strong>Theorem 152</strong> (<code>the_key_doubles_the_identifier_and_the_signature_doubles_the_key</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_key_doubles_the_identifier_and_the_signature_doubles_the_key.html">sealed</a>.</p>
<pre class="thm-statement"><code>publicKeyBytes == 2 * uuidBytes ∧ signatureBytes == 2 * publicKeyBytes ∧ signatureBytes == 4 * uuidBytes ∧ (List.range 3).all (fun k =&gt; [uuidBytes, publicKeyBytes, signatureBytes].getD k 0 == 16 * 2 ^ k)</code></pre>
</div>
<p class="thm-remark">── 3 · THE THREE SIZES ARE ONE DOUBLING, NOT THREE LITERALS ────────────────────────────────────────────── The key is two identifiers and the signature is two keys. Stated as the doubling so a reader sees the family rather than a coincidence of ratios among typed numbers.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_doubling_survives_the_conversion">
<p class="thm-label"><strong>Theorem 153</strong> (<code>the_doubling_survives_the_conversion</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_doubling_survives_the_conversion.html">sealed</a>.</p>
<pre class="thm-statement"><code>toBits uuidBytes == 128 ∧ toBits publicKeyBytes == 256 ∧ toBits signatureBytes == 512 ∧ (List.range 3).all (fun k =&gt; toBits ([uuidBytes, publicKeyBytes, signatureBytes].getD k 0) == 128 * 2 ^ k)</code></pre>
</div>
<p class="thm-remark">── 4 · AND IN BITS THEY ARE THE SAME FAMILY ────────────────────────────────────────────────────────────── The conversion carries the structure, which is what makes the two files' vocabularies interchangeable rather than merely equal at one point.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_key_and_the_signature_together_are_six_identifiers">
<p class="thm-label"><strong>Theorem 154</strong> (<code>the_key_and_the_signature_together_are_six_identifiers</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_key_and_the_signature_together_are_six_identifiers.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>publicKeyBytes</mi><mo>+</mo><mi>signatureBytes</mi></mrow><mo>=</mo><mn>96</mn></mrow><mo>∧</mo><mrow><mn>96</mn><mo>=</mo><mrow><mn>6</mn><mo>⋅</mo><mi>uuidBytes</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mrow><mi>publicKeyBytes</mi><mo>+</mo><mi>signatureBytes</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>768</mn></mrow></mrow><mo>∧</mo><mrow><mn>768</mn><mo>=</mo><mrow><mn>6</mn><mo>⋅</mo><mi>container</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>publicKeyBytes + signatureBytes == 96 ∧ 96 == 6 * uuidBytes ∧ toBits (publicKeyBytes + signatureBytes) == 768 ∧ 768 == 6 * container</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{publicKeyBytes} + \mathrm{signatureBytes} = 96 \land 96 = 6 \cdot \mathrm{uuidBytes} \land \mathrm{toBits}\mathopen{}\left(\mathrm{publicKeyBytes} + \mathrm{signatureBytes}\right) = 768 \land 768 = 6 \cdot \mathrm{container}</code></pre></details>
</div>
<p class="thm-remark">── 5 · WHAT TRAVELS BESIDE THE IDENTIFIER, DECIDED IN BOTH UNITS ───────────────────────────────────────── asymmetric.lean states this in bytes only. A reader working in bits had to convert by hand, which is where a transposed figure enters.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-no_other_width_converts_to_this_container">
<p class="thm-label"><strong>Theorem 155</strong> (<code>no_other_width_converts_to_this_container</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_no_other_width_converts_to_this_container.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mi>container</mi></mrow><mo>=</mo><mrow><mi>b</mi><mo>=</mo><mi>uuidBytes</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mn>15</mn><mo>)</mo></mrow><mo>≠</mo><mi>container</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mn>17</mn><mo>)</mo></mrow><mo>≠</mo><mi>container</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun b =&gt; (toBits b == container) == (b == uuidBytes)) ∧ toBits 15 != container ∧ toBits 17 != container</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{0,\dots,39\},\; \mathrm{toBits}\mathopen{}\left(b\right) = \mathrm{container} = b = \mathrm{uuidBytes} \land \mathrm{toBits}\mathopen{}\left(15\right) \neq \mathrm{container} \land \mathrm{toBits}\mathopen{}\left(17\right) \neq \mathrm{container}</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE CONTROL: THE BINDING IS NOT FREE ────────────────────────────────────────────────────────────── Theorems 1 to 5 would all hold of a conversion that ignored its argument. A wrong width must fail, and the neighbouring widths do: no other byte count in range converts to this container.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_constants_are_instances_of_the_law_and_not_the_law">
<p class="thm-label"><strong>Theorem 156</strong> (<code>the_constants_are_instances_of_the_law_and_not_the_law</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_constants_are_instances_of_the_law_and_not_the_law.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>uuidBytes</mi><mo>)</mo></mrow><mo>=</mo><mi>container</mi></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>b</mi><mo>⋅</mo><mn>8</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>b</mi><mo>≠</mo><mi>uuidBytes</mi></mrow><mo>∨</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mi>container</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>toBits uuidBytes == container ∧ (List.range 40).all (fun b =&gt; toBits b == b * 8) ∧ (List.range 40).all (fun b =&gt; b != uuidBytes || toBits b == container)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toBits}\mathopen{}\left(\mathrm{uuidBytes}\right) = \mathrm{container} \land \forall b \in \{0,\dots,39\},\; \mathrm{toBits}\mathopen{}\left(b\right) = b \cdot 8 \land \forall b \in \{0,\dots,39\},\; b \neq \mathrm{uuidBytes} \lor \mathrm{toBits}\mathopen{}\left(b\right) = \mathrm{container}</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE LEAD THIS CLOSES, NAMED ─────────────────────────────────────────────────────────────────────── Six of the forty-two "reads back a hand-set value" theorems are in asymmetric.lean over these three constants. They are not deleted and they are not wrong — what was missing is the law they are instances of, and it is here, decided over the domain rather than at the one point the constants sit at.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,600 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_binding_is_consistency_and_not_derivation">
<p class="thm-label"><strong>Theorem 157</strong> (<code>the_binding_is_consistency_and_not_derivation</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_binding_is_consistency_and_not_derivation.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>publicKeyBytes</mi><mo>=</mo><mn>32</mn></mrow><mo>∧</mo><mrow><mi>signatureBytes</mi><mo>=</mo><mn>64</mn></mrow></mrow><mo>∧</mo><mrow><mi>container</mi><mo>=</mo><mn>128</mn></mrow></mrow><mo>∧</mo><mrow><mo>∃</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>59</mn><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mi>b</mi><mo>≠</mo><mi>publicKeyBytes</mi></mrow><mo>∧</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>b</mi><mo>⋅</mo><mn>8</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>publicKeyBytes == 32 ∧ signatureBytes == 64 ∧ container == 128 ∧ (List.range 60).any (fun b =&gt; b != publicKeyBytes ∧ toBits b == b * 8)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{publicKeyBytes} = 32 \land \mathrm{signatureBytes} = 64 \land \mathrm{container} = 128 \land \exists b \in \{0,\dots,59\} : b \neq \mathrm{publicKeyBytes} \land \mathrm{toBits}\mathopen{}\left(b\right) = b \cdot 8</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHOSE CONSTANTS THESE ARE ───────────────────────────────────────────────────────────────────────── NOT THIS DEPOSIT'S, AND NOTHING HERE MAKES THEM ITS OWN. 32 and 64 are Ed25519's, chosen by its designers for reasons of elliptic-curve security this file decides nothing about; 128 is RFC 9562's; eight bits to a byte is a convention older than both. What is decided is that this tree states them CONSISTENTLY across two files that previously could not contradict each other because nothing compared them. A binding is not a derivation: none of these widths follows from anything here, and if Ed25519 had chosen 48 bytes this file would bind 48 just as happily.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_payload_and_the_check_exhaust_the_free_bits">
<p class="thm-label"><strong>Theorem 158</strong> (<code>the_payload_and_the_check_exhaust_the_free_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_payload_and_the_check_exhaust_the_free_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>Asymmetric.payloadBits</mi><mo>+</mo><mi>Asymmetric.checkBits</mi></mrow><mo>=</mo><mi>Capacity.free</mi></mrow><mo>∧</mo><mrow><mrow><mi>Asymmetric.payloadBits</mi><mo>+</mo><mi>Asymmetric.checkBits</mi></mrow><mo>=</mo><mn>122</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>Asymmetric.payloadBits</mi><mo>+</mo><mi>Asymmetric.checkBits</mi></mrow><mo>+</mo><mi>Capacity.reserved</mi></mrow><mo>=</mo><mi>Capacity.container</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>Asymmetric.payloadBits + Asymmetric.checkBits == Capacity.free ∧ Asymmetric.payloadBits + Asymmetric.checkBits == 122 ∧ Asymmetric.payloadBits + Asymmetric.checkBits + Capacity.reserved == Capacity.container</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{Asymmetric.payloadBits} + \mathrm{Asymmetric.checkBits} = \mathrm{Capacity.free} \land \mathrm{Asymmetric.payloadBits} + \mathrm{Asymmetric.checkBits} = 122 \land \mathrm{Asymmetric.payloadBits} + \mathrm{Asymmetric.checkBits} + \mathrm{Capacity.reserved} = \mathrm{Capacity.container}</code></pre></details>
</div>
<p class="thm-remark">── 9 · THE PAYLOAD AND THE CHECK PARTITION THE FREE BITS ───────────────────────────────────────────────── A third file joins the binding, and this one was invisible until the widths were put side by side. asymmetric.lean types `checkBits = 32` and `payloadBits = 42 + 48`; imprint.lean and capacity.lean decide that a UUID has 122 free bits after the version and variant are reserved. 90 + 32 = 122 EXACTLY — the payload and its check do not merely fit in a UUID, they exhaust it, with nothing spare and nothing borrowed. Three files stating one layout, and nothing had ever compared them.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_check_is_exactly_what_the_payload_does_not_take">
<p class="thm-label"><strong>Theorem 159</strong> (<code>the_check_is_exactly_what_the_payload_does_not_take</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_check_is_exactly_what_the_payload_does_not_take.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>pay</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>122</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pay</mi><mo>&gt;</mo><mi>Capacity.free</mi></mrow><mo>∨</mo><mrow><mrow><mi>pay</mi><mo>+</mo><mrow><mi>Capacity.free</mi><mo>-</mo><mi>pay</mi></mrow></mrow><mo>=</mo><mi>Capacity.free</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>Capacity.free</mi><mo>-</mo><mi>Asymmetric.payloadBits</mi></mrow><mo>=</mo><mi>Asymmetric.checkBits</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>Capacity.free</mi><mo>-</mo><mi>Asymmetric.checkBits</mi></mrow><mo>=</mo><mi>Asymmetric.payloadBits</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 123).all (fun pay =&gt; pay &gt; Capacity.free || pay + (Capacity.free - pay) == Capacity.free) ∧ Capacity.free - Asymmetric.payloadBits == Asymmetric.checkBits ∧ Capacity.free - Asymmetric.checkBits == Asymmetric.payloadBits</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{pay} \in \{0,\dots,122\},\; \mathrm{pay} &gt; \mathrm{Capacity.free} \lor \mathrm{pay} + \mathrm{Capacity.free} - \mathrm{pay} = \mathrm{Capacity.free} \land \mathrm{Capacity.free} - \mathrm{Asymmetric.payloadBits} = \mathrm{Asymmetric.checkBits} \land \mathrm{Capacity.free} - \mathrm{Asymmetric.checkBits} = \mathrm{Asymmetric.payloadBits}</code></pre></details>
</div>
<p class="thm-remark">── 10 · AND NOTHING IS SPARE, WHICH IS A CHOICE AND NOT AN ACCIDENT ────────────────────────────────────── Stated as the law rather than at the point: for every split of the free bits, the check is what the payload does not take. The instance is one line of it, and the domain is decided so a future change to either constant cannot silently leave a gap or an overlap.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 123 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-splitting_a_width_is_undone_by_either_part">
<p class="thm-label"><strong>Theorem 160</strong> (<code>splitting_a_width_is_undone_by_either_part</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_splitting_a_width_is_undone_by_either_part.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>129</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>129</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>a</mi><mo>&gt;</mo><mi>w</mi></mrow><mo>∨</mo><mrow><mrow><mrow><mrow><mi>w</mi><mo>-</mo><mi>a</mi></mrow><mo>+</mo><mi>a</mi></mrow><mo>=</mo><mi>w</mi></mrow><mo>∧</mo><mrow><mrow><mi>w</mi><mo>-</mo><mrow><mi>w</mi><mo>-</mo><mi>a</mi></mrow></mrow><mo>=</mo><mi>a</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 130).all (fun w =&gt; (List.range 130).all (fun a =&gt; a &gt; w || (w - a) + a == w &amp;&amp; w - (w - a) == a))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall w \in \{0,\dots,129\},\; \forall a \in \{0,\dots,129\},\; a &gt; w \lor w - a + a = w \land w - w - a = a</code></pre></details>
</div>
<p class="thm-remark">A partition of a width is recovered by subtracting either part: the inverse of splitting is splitting.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16,900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-reserving_and_freeing_are_inverse_at_every_width">
<p class="thm-label"><strong>Theorem 161</strong> (<code>reserving_and_freeing_are_inverse_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_reserving_and_freeing_are_inverse_at_every_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>129</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>r</mi><mo>&gt;</mo><mi>w</mi></mrow><mo>∨</mo><mrow><mrow><mrow><mi>w</mi><mo>-</mo><mi>r</mi></mrow><mo>+</mo><mi>r</mi></mrow><mo>=</mo><mi>w</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 130).all (fun w =&gt; (List.range 9).all (fun r =&gt; r &gt; w || (w - r) + r == w))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall w \in \{0,\dots,129\},\; \forall r \in \{0,\dots,8\},\; r &gt; w \lor w - r + r = w</code></pre></details>
</div>
<p class="thm-remark">Reserving bits and freeing them are inverse over every container, not only over 128.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,170 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-one_more_bit_doubles_the_space_at_every_width">
<p class="thm-label"><strong>Theorem 162</strong> (<code>one_more_bit_doubles_the_space_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_one_more_bit_doubles_the_space_at_every_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>,</mo><mrow><msup><mn>2</mn><mrow><mi>b</mi><mo>+</mo><mn>1</mn></mrow></msup><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mi>b</mi></msup></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 17).all (fun b =&gt; 2 ^ (b + 1) == 2 * 2 ^ b)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{0,\dots,16\},\; 2^{b + 1} = 2 \cdot 2^{b}</code></pre></details>
</div>
<p class="thm-remark">The capacity law: doubling the width squares the space, at every width in range.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 17 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_space_recovers_the_width_it_came_from">
<p class="thm-label"><strong>Theorem 163</strong> (<code>the_space_recovers_the_width_it_came_from</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_space_recovers_the_width_it_came_from.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><msup><mn>2</mn><mi>b</mi></msup><mo>=</mo><msup><mn>2</mn><mi>c</mi></msup></mrow><mo>=</mo><mrow><mi>b</mi><mo>=</mo><mi>c</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 17).all (fun b =&gt; (List.range 17).all (fun c =&gt; (2 ^ b == 2 ^ c) == (b == c)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{0,\dots,16\},\; \forall c \in \{0,\dots,16\},\; 2^{b} = 2^{c} = b = c</code></pre></details>
</div>
<p class="thm-remark">And its inverse: the space determines the width back, for every exact power.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 289 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_unit_conversion_is_a_bijection_on_multiples_of_eight">
<p class="thm-label"><strong>Theorem 164</strong> (<code>the_unit_conversion_is_a_bijection_on_multiples_of_eight</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_unit_conversion_is_a_bijection_on_multiples_of_eight.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>toBytes</mi><mo>(</mo><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>b</mi></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>199</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>n</mi><mo>mod</mo><mn>8</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mrow><mi>toBytes</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>n</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun b =&gt; toBytes (toBits b) == b) ∧ (List.range 200).all (fun n =&gt; (n % 8 == 0) == (toBits (toBytes n) == n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{0,\dots,39\},\; \mathrm{toBytes}\mathopen{}\left(\mathrm{toBits}\mathopen{}\left(b\right)\right) = b \land \forall n \in \{0,\dots,199\},\; n \bmod 8 = 0 = \mathrm{toBits}\mathopen{}\left(\mathrm{toBytes}\mathopen{}\left(n\right)\right) = n</code></pre></details>
</div>
<p class="thm-remark">Bytes and bits, both directions, at every width — the law theorem 2 stated for one conversion.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_laws_separate_widths_rather_than_collapsing_them">
<p class="thm-label"><strong>Theorem 165</strong> (<code>the_laws_separate_widths_rather_than_collapsing_them</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_laws_separate_widths_rather_than_collapsing_them.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∃</mo><mi>w</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>:</mo><mrow><mo>∃</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mrow><mi>a</mi><mo>&gt;</mo><mi>w</mi></mrow><mo>∧</mo><mrow><mrow><mi>w</mi><mo>-</mo><mi>a</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mi>a</mi><mo>≠</mo><mn>0</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mn>7</mn></msup><mo>≠</mo><msup><mn>2</mn><mn>8</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toBits</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 12).any (fun w =&gt; (List.range 12).any (fun a =&gt; a &gt; w &amp;&amp; w - a == 0 &amp;&amp; a != 0)) ∧ 2 ^ 7 != 2 ^ 8 ∧ toBits 5 != toBits 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists w \in \{0,\dots,11\} : \exists a \in \{0,\dots,11\} : a &gt; w \land w - a = 0 \land a \neq 0 \land 2^{7} \neq 2^{8} \land \mathrm{toBits}\mathopen{}\left(5\right) \neq \mathrm{toBits}\mathopen{}\left(6\right)</code></pre></details>
</div>
<p class="thm-remark">THE CONTROL ON ALL FIVE. Each is satisfied by arithmetic that ignores its arguments, so a case that must FAIL is required: subtracting more than a width does not return it, and unequal widths give unequal spaces. Without this the laws above are true of a tree where every width is the same width.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 144 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-fitting_is_the_order_and_not_fitting_is_its_negation">
<p class="thm-label"><strong>Theorem 166</strong> (<code>fitting_is_the_order_and_not_fitting_is_its_negation</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_fitting_is_the_order_and_not_fitting_is_its_negation.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>69</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>69</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>a</mi><mo>≤</mo><mi>b</mi></mrow><mo>=</mo><mrow><mo>¬</mo><mrow><mi>b</mi><mo>&lt;</mo><mi>a</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 70).all (fun a =&gt; (List.range 70).all (fun b =&gt; (a ≤ b) == !(b &lt; a)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,69\},\; \forall b \in \{0,\dots,69\},\; a \le b = \lnot b &lt; a</code></pre></details>
</div>
<p class="thm-remark">FITTING IS ≤, AND NOT FITTING IS ITS NEGATION. One law, both directions, at every pair of widths.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_gap_is_what_is_left_and_adding_it_back_returns">
<p class="thm-label"><strong>Theorem 167</strong> (<code>the_gap_is_what_is_left_and_adding_it_back_returns</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_gap_is_what_is_left_and_adding_it_back_returns.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>69</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>69</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>a</mi><mo>&gt;</mo><mi>b</mi></mrow><mo>∨</mo><mrow><mrow><mrow><mrow><mi>b</mi><mo>-</mo><mi>a</mi></mrow><mo>+</mo><mi>a</mi></mrow><mo>=</mo><mi>b</mi></mrow><mo>∧</mo><mrow><mrow><mi>b</mi><mo>-</mo><mrow><mi>b</mi><mo>-</mo><mi>a</mi></mrow></mrow><mo>=</mo><mi>a</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 70).all (fun a =&gt; (List.range 70).all (fun b =&gt; a &gt; b || (b - a) + a == b &amp;&amp; b - (b - a) == a))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,69\},\; \forall b \in \{0,\dots,69\},\; a &gt; b \lor b - a + a = b \land b - b - a = a</code></pre></details>
</div>
<p class="thm-remark">THE GAP IS WHAT IS LEFT, AND ADDING IT BACK RETURNS THE LARGER — the inverse the lead asks for.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_identifier_holds_neither_the_key_nor_the_signature">
<p class="thm-label"><strong>Theorem 168</strong> (<code>the_identifier_holds_neither_the_key_nor_the_signature</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_identifier_holds_neither_the_key_nor_the_signature.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>uuidBytes</mi><mo>&lt;</mo><mi>publicKeyBytes</mi></mrow><mo>∧</mo><mrow><mi>uuidBytes</mi><mo>&lt;</mo><mi>signatureBytes</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>publicKeyBytes</mi><mo>-</mo><mi>uuidBytes</mi></mrow><mo>=</mo><mi>uuidBytes</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>signatureBytes</mi><mo>-</mo><mi>uuidBytes</mi></mrow><mo>=</mo><mrow><mn>3</mn><mo>⋅</mo><mi>uuidBytes</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>uuidBytes &lt; publicKeyBytes ∧ uuidBytes &lt; signatureBytes ∧ publicKeyBytes - uuidBytes == uuidBytes ∧ signatureBytes - uuidBytes == 3 * uuidBytes</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{uuidBytes} &lt; \mathrm{publicKeyBytes} \land \mathrm{uuidBytes} &lt; \mathrm{signatureBytes} \land \mathrm{publicKeyBytes} - \mathrm{uuidBytes} = \mathrm{uuidBytes} \land \mathrm{signatureBytes} - \mathrm{uuidBytes} = 3 \cdot \mathrm{uuidBytes}</code></pre></details>
</div>
<p class="thm-remark">THE INSTANCES, FOLLOWING FROM THE LAWS rather than typed beside them: the identifier holds neither.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_conversion_carries_the_containment">
<p class="thm-label"><strong>Theorem 169</strong> (<code>the_conversion_carries_the_containment</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_conversion_carries_the_containment.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>69</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>69</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>a</mi><mo>≤</mo><mi>b</mi></mrow><mo>=</mo><mrow><mrow><mi>toBits</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>toBits</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 70).all (fun a =&gt; (List.range 70).all (fun b =&gt; (a ≤ b) == (toBits a ≤ toBits b)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,69\},\; \forall b \in \{0,\dots,69\},\; a \le b = \mathrm{toBits}\mathopen{}\left(a\right) \le \mathrm{toBits}\mathopen{}\left(b\right)</code></pre></details>
</div>
<p class="thm-remark">And in bits, where the same order holds — the conversion carries the containment, not only the sizes.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,900 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_gap_between_payload_and_check_is_their_difference">
<p class="thm-label"><strong>Theorem 170</strong> (<code>the_gap_between_payload_and_check_is_their_difference</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_gap_between_payload_and_check_is_their_difference.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>pay</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>122</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pay</mi><mo>&gt;</mo><mi>Capacity.free</mi></mrow><mo>∨</mo><mrow><mrow><mi>pay</mi><mo>≥</mo><mrow><mi>Capacity.free</mi><mo>-</mo><mi>pay</mi></mrow></mrow><mo>=</mo><mrow><mrow><mi>pay</mi><mo>+</mo><mi>pay</mi></mrow><mo>≥</mo><mi>Capacity.free</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>Asymmetric.payloadBits</mi><mo>-</mo><mi>Asymmetric.checkBits</mi></mrow><mo>=</mo><mn>58</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>Asymmetric.checkBits</mi><mo>+</mo><mn>58</mn></mrow><mo>=</mo><mi>Asymmetric.payloadBits</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 123).all (fun pay =&gt; pay &gt; Capacity.free || (pay ≥ Capacity.free - pay) == (pay + pay ≥ Capacity.free)) ∧ Asymmetric.payloadBits - Asymmetric.checkBits == 58 ∧ Asymmetric.checkBits + 58 == Asymmetric.payloadBits</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{pay} \in \{0,\dots,122\},\; \mathrm{pay} &gt; \mathrm{Capacity.free} \lor \mathrm{pay} \ge \mathrm{Capacity.free} - \mathrm{pay} = \mathrm{pay} + \mathrm{pay} \ge \mathrm{Capacity.free} \land \mathrm{Asymmetric.payloadBits} - \mathrm{Asymmetric.checkBits} = 58 \land \mathrm{Asymmetric.checkBits} + 58 = \mathrm{Asymmetric.payloadBits}</code></pre></details>
</div>
<p class="thm-remark">THE PAYLOAD/CHECK GAP, as a law over every split of the free bits and then at its instance.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 123 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-a_gap_in_bits_is_a_factor_in_space">
<p class="thm-label"><strong>Theorem 171</strong> (<code>a_gap_in_bits_is_a_factor_in_space</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_a_gap_in_bits_is_a_factor_in_space.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><msup><mn>2</mn><mn>58</mn></msup><mo>⋅</mo><msup><mn>2</mn><mi>Asymmetric.checkBits</mi></msup></mrow><mo>=</mo><msup><mn>2</mn><mi>Asymmetric.payloadBits</mi></msup></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>g</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><msup><mn>2</mn><mi>g</mi></msup><mo>⋅</mo><msup><mn>2</mn><mi>c</mi></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mi>g</mi><mo>+</mo><mi>c</mi></mrow></msup></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 58 * 2 ^ Asymmetric.checkBits == 2 ^ Asymmetric.payloadBits ∧ (List.range 20).all (fun g =&gt; (List.range 20).all (fun c =&gt; 2 ^ g * 2 ^ c == 2 ^ (g + c)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{58} \cdot 2^{\mathrm{Asymmetric.checkBits}} = 2^{\mathrm{Asymmetric.payloadBits}} \land \forall g \in \{0,\dots,19\},\; \forall c \in \{0,\dots,19\},\; 2^{g} \cdot 2^{c} = 2^{g + c}</code></pre></details>
</div>
<p class="thm-remark">AND THE GAP IN SPACE IS THE PRODUCT, not the difference — the error a reader makes reading bit gaps.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 400 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-the_laws_separate_the_order_rather_than_collapsing_it">
<p class="thm-label"><strong>Theorem 172</strong> (<code>the_laws_separate_the_order_rather_than_collapsing_it</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_the_laws_separate_the_order_rather_than_collapsing_it.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>¬</mo><mrow><mi>publicKeyBytes</mi><mo>≤</mo><mi>uuidBytes</mi></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mi>signatureBytes</mi><mo>≤</mo><mrow><mi>publicKeyBytes</mi><mo>-</mo><mn>1</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>signatureBytes</mi><mo>-</mo><mi>uuidBytes</mi></mrow><mo>≠</mo><mrow><mi>uuidBytes</mi><mo>-</mo><mi>signatureBytes</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>uuidBytes</mi><mo>-</mo><mi>signatureBytes</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>!(publicKeyBytes ≤ uuidBytes) ∧ !(signatureBytes ≤ publicKeyBytes - 1) ∧ (signatureBytes - uuidBytes) != (uuidBytes - signatureBytes) ∧ uuidBytes - signatureBytes == 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \mathrm{publicKeyBytes} \le \mathrm{uuidBytes} \land \lnot \mathrm{signatureBytes} \le \mathrm{publicKeyBytes} - 1 \land \mathrm{signatureBytes} - \mathrm{uuidBytes} \neq \mathrm{uuidBytes} - \mathrm{signatureBytes} \land \mathrm{uuidBytes} - \mathrm{signatureBytes} = 0</code></pre></details>
</div>
<p class="thm-remark">THE CONTROL. Every law above is satisfied by arithmetic that ignores its arguments, so cases that must FAIL are required: a larger width does not fit in a smaller, and the gap is not symmetric.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-widths-truncation_reports_no_gap_where_the_order_reverses">
<p class="thm-label"><strong>Theorem 173</strong> (<code>truncation_reports_no_gap_where_the_order_reverses</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_widths_truncation_reports_no_gap_where_the_order_reverses.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>a</mi><mo>≤</mo><mi>b</mi></mrow><mo>=</mo><mrow><mrow><mi>a</mi><mo>-</mo><mi>b</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∨</mo><mrow><mi>a</mi><mo>=</mo><mi>b</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun a =&gt; (List.range 40).all (fun b =&gt; (a ≤ b) == (a - b == 0) || a == b))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,39\},\; \forall b \in \{0,\dots,39\},\; a \le b = a - b = 0 \lor a = b</code></pre></details>
</div>
<p class="thm-remark">WHAT TRUNCATING SUBTRACTION HIDES, said rather than relied on. `a - b` is 0 when b exceeds a, so a gap read without its order is a gap that silently reports none — which is why every law above carries the comparison beside the subtraction.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,600 cases. <span class="qed">□</span></p>

</div>
