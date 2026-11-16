---
title: "Two kinds of cross formula — one that runs both ways and one that does not"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `asymmetry.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/asymmetry.lean</code> · namespace <code>Asymmetry</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

scripts/coils.ts clusters expressions that compute the same thing and licenses substituting either for
the other. Every coil it finds is SYMMETRIC — the relation is equality of extension, which is an
equivalence, decided in src/iso/80000-2-mathematics/equivalence.lean. That is one kind of cross formula and the tree had
only that kind.

The other kind is the one this deposit is named for. A cross formula may run ONE WAY: from d you can
compute d² and from d² you cannot recover d, because two residues share a square. Knowing either end of
a symmetric pair gives you the other; knowing the image of an asymmetric map gives you a SET.

Both are decided here on the same ring, so the difference is a measurement and not a metaphor:

    refl   d ↦ (10 − d) mod 9    injective, an involution — SYMMETRIC, runs both ways
    double d ↦ 2d mod 9          injective, NOT an involution — invertible, but not by itself
    square d ↦ d² mod 9          NOT injective, image of four — ASYMMETRIC, loses information

THE THIRD ROW IS WHY THE SECOND MATTERS. Invertible and symmetric are not the same thing, and a file
that showed only refl and square would suggest they were: doubling runs both ways and is nobody's own
inverse, which is the middle case that keeps the dichotomy honest.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>ring := List.range 9</code></pre>

<div class="thm" id="thm-asymmetry-the_reflection_is_its_own_inverse">
<p class="thm-label"><strong>Theorem 604</strong> (<code>the_reflection_is_its_own_inverse</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_the_reflection_is_its_own_inverse.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>∧</mo><mrow><mi>injective</mi><mo>(</mo><mi>refl</mi><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.all (fun d =&gt; refl (refl d) == d) &amp;&amp; injective refl</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{ring},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d \land \mathrm{injective}\mathopen{}\left(\mathrm{refl}\right)</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE SYMMETRIC ONE RUNS BOTH WAYS BY ITSELF ──────────────────────────────────────────────────────── An involution: applying it twice returns. Either end of the pair gives the other, with no second map.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-squaring_is_not_injective_and_its_image_is_four">
<p class="thm-label"><strong>Theorem 605</strong> (<code>squaring_is_not_injective_and_its_image_is_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_squaring_is_not_injective_and_its_image_is_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>¬</mo><mrow><mi>injective</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>image</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>ring</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>!(injective sq) &amp;&amp; (image sq).length == 4 &amp;&amp; ring.length == 9</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \mathrm{injective}\mathopen{}\left(\mathrm{sq}\right) \land \left|\mathrm{image}\mathopen{}\left(\mathrm{sq}\right)\right| = 4 \land \left|\mathrm{ring}\right| = 9</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE ASYMMETRIC ONE LOSES WHAT IT WAS GIVEN ──────────────────────────────────────────────────────── Squaring is not injective: nine residues land on four. From d² the residue d is not recoverable, and the count of what is lost is stated rather than described.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-every_residue_shares_its_square_with_another">
<p class="thm-label"><strong>Theorem 606</strong> (<code>every_residue_shares_its_square_with_another</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_every_residue_shares_its_square_with_another.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mo>∃</mo><mi>e</mi><mo>∈</mo><mi>ring</mi><mo>:</mo><mrow><mrow><mi>e</mi><mo>≠</mo><mi>d</mi></mrow><mo>∧</mo><mrow><mrow><mi>sq</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>sq</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.all (fun d =&gt; ring.any (fun e =&gt; e != d &amp;&amp; sq e == sq d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{ring},\; \exists e \in \mathrm{ring} : e \neq d \land \mathrm{sq}\mathopen{}\left(e\right) = \mathrm{sq}\mathopen{}\left(d\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · AND EVERY SQUARE HAS A SECOND ROOT ──────────────────────────────────────────────────────────────── Not merely "some collision exists": for every residue there is a DIFFERENT one with the same square, so the loss is total rather than occasional — knowing d² never narrows the answer to one.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-doubling_is_invertible_and_is_not_its_own_inverse">
<p class="thm-label"><strong>Theorem 607</strong> (<code>doubling_is_invertible_and_is_not_its_own_inverse</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_doubling_is_invertible_and_is_not_its_own_inverse.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>injective</mi><mo>(</mo><mi>dbl</mi><mo>)</mo></mrow><mo>∧</mo><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>dbl</mi><mo>(</mo><mrow><mi>dbl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>injective dbl &amp;&amp; !(ring.all (fun d =&gt; dbl (dbl d) == d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{injective}\mathopen{}\left(\mathrm{dbl}\right) \land \lnot \forall d \in \mathrm{ring},\; \mathrm{dbl}\mathopen{}\left(\mathrm{dbl}\mathopen{}\left(d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE MIDDLE CASE, WHICH KEEPS THE DICHOTOMY HONEST ───────────────────────────────────────────────── THE THEOREM THAT STOPS 1 AND 2 FROM READING AS "INVERTIBLE = SYMMETRIC". Doubling is injective, so it runs both ways — and it is NOT its own inverse. Invertible and self-inverse are different properties, and a file showing only refl and square would quietly conflate them.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-inverting_the_symmetric_gives_one_and_the_asymmetric_gives_many">
<p class="thm-label"><strong>Theorem 608</strong> (<code>inverting_the_symmetric_gives_one_and_the_asymmetric_gives_many</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_inverting_the_symmetric_gives_one_and_the_asymmetric_gives_many.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>sq</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>sq</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>&gt;</mo><mn>1</mn></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>sq</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>sq</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>ring.all (fun d =&gt; (ring.filter (fun e =&gt; refl e == refl d)).length == 1) &amp;&amp; ring.all (fun d =&gt; (ring.filter (fun e =&gt; sq e == sq d)).length &gt; 1) &amp;&amp; (ring.filter (fun e =&gt; sq e == sq 1)).length == 2</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{ring},\; \left|\{\, e \in \mathrm{ring} \mid \mathrm{refl}\mathopen{}\left(e\right) = \mathrm{refl}\mathopen{}\left(d\right) \,\}\right| = 1 \land \forall d \in \mathrm{ring},\; \left|\{\, e \in \mathrm{ring} \mid \mathrm{sq}\mathopen{}\left(e\right) = \mathrm{sq}\mathopen{}\left(d\right) \,\}\right| &gt; 1 \land \left|\{\, e \in \mathrm{ring} \mid \mathrm{sq}\mathopen{}\left(e\right) = \mathrm{sq}\mathopen{}\left(1\right) \,\}\right| = 2</code></pre></details>
</div>
<p class="thm-remark">── 5 · WHAT THE ASYMMETRIC MAP RETURNS IS A SET, NOT A VALUE ───────────────────────────────────────────── The practical content: inverting the symmetric map yields one residue, inverting the asymmetric one yields a class of them. Two apiece here, and the classes partition the ring.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-each_kind_is_defined_by_the_other">
<p class="thm-label"><strong>Theorem 609</strong> (<code>each_kind_is_defined_by_the_other</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_each_kind_is_defined_by_the_other.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>injective</mi><mo>(</mo><mi>refl</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>injective</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>image</mi><mo>(</mo><mi>refl</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>≠</mo><mrow><mo>|</mo><mrow><mi>image</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow><mo>|</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>≠</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>ring</mi><mo>,</mo><mrow><mrow><mi>sq</mi><mo>(</mo><mrow><mi>sq</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>d</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(injective refl != injective sq) &amp;&amp; ((image refl).length != (image sq).length) &amp;&amp; (ring.all (fun d =&gt; refl (refl d) == d) != ring.all (fun d =&gt; sq (sq d) == d))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{injective}\mathopen{}\left(\mathrm{refl}\right) \neq \mathrm{injective}\mathopen{}\left(\mathrm{sq}\right) \land \left|\mathrm{image}\mathopen{}\left(\mathrm{refl}\right)\right| \neq \left|\mathrm{image}\mathopen{}\left(\mathrm{sq}\right)\right| \land \forall d \in \mathrm{ring},\; \mathrm{refl}\mathopen{}\left(\mathrm{refl}\mathopen{}\left(d\right)\right) = d \neq \forall d \in \mathrm{ring},\; \mathrm{sq}\mathopen{}\left(\mathrm{sq}\mathopen{}\left(d\right)\right) = d</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE TWO KINDS PROVE EACH OTHER BY CONTRAST ──────────────────────────────────────────────────────── Neither statement is worth anything alone: "runs both ways" means nothing without a map that does not, and "loses information" means nothing without one that does not. Decided together on the same ring, over the same domain, so the difference is between the maps and not between two ways of asking.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-the_squares_are_not_closed_under_the_reflection">
<p class="thm-label"><strong>Theorem 610</strong> (<code>the_squares_are_not_closed_under_the_reflection</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_the_squares_are_not_closed_under_the_reflection.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mi>image</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow><mo>,</mo><mrow><mrow><mi>refl</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>∈</mo><mrow><mi>image</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>image</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>refl</mi><mo>[</mo><mrow><mi>image</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>!((image sq).all (fun d =&gt; (image sq).contains (refl d))) &amp;&amp; (image sq).length == ((image sq).map refl).eraseDups.length</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall d \in \mathrm{image}\mathopen{}\left(\mathrm{sq}\right),\; \mathrm{refl}\mathopen{}\left(d\right) \in \mathrm{image}\mathopen{}\left(\mathrm{sq}\right) \land \left|\mathrm{image}\mathopen{}\left(\mathrm{sq}\right)\right| = \left|\operatorname{dedup}\left(\mathrm{refl}[\mathrm{image}\mathopen{}\left(\mathrm{sq}\right)]\right)\right|</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE SYMMETRIC MAP CARRIES THE ASYMMETRIC ONE'S IMAGE SOMEWHERE ELSE ─────────────────────────────── A cross formula between the two: reflecting the squares does not give the squares back. So the two structures are genuinely different subsets and not the same set under two names — which is the coil test from scripts/coils.ts, applied here and answering NO.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-asymmetry-the_shape_is_decided_and_the_difficulty_is_not">
<p class="thm-label"><strong>Theorem 611</strong> (<code>the_shape_is_decided_and_the_difficulty_is_not</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_asymmetry_the_shape_is_decided_and_the_difficulty_is_not.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>¬</mo><mrow><mi>injective</mi><mo>(</mo><mi>sq</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>ring</mi><mo>|</mo></mrow><mo>=</mo><mn>9</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>ring</mi><mo>∣</mo><mrow><mrow><mi>sq</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>!(injective sq) &amp;&amp; ring.length == 9 &amp;&amp; (ring.filter (fun e =&gt; sq e == 0)).length == 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \mathrm{injective}\mathopen{}\left(\mathrm{sq}\right) \land \left|\mathrm{ring}\right| = 9 \land \left|\{\, e \in \mathrm{ring} \mid \mathrm{sq}\mathopen{}\left(e\right) = 0 \,\}\right| = 3</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHAT THIS DOES NOT SAY ABOUT CRYPTOGRAPHY ───────────────────────────────────────────────────────── NOTHING HERE IS A ONE-WAY FUNCTION. Squaring on nine residues loses information and is inverted by looking at all nine, which takes no time at all; a cryptographic one-way function is hard to invert at a size where exhaustion is infeasible, and hardness is not a property this kernel can decide over a finite domain it walks in full. What is decided is the SHAPE — that a relation can fail to run backwards — and the shape is the thing this deposit's asymmetric wing is named for, not a claim about difficulty.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
