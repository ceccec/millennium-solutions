<script setup>
// The 7D animation engine — ONE reusable component every object shares (theorems and any page).
// From an object's microdata (its content-address) it plots a 7-ray rosetta vortex on a hero
// background computed from surrounding hues, PLUS a state engine: an indicator that auto-advances
// through the vortex orbit 1→2→4→8→7→5→1 (discrete state changes). The background hue drifts
// seamlessly (continuous hue-rotate) with the moving elements, and after a spell of no activity the
// whole thing expands into a full-screen screensaver, dismissed by any activity.
//
// CSP-safe: the drawing is declarative SMIL (renders identically everywhere, offline, server-side —
// the animateTransform/animate tags land in the static HTML). The seamless hue drift is CSS. The
// screensaver is progressive enhancement (client-only, honoring prefers-reduced-motion); with JS off
// the static vortex still renders and still animates.
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  receipt: { type: String, default: '' },       // this object's content-address — the microdata the rays plot
  hues: { type: String, default: '' },           // CSV of the surrounding objects' hues — the hero field
  screensaver: { type: Boolean, default: true }, // expand fullscreen after inactivity
})

// own 7 rays — plotted from the content-address bytes (two hex digits per ray)
const petals = computed(() => {
  const h = (props.receipt || '').replace(/-/g, '')
  const a = []
  for (let i = 0; i < 7; i++) {
    const v = parseInt(h.slice(i * 2, i * 2 + 2) || '0', 16)
    const ang = (i * 360 / 7) * Math.PI / 180
    a.push({ x: (Math.cos(ang) * 40).toFixed(2), y: (Math.sin(ang) * 40).toFixed(2), r: 6 + (v % 8), hue: (v * 40) % 360, dur: (2 + i * 0.4).toFixed(1) })
  }
  return a
})

// hero background — the seven surrounding objects' hues, in slow analog rotation
const wedges = computed(() => {
  const hues = (props.hues || '').split(',').filter((s) => s !== '').map(Number)
  const R = 56
  return hues.map((hue, i) => {
    const a0 = (i * 360 / 7 - 90) * Math.PI / 180, a1 = ((i + 1) * 360 / 7 - 90) * Math.PI / 180
    return { d: `M0,0 L${(Math.cos(a0) * R).toFixed(2)},${(Math.sin(a0) * R).toFixed(2)} A${R},${R} 0 0 1 ${(Math.cos(a1) * R).toFixed(2)},${(Math.sin(a1) * R).toFixed(2)} Z`, hue }
  })
})

// the pure rosetta as binary messages — the content-address expanded to bits, laid in a ring (the
// outer torus). Rendered in portable binary digits (0/1), not Glagolitic glyphs, so it draws on every
// device; the bits ARE the rosetta's message, read straight from the microdata.
const binaryRing = computed(() => {
  const h = (props.receipt || '').replace(/-/g, '')
  let bits = ''
  for (const ch of h) bits += parseInt(ch || '0', 16).toString(2).padStart(4, '0')
  bits = (bits + bits + '0'.repeat(32)).slice(0, 32)
  const R = 50
  return bits.split('').map((b, i) => {
    const ang = (i * 360 / 32 - 90) * Math.PI / 180
    return { b, x: (Math.cos(ang) * R).toFixed(2), y: (Math.sin(ang) * R).toFixed(2) }
  })
})

// the state engine — the vortex orbit [1,2,4,8,7,5] (powers of 2 mod 9), auto-advancing. Each state is
// a computed position on the 6-cycle and a computed hue (d·40°); the indicator jumps state→state.
const states = computed(() => [1, 2, 4, 8, 7, 5].map((d, i) => {
  const ang = (i * 360 / 6 - 90) * Math.PI / 180
  return { d, x: (Math.cos(ang) * 30).toFixed(2), y: (Math.sin(ang) * 30).toFixed(2), hue: (d * 40) % 360 }
}))
const loop = (arr) => arr.concat(arr[0]).join(';') // visit each state then return to the first (closed loop)
const stateX = computed(() => loop(states.value.map((s) => s.x)))
const stateY = computed(() => loop(states.value.map((s) => s.y)))
const stateHue = computed(() => loop(states.value.map((s) => `hsl(${s.hue},70%,55%)`)))

