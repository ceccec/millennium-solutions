---
title: "What exhaustion reaches, and what lies outside it"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `reach.lean`

<p class="paper-src"><code>src/iso/9001-governance/reach.lean</code> · namespace <code>Reach</code> · 12 theorems · wing <code>the floor</code></p>

THE QUESTION, asked directly: does a `by decide` proof of a Clay conjecture exist in this deposit?

The honest way to answer is not prose. `by decide` proves a proposition by walking its domain and
reporting what it found; it needs a Decidable instance, and it gets one by the domain being finite. Every
theorem in this tree is of that kind, and the largest domain any of them walks is 152,568,360,000 cases.
Each of the seven Clay conjectures quantifies over an infinite set. So the question is whether an
exhaustion can reach past its own bound.

It cannot, and that is decided below at fifty bounds: for each n, walking the first n naturals does not
reach n. Not once, at a flattering bound — at every one of them.

WHAT IS NOT PROVED HERE, said as plainly as what is. This decides the statement AT FIFTY BOUNDS. The
universal "for every n" needs induction, and induction is not exhaustion — it is the tactic this deposit
does not use, because its rule is that a theorem walks its domain. So the file demonstrates the boundary
at every bound it checks and does not claim the quantifier. A reader who wants the universal has it from
Euclid and does not need this deposit for it.

The answer to the question, then: no. Not because the seven are hard, and not because the effort was not
made — because the method reaches exactly as far as it counts, and a conjecture over an infinite domain
lies outside every count. That is a fact about `decide`, not a verdict on the conjectures.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>bounds := List.range' 1 50
largestDomainHere := 152568360000</code></pre>

