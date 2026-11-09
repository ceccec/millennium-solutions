// VitePress build-time data loader for /hardware.
//
// NOTHING IS TYPED HERE. The accepted systems, the circuits and the verdict rule come from src/quantum/hardware.ts; the
// ideal value is that module's own simulation of the exact gate list that is sent (§3.4.22, and labelled so); the
// device verdict is the receipt scripts/quantum-hardware.ts wrote from the provider's job, or the plain fact that no
// run exists yet. This loader only reshapes them for the page; it mints no claim.
import { existsSync, readFileSync } from 'node:fs'
import { ACCEPTED_HARDWARE, SETTINGS, chshGates, toQasm, simulate, mermin, cluster, type AcceptedQuantumComputer } from '../../src/quantum/hardware.ts'
import { leanTheorems, ledger } from '../../src/api/index.ts'
import { TERMS, QPU_VOCABULARY, SKILLS, unresolvedTools } from '../../src/quantum/terminology.ts'
import * as HARDWARE from '../../src/quantum/hardware.ts'
import { expectation, q2str, particles, FREE_BITS, type Gate } from '../../src/quantum/paulipath.ts'
import { toUuid } from '../../src/0/index.ts'

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
  /** all 86 ISO/IEC 4879 clauses, with their coin, what realises each here (a Lean file checked against the kernel's
   *  records) and qpu's realising check */
  terms: { clause: string; term: string; here: string; qpu: string; coin: string; leanOk: boolean; skill: string; esco: string; tools: string }[]
  qpuSource: string
  /** each skill family a coin: the fold of its members' coins */
  skills: { family: string; members: number; coin: string; esco: string }[]
  /** every tool a coin names that does not resolve — and the resolver's control: on an empty tree it must find some */
  unresolved: string[]; resolverSees: boolean
  /** UUID particles interacting: one GHZ chain across every free bit of a stream of UUIDs, with k T gates spread across
   *  them — computed by Pauli paths at build time and set beside the closed form cos(kπ/4); a row that disagrees says so */
  uuidSpace: { uuids: number; particles: number; crossing: number; freeBits: number; rows: { k: number; value: string; closed: string; peakTerms: number }[] }
  /** the T-count wall for a thousand-bit modulus, from the formulas t_count_wall.lean decides: the named construction's
   *  T-count 28n³, Beauregard's 2n + 3 qubits, and how many UUIDs' particles hold them */
  tWall: { n: number; tCount: string; qubits: number; uuids: number; wallBits: number }
}

const MODEL_FILES = ['t_count_wall.lean', 'pauli_paths.lean', 'quantum_software.lean', 'quantum_circuits.lean', 'quantum_models.lean', 'quantum_textbooks.lean', 'quantum_octaves.lean', 'quantum_octave_128.lean', 'quantum_octave_124.lean', 'quantum_uuid_cluster.lean', 'quantum_hardware.lean']
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
      uuidSpace: (() => {
        const stream = Array.from({ length: 10 }, (_, i) => toUuid(`stream ${i}`)), all = stream.flatMap(particles)
        const chain: Gate[] = [{ g: 'h', q: all[0] }, ...all.slice(1).map((q, i): Gate => ({ g: 'cx', q: all[i], t: q }))]
        const closed = ['1', '(1√2)/2', '0', '(-1√2)/2', '-1', '(-1√2)/2', '0', '(1√2)/2']
        const rows = Array.from({ length: 8 }, (_, k) => {
          const circuit = [...chain, ...Array.from({ length: k }, (_, j): Gate => ({ g: 't', q: all[Math.floor(((j + 0.5) * all.length) / k)] }))]
          const { value, peakTerms } = expectation(circuit, new Map(all.map((q) => [q, 1])))
          return { k, value: q2str(value), closed: closed[k], peakTerms }
        })
        return { uuids: stream.length, particles: all.length, crossing: stream.length - 1, freeBits: FREE_BITS.length, rows }
      })(),
      tWall: (() => {
        const shorT = (n: bigint) => 7n * (2n * n) * n * (2n * n), n = 1000n, qubits = Number(2n * n + 3n)
        // the smallest bit length whose worst case 2^T passes 10^80: compare T with log2(10^80) without a float
        let wallBits = 1
        while ((1n << shorT(BigInt(wallBits))) <= 10n ** 80n) wallBits++
        return { n: Number(n), tCount: shorT(n).toLocaleString('en-US'), qubits, uuids: Math.ceil(qubits / FREE_BITS.length), wallBits }
      })(),
      cluster124: (() => { const c = cluster(124); return { generators: c.stabilizers.length, isCluster: c.isCluster, commute: c.commute, middle: c.stabilizers[62].replace(/^I+|I+$/g, '') } })(),
      terms: (() => {
        const files = new Set((leanTheorems() as { file: string }[]).map((t) => t.file))
        return TERMS.map((t) => ({
          clause: t.clause, term: t.term, coin: t.coin, qpu: t.qpu, skill: t.skill.family, esco: t.skill.esco, tools: t.tools.join(' · '),
          here: t.here.map((r) => (r.kind === 'lean' ? r.name : `${r.name}${r.kind === 'function' ? '()' : ''}`)).join(', '),
          leanOk: t.here.every((r) => r.kind !== 'lean' || files.has(r.name)),
        }))
      })(),
      qpuSource: `${QPU_VOCABULARY.repo} ${QPU_VOCABULARY.file} at ${QPU_VOCABULARY.commit.slice(0, 8)}${QPU_VOCABULARY.pushed ? '' : ' (local to qpu’s tree, not yet on GitHub)'}`,
      skills: [...SKILLS],
      ...(() => {
        const files = new Set((leanTheorems() as { file: string }[]).map((t) => t.file))
        const scripts = new Set(Object.keys((JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> }).scripts))
        return { unresolved: unresolvedTools(new Set(Object.keys(HARDWARE)), files, scripts), resolverSees: unresolvedTools(new Set(), new Set(), new Set()).length > 0 }
      })(),
    }
  },
}
