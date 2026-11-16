---
title: "Nim"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `nim.lean`

<p class="paper-src"><code>src/iso/iec-2382-computing/nim.lean</code> · namespace <code>Nim</code> · 28 theorems · wing <code>the machine</code></p>

Nim — Bouton's theorem and Sprague–Grundy, decided.


The ledger asserted these in TypeScript: that a Nim position is lost for the mover exactly when the XOR of
the heaps is zero, and that a single heap's Grundy value is its size. Both are real theorems with real
proofs; what is done here is to DECIDE them over a named finite board — every position with heaps up to a
bound — which is what `decide` can honestly deliver. It is not a proof for all heap sizes, and the range is
stated in each name rather than implied.

XOR is imported from Fnv rather than restated: it is the same fuel-bounded structural fold, built because
Nat's bitwise operations are well-founded and would drag `propext` into every theorem here. Its laws are
proved below for every a, b, c, on the standard axioms; the decided rows above stay as their instances.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>N := 6</code></pre>

<div class="thm" id="thm-nim-bouton_two_heaps_lost_iff_xor_zero">
<p class="thm-label"><strong>Theorem 1311</strong> (<code>bouton_two_heaps_lost_iff_xor_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_bouton_two_heaps_lost_iff_xor_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isLost</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range N).all (fun a =&gt; (List.range N).all (fun b =&gt; isLost a b == (xorN a b == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,N-1\},\; \forall b \in \{0,\dots,N-1\},\; \mathrm{isLost}\mathopen{}\left(a,\,b\right) = \mathrm{xorN}\mathopen{}\left(a,\,b\right) = 0</code></pre></details>
</div>
<p class="thm-remark">── BOUTON: a two-heap position is lost for the mover exactly when the heaps are equal — which is exactly when their XOR is zero. Decided over every position on the N×N board, N = 6. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-bouton_lost_iff_heaps_equal">
<p class="thm-label"><strong>Theorem 1312</strong> (<code>bouton_lost_iff_heaps_equal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_bouton_lost_iff_heaps_equal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isLost</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>a</mi><mo>=</mo><mi>b</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range N).all (fun a =&gt; (List.range N).all (fun b =&gt; isLost a b == (a == b)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,N-1\},\; \forall b \in \{0,\dots,N-1\},\; \mathrm{isLost}\mathopen{}\left(a,\,b\right) = a = b</code></pre></details>
</div>
<p class="thm-remark">── the same statement in its familiar form: lost exactly when the heaps are equal ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-lost_positions_are_exactly_the_diagonal">
<p class="thm-label"><strong>Theorem 1313</strong> (<code>lost_positions_are_exactly_the_diagonal</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_lost_positions_are_exactly_the_diagonal.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>p</mi><mo>∈</mo><mrow><mo>⋃</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>{</mo><mrow><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>∣</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>}</mo></mrow></mrow><mo>∣</mo><mrow><mi>isLost</mi><mo>(</mo><msub><mi>p</mi><mn>1</mn></msub><mo>,</mo><msub><mi>p</mi><mn>2</mn></msub><mo>)</mo></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mi>N</mi></mrow></math></div>
<pre class="thm-statement"><code>(((List.range N).flatMap (fun a =&gt; (List.range N).map (fun b =&gt; (a, b)))).filter (fun p =&gt; isLost p.1 p.2)).length = N</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, p \in \bigcup_{a \in \{0,\dots,N-1\}} \{\, \left(a,\,b\right) \mid b \in \{0,\dots,N-1\} \,\} \mid \mathrm{isLost}\mathopen{}\left(p_{1},\,p_{2}\right) \,\}\right| = N</code></pre></details>
</div>
<p class="thm-remark">── NON-VACUITY: the losing positions are exactly the diagonal, so there are N of them among N² — neither everything nor nothing. (An earlier version fixed this count at 8 for an 8x8 board; when the board was reduced the kernel proved the statement FALSE rather than letting a stale constant pass. Tied to N now.) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-grundy_of_a_single_heap_is_its_size">
<p class="thm-label"><strong>Theorem 1314</strong> (<code>grundy_of_a_single_heap_is_its_size</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_grundy_of_a_single_heap_is_its_size.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>grundy1</mi><mo>(</mo><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>,</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mi>n</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range N).all (fun n =&gt; grundy1 (n + 1) n == n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \{0,\dots,N-1\},\; \mathrm{grundy1}\mathopen{}\left(n + 1,\,n\right) = n</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-grundy_of_two_heaps_is_the_xor">
<p class="thm-label"><strong>Theorem 1315</strong> (<code>grundy_of_two_heaps_is_the_xor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_grundy_of_two_heaps_is_the_xor.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>N</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mrow><mi>grundy1</mi><mo>(</mo><mrow><mi>a</mi><mo>+</mo><mn>1</mn></mrow><mo>,</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>grundy1</mi><mo>(</mo><mrow><mi>b</mi><mo>+</mo><mn>1</mn></mrow><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range N).all (fun a =&gt; (List.range N).all (fun b =&gt; (xorN (grundy1 (a + 1) a) (grundy1 (b + 1) b)) == xorN a b))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,N-1\},\; \forall b \in \{0,\dots,N-1\},\; \mathrm{xorN}\mathopen{}\left(\mathrm{grundy1}\mathopen{}\left(a + 1,\,a\right),\,\mathrm{grundy1}\mathopen{}\left(b + 1,\,b\right)\right) = \mathrm{xorN}\mathopen{}\left(a,\,b\right)</code></pre></details>
</div>
<p class="thm-remark">── and the two-heap Grundy value is the XOR of the parts ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_its_own_inverse">
<p class="thm-label"><strong>Theorem 1316</strong> (<code>xor_is_its_own_inverse</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_its_own_inverse.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mi>a</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; xorN (xorN a b) b == a))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \mathrm{xorN}\mathopen{}\left(\mathrm{xorN}\mathopen{}\left(a,\,b\right),\,b\right) = a</code></pre></details>
</div>
<p class="thm-remark">── XOR's algebra, which is why the theorem takes the form it does ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 256 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_commutative">
<p class="thm-label"><strong>Theorem 1317</strong> (<code>xor_is_commutative</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_commutative.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>xorN</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; xorN a b == xorN b a))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \mathrm{xorN}\mathopen{}\left(a,\,b\right) = \mathrm{xorN}\mathopen{}\left(b,\,a\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 256 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_zero_is_identity">
<p class="thm-label"><strong>Theorem 1318</strong> (<code>xor_zero_is_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_zero_is_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>31</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mi>a</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 32).all (fun a =&gt; xorN a 0 == a)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,31\},\; \mathrm{xorN}\mathopen{}\left(a,\,0\right) = a</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 32 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-the_nim_sum_is_a_gf2_vector_addition">
<p class="thm-label"><strong>Theorem 1319</strong> (<code>the_nim_sum_is_a_gf2_vector_addition</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_the_nim_sum_is_a_gf2_vector_addition.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>xorN</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mrow><mi>xorN</mi><mo>(</mo><mi>b</mi><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mi>a</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mi>a</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; xorN a b == xorN b a)) ∧ (List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun c =&gt; xorN (xorN a b) c == xorN a (xorN b c)))) ∧ (List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; xorN (xorN a b) b == a)) ∧ (List.range 16).all (fun a =&gt; xorN a 0 == a)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \mathrm{xorN}\mathopen{}\left(a,\,b\right) = \mathrm{xorN}\mathopen{}\left(b,\,a\right) \land \forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \forall c \in \{0,\dots,15\},\; \mathrm{xorN}\mathopen{}\left(\mathrm{xorN}\mathopen{}\left(a,\,b\right),\,c\right) = \mathrm{xorN}\mathopen{}\left(a,\,\mathrm{xorN}\mathopen{}\left(b,\,c\right)\right) \land \forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \mathrm{xorN}\mathopen{}\left(\mathrm{xorN}\mathopen{}\left(a,\,b\right),\,b\right) = a \land \forall a \in \{0,\dots,15\},\; \mathrm{xorN}\mathopen{}\left(a,\,0\right) = a</code></pre></details>
</div>
<p class="thm-remark">── THE NIM-SUM AS GF(2) VECTOR ADDITION, IN ONE PROPOSITION ───────────────────────────────────────────── `nim_sum_is_xor_gf2` claims the nim-sum IS GF(2) vector addition: commutative, associative and self-inverse. Associativity was the one property missing here — and the other three, though each decided above, are decided SEPARATELY. A claim is carried by a theorem that decides all of it or by none, and the ledger's supersededBy names exactly one key, so three quarters of a claim spread over three theorems carries nothing. The conjunction is the claim; the conjuncts standing alone are its parts, which is why both forms are here rather than one. Range 16 because the cube of it is walked.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,294,967,296 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-bouton_holds_at_every_heap_size_to_six">
<p class="thm-label"><strong>Theorem 1320</strong> (<code>bouton_holds_at_every_heap_size_to_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_bouton_holds_at_every_heap_size_to_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>6</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>6</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isLost</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>xorN</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 7).all (fun a =&gt; (List.range 7).all (fun b =&gt; isLost a b == (xorN a b == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,6\},\; \forall b \in \{0,\dots,6\},\; \mathrm{isLost}\mathopen{}\left(a,\,b\right) = \mathrm{xorN}\mathopen{}\left(a,\,b\right) = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 49 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-the_xor_of_two_bits_is_their_sum_mod_two">
<p class="thm-label"><strong>Theorem 1321</strong> (<code>the_xor_of_two_bits_is_their_sum_mod_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_the_xor_of_two_bits_is_their_sum_mod_two.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ x y : Nat, (if x % 2 == y % 2 then 0 else 1) = (x + y) % 2</code></pre>
</div>
<p class="thm-remark">── XOR's algebra for every a, b, c — no bound ─────────────────────────────────────────────────────────────── xor_is_its_own_inverse and xor_is_commutative (a, b &lt; 16), xor_zero_is_identity (a &lt; 32) and the_nim_sum_is_a_gf2_vector_addition (a, b, c &lt; 16) were decided over a range; these prove them for every value. The fold's fuel is a + b + 1, which always suffices: once it exceeds either argument, more fuel changes nothing, so xorN reads the same at any sufficient fuel. Everything follows from one step — the low bit of a XOR is the sum of the low bits mod 2, and the rest is twice the XOR of the halves — by induction. Bouton's theorem itself is still decided over the N×N board above; a proof of it for every heap is a game-tree induction not done here.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_commutes_at_every_fuel">
<p class="thm-label"><strong>Theorem 1322</strong> (<code>xor_commutes_at_every_fuel</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_commutes_at_every_fuel.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f a b : Nat, xorF f a b = xorF f b a</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-one_more_step_of_fuel_changes_nothing_once_it_exceeds_an_argument">
<p class="thm-label"><strong>Theorem 1323</strong> (<code>one_more_step_of_fuel_changes_nothing_once_it_exceeds_an_argument</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_one_more_step_of_fuel_changes_nothing_once_it_exceeds_an_argument.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f a b : Nat, (a &lt; f ∨ b &lt; f) → xorF (f + 1) a b = xorF f a b</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-more_fuel_changes_nothing_once_it_exceeds_an_argument">
<p class="thm-label"><strong>Theorem 1324</strong> (<code>more_fuel_changes_nothing_once_it_exceeds_an_argument</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_more_fuel_changes_nothing_once_it_exceeds_an_argument.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k f a b : Nat, (a &lt; f ∨ b &lt; f) → xorF (f + k) a b = xorF f a b</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_reads_the_same_at_every_sufficient_fuel">
<p class="thm-label"><strong>Theorem 1325</strong> (<code>xor_reads_the_same_at_every_sufficient_fuel</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_reads_the_same_at_every_sufficient_fuel.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ g a b : Nat, (a &lt; g ∨ b &lt; g) → xorN a b = xorF g a b</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-a_number_xored_with_itself_is_zero_at_every_fuel">
<p class="thm-label"><strong>Theorem 1326</strong> (<code>a_number_xored_with_itself_is_zero_at_every_fuel</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_a_number_xored_with_itself_is_zero_at_every_fuel.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f b : Nat, xorF f b b = 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_splits_off_its_lowest_bit">
<p class="thm-label"><strong>Theorem 1327</strong> (<code>xor_splits_off_its_lowest_bit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_splits_off_its_lowest_bit.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ g x c : Nat, 1 ≤ g → xorF (g + 1) x c = (x + c) % 2 + 2 * xorF g (x / 2) (c / 2)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_undoes_itself_when_the_fuel_suffices">
<p class="thm-label"><strong>Theorem 1328</strong> (<code>xor_undoes_itself_when_the_fuel_suffices</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_undoes_itself_when_the_fuel_suffices.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ f a b g : Nat, (a &lt; f ∨ b &lt; f) → b &lt; g → xorF g (xorF f a b) b = a</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_commutative_for_every_a_b">
<p class="thm-label"><strong>Theorem 1329</strong> (<code>xor_is_commutative_for_every_a_b</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_commutative_for_every_a_b.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b : Nat, xorN a b = xorN b a</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_zero_is_identity_for_every_a">
<p class="thm-label"><strong>Theorem 1330</strong> (<code>xor_zero_is_identity_for_every_a</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_zero_is_identity_for_every_a.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a : Nat, xorN a 0 = a</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_its_own_inverse_for_every_a_b">
<p class="thm-label"><strong>Theorem 1331</strong> (<code>xor_is_its_own_inverse_for_every_a_b</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_its_own_inverse_for_every_a_b.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b : Nat, xorN (xorN a b) b = a</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves">
<p class="thm-label"><strong>Theorem 1332</strong> (<code>xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_the_sum_of_the_bits_plus_twice_the_xor_of_the_halves.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b : Nat, xorN a b = (a + b) % 2 + 2 * xorN (a / 2) (b / 2)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_associative_below_every_bound">
<p class="thm-label"><strong>Theorem 1333</strong> (<code>xor_is_associative_below_every_bound</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_associative_below_every_bound.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n a b c : Nat, a + b + c ≤ n → xorN (xorN a b) c = xorN a (xorN b c)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_associative_for_every_a_b_c">
<p class="thm-label"><strong>Theorem 1334</strong> (<code>xor_is_associative_for_every_a_b_c</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_associative_for_every_a_b_c.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b c : Nat, xorN (xorN a b) c = xorN a (xorN b c)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-the_nim_sum_is_a_gf2_vector_addition_for_every_a_b_c">
<p class="thm-label"><strong>Theorem 1335</strong> (<code>the_nim_sum_is_a_gf2_vector_addition_for_every_a_b_c</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_the_nim_sum_is_a_gf2_vector_addition_for_every_a_b_c.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b c : Nat, xorN a b = xorN b a ∧ xorN (xorN a b) c = xorN a (xorN b c) ∧ xorN (xorN a b) b = a ∧ xorN a 0 = a</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-a_number_xored_with_itself_is_zero_for_every_a">
<p class="thm-label"><strong>Theorem 1336</strong> (<code>a_number_xored_with_itself_is_zero_for_every_a</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_a_number_xored_with_itself_is_zero_for_every_a.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a : Nat, xorN a a = 0</code></pre>
</div>
<p class="thm-remark">── reflections, from the xor batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── REFLECTIONS</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-xor_is_zero_only_on_equal_arguments_for_every_a_b">
<p class="thm-label"><strong>Theorem 1337</strong> (<code>xor_is_zero_only_on_equal_arguments_for_every_a_b</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_xor_is_zero_only_on_equal_arguments_for_every_a_b.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b : Nat, xorN a b = 0 ↔ a = b</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-nim-the_halves_and_the_low_bit_read_back_from_the_xor_for_every_a_b">
<p class="thm-label"><strong>Theorem 1338</strong> (<code>the_halves_and_the_low_bit_read_back_from_the_xor_for_every_a_b</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_nim_the_halves_and_the_low_bit_read_back_from_the_xor_for_every_a_b.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ a b : Nat, xorN a b / 2 = xorN (a / 2) (b / 2) ∧ xorN a b % 2 = (a + b) % 2</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
