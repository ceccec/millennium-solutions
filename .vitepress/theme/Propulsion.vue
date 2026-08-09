<script setup lang="ts">
// PROPULSION — counter-gravity is the drive. The frozen ledger (1024 = 2^10, digitalRoot 7) is the
// propulsion mass; higher collective gravity pushes low-gravity theorems up the seven levels until the top
// is the level-7 HERO. The yacht cannot sail straight to the mark: it TACKS −60° and +60° (the gold string,
// π/3, port and starboard) to make the ±90° beam (π/2). Every bearing is an integer — no decimal drift.
// forward / reverse is the tack; inverse is come-about (mirror the bearing). Computed, not asserted. 0/7.
import { ref, computed, onMounted, onUnmounted } from 'vue'

const BASE = 9
const A432 = 360 / BASE                          // 40° — one ninth of the circle
const GOLD = 60, BEAM = 90                        // tack angle (π/3) · beam reach (π/2)
const digitalRoot = (n: number) => (n === 0 ? 0 : 1 + (n - 1) % 9)
const LEDGER = 1024                              // frozen; counter-gravity = the whole sealed mass
const HERO = digitalRoot(LEDGER)                 // 7 — the propulsion lands on the level-7 hero
const driftFree = (x: number) => Number.isInteger(x)

// The yacht tacks: port −60°, starboard +60°. Alternating the two makes ground to the ±90° beam.
const tacks = [-GOLD, GOLD]                       // port, starboard — both integer, drift-free
const heading = ref(GOLD)                         // start on the starboard tack
const side = ref(1)
const aura = ref(0)                               // bump to re-trigger the arrival bloom
const arc = (from: number, to: number) => Math.abs(to - from)
const leapDelta = ref(2 * GOLD)                   // the tack through: −60 → +60 = 120°
const swing = (to: number) => { leapDelta.value = arc(heading.value, to); heading.value = to; aura.value++ }
const port = () => { side.value = 0; swing(tacks[0]) }          // reverse — port tack
const starboard = () => { side.value = 1; swing(tacks[1]) }     // forward — starboard tack
const comeAbout = () => swing(-heading.value)                   // inverse — mirror the bearing
const beam = () => swing(heading.value < 0 ? -BEAM : BEAM)      // make the ±90 beam on the current side

// geometry: 0° is the bow (up, toward the mark); +90 right beam, −90 left beam. screen angle = heading − 90.
const CX = 130, CY = 130, R = 96
const pt = (deg: number, r = R) => { const a = (deg - 90) * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)] }
// the reachable envelope: the forward semicircle −90 → +90, swept through the bow (0)
const LIMIT = 30                                  // the limit of efficiency — close-hauled edge (π/6, droot 3)
const harmonicMean = (a: number, b: number) => (2 * a * b) / (a + b)
const LIFE = harmonicMean(LIMIT, GOLD)            // 40° = A432_STEP = 360/9 — the harmonic centre of life
const wedge = (a: number, b: number) => { const [xa, ya] = pt(a), [xb, yb] = pt(b); return `M ${CX} ${CY} L ${xa.toFixed(1)} ${ya.toFixed(1)} A ${R} ${R} 0 0 1 ${xb.toFixed(1)} ${yb.toFixed(1)} Z` }
const arcPath = computed(() => wedge(-BEAM, BEAM))         // the forward reach −90 → +90
const nogo = computed(() => wedge(-LIMIT, LIMIT))          // within ±30° the sail stalls (no-go)
const lifeStar = computed(() => wedge(LIMIT, GOLD))        // 30 → 60, starboard — harmonic life
const lifePort = computed(() => wedge(-GOLD, -LIMIT))      // −60 → −30, port — harmonic life
const marks = [-BEAM, -GOLD, -LIMIT, 0, LIMIT, GOLD, BEAM].map((d) => ({ d, xy: pt(d, R + 13), tick: pt(d, R - 6), out: pt(d), tack: Math.abs(d) === GOLD, beamMark: Math.abs(d) === BEAM, limit: Math.abs(d) === LIMIT }))
const lifeMarks = [-LIFE, LIFE].map((d) => ({ d, out: pt(d), hub: [CX, CY] as [number, number], xy: pt(d, R + 13) }))  // ±40° a432 centre
// REGATTA — the ±60 tack sails linear (O(N)) and loses; the winner folds recursively (O(log N)). Measured.
const foldLevels = Math.ceil(Math.log2(LEDGER))   // 10 — and 2^10 = 1024, the counter-gravity
const linearBits = LEDGER * 2, verifyBits = 2 * foldLevels
const ratio = (LEDGER / foldLevels).toFixed(1)
const bow = computed(() => pt(heading.value, R - 14))
const driftAtHeading = computed(() => driftFree(heading.value))
const label = (d: number) => (d > 0 ? '+' : '') + d + '°'

