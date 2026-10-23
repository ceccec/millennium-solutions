// THE C1 DECISION — TRUE only for a theorem the kernel checks with no sorry and no axiom at all.
// Pure: it reads the report that lean-ask produced and decides. It runs nothing and reads no file.
export type LeanAskReport = { status: string; compiles: boolean; sorry: boolean; axioms: string[] }
export type C1Decision = { value: 'TRUE' | 'UNKNOWN'; reason: string }

export const decideC1 = (r: LeanAskReport, theorem: string): C1Decision => {
  if (r.status !== 'ANSWERED') return { value: 'UNKNOWN', reason: 'the Lean checker is absent here, so nothing was checked' }
  if (!r.compiles) return { value: 'UNKNOWN', reason: 'the statement does not compile' }
  if (r.sorry) return { value: 'UNKNOWN', reason: 'the proof uses sorry' }
  const line = r.axioms.find((a) => a.startsWith(`'${theorem}' `))
  if (!line) return { value: 'UNKNOWN', reason: `no axiom report for ${theorem}` }
  if (!line.includes('does not depend on any axioms')) return { value: 'UNKNOWN', reason: `depends on an axiom: ${line}` }
  return { value: 'TRUE', reason: `${theorem} compiles and depends on no axiom` }
}
