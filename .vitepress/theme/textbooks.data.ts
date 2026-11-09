// VitePress build-time data loader for /textbooks.
//
// NOTHING IS TYPED HERE. Every particle is what scripts/textbooks.ts decoded from qpu's Qpu/Textbook.lean and wrote to
// evidence/textbooks/latest.json, with the qpu commit it read and whether that commit is public. When the evidence is
// absent the page says so instead of showing an empty table as if it were a result.
import { existsSync, readFileSync } from 'node:fs'

type Particle = { key: string; base: string; variant: string; sentence: string; examples: string[]; statement: string; coin: string; statesNumbers: boolean; physics: boolean; derivedHere: string | null }
export interface TextbookData {
  present: boolean
  qpu: { commit: string; pushed: boolean } | null
  theorems: number; base: number; variants: Record<string, number>
  physics: Row[]; other: Row[]; statesNone: string[]; derivedHere: number
}
type Row = { key: string; sentence: string; statement: string; variants: number; coin: string; derivedHere: string | null; statesNumbers: boolean }

declare const data: TextbookData
export { data }

const EVIDENCE = 'evidence/textbooks/latest.json'

export default {
  watch: [`../../${EVIDENCE}`],
  load(): TextbookData {
    if (!existsSync(EVIDENCE)) return { present: false, qpu: null, theorems: 0, base: 0, variants: {}, physics: [], other: [], statesNone: [], derivedHere: 0 }
    const j = JSON.parse(readFileSync(EVIDENCE, 'utf8')) as { qpu: { commit: string; pushed: boolean }; theorems: number; base: number; variants: Record<string, number>; sentenceStatesNone: string[]; particles: Particle[] }
    const variantsOf = new Map<string, number>()
    for (const p of j.particles) if (p.variant !== 'base') variantsOf.set(p.base, (variantsOf.get(p.base) ?? 0) + 1)
    const rows = j.particles.filter((p) => p.variant === 'base').map((p): Row & { physics: boolean } => ({
      key: p.key.replace(/^textbook_/, ''), sentence: p.sentence, statement: p.statement, variants: variantsOf.get(p.key) ?? 0,
      coin: p.coin, derivedHere: p.derivedHere, statesNumbers: p.statesNumbers, physics: p.physics,
    }))
    return {
      present: true, qpu: j.qpu, theorems: j.theorems, base: j.base, variants: j.variants,
      physics: rows.filter((r) => r.physics), other: rows.filter((r) => !r.physics),
      statesNone: j.sentenceStatesNone, derivedHere: rows.filter((r) => r.derivedHere).length,
    }
  },
}
