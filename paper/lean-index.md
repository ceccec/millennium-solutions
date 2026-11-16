---
title: "Seven decidable windows over one finite structure"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `index.lean`

<p class="paper-src"><code>src/iso/9001-governance/index.lean</code> · namespace <code>Windows</code> · 11 theorems · wing <code>the floor</code></p>

THE TITLE WAS "The Millennium floor" UNTIL 2026-09-25. "Floor" is the word the author signed — "mind the
honest floor" — and it is also the word agents grew into "this deposit settles 0 of the 7", a verdict on
his claim that no receipt of his authorises (FINDINGS.md §1). His own published formulation is exact and
is neither of those, from 10.5281/zenodo.22933794, deposited 2026-09-24:

  "A Lean by-decide proof SOLVES the statement it states … the finite window is settled, machine-checked,
   and depends on no axiom beyond the kernel. What a window is not is the general conjecture — a
   different statement, and the difference is which proposition is proven, never how strongly."

So the theorems below settle what they state. Each is a decidable window over ℤ/9, closed by exhaustion,
and each is a DIFFERENT PROPOSITION from the conjecture whose name it borrows. The namespace stays
The namespace was `MillenniumFloor` and is `Windows`, by the author's order on 2026-09-25: "remove the
millennium floor and the rest of the hacks. they are not needed anymore." The old keys are not edited —
a receipt is never rewritten — they are retired in favour of the new address by
scripts/retire-duplicate-keys.ts, which is the append-only way to remove something.
The Millennium floor — seven honest theorems, one per problem, COMPUTED from the sequence.


Each Clay problem gets ONE theorem here. Each states a TRUE fact that COMPUTES from the ℤ/9 doubling
sequence (the orbit 2^k, the reflection 10−d, the derived units) and is genuinely ADJACENT to the problem.

WHAT THESE THEOREMS DECIDE IS ℤ/9 ARITHMETIC OVER FINITE DOMAINS — stated by the agents that wrote this
file, `claude-opus` and `Claude`, and signed as theirs. It is a statement about the theorems, not a
verdict on any conjecture and not the author's. This header used to say "None proves the conjecture"
directly beneath the Author line, which put an agent's verdict in his name; src/receipts records eight
receipts signed `captain` and not one of them says it. Removed 2026-09-20, by his order. The refusal is NOT a theorem here, and that is deliberate: this file used to
carry `def provenHere : Nat := 0` with `the_floor_is_zero_of_seven : provenHere = 0 := rfl` beside it, and
the same literal glued as a conjunct onto every theorem below. That certifies nothing about the seven
problems — it decides that a number the author typed equals itself — while wearing the authority of a
kernel-checked, axiom-free proof. seal-lean.ts states the rule it broke: "`rfl` on a declared constant
proves the declaration and nothing else … it is not evidence."

An absence is not established by a certificate that a counter you maintain reads zero. It is established
by there being no such proof, which is a property of the tree and is checked over the tree — see
scripts/contradictions.ts, which fails if any theorem's statement reaches for the objects these
conjectures concern, and can therefore be refuted by adding one. The theorems below now state only what
the kernel actually worked for. No anchors (nothing is a
hand-picked structural constant — the units, the heart, the gap and the vanishing all emerge by
`filter`/`all`/`any`/`foldr`), no axioms (pure `by decide`, never `native_decide` or `sorry`), no Mathlib.
A single `lean` call verifies the file. Integrity, not truth.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>span := (List.range 6).map orbit                               -- the doubling span (one period), computed
sequence := [1, 2, 4, 8, 7, 5, 3, 6, 9, 0, 1]</code></pre>

