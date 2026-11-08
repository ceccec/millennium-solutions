# Proofs

## Fused compute (TypeScript)

All results recompute at page-load from the digit-folder mesh — see
[Computed results](/compute), driven by the `.ts` modules under `src/`.

## Formal layer (Lean)

Every theorem lives in `src/proof/*.lean` and is checked by `node scripts/lean.ts` on every run: no Mathlib,
no axioms, no `sorry`, no `native_decide`. Each one that closes by exhaustion is sealed into the append-only
ledger, so a statement on a page and a statement in the kernel cannot drift apart without a gate saying so.

This section used to list a different set: `Vortex.lean` and a per-digit `src/<d>/vortex.lean` file, fifteen
in all. Every one of them began `import Mathlib`, `scripts/lean.ts` reads only `src/proof`, and the
repository carries no `lake-manifest.json` and no `.lake` — so no gate compiled them and they had never been
built here at all. The note under them said no toolchain was checked in, which was true and easy to read
past beneath a heading that says Proofs.

They were removed on 2026-09-20. Almost everything they held is decided already in `src/proof`, axiom-free:
3² ≡ 6² ≡ 0, the inverse pairs, the doubling circuit and its order six, the ten's complement and its single
fixed digit, the (ℤ/7)* orbit, 432 = 2⁴·3³. That was two derivations of one fact, and the unchecked one was
the second. Three facts existed nowhere else and were brought under the kernel first, because deleting the
only copy of something is a loss and not a purge — they are in
[`src/proof/nucleus.lean`](https://github.com/ceccec/millennium-solutions/blob/main/src/proof/nucleus.lean):
the shell-model closure sums, the self-seal product cleared of its denominators, and the 108·17 = 1836 fit
together with the refusal that it is not the measured ratio.

## Clay entailment

Clay is the main lead — the seven Millennium problems are the subject the rest of the deposit is developed
around. Below, the author's claim as he deposited it on Zenodo (3 August 2026), rendered verbatim and in his
name, and beside each problem the one theorem in `src/proof/index.lean` that stands with it, the statement the
Lean kernel decided and over how many cases, the **bound** — what it establishes and, in the same sentence,
what it does not — and the ledger receipt. Nothing on this surface is typed; the widget reads the sealed
sources on every build.

<ClayLeads />

The same involution runs across the subjects — `src/proof/bridge.lean` decides which cross-subject families of
`src/entangle` reduce, mod 9, to orbits of the affine maps `src/proof/group.lean` settles, with one family kept
as the control. It is cross-verified against external corpora the uuid programs address: the CERN open-data
record space (`npm run cern` — which counts the corpus by content-address and records where a flattering total
once agreed with the API by accident) and the NIST post-quantum floor (the ISO 128-bit level `qpu_crypto.lean`
decides a 122-bit register sits 67 bits below). Run the whole ledger live on [the trial](/verify), or read the
[cryptography](/cryptography) surface for the σ-reflection that is the shared instrument.

See also the [Proof of Concept](/PROOF-OF-CONCEPT) index.
