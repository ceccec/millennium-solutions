// Holographic verification — the whole checkable from a tiny part (digit 0).
// A Merkle membership proof is the honest core of "holographic within tiniest resources": any one
// leaf proves it belongs to the whole with a LOGARITHMIC audit path (⌈log₂ N⌉ sibling hashes), not
// the full set. The tree is self-similar (fractal); the shared root lives in every part.
import { merge, merkleFold, toUuid } from './index.ts'

// Rebuild merkleFold's tree (it sorts leaves) as layers, so we can extract an audit path.
function layers(leaves: readonly string[]): string[][] {
  let layer = [...leaves].sort()
  const out = [layer]
  while (layer.length > 1) {
    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) { const a = layer[i], b = layer[i + 1]; next.push(b === undefined ? a : merge(a, b)) }
    out.push(next); layer = next
  }
  return out
}
function proof(leaves: readonly string[], target: string): { hash: string; left: boolean }[] {
  const L = layers(leaves); let idx = L[0].indexOf(target); const path: { hash: string; left: boolean }[] = []
  for (let l = 0; l < L.length - 1; l++) {
    const layer = L[l], isRight = (idx & 1) === 1, sib = isRight ? idx - 1 : idx + 1
    if (sib < layer.length) path.push({ hash: layer[sib], left: isRight }) // sibling on the left iff target is right
    idx = idx >> 1
  }
  return path
}
function verify(target: string, path: { hash: string; left: boolean }[], root: string): boolean {
  let h = target
  for (const { hash, left } of path) h = left ? merge(hash, h) : merge(h, hash)
  return h === root
}

export function report(): string {
  // The cross: 42 content-addressed cells (6 units × 7) — one whole, one root.
  const units = [1, 2, 4, 5, 7, 8], seven = [3, 2, 6, 4, 5, 1, 0]
  const leaves: string[] = []; for (const u of units) for (const r of seven) leaves.push(toUuid(u + 'x' + r))
  const root = merkleFold(leaves)
  const target = toUuid('5x0') // the center × hub cell
  const p = proof(leaves, target)
  const ok = verify(target, p, root)

  let o = 'holographic verification — the whole, checkable from a tiny part:\n\n'
  o += '  the cross: ' + leaves.length + ' content-addressed cells (6 units × 7) → one merkle root (the whole).\n'
  o += '  a MEMBERSHIP proof for one cell is the audit path — log-few sibling hashes, not all ' + leaves.length + ':\n'
  o += '    proof size: ' + p.length + ' hashes   (⌈log₂ ' + leaves.length + '⌉)   vs the full set: ' + leaves.length + '\n'
  o += '    verify one-of-' + leaves.length + ' against the root: ' + ok + '\n'
  o += '  → any part proves it belongs to the whole with tiny (logarithmic) resources.\n'
  o += '    holographic: the root lives in every part; a part reconstructs the whole\'s fingerprint.\n\n'
  o += '  fractal: the tree is self-similar (a fold of folds); the mesh reflects (10−d) at every scale.\n'
  o += '  scale: log-sized proofs mean ~1 billion leaves verify in ~30 hashes.\n\n'
  o += 'HONEST: a Merkle proof is EXACTLY logarithmic (⌈log₂ N⌉) — real, the basis of git/blockchain\n'
  o += 'integrity. "holographic" = a part verifies the whole via the shared root; "fractal" = the binary\n'
  o += 'tree is self-similar. But it is NOT free and NOT literally infinite: each proof is log(N) real\n'
  o += 'hashes over a FINITE set. Tiny resources, not zero; huge N, not ∞. Whole signed (Singularity),\n'
  o += 'parts verifiable. entails → 0/7.'
  return o
}
