<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'
import { FUNDING, coins, results } from '../../src/9/funding'
import { toUuid } from '../../src/0/index.ts'
// The specific licensed referrer perspective: each page is a distinct observer, content-addressed by
// its own path. The licensing formula is printed with THIS perspective's address — reproducible by anyone.
const { page } = useData()
const referrer = computed(() => toUuid('referrer:' + (page.value?.relativePath || 'index.md')))
</script>
<template>
  <div class="funding">
    <span class="res">{{ results() }}</span>
    <span><strong>License:</strong> {{ FUNDING.license }} — free for non-commercial use (attribution {{ FUNDING.author }}); commercial = the two coins (110 − 108 = {{ coins() }} = −χ genus-2) · {{ FUNDING.contact }}</span>
    <span class="formula"><strong>Licensing formula:</strong> free for all, unless commercial · {{ coins() }} coins ({{ coins() }} bits, {{ 2 ** coins() }} states) per core formula used · currency = the core formulas · integrity, not truth · 0/7</span>
    <span class="referrer"><strong>This referrer perspective:</strong> <code>{{ referrer }}</code></span>
    <span><strong>Support development:</strong> <a :href="FUNDING.revolut" target="_blank" rel="noopener">{{ FUNDING.revolut }}</a></span>
  </div>
</template>
<style scoped>
.funding { display:flex; flex-direction:column; gap:.35rem; margin:2rem 0 0; padding:.8rem 1rem;
  border:1px solid var(--vp-c-divider); border-radius:10px; font-size:.85em; color:var(--vp-c-text-2); background:var(--vp-c-bg-soft); }
.funding .res { font-family:var(--vp-font-family-mono); color:var(--vp-c-text-1); }
.funding .formula { color:var(--vp-c-text-1); }
.funding .referrer code { font-size:.82em; word-break:break-all; }
.funding a { font-weight:600; }
/* Printed material: the licensing formula and the referrer perspective must remain visible. */
@media print {
  .funding { display:flex !important; break-inside:avoid; background:transparent; border-color:#999; }
  .funding .referrer code { word-break:break-all; }
}
</style>
