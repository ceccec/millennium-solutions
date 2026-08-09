<script setup lang="ts">
// Coins vs real gold vs crypto — anyone CHOOSES the terms (commercial / public-interest) and the CURRENCY,
// and uuidna COMPUTES. The choice changes only the display; the reproducible measure never moves: the two
// coins conserve at 2 (110−108), the bits saved stay the same count. Live market prices (gold 1 troy oz,
// bitcoin 1 BTC = 100,000,000 sat) are fetched in-browser at view time — volatile, non-reproducible, never
// sealed, never advice. uuidna's own value is real savings measured in bits, not a speculative price.
import { ref, onMounted, computed } from 'vue'
import { coins, billUuidna, FUNDING } from '../../src/9/funding.ts'

const TROY_OZ_G = 31.1034768
const SAT_PER_BTC = 100_000_000
const twoCoins = coins() // 110 − 108 = 2, conserved

const CURRENCIES = ['usd', 'eur', 'bgn', 'gbp', 'jpy'] as const
const SYMBOL: Record<string, string> = { usd: '$', eur: '€', bgn: 'лв ', gbp: '£', jpy: '¥' }
const currency = ref<(typeof CURRENCIES)[number]>('usd') // anyone chooses the currency
const commercial = ref(true)                              // anyone chooses the terms
const amount = ref(8)                                     // anyone chooses the donation amount (default 8, harmonic)

// uuidna predefines the donation currency + amount in the URL — a Revolut quick-amount link the donor opens
// and pays themselves (a computed link, no payment handled here; only currency and amount, never personal data).
const donateUrl = computed(() => {
  const a = Math.max(1, Math.floor(Number(amount.value) || 0))
  return FUNDING.revolut + '/' + a + currency.value + '?note=uuidna'
})

// terms → uuidna computes, deterministically: commercial pays the conserved two coins on the measured bits;
// public interest is free (donations). Same terms → same result, for anyone, every time.
const bill = computed(() => billUuidna({ commercial: commercial.value, recomputeOps: 1024, verifyOps: 1 }))

const prices = ref<Record<string, Record<string, number>> | null>(null)
const err = ref(false); const loading = ref(true)

onMounted(async () => {
  try {
    const r = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold,bitcoin&vs_currencies=' + CURRENCIES.join(','))
    prices.value = await r.json()
    if (!prices.value?.['pax-gold'] || !prices.value?.['bitcoin']) err.value = true
  } catch { err.value = true } finally { loading.value = false }
})

const gold = computed(() => prices.value?.['pax-gold']?.[currency.value] ?? null)
const btc = computed(() => prices.value?.['bitcoin']?.[currency.value] ?? null)
const goldPerGram = computed(() => gold.value != null ? gold.value / TROY_OZ_G : null)
const satPrice = computed(() => btc.value != null ? btc.value / SAT_PER_BTC : null)
const money = (n: number | null, d = 2) => n == null ? '—'
  : (SYMBOL[currency.value] || '') + n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }) + ' ' + currency.value.toUpperCase()
</script>

