// THE TERMINOLOGY — all 86 terms of ISO/IEC 4879:2024, clauses 3.1.1 to 3.6.4, each a coin, each with where it is realised.
//
// The types in src/quantum/hardware.ts are named by the standard's own terms (QuantumGate §3.4.2, QuantumCircuit §3.4.5,
// MeasurementCounts §3.2.16, AcceptedQuantumComputer §3.4.10). This table is the one place that says which clause each
// type, function and sealed file stands for. Clause numbers and terms are the standard's (read on the ISO OBP,
// 2026-11-09); its definitions are not restated.
//
// EVERY TERM IS REALISED SOMEWHERE, AND THE TABLE SAYS WHERE. `here` names this tree's types, functions and sealed Lean
// files; `qpu` names the check that realises the term in qpu — its src/quantum/VOCABULARY.md and quantum-vocabulary.ts at
// commit b2b455bb, which is NOT yet on github.com/uuidna/qpu (its public main is behind) and which the installed
// @uuidna/qpu 1.0.1 does not export. So `qpu` is a pointer into a sibling's local tree, said as such, not a public
// citation; a term realised only there is counted apart from one realised here.
//
// A TERM IS A COIN: toUuid of "ISO/IEC 4879:2024 <clause> <term>", recomputable by anyone from the standard's own words.
import { toUuid, merkleFold } from '../0/index.ts'

/** where a clause is realised in this tree: a type or function in src/quantum, or a sealed Lean file in src/proof */
export type Realisation = { kind: 'type' | 'function' | 'lean'; name: string }
/** EACH COIN HOLDS ITS SKILL AND ITS TOOLS. The skill is the standard's own section the term belongs to, with the ESCO
 *  search for it (the EU skills taxonomy, as uuidna's skills carry); the tools are what computes or verifies the term —
 *  the entry point that runs each realisation (an npm script or MCP suite), and qpu's check. */
export type Skill = { family: string; esco: string }
export type Term = { clause: string; term: string; here: readonly Realisation[]; qpu: string; coin: string; skill: Skill; tools: readonly string[] }

/** the standard's six sections, as titled in ISO/IEC 4879:2024 clause 3 */
const SECTIONS: Readonly<Record<string, string>> = {
  '3.1': 'Background', '3.2': 'Quantum physics background', '3.3': 'Quantum information',
  '3.4': 'Quantum processing', '3.5': 'Quantum technologies', '3.6': 'Related quantum technologies',
}
const esco = (text: string) => `https://ec.europa.eu/esco/api/search?text=${encodeURIComponent(text)}&type=skill`

/** the entry point that runs a realisation: every function in hardware.ts runs under one of two npm scripts, every Lean
 *  file under the kernel check. Derived from what calls what, and checked by unresolvedTools against the tree. */
const RUNS: Readonly<Record<string, string>> = {
  simulate: 'npm run quantum:hardware', chshGates: 'npm run quantum:hardware', toQasm: 'npm run quantum:hardware',
  countsOf: 'npm run quantum:hardware', ACCEPTED_HARDWARE: 'npm run quantum:hardware',
  mermin: 'npm run quantum:octave', cluster: 'npm run quantum:octave', phases: 'npm run quantum:octave',
}
const toolsOf = (here: readonly Realisation[], qpu: string): string[] => [...new Set([
  ...here.flatMap((r) => r.kind === 'lean' ? [`npm run lean · ${r.name}`] : r.kind === 'function' ? [`${r.name}()`, RUNS[r.name] ?? ''] : [r.name]),
  `qpu check · ${qpu}`,
].filter(Boolean))]

/** qpu's realising checks: its VOCABULARY.md at this commit, local to its tree, not yet pushed */
export const QPU_VOCABULARY = { repo: 'uuidna/qpu', commit: 'b2b455bb91633ff97498dde0bd8243fa625f3148', file: 'src/quantum/VOCABULARY.md', pushed: false } as const

/** the standard's 86 clauses: [clause, term, qpu's check]. 3.5.7 is the standard's "hidden subgroup problem"; qpu's
 *  table shortens it to "hidden subgroup", and the coin is minted from the standard's words. */
