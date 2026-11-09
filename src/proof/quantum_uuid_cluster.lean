-- title: 124 qubits from the UUID — the Mermin lead 2⁶¹, the odd bound, and the 124-qubit cluster state, as coins
-- wing: the machine
-- prior_art: named
-- prior_art_domain: RFC 9562's UUID layout (a 4-bit version field — one hex digit — and a 2-bit variant field);
--   Mermin's inequality and its odd-n bound 2^((n−1)/2) (arXiv:0905.0151 §2, Eq. 5); the cluster state and its
--   stabilizers K_j = Z_{j−1} X_j Z_{j+1} (Briegel, Raussendorf, 2001); Pauli conjugation by CZ, X_a ↦ X_a Z_b, and the
--   stabilizer tableau (Gottesman–Knill; Aaronson, Gottesman, 2004).
-- prior_art_note: NONE OF THE PHYSICS IS THIS DEPOSIT'S. Every number here was first computed by hand or by
--   src/quantum/hardware.ts this session — 124 = 128 − one hex digit, the 124-qubit Mermin lead, the odd-n bound at
--   3, 5, 7, 9, the 124-qubit cluster's stabilizers — and in this deposit a fact is a coin or it is nothing, so each
--   is sealed. The tableau is Nat bit masks, which the kernel computes natively, so 124 qubits is 124 · 123 CZ steps.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the UUID-width reading, the bit-mask tableau and its two controls
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT IT REFUSES TO SAY. A stabilizer state is exactly what a classical computer describes in polynomial time; that
-- is why 124 qubits fit in this file, and why nothing here is a quantum device or its output.

import Quantum_octave_124
set_option maxRecDepth 4000000
set_option exponentiation.threshold 1100
open QuantumCircuits QuantumOctaves QuantumOctave124

namespace QuantumUuidCluster

/-- THE 124-QUBIT LEAD. One hex digit is 4 bits, so the UUID's 128 bits less its version digit are 124 (less the 2 variant
    bits too, 122). On those 124 the eight particles sum to 2·2¹²³ — Mermin's GHZ value 2¹²³ — while the classical phase
    stands only on even eighths of the ring, capping it at 2⁶²: a lead of 2⁶¹. Rewritten from the sealed particles. -/
theorem the_124_qubit_ghz_state_leads_every_classical_assignment_by_two_to_the_sixty_first :
  (2 ^ 4 = 16 ∧ 128 - 4 = 124 ∧ 128 - 4 - 2 = 122)
  ∧ particleSum 0 + particleSum 1 + particleSum 2 + particleSum 3 + particleSum 4 + particleSum 5 + particleSum 6
      + particleSum 7 = 2 * 2 ^ 123
  ∧ reach 124 = [0, 2, 4, 6] ∧ 2 ^ (124 / 2) * 2 ^ 61 = 2 ^ (124 - 1) := by
  refine ⟨by decide, ?_, by decide, by decide⟩
  rw [particle_zero_of_the_124_qubit_sum.2, particle_one_of_the_124_qubit_sum.2, particle_two_of_the_124_qubit_sum.2,
    particle_three_of_the_124_qubit_sum.2, particle_four_of_the_124_qubit_sum.2, particle_five_of_the_124_qubit_sum.2,
    particle_six_of_the_124_qubit_sum.2, particle_seven_of_the_124_qubit_sum.2]
  decide

/-- THE ODD BOUND: at 3, 5, 7 and 9 qubits the classical phase stands only on odd eighths, so its real part is at most
    √2/2 and the classical maximum is 2^((n−1)/2), against the GHZ value 2^(n−1) — the odd case of Mermin's Eq. 5. -/
theorem at_odd_widths_the_classical_phase_stands_on_odd_eighths_and_the_bound_is_two_to_the_half_of_n_minus_one :
  [3, 5, 7, 9].all (fun n => expectationsReal n && twiceQuantum n == 2 * 2 ^ (n - 1) && reach n == [1, 3, 5, 7]) = true := by decide

-- ── THE CLUSTER, AS BIT MASKS: a Pauli is (x, z, sign) with x, z ∈ ℕ as 124-bit masks ───────────────────────────────

