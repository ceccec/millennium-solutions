// scripts/clock.ts — THE QUANTUM CLOCK & CALENDAR: the live content-address of NOW, read by its HEX MEANING.
//
// Every instant has one content-address: the version-8 UUID of its millisecond. This page clocks the browser's
// real time into that address once a second and decodes the HEX — the version nibble (8, the deposit's own
// field), the ℤ/9 vortex digit, the three tarot cards — so the animation is a live representation of what the
// hex MEANS, not of any name. The star field turns at the real sidereal day (the sky's own rotation); the ℤ/9
// vortex [1,2,4,8,7,5] is the compass, the live digit lit.
//
// Two layers, kept apart (the deposit's rule, as on the dashboard):
//   FACT     — reproducible: toUuid(timestamp) returns the same hex on any machine; recompute and confirm.
//   PATTERN  — a design mapping (hue from the digit, the tarot cards, the star aesthetic). It claims NOTHING
//              about the sky, astrology, neurology, health, or the Millennium problems.
// Honest floor: "quantum" here is the discrete content-address (the coin) of the instant — NOT a quantum
// device. No CHSH is run. The sidereal day is a measured astronomical constant, labelled as one.
//
// The client-side decoder is the SAME code as src/0 — defined once below, cross-checked against the imported
// toUuid over a sample (AGREEMENT IS THE PRECONDITION), then serialised verbatim into the component. If the
// mirror drifts from src/0/index.ts, this generator throws and nothing ships.
import { writeFileSync } from 'node:fs'
import { toUuid, vortexOrbit } from '../src/0/index.ts'
import { CAPACITY } from '../src/0/imprint.ts'

// ── THE REGISTER AND THE COIL — bit accounting, derived from the RFC-9562 structure, cross-checked against
//    imprint.ts (not typed). Each UUID is a 128-bit register; its free bits are the qubits the Mermin/GHZ
//    octaves run on (src/iso/iec-4879-quantum). The "hexbit coil" is the reserved structure that keeps it a
//    legal, addressable UUID. ──────────────────────────────────────────────────────────────────────────────
const TOTAL_BITS = 128
const VER_BITS = 4                               // version nibble (bits 48..51)
const VAR_BITS = 2                               // variant (bits 64,65)
const COIL = VER_BITS + VAR_BITS                 // 6 reserved — the hexbit coil's nominal cost
const FREE = TOTAL_BITS - COIL                   // 122 free bits — the qubit register
const LEN_HEADER = 7
const PAYLOAD = FREE - LEN_HEADER                // 115 message bits
if (PAYLOAD !== CAPACITY) throw new Error(`clock: payload ${PAYLOAD} ≠ imprint CAPACITY ${CAPACITY} — bit accounting drifted from src/0/imprint.ts`)
// Cross-encryption / version-mixing: ANY nibble parses as a UUID (version 0 and >8 are custom/unused), so the
// version field need not be a dead tax — cross-encrypt it and one UUID is consistent with mixed versions,
// its 4 version bits carrying payload. Only the 2 variant bits must stay "10" to read as the RFC variant at
// all. So the irreducible coil cost is the variant: 6 → 2. "Contribute 2 to save" the whole addressable 128.
const IRREDUCIBLE = VAR_BITS                     // 2 — the only bits a legal UUID cannot reclaim
const RECLAIMED = VER_BITS                       // 4 — the version nibble, freed by cross-mixing
const ADDRESSABLE = FREE + RECLAIMED             // 126 — free bits once the nibble carries payload too

// ── the decoder — plain functions, serialised into the browser by .toString() so the live code IS the checked
//    code. They reference only SEEDS and one another (declared in the emitted block) and JS built-ins. ───────
const SEEDS = [0, 0x9e3779b9, 0x243f6a88, 0xb7e15162]
function mul32(a: number, b: number): number {
  const al = a & 0xffff, ah = a >>> 16, bl = b & 0xffff, bh = b >>> 16
  return (al * bl + ((ah * bl + al * bh) & 0xffff) * 0x10000) >>> 0
}
function hash32(input: string, seed: number): number {
  let h = (0x811c9dc5 ^ seed) >>> 0
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = mul32(h, 0x01000193) >>> 0
    h ^= h >>> 13
  }
  h = mul32(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = mul32(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return (h ^ (h >>> 16)) >>> 0
}
function addr(seed: string): string {
  const words = SEEDS.map((s) => hash32(seed, s))
  const bytes: number[] = []
  words.forEach((w) => { bytes.push((w >>> 24) & 0xff, (w >>> 16) & 0xff, (w >>> 8) & 0xff, w & 0xff) })
  bytes[6] = (bytes[6] & 0x0f) | 0x80            // version nibble = 8 (RFC 9562 custom) — the deposit's field
  bytes[8] = (bytes[8] & 0x3f) | 0x80            // variant = RFC 4122/9562
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20)
}
function hexOf(u: string): string { return u.replace(/[^0-9a-f]/g, '') }
function tarotOf(u: string): number[] { const h = hexOf(u); return [0, 1, 2].map((i) => parseInt(h.slice(i * 4, i * 4 + 4), 16) % 78) }
function zNine(u: string): number { const h = hexOf(u); let s = 0; for (let i = 0; i < h.length; i++) s += parseInt(h[i], 16); return s % 9 }

