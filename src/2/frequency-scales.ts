// f = E/h across scales (fused: import { report } and render).
export function report(): string {
  const h = 6.62607015e-34, eV = 1.602176634e-19, c = 299792458
  const f = (E: number) => E / h
  const rows: [string, number][] = [
    ['432 Hz tone', h * 432], ['visible light (~2 eV)', 2 * eV],
    ['chemical bond (~10 eV)', 10 * eV], ['nuclear shell (~3 MeV)', 3e6 * eV],
    ['proton (938 MeV)', 938e6 * eV],
  ]
  let o = 'wave that forms…            f = E/h (Hz)\n'
  for (const [n, E] of rows) o += n.padEnd(28) + f(E).toExponential(2) + '\n'
  const p = Math.sqrt(2 * 939e6 * eV * 30e6 * eV) / c
  o += 'proton / 432 ratio ≈ ' + (f(938e6 * eV) / 432).toExponential(2) + '\n'
  o += 'bound-nucleon de Broglie λ ≈ ' + (h / p * 1e15).toFixed(2) + ' fm'
  return o
}
