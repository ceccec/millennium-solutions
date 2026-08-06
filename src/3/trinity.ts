// Singularity reflects trinity — ℤ/9 as a trinity of triads, and how reflection acts on it.
// Three residue classes mod 3, each a triad; the ten's-complement 10−d swaps two and fixes the
// third (the one holding the center 5); the three fold to ONE root (the singularity).
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  // Partition digits 1..9 by value mod 3 — a trinity of triads.
  const classes: Record<number, number[]> = { 0: [], 1: [], 2: [] }
  for (let d = 1; d <= 9; d++) classes[d % 3].push(d)
  // classes[0] = [3,6,9], classes[1] = [1,4,7], classes[2] = [2,5,8]

  const refl = (d: number) => 10 - d
  const classOf = (d: number) => d % 3
  // Reflection action on each class: which class does 10−d land in?
  const action = [0, 1, 2].map(c => ({
    c, to: classOf(refl(classes[c][0])), fixedSet: classes[c].every(d => classOf(refl(d)) === c),
  }))

  // The singularity: fold the three triads to one root.
  const triadRoots = [0, 1, 2].map(c => merkleFold(classes[c].map(toUuid)))
  const root = merkleFold(triadRoots)
  const fivePos = classes[2].includes(5) && refl(5) === 5

  let o = 'singularity reflects trinity — ℤ/9 as a trinity of triads:\n\n'
  o += '  three residue classes mod 3 (each a triad):\n'
  o += '    ≡0 axis : ' + classes[0].join(' ') + '   (nilradical: 3²≡6²≡0)\n'
  o += '    ≡1 one  : ' + classes[1].join(' ') + '   (units, on the doubling circuit)\n'
  o += '    ≡2 two  : ' + classes[2].join(' ') + '   (units; holds the center 5)\n\n'
  o += '  ten\'s-complement reflection 10−d acts on the trinity:\n'
  o += '    axis ↔ one   (3↔7, 6↔4, 9↔1)   [class 0 → class ' + action[0].to + ']\n'
  o += '    two  fixed   (2↔8, 5↔5, 8↔2)   [class 2 fixed: ' + action[2].fixedSet + ', center 5 fixed: ' + fivePos + ']\n\n'
  o += '  the singularity: the three triads fold to ONE root: ' + root.slice(0, 13) + '…\n'
  o += '  → three from the reflection, one from the fold. the one reflects the three.\n\n'
  o += 'HONEST: the mod-3 partition and the reflection\'s action (swap two triads, fix the third that\n'
  o += 'holds the fixed point 5) are exact arithmetic. "Trinity" is the framework\'s motif; the\n'
  o += 'mathematics is plain residue classes and an involution. entails → 0/7.'
  return o
}
