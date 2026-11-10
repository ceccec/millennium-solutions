<script setup lang="ts">
// The deposit's ISO 690 bibliography, rendered under EVERY page (fused through the layout-bottom slot, the
// way Funding is). The list is computed at build time by references.data.ts from the tree, so it is the same
// on every page and the same the Zenodo record carries. Each page is a publication, and a publication states
// the standards it formalises and the prior art it descends from.
import { data as references } from './references.data.ts'
</script>

<template>
  <section v-if="references.length" class="iso-references" aria-labelledby="iso-690-references">
    <h2 id="iso-690-references">References</h2>
    <p>The ISO standards these proofs formalise and the prior art this deposit descends from, as a numbered
      reference list per ISO 690 — the same references the Zenodo record carries, read from the tree on every build.</p>
    <ol>
      <li v-for="(ref, i) in references" :key="i">{{ ref }}</li>
    </ol>
  </section>
</template>

<style scoped>
.iso-references {
  max-width: 960px;
  margin: 2rem auto 0;
  padding: 1.5rem 1.5rem 0;
  border-top: 1px solid var(--vp-c-divider);
  font-size: 0.85rem;
}
.iso-references h2 {
  font-size: 0.95rem;
  border: 0;
  margin: 0 0 0.5rem;
  padding: 0;
}
.iso-references p { color: var(--vp-c-text-2); margin: 0 0 0.75rem; }
.iso-references ol { margin: 0; padding-left: 1.4rem; color: var(--vp-c-text-2); }
.iso-references li { margin: 0.15rem 0; }
</style>
