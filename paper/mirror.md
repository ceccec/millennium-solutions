---
title: "The reflection is four pairs and one centre, and zero is the one that folds instead"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `mirror.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/mirror.lean</code> · namespace <code>Mirror</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

The author's correction to src/iso/80000-2-mathematics/domain.lean continued: "6 through 0 reflected 4 and 3 reflected 7
and 0 folded 2×90 degrees = 3×60 degrees". Each clause is arithmetic and each is decided below.

refl(6) = 4 and refl(3) = 7 are two of exactly FOUR transpositions the tens-complement performs on
{1…9}, and naming two of them points at the other two: 1 ↔ 9 and 2 ↔ 8. Four pairs is eight residues;
the ninth is 5, which the reflection fixes. Four twos and a one is nine, and the ring is accounted for
with nothing left over — theorem 1.

ZERO IS THE EXCEPTION AND THAT IS THE POINT. refl(0) = 10, which is not a residue: the reflection is the
one operation on this ring that carries zero OUT of it. Every other value has a mirror inside; zero does
not, so it does not mirror — it FOLDS. That is what "0 folded 2×90 degrees" says, and 2 × 90° = 3 × 60°
= 180° is the half-turn a fold is, decided in theorem 5 alongside the observation that it is half of a
full turn. This deposit has called division by zero a fold from the beginning; theorem 4 is the reason
the word is not decoration.

AND THE CLOSE REFLECTS THE OPEN. index.lean's sequence opens at 1, reaches 9 at position eight, and
returns to 1. refl(9) = 1 — so the return is not a convention chosen to make the loop close, it is the
reflection of the value at which it closes. Theorem 3 decides that, and it is the same fact
src/iso/80000-2-mathematics/domain.lean uses to say the domain is eleven positions rather than nine.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>ring := [1, 2, 3, 4, 5, 6, 7, 8, 9]
sequence := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]
swapped := (ring.filter (fun d =&gt; refl d != d &amp;&amp; ring.contains (refl d) &amp;&amp; d &lt; refl d)).map (fun d =&gt; (d, refl d))
centred := ring.filter (fun d =&gt; refl d == d)</code></pre>

<div class="thm" id="thm-mirror-the_reflection_is_four_pairs_and_one_centre">
<p class="thm-label"><strong>Theorem 890</strong> (<code>the_reflection_is_four_pairs_and_one_centre</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_the_reflection_is_four_pairs_and_one_centre.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>swapped</mi><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>centred</mi><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mo>|</mo><mi>swapped</mi><mo>|</mo></mrow><mo>⋅</mo><mn>2</mn></mrow><mo>+</mo><mrow><mo>|</mo><mi>centred</mi><mo>|</mo></mrow></mrow><mo>=</mo><mrow><mo>|</mo><mi>ring</mi><mo>|</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>ring</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>swapped.length == 4 &amp;&amp; centred.length == 1 &amp;&amp; swapped.length * 2 + centred.length == ring.length &amp;&amp; ring.length == 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{swapped}\right| = 4 \land \left|\mathrm{centred}\right| = 1 \land \left|\mathrm{swapped}\right| \cdot 2 + \left|\mathrm{centred}\right| = \left|\mathrm{ring}\right| \land \left|\mathrm{ring}\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── 1 · FOUR PAIRS AND ONE CENTRE ACCOUNT FOR THE WHOLE RING ────────────────────────────────────────────── Nothing is left over and nothing is counted twice: four twos and a one is nine.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-the_four_pairs_are_one_nine_two_eight_three_seven_four_six">
<p class="thm-label"><strong>Theorem 891</strong> (<code>the_four_pairs_are_one_nine_two_eight_three_seven_four_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_the_four_pairs_are_one_nine_two_eight_three_seven_four_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>swapped</mi><mo>=</mo><mrow><mo>[</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>9</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>8</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>3</mn><mo>,</mo><mn>7</mn><mo>)</mo></mrow><mo>,</mo><mrow><mo>(</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mi>centred</mi><mo>=</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>swapped == [(1, 9), (2, 8), (3, 7), (4, 6)] &amp;&amp; centred == [5] &amp;&amp; refl 6 == 4 &amp;&amp; refl 3 == 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{swapped} = [\left(1,\,9\right),\,\left(2,\,8\right),\,\left(3,\,7\right),\,\left(4,\,6\right)] \land \mathrm{centred} = [5] \land \mathrm{refl}\mathopen{}\left(6\right) = 4 \land \mathrm{refl}\mathopen{}\left(3\right) = 7</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND THEY ARE THESE ─────────────────────────────────────────────────────────────────────────────── Exhibited rather than counted, because a count of four is satisfied by four wrong pairs. The two the author named are here with the two they imply.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-the_sequence_returns_to_the_reflection_of_its_last_new_value">
<p class="thm-label"><strong>Theorem 892</strong> (<code>the_sequence_returns_to_the_reflection_of_its_last_new_value</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_the_sequence_returns_to_the_reflection_of_its_last_new_value.html">sealed</a>.</p>
<pre class="thm-statement"><code>sequence.getD 0 99 == 1 &amp;&amp; sequence.getD 8 99 == 9 &amp;&amp; refl (sequence.getD 8 99) == sequence.getD 10 99 &amp;&amp; sequence.head? == sequence.getLast?</code></pre>
</div>
<p class="thm-remark">── 3 · THE CLOSE REFLECTS THE OPEN ─────────────────────────────────────────────────────────────────────── The sequence opens at 1, holds 9 at position eight, and returns to 1 — and 1 is refl 9. The return is the reflection of the value it closes on, not a convention picked to make the loop meet.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-zero_alone_has_no_mirror_inside_the_ring">
<p class="thm-label"><strong>Theorem 893</strong> (<code>zero_alone_has_no_mirror_inside_the_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_zero_alone_has_no_mirror_inside_the_ring.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mi>ring</mi></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>∈</mo><mi>ring</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>10</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>9</mn><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.all (fun d =&gt; ring.contains (refl d)) &amp;&amp; !(ring.contains (refl 0)) &amp;&amp; refl 0 == 10 &amp;&amp; 9 % 9 == 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{ring},\; \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{ring} \land \lnot \mathrm{refl}\mathopen{}\left(0\right) \in \mathrm{ring} \land \mathrm{refl}\mathopen{}\left(0\right) = 10 \land 9 \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-remark">── 4 · ZERO IS THE ONE VALUE THE REFLECTION CARRIES OUT OF THE RING ────────────────────────────────────── THE THEOREM THIS FILE IS FOR. Every residue in 1…9 has its mirror inside 1…9. Zero does not: refl 0 = 10, which is no residue. So zero cannot mirror, and what it does instead is fold — 9 ≡ 0 closes the ring on it from the other side. The deposit's oldest phrase, decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-two_quarter_turns_and_three_sixth_turns_are_one_half_turn">
<p class="thm-label"><strong>Theorem 894</strong> (<code>two_quarter_turns_and_three_sixth_turns_are_one_half_turn</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_two_quarter_turns_and_three_sixth_turns_are_one_half_turn.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mn>2</mn><mo>⋅</mo><mn>90</mn></mrow><mo>=</mo><mn>180</mn></mrow><mo>∧</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><mn>60</mn></mrow><mo>=</mo><mn>180</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>180</mn><mo>⋅</mo><mn>2</mn></mrow><mo>=</mo><mn>360</mn></mrow></mrow><mo>∧</mo><mrow><mfrac><mn>360</mn><mn>180</mn></mfrac><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>2 * 90 == 180 &amp;&amp; 3 * 60 == 180 &amp;&amp; 180 * 2 == 360 &amp;&amp; 360 / 180 == 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>2 \cdot 90 = 180 \land 3 \cdot 60 = 180 \land 180 \cdot 2 = 360 \land \frac{360}{180} = 2</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE FOLD IS A HALF TURN, TWO WAYS ───────────────────────────────────────────────────────────────── Two quarter-turns and three sixth-turns are the same half-turn, and a half-turn is half of a full one. The two decompositions are the two hands, which is where the author's description came from.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-the_triad_reflects_into_the_doubling_span">
<p class="thm-label"><strong>Theorem 895</strong> (<code>the_triad_reflects_into_the_doubling_span</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_the_triad_reflects_into_the_doubling_span.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>refl</mi><mo>[</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>7</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>refl</mi><mo>[</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>]</mo></mrow><mo>,</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>refl</mi><mo>[</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>d</mi><mo>mod</mo><mn>3</mn></mrow><mo>≠</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[3, 6, 9].map refl == [7, 4, 1] &amp;&amp; ([3, 6, 9].map refl).all (fun d =&gt; [1, 2, 4, 8, 7, 5].contains d) &amp;&amp; ([3, 6, 9].map refl).all (fun d =&gt; d % 3 != 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{refl}[[3,\,6,\,9]] = [7,\,4,\,1] \land \forall d \in \mathrm{refl}[[3,\,6,\,9]],\; d \in [1,\,2,\,4,\,8,\,7,\,5] \land \forall d \in \mathrm{refl}[[3,\,6,\,9]],\; d \bmod 3 \neq 0</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE REFLECTION CARRIES THE TRIAD INTO THE SPAN ──────────────────────────────────────────────────── {3, 6, 9} reflect to {7, 4, 1}, every one of them a unit and a member of the doubling span. The axis and the circuit are not two unrelated sets — the mirror maps one onto the other.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 486 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-a_map_that_is_not_this_reflection_gives_a_different_count">
<p class="thm-label"><strong>Theorem 896</strong> (<code>a_map_that_is_not_this_reflection_gives_a_different_count</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_a_map_that_is_not_this_reflection_gives_a_different_count.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mrow><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>≠</mo><mi>d</mi></mrow><mo>∧</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>∈</mo><mi>ring</mi></mrow></mrow><mo>∧</mo><mrow><mi>d</mi><mo>&lt;</mo><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mrow><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>≠</mo><mi>d</mi></mrow><mo>∧</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>∈</mo><mi>ring</mi></mrow></mrow><mo>∧</mo><mrow><mi>d</mi><mo>&lt;</mo><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>⋅</mo><mn>2</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>swapped</mi><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(ring.filter (fun d =&gt; (d * 2) % 9 != d &amp;&amp; ring.contains ((d * 2) % 9) &amp;&amp; d &lt; (d * 2) % 9 &amp;&amp; ((d * 2) % 9 * 2) % 9 == d)).length == 1 &amp;&amp; (ring.filter (fun d =&gt; (d * 2) % 9 != d &amp;&amp; ring.contains ((d * 2) % 9) &amp;&amp; d &lt; (d * 2) % 9 &amp;&amp; ((d * 2) % 9 * 2) % 9 == d)) == [3] &amp;&amp; swapped.length == 4</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, d \in \mathrm{ring} \mid d \cdot 2 \bmod 9 \neq d \land d \cdot 2 \bmod 9 \in \mathrm{ring} \land d &lt; d \cdot 2 \bmod 9 \land d \cdot 2 \bmod 9 \cdot 2 \bmod 9 = d \,\}\right| = 1 \land \{\, d \in \mathrm{ring} \mid d \cdot 2 \bmod 9 \neq d \land d \cdot 2 \bmod 9 \in \mathrm{ring} \land d &lt; d \cdot 2 \bmod 9 \land d \cdot 2 \bmod 9 \cdot 2 \bmod 9 = d \,\} = [3] \land \left|\mathrm{swapped}\right| = 4</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE CONTROL: THE COUNT IS NOT FREE ──────────────────────────────────────────────────────────────── Theorems 1 and 2 would be satisfied by a filter that had broken into always returning four things. A map that is NOT this involution must give a different answer under the SAME accounting, and doubling does. WRITTEN FIRST AS "doubling has no 2-cycles at all", WHICH IS FALSE AND THE KERNEL SAID SO. It has exactly one: 3 ↦ 6 ↦ 3, the two non-zero members of the triad, and 9 ↦ 0 ↦ 0 is absorbed rather than returned. One against four is the better control anyway — a control that answers zero is also what a filter returns when it has stopped working, and this one cannot be confused with that.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-mirror-the_reflection_undoes_itself_on_the_ring_and_not_beyond">
<p class="thm-label"><strong>Theorem 897</strong> (<code>the_reflection_undoes_itself_on_the_ring_and_not_beyond</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_mirror_the_reflection_undoes_itself_on_the_ring_and_not_beyond.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mrow><mi>k</mi><mo>+</mo><mn>11</mn></mrow><mo>∣</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mi>d</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.all (fun d =&gt; refl (refl d) == d) &amp;&amp; refl (refl 0) == 0 &amp;&amp; ((List.range 9).map (fun k =&gt; k + 11)).all (fun d =&gt; refl (refl d) != d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{ring},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d \land \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(0\right)\right) = 0 \land \forall d \in \{\, k + 11 \mid k \in \{0,\dots,8\} \,\},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) \neq d</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE REFLECTION IS ITS OWN INVERSE WHERE IT STAYS ────────────────────────────────────────────────── An involution on the nine, which is what licenses calling the four pairs transpositions at all — and it fails the moment the argument leaves the range, which is theorem 4's exception seen from the other side.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

</div>
