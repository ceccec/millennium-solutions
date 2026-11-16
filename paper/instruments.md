---
title: "The instruments, and the three rules they are allowed to have"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `instruments.lean`

<p class="paper-src"><code>src/iso/9001-governance/instruments.lean</code> · namespace <code>Instruments</code> · 28 theorems · wing <code>the floor</code></p>

WHY THESE THREE ARE IN LEAN AND NOT IN THE GATE THAT USES THEM.

Three instruments in this tree were corrected in one week, and every one of them was corrected in the same

  uses.ts            searched pages for whether they cite the author, and returned exactly one YES across
                     85 leads — on a page that cites nobody. The page echoed the scanner's own User-Agent
                     back, and that User-Agent names the author's site. The instrument matched the string
                     it had just sent, and it was the single flattering result in the run.
  receipt-audit.ts   failed forever on 29 receipts written five weeks before the rule they are judged by.
                     Excusing them needs a boundary in time, and a boundary that widens by one instant
                     excuses a receipt written today.
  theorem-pages-gate printed one line per missing page and read as hundreds of broken theorems, when the
                     only thing wrong was a build nobody had run since the ledger grew.

Each fix was a rule, and each rule was first written as logic inside the gate, checked — where it was
checked at all — by that same gate. A gate reporting on its own guard is the shape this deposit refuses
everywhere else. So the rules are decided here, over their whole cases, and the TypeScript is required to
agree with what the kernel decided (scripts/lean-agree.ts).

No axioms, no Mathlib, no sorry. Every theorem closes by exhaustion over a stated finite domain.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>UA := [117, 97, 58, 115, 105, 116, 101]          -- "ua:site"
SITE := [115, 105, 116, 101]                     -- "site" — the signal a citation is read by
echoed := [60, 112, 62] ++ UA ++ [60, 47, 112, 62]        -- "&lt;p&gt;ua:site&lt;/p&gt;"
genuine := [60, 112, 62] ++ SITE ++ [60, 47, 112, 62]     -- "&lt;p&gt;site&lt;/p&gt;"
twice := UA ++ [32] ++ UA
paths := List.range 4
settledHere := 28</code></pre>

