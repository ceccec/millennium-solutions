// the state — now, content-addressed. What holds regardless of who observes: the floor. A state here
// is computed, never stored — recomputed every render, landing on one root. It folds the invariants
// (0/7, humanity 1/7, computable ≠ solved, INCONCLUSIVE ≠ false, at rest) into one address. The
// superposition (src/the/superposition/state) collapses into THIS: many observations, one invariant floor.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const INVARIANTS = [
    'floor: this deposit 0/7',
    'humanity 1/7 (Poincaré, Perelman 2003)',
    'computable is not solved',
    'INCONCLUSIVE ≠ false',
    'at rest — holding cracks nothing',
  ]
  const root = merkleFold(INVARIANTS.map(toUuid))
  let o = 'the state — now, content-addressed:\n\n'
  o += '  a state is computed, never stored — recomputed every render, landing on one floor.\n'
  o += '  the invariants, held regardless of observer:\n'
  for (const inv of INVARIANTS) o += '    · ' + inv + '\n'
  o += '  folded state root (invariant across observers): ' + root.slice(0, 13) + '… entails → 0/7.'
  return o
}