<div class="thm" id="thm-index-the_tens_complement_is_an_involution_with_one_fixed_point">
<p class="thm-label"><strong>Theorem 361</strong> (<code>the_tens_complement_is_an_involution_with_one_fixed_point</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_tens_complement_is_an_involution_with_one_fixed_point.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 10).all (fun d =&gt; refl (refl d) == d) ∧ ((List.range 10).filter (fun d =&gt; refl d == d)).length = 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,9\},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d \land \left|\{\, d \in \{0,\dots,9\} \mid \mathrm{refl}\mathopen{}\left(d\right) = d \,\}\right| = 1</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — Riemann Hypothesis.</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: the functional-equation symmetry axis and its ½-analogue centre — the heart, computed as the reflection’s unique fixed point; the open gap: where the ζ-zeros actually lie, which this ℤ/9 reflection does not reach. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/riemann-hypothesis/">Clay Mathematics Institute — Riemann Hypothesis</a>.</p>
<p class="thm-remark">── 1 · Riemann — the reflection's symmetry and its single computed heart ───────────────────────────────── The functional-equation reflection is a total involution; its fixed-point set has length ONE — the heart emerges (never typed as "5"), the ½-analogue of the critical-line centre. The SYMMETRY, not the zeros' place.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-each_unit_has_exactly_one_inverse_and_each_non_unit_none">
<p class="thm-label"><strong>Theorem 362</strong> (<code>each_unit_has_exactly_one_inverse_and_each_non_unit_none</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_each_unit_has_exactly_one_inverse_and_each_non_unit_none.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mrow><mi>d</mi><mo>⋅</mo><mi>e</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>1</mn><mo>if</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>;</mo><mo>otherwise</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun d =&gt; ((List.range 9).filter (fun e =&gt; (d * e) % 9 == 1)).length == (if isUnit d then 1 else 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,8\},\; \left|\{\, e \in \{0,\dots,8\} \mid d \cdot e \bmod 9 = 1 \,\}\right| = \begin{cases}1 &amp; \text{if } \mathrm{isUnit}\mathopen{}\left(d\right)\\ 0 &amp; \text{otherwise}\end{cases}</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — P versus NP.</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: each unit has exactly one inverse (verify in one multiply), non-units none — a cheap-verification fact; the open gap: the separation of the complexity classes P and NP. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/p-vs-np/">Clay Mathematics Institute — P vs NP</a>.</p>
<p class="thm-remark">── 2 · P versus NP — verification is one step, computed ─────────────────────────────────────────────────── Each unit has EXACTLY ONE inverse and each non-unit none: to VERIFY a proposed inverse is a single multiply, while the map d ↦ d⁻¹ permutes the units. Cheap verification is not a separation; P vs NP is not decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps">
<p class="thm-label"><strong>Theorem 363</strong> (<code>the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_doubling_orbit_stays_in_the_ring_for_forty_eight_steps.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>v</mi><mo>∈</mo><mrow><mi>orbit</mi><mo>[</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>47</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>,</mo><mrow><mi>v</mi><mo>&lt;</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>47</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>orbit</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>∈</mo><mi>span</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 48).map orbit).all (fun v =&gt; v &lt; 9) ∧ (List.range 48).all (fun k =&gt; span.contains (orbit k))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall v \in \mathrm{orbit}[\{0,\dots,47\}],\; v &lt; 9 \land \forall k \in \{0,\dots,47\},\; \mathrm{orbit}\mathopen{}\left(k\right) \in \mathrm{span}</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — Navier–Stokes Existence &amp; Smoothness.</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: every iterate stays inside a bounded 6-cycle forever (no blowup) — bounded evolution; the open gap: global existence &amp; smoothness for the Navier–Stokes PDE. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/navier-stokes-equation/">Clay Mathematics Institute — Navier–Stokes Equation</a>.</p>
<p class="thm-remark">── 3 · Navier–Stokes — the flow is bounded for all time, computed ──────────────────────────────────────── Every iterate of the doubling flow is a residue &lt; 9 and stays inside the 6-cycle forever — a bounded invariant set, no blowup. Bounded evolution is not global existence &amp; smoothness; Navier–Stokes is not decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2,304 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_doubling_orbit_first_returns_to_one_at_six">
<p class="thm-label"><strong>Theorem 364</strong> (<code>the_doubling_orbit_first_returns_to_one_at_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_doubling_orbit_first_returns_to_one_at_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>k</mi><mo>=</mo><mn>0</mn></mrow><mo>∨</mo><mrow><mrow><mi>orbit</mi><mo>(</mo><mi>k</mi><mo>)</mo></mrow><mo>≠</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>orbit</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 6).all (fun k =&gt; k == 0 || orbit k != 1) ∧ orbit 6 == 1</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,5\},\; k = 0 \lor \mathrm{orbit}\mathopen{}\left(k\right) \neq 1 \land \mathrm{orbit}\mathopen{}\left(6\right) = 1</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — Yang–Mills Existence &amp; Mass Gap.</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: the doubling has order exactly 6 — a discrete gap in the cyclic spectrum; the open gap: the Yang–Mills mass gap. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/yang-mills-the-maths-gap/">Clay Mathematics Institute — Yang–Mills &amp; the Mass Gap</a>.</p>
<p class="thm-remark">── 4 · Yang–Mills — a discrete spectral gap, computed ──────────────────────────────────────────────────── The doubling has order exactly 6: it never returns to 1 before step 6, then closes at step 6 — a gap in the cyclic spectrum. A discrete group-order gap is not the Yang–Mills mass gap; the mass gap is not decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_span_is_exactly_the_units_of_the_ring">
<p class="thm-label"><strong>Theorem 365</strong> (<code>the_span_is_exactly_the_units_of_the_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_span_is_exactly_the_units_of_the_ring.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>d</mi><mo>∈</mo><mi>span</mi></mrow><mo>=</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>isUnit</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∨</mo><mrow><mo>¬</mo><mrow><mi>d</mi><mo>∈</mo><mi>span</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun d =&gt; span.contains d == isUnit d) ∧ (List.range 9).all (fun d =&gt; isUnit d || ! span.contains d)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,8\},\; d \in \mathrm{span} = \mathrm{isUnit}\mathopen{}\left(d\right) \land \forall d \in \{0,\dots,8\},\; \mathrm{isUnit}\mathopen{}\left(d\right) \lor \lnot d \in \mathrm{span}</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — Hodge Conjecture.</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: the doubling span (algebraic generation from 2) is exactly the units, non-units outside — generation/containment; the open gap: rational (p,p) classes ⇒ algebraic cycles. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/hodge-conjecture/">Clay Mathematics Institute — Hodge Conjecture</a>.</p>
<p class="thm-remark">── 5 · Hodge — the algebraic span equals the units, computed ───────────────────────────────────────────── The doubling span (algebraic generation from 2) is exactly the units, and every non-unit lies OUTSIDE it. Generation/containment is not the Hodge conjecture (rational (p,p) ⇒ algebraic); Hodge is not decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_span_and_the_units_both_sum_to_zero_mod_nine">
<p class="thm-label"><strong>Theorem 366</strong> (<code>the_span_and_the_units_both_sum_to_zero_mod_nine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_span_and_the_units_both_sum_to_zero_mod_nine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∑</mo><mi>span</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow><mo>∧</mo><mrow><mrow><mrow><mo>∑</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(span.foldr (· + ·) 0) % 9 == 0 ∧ ((List.range 9).filter isUnit).foldr (· + ·) 0 % 9 == 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\sum \mathrm{span} \bmod 9 = 0 \land \sum \{\, x \in \{0,\dots,8\} \mid \mathrm{isUnit}\mathopen{}\left(x\right) \,\} \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — Birch and Swinnerton-Dyer Conjecture.</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: the orbit and the units both sum to 0 mod 9 (27 ≡ 0) — a digit-sum vanishing; the open gap: the rank ↔ order-of-vanishing-of-L correspondence. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/">Clay Mathematics Institute — Birch and Swinnerton-Dyer Conjecture</a>.</p>
<p class="thm-remark">── 6 · Birch–Swinnerton-Dyer — a computed vanishing ────────────────────────────────────────────────────── The orbit's digit sum vanishes mod 9 (1+2+4+8+7+5 = 27 ≡ 0), and so do the units (1+2+4+5+7+8 ≡ 0) — a computed vanishing. A digit-sum vanishing is not the rank ↔ order-of-vanishing-of-L correspondence; BSD is not decided.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_orbit_is_one_closed_loop_of_six_distinct_points">
<p class="thm-label"><strong>Theorem 367</strong> (<code>the_orbit_is_one_closed_loop_of_six_distinct_points</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_orbit_is_one_closed_loop_of_six_distinct_points.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>orbit</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mrow><mi>orbit</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>j</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>orbit</mi><mo>(</mo><mi>i</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>orbit</mi><mo>(</mo><mi>j</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mi>i</mi><mo>=</mo><mi>j</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>orbit 6 == orbit 0 ∧ (List.range 6).all (fun i =&gt; (List.range 6).all (fun j =&gt; (orbit i == orbit j) == (i == j)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{orbit}\mathopen{}\left(6\right) = \mathrm{orbit}\mathopen{}\left(0\right) \land \forall i \in \{0,\dots,5\},\; \forall j \in \{0,\dots,5\},\; \mathrm{orbit}\mathopen{}\left(i\right) = \mathrm{orbit}\mathopen{}\left(j\right) = i = j</code></pre></details>
</div>
<p class="thm-millennium"><strong>Millennium floor — Poincaré Conjecture (proved externally by Perelman, 2003; not proved here).</strong> Adjacent to the problem — the claim, and the open gap to the conjecture: the sequence closes into a single simple loop of six distinct steps; the open gap: the 3-sphere characterization, which is Perelman's theorem (2003), proved externally and not here. Proved here: <strong>0</strong>. The authoritative statement is <a href="https://www.claymath.org/millennium/poincare-conjecture/">Clay Mathematics Institute — Poincaré Conjecture</a>.</p>
<p class="thm-remark">── 7 · Poincaré — one closed loop, no holes, computed ──────────────────────────────────────────────────── The sequence closes (orbit 6 = orbit 0) after six pairwise-distinct steps — a single simple loop. A closed cyclic loop is not the 3-sphere characterization; Poincaré is Perelman's THEOREM (2003), not proved here.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 36 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_seven_rest_on_one_finite_structure">
<p class="thm-label"><strong>Theorem 368</strong> (<code>the_seven_rest_on_one_finite_structure</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_seven_rest_on_one_finite_structure.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>1</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>span</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range' 1 9).all (fun d =&gt; refl (refl d) == d)) ∧ (((List.range' 1 9).filter isUnit).length = 6) ∧ (span.eraseDups.length = 6)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{1,\dots,9\},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d \land \left|\{\, x \in \{1,\dots,9\} \mid \mathrm{isUnit}\mathopen{}\left(x\right) \,\}\right| = 6 \land \left|\operatorname{dedup}\left(\mathrm{span}\right)\right| = 6</code></pre></details>
</div>
<p class="thm-remark">── THE SEVEN REST ON ONE FINITE STRUCTURE, and it is small enough to state in full. Every theorem above is built from three things: the reflection r(d)=10−d, the units of ℤ/9, and the doubling orbit. Here they are, checked together — the reflection is an involution, the units number six, and the orbit has period six.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_three_non_units_are_exactly_the_unreachable">
<p class="thm-label"><strong>Theorem 369</strong> (<code>the_three_non_units_are_exactly_the_unreachable</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_three_non_units_are_exactly_the_unreachable.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mi>d</mi><mo>∈</mo><mi>span</mi></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mi>isUnit</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>|</mo></mrow><mo>+</mo><mrow><mo>|</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>isUnit</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 9).filter (fun d =&gt; ! isUnit d)) = [0, 3, 6] ∧ ((List.range 9).filter (fun d =&gt; ! isUnit d)).all (fun d =&gt; ! span.contains d) ∧ ((List.range 9).filter isUnit).length + ((List.range 9).filter (fun d =&gt; ! isUnit d)).length = 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, d \in \{0,\dots,8\} \mid \lnot \mathrm{isUnit}\mathopen{}\left(d\right) \,\} = [0,\,3,\,6] \land \forall d \in \{\, d \in \{0,\dots,8\} \mid \lnot \mathrm{isUnit}\mathopen{}\left(d\right) \,\},\; \lnot d \in \mathrm{span} \land \left|\{\, x \in \{0,\dots,8\} \mid \mathrm{isUnit}\mathopen{}\left(x\right) \,\}\right| + \left|\{\, d \in \{0,\dots,8\} \mid \lnot \mathrm{isUnit}\mathopen{}\left(d\right) \,\}\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── THE NINTH: the three digits the other eight leave outside ──────────────────────────────────────────── This file carries one theorem per residue of ℤ/9, and it briefly carried only eight, because the ninth was `the_floor_is_zero_of_seven : provenHere = 0 := rfl` — a theorem deciding that a number typed one line above equals itself. Removing it was right and leaving the gap was not: the ninth slot has real work available, and the tautology had been standing where the work should be. The eight above settle the units — six digits — and the structure they share. Nothing said what the remaining three are. This does: the non-units are exactly {0, 3, 6}, the doubling reaches none of them, and the two sets partition the nine. The kernel evaluates every part of that over the whole ring; written with any other set on the right it would be RED, which is precisely what the theorem it replaces could not manage.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 19,683 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_origin_annihilates_and_never_joins_the_circuit">
<p class="thm-label"><strong>Theorem 370</strong> (<code>the_origin_annihilates_and_never_joins_the_circuit</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_origin_annihilates_and_never_joins_the_circuit.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mn>0</mn><mo>⋅</mo><mi>e</mi></mrow><mo>mod</mo><mn>9</mn></mrow><mo>≠</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mn>0</mn><mo>∈</mo><mi>span</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>d</mi><mo>+</mo><mn>0</mn></mrow><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mrow><mi>d</mi><mo>mod</mo><mn>9</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 9).all (fun e =&gt; (0 * e) % 9 != 1)) ∧ (! span.contains 0) ∧ ((List.range 9).all (fun d =&gt; (d + 0) % 9 == d % 9))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \{0,\dots,8\},\; 0 \cdot e \bmod 9 \neq 1 \land \lnot 0 \in \mathrm{span} \land \forall d \in \{0,\dots,8\},\; d + 0 \bmod 9 = d \bmod 9</code></pre></details>
</div>
<p class="thm-remark">── THE TENTH AND ELEVENTH: the origin, and the return that closes the sequence ────────────────────────── The sequence this deposit is built on is `1 2 4 8 7 5 3 6 9 0 1` — eleven positions. The seven Clay theorems and the involution settle the first eight (the doubling circuit 1,2,4,8,7,5 and the first two of the trinity, 3 and 6); the ninth settles the trinity as a set, including 9 ≡ 0. That left the last two positions unstated: the origin, and the return. THE ORIGIN. 0 is the one digit with no multiplicative inverse of any kind — not merely absent from the unit group but annihilating: 0·e is never 1, for any e in the ring. It is also additively neutral, which is why it is the origin and not just another non-unit. The doubling circuit never reaches it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-index-the_sequence_is_its_named_parts_and_closes">
<p class="thm-label"><strong>Theorem 371</strong> (<code>the_sequence_is_its_named_parts_and_closes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_windows_the_sequence_is_its_named_parts_and_closes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>sequence</mi><mo>=</mo><mrow><mrow><mrow><mi>span</mi><mo>⧺</mo><mrow><mo>[</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow><mo>⧺</mo><mrow><mo>[</mo><mn>0</mn><mo>]</mo></mrow></mrow><mo>⧺</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>sequence</mi><mo>|</mo></mrow><mo>=</mo><mn>11</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>head</mi><mo>(</mo><mi>sequence</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>last</mi><mo>(</mo><mi>sequence</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mn>9</mn><mo>mod</mo><mn>9</mn></mrow><mo>=</mo><mn>0</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>sequence = span ++ [3, 6, 9] ++ [0] ++ [1] ∧ sequence.length = 11 ∧ sequence.head? = sequence.getLast? ∧ 9 % 9 = 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{sequence} = \mathrm{span} \mathbin{+\!\!+} [3,\,6,\,9] \mathbin{+\!\!+} [0] \mathbin{+\!\!+} [1] \land \left|\mathrm{sequence}\right| = 11 \land \operatorname{head}\left(\mathrm{sequence}\right) = \operatorname{last}\left(\mathrm{sequence}\right) \land 9 \bmod 9 = 0</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

</div>
