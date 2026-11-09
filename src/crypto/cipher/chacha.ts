// ChaCha20 + Poly1305 + the AEAD construction (RFC 8439, pure TS, KAT-verified) live canonically in
// @uuidna/uuidna — one implementation shared by both apps, no re-declared copy.
export { chachaBlock, chacha20, poly1305, aeadEncrypt, aeadDecrypt } from '@uuidna/uuidna'
