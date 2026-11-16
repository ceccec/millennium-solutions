---
title: "The register is a dial — a wider hexbit width clears the ISO floor, and costs exactly that much more to simulate"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `width.lean`

<p class="paper-src"><code>src/iso/iec-9834-8-identifiers/width.lean</code> · namespace <code>Width</code> · 8 theorems · wing <code>the address</code></p>

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>isoFloor := 128                       -- the ISO post-quantum floor
widths := [4, 8, 16, 32]         -- qpu's four hexbit widths; width 4 is the 128-bit UUID</code></pre>

<div class="thm" id="thm-width-the_register_at_each_width">
<p class="thm-label"><strong>Theorem 142</strong> (<code>the_register_at_each_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_the_register_at_each_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>reg</mi><mo>[</mo><mi>widths</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>122</mn><mo>,</mo><mn>246</mn><mo>,</mo><mn>494</mn><mo>,</mo><mn>990</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mrow><mn>32</mn><mo>⋅</mo><mi>w</mi></mrow><mo>-</mo><mi>w</mi></mrow><mo>-</mo><mn>2</mn></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mo>=</mo><mrow><mrow><mn>31</mn><mo>⋅</mo><mi>w</mi></mrow><mo>-</mo><mn>2</mn></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>widths.map reg = [122, 246, 494, 990] ∧ widths.all (fun w =&gt; reg w == 32 * w - w - 2) ∧ widths.all (fun w =&gt; reg w == 31 * w - 2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{reg}[\mathrm{widths}] = [122,\,246,\,494,\,990] \land \forall w \in \mathrm{widths},\; \mathrm{reg}\mathopen{}\left(w\right) = 32 \cdot w - w - 2 \land \forall w \in \mathrm{widths},\; \mathrm{reg}\mathopen{}\left(w\right) = 31 \cdot w - 2</code></pre></details>
</div>
<p class="thm-remark">── 1 · THE REGISTER AT EACH WIDTH, AND THE TWO FORMULAS AGREE ───────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-width-the_grover_exponent_at_each_width">
<p class="thm-label"><strong>Theorem 143</strong> (<code>the_grover_exponent_at_each_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_the_grover_exponent_at_each_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>grover</mi><mo>[</mo><mi>widths</mi><mo>]</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>61</mn><mo>,</mo><mn>123</mn><mo>,</mo><mn>247</mn><mo>,</mo><mn>495</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mo>=</mo><mfrac><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mn>2</mn></mfrac></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>widths.map grover = [61, 123, 247, 495] ∧ widths.all (fun w =&gt; grover w == reg w / 2)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{grover}[\mathrm{widths}] = [61,\,123,\,247,\,495] \land \forall w \in \mathrm{widths},\; \mathrm{grover}\mathopen{}\left(w\right) = \frac{\mathrm{reg}\mathopen{}\left(w\right)}{2}</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE GROVER EXPONENT AT EACH WIDTH ───────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-width-the_iso_floor_is_cleared_exactly_from_width_sixteen">
<p class="thm-label"><strong>Theorem 144</strong> (<code>the_iso_floor_is_cleared_exactly_from_width_sixteen</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_the_iso_floor_is_cleared_exactly_from_width_sixteen.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mi>isoFloor</mi><mo>≤</mo><mrow><mi>grover</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mn>16</mn><mo>≤</mo><mi>w</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>&lt;</mo><mi>isoFloor</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>&lt;</mo><mi>isoFloor</mi></mrow></mrow><mo>∧</mo><mrow><mi>isoFloor</mi><mo>≤</mo><mrow><mi>grover</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mi>isoFloor</mi><mo>≤</mo><mrow><mi>grover</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>widths.all (fun w =&gt; (isoFloor ≤ grover w) == (16 ≤ w)) ∧ grover 4 &lt; isoFloor ∧ grover 8 &lt; isoFloor ∧ isoFloor ≤ grover 16 ∧ isoFloor ≤ grover 32</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall w \in \mathrm{widths},\; \mathrm{isoFloor} \le \mathrm{grover}\mathopen{}\left(w\right) = 16 \le w \land \mathrm{grover}\mathopen{}\left(4\right) &lt; \mathrm{isoFloor} \land \mathrm{grover}\mathopen{}\left(8\right) &lt; \mathrm{isoFloor} \land \mathrm{isoFloor} \le \mathrm{grover}\mathopen{}\left(16\right) \land \mathrm{isoFloor} \le \mathrm{grover}\mathopen{}\left(32\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · THE FLOOR IS A FUNCTION OF THE WIDTH: CLEARED EXACTLY FROM WIDTH SIXTEEN ───────────────────────── The 67-bit shortfall of the UUID is not fixed — it is the width-4 instance. Among the four widths the floor is cleared iff w ≥ 16; width 8 (a 256-bit identifier) still falls five bits short, which is why the name is 16.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-width-clearing_the_floor_is_two_hundred_fifty_six_free_bits">
<p class="thm-label"><strong>Theorem 145</strong> (<code>clearing_the_floor_is_two_hundred_fifty_six_free_bits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_clearing_the_floor_is_two_hundred_fifty_six_free_bits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mi>isoFloor</mi><mo>≤</mo><mrow><mi>grover</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mn>256</mn><mo>≤</mo><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>&lt;</mo><mn>256</mn></mrow></mrow><mo>∧</mo><mrow><mn>256</mn><mo>≤</mo><mrow><mi>reg</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>widths.all (fun w =&gt; (isoFloor ≤ grover w) == (256 ≤ reg w)) ∧ reg 8 &lt; 256 ∧ 256 ≤ reg 16</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall w \in \mathrm{widths},\; \mathrm{isoFloor} \le \mathrm{grover}\mathopen{}\left(w\right) = 256 \le \mathrm{reg}\mathopen{}\left(w\right) \land \mathrm{reg}\mathopen{}\left(8\right) &lt; 256 \land 256 \le \mathrm{reg}\mathopen{}\left(16\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · AND THAT IS EXACTLY TWO HUNDRED FIFTY-SIX FREE BITS — capacity.lean's threshold, read on the width ──</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-width-the_uuid_is_width_four_and_sits_sixty_seven_below">
<p class="thm-label"><strong>Theorem 146</strong> (<code>the_uuid_is_width_four_and_sits_sixty_seven_below</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_the_uuid_is_width_four_and_sits_sixty_seven_below.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>reg</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>122</mn></mrow><mo>∧</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>=</mo><mn>61</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mi>isoFloor</mi><mo>-</mo><mrow><mi>grover</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow></mrow><mo>=</mo><mn>67</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mn>32</mn><mo>⋅</mo><mn>4</mn></mrow><mo>=</mo><mn>128</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>reg 4 = 122 ∧ grover 4 = 61 ∧ isoFloor - grover 4 = 67 ∧ 32 * 4 = 128</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{reg}\mathopen{}\left(4\right) = 122 \land \mathrm{grover}\mathopen{}\left(4\right) = 61 \land \mathrm{isoFloor} - \mathrm{grover}\mathopen{}\left(4\right) = 67 \land 32 \cdot 4 = 128</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE UUID IS WIDTH FOUR — the 122 register, 67 below the floor, that the deposit already seals ──────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-width-the_register_grows_strictly_with_the_width">
<p class="thm-label"><strong>Theorem 147</strong> (<code>the_register_grows_strictly_with_the_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_the_register_grows_strictly_with_the_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mrow><mrow><mi>reg</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>reg</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>reg</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>reg</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>grover</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>grover</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>grover</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>reg 4 &lt; reg 8 ∧ reg 8 &lt; reg 16 ∧ reg 16 &lt; reg 32 ∧ grover 4 &lt; grover 8 ∧ grover 8 &lt; grover 16 ∧ grover 16 &lt; grover 32</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{reg}\mathopen{}\left(4\right) &lt; \mathrm{reg}\mathopen{}\left(8\right) \land \mathrm{reg}\mathopen{}\left(8\right) &lt; \mathrm{reg}\mathopen{}\left(16\right) \land \mathrm{reg}\mathopen{}\left(16\right) &lt; \mathrm{reg}\mathopen{}\left(32\right) \land \mathrm{grover}\mathopen{}\left(4\right) &lt; \mathrm{grover}\mathopen{}\left(8\right) \land \mathrm{grover}\mathopen{}\left(8\right) &lt; \mathrm{grover}\mathopen{}\left(16\right) \land \mathrm{grover}\mathopen{}\left(16\right) &lt; \mathrm{grover}\mathopen{}\left(32\right)</code></pre></details>
</div>
<p class="thm-remark">── 6 · THE DIAL ONLY TURNS UP: register and Grover exponent strictly increase across the widths ──────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-width-clearing_the_floor_needs_a_cost_exponent_of_at_least_256">
<p class="thm-label"><strong>Theorem 148</strong> (<code>clearing_the_floor_needs_a_cost_exponent_of_at_least_256</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_clearing_the_floor_needs_a_cost_exponent_of_at_least_256.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mn>256</mn><mo>≤</mo><mrow><mi>reg</mi><mo>(</mo><mn>16</mn><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mn>8</mn><mo>)</mo></mrow><mo>&lt;</mo><mn>256</mn></mrow></mrow><mo>∧</mo><mrow><msup><mn>2</mn><mn>128</mn></msup><mo>&lt;</mo><msup><mn>2</mn><mn>256</mn></msup></mrow></mrow></math></div>
<pre class="thm-statement"><code>256 ≤ reg 16 ∧ reg 8 &lt; 256 ∧ 2 ^ 128 &lt; 2 ^ 256</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>256 \le \mathrm{reg}\mathopen{}\left(16\right) \land \mathrm{reg}\mathopen{}\left(8\right) &lt; 256 \land 2^{128} &lt; 2^{256}</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE COST OF CLEARING IT: the register IS the amplitude exponent, so clearing needs ≥ 256 bits of it ─ A classical state-vector over the register is 2^(reg w) amplitudes. Clearing the floor means reg ≥ 256, i.e. at least 2^256 amplitudes — the same number as the security the floor asks for. Decided on the exponents.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-width-the_cost_exponent_is_more_than_the_square_root_exponent_at_every_width">
<p class="thm-label"><strong>Theorem 149</strong> (<code>the_cost_exponent_is_more_than_the_square_root_exponent_at_every_width</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_width_the_cost_exponent_is_more_than_the_square_root_exponent_at_every_width.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mi>grover</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mo>&lt;</mo><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>w</mi><mo>∈</mo><mi>widths</mi><mo>,</mo><mrow><mrow><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mo>-</mo><mrow><mi>grover</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow></mrow><mo>=</mo><mfrac><mrow><mrow><mi>reg</mi><mo>(</mo><mi>w</mi><mo>)</mo></mrow><mo>+</mo><mn>1</mn></mrow><mn>2</mn></mfrac></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>reg</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>-</mo><mrow><mi>grover</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow></mrow><mo>&lt;</mo><mrow><mrow><mi>reg</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow><mo>-</mo><mrow><mi>grover</mi><mo>(</mo><mn>32</mn><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>widths.all (fun w =&gt; grover w &lt; reg w) ∧ widths.all (fun w =&gt; reg w - grover w == (reg w + 1) / 2) ∧ (reg 4 - grover 4) &lt; (reg 32 - grover 32)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall w \in \mathrm{widths},\; \mathrm{grover}\mathopen{}\left(w\right) &lt; \mathrm{reg}\mathopen{}\left(w\right) \land \forall w \in \mathrm{widths},\; \mathrm{reg}\mathopen{}\left(w\right) - \mathrm{grover}\mathopen{}\left(w\right) = \frac{\mathrm{reg}\mathopen{}\left(w\right) + 1}{2} \land \mathrm{reg}\mathopen{}\left(4\right) - \mathrm{grover}\mathopen{}\left(4\right) &lt; \mathrm{reg}\mathopen{}\left(32\right) - \mathrm{grover}\mathopen{}\left(32\right)</code></pre></details>
</div>
<p class="thm-remark">── 8 · THE CONTROL — CAPACITY IS NOT CAPABILITY ───────────────────────────────────────────────────────── The cost exponent (reg w) is always MORE than the square-root exponent (grover w = reg w / 2), by exactly half the register, and the gap WIDENS with the dial. So the width that clears the floor is the width that makes the simulation larger: raising it buys capacity and never a speedup. This is the control the whole file rests on — if raising the width ever made grover w ≥ reg w, capacity would have bought capability, and it never does.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
