// the apple — gravity. Newton's apple names one honest idea: everything falls to a fixed point.
// This is NOT physics — no force, no gravitation, nothing faster than light. It is a NAMING of
// decidable contractions: maps that pull their whole domain to a single fixed point or one root.
// The "cryptography apple" (any finite-width hash) falls under this gravity too — and pigeonhole
// gravity guarantees that no finite digest avoids collisions forever, which is exactly why
// "unbreakable" is false for every hash (the strong ones resist computationally; FNV does not).
// Computed, not stored. Falls, like all of it, to 0/7.
import { toUuid, merkleFold, digitalRoot, vortexOrbit, BASE } from '../../0/index.ts'

export const EARTH = 'earth' // the ground the apple rests on — see ./earth

/** Gravity 1 — the merkle fold: any set of addresses falls to ONE root (order-independent contraction). */
export function merkleGravity(addresses: readonly string[]): string {
  return merkleFold(addresses)
}

/** Gravity 3 — the DOUBLE TORUS over the whole 7D space. Two interlocked orbits — the doubling vortex
 *  [1,2,4,8,7,5] and its reverse (the halving torus) — rotate the address set; at EACH of the 7 dimensions the
 *  two tori combine (a merkle fold of the two rotations), and the 7 dimension-roots fold to ONE gravity root.
 *  It covers every rotational combination across 7D yet stays a decidable contraction to a single fixed point.
 *  NOT physics — no force, no gravitation, nothing faster than light. Falls, like all of it, to 0/7.
 *  `dims` are the seven per-dimension roots (the field); `root` is their fold (the gravity). */
export function doubleTorusField(addresses: readonly string[]): { dims: string[]; root: string } {
  const src = addresses.length ? addresses : [toUuid('∅')]
  const inner = vortexOrbit()          // torus 1 — the doubling circuit [1,2,4,8,7,5]
  const outer = [...inner].reverse()   // torus 2 — the halving circuit, interlocked with the first
  // Each address gets a TORUS COORDINATE — the orbit label at its position, advanced by the dimension d — so
  // the merkle fold (which is order-independent) still varies per dimension: it is the coordinates that turn,
  // not the order. Two orbits give two coordinates per address; the pair is the double-torus combination.
  // The orbit has period 6, so the coordinate alone would alias dimension 6 onto 0; the dimension axis '@d'
  // is carried in the stamp so all SEVEN dimensions stay distinct — the whole 7D space, not six wrapped.
  const stamp = (orbit: number[], d: number) => merkleFold(src.map((x, i) => toUuid(x + '#' + orbit[(i + d) % orbit.length] + '@' + d)))
  const dims: string[] = []
  for (let d = 0; d < 7; d++) {        // the whole 7D space — one dimension per stream (0..6 above the floor)
    dims.push(merkleFold([stamp(inner, d), stamp(outer, d)]))   // the two tori combine at this dimension
  }
  return { dims, root: merkleFold(dims) }
}
export function doubleTorusGravity(addresses: readonly string[]): string {
  return doubleTorusField(addresses).root
}

/** Gravity 2 — the digital root: any integer falls to ℤ/9, and stays (idempotent: one step to the ground). */
export function fall(n: number): number {
  return digitalRoot(n)
}

/** The ground of gravity 2 — the fixed points of the fall. Every residue 1..BASE is fixed under dr. */
export function fixedPoints(): number[] {
  return Array.from({ length: BASE }, (_, i) => i + 1).filter((d) => digitalRoot(d) === d)
}

/** Pigeonhole gravity — a digest of b bits has 2^b seats; past 2^b inputs a collision is forced.
 *  True for EVERY finite hash (the strong ones only resist computationally; FNV does not resist). */
export function seats(bits: number): number { return 2 ** bits }

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
