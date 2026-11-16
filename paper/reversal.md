---
title: "Digit reversal"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `reversal.lean`

<p class="paper-src"><code>src/iso/iec-2382-computing/reversal.lean</code> · namespace <code>Reversal</code> · 29 theorems · wing <code>the machine</code></p>

Digit reversal — arithmetic, not string handling.


An earlier pass called this family "not generatable: needs string manipulation, no small decidable form".
That was wrong. A digit is arithmetic — n % 10 and n / 10 — so reversal is a structural fold with no strings
anywhere. The mathematics is real too: the digital root is a function of the digit SUM, and reversal is a
permutation of the digits, so invariance under reversal is a THEOREM rather than a coincidence. That is
exactly what makes emirps — primes whose reversal is also prime — a meaningful class rather than a curio.
No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>settledHere := 8</code></pre>

<div class="thm" id="thm-reversal-reversal_preserves_digit_sum">
<p class="thm-label"><strong>Theorem 1427</strong> (<code>reversal_preserves_digit_sum</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_preserves_digit_sum.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>300</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>digitSum</mi><mo>(</mo><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>digitSum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 300).all (fun n =&gt; digitSum (reverseNum n) == digitSum n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,300\},\; \mathrm{digitSum}\mathopen{}\left(\mathrm{reverseNum}\mathopen{}\left(n\right)\right) = \mathrm{digitSum}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">── reversal is a permutation of the digits, so it preserves their sum ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 300 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-digital_root_is_invariant_under_reversal">
<p class="thm-label"><strong>Theorem 1428</strong> (<code>digital_root_is_invariant_under_reversal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_digital_root_is_invariant_under_reversal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>300</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mi>n</mi><mo>mod</mo><mn>9</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 300).all (fun n =&gt; (reverseNum n) % 9 == n % 9)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,300\},\; \mathrm{reverseNum}\mathopen{}\left(n\right) \bmod 9 = n \bmod 9</code></pre></details>
</div>
<p class="thm-remark">── and therefore preserves the residue mod 9 — the digital root is invariant under reversal ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 300 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_ledger_reversal_cases">
<p class="thm-label"><strong>Theorem 1429</strong> (<code>the_ledger_reversal_cases</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_ledger_reversal_cases.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mn>12</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mn>12</mn><mo>mod</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mn>45</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mn>45</mn><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mn>123</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mn>123</mn><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mn>1234</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mn>1234</mn><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mn>4321</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mn>4321</mn><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mn>9080</mn><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mn>9080</mn><mo>mod</mo><mn>9</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(reverseNum 12) % 9 == 12 % 9 ∧ (reverseNum 45) % 9 == 45 % 9 ∧ (reverseNum 123) % 9 == 123 % 9 ∧ (reverseNum 1234) % 9 == 1234 % 9 ∧ (reverseNum 4321) % 9 == 4321 % 9 ∧ (reverseNum 9080) % 9 == 9080 % 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{reverseNum}\mathopen{}\left(12\right) \bmod 9 = 12 \bmod 9 \land \mathrm{reverseNum}\mathopen{}\left(45\right) \bmod 9 = 45 \bmod 9 \land \mathrm{reverseNum}\mathopen{}\left(123\right) \bmod 9 = 123 \bmod 9 \land \mathrm{reverseNum}\mathopen{}\left(1234\right) \bmod 9 = 1234 \bmod 9 \land \mathrm{reverseNum}\mathopen{}\left(4321\right) \bmod 9 = 4321 \bmod 9 \land \mathrm{reverseNum}\mathopen{}\left(9080\right) \bmod 9 = 9080 \bmod 9</code></pre></details>
</div>
<p class="thm-remark">── the ledger's own cases, now stated rather than asserted ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_is_not_the_identity">
<p class="thm-label"><strong>Theorem 1430</strong> (<code>reversal_is_not_the_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_is_not_the_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>10</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mi>n</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ((List.range' 10 90).all (fun n =&gt; reverseNum n == n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall n \in \{10,\dots,99\},\; \mathrm{reverseNum}\mathopen{}\left(n\right) = n</code></pre></details>
</div>
<p class="thm-remark">── NON-VACUITY: reversal genuinely moves the number, so the invariance is not about a fixed point ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 90 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-palindromes_are_the_fixed_points">
<p class="thm-label"><strong>Theorem 1431</strong> (<code>palindromes_are_the_fixed_points</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_palindromes_are_the_fixed_points.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>10</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mi>n</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 10 90).filter (fun n =&gt; reverseNum n == n)).length = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, n \in \{10,\dots,99\} \mid \mathrm{reverseNum}\mathopen{}\left(n\right) = n \,\}\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── palindromes are exactly the fixed points, and there are nine of them below 100 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 90 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-emirps_exist_below_one_hundred">
<p class="thm-label"><strong>Theorem 1432</strong> (<code>emirps_exist_below_one_hundred</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_emirps_exist_below_one_hundred.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>10</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mrow><mi>isPrime</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>∧</mo><mrow><mi>isPrime</mi><mo>(</mo><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>≠</mo><mi>n</mi></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>&gt;</mo><mn>0</mn></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 10 90).filter (fun n =&gt; isPrime n &amp;&amp; isPrime (reverseNum n) &amp;&amp; reverseNum n != n)).length &gt; 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, n \in \{10,\dots,99\} \mid \mathrm{isPrime}\mathopen{}\left(n\right) \land \mathrm{isPrime}\mathopen{}\left(\mathrm{reverseNum}\mathopen{}\left(n\right)\right) \land \mathrm{reverseNum}\mathopen{}\left(n\right) \neq n \,\}\right| &gt; 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 90 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_does_not_preserve_primality">
<p class="thm-label"><strong>Theorem 1433</strong> (<code>reversal_does_not_preserve_primality</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_does_not_preserve_primality.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>10</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isPrime</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>isPrime</mi><mo>(</mo><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ((List.range' 10 90).all (fun n =&gt; isPrime n == isPrime (reverseNum n)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall n \in \{10,\dots,99\},\; \mathrm{isPrime}\mathopen{}\left(n\right) = \mathrm{isPrime}\mathopen{}\left(\mathrm{reverseNum}\mathopen{}\left(n\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── and reversal does NOT preserve primality in general: the boundary that makes emirps a real class ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 90 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_is_involutive_exactly_off_the_trailing_zeros">
<p class="thm-label"><strong>Theorem 1434</strong> (<code>reversal_is_involutive_exactly_off_the_trailing_zeros</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_is_involutive_exactly_off_the_trailing_zeros.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>300</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>reverseNum</mi><mo>(</mo><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>n</mi></mrow><mo>=</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>10</mn></mrow><mo>≠</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 300).all (fun n =&gt; (reverseNum (reverseNum n) == n) == (n % 10 != 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,300\},\; \mathrm{reverseNum}\mathopen{}\left(\mathrm{reverseNum}\mathopen{}\left(n\right)\right) = n = n \bmod 10 \neq 0</code></pre></details>
</div>
<p class="thm-remark">── WHERE REVERSAL STOPS BEING AN INVOLUTION. Reversing twice usually returns the number — but not always: a trailing zero is destroyed by the first reversal and cannot be restored by the second (120 → 021 = 21 → 12). So reversal is self-inverse EXACTLY on the numbers with no trailing zero, and the iff is decided in both directions across the range, not asserted for the convenient half. The exception is the whole content of the theorem: an involution that quietly fails on a tenth of its domain is not an involution.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 300 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-foldl_add_start">
<p class="thm-label"><strong>Theorem 1435</strong> (<code>foldl_add_start</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_foldl_add_start.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (l : List Nat) (a : Nat), l.foldl (· + ·) a = a + l.foldl (· + ·) 0</code></pre>
</div>
<p class="thm-remark">── the capped rows above, proved for every value by induction — no bound ──────────────────────────────────── casting out nines, in general: a number, its digit sum and its reversal share their residue mod 9.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them">
<p class="thm-label"><strong>Theorem 1436</strong> (<code>the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f n : Nat, n &lt; 10 ^ f → (digitsF f n).foldl (· + ·) 0 % 9 = n % 9</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-a_number_is_below_ten_to_its_own_successor">
<p class="thm-label"><strong>Theorem 1437</strong> (<code>a_number_is_below_ten_to_its_own_successor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_a_number_is_below_ten_to_its_own_successor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n &lt; 10 ^ (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_digit_sum_has_the_residue_of_the_number_mod_nine_for_every_n">
<p class="thm-label"><strong>Theorem 1438</strong> (<code>the_digit_sum_has_the_residue_of_the_number_mod_nine_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_digit_sum_has_the_residue_of_the_number_mod_nine_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, digitSum n % 9 = n % 9</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-folding_by_ten_keeps_the_residue_of_the_digit_sum">
<p class="thm-label"><strong>Theorem 1439</strong> (<code>folding_by_ten_keeps_the_residue_of_the_digit_sum</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_folding_by_ten_keeps_the_residue_of_the_digit_sum.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (l : List Nat) (a : Nat), (l.foldl (fun a d =&gt; a * 10 + d) a) % 9 = (a + l.foldl (· + ·) 0) % 9</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_keeps_the_residue_mod_nine_for_every_n">
<p class="thm-label"><strong>Theorem 1440</strong> (<code>reversal_keeps_the_residue_mod_nine_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_keeps_the_residue_mod_nine_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, reverseNum n % 9 = n % 9</code></pre>
</div>
<p class="thm-remark">digital_root_is_invariant_under_reversal checked 1 ≤ n ≤ 300; this proves it for every n.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-digitsF_zero">
<p class="thm-label"><strong>Theorem 1441</strong> (<code>digitsF_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_digitsF_zero.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f : Nat, digitsF f 0 = []</code></pre>
</div>
<p class="thm-remark">── reflections, from the rev batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── ═══ REFLECTIONS ═══════════════════════════════════════════════════════════════════════════════════════</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-every_digit_is_below_ten">
<p class="thm-label"><strong>Theorem 1442</strong> (<code>every_digit_is_below_ten</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_every_digit_is_below_ten.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f n : Nat, ∀ d ∈ digitsF f n, d &lt; 10</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_digits_rebuild_the_number_when_the_fuel_covers_them">
<p class="thm-label"><strong>Theorem 1443</strong> (<code>the_digits_rebuild_the_number_when_the_fuel_covers_them</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_digits_rebuild_the_number_when_the_fuel_covers_them.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f n : Nat, n &lt; 10 ^ f → (digitsF f n).foldr (fun d a =&gt; a * 10 + d) 0 = n</code></pre>
</div>
<p class="thm-remark">the number rebuilt from its digits (reflection of the digit-sum law)</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_number_is_rebuilt_from_its_digits_for_every_n">
<p class="thm-label"><strong>Theorem 1444</strong> (<code>the_number_is_rebuilt_from_its_digits_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_number_is_rebuilt_from_its_digits_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (digits n).foldr (fun d a =&gt; a * 10 + d) 0 = n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-a_sum_is_the_same_read_backwards">
<p class="thm-label"><strong>Theorem 1445</strong> (<code>a_sum_is_the_same_read_backwards</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_a_sum_is_the_same_read_backwards.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (l : List Nat), l.reverse.foldl (· + ·) 0 = l.foldl (· + ·) 0</code></pre>
</div>
<p class="thm-remark">the sum does not see the order (reflection of foldl_add_start)</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_top_digit_is_nonzero">
<p class="thm-label"><strong>Theorem 1446</strong> (<code>the_top_digit_is_nonzero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_top_digit_is_nonzero.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f n : Nat, 0 &lt; n → n &lt; 10 ^ f → ∃ L b, digitsF f n = L ++ [b] ∧ 0 &lt; b ∧ b &lt; 10</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_leaves_no_trailing_zero">
<p class="thm-label"><strong>Theorem 1447</strong> (<code>reversal_leaves_no_trailing_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_leaves_no_trailing_zero.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 0 &lt; n → 0 &lt; reverseNum n ∧ reverseNum n % 10 ≠ 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reading_a_list_back_from_the_top">
<p class="thm-label"><strong>Theorem 1448</strong> (<code>reading_a_list_back_from_the_top</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reading_a_list_back_from_the_top.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ r : List Nat, r ≠ [] → (∀ d ∈ r, d &lt; 10) → r.reverse.head? ≠ some 0 → 0 &lt; r.reverse.foldl (fun a d =&gt; a * 10 + d) 0 ∧ r.length ≤ r.reverse.foldl (fun a d =&gt; a * 10 + d) 0 ∧ ∀ f, r.length ≤ f → digitsF f (r.reverse.foldl (fun a d =&gt; a * 10 + d) 0) = r</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_digits_of_the_reversal_are_the_reversed_digits">
<p class="thm-label"><strong>Theorem 1449</strong> (<code>the_digits_of_the_reversal_are_the_reversed_digits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_digits_of_the_reversal_are_the_reversed_digits.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n % 10 ≠ 0 → digits (reverseNum n) = (digitsF (n + 1) n).reverse ∧ digits n = digitsF (n + 1) n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_is_involutive_off_the_trailing_zeros_for_every_n">
<p class="thm-label"><strong>Theorem 1450</strong> (<code>reversal_is_involutive_off_the_trailing_zeros_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_is_involutive_off_the_trailing_zeros_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n % 10 ≠ 0 → reverseNum (reverseNum n) = n</code></pre>
</div>
<p class="thm-remark">reflection of reversal_keeps_the_residue_mod_nine_for_every_n: reversal undoes itself off the trailing zeros</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_is_involutive_exactly_off_the_trailing_zeros_for_every_n">
<p class="thm-label"><strong>Theorem 1451</strong> (<code>reversal_is_involutive_exactly_off_the_trailing_zeros_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_is_involutive_exactly_off_the_trailing_zeros_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 0 &lt; n → (reverseNum (reverseNum n) = n ↔ n % 10 ≠ 0)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-more_fuel_changes_no_digit">
<p class="thm-label"><strong>Theorem 1452</strong> (<code>more_fuel_changes_no_digit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_more_fuel_changes_no_digit.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f n k : Nat, n &lt; 10 ^ f → digitsF (f + k) n = digitsF f n</code></pre>
</div>
<p class="thm-remark">more fuel changes nothing once it covers the number</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-a_trailing_zero_is_a_leading_zero_of_the_digits">
<p class="thm-label"><strong>Theorem 1453</strong> (<code>a_trailing_zero_is_a_leading_zero_of_the_digits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_a_trailing_zero_is_a_leading_zero_of_the_digits.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, 0 &lt; m → digits (10 * m) = 0 :: digits m</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-reversal_preserves_the_digit_sum_for_every_n">
<p class="thm-label"><strong>Theorem 1454</strong> (<code>reversal_preserves_the_digit_sum_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_reversal_preserves_the_digit_sum_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, digitSum (reverseNum n) = digitSum n</code></pre>
</div>
<p class="thm-remark">reversal_preserves_digit_sum was decided for 1 ≤ n &lt; 300; for every n:</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reversal-the_fixed_points_of_reversal_are_the_palindromes_for_every_n">
<p class="thm-label"><strong>Theorem 1455</strong> (<code>the_fixed_points_of_reversal_are_the_palindromes_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reversal_the_fixed_points_of_reversal_are_the_palindromes_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n % 10 ≠ 0 → (reverseNum n = n ↔ (digits n).reverse = digits n)</code></pre>
</div>
<p class="thm-remark">palindromes_are_the_fixed_points counted them below 100; for every n without a trailing zero: the fixed points of the reversal are exactly the numbers whose digits read the same both ways</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
