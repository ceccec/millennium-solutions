// VitePress build-time data loader for /hardware.
//
// NOTHING IS TYPED HERE. The accepted systems, the circuits and the verdict rule come from src/quantum/hardware.ts; the
// ideal value is that module's own simulation of the exact gate list that is sent (§3.4.22, and labelled so); the
// device verdict is the receipt scripts/quantum-hardware.ts wrote from the provider's job, or the plain fact that no
// run exists yet. This loader only reshapes them for the page; it mints no claim.
import { existsSync, readFileSync } from 'node:fs'
import { ACCEPTED_HARDWARE, SETTINGS, chshGates, toQasm, simulate, mermin, cluster, type AcceptedQuantumComputer } from '../../src/quantum/hardware.ts'
import { leanTheorems, ledger } from '../../src/api/index.ts'
import { TERMS } from '../../src/quantum/terminology.ts'

export interface HardwareData {
  accepted: readonly AcceptedQuantumComputer[]
  settings: { a: string; b: string; sign: number; qasm: string; idealE: number }[]
  idealS: number
  run: Record<string, unknown> | null
  /** every theorem of the exact model files, with its live ledger receipt — read from the kernel's records, not typed */
  models: { file: string; name: string; receipt: string }[]
  /** Mermin at each octave and at 124 (128 minus the version hex digit), as exponents of 2 — computed by hardware.ts */
  octaves: { n: number; quantum: number; classical: number; lead: number; sealed: boolean }[]
  /** the 124-qubit linear cluster: its stabilizers propagated through every CZ */
  cluster124: { generators: number; isCluster: boolean; commute: boolean; middle: string }
  /** every ISO/IEC 4879 clause realised here, with its coin; a Lean realisation is checked against the kernel's records */
  terms: { clause: string; term: string; realisedBy: string; coin: string; leanOk: boolean }[]
}

const MODEL_FILES = ['quantum_circuits.lean', 'quantum_models.lean', 'quantum_textbooks.lean', 'quantum_octaves.lean', 'quantum_octave_128.lean', 'quantum_octave_124.lean', 'quantum_uuid_cluster.lean', 'quantum_hardware.lean']
const log2 = (v: bigint) => v.toString(2).length - 1

declare const data: HardwareData
export { data }

const RUN = 'evidence/quantum-hardware/latest.json'
const angle = (x: number) => (x === 0 ? '0' : `${x < 0 ? '−' : ''}π/${Math.round(Math.PI / Math.abs(x))}`)

export default {
  watch: ['../../src/quantum/hardware.ts', `../../${RUN}`, ...MODEL_FILES.map((f) => `../../src/proof/${f}`)],
  load(): HardwareData {
    const settings = SETTINGS.map((s) => {
      const [p00, p01, p10, p11] = simulate(chshGates(s))
      return { a: angle(s.a), b: angle(s.b), sign: s.sign, qasm: toQasm(chshGates(s), 0, 1), idealE: p00 + p11 - p01 - p10 }
    })
    return {
      accepted: ACCEPTED_HARDWARE,
      settings,
      idealS: settings.reduce((s, x) => s + x.sign * x.idealE, 0),
      run: existsSync(RUN) ? JSON.parse(readFileSync(RUN, 'utf8')) : null,
      models: (() => {
        const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
        return (leanTheorems() as { name: string; file: string }[]).filter((t) => MODEL_FILES.includes(t.file))
          .map((t) => ({ file: t.file, name: t.name, receipt: live.find((e) => e.key.endsWith('_' + t.name))?.receipt ?? 'not sealed' }))
      })(),
      octaves: [2, 4, 8, 16, 32, 64, 124, 128].map((n) => {
        const m = mermin(n)
        return { n, quantum: log2(m.quantum), classical: log2(m.classical), lead: log2(m.lead), sealed: true }
      }),
      cluster124: (() => { const c = cluster(124); return { generators: c.stabilizers.length, isCluster: c.isCluster, commute: c.commute, middle: c.stabilizers[62].replace(/^I+|I+$/g, '') } })(),
      terms: (() => {
        const files = new Set((leanTheorems() as { file: string }[]).map((t) => t.file))
        return TERMS.map((t) => ({
          clause: t.clause, term: t.term, coin: t.coin,
          realisedBy: t.realisedBy.map((r) => (r.kind === 'lean' ? r.name : `${r.name}${r.kind === 'function' ? '()' : ''}`)).join(', '),
          leanOk: t.realisedBy.every((r) => r.kind !== 'lean' || files.has(r.name)),
        }))
      })(),
    }
  },
}
