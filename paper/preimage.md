---
title: "A fold that returns a lone leaf unchanged admits a second preimage"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `preimage.lean`

<p class="paper-src"><code>src/iso/iec-2382-computing/preimage.lean</code> · namespace <code>Preimage</code> · 8 theorems · wing <code>the machine</code></p>

WHY THIS FILE EXISTS.

The author deposited a cryptographic capabilities report at 10.5281/zenodo.22895141. It is carefully
scoped — it separates what was tested against an independent reference from what was only identified —
and for Merkle commitments it states the construction as `Lᵢ = H(domainLeaf ‖ xᵢ)` and
`Nᵢ,ⱼ = H(domainNode ‖ …)`, then asks: ARE LEAF AND NODE DOMAINS SEPARATED?

In `merkleFold` (src/0/index.ts) they are not, and there is a second thing wrong that is worse. Measured
2026-09-25 against the function as written:

    merkleFold(['a','b'])  = d9946a63-d471-825a-9b8e-b1864f68b416
    merkleFold([that])     = d9946a63-d471-825a-9b8e-b1864f68b416      ← the same root

A one-leaf fold RETURNS ITS LEAF UNHASHED. So for any root R this function produces from any leaves, the
single-leaf set [R] produces R again: two different leaf multisets, one root. The empty case collides the
same way — `merkleFold([])` is a fixed sentinel, and a one-leaf fold carrying that sentinel returns it.

WHAT IS AND IS NOT AT RISK. This is not a break of the hash. `toUuid` is unaffected and the four-leaf
case does NOT collide with its own internal nodes, because the fold SORTS and the sort reorders them —
checked, not assumed. What is wrong is the commitment property: a Merkle root is supposed to be
producible from exactly one leaf multiset, and this one is producible from at least two. Every
`verification root`, every octave-root and the forensics seal are this function's output, and the
deposit's own invitation is "clone it and run npm run lean, compare the address".

NOT FIXED HERE, AND THE REASON IS NOT TIMIDITY. The remedy is one line — prefix leaves and nodes with
distinct domains and hash the singleton — and it changes EVERY root this deposit has ever published,
including values recorded in the append-only ledger. Rotating those is the depositor's act, not an
agent's, and doing it quietly would break forensics for every reader holding an older address. The
defect is decided below so the record carries it; the rotation is FOR THE AUTHOR.

No axioms, no Mathlib, no sorry.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>sep := 99</code></pre>

