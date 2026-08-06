// Proton/electron mass ratio: vortex fit vs measurement.
export function report(): string {
  const ratio = 938.27208816 / 0.51099895
  let o = 'measured m_p/m_e = ' + ratio.toFixed(6) + '\n'
  o += 'vortex fit 108·17 = 1836  (err ' + (Math.abs(1836 - ratio) / ratio * 100).toExponential(2) + '%)\n'
  o += '6·π⁵ = ' + (6 * Math.PI ** 5).toFixed(3) + ' (unrelated, fits better)\n'
  o += '1836 ≠ 1836.1527; 1836 fits any nearby target → curve-fit, not prediction'
  return o
}
