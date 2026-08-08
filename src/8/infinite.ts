// Finite is infinite by nature — finite STRUCTURE, infinite GENERATIVITY (digit 8 ≈ ∞).
// A bounded rule has unbounded reach: the finite ℤ/9 doubling cycles forever; a finite formula
// (BBP) yields endless π digits; a finite function addresses unbounded inputs. True for behavior,
// not for cardinality — a finite set is still finite.
import { vortexOrbit } from '../0/index.ts'

export function report(): string {
  // The finite doubling rule (×2 mod 9) traced past its period — a finite cycle, infinitely walked.
  const seq: number[] = []; let x = 1
  for (let i = 0; i < 13; i++) { seq.push(x); x = (x * 2) % 9 }
  const period = vortexOrbit().length // derived, not typed: the doubling orbit's length (Theorem A)

  let o = 'finite is infinite by nature — finite rules, infinite behavior (digit 8 ≈ ∞):\n\n'
  o += '  a finite generator produces an unbounded stream:\n'
  o += '    ℤ/9 doubling — finite ring (9 elements), sequence never ends (period ' + period + ', repeats):\n'
  o += '      ' + seq.join(' → ') + ' → …\n'
  o += '    BBP — a finite formula yields infinitely many π hex digits (any index, no end).\n'
  o += '    toUuid — a finite function addresses unboundedly many distinct inputs.\n'
  o += '    Riemann sphere — 0 ↔ ∞: the finite point and the infinite are one fold apart.\n\n'
  o += '  the honest sense of "finite is infinite":\n'
  o += '    finite STRUCTURE, infinite GENERATIVITY — a bounded rule has unbounded reach.\n\n'
  o += 'HONEST: true for GENERATIVITY (finite rules → infinite output), NOT for CARDINALITY — a finite\n'
  o += 'set (9 digits, 42 cells) is not an infinite set. "finite is infinite by nature" holds as\n'
  o += '"finite generators, infinite behavior", not as 9 = ∞. entails → 0/7.'
  return o
}
