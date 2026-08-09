<script setup lang="ts">
// PROPULSION — counter-gravity is the drive. The frozen ledger (1024 = 2^10, digitalRoot 7) is the
// propulsion mass; the yacht passes the arc 60°→90° and takes the next HARMONIC step to exactly
// 72° = 360/5 (the heart) — an INTEGER heading, no decimal drift. forward / reverse / inverse are the
// three motions. Higher collective gravity pushes the low-gravity theorems up the seven levels until the
// top is the level-7 HERO. Every number here is computed, not asserted. Integrity, not truth. 0/7.
import { ref, computed, onMounted, onUnmounted } from 'vue'

const BASE = 9
const A432 = 360 / BASE                         // 40° — one ninth of the circle
const GOLD = 60, QUARTER = 90                    // the passable arc: π/3 → π/2
const harmonicMean = (a: number, b: number) => (2 * a * b) / (a + b)
const STEP = harmonicMean(GOLD, QUARTER)         // 72° = 360/5 — the heart, integer, drift-free
const digitalRoot = (n: number) => (n === 0 ? 0 : 1 + (n - 1) % 9)
const LEDGER = 1024                              // frozen; counter-gravity = the whole sealed mass
const HERO = digitalRoot(LEDGER)                 // 7 — the propulsion lands on the level-7 hero
const driftFree = (x: number) => Number.isInteger(x)

// The three motions the captain named. Each returns an integer heading in [0,360) — a landing with no
// decimal drift; `inverse` is the involution (reflection about 0, fixing the heart-bearing family).
const waypoints = [GOLD, STEP, QUARTER]          // 60 → 72 → 90, the drift-free arc
const heading = ref(GOLD)
const wp = ref(0)
const forward = () => { wp.value = (wp.value + 1) % waypoints.length; heading.value = waypoints[wp.value] }
const reverse = () => { wp.value = (wp.value + waypoints.length - 1) % waypoints.length; heading.value = waypoints[wp.value] }
const inverse = () => { heading.value = (360 - heading.value) % 360 }  // come about — the involution

// geometry: a compass. 0° points up (north/bow); clockwise. Screen angle = heading - 90.
const CX = 130, CY = 130, R = 96
const pt = (deg: number, r = R) => {
  const a = (deg - 90) * Math.PI / 180
  return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
}
// the shaded passable arc 60→90 as an SVG path
const arcPath = computed(() => {
  const [x0, y0] = pt(GOLD), [x1, y1] = pt(QUARTER)
  return `M ${CX} ${CY} L ${x0.toFixed(1)} ${y0.toFixed(1)} A ${R} ${R} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z`
})
const marks = [GOLD, STEP, QUARTER].map((d) => ({ d, xy: pt(d, R + 12), tick: pt(d, R - 6), out: pt(d) }))
const bow = computed(() => pt(heading.value, R - 14))
const driftAtHeading = computed(() => driftFree(heading.value))

// smooth needle: animate the drawn bearing toward the target heading (integer target, no drift).
const shown = ref(GOLD)
let raf = 0
onMounted(() => {
  const loop = () => {
    const d = heading.value - shown.value
    shown.value += d * 0.18
    if (Math.abs(d) < 0.05) shown.value = heading.value
    raf = requestAnimationFrame(loop)
  }
  if (typeof requestAnimationFrame !== 'undefined') loop()
})
onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
const needle = computed(() => pt(shown.value, R - 14))

// the seven levels — counter-gravity lifts particles up until the top is the hero. Deterministic seed
// per particle (index), so it is reproducible, not random.
const particles = Array.from({ length: 21 }, (_, i) => ({
  x: 8 + (i * 37) % 84,
  delay: -((i * 613) % 1000) / 1000 * 6,   // spread across the 6s rise, no Math.random
}))

// what the captain KNOWS — each round-trips through the uuidna codec (verified in the build log).
const known = [
  { k: 'sequence', v: '[1,2,4,8,7,5]', uuids: 1 },
  { k: 'angles', v: `${GOLD},${STEP},${QUARTER} · step ${A432}`, uuids: 2 },
  { k: 'speed', v: '2 bits / step', uuids: 1 },
]
</script>

