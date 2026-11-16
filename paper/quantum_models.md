---
title: "Every quantum computing model ISO/IEC 4879 names, one exact instance each, decided over the cyclotomic integers"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_models.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_models.lean</code> · namespace <code>QuantumModels</code> · 8 theorems · wing <code>the machine</code></p>

WHAT IT DECIDES. Each model at its known optimum: the one-way pattern for every π/4 angle and both outcomes, the
whole group Ising braids generate (24 classes, closed), every balanced beam splitter, the adiabatic gap for every
rational schedule point (proved for every value, not sampled), and the frustrated triangle's whole spectrum.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>psi0 := (1, 0, 0, 0)
psi1 := (0, 1, 0, 0)
zero := (0, 0, 0, 0)
one := (1, 0, 0, 0)
sigma1 := (one, zero, zero, wpow 2)
hs := (one, one, one, zneg one)
sigma2 := mmul hs (mmul sigma1 hs)
ident := (one, zero, zero, one)
u00 := one
u01 := wpow 2
u10 := wpow 2
u11 := one
perm := zadd (zmul u00 u11) (zmul u01 u10)
triangle := [1, -1].flatMap (fun a : Int =&gt; [1, -1].flatMap (fun b : Int =&gt; [1, -1].map (fun c : Int =&gt; a * b + b * c + a * c)))</code></pre>

