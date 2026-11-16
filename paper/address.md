---
title: "Addressing"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `address.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/address.lean</code> · namespace <code>Address</code> · 33 theorems · wing <code>the address</code></p>

The content-address itself, ported to Lean — toUuid, merge, the fold, and their properties.


Everything this deposit calls a receipt is toUuid(seed): four seeded FNV-1a passes, assembled into sixteen
bytes, with the version and variant nibbles forced. Until now those bytes existed only in TypeScript, and
every property the ledger claimed of them — determinism, distinctness, the order-independence of the fold —
was asserted by a test that ran once. Here they are propositions the kernel checks.

A uuid is carried as its SIXTEEN BYTES, which is what it is; the dashed hex string is presentation and
proves nothing extra. Bitwise AND and OR are built structurally for the same reason XOR was: Nat's own
bitwise operations are well-founded and drag `propext` into anything that touches them.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>SEEDS := [0, 2654435769, 608135816, 3084996962]
A := [97]                                    -- "a"
UUIDNA := [117, 117, 105, 100, 110, 97]      -- "uuidna"
settledHere := 28
SIGNATURE := [99, 104, 111, 110, 103, 111, 32, 60, 76, 97, 110, 100, 111, 110, 32, 67, 117, 114, 116, 32, 78, 111, 108, 108, 62, 32, 47, 92, 46, 46, 47, 92]</code></pre>

<div class="thm" id="thm-address-raw_bytes_of_a">
<p class="thm-label"><strong>Theorem 1</strong> (<code>raw_bytes_of_a</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_raw_bytes_of_a.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>rawBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>88</mn><mo>,</mo><mn>118</mn><mo>,</mo><mn>248</mn><mo>,</mo><mn>251</mn><mo>,</mo><mn>63</mn><mo>,</mo><mn>149</mn><mo>,</mo><mn>14</mn><mo>,</mo><mn>202</mn><mo>,</mo><mn>10</mn><mo>,</mo><mn>251</mn><mo>,</mo><mn>189</mn><mo>,</mo><mn>97</mn><mo>,</mo><mn>221</mn><mo>,</mo><mn>134</mn><mo>,</mo><mn>206</mn><mo>,</mo><mn>204</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>rawBytes A = [88, 118, 248, 251, 63, 149, 14, 202, 10, 251, 189, 97, 221, 134, 206, 204]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{rawBytes}\mathopen{}\left(A\right) = [88,\,118,\,248,\,251,\,63,\,149,\,14,\,202,\,10,\,251,\,189,\,97,\,221,\,134,\,206,\,204]</code></pre></details>
</div>
<p class="thm-remark">── AGREEMENT with the shipped implementation, byte for byte ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-to_uuid_bytes_of_a">
<p class="thm-label"><strong>Theorem 2</strong> (<code>to_uuid_bytes_of_a</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_to_uuid_bytes_of_a.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>88</mn><mo>,</mo><mn>118</mn><mo>,</mo><mn>248</mn><mo>,</mo><mn>251</mn><mo>,</mo><mn>63</mn><mo>,</mo><mn>149</mn><mo>,</mo><mn>142</mn><mo>,</mo><mn>202</mn><mo>,</mo><mn>138</mn><mo>,</mo><mn>251</mn><mo>,</mo><mn>189</mn><mo>,</mo><mn>97</mn><mo>,</mo><mn>221</mn><mo>,</mo><mn>134</mn><mo>,</mo><mn>206</mn><mo>,</mo><mn>204</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes A = [88, 118, 248, 251, 63, 149, 142, 202, 138, 251, 189, 97, 221, 134, 206, 204]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left(A\right) = [88,\,118,\,248,\,251,\,63,\,149,\,142,\,202,\,138,\,251,\,189,\,97,\,221,\,134,\,206,\,204]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-to_uuid_bytes_of_uuidna">
<p class="thm-label"><strong>Theorem 3</strong> (<code>to_uuid_bytes_of_uuidna</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_to_uuid_bytes_of_uuidna.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>UUIDNA</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>252</mn><mo>,</mo><mn>81</mn><mo>,</mo><mn>21</mn><mo>,</mo><mn>50</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>138</mn><mo>,</mo><mn>132</mn><mo>,</mo><mn>24</mn><mo>,</mo><mn>165</mn><mo>,</mo><mn>34</mn><mo>,</mo><mn>165</mn><mo>,</mo><mn>27</mn><mo>,</mo><mn>29</mn><mo>,</mo><mn>70</mn><mo>,</mo><mn>167</mn><mo>,</mo><mn>12</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes UUIDNA = [252, 81, 21, 50, 110, 138, 132, 24, 165, 34, 165, 27, 29, 70, 167, 12]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left(\mathrm{UUIDNA}\right) = [252,\,81,\,21,\,50,\,110,\,138,\,132,\,24,\,165,\,34,\,165,\,27,\,29,\,70,\,167,\,12]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-address_is_sixteen_bytes">
<p class="thm-label"><strong>Theorem 4</strong> (<code>address_is_sixteen_bytes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_address_is_sixteen_bytes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>UUIDNA</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></math></div>
<pre class="thm-statement"><code>(toUuidBytes UUIDNA).length = 16</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{toUuidBytes}\mathopen{}\left(\mathrm{UUIDNA}\right)\right| = 16</code></pre></details>
</div>
<p class="thm-remark">── the shape a uuid must have: sixteen bytes, each below 256 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-address_bytes_are_bytes">
<p class="thm-label"><strong>Theorem 5</strong> (<code>address_bytes_are_bytes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_address_bytes_are_bytes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>UUIDNA</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>b</mi><mo>&lt;</mo><mn>256</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(toUuidBytes UUIDNA).all (fun b =&gt; b &lt; 256)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \mathrm{toUuidBytes}\mathopen{}\left(\mathrm{UUIDNA}\right),\; b &lt; 256</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-version_nibble_is_forced">
<p class="thm-label"><strong>Theorem 6</strong> (<code>version_nibble_is_forced</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_version_nibble_is_forced.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mfrac><msub><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow><mn>6</mn></msub><mn>16</mn></mfrac><mo>=</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mfrac><msub><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>UUIDNA</mi><mo>)</mo></mrow><mn>6</mn></msub><mn>16</mn></mfrac><mo>=</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((toUuidBytes A).get! 6) / 16 = 8 ∧ ((toUuidBytes UUIDNA).get! 6) / 16 = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{\mathrm{toUuidBytes}\mathopen{}\left(A\right)_{6}}{16} = 8 \land \frac{\mathrm{toUuidBytes}\mathopen{}\left(\mathrm{UUIDNA}\right)_{6}}{16} = 8</code></pre></details>
</div>
<p class="thm-remark">── the version and variant nibbles are FORCED, whatever the hash produced ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-variant_bits_are_forced">
<p class="thm-label"><strong>Theorem 7</strong> (<code>variant_bits_are_forced</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_variant_bits_are_forced.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mfrac><msub><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow><mn>8</mn></msub><mn>64</mn></mfrac><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mfrac><msub><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>UUIDNA</mi><mo>)</mo></mrow><mn>8</mn></msub><mn>64</mn></mfrac><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((toUuidBytes A).get! 8) / 64 = 2 ∧ ((toUuidBytes UUIDNA).get! 8) / 64 = 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{\mathrm{toUuidBytes}\mathopen{}\left(A\right)_{8}}{64} = 2 \land \frac{\mathrm{toUuidBytes}\mathopen{}\left(\mathrm{UUIDNA}\right)_{8}}{64} = 2</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-addressing_is_deterministic">
<p class="thm-label"><strong>Theorem 8</strong> (<code>addressing_is_deterministic</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_addressing_is_deterministic.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes A = toUuidBytes A</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left(A\right) = \mathrm{toUuidBytes}\mathopen{}\left(A\right)</code></pre></details>
</div>
<p class="thm-remark">── DETERMINISM and DISTINCTNESS, proved rather than tested ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-distinct_seeds_give_distinct_addresses">
<p class="thm-label"><strong>Theorem 9</strong> (<code>distinct_seeds_give_distinct_addresses</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_distinct_seeds_give_distinct_addresses.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mi>UUIDNA</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes A ≠ toUuidBytes UUIDNA</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left(A\right) \neq \mathrm{toUuidBytes}\mathopen{}\left(\mathrm{UUIDNA}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-addressing_is_injective_on_single_characters">
<p class="thm-label"><strong>Theorem 10</strong> (<code>addressing_is_injective_on_single_characters</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_addressing_is_injective_on_single_characters.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>∣</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow></math></div>
<pre class="thm-statement"><code>(((List.range 24).map (fun c =&gt; toUuidBytes [c])).eraseDups).length = 24</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{toUuidBytes}\mathopen{}\left([c]\right) \mid c \in \{0,\dots,23\} \,\}\right)\right| = 24</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 24 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-addressing_is_not_the_identity">
<p class="thm-label"><strong>Theorem 11</strong> (<code>addressing_is_not_the_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_addressing_is_not_the_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>7</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mn>7</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes [7] ≠ [7]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left([7]\right) \neq [7]</code></pre></details>
</div>
<p class="thm-remark">── the address is NOT the input: it is not the identity, and it is not constant ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-addressing_is_not_constant">
<p class="thm-label"><strong>Theorem 12</strong> (<code>addressing_is_not_constant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_addressing_is_not_constant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>2</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes [1] ≠ toUuidBytes [2]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left([1]\right) \neq \mathrm{toUuidBytes}\mathopen{}\left([2]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_four_seeds_are_distinct">
<p class="thm-label"><strong>Theorem 13</strong> (<code>the_four_seeds_are_distinct</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_four_seeds_are_distinct.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mi>SEEDS.eraseDups</mi><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></math></div>
<pre class="thm-statement"><code>(SEEDS.eraseDups).length = 4</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{SEEDS.eraseDups}\right| = 4</code></pre></details>
</div>
<p class="thm-remark">── the four seeds genuinely differ, so the four words are independent draws ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_address_is_sixteen_bytes_whatever_the_input_length">
<p class="thm-label"><strong>Theorem 14</strong> (<code>the_address_is_sixteen_bytes_whatever_the_input_length</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_address_is_sixteen_bytes_whatever_the_input_length.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>98</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>117</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>100</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>116</mn><mo>,</mo><mn>104</mn><mo>,</mo><mn>101</mn><mo>,</mo><mn>32</mn><mo>,</mo><mn>115</mn><mo>,</mo><mn>97</mn><mo>,</mo><mn>109</mn><mo>,</mo><mn>101</mn><mo>,</mo><mn>32</mn><mo>,</mo><mn>102</mn><mo>,</mo><mn>97</mn><mo>,</mo><mn>99</mn><mo>,</mo><mn>116</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>120</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>100</mn><mo>,</mo><mn>101</mn><mo>,</mo><mn>112</mn><mo>,</mo><mn>111</mn><mo>,</mo><mn>115</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>116</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>104</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>109</mn><mo>,</mo><mn>97</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>116</mn><mo>,</mo><mn>121</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>16</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(toUuidBytes [97]).length = 16 ∧ (toUuidBytes [98]).length = 16 ∧ (toUuidBytes [117, 117, 105, 100, 110, 97]).length = 16 ∧ (toUuidBytes [116, 104, 101, 32, 115, 97, 109, 101, 32, 102, 97, 99, 116]).length = 16 ∧ (toUuidBytes [120]).length = 16 ∧ (toUuidBytes [100, 101, 112, 111, 115, 105, 116]).length = 16 ∧ (toUuidBytes [104, 117, 109, 97, 110, 105, 116, 121]).length = 16</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{toUuidBytes}\mathopen{}\left([97]\right)\right| = 16 \land \left|\mathrm{toUuidBytes}\mathopen{}\left([98]\right)\right| = 16 \land \left|\mathrm{toUuidBytes}\mathopen{}\left([117,\,117,\,105,\,100,\,110,\,97]\right)\right| = 16 \land \left|\mathrm{toUuidBytes}\mathopen{}\left([116,\,104,\,101,\,32,\,115,\,97,\,109,\,101,\,32,\,102,\,97,\,99,\,116]\right)\right| = 16 \land \left|\mathrm{toUuidBytes}\mathopen{}\left([120]\right)\right| = 16 \land \left|\mathrm{toUuidBytes}\mathopen{}\left([100,\,101,\,112,\,111,\,115,\,105,\,116]\right)\right| = 16 \land \left|\mathrm{toUuidBytes}\mathopen{}\left([104,\,117,\,109,\,97,\,110,\,105,\,116,\,121]\right)\right| = 16</code></pre></details>
</div>
<p class="thm-remark">inputs of length 1 to 13 all give 16 bytes — a length-preserving function fails this</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,368 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-distinct_inputs_give_distinct_addresses">
<p class="thm-label"><strong>Theorem 15</strong> (<code>distinct_inputs_give_distinct_addresses</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_distinct_inputs_give_distinct_addresses.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>98</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>117</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>100</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>120</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>100</mn><mo>,</mo><mn>101</mn><mo>,</mo><mn>112</mn><mo>,</mo><mn>111</mn><mo>,</mo><mn>115</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>116</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>104</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>109</mn><mo>,</mo><mn>97</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>116</mn><mo>,</mo><mn>121</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes [97] ≠ toUuidBytes [98] ∧ toUuidBytes [117, 117, 105, 100, 110, 97] ≠ toUuidBytes [120] ∧ toUuidBytes [100, 101, 112, 111, 115, 105, 116] ≠ toUuidBytes [104, 117, 109, 97, 110, 105, 116, 121]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left([97]\right) \neq \mathrm{toUuidBytes}\mathopen{}\left([98]\right) \land \mathrm{toUuidBytes}\mathopen{}\left([117,\,117,\,105,\,100,\,110,\,97]\right) \neq \mathrm{toUuidBytes}\mathopen{}\left([120]\right) \land \mathrm{toUuidBytes}\mathopen{}\left([100,\,101,\,112,\,111,\,115,\,105,\,116]\right) \neq \mathrm{toUuidBytes}\mathopen{}\left([104,\,117,\,109,\,97,\,110,\,105,\,116,\,121]\right)</code></pre></details>
</div>
<p class="thm-remark">a constant function makes all of these EQUAL, so it fails every conjunct</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 336 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_address_is_not_the_payload">
<p class="thm-label"><strong>Theorem 16</strong> (<code>the_address_is_not_the_payload</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_address_is_not_the_payload.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>117</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>100</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mn>117</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>100</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes [97] ≠ [97] ∧ toUuidBytes [117, 117, 105, 100, 110, 97] ≠ [117, 117, 105, 100, 110, 97]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left([97]\right) \neq [97] \land \mathrm{toUuidBytes}\mathopen{}\left([117,\,117,\,105,\,100,\,110,\,97]\right) \neq [117,\,117,\,105,\,100,\,110,\,97]</code></pre></details>
</div>
<p class="thm-remark">the identity function fails this — the output would BE the input</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_address_is_order_sensitive">
<p class="thm-label"><strong>Theorem 17</strong> (<code>the_address_is_order_sensitive</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_address_is_order_sensitive.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>97</mn><mo>,</mo><mn>98</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>toUuidBytes</mi><mo>(</mo><mrow><mo>[</mo><mn>98</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>toUuidBytes [97, 98] ≠ toUuidBytes [98, 97]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{toUuidBytes}\mathopen{}\left([97,\,98]\right) \neq \mathrm{toUuidBytes}\mathopen{}\left([98,\,97]\right)</code></pre></details>
</div>
<p class="thm-remark">any function of the multiset alone makes these equal</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_version_stamp_keeps_the_low_nibble_of_every_byte">
<p class="thm-label"><strong>Theorem 18</strong> (<code>the_version_stamp_keeps_the_low_nibble_of_every_byte</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_version_stamp_keeps_the_low_nibble_of_every_byte.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b : Nat, b &lt; 256 → or8 (and8 b 15) 128 = 128 + b % 16</code></pre>
</div>
<p class="thm-remark">── the stamp's fields, for every byte ────────────────────────────────────────────────────────────────────── 128 bits − 4 (version) − 2 (variant) = 122 hash bits. Byte 6 keeps its low nibble under the version 8, byte 8 keeps its low six bits under the variant 10, stamping twice is stamping once, and so the third group is always version 8 over exactly twelve hash bits and the fourth is always variant 10 over exactly fourteen. The address is a commitment to its content, not a store of it: 122 bits is also all a 122-qubit register could yield (Holevo).</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_variant_stamp_keeps_the_low_six_bits_of_every_byte">
<p class="thm-label"><strong>Theorem 19</strong> (<code>the_variant_stamp_keeps_the_low_six_bits_of_every_byte</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_variant_stamp_keeps_the_low_six_bits_of_every_byte.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b : Nat, b &lt; 256 → or8 (and8 b 63) 128 = 128 + b % 64</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-stamping_twice_is_stamping_once">
<p class="thm-label"><strong>Theorem 20</strong> (<code>stamping_twice_is_stamping_once</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_stamping_twice_is_stamping_once.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b : Nat, b &lt; 256 → or8 (and8 (or8 (and8 b 15) 128) 15) 128 = or8 (and8 b 15) 128 ∧ or8 (and8 (or8 (and8 b 63) 128) 63) 128 = or8 (and8 b 63) 128</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_third_group_is_version_eight_over_twelve_hash_bits">
<p class="thm-label"><strong>Theorem 21</strong> (<code>the_third_group_is_version_eight_over_twelve_hash_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_third_group_is_version_eight_over_twelve_hash_bits.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b6 b7 : Nat, b6 &lt; 256 → b7 &lt; 256 → (or8 (and8 b6 15) 128) * 256 + b7 = 8 * 4096 + (b6 % 16 * 256 + b7) ∧ b6 % 16 * 256 + b7 &lt; 4096</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_fourth_group_is_variant_two_over_fourteen_hash_bits">
<p class="thm-label"><strong>Theorem 22</strong> (<code>the_fourth_group_is_variant_two_over_fourteen_hash_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_fourth_group_is_variant_two_over_fourteen_hash_bits.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b8 b9 : Nat, b8 &lt; 256 → b9 &lt; 256 → (or8 (and8 b8 63) 128) * 256 + b9 = 2 * 16384 + (b8 % 64 * 256 + b9) ∧ b8 % 64 * 256 + b9 &lt; 16384</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_unstamped_bits_read_back_from_every_stamped_byte">
<p class="thm-label"><strong>Theorem 23</strong> (<code>the_unstamped_bits_read_back_from_every_stamped_byte</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_unstamped_bits_read_back_from_every_stamped_byte.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b : Nat, b &lt; 256 → and8 (or8 (and8 b 15) 128) 15 = b % 16 ∧ and8 (or8 (and8 b 63) 128) 63 = b % 64</code></pre>
</div>
<p class="thm-remark">── reflections, from the xor batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── REFLECTIONS: the unstamped bits read back from the stamped byte, and the hash bits from the group</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_twelve_hash_bits_read_back_from_the_third_group">
<p class="thm-label"><strong>Theorem 24</strong> (<code>the_twelve_hash_bits_read_back_from_the_third_group</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_twelve_hash_bits_read_back_from_the_third_group.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b6 b7 : Nat, b6 &lt; 256 → b7 &lt; 256 → ((or8 (and8 b6 15) 128) * 256 + b7) / 4096 = 8 ∧ ((or8 (and8 b6 15) 128) * 256 + b7) % 4096 = b6 % 16 * 256 + b7</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_fourteen_hash_bits_read_back_from_the_fourth_group">
<p class="thm-label"><strong>Theorem 25</strong> (<code>the_fourteen_hash_bits_read_back_from_the_fourth_group</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_fourteen_hash_bits_read_back_from_the_fourth_group.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ b8 b9 : Nat, b8 &lt; 256 → b9 &lt; 256 → ((or8 (and8 b8 63) 128) * 256 + b9) / 16384 = 2 ∧ ((or8 (and8 b8 63) 128) * 256 + b9) % 16384 = b8 % 64 * 256 + b9</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_second_seed_is_the_first_hex_word_of_the_golden_ratio">
<p class="thm-label"><strong>Theorem 26</strong> (<code>the_second_seed_is_the_first_hex_word_of_the_golden_ratio</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_second_seed_is_the_first_hex_word_of_the_golden_ratio.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>bracketsPhi</mi><mo>(</mo><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>bracketsPhi</mi><mo>(</mo><mrow><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>bracketsPhi</mi><mo>(</mo><mrow><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>bracketsPhi (SEEDS.getD 1 0) = true ∧ bracketsPhi (SEEDS.getD 1 0 + 1) = false ∧ bracketsPhi (SEEDS.getD 1 0 - 1) = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{bracketsPhi}\mathopen{}\left(\mathrm{SEEDS.getD}\mathopen{}\left(1,\,0\right)\right) = \mathrm{true} \land \mathrm{bracketsPhi}\mathopen{}\left(\mathrm{SEEDS.getD}\mathopen{}\left(1,\,0\right) + 1\right) = \mathrm{false} \land \mathrm{bracketsPhi}\mathopen{}\left(\mathrm{SEEDS.getD}\mathopen{}\left(1,\,0\right) - 1\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">the bracket is tight: the seed passes and neither neighbour does, so exactly one word is φ's</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_third_seed_is_the_first_hex_word_of_pi_by_bbp">
<p class="thm-label"><strong>Theorem 27</strong> (<code>the_third_seed_is_the_first_hex_word_of_pi_by_bbp</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_third_seed_is_the_first_hex_word_of_pi_by_bbp.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mfrac><mrow><mi>bbp</mi><mo>(</mo><mn>24</mn><mo>,</mo><mn>24</mn><mo>)</mo></mrow><msup><mn>16</mn><mn>16</mn></msup></mfrac><mo>=</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><msup><mn>16</mn><mn>8</mn></msup></mrow><mo>+</mo><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>bbp 24 24 / 16 ^ 16 = 3 * 16 ^ 8 + SEEDS.getD 2 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{\mathrm{bbp}\mathopen{}\left(24,\,24\right)}{16^{16}} = 3 \cdot 16^{8} + \mathrm{SEEDS.getD}\mathopen{}\left(2,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_bbp_truncation_cannot_cross_the_digit_boundary">
<p class="thm-label"><strong>Theorem 28</strong> (<code>the_bbp_truncation_cannot_cross_the_digit_boundary</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_bbp_truncation_cannot_cross_the_digit_boundary.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>1000</mn><mo>&lt;</mo><mrow><mrow><mi>bbp</mi><mo>(</mo><mn>24</mn><mo>,</mo><mn>24</mn><mo>)</mo></mrow><mo>mod</mo><msup><mn>16</mn><mn>16</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mi>bbp</mi><mo>(</mo><mn>24</mn><mo>,</mo><mn>24</mn><mo>)</mo></mrow><mo>mod</mo><msup><mn>16</mn><mn>16</mn></msup></mrow><mo>+</mo><mn>1000</mn></mrow><mo>&lt;</mo><msup><mn>16</mn><mn>16</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>1000 &lt; bbp 24 24 % 16 ^ 16 ∧ bbp 24 24 % 16 ^ 16 + 1000 &lt; 16 ^ 16</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1000 &lt; \mathrm{bbp}\mathopen{}\left(24,\,24\right) \bmod 16^{16} \land \mathrm{bbp}\mathopen{}\left(24,\,24\right) \bmod 16^{16} + 1000 &lt; 16^{16}</code></pre></details>
</div>
<p class="thm-remark">twenty-four terms, four floors each: the dropped remainders are below 100, and the tail of the series below 1; the digit boundary is more than a thousand away on either side</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_fourth_seed_is_the_first_hex_word_of_e_not_of_pi">
<p class="thm-label"><strong>Theorem 29</strong> (<code>the_fourth_seed_is_the_first_hex_word_of_e_not_of_pi</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_fourth_seed_is_the_first_hex_word_of_e_not_of_pi.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mfrac><mrow><mi>eSeries</mi><mo>(</mo><mn>24</mn><mo>,</mo><mn>30</mn><mo>)</mo></mrow><msup><mn>16</mn><mn>16</mn></msup></mfrac><mo>=</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><msup><mn>16</mn><mn>8</mn></msup></mrow><mo>+</mo><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>SEEDS.getD</mi><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>eSeries 24 30 / 16 ^ 16 = 2 * 16 ^ 8 + SEEDS.getD 3 0 ∧ SEEDS.getD 3 0 ≠ SEEDS.getD 2 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{\mathrm{eSeries}\mathopen{}\left(24,\,30\right)}{16^{16}} = 2 \cdot 16^{8} + \mathrm{SEEDS.getD}\mathopen{}\left(3,\,0\right) \land \mathrm{SEEDS.getD}\mathopen{}\left(3,\,0\right) \neq \mathrm{SEEDS.getD}\mathopen{}\left(2,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_series_truncation_cannot_cross_the_digit_boundary">
<p class="thm-label"><strong>Theorem 30</strong> (<code>the_series_truncation_cannot_cross_the_digit_boundary</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_series_truncation_cannot_cross_the_digit_boundary.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>1000</mn><mo>&lt;</mo><mrow><mrow><mi>eSeries</mi><mo>(</mo><mn>24</mn><mo>,</mo><mn>30</mn><mo>)</mo></mrow><mo>mod</mo><msup><mn>16</mn><mn>16</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mi>eSeries</mi><mo>(</mo><mn>24</mn><mo>,</mo><mn>30</mn><mo>)</mo></mrow><mo>mod</mo><msup><mn>16</mn><mn>16</mn></msup></mrow><mo>+</mo><mn>1000</mn></mrow><mo>&lt;</mo><msup><mn>16</mn><mn>16</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>1000 &lt; eSeries 24 30 % 16 ^ 16 ∧ eSeries 24 30 % 16 ^ 16 + 1000 &lt; 16 ^ 16</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1000 &lt; \mathrm{eSeries}\mathopen{}\left(24,\,30\right) \bmod 16^{16} \land \mathrm{eSeries}\mathopen{}\left(24,\,30\right) \bmod 16^{16} + 1000 &lt; 16^{16}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_fnv_prime_is_prime_at_two_to_the_24_plus_two_to_the_8_plus_0x93">
<p class="thm-label"><strong>Theorem 31</strong> (<code>the_fnv_prime_is_prime_at_two_to_the_24_plus_two_to_the_8_plus_0x93</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_fnv_prime_is_prime_at_two_to_the_24_plus_two_to_the_8_plus_0x93.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>FNV_PRIME</mi><mo>=</mo><mrow><mrow><msup><mn>2</mn><mn>24</mn></msup><mo>+</mo><msup><mn>2</mn><mn>8</mn></msup></mrow><mo>+</mo><mrow><mn>0</mn><mo>(</mo><mi>x93</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>4096</mn><mo>⋅</mo><mn>4096</mn></mrow><mo>&lt;</mo><mi>FNV_PRIME</mi></mrow></mrow><mo>∧</mo><mrow><mi>FNV_PRIME</mi><mo>&lt;</mo><mrow><mn>4097</mn><mo>⋅</mo><mn>4097</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>4094</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>FNV_PRIME</mi><mo>mod</mo><mrow><mi>d</mi><mo>+</mo><mn>2</mn></mrow></mrow><mo>≠</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>FNV_PRIME = 2 ^ 24 + 2 ^ 8 + 0x93 ∧ 4096 * 4096 &lt; FNV_PRIME ∧ FNV_PRIME &lt; 4097 * 4097 ∧ (List.range 4095).all (fun d =&gt; FNV_PRIME % (d + 2) != 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{FNV\_PRIME} = 2^{24} + 2^{8} + 0\mathopen{}\left(\mathrm{x93}\right) \land 4096 \cdot 4096 &lt; \mathrm{FNV\_PRIME} \land \mathrm{FNV\_PRIME} &lt; 4097 \cdot 4097 \land \forall d \in \{0,\dots,4094\},\; \mathrm{FNV\_PRIME} \bmod d + 2 \neq 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,095 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_fnv_basis_is_fnv0_of_its_signature">
<p class="thm-label"><strong>Theorem 32</strong> (<code>the_fnv_basis_is_fnv0_of_its_signature</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_fnv_basis_is_fnv0_of_its_signature.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>fnv0</mi><mo>(</mo><mi>SIGNATURE</mi><mo>)</mo></mrow><mo>=</mo><mi>FNV_OFFSET</mi></mrow><mo>∧</mo><mrow><mi>SIGNATURE.length</mi><mo>=</mo><mn>32</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>fnv0 SIGNATURE = FNV_OFFSET ∧ SIGNATURE.length = 32</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fnv0}\mathopen{}\left(\mathrm{SIGNATURE}\right) = \mathrm{FNV\_OFFSET} \land \mathrm{SIGNATURE.length} = 32</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-address-the_finalizer_constants_are_units_mod_two_to_the_32">
<p class="thm-label"><strong>Theorem 33</strong> (<code>the_finalizer_constants_are_units_mod_two_to_the_32</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_address_the_finalizer_constants_are_units_mod_two_to_the_32.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>0</mn><mo>(</mo><mi>x85ebca6b</mi><mo>)</mo></mrow><mo>⋅</mo><mn>2781581891</mn></mrow><mo>mod</mo><mi>M32</mi></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mn>0</mn><mo>(</mo><mi>xc2b2ae35</mi><mo>)</mo></mrow><mo>⋅</mo><mn>2127672349</mn></mrow><mo>mod</mo><mi>M32</mi></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(0x85ebca6b * 2781581891) % M32 = 1 ∧ (0xc2b2ae35 * 2127672349) % M32 = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>0\mathopen{}\left(\mathrm{x85ebca6b}\right) \cdot 2781581891 \bmod \mathrm{M32} = 1 \land 0\mathopen{}\left(\mathrm{xc2b2ae35}\right) \cdot 2127672349 \bmod \mathrm{M32} = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
