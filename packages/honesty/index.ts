// @ceccec/honesty — reusable tests for any bold claim. Zero dependencies, pure.
export function entails(trueWhenConjectureFalse: boolean) {
  return { solves: !trueWhenConjectureFalse, note: trueWhenConjectureFalse ? 'true even when the conjecture is false → entails nothing' : 'can be false when the conjecture is false → may entail' }
}
export function curveFitCheck(target: number, consts: number[], ints = [1, 2, 3, 5, 7, 11, 13, 17], control?: number) {
  const best = (t: number) => { let b = { err: Infinity, expr: '' }; for (const a of consts) for (const c of [1, ...consts]) for (const k of ints) { const v = a * k / c; const e = Math.abs(v - t) / t; if (e < b.err) b = { err: e, expr: `${a}·${k}/${c} = ${v}` } } return b }
  const f = best(target), g = control !== undefined ? best(control) : null
  return { fit: f.expr, err: f.err, controlFit: g?.expr ?? null, vacuous: g ? g.err < 0.02 : null }
}
export function scaleCheck(a: number, b: number) { const r = a / b; return { ratio: r, orders: Math.round(Math.log10(Math.abs(r))) } }
