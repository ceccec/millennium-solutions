// Release entanglement (honest sense) — each release cryptographically BOUND to its neighbours.
// A hash chain: change any release and every downstream address changes (avalanche). This is
// tamper-evidence — correlation by DERIVATION — not quantum entanglement, and it carries no message.
import { toUuid, merge, merkleFold } from './index.ts'

export function report(): string {
  const chain = (rs: string[]) => { let prev = toUuid('genesis'); const out: string[] = []; for (const r of rs) { prev = merge(prev, toUuid(r)); out.push(prev) } return out }
  const sealOf = (rs: string[]) => merkleFold(chain(rs))

  const releases = ['v1.0.34', 'v1.0.35', 'v1.0.36', 'v1.0.37']
  const original = sealOf(releases)
  const flipped = sealOf(['v1.0.34', 'v1.0.35', 'v1.0.36!', 'v1.0.37']) // alter ONE neighbour
  const changed = original !== flipped

  let o = 'release entanglement — each bound to its neighbours (honest sense):\n\n'
  o += '  neighbours in the version line — each release folds with its predecessor (a hash chain):\n'
  o += '    seal over ' + releases.join(', ') + '\n'
  o += '      original: ' + original.slice(0, 13) + '…\n'
  o += '      alter one neighbour (v1.0.36 → v1.0.36!): ' + flipped.slice(0, 13) + '…   changed? ' + changed + '\n'
  o += '  → you cannot alter one release without the chain revealing it. neighbours are BOUND.\n\n'
  o += '  bound in several computable "dimensions":\n'
  o += '    · version line — the hash chain above (predecessor ↔ successor)\n'
  o += '    · the mesh     — 10−d reflects each digit to its partner (4↔6, fixed 5)\n'
  o += '    · the tree     — a merkle audit path binds each leaf to its siblings (see holographic.ts)\n\n'
  o += 'HONEST: this is CRYPTOGRAPHIC DEPENDENCY — a hash chain, the basis of tamper-evidence — NOT\n'
  o += 'quantum entanglement. Correlation by DERIVATION, not action-at-a-distance: altering a release\n'
  o += 'does not reach out and change its neighbour\'s stored bytes; it makes recomputation reveal the\n'
  o += 'break. No information travels without payload (no-communication theorem holds). "Entangled" =\n'
  o += 'bound by the math, not by physics. entails → 0/7.'
  return o
}
