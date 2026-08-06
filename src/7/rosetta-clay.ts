// Fusion of the Pliska rosette (7 rays) and the 7 Clay problems: both are 7 = 6 + 1.
// The 6 units of (ℤ/7)* (cyclic C6) ↔ the 6 open problems; the center 0 ↔ Poincaré (solved).
export function report(): string {
  const gen = 3            // primitive root: ray-orbit generator
  let x = gen; const rays: number[] = []
  for (let i = 0; i < 6; i++) { rays.push(x); x = (x * gen) % 7 }   // [3,2,6,4,5,1]
  const open = ['Riemann Hypothesis', 'P vs NP', 'Navier-Stokes', 'Yang-Mills', 'Hodge', 'BSD']
  let o = 'rosette 7 rays  = (ℤ/7)* {6 units, C6}  +  center 0\n'
  o += 'clay 7 problems = 6 open              +  Poincaré (solved)\n'
  o += '→ identical 6 + 1 split.\n\nfusion (ray ↔ open problem, via generator 3):\n'
  rays.forEach((r, i) => { o += '  ray ' + r + '  ↔  ' + open[i] + '\n' })
  o += '  center 0  ↔  Poincaré  (the fixed/solved point)\n'
  o += '\nstructure: a bijection of two 7-element sets (a relabeling). entails.ts → 0/7.'
  return o
}
