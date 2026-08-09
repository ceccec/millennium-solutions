<script setup lang="ts">
// An interactive uuidna component: type anything and its content-address recomputes live — deterministic,
// reproducible by anyone with no key. A theorem is alive when you interact with it. Integrity, not truth. 0/7.
// No coupling to the page's chained receipt: this is the recompute itself, honest and self-contained.
import { ref, computed } from 'vue'
import { toUuid } from '../../src/0/index.ts'
const seed = ref('')
const addr = computed(() => toUuid(seed.value))
</script>

<template>
  <div class="recompute">
    <strong>Interact — recompute a content-address:</strong>
    <input v-model="seed" placeholder="type anything to recompute…" class="in" aria-label="text to content-address" />
    <span class="arrow">→</span> <code>{{ addr }}</code>
    <p class="note">Type anything and watch its uuidna recompute — deterministic, reproducible by anyone, no key.
      A theorem is alive when you interact with it. A content-address proves integrity, not truth. <code>0/7</code>.</p>
  </div>
</template>

<style scoped>
.recompute { border: 1px solid var(--vp-c-brand-1); border-radius: 10px; padding: .6rem 1rem; margin: 1rem 0; font-size: .9rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent); }
.recompute .in { width: 18rem; max-width: 100%; padding: .25rem .5rem; margin: 0 .3rem; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); }
.recompute .arrow { color: var(--vp-c-brand-1); font-weight: 600; }
.recompute code { word-break: break-all; font-size: .82em; }
.recompute .note { color: var(--vp-c-text-2); font-size: .82rem; margin: .4rem 0 0; }
</style>
