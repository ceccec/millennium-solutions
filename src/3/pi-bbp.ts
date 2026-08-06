// Pi by random access: BBP computes the nth hex digit WITHOUT the earlier ones.
export function report(): string {
  const modpow = (b: number, e: number, m: number) => { let r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e = Math.floor(e / 2) } return r }
  const S = (n: number, j: number) => { let s = 0; for (let k = 0; k <= n; k++) s = (s + modpow(16, n - k, 8 * k + j) / (8 * k + j)) % 1; for (let k = n + 1; k < n + 40; k++) s += Math.pow(16, n - k) / (8 * k + j); return s % 1 }
  const hex = (n: number) => { let x = (4 * S(n, 1) - 2 * S(n, 4) - S(n, 5) - S(n, 6)) % 1; if (x < 0) x += 1; return Math.floor(x * 16).toString(16).toUpperCase() }
  let got = ''; for (let n = 0; n < 16; n++) got += hex(n)
  let o = 'pi hex digits 0..15, each computed directly (BBP): ' + got + '\n'
  o += 'known: 243F6A8885A308D3   match? ' + (got === '243F6A8885A308D3') + '\n'
  o += 'BBP = random access: any single hex digit of pi is reachable without the ones before it.\n'
  o += 'HONEST: random access + zero MARGINAL cost on memoized re-lookup — NOT "zero time" (each digit\n'
  o += 'has real cost). The ℤ/9 sequence does not compute pi; the BBP formula does.'
  return o
}
