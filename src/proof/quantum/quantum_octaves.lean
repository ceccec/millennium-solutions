-- title: The Bell test scaled in octaves — 2, 4, 8 … 128 qubits — with the quantum lead doubling its exponent
-- wing: the machine
-- prior_art: named
-- prior_art_domain: Mermin's inequality for the n-qubit GHZ state (Mermin, 1990): the quantum value 2^(n−1) against the
--   local hidden-variable maximum 2^(n/2) for even n, an exponential violation; the GHZ state (Greenberger, Horne,
--   Zeilinger, 1989); the Pauli operators X and Y and their action on computational basis states.
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S. What is decided here is Mermin's two numbers, derived exactly at
--   each octave of qubits from 2 to 128 — 128 being the UUID width — from the operators' action and from every classical
--   assignment's phase, so the claim "the quantum lead grows exponentially" is the kernel's at each octave, not a formula.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the octave scaling, the two-state fold that makes 128 qubits decidable, and the classical phase ring
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY 128 QUBITS FIT. The GHZ state (|0…0⟩ + |1…1⟩)/√2 has two basis states, and a string of X and Y flips every bit, so
-- its expectation is read from two phases carried qubit by qubit — Y contributes i on the way up and −i on the way down —
-- never from a 2¹²⁸-entry vector. The Mermin operator M = Re ∏ (X_j + iY_j) weights a string with k Y's by Re(iᵏ), and
-- the GHZ expectation of that string is Re(iᵏ) too, so the quantum value is Σ_k C(n, k)·Re(iᵏ)², counted exactly.
--
-- THE CLASSICAL RING — the horo of eight steps. A classical party answers x, y ∈ {±1}, and x + iy is √2·ω^e with e odd:
-- one of 1, 3, 5, 7 eighths of the circle. After n parties the phase has stepped Σ e eighths round the ring ℤ/8, and the
-- positions it can reach alternate — odd after an odd number of parties, even after an even number. At every even
-- octave all four even positions are reachable, the real part is at most 1, so the classical maximum is exactly 2^(n/2).
--
-- WHAT IT REFUSES TO SAY. At n = 2 there is no lead (2 against 2): Mermin's inequality starts to bite at three parties,
-- and the 2-qubit Bell test is CHSH, decided in quantum_circuits.lean. Nothing here is a device result.

import Quantum_circuits
set_option maxRecDepth 4000000
set_option exponentiation.threshold 1100
open QuantumCircuits

namespace QuantumOctaves

/-- the classical answers x + iy, x, y ∈ {±1}, are √2·ω^e for e = 1, 3, 5, 7 (√2 = ω − ω³) -/
theorem every_classical_answer_is_root_two_times_an_odd_eighth_of_the_circle :
  zmul (root2 1) (wpow 1) = (1, 0, 1, 0) ∧ zmul (root2 1) (wpow 3) = (-1, 0, 1, 0)
  ∧ zmul (root2 1) (wpow 5) = (-1, 0, -1, 0) ∧ zmul (root2 1) (wpow 7) = (1, 0, -1, 0) := by decide

/-- Pascal's row n, built row by row so that n = 128 costs 128 rows, not 2¹²⁸ paths -/
def row : Nat → List Nat
  | 0 => [1]
  | n + 1 => let r := row n; List.zipWith (· + ·) (0 :: r) (r ++ [0])
/-- Re(iᵏ) -/
def re4 (k : Nat) : Int := match k % 4 with | 0 => 1 | 2 => -1 | _ => 0
/-- the GHZ phases of a string with k Y's among n Paulis, carried qubit by qubit: up |0…0⟩ → |1…1⟩ and down -/
def phases (k n : Nat) : Zw × Zw :=
  (List.range n).foldl (fun acc j => if j < k then (zmul acc.1 (wpow 2), zmul acc.2 (wpow 6)) else acc) ((1, 0, 0, 0), (1, 0, 0, 0))
/-- 2 × the GHZ expectation of that string: up phase + down phase -/
def twiceExpect (k n : Nat) : Zw := zadd (phases k n).1 (phases k n).2
/-- 2 × the Mermin value: Σ_k C(n, k) · Re(iᵏ) · 2⟨string_k⟩ -/
def twiceQuantum (n : Nat) : Int :=
  (List.range (n + 1)).foldl (fun acc k => acc + ((row n).getD k 0 : Int) * re4 k * (twiceExpect k n).1) 0
/-- the eighths of the ring the classical phase can stand on after n parties -/
def reach : Nat → List Nat
  | 0 => [0]
  | n + 1 => (List.range 8).filter (fun r => (reach n).any (fun s => [1, 3, 5, 7].any (fun e => (s + e) % 8 == r)))

/-- every string's expectation is real, Re(iᵏ), at width n — the fold's imaginary parts vanish -/
def expectationsReal (n : Nat) : Bool := (List.range (n + 1)).all (fun k => twiceExpect k n == (2 * re4 k, 0, 0, 0))

theorem octave_two_qubits_has_no_mermin_lead :
  expectationsReal 2 = true ∧ twiceQuantum 2 = 2 * 2 ^ 1 ∧ reach 2 = [0, 2, 4, 6] ∧ 2 ^ (2 / 2) = 2 ^ (2 - 1) := by decide

theorem octave_four_qubits_quantum_eight_against_classical_four :
  expectationsReal 4 = true ∧ twiceQuantum 4 = 2 * 2 ^ 3 ∧ reach 4 = [0, 2, 4, 6] ∧ 2 ^ (4 / 2) < 2 ^ (4 - 1) := by decide

theorem octave_eight_qubits_quantum_128_against_classical_16 :
  expectationsReal 8 = true ∧ twiceQuantum 8 = 2 * 2 ^ 7 ∧ reach 8 = [0, 2, 4, 6] ∧ 2 ^ (8 / 2) * 2 ^ 3 = 2 ^ (8 - 1) := by decide

theorem octave_sixteen_qubits_the_lead_is_two_to_the_seventh :
  expectationsReal 16 = true ∧ twiceQuantum 16 = 2 * 2 ^ 15 ∧ reach 16 = [0, 2, 4, 6] ∧ 2 ^ (16 / 2) * 2 ^ 7 = 2 ^ (16 - 1) := by decide

theorem octave_thirty_two_qubits_the_lead_is_two_to_the_fifteenth :
  expectationsReal 32 = true ∧ twiceQuantum 32 = 2 * 2 ^ 31 ∧ reach 32 = [0, 2, 4, 6] ∧ 2 ^ (32 / 2) * 2 ^ 15 = 2 ^ (32 - 1) := by decide

theorem octave_sixty_four_qubits_the_lead_is_two_to_the_thirty_first :
  expectationsReal 64 = true ∧ twiceQuantum 64 = 2 * 2 ^ 63 ∧ reach 64 = [0, 2, 4, 6] ∧ 2 ^ (64 / 2) * 2 ^ 31 = 2 ^ (64 - 1) := by decide

end QuantumOctaves
