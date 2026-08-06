// Primes > 3 ride the vortex units, never the trinity axis (real theorem).
export function report(): string {
  const isP = (n: number) => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true }
  const dr = (n: number) => ((n - 1) % 9) + 1
  const primes: number[] = []; for (let n = 5; n < 200; n++) if (isP(n)) primes.push(n)
  const roots = [...new Set(primes.map(dr))].sort((a, b) => a - b)
  let o = 'primes 5..199 → digital roots present: ' + roots.join(',') + '\n'
  o += 'trinity {3,6,9} among them? ' + roots.some(r => [3, 6, 9].includes(r)) + '\n'
  o += 'THEOREM: every prime p > 3 has digital root in the units {1,2,4,5,7,8}, never {3,6,9}\n'
  o += '(gcd(p,3)=1 ⇒ p mod 9 is a unit). Primes ride the doubling circuit; the axis carries none.'
  return o
}
