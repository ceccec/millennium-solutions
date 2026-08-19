# `@uuidna/uuidna` — API reference

*Generated from the built `.d.ts` by `docs.mjs`; it cannot drift from the shipped types. Do not edit by hand.*

Content-addressed identity, honest by construction — mint + mind, holographic merkle proofs, a reversible imprint codec, a reeducating harness, a measured billing model, pure-TypeScript ChaCha20-Poly1305 encryption (no native crypto) under a 7d-fold envelope, and an MCP server to fuse it into any harness. Integrity, not truth. 0/7.

**Version** `0.1.1` (a held label — the content-address is the true latest) · **License** CC-BY-NC-ND-4.0 · ESM-only, zero runtime dependencies.

```js
import { toUuid, computes, encrypt } from '@uuidna/uuidna'
// or a subpath, to pull only what you need:
import { encrypt } from '@uuidna/uuidna/crypt'
```

A content-address proves **integrity, not truth**: the same input mints the same identifier for anyone, with no key. It does not assert the value is correct. `0/7`.

---

## `address`

The content-address itself, and the ℤ/9 vortex primitives derived from one axiom.

| Export | Signature | Notes |
|---|---|---|
| `toUuid` | `toUuid(seed: string): string` | Deterministic UUID from a seed string — the content-address. Same input → same address, always. |
| `strictUuidna` | `strictUuidna(value: unknown): string` | Strict, canonical mint: coerce to string, normalize (NFC), trim — so the SAME logical value always  mints the SAME address. Closes minting flaws (toUuid(3) vs toUuid('3'), stray whitespace, unicode form). */ |
| `merge` | `merge(a: string, b: string): string` | Fold two addresses into one (order-sensitive). |
| `coin64` | `coin64(text: string): string` | A 64-bit coin (16 hex digits) minted from any content — the top 64 bits of its content-address. |
| `gcdBigInt` | `gcdBigInt(a: bigint, b: bigint): bigint` | GCD (bigint) for rational reduction and unit derivation. |
| `merkleFold` | `merkleFold(leaves: readonly string[]): string` | Merkle fold — contract a set of leaves to one root (order-INDEPENDENT: leaves are sorted first). |
| `digitalRoot` | `digitalRoot(n: number): number` | Digital root in ℤ/9 (1..9; multiples of 9 map to 9). |
| `gcd` | `gcd(a: number, b: number): number` | Euclid's algorithm — the greatest common divisor. |
| `isPrime` | `isPrime(n: number): boolean` | Primality by trial division up to √n — decidable, exact. |
| `modpow` | `modpow(b: number, e: number, n: number): number` | Modular exponentiation bᵉ mod n by square-and-multiply. |
| `TRINITY` | `TRINITY = 3` | The one irreducible axiom: the trinity. |
| `BASE` | `BASE: number` | The base of the ring — TRINITY², derived. |
| `digits` | `digits(): number[]` | The residues [1..BASE]. |
| `units` | `units(): number[]` | The units of ℤ/9 — residues coprime to the base: [1,2,4,5,7,8]. |
| `triad` | `triad(): number[]` | The triad {3,6,9} — non-units, the complement. |
| `vortexOrbit` | `vortexOrbit(): number[]` | The vortex doubling circuit — the orbit of n→2n (mod BASE) from 1: [1,2,4,8,7,5]. |
| `A432_STEP` | `A432_STEP: number` | a432 angular quantum — one BASE-th of the circle: 360/9 = 40°. |

## `adjudicate`

The trial — a recomputable three-way verdict, folded to one proof-of-verdict root.

| Export | Signature | Notes |
|---|---|---|
| `VerdictKind` | `VerdictKind = 'REFUTED' \| 'SEALED' \| 'UNVERIFIED'` |  |
| `Verdict` | `Verdict` |  |
| `adjudicate` | `adjudicate(statement: string, decidableTest?: () => boolean): Verdict` |  |
| `ProvenVerdict` | `ProvenVerdict extends Verdict` |  |
| `proveVerdict` | `proveVerdict(statement: string, formulaReceipts?: readonly string[]): ProvenVerdict` |  |
| `UuidnaVerdict` | `UuidnaVerdict` |  |
| `verifyUuidna` | `verifyUuidna(seed: string): UuidnaVerdict` |  |

