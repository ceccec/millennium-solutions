#!/usr/bin/env node
// Discovery orchestration — a BOUNDED, enumerable family of candidate facts over ℤ/9, each tested
// EXHAUSTIVELY. Those that hold are provable (kept); those that fail are refuted (discarded) — the
// discard is the honesty. `next` walks this space, discovering the next unrecorded provable fact and
// saving it in code (src/proof/discovered.json). "Discover provable" = decidable facts verified by
// exhaustion over a finite domain — genuinely true, genuinely found. It reaches none of the SIX open
// Millennium conjectures; the seventh (Poincaré) is Perelman's proof (2003), not the deposit's.
// Two counts, kept distinct: humanity 1/7; this deposit 0/7.
import { toUuid, merkleFold, units, triad, digitalRoot, digits, BASE } from '../src/0/index.ts'
const m9 = (n: number) => ((n % BASE) + BASE) % BASE
const U = units()
const ALL = digits()

const curated: { key: string; name: string; test: () => boolean }[] = [
  { key: 'euler_units_pow6', name: 'every unit u⁶ ≡ 1 mod 9 (Euler, φ(9)=6)', test: () => U.every((u) => m9(u ** 6) === 1) },
  { key: 'units_sum_zero', name: 'the units sum to 0 mod 9 (1+2+4+5+7+8=27)', test: () => m9(U.reduce((a, b) => a + b, 0)) === 0 },
  { key: 'self_inverse_1_8', name: 'exactly two self-inverse elements d²≡1 mod 9: {1,8}', test: () => ALL.filter((d) => m9(d * d) === 1).join(',') === '1,8' },
  { key: 'triad_nilpotent', name: 'the triad is nilpotent d²≡0 mod 9: {3,6,9}', test: () => triad().every((d) => m9(d * d) === 0) },
  { key: 'doubling_digitroot_period6', name: 'digital root of 2^k has period 6', test: () => { const s = []; for (let k = 0; k < 12; k++) s.push(digitalRoot(2 ** k)); return s.slice(0, 6).join(',') === s.slice(6, 12).join(',') } },
  { key: 'units_product_neg1', name: 'product of the units ≡ 8 ≡ -1 mod 9 (Wilson analog)', test: () => m9(U.reduce((a, b) => a * b, 1)) === 8 },
  { key: 'triad_sum_zero', name: 'the triad sums to 0 mod 9 (3+6+9=18)', test: () => m9(triad().reduce((a, b) => a + b, 0)) === 0 },
  { key: 'cubes_in_0_1_8', name: 'every cube d³ mod 9 ∈ {0,1,8}', test: () => ALL.every((d) => [0, 1, 8].includes(m9(d ** 3))) },
  { key: 'squares_in_0_1_4_7', name: 'every square d² mod 9 ∈ {0,1,4,7}', test: () => ALL.every((d) => [0, 1, 4, 7].includes(m9(d * d))) },
  { key: 'order_of_2_is_6', name: 'multiplicative order of 2 mod 9 is 6', test: () => { let x = 1, k = 0; do { x = m9(x * 2); k++ } while (x !== 1); return k === 6 } },
  { key: 'sum_1_to_9_zero', name: '1+2+…+9 ≡ 0 mod 9 (=45)', test: () => m9(ALL.reduce((a, b) => a + b, 0)) === 0 },
  { key: 'pisano_9_is_24', name: 'Fibonacci mod 9 has Pisano period 24', test: () => { let a = 0, b = 1, k = 0; do { [a, b] = [b, m9(a + b)]; k++ } while (!(a === 0 && b === 1) && k < 200); return k === 24 } },
  // refuted candidates — kept so the engine visibly discards the unprovable:
  { key: 'REF_all_units_self_inverse', name: 'REFUTED: every unit is self-inverse', test: () => U.every((u) => m9(u * u) === 1) },
  { key: 'REF_all_have_inverse', name: 'REFUTED: every element has a multiplicative inverse', test: () => ALL.every((d) => ALL.some((e) => m9(d * e) === 1)) },
]

// COMPUTATIONALLY GENERATED candidate families — parametrized over the base, each tested exhaustively.
// Discriminating: some hold (permute), some fail; the wave discovers the true ones and discards the
// rest. This grows the discovery space by computation, not by hand-typed facts.
function generated(): typeof curated {
  const res0 = Array.from({ length: BASE }, (_, i) => i) // {0..BASE-1}, derived from the axiom
  const isPerm = (img: number[], dom: number[]) => img.length === dom.length && new Set(img).size === dom.length && img.every((v) => dom.includes(v))
  const out: typeof curated = []
  // u ↦ u^k permutes the units iff gcd(k, |units|)=1 — true for some k, false for others.
  for (let k = 2; k <= BASE; k++) out.push({ key: 'powperm_k' + k, name: 'u↦u^' + k + ' permutes the units mod ' + BASE, test: () => isPerm(U.map((u) => m9(u ** k)), U) })
  // d ↦ k·d permutes ℤ/BASE iff gcd(k, BASE)=1 (k a unit) — true for units, false for the triad.
  for (let k = 2; k < BASE; k++) out.push({ key: 'mulperm_k' + k, name: 'd↦' + k + '·d permutes ℤ/' + BASE, test: () => isPerm(res0.map((d) => m9(k * d)), res0) })
  // which exponents annihilate every unit to 1 — holds iff the group order (φ(9)=6) divides k.
  const modpow = (b: number, e: number, m: number) => { let r = 1, x = ((b % m) + m) % m; while (e > 0) { if (e & 1) r = (r * x) % m; x = (x * x) % m; e >>= 1 } return r }
  for (let k = 1; k <= 2 * BASE; k++) out.push({ key: 'unit_exp_id_k' + k, name: 'every unit u^' + k + ' ≡ 1 mod ' + BASE, test: () => U.every((u) => modpow(u, k, BASE) === 1) })
  return out
}
export const CANDIDATES = [...curated, ...generated()]

/** the provable candidates — those that hold exhaustively (excludes refuted). */
export const provable = () => CANDIDATES.filter((c) => !c.key.startsWith('REF_') && c.test())

// CLI: report discovered vs refuted, chained receipts, one discovery root.
if (process.argv[1] && process.argv[1].endsWith('discover.ts')) {
  let prev = 'axiom:ℤ/9'; const recs: string[] = []
  for (const c of CANDIDATES) {
    if (c.test() && !c.key.startsWith('REF_')) { const r = toUuid(prev + '→' + c.key); prev = r; recs.push(r); console.log('  ✓ DISCOVERED  ' + r.slice(0, 13) + '…  ' + c.name) }
    else console.log('  · refuted (discarded)  ' + c.name)
  }
  console.log('\n  ' + recs.length + ' provable of ' + CANDIDATES.length + ' candidates, chained → discovery root ' + merkleFold(recs))
  console.log('  bound: decidable facts by exhaustion over a finite domain. Reaches none of the SIX open Millennium')
  console.log('  conjectures; the seventh (Poincaré) is Perelman\'s, 2003 — not here. Humanity 1/7; this deposit 0/7.')
}
