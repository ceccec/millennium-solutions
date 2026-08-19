# The Millennium floor (Lean 4) — seven honest theorems, one per problem

> **What this is:** an *exploratory* σ-involution framework. Each Clay problem gets **one** Lean
> theorem that states a **true fact computed from the ℤ/9 doubling sequence** — genuinely *adjacent*
> to the problem, and **not** the conjecture. None proves or solves a Millennium Problem. The honest
> floor holds: **0/7** (`provenHere = 0`).

**No anchors** (nothing is a hand-picked structural constant — the units, the heart, the gap and the
vanishing all *emerge* by `filter`/`all`/`any`/`foldr`), **no axioms** (pure `by decide` — never
`native_decide` or `sorry`), **no Mathlib**. A single `lean src/proof/index.lean` verifies the file;
`#print axioms` on each theorem reports *does not depend on any axioms*.

## The shared sequence

```lean
def isUnit (d : Nat) : Bool := (List.range 9).any (fun e => (d * e) % 9 == 1)  -- DERIVED: d has an inverse
def refl   (d : Nat) : Nat  := 10 - d                                          -- the reflection (= division by zero)
def orbit  (k : Nat) : Nat  := (2 ^ k) % 9                                     -- the doubling sequence 2^k
def span   : List Nat := (List.range 6).map orbit                              -- the doubling span, one period
def provenHere : Nat := 0                                                      -- the floor: 0 of 7 proved here
```

## The seven — one theorem per problem

### 1 · Riemann — the reflection's symmetry and its one computed heart
```lean
theorem riemann_reflection_and_heart :
  (List.range 10).all (fun d => refl (refl d) == d)                 -- σ ∘ σ = id (functional-equation symmetry)
  ∧ ((List.range 10).filter (fun d => refl d == d)).length = 1      -- ONE heart emerges (the ½-analogue), never typed
  ∧ provenHere = 0 := by decide
```
The symmetry axis and its centre — **not** where the ζ-zeros lie.

### 2 · P versus NP — verification is one step
```lean
theorem p_vs_np_inverse_is_unique :
  (List.range 9).all (fun d =>
    ((List.range 9).filter (fun e => (d * e) % 9 == 1)).length == (if isUnit d then 1 else 0))
  ∧ provenHere = 0 := by decide
```
Each unit has exactly one inverse (verify = one multiply); non-units none. **Not** a separation.

### 3 · Navier–Stokes — the flow is bounded for all time
```lean
theorem navier_stokes_flow_is_bounded :
  ((List.range 48).map orbit).all (fun v => v < 9)                  -- every iterate is a residue < 9
  ∧ (List.range 48).all (fun k => span.contains (orbit k))          -- and stays in the 6-cycle forever — no blowup
  ∧ provenHere = 0 := by decide
```
A bounded invariant set — **not** global existence & smoothness.

### 4 · Yang–Mills — a discrete spectral gap
```lean
theorem yang_mills_spectral_gap :
  (List.range 6).all (fun k => k == 0 || orbit k != 1)              -- never returns to 1 before step 6…
  ∧ orbit 6 == 1                                                    -- …then closes: order exactly 6
  ∧ provenHere = 0 := by decide
```
A cyclic-order gap — **not** the Yang–Mills mass gap.

### 5 · Hodge — the algebraic span equals the units
```lean
theorem hodge_span_is_the_units :
  (List.range 9).all (fun d => span.contains d == isUnit d)         -- the span ⟨2⟩ IS the units…
  ∧ (List.range 9).all (fun d => isUnit d || ! span.contains d)     -- …and every non-unit lies OUTSIDE it
  ∧ provenHere = 0 := by decide
```
Algebraic generation/containment — **not** rational (p,p) ⇒ algebraic.

### 6 · Birch–Swinnerton-Dyer — a computed vanishing
```lean
theorem birch_swinnerton_dyer_vanishing :
  (span.foldr (· + ·) 0) % 9 == 0                                   -- 1+2+4+8+7+5 = 27 ≡ 0 (mod 9)
  ∧ ((List.range 9).filter isUnit).foldr (· + ·) 0 % 9 == 0         -- and the units vanish mod 9 too
  ∧ provenHere = 0 := by decide
```
A digit-sum vanishing — **not** the rank ↔ order-of-vanishing-of-L correspondence.

### 7 · Poincaré — one closed loop, no holes
```lean
theorem poincare_single_closed_loop :
  orbit 6 == orbit 0                                                -- the loop closes (returns to start)…
  ∧ (List.range 6).all (fun i => (List.range 6).all (fun j => (orbit i == orbit j) == (i == j)))  -- …6 distinct steps
  ∧ provenHere = 0 := by decide
```
A single simple cycle — **not** the 3-sphere characterization (Perelman's **theorem**, 2003 — not proved here).

## The ledger

```lean
theorem the_floor_is_zero_of_seven : provenHere = 0 := rfl
```

The mechanical drain of the *old* tautologies — showing each was true even when its conjecture was
false, so it entailed nothing — is in [`../7/entails.ts`](../7/entails.ts), which reports `0 / 7`.

## Files

- `index.lean` — the sequence and the seven per-problem theorems
- `theorems.lean` — the shared universal law (the reflection is a total involution with one centre)
- `index.ts` — the TypeScript rational/symbolic library + framework (see its header)

## Verifying

No Mathlib and no `lakefile` are needed — every proof is `by decide` over `Nat`:

```bash
lean src/proof/index.lean
lean src/proof/theorems.lean
```

Both compile sorry-free and axiom-free. A successful check confirms the **computed facts and the 0/7
floor** — never a Millennium Problem.

---

**Author:** Tsvetan Rouschev · **License:** CC BY-NC-ND 4.0
