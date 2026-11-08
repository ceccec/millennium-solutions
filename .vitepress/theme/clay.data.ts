// VitePress build-time data loader for the ClayLeads widget.
//
// NOTHING IS TYPED HERE. The author's claim comes verbatim from src/millennium (AUTHOR_CLAIM, moved never
// edited), the seven problems and their bounds from MILLENNIUM, the decided statement and case count from
// src/proof/index.lean, and the receipt from the append-only ledger — the same sources claySection() reads
// for the README and the homepage. This loader only reshapes them for a Vue component; it mints no claim.
import { MILLENNIUM, AUTHOR_CLAIM } from '../../src/millennium/index.ts'
import { leanTheorems, ledger, domainOf } from '../../src/api/index.ts'

export interface ClayLead {
  problem: string; name: string; bound: string; outlet: string; outletName: string
  theorem: string; statement: string; tactic: string; cases: number; key: string; receipt: string
}
export interface ClayData { author: typeof AUTHOR_CLAIM; seven: ClayLead[] }

declare const data: ClayData
export { data }

export default {
  // re-run the loader when any of the sealed sources changes
  watch: ['../../src/proof/index.lean', '../../src/millennium/index.ts'],
  load(): ClayData {
    const thms = leanTheorems() as { name: string; file: string; statement: string; tactic: string }[]
    const live = (ledger() as { key: string; receipt: string; revoked?: boolean }[]).filter((e) => !e.revoked)
    const entry = (name: string) => live.find((e) => e.key.endsWith('_' + name))
    const thm = (name: string) => thms.find((t) => t.file === 'index.lean' && t.name === name)
    const seven: ClayLead[] = []
    for (const [name, m] of Object.entries(MILLENNIUM)) {
      const t = thm(name), e = entry(name)
      if (!t || !e) continue
      seven.push({
        problem: m.problem, name: m.name, bound: m.bound, outlet: m.outlet, outletName: m.outletName,
        theorem: name, statement: t.statement, tactic: t.tactic, cases: domainOf(t.statement),
        key: e.key, receipt: e.receipt.slice(0, 13) + '…',
      })
    }
    return { author: AUTHOR_CLAIM, seven }
  },
}
