// THE C3 DECISION — SOURCED only when a DOI resolves to the canonical record. Never TRUE: a citation is evidence, not proof.
// Pure: it reads the resolved title and the canonical title head, and decides. It fetches nothing.
export type DoiReport = { status: string; title: string | null }
export type C3Decision = { value: 'SOURCED' | 'UNKNOWN'; reason: string }

export const decideC3 = (r: DoiReport, canonicalTitleHead: string): C3Decision => {
  if (r.status !== 'FETCHED') return { value: 'UNKNOWN', reason: `the DOI was not resolved (${r.status})` }
  if (!r.title) return { value: 'UNKNOWN', reason: 'the record has no title' }
  if (!r.title.includes(canonicalTitleHead)) return { value: 'UNKNOWN', reason: `the record "${r.title}" is not the canonical work` }
  return { value: 'SOURCED', reason: `the record is the canonical work: "${r.title}"` }
}
