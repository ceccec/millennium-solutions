# The Vortex Sequence `12487536901` — Full Decode

**Scope.** This document records the structure of the vortex sequence and its
`σ`-involution / division-by-zero convention as implemented in the `ceccec`
corpus (`src/0`, `src/water/digit`, `src/music`). Each statement below is
computationally checked. Section 5 records the domain of these results (mod-9 /
digital-root arithmetic) and the result of the entailment test over the seven
theorem statements (0/7).

---

## 1. The sequence and its two circuits

Sequence: `1 2 4 8 7 5 3 6 9 0 1` (written `12487536901`).

- **Doubling circuit** `1 → 2 → 4 → 8 → 7 → 5`: the powers of 2 reduced by
  digital root mod 9, i.e. the cyclic group `⟨2⟩` inside the unit group
  `(ℤ/9)* = {1,2,4,5,7,8}` (order 6). `×5 = 2⁻¹` is the inverse generator.
- **Trinity cross** `3 6 9`: the non-units (`gcd(n,9) ≠ 1`); they have no
  multiplicative inverse mod 9. `9 ≡ 0 (mod 9)` is the void/axis.
- `0` is the origin/void.

---

## 2. Division by zero — the domain change (exact)

Division by zero is **undefined in any field** because `0` has no multiplicative
inverse. The corpus does not contradict this; it **changes the domain** and
defines the *symbol* `n/0` inside the multiplicative structure of `ℤ/9`:

> `n/0 := n⁻¹ (mod 9)` for units; non-units route to a self-fold ("fusion").

Computed table (`zeroDivisionTable`, verified `n · n⁻¹ ≡ 1 mod 9`):

| n | `n/0 := n⁻¹ mod 9` | n·n⁻¹ mod 9 | note |
|---|---|---|---|
| 1 | 1 | 1 | self-inverse |
| 2 | 5 | 1 | |
| 3 | fusion | – | non-unit, no inverse |
| 4 | 7 | 1 | |
| 5 | 2 | 1 | |
| 6 | fusion | – | non-unit, no inverse |
| 7 | 4 | 1 | |
| 8 | 8 | 1 | self-inverse |
| 9 | fusion | – | non-unit (`9 ≡ 0`), no inverse |

