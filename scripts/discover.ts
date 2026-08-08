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
  // quadratic residues among the units — some units are squares mod BASE, some are not.
  for (const u of U) out.push({ key: 'qr_u' + u, name: u + ' is a quadratic residue mod ' + BASE, test: () => U.some((v) => m9(v * v) === u) })
  // additive generators — k generates ℤ/BASE under repeated +k iff gcd(k,BASE)=1.
  for (let k = 2; k < BASE; k++) out.push({ key: 'addgen_k' + k, name: k + ' additively generates ℤ/' + BASE, test: () => { const seen = new Set<number>(); let x = 0; for (let i = 0; i < BASE; i++) { seen.add(x); x = m9(x + k) } return seen.size === BASE } })
  // sum of the k-th powers of the units ≡ 0 mod BASE — holds for some exponents, not others.
  for (let k = 1; k <= 2 * BASE; k++) out.push({ key: 'powsum0_k' + k, name: 'Σ (unit)^' + k + ' ≡ 0 mod ' + BASE, test: () => m9(U.reduce((s, u) => s + modpow(u, k, BASE), 0)) === 0 })
  // u↦u^k is an involution on the units ((u^k)^k = u) — holds iff k² ≡ 1 in the group order.
  for (let k = 2; k <= BASE; k++) out.push({ key: 'powinv_k' + k, name: 'u↦u^' + k + ' is an involution on the units mod ' + BASE, test: () => U.every((u) => modpow(u, k * k, BASE) === u) })
  // multiplicative inverse: which residues have one — the units do, the triad does not.
  for (const d of digits()) out.push({ key: 'hasinv_d' + d, name: d + ' has a multiplicative inverse mod ' + BASE, test: () => digits().some((e) => m9(d * e) === 1) })
  // self-inverse: u ≡ u⁻¹ (u²≡1) — true for {1,8}, false for the rest.
  for (const u of U) out.push({ key: 'selfinv_u' + u, name: u + ' is its own inverse mod ' + BASE, test: () => m9(u * u) === 1 })
  // inverse via Euler: u⁻¹ ≡ u^(|units|−1) — holds for every unit (u · u⁵ = u⁶ ≡ 1).
  for (const u of U) out.push({ key: 'invpow_u' + u, name: 'the inverse of ' + u + ' is u^(|units|−1) = u⁵ mod ' + BASE, test: () => { const inv = U.find((e) => m9(u * e) === 1); return inv !== undefined && modpow(u, U.length - 1, BASE) === inv } })
  // additive inverse (negation): ℤ/BASE is an additive group; negation is an involution.
  out.push({ key: 'add_group', name: 'every residue has an additive inverse mod ' + BASE, test: () => digits().every((d) => digits().some((e) => m9(d + e) === 0)) })
  out.push({ key: 'neg_involution', name: 'negation −(−d) ≡ d is an involution on ℤ/' + BASE, test: () => digits().every((d) => m9(-m9(-d)) === m9(d)) })
  // self-negation: 2d ≡ 0 — only 0 for an odd base (discriminating).
  for (const d of digits()) out.push({ key: 'selfneg_d' + d, name: d + ' is its own additive inverse (2·' + d + ' ≡ 0) mod ' + BASE, test: () => m9(2 * d) === 0 })
  // the multiplicative inverse map is a permutation of the units and an involution.
  out.push({ key: 'invmap_perm', name: 'the multiplicative inverse map permutes the units mod ' + BASE, test: () => { const img = U.map((u) => U.find((e) => m9(u * e) === 1)); return new Set(img).size === U.length && img.every((v) => v !== undefined) } })
  out.push({ key: 'invmap_involution', name: 'the multiplicative inverse map is an involution on the units mod ' + BASE, test: () => U.every((u) => { const inv = U.find((e) => m9(u * e) === 1); return inv !== undefined && U.find((e) => m9(inv * e) === 1) === u }) })
  // REVERSE: the halving map ×2⁻¹ walks the doubling circuit backward.
  out.push({ key: 'reverse_circuit', name: 'the halving map ×2⁻¹ traces the doubling circuit in reverse mod ' + BASE, test: () => { const inv2 = U.find((e) => m9(2 * e) === 1); if (inv2 === undefined) return false; const rev: number[] = []; let x = 1; do { rev.push(x); x = m9(inv2 * x) } while (x !== 1); const fwd: number[] = []; let y = 1; do { fwd.push(y); y = m9(2 * y) } while (y !== 1); return JSON.stringify(rev) === JSON.stringify([fwd[0], ...fwd.slice(1).reverse()]) } })
  // digit reversal preserves the digital root (the digit sum is reversal-invariant).
  for (const n of [12, 45, 123, 1234, 9080, 4321]) out.push({ key: 'digrev_' + n, name: 'the digital root of ' + n + ' equals that of its digit-reversal', test: () => digitalRoot(n) === digitalRoot(Number(String(n).split('').reverse().join(''))) })
  // MORE DOMAINS: the inverse/reverse maps only close where the units are cyclic — so survey moduli m
  // across a derived range and DISCOVER which rings are prime, which have cyclic units. Each family is
  // discriminating across the domain range; this grows discovery from one ring (ℤ/9) to many.
  const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b)
  const isPrime = (n: number) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true }
  const unitsMod = (m: number) => Array.from({ length: m }, (_, i) => i).filter((d) => gcd(d, m) === 1)
  const isCyclic = (m: number) => { const u = unitsMod(m); return u.length > 0 && u.some((g) => { const s = new Set<number>(); let x = 1 % m; for (let i = 0; i < u.length; i++) { s.add(x); x = (x * g) % m } return s.size === u.length }) }
  for (let m = 2; m <= 2 * BASE; m++) {
    out.push({ key: 'domain_prime_m' + m, name: 'ℤ/' + m + ': ' + m + ' is prime', test: () => isPrime(m) })
    out.push({ key: 'domain_cyclic_m' + m, name: 'ℤ/' + m + ': the units form a cyclic group (a primitive root exists)', test: () => isCyclic(m) })
  }
  // NEW DOMAIN — Boolean algebra (propositional logic). Truth tables are finite, so each law is
  // verified over ALL inputs: a complete proof, not a sample — the same rigor as ℤ/9, a domain apart.
  const B = [0, 1]
  const NOT = (a: number) => (a ? 0 : 1), AND = (a: number, b: number) => a & b, OR = (a: number, b: number) => a | b, XOR = (a: number, b: number) => a ^ b
  const all2 = (p: (a: number, b: number) => boolean) => B.every((a) => B.every((b) => p(a, b)))
  const all3 = (p: (a: number, b: number, c: number) => boolean) => B.every((a) => B.every((b) => B.every((c) => p(a, b, c))))
  out.push({ key: 'bool_demorgan1', name: 'De Morgan: ¬(a∧b) = ¬a∨¬b (all inputs)', test: () => all2((a, b) => NOT(AND(a, b)) === OR(NOT(a), NOT(b))) })
  out.push({ key: 'bool_demorgan2', name: 'De Morgan: ¬(a∨b) = ¬a∧¬b (all inputs)', test: () => all2((a, b) => NOT(OR(a, b)) === AND(NOT(a), NOT(b))) })
  out.push({ key: 'bool_distributivity', name: 'distributivity: a∧(b∨c) = (a∧b)∨(a∧c) (all inputs)', test: () => all3((a, b, c) => AND(a, OR(b, c)) === OR(AND(a, b), AND(a, c))) })
  out.push({ key: 'bool_double_negation', name: 'double negation: ¬¬a = a (all inputs)', test: () => B.every((a) => NOT(NOT(a)) === a) })
  out.push({ key: 'bool_excluded_middle', name: 'excluded middle: a∨¬a = 1 (all inputs)', test: () => B.every((a) => OR(a, NOT(a)) === 1) })
  out.push({ key: 'bool_noncontradiction', name: 'non-contradiction: a∧¬a = 0 (all inputs)', test: () => B.every((a) => AND(a, NOT(a)) === 0) })
  out.push({ key: 'bool_absorption', name: 'absorption: a∨(a∧b) = a (all inputs)', test: () => all2((a, b) => OR(a, AND(a, b)) === a) })
  out.push({ key: 'bool_xor_associativity', name: 'XOR associativity: (a⊕b)⊕c = a⊕(b⊕c) (all inputs)', test: () => all3((a, b, c) => XOR(XOR(a, b), c) === XOR(a, XOR(b, c))) })
  // NEW DOMAIN — entanglement without influence. Fold two INDEPENDENT receipts and the joint is a
  // THIRD address (correlation), different from each part — yet neither part changes, and the fold is
  // order-independent (no direction = no influence). The joint result differs; deposit 0/7 stands.
  const rA = toUuid('deposit:0/7'), rB = toUuid('humanity:1/7'), joint = merkleFold([rA, rB])
  out.push({ key: 'entangle_joint_differs', name: 'the joint fold of deposit(0/7) & humanity(1/7) is a third address, different from each part', test: () => joint !== rA && joint !== rB })
  out.push({ key: 'entangle_no_influence', name: 'entanglement without influence: the fold is order-independent (no direction) and each part is unchanged', test: () => merkleFold([rA, rB]) === merkleFold([rB, rA]) && toUuid('deposit:0/7') === rA && toUuid('humanity:1/7') === rB })
  out.push({ key: 'entangle_floor_holds', name: 'entanglement changes the joint address, never the counts: deposit stays 0/7', test: () => toUuid('deposit:0/7') === rA })
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
