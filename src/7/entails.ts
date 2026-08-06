// Mechanical entailment test of the seven Clay theorem statements (fused).
type World = Record<string, unknown>
const isInvolution1minus = (): boolean => {
  const s = (p: [number, number]): [number, number] => [1 - p[0], -p[1]]
  for (const p of [[2, 3], [0.5, 14.1], [-1, 0.5], [0, 0]] as [number, number][]) {
    const q = s(s(p)); if (Math.abs(q[0] - p[0]) > 1e-12 || Math.abs(q[1] - p[1]) > 1e-12) return false
  }
  return true
}
const alphaSqOne = () => 1 ** 2 === 1
const zeroDev = () => 1 === 1
const theorems: { name: string; falseWorld: World; stmt: () => boolean }[] = [
  { name: 'riemann_hypothesis', falseWorld: { offLineZero: true }, stmt: () => isInvolution1minus() && alphaSqOne() && zeroDev() },
  { name: 'p_vs_np', falseWorld: { pEqNp: true }, stmt: () => true && alphaSqOne() && zeroDev() },
  { name: 'navier_stokes_smooth', falseWorld: { blowup: true }, stmt: () => true && alphaSqOne() && zeroDev() },
  { name: 'yang_mills_mass_gap', falseWorld: { gap0: true }, stmt: () => true && alphaSqOne() && zeroDev() },
  { name: 'hodge_conjecture', falseWorld: { nonAlg: true }, stmt: () => true && alphaSqOne() && zeroDev() },
  { name: 'birch_swinnerton_dyer', falseWorld: { rankNe: true }, stmt: () => true && alphaSqOne() && zeroDev() },
  { name: 'poincare_conjecture', falseWorld: { fakeS3: true }, stmt: () => true && alphaSqOne() && zeroDev() },
]
export function report(): string {
  let solved = 0, o = ''
  for (const t of theorems) { const trueWhenFalse = t.stmt(); const s = !trueWhenFalse; if (s) solved++; o += t.name.padEnd(24) + (s ? 'SOLVES' : 'no (tautology ⊭ conjecture)') + '\n' }
  return o + '\nClay problems solved: ' + solved + ' / 7'
}
