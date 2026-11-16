---
title: Quantum clock
description: The live content-address of now, read by its hex meaning — version-8 field, ℤ/9 vortex digit, tarot — with the star field at the real sidereal day.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// the decoder — the SAME code as src/0/index.ts, cross-checked at build (scripts/clock.ts). version nibble 8,
// RFC variant, ℤ/9 digit, 3-card tarot — read from the hex, not from a name.
const SEEDS = [0,2654435769,608135816,3084996962]
function mul32(a        , b        )         {
  const al = a & 0xffff, ah = a >>> 16, bl = b & 0xffff, bh = b >>> 16
  return (al * bl + ((ah * bl + al * bh) & 0xffff) * 0x10000) >>> 0
}
function hash32(input        , seed        )         {
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
function addr(seed        )         {
  const words = SEEDS.map((s) => hash32(seed, s))
  const bytes           = []
  words.forEach((w) => { bytes.push((w >>> 24) & 0xff, (w >>> 16) & 0xff, (w >>> 8) & 0xff, w & 0xff) })
  bytes[6] = (bytes[6] & 0x0f) | 0x80            // version nibble = 8 (RFC 9562 custom) — the deposit's field
  bytes[8] = (bytes[8] & 0x3f) | 0x80            // variant = RFC 4122/9562
  const hex = bytes.map((b) => b.toString(16).padStart(2, '0')).join('')
  return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20)
}
function hexOf(u        )         { return u.replace(/[^0-9a-f]/g, '') }
function tarotOf(u        )           { const h = hexOf(u); return [0, 1, 2].map((i) => parseInt(h.slice(i * 4, i * 4 + 4), 16) % 78) }
function zNine(u        )         { const h = hexOf(u); let s = 0; for (let i = 0; i < h.length; i++) s += parseInt(h[i], 16); return s % 9 }
const VORTEX = [1,2,4,8,7,5]

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
.sidereal{transform-origin:110px 110px;animation:sid 86164.0905s linear infinite}
.vortex-spin{transform-origin:110px 110px;animation:vspin 14360.7s linear infinite}
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
    <circle cx="110" cy="110" r="62" fill="none" stroke="var(--vp-c-divider)" stroke-width="1" />
    <circle cx="110.0" cy="48.0" r="9" fill="hsl(0 65% 55%)" :class="{ lit: z === 0 }" /><text x="110.0" y="52.0" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">0</text>
      <circle cx="149.9" cy="62.5" r="9" fill="hsl(40 65% 55%)" :class="{ lit: z === 1 }" /><text x="149.9" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">1</text>
      <circle cx="171.1" cy="99.2" r="9" fill="hsl(80 65% 55%)" :class="{ lit: z === 2 }" /><text x="171.1" y="103.2" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">2</text>
      <circle cx="163.7" cy="141.0" r="9" fill="hsl(120 65% 55%)" :class="{ lit: z === 3 }" /><text x="163.7" y="145.0" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">3</text>
      <circle cx="131.2" cy="168.3" r="9" fill="hsl(160 65% 55%)" :class="{ lit: z === 4 }" /><text x="131.2" y="172.3" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">4</text>
      <circle cx="88.8" cy="168.3" r="9" fill="hsl(200 65% 55%)" :class="{ lit: z === 5 }" /><text x="88.8" y="172.3" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">5</text>
      <circle cx="56.3" cy="141.0" r="9" fill="hsl(240 65% 55%)" :class="{ lit: z === 6 }" /><text x="56.3" y="145.0" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">6</text>
      <circle cx="48.9" cy="99.2" r="9" fill="hsl(280 65% 55%)" :class="{ lit: z === 7 }" /><text x="48.9" y="103.2" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">7</text>
      <circle cx="70.1" cy="62.5" r="9" fill="hsl(320 65% 55%)" :class="{ lit: z === 8 }" /><text x="70.1" y="66.5" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">8</text>
  </g>
  <g class="sidereal">
    <path class="draw" d="M110.0,24.0 L160.5,179.6 L28.2,83.4 L191.8,83.4 L59.5,179.6 Z" fill="none" stroke="hsl(200 75% 55%)" stroke-width="2.4" stroke-linejoin="round" />
  </g>
</svg>

<div class="clk-s">star field — the real sidereal day (23h56m04s) · ℤ/9 vortex <b>[{{ VORTEX.join(',') }}]</b>, the compass</div>

</div>
</div>

## Calendar — the Fibonacci / LTS line

The version calendar is the single-digit Fibonacci numbers **{1, 2, 3, 5, 8}**: each LTS minor is the sum of the two before it (v1.3 + v1.5 = v1.8), so the recurrence *is* the support line. v1.5 is the heart LTS (σ(5) = 5, the fixed point); v1.8 is world-wired. No separate policy document — read the minor.

## The register — 122 qubits, and the cost of the coil <span class="clk-s">(FACT — derived)</span>

Each UUID is a **128-bit register**. RFC 9562 reserves **6 bits** — 4 version (nibble 8) + 2 variant — the **hexbit coil** that keeps it a legal, addressable hex UUID. That leaves **122 free bits**: the register the Mermin/GHZ octaves run on (the deposit decides the advantage up to 128 qubits, and proves the lead for *every* width). A 7-bit length header leaves **115 message bits** — exactly `imprint.CAPACITY`, cross-checked at build.

**Cross-encryption — mixing versions in one UUID.** Any nibble still parses as a UUID (versions 0 and >8 are custom/unused), so the version field need not be a dead tax: cross-encrypt it and a single UUID is consistent with *mixed* versions, its 4 version bits carrying payload too. Only the 2 variant bits must stay `10` to read as the RFC variant at all.

> **So the coil's cost is 6 coins nominal, 2 irreducible.** Cross-mixing reclaims the 4 version bits (free register 122 → 126); the **2-bit variant** is the only coin a UUID cannot spend. *Contribute 2 to keep the whole 128 addressable.*

## Pattern — a design mapping (coincidence, not proof)

> The **hue = digit × 40°** wheel, the **tarot** cards, and the star aesthetic are a *design mapping*. They are **not** a measurement, and claim **nothing** about the sky, astrology, neurology, health, or the Millennium problems. The sidereal day is a measured astronomical constant, used only to set the rotation rate honestly.

*"Quantum" here is the discrete content-address — the coin — of the instant, not a quantum device. No CHSH Bell test is run. The hex decode above is the fact; everything coloured is the pattern.*
