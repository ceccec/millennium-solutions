---
title: "The CERN Open Data corpus, as measured, checked by its own arithmetic"
aside: false
---

<div class="paper paper-section">

<p><a href="/paper">← collected paper</a></p>

## `cern.lean`

<p class="paper-src"><code>src/iso/9001-governance/cern.lean</code> · namespace <code>Cern</code> · 9 theorems · wing <code>the floor</code></p>

prior-art note: not applicable — arithmetic over measured counts


SOURCE OF EVERY LITERAL: .cern/corpus.json and .cern/oai.json, written by scripts/cern.ts and scripts/cern-oai.ts
from the portal's sitemap and OAI-PMH feed. The literals below are REWRITTEN from those caches by scripts/cern-lean.ts; do
not edit them by hand. The sitemap files themselves are no longer in the cache (.cern/sitemaps is empty),
so these theorems check the SUMMARY the script wrote, not the records. A theorem here is about the measurement as
recorded, and says nothing about the portal as it is today.

WHAT THIS FILE DOES NOT SAY. It does not state a collision with the deposit's expressions. A residue mod 9 always
falls in one of three classes, so a test of "does a CERN figure land in a class" cannot fail and is not a finding.
What is decided below: the recorded counts add up as their definitions say, and the script's involution check is an
identity on the ten digits that cannot fail, so it does not test the records. An earlier parity argument that read
the records as the points of an involution was wrong, and is withdrawn in section 6.

<p class="paper-h">Definitions</p>

<pre class="thm-statement paper-defs"><code>sitemaps := 318
urls := 158518
listedRecordUrls := 151435
duplicatedInSitemap := 41728
records := 109707
distinctRecids := 62229
nonRecordUrls := 7083
numericIds := 51375
slugAliases := 58332
canonicalRecords := 62229
addresses := 109707
collisions := 0
notInvolutive := 0
fixed := 12063
swapped := 97644
oaiHarvested := 74614
oaiCompleteListSize := 74614
oaiInBoth := 61488
oaiOnly := 13126
siteOnly := 9
oaiUnion := 74623
roots := [0, 12077, 12112, 12147, 12381, 12063, 12222, 12199, 12350, 12156]
fixedDigits := (List.range 10).filter (fun d =&gt; reflect d == d)</code></pre>

