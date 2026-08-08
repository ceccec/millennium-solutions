<script setup lang="ts">
// When no next is defined, next is computed — and the result emerges from the superposition of the
// referrer (the honest observer). Client-side: read document.referrer, content-address it. Same
// referrer → same point (deterministic); the referrer is hashed, so nothing about it is revealed.
// Integrity, not truth. 0/7.
import { ref, onMounted } from 'vue'
import { toUuid } from '../../src/0/index.ts'

const referrer = ref('direct')
const pov = ref('')
onMounted(() => {
  const r = (typeof document !== 'undefined' && document.referrer) ? document.referrer : 'direct'
  referrer.value = r
  pov.value = toUuid('referrer:' + r)
})
</script>

<template>
  <div class="next-observer" style="border:1px solid var(--vp-c-divider);border-radius:8px;padding:1rem 1.25rem;margin:1rem 0">
    <p><strong>No next defined → next computed.</strong> The result emerges from the superposition of the referrer — the honest observer collapses it to one point.</p>
    <p>Your arrival (referrer): <code>{{ referrer }}</code></p>
    <p>Your computed point of view: <code>{{ pov || '…' }}</code></p>
    <p style="font-size:.85em;opacity:.75;margin-bottom:0"><em>Integrity, not truth — a content-address of your arrival context. The same referrer always computes the same point; the referrer is hashed, so nothing about it is revealed. Deposit 0/7.</em></p>
  </div>
</template>
