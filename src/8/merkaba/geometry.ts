// Cube down its (1,1,1) axis → hexagon → Seed/Flower/Fruit/Metatron; merkaba = cube.
export function report(): string {
  const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const norm = (a: number[]) => { const m = Math.hypot(...a); return a.map(x => x / m) }
  const f = norm([1, 1, 1]); const rr = norm(cross([0, 1, 0], f)); const uu = cross(f, rr)
  const cube: number[][] = []; for (const x of [1, -1]) for (const y of [1, -1]) for (const z of [1, -1]) cube.push([x, y, z])
  const P = cube.map(v => Math.hypot(dot(v, rr), dot(v, uu)))
  const outer = P.filter(r => r > 0.4), center = P.filter(r => r <= 0.4)
  let o = 'cube down (1,1,1) axis:\n'
  o += '  outer vertices: ' + outer.length + ' at radius ' + outer[0].toFixed(3) + ' (regular hexagon)\n'
  o += '  on-axis center: ' + center.length + '\n'
  o += '  → Seed of Life = ' + (outer.length + 1) + ' (6+1); Fruit = 13; Metatron lines = ' + (13 * 12 / 2) + '; Platonic solids = 5\n'
  o += '  merkaba (8 vertices) = a cube; lattice = cube graph Q3 (8 nodes, 3-regular, bipartite)'
  return o
}
