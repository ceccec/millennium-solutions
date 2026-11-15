// VitePress build-time data loader for /qpu.
//
// NOTHING HERE IS THIS DEPOSIT'S WORK. Every theorem is what scripts/qpu-lean.ts read from the sibling qpu
// checkout (Qpu/*.lean) and wrote to evidence/qpu-lean/latest.json, attributed and dated by the qpu commit.
// The connector that would forward them live is down (src/mcp/connectors.ts), so the unit's novelty is
// preserved by reading, not by a claim this deposit proves it. When the evidence is absent the page says so
// instead of showing an empty table as if it were a result.
//
// The statement is TYPESET from the same tree as the stored LaTeX (src/latex `toMathML`), so the rendered
// maths and the copyable LaTeX cannot disagree. MathML renders natively — no maths library, no CDN. When the
// grammar does not cover a type, the typeset cell is empty and the raw Lean is shown; the raw Lean is ALWAYS
// shown, so nothing qpu wrote is hidden by what this deposit cannot render.
import { existsSync, readFileSync } from 'node:fs'
import { toMathML } from '../../src/latex/index.ts'

type Thm = { name: string; type: string; latex: string | null; doc: string | null }
type Row = { name: string; type: string; latex: string | null; mathml: string | null; doc: string | null }
type FileGroup = { file: string; theorems: Row[] }
export interface QpuData {
  present: boolean
  qpuCommit: string | null
  measured: string | null
  attribution: string
  files: number
  theorems: number
  typeset: number
  lean: FileGroup[]
}

declare const data: QpuData
export { data }

const EVIDENCE = 'evidence/qpu-lean/latest.json'
const PREFIX = 'src/quantum/processing/unit/lean/Qpu/'

const ABSENT: QpuData = { present: false, qpuCommit: null, measured: null, attribution: '', files: 0, theorems: 0, typeset: 0, lean: [] }

export default {
  watch: [`../../${EVIDENCE}`],
  load(): QpuData {
    if (!existsSync(EVIDENCE)) return ABSENT
    const j = JSON.parse(readFileSync(EVIDENCE, 'utf8')) as {
      status: string; attribution: string; qpuCommit: string | null; measured: string
      files: number; theorems: number; typeset: number
      lean: { file: string; theorems: Thm[] }[]
    }
    if (j.status !== 'INGESTED') return ABSENT
    const lean: FileGroup[] = j.lean.map((g) => ({
      file: g.file.startsWith(PREFIX) ? g.file.slice(PREFIX.length) : g.file,
      theorems: g.theorems.map((t) => ({ name: t.name, type: t.type, latex: t.latex, mathml: toMathML(t.type), doc: t.doc })),
    }))
    return {
      present: true, qpuCommit: j.qpuCommit, measured: j.measured, attribution: j.attribution,
      files: j.files, theorems: j.theorems, typeset: j.typeset, lean,
    }
  },
}
