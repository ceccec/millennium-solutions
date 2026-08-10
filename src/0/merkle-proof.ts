// The holographic merkle proof — verify the whole from a tiny part in O(log N) — lives canonically in
// @uuidna/uuidna. One implementation shared by both apps, byte-identical roots and proofs, no re-declared copy.
export { merkleRoot, merkleProof, verifyProof } from '@uuidna/uuidna'
