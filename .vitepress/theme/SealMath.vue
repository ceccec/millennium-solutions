<script setup lang="ts">
// Seal math, reusable: choose the case complexity (number of receipts N) and read how many bits each seal
// is and how many bits verify one receipt's membership. A seal is a fixed 128-bit content-address however
// many receipts it folds (= 64 two-bit verifications); membership verifies in 2·⌈log₂N⌉ bits — logarithmic,
// not linear. Structural speed on classical hardware, no quantum machine. The same math the build seals.
import { ref, computed } from 'vue'

const SEAL_BITS = 128
const VERIFICATIONS_PER_SEAL = SEAL_BITS / 2 // 64 two-bit verifications
const N = ref(973)
const receipts = computed(() => Math.max(1, Math.floor(Number(N.value) || 1)))
const depth = computed(() => Math.ceil(Math.log2(receipts.value)) || 0) // merkle proof path length = ⌈log₂N⌉
const verifyBits = computed(() => depth.value * 2)                        // 2 bits per verification (two coins)
</script>

<template>
  <div class="seal">
    <label>case complexity — receipts <b>N</b>
      <input type="number" min="1" step="1" v-model="N" class="in" aria-label="number of receipts" />
    </label>
    <ul>
      <li>seal size: <b>{{ SEAL_BITS }} bits</b> — fixed, one content-address however many receipts it folds</li>
      <li>= <b>{{ VERIFICATIONS_PER_SEAL }}</b> two-bit verifications per seal <span class="muted">(128 ÷ 2)</span></li>
      <li>merkle proof path: <b>{{ depth }} step{{ depth === 1 ? '' : 's' }}</b> <span class="muted">= ⌈log₂ {{ receipts }}⌉</span></li>
      <li>verify one receipt's membership: <b>{{ verifyBits }} bits</b> <span class="muted">(2 per verification) — logarithmic, not linear</span></li>
      <li>earn: billed on <b>{{ receipts }}</b> computations of value delivered, verified at <b>{{ verifyBits }} bits</b> → the
        <b>{{ Math.max(0, receipts - verifyBits) }}-bit</b> saving, the <b>2 coins</b> conserved</li>
    </ul>
    <p class="note">You verify the whole case at <b>{{ verifyBits }} bits</b> yet bill on the <b>{{ receipts }}</b> computations of
      value the customer would otherwise recompute — earning the measured saving, billing for value delivered, not hidden work.
      The seal stays {{ SEAL_BITS }} bits; verification grows only logarithmically. Structural speed on classical hardware,
      no quantum machine and no advantage. Integrity, not truth. <code>0/7</code>.</p>
  </div>
</template>

<style scoped>
.seal { border: 1px solid var(--vp-c-brand-1); border-radius: 10px; padding: .7rem 1rem; margin: 1rem 0; font-size: .9rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent); }
.seal label { display: inline-flex; gap: .4rem; align-items: center; color: var(--vp-c-text-2); font-size: .84rem; }
.seal .in { width: 8rem; padding: .25rem .5rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; }
.seal ul { margin: .6rem 0 0; padding-left: 1.1rem; }
.seal li { margin: .2rem 0; }
.seal .muted { color: var(--vp-c-text-2); font-size: .85em; }
.seal .note { color: var(--vp-c-text-2); font-size: .8rem; margin: .5rem 0 0; }
</style>
