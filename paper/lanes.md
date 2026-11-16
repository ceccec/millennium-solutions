---
title: "How many checkers may run at once, decided"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `lanes.lean`

<p class="paper-src"><code>src/iso/9001-governance/lanes.lean</code> · namespace <code>Lanes</code> · 8 theorems · wing <code>the floor</code></p>

WHY THIS FILE EXISTS.

src/api/lanes.ts decides how many Lean processes may elaborate at once. It is the tree's only statement
about TIME and SPACE: too few lanes and a release takes twenty-two minutes, too many and the machine
swaps while every core reads as busy. Until now the rule was TypeScript and a comment, and the comment
carried the honest part — `totalmem()/2` is "a guess, and named as one".

A guess is the wrong kind of thing to hold a safety bound. The question "can this many lean processes fit
in this much memory" is arithmetic over a finite domain, which is the one kind of question this deposit
answers by exhaustion. So the bound is decided here and src/api/lanes.ts implements what is decided.

THE ONE THAT MATTERS IS THEOREM 3. Lanes never exceed what memory affords. Every other property is
comfort; that one is why raising the lane count is safe whenever the arithmetic says it is, and why it is
not safe when the arithmetic says otherwise — including on a host nobody has measured.

No axioms, no Mathlib, no sorry.

<div class="thm" id="thm-lanes-a_lane_is_always_granted">
<p class="thm-label"><strong>Theorem 402</strong> (<code>a_lane_is_always_granted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_a_lane_is_always_granted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mi>r</mi><mo>)</mo></mrow><mo>≥</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≥</mo><mn>1</mn></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun c =&gt; (List.range 9).all (fun m =&gt; (List.range 9).all (fun r =&gt; lanesKnown c m r ≥ 1 &amp;&amp; lanesUnknown c m ≥ 1)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,8\},\; \forall m \in \{0,\dots,8\},\; \forall r \in \{0,\dots,8\},\; \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,r\right) \ge 1 \land \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \ge 1</code></pre></details>
</div>
<p class="thm-remark">── 1 · A BUILD ALWAYS MAKES PROGRESS ───────────────────────────────────────────────────────────────────── Never zero, under any combination in range — including a machine that reports no cores and no memory. A budget of zero is not caution, it is a build that never finishes.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-lanes_never_exceed_the_cores_but_for_the_floor">
<p class="thm-label"><strong>Theorem 403</strong> (<code>lanes_never_exceed_the_cores_but_for_the_floor</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_lanes_never_exceed_the_cores_but_for_the_floor.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mi>r</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>max</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>max</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun c =&gt; (List.range 9).all (fun m =&gt; (List.range 9).all (fun r =&gt; lanesKnown c m r ≤ max 1 c &amp;&amp; lanesUnknown c m ≤ max 1 c)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,8\},\; \forall m \in \{0,\dots,8\},\; \forall r \in \{0,\dots,8\},\; \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,r\right) \le \mathrm{max}\mathopen{}\left(1,\,c\right) \land \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \le \mathrm{max}\mathopen{}\left(1,\,c\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · NEVER MORE LANES THAN CORES ─────────────────────────────────────────────────────────────────────── Except the floor of one: a single-core machine still gets its one lane, which is the whole of the exception and is stated rather than hidden inside a max.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-lanes_never_exceed_what_memory_affords">
<p class="thm-label"><strong>Theorem 404</strong> (<code>lanes_never_exceed_what_memory_affords</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_lanes_never_exceed_what_memory_affords.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mi>r</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>max</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>m</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>max</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>m</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun c =&gt; (List.range 9).all (fun m =&gt; (List.range 9).all (fun r =&gt; lanesKnown c m r ≤ max 1 m &amp;&amp; lanesUnknown c m ≤ max 1 m)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,8\},\; \forall m \in \{0,\dots,8\},\; \forall r \in \{0,\dots,8\},\; \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,r\right) \le \mathrm{max}\mathopen{}\left(1,\,m\right) \land \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \le \mathrm{max}\mathopen{}\left(1,\,m\right)</code></pre></details>
</div>
<p class="thm-remark">── 3 · AND NEVER MORE THAN MEMORY AFFORDS ──────────────────────────────────────────────────────────────── THE SAFETY BOUND. byMemory is ⌊reclaimable / perJob⌋, so lanes ≤ byMemory says exactly that the lanes granted, each taking up to perJob, fit inside what was measured as reclaimable. This is the property that makes raising the count safe when the arithmetic allows it — and refuses it when it does not.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 729 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-unknown_is_never_better_than_measuring_an_empty_machine">
<p class="thm-label"><strong>Theorem 405</strong> (<code>unknown_is_never_better_than_measuring_an_empty_machine</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_unknown_is_never_better_than_measuring_an_empty_machine.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun c =&gt; (List.range 9).all (fun m =&gt; lanesUnknown c m ≤ lanesKnown c m 0))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,8\},\; \forall m \in \{0,\dots,8\},\; \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \le \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,0\right)</code></pre></details>
</div>
<p class="thm-remark">── 4 · NOT KNOWING COSTS LANES, IT NEVER BUYS THEM ─────────────────────────────────────────────────────── An unmeasured neighbour count must never grant MORE than measuring it and finding the machine empty. If it could, "I could not tell" would be the fastest configuration, and nobody would measure again.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-more_memory_never_costs_a_lane">
<p class="thm-label"><strong>Theorem 406</strong> (<code>more_memory_never_costs_a_lane</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_more_memory_never_costs_a_lane.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mi>r</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mrow><mi>m</mi><mo>+</mo><mn>1</mn></mrow><mo>,</mo><mi>r</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 8).all (fun c =&gt; (List.range 8).all (fun m =&gt; (List.range 8).all (fun r =&gt; lanesKnown c m r ≤ lanesKnown c (m + 1) r)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,7\},\; \forall m \in \{0,\dots,7\},\; \forall r \in \{0,\dots,7\},\; \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,r\right) \le \mathrm{lanesKnown}\mathopen{}\left(c,\,m + 1,\,r\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · MORE MEMORY NEVER MEANS FEWER LANES ─────────────────────────────────────────────────────────────── Monotone in the measurement, so a host that reports its memory honestly is never punished for it — the property that makes it safe to replace a guess with a real reading.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 512 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-more_neighbours_never_buys_a_lane">
<p class="thm-label"><strong>Theorem 407</strong> (<code>more_neighbours_never_buys_a_lane</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_more_neighbours_never_buys_a_lane.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>r</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>7</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mrow><mi>r</mi><mo>+</mo><mn>1</mn></mrow><mo>)</mo></mrow><mo>≤</mo><mrow><mi>lanesKnown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>,</mo><mi>r</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun c =&gt; (List.range 9).all (fun m =&gt; (List.range 8).all (fun r =&gt; lanesKnown c m (r + 1) ≤ lanesKnown c m r)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,8\},\; \forall m \in \{0,\dots,8\},\; \forall r \in \{0,\dots,7\},\; \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,r + 1\right) \le \mathrm{lanesKnown}\mathopen{}\left(c,\,m,\,r\right)</code></pre></details>
</div>
<p class="thm-remark">── 6 · AND MORE NEIGHBOURS NEVER MEANS MORE LANES ──────────────────────────────────────────────────────── The other direction of the same honesty: a busier machine never yields a larger claim on it.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 648 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-the_fallback_costs_half_the_lanes_at_the_size_that_prompted_this">
<p class="thm-label"><strong>Theorem 408</strong> (<code>the_fallback_costs_half_the_lanes_at_the_size_that_prompted_this</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_the_fallback_costs_half_the_lanes_at_the_size_that_prompted_this.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>2</mn></mrow><mo>∧</mo><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mn>4</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>lanesKnown</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>⋅</mo><mn>2</mn></mrow><mo>=</mo><mrow><mi>lanesKnown</mi><mo>(</mo><mn>4</mn><mo>,</mo><mn>4</mn><mo>,</mo><mn>0</mn><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>lanesKnown 4 2 0 = 2 ∧ lanesKnown 4 4 0 = 4 ∧ lanesKnown 4 2 0 * 2 = lanesKnown 4 4 0</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{lanesKnown}\mathopen{}\left(4,\,2,\,0\right) = 2 \land \mathrm{lanesKnown}\mathopen{}\left(4,\,4,\,0\right) = 4 \land \mathrm{lanesKnown}\mathopen{}\left(4,\,2,\,0\right) \cdot 2 = \mathrm{lanesKnown}\mathopen{}\left(4,\,4,\,0\right)</code></pre></details>
</div>
<p class="thm-remark">── 7 · THE GUESS AND THE MEASUREMENT, AT THE SIZE THAT PROMPTED THIS ───────────────────────────────────── The release runner reported `min(cores 4, memory 2 at ~2900MB each)` and took 21.6 minutes for the cold build. That memory term is ⌊reclaimable / 2900⌋ where reclaimable came from the `totalmem()/2` fallback, because src/api/lanes.ts reads vm_stat and vm_stat is macOS. Decided below at that exact shape: with four cores, a machine whose reclaimable memory affords four jobs grants twice the lanes of one that affords two — so what the fallback costs is not a rounding, it is half the build.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-lanes-an_unmeasurable_host_still_builds_and_still_fits">
<p class="thm-label"><strong>Theorem 409</strong> (<code>an_unmeasurable_host_still_builds_and_still_fits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_lanes_an_unmeasurable_host_still_builds_and_still_fits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>m</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>8</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≥</mo><mn>1</mn></mrow><mo>∧</mo><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>max</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>m</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>lanesUnknown</mi><mo>(</mo><mi>c</mi><mo>,</mo><mi>m</mi><mo>)</mo></mrow><mo>≤</mo><mrow><mi>max</mi><mo>(</mo><mn>1</mn><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 9).all (fun c =&gt; (List.range 9).all (fun m =&gt; lanesUnknown c m ≥ 1 &amp;&amp; lanesUnknown c m ≤ max 1 m &amp;&amp; lanesUnknown c m ≤ max 1 c))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,8\},\; \forall m \in \{0,\dots,8\},\; \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \ge 1 \land \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \le \mathrm{max}\mathopen{}\left(1,\,m\right) \land \mathrm{lanesUnknown}\mathopen{}\left(c,\,m\right) \le \mathrm{max}\mathopen{}\left(1,\,c\right)</code></pre></details>
</div>
<p class="thm-remark">── 8 · A HOST THAT CANNOT BE MEASURED IS STILL SAFE ────────────────────────────────────────────────────── Theorems 1 and 3 together, on the unknown branch alone: never zero, never over the memory bound. An unmeasurable host gets a working build that cannot oversubscribe.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 81 cases. <span class="qed">□</span></p>

</div>
