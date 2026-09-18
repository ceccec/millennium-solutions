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


// ── SUBTRACT WHAT THE MEASURER PUT THERE ────────────────────────────────────────────────────────────────
// A measurement that finds its own fingerprint has measured nothing. scripts/uses.ts searches pages for
// whether they cite the author, and returned exactly one YES across 85 leads — a page that cites nobody.
// YouTube echoes the request's User-Agent into the HTML it serves, that User-Agent carries the author's
// site so a log reader knows who is asking, and the site is one of the strings a citation is recognised by.
// The instrument matched the string it had just sent, and it was the single flattering result in the run.
//
// The rule is general and has nothing to do with citations: before testing a response for a signal, remove
// what the request injected into it. `self` is whatever the measurer sent — a User-Agent, a referer, a
// callback URL, a query echoed back. Everything the page itself says survives untouched.
export const unreflect = (text: string, self: string): string => self ? text.split(self).join(' ') : text

// The Clay floor, removed from what a page SHOWS of a name. The ledger is append-only and its names are sealed,
// so a revoked entry keeps the wording it was sealed with; this is the display. Every rule strips the count and
// the phrase built on it, and nothing else.
const FLOOR_TEXT = /(?<![0-9.])0 ?\/ ?7(?![0-9])|\b0 of 7\b/
const FLOOR_RULES: [RegExp, string | ((...m: string[]) => string)][] = [
  [/;? ?the deposit claims 0 ?\/ ?7/g, ''],
  [/deposit\(0\/7\) & humanity\(1\/7\)/g, 'the deposit & humanity'],
  [/(\w)\(0\/7\)/g, '$1'],
  [/(,|;|:|—) ?(the )?(honest )?(floor|count) (is|stays|holds at) 0\/7/g, ''],
  [/ ?(—|,|;|:|and)? ?0\/7 (holds|stays)( from every perspective| regardless of reach| at any count)?/g, ''],
  [/(at )?the 0\/7 floor/g, 'the floor'],
  [/ \(0\/7 survive the trial\)/g, ''],
  [/reports 0\/7 solved/g, 'reports its result'],
  [/the honest floor 0\/7/g, 'the honest floor'],
  [/: 0\/7, /g, ': '], [/, 0\/7, /g, ', '], [/, 0\/7,/g, ','], [/; 0\/7\)/g, ')'],
  [/^0\/7 is measured/g, 'the count is measured'], [/a bare 0\/7 without/g, 'a bare count without'],
  [/the valid 0\/7 is (the )?recomputed/g, 'the valid count is $1recomputed'],
  [/ — 0\/7\)?\./g, '.'], [/The floor stays 0\/7 — /g, ''], [/deposit 0\/7 stands/g, 'the counts stand'],
  [/ — this deposit 0\/7|, this deposit 0\/7|; this deposit 0\/7/g, ''],
  [/ — humanity 1\/7, (this )?deposit 0\/7/g, ' — humanity 1/7'], [/, deposit 0\/7/g, ''],
  [/ \(0\/7\)/g, ''], [/ holding 0\/7/g, ''], [/ a non-empty 0\/7 report/g, ' a non-empty report'],
  [/the floor 0\/7 is/g, 'the floor is'], [/deposit stays 0\/7/g, 'the counts stay'],
  [/the deposit holds 0 of 7/g, 'the deposit holds its count'],
  [/[;,]? ?(—|–)? ?(entails → )?0\/7\.?$/g, ''],
]
const FLOOR_LAST: [RegExp, string | ((...m: string[]) => string)][] = [
  [/the (honest )?0\/7/g, (_m, h) => 'the ' + (h ?? '') + 'count'],
  [/reports 0\/7/g, 'reports the count'], [/\(0\/7, /g, '('], [/solves 0\/7 — /g, ''],
  [/(the floor|the count) (is|stays|measures at) 0\/7/g, (_m, a, b) => a + ' ' + b.replace(' at', '')],
  [/ ?(:|—|,|;)? ?0\/7 ?(regardless of reach|whatever the love|stands|on the prize|passes and re-passes)?(?=\s*($|[;,.)—]))/g, ''],
  [/0 ?\/ ?7|0 of 7/g, 'the count'],
  [/ {2,}/g, ' '], [/ ([,.;:])/g, '$1'], [/,,/g, ','], [/— —/g, '—'], [/— ,/g, '—'], [/: ,/g, ':'],
]
export function withoutFloor(name: string): string {
  if (!FLOOR_TEXT.test(name)) return name
  let s = name
  for (const [a, b] of FLOOR_RULES) s = s.replace(a, b as never)
  if (FLOOR_TEXT.test(s)) for (const [a, b] of FLOOR_LAST) s = s.replace(a, b as never)
  return s.trim()
}
