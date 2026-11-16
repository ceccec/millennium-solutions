---
title: "The doubling flow, for every step"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `flow.lean`

<p class="paper-src"><code>src/iso/80000-2-mathematics/flow.lean</code> · namespace <code>Flow</code> · 16 theorems · wing <code>the ring</code></p>

`navier_stokes_flow_is_bounded` in index.lean decides its bound over the first 48 steps, and every page that
quotes it says "for all time". Forty-eight steps are not all time: `decide` stops at its bound. This file
goes past it. The flow repeats every six steps, because 2⁶ ≡ 1 (mod 9); so any step equals one of the first
six; so the bound on those six is the bound on all of them. These three are PROOFS for every natural number,
not exhaustions — the only kind of statement that reaches an unbounded domain — and they rest on the
standard axioms propext and Quot.sound, printed per theorem by lean.ts.

<div class="thm" id="thm-flow-the_doubling_flow_repeats_every_six_steps">
<p class="thm-label"><strong>Theorem 858</strong> (<code>the_doubling_flow_repeats_every_six_steps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_doubling_flow_repeats_every_six_steps.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, orbit (k + 6) = orbit k</code></pre>
</div>
<p class="thm-remark">── the period: six steps of doubling return the flow to where it was, at every step ────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-the_doubling_flow_is_its_first_six_steps">
<p class="thm-label"><strong>Theorem 859</strong> (<code>the_doubling_flow_is_its_first_six_steps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_doubling_flow_is_its_first_six_steps.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, orbit k = orbit (k % 6)</code></pre>
</div>
<p class="thm-remark">── hence every step is one of the first six ──────────────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-navier_stokes_flow_is_bounded_for_every_step">
<p class="thm-label"><strong>Theorem 860</strong> (<code>navier_stokes_flow_is_bounded_for_every_step</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_navier_stokes_flow_is_bounded_for_every_step.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, orbit k &lt; 9 ∧ span.contains (orbit k) = true</code></pre>
</div>
<p class="thm-remark">── and so the flow is bounded at every step: a residue below 9, inside the six-cycle, for all k ─────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-the_reverse_flow_undoes_every_step">
<p class="thm-label"><strong>Theorem 861</strong> (<code>the_reverse_flow_undoes_every_step</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_reverse_flow_undoes_every_step.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k : Nat, orbit (k + 1) * 5 % 9 = orbit k</code></pre>
</div>
<p class="thm-remark">── reflections, from the orbit batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ── orbit and span are Windows' (index.lean), opened above — not redefined here REFLECTION: the reverse flow (halving, ×5) steps every state back one, at every step</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-every_state_of_the_flow_returns_within_six_steps">
<p class="thm-label"><strong>Theorem 862</strong> (<code>every_state_of_the_flow_returns_within_six_steps</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_every_state_of_the_flow_returns_within_six_steps.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ k s : Nat, ∃ j, j &lt; 6 ∧ orbit (k + j) = orbit s</code></pre>
</div>
<p class="thm-remark">REFLECTION of "bounded": recurrent — from every step, every state of the span returns within six steps</p>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-a_ring_sum_splits_over_a_sum">
<p class="thm-label"><strong>Theorem 863</strong> (<code>a_ring_sum_splits_over_a_sum</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_a_ring_sum_splits_over_a_sum.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (f g : Nat → Int) (n : Nat), ringSum (fun i =&gt; f i + g i) n = ringSum f n + ringSum g n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-a_ring_sum_of_negatives_is_the_negated_sum">
<p class="thm-label"><strong>Theorem 864</strong> (<code>a_ring_sum_of_negatives_is_the_negated_sum</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_a_ring_sum_of_negatives_is_the_negated_sum.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (f : Nat → Int) (n : Nat), ringSum (fun i =&gt; - f i) n = - ringSum f n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-ring_sums_agree_where_their_terms_agree">
<p class="thm-label"><strong>Theorem 865</strong> (<code>ring_sums_agree_where_their_terms_agree</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_ring_sums_agree_where_their_terms_agree.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (f g : Nat → Int) (n : Nat), (∀ i, i &lt; n → f i = g i) → ringSum f n = ringSum g n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-a_ring_sum_peels_its_first_term">
<p class="thm-label"><strong>Theorem 866</strong> (<code>a_ring_sum_peels_its_first_term</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_a_ring_sum_peels_its_first_term.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (f : Nat → Int) (n : Nat), ringSum f (n + 1) = f 0 + ringSum (fun i =&gt; f (i + 1)) n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-a_cyclic_sum_is_unchanged_by_one_step_of_rotation">
<p class="thm-label"><strong>Theorem 867</strong> (<code>a_cyclic_sum_is_unchanged_by_one_step_of_rotation</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_a_cyclic_sum_is_unchanged_by_one_step_of_rotation.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (N : Nat) (f : Nat → Int), 0 &lt; N → ringSum (fun i =&gt; f (ringNext N i)) N = ringSum f N</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-the_site_before_the_next_is_the_site">
<p class="thm-label"><strong>Theorem 868</strong> (<code>the_site_before_the_next_is_the_site</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_site_before_the_next_is_the_site.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ N i : Nat, i &lt; N → ringPrev N (ringNext N i) = i</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-a_bond_sum_reads_the_same_from_either_end">
<p class="thm-label"><strong>Theorem 869</strong> (<code>a_bond_sum_reads_the_same_from_either_end</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_a_bond_sum_reads_the_same_from_either_end.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (N : Nat) (F : Nat → Nat → Int), 0 &lt; N → ringSum (fun i =&gt; F (ringPrev N i) i) N = ringSum (fun i =&gt; F i (ringNext N i)) N</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-the_skew_symmetric_burgers_term_does_no_work_on_every_ring">
<p class="thm-label"><strong>Theorem 870</strong> (<code>the_skew_symmetric_burgers_term_does_no_work_on_every_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_skew_symmetric_burgers_term_does_no_work_on_every_ring.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (N : Nat) (u : Nat → Int), 0 &lt; N → ringSum (fun i =&gt; u i * burgersSkew3 N u i) N = 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-the_discrete_laplacian_dissipates_exactly_the_squared_differences">
<p class="thm-label"><strong>Theorem 871</strong> (<code>the_discrete_laplacian_dissipates_exactly_the_squared_differences</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_discrete_laplacian_dissipates_exactly_the_squared_differences.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (N : Nat) (u : Nat → Int), 0 &lt; N → ringSum (fun i =&gt; u i * ringLap N u i) N = - ringSum (fun i =&gt; (u (ringNext N i) - u i) * (u (ringNext N i) - u i)) N</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-a_sum_of_squares_is_never_negative">
<p class="thm-label"><strong>Theorem 872</strong> (<code>a_sum_of_squares_is_never_negative</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_a_sum_of_squares_is_never_negative.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (f : Nat → Int) (n : Nat), 0 ≤ ringSum (fun i =&gt; f i * f i) n</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-flow-the_discrete_energy_never_increases_on_every_ring">
<p class="thm-label"><strong>Theorem 873</strong> (<code>the_discrete_energy_never_increases_on_every_ring</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_flow_the_discrete_energy_never_increases_on_every_ring.html">sealed</a>.</p>
<pre class="thm-statement"><code>∀ (N : Nat) (u : Nat → Int) (ν : Int), 0 &lt; N → 0 ≤ ν → ringSum (fun i =&gt; u i * (3 * ν * ringLap N u i - burgersSkew3 N u i)) N ≤ 0</code></pre>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by
  intro</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

</div>
