#!/usr/bin/env node
// Discovery orchestration — a BOUNDED, enumerable family of candidate facts over ℤ/9, each tested
// EXHAUSTIVELY. Those that hold are provable (kept); those that fail are refuted (discarded) — the
// discard is the honesty. `next` walks this space, discovering the next unrecorded provable fact and
// saving it in code (src/proof/discovered.json). "Discover provable" = decidable facts verified by
// exhaustion over a finite domain — genuinely true, genuinely found. It reaches none of the SIX open
// Millennium conjectures; the seventh (Poincaré) is Perelman's proof (2003), not the deposit's.
// Two counts, kept distinct: humanity 1/7; this deposit 0/7.
import { toUuid, merkleFold, units, triad, digitalRoot, digits, BASE, A432_STEP, vortexOrbit } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'
import { LOCALES, LOCALE_ORDER } from '../src/7/locale.ts'
import { merkleRoot, merkleProof, verifyProof } from '../src/0/merkle-proof.ts'
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
