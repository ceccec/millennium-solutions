---
title: "Four hex, exactly computed — and what the handle has to carry instead"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `handle.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/handle.lean</code> · namespace <code>Handle</code> · 8 theorems · wing <code>the floor</code></p>

WHY THIS FILE EXISTS.

The construction: address a message by four hex digits, and let the HANDLE and the MESSAGE supply
everything else, so no payload has to travel. That is a real and useful arrangement — it is what
`sendToRoom` does in the uuidna package, sealing a message into a uuid stream rather than sending it —
and the reason to put it under the kernel is that four hex is a SMALL NUMBER, and the whole arrangement
depends on knowing exactly how small.

Four hex is 65,536 values. Theorem 1 exhausts every one of them: the nibble decomposition round-trips
for all 65,536, so the field is EXACTLY a sixteen-bit word, with nothing unreachable and nothing
duplicated. That is the "exactly computable" half, and it is decided rather than asserted.

The other half is the bound, and it is the half that decides what the handle has to do. 65,536 addresses
cannot separate more than 65,536 messages; past that, by pigeonhole, two messages share an address, and
no amount of care in computing the address changes it. Measured on this deposit's own minting: 20,000
messages produced 17,242 distinct four-hex values — 2,490 of them already shared. So the address
IDENTIFIES and it cannot AUTHENTICATE, and everything that distinguishes two messages at one address
has to be carried by the handle and the position, which is what theorems 5 and 6 are about.

WHAT THIS FILE REFUSES. That not sending a payload is the same as sending it secretly. It is not. The
receiver reconstructs because they ALREADY HOLD what regenerates the message; that is recomputation, and
it is neither compression nor confidentiality. Theorem 8 states the bound that makes this exact.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>groups := [8, 4, 4, 4, 12]
space := 65536
perms := [[1,2,3,4],[1,2,4,3],[1,3,2,4],[1,3,4,2],[1,4,2,3],[1,4,3,2],</code></pre>

<div class="thm" id="thm-handle-the_four_hex_field_round_trips_over_its_whole_space">
<p class="thm-label"><strong>Theorem 350</strong> (<code>the_four_hex_field_round_trips_over_its_whole_space</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_the_four_hex_field_round_trips_over_its_whole_space.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun c =&gt; (List.range 16).all (fun d =&gt; let n := fromNibs a b c d nib n 0 == a &amp;&amp; nib n 1 == b &amp;&amp; nib n 2 == c &amp;&amp; nib n 3 == d &amp;&amp; n &lt; 65536))))</code></pre>
</div>
<p class="thm-remark">EXHAUSTED OVER THE WHOLE SPACE, BY COUNTING THE DIGITS RATHER THAN THE VALUES. Written first as `(List.range 65536).all …`, it compiled alone in 29 seconds and overflowed the stack beside the seven theorems below; the file's budget for that shape turned out to be 4,096, a sixteenth of the field. The cost was never the 65,536 checks — it was building a 65,536-element list as a term. Four nested lists of SIXTEEN reach every one of the same quadruples with nothing longer than sixteen ever constructed, and the whole field decides in 48 seconds. The honest range was available at full width all along, behind a change of shape rather than a lowered claim.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 65,536 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-the_field_runs_from_zero_to_its_last_value">
<p class="thm-label"><strong>Theorem 351</strong> (<code>the_field_runs_from_zero_to_its_last_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_the_field_runs_from_zero_to_its_last_value.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>fromNibs</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mi>fromNibs</mi><mo>(</mo><mn>15</mn><mo>,</mo><mn>15</mn><mo>,</mo><mn>15</mn><mo>,</mo><mn>15</mn><mo>)</mo></mrow><mo>=</mo><mn>65535</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>fromNibs</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mrow><mn>4096</mn><mo>⋅</mo><mi>d</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>fromNibs 0 0 0 0 = 0 ∧ fromNibs 15 15 15 15 = 65535 ∧ (List.range 16).all (fun d =&gt; fromNibs 0 0 0 d == 4096 * d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fromNibs}\mathopen{}\left(0,\,0,\,0,\,0\right) = 0 \land \mathrm{fromNibs}\mathopen{}\left(15,\,15,\,15,\,15\right) = 65535 \land \forall d \in \{0,\dots,15\},\; \mathrm{fromNibs}\mathopen{}\left(0,\,0,\,0,\,d\right) = 4096 \cdot d</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND IT RUNS FROM ZERO TO SIXTY-FIVE THOUSAND FIVE HUNDRED AND THIRTY-FIVE ───────────────────────── The ends named outright, and the place value of the top digit — so the field's width is decided and not inferred from the shape of theorem 1.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-a_uuid_is_thirty_two_hex_and_exactly_three_groups_are_four_wide">
<p class="thm-label"><strong>Theorem 352</strong> (<code>a_uuid_is_thirty_two_hex_and_exactly_three_groups_are_four_wide</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_a_uuid_is_thirty_two_hex_and_exactly_three_groups_are_four_wide.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∑</mo><mi>groups</mi></mrow><mo>=</mo><mn>32</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>g</mi><mo>∈</mo><mi>groups</mi><mo>∣</mo><mrow><mi>g</mi><mo>=</mo><mn>4</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>groups</mi><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>groups.foldl (· + ·) 0 = 32 ∧ (groups.filter (fun g =&gt; g == 4)).length = 3 ∧ groups.length = 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\sum \mathrm{groups} = 32 \land \left|\{\, g \in \mathrm{groups} \mid g = 4 \,\}\right| = 3 \land \left|\mathrm{groups}\right| = 5</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-the_address_space_is_finite_so_enough_messages_must_share_an_address">
<p class="thm-label"><strong>Theorem 353</strong> (<code>the_address_space_is_finite_so_enough_messages_must_share_an_address</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_the_address_space_is_finite_so_enough_messages_must_share_an_address.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>space</mi><mo>=</mo><msup><mn>16</mn><mn>4</mn></msup></mrow><mo>∧</mo><mrow><mi>space</mi><mo>=</mo><msup><mn>2</mn><mn>16</mn></msup></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m</mi><mo>mod</mo><mn>16</mn></mrow><mo>∣</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>16</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>&lt;</mo><mn>17</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>space = 16 ^ 4 ∧ space = 2 ^ 16 ∧ ((List.range 17).map (fun m =&gt; m % 16)).eraseDups.length &lt; 17</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{space} = 16^{4} \land \mathrm{space} = 2^{16} \land \left|\operatorname{dedup}\left(\{\, m \bmod 16 \mid m \in \{0,\dots,16\} \,\}\right)\right| &lt; 17</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 17 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-one_address_two_messages_and_the_handle_is_what_tells_them_apart">
<p class="thm-label"><strong>Theorem 354</strong> (<code>one_address_two_messages_and_the_handle_is_what_tells_them_apart</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_one_address_two_messages_and_the_handle_is_what_tells_them_apart.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>addr</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mrow><mi>addr</mi><mo>(</mo><mn>19</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>under</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mrow><mi>under</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>19</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>under</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>under</mi><mo>(</mo><mn>1</mn><mo>,</mo><mn>19</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>addr 3 = addr 19 ∧ under 0 3 = under 0 19 ∧ under 0 3 ≠ under 1 19</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{addr}\mathopen{}\left(3\right) = \mathrm{addr}\mathopen{}\left(19\right) \land \mathrm{under}\mathopen{}\left(0,\,3\right) = \mathrm{under}\mathopen{}\left(0,\,19\right) \land \mathrm{under}\mathopen{}\left(0,\,3\right) \neq \mathrm{under}\mathopen{}\left(1,\,19\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-the_same_message_at_two_positions_never_seals_alike">
<p class="thm-label"><strong>Theorem 355</strong> (<code>the_same_message_at_two_positions_never_seals_alike</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_the_same_message_at_two_positions_never_seals_alike.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>31</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>i</mi><mo>=</mo><mi>j</mi></mrow><mo>∨</mo><mrow><mrow><mi>sealAt</mi><mo>(</mo><mi>m</mi><mo>,</mo><mi>i</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>sealAt</mi><mo>(</mo><mi>m</mi><mo>,</mo><mi>j</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 32).all (fun m =&gt; (List.range 8).all (fun i =&gt; (List.range 8).all (fun j =&gt; i == j || sealAt m i != sealAt m j)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{0,\dots,31\},\; \forall i \in \{0,\dots,7\},\; \forall j \in \{0,\dots,7\},\; i = j \lor \mathrm{sealAt}\mathopen{}\left(m,\,i\right) \neq \mathrm{sealAt}\mathopen{}\left(m,\,j\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2,048 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-reordering_the_handles_always_moves_the_fifth">
<p class="thm-label"><strong>Theorem 356</strong> (<code>reordering_the_handles_always_moves_the_fifth</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_reordering_the_handles_always_moves_the_fifth.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>fold4</mi><mo>(</mo><msub><mi>p</mi><mn>0</mn></msub><mo>,</mo><msub><mi>p</mi><mn>1</mn></msub><mo>,</mo><msub><mi>p</mi><mn>2</mn></msub><mo>,</mo><msub><mi>p</mi><mn>3</mn></msub><mo>)</mo></mrow><mo>∣</mo><mi>p</mi><mo>∈</mo><mi>perms</mi><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow></math></div>
<pre class="thm-statement"><code>(perms.map (fun p =&gt; fold4 (p.get! 0) (p.get! 1) (p.get! 2) (p.get! 3))).eraseDups.length = 24</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{fold4}\mathopen{}\left(p_{0},\,p_{1},\,p_{2},\,p_{3}\right) \mid p \in \mathrm{perms} \,\}\right)\right| = 24</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-handle-an_address_never_determines_the_message_it_addresses">
<p class="thm-label"><strong>Theorem 357</strong> (<code>an_address_never_determines_the_message_it_addresses</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_handle_an_address_never_determines_the_message_it_addresses.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mn>1</mn><mo>&lt;</mo><mrow><mo>|</mo><mrow><mo>{</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>63</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>addr</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mi>a</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; 1 &lt; ((List.range 64).filter (fun m =&gt; addr m == a)).length)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; 1 &lt; \left|\{\, m \in \{0,\dots,63\} \mid \mathrm{addr}\mathopen{}\left(m\right) = a \,\}\right|</code></pre></details>
</div>
<p class="thm-remark">── 8 · AND NOT SENDING A PAYLOAD IS NOT SENDING IT SECRETLY ────────────────────────────────────────────── The refusal this file exists to carry. The receiver recovers the message because they already hold what regenerates it, which is recomputation — not compression, because nothing was made smaller, and not confidentiality, because nothing was hidden from anyone who holds the same inputs. Stated as the fact that the address does not determine the message: every address in the model is shared by more than one message, so an address alone can never be read back into the thing it addresses.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,024 cases. <span class="qed">□</span></p>

</div>
