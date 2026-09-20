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


See also the [Proof of Concept](/PROOF-OF-CONCEPT) index.
