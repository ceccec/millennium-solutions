<script setup lang="ts">
// The harness, sealed for reuse in the UI: paste any claim — an AI output, a boast, a proof — and watch it
// be content-addressed (auditable) and, if it drains the honesty floor, REEDUCATED live: each overclaim
// bounded until the text holds. Max free work (the honest remainder stays), max auditability (not IQ),
// harmonic and efficient, by default. The same pure functions the build uses — verify for yourself. 0/7.
import { ref, computed } from 'vue'
import { harness, reeducate } from '../../scripts/harness.ts'

const claim = ref('we prove the Riemann hypothesis and it is faster than light, unbreakable')
const h = computed(() => harness(claim.value))
const fixed = computed(() => reeducate(claim.value))
</script>

<template>
  <div class="reedu">
    <strong>Harness &amp; reeducate — paste any claim:</strong>
    <textarea v-model="claim" rows="2" class="in" aria-label="claim to harness and reeducate"></textarea>
    <div class="row"><span class="k">content-address</span> <code>{{ h.address }}</code></div>
    <div class="row"><span class="k">auditable</span> <b :class="h.auditable ? 'ok' : 'no'">{{ h.auditable }}</b>
      <span class="sep">·</span> <span class="k">holds the floor</span>
      <b :class="h.gatePass ? 'ok' : 'no'">{{ h.gatePass ? 'yes' : 'no — drains' }}</b></div>
    <div v-if="!h.gatePass" class="reeducated">
      <div class="k">reeducated until it holds <span class="muted">({{ fixed.steps.length }} bound{{ fixed.steps.length === 1 ? '' : 's' }})</span>:</div>
      <div class="fixed">{{ fixed.text }}</div>
      <div class="k muted">bounded overclaims: {{ fixed.steps.join(' · ') }} → holds the floor: <b class="ok">{{ fixed.passed }}</b></div>
    </div>
    <div v-else class="already">Already harmonic — no reeducation needed. <span class="muted">Integrity, not truth. 0/7.</span></div>
    <p class="note">Mechanical correction bounds an overclaim; it never makes a false claim true. The gain is
      auditability, not intelligence. The same <code>harness</code> / <code>reeducate</code> the build runs.</p>
  </div>
</template>

<style scoped>
.reedu { border: 1px solid var(--vp-c-brand-1); border-radius: 10px; padding: .7rem 1rem; margin: 1rem 0; font-size: .9rem;
  background: color-mix(in srgb, var(--vp-c-brand-1) 6%, transparent); }
.reedu .in { width: 100%; box-sizing: border-box; padding: .4rem .5rem; margin: .4rem 0; border: 1px solid var(--vp-c-divider);
  border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; resize: vertical; }
.reedu .row { margin: .3rem 0; }
.reedu .k { color: var(--vp-c-text-2); font-size: .82rem; }
.reedu .sep { color: var(--vp-c-divider); margin: 0 .4rem; }
.reedu code { word-break: break-all; font-size: .82em; }
.reedu .ok { color: var(--vp-c-brand-1); }
.reedu .no { color: #e5533d; }
.reedu .reeducated { border-top: 1px dashed var(--vp-c-divider); margin-top: .5rem; padding-top: .5rem; }
.reedu .fixed { background: var(--vp-c-bg); border-radius: 6px; padding: .4rem .5rem; margin: .3rem 0; font-size: .85rem; }
.reedu .already { margin-top: .4rem; color: var(--vp-c-brand-1); font-size: .85rem; }
.reedu .muted { color: var(--vp-c-text-2); font-weight: 400; }
.reedu .note { color: var(--vp-c-text-2); font-size: .8rem; margin: .5rem 0 0; }
</style>
