-- title: The 124-qubit Mermin sum — the UUID minus one hex digit — as eight UUID particles
-- wing: the machine
-- prior_art: named
-- prior_art_domain: Mermin's inequality for the n-qubit GHZ state (Mermin, 1990; values as restated in arXiv:0905.0151
--   §2, Eq. 5): quantum 2^(n−1), local hidden-variable maximum 2^(n/2) for even n.
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S. 124 = 128 − 4 is the UUID's width without its version hex
--   digit. Its Mermin sum over the 125 Pauli-string weights was first computed by src/quantum/hardware.ts; here it is a
--   coin — eight particles of sixteen weights (the last holds 112 … 124), each its own theorem and ledger key, and
--   quantum_uuid_cluster.lean recombines them.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the eight-particle split of the 124-qubit Mermin sum
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0

import Quantum_octaves
set_option maxRecDepth 4000000
set_option exponentiation.threshold 1100
open QuantumCircuits QuantumOctaves

namespace QuantumOctave124

def inParticle (b k : Nat) : Bool := k / 16 == b || (b == 7 && k ≥ 112)
def particleReal (b : Nat) : Bool :=
  ((List.range 125).filter (inParticle b)).all (fun k => twiceExpect k 124 == (2 * re4 k, 0, 0, 0))
def particleSum (b : Nat) : Int :=
  ((List.range 125).filter (inParticle b)).foldl (fun acc k => acc + ((row 124).getD k 0 : Int) * re4 k * (twiceExpect k 124).1) 0

theorem particle_zero_of_the_124_qubit_sum : particleReal 0 = true ∧ particleSum 0 = 2207731770981467816 := by decide
theorem particle_one_of_the_124_qubit_sum : particleReal 1 = true ∧ particleSum 1 = 115248474140745261396647375336 := by decide
theorem particle_two_of_the_124_qubit_sum : particleReal 2 = true ∧ particleSum 2 = 70087461568327544489265647434286536 := by decide
theorem particle_three_of_the_124_qubit_sum : particleReal 3 = true ∧ particleSum 3 = 12084539867274399785808019555594845576 := by decide
theorem particle_four_of_the_124_qubit_sum : particleReal 4 = true ∧ particleSum 4 = 9091273897550055524364275883821099256 := by decide
theorem particle_five_of_the_124_qubit_sum : particleReal 5 = true ∧ particleSum 5 = 21746580107261245372128218160439736 := by decide
theorem particle_six_of_the_124_qubit_sum : particleReal 6 = true ∧ particleSum 6 = 10810135723442052600830956696 := by decide
theorem particle_seven_of_the_124_qubit_sum : particleReal 7 = true ∧ particleSum 7 = 32177891015042264 := by decide

end QuantumOctave124
