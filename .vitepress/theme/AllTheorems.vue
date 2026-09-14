<script setup lang="ts">
// All theorems — the live entries of the discovery ledger, rendered as a component itself. Every entry is a
// decidable fact verified in scripts/discover.ts and re-verified on each build. Revoked entries stay in the
// append-only ledger with the reason they went; they are not listed here — this listed all of them, and a
// thousand revoked names that restated the removed Clay floor were printed on /the as if they stood.
import { computed } from 'vue'
import { withBase } from 'vitepress'
import ledger from '../../src/proof/discovered.json'
const theorems = (ledger as { key: string; name: string; receipt: string; revoked?: boolean }[]).filter((t) => !t.revoked)
// The newest discoveries, newest first — this surfaces every new set automatically, because the list
// is the ledger itself (imported), re-bundled on each build. No hand-maintained "what's new".
const latest = computed(() => theorems.slice(-8).reverse())
</script>

<template>
  <div class="all-theorems">
    <div class="latest">
      <p class="latest-h"><strong>Latest discoveries</strong> — the newest {{ latest.length }}, newest first. This section updates itself every build, because it reads the ledger directly.</p>
      <ol class="latest-list">
        <li v-for="t in latest" :key="'latest-' + t.key">
          <a :href="withBase('/theorem/' + t.key)" class="name">{{ t.name }}</a>
          <code class="addr" :title="t.receipt">{{ t.receipt.slice(0, 13) }}…</code>
        </li>
      </ol>
    </div>
    <p class="count">
      <strong>{{ theorems.length }}</strong> live theorems — each verified in code and re-verified every build.
      Entries revoked in the append-only ledger are not listed.
    </p>
    <ol>
      <li v-for="(t, i) in theorems" :key="t.key">
        <span class="idx">{{ i + 1 }}</span>
        <span class="name">{{ t.name }}</span>
        <code class="addr" :title="t.receipt">{{ t.receipt.slice(0, 13) }}…</code>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.all-theorems { margin: 1.25rem 0; }
.count { color: var(--vp-c-text-2); font-size: .9rem; margin-bottom: 1rem; }
.all-theorems .latest { margin-bottom: 1.5rem; padding: .8rem 1rem; border: 1px solid var(--vp-c-brand-1); border-radius: 10px; background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent); }
.all-theorems .latest-h { font-size: .9rem; color: var(--vp-c-text-2); margin: 0 0 .6rem; }
.all-theorems .latest-list { list-style: none; padding: 0; margin: 0; display: grid; gap: .4rem; }
.all-theorems .latest-list li { display: grid; grid-template-columns: 1fr auto; align-items: baseline; gap: .6rem; }
.all-theorems .latest-list .name { font-size: .88rem; font-weight: 500; }
.all-theorems .latest-list .addr { font-family: var(--vp-font-family-mono); font-size: .78rem; color: var(--vp-c-text-3); }
.all-theorems ol { list-style: none; padding: 0; margin: 0; display: grid; gap: .4rem; counter-reset: none; }
.all-theorems li {
  display: grid; grid-template-columns: 2.2rem 1fr auto; align-items: baseline; gap: .6rem;
  padding: .5rem .7rem; border: 1px solid var(--vp-c-divider); border-radius: 8px;
  background: var(--vp-c-bg-soft);
}
.idx { color: var(--vp-c-text-3); font-variant-numeric: tabular-nums; font-size: .8rem; text-align: right; }
.name { font-size: .88rem; line-height: 1.45; }
.addr { font-size: .74rem; color: var(--vp-c-text-2); white-space: nowrap; }
@media (max-width: 640px) {
  .all-theorems li { grid-template-columns: 1.8rem 1fr; }
  .addr { grid-column: 2; }
}
</style>