<div class="thm" id="thm-reach-exhaustion_never_reaches_its_own_bound">
<p class="thm-label"><strong>Theorem 509</strong> (<code>exhaustion_never_reaches_its_own_bound</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_exhaustion_never_reaches_its_own_bound.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mi>bounds</mi><mo>,</mo><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mi>n</mi></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mi>n</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>bounds.all (fun n =&gt; (List.range n).length == n &amp;&amp; ¬ (List.range n).contains n)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \mathrm{bounds},\; \left|\{0,\dots,n-1\}\right| = n \land \lnot n \in \{0,\dots,n-1\}</code></pre></details>
</div>
<p class="thm-remark">── 1 · AN EXHAUSTION DOES NOT REACH ITS OWN BOUND ────────────────────────────────────────────────────── Walking the first n naturals produces exactly n of them, and n is not among them. Checked at fifty bounds, so this is not one convenient n.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-the_successor_of_every_bound_lies_outside">
<p class="thm-label"><strong>Theorem 510</strong> (<code>the_successor_of_every_bound_lies_outside</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_the_successor_of_every_bound_lies_outside.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mi>bounds</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mi>n</mi><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>bounds.all (fun n =&gt; ¬ (List.range n).contains (n + 1))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \mathrm{bounds},\; \lnot n + 1 \in \{0,\dots,n-1\}</code></pre></details>
</div>
<p class="thm-remark">── 2 · AND SOMETHING ALWAYS LIES OUTSIDE ─────────────────────────────────────────────────────────────── The successor of the bound is outside the walk, at every bound checked. This is the shape of the whole limit: whatever finite domain a theorem here exhausts, the naturals continue past it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-doubling_the_domain_leaves_the_same_hole">
<p class="thm-label"><strong>Theorem 511</strong> (<code>doubling_the_domain_leaves_the_same_hole</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_doubling_the_domain_leaves_the_same_hole.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mi>bounds</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>n</mi></mrow><mo>−</mo><mn>1</mn></mrow><mo>}</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>bounds.all (fun n =&gt; ¬ (List.range (2 * n)).contains (2 * n))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \mathrm{bounds},\; \lnot 2 \cdot n \in \{0,\dots,2 \cdot n-1\}</code></pre></details>
</div>
<p class="thm-remark">── 3 · GROWING THE BOUND DOES NOT CLOSE THE GAP ──────────────────────────────────────────────────────── Doubling the domain leaves the same hole. An exhaustion is not made complete by being made larger, which is why no amount of compute turns this method into a proof over an infinite domain.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-the_successor_leaves_every_domain_and_the_predecessor_returns">
<p class="thm-label"><strong>Theorem 512</strong> (<code>the_successor_leaves_every_domain_and_the_predecessor_returns</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_the_successor_leaves_every_domain_and_the_predecessor_returns.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>n</mi><mo>∈</mo><mrow><mi>bounds</mi><mo>⧺</mo><mrow><mo>[</mo><mi>largestDomainHere</mi><mo>]</mo></mrow></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>&gt;</mo><mi>n</mi></mrow><mo>∧</mo><mrow><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>-</mo><mn>1</mn></mrow><mo>=</mo><mi>n</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>n</mi><mo>+</mo><mn>1</mn></mrow><mo>mod</mo><mn>2</mn></mrow><mo>≠</mo><mrow><mi>n</mi><mo>mod</mo><mn>2</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(bounds ++ [largestDomainHere]).all (fun n =&gt; n + 1 &gt; n &amp;&amp; (n + 1) - 1 == n &amp;&amp; (n + 1) % 2 != n % 2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall n \in \mathrm{bounds} \mathbin{+\!\!+} [\mathrm{largestDomainHere}],\; n + 1 &gt; n \land n + 1 - 1 = n \land n + 1 \bmod 2 \neq n \bmod 2</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-the_predecessor_returns_every_successor">
<p class="thm-label"><strong>Theorem 513</strong> (<code>the_predecessor_returns_every_successor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_the_predecessor_returns_every_successor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (n + 1) - 1 = n</code></pre>
</div>
<p class="thm-remark">── AND FOR EVERY n, WHICH NO EXHAUSTION ABOVE CAN SAY. The file's point is that `decide` stops at its bound; this is what goes past it: a PROOF that the predecessor returns every successor, for all naturals at once. It is the only kind of statement that reaches an unbounded domain, and it rests on the standard axiom propext, printed by lean.ts. ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-exhaustion_never_reaches_its_own_bound_for_every_n">
<p class="thm-label"><strong>Theorem 514</strong> (<code>exhaustion_never_reaches_its_own_bound_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_exhaustion_never_reaches_its_own_bound_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, (List.range n).length = n ∧ n ∉ List.range n</code></pre>
</div>
<p class="thm-remark">── the three bounded rows above, proved for every bound — no list of bounds ───────────────────────────────── the file's own point, now without a range: no exhaustion over 0..n-1 contains n, n + 1, or (at 2n) 2n.</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-the_successor_of_every_bound_lies_outside_for_every_n">
<p class="thm-label"><strong>Theorem 515</strong> (<code>the_successor_of_every_bound_lies_outside_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_the_successor_of_every_bound_lies_outside_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, n + 1 ∉ List.range n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-doubling_the_domain_leaves_the_same_hole_for_every_n">
<p class="thm-label"><strong>Theorem 516</strong> (<code>doubling_the_domain_leaves_the_same_hole_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_doubling_the_domain_leaves_the_same_hole_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 2 * n ∉ List.range (2 * n)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-the_successor_returns_every_positive_predecessor">
<p class="thm-label"><strong>Theorem 517</strong> (<code>the_successor_returns_every_positive_predecessor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_the_successor_returns_every_positive_predecessor.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 0 &lt; n → (n - 1) + 1 = n</code></pre>
</div>
<p class="thm-remark">── reflections, from the easy batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-exhaustion_reaches_everything_below_its_bound_for_every_n">
<p class="thm-label"><strong>Theorem 518</strong> (<code>exhaustion_reaches_everything_below_its_bound_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_exhaustion_reaches_everything_below_its_bound_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n k : Nat, k &lt; n → k ∈ List.range n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-the_predecessor_of_every_positive_bound_lies_inside">
<p class="thm-label"><strong>Theorem 519</strong> (<code>the_predecessor_of_every_positive_bound_lies_inside</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_the_predecessor_of_every_positive_bound_lies_inside.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 0 &lt; n → n - 1 ∈ List.range n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-reach-halving_the_domain_keeps_the_half_inside_for_every_n">
<p class="thm-label"><strong>Theorem 520</strong> (<code>halving_the_domain_keeps_the_half_inside_for_every_n</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_reach_halving_the_domain_keeps_the_half_inside_for_every_n.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n : Nat, 0 &lt; n → n ∈ List.range (2 * n)</code></pre>
</div>
<p class="thm-remark">── reflections, from the extra batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
