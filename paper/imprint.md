---
title: "The imprint — a uuid that carries a message and gives it back"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `imprint.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/imprint.lean</code> · namespace <code>Imprint</code> · 9 theorems · wing <code>the address</code></p>

The deposit has two containers and until now the kernel knew one of them. program.lean decides the
checksum/program/message layout; src/0/imprint.ts — older, and the one the ledger's own tooling uses —
had no Lean at all. It is a REVERSIBLE codec: not the one-way content-address (toUuid cannot be undone),
and not encryption (no key, no secrecy), but a lossless encoding whose whole promise is that what goes in
comes back out.

That promise was checked in TypeScript and nowhere else. A codec that round-trips the message you tried
and loses the one you did not is self-consistent, passes its own tests, and is not reversible.

THE LAYOUT: 128 bits, six reserved (the version nibble and the variant), leaving 122 free. The first
seven of those free bits are a LENGTH HEADER, so the reader knows where the message stops — which is the
whole reason the codec is reversible rather than merely lossy — and the remaining 115 are the message.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>RESERVED := [48, 49, 50, 51, 64, 65]
FREE := (List.range 128).filter (fun i =&gt; !(RESERVED.contains i))
LEN_BITS := 7
CAPACITY := FREE.length - LEN_BITS
settledHere := 9</code></pre>

<div class="thm" id="thm-imprint-the_free_region_is_a_hundred_and_twenty_two">
<p class="thm-label"><strong>Theorem 75</strong> (<code>the_free_region_is_a_hundred_and_twenty_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_the_free_region_is_a_hundred_and_twenty_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>FREE.length</mi><mo>=</mo><mn>122</mn></mrow><mo>∧</mo><mrow><mi>RESERVED.length</mi><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>FREE.length</mi><mo>+</mo><mi>RESERVED.length</mi></mrow><mo>=</mo><mn>128</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>FREE.length = 122 ∧ RESERVED.length = 6 ∧ FREE.length + RESERVED.length = 128</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{FREE.length} = 122 \land \mathrm{RESERVED.length} = 6 \land \mathrm{FREE.length} + \mathrm{RESERVED.length} = 128</code></pre></details>
</div>
<p class="thm-remark">── THE BUDGET, WHICH IS WHERE A CODEC OVERSPENDS ───────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-the_capacity_is_the_free_region_less_the_header">
<p class="thm-label"><strong>Theorem 76</strong> (<code>the_capacity_is_the_free_region_less_the_header</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_the_capacity_is_the_free_region_less_the_header.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>CAPACITY</mi><mo>=</mo><mn>115</mn></mrow><mo>∧</mo><mrow><mrow><mi>CAPACITY</mi><mo>+</mo><mi>LEN_BITS</mi></mrow><mo>=</mo><mi>FREE.length</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>CAPACITY = 115 ∧ CAPACITY + LEN_BITS = FREE.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{CAPACITY} = 115 \land \mathrm{CAPACITY} + \mathrm{LEN\_BITS} = \mathrm{FREE.length}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-no_reserved_bit_is_free">
<p class="thm-label"><strong>Theorem 77</strong> (<code>no_reserved_bit_is_free</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_no_reserved_bit_is_free.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>RESERVED.all</mi><mo>(</mo><mrow><mi>r</mi><mo>↦</mo><mrow><mo>¬</mo><mrow><mi>FREE.contains</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>RESERVED.all (fun r =&gt; !(FREE.contains r))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{RESERVED.all}\mathopen{}\left(r \mapsto \lnot \mathrm{FREE.contains}\mathopen{}\left(r\right)\right)</code></pre></details>
</div>
<p class="thm-remark">and no reserved bit is free, which is the one way a codec silently stops emitting uuids</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-seven_bits_count_past_the_capacity">
<p class="thm-label"><strong>Theorem 78</strong> (<code>seven_bits_count_past_the_capacity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_seven_bits_count_past_the_capacity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><msup><mn>2</mn><mi>LEN_BITS</mi></msup><mo>&gt;</mo><mi>CAPACITY</mi></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mrow><mi>LEN_BITS</mi><mo>-</mo><mn>1</mn></mrow></msup><mo>&lt;</mo><mi>CAPACITY</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 ^ LEN_BITS &gt; CAPACITY ∧ 2 ^ (LEN_BITS - 1) &lt; CAPACITY</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{\mathrm{LEN\_BITS}} &gt; \mathrm{CAPACITY} \land 2^{\mathrm{LEN\_BITS} - 1} &lt; \mathrm{CAPACITY}</code></pre></details>
</div>
<p class="thm-remark">── THE HEADER HOLDS EVERY LENGTH IT MUST ─────────────────────────────────────────────────────────────── Seven bits count to 127 and the capacity is 115, so every admissible length is representable — and the header could not be one bit shorter, which is why it is seven and not six.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-every_short_message_comes_back">
<p class="thm-label"><strong>Theorem 79</strong> (<code>every_short_message_comes_back</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_every_short_message_comes_back.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>decodeBits</mi><mo>(</mo><mrow><mi>encodeBits</mi><mo>(</mo><mrow><mi>alt</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>alt</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun n =&gt; decodeBits (encodeBits (alt n)) == alt n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,8\},\; \mathrm{decodeBits}\mathopen{}\left(\mathrm{encodeBits}\mathopen{}\left(\mathrm{alt}\mathopen{}\left(n\right)\right)\right) = \mathrm{alt}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-the_all_set_message_comes_back_too">
<p class="thm-label"><strong>Theorem 80</strong> (<code>the_all_set_message_comes_back_too</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_the_all_set_message_comes_back_too.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>decodeBits</mi><mo>(</mo><mrow><mi>encodeBits</mi><mo>(</mo><mrow><mi>ones</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>ones</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun n =&gt; decodeBits (encodeBits (ones n)) == ones n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,8\},\; \mathrm{decodeBits}\mathopen{}\left(\mathrm{encodeBits}\mathopen{}\left(\mathrm{ones}\mathopen{}\left(n\right)\right)\right) = \mathrm{ones}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-the_header_records_the_length">
<p class="thm-label"><strong>Theorem 81</strong> (<code>the_header_records_the_length</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_the_header_records_the_length.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 9).all (fun n =&gt; natOf ((FREE.map (fun i =&gt; (encodeBits (alt n)).getD i false)).take LEN_BITS) == n)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-a_shorter_message_is_not_a_longer_one">
<p class="thm-label"><strong>Theorem 82</strong> (<code>a_shorter_message_is_not_a_longer_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_a_shorter_message_is_not_a_longer_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>encodeBits</mi><mo>(</mo><mrow><mi>alt</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>encodeBits</mi><mo>(</mo><mrow><mi>alt</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>encodeBits</mi><mo>(</mo><mrow><mi>ones</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>encodeBits</mi><mo>(</mo><mrow><mi>ones</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>encodeBits (alt 3) != encodeBits (alt 4) ∧ encodeBits (ones 0) != encodeBits (ones 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{encodeBits}\mathopen{}\left(\mathrm{alt}\mathopen{}\left(3\right)\right) \neq \mathrm{encodeBits}\mathopen{}\left(\mathrm{alt}\mathopen{}\left(4\right)\right) \land \mathrm{encodeBits}\mathopen{}\left(\mathrm{ones}\mathopen{}\left(0\right)\right) \neq \mathrm{encodeBits}\mathopen{}\left(\mathrm{ones}\mathopen{}\left(1\right)\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-imprint-the_reserved_six_survive_any_message">
<p class="thm-label"><strong>Theorem 83</strong> (<code>the_reserved_six_survive_any_message</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_imprint_the_reserved_six_survive_any_message.html">sealed</a>.</p>
<pre class="thm-statement"><code>[alt 0, alt 5, ones 8, alt 115].all (fun m =&gt; let b := encodeBits m (b.getD 48 false == true) &amp;&amp; (b.getD 49 false == false) &amp;&amp; (b.getD 50 false == false) &amp;&amp; (b.getD 51 false == false) &amp;&amp; (b.getD 64 false == true) &amp;&amp; (b.getD 65 false == false))</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
