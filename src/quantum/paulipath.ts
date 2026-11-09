// PAULI PATHS IN UUID SPACE — exact expectation values of any Clifford+T circuit whose qubits are UUID particles.
//
// EVERY QUBIT IS A PARTICLE OF A UUID. A UUID has 128 bits; the RFC 9562 version nibble and variant bits are fixed, so
// a version-4 UUID leaves 122 free bits, and each free bit is a qubit: the particle (uuid, bit), addressed by the BigInt
// uuid·128 + bit. The qubit address space is therefore the whole UUID space — 2^122 UUIDs × 122 particles — and a gate
// between particles of two different UUIDs is how they interact. Nothing is allocated for a particle a circuit never
// touches: it is |0⟩, and it contributes nothing.
//
// WHERE THE WIDTH LIMIT WENT. A state vector holds 2^n amplitudes and stops near fifty qubits. This never holds one. It
// carries the OBSERVABLE backwards through the circuit (the Heisenberg picture) as a sum of SPARSE Pauli strings — a map
// from particle to X, Y or Z, holding only the particles in the term — and reads ⟨0…0|Q|0…0⟩ at the end: the coefficient
// when Q has no X or Y, and 0 when it does. A Clifford gate (H, S, CNOT, CZ, the Paulis) maps one Pauli string to exactly
// one, and does so bijectively (Gottesman–Knill), so terms are updated in place and never merged. A T gate maps X and Y to
// a sum of two, so terms can double at each T the observable crosses while it anticommutes with Z there, and only then are
// equal strings merged. The bound is therefore neither the width nor the address space but the T-count — about 2^t terms
// at worst — and the particles in the observable's light cone. That is the honest edge of a classical computation: no
// known method runs an arbitrary T-count in polynomial time, and it is where a physical §3.4.8 processor is needed, which
// is what scripts/quantum-hardware.ts asks IBM's for.
//
// NO FLOAT ANYWHERE. Every coefficient is (a + b√2)/2^m with BigInt a, b: T contributes 1/√2 and nothing else this gate set
// does leaves ℤ[1/√2]. Per particle 1 is X, 2 is Z, 3 is Y (the tableau's (x, z) bits). src/proof/pauli_paths.lean decides
// every rule below against the 2×2 and 4×4 matrices in ℤ[ω], and the T-split cost law.

/** (a + b√2) / 2^m */
export type Q2 = { a: bigint; b: bigint; m: number }
export const q2 = (a: bigint, b = 0n, m = 0): Q2 => norm({ a, b, m })
const norm = (c: Q2): Q2 => {
  let { a, b, m } = c
  if (a === 0n && b === 0n) return { a: 0n, b: 0n, m: 0 }
  while (m > 0 && a % 2n === 0n && b % 2n === 0n) { a /= 2n; b /= 2n; m-- }
  return { a, b, m }
}
export const q2add = (x: Q2, y: Q2): Q2 => {
  const m = Math.max(x.m, y.m), sx = 1n << BigInt(m - x.m), sy = 1n << BigInt(m - y.m)
  return norm({ a: x.a * sx + y.a * sy, b: x.b * sx + y.b * sy, m })
}
export const q2neg = (x: Q2): Q2 => ({ a: -x.a, b: -x.b, m: x.m })
/** divide by √2: (a + b√2)/√2 = (2b + a√2)/2 */
export const q2halfRoot = (x: Q2): Q2 => norm({ a: 2n * x.b, b: x.a, m: x.m + 1 })
export const q2zero = (x: Q2): boolean => x.a === 0n && x.b === 0n
export const q2str = (x: Q2): string => {
  if (q2zero(x)) return '0'
  const num = x.b === 0n ? `${x.a}` : x.a === 0n ? `${x.b}√2` : `${x.a} ${x.b < 0n ? '−' : '+'} ${x.b < 0n ? -x.b : x.b}√2`
  return x.m === 0 ? num : `(${num})/${1n << BigInt(x.m)}`
}

/** a qubit address: any non-negative integer — a plain index, or a UUID particle from particle() */
export type Qubit = number | bigint
export type Gate =
  | { g: 'h' | 's' | 'sdg' | 'x' | 'y' | 'z' | 't' | 'tdg'; q: Qubit }
  | { g: 'cx' | 'cz'; q: Qubit; t: Qubit }
/** a sparse Pauli string: particle → 1 (X), 2 (Z) or 3 (Y); a particle absent is I */
export type Pauli = Map<bigint, number>
type Term = { p: Pauli; c: Q2 }

const id = (q: Qubit): bigint => BigInt(q)
const set = (p: Pauli, q: bigint, v: number) => { if (v === 0) p.delete(q); else p.set(q, v) }

