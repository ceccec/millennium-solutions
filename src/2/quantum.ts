// Classical state-vector simulator of a quantum algorithm — makes the abstract's "classical
// simulator of quantum algorithms" TRUE and demonstrated (it was asserted but never shown).
// Builds a Bell state (H · CNOT) and computes measurement probabilities. Honestly bounded:
// exact for small systems, EXPONENTIAL in qubit count (2^n amplitudes) — no quantum advantage.
const S = Math.SQRT1_2 // 1/√2

// Hadamard on qubit t of an n-qubit real state vector (these gates keep amplitudes real).
function H(state: number[], t: number): number[] {
  const out = state.slice()
  for (let i = 0; i < state.length; i++) if (((i >> t) & 1) === 0) {
    const j = i | (1 << t), a = state[i], b = state[j]
    out[i] = (a + b) * S; out[j] = (a - b) * S
  }
  return out
}
// CNOT (control c, target t): flip target where control is set (gather form; self-inverse).
function CNOT(state: number[], c: number, t: number): number[] {
  return state.map((_, i) => (((i >> c) & 1) === 1 ? state[i ^ (1 << t)] : state[i]))
}
const r = (x: number) => (Math.round(x * 1000) / 1000).toFixed(3)

export function report(): string {
  // 2-qubit Bell state: H(q0) then CNOT(q0→q1) → (|00⟩ + |11⟩)/√2.  index bit b = qubit b.
  let s = [1, 0, 0, 0]
  s = H(s, 0); s = CNOT(s, 0, 1)
  const p = s.map((a) => a * a) // |amplitude|²
  const P = { '00': p[0], '01': p[2], '10': p[1], '11': p[3] } // label q1q0
  const q0_0 = p[0] + p[2], q0_1 = p[1] + p[3] // marginal on q0

  // single-qubit superposition
  const one = H([1, 0], 0).map((a) => a * a)

  let o = 'classical simulator of a quantum algorithm — the paradox computes:\n\n'
  o += '  2-qubit circuit:  H(q0) · CNOT(q0→q1)  →  (|00⟩ + |11⟩)/√2\n'
  o += '  measurement probabilities (|amplitude|²):\n'
  o += '    P(00)=' + r(P['00']) + '  P(01)=' + r(P['01']) + '  P(10)=' + r(P['10']) + '  P(11)=' + r(P['11']) + '\n'
  o += '    → perfect correlation: the two qubits always agree (both 0 or both 1).\n\n'
  o += '  no-signaling (the paradox, computed): each qubit\'s MARGINAL stays 50/50:\n'
  o += '    P(q0=0)=' + r(q0_0) + '  P(q0=1)=' + r(q0_1) + '  → measuring q1 sends NOTHING to q0.\n'
  o += '    correlation without communication — the no-communication theorem, computed.\n\n'
  o += '  superposition (0-and-1), one qubit:  H|0⟩ → P(0)=' + r(one[0]) + '  P(1)=' + r(one[1]) + '\n'
  o += '    before measurement both; after, one — computed exactly, classically.\n\n'
  o += 'HONEST: this is CLASSICAL state-vector simulation — exact for small systems, but the state has\n'
  o += '2^n amplitudes, so it is EXPONENTIAL in qubit count: NO quantum advantage, NOT a quantum\n'
  o += 'computer. The Bell correlation carries NO message (marginals unchanged). The paradox COMPUTES\n'
  o += 'as simulation, not as quantum hardware. entails → 0/7.'
  return o
}