<div class="thm" id="thm-cern-records_are_numeric_plus_slug">
<p class="thm-label"><strong>Theorem 263</strong> (<code>records_are_numeric_plus_slug</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_records_are_numeric_plus_slug.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>numericIds</mi><mo>,</mo><mi>slugAliases</mi><mo>]</mo></mrow><mo>,</mo><mi>records</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>exact [numericIds, slugAliases] records = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{exact}\mathopen{}\left([\mathrm{numericIds},\,\mathrm{slugAliases}],\,\mathrm{records}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-listed_urls_are_records_plus_duplicates">
<p class="thm-label"><strong>Theorem 264</strong> (<code>listed_urls_are_records_plus_duplicates</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_listed_urls_are_records_plus_duplicates.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>records</mi><mo>,</mo><mi>duplicatedInSitemap</mi><mo>]</mo></mrow><mo>,</mo><mi>listedRecordUrls</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>exact [records, duplicatedInSitemap] listedRecordUrls = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{exact}\mathopen{}\left([\mathrm{records},\,\mathrm{duplicatedInSitemap}],\,\mathrm{listedRecordUrls}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">── 2 · THE SITEMAP LISTS EACH RECORD AND ITS DUPLICATES ─────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-urls_are_listed_records_plus_non_records">
<p class="thm-label"><strong>Theorem 265</strong> (<code>urls_are_listed_records_plus_non_records</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_urls_are_listed_records_plus_non_records.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>listedRecordUrls</mi><mo>,</mo><mi>nonRecordUrls</mi><mo>]</mo></mrow><mo>,</mo><mi>urls</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>exact [listedRecordUrls, nonRecordUrls] urls = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{exact}\mathopen{}\left([\mathrm{listedRecordUrls},\,\mathrm{nonRecordUrls}],\,\mathrm{urls}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">── 3 · EVERY URL IS A RECORD OR A NON-RECORD PAGE ───────────────────────────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-fixed_and_swapped_partition_the_records">
<p class="thm-label"><strong>Theorem 266</strong> (<code>fixed_and_swapped_partition_the_records</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_fixed_and_swapped_partition_the_records.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>fixed</mi><mo>,</mo><mi>swapped</mi><mo>]</mo></mrow><mo>,</mo><mi>records</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>exact [fixed, swapped] records = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{exact}\mathopen{}\left([\mathrm{fixed},\,\mathrm{swapped}],\,\mathrm{records}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">── 4 · EVERY ADDRESS IS FIXED OR MOVED, AND THE MOVED ONES ARE THE REST ─────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-oai_harvest_is_complete">
<p class="thm-label"><strong>Theorem 267</strong> (<code>oai_harvest_is_complete</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_oai_harvest_is_complete.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>oaiHarvested</mi><mo>]</mo></mrow><mo>,</mo><mi>oaiCompleteListSize</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>exact [oaiHarvested] oaiCompleteListSize = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{exact}\mathopen{}\left([\mathrm{oaiHarvested}],\,\mathrm{oaiCompleteListSize}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">── 5 · THE OAI HARVEST IS COMPLETE AND ITS UNION IS THE SUM OF ITS PARTS ────────────────────────────────</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-oai_union_is_the_sum_of_its_parts">
<p class="thm-label"><strong>Theorem 268</strong> (<code>oai_union_is_the_sum_of_its_parts</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_oai_union_is_the_sum_of_its_parts.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>oaiInBoth</mi><mo>,</mo><mi>oaiOnly</mi><mo>]</mo></mrow><mo>,</mo><mi>oaiHarvested</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow><mo>∧</mo><mrow><mrow><mi>exact</mi><mo>(</mo><mrow><mo>[</mo><mi>oaiInBoth</mi><mo>,</mo><mi>oaiOnly</mi><mo>,</mo><mi>siteOnly</mi><mo>]</mo></mrow><mo>,</mo><mi>oaiUnion</mi><mo>)</mo></mrow><mo>=</mo><mi>true</mi></mrow></mrow></math></div>
<pre class="thm-statement"><code>exact [oaiInBoth, oaiOnly] oaiHarvested = true ∧ exact [oaiInBoth, oaiOnly, siteOnly] oaiUnion = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{exact}\mathopen{}\left([\mathrm{oaiInBoth},\,\mathrm{oaiOnly}],\,\mathrm{oaiHarvested}\right) = \mathrm{true} \land \mathrm{exact}\mathopen{}\left([\mathrm{oaiInBoth},\,\mathrm{oaiOnly},\,\mathrm{siteOnly}],\,\mathrm{oaiUnion}\right) = \mathrm{true}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-the_digit_buckets_sum_to_the_records">
<p class="thm-label"><strong>Theorem 269</strong> (<code>the_digit_buckets_sum_to_the_records</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_the_digit_buckets_sum_to_the_records.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mi>fold</mi><mo>(</mo><mrow><mi>a</mi><mo>,</mo><mi>b</mi><mo>↦</mo><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></mrow><mo>,</mo><mi>roots</mi><mo>,</mo><mn>0</mn><mo>)</mo></mrow><mo>=</mo><mi>records</mi></mrow></math></div>
<pre class="thm-statement"><code>roots.foldl (fun a b =&gt; a + b) 0 = records</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\operatorname{fold}_{a,\,b \mapsto a + b}\left(\mathrm{roots},\, 0\right) = \mathrm{records}</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — by evaluation; no domain is walked. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-the_fixed_count_is_the_bucket_of_digit_five">
<p class="thm-label"><strong>Theorem 270</strong> (<code>the_fixed_count_is_the_bucket_of_digit_five</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_the_fixed_count_is_the_bucket_of_digit_five.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mrow><mrow><mi>fixedDigits</mi><mo>=</mo><mrow><mo>[</mo><mn>5</mn><mo>]</mo></mrow></mrow><mo>∧</mo><mrow><mrow><mi>bucketSum</mi><mo>(</mo><mi>roots</mi><mo>,</mo><mi>fixedDigits</mi><mo>)</mo></mrow><mo>=</mo><mi>fixed</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mi>bucketSum</mi><mo>(</mo><mi>roots</mi><mo>,</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>reflect</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>≠</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>)</mo></mrow><mo>=</mo><mi>swapped</mi></mrow></mrow><mo>∧</mo><mrow><mrow><mrow><mi>bucketSum</mi><mo>(</mo><mi>roots</mi><mo>,</mo><mi>fixedDigits</mi><mo>)</mo></mrow><mo>+</mo><mrow><mi>bucketSum</mi><mo>(</mo><mi>roots</mi><mo>,</mo><mrow><mo>{</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>∣</mo><mrow><mrow><mi>reflect</mi><mo>(</mo><mi>d</mi><mo>)</mo></mrow><mo>≠</mo><mi>d</mi></mrow><mo>}</mo></mrow><mo>)</mo></mrow></mrow><mo>=</mo><mrow><mi>total</mi><mo>(</mo><mi>roots</mi><mo>)</mo></mrow></mrow></mrow></math></div>
<pre class="thm-statement"><code>fixedDigits = [5] ∧ bucketSum roots fixedDigits = fixed ∧ bucketSum roots ((List.range 10).filter (fun d =&gt; reflect d != d)) = swapped ∧ bucketSum roots fixedDigits + bucketSum roots ((List.range 10).filter (fun d =&gt; reflect d != d)) = total roots</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\mathrm{fixedDigits} = [5] \land \mathrm{bucketSum}\mathopen{}\left(\mathrm{roots},\,\mathrm{fixedDigits}\right) = \mathrm{fixed} \land \mathrm{bucketSum}\mathopen{}\left(\mathrm{roots},\,\{\, d \in \{0,\dots,9\} \mid \mathrm{reflect}\mathopen{}\left(d\right) \neq d \,\}\right) = \mathrm{swapped} \land \mathrm{bucketSum}\mathopen{}\left(\mathrm{roots},\,\mathrm{fixedDigits}\right) + \mathrm{bucketSum}\mathopen{}\left(\mathrm{roots},\,\{\, d \in \{0,\dots,9\} \mid \mathrm{reflect}\mathopen{}\left(d\right) \neq d \,\}\right) = \mathrm{total}\mathopen{}\left(\mathrm{roots}\right)</code></pre></details>
</div>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 100 cases. <span class="qed">□</span></p>

<div class="thm" id="thm-cern-the_reflection_is_an_involution_on_the_digits">
<p class="thm-label"><strong>Theorem 271</strong> (<code>the_reflection_is_an_involution_on_the_digits</code>)<a class="thm-cite" href="/millennium-solutions/theorem/lean_cern_the_reflection_is_an_involution_on_the_digits.html">sealed</a>.</p>
<div class="thm-math" role="math" aria-label="the statement, typeset"><math display="block" xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mrow><mo>∀</mo><mi>d</mi><mo>∈</mo><mrow><mo>{</mo><mn>0</mn><mo>,</mo><mo>…</mo><mo>,</mo><mn>9</mn><mo>}</mo></mrow><mo>,</mo><mrow><mrow><mn>10</mn><mo>-</mo><mrow><mn>10</mn><mo>-</mo><mi>d</mi></mrow></mrow><mo>=</mo><mi>d</mi></mrow></mrow><mo>=</mo><mi>true</mi></mrow></math></div>
<pre class="thm-statement"><code>(List.range 10).all (fun d =&gt; 10 - (10 - d) == d) = true</code></pre>
<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>\forall d \in \{0,\dots,9\},\; 10 - 10 - d = d = \mathrm{true}</code></pre></details>
</div>
<p class="thm-remark">The involution claim, stated on the digits it actually acts on. It is true of d ↦ 10 − d and decides nothing about the records, which is why the script's check is recorded here as an identity and not as a finding.</p>
<p class="thm-proof"><em>Proof.</em> <code>by decide</code> — exhausting 10 cases. <span class="qed">□</span></p>

</div>