## `billing`

The measured billing model. Public interest is free.

| Export | Signature | Notes |
|---|---|---|
| `coins` | `coins(): number` | The two coins — the conserved fair-exchange invariant. |
| `UuidnaUsage` | `UuidnaUsage` |  |
| `billUuidna` | `billUuidna(u: UuidnaUsage):` | Bill uuidna usage on the MEASURED bits saved (recompute − verify). Public interest is free; commercial  pays the two conserved coins on the measured saving. Same terms → same result, for anyone. */ |

## `chacha`

ChaCha20, Poly1305 and the AEAD construction (RFC 8439) — pure TypeScript.

| Export | Signature | Notes |
|---|---|---|
| `chachaBlock` | `chachaBlock(key: Uint8Array, counter: number, nonce: Uint8Array): Uint8Array` |  |
| `chacha20` | `chacha20(key: Uint8Array, counter: number, nonce: Uint8Array, data: Uint8Array): Uint8Array` |  |
| `poly1305` | `poly1305(msg: Uint8Array, otk: Uint8Array): Uint8Array` |  |
| `aeadEncrypt` | `aeadEncrypt(key: Uint8Array, nonce: Uint8Array, plaintext: Uint8Array, aad?: Uint8Array):` | ChaCha20-Poly1305 AEAD encrypt (RFC 8439 §2.8). Returns ciphertext and a 16-byte authentication tag. |
| `aeadDecrypt` | `aeadDecrypt(key: Uint8Array, nonce: Uint8Array, ct: Uint8Array, tag: Uint8Array, aad?: Uint8Array): Uint8Array` | ChaCha20-Poly1305 AEAD decrypt (RFC 8439 §2.8). Throws if the tag does not authenticate. |

## `crypt`

Authenticated encryption: ChaCha20-Poly1305 + PBKDF2-SHA256, convergent or randomized.

| Export | Signature | Notes |
|---|---|---|
| `ITER` | `ITER = 600000` |  |
| `CryptMode` | `CryptMode = 'convergent' \| 'randomized'` | How the envelope's salt/nonce were sourced: derived from the input (reproducible) vs. random (equality-hiding). |
| `Sealed` | `Sealed` | A sealed envelope: the ChaCha20-Poly1305 ciphertext + tag, its public parameters, and its 7d-fold address.  `v:1` envelopes (pre-mode) still decrypt — `decrypt`/`verifyEnvelope` read only the cipher parameters. */ |
| `EncryptOpts` | `EncryptOpts` | Options common to both modes. `iter` overrides the PBKDF2 count (default {@link ITER}); lower only for tests. |
| `RandomOpts` | `RandomOpts extends EncryptOpts` | Randomized-mode options. `random(n)` returns n secure random bytes; default: globalThis.crypto.getRandomValues. |
| `encrypt` | `encrypt(plaintext: string, passphrase: string, opts?: EncryptOpts): Sealed` | Encrypt plaintext under a passphrase — pure-TS, DETERMINISTIC (convergent): same input → same envelope. |
| `encryptRandom` | `encryptRandom(plaintext: string, passphrase: string, opts?: RandomOpts): Sealed` | Encrypt with a per-message RANDOM salt+nonce — equal plaintexts seal to DISTINCT envelopes (equality hidden).  Not reproducible/content-addressable; use when hiding plaintext equality matters more than convergence. */ |
| `decrypt` | `decrypt(sealed: Sealed, passphrase: string): string` | Decrypt a sealed envelope (either mode). A wrong passphrase or tampered ciphertext throws (Poly1305 auth). |
| `verifyEnvelope` | `verifyEnvelope(sealed: Sealed): boolean` | Verify the envelope's 7d-fold content-address (integrity/routing) without the key — public, reproducible. |

## `diamond`

The involution r(d) = 10 − d and its lift to a list.

