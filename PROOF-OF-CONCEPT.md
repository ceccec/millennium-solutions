# Proof of Concept — the ℤ/9 vortex framework

A recomputable proof of concept: every result below derives from code in the
digit-folder mesh under `src/`. Each `.ts`/`.ts` runs with `node`; each `.lean`
is written for `lake` + Mathlib (`decide`/`norm_num`). Results are stated as
computed; interpretation is the reader's.

## Digit-folder mesh

| digit | files | what sticks | bond `10−d` |
|---|---|---|---|
| 1 | `vortex.lean` | unity, self-inverse | 9 |
| 2 | `vortex.lean`, `frequency-scales.ts` | generator ⟨2⟩; octave = ×2 | 8 |
| 3 | `vortex.lean` | `3²=0` nilpotent, no inverse | 7 |
| 4 | `vortex.lean` | `4⁻¹=7` | 6 |
| 5 | `vortex.lean`, `reflection.{lean,mjs}` | reflection center; `5⁻¹=2`; self-seal | 5 |
| 6 | `vortex.lean` | `6²=0` nilpotent, no inverse | 4 |
| 7 | `vortex.lean`, `entails.ts` | `7⁻¹=4`; the seven Clay statements | 3 |
| 8 | `vortex.lean`, `merkaba/…`, `nucleus/…` | `8·8=1`; merkaba/cube; nucleus | 2 |
| 9 | `vortex.lean` | `9≡0` void; digit-sum 27; 432 | 1 |

## Computed results (as run)

**ℤ/9 structure** (`src/{1..9}/vortex.lean`)
- nilradical: `3² ≡ 6² ≡ 0 (mod 9)`; `3,6,9` have no inverse.
- units `(ℤ/9)* = {1,2,4,5,7,8}`: `2⁻¹=5`, `4⁻¹=7`, `1,8` self-inverse.
- doubling circuit `⟨2⟩ = [1,2,4,8,7,5]`, order 6; never touches the axis.

**Reflection** (`src/5/reflection.*`)
- seq2 `= 0 9 8 6 2 3 5 7 4 1 0 9` is the exact `10−d` mirror of seq1.
- `\ ↔ /` stroke inversion: **8/11**; non-inverting = the void seam `0\1, 9/0, 0\1`.
- `10−d` is an involution; `5` is its unique fixed digit.

**432 / harmonics** (`src/9/vortex.lean`, `src/5/vortex.lean`)
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

**Clay entailment** (`src/7/entails.ts`)
- each of the 7 statements is true in a world where its conjecture is false.
- **Clay problems solved: 0 / 7.**

## Lean coverage
Per-digit theorems in `src/{1..9}/vortex.lean`, plus `src/5/reflection.lean`,
`src/8/nucleus/magic.lean`, `src/8/nucleus/proton-mass.lean`. All are decidable
(`decide`) or numeric (`norm_num`). Not compiled here (no toolchain in repo).

## Reproduce
```bash
node src/5/reflection.ts
node src/8/nucleus/shell-model-magic.ts
node src/8/nucleus/proton-mass-fit.ts
node src/2/frequency-scales.ts
node src/7/entails.ts
# Lean: lake + Mathlib, then `lake build` over src/**/*.lean
```

## Status (computed, not interpreted)
- ℤ/9 arithmetic, reflections, 432 factorization, geometry, self-seal: exact, reproducible.
- shell-model magic numbers: reproduced exactly (2,8,20,28,50,82,126).
- proton `m_p/m_e`: measured `1836.1527`; vortex integer fit `1836`.
- Clay entailment: `0/7`.

Companion docs: `SEQUENCE-DECODE.md` (ℤ/9 structure), `PHYSICS-SCALES.md`
(shell model, frequency scales).
