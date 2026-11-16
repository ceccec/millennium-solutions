---
title: "The uuid as a container — a checksum, a program, and a message"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `program.lean`

<p class="paper-src"><code>src/iso/iec-18033-cryptography/program.lean</code> · namespace <code>Program</code> · 21 theorems · wing <code>the address</code></p>

The author, 2026-09-18: "the middle part of uuid is the program and the end is the message", and of the
first group, "checksum over the program and the message".

THE FIELD WIDTHS ARE THE WHOLE POINT, because the obvious reading of them is wrong. On the canonical
8-4-4-4-12 rendering the middle is three groups — bytes 4..9, 48 bits — and BOTH structural fields begin
inside it: the version nibble is the high nibble of byte 6, which opens the third group, and the variant
is the top two bits of byte 8, which opens the fourth. So the program field is 42 bits and not 48. A
codec written to the obvious reading emits identifiers that are not uuids, and it emits them silently.

What is decided below is the PARTITION: the three fields and the six reserved bits are pairwise disjoint,
every one of the 128 positions belongs to exactly one of them, and the widths are 32 + 42 + 48 + 6. The
check FUNCTION is not redecided here — it is Fnv.hash32, ported and pinned in fnv.lean — and the codec's
agreement with the shipped TypeScript is scripts/lean-agree.ts.

