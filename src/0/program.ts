// PROGRAM — the uuid as a container with three fields: a checksum, a program, and a message.
//
// The author, 2026-09-18: "the rest of the uuid is programmable payload. the middle part of uuid is the
// program and the end is the message", then, of the first group: "checksum over the program and the message".
//
// WHAT THIS IS NOT, FIRST. It is NOT toUuid. `toUuid(message)` is a one-way FNV fold over the whole 128 bits
// and nothing can be read back out of it — that is what makes it an ADDRESS, and scripts/receipt-audit.ts
// asserts `uuid === toUuid(message)` for every receipt in the ledger. This is a CONTAINER: fields go in and
// come back out. The two cannot share the same 128 bits, so they do not: this sits beside imprint.ts, which
// is the deposit's other container (a 7-bit length header and 115 bits of message), with a different layout.
// Nothing here changes an address, and no sealed receipt moves.
//
// AND IT IS NOT AUTHENTICATION. A checksum is computed by anyone, so anyone who edits the payload can
// recompute it. It catches ACCIDENT — a flipped bit, a truncated copy, a mis-transcribed group — and catches
// nothing an author does deliberately. Authentication needs a key, and a key does not fit here: the whole
// uuid is 128 bits and an Ed25519 signature alone is 512. That is carried beside the uuid, never inside it.
//
// THE LAYOUT, on the canonical 8-4-4-4-12 rendering (bit 0 = MSB of byte 0):
//
//   bits   0..31    CHECK     32 bits   bytes  0-3   the first group
//   bits  32..79    PROGRAM   42 bits   bytes  4-9   the three middle groups, less the six reserved
//   bits  80..127   MESSAGE   48 bits   bytes 10-15  the last group
//
// The six reserved bits are the version nibble (bits 48..51, fixed to 1000 = v8) and the variant (bits 64,65,
// fixed to 10). BOTH FALL IN THE MIDDLE, which is why the program field is 42 bits and not 48 — the middle is
// three groups of the rendering and the two structural fields begin two of them. A layout that assumed 48
// would produce uuids that are not uuids.

import { publicKey, sign, verify } from './ed25519.ts'

// ── THE LAYOUT IS DERIVED FROM THE RENDERING, NOT TYPED ──────────────────────────────────────────────────
// `[48, 49, 50, 51, 64, 65]` is the right answer and it is the wrong way to write it: those six positions
// are not a fact about this codec, they are a consequence of where RFC 9562 puts the version and the
// variant — the high nibble of byte 6, and the top two bits of byte 8. Typed as six numerals, nothing
// connects them to that, and nothing would notice if one were mistyped: every partition theorem in
// program.lean would still hold over the wrong six, and the codec would emit identifiers that are not
// uuids. The same for the field widths, which are the 8-4-4-4-12 group boundaries and nothing else.
const GROUPS = [4, 2, 2, 2, 6] as const                     // bytes per group of the 8-4-4-4-12 rendering
const byteAt = (g: number): number => GROUPS.slice(0, g).reduce((a, b) => a + b, 0)
const VERSION_NIBBLE_BYTE = byteAt(2)                       // byte 6 — opens the third group
const VARIANT_BYTE = byteAt(3)                              // byte 8 — opens the fourth
const RESERVED = new Set([
  ...Array.from({ length: 4 }, (_, i) => VERSION_NIBBLE_BYTE * 8 + i),   // the version nibble
  ...Array.from({ length: 2 }, (_, i) => VARIANT_BYTE * 8 + i),          // the variant
])
export const CHECK_BITS = byteAt(1) * 8                                  // the first group
const MIDDLE = Array.from({ length: (byteAt(4) - byteAt(1)) * 8 }, (_, i) => byteAt(1) * 8 + i)
export const PROGRAM_BITS = MIDDLE.filter((i) => !RESERVED.has(i)).length
export const MESSAGE_BITS = GROUPS[4] * 8                                // the last group
/** Where each field's bits live, in order. Derived from the reserved set, never written out. */
export const FIELDS = {
  check: Array.from({ length: CHECK_BITS }, (_, i) => i),
  program: MIDDLE.filter((i) => !RESERVED.has(i)),
  message: Array.from({ length: MESSAGE_BITS }, (_, i) => byteAt(4) * 8 + i),
}

const isBits = (s: string): boolean => /^[01]*$/.test(s)

