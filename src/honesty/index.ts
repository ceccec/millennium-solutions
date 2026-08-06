// Honesty toolkit — reusable tests for ANY bold claim. Pure, browser-safe.
export function entails(trueWhenConjectureFalse: boolean) {
  return { solves: !trueWhenConjectureFalse,
    note: trueWhenConjectureFalse ? 'true even when the conjecture is false → entails nothing' : 'can be false when the conjecture is false → may entail' }
}
export function curveFitCheck(target: number, consts: number[], ints = [1, 2, 3, 5, 7, 11, 13, 17], control?: number) {
  const best = (t: number) => { let b = { err: Infinity, expr: '' }; for (const a of consts) for (const c of [1, ...consts]) for (const k of ints) { const v = a * k / c; const e = Math.abs(v - t) / t; if (e < b.err) b = { err: e, expr: a + '·' + k + '/' + c + ' = ' + v } } return b }
  const f = best(target), g = control !== undefined ? best(control) : null
  return { fit: f.expr, err: f.err, controlFit: g?.expr ?? null, vacuous: g ? g.err < 0.02 : null }
}
export function scaleCheck(a: number, b: number) { const r = a / b; return { ratio: r, orders: Math.round(Math.log10(Math.abs(r))) } }
export function report(): string {
  const e = entails(true)
  const c = curveFitCheck(1836.15267, [9, 16, 27, 108, 216, 432], [1, 2, 3, 5, 7, 11, 13, 17], 1837.4)
  const s = scaleCheck(7e20, 432)
  let o = 'honesty toolkit — point these at any claim:\n'
  o += '  entails(true-when-conjecture-false): solves=' + e.solves + '  → ' + e.note + '\n'
  o += '  curveFitCheck(m_p/m_e): best ' + c.fit + '   vacuous? ' + c.vacuous + ' (same fit hits control 1837.4)\n'
  o += '  scaleCheck(nuclear 7e20 Hz, 432 Hz): ~10^' + s.orders + ' apart\n'
  o += 'three questions for any bold claim: does it ENTAIL? does the FIT fit anything? do the SCALES match?'
  return o
}