def bit (m a : Nat) : Nat := m / 2 ^ a % 2
/-- flip bit a of m, in plain arithmetic (Nat.xor's definition would bring propext into a decide proof) -/
def flip (m a : Nat) : Nat := if bit m a == 1 then m - 2 ^ a else m + 2 ^ a
/-- conjugation by CZ(a, b): z_a ^= x_b, z_b ^= x_a, sign ^= x_a ∧ x_b ∧ (z_a ⊕ z_b) -/
def cz (a b : Nat) (p : Nat × Nat × Bool) : Nat × Nat × Bool :=
  let x := p.1; let z := p.2.1
  let z1 := if bit x b == 1 then flip z a else z
  (x, (if bit x a == 1 then flip z1 b else z1), p.2.2 != (bit x a == 1 && bit x b == 1 && bit z a != bit z b))
def chain (n : Nat) (p : Nat × Nat × Bool) : Nat × Nat × Bool := (List.range (n - 1)).foldl (fun q a => cz a (a + 1) q) p
def gen (n j : Nat) : Nat × Nat × Bool := chain n (2 ^ j, 0, false)
def want (n j : Nat) : Nat × Nat × Bool := (2 ^ j, (if j > 0 then 2 ^ (j - 1) else 0) + (if j + 1 < n then 2 ^ (j + 1) else 0), false)
/-- the qubits K_i acts on: i − 1, i, i + 1, inside the chain -/
def support (n i : Nat) : List Nat := (if i > 0 then [i - 1] else []) ++ [i] ++ (if i + 1 < n then [i + 1] else [])
/-- K_i's X and Z bit at qubit k, as the Z·X·Z pattern says they are -/
def xAt (i k : Nat) : Nat := if k == i then 1 else 0
def zAt (i k : Nat) : Nat := if k + 1 == i || k == i + 1 then 1 else 0
/-- the symplectic product of K_i and K_j, summed over K_i's support (it is the identity elsewhere), is even -/
def commutes (n i j : Nat) : Bool :=
  ((support n i).foldl (fun acc k => acc + xAt i k * zAt j k + zAt i k * xAt j k) 0) % 2 == 0

/-- every one of the 124 generators X_j, carried through the whole CZ chain, becomes Z_{j−1} X_j Z_{j+1} with sign + -/
theorem every_generator_of_the_124_qubit_cluster_is_z_x_z_on_its_neighbours :
  (List.range 124).all (fun j => gen 124 j == want 124 j) = true := by decide

/-- generator i's masks carry exactly the Z·X·Z pattern at every one of the 124 qubits -/
def patterned (i : Nat) : Bool := (List.range 124).all (fun k => bit (want 124 i).1 k == xAt i k && bit (want 124 i).2.1 k == zAt i k)

/-- PARTICLE ONE of the pattern, generators 0 … 61: X on qubit i alone (distinct single X qubits, so independent), Z on
    i − 1 and i + 1 alone, bit for bit -/
theorem generators_zero_to_sixty_one_have_exactly_the_z_x_z_bit_pattern :
  (List.range 62).all patterned = true := by decide

/-- PARTICLE TWO of the pattern, generators 62 … 123 -/
theorem generators_sixty_two_to_one_twenty_three_have_exactly_the_z_x_z_bit_pattern :
  (List.range' 62 62).all patterned = true := by decide

/-- PARTICLE ONE of commutation: generators 0 … 61 commute with all 124 — far ones share no qubit, neighbours
    anticommute twice — on the pattern the two theorems above prove they carry -/
theorem generators_zero_to_sixty_one_commute_with_all_124 :
  (List.range 62).all (fun i => (List.range 124).all (fun j => commutes 124 i j)) = true := by decide

/-- PARTICLE TWO of commutation: generators 62 … 123 commute with all 124 -/
theorem generators_sixty_two_to_one_twenty_three_commute_with_all_124 :
  (List.range' 62 62).all (fun i => (List.range 124).all (fun j => commutes 124 i j)) = true := by decide

/-- REFUTED CONTROLS: with no CZ at all no generator picks up a Z — the form comes from the chain — and closing the chain
    into a ring with one more CZ(0, 123) changes the end generators — the form is not true of every graph state. -/
theorem without_the_chain_or_with_a_ring_the_linear_cluster_form_fails :
  (List.range 124).all (fun j => (2 ^ j, 0, false) != want 124 j) = true
  ∧ cz 0 123 (gen 124 0) != want 124 0 ∧ cz 0 123 (gen 124 123) != want 124 123 := by decide

end QuantumUuidCluster
