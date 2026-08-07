// The centre 5 and the two operations of ℤ/9 — synthesis of this walk.
// REFLECTION: d + (10−d) = 10 = 5+5 — symmetry about the fixed centre 5 (every digit is 5±k).
// DOUBLING: ×2 mod 9 — the circuit 1→2→4→8→7→5, each digit the previous doubled (nested self-add).
// Two axes, two anchors: 5 (centre, fixed point) and 0 (void, no inverse). All exact, mod 9.
export function report(): string {
  const m9 = (n: number) => ((n % 9) + 9) % 9

  // Reflection axis — symmetry about 5, over the DIGITS 1..9 (k=0..4). 0 is the exception (below).
  const pairs: string[] = []
  for (let k = 0; k <= 4; k++) pairs.push('(' + (5 - k) + ',' + (5 + k) + ')')
  const cleanPairsTen = [1, 2, 3, 4].every((k) => (5 - k) + (5 + k) === 10) && 5 + 5 === 10
  const zeroExits = 10 - 0 === 10 // 0's ten's-complement is 10 — NOT a ℤ/9 digit (the void seam)

  // Doubling axis — the circuit; each = predecessor + predecessor (mod 9).
  const circ: number[] = []; let x = 1
  for (let i = 0; i < 6; i++) { circ.push(x); x = m9(x * 2) }
  const nested = circ.map((d, i) => { const p = circ[(i + 5) % 6]; return p + '+' + p + '≡' + m9(p + p) })

  let o = 'the centre 5 — the two operations of ℤ/9:\n\n'
  o += '  REFLECTION (symmetry about 5):  digits 1..9 are 5±k (k=0..4); each pair sums to 10 = 5+5:\n'
  o += '    ' + pairs.join(' ') + '   all sum to 10? ' + cleanPairsTen + '\n'
  o += '    fixed centre: 5 (5+5). EXCEPTION: 0 — its ten\'s-complement is 10, which EXITS the digit\n'
  o += '    range (10 ≡ 1 mod 9; the void seam), and 0 has no inverse: ' + zeroExits + '. 5 centres the nine; 0 is outside.\n\n'
  o += '  DOUBLING (×2 mod 9, the circuit):  ' + circ.join('→') + '→(' + circ[0] + ')\n'
  o += '    each = predecessor doubled:  ' + nested.join('  ') + '\n'
  o += '    (5+5≡1, 7+7≡5, (7+7)+(7+7)≡5+5≡1 — the vortex wraps)\n\n'
  o += '  the two anchors:\n'
  o += '    5 — the CENTRE: fixed under reflection (10−5=5), sits on the doubling circuit.\n'
  o += '    0 — the VOID: additive identity, multiplicative absorber, no inverse; the seam & origin.\n\n'
  o += 'HONEST: reflection sums are ordinary integers (proven: Vortex.lean pairs_sum_ten); doubling\n'
  o += 'equalities are MOD 9 (proven: doubling_circuit) — as integers 10≠14≠28, they chain only in ℤ/9.\n'
  o += 'Two exact operations on nine digits; the structure closes. It reflects and doubles; it does not\n'
  o += 'solve. entails → 0/7.'
  return o
}
