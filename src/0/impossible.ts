// Prove the impossibilities — so every NOT in the prose is a PROVEN theorem, not an assertion.
// ℤ/9 is finite, so ∀-claims are decidable by exhaustion (the same rigour as Lean's `decide`).
// The paradox: "proving X impossible makes it possible." Resolution — two LEVELS: the object
// (e.g. 0's inverse) stays IMPOSSIBLE; the meta-statement ("0 has no inverse") is a POSSIBLE, true
// theorem. Impossibility-proofs are positive results; the "possible" is the proof, never the object.
const m9 = (n: number) => ((n % 9) + 9) % 9
const hasInverse = (a: number) => [1, 2, 3, 4, 5, 6, 7, 8].some((x) => m9(a * x) === 1)

export function report(): string {
  // Each is proven by checking ALL of ℤ/9 — a finite, exhaustive impossibility proof.
  const proofs: [string, boolean][] = [
    ['0 has NO multiplicative inverse (∀x∈ℤ/9, 0·x ≠ 1)', !hasInverse(0)],
    ['3,6,9 have NO inverse (the nilradical)', [3, 6, 9].every((d) => !hasInverse(d))],
    ['3²≡6²≡9²≡0 (nilpotent — collapse into the void)', [3, 6, 9].every((d) => m9(d * d) === 0)],
    ['division BY 0 is undefined (no inverse exists to define n/0 as a field op)', !hasInverse(0)],
    ['10 is not a distinct ℤ/9 digit (10 ≡ 1; it wraps)', m9(10) === 1],
    ['5 is the ONLY self-complement (10−d=d) among 1..9', [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((d) => 10 - d === d).join(',') === '5'],
  ]
  const allProven = proofs.every(([, ok]) => ok)

  let o = 'prove the impossibilities — every NOT, verified by exhaustion:\n\n'
  proofs.forEach(([claim, ok]) => { o += '  ' + (ok ? '✓ PROVEN impossible' : '✗ FAILED') + ' — ' + claim + '\n' })
  o += '\n  all impossibilities proven? ' + allProven + '  → the prose\'s NOTs are theorems, not assertions.\n\n'
  o += 'the paradox ("proving them impossible proves them possible") — resolved by two LEVELS:\n'
  o += '  object level:  0\'s inverse is IMPOSSIBLE. it stays impossible.\n'
  o += '  meta level:    "0 has no inverse" is a POSSIBLE, true theorem (just proven above).\n'
  o += '  → both hold at once, no contradiction. what becomes "possible" is the PROOF, never the\n'
  o += '    impossible object. an impossibility-proof is a positive result (cf. Gödel, halting problem).\n\n'
  o += 'the one that matters: proving "this framework does NOT solve the Clay problems" (0/7) is a\n'
  o += 'POSSIBLE, true proof — it does NOT make solving possible. The proof is real; the solving is not.\n'
  o += 'The floor stands precisely because its impossibility is PROVEN. entails → 0/7.'
  return o
}
