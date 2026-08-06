# Millennium Solutions — the ℤ/9 vortex framework

A free, open, **recomputable** framework: an exact ℤ/9 / ℤ/7 algebra with a
**classical simulator of quantum algorithms**, documented in VitePress
(TypeScript, formalized in Lean 4). Every result recomputes from `src/`.

**What it is (honest scope):** a unified, verifiable algebraic + geometric study —
division-by-zero as a change of domain, reflections and folds, the Pliska rosette
`(ℤ/7)* ≅ C₆ ≅ (ℤ/9)*`, a `7 = 6 + 1` correspondence with the Clay problems, and
physics observations (shell-model magic numbers, frequency scales). A mechanical
entailment test reports **0 / 7**: the framework *reflects/maps* the Millennium
Problems, it does **not** solve them. It is a proof of concept and a classical
simulator — not a quantum computer and not a resolution of the conjectures.

## Run it
```bash
npm install
npm run docs:dev        # local site
npm run docs:build      # build every page (all fused compute modules render)
```
Pages: **Research · Proof of Concept · Realisations · Compute · Decode**.
Fused TypeScript modules recompute live on `/compute`; per-digit Lean 4 theorems
(`decide` / `norm_num`) form the formal layer (`lake build` to check).

## License
**Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).**
Free for everyone for non-commercial use, with attribution to Tsvetan Rouschev.
Commercial use — "the two coins", `110 − 108 = −χ(genus-2) = 2` — requires the
author's permission: ceccec@psg.bg. See [LICENSE](./LICENSE).

## Support development
This knowledge is free. If it helps you and you'd like to support development
(non-obligatory): **https://revolut.me/ceccec**

---
*Author: Tsvetan Rouschev. Personal interpretations (harmony, the Pliska rosette,
the trinity matrix as mind-knowing-itself) are recorded as perspective in
`RESEARCH.md §12`, distinct from the computed results.*
