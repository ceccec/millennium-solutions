---
title: Proof of Concept
---

# Proof of Concept — the ℤ/9 vortex framework

> The per-digit Lean files (`src/<d>/vortex.lean`, `src/5/reflection.lean`, `src/7/rosetta.lean`,
> `src/8/nucleus/*.lean`) and `Vortex.lean` were removed on 2026-09-20: they imported Mathlib, no gate
> compiled them, and Mathlib was never fetched here. What they held is decided in `src/proof`, which the
> kernel checks on every run — see [Proofs](/proofs). References below now name that tree.


A recomputable proof of concept: every result below derives from code in the
digit-folder mesh under `src/`. Each `.ts` runs with `node`; each `.lean`
is written for `lake` + Mathlib (`decide`/`norm_num`). Results are stated as
computed; interpretation is the reader's.

## Digit-folder mesh

| digit | files | what sticks | bond `10−d` |
|---|---|---|---|
| 1 | `src/proof` | unity, self-inverse | 9 |
| 2 | `src/proof`, `frequency-scales.ts` | generator ⟨2⟩; octave = ×2 | 8 |
| 3 | `src/proof` | `3²=0` nilpotent, no inverse | 7 |
| 4 | `src/proof` | `4⁻¹=7` | 6 |
| 5 | `src/proof`, `reflection.{lean,mjs}` | reflection center; `5⁻¹=2`; self-seal | 5 |
| 6 | `src/proof` | `6²=0` nilpotent, no inverse | 4 |
| 7 | `src/proof`, `rosetta-clay.ts` | `7⁻¹=4`; the rosette ↔ the seven Clay problems | 3 |
| 8 | `src/proof`, `merkaba/…`, `nucleus/…` | `8·8=1`; merkaba/cube; nucleus | 2 |
| 9 | `src/proof` | `9≡0` void; digit-sum 27; 432 | 1 |

## Computed results (as run)

**ℤ/9 structure** (`src/proof` (the checked tree))
- nilradical: `3² ≡ 6² ≡ 0 (mod 9)`; `3,6,9` have no inverse.
- units `(ℤ/9)* = {1,2,4,5,7,8}`: `2⁻¹=5`, `4⁻¹=7`, `1,8` self-inverse.
- doubling circuit `⟨2⟩ = [1,2,4,8,7,5]`, order 6; never touches the axis.

**Reflection** (`src/5/reflection.*`)
- seq2 `= 0 9 8 6 2 3 5 7 4 1 0 9` is the exact `10−d` mirror of seq1.
- `\ ↔ /` stroke inversion: **8/11**; non-inverting = the void seam `0\1, 9/0, 0\1`.
- `10−d` is an involution; `5` is its unique fixed digit.

**432 / harmonics** (`src/proof`, `src/proof`)
- `432 = 2⁴·3³ = 16·27`; doubling digit-sum `= 27 = 3³`.
- self-sealing fraction product `(1/2)(1/2)(1/2)(8/7)(7/5)(5/3)(1/2)(2/3)(9) = 1`.

**Geometry** (`src/8/merkaba/merkaba-flower.html`, live artifact)
- cube down its `(1,1,1)` axis → regular hexagon (6 outer at equal radius, 60° apart; 2 on-axis) → Seed → Flower → Fruit (13) → Metatron.

**Magnetic field** (`src/8/nucleus/…`, Biot–Savart)
- counter-rotating merkaba coils: central axis `|B| ≈ 10⁻¹⁷ µT` (null); co-rotating: `0.189 µT` (max). scale check `μ₀I/2r = 2.09 µT`.

**Nuclear shell model** (`src/8/nucleus/shell-model-magic.ts`, `magic.lean`)
- cumulative capacities `2j+1` = `2, 8, 20, 28, 50, 82, 126`; total 126.
- plain oscillator = `2,8,20,40,70,112`; spin-orbit gives 28,50,82,126.
- `10·2^k` ladder (10,20,40,80…) ∩ magic = `{20}` only.

**Frequency scales** (`src/2/frequency-scales.ts`)
- `f = E/h`: 432 Hz → `4.3×10²`; nuclear shell → `7×10²⁰`; proton → `2.3×10²³`.
- proton/432 ratio ≈ `10²¹`. bound-nucleon de Broglie λ ≈ 5.22 fm.

**Proton mass** (`src/8/nucleus/proton-mass-fit.ts`, `proton-mass.lean`)
- vortex fit `108·17 = 1836` (exact); measured `m_p/m_e = 1836.15267343`.
- `1836 ≠ 1836.1527`; the same `1836` fits arbitrary nearby targets.


## Lean coverage
Per-digit theorems in `src/proof` (the checked tree), plus `src/proof/theorems.lean`,
`src/proof/nucleus.lean`, `src/proof/nucleus.lean`. All are decidable
(`decide`) or numeric (`norm_num`). Not compiled here (no toolchain in repo).

## Reproduce
```bash
node src/5/reflection.ts
node src/8/nucleus/shell-model-magic.ts
node src/8/nucleus/proton-mass-fit.ts
node src/2/frequency-scales.ts
# Lean: node scripts/lean.ts   (no lake, no Mathlib)
```

## Status (computed, not interpreted)
- ℤ/9 arithmetic, reflections, 432 factorization, geometry, self-seal: exact, reproducible.
- shell-model magic numbers: reproduced exactly (2,8,20,28,50,82,126).
- proton `m_p/m_e`: measured `1836.1527`; vortex integer fit `1836`.
Companion docs: `SEQUENCE-DECODE.md` (ℤ/9 structure), `PHYSICS-SCALES.md`
(shell model, frequency scales).
