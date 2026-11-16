<script setup>
// ONE THEOREM PAGE, AS A COMPONENT. This was the body of theorem/[key].md, which VitePress rendered once per
// route — 4,041 pages and 8,082 JS chunks per build. It is now rendered by scripts/theorem-stamp.ts (Vue SSR,
// milliseconds a page) into the one template VitePress builds (theorem/_template.md), from the records that
// src/publication/record.ts builds. Same markup as before; the markdown parts are written as the HTML they
// compiled to. The page reads `params` (one record) and `base` (the site's base path) and nothing else, so the
// same component renders it wherever the record is served.
import { computed } from 'vue'
import Vortex7D from './Vortex7D.vue'
import Recompute from './Recompute.vue'
import TheoremField from './TheoremField.vue'

const props = defineProps({ params: { type: Object, required: true }, base: { type: String, default: '/' } })
const p = computed(() => props.params || {})
const href = (path) => props.base + path
// the theorem's own 7D vortex is rendered by the shared <Vortex7D> engine — one engine for every
// object — from this theorem's microdata (its content-address) and its surrounding theorems' hues.
const receipt = computed(() => p.value.receipt || '')
const hues = computed(() => p.value.hues || '')
const name = computed(() => p.value.name || '')
const isLean = computed(() => !!p.value.lean)
// A withdrawn theorem keeps its URL and its receipt — the record is append-only — but every standing claim
// on this page is false of it, so they are suppressed and the withdrawal is stated instead.
const isRevoked = computed(() => p.value.revoked === true)
// A withdrawn statement that a Lean theorem has since re-established is not simply gone, and the page a
// reader actually lands on is the place that has to say so.
const superseded = computed(() => String(p.value.supersededBy || ''))
// Sealed FROM Lean: the kernel checked it over the whole domain.
const isKernel = computed(() => String(p.value.key || '').startsWith('lean_'))
// The theorem's own formula, as the kernel received it — shown only when this page is NOT withdrawn: a
// withdrawn entry that displayed a formula would read as though the formula proved the withdrawn statement.
const statement = computed(() => String(p.value.statement || ''))
const showFormula = computed(() => !!statement.value && !isRevoked.value)
// Two theorems share this key's name and the key does not say which: the page names the keys that resolve.
const ambiguous = computed(() => String(p.value.ambiguous || ''))
const mathml = computed(() => String(p.value.mathml || ''))
const latex = computed(() => String(p.value.latex || ''))
// microdata → speech: the frame's narration in the infinite movie (the ledger, read aloud)
const speech = computed(() => isLean.value
  ? (p.value.name || 'A theorem') + '. A Lean 4 fact, machine-checked and axiom-free, computed from the sequence — adjacent to a Clay problem, not the conjecture. Integrity, not truth. Zero of seven.'
  : isRevoked.value
    ? (p.value.name || 'A theorem') + '. WITHDRAWN. This entry no longer stands. It keeps its receipt in the append-only record, and it is not a live theorem of this deposit. Integrity, not truth. Zero of seven.'
    : (p.value.name || 'A theorem') + '. Achieved by exhaustive computation, gate-checked, receipted, and re-verified on every build. Integrity, not truth. Zero of seven.')
const desc = computed(() => isLean.value
  ? 'A Lean 4 theorem computed from the ℤ/9 doubling sequence, machine-checked sorry-free and axiom-free — adjacent to a Clay Millennium Problem, and not the conjecture. Integrity, not truth.'
  : isRevoked.value && superseded.value
    ? 'RE-ESTABLISHED — this statement was withdrawn for lacking a proof and is now carried by a Lean theorem, machine-checked sorry-free and axiom-free over its whole domain. Cite ' + superseded.value + '. Integrity, not truth.'
  : isRevoked.value
    ? 'WITHDRAWN — this entry no longer stands as a theorem of the deposit. Its receipt remains in the append-only record so the chain still verifies, but it is not re-verified on every build and must not be cited. Integrity, not truth.'
    : 'Achieved by exhaustive computation over a finite domain in scripts/discover.ts, gate-checked against the honesty floor, receipted and chained, and re-verified on every build. Integrity, not truth.')
</script>

<template>
<h1 id="theorem" tabindex="-1">{{ p.statusPrefix }}{{ p.short || p.name }} <a class="header-anchor" href="#theorem" aria-label="Permalink to the theorem">&#8203;</a></h1>
<p class="thm-fullname address-tinted" :style="{ '--b0': p.b0 }">{{ p.name }}</p>
<!-- the colour above is computed by custom.css from this page's own content-address: its first
     byte times the ring's degrees per digit. No script computes it; the stylesheet does. -->
