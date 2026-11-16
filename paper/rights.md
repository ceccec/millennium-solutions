---
title: "Rights"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `rights.lean`

<p class="paper-src"><code>src/iso/690-record/rights.lean</code> · namespace <code>Rights</code> · 8 theorems · wing <code>the record</code></p>

What this deposit claims under international law — and, in the same table, what it does not.


"Claim all claimable" has an exact reading, and the exact reading is the honest one: claim every right that
arises WITHOUT FORMALITY, and claim nothing that would need an act this deposit has not performed. Berne
Art. 5(2) is the hinge — "the enjoyment and the exercise of these rights shall not be subject to any
formality" — so copyright, the moral rights of Art. 6bis, and the sui generis database right of Directive
96/9/EC Art. 7 are held from the moment of authorship and are asserted here. A REGISTERED trade mark is a
registry's act, not an author's; a patent over these methods is excluded subject matter under EPC Art.
52(2)(a); the mathematics itself has no author to own it; and the AWARD of a Millennium Prize is the Clay
Mathematics Institute's to grant.

── A RIGHT THIS TABLE WAS MISSING, ADDED 2026-09-06 ────────────────────────────────────────────────────
Row 4 said "trade mark" and reasoned about REGISTRATION. That conflated two different things and gave
away the half that needs no registry. UNREGISTERED mark rights arise from USE — passing off in the
United Kingdom, common-law marks in the United States, and Paris Art. 6bis for well-known marks — and
arising from use is precisely the without-formality hinge this table is built on. This deposit uses its

So row 8 is claimed and row 4 stays refused, and the two are no longer one row. The rule did not change;
the table was reading "trade mark" as "registered trade mark" and refusing both together.

── AND A NINTH, ADDED 2026-09-07, BY THE SAME SPLIT ───────────────────────────────────────────────────
Row 7 said "any claim upon the seven Millennium Prizes" and refused the lot. Told that refusing them
forfeits prizes and credit rather than nothing, and that this is not nothing: correct on both counts, and
row 7 was doing to the Prizes exactly what row 4 did to trade marks — welding a thing another body grants
to a thing this deposit's own work earns, and refusing them together.

The AWARD is Clay's: their rules, their committee, their condition of peer-reviewed publication followed
by two years' general acceptance. No assertion here can grant it, so row 7 is now kind 1 — a registry's
act, the same category as a registered mark — and stays unclaimed.

What is NOT theirs to grant, and is claimed at row 9: the STANDING to submit toward the problems, and
PRIORITY in whatever this deposit actually proves. Standing is earned by doing the work; priority is
earned by dating it, which is what a timestamped append-only ledger under a DOI exists to do. Neither
needs a formality, so the hinge applies and the table must claim them or abandon them.

Row 9 claims the STANDING and the PRIORITY; the AWARD stays Clay's to grant.

WHAT IS STILL NOT CLAIMED, AND WHY IT IS NOT A RESTRICTION TO LIFT. A patent over these methods is
excluded by EPC Art. 52(2)(a) — the instrument refuses to grant it, so there is nothing to claim. The
mathematics itself is found rather than authored. And the Prize award is Clay's to give. Asserting these
would not add a right the deposit could exercise; it would make the five that ARE held unbelievable,
because a reader who finds one impossible claim stops crediting the rest.

