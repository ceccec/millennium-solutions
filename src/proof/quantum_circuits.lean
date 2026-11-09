-- title: The CHSH circuits sent to a quantum device give exactly 2√2, decided over the cyclotomic integers
-- wing: the machine
-- prior_art: named
-- prior_art_domain: the CHSH inequality (Clauser, Horne, Shimony, Holt, 1969) and Tsirelson's bound 2√2 (1980); the
--   ring of cyclotomic integers ℤ[ω], ω = e^{iπ/4}, ω⁴ = −1, and √2 = ω − ω³ in it; the native gate set rz, sx, cz of
--   superconducting processors (IBM Quantum's published basis) and the H = RZ·SX·RZ, CX = H·CZ·H identities.
-- prior_art_note: NONE OF THE PHYSICS OR THE ALGEBRA IS THIS DEPOSIT'S. What is decided here is only that the gate list
--   src/quantum/hardware.ts `chshGates` sends — transcribed below gate for gate — prepares a Bell pair and gives the four
--   CHSH correlations ±√2/2, so S = 2√2 for an ideal device, in exact arithmetic with no float anywhere.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the transcription of the sent gate list into ℤ[ω] and its two refuted controls
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY ℤ[ω] AND NOT FLOATS. Every angle the circuits use is a multiple of π/4, so with each rz written as diag(1, ω^k)
-- (it differs from the device's rz by a global phase, which no probability can see) and sx as ½[[1+i, 1−i], [1−i, 1+i]]
-- with i = ω², every amplitude is an element of ℤ[ω] over a power of two. Probabilities are then elements of ℤ[√2]
-- over 2¹⁴, and E = ±√2/2 is an equality of integer quadruples the kernel decides.
--
-- WHAT IT REFUSES TO SAY. This decides what an IDEAL device would return for these exact gates. It decides nothing
-- about any real device: that is the provider's job record, judged by quantum_hardware.lean's integer rule.

namespace QuantumCircuits

/-- a + bω + cω² + dω³ with ω⁴ = −1 -/
abbrev Zw := Int × Int × Int × Int

def zadd (x y : Zw) : Zw := (x.1 + y.1, x.2.1 + y.2.1, x.2.2.1 + y.2.2.1, x.2.2.2 + y.2.2.2)
def zneg (x : Zw) : Zw := (-x.1, -x.2.1, -x.2.2.1, -x.2.2.2)
def zmul (x y : Zw) : Zw :=
  let a := x.1; let b := x.2.1; let c := x.2.2.1; let d := x.2.2.2
  let e := y.1; let f := y.2.1; let g := y.2.2.1; let h := y.2.2.2
  (a * e - b * h - c * g - d * f, a * f + b * e - c * h - d * g, a * g + b * f + c * e - d * h, a * h + b * g + c * f + d * e)
/-- complex conjugate: ω ↦ ω⁷ = −ω³ -/
def zconj (x : Zw) : Zw := (x.1, -x.2.2.2, -x.2.2.1, -x.2.1)
def norm (x : Zw) : Zw := zmul x (zconj x)
def wpow (k : Nat) : Zw :=
  match k % 8 with
  | 0 => (1, 0, 0, 0) | 1 => (0, 1, 0, 0) | 2 => (0, 0, 1, 0) | 3 => (0, 0, 0, 1)
  | 4 => (-1, 0, 0, 0) | 5 => (0, -1, 0, 0) | 6 => (0, 0, -1, 0) | _ => (0, 0, 0, -1)
def P : Zw := (1, 0, 1, 0)   -- 1 + i
def M : Zw := (1, 0, -1, 0)  -- 1 − i
/-- √2 = ω − ω³ -/
def root2 (n : Int) : Zw := (0, n, 0, -n)

inductive Gate | rz (q : Nat) (k : Nat) | sx (q : Nat) | cz

/-- amplitudes of |b₁b₀⟩ at index b₀ + 2b₁; qubit 0 is Alice, qubit 1 is Bob. sx doubles the denominator. -/
abbrev State := Zw × Zw × Zw × Zw

def step (s : State) : Gate → State
  | .rz 0 k => (s.1, zmul (wpow k) s.2.1, s.2.2.1, zmul (wpow k) s.2.2.2)
  | .rz _ k => (s.1, s.2.1, zmul (wpow k) s.2.2.1, zmul (wpow k) s.2.2.2)
  | .sx 0 => (zadd (zmul P s.1) (zmul M s.2.1), zadd (zmul M s.1) (zmul P s.2.1),
              zadd (zmul P s.2.2.1) (zmul M s.2.2.2), zadd (zmul M s.2.2.1) (zmul P s.2.2.2))
  | .sx _ => (zadd (zmul P s.1) (zmul M s.2.2.1), zadd (zmul P s.2.1) (zmul M s.2.2.2),
              zadd (zmul M s.1) (zmul P s.2.2.1), zadd (zmul M s.2.1) (zmul P s.2.2.2))
  | .cz => (s.1, s.2.1, s.2.2.1, zneg s.2.2.2)

def run (gs : List Gate) : State := gs.foldl step ((1, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0))

/-- hardware.ts `chshGates`, gate for gate: H on both (RZ(π/2)·SX·RZ(π/2)), CZ, H on Bob — a Bell pair — then
    RY(−θ) on each side as RZ(−π), SX, RZ(π + θ), SX. θ_A ∈ {0, π/2} is k ∈ {4, 6}; θ_B ∈ {π/4, −π/4} is k ∈ {5, 3}. -/
def bell : List Gate := [.rz 0 2, .sx 0, .rz 0 2, .rz 1 2, .sx 1, .rz 1 2, .cz, .rz 1 2, .sx 1, .rz 1 2]
def chsh (ka kb : Nat) : List Gate := bell ++ [.rz 0 4, .sx 0, .rz 0 ka, .sx 0, .rz 1 4, .sx 1, .rz 1 kb, .sx 1]

/-- E's numerator over 2¹⁴: p(00) + p(11) − p(10) − p(01), index 1 being a = 1, b = 0 -/
def corr (gs : List Gate) : Zw := let s := run gs; zadd (zadd (norm s.1) (norm s.2.2.2)) (zneg (zadd (norm s.2.1) (norm s.2.2.1)))
def total (gs : List Gate) : Zw := let s := run gs; zadd (zadd (norm s.1) (norm s.2.1)) (zadd (norm s.2.2.1) (norm s.2.2.2))

/-- THE PAIR: after the preparation the state is the Bell pair — no weight on 01 or 10, equal amplitudes on 00 and 11,
    and those two carry the whole norm (2⁶ over three sx). -/
theorem the_sent_preparation_is_a_bell_pair :
  (run bell).2.1 = (0, 0, 0, 0) ∧ (run bell).2.2.1 = (0, 0, 0, 0) ∧ (run bell).1 = (run bell).2.2.2
  ∧ zadd (norm (run bell).1) (norm (run bell).2.2.2) = (64, 0, 0, 0) := by decide

theorem alice_zero_bob_plus_quarter_correlates_root_two_over_two :
  total (chsh 4 5) = (16384, 0, 0, 0) ∧ corr (chsh 4 5) = root2 8192 := by decide

theorem alice_zero_bob_minus_quarter_correlates_root_two_over_two :
  total (chsh 4 3) = (16384, 0, 0, 0) ∧ corr (chsh 4 3) = root2 8192 := by decide

theorem alice_half_bob_plus_quarter_correlates_root_two_over_two :
  total (chsh 6 5) = (16384, 0, 0, 0) ∧ corr (chsh 6 5) = root2 8192 := by decide

theorem alice_half_bob_minus_quarter_anticorrelates_root_two_over_two :
  total (chsh 6 3) = (16384, 0, 0, 0) ∧ corr (chsh 6 3) = root2 (-8192) := by decide

/-- TSIRELSON, EXACTLY: E₀ + E₁ + E₂ − E₃ = 4 · √2/2 = 2√2 for the ideal device on the sent gates. -/
theorem the_sent_circuits_reach_s_two_root_two :
  zadd (zadd (corr (chsh 4 5)) (corr (chsh 4 3))) (zadd (corr (chsh 6 5)) (zneg (corr (chsh 6 3)))) = root2 32768 := by decide

/-- REFUTED CONTROL: Bob at angle 0 instead of π/4 gives E = 1, not √2/2 — the theorems above see the angle. -/
theorem bob_at_angle_zero_correlates_fully_not_root_two_over_two :
  corr (chsh 4 4) = (16384, 0, 0, 0) ∧ corr (chsh 4 4) ≠ root2 8192 := by decide

/-- REFUTED CONTROL: without the CZ there is no entanglement and the first setting's correlation is 0. -/
theorem without_the_entangler_the_correlation_vanishes :
  corr ((bell.filter (fun g => match g with | .cz => false | _ => true)) ++ [.rz 0 4, .sx 0, .rz 0 4, .sx 0, .rz 1 4, .sx 1, .rz 1 5, .sx 1]) = (0, 0, 0, 0) := by decide

end QuantumCircuits