/** G† P G for one gate, as the terms it becomes — one for a Clifford gate (the term itself, updated in place), one or two for T */
export const conjugate = (term: Term, gate: Gate): Term[] => {
  const q = id(gate.q), p = term.p
  let c = term.c
  const v = p.get(q) ?? 0, X = (v & 1) === 1, Z = (v & 2) === 2
  switch (gate.g) {
    case 'x': return [{ p, c: Z ? q2neg(c) : c }]
    case 'z': return [{ p, c: X ? q2neg(c) : c }]
    case 'y': return [{ p, c: X !== Z ? q2neg(c) : c }]
    case 'h':     // X ↔ Z, Y → −Y
      if (X && Z) c = q2neg(c)
      else if (X !== Z) set(p, q, X ? 2 : 1)
      return [{ p, c }]
    case 's':     // S† X S = −Y, S† Y S = X
      if (!X) return [{ p, c }]
      set(p, q, Z ? 1 : 3)
      return [{ p, c: Z ? c : q2neg(c) }]
    case 'sdg':   // S X S† = Y, S Y S† = −X
      if (!X) return [{ p, c }]
      set(p, q, Z ? 1 : 3)
      return [{ p, c: Z ? q2neg(c) : c }]
    case 't': {   // T† X T = (X − Y)/√2, T† Y T = (X + Y)/√2
      if (!X) return [{ p, c }]
      const h = q2halfRoot(c), py = new Map(p)
      set(p, q, 1); set(py, q, 3)
      return [{ p, c: h }, { p: py, c: Z ? h : q2neg(h) }]
    }
    case 'tdg': { // T X T† = (X + Y)/√2, T Y T† = (−X + Y)/√2
      if (!X) return [{ p, c }]
      const h = q2halfRoot(c), py = new Map(p)
      set(p, q, 1); set(py, q, 3)
      return [{ p, c: Z ? q2neg(h) : h }, { p: py, c: h }]
    }
    case 'cx': {  // Aaronson–Gottesman: sign flips iff x_c z_t (x_t ⊕ z_c ⊕ 1); x_t ^= x_c; z_c ^= z_t
      const t = id(gate.t), w = p.get(t) ?? 0, xt = (w & 1) === 1, zt = (w & 2) === 2
      if (X && zt && xt === Z) c = q2neg(c)
      set(p, t, X ? w ^ 1 : w)
      set(p, q, zt ? v ^ 2 : v)
      return [{ p, c }]
    }
    case 'cz': {  // CZ = H_t · CX · H_t, each self-inverse: conjugate by H_t, then CX, then H_t
      const t = gate.t
      return conjugate(term, { g: 'h', q: t }).flatMap((u) => conjugate(u, { g: 'cx', q: gate.q, t })).flatMap((u) => conjugate(u, { g: 'h', q: t }))
    }
  }
}

const keyOf = (p: Pauli): string => [...p.entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([q, v]) => `${q}${'IXZY'[v]}`).join(' ')

/** ⟨0…0| U† P U |0…0⟩ exactly, for U the circuit (applied first gate first) and P a sparse Pauli string with sign ±1 */
export const expectation = (circuit: readonly Gate[], observable: Pauli, opts: { sign?: 1 | -1; maxTerms?: number } = {}): { value: Q2; peakTerms: number } => {
  let terms: Term[] = [{ p: new Map(observable), c: q2(BigInt(opts.sign ?? 1)) }]
  let peak = 1
  const cap = opts.maxTerms ?? 1 << 22
  for (let i = circuit.length - 1; i >= 0; i--) {
    const g = circuit[i]
    if (g.g !== 't' && g.g !== 'tdg') { terms = terms.flatMap((u) => conjugate(u, g)); continue }   // a bijection: no merge
    const next = new Map<string, Term>()
    for (const term of terms) for (const u of conjugate(term, g)) {
      const k = keyOf(u.p), prev = next.get(k)
      const c = prev ? q2add(prev.c, u.c) : u.c
      if (q2zero(c)) next.delete(k); else next.set(k, { p: u.p, c })
    }
    terms = [...next.values()]
    peak = Math.max(peak, terms.length)
    if (terms.length > cap) throw new Error(`more than ${cap} Pauli terms at gate ${i} — the T-count, not the width, is the bound`)
  }
  let value = q2(0n)
  for (const t of terms) if ([...t.p.values()].every((v) => v === 2)) value = q2add(value, t.c)
  return { value, peakTerms: peak }
}

/** a sparse Pauli string from 'XZIY…' (qubit 0 first), or from [qubit, 'X' | 'Y' | 'Z'] pairs */
export const pauli = (s: string | readonly (readonly [Qubit, 'X' | 'Y' | 'Z'])[]): Pauli => {
  const p: Pauli = new Map()
  const pairs = typeof s === 'string' ? [...s].map((ch, q) => [q, ch] as const) : s
  for (const [q, ch] of pairs) if (ch === 'X' || ch === 'Y' || ch === 'Z') p.set(id(q), ch === 'X' ? 1 : ch === 'Z' ? 2 : 3)
  return p
}

export const tCount = (circuit: readonly Gate[]): number => circuit.filter((g) => g.g === 't' || g.g === 'tdg').length

// ── THE UUID PARTICLES ──────────────────────────────────────────────────────────────────────────────────────────────
/** bit positions of a UUID counted from the most significant (0 … 127): the version nibble is 48–51, the RFC variant 64–65 */
export const FREE_BITS: readonly number[] = Array.from({ length: 128 }, (_, i) => i).filter((i) => !(i >= 48 && i <= 51) && i !== 64 && i !== 65)
/** the 128-bit value of a UUID */
export const uuidValue = (uuid: string): bigint => {
  const hex = uuid.replace(/-/g, '').toLowerCase()
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new Error(`not a UUID: ${uuid}`)
  return BigInt('0x' + hex)
}
/** the particle (uuid, bit): its qubit address uuid·128 + bit — every particle of every UUID has its own */
export const particle = (uuid: string, bit: number): bigint => (uuidValue(uuid) << 7n) | BigInt(bit)
/** a UUID's 122 particles — its free bits, as qubit addresses */
export const particles = (uuid: string): bigint[] => FREE_BITS.map((b) => particle(uuid, b))
/** which UUID and bit a particle address belongs to */
export const ofParticle = (q: bigint): { uuid: string; bit: number } => {
  const hex = (q >> 7n).toString(16).padStart(32, '0')
  return { uuid: `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`, bit: Number(q & 127n) }
}
