// the apple — gravity. Newton's apple names one honest idea: everything falls to a fixed point.
// This is NOT physics — no force, no gravitation, nothing faster than light. It is a NAMING of
// decidable contractions: maps that pull their whole domain to a single fixed point or one root.
// The "cryptography apple" (any finite-width hash) falls under this gravity too — and pigeonhole
// gravity guarantees that no finite digest avoids collisions forever, which is exactly why
// "unbreakable" is false for every hash (the strong ones resist computationally; FNV does not).
// Computed, not stored. Falls, like all of it, to 0/7.
import { toUuid } from '../../0/index.ts'
// Gravity lives canonically in @uuidna/uuidna (no duplication — one implementation, byte-identical addresses).
// merkleGravity is ORDER-INVARIANT (the quantum receipt); doubleTorus covers the 7D field. NOT physics, 0/7.
import { merkleGravity, doubleTorusGravity, doubleTorusField, fall, fixedPoints, seats } from '@uuidna/uuidna'
export { merkleGravity, doubleTorusGravity, doubleTorusField, fall, fixedPoints, seats }

export const EARTH = 'earth' // the ground the apple rests on — see ./earth

export function report(): string {
  const fp = fixedPoints()
  const oneRoot = merkleGravity(['a', 'b', 'c'].map((x) => toUuid(x)))
  let o = 'the apple — gravity (a naming of decidable contractions, NOT physics):\n\n'
  o += '  gravity 1 (merkle): any set of addresses falls to one root — {a,b,c} → ' + oneRoot.slice(0, 13) + '…\n'
  o += '  gravity 2 (digital root): any integer falls to ℤ/9 in one step and stays; the ground = {' + fp.join(',') + '}\n'
  o += '  double gravity: a hash lives under both — a content-address AND a digital root.\n'
  o += '  pigeonhole gravity: a b-bit digest has 2^b seats; past 2^b inputs a collision is forced —\n'
  o += '    so no finite hash avoids collisions forever (the strong ones resist computationally; FNV does not).\n'
  o += '  the apple falls to the earth (./earth), and all of it to 0/7.'
  return o
}
