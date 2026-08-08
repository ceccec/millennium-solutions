// the domain — a decidable universe over which facts hold: a carrier set, its operations, and a
// predicate decidable by exhaustion (never a proof of an OPEN conjecture, only the decidable within
// reach). The deposit spans many domains that meet in one shared core (base BASE) and communicate
// through the Glagolitic rosetta. Every domain lands on the same floor. Computed, not stored.
import { toUuid, merkleFold, BASE } from '../../0/index.ts'
export function report(): string {
  const DOMAINS = ['ℤ/9 arithmetic', 'finite groups', 'Boolean algebra', 'games', 'arts', 'number theory', 'finite fields', 'combinatorics', 'content-addressing']
  const root = merkleFold(DOMAINS.map(toUuid))
  let o = 'the domain — a decidable universe:\n\n'
  o += '  a domain is a carrier set, its operations, and a predicate decidable by exhaustion —\n'
  o += '  never a proof of an OPEN conjecture, only the decidable within reach.\n'
  o += '  the deposit spans many, meeting in one shared core (base ' + BASE + '):\n'
  for (const d of DOMAINS) o += '    · ' + d + '\n'
  o += '  folded domain root (the families as one): ' + root.slice(0, 13) + '… — humanity 1/7; this deposit 0/7.'
  return o
}
