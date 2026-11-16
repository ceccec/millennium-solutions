---
title: "The named theorems people ask for"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `demand3.lean`

<p class="paper-src"><code>src/iso/22739-ledger/demand3.lean</code> · namespace <code>Demand3</code> · 19 theorems · wing <code>the floor</code></p>

The third and last tier the search data supports. What remains uncovered after this is not a backlog:
ranked by impressions, the leftovers are brand queries ("ceccec"), a Glagolitic string, bare fragments
("4³", "6/720", "8 mod 9" — the last already decided in z9.lean), and the real-analysis cluster that was
refused in demand2.lean and stays refused. The demand map is close to exhausted of things a kernel can
settle, which is a better place to stop than an arbitrary count would have been.

Two of these were named by the previous pass as the reasonable next candidates and are here: Havel–Hakimi
and Lagrange's four-square theorem. Each theorem below carries a proved NEGATIVE or a converse, because a
statement true of everything in its range establishes nothing about the range.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>block := (List.range 8).flatMap (fun a =&gt; (List.range 8).map (fun b =&gt; cantor a b))</code></pre>

<div class="thm" id="thm-demand3-wilsons_theorem_and_its_converse">
<p class="thm-label"><strong>Theorem 303</strong> (<code>wilsons_theorem_and_its_converse</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_wilsons_theorem_and_its_converse.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mi>isPrime</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow></mrow><mo>∨</mo><mrow><mrow><mrow><mi>Sequences.fact</mi><mo>(</mo><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>mod</mo><mi>p</mi></mrow><mo>=</mo><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>5</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isPrime</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>∨</mo><mrow><mrow><mrow><mi>Sequences.fact</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>mod</mo><mi>n</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 2 18).all (fun p =&gt; ¬ isPrime p || Sequences.fact (p - 1) % p == p - 1)) ∧ ((List.range' 5 15).all (fun n =&gt; isPrime n || Sequences.fact (n - 1) % n == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \{2,\dots,19\},\; \lnot \mathrm{isPrime}\mathopen{}\left(p\right) \lor \mathrm{Sequences.fact}\mathopen{}\left(p - 1\right) \bmod p = p - 1 \land \forall n \in \{5,\dots,19\},\; \mathrm{isPrime}\mathopen{}\left(n\right) \lor \mathrm{Sequences.fact}\mathopen{}\left(n - 1\right) \bmod n = 0</code></pre></details>
</div>
<p class="thm-remark">── 1 · WILSON'S THEOREM, and its converse, which is the half that makes it a test. (p−1)! ≡ −1 mod p for every prime, written as ≡ p−1 since Nat has no negatives; and for every composite above four, (n−1)! ≡ 0. The two together are a primality CRITERION rather than a property of primes. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 270 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-every_number_is_a_sum_of_four_squares">
<p class="thm-label"><strong>Theorem 304</strong> (<code>every_number_is_a_sum_of_four_squares</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_every_number_is_a_sum_of_four_squares.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>59</mn><mo>}</mo></mrow><mo>,</mo><mi>isSumOfFour</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>∧</mo><mrow><mrow><mi>isSumOfThree</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>isSumOfFour</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 60).all isSumOfFour ∧ isSumOfThree 7 = false ∧ isSumOfFour 7 = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{0,\dots,59\},\; \mathrm{isSumOfFour}\mathopen{}\left(x\right) \land \mathrm{isSumOfThree}\mathopen{}\left(7\right) = \mathrm{false} \land \mathrm{isSumOfFour}\mathopen{}\left(7\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-the_cantor_pairing_is_injective_and_covers_an_initial_segment">
<p class="thm-label"><strong>Theorem 305</strong> (<code>the_cantor_pairing_is_injective_and_covers_an_initial_segment</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_the_cantor_pairing_is_injective_and_covers_an_initial_segment.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>block</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>64</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>35</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>n</mi><mo>∈</mo><mi>block</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>block.eraseDups.length = 64 ∧ ((List.range 36).all (fun n =&gt; block.contains n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{block}\right)\right| = 64 \land \forall n \in \{0,\dots,35\},\; n \in \mathrm{block}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-repunit_divisibility_by_three_and_seven">
<p class="thm-label"><strong>Theorem 306</strong> (<code>repunit_divisibility_by_three_and_seven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_repunit_divisibility_by_three_and_seven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>18</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>repunit</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>18</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>repunit</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>mod</mo><mn>7</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>6</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 1 18).all (fun n =&gt; (repunit n % 3 == 0) == (n % 3 == 0))) ∧ ((List.range' 1 18).all (fun n =&gt; (repunit n % 7 == 0) == (n % 6 == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,18\},\; \mathrm{repunit}\mathopen{}\left(n\right) \bmod 3 = 0 = n \bmod 3 = 0 \land \forall n \in \{1,\dots,18\},\; \mathrm{repunit}\mathopen{}\left(n\right) \bmod 7 = 0 = n \bmod 6 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 324 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-the_euler_characteristic_of_a_genus_g_surface">
<p class="thm-label"><strong>Theorem 307</strong> (<code>the_euler_characteristic_of_a_genus_g_surface</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_the_euler_characteristic_of_a_genus_g_surface.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>g</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>chi</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow><mo>+</mo><mrow><mn>2</mn><mo>⋅</mo><mrow><mo>(</mo><mi>g</mi><mo>:</mo><mi>Int</mi><mo>)</mo></mrow></mrow></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>chi</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>chi</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>chi</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>−</mo><mn>2</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 12).all (fun g =&gt; chi g + 2 * (g : Int) == 2)) ∧ chi 0 = 2 ∧ chi 1 = 0 ∧ chi 2 = -2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall g \in \{0,\dots,11\},\; \mathrm{chi}\mathopen{}\left(g\right) + 2 \cdot \left(g : \mathbb{Z}\right) = 2 \land \mathrm{chi}\mathopen{}\left(0\right) = 2 \land \mathrm{chi}\mathopen{}\left(1\right) = 0 \land \mathrm{chi}\mathopen{}\left(2\right) = -2</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 12 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-odd_divisor_count_iff_perfect_square">
<p class="thm-label"><strong>Theorem 308</strong> (<code>odd_divisor_count_iff_perfect_square</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_odd_divisor_count_iff_perfect_square.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>120</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>divisors</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>=</mo><mrow><mi>isSquare</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 120).all (fun n =&gt; ((divisors n).length % 2 == 1) == isSquare n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,120\},\; \left|\mathrm{divisors}\mathopen{}\left(n\right)\right| \bmod 2 = 1 = \mathrm{isSquare}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 120 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-havel_hakimi_decides_graphical_sequences">
<p class="thm-label"><strong>Theorem 309</strong> (<code>havel_hakimi_decides_graphical_sequences</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_havel_hakimi_decides_graphical_sequences.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mi>hh</mi><mo>(</mo><mn>12</mn><mo>,</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>hh</mi><mo>(</mo><mn>12</mn><mo>,</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>2</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>hh</mi><mo>(</mo><mn>12</mn><mo>,</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>hh</mi><mo>(</mo><mn>12</mn><mo>,</mo><mrow><mo>[</mo><mn>4</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>hh</mi><mo>(</mo><mn>12</mn><mo>,</mo><mrow><mo>[</mo><mn>5</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>hh 12 [3, 3, 3, 3] = true ∧ hh 12 [2, 2, 2] = true ∧ hh 12 [3, 3, 1, 1] = false ∧ hh 12 [4, 1, 1, 1, 1] = true ∧ hh 12 [5, 1, 1, 1, 1] = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{hh}\mathopen{}\left(12,\,[3,\,3,\,3,\,3]\right) = \mathrm{true} \land \mathrm{hh}\mathopen{}\left(12,\,[2,\,2,\,2]\right) = \mathrm{true} \land \mathrm{hh}\mathopen{}\left(12,\,[3,\,3,\,1,\,1]\right) = \mathrm{false} \land \mathrm{hh}\mathopen{}\left(12,\,[4,\,1,\,1,\,1,\,1]\right) = \mathrm{true} \land \mathrm{hh}\mathopen{}\left(12,\,[5,\,1,\,1,\,1,\,1]\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-the_euler_characteristic_of_a_genus_g_surface_for_every_g">
<p class="thm-label"><strong>Theorem 310</strong> (<code>the_euler_characteristic_of_a_genus_g_surface_for_every_g</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_the_euler_characteristic_of_a_genus_g_surface_for_every_g.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ g : Nat, chi g + 2 * (g : Int) = 2</code></pre>
</div>
<p class="thm-remark">── the capped rows above, proved for every value by induction — no bound ──────────────────────────────────── the_euler_characteristic_of_a_genus_g_surface checked g &lt; 12; this proves χ(g) + 2g = 2 for every g.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-a_repunit_has_the_residue_of_its_length_mod_three">
<p class="thm-label"><strong>Theorem 311</strong> (<code>a_repunit_has_the_residue_of_its_length_mod_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_a_repunit_has_the_residue_of_its_length_mod_three.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, repunit n % 3 = n % 3</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-a_repunit_is_divisible_by_three_exactly_when_its_length_is_for_every_n">
<p class="thm-label"><strong>Theorem 312</strong> (<code>a_repunit_is_divisible_by_three_exactly_when_its_length_is_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_a_repunit_is_divisible_by_three_exactly_when_its_length_is_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (repunit n % 3 = 0) ↔ (n % 3 = 0)</code></pre>
</div>
<p class="thm-remark">repunit_divisibility_by_three_and_seven checked n ≤ 18; these prove both halves for every n.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-repunit_of_a_sum">
<p class="thm-label"><strong>Theorem 313</strong> (<code>repunit_of_a_sum</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_repunit_of_a_sum.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n k : Nat, repunit (n + k) = 10 ^ k * repunit n + repunit k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-repunits_repeat_mod_seven_every_six_digits">
<p class="thm-label"><strong>Theorem 314</strong> (<code>repunits_repeat_mod_seven_every_six_digits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_repunits_repeat_mod_seven_every_six_digits.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, repunit (n + 6) % 7 = repunit n % 7</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-a_repunit_has_the_residue_of_its_length_mod_six_mod_seven">
<p class="thm-label"><strong>Theorem 315</strong> (<code>a_repunit_has_the_residue_of_its_length_mod_six_mod_seven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_a_repunit_has_the_residue_of_its_length_mod_six_mod_seven.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, repunit n % 7 = repunit (n % 6) % 7</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-a_repunit_is_divisible_by_seven_exactly_when_six_divides_its_length_for_every_n">
<p class="thm-label"><strong>Theorem 316</strong> (<code>a_repunit_is_divisible_by_seven_exactly_when_six_divides_its_length_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_a_repunit_is_divisible_by_seven_exactly_when_six_divides_its_length_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (repunit n % 7 = 0) ↔ (n % 6 = 0)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-the_two_coin_fare_is_minus_the_euler_characteristic_at_genus_two">
<p class="thm-label"><strong>Theorem 317</strong> (<code>the_two_coin_fare_is_minus_the_euler_characteristic_at_genus_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_the_two_coin_fare_is_minus_the_euler_characteristic_at_genus_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>(</mo><mn>110</mn><mo>:</mo><mi>Int</mi><mo>)</mo></mrow><mo>-</mo><mn>108</mn></mrow><mo>=</mo><mrow><mo>−</mo><mrow><mi>chi</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(110 : Int) - 108 = - chi 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left(110 : \mathbb{Z}\right) - 108 = -\mathrm{chi}\mathopen{}\left(2\right)</code></pre></details>
</div>
<p class="thm-remark">── the fair-exchange unit, tied to the law above ─────────────────────────────────────────────────────────── The deposit's fare is two coins, 110 − 108 = 2, written until now only in prose (split.lean's comments). χ is proved for every genus above; at genus 2 its negative is exactly the fare.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-the_genus_reads_back_from_chi_for_every_g">
<p class="thm-label"><strong>Theorem 318</strong> (<code>the_genus_reads_back_from_chi_for_every_g</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_the_genus_reads_back_from_chi_for_every_g.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ g : Nat, ((2 - chi g) / 2).toNat = g</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-chi_is_injective_for_every_g_h">
<p class="thm-label"><strong>Theorem 319</strong> (<code>chi_is_injective_for_every_g_h</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_chi_is_injective_for_every_g_h.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ g h : Nat, chi g = chi h → g = h</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-a_repunit_is_below_ten_to_its_length">
<p class="thm-label"><strong>Theorem 320</strong> (<code>a_repunit_is_below_ten_to_its_length</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_a_repunit_is_below_ten_to_its_length.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, repunit k &lt; 10 ^ k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-demand3-a_repunit_splits_back_into_its_two_parts_for_every_n_k">
<p class="thm-label"><strong>Theorem 321</strong> (<code>a_repunit_splits_back_into_its_two_parts_for_every_n_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_demand3_a_repunit_splits_back_into_its_two_parts_for_every_n_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n k : Nat, repunit (n + k) / 10 ^ k = repunit n ∧ repunit (n + k) % 10 ^ k = repunit k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
