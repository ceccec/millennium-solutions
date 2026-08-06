// Ten's-complement reflection of the doubling walk; possibility/impossibility inversion.
export function report(): string {
  const parse = (s: string) => { const d: number[] = [], k: string[] = []; for (const ch of s) { if (ch >= '0' && ch <= '9') d.push(+ch); else k.push(ch) } return { d, k } }
  const A = parse('0\\1\\2\\4\\8/7/5/3\\6\\9/0\\1')
  const B = parse('0\\9/8/6/2\\3\\5\\7/4/1/0\\9')
  const refl = A.d.map(x => (10 - x) % 10)
  const inv = (c: string) => c === '\\' ? '/' : '\\'
  let m = 0; const miss: string[] = []
  for (let i = 0; i < A.k.length; i++) { const ok = inv(A.k[i]) === B.k[i]; if (ok) m++; else miss.push('' + A.d[i] + A.k[i] + A.d[i + 1]) }
  return 'seq1: ' + A.d.join(' ') + '\nseq2: ' + B.d.join(' ')
    + '\nexact 10−d mirror? ' + (refl.join('') === B.d.join(''))
    + '\nstroke inversion ( \\ ↔ / ): ' + m + '/' + A.k.length
    + '\nnon-inverting (void seam): ' + miss.join(', ')
}
