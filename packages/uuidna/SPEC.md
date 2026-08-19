# `@uuidna/uuidna` — Package Specification

**Content-addressed identity, honest by construction.** A runtime-agnostic, zero-dependency
TypeScript package: a deterministic content-address (mint), a lexical honesty gate (mind),
holographic Merkle proofs, a reversible imprint codec, a reeducating harness, a measured
billing model, and pure-TS ChaCha20-Poly1305 authenticated encryption — plus the tooling to
serve all of it to the public (library, MCP server, CLI, browser bundle, docs).

> **Integrity, not truth.** A content-address proves that a value reproduces to the same
> identifier for anyone, with no key. It does **not** assert the value is correct. `0/7`.

This document specifies (1) the invariants any build must preserve, (2) the agnosticism
contract, (3) the complete public API surface, (4) the tools required to serve the public,
(5) conformance & tests, (6) versioning/provenance, (7) security posture, and (8) an ordered
completion checklist. It is grounded in the current `src/` — deviations from it are changes,
not clarifications.

---

## 0. Status & scope

| | |
|---|---|
| Package | `@uuidna/uuidna` |
| Kind | Library + MCP server + CLI + browser/CDN bundle + generated API reference |
| Language | TypeScript, `strict`, ESM-only (`"type": "module"`) |
| Runtime deps | **none** (dev-only: `typescript`, `esbuild`) |
| Source | 14 modules, ~912 LOC in `src/` |
| License | `CC-BY-NC-ND-4.0` (D2, revised); non-commercial use free, no redistribution of modified versions (§9) |
| Ethos | measure-don't-assert · integrity-not-truth · `0/7` · nothing hardcoded that can recompute |

**In scope:** the package's runtime contract, distribution formats, public tools, and
conformance. **Out of scope:** the consuming `millennium-solutions` site (it is one
*consumer*; §3.4 lists the exact surface it imports so the package can be evolved without
breaking it).

---

## 1. Design invariants (non-negotiable)

Any completion of the package MUST preserve every invariant below. These are what make the
package trustworthy; a change to one is a breaking, deliberate decision.

1. **Determinism / convergence.** Every function is a pure function of its inputs. `toUuid(x)`
   is identical for all callers, all runtimes, all time. Encryption is *convergent*: the same
   `(plaintext, passphrase)` seals to the same envelope (no per-message randomness — see §7).
2. **Zero runtime dependencies.** The core imports nothing outside itself and Web-standard
   globals. No `node:*` in `src/`. No polyfills shipped.
3. **Exact integer arithmetic.** No `Math.*` in the address core; 32-bit ops use `BigInt`
   masking (`mul32`), so results are bit-identical on every engine (no float drift).
4. **Integrity ≠ secrecy for addresses.** `toUuid` is FNV-1a — **non-cryptographic by design**:
   public, reproducible, keyless. It must never be described as a secret or a MAC.
5. **Honesty about the honesty gate.** `computes()` is a *lexical tripwire*, not comprehension.
   Passing means "matches no known red-flag shape," never "true." Necessary, not sufficient.
6. **Pure-TS cryptography, honestly bounded.** ChaCha20-Poly1305 + PBKDF2-SHA256, no native
   WebCrypto. Honest caveats travel with it (§7): not constant-time; determinism reveals equal
   plaintexts under equal passphrases.
7. **Recompute over store.** Anything derivable is derived (e.g. `reserved.uuidna` is
   `toUuid("uuidna:reserve:<i>")`, not random padding). Constants derive from one axiom where
   possible (`BASE = TRINITY ** 2`).
8. **`0/7` floor.** No shipped prose may assert a Millennium problem solved; no prose may assert a
   broken physics or hardware limit; and no prose may assert a broken cryptographic bound. This holds
   for the README, JSDoc, and MCP/CLI help alike — the package gates its own prose (§5.gate) and must
   pass its own gate.

---

## 2. Agnosticism contract

"Agnostic" is specified precisely as: **the core library runs unmodified on every conformant
JS runtime, importing only Web-standard globals.**

