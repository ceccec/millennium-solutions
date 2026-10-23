// THE C2 DECISION — "is N prime?" answered TRUE or FALSE only from an exact witness, otherwise UNKNOWN.
// Pure: it reads the report that task-route produced and decides. It runs nothing.
//   prime, proved by complete trial division   → TRUE  (no witness is needed for "prime"; the division is the check)
//   composite with a factor whose product check passes → FALSE, witness = the factor and its cofactor
//   composite with no factor reported           → UNKNOWN (the base that proves it is not in the report)
//   probable prime                              → UNKNOWN (a probability is not a certificate)
export type RouteReport = { verdict?: string; factor?: string | null; cofactor?: string; productCheck?: boolean; proof?: boolean; digits?: number }
export type C2Decision = { value: 'TRUE' | 'FALSE' | 'UNKNOWN'; reason: string; witness?: { factor: string; cofactor: string } }

export const decideC2 = (r: RouteReport): C2Decision => {
  if (r.verdict === 'prime' && r.proof === true) return { value: 'TRUE', reason: 'complete trial division: no factor up to the bound' }
  if (r.verdict === 'composite' && r.factor && r.cofactor && r.productCheck === true) {
    return { value: 'FALSE', reason: 'a factor with its exact product check', witness: { factor: r.factor, cofactor: r.cofactor } }
  }
  if (r.verdict === 'composite') return { value: 'UNKNOWN', reason: 'composite, but no factor is reported, so no witness is available here' }
  if (r.verdict === 'probably prime') return { value: 'UNKNOWN', reason: 'a probable prime: not a certificate' }
  return { value: 'UNKNOWN', reason: `no decision: ${r.verdict ?? 'no verdict'}` }
}
