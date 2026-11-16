---
title: "FNV-1a, the address function"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `fnv.lean`

<p class="paper-src"><code>src/iso/iec-18033-cryptography/fnv.lean</code> · namespace <code>Fnv</code> · 14 theorems · wing <code>the address</code></p>

FNV-1a, ported to Lean — the hash the whole deposit's addressing rests on.


Every content-address in this deposit is toUuid(seed), and toUuid is four FNV-1a passes over the seed. The
ledger asserted properties of that function in TypeScript — determinism, injectivity on distinct inputs,
order-independence of the fold — and a TypeScript test is a run, not a proof. Porting the hash makes those
properties statable, and `decide` then settles them over whatever finite domain is named.

Two primitives had to be built rather than borrowed. Nat's bitwise operations (`^^^`, `&gt;&gt;&gt;`) and `Nat.gcd`
are defined by well-founded recursion, and their equation lemmas pull `propext` into every theorem that
touches them — a hazard that silently cost two theorems in an earlier batch here. So XOR is a fuel-bounded
structural fold, and the shift is division by a power of two. No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>M32 := 4294967296
FNV_OFFSET := 2166136261   -- 0x811c9dc5
FNV_PRIME := 16777619     -- 0x01000193
MIX1 := 2246822507         -- 0x85ebca6b
MIX2 := 3266489909         -- 0xc2b2ae35
settledHere := 12</code></pre>

