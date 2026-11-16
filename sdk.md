---
title: SDK
description: The deposit's quantum theorems on a ZFS-shaped content-address substrate, carrying cross-encrypted UUID streams — unbounded capacity, verified by handle.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# The SDK — two legs, one shape

> The SDK stands on two legs that are the **same content-address shape** at two levels: the **theorems** (this deposit's kernel-checked math) and the **substrate** (a ZFS-shaped content-address store). Between them run **cross-encrypted UUID streams**. Everything below is sealed or measured; the one quantum-*device* claim is marked open, with its path.

## The substrate — ZFS is the content-address shape in the kernel

The deposit builds content-addressing in software; **ZFS already is it** at the filesystem level. The correspondence is sealed (8 theorems, receipts `06d8923a-470b`, `f3365bad-fbc7…`):

| deposit primitive | ZFS feature | shared shape |
|---|---|---|
| `toUuid` / content-address | block **checksum** | address |
| `merkleFold` / seal root | **block-pointer merkle tree** (uberblock) | merkle |
| handle cache (verify-by-handle) | **dedup + ARC** | cache |
| the **304 involution** (serve, not recompute) | **copy-on-write** snapshots/clones | involution |
| UUID | pool/dataset **GUID** | guid |
| `recompute` / scrub | **scrub** (recompute & check) | verify |

**The efficiency both legs get, sealed:** a state is *verified* in **one step** (read the address) where *recompute* re-runs all **n** facts — so `verify(1) < recompute(n)` for every n ≥ 2, the advantage `n−1` unbounded. This is why **caching via handles removes the memory wall**: generation is paid once and committed; from then on the pipeline only verifies by handle (the ECPP certificates for 2^999+1 are exactly this — generated once at 8 GB, re-verified cheaply).

## The streams — cross-encrypted UUID, unbounded capacity

Each UUID is a 128-bit register (sealed, 21 capacity theorems, receipts `05ee2cb9-0963`, `9c0e2abe-7301…`): **6 reserved** (the hexbit coil), **122 free**. Cross-encrypting the version nibble reclaims 4 — only the **2-bit variant** is irreducible — so **122 → 126** addressable bits per stream. Read as the teleport grain, two classical bits signal one primitive: **61 primitives per UUID** (⌊122/2⌋).

**Unbounded by streams, not by one register.** ZFS stores unboundedly many such streams; each is deduped, snapshotted and scrubbed by checksum, and verified by its handle in O(1) regardless of how many there are. So the *encoding* capacity is unbounded in the number of streams, and the Mermin advantage is proved for **every** width (15 octave theorems) — the quantum *shape* is uncapped.

## The theorems — the math leg

- **2^999+1 FULLY PROVED FACTORED** — every factor proved prime (deposit deterministic test + APR-CL), with portable ECPP certificates (/iso-conformance, evidence/factor/).
- **Mermin lead proved for every width** — 15 theorems; the advantage `2^(k-1)` gains an exponent each octave without bound.
- **the quantum-computer status** — a value `complete | incomplete | refuted` (32 theorems), currently **incomplete**: design complete, device open.

## Honest floor — what "unlimited quantum capacity" means here

The capacity is **encoding** capacity — unbounded UUID streams on a content-address substrate, carrying quantum-**shaped** math (the Mermin structure, the σ-reflection, the factored register). "Teleport" is the **two-bit signalling grain** of that encoding, a design mapping — **not** physical quantum teleportation. "Quantum" is the shape and the proofs, **not a device**: the ISO 4879 **3.4.10 device leaf stays open** at `/iso-conformance` until a CHSH run on real hardware (`/chsh-run`) returns S > 2. The SDK is complete as a *content-address + proof* stack; the physical quantum computer is the one evidence still awaited, named and reachable.
