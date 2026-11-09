// THE TERMINOLOGY — every ISO/IEC 4879:2024 clause this deposit realises, what realises it, and its coin.
//
// The types in src/quantum/hardware.ts are named by the standard's own terms (QuantumGate §3.4.2, QuantumCircuit §3.4.5,
// MeasurementCounts §3.2.16, AcceptedQuantumComputer §3.4.10), and this table is the one place that says which clause
// each type, function and sealed file stands for. Clause numbers and term names are read from the standard (ISO OBP,
// 2026-11-09); its definitions are not restated here. qpu's quantum-vocabulary.ts names all 86 terms; the installed
// @uuidna/qpu 1.0.1 does not export it, so this lists only the clauses realised in THIS tree, and says so.
//
// A TERM IS A COIN. Each carries its content address — toUuid of "ISO/IEC 4879:2024 <clause> <term>" — so any reader
// recomputes the same coin from the standard's own words, with no key and no registry.
import { toUuid } from '../0/index.ts'

/** where a clause is realised: a type or function in src/quantum, or a sealed Lean file in src/proof */
export type Realisation = { kind: 'type' | 'function' | 'lean'; name: string }
export type Term = { clause: string; term: string; realisedBy: readonly Realisation[]; coin: string }

const T = (name: string): Realisation => ({ kind: 'type', name })
const F = (name: string): Realisation => ({ kind: 'function', name })
const L = (name: string): Realisation => ({ kind: 'lean', name })

const REALISED: readonly [string, string, Realisation[]][] = [
  ['3.1.4', 'simulator', [F('simulate')]],
  ['3.2.1', 'Hilbert space', [T('Zw'), L('quantum_circuits.lean')]],
  ['3.2.7', 'quantum state', [F('phases'), L('quantum_circuits.lean')]],
  ['3.2.8', 'quantum superposition', [F('chshGates')]],
  ['3.2.10', 'quantum entanglement', [L('quantum_circuits.lean'), F('mermin'), L('quantum_octaves.lean')]],
  ['3.2.16', 'quantum measurement', [T('MeasurementCounts'), F('countsOf')]],
  ['3.3.3', 'qubit', [T('QuantumGate')]],
  ['3.3.5', 'physical qubit', [F('toQasm')]],
  ['3.4.2', 'quantum gate', [T('QuantumGate')]],
  ['3.4.3', 'unitary gate', [L('quantum_models.lean')]],
  ['3.4.5', 'quantum circuit', [T('QuantumCircuit'), F('chshGates'), F('toQasm')]],
  ['3.4.8', 'quantum processor', [T('AcceptedQuantumComputer')]],
  ['3.4.10', 'quantum computer', [T('AcceptedQuantumComputer'), F('ACCEPTED_HARDWARE')]],
  ['3.4.13', 'circuit-based quantum computing', [L('quantum_circuits.lean'), L('quantum_hardware.lean')]],
  ['3.4.14', 'one-way quantum computing', [L('quantum_models.lean'), F('cluster'), L('quantum_uuid_cluster.lean')]],
  ['3.4.15', 'adiabatic quantum computing', [L('quantum_models.lean')]],
  ['3.4.16', 'topological quantum computing', [L('quantum_models.lean')]],
  ['3.4.22', 'quantum simulator', [F('simulate'), F('mermin'), F('cluster')]],
  ['3.4.26', 'circuit-based quantum computer', [F('ACCEPTED_HARDWARE')]],
  ['3.4.31', 'quantum annealer', [L('quantum_models.lean')]],
  ['3.5.6', 'search algorithm', [L('quantum_textbooks.lean')]],
  ['3.5.7', 'hidden subgroup problem', [L('quantum_textbooks.lean')]],
  ['3.5.8', 'boson sampling', [L('quantum_models.lean')]],
]

/** the coin of a clause: the content address of the standard's own clause number and term */
export const coinOf = (clause: string, term: string): string => toUuid(`ISO/IEC 4879:2024 ${clause} ${term}`)

export const TERMS: readonly Term[] = REALISED.map(([clause, term, realisedBy]) => ({ clause, term, realisedBy, coin: coinOf(clause, term) }))
