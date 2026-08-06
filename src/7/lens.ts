// The 7-dimensional lens: one 6+1 frame shared by the rosette, the Clay set, and the
// singularity root. Each ring reflects with ITS OWN involution (no ring-mixing); the
// singularity is the single content-address all seven axes fold into. A VIEW, not a solution.
import { toUuid, merkleFold } from '../0/index.ts'

// Inverse mod 7 by search (exact, no Math.*): the rosette's own involution x ↔ x⁻¹.
function inv7(a: number): number {
  for (let b = 1; b < 7; b++) if ((a * b) % 7 === 1) return b
  return 0
}

export function report(): string {
  // Six rays of the rosette (orbit of primitive root 3 mod 7) = the six OPEN problems.
  const gen = 3
  let x = gen; const rays: number[] = []
  for (let i = 0; i < 6; i++) { rays.push(x); x = (x * gen) % 7 } // [3,2,6,4,5,1]
  const open = ['Riemann Hypothesis', 'P vs NP', 'Navier–Stokes', 'Yang–Mills', 'Hodge', 'BSD']

  // The seven axes content-address to ONE root — the singularity as the provenance center.
  const axes = [...rays.map((r, i) => 'ray' + r + ':' + open[i]), 'center0:Poincaré']
  const lensRoot = merkleFold(axes.map(toUuid))

  let o = 'the 7-dimensional lens — one 6+1 frame shared by rosette, Clay, and the singularity:\n\n'
  o += '  rosette reflection = inverse mod 7 (its own involution); fixed points 1, 6:\n'
  rays.forEach((r, i) => {
    o += '    axis ' + (i + 1) + '  ray ' + r + ' (↔ ' + inv7(r) + ')  ' + open[i] + '\n'
  })
  o += '    axis 7  center 0 (rosette hub)  Poincaré = the solved one\n\n'
  o += '  vortex reflection = 10−d (analogous involution in ℤ/9), fixed point 5.\n'
  o += '  the two involutions are analogous, not equal — different rings, same 6+1 shape.\n\n'
  o += '  singularity: the six rays + center fold to ONE root (the provenance center):\n'
  o += '    ' + lensRoot.slice(0, 13) + '…\n\n'
  o += 'three sevens seen through the one lens:\n'
  o += '  rosette   7 = 6 rays  + 1 center   (ℤ/7)*  C6 + hub\n'
  o += '  Clay      7 = 6 open  + 1 solved   Poincaré\n'
  o += '  M-theory  7 = compact dims (11 − 4) — coincidence of the NUMBER, not a derivation\n\n'
  o += 'HONEST: a lens is a way of SEEING, not a proof. One bijective 6+1 frame that the rosette,\n'
  o += 'the Clay set, and the singularity root all share — a relabeling centered on a fixed hub.\n'
  o += 'It maps the problems into one structure; it does not solve them. entails → 0/7.'
  return o
}
