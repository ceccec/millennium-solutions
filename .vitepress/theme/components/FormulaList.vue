<!-- ── ONE LIST COMPONENT, READING public/formulas.jsonld ──────────────────────────────────────────────────
     This folds AllTheorems.vue into itself. That component imported src/proof/discovered.json directly, so
     the whole ledger was bundled into the site's JavaScript to render a list of names; this one fetches the
     schema.org ItemList the build already writes, and nothing is bundled. Two components rendered one kind
     of thing — a list of what this deposit has decided — in two shapes, from two sources, with two copies
     of the same styling. There is one now, and `mode` picks the shape. -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { withBase } from 'vitepress'
const props = defineProps({ mode: { type: String, default: 'filter' }, latest: { type: Number, default: 8 } })
const all = ref([]), q = ref(''), wing = ref(''), file = ref(''), how = ref(''), err = ref('')
onMounted(async () => {
  try { all.value = (await (await fetch(withBase('/formulas.jsonld'))).json()).itemListElement.map((e) => e.item) }
  catch (e) { err.value = 'the formula list could not be loaded — ' + e.message }
})
const wings = computed(() => [...new Set(all.value.map((i) => i.wing))].filter(Boolean).sort())
const files = computed(() => [...new Set(all.value.map((i) => i.source))].filter(Boolean).sort())
const shown = computed(() => all.value.filter((i) =>
  (!q.value || (i.name + ' ' + i.description).toLowerCase().includes(q.value.toLowerCase()))
  && (!wing.value || i.wing === wing.value) && (!file.value || i.source === file.value) && (!how.value || i.proof === how.value)))
const newest = computed(() => all.value.slice(-props.latest).reverse())
</script>
<template>
  <p v-if="err" role="alert">{{ err }}</p>
  <div v-if="mode === 'ledger'" class="fx-latest">
    <p><strong>Latest</strong> — the newest {{ newest.length }}. This updates itself every build, because it reads what the build wrote.</p>
    <ol>
      <li v-for="t in newest" :key="'l-' + t.name">
        <a v-if="t.url" :href="t.url">{{ t.name }}</a><span v-else>{{ t.name }}</span>
        <code v-if="t.receipt" :title="t.receipt">{{ t.receipt.slice(0, 13) }}…</code>
      </li>
    </ol>
  </div>
  <div class="fx-controls">
    <input v-model="q" type="search" placeholder="filter by text — reflection, orbit, involution…" aria-label="Filter by text">
    <select v-model="wing" aria-label="Filter by wing"><option value="">every wing</option><option v-for="w in wings" :key="w">{{ w }}</option></select>
    <select v-model="file" aria-label="Filter by source"><option value="">every source</option><option v-for="f in files" :key="f">{{ f }}</option></select>
    <select v-model="how" aria-label="Filter by proof"><option value="">proved either way</option><option>by exhaustion</option><option>for every value</option></select>
    <!-- THE COUNT IS SHOWN so a filter matching nothing cannot read as an empty deposit. -->
    <p role="status">{{ shown.length }} of {{ all.length }}<span v-if="all.length && !shown.length"> — nothing matches that filter</span></p>
  </div>
  <article v-for="i in shown.slice(0, 400)" :key="i.name" class="fx">
    <h3><a v-if="i.url" :href="i.url">{{ i.name }}</a><span v-else>{{ i.name }}</span></h3>
    <pre v-if="mode !== 'ledger'"><code>{{ i.description }}</code></pre>
    <p class="meta">{{ i.source }} · {{ i.wing }} · {{ i.proof }}<code v-if="mode === 'ledger' && i.receipt"> · {{ i.receipt.slice(0, 13) }}…</code></p>
  </article>
  <p v-if="shown.length > 400">showing the first 400 of {{ shown.length }} — narrow the filter for the rest.</p>
</template>
<style scoped>
.fx-controls{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:1rem 0;position:sticky;top:var(--vp-nav-height,64px);background:var(--vp-c-bg);padding:.6rem 0;z-index:10}
.fx-controls input,.fx-controls select{padding:.4rem .6rem;border:1px solid var(--vp-c-divider);border-radius:6px;background:var(--vp-c-bg-soft);color:var(--vp-c-text-1)}
.fx-controls input{flex:1 1 18rem}
.fx-latest{margin-bottom:1.5rem;padding:.8rem 1rem;border:1px solid var(--vp-c-brand-1);border-radius:10px;background:color-mix(in srgb,var(--vp-c-brand-1) 8%,transparent)}
.fx-latest ol{list-style:none;padding:0;margin:0;display:grid;gap:.4rem}
.fx{border-top:1px solid var(--vp-c-divider);padding:.8rem 0}
.fx h3{margin:0 0 .3rem;font-size:1rem}
.fx pre{margin:.2rem 0;overflow-x:auto}
.fx .meta{margin:.2rem 0 0;font-size:.8rem;color:var(--vp-c-text-2)}
</style>
