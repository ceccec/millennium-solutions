<script setup>
// The 7D animation engine — ONE reusable component every object shares (theorems and any page).
// From an object's microdata (its content-address) it plots a 7-ray rosetta vortex on a DOUBLE-TORUS
// background: two counter-rotating nested rings (the surrounding-hue rosette field + the rosetta's
// binary messages) under one seamless hue drift. A state engine advances an indicator through the
// vortex orbit 1→2→4→8→7→5→1. After inactivity it expands into a full-screen screensaver.
//
// SENSORY LAYER (opt-in, gesture-gated): tones tuned to a 432 Hz reference play on tap, an ambient
// a432 drone + microdata narration run in the screensaver (the "movie / podcast"). HONEST: the tuning
// is a design choice for pleasant, harmonically-related feedback — NOT a medical, healing, or
// balancing claim. Audio is off until the user enables it (browsers block autoplay; unasked sound is
// hostile). Everything is client-only and degrades to the silent static vortex with JS off.
//
// CSP-safe: the drawing is declarative SMIL (renders identically everywhere, offline, server-side —
// the animateTransform/animate tags land in the static HTML). Hue drift is CSS. Audio uses the
// built-in Web Audio + Web Speech APIs — no external assets.
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { orbit as orbitOf } from '../../src/api/index.ts'  // the doubling orbit, computed — not retyped here

const props = defineProps({
  receipt: { type: String, default: '' },       // this object's content-address — the microdata the rays plot
  hues: { type: String, default: '' },           // CSV of the surrounding objects' hues — the hero field
  screensaver: { type: Boolean, default: true }, // expand fullscreen after inactivity
  name: { type: String, default: '' },           // spoken title
  speech: { type: String, default: '' },         // microdata read aloud (falls back to name)
})

const A432 = 432 // the reference the timings and tones are tuned to

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

// hero background — the seven surrounding objects' hues, in slow analog rotation (inner torus)
const wedges = computed(() => {
  const hues = (props.hues || '').split(',').filter((s) => s !== '').map(Number)
  const R = 56
  return hues.map((hue, i) => {
    const a0 = (i * 360 / 7 - 90) * Math.PI / 180, a1 = ((i + 1) * 360 / 7 - 90) * Math.PI / 180
    return { d: `M0,0 L${(Math.cos(a0) * R).toFixed(2)},${(Math.sin(a0) * R).toFixed(2)} A${R},${R} 0 0 1 ${(Math.cos(a1) * R).toFixed(2)},${(Math.sin(a1) * R).toFixed(2)} Z`, hue }
  })
})

// the pure rosetta as binary messages — the content-address expanded to bits, laid in a ring (outer
// torus). Portable binary digits (0/1), not Glagolitic glyphs, so it draws on every device.
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

// the state engine — the vortex orbit [1,2,4,8,7,5] (powers of 2 mod 9), auto-advancing
const states = computed(() => orbitOf().map((d, i) => {
  const ang = (i * 360 / 6 - 90) * Math.PI / 180
  return { d, x: (Math.cos(ang) * 30).toFixed(2), y: (Math.sin(ang) * 30).toFixed(2), hue: (d * 40) % 360 }
}))
const loop = (arr) => arr.concat(arr[0]).join(';')
const stateX = computed(() => loop(states.value.map((s) => s.x)))
const stateY = computed(() => loop(states.value.map((s) => s.y)))
const stateHue = computed(() => loop(states.value.map((s) => `hsl(${s.hue},70%,55%)`)))

// ── a432 audio (opt-in, gesture-gated). Design tuning, NOT a medical/healing claim. ──
const soundOn = ref(false)
let actx = null, master = null, drone = []
function ensureAudio() {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!actx) { actx = new AC(); master = actx.createGain(); master.gain.value = 0.06; master.connect(actx.destination) }
  if (actx.state === 'suspended') actx.resume()
  return actx
}
function tone(freq, dur = 0.5) {
  const ac = ensureAudio(); if (!ac || !soundOn.value) return
  const o = ac.createOscillator(), g = ac.createGain()
  o.type = 'sine'; o.frequency.value = freq
  g.gain.setValueAtTime(0, ac.currentTime)
  g.gain.linearRampToValueAtTime(1, ac.currentTime + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur)
  o.connect(g); g.connect(master); o.start(); o.stop(ac.currentTime + dur + 0.05)
}
const byteFreq = (v) => A432 * Math.pow(2, (v % 12) / 12) // a432-based 12-tone step
function tapTone() {
  if (!soundOn.value) return
  const h = (props.receipt || '').replace(/-/g, '')
  tone(byteFreq(parseInt(h.slice(0, 2) || '1', 16)))
}
function startDrone() {
  const ac = ensureAudio(); if (!ac || !soundOn.value || drone.length) return
  for (const f of [A432 / 2, (A432 * 3) / 4]) { // root + fifth, low ambient
    const o = ac.createOscillator(), g = ac.createGain()
    o.type = 'sine'; o.frequency.value = f; g.gain.value = 0.03; o.connect(g); g.connect(master); o.start(); drone.push(o)
  }
}
function stopDrone() { for (const o of drone) { try { o.stop() } catch (e) { /* already stopped */ } } drone = [] }
function toggleSound() {
  soundOn.value = !soundOn.value
  if (soundOn.value) { ensureAudio(); tone(A432, 0.3) } else { stopDrone(); cancelSpeech() }
}

