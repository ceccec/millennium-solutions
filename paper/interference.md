---
title: "Interference: GHZ cancels on odd parity, a classical coin does not"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `interference.lean`

<p class="paper-src"><code>src/iso/iec-4879-quantum/interference.lean</code> · namespace <code>Interference</code> · 2 theorems · wing <code>the floor</code></p>

WHAT QUANTUM MEANS HERE, IN ONE SENTENCE: amplitudes add, and two paths that reach the same outcome can cancel.
A classical mixture adds probabilities, which are never negative, so nothing cancels.

THE CAPTAIN'S COIN (coin.lean) flips the three bits together: |000⟩ or |111⟩, each with weight 1/2. In the
computational basis its statistics are those of GHZ, and so are its marginals (quantum.lean records this). So the
coin is not, by itself, evidence of entanglement. The difference shows only in the X basis.

Encoding. The Hadamard transform on three qubits sends |x⟩ to a sum over outcomes s of (-1)^{parity(x ∧ s)}|s⟩.
A branch contributes a PLUS at s when that parity is even, and a MINUS when it is odd. The GHZ state has two
branches, |000⟩ and |111⟩, and they add on s when their signs agree and cancel when they differ.

Everything is Nat and Bool, so each theorem is closed by `decide` and carries no axiom beyond the kernel's.

<div class="thm" id="thm-interference-ghz_cancels_exactly_on_odd_parity">
<p class="thm-label"><strong>Theorem 400</strong> (<code>ghz_cancels_exactly_on_odd_parity</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_interference_ghz_cancels_exactly_on_odd_parity.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>ghzCancels</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mi>par3</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>1</mn></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun s =&gt; ghzCancels s == (par3 s == 1)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall s \in \{0,\dots,7\},\; \mathrm{ghzCancels}\mathopen{}\left(s\right) = \mathrm{par3}\mathopen{}\left(s\right) = 1 = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">── 1 · GHZ CANCELS, AND ONLY ON ODD PARITY ────────────────────────────────────────────────────────────── On every odd-parity outcome the two GHZ branches have opposite signs and cancel exactly; on every even-parity outcome they agree and add. This is the interference a classical mixture does not have.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-interference-ghz_reaches_exactly_the_four_even_outcomes">
<p class="thm-label"><strong>Theorem 401</strong> (<code>ghz_reaches_exactly_the_four_even_outcomes</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_interference_ghz_reaches_exactly_the_four_even_outcomes.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>|</mo><mrow><mo>{</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mo>¬</mo><mrow><mi>ghzCancels</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow></mrow><mo>}</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>4</mn></mrow><mo>∧</mo><mrow><mrow><mo>∀</mo><mi>s</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mi>ghzCancels</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mrow><mi>par3</mi><mo>(</mo><mi>s</mi><mo>)</mo></mrow><mo>=</mo><mn>0</mn></mrow></mrow></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>((List.range 8).filter (fun s =&gt; !ghzCancels s)).length = 4 ∧ (List.range 8).all (fun s =&gt; !ghzCancels s == (par3 s == 0)) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\{\, s \in \{0,\dots,7\} \mid \lnot \mathrm{ghzCancels}\mathopen{}\left(s\right) \,\}\right| = 4 \land \forall s \in \{0,\dots,7\},\; \lnot \mathrm{ghzCancels}\mathopen{}\left(s\right) = \mathrm{par3}\mathopen{}\left(s\right) = 0 = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE OUTCOMES GHZ REACHES ───────────────────────────────────────────────────────────────────────── Over the eight outcomes, GHZ reaches exactly the four even-parity ones. Its X-basis support is half the space, and the four it misses are the odd-parity strings.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 64 cases. <span class="qed">□</span></p>

</div>
