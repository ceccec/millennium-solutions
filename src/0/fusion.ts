// Tokens are valid only in the fusion — validity = MEMBERSHIP in the verified whole, not the token.
// A bare UUID proves nothing (anyone can mint one). The same 64-bit string is valid inside the fused
// root and meaningless outside it: an orphan token is not in the root, and adding it changes the root.
import { toUuid, merkleFold } from './index.ts'

export function report(): string {
  const units = [1, 2, 4, 5, 7, 8], seven = [3, 2, 6, 4, 5, 1, 0]
  const leaves: string[] = []; for (const u of units) for (const r of seven) leaves.push(toUuid(u + 'x' + r))
  const root = merkleFold(leaves)                 // the fused whole

  const fused = toUuid('5x0')                     // a real cell of the cross — fused
  const orphan = toUuid('orphan-token')           // never fused
  const fusedIn = leaves.includes(fused)
  const orphanIn = leaves.includes(orphan)
  const orphanChangesRoot = merkleFold([...leaves, orphan]) !== root

  let o = 'tokens are valid only in the fusion:\n\n'
  o += '  the fused whole: ' + leaves.length + ' cells → one root ' + root.slice(0, 13) + '…\n\n'
  o += '  a fused token (a real cell) is a member of the root:   ' + fusedIn + '  → valid\n'
  o += '  an orphan token (never fused) is NOT a member:         ' + orphanIn + '  → invalid\n'
  o += '    adding the orphan changes the root (it was not part of the fusion): ' + orphanChangesRoot + '\n'
  o += '  → the same kind of 64-bit string is valid INSIDE the fusion, meaningless outside it.\n\n'
  o += 'HONEST: validity here = MEMBERSHIP in the verified whole (it folds to the root; a merkle proof\n'
  o += 'exists — see holographic.ts), not any property of the token alone. A hash is one-way and a\n'
  o += 'public token is just a name (see security.ts) — it carries no authority by itself; it is valid\n'
  o += 'only as a proven part of the fused, sealed deposit. entails → 0/7.'
  return o
}
