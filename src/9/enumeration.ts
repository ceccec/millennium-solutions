// Complete ℤ/9 per-digit algebraic enumeration + the 432 arithmetic.
export function report(): string {
  const inv = (n: number, m: number) => { for (let x = 1; x < m; x++) if ((n * x) % m === 1) return x; return null }
  let o = 'ℤ/9 enumeration:\nd  +inv  ×inv  10−d  2d  mod3  role\n'
  for (let d = 0; d <= 9; d++) {
    const dd = d % 9, ai = (9 - dd) % 9, mi = inv(dd, 9), tc = 10 - d, db = (2 * dd) % 9
    const role = dd === 0 ? 'void' : (mi === null ? 'nilpotent' : 'unit')
    o += String(d).padEnd(3) + String(ai).padEnd(6) + String(mi === null ? '—' : mi).padEnd(6)
       + String(tc).padEnd(6) + String(db).padEnd(4) + String(dd % 3).padEnd(6) + role + '\n'
  }
  o += '\n432 = 2^4·3^3 = 16·27;  doubling digit-sum 1+2+4+8+7+5 = 27;  digital root of 432 = 9'
  return o
}