<div itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="p.name" />
<meta itemprop="identifier" :content="p.receipt" />
<meta itemprop="description" :content="desc" />
<meta itemprop="isPartOf" content="Millennium Solutions — the ℤ/9 discovery ledger" />
<meta itemprop="license" content="https://creativecommons.org/licenses/by-nc-nd/4.0/" />
<Vortex7D :receipt="receipt" :hues="hues" :name="name" :speech="speech" />
<Recompute />
<ul>
<li><strong>theorem key</strong> · <code>{{ p.key }}</code></li>
<li><strong>content-address (receipt)</strong> · <code>{{ p.receipt }}</code></li>
<li><strong>status</strong> · <span v-if="isRevoked"><strong>WITHDRAWN — no longer stands, and must not be cited.</strong> The receipt above is still in the append-only record and still verifies as a link in the chain; the statement is not a live theorem of this deposit.</span><span v-else>decidable, re-verified on every build — recomputes from <code>src/</code></span></li>
<li v-if="isRevoked"><span v-if="superseded"><strong>carried</strong> · this statement was withdrawn on its own evidence and is now carried by a Lean theorem, machine-checked over its whole domain: <a v-if="p.supersededHasPage" :href="href('theorem/' + superseded + '.html')"><code>{{ superseded }}</code></a><code v-else>{{ superseded }}</code>. Cite that one.</span><span v-else><strong>why it was withdrawn</strong> · {{ p.reason }}</span></li>
</ul>
</div>

<!-- ── the seven Millennium-floor theorems: the Lean proof in publication form + the qualified outlet ── -->
<div v-if="isLean" class="lean-publication" itemscope itemtype="https://schema.org/CreativeWork">
<h2>Statement — Lean 4 (machine-checked, axiom-free)</h2>
<p>The Clay problem <strong>{{ p.problem }}</strong>, to the honest floor. The statement below is a true fact <em>computed</em> from the ℤ/9 doubling sequence — genuinely <em>adjacent</em> to the problem, and <strong>not</strong> the conjecture.</p>
<pre class="lean-proof"><code itemprop="text">{{ p.lean }}</code></pre>
<p>Verified sorry-free by <code>lean src/iso/9001-governance/index.lean</code>; <code>#print axioms {{ p.key }}</code> → <em>does not depend on any axioms</em>. No Mathlib, no <code>native_decide</code>, no <code>sorry</code>.</p>
<p><strong>The claim, and the open gap.</strong> {{ p.bound }}.</p>
<h2>References — qualified outlets</h2>
<ul>
<li><strong>The problem:</strong> <a :href="p.outlet" target="_blank" rel="noopener">{{ p.outletName }}</a> — the authoritative statement.</li>
<li v-if="p.outlet2"><strong>The resolution:</strong> <a :href="p.outlet2" target="_blank" rel="noopener">{{ p.outlet2Name }}</a>.</li>
<li><strong>This work:</strong> Rouschev, T. <em>Millennium Solutions — the ℤ/9 vortex framework.</em> CC&nbsp;BY-NC&nbsp;4.0. Zenodo DOI <a href="https://doi.org/10.5281/zenodo.21819217" target="_blank" rel="noopener">10.5281/zenodo.21819217</a>.</li>
<li><strong>Source (verify):</strong> <a href="https://github.com/ceccec/millennium-solutions/blob/main/src/iso/9001-governance/index.lean" target="_blank" rel="noopener">src/iso/9001-governance/index.lean</a> — clone and run <code>lean src/iso/9001-governance/index.lean</code>.</li>
</ul>
<p>A content-address proves integrity, not truth.</p>
</div>

<div v-if="ambiguous && !isRevoked" class="thm-ambiguous">
<p><strong>No single formula can be shown for this key.</strong> Its name is declared by more than one theorem in
<code>src/proof/</code>, and this key — minted before keys carried a namespace — does not say which. Showing one of them
would present a statement the kernel checked under a <em>different</em> key as though it were this one. The keys that
do resolve, each to exactly one statement: <code>{{ ambiguous }}</code>. Cite one of those.</p>
</div>

<!-- ── the formula, in the standard format a formalisation paper prints: the verbatim kernel-checked
        statement, its tactic, and the size of the domain that tactic exhausted ── -->
<div v-if="showFormula" class="paper" itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="p.key" />
<meta itemprop="identifier" :content="p.receipt" />
<div class="paper-masthead">
  <div class="paper-title">{{ p.key }}</div>
  <div class="paper-byline">Rouschev, T. · <em>Millennium Solutions — the ℤ/9 vortex framework</em> · DOI <a href="https://doi.org/10.5281/zenodo.21819217">10.5281/zenodo.21819217</a></div>
  <div class="paper-addr">content-address <code>{{ p.receipt }}</code></div>
</div>
<h2 class="paper-h">Theorem</h2>
<div class="thm">
  <p class="thm-label"><strong>Theorem</strong> (<code>{{ p.key }}</code>).</p>
  <div v-if="mathml" class="thm-math" role="math" aria-label="the statement, typeset" v-html="mathml"></div>
