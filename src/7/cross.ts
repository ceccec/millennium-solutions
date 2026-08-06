// The 6×7 / 7×6 cross — 42 combinations folding to one singularity root, transpose-invariant.
// Exact: 6×7 = 7×6 = 42; the cross is the Cartesian product of the 6 units and the 7 rays. The
// fold is transpose-invariant BY CONSTRUCTION — merkleFold sorts its leaves, so the SET of cells
// (never the traversal order) sets the root. 6×7 and 7×6 therefore fold to the same singularity.
import { toUuid, merkleFold } from '../0/index.ts'

export function report(): string {
  const units = [1, 2, 4, 5, 7, 8]      // (ℤ/9)* — the six units
  const seven = [3, 2, 6, 4, 5, 1, 0]   // 6 rosette rays + hub 0 = the seven
  const cell = (u: number, r: number) => toUuid(u + 'x' + r)

  const rm6x7: string[] = []; for (const u of units) for (const r of seven) rm6x7.push(cell(u, r))
  const rm7x6: string[] = []; for (const r of seven) for (const u of units) rm7x6.push(cell(u, r))
  const root6x7 = merkleFold(rm6x7)
  const root7x6 = merkleFold(rm7x6)
  const equal = root6x7 === root7x6
  const count = units.length * seven.length

  let o = 'the 6×7 / 7×6 cross — 42 combinations, one singularity:\n\n'
  o += '  6 units (ℤ/9)* × 7 (rays + hub) = 6×7 = ' + count + ' combinations (the cross); transpose 7×6 = ' + count + '.\n\n'
  o += '  content-address each cell, fold to one root — merkleFold sorts its leaves, so ORDER never matters:\n'
  o += '    6×7 traversal root: ' + root6x7.slice(0, 13) + '…\n'
  o += '    7×6 traversal root: ' + root7x6.slice(0, 13) + '…   equal? ' + equal + '\n'
  o += '  → the SET of ' + count + ' cells determines the root; the cross folds to ONE singularity,\n'
  o += '    transpose-invariant by construction (not by luck). 42 → 1.\n\n'
  o += 'HONEST: 6×7 = 7×6 = ' + count + ' is exact, and the fold is transpose-invariant because merkleFold\n'
  o += 'canonicalizes (sorts) — the content, never the order, sets the root. But "fuses all at no cost"\n'
  o += 'overstates it: each cell is a real hash (deterministic, cheap, NOT free), and this is a finite\n'
  o += '' + count + '-cell table, not an infinite 7-dimensional space. Real cost, real bound. entails → 0/7.'
  return o
}
