---
aside: false
---

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
const { params } = useData()
// the theorem's own 7D vortex is rendered by the shared <Vortex7D> engine — one engine for every
// object — from this theorem's microdata (its content-address) and its surrounding theorems' hues.
const receipt = computed(() => params.value?.receipt || '')
const hues = computed(() => params.value?.hues || '')
const name = computed(() => params.value?.name || '')
const isLean = computed(() => !!params.value?.lean)
// A withdrawn theorem keeps its URL and its receipt — the record is append-only — but every standing claim
// on this page is false of it, so they are suppressed and the withdrawal is stated instead.
const isRevoked = computed(() => params.value?.revoked === true)
// A withdrawn statement that a Lean theorem has since re-established is not simply gone, and the page a
// reader actually lands on is the place that has to say so.
const superseded = computed(() => String(params.value?.supersededBy || ''))
// Sealed FROM Lean: the kernel checked it over the whole domain. The "computed by exhaustion in
// discover.ts" story below is true of the enumerated entries and false of these.
const isKernel = computed(() => String(params.value?.key || '').startsWith('lean_'))
// The theorem's own formula, as the kernel received it. Shown only when this page is NOT withdrawn: a
// withdrawn entry that displayed a formula would read as though the formula proved the withdrawn
// statement, which is the overclaim the withdrawal exists to record.
const statement = computed(() => String(params.value?.statement || ''))
const tactic = computed(() => String(params.value?.tactic || ''))
const leanFile = computed(() => String(params.value?.leanFile || ''))
const cases = computed(() => Number(params.value?.cases || 0))
const showFormula = computed(() => !!statement.value && !isRevoked.value)
// Two theorems share this key's name and the key does not say which. Rather than print one at random —
// which is how the wrong formula reached this page — the page names the keys that do resolve.
const ambiguous = computed(() => String(params.value?.ambiguous || ''))
const casesText = computed(() => cases.value ? cases.value.toLocaleString('en-US') : '')
// The typeset form is a rendering of the statement; the Lean below it is what the kernel checked. A
// statement the grammar in src/latex does not cover has no typeset form here — the Lean stands alone
// rather than a partial rendering standing in for it.
const mathml = computed(() => String(params.value?.mathml || ''))
const latex = computed(() => String(params.value?.latex || ''))
const today = computed(() => String(params.value?.receipt || '').slice(0, 8))
// microdata → speech: the frame's narration in the infinite movie (the ledger, read aloud)
const speech = computed(() => isLean.value
  ? (params.value?.name || 'A theorem') + '. A Lean 4 fact, machine-checked and axiom-free, computed from the sequence — adjacent to a Clay problem, not the conjecture. Integrity, not truth. Zero of seven.'
  : isRevoked.value
    ? (params.value?.name || 'A theorem') + '. WITHDRAWN. This entry no longer stands. It keeps its receipt in the append-only record, and it is not a live theorem of this deposit. Integrity, not truth. Zero of seven.'
    : (params.value?.name || 'A theorem') + '. Achieved by exhaustive computation, gate-checked, receipted, and re-verified on every build. Integrity, not truth. Zero of seven.')
const desc = computed(() => isLean.value
  ? 'A Lean 4 theorem computed from the ℤ/9 doubling sequence, machine-checked sorry-free and axiom-free — adjacent to a Clay Millennium Problem, and not the conjecture. Integrity, not truth. entails → 0/7.'
  : isRevoked.value && superseded.value
    ? 'RE-ESTABLISHED — this statement was withdrawn for lacking a proof and is now carried by a Lean theorem, machine-checked sorry-free and axiom-free over its whole domain. Cite ' + superseded.value + '. Integrity, not truth. entails → 0/7.'
  : isRevoked.value
    ? 'WITHDRAWN — this entry no longer stands as a theorem of the deposit. Its receipt remains in the append-only record so the chain still verifies, but it is not re-verified on every build and must not be cited. Integrity, not truth. entails → 0/7.'
    : 'Achieved by exhaustive computation over a finite domain in scripts/discover.ts, gate-checked against the honesty floor, receipted and chained, and re-verified on every build. Integrity, not truth. entails → 0/7.')
</script>

# {{ $params.name }}