<div class="thm" id="thm-preimage-a_single_leaf_folds_to_itself">
<p class="thm-label"><strong>Theorem 1339</strong> (<code>a_single_leaf_folds_to_itself</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_a_single_leaf_folds_to_itself.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>39</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>x</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>x</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 40).all (fun x =&gt; foldOf [x] == x)</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{0,\dots,39\},\; \mathrm{foldOf}\mathopen{}\left([x]\right) = x</code></pre></details>
</div>
<p class="thm-remark">── 1 · A LONE LEAF IS ITS OWN ROOT ─────────────────────────────────────────────────────────────────────── The whole defect in one line: the fold is the identity on a one-leaf set, so a root and a leaf are the same kind of thing and nothing distinguishes them.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 40 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-every_two_leaf_root_is_also_a_one_leaf_root">
<p class="thm-label"><strong>Theorem 1340</strong> (<code>every_two_leaf_root_is_also_a_one_leaf_root</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_every_two_leaf_root_is_also_a_one_leaf_root.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 20).all (fun a =&gt; (List.range 20).all (fun b =&gt; foldOf [foldOf [a, b]] == foldOf [a, b]))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,19\},\; \forall b \in \{0,\dots,19\},\; \mathrm{foldOf}\mathopen{}\left([\mathrm{foldOf}\mathopen{}\left([a,\,b]\right)]\right) = \mathrm{foldOf}\mathopen{}\left([a,\,b]\right)</code></pre></details>
</div>
<p class="thm-remark">── 2 · SO EVERY ROOT IS ALSO A ONE-LEAF SET'S ROOT ─────────────────────────────────────────────────────── THE SECOND PREIMAGE, EXHIBITED. Take any two leaves, fold them, and hand the result back as a lone leaf: the same root, from a different multiset. Decided for every pair in range, not shown on one example.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 400 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-the_forged_leaf_set_is_not_the_original">
<p class="thm-label"><strong>Theorem 1341</strong> (<code>the_forged_leaf_set_is_not_the_original</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_the_forged_leaf_set_is_not_the_original.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mrow><mo>[</mo><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>|</mo><mrow><mo>[</mo><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>]</mo></mrow><mo>|</mo></mrow><mo>≠</mo><mrow><mo>|</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>|</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 20).all (fun a =&gt; (List.range 20).all (fun b =&gt; [foldOf [a, b]] != [a, b] &amp;&amp; ([foldOf [a, b]]).length != ([a, b]).length))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,19\},\; \forall b \in \{0,\dots,19\},\; [\mathrm{foldOf}\mathopen{}\left([a,\,b]\right)] \neq [a,\,b] \land \left|[\mathrm{foldOf}\mathopen{}\left([a,\,b]\right)]\right| \neq \left|[a,\,b]\right|</code></pre></details>
</div>
<p class="thm-remark">── 3 · AND THE TWO LEAF SETS REALLY ARE DIFFERENT ──────────────────────────────────────────────────────── Without this, theorem 2 is satisfied by the sets being equal. The one-leaf witness is never the two-leaf set it forges, because `merge` lands above both of them by construction.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 400 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-the_empty_sentinel_is_also_a_one_leaf_root">
<p class="thm-label"><strong>Theorem 1342</strong> (<code>the_empty_sentinel_is_also_a_one_leaf_root</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_the_empty_sentinel_is_also_a_one_leaf_root.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mn>7</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mn>7</mn></mrow></mrow></math></div>
<pre class="thm-statement"><code>foldOf [] == foldOf [7] &amp;&amp; foldOf [] == 7</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{foldOf}\mathopen{}\left([]\right) = \mathrm{foldOf}\mathopen{}\left([7]\right) \land \mathrm{foldOf}\mathopen{}\left([]\right) = 7</code></pre></details>
</div>
<p class="thm-remark">── 4 · THE EMPTY SENTINEL COLLIDES THE SAME WAY ────────────────────────────────────────────────────────── `merkleFold([])` is a fixed value, and a one-leaf fold carrying it returns it — so "nothing was committed" and "this one thing was committed" have one address.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-distinct_pairs_still_give_distinct_roots">
<p class="thm-label"><strong>Theorem 1343</strong> (<code>distinct_pairs_still_give_distinct_roots</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_distinct_pairs_still_give_distinct_roots.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>a</mi><mo>=</mo><mi>c</mi></mrow><mo>∨</mo><mrow><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>foldOf</mi><mo>(</mo><mrow><mo>[</mo><mi>c</mi><mo>,</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 12).all (fun a =&gt; (List.range 12).all (fun b =&gt; (List.range 12).all (fun c =&gt; (a == c) || foldOf [a, b] != foldOf [c, b])))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,11\},\; \forall b \in \{0,\dots,11\},\; \forall c \in \{0,\dots,11\},\; a = c \lor \mathrm{foldOf}\mathopen{}\left([a,\,b]\right) \neq \mathrm{foldOf}\mathopen{}\left([c,\,b]\right)</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE CONTROL: THE FOLD IS NOT COLLAPSING EVERYTHING ──────────────────────────────────────────────── Theorems 1, 2 and 4 would all hold of a fold that returned a constant, which would be a much worse bug and would make this file evidence of the wrong thing. Distinct two-leaf sets still give distinct roots, so what is broken is exactly the singleton case and not the whole construction.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,728 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-tagging_separates_a_leaf_from_a_node">
<p class="thm-label"><strong>Theorem 1344</strong> (<code>tagging_separates_a_leaf_from_a_node</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_tagging_separates_a_leaf_from_a_node.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>x</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>y</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>z</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>29</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>leafTag</mi><mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>≠</mo><mrow><mi>nodeTag</mi><mo>(</mo><mi>y</mi><mo>,</mo><mi>z</mi><mo>)</mo></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 30).all (fun x =&gt; (List.range 30).all (fun y =&gt; (List.range 30).all (fun z =&gt; leafTag x != nodeTag y z)))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall x \in \{0,\dots,29\},\; \forall y \in \{0,\dots,29\},\; \forall z \in \{0,\dots,29\},\; \mathrm{leafTag}\mathopen{}\left(x\right) \neq \mathrm{nodeTag}\mathopen{}\left(y,\,z\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 27,000 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-the_tagged_fold_refuses_the_forged_leaf">
<p class="thm-label"><strong>Theorem 1345</strong> (<code>the_tagged_fold_refuses_the_forged_leaf</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_the_tagged_fold_refuses_the_forged_leaf.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>19</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>leafTag</mi><mo>(</mo><mrow><mi>nodeTag</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>nodeTag</mi><mo>(</mo><mi>a</mi><mo>,</mo><mi>b</mi><mo>)</mo></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>(List.range 20).all (fun a =&gt; (List.range 20).all (fun b =&gt; leafTag (nodeTag a b) != nodeTag a b))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall a \in \{0,\dots,19\},\; \forall b \in \{0,\dots,19\},\; \mathrm{leafTag}\mathopen{}\left(\mathrm{nodeTag}\mathopen{}\left(a,\,b\right)\right) \neq \mathrm{nodeTag}\mathopen{}\left(a,\,b\right)</code></pre></details>
</div>
<p class="thm-remark">── 7 · AND WITH IT THE FORGERY STOPS ───────────────────────────────────────────────────────────────────── The same attack against the tagged form: the lone leaf is `leafTag R`, which is odd, while the root it tries to equal is a node value, which is even. They can never meet.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 400 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-preimage-the_unescaped_separator_makes_the_pairing_non_injective">
<p class="thm-label"><strong>Theorem 1346</strong> (<code>the_unescaped_separator_makes_the_pairing_non_injective</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_preimage_the_unescaped_separator_makes_the_pairing_non_injective.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mrow><mi>mergeStr</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mi>sep</mi><mo>,</mo><mn>2</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow><mo>)</mo></mrow><mo>=</mo><mrow><mi>mergeStr</mi><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>,</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mi>sep</mi><mo>,</mo><mn>3</mn><mo>]</mo></mrow><mo>)</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mo>[</mo><mn>1</mn><mo>,</mo><mi>sep</mi><mo>,</mo><mn>2</mn><mo>]</mo></mrow><mo>≠</mo><mrow><mo>(</mo><mrow><mo>[</mo><mn>1</mn><mo>]</mo></mrow><mo>:</mo><mrow><mi>List</mi><mo>(</mo><mi>Nat</mi><mo>)</mo></mrow><mo>)</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mrow><mo>(</mo><mrow><mo>[</mo><mn>3</mn><mo>]</mo></mrow><mo>:</mo><mrow><mi>List</mi><mo>(</mo><mi>Nat</mi><mo>)</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mo>[</mo><mn>2</mn><mo>,</mo><mi>sep</mi><mo>,</mo><mn>3</mn><mo>]</mo></mrow></mrow></mrow><mo>∧</mo><mrow><mo>∀</mo><mi>a</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>b</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mo>∀</mo><mi>c</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>11</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mi>b</mi><mo>=</mo><mi>c</mi></mrow><mo>∨</mo><mrow><mrow><mi>mergeStr</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>]</mo></mrow><mo>,</mo><mrow><mo>[</mo><mi>b</mi><mo>]</mo></mrow><mo>)</mo></mrow><mo>≠</mo><mrow><mi>mergeStr</mi><mo>(</mo><mrow><mo>[</mo><mi>a</mi><mo>]</mo></mrow><mo>,</mo><mrow><mo>[</mo><mi>c</mi><mo>]</mo></mrow><mo>)</mo></mrow></mrow></mrow></mrow></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>mergeStr [1, sep, 2] [3] == mergeStr [1] [2, sep, 3] &amp;&amp; [1, sep, 2] != ([1] : List Nat) &amp;&amp; ([3] : List Nat) != [2, sep, 3] &amp;&amp; (List.range 12).all (fun a =&gt; (List.range 12).all (fun b =&gt; (List.range 12).all (fun c =&gt; (b == c) || mergeStr [a] [b] != mergeStr [a] [c])))</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{mergeStr}\mathopen{}\left([1,\,\mathrm{sep},\,2],\,[3]\right) = \mathrm{mergeStr}\mathopen{}\left([1],\,[2,\,\mathrm{sep},\,3]\right) \land [1,\,\mathrm{sep},\,2] \neq \left([1] : \mathrm{List}\mathopen{}\left(\mathrm{Nat}\right)\right) \land \left([3] : \mathrm{List}\mathopen{}\left(\mathrm{Nat}\right)\right) \neq [2,\,\mathrm{sep},\,3] \land \forall a \in \{0,\dots,11\},\; \forall b \in \{0,\dots,11\},\; \forall c \in \{0,\dots,11\},\; b = c \lor \mathrm{mergeStr}\mathopen{}\left([a],\,[b]\right) \neq \mathrm{mergeStr}\mathopen{}\left([a],\,[c]\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 1,728 cases. <span class="qed">□</span></p>

</div>