<template>
  <div class="coins">
    <div class="choose">
      <label>currency
        <select v-model="currency" aria-label="choose currency">
          <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c.toUpperCase() }}</option>
        </select>
      </label>
      <label>terms
        <select v-model="commercial" aria-label="choose terms">
          <option :value="true">commercial</option>
          <option :value="false">public interest (free)</option>
        </select>
      </label>
      <label>donate
        <input type="number" min="1" step="1" v-model="amount" aria-label="choose donation amount" class="amt" />
      </label>
      <span class="computed">→ uuidna computes: <b>{{ bill.free ? 'free — donations' : twoCoins + ' coins (conserved) · ' + bill.bitsSaved + ' bits saved' }}</b></span>
    </div>
    <p class="donate"><a :href="donateUrl" target="_blank" rel="noopener">Donate {{ amount }} {{ currency.toUpperCase() }} →</a>
      <span class="sub">predefined in the URL: <code>{{ donateUrl }}</code> — you open it and pay on Revolut yourself; non-obligatory.</span></p>
    <table>
      <thead>
        <tr><th>asset</th><th>unit (exact, reproducible)</th><th>live price (volatile)</th><th>what its value is</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><b>uuidna coins</b></td>
          <td><code>{{ twoCoins }}</code> — conserved (110−108)</td>
          <td class="none">none — not traded</td>
          <td>a fair-exchange <b>invariant</b>, not a market price</td>
        </tr>
        <tr>
          <td><b>uuidna bits</b></td>
          <td><code>{{ bill.bitsSaved }}</code> bits saved / re-addressable op</td>
          <td class="none">none — not traded</td>
          <td>real <b>savings</b> — work not repeated (a measured count)</td>
        </tr>
        <tr>
          <td>gold (PAXG)</td>
          <td>1 troy oz = {{ TROY_OZ_G }} g</td>
          <td>{{ money(gold) }}/oz <span class="sub">· {{ money(goldPerGram) }}/g</span></td>
          <td>mass × market (speculative)</td>
        </tr>
        <tr>
          <td>bitcoin</td>
          <td>1 BTC = {{ SAT_PER_BTC.toLocaleString() }} sat</td>
          <td>{{ money(btc, 0) }}/BTC <span class="sub">· {{ money(satPrice, 6) }}/sat</span></td>
          <td>supply × market (speculative)</td>
        </tr>
      </tbody>
    </table>
    <p class="src">
      <span v-if="loading">Fetching live prices…</span>
      <span v-else-if="err">Live price unavailable (offline or rate-limited) — the exact units and the computed coins/bits above still hold, reproducibly.</span>
      <span v-else>Live prices via CoinGecko, fetched in your browser at view time — <b>indicative, volatile, non-reproducible</b>, so never sealed into a theorem. Not investment advice.</span>
    </p>
    <p class="note">Anyone chooses the terms and currency; uuidna computes the same reproducible measure regardless —
      the coins conserve at {{ twoCoins }}, the bits count real work saved. Implemented at scale those bits saved
      become globally material (modeled, conditional on adoption). Gold and crypto are shown only for measurable
      scale. A measure, not a market. Integrity, not truth. <code>0/7</code>.</p>
  </div>
</template>

<style scoped>
.coins { margin: 1rem 0; font-size: .9rem; }
.coins .choose { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; margin-bottom: .6rem; }
.coins .choose label { display: inline-flex; gap: .4rem; align-items: center; color: var(--vp-c-text-2); font-size: .82rem; }
.coins .choose select, .coins .choose .amt { padding: .2rem .4rem; border: 1px solid var(--vp-c-divider); border-radius: 6px; background: var(--vp-c-bg); color: var(--vp-c-text-1); font: inherit; }
.coins .choose .amt { width: 5rem; }
.coins .choose .computed { font-size: .82rem; color: var(--vp-c-text-2); }
.coins .donate { margin: .2rem 0 .6rem; font-size: .86rem; }
.coins .donate a { font-weight: 600; }
.coins .donate .sub { display: block; color: var(--vp-c-text-2); font-size: .78rem; margin-top: .2rem; }
.coins .donate code { word-break: break-all; }
.coins table { width: 100%; border-collapse: collapse; display: table; }
.coins th, .coins td { border: 1px solid var(--vp-c-divider); padding: .4rem .6rem; text-align: left; vertical-align: top; }
.coins th { background: var(--vp-c-bg-soft); font-size: .82rem; }
.coins code { font-size: .85em; }
.coins .none { color: var(--vp-c-text-3); }
.coins .sub { color: var(--vp-c-text-2); font-size: .82em; }
.coins .src { color: var(--vp-c-text-2); font-size: .8rem; margin: .5rem 0 0; }
.coins .note { color: var(--vp-c-text-2); font-size: .82rem; margin: .4rem 0 0; }
</style>