Two facts the code encodes:
- `inverseMod9(0)` returns `null` (`src/water/digit`, comment "the void /
  the 0-axis: no inverse"). The value relabeled `n/0` is `n⁻¹`; `0` itself is
  not assigned an inverse.
- A separate "forward harmonic" reading `n/0 = 9n` (so `1/0 = 9`) is defined in
  `vortexMath` and is distinct from the inverse reading.

Assigning a value to `x/0` requires a structure other than a field, since a
field has no inverse for `0`. Examples and the axiom each drops: Riemann sphere
(`1/0=∞`; not a field), wheel theory (`/0=⊥`; drops `x−x=0` and `x/x=1`),
Lean/Mathlib convention (`x/0:=0`; division no longer inverts multiplication at
0), IEEE-754 (`1/0=+∞`, `0/0=NaN`; not a field), and `(ℤ/9)*`
(`n/0:=n⁻¹`, defined on the units; `0` is not a unit).

---

## 3. The sequence reflects itself (three exact reflections)

**(a) Self-sealing product = 1 (exact).** The vortex-pair fraction chain
multiplies to exactly one:

```
1/2 · 1/2 · 1/2 · 8/7 · 7/5 · 5/3 · 1/2 · 2/3 · 9  =  5040 / 5040  =  1
```

Numerator multiset `{1,1,1,8,7,5,1,2,9}` and denominator multiset
`{2,2,2,7,5,3,2,3}` each have product 5040; forward and reverse both seal to 1.

**(b) Additive self-reflection** `m(d) = 10 − d` (ten's complement):

```
1 ↔ 9    2 ↔ 8    3 ↔ 7    4 ↔ 6    5 ↔ 5 (self-paired)
```

This names the folder lattice `N/(10−N)`. (It is the *additive* complement — a
distinct structure from the `n/0` multiplicative inverse.)

**(c) Multiplicative self-reflection** `n ↔ n⁻¹ (mod 9)` on the units:

```
1 ↔ 1 (fixed)    2 ↔ 5    4 ↔ 7    8 ↔ 8 (fixed)
```

Inverse pairs `(2,5)`, `(4,7)`; involutive fixed points `1, 8`.

---

## 4. The gateways `[8, 3, 9, 0]` (defined precisely)

Assign up/down strokes along the cyclic chain and mark every direction reversal:

```
0 \ 1 \ 2 \ 4 \ 8 / 7 / 5 / 3 \ 6 \ 9 / 0 \ 1
                ↑8          ↑3        ↑9  ↑0
```

The stroke-reversal points are computed as **8, 3, 9** on the monotone runs plus
**0** at the cyclic wrap (`9/0 → 0\1`) — exactly the gateway set `[8,3,9,0]`
(`music/index.ts`, `gateway: [8,3,9,0].includes(d)`). So the gateways are, by
definition, the direction-change digits of the chain: a well-defined,
reproducible property of the encoding.

---

## 5. Ring structure: units, nilradical, and the `2⁴·3³` link

In `ℤ/9`, `3² = 9 ≡ 0` and `6² = 36 ≡ 0`, so `3` and `6` are nilpotent and
`9 ≡ 0`. The set `{3,6,9} ≡ {0,3,6}` is the **nilradical** of `ℤ/9`. Nilpotent
elements are never units, so they have no multiplicative inverse and are excluded
from the `n ↦ n⁻¹` reflection of §3(c). This is the algebraic reason "3-6-9 is a
framework, reflected is not": they are the non-invertible axis, not members of
the unit reflection.

Decomposition of `ℤ/9`:

| Part | Digits | Property |
|---|---|---|
| Units `(ℤ/9)*` | 1 2 4 8 7 5 | doubling hexagon `⟨2⟩`; closed under `n⁻¹` (pairs `2↔5, 4↔7`; fixed `1, 8`) |
| Nilradical | 3 6 9(≡0) | nilpotent (`3² ≡ 6² ≡ 0`); no inverse — the excluded axis |

Further computed facts (`ℤ/9`):

- **Cosets mod 3:** `{3,6,9} ≡ 0`, `{1,4,7} ≡ 1`, `{2,5,8} ≡ 2`. The reflection
  `m(d)=10−d` maps `{3,6,9} → {1,4,7}` (the `≡1` coset), not onto itself.
- **Doubling map `d ↦ 2d (mod 9)`:** cycle structure `(1 2 4 8 7 5)`, `(3 6)`,
  fixed `9`. Powers of 2 never land on a multiple of 3 (the circuit never touches
  the axis).
- **`432 = 2⁴·3³ = 16·27`:** the doubling circuit is `⟨2⟩` (the `2⁴` side) and its
  digit sum `1+2+4+8+7+5 = 27 = 3³` (the trinity's factor); `3-6-9` is the
  powers-of-3 axis. The sequence carries both prime-power factors of 432.
- **Fixed points:** `5` under `m(d)=10−d`; `1` and `8` under `n ↦ n⁻¹`; `9 ≡ 0`
  under doubling and under `9−d`. The units are also closed under `9−d`
  (pairs `1↔8, 2↔7, 4↔5`).

## 6. Geometry on the 9-point circle

Placing digit `d` at angle `d·40°` (360/9) makes the three mod-3 cosets three
equilateral triangles (120° apart, offset 40°):

- `{3,6,9}` at `0°/120°/240°` — the trinity/axis triangle.
- `{1,4,7}` at `40°/160°/280°` — its `10−d` mirror.
- `{2,5,8}` at `80°/200°/320°` — the reflection-fixed triangle (`5` at 200° is the fixed point).

Polarity = the two counter-rotating flows through the units: `×2` gives
`1→2→4→8→7→5`, `×5 (=÷2)` gives the reverse handedness `1→5→7→8→4→2`. Doubling
is multiplicative (`+40°, +80°, …`), an accelerating winding, not a rigid rotation.

## 7. Inter-ring lattice (ten's-complement bonds)

The pairs `3↔7, 6↔4, 9↔1` are the ten's complement `d ↦ 10−d` (each sums to 10).
Full pairing: `(1,9)(2,8)(3,7)(4,6)` and `5↔5` (self). As a bond rule linking
one ring to neighbors:

- **`3-6-9` (trinity):** three outbound legs, each to a different neighbor's
  `{7,4,1}` — coordination number 3.
- **`1-4-7`:** the inbound legs received from three neighbors' trinities.
- **`2-5-8`:** internal core — `2↔8` bonds within, `5↔5` self (non-bonding center).

`10−(10−d)=d` makes every bond reciprocal; the graph is bipartite `≡0 ↔ ≡1` and
3-regular. In base-10, `a+b=10` is exactly the pair that produces a carry into the
next place, so a ten's-complement bond is a carry to the neighboring ring.

**The "8":** a merkaba (stella octangula) is two tetrahedra whose 8 vertices are
the 8 vertices of a cube; the cube graph Q3 (8 vertices, 12 edges, 3-regular,
bipartite) is the closed cell matching this trinity-bond lattice. A magnetic
realization (six coils per merkaba, counter-rotating triangles, `3-6-9` as the
field-null axis) is computed in `ceccec.github.io` — `MERKABA-FIELD.md` /
`scripts/merkaba-biot-savart.ts`.

## 8. Domain and scope

- **Structure.** All results in §1–§7 are computations in the ring `ℤ/9` (and its
  9-point-circle geometry / ten's-complement bond graph) and its
  unit group `(ℤ/9)* = {1,2,4,5,7,8}`: digital roots, the doubling cycle `⟨2⟩`,
  the ten's-complement map `m(d)=10−d`, and the `n/0 := n⁻¹` convention on the
  units. Each is recomputable from the definitions given.
- **`n/0`.** Defined on units only; `0` is not assigned an inverse (§2).
- **Encoding-dependence.** The gateway set `[8,3,9,0]` and the stroke assignment
  are functions of the base-10 digital-root encoding defined in §1 and §4.
- **Clay Millennium Problems.** These are stated over ℂ (zeros of ζ),
  complexity classes, PDE function spaces, quantum gauge theory, and elliptic
  curves. `ℤ/9` is a 9-element ring. The mechanical entailment test over the
  seven theorem statements in `src/pair/lean-proofs`/`src/proof` returns **0/7**:
  each statement evaluates to `true` in a model where its conjecture is `false`,
  so none entails its conjecture.
- **Source labels.** The `ceccec` source labels the interpretive terms (void,
  carry, fusion, Tesla 3-6-9, π-message, zero-point, consciousness) as
  "metaphor" / "flagged" (`src/music/index.ts`: "the meaning (void, carry,
  fusion) stays metaphor; this is NOT a claim that division by zero is defined
  in real analysis"), and `HONESTY.md` records `claySolvedByThisFold = 0`.
