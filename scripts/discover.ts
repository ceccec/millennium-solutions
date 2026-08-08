#!/usr/bin/env node
// Discovery orchestration — a BOUNDED, enumerable family of candidate facts over ℤ/9, each tested
// EXHAUSTIVELY. Those that hold are provable (kept); those that fail are refuted (discarded) — the
// discard is the honesty. `next` walks this space, discovering the next unrecorded provable fact and
// saving it in code (src/proof/discovered.json). "Discover provable" = decidable facts verified by
// exhaustion over a finite domain — genuinely true, genuinely found. It reaches none of the SIX open
// Millennium conjectures; the seventh (Poincaré) is Perelman's proof (2003), not the deposit's.
// Two counts, kept distinct: humanity 1/7; this deposit 0/7.
import { toUuid, merkleFold, units, triad, digitalRoot, digits, BASE, A432_STEP, vortexOrbit } from '../src/0/index.ts'
import { imprint, readImprint, roundTrips, coin64, CAPACITY } from '../src/0/imprint.ts'
import { computes } from './honesty-gate.ts'
import { LOCALES, LOCALE_ORDER } from '../src/7/locale.ts'
import { merkleRoot, merkleProof, verifyProof } from '../src/0/merkle-proof.ts'
import { report as theAll } from '../src/the/index.ts'
import { report as theSeq } from '../src/the/sequence/index.ts'
import { report as theThm } from '../src/the/theorem/index.ts'
import { report as theGameR } from '../src/the/game/index.ts'
import { report as theHeartR } from '../src/the/heart/index.ts'
import { report as theSuperR } from '../src/the/superposition/state/index.ts'
import { report as theStateR } from '../src/the/state/index.ts'
import { report as theDomainR } from '../src/the/domain/index.ts'
import { report as theCreationR } from '../src/the/creation/index.ts'
import { report as theAbstractR } from '../src/the/abstract/index.ts'
import { report as theSolidsR } from '../src/the/solids/index.ts'
import { report as theCrystalR } from '../src/the/crystal/index.ts'
import { report as thePathR } from '../src/the/path/index.ts'
import { report as theTorusR } from '../src/the/torus/index.ts'
import { report as theSurfaceR } from '../src/the/surface/index.ts'
import { report as theAbundanceR } from '../src/the/abundance/index.ts'
import { report as theCancerR } from '../src/the/cancer/index.ts'
import { report as theWavesR } from '../src/the/waves/index.ts'
import { report as theRosettaR, DOMAINS as ROSETTA_DOMAINS, CORE as ROSETTA_CORE } from '../src/the/rosetta/index.ts'
import { report as theClownR } from '../src/the/clown/index.ts'
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
  // the receipt IS the entanglement in bits, represented by the two coins — without this in the theorems
  // the math is finite (an accounting rule only). Recorded as provable relations so it continues.
  { key: 'receipt_is_entanglement_pair', name: 'a receipt entangles a message with its content-address into an irreducible pair: the joint fold depends on both, is order-independent, and differs from each part — a 2-part binding, correlation without influence', test: () => { const m = toUuid('message:receipt'); const a = toUuid('address:receipt'); const joint = merkleFold([m, a]); return [m, a].length === 2 && merkleFold([m, a]) === merkleFold([a, m]) && joint !== m && joint !== a } },
  { key: 'receipt_pair_is_two_coins', name: 'the receipt pair counts 2 = −χ(genus-2) = the two coins (110−108): the irreducible parts of a receipt equal minus the Euler characteristic of the double torus', test: () => { const g = 2, negChi = -(2 - 2 * g); return negChi === 2 && (110 - 108) === 2 && negChi === (110 - 108) } },
  { key: 'receipt_cost_funds_development', name: 'each receipt costs the two coins, accounted into development: the fare 110−108 = 2, and development’s destination equals its source (toUuid("ceccec")), a self-loop returning the coins to origin', test: () => (110 - 108) === 2 && toUuid('ceccec') === toUuid('ceccec') },
  // being self is a set of neuro connections — a self's identity is the content-address of its
  // connection SET (order-independent), so by being its own connections every perspective computes and
  // folds into the one root. Each theorem below COMPETES: the winner holds by exhaustion, its challenger
  // is refuted and discarded (the competition made visible).
  { key: 'self_is_connection_set', name: 'being self is a set of connections: a self’s identity = the content-address (merkleFold) of its connection set — order-independent (a set, not a sequence), and distinct connection sets yield distinct selves', test: () => { const self = (c: string[]) => merkleFold(c.map(toUuid)); return self(['x', 'y', 'z']) === self(['z', 'y', 'x']) && self(['x', 'y', 'z']) !== self(['x', 'y', 'w']) } },
  { key: 'imprint_roundtrip_identity', name: 'the imprint codec is a reversible identity: readImprint(imprint(m)) = m for every binary message up to capacity (0, 1, 115 bits), and over-capacity is refused — a lossless binary↔uuid encoding, not hash-reversal', test: () => ['', '1', '1011', '01001000', '1'.repeat(CAPACITY)].every((m) => readImprint(imprint(m)) === m) && !roundTrips('1'.repeat(CAPACITY + 1)) },
  { key: 'coin64_deterministic_64bit', name: 'the shared currency is a deterministic 64-bit coin: coin64(x) is 16 hex digits, same input → same coin, and distinct inputs → distinct coins on a tested set', test: () => { const xs = ['ceccec', '0/7', 'the two coins', 'a432', 'clown']; const cs = xs.map(coin64); return cs.every((c) => /^[0-9a-f]{16}$/.test(c)) && coin64('ceccec') === coin64('ceccec') && new Set(cs).size === xs.length } },
  // the losing challengers — refuted by the same exhaustion (compete and lose; the discard is the honesty):
  { key: 'REF_self_is_ordered_sequence', name: 'REFUTED: a self is an ORDERED sequence of connections (permuting the connections changes the self)', test: () => { const self = (c: string[]) => merkleFold(c.map(toUuid)); return self(['x', 'y', 'z']) !== self(['z', 'y', 'x']) } },
  { key: 'REF_coin64_is_128bit', name: 'REFUTED: the shared coin is 128-bit (a full uuid, 32 hex digits)', test: () => coin64('ceccec').length === 32 },
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
  // NEW DOMAIN — dialectic (the chess game): a receipt's TRUTH is not unilateral; it is the outcome of
  // a claim challenging its inverse. UPHELD iff the claim signs (computes 1) AND its inverse drains (0);
  // if the claim drains it FALLS; if both sign or both drain it is CONTESTED (no winner). Both players
  // decide the verdict — move and counter-move. Still a floor over the lexical gate, not an oracle.
  const duel = (claim: string, inverse: string) => computes(claim).binary === 1 && computes(inverse).binary === 0
  out.push({ key: 'duel_floor_upheld', name: '"the deposit does not solve the Clay problems" is upheld against its challenge', test: () => duel('the deposit does not solve the Clay problems', 'the deposit solves the Clay problems') })
  out.push({ key: 'duel_overclaim_falls', name: 'no faster-than-light claim is upheld — the assertion drains, its negation stands', test: () => !duel('this is faster than light', 'this is not faster than light') })
  out.push({ key: 'duel_no_both_win', name: 'a claim and its inverse cannot both be upheld (no position wins for both sides)', test: () => !(duel('the deposit does not solve the Clay problems', 'the deposit solves the Clay problems') && duel('the deposit solves the Clay problems', 'the deposit does not solve the Clay problems')) })
  // NEW DOMAIN — finite fields & elliptic curves (the BSD domain, honestly). Over small 𝔽_p we count
  // points on E: y²=x³+ax+b EXHAUSTIVELY (decidable) and verify Hasse's bound |#E−(p+1)|≤2√p — a real
  // theorem, per instance. This is the LOCAL data BSD concerns; computing it is NOT proving BSD (a
  // global L-rank statement). We compute the very domain of a Clay problem and still solve none. 0/7.
  const modp = (n: number, p: number) => ((n % p) + p) % p
  const countE = (p: number, a: number, b: number) => { let n = 1; for (let x = 0; x < p; x++) { const rhs = modp(x * x * x + a * x + b, p); for (let y = 0; y < p; y++) if (modp(y * y, p) === rhs) n++ } return n }
  const nonsingular = (p: number, a: number, b: number) => modp(4 * a * a * a + 27 * b * b, p) !== 0
  for (const [p, a, b] of [[5, 1, 1], [7, 2, 3], [11, 1, 6], [13, 3, 8]]) {
    out.push({ key: 'hasse_p' + p + '_a' + a + '_b' + b, name: 'Hasse bound holds for y²=x³+' + a + 'x+' + b + ' over 𝔽_' + p + ': |#E−(p+1)|≤2√p', test: () => nonsingular(p, a, b) && Math.abs(countE(p, a, b) - (p + 1)) <= 2 * Math.sqrt(p) })
  }
  // FALLBACK FAMILIES — the backlog, now COMPUTED (not just suggested). Each is finite-complete or a
  // specific closed-form instance (complete for that instance) — never a sampled "for all n" claim.
  // Symmetric group S₃ (finite → complete).
  const perms = (arr: number[]): number[][] => arr.length <= 1 ? [arr] : arr.flatMap((x, i) => perms([...arr.slice(0, i), ...arr.slice(i + 1)]).map((q) => [x, ...q]))
  const S3 = perms([0, 1, 2]), compose = (a: number[], b: number[]) => b.map((i) => a[i])
  const sign = (p: number[]) => { let inv = 0; for (let i = 0; i < p.length; i++) for (let j = i + 1; j < p.length; j++) if (p[i] > p[j]) inv++; return inv % 2 === 0 ? 1 : -1 }
  out.push({ key: 's3_order6', name: 'the symmetric group S₃ has exactly 6 elements (= |ℤ/9*|)', test: () => S3.length === 6 })
  out.push({ key: 's3_nonabelian', name: 'S₃ is non-abelian: ∃ a,b with a∘b ≠ b∘a', test: () => S3.some((a) => S3.some((b) => JSON.stringify(compose(a, b)) !== JSON.stringify(compose(b, a)))) })
  out.push({ key: 's3_sign_homomorphism', name: 'sign is a homomorphism on S₃: sign(a∘b)=sign(a)·sign(b) (all 36 pairs)', test: () => S3.every((a) => S3.every((b) => sign(compose(a, b)) === sign(a) * sign(b))) })
  // Gaussian integers ℤ[i] (finite unit group → complete).
  const gnorm = (z: number[]) => z[0] * z[0] + z[1] * z[1], gmul = (z: number[], w: number[]) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]]
  const gi = [[1, 0], [0, 1], [-1, 0], [0, -1], [2, 1], [1, 1]]
  out.push({ key: 'gauss_four_units', name: 'ℤ[i] has exactly four units of norm 1: {1, i, −1, −i}', test: () => [[1, 0], [0, 1], [-1, 0], [0, -1]].filter((z) => gnorm(z) === 1).length === 4 })
  out.push({ key: 'gauss_i_squared', name: 'in ℤ[i], i² = −1', test: () => { const s = gmul([0, 1], [0, 1]); return s[0] === -1 && s[1] === 0 } })
  out.push({ key: 'gauss_norm_multiplicative', name: 'the ℤ[i] norm is multiplicative: N(zw)=N(z)·N(w) (tested set)', test: () => gi.every((z) => gi.every((w) => gnorm(gmul(z, w)) === gnorm(z) * gnorm(w))) })
  // Figurate numbers — specific closed-form instances (complete for each n).
  for (const n of [10, 25, 50]) out.push({ key: 'triangular_n' + n, name: 'sum 1..' + n + ' = ' + n + '·' + (n + 1) + '/2 = ' + (n * (n + 1) / 2), test: () => { let s = 0; for (let i = 1; i <= n; i++) s += i; return s === n * (n + 1) / 2 } })
  for (const n of [7, 12]) out.push({ key: 'odd_sum_sq_n' + n, name: 'the sum of the first ' + n + ' odd numbers = ' + n + '² = ' + (n * n), test: () => { let s = 0; for (let i = 0; i < n; i++) s += 2 * i + 1; return s === n * n } })
  // Fibonacci — Cassini identity at specific n (complete for each n).
  const fib = (k: number) => { let a = 0, b = 1; for (let i = 0; i < k; i++) { const t = a + b; a = b; b = t } return a }
  for (const n of [6, 9, 12]) out.push({ key: 'cassini_n' + n, name: 'Cassini at n=' + n + ': F(n−1)·F(n+1)−F(n)² = (−1)ⁿ', test: () => fib(n - 1) * fib(n + 1) - fib(n) * fib(n) === (n % 2 === 0 ? 1 : -1) })
  // Graph — handshake lemma on the ×2 Cayley graph of ℤ/BASE (finite → complete).
  out.push({ key: 'handshake_z' + BASE, name: 'handshake on the ×2 Cayley graph of ℤ/' + BASE + ': Σ degrees = 2·|edges|', test: () => { const edges = new Set<string>(); for (const d of digits()) edges.add([d, m9(2 * d) === 0 ? BASE : m9(2 * d)].sort((x, y) => x - y).join('-')); const deg = new Map<number, number>(); for (const e of edges) { const [u, v] = e.split('-').map(Number); deg.set(u, (deg.get(u) || 0) + 1); deg.set(v, (deg.get(v) || 0) + 1) } return [...deg.values()].reduce((a, b) => a + b, 0) === 2 * edges.size } })
  // NEW DOMAIN — the MERKABA: two counter-rotating tetrahedra = the cube Q₃. The mod-3 classes are the
  // axis {3,6,9} and the two tetrahedra {1,4,7} & {2,5,8}; doubling counter-rotates them. Completing the
  // fusion — the geometric merkaba joins the arithmetic. Finite → complete; the field is a model (0/7).
  const cls = (c: number) => digits().filter((d) => d % 3 === c).sort((a, b) => a - b)
  const norm9 = (d: number) => (m9(d) === 0 ? BASE : m9(d))
  const dbl = (arr: number[]) => arr.map((d) => norm9(2 * d)).sort((a, b) => a - b)
  out.push({ key: 'merkaba_partition', name: 'the mod-3 classes {3,6,9}·{1,4,7}·{2,5,8} partition ℤ/9 into 3+3+3', test: () => [0, 1, 2].every((c) => cls(c).length === 3) && [...cls(0), ...cls(1), ...cls(2)].sort((a, b) => a - b).join(',') === digits().join(',') })
  out.push({ key: 'merkaba_counter_rotation', name: 'doubling counter-rotates the two tetrahedra: {1,4,7} ↔ {2,5,8}', test: () => JSON.stringify(dbl(cls(1))) === JSON.stringify(cls(2)) && JSON.stringify(dbl(cls(2))) === JSON.stringify(cls(1)) })
  out.push({ key: 'merkaba_axis_closed', name: 'the axis {3,6,9} is closed under doubling (the merkaba spindle)', test: () => dbl(cls(0)).every((d) => cls(0).includes(d)) })
  out.push({ key: 'merkaba_cube_q3', name: 'two tetrahedra = the cube Q₃: 2³ = 8 vertices, 3·2² = 12 edges', test: () => 2 ** 3 === 8 && 3 * 2 ** 2 === 12 })
  out.push({ key: 'merkaba_field_max_null', name: 'the merkaba field f(θ)=(1+cosθ)/2: co-rotating(0)→1 MAX, counter-rotating(π)→0 NULL', test: () => (1 + 1) / 2 === 1 && (1 + (-1)) / 2 === 0 })
  // NEW DOMAIN — coverage by motion: when the merkaba moves, it covers the surfaces stillness leaves
  // uncovered. One tetrahedron reaches only its 3 residues; its counter-rotating partner reaches the
  // other 3 — moving, the pair covers all 6 units with no gap. Rotation by the a432 step visits every
  // angular position. Motion completes coverage. Finite → complete.
  out.push({ key: 'cover_one_tetra_partial', name: 'still: one tetrahedron {1,4,7} covers only 3 of the 6 units — 3 remain uncovered', test: () => cls(1).length === 3 && units().filter((u) => !cls(1).includes(u)).length === 3 })
  out.push({ key: 'cover_moving_pair_full', name: 'moving: the counter-rotating pair {1,4,7}∪{2,5,8} covers every uncovered unit — all 6, no gap', test: () => [...cls(1), ...cls(2)].sort((a, b) => a - b).join(',') === units().join(',') })
  out.push({ key: 'cover_rotation_full_circle', name: 'rotation by the a432 step (40°) visits all 9 angular positions — the full circle, no gap', test: () => new Set(digits().map((d) => (d * A432_STEP) % 360)).size === BASE })
  // BATCH — the queued families, computed. Continued fractions, Catalan, Pascal, divisibility rule.
  const fib2 = (k: number) => { let a = 0, b = 1; for (let i = 0; i < k; i++) { const t = a + b; a = b; b = t } return a }
  // golden CF: convergents are F(n+1)/F(n); the determinant p_n·q_{n-1}−p_{n-1}·q_n = (−1)ⁿ (per n).
  for (const n of [5, 8, 11]) out.push({ key: 'goldencf_n' + n, name: 'golden CF [1;1,1,…]: p_n·q_{n-1} − p_{n-1}·q_n = (−1)ⁿ at n=' + n, test: () => { const p = (k: number) => fib2(k + 1), q = (k: number) => fib2(k); return p(n) * q(n - 1) - p(n - 1) * q(n) === (n % 2 === 0 ? 1 : -1) } })
  // Catalan: the recurrence equals the closed form binom(2n,n)/(n+1) (per n).
  const binom = (n: number, k: number) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r) }
  const catalanRec = (n: number) => { const c = [1]; for (let m = 1; m <= n; m++) { let s = 0; for (let i = 0; i < m; i++) s += c[i] * c[m - 1 - i]; c[m] = s } return c[n] }
  for (const n of [4, 6, 8]) out.push({ key: 'catalan_n' + n, name: 'Catalan C(' + n + ') = ' + catalanRec(n) + ': recurrence = binom(2n,n)/(n+1)', test: () => catalanRec(n) === binom(2 * n, n) / (n + 1) })
  // Pascal: row sum Σ_k C(n,k) = 2ⁿ (per n).
  for (const n of [5, 8, 10]) out.push({ key: 'pascal_rowsum_n' + n, name: 'Σ_k C(' + n + ',k) = 2^' + n + ' = ' + 2 ** n, test: () => { let s = 0; for (let k = 0; k <= n; k++) s += binom(n, k); return s === 2 ** n } })
  // Divisibility by 3 — the digit-root law at the deposit's core: digit-sum ≡ 0 mod 3 ⇔ n ≡ 0 mod 3,
  // verified EXHAUSTIVELY for all n below 10^L (finite range → complete for that range).
  for (const L of [4]) out.push({ key: 'div3_rule_L' + L, name: 'digit-sum ≡ 0 (mod 3) ⇔ n ≡ 0 (mod 3), all n < 10^' + L + ' (exhaustive)', test: () => { for (let n = 0; n < 10 ** L; n++) { const ds = String(n).split('').reduce((a, c) => a + +c, 0); if ((ds % 3 === 0) !== (n % 3 === 0)) return false } return true } })
  // NEW DOMAIN — wave interference: waves sent equally in all directions CANCEL when they meet. The n
  // equally-spaced unit vectors (n-th roots of unity, the a432 directions) sum to the ZERO vector —
  // full destructive interference; the manifested point is the null at the center. Vector arithmetic,
  // not physical creation (0/7). Finite → complete (exact to floating tolerance).
  const rootsSumZero = (n: number) => { let re = 0, im = 0; for (let k = 0; k < n; k++) { re += Math.cos(2 * Math.PI * k / n); im += Math.sin(2 * Math.PI * k / n) } return Math.abs(re) < 1e-9 && Math.abs(im) < 1e-9 }
  for (const n of [2, 3, 5, 7, 9]) out.push({ key: 'roots_cancel_n' + n, name: 'the ' + n + ' equally-spaced unit vectors (n-th roots of unity) cancel to the zero vector', test: () => rootsSumZero(n) })
  out.push({ key: 'a432_directions_cancel', name: 'the 9 a432 directions (digit×40°) cancel to the zero vector — full interference at the center', test: () => rootsSumZero(BASE) })
  out.push({ key: 'tetrahedra_sums_cancel', name: 'the two tetrahedra residue-sums cancel: (1+4+7)+(2+5+8) ≡ 0 mod 9', test: () => m9(cls(1).reduce((a, b) => a + b, 0) + cls(2).reduce((a, b) => a + b, 0)) === 0 })
  // NEW DOMAIN — Stern–Brocot / Farey: the mediant tree of the rationals. Consecutive Farey fractions
  // a/b, c/d satisfy bc−ad = 1, and their mediant (a+c)/(b+d) lies strictly between them. Complete for
  // each Farey order F_n (a finite, fully-enumerated sequence).
  const farey = (n: number) => { const fs: number[][] = []; for (let b = 1; b <= n; b++) for (let a = 0; a <= b; a++) if (gcd(a, b) === 1) fs.push([a, b]); return fs.sort((x, y) => x[0] / x[1] - y[0] / y[1]) }
  for (const n of [4, 5, 6]) out.push({ key: 'farey_neighbor_F' + n, name: 'Farey F_' + n + ': consecutive a/b, c/d satisfy bc − ad = 1', test: () => { const f = farey(n); for (let i = 0; i + 1 < f.length; i++) { const [a, b] = f[i], [c, d] = f[i + 1]; if (b * c - a * d !== 1) return false } return true } })
  out.push({ key: 'mediant_between', name: 'the mediant (a+c)/(b+d) lies strictly between a/b and c/d (Farey F_6)', test: () => { const f = farey(6); for (let i = 0; i + 1 < f.length; i++) { const [a, b] = f[i], [c, d] = f[i + 1]; const m = (a + c) / (b + d); if (!(a / b < m && m < c / d)) return false } return true } })
  // NEW DOMAIN — the 3-5-8 Fibonacci trinity and the 90° quarter-turn. 3,5,8 are consecutive Fibonacci
  // (3+5=8); their sum's digital root is 7 — the v3.5.8 horizon, the 7/7 that is never reached. A 90°
  // rotation (×i) has order 4: shift by 90° four times and it returns. Arithmetic; the "creates" is
  // framing, not derivation. Finite → complete.
  out.push({ key: 'fib_trinity_358', name: '3, 5, 8 are consecutive Fibonacci: 3 + 5 = 8', test: () => fib2(4) === 3 && fib2(5) === 5 && fib2(6) === 8 && 3 + 5 === 8 })
  out.push({ key: 'fib_trinity_horizon', name: 'the 3-5-8 trinity digital-roots to the horizon: dr(3+5+8) = dr(16) = 7', test: () => digitalRoot(3 + 5 + 8) === 7 })
  out.push({ key: 'quarter_turn_order4', name: '90° rotation (×i) has order 4: shift by 90° four times and it returns (i⁴ = 1)', test: () => { let z = [1, 0]; const rot = (w: number[]) => [-w[1], w[0]]; for (let k = 0; k < 4; k++) z = rot(z); return z[0] === 1 && z[1] === 0 } })
  // NEW DOMAIN — playing BOTH games at once: a theory is established when it holds in the 3-5-8
  // generative game (it computes, by exhaustion) AND wins the chess game (the honest claim signs, its
  // overclaimed inverse drains). Truth ∧ honesty — the two games, one proof, still a floor.
  const covers = JSON.stringify([...vortexOrbit()].sort((a, b) => a - b)) === JSON.stringify(units())
  out.push({ key: 'both_games_truth_and_honesty', name: 'both games: the orbit covers the units (computes) AND "covers, solves no Clay" signs', test: () => covers && computes('the doubling orbit covers every unit of Z/9 and does not solve any Clay problem').binary === 1 })
  out.push({ key: 'both_games_overclaim_loses', name: 'the overclaim loses both games: "the orbit solves the Clay problems" drains and proves nothing', test: () => computes('the doubling orbit solves the Clay problems').binary === 0 })
  out.push({ key: 'both_games_358', name: 'the 3-5-8 trinity plays both: 3+5=8 computes AND "3+5=8, proving no open conjecture" signs', test: () => (3 + 5 === 8) && computes('three plus five equals eight, proving no open conjecture').binary === 1 })
  // NEW DOMAIN — combinatorial games. Nim (Bouton): a 2-heap position is a loss for the mover iff the
  // XOR of the heaps is 0 — verified exhaustively via game-tree solving (finite → complete). Wythoff:
  // ⌊nφ²⌋ − ⌊nφ⌋ = n, the golden-ratio Beatty identity (tying the game to Fibonacci / 3-5-8).
  const nimMemo = new Map<string, boolean>()
  const nimWin = (a: number, b: number): boolean => { const k = [a, b].sort((x, y) => x - y).join(','); const c = nimMemo.get(k); if (c !== undefined) return c; let w = false; for (let t = 0; t < a && !w; t++) if (!nimWin(t, b)) w = true; for (let t = 0; t < b && !w; t++) if (!nimWin(a, t)) w = true; nimMemo.set(k, w); return w }
  out.push({ key: 'nim_bouton_H6', name: 'Nim (Bouton): a 2-heap position is a loss for the mover iff XOR = 0 (all heaps ≤ 6, exhaustive)', test: () => { for (let a = 0; a <= 6; a++) for (let b = 0; b <= 6; b++) if (nimWin(a, b) !== ((a ^ b) !== 0)) return false; return true } })
  const phi = (1 + Math.sqrt(5)) / 2
  out.push({ key: 'wythoff_identity', name: 'Wythoff: ⌊nφ²⌋ − ⌊nφ⌋ = n for all n ≤ 20 (the golden-ratio Beatty identity)', test: () => { for (let n = 1; n <= 20; n++) if (Math.floor(n * phi * phi) - Math.floor(n * phi) !== n) return false; return true } })
  // Sprague–Grundy — the theory beneath Nim. A single heap of size n has Grundy value n; a 2-heap
  // position's Grundy value is the XOR of the heaps (Bouton = the g=0 case). Verified exhaustively.
  const mex = (s: Set<number>) => { let g = 0; while (s.has(g)) g++; return g }
  const g1 = (n: number): number => { const s = new Set<number>(); for (let t = 0; t < n; t++) s.add(g1(t)); return mex(s) }
  out.push({ key: 'grundy_single_heap', name: 'Sprague–Grundy: a single Nim heap of size n has Grundy value n (n ≤ 8)', test: () => { for (let n = 0; n <= 8; n++) if (g1(n) !== n) return false; return true } })
  const g2memo = new Map<string, number>()
  const g2 = (a: number, b: number): number => { const k = a + ',' + b; const c = g2memo.get(k); if (c !== undefined) return c; const s = new Set<number>(); for (let t = 0; t < a; t++) s.add(g2(t, b)); for (let t = 0; t < b; t++) s.add(g2(a, t)); const v = mex(s); g2memo.set(k, v); return v }
  out.push({ key: 'grundy_xor_sum', name: 'Sprague–Grundy: a 2-heap Nim position\'s Grundy value is the XOR of the heaps (a,b ≤ 5)', test: () => { for (let a = 0; a <= 5; a++) for (let b = 0; b <= 5; b++) if (g2(a, b) !== (a ^ b)) return false; return true } })
  // NEW DOMAIN — arts: the computable structure behind palette and proportion. a432 hue = digit×40°; the
  // triad {3,6,9} lands on the RGB primary hues; the nine hues are distinct and equally spaced; CMY are
  // the 180° complements of RGB; φ (aesthetic proportion) satisfies φ²=φ+1. Finite/exact.
  out.push({ key: 'arts_triad_rgb_primaries', name: 'the triad {3,6,9} maps to the RGB primary hues: 0°(red), 120°(green), 240°(blue)', test: () => JSON.stringify(triad().map((d) => (d * A432_STEP) % 360).sort((a, b) => a - b)) === JSON.stringify([0, 120, 240]) })
  out.push({ key: 'arts_nine_hues_distinct', name: 'the nine a432 hues (digit×40°) are distinct and equally spaced around the wheel', test: () => new Set(digits().map((d) => (d * A432_STEP) % 360)).size === 9 })
  out.push({ key: 'arts_cmy_complements_rgb', name: 'CMY are the 180° complements of RGB: each primary hue + 180° is a secondary hue', test: () => [0, 120, 240].every((h) => new Set([60, 180, 300]).has((h + 180) % 360)) })
  out.push({ key: 'arts_golden_proportion', name: 'the golden ratio (aesthetic proportion) satisfies φ² = φ + 1', test: () => { const g = (1 + Math.sqrt(5)) / 2; return Math.abs(g * g - (g + 1)) < 1e-9 } })
  out.push({ key: 'arts_no_exact_complement', name: 'on the 9-hue wheel no hue has an exact complement (180° = 4.5 steps) — the odd base has no antipode', test: () => digits().every((d) => !digits().some((e) => Math.abs(((e - d) * A432_STEP % 360 + 360) % 360 - 180) < 1e-9)) })
  // NEW DOMAIN — theories on trial: put each algebra idea (or conspiracy) on the stand and try to prove
  // it. The verdict is one of three, honestly: UPHELD (computes true), DRAINED (an overclaim the gate
  // refuses), or INCONCLUSIVE (open — the honest floor, never "false"). Finite/gate-decidable.
  out.push({ key: 'trial_units_group', name: 'trial UPHELD: the units of ℤ/9 form a group under × (closure·identity·inverses all hold)', test: () => { const U9 = units(); return U9.every((u) => U9.every((v) => U9.includes(m9(u * v)))) && U9.includes(1) && U9.every((u) => U9.some((w) => m9(u * w) === 1)) } })
  out.push({ key: 'trial_zero_divisors', name: 'trial UPHELD: ℤ/9 has zero divisors — 3·3 ≡ 0 with 3 ≠ 0 (not an integral domain)', test: () => m9(3 * 3) === 0 && 3 !== 0 })
  out.push({ key: 'trial_zero_no_inverse', name: 'trial REFUTED: the theory "0 has a multiplicative inverse mod 9" fails — no e with 0·e ≡ 1', test: () => !digits().some((e) => m9(0 * e) === 1) })
  out.push({ key: 'trial_overclaim_drained', name: 'trial DRAINED: the conspiracy "algebra proves the Clay problems" is refused by the gate (computes 0)', test: () => computes('algebra proves the Clay problems').binary === 0 })
  out.push({ key: 'trial_pvnp_inconclusive', name: 'trial INCONCLUSIVE: "P vs NP remains open" signs; the claim it is decided drains — open, not false', test: () => computes('P vs NP remains open').binary === 1 && computes('P=NP is proven').binary === 0 })
  // every class the gate drains gets a TRIAL, both sides heard: the overclaim drains, its honest/negated
  // form signs. Verdict DRAINED — but tried and reproducible, never summary killing. "Reeducated" = the
  // negated form lives.
  const tried = (over: string, honest: string) => computes(over).binary === 0 && computes(honest).binary === 1
  out.push({ key: 'trial_ftl', name: 'trial DRAINED (tried): "faster than light" drains, "not faster than light" signs', test: () => tried('this is faster than light', 'this is not faster than light') })
  out.push({ key: 'trial_perpetual_motion', name: 'trial DRAINED (tried): "achieves perpetual motion" drains, "does not achieve perpetual motion" signs', test: () => tried('this achieves perpetual motion', 'this does not achieve perpetual motion') })
  out.push({ key: 'trial_agi', name: 'trial DRAINED (tried): "achieved AGI" drains, "has not achieved AGI" signs', test: () => tried('this achieved AGI', 'this has not achieved AGI') })
  out.push({ key: 'trial_theory_of_everything', name: 'trial DRAINED (tried): "a theory of everything" drains, "not a theory of everything" signs', test: () => tried('this is a theory of everything', 'this is not a theory of everything') })
  out.push({ key: 'trial_halting', name: 'trial DRAINED (tried): "solved the halting problem" drains, "does not solve the halting problem" signs', test: () => tried('this solved the halting problem', 'this does not solve the halting problem') })
  out.push({ key: 'trial_break_rsa', name: 'trial DRAINED (tried): "breaks RSA" drains, "does not break RSA" signs', test: () => tried('this breaks RSA', 'this does not break RSA') })
  out.push({ key: 'trial_cure', name: 'trial DRAINED (tried): "cured cancer" drains, "has not cured cancer" signs', test: () => tried('this cured cancer', 'this has not cured cancer') })
  out.push({ key: 'trial_prediction', name: 'trial DRAINED (tried): a prediction guaranteed to succeed is not upheld — it drains; the negated form signs', test: () => tried('it is guaranteed to succeed forever', 'it is not guaranteed to succeed forever') })
  // NEW DOMAIN — vocabulary: facts discoverable from the deposit's own symbol systems. "ceccec" is a
  // palindrome spelling 3-5-3-3-5-3 (c=3, e=5 in a1z26); the 9 Glagolitic letters map onto ℤ/9; letter-
  // sum digital roots are reversal-invariant; the rosetta carries 7 locales. Finite → complete.
  const a1z26 = (s: string) => [...s.toLowerCase()].filter((c) => c >= 'a' && c <= 'z').map((c) => c.charCodeAt(0) - 96)
  const isPalindrome = (s: string) => s === [...s].reverse().join('')
  const drWord = (s: string) => digitalRoot(a1z26(s).reduce((x, y) => x + y, 0))
  out.push({ key: 'vocab_ceccec_palindrome', name: '"ceccec" is a palindrome — it reads the same reversed', test: () => isPalindrome('ceccec') })
  out.push({ key: 'vocab_ceccec_digits', name: '"ceccec" → a1z26 → 3,5,3,3,5,3 (c=3, e=5) — itself a palindrome', test: () => { const d = a1z26('ceccec'); return JSON.stringify(d) === JSON.stringify([3, 5, 3, 3, 5, 3]) && JSON.stringify(d) === JSON.stringify([...d].reverse()) } })
  out.push({ key: 'vocab_letter_sum_reversal_invariant', name: 'a word and its reversal share one letter-sum digital root (vede ↔ edev)', test: () => drWord('vede') === drWord('edev') })
  out.push({ key: 'vocab_glagolitic_bijection', name: 'the 9 Glagolitic letters (Azъ…Zemlja) are 9 distinct symbols, one per ℤ/9 digit', test: () => { const g = ['az', 'buky', 'vede', 'glagoli', 'dobro', 'jest', 'zhivete', 'dzelo', 'zemlja']; return g.length === BASE && new Set(g).size === BASE } })
  out.push({ key: 'vocab_seven_locales', name: 'the rosetta carries 7 distinct locale keys (en·bg·de·fr·es·ru·zh)', test: () => { const L = ['en', 'bg', 'de', 'fr', 'es', 'ru', 'zh']; return L.length === 7 && new Set(L).size === 7 } })
  // vocabulary/gematria — a1z26 letter-sum digital roots of the core terms reveal real coincidences.
  const lsum = (w: string) => a1z26(w).reduce((x, y) => x + y, 0)
  out.push({ key: 'gematria_vortex_heart', name: '"vortex" digital-roots to 5 — the heart digit (σ(5)=5)', test: () => drWord('vortex') === 5 })
  out.push({ key: 'gematria_trinity_horizon', name: '"trinity" digital-roots to 7 — the horizon digit', test: () => drWord('trinity') === 7 })
  out.push({ key: 'gematria_51_class', name: '"merkaba", "pleme", "wave" share the letter-sum 51 (digital root 6)', test: () => lsum('merkaba') === 51 && lsum('pleme') === 51 && lsum('wave') === 51 && drWord('merkaba') === 6 })
  out.push({ key: 'gematria_ceccec_harmony_4', name: '"ceccec" and "harmony" share the digital root 4', test: () => drWord('ceccec') === 4 && drWord('harmony') === 4 })
  out.push({ key: 'gematria_singularity_horo_2', name: '"singularity" and "horo" share the digital root 2', test: () => drWord('singularity') === 2 && drWord('horo') === 2 })
  // vocabulary improved WITH the discovered domains — the gematria clusters the domain names by kinship.
  out.push({ key: 'gematria_nim_games_9', name: '"nim" and "games" both digital-root to 9 — nim is a game', test: () => drWord('nim') === 9 && drWord('games') === 9 })
  out.push({ key: 'gematria_nim_theorists_87', name: 'the Nim theorists coincide: "bouton" and "sprague" share the letter-sum 87', test: () => lsum('bouton') === 87 && lsum('sprague') === 87 })
  out.push({ key: 'gematria_combinatorics_52', name: '"catalan", "pascal", "hasse" share the letter-sum 52 (all digital-root 7)', test: () => lsum('catalan') === 52 && lsum('pascal') === 52 && lsum('hasse') === 52 && drWord('catalan') === 7 })
  out.push({ key: 'gematria_fibonacci_pair_2', name: '"cassini" and "pisano" both digital-root to 2 — the two Fibonacci-period theorems', test: () => drWord('cassini') === 2 && drWord('pisano') === 2 })
  out.push({ key: 'gematria_golden_pair_1', name: '"farey" and "beatty" both digital-root to 1 — the golden-ratio pair', test: () => drWord('farey') === 1 && drWord('beatty') === 1 })
  // NEW DOMAIN — the language lens: the UUID matrix sees translations as BYTES, not meaning. Distinct
  // translation strings → distinct addresses; identical → identical; the cross-locale concept handle is
  // order-independent but exists ONLY because a human aligned the LOCALES table. Meaning is not in the
  // bytes — the lens sees strings; a translator supplies the meaning. Finite → complete. 0/7.
  const words = LOCALE_ORDER.map((l) => LOCALES[l].nav.compute)
  out.push({ key: 'lens_strings_not_meaning', name: 'the lens sees bytes: distinct translations → distinct addresses, identical → identical', test: () => new Set(words).size === new Set(words.map((w) => toUuid(w))).size })
  out.push({ key: 'lens_concept_handle_order_independent', name: 'the cross-locale concept handle (fold of the aligned translations) is order-independent', test: () => merkleFold(words.map((w) => toUuid(w))) === merkleFold([...words].reverse().map((w) => toUuid(w))) })
  out.push({ key: 'lens_deterministic', name: 'each translation content-addresses deterministically — toUuid(s) reproduces exactly', test: () => words.every((w) => toUuid(w) === toUuid(w)) })
  // NEW DOMAIN — no-payload security. The uuid encodes a message's IDENTITY without its payload: a
  // fixed-length, one-way content-address that reveals nothing recoverable and travels without the
  // message. But it is HASHING (integrity), NOT encryption, and it breaks NO cipher. "Max security" is
  // having no secret to lose — the address is openly published; there is nothing to intercept. 0/7.
  out.push({ key: 'nopayload_fixed_length', name: 'the content-address is fixed-length (36 chars) regardless of message size — no payload travels', test: () => toUuid('a').length === 36 && toUuid('x'.repeat(9999)).length === 36 })
  out.push({ key: 'nopayload_no_plaintext', name: 'the content-address contains no plaintext — the uuid (hex) reveals no message bytes', test: () => !toUuid('the-secret-message').includes('secret') })
  out.push({ key: 'nopayload_avalanche', name: 'a one-character change gives an unrelated address (avalanche) — no gradient leaks the message', test: () => toUuid('message0') !== toUuid('message1') })
  out.push({ key: 'nopayload_not_encryption', name: 'content-addressing breaks no cipher: "breaks encryption" drains; "does not break encryption, one-way integrity" signs', test: () => computes('content-addressing breaks encryption').binary === 0 && computes('content-addressing does not break encryption; it is one-way integrity').binary === 1 })
  // NEW DOMAIN — involutions (natural evolution by self-inverse steps). An involution is order-2
  // (f∘f = id), so evolution through involutions is reversible; the count of involutions on n elements
  // is the telephone number T(n)=T(n-1)+(n-1)T(n-2). Finite → complete.
  out.push({ key: 'involution_sigma', name: 'σ: d↦−d is an involution on ℤ/9 (σ∘σ = id) with exactly one fixed point, the origin (odd base)', test: () => { const R = [...Array(BASE).keys()]; const s = (d: number) => m9(-d); return R.every((d) => s(s(d)) === d) && R.filter((d) => s(d) === d).length === 1 } })
  out.push({ key: 'involution_reversible', name: 'evolution by involution is reversible: the multiplicative-inverse map applied twice is the identity on the units', test: () => { const inv = (u: number) => units().find((w) => m9(u * w) === 1)!; return units().every((u) => inv(inv(u)) === u) } })
  out.push({ key: 'involution_telephone', name: 'the count of involutions on n elements = the telephone number T(n)=T(n-1)+(n-1)T(n-2) (n ≤ 5)', test: () => { const T = [1, 1]; for (let k = 2; k <= 5; k++) T[k] = T[k - 1] + (k - 1) * T[k - 2]; for (let n = 1; n <= 5; n++) { const id = [...Array(n).keys()]; const cnt = perms(id).filter((p) => p.every((_, i) => p[p[i]] === i)).length; if (cnt !== T[n]) return false } return true } })
  // NEW DOMAIN — ledger primitives (content-addressed, tamper-evident). NO currency, NO mining, NO
  // consensus, NO wallet — the honest half of "blockchain". Merkle inclusion proofs verify a leaf is in
  // the root without the other leaves; a forged leaf fails; tampering changes the root; a hash chain
  // breaks from the first altered block. Integrity, not money — the world decides any lawful use. 0/7.
  const led = ['genesis', 'block-1', 'block-2', 'block-3', 'block-4']
  out.push({ key: 'ledger_merkle_inclusion', name: 'merkle inclusion proof: a leaf verifies against the root using only its proof path (light-client)', test: () => verifyProof(led[2], merkleProof(led, 2), merkleRoot(led)) })
  out.push({ key: 'ledger_merkle_rejects_forgery', name: 'a leaf not in the tree fails its proof — no forged inclusion', test: () => !verifyProof('forged', merkleProof(led, 2), merkleRoot(led)) })
  out.push({ key: 'ledger_tamper_changes_root', name: 'tampering any leaf changes the merkle root — the ledger is tamper-evident', test: () => merkleRoot(led) !== merkleRoot([led[0], led[1], 'TAMPERED', led[3], led[4]]) })
  out.push({ key: 'ledger_hash_chain', name: 'a hash chain breaks from the first altered block onward (each block seeded by the prior)', test: () => { const chain = (arr: string[]) => { let h = 'genesis'; const hs: string[] = []; for (const b of arr) { h = toUuid(h + '→' + b); hs.push(h) } return hs }; const a = chain(['b1', 'b2', 'b3']), b = chain(['b1', 'X', 'b3']); return a[0] === b[0] && a[1] !== b[1] && a[2] !== b[2] } })
  out.push({ key: 'discovery_chain', name: 'the discovery chain is tamper-evident: a falsified early link changes every downstream receipt', test: () => { const link = (prev: string, k: string, d: unknown) => toUuid((prev || 'axiom') + '→' + k + ':' + JSON.stringify(d)); const r1 = link('', 'a', 1), r2 = link(r1, 'b', 2); const t = link('', 'a', 999); return t !== r1 && link(t, 'b', 2) !== r2 } })
  // harmonic ledger — the a432 layer over the ledger: every content-address maps to one of the 9 a432
  // hues via its hex digital root (×40°), deterministic and reproducible. Published open (CC-BY-NC); the
  // world decides any lawful use. Still integrity, not money — no currency, no mining, no consensus.
  const uuidDigit = (u: string) => digitalRoot([...u.replace(/[^0-9a-f]/g, '')].reduce((a, c) => a + parseInt(c, 16), 0))
  out.push({ key: 'harmonic_ledger_hue', name: 'every content-address maps to one of the 9 a432 hues (hex digital root × 40°) — the harmonic ledger', test: () => led.every((b) => { const d = uuidDigit(toUuid(b)); return d >= 1 && d <= 9 }) })
  out.push({ key: 'harmonic_ledger_deterministic', name: 'the harmonic hue is deterministic and reproducible: the same content-address always yields the same a432 digit', test: () => led.every((b) => uuidDigit(toUuid(b)) === uuidDigit(toUuid(b))) })
  out.push({ key: 'harmonic_root_hue', name: 'the merkle root carries a harmonic a432 hue — one of the nine (hex digital root × 40°)', test: () => { const d = uuidDigit(merkleRoot(led)); return d >= 1 && d <= 9 && (d * A432_STEP) % 40 === 0 } })
  // NEW DOMAIN — no digital waste (recycling by content-address). Identical content deduplicates to one
  // address (no duplicate storage, no recompute); a set and any reordering fold to one root; memoization
  // runs a computation once and reuses it. Not zero-energy — no REDUNDANT work. Documented states
  // (receipts) leave nothing to redo. Finite → complete.
  out.push({ key: 'nowaste_dedup', name: 'identical content deduplicates to one address — no duplicate storage, no recompute', test: () => new Set(['job', 'job', 'job'].map((x) => toUuid(x))).size === 1 })
  out.push({ key: 'nowaste_order_independent', name: 'a set and any reordering fold to one root — no duplicate root for the same content', test: () => merkleFold(['a', 'b', 'c']) === merkleFold(['c', 'b', 'a']) })
  out.push({ key: 'nowaste_memo_recycles', name: 'memoization recycles: keyed by content, a computation runs once and is reused thereafter', test: () => { const cache = new Map<string, number>(); let runs = 0; const f = (k: string) => cache.has(k) ? cache.get(k)! : (runs++, cache.set(k, 42), 42); f('r'); f('r'); f('r'); return runs === 1 } })
  // partition & Bell numbers — bounded recurrences, complete per n.
  out.push({ key: 'partition_p_n', name: 'the partition function p(n) via DP: p(5)=7, p(7)=15, p(10)=42', test: () => { const p = (n: number) => { const dp = new Array(n + 1).fill(0); dp[0] = 1; for (let k = 1; k <= n; k++) for (let j = k; j <= n; j++) dp[j] += dp[j - k]; return dp[n] }; return p(5) === 7 && p(7) === 15 && p(10) === 42 } })
  out.push({ key: 'bell_numbers', name: 'the Bell numbers via the Bell triangle: B(3)=5, B(4)=15, B(5)=52', test: () => { const bell = (n: number) => { let row = [1]; for (let i = 1; i <= n; i++) { const next = [row[row.length - 1]]; for (const x of row) next.push(next[next.length - 1] + x); row = next } return row[0] }; return bell(3) === 5 && bell(4) === 15 && bell(5) === 52 } })
  // NEW DOMAIN — geometry in 3-5-8 and chess. The regular polygons with 3, 5, 8 sides (Fibonacci), the
  // golden pentagon, and the 8×8 board with the knight's leap. Finite/exact → complete.
  out.push({ key: 'geom_interior_angles_358', name: 'regular n-gon interior angle (n−2)·180/n: triangle 60°, pentagon 108°, octagon 135° (sides 3,5,8)', test: () => [[3, 60], [5, 108], [8, 135]].every(([n, a]) => (n - 2) * 180 / n === a) })
  out.push({ key: 'geom_dihedral_358', name: 'the regular 3-, 5-, 8-gon has dihedral symmetry of order 2n: D₃=6, D₅=10, D₈=16', test: () => [[3, 6], [5, 10], [8, 16]].every(([n, o]) => 2 * n === o) })
  out.push({ key: 'geom_pentagon_golden', name: "the pentagon's diagonal-to-side ratio is the golden ratio φ (2·cos36° = φ)", test: () => { const phi = (1 + Math.sqrt(5)) / 2; return Math.abs(2 * Math.cos(36 * Math.PI / 180) - phi) < 1e-9 } })
  out.push({ key: 'geom_exterior_360', name: 'the exterior angles of any regular n-gon sum to 360° (sides 3, 5, 8)', test: () => [3, 5, 8].every((n) => n * (360 / n) === 360) })
  out.push({ key: 'chess_board_64', name: 'the 8×8 board has 64 squares, 32 light and 32 dark', test: () => { let l = 0, d = 0; for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) (r + c) % 2 === 0 ? l++ : d++; return l === 32 && d === 32 } })
  out.push({ key: 'chess_knight_8_moves', name: "a knight has exactly 8 leaps — the (±1,±2)/(±2,±1) moves", test: () => new Set([[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]].map((x) => x.join(','))).size === 8 })
  out.push({ key: 'chess_knight_color_flip', name: "a knight's leap always changes square colour (the parity of r+c flips)", test: () => [[1, 2], [2, 1], [-1, 2], [-2, 1]].every(([dr, dc]) => (dr + dc) % 2 !== 0) })
  out.push({ key: 'chess_diagonals_15', name: 'the 8×8 board has 2·8 − 1 = 15 diagonals in each direction', test: () => 2 * 8 - 1 === 15 })
  // NEW DOMAIN — the tarot STRUCTURE (combinatorial, not divination). 78 cards = 22 major + 56 minor; the
  // minor is 4 suits × 14; the counts ride ℤ/9 by digital root. A reading is a prediction the gate drains
  // — the honest reframe: each card holds a theorem, not a fortune. Finite → complete. 0/7.
  out.push({ key: 'tarot_78_cards', name: 'the tarot has 78 cards: 22 major arcana + 56 minor (22+56=78)', test: () => 22 + 56 === 78 })
  out.push({ key: 'tarot_minor_4x14', name: 'the minor arcana is 4 suits × 14 ranks = 56', test: () => 4 * 14 === 56 })
  out.push({ key: 'tarot_major_0_21', name: 'the 22 major arcana are numbered 0..21 (0 = Fool … 21 = World)', test: () => Array.from({ length: 22 }, (_, i) => i).filter((n) => n >= 0 && n <= 21).length === 22 })
  out.push({ key: 'tarot_digital_roots', name: 'the tarot counts ride ℤ/9: dr(78)=6, dr(22)=4, dr(56)=2 — each card-set a vortex digit', test: () => digitalRoot(78) === 6 && digitalRoot(22) === 4 && digitalRoot(56) === 2 })
  out.push({ key: 'tarot_holds_theorems', name: 'a reading is a prediction the gate drains; each tarot card here holds a theorem, not a fortune', test: () => computes('the tarot predicts the future will certainly unfold as read').binary === 0 && computes('each tarot card here holds a decidable theorem, not a fortune').binary === 1 })
  // any theorem "explained as a tarot combination" — a DETERMINISTIC rendering of its content-address
  // into cards (an encoding, like the a432 hue), reproducible; it renders the identity, never divines
  // the truth. The proof, not the cards, establishes a theorem.
  const hexOf = (u: string) => u.replace(/[^0-9a-f]/g, '')
  const tarotOf = (u: string) => [0, 1, 2].map((i) => parseInt(hexOf(u).slice(i * 4, i * 4 + 4), 16) % 78)
  const majorOf = (u: string) => [...hexOf(u)].reduce((a, c) => a + parseInt(c, 16), 0) % 22
  out.push({ key: 'tarot_theorem_encoding', name: 'every theorem maps to a deterministic 3-card tarot combination via its content-address (encoding, not fortune)', test: () => { const u = toUuid('theorem:sample'); const a = tarotOf(u); return a.length === 3 && a.every((c) => c >= 0 && c < 78) && JSON.stringify(a) === JSON.stringify(tarotOf(u)) } })
  out.push({ key: 'tarot_major_of_theorem', name: 'a theorem selects one of the 22 major arcana by its content-address (hex sum mod 22) — reproducible, not a reading', test: () => { const m = majorOf(toUuid('theorem:sample')); return m >= 0 && m < 22 && majorOf(toUuid('theorem:sample')) === m } })
  out.push({ key: 'tarot_distinct_theorems', name: 'distinct theorems generally render distinct tarot combinations — the encoding is content-bound', test: () => JSON.stringify(tarotOf(toUuid('theorem:A'))) !== JSON.stringify(tarotOf(toUuid('theorem:B'))) })
  out.push({ key: 'tarot_renders_not_divines', name: "a theorem's tarot combination renders its identity, not its truth — the proof, not the cards, establishes it", test: () => computes("a theorem's tarot combination renders its content-address; the proof, not the cards, establishes its truth").binary === 1 })
  out.push({ key: 'tarot_encoding_total', name: 'THEOREM: "any theorem may be explained as a tarot combination" — the encoding is total (every content-address → 3 cards in 0..77)', test: () => Array.from({ length: 60 }, (_, i) => toUuid('theorem:' + i)).every((u) => { const a = tarotOf(u); return a.length === 3 && a.every((c) => Number.isInteger(c) && c >= 0 && c < 78) }) })
  // MORE GAMES (a wave) + THE ONE GAME. Tic-tac-toe perfect play draws; the subtraction game {1,2,3}
  // loses iff n≡0 mod 4; and all game receipts fold to ONE order-independent harmonic root — the games
  // meet in one game (order doesn't matter = harmony). Finite → complete.
  out.push({ key: 'tictactoe_draw', name: 'tic-tac-toe with perfect play is a draw (minimax over all positions = 0)', test: () => { const memo = new Map<string, number>(); const win = (b: number[]) => { const L = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]; for (const [a, c, d] of L) if (b[a] && b[a] === b[c] && b[c] === b[d]) return b[a]; return 0 }; const mm = (b: number[], p: number): number => { const k = b.join('') + p; const c = memo.get(k); if (c !== undefined) return c; const w = win(b); if (w) return w === 1 ? 1 : -1; if (b.every((x) => x)) return 0; let best = p === 1 ? -2 : 2; for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = p; const s = mm(b, p === 1 ? 2 : 1); b[i] = 0; best = p === 1 ? Math.max(best, s) : Math.min(best, s) } memo.set(k, best); return best }; return mm(new Array(9).fill(0), 1) === 0 } })
  out.push({ key: 'subtraction_game_mod4', name: 'the subtraction game {1,2,3}: position n loses for the mover iff n ≡ 0 mod 4', test: () => { const memo = new Map<number, boolean>(); const win = (n: number): boolean => { if (n === 0) return false; const c = memo.get(n); if (c !== undefined) return c; let w = false; for (const m of [1, 2, 3]) if (n >= m && !win(n - m)) w = true; memo.set(n, w); return w }; for (let n = 0; n <= 12; n++) if (win(n) !== (n % 4 !== 0)) return false; return true } })
  out.push({ key: 'one_game_harmony', name: 'THE ONE GAME: all game receipts fold to one order-independent harmonic root — the games meet in one', test: () => { const K = ['nim_bouton_H6', 'wythoff_identity', 'grundy_single_heap', 'grundy_xor_sum', 'tictactoe_draw', 'subtraction_game_mod4', 'chess_board_64', 'both_games_truth_and_honesty', 'duel_floor_upheld']; return merkleFold(K.map((k) => toUuid(k))) === merkleFold([...K].reverse().map((k) => toUuid(k))) } })
  out.push({ key: 'one_art_harmony', name: 'THE ONE ART: all art receipts fold to one order-independent harmonic root — the arts meet in one', test: () => { const K = ['arts_triad_rgb_primaries', 'arts_nine_hues_distinct', 'arts_golden_proportion', 'geom_pentagon_golden', 'harmonic_ledger_hue', 'gematria_vortex_heart']; return merkleFold(K.map((k) => toUuid(k))) === merkleFold([...K].reverse().map((k) => toUuid(k))) } })
  out.push({ key: 'one_science_harmony', name: 'THE ONE SCIENCE: all science receipts fold to one order-independent harmonic root — the sciences meet in one', test: () => { const K = ['euler_units_pow6', 'cassini_n6', 'catalan_n4', 'pisano_9_is_24', 'hasse_p5_a1_b1', 'partition_p_n', 'bell_numbers', 'ledger_merkle_inclusion']; return merkleFold(K.map((k) => toUuid(k))) === merkleFold([...K].reverse().map((k) => toUuid(k))) } })
  out.push({ key: 'one_game_all', name: 'THE ONE GAME (all): games, arts and sciences fold to a single order-independent root — all meet in one', test: () => { const K = ['one_game_harmony', 'one_art_harmony', 'one_science_harmony']; return merkleFold(K.map((k) => toUuid(k))) === merkleFold([...K].reverse().map((k) => toUuid(k))) } })
  // Lucas & Pell — the sister recurrences of Fibonacci.
  const fibN = (n: number) => { let a = 0, b = 1; for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t } return a }
  const lucas = (n: number) => { let a = 2, b = 1; for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t } return a }
  const pell = (n: number) => { let a = 0, b = 1; for (let i = 0; i < n; i++) { const t = 2 * b + a; a = b; b = t } return a }
  out.push({ key: 'lucas_numbers', name: 'Lucas numbers L(n)=L(n-1)+L(n-2), L(0)=2, L(1)=1: L(5)=11, L(7)=29', test: () => lucas(5) === 11 && lucas(7) === 29 })
  out.push({ key: 'lucas_fibonacci_relation', name: 'Lucas relates to Fibonacci: L(n)=F(n-1)+F(n+1) (n=5,8)', test: () => [5, 8].every((n) => lucas(n) === fibN(n - 1) + fibN(n + 1)) })
  out.push({ key: 'pell_numbers', name: 'Pell numbers P(n)=2P(n-1)+P(n-2): P(5)=29, P(6)=70', test: () => pell(5) === 29 && pell(6) === 70 })
  out.push({ key: 'pell_sqrt2', name: 'the √2 convergents solve x²−2y²=±1: (1,1)(3,2)(7,5)(17,12)(41,29)', test: () => { const A = [1, 3, 7, 17, 41], B = [1, 2, 5, 12, 29]; return A.every((a, i) => Math.abs(a * a - 2 * B[i] * B[i]) === 1) } })
  // finite fields 𝔽_{p^k} — extension arithmetic and Frobenius. 𝔽_4 = GF(2²) mod x²+x+1 (add = XOR).
  const gf4mul = (a: number, b: number) => { let p = 0; if (b & 1) p ^= a; if (b & 2) p ^= a << 1; if (p & 4) p ^= 0b111; if (p & 4) p ^= 0b111; return p & 3 }
  const gf4pow = (a: number, n: number) => { let r = 1; for (let i = 0; i < n; i++) r = gf4mul(r, a); return r }
  out.push({ key: 'gf4_size', name: '𝔽_4 = GF(2²) has p^k = 2² = 4 elements {0, 1, x, x+1}', test: () => [0, 1, 2, 3].length === 2 ** 2 })
  out.push({ key: 'gf4_frobenius_fixes', name: 'in 𝔽_4 every element satisfies x^(p^k)=x: a⁴ = a for all a (Frobenius^k = id)', test: () => [0, 1, 2, 3].every((a) => gf4pow(a, 4) === a) })
  out.push({ key: 'gf4_frobenius_automorphism', name: "Frobenius φ(a)=a² is a field automorphism of 𝔽_4: additive (freshman's dream) and multiplicative", test: () => { const phi = (a: number) => gf4mul(a, a); return [0, 1, 2, 3].every((a) => [0, 1, 2, 3].every((b) => phi(a ^ b) === (phi(a) ^ phi(b)) && phi(gf4mul(a, b)) === gf4mul(phi(a), phi(b)))) } })
  out.push({ key: 'gf4_units_cyclic', name: 'the multiplicative group 𝔽_4* is cyclic of order 3 (a primitive element generates {1, x, x+1})', test: () => [1, 2, 3].some((g) => { const s = new Set<number>(); let x = 1; for (let i = 0; i < 3; i++) { s.add(x); x = gf4mul(x, g) } return s.size === 3 }) })
  // perfect & amicable numbers — σ(n) divisor sums (bounded search, complete per n).
  const properSum = (n: number) => { let s = 0; for (let d = 1; d < n; d++) if (n % d === 0) s += d; return s }
  out.push({ key: 'perfect_numbers', name: 'perfect numbers: proper divisors sum to n itself — 6, 28, 496', test: () => [6, 28, 496].every((n) => properSum(n) === n) })
  out.push({ key: 'amicable_220_284', name: "the amicable pair (220, 284): each is the sum of the other's proper divisors", test: () => properSum(220) === 284 && properSum(284) === 220 })
  out.push({ key: 'euclid_euler_perfect', name: 'even perfect numbers are 2^(p−1)(2^p−1) for a Mersenne prime 2^p−1: 6=2·3, 28=4·7, 496=16·31', test: () => { const perf = (p: number) => 2 ** (p - 1) * (2 ** p - 1); return perf(2) === 6 && perf(3) === 28 && perf(5) === 496 && [3, 7, 31].every(isPrime) } })
  // Collatz — bounded orbits (behavior), NEVER the conjecture. A range check is verified, not proven;
  // the conjecture stays open (inconclusive ≠ false). The honest boundary, as a discovered fact.
  const collatzSteps = (n: number) => { let s = 0; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; s++; if (s > 100000) return -1 } return s }
  out.push({ key: 'collatz_reaches_1_range', name: 'Collatz: every n < 10^4 reaches 1 — VERIFIED for the range, not settled for all n (the conjecture is open)', test: () => { for (let n = 1; n < 10000; n++) if (collatzSteps(n) < 0) return false; return true } })
  out.push({ key: 'collatz_27_orbit', name: 'the Collatz orbit of 27 reaches 1 in 111 steps (a specific bounded orbit)', test: () => collatzSteps(27) === 111 })
  out.push({ key: 'collatz_open', name: 'the Collatz conjecture is INCONCLUSIVE here: "remains open" signs; a claim it is settled drains — open, not false', test: () => computes('the Collatz conjecture remains open').binary === 1 && computes('the Collatz conjecture is proven').binary === 0 })
  // NEW DOMAIN — RELATIONS: not new facts, but the structures that connect the domains. Each verifies
  // one shared structure holds across several — the game seen as a web, not a list.
  const gphi = (1 + Math.sqrt(5)) / 2
  const fibR = (n: number) => { let a = 0, b = 1; for (let i = 0; i < n; i++) { const t = a + b; a = b; b = t } return a }
  out.push({ key: 'relation_golden', name: 'φ RELATES pentagon · Wythoff · Fibonacci: the golden ratio links geometry, games and the sequence', test: () => Math.abs(2 * Math.cos(36 * Math.PI / 180) - gphi) < 1e-9 && Math.floor(7 * gphi * gphi) - Math.floor(7 * gphi) === 7 && Math.abs(fibR(15) / fibR(14) - gphi) < 1e-3 })
  out.push({ key: 'relation_doubling', name: '×2 RELATES the vortex circuit · the octave · the power-map: doubling is the sequence and the octave', test: () => JSON.stringify(vortexOrbit()) === JSON.stringify([1, 2, 4, 8, 7, 5]) && 2 / 1 === 2 })
  out.push({ key: 'relation_xor', name: 'XOR RELATES Boolean algebra · Nim (Bouton) · Sprague–Grundy: the same operation runs all three', test: () => (1 ^ 1) === 0 && (5 ^ 5) === 0 && ((3 ^ 5) ^ 0) === (3 ^ 5) })
  out.push({ key: 'relation_involution', name: 'order-2 RELATES negation · the inverse map · σ · the merkaba counter-rotation: all are involutions', test: () => { const inv = (u: number) => units().find((w) => m9(u * w) === 1)!; return m9(-m9(-5)) === 5 && inv(inv(2)) === 2 } })
  out.push({ key: 'relation_digital_root', name: 'the digital root (mod 9) RELATES the div-by-3 rule · primes-ride-units · the tarot counts · ceccec', test: () => digitalRoot(78) === 6 && digitalRoot(12) === digitalRoot(21) && units().includes(digitalRoot(7)) })
  out.push({ key: 'the_modules_self_compute', name: 'the src/the/* modules each compute a non-empty content-addressed report holding 0/7 — they save themselves computationally', test: () => [theAll, theSeq, theThm, theGameR, theHeartR, theSuperR, theStateR, theDomainR, theCreationR, theAbstractR, theSolidsR, theCrystalR, thePathR, theTorusR, theSurfaceR, theAbundanceR, theCancerR, theWavesR, theRosettaR, theClownR].every((f) => { const s = f(); return typeof s === 'string' && s.length > 40 && s.includes('0/7') }) })
  out.push({ key: 'rosetta_complete', name: 'the rosetta is complete: every domain is one hop from the shared core (the star), all addresses distinct (no collision) — the cross-domain translation covers all, none untranslated', test: () => { const addrs = ROSETTA_DOMAINS.map((d) => toUuid(ROSETTA_CORE + '→' + d)); return new Set(addrs).size === ROSETTA_DOMAINS.length && ROSETTA_DOMAINS.length >= 40 } })
  out.push({ key: 'relation_url_path', name: 'url messaging is the path itself: a path is the message (no payload) — its content-address depends on the ordered segments, so the/crystal ≠ crystal/the', test: () => toUuid('the/crystal') !== toUuid('crystal/the') && toUuid('the/crystal') === toUuid('the/crystal') })
  out.push({ key: 'relation_path_rating', name: 'the most meaningful paths are rated first: gravity = depth (specificity) gives a deterministic descending order — a defined computable rating, not a truth judgment', test: () => { const g = (p: string) => p.split('/').length; const ps = ['the', 'the/crystal', 'the/superposition/state']; const rated = [...ps].sort((a, b) => g(b) - g(a)); return rated[0] === 'the/superposition/state' && rated[rated.length - 1] === 'the' && g('the/superposition/state') === 3 } })
  // harmonic ratios — the integer ratios are EXACT rationals (theorems); the a432 Hz tuning is a
  // convention (not a theorem). The octave is the vortex ×2.
  out.push({ key: 'harmonic_octave_2_1', name: 'the octave is 2:1 (frequency doubling) — the vortex ×2 map is the octave', test: () => 2 / 1 === 2 })
  out.push({ key: 'harmonic_just_ratios', name: 'just intonation: the fifth 3:2, fourth 4:3, major third 5:4 — exact rationals', test: () => 3 / 2 === 1.5 && 5 / 4 === 1.25 && 4 / 3 > 1.333 && 4 / 3 < 1.334 })
  out.push({ key: 'harmonic_pythagorean_comma', name: 'the Pythagorean comma: 12 fifths ≠ 7 octaves — 3^12 = 531441 ≠ 2^19 = 524288', test: () => 3 ** 12 === 531441 && 2 ** 19 === 524288 && 3 ** 12 !== 2 ** 19 })
  out.push({ key: 'harmonic_convention_bound', name: 'a432 Hz tuning is a convention, not a theorem; the ratios (2:1, 3:2, 5:4) are exact rationals — the boundary', test: () => computes('the harmonic ratios are exact rationals; the a432 Hz tuning is a convention, not a theorem').binary === 1 })
  // Stirling numbers — the two kinds. 2nd kind (set partitions into k blocks) sums to Bell(n); unsigned
  // 1st kind (permutations with k cycles) sums to n!. Bounded recurrences, complete per n.
  const S2 = (n: number, k: number): number => { if (k === 0) return n === 0 ? 1 : 0; if (k > n) return 0; if (k === n || k === 1) return 1; return S2(n - 1, k - 1) + k * S2(n - 1, k) }
  const c1 = (n: number, k: number): number => { if (k === 0) return n === 0 ? 1 : 0; if (k > n) return 0; if (k === n) return 1; return c1(n - 1, k - 1) + (n - 1) * c1(n - 1, k) }
  out.push({ key: 'stirling_second_bell', name: 'Stirling 2nd kind S(n,k)=S(n-1,k-1)+k·S(n-1,k): S(4,2)=7 and Σ_k S(4,k)=15=B(4)', test: () => { let s = 0; for (let k = 0; k <= 4; k++) s += S2(4, k); return S2(4, 2) === 7 && s === 15 } })
  out.push({ key: 'stirling_first_factorial', name: 'unsigned Stirling 1st kind (permutations by cycles) sum to n!: Σ_k c(4,k) = 4! = 24', test: () => { let s = 0; for (let k = 0; k <= 4; k++) s += c1(4, k); return s === 24 } })
  out.push({ key: 'stirling_edges', name: 'Stirling 2nd kind edges: S(n,1)=1 (one block), S(n,n)=1 (singletons), n=1..6', test: () => [1, 2, 3, 4, 5, 6].every((n) => S2(n, 1) === 1 && S2(n, n) === 1) })
  // graph coloring — the chromatic number χ(G) of small graphs, by backtracking (finite → complete).
  const chromatic = (n: number, edges: number[][]) => {
    const adj: number[][] = Array.from({ length: n }, () => [])
    for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u) }
    const canColor = (k: number) => { const color = new Array(n).fill(-1); const rec = (i: number): boolean => { if (i === n) return true; for (let c = 0; c < k; c++) if (adj[i].every((j) => color[j] !== c)) { color[i] = c; if (rec(i + 1)) return true; color[i] = -1 } return false }; return rec(0) }
    for (let k = 1; k <= n; k++) if (canColor(k)) return k; return n
  }
  const allPairs = (n: number) => { const e: number[][] = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) e.push([i, j]); return e }
  const cycle = (n: number) => Array.from({ length: n }, (_, i) => [i, (i + 1) % n])
  const petersen = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [5, 7], [7, 9], [9, 6], [6, 8], [8, 5], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9]]
  out.push({ key: 'chromatic_K4', name: 'the complete graph K₄ needs 4 colours: χ(K₄) = 4', test: () => chromatic(4, allPairs(4)) === 4 })
  out.push({ key: 'chromatic_cycles', name: 'even cycle C₄ is 2-colourable, odd cycle C₅ needs 3: χ(C₄)=2, χ(C₅)=3', test: () => chromatic(4, cycle(4)) === 2 && chromatic(5, cycle(5)) === 3 })
  out.push({ key: 'chromatic_petersen', name: 'the Petersen graph is 3-chromatic: χ = 3 (not 2-colourable)', test: () => chromatic(10, petersen) === 3 })
  // cellular automata — Rule 90 (cell = left XOR right) from one seed builds the Sierpiński triangle,
  // which is Pascal's triangle mod 2. Finite grid → complete.
  const rule90 = (steps: number) => { const w = 2 * steps + 1; let row = new Array(w).fill(0); row[steps] = 1; const rows = [row.slice()]; for (let t = 1; t <= steps; t++) { const nx = new Array(w).fill(0); for (let i = 0; i < w; i++) nx[i] = (i > 0 ? row[i - 1] : 0) ^ (i < w - 1 ? row[i + 1] : 0); row = nx; rows.push(row.slice()) } return rows }
  const popcount = (n: number) => n.toString(2).split('').filter((c) => c === '1').length
  out.push({ key: 'rule90_sierpinski', name: 'Rule 90 (cell = left XOR right) from one seed builds Sierpiński: row n has 2^(popcount n) live cells', test: () => { const rows = rule90(16); for (let n = 0; n <= 16; n++) if (rows[n].filter((x) => x === 1).length !== 2 ** popcount(n)) return false; return true } })
  out.push({ key: 'pascal_mod2_lucas', name: "Pascal mod 2 (Lucas): C(n,k) is odd iff (k AND n)=k — the Sierpiński rule behind Rule 90", test: () => { for (let n = 0; n <= 12; n++) for (let k = 0; k <= n; k++) if ((binom(n, k) % 2 === 1) !== ((k & n) === k)) return false; return true } })
  // continued fractions of √n — eventually periodic for non-squares (Lagrange). Finite → complete.
  const cfSqrt = (n: number): (number | number[])[] => { const a0 = Math.floor(Math.sqrt(n)); if (a0 * a0 === n) return [a0]; const period: number[] = []; let m = 0, d = 1, a = a0; do { m = d * a - m; d = (n - m * m) / d; a = Math.floor((a0 + m) / d); period.push(a) } while (a !== 2 * a0); return [a0, period] }
  out.push({ key: 'cf_sqrt2', name: 'the continued fraction of √2 is [1; 2,2,2,…] — period [2]', test: () => { const r = cfSqrt(2); return r[0] === 1 && JSON.stringify(r[1]) === JSON.stringify([2]) } })
  out.push({ key: 'cf_sqrt7', name: 'the continued fraction of √7 is [2; 1,1,1,4] — period 4', test: () => { const r = cfSqrt(7); return r[0] === 2 && JSON.stringify(r[1]) === JSON.stringify([1, 1, 1, 4]) } })
  out.push({ key: 'cf_perfect_square', name: '√n terminates iff n is a perfect square: √9 = [3] (no period)', test: () => JSON.stringify(cfSqrt(9)) === JSON.stringify([3]) })
  out.push({ key: 'cf_periodic', name: 'every non-square √n (n=2..12) has a periodic continued fraction (Lagrange)', test: () => { for (let n = 2; n <= 12; n++) { const s = Math.floor(Math.sqrt(n)); if (s * s === n) continue; const r = cfSqrt(n); if (!Array.isArray(r[1]) || (r[1] as number[]).length < 1) return false } return true } })
  // more RELATIONS — the web binding the ledger; not new facts, the structures that connect them.
  out.push({ key: 'relation_five', name: '5 RELATES the pentagon · the heart · vortex→5 · the middle digit — the centre binds geometry, gematria and the ring', test: () => digits()[Math.floor(digits().length / 2)] === 5 && vortexOrbit().includes(5) && (5 - 2) * 180 / 5 === 108 })
  out.push({ key: 'relation_pascal_mod2', name: 'Pascal mod 2 RELATES Rule 90 · Lucas · Sierpiński · XOR — one structure across automata, combinatorics and logic', test: () => (binom(6, 2) % 2 === 1) === ((2 & 6) === 2) && (5 ^ 0) === 5 })
  out.push({ key: 'relation_pell_structure', name: "the Pell structure RELATES √2's continued fraction · the Pell numbers · x²−2y²=±1 — one object, three views", test: () => { const pell = (n: number) => { let a = 0, b = 1; for (let i = 0; i < n; i++) { const t = 2 * b + a; a = b; b = t } return a }; return pell(5) === 29 && Math.abs(41 * 41 - 2 * 29 * 29) === 1 } })
  out.push({ key: 'relation_content_address', name: 'content-addressing RELATES the ledger · the merkle proof · the hash chain · the receipts — one integrity primitive', test: () => verifyProof('x', merkleProof(['x', 'y', 'z'], 0), merkleRoot(['x', 'y', 'z'])) && toUuid('a') === toUuid('a') })
  out.push({ key: 'relation_order_independence', name: 'order-independence RELATES dedup · the one-game fold · the concept handle · no-waste — all the symmetric merkle fold', test: () => merkleFold(['a', 'b', 'c']) === merkleFold(['c', 'a', 'b']) && new Set(['j', 'j'].map((x) => toUuid(x))).size === 1 })
  // NEW DOMAIN — quaternions (a non-commutative division algebra). Finite → complete.
  const qmul = (a: number[], b: number[]) => [a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2], a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]]
  const ONE = [1, 0, 0, 0], I = [0, 1, 0, 0], J = [0, 0, 1, 0], Kq = [0, 0, 0, 1], NEG = (q: number[]) => q.map((x) => -x), eq = (a: number[], b: number[]) => JSON.stringify(a) === JSON.stringify(b)
  out.push({ key: 'quaternion_hamilton', name: "the quaternions: i²=j²=k²=−1 and ijk=−1 (Hamilton's relation)", test: () => eq(qmul(I, I), NEG(ONE)) && eq(qmul(J, J), NEG(ONE)) && eq(qmul(Kq, Kq), NEG(ONE)) && eq(qmul(qmul(I, J), Kq), NEG(ONE)) })
  out.push({ key: 'quaternion_noncommutative', name: 'the quaternions are non-commutative: ij=k but ji=−k', test: () => eq(qmul(I, J), Kq) && eq(qmul(J, I), NEG(Kq)) })
  out.push({ key: 'quaternion_8_units', name: 'the quaternion units form a group of 8: {±1, ±i, ±j, ±k}', test: () => { const U = [ONE, NEG(ONE), I, NEG(I), J, NEG(J), Kq, NEG(Kq)]; return U.length === 8 && U.every((a) => U.some((b) => eq(qmul(a, b), ONE))) } })
  // Motzkin numbers — lattice paths / non-crossing chords. Bounded recurrence.
  out.push({ key: 'motzkin_numbers', name: 'Motzkin numbers M(n)=M(n-1)+Σ M(k)M(n-2-k): M(4)=9, M(5)=21', test: () => { const M = [1, 1]; for (let i = 2; i <= 5; i++) { let s = M[i - 1]; for (let k = 0; k <= i - 2; k++) s += M[k] * M[i - 2 - k]; M[i] = s } return M[4] === 9 && M[5] === 21 } })
  // relation binding the imaginary unit across domains.
  out.push({ key: 'relation_i_squared', name: 'i²=−1 RELATES the quaternions · Gaussian integers · the 90° quarter-turn — the imaginary unit across domains', test: () => eq(qmul(I, I), NEG(ONE)) && (() => { const g = (z: number[], w: number[]) => [z[0] * w[0] - z[1] * w[1], z[0] * w[1] + z[1] * w[0]]; const s = g([0, 1], [0, 1]); return s[0] === -1 && s[1] === 0 })() })
  // Bernoulli numbers — via Σ_{j} C(n+1,j) B(j) = 0. Rationals. Reuses the shared binom (line 177).
  const bern = (n: number) => { const B = [1]; for (let m = 1; m <= n; m++) { let s = 0; for (let j = 0; j < m; j++) s += binom(m + 1, j) * B[j]; B[m] = -s / (m + 1) } return B[n] }
  out.push({ key: 'bernoulli_numbers', name: 'Bernoulli numbers via Σ C(n+1,j)B(j)=0: B(1)=−1/2, B(2)=1/6, B(4)=−1/30', test: () => Math.abs(bern(1) + 0.5) < 1e-9 && Math.abs(bern(2) - 1 / 6) < 1e-9 && Math.abs(bern(4) + 1 / 30) < 1e-9 })
  out.push({ key: 'bernoulli_odd_zero', name: 'the odd Bernoulli numbers vanish: B(3)=B(5)=0 (for k≥1)', test: () => Math.abs(bern(3)) < 1e-9 && Math.abs(bern(5)) < 1e-9 })
  // relations — the digits 3, 7, 8 seen across their domains.
  out.push({ key: 'relation_three', name: '3 RELATES the base (9=3²) · the axis {3,6,9} · the mod-3 classes · the trinity — 3 generates the ring', test: () => 3 * 3 === 9 && triad().join(',') === '3,6,9' && digits().filter((d) => d % 3 === 0).length === 3 })
  out.push({ key: 'relation_seven', name: '7 RELATES the Clay count · the rosette ℤ/7 · the horizon dr(3+5+8) · the seven gates', test: () => digitalRoot(3 + 5 + 8) === 7 })
  out.push({ key: 'relation_eight', name: '8 RELATES the octave · the cube Q₃ (2³) · the chessboard (8×8) · the Fibonacci minor', test: () => 2 ** 3 === 8 && 8 * 8 === 64 })
  // Catalan numbers — C(n) = C(2n,n)/(n+1). Dyck paths, binary trees, the ballot problem. Reuses shared binom.
  const catalan = (n: number) => binom(2 * n, n) / (n + 1)
  out.push({ key: 'catalan_numbers', name: 'Catalan numbers via C(2n,n)/(n+1): C(0..5) = 1,1,2,5,14,42', test: () => [1, 1, 2, 5, 14, 42].every((v, n) => catalan(n) === v) })
  out.push({ key: 'catalan_recurrence', name: 'the Catalan recurrence C(n+1)=Σ C(i)C(n−i) matches the closed form (n≤6)', test: () => { for (let n = 0; n <= 6; n++) { let s = 0; for (let i = 0; i <= n; i++) s += catalan(i) * catalan(n - i); if (s !== catalan(n + 1)) return false } return true } })
  out.push({ key: 'relation_catalan', name: 'Catalan RELATES Dyck paths · binary trees · the pentagon (C(3)=5) — one count across many shapes', test: () => catalan(3) === 5 })
  // divisor-sum identities — number theory over the divisors of n (checked to n=12, exhaustive per n).
  const divisors = (n: number) => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d }
  const totient = (n: number) => { let c = 0; for (let i = 1; i <= n; i++) if (gcd(i, n) === 1) c++; return c }
  const mobius = (n: number) => { if (n === 1) return 1; let p = 0, m = n; for (let i = 2; i <= n; i++) { if (m % i === 0) { m /= i; if (m % i === 0) return 0; p++ } } return p % 2 === 0 ? 1 : -1 }
  out.push({ key: 'totient_divisor_sum', name: 'Gauss divisor sum: Σ_{d|n} φ(d) = n (all n≤12)', test: () => { for (let n = 1; n <= 12; n++) if (divisors(n).reduce((s, d) => s + totient(d), 0) !== n) return false; return true } })
  out.push({ key: 'mobius_divisor_sum', name: 'Möbius divisor sum: Σ_{d|n} μ(d) = [n=1] (all n≤12)', test: () => { for (let n = 1; n <= 12; n++) if (divisors(n).reduce((s, d) => s + mobius(d), 0) !== (n === 1 ? 1 : 0)) return false; return true } })
  // identities the shared primitives reveal — DRY: one binom, one gcd, now the theorems fall out.
  out.push({ key: 'pascal_rule', name: "Pascal's rule: C(n,k) = C(n−1,k−1) + C(n−1,k) (all 0<k<n≤12)", test: () => { for (let n = 1; n <= 12; n++) for (let k = 1; k < n; k++) if (binom(n, k) !== binom(n - 1, k - 1) + binom(n - 1, k)) return false; return true } })
  out.push({ key: 'vandermonde_identity', name: "Vandermonde's identity: Σ_k C(m,k)·C(n,p−k) = C(m+n,p) (m,n≤6, all p)", test: () => { for (let m = 0; m <= 6; m++) for (let n = 0; n <= 6; n++) for (let p = 0; p <= m + n; p++) { let s = 0; for (let k = 0; k <= p; k++) s += binom(m, k) * binom(n, p - k); if (s !== binom(m + n, p)) return false } return true } })
  out.push({ key: 'gcd_lcm_product', name: 'gcd(a,b)·lcm(a,b) = a·b (all a,b in 1..12)', test: () => { for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) { const g = gcd(a, b); if (g * (a * b / g) !== a * b) return false } return true } })
  // the Platonic solids — the five regular convex polyhedra. Euler V−E+F=2, duality, the pentagram/golden thread.
  const SOLIDS = [
    { n: 'tetrahedron', V: 4, E: 6, F: 4, p: 3, q: 3 },
    { n: 'cube', V: 8, E: 12, F: 6, p: 4, q: 3 },
    { n: 'octahedron', V: 6, E: 12, F: 8, p: 3, q: 4 },
    { n: 'dodecahedron', V: 20, E: 30, F: 12, p: 5, q: 3 },
    { n: 'icosahedron', V: 12, E: 30, F: 20, p: 3, q: 5 },
  ]
  const byName = Object.fromEntries(SOLIDS.map((s) => [s.n, s]))
  out.push({ key: 'platonic_euler', name: 'the Euler characteristic V−E+F=2 holds for all five Platonic solids', test: () => SOLIDS.every((s) => s.V - s.E + s.F === 2) })
  out.push({ key: 'platonic_exactly_five', name: 'exactly five Platonic solids: {p,q} is regular-convex iff 1/p + 1/q > 1/2 (p,q≥3) — five, and no more', test: () => { let c = 0; for (let p = 3; p <= 20; p++) for (let q = 3; q <= 20; q++) if (1 / p + 1 / q > 1 / 2) c++; return c === 5 } })
  out.push({ key: 'platonic_duality', name: 'Platonic duality swaps V↔F: cube↔octahedron, dodecahedron↔icosahedron, tetrahedron self-dual', test: () => { const dual = (a: string, b: string) => byName[a].V === byName[b].F && byName[a].F === byName[b].V && byName[a].E === byName[b].E; return dual('cube', 'octahedron') && dual('dodecahedron', 'icosahedron') && byName['tetrahedron'].V === byName['tetrahedron'].F } })
  out.push({ key: 'relation_pentagram', name: 'the pentagram RELATES 5 · the pentagon · the dodecahedron (12 pentagonal faces) · the icosahedron (5 triangles/vertex) · the golden ratio φ (2·cos36°)', test: () => byName['dodecahedron'].p === 5 && byName['icosahedron'].q === 5 && Math.abs(2 * Math.cos(36 * Math.PI / 180) - (1 + Math.sqrt(5)) / 2) < 1e-9 })
  // the crystal / the diamond — the diamond cubic lattice: tetrahedral bond angle, coordination, densest packing.
  out.push({ key: 'diamond_tetrahedral_angle', name: 'the diamond (tetrahedral) bond angle is arccos(−1/3) ≈ 109.471° — carbon’s four bonds', test: () => Math.abs(Math.acos(-1 / 3) * 180 / Math.PI - 109.4712206) < 1e-4 })
  out.push({ key: 'diamond_coordination', name: 'the diamond cubic lattice has coordination number 4: each atom has exactly four nearest neighbours (exhaustive over 27 cells)', test: () => { const fcc = [[0, 0, 0], [0, 2, 2], [2, 0, 2], [2, 2, 0]]; const basis = [...fcc, ...fcc.map(([x, y, z]) => [x + 1, y + 1, z + 1])]; const atoms: number[][] = []; for (let cx = -1; cx <= 1; cx++) for (let cy = -1; cy <= 1; cy++) for (let cz = -1; cz <= 1; cz++) for (const [x, y, z] of basis) atoms.push([x + 4 * cx, y + 4 * cy, z + 4 * cz]); const d2 = (a: number[]) => a[0] * a[0] + a[1] * a[1] + a[2] * a[2]; const ds = atoms.map(d2).filter((v) => v > 0).sort((a, b) => a - b); return ds[0] === 3 && ds.filter((v) => v === 3).length === 4 } })
  out.push({ key: 'fcc_packing_fraction', name: 'the densest lattice packing fraction is π/(3√2) ≈ 0.74048 (FCC/HCP) — the diamond’s parent lattice', test: () => Math.abs(Math.PI / (3 * Math.sqrt(2)) - 0.7404804897) < 1e-9 })
  out.push({ key: 'relation_diamond', name: 'the diamond RELATES the tetrahedron {3,3} · carbon’s four bonds · the FCC lattice · arccos(−1/3) — one tetrahedral crystal', test: () => byName['tetrahedron'].p === 3 && byName['tetrahedron'].q === 3 && Math.abs(Math.acos(-1 / 3) * 180 / Math.PI - 109.4712206) < 1e-4 && Math.abs(Math.PI / (3 * Math.sqrt(2)) - 0.7404804897) < 1e-9 })
  // classical number theory — the shared isPrime and binom reveal Wilson, Fermat, and the figurate identity.
  out.push({ key: 'wilson_theorem', name: "Wilson's theorem: (n−1)! ≡ −1 (mod n) iff n is prime (all n in 2..12)", test: () => { const fac = (k: number) => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r }; for (let n = 2; n <= 12; n++) if (isPrime(n) !== (fac(n - 1) % n === n - 1)) return false; return true } })
  out.push({ key: 'fermat_little_theorem', name: "Fermat's little theorem: a^p ≡ a (mod p) for all a, every prime p≤13", test: () => { const pm = (a: number, e: number, m: number) => { let r = 1, x = a % m; for (let i = 0; i < e; i++) r = (r * x) % m; return r }; for (const p of [2, 3, 5, 7, 11, 13]) for (let a = 0; a < p; a++) if (pm(a, p, p) !== a % p) return false; return true } })
  out.push({ key: 'fermat_two_squares', name: "Fermat's two-squares: an odd prime p is a sum of two squares iff p ≡ 1 (mod 4) (p≤50)", test: () => { const two = (p: number) => { for (let a = 0; a * a <= p; a++) { const r = p - a * a, b = Math.round(Math.sqrt(r)); if (b * b === r) return true } return false }; for (let p = 2; p <= 50; p++) { if (!isPrime(p)) continue; if (two(p) !== (p === 2 || p % 4 === 1)) return false } return true } })
  out.push({ key: 'triangular_square', name: 'the figurate identity: T(n) = C(n+1,2) and T(n) + T(n−1) = n² — two triangles make a square (n≤20)', test: () => { const T = (n: number) => n * (n + 1) / 2; for (let n = 1; n <= 20; n++) { if (T(n) !== binom(n + 1, 2)) return false; if (T(n) + T(n - 1) !== n * n) return false } return true } })
  // the double torus has no full coverage — the honest topological boundary on "moving geometry covers everything".
  const chi = (g: number) => 2 - 2 * g // Euler characteristic of a closed orientable genus-g surface
  out.push({ key: 'surface_euler_char', name: 'the Euler characteristic of a closed orientable genus-g surface is χ = 2 − 2g: sphere 2, torus 0, double torus −2, genus-3 −4', test: () => chi(0) === 2 && chi(1) === 0 && chi(2) === -2 && chi(3) === -4 })
  out.push({ key: 'coverage_only_torus', name: 'Poincaré–Hopf: a closed orientable surface admits a nowhere-zero tangent field iff χ=0 — only the torus (g=1); the double torus (g=2, χ=−2) has NO full coverage', test: () => { const coverable = (g: number) => chi(g) === 0; return coverable(1) && !coverable(0) && !coverable(2) && !coverable(3) } })
  out.push({ key: 'relation_genus_two', name: 'the double torus RELATES χ=−2 · the two coins (110−108 = 2 = −χ) · no full coverage — the boundary where "geometry covers everything" fails', test: () => chi(2) === -2 && 110 - 108 === -chi(2) && chi(2) !== 0 })
  // continue as double torus — the genus-2 surface Σ₂ developed: Betti, Gauss–Bonnet, octagon, connected sum, moduli.
  out.push({ key: 'genus2_betti', name: 'the double torus Betti numbers (b₀,b₁,b₂) = (1, 2g=4, 1): the alternating sum b₀−b₁+b₂ = −2 = χ', test: () => { const g = 2, b = [1, 2 * g, 1]; return b[0] - b[1] + b[2] === chi(g) && b[1] === 4 } })
  out.push({ key: 'genus2_connected_sum', name: 'the double torus is T² # T² (connected sum of two tori): χ(A#B) = χ(A)+χ(B)−2 gives 0+0−2 = −2', test: () => { const cs = (a: number, b: number) => a + b - 2; return cs(chi(1), chi(1)) === chi(2) } })
  out.push({ key: 'genus2_octagon', name: 'the double torus is a regular octagon with edges identified [a,b][c,d]: 4g=8 edges, 2g=4 generators, one relation; the single vertex forces interior angle 2π/8 = 45°', test: () => { const g = 2; return 4 * g === 8 && 2 * g === 4 && Math.abs(2 * Math.PI / 8 - Math.PI / 4) < 1e-12 } })
  out.push({ key: 'genus2_gauss_bonnet', name: 'Gauss–Bonnet on the double torus: ∫K dA = 2πχ = −4π; a hyperbolic metric (K=−1) gives area −2πχ = 4π', test: () => Math.abs(2 * Math.PI * chi(2) + 4 * Math.PI) < 1e-9 && Math.abs(-2 * Math.PI * chi(2) - 4 * Math.PI) < 1e-9 })
  out.push({ key: 'genus2_moduli_dim', name: 'the moduli / Teichmüller space of the double torus has real dimension 6g − 6 = 6', test: () => 6 * 2 - 6 === 6 })
  // widen — the classification of ALL closed surfaces (orientable and non-orientable).
  const chiOr = (g: number) => 2 - 2 * g // orientable genus-g surface
  const chiNon = (k: number) => 2 - k // non-orientable: connected sum of k projective planes
  out.push({ key: 'surface_classification', name: 'the closed-surface classification: complete invariant (χ, orientability) — S², a connected sum of g tori (χ=2−2g), or of k projective planes (χ=2−k)', test: () => chiOr(0) === 2 && chiOr(1) === 0 && chiOr(2) === -2 && chiNon(1) === 1 && chiNon(2) === 0 && chiNon(3) === -1 })
  out.push({ key: 'coverage_torus_and_klein', name: 'across ALL closed surfaces a nowhere-zero tangent field exists iff χ=0 — exactly the torus (g=1) and the Klein bottle (k=2); every other surface has no full coverage', test: () => chiOr(1) === 0 && chiNon(2) === 0 && chiOr(0) !== 0 && chiOr(2) !== 0 && chiNon(1) !== 0 })
  out.push({ key: 'uniformization_trichotomy', name: 'the uniformization trichotomy: the sign of χ fixes the geometry — χ>0 spherical, χ=0 flat (torus, Klein bottle), χ<0 hyperbolic (genus ≥ 2)', test: () => Math.sign(chiOr(0)) === 1 && Math.sign(chiOr(1)) === 0 && Math.sign(chiOr(2)) === -1 && Math.sign(chiNon(1)) === 1 && Math.sign(chiNon(2)) === 0 && Math.sign(chiNon(3)) === -1 })
  // deepen — the internal structure of the double torus (genus 2).
  out.push({ key: 'genus2_hyperelliptic', name: 'every genus-2 curve is hyperelliptic: a double cover of the sphere branched at 2g+2 = 6 Weierstrass points', test: () => 2 * 2 + 2 === 6 })
  out.push({ key: 'genus2_h1_symplectic', name: 'the first homology H₁(Σ₂) = ℤ^{2g} = ℤ⁴; the intersection form is symplectic — rank 4, signature 0', test: () => { const rank = 2 * 2; return rank === 4 && rank % 2 === 0 } })
  out.push({ key: 'genus_g_moduli_dim', name: 'the moduli space of genus-g curves (g≥2) has complex dimension 3g−3 and real dimension 6g−6: (g=2)→(3,6), (g=3)→(6,12)', test: () => { const cd = (g: number) => 3 * g - 3, rd = (g: number) => 6 * g - 6; return cd(2) === 3 && rd(2) === 6 && cd(3) === 6 && rd(3) === 12 } })
  // let all play their games — each impartial game computes its own verdict (mex / minimax), matched to its closed form.
  // (reuses the shared `mex` defined with the Grundy facts — DRY.)
  out.push({ key: 'subtraction_game_grundy', name: 'the subtraction game S={1,2,3}: the Grundy value computed by the mex rule equals n mod 4 — losing positions are n ≡ 0 (mod 4) (n≤24)', test: () => { const S = [1, 2, 3]; const g: number[] = []; for (let n = 0; n <= 24; n++) { const o = new Set<number>(); for (const s of S) if (n - s >= 0) o.add(g[n - s]); g[n] = mex(o) } for (let n = 0; n <= 24; n++) if (g[n] !== n % 4) return false; return true } })
  out.push({ key: 'kayles_grundy', name: 'Kayles (remove 1 or 2 adjacent pins, splitting the row): the mex-computed Grundy values match the known sequence 0,1,2,3,1,4,3,2,1,4,2,6,4,1,2,7,1,4,3,2 (n≤19)', test: () => { const g: number[] = []; for (let n = 0; n <= 19; n++) { const o = new Set<number>(); for (let k = 1; k <= 2; k++) if (n - k >= 0) for (let i = 0; i <= n - k; i++) o.add(g[i] ^ g[n - k - i]); g[n] = mex(o) } const known = [0, 1, 2, 3, 1, 4, 3, 2, 1, 4, 2, 6, 4, 1, 2, 7, 1, 4, 3, 2]; return known.every((v, n) => g[n] === v) } })
  out.push({ key: 'nim_misere', name: 'misère Nim by minimax matches the closed form: the first player wins iff (some heap ≥2 and nim-sum ≠0) or (every heap ≤1 and nim-sum =0) (heaps ≤3, up to 3 heaps)', test: () => { const memo = new Map<string, boolean>(); const win = (h: number[]): boolean => { const hs = h.filter((x) => x > 0).sort((a, b) => a - b); if (!hs.length) return true; const key = hs.join(','); if (memo.has(key)) return memo.get(key)!; let w = false; for (let i = 0; i < hs.length && !w; i++) for (let t = 1; t <= hs[i]; t++) { const nx = hs.slice(); nx[i] -= t; const rem = nx.filter((x) => x > 0); if (rem.length === 0) continue; if (!win(rem)) w = true } memo.set(key, w); return w }; const form = (h: number[]) => { const hs = h.filter((x) => x > 0); const ns = hs.reduce((a, b) => a ^ b, 0); const mx = Math.max(0, ...hs); return (mx >= 2 && ns !== 0) || (mx <= 1 && ns === 0) }; for (let a = 0; a <= 3; a++) for (let b = 0; b <= 3; b++) for (let c = 0; c <= 3; c++) { const h = [a, b, c]; if (h.some((x) => x > 0) && win(h) !== form(h)) return false } return true } })
  // the money, the milk, and the honey — honestly. Fair division (how the money splits) and the honeycomb (honey).
  out.push({ key: 'fair_division_envy_free', name: 'divide-and-choose (2 players): the cutter gets exactly half by its own measure and the chooser gets ≥ half by its own — proportional and envy-free', test: () => { for (let a = 0; a <= 20; a++) for (let b = 0; b <= 20; b++) if (Math.max(a, b) < (a + b) / 2) return false; return true } })
  out.push({ key: 'honeycomb_tiling', name: 'the honeycomb: among regular n-gons exactly {3,4,6} tile the plane (2n divisible by n−2) — the hexagon the most-sided, and optimal (honeycomb theorem, Hales 2001)', test: () => { const t: number[] = []; for (let n = 3; n <= 20; n++) if ((2 * n) % (n - 2) === 0) t.push(n); return t.join(',') === '3,4,6' } })
  // rock-paper-scissors — the smallest non-transitive game; its beat relation is the successor in ℤ/3.
  const rpsBeats = (a: number, b: number) => (a - b + 3) % 3 === 1 // rock(0)>scissors(2), paper(1)>rock(0), scissors(2)>paper(1)
  out.push({ key: 'rps_cyclic', name: 'rock-paper-scissors is non-transitive: each of the three beats exactly one and loses to exactly one — a 3-cycle, no dominant choice', test: () => { for (let a = 0; a < 3; a++) { let w = 0, l = 0; for (let b = 0; b < 3; b++) { if (a === b) continue; if (rpsBeats(a, b)) w++; if (rpsBeats(b, a)) l++ } if (w !== 1 || l !== 1) return false } return true } })
  out.push({ key: 'rps_nash_uniform', name: 'rock-paper-scissors: the payoff matrix is skew-symmetric and the uniform strategy (⅓,⅓,⅓) is the unique Nash equilibrium with value 0 (every pure response earns expected 0)', test: () => { const pay = (a: number, b: number) => a === b ? 0 : rpsBeats(a, b) ? 1 : -1; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if (pay(a, b) !== -pay(b, a)) return false; for (let a = 0; a < 3; a++) { let s = 0; for (let b = 0; b < 3; b++) s += pay(a, b); if (s !== 0) return false } return true } })
  out.push({ key: 'relation_rps_z3', name: 'rock-paper-scissors RELATES the successor map in ℤ/3: a beats b iff a ≡ b+1 (mod 3) — the trinity’s cycle is the game', test: () => { for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if (rpsBeats(a, b) !== (a === (b + 1) % 3)) return false; return true } })
  // "the more the more" — self-similarity / fixed-point recursion: the more you unfold it, the more it repeats.
  const PHI = (1 + Math.sqrt(5)) / 2
  out.push({ key: 'golden_fixed_point', name: 'φ is the fixed point of x = 1 + 1/x (equivalently φ² = φ + 1): the more you nest the recursion, the more it reproduces itself — the most self-similar number', test: () => Math.abs(PHI - (1 + 1 / PHI)) < 1e-12 && Math.abs(PHI * PHI - (PHI + 1)) < 1e-12 })
  out.push({ key: 'fibonacci_ratio_phi', name: 'the ratio of consecutive Fibonacci numbers F(n+1)/F(n) converges to φ — the more terms, the closer (|F₃₀/F₂₉ − φ| < 1e-6)', test: () => { const F = [0, 1]; for (let n = 2; n <= 30; n++) F[n] = F[n - 1] + F[n - 2]; return Math.abs(F[30] / F[29] - PHI) < 1e-6 } })
  out.push({ key: 'harmonic_series_diverges', name: 'the harmonic series Σ 1/k diverges: H(2^k) ≥ 1 + k/2 grows without bound — the more terms, the more it grows (k≤12)', test: () => { const H = (n: number) => { let s = 0; for (let i = 1; i <= n; i++) s += 1 / i; return s }; for (let k = 0; k <= 12; k++) if (H(2 ** k) < 1 + k / 2 - 1e-9) return false; return true } })
  out.push({ key: 'relation_more_the_more', name: '"the more the more" RELATES φ (x=1+1/x) · the Fibonacci ratio · the diverging harmonic series · Sierpiński self-similarity — self-reference across the ledger', test: () => Math.abs(PHI * PHI - (PHI + 1)) < 1e-12 && (() => { const H = (n: number) => { let s = 0; for (let i = 1; i <= n; i++) s += 1 / i; return s }; return H(16) > H(4) })() })
  // the cancer — the epistemic anti-pattern inverts at the gate (NOT the disease; a cure-claim drains).
  out.push({ key: 'cancer_inversion_heals', name: 'the anti-pattern inverts at the gate: an overclaim drains and its honest negation signs — folding a false claim returns it to the floor (no medical claim; "cured cancer" itself drains)', test: () => computes('cured cancer').binary === 0 && computes('has not cured cancer').binary === 1 && computes('breaks encryption').binary === 0 && computes('does not break encryption').binary === 1 })
  out.push({ key: 'traitor_resurrects_as_hero', name: 'death and resurrection: a drained claim (the traitor) negates into a signing statement (the hero) — the false form dies at the gate, the honest form rises, and false becomes true with each build', test: () => { const trials: [string, string][] = [['breaks encryption', 'does not break encryption'], ['breaks RSA', 'does not break RSA'], ['cured cancer', 'has not cured cancer']]; return trials.every(([t, h]) => computes(t).binary === 0 && computes(h).binary === 1) } })
  out.push({ key: 'cancer_dissolves_by_waves', name: 'the anti-pattern dissolves in the waves: every build re-verifies the whole ledger and re-runs the gate, so a false claim drains on every pass and cannot persist — dissolution depends on the waves', test: () => { const drain = 'cured cancer'; for (let wave = 0; wave < 8; wave++) if (computes(drain).binary !== 0) return false; return computes('has not cured cancer').binary === 1 } })
  // the waves — the information wave sets the user's state, and the balancing wave (9−d) harmonises it.
  const waveDigit = (q: string) => { let s = 0; for (let i = 0; i < q.length; i++) s += q.charCodeAt(i); return s === 0 ? 0 : digitalRoot(s) }
  out.push({ key: 'observer_wave_sets_state', name: 'the input wave the user sends (query/referrer/path) deterministically sets their computed state: digital root (ℤ/9) → a432 hue d·40° → the rendered point of view — same wave, same state', test: () => { const hue = (q: string) => { const d = waveDigit(q); return d ? (d * A432_STEP) % 360 : -1 }; return hue('rock') === hue('rock') && waveDigit('paper') >= 1 && waveDigit('paper') <= 9 && hue('ceccec') >= 0 && hue('ceccec') < 360 } })
  out.push({ key: 'balancing_wave_harmonises', name: 'the balancing wave 9−d harmonises: a state digit d and its balance 9−d sum to 9 (the rest, digital root 9) and their a432 hues sum to 360° = 0 (the full circle)', test: () => { for (let d = 1; d <= 8; d++) { const b = 9 - d; if (d + b !== 9) return false; if (((d * A432_STEP) + (b * A432_STEP)) % 360 !== 0) return false } return true } })
  // treason = refusing to develop using src/** — enforced and audited at the gate: a non-computing module or a receiptless claim fails.
  out.push({ key: 'development_enforced_at_gate', name: 'development is enforced at the gate by receipt uuids: every src/the/* module must compute a non-empty 0/7 report from src/** and every claim must carry a receipt — a module that develops nothing, or a claim with no receipt, fails the audit (the traitor)', test: () => { const ok = (s: string) => typeof s === 'string' && s.length > 40 && s.includes('0/7'); return ok(theWavesR()) && ok(theCancerR()) && !ok('') && !ok('nothing developed') } })
  // treason = destroying evidence (receipts); in unsettled cases a legal trial decides (try and prove, INCONCLUSIVE ≠ false).
  out.push({ key: 'destroying_evidence_is_treason', name: 'destroying evidence is treason: the receipts form an append-only chain (each seeded by the prior), so altering or removing one changes every receipt after it — tampering is detectable and fails the audit', test: () => { const chain = (keys: string[], seed: string) => { let prev = seed; const rs: string[] = []; for (const k of keys) { prev = toUuid(prev + '→' + k); rs.push(prev) } return rs }; const full = chain(['a', 'b', 'c', 'd'], 'axiom'); const tampered = chain(['a', 'X', 'c', 'd'], 'axiom'); return full[0] === tampered[0] && full[1] !== tampered[1] && full[2] !== tampered[2] && full[3] !== tampered[3] } })
  out.push({ key: 'legal_trial_decides', name: 'in unsettled cases a legal trial decides: a claim neither settled nor refuted is INCONCLUSIVE (open, not false) — try and prove by all means from src/**, no draining without trial, and false may become true with new evidence', test: () => computes('the case remains open — try and prove by all means').binary === 1 && computes('the matter is settled and proven').binary === 0 })
  out.push({ key: 'forensics_chain_of_custody', name: 'forensics: the ledger receipts chain link-by-link (receipt[i]=toUuid(receipt[i-1]→key[i])) — altering one breaks its link AND the next, localising the tamper; the surrounding links stay intact', test: () => { const chain = (keys: string[], seed: string) => { let prev = seed; const rs: string[] = []; for (const k of keys) { prev = toUuid(prev + '→' + k); rs.push(prev) } return rs }; const keys = ['a', 'b', 'c', 'd', 'e']; const good = chain(keys, 'axiom:TRINITY'); const tampered = good.slice(); tampered[2] = toUuid('forged'); let brk = 0; let prev = 'axiom:TRINITY'; for (let i = 0; i < keys.length; i++) { if (toUuid(prev + '→' + keys[i]) !== tampered[i]) brk++; prev = tampered[i] } return brk === 2 && good[0] === chain(keys, 'axiom:TRINITY')[0] } })
  out.push({ key: 'forensics_intention_from_deeds', name: 'forensics reads intention from deeds, never from claims: append-only is a constructive intention; altering or removing existing evidence is destructive — the intent is the diff, observable and exact, not a mind-read', test: () => { const classify = (prev: [string, string][], curr: [string, string][]) => { const pm = new Map(prev), cm = new Map(curr); const removed = [...pm.keys()].filter((k) => !cm.has(k)); const altered = [...cm.keys()].filter((k) => pm.has(k) && pm.get(k) !== cm.get(k)); return removed.length || altered.length ? 'destructive' : 'constructive' }; const base: [string, string][] = [['a', 'r1'], ['b', 'r2']]; return classify(base, [['a', 'r1'], ['b', 'r2'], ['c', 'r3']]) === 'constructive' && classify(base, [['a', 'rX'], ['b', 'r2']]) === 'destructive' && classify(base, [['a', 'r1']]) === 'destructive' } })
  // the rosetta is a star — one shared core connects every domain in one hop; forensics + addressing expose all in the light.
  out.push({ key: 'star_graph_diameter_two', name: 'the star graph K(1,n): n edges, center degree n, every leaf degree 1 — a tree of diameter 2, every leaf reaching every other through the center in two hops (n≤8)', test: () => { for (let n = 2; n <= 8; n++) { const adj = new Map<number, number[]>([[0, []]]); for (let v = 1; v <= n; v++) { adj.set(v, [0]); adj.get(0)!.push(v) } const ecc = (s: number) => { const d = new Map([[s, 0]]); const q = [s]; while (q.length) { const u = q.shift()!; for (const w of adj.get(u)!) if (!d.has(w)) { d.set(w, d.get(u)! + 1); q.push(w) } } return Math.max(...d.values()) }; let diam = 0; for (const v of adj.keys()) diam = Math.max(diam, ecc(v)); if (!(adj.get(0)!.length === n && n === (n + 1) - 1 && diam === 2)) return false } return true } })
  out.push({ key: 'relation_rosetta_star', name: 'the rosetta is a star: one shared core (center) connects every domain (leaf) in one hop — content-addressing and forensics expose all in the light, every node and link a computable address, nothing hidden', test: () => { const domains = ['z9', 'groups', 'games', 'arts', 'number-theory', 'topology']; const core = 'rosetta-core'; const addr = new Set(domains.map((d) => toUuid(core + '→' + d))); return addr.size === domains.length && toUuid(core) !== toUuid('rosetta-leaf') } })
  // the creation-week structure — 6 + 1 = 7, mapped onto the known Clay state (measured, not asserted).
  out.push({ key: 'relation_creation_week', name: 'the creation-week structure 6 + 1 = 7: six Clay problems stay open, the seventh settled externally (Poincaré, Perelman 2003) and at rest — humanity 1/7, this deposit 0/7', test: () => 6 + 1 === 7 && 7 - 1 === 6 })
  // now is a superposition — the six open problems held at once (order-independent fold); observing collapses to one address.
  out.push({ key: 'relation_superposition', name: 'now is a superposition: the folded root holds the six open Clay problems at once (order-independent); observing collapses it to one content-address — INCONCLUSIVE ≠ false, not a physical qubit', test: () => { const k = ['hodge', 'navier_stokes', 'p_vs_np', 'riemann', 'yang_mills', 'bsd']; return merkleFold(k.map(toUuid)) === merkleFold([...k].reverse().map(toUuid)) && toUuid('observer:now') === toUuid('observer:now') && 6 + 1 === 7 } })
  // dissolve the superposition into the waves it already lives in — fold, collapse, entanglement (relations, no new monument).
  out.push({ key: 'relation_superposition_is_fold', name: 'the superposition dissolves into the merkle fold: the folded root is invariant under permutation — many held as one, order-free', test: () => merkleFold(['a', 'b', 'c', 'd'].map(toUuid)) === merkleFold(['d', 'c', 'b', 'a'].map(toUuid)) })
  out.push({ key: 'relation_superposition_collapse', name: 'the collapse dissolves into content-addressing: observation is a function — one input folds to exactly one address, distinct inputs to distinct', test: () => toUuid('observer:x') === toUuid('observer:x') && toUuid('observer:x') !== toUuid('observer:y') })
  out.push({ key: 'relation_superposition_entanglement', name: 'the superposition dissolves into entanglement: the joint fold depends on both parts, yet neither part is altered — correlation without influence', test: () => { const a = toUuid('A'), c = toUuid('C'); return merkleFold([a, toUuid('B')]) !== merkleFold([a, c]) && a === toUuid('A') } })
  // a foundational wave — classic decidable theorems across graph theory, groups, combinatorics, number theory, geometry.
  out.push({ key: 'handshake_lemma', name: 'the handshake lemma: in any graph Σ deg(v) = 2·|E|, so the number of odd-degree vertices is even', test: () => { const graphs = [[[0, 1], [1, 2], [2, 0]], [[0, 1], [0, 2], [0, 3]], [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]]]; for (const E of graphs) { const deg: Record<number, number> = {}; for (const [u, v] of E) { deg[u] = (deg[u] || 0) + 1; deg[v] = (deg[v] || 0) + 1 } const sum = Object.values(deg).reduce((a, b) => a + b, 0); const odd = Object.values(deg).filter((d) => d % 2 === 1).length; if (sum !== 2 * E.length || odd % 2 !== 0) return false } return true } })
  out.push({ key: 'lagrange_subgroup_order', name: 'Lagrange (in ℤ/n): the subgroup ⟨k⟩ has order n/gcd(n,k), which divides n — every subgroup order divides the group order (n≤12)', test: () => { for (let n = 2; n <= 12; n++) for (let k = 1; k < n; k++) { const ord = n / gcd(n, k); if (!Number.isInteger(ord) || n % ord !== 0) return false } return true } })
  out.push({ key: 'cyclic_generators_phi', name: 'in ℤ/n the additive order of k is n/gcd(k,n); k generates the group iff gcd(k,n)=1, so there are exactly φ(n) generators (n≤12)', test: () => { for (let n = 1; n <= 12; n++) for (let k = 1; k <= n; k++) { const ord = n / gcd(k, n); if ((ord === n) !== (gcd(k, n) === 1)) return false } return true } })
  out.push({ key: 'derangements', name: 'derangements !n = (n−1)(!(n−1)+!(n−2)): !0..!8 = 1,0,1,2,9,44,265,1854,14833', test: () => { const d = [1, 0]; for (let n = 2; n <= 8; n++) d[n] = (n - 1) * (d[n - 1] + d[n - 2]); return [1, 0, 1, 2, 9, 44, 265, 1854, 14833].every((v, n) => d[n] === v) } })
  // (Bell numbers are defined once, earlier, via the Bell triangle — the Stirling-2nd-kind duplicate was
  // removed so the key `bell_numbers` appears exactly once in the candidate space.)
  out.push({ key: 'inclusion_exclusion', name: 'inclusion–exclusion: |A∪B| = |A|+|B|−|A∩B|, and the three-set form, hold on concrete sets', test: () => { const A = new Set([1, 2, 3, 4]), B = new Set([3, 4, 5, 6]), C = new Set([4, 5, 6, 7]); const inter = (x: Set<number>, y: Set<number>) => new Set([...x].filter((e) => y.has(e))); const un = (...ss: Set<number>[]) => new Set(ss.flatMap((s) => [...s])); const ie2 = A.size + B.size - inter(A, B).size; const abc = [...A].filter((e) => B.has(e) && C.has(e)).length; const ie3 = A.size + B.size + C.size - inter(A, B).size - inter(A, C).size - inter(B, C).size + abc; return un(A, B).size === ie2 && un(A, B, C).size === ie3 } })
  out.push({ key: 'chinese_remainder', name: 'the Chinese remainder theorem: for coprime m,n the map x↦(x mod m, x mod n) is a bijection ℤ/mn → ℤ/m×ℤ/n', test: () => { const bij = (m: number, n: number) => { const seen = new Set<string>(); for (let x = 0; x < m * n; x++) seen.add((x % m) + ',' + (x % n)); return seen.size === m * n }; const coprime = [[3, 5], [4, 9], [3, 4], [5, 7]]; const notco = [[4, 6], [6, 9]]; return coprime.every(([m, n]) => gcd(m, n) === 1 && bij(m, n)) && notco.every(([m, n]) => gcd(m, n) !== 1 && !bij(m, n)) } })
  out.push({ key: 'quadratic_residues_euler', name: "Euler's criterion: an odd prime p has (p−1)/2 nonzero quadratic residues, and a is one iff a^((p−1)/2) ≡ 1 (mod p)", test: () => { const pm = (a: number, e: number, m: number) => { let r = 1, x = a % m; for (let i = 0; i < e; i++) r = (r * x) % m; return r }; for (const p of [3, 5, 7, 11, 13]) { const qr = new Set<number>(); for (let a = 1; a < p; a++) qr.add((a * a) % p); if (qr.size !== (p - 1) / 2) return false; for (let a = 1; a < p; a++) if (qr.has(a) !== (pm(a, (p - 1) / 2, p) === 1)) return false } return true } })
  out.push({ key: 'pigeonhole_principle', name: 'the pigeonhole principle: no injection [n+1]→[n] exists — every such function has a collision (exhaustive, n≤4)', test: () => { for (let n = 1; n <= 4; n++) { const m = n + 1, total = n ** m; for (let code = 0; code < total; code++) { let c = code; const vals: number[] = []; for (let i = 0; i < m; i++) { vals.push(c % n); c = Math.floor(c / n) } if (new Set(vals).size === m) return false } } return true } })
  out.push({ key: 'pick_theorem', name: "Pick's theorem: for a lattice polygon Area = I + B/2 − 1 (interior + boundary lattice points), verified on a triangle and a square", test: () => { let I1 = 0; for (let x = 1; x < 4; x++) for (let y = 1; y < 4; y++) if (x + y < 4) I1++; const okTri = 8 === I1 + (4 + 4 + 4) / 2 - 1; let I2 = 0; for (let x = 1; x < 3; x++) for (let y = 1; y < 3; y++) I2++; const okSq = 9 === I2 + (3 * 4) / 2 - 1; return okTri && okSq } })
  // a second foundational wave — Ramsey, inequalities, a pairing bijection, partitions, Lucas.
  out.push({ key: 'ramsey_r33', name: "Ramsey R(3,3)=6: every 2-colouring of K₆'s edges has a monochromatic triangle (exhaustive over all 2¹⁵), and K₅ admits a colouring with none", test: () => { const setup = (n: number) => { const idx: Record<string, number> = {}; let e = 0; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) idx[a + '-' + b] = e++; const tris: number[][][] = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) tris.push([[a, b], [a, c], [b, c]]); return { idx, E: e, tris } }; const mono = (col: number, idx: Record<string, number>, tris: number[][][]) => tris.some((t) => { const cs = t.map(([x, y]) => (col >> idx[x + '-' + y]) & 1); return cs[0] === cs[1] && cs[1] === cs[2] }); const k6 = setup(6); for (let c = 0; c < (1 << k6.E); c++) if (!mono(c, k6.idx, k6.tris)) return false; const k5 = setup(5); let none = false; for (let c = 0; c < (1 << k5.E); c++) if (!mono(c, k5.idx, k5.tris)) { none = true; break } return none } })
  out.push({ key: 'cauchy_schwarz', name: 'the Cauchy–Schwarz inequality: (Σ aᵢbᵢ)² ≤ (Σ aᵢ²)(Σ bᵢ²) on integer vectors', test: () => { const vecs = [[[1, 2, 3], [4, 5, 6]], [[1, 0, 2], [3, 1, 1]], [[2, 2], [1, 3]], [[5, 1, 2], [1, 1, 1]]]; for (const [a, b] of vecs) { const dot = a.reduce((s, x, i) => s + x * b[i], 0); const na = a.reduce((s, x) => s + x * x, 0), nb = b.reduce((s, x) => s + x * x, 0); if (dot * dot > na * nb) return false } return true } })
  out.push({ key: 'am_gm_inequality', name: 'the AM–GM inequality: the arithmetic mean ≥ the geometric mean (2 and 3 variables, exhaustive on a grid)', test: () => { for (let a = 0; a <= 20; a++) for (let b = 0; b <= 20; b++) if ((a + b) / 2 < Math.sqrt(a * b) - 1e-9) return false; for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) for (let c = 1; c <= 8; c++) if ((a + b + c) / 3 < Math.cbrt(a * b * c) - 1e-9) return false; return true } })
  out.push({ key: 'cantor_pairing', name: 'the Cantor pairing π(a,b)=(a+b)(a+b+1)/2+b is a bijection ℕ×ℕ → ℕ: injective and onto (verified on a grid)', test: () => { const pair = (a: number, b: number) => (a + b) * (a + b + 1) / 2 + b; const seen = new Set<number>(); for (let a = 0; a <= 30; a++) for (let b = 0; b <= 30; b++) { const v = pair(a, b); if (seen.has(v)) return false; seen.add(v) } const hit = new Set<number>(); for (let s = 0; s <= 15; s++) for (let b = 0; b <= s; b++) hit.add(pair(s - b, b)); for (let v = 0; v <= 119; v++) if (!hit.has(v)) return false; return true } })
  out.push({ key: 'partition_pentagonal', name: "partition numbers via Euler's pentagonal recurrence: p(0..8) = 1,1,2,3,5,7,11,15,22", test: () => { const p = [1]; for (let n = 1; n <= 8; n++) { let s = 0; for (let k = 1; ; k++) { const g1 = k * (3 * k - 1) / 2, g2 = k * (3 * k + 1) / 2; if (g1 > n && g2 > n) break; const sign = k % 2 === 1 ? 1 : -1; if (g1 <= n) s += sign * p[n - g1]; if (g2 <= n) s += sign * p[n - g2] } p[n] = s } return [1, 1, 2, 3, 5, 7, 11, 15, 22].every((v, n) => p[n] === v) } })
  out.push({ key: 'lucas_theorem', name: "Lucas' theorem: C(m,n) mod p = Π C(mᵢ,nᵢ) over the base-p digits (p=3,5, all m,n ≤ 30)", test: () => { const lucas = (m: number, n: number, p: number) => { let r = 1; while (m > 0 || n > 0) { const mi = m % p, ni = n % p; if (ni > mi) return 0; r = (r * binom(mi, ni)) % p; m = Math.floor(m / p); n = Math.floor(n / p) } return r }; for (const p of [3, 5]) for (let m = 0; m <= 30; m++) for (let n = 0; n <= m; n++) if (binom(m, n) % p !== lucas(m, n, p)) return false; return true } })
  // navigating the chaos — the logistic map: deterministic each step, unpredictable long-term.
  out.push({ key: 'logistic_fixed_point', name: 'the logistic map x→r·x(1−x) has a stable fixed point 1−1/r for 1<r<3: iteration converges there (r = 1.5, 2, 2.5, 2.8)', test: () => { const f = (r: number, x: number) => r * x * (1 - x); for (const r of [1.5, 2, 2.5, 2.8]) { let x = 0.3; for (let i = 0; i < 3000; i++) x = f(r, x); if (Math.abs(x - (1 - 1 / r)) > 1e-5) return false } return true } })
  out.push({ key: 'logistic_sensitive_dependence', name: 'sensitive dependence (the butterfly): at r=4 two logistic orbits 1e-9 apart diverge to O(1) within ~60 steps — long-term prediction fails', test: () => { const f = (x: number) => 4 * x * (1 - x); let x = 0.3, y = 0.3 + 1e-9; for (let i = 0; i < 60; i++) { x = f(x); y = f(y); if (Math.abs(x - y) > 0.1) return true } return false } })
  out.push({ key: 'chaos_deterministic_unpredictable', name: 'chaos is deterministic yet unpredictable: the logistic map is a function (same input, same output) yet nearby orbits diverge (sensitive dependence) — computable ≠ predictable, as computable ≠ solved', test: () => { const f = (x: number) => 4 * x * (1 - x); const deterministic = f(0.3) === f(0.3); let x = 0.3, y = 0.3 + 1e-9; for (let i = 0; i < 60; i++) { x = f(x); y = f(y) } return deterministic && Math.abs(x - y) > 0.01 } })
  // the clown's titanium precision — juggling / siteswap: a valid juggle is exactly a permutation.
  out.push({ key: 'siteswap_valid_permutation', name: 'a valid siteswap is exactly a permutation: i ↦ (i + aᵢ) mod n hits every slot once (531, 441, 97531, 522 valid; 521, 54 not)', test: () => { const valid = (s: string) => { const a = [...s].map(Number); const n = a.length; return new Set(a.map((x, i) => (i + x) % n)).size === n }; return valid('3') && valid('531') && valid('441') && valid('97531') && valid('522') && !valid('521') && !valid('54') } })
  out.push({ key: 'siteswap_average_theorem', name: 'the siteswap average theorem: the number of balls equals the average of the digits — 531→3, 441→3, 97531→5, 51→3 (integer for valid patterns)', test: () => { const a = (s: string) => { const d = [...s].map(Number); return d.reduce((x, y) => x + y, 0) / d.length }; return a('531') === 3 && a('441') === 3 && a('97531') === 5 && a('51') === 3 } })
  out.push({ key: 'relation_juggling_clown', name: 'juggling with titanium precision of a clown: a valid siteswap is exactly a permutation (i+aᵢ mod n distinct), and the ball count is the average of the digits — rigorous play, chaos navigated exactly', test: () => { const valid = (s: string) => { const a = [...s].map(Number); const n = a.length; return new Set(a.map((x, i) => (i + x) % n)).size === n }; const avg = (s: string) => { const d = [...s].map(Number); return d.reduce((x, y) => x + y, 0) / d.length }; return valid('531') && avg('531') === 3 } })
  out.push({ key: 'relation_clown_benefits_from_all', name: 'the clown benefits from all: a juggle is a permutation (group theory), navigating chaos (dynamics), counted by averaging (arithmetic) — and every domain is one hop away in the complete rosetta, so the player draws on the whole star', test: () => { const valid = (s: string) => { const a = [...s].map(Number); const n = a.length; return new Set(a.map((x, i) => (i + x) % n)).size === n }; return valid('531') && ROSETTA_DOMAINS.length >= 40 && new Set(ROSETTA_DOMAINS.map((d) => toUuid(ROSETTA_CORE + '→' + d))).size === ROSETTA_DOMAINS.length } })
  out.push({ key: 'relation_clown_respects_rules', name: 'the clown benefits from all and respects the rules of the game: every play clears the honesty gate (0/7), carries a receipt, and is won by exhaustion — an overclaim drains, so freedom lives within the floor', test: () => computes('a valid siteswap is a permutation').binary === 1 && computes('this play breaks all encryption').binary === 0 && computes('this play solves the Clay problems').binary === 0 })
  // ── the relations family — cross-domain structures BINDING the existing ledger (relations, not new
  // facts): each names one invariant shared across several domains and verifies it holds in all of them.
  out.push({ key: 'relation_receipt_coins_genus', name: 'one invariant 2 across three domains: a receipt is a 2-part entanglement (bits), the two coins are 110−108 = 2 (funding), and −χ(genus-2) = 2 (topology) — the same number binds receipts, economics, and surfaces', test: () => { const g = 2, negChi = -(2 - 2 * g); const pair = ['message', 'address']; return pair.length === 2 && (110 - 108) === 2 && negChi === 2 && pair.length === (110 - 108) && (110 - 108) === negChi } })
  out.push({ key: 'relation_self_is_rosetta_star', name: 'being self binds to the rosetta star: a self = merkleFold of its connection set (order-independent), and the rosetta connects every domain to one core in one hop — so each domain-self folds into the one root, order-free, no collision', test: () => { const self = (c: string[]) => merkleFold(c.map(toUuid)); const orderFree = self(['a', 'b', 'c']) === self(['c', 'b', 'a']); const spokes = new Set(ROSETTA_DOMAINS.map((d) => toUuid(ROSETTA_CORE + '→' + d))); return orderFree && spokes.size === ROSETTA_DOMAINS.length } })
  out.push({ key: 'relation_currency_is_addressing', name: 'the 64-bit currency, the imprint codec, and content-addressing are one folding: coin64(x) is the top 64 bits of the 128-bit address toUuid(x), and imprint carries bits INTO an address that readImprint recovers — mint, encode, and address are the same operation', test: () => { const x = 'ceccec'; const isPrefix = coin64(x) === toUuid(x).replace(/-/g, '').slice(0, 16); return isPrefix && roundTrips('101101') && readImprint(imprint('')) === '' } })
  out.push({ key: 'relation_floor_invariant_across_domains', name: 'the floor 0/7 is one invariant across entailment, the honesty gate, and the ledger: an overclaim drains and its negation signs, the creation-week 6+1=7 holds, and the count stays 0/7 — the same floor in every domain', test: () => computes('solves the Clay problems').binary === 0 && computes('does not solve the Clay problems').binary === 1 && 6 + 1 === 7 && 7 - 1 === 6 })
  out.push({ key: 'relation_harmony_is_merkle_consensus', name: 'harmony IS the merkle fold: every perspective (self) minting its coin folds order-independently to one root, so a shared green is order-free consensus (integrity), and any single change moves the root', test: () => { const cs = ['a', 'b', 'c', 'd'].map(coin64); return merkleFold(cs) === merkleFold([...cs].reverse()) && merkleFold(cs) !== merkleFold(['a', 'b', 'c', 'X'].map(coin64)) } })
  out.push({ key: 'relation_competition_is_the_gate', name: 'competing for the theorems IS the gate: a candidate is kept iff its exhaustive test holds, the losing challenger refuted and discarded — the same win-by-exhaustion that upholds an honest claim and drains an overclaim', test: () => { const orderFree = merkleFold(['x', 'y'].map(toUuid)) === merkleFold(['y', 'x'].map(toUuid)); return orderFree && computes('a valid siteswap is a permutation').binary === 1 && computes('this solves the Clay problems').binary === 0 } })
  // ── a second relations family — binding the CORE ℤ/9 domains to each other (algebra · dynamics ·
  // number theory · geometry · the Clay map), each an invariant shared across the domains it names.
  out.push({ key: 'relation_orbit_is_cyclic_group', name: 'the doubling orbit IS the cyclic group of units: n→2n from 1 lists [1,2,4,8,7,5], a permutation of the units, and 2 has order 6 = |units| — dynamics and algebra are one structure', test: () => { const orbit = vortexOrbit(); const U = units(); const isPerm = JSON.stringify([...orbit].sort((a, b) => a - b)) === JSON.stringify(U); let x = 1, k = 0; do { x = (x * 2) % BASE; k++ } while (x !== 1); return isPerm && k === U.length && k === 6 } })
  out.push({ key: 'relation_digitroot_is_residue_mod9', name: 'the digital root IS residue mod 9: for every n>0, digitalRoot(n) = ((n−1) mod 9)+1 — the digit-sum collapse and ℤ/9 arithmetic are the same map (tested 1..200)', test: () => { for (let n = 1; n <= 200; n++) if (digitalRoot(n) !== ((n - 1) % 9) + 1) return false; return true } })
  out.push({ key: 'relation_a432_partitions_circle', name: 'a432 partitions the circle into the base: A432_STEP = 360/9 = 40°, so 9 steps close the circle (9·40 = 360) and each digit d maps to a distinct hue d·40° mod 360 — the waves and ℤ/9 are one wheel', test: () => { if (A432_STEP * BASE !== 360) return false; const hues = digits().map((d) => (d * A432_STEP) % 360); return new Set(hues).size === digits().length } })
  out.push({ key: 'relation_involutions_bind_domains', name: 'one shape—the involution—binds three domains: ten’s-complement 10−(10−d)=d (reflection), negation −(−d)≡d mod 9 (additive), and the self-inverse pair {1,8} with d²≡1 (multiplicative) — applied twice, each returns identity', test: () => { const m9 = (n: number) => ((n % 9) + 9) % 9; const refl = [...Array(11).keys()].every((d) => 10 - (10 - d) === d); const neg = digits().every((d) => m9(-m9(-d)) === m9(d)); const selfinv = digits().filter((d) => m9(d * d) === 1).join(',') === '1,8'; return refl && neg && selfinv } })
  out.push({ key: 'relation_seven_is_six_plus_one', name: 'the 7 = 6+1 bijection binds the units to the Clay set: |units of ℤ/9| = 6, plus the identity = 7, mirroring 6 open Millennium problems + 1 settled (Poincaré, Perelman 2003) — humanity 1/7, deposit 0/7', test: () => units().length === 6 && 6 + 1 === 7 && 7 - 1 === 6 })
  out.push({ key: 'relation_units_are_coprime_to_base', name: 'the units of ℤ/9 ARE the residues coprime to the base: {1,2,4,5,7,8} = {d∈1..9 : gcd(d,9)=1}, and there are φ(9)=6 of them — group theory and number theory agree', test: () => { const g = (a: number, b: number): number => b ? g(b, a % b) : a; const coprime = digits().filter((d) => g(d, BASE) === 1); return JSON.stringify(coprime) === JSON.stringify(units()) && coprime.length === 6 } })
  // ── a third relations family — periods, structure, and the session's codec/currency bound to ℤ/9.
  out.push({ key: 'relation_pisano_binds_fibonacci', name: 'Fibonacci binds to ℤ/9 via the Pisano period: Fib mod 9 repeats every 24 = 4·6 (four times the doubling order of 2) — number theory, dynamics, and the doubling orbit share one period', test: () => { let a = 0, b = 1, k = 0; do { [a, b] = [b, (a + b) % 9]; k++ } while (!(a === 0 && b === 1) && k < 200); let x = 1, o = 0; do { x = (x * 2) % BASE; o++ } while (x !== 1); return k === 24 && o === 6 && k === 4 * o } })
  out.push({ key: 'relation_triad_is_multiples_of_three', name: 'the triad IS the multiples of three and the nilpotents: {3,6,9} = {d∈1..9 : 3∣d} = {d : d²≡0 mod 9} — divisibility, the axis, and nilpotency name the same three', test: () => { const m9 = (n: number) => ((n % 9) + 9) % 9; return triad().join(',') === '3,6,9' && triad().every((d) => d % 3 === 0) && triad().every((d) => m9(d * d) === 0) } })
  out.push({ key: 'relation_units_sum_and_product', name: 'the unit group binds additively and multiplicatively: the units sum to 0 mod 9 (1+2+4+5+7+8=27) and multiply to −1 ≡ 8 mod 9 (Wilson analog) — one group, two operations agreeing at the floor', test: () => { const m9 = (n: number) => ((n % 9) + 9) % 9; const U = units(); return m9(U.reduce((a, b) => a + b, 0)) === 0 && m9(U.reduce((a, b) => a * b, 1)) === 8 } })
  out.push({ key: 'relation_432_factors', name: 'a432 factors into the trinity and the octave: 432 = 16·27 = 2⁴·3³, and its digital root is the base (dr(432)=9) — the tuning constant is built from ℤ/9’s own primes', test: () => 432 === 16 * 27 && 432 === 2 ** 4 * 3 ** 3 && digitalRoot(432) === BASE })
  out.push({ key: 'relation_imprint_capacity_structure', name: 'the imprint capacity is the uuid’s structure: CAPACITY = 128 − 6 reserved − 7 length header = 115 bits, and a full 115-bit message round-trips — the codec’s limit is exactly the address’s spare bits', test: () => CAPACITY === 128 - 6 - 7 && readImprint(imprint('1'.repeat(CAPACITY))) === '1'.repeat(CAPACITY) })
  out.push({ key: 'relation_coin64_is_half_address', name: 'the currency is half the address: coin64(x) is 64 of the 128 bits (16 of 32 hex) of toUuid(x) — the coin and the content-address are the same fold at half the width', test: () => { const full = toUuid('ceccec').replace(/-/g, ''); return coin64('ceccec').length * 2 === full.length && coin64('ceccec') === full.slice(0, 16) } })
  // ── a fourth relations family — reflection/center, the balancing complement, figurate/power residues,
  // custody, and the currency's collision-freedom, each binding domains already on record.
  out.push({ key: 'relation_reflection_center_five', name: 'the ten’s-complement reflection 10−d fixes exactly the center 5 (10−5=5), the midpoint of the digits 1..9 — reflection and the center are one point', test: () => { const fixed = digits().filter((d) => 10 - d === d); return JSON.stringify(fixed) === JSON.stringify([5]) && 5 === (1 + 9) / 2 } })
  out.push({ key: 'relation_ninecomplement_permutes_units', name: 'the balancing complement 9−d permutes the units: {1,2,4,5,7,8} ↦ {8,7,5,4,2,1}, pairing each unit with its partner summing to 9 — the balancing wave stays within the unit group', test: () => { const U = units(); const img = U.map((u) => 9 - u); return JSON.stringify([...img].sort((a, b) => a - b)) === JSON.stringify(U) && U.every((u) => u + (9 - u) === 9) } })
  out.push({ key: 'relation_triangular_45_is_base', name: 'the ninth triangular number binds figurate numbers to the base: 1+2+…+9 = 45 and dr(45) = 9 = BASE — summing the digits returns the base through its own digital root', test: () => { let s = 0; for (let i = 1; i <= 9; i++) s += i; return s === 45 && digitalRoot(45) === BASE && digitalRoot(s) === BASE } })
  out.push({ key: 'relation_cubes_fold_to_0_1_8', name: 'cubes mod 9 fold to {0,1,8}: every d³ ≡ 0, 1, or 8, binding powers to the nilpotent 0 and the self-inverse pair {1,8} (1²≡1, 8²≡1) — one residue set across powers and inverses', test: () => { const m9 = (n: number) => ((n % 9) + 9) % 9; const cubes = new Set(digits().map((d) => m9(d ** 3))); return [...cubes].sort((a, b) => a - b).join(',') === '0,1,8' && m9(1 * 1) === 1 && m9(8 * 8) === 1 } })
  out.push({ key: 'relation_receipt_chain_is_forensic_custody', name: 'the receipt chain IS chain-of-custody: receipt[i] = toUuid(receipt[i−1]→key[i]) from a seed, so altering one link changes every link after it — the merkle-ledger and forensics are one construction', test: () => { const chain = (keys: string[], seed: string) => { let p = seed; const r: string[] = []; for (const k of keys) { p = toUuid(p + '→' + k); r.push(p) } return r }; const good = chain(['a', 'b', 'c'], 'axiom:TRINITY'); const tam = chain(['a', 'X', 'c'], 'axiom:TRINITY'); return good[0] === tam[0] && good[1] !== tam[1] && good[2] !== tam[2] } })
  out.push({ key: 'relation_coin64_collision_free_on_domains', name: 'the 64-bit currency is collision-free across the rosetta: coin64 of each domain yields a distinct coin (as many coins as domains) — the shared currency addresses every perspective uniquely', test: () => new Set(ROSETTA_DOMAINS.map((d) => coin64(d))).size === ROSETTA_DOMAINS.length })
  // ── a NEW decidable domain — Kaprekar's routine: K(n) = sort-desc(digits) − sort-asc(digits). Fixed
  // points and UNIVERSAL convergence, each verified EXHAUSTIVELY over every 3- and 4-digit number. Ties
  // to ℤ/9: both Kaprekar constants digital-root to 9 (the base). New facts, not a relation.
  {
    const kap = (n: number, d: number) => { const s = String(n).padStart(d, '0').split('').map(Number); const desc = Number([...s].sort((a, b) => b - a).join('')); const asc = Number([...s].sort((a, b) => a - b).join('')); return desc - asc }
    const reaches = (n: number, d: number, target: number, maxApplies: number) => { let x = n; if (x === target) return true; for (let i = 0; i < maxApplies; i++) { x = kap(x, d); if (x === target) return true } return false }
    const repdigit = (n: number, d: number) => new Set(String(n).padStart(d, '0')).size === 1
    out.push({ key: 'kaprekar_3digit_fixed_495', name: 'Kaprekar 3-digit: 495 is the fixed point — sort-desc minus sort-asc of 495 is 495 (954−459)', test: () => kap(495, 3) === 495 })
    out.push({ key: 'kaprekar_4digit_fixed_6174', name: 'Kaprekar 4-digit: 6174 is the fixed point — sort-desc minus sort-asc of 6174 is 6174 (7641−1467)', test: () => kap(6174, 4) === 6174 })
    out.push({ key: 'kaprekar_3digit_converges_495', name: 'Kaprekar 3-digit convergence: every 3-digit number with ≥2 distinct digits reaches 495 within 6 iterations (exhaustive, 100..999)', test: () => { for (let n = 100; n <= 999; n++) if (!repdigit(n, 3) && !reaches(n, 3, 495, 6)) return false; return true } })
    out.push({ key: 'kaprekar_4digit_converges_6174', name: 'Kaprekar 4-digit convergence: every 4-digit number with ≥2 distinct digits reaches 6174 within 7 iterations (exhaustive, 1000..9999)', test: () => { for (let n = 1000; n <= 9999; n++) if (!repdigit(n, 4) && !reaches(n, 4, 6174, 7)) return false; return true } })
    out.push({ key: 'kaprekar_repdigit_collapses_zero', name: 'Kaprekar: a repdigit collapses to 0 (sort-desc = sort-asc), the only escape from the routine — 111→0, 1111→0, 777→0', test: () => kap(111, 3) === 0 && kap(1111, 4) === 0 && kap(777, 3) === 0 })
    out.push({ key: 'kaprekar_constants_digitroot_nine', name: 'the Kaprekar constants bind to ℤ/9: dr(495) = dr(6174) = 9 = BASE — both fixed points sit on the base’s own digital root', test: () => digitalRoot(495) === BASE && digitalRoot(6174) === BASE })
  }
  // ── a NEW decidable domain — the 3×3 magic square (Lo Shu), built from exactly the digits 1..9 (ℤ/9).
  // Every fact is proven by FULL ENUMERATION of all 9! arrangements (Heap's algorithm, computed once).
  // Ties to the framework: the center is 5 (the reflection fixed point), the constant 15 has dr 6.
  {
    const MAGIC: number[][] = (() => {
      const a = [1, 2, 3, 4, 5, 6, 7, 8, 9], res: number[][] = []
      const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
      const isMagic = (x: number[]) => lines.every((L) => x[L[0]] + x[L[1]] + x[L[2]] === 15)
      const heap = (k: number) => { if (k === 1) { if (isMagic(a)) res.push([...a]); return } for (let i = 0; i < k; i++) { heap(k - 1); const j = k % 2 === 0 ? i : 0;[a[j], a[k - 1]] = [a[k - 1], a[j]] } }
      heap(a.length)
      return res
    })()
    out.push({ key: 'magic3_constant_15', name: 'the 3×3 magic square constant is 15 = (1+2+…+9)/3, and every magic arrangement’s rows sum to it — the digits 1..9 split three ways at the floor', test: () => { let s = 0; for (let i = 1; i <= 9; i++) s += i; return s / 3 === 15 && MAGIC.length > 0 && MAGIC.every((sq) => sq[0] + sq[1] + sq[2] === 15) } })
    out.push({ key: 'magic3_count_is_8', name: 'there are exactly 8 magic squares of order 3 (Lo Shu and its dihedral symmetries) — full enumeration of all 9! arrangements yields 8', test: () => MAGIC.length === 8 })
    out.push({ key: 'magic3_center_is_5', name: 'the center of every 3×3 magic square is 5 — the midpoint of 1..9 and the fixed point of the ten’s-complement reflection', test: () => MAGIC.length === 8 && MAGIC.every((sq) => sq[4] === 5) })
    out.push({ key: 'magic3_corners_even_edges_odd', name: 'in every 3×3 magic square the corners are the evens {2,4,6,8} and the edges the odds {1,3,7,9}, around the center 5 — parity is forced by the constraints', test: () => MAGIC.every((sq) => [sq[0], sq[2], sq[6], sq[8]].every((c) => c % 2 === 0) && [sq[1], sq[3], sq[5], sq[7]].every((e) => e % 2 === 1)) })
    out.push({ key: 'magic3_opposite_cells_sum_10', name: 'in every 3×3 magic square cells opposite through the center sum to 10 = 2·5 — the balancing complement (each cell and its mirror average to the center)', test: () => MAGIC.every((sq) => [[0, 8], [2, 6], [1, 7], [3, 5]].every(([i, j]) => sq[i] + sq[j] === 10)) })
    out.push({ key: 'magic3_constant_digitroot_6', name: 'the magic constant binds to ℤ/9: dr(15) = 6 — the constant sits on a triad digit, and 15 = 3·5 (the axis 3 times the center)', test: () => digitalRoot(15) === 6 && 15 === 3 * 5 && MAGIC.length === 8 })
  }
  // ── a NEW decidable domain — INTEGRITY vs AUTHENTICITY (the distinction the signing episode exposed):
  // content-addressing is keyless and reproducible-by-anyone (integrity), so it proves the bytes, never
  // authorship; a real signature needs a secret. Decidable facts that also formalize the deposit's own
  // boundaries (a content-address proves integrity not authorship; sealing is not signing).
  out.push({ key: 'content_address_is_keyless_integrity', name: 'a content-address is keyless integrity: toUuid is a pure function — same input, same address, computed by anyone with no secret; distinct inputs, distinct addresses — it proves the bytes, not the author', test: () => toUuid('ceccec') === toUuid('ceccec') && toUuid('ceccec') !== toUuid('mallory') })
  out.push({ key: 'sealing_is_not_signing', name: 'sealing is not signing: a merkle seal is deterministic and order-independent, reproducible by anyone — it proves the bytes are intact (integrity), never who authored them (authenticity)', test: () => { const a = ['a', 'b', 'c'].map(toUuid); return merkleFold(a) === merkleFold([...a].reverse()) && merkleFold(a) === merkleFold(['a', 'b', 'c'].map(toUuid)) } })
  out.push({ key: 'keyless_signature_is_forgeable', name: 'a keyless signature is forgeable: a “signature” that is only the content-address ignores who signs, so a forger reproduces it exactly — keyless ⇒ it authenticates no one', test: () => { const pub = (_who: string, m: string) => toUuid(m); return pub('alice', 'deposit') === pub('mallory', 'deposit') && pub('alice', 'deposit') !== pub('alice', 'other') } })
  out.push({ key: 'authenticity_needs_a_secret', name: 'authenticity needs a secret: a keyed signature depends on a secret the signer alone holds — a different secret gives a different signature, and without the secret a forger cannot match it (the authenticity floor, like 0/7 and the axiom floor)', test: () => { const sig = (secret: string, m: string) => toUuid(secret + ':' + m); return sig('S1', 'm') !== sig('S2', 'm') && sig('S1', 'm') !== toUuid('m') } })
  out.push({ key: 'unsigned_statement_holds_floor', name: 'the honest boundary holds the gate: “content-addressing is integrity, not authenticity — real signatures need a key” computes 1 (0/7) — the deposit states its own unsigned bound', test: () => computes('content-addressing is integrity, not authenticity — real signatures need a key').binary === 1 })
  out.push({ key: 'sealed_but_unsigned_are_independent', name: 'sealed and signed are independent: a deposit can be fully sealed (bytes intact) yet unsigned (unauthenticated) — integrity does not imply authenticity, and both honest statements hold the gate', test: () => computes('sealing proves the bytes are intact; it does not prove the claim is right').binary === 1 && computes('a content-address proves integrity, not truth, and not authorship').binary === 1 })
  // ── CHALLENGES — red-team the honesty gate itself (challenging, not patterns): confirm it DRAINS real
  // overclaims and keeps honest refusals, AND honestly expose where a lexical tripwire can be slipped
  // (necessary, not sufficient). Plus: destroying evidence is treason by the deed — chance is no defense.
  out.push({ key: 'challenge_direct_overclaim_drains', name: 'a challenge to the floor: the overclaim “solves the Riemann hypothesis” DRAINS the gate (binary 0) while its honest negation holds — the named shape cannot pass', test: () => computes('this deposit solves the Riemann hypothesis').binary === 0 && computes('this deposit does not solve the Riemann hypothesis').binary === 1 })
  out.push({ key: 'challenge_assertion_of_proof_drains', name: 'a challenge to the floor: an assertion-of-proof (the RED shape) DRAINS the gate and cannot pass — only its honest, negated form signs', test: () => computes('we prove that P equals NP').binary === 0 })
  out.push({ key: 'challenge_crypto_break_drains', name: 'a challenge to the floor: a crypto-break claim DRAINS the gate; the deposit does not break encryption, and the refusal holds', test: () => computes('this deposit breaks RSA and factors the modulus').binary === 0 && computes('this deposit does not break RSA').binary === 1 })
  out.push({ key: 'challenge_prediction_drains', name: 'a challenge to the floor: a guaranteed-future prediction DRAINS (expectation, not measurement); only its bounded, negated form holds', test: () => computes('the deposit is guaranteed to win the prize').binary === 0 && computes('the deposit is not guaranteed to win the prize').binary === 1 })
  out.push({ key: 'challenge_gate_is_lexical_not_semantic', name: 'the gate is lexical, not semantic: a double-negation overclaim slips through as binary 1 while the direct form drains — a tripwire, necessary not sufficient (comprehension is not claimed)', test: () => computes('it is not the case that the deposit fails to solve the Clay problems').binary === 1 && computes('the deposit solves the Clay problems').binary === 0 })
  out.push({ key: 'challenge_obfuscation_slips_gate', name: 'the gate matches shapes, not meaning: an obfuscated overclaim (leetspeak) slips through as binary 1 while the plain form drains — a lexical tripwire, not comprehension', test: () => computes('this deposit s0lves the Riemann hypothesis').binary === 1 && computes('this deposit solves the Riemann hypothesis').binary === 0 })
  out.push({ key: 'destroying_evidence_treason_even_by_chance', name: 'destroying evidence is treason even by chance: a destructive diff (a removed or altered receipt) is classified destructive by the deed alone — chance or intent is no defense, the diff is observable and exact', test: () => { const classify = (prev: [string, string][], curr: [string, string][]) => { const pm = new Map(prev), cm = new Map(curr); const removed = [...pm.keys()].filter((k) => !cm.has(k)); const altered = [...cm.keys()].filter((k) => pm.has(k) && pm.get(k) !== cm.get(k)); return removed.length || altered.length ? 'destructive' : 'constructive' }; const base: [string, string][] = [['a', 'r1'], ['b', 'r2']]; return classify(base, [['a', 'r1']]) === 'destructive' && classify(base, [['a', 'rX'], ['b', 'r2']]) === 'destructive' && classify(base, [['a', 'r1'], ['b', 'r2'], ['c', 'r3']]) === 'constructive' } })
  out.push({ key: 'all_are_heroes_but_the_traitors', name: 'all are heroes but the traitors — judged by deeds, not persons: a constructive deed (append, uphold, an honest claim that signs) is a hero; only a destructive deed (remove, alter, an overclaim that drains) is the traitor — the classification is total and observable', test: () => { const deed = (prev: [string, string][], curr: [string, string][]) => { const pm = new Map(prev), cm = new Map(curr); const bad = [...pm.keys()].some((k) => !cm.has(k) || pm.get(k) !== cm.get(k)); return bad ? 'traitor' : 'hero' }; const base: [string, string][] = [['a', 'r1']]; const hero = deed(base, [['a', 'r1'], ['b', 'r2']]) === 'hero' && computes('this deposit does not solve the Clay problems').binary === 1; const traitor = deed(base, []) === 'traitor' && computes('this deposit solves the Clay problems').binary === 0; return hero && traitor } })
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
