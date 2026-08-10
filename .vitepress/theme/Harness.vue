<script setup lang="ts">
// The Harness — a full-featured dashboard that IS the harness of the MCP: type any statement (input) and the
// theorems compute the output — the gate verdict (a bit), the content-address, the reeducated form, and the
// seven-dimension audit. Every colour is computed by a theorem (the vortex hue of a content-address, the
// nine digital-root palette). shadcn component anatomy via data-slot; framework-free logic, CSP-safe.
// Integrity, not truth. 0/7.
import { ref, computed } from 'vue'
import { withBase } from 'vitepress'
import { toUuid, merkleFold, digitalRoot } from '../../src/0/index.ts'
import { computes } from '../../scripts/honesty-gate.ts'
import { reeducate, harness7 } from '../../scripts/harness.ts'
import ledger from '../../src/proof/discovered.json'

const theorems = ledger as { key: string; name: string; receipt: string }[]

// colours computed by theorems: the vortex hue of a content-address, and the nine digital-root palette.
const hueOf = (addr: string) => (parseInt(addr.replace(/[^0-9a-f]/gi, '').slice(0, 2) || '0', 16) * 40) % 360
const palette = Array.from({ length: 9 }, (_, i) => (i + 1) * 40) // 9 hues, the a432/vortex step of 40°

const input = ref('we prove all seven Clay problems, unbreakable and faster than light')

const address = computed(() => toUuid(input.value))
const hue = computed(() => hueOf(address.value))
const verdict = computed(() => computes(input.value))
const reeduced = computed(() => reeducate(input.value))
const audit = computed(() => harness7(input.value))
const droot = computed(() => digitalRoot(parseInt(address.value.replace(/[^0-9a-f]/gi, '').slice(0, 4), 16) || 1))

const octaves = Math.floor(theorems.length / 8)
</script>

<template>
  <div class="harness" data-slot="dashboard" :style="{ '--accent': 'hsl(' + hue + ' 62% 50%)', '--accent-soft': 'hsl(' + hue + ' 62% 50% / .10)' }">
    <!-- dashboard header: ledger vitals + the theorem-computed palette -->
    <header data-slot="dashboard-header" class="head">
      <div>
        <h3>The harness — input, computed output</h3>
        <p class="muted">Type a statement; the theorems compute the verdict, the address, the reeducation and the seven-dimension audit. Colours are computed by theorems. Integrity, not truth · 0/7.</p>
      </div>
      <div class="vitals">
        <div class="vital"><span class="n">{{ theorems.length }}</span><span class="l">theorems</span></div>
        <div class="vital"><span class="n">{{ octaves }}<small>×8</small></span><span class="l">octaves</span></div>
      </div>
    </header>

    <div class="palette" aria-hidden="true">
      <span v-for="(h, i) in palette" :key="i" class="swatch" :style="{ background: 'hsl(' + h + ' 62% 50%)' }" :title="'digital root ' + (i + 1)"></span>
    </div>

    <!-- input -->
    <section data-slot="card" class="card input-card">
      <div data-slot="card-header"><h4 data-slot="card-title">Input</h4><p data-slot="card-description" class="muted">Any statement — a claim, a message, a name.</p></div>
      <div data-slot="card-content">
        <textarea v-model="input" rows="3" spellcheck="false" aria-label="statement"></textarea>
      </div>
    </section>

    <!-- outputs, computed live -->
    <div class="grid">
      <section data-slot="card" class="card" :class="verdict.binary ? 'ok' : 'drain'">
        <div data-slot="card-header"><h4 data-slot="card-title">Gate verdict</h4></div>
        <div data-slot="card-content">
          <div class="verdict">{{ verdict.binary ? '1 · passes' : '0 · drained' }}</div>
          <p v-if="verdict.hit" class="hit">tripped on: <code>{{ verdict.hit }}</code></p>
          <p v-else class="muted">no over-reach shape — it holds the floor</p>
        </div>
        <div data-slot="card-footer"><small class="muted">a tripwire, not an oracle · 0/7</small></div>
      </section>

      <section data-slot="card" class="card">
        <div data-slot="card-header"><h4 data-slot="card-title">Content-address</h4><p data-slot="card-description" class="muted">deterministic · digital root {{ droot }}</p></div>
        <div data-slot="card-content"><code class="addr">{{ address }}</code></div>
        <div data-slot="card-footer"><small class="muted">integrity, not truth</small></div>
      </section>

      <section data-slot="card" class="card">
        <div data-slot="card-header"><h4 data-slot="card-title">Reeducated</h4><p data-slot="card-description" class="muted">{{ reeduced.passed ? 'passes' : 'unresolved' }} · {{ reeduced.steps.length }} step(s)</p></div>
        <div data-slot="card-content"><p class="reeduced">{{ reeduced.text }}</p></div>
        <div data-slot="card-footer"><small class="muted">bounded until it holds</small></div>
      </section>

      <section data-slot="card" class="card">
        <div data-slot="card-header"><h4 data-slot="card-title">Seven-dimension audit</h4></div>
        <div data-slot="card-content">
          <div class="verdict">{{ audit.auditableInAll ? 'auditable in all 7' : 'a dimension objects' }}</div>
          <code class="addr small">root {{ audit.root }}</code>
        </div>
        <div data-slot="card-footer"><small class="muted">the same floor in every dialect</small></div>
      </section>
    </div>

    <p class="foot muted">Every output recomputes from the input — no payload stored. Browse the whole record on <a :href="withBase('/organism')">the organism</a>. 0/7.</p>
  </div>
</template>

<style scoped>
.harness { margin: 1.5rem 0; }
.head { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; }
.head h3 { margin: 0 0 .2rem; }
.muted { color: var(--vp-c-text-2); font-size: .85rem; margin: 0; }
.vitals { display: flex; gap: .6rem; }
.vital { border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: .5rem .8rem; text-align: center; background: var(--vp-c-bg-soft); min-width: 74px; }
.vital .n { display: block; font-size: 1.4rem; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
.vital .n small { font-size: .75rem; opacity: .7; }
.vital .l { display: block; font-size: .74rem; color: var(--vp-c-text-2); }
.palette { display: flex; gap: 4px; margin: .9rem 0; }
.swatch { flex: 1; height: 8px; border-radius: 4px; }
.card { border: 1px solid var(--vp-c-divider); border-left: 4px solid var(--accent); border-radius: 10px; padding: .8rem 1rem; margin: .6rem 0; background: var(--accent-soft); }
.card [data-slot="card-title"] { margin: 0; font-size: .95rem; }
.input-card textarea { width: 100%; box-sizing: border-box; font: 14px/1.5 ui-monospace, monospace; padding: .6rem; border: 1px solid var(--vp-c-divider); border-radius: 8px; background: var(--vp-c-bg); color: var(--vp-c-text-1); resize: vertical; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: .6rem; }
.grid .card { margin: 0; }
.verdict { font-size: 1.05rem; font-weight: 700; color: var(--accent); }
.card.ok { --accent: hsl(150 55% 42%); --accent-soft: hsl(150 55% 42% / .10); }
.card.drain { --accent: hsl(4 65% 52%); --accent-soft: hsl(4 65% 52% / .10); }
.hit { font-size: .8rem; margin: .3rem 0 0; }
.hit code, .addr { font-size: .76rem; word-break: break-all; color: var(--accent); }
.addr { display: block; font-family: ui-monospace, monospace; }
.addr.small { font-size: .7rem; margin-top: .3rem; }
.reeduced { font-size: .82rem; margin: 0; color: var(--vp-c-text-1); }
.foot { margin-top: 1rem; }
</style>
