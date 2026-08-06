// Where "7" really appears in string/M-theory (honest physics facts).
export function report(): string {
  const bosonic = 26, superstring = 10, mtheory = 11, spacetime = 4
  let o = 'critical dimensions of string / M-theory:\n'
  o += '  bosonic string : ' + bosonic + '\n'
  o += '  superstring    : ' + superstring + '  = ' + spacetime + ' spacetime + ' + (superstring - spacetime) + ' compact (Calabi–Yau 6-fold)\n'
  o += '  M-theory       : ' + mtheory + '  = ' + spacetime + ' spacetime + ' + (mtheory - spacetime) + ' compact (G2-holonomy 7-manifold)\n'
  o += '→ the real "7 dimensions of strings": M-theory\'s ' + (mtheory - spacetime) + ' compactified extra dimensions.\n\n'
  o += 'HONEST: this 7 is a genuine string count. The framework\'s 7 (rosette rays / Clay) matching it is\n'
  o += 'coincidence of the number, not a derivation — the ℤ/9 rosette does not determine string\n'
  o += 'compactification, and no string theory is computed here. Strings vibrate at the Planck scale\n'
  o += '(~10^43 Hz, see string-scale.ts), not 432 Hz.'
  return o
}