<div itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="$params.name" />
<meta itemprop="identifier" :content="$params.receipt" />
<meta itemprop="description" :content="desc" />
<meta itemprop="isPartOf" content="Millennium Solutions — the ℤ/9 discovery ledger" />
<meta itemprop="license" content="https://creativecommons.org/licenses/by-nc-nd/4.0/" />

<Vortex7D :receipt="receipt" :hues="hues" :name="name" :speech="speech" />

<Recompute />

- **theorem key** · `{{ $params.key }}`
- **content-address (receipt)** · `{{ $params.receipt }}`
- **status** · <span v-if="isRevoked">**WITHDRAWN — no longer stands, and must not be cited.** The receipt above is still in the append-only record and still verifies as a link in the chain; the statement is not a live theorem of this deposit.</span><span v-else>decidable, re-verified on every build — recomputes from <code>src/</code></span>
- <span v-if="isRevoked && superseded">**carried** · this statement was withdrawn on its own evidence and is now carried by a Lean theorem, machine-checked over its whole domain: <a :href="'/theorem/' + superseded"><code>{{ superseded }}</code></a>. Cite that one.</span><span v-else-if="isRevoked">**why it was withdrawn** · {{ $params.reason }}</span><span v-else>**entails** · <code>0/7</code></span>

</div>

<!-- ── the seven Millennium-floor theorems: the Lean proof in publication form + the qualified outlet ── -->
<div v-if="isLean" class="lean-publication" itemscope itemtype="https://schema.org/CreativeWork">
<h2>Statement — Lean 4 (machine-checked, axiom-free)</h2>
<p>The Clay problem <strong>{{ $params.problem }}</strong>, to the honest floor. The statement below is a true fact <em>computed</em> from the ℤ/9 doubling sequence — genuinely <em>adjacent</em> to the problem, and <strong>not</strong> the conjecture.</p>
<pre class="lean-proof"><code itemprop="text">{{ $params.lean }}</code></pre>
<p>Verified sorry-free by <code>lean src/proof/index.lean</code>; <code>#print axioms {{ $params.key }}</code> → <em>does not depend on any axioms</em>. No Mathlib, no <code>native_decide</code>, no <code>sorry</code>.</p>
<p><strong>Honest bound.</strong> {{ $params.bound }} — this framework proves <strong>0 of the 7</strong> (<code>provenHere = 0</code>).</p>
<h2>References — qualified outlets</h2>
<ul>
<li><strong>The problem:</strong> <a :href="$params.outlet" target="_blank" rel="noopener">{{ $params.outletName }}</a> — the authoritative statement.</li>
<li v-if="$params.outlet2"><strong>The resolution:</strong> <a :href="$params.outlet2" target="_blank" rel="noopener">{{ $params.outlet2Name }}</a>.</li>
<li><strong>This work:</strong> Rouschev, T. <em>Millennium Solutions — the ℤ/9 vortex framework.</em> CC&nbsp;BY-NC&nbsp;4.0. Zenodo DOI <a href="https://doi.org/10.5281/zenodo.21819217" target="_blank" rel="noopener">10.5281/zenodo.21819217</a>.</li>
<li><strong>Source (verify):</strong> <a href="https://github.com/ceccec/millennium-solutions/blob/main/src/proof/index.lean" target="_blank" rel="noopener">src/proof/index.lean</a> — clone and run <code>lean src/proof/index.lean</code>.</li>
</ul>
<p>A content-address proves integrity, not truth. <code>entails → 0/7</code>.</p>
</div>

<div v-if="ambiguous && !isRevoked" class="thm-ambiguous">

**No single formula can be shown for this key.** Its name is declared by more than one theorem in
`src/proof/`, and this key — minted before keys carried a namespace — does not say which. Showing one of them
would present a statement the kernel checked under a *different* key as though it were this one. The keys that
do resolve, each to exactly one statement: <code>{{ ambiguous }}</code>. Cite one of those.

</div>

<!-- ── the formula, in the standard format a formalisation paper prints: the verbatim kernel-checked
        statement, its tactic, and the size of the domain that tactic exhausted ── -->
<div v-if="showFormula" class="paper" itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="$params.key" />
<meta itemprop="identifier" :content="$params.receipt" />

