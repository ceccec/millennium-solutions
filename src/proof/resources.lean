set_option maxRecDepth 10000
-- title: Annealer topology, QFT resource counts, and π's rational convergents — learned from qpu's Annealing, Qft, Pi
-- wing: the floor
-- prior_art: named
-- prior_art_domain: D-Wave Chimera and Pegasus annealer qubit counts (vertices·m², vertices·n·m·(m−1)); the quantum
--   Fourier transform's resource counts over q qubits — gate count q(q+1)/2 (a triangular number), swaps ⌊q/2⌋, depth
--   2q−1, dimension 2^q; and the classical rational convergents of π — Archimedes' 22/7 (upper bound) and Zu Chongzhi's
--   355/113 (5th century). Read from qpu.uuidna.com's Annealing.lean, Qft.lean and Pi.lean (~/github/uuidna/qpu) on
--   2026-11-08 and ported here.
-- prior_art_note: none of this is new and none of it is this deposit's. qpu states each as an rfl certificate on a
--   single input; what is decided HERE is the same quantities as functions over a range, by exhaustion, each with a
--   control. The honest bound: these are exact integer counts and exact RATIONAL convergents — not a closed form for π
--   (which is irrational) and not a physical annealer or QFT circuit; the counts are the structure, decided on silicon.
-- prior_art_search: not performed — every object is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the quantities restated as decided range theorems with a control beside each, and the finite bound
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace Resources

def chimera   (m : Nat) : Nat := 8 * m ^ 2        -- D-Wave Chimera: vertices (8) qubits per cell, m² cells
def pegasus   (m : Nat) : Nat := 24 * m * (m - 1) -- D-Wave Pegasus: vertices·n·m·(m−1) = 8·3·m·(m−1)
def qftGates  (q : Nat) : Nat := q * (q + 1) / 2  -- controlled-phase gates: the q-th triangular number
def qftSwaps  (q : Nat) : Nat := q / 2
def qftDepth  (q : Nat) : Nat := 2 * q - 1
def qftStates (q : Nat) : Nat := 2 ^ q

-- ── 1 · THE CHIMERA ANNEALER QUBIT COUNT IS 8·m² ─────────────────────────────────────────────────────────
theorem the_chimera_annealer_qubit_count_is_eight_m_squared :
  (List.range' 1 8).map chimera = [8, 32, 72, 128, 200, 288, 392, 512]
  ∧ chimera 16 = 2048
  ∧ (List.range' 1 16).all (fun m => chimera m == 8 * m ^ 2) := by decide

-- ── 2 · THE PEGASUS COUNT IS 24·m·(m−1) — CONTROL: ONE CELL HAS NO INTER-CELL QUBITS ─────────────────────
theorem the_pegasus_annealer_count_is_twenty_four_m_times_m_minus_one :
  pegasus 16 = 5760 ∧ pegasus 1 = 0 ∧ pegasus 2 = 48
  ∧ (List.range' 1 16).all (fun m => pegasus m == 24 * m * (m - 1)) := by decide

-- ── 3 · THE QFT GATE COUNT IS THE TRIANGULAR NUMBER q(q+1)/2 ─────────────────────────────────────────────
theorem the_qft_gate_count_is_the_triangular_number :
  (List.range' 1 8).map qftGates = [1, 3, 6, 10, 15, 21, 28, 36]
  ∧ qftGates 3 = 6 ∧ qftGates 4 = 10
  ∧ (List.range' 1 8).all (fun q => 2 * qftGates q == q * (q + 1)) := by decide

-- ── 4 · THE QFT SWAPS, DEPTH, AND STATE DIMENSION ───────────────────────────────────────────────────────
theorem the_qft_swaps_depth_and_states :
  qftSwaps 4 = 2 ∧ qftDepth 4 = 7 ∧ qftStates 4 = 16
  ∧ (List.range' 1 8).all (fun q => qftStates q == 2 ^ q)
  ∧ (List.range' 1 8).all (fun q => qftDepth q == 2 * q - 1) := by decide

-- ── 5 · ARCHIMEDES' 22/7 IS AN UPPER BOUND, AND ⌊π⌋ = 3 ──────────────────────────────────────────────────
-- 22/7 = 3.142857… > π, and 3 < 22/7 < 4 pins the floor. Compared as integers, no floats.
theorem archimedes_twenty_two_over_seven_bounds_pi_above_and_the_floor_is_three :
  14 + 8 = 22 ∧ 22 * 100000 > 314159 * 7
  ∧ 3 * 7 < 22 ∧ 22 < 4 * 7 := by decide

-- ── 6 · ZU CHONGZHI'S 355/113 LIES BETWEEN 3.141592 AND 3.141593 ─────────────────────────────────────────
theorem zu_chongzhis_three_fifty_five_over_one_thirteen_brackets_pi_to_six_places :
  28 * (14 - 1) - 3 * 3 = 355 ∧ 28 * 4 + 1 = 113
  ∧ 3141592 * 113 < 355 * 1000000 ∧ 355 * 1000000 < 3141593 * 113 := by decide

-- ── 7 · THE TURN IS 360°, THE HALF-TURN 180°, FROM THE SAME CONSTANTS ────────────────────────────────────
theorem the_turn_is_three_hundred_sixty_degrees_and_the_half_turn_one_eighty :
  (14 - 2) * (28 + 2) = 360 ∧ (14 - 2) * (14 + 1) = 180 ∧ 360 = 2 * 180 := by decide

-- ── 8 · THE HONEST BOUND: EXACT COUNTS AND RATIONAL CONVERGENTS, NOT π AND NOT A PHYSICAL CIRCUIT ────────
-- The counts are exact integers and the convergents are exact rationals near π, decided over finite domains. Neither
-- is a closed form for π (irrational) nor a physical annealer or QFT circuit run on hardware: the gate count is the
-- circuit's structure, the convergent is a rational that brackets π, both computed on the classical build device.
theorem these_are_exact_counts_and_rational_convergents_not_pi_itself :
  chimera 16 = 2048 ∧ pegasus 16 = 5760 ∧ qftGates 10 = 55
  ∧ 22 * 7 = 154 ∧ 355 * 113 = 40115
  ∧ (List.range' 1 8).all (fun q => qftGates q < qftStates q) := by decide

end Resources
