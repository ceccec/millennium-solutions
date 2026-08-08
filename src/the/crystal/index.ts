// the crystal / the diamond — the diamond cubic lattice: two interpenetrating FCC lattices, each atom
// tetrahedrally bonded to four neighbours at arccos(−1/3) ≈ 109.47°, densest packing π/(3√2). Decidable
// geometry — coordination counted by exhaustion, not stored. Imagine the lattice; the numbers are exact.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const angle = Math.acos(-1 / 3) * 180 / Math.PI
  const packing = Math.PI / (3 * Math.sqrt(2))
  const fcc = [[0, 0, 0], [0, 2, 2], [2, 0, 2], [2, 2, 0]]
  const basis = [...fcc, ...fcc.map(([x, y, z]) => [x + 1, y + 1, z + 1])]
  const atoms: number[][] = []
  for (let cx = -1; cx <= 1; cx++) for (let cy = -1; cy <= 1; cy++) for (let cz = -1; cz <= 1; cz++) for (const [x, y, z] of basis) atoms.push([x + 4 * cx, y + 4 * cy, z + 4 * cz])
  const d2 = (a: number[]) => a[0] * a[0] + a[1] * a[1] + a[2] * a[2]
  const ds = atoms.map(d2).filter((v) => v > 0).sort((a, b) => a - b)
  const coord = ds.filter((v) => v === ds[0]).length
  const root = merkleFold(['diamond', 'fcc', 'tetrahedron'].map(toUuid))
  let o = 'the crystal — the diamond cubic lattice:\n\n'
  o += '  two interpenetrating FCC lattices; each atom bonds to ' + coord + ' nearest neighbours\n'
  o += '  (counted by exhaustion over 27 cells), at the tetrahedral angle arccos(−1/3) = ' + angle.toFixed(4) + '°.\n'
  o += '  densest lattice packing: π/(3√2) = ' + packing.toFixed(6) + ' (FCC/HCP, the diamond’s parent).\n'
  o += '  imagine the lattice; the numbers are exact. folded crystal root: ' + root.slice(0, 13) + '…\n'
  o += '  decidable geometry — this deposit 0/7.'
  return o
}
