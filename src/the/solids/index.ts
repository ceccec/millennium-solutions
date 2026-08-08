// the solids — the five Platonic solids (regular convex polyhedra): F, V, E with Euler V−E+F=2,
// duality (V↔F), and the pentagram/golden thread through the dodecahedron (12 pentagons) and the
// icosahedron (5 triangles per vertex). Decidable geometry — computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'
const SOLIDS = [
  { n: 'tetrahedron', V: 4, E: 6, F: 4, s: '{3,3}', dual: 'self' },
  { n: 'cube', V: 8, E: 12, F: 6, s: '{4,3}', dual: 'octahedron' },
  { n: 'octahedron', V: 6, E: 12, F: 8, s: '{3,4}', dual: 'cube' },
  { n: 'dodecahedron', V: 20, E: 30, F: 12, s: '{5,3}', dual: 'icosahedron' },
  { n: 'icosahedron', V: 12, E: 30, F: 20, s: '{3,5}', dual: 'dodecahedron' },
]
export function report(): string {
  const phi = (1 + Math.sqrt(5)) / 2
  const root = merkleFold(SOLIDS.map((s) => toUuid(s.n + ':' + s.V + ',' + s.E + ',' + s.F)))
  const pad = (x: string | number, w: number) => String(x).padEnd(w)
  let o = 'the solids — the five Platonic solids (V − E + F = 2):\n\n'
  o += '    ' + pad('solid', 14) + pad('V', 4) + pad('E', 4) + pad('F', 4) + pad('{p,q}', 8) + 'dual\n'
  for (const s of SOLIDS) o += '    ' + pad(s.n, 14) + pad(s.V, 4) + pad(s.E, 4) + pad(s.F, 4) + pad(s.s, 8) + s.dual + '\n'
  o += '\n  Euler V−E+F=2: ' + (SOLIDS.every((s) => s.V - s.E + s.F === 2) ? 'holds for all five' : 'FAILS') + '.\n'
  o += '  exactly five exist (1/p + 1/q > 1/2, p,q≥3) — no sixth.\n'
  o += '  the pentagram thread: the dodecahedron has 12 pentagonal faces; the icosahedron, 5 triangles\n'
  o += '  per vertex; the pentagon diagonal-to-side ratio is φ = ' + phi.toFixed(6) + ' (2·cos36°).\n'
  o += '  folded solids root: ' + root.slice(0, 13) + '… — decidable geometry, this deposit 0/7.'
  return o
}
