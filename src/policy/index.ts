// POLICY — a request to build a capability is classified against the repository's own rules, and the classification is
// returned with its reason. This is a rule-based classifier. It is not a legal ruling and it does not grant anything:
// every verdict that needs an owner's decision says so, and nothing is enabled by a verdict alone.
export type Verdict = 'ALLOWED' | 'GATED' | 'NEEDS_OWNER'
export interface Decision { verdict: Verdict; request: string; reason: string; rule: string }

const RULES: { rule: string; verdict: Verdict; pattern: RegExp; reason: string }[] = [
  { rule: 'billing', verdict: 'NEEDS_OWNER', pattern: /\b(billing|billable|payment|charge|subscription|price|pricing|meter)\b/i,
    reason: 'takes money or sets prices: needs a payment account, a price and terms that only the owner can set' },
  { rule: 'public-write', verdict: 'GATED', pattern: /\b(write|publish|commit|seal|push|deploy|payload\s+write|cms\s+write)\b/i,
    reason: 'changes state: stays behind the write gate and is enabled only by the owner, per credential' },
  { rule: 'read-only', verdict: 'ALLOWED', pattern: /\b(read[- ]?only|readers?|lattice|apis?|guru|look ?ups?|query)\b/i,
    reason: 'reads public sources and changes nothing: allowed, with a timeout and a result limit' },
]

export const decide = (request: string): Decision => {
  const text = request.trim()
  if (!text) return { verdict: 'NEEDS_OWNER', request, reason: 'the request is empty', rule: 'empty' }
  // The strictest matching rule wins: a request that names billing is not allowed merely because it also says read-only.
  const order: Verdict[] = ['NEEDS_OWNER', 'GATED', 'ALLOWED']
  const hits = RULES.filter((r) => r.pattern.test(text))
  if (!hits.length) return { verdict: 'NEEDS_OWNER', request: text, reason: 'no rule of this repository names the request, so the owner decides', rule: 'unmatched' }
  const strictest = hits.sort((a, b) => order.indexOf(a.verdict) - order.indexOf(b.verdict))[0]
  return { verdict: strictest.verdict, request: text, reason: strictest.reason, rule: strictest.rule }
}