| Export | Signature | Notes |
|---|---|---|
| `diamond` | `diamond: (d: number) => number` |  |
| `DIAMOND_FIXED` | `DIAMOND_FIXED: number[]` |  |
| `involute` | `involute: <T>(xs: readonly T[]) => Array<[T, T]>` |  |
| `involutionFixed` | `involutionFixed: <T>(xs: readonly T[]) => T[]` |  |

## `gate`

The prose honesty gate: a lexical tripwire that drains named overclaims. Necessary, not sufficient.

| Export | Signature | Notes |
|---|---|---|
| `RED` | `RED: RegExp` |  |
| `RED_INTL` | `RED_INTL: RegExp` |  |
| `OVERREACH` | `OVERREACH: RegExp` |  |
| `PREDICT` | `PREDICT: RegExp` |  |
| `rosetta` | `rosetta: (t: string) => string` |  |
| `computes` | `computes: (text: string) =>` | The binary. true = honest (stays); false = overclaim (drained). `hit` is the exact prose that failed. |

## `gravity`

Decidable contractions — order-invariant folds. Not physics.

| Export | Signature | Notes |
|---|---|---|
| `merkleGravity` | `merkleGravity(addresses: readonly string[]): string` | Gravity 1 — the merkle fold: any set of addresses falls to ONE root (order-invariant contraction).  This is the quantum receipt: fold the same set in any order → the same address. */ |
| `doubleTorusField` | `doubleTorusField(addresses: readonly string[]):` | Gravity 3 — the DOUBLE TORUS over the whole 7D space. Two interlocked orbits — the doubling vortex  [1,2,4,8,7,5] and its reverse (the halving torus) — rotate the address set; at EACH of the 7 dimensions the  two tori combine (a merkle fold of the two rotations), and the 7 dimension-roots fold to ONE gravity root.  Order-DEPENDENT by construction (the coordinate turns with position) — use merkleGravity for an observer-  invariant receipt; use this when the sequence itself is the signal. NOT physics. Falls to 0/7. */ |
| `doubleTorusGravity` | `doubleTorusGravity(addresses: readonly string[]): string` |  |
| `fall` | `fall(n: number): number` | Gravity 2 — the digital root: any integer falls to ℤ/9, and stays (idempotent: one step to the ground). |
| `fixedPoints` | `fixedPoints(): number[]` | The ground of gravity 2 — the fixed points of the fall. Every residue 1..BASE is fixed under dr. |
| `seats` | `seats(bits: number): number` | Pigeonhole gravity — a digest of b bits has 2^b seats; past 2^b inputs a collision is forced.  True for EVERY finite hash (the strong ones only resist computationally; FNV does not resist). */ |

## `harness`

Make any output auditable; bound an overclaim until it holds.

| Export | Signature | Notes |
|---|---|---|
| `Harnessed` | `Harnessed =` |  |
| `DIMENSIONS` | `DIMENSIONS: readonly ['en', 'bg', 'de', 'fr', 'es', 'ru', 'zh']` | The seven dimensions (the locale rays) — the structural "quantum" sense, NOT a physical qubit. |
| `harness` | `harness(output: string): Harnessed` | Content-address an output, confirm the address reproduces, gate-check it. `auditable` = it reproduces. |
| `opaque` | `opaque(output: string):` | The untreated baseline: opaque bytes with no address, nothing to verify. |
| `harnessGain` | `harnessGain(output: string):` | The measurable difference: harnessing turns an unauditable output into an auditable one (+1 dimension). |
| `harness7` | `harness7(output: string):` | Address the output from each of the seven dimensions — seven reproducible receipts folded to one root. |
| `reeducate` | `reeducate(output: string, maxSteps?: number):` | A failing output is not discarded but CORRECTED: each gate hit is bounded until the text holds. This is  mechanical correction — it bounds an overclaim, it never makes a false claim true. Terminates. */ |

## `imprint`

A reversible codec that encodes text INTO uuids. Public and reversible — not encryption.