// ── microdata to speech (opt-in) ──
function cancelSpeech() { if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel() }
function speak() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  const text = props.speech || props.name
  if (!text) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.rate = 0.95
  window.speechSynthesis.speak(u)
}

// ── screensaver — expand after inactivity; the "movie / podcast" when sound is on ──
const idle = ref(false)
let timer
watch(idle, (on) => {
  if (on && soundOn.value) { startDrone(); speak() }
  else { stopDrone(); cancelSpeech() }
})
onMounted(() => {
  if (typeof window === 'undefined' || !props.screensaver) return
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const IDLE_MS = 45000
  const evs = ['pointermove', 'pointerdown', 'keydown', 'scroll', 'wheel', 'touchstart']
  const reset = () => { idle.value = false; clearTimeout(timer); timer = setTimeout(() => { idle.value = true }, IDLE_MS) }
  for (const e of evs) window.addEventListener(e, reset, { passive: true })
  reset()
  onUnmounted(() => { clearTimeout(timer); for (const e of evs) window.removeEventListener(e, reset); stopDrone(); cancelSpeech() })
})
</script>

<template>
  <div class="vortex7d-wrap" :class="{ screensaver: idle }">
    <svg viewBox="-60 -60 120 120" width="260" height="260" class="vortex7d" role="img" @click="tapTone"
      aria-label="7D rosetta-ray vortex with an auto-advancing vortex-state indicator on a double-torus background of the rosetta's binary messages; tap to sound an a432-tuned tone">
      <!-- hero background = the pure rosetta as a double torus: two counter-rotating nested rings under
           one seamless hue drift (CSS). Inner = surrounding-hue rosette field; outer = binary messages. -->
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
    <div class="vortex7d-controls" v-if="!idle">
      <button type="button" class="vortex7d-btn" :aria-pressed="soundOn" :title="soundOn ? 'a432 tones on (tap the vortex)' : 'enable a432-tuned tones'" @click="toggleSound">{{ soundOn ? '🔊' : '🔈' }}</button>
      <button type="button" class="vortex7d-btn" title="read this theorem's microdata aloud" aria-label="Speak this theorem" @click="speak">🗣</button>
    </div>
    <!-- screensaver "movie" caption: name what is on screen / being narrated, and how to resume -->
    <div class="vortex7d-caption" v-if="idle && name">
      <div class="vortex7d-title">{{ name }}</div>
      <div class="vortex7d-hint">move or tap to resume</div>
    </div>
  </div>
</template>

<style scoped>
.vortex7d { max-width: 100%; height: auto; cursor: pointer; }

/* the whole double-torus background hue drifts seamlessly, in step with the rotation — one continuous cycle */
.vortex7d-bg { animation: vortex7d-hue 60s linear infinite; }
.vortex7d-torus-outer text { fill: hsl(200, 60%, 55%); font-family: ui-monospace, monospace; }
@keyframes vortex7d-hue { to { filter: hue-rotate(360deg); } }

.vortex7d-controls { display: flex; gap: 8px; margin-top: 4px; }
.vortex7d-btn { font-size: 1.05rem; line-height: 1; padding: 4px 8px; border-radius: 8px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); cursor: pointer; }
.vortex7d-btn:hover { border-color: var(--vp-c-brand-1); }

/* screensaver: after inactivity the vortex expands to fill the screen; any activity dismisses it */
.vortex7d-wrap.screensaver { position: fixed; inset: 0; z-index: 60; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 18px; background: var(--vp-c-bg); animation: vortex7d-fade 1.2s ease both; padding: 4vmin; }
.vortex7d-wrap.screensaver .vortex7d { width: min(78vw, 78vh); height: min(78vw, 78vh); }
.vortex7d-wrap.screensaver .vortex7d-bg { animation-duration: 40s; }
.vortex7d-caption { max-width: 80ch; text-align: center; }
.vortex7d-title { font-size: clamp(1rem, 2.4vw, 1.5rem); font-weight: 600; color: var(--vp-c-text-1); line-height: 1.4; }
.vortex7d-hint { margin-top: 10px; font-size: 0.85rem; color: var(--vp-c-text-3); letter-spacing: 0.04em; }
@keyframes vortex7d-fade { from { opacity: 0; } to { opacity: 1; } }

@media (prefers-reduced-motion: reduce) {
  .vortex7d-bg { animation: none; }
  .vortex7d-wrap.screensaver { animation: none; }
}
</style>
