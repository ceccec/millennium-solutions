---
title: "The universal reflection, and where it stops being one"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `reflection.lean`

<p class="paper-src"><code>src/iso/iec-2382-computing/reflection.lean</code> · namespace <code>Reflection</code> · 8 theorems · wing <code>the machine</code></p>

TWO HACKS REMOVED TOGETHER, by the author's order on 2026-09-25. The title was "Theorems", which names
nothing — every file here holds theorems. And the namespace was `MillenniumFloor.Universal`: a namespace
rooted in ANOTHER file's concept, so this file's keys carried a word about the Clay floor while deciding
the ten's complement. It is `Reflection` now, which is what it decides.
The universal property — honestly, and COMPUTED from the sequence.


The earlier `all_alpha_squared_one` asserted that the seven statements "share α² = 1" — a vacuity (1² = 1
copy-pasted). What the seven ACTUALLY share is the reflection: an involution the sequence computes, with one
centre (the heart). That shared structure is real; it is still not a proof of any conjecture. No anchors, no
axioms, every proof `by decide`, no Mathlib.

<div class="thm" id="thm-reflection-universal_reflection_involution">
<p class="thm-label"><strong>Theorem 1419</strong> (<code>universal_reflection_involution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_reflection_involution.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 11).all (fun d =&gt; refl (refl d) == d) ∧ ((List.range 10).filter (fun d =&gt; refl d == d)).length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,10\},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d \land \left|\{\, d \in \{0,\dots,9\} \mid \mathrm{refl}\mathopen{}\left(d\right) = d \,\}\right| = 1</code></pre></details>
</div>
<p class="thm-remark">The universal law, computed: the reflection is a TOTAL involution on every residue, with exactly one shared fixed centre — the structure every one of the seven framings borrows. It is not "α² = 1", and it is not a proof.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 110 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_centre_is_five">
<p class="thm-label"><strong>Theorem 1420</strong> (<code>universal_centre_is_five</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_centre_is_five.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 10).filter (fun d =&gt; refl d == d)) = [5]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \{0,\dots,9\} \mid \mathrm{refl}\mathopen{}\left(d\right) = d \,\} = [5]</code></pre></details>
</div>
<p class="thm-remark">── the centre, NAMED rather than counted ── The theorem above proves there is exactly ONE centre. A count is not an identification: it says a heart exists without saying where it beats. Here it is, computed — the filter returns the singleton [5].</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_pairs_sum_to_ten">
<p class="thm-label"><strong>Theorem 1421</strong> (<code>universal_pairs_sum_to_ten</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_pairs_sum_to_ten.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>d</mi><mo>+</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>=</mo><mn>10</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 11).all (fun d =&gt; d + refl d == 10)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,10\},\; d + \mathrm{refl}\mathopen{}\left(d\right) = 10</code></pre></details>
</div>
<p class="thm-remark">── what the reflection conserves ── Every residue and its reflection sum to ten. This is the reason there is exactly one centre: a fixed point needs d + d = 10, and 10 is even, so exactly one d satisfies it. The conservation law is the whole structure.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 11 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_reflection_reverses_the_domain">
<p class="thm-label"><strong>Theorem 1422</strong> (<code>universal_reflection_reverses_the_domain</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_reflection_reverses_the_domain.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>refl</mi><mo>[</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mi>reverse</mi><mo>(</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>10</mn><mo>}</mo></mrow><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 11).map refl = (List.range 11).reverse</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{refl}[\{0,\dots,10\}] = \operatorname{reverse}\left(\{0,\dots,10\}\right)</code></pre></details>
</div>
<p class="thm-remark">── the reflection is a bijection of the domain, computed as an ordering ── Stronger than the involution and cheaper than a permutation argument: the image of 0…10 under the reflection IS 0…10 read backwards. Nothing is lost and nothing is repeated, and the witness is an equation.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 121 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_reflection_is_not_an_involution_above_ten">
<p class="thm-label"><strong>Theorem 1423</strong> (<code>universal_reflection_is_not_an_involution_above_ten</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_reflection_is_not_an_involution_above_ten.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mrow><mi>k</mi><mo>+</mo><mn>11</mn></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 10).map (fun k =&gt; k + 11)).all (fun d =&gt; ¬ (refl (refl d) == d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{\, k + 11 \mid k \in \{0,\dots,9\} \,\},\; \lnot \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">── WHERE IT STOPS. The involution is not universal over ℕ, and the boundary is stated, not hidden ── Natural subtraction truncates: above ten, `refl d` is 0 and `refl (refl d)` is 10 for every input. So the involution holds on 0…10 and FAILS at every residue above it. The first theorem says `List.range 11` and means it. A boundary you can compute is a boundary you have not overclaimed past.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_z9_reflection_permutes_the_units">
<p class="thm-label"><strong>Theorem 1424</strong> (<code>universal_z9_reflection_permutes_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_z9_reflection_permutes_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mrow><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>∣</mo><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>8</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>([1, 2, 4, 5, 7, 8].map (fun d =&gt; (9 - d) % 9)) = [8, 7, 5, 4, 2, 1]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, 9 - d \bmod 9 \mid d \in [1,\,2,\,4,\,5,\,7,\,8] \,\} = [8,\,7,\,5,\,4,\,2,\,1]</code></pre></details>
</div>
<p class="thm-remark">── the vortex has its OWN reflection, and it is a different map ── ℤ/9 reflects by d ↦ (9 − d) mod 9. That map permutes the six units among themselves. The millennium reflection does NOT stay inside them: it sends the unit 1 to 9, which is not a unit. Two reflections, two domains.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_millennium_reflection_escapes_the_units">
<p class="thm-label"><strong>Theorem 1425</strong> (<code>universal_millennium_reflection_escapes_the_units</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_millennium_reflection_escapes_the_units.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>u</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>u</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ([1, 2, 4, 5, 7, 8].all (fun u =&gt; [1, 2, 4, 5, 7, 8].contains (refl u)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall u \in [1,\,2,\,4,\,5,\,7,\,8],\; \mathrm{refl}\mathopen{}\left(u\right) \in [1,\,2,\,4,\,5,\,7,\,8]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-reflection-universal_reflection_is_the_vortex_reflection_shifted">
<p class="thm-label"><strong>Theorem 1426</strong> (<code>universal_reflection_is_the_vortex_reflection_shifted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reflection_universal_reflection_is_the_vortex_reflection_shifted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mn>10</mn><mo>-</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mrow><mrow><mrow><mn>9</mn><mo>-</mo><mi>d</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>+</mo><mn>1</mn></mrow><mo>mod</mo><mn>9</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 10).all (fun d =&gt; (10 - d) % 9 == ((9 - d) % 9 + 1) % 9)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,9\},\; 10 - d \bmod 9 = 9 - d \bmod 9 + 1 \bmod 9</code></pre></details>
</div>
<p class="thm-remark">── and yet they are the SAME map, shifted by one ── This is what the singleton family was standing on alone. Reduced mod nine, the millennium reflection is the vortex reflection plus one, at every residue 0…9. The shared structure the seven framings borrow is not a separate object: it is ℤ/9's own involution, displaced by a single step. Still not a proof of any conjecture.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10 cases. <span class="qed">□</span></p>

</div>