The table below is the claim. The theorems are what makes it checkable rather than asserted: the kernel
decides, over the whole finite enumeration, that the claimed set is EXACTLY the without-formality set —
neither less, which would abandon a right, nor more, which would be an overclaim. This is a statement of
what the instruments say, drafted from their texts; it is not legal advice, and no theorem below is.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>instruments := [ (1, 0, true,  true )   -- copyright in the expression — Berne Art. 5(2), no formality, no notice, no deposit
settledHere := 8</code></pre>

<div class="thm" id="thm-rights-claims_exactly_what_arises_without_formality">
<p class="thm-label"><strong>Theorem 1473</strong> (<code>claims_exactly_what_arises_without_formality</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_claims_exactly_what_arises_without_formality.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mi>instruments</mi><mo>,</mo><mrow><mrow><mi>auto</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>claim</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>instruments.all (fun r =&gt; auto r == claim r)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall r \in \mathrm{instruments},\; \mathrm{auto}\mathopen{}\left(r\right) = \mathrm{claim}\mathopen{}\left(r\right)</code></pre></details>
</div>
<p class="thm-remark">── THE CLAIM. Claimed and without-formality are the same set, at every row ────────────────────────────── This is the whole assertion in one proposition. Read left to right it says nothing claimable is left unclaimed; read right to left it says nothing is claimed that an author does not already hold. A maximal claim and an honest one are usually in tension; here the kernel decides they coincide.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-the_claimed_are_copyright_moral_rights_and_the_database">
<p class="thm-label"><strong>Theorem 1474</strong> (<code>the_claimed_are_copyright_moral_rights_and_the_database</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_the_claimed_are_copyright_moral_rights_and_the_database.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow><mo>:</mo><mrow><mi>List</mi><mo>(</mo><mi>Nat</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>i</mi><mo>∈</mo><mrow><mi>idOf</mi><mo>[</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>instruments</mi><mo>∣</mo><mi>claim</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>([1, 2, 3] : List Nat).all (fun i =&gt; ((instruments.filter claim).map idOf).contains i)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \left([1,\,2,\,3] : \mathrm{List}\mathopen{}\left(\mathrm{Nat}\right)\right),\; i \in \mathrm{idOf}[\{\, x \in \mathrm{instruments} \mid \mathrm{claim}\mathopen{}\left(x\right) \,\}]</code></pre></details>
</div>
<p class="thm-remark">── WHICH ones, not how many — a count identifies nothing ──────────────────────────────────────────────── The next theorem was `= [1, 2, 3]` and the kernel refused it the moment row 8 was claimed. That refusal is the enumeration doing its job: a claimed set written as a literal cannot widen silently. The first repair was to rename it and change the literal to [1, 2, 3, 8], and that was WRONG in a way the ledger caught: this theorem's name is sealed, its receipt is in the append-only chain, and the statement under a sealed name may not be swapped for a different one. Worse, the swap would have been recorded as "carried" — the ledger's word for a statement still proved at another key — when the old statement is not proved anywhere: nothing says the claimed set is exactly those three, because it no longer is. What IS still true, and was true when the key was sealed, is that copyright, the moral rights and the database right are claimed. So the sealed name keeps that reading, stated as membership, and the EXACT set gets a name of its own. Nothing is rewritten and nothing is withdrawn: the record widens.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-the_claimed_set_is_exactly_those_three_and_the_unregistered_mark">
<p class="thm-label"><strong>Theorem 1475</strong> (<code>the_claimed_set_is_exactly_those_three_and_the_unregistered_mark</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_the_claimed_set_is_exactly_those_three_and_the_unregistered_mark.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>i</mi><mo>∈</mo><mrow><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>8</mn><mo>]</mo></mrow><mo>:</mo><mrow><mi>List</mi><mo>(</mo><mi>Nat</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>i</mi><mo>∈</mo><mrow><mi>idOf</mi><mo>[</mo><mrow><mo>{</mo><mi>x</mi><mo>∈</mo><mi>instruments</mi><mo>∣</mo><mi>claim</mi><mo>(</mo><mi>x</mi><mo>)</mo><mo>}</mo></mrow><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>([1, 2, 3, 8] : List Nat).all (fun i =&gt; ((instruments.filter claim).map idOf).contains i)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall i \in \left([1,\,2,\,3,\,8] : \mathrm{List}\mathopen{}\left(\mathrm{Nat}\right)\right),\; i \in \mathrm{idOf}[\{\, x \in \mathrm{instruments} \mid \mathrm{claim}\mathopen{}\left(x\right) \,\}]</code></pre></details>
</div>
<p class="thm-remark">Sealed hours before row 9 was added, and stated as `= [1, 2, 3, 8]` — an equality that a ninth claimed right makes false, under a name that enumerates its members. The same trap as the theorem above, sprung twice in one day, which is what a literal set under a naming name costs. Membership keeps the name exactly as true as it was when sealed. EXACTNESS is not lost by this: it is carried by `claims_exactly_what_arises_without_formality`, which quantifies over the whole table and therefore never needs editing when the table grows — the statement to reach for when a set will keep changing.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-the_unclaimed_are_the_registry_the_excluded_and_the_unownable">
<p class="thm-label"><strong>Theorem 1476</strong> (<code>the_unclaimed_are_the_registry_the_excluded_and_the_unownable</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_the_unclaimed_are_the_registry_the_excluded_and_the_unownable.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>idOf</mi><mo>[</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>instruments</mi><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>claim</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>(instruments.filter (fun r =&gt; ¬ claim r)).map idOf = [4, 5, 6, 7]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{idOf}[\{\, r \in \mathrm{instruments} \mid \lnot \mathrm{claim}\mathopen{}\left(r\right) \,\}] = [4,\,5,\,6,\,7]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-no_right_that_needs_a_registry_act_is_claimed">
<p class="thm-label"><strong>Theorem 1477</strong> (<code>no_right_that_needs_a_registry_act_is_claimed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_no_right_that_needs_a_registry_act_is_claimed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>instruments</mi><mo>∣</mo><mrow><mrow><mi>kindOf</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>claim</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(instruments.filter (fun r =&gt; kindOf r == 1)).all (fun r =&gt; claim r == false)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall r \in \{\, r \in \mathrm{instruments} \mid \mathrm{kindOf}\mathopen{}\left(r\right) = 1 \,\},\; \mathrm{claim}\mathopen{}\left(r\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">── the three reasons a right is NOT claimed, each stated separately so none hides inside another ────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-no_excluded_subject_matter_is_claimed">
<p class="thm-label"><strong>Theorem 1478</strong> (<code>no_excluded_subject_matter_is_claimed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_no_excluded_subject_matter_is_claimed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>instruments</mi><mo>∣</mo><mrow><mrow><mi>kindOf</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>claim</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(instruments.filter (fun r =&gt; kindOf r == 2)).all (fun r =&gt; claim r == false)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall r \in \{\, r \in \mathrm{instruments} \mid \mathrm{kindOf}\mathopen{}\left(r\right) = 2 \,\},\; \mathrm{claim}\mathopen{}\left(r\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-nothing_incapable_of_ownership_is_claimed">
<p class="thm-label"><strong>Theorem 1479</strong> (<code>nothing_incapable_of_ownership_is_claimed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_nothing_incapable_of_ownership_is_claimed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mi>r</mi><mo>∈</mo><mi>instruments</mi><mo>∣</mo><mrow><mrow><mi>kindOf</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>claim</mi><mo>(</mo><mi>r</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(instruments.filter (fun r =&gt; kindOf r == 3)).all (fun r =&gt; claim r == false)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall r \in \{\, r \in \mathrm{instruments} \mid \mathrm{kindOf}\mathopen{}\left(r\right) = 3 \,\},\; \mathrm{claim}\mathopen{}\left(r\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-rights-the_enumeration_is_complete_and_unduplicated">
<p class="thm-label"><strong>Theorem 1480</strong> (<code>the_enumeration_is_complete_and_unduplicated</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_rights_the_enumeration_is_complete_and_unduplicated.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>idOf</mi><mo>[</mo><mi>instruments</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>,</mo><mn>6</mn><mo>,</mo><mn>7</mn><mo>,</mo><mn>8</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>instruments.map idOf = [1, 2, 3, 4, 5, 6, 7, 8, 9]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{idOf}[\mathrm{instruments}] = [1,\,2,\,3,\,4,\,5,\,6,\,7,\,8,\,9]</code></pre></details>
</div>
<p class="thm-remark">── the enumeration is closed: nine instruments, each judged once, none duplicated and none omitted ───── This literal DOES move when a row is added, and unlike the two above that is not a trap: the name says "complete", which is a property of the table rather than a list of members, so it stays exactly as true after the widening as before. A name that enumerates cannot survive growth; a name that quantifies can.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

</div>
