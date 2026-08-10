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
// microdata → speech: the frame's narration in the infinite movie (the ledger, read aloud)
const speech = computed(() => isLean.value
  ? (params.value?.name || 'A theorem') + '. A Lean 4 fact, machine-checked and axiom-free, computed from the sequence — adjacent to a Clay problem, not the conjecture. Integrity, not truth. Zero of seven.'
  : (params.value?.name || 'A theorem') + '. Achieved by exhaustive computation, gate-checked, receipted, and re-verified on every build. Integrity, not truth. Zero of seven.')
const desc = computed(() => isLean.value
  ? 'A Lean 4 theorem computed from the ℤ/9 doubling sequence, machine-checked sorry-free and axiom-free — adjacent to a Clay Millennium Problem, and not the conjecture. Integrity, not truth. entails → 0/7.'
  : 'Achieved by exhaustive computation over a finite domain in scripts/discover.ts, gate-checked against the honesty floor, receipted and chained, and re-verified on every build. Integrity, not truth. entails → 0/7.')
</script>

# {{ $params.name }}

<div itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="$params.name" />
<meta itemprop="identifier" :content="$params.receipt" />
<meta itemprop="description" :content="desc" />
<meta itemprop="isPartOf" content="Millennium Solutions — the ℤ/9 discovery ledger" />
<meta itemprop="license" content="https://creativecommons.org/licenses/by-nc/4.0/" />

<Vortex7D :receipt="receipt" :hues="hues" :name="name" :speech="speech" />

<Recompute />

- **theorem key** · `{{ $params.key }}`
- **content-address (receipt)** · `{{ $params.receipt }}`
- **status** · decidable, re-verified on every build — recomputes from `src/`

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

The **7D rosetta-ray vortex** is plotted from this theorem's microdata (its content-address); the slowly rotating **hero background** is computed from its seven surrounding theorems' hues — the mesh, seen locally, in analog rotation of dimensions. Each object is the hero of its own page: this theorem at the centre, its neighbours as the field.

<!-- ── the discovery-ledger theorems: computed by exhaustion in discover.ts ── -->
<div v-if="!isLean">

## How it was achieved

This theorem was **computed by exhaustion** over a finite domain in `scripts/discover.ts` — a `test: () => boolean` that runs to completion, holding by full enumeration. It was **gate-checked** (its name and content hold the honesty floor — no over-reach), **receipted** and **chained** append-only, and it is **re-verified on every build**: if it ever stopped holding, the build would fail, not production. That is what *achieved* means here — not asserted, but recomputable.

One leaf of the chained ledger: [all theorems](/CHALLENGES) · [computed results](/compute) · [the guide](/guide) · [the source formula](https://github.com/ceccec/millennium-solutions/blob/main/scripts/discover.ts). The repo and the site cross-link both ways — this hero page points back to the formula that recomputes it. Verify by cloning and running `npm run lean-claims`. A content-address proves integrity, not truth. `entails → 0/7`.

</div>