/** The payload the checksum covers: the program followed by the message, zero-padded to whole bytes. */
export const payloadBytes = (program: string, message: string): number[] => {
  const bits = (program + message).padEnd(Math.ceil((PROGRAM_BITS + MESSAGE_BITS) / 8) * 8, '0')
  const out: number[] = []
  for (let i = 0; i < bits.length; i += 8) out.push(parseInt(bits.slice(i, i + 8), 2))
  return out
}

/** The deposit's FNV-1a, over bytes. The same function the kernel decides in fnv.lean — its byte list and
 *  this string of character codes are the same input, which fnv.lean's published vectors pin. */
export const checksum = (program: string, message: string): string => {
  const MASK = (1n << 32n) - 1n
  const mul32 = (a: number, b: number) => Number((BigInt(a >>> 0) * BigInt(b >>> 0)) & MASK)
  let h = (0x811c9dc5 ^ 0) >>> 0
  for (const c of payloadBytes(program, message)) {
    h ^= c
    h = mul32(h, 0x01000193) >>> 0
    h ^= h >>> 13
  }
  h = mul32(h ^ (h >>> 16), 0x85ebca6b) >>> 0
  h = mul32(h ^ (h >>> 13), 0xc2b2ae35) >>> 0
  return ((h ^ (h >>> 16)) >>> 0).toString(2).padStart(CHECK_BITS, '0')
}

const bitsToUuid = (bits: readonly number[]): string => {
  let hex = ''
  for (let byte = 0; byte < 16; byte++) {
    let v = 0
    for (let b = 0; b < 8; b++) v = (v << 1) | bits[byte * 8 + b]
    hex += v.toString(16).padStart(2, '0')
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

const uuidToBits = (uuid: string): number[] => {
  const hex = uuid.replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error('program: not a 32-hex uuid')
  const bits: number[] = []
  for (const ch of hex) { const n = parseInt(ch, 16); for (let b = 3; b >= 0; b--) bits.push((n >> b) & 1) }
  return bits
}

/** Write a program and a message into a uuid, with the checksum over both in the first group. */
export function encode(program: string, message: string): string {
  if (!isBits(program) || !isBits(message)) throw new Error('program: fields must be binary strings of 0/1')
  if (program.length !== PROGRAM_BITS) throw new Error(`program: the program field is exactly ${PROGRAM_BITS} bits, got ${program.length}`)
  if (message.length !== MESSAGE_BITS) throw new Error(`program: the message field is exactly ${MESSAGE_BITS} bits, got ${message.length}`)
  const bits = new Array<number>(128).fill(0)
  const put = (where: number[], s: string) => where.forEach((pos, i) => { bits[pos] = s.charCodeAt(i) - 48 })
  put(FIELDS.check, checksum(program, message))
  put(FIELDS.program, program)
  put(FIELDS.message, message)
  bits[48] = 1; bits[49] = 0; bits[50] = 0; bits[51] = 0   // version 8
  bits[64] = 1; bits[65] = 0                               // variant 10
  return bitsToUuid(bits)
}

/** Read the three fields back, and say whether the checksum still covers what is there. */
export function decode(uuid: string): { check: string; program: string; message: string; intact: boolean } {
  const bits = uuidToBits(uuid)
  const get = (where: number[]) => where.map((pos) => bits[pos]).join('')
  const check = get(FIELDS.check), program = get(FIELDS.program), message = get(FIELDS.message)
  return { check, program, message, intact: check === checksum(program, message) }
}

export const uuidBytes = (uuid: string): number[] => {
  const hex = uuid.replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error('program: not a 32-hex uuid')
  return (hex.match(/../g) ?? []).map((h) => parseInt(h, 16))
}

export type Signed = { uuid: string; publicKey: number[]; signature: number[] }

/** Sign a container: the 16 bytes of the uuid itself, which cover all three fields at once. */
export const signContainer = (seed: readonly number[], uuid: string): Signed =>
  ({ uuid, publicKey: publicKey(seed), signature: sign(seed, uuidBytes(uuid)) })

/** Two independent questions, answered separately and never blended: is it undamaged, and who wrote it. */
export const verifyContainer = (s: Signed): { intact: boolean; signed: boolean } => ({
  intact: decode(s.uuid).intact,
  signed: verify(s.publicKey, uuidBytes(s.uuid), s.signature),
})
