// The honest floor — the boundary statements, canonical IN src/ (so they literally recompute from
// source, not from a build script). Each is content-addressed by toUuid(statement); boundaries.ts
// renders them to the site and claims-gate.ts binds their count. Only gate-passing statements ship.
// A content-address proves INTEGRITY, not truth.
import { toUuid } from '../0/index.ts'

export const BOUNDARY_STATEMENTS: readonly string[] = [
  '0/7 entailed: this deposit leaves all seven Millennium problems unsolved, and claims no prize.',
  'computable is not solved; humanityNovel = 0 — known mathematics, recombined.',
  'a content-address (uuid) proves integrity, not truth, and not authorship.',
  'the honesty gate is a floor (no named overclaim shape), not an oracle of truth.',
  'recognition, adoption, citations, and effort are not correctness.',
  'a classical Z/9 calculator: no quantum computation, no faster-than-light, no quantum speedup.',
  'sealing proves the bytes are intact; it does not prove the claim is right.',
  'unsigned: content-addressing is integrity, not authenticity — real signatures need a key.',
  'worthwhile is a judgment (perspective); small, real, and honest are measured.',
  'green cannot be faked: the gate measures actual state, and it caught its own author.',
]

/** Each statement paired with its content-address (short uuid), recomputed from src. */
export function addressed(): { uuid: string; statement: string }[] {
  return BOUNDARY_STATEMENTS.map((s) => ({ uuid: toUuid(s).slice(0, 13), statement: s }))
}

export function report(): string {
  let o = 'the honest floor — ' + BOUNDARY_STATEMENTS.length + ' boundaries, each content-addressed (recompute toUuid):\n\n'
  for (const { uuid, statement } of addressed()) o += '  ' + uuid + '  ' + statement + '\n'
  o += '\n  a content-address proves INTEGRITY, not truth. the floor is 0/7.'
  return o
}