const ISO_4879: readonly [string, string, string][] = [
  ['3.1.1', 'model', 'model'], ['3.1.2', 'model parameter', 'parameter'], ['3.1.3', 'machine learning', 'learning'],
  ['3.1.4', 'simulator', 'simulator'], ['3.1.5', 'program', 'program'], ['3.1.6', 'programming language', 'language'],
  ['3.1.7', 'programming', 'programming'], ['3.1.8', 'coding', 'programming'], ['3.1.9', 'algorithm', 'algorithm'],
  ['3.2.1', 'Hilbert space', 'hilbert'], ['3.2.2', 'operator', 'operator'], ['3.2.3', 'quantum physics', 'physics'],
  ['3.2.4', 'quantum, adjective', 'adjective'], ['3.2.5', 'quantum, noun', 'noun'], ['3.2.6', 'quantum system', 'system'],
  ['3.2.7', 'quantum state', 'state'], ['3.2.8', 'quantum superposition', 'superposition'], ['3.2.9', 'basis states', 'basis'],
  ['3.2.10', 'quantum entanglement', 'entanglement'], ['3.2.11', 'quantum operator', 'hamiltonian'], ['3.2.12', 'Hamiltonian', 'hamiltonian'],
  ['3.2.13', 'eigenstate', 'eigenstate'], ['3.2.14', 'eigenvalue', 'eigenvalue'], ['3.2.15', 'eigenspace', 'eigenspace'],
  ['3.2.16', 'quantum measurement', 'measurement'], ['3.2.17', 'projective measurement', 'projective'], ['3.2.18', 'quantum coherence', 'coherence'],
  ['3.2.19', 'decoherence', 'decoherence'], ['3.2.20', 'coherence time', 'coherenceTime'], ['3.2.21', 'relaxation time', 'relaxation'],
  ['3.3.1', 'quantum information', 'information'], ['3.3.2', 'quantum encoding', 'encoding'], ['3.3.3', 'qubit', 'qubit'],
  ['3.3.4', 'qudit', 'qudit'], ['3.3.5', 'physical qubit', 'physicalQubit'], ['3.3.6', 'physical qudit', 'physicalQudit'],
  ['3.3.7', 'logical qubit', 'logicalQubit'], ['3.3.8', 'logical qudit', 'logicalQudit'], ['3.3.9', 'logical operator', 'logicalOperator'],
  ['3.3.10', 'state fidelity', 'stateFidelity'], ['3.3.11', 'fidelity', 'fidelity'], ['3.3.12', 'process fidelity', 'processFidelity'],
  ['3.4.1', 'quantum information processing', 'processing'], ['3.4.2', 'quantum gate', 'gate'], ['3.4.3', 'unitary gate', 'unitary'],
  ['3.4.4', 'gate fidelity', 'fidelity'], ['3.4.5', 'quantum circuit', 'circuit'], ['3.4.6', 'quantum error correction', 'correction'],
  ['3.4.7', 'quantum error mitigation', 'mitigation'], ['3.4.8', 'quantum processor', 'processor'], ['3.4.9', 'quantum algorithm', 'algorithm'],
  ['3.4.10', 'quantum computer', 'computer'], ['3.4.11', 'quantum computing', 'computing'], ['3.4.12', 'fault-tolerant quantum computing', 'faultTolerant'],
  ['3.4.13', 'circuit-based quantum computing', 'circuit'], ['3.4.14', 'one-way quantum computing', 'oneWay'], ['3.4.15', 'adiabatic quantum computing', 'adiabatic'],
  ['3.4.16', 'topological quantum computing', 'topological'], ['3.4.17', 'quantum code', 'code'], ['3.4.18', 'quantum coding', 'codingThreshold'],
  ['3.4.19', 'quantum coding', 'codingCorrected'], ['3.4.20', 'quantum coding', 'codingDevice'], ['3.4.21', 'quantum programming', 'programming'],
  ['3.4.22', 'quantum simulator', 'simulator'], ['3.4.23', 'quantum simulator', 'simulatorModel'], ['3.4.24', 'digital quantum simulator', 'digital'],
  ['3.4.25', 'analogue quantum simulator', 'analogue'], ['3.4.26', 'circuit-based quantum computer', 'circuitComputer'], ['3.4.27', 'one-way quantum computer', 'oneWay'],
  ['3.4.28', 'adiabatic quantum computer', 'adiabatic'], ['3.4.29', 'quantum memory', 'memory'], ['3.4.30', 'simulator', 'classicalSimulator'],
  ['3.4.31', 'quantum annealer', 'annealer'], ['3.4.32', 'coupler', 'coupler'], ['3.5.1', 'quantum simulation', 'simulation'],
  ['3.5.2', 'quantum machine learning', 'learning'], ['3.5.3', 'sampling algorithm', 'sampling'], ['3.5.4', 'optimization', 'optimization'],
  ['3.5.5', 'linear systems solving', 'linear'], ['3.5.6', 'search algorithm', 'search'], ['3.5.7', 'hidden subgroup problem', 'hidden'],
  ['3.5.8', 'boson sampling', 'boson'], ['3.6.1', 'quantum communication', 'communication'], ['3.6.2', 'quantum cryptography', 'cryptography'],
  ['3.6.3', 'quantum sensor', 'sensor'], ['3.6.4', 'quantum sensing', 'sensor'],
]

