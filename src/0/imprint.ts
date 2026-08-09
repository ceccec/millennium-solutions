// Imprint — a REVERSIBLE binary↔uuid codec. Honest naming first: this is NOT reversing the one-way
// FNV content-address (toUuid), which cannot be undone (see scripts/verify.ts) — and it is NOT
// encryption (no key, no secrecy). It is a lossless ENCODING: we CONSTRUCT a uuid whose 128 bits
// directly carry a binary message, and read those bits back out exactly. Integrity/identity layer,
// never truth. A uuid holds 128 bits; 6 are reserved (4 version + 2 variant, matching toUuid's v8),
// 7 hold a length header → up to 115 message bits per uuid. Round-trips exactly for L ≤ CAPACITY.
import { toUuid } from './index.ts'

// Reserved bit positions (big-endian, bit 0 = MSB of byte 0):
//   version nibble = high nibble of byte 6 → bits 48..51, fixed to 1000 (0x8)
//   variant        = top 2 bits of byte 8 → bits 64,65, fixed to 10
const RESERVED = new Set([48, 49, 50, 51, 64, 65])
const LEN_BITS = 7 // 0..127 fits; the free region minus this header is the message capacity
const FREE = Array.from({ length: 128 }, (_, i) => i).filter((i) => !RESERVED.has(i))
export const CAPACITY = FREE.length - LEN_BITS // 122 - 7 = 115 message bits per uuid

const isBits = (s: string): boolean => /^[01]*$/.test(s)
const num2bits = (n: number, width: number): string => n.toString(2).padStart(width, '0').slice(-width)

/** Pack a 128-bit array into canonical uuid string. */
function bitsToUuid(bits: readonly number[]): string {
  let hex = ''
  for (let byte = 0; byte < 16; byte++) {
    let v = 0
    for (let b = 0; b < 8; b++) v = (v << 1) | bits[byte * 8 + b]
    hex += v.toString(16).padStart(2, '0')
  }
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** Unpack a canonical uuid string into a 128-bit array. */
function uuidToBits(uuid: string): number[] {
  const hex = uuid.replace(/-/g, '')
  if (!/^[0-9a-f]{32}$/i.test(hex)) throw new Error('imprint: not a 32-hex uuid')
  const bits: number[] = []
  for (const ch of hex) {
    const nib = parseInt(ch, 16)
    for (let b = 3; b >= 0; b--) bits.push((nib >> b) & 1)
  }
  return bits
}

/**
 * imprint(message) → a valid uuid carrying the message in its free bits.
 * message: a binary string ('0'/'1'), length ≤ CAPACITY. The uuid reads back exactly via readImprint.
 */
export function imprint(message: string): string {
  if (!isBits(message)) throw new Error('imprint: message must be a binary string of 0/1')
  if (message.length > CAPACITY) throw new Error(`imprint: message ${message.length} bits > capacity ${CAPACITY}`)
  const bits = new Array(128).fill(0)
  // reserved: version 8 (1000), variant (10) — matches toUuid's markers so imprints look native.
  bits[48] = 1; bits[49] = 0; bits[50] = 0; bits[51] = 0
  bits[64] = 1; bits[65] = 0
  // free region: [ length header (7 bits) | message bits | zero-fill ]
  const payload = num2bits(message.length, LEN_BITS) + message
  for (let i = 0; i < payload.length; i++) bits[FREE[i]] = payload.charCodeAt(i) - 48
  return bitsToUuid(bits)
}

/** readImprint(uuid) → the exact binary message imprinted by imprint(). Inverse of imprint. */
export function readImprint(uuid: string): string {
  const bits = uuidToBits(uuid)
  const free = FREE.map((i) => bits[i])
  let len = 0
  for (let i = 0; i < LEN_BITS; i++) len = (len << 1) | free[i]
  if (len > CAPACITY) throw new Error('imprint: length header out of range — uuid was not imprinted by imprint()')
  return free.slice(LEN_BITS, LEN_BITS + len).join('')
}

/** Convenience: imprint UTF-8 text (≤ 14 ASCII chars fit) and read it back exactly. */
export function imprintText(text: string): string {
  const bytes = [...new TextEncoder().encode(text)]
  const bits = bytes.map((b) => num2bits(b, 8)).join('')
  return imprint(bits)
}
export function readImprintText(uuid: string): string {
  const bits = readImprint(uuid)
  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2))
  return new TextDecoder().decode(new Uint8Array(bytes))
}

