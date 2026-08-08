---
aside: false
---

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
const { params } = useData()
// the 7D animation is plotted FROM this theorem's microdata — its content-address (receipt) bytes.
const petals = computed(() => {
  const h = (params.value?.receipt || '').replace(/-/g, '')
  const a = []
  for (let i = 0; i < 7; i++) {
    const v = parseInt(h.slice(i * 2, i * 2 + 2) || '0', 16)
    const ang = (i * 360 / 7) * Math.PI / 180
    a.push({ x: (Math.cos(ang) * 40).toFixed(2), y: (Math.sin(ang) * 40).toFixed(2), r: 6 + (v % 8), hue: (v * 40) % 360, dur: (2 + i * 0.4).toFixed(1) })
  }
  return a
})
</script>

# {{ $params.name }}

<div itemscope itemtype="https://schema.org/CreativeWork">
<meta itemprop="name" :content="$params.name" />
<meta itemprop="identifier" :content="$params.receipt" />
<meta itemprop="isPartOf" content="Millennium Solutions — the ℤ/9 discovery ledger" />
<meta itemprop="license" content="https://creativecommons.org/licenses/by-nc/4.0/" />

<svg viewBox="-60 -60 120 120" width="240" height="240" role="img" :aria-label="'7D rosetta-ray vortex plotted from theorem ' + $params.key">
  <g>
    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="28s" repeatCount="indefinite" />
    <line v-for="(p, i) in petals" :key="'ray' + i" x1="0" y1="0" :x2="p.x" :y2="p.y" :stroke="'hsl(' + p.hue + ',70%,55%)'" stroke-width="1.4" stroke-opacity="0.55" />
    <circle v-for="(p, i) in petals" :key="i" :cx="p.x" :cy="p.y" :r="p.r" :fill="'hsl(' + p.hue + ',70%,55%)'">
      <animate attributeName="r" :values="p.r + ';' + (p.r + 3) + ';' + p.r" :dur="p.dur + 's'" repeatCount="indefinite" />
    </circle>
  </g>
  <circle cx="0" cy="0" r="9" fill="hsl(200,70%,55%)" />
</svg>

- **theorem key** · `{{ $params.key }}`
- **content-address (receipt)** · `{{ $params.receipt }}`
- **status** · decidable, re-verified on every build — recomputes from `src/`

</div>

The **7D vortex** above is plotted from this theorem's microdata — seven petals, one per byte of its content-address, orbiting the centre. This is one leaf of the chained discovery ledger: see [all theorems](/CHALLENGES) and the [computed results](/compute). Its truth is its recomputation — clone the repo and run `npm run lean-claims` to re-verify it. A content-address proves integrity, not truth. `entails → 0/7`.