const T = (name: string): Realisation => ({ kind: 'type', name })
const F = (name: string): Realisation => ({ kind: 'function', name })
const L = (name: string): Realisation => ({ kind: 'lean', name })

/** what realises a clause in THIS tree */
const HERE: Readonly<Record<string, Realisation[]>> = {
  '3.1.4': [F('simulate')],
  '3.2.1': [T('Zw'), L('quantum_circuits.lean')],
  '3.2.7': [F('phases'), L('quantum_circuits.lean')],
  '3.2.8': [F('chshGates')],
  '3.2.10': [L('quantum_circuits.lean'), F('mermin'), L('quantum_octaves.lean')],
  '3.2.16': [T('MeasurementCounts'), F('countsOf')],
  '3.3.3': [T('QuantumGate')],
  '3.3.5': [F('toQasm')],
  '3.4.2': [T('QuantumGate')],
  '3.4.3': [L('quantum_models.lean')],
  '3.4.5': [T('QuantumCircuit'), F('chshGates'), F('toQasm')],
  '3.4.8': [T('AcceptedQuantumComputer')],
  '3.4.10': [T('AcceptedQuantumComputer'), F('ACCEPTED_HARDWARE')],
  '3.4.13': [L('quantum_circuits.lean'), L('quantum_hardware.lean')],
  '3.4.14': [L('quantum_models.lean'), F('cluster'), L('quantum_uuid_cluster.lean')],
  '3.4.15': [L('quantum_models.lean')],
  '3.4.16': [L('quantum_models.lean')],
  '3.4.22': [F('simulate'), F('mermin'), F('cluster')],
  '3.4.26': [F('ACCEPTED_HARDWARE')],
  '3.4.31': [L('quantum_models.lean')],
  '3.5.6': [L('quantum_textbooks.lean')],
  '3.5.7': [L('quantum_textbooks.lean')],
  '3.5.8': [L('quantum_models.lean')],
}

/** the coin of a clause: the content address of the standard's own clause number and term */
export const coinOf = (clause: string, term: string): string => toUuid(`ISO/IEC 4879:2024 ${clause} ${term}`)

export const TERMS: readonly Term[] = ISO_4879.map(([clause, term, qpu]) => {
  const section = clause.split('.').slice(0, 2).join('.'), here = HERE[clause] ?? []
  return { clause, term, here, qpu, coin: coinOf(clause, term), skill: { family: `${section} ${SECTIONS[section]}`, esco: esco(term) }, tools: toolsOf(here, qpu) }
})

/** each skill family is a coin too: the Merkle fold of its members' coins, as uuidna's skills carry their fold */
export const SKILLS: readonly { family: string; members: number; coin: string; esco: string }[] =
  Object.entries(SECTIONS).map(([s, title]) => {
    const members = TERMS.filter((t) => t.clause.startsWith(s + '.'))
    return { family: `${s} ${title}`, members: members.length, coin: merkleFold(members.map((t) => t.coin)), esco: esco(title) }
  })

/** every tool a coin names that does not resolve in the tree: a function not exported, a Lean file not in the kernel's
 *  records, an npm script not in package.json. Empty when every coin's tools are real. */
export const unresolvedTools = (exports: ReadonlySet<string>, leanFiles: ReadonlySet<string>, scripts: ReadonlySet<string>): string[] =>
  TERMS.flatMap((t) => t.tools.filter((tool) => {
    const fn = tool.match(/^(\w+)\(\)$/), lean = tool.match(/^npm run lean · (.+)$/), npm = tool.match(/^npm run ([\w:-]+)$/)
    if (fn) return !exports.has(fn[1])
    if (lean) return !leanFiles.has(lean[1])
    if (npm) return !scripts.has(npm[1])
    return false
  }).map((tool) => `${t.clause} ${tool}`))