// ── CROSS-CHECK: the mirror must equal src/0's toUuid on every sample, or the build fails. ──────────────────
const sample = ['0', '1', '42', '1700000000000', String(Date.now()), 'origin', 'theorem:A', 'theorem:B']
for (const s of sample) {
  if (addr(s) !== toUuid(s)) throw new Error(`clock: mirror drift from src/0 at seed ${JSON.stringify(s)} — ${addr(s)} ≠ ${toUuid(s)}`)
}
const VORTEX = vortexOrbit()                     // the ℤ/9 doubling orbit, derived not typed

// the 22 Major Arcana names index the tarot cards 0..21 (78 total: 22 major + 56 minor); the clock shows the
// card NUMBER (0..77) — the encoding, not a reading.
const SIDEREAL_DAY_S = 86164.0905                 // mean sidereal day (s) — the sky's true rotation period

// ── geometry (static, build-time): the pentagram star and the ℤ/9 nine-point wheel ──────────────────────────
const C = 110, R = 86, RW = 62
const P = (ang: number, r: number) => [C + r * Math.cos(ang - Math.PI / 2), C + r * Math.sin(ang - Math.PI / 2)]
const starPts = [0, 1, 2, 3, 4].map((i) => P((i * 2 * Math.PI) / 5, R))
const starPath = 'M' + [0, 2, 4, 1, 3].map((i) => starPts[i].map((n) => n.toFixed(1)).join(',')).join(' L') + ' Z'
const ring9 = Array.from({ length: 9 }, (_, i) => P((i * 2 * Math.PI) / 9, RW))

const clientBlock = [mul32, hash32, addr, hexOf, tarotOf, zNine]
  .map((f) => f.toString()).join('\n')

// ── the nine wheel nodes as SVG, hue = digit × 40° (the a432 design mapping), the live digit lit by :class ───
const wheelNodes = ring9.map((pt, d) =>
  `<circle cx="${pt[0].toFixed(1)}" cy="${pt[1].toFixed(1)}" r="9" fill="hsl(${d * 40} 65% 55%)" :class="{ lit: z === ${d} }" />`
  + `<text x="${pt[0].toFixed(1)}" y="${(pt[1] + 4).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">${d}</text>`
).join('\n      ')

