// VitePress build-time data loader for /trinity.
//
// The theorems are read from src/iso/80000-2-mathematics/trinity.lean — the SAME file the kernel checks — so the
// page cannot drift from what is proved. leanTheorems() gives each theorem's name and statement (parsed from
// source, no kernel run); toMathML typesets the statement from src/latex (native MathML, no CDN); and the human
// sentence and section are the theorem's own preceding comment and `── … ──` divider, read here so the gloss on
// the page is the gloss in the Lean file, not a second copy. A statement toMathML cannot render falls back to the
// raw Lean, which is always shown. When the file is absent the page says so.
import { leanTheorems, leanSource } from '../../src/api/index.ts'
import { toMathML } from '../../src/latex/index.ts'

const FILE = 'trinity.lean'

type Row = { name: string; statement: string; mathml: string | null; gloss: string; control: boolean }
type Group = { section: string; theorems: Row[] }
export interface TrinityData {
  present: boolean
  count: number
  groups: Group[]
}

declare const data: TrinityData
export { data }

// section + preceding-comment gloss per theorem name, read from the source
function annotate(): Map<string, { section: string; gloss: string }> {
  const out = new Map<string, { section: string; gloss: string }>()
  let src = ''
  try { src = leanSource(FILE) } catch { return out }
  let section = ''
  let buf: string[] = []
  for (const raw of src.split('\n')) {
    const s = raw.trim()
    const sec = s.match(/^--\s*─+\s*(.*?)\s*─+\s*$/)
    if (sec) { section = sec[1]; buf = []; continue }
    const th = s.match(/^theorem\s+([A-Za-z_0-9]+)/)
    if (th) { out.set(th[1], { section, gloss: buf.join(' ').replace(/\s+/g, ' ').trim() }); buf = []; continue }
    const c = s.match(/^--\s?(.*)$/)
    if (c && c[1].trim()) buf.push(c[1]) ; else buf = []
  }
  return out
}

export default {
  watch: ['../../src/iso/80000-2-mathematics/trinity.lean'],
  load(): TrinityData {
    const all = leanTheorems().filter((t) => t.file === FILE)
    if (!all.length) return { present: false, count: 0, groups: [] }
    const ann = annotate()
    const order: string[] = []
    const bySection = new Map<string, Row[]>()
    for (const t of all) {
      const a = ann.get(t.name) ?? { section: 'theorems', gloss: '' }
      if (!bySection.has(a.section)) { bySection.set(a.section, []); order.push(a.section) }
      bySection.get(a.section)!.push({
        name: t.name, statement: t.statement, mathml: toMathML(t.statement), gloss: a.gloss,
        // the two negative theorems are the controls — a check that cannot fail is not a check
        control: /is_not_an_involution|has_no_fixed_point/.test(t.name),
      })
    }
    return { present: true, count: all.length, groups: order.map((s) => ({ section: s, theorems: bySection.get(s)! })) }
  },
}