| Export | Signature | Notes |
|---|---|---|
| `CAPACITY` | `CAPACITY: number` |  |
| `imprint` | `imprint(message: string): string` | imprint(message) → a valid uuid carrying the binary message ('0'/'1', length ≤ CAPACITY) in its free bits. |
| `readImprint` | `readImprint(uuid: string): string` | readImprint(uuid) → the exact binary message imprinted by imprint(). Inverse of imprint. |
| `roundTrips` | `roundTrips(message: string): boolean` | roundTrips(message) → true iff readImprint(imprint(message)) === message. |
| `imprintChain` | `imprintChain(bits: string): string[]` | imprintChain(bits) → a CHAIN of uuids carrying a binary message of ANY length (CAPACITY-bit chunks). |
| `readImprintChain` | `readImprintChain(uuids: readonly string[]): string` | readImprintChain(uuids) → recover the full binary message, exactly. |
| `imprintTextChain` | `imprintTextChain(text: string): string[]` | imprintTextChain(text) → a uuid chain carrying arbitrary UTF-8 text of any length. |
| `readImprintTextChain` | `readImprintTextChain(uuids: readonly string[]): string` | readImprintTextChain(uuids) → recover the full text from its uuid chain, exactly. |

## `merkle`

Holographic inclusion proofs — verify the whole from a tiny part, in O(log N).

| Export | Signature | Notes |
|---|---|---|
| `merkleRoot` | `merkleRoot(leaves: readonly string[]): string` | Root of the ordered merkle tree over leaves (an odd node is promoted, not duplicated). |
| `merkleProof` | `merkleProof(leaves: readonly string[], index: number):` | Inclusion proof for the leaf at `index`: the sibling at each level and which side it is on. |
| `verifyProof` | `verifyProof(leaf: string, proof: readonly` | Verify a leaf is in `root` using only its proof path — no other leaf needed. A forged leaf fails. |

## `render`

Framework-free, CSP-safe HTML for presenting theorems by reference.

| Export | Signature | Notes |
|---|---|---|
| `TheoremView` | `TheoremView` |  |
| `RenderOpts` | `RenderOpts` |  |
| `renderTheorem` | `renderTheorem(t: TheoremView, opts?: RenderOpts): string` | renderTheorem(t) → a self-contained HTML card (inline CSS, no framework) presenting one theorem BY its  content-address, as schema.org CreativeWork microdata, LINKING the statement to its proof page (/theorem/<key>).  If no address is given it is minted from the name — the same value always mints the same. */ |
| `renderHero` | `renderHero(t: TheoremView, opts?: RenderOpts): string` | renderHero(t) → the OpenGraph HERO for one theorem's page: the <meta property="og:*"> tags (title, description,  type, url→its proof) PLUS the microdata card. Emitted head-first so a crawler or an agent reads the statement,  its proof URL and its content-address on first contact. Self-contained, no script. */ |
| `renderList` | `renderList(theorems: readonly TheoremView[], opts?: RenderOpts): string` | renderList(theorems) → a grid of cards. Presents many theorems BY REFERENCE (their addresses), never by  embedding the full payload — so any number of theorems presents within a fixed byte budget per card. */ |

## `sha256`

SHA-256, HMAC-SHA-256 and PBKDF2 — pure TypeScript, KAT-verified.

| Export | Signature | Notes |
|---|---|---|
| `sha256` | `sha256(msg: Uint8Array): Uint8Array` | SHA-256 (FIPS 180-4) of a byte array → 32-byte digest. |
| `hmacSha256` | `hmacSha256(key: Uint8Array, msg: Uint8Array): Uint8Array` | HMAC-SHA256 (RFC 2104). |
| `pbkdf2Sha256` | `pbkdf2Sha256(pass: Uint8Array, salt: Uint8Array, iterations: number, dkLen: number): Uint8Array` | PBKDF2-HMAC-SHA256 (RFC 8018) → derived key of dkLen bytes. |

---

*83 exports across 13 modules · receipt `e5bf1e62-6a4d-8e10-ae5f-b42414e6f1b0` · integrity, not truth · 0/7*
