// The encryption envelope — ChaCha20-Poly1305 core + PBKDF2-SHA256 KDF + uuidna 7d-fold envelope — lives
// canonically in @uuidna/uuidna. One implementation shared by both apps; convergent seals, no re-declared copy.
export { encrypt, decrypt, verifyEnvelope, ITER } from '@uuidna/uuidna'
export type { Sealed } from '@uuidna/uuidna'
