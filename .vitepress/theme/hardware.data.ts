// VitePress build-time data loader for /hardware.
//
// NOTHING IS TYPED HERE. The accepted systems, the circuits and the verdict rule come from src/quantum/hardware.ts; the
// ideal value is that module's own simulation of the exact gate list that is sent (§3.4.22, and labelled so); the
// device verdict is the receipt scripts/quantum-hardware.ts wrote from the provider's job, or the plain fact that no
// run exists yet. This loader only reshapes them for the page; it mints no claim.
import { existsSync, readFileSync } from 'node:fs'
import { ACCEPTED_HARDWARE, SETTINGS, chshGates, toQasm, simulate, type QuantumHardware } from '../../src/quantum/hardware.ts'
import { leanTheorems, ledger } from '../../src/api/index.ts'

export interface HardwareData {
  accepted: readonly QuantumHardware[]
  settings: { a: string; b: string; sign: number; qasm: string; idealE: number }[]
  idealS: number
  run: Record<string, unknown> | null
  /** every theorem of the exact model files, with its live ledger receipt — read from the kernel's records, not typed */
  models: { file: string; name: string; receipt: string }[]
}

const MODEL_FILES = ['quantum_circuits.lean', 'quantum_models.lean', 'quantum_textbooks.lean', 'quantum_hardware.lean']

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
    }
  },
}
