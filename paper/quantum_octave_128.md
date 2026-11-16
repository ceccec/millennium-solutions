---
title: "The 128-qubit octave, split into eight UUID particles — the Mermin lead 2⁶³ at the UUID width"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `quantum_octave_128.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/quantum_octave_128.lean</code> · namespace <code>QuantumOctave128</code> · 9 theorems · wing <code>the machine</code></p>

WHY EIGHT PARTICLES. Particle b holds the weights k with ⌊k/16⌋ = b (the last one also k = 128). Each checks that its
strings' GHZ expectations are real, Re(iᵏ), and sums its share of Σ C(128, k)·Re(iᵏ)·2⟨string_k⟩. Every particle
stands alone within the kernel's default budget, and this file stands apart from the other quantum files, so
scripts/lean.ts checks it in a lane of its own beside them, on the machine's cores. Nothing here is a device result.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>covered := (List.range 129).all (fun k =&gt; ((List.range 8).filter (fun b =&gt; inParticle b k)).length == 1)</code></pre>

<div class="thm" id="thm-quantum_octave_128-particle_zero_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1379</strong> (<code>particle_zero_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_zero_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>3525990486864069858</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 0 = true ∧ particleSum 0 = 3525990486864069858</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(0\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(0\right) = 3525990486864069858</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_one_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1380</strong> (<code>particle_one_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_one_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow><mo>=</mo><mn>337654250015596702913742461840</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 1 = true ∧ particleSum 1 = 337654250015596702913742461840</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(1\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(1\right) = 337654250015596702913742461840</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_two_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1381</strong> (<code>particle_two_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_two_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow><mo>=</mo><mn>411324807959075400680218172572805400</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 2 = true ∧ particleSum 2 = 411324807959075400680218172572805400</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(2\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(2\right) = 411324807959075400680218172572805400</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_three_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1382</strong> (<code>particle_three_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_three_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>=</mo><mn>145778712272927823445748804366324216880</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 3 = true ∧ particleSum 3 = 145778712272927823445748804366324216880</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(3\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(3\right) = 145778712272927823445748804366324216880</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_four_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1383</strong> (<code>particle_four_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_four_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>192812936693211996284838821959307547180</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 4 = true ∧ particleSum 4 = 192812936693211996284838821959307547180</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(4\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(4\right) = 192812936693211996284838821959307547180</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_five_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1384</strong> (<code>particle_five_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_five_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mn>1279389515917225289300042767401030000</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 5 = true ∧ particleSum 5 = 1279389515917225289300042767401030000</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(5\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(5\right) = 1279389515917225289300042767401030000</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_six_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1385</strong> (<code>particle_six_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_six_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>=</mo><mn>3293268092833471993876167655640</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 6 = true ∧ particleSum 6 = 3293268092833471993876167655640</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(6\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(6\right) = 3293268092833471993876167655640</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-particle_seven_of_the_128_qubit_octave">
<p class="thm-label"><strong>Theorem 1386</strong> (<code>particle_seven_of_the_128_qubit_octave</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_particle_seven_of_the_128_qubit_octave.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>particleReal</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow><mo>=</mo><mn>190212032889388424658</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>particleReal 7 = true ∧ particleSum 7 = 190212032889388424658</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{particleReal}\mathopen{}\left(7\right) = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(7\right) = 190212032889388424658</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-quantum_octave_128-octave_one_twenty_eight_qubits_the_uuid_width_leads_by_two_to_the_sixty_third">
<p class="thm-label"><strong>Theorem 1387</strong> (<code>octave_one_twenty_eight_qubits_the_uuid_width_leads_by_two_to_the_sixty_third</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_quantumoctave128_octave_one_twenty_eight_qubits_the_uuid_width_leads_by_two_to_the_sixty_third.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>covered</mi><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>particleSum</mi><mo>(</mo><mn>0</mn><mo>)</mo></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>1</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>2</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow></mrow><mo>+</mo><mrow><mi>particleSum</mi><mo>(</mo><mn>7</mn><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mn>2</mn><mo>⋅</mo><msup><mn>2</mn><mn>127</mn></msup></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reach</mi><mo>(</mo><mn>128</mn><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>6</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><msup><mn>2</mn><mfrac><mn>128</mn><mn>2</mn></mfrac></msup><mo>⋅</mo><msup><mn>2</mn><mn>63</mn></msup></mrow><mo>=</mo><msup><mn>2</mn><mrow><mn>128</mn><mo>-</mo><mn>1</mn></mrow></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>covered = true ∧ particleSum 0 + particleSum 1 + particleSum 2 + particleSum 3 + particleSum 4 + particleSum 5 + particleSum 6 + particleSum 7 = 2 * 2 ^ 127 ∧ reach 128 = [0, 2, 4, 6] ∧ 2 ^ (128 / 2) * 2 ^ 63 = 2 ^ (128 - 1)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{covered} = \mathrm{true} \land \mathrm{particleSum}\mathopen{}\left(0\right) + \mathrm{particleSum}\mathopen{}\left(1\right) + \mathrm{particleSum}\mathopen{}\left(2\right) + \mathrm{particleSum}\mathopen{}\left(3\right) + \mathrm{particleSum}\mathopen{}\left(4\right) + \mathrm{particleSum}\mathopen{}\left(5\right) + \mathrm{particleSum}\mathopen{}\left(6\right) + \mathrm{particleSum}\mathopen{}\left(7\right) = 2 \cdot 2^{127} \land \mathrm{reach}\mathopen{}\left(128\right) = [0,\,2,\,4,\,6] \land 2^{\frac{128}{2}} \cdot 2^{63} = 2^{128 - 1}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  refine</code> — exhausting 4 cases. <span class="qed">□</span></p>

</div>