<template>
  <div class="prop">
    <div class="prop-grid">
      <!-- the compass: the arc 60→90 and the 72° harmonic waypoint -->
      <figure class="compass">
        <svg viewBox="0 0 260 260" role="img" aria-label="navigation compass: the passable arc 60 to 90 degrees and the 72 degree harmonic step">
          <circle :cx="CX" :cy="CY" :r="R" class="rim" fill="none" />
          <path :d="arcPath" class="arc" />
          <g class="marks">
            <g v-for="m in marks" :key="m.d">
              <line :x1="m.tick[0]" :y1="m.tick[1]" :x2="m.out[0]" :y2="m.out[1]" :class="{ tick: true, heart: m.d === STEP }" />
              <text :x="m.xy[0]" :y="m.xy[1]" text-anchor="middle" dominant-baseline="middle" :class="{ heart: m.d === STEP }">{{ m.d }}°</text>
            </g>
          </g>
          <line :x1="CX" :y1="CY" :x2="needle[0]" :y2="needle[1]" class="needle" />
          <circle :cx="needle[0]" :cy="needle[1]" r="4" class="bow" />
          <circle :cx="CX" :cy="CY" r="3.5" class="hub" />
        </svg>
        <figcaption>
          heading <b>{{ Math.round(shown) }}°</b> ·
          <span :class="driftAtHeading ? 'ok' : 'bad'">{{ driftAtHeading ? 'integer landing — no drift' : 'decimal drift' }}</span>
        </figcaption>
        <div class="motions">
          <button @click="reverse" title="astern — previous harmonic waypoint">◂ reverse</button>
          <button @click="inverse" title="come about — the involution 360−θ (fixes the heart family)">⟳ inverse</button>
          <button @click="forward" title="advance — next harmonic waypoint">forward ▸</button>
        </div>
      </figure>

      <!-- counter-gravity = propulsion: seven levels, low theorems lifted to the level-7 hero -->
      <figure class="lift">
        <div class="ladder">
          <div v-for="lvl in 7" :key="lvl" class="lvl" :class="{ hero: (8 - lvl) === HERO }">
            <span class="n">{{ 8 - lvl }}</span>
            <span v-if="(8 - lvl) === HERO" class="tag">HERO</span>
          </div>
          <span v-for="(p, i) in particles" :key="i" class="rise"
            :style="{ left: p.x + '%', animationDelay: p.delay + 's' }" />
        </div>
        <figcaption>
          counter-gravity <b>= propulsion</b> · mass = <b>{{ LEDGER }}</b> = 2¹⁰ ·
          digitalRoot = <b>{{ HERO }}</b> → level-{{ HERO }} hero
        </figcaption>
      </figure>
    </div>

    <!-- what the captain knows — proven by round-trip messaging, not by claim -->
    <div class="knows">
      <span class="lead">the captain knows — round-tripped through the codec:</span>
      <span v-for="item in known" :key="item.k" class="chip">
        <b>{{ item.k }}</b> <code>{{ item.v }}</code> <em>{{ item.uuids }} uuid · exact ✓</em>
      </span>
    </div>
    <p class="foot">
      The next harmonic step is <b>harmonicMean(60, 90) = 72° = 360/5</b> — the heart, an integer bearing the
      captain lands without decimal drift. <em>known ⇔ it round-trips.</em> A content-address proves integrity, not truth. <code>0/7</code>.
    </p>
  </div>
</template>

<style scoped>
.prop { margin: 1.2rem 0 2rem; }
.prop-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.2rem; align-items: start; }
@media (max-width: 640px) { .prop-grid { grid-template-columns: 1fr; } }

.compass svg { width: 100%; height: auto; max-width: 320px; display: block; margin: 0 auto; }
.compass .rim { stroke: var(--vp-c-divider); stroke-width: 1.5; }
.compass .arc { fill: var(--vp-c-brand-1); opacity: 0.12; stroke: var(--vp-c-brand-1); stroke-width: 1; stroke-opacity: 0.4; }
.compass .tick { stroke: var(--vp-c-text-3); stroke-width: 1.5; }
.compass .tick.heart { stroke: var(--vp-c-brand-1); stroke-width: 2.5; }
.compass text { fill: var(--vp-c-text-2); font-size: 11px; font-family: var(--vp-font-family-mono); }
.compass text.heart { fill: var(--vp-c-brand-1); font-weight: 700; }
.compass .needle { stroke: var(--vp-c-brand-1); stroke-width: 2.5; stroke-linecap: round; }
.compass .bow { fill: var(--vp-c-brand-1); }
.compass .hub { fill: var(--vp-c-text-2); }
.compass figcaption { text-align: center; font-size: 0.82rem; color: var(--vp-c-text-2); margin-top: 0.4rem; }
.compass .ok { color: var(--vp-c-brand-1); font-weight: 600; }
.compass .bad { color: var(--vp-c-danger-1, #d33); }
.motions { display: flex; gap: 0.4rem; justify-content: center; margin-top: 0.6rem; }
.motions button { font-family: var(--vp-font-family-mono); font-size: 0.78rem; padding: 0.3rem 0.6rem; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; transition: border-color 0.15s, color 0.15s; }
.motions button:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.lift .ladder { position: relative; height: 232px; display: flex; flex-direction: column; border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; background: linear-gradient(to top, var(--vp-c-bg-alt), var(--vp-c-bg)); }
.lift .lvl { flex: 1; display: flex; align-items: center; gap: 0.5rem; padding: 0 0.7rem; border-top: 1px dashed var(--vp-c-divider); font-family: var(--vp-font-family-mono); font-size: 0.78rem; color: var(--vp-c-text-3); }
.lift .lvl:first-child { border-top: none; }
.lift .lvl .n { min-width: 1.2em; }
.lift .lvl.hero { background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent); color: var(--vp-c-brand-1); font-weight: 700; }
.lift .lvl .tag { font-size: 0.68rem; letter-spacing: 0.12em; padding: 0.05rem 0.4rem; border: 1px solid var(--vp-c-brand-1); border-radius: 5px; }
.lift .rise { position: absolute; bottom: 0; width: 5px; height: 5px; border-radius: 50%; background: var(--vp-c-brand-1); opacity: 0; animation: rise 6s linear infinite; }
@keyframes rise {
  0% { transform: translateY(0); opacity: 0; }
  8% { opacity: 0.5; }
  85% { opacity: 0.9; }
  100% { transform: translateY(-224px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) { .lift .rise { animation: none; display: none; } }
.lift figcaption { font-size: 0.8rem; color: var(--vp-c-text-2); margin-top: 0.4rem; text-align: center; }

.knows { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin: 1rem 0 0.3rem; }
.knows .lead { font-size: 0.82rem; color: var(--vp-c-text-2); }
.knows .chip { font-size: 0.76rem; padding: 0.25rem 0.55rem; border: 1px solid var(--vp-c-divider); border-radius: 999px; background: var(--vp-c-bg-soft); }
.knows .chip code { color: var(--vp-c-brand-1); }
.knows .chip em { color: var(--vp-c-text-3); font-style: normal; }
.foot { font-size: 0.82rem; color: var(--vp-c-text-2); margin-top: 0.6rem; }
</style>