<pre class="thm-statement"><code itemprop="text">{{ statement }}</code></pre>
<details v-if="latex" class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>{{ latex }}</code></pre></details>
</div>
<!-- ONE BODY, SHARED WITH THE ZENODO RECORD (src/publication/index.ts); zenodo-gate.ts compares this
     rendering with the deposited one byte for byte. The per-theorem JSON-LD sits in the page head, put there by
     the stamper: a script element in a Vue template renders empty, which is why the old page carried an empty one. -->
<div class="paper-body" v-html="p.publication"></div>
<!-- Every theorem is presentable through three.js, and the geometry is the statement's own parse tree. -->
<TheoremField v-if="showFormula" :statement="statement" :nodes="String(p.treeNodes || '[]')" />
</div>

<p>The <strong>7D rosetta-ray vortex</strong> is plotted from this theorem's microdata (its content-address); the slowly rotating <strong>hero background</strong> is computed from its seven surrounding theorems' hues — the mesh, seen locally, in analog rotation of dimensions. Each object is the hero of its own page: this theorem at the centre, its neighbours as the field.</p>

<!-- ── the discovery-ledger theorems: computed by exhaustion in discover.ts ── -->
<div v-if="isRevoked">
<h2 id="why-this-page-still-exists" tabindex="-1">Why this page still exists <a class="header-anchor" href="#why-this-page-still-exists" aria-label="Permalink to “Why this page still exists”">&#8203;</a></h2>
<p>This entry was <strong>withdrawn</strong>. It is kept, with its receipt, because the ledger is <strong>append-only</strong>: deleting a
link would break the chain that lets anyone verify every other entry, and rewriting a receipt would be tamper.
So the URL stays resolvable and the record stays honest about its own history — what changed is that this
statement is no longer offered as a theorem, and nothing in the deposit may cite it.</p>
<p v-if="p.floorStripped">The name above is shown without the Clay floor wording, removed at the author's order on
2026-09-14. The name as sealed is unchanged in the append-only ledger (<code>src/ledger/discovered.json</code>), and the
receipt addresses that sealed name.</p>
<p>The live record: <a :href="href('CHALLENGES.html')">the standing theorems</a> · <a :href="href('proofs.html')">the ledger</a>. Verify the chain yourself with
<code>npm run forensics</code>. A content-address proves integrity, not truth.</p>
</div>

<div v-if="isKernel && !isRevoked">
<h2 id="how-it-was-achieved" tabindex="-1">How it was achieved <a class="header-anchor" href="#how-it-was-achieved" aria-label="Permalink to “How it was achieved”">&#8203;</a></h2>
<p>This is a <strong>Lean 4 theorem</strong>, checked by the kernel over its whole domain — <code>sorry</code>-free and axiom-free, which
<code>scripts/lean.ts</code> re-verifies per theorem on every run. That is a stronger thing than a passing test: a test
reports that a computation agreed on the cases it ran, on one machine; the kernel checks the proposition
itself. It was then receipted and chained append-only by <code>scripts/seal-lean.ts</code>, which seals only <code>by decide</code>
theorems — algebra the kernel evaluates, never a declaration asserted by <code>rfl</code>.</p>
<p>The source: <a href="https://github.com/ceccec/millennium-solutions/tree/main/src/proof" target="_blank" rel="noreferrer">the Lean proofs</a> · <a :href="href('CHALLENGES.html')">the standing theorems</a>. Re-check them yourself with <code>npm run lean-claims</code>, or the whole layer with <code>node scripts/lean.ts</code>. A content-address proves integrity, not truth.</p>
</div>

<div v-if="!isLean && !isRevoked && !isKernel">
<h2 id="how-it-was-achieved" tabindex="-1">How it was achieved <a class="header-anchor" href="#how-it-was-achieved" aria-label="Permalink to “How it was achieved”">&#8203;</a></h2>
<p>This theorem was <strong>computed by exhaustion</strong> over a finite domain in <code>scripts/discover.ts</code> — a <code>test: () =&gt; boolean</code> that runs to completion, holding by full enumeration. It was <strong>gate-checked</strong> (its name and content hold the honesty floor — no over-reach), <strong>receipted</strong> and <strong>chained</strong> append-only, and it is <strong>re-verified on every build</strong>: if it ever stopped holding, the build would fail, not production. That is what <em>achieved</em> means here — not asserted, but recomputable.</p>
<p>One leaf of the chained ledger: <a :href="href('CHALLENGES.html')">all theorems</a> · <a :href="href('compute.html')">computed results</a> · <a :href="href('guide.html')">the guide</a> · <a href="https://github.com/ceccec/millennium-solutions/blob/main/scripts/discover.ts" target="_blank" rel="noreferrer">the source formula</a>. The repo and the site cross-link both ways — this hero page points back to the formula that recomputes it. Verify by cloning and running <code>npm run lean-claims</code>. A content-address proves integrity, not truth.</p>
</div>
</template>
