// Biot–Savart field of the merkaba coil geometry: counter-rotating → axis null; co-rotating → max.
export function report(): string {
  const MU = 1e-7, I = 1, R = 1, rL = 0.3, SEG = 200, deg = (d: number) => d * Math.PI / 180
  const loops = [{ d: 1, phi: 40 }, { d: 4, phi: 160 }, { d: 7, phi: 280 }, { d: 2, phi: 80 }, { d: 5, phi: 200 }, { d: 8, phi: 320 }]
  const cross = (a: number[], b: number[]) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
  const sub = (a: number[], b: number[]) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
  const B = (Pt: number[], sign: (d: number) => number) => {
    let b = [0, 0, 0]
    for (const L of loops) {
      const cx = R * Math.cos(deg(L.phi)), cy = R * Math.sin(deg(L.phi)), s = sign(L.d)
      for (let i = 0; i < SEG; i++) {
        const t = 2 * Math.PI * (i + 0.5) / SEG
        const src = [cx + rL * Math.cos(t), cy + rL * Math.sin(t), 0]
        const dl = [-rL * Math.sin(t) * (2 * Math.PI / SEG) * s, rL * Math.cos(t) * (2 * Math.PI / SEG) * s, 0]
        const r = sub(Pt, src), rm = Math.hypot(...r), inv = 1 / (rm * rm * rm), dB = cross(dl, r)
        b[0] += MU * I * dB[0] * inv; b[1] += MU * I * dB[1] * inv; b[2] += MU * I * dB[2] * inv
      }
    }
    return Math.hypot(...b) * 1e6
  }
  const merk = (d: number) => [1, 4, 7].includes(d) ? 1 : -1, co = () => 1
  let o = 'merkaba coil field (Biot–Savart, µT):\n'
  o += '  counter-rotating, central axis: ' + B([0, 0, 0], merk).toExponential(2) + ' → null\n'
  o += '  co-rotating,       central axis: ' + B([0, 0, 0], co).toFixed(3) + ' → max\n'
  o += '  scale check μ0I/2r = ' + (4e-7 * Math.PI * I / (2 * rL) * 1e6).toFixed(2) + ' µT'
  return o
}
