-- title: The 128-qubit octave, split into eight UUID particles — the Mermin lead 2⁶³ at the UUID width
-- wing: the machine
-- prior_art: named
-- prior_art_domain: Mermin's inequality for the n-qubit GHZ state (Mermin, 1990; values as restated in arXiv:0905.0151
--   §2, Eq. 5): quantum 2^(n−1), local hidden-variable maximum 2^(n/2) for even n.
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S. quantum_octaves.lean decides the octaves 2 … 64 whole. At 128
--   qubits the same sum, over the 129 Pauli-string weights k, does not fit one theorem's default budget, so it is split
--   into eight particles of sixteen weights each — each its own theorem, its own ledger key, its own UUID receipt — and
--   the octave is their sum, rewritten from the eight sealed values rather than recomputed.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the eight-particle split of the 128-qubit Mermin sum and its recombination
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY EIGHT PARTICLES. Particle b holds the weights k with ⌊k/16⌋ = b (the last one also k = 128). Each checks that its
-- strings' GHZ expectations are real, Re(iᵏ), and sums its share of Σ C(128, k)·Re(iᵏ)·2⟨string_k⟩. Every particle
-- stands alone within the kernel's default budget, and this file stands apart from the other quantum files, so
-- scripts/lean.ts checks it in a lane of its own beside them, on the machine's cores. Nothing here is a device result.

import Quantum_octaves
set_option maxRecDepth 4000000
set_option exponentiation.threshold 1100
open QuantumCircuits QuantumOctaves

namespace QuantumOctave128

def inParticle (b k : Nat) : Bool := k / 16 == b || (b == 7 && k == 128)
def particleReal (b : Nat) : Bool :=
  ((List.range 129).filter (inParticle b)).all (fun k => twiceExpect k 128 == (2 * re4 k, 0, 0, 0))
def particleSum (b : Nat) : Int :=
  ((List.range 129).filter (inParticle b)).foldl (fun acc k => acc + ((row 128).getD k 0 : Int) * re4 k * (twiceExpect k 128).1) 0

theorem particle_zero_of_the_128_qubit_octave :
  particleReal 0 = true ∧ particleSum 0 = 3525990486864069858 := by decide
theorem particle_one_of_the_128_qubit_octave :
  particleReal 1 = true ∧ particleSum 1 = 337654250015596702913742461840 := by decide
theorem particle_two_of_the_128_qubit_octave :
  particleReal 2 = true ∧ particleSum 2 = 411324807959075400680218172572805400 := by decide
theorem particle_three_of_the_128_qubit_octave :
  particleReal 3 = true ∧ particleSum 3 = 145778712272927823445748804366324216880 := by decide
theorem particle_four_of_the_128_qubit_octave :
  particleReal 4 = true ∧ particleSum 4 = 192812936693211996284838821959307547180 := by decide
theorem particle_five_of_the_128_qubit_octave :
  particleReal 5 = true ∧ particleSum 5 = 1279389515917225289300042767401030000 := by decide
theorem particle_six_of_the_128_qubit_octave :
  particleReal 6 = true ∧ particleSum 6 = 3293268092833471993876167655640 := by decide
theorem particle_seven_of_the_128_qubit_octave :
  particleReal 7 = true ∧ particleSum 7 = 190212032889388424658 := by decide

/-- the eight particles cover every weight 0 … 128 exactly once -/
def covered : Bool := (List.range 129).all (fun k => ((List.range 8).filter (fun b => inParticle b k)).length == 1)

/-- THE UUID WIDTH: the eight particles cover all 129 weights once, sum to 2·2¹²⁷ — the GHZ state's Mermin value 2¹²⁷ —
    while every classical phase stands on an even eighth of the ring, capping the classical value at 2⁶⁴: a lead of 2⁶³.
    The sum is rewritten from the eight sealed particles, not recomputed. -/
theorem octave_one_twenty_eight_qubits_the_uuid_width_leads_by_two_to_the_sixty_third :
  covered = true
  ∧ particleSum 0 + particleSum 1 + particleSum 2 + particleSum 3 + particleSum 4 + particleSum 5 + particleSum 6
      + particleSum 7 = 2 * 2 ^ 127
  ∧ reach 128 = [0, 2, 4, 6] ∧ 2 ^ (128 / 2) * 2 ^ 63 = 2 ^ (128 - 1) := by
  refine ⟨by decide, ?_, by decide, by decide⟩
  rw [particle_zero_of_the_128_qubit_octave.2, particle_one_of_the_128_qubit_octave.2,
    particle_two_of_the_128_qubit_octave.2, particle_three_of_the_128_qubit_octave.2,
    particle_four_of_the_128_qubit_octave.2, particle_five_of_the_128_qubit_octave.2,
    particle_six_of_the_128_qubit_octave.2, particle_seven_of_the_128_qubit_octave.2]
  decide

end QuantumOctave128
