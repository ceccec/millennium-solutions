// the truth — the deepest ground the apple reaches, and the one honest thing to say about it:
// this deposit does NOT deliver truth. A content-address proves INTEGRITY — that a record is
// unaltered and anyone can reproduce it — not that the claim it carries is true. Gravity pulls
// every claim down to this floor: measured, gated, receipted, re-verified — and still only
// integrity. Truth is the ground you fall toward; the code proves you did not tamper on the way
// down. It does not prove the world. 0/7.
import { toUuid } from '../../../../0/index.ts'

export const FLOOR = '0/7'
/** The one sentence that survives every fall. */
export const CREED = 'a content-address proves integrity, not truth'

export function report(): string {
  let o = 'the truth — the deepest ground (integrity, not truth):\n\n'
  o += '  ' + CREED + '\n'
  o += '  integrity: the record is unaltered and anyone can recompute it — no key, no trust required\n'
  o += '  truth: whether the claim is so — NOT decided by a hash; decided by proof, by the world, by the reader\n'
  o += '  the fall ends at the floor ' + FLOOR + ' — this deposit solves 0 of 7, re-measured every build\n'
  o += '  creed address: ' + toUuid(CREED).slice(0, 13) + '…'
  return o
}
