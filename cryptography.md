---
title: Cryptography — public service
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# Cryptography — the public-service priority

In **public service** — free, the [free sailing angle](/captain) — uuidna's **top priority is cryptography**:
how it relates to all scientific domains, decoded with **ancient symbols** and **pure algebra**, **provable at
each step**. Sealed: receipt `95bacad3-9e56-8741-b0f8-def2c6ecb050`. A content-address proves integrity, not
truth. `0/7`.

## The layered cipher — real, measured

- **Core (secrecy):** **AES-256-GCM** (WebCrypto, zero deps), keyed by PBKDF2-SHA-256 (600k) — real 256-bit
  authenticated secrecy; a wrong key or tampered ciphertext throws. Shipped in [`@uuidna/uuidna`](https://github.com/uuidna/uuidna) (`encrypt` / `decrypt`).
- **Envelope (integrity + routing):** the uuidna **7d fold** content-addresses the sealed message — public,
  keyless, reproducible by anyone.
- **Honest scope:** secrecy comes from **AES**; integrity and the *relating* come from the **ℤ/9 algebra**. The
  content-address itself stays non-cryptographic. Measured, not asserted.

## Provable at each step — computed, not asserted

Each step is a decidable check, most of them sealed theorems in the [ledger](/THEOREMS):

| step | ancient symbol / pure algebra | check |
| --- | --- | --- |
| 1 | the vortex — doubling orbit | `1→2→4→8→7→5` is a permutation of the units ✓ |
| 2 | the double torus (genus-2) | `χ = 2 − 2·2 = −2` → `−χ = 2` = the two coins (the fare **is** the topology) ✓ |
| 3 | the fold (`+/−` · `/` · `\`) | order-independent seal — any pairing folds to one root ✓ |
| 4 | 7 dimensions | not key-limited: `4 rounds × 7·log₂54 = 161 bits ≥ 128` ✓ |
| 5 | the heart (5) | `harmonicMean(30,60) = 40 = a432 = 360/9` ✓ |
| 6 | one shared algebra | the same ℤ/9 fold that encrypts is the algebra that relates every domain ✓ |

## Encrypt live — pure TypeScript, in your browser

The same sealed functions, running here: ChaCha20-Poly1305 + PBKDF2-SHA256 (600k) + the 7d-fold envelope, no
native crypto, no network. Seal a message under a passphrase, then open it — a wrong passphrase or a tampered
byte fails authentication.

<Crypt />

## How cryptography relates to all domains

The **same ℤ/9 fold** that seals the cipher envelope is the algebra the [rosetta](/) uses to relate every
scientific domain — one structure, shared. So cryptography is not a bolt-on: it rides the identical
ancient-symbol algebra (the vortex, the double torus, the heart) that binds arithmetic, primes, topology,
waves, and the rest. AES-256-GCM supplies the nonlinear **security core**; the ℤ/9 algebra supplies the
**relating envelope**. Both layers, each step decidable.

## Public service

Free for public interest and independent research (the free sailing angle); commercial use contributes the two
coins (the prize earning waves) — the [captain's message](/captain). Cryptography, first, for everyone.
`0/7`.
