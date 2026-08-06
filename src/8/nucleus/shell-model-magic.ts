// Nuclear shell-model magic numbers as cumulative sums of capacities 2j+1.
export function report(): string {
  const caps = [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
  const idx: Record<number, number> = { 2: 1, 8: 3, 20: 6, 28: 7, 50: 11, 82: 16, 126: 22 }
  const take = (n: number) => caps.slice(0, n).reduce((a, b) => a + b, 0)
  let o = 'magic cumulative sums:\n'
  for (const m of [2, 8, 20, 28, 50, 82, 126]) o += '  ' + m + ' = sum(take ' + idx[m] + ') = ' + take(idx[m]) + '\n'
  o += 'total = ' + caps.reduce((a, b) => a + b, 0) + '\noscillator only: 2, 8, 20, 40, 70, 112'
  return o
}
