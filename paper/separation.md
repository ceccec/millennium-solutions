---
title: "A reading that does not vary with what it reads separates nothing"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `separation.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/separation.lean</code> · namespace <code>Separation</code> · 8 theorems · wing <code>the ring</code></p>

WHY THIS FILE EXISTS.

Zenodo record 22934883 (10.5281/zenodo.22934883, deposited 2026-09-24) carries four posters. Three of
them are the same picture: one identical ring of some twenty-eight domain labels — astrophysics, quark
flavour algebra, timbre, supply-chain optimisation, psychology — drawn around a hub that changes.
The hub reads FUSION POWER PLANT in one, DRY CLEANING in the second, PERMACULTURE ECOSYSTEM in the
third. The caption underneath changes with it: "THE ALGEBRA OF FUSION", then "THE ALGEBRA OF
EVERYTHING".

That construction is a claim, made by the drawing rather than by its text, and it is the only claim in
the record that can be decided: THE RING DOES NOT DEPEND ON THE HUB. It is worth deciding because the
claim is flattering to this deposit — "one structure, many readings" is what src/iso/9001-governance/index.lean says
about seven windows — and a result that agrees with you is the one that gets checked least.

It does not survive. A family of readings earns the word FRAME by separating what it reads; a family
that returns the same labels whatever you hand it is a decoration, and the posters demonstrate their own
ring is the second kind by printing it three times unchanged. The difference between that ring and the
seven windows is not rhetoric, it is theorem 3 below: the windows take three values on three subjects
and the ring takes one.

THE CONTROL IS THE POINT. Theorems 1, 2 and 5 are satisfied by anything that never varies, including a
broken test. Theorems 3, 4 and 6 run the identical question against a reading that DOES vary and require
the opposite answer, so a test that could only ever say "separates nothing" fails here before it can
flatter anyone.

THE SECOND LEAD is the record's fourth poster, "SOLVENT DISTILLATION & RECOVERY ALGEBRA", whose first
printed line is m_solv = m_solv + m_soil. Read as algebra that is not a mass balance: it holds exactly
when the soil mass is zero, which is the one quantity a dry cleaner may not assume away. Theorems 7 and
8 decide it and, more usefully, decide what was meant — an UPDATE rather than an equation — and show the
update is injective in the very quantity the equals sign annihilates. The information lost is exactly
the soil.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>hubs := [0, 1, 2]
labels := List.range 28
pairs := hubs.flatMap (fun a =&gt; (hubs.filter (fun b =&gt; b != a)).map (fun b =&gt; (a, b)))</code></pre>

<div class="thm" id="thm-separation-the_ring_is_the_same_around_every_hub">
<p class="thm-label"><strong>Theorem 1002</strong> (<code>the_ring_is_the_same_around_every_hub</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_the_ring_is_the_same_around_every_hub.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mi>pairs</mi><mo>,</mo><mrow><mrow><mi>ring</mi><mo>(</mo><msub><mi>p</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>=</mo><mrow><mi>ring</mi><mo>(</mo><msub><mi>p</mi><mn>2</mn></msub><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pairs.all (fun p =&gt; ring p.1 == ring p.2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{pairs},\; \mathrm{ring}\mathopen{}\left(p_{1}\right) = \mathrm{ring}\mathopen{}\left(p_{2}\right)</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE RING IS THE SAME AROUND EVERY HUB ───────────────────────────────────────────────────────────── The drawing's own claim, decided rather than granted.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-the_ring_separates_no_two_subjects">
<p class="thm-label"><strong>Theorem 1003</strong> (<code>the_ring_separates_no_two_subjects</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_the_ring_separates_no_two_subjects.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mi>pairs</mi><mo>,</mo><mrow><mo>¬</mo><mrow><mrow><mi>ring</mi><mo>(</mo><msub><mi>p</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>≠</mo><mrow><mi>ring</mi><mo>(</mo><msub><mi>p</mi><mn>2</mn></msub><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pairs.all (fun p =&gt; !(ring p.1 != ring p.2))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall p \in \mathrm{pairs},\; \lnot \mathrm{ring}\mathopen{}\left(p_{1}\right) \neq \mathrm{ring}\mathopen{}\left(p_{2}\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · SO IT TELLS NO TWO SUBJECTS APART ───────────────────────────────────────────────────────────────── Separation is the property of disagreeing somewhere. There is nowhere.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-the_varying_reading_separates_every_pair">
<p class="thm-label"><strong>Theorem 1004</strong> (<code>the_varying_reading_separates_every_pair</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_the_varying_reading_separates_every_pair.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>|</mo><mi>pairs</mi><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>labels</mi><mo>|</mo></mrow><mo>=</mo><mn>28</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>hubs</mi><mo>|</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mi>pairs</mi><mo>,</mo><mrow><mrow><mi>window</mi><mo>(</mo><msub><mi>p</mi><mn>1</mn></msub><mo>)</mo></mrow><mo>≠</mo><mrow><mi>window</mi><mo>(</mo><msub><mi>p</mi><mn>2</mn></msub><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>pairs.length == 6 &amp;&amp; labels.length == 28 &amp;&amp; hubs.length == 3 &amp;&amp; pairs.all (fun p =&gt; window p.1 != window p.2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{pairs}\right| = 6 \land \left|\mathrm{labels}\right| = 28 \land \left|\mathrm{hubs}\right| = 3 \land \forall p \in \mathrm{pairs},\; \mathrm{window}\mathopen{}\left(p_{1}\right) \neq \mathrm{window}\mathopen{}\left(p_{2}\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE CONTROL TELLS EVERY PAIR APART, AND THERE ARE PAIRS TO TELL ─────────────────────────────────── THE THEOREM THAT STOPS 1 AND 2 FROM BEING FREE. The same question, the same pairs, a reading that varies — and the answer must be the other one. Without this, theorems 1 and 2 are satisfied by a decision procedure that has broken in the direction of agreeing. THE COUNTS ARE PART OF THE STATEMENT AND NOT DECORATION. `pairs.all` is TRUE of an empty list, so a miscomputed `pairs` would satisfy theorems 1, 2 AND this one — the control included, which is the exact shape of a check that cannot fail. Six ordered pairs over three subjects, twenty-eight labels as counted off the ring: asserted here, so the thing that guards the others is itself guarded.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-the_ring_takes_one_value_and_the_control_takes_three">
<p class="thm-label"><strong>Theorem 1005</strong> (<code>the_ring_takes_one_value_and_the_control_takes_three</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_the_ring_takes_one_value_and_the_control_takes_three.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>valuesTaken</mi><mo>(</mo><mi>ring</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>valuesTaken</mi><mo>(</mo><mi>window</mi><mo>)</mo></mrow><mo>=</mo><mn>3</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>valuesTaken ring == 1 &amp;&amp; valuesTaken window == 3</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{valuesTaken}\mathopen{}\left(\mathrm{ring}\right) = 1 \land \mathrm{valuesTaken}\mathopen{}\left(\mathrm{window}\right) = 3</code></pre></details>
</div>
<p class="thm-remark">── 4 · ONE VALUE AGAINST THREE ─────────────────────────────────────────────────────────────────────────── The count is the whole difference between a frame and a decoration, and it is a number, not a word.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-no_label_of_the_ring_narrows_the_subject">
<p class="thm-label"><strong>Theorem 1006</strong> (<code>no_label_of_the_ring_narrows_the_subject</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_no_label_of_the_ring_narrows_the_subject.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>labels</mi><mo>,</mo><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>h</mi><mo>∈</mo><mi>hubs</mi><mo>∣</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>ring</mi><mo>(</mo><mi>h</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mrow><mo>|</mo><mi>hubs</mi><mo>|</mo></mrow></mrow><mo>∨</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>h</mi><mo>∈</mo><mi>hubs</mi><mo>∣</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>ring</mi><mo>(</mo><mi>h</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>labels.all (fun d =&gt; (hubs.filter (fun h =&gt; (ring h).contains d)).length == hubs.length || (hubs.filter (fun h =&gt; (ring h).contains d)).length == 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{labels},\; \left|\{\, h \in \mathrm{hubs} \mid d \in \mathrm{ring}\mathopen{}\left(h\right) \,\}\right| = \left|\mathrm{hubs}\right| \lor \left|\{\, h \in \mathrm{hubs} \mid d \in \mathrm{ring}\mathopen{}\left(h\right) \,\}\right| = 0</code></pre></details>
</div>
<p class="thm-remark">── 5 · NO LABEL IN THE RING IS EVIDENCE ABOUT THE SUBJECT ──────────────────────────────────────────────── Stronger than 2, and the form that matters to a reader: being told "this involves timbre algebra" narrows the subject to every subject. Each label is carried by all three hubs or by none.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-every_label_of_the_varying_reading_names_one_subject">
<p class="thm-label"><strong>Theorem 1007</strong> (<code>every_label_of_the_varying_reading_names_one_subject</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_every_label_of_the_varying_reading_names_one_subject.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mi>labels</mi><mo>,</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>h</mi><mo>∈</mo><mi>hubs</mi><mo>∣</mo><mrow><mi>d</mi><mo>∈</mo><mrow><mi>window</mi><mo>(</mo><mi>h</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>labels.all (fun d =&gt; (hubs.filter (fun h =&gt; (window h).contains d)).length == 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \mathrm{labels},\; \left|\{\, h \in \mathrm{hubs} \mid d \in \mathrm{window}\mathopen{}\left(h\right) \,\}\right| = 1</code></pre></details>
</div>
<p class="thm-remark">── 6 · EVERY LABEL OF THE CONTROL NAMES ITS SUBJECT ────────────────────────────────────────────────────── The control again, against 5: here a label identifies the hub uniquely, which is what a label is for.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-the_printed_balance_holds_only_when_the_soil_is_zero">
<p class="thm-label"><strong>Theorem 1008</strong> (<code>the_printed_balance_holds_only_when_the_soil_is_zero</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_the_printed_balance_holds_only_when_the_soil_is_zero.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>m</mi><mo>=</mo><mrow><mi>m</mi><mo>+</mo><mi>s</mi></mrow></mrow><mo>=</mo><mrow><mi>s</mi><mo>=</mo><mn>0</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 24).all (fun m =&gt; (List.range 24).all (fun s =&gt; (m == m + s) == (s == 0)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{0,\dots,23\},\; \forall s \in \{0,\dots,23\},\; m = m + s = s = 0</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE PRINTED BALANCE HOLDS ONLY WHEN NOTHING IS CARRIED ──────────────────────────────────────────── m_solv = m_solv + m_soil, exactly as printed, over every pair in range: true precisely when the soil is zero. The poster's line above it, V_tank = V_tank + T_tank, is the same statement about the tank.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 576 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-separation-the_intended_update_is_injective_in_the_soil">
<p class="thm-label"><strong>Theorem 1009</strong> (<code>the_intended_update_is_injective_in_the_soil</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_separation_the_intended_update_is_injective_in_the_soil.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>23</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>m</mi><mo>+</mo><mi>s</mi></mrow><mo>=</mo><mrow><mi>m</mi><mo>+</mo><mi>t</mi></mrow></mrow><mo>=</mo><mrow><mi>s</mi><mo>=</mo><mi>t</mi></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 24).all (fun m =&gt; (List.range 24).all (fun s =&gt; (List.range 24).all (fun t =&gt; ((m + s) == (m + t)) == (s == t))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall m \in \{0,\dots,23\},\; \forall s \in \{0,\dots,23\},\; \forall t \in \{0,\dots,23\},\; m + s = m + t = s = t</code></pre></details>
</div>
<p class="thm-remark">── 8 · WHAT WAS MEANT IS INJECTIVE IN EXACTLY WHAT THE EQUALS SIGN ANNIHILATED ──────────────────────────── An update, not an equation: the new solvent mass is the old plus the soil. Distinct soils give distinct states, so the quantity theorem 7 forces to zero is the quantity the corrected form carries. The defect is not that the line is false — it is that the only reading under which it is true erases its subject.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 13,824 cases. <span class="qed">□</span></p>

</div>
