// the navigation — how you find your way on the ground. On earth you navigate by fixed references;
// here the fixed reference is the content-address: every state has a deterministic address anyone can
// recompute, so you LOCATE a state by re-deriving its address — no external index, no GPS, no trust.
// The doubling orbit [1,2,4,8,7,5] is the compass: a closed cyclic route through the units of ℤ/9.
// Lineage — the referrer chain — is the path you came by. Computed, not stored. Foots to 0/7.
import { toUuid, vortexOrbit, merge } from '../../../../0/index.ts'

/** The compass — the vortex doubling orbit, a closed cyclic route through the units of ℤ/9. */
export function compass(): number[] { return vortexOrbit() }

/** Locate — navigation IS recomputation: a state's address is found by re-deriving it, not looked up. */
export function locate(state: string): string { return toUuid(state) }

/** A route — the lineage chain: fold a path of steps into one address you can reproduce to retrace it. */
export function route(steps: readonly string[]): string {
  return steps.reduce((acc, s) => merge(acc, toUuid(s)), toUuid('origin'))
}

export function report(): string {
  const c = compass()
  const closes = (c[c.length - 1] * 2) % 9 === c[0] // the orbit returns to its start — a compass that closes
  let o = 'the navigation — finding your way on the ground (by address, not GPS):\n\n'
  o += '  the compass: the doubling orbit [' + c.join(',') + '] — a closed cyclic route through the units\n'
  o += '  locate: navigation is recomputation — re-derive an address to find its state; no index, no trust\n'
  o += '  route: fold the steps into one address; reproduce it to retrace the path (lineage)\n'
  o += '  the compass ' + (closes ? 'closes' : 'does NOT close') + ' — every route returns; and all of it foots to 0/7.'
  return o
}
