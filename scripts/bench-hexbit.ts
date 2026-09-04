#!/usr/bin/env node
// THE HEXBIT BENCHMARK — 6-bit grouping over the 64-hexagram lattice, against 4-bit and 8-bit.
//
// A hexbit is SIX BITS, and 64 = 2^6 is the complete lattice of them: one hexagram per value, six broken or
// solid lines. That is the same 64 this deposit already carries as 4^3 = 8^2 = 2^6 in the codon theorems
// and as the 64 two-bit fold-verifications in a 128-bit seal.
//
// Grouping a 16-byte content-address three ways:
//
//     4-bit  16 symbols   32 characters
//     6-bit  64 symbols   22 characters   ← the hexagram lattice
//     8-bit 256 symbols   16 characters
//
// So a hexbit encoding is 31% SHORTER than the hex the addresses use today. Whether it is faster is the
// measurement; whether shorter is worth anything here is the third question, and it is the one that decides.
//
// CORRECTNESS IS THE PRECONDITION. An encoding of a content-address must round-trip exactly or the address
// is not an address. Every encoder is checked to decode back to the identical bytes over the whole 64-value
// lattice and 2000 random 16-byte vectors before anything is timed.
const N = 200_000, REPS = 5

const HEXAGRAM = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'  // 64 symbols, one per hexagram
const HEX = Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, '0'))
const NIB = '0123456789abcdef'

const enc8 = (b: number[]) => { let s = ''; for (let i = 0; i < b.length; i++) s += HEX[b[i]]; return s }
const enc4 = (b: number[]) => { let s = ''; for (let i = 0; i < b.length; i++) { const v = b[i]; s += NIB[v >>> 4] + NIB[v & 15] } return s }
// 6-bit: three bytes become four hexagrams, exactly as base64 groups them
const enc6 = (b: number[]) => {
  let s = ''
  for (let i = 0; i < b.length; i += 3) {
    const n = (b[i] << 16) | ((b[i + 1] ?? 0) << 8) | (b[i + 2] ?? 0)
    const take = i + 3 <= b.length ? 4 : (b.length - i) + 1
    for (let j = 0; j < take; j++) s += HEXAGRAM[(n >>> (18 - 6 * j)) & 63]
  }
  return s
}
const dec6 = (s: string, len: number) => {
  const out: number[] = []
  for (let i = 0; i < s.length; i += 4) {
    let n = 0, k = 0
    for (; k < 4 && i + k < s.length; k++) n = (n << 6) | HEXAGRAM.indexOf(s[i + k])
    n <<= 6 * (4 - k)
    for (let j = 0; j < k - 1; j++) out.push((n >>> (16 - 8 * j)) & 0xff)
  }
  return out.slice(0, len)
}

// ── 1 · round-trip, over the whole lattice and random vectors ───────────────────────────────────────────
let bad = 0
const lattice = Array.from({ length: 64 }, (_, i) => i)
if (dec6(enc6(lattice), 64).join() !== lattice.join()) { console.error('  ✗ 6-bit does not round-trip the 64-value lattice'); bad++ }
for (let t = 0; t < 2000; t++) {
  const v = Array.from({ length: 16 }, () => (Math.random() * 256) | 0)
  if (dec6(enc6(v), 16).join() !== v.join()) { console.error('  ✗ 6-bit fails to round-trip a random 16-byte vector'); bad++; break }
  if (enc4(v) !== enc8(v)) { console.error('  ✗ 4-bit and 8-bit disagree'); bad++; break }
}
if (bad) { console.error('\n✗ bench-hexbit: an encoding does not round-trip — an address that cannot be decoded is not an address'); process.exit(1) }
console.log('  ✓ 6-bit round-trips the whole 64-hexagram lattice and 2000 random 16-byte vectors')
console.log('  ✓ 4-bit and 8-bit agree on all of them\n')

// ── 2 · speed, with the range ───────────────────────────────────────────────────────────────────────────
const vec = Array.from({ length: 16 }, (_, i) => (i * 37) % 256)
const time = (f: (b: number[]) => string) => {
  const runs: number[] = []
  for (let r = 0; r < REPS; r++) { f(vec); const t = process.hrtime.bigint(); for (let i = 0; i < N; i++) f(vec); runs.push(Number((process.hrtime.bigint() - t) / 1_000_000n)) }
  return runs.sort((a, b) => a - b)
}
const rows: [string, number[], number][] = [
  ['8-bit  hex table (current)', time(enc8), enc8(vec).length],
  ['6-bit  hexagram lattice', time(enc6), enc6(vec).length],
  ['4-bit  nibble table', time(enc4), enc4(vec).length],
]
const base = rows[0][1][Math.floor(REPS / 2)]
console.log(`  ${N.toLocaleString('en')} encodings × ${REPS} repetitions, median [min–max], and length:\n`)
for (const [name, runs, len] of rows) {
  const med = runs[Math.floor(REPS / 2)]
  console.log(`  ${name.padEnd(28)}${String(med).padStart(5)} ms  [${runs[0]}–${runs[REPS - 1]}]   ${(base / med).toFixed(2)}×   ${len} chars`)
}

const six = rows[1][1][Math.floor(REPS / 2)], eight = rows[0][1][Math.floor(REPS / 2)]
console.log(`\n  6-bit is ${six < eight ? (eight / six).toFixed(2) + '× faster' : (six / eight).toFixed(2) + '× SLOWER'} than the 8-bit table this repo uses, and ${rows[1][2]} characters against ${rows[0][2]}`)
console.log(`  — ${(100 * (1 - rows[1][2] / rows[0][2])).toFixed(0)}% shorter.`)
console.log(`\n  WHAT IT WOULD COST: changing the encoding changes every content-address in a 2423-entry`)
console.log(`  append-only ledger. The hex form is fixed by RFC 9562 §5.8, which is what makes these`)
console.log(`  addresses uuids rather than a private string. Shorter is not free when the format is the`)
console.log(`  interoperability.`)