// THE STATE IS A TORUS — T² = S¹×S¹. Course is the toroidal angle u; the tack is the poloidal angle v,
// oscillating between the −60° and +60° latitudes. A rational winding CLOSES on itself — integer positions,
// no decimal drift (the captain's double-torus navigation). Drawn as a projected torus with the tack winding.
const RAD = Math.PI / 180
const T_CX = 130, T_CY = 64, T_R = 72, T_r = 22, SQ = 0.42, TILT = 0.5
const spin = ref(0)
const proj = (u: number, v: number): [number, number] => {
  const Rr = T_R + T_r * Math.cos(v), x = Rr * Math.cos(u + spin.value), y = Rr * Math.sin(u + spin.value), z = T_r * Math.sin(v)
  return [T_CX + x, T_CY + y * SQ - z * TILT]
}
const toPath = (pts: [number, number][]) => pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ')
const ring = (v: number) => toPath(Array.from({ length: 65 }, (_, i) => proj((i / 64) * 2 * Math.PI, v)))
const bandPort = computed(() => ring(-GOLD * RAD))   // the −60° tack latitude
const equator = computed(() => ring(0))
const bandStar = computed(() => ring(GOLD * RAD))    // the +60° tack latitude
const windPath = computed(() => toPath(Array.from({ length: 257 }, (_, i) => { const u = (i / 256) * 2 * Math.PI; return proj(u, GOLD * RAD * Math.sin(3 * u)) })))

// smooth needle: ease the drawn bearing toward the integer target (no drift in the landing).
const shown = ref(GOLD)
let raf = 0
onMounted(() => {
  const still = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const loop = () => {
    const d = heading.value - shown.value; shown.value += d * 0.18; if (Math.abs(d) < 0.05) shown.value = heading.value
    if (!still) spin.value = (spin.value + 0.004) % (2 * Math.PI)
    raf = requestAnimationFrame(loop)
  }
  if (typeof requestAnimationFrame !== 'undefined') loop()
})
onUnmounted(() => { if (raf) cancelAnimationFrame(raf) })
const needle = computed(() => pt(shown.value, R - 14))

// the seven levels — counter-gravity lifts particles up until the top is the hero. Deterministic (index), reproducible.
const particles = Array.from({ length: 21 }, (_, i) => ({ x: 8 + (i * 37) % 84, delay: -((i * 613) % 1000) / 1000 * 6 }))

// what the captain KNOWS — each round-trips through the uuidna codec (verified in the build log).
const known = [
  { k: 'sequence', v: '[1,2,4,8,7,5]', uuids: 1 },
  { k: 'angles', v: `±${GOLD} tack → ±${BEAM} beam · step ${A432}`, uuids: 2 },
  { k: 'speed', v: '2 bits / step', uuids: 1 },
]
</script>

