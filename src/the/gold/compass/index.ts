// the compass — the golden angle. Divide the circle by φ² and you get ≈ 137.5°, the angle at which
// each new step lands in the largest remaining gap — the direction that never repeats and never
// clusters. It is how a sunflower places its seeds and how a route can cover the circle without ever
// retracing. Computed from φ (../), decidable, not a physics claim. Foots to 0/7.
import { phiApprox } from '../index.ts'

/** The golden angle in degrees — 360 / φ² ≈ 137.5°, the maximally-even direction step. */
export function goldenAngle(): number {
  const phi = phiApprox(24)
  return 360 / (phi * phi)
}

/** Place n bearings by the golden compass — each rotated by the golden angle; none coincide. */
export function bearings(n: number): number[] {
  const step = goldenAngle()
  return Array.from({ length: n }, (_, i) => (i * step) % 360)
}

export function report(): string {
  const a = goldenAngle()
  let o = 'the compass — the golden angle (the direction that never repeats):\n\n'
  o += '  golden angle ≈ ' + a.toFixed(4) + '° = 360 / φ² — each step lands in the largest remaining gap\n'
  o += '  bearings never coincide: how a sunflower fills its head, how a route covers the circle evenly\n'
  o += '  computed from the gold (../), not a physics claim; foots to 0/7.'
  return o
}
