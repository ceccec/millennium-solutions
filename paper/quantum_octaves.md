---
title: "The Bell test scaled in octaves — 2, 4, 8 … 128 qubits — with the quantum lead doubling its exponent"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_octaves.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_octaves.lean</code> · namespace <code>QuantumOctaves</code> · 15 theorems · wing <code>the machine</code></p>

WHY 128 QUBITS FIT. The GHZ state (|0…0⟩ + |1…1⟩)/√2 has two basis states, and a string of X and Y flips every bit, so
its expectation is read from two phases carried qubit by qubit — Y contributes i on the way up and −i on the way down —
never from a 2¹²⁸-entry vector. The Mermin operator M = Re ∏ (X_j + iY_j) weights a string with k Y's by Re(iᵏ), and
the GHZ expectation of that string is Re(iᵏ) too, so the quantum value is Σ_k C(n, k)·Re(iᵏ)², counted exactly.

THE CLASSICAL RING — the horo of eight steps. A classical party answers x, y ∈ {±1}, and x + iy is √2·ω^e with e odd:
one of 1, 3, 5, 7 eighths of the circle. After n parties the phase has stepped Σ e eighths round the ring ℤ/8, and the
positions it can reach alternate — odd after an odd number of parties, even after an even number. At every even
octave all four even positions are reachable, the real part is at most 1, so the classical maximum is exactly 2^(n/2).

WHAT IT REFUSES TO SAY. At n = 2 there is no lead (2 against 2): Mermin's inequality starts to bite at three parties,
and the 2-qubit Bell test is CHSH, decided in quantum_circuits.lean. Nothing here is a device result.

