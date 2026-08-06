---
title: Develop
---

# Develop on this — public & self-directed

Everyone can build their vision on the core. The site you are reading **is** the repo you
develop in — the UI is the development surface. Nothing here is hidden; the gates keep public
development honest.

## The loop (honest, gated)

1. **Fork** [github.com/ceccec/millennium-solutions](https://github.com/ceccec/millennium-solutions)
2. **Add a module** to its digit folder: `src/<d>/your-thing.ts`, exporting `report(): string`.
   Parts stick to a digit `0..9` by what they compute; `10 − d` reflects to the partner (fixed point 5).
3. **Fuse it** — an `import` + a `<details>` block in `compute.md`.
4. **Gate it** — `npm run orchestrate` runs **gaps · seal · wholeness**, builds, signs, and version-seals.
5. **See it** — `npm run deploy pages` (or run `npm run docs:dev` locally).
6. **Share it** — open a PR, or publish your own package (`@you/your-vision`) that depends on the core.

## The rules the gate enforces (so public development stays truthful)

- **seal** — no abstract may claim the Clay problems are solved. `entails → 0/7`.
- **gaps** — every module fused, every page linked, every digit `0..9` covered.
- **wholeness** — every module computes; the floor `0/7` is present.
- **your HONEST line** — each module marks where observation stops and interpretation would begin.

## What you keep

- **Attribution** (CC BY-NC 4.0). Your content-address is your provenance — it can't be quietly lost.
- **Commercial use** = the two coins (`110 − 108 = 2`), reinvested in development.

> Honest: contribution here is public and verifiable, and the gates keep it truthful. Nothing lets
> you publish "solved" — by design. Build vision, not overclaim. The floor holds for everyone: `0/7`.