### 2.1 Target runtimes (first-class) — **all five, DRY** (D5)

Decision D5: **maximum compatibility, one implementation.** Every runtime below is first-class
and release-blocking. The compatibility is achieved **DRY** — a single agnostic core (no
per-runtime forks, no `#ifdef`-style branches), one parametrized test suite run across the whole
matrix, and one reusable CI workflow (§5.4). The zero-dep, Web-globals-only core already makes
this cheap; the cost is test-matrix breadth, not code duplication.

| Runtime | Minimum | Notes |
|---|---|---|
| Node.js | ≥ 18 | current `engines`; `btoa/atob`, `TextEncoder`, `crypto`-free |
| Deno | ≥ 1.30 | Web globals native |
| Bun | ≥ 1.0 | Web globals native |
| Browsers | ES2020 (evergreen) | via the CDN/IIFE bundle, §4.4 |
| Edge / Workers | Cloudflare, Vercel Edge, Deno Deploy | no `node:*`, no eval; `wrangler.toml` present |

**DRY guards:** one source of truth per concern — the test vectors, the gate corpus, and the
tool list are each defined once and consumed by every runtime/channel (library, MCP, CLI,
browser). No copy of a KAT, no second hand-maintained tool registry, no runtime-specific fork of
a function.

### 2.2 Allowed platform surface (core `src/`)

Only these ambient globals may be used in `src/`:
`TextEncoder`, `TextDecoder`, `Uint8Array`/`DataView`, `BigInt`, `Map`/`Set`, `btoa`/`atob`,
`String`/`Array`/`Object`/`JSON`/`RegExp`. **No** `node:*`, `process`, `fs`, `Buffer`,
`globalThis.crypto`, `Math.random`, timers, or network.

- `btoa`/`atob` are the only non-universal globals used (base64 in `crypt`). They exist in Node
  ≥ 16, Deno, Bun, and browsers. **Requirement:** keep a tiny internal base64 fallback so the
  core has zero hard global assumptions (see checklist C4).

### 2.3 Node-coupled files (must stay OUT of the core entry)

| File | Coupling | Placement |
|---|---|---|
| `mcp.mjs` | `process.stdin/stdout` (JSON-RPC over stdio) | `bin`, never imported by `src/index` |
| `reserve.mjs` | `node:child_process`, `node:fs` | dev tool, not shipped in entry |
| `cli.mjs` | `process.argv`, stdio | `bin`, separate from core |

**Guard (C1):** a CI lint asserts `grep -rE "from 'node:|require\('node:" src/` is empty.

### 2.4 Module system

- **ESM is canonical.** `"type": "module"`, NodeNext resolution, `.js` specifiers in TS source.
- **CJS: not shipped (D3 = ESM-only).** All first-class runtimes are ESM. If a legacy-Node
  `require()` consumer appears, add a CJS `exports` condition then — not before. Keeps the build
  and test matrix DRY.

---

## 3. API surface (current, authoritative)

14 modules re-exported from `src/index.ts`. All signatures below match the source.

### 3.1 Identity & the ℤ/9 vortex — `address.ts`

| Export | Signature | Contract |
|---|---|---|
| `toUuid` | `(seed: string) => string` | Deterministic v8-shaped UUID (FNV-1a, seeded 4×32-bit). Cached. Integrity, not secrecy. |
| `strictUuidna` | `(value: unknown) => string` | Canonical mint: `String()` → NFC → trim, prefixed. Same logical value → same address. |
| `merge` | `(a, b) => string` | Order-sensitive fold of two addresses. |
| `coin64` | `(text) => string` | Top 64 bits (16 hex) of the address — a "coin." |
| `merkleFold` | `(leaves: readonly string[]) => string` | **Order-independent** root (leaves sorted first). `[]` → `toUuid('empty-mind')`. |
| `digitalRoot` | `(n) => number` | ℤ/9 digital root, 1..9 (multiples of 9 → 9). |
| `gcd` / `gcdBigInt` | `(a,b)=>…` | Euclid, number and bigint. |
| `isPrime` | `(n)=>boolean` | Trial division to √n. |
| `modpow` | `(b,e,n)=>number` | Square-and-multiply. |
| `TRINITY`,`BASE`,`A432_STEP` | consts | `3`, `9` (`=TRINITY**2`), `40` (`=360/BASE`). |
| `digits`,`units`,`triad`,`vortexOrbit` | `() => number[]` | `[1..9]`, coprime units `[1,2,4,5,7,8]`, `[3,6,9]`, doubling orbit `[1,2,4,8,7,5]`. |