const md = `---
title: Quantum clock
description: The live content-address of now, read by its hex meaning — version-8 field, ℤ/9 vortex digit, tarot — with the star field at the real sidereal day.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// the decoder — the SAME code as src/0/index.ts, cross-checked at build (scripts/clock.ts). version nibble 8,
// RFC variant, ℤ/9 digit, 3-card tarot — read from the hex, not from a name.
const SEEDS = ${JSON.stringify(SEEDS)}
${clientBlock}
const VORTEX = ${JSON.stringify(VORTEX)}

const iso = ref(''), uuid = ref(''), z = ref(0), tarot = ref([0, 0, 0]), ms = ref('')
let timer
function tick () {
  const t = Date.now()
  const u = addr(String(t))
  const d = new Date(t)
  iso.value = d.toISOString()
  ms.value = String(t)
  uuid.value = u
  z.value = zNine(u)
  tarot.value = tarotOf(u)
}
onMounted(() => { tick(); timer = setInterval(tick, 1000) })
onUnmounted(() => clearInterval(timer))
</script>

<style>
.clk-wrap{display:grid;grid-template-columns:minmax(240px,1fr) minmax(220px,280px);gap:20px;align-items:center;margin:18px 0}
@media(max-width:620px){.clk-wrap{grid-template-columns:1fr}}
.clk-card{border:1px solid var(--vp-c-divider);border-radius:var(--radius,12px);padding:16px;background:var(--vp-c-bg-soft)}
.clk-k{font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--vp-c-text-2)}
.clk-hex{font-family:var(--vp-font-family-mono);font-size:15px;word-break:break-all;margin:4px 0}
.clk-hex .ver{color:var(--vp-c-brand-1);font-weight:800}
.clk-v{font-size:20px;font-weight:700;color:var(--vp-c-brand-1)}
.clk-s{font-size:12px;color:var(--vp-c-text-2)}
/* the star field turns at the real sidereal day — one rotation per 23h56m04s, the sky's own rate */
.sidereal{transform-origin:${C}px ${C}px;animation:sid ${SIDEREAL_DAY_S}s linear infinite}
.vortex-spin{transform-origin:${C}px ${C}px;animation:vspin ${(SIDEREAL_DAY_S / 6).toFixed(1)}s linear infinite}
.draw{stroke-dasharray:1400;stroke-dashoffset:1400;animation:draw 9s ease-in-out infinite alternate}
.lit{stroke:var(--vp-c-brand-1);stroke-width:3}
@keyframes sid{to{transform:rotate(360deg)}}
@keyframes vspin{to{transform:rotate(-360deg)}}
@keyframes draw{to{stroke-dashoffset:0}}
@media(prefers-reduced-motion:reduce){.sidereal,.vortex-spin,.draw{animation:none;stroke-dashoffset:0}}
</style>

# Quantum clock & calendar

> **The clock is the content-address of now.** Every millisecond has one version-8 UUID — the deposit's own hex field. This page clocks your browser's real time into that address and decodes the **hex meaning** — the version nibble, the ℤ/9 vortex digit, the three tarot cards — live. The animation represents the hex, not a name.

<div class="clk-wrap">
<div>

<div class="clk-card">
  <div class="clk-k">The instant → its address <span class="clk-s">(FACT — reproducible)</span></div>
  <div class="clk-hex"><span class="ver">{{ uuid.slice(0,14) }}</span>{{ uuid.slice(14) }}</div>
  <div class="clk-s">{{ iso }} · epoch ms {{ ms }}</div>
  <div class="clk-s" style="margin-top:8px">version nibble <b>8</b> (RFC 9562 custom — the deposit's field) · ℤ/9 vortex digit <b style="color:var(--vp-c-brand-1)">{{ z }}</b> · tarot <b>[{{ tarot.join(', ') }}]</b> of 0…77</div>
  <div class="clk-s" style="margin-top:6px">Recompute: <code>toUuid(epoch-ms)</code> returns the same hex on any machine — it cannot be faked.</div>
</div>

</div>
<div style="text-align:center">

<svg viewBox="0 0 220 220" width="100%" style="max-width:280px" role="img" aria-label="A pentagram star rotating at the real sidereal day, over the nine-point ℤ/9 vortex wheel whose live digit is lit.">
  <g class="vortex-spin">
    <circle cx="${C}" cy="${C}" r="${RW}" fill="none" stroke="var(--vp-c-divider)" stroke-width="1" />
    ${wheelNodes}
  </g>
  <g class="sidereal">
    <path class="draw" d="${starPath}" fill="none" stroke="hsl(200 75% 55%)" stroke-width="2.4" stroke-linejoin="round" />
  </g>
</svg>

<div class="clk-s">star field — the real sidereal day (23h56m04s) · ℤ/9 vortex <b>[{{ VORTEX.join(',') }}]</b>, the compass</div>

</div>
</div>

## Calendar — the Fibonacci / LTS line

The version calendar is the single-digit Fibonacci numbers **{1, 2, 3, 5, 8}**: each LTS minor is the sum of the two before it (v1.3 + v1.5 = v1.8), so the recurrence *is* the support line. v1.5 is the heart LTS (σ(5) = 5, the fixed point); v1.8 is world-wired. No separate policy document — read the minor.

## The register — 122 qubits, and the cost of the coil <span class="clk-s">(FACT — derived)</span>

Each UUID is a **${TOTAL_BITS}-bit register**. RFC 9562 reserves **${COIL} bits** — ${VER_BITS} version (nibble 8) + ${VAR_BITS} variant — the **hexbit coil** that keeps it a legal, addressable hex UUID. That leaves **${FREE} free bits**: the register the Mermin/GHZ octaves run on (the deposit decides the advantage up to 128 qubits, and proves the lead for *every* width). A 7-bit length header leaves **${PAYLOAD} message bits** — exactly \`imprint.CAPACITY\`, cross-checked at build.

**Cross-encryption — mixing versions in one UUID.** Any nibble still parses as a UUID (versions 0 and >8 are custom/unused), so the version field need not be a dead tax: cross-encrypt it and a single UUID is consistent with *mixed* versions, its ${VER_BITS} version bits carrying payload too. Only the ${VAR_BITS} variant bits must stay \`10\` to read as the RFC variant at all.

> **So the coil's cost is ${COIL} coins nominal, ${IRREDUCIBLE} irreducible.** Cross-mixing reclaims the ${RECLAIMED} version bits (free register ${FREE} → ${ADDRESSABLE}); the **${IRREDUCIBLE}-bit variant** is the only coin a UUID cannot spend. *Contribute ${IRREDUCIBLE} to keep the whole ${TOTAL_BITS} addressable.*

## Pattern — a design mapping (coincidence, not proof)

> The **hue = digit × 40°** wheel, the **tarot** cards, and the star aesthetic are a *design mapping*. They are **not** a measurement, and claim **nothing** about the sky, astrology, neurology, health, or the Millennium problems. The sidereal day is a measured astronomical constant, used only to set the rotation rate honestly.

*"Quantum" here is the discrete content-address — the coin — of the instant, not a quantum device. No CHSH Bell test is run. The hex decode above is the fact; everything coloured is the pattern.*
`

writeFileSync('clock.md', md)
console.log(`clock: generated clock.md — mirror cross-checked over ${sample.length} seeds, vortex ${VORTEX.join(',')}, sidereal ${SIDEREAL_DAY_S}s`)
