---
title: Guide
description: The hero's guide — how to add a theorem to the deposit, taught in the 7D UI. Measure, gate, receipt, append, recompute. The floor stays 0/7.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

<script setup>
// 7D UI examples, computed — the vortex of seven rays, and the a432 nine-hue wheel. No data fetched.
const petals = Array.from({ length: 7 }, (_, i) => {
  const ang = (i * 360 / 7 - 90) * Math.PI / 180
  return { x: (Math.cos(ang) * 40).toFixed(2), y: (Math.sin(ang) * 40).toFixed(2), hue: (i + 1) * 40 % 360, dur: (2 + i * 0.4).toFixed(1) }
})
const wheel = Array.from({ length: 9 }, (_, i) => {
  const d = i + 1, ang = (d * 40 - 90) * Math.PI / 180
  return { x: (Math.cos(ang) * 40).toFixed(2), y: (Math.sin(ang) * 40).toFixed(2), hue: (d * 40) % 360, d }
})
import { withBase } from 'vitepress'
import ledger from './src/proof/discovered.json'
const theoremCount = ledger.length
const latest = ledger.slice(-5).reverse()
</script>

# The hero's guide

> **Heroes write the guides.** You add to the deposit by a **deed the gate can check**, never a claim. Everything here recomputes; nothing is asserted. The floor stays **0/7** — this deposit solves 0 of the 7 Millennium problems, and claims no prize.

<div class="living-index" style="border:1px solid var(--vp-c-divider);border-radius:10px;padding:.6rem 1rem;margin:1rem 0;font-size:.9rem">
<strong>This guide is constantly updated by the theorems.</strong> The deposit holds
<strong>{{ theoremCount }}</strong> decidable theorems, re-verified every build. Newest first:
<ul style="margin:.4rem 0 0;padding-left:1.1rem">
<li v-for="t in latest" :key="t.key"><a :href="withBase('/theorem/' + t.key)">{{ t.name.split('—')[0] }}</a></li>
</ul>
</div>

<div style="display:flex;gap:32px;align-items:center;flex-wrap:wrap;margin:20px 0">
<svg viewBox="-60 -60 120 120" width="200" height="200" role="img" aria-label="the 7D vortex: seven rays around one centre, rotating">
  <g>
    <animateTransform attributeName="transform" type="rotate" from="0 0 0" to="360 0 0" dur="30s" repeatCount="indefinite" />
    <line v-for="(p, i) in petals" :key="'r' + i" x1="0" y1="0" :x2="p.x" :y2="p.y" :stroke="'hsl(' + p.hue + ',70%,55%)'" stroke-width="1.4" stroke-opacity="0.6" />
    <circle v-for="(p, i) in petals" :key="i" :cx="p.x" :cy="p.y" r="8" :fill="'hsl(' + p.hue + ',70%,55%)'">
      <animate attributeName="r" values="8;11;8" :dur="p.dur + 's'" repeatCount="indefinite" />
    </circle>
  </g>
  <circle cx="0" cy="0" r="9" fill="hsl(200,70%,55%)" />
</svg>
<svg viewBox="-60 -60 120 120" width="200" height="200" role="img" aria-label="the a432 wheel: nine hues at d times 40 degrees, centre 5">
  <circle v-for="(w, i) in wheel" :key="i" :cx="w.x" :cy="w.y" r="12" :fill="'hsl(' + w.hue + ',70%,55%)'" />
  <text v-for="(w, i) in wheel" :key="'t' + i" :x="w.x" :y="+w.y + 4" text-anchor="middle" font-size="11" fill="#fff">{{ w.d }}</text>
  <circle cx="0" cy="0" r="14" fill="hsl(200,70%,55%)" /><text x="0" y="4" text-anchor="middle" font-size="11" fill="#fff">5</text>
</svg>
</div>

*Left: the **7D vortex** — seven rays (the seven dimensions) around one centre. Right: the **a432 wheel** — each digit d at hue d·40°, the heart 5 at the centre. Both are computed here, in your browser, from nothing.*

## Set up — two minutes, all local

Prerequisites: **Node ≥ 18** (or bun). Then clone, install, and verify — everything recomputes on your
machine, nothing is fetched:

