// SPLIT — a value divided into shares, so that no single share reveals it, computed locally by default.
//
// ADDITIVE SHARING OVER Z/2^256. A secret s is split into n shares: n-1 of them are uniform random 256-bit numbers drawn
// from the operating system's cryptographic generator, and the last is chosen so that the shares sum to s modulo 2^256.
// Any n-1 shares are uniform and independent of s, so they carry no information about it. Only all n together recover it.
//
// LOCAL BY DEFAULT. Nothing here touches the network: the shares stay on the machine that made them, and whoever holds a
// subset decides where the rest go. Sending a share to a service is a separate act that the caller performs, because a
// service that receives a share receives part of the secret.
//
// WHAT THIS DOES NOT DO. It does not make a computation private on a machine that holds every share, and it does not
// hide the number of shares or their size. A single party that holds all n shares holds the secret.

import { randomBytes } from 'node:crypto'

export const MODULUS = 1n << 256n

/** A uniform 256-bit number from the operating system's cryptographic generator. */
const randomBelowModulus = (): bigint => BigInt('0x' + randomBytes(32).toString('hex'))

export type SplitResult =
  | { status: 'SPLIT'; shares: string[]; modulus: string; parts: number; why: string }
  | { status: 'REFUSED'; why: string }

/** Split a non-negative integer below 2^256 into `parts` shares, each a decimal string. */
export const split = (secret: string, parts: number): SplitResult => {
  if (!/^\d+$/.test(secret)) return { status: 'REFUSED', why: 'the secret is not a non-negative decimal integer' }
  const s = BigInt(secret)
  if (s >= MODULUS) return { status: 'REFUSED', why: 'the secret is 256 bits or more; split it into 256-bit words first' }
  if (!Number.isInteger(parts) || parts < 2) return { status: 'REFUSED', why: 'a split needs at least two shares: one share alone is the secret' }
  const shares: bigint[] = []
  let sum = 0n
  for (let i = 0; i < parts - 1; i++) {
    const r = randomBelowModulus()
    shares.push(r)
    sum = (sum + r) % MODULUS
  }
  shares.push(((s - sum) % MODULUS + MODULUS) % MODULUS)
  return {
    status: 'SPLIT',
    shares: shares.map((x) => x.toString()),
    modulus: MODULUS.toString(),
    parts,
    why: `${parts} shares; any ${parts - 1} are uniform and reveal nothing; all ${parts} recover the secret`,
  }
}

/** Recombine shares into the secret. Refuses an empty list, since an empty sum would read as a secret of zero. */
export const join = (shares: string[]): { status: 'JOINED'; secret: string } | { status: 'REFUSED'; why: string } => {
  if (shares.length === 0) return { status: 'REFUSED', why: 'no shares were given; an empty sum is not a secret of zero' }
  if (!shares.every((x) => /^\d+$/.test(x))) return { status: 'REFUSED', why: 'a share is not a non-negative decimal integer' }
  const total = shares.reduce((acc, x) => (acc + BigInt(x)) % MODULUS, 0n)
  return { status: 'JOINED', secret: total.toString() }
}