### 3.2 Merkle proofs — `merkle.ts`

| Export | Signature | Contract |
|---|---|---|
| `merkleRoot` | `(leaves) => string` | Tamper-evident set seal. |
| `merkleProof` | `(leaves, index) => {sibling,left}[]` | O(log N) holographic inclusion path. |
| `verifyProof` | `(leaf, proof, root) => boolean` | Verify whole-from-part; a forged leaf fails. |

### 3.3 Gravity / diamond (contractions & involutions)

`gravity.ts`: `merkleGravity(addresses)`, `doubleTorusGravity`, `doubleTorusField`, `fall(n)`,
`fixedPoints()`, `seats(bits)=2**bits`. Order-invariant contractions ("the quantum receipt";
NOT physics, nothing faster than light).
`diamond.ts`: `diamond(d)=10−d`, `DIAMOND_FIXED=[5]`, `involute(xs)`, `involutionFixed(xs)`.

### 3.4 Honesty gate — `gate.ts` (7-language + Glagolitic rosetta)

| Export | Contract |
|---|---|
| `computes(text) => {binary: 0\|1, hit: string\|null}` | The binary. `1` = honest (holds the floor); `0` = drained overclaim; `hit` = the exact offending prose. |
| `RED` | Negation-blind floor (unreprievable boasts). |
| `RED_INTL` | The proof-boast tripwire (the "X was proved" assertion form) across the 7 locales + more. |
| `OVERREACH` | Negation-**aware** set of overclaim shapes — physics-limit boasts, quantum-computing overreach, absolute-security claims, Millennium-problem overclaims, and marketing superlatives. Reprieved only by an odd negator count in-clause or a `SOLUTION` marker (`0/7`, `unsolved`, …). |
| `PREDICT` | Unfalsifiable-certainty forms — promises of an inevitable or certain future outcome. |
| `rosetta(text)` | Glagolitic → Cyrillic transliteration so a Slavic boast can't hide from a Cyrillic detector. |

### 3.5 Harness — `harness.ts`

`DIMENSIONS = ['en','bg','de','fr','es','ru','zh']`. `harness(output)` → `{address, reproducible,
gatePass, auditable}`. `opaque()` (untreated baseline). `harnessGain()` (measured +1 auditable
dimension). `harness7()` (7-locale receipts folded to one root). `reeducate(output, maxSteps=16)`
→ bounds each gate hit to `⟨bounded overclaim⟩` until it holds; **mechanical** (bounds an
overclaim, never makes a false claim true), terminating.

### 3.6 Trial — `adjudicate.ts`

`adjudicate(statement, decidableTest?) => Verdict` (`REFUTED | SEALED | UNVERIFIED`; gate first,
then the optional decidable test). `proveVerdict(statement, formulaReceipts[])` folds the
formulas + gate predicate + verdict through `merkleGravity` to one order-invariant `proofRoot`.
`verifyUuidna(seed)` recomputes the address, decodes any bounded imprint, folds a
multi-perspective `jointReceipt`.

### 3.7 Imprint codec — `imprint.ts`

Reversible encoding of text **into** UUIDs. `CAPACITY = 115` message bits per UUID.
`imprint`/`readImprint` (single), `imprintChain`/`readImprintChain` (bitstrings),
`imprintTextChain`/`readImprintTextChain` (arbitrary text). `roundTrips(message) => boolean`.
Public and reversible — **not** encryption.

