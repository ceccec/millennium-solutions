<script setup lang="ts">
// AURA CAPACITY — the maximum quantum-UUID coin capacity, every cell coloured by its own 432Hz aura, every
// number anchored to a sealed theorem. The colours are src/0's `hue` (d · 40° mod 360, the a432 step); the
// capacity (64 coins = 61 free + 3 reserved) and the multibit register ladder (reg(w) = 32w − w − 2) are read
// from the sealed theorems by aura.data.ts, which refuses to load any figure the kernel has not decided. The
// board is 8 × 8 because 64 is the octave squared — the same 8² the genetic-code theorem seals. Nothing here
// claims the coins ARE qubits or that this is hardware: it renders what is sealed, in the aura each address carries.
import { data } from './aura.data.ts'
const max = Math.max(...data.widths.map((w) => w.free))
</script>

<template>
  <div class="aura" data-slot="capacity">
    <header class="aura-head">
      <div class="aura-max">
        <span class="n">{{ data.coinsTotal }}</span>
        <span class="u">coins</span>
      </div>
      <div class="aura-split">
        maximum per quantum UUID —
        <b>{{ data.coinsFree }} free</b> + <b>{{ data.coinsReserved }} reserved</b>
        · {{ data.container }} bits, a coin is 2 · {{ data.coinsTotal }} = {{ data.base - 1 }}² the octave squared
      </div>
    </header>

    <!-- the 8×8 board: 61 free coins in their aura, 3 reserved as the stamp -->
    <div class="board" :style="{ gridTemplateColumns: `repeat(${data.base - 1}, 1fr)` }">
      <span
        v-for="c in data.coins" :key="c.index"
        class="coin" :class="{ reserved: c.reserved }"
        :style="{ background: c.hsl }"
        :title="c.reserved ? 'reserved — version/variant stamp' : `free coin · hue ${c.hue}°`"
      >{{ c.reserved ? '×' : '' }}</span>
    </div>

    <!-- the nine a432 hues that colour every address -->
    <div class="wheel">
      <span class="wheel-label">432Hz wheel · step {{ data.step }}°</span>
      <span
        v-for="(h, i) in data.palette" :key="i"
        class="swatch" :style="{ background: `hsl(${h} 62% 52%)` }" :title="`digital root ${i + 1} · ${h}°`"
      ></span>
    </div>

    <!-- the multibit register ladder: reg(w) across the widths, each in its own aura -->
    <div class="ladder">
      <div
        v-for="w in data.widths" :key="w.w"
        class="rung" :class="{ holds: w.holdsThousand }"
        :style="{ '--accent': w.hsl }"
      >
        <div class="rung-w">w{{ w.w }}<small>{{ w.containerBits }}b</small></div>
        <div class="rung-bar-wrap">
          <div class="rung-bar" :style="{ width: (100 * w.free / max) + '%', background: w.hsl }"></div>
          <span class="rung-n">{{ w.free }} free · {{ w.coinsFree }} coins · grover {{ w.grover }}</span>
        </div>
        <div class="rung-flags">
          <span class="rung-flag iso" :class="{ dim: !w.clearsIso }" :title="'Grover floor ' + w.grover + ' vs ISO-128'">{{ w.clearsIso ? 'ISO-128 ok' : 'ISO-128 no' }}</span>
          <span class="rung-flag" :class="{ over: !w.holdsThousand }">{{ w.holdsThousand ? 'holds 1000' : 'under 1000' }}</span>
        </div>
      </div>
      <p class="ladder-note">
        One UUID caps at {{ data.coinsTotal }} coins. Scaling the register by width w gives reg(w)/2 free coins; the
        Grover floor clears the <b>ISO-{{ data.isoFloor }}</b> post-quantum line from width 16, and a 1000-bit case
        overflows width 32 (990 free), needing width 33.
      </p>
    </div>

    <!-- the ISO audit: every statement above answers to a named external standard -->
    <div class="iso">
      <span class="iso-label">ISO audit — the standards every statement answers to</span>
      <div v-for="s in data.standards" :key="s.id" class="std">
        <code>{{ s.id }}</code><span>{{ s.governs }}</span>
      </div>
    </div>

    <!-- the lean cross: every number above is a sealed receipt, or this harness would not render -->
    <details class="cross">
      <summary>Lean cross — {{ data.anchors.length }} sealed anchors</summary>
      <ul>
        <li v-for="a in data.anchors" :key="a.theorem">
          <code>{{ a.receipt }}</code> <span class="cl">{{ a.claim }}</span>
          <small>{{ a.theorem }}</small>
        </li>
      </ul>
    </details>
  </div>