<div class="thm" id="thm-instruments-the_strict_order_is_what_is_admitted">
<p class="thm-label"><strong>Theorem 372</strong> (<code>the_strict_order_is_what_is_admitted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_strict_order_is_what_is_admitted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>precedes</mi><mo>(</mo><mrow><mi>some</mi><mo>(</mo><mn>4</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>precedes</mi><mo>(</mo><mrow><mi>some</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>precedes</mi><mo>(</mo><mrow><mi>some</mi><mo>(</mo><mn>6</mn><mo>)</mo></mrow><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>precedes (some 4) (some 5) = true ∧ precedes (some 5) (some 5) = false ∧ precedes (some 6) (some 5) = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{precedes}\mathopen{}\left(\mathrm{some}\mathopen{}\left(4\right),\,\mathrm{some}\mathopen{}\left(5\right)\right) = \mathrm{true} \land \mathrm{precedes}\mathopen{}\left(\mathrm{some}\mathopen{}\left(5\right),\,\mathrm{some}\mathopen{}\left(5\right)\right) = \mathrm{false} \land \mathrm{precedes}\mathopen{}\left(\mathrm{some}\mathopen{}\left(6\right),\,\mathrm{some}\mathopen{}\left(5\right)\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-admission_is_exactly_the_strict_order">
<p class="thm-label"><strong>Theorem 373</strong> (<code>admission_is_exactly_the_strict_order</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_admission_is_exactly_the_strict_order.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>precedes</mi><mo>(</mo><mrow><mi>some</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>decide</mi><mo>(</mo><mrow><mi>a</mi><mo>&lt;</mo><mi>b</mi></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 12).all (fun a =&gt; (List.range 12).all (fun b =&gt; precedes (some a) (some b) == decide (a &lt; b)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,11\},\; \forall b \in \{0,\dots,11\},\; \mathrm{precedes}\mathopen{}\left(\mathrm{some}\mathopen{}\left(a\right),\,\mathrm{some}\mathopen{}\left(b\right)\right) = \mathrm{decide}\mathopen{}\left(a &lt; b\right)</code></pre></details>
</div>
<p class="thm-remark">and it is not an accident of one triple: over every pair of instants below twelve</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 144 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-an_unknown_instant_is_never_admitted">
<p class="thm-label"><strong>Theorem 374</strong> (<code>an_unknown_instant_is_never_admitted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_an_unknown_instant_is_never_admitted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mi>precedes</mi><mo>(</mo><mi>none</mi><mo>,</mo><mrow><mi>some</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow><mo>∧</mo><mrow><mrow><mi>precedes</mi><mo>(</mo><mrow><mi>some</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mo>,</mo><mi>none</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>precedes</mi><mo>(</mo><mi>none</mi><mo>,</mo><mi>none</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 12).all (fun t =&gt; precedes none (some t) == false &amp;&amp; precedes (some t) none == false) ∧ precedes none none = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall t \in \{0,\dots,11\},\; \mathrm{precedes}\mathopen{}\left(\mathrm{none},\,\mathrm{some}\mathopen{}\left(t\right)\right) = \mathrm{false} \land \mathrm{precedes}\mathopen{}\left(\mathrm{some}\mathopen{}\left(t\right),\,\mathrm{none}\right) = \mathrm{false} \land \mathrm{precedes}\mathopen{}\left(\mathrm{none},\,\mathrm{none}\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">THE UNKNOWN IS NEVER ADMITTED, in either position, whatever the other one is</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 12 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-the_boundary_refuses_more_than_it_admits">
<p class="thm-label"><strong>Theorem 375</strong> (<code>the_boundary_refuses_more_than_it_admits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_boundary_refuses_more_than_it_admits.html">sealed</a>.</p>
<pre class="thm-statement"><code>let cases := (List.range 8).map (fun a =&gt; precedes (some a) (some 4)) cases.count true = 4 ∧ cases.count false = 4</code></pre>
</div>
<p class="thm-remark">and the admitted cases are a proper fraction of the whole: a rule that admitted everything would satisfy every line above except this one</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 8 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-a_hole_is_an_absence_with_a_later_presence">
<p class="thm-label"><strong>Theorem 376</strong> (<code>a_hole_is_an_absence_with_a_later_presence</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_a_hole_is_an_absence_with_a_later_presence.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>holes</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>tail</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>holes [true, false, true, true] = [1] ∧ tail [true, false, true, true] = []</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{holes}\mathopen{}\left([\mathrm{true},\,\mathrm{false},\,\mathrm{true},\,\mathrm{true}]\right) = [1] \land \mathrm{tail}\mathopen{}\left([\mathrm{true},\,\mathrm{false},\,\mathrm{true},\,\mathrm{true}]\right) = []</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-a_stale_tail_is_an_absence_with_nothing_after_it">
<p class="thm-label"><strong>Theorem 377</strong> (<code>a_stale_tail_is_an_absence_with_nothing_after_it</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_a_stale_tail_is_an_absence_with_nothing_after_it.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>tail</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mn>3</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>holes</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>tail [true, true, false, false] = [2, 3] ∧ holes [true, true, false, false] = []</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{tail}\mathopen{}\left([\mathrm{true},\,\mathrm{true},\,\mathrm{false},\,\mathrm{false}]\right) = [2,\,3] \land \mathrm{holes}\mathopen{}\left([\mathrm{true},\,\mathrm{true},\,\mathrm{false},\,\mathrm{false}]\right) = []</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 2 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-the_two_causes_occur_together_and_stay_apart">
<p class="thm-label"><strong>Theorem 378</strong> (<code>the_two_causes_occur_together_and_stay_apart</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_two_causes_occur_together_and_stay_apart.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>holes</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>tail</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>holes [true, false, true, false] = [1] ∧ tail [true, false, true, false] = [3]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{holes}\mathopen{}\left([\mathrm{true},\,\mathrm{false},\,\mathrm{true},\,\mathrm{false}]\right) = [1] \land \mathrm{tail}\mathopen{}\left([\mathrm{true},\,\mathrm{false},\,\mathrm{true},\,\mathrm{false}]\right) = [3]</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-nothing_built_is_all_tail_and_no_hole">
<p class="thm-label"><strong>Theorem 379</strong> (<code>nothing_built_is_all_tail_and_no_hole</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_nothing_built_is_all_tail_and_no_hole.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>holes</mi><mo>(</mo><mrow><mo>[</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>tail</mi><mo>(</mo><mrow><mo>[</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>0</mn><mo>,</mo><mn>1</mn><mo>,</mo><mn>2</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mi>lastPresent</mi><mo>(</mo><mrow><mo>[</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>,</mo><mi>false</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>none</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>holes [false, false, false] = [] ∧ tail [false, false, false] = [0, 1, 2] ∧ lastPresent [false, false, false] = none</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{holes}\mathopen{}\left([\mathrm{false},\,\mathrm{false},\,\mathrm{false}]\right) = [] \land \mathrm{tail}\mathopen{}\left([\mathrm{false},\,\mathrm{false},\,\mathrm{false}]\right) = [0,\,1,\,2] \land \mathrm{lastPresent}\mathopen{}\left([\mathrm{false},\,\mathrm{false},\,\mathrm{false}]\right) = \mathrm{none}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 3 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-everything_built_accuses_nobody">
<p class="thm-label"><strong>Theorem 380</strong> (<code>everything_built_accuses_nobody</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_everything_built_accuses_nobody.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>holes</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>tail</mi><mo>(</mo><mrow><mo>[</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>,</mo><mi>true</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>holes [true, true, true] = [] ∧ tail [true, true, true] = []</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{holes}\mathopen{}\left([\mathrm{true},\,\mathrm{true},\,\mathrm{true}]\right) = [] \land \mathrm{tail}\mathopen{}\left([\mathrm{true},\,\mathrm{true},\,\mathrm{true}]\right) = []</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-the_pattern_generator_is_complete">
<p class="thm-label"><strong>Theorem 381</strong> (<code>the_pattern_generator_is_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_pattern_generator_is_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mo>|</mo><mrow><mi>bits</mi><mo>(</mo><mn>5</mn><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>32</mn></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>bits</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mi>dedup</mi><mo>(</mo><mrow><mi>bits</mi><mo>(</mo><mn>3</mn><mo>)</mo></mrow><mo>)</mo></mrow><mo>|</mo></mrow><mo>=</mo><mn>8</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>(bits 5).length = 32 ∧ (bits 3).length = 8 ∧ ((bits 3).eraseDups).length = 8</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\left|\mathrm{bits}\mathopen{}\left(5\right)\right| = 32 \land \left|\mathrm{bits}\mathopen{}\left(3\right)\right| = 8 \land \left|\operatorname{dedup}\left(\mathrm{bits}\mathopen{}\left(3\right)\right)\right| = 8</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-every_absence_is_charged_to_exactly_one_cause">
<p class="thm-label"><strong>Theorem 382</strong> (<code>every_absence_is_charged_to_exactly_one_cause</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_every_absence_is_charged_to_exactly_one_cause.html">sealed</a>.</p>
<pre class="thm-statement"><code>((bits 1) ++ (bits 2) ++ (bits 3) ++ (bits 4) ++ (bits 5)).all (fun l =&gt; let h := holes l let t := tail l let missing := (idx l).filterMap (fun p =&gt; if !p.2 then some p.1 else none) (h.all (fun x =&gt; !(t.contains x))) &amp;&amp; ((h ++ t).length == missing.length) &amp;&amp; missing.all (fun m =&gt; (h ++ t).contains m))</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-an_echo_carries_the_signal_only_until_it_is_subtracted">
<p class="thm-label"><strong>Theorem 383</strong> (<code>an_echo_carries_the_signal_only_until_it_is_subtracted</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_an_echo_carries_the_signal_only_until_it_is_subtracted.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>contains</mi><mo>(</mo><mi>echoed</mi><mo>,</mo><mi>SITE</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>contains</mi><mo>(</mo><mrow><mi>clip</mi><mo>(</mo><mi>echoed</mi><mo>)</mo></mrow><mo>,</mo><mi>SITE</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>contains echoed SITE = true ∧ contains (clip echoed) SITE = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{contains}\mathopen{}\left(\mathrm{echoed},\,\mathrm{SITE}\right) = \mathrm{true} \land \mathrm{contains}\mathopen{}\left(\mathrm{clip}\mathopen{}\left(\mathrm{echoed}\right),\,\mathrm{SITE}\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-the_page_s_own_words_survive_the_subtraction">
<p class="thm-label"><strong>Theorem 384</strong> (<code>the_page_s_own_words_survive_the_subtraction</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_page_s_own_words_survive_the_subtraction.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>contains</mi><mo>(</mo><mi>genuine</mi><mo>,</mo><mi>SITE</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>contains</mi><mo>(</mo><mrow><mi>clip</mi><mo>(</mo><mi>genuine</mi><mo>)</mo></mrow><mo>,</mo><mi>SITE</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>contains genuine SITE = true ∧ contains (clip genuine) SITE = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{contains}\mathopen{}\left(\mathrm{genuine},\,\mathrm{SITE}\right) = \mathrm{true} \land \mathrm{contains}\mathopen{}\left(\mathrm{clip}\mathopen{}\left(\mathrm{genuine}\right),\,\mathrm{SITE}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-every_copy_of_the_witness_is_removed">
<p class="thm-label"><strong>Theorem 385</strong> (<code>every_copy_of_the_witness_is_removed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_every_copy_of_the_witness_is_removed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>contains</mi><mo>(</mo><mrow><mi>clip</mi><mo>(</mo><mi>twice</mi><mo>)</mo></mrow><mo>,</mo><mi>SITE</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></math></div>
<pre class="thm-statement"><code>contains (clip twice) SITE = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{contains}\mathopen{}\left(\mathrm{clip}\mathopen{}\left(\mathrm{twice}\right),\,\mathrm{SITE}\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-subtracting_twice_is_subtracting_once">
<p class="thm-label"><strong>Theorem 386</strong> (<code>subtracting_twice_is_subtracting_once</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_subtracting_twice_is_subtracting_once.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>clip</mi><mo>(</mo><mrow><mi>clip</mi><mo>(</mo><mi>echoed</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>clip</mi><mo>(</mo><mi>echoed</mi><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>clip</mi><mo>(</mo><mrow><mi>clip</mi><mo>(</mo><mi>genuine</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>clip</mi><mo>(</mo><mi>genuine</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>clip (clip echoed) = clip echoed ∧ clip (clip genuine) = clip genuine</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{clip}\mathopen{}\left(\mathrm{clip}\mathopen{}\left(\mathrm{echoed}\right)\right) = \mathrm{clip}\mathopen{}\left(\mathrm{echoed}\right) \land \mathrm{clip}\mathopen{}\left(\mathrm{clip}\mathopen{}\left(\mathrm{genuine}\right)\right) = \mathrm{clip}\mathopen{}\left(\mathrm{genuine}\right)</code></pre></details>
</div>
<p class="thm-remark">the subtraction is idempotent: applying it again changes nothing, so it cannot keep eating the page</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-an_empty_witness_removes_nothing">
<p class="thm-label"><strong>Theorem 387</strong> (<code>an_empty_witness_removes_nothing</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_an_empty_witness_removes_nothing.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>unreflect</mi><mo>(</mo><mrow><mo>|</mo><mi>genuine</mi><mo>|</mo></mrow><mo>,</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>,</mo><mi>genuine</mi><mo>)</mo></mrow><mo>=</mo><mi>genuine</mi></mrow><mo>∧</mo><mrow><mrow><mi>unreflect</mi><mo>(</mo><mrow><mo>|</mo><mi>echoed</mi><mo>|</mo></mrow><mo>,</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>,</mo><mi>echoed</mi><mo>)</mo></mrow><mo>=</mo><mi>echoed</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>unreflect genuine.length [] genuine = genuine ∧ unreflect echoed.length [] echoed = echoed</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{unreflect}\mathopen{}\left(\left|\mathrm{genuine}\right|,\,[],\,\mathrm{genuine}\right) = \mathrm{genuine} \land \mathrm{unreflect}\mathopen{}\left(\left|\mathrm{echoed}\right|,\,[],\,\mathrm{echoed}\right) = \mathrm{echoed}</code></pre></details>
</div>
<p class="thm-remark">AND AN EMPTY WITNESS REMOVES NOTHING. Without this the definition would be satisfied by one that erases everything, and a scanner that erased every page would report a world that cites nobody.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-text_without_the_witness_is_untouched">
<p class="thm-label"><strong>Theorem 388</strong> (<code>text_without_the_witness_is_untouched</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_text_without_the_witness_is_untouched.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>clip</mi><mo>(</mo><mi>SITE</mi><mo>)</mo></mrow><mo>=</mo><mi>SITE</mi></mrow><mo>∧</mo><mrow><mrow><mi>clip</mi><mo>(</mo><mrow><mo>[</mo><mn>60</mn><mo>,</mo><mn>112</mn><mo>,</mo><mn>62</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mn>60</mn><mo>,</mo><mn>112</mn><mo>,</mo><mn>62</mn><mo>]</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>clip SITE = SITE ∧ clip [60, 112, 62] = [60, 112, 62]</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{clip}\mathopen{}\left(\mathrm{SITE}\right) = \mathrm{SITE} \land \mathrm{clip}\mathopen{}\left([60,\,112,\,62]\right) = [60,\,112,\,62]</code></pre></details>
</div>
<p class="thm-remark">text that never carried the witness is returned unchanged</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 9 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-any_negator_before_the_claim_refuses_it">
<p class="thm-label"><strong>Theorem 389</strong> (<code>any_negator_before_the_claim_refuses_it</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_any_negator_before_the_claim_refuses_it.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>refused</mi><mo>(</mo><mrow><mo>[</mo><mn>7</mn><mo>,</mo><mn>2</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>refused</mi><mo>(</mo><mrow><mo>[</mo><mn>7</mn><mo>,</mo><mn>9</mn><mo>]</mo></mrow><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>refused</mi><mo>(</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow><mo>,</mo><mn>5</mn><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>refused [7, 2, 9] 5 = true ∧ refused [7, 9] 5 = false ∧ refused [5] 5 = false</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{refused}\mathopen{}\left([7,\,2,\,9],\,5\right) = \mathrm{true} \land \mathrm{refused}\mathopen{}\left([7,\,9],\,5\right) = \mathrm{false} \land \mathrm{refused}\mathopen{}\left([5],\,5\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 6 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-the_window_is_monotone_in_the_claim_s_position">
<p class="thm-label"><strong>Theorem 390</strong> (<code>the_window_is_monotone_in_the_claim_s_position</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_window_is_monotone_in_the_claim_s_position.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>(</mo><mrow><mrow><mo>¬</mo><mrow><mi>refused</mi><mo>(</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow><mo>,</mo><mi>c</mi><mo>)</mo></mrow></mrow><mo>∨</mo><mrow><mi>refused</mi><mo>(</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow><mo>,</mo><mi>d</mi><mo>)</mo></mrow></mrow><mo>if</mo><mrow><mi>c</mi><mo>≤</mo><mi>d</mi></mrow><mo>;</mo><mo>otherwise</mo><mi>true</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 10).all (fun c =&gt; (List.range 10).all (fun d =&gt; if c ≤ d then (!(refused [3] c) || refused [3] d) else true))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,9\},\; \forall d \in \{0,\dots,9\},\; \begin{cases}\lnot \mathrm{refused}\mathopen{}\left([3],\,c\right) \lor \mathrm{refused}\mathopen{}\left([3],\,d\right) &amp; \text{if } c \le d\\ \mathrm{true} &amp; \text{otherwise}\end{cases}</code></pre></details>
</div>
<p class="thm-remark">MOVING THE CLAIM LATER CAN ONLY REFUSE IT MORE. If it were not monotone, a sentence could be cleared by a negator and then un-cleared by adding words after it, which is not a property of English or of this sweep.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-with_no_negator_nothing_is_cleared">
<p class="thm-label"><strong>Theorem 391</strong> (<code>with_no_negator_nothing_is_cleared</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_with_no_negator_nothing_is_cleared.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>refused</mi><mo>(</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>,</mo><mi>c</mi><mo>)</mo></mrow><mo>=</mo><mi>false</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 10).all (fun c =&gt; refused [] c == false)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall c \in \{0,\dots,9\},\; \mathrm{refused}\mathopen{}\left([],\,c\right) = \mathrm{false}</code></pre></details>
</div>
<p class="thm-remark">AND A SENTENCE THAT REFUSES NOTHING CLEARS NOTHING. Without this the definition is satisfied by a window that excuses everything, which is exactly the failure it exists to prevent — and it is the empty case, the one a reader assumes rather than checks.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-a_path_dirty_before_the_run_is_never_attributed_to_it">
<p class="thm-label"><strong>Theorem 392</strong> (<code>a_path_dirty_before_the_run_is_never_attributed_to_it</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_a_path_dirty_before_the_run_is_never_attributed_to_it.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mo>¬</mo><mrow><mi>p</mi><mo>∈</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun t =&gt; (mine (setOf a) (setOf b) (setOf t)).all (fun p =&gt; ! (setOf a).contains p))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \forall t \in \{0,\dots,15\},\; \forall p \in \mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(b\right),\,\mathrm{setOf}\mathopen{}\left(t\right)\right),\; \lnot p \in \mathrm{setOf}\mathopen{}\left(a\right)</code></pre></details>
</div>
<p class="thm-remark">1 · what was already dirty is never charged to the run</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-an_untracked_path_is_never_attributed">
<p class="thm-label"><strong>Theorem 393</strong> (<code>an_untracked_path_is_never_attributed</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_an_untracked_path_is_never_attributed.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>p</mi><mo>∈</mo><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>p</mi><mo>∈</mo><mrow><mi>setOf</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun t =&gt; (mine (setOf a) (setOf b) (setOf t)).all (fun p =&gt; (setOf t).contains p))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \forall t \in \{0,\dots,15\},\; \forall p \in \mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(b\right),\,\mathrm{setOf}\mathopen{}\left(t\right)\right),\; p \in \mathrm{setOf}\mathopen{}\left(t\right)</code></pre></details>
</div>
<p class="thm-remark">2 · nor is anything the tool was told not to touch</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-nothing_is_attributed_that_is_not_dirty_afterwards">
<p class="thm-label"><strong>Theorem 394</strong> (<code>nothing_is_attributed_that_is_not_dirty_afterwards</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_nothing_is_attributed_that_is_not_dirty_afterwards.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mi>subset</mi><mo>(</mo><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun t =&gt; subset (mine (setOf a) (setOf b) (setOf t)) (setOf b))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \forall t \in \{0,\dots,15\},\; \mathrm{subset}\mathopen{}\left(\mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(b\right),\,\mathrm{setOf}\mathopen{}\left(t\right)\right),\,\mathrm{setOf}\mathopen{}\left(b\right)\right)</code></pre></details>
</div>
<p class="thm-remark">3 · the attribution is contained in what is actually dirty — it never invents a path</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-a_wider_record_of_what_was_dirty_attributes_no_more">
<p class="thm-label"><strong>Theorem 395</strong> (<code>a_wider_record_of_what_was_dirty_attributes_no_more</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_a_wider_record_of_what_was_dirty_attributes_no_more.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>a'</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mo>¬</mo><mrow><mi>subset</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a'</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow><mo>∨</mo><mrow><mi>subset</mi><mo>(</mo><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a'</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mi>paths</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mi>paths</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun a' =&gt; (List.range 16).all (fun b =&gt; ! subset (setOf a) (setOf a') || subset (mine (setOf a') (setOf b) paths) (mine (setOf a) (setOf b) paths))))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall \mathrm{a'} \in \{0,\dots,15\},\; \forall b \in \{0,\dots,15\},\; \lnot \mathrm{subset}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(\mathrm{a'}\right)\right) \lor \mathrm{subset}\mathopen{}\left(\mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(\mathrm{a'}\right),\,\mathrm{setOf}\mathopen{}\left(b\right),\,\mathrm{paths}\right),\,\mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(b\right),\,\mathrm{paths}\right)\right)</code></pre></details>
</div>
<p class="thm-remark">4 · knowing MORE was already dirty can only ever charge the run with less</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-a_change_made_by_another_hand_during_the_run_is_charged_to_the_run">
<p class="thm-label"><strong>Theorem 396</strong> (<code>a_change_made_by_another_hand_during_the_run_is_charged_to_the_run</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_a_change_made_by_another_hand_during_the_run_is_charged_to_the_run.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∃</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>:</mo><mrow><mo>∃</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>:</mo><mrow><mo>∃</mo><mi>p</mi><mo>∈</mo><mi>paths</mi><mo>:</mo><mrow><mrow><mrow><mo>¬</mo><mrow><mi>p</mi><mo>∈</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mi>p</mi><mo>∈</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mi>p</mi><mo>∈</mo><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>b</mi><mo>)</mo></mrow><mo>,</mo><mi>paths</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).any (fun a =&gt; (List.range 16).any (fun b =&gt; paths.any (fun p =&gt; ! (setOf a).contains p &amp;&amp; (setOf b).contains p &amp;&amp; (mine (setOf a) (setOf b) paths).contains p)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\exists a \in \{0,\dots,15\} : \exists b \in \{0,\dots,15\} : \exists p \in \mathrm{paths} : \lnot p \in \mathrm{setOf}\mathopen{}\left(a\right) \land p \in \mathrm{setOf}\mathopen{}\left(b\right) \land p \in \mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(b\right),\,\mathrm{paths}\right)</code></pre></details>
</div>
<p class="thm-remark">5 · THE FINDING. A path that was clean when the run began, was written by somebody else during it, and is tracked, is attributed to the run. The sets cannot distinguish it from the run's own output, so a revert built on this rule deletes that work. This is the case that was hit twice.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 256 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-a_run_that_changes_nothing_attributes_nothing">
<p class="thm-label"><strong>Theorem 397</strong> (<code>a_run_that_changes_nothing_attributes_nothing</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_a_run_that_changes_nothing_attributes_nothing.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>t</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>15</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>mine</mi><mo>(</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>a</mi><mo>)</mo></mrow><mo>,</mo><mrow><mi>setOf</mi><mo>(</mo><mi>t</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mo>[</mo><mo>]</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun t =&gt; mine (setOf a) (setOf a) (setOf t) == []))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,15\},\; \forall t \in \{0,\dots,15\},\; \mathrm{mine}\mathopen{}\left(\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(a\right),\,\mathrm{setOf}\mathopen{}\left(t\right)\right) = []</code></pre></details>
</div>
<p class="thm-remark">6 · a run that changed nothing here charges nothing here, whatever was dirty before</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 256 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-reverting_once_leaves_nothing_further_to_attribute">
<p class="thm-label"><strong>Theorem 398</strong> (<code>reverting_once_leaves_nothing_further_to_attribute</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_reverting_once_leaves_nothing_further_to_attribute.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; (List.range 16).all (fun t =&gt; let m := mine (setOf a) (setOf b) (setOf t) mine (setOf a) ((setOf b).filter (fun p =&gt; ! m.contains p)) (setOf t) == [])))</code></pre>
</div>
<p class="thm-remark">7 · THIS WAS A SECOND SPELLING OF 6 — `.length = 0` beside `== []`, two derivations of one fact, which is the defect this repository is named for catching. It says something of its own now: the revert is complete in ONE pass. Attribute again over what is left after reverting and nothing is attributed, so no sweep can find more to delete on a second look. An instrument that had to run its own revert twice would be one whose first pass did not mean what it said.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 4,096 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-instruments-the_reverted_and_the_untouched_partition_what_is_dirty">
<p class="thm-label"><strong>Theorem 399</strong> (<code>the_reverted_and_the_untouched_partition_what_is_dirty</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_instruments_the_reverted_and_the_untouched_partition_what_is_dirty.html">sealed</a>.</p>
<pre class="thm-statement"><code>(List.range 16).all (fun a =&gt; (List.range 16).all (fun b =&gt; let m := mine (setOf a) (setOf b) paths let rest := (setOf b).filter (fun p =&gt; ! m.contains p) m.all (fun p =&gt; ! rest.contains p) &amp;&amp; (setOf b).all (fun p =&gt; m.contains p || rest.contains p)))</code></pre>
</div>
<p class="thm-remark">8 · reverted and left-alone partition what is dirty: nothing is both, nothing is neither</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 256 cases. <span class="qed">□</span></p>

</div>
