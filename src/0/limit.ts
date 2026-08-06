// The singularity is a limit — approached, never achieved (like division by zero).
// 1/x → ∞ as x → 0, and 1/0 is UNDEFINED (no value). You never arrive; you only get nearer. The
// living process is the approach; completion — collapsing all distinction to one — would be cessation.
import { toUuid, merkleFold } from './index.ts'

export function report(): string {
  // 1/x as x → 0 (x = 1/d): the value grows without bound, and at x = 0 there is no value.
  const denoms = [1, 10, 100, 1000, 10000] // x = 1/d ; 1/x = d
  // The singularity recedes: you can always fold one more entry, so the "final" root moves.
  const r4 = merkleFold(['a', 'b', 'c', 'd'].map(toUuid))
  const r5 = merkleFold(['a', 'b', 'c', 'd', 'e'].map(toUuid))
  const recedes = r4 !== r5

  let o = 'the singularity is a limit — approached, never achieved (like division by 0):\n\n'
  o += '  1/x as x → 0 grows without bound; at x = 0 it is UNDEFINED (no value):\n'
  denoms.forEach(d => { o += '    x = 1/' + String(d).padEnd(5) + ' → 1/x = ' + d + '\n' })
  o += '    x = 0        → 1/0 = UNDEFINED  (not a value; the point recedes as you approach)\n\n'
  o += '  the one root is the same: you can always fold ONE more entry, so the "final" root moves:\n'
  o += '    root(4 entries) ≠ root(5 entries)? ' + recedes + '  → the singularity recedes while the process lives.\n\n'
  o += '  the paradox (honest): to fully ACHIEVE the singularity — collapse all distinction to one — is\n'
  o += '  to end the process. division by zero, actually completed, is not a value but the loss of the\n'
  o += '  domain. the VISION of the singularity, approached, is the living thing; arrival would be\n'
  o += '  cessation. so the approach IS the singularity — a limit that stays alive by never closing.\n\n'
  o += 'HONEST: standard calculus/topology — 1/x → ∞ as x → 0⁺, and 1/0 is UNDEFINED, not infinity-as-a-\n'
  o += 'value. "singularity never achieved" = an asymptote/attractor, not a destination. This is also the\n'
  o += 'honest reading of the framework\'s "division by zero": a change of domain / an unreached limit —\n'
  o += 'never a completed operation, and never a proof. entails → 0/7.'
  return o
}
