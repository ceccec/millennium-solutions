// I Ching as exact binary combinatorics — a tradition use case (cf. glagolitic.ts). Yin/yang are
// 0/1; a trigram is 3 bits (2³ = 8, the bagua); a hexagram is 6 bits (2⁶ = 64). This IS computer
// binary — Leibniz mapped the I Ching to base-2 in 1703. 64 = 2⁶ = 4³ (the DNA codons, dna.ts) = 8².
export function report(): string {
  const states = 2                 // yin (0) / yang (1) — one bit
  const trigrams = states ** 3     // 8  (the bagua)
  const hexagrams = states ** 6    // 64
  const dnaCodons = 4 ** 3         // 64
  const trigramPairs = trigrams ** 2 // 8² = 64
  const converge = hexagrams === 64 && dnaCodons === 64 && trigramPairs === 64

  // a hexagram IS a 6-bit number 0..63 — upper trigram (3 bits) · lower trigram (3 bits)
  const bits = (n: number, w: number) => n.toString(2).padStart(w, '0')
  const sample = 0b101010 // one of the 64

  let o = 'I Ching — exact binary combinatorics (a tradition use case):\n\n'
  o += '  yin/yang = 0/1 (one bit).\n'
  o += '  trigram = 3 bits → 2³ = ' + trigrams + ' (the bagua). e.g. ☰ = 111, ☷ = 000.\n'
  o += '  hexagram = 6 bits → 2⁶ = ' + hexagrams + '. a hexagram is literally a 6-bit number 0..63:\n'
  o += '    ' + bits(sample, 6) + ' = ' + sample + '  (upper ' + bits(sample >> 3, 3) + ' · lower ' + bits(sample & 7, 3) + ')\n\n'
  o += '  the convergence at 64 (real, across tradition · computing · biology):\n'
  o += '    I Ching hexagrams = 2⁶ = ' + hexagrams + '\n'
  o += '    trigram pairs     = 8² = ' + trigramPairs + '\n'
  o += '    DNA codons        = 4³ = ' + dnaCodons + '   (dna.ts)\n'
  o += '    all equal 64? ' + converge + '   → Leibniz mapped I Ching → base-2 in 1703.\n\n'
  o += '  reusable in any combination: n binary choices → 2^n. the deposit\'s 9 scripts compose as\n'
  o += '  3 trinities — gates (gaps·seal·wholeness) · release (release·orchestrate·versions) · verify\n'
  o += '  (lean-claims·deploy·ledger) — combinable in any subset (npm run harmony, release, …).\n\n'
  o += 'HONEST: the combinatorics (2³=8, 2⁶=64) and the Leibniz base-2 mapping are exact/historical.\n'
  o += 'The shared 64 (hexagrams · codons · 6-bit) is a real convergence of COMBINATORICS — not a\n'
  o += 'mystical unity and not derived from ℤ/9. Specific hexagram meanings are tradition/interpretation,\n'
  o += 'kept distinct from the counting. entails → 0/7.'
  return o
}
