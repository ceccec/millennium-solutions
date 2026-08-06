<script setup lang="ts">
import { FUNDING, coins } from '../../src/9/funding'
</script>
<template>
  <div class="funding">
    <span><strong>License:</strong> {{ FUNDING.license }} — free for non-commercial use (attribution {{ FUNDING.author }}); commercial = the two coins (110 − 108 = {{ coins() }} = −χ genus-2) · {{ FUNDING.contact }}</span>
    <span><strong>Support development:</strong> <a :href="FUNDING.revolut" target="_blank" rel="noopener">{{ FUNDING.revolut }}</a></span>
  </div>
</template>
<style scoped>
.funding { display:flex; flex-direction:column; gap:.35rem; margin:2rem 0 0;
  padding:.8rem 1rem; border:1px solid var(--vp-c-divider); border-radius:10px;
  font-size:.85em; color:var(--vp-c-text-2); background:var(--vp-c-bg-soft); }
.funding a { font-weight:600; }
</style>
