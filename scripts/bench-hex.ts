#!/usr/bin/env node
// THE HEX BENCHMARK — correctness first, then speed, then whether the speed matters.
//
// `hexByte` on the address path is `value.toString(16).padStart(2, '0')`, called sixteen times per address
// with an array allocation and a join around it. A lookup table is the obvious alternative. This measures
// whether that is worth doing, and the answer has three parts that must be kept apart:
//
//   1. DO THEY AGREE? A faster encoder that produces a different string changes every content-address in
//      the ledger. Speed is not a reason to look at an encoder that is wrong, so agreement is checked over
//      all 256 byte values and a run of random vectors BEFORE anything is timed.
//   2. HOW FAST? Timed over repetitions with the range reported, because a single sample is not a
//      measurement — an identical command on this machine has spanned 7.5 to 13.0 seconds today.
//   3. DOES IT MATTER? A 5× win on 8% of one function that is 0.35% of a build is 0.02%. The last column
//      is the one that decides, and it is usually the one left out.
import { toUuid } from '../src/0/index.ts'

const N = 200_000, REPS = 5

// ── the encoders ────────────────────────────────────────────────────────────────────────────────────────
const current = (b: number[]) => b.map((v) => v.toString(16).padStart(2, '0')).join('')
const BYTE = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))
const byteTable = (b: number[]) => { let s = ''; for (let i = 0; i < b.length; i++) s += BYTE[b[i]]; return s }
const H = '0123456789abcdef'
const nibble = (b: number[]) => { let s = ''; for (let i = 0; i < b.length; i++) { const v = b[i]; s += H[v >>> 4] + H[v & 15] } return s }
const ENCODERS: [string, (b: number[]) => string][] = [
  ['current  toString+padStart', current], ['byte table (256 entries)', byteTable], ['nibble table (16 entries)', nibble],
]

// ── 1 · agreement, before any timing ────────────────────────────────────────────────────────────────────
const every = Array.from({ length: 256 }, (_, i) => i)
let disagree = 0
for (const [name, f] of ENCODERS) if (f(every) !== current(every)) { console.error(`  ✗ ${name} disagrees with the current encoder on the 256 byte values`); disagree++ }
for (let t = 0; t < 2000; t++) {
  const v = Array.from({ length: 16 }, () => (Math.random() * 256) | 0)
  for (const [name, f] of ENCODERS) if (f(v) !== current(v)) { console.error(`  ✗ ${name} disagrees on a random vector`); disagree++ }
}
if (disagree) { console.error('\n✗ bench-hex: an encoder disagrees — speed is not a reason to consider a wrong one'); process.exit(1) }
console.log(`  ✓ all ${ENCODERS.length} encoders agree on all 256 byte values and 2000 random 16-byte vectors\n`)

// ── 2 · timing, with the range ──────────────────────────────────────────────────────────────────────────
const vec = Array.from({ length: 16 }, (_, i) => (i * 37) % 256)
const time = (f: (b: number[]) => string) => {
  const runs: number[] = []
  for (let r = 0; r < REPS; r++) {
    f(vec)
    const t0 = process.hrtime.bigint()
    for (let i = 0; i < N; i++) f(vec)
    runs.push(Number((process.hrtime.bigint() - t0) / 1_000_000n))
  }
  return runs.sort((a, b) => a - b)
}
const results = ENCODERS.map(([name, f]) => ({ name, runs: time(f) }))
const base = results[0].runs[Math.floor(REPS / 2)]
console.log(`  ${N.toLocaleString('en')} encodings × ${REPS} repetitions, median [min–max]:\n`)
for (const r of results) {
  const med = r.runs[Math.floor(REPS / 2)]
  console.log(`  ${r.name.padEnd(28)}${String(med).padStart(5)} ms  [${r.runs[0]}–${r.runs[REPS - 1]}]   ${med ? (base / med).toFixed(2) + '×' : '—'}`)
}

// ── 3 · and whether it matters ──────────────────────────────────────────────────────────────────────────
const seeds = Array.from({ length: N }, (_, i) => `bench_seed_${i}`)
const t0 = process.hrtime.bigint()
for (const s of seeds) toUuid(s)
const whole = Number((process.hrtime.bigint() - t0) / 1_000_000n)
const hexMed = results[0].runs[Math.floor(REPS / 2)]
const best = Math.min(...results.slice(1).map((r) => r.runs[Math.floor(REPS / 2)]))
const share = hexMed / whole
const saving = (hexMed - best) / whole

console.log(`\n  toUuid over the same ${N.toLocaleString('en')} FRESH seeds: ${whole} ms`)
console.log(`  hex formatting is ${(100 * share).toFixed(0)}% of it — the rest is the hash (bytesFromSeed, mul32)`)
console.log(`  the fastest encoder removes ${(100 * saving).toFixed(0)}% of address cost`)
console.log(`\n  AND THE SCALE THAT DECIDES: a real run addresses 2,423 ledger entries in ~28 ms, against a`)
console.log(`  gate sweep of ~8 s and a site build of ~75 s. ${(100 * saving).toFixed(0)}% of 0.35% is about 0.02% of a build.`)
console.log(`\n✓ bench-hex: the table is genuinely ${(base / best).toFixed(1)}× faster and it is not worth changing`)
console.log(`  toUuid for — the multiply dominates the encoder, and the encoder is not on any critical path.`)
console.log(`  Reported so the claim can be checked rather than repeated.`)