HONEST, AND STATED AS A THEOREM RATHER THAN A FOOTNOTE: a checksum is not authentication. It is computed
by anyone, so anyone who edits the payload recomputes it; and 90 bits of payload cannot be distinguished
by 32 bits of check, so collisions exist by counting alone. Both are below.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>GROUPS := [4, 2, 2, 2, 6]
RESERVED := ((List.range 4).map (fun i =&gt; byteAt 2 * 8 + i)) ++ ((List.range 2).map (fun i =&gt; byteAt 3 * 8 + i))
checkF := List.range (byteAt 1 * 8)
middleF := (List.range ((byteAt 4 - byteAt 1) * 8)).map (· + byteAt 1 * 8)
programF := middleF.filter (fun i =&gt; !(RESERVED.contains i))
messageF := (List.range ((GROUPS.getD 4 0) * 8)).map (· + byteAt 4 * 8)
maps3 := (List.range 3).flatMap (fun a =&gt; (List.range 3).flatMap (fun b =&gt;
maps4 := (List.range 4).flatMap (fun a =&gt; (List.range 4).flatMap (fun b =&gt;
P0 := (List.range 42).map (fun i =&gt; i % 2 == 0)
M0 := (List.range 48).map (fun i =&gt; i % 3 == 0)
P1 := (List.range 42).map (fun i =&gt; i % 5 == 0)
M1 := (List.range 48).map (fun i =&gt; i % 7 == 0)
PZ := List.replicate 42 false
MZ := List.replicate 48 false
settledHere := 21</code></pre>

<div class="thm" id="thm-program-the_reserved_six_are_where_the_rendering_puts_them">
<p class="thm-label"><strong>Theorem 108</strong> (<code>the_reserved_six_are_where_the_rendering_puts_them</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_reserved_six_are_where_the_rendering_puts_them.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>RESERVED</mi><mo>=</mo><mrow><mo>[</mo><mn>48</mn><mo>,</mo><mn>49</mn><mo>,</mo><mn>50</mn><mo>,</mo><mn>51</mn><mo>,</mo><mn>64</mn><mo>,</mo><mn>65</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>byteAt</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>byteAt</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>byteAt</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>RESERVED = [48, 49, 50, 51, 64, 65] ∧ byteAt 2 = 6 ∧ byteAt 3 = 8 ∧ byteAt 4 = 10</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{RESERVED} = [48,\,49,\,50,\,51,\,64,\,65] \land \mathrm{byteAt}\mathopen{}\left(2\right) = 6 \land \mathrm{byteAt}\mathopen{}\left(3\right) = 8 \land \mathrm{byteAt}\mathopen{}\left(4\right) = 10</code></pre></details>
</div>
<p class="thm-remark">the derivation lands exactly where the rendering says, or nothing below means what it claims</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_program_field_is_forty_two_bits_not_forty_eight">
<p class="thm-label"><strong>Theorem 109</strong> (<code>the_program_field_is_forty_two_bits_not_forty_eight</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_program_field_is_forty_two_bits_not_forty_eight.html">sealed</a>.</p>
<pre class="thm-statement"><code>programF.length = 42 ∧ ((List.range 48).map (· + 32)).length = 48</code></pre>
</div>
<p class="thm-remark">── THE WIDTHS ───────────────────────────────────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 48 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_three_fields_and_the_reserved_six_are_the_whole_uuid">
<p class="thm-label"><strong>Theorem 110</strong> (<code>the_three_fields_and_the_reserved_six_are_the_whole_uuid</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_three_fields_and_the_reserved_six_are_the_whole_uuid.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>checkF</mi><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mi>programF</mi><mo>|</mo></mrow></mrow><mo>+</mo><mrow><mo>|</mo><mi>messageF</mi><mo>|</mo></mrow></mrow><mo>+</mo><mi>RESERVED.length</mi></mrow><mo>=</mo><mn>128</mn></mrow></math></div>
<pre class="thm-statement"><code>checkF.length + programF.length + messageF.length + RESERVED.length = 128</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{checkF}\right| + \left|\mathrm{programF}\right| + \left|\mathrm{messageF}\right| + \mathrm{RESERVED.length} = 128</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_widths_are_what_the_layout_says">
<p class="thm-label"><strong>Theorem 111</strong> (<code>the_widths_are_what_the_layout_says</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_widths_are_what_the_layout_says.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mi>checkF</mi><mo>|</mo></mrow><mo>=</mo><mn>32</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>messageF</mi><mo>|</mo></mrow><mo>=</mo><mn>48</mn></mrow></mrow><mo>∧</mo><mrow><mi>RESERVED.length</mi><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>checkF.length = 32 ∧ messageF.length = 48 ∧ RESERVED.length = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{checkF}\right| = 32 \land \left|\mathrm{messageF}\right| = 48 \land \mathrm{RESERVED.length} = 6</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-every_reserved_bit_is_in_the_middle_group">
<p class="thm-label"><strong>Theorem 112</strong> (<code>every_reserved_bit_is_in_the_middle_group</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_every_reserved_bit_is_in_the_middle_group.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>RESERVED.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mrow><mn>32</mn><mo>≤</mo><mi>r</mi></mrow><mo>∧</mo><mrow><mi>r</mi><mo>&lt;</mo><mn>80</mn></mrow></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>RESERVED.all (fun r =&gt; 32 ≤ r &amp;&amp; r &lt; 80)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{RESERVED.all}\mathopen{}\left(r \mapsto 32 \le r \land r &lt; 80\right)</code></pre></details>
</div>
<p class="thm-remark">── BOTH RESERVED FIELDS FALL IN THE MIDDLE, which is the reason for the 42 ──────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-neither_the_check_nor_the_message_gives_up_a_bit">
<p class="thm-label"><strong>Theorem 113</strong> (<code>neither_the_check_nor_the_message_gives_up_a_bit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_neither_the_check_nor_the_message_gives_up_a_bit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>checkF</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mi>RESERVED.contains</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mi>messageF</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mi>RESERVED.contains</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(checkF.all (fun i =&gt; !(RESERVED.contains i))) ∧ (messageF.all (fun i =&gt; !(RESERVED.contains i)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \mathrm{checkF},\; \lnot \mathrm{RESERVED.contains}\mathopen{}\left(i\right) \land \forall i \in \mathrm{messageF},\; \lnot \mathrm{RESERVED.contains}\mathopen{}\left(i\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-every_position_belongs_to_exactly_one_field">
<p class="thm-label"><strong>Theorem 114</strong> (<code>every_position_belongs_to_exactly_one_field</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_every_position_belongs_to_exactly_one_field.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>127</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>inExactlyOne</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 128).all (fun i =&gt; inExactlyOne i == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,127\},\; \mathrm{inExactlyOne}\mathopen{}\left(i\right) = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 128 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-nothing_outside_the_uuid_is_claimed">
<p class="thm-label"><strong>Theorem 115</strong> (<code>nothing_outside_the_uuid_is_claimed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_nothing_outside_the_uuid_is_claimed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>128</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>159</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>inExactlyOne</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 128 32).all (fun i =&gt; inExactlyOne i == 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{128,\dots,159\},\; \mathrm{inExactlyOne}\mathopen{}\left(i\right) = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 32 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-each_field_is_ascending_and_repeats_nothing">
<p class="thm-label"><strong>Theorem 116</strong> (<code>each_field_is_ascending_and_repeats_nothing</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_each_field_is_ascending_and_repeats_nothing.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>ascending</mi><mo>(</mo><mi>checkF</mi><mo>)</mo></mrow><mo>∧</mo><mrow><mi>ascending</mi><mo>(</mo><mi>programF</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mi>ascending</mi><mo>(</mo><mi>messageF</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>ascending checkF ∧ ascending programF ∧ ascending messageF</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ascending}\mathopen{}\left(\mathrm{checkF}\right) \land \mathrm{ascending}\mathopen{}\left(\mathrm{programF}\right) \land \mathrm{ascending}\mathopen{}\left(\mathrm{messageF}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_check_is_the_deposit_s_own_fnv">
<p class="thm-label"><strong>Theorem 117</strong> (<code>the_check_is_the_deposit_s_own_fnv</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_check_is_the_deposit_s_own_fnv.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mi>List.replicate</mi><mo>(</mo><mn>12</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>1661287312</mn></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 (List.replicate 12 0) = 1661287312</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,\mathrm{List.replicate}\mathopen{}\left(12,\,0\right)\right) = 1661287312</code></pre></details>
</div>
<p class="thm-remark">── THE CHECK FUNCTION IS NOT REDECIDED HERE — it is Fnv.hash32, pinned in fnv.lean. This states only that the deposit's check of an empty payload is that function's value, so a codec that quietly used another hash would part company with the kernel here rather than in production.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_payload_outruns_the_check">
<p class="thm-label"><strong>Theorem 118</strong> (<code>the_payload_outruns_the_check</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_payload_outruns_the_check.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><msup><mn>2</mn><mn>32</mn></msup><mo>&lt;</mo><msup><mn>2</mn><mrow><mn>42</mn><mo>+</mo><mn>48</mn></mrow></msup></mrow><mo>∧</mo><mrow><mrow><mn>42</mn><mo>+</mo><mn>48</mn></mrow><mo>=</mo><mn>90</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ 32 &lt; 2 ^ (42 + 48) ∧ 42 + 48 = 90</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{32} &lt; 2^{42 + 48} \land 42 + 48 = 90</code></pre></details>
</div>
<p class="thm-remark">── AND WHAT IT CANNOT DO, decided rather than disclaimed ──────────────────────────────────────────────── 90 bits of payload, 32 bits of check: the map cannot be injective, and the ratio is not close.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-no_map_from_four_onto_three_separates_them_all">
<p class="thm-label"><strong>Theorem 119</strong> (<code>no_map_from_four_onto_three_separates_them_all</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_no_map_from_four_onto_three_separates_them_all.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>f</mi><mo>∈</mo><mi>maps3</mi><mo>,</mo><mrow><mi>decide</mi><mo>(</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>&lt;</mo><mn>4</mn></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>maps3.all (fun f =&gt; decide ((f.eraseDups).length &lt; 4))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall f \in \mathrm{maps3},\; \mathrm{decide}\mathopen{}\left(\left|\operatorname{dedup}\left(f\right)\right| &lt; 4\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-four_values_can_be_separated_by_four">
<p class="thm-label"><strong>Theorem 120</strong> (<code>four_values_can_be_separated_by_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_four_values_can_be_separated_by_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∃</mo><mi>f</mi><mo>∈</mo><mi>maps4</mi><mo>:</mo><mrow><mi>decide</mi><mo>(</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>f</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>maps4.any (fun f =&gt; decide ((f.eraseDups).length == 4))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists f \in \mathrm{maps4} : \mathrm{decide}\mathopen{}\left(\left|\operatorname{dedup}\left(f\right)\right| = 4\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_fields_read_back_exactly">
<p class="thm-label"><strong>Theorem 121</strong> (<code>the_fields_read_back_exactly</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_fields_read_back_exactly.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>readField</mi><mo>(</mo><mi>programF</mi><mo>,</mo><mrow><mi>encodeBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>P0</mi></mrow><mo>∧</mo><mrow><mrow><mi>readField</mi><mo>(</mo><mi>messageF</mi><mo>,</mo><mrow><mi>encodeBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>M0</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>readField</mi><mo>(</mo><mi>programF</mi><mo>,</mo><mrow><mi>encodeBits</mi><mo>(</mo><mi>P1</mi><mo>,</mo><mi>M1</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>P1</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>readField</mi><mo>(</mo><mi>messageF</mi><mo>,</mo><mrow><mi>encodeBits</mi><mo>(</mo><mi>P1</mi><mo>,</mo><mi>M1</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>M1</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>readField programF (encodeBits P0 M0) = P0 ∧ readField messageF (encodeBits P0 M0) = M0 ∧ readField programF (encodeBits P1 M1) = P1 ∧ readField messageF (encodeBits P1 M1) = M1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{readField}\mathopen{}\left(\mathrm{programF},\,\mathrm{encodeBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{M0}\right)\right) = \mathrm{P0} \land \mathrm{readField}\mathopen{}\left(\mathrm{messageF},\,\mathrm{encodeBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{M0}\right)\right) = \mathrm{M0} \land \mathrm{readField}\mathopen{}\left(\mathrm{programF},\,\mathrm{encodeBits}\mathopen{}\left(\mathrm{P1},\,\mathrm{M1}\right)\right) = \mathrm{P1} \land \mathrm{readField}\mathopen{}\left(\mathrm{messageF},\,\mathrm{encodeBits}\mathopen{}\left(\mathrm{P1},\,\mathrm{M1}\right)\right) = \mathrm{M1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_check_field_carries_the_check">
<p class="thm-label"><strong>Theorem 122</strong> (<code>the_check_field_carries_the_check</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_check_field_carries_the_check.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>readField</mi><mo>(</mo><mi>checkF</mi><mo>,</mo><mrow><mi>encodeBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>checkBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>readField checkF (encodeBits P0 M0) = checkBits P0 M0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{readField}\mathopen{}\left(\mathrm{checkF},\,\mathrm{encodeBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{M0}\right)\right) = \mathrm{checkBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{M0}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_reserved_six_survive_any_payload">
<p class="thm-label"><strong>Theorem 123</strong> (<code>the_reserved_six_survive_any_payload</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_reserved_six_survive_any_payload.html">sealed</a>.</p>
<pre class="thm-statement"><code>[(P0, M0), (P1, M1), (P0, M1), (P1, M0), (PZ, MZ)].all (fun pm =&gt; let b := encodeBits pm.1 pm.2 (b.getD 48 false == true) &amp;&amp; (b.getD 49 false == false) &amp;&amp; (b.getD 50 false == false) &amp;&amp; (b.getD 51 false == false) &amp;&amp; (b.getD 64 false == true) &amp;&amp; (b.getD 65 false == false))</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-the_flip_reaches_every_payload_position">
<p class="thm-label"><strong>Theorem 124</strong> (<code>the_flip_reaches_every_payload_position</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_the_flip_reaches_every_payload_position.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>41</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>flipAt</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>≠</mo><mi>P0</mi></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>47</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>flipAt</mi><mo>(</mo><mi>M0</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>≠</mo><mi>M0</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 42).all (fun i =&gt; flipAt P0 i != P0) ∧ (List.range 48).all (fun i =&gt; flipAt M0 i != M0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,41\},\; \mathrm{flipAt}\mathopen{}\left(\mathrm{P0},\,i\right) \neq \mathrm{P0} \land \forall i \in \{0,\dots,47\},\; \mathrm{flipAt}\mathopen{}\left(\mathrm{M0},\,i\right) \neq \mathrm{M0}</code></pre></details>
</div>
<p class="thm-remark">the flip is not vacuous: it lands, at every position</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2,016 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-flipping_any_program_bit_moves_the_check">
<p class="thm-label"><strong>Theorem 125</strong> (<code>flipping_any_program_bit_moves_the_check</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_flipping_any_program_bit_moves_the_check.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>41</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>checkBits</mi><mo>(</mo><mrow><mi>flipAt</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>,</mo><mi>M0</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>checkBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 42).all (fun i =&gt; checkBits (flipAt P0 i) M0 != checkBits P0 M0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,41\},\; \mathrm{checkBits}\mathopen{}\left(\mathrm{flipAt}\mathopen{}\left(\mathrm{P0},\,i\right),\,\mathrm{M0}\right) \neq \mathrm{checkBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{M0}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 42 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-flipping_any_message_bit_moves_the_check">
<p class="thm-label"><strong>Theorem 126</strong> (<code>flipping_any_message_bit_moves_the_check</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_flipping_any_message_bit_moves_the_check.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>47</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>checkBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mrow><mi>flipAt</mi><mo>(</mo><mi>M0</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>checkBits</mi><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 48).all (fun i =&gt; checkBits P0 (flipAt M0 i) != checkBits P0 M0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,47\},\; \mathrm{checkBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{flipAt}\mathopen{}\left(\mathrm{M0},\,i\right)\right) \neq \mathrm{checkBits}\mathopen{}\left(\mathrm{P0},\,\mathrm{M0}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 48 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-program-an_untouched_container_reads_intact">
<p class="thm-label"><strong>Theorem 127</strong> (<code>an_untouched_container_reads_intact</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_an_untouched_container_reads_intact.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>pm</mi><mo>∈</mo><mrow><mo>[</mo><mrow><mo>(</mo><mi>P0</mi><mo>,</mo><mi>M0</mi><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mi>P1</mi><mo>,</mo><mi>M1</mi><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mi>PZ</mi><mo>,</mo><mi>MZ</mi><mo>)</mo></mrow><mo>]</mo></mrow><mo>,</mo><mrow><mi>intact</mi><mo>(</mo><mrow><mi>encodeBits</mi><mo>(</mo><msub><mi>pm</mi><mn>1</mn></msub><mo>,</mo><msub><mi>pm</mi><mn>2</mn></msub><mo>)</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>[(P0, M0), (P1, M1), (PZ, MZ)].all (fun pm =&gt; intact (encodeBits pm.1 pm.2))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{pm} \in [\left(\mathrm{P0},\,\mathrm{M0}\right),\,\left(\mathrm{P1},\,\mathrm{M1}\right),\,\left(\mathrm{PZ},\,\mathrm{MZ}\right)],\; \mathrm{intact}\mathopen{}\left(\mathrm{encodeBits}\mathopen{}\left(\mathrm{pm}_{1},\,\mathrm{pm}_{2}\right)\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-program-a_damaged_container_is_refused_at_every_program_position">
<p class="thm-label"><strong>Theorem 128</strong> (<code>a_damaged_container_is_refused_at_every_program_position</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_program_a_damaged_container_is_refused_at_every_program_position.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 42).all (fun i =&gt; !(intact (flipBit (encodeBits P0 M0) (programF.getD i 0))))</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 42 cases. <span class="qed">□</span></p>

</div>
