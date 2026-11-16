---
title: "The two-sided coin"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `coin.lean`

<p class="paper-src"><code>src/iso/22739-ledger/coin.lean</code> · namespace <code>Coin</code> · 12 theorems · wing <code>the ring</code></p>

One involution on ten digits, two sides, one fixed point, and one digit that leaves.


WHAT THIS FILE DOES AND DOES NOT ANSWER. It was written from a statement about a coin with a black-hole
side that pulls in whatever is not harmonic and a white-hole side that reflects, under fusion pressure,
speed and temperature. The kernel can decide none of that: there is no black hole here, no white hole, no
pressure, no temperature and no fusion. Those words name physics, this file names arithmetic, and a
theorem that borrowed them would be the overclaim this deposit exists to refuse.

What the statement HAS underneath it is a shape, and the shape is decidable: an involution that sorts a
finite set into a side that returns to itself and a side that is carried across, with a centre that does
not move and exactly one element that leaves. That is checked below over the whole domain. Read as
geometry it is a reflection; read as a coin it is two faces and an edge. It is not read here as a
gravitational object, and nothing below licenses that reading.

  r(d) = 10 − d, on the digits 0..9:

    {2, 5, 8}   reflected ONTO ITSELF — the side that returns
    {1, 4, 7} ↔ {3, 6, 9}   carried across and carried back — the two faces swapped
    5   the only fixed point — the centre, unmoved by the reflection
    0   the only digit whose reflection LEAVES 0..9, since r(0) = 10

