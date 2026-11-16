---
title: "Entanglement in the ring"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `z9plus.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/z9plus.lean</code> · namespace <code>Z9Plus</code> · 48 theorems · wing <code>the ring</code></p>

ℤ/9, the second batch — powers, digital roots, primitive roots, and the orbit's period.


z9.lean settled the families exhaustively. This settles the claims the ledger stated individually and never
doubling orbit's digital root, and the identity behind digit-reversal invariance. Each is stated as an
EQUIVALENCE or an exact set where the ledger stated instances, so the negative half is proved too.

Reversal is imported for digits and reverseNum rather than restated. No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>R := List.range 9
orbit6 := (List.range 6).map (fun k =&gt; pw 2 k)</code></pre>

<div class="thm" id="thm-z9plus-squares_land_exactly_in_zero_one_four_seven">
<p class="thm-label"><strong>Theorem 1092</strong> (<code>squares_land_exactly_in_zero_one_four_seven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_squares_land_exactly_in_zero_one_four_seven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow><mo>,</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>=</mo><mi>s</mi></mrow></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun d =&gt; [0, 1, 4, 7].contains (m9 (d * d))) ∧ [0, 1, 4, 7].all (fun s =&gt; R.any (fun d =&gt; m9 (d * d) == s))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(d \mapsto \mathrm{m9}\mathopen{}\left(d \cdot d\right) \in [0,\,1,\,4,\,7]\right) \land \forall s \in [0,\,1,\,4,\,7],\; \mathrm{R.any}\mathopen{}\left(d \mapsto \mathrm{m9}\mathopen{}\left(d \cdot d\right) = s\right)</code></pre></details>
</div>
<p class="thm-remark">── SQUARES: the exact image of d ↦ d² is {0,1,4,7}, and nothing else is reachable ── stated in BOTH directions rather than by sorting: every square lands in the set, and every member of the set is actually reached. (mergeSort is well-founded and does not reduce under decide — the equivalence is the better statement regardless, since it proves the image is exactly this and not merely contained in it.)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-five_is_not_a_square_mod_nine">
<p class="thm-label"><strong>Theorem 1093</strong> (<code>five_is_not_a_square_mod_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_five_is_not_a_square_mod_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ (R.any (fun d =&gt; m9 (d * d) == 5))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \mathrm{R.any}\mathopen{}\left(d \mapsto \mathrm{m9}\mathopen{}\left(d \cdot d\right) = 5\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-cubes_land_exactly_in_zero_one_eight">
<p class="thm-label"><strong>Theorem 1094</strong> (<code>cubes_land_exactly_in_zero_one_eight</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_cubes_land_exactly_in_zero_one_eight.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mrow><mi>pw</mi><mo>(</mo><mi>d</mi><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mrow><mi>pw</mi><mo>(</mo><mi>d</mi><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mi>c</mi></mrow></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun d =&gt; [0, 1, 8].contains (pw d 3)) ∧ [0, 1, 8].all (fun c =&gt; R.any (fun d =&gt; pw d 3 == c))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(d \mapsto \mathrm{pw}\mathopen{}\left(d,\,3\right) \in [0,\,1,\,8]\right) \land \forall c \in [0,\,1,\,8],\; \mathrm{R.any}\mathopen{}\left(d \mapsto \mathrm{pw}\mathopen{}\left(d,\,3\right) = c\right)</code></pre></details>
</div>
<p class="thm-remark">── CUBES: the exact image is {0,1,8} — the nilpotent and the two self-inverse units ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-primitive_roots_are_exactly_two_and_five">
<p class="thm-label"><strong>Theorem 1095</strong> (<code>primitive_roots_are_exactly_two_and_five</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_primitive_roots_are_exactly_two_and_five.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>R.filter</mi><mo>(</mo><mi>generates</mi><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(R.filter generates) = [2, 5]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.filter}\mathopen{}\left(\mathrm{generates}\right) = [2,\,5]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-primitive_root_iff_generates_the_units">
<p class="thm-label"><strong>Theorem 1096</strong> (<code>primitive_root_iff_generates_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_primitive_root_iff_generates_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mi>R.all</mi><mo>(</mo><mrow><mi>g</mi><mo>↦</mo><mrow><mrow><mi>generates</mi><mo>(</mo><mi>g</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>g</mi><mo>∈</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow></mrow></mrow><mo>)</mo></mrow></math></div>
<pre class="thm-statement"><code>R.all (fun g =&gt; generates g == ([2, 5].contains g))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{R.all}\mathopen{}\left(g \mapsto \mathrm{generates}\mathopen{}\left(g\right) = g \in [2,\,5]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-doubling_has_period_six">
<p class="thm-label"><strong>Theorem 1097</strong> (<code>doubling_has_period_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_doubling_has_period_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mrow><mi>k</mi><mo>+</mo><mn>6</mn></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun k =&gt; pw 2 k == pw 2 (k + 6))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,29\},\; \mathrm{pw}\mathopen{}\left(2,\,k\right) = \mathrm{pw}\mathopen{}\left(2,\,k + 6\right)</code></pre></details>
</div>
<p class="thm-remark">── THE ORBIT'S PERIOD: 2^k mod 9 repeats with period exactly 6, and no smaller period divides it ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 30 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-no_period_smaller_than_six">
<p class="thm-label"><strong>Theorem 1098</strong> (<code>no_period_smaller_than_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_no_period_smaller_than_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∃</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow><mo>:</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mrow><mi>k</mi><mo>+</mo><mi>p</mi></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ([1, 2, 3, 4, 5].any (fun p =&gt; (List.range 12).all (fun k =&gt; pw 2 k == pw 2 (k + p))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \exists p \in [1,\,2,\,3,\,4,\,5] : \forall k \in \{0,\dots,11\},\; \mathrm{pw}\mathopen{}\left(2,\,k\right) = \mathrm{pw}\mathopen{}\left(2,\,k + p\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-digital_root_agrees_with_the_residue">
<p class="thm-label"><strong>Theorem 1099</strong> (<code>digital_root_agrees_with_the_residue</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_digital_root_agrees_with_the_residue.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>300</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>dr</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>9</mn></mrow><mo>=</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 300).all (fun n =&gt; (dr n == 9) == (m9 n == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,300\},\; \mathrm{dr}\mathopen{}\left(n\right) = 9 = \mathrm{m9}\mathopen{}\left(n\right) = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 300 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-digital_root_is_the_digit_sum_residue">
<p class="thm-label"><strong>Theorem 1100</strong> (<code>digital_root_is_the_digit_sum_residue</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_digital_root_is_the_digit_sum_residue.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>300</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>digitSum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>m9</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 300).all (fun n =&gt; m9 (digitSum n) == m9 n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,300\},\; \mathrm{m9}\mathopen{}\left(\mathrm{digitSum}\mathopen{}\left(n\right)\right) = \mathrm{m9}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">── and the digit SUM is what carries it — which is why reversal cannot change it ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 300 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-reversal_cannot_change_the_digital_root">
<p class="thm-label"><strong>Theorem 1101</strong> (<code>reversal_cannot_change_the_digital_root</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_reversal_cannot_change_the_digital_root.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>300</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>dr</mi><mo>(</mo><mrow><mi>reverseNum</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>dr</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 300).all (fun n =&gt; dr (reverseNum n) == dr n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,300\},\; \mathrm{dr}\mathopen{}\left(\mathrm{reverseNum}\mathopen{}\left(n\right)\right) = \mathrm{dr}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 300 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-orbit_digital_roots_have_period_six">
<p class="thm-label"><strong>Theorem 1102</strong> (<code>orbit_digital_roots_have_period_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_orbit_digital_roots_have_period_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>dr</mi><mo>(</mo><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>dr</mi><mo>(</mo><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mrow><mi>k</mi><mo>+</mo><mn>6</mn></mrow><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 24).all (fun k =&gt; dr (pw 2 k) == dr (pw 2 (k + 6)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,23\},\; \mathrm{dr}\mathopen{}\left(\mathrm{pw}\mathopen{}\left(2,\,k\right)\right) = \mathrm{dr}\mathopen{}\left(\mathrm{pw}\mathopen{}\left(2,\,k + 6\right)\right)</code></pre></details>
</div>
<p class="thm-remark">── the orbit's digital roots also cycle with period six ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 24 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_orders_of_the_units_are_exact">
<p class="thm-label"><strong>Theorem 1103</strong> (<code>the_orders_of_the_units_are_exact</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_orders_of_the_units_are_exact.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>ord</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>ord</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>ord</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>ord</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>ord</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>ord</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ord 1 = 1 ∧ ord 8 = 2 ∧ ord 4 = 3 ∧ ord 7 = 3 ∧ ord 2 = 6 ∧ ord 5 = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ord}\mathopen{}\left(1\right) = 1 \land \mathrm{ord}\mathopen{}\left(8\right) = 2 \land \mathrm{ord}\mathopen{}\left(4\right) = 3 \land \mathrm{ord}\mathopen{}\left(7\right) = 3 \land \mathrm{ord}\mathopen{}\left(2\right) = 6 \land \mathrm{ord}\mathopen{}\left(5\right) = 6</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_unit_table_is_a_latin_square">
<p class="thm-label"><strong>Theorem 1104</strong> (<code>the_unit_table_is_a_latin_square</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_unit_table_is_a_latin_square.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>m9</mi><mo>(</mo><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>)</mo></mrow><mo>∣</mo><mi>b</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>∃</mo><mi>b</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>:</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>)</mo></mrow><mo>=</mo><mi>c</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[1,2,4,5,7,8].all (fun a =&gt; (([1,2,4,5,7,8].map (fun b =&gt; m9 (a * b))).eraseDups).length == 6 ∧ [1,2,4,5,7,8].all (fun c =&gt; [1,2,4,5,7,8].any (fun b =&gt; m9 (a * b) == c)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in [1,\,2,\,4,\,5,\,7,\,8],\; \left|\operatorname{dedup}\left(\{\, \mathrm{m9}\mathopen{}\left(a \cdot b\right) \mid b \in [1,\,2,\,4,\,5,\,7,\,8] \,\}\right)\right| = 6 \land \forall c \in [1,\,2,\,4,\,5,\,7,\,8],\; \exists b \in [1,\,2,\,4,\,5,\,7,\,8] : \mathrm{m9}\mathopen{}\left(a \cdot b\right) = c</code></pre></details>
</div>
<p class="thm-remark">── the multiplication table on the units is a LATIN SQUARE: every row is a permutation of the units, which is the group axiom made visible at every entry ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,296 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_orbit_never_meets_the_triad">
<p class="thm-label"><strong>Theorem 1105</strong> (<code>the_orbit_never_meets_the_triad</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_orbit_never_meets_the_triad.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun k =&gt; ! [0, 3, 6].contains (pw 2 k))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,39\},\; \lnot \mathrm{pw}\mathopen{}\left(2,\,k\right) \in [0,\,3,\,6]</code></pre></details>
</div>
<p class="thm-remark">── the doubling orbit never touches the triad: no power of two is ever 0, 3 or 6, so the units and the non-units are genuinely separate under multiplication ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 120 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_reflected_orbit_covers_the_whole_triad">
<p class="thm-label"><strong>Theorem 1106</strong> (<code>the_reflected_orbit_covers_the_whole_triad</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_reflected_orbit_covers_the_whole_triad.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>∃</mo><mi>d</mi><mo>∈</mo><mi>orbit6</mi><mo>:</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>t</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[3, 6, 9].all (fun t =&gt; orbit6.any (fun d =&gt; refl d == t))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall t \in [3,\,6,\,9],\; \exists d \in \mathrm{orbit6} : \mathrm{refl}\mathopen{}\left(d\right) = t</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-reflection_splits_the_orbit_in_half">
<p class="thm-label"><strong>Theorem 1107</strong> (<code>reflection_splits_the_orbit_in_half</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_reflection_splits_the_orbit_in_half.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>orbit6</mi><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>orbit6</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(orbit6.filter (fun d =&gt; [3, 6, 9].contains (refl d))).length = 3 ∧ (orbit6.filter (fun d =&gt; ! [3, 6, 9].contains (refl d))).length = 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, d \in \mathrm{orbit6} \mid \mathrm{refl}\mathopen{}\left(d\right) \in [3,\,6,\,9] \,\}\right| = 3 \land \left|\{\, d \in \mathrm{orbit6} \mid \lnot \mathrm{refl}\mathopen{}\left(d\right) \in [3,\,6,\,9] \,\}\right| = 3</code></pre></details>
</div>
<p class="thm-remark">── and the split is exact: three of the six reflect onto the triad, three stay among the units ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_crossing_pairs_are_one_four_seven">
<p class="thm-label"><strong>Theorem 1108</strong> (<code>the_crossing_pairs_are_one_four_seven</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_crossing_pairs_are_one_four_seven.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>orbit6</mi><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(orbit6.filter (fun d =&gt; [3, 6, 9].contains (refl d))) = [1, 4, 7] ∧ refl 1 = 9 ∧ refl 4 = 6 ∧ refl 7 = 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \mathrm{orbit6} \mid \mathrm{refl}\mathopen{}\left(d\right) \in [3,\,6,\,9] \,\} = [1,\,4,\,7] \land \mathrm{refl}\mathopen{}\left(1\right) = 9 \land \mathrm{refl}\mathopen{}\left(4\right) = 6 \land \mathrm{refl}\mathopen{}\left(7\right) = 3</code></pre></details>
</div>
<p class="thm-remark">── the three that cross, named exactly ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-reflection_is_injective_on_the_orbit">
<p class="thm-label"><strong>Theorem 1109</strong> (<code>reflection_is_injective_on_the_orbit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_reflection_is_injective_on_the_orbit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>refl</mi><mo>[</mo><mi>orbit6</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></math></div>
<pre class="thm-statement"><code>((orbit6.map refl).eraseDups).length = 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{refl}[\mathrm{orbit6}]\right)\right| = 6</code></pre></details>
</div>
<p class="thm-remark">── reflection is injective on the orbit, so the mirror image is six distinct residues, not a collapse ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-doubling_alone_reaches_only_the_units">
<p class="thm-label"><strong>Theorem 1110</strong> (<code>doubling_alone_reaches_only_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_doubling_alone_reaches_only_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mrow><mi>pw</mi><mo>(</mo><mn>2</mn><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 12).map (fun k =&gt; pw 2 k)).eraseDups.length = 6 ∧ ((List.range 12).map (fun k =&gt; pw 2 k)).all (fun d =&gt; ! [0, 3, 6].contains d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, \mathrm{pw}\mathopen{}\left(2,\,k\right) \mid k \in \{0,\dots,11\} \,\}\right)\right| = 6 \land \forall d \in \{\, \mathrm{pw}\mathopen{}\left(2,\,k\right) \mid k \in \{0,\dots,11\} \,\},\; \lnot d \in [0,\,3,\,6]</code></pre></details>
</div>
<p class="thm-remark">── DOUBLING ALONE is not enough: it reaches exactly the six units, never the triad, never zero ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 432 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-reflection_alone_reaches_only_two">
<p class="thm-label"><strong>Theorem 1111</strong> (<code>reflection_alone_reaches_only_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_reflection_alone_reaches_only_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>6</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>≥</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mi>rfl9</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>rfl9</mi><mo>(</mo><mrow><mi>rfl9</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(closure 6 [1]).length ≥ 2 ∧ rfl9 1 = 0 ∧ rfl9 (rfl9 1) = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{closure}\mathopen{}\left(6,\,[1]\right)\right| \ge 2 \land \mathrm{rfl9}\mathopen{}\left(1\right) = 0 \land \mathrm{rfl9}\mathopen{}\left(\mathrm{rfl9}\mathopen{}\left(1\right)\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── REFLECTION ALONE is not enough either: from 1 it only ever sees two residues ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-doubling_and_reflection_together_reach_every_residue">
<p class="thm-label"><strong>Theorem 1112</strong> (<code>doubling_and_reflection_together_reach_every_residue</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_doubling_and_reflection_together_reach_every_residue.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>4</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></math></div>
<pre class="thm-statement"><code>(closure 4 [1]).length = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{closure}\mathopen{}\left(4,\,[1]\right)\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── TOGETHER they reach the whole ring: every residue of ℤ/9, from the single seed 1 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-every_residue_is_reachable_from_one">
<p class="thm-label"><strong>Theorem 1113</strong> (<code>every_residue_is_reachable_from_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_every_residue_is_reachable_from_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>closure</mi><mo>(</mo><mn>4</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun d =&gt; (closure 4 [1]).contains d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,8\},\; d \in \mathrm{closure}\mathopen{}\left(4,\,[1]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_diameter_is_exactly_four">
<p class="thm-label"><strong>Theorem 1114</strong> (<code>the_diameter_is_exactly_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_diameter_is_exactly_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>4</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>3</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(closure 4 [1]).length = 9 ∧ (closure 3 [1]).length = 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{closure}\mathopen{}\left(4,\,[1]\right)\right| = 9 \land \left|\mathrm{closure}\mathopen{}\left(3,\,[1]\right)\right| = 7</code></pre></details>
</div>
<p class="thm-remark">── the diameter is EXACTLY four: four rounds reach every residue, three do not. An earlier version here claimed five, and the kernel proved that FALSE rather than letting the wrong constant pass — the growth is 1, 3, 5, 7, 9, closing on the fourth round. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_frontier_grows_by_two_each_round">
<p class="thm-label"><strong>Theorem 1115</strong> (<code>the_frontier_grows_by_two_each_round</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_frontier_grows_by_two_each_round.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>0</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>1</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>2</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>3</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>closure</mi><mo>(</mo><mn>4</mn><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(closure 0 [1]).length = 1 ∧ (closure 1 [1]).length = 3 ∧ (closure 2 [1]).length = 5 ∧ (closure 3 [1]).length = 7 ∧ (closure 4 [1]).length = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{closure}\mathopen{}\left(0,\,[1]\right)\right| = 1 \land \left|\mathrm{closure}\mathopen{}\left(1,\,[1]\right)\right| = 3 \land \left|\mathrm{closure}\mathopen{}\left(2,\,[1]\right)\right| = 5 \land \left|\mathrm{closure}\mathopen{}\left(3,\,[1]\right)\right| = 7 \land \left|\mathrm{closure}\mathopen{}\left(4,\,[1]\right)\right| = 9</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-product_of_the_units_is_minus_one">
<p class="thm-label"><strong>Theorem 1116</strong> (<code>product_of_the_units_is_minus_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_product_of_the_units_is_minus_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>fold</mi><mo>(</mo><mrow><mo>(</mo><mo>·</mo><mo>⋅</mo><mo>·</mo><mo>)</mo></mrow><mo>,</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>8</mn></mrow><mo>∧</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mn>8</mn><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>m9 ([1,2,4,5,7,8].foldl (· * ·) 1) = 8 ∧ m9 (8 + 1) = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{m9}\mathopen{}\left(\operatorname{fold}_{(\cdot\,\cdot\,\cdot)}\left([1,\,2,\,4,\,5,\,7,\,8],\, 1\right)\right) = 8 \land \mathrm{m9}\mathopen{}\left(8 + 1\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── THE WILSON ANALOGUE in ℤ/9: the product of the units is 8 ≡ −1, exactly as (p−1)! ≡ −1 for a prime. Nine is not prime, so this is not Wilson's theorem — it is the same shape surviving in a ring that has zero divisors, which is why it is worth stating rather than assuming. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-pisano_period_mod_nine_is_twenty_four">
<p class="thm-label"><strong>Theorem 1117</strong> (<code>pisano_period_mod_nine_is_twenty_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_pisano_period_mod_nine_is_twenty_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>fib9</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>fib9</mi><mo>(</mo><mrow><mi>k</mi><mo>+</mo><mn>24</mn></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun k =&gt; fib9 k == fib9 (k + 24))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,29\},\; \mathrm{fib9}\mathopen{}\left(k\right) = \mathrm{fib9}\mathopen{}\left(k + 24\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 30 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-no_proper_divisor_of_twenty_four_is_a_period">
<p class="thm-label"><strong>Theorem 1118</strong> (<code>no_proper_divisor_of_twenty_four_is_a_period</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_no_proper_divisor_of_twenty_four_is_a_period.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∃</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>12</mn><mo>]</mo></mrow><mo>:</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>25</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>fib9</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>fib9</mi><mo>(</mo><mrow><mi>k</mi><mo>+</mo><mi>p</mi></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ([1, 2, 3, 4, 6, 8, 12].any (fun p =&gt; (List.range 26).all (fun k =&gt; fib9 k == fib9 (k + p))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \exists p \in [1,\,2,\,3,\,4,\,6,\,8,\,12] : \forall k \in \{0,\dots,25\},\; \mathrm{fib9}\mathopen{}\left(k\right) = \mathrm{fib9}\mathopen{}\left(k + p\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 182 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-fibonacci_recurrence_holds">
<p class="thm-label"><strong>Theorem 1119</strong> (<code>fibonacci_recurrence_holds</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_fibonacci_recurrence_holds.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 20).all (fun n =&gt; fib (n + 2) == fib n + fib (n + 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,19\},\; \mathrm{fib}\mathopen{}\left(n + 2\right) = \mathrm{fib}\mathopen{}\left(n\right) + \mathrm{fib}\mathopen{}\left(n + 1\right)</code></pre></details>
</div>
<p class="thm-remark">── the Fibonacci recurrence itself, over a stated range ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-consecutive_fibonacci_are_coprime">
<p class="thm-label"><strong>Theorem 1120</strong> (<code>consecutive_fibonacci_are_coprime</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_consecutive_fibonacci_are_coprime.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>25</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>gcd9</mi><mo>(</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 25).all (fun n =&gt; gcd9 (fib n) (fib (n + 1)) == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,25\},\; \mathrm{gcd9}\mathopen{}\left(\mathrm{fib}\mathopen{}\left(n\right),\,\mathrm{fib}\mathopen{}\left(n + 1\right)\right) = 1</code></pre></details>
</div>
<p class="thm-remark">Widened from 15 to 25. The ledger claims this "verified n ≤ 20", so a theorem stopping at 15 was narrower than the claim and could not carry it — a theorem must cover what it is asked to stand for.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 25 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-three_five_eight_are_consecutive_fibonacci">
<p class="thm-label"><strong>Theorem 1121</strong> (<code>three_five_eight_are_consecutive_fibonacci</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_three_five_eight_are_consecutive_fibonacci.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>+</mo><mrow><mi>fib</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mi>fib</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>fib 4 = 3 ∧ fib 5 = 5 ∧ fib 6 = 8 ∧ fib 4 + fib 5 = fib 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fib}\mathopen{}\left(4\right) = 3 \land \mathrm{fib}\mathopen{}\left(5\right) = 5 \land \mathrm{fib}\mathopen{}\left(6\right) = 8 \land \mathrm{fib}\mathopen{}\left(4\right) + \mathrm{fib}\mathopen{}\left(5\right) = \mathrm{fib}\mathopen{}\left(6\right)</code></pre></details>
</div>
<p class="thm-remark">── and the sum of two consecutive Fibonacci digits lands back in the sequence: 3 + 5 = 8 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-units_and_triad_partition_the_ring">
<p class="thm-label"><strong>Theorem 1122</strong> (<code>units_and_triad_partition_the_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_units_and_triad_partition_the_ring.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>e</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>e</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mo>¬</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>e</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>e</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>)</mo></mrow></mrow></mrow><mo>)</mo></mrow><mo>|</mo></mrow></mrow><mo>=</mo><mn>9</mn></mrow></math></div>
<pre class="thm-statement"><code>((R.filter (fun d =&gt; R.any (fun e =&gt; m9 (d * e) == 1))).length + (R.filter (fun d =&gt; ! R.any (fun e =&gt; m9 (d * e) == 1))).length) = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{R.filter}\mathopen{}\left(d \mapsto \mathrm{R.any}\mathopen{}\left(e \mapsto \mathrm{m9}\mathopen{}\left(d \cdot e\right) = 1\right)\right)\right| + \left|\mathrm{R.filter}\mathopen{}\left(d \mapsto \lnot \mathrm{R.any}\mathopen{}\left(e \mapsto \mathrm{m9}\mathopen{}\left(d \cdot e\right) = 1\right)\right)\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── SUMS: the units sum to zero; the triad sums to zero; together they exhaust ℤ/9 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-both_parts_sum_to_zero">
<p class="thm-label"><strong>Theorem 1123</strong> (<code>both_parts_sum_to_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_both_parts_sum_to_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mo>∑</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>e</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>e</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mo>∑</mo><mrow><mi>R.filter</mi><mo>(</mo><mrow><mi>d</mi><mo>↦</mo><mrow><mo>¬</mo><mrow><mi>R.any</mi><mo>(</mo><mrow><mi>e</mi><mo>↦</mo><mrow><mrow><mi>m9</mi><mo>(</mo><mrow><mi>d</mi><mo>⋅</mo><mi>e</mi></mrow><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>)</mo></mrow></mrow></mrow><mo>)</mo></mrow></mrow><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>m9 ((R.filter (fun d =&gt; R.any (fun e =&gt; m9 (d * e) == 1))).foldl (· + ·) 0) == 0 ∧ m9 ((R.filter (fun d =&gt; ! R.any (fun e =&gt; m9 (d * e) == 1))).foldl (· + ·) 0) == 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{m9}\mathopen{}\left(\sum \mathrm{R.filter}\mathopen{}\left(d \mapsto \mathrm{R.any}\mathopen{}\left(e \mapsto \mathrm{m9}\mathopen{}\left(d \cdot e\right) = 1\right)\right)\right) = 0 \land \mathrm{m9}\mathopen{}\left(\sum \mathrm{R.filter}\mathopen{}\left(d \mapsto \lnot \mathrm{R.any}\mathopen{}\left(e \mapsto \mathrm{m9}\mathopen{}\left(d \cdot e\right) = 1\right)\right)\right) = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-doubling_has_period_six_for_every_k">
<p class="thm-label"><strong>Theorem 1124</strong> (<code>doubling_has_period_six_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_doubling_has_period_six_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, pw 2 (k + 6) = pw 2 k</code></pre>
</div>
<p class="thm-remark">── the capped rows above, proved for every value — no bound ───────────────────────────────────────────────── doubling_has_period_six (k &lt; 30), orbit_digital_roots_have_period_six (k &lt; 24), the_orbit_never_meets_the_triad (k &lt; 40), pisano_period_mod_nine_is_twenty_four (k &lt; 30), consecutive_fibonacci_are_coprime (n ≤ 25) and digital_root_agrees_with_the_residue (n ≤ 300) were checked up to a bound; these prove them for every value. 2⁶ ≡ 1 mod 9 turns the orbit; the pair (fib k, fib (k+1)) mod 9 returns after 24 steps; gcd9 is Euclid with fuel a + b + 1, which always exceeds what Euclid needs, so it is the gcd.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-orbit_digital_roots_have_period_six_for_every_k">
<p class="thm-label"><strong>Theorem 1125</strong> (<code>orbit_digital_roots_have_period_six_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_orbit_digital_roots_have_period_six_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, dr (pw 2 (k + 6)) = dr (pw 2 k)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_doubling_orbit_is_read_from_the_exponent_mod_six">
<p class="thm-label"><strong>Theorem 1126</strong> (<code>the_doubling_orbit_is_read_from_the_exponent_mod_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_doubling_orbit_is_read_from_the_exponent_mod_six.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, pw 2 k = pw 2 (k % 6)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_orbit_never_meets_the_triad_for_every_k">
<p class="thm-label"><strong>Theorem 1127</strong> (<code>the_orbit_never_meets_the_triad_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_orbit_never_meets_the_triad_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, pw 2 k ≠ 0 ∧ pw 2 k ≠ 3 ∧ pw 2 k ≠ 6</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-fibonacci_residues_mod_nine_repeat_every_twenty_four_steps">
<p class="thm-label"><strong>Theorem 1128</strong> (<code>fibonacci_residues_mod_nine_repeat_every_twenty_four_steps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_fibonacci_residues_mod_nine_repeat_every_twenty_four_steps.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, fib (k + 24) % 9 = fib k % 9 ∧ fib (k + 25) % 9 = fib (k + 1) % 9</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-pisano_period_mod_nine_is_twenty_four_for_every_k">
<p class="thm-label"><strong>Theorem 1129</strong> (<code>pisano_period_mod_nine_is_twenty_four_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_pisano_period_mod_nine_is_twenty_four_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, fib9 (k + 24) = fib9 k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_fuelled_gcd_is_the_gcd_when_the_fuel_exceeds_the_second_argument">
<p class="thm-label"><strong>Theorem 1130</strong> (<code>the_fuelled_gcd_is_the_gcd_when_the_fuel_exceeds_the_second_argument</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_fuelled_gcd_is_the_gcd_when_the_fuel_exceeds_the_second_argument.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f a b : Nat, b &lt; f → gcdF f a b = Nat.gcd a b</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-consecutive_fibonacci_numbers_are_coprime">
<p class="thm-label"><strong>Theorem 1131</strong> (<code>consecutive_fibonacci_numbers_are_coprime</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_consecutive_fibonacci_numbers_are_coprime.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, Nat.gcd (fib n) (fib (n + 1)) = 1</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-consecutive_fibonacci_are_coprime_for_every_n">
<p class="thm-label"><strong>Theorem 1132</strong> (<code>consecutive_fibonacci_are_coprime_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_consecutive_fibonacci_are_coprime_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, gcd9 (fib n) (fib (n + 1)) = 1</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-digital_root_agrees_with_the_residue_for_every_n">
<p class="thm-label"><strong>Theorem 1133</strong> (<code>digital_root_agrees_with_the_residue_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_digital_root_agrees_with_the_residue_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 0 &lt; n → (dr n = 9 ↔ m9 n = 0)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-digital_root_is_the_digit_sum_residue_for_every_n">
<p class="thm-label"><strong>Theorem 1134</strong> (<code>digital_root_is_the_digit_sum_residue_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_digital_root_is_the_digit_sum_residue_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, m9 (digitSum n) = m9 n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-halving_undoes_doubling_at_every_step">
<p class="thm-label"><strong>Theorem 1135</strong> (<code>halving_undoes_doubling_at_every_step</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_halving_undoes_doubling_at_every_step.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, m9 (pw 2 k * pw 5 k) = 1</code></pre>
</div>
<p class="thm-remark">── reflections, from the orbit batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── REFLECTION: halving (×5, the inverse of ×2 mod 9) undoes doubling at every step</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-halving_has_period_six_for_every_k">
<p class="thm-label"><strong>Theorem 1136</strong> (<code>halving_has_period_six_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_halving_has_period_six_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, pw 5 (k + 6) = pw 5 k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-halving_orbit_digital_roots_have_period_six_for_every_k">
<p class="thm-label"><strong>Theorem 1137</strong> (<code>halving_orbit_digital_roots_have_period_six_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_halving_orbit_digital_roots_have_period_six_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, dr (pw 5 (k + 6)) = dr (pw 5 k)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-the_reflected_orbit_meets_the_triad_exactly_at_one_four_seven_for_every_k">
<p class="thm-label"><strong>Theorem 1138</strong> (<code>the_reflected_orbit_meets_the_triad_exactly_at_one_four_seven_for_every_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_the_reflected_orbit_meets_the_triad_exactly_at_one_four_seven_for_every_k.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, [3, 6, 9].contains (refl (pw 2 k)) = [1, 4, 7].contains (pw 2 k)</code></pre>
</div>
<p class="thm-remark">REFLECTION of "the orbit never meets the triad": its mirror meets the triad exactly at 1, 4, 7, at every step</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-z9plus-reversal_cannot_change_the_digital_root_for_every_n">
<p class="thm-label"><strong>Theorem 1139</strong> (<code>reversal_cannot_change_the_digital_root_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_z9plus_reversal_cannot_change_the_digital_root_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, dr (reverseNum n) = dr n</code></pre>
</div>
<p class="thm-remark">── reflections, from the rev batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── reversal_cannot_change_the_digital_root was decided for 1 ≤ n &lt; 300; for every n:</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
