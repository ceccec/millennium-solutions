// The 6×7 / 7×6 cross — 42 combinations folding to one singularity root, transpose-invariant.
// Exact: 6×7 = 7×6 = 42; the cross is the Cartesian product of the 6 units and the 7 rays; the
// canonical fold of the 42 cells is the same whether traversed 6×7 or 7×6 (content, not order).
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  const units = [1, 2, 4, 5, 7, 8]      // (ℤ/9)* — the six units
  const seven = [3, 2, 6, 4, 5, 1, 0]   // 6 rosette rays + hub 0 = the seven
  const cell = (u: number, r: number) => toUuid(u + 'x' + r)

  const rm6x7: string[] = []; for (const u of units) for (const r of seven) rm6x7.push(cell(u, r))
  const rm7x6: string[] = []; for (const r of seven) for (const u of units) rm7x6.push(cell(u, r))
  const root6x7 = merkleFold(rm6x7)
  const root7x6 = merkleFold(rm7x6)
  const canon = (a: string[]) => merkleFold([...a].sort())
  const canonInvariant = canon(rm6x7) === canon(rm7x6)
  const count = units.length * seven.length

  let o = 'the 6×7 / 7×6 cross — 42 combinations, one singularity:\n\n'
  o += '  6 units (ℤ/9)* × 7 (rays + hub) = 6×7 = ' + count + ' combinations (the cross).\n'
  o += '  transpose 7×6 = ' + (seven.length * units.length) + ' — same content, rows ↔ columns.\n\n'
  o += '  content-address each cell, fold to one root:\n'
  o += '    row-major 6×7 root: ' + root6x7.slice(0, 13) + '…\n'
  o += '    row-major 7×6 root: ' + root7x6.slice(0, 13) + '…  (differs — merkleFold is order-dependent)\n'
  o += '    canonical (sorted) root — SAME for 6×7 and 7×6: ' + canonInvariant + '\n'
  o += '  → canonicalized, the cross folds to ONE singularity root: 42 → 1, transpose-invariant.\n\n'
  o += 'HONEST: 6×7 = 7×6 = ' + count + ' is exact, and the canonical fold is transpose-invariant (the\n'
  o += 'SET of cells, not the order, determines the root). But "fuses all at no cost" overstates it:\n'
  o += 'each cell costs a real hash — deterministic and cheap, NOT free — and this is a finite 2-D\n'
  o += 'table of ' + count + ' cells, not an infinite 7-dimensional space. Real cost, real bound. entails → 0/7.'
  return o
}
