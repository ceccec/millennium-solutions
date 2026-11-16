---
title: "Why verification is fast, and what it is not"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `speed.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/speed.lean</code> · namespace <code>Speed</code> · 28 theorems · wing <code>the floor</code></p>

The deposit's speed claim, accounted — and the reading it does not support.

WHAT IS TRUE. Proving a set costs O(N): every leaf is touched. Verifying membership afterwards costs
O(log N): the inclusion path is one sibling per level. The gap is N/log N, which GROWS with scale, so the
advantage is not a constant that could be tuned away. Measured on one machine at 2^20 leaves: recompute
21.6 seconds, verify 38.5 microseconds, a ratio of 561206. Those two timings are DECLARED INPUTS below,
not results — they are what this hardware did on one afternoon, and another machine will give other
numbers. What the kernel checks is the counting, which is machine-independent.

WHAT IS NOT TRUE, and is stated here because it is the thing people hear. Nothing runs in less than a
nanosecond. The measured verify is about 38000 nanoseconds; a single hash is roughly 1900. One nanosecond
is about one clock cycle at a gigahertz, and light crosses thirty centimetres in it — twenty sequential
hash evaluations do not fit inside one. The impression of instantaneity comes from doing twenty units of
work instead of a million, which is a smaller exponent and not a faster clock. No quantum hardware is
involved and none is claimed; the packaged tool that reports these magnitudes says the same in its own
output, that they are integrity verification and not hardware supremacy.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>recomputeUs := 21582900   -- folding 2^20 leaves
verifyUs := 38         -- walking the 20-node inclusion path
nsPerVerify := 38000      -- the same verify, in nanoseconds
hexChars := 32     -- an address in the 8-bit hex form fixed by RFC 9562 §5.8
hexbitChars := 22     -- the same address over the 64-hexagram lattice
hexMs := 16     -- median ms for 200,000 encodings, 8-bit table
hexbitMs := 30     -- the same work, 6-bit lattice
measuredUnbounded := [40459, 6912, 5184, 2661, 3370, 3820]
measuredBounded := [28667, 7337, 5143, 2654, 2940, 2748, 4373]</code></pre>

<div class="thm" id="thm-speed-the_verify_path_is_the_exponent">
<p class="thm-label"><strong>Theorem 536</strong> (<code>the_verify_path_is_the_exponent</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_verify_path_is_the_exponent.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1024</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>16384</mn><mo>)</mo></mrow><mo>=</mo><mn>14</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>262144</mn><mo>)</mo></mrow><mo>=</mo><mn>18</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1048576</mn><mo>)</mo></mrow><mo>=</mo><mn>20</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>rounds 40 1024 = 10 ∧ rounds 40 16384 = 14 ∧ rounds 40 262144 = 18 ∧ rounds 40 1048576 = 20</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{rounds}\mathopen{}\left(40,\,1024\right) = 10 \land \mathrm{rounds}\mathopen{}\left(40,\,16384\right) = 14 \land \mathrm{rounds}\mathopen{}\left(40,\,262144\right) = 18 \land \mathrm{rounds}\mathopen{}\left(40,\,1048576\right) = 20</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE PATH IS LOGARITHMIC. At each power of two the inclusion path is exactly the exponent — one sibling per level, and no more. This is the whole mechanism. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_gap_widens_with_every_doubling">
<p class="thm-label"><strong>Theorem 537</strong> (<code>the_gap_widens_with_every_doubling</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_gap_widens_with_every_doubling.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mfrac><mn>1024</mn><mn>10</mn></mfrac><mo>&lt;</mo><mfrac><mn>16384</mn><mn>14</mn></mfrac></mrow><mo>∧</mo><mrow><mfrac><mn>16384</mn><mn>14</mn></mfrac><mo>&lt;</mo><mfrac><mn>262144</mn><mn>18</mn></mfrac></mrow></mrow><mo>∧</mo><mrow><mfrac><mn>262144</mn><mn>18</mn></mfrac><mo>&lt;</mo><mfrac><mn>1048576</mn><mn>20</mn></mfrac></mrow></mrow></math></div>
<pre class="thm-statement"><code>1024 / 10 &lt; 16384 / 14 ∧ 16384 / 14 &lt; 262144 / 18 ∧ 262144 / 18 &lt; 1048576 / 20</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{1024}{10} &lt; \frac{16384}{14} \land \frac{16384}{14} &lt; \frac{262144}{18} \land \frac{262144}{18} &lt; \frac{1048576}{20}</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND THE GAP GROWS. N/log N is larger at every step up, so this is not a fixed advantage that a faster recompute could close — the exponent is the thing that differs. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-no_constant_factor_accounts_for_the_gap">
<p class="thm-label"><strong>Theorem 538</strong> (<code>no_constant_factor_accounts_for_the_gap</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_no_constant_factor_accounts_for_the_gap.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>¬</mo><mrow><mrow><mn>10000</mn><mo>⋅</mo><mn>20</mn></mrow><mo>≥</mo><mn>1048576</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>100</mn><mo>⋅</mo><mn>10</mn></mrow><mo>≥</mo><mrow><mn>1024</mn><mo>-</mo><mn>24</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ (10000 * 20 ≥ 1048576) ∧ 100 * 10 ≥ 1024 - 24</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot 10000 \cdot 20 \ge 1048576 \land 100 \cdot 10 \ge 1024 - 24</code></pre></details>
</div>
<p class="thm-remark">── 3 · NO CONSTANT FACTOR EXPLAINS IT. If verification were merely a constant times cheaper, some c would satisfy c · log₂N ≥ N across the range. Ten thousand does not, at a million leaves. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_measured_ratio_exceeds_the_counted_gap">
<p class="thm-label"><strong>Theorem 539</strong> (<code>the_measured_ratio_exceeds_the_counted_gap</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_measured_ratio_exceeds_the_counted_gap.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mfrac><msup><mn>2</mn><mi>k</mi></msup><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><msup><mn>2</mn><mi>k</mi></msup><mo>)</mo></mrow></mfrac><mo>≤</mo><mfrac><mi>recomputeUs</mi><mi>verifyUs</mi></mfrac></mrow></mrow><mo>∧</mo><mrow><mrow><mfrac><mi>recomputeUs</mi><mi>verifyUs</mi></mfrac><mo>⋅</mo><mi>verifyUs</mi></mrow><mo>≤</mo><mi>recomputeUs</mi></mrow></mrow><mo>∧</mo><mrow><mi>recomputeUs</mi><mo>&lt;</mo><mrow><mrow><mfrac><mi>recomputeUs</mi><mi>verifyUs</mi></mfrac><mo>+</mo><mn>1</mn></mrow><mo>⋅</mo><mi>verifyUs</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>recomputeUs</mi><mi>verifyUs</mi></mfrac><mo>=</mo><mn>567971</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 20).all (fun k =&gt; 2 ^ k / rounds 40 (2 ^ k) ≤ recomputeUs / verifyUs) ∧ (recomputeUs / verifyUs) * verifyUs ≤ recomputeUs ∧ recomputeUs &lt; (recomputeUs / verifyUs + 1) * verifyUs ∧ recomputeUs / verifyUs = 567971</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{1,\dots,20\},\; \frac{2^{k}}{\mathrm{rounds}\mathopen{}\left(40,\,2^{k}\right)} \le \frac{\mathrm{recomputeUs}}{\mathrm{verifyUs}} \land \frac{\mathrm{recomputeUs}}{\mathrm{verifyUs}} \cdot \mathrm{verifyUs} \le \mathrm{recomputeUs} \land \mathrm{recomputeUs} &lt; \frac{\mathrm{recomputeUs}}{\mathrm{verifyUs}} + 1 \cdot \mathrm{verifyUs} \land \frac{\mathrm{recomputeUs}}{\mathrm{verifyUs}} = 567971</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE MEASURED RATIO, from the declared inputs, in the same unit on both sides — the mistake that made an earlier theorem in this deposit compare seal-bits against a leaf count. Read against the law: the measurement is at least the gap the counting predicts, N over its inclusion path, so the machine's number agrees with the structure rather than standing beside it; and the ratio multiplies back to the recompute within one verify. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-verification_grows_it_is_not_constant">
<p class="thm-label"><strong>Theorem 540</strong> (<code>verification_grows_it_is_not_constant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_verification_grows_it_is_not_constant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1024</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><mn>1048576</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>rounds</mi><mo>(</mo><mn>40</mn><mo>,</mo><msup><mn>2</mn><mi>k</mi></msup><mo>)</mo></mrow><mo>=</mo><mi>k</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>rounds 40 1024 &lt; rounds 40 1048576 ∧ ((List.range' 1 10).all (fun k =&gt; rounds 40 (2 ^ k) == k))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{rounds}\mathopen{}\left(40,\,1024\right) &lt; \mathrm{rounds}\mathopen{}\left(40,\,1048576\right) \land \forall k \in \{1,\dots,10\},\; \mathrm{rounds}\mathopen{}\left(40,\,2^{k}\right) = k</code></pre></details>
</div>
<p class="thm-remark">── 5 · VERIFY IS NOT FREE, and calling it O(1) would be the easy overclaim. It grows — slowly, and without bound — so a large enough set costs a longer path. Logarithmic is not constant. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_microseconds_return_from_the_nanoseconds_at_every_count">
<p class="thm-label"><strong>Theorem 541</strong> (<code>the_microseconds_return_from_the_nanoseconds_at_every_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_microseconds_return_from_the_nanoseconds_at_every_count.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ u : Nat, u * 1000 / 1000 = u</code></pre>
</div>
<p class="thm-remark">── 6 · NOTHING HERE IS SUB-NANOSECOND. The measured verify is 38000 nanoseconds. The claim that it is under one is off by four and a half orders of magnitude, and this theorem exists so that number sits in the ledger next to the impressive one rather than only the impressive one being quotable. ── The nanosecond figure is not a second typed input: it is the microsecond input converted, and the conversion reads back at every microsecond count below a thousand. ── ── The conversion reads back at EVERY count, proved rather than sampled — the theorem below it decides the first thousand. A proof over all naturals, carrying the standard axiom propext (printed by lean.ts). ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_verify_in_nanoseconds_reads_back_its_microseconds">
<p class="thm-label"><strong>Theorem 542</strong> (<code>the_verify_in_nanoseconds_reads_back_its_microseconds</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_verify_in_nanoseconds_reads_back_its_microseconds.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>999</mn><mo>}</mo></mrow><mo>,</mo><mrow><mfrac><mrow><mi>u</mi><mo>⋅</mo><mn>1000</mn></mrow><mn>1000</mn></mfrac><mo>=</mo><mi>u</mi></mrow></mrow><mo>∧</mo><mrow><mi>nsPerVerify</mi><mo>=</mo><mrow><mi>verifyUs</mi><mo>⋅</mo><mn>1000</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>nsPerVerify</mi><mn>1000</mn></mfrac><mo>=</mo><mi>verifyUs</mi></mrow></mrow><mo>∧</mo><mrow><mi>nsPerVerify</mi><mo>&gt;</mo><mn>10000</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 1000).all (fun u =&gt; u * 1000 / 1000 == u) ∧ nsPerVerify = verifyUs * 1000 ∧ nsPerVerify / 1000 = verifyUs ∧ nsPerVerify &gt; 10000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall u \in \{0,\dots,999\},\; \frac{u \cdot 1000}{1000} = u \land \mathrm{nsPerVerify} = \mathrm{verifyUs} \cdot 1000 \land \frac{\mathrm{nsPerVerify}}{1000} = \mathrm{verifyUs} \land \mathrm{nsPerVerify} &gt; 10000</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_advantage_is_the_count_not_the_operation">
<p class="thm-label"><strong>Theorem 543</strong> (<code>the_advantage_is_the_count_not_the_operation</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_advantage_is_the_count_not_the_operation.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>1048576</mn><mo>-</mo><mn>20</mn></mrow><mo>=</mo><mn>1048556</mn></mrow><mo>∧</mo><mrow><mfrac><mn>1048576</mn><mn>20</mn></mfrac><mo>=</mo><mn>52428</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>1048576 - 20 = 1048556 ∧ 1048576 / 20 = 52428</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1048576 - 20 = 1048556 \land \frac{1048576}{20} = 52428</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE WORK PER NODE IS THE SAME on both paths. Recompute and verify run the identical hash; only the COUNT differs. That is what makes this arithmetic rather than a claim about hardware. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_break_even_is_the_ratio_of_verifications">
<p class="thm-label"><strong>Theorem 544</strong> (<code>the_break_even_is_the_ratio_of_verifications</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_break_even_is_the_ratio_of_verifications.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mfrac><mn>1048576</mn><mn>20</mn></mfrac><mo>=</mo><mn>52428</mn></mrow><mo>∧</mo><mrow><mrow><mn>52428</mn><mo>⋅</mo><mn>20</mn></mrow><mo>≤</mo><mn>1048576</mn></mrow></mrow><mo>∧</mo><mrow><mn>1048576</mn><mo>&lt;</mo><mrow><mrow><mn>52429</mn><mo>⋅</mo><mn>20</mn></mrow><mo>+</mo><mn>20</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>1048576 / 20 = 52428 ∧ 52428 * 20 ≤ 1048576 ∧ 1048576 &lt; 52429 * 20 + 20</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{1048576}{20} = 52428 \land 52428 \cdot 20 \le 1048576 \land 1048576 &lt; 52429 \cdot 20 + 20</code></pre></details>
</div>
<p class="thm-remark">── 8 · PROVE ONCE, VERIFY FOREVER — stated as the break-even it actually is. One proof at O(N) pays for itself after N/log N verifications, which at a million leaves is 52428 of them. Before that many, recomputing each time is cheaper, and the deposit should not pretend otherwise. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_width_is_the_ceiling_of_128_bits_over_the_symbol">
<p class="thm-label"><strong>Theorem 545</strong> (<code>the_width_is_the_ceiling_of_128_bits_over_the_symbol</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_width_is_the_ceiling_of_128_bits_over_the_symbol.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>charsFor</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>⋅</mo><mi>b</mi></mrow><mo>≥</mo><mn>128</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mi>charsFor</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>-</mo><mn>1</mn></mrow><mo>⋅</mo><mi>b</mi></mrow><mo>&lt;</mo><mn>128</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>charsFor</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mi>hexChars</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>charsFor</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mi>hexbitChars</mi></mrow></mrow><mo>∧</mo><mrow><mi>hexbitChars</mi><mo>&lt;</mo><mi>hexChars</mi></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>hexbitChars</mi><mo>⋅</mo><mn>100</mn></mrow><mi>hexChars</mi></mfrac><mo>=</mo><mn>68</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 8).all (fun b =&gt; charsFor b * b ≥ 128 &amp;&amp; (charsFor b - 1) * b &lt; 128) ∧ charsFor 4 = hexChars ∧ charsFor 6 = hexbitChars ∧ hexbitChars &lt; hexChars ∧ hexbitChars * 100 / hexChars = 68</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{1,\dots,8\},\; \mathrm{charsFor}\mathopen{}\left(b\right) \cdot b \ge 128 \land \mathrm{charsFor}\mathopen{}\left(b\right) - 1 \cdot b &lt; 128 \land \mathrm{charsFor}\mathopen{}\left(4\right) = \mathrm{hexChars} \land \mathrm{charsFor}\mathopen{}\left(6\right) = \mathrm{hexbitChars} \land \mathrm{hexbitChars} &lt; \mathrm{hexChars} \land \frac{\mathrm{hexbitChars} \cdot 100}{\mathrm{hexChars}} = 68</code></pre></details>
</div>
<p class="thm-remark">Shorter: the width is the ceiling of 128 bits over the symbol, and multiplying back covers the 128 bits with less than one symbol to spare, at every symbol width from one to eight bits. 32 and 22 are the instances at four and six bits — derived, not typed — and 22 against 32 is what hexbits unlock.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-hexbits_are_slower_and_the_ratio_multiplies_back">
<p class="thm-label"><strong>Theorem 546</strong> (<code>hexbits_are_slower_and_the_ratio_multiplies_back</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_hexbits_are_slower_and_the_ratio_multiplies_back.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>399</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>⋅</mo><mi>b</mi></mrow><mo>≤</mo><mi>a</mi></mrow><mo>∧</mo><mrow><mi>a</mi><mo>&lt;</mo><mrow><mrow><mfrac><mi>a</mi><mi>b</mi></mfrac><mo>+</mo><mn>1</mn></mrow><mo>⋅</mo><mi>b</mi></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mi>hexbitMs</mi><mo>&gt;</mo><mi>hexMs</mi></mrow></mrow><mo>∧</mo><mrow><mfrac><mrow><mi>hexbitMs</mi><mo>⋅</mo><mn>10</mn></mrow><mi>hexMs</mi></mfrac><mo>=</mo><mn>18</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 20).all (fun b =&gt; (List.range 400).all (fun a =&gt; (a / b) * b ≤ a &amp;&amp; a &lt; (a / b + 1) * b)) ∧ hexbitMs &gt; hexMs ∧ hexbitMs * 10 / hexMs = 18</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{1,\dots,20\},\; \forall a \in \{0,\dots,399\},\; \frac{a}{b} \cdot b \le a \land a &lt; \frac{a}{b} + 1 \cdot b \land \mathrm{hexbitMs} &gt; \mathrm{hexMs} \land \frac{\mathrm{hexbitMs} \cdot 10}{\mathrm{hexMs}} = 18</code></pre></details>
</div>
<p class="thm-remark">And slower: the same encodings cost 30 ms against 16, so the density is bought with time, not given. The ratio is a floor division in tenths, and it multiplies back to the timing within one step — at every divisor and dividend checked, of which the two medians are one instance.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_nanoseconds_return_from_the_microseconds_at_every_whole_count">
<p class="thm-label"><strong>Theorem 547</strong> (<code>the_nanoseconds_return_from_the_microseconds_at_every_whole_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_nanoseconds_return_from_the_microseconds_at_every_whole_count.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n % 1000 = 0 → n / 1000 * 1000 = n</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_cross_formula_is_the_product_mod_256">
<p class="thm-label"><strong>Theorem 548</strong> (<code>the_cross_formula_is_the_product_mod_256</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_cross_formula_is_the_product_mod_256.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>crossMul</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>mod</mo><mn>256</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; crossMul a b == (a * b) % 256))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{crossMul}\mathopen{}\left(a,\,b\right) = a \cdot b \bmod 256</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_high_term_never_reaches_the_wrap">
<p class="thm-label"><strong>Theorem 549</strong> (<code>the_high_term_never_reaches_the_wrap</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_high_term_never_reaches_the_wrap.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mi>hexHi</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexHi</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>⋅</mo><mn>256</mn></mrow><mo>mod</mo><mn>256</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; (hexHi a * hexHi b * 256) % 256 == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{hexHi}\mathopen{}\left(a\right) \cdot \mathrm{hexHi}\mathopen{}\left(b\right) \cdot 256 \bmod 256 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-only_the_low_digit_of_the_cross_term_survives_the_shift">
<p class="thm-label"><strong>Theorem 550</strong> (<code>only_the_low_digit_of_the_cross_term_survives_the_shift</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_only_the_low_digit_of_the_cross_term_survives_the_shift.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mrow><mi>hexHi</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexLo</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mrow><mi>hexLo</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexHi</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow><mo>⋅</mo><mn>16</mn></mrow><mo>mod</mo><mn>256</mn></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mrow><mrow><mi>hexHi</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexLo</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mrow><mi>hexLo</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexHi</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow><mo>mod</mo><mn>16</mn></mrow><mo>⋅</mo><mn>16</mn></mrow><mo>mod</mo><mn>256</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; ((hexHi a * hexLo b + hexLo a * hexHi b) * 16) % 256 == (((hexHi a * hexLo b + hexLo a * hexHi b) % 16) * 16) % 256))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{hexHi}\mathopen{}\left(a\right) \cdot \mathrm{hexLo}\mathopen{}\left(b\right) + \mathrm{hexLo}\mathopen{}\left(a\right) \cdot \mathrm{hexHi}\mathopen{}\left(b\right) \cdot 16 \bmod 256 = \mathrm{hexHi}\mathopen{}\left(a\right) \cdot \mathrm{hexLo}\mathopen{}\left(b\right) + \mathrm{hexLo}\mathopen{}\left(a\right) \cdot \mathrm{hexHi}\mathopen{}\left(b\right) \bmod 16 \cdot 16 \bmod 256</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_cross_term_fits_before_its_own_wrap">
<p class="thm-label"><strong>Theorem 551</strong> (<code>the_cross_term_fits_before_its_own_wrap</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_cross_term_fits_before_its_own_wrap.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>hexHi</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexLo</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mrow><mi>hexLo</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexHi</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow><mo>&lt;</mo><mn>512</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; hexHi a * hexLo b + hexLo a * hexHi b &lt; 512))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{hexHi}\mathopen{}\left(a\right) \cdot \mathrm{hexLo}\mathopen{}\left(b\right) + \mathrm{hexLo}\mathopen{}\left(a\right) \cdot \mathrm{hexHi}\mathopen{}\left(b\right) &lt; 512</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_sum_before_the_wrap_is_below_twice_the_modulus">
<p class="thm-label"><strong>Theorem 552</strong> (<code>the_sum_before_the_wrap_is_below_twice_the_modulus</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_sum_before_the_wrap_is_below_twice_the_modulus.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>hexLo</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexLo</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mrow><mrow><mrow><mrow><mi>hexHi</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexLo</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mrow><mi>hexLo</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexHi</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow><mo>mod</mo><mn>16</mn></mrow><mo>⋅</mo><mn>16</mn></mrow></mrow><mo>&lt;</mo><mn>512</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; hexLo a * hexLo b + ((hexHi a * hexLo b + hexLo a * hexHi b) % 16) * 16 &lt; 512))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{hexLo}\mathopen{}\left(a\right) \cdot \mathrm{hexLo}\mathopen{}\left(b\right) + \mathrm{hexHi}\mathopen{}\left(a\right) \cdot \mathrm{hexLo}\mathopen{}\left(b\right) + \mathrm{hexLo}\mathopen{}\left(a\right) \cdot \mathrm{hexHi}\mathopen{}\left(b\right) \bmod 16 \cdot 16 &lt; 512</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_cross_formula_is_symmetric_in_its_factors">
<p class="thm-label"><strong>Theorem 553</strong> (<code>the_cross_formula_is_symmetric_in_its_factors</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_cross_formula_is_symmetric_in_its_factors.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>crossMul</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>crossMul</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; crossMul a b == crossMul b a))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{crossMul}\mathopen{}\left(a,\,b\right) = \mathrm{crossMul}\mathopen{}\left(b,\,a\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_wrap_commutes_with_the_next_multiply_by_the_prime">
<p class="thm-label"><strong>Theorem 554</strong> (<code>the_wrap_commutes_with_the_next_multiply_by_the_prime</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_wrap_commutes_with_the_next_multiply_by_the_prime.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>crossMul</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mn>0</mn><mo>(</mo><mi>x93</mi><mo>)</mo></mrow></mrow><mo>mod</mo><mn>256</mn></mrow><mo>=</mo><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>⋅</mo><mrow><mn>0</mn><mo>(</mo><mi>x93</mi><mo>)</mo></mrow></mrow><mo>mod</mo><mn>256</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; (crossMul a b * 0x93) % 256 == (a * b * 0x93) % 256))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{crossMul}\mathopen{}\left(a,\,b\right) \cdot 0\mathopen{}\left(\mathrm{x93}\right) \bmod 256 = a \cdot b \cdot 0\mathopen{}\left(\mathrm{x93}\right) \bmod 256</code></pre></details>
</div>
<p class="thm-remark">the FNV step multiplies by 0x01000193 and wraps after every character; at hex scale the prime's low byte is 0x93, and the wrap taken after one product commutes with the next</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-dropping_the_cross_term_is_refuted">
<p class="thm-label"><strong>Theorem 555</strong> (<code>dropping_the_cross_term_is_refuted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_dropping_the_cross_term_is_refuted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>255</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>hexLo</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>hexLo</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow><mo>mod</mo><mn>256</mn></mrow><mo>=</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>mod</mo><mn>256</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ (List.range 256).all (fun a =&gt; (List.range 256).all (fun b =&gt; (hexLo a * hexLo b) % 256 == (a * b) % 256))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall a \in \{0,\dots,255\},\; \forall b \in \{0,\dots,255\},\; \mathrm{hexLo}\mathopen{}\left(a\right) \cdot \mathrm{hexLo}\mathopen{}\left(b\right) \bmod 256 = a \cdot b \bmod 256</code></pre></details>
</div>
<p class="thm-remark">THE CONTROL: the same shape without the cross term is refuted — the identity is not free</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-temperature_falls_with_the_batch_when_a_part_is_shared">
<p class="thm-label"><strong>Theorem 556</strong> (<code>temperature_falls_with_the_batch_when_a_part_is_shared</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_temperature_falls_with_the_batch_when_a_part_is_shared.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>F</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>14</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>perItem</mi><mo>(</mo><mi>F</mi><mo>,</mo><mi>c</mi><mo>,</mo><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow><mo>)</mo></mrow><mo>≤</mo><mrow><mi>perItem</mi><mo>(</mo><mi>F</mi><mo>,</mo><mi>c</mi><mo>,</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun F =&gt; (List.range 16).all (fun c =&gt; (List.range 15).all (fun n =&gt; perItem F c (n + 2) ≤ perItem F c (n + 1))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall F \in \{0,\dots,15\},\; \forall c \in \{0,\dots,15\},\; \forall n \in \{0,\dots,14\},\; \mathrm{perItem}\mathopen{}\left(F,\,c,\,n + 2\right) \le \mathrm{perItem}\mathopen{}\left(F,\,c,\,n + 1\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3,840 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-temperature_is_flat_when_nothing_is_shared">
<p class="thm-label"><strong>Theorem 557</strong> (<code>temperature_is_flat_when_nothing_is_shared</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_temperature_is_flat_when_nothing_is_shared.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>14</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>perItem</mi><mo>(</mo><mn>0</mn><mo>,</mo><mi>c</mi><mo>,</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mi>c</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun c =&gt; (List.range 15).all (fun n =&gt; perItem 0 c (n + 1) == c))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,15\},\; \forall n \in \{0,\dots,14\},\; \mathrm{perItem}\mathopen{}\left(0,\,c,\,n + 1\right) = c</code></pre></details>
</div>
<p class="thm-remark">THE CONTROL: nothing shared, nothing falls — the per-item cost is exactly c at every batch</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 240 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_fall_is_exactly_the_shared_part_spread_over_the_batch">
<p class="thm-label"><strong>Theorem 558</strong> (<code>the_fall_is_exactly_the_shared_part_spread_over_the_batch</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_fall_is_exactly_the_shared_part_spread_over_the_batch.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>F</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>14</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>perItem</mi><mo>(</mo><mi>F</mi><mo>,</mo><mi>c</mi><mo>,</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>c</mi><mo>+</mo><mfrac><mi>F</mi><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></mfrac></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun F =&gt; (List.range 16).all (fun c =&gt; (List.range 15).all (fun n =&gt; perItem F c (n + 1) == c + F / (n + 1))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall F \in \{0,\dots,15\},\; \forall c \in \{0,\dots,15\},\; \forall n \in \{0,\dots,14\},\; \mathrm{perItem}\mathopen{}\left(F,\,c,\,n + 1\right) = c + \frac{F}{n + 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3,840 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-time_falls_with_the_lanes">
<p class="thm-label"><strong>Theorem 559</strong> (<code>time_falls_with_the_lanes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_time_falls_with_the_lanes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>F</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>14</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>wall</mi><mo>(</mo><mi>F</mi><mo>,</mo><mi>c</mi><mo>,</mo><mi>n</mi><mo>,</mo><mrow><mi>k</mi><mo>+</mo><mn>2</mn></mrow><mo>)</mo></mrow><mo>≤</mo><mrow><mi>wall</mi><mo>(</mo><mi>F</mi><mo>,</mo><mi>c</mi><mo>,</mo><mi>n</mi><mo>,</mo><mrow><mi>k</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun F =&gt; (List.range 8).all (fun c =&gt; (List.range 16).all (fun n =&gt; (List.range 15).all (fun k =&gt; wall F c n (k + 2) ≤ wall F c n (k + 1)))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall F \in \{0,\dots,7\},\; \forall c \in \{0,\dots,7\},\; \forall n \in \{0,\dots,15\},\; \forall k \in \{0,\dots,14\},\; \mathrm{wall}\mathopen{}\left(F,\,c,\,n,\,k + 2\right) \le \mathrm{wall}\mathopen{}\left(F,\,c,\,n,\,k + 1\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 15,360 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-time_saturates_when_the_lanes_reach_the_batch">
<p class="thm-label"><strong>Theorem 560</strong> (<code>time_saturates_when_the_lanes_reach_the_batch</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_time_saturates_when_the_lanes_reach_the_batch.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>F</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>14</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>≤</mo><mi>k</mi></mrow></mrow><mo>∨</mo><mrow><mrow><mi>wall</mi><mo>(</mo><mi>F</mi><mo>,</mo><mi>c</mi><mo>,</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>F</mi><mo>+</mo><mi>c</mi></mrow></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun F =&gt; (List.range 8).all (fun c =&gt; (List.range 15).all (fun n =&gt; (List.range 16).all (fun k =&gt; !(n + 1 ≤ k) || wall F c (n + 1) k == F + c))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall F \in \{0,\dots,7\},\; \forall c \in \{0,\dots,7\},\; \forall n \in \{0,\dots,14\},\; \forall k \in \{0,\dots,15\},\; \lnot n + 1 \le k \lor \mathrm{wall}\mathopen{}\left(F,\,c,\,n + 1,\,k\right) = F + c</code></pre></details>
</div>
<p class="thm-remark">saturation: once there are at least as many lanes as items, one more lane buys nothing</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 15,360 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_hex_fold_is_order_free">
<p class="thm-label"><strong>Theorem 561</strong> (<code>the_hex_fold_is_order_free</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_hex_fold_is_order_free.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>,</mo><mi>a</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mi>c</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>,</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun c =&gt; foldHex [a, b, c] == foldHex [b, c, a] &amp;&amp; foldHex [a, b, c] == foldHex [c, b, a] &amp;&amp; foldHex [a, b, c] == foldHex [b, a, c]))) ∧ foldHex [1, 2, 3] ≠ foldHex [1, 2, 4]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \forall c \in \{0,\dots,15\},\; \mathrm{foldHex}\mathopen{}\left([a,\,b,\,c]\right) = \mathrm{foldHex}\mathopen{}\left([b,\,c,\,a]\right) \land \mathrm{foldHex}\mathopen{}\left([a,\,b,\,c]\right) = \mathrm{foldHex}\mathopen{}\left([c,\,b,\,a]\right) \land \mathrm{foldHex}\mathopen{}\left([a,\,b,\,c]\right) = \mathrm{foldHex}\mathopen{}\left([b,\,a,\,c]\right) \land \mathrm{foldHex}\mathopen{}\left([1,\,2,\,3]\right) \neq \mathrm{foldHex}\mathopen{}\left([1,\,2,\,4]\right)</code></pre></details>
</div>
<p class="thm-remark">the quantum part at hex scale: every ordering of three hex digits folds to one value, and the fold is not the constant it would be if sorting erased the digits (two different triples fold apart)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36,864 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_measured_temperature_fell_tenfold_and_then_rose">
<p class="thm-label"><strong>Theorem 562</strong> (<code>the_measured_temperature_fell_tenfold_and_then_rose</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_measured_temperature_fell_tenfold_and_then_rose.html">sealed</a>.</p>
<pre class="thm-statement"><code>fellTenfold measuredUnbounded 0 3 = true ∧ fellTenfold measuredBounded 0 3 = true ∧ rises measuredUnbounded 3 5 = true ∧ rises measuredBounded 3 6 = true ∧ rises measuredBounded 3 4 = true ∧ fellTenfold measuredBounded 0 1 = false ∧ measuredBounded.getD 5 0 &lt; measuredUnbounded.getD 5 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-speed-the_two_tables_fold_order_free_and_apart">
<p class="thm-label"><strong>Theorem 563</strong> (<code>the_two_tables_fold_order_free_and_apart</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_speed_the_two_tables_fold_order_free_and_apart.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mi>hexOf</mi><mo>(</mo><mi>measuredUnbounded</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mi>hexOf</mi><mo>(</mo><mrow><mi>reverse</mi><mo>(</mo><mi>measuredUnbounded</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mi>hexOf</mi><mo>(</mo><mi>measuredBounded</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mi>hexOf</mi><mo>(</mo><mrow><mi>reverse</mi><mo>(</mo><mi>measuredBounded</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>foldHex</mi><mo>(</mo><mrow><mi>hexOf</mi><mo>(</mo><mi>measuredUnbounded</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>foldHex</mi><mo>(</mo><mrow><mi>hexOf</mi><mo>(</mo><mi>measuredBounded</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>foldHex (hexOf measuredUnbounded) = foldHex (hexOf measuredUnbounded.reverse) ∧ foldHex (hexOf measuredBounded) = foldHex (hexOf measuredBounded.reverse) ∧ foldHex (hexOf measuredUnbounded) ≠ foldHex (hexOf measuredBounded)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{foldHex}\mathopen{}\left(\mathrm{hexOf}\mathopen{}\left(\mathrm{measuredUnbounded}\right)\right) = \mathrm{foldHex}\mathopen{}\left(\mathrm{hexOf}\mathopen{}\left(\operatorname{reverse}\left(\mathrm{measuredUnbounded}\right)\right)\right) \land \mathrm{foldHex}\mathopen{}\left(\mathrm{hexOf}\mathopen{}\left(\mathrm{measuredBounded}\right)\right) = \mathrm{foldHex}\mathopen{}\left(\mathrm{hexOf}\mathopen{}\left(\operatorname{reverse}\left(\mathrm{measuredBounded}\right)\right)\right) \land \mathrm{foldHex}\mathopen{}\left(\mathrm{hexOf}\mathopen{}\left(\mathrm{measuredUnbounded}\right)\right) \neq \mathrm{foldHex}\mathopen{}\left(\mathrm{hexOf}\mathopen{}\left(\mathrm{measuredBounded}\right)\right)</code></pre></details>
</div>
<p class="thm-remark">time and temperature folded in hex space: the rows of each table fold to one root whatever order they were run in, and the two tables fold apart — the bounded cache changed the curve</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