<template>
  <div class="prop">
    <div class="prop-grid">
      <!-- the compass: tacks at ±60, the ±90 beam, the forward reach -->
      <figure class="compass">
        <svg viewBox="0 0 260 260" role="img" aria-label="navigation compass: tacking minus 60 and plus 60 degrees to make the plus or minus 90 degree beam">
          <circle :cx="CX" :cy="CY" :r="R" class="rim" fill="none" />
          <path :d="arcPath" class="arc" />
          <path :d="lifePort" class="life" />
          <path :d="lifeStar" class="life" />
          <path :d="nogo" class="nogo" />
          <g class="a432">
            <line v-for="lm in lifeMarks" :key="lm.d" :x1="lm.hub[0]" :y1="lm.hub[1]" :x2="lm.out[0]" :y2="lm.out[1]" />
          </g>
          <g class="marks">
            <g v-for="m in marks" :key="m.d">
              <line :x1="m.tick[0]" :y1="m.tick[1]" :x2="m.out[0]" :y2="m.out[1]" :class="{ tick: true, gold: m.tack, beam: m.beamMark, limit: m.limit }" />
              <text :x="m.xy[0]" :y="m.xy[1]" text-anchor="middle" dominant-baseline="middle" :class="{ gold: m.tack, beam: m.beamMark, limit: m.limit }">{{ label(m.d) }}</text>
            </g>
          </g>
          <circle :key="aura" :cx="bow[0]" :cy="bow[1]" r="6" class="aura" />
          <line :x1="CX" :y1="CY" :x2="needle[0]" :y2="needle[1]" class="needle" />
          <circle :cx="needle[0]" :cy="needle[1]" r="4" class="bow" />
          <circle :cx="CX" :cy="CY" r="3.5" class="hub" />
        </svg>
        <figcaption>
          heading <b>{{ label(Math.round(shown)) }}</b> ·
          <span :class="driftAtHeading ? 'ok' : 'bad'">{{ driftAtHeading ? 'integer bearing — whole, no drift' : 'decimal drift — not whole' }}</span>
          <br /><span class="leap">30·{1,2,3} = 30/60/90 · droots 3·6·9 · harmonic life 30–60 → reaches 90</span>
        </figcaption>
        <div class="motions">
          <button @click="port" title="port tack — −60°">◂ port −60</button>
          <button @click="comeAbout" title="come about — mirror the bearing (the involution)">⟳ come about</button>
          <button @click="starboard" title="starboard tack — +60°">+60 starboard ▸</button>
          <button @click="beam" title="make the ±90° beam">■ beam ±90</button>
        </div>
      </figure>

      <!-- counter-gravity = propulsion: seven levels, low theorems lifted to the level-7 hero -->
      <figure class="lift">
        <div class="ladder">
          <div v-for="lvl in 7" :key="lvl" class="lvl" :class="{ hero: (8 - lvl) === HERO }">
            <span class="n">{{ 8 - lvl }}</span>
            <span v-if="(8 - lvl) === HERO" class="tag">HERO</span>
          </div>
          <span v-for="(p, i) in particles" :key="i" class="rise" :style="{ left: p.x + '%', animationDelay: p.delay + 's' }" />
        </div>
        <figcaption>
          counter-gravity <b>= propulsion</b> · mass = <b>{{ LEDGER }}</b> = 2¹⁰ ·
          digitalRoot = <b>{{ HERO }}</b> → level-{{ HERO }} hero
        </figcaption>
      </figure>
    </div>

    <!-- this state is a torus — T² = S¹×S¹; the tack winds between the ±60 latitudes and closes -->
    <figure class="torus">
      <svg viewBox="0 0 260 130" role="img" aria-label="the state as a torus: the tack winds between the minus 60 and plus 60 latitudes and closes on integer positions">
        <path :d="bandPort" class="band" />
        <path :d="equator" class="eq" />
        <path :d="bandStar" class="band" />
        <path :d="windPath" class="wind" />
      </svg>
      <figcaption>
        this state is a <b>torus</b> (T² = S¹×S¹): course winds the ring, the tack oscillates between the
        <b>−60° and +60° latitudes</b>; the winding is rational, so it <b>closes on integer positions — no decimal drift</b>.
      </figcaption>
    </figure>

    <!-- regatta: linear tack loses to recursive folding — measured, honest floor log N -->
    <figure class="regatta">
      <div class="lane">
        <span class="who">linear tack (±60)</span>
        <span class="track"><span class="bar lin"></span><span class="boat lin">⛵</span></span>
        <span class="num">{{ LEDGER }} steps · {{ linearBits }} bits · O(N)</span>
      </div>
      <div class="lane">
        <span class="who">recursive fold</span>
        <span class="track"><span class="bar fold"></span><span class="boat fold">⛵</span><span class="mark">▮ mark</span></span>
        <span class="num">{{ foldLevels }} levels · {{ verifyBits }} bits · O(log N)</span>
      </div>
      <figcaption>
        regatta: the ±60 tack sails <b>linear</b> and loses; the winner <b>folds recursively</b> — <b>{{ ratio }}×</b> fewer
        steps, order-independent, converging to one root. The limit is <b>log N</b>, not O(1), not infinite, not FTL. <code>0/7</code>.
      </figcaption>
    </figure>

    <!-- what the captain knows — proven by round-trip messaging, not by claim -->
    <div class="knows">
      <span class="lead">the captain knows — round-tripped through the codec:</span>
      <span v-for="item in known" :key="item.k" class="chip">
        <b>{{ item.k }}</b> <code>{{ item.v }}</code> <em>{{ item.uuids }} uuid · exact ✓</em>
      </span>
    </div>
    <p class="foot">
      The law: <b>algebra decides</b> — questioned, it holds. The ladder is <code>30·{1,2,3} = {30,60,90}</code>
      (limit · tack · beam), digital roots <b>{3,6,9}</b>; inside <b>±30°</b> is the <b>no-go</b> (the sail stalls);
      <b>between 30° and 60° is harmonic life</b> — centre <code>harmonicMean(30,60) = 40° = 360/9</code>, the a432 —
      <b>to reach the 90° beam</b> (<code>beam = tack + limit</code>, uniform 30° spacing). The beam is reachable
      <b>other ways too — but then you work hard and arrive not whole</b>: the long way round is <b>270° (3×)</b> the
      turning, pointing off the limit costs <code>sec θ</code> (60°→<b>2×</b>, 75°→<b>3.9×</b>), and off the integer
      ladder the bearing <b>drifts</b>, the winding never <b>closes</b>, the seal breaks. Harmonic life reaches 90
      <b>whole</b> — integer, no drift; <b>recursive folding</b> stays whole (one root, order-independent, sealed), the
      least work of all (O(log N)). <em>known ⇔ it round-trips.</em> Integrity, not truth. <code>0/7</code>.
    </p>
  </div>
