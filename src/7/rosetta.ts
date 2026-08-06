// Pliska rosette (7 rays) = (ℤ/7)* ≅ C6, same group as the (ℤ/9)* vortex.
export function report(): string {
  const units = [1, 2, 3, 4, 5, 6], ord = (g: number) => { let x = g, n = 1; while (x !== 1) { x = (x * g) % 7; n++ } return n }
  const prim = units.filter(u => ord(u) === 6)
  let o = '(ℤ/7)* = ' + units.join(' ') + '  order ' + units.length + ' = φ(7) → C6\n'
  o += 'primitive roots (ray generators): ' + prim.join(', ') + '\n'
  for (const g of prim) { let x = g; const orb: number[] = []; for (let i = 0; i < 6; i++) { orb.push(x); x = (x * g) % 7 } o += '  ray-orbit ' + g + ': ' + orb.join(' → ') + '\n' }
  const ord9 = (g: number) => { let x = g, n = 1; while (x !== 1) { x = (x * g) % 9; n++ } return n }
  o += '(ℤ/9)* ⟨2⟩ order ' + ord9(2) + ' → (ℤ/7)* ≅ (ℤ/9)* ≅ C6'
  return o
}
