// ACCEPTED QUANTUM HARDWARE — the systems this deposit accepts as real quantum computers, and the one test that lets
// a run on them count as hardware evidence.
//
// THE DEFINITION, from ISO/IEC 4879:2024 and ISO/IEC 2382:2015 (read on the ISO OBP, 2026-11-09). A real quantum
// computer is all three at once: HARDWARE (2382: physical components of an information system), a QUANTUM PROCESSOR
// (4879 §3.4.8 over §3.4.1 and §3.3.5: a tangible device processing information held in physical qubits, using
// superposition and entanglement essentially) and a COMPUTER (§3.4.10: fully programmable, any unitary on its Hilbert
// space). This repository's own machine passes the first and fails the second, and a classical program that prints
// S ≈ 2.828 is §3.4.22, a quantum simulator. What separates the two is WHERE THE COUNTS COME FROM.
//
// THE TEST is CHSH on a Bell pair: four measurement settings, and S > 2 from the device's own counts. No classical
// device exceeds 2 (Bell); quantum mechanics reaches 2√2 (Tsirelson). The verdict below is decided on exact integers,
// so a float never stands between the counts and the answer. A wrong gate or a noisy device can only LOWER S — no
// error in this file can manufacture S > 2 from classical counts — so a false negative is possible and a false
// positive is not. Not loophole-free: it trusts the provider's device and readout.
//
// WHY NOT src/mcp/connectors.ts. A connector is read-only by rule. Submitting a job WRITES to somebody else's system
// and spends the depositor's QPU minutes, so accepted hardware is its own registry and that decision stays visible.
// No fetch is reachable from this module; the run lives in scripts/quantum-hardware.ts.

/** an ISO/IEC 4879 §3.4.10 quantum computer this deposit accepts runs on — somebody else's tangible device */
export type AcceptedQuantumComputer = {
  name: string
  /** Whose system it is. Every one belongs to somebody else. */
  attribution: string
  /** The REST base the run talks to. */
  base: string
  /** The credentials the depositor sets. Read from the environment by the run, never stored or printed. */
  env: readonly string[]
  /** What access costs, as the provider states it. */
  plan: string
  /** The native two-qubit gate this file's circuits use. A backend whose basis lacks it is refused by name. */
  entangler: 'cz'
  /** What a passing run does NOT establish. Non-empty by rule. */
  notFor: string
}

export const ACCEPTED_HARDWARE: readonly AcceptedQuantumComputer[] = [
  {
    name: 'ibm-quantum',
    attribution: 'IBM Quantum Platform (quantum.cloud.ibm.com), Qiskit Runtime REST API, under IBM\'s terms of use',
    base: 'https://quantum.cloud.ibm.com/api/v1',
    env: ['IBM_QUANTUM_TOKEN', 'IBM_QUANTUM_CRN'],
    plan: 'Open Plan: the RU equivalent of up to 10 minutes per 28-day rolling window; 1 RU = 1 minute of QPU compute time; us-east only',
    entangler: 'cz',
    notFor: 'a loophole-free Bell test (the device and readout are trusted); any claim about the machine this repository runs on; any speedup',
  },
]

// ── THE CIRCUITS, AS DATA ────────────────────────────────────────────────────────────────────────────────────────
// Native gates only (rz, sx, cz), because the provider runs circuits as written for its device. The same gate list is
// emitted as OpenQASM 3 and simulated by the test, so the circuit that is sent is the circuit that was checked.

/** ISO/IEC 4879 §3.4.2 quantum gate, in the device's native set */
export type QuantumGate = { g: 'rz'; q: 0 | 1; angle: number } | { g: 'sx'; q: 0 | 1 } | { g: 'cz' }
/** ISO/IEC 4879 §3.4.5 quantum circuit: a sequence of quantum gates (measurement is appended by toQasm) */
export type QuantumCircuit = readonly QuantumGate[]

const PI = Math.PI
/** H, up to global phase: RZ(π/2)·SX·RZ(π/2). */
const h = (q: 0 | 1): QuantumGate[] => [{ g: 'rz', q, angle: PI / 2 }, { g: 'sx', q }, { g: 'rz', q, angle: PI / 2 }]
/** RY(φ), up to global phase, applied left to right: RZ(−π), SX, RZ(π − φ), SX. */
const ry = (q: 0 | 1, phi: number): QuantumGate[] => [{ g: 'rz', q, angle: -PI }, { g: 'sx', q }, { g: 'rz', q, angle: PI - phi }, { g: 'sx', q }]

