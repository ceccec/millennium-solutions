// the surface — widen: the classification of ALL closed surfaces. A complete invariant is (χ,
// orientability). Orientable: S² or a connected sum of g tori, χ = 2 − 2g. Non-orientable: a connected
// sum of k projective planes, χ = 2 − k. Coverage (a nowhere-zero tangent field) exists iff χ=0 — only
// the torus and the Klein bottle. The sign of χ fixes the geometry (spherical / flat / hyperbolic).
// Decidable topology — computed, not stored.
import { toUuid, merkleFold } from '../../0/index.ts'
export function report(): string {
  const geom = (chi: number) => chi > 0 ? 'spherical' : chi === 0 ? 'flat' : 'hyperbolic'
  const rows = [
    { name: 'sphere S²', chi: 2, cover: false },
    { name: 'projective plane ℝP²', chi: 1, cover: false },
    { name: 'torus T² (g=1)', chi: 0, cover: true },
    { name: 'Klein bottle (k=2)', chi: 0, cover: true },
    { name: 'double torus Σ₂ (g=2)', chi: -2, cover: false },
    { name: 'genus-3 (g=3)', chi: -4, cover: false },
  ]
  const root = merkleFold(rows.map((r) => toUuid(r.name + ':' + r.chi)))
  const pad = (x: string | number, w: number) => String(x).padEnd(w)
  let o = 'the surface — the classification of all closed surfaces:\n\n'
  o += '  complete invariant: (χ, orientability). coverage (nowhere-zero field) iff χ=0.\n\n'
  o += '    ' + pad('surface', 26) + pad('χ', 5) + pad('geometry', 12) + 'full coverage\n'
  for (const r of rows) o += '    ' + pad(r.name, 26) + pad(r.chi, 5) + pad(geom(r.chi), 12) + (r.cover ? 'yes' : 'no') + '\n'
  o += '\n  only the torus and the Klein bottle can be fully covered. folded surface root: ' + root.slice(0, 13) + '…\n'
  o += '  decidable topology — this deposit 0/7.'
  return o
}
