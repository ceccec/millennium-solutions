<script setup lang="ts">
// Cost / earnings per TRILLION input-tokens — LIVE, from a credible public no-key API. Prices are fetched at
// view time from OpenRouter's public models endpoint (openrouter.ai/api/v1/models, no key, CORS) — aggregated
// live rates, not asserted by this deposit. uuidna's "earnings" is the SAVINGS from content-addressing as a
// caching/dedup layer: for the re-addressable fraction (the hit-rate) you pay the cached read (~a small fraction
// of input) instead of recomputing. Conditional on that fraction — never a universal discount. 0/7.
import { ref, onMounted, computed } from 'vue'

const MTOK_PER_TTOK = 1_000_000 // a trillion tokens = 1,000,000 million-token units
const FAMILIES = ['gpt', 'claude', 'gemini', 'llama', 'deepseek', 'qwen', 'mistral', 'grok'] as const

const hitRate = ref(30)      // % of tokens re-addressable (cache hits) — you set this
const cachePct = ref(10)     // cached read as % of input price (typical prompt-cache read) — you set this
const live = ref<{ id: string; priceIn: number }[]>([])
const loading = ref(true); const err = ref(false)

onMounted(async () => {
  try {
    const r = await fetch('https://openrouter.ai/api/v1/models')
    const j = await r.json()
    const all: { id: string; priceIn: number }[] = (j.data || [])
      .map((m: any) => ({ id: m.id, priceIn: (+m.pricing?.prompt || 0) * 1e6 })) // $ per Mtok input
      .filter((m: { priceIn: number }) => m.priceIn > 0)
    // one representative per family: the cheapest input price whose id names the family
    const picked: { id: string; priceIn: number }[] = []
    for (const fam of FAMILIES) {
      const cand = all.filter((m) => m.id.toLowerCase().includes(fam)).sort((a, b) => a.priceIn - b.priceIn)[0]
      if (cand) picked.push({ id: fam, priceIn: cand.priceIn })
    }
    live.value = picked.length ? picked : all.sort((a, b) => a.priceIn - b.priceIn).slice(0, 8)
    if (!live.value.length) err.value = true
  } catch { err.value = true } finally { loading.value = false }
})

const h = computed(() => Math.min(100, Math.max(0, Number(hitRate.value) || 0)) / 100)
const cf = computed(() => Math.min(100, Math.max(0, Number(cachePct.value) || 0)) / 100)
const rows = computed(() => live.value.map((m) => {
  const base = m.priceIn * MTOK_PER_TTOK // $ per trillion input tokens, no uuidna
  const withUuidna = ((1 - h.value) * m.priceIn + h.value * (cf.value * m.priceIn)) * MTOK_PER_TTOK
  const earnings = base - withUuidna // saved on the re-addressable fraction
  return { id: m.id, priceIn: m.priceIn, base, withUuidna, earnings, pct: base > 0 ? earnings / base : 0 }
}).sort((a, b) => b.base - a.base))
const maxBase = computed(() => Math.max(1, ...rows.value.map((r) => r.base)))
const usd = (n: number) => n >= 1e6 ? '$' + (n / 1e6).toFixed(2) + 'M' : '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })
</script>

<template>
  <div class="tc">
    <div class="ctrl">
      <label>cache-hit rate <b>{{ hitRate }}%</b><input type="range" min="0" max="100" step="5" v-model="hitRate" /></label>
      <label>cached read <b>{{ cachePct }}%</b> of input<input type="range" min="0" max="50" step="1" v-model="cachePct" /></label>
    </div>
    <p v-if="loading" class="muted">Fetching live rates from OpenRouter…</p>
    <p v-else-if="err" class="muted">Live rates unavailable (offline or rate-limited). The model below still holds: cost/Ttok = $/Mtok × 1,000,000; uuidna earns the cache-hit saving.</p>
    <template v-else>
      <table>
        <thead><tr><th>model (live)</th><th>$/Mtok in</th><th>cost / Ttok</th><th>with uuidna</th><th>earnings</th></tr></thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td>{{ r.id }}</td><td>${{ r.priceIn.toFixed(2) }}</td>
            <td>{{ usd(r.base) }}</td><td>{{ usd(r.withUuidna) }}</td>
            <td class="earn">{{ usd(r.earnings) }} <span class="muted">({{ (r.pct * 100).toFixed(0) }}%)</span></td>
          </tr>
        </tbody>
      </table>
      <svg :viewBox="'0 0 100 ' + (rows.length * 13 + 2)" class="chart" role="img" aria-label="cost per trillion input tokens: base versus with uuidna">
        <g v-for="(r, i) in rows" :key="r.id">
          <rect x="0" :y="i * 13 + 1" :width="(r.base / maxBase) * 100" height="4.5" rx="1" fill="var(--vp-c-text-3)" />
          <rect x="0" :y="i * 13 + 6" :width="(r.withUuidna / maxBase) * 100" height="4.5" rx="1" fill="var(--vp-c-brand-1)" />
          <text x="0.5" :y="i * 13 + 0.4" font-size="2.3" fill="var(--vp-c-text-2)">{{ r.id }} · {{ usd(r.base) }} → {{ usd(r.withUuidna) }}</text>
        </g>
      </svg>
      <p class="legend"><span class="sw base"></span> base &nbsp; <span class="sw uu"></span> with uuidna</p>
    </template>
    <p class="note">Live rates via <b>OpenRouter's public models API</b> (no key, fetched in your browser) — aggregated vendor rates,
      not asserted by this deposit and not the vendors' official direct prices. Cost is per trillion <b>input</b> tokens, where caching
      applies. uuidna is a <b>content-addressing / caching layer</b>: earnings are the compute saved on the <b>re-addressable fraction</b>
      only — conditional on the hit-rate, never a universal discount. Measured, not a promise. Integrity, not truth. <code>0/7</code>.</p>
  </div>
</template>

<style scoped>
.tc { margin: 1rem 0; font-size: .9rem; }
.tc .ctrl { display: flex; gap: 1.2rem; align-items: center; flex-wrap: wrap; margin-bottom: .6rem; font-size: .82rem; }
.tc .ctrl label { display: inline-flex; gap: .4rem; align-items: center; }
.tc table { width: 100%; border-collapse: collapse; }
.tc th, .tc td { border: 1px solid var(--vp-c-divider); padding: .35rem .5rem; text-align: right; font-size: .8rem; }
.tc th:first-child, .tc td:first-child { text-align: left; }
.tc .earn { color: var(--vp-c-brand-1); font-weight: 600; }
.tc .chart { width: 100%; height: auto; margin: .7rem 0 .2rem; }
.tc .legend { font-size: .78rem; color: var(--vp-c-text-2); }
.tc .sw { display: inline-block; width: .8rem; height: .8rem; border-radius: 2px; vertical-align: middle; }
.tc .sw.base { background: var(--vp-c-text-3); } .tc .sw.uu { background: var(--vp-c-brand-1); }
.tc .muted { color: var(--vp-c-text-2); }
.tc .note { color: var(--vp-c-text-2); font-size: .8rem; margin-top: .5rem; }
</style>