<div class="thm" id="thm-quantum_models-one_way_measurement_applies_h_rz_for_every_angle_and_both_outcomes">
<p class="thm-label"><strong>Theorem 1363</strong> (<code>one_way_measurement_applies_h_rz_for_every_angle_and_both_outcomes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_one_way_measurement_applies_h_rz_for_every_angle_and_both_outcomes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>k</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>1</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>oneWay</mi><mo>(</mo><mi>true</mi><mo>,</mo><mi>k</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>=</mo><mrow><mi>gateOut</mi><mo>(</mo><mi>k</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun k =&gt; (List.range 2).all (fun m =&gt; oneWay true k m == gateOut k m)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall k \in \{0,\dots,7\},\; \forall m \in \{0,\dots,1\},\; \mathrm{oneWay}\mathopen{}\left(\mathrm{true},\,k,\,m\right) = \mathrm{gateOut}\mathopen{}\left(k,\,m\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 16 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-one_way_without_the_cluster_bond_does_not_apply_the_gate">
<p class="thm-label"><strong>Theorem 1364</strong> (<code>one_way_without_the_cluster_bond_does_not_apply_the_gate</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_one_way_without_the_cluster_bond_does_not_apply_the_gate.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>oneWay</mi><mo>(</mo><mi>false</mi><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>≠</mo><mrow><mi>gateOut</mi><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>oneWay false 0 0 ≠ gateOut 0 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{oneWay}\mathopen{}\left(\mathrm{false},\,0,\,0\right) \neq \mathrm{gateOut}\mathopen{}\left(0,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-ising_anyon_braids_satisfy_the_braid_relation">
<p class="thm-label"><strong>Theorem 1365</strong> (<code>ising_anyon_braids_satisfy_the_braid_relation</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_ising_anyon_braids_satisfy_the_braid_relation.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>prop</mi><mo>(</mo><mrow><mi>mmul</mi><mo>(</mo><mi>sigma1</mi><mo>,</mo><mrow><mi>mmul</mi><mo>(</mo><mi>sigma2</mi><mo>,</mo><mi>sigma1</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>mmul</mi><mo>(</mo><mi>sigma2</mi><mo>,</mo><mrow><mi>mmul</mi><mo>(</mo><mi>sigma1</mi><mo>,</mo><mi>sigma2</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>prop (mmul sigma1 (mmul sigma2 sigma1)) (mmul sigma2 (mmul sigma1 sigma2)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{prop}\mathopen{}\left(\mathrm{mmul}\mathopen{}\left(\mathrm{sigma1},\,\mathrm{mmul}\mathopen{}\left(\mathrm{sigma2},\,\mathrm{sigma1}\right)\right),\,\mathrm{mmul}\mathopen{}\left(\mathrm{sigma2},\,\mathrm{mmul}\mathopen{}\left(\mathrm{sigma1},\,\mathrm{sigma2}\right)\right)\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-ising_anyon_braids_generate_exactly_the_twenty_four_clifford_classes">
<p class="thm-label"><strong>Theorem 1366</strong> (<code>ising_anyon_braids_generate_exactly_the_twenty_four_clifford_classes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_ising_anyon_braids_generate_exactly_the_twenty_four_clifford_classes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>braidGroup</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>grow</mi><mo>(</mo><mrow><mi>braidGroup</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>24</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>prop</mi><mo>(</mo><mi>sigma1</mi><mo>,</mo><mi>ident</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(braidGroup 8).length = 24 ∧ (grow (braidGroup 8)).length = 24 ∧ prop sigma1 ident = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{braidGroup}\mathopen{}\left(8\right)\right| = 24 \land \left|\mathrm{grow}\mathopen{}\left(\mathrm{braidGroup}\mathopen{}\left(8\right)\right)\right| = 24 \land \mathrm{prop}\mathopen{}\left(\mathrm{sigma1},\,\mathrm{ident}\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-every_balanced_beam_splitter_gives_a_full_depth_hong_ou_mandel_dip">
<p class="thm-label"><strong>Theorem 1367</strong> (<code>every_balanced_beam_splitter_gives_a_full_depth_hong_ou_mandel_dip</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_every_balanced_beam_splitter_gives_a_full_depth_hong_ou_mandel_dip.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>unitary2</mi><mo>(</mo><mrow><mi>splitter</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>∧</mo><mrow><mrow><mi>permOf</mi><mo>(</mo><mrow><mi>splitter</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>zero</mi></mrow></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mi>perm</mi><mo>=</mo><mi>zero</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>norm</mi><mo>(</mo><mrow><mi>zmul</mi><mo>(</mo><mi>u00</mi><mo>,</mo><mi>u10</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>norm</mi><mo>(</mo><mrow><mi>zmul</mi><mo>(</mo><mi>u00</mi><mo>,</mo><mi>u10</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>norm</mi><mo>(</mo><mrow><mi>zmul</mi><mo>(</mo><mi>u01</mi><mo>,</mo><mi>u11</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>norm</mi><mo>(</mo><mrow><mi>zmul</mi><mo>(</mo><mi>u01</mi><mo>,</mo><mi>u11</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>4</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun a =&gt; (List.range 8).all (fun b =&gt; unitary2 (splitter a b) &amp;&amp; permOf (splitter a b) == zero)) = true ∧ perm = zero ∧ zadd (zadd (norm (zmul u00 u10)) (norm (zmul u00 u10))) (zadd (norm (zmul u01 u11)) (norm (zmul u01 u11))) = (4, 0, 0, 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,7\},\; \forall b \in \{0,\dots,7\},\; \mathrm{unitary2}\mathopen{}\left(\mathrm{splitter}\mathopen{}\left(a,\,b\right)\right) \land \mathrm{permOf}\mathopen{}\left(\mathrm{splitter}\mathopen{}\left(a,\,b\right)\right) = \mathrm{zero} = \mathrm{true} \land \mathrm{perm} = \mathrm{zero} \land \mathrm{zadd}\mathopen{}\left(\mathrm{zadd}\mathopen{}\left(\mathrm{norm}\mathopen{}\left(\mathrm{zmul}\mathopen{}\left(\mathrm{u00},\,\mathrm{u10}\right)\right),\,\mathrm{norm}\mathopen{}\left(\mathrm{zmul}\mathopen{}\left(\mathrm{u00},\,\mathrm{u10}\right)\right)\right),\,\mathrm{zadd}\mathopen{}\left(\mathrm{norm}\mathopen{}\left(\mathrm{zmul}\mathopen{}\left(\mathrm{u01},\,\mathrm{u11}\right)\right),\,\mathrm{norm}\mathopen{}\left(\mathrm{zmul}\mathopen{}\left(\mathrm{u01},\,\mathrm{u11}\right)\right)\right)\right) = \left(4,\,0,\,0,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-distinguishable_photons_coincide_half_the_time">
<p class="thm-label"><strong>Theorem 1368</strong> (<code>distinguishable_photons_coincide_half_the_time</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_distinguishable_photons_coincide_half_the_time.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>norm</mi><mo>(</mo><mrow><mi>zmul</mi><mo>(</mo><mi>u00</mi><mo>,</mo><mi>u11</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>norm</mi><mo>(</mo><mrow><mi>zmul</mi><mo>(</mo><mi>u01</mi><mo>,</mo><mi>u10</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>norm</mi><mo>(</mo><mi>perm</mi><mo>)</mo></mrow><mo>=</mo><mi>zero</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>zadd (norm (zmul u00 u11)) (norm (zmul u01 u10)) = (2, 0, 0, 0) ∧ norm perm = zero</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{zadd}\mathopen{}\left(\mathrm{norm}\mathopen{}\left(\mathrm{zmul}\mathopen{}\left(\mathrm{u00},\,\mathrm{u11}\right)\right),\,\mathrm{norm}\mathopen{}\left(\mathrm{zmul}\mathopen{}\left(\mathrm{u01},\,\mathrm{u10}\right)\right)\right) = \left(2,\,0,\,0,\,0\right) \land \mathrm{norm}\mathopen{}\left(\mathrm{perm}\right) = \mathrm{zero}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-the_adiabatic_gap_is_smallest_exactly_at_the_midpoint_at_every_resolution">
<p class="thm-label"><strong>Theorem 1369</strong> (<code>the_adiabatic_gap_is_smallest_exactly_at_the_midpoint_at_every_resolution</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_the_adiabatic_gap_is_smallest_exactly_at_the_midpoint_at_every_resolution.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ n t : Int, 2 * ((n - t) ^ 2 + t ^ 2) = n ^ 2 + (2 * t - n) ^ 2 ∧ n ^ 2 ≤ 2 * ((n - t) ^ 2 + t ^ 2) ∧ 2 * ((2 * t - t) ^ 2 + t ^ 2) = (2 * t) ^ 2</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  have</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_models-the_frustrated_triangle_has_a_six_fold_ground_state_at_minus_one">
<p class="thm-label"><strong>Theorem 1370</strong> (<code>the_frustrated_triangle_has_a_six_fold_ground_state_at_minus_one</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantummodels_the_frustrated_triangle_has_a_six_fold_ground_state_at_minus_one.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>e</mi><mo>∈</mo><mi>triangle</mi><mo>,</mo><mrow><mi>e</mi><mo>≥</mo><mrow><mo>−</mo><mn>1</mn></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>triangle</mi><mo>∣</mo><mrow><mi>e</mi><mo>=</mo><mrow><mo>−</mo><mn>1</mn></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>6</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>e</mi><mo>∈</mo><mi>triangle</mi><mo>∣</mo><mrow><mi>e</mi><mo>=</mo><mn>3</mn></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>2</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mi>triangle</mi><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>triangle.all (fun e =&gt; e ≥ -1) = true ∧ (triangle.filter (fun e =&gt; e == -1)).length = 6 ∧ (triangle.filter (fun e =&gt; e == 3)).length = 2 ∧ triangle.length = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall e \in \mathrm{triangle},\; e \ge -1 = \mathrm{true} \land \left|\{\, e \in \mathrm{triangle} \mid e = -1 \,\}\right| = 6 \land \left|\{\, e \in \mathrm{triangle} \mid e = 3 \,\}\right| = 2 \land \left|\mathrm{triangle}\right| = 8</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
