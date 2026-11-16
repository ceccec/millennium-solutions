---
title: "The CHSH circuits sent to a quantum device give exactly 2√2, decided over the cyclotomic integers"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_circuits.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_circuits.lean</code> · namespace <code>QuantumCircuits</code> · 8 theorems · wing <code>the machine</code></p>

WHY ℤ[ω] AND NOT FLOATS. Every angle the circuits use is a multiple of π/4, so with each rz written as diag(1, ω^k)
(it differs from the device's rz by a global phase, which no probability can see) and sx as ½[[1+i, 1−i], [1−i, 1+i]]
with i = ω², every amplitude is an element of ℤ[ω] over a power of two. Probabilities are then elements of ℤ[√2]
over 2¹⁴, and E = ±√2/2 is an equality of integer quadruples the kernel decides.

WHAT IT REFUSES TO SAY. This decides what an IDEAL device would return for these exact gates. It decides nothing
about any real device: that is the provider's job record, judged by quantum_hardware.lean's integer rule.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>P := (1, 0, 1, 0)   -- 1 + i
M := (1, 0, -1, 0)  -- 1 − i
bell := [.rz 0 2, .sx 0, .rz 0 2, .rz 1 2, .sx 1, .rz 1 2, .cz, .rz 1 2, .sx 1, .rz 1 2]</code></pre>

<div class="thm" id="thm-quantum_circuits-the_sent_preparation_is_a_bell_pair">
<p class="thm-label"><strong>Theorem 1347</strong> (<code>the_sent_preparation_is_a_bell_pair</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_the_sent_preparation_is_a_bell_pair.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><msub><msub><mrow><mi>run</mi><mo>(</mo><mi>bell</mi><mo>)</mo></mrow><mn>2</mn></msub><mn>1</mn></msub><mo>=</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><msub><msub><msub><mrow><mi>run</mi><mo>(</mo><mi>bell</mi><mo>)</mo></mrow><mn>2</mn></msub><mn>2</mn></msub><mn>1</mn></msub><mo>=</mo><mrow><mo>(</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><msub><mrow><mi>run</mi><mo>(</mo><mi>bell</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>=</mo><msub><msub><msub><mrow><mi>run</mi><mo>(</mo><mi>bell</mi><mo>)</mo></mrow><mn>2</mn></msub><mn>2</mn></msub><mn>2</mn></msub></mrow></mrow><mo>∧</mo><mrow><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>norm</mi><mo>(</mo><msub><mrow><mi>run</mi><mo>(</mo><mi>bell</mi><mo>)</mo></mrow><mn>1</mn></msub><mo>)</mo></mrow><mo>,</mo><mrow><mi>norm</mi><mo>(</mo><msub><msub><msub><mrow><mi>run</mi><mo>(</mo><mi>bell</mi><mo>)</mo></mrow><mn>2</mn></msub><mn>2</mn></msub><mn>2</mn></msub><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>64</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(run bell).2.1 = (0, 0, 0, 0) ∧ (run bell).2.2.1 = (0, 0, 0, 0) ∧ (run bell).1 = (run bell).2.2.2 ∧ zadd (norm (run bell).1) (norm (run bell).2.2.2) = (64, 0, 0, 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{run}\mathopen{}\left(\mathrm{bell}\right)_{2}_{1} = \left(0,\,0,\,0,\,0\right) \land \mathrm{run}\mathopen{}\left(\mathrm{bell}\right)_{2}_{2}_{1} = \left(0,\,0,\,0,\,0\right) \land \mathrm{run}\mathopen{}\left(\mathrm{bell}\right)_{1} = \mathrm{run}\mathopen{}\left(\mathrm{bell}\right)_{2}_{2}_{2} \land \mathrm{zadd}\mathopen{}\left(\mathrm{norm}\mathopen{}\left(\mathrm{run}\mathopen{}\left(\mathrm{bell}\right)_{1}\right),\,\mathrm{norm}\mathopen{}\left(\mathrm{run}\mathopen{}\left(\mathrm{bell}\right)_{2}_{2}_{2}\right)\right) = \left(64,\,0,\,0,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-alice_zero_bob_plus_quarter_correlates_root_two_over_two">
<p class="thm-label"><strong>Theorem 1348</strong> (<code>alice_zero_bob_plus_quarter_correlates_root_two_over_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_alice_zero_bob_plus_quarter_correlates_root_two_over_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>total</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>16384</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>root2</mi><mo>(</mo><mn>8192</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>total (chsh 4 5) = (16384, 0, 0, 0) ∧ corr (chsh 4 5) = root2 8192</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{total}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,5\right)\right) = \left(16384,\,0,\,0,\,0\right) \land \mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,5\right)\right) = \mathrm{root2}\mathopen{}\left(8192\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-alice_zero_bob_minus_quarter_correlates_root_two_over_two">
<p class="thm-label"><strong>Theorem 1349</strong> (<code>alice_zero_bob_minus_quarter_correlates_root_two_over_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_alice_zero_bob_minus_quarter_correlates_root_two_over_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>total</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>16384</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>root2</mi><mo>(</mo><mn>8192</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>total (chsh 4 3) = (16384, 0, 0, 0) ∧ corr (chsh 4 3) = root2 8192</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{total}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,3\right)\right) = \left(16384,\,0,\,0,\,0\right) \land \mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,3\right)\right) = \mathrm{root2}\mathopen{}\left(8192\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-alice_half_bob_plus_quarter_correlates_root_two_over_two">
<p class="thm-label"><strong>Theorem 1350</strong> (<code>alice_half_bob_plus_quarter_correlates_root_two_over_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_alice_half_bob_plus_quarter_correlates_root_two_over_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>total</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>16384</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>root2</mi><mo>(</mo><mn>8192</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>total (chsh 6 5) = (16384, 0, 0, 0) ∧ corr (chsh 6 5) = root2 8192</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{total}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,5\right)\right) = \left(16384,\,0,\,0,\,0\right) \land \mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,5\right)\right) = \mathrm{root2}\mathopen{}\left(8192\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-alice_half_bob_minus_quarter_anticorrelates_root_two_over_two">
<p class="thm-label"><strong>Theorem 1351</strong> (<code>alice_half_bob_minus_quarter_anticorrelates_root_two_over_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_alice_half_bob_minus_quarter_anticorrelates_root_two_over_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>total</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>16384</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>root2</mi><mo>(</mo><mrow><mo>−</mo><mn>8192</mn></mrow><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>total (chsh 6 3) = (16384, 0, 0, 0) ∧ corr (chsh 6 3) = root2 (-8192)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{total}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,3\right)\right) = \left(16384,\,0,\,0,\,0\right) \land \mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,3\right)\right) = \mathrm{root2}\mathopen{}\left(-8192\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-the_sent_circuits_reach_s_two_root_two">
<p class="thm-label"><strong>Theorem 1352</strong> (<code>the_sent_circuits_reach_s_two_root_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_the_sent_circuits_reach_s_two_root_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>zadd</mi><mo>(</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>zneg</mi><mo>(</mo><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>6</mn><mo>,</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>root2</mi><mo>(</mo><mn>32768</mn><mo>)</mo></mrow></mrow></math></div>
<pre class="thm-statement"><code>zadd (zadd (corr (chsh 4 5)) (corr (chsh 4 3))) (zadd (corr (chsh 6 5)) (zneg (corr (chsh 6 3)))) = root2 32768</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{zadd}\mathopen{}\left(\mathrm{zadd}\mathopen{}\left(\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,5\right)\right),\,\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,3\right)\right)\right),\,\mathrm{zadd}\mathopen{}\left(\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,5\right)\right),\,\mathrm{zneg}\mathopen{}\left(\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(6,\,3\right)\right)\right)\right)\right) = \mathrm{root2}\mathopen{}\left(32768\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-bob_at_angle_zero_correlates_fully_not_root_two_over_two">
<p class="thm-label"><strong>Theorem 1353</strong> (<code>bob_at_angle_zero_correlates_fully_not_root_two_over_two</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_bob_at_angle_zero_correlates_fully_not_root_two_over_two.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>16384</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>corr</mi><mo>(</mo><mrow><mi>chsh</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>4</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>root2</mi><mo>(</mo><mn>8192</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>corr (chsh 4 4) = (16384, 0, 0, 0) ∧ corr (chsh 4 4) ≠ root2 8192</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,4\right)\right) = \left(16384,\,0,\,0,\,0\right) \land \mathrm{corr}\mathopen{}\left(\mathrm{chsh}\mathopen{}\left(4,\,4\right)\right) \neq \mathrm{root2}\mathopen{}\left(8192\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_circuits-without_the_entangler_the_correlation_vanishes">
<p class="thm-label"><strong>Theorem 1354</strong> (<code>without_the_entangler_the_correlation_vanishes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumcircuits_without_the_entangler_the_correlation_vanishes.html">sealed</a>.</p>
<pre class="thm-statement"><code>corr ((bell.filter (fun g =&gt; match g with | .cz =&gt; false | _ =&gt; true)) ++ [.rz 0 4, .sx 0, .rz 0 4, .sx 0, .rz 1 4, .sx 1, .rz 1 5, .sx 1]) = (0, 0, 0, 0)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
