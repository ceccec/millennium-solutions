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

export type QuantumHardware = {
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

export const ACCEPTED_HARDWARE: readonly QuantumHardware[] = [
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

export type Gate = { g: 'rz'; q: 0 | 1; angle: number } | { g: 'sx'; q: 0 | 1 } | { g: 'cz' }

const PI = Math.PI
/** H, up to global phase: RZ(π/2)·SX·RZ(π/2). */
const h = (q: 0 | 1): Gate[] => [{ g: 'rz', q, angle: PI / 2 }, { g: 'sx', q }, { g: 'rz', q, angle: PI / 2 }]
/** RY(φ), up to global phase, applied left to right: RZ(−π), SX, RZ(π − φ), SX. */
const ry = (q: 0 | 1, phi: number): Gate[] => [{ g: 'rz', q, angle: -PI }, { g: 'sx', q }, { g: 'rz', q, angle: PI - phi }, { g: 'sx', q }]

/** The four CHSH settings: Alice measures along 0 or π/2 in the XZ plane, Bob along π/4 or −π/4. Sign −1 on the last. */
export const SETTINGS = [
  { a: 0, b: PI / 4, sign: 1 },
  { a: 0, b: -PI / 4, sign: 1 },
  { a: PI / 2, b: PI / 4, sign: 1 },
  { a: PI / 2, b: -PI / 4, sign: -1 },
] as const

/** Bell pair (H, then CX as H·CZ·H), then each side rotated so a Z measurement reads its setting's axis. */
export const chshGates = (s: { a: number; b: number }): Gate[] => [...h(0), ...h(1), { g: 'cz' }, ...h(1), ...ry(0, -s.a), ...ry(1, -s.b)]

/** OpenQASM 3 on two physical qubits. c[0] is Alice (p), c[1] is Bob (q). */
export const toQasm = (gates: readonly Gate[], p: number, q: number): string => {
  const at = (i: 0 | 1) => `$${i === 0 ? p : q}`
  const body = gates.map((x) => (x.g === 'cz' ? `cz ${at(0)}, ${at(1)};` : x.g === 'sx' ? `sx ${at(x.q)};` : `rz(${x.angle}) ${at(x.q)};`))
  return ['OPENQASM 3.0;', 'include "stdgates.inc";', 'bit[2] c;', ...body, `c[0] = measure ${at(0)};`, `c[1] = measure ${at(1)};`].join(' ')
}

// ── THE VERDICT, ON EXACT INTEGERS ───────────────────────────────────────────────────────────────────────────────
// Per setting i: D_i = n00 + n11 − n01 − n10 and N_i = the shots, so E_i = D_i / N_i and S = Σ sign_i · E_i.
// S > 2  ⇔  Σ sign_i · D_i · Π_{j≠i} N_j  >  2 · Π N_j, which BigInt decides with no rounding anywhere. The same rule,
// its one-count controls on both sides of 2, and the classical bound itself are sealed in src/proof/quantum_hardware.lean.

export type Counts = { n00: number; n01: number; n10: number; n11: number }

export const chshVerdict = (counts: readonly Counts[]): { S: number; exceedsClassical: boolean; shots: number[] } => {
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
export const simulate = (gates: readonly Gate[]): [number, number, number, number] => {
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

/** Counts from per-shot register values, bit 0 = c[0] (Alice), bit 1 = c[1] (Bob). */
export const countsOf = (values: readonly number[]): Counts => {
  const c = { n00: 0, n01: 0, n10: 0, n11: 0 }
  for (const v of values) c[`n${v & 1}${(v >> 1) & 1}` as keyof Counts]++
  return c
}