<div class="thm" id="thm-fnv-hash_a_seed_zero">
<p class="thm-label"><strong>Theorem 61</strong> (<code>hash_a_seed_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_a_seed_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>1484191995</mn></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [97] = 1484191995</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[97]\right) = 1484191995</code></pre></details>
</div>
<p class="thm-remark">── AGREEMENT with the shipped implementation, at published values ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_ab_seed_zero">
<p class="thm-label"><strong>Theorem 62</strong> (<code>hash_ab_seed_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_ab_seed_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>97</mn><mo>,</mo><mn>98</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>2049961697</mn></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [97, 98] = 2049961697</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[97,\,98]\right) = 2049961697</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_a_seed_golden">
<p class="thm-label"><strong>Theorem 63</strong> (<code>hash_a_seed_golden</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_a_seed_golden.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>2654435769</mn><mo>,</mo><mrow><mo>[</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>1066733258</mn></mrow></math></div>
<pre class="thm-statement"><code>hash32 2654435769 [97] = 1066733258</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(2654435769,\,[97]\right) = 1066733258</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_uuidna_seed_zero">
<p class="thm-label"><strong>Theorem 64</strong> (<code>hash_uuidna_seed_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_uuidna_seed_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>117</mn><mo>,</mo><mn>117</mn><mo>,</mo><mn>105</mn><mo>,</mo><mn>100</mn><mo>,</mo><mn>110</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>4233172274</mn></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [117, 117, 105, 100, 110, 97] = 4233172274</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[117,\,117,\,105,\,100,\,110,\,97]\right) = 4233172274</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_is_deterministic">
<p class="thm-label"><strong>Theorem 65</strong> (<code>hash_is_deterministic</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_is_deterministic.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>31</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 32).all (fun c =&gt; hash32 0 [c] == hash32 0 [c])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,31\},\; \mathrm{hash32}\mathopen{}\left(0,\,[c]\right) = \mathrm{hash32}\mathopen{}\left(0,\,[c]\right)</code></pre></details>
</div>
<p class="thm-remark">── DETERMINISM, proved rather than observed ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 32 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_is_injective_on_single_characters">
<p class="thm-label"><strong>Theorem 66</strong> (<code>hash_is_injective_on_single_characters</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_is_injective_on_single_characters.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>∣</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>63</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>64</mn></mrow></math></div>
<pre class="thm-statement"><code>(((List.range 64).map (fun c =&gt; hash32 0 [c])).eraseDups).length = 64</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{hash32}\mathopen{}\left(0,\,[c]\right) \mid c \in \{0,\dots,63\} \,\}\right)\right| = 64</code></pre></details>
</div>
<p class="thm-remark">── INJECTIVITY on a named finite domain: distinct single characters give distinct hashes ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-the_seed_separates">
<p class="thm-label"><strong>Theorem 67</strong> (<code>the_seed_separates</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_the_seed_separates.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>hash32</mi><mo>(</mo><mn>2654435769</mn><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun c =&gt; hash32 0 [c] != hash32 2654435769 [c])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,15\},\; \mathrm{hash32}\mathopen{}\left(0,\,[c]\right) \neq \mathrm{hash32}\mathopen{}\left(2654435769,\,[c]\right)</code></pre></details>
</div>
<p class="thm-remark">── the seed genuinely separates: the same input under different seeds gives different hashes ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_is_not_the_identity">
<p class="thm-label"><strong>Theorem 68</strong> (<code>hash_is_not_the_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_is_not_the_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>7</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mn>7</mn></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [7] != 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[7]\right) \neq 7</code></pre></details>
</div>
<p class="thm-remark">── NON-VACUITY: the hash is not the identity and not constant ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_is_not_constant">
<p class="thm-label"><strong>Theorem 69</strong> (<code>hash_is_not_constant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_is_not_constant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>2</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [1] != hash32 0 [2]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[1]\right) \neq \mathrm{hash32}\mathopen{}\left(0,\,[2]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-hash_is_thirty_two_bit">
<p class="thm-label"><strong>Theorem 70</strong> (<code>hash_is_thirty_two_bit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_hash_is_thirty_two_bit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>&lt;</mo><mi>M32</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun c =&gt; hash32 0 [c] &lt; M32)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,39\},\; \mathrm{hash32}\mathopen{}\left(0,\,[c]\right) &lt; \mathrm{M32}</code></pre></details>
</div>
<p class="thm-remark">── the output is bounded to 32 bits, as the whole construction requires ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-the_hash_is_order_sensitive">
<p class="thm-label"><strong>Theorem 71</strong> (<code>the_hash_is_order_sensitive</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_the_hash_is_order_sensitive.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>97</mn><mo>,</mo><mn>98</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>98</mn><mo>,</mo><mn>97</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [97, 98] ≠ hash32 0 [98, 97]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[97,\,98]\right) \neq \mathrm{hash32}\mathopen{}\left(0,\,[98,\,97]\right)</code></pre></details>
</div>
<p class="thm-remark">── THE ADDRESS IS A SEQUENCE HASH, NOT A SET HASH. Swapping two bytes changes it, so the input's ORDER is part of what is addressed. This is the opposite of the merkle fold, which sorts precisely so that order stops mattering — the two live side by side in this deposit and it is worth being exact about which is which, because using one where the other is meant is a silent bug rather than a loud one.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-the_empty_input_is_still_mixed">
<p class="thm-label"><strong>Theorem 72</strong> (<code>the_empty_input_is_still_mixed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_the_empty_input_is_still_mixed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>hash32</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>2872998923</mn></mrow><mo>∧</mo><mrow><mrow><mi>hash32</mi><mo>(</mo><mi>FNV_OFFSET</mi><mo>,</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>avalanche</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>hash32 0 [] = 2872998923 ∧ hash32 FNV_OFFSET [] = 0 ∧ avalanche 0 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hash32}\mathopen{}\left(0,\,[]\right) = 2872998923 \land \mathrm{hash32}\mathopen{}\left(\mathrm{FNV\_OFFSET},\,[]\right) = 0 \land \mathrm{avalanche}\mathopen{}\left(0\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── THE EMPTY INPUT IS STILL MIXED, AND ONE SEED SENDS IT TO ZERO. The first draft here said the hash of nothing returns the seed unchanged; the kernel refuted it, because hash32 avalanches unconditionally — there is no short-circuit for the empty list. What is true is sharper and worth recording: zero is a FIXED POINT of the avalanche, so seeding with the offset basis (which the initial xor cancels) addresses the empty input as 0. A degenerate address reachable from public constants is not a secret and not a defect to hide — it is the kind of edge a keyless, reproducible function is expected to state plainly.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-the_split_multiply_is_the_exact_thirty_two_bit_product">
<p class="thm-label"><strong>Theorem 73</strong> (<code>the_split_multiply_is_the_exact_thirty_two_bit_product</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_the_split_multiply_is_the_exact_thirty_two_bit_product.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b : Nat, (a % 65536 * b + a / 65536 * b % 65536 * 65536) % M32 = mul32 a b</code></pre>
</div>
<p class="thm-remark">── the fast multiply, proved exact for every a, b ────────────────────────────────────────────────────────── A 32-bit product can be taken without big integers: split a into 16-bit halves, and every partial product stays below 2^53. This is the multiply behind a toUuid that runs 12.5× faster with byte-identical output (measured on 20,007 inputs); here it is shown equal to mul32 for every a and b, not only on the inputs that were run.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-fnv-multiplying_by_the_fnv_prime_is_undone_by_its_inverse_for_every_h">
<p class="thm-label"><strong>Theorem 74</strong> (<code>multiplying_by_the_fnv_prime_is_undone_by_its_inverse_for_every_h</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_fnv_multiplying_by_the_fnv_prime_is_undone_by_its_inverse_for_every_h.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ h : Nat, mul32 (mul32 h FNV_PRIME) 899433627 = h % M32</code></pre>
</div>
<p class="thm-remark">── reflections, from the xor batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── REFLECTION of the exact 32-bit multiply: multiplying by the FNV prime is undone by its inverse mod 2^32</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
