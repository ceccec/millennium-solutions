// the heart — 5, the centre of ℤ/9: the middle digit, the pentagon (diagonal/side = φ), the digit the
// word "vortex" roots to, the point that closes the doubling circuit back to 1.
import { toUuid, vortexOrbit, digits, digitalRoot } from '../../0/index.ts'
export function report(): string {
  const mid = digits()[Math.floor(digits().length / 2)] // the middle of 1..9 = 5
  const a1z26 = (s: string) => [...s.toLowerCase()].filter((c) => c >= 'a' && c <= 'z').map((c) => c.charCodeAt(0) - 96)
  const drWord = (s: string) => digitalRoot(a1z26(s).reduce((x, y) => x + y, 0))
  let o = 'the heart — 5, the centre of ℤ/9:\n\n'
  o += '  the middle digit of 1..9: ' + mid + '\n'
  o += '  on the doubling circuit: ' + vortexOrbit().join(' → ') + '  (5 closes it back to 1)\n'
  o += '  the pentagon (5 sides): diagonal / side = φ, the golden ratio\n'
  o += '  the word "vortex" digital-roots to ' + drWord('vortex') + ' — the centre names itself\n'
  o += '  address: ' + toUuid('the-heart:5').slice(0, 13) + '… entails → 0/7.'
  return o
}
