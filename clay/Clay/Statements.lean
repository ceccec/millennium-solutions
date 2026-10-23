import Mathlib.NumberTheory.LSeries.RiemannZeta
import Mathlib.Computability.TMComputable
import Mathlib.Computability.Encoding
import Mathlib.Analysis.Calculus.FDeriv.Basic
import Mathlib.Analysis.InnerProductSpace.PiL2
import Mathlib.MeasureTheory.Measure.Lebesgue.Basic
import Mathlib.MeasureTheory.Function.L2Space
import Mathlib.AlgebraicTopology.FundamentalGroupoid.SimplyConnected
import Mathlib.Topology.Homeomorph
import Mathlib.Geometry.Manifold.ChartedSpace

/-!
# Clay Millennium Problems — statements only

Each problem is a `def … : Prop`. None is proved here, and no `sorry` or `axiom` is used.
A `def` states the question; it does not give the answer.

Formalized with Mathlib: Riemann Hypothesis, P vs NP, Navier–Stokes, Poincaré.
Not formalized yet: Yang–Mills mass gap, Hodge conjecture, Birch–Swinnerton-Dyer
(Mathlib lacks the objects they quantify over: quantum gauge theory, Hodge theory on
projective varieties, and L-functions of elliptic curves with Mordell–Weil rank).
-/

open Complex

namespace Clay

/-! ## 1 · Riemann Hypothesis -/

/-- Every zero of ζ other than the trivial zeros −2, −4, … has real part 1/2.
The pole at s = 1 is excluded, since Mathlib's `riemannZeta 1` is a junk value. -/
def RiemannHypothesis : Prop :=
  ∀ s : ℂ, s ≠ 1 → riemannZeta s = 0 → (∃ n : ℕ, s = -(2 * ((n : ℂ) + 1))) ∨ s.re = 1 / 2

/-! ## 2 · P versus NP -/

/-- A language is a set of finite binary strings. -/
abbrev Language := Set (List Bool)

/-- Binary strings encoded as themselves: one symbol per bit, so the input length is the
list length. Polynomial time is measured against that length. -/
def binStringEncoding : Computability.FinEncoding (List Bool) where
  Γ := Bool
  encode := id
  decode := some
  decode_encode := fun _ => rfl
  ΓFin := Bool.fintype

/-- Membership in P: some function `f` computes L's indicator on a Turing machine in
polynomial time (Mathlib's `TM2ComputableInPolyTime`). -/
def InP (L : Language) : Prop :=
  ∃ f : List Bool → Bool, (∀ x, f x = true ↔ x ∈ L) ∧
    Nonempty (Turing.TM2ComputableInPolyTime binStringEncoding Computability.finEncodingBoolBool f)

/-- The certificate pair `(x, w)` as one binary string: unary length of `x`, a separator, then
`x` and `w`. The encoding is polynomial-time, so verifying `pairEnc x w` in polynomial time is
the same as verifying the pair. -/
def pairEnc (x w : List Bool) : List Bool :=
  List.replicate x.length true ++ false :: (x ++ w)

/-- Membership in NP: a polynomial-time verifier `V` and polynomial bounds on the certificate. -/
def InNP (L : Language) : Prop :=
  ∃ V : List Bool → Bool,
    Nonempty (Turing.TM2ComputableInPolyTime binStringEncoding Computability.finEncodingBoolBool V) ∧
    ∃ k c : ℕ, ∀ x : List Bool,
      x ∈ L ↔ ∃ w : List Bool, w.length ≤ c * x.length ^ k + c ∧ V (pairEnc x w) = true

/-- The Clay question: is every language verifiable in polynomial time also decidable in
polynomial time? -/
def PEqualsNP : Prop :=
  ∀ L : Language, InNP L → InP L

/-! ## 3 · Navier–Stokes existence and smoothness in ℝ³ -/

/-- Euclidean three-space. -/
abbrev R3 := EuclideanSpace ℝ (Fin 3)

/-- The i-th standard basis vector of ℝ³. -/
noncomputable def e (i : Fin 3) : R3 := EuclideanSpace.single i 1

/-- Spatial gradient of a scalar field at a point. -/
noncomputable def grad (f : R3 → ℝ) (x : R3) : R3 :=
  ∑ i : Fin 3, fderiv ℝ f x (e i) • e i

/-- Divergence of a vector field at a point. -/
noncomputable def div (u : R3 → R3) (x : R3) : ℝ :=
  ∑ i : Fin 3, fderiv ℝ u x (e i) i

/-- Componentwise Laplacian of a vector field at a point. -/
noncomputable def lap (u : R3 → R3) (x : R3) : R3 :=
  ∑ i : Fin 3, fderiv ℝ (fun y => fderiv ℝ u y (e i)) x (e i)

/-- The advection term (u · ∇)u at a point. -/
noncomputable def advect (u : R3 → R3) (x : R3) : R3 :=
  fderiv ℝ u x (u x)

/-- `u` and `p` solve incompressible Navier–Stokes with viscosity `ν` (density 1) for `t > 0`.
The time derivative is taken at fixed `x`. -/
def IsNSSolution (ν : ℝ) (u : R3 → ℝ → R3) (p : R3 → ℝ → ℝ) : Prop :=
  ∀ x : R3, ∀ t : ℝ, 0 < t →
    deriv (fun s => u x s) t + advect (fun y => u y t) x
        = ν • lap (fun y => u y t) x - grad (fun y => p y t) x
      ∧ div (fun y => u y t) x = 0

/-- Admissible initial data: smooth, divergence-free, and of finite energy. -/
def IsAdmissibleData (u0 : R3 → R3) : Prop :=
  ContDiff ℝ ⊤ u0 ∧ (∀ x, div u0 x = 0) ∧
    MeasureTheory.Integrable (fun x => ‖u0 x‖ ^ 2) MeasureTheory.volume

/-- The Clay question: for every viscosity `ν > 0` and admissible initial data, there is a
smooth solution on ℝ³ × [0, ∞) with finite energy at each time and `u(·, 0) = u0`. -/
def NavierStokesSmoothGlobalExistence : Prop :=
  ∀ ν : ℝ, 0 < ν → ∀ u0 : R3 → R3, IsAdmissibleData u0 →
    ∃ (u : R3 → ℝ → R3) (p : R3 → ℝ → ℝ),
      ContDiffOn ℝ ⊤ (fun q : R3 × ℝ => u q.1 q.2) (Set.univ ×ˢ Set.Ici 0) ∧
      ContDiffOn ℝ ⊤ (fun q : R3 × ℝ => p q.1 q.2) (Set.univ ×ˢ Set.Ici 0) ∧
      (∀ x, u x 0 = u0 x) ∧
      IsNSSolution ν u p ∧
      ∀ t : ℝ, 0 ≤ t → MeasureTheory.Integrable (fun x => ‖u x t‖ ^ 2) MeasureTheory.volume

/-! ## 4 · Poincaré conjecture (three-dimensional, topological)

Stated as in Mathlib's `Geometry/Manifold/PoincareConjecture.lean`, which records the same
statement as `proof_wanted`. Smooth and topological forms agree by Moise's theorem. -/

/-- Every closed, simply connected 3-manifold is homeomorphic to the 3-sphere. -/
def PoincareConjecture : Prop :=
  ∀ (M : Type) [TopologicalSpace M] [T2Space M] [ChartedSpace R3 M] [CompactSpace M]
    [SimplyConnectedSpace M],
    Nonempty (M ≃ₜ Metric.sphere (0 : EuclideanSpace ℝ (Fin 4)) 1)

end Clay
