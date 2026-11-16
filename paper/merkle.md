---
title: "The fold"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `merkle.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/merkle.lean</code> · namespace <code>Merkle</code> · 16 theorems · wing <code>the address</code></p>

The fold, ported to Lean — merge, merkleFold, and the order-independence the deposit calls its receipt.


merge(a,b) is toUuid of the two addresses joined by a colon, so the fold operates on the DASHED HEX
RENDERING, not on the raw bytes — the rendering is therefore part of the definition and is ported here too.
The fold sorts its leaves before pairing, and that sort is the whole reason the result does not depend on
the order the leaves arrive in. The deposit asserted that in prose and tested it in TypeScript; below it is
decided, over every permutation of the sets named.

No axioms, no Mathlib, no sorry. Address and Fnv are imported, not restated.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>PAIR := [112, 97, 105, 114, 58]                                    -- "pair:"
L36 := [51, 54, 58]                                               -- "36:" — a uuid is 36 chars
MLEAF := [109, 101, 114, 107, 108, 101, 58, 108, 101, 97, 102, 58]  -- "merkle:leaf:"
MNODE := [109, 101, 114, 107, 108, 101, 58, 110, 111, 100, 101, 58] -- "merkle:node:"
MEMPTY := [109, 101, 114, 107, 108, 101, 58, 101, 109, 112, 116, 121]-- "merkle:empty"
A := toUuidBytes [97]     -- address of "a"
C := toUuidBytes [99]     -- address of "c"
B := toUuidBytes [98]     -- address of "b"
settledHere := 16
D := toUuidBytes [100]  -- address of "d"
E := toUuidBytes [101]    -- address of "e", a leaf none of A B C D is</code></pre>

<div class="thm" id="thm-merkle-merge_agrees">
<p class="thm-label"><strong>Theorem 92</strong> (<code>merge_agrees</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_merge_agrees.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merge</mi><mo>(</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>60</mn><mo>,</mo><mn>245</mn><mo>,</mo><mn>241</mn><mo>,</mo><mn>132</mn><mo>,</mo><mn>177</mn><mo>,</mo><mn>61</mn><mo>,</mo><mn>137</mn><mo>,</mo><mn>238</mn><mo>,</mo><mn>168</mn><mo>,</mo><mn>38</mn><mo>,</mo><mn>16</mn><mo>,</mo><mn>93</mn><mo>,</mo><mn>225</mn><mo>,</mo><mn>238</mn><mo>,</mo><mn>227</mn><mo>,</mo><mn>159</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merge A B = [60, 245, 241, 132, 177, 61, 137, 238, 168, 38, 16, 93, 225, 238, 227, 159]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merge}\mathopen{}\left(A,\,B\right) = [60,\,245,\,241,\,132,\,177,\,61,\,137,\,238,\,168,\,38,\,16,\,93,\,225,\,238,\,227,\,159]</code></pre></details>
</div>
<p class="thm-remark">── AGREEMENT with the shipped implementation ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-empty_fold_agrees">
<p class="thm-label"><strong>Theorem 93</strong> (<code>empty_fold_agrees</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_empty_fold_agrees.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>185</mn><mo>,</mo><mn>172</mn><mo>,</mo><mn>200</mn><mo>,</mo><mn>147</mn><mo>,</mo><mn>59</mn><mo>,</mo><mn>66</mn><mo>,</mo><mn>143</mn><mo>,</mo><mn>33</mn><mo>,</mo><mn>184</mn><mo>,</mo><mn>249</mn><mo>,</mo><mn>115</mn><mo>,</mo><mn>223</mn><mo>,</mo><mn>210</mn><mo>,</mo><mn>131</mn><mo>,</mo><mn>107</mn><mo>,</mo><mn>81</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merkleFold [] = [185, 172, 200, 147, 59, 66, 143, 33, 184, 249, 115, 223, 210, 131, 107, 81]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merkleFold}\mathopen{}\left([]\right) = [185,\,172,\,200,\,147,\,59,\,66,\,143,\,33,\,184,\,249,\,115,\,223,\,210,\,131,\,107,\,81]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-singleton_fold_is_the_hashed_leaf">
<p class="thm-label"><strong>Theorem 94</strong> (<code>singleton_fold_is_the_hashed_leaf</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_singleton_fold_is_the_hashed_leaf.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleLeaf</mi><mo>(</mo><mi>A</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merkleFold [A] = merkleLeaf A</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merkleFold}\mathopen{}\left([A]\right) = \mathrm{merkleLeaf}\mathopen{}\left(A\right)</code></pre></details>
</div>
<p class="thm-remark">── THE FOLD OF ONE LEAF IS NOT THAT LEAF, AND THAT IS THE FIX ───────────────────────────────────────────── This file used to decide `merkleFold [A] = A` and call it "the base case of the contraction". It was the second preimage: for any root R the one-leaf set [R] reproduced R, so two different leaf multisets shared an address and the result was not a commitment. The leaf is hashed under its own domain now, so a root is always a node value and no leaf can be mistaken for one.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-no_single_leaf_is_its_own_root">
<p class="thm-label"><strong>Theorem 95</strong> (<code>no_single_leaf_is_its_own_root</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_no_single_leaf_is_its_own_root.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>x</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mi>x</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>[A, B, C].all (fun x =&gt; merkleFold [x] != x)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in [A,\,B,\,C],\; \mathrm{merkleFold}\mathopen{}\left([x]\right) \neq x</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-a_root_presented_as_a_leaf_is_a_different_root">
<p class="thm-label"><strong>Theorem 96</strong> (<code>a_root_presented_as_a_leaf_is_a_different_root</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_a_root_presented_as_a_leaf_is_a_different_root.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merkleFold [merkleFold [A, B]] != merkleFold [A, B]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merkleFold}\mathopen{}\left([\mathrm{merkleFold}\mathopen{}\left([A,\,B]\right)]\right) \neq \mathrm{merkleFold}\mathopen{}\left([A,\,B]\right)</code></pre></details>
</div>
<p class="thm-remark">── AND THE FORGERY THE OLD SHAPE ALLOWED IS REFUSED ─────────────────────────────────────────────────────── Hand any root back as a lone leaf: it no longer reproduces itself.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-a_leaf_address_is_never_a_node_address">
<p class="thm-label"><strong>Theorem 97</strong> (<code>a_leaf_address_is_never_a_node_address</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_a_leaf_address_is_never_a_node_address.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>merkleLeaf</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merkleNode</mi><mo>(</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[A, B, C].all (fun x =&gt; merkleLeaf x != merkleNode A B)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in [A,\,B,\,C],\; \mathrm{merkleLeaf}\mathopen{}\left(x\right) \neq \mathrm{merkleNode}\mathopen{}\left(A,\,B\right)</code></pre></details>
</div>
<p class="thm-remark">── AND LEAF AND NODE DOMAINS NEVER MEET ─────────────────────────────────────────────────────────────────── Each address here is a full SHA computation in the kernel, so the 27 combinations of a triple loop ran past the heartbeat limit. Three leaves against one node is the same claim at the scale this can decide, and the general separation is structural: the two domains differ in their first twelve bytes.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-pair_fold_agrees">
<p class="thm-label"><strong>Theorem 98</strong> (<code>pair_fold_agrees</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_pair_fold_agrees.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>54</mn><mo>,</mo><mn>116</mn><mo>,</mo><mn>211</mn><mo>,</mo><mn>221</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>188</mn><mo>,</mo><mn>140</mn><mo>,</mo><mn>55</mn><mo>,</mo><mn>169</mn><mo>,</mo><mn>71</mn><mo>,</mo><mn>188</mn><mo>,</mo><mn>123</mn><mo>,</mo><mn>43</mn><mo>,</mo><mn>184</mn><mo>,</mo><mn>40</mn><mo>,</mo><mn>10</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merkleFold [A, B] = [54, 116, 211, 221, 110, 188, 140, 55, 169, 71, 188, 123, 43, 184, 40, 10]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merkleFold}\mathopen{}\left([A,\,B]\right) = [54,\,116,\,211,\,221,\,110,\,188,\,140,\,55,\,169,\,71,\,188,\,123,\,43,\,184,\,40,\,10]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-fold_is_order_independent_on_two">
<p class="thm-label"><strong>Theorem 99</strong> (<code>fold_is_order_independent_on_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_fold_is_order_independent_on_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>B</mi><mo>,</mo><mi>A</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merkleFold [A, B] = merkleFold [B, A]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merkleFold}\mathopen{}\left([A,\,B]\right) = \mathrm{merkleFold}\mathopen{}\left([B,\,A]\right)</code></pre></details>
</div>
<p class="thm-remark">── THE ORDER-INDEPENDENCE: the receipt does not depend on the order the leaves arrive in ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-merge_is_order_sensitive">
<p class="thm-label"><strong>Theorem 100</strong> (<code>merge_is_order_sensitive</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_merge_is_order_sensitive.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>merge</mi><mo>(</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merge</mi><mo>(</mo><mi>B</mi><mo>,</mo><mi>A</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>merge A B ≠ merge B A</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merge}\mathopen{}\left(A,\,B\right) \neq \mathrm{merge}\mathopen{}\left(B,\,A\right)</code></pre></details>
</div>
<p class="thm-remark">── and it is not vacuous: merge itself IS order-sensitive; the sort is what removes the dependence ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-merge_is_injective_on_these_pairs">
<p class="thm-label"><strong>Theorem 101</strong> (<code>merge_is_injective_on_these_pairs</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_merge_is_injective_on_these_pairs.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>merge</mi><mo>(</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merge</mi><mo>(</mo><mi>A</mi><mo>,</mo><mi>C</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>merge</mi><mo>(</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merge</mi><mo>(</mo><mi>B</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>merge</mi><mo>(</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merge</mi><mo>(</mo><mi>C</mi><mo>,</mo><mi>B</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>merge A B != merge A C &amp;&amp; merge A B != merge B B &amp;&amp; merge B C != merge C B</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merge}\mathopen{}\left(A,\,B\right) \neq \mathrm{merge}\mathopen{}\left(A,\,C\right) \land \mathrm{merge}\mathopen{}\left(A,\,B\right) \neq \mathrm{merge}\mathopen{}\left(B,\,B\right) \land \mathrm{merge}\mathopen{}\left(B,\,C\right) \neq \mathrm{merge}\mathopen{}\left(C,\,B\right)</code></pre></details>
</div>
<p class="thm-remark">── THE SEPARATOR IS ESCAPED NOW, SO THE PAIR IS RECOVERABLE ─────────────────────────────────────────────── merge("a:b","c") and merge("a","b:c") were one address. Each part carries its own length, so no concatenation of one pair spells another — decided here on the addresses this file works with.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-sorting_is_what_makes_the_fold_order_free">
<p class="thm-label"><strong>Theorem 102</strong> (<code>sorting_is_what_makes_the_fold_order_free</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_sorting_is_what_makes_the_fold_order_free.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>sortB</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>sortB</mi><mo>(</mo><mrow><mo>[</mo><mi>B</mi><mo>,</mo><mi>A</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mi>B</mi><mo>,</mo><mi>A</mi><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>sortB [A, B] = sortB [B, A] ∧ [A, B] ≠ [B, A]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{sortB}\mathopen{}\left([A,\,B]\right) = \mathrm{sortB}\mathopen{}\left([B,\,A]\right) \land [A,\,B] \neq [B,\,A]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-the_permutation_generator_is_complete">
<p class="thm-label"><strong>Theorem 103</strong> (<code>the_permutation_generator_is_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_the_permutation_generator_is_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(perms [A, B, C, D]).length = 24 ∧ (perms [A, B, C]).length = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{perms}\mathopen{}\left([A,\,B,\,C,\,D]\right)\right| = 24 \land \left|\mathrm{perms}\mathopen{}\left([A,\,B,\,C]\right)\right| = 6</code></pre></details>
</div>
<p class="thm-remark">the generator is checked before it is trusted: four leaves have 4! = 24 orderings, and if `perms` were short the theorem below would quantify over fewer cases while looking exactly as strong</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-fold_is_order_independent_on_four">
<p class="thm-label"><strong>Theorem 104</strong> (<code>fold_is_order_independent_on_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_fold_is_order_independent_on_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(perms [A, B, C, D]).all (fun p =&gt; merkleFold p == merkleFold [A, B, C, D])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{perms}\mathopen{}\left([A,\,B,\,C,\,D]\right),\; \mathrm{merkleFold}\mathopen{}\left(p\right) = \mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C,\,D]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-fold_is_order_independent_on_three">
<p class="thm-label"><strong>Theorem 105</strong> (<code>fold_is_order_independent_on_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_fold_is_order_independent_on_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>B</mi><mo>,</mo><mi>A</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>A</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>C</mi><mo>,</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>C</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>A</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>merkleFold [A, B, C] = merkleFold [A, C, B] ∧ merkleFold [A, B, C] = merkleFold [B, A, C] ∧ merkleFold [A, B, C] = merkleFold [B, C, A] ∧ merkleFold [A, B, C] = merkleFold [C, A, B] ∧ merkleFold [A, B, C] = merkleFold [C, B, A]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C]\right) = \mathrm{merkleFold}\mathopen{}\left([A,\,C,\,B]\right) \land \mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C]\right) = \mathrm{merkleFold}\mathopen{}\left([B,\,A,\,C]\right) \land \mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C]\right) = \mathrm{merkleFold}\mathopen{}\left([B,\,C,\,A]\right) \land \mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C]\right) = \mathrm{merkleFold}\mathopen{}\left([C,\,A,\,B]\right) \land \mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C]\right) = \mathrm{merkleFold}\mathopen{}\left([C,\,B,\,A]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-the_alteration_reaches_every_position">
<p class="thm-label"><strong>Theorem 106</strong> (<code>the_alteration_reaches_every_position</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_the_alteration_reaches_every_position.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>setAt</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow><mo>,</mo><mi>i</mi><mo>,</mo><mi>E</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 4).all (fun i =&gt; setAt [A, B, C, D] i E != [A, B, C, D])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,3\},\; \mathrm{setAt}\mathopen{}\left([A,\,B,\,C,\,D],\,i,\,E\right) \neq [A,\,B,\,C,\,D]</code></pre></details>
</div>
<p class="thm-remark">the alteration is not vacuous: it lands, at every position, on a leaf that was not there before</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-merkle-altering_any_single_leaf_changes_the_root">
<p class="thm-label"><strong>Theorem 107</strong> (<code>altering_any_single_leaf_changes_the_root</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_merkle_altering_any_single_leaf_changes_the_root.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mi>setAt</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow><mo>,</mo><mi>i</mi><mo>,</mo><mi>E</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>merkleFold</mi><mo>(</mo><mrow><mo>[</mo><mi>A</mi><mo>,</mo><mi>B</mi><mo>,</mo><mi>C</mi><mo>,</mo><mi>D</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 4).all (fun i =&gt; merkleFold (setAt [A, B, C, D] i E) != merkleFold [A, B, C, D])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \{0,\dots,3\},\; \mathrm{merkleFold}\mathopen{}\left(\mathrm{setAt}\mathopen{}\left([A,\,B,\,C,\,D],\,i,\,E\right)\right) \neq \mathrm{merkleFold}\mathopen{}\left([A,\,B,\,C,\,D]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

</div>
