// Folds of the plane: 60°→C6 hexagon, 90°→C4 square, z→1/z sphere (0↔∞); the self-seal.
export function report(): string {
  let o = 'folds:\n'
  o += '  60° (×e^{iπ/3}) → 6th roots → hexagon C6 (vortex / rosette group)\n'
  o += '  90° (×i)        → 4th roots → square  C4\n'
  o += '  z→1/z (sphere)  → 0 ↔ ∞   (division by zero as domain change)\n'
  const fr: [number, number][] = [[1, 2], [1, 2], [1, 2], [8, 7], [7, 5], [5, 3], [1, 2], [2, 3], [9, 1]]
  let num = 1, den = 1
  for (const [p, q] of fr) { num *= p; den *= q }
  o += '\nself-sealing product = ' + num + '/' + den + ' = ' + (num / den)
  return o
}
