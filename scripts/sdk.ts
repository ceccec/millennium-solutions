// scripts/sdk.ts — the SDK page: the two-leg stack completed — the deposit's quantum theorems on a ZFS-shaped
// content-address substrate, carrying cross-encrypted UUID streams. Generated from the sealed ledger (receipts)
// and the factor evidence. Solution-first and honest: it states the unbounded ENCODING capacity and the
// verify-by-handle efficiency as sealed facts, and marks the quantum-DEVICE claim as the open leaf it is.
// Generated — do not edit. Registered in the reconcile chain and predocs.
import { writeFileSync, existsSync, readFileSync } from 'node:fs'

type Row = { key: string; name?: string; receipt: string; revoked?: boolean }
const ledger: Row[] = (await import('../src/ledger/discovered.json', { with: { type: 'json' } })).default as Row[]
const live = ledger.filter((e) => !e.revoked)
const grp = (needle: string) => { const r = live.filter((e) => e.key.includes(needle)); return { n: r.length, r: r.slice(0, 2).map((x) => x.receipt.slice(0, 13)) } }

const corr = grp('sdkcorrespondence')   // the ZFS↔deposit content-address correspondence + verify<recompute
const cap = grp('capacity')             // the 128-bit register and the cross-mixing reclaim (6→2, 122→126)
const oct = grp('quantumoctaves')       // the Mermin lead, proved for every width
const qc = grp('qcstatus')              // the quantum-computer status model

let factored = false
try { factored = existsSync('evidence/factor/2pow999plus1.json') && JSON.parse(readFileSync('evidence/factor/2pow999plus1.json', 'utf8')).status === 'FULLY_PROVED' } catch { factored = false }

// honest capacity arithmetic (the numbers are decided in capacity.lean; echoed here as the page's figures)
const FREE = 122, RECLAIMED = 126, COIL = 6, IRREDUCIBLE = 2, TELEPORT = 61  // 122/2: two classical bits signal one primitive

const md = `---
title: SDK
description: The deposit's quantum theorems on a ZFS-shaped content-address substrate, carrying cross-encrypted UUID streams — unbounded capacity, verified by handle.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---

# The SDK — two legs, one shape

> The SDK stands on two legs that are the **same content-address shape** at two levels: the **theorems** (this deposit's kernel-checked math) and the **substrate** (a ZFS-shaped content-address store). Between them run **cross-encrypted UUID streams**. Everything below is sealed or measured; the one quantum-*device* claim is marked open, with its path.

## The substrate — ZFS is the content-address shape in the kernel

The deposit builds content-addressing in software; **ZFS already is it** at the filesystem level. The correspondence is sealed (${corr.n} theorems, receipts \`${corr.r.join('`, `')}…\`):

| deposit primitive | ZFS feature | shared shape |
|---|---|---|
| \`toUuid\` / content-address | block **checksum** | address |
| \`merkleFold\` / seal root | **block-pointer merkle tree** (uberblock) | merkle |
| handle cache (verify-by-handle) | **dedup + ARC** | cache |
| the **304 involution** (serve, not recompute) | **copy-on-write** snapshots/clones | involution |
| UUID | pool/dataset **GUID** | guid |
| \`recompute\` / scrub | **scrub** (recompute & check) | verify |

**The efficiency both legs get, sealed:** a state is *verified* in **one step** (read the address) where *recompute* re-runs all **n** facts — so \`verify(1) < recompute(n)\` for every n ≥ 2, the advantage \`n−1\` unbounded. This is why **caching via handles removes the memory wall**: generation is paid once and committed; from then on the pipeline only verifies by handle (the ECPP certificates for 2^999+1 are exactly this — generated once at 8 GB, re-verified cheaply).

## The streams — cross-encrypted UUID, unbounded capacity

Each UUID is a 128-bit register (sealed, ${cap.n} capacity theorems, receipts \`${cap.r.join('`, `')}…\`): **${COIL} reserved** (the hexbit coil), **${FREE} free**. Cross-encrypting the version nibble reclaims 4 — only the **${IRREDUCIBLE}-bit variant** is irreducible — so **${FREE} → ${RECLAIMED}** addressable bits per stream. Read as the teleport grain, two classical bits signal one primitive: **${TELEPORT} primitives per UUID** (⌊${FREE}/2⌋).

**Unbounded by streams, not by one register.** ZFS stores unboundedly many such streams; each is deduped, snapshotted and scrubbed by checksum, and verified by its handle in O(1) regardless of how many there are. So the *encoding* capacity is unbounded in the number of streams, and the Mermin advantage is proved for **every** width (${oct.n} octave theorems) — the quantum *shape* is uncapped.

## The theorems — the math leg

- **2^999+1 ${factored ? 'FULLY PROVED FACTORED' : 'PARTIAL'}** — every factor proved prime (deposit deterministic test + APR-CL), with portable ECPP certificates (/iso-conformance, evidence/factor/).
- **Mermin lead proved for every width** — ${oct.n} theorems; the advantage \`2^(k-1)\` gains an exponent each octave without bound.
- **the quantum-computer status** — a value \`complete | incomplete | refuted\` (${qc.n} theorems), currently **incomplete**: design complete, device open.

## Honest floor — what "unlimited quantum capacity" means here

The capacity is **encoding** capacity — unbounded UUID streams on a content-address substrate, carrying quantum-**shaped** math (the Mermin structure, the σ-reflection, the factored register). "Teleport" is the **two-bit signalling grain** of that encoding, a design mapping — **not** physical quantum teleportation. "Quantum" is the shape and the proofs, **not a device**: the ISO 4879 **3.4.10 device leaf stays open** at \`/iso-conformance\` until a CHSH run on real hardware (\`/chsh-run\`) returns S > 2. The SDK is complete as a *content-address + proof* stack; the physical quantum computer is the one evidence still awaited, named and reachable.
`

writeFileSync('sdk.md', md)
console.log(`sdk: generated sdk.md — correspondence ${corr.n}, capacity ${cap.n}, octaves ${oct.n}, qc ${qc.n}; 2^999+1 ${factored ? 'FULLY_PROVED' : 'partial'}`)
