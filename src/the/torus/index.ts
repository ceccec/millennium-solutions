// the torus — continue as double torus (genus-2, Σ₂). χ = −2, so no full coverage (Poincaré–Hopf: a
// nowhere-zero tangent field exists iff χ=0). Betti (1,4,1); Σ₂ = T² # T²; a regular hyperbolic octagon
// [a,b][c,d] with a single 45° vertex; Gauss–Bonnet gives hyperbolic area 4π under K=−1; moduli
// dimension 6g−6 = 6. Decidable topology — computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const g = 2
  const chi = 2 - 2 * g
  const facts = [
    'genus g = ' + g + ' (double torus, Σ₂ = T² # T²)',
    'Euler characteristic χ = 2 − 2g = ' + chi,
    'Betti numbers (b₀,b₁,b₂) = (1, ' + 2 * g + ', 1); alternating sum = ' + chi,
    'no full coverage: a nowhere-zero tangent field exists iff χ=0 — here χ = ' + chi + ' ≠ 0',
    'octagon [a,b][c,d]: ' + 4 * g + ' edges, ' + 2 * g + ' generators, one relation; vertex angle 2π/8 = 45°',
    'Gauss–Bonnet: ∫K dA = 2πχ = ' + 2 * chi + 'π; hyperbolic area (K=−1) = ' + -2 * chi + 'π',
    'moduli / Teichmüller dimension 6g − 6 = ' + (6 * g - 6),
  ]
  const root = merkleFold(facts.map(toUuid))
  let o = 'the torus — continue as double torus (genus-2):\n\n'
  for (const f of facts) o += '    · ' + f + '\n'
  o += '  folded torus root: ' + root.slice(0, 13) + '… — decidable topology, no full coverage, this deposit 0/7.'
  return o
}