// screensaver — expand after inactivity, dismiss on any activity. Client-only, reduced-motion aware.
const idle = ref(false)
let timer
onMounted(() => {
  if (typeof window === 'undefined' || !props.screensaver) return
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const IDLE_MS = 45000
  const evs = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart']
  const reset = () => { idle.value = false; clearTimeout(timer); timer = setTimeout(() => { idle.value = true }, IDLE_MS) }
  for (const e of evs) window.addEventListener(e, reset, { passive: true })
  reset()
  onUnmounted(() => { clearTimeout(timer); for (const e of evs) window.removeEventListener(e, reset) })
})
</script>

<template>
  <div class="vortex7d-wrap" :class="{ screensaver: idle }">
    <svg viewBox="-60 -60 120 120" width="260" height="260" class="vortex7d" role="img"
      aria-label="7D rosetta-ray vortex with an auto-advancing vortex-state indicator on a hero background computed from the surrounding objects">
      <!-- hero background = the pure rosetta as a double torus: two counter-rotating nested rings under
           one seamless hue drift (CSS). Inner torus = the surrounding-hue rosette field; outer torus =
           the rosetta's binary messages (the content-address, in bits). -->
      <g class="vortex7d-bg">
        <g class="vortex7d-torus-inner" opacity="0.16">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="120s" repeatCount="indefinite" />
          <path v-for="(w, i) in wedges" :key="'w' + i" :d="w.d" :fill="'hsl(' + w.hue + ',70%,55%)'" />
        </g>
        <g class="vortex7d-torus-outer" opacity="0.5">
          <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="-360 0 0" dur="90s" repeatCount="indefinite" />
          <text v-for="(t, i) in binaryRing" :key="'b' + i" :x="t.x" :y="t.y" text-anchor="middle" dominant-baseline="middle" font-size="4">{{ t.b }}</text>
        </g>
      </g>
      <!-- own seven rays, counter-rotating, each circle breathing -->
      <g>
        <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="-360 0 0" dur="28s" repeatCount="indefinite" />
        <line v-for="(p, i) in petals" :key="'ray' + i" x1="0" y1="0" :x2="p.x" :y2="p.y" :stroke="'hsl(' + p.hue + ',70%,55%)'" stroke-width="1.4" stroke-opacity="0.55" />
        <circle v-for="(p, i) in petals" :key="i" :cx="p.x" :cy="p.y" :r="p.r" :fill="'hsl(' + p.hue + ',70%,55%)'">
          <animate attributeName="r" :values="p.r + ';' + (p.r + 3) + ';' + p.r" :dur="p.dur + 's'" repeatCount="indefinite" />
        </circle>
      </g>
      <!-- the state engine: an indicator auto-advancing through the vortex orbit 1→2→4→8→7→5→1 -->
      <g>
        <circle r="5" fill="hsl(40,70%,55%)">
          <animate attributeName="cx" :values="stateX" dur="6s" repeatCount="indefinite" calcMode="discrete" />
          <animate attributeName="cy" :values="stateY" dur="6s" repeatCount="indefinite" calcMode="discrete" />
          <animate attributeName="fill" :values="stateHue" dur="6s" repeatCount="indefinite" calcMode="discrete" />
        </circle>
      </g>
      <circle cx="0" cy="0" r="9" fill="hsl(200,70%,55%)" />
    </svg>
  </div>
</template>

<style scoped>
.vortex7d { max-width: 100%; height: auto; }

/* the whole double-torus background hue drifts seamlessly, in step with the rotation — one continuous cycle */
.vortex7d-bg { animation: vortex7d-hue 60s linear infinite; }
.vortex7d-torus-outer text { fill: hsl(200, 60%, 55%); font-family: ui-monospace, monospace; }
@keyframes vortex7d-hue { to { filter: hue-rotate(360deg); } }

/* screensaver: after inactivity the vortex expands to fill the screen; any activity dismisses it */
.vortex7d-wrap.screensaver {
  position: fixed; inset: 0; z-index: 60;
  display: flex; align-items: center; justify-content: center;
  background: var(--vp-c-bg);
  animation: vortex7d-fade 1.2s ease both;
}
.vortex7d-wrap.screensaver .vortex7d { width: min(88vw, 88vh); height: min(88vw, 88vh); }
.vortex7d-wrap.screensaver .vortex7d-bg { animation-duration: 40s; } /* richer hue drift at rest */
@keyframes vortex7d-fade { from { opacity: 0; } to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .vortex7d-bg { animation: none; }
  .vortex7d-wrap.screensaver { animation: none; }
}
</style>