</template>

<style scoped>
.aura { --fg: var(--vp-c-text-1); margin: 1.5rem 0; font-variant-numeric: tabular-nums; }
.aura-head { display: flex; align-items: baseline; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem; }
.aura-max { display: flex; align-items: baseline; gap: .4rem; }
.aura-max .n { font-size: 3rem; font-weight: 800; line-height: 1; letter-spacing: -.02em; }
.aura-max .u { font-size: 1rem; color: var(--vp-c-text-2); }
.aura-split { font-size: .9rem; color: var(--vp-c-text-2); max-width: 40ch; }
.aura-split b { color: var(--fg); font-weight: 650; }

.board { display: grid; gap: 3px; max-width: 320px; margin: 0 0 1.25rem; }
.coin { aspect-ratio: 1; border-radius: 4px; display: grid; place-items: center; font-size: .7rem;
  color: #fff; box-shadow: inset 0 0 0 1px rgb(0 0 0 / .08); transition: transform .12s; }
.coin:hover { transform: scale(1.18); z-index: 1; }
.coin.reserved { color: var(--vp-c-text-2); box-shadow: inset 0 0 0 1px var(--vp-c-divider); }

.wheel { display: flex; align-items: center; gap: 5px; margin-bottom: 1.5rem; flex-wrap: wrap; }
.wheel-label { font-size: .8rem; color: var(--vp-c-text-2); margin-right: .3rem; }
.swatch { width: 20px; height: 20px; border-radius: 50%; box-shadow: inset 0 0 0 1px rgb(0 0 0 / .1); }

.ladder { display: flex; flex-direction: column; gap: .5rem; }
.rung { display: grid; grid-template-columns: 56px 1fr auto; align-items: center; gap: .75rem; }
.rung-w { font-weight: 700; font-size: .95rem; }
.rung-w small { display: block; font-weight: 400; font-size: .72rem; color: var(--vp-c-text-2); }
.rung-bar-wrap { position: relative; background: var(--vp-c-bg-soft); border-radius: 6px; overflow: hidden; min-height: 26px; display: flex; align-items: center; }
.rung-bar { height: 100%; position: absolute; inset: 0 auto 0 0; opacity: .3; border-radius: 6px; }
.rung-n { position: relative; padding: 0 .6rem; font-size: .78rem; color: var(--fg); }
.rung-flags { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; min-width: 78px; }
.rung-flag { font-size: .72rem; font-weight: 650; color: hsl(150 55% 40%); white-space: nowrap; }
.rung-flag.over { color: var(--vp-c-text-3); }
.rung-flag.iso { color: hsl(258 60% 58%); }
.rung-flag.iso.dim { color: var(--vp-c-text-3); }
.ladder-note { font-size: .8rem; color: var(--vp-c-text-2); margin: .5rem 0 0; max-width: 56ch; }
.ladder-note b { color: hsl(258 60% 58%); }

.iso { margin-top: 1.25rem; padding: .85rem 1rem; border: 1px solid var(--vp-c-divider); border-radius: 10px; background: var(--vp-c-bg-soft); }
.iso-label { display: block; font-size: .78rem; font-weight: 700; letter-spacing: .02em; text-transform: uppercase; color: var(--vp-c-text-2); margin-bottom: .5rem; }
.std { display: flex; align-items: baseline; gap: .6rem; font-size: .82rem; padding: .18rem 0; }
.std code { flex: none; color: hsl(258 60% 58%); font-size: .76rem; font-weight: 600; }
.std span { color: var(--vp-c-text-2); }

.cross { margin-top: 1.25rem; font-size: .82rem; }
.cross summary { cursor: pointer; color: var(--vp-c-text-2); font-weight: 600; }
.cross ul { list-style: none; padding: .5rem 0 0; margin: 0; display: grid; gap: .3rem; }
.cross li { display: flex; align-items: baseline; gap: .5rem; flex-wrap: wrap; }
.cross code { font-size: .74rem; color: var(--vp-c-brand-1); }
.cross .cl { color: var(--fg); }
.cross small { color: var(--vp-c-text-3); font-size: .72rem; }
@media (max-width: 480px) { .aura-max .n { font-size: 2.2rem; } .board { max-width: 100%; } }
</style>