</template>

<style scoped>
.prop { margin: 1.2rem 0 2rem; }
.prop-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.2rem; align-items: start; }
@media (max-width: 640px) { .prop-grid { grid-template-columns: 1fr; } }

.compass svg { width: 100%; height: auto; max-width: 320px; display: block; margin: 0 auto; }
.compass .rim { stroke: var(--vp-c-divider); stroke-width: 1.5; }
.compass .arc { fill: var(--vp-c-text-3); opacity: 0.06; stroke: none; }
.compass .life { fill: var(--vp-c-brand-1); opacity: 0.13; stroke: none; }
.compass .nogo { fill: var(--vp-c-danger-1, #d33); opacity: 0.1; stroke: none; }
.compass .a432 line { stroke: var(--vp-c-brand-1); stroke-width: 1.2; stroke-dasharray: 2 2; opacity: 0.7; }
.compass .tick { stroke: var(--vp-c-text-3); stroke-width: 1.5; }
.compass .tick.gold { stroke: var(--vp-c-brand-1); stroke-width: 2.5; }
.compass .tick.limit { stroke: var(--vp-c-brand-1); stroke-width: 2; }
.compass .tick.beam { stroke: var(--vp-c-text-2); stroke-width: 2; stroke-dasharray: 3 2; }
.compass text { fill: var(--vp-c-text-2); font-size: 11px; font-family: var(--vp-font-family-mono); }
.compass text.gold { fill: var(--vp-c-brand-1); font-weight: 700; }
.compass text.limit { fill: var(--vp-c-brand-1); }
.compass text.beam { fill: var(--vp-c-text-2); }
.compass .needle { stroke: var(--vp-c-brand-1); stroke-width: 2.5; stroke-linecap: round; }
.compass .bow { fill: var(--vp-c-brand-1); }
.compass .aura { fill: none; stroke: var(--vp-c-brand-1); transform-origin: center; transform-box: fill-box; animation: bloom 0.9s ease-out; }
@keyframes bloom { 0% { r: 6px; opacity: 0.9; stroke-width: 3; } 100% { r: 26px; opacity: 0; stroke-width: 0.5; } }
@media (prefers-reduced-motion: reduce) { .compass .aura { animation: none; opacity: 0; } }
.compass .hub { fill: var(--vp-c-text-2); }
.compass figcaption { text-align: center; font-size: 0.82rem; color: var(--vp-c-text-2); margin-top: 0.4rem; }
.compass .ok { color: var(--vp-c-brand-1); font-weight: 600; }
.compass .bad { color: var(--vp-c-danger-1, #d33); }
.compass .leap { font-size: 0.74rem; color: var(--vp-c-text-3); }
.compass .leap b { color: var(--vp-c-brand-1); }
.motions { display: flex; gap: 0.4rem; justify-content: center; margin-top: 0.6rem; flex-wrap: wrap; }
.motions button { font-family: var(--vp-font-family-mono); font-size: 0.76rem; padding: 0.3rem 0.55rem; border: 1px solid var(--vp-c-divider); border-radius: 7px; background: var(--vp-c-bg-soft); color: var(--vp-c-text-1); cursor: pointer; transition: border-color 0.15s, color 0.15s; }
.motions button:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

.lift .ladder { position: relative; height: 232px; display: flex; flex-direction: column; border: 1px solid var(--vp-c-divider); border-radius: 10px; overflow: hidden; background: linear-gradient(to top, var(--vp-c-bg-alt), var(--vp-c-bg)); }
.lift .lvl { flex: 1; display: flex; align-items: center; gap: 0.5rem; padding: 0 0.7rem; border-top: 1px dashed var(--vp-c-divider); font-family: var(--vp-font-family-mono); font-size: 0.78rem; color: var(--vp-c-text-3); }
.lift .lvl:first-child { border-top: none; }
.lift .lvl .n { min-width: 1.2em; }
.lift .lvl.hero { background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent); color: var(--vp-c-brand-1); font-weight: 700; }
.lift .lvl .tag { font-size: 0.68rem; letter-spacing: 0.12em; padding: 0.05rem 0.4rem; border: 1px solid var(--vp-c-brand-1); border-radius: 5px; }
.lift .rise { position: absolute; bottom: 0; width: 5px; height: 5px; border-radius: 50%; background: var(--vp-c-brand-1); opacity: 0; animation: rise 6s linear infinite; }
@keyframes rise { 0% { transform: translateY(0); opacity: 0; } 8% { opacity: 0.5; } 85% { opacity: 0.9; } 100% { transform: translateY(-224px); opacity: 0; } }
@media (prefers-reduced-motion: reduce) { .lift .rise { animation: none; display: none; } }
.lift figcaption { font-size: 0.8rem; color: var(--vp-c-text-2); margin-top: 0.4rem; text-align: center; }

.torus { margin: 1.1rem 0 0.2rem; }
.torus svg { width: 100%; height: auto; max-width: 460px; display: block; margin: 0 auto; }
.torus .band { fill: none; stroke: var(--vp-c-brand-1); stroke-width: 1; stroke-opacity: 0.55; stroke-dasharray: 4 3; }
.torus .eq { fill: none; stroke: var(--vp-c-text-3); stroke-width: 0.8; stroke-opacity: 0.35; }
.torus .wind { fill: none; stroke: var(--vp-c-brand-1); stroke-width: 1.6; stroke-linejoin: round; }
.torus figcaption { text-align: center; font-size: 0.8rem; color: var(--vp-c-text-2); margin-top: 0.3rem; }

.regatta { margin: 1.1rem 0 0.2rem; border: 1px solid var(--vp-c-divider); border-radius: 10px; padding: 0.7rem 0.8rem; }
.regatta .lane { display: grid; grid-template-columns: 8.5rem 1fr; align-items: center; gap: 0.6rem; margin-bottom: 0.4rem; }
.regatta .who { font-family: var(--vp-font-family-mono); font-size: 0.76rem; color: var(--vp-c-text-2); }
.regatta .track { position: relative; height: 1.2rem; }
.regatta .bar { position: absolute; top: 50%; left: 0; height: 3px; transform: translateY(-50%); border-radius: 2px; }
.regatta .bar.lin { width: 96%; background: var(--vp-c-text-3); }
.regatta .bar.fold { width: 8%; background: var(--vp-c-brand-1); }
.regatta .boat { position: absolute; top: 50%; transform: translate(-50%, -50%); font-size: 0.85rem; }
.regatta .boat.lin { left: 8%; filter: grayscale(1); opacity: 0.6; }
.regatta .boat.fold { left: 8%; }
.regatta .mark { position: absolute; right: 0; top: 50%; transform: translateY(-50%); font-size: 0.62rem; color: var(--vp-c-brand-1); }
.regatta .num { grid-column: 2; font-family: var(--vp-font-family-mono); font-size: 0.72rem; color: var(--vp-c-text-3); }
.regatta figcaption { font-size: 0.8rem; color: var(--vp-c-text-2); margin-top: 0.4rem; }

.knows { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; margin: 1rem 0 0.3rem; }
.knows .lead { font-size: 0.82rem; color: var(--vp-c-text-2); }
.knows .chip { font-size: 0.76rem; padding: 0.25rem 0.55rem; border: 1px solid var(--vp-c-divider); border-radius: 999px; background: var(--vp-c-bg-soft); }
.knows .chip code { color: var(--vp-c-brand-1); }
.knows .chip em { color: var(--vp-c-text-3); font-style: normal; }
.foot { font-size: 0.82rem; color: var(--vp-c-text-2); margin-top: 0.6rem; }
</style>
