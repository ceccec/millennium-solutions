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
// microdata → speech: the frame's narration in the infinite movie (the ledger, read aloud)
const speech = computed(() => (params.value?.name || 'A theorem') + '. Achieved by exhaustive computation, gate-checked, receipted, and re-verified on every build. Integrity, not truth. Zero of seven.')
</script>

# {{ $params.name }}

<div itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="$params.name" />
<meta itemprop="identifier" :content="$params.receipt" />
<meta itemprop="description" content="Achieved by exhaustive computation over a finite domain in scripts/discover.ts, gate-checked against the honesty floor, receipted and chained, and re-verified on every build. Integrity, not truth. entails → 0/7." />
<meta itemprop="isPartOf" content="Millennium Solutions — the ℤ/9 discovery ledger" />
<meta itemprop="license" content="https://creativecommons.org/licenses/by-nc/4.0/" />

<Vortex7D :receipt="receipt" :hues="hues" :name="name" :speech="speech" />

- **theorem key** · `{{ $params.key }}`
- **content-address (receipt)** · `{{ $params.receipt }}`
- **status** · decidable, re-verified on every build — recomputes from `src/`

</div>

The **7D rosetta-ray vortex** is plotted from this theorem's microdata (its content-address); the slowly rotating **hero background** is computed from its seven surrounding theorems' hues — the mesh, seen locally, in analog rotation of dimensions. Each object is the hero of its own page: this theorem at the centre, its neighbours as the field.

## How it was achieved

This theorem was **computed by exhaustion** over a finite domain in `scripts/discover.ts` — a `test: () => boolean` that runs to completion, holding by full enumeration. It was **gate-checked** (its name and content hold the honesty floor — no over-reach), **receipted** and **chained** append-only, and it is **re-verified on every build**: if it ever stopped holding, the build would fail, not production. That is what *achieved* means here — not asserted, but recomputable.

One leaf of the chained ledger: [all theorems](/CHALLENGES) · [computed results](/compute) · [the guide](/guide). Verify by cloning and running `npm run lean-claims`. A content-address proves integrity, not truth. `entails → 0/7`.