The last of those is the one worth stating carefully: the origin is not pulled anywhere, it simply has no
partner inside the set. An absence of a partner is not a force.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>tetA := [1, 4, 7]
tetB := [2, 5, 8]
axis := [3, 6, 9]
digits := [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
nonzero := [1, 2, 3, 4, 5, 6, 7, 8, 9]</code></pre>

<div class="thm" id="thm-coin-the_reflection_is_an_involution">
<p class="thm-label"><strong>Theorem 670</strong> (<code>the_reflection_is_an_involution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_the_reflection_is_an_involution.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>digits.all (fun d =&gt; refl (refl d) == d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{digits},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">── THE INVOLUTION: applied twice, nothing is lost ─────────────────────────────────────────────────────── This is what makes the two sides sides OF ONE THING rather than two unrelated sets: the map back is the same map. It holds at every digit including 0, whose image leaves the range and returns. READ ALONE, THIS THEOREM DOES NOT PIN THE REFLECTION. `d ↦ c - d` is an involution on 0..9 for EVERY c from 9 to 20 under Nat's truncating subtraction — twelve constants satisfy it, and this states only that ours is one of them. ceccec.github.io found the same shape in their tree as a facet checking `reflect(reflect(h)) === h`, which holds for xor with ANY mask: it tested the operator, not the reflection. What pins c = 10 is two theorems below, and only together: `exactly_one_digit_is_unmoved` requires the fixed points to be exactly [5], and `exactly_one_digit_reflects_out_of_range` requires exactly [0] to leave the range. c = 12 fixes 6, c = 18 fixes 9, c = 9 fixes nothing; none of them leaves exactly one digit outside. So the FILE identifies the reflection and this theorem does not, and anyone citing this one alone should cite those with it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-one_side_is_reflected_onto_itself">
<p class="thm-label"><strong>Theorem 671</strong> (<code>one_side_is_reflected_onto_itself</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_one_side_is_reflected_onto_itself.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>tetB</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>tetB</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>tetB.all (fun d =&gt; tetB.contains (refl d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{tetB},\; \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{tetB}</code></pre></details>
</div>
<p class="thm-remark">── ONE SIDE RETURNS TO ITSELF ───────────────────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-the_other_two_swap">
<p class="thm-label"><strong>Theorem 672</strong> (<code>the_other_two_swap</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_the_other_two_swap.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>tetA</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>axis</mi></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>axis</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>tetA</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tetA.all (fun d =&gt; axis.contains (refl d)) ∧ axis.all (fun d =&gt; tetA.contains (refl d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{tetA},\; \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{axis} \land \forall d \in \mathrm{axis},\; \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{tetA}</code></pre></details>
</div>
<p class="thm-remark">── THE OTHER TWO ARE CARRIED ACROSS, IN BOTH DIRECTIONS ───────────────────────────────────────────────── Stated both ways round, because "carried across" said once could hold for a map that collapses one set into the other and never comes back. It comes back.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-exactly_one_digit_is_unmoved">
<p class="thm-label"><strong>Theorem 673</strong> (<code>exactly_one_digit_is_unmoved</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_exactly_one_digit_is_unmoved.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(digits.filter (fun d =&gt; refl d == d)) = [5]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \mathrm{digits} \mid \mathrm{refl}\mathopen{}\left(d\right) = d \,\} = [5]</code></pre></details>
</div>
<p class="thm-remark">── THE CENTRE, AND ONLY IT ──────────────────────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-exactly_one_digit_reflects_out_of_range">
<p class="thm-label"><strong>Theorem 674</strong> (<code>exactly_one_digit_reflects_out_of_range</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_exactly_one_digit_reflects_out_of_range.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>9</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(digits.filter (fun d =&gt; refl d &gt; 9)) = [0] ∧ refl 0 = 10</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \mathrm{digits} \mid \mathrm{refl}\mathopen{}\left(d\right) &gt; 9 \,\} = [0] \land \mathrm{refl}\mathopen{}\left(0\right) = 10</code></pre></details>
</div>
<p class="thm-remark">── THE ONE THAT LEAVES ────────────────────────────────────────────────────────────────────────────────── The origin is the only digit whose reflection is not a digit. Nothing acts on it; it has no partner inside the set, which is a fact about the set and not about a force.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-the_classes_partition_the_nine">
<p class="thm-label"><strong>Theorem 675</strong> (<code>the_classes_partition_the_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_the_classes_partition_the_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>tetA</mi><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mi>tetB</mi><mo>|</mo></mrow></mrow><mo>+</mo><mrow><mo>|</mo><mi>axis</mi><mo>|</mo></mrow></mrow><mo>=</mo><mn>9</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mrow><mi>tetA</mi><mo>⧺</mo><mi>tetB</mi></mrow><mo>⧺</mo><mi>axis</mi></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>digits</mi><mo>|</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>tetA.length + tetB.length + axis.length = 9 ∧ (tetA ++ tetB ++ axis).eraseDups.length = 9 ∧ digits.length = 10</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{tetA}\right| + \left|\mathrm{tetB}\right| + \left|\mathrm{axis}\right| = 9 \land \left|\operatorname{dedup}\left(\mathrm{tetA} \mathbin{+\!\!+} \mathrm{tetB} \mathbin{+\!\!+} \mathrm{axis}\right)\right| = 9 \land \left|\mathrm{digits}\right| = 10</code></pre></details>
</div>
<p class="thm-remark">── THE THREE CLASSES COVER THE NINE, AND THE PARTITION IS A PARTITION ───────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-every_digit_is_sorted_exactly_once">
<p class="thm-label"><strong>Theorem 676</strong> (<code>every_digit_is_sorted_exactly_once</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_every_digit_is_sorted_exactly_once.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mrow><mi>d</mi><mo>∈</mo><mi>tetB</mi></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>tetB</mi></mrow></mrow><mo>∨</mo><mrow><mrow><mi>d</mi><mo>∈</mo><mi>tetA</mi></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>axis</mi></mrow></mrow></mrow><mo>∨</mo><mrow><mrow><mi>d</mi><mo>∈</mo><mi>axis</mi></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>tetA</mi></mrow></mrow></mrow><mo>∨</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∨</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>9</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>digits.all (fun d =&gt; (tetB.contains d &amp;&amp; tetB.contains (refl d)) || (tetA.contains d &amp;&amp; axis.contains (refl d)) || (axis.contains d &amp;&amp; tetA.contains (refl d)) || (refl d == d) || (refl d &gt; 9))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{digits},\; d \in \mathrm{tetB} \land \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{tetB} \lor d \in \mathrm{tetA} \land \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{axis} \lor d \in \mathrm{axis} \land \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{tetA} \lor \mathrm{refl}\mathopen{}\left(d\right) = d \lor \mathrm{refl}\mathopen{}\left(d\right) &gt; 9</code></pre></details>
</div>
<p class="thm-remark">── NOTHING SURVIVES IN BETWEEN ────────────────────────────────────────────────────────────────────────── Every digit is in exactly one of: reflected onto its own side, carried across, unmoved, or gone from the range. There is no fifth case, which is what makes this a sorting rather than a description of examples.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-the_fall_fixes_every_digit_but_the_void">
<p class="thm-label"><strong>Theorem 677</strong> (<code>the_fall_fixes_every_digit_but_the_void</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_the_fall_fixes_every_digit_but_the_void.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>∣</mo><mrow><mrow><mi>fall</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>≠</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>nonzero</mi><mo>,</mo><mrow><mrow><mi>fall</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(digits.filter (fun d =&gt; fall d != d)) = [0] ∧ nonzero.all (fun d =&gt; fall d == d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \mathrm{digits} \mid \mathrm{fall}\mathopen{}\left(d\right) \neq d \,\} = [0] \land \forall d \in \mathrm{nonzero},\; \mathrm{fall}\mathopen{}\left(d\right) = d</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-the_fall_and_the_reflection_share_one_exceptional_digit">
<p class="thm-label"><strong>Theorem 678</strong> (<code>the_fall_and_the_reflection_share_one_exceptional_digit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_the_fall_and_the_reflection_share_one_exceptional_digit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>∣</mo><mrow><mrow><mi>fall</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>≠</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>9</mn></mrow><mo>}</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(digits.filter (fun d =&gt; fall d != d)) = (digits.filter (fun d =&gt; refl d &gt; 9))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \mathrm{digits} \mid \mathrm{fall}\mathopen{}\left(d\right) \neq d \,\} = \{\, d \in \mathrm{digits} \mid \mathrm{refl}\mathopen{}\left(d\right) &gt; 9 \,\}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-on_the_fixed_points_the_reflection_never_leaves">
<p class="thm-label"><strong>Theorem 679</strong> (<code>on_the_fixed_points_the_reflection_never_leaves</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_on_the_fixed_points_the_reflection_never_leaves.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>nonzero</mi><mo>,</mo><mrow><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>≥</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>≤</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>nonzero</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>nonzero.all (fun d =&gt; refl d &gt;= 1 &amp;&amp; refl d &lt;= 9) ∧ nonzero.all (fun d =&gt; refl (refl d) == d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{nonzero},\; \mathrm{refl}\mathopen{}\left(d\right) \ge 1 \land \mathrm{refl}\mathopen{}\left(d\right) \le 9 \land \forall d \in \mathrm{nonzero},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">On the fixed points of gravity the reflection stays inside and undoes itself: the side that returns.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-what_escapes_falls_back_inside">
<p class="thm-label"><strong>Theorem 680</strong> (<code>what_escapes_falls_back_inside</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_what_escapes_falls_back_inside.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>refl</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow><mo>∧</mo><mrow><mrow><mi>fall</mi><mo>(</mo><mn>10</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fall</mi><mo>(</mo><mn>10</mn><mo>)</mo></mrow><mo>∈</mo><mi>nonzero</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>refl 0 = 10 ∧ fall 10 = 1 ∧ nonzero.contains (fall 10)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{refl}\mathopen{}\left(0\right) = 10 \land \mathrm{fall}\mathopen{}\left(10\right) = 1 \land \mathrm{fall}\mathopen{}\left(10\right) \in \mathrm{nonzero}</code></pre></details>
</div>
<p class="thm-remark">And what does escape falls straight back in, so the coin has no outside.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-coin-the_nines_complement_pairs_the_ten_digits">
<p class="thm-label"><strong>Theorem 681</strong> (<code>the_nines_complement_pairs_the_ten_digits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_coin_the_nines_complement_pairs_the_ten_digits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>,</mo><mrow><mrow><mrow><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>∈</mo><mi>digits</mi></mrow><mo>∧</mo><mrow><mrow><mn>9</mn><mo>-</mo><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>≠</mo><mi>d</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>digits</mi><mo>∣</mo><mrow><mi>d</mi><mo>&lt;</mo><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>⋅</mo><mn>2</mn></mrow><mo>=</mo><mrow><mo>|</mo><mi>digits</mi><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>digits.all (fun d =&gt; digits.contains (9 - d) &amp;&amp; 9 - (9 - d) == d &amp;&amp; 9 - d != d) ∧ (digits.filter (fun d =&gt; d &lt; 9 - d)).length * 2 = digits.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{digits},\; 9 - d \in \mathrm{digits} \land 9 - 9 - d = d \land 9 - d \neq d \land \left|\{\, d \in \mathrm{digits} \mid d &lt; 9 - d \,\}\right| \cdot 2 = \left|\mathrm{digits}\right|</code></pre></details>
</div>
<p class="thm-remark">── THE REFUSAL, as a theorem so it is checked and not merely written ──────────────────────────────────── The count of ASTROPHYSICAL claims this file makes. Gravity here is the fall to a fixed point, decided above; a black hole is not, and no proposition in this file mentions one. and the words that would make it one appear in the header as the thing being refused, never in a proposition. This file carries NO marker either way. It decides a reflection on ten digits; there is no physical claim available to make boldly and none to refuse — inventing one in either direction would be the numerology priorart.lean refuses elsewhere. A file with nothing to claim says nothing, which is not the same as a file that claims nothing. There was a `def physicalClaims : Nat := 0` here, decided against its own literal. The comment beside it argued that "written as one it would be equally green" — which is the proof that it certified nothing in EITHER direction: the number was zero because it was typed as zero, and would stay zero while the file filled with claims about the sky. Whether a proposition names a physical quantity is a fact about this file's TEXT, and Lean cannot read its own text. The refusal now lives in `contradictions.ts`, which reads the propositions and can go red. What is kept here is the conjunct that was always read off a real list. The nines complement pairs the ten digits: d ↦ 9 − d maps them onto themselves, undoes itself and fixes none, so they fall into five pairs — the ten is the size of the pairing, not a length typed beside it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
