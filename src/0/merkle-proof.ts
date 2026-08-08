// Ordered merkle tree with INCLUSION PROOFS — the honest blockchain primitive: prove a leaf is in the
// root without revealing the other leaves (light-client verification). This is a content-addressed,
// tamper-evident ledger — NO currency, NO mining/proof-of-work, NO consensus, NO wallet. Integrity and
// provenance, never money; the deposit is a calculator, not a transactor. (merge(a,b) = toUuid(a:b).)
import { toUuid, merge } from './index.ts'

const leafHash = (l: string) => toUuid('leaf:' + l)

/** Root of the ordered merkle tree over leaves (odd node is promoted, not duplicated). */
export function merkleRoot(leaves: readonly string[]): string {
  if (leaves.length === 0) return toUuid('empty')
  let layer = leaves.map(leafHash)
  while (layer.length > 1) {
    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) next.push(i + 1 < layer.length ? merge(layer[i], layer[i + 1]) : layer[i])
    layer = next
  }
  return layer[0]
}

/** Inclusion proof for the leaf at `index`: the sibling at each level and which side it is on. */
export function merkleProof(leaves: readonly string[], index: number): { sibling: string; left: boolean }[] {
  const proof: { sibling: string; left: boolean }[] = []
  let layer = leaves.map(leafHash)
  let idx = index
  while (layer.length > 1) {
    const promoted = idx === layer.length - 1 && layer.length % 2 === 1
    if (!promoted) {
      const isRight = idx % 2 === 1
      proof.push({ sibling: layer[isRight ? idx - 1 : idx + 1], left: isRight })
    }
    const next: string[] = []
    for (let i = 0; i < layer.length; i += 2) next.push(i + 1 < layer.length ? merge(layer[i], layer[i + 1]) : layer[i])
    layer = next
    idx = Math.floor(idx / 2)
  }
  return proof
}

/** Verify a leaf is in `root` using only its proof path — no other leaf needed. */
export function verifyProof(leaf: string, proof: readonly { sibling: string; left: boolean }[], root: string): boolean {
  let h = leafHash(leaf)
  for (const step of proof) h = step.left ? merge(step.sibling, h) : merge(h, step.sibling)
  return h === root
}
