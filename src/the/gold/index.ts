// the gold — the golden ratio φ = (1+√5)/2. Not stored as an exact irrational: computed by its
// decidable fingerprints — φ² = φ + 1 (in the limit), and the Fibonacci ratios Fₙ₊₁/Fₙ climb to it
// while Cassini keeps |Fₙ₊₁·Fₙ₋₁ − Fₙ²| = 1 at every rung. The pentagon's diagonal/side is φ; the
// heart 5 lives here; its continued fraction is [1;1,1,1,…], the slowest of all to approximate.
// Computed, not stored. Foots to 0/7.
import { toUuid } from '../../0/index.ts'

/** Fibonacci — the ladder whose consecutive ratios climb to φ. */
export function fib(n: number): number[] {
  const f = [0, 1]
  for (let i = 2; i <= n; i++) f.push(f[i - 1] + f[i - 2])
  return f
}

/** A rational approximation of φ — the ratio of consecutive Fibonacci numbers (decidable, not exact). */
export function phiApprox(n: number): number {
  const f = fib(n + 1)
  return f[n + 1] / f[n]
}

/** Cassini's identity — the invariant that holds at every rung: Fₙ₊₁·Fₙ₋₁ − Fₙ² = (−1)ⁿ. */
export function cassini(n: number): number {
  const f = fib(n + 1)
  return f[n + 1] * f[n - 1] - f[n] * f[n]
}

export function report(): string {
  const p = phiApprox(20)
  let o = 'the gold — the golden ratio φ (computed by its fingerprints, not stored as an irrational):\n\n'
  o += '  φ ≈ ' + p.toFixed(9) + ' — the ratio of consecutive Fibonacci numbers (F₂₁/F₂₀)\n'
  o += '  identity: φ² = φ + 1 (in the limit); Cassini |Fₙ₊₁Fₙ₋₁ − Fₙ²| = 1 at every step\n'
  o += '  the pentagon diagonal/side is φ; the heart 5 lives here; continued fraction [1;1,1,1,…]\n'
  o += '  the compass: the golden angle (./compass); all of it foots to 0/7. address ' + toUuid('gold-phi').slice(0, 13) + '…'
  return o
}