/** roundTrips(message) → true iff readImprint(imprint(message)) === message. The honest, gated fact. */
export function roundTrips(message: string): boolean {
  try { return readImprint(imprint(message)) === message } catch { return false }
}

/**
 * imprintChain(bits) → a CHAIN of uuids carrying a message of ANY length: split into CAPACITY-bit chunks,
 * imprint each. One uuid holds ≤115 bits (bounded, pigeonhole); a chain of N holds ≤ N·115 — the collective
 * scaling, developed. Public, reversible ENCODING (not encryption, no secrecy). readImprintChain reverses it.
 */
export function imprintChain(bits: string): string[] {
  if (!/^[01]*$/.test(bits)) throw new Error('imprintChain: message must be a binary string')
  if (bits.length === 0) return [imprint('')]
  const out: string[] = []
  for (let i = 0; i < bits.length; i += CAPACITY) out.push(imprint(bits.slice(i, i + CAPACITY)))
  return out
}

/** readImprintChain(uuids) → recover the full message: read each carrier and concatenate, exactly. */
export function readImprintChain(uuids: readonly string[]): string {
  return uuids.map((u) => readImprint(u)).join('')
}

/** imprintTextChain(text) → a uuid chain carrying arbitrary UTF-8 text of any length (built on imprintChain). */
export function imprintTextChain(text: string): string[] {
  const bytes = [...new TextEncoder().encode(text)]
  return imprintChain(bytes.map((b) => num2bits(b, 8)).join(''))
}

/** readImprintTextChain(uuids) → recover the full text from its uuid chain, exactly. */
export function readImprintTextChain(uuids: readonly string[]): string {
  const bits = readImprintChain(uuids)
  const bytes: number[] = []
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.slice(i, i + 8), 2))
  return new TextDecoder().decode(new Uint8Array(bytes))
}

/**
 * skill(message) → how skilful the clown is at juggling this message through a uuid: imprint throws the
 * bits, readImprint catches them; fidelity = fraction caught. A skilful clown catches every bit (1.0);
 * a dropped bit lowers the score. Over-capacity is a fumble (fidelity 0) — respect the floor. Computed.
 */
export function skill(message: string): { imprinted: number; recovered: number; fidelity: number; skilful: boolean } {
  let recovered = 0
  try {
    const back = readImprint(imprint(message))
    for (let i = 0; i < message.length; i++) if (back[i] === message[i]) recovered++
    if (back.length !== message.length) recovered = message.length ? 0 : 0
  } catch { recovered = 0 }
  const fidelity = message.length === 0 ? 1 : recovered / message.length
  return { imprinted: message.length, recovered, fidelity, skilful: fidelity === 1 }
}

/**
 * coin64(text) → the shared currency: a 64-bit coin (16 hex digits) minted from any content — the top
 * 64 bits of its 128-bit content-address. Adopted by all with no exception: every module, every string,
 * mints the SAME coin every time (deterministic). This is the common denominator the harmony gate folds.
 * Integrity, not value: a coin proves the bytes, not their worth.
 */
export function coin64(text: string): string {
  return toUuid(text).replace(/-/g, '').slice(0, 16)
}

export function report(): string {
  const demo = '01001000' + '01101001' // "Hi" in ASCII bits
  const u = imprint(demo)
  const back = readImprint(u)
  const txt = imprintText('Hi'), txtBack = readImprintText(txt)
  let o = 'imprint — reversible binary↔uuid codec (NOT hash-reversal, NOT encryption):\n\n'
  o += '  capacity:            ' + CAPACITY + ' message bits per uuid (128 − 6 reserved − 7 length header)\n'
  o += '  imprint("' + demo + '")\n'
  o += '    → ' + u + '\n'
  o += '  readImprint(uuid)  → ' + back + '   round-trips: ' + (back === demo) + '\n'
  o += '  imprintText("Hi")  → ' + txt + '  → readImprintText → "' + txtBack + '"\n\n'
  o += '  HONEST: this CONSTRUCTS a uuid from a message and reads it back — a lossless codec (integrity).\n'
  o += '  It does NOT undo the one-way FNV toUuid, and it is not encryption (no key, no secrecy). entails → 0/7.'
  return o
}
