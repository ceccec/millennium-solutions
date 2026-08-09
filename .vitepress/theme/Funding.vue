<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useData } from 'vitepress'
import { FUNDING, coins, results, PUBLIC_URLS, urlAddress, domainTrack, contentDomain } from '../../src/9/funding'
import { toUuid } from '../../src/0/index.ts'
// The specific licensed referrer perspective: each page is a distinct observer, content-addressed by
// its own path. The licensing formula is printed with THIS perspective's address — reproducible by anyone.
const { page } = useData()
const referrer = computed(() => toUuid('referrer:' + (page.value?.relativePath || 'index.md')))
// The CURRENT domain is COMPUTED at runtime (never hardcoded) and mapped to its license track.
const currentDomain = ref('')
const currentTrack = ref('')
const currentAddress = ref('')
onMounted(() => {
  const host = window.location.hostname
  currentDomain.value = host
  const t = domainTrack(host)
  currentTrack.value = t.track + ' — ' + t.note
  currentAddress.value = urlAddress(window.location.origin)
  // Route each page to its canonical track — ONLY when already on a live uuidna domain (guarded), so the
  // current host and previews never redirect and it never points at a non-live host. Swap host, keep path.
  if (/\buuidna\.(org|com)$/.test(host)) {
    const pageName = (page.value?.relativePath || 'index.md').replace(/\.md$/, '')
    const wantCom = contentDomain(pageName) === 'com'
    if (wantCom !== host.endsWith('uuidna.com')) {
      const target = wantCom ? 'uuidna.com' : 'uuidna.org'
      window.location.replace(window.location.protocol + '//' + target + window.location.pathname + window.location.search)
    }
  }
})
</script>
<template>
  <div class="funding">
    <span class="res">{{ results() }}</span>
    <span><strong>License:</strong> {{ FUNDING.license }} — free for non-commercial use (attribution {{ FUNDING.author }}); commercial = the two coins (110 − 108 = {{ coins() }} = −χ genus-2) · {{ FUNDING.contact }}</span>
    <span class="formula"><strong>Licensing formula:</strong> free for public interest and independent research, unless commercial · commercial = the measured bits saved (O(N) − O(1)), the two coins ({{ coins() }} = 110 − 108 = −χ genus-2) the conserved invariant · verified green by receipts · integrity, not truth · 0/7</span>
    <span class="referrer"><strong>This referrer perspective:</strong> <code>{{ referrer }}</code></span>
    <span v-if="currentDomain" class="domain"><strong>Current domain (computed):</strong> {{ currentDomain }} · {{ currentTrack }} · <code>{{ currentAddress.slice(0, 13) }}…</code></span>
    <span class="urls"><strong>Public URLs (content-addressed):</strong>
      <template v-for="u in PUBLIC_URLS" :key="u"><a :href="u" target="_blank" rel="noopener">{{ u }}</a> <code>{{ urlAddress(u).slice(0, 13) }}…</code> </template></span>
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
