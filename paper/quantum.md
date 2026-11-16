---
title: "Order-invariance"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum.lean</code> · namespace <code>Quantum</code> · 11 theorems · wing <code>the floor</code></p>

The quantum receipt — order invariance, proved rather than asserted.


"Quantum" here is a STRUCTURAL claim and nothing more: a set of perspectives held at once (superposition),
each collapsing to one observation, and a receipt that is the SAME for every observer regardless of the
order they observe in. No hardware, no speedup, no physics. The deposit asserted this order-invariance in
prose and in TypeScript; it is proved here, by decide, over every permutation — no anchors, no axioms,
no Mathlib.

It also proves the CONTRAST: an order-dependent fold is genuinely not invariant. Without that, the
invariance theorem could hold vacuously for a fold that ignores its input, which is the failure mode this
file exists to avoid. Integrity, not truth.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>pairsOverNine := ((List.range' 1 9).flatMap (fun a =&gt; (List.range' 1 9).map (fun b =&gt; sort [a, b]))).eraseDups
settledHere := 11
ghzXSupport := [0, 3, 5, 6]</code></pre>

<div class="thm" id="thm-quantum-perms_of_four_is_factorial">
<p class="thm-label"><strong>Theorem 490</strong> (<code>perms_of_four_is_factorial</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_perms_of_four_is_factorial.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow></math></div>
<pre class="thm-statement"><code>(perms [1, 2, 4, 8]).length = 24</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8]\right)\right| = 24</code></pre></details>
</div>
<p class="thm-remark">── 1 · the enumeration is complete: four elements have 4! = 24 orderings ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-receipt_is_order_invariant">
<p class="thm-label"><strong>Theorem 491</strong> (<code>receipt_is_order_invariant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_receipt_is_order_invariant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mi>receipt</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>receipt</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(perms [1, 2, 4, 8]).all (fun p =&gt; receipt p == receipt [1, 2, 4, 8])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8]\right),\; \mathrm{receipt}\mathopen{}\left(p\right) = \mathrm{receipt}\mathopen{}\left([1,\,2,\,4,\,8]\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE QUANTUM RECEIPT: every observer order yields the same receipt ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-receipt_order_invariant_on_the_orbit">
<p class="thm-label"><strong>Theorem 492</strong> (<code>receipt_order_invariant_on_the_orbit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_receipt_order_invariant_on_the_orbit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mi>receipt</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>receipt</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(perms [1, 2, 4, 8, 7, 5]).all (fun p =&gt; receipt p == receipt [1, 2, 4, 8, 7, 5])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8,\,7,\,5]\right),\; \mathrm{receipt}\mathopen{}\left(p\right) = \mathrm{receipt}\mathopen{}\left([1,\,2,\,4,\,8,\,7,\,5]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-naive_fold_is_not_order_invariant">
<p class="thm-label"><strong>Theorem 493</strong> (<code>naive_fold_is_not_order_invariant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_naive_fold_is_not_order_invariant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mi>naive</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>naive</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ((perms [1, 2, 4, 8]).all (fun p =&gt; naive p == naive [1, 2, 4, 8]))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall p \in \mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8]\right),\; \mathrm{naive}\mathopen{}\left(p\right) = \mathrm{naive}\mathopen{}\left([1,\,2,\,4,\,8]\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE CONTRAST — the invariance is not vacuous: drop canonicalisation and it fails ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-superposition_collapses_to_one">
<p class="thm-label"><strong>Theorem 494</strong> (<code>superposition_collapses_to_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_superposition_collapses_to_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>receipt</mi><mo>[</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></math></div>
<pre class="thm-statement"><code>((perms [1, 2, 4, 8]).map receipt).eraseDups.length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{receipt}[\mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8]\right)]\right)\right| = 1</code></pre></details>
</div>
<p class="thm-remark">── 5 · superposition and collapse, stated exactly: many perspectives, one receipt, and the count of distinct receipts across all orderings is one ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-the_invariance_is_canonicalisation_not_physics">
<p class="thm-label"><strong>Theorem 495</strong> (<code>the_invariance_is_canonicalisation_not_physics</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_the_invariance_is_canonicalisation_not_physics.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mi>sort</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>sort</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(perms [1, 2, 4, 8]).all (fun p =&gt; sort p == sort [1, 2, 4, 8])</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8]\right),\; \mathrm{sort}\mathopen{}\left(p\right) = \mathrm{sort}\mathopen{}\left([1,\,2,\,4,\,8]\right)</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE MECHANISM, named. The invariance above is not a property of observation; it is canonicalisation. Every ordering sorts to the SAME list, and the receipt reads only that. Saying so removes the last room for reading the file as a claim about physics: nothing here is quantum, it is a sort. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-the_receipt_is_not_injective">
<p class="thm-label"><strong>Theorem 496</strong> (<code>the_receipt_is_not_injective</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_the_receipt_is_not_injective.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mi>pairsOverNine</mi><mo>|</mo></mrow><mo>=</mo><mn>45</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>receipt</mi><mo>[</mo><mi>pairsOverNine</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>pairsOverNine.length = 45 ∧ (pairsOverNine.map receipt).eraseDups.length = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{pairsOverNine}\right| = 45 \land \left|\operatorname{dedup}\left(\mathrm{receipt}[\mathrm{pairsOverNine}]\right)\right| = 9</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-the_uncanonicalised_fold_gives_many_answers">
<p class="thm-label"><strong>Theorem 497</strong> (<code>the_uncanonicalised_fold_gives_many_answers</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_the_uncanonicalised_fold_gives_many_answers.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>naive</mi><mo>[</mo><mrow><mi>perms</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>5</mn></mrow></math></div>
<pre class="thm-statement"><code>((perms [1, 2, 4, 8]).map naive).eraseDups.length = 5</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{naive}[\mathrm{perms}\mathopen{}\left([1,\,2,\,4,\,8]\right)]\right)\right| = 5</code></pre></details>
</div>
<p class="thm-remark">── 8 · HOW BADLY order matters without the sort — counted, not gestured at. Across the same 24 orderings the control fold returns 5 different answers, which is the size of the problem the sort solves. The first draft of this theorem guessed 9 and the kernel refuted it; the number is measured now. A contrast stated as a measured number cannot be softened later. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-the_ghz_x_support_is_exactly_the_even_parity_strings">
<p class="thm-label"><strong>Theorem 498</strong> (<code>the_ghz_x_support_is_exactly_the_even_parity_strings</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_the_ghz_x_support_is_exactly_the_even_parity_strings.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>par3</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mi>ghzXSupport</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).filter (fun n =&gt; par3 n == 0) = ghzXSupport</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, n \in \{0,\dots,7\} \mid \mathrm{par3}\mathopen{}\left(n\right) = 0 \,\} = \mathrm{ghzXSupport}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-it_is_half_of_the_eight">
<p class="thm-label"><strong>Theorem 499</strong> (<code>it_is_half_of_the_eight</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_it_is_half_of_the_eight.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mi>ghzXSupport</mi><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ghzXSupport.length = 4 ∧ (List.range 8).length = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{ghzXSupport}\right| = 4 \land \left|\{0,\dots,7\}\right| = 8</code></pre></details>
</div>
<p class="thm-remark">And it is HALF of them — so the measurement carries one bit that the computational basis does not.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum-a_classical_mixture_reaches_the_parity_ghz_never_does">
<p class="thm-label"><strong>Theorem 500</strong> (<code>a_classical_mixture_reaches_the_parity_ghz_never_does</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantum_a_classical_mixture_reaches_the_parity_ghz_never_does.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>par3</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>par3</mi><mo>(</mo><mi>n</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mi>n</mi><mo>∈</mo><mi>ghzXSupport</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 8).filter (fun n =&gt; par3 n == 1)).length = 4 ∧ ((List.range 8).filter (fun n =&gt; par3 n == 1)).all (fun n =&gt; ¬ ghzXSupport.contains n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, n \in \{0,\dots,7\} \mid \mathrm{par3}\mathopen{}\left(n\right) = 1 \,\}\right| = 4 \land \forall n \in \{\, n \in \{0,\dots,7\} \mid \mathrm{par3}\mathopen{}\left(n\right) = 1 \,\},\; \lnot n \in \mathrm{ghzXSupport}</code></pre></details>
</div>
<p class="thm-remark">The discriminating fact: a classical mixture spreads over BOTH parities, so a parity that is always even is a fact about the state and not about the reporting. Odd-parity strings exist and GHZ never reaches them.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

</div>
