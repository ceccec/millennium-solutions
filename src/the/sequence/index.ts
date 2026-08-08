// the sequence — the ℤ/9 doubling circuit, the vortex.
import { toUuid, merkleFold, vortexOrbit, units, triad } from '../../0/index.ts'
export function report(): string {
  const orbit = vortexOrbit()
  let o = 'the sequence — the ℤ/9 doubling circuit (n ↦ 2n mod 9), the vortex:\n\n'
  o += '  ' + orbit.join(' → ') + ' → ' + orbit[0] + '  (closes after 6 steps)\n'
  o += '  units on the circuit: ' + units().join(', ') + '\n'
  o += '  triad (the axis, off-circuit): ' + triad().join(', ') + '\n'
  o += '  root: ' + merkleFold(orbit.map((d) => toUuid(String(d)))).slice(0, 13) + '…\n'
  o += '  the sequence covers every unit exactly once and closes. entails → 0/7.'
  return o
}
