---
title: "Families over the ring"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `families.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/families.lean</code> · namespace <code>Families</code> · 63 theorems · wing <code>the ring</code></p>

The families, quantified. Proving at scale.


The ledger holds families of entries produced by a loop: flt_prime_3, flt_prime_5, flt_prime_7 … each a
separate row asserting the same theorem at one more parameter. A row per parameter is not how mathematics
scales; a quantifier is. Each theorem below ranges over the whole family's parameter set, so ONE proof
subsumes every member — and covers parameters the ledger never enumerated.

Every proof is `by decide` over a finite range: no axioms, no Mathlib, no `sorry`. Where a statement is
false outside its stated range, that is stated as a negative rather than omitted. Integrity, not truth.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>primesUpTo30 := [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
schlafli := ((List.range' 3 8).flatMap (fun p =&gt; (List.range' 3 8).map (fun q =&gt; (p, q)))).filter (fun x =&gt; 2 * x.1 + 2 * x.2 &gt; x.1 * x.2)
settledHere := 42</code></pre>

<div class="thm" id="thm-families-flt_all_primes_under_thirty">
<p class="thm-label"><strong>Theorem 795</strong> (<code>flt_all_primes_under_thirty</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_flt_all_primes_under_thirty.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mi>primesUpTo30</mi><mo>,</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mn>1</mn><mo>+</mo><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><msup><mi>a</mi><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow></msup><mo>mod</mo><mi>p</mi></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>primesUpTo30.all (fun p =&gt; (List.range' 1 (p - 1)).all (fun a =&gt; (a ^ (p - 1)) % p == 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{primesUpTo30},\; \forall a \in \{1,\dots,1+p - 1-1\},\; a^{p - 1} \bmod p = 1</code></pre></details>
</div>
<p class="thm-remark">── Fermat's little theorem, over every prime below thirty and every nonzero residue ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-wilson_all_primes_under_thirty">
<p class="thm-label"><strong>Theorem 796</strong> (<code>wilson_all_primes_under_thirty</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_wilson_all_primes_under_thirty.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mi>primesUpTo30</mi><mo>,</mo><mrow><mrow><mrow><mi>fact</mi><mo>(</mo><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>mod</mo><mi>p</mi></mrow><mo>=</mo><mrow><mi>p</mi><mo>-</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>primesUpTo30.all (fun p =&gt; fact (p - 1) % p == p - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{primesUpTo30},\; \mathrm{fact}\mathopen{}\left(p - 1\right) \bmod p = p - 1</code></pre></details>
</div>
<p class="thm-remark">── Wilson's theorem, same range: (p−1)! ≡ p−1 (mod p) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-wilson_fails_at_composites">
<p class="thm-label"><strong>Theorem 797</strong> (<code>wilson_fails_at_composites</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_wilson_fails_at_composites.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>4</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>n</mi><mo>∈</mo><mi>primesUpTo30</mi></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>fact</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>mod</mo><mi>n</mi></mrow><mo>≠</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 4 20).filter (fun n =&gt; ! primesUpTo30.contains n)).all (fun n =&gt; fact (n - 1) % n != n - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{\, n \in \{4,\dots,23\} \mid \lnot n \in \mathrm{primesUpTo30} \,\},\; \mathrm{fact}\mathopen{}\left(n - 1\right) \bmod n \neq n - 1</code></pre></details>
</div>
<p class="thm-remark">── and Wilson FAILS at every composite — the converse, which the family never stated ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 20 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-pascal_rows_sum_to_powers_of_two">
<p class="thm-label"><strong>Theorem 798</strong> (<code>pascal_rows_sum_to_powers_of_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_pascal_rows_sum_to_powers_of_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><msup><mn>2</mn><mi>n</mi></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 12).all (fun n =&gt; ((List.range (n + 1)).map (fun k =&gt; choose n k)).foldl (· + ·) 0 == 2 ^ n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,11\},\; \sum \{\, \mathrm{choose}\mathopen{}\left(n,\,k\right) \mid k \in \{0,\dots,n + 1-1\} \,\} = 2^{n}</code></pre></details>
</div>
<p class="thm-remark">── Pascal: every row sums to a power of two ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 12 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-pascal_alternating_sums_vanish">
<p class="thm-label"><strong>Theorem 799</strong> (<code>pascal_alternating_sums_vanish</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_pascal_alternating_sums_vanish.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mrow><mo>(</mo><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>if</mo><mrow><mrow><mi>k</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>;</mo><mo>otherwise</mo><mn>0</mn><mo>)</mo></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><mrow><mo>∑</mo><mrow><mo>{</mo><mrow><mo>(</mo><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>if</mo><mrow><mrow><mi>k</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>;</mo><mo>otherwise</mo><mn>0</mn><mo>)</mo></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 11).all (fun n =&gt; ((List.range (n + 1)).map (fun k =&gt; if k % 2 == 0 then choose n k else 0)).foldl (· + ·) 0 == ((List.range (n + 1)).map (fun k =&gt; if k % 2 == 1 then choose n k else 0)).foldl (· + ·) 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,11\},\; \sum \{\, \begin{cases}\mathrm{choose}\mathopen{}\left(n,\,k\right) &amp; \text{if } k \bmod 2 = 0\\ 0 &amp; \text{otherwise}\end{cases} \mid k \in \{0,\dots,n + 1-1\} \,\} = \sum \{\, \begin{cases}\mathrm{choose}\mathopen{}\left(n,\,k\right) &amp; \text{if } k \bmod 2 = 1\\ 0 &amp; \text{otherwise}\end{cases} \mid k \in \{0,\dots,n + 1-1\} \,\}</code></pre></details>
</div>
<p class="thm-remark">── Pascal: the alternating sum vanishes on every row but the zeroth ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 11 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-totient_at_prime_powers">
<p class="thm-label"><strong>Theorem 800</strong> (<code>totient_at_prime_powers</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_totient_at_prime_powers.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>totient</mi><mo>(</mo><msup><mi>p</mi><mi>k</mi></msup><mo>)</mo></mrow><mo>=</mo><mrow><msup><mi>p</mi><mi>k</mi></msup><mo>-</mo><msup><mi>p</mi><mrow><mi>k</mi><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[2, 3, 5, 7].all (fun p =&gt; (List.range' 1 3).all (fun k =&gt; totient (p ^ k) == p ^ k - p ^ (k - 1)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in [2,\,3,\,5,\,7],\; \forall k \in \{1,\dots,3\},\; \mathrm{totient}\mathopen{}\left(p^{k}\right) = p^{k} - p^{k - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 12 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-geometric_series_all_bases">
<p class="thm-label"><strong>Theorem 801</strong> (<code>geometric_series_all_bases</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_geometric_series_all_bases.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><msup><mi>b</mi><mi>i</mi></msup><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>4</mn><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>⋅</mo><mrow><mi>b</mi><mo>-</mo><mn>1</mn></mrow></mrow><mo>=</mo><mrow><msup><mi>b</mi><mn>5</mn></msup><mo>-</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 8).all (fun b =&gt; ((List.range 5).map (fun i =&gt; b ^ i)).foldl (· + ·) 0 * (b - 1) == b ^ 5 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{2,\dots,9\},\; \sum \{\, b^{i} \mid i \in \{0,\dots,4\} \,\} \cdot b - 1 = b^{5} - 1</code></pre></details>
</div>
<p class="thm-remark">── the geometric series in every base 2..9, to the fourth power ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-xor_is_parity_up_to_eight_bits">
<p class="thm-label"><strong>Theorem 802</strong> (<code>xor_is_parity_up_to_eight_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_xor_is_parity_up_to_eight_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><msup><mn>2</mn><mi>k</mi></msup><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>popcount</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mrow><mi>fold</mi><mo>(</mo><mrow><mi>acc</mi><mo>,</mo><mi>i</mi><mo>↦</mo><mrow><mrow><mi>acc</mi><mo>+</mo><mrow><mrow><mi>n</mi><mo>≫</mo><mi>i</mi></mrow><mo>mod</mo><mn>2</mn></mrow></mrow><mo>mod</mo><mn>2</mn></mrow></mrow><mo>,</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>k</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 8).all (fun k =&gt; (List.range (2 ^ k)).all (fun n =&gt; popcount n % 2 == (List.range k).foldl (fun acc i =&gt; (acc + ((n &gt;&gt;&gt; i) % 2)) % 2) 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{1,\dots,8\},\; \forall n \in \{0,\dots,2^{k}-1\},\; \mathrm{popcount}\mathopen{}\left(n\right) \bmod 2 = \operatorname{fold}_{\mathrm{acc},\,i \mapsto \mathrm{acc} + n \gg i \bmod 2 \bmod 2}\left(\{0,\dots,k-1\},\, 0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-nat_div_is_a_total_function_returning_zero_at_a_zero_divisor">
<p class="thm-label"><strong>Theorem 803</strong> (<code>nat_div_is_a_total_function_returning_zero_at_a_zero_divisor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_nat_div_is_a_total_function_returning_zero_at_a_zero_divisor.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mfrac><mn>7</mn><mn>0</mn></mfrac><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mfrac><mn>0</mn><mn>0</mn></mfrac><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>7</mn><mo>mod</mo><mn>0</mn></mrow><mo>=</mo><mn>7</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(7 / 0) = 0 ∧ (0 / 0) = 0 ∧ (7 % 0) = 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{7}{0} = 0 \land \frac{0}{0} = 0 \land 7 \bmod 0 = 7</code></pre></details>
</div>
<p class="thm-remark">── THE CONVENTION AT ZERO, stated as a convention and not as arithmetic. Division by zero is UNDEFINED in mathematics: there is no quotient, and nothing below claims otherwise. What is recorded here is a property of Lean's FUNCTION `Nat.div`, which is total — every pair of naturals is mapped somewhere, including a zero divisor, where the definition returns 0. That is a choice made so the function is total and `decide` never faults on a side condition; it is not a claim that dividing by zero yields zero, and an earlier name here ("division_by_zero_is_zero") said exactly that and was wrong. The deposit reads division by zero as a CHANGE OF DOMAIN, which is the same point put positively: the value is not found in the arithmetic, it is supplied by the definition — a different domain entirely. Naming this precisely matters, because a reader who takes `7 / 0 = 0` for arithmetic has been misled by a theorem that is green. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-division_identity_holds_across_the_range">
<p class="thm-label"><strong>Theorem 804</strong> (<code>division_identity_holds_across_the_range</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_division_identity_holds_across_the_range.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>12</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mfrac><mn>12</mn><mi>d</mi></mfrac><mo>⋅</mo><mi>d</mi></mrow><mo>+</mo><mrow><mn>12</mn><mo>mod</mo><mi>d</mi></mrow></mrow><mo>=</mo><mn>12</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 13).all (fun d =&gt; (12 / d) * d + (12 % d) == 12)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,12\},\; \frac{12}{d} \cdot d + 12 \bmod d = 12</code></pre></details>
</div>
<p class="thm-remark">the division identity holds across a range INCLUDING zero — but at zero it is carried entirely by the remainder, because the quotient was supplied by the convention rather than computed</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 13 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-at_a_zero_divisor_the_identity_is_carried_by_the_remainder">
<p class="thm-label"><strong>Theorem 805</strong> (<code>at_a_zero_divisor_the_identity_is_carried_by_the_remainder</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_at_a_zero_divisor_the_identity_is_carried_by_the_remainder.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mfrac><mn>12</mn><mn>0</mn></mfrac><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mn>12</mn><mo>mod</mo><mn>0</mn></mrow><mo>=</mo><mn>12</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mfrac><mn>12</mn><mn>0</mn></mfrac><mo>⋅</mo><mn>0</mn></mrow><mo>+</mo><mrow><mn>12</mn><mo>mod</mo><mn>0</mn></mrow></mrow><mo>=</mo><mn>12</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(12 / 0) = 0 ∧ (12 % 0) = 12 ∧ (12 / 0) * 0 + (12 % 0) == 12</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\frac{12}{0} = 0 \land 12 \bmod 0 = 12 \land \frac{12}{0} \cdot 0 + 12 \bmod 0 = 12</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-primality_is_decided_across_the_range">
<p class="thm-label"><strong>Theorem 806</strong> (<code>primality_is_decided_across_the_range</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_primality_is_decided_across_the_range.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>18</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isPrime</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>m</mi><mo>∈</mo><mi>primesUpTo30</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 17).all (fun m =&gt; isPrime m == primesUpTo30.contains m)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{2,\dots,18\},\; \mathrm{isPrime}\mathopen{}\left(m\right) = m \in \mathrm{primesUpTo30}</code></pre></details>
</div>
<p class="thm-remark">── primality across the range, decided — and agreeing with the list this file already used ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 17 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_units_are_cyclic_at_exactly_the_gauss_moduli">
<p class="thm-label"><strong>Theorem 807</strong> (<code>the_units_are_cyclic_at_exactly_the_gauss_moduli</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_units_are_cyclic_at_exactly_the_gauss_moduli.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>18</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>hasPrimitiveRoot</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>gaussCyclic</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 17).all (fun m =&gt; hasPrimitiveRoot m == gaussCyclic m)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{2,\dots,18\},\; \mathrm{hasPrimitiveRoot}\mathopen{}\left(m\right) = \mathrm{gaussCyclic}\mathopen{}\left(m\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 17 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-demorgan_holds_at_every_arity_to_eight">
<p class="thm-label"><strong>Theorem 808</strong> (<code>demorgan_holds_at_every_arity_to_eight</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_demorgan_holds_at_every_arity_to_eight.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><msup><mn>2</mn><mi>k</mi></msup><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>k</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>n</mi><mo>≫</mo><mi>i</mi></mrow><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow><mo>=</mo><mrow><mo>∃</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>k</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>:</mo><mrow><mrow><mrow><mi>n</mi><mo>≫</mo><mi>i</mi></mrow><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 7).all (fun k =&gt; (List.range (2 ^ k)).all (fun n =&gt; (! (List.range k).all (fun i =&gt; (n &gt;&gt;&gt; i) % 2 == 1)) == (List.range k).any (fun i =&gt; (n &gt;&gt;&gt; i) % 2 == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{2,\dots,8\},\; \forall n \in \{0,\dots,2^{k}-1\},\; \lnot \forall i \in \{0,\dots,k-1\},\; n \gg i \bmod 2 = 1 = \exists i \in \{0,\dots,k-1\} : n \gg i \bmod 2 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 7 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-multiplication_permutes_z9_at_exactly_the_units">
<p class="thm-label"><strong>Theorem 809</strong> (<code>multiplication_permutes_z9_at_exactly_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_multiplication_permutes_z9_at_exactly_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>permutesZ9</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>gcd'</mi><mo>(</mo><mi>k</mi><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 8).all (fun k =&gt; permutesZ9 k == (gcd' k 9 == 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{1,\dots,8\},\; \mathrm{permutesZ9}\mathopen{}\left(k\right) = \mathrm{gcd'}\mathopen{}\left(k,\,9\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── multiplication permutes ℤ/9 at exactly the units — the failing parameters stated, not omitted ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-addition_generates_z9_at_exactly_the_units">
<p class="thm-label"><strong>Theorem 810</strong> (<code>addition_generates_z9_at_exactly_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_addition_generates_z9_at_exactly_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>addGeneratesZ9</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>gcd'</mi><mo>(</mo><mi>k</mi><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 8).all (fun k =&gt; addGeneratesZ9 k == (gcd' k 9 == 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{1,\dots,8\},\; \mathrm{addGeneratesZ9}\mathopen{}\left(k\right) = \mathrm{gcd'}\mathopen{}\left(k,\,9\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── repeated addition reaches all of ℤ/9 at exactly the same parameters, by a different computation ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-an_inverse_mod_nine_exists_at_exactly_the_units">
<p class="thm-label"><strong>Theorem 811</strong> (<code>an_inverse_mod_nine_exists_at_exactly_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_an_inverse_mod_nine_exists_at_exactly_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∃</mo><mrow><mi>invOf</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mrow><mi>gcd'</mi><mo>(</mo><mi>d</mi><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun d =&gt; (invOf d).isSome == (gcd' d 9 == 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,8\},\; \exists\,\mathrm{invOf}\mathopen{}\left(d\right) = \mathrm{gcd'}\mathopen{}\left(d,\,9\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── an inverse mod 9 exists at exactly the units, across the whole ring including zero ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_inverse_of_a_unit_mod_nine_is_its_fifth_power">
<p class="thm-label"><strong>Theorem 812</strong> (<code>the_inverse_of_a_unit_mod_nine_is_its_fifth_power</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_inverse_of_a_unit_mod_nine_is_its_fifth_power.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mrow><mi>unitsMod</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>u</mi><mo>⋅</mo><mrow><mi>powMod</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>5</mn><mo>,</mo><mn>9</mn><mo>)</mo></mrow></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(unitsMod 9).all (fun u =&gt; u * (powMod u 5 9) % 9 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall u \in \mathrm{unitsMod}\mathopen{}\left(9\right),\; u \cdot \mathrm{powMod}\mathopen{}\left(u,\,5,\,9\right) \bmod 9 = 1</code></pre></details>
</div>
<p class="thm-remark">── and where it exists it is the fifth power: u · u⁵ ≡ 1, since |units mod 9| = 6 ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-power_sums_match_their_closed_forms">
<p class="thm-label"><strong>Theorem 813</strong> (<code>power_sums_match_their_closed_forms</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_power_sums_match_their_closed_forms.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>40</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>powSum</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>faulhaber</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 5).all (fun k =&gt; (List.range 41).all (fun n =&gt; powSum k n == faulhaber k n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{1,\dots,5\},\; \forall n \in \{0,\dots,40\},\; \mathrm{powSum}\mathopen{}\left(k,\,n\right) = \mathrm{faulhaber}\mathopen{}\left(k,\,n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 205 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_digital_root_is_invariant_under_digit_reversal">
<p class="thm-label"><strong>Theorem 814</strong> (<code>the_digital_root_is_invariant_under_digit_reversal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_digital_root_is_invariant_under_digit_reversal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>digitalRoot</mi><mo>(</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mn>100</mn></mrow><mo>+</mo><mi>b</mi></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>digitalRoot</mi><mo>(</mo><mrow><mi>reverseDigits</mi><mo>(</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mn>100</mn></mrow><mo>+</mo><mi>b</mi></mrow><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 100).all (fun a =&gt; (List.range 100).all (fun b =&gt; digitalRoot (a * 100 + b) == digitalRoot (reverseDigits (a * 100 + b))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,99\},\; \forall b \in \{0,\dots,99\},\; \mathrm{digitalRoot}\mathopen{}\left(a \cdot 100 + b\right) = \mathrm{digitalRoot}\mathopen{}\left(\mathrm{reverseDigits}\mathopen{}\left(a \cdot 100 + b\right)\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-geometric_series_across_bases_and_exponents">
<p class="thm-label"><strong>Theorem 815</strong> (<code>geometric_series_across_bases_and_exponents</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_geometric_series_across_bases_and_exponents.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>12</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>6</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><msup><mi>b</mi><mi>i</mi></msup><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>⋅</mo><mrow><mi>b</mi><mo>-</mo><mn>1</mn></mrow></mrow><mo>=</mo><mrow><msup><mi>b</mi><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></msup><mo>-</mo><mn>1</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 11).all (fun b =&gt; (List.range 7).all (fun n =&gt; ((List.range (n + 1)).map (fun i =&gt; b ^ i)).foldl (· + ·) 0 * (b - 1) == b ^ (n + 1) - 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall b \in \{2,\dots,12\},\; \forall n \in \{0,\dots,6\},\; \sum \{\, b^{i} \mid i \in \{0,\dots,n + 1-1\} \,\} \cdot b - 1 = b^{n + 1} - 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 77 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-totient_at_prime_powers_through_thirteen">
<p class="thm-label"><strong>Theorem 816</strong> (<code>totient_at_prime_powers_through_thirteen</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_totient_at_prime_powers_through_thirteen.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>11</mn><mo>,</mo><mn>13</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>totient</mi><mo>(</mo><msup><mi>p</mi><mi>k</mi></msup><mo>)</mo></mrow><mo>=</mo><mrow><msup><mi>p</mi><mi>k</mi></msup><mo>-</mo><msup><mi>p</mi><mrow><mi>k</mi><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[2, 3, 5, 7, 11, 13].all (fun p =&gt; (List.range' 1 3).all (fun k =&gt; totient (p ^ k) == p ^ k - p ^ (k - 1)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in [2,\,3,\,5,\,7,\,11,\,13],\; \forall k \in \{1,\dots,3\},\; \mathrm{totient}\mathopen{}\left(p^{k}\right) = p^{k} - p^{k - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 18 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_powers_of_a_unit_sum_to_zero_when_g_minus_one_is_invertible">
<p class="thm-label"><strong>Theorem 817</strong> (<code>the_powers_of_a_unit_sum_to_zero_when_g_minus_one_is_invertible</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_powers_of_a_unit_sum_to_zero_when_g_minus_one_is_invertible.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>20</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>g</mi><mo>∈</mo><mrow><mi>unitsMod</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mrow><mi>gcd'</mi><mo>(</mo><mrow><mi>g</mi><mo>-</mo><mn>1</mn></mrow><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∨</mo><mrow><mrow><mrow><mi>rootSum</mi><mo>(</mo><mi>g</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>mod</mo><mi>m</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 2 19).all (fun m =&gt; (unitsMod m).all (fun g =&gt; !(gcd' (g - 1) m == 1) || (rootSum g m % m == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{2,\dots,20\},\; \forall g \in \mathrm{unitsMod}\mathopen{}\left(m\right),\; \lnot \mathrm{gcd'}\mathopen{}\left(g - 1,\,m\right) = 1 \lor \mathrm{rootSum}\mathopen{}\left(g,\,m\right) \bmod m = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 19 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-and_the_converse_fails_at_six">
<p class="thm-label"><strong>Theorem 818</strong> (<code>and_the_converse_fails_at_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_and_the_converse_fails_at_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>ordMod</mi><mo>(</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mi>rootSum</mi><mo>(</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>mod</mo><mn>6</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>gcd'</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ordMod 5 6 = 2 ∧ rootSum 5 6 % 6 = 0 ∧ gcd' 4 6 = 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{ordMod}\mathopen{}\left(5,\,6\right) = 2 \land \mathrm{rootSum}\mathopen{}\left(5,\,6\right) \bmod 6 = 0 \land \mathrm{gcd'}\mathopen{}\left(4,\,6\right) = 2</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_first_n_odd_numbers_sum_to_n_squared">
<p class="thm-label"><strong>Theorem 819</strong> (<code>the_first_n_odd_numbers_sum_to_n_squared</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_first_n_odd_numbers_sum_to_n_squared.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>200</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>i</mi></mrow><mo>+</mo><mn>1</mn></mrow><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><mrow><mi>n</mi><mo>⋅</mo><mi>n</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 201).all (fun n =&gt; ((List.range n).map (fun i =&gt; 2 * i + 1)).foldl (· + ·) 0 == n * n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,200\},\; \sum \{\, 2 \cdot i + 1 \mid i \in \{0,\dots,n-1\} \,\} = n \cdot n</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 201 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_powers_of_two_sum_to_one_less_than_the_next">
<p class="thm-label"><strong>Theorem 820</strong> (<code>the_powers_of_two_sum_to_one_less_than_the_next</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_powers_of_two_sum_to_one_less_than_the_next.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>40</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><msup><mn>2</mn><mi>i</mi></msup><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><mrow><msup><mn>2</mn><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></msup><mo>-</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 41).all (fun n =&gt; ((List.range (n + 1)).map (fun i =&gt; 2 ^ i)).foldl (· + ·) 0 == 2 ^ (n + 1) - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,40\},\; \sum \{\, 2^{i} \mid i \in \{0,\dots,n + 1-1\} \,\} = 2^{n + 1} - 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 41 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_sums_of_triangular_numbers_are_the_tetrahedral_numbers">
<p class="thm-label"><strong>Theorem 821</strong> (<code>the_sums_of_triangular_numbers_are_the_tetrahedral_numbers</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_sums_of_triangular_numbers_are_the_tetrahedral_numbers.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>100</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mfrac><mrow><mi>i</mi><mo>⋅</mo><mrow><mi>i</mi><mo>+</mo><mn>1</mn></mrow></mrow><mn>2</mn></mfrac><mo>∣</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mn>1</mn><mo>+</mo><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><mfrac><mrow><mrow><mi>n</mi><mo>⋅</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow></mrow><mo>⋅</mo><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow></mrow><mn>6</mn></mfrac></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 101).all (fun n =&gt; ((List.range' 1 n).map (fun i =&gt; i * (i + 1) / 2)).foldl (· + ·) 0 == n * (n + 1) * (n + 2) / 6)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,100\},\; \sum \{\, \frac{i \cdot i + 1}{2} \mid i \in \{1,\dots,1+n-1\} \,\} = \frac{n \cdot n + 1 \cdot n + 2}{6}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 101 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_squares_of_a_pascal_row_sum_to_the_central_binomial">
<p class="thm-label"><strong>Theorem 822</strong> (<code>the_squares_of_a_pascal_row_sum_to_the_central_binomial</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_squares_of_a_pascal_row_sum_to_the_central_binomial.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>12</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mrow><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>=</mo><mrow><mi>choose</mi><mo>(</mo><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>,</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 13).all (fun n =&gt; ((List.range (n + 1)).map (fun k =&gt; choose n k * choose n k)).foldl (· + ·) 0 == choose (2 * n) n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,12\},\; \sum \{\, \mathrm{choose}\mathopen{}\left(n,\,k\right) \cdot \mathrm{choose}\mathopen{}\left(n,\,k\right) \mid k \in \{0,\dots,n + 1-1\} \,\} = \mathrm{choose}\mathopen{}\left(2 \cdot n,\,n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 13 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-polygonal_closed_forms_match_their_recurrences">
<p class="thm-label"><strong>Theorem 823</strong> (<code>polygonal_closed_forms_match_their_recurrences</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_polygonal_closed_forms_match_their_recurrences.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>3</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>50</mn><mo>}</mo></mrow><mo>,</mo><mrow><mfrac><mrow><mrow><mrow><mrow><mrow><mi>s</mi><mo>-</mo><mn>2</mn></mrow><mo>⋅</mo><mi>n</mi></mrow><mo>⋅</mo><mi>n</mi></mrow><mo>+</mo><mrow><mn>4</mn><mo>⋅</mo><mi>n</mi></mrow></mrow><mo>-</mo><mrow><mi>s</mi><mo>⋅</mo><mi>n</mi></mrow></mrow><mn>2</mn></mfrac><mo>=</mo><mrow><mi>polyRec</mi><mo>(</mo><mi>s</mi><mo>,</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 3 8).all (fun s =&gt; (List.range 51).all (fun n =&gt; ((s - 2) * n * n + 4 * n - s * n) / 2 == polyRec s n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in \{3,\dots,10\},\; \forall n \in \{0,\dots,50\},\; \frac{s - 2 \cdot n \cdot n + 4 \cdot n - s \cdot n}{2} = \mathrm{polyRec}\mathopen{}\left(s,\,n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 408 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_order_of_every_unit_mod_nine_divides_six">
<p class="thm-label"><strong>Theorem 824</strong> (<code>the_order_of_every_unit_mod_nine_divides_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_order_of_every_unit_mod_nine_divides_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mrow><mi>unitsMod</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>ordMod</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>&gt;</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mn>6</mn><mo>mod</mo><mrow><mi>ordMod</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>9</mn><mo>)</mo></mrow></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>powMod</mi><mo>(</mo><mi>u</mi><mo>,</mo><mrow><mi>ordMod</mi><mo>(</mo><mi>u</mi><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(unitsMod 9).all (fun u =&gt; ordMod u 9 &gt; 0 &amp;&amp; 6 % ordMod u 9 == 0 &amp;&amp; powMod u (ordMod u 9) 9 == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall u \in \mathrm{unitsMod}\mathopen{}\left(9\right),\; \mathrm{ordMod}\mathopen{}\left(u,\,9\right) &gt; 0 \land 6 \bmod \mathrm{ordMod}\mathopen{}\left(u,\,9\right) = 0 \land \mathrm{powMod}\mathopen{}\left(u,\,\mathrm{ordMod}\mathopen{}\left(u,\,9\right),\,9\right) = 1</code></pre></details>
</div>
<p class="thm-remark">── Lagrange in the one group this deposit is built on: every unit's order divides the group's ── ordMod finds the LEAST positive exponent, so minimality is by construction and not asserted here.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_digit_square_iteration_reaches_one_or_four">
<p class="thm-label"><strong>Theorem 825</strong> (<code>the_digit_square_iteration_reaches_one_or_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_digit_square_iteration_reaches_one_or_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>200</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>iterF</mi><mo>(</mo><mn>60</mn><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∨</mo><mrow><mrow><mi>iterF</mi><mo>(</mo><mn>60</mn><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 200).all (fun n =&gt; iterF 60 n == 1 || iterF 60 n == 4)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,200\},\; \mathrm{iterF}\mathopen{}\left(60,\,n\right) = 1 \lor \mathrm{iterF}\mathopen{}\left(60,\,n\right) = 4</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-a_number_is_a_sum_of_two_squares_exactly_when_fermats_condition_holds">
<p class="thm-label"><strong>Theorem 826</strong> (<code>a_number_is_a_sum_of_two_squares_exactly_when_fermats_condition_holds</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_a_number_is_a_sum_of_two_squares_exactly_when_fermats_condition_holds.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>200</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isSumOfTwoSquares</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>everyThreeModFourPrimeIsEven</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 200).all (fun n =&gt; isSumOfTwoSquares n == everyThreeModFourPrimeIsEven n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,200\},\; \mathrm{isSumOfTwoSquares}\mathopen{}\left(n\right) = \mathrm{everyThreeModFourPrimeIsEven}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 200 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_first_three_power_sums_hold_to_two_hundred">
<p class="thm-label"><strong>Theorem 827</strong> (<code>the_first_three_power_sums_hold_to_two_hundred</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_first_three_power_sums_hold_to_two_hundred.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>3</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>200</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>powSum</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>faulhaber</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 3).all (fun k =&gt; (List.range 201).all (fun n =&gt; powSum k n == faulhaber k n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{1,\dots,3\},\; \forall n \in \{0,\dots,200\},\; \mathrm{powSum}\mathopen{}\left(k,\,n\right) = \mathrm{faulhaber}\mathopen{}\left(k,\,n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 603 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula">
<p class="thm-label"><strong>Theorem 828</strong> (<code>there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula.html">sealed</a>.</p>
<pre class="thm-statement"><code>schlafli.length = 5 ∧ schlafli.all (fun x =&gt; let d := 2 * x.1 + 2 * x.2 - x.1 * x.2 4 * x.1 % d == 0 &amp;&amp; 2 * x.1 * x.2 % d == 0 &amp;&amp; 4 * x.2 % d == 0 &amp;&amp; 4 * x.1 / d + 4 * x.2 / d == 2 * x.1 * x.2 / d + 2)</code></pre>
</div>
<p class="thm-remark">── there are exactly five, and each satisfies V + F = E + 2 ── Written as V + F = E + 2 rather than V − E + F = 2: the subtraction is the same statement over ℤ and a truncation over Nat, and a theorem that is only true because a subtraction clipped is not a theorem.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-cassinis_identity_holds_across_the_range">
<p class="thm-label"><strong>Theorem 829</strong> (<code>cassinis_identity_holds_across_the_range</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_cassinis_identity_holds_across_the_range.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>30</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>(</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow></mrow><mo>if</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>;</mo><mo>otherwise</mo><mrow><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>-</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mrow><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>⋅</mo><mrow><mi>fib</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range' 1 30).all (fun n =&gt; if n % 2 == 0 then fib (n - 1) * fib (n + 1) == fib n * fib n + 1 else fib (n - 1) * fib (n + 1) + 1 == fib n * fib n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{1,\dots,30\},\; \begin{cases}\mathrm{fib}\mathopen{}\left(n - 1\right) \cdot \mathrm{fib}\mathopen{}\left(n + 1\right) = \mathrm{fib}\mathopen{}\left(n\right) \cdot \mathrm{fib}\mathopen{}\left(n\right) + 1 &amp; \text{if } n \bmod 2 = 0\\ \mathrm{fib}\mathopen{}\left(n - 1\right) \cdot \mathrm{fib}\mathopen{}\left(n + 1\right) + 1 = \mathrm{fib}\mathopen{}\left(n\right) \cdot \mathrm{fib}\mathopen{}\left(n\right) &amp; \text{otherwise}\end{cases}</code></pre></details>
</div>
<p class="thm-remark">── Cassini: F(n−1)·F(n+1) − F(n)² alternates, so it is stated as the two cases Nat can express ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 30 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_golden_convergents_are_fibonacci_ratios_with_unit_determinant">
<p class="thm-label"><strong>Theorem 830</strong> (<code>the_golden_convergents_are_fibonacci_ratios_with_unit_determinant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_golden_convergents_are_fibonacci_ratios_with_unit_determinant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>24</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>=</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>2</mn></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub><mo>=</mo><mrow><mi>fib</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>(</mo><mrow><mrow><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>⋅</mo><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub></mrow><mo>+</mo><mn>1</mn></mrow><mo>=</mo><mrow><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>⋅</mo><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub></mrow><mo>+</mo><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub><mo>⋅</mo><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub></mrow></mrow></mrow><mo>if</mo><mrow><mrow><mi>n</mi><mo>mod</mo><mn>2</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>;</mo><mo>otherwise</mo><mrow><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>⋅</mo><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub></mrow><mo>=</mo><mrow><mrow><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>⋅</mo><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub></mrow><mo>+</mo><mrow><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub><mo>⋅</mo><msub><mrow><mi>cfPair</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mn>2</mn></msub></mrow></mrow><mo>+</mo><mn>1</mn></mrow></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 25).all (fun n =&gt; (cfPair n).1 == fib (n + 2) &amp;&amp; (cfPair n).2 == fib (n + 1) &amp;&amp; (if n % 2 == 0 then (cfPair n).1 * (cfPair n).1 + 1 == (cfPair n).1 * (cfPair n).2 + (cfPair n).2 * (cfPair n).2 else (cfPair n).1 * (cfPair n).1 == (cfPair n).1 * (cfPair n).2 + (cfPair n).2 * (cfPair n).2 + 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,24\},\; \mathrm{cfPair}\mathopen{}\left(n\right)_{1} = \mathrm{fib}\mathopen{}\left(n + 2\right) \land \mathrm{cfPair}\mathopen{}\left(n\right)_{2} = \mathrm{fib}\mathopen{}\left(n + 1\right) \land \begin{cases}\mathrm{cfPair}\mathopen{}\left(n\right)_{1} \cdot \mathrm{cfPair}\mathopen{}\left(n\right)_{1} + 1 = \mathrm{cfPair}\mathopen{}\left(n\right)_{1} \cdot \mathrm{cfPair}\mathopen{}\left(n\right)_{2} + \mathrm{cfPair}\mathopen{}\left(n\right)_{2} \cdot \mathrm{cfPair}\mathopen{}\left(n\right)_{2} &amp; \text{if } n \bmod 2 = 0\\ \mathrm{cfPair}\mathopen{}\left(n\right)_{1} \cdot \mathrm{cfPair}\mathopen{}\left(n\right)_{1} = \mathrm{cfPair}\mathopen{}\left(n\right)_{1} \cdot \mathrm{cfPair}\mathopen{}\left(n\right)_{2} + \mathrm{cfPair}\mathopen{}\left(n\right)_{2} \cdot \mathrm{cfPair}\mathopen{}\left(n\right)_{2} + 1 &amp; \text{otherwise}\end{cases}</code></pre></details>
</div>
<p class="thm-remark">── the golden continued fraction: its convergents ARE the Fibonacci ratios, and the determinant is ±1 ── More than Cassini restated: it identifies pₙ and qₙ, which is the part a determinant identity alone does not say.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 25 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_catalan_recurrence_matches_the_binomial_formula">
<p class="thm-label"><strong>Theorem 831</strong> (<code>the_catalan_recurrence_matches_the_binomial_formula</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_catalan_recurrence_matches_the_binomial_formula.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 13).all (fun n =&gt; (catalanList 12).getD n 0 == choose (2 * n) n / (n + 1))</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 13 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_pisano_period_of_nine_is_twenty_four_and_every_modulus_to_twelve_has_one">
<p class="thm-label"><strong>Theorem 832</strong> (<code>the_pisano_period_of_nine_is_twenty_four_and_every_modulus_to_twelve_has_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_pisano_period_of_nine_is_twenty_four_and_every_modulus_to_twelve_has_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>pisano</mi><mo>(</mo><mn>9</mn><mo>)</mo></mrow><mo>=</mo><mn>24</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>2</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>12</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>pisano</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>&gt;</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mi>pisano</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>mod</mo><mi>m</mi></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>fib</mi><mo>(</mo><mrow><mrow><mi>pisano</mi><mo>(</mo><mi>m</mi><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>mod</mo><mi>m</mi></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pisano 9 = 24 ∧ (List.range' 2 11).all (fun m =&gt; pisano m &gt; 0 &amp;&amp; fib (pisano m) % m == 0 &amp;&amp; fib (pisano m + 1) % m == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{pisano}\mathopen{}\left(9\right) = 24 \land \forall m \in \{2,\dots,12\},\; \mathrm{pisano}\mathopen{}\left(m\right) &gt; 0 \land \mathrm{fib}\mathopen{}\left(\mathrm{pisano}\mathopen{}\left(m\right)\right) \bmod m = 0 \land \mathrm{fib}\mathopen{}\left(\mathrm{pisano}\mathopen{}\left(m\right) + 1\right) \bmod m = 1</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 11 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_digit_sum_rules_for_three_and_nine_hold_below_ten_thousand">
<p class="thm-label"><strong>Theorem 833</strong> (<code>the_digit_sum_rules_for_three_and_nine_hold_below_ten_thousand</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_digit_sum_rules_for_three_and_nine_hold_below_ten_thousand.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>99</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mrow><mi>digitSum</mi><mo>(</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mn>100</mn></mrow><mo>+</mo><mi>b</mi></mrow><mo>)</mo></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mn>100</mn></mrow><mo>+</mo><mi>b</mi></mrow><mo>mod</mo><mn>3</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mi>digitSum</mi><mo>(</mo><mrow><mrow><mi>a</mi><mo>⋅</mo><mn>100</mn></mrow><mo>+</mo><mi>b</mi></mrow><mo>)</mo></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mi>a</mi><mo>⋅</mo><mn>100</mn></mrow><mo>+</mo><mi>b</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 100).all (fun a =&gt; (List.range 100).all (fun b =&gt; (digitSum (a * 100 + b) % 3 == 0) == ((a * 100 + b) % 3 == 0) &amp;&amp; ((digitSum (a * 100 + b) % 9 == 0) == ((a * 100 + b) % 9 == 0))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,99\},\; \forall b \in \{0,\dots,99\},\; \mathrm{digitSum}\mathopen{}\left(a \cdot 100 + b\right) \bmod 3 = 0 = a \cdot 100 + b \bmod 3 = 0 \land \mathrm{digitSum}\mathopen{}\left(a \cdot 100 + b\right) \bmod 9 = 0 = a \cdot 100 + b \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_involutions_are_counted_by_the_telephone_numbers">
<p class="thm-label"><strong>Theorem 834</strong> (<code>the_involutions_are_counted_by_the_telephone_numbers</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_involutions_are_counted_by_the_telephone_numbers.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mi>permsN</mi><mo>(</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>∣</mo><mi>isInvolution</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mrow><mi>telephone</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 6).all (fun n =&gt; ((permsN (List.range n)).filter isInvolution).length == telephone n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,5\},\; \left|\{\, x \in \mathrm{permsN}\mathopen{}\left(\{0,\dots,n-1\}\right) \mid \mathrm{isInvolution}\mathopen{}\left(x\right) \,\}\right| = \mathrm{telephone}\mathopen{}\left(n\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-invOf_is_an_inverse_and_an_involution_on_the_units">
<p class="thm-label"><strong>Theorem 835</strong> (<code>invOf_is_an_inverse_and_an_involution_on_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_invOf_is_an_inverse_and_an_involution_on_the_units.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 9).all (fun d =&gt; match invOf d with | some e =&gt; d * e % 9 == 1 &amp;&amp; invOf e == some d | none =&gt; gcd' d 9 != 1)</code></pre>
</div>
<p class="thm-remark">── the unit inverse, stated AS an inverse. That invOf finds something at exactly the units was proved above; this proves what it finds: the residue multiplies back to one, and inverting twice returns the unit — so invOf is an involution on the six units, and the non-units, where it finds nothing, are exactly the residues sharing a factor with nine ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-choose_is_invariant_under_the_involution_k_to_n_minus_k">
<p class="thm-label"><strong>Theorem 836</strong> (<code>choose_is_invariant_under_the_involution_k_to_n_minus_k</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_choose_is_invariant_under_the_involution_k_to_n_minus_k.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>12</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mi>k</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>choose</mi><mo>(</mo><mi>n</mi><mo>,</mo><mrow><mi>n</mi><mo>-</mo><mi>k</mi></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>n</mi><mo>-</mo><mrow><mi>n</mi><mo>-</mo><mi>k</mi></mrow></mrow><mo>=</mo><mi>k</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 13).all (fun n =&gt; (List.range (n + 1)).all (fun k =&gt; choose n k == choose n (n - k) &amp;&amp; n - (n - k) == k))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,12\},\; \forall k \in \{0,\dots,n + 1-1\},\; \mathrm{choose}\mathopen{}\left(n,\,k\right) = \mathrm{choose}\mathopen{}\left(n,\,n - k\right) \land n - n - k = k</code></pre></details>
</div>
<p class="thm-remark">── the binomial coefficient does not see the involution k ↦ n − k: choosing k is choosing the n − k left behind, and applying the involution twice returns k, at every n to twelve and every k ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 13 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_powers_of_two_sum_to_one_less_than_the_next_for_every_n">
<p class="thm-label"><strong>Theorem 837</strong> (<code>the_powers_of_two_sum_to_one_less_than_the_next_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_powers_of_two_sum_to_one_less_than_the_next_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, ((List.range (n + 1)).map (fun i =&gt; 2 ^ i)).foldl (· + ·) 0 = 2 ^ (n + 1) - 1</code></pre>
</div>
<p class="thm-remark">── the capped rows above, proved for every value by induction — no bound ──────────────────────────────────── the_powers_of_two_sum_to_one_less_than_the_next checked n ≤ 40; this proves it for every n.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-square_of_successor">
<p class="thm-label"><strong>Theorem 838</strong> (<code>square_of_successor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_square_of_successor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (n + 1) * (n + 1) = n * n + 2 * n + 1</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_first_n_odd_numbers_sum_to_n_squared_for_every_n">
<p class="thm-label"><strong>Theorem 839</strong> (<code>the_first_n_odd_numbers_sum_to_n_squared_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_first_n_odd_numbers_sum_to_n_squared_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, ((List.range n).map (fun i =&gt; 2 * i + 1)).foldl (· + ·) 0 = n * n</code></pre>
</div>
<p class="thm-remark">the_first_n_odd_numbers_sum_to_n_squared checked n ≤ 200; this proves it for every n.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-cassinis_identity_for_every_m">
<p class="thm-label"><strong>Theorem 840</strong> (<code>cassinis_identity_for_every_m</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_cassinis_identity_for_every_m.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ m : Nat, fib (2 * m + 1) * fib (2 * m + 3) = fib (2 * m + 2) * fib (2 * m + 2) + 1 ∧ fib (2 * m) * fib (2 * m + 2) + 1 = fib (2 * m + 1) * fib (2 * m + 1)</code></pre>
</div>
<p class="thm-remark">── the capped rows above, proved for every value by induction — no bound ────────────────────────────────── cassinis_identity_holds_across_the_range (n ≤ 30), power_sums_match_their_closed_forms (k = 1..5, n ≤ 40), the_first_three_power_sums_hold_to_two_hundred (n ≤ 200) and the_sums_of_triangular_numbers_are_the_tetrahedral_ numbers (n ≤ 100) were checked up to a bound; these prove them for every value. Core Lean has no ring tactic, so each polynomial step is expanded, each monomial sorted, its numeral moved to the front, and omega closes what is left.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-a_sum_over_one_to_n_plus_one_adds_the_last_term">
<p class="thm-label"><strong>Theorem 841</strong> (<code>a_sum_over_one_to_n_plus_one_adds_the_last_term</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_a_sum_over_one_to_n_plus_one_adds_the_last_term.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (g : Nat → Nat) (n : Nat), ((List.range' 1 (n + 1)).map g).foldl (· + ·) 0 = ((List.range' 1 n).map g).foldl (· + ·) 0 + g (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_numbers_sum_to_their_closed_form_for_every_n">
<p class="thm-label"><strong>Theorem 842</strong> (<code>the_numbers_sum_to_their_closed_form_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_numbers_sum_to_their_closed_form_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 2 * powSum 1 n = n * (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_squares_sum_to_their_closed_form_for_every_n">
<p class="thm-label"><strong>Theorem 843</strong> (<code>the_squares_sum_to_their_closed_form_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_squares_sum_to_their_closed_form_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 6 * powSum 2 n = n * (n + 1) * (2 * n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_cubes_sum_to_their_closed_form_for_every_n">
<p class="thm-label"><strong>Theorem 844</strong> (<code>the_cubes_sum_to_their_closed_form_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_cubes_sum_to_their_closed_form_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 4 * powSum 3 n = n * n * (n + 1) * (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_fourth_powers_sum_to_their_closed_form_for_every_n">
<p class="thm-label"><strong>Theorem 845</strong> (<code>the_fourth_powers_sum_to_their_closed_form_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_fourth_powers_sum_to_their_closed_form_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 30 * powSum 4 n = n * (n + 1) * (2 * n + 1) * (3 * n * n + 3 * n - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_fifth_powers_sum_to_their_closed_form_for_every_n">
<p class="thm-label"><strong>Theorem 846</strong> (<code>the_fifth_powers_sum_to_their_closed_form_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_fifth_powers_sum_to_their_closed_form_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 12 * powSum 5 n = n * n * (n + 1) * (n + 1) * (2 * n * n + 2 * n - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-power_sums_match_their_closed_forms_for_every_n">
<p class="thm-label"><strong>Theorem 847</strong> (<code>power_sums_match_their_closed_forms_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_power_sums_match_their_closed_forms_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k n : Nat, 1 ≤ k → k ≤ 5 → powSum k n = faulhaber k n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_sums_of_triangular_numbers_are_the_tetrahedral_numbers_for_every_n">
<p class="thm-label"><strong>Theorem 848</strong> (<code>the_sums_of_triangular_numbers_are_the_tetrahedral_numbers_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_sums_of_triangular_numbers_are_the_tetrahedral_numbers_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, ((List.range' 1 n).map (fun i =&gt; i * (i + 1) / 2)).foldl (· + ·) 0 = n * (n + 1) * (n + 2) / 6</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  have</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-choose_is_invariant_under_the_involution_k_to_n_minus_k_for_every_n">
<p class="thm-label"><strong>Theorem 849</strong> (<code>choose_is_invariant_under_the_involution_k_to_n_minus_k_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_choose_is_invariant_under_the_involution_k_to_n_minus_k_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n k : Nat, k ≤ n → choose n k = choose n (n - k) ∧ n - (n - k) = k</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_closed_forms_difference_back_to_the_next_power_for_every_n">
<p class="thm-label"><strong>Theorem 850</strong> (<code>the_closed_forms_difference_back_to_the_next_power_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_closed_forms_difference_back_to_the_next_power_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k n : Nat, 1 ≤ k → k ≤ 5 → faulhaber k (n + 1) = faulhaber k n + (n + 1) ^ k</code></pre>
</div>
<p class="thm-remark">── reflections, from the sums batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── REFLECTIONS: each closed form differences back to its term</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_tetrahedral_numbers_difference_back_to_the_triangular_numbers_for_every_n">
<p class="thm-label"><strong>Theorem 851</strong> (<code>the_tetrahedral_numbers_difference_back_to_the_triangular_numbers_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_tetrahedral_numbers_difference_back_to_the_triangular_numbers_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (n + 1) * (n + 1 + 1) * (n + 1 + 2) / 6 = n * (n + 1) * (n + 2) / 6 + (n + 1) * (n + 1 + 1) / 2</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_powers_of_two_difference_back_to_the_next_power_for_every_n">
<p class="thm-label"><strong>Theorem 852</strong> (<code>the_powers_of_two_difference_back_to_the_next_power_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_powers_of_two_difference_back_to_the_next_power_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (2 ^ (n + 2) - 1) - (2 ^ (n + 1) - 1) = 2 ^ (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_odd_numbers_difference_back_to_the_next_odd_number_for_every_n">
<p class="thm-label"><strong>Theorem 853</strong> (<code>the_odd_numbers_difference_back_to_the_next_odd_number_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_odd_numbers_difference_back_to_the_next_odd_number_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, ((List.range (n + 1)).map (fun i =&gt; 2 * i + 1)).foldl (· + ·) 0 - ((List.range n).map (fun i =&gt; 2 * i + 1)).foldl (· + ·) 0 = 2 * n + 1</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-foldl_add_start">
<p class="thm-label"><strong>Theorem 854</strong> (<code>foldl_add_start</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_foldl_add_start.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (l : List Nat) (a : Nat), l.foldl (· + ·) a = a + l.foldl (· + ·) 0</code></pre>
</div>
<p class="thm-remark">── reflections, from the extra batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them">
<p class="thm-label"><strong>Theorem 855</strong> (<code>the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f n : Nat, n &lt; 10 ^ f → (digitsF f n).foldl (· + ·) 0 % 9 = n % 9</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-a_number_is_below_ten_to_its_own_successor">
<p class="thm-label"><strong>Theorem 856</strong> (<code>a_number_is_below_ten_to_its_own_successor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_a_number_is_below_ten_to_its_own_successor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n &lt; 10 ^ (n + 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-families-the_digit_sum_rules_for_three_and_nine_hold_for_every_n">
<p class="thm-label"><strong>Theorem 857</strong> (<code>the_digit_sum_rules_for_three_and_nine_hold_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_families_the_digit_sum_rules_for_three_and_nine_hold_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (digitSum n % 3 = 0 ↔ n % 3 = 0) ∧ (digitSum n % 9 = 0 ↔ n % 9 = 0)</code></pre>
</div>
<p class="thm-remark">the_digit_sum_rules_for_three_and_nine_hold_below_ten_thousand, for every n</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