<div class="paper-masthead">
  <div class="paper-title">{{ $params.key }}</div>
  <div class="paper-byline">Rouschev, T. · <em>Millennium Solutions — the ℤ/9 vortex framework</em> · DOI <a href="https://doi.org/10.5281/zenodo.21819217">10.5281/zenodo.21819217</a></div>
  <div class="paper-addr">content-address <code>{{ $params.receipt }}</code></div>
</div>

<h2 class="paper-h">Theorem</h2>

<div class="thm">
  <p class="thm-label"><strong>Theorem</strong> (<code>{{ $params.key }}</code>).</p>
  <div v-if="mathml" class="thm-math" role="math" aria-label="the statement, typeset" v-html="mathml"></div>
<pre class="thm-statement"><code itemprop="text">{{ statement }}</code></pre>
<details v-if="latex" class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>{{ latex }}</code></pre></details>
</div>

<!-- ONE BODY, SHARED WITH THE ZENODO RECORD. This block used to be written here and again in
     scripts/zenodo-theorems.ts, and the two had drifted: the page told every theorem the kernel had
     walked its whole finite domain, which is false for the 112 declarations that are closed identities
     walking none, and it printed the domain size as an exact count when domainOf() returns a lower
     bound. Both are fixed in src/publication/index.ts, and both surfaces read it. zenodo-gate.ts
     compares this rendering with the deposited one byte for byte. -->
<div class="paper-body" v-html="$params.publication"></div>

</div>

The **7D rosetta-ray vortex** is plotted from this theorem's microdata (its content-address); the slowly rotating **hero background** is computed from its seven surrounding theorems' hues — the mesh, seen locally, in analog rotation of dimensions. Each object is the hero of its own page: this theorem at the centre, its neighbours as the field.

<!-- ── the discovery-ledger theorems: computed by exhaustion in discover.ts ── -->
<div v-if="isRevoked">

## Why this page still exists

This entry was **withdrawn**. It is kept, with its receipt, because the ledger is **append-only**: deleting a
link would break the chain that lets anyone verify every other entry, and rewriting a receipt would be tamper.
So the URL stays resolvable and the record stays honest about its own history — what changed is that this
statement is no longer offered as a theorem, and nothing in the deposit may cite it.

The live record: [the standing theorems](/CHALLENGES) · [the ledger](/proofs). Verify the chain yourself with
`npm run forensics`. A content-address proves integrity, not truth. `entails → 0/7`.

</div>

<div v-if="isKernel && !isRevoked">

## How it was achieved

This is a **Lean 4 theorem**, checked by the kernel over its whole domain — `sorry`-free and axiom-free, which
`scripts/lean.ts` re-verifies per theorem on every run. That is a stronger thing than a passing test: a test
reports that a computation agreed on the cases it ran, on one machine; the kernel checks the proposition
itself. It was then receipted and chained append-only by `scripts/seal-lean.ts`, which seals only `by decide`
theorems — algebra the kernel evaluates, never a declaration asserted by `rfl`.

The source: [the Lean proofs](https://github.com/ceccec/millennium-solutions/tree/main/src/proof) · [the standing theorems](/CHALLENGES). Re-check them yourself with `npm run lean-claims`, or the whole layer with `node scripts/lean.ts`. A content-address proves integrity, not truth. `entails → 0/7`.

</div>

<div v-if="!isLean && !isRevoked && !isKernel">

## How it was achieved

This theorem was **computed by exhaustion** over a finite domain in `scripts/discover.ts` — a `test: () => boolean` that runs to completion, holding by full enumeration. It was **gate-checked** (its name and content hold the honesty floor — no over-reach), **receipted** and **chained** append-only, and it is **re-verified on every build**: if it ever stopped holding, the build would fail, not production. That is what *achieved* means here — not asserted, but recomputable.

One leaf of the chained ledger: [all theorems](/CHALLENGES) · [computed results](/compute) · [the guide](/guide) · [the source formula](https://github.com/ceccec/millennium-solutions/blob/main/scripts/discover.ts). The repo and the site cross-link both ways — this hero page points back to the formula that recomputes it. Verify by cloning and running `npm run lean-claims`. A content-address proves integrity, not truth. `entails → 0/7`.

</div>