/** The four CHSH settings: Alice measures along 0 or π/2 in the XZ plane, Bob along π/4 or −π/4. Sign −1 on the last. */
export const SETTINGS = [
  { a: 0, b: PI / 4, sign: 1 },
  { a: 0, b: -PI / 4, sign: 1 },
  { a: PI / 2, b: PI / 4, sign: 1 },
  { a: PI / 2, b: -PI / 4, sign: -1 },
] as const

/** Bell pair (H, then CX as H·CZ·H), then each side rotated so a Z measurement reads its setting's axis. */
export const chshGates = (s: { a: number; b: number }): QuantumCircuit => [...h(0), ...h(1), { g: 'cz' }, ...h(1), ...ry(0, -s.a), ...ry(1, -s.b)]

/** OpenQASM 3 on two physical qubits. c[0] is Alice (p), c[1] is Bob (q). */
export const toQasm = (gates: QuantumCircuit, p: number, q: number): string => {
  const at = (i: 0 | 1) => `$${i === 0 ? p : q}`
  const body = gates.map((x) => (x.g === 'cz' ? `cz ${at(0)}, ${at(1)};` : x.g === 'sx' ? `sx ${at(x.q)};` : `rz(${x.angle}) ${at(x.q)};`))
  return ['OPENQASM 3.0;', 'include "stdgates.inc";', 'bit[2] c;', ...body, `c[0] = measure ${at(0)};`, `c[1] = measure ${at(1)};`].join(' ')
}

// ── THE VERDICT, ON EXACT INTEGERS ───────────────────────────────────────────────────────────────────────────────
// Per setting i: D_i = n00 + n11 − n01 − n10 and N_i = the shots, so E_i = D_i / N_i and S = Σ sign_i · E_i.
// S > 2  ⇔  Σ sign_i · D_i · Π_{j≠i} N_j  >  2 · Π N_j, which BigInt decides with no rounding anywhere. The same rule,
// its one-count controls on both sides of 2, and the classical bound itself are sealed in src/proof/quantum_hardware.lean.

/** ISO/IEC 4879 §3.2.16 quantum measurement, as the counts of its four two-bit outcomes */
export type MeasurementCounts = { n00: number; n01: number; n10: number; n11: number }

export const chshVerdict = (counts: readonly MeasurementCounts[]): { S: number; exceedsClassical: boolean; shots: number[] } => {
  if (counts.length !== SETTINGS.length) throw new Error(`CHSH needs ${SETTINGS.length} settings, got ${counts.length}`)
  const D = counts.map((c) => BigInt(c.n00 + c.n11 - c.n01 - c.n10))
  const N = counts.map((c) => BigInt(c.n00 + c.n01 + c.n10 + c.n11))
  if (N.some((n) => n === 0n)) throw new Error('a setting with no shots decides nothing')
  const all = N.reduce((x, y) => x * y, 1n)
  const lhs = D.reduce((sum, d, i) => sum + BigInt(SETTINGS[i].sign) * d * (all / N[i]), 0n)
  const S = counts.reduce((s, c, i) => s + SETTINGS[i].sign * (c.n00 + c.n11 - c.n01 - c.n10) / (c.n00 + c.n01 + c.n10 + c.n11), 0)
  return { S, exceedsClassical: lhs > 2n * all, shots: N.map(Number) }
}

// ── THE SAME GATES, SIMULATED — §3.4.22, and labelled so wherever it is shown ───────────────────────────────────
// Exact two-qubit state-vector evolution of the gate list above. It proves the circuits are the CHSH circuits (the
// ideal device would give S = 2√2) and it is never evidence of hardware: it is a classical program by definition.

type C = [number, number]
const mul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]]
const add = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]]
const ONE_GATE: Record<'sx', [C, C, C, C]> = { sx: [[0.5, 0.5], [0.5, -0.5], [0.5, -0.5], [0.5, 0.5]] }