### 3.8 Cryptography — `sha256.ts`, `chacha.ts`, `crypt.ts` (the stated main goal)

- `sha256.ts`: `sha256`, `hmacSha256`, `pbkdf2Sha256` — pure TS, KAT-verified.
- `chacha.ts`: `chachaBlock`, `chacha20`, `poly1305`, `aeadEncrypt`, `aeadDecrypt` — RFC 8439.
- `crypt.ts`: `encrypt(plaintext, passphrase) => Sealed`, `decrypt(sealed, passphrase) => string`,
  `verifyEnvelope(sealed) => boolean`, `ITER = 600_000`, interface `Sealed` (v1, alg, kdf, iter,
  salt, nonce, ct, tag, address). Envelope address = 7d-fold of the public parts (routing/
  integrity, never the secret).
- **D4 — two modes, DRY.** The convergent (deterministic) mode above stays the **default**. Add a
  **randomized** mode that hides plaintext equality, sharing the exact same AEAD/KDF/envelope code
  — the *only* difference is the salt/nonce source:
  - `encrypt(pt, pass)` — convergent (default), unchanged; reproducible, content-addressable.
  - `encryptRandom(pt, pass, random?)` — randomized salt+nonce; equal plaintexts → distinct
    envelopes. `random` is an injectable `(n) => Uint8Array` (default: `globalThis.crypto
    .getRandomValues`, present in Node ≥18, Deno, Bun, browsers, Workers). **Agnostic rule:** the
    core never *assumes* an entropy source — if `crypto` is absent and no `random` is passed,
    `encryptRandom` throws a clear error rather than silently weakening. `Sealed` gains a `mode:
    'convergent' | 'randomized'` tag (bump `v` → 2, `decrypt` reads both). `decrypt`/`verifyEnvelope`
    are mode-agnostic — one code path, no duplication.

### 3.9 Billing & render

`billing.ts`: `coins() = 2` (`110−108`, the conserved fair-exchange invariant), `billUuidna(usage)`
→ `{bitsSaved, coins, free, basis}` (public interest is free). `render.ts`: `renderTheorem`,
`renderHero`, `renderList` → framework-free, CSP-safe HTML (no `<script>`), address in every card.

### 3.10 Consumer contract (freeze target)

