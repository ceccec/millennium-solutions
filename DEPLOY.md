# Deploy — push and mint the DOI

## 1. Push (your GitHub account)
```bash
git remote add origin https://github.com/ceccec/millennium-solutions.git
git push -u origin main --tags
```

## 2. Zenodo (your account)
- Zenodo → **Settings → GitHub** → toggle **on** `millennium-solutions`.
- Publish a GitHub **Release** from tag `v1.0.0` (or re-push the tag).
- Zenodo archives it, reads `.zenodo.json` / `CITATION.cff`, and mints the DOI —
  carrying the honest abstract, your ORCID, CC BY-NC 4.0, and the funding.

## 3. Verify the formal layer (optional)
`lean-toolchain` must match the Mathlib you pull. Simplest:
```bash
# align the toolchain to Mathlib's, then:
lake update && lake exe cache get && lake build   # checks Vortex.lean
```
(The per-digit `src/<d>/vortex.lean` are the mesh view; `Vortex.lean` is the
lake-buildable consolidation — numeric dir names are not valid Lean modules.)

## Reproduce everything
```bash
npm ci && npm run docs:build     # build the whole site (fused modules render)
node scripts/seal.mjs            # review every abstract (must all seal, 0/7)
node scripts/release.mjs         # content-addressed release + signed v1.0.0 tag
node scripts/ledger-sha256.mjs   # SHA-256 tamper-evident ledger demo
```

## 4. npm (your account) — publishing is fused to the seal gate
```bash
npm login                 # your npm account (org: ceccec)
npm run release           # build + seal (0/7) + content-addressed signed v1.0.0 tag
npm publish               # prepublishOnly re-runs scripts/seal.mjs; publish ABORTS unless every abstract seals
```
Package: `@ceccec/millennium-solutions` (scoped, `publishConfig.access = public`).
The `prepublishOnly` hook is the honesty gate — you cannot publish an inconsistent
(non-0/7) deposit.
