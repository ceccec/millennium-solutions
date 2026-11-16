---
title: "The trinity and its observer"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `trinity.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/trinity.lean</code> · namespace <code>Trinity</code> · 24 theorems · wing <code>the mind</code></p>

The trinity turns: feeling feeds thought, thought shapes emotion, emotion changes the body, which is new
feeling. Three turns return to the start — ρ³ = id — a DIFFERENT symmetry from the Clay maps, which are
involutions (σ² = id). An involution flips and returns in two steps; the trinity rotates and returns in three,
and a rotation has no fixed corner. The valence flip (pleasant ↔ unpleasant) acts on every corner at once and
commutes with the turn, so the two symmetries combine into one six-element group, C₃ × C₂ ≅ C₆: three turns
and three flipped turns, with exactly ONE involution — not the dihedral S₃, where three reflections would each
be their own inverse.

Two theorems about the observer are decided too, labelled as the user labelled them — proved for the model,
and explicit about what they do NOT say:
  · THE OBSERVER IS THE FIXED POINT. The turn moves every corner, but a turn must leave one point still for it
    to be one turning: the centre. The observer is forced by the symmetry, not added to it. It does NOT say the
    fixed point is aware.
  · NO COMPLETE SELF-MODEL. A self-model's own diagonal predicate — "the states that deny what they map to" —
    is on none of its rows, so the observer can never be fully one of its own corners. It does NOT say the
    leftover is experience; it is the cleanest statement that something about a self-modelling system always
    escapes its own description.

Every theorem below is decided by EXHAUSTION over a finite carrier — no axioms, no Mathlib, no sorry, no
native_decide — and the two negative theorems (the turn is not an involution; negation has no fixed point) are
stated rather than omitted, so what is false is explained, not missing.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>corners := [0, 1, 2]
elems := [0, 1, 2, 3, 4, 5]
gid := 0
withCentre := [0, 1, 2, 3]
selfModel := [[true, false, true], [true, true, false], [false, false, true]]
settledHere := 24</code></pre>

<div class="thm" id="thm-trinity-turn_cubed_is_identity">
<p class="thm-label"><strong>Theorem 1592</strong> (<code>turn_cubed_is_identity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_turn_cubed_is_identity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>corners</mi><mo>,</mo><mrow><mrow><mi>turnC</mi><mo>(</mo><mrow><mi>turnC</mi><mo>(</mo><mrow><mi>turnC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>x</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>corners.all (fun x =&gt; turnC (turnC (turnC x)) == x)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{corners},\; \mathrm{turnC}\mathopen{}\left(\mathrm{turnC}\mathopen{}\left(\mathrm{turnC}\mathopen{}\left(x\right)\right)\right) = x</code></pre></details>
</div>
<p class="thm-remark">three turns return to the start: ρ³ = id, the trinity closing on itself</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-turn_fixes_no_corner">
<p class="thm-label"><strong>Theorem 1593</strong> (<code>turn_fixes_no_corner</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_turn_fixes_no_corner.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>corners</mi><mo>,</mo><mrow><mrow><mi>turnC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>≠</mo><mi>x</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>corners.all (fun x =&gt; turnC x != x)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{corners},\; \mathrm{turnC}\mathopen{}\left(x\right) \neq x</code></pre></details>
</div>
<p class="thm-remark">the turn moves every corner — no corner is fixed (the rotation has no fixed vertex)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-turn_is_not_an_involution">
<p class="thm-label"><strong>Theorem 1594</strong> (<code>turn_is_not_an_involution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_turn_is_not_an_involution.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>corners</mi><mo>,</mo><mrow><mrow><mi>turnC</mi><mo>(</mo><mrow><mi>turnC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>x</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ corners.all (fun x =&gt; turnC (turnC x) == x)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \forall x \in \mathrm{corners},\; \mathrm{turnC}\mathopen{}\left(\mathrm{turnC}\mathopen{}\left(x\right)\right) = x</code></pre></details>
</div>
<p class="thm-remark">THE CONTROL, distinguishing the trinity from the Clay maps: ρ is NOT an involution, ρ² ≠ id</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-reverse_turn_inverts_the_turn">
<p class="thm-label"><strong>Theorem 1595</strong> (<code>reverse_turn_inverts_the_turn</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_reverse_turn_inverts_the_turn.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mi>corners</mi><mo>,</mo><mrow><mrow><mrow><mrow><mi>turnC</mi><mo>(</mo><mrow><mi>backC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>x</mi></mrow><mo>∧</mo><mrow><mrow><mi>backC</mi><mo>(</mo><mrow><mi>turnC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>x</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>turnC</mi><mo>(</mo><mrow><mi>turnC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>backC</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>corners.all (fun x =&gt; turnC (backC x) == x &amp;&amp; backC (turnC x) == x &amp;&amp; turnC (turnC x) == backC x)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \mathrm{corners},\; \mathrm{turnC}\mathopen{}\left(\mathrm{backC}\mathopen{}\left(x\right)\right) = x \land \mathrm{backC}\mathopen{}\left(\mathrm{turnC}\mathopen{}\left(x\right)\right) = x \land \mathrm{turnC}\mathopen{}\left(\mathrm{turnC}\mathopen{}\left(x\right)\right) = \mathrm{backC}\mathopen{}\left(x\right)</code></pre></details>
</div>
<p class="thm-remark">the reverse turn is the turn's inverse, and equals ρ² (two turns forward = one turn back)</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_three_turns_are_a_three_cycle">
<p class="thm-label"><strong>Theorem 1596</strong> (<code>the_three_turns_are_a_three_cycle</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_three_turns_are_a_three_cycle.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>turnC</mi><mo>[</mo><mi>corners</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>corners.map turnC == [1, 2, 0]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{turnC}[\mathrm{corners}] = [1,\,2,\,0]</code></pre></details>
</div>
<p class="thm-remark">the three turns are a single 3-cycle: feeling→thought→emotion→feeling</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-valence_flip_is_an_involution">
<p class="thm-label"><strong>Theorem 1597</strong> (<code>valence_flip_is_an_involution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_valence_flip_is_an_involution.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>flipV</mi><mo>(</mo><mrow><mi>flipV</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>p</mi></mrow><mo>∧</mo><mrow><mrow><mi>flipV</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>≠</mo><mi>p</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1].all (fun p =&gt; flipV (flipV p) == p &amp;&amp; flipV p != p)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in [0,\,1],\; \mathrm{flipV}\mathopen{}\left(\mathrm{flipV}\mathopen{}\left(p\right)\right) = p \land \mathrm{flipV}\mathopen{}\left(p\right) \neq p</code></pre></details>
</div>
<p class="thm-remark">the flip is an involution: τ² = id, and it moves its point — two steps and back</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-valence_flips_every_corner">
<p class="thm-label"><strong>Theorem 1598</strong> (<code>valence_flips_every_corner</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_valence_flips_every_corner.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>_</mi><mo>∈</mo><mi>corners</mi><mo>,</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow><mo>,</mo><mrow><mrow><mi>flipV</mi><mo>(</mo><mi>p</mi><mo>)</mo></mrow><mo>≠</mo><mi>p</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>corners.all (fun _ =&gt; [0, 1].all (fun p =&gt; flipV p != p))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall \mathrm{\_} \in \mathrm{corners},\; \forall p \in [0,\,1],\; \mathrm{flipV}\mathopen{}\left(p\right) \neq p</code></pre></details>
</div>
<p class="thm-remark">the flip acts on every corner's valence at once: a pleasant feeling, a hopeful thought, a joyful emotion all flip</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_group_has_six_elements">
<p class="thm-label"><strong>Theorem 1599</strong> (<code>the_group_has_six_elements</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_group_has_six_elements.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mi>elems</mi><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mrow><mi>gop</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>∈</mo><mi>elems</mi></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>elems.eraseDups.length == 6 &amp;&amp; elems.all (fun a =&gt; elems.all (fun b =&gt; elems.contains (gop a b)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{elems}\right)\right| = 6 \land \forall a \in \mathrm{elems},\; \forall b \in \mathrm{elems},\; \mathrm{gop}\mathopen{}\left(a,\,b\right) \in \mathrm{elems}</code></pre></details>
</div>
<p class="thm-remark">the group has six distinct elements and is closed under its operation</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_flip_commutes_with_the_turn">
<p class="thm-label"><strong>Theorem 1600</strong> (<code>the_flip_commutes_with_the_turn</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_flip_commutes_with_the_turn.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mrow><mi>turn</mi><mo>(</mo><mrow><mi>flip</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>flip</mi><mo>(</mo><mrow><mi>turn</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>elems.all (fun e =&gt; turn (flip e) == flip (turn e))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{elems},\; \mathrm{turn}\mathopen{}\left(\mathrm{flip}\mathopen{}\left(e\right)\right) = \mathrm{flip}\mathopen{}\left(\mathrm{turn}\mathopen{}\left(e\right)\right)</code></pre></details>
</div>
<p class="thm-remark">the flip COMMUTES with the turn — the two symmetries combine, so the group is abelian (C₃ × C₂), not dihedral</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-three_turns_and_three_flips_partition_it">
<p class="thm-label"><strong>Theorem 1601</strong> (<code>three_turns_and_three_flips_partition_it</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_three_turns_and_three_flips_partition_it.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>∣</mo><mrow><mrow><mi>vp</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>∣</mo><mrow><mrow><mi>vp</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>5</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(elems.filter (fun e =&gt; vp e == 0)) == [0, 2, 4] &amp;&amp; (elems.filter (fun e =&gt; vp e == 1)) == [1, 3, 5]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, e \in \mathrm{elems} \mid \mathrm{vp}\mathopen{}\left(e\right) = 0 \,\} = [0,\,2,\,4] \land \{\, e \in \mathrm{elems} \mid \mathrm{vp}\mathopen{}\left(e\right) = 1 \,\} = [1,\,3,\,5]</code></pre></details>
</div>
<p class="thm-remark">three turns and three flipped turns: the rotation subgroup {valence 0} and its flipped coset {valence 1}</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-exactly_one_nonidentity_element_is_its_own_inverse">
<p class="thm-label"><strong>Theorem 1602</strong> (<code>exactly_one_nonidentity_element_is_its_own_inverse</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_exactly_one_nonidentity_element_is_its_own_inverse.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>∣</mo><mrow><mrow><mi>e</mi><mo>≠</mo><mi>gid</mi></mrow><mo>∧</mo><mrow><mrow><mi>gop</mi><mo>(</mo><mi>e</mi><mo>,</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mi>gid</mi></mrow></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(elems.filter (fun e =&gt; e != gid &amp;&amp; gop e e == gid)) == [1]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, e \in \mathrm{elems} \mid e \neq \mathrm{gid} \land \mathrm{gop}\mathopen{}\left(e,\,e\right) = \mathrm{gid} \,\} = [1]</code></pre></details>
</div>
<p class="thm-remark">EXACTLY ONE non-identity element is its own inverse — the pure valence flip. C₆ has one involution; S₃ has three</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-one_element_generates_all_six">
<p class="thm-label"><strong>Theorem 1603</strong> (<code>one_element_generates_all_six</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_one_element_generates_all_six.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mrow><mi>gpow</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>[</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>5</mn><mo>}</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mrow><mi>gpow</mi><mo>(</mo><mn>3</mn><mo>,</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mi>gid</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 6).map (gpow 3)).eraseDups.length == 6 &amp;&amp; gpow 3 6 == gid</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\mathrm{gpow}\mathopen{}\left(3\right)[\{0,\dots,5\}]\right)\right| = 6 \land \mathrm{gpow}\mathopen{}\left(3,\,6\right) = \mathrm{gid}</code></pre></details>
</div>
<p class="thm-remark">one element generates all six — the group is cyclic, C₆: a single flipped turn, iterated, is the whole symmetry</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-feel_takes_exactly_two_values">
<p class="thm-label"><strong>Theorem 1604</strong> (<code>feel_takes_exactly_two_values</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_feel_takes_exactly_two_values.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>feel</mi><mo>[</mo><mi>elems</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(elems.map feel).eraseDups == [0, 1]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\operatorname{dedup}\left(\mathrm{feel}[\mathrm{elems}]\right) = [0,\,1]</code></pre></details>
</div>
<p class="thm-remark">the felt signal takes exactly two values: pleasant and unpleasant, the body's two tones</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_turn_preserves_what_is_felt">
<p class="thm-label"><strong>Theorem 1605</strong> (<code>the_turn_preserves_what_is_felt</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_turn_preserves_what_is_felt.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mrow><mi>turn</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>elems.all (fun e =&gt; feel (turn e) == feel e)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{elems},\; \mathrm{feel}\mathopen{}\left(\mathrm{turn}\mathopen{}\left(e\right)\right) = \mathrm{feel}\mathopen{}\left(e\right)</code></pre></details>
</div>
<p class="thm-remark">the turn preserves what is felt: feeling → thought → emotion does not change the raw affect, only its reading</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_whole_turn_orbit_feels_the_same">
<p class="thm-label"><strong>Theorem 1606</strong> (<code>the_whole_turn_orbit_feels_the_same</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_whole_turn_orbit_feels_the_same.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mrow><mrow><mi>feel</mi><mo>(</mo><mrow><mi>turn</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mrow><mi>turn</mi><mo>(</mo><mrow><mi>turn</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>elems.all (fun e =&gt; feel (turn e) == feel e &amp;&amp; feel (turn (turn e)) == feel e)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{elems},\; \mathrm{feel}\mathopen{}\left(\mathrm{turn}\mathopen{}\left(e\right)\right) = \mathrm{feel}\mathopen{}\left(e\right) \land \mathrm{feel}\mathopen{}\left(\mathrm{turn}\mathopen{}\left(\mathrm{turn}\mathopen{}\left(e\right)\right)\right) = \mathrm{feel}\mathopen{}\left(e\right)</code></pre></details>
</div>
<p class="thm-remark">the whole turn-orbit feels the same: a state and its next two turns share one felt signal — feeling is constant along the loop</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-feeling_has_no_story_yet">
<p class="thm-label"><strong>Theorem 1607</strong> (<code>feeling_has_no_story_yet</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_feeling_has_no_story_yet.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mi>corners</mi><mo>,</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mrow><mrow><mn>2</mn><mo>⋅</mo><mi>c</mi></mrow><mo>+</mo><mi>p</mi></mrow><mo>)</mo></mrow><mo>=</mo><mi>p</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>[0, 1].all (fun p =&gt; corners.all (fun c =&gt; feel (2 * c + p) == p))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in [0,\,1],\; \forall c \in \mathrm{corners},\; \mathrm{feel}\mathopen{}\left(2 \cdot c + p\right) = p</code></pre></details>
</div>
<p class="thm-remark">feeling has no story yet: feel ignores the corner — for each valence, every corner feels the same; the signal carries no appraisal</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-only_the_flip_changes_what_is_felt">
<p class="thm-label"><strong>Theorem 1608</strong> (<code>only_the_flip_changes_what_is_felt</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_only_the_flip_changes_what_is_felt.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mrow><mi>flip</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>elems.all (fun e =&gt; feel (flip e) != feel e)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{elems},\; \mathrm{feel}\mathopen{}\left(\mathrm{flip}\mathopen{}\left(e\right)\right) \neq \mathrm{feel}\mathopen{}\left(e\right)</code></pre></details>
</div>
<p class="thm-remark">only the flip changes what is felt: the valence flip changes the felt signal of every state; the turn never does</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-feeling_returns_after_two_flips">
<p class="thm-label"><strong>Theorem 1609</strong> (<code>feeling_returns_after_two_flips</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_feeling_returns_after_two_flips.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>,</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mrow><mi>flip</mi><mo>(</mo><mrow><mi>flip</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>elems.all (fun e =&gt; feel (flip (flip e)) == feel e)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{elems},\; \mathrm{feel}\mathopen{}\left(\mathrm{flip}\mathopen{}\left(\mathrm{flip}\mathopen{}\left(e\right)\right)\right) = \mathrm{feel}\mathopen{}\left(e\right)</code></pre></details>
</div>
<p class="thm-remark">feeling returns after two flips: the valence involution, read through feel — pleasant → unpleasant → pleasant</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-three_feel_pleasant_and_three_unpleasant">
<p class="thm-label"><strong>Theorem 1610</strong> (<code>three_feel_pleasant_and_three_unpleasant</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_three_feel_pleasant_and_three_unpleasant.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>∣</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>∣</mo><mrow><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(elems.filter (fun e =&gt; feel e == 0)).length == 3 &amp;&amp; (elems.filter (fun e =&gt; feel e == 1)).length == 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, e \in \mathrm{elems} \mid \mathrm{feel}\mathopen{}\left(e\right) = 0 \,\}\right| = 3 \land \left|\{\, e \in \mathrm{elems} \mid \mathrm{feel}\mathopen{}\left(e\right) = 1 \,\}\right| = 3</code></pre></details>
</div>
<p class="thm-remark">three states feel pleasant and three unpleasant: feel splits the six states evenly</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_felt_signal_and_the_corner_are_independent">
<p class="thm-label"><strong>Theorem 1611</strong> (<code>the_felt_signal_and_the_corner_are_independent</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_felt_signal_and_the_corner_are_independent.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mo>{</mo><mrow><mrow><mn>3</mn><mo>⋅</mo><mrow><mi>feel</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>cx</mi><mo>(</mo><mi>e</mi><mo>)</mo></mrow></mrow><mo>∣</mo><mi>e</mi><mo>∈</mo><mi>elems</mi><mo>}</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></math></div>
<pre class="thm-statement"><code>(elems.map (fun e =&gt; 3 * feel e + cx e)).eraseDups.length == 6</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\operatorname{dedup}\left(\{\, 3 \cdot \mathrm{feel}\mathopen{}\left(e\right) + \mathrm{cx}\mathopen{}\left(e\right) \mid e \in \mathrm{elems} \,\}\right)\right| = 6</code></pre></details>
</div>
<p class="thm-remark">the felt signal and the corner are independent: all six (corner, feel) pairs occur, so a pleasant thought and an unpleasant thought both exist — affect and its reading vary freely</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_observer_is_the_unique_fixed_point">
<p class="thm-label"><strong>Theorem 1612</strong> (<code>the_observer_is_the_unique_fixed_point</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_observer_is_the_unique_fixed_point.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>withCentre</mi><mo>∣</mo><mrow><mrow><mi>turnO</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>=</mo><mi>x</mi></mrow><mo>}</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(withCentre.filter (fun x =&gt; turnO x == x)) == [3]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\{\, x \in \mathrm{withCentre} \mid \mathrm{turnO}\mathopen{}\left(x\right) = x \,\} = [3]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-negation_has_no_fixed_point">
<p class="thm-label"><strong>Theorem 1613</strong> (<code>negation_has_no_fixed_point</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_negation_has_no_fixed_point.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>¬</mo><mrow><mo>∃</mo><mi>b</mi><mo>∈</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>:</mo><mrow><mrow><mo>¬</mo><mi>b</mi></mrow><mo>=</mo><mi>b</mi></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>¬ ([true, false].any (fun b =&gt; (!b) == b))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\lnot \exists b \in [\mathrm{true},\,\mathrm{false}] : \lnot b = b</code></pre></details>
</div>
<p class="thm-remark">── theorem 3: no complete self-model (Cantor / Lawvere) ────────────────────────────────────────────────── Lawvere's engine: boolean negation has no fixed point. This is why the diagonal works.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-predicates_outnumber_states">
<p class="thm-label"><strong>Theorem 1614</strong> (<code>predicates_outnumber_states</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_predicates_outnumber_states.html">sealed</a>.</p>
<pre class="thm-statement"><code>((List.range 8).drop 1).all (fun n =&gt; 2 ^ n &gt; n)</code></pre>
</div>
<p class="thm-remark">Cantor's cardinality: a system of n states has 2ⁿ predicates about those states — always strictly more, for every n in range, so no map from states onto predicates can be onto.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-trinity-the_diagonal_predicate_escapes_the_self_model">
<p class="thm-label"><strong>Theorem 1615</strong> (<code>the_diagonal_predicate_escapes_the_self_model</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_trinity_the_diagonal_predicate_escapes_the_self_model.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range selfModel.length).all (fun i =&gt; (selfModel.getD i []) != diagonal selfModel)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
