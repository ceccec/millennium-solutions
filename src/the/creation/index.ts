// the creation — waves of creation and manifestation. Creation here is honest: a decidable fact is
// discovered by exhaustion and recorded (append-only), never a claim minted. Manifestation is the fact
// re-verified every build. The week: six days of work, the seventh of rest (6 + 1 = 7). Nothing is
// created over unchanged content — earned, not minted. Computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const WAVE = ['discover by exhaustion', 'record append-only', 're-verify every build', 'seal', 'rest']
  const root = merkleFold(WAVE.map(toUuid))
  let o = 'the creation — waves of creation and manifestation:\n\n'
  o += '  creation is honest: a decidable fact discovered by exhaustion and recorded, never minted.\n'
  o += '  manifestation: the fact re-verified every build. earned, not minted — nothing over unchanged content.\n'
  o += '  the week: six days of work, the seventh of rest — 6 + 1 = 7.\n'
  for (const w of WAVE) o += '    · ' + w + '\n'
  o += '  folded creation root (the wave as one): ' + root.slice(0, 13) + '… — this deposit 0/7.'
  return o
}
