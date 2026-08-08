// from the heart — the generative act. `next` computes "from the heart (5)": discover a decidable fact,
// save it, prove it, ship it — each wave flowing from the centre outward, kept iff it computes.
import { toUuid, vortexOrbit } from '../../../0/index.ts'
export function report(): string {
  let o = 'from the heart (5) — the generative act:\n\n'
  o += '  next computes from the heart: discover a decidable fact → save it → prove it → ship it.\n'
  o += '  each wave flows from the centre (5) along the circuit: ' + vortexOrbit().join(' → ') + '.\n'
  o += '  what is discovered is kept iff it computes; the rest is drained. from the heart, honestly.\n'
  o += '  address: ' + toUuid('from-the-heart:next').slice(0, 13) + '… entails → 0/7.'
  return o
}
