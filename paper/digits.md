---
title: "The reflection lifts digitwise, and the constant it adds to is ten times a repunit"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `digits.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/digits.lean</code> · namespace <code>Digits</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

The author's third clause: "8 interacting with 8 is 16, 1 reflects 9 and 6 reflects 4."

8 + 8 = 16. Reflect each digit — refl 1 = 9, refl 6 = 4 — and 16 becomes 94, and 16 + 94 = 110. That is
not a property of 16. It holds for EVERY two-digit number, and one place up for every three-digit one,
and the constant is 10, then 110, then 1110: ten times a repunit, one 1 per digit. The reflection this
deposit uses on a single residue is the width-one case of it, which theorem 1 states at all three widths
so the pattern is decided rather than noticed.

THE SECOND HALF OF THE CLAUSE POINTS SOMEWHERE ELSE. 8 × 8 = 64, and 6 and 4 are not any two digits:
they are the fourth of the four transpositions in src/iso/80000-2-mathematics/mirror.lean. So 64 and 46 are one reflection
pair read in both directions, and 64 + 46 = 110 is theorem 1 and theorem 2 of that file meeting.

AND ALL FIVE ARE ONE MOD NINE. Write each of the four pairs, and the fixed point, as a two-digit number
— 19, 28, 37, 46, 55 — and every one of them is congruent to 1 mod 9, as is every reverse. It is forced:
10a + (10 − a) = 9a + 10, and 9a vanishes mod 9 leaving 10 ≡ 1. The whole mirror of this ring sits on
one residue, and that residue is the one the sequence opens and closes on.

ZERO, AGAIN, AND MORE EXACTLY THAN EXPECTED. refl 0 = 10 leaves the ring. One place up, exactly ONE
two-digit number leaves the two-digit range — and it is 10, which is refl 0 itself. Not an echo of
zero's exception at a larger width: the same number, carried up by the same +10 in the units place.
Every other trailing zero stays (20 reflects to 90), because the carry only clears 99 when the tens
digit is 1. Theorem 6 exhibits it; it was written first as "the numbers ending in zero" and refused.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>pairNums := [1, 2, 3, 4, 5].map (fun a =&gt; a * 10 + refl a)</code></pre>

<div class="thm" id="thm-digits-the_reflected_sum_is_ten_one_hundred_ten_and_one_thousand_one_hundred_ten">
<p class="thm-label"><strong>Theorem 698</strong> (<code>the_reflected_sum_is_ten_one_hundred_ten_and_one_thousand_one_hundred_ten</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_the_reflected_sum_is_ten_one_hundred_ten_and_one_thousand_one_hundred_ten.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 11).all (fun d =&gt; d + refl d == 10) &amp;&amp; ((List.range 100).drop 10).all (fun n =&gt; n + refl2 n == 110) &amp;&amp; ((List.range 1000).drop 100).all (fun n =&gt; n + refl3 n == 1110)</code></pre>
</div>
<p class="thm-remark">── 1 · THE REFLECTED SUM IS TEN TIMES A REPUNIT, AT EVERY WIDTH ────────────────────────────────────────── One digit gives 10, two give 110, three give 1110. Decided over every number of each width, not sampled.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,100,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-eight_and_eight_make_sixteen_which_reflects_to_ninety_four">
<p class="thm-label"><strong>Theorem 699</strong> (<code>eight_and_eight_make_sixteen_which_reflects_to_ninety_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_eight_and_eight_make_sixteen_which_reflects_to_ninety_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mn>8</mn><mo>+</mo><mn>8</mn></mrow><mo>=</mo><mn>16</mn></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl2</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mn>94</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>16</mn><mo>+</mo><mn>94</mn></mrow><mo>=</mo><mn>110</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>8 + 8 == 16 &amp;&amp; refl 1 == 9 &amp;&amp; refl 6 == 4 &amp;&amp; refl2 16 == 94 &amp;&amp; 16 + 94 == 110</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>8 + 8 = 16 \land \mathrm{refl}\mathopen{}\left(1\right) = 9 \land \mathrm{refl}\mathopen{}\left(6\right) = 4 \land \mathrm{refl2}\mathopen{}\left(16\right) = 94 \land 16 + 94 = 110</code></pre></details>
</div>
<p class="thm-remark">── 2 · EIGHT AND EIGHT ─────────────────────────────────────────────────────────────────────────────────── The clause itself, decided: the sum, the two digit reflections it names, and where they land.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-eight_times_eight_is_the_pair_six_four_read_both_ways">
<p class="thm-label"><strong>Theorem 700</strong> (<code>eight_times_eight_is_the_pair_six_four_read_both_ways</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_eight_times_eight_is_the_pair_six_four_read_both_ways.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mn>8</mn><mo>⋅</mo><mn>8</mn></mrow><mo>=</mo><mn>64</mn></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl2</mi><mo>(</mo><mn>64</mn><mo>)</mo></mrow><mo>=</mo><mn>46</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>64</mn><mo>+</mo><mn>46</mn></mrow><mo>=</mo><mn>110</mn></mrow></mrow><mo>∧</mo><mrow><mn>46</mn><mo>∈</mo><mi>pairNums</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>8 * 8 == 64 &amp;&amp; refl 6 == 4 &amp;&amp; refl 4 == 6 &amp;&amp; refl2 64 == 46 &amp;&amp; 64 + 46 == 110 &amp;&amp; pairNums.contains 46</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>8 \cdot 8 = 64 \land \mathrm{refl}\mathopen{}\left(6\right) = 4 \land \mathrm{refl}\mathopen{}\left(4\right) = 6 \land \mathrm{refl2}\mathopen{}\left(64\right) = 46 \land 64 + 46 = 110 \land 46 \in \mathrm{pairNums}</code></pre></details>
</div>
<p class="thm-remark">── 3 · EIGHT BY EIGHT IS A REFLECTION PAIR WRITTEN OUT ─────────────────────────────────────────────────── 64's digits are 6 and 4, which reflect to each other — so 64 and 46 are one pair of the mirror read in both directions, and they sum to 110 like everything else of two digits.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-every_pair_written_as_two_digits_is_one_mod_nine">
<p class="thm-label"><strong>Theorem 701</strong> (<code>every_pair_written_as_two_digits_is_one_mod_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_every_pair_written_as_two_digits_is_one_mod_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>pairNums</mi><mo>=</mo><mrow><mo>[</mo><mn>19</mn><mo>,</mo><mn>28</mn><mo>,</mo><mn>37</mn><mo>,</mo><mn>46</mn><mo>,</mo><mn>55</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mi>pairNums</mi><mo>,</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mi>pairNums</mi><mo>,</mo><mrow><mrow><mrow><mi>refl2</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mi>pairNums</mi><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mrow><mi>refl2</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow><mo>=</mo><mn>110</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pairNums == [19, 28, 37, 46, 55] &amp;&amp; pairNums.all (fun n =&gt; n % 9 == 1) &amp;&amp; pairNums.all (fun n =&gt; refl2 n % 9 == 1) &amp;&amp; pairNums.all (fun n =&gt; n + refl2 n == 110)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{pairNums} = [19,\,28,\,37,\,46,\,55] \land \forall n \in \mathrm{pairNums},\; n \bmod 9 = 1 \land \forall n \in \mathrm{pairNums},\; \mathrm{refl2}\mathopen{}\left(n\right) \bmod 9 = 1 \land \forall n \in \mathrm{pairNums},\; n + \mathrm{refl2}\mathopen{}\left(n\right) = 110</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE WHOLE MIRROR SITS ON ONE MOD NINE ───────────────────────────────────────────────────────────── 19, 28, 37, 46, 55 — the four pairs and the centre as two-digit numbers. Every one is 1 mod 9, and so is every reverse, because 10a + (10 − a) = 9a + 10 and the 9a vanishes. One is where the sequence opens.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 5 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-reflecting_both_digits_twice_returns_the_number">
<p class="thm-label"><strong>Theorem 702</strong> (<code>reflecting_both_digits_twice_returns_the_number</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_reflecting_both_digits_twice_returns_the_number.html">sealed</a>.</p>
<pre class="thm-statement"><code>((List.range 100).drop 10).all (fun n =&gt; refl2 (refl2 n) == n)</code></pre>
</div>
<p class="thm-remark">── 5 · REFLECTING TWICE RETURNS THE NUMBER ─────────────────────────────────────────────────────────────── An involution across the whole two-digit range, which is what licenses reading `refl2` as a mirror rather than as an arbitrary relabelling.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-exactly_one_two_digit_number_reflects_past_its_width_and_it_is_ten">
<p class="thm-label"><strong>Theorem 703</strong> (<code>exactly_one_two_digit_number_reflects_past_its_width_and_it_is_ten</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_exactly_one_two_digit_number_reflects_past_its_width_and_it_is_ten.html">sealed</a>.</p>
<pre class="thm-statement"><code>refl 0 == 10 &amp;&amp; refl2 10 == 100 &amp;&amp; refl2 (refl2 10) == 10 &amp;&amp; ((List.range 100).drop 10).filter (fun n =&gt; refl2 n &gt; 99) == [10] &amp;&amp; ((List.range 100).drop 10).all (fun n =&gt; (refl2 n &gt; 99) == (n == refl 0))</code></pre>
</div>
<p class="thm-remark">── 6 · ZERO'S EXCEPTION, ONE PLACE UP ──────────────────────────────────────────────────────────────────── refl 0 = 10 leaves the single digits; refl2 10 = 100 leaves the two-digit numbers, and returns. WRITTEN FIRST AS "exactly the numbers ending in zero", WHICH THE KERNEL REFUSED, and the truth is much sharper. A trailing zero contributes refl 0 = 10 in the units, which carries — but the carry only pushes past 99 when the tens digit is 1, so 20 reflects to 90 and stays. EXACTLY ONE two-digit number leaves its width, and it is 10: the number that is itself refl 0. Zero's exception at one digit is not merely echoed at two digits, it is the same number.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-the_nines_complement_gives_no_such_constant">
<p class="thm-label"><strong>Theorem 704</strong> (<code>the_nines_complement_gives_no_such_constant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_the_nines_complement_gives_no_such_constant.html">sealed</a>.</p>
<pre class="thm-statement"><code>((List.range 100).drop 10).any (fun n =&gt; n + ((9 - n / 10) * 10 + (9 - n % 10)) != 110) &amp;&amp; ((List.range 100).drop 10).all (fun n =&gt; n + ((9 - n / 10) * 10 + (9 - n % 10)) == 99) &amp;&amp; 99 != 110</code></pre>
</div>
<p class="thm-remark">── 7 · THE CONTROL: THE CONSTANT IS NOT FREE ───────────────────────────────────────────────────────────── Theorems 1 to 4 would all hold if `refl2` had collapsed to something that made every sum equal. A digit map that is NOT the ten's complement must fail to give any constant, and the nines' complement — one away, and the other complement every schoolbook teaches — gives 99 for some numbers and not others.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-digits-the_constants_are_ten_times_the_repunits">
<p class="thm-label"><strong>Theorem 705</strong> (<code>the_constants_are_ten_times_the_repunits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_digits_the_constants_are_ten_times_the_repunits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mn>10</mn><mo>=</mo><mrow><mn>10</mn><mo>⋅</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mn>110</mn><mo>=</mo><mrow><mn>10</mn><mo>⋅</mo><mn>11</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>1110</mn><mo>=</mo><mrow><mn>10</mn><mo>⋅</mo><mn>111</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>11110</mn><mo>=</mo><mrow><mn>10</mn><mo>⋅</mo><mn>1111</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>11</mn><mo>=</mo><mrow><mrow><mn>1</mn><mo>⋅</mo><mn>10</mn></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>111</mn><mo>=</mo><mrow><mrow><mn>11</mn><mo>⋅</mo><mn>10</mn></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>1111</mn><mo>=</mo><mrow><mrow><mn>111</mn><mo>⋅</mo><mn>10</mn></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>10 == 10 * 1 &amp;&amp; 110 == 10 * 11 &amp;&amp; 1110 == 10 * 111 &amp;&amp; 11110 == 10 * 1111 &amp;&amp; 11 == 1 * 10 + 1 &amp;&amp; 111 == 11 * 10 + 1 &amp;&amp; 1111 == 111 * 10 + 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>10 = 10 \cdot 1 \land 110 = 10 \cdot 11 \land 1110 = 10 \cdot 111 \land 11110 = 10 \cdot 1111 \land 11 = 1 \cdot 10 + 1 \land 111 = 11 \cdot 10 + 1 \land 1111 = 111 \cdot 10 + 1</code></pre></details>
</div>
<p class="thm-remark">── 8 · AND THE CONSTANTS ARE THE REPUNITS ──────────────────────────────────────────────────────────────── 10, 110, 1110 are 10 × 1, 10 × 11, 10 × 111 — one 1 for each place reflected. Stated so the three numbers in theorem 1 are read as a rule with a next term and not as three results.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
