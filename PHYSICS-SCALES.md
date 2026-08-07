# Physics scales: shell-model magic numbers, matter-as-waves, and where A432 sits

Companion to `SEQUENCE-DECODE.md`. Every value here is computed; reproduce with
`node shell-model-magic.ts` and `node frequency-scales.ts`. The animation of the
merkaba → Flower → Fruit → Metatron construction is `merkaba-flower.html`.

## 1. The nuclear magic numbers come from the shell model

Filling nucleons into 3D-harmonic-oscillator levels split by spin-orbit coupling
(level capacity `2j+1`), the cumulative count lands exactly on every magic number:

```
1s½ →2★   1p³⁄₂→6   1p½→8★   1d⁵⁄₂→14  2s½→16  1d³⁄₂→20★
1f⁷⁄₂→28★ (spin-orbit intruder)
2p³⁄₂→32  1f⁵⁄₂→38  2p½→40   1g⁹⁄₂→50★ (intruder)
1g⁷⁄₂→58  2d⁵⁄₂→64  2d³⁄₂→68  3s½→70   1h¹¹⁄₂→82★ (intruder)
1h⁹⁄₂→92  2f⁷⁄₂→100 2f⁵⁄₂→106 3p³⁄₂→110 3p½→112  1i¹³⁄₂→126★ (intruder)
```

`2, 8, 20, 28, 50, 82, 126` — all seven. Two ingredients: the oscillator (gives
2, 8, 20) and spin-orbit coupling (the high-`j` intruders `1f⁷⁄₂, 1g⁹⁄₂, 1h¹¹⁄₂,
1i¹³⁄₂` producing 28, 50, 82, 126). Goeppert-Mayer & Jensen, Nobel Prize 1963.

- Plain harmonic oscillator (no spin-orbit): `2, 8, 20, 40, 70, 112`.
- Observed (with spin-orbit): `2, 8, 20, 28, 50, 82, 126`.
- They agree only for `2, 8, 20`; spin-orbit then replaces `40, 70, 112`.

## 2. The 5-arithmetic ladder vs the magic numbers

`5+5 = 10`, and `10·2^k = 10, 20, 40, 80, 160, …` is the ×2 doubling / octave
ladder (the same `⟨2⟩` circuit as in `SEQUENCE-DECODE.md`, seeded at 10).
(Arithmetic note: `2·2·2·2·(5+5) = 160`, not 80; `80 = 2·2·2·(5+5)`.)

- ladder ∩ oscillator closures `{2,8,20,40,70,112}` = `{20, 40}`.
- ladder ∩ observed magic `{2,8,20,28,50,82,126}` = `{20}`.
- The ladder misses `2, 8, 28, 50, 82, 126` and includes non-magic `10, 80, 160`.

So the ladder brushes the oscillator closures at 20 and 40 by sharing small
factors of 2; it does not reproduce the magic-number sequence, which requires
spin-orbit coupling. Coincidence, not derivation.

## 3. Matter is wave phenomena — and the waves have scales

Bound matter is standing waves (orbitals, nuclear shells are de Broglie
standing waves; a bound nucleon's wavelength ≈ 5 fm fits a few-fm nucleus).
Particles are field excitations (QFT); ~99% of a proton's mass is gluon-field
energy, not quark rest mass. Cancellation builds structure (nodes; the merkaba
field-null on the 3-6-9 axis in `MERKABA-FIELD` is a real destructive-interference
null).

Following the wave, each system's frequency is `f = E/h`:

| wave that forms… | energy | frequency |
|---|---|---|
| a 432 Hz tone | 1.79×10⁻¹² eV | 4.3×10² Hz |
| visible light | ~2 eV | 4.8×10¹⁴ Hz |
| a chemical bond | ~10 eV | 2.4×10¹⁵ Hz |
| a nuclear shell | ~3 MeV | 7×10²⁰ Hz |
| a proton | 938 MeV | 2.3×10²³ Hz |

The waves that form a nucleus ring at `~10²⁰–10²³ Hz`. Ratios to 432 Hz:
nuclear shell ≈ `10¹⁸`; proton ≈ `10²¹`.

## 4. Scope / boundary

- The shell-model derivation (§1) is exact, standard physics and is complete —
  the magic numbers need no external energy source.
- `E = hf` and `c = λf` assign each system its own frequency; frequency is a
  universal quantity but frequencies are not interchangeable. 432 Hz is the
  acoustic scale (~10² Hz); nuclear structure is ~10²⁰–10²³ Hz — a gap of
  ~18–21 orders of magnitude, with no coupling mechanism between an audio pitch
  and the strong-force spin-orbit term (whose origin is the operator `l·s`, not a
  frequency).
- The ℤ/9 vortex arithmetic and the merkaba/cube geometry (`SEQUENCE-DECODE.md`)
  are exact; the A432 tuning is real acoustics (`A432-RESEARCH` in the
  `ceccec.github.io` repo). None of it bears on the Clay problems; the entailment
  test remains 0/7 (`entails.ts`).
