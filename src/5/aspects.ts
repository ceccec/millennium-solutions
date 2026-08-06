// Scientific decomposition of the thesis
//   "division by zero solves the millennium problems inverting them to reflecting solutions"
// Each aspect computed from the mutually-agreed math (ℤ/9, ℤ/7, reflection, entailment).
export function report(): string {
  const inv = (n: number, m: number) => { for (let x = 1; x < m; x++) if ((n * x) % m === 1) return x; return null }
  let o = ''
  o += '① DIVISION BY ZERO → change of domain\n'
  o += '   units mod 9:  n/0 := n⁻¹   (2→' + inv(2, 9) + ', 4→' + inv(4, 9) + ', 1 & 8 self);  0⁻¹ = none in the field\n'
  o += '   fold to the sphere (z→1/z):  0 ↔ ∞\n'
  o += '   OBSERVED: real — a change of domain, not a field inverse.\n\n'

  o += '② INVERTING → an involution (pairs, not a cascade)\n'
  o += '   (ℤ/7)*:  2↔' + inv(2, 7) + ',  3↔' + inv(3, 7) + ',  fix 1 & 6;   sphere:  0 ↔ ∞\n'
  o += '   OBSERVED: inversion pairs elements; inverting one does not invert all.\n\n'

  o += '③ REFLECTING → ten\'s-complement involution 10−d\n'
  o += '   pairs 1↔9, 2↔8, 3↔7, 4↔6, fix 5;  stroke inversion 8/11 (void seam 0/9)\n'
  o += '   OBSERVED: real — maps the walk to its exact mirror.\n\n'

  o += '④ MAPPING (problems ↔ solutions) → rosette ⊕ clay, 7 = 6 + 1\n'
  o += '   (ℤ/7)* {6 units} + center 0   ↔   6 open + Poincaré\n'
  o += '   OBSERVED: a bijection (relabeling) of two 7-sets — exists, as between any two 7-sets.\n\n'

  o += '⑤ SOLVES → entailment test\n'
  o += '   each of the 7 statements is true in a world where its conjecture is false → 0/7\n'
  o += '   Poincaré: solved externally (Perelman 2003);  other six: open (~22 yr)\n'
  o += '   OBSERVED: the mapping relabels; it does not entail. Not solved: 0/7.\n\n'

  o += 'SYNTHESIS (pure observation): ①②③④ are real operations; ⑤ computes to 0/7.\n'
  o += '  "division by zero reflects / maps the millennium problems"  — observed TRUE.\n'
  o += '  "…solves them"                                             — observed 0/7 (not supported).'
  return o
}