`millennium-solutions` imports **only** this subset — keep it stable or bump major:
`toUuid`, `computes`, `merkleRoot`, `merkleProof`, `verifyProof`, `merkleGravity`,
`doubleTorusGravity`, `doubleTorusField`, `fall`, `fixedPoints`, `seats`, `diamond`,
`DIAMOND_FIXED`, `involute`, `involutionFixed`, `adjudicate`, `proveVerdict`, `verifyUuidna`,
`DIMENSIONS`, `harness`, `opaque`, `harnessGain`, `harness7`, `reeducate`, `encrypt`, `decrypt`,
`verifyEnvelope`, `ITER`, `sha256`, `hmacSha256`, `pbkdf2Sha256`, `chachaBlock`, `chacha20`,
`poly1305`, `aeadEncrypt`, `aeadDecrypt`, and the types `Verdict`, `VerdictKind`,
`ProvenVerdict`, `UuidnaVerdict`, `Harnessed`, `Sealed`. Plus the file `package.json#version`
(read by the site's `greeting.ts`).

---

## 4. Tools to serve the public

To "serve the public" the package ships five delivery channels. ✓ = exists, ◑ = partial, ✗ = to build.

### 4.1 Library (ESM + types) — ✓

`import { toUuid } from '@uuidna/uuidna'`. Ships compiled `dist/` + `.d.ts`. **Add subpath
exports** so consumers can pull just the crypto or just the gate (tree-shaking, smaller edge
bundles):

```jsonc
"exports": {
  ".":         { "types": "./dist/index.d.ts",   "import": "./dist/index.js" },
  "./crypt":   { "types": "./dist/crypt.d.ts",   "import": "./dist/crypt.js" },
  "./gate":    { "types": "./dist/gate.d.ts",    "import": "./dist/gate.js" },
  "./merkle":  { "types": "./dist/merkle.d.ts",  "import": "./dist/merkle.js" },
  "./address": { "types": "./dist/address.d.ts", "import": "./dist/address.js" },
  "./package.json": "./package.json"
}
```

### 4.2 MCP server — ◑ (`mcp.mjs`, `bin: uuidna-mcp`)

JSON-RPC 2.0 over stdio, zero deps, calls the same sealed functions. **11 tools:**
`uuidna_address`, `uuidna_gate`, `uuidna_reeducate`, `uuidna_merkle_root`,
`uuidna_merkle_prove`, `uuidna_merkle_verify`, `uuidna_imprint`, `uuidna_read`, `uuidna_bill`,
`uuidna_encrypt`, `uuidna_decrypt`, `uuidna_verify_envelope`.
Install: `{ "command": "npx", "args": ["-y", "@uuidna/uuidna"] }`.
**Fixes required:** (a) `VERSION` is hardcoded `'6.4.7'` — derive from `package.json`;
(b) pin/declare the MCP `protocolVersion` and add a conformance test; (c) map thrown errors to
JSON-RPC error objects; (d) advertise `tools/list` from the `TOOLS` array (no drift).

### 4.3 CLI — ✗ (new, `bin: uuidna`)

A thin, agnostic CLI over the same functions (Node/Deno/Bun shebang). Minimum verbs:

```
uuidna address <text>                     # → content-address
uuidna gate <text|->                      # → {binary,hit}; exit 1 if drained
uuidna reeducate <text|->                 # → bounded text
uuidna imprint <text> / read <uuid...>    # reversible codec
uuidna merkle root <leaf...>              # order-free root
uuidna encrypt --pass <p> <text|->        # → Sealed JSON
uuidna decrypt --pass <p> <sealed.json>   # → plaintext
uuidna verify <sealed.json>               # envelope integrity
uuidna --version | --help                 # from package.json
```

Contract: reads stdin on `-`, writes JSON to stdout, human help to stderr, honest exit codes.

### 4.4 Browser / CDN bundle — ✗ (new)

A single self-contained ESM bundle for `<script type=module>` / unpkg / esm.sh / jsDelivr, plus
an optional minified IIFE exposing `globalThis.uuidna`. No external fetch, CSP-safe. Build with
`esbuild`/`rollup` (dev-only dep) → `dist/uuidna.min.js`, `dist/uuidna.esm.js`. Enables the
`site/` playground to run the real functions client-side.

### 4.5 Docs & playground — ◑ (`site/`, `README.md`)

`README.md` (Install/Use/MCP/Encryption/API/Provenance/Versioning/License) + `site/index.html`
+ `site/captain/message/`. **Complete:** an API reference generated from the `.d.ts` (typedoc,
dev-only), runnable examples per module, and a live playground wired to the §4.4 bundle. All doc
prose must pass `computes()` (§8 gate, self-applied).

---

## 5. Conformance & tests

Current: `test/smoke.test.mjs` (`node --test`), ~21 tests incl. a `777·` suite (7 dimensions ×
encrypt/read/tamper/isolation). Memory records a **hard cap of 21 tests** — additions must
consolidate, not inflate. Specify the conformance set:

1. **Crypto KATs (mandatory, cite the vector):**
   - SHA-256 — FIPS 180-4 examples + NIST CAVP short/long messages.
   - HMAC-SHA256 / PBKDF2-SHA256 — RFC 6234 / RFC 6070 (+ a reduced-iteration vector for speed).
   - ChaCha20 & Poly1305 & AEAD — **RFC 8439** §2.3.2, §2.5.2, §2.8.2 test vectors.
   Each KAT asserts byte-exact equality; a failure blocks release.
2. **Property/round-trip:** `imprint∘read = id`; `encrypt∘decrypt = id`; `merkleFold` order-
   invariance; `toUuid` context-freeness & determinism; wrong-key & tamper always throw.
3. **Gate corpus:** a labeled set of honest vs. overclaiming strings across all 7 locales +
   Glagolitic, asserting `computes()` binary — including the reprieve cases (bounded refusals,
   parity of negators, `SOLUTION` markers, `or not` idiom).
4. **Cross-runtime matrix (new):** run the suite on Node 18/20/22, Deno, Bun, and a headless
   browser (via the §4.4 bundle). Determinism means outputs must be identical across all.
5. **MCP conformance (new):** spin the stdio server, `initialize` → `tools/list` → call each of
   the 11 tools, assert schemas and results.
6. **Self-gate (new):** every shipped prose string (README, JSDoc first lines, tool/CLI help)
   passes `computes()`. This is the package eating its own dog food.

---

## 6. Versioning, release & provenance

**Resolve the version conflict first (D1).** Three numbers are live today:

| Source | Value |
|---|---|
| `package.json#version` | `0.1.1` |
| `mcp.mjs` `VERSION` const | `6.4.7` |
| consuming site (`v…`) | `7.5.7` |

Per project memory the **npm label is intentionally FROZEN at `0.1.1`** (captain's directive);
the content-address is the "true latest," and git tags are immutable provenance. Specify:

- **Single source of truth:** `package.json#version`. `mcp.mjs` and CLI read it — no hardcoded
  version anywhere (delete the `'6.4.7'` literal).
- **Frozen-label policy:** npm stays `0.1.1`; each release is gravity-signed and content-
  addressed; the site version (`7.x`) is the *site's* odometer, not the package's — document the
  distinction so they stop looking like a bug.
- **Provenance:** publish with npm provenance (`--provenance`), signed git tags (the repo's
  ruleset already requires verified signatures), SLSA attestation optional. `reserve.mjs` keeps
  the unpacked tarball byte-aligned to **an exact power of two** — the target is DERIVED as the smallest
  power of two that fits, so the discipline survives growth (a hardcoded 64 KiB held only while the content
  was smaller than it, and the CLI, bundles and generated reference pushed the base past it). Currently
  2^18 = 262 144 bytes. Verify: `npm run pack:check`, which is also a publish gate.
- **SemVer contract:** the §3.10 consumer surface defines "breaking." Removing/retyping any of
  those exports ⇒ major. Frozen-label means we express change via content-address + tag, not the
  npm minor — document this so SemVer expectations are explicit, not silently violated.

---

## 7. Security posture (honest)

State the model plainly; overclaiming here would fail the package's own gate.

- **Addresses are integrity, not secrecy.** `toUuid`/FNV-1a is public, keyless, reversible-to-
  collisions in principle. Never a MAC, never a password hash, never a secret.
- **Encryption strength = ChaCha20-Poly1305 + the passphrase's entropy.** Standard AEAD; a weak
  passphrase is the weak link (PBKDF2-SHA256 @ 600k mitigates, not eliminates).
- **Not constant-time.** Pure JS; timing side-channels are possible. Do not use for adversarial
  co-resident timing threat models without review.
- **Deterministic/convergent encryption reveals equality.** Same `(plaintext, passphrase)` →
  same envelope, so an observer learns when two ciphertexts hold identical plaintext. This is a
  deliberate trade for reproducibility/content-addressing — documented, not hidden. **D4 remedy:**
  the `randomized` mode (§3.8) hides equality via a per-message random salt+nonce; it is opt-in
  because it sacrifices reproducibility. Callers pick per threat model: convergent for content-
  addressable integrity, randomized for equality-hiding secrecy.
- **The honesty gate is a tripwire, not a proof.** It matches known bad shapes; it can be
  evaded and it can false-positive. Necessary, not sufficient.
- **Non-goals (the package makes none of these claims):** it is not unbreakable and not post-quantum;
  it gives no constant-time guarantee; and it settles no Millennium or physics question. The gate
  blocks each of these shapes in our own prose.

---

## 8. Completion checklist (ordered)

**C1** Add CI lint: no `node:*`/`process`/`Buffer` in `src/` (agnosticism guard).
**C2** Derive `mcp.mjs` `VERSION` from `package.json`; delete the `'6.4.7'` literal.
**C3** Add subpath `exports` (`./crypt`, `./gate`, `./merkle`, `./address`, `./package.json`).
**C4** Internal base64 fallback so `crypt` needs no `btoa`/`atob` global.
**C5** Build the CLI (`bin: uuidna`, §4.3) + `--help`/`--version`, stdin `-`, honest exit codes.
**C6** Add the browser/CDN bundle (§4.4): `dist/uuidna.esm.js`, `dist/uuidna.min.js` (IIFE).
**C7** Add RFC-cited crypto KATs (§5.1) as blocking release gates.
**C8** Add the cross-runtime test matrix (Node/Deno/Bun/browser) + MCP conformance test.
**C9** Self-gate all shipped prose (README, JSDoc, tool/CLI help) through `computes()`.
**C10** Generate the API reference from `.d.ts`; wire the `site/` playground to the C6 bundle.
**C11** Versioning (D1): make `package.json` the single source; delete the `6.4.7` literal;
document frozen-label (`0.1.1`) vs site odometer (`7.x`).
**C12** Publish with `--provenance` (needs `id-token: write`) + signed tag; `prepublishOnly` chains
build → `reserve` → `pack:check`, so the tarball is re-padded and asserted on an exact power of two at
publish time rather than left to whoever remembers.
**C13** Add the `randomized` encryption mode (D4): `encryptRandom` + injectable entropy, `Sealed`
`v:2` + `mode` tag, mode-agnostic `decrypt`/`verifyEnvelope`, KATs for both modes.
**C14** DRY CI (D5): one reusable workflow runs the single test suite across Node 18/20/22 +
Deno + Bun + headless browser + a Workers smoke; test vectors / gate corpus / tool list each
defined once and imported everywhere.

**Definition of done:** `npm run build && npm test` green on the full matrix; `npm pack`
unpacked = 65 536 bytes; every shipped string passes the gate; library + MCP + CLI + browser
bundle + docs all resolve from a clean install; §3.10 consumer surface unchanged (or a
deliberate major).

---

## 9. Decisions (resolved)

All five are settled; the spec above reflects them.

- **D1 — Version → FREEZE at `0.1.1`.** npm label stays frozen (captain's directive);
  `package.json` is the single source; `mcp.mjs`/CLI read it (delete the `6.4.7` literal); the
  site's `7.x` is a separate odometer, documented as such. (§6, C11)
- **D2 — License → `CC-BY-NC-ND-4.0` (REVISED).** First recorded here as CC-BY-NC-4.0. Corrected once
  the published Zenodo deposit (DOI 10.5281/zenodo.21819217) was found to carry **ND** while every file in
  the repo said otherwise — the published record is what the public relies on, so the repo was the side
  that was wrong. ND additionally withholds redistribution of modified versions: reading, verifying and
  recomputing stay free for non-commercial use. Prose promising "build upon" was corrected too, not only
  the licence label. (§7, §3.9)
- **D3 — Modules → ESM-only.** No CJS build; all first-class runtimes are ESM. Revisit only on a
  concrete `require()` need. (§2.4)
- **D4 — Encryption → ADD a randomized mode.** Convergent stays the default; `encryptRandom`
  adds equality-hiding secrecy with injectable, runtime-agnostic entropy. One shared AEAD path.
  (§3.8, §7, C13)
- **D5 — Runtimes → ALL FIVE, DRY.** Node ≥18, Deno, Bun, browsers (ES2020), edge/Workers are
  each first-class and release-blocking, delivered by one agnostic core + one parametrized test
  suite + one reusable CI workflow — maximum compatibility, no duplication. (§2.1, C14)

---

*Integrity, not truth. `0/7`. — spec grounded in `packages/uuidna/src/` at authoring time; treat
any divergence as a change to reconcile, not a discrepancy to ignore.*
