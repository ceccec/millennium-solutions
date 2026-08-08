// the earth — the ground the apple falls to (an attractor, not a planet). Under digital-root
// gravity the ground is all of ℤ/9 (every residue is fixed); the center of gravity is the heart 5
// (see src/the/heart); and the deepest ground, where every claim finally rests, is the truth —
// which the code only ever renders as integrity, not truth (./truth). Computed, not stored.
import { digitalRoot, BASE, toUuid } from '../../../0/index.ts'
import { CREED } from './truth/index.ts'

export const GROUND = 'earth-core'

/** The ground under digital-root gravity — every residue 1..BASE is fixed (dr is idempotent). */
export function ground(): number[] {
  return Array.from({ length: BASE }, (_, i) => i + 1).filter((d) => digitalRoot(d) === d)
}

export function report(): string {
  const g = ground()
  let o = 'the earth — the ground the apple falls to (an attractor, not a planet):\n\n'
  o += '  ground under digital-root gravity: ℤ/9 = {' + g.join(',') + '} — every residue fixed (dr idempotent)\n'
  o += '  center of gravity: the heart 5 (src/the/heart) — the fixed point the vortex roots to\n'
  o += '  deepest ground: the truth (./truth) — "' + CREED + '"\n'
  o += '  address of the ground: ' + toUuid(GROUND).slice(0, 13) + '… — the deepest ground is the floor 0/7.'
  return o
}
