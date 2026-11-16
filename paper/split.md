---
title: "The digit split"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `split.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/split.lean</code> · namespace <code>Split</code> · 22 theorems · wing <code>the ring</code></p>

The ten digits read in order and grouped 0 | 12 | 3 | 45 | 6 | 78 | 9 — and what that grouping is.


Written out, the digits 0..9 split into seven tokens that alternate single, pair, single, pair, single,
pair, single:

    0   12   3   45   6   78   9

The grouping is not a choice. The singles {0,3,6,9} are exactly the NON-UNITS of ℤ/9 together with the
void — the digits with no multiplicative inverse, gcd(d,9) ≠ 1 — and the pairs {12,45,78} are exactly the
units {1,2,4,5,7,8} in consecutive order, each pair sitting between two non-units. The alternation IS the
unit / non-unit alternation of the ring, read off the number line.

And every token, single or pair, is a multiple of three:

    0 = 3·0    3 = 3·1    6 = 3·2    9 = 3·3        the singles, 3·0 through 3·3
    12 = 3·4   45 = 3·15  78 = 3·26                 the pairs

So the split is the ideal 3ℤ, twice over: the singles because they are the non-units, and the pairs
because concatenating each consecutive unit pair lands back inside it. The set is closed under addition,
subtraction and multiplication, and DIVISION IS THE ONE OPERATION THAT LEAVES IT — 12/3 = 4, 45/9 = 5,
6/3 = 2 are all outside. That asymmetry is the content: three of the four operations keep the structure
and the fourth is how you get out of it.

Everything below is decided over the whole set; nothing is asserted about digits in general.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>tokens := [0, 12, 3, 45, 6, 78, 9]
singles := [0, 3, 6, 9]
pairs := [12, 45, 78]
unitsOf9 := [1, 2, 4, 5, 7, 8]
coins := 2
coinStep := 3 * coins
sealBits := 128</code></pre>

<div class="thm" id="thm-split-the_singles_are_exactly_the_non_units">
<p class="thm-label"><strong>Theorem 1038</strong> (<code>the_singles_are_exactly_the_non_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_singles_are_exactly_the_non_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isUnit9</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mi>singles</mi><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 10).filter (fun d =&gt; ! isUnit9 d)) = [0, 3, 6, 9] ∧ singles = [0, 3, 6, 9]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \{0,\dots,9\} \mid \lnot \mathrm{isUnit9}\mathopen{}\left(d\right) \,\} = [0,\,3,\,6,\,9] \land \mathrm{singles} = [0,\,3,\,6,\,9]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 160 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_pairs_are_exactly_the_units_in_order">
<p class="thm-label"><strong>Theorem 1039</strong> (<code>the_pairs_are_exactly_the_units_in_order</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_pairs_are_exactly_the_units_in_order.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit9</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>=</mo><mi>unitsOf9</mi></mrow><mo>∧</mo><mrow><mi>unitsOf9</mi><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 10).filter isUnit9) = unitsOf9 ∧ unitsOf9 = [1, 2, 4, 5, 7, 8]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, x \in \{0,\dots,9\} \mid \mathrm{isUnit9}\mathopen{}\left(x\right) \,\} = \mathrm{unitsOf9} \land \mathrm{unitsOf9} = [1,\,2,\,4,\,5,\,7,\,8]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-each_pair_is_two_consecutive_units">
<p class="thm-label"><strong>Theorem 1040</strong> (<code>each_pair_is_two_consecutive_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_each_pair_is_two_consecutive_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mn>12</mn><mo>=</mo><mrow><mrow><mn>1</mn><mo>⋅</mo><mn>10</mn></mrow><mo>+</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mn>45</mn><mo>=</mo><mrow><mrow><mn>4</mn><mo>⋅</mo><mn>10</mn></mrow><mo>+</mo><mn>5</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>78</mn><mo>=</mo><mrow><mrow><mn>7</mn><mo>⋅</mo><mn>10</mn></mrow><mo>+</mo><mn>8</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>2</mn><mo>=</mo><mrow><mn>1</mn><mo>+</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>5</mn><mo>=</mo><mrow><mn>4</mn><mo>+</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mn>8</mn><mo>=</mo><mrow><mn>7</mn><mo>+</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>12 = 1 * 10 + 2 ∧ 45 = 4 * 10 + 5 ∧ 78 = 7 * 10 + 8 ∧ 2 = 1 + 1 ∧ 5 = 4 + 1 ∧ 8 = 7 + 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>12 = 1 \cdot 10 + 2 \land 45 = 4 \cdot 10 + 5 \land 78 = 7 \cdot 10 + 8 \land 2 = 1 + 1 \land 5 = 4 + 1 \land 8 = 7 + 1</code></pre></details>
</div>
<p class="thm-remark">Each pair is two CONSECUTIVE units, and the concatenation is what the token spells.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-every_token_is_a_multiple_of_three">
<p class="thm-label"><strong>Theorem 1041</strong> (<code>every_token_is_a_multiple_of_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_every_token_is_a_multiple_of_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.all (fun t =&gt; t % 3 == 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall t \in \mathrm{tokens},\; t \bmod 3 = 0</code></pre></details>
</div>
<p class="thm-remark">── EVERY TOKEN IS A MULTIPLE OF THREE ─────────────────────────────────────────────────────────────────── The singles because they are the non-units — 3 ∣ d is the same condition as gcd(d,9) ≠ 1 for a digit — and the pairs because concatenating a consecutive unit pair lands back inside the ideal.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_tokens_are_three_times_these">
<p class="thm-label"><strong>Theorem 1042</strong> (<code>the_tokens_are_three_times_these</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_tokens_are_three_times_these.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mfrac><mi>t</mi><mn>3</mn></mfrac><mo>∣</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>15</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>26</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.map (fun t =&gt; t / 3) = [0, 4, 1, 15, 2, 26, 3]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, \frac{t}{3} \mid t \in \mathrm{tokens} \,\} = [0,\,4,\,1,\,15,\,2,\,26,\,3]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-addition_and_multiplication_stay_inside">
<p class="thm-label"><strong>Theorem 1043</strong> (<code>addition_and_multiplication_stay_inside</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_addition_and_multiplication_stay_inside.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mrow><mrow><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mi>b</mi></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.all (fun a =&gt; tokens.all (fun b =&gt; (a + b) % 3 == 0 &amp;&amp; (a * b) % 3 == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \mathrm{tokens},\; \forall b \in \mathrm{tokens},\; a + b \bmod 3 = 0 \land a \cdot b \bmod 3 = 0</code></pre></details>
</div>
<p class="thm-remark">── CLOSED UNDER THREE OPERATIONS, AND DIVISION IS THE WAY OUT ─────────────────────────────────────────── Addition, subtraction and multiplication keep every result inside the ideal. Subtraction is stated on the ordered pairs only, since Nat truncates.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-subtraction_stays_inside">
<p class="thm-label"><strong>Theorem 1044</strong> (<code>subtraction_stays_inside</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_subtraction_stays_inside.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mrow><mi>a</mi><mo>&lt;</mo><mi>b</mi></mrow><mo>∨</mo><mrow><mrow><mrow><mi>a</mi><mo>-</mo><mi>b</mi></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.all (fun a =&gt; tokens.all (fun b =&gt; a &lt; b || (a - b) % 3 == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \mathrm{tokens},\; \forall b \in \mathrm{tokens},\; a &lt; b \lor a - b \bmod 3 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-division_is_the_operation_that_leaves">
<p class="thm-label"><strong>Theorem 1045</strong> (<code>division_is_the_operation_that_leaves</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_division_is_the_operation_that_leaves.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mfrac><mn>12</mn><mn>3</mn></mfrac><mo>=</mo><mn>4</mn></mrow><mo>∧</mo><mrow><mrow><mn>4</mn><mo>mod</mo><mn>3</mn></mrow><mo>≠</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mn>45</mn><mn>9</mn></mfrac><mo>=</mo><mn>5</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>5</mn><mo>mod</mo><mn>3</mn></mrow><mo>≠</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mn>6</mn><mn>3</mn></mfrac><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>2</mn><mo>mod</mo><mn>3</mn></mrow><mo>≠</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>12 / 3 = 4 ∧ 4 % 3 != 0 ∧ 45 / 9 = 5 ∧ 5 % 3 != 0 ∧ 6 / 3 = 2 ∧ 2 % 3 != 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{12}{3} = 4 \land 4 \bmod 3 \neq 0 \land \frac{45}{9} = 5 \land 5 \bmod 3 \neq 0 \land \frac{6}{3} = 2 \land 2 \bmod 3 \neq 0</code></pre></details>
</div>
<p class="thm-remark">The contrast, without which the closure above could be read as a property of arithmetic rather than of this set: division genuinely escapes, and here are the exact quotients that do it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_roots_are_the_singles">
<p class="thm-label"><strong>Theorem 1046</strong> (<code>the_roots_are_the_singles</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_roots_are_the_singles.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mrow><mi>t</mi><mo>mod</mo><mn>9</mn></mrow><mo>∣</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>0</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.map (fun t =&gt; t % 9) = [0, 3, 3, 0, 6, 6, 0]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, t \bmod 9 \mid t \in \mathrm{tokens} \,\} = [0,\,3,\,3,\,0,\,6,\,6,\,0]</code></pre></details>
</div>
<p class="thm-remark">── THE DIGITAL ROOTS LAND ON THE TRINITY AND THE VOID ─────────────────────────────────────────────────── Reducing each token mod 9 sends it to {0,3,6,9} — the same four digits the singles already are. The grouping is fixed by the reduction it survives.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-every_root_is_a_single">
<p class="thm-label"><strong>Theorem 1047</strong> (<code>every_root_is_a_single</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_every_root_is_a_single.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mrow><mo>(</mo><mrow><mo>(</mo><mn>0</mn><mo>if</mo><mrow><mi>t</mi><mo>=</mo><mn>0</mn></mrow><mo>;</mo><mo>otherwise</mo><mn>9</mn><mo>)</mo></mrow><mo>if</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>;</mo><mo>otherwise</mo><mrow><mi>t</mi><mo>mod</mo><mn>9</mn></mrow><mo>)</mo></mrow><mo>∈</mo><mi>singles</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.all (fun t =&gt; singles.contains (if t % 9 == 0 then (if t == 0 then 0 else 9) else t % 9))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall t \in \mathrm{tokens},\; \begin{cases}\begin{cases}0 &amp; \text{if } t = 0\\ 9 &amp; \text{otherwise}\end{cases} &amp; \text{if } t \bmod 9 = 0\\ t \bmod 9 &amp; \text{otherwise}\end{cases} \in \mathrm{singles}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_coin_step_and_the_coins_are_inverse">
<p class="thm-label"><strong>Theorem 1048</strong> (<code>the_coin_step_and_the_coins_are_inverse</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_coin_step_and_the_coins_are_inverse.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mfrac><mrow><mn>3</mn><mo>⋅</mo><mi>c</mi></mrow><mn>3</mn></mfrac><mo>=</mo><mi>c</mi></mrow><mo>∧</mo><mrow><mrow><mrow><mn>3</mn><mo>⋅</mo><mi>c</mi></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mi>coinStep</mi><mo>=</mo><mrow><mn>3</mn><mo>⋅</mo><mi>coins</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>coinStep</mi><mn>3</mn></mfrac><mo>=</mo><mi>coins</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 20).all (fun c =&gt; 3 * c / 3 == c &amp;&amp; (3 * c) % 3 == 0)) ∧ coinStep = 3 * coins ∧ coinStep / 3 = coins</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,19\},\; \frac{3 \cdot c}{3} = c \land 3 \cdot c \bmod 3 = 0 \land \mathrm{coinStep} = 3 \cdot \mathrm{coins} \land \frac{\mathrm{coinStep}}{3} = \mathrm{coins}</code></pre></details>
</div>
<p class="thm-remark">The coin step and the coins are INVERSE: tripling and dividing by three undo each other at every count below twenty, and the step is the instance at the two coins — derived by the law, not typed beside it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-paying_and_refunding_coins_on_the_last_pair_round_trips">
<p class="thm-label"><strong>Theorem 1049</strong> (<code>paying_and_refunding_coins_on_the_last_pair_round_trips</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_paying_and_refunding_coins_on_the_last_pair_round_trips.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>26</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mn>3</mn><mo>⋅</mo><mrow><mn>26</mn><mo>-</mo><mi>k</mi></mrow></mrow><mo>+</mo><mrow><mn>3</mn><mo>⋅</mo><mi>k</mi></mrow></mrow><mo>=</mo><mn>78</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><mrow><mn>26</mn><mo>-</mo><mi>coins</mi></mrow></mrow><mo>=</mo><mn>72</mn></mrow></mrow><mo>∧</mo><mrow><mn>72</mn><mo>=</mo><mrow><mn>8</mn><mo>⋅</mo><mn>9</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 27).all (fun k =&gt; 3 * (26 - k) + 3 * k == 78)) ∧ 3 * (26 - coins) = 72 ∧ 72 = 8 * 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,26\},\; 3 \cdot 26 - k + 3 \cdot k = 78 \land 3 \cdot 26 - \mathrm{coins} = 72 \land 72 = 8 \cdot 9</code></pre></details>
</div>
<p class="thm-remark">Paying and refunding round-trip on the last pair: whatever k of its 26 coins are paid, the paid part and the rest recombine to 78 = 3 · 26; the two coins are the instance, leaving 72 = 8 · 9.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 27 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_exhaustible_tokens_are_those_six_divides">
<p class="thm-label"><strong>Theorem 1050</strong> (<code>the_exhaustible_tokens_are_those_six_divides</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_exhaustible_tokens_are_those_six_divides.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>∣</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>12</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>78</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(tokens.filter (fun t =&gt; t % coinStep == 0)) = [0, 12, 6, 78]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, t \in \mathrm{tokens} \mid t \bmod \mathrm{coinStep} = 0 \,\} = [0,\,12,\,6,\,78]</code></pre></details>
</div>
<p class="thm-remark">The two classes, named rather than counted.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_rest_halt_on_the_generator">
<p class="thm-label"><strong>Theorem 1051</strong> (<code>the_rest_halt_on_the_generator</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_rest_halt_on_the_generator.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>∣</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>≠</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>45</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>∣</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>≠</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>=</mo><mn>3</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(tokens.filter (fun t =&gt; t % coinStep != 0)) = [3, 45, 9] ∧ (tokens.filter (fun t =&gt; t % coinStep != 0)).all (fun t =&gt; t % coinStep == 3)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, t \in \mathrm{tokens} \mid t \bmod \mathrm{coinStep} \neq 0 \,\} = [3,\,45,\,9] \land \forall t \in \{\, t \in \mathrm{tokens} \mid t \bmod \mathrm{coinStep} \neq 0 \,\},\; t \bmod \mathrm{coinStep} = 3</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-every_token_is_void_bound_or_halts_on_three">
<p class="thm-label"><strong>Theorem 1052</strong> (<code>every_token_is_void_bound_or_halts_on_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_every_token_is_void_bound_or_halts_on_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>=</mo><mn>0</mn></mrow><mo>∨</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>=</mo><mn>3</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tokens.all (fun t =&gt; t % coinStep == 0 || t % coinStep == 3)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall t \in \mathrm{tokens},\; t \bmod \mathrm{coinStep} = 0 \lor t \bmod \mathrm{coinStep} = 3</code></pre></details>
</div>
<p class="thm-remark">Every token falls in one class or the other: there is no third remainder, which is what makes the partition a partition and not a pair of examples.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-inside_this_ideal_the_bare_coin_sorts_as_the_scaled_one">
<p class="thm-label"><strong>Theorem 1053</strong> (<code>inside_this_ideal_the_bare_coin_sorts_as_the_scaled_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_inside_this_ideal_the_bare_coin_sorts_as_the_scaled_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>∣</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>{</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>∣</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mi>tokens</mi><mo>,</mo><mrow><mrow><mrow><mi>t</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mrow><mi>t</mi><mo>mod</mo><mi>coinStep</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(tokens.filter (fun t =&gt; t % 2 == 0)) = (tokens.filter (fun t =&gt; t % coinStep == 0)) ∧ tokens.all (fun t =&gt; (t % 2 == 0) == (t % coinStep == 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, t \in \mathrm{tokens} \mid t \bmod 2 = 0 \,\} = \{\, t \in \mathrm{tokens} \mid t \bmod \mathrm{coinStep} = 0 \,\} \land \forall t \in \mathrm{tokens},\; t \bmod 2 = 0 = t \bmod \mathrm{coinStep} = 0</code></pre></details>
</div>
<p class="thm-remark">I tried to write the opposite of this and the kernel refused it. The claim was that a bare step of 2 sorts the seven differently from the coin step of 3·2 — that the scaling into the ideal is what does the work. It is FALSE, and the reason is the better fact: every token is already a multiple of three, so 2 ∣ t and 6 ∣ t are the SAME condition here. The coin does not need to be scaled to sort them; the ideal has already done that half of the work.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-a_seal_divides_into_payments_and_multiplies_back">
<p class="thm-label"><strong>Theorem 1054</strong> (<code>a_seal_divides_into_payments_and_multiplies_back</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_a_seal_divides_into_payments_and_multiplies_back.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>16</mn><mo>,</mo><mn>32</mn><mo>,</mo><mn>64</mn><mo>,</mo><mn>128</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mrow><mfrac><mi>sealBits</mi><mi>c</mi></mfrac><mo>⋅</mo><mi>c</mi></mrow><mo>=</mo><mi>sealBits</mi></mrow><mo>∧</mo><mrow><mfrac><mi>sealBits</mi><mfrac><mi>sealBits</mi><mi>c</mi></mfrac></mfrac><mo>=</mo><mi>c</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mfrac><mi>sealBits</mi><mi>coins</mi></mfrac><mo>=</mo><msup><mn>2</mn><mn>6</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>([1, 2, 4, 8, 16, 32, 64, 128].all (fun c =&gt; (sealBits / c) * c == sealBits &amp;&amp; sealBits / (sealBits / c) == c)) ∧ sealBits / coins = 2 ^ 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in [1,\,2,\,4,\,8,\,16,\,32,\,64,\,128],\; \frac{\mathrm{sealBits}}{c} \cdot c = \mathrm{sealBits} \land \frac{\mathrm{sealBits}}{\frac{\mathrm{sealBits}}{c}} = c \land \frac{\mathrm{sealBits}}{\mathrm{coins}} = 2^{6}</code></pre></details>
</div>
<p class="thm-remark">A seal divides into payments and multiplies back: for every power of two up to the seal, splitting the seal into that many parts and recombining them returns it; the two coins are the instance, 64 = 2 ^ 6 payments.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-sixty_four_is_where_the_doubling_returns">
<p class="thm-label"><strong>Theorem 1055</strong> (<code>sixty_four_is_where_the_doubling_returns</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_sixty_four_is_where_the_doubling_returns.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><msup><mn>2</mn><mn>6</mn></msup><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mrow><msup><mn>2</mn><mi>k</mi></msup><mo>mod</mo><mn>9</mn></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><msup><mn>2</mn><mi>k</mi></msup><mo>mod</mo><mn>9</mn></mrow><mo>≠</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(2 ^ 6) % 9 = 1 ∧ ((List.range 6).map (fun k =&gt; (2 ^ k) % 9)) = [1, 2, 4, 8, 7, 5] ∧ ((List.range' 1 5).all (fun k =&gt; (2 ^ k) % 9 != 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2^{6} \bmod 9 = 1 \land \{\, 2^{k} \bmod 9 \mid k \in \{0,\dots,5\} \,\} = [1,\,2,\,4,\,8,\,7,\,5] \land \forall k \in \{1,\dots,5\},\; 2^{k} \bmod 9 \neq 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 180 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_orbit_turns_once_per_budget">
<p class="thm-label"><strong>Theorem 1056</strong> (<code>the_orbit_turns_once_per_budget</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_orbit_turns_once_per_budget.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>59</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><msup><mn>2</mn><mrow><mi>n</mi><mo>+</mo><mn>6</mn></mrow></msup><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><msup><mn>2</mn><mi>n</mi></msup><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mn>6</mn></msup><mo>=</mo><mfrac><mi>sealBits</mi><mi>coins</mi></mfrac></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 60).all (fun n =&gt; 2 ^ (n + 6) % 9 == 2 ^ n % 9)) ∧ 2 ^ 6 = sealBits / coins</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,59\},\; 2^{n + 6} \bmod 9 = 2^{n} \bmod 9 \land 2^{6} = \frac{\mathrm{sealBits}}{\mathrm{coins}}</code></pre></details>
</div>
<p class="thm-remark">The two readings meet: the budget a seal affords and the period of the orbit are the same six. The orbit turns once per budget: doubling returns to the same residue after six steps at every one of the first sixty, and the budget a seal affords is two to that six.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 60 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_coin_step_and_the_coins_are_inverse_for_every_c">
<p class="thm-label"><strong>Theorem 1057</strong> (<code>the_coin_step_and_the_coins_are_inverse_for_every_c</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_coin_step_and_the_coins_are_inverse_for_every_c.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ c : Nat, 3 * c / 3 = c ∧ (3 * c) % 3 = 0</code></pre>
</div>
<p class="thm-remark">── the capped row above, proved for every value — no bound ─────────────────────────────────────────────────── the_coin_step_and_the_coins_are_inverse checked c &lt; 20; this proves tripling and dividing by three undo each other for every c.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-the_coins_return_from_the_coin_step_for_every_multiple_of_three">
<p class="thm-label"><strong>Theorem 1058</strong> (<code>the_coins_return_from_the_coin_step_for_every_multiple_of_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_the_coins_return_from_the_coin_step_for_every_multiple_of_three.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ t : Nat, t % 3 = 0 → 3 * (t / 3) = t</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-split-paying_and_refunding_round_trips_for_every_count">
<p class="thm-label"><strong>Theorem 1059</strong> (<code>paying_and_refunding_round_trips_for_every_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_split_paying_and_refunding_round_trips_for_every_count.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n k : Nat, k ≤ n → 3 * (n - k) + 3 * k = 3 * n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
