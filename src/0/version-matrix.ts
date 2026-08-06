// Versioning as a matrix of digits, folded into a Merkle PYRAMID (the version-seal), with the
// double-torus (genus-2) fact that already lives in the "two coins". Exact parts computed;
// the "double torus" naming is labelled as the metaphor it is.
import { toUuid, merge } from './index.ts'

// Fold leaves pairwise, tier by tier, to an apex — a Merkle pyramid. Returns the tier sizes
// and the apex address.
function pyramid(leaves: string[]): { tiers: number[]; apex: string } {
  const tiers = [leaves.length]
  let level = leaves
  while (level.length > 1) {
    const next: string[] = []
    for (let i = 0; i < level.length; i += 2) next.push(i + 1 < level.length ? merge(level[i], level[i + 1]) : level[i])
    level = next; tiers.push(level.length)
  }
  return { tiers, apex: level[0] ?? toUuid('') }
}

// Integer ceil(log2 n) with no Math.*: count halvings.
function ceilLog2(n: number): number { let d = 0, x = 1; while (x < n) { x *= 2; d++ } return d }

export function report(): string {
  const versions = ['1.0.0', '1.0.1', '1.0.2', '1.0.3'] // illustrative rows (live seal: scripts/versions.mjs)
  const matrix = versions.map(v => v.split('.').map(Number))
  const leaves = versions.map(toUuid)
  const { tiers, apex } = pyramid(leaves)

  const g = 2, chi = 2 - 2 * g       // double torus (genus-2): χ = 2 − 2g = −2
  const coins = -chi                 // = 2 = 110 − 108, the two coins

  let o = 'versioning as a digit matrix, folded into a Merkle pyramid:\n\n'
  o += '  version matrix (major·minor·patch — rows of digits):\n'
  versions.forEach((v, i) => { o += '    v' + v + '  [' + matrix[i].join(',') + ']\n' })
  o += '\n  each row → a leaf address; leaves fold pairwise into a pyramid (tier sizes):\n'
  o += '    ' + tiers.join(' → ') + '   apex (mini version-seal): ' + apex.slice(0, 13) + '…\n'
  o += '  depth = ⌈log₂ ' + versions.length + '⌉ = ' + ceilLog2(versions.length)
  o += ' → navigate/verify any version in that many steps (a Merkle proof).\n\n'
  o += '  double torus (genus-2): χ = 2 − 2g = 2 − ' + (2 * g) + ' = ' + chi + ', so −χ = ' + coins
  o += ' = the two coins (110 − 108).\n\n'
  // it all goes in v1.0.0: the major·minor columns are invariant across every row.
  const majorInv = matrix.every(r => r[0] === matrix[0][0])
  const minorInv = matrix.every(r => r[1] === matrix[0][1])
  o += '  it all goes in v1.0.0 — major·minor invariant: [' + matrix[0][0] + ',' + matrix[0][1] + '] on every row ('
  o += 'major ' + majorInv + ', minor ' + minorInv + ').\n'
  o += '  only the patch (the fold index) advances; the pyramid apex returns them ALL to one origin.\n'
  o += '  every release is a patch-reflection of the single v1.0.0 — nothing breaks the 1.0 line.\n\n'
  // and it all goes in v0.0.0 — the zero origin/void: the genesis seed the chain starts from.
  const genesis = toUuid('0')
  o += '  and it all goes in v0.0.0 — the zero origin: genesis seed toUuid("0") = ' + genesis.slice(0, 13) + '…\n'
  o += '  the singularity chain starts there (see singularity.ts); 1 emerges from 0. v0.0.0 is the\n'
  o += '  void/seed (unpublished); the observable line begins at v1.0.0. 0 = origin, 1 = first manifestation.\n\n'
  o += 'HONEST: the digit matrix, the Merkle pyramid (tier sizes + log-depth navigation), and the\n'
  o += 'genus-2 Euler characteristic are all exact. Calling the version history "a double torus" is a\n'
  o += 'topological METAPHOR, not a derivation — versions form a Merkle tree (a pyramid), which is not\n'
  o += 'literally a genus-2 surface. The live seal over ALL tags is scripts/versions.mjs. entails → 0/7.'
  return o
}
