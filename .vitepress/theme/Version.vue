<script setup lang="ts">
// A live status line — the UI as a client-side harness. The theorem count and the newest theorem are
// embedded at build time and shift every deploy (honest "realtime": per build and at view time). A
// best-effort live fetch shows the latest release tag when GitHub is reachable, and degrades silently
// otherwise — the build-embedded count always holds. Not a live MCP server; deterministic, not AI.
import { ref, onMounted } from 'vue'
import { withBase } from 'vitepress'
import ledger from '../../src/proof/discovered.json'

const count = ledger.length
const latest = ledger[ledger.length - 1]
const liveTag = ref<string | null>(null)

onMounted(async () => {
  try {
    const r = await fetch('https://api.github.com/repos/ceccec/millennium-solutions/tags?per_page=1')
    if (r.ok) { const j = await r.json(); if (Array.isArray(j) && j[0]?.name) liveTag.value = j[0].name }
  } catch { /* offline or rate-limited — the build-embedded count still holds */ }
})
</script>

<template>
  <div class="ver">
    <span class="dot" aria-hidden="true"></span>
    <b>{{ count }}</b> decidable theorems, updated each build
    <span v-if="liveTag" class="tag">· latest tag <code>{{ liveTag }}</code> (live)</span>
    <span class="latest">· newest: <a :href="withBase('/theorem/' + latest.key)">{{ latest.name.split('—')[0].trim() }}</a></span>
    <div class="note">The UI is a client-side harness — the same pure functions the build seals (content-address, gate,
      reeducate) run in your browser, deterministically. Realtime = per build and at view time; not a live MCP server,
      not AI. Integrity, not truth. <code>0/7</code>.</div>
  </div>
</template>

<style scoped>
.ver { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: .6rem 1rem; margin: 1rem 0; font-size: .88rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 5%, transparent); }
.ver .dot { display: inline-block; width: .5rem; height: .5rem; border-radius: 50%; background: var(--vp-c-brand-1);
  margin-right: .4rem; vertical-align: middle; animation: pulse 2s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: .35 } }
.ver code { font-size: .85em; }
.ver .tag, .ver .latest { color: var(--vp-c-text-2); }
.ver .note { color: var(--vp-c-text-2); font-size: .8rem; margin-top: .4rem; }
</style>