/** Probabilities of c = 00, 01, 10, 11 as [p(a=0,b=0), p(a=0,b=1), p(a=1,b=0), p(a=1,b=1)]. Index bit 0 = qubit 0. */
export const simulate = (gates: QuantumCircuit): [number, number, number, number] => {
  let s: C[] = [[1, 0], [0, 0], [0, 0], [0, 0]]
  for (const x of gates) {
    if (x.g === 'cz') { s = s.map((v, i) => (i === 3 ? [-v[0], -v[1]] : v)); continue }
    const m: [C, C, C, C] = x.g === 'sx' ? ONE_GATE.sx : [[Math.cos(x.angle / 2), -Math.sin(x.angle / 2)], [0, 0], [0, 0], [Math.cos(x.angle / 2), Math.sin(x.angle / 2)]]
    const bit = 1 << x.q, next: C[] = s.map(() => [0, 0])
    for (let i = 0; i < 4; i++) {
      if (i & bit) continue
      const j = i | bit
      next[i] = add(mul(m[0], s[i]), mul(m[1], s[j]))
      next[j] = add(mul(m[2], s[i]), mul(m[3], s[j]))
    }
    s = next
  }
  const p = s.map((v) => v[0] * v[0] + v[1] * v[1])
  return [p[0], p[2], p[1], p[3]]
}

// ── ANY WIDTH: the octave proofs, ported ────────────────────────────────────────────────────────────────────────
// src/proof/quantum_octaves.lean and quantum_octave_128.lean seal the octaves 2 … 128. The same two computations run
// here for ANY n — no cap — so a width taken from a UUID (124 = 128 minus the version hex digit, 122 minus the variant
// bits too) is answered by the method the kernel checked at the octaves, not by a formula typed beside it.

/** The qubits a UUID's free fields carry: all 128 bits, minus the version nibble (one hex digit), minus the 2 variant
 *  bits. Read from the UUID's own fields, so a nil or non-RFC UUID says so instead of being counted. */
export const qubitsOf = (uuid: string): { bits: 128; version: number; variantRfc: boolean; minusVersionHex: number; free: number } => {
  const hex = uuid.replace(/-/g, '').toLowerCase()
  if (!/^[0-9a-f]{32}$/.test(hex)) throw new Error(`not a UUID: ${uuid}`)
  const version = parseInt(hex[12], 16), variantRfc = (parseInt(hex[16], 16) & 0b1100) === 0b1000
  return { bits: 128, version, variantRfc, minusVersionHex: 128 - 4, free: 128 - 4 - (variantRfc ? 2 : 0) }
}

// THE LITERAL PORT. Each definition below is quantum_circuits.lean / quantum_octaves.lean transcribed one for one — the
// same name, the same arithmetic in ℤ[ω] (a + bω + cω² + dω³, ω⁴ = −1), BigInt where Lean has Int — so a width the
// kernel did not see is answered by the very definitions it checked at the octaves.

export type Zw = readonly [bigint, bigint, bigint, bigint]
export const zadd = (x: Zw, y: Zw): Zw => [x[0] + y[0], x[1] + y[1], x[2] + y[2], x[3] + y[3]]
export const zmul = ([a, b, c, d]: Zw, [e, f, g, h]: Zw): Zw =>
  [a * e - b * h - c * g - d * f, a * f + b * e - c * h - d * g, a * g + b * f + c * e - d * h, a * h + b * g + c * f + d * e]
export const wpow = (k: number): Zw =>
  ([[1n, 0n, 0n, 0n], [0n, 1n, 0n, 0n], [0n, 0n, 1n, 0n], [0n, 0n, 0n, 1n], [-1n, 0n, 0n, 0n], [0n, -1n, 0n, 0n], [0n, 0n, -1n, 0n], [0n, 0n, 0n, -1n]] as Zw[])[k % 8]
