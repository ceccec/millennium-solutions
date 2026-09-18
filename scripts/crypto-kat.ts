#!/usr/bin/env node
// CRYPTO-KAT — the primitives against their PUBLISHED vectors, on every run.
//
// A hand-written cryptographic primitive that has not been checked against someone else's numbers is a
// primitive nobody has checked. These vectors are not this deposit's: they are FIPS 180-4 for SHA-512 and
// RFC 8032 §7.1 for Ed25519, and they are the only reason to believe either implementation does what its
// name says. The deposit's own FNV is pinned by the kernel in fnv.lean instead, which is stronger and is
// possible there because FNV is small enough to decide.
//
// The container is checked here too, and its two questions are kept apart deliberately:
//   INTACT — the checksum still covers the payload. Catches accident; catches nothing deliberate.
//   SIGNED — an Ed25519 signature over the uuid verifies against a public key. Catches an author.
// A run that proved only the first and reported "verified" would be the overclaim this tree exists to stop,
// so the negative cases are checked as hard as the positive ones: an altered message, an altered signature
// and another party's key must each be REFUSED.
import { sha512, hex, unhex } from '../src/0/sha512.ts'
import { publicKey, sign, verify, PUBLIC_KEY_BYTES, SIGNATURE_BYTES } from '../src/0/ed25519.ts'
import { encode, decode, signContainer, verifyContainer, PROGRAM_BITS, MESSAGE_BITS, CHECK_BITS } from '../src/0/program.ts'

let bad = 0
const check = (ok: boolean, what: string, detail = '') => {
  console.log(`  ${ok ? '✓' : '✗'} ${what}${detail && !ok ? ' — ' + detail : ''}`)
  if (!ok) bad++
}

// ── SHA-512, FIPS 180-4 ──────────────────────────────────────────────────────────────────────────────────
const SHA: [string, string][] = [
  ['', 'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'],
  ['abc', 'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f'],
  ['abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu',
   '8e959b75dae313da8cf4f72814fc143f8f7779c6eb9f7fa17299aeadb6889018501d289e4900f7e4331b99dec4b5433ac7d329eeb6dd26545e96e55b874be909'],
]
console.log('SHA-512 — FIPS 180-4:')
for (const [msg, want] of SHA)
  check(hex(sha512([...msg].map((c) => c.charCodeAt(0)))) === want, `"${msg.slice(0, 12)}${msg.length > 12 ? '…' : ''}" (${msg.length} bytes)`)

// ── Ed25519, RFC 8032 §7.1 ───────────────────────────────────────────────────────────────────────────────
const ED: [string, string, string, string][] = [
  ['9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60', 'd75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', '',
   'e5564300c360ac729086e2cc806e828a84877f1eb8e5d974d873e065224901555fb8821590a33bacc61e39701cf9b46bd25bf5f0595bbe24655141438e7a100b'],
  ['4ccd089b28ff96da9db6c346ec114e0f5b8a319f35aba624da8cf6ed4fb8a6fb', '3d4017c3e843895a92b70aa74d1b7ebc9c982ccf2ec4968cc0cd55f12af4660c', '72',
   '92a009a9f0d4cab8720e820b5f642540a2b27b5416503f8fb3762223ebdb69da085ac1e43e15996e458f3613d0f11d8c387b2eaeb4302aeeb00d291612bb0c00'],
  ['c5aa8df43f9f837bedb7442f31dcb7b166d38535076f094b85ce3a2e0b4458f7', 'fc51cd8e6218a1a38da47ed00230f0580816ed13ba3303ac5deb911548908025', 'af82',
   '6291d657deec24024827e69c3abe01a30ce548a284743a445e3680d7db5ac3ac18ff9b538d16f290ae67f760984dc6594a7c15e9716ed28dc027beceea1ec40a'],
]
console.log('\nEd25519 — RFC 8032 §7.1:')
for (const [seed, pub, msg, sig] of ED) {
  check(hex(publicKey(unhex(seed))) === pub, `public key for seed ${seed.slice(0, 8)}…`)
  check(hex(sign(unhex(seed), unhex(msg))) === sig, `signature over a ${unhex(msg).length}-byte message`)
  check(verify(unhex(pub), unhex(msg), unhex(sig)), 'the published signature verifies')
}

console.log('\nand what it must REFUSE — a check that only passes is not a check:')
{
  const seed = unhex(ED[1][0]), pub = publicKey(seed), msg = [1, 2, 3, 4], sig = sign(seed, msg)
  check(verify(pub, msg, sig), 'the honest signature verifies (the control for the three below)')
  check(!verify(pub, [1, 2, 3, 5], sig), 'an altered message is refused')
  check(!verify(pub, msg, [...sig.slice(0, 63), sig[63] ^ 1]), 'an altered signature is refused')
  check(!verify(publicKey(unhex(ED[0][0])), msg, sig), "another party's key is refused")
  check(!verify(pub.slice(0, 31), msg, sig), 'a truncated key is refused')
}

// ── the container ────────────────────────────────────────────────────────────────────────────────────────
console.log('\nthe container — checksum, program, message:')
{
  const prog = '101010'.repeat(7), msg = '1100'.repeat(12)
  const uuid = encode(prog, msg)
  const d = decode(uuid)
  check(d.program === prog && d.message === msg, 'the fields read back exactly')
  check(d.intact, 'the checksum covers what is there')
  check(/^[0-9a-f]{8}-[0-9a-f]{4}-8[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid),
    'it is a version-8 variant-10 uuid', uuid)
  check(CHECK_BITS + PROGRAM_BITS + MESSAGE_BITS + 6 === 128, 'the fields and the reserved six are the whole uuid')

  // EVERY single-bit flip of the free bits, not a sample: 122 of them
  const hexs = uuid.replace(/-/g, '')
  const RES = new Set([48, 49, 50, 51, 64, 65])
  let flips = 0, caught = 0
  for (let i = 0; i < 32; i++) for (let b = 0; b < 4; b++) {
    const pos = i * 4 + (3 - b)
    if (RES.has(pos)) continue
    const n = (parseInt(hexs[i], 16) ^ (1 << b)).toString(16)
    const h = hexs.slice(0, i) + n + hexs.slice(i + 1)
    flips++
    if (!decode(`${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`).intact) caught++
  }
  check(flips === 122 && caught === 122, `every one of the ${flips} single-bit flips is caught`, `${caught}/${flips}`)

  const signed = signContainer(unhex(ED[0][0]), uuid)
  const v = verifyContainer(signed)
  check(v.intact && v.signed, 'the signed container is both undamaged and attributable')
  check(signed.publicKey.length === PUBLIC_KEY_BYTES && signed.signature.length === SIGNATURE_BYTES,
    'the key is 32 bytes and the signature 64 — neither fits in the 16-byte uuid, so both travel beside it')
}

console.log(bad
  ? `\n✗ crypto-kat: ${bad} check(s) failed — a primitive here does not do what its name says`
  : '\n✓ crypto-kat: SHA-512 and Ed25519 agree with FIPS 180-4 and RFC 8032, refuse every forgery put to them,'
    + '\n  and the container round-trips, catches all 122 single-bit flips, and carries its signature beside it.'
    + '\n  Honest: this is an implementation of published standards, not a new scheme, and it is not constant-time.')
process.exit(bad ? 1 : 0)
