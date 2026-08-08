<script setup lang="ts">
// All theorems — the full discovery ledger, rendered as a component itself. Every entry is a decidable
// fact verified by exhaustion in scripts/discover.ts and re-verified on each build. None is a Clay
// Millennium result: the six open conjectures stay open, the seventh is settled externally. Floor: 0/7.
import ledger from '../../src/proof/discovered.json'
const theorems = ledger as { key: string; name: string; receipt: string }[]
</script>

<template>
  <div class="all-theorems">
    <p class="count">
      <strong>{{ theorems.length }}</strong> theorems — each verified by exhaustion in code and
      re-verified every build. Not one is a Clay Millennium result; every one lands on <code>0/7</code>.
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
