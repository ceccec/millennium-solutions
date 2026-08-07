<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// The hero renders the ACTUAL underlying math — not a stock video. Nonagon (ℤ/9), the doubling
// circuit 1→2→4→8→7→5, reflection pairs (d ↔ 10−d about the centre 5), and the 6×7 = 42
// combinations revealed by the slider. A live computed "topography", theme-aware, self-contained.
const CX = 200, CY = 150, R = 118
const node = (d: number) => { const a = -Math.PI / 2 + (d / 9) * 2 * Math.PI; return [CX + R * Math.cos(a), CY + R * Math.sin(a)] }
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => ({ d: d % 9, xy: node(d % 9) }))
const doubling = [1, 2, 4, 8, 7, 5, 1] // the circuit
const doublingPath = computed(() => doubling.map((d, i) => (i ? 'L' : 'M') + node(d)[0].toFixed(1) + ' ' + node(d)[1].toFixed(1)).join(' '))
const reflections = [[1, 9], [2, 8], [3, 7], [4, 6]].map(([a, b]) => ({ a: node(a % 9), b: node(b % 9) }))

// the 6×7 = 42 combinations (units × the seven), as chords revealed by the slider
const units = [1, 2, 4, 5, 7, 8], seven = [1, 2, 3, 4, 5, 6, 0]
const allChords = units.flatMap((u) => seven.map((r) => ({ a: node(u % 9), b: node(r % 9) })))
const combos = ref(14)
const chords = computed(() => allChords.slice(0, combos.value))

const angle = ref(0)
let raf = 0
onMounted(() => { const loop = () => { angle.value = (angle.value + 0.15) % 360; raf = requestAnimationFrame(loop) }; if (typeof requestAnimationFrame !== 'undefined') loop() })
onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
</script>

<template>
  <div class="vortex-hero">
    <svg class="vortex-svg" viewBox="0 0 400 300" :style="{ transform: `rotate(${angle}deg)` }" aria-hidden="true">
      <g class="chords"><line v-for="(c, i) in chords" :key="'c' + i" :x1="c.a[0]" :y1="c.a[1]" :x2="c.b[0]" :y2="c.b[1]" /></g>
      <g class="refl"><line v-for="(r, i) in reflections" :key="'r' + i" :x1="r.a[0]" :y1="r.a[1]" :x2="r.b[0]" :y2="r.b[1]" /></g>
      <path class="dbl" :d="doublingPath" fill="none" />
      <g class="nodes"><circle v-for="(n, i) in digits" :key="'n' + i" :cx="n.xy[0]" :cy="n.xy[1]" :r="n.d === 5 ? 7 : 4" :class="{ centre: n.d === 5, void: n.d === 0 }" /></g>
    </svg>
    <div class="vortex-caption">
      <div class="vh-title">The ℤ/9 Vortex Framework</div>
      <p><strong>0 / 7</strong> · recomputable proof of concept — the figure is the math, drawn live (not a video)</p>
      <label class="combo">combinations
        <input type="range" min="0" max="42" v-model.number="combos" />
        <span>{{ combos }} / 42</span>
      </label>
    </div>
  </div>
</template>

<style scoped>
.vortex-hero { position: relative; margin: 1rem 0 2rem; border-radius: 14px; overflow: hidden; background: radial-gradient(120% 120% at 70% 20%, var(--vp-c-bg-alt), var(--vp-c-bg)); border: 1px solid var(--vp-c-divider); }
.vortex-svg { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.5; transform-origin: 50% 50%; }
.vortex-svg .chords line { stroke: var(--vp-c-brand-1); stroke-width: 0.5; opacity: 0.35; }
.vortex-svg .refl line { stroke: var(--vp-c-text-3); stroke-width: 0.6; opacity: 0.5; stroke-dasharray: 3 3; }
.vortex-svg .dbl { stroke: var(--vp-c-brand-1); stroke-width: 2; opacity: 0.9; }
.vortex-svg .nodes circle { fill: var(--vp-c-text-2); }
.vortex-svg .nodes circle.centre { fill: var(--vp-c-brand-1); }
.vortex-svg .nodes circle.void { fill: none; stroke: var(--vp-c-text-3); stroke-width: 1.5; }
.vortex-caption { position: relative; padding: 3.2rem 1.5rem; text-align: center; }
.vortex-caption .vh-title { font-size: 2rem; font-weight: 800; margin: 0; letter-spacing: -0.01em; }
.vortex-caption p { color: var(--vp-c-text-2); margin: 0.4rem 0 1rem; font-size: 0.95rem; }
.vortex-caption .combo { display: inline-flex; align-items: center; gap: 0.5rem; font-family: var(--vp-font-family-mono); font-size: 0.8rem; color: var(--vp-c-text-3); }
</style>