<div class="thm" id="thm-quantum_octaves-every_classical_answer_is_root_two_times_an_odd_eighth_of_the_circle">
<p class="thm-label"><strong>Theorem 1388</strong> (<code>every_classical_answer_is_root_two_times_an_odd_eighth_of_the_circle</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_every_classical_answer_is_root_two_times_an_odd_eighth_of_the_circle.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>zmul</mi><mo>(</mo><mrow><mi>root2</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>wpow</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>zmul</mi><mo>(</mo><mrow><mi>root2</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>wpow</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>,</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>zmul</mi><mo>(</mo><mrow><mi>root2</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>wpow</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>,</mo><mn>0</mn><mo>,</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>zmul</mi><mo>(</mo><mrow><mi>root2</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>wpow</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>(</mo><mn>1</mn><mo>,</mo><mn>0</mn><mo>,</mo><mrow><mo>−</mo><mn>1</mn></mrow><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>zmul (root2 1) (wpow 1) = (1, 0, 1, 0) ∧ zmul (root2 1) (wpow 3) = (-1, 0, 1, 0) ∧ zmul (root2 1) (wpow 5) = (-1, 0, -1, 0) ∧ zmul (root2 1) (wpow 7) = (1, 0, -1, 0)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{zmul}\mathopen{}\left(\mathrm{root2}\mathopen{}\left(1\right),\,\mathrm{wpow}\mathopen{}\left(1\right)\right) = \left(1,\,0,\,1,\,0\right) \land \mathrm{zmul}\mathopen{}\left(\mathrm{root2}\mathopen{}\left(1\right),\,\mathrm{wpow}\mathopen{}\left(3\right)\right) = \left(-1,\,0,\,1,\,0\right) \land \mathrm{zmul}\mathopen{}\left(\mathrm{root2}\mathopen{}\left(1\right),\,\mathrm{wpow}\mathopen{}\left(5\right)\right) = \left(-1,\,0,\,-1,\,0\right) \land \mathrm{zmul}\mathopen{}\left(\mathrm{root2}\mathopen{}\left(1\right),\,\mathrm{wpow}\mathopen{}\left(7\right)\right) = \left(1,\,0,\,-1,\,0\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-octave_two_qubits_has_no_mermin_lead">
<p class="thm-label"><strong>Theorem 1389</strong> (<code>octave_two_qubits_has_no_mermin_lead</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_octave_two_qubits_has_no_mermin_lead.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>1</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mfrac><mn>2</mn><mn>2</mn></mfrac></msup><mo>=</mo><msup><mn>2</mn><mrow><mn>2</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>expectationsReal 2 = true ∧ twiceQuantum 2 = 2 * 2 ^ 1 ∧ reach 2 = [0, 2, 4, 6] ∧ 2 ^ (2 / 2) = 2 ^ (2 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{expectationsReal}\mathopen{}\left(2\right) = \mathrm{true} \land \mathrm{twiceQuantum}\mathopen{}\left(2\right) = 2 \cdot 2^{1} \land \mathrm{reach}\mathopen{}\left(2\right) = [0,\,2,\,4,\,6] \land 2^{\frac{2}{2}} = 2^{2 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-octave_four_qubits_quantum_eight_against_classical_four">
<p class="thm-label"><strong>Theorem 1390</strong> (<code>octave_four_qubits_quantum_eight_against_classical_four</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_octave_four_qubits_quantum_eight_against_classical_four.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>3</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mfrac><mn>4</mn><mn>2</mn></mfrac></msup><mo>&lt;</mo><msup><mn>2</mn><mrow><mn>4</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>expectationsReal 4 = true ∧ twiceQuantum 4 = 2 * 2 ^ 3 ∧ reach 4 = [0, 2, 4, 6] ∧ 2 ^ (4 / 2) &lt; 2 ^ (4 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{expectationsReal}\mathopen{}\left(4\right) = \mathrm{true} \land \mathrm{twiceQuantum}\mathopen{}\left(4\right) = 2 \cdot 2^{3} \land \mathrm{reach}\mathopen{}\left(4\right) = [0,\,2,\,4,\,6] \land 2^{\frac{4}{2}} &lt; 2^{4 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-octave_eight_qubits_quantum_128_against_classical_16">
<p class="thm-label"><strong>Theorem 1391</strong> (<code>octave_eight_qubits_quantum_128_against_classical_16</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_octave_eight_qubits_quantum_128_against_classical_16.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>7</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mfrac><mn>8</mn><mn>2</mn></mfrac></msup><mo>⋅</mo><msup><mn>2</mn><mn>3</mn></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mn>8</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>expectationsReal 8 = true ∧ twiceQuantum 8 = 2 * 2 ^ 7 ∧ reach 8 = [0, 2, 4, 6] ∧ 2 ^ (8 / 2) * 2 ^ 3 = 2 ^ (8 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{expectationsReal}\mathopen{}\left(8\right) = \mathrm{true} \land \mathrm{twiceQuantum}\mathopen{}\left(8\right) = 2 \cdot 2^{7} \land \mathrm{reach}\mathopen{}\left(8\right) = [0,\,2,\,4,\,6] \land 2^{\frac{8}{2}} \cdot 2^{3} = 2^{8 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-octave_sixteen_qubits_the_lead_is_two_to_the_seventh">
<p class="thm-label"><strong>Theorem 1392</strong> (<code>octave_sixteen_qubits_the_lead_is_two_to_the_seventh</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_octave_sixteen_qubits_the_lead_is_two_to_the_seventh.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>15</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mfrac><mn>16</mn><mn>2</mn></mfrac></msup><mo>⋅</mo><msup><mn>2</mn><mn>7</mn></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mn>16</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>expectationsReal 16 = true ∧ twiceQuantum 16 = 2 * 2 ^ 15 ∧ reach 16 = [0, 2, 4, 6] ∧ 2 ^ (16 / 2) * 2 ^ 7 = 2 ^ (16 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{expectationsReal}\mathopen{}\left(16\right) = \mathrm{true} \land \mathrm{twiceQuantum}\mathopen{}\left(16\right) = 2 \cdot 2^{15} \land \mathrm{reach}\mathopen{}\left(16\right) = [0,\,2,\,4,\,6] \land 2^{\frac{16}{2}} \cdot 2^{7} = 2^{16 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-octave_thirty_two_qubits_the_lead_is_two_to_the_fifteenth">
<p class="thm-label"><strong>Theorem 1393</strong> (<code>octave_thirty_two_qubits_the_lead_is_two_to_the_fifteenth</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_octave_thirty_two_qubits_the_lead_is_two_to_the_fifteenth.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>31</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mfrac><mn>32</mn><mn>2</mn></mfrac></msup><mo>⋅</mo><msup><mn>2</mn><mn>15</mn></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mn>32</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>expectationsReal 32 = true ∧ twiceQuantum 32 = 2 * 2 ^ 31 ∧ reach 32 = [0, 2, 4, 6] ∧ 2 ^ (32 / 2) * 2 ^ 15 = 2 ^ (32 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{expectationsReal}\mathopen{}\left(32\right) = \mathrm{true} \land \mathrm{twiceQuantum}\mathopen{}\left(32\right) = 2 \cdot 2^{31} \land \mathrm{reach}\mathopen{}\left(32\right) = [0,\,2,\,4,\,6] \land 2^{\frac{32}{2}} \cdot 2^{15} = 2^{32 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-octave_sixty_four_qubits_the_lead_is_two_to_the_thirty_first">
<p class="thm-label"><strong>Theorem 1394</strong> (<code>octave_sixty_four_qubits_the_lead_is_two_to_the_thirty_first</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_octave_sixty_four_qubits_the_lead_is_two_to_the_thirty_first.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>expectationsReal</mi><mo>(</mo><mn>64</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>twiceQuantum</mi><mo>(</mo><mn>64</mn><mo>)</mo></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>63</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>64</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mfrac><mn>64</mn><mn>2</mn></mfrac></msup><mo>⋅</mo><msup><mn>2</mn><mn>31</mn></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mn>64</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>expectationsReal 64 = true ∧ twiceQuantum 64 = 2 * 2 ^ 63 ∧ reach 64 = [0, 2, 4, 6] ∧ 2 ^ (64 / 2) * 2 ^ 31 = 2 ^ (64 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{expectationsReal}\mathopen{}\left(64\right) = \mathrm{true} \land \mathrm{twiceQuantum}\mathopen{}\left(64\right) = 2 \cdot 2^{63} \land \mathrm{reach}\mathopen{}\left(64\right) = [0,\,2,\,4,\,6] \land 2^{\frac{64}{2}} \cdot 2^{31} = 2^{64 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_classical_times_the_lead_is_the_quantum_at_every_width">
<p class="thm-label"><strong>Theorem 1395</strong> (<code>the_classical_times_the_lead_is_the_quantum_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_classical_times_the_lead_is_the_quantum_at_every_width.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 1 ≤ k → 2 ^ k * 2 ^ (k - 1) = 2 ^ (2 * k - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_lead_times_the_classical_is_the_quantum_at_every_width">
<p class="thm-label"><strong>Theorem 1396</strong> (<code>the_lead_times_the_classical_is_the_quantum_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_lead_times_the_classical_is_the_quantum_at_every_width.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 1 ≤ k → 2 ^ (k - 1) * 2 ^ k = 2 ^ (2 * k - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_lead_doubles_from_each_octave_to_the_next">
<p class="thm-label"><strong>Theorem 1397</strong> (<code>the_lead_doubles_from_each_octave_to_the_next</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_lead_doubles_from_each_octave_to_the_next.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 1 ≤ k → 2 * 2 ^ (k - 1) = 2 ^ k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_full_operator_is_the_classical_squared_at_every_width">
<p class="thm-label"><strong>Theorem 1398</strong> (<code>the_full_operator_is_the_classical_squared_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_full_operator_is_the_classical_squared_at_every_width.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 2 ^ (2 * k) = 2 ^ k * 2 ^ k</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_quantum_is_an_exact_multiple_of_the_classical_at_every_width">
<p class="thm-label"><strong>Theorem 1399</strong> (<code>the_quantum_is_an_exact_multiple_of_the_classical_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_quantum_is_an_exact_multiple_of_the_classical_at_every_width.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 1 ≤ k → 2 ^ k ∣ 2 ^ (2 * k - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_lead_divides_the_quantum_at_every_width">
<p class="thm-label"><strong>Theorem 1400</strong> (<code>the_lead_divides_the_quantum_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_lead_divides_the_quantum_at_every_width.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 1 ≤ k → 2 ^ (k - 1) ∣ 2 ^ (2 * k - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-every_octave_past_the_uuid_width_contains_the_demo_lead">
<p class="thm-label"><strong>Theorem 1401</strong> (<code>every_octave_past_the_uuid_width_contains_the_demo_lead</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_every_octave_past_the_uuid_width_contains_the_demo_lead.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 65 ≤ k → 2 ^ 63 ∣ 2 ^ (k - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octaves-the_quantum_strictly_exceeds_the_classical_from_four_qubits_up">
<p class="thm-label"><strong>Theorem 1402</strong> (<code>the_quantum_strictly_exceeds_the_classical_from_four_qubits_up</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctaves_the_quantum_strictly_exceeds_the_classical_from_four_qubits_up.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k, 2 ≤ k → 2 ^ k &lt; 2 ^ (2 * k - 1)</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