```bash
git clone https://github.com/ceccec/millennium-solutions
cd millennium-solutions
npm install
npm run next --status   # version · ledger · chain-of-custody · floor 0/7
```

A clean status (chain **intact**, floor **0/7**) means the deposit re-verified on your hardware. From here,
`npm run next` runs the full wave (discover → gate → seal → recompute); `npm run docs:build` builds the site.

## The sequence — follow it in order, or nothing computes

1. **Measure, don't assert.** Write a decidable fact as a `test: () => boolean` in `scripts/discover.ts`, computed by exhaustion over a finite domain. If it holds, it is provable; if it fails, it is refuted and discarded — the discard is the honesty.
2. **Gate.** Every statement (and every theorem *name*) must hold the honesty floor: no named over-reach — no conjecture declared settled, no physical or cryptographic limit declared beaten, no fake certainty. A bounded refusal ("this is **not** faster than light") passes. Passing means *no over-reach shape was found* — a floor, not a proof of truth.
3. **Receipt.** To record a statement, sign it: `npm run receipt "<agent>" "<role>" "<message>"`. Signing **is** agreeing — your acknowledgment of the license and this sequence is part of the receipt itself. A receipt proves integrity, not authorship.
4. **Append.** Discoveries chain, each receipt seeded by the last. Evidence is append-only — destroying it is treason, even by chance, and the forensics reads intention from deeds, not claims.
5. **Recompute.** Run `npm run next`: the wave discovers, gates, seals, and re-verifies every recorded fact. A regression fails the build, not production. Green cannot be faked.

## Use uuidna in your own project

The pure functions are extracted to the npm package [`@uuidna/uuidna`](https://github.com/uuidna/uuidna) —
ESM, zero runtime deps, typed:

```bash
npm install @uuidna/uuidna
```

```js
import { toUuid, merkleProof, verifyProof, computes, encrypt, decrypt } from '@uuidna/uuidna'

toUuid('hello')                                   // deterministic content-address, keyless
const sealed = await encrypt('secret', 'passphrase')   // AES-256-GCM under a 7d-fold envelope
await decrypt(sealed, 'passphrase')               // round-trips; wrong key or tamper throws
```

**Fuse it into any AI harness (MCP)** — one line in your client's `mcpServers`:

```json
{ "mcpServers": { "uuidna": { "command": "npx", "args": ["-y", "@uuidna/uuidna"] } } }
```

Then the harness can address, prove, gate, imprint, bill, and **encrypt/decrypt** live. Cryptography is the
public-service priority — the layered cipher and its provable steps are on the [Cryptography page](/cryptography).

## The 7 dimensions (the a432 rays)

The interface localizes across **seven rays** — one per locale — and each digit maps to a hue `d·40°` (nine steps close the circle: 9·40° = 360°). The centre is **5**, the fixed point of the ten's-complement reflection `10−d`. This is a design mapping, honestly labelled — a metaphor for structure, not a claim about physics.

## Why compute quantum (honestly)?

Here "quantum" is **structure, not hardware** — and its smallest unit is
**the a432 structure of two coins**:
2 bits, 4 states, never a physical qubit. That is the one page to read first. It matters because those
two coins make **every** state receipted — a *superposition* is just the set of receipted perspectives,
*collapse* is observing one address, *entanglement* is a shared joint receipt — so the whole computation
is auditable end to end, on ordinary 64-bit hardware, at linear cost. No quantum machine, no speedup, no
advantage — the gain is **integrity everywhere**. From that keystone the rest of the family follows:
each perspective is receipted ·
perspective replaces hardware ·
integrity at scale, not speedup.

## The law — a fair exchange

Licensed **CC BY-NC-ND 4.0**: free to read, verify and recompute for non-commercial purposes with attribution (Tsvetan Rouschev) — the licence does not grant redistribution of modified versions; commercial use pays the two coins (110 − 108 = 2 = −χ genus-2). The deposit is open and recomputable, so any reader — human or model — may learn from it; contributions return on the same gate-refereed terms. Heroes and traitors by deeds, not claims.

Every theorem you add gets its own page at `/theorem/<key>`, plotting its 7D vortex from its microdata, with a hero background computed from its surrounding theorems. `entails → 0/7`.