/** Lean `row`: Pascal's row n, built row by row */
export const row = (n: number): bigint[] => { let r = [1n]; for (let i = 0; i < n; i++) r = [0n, ...r].map((v, j) => v + (r[j] ?? 0n)); return r }
/** Lean `re4`: Re(iᵏ) */
export const re4 = (k: number): bigint => [1n, 0n, -1n, 0n][k % 4]
/** Lean `phases`: the GHZ phases of a string with k Y's among n Paulis, carried qubit by qubit — up and down */
export const phases = (k: number, n: number): [Zw, Zw] => {
  let acc: [Zw, Zw] = [[1n, 0n, 0n, 0n], [1n, 0n, 0n, 0n]]
  for (let j = 0; j < n; j++) if (j < k) acc = [zmul(acc[0], wpow(2)), zmul(acc[1], wpow(6))]
  return acc
}
/** Lean `twiceExpect`: up phase + down phase = 2 × the string's GHZ expectation */
export const twiceExpect = (k: number, n: number): Zw => zadd(...phases(k, n))
/** Lean `twiceQuantum`: Σ_k C(n, k) · Re(iᵏ) · 2⟨string_k⟩ */
export const twiceQuantum = (n: number): bigint => { const r = row(n); let acc = 0n; for (let k = 0; k <= n; k++) acc += r[k] * re4(k) * twiceExpect(k, n)[0]; return acc }
/** Lean `reach`: the eighths of the ring the classical phase can stand on after n parties */
export const reach = (n: number): number[] => {
  let r = [0]
  for (let i = 0; i < n; i++) { const prev = r; r = [0, 1, 2, 3, 4, 5, 6, 7].filter((x) => prev.some((s) => [1, 3, 5, 7].some((e) => (s + e) % 8 === x))) }
  return r
}
/** Lean `expectationsReal`: every string's expectation is real, Re(iᵏ) */
export const expectationsReal = (n: number): boolean => {
  for (let k = 0; k <= n; k++) { const t = twiceExpect(k, n); if (t[0] !== 2n * re4(k) || t[1] !== 0n || t[2] !== 0n || t[3] !== 0n) return false }
  return true
}

/** Mermin on the n-qubit GHZ state, for any n, composed from the literal port above: quantum = twiceQuantum / 2, and the
 *  classical maximum 2^(n/2) when the phase can stand on eighth 0 of the ring (Re = 1), else 2^((n−1)/2) (Re = √2/2). */
export const mermin = (n: number): { n: number; quantum: bigint; classical: bigint; lead: bigint; reach: number[]; real: boolean } => {
  if (!Number.isInteger(n) || n < 1) throw new Error(`n must be a positive integer, got ${n}`)
  const r = reach(n), quantum = twiceQuantum(n) / 2n
  const classical = r.includes(0) ? 1n << BigInt(n / 2) : 1n << BigInt((n - 1) / 2)
  return { n, quantum, classical, lead: quantum / classical, reach: r, real: expectationsReal(n) }
}

/** The linear cluster state on n qubits — |+⟩ⁿ, then CZ on each neighbouring pair — by its stabilizers, propagated
 *  through every CZ with a Pauli tableau (Gottesman–Knill), so n = 124 costs n² bit operations, not 2¹²⁴ amplitudes.
 *  Returns each generator as a Pauli string and whether all are the cluster's K_j = Z_{j−1} X_j Z_{j+1} with sign +. */
export const cluster = (n: number): { n: number; stabilizers: string[]; isCluster: boolean; commute: boolean } => {
  if (!Number.isInteger(n) || n < 2) throw new Error(`a cluster needs at least 2 qubits, got ${n}`)
  const gens = Array.from({ length: n }, (_, j) => ({ x: Array.from({ length: n }, (_, q) => q === j), z: Array<boolean>(n).fill(false), sign: false }))
  for (let a = 0; a + 1 < n; a++) {
    const b = a + 1
    for (const g of gens) {
      g.sign = g.sign !== (g.x[a] && g.x[b] && (g.z[a] !== g.z[b]))
      g.z[a] = g.z[a] !== g.x[b]
      g.z[b] = g.z[b] !== g.x[a]
    }
  }
  const str = (g: (typeof gens)[number]) => (g.sign ? '-' : '') + g.x.map((x, q) => (x ? (g.z[q] ? 'Y' : 'X') : g.z[q] ? 'Z' : 'I')).join('')
  const want = (j: number) => Array.from({ length: n }, (_, q) => (q === j ? 'X' : Math.abs(q - j) === 1 ? 'Z' : 'I')).join('')
  const stabilizers = gens.map(str)
  const symp = (p: (typeof gens)[number], q: (typeof gens)[number]) => p.x.reduce((acc, _, i) => acc !== ((p.x[i] && q.z[i]) !== (p.z[i] && q.x[i])), false)
  const commute = gens.every((p) => gens.every((q) => !symp(p, q)))
  return { n, stabilizers, isCluster: stabilizers.every((s, j) => s === want(j)), commute }
}

/** Measurement counts from per-shot register values, bit 0 = c[0] (Alice), bit 1 = c[1] (Bob). */
export const countsOf = (values: readonly number[]): MeasurementCounts => {
  const c = { n00: 0, n01: 0, n10: 0, n11: 0 }
  for (const v of values) c[`n${v & 1}${(v >> 1) & 1}` as keyof MeasurementCounts]++
  return c
}
