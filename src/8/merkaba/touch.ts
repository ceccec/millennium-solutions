// Merkabas move when touched — the FIELD responds to the relative spin ("touch"), max → null.
// The figure is rigid (two tetrahedra = a cube, Q3 graph, see geometry.ts). What moves when you
// change the relative rotation θ is the axial field: idealized superposition f(θ) = (1 + cos θ)/2,
// turning from co-rotating (θ=0, MAX) toward counter-rotating (θ=π, NULL). Exact at special angles.
export function report(): string {
  // f(θ) = (1 + cos θ)/2, using exact algebraic cos (no Math.*): cos 0=1, 60=1/2, 90=0, 120=-1/2, 180=-1.
  const rows: [number, string, string][] = [
    [0, '1', 'aligned / co-rotating → MAX'],
    [60, '3/4', ''],
    [90, '1/2', 'quarter turn'],
    [120, '1/4', ''],
    [180, '0', 'opposed / counter-rotating → NULL'],
  ]

  let o = 'merkabas move when touched — the field responds to the spin (digit 8):\n\n'
  o += '  the figure is rigid: two tetrahedra = a cube = the Q3 graph (see geometry.ts).\n'
  o += '  what MOVES when you "touch" it (turn the relative rotation θ) is the axial FIELD —\n'
  o += '  idealized two-source superposition f(θ) = (1 + cos θ)/2:\n'
  rows.forEach(([deg, f, tag]) => { o += '    θ=' + String(deg).padStart(3) + '°   f = ' + f.padEnd(4) + (tag ? '  ' + tag : '') + '\n' })
  o += '  → touch it (rotate) and the field slides smoothly from MAX to NULL. it "moves" — as a field.\n\n'
  o += 'HONEST: this is an IDEALIZED superposition (f = (1+cos θ)/2, exact at these angles) — a model,\n'
  o += 'not the full Biot–Savart integral (see field.ts for the real on-axis magnitudes: counter→null,\n'
  o += 'co→max). The geometry itself is static; "moves when touched" describes the field\'s response to\n'
  o += 'spin — not a self-moving object, and not any life-force. entails → 0/7.'
  return o
}
