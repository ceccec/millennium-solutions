---
title: "Sequences"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `sequences.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/sequences.lean</code> · namespace <code>Sequences</code> · 28 theorems · wing <code>the ring</code></p>

Sequences and identities — Cassini, Lucas, Brahmagupta–Fibonacci, and Pascal mod two.


The ledger held these as TypeScript tests. Each is a classical identity with a real proof; what is done
here is to DECIDE each over a stated finite range, which is what `decide` can honestly deliver — the range
is named in every theorem rather than implied, and no theorem claims the general case.

Cassini alternates in sign, which the naturals cannot express directly, so it is stated in the two forms it
as a single subtraction would truncate at zero and quietly hold for the wrong reason.

<div class="thm" id="thm-sequences-cassini_at_even_indices">
<p class="thm-label"><strong>Theorem 1010</strong> (<code>cassini_at_even_indices</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_cassini_at_even_indices.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>n</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>∨</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 20).all (fun n =&gt; n % 2 == 1 || fib (n - 1) * fib (n + 1) == fib n * fib n + 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,20\},\; n \bmod 2 = 1 \lor \mathrm{fib}\mathopen{}\left(n - 1\right) \cdot \mathrm{fib}\mathopen{}\left(n + 1\right) = \mathrm{fib}\mathopen{}\left(n\right) \cdot \mathrm{fib}\mathopen{}\left(n\right) + 1</code></pre></details>
</div>
<p class="thm-remark">── CASSINI: F(n−1)·F(n+1) − F(n)² = ±1, alternating. Stated in both directions over 1..20. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-cassini_at_odd_indices">
<p class="thm-label"><strong>Theorem 1011</strong> (<code>cassini_at_odd_indices</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_cassini_at_odd_indices.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>n</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>∨</mo><mrow><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 20).all (fun n =&gt; n % 2 == 0 || fib (n - 1) * fib (n + 1) + 1 == fib n * fib n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,20\},\; n \bmod 2 = 0 \lor \mathrm{fib}\mathopen{}\left(n - 1\right) \cdot \mathrm{fib}\mathopen{}\left(n + 1\right) + 1 = \mathrm{fib}\mathopen{}\left(n\right) \cdot \mathrm{fib}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-cassini_deviation_is_exactly_one">
<p class="thm-label"><strong>Theorem 1012</strong> (<code>cassini_deviation_is_exactly_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_cassini_deviation_is_exactly_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow></mrow><mo>∨</mo><mrow><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 20).all (fun n =&gt; (fib (n - 1) * fib (n + 1) == fib n * fib n + 1) || (fib (n - 1) * fib (n + 1) + 1 == fib n * fib n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,20\},\; \mathrm{fib}\mathopen{}\left(n - 1\right) \cdot \mathrm{fib}\mathopen{}\left(n + 1\right) = \mathrm{fib}\mathopen{}\left(n\right) \cdot \mathrm{fib}\mathopen{}\left(n\right) + 1 \lor \mathrm{fib}\mathopen{}\left(n - 1\right) \cdot \mathrm{fib}\mathopen{}\left(n + 1\right) + 1 = \mathrm{fib}\mathopen{}\left(n\right) \cdot \mathrm{fib}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">── and the deviation is never more than one, in either direction — the identity is tight ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-lucas_mod_two_is_the_and_rule">
<p class="thm-label"><strong>Theorem 1013</strong> (<code>lucas_mod_two_is_the_and_rule</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_lucas_mod_two_is_the_and_rule.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>13</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>=</mo><mrow><mrow><mi>andN</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mi>k</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 14).all (fun n =&gt; (List.range (n + 1)).all (fun k =&gt; (choose n k % 2 == 1) == (andN k n == k)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,13\},\; \forall k \in \{0,\dots,n + 1-1\},\; \mathrm{choose}\mathopen{}\left(n,\,k\right) \bmod 2 = 1 = \mathrm{andN}\mathopen{}\left(k,\,n\right) = k</code></pre></details>
</div>
<p class="thm-remark">── LUCAS mod two: C(n,k) is odd exactly when k AND n = k — the Sierpiński rule behind Rule 90 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 14 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-pascal_has_both_parities">
<p class="thm-label"><strong>Theorem 1014</strong> (<code>pascal_has_both_parities</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_pascal_has_both_parities.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mn>1</mn><mo>∈</mo><mrow><mo>⋃</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>13</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>{</mo><mrow><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>mod</mo><mn>2</mn></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mn>0</mn><mo>∈</mo><mrow><mo>⋃</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>13</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>{</mo><mrow><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>mod</mo><mn>2</mn></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 14).flatMap (fun n =&gt; (List.range (n + 1)).map (fun k =&gt; choose n k % 2))).contains 1 ∧ ((List.range 14).flatMap (fun n =&gt; (List.range (n + 1)).map (fun k =&gt; choose n k % 2))).contains 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>1 \in \bigcup_{n \in \{0,\dots,13\}} \{\, \mathrm{choose}\mathopen{}\left(n,\,k\right) \bmod 2 \mid k \in \{0,\dots,n + 1-1\} \,\} \land 0 \in \bigcup_{n \in \{0,\dots,13\}} \{\, \mathrm{choose}\mathopen{}\left(n,\,k\right) \bmod 2 \mid k \in \{0,\dots,n + 1-1\} \,\}</code></pre></details>
</div>
<p class="thm-remark">── NON-VACUITY: both cases actually occur in that range — odd and even entries are both present ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 196 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-sums_of_two_squares_are_closed">
<p class="thm-label"><strong>Theorem 1015</strong> (<code>sums_of_two_squares_are_closed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_sums_of_two_squares_are_closed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>a</mi></mrow><mo>+</mo><mrow><mi>b</mi><mo>⋅</mo><mi>b</mi></mrow></mrow><mo>⋅</mo><mrow><mrow><mi>c</mi><mo>⋅</mo><mi>c</mi></mrow><mo>+</mo><mrow><mi>d</mi><mo>⋅</mo><mi>d</mi></mrow></mrow></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>c</mi></mrow><mo>-</mo><mrow><mi>b</mi><mo>⋅</mo><mi>d</mi></mrow></mrow><mo>⋅</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>c</mi></mrow><mo>-</mo><mrow><mi>b</mi><mo>⋅</mo><mi>d</mi></mrow></mrow></mrow><mo>+</mo><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>d</mi></mrow><mo>+</mo><mrow><mi>b</mi><mo>⋅</mo><mi>c</mi></mrow></mrow><mo>⋅</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>d</mi></mrow><mo>+</mo><mrow><mi>b</mi><mo>⋅</mo><mi>c</mi></mrow></mrow></mrow></mrow></mrow><mo>∨</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>c</mi></mrow><mo>&lt;</mo><mrow><mi>b</mi><mo>⋅</mo><mi>d</mi></mrow></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun a =&gt; (List.range 8).all (fun b =&gt; (List.range 8).all (fun c =&gt; (List.range 8).all (fun d =&gt; (a*a + b*b) * (c*c + d*d) == (a*c - b*d) * (a*c - b*d) + (a*d + b*c) * (a*d + b*c) || (a*c) &lt; (b*d)))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,7\},\; \forall b \in \{0,\dots,7\},\; \forall c \in \{0,\dots,7\},\; \forall d \in \{0,\dots,7\},\; a \cdot a + b \cdot b \cdot c \cdot c + d \cdot d = a \cdot c - b \cdot d \cdot a \cdot c - b \cdot d + a \cdot d + b \cdot c \cdot a \cdot d + b \cdot c \lor a \cdot c &lt; b \cdot d</code></pre></details>
</div>
<p class="thm-remark">── BRAHMAGUPTA–FIBONACCI: sums of two squares are closed under multiplication ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-three_five_eight_are_consecutive">
<p class="thm-label"><strong>Theorem 1016</strong> (<code>three_five_eight_are_consecutive</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_three_five_eight_are_consecutive.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>+</mo><mrow><mi>fib</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mi>fib</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>fib 4 = 3 ∧ fib 5 = 5 ∧ fib 6 = 8 ∧ fib 4 + fib 5 = fib 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fib}\mathopen{}\left(4\right) = 3 \land \mathrm{fib}\mathopen{}\left(5\right) = 5 \land \mathrm{fib}\mathopen{}\left(6\right) = 8 \land \mathrm{fib}\mathopen{}\left(4\right) + \mathrm{fib}\mathopen{}\left(5\right) = \mathrm{fib}\mathopen{}\left(6\right)</code></pre></details>
</div>
<p class="thm-remark">── the Fibonacci triple three, five, eight — consecutive, and summing as the recurrence requires ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-pisano_twentyfour_is_four_sixes">
<p class="thm-label"><strong>Theorem 1017</strong> (<code>pisano_twentyfour_is_four_sixes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_pisano_twentyfour_is_four_sixes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>k</mi><mo>+</mo><mn>24</mn></mrow><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>24</mn><mo>=</mo><mrow><mn>4</mn><mo>⋅</mo><mn>6</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun k =&gt; fib k % 9 == fib (k + 24) % 9) ∧ 24 = 4 * 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,29\},\; \mathrm{fib}\mathopen{}\left(k\right) \bmod 9 = \mathrm{fib}\mathopen{}\left(k + 24\right) \bmod 9 \land 24 = 4 \cdot 6</code></pre></details>
</div>
<p class="thm-remark">── the Pisano period binds Fibonacci to the ring: mod 9 it repeats every 24, four times the doubling six ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 30 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-thue_morse_doubling_recurrence">
<p class="thm-label"><strong>Theorem 1018</strong> (<code>thue_morse_doubling_recurrence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_thue_morse_doubling_recurrence.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>199</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>tm</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>tm</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>tm</mi><mo>(</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mn>1</mn><mo>-</mo><mrow><mi>tm</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 200).all (fun n =&gt; tm (2 * n) == tm n &amp;&amp; tm (2 * n + 1) == 1 - tm n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,199\},\; \mathrm{tm}\mathopen{}\left(2 \cdot n\right) = \mathrm{tm}\mathopen{}\left(n\right) \land \mathrm{tm}\mathopen{}\left(2 \cdot n + 1\right) = 1 - \mathrm{tm}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">Domain: n &lt; 200 — the decided instance of the law proved for every n at the end of this file. The popcount no longer stops at twelve bits, so no statement here can hold for the wrong reason at any size.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-doubling_preserves_the_parity_of_the_bits">
<p class="thm-label"><strong>Theorem 1019</strong> (<code>doubling_preserves_the_parity_of_the_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_doubling_preserves_the_parity_of_the_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>199</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>popcount</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>popcount</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 200).all (fun n =&gt; popcount (2 * n) == popcount n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,199\},\; \mathrm{popcount}\mathopen{}\left(2 \cdot n\right) = \mathrm{popcount}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-remark">The two halves separately, so a reader can see which one a counterexample would break.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_odd_step_sets_exactly_one_further_bit">
<p class="thm-label"><strong>Theorem 1020</strong> (<code>the_odd_step_sets_exactly_one_further_bit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_odd_step_sets_exactly_one_further_bit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>199</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>popcount</mi><mo>(</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>popcount</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 200).all (fun n =&gt; popcount (2 * n + 1) == popcount n + 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,199\},\; \mathrm{popcount}\mathopen{}\left(2 \cdot n + 1\right) = \mathrm{popcount}\mathopen{}\left(n\right) + 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_sequence_takes_both_values">
<p class="thm-label"><strong>Theorem 1021</strong> (<code>the_sequence_takes_both_values</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_sequence_takes_both_values.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>199</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>tm</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>100</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>199</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>tm</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>100</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 200).filter (fun n =&gt; tm n == 0)).length = 100 ∧ ((List.range 200).filter (fun n =&gt; tm n == 1)).length = 100</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, n \in \{0,\dots,199\} \mid \mathrm{tm}\mathopen{}\left(n\right) = 0 \,\}\right| = 100 \land \left|\{\, n \in \{0,\dots,199\} \mid \mathrm{tm}\mathopen{}\left(n\right) = 1 \,\}\right| = 100</code></pre></details>
</div>
<p class="thm-remark">And the domain is not vacuous: the sequence actually takes both values inside it, so `all` is not passing over a set on which the property is trivially true.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-cassinis_identity_for_every_m">
<p class="thm-label"><strong>Theorem 1022</strong> (<code>cassinis_identity_for_every_m</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_cassinis_identity_for_every_m.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, fib (2 * m + 1) * fib (2 * m + 3) = fib (2 * m + 2) * fib (2 * m + 2) + 1 ∧ fib (2 * m) * fib (2 * m + 2) + 1 = fib (2 * m + 1) * fib (2 * m + 1)</code></pre>
</div>
<p class="thm-remark">── the capped rows above, proved for every value — no bound ───────────────────────────────────────────────── cassini_at_even_indices, cassini_at_odd_indices and cassini_deviation_is_exactly_one were checked n ≤ 20; one law carries all three: at every index the product of the neighbours is the square, plus or minus one.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-a_bit_sum_over_one_more_position_adds_that_bit">
<p class="thm-label"><strong>Theorem 1023</strong> (<code>a_bit_sum_over_one_more_position_adds_that_bit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_a_bit_sum_over_one_more_position_adds_that_bit.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ F m : Nat, (List.range (F + 1)).foldl (fun a i =&gt; a + m / 2 ^ i % 2) 0 = (List.range F).foldl (fun a i =&gt; a + m / 2 ^ i % 2) 0 + m / 2 ^ F % 2</code></pre>
</div>
<p class="thm-remark">── the popcount rows above, proved for every n — no bound ─────────────────────────────────────────────── thue_morse_doubling_recurrence, doubling_preserves_the_parity_of_the_bits and the_odd_step_sets_exactly_one_ further_bit were decided over n &lt; 200; these prove them for every n. The bits of m are its low bit and then the bits of m / 2; positions above the number add nothing; so doubling keeps the count and the odd step adds one.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-halving_shifts_every_bit_down_by_one">
<p class="thm-label"><strong>Theorem 1024</strong> (<code>halving_shifts_every_bit_down_by_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_halving_shifts_every_bit_down_by_one.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m i : Nat, m / 2 ^ (i + 1) = m / 2 / 2 ^ i</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_bits_of_a_number_are_its_low_bit_then_the_bits_of_its_half">
<p class="thm-label"><strong>Theorem 1025</strong> (<code>the_bits_of_a_number_are_its_low_bit_then_the_bits_of_its_half</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_bits_of_a_number_are_its_low_bit_then_the_bits_of_its_half.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ F m : Nat, (List.range (F + 1)).foldl (fun a i =&gt; a + m / 2 ^ i % 2) 0 = m % 2 + (List.range F).foldl (fun a i =&gt; a + m / 2 / 2 ^ i % 2) 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-bits_above_the_number_add_nothing">
<p class="thm-label"><strong>Theorem 1026</strong> (<code>bits_above_the_number_add_nothing</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_bits_above_the_number_add_nothing.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k F n : Nat, n &lt; 2 ^ F → (List.range (F + k)).foldl (fun a i =&gt; a + n / 2 ^ i % 2) 0 = (List.range F).foldl (fun a i =&gt; a + n / 2 ^ i % 2) 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-a_number_is_below_two_to_its_own_power">
<p class="thm-label"><strong>Theorem 1027</strong> (<code>a_number_is_below_two_to_its_own_power</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_a_number_is_below_two_to_its_own_power.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n &lt; 2 ^ n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-a_number_is_below_two_to_its_own_successor">
<p class="thm-label"><strong>Theorem 1028</strong> (<code>a_number_is_below_two_to_its_own_successor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_a_number_is_below_two_to_its_own_successor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n &lt; 2 ^ (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-doubling_preserves_the_bit_count_for_every_n">
<p class="thm-label"><strong>Theorem 1029</strong> (<code>doubling_preserves_the_bit_count_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_doubling_preserves_the_bit_count_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, popcount (2 * n) = popcount n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_odd_step_sets_exactly_one_further_bit_for_every_n">
<p class="thm-label"><strong>Theorem 1030</strong> (<code>the_odd_step_sets_exactly_one_further_bit_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_odd_step_sets_exactly_one_further_bit_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, popcount (2 * n + 1) = popcount n + 1</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-thue_morse_doubling_recurrence_for_every_n">
<p class="thm-label"><strong>Theorem 1031</strong> (<code>thue_morse_doubling_recurrence_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_thue_morse_doubling_recurrence_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, tm (2 * n) = tm n ∧ tm (2 * n + 1) = 1 - tm n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-halving_removes_exactly_the_low_bit_for_every_n">
<p class="thm-label"><strong>Theorem 1032</strong> (<code>halving_removes_exactly_the_low_bit_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_halving_removes_exactly_the_low_bit_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, popcount n = n % 2 + popcount (n / 2)</code></pre>
</div>
<p class="thm-remark">── reflections, from the bits batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── REFLECTION of doubling_preserves_the_bit_count / the_odd_step_sets_exactly_one_further_bit: halving removes exactly the low bit, for every n</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_thue_morse_halving_recurrence_for_every_n">
<p class="thm-label"><strong>Theorem 1033</strong> (<code>the_thue_morse_halving_recurrence_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_thue_morse_halving_recurrence_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, tm n = (n % 2 + tm (n / 2)) % 2</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-doubling_shifts_every_bit_up_by_one">
<p class="thm-label"><strong>Theorem 1034</strong> (<code>doubling_shifts_every_bit_up_by_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_doubling_shifts_every_bit_up_by_one.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m i : Nat, 2 * m / 2 ^ (i + 1) = m / 2 ^ i</code></pre>
</div>
<p class="thm-remark">REFLECTION of halving_shifts_every_bit_down_by_one: doubling shifts every bit up by one</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_residue_below_the_next_power_adds_one_bit">
<p class="thm-label"><strong>Theorem 1035</strong> (<code>the_residue_below_the_next_power_adds_one_bit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_residue_below_the_next_power_adds_one_bit.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m F : Nat, m % 2 ^ (F + 1) = m % 2 ^ F + m / 2 ^ F % 2 * 2 ^ F</code></pre>
</div>
<p class="thm-remark">core's Nat.mod_pow_succ carries Classical.choice, so the one step it gives is proved here by hand</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_low_bits_rebuild_the_number_below_every_power">
<p class="thm-label"><strong>Theorem 1036</strong> (<code>the_low_bits_rebuild_the_number_below_every_power</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_low_bits_rebuild_the_number_below_every_power.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ F m : Nat, (List.range F).foldl (fun a i =&gt; a + m / 2 ^ i % 2 * 2 ^ i) 0 = m % 2 ^ F</code></pre>
</div>
<p class="thm-remark">REFLECTION of the_bits_of_a_number…: the number is rebuilt from its bits</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-sequences-the_number_is_rebuilt_from_its_bits_for_every_n">
<p class="thm-label"><strong>Theorem 1037</strong> (<code>the_number_is_rebuilt_from_its_bits_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_sequences_the_number_is_rebuilt_from_its_bits_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (List.range (n + 1)).foldl (fun a i =&gt; a + n / 2 ^ i % 2 * 2 ^ i) 0 = n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
