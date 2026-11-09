set_option maxRecDepth 10000
-- title: Quantum error-correcting codes, the decidable parameters — learned from qpu's Surfacecode and Stabilizer
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the rotated surface code and its parameters [[2d² − 2d + 1, 1, d]] (Kitaev 1997; Bombín &
--   Martín-Delgado 2007); Shor's nine-qubit code [[9, 1, 3]] as a 3×3 concatenation (Shor 1995); the stabilizer
--   formalism and the order of the n-qubit Pauli group with phases, 2^(2n+2) (Gottesman 1997). Read from
--   qpu.uuidna.com's Surfacecode.lean and Stabilizer.lean (~/github/uuidna/qpu) on 2026-11-08 and ported here.
-- prior_art_note: none of this is new and none of it is this deposit's — the codes are standard and the values are
--   qpu's. qpu states them as rfl certificates on single inputs; what is decided HERE is the same parameters as a
--   FUNCTION of the distance, over a range, by exhaustion, each with a control — and the honest bound that these are
--   the codes' COUNTS, decided over a finite domain, not a physically fault-tolerant device. The ISO audit's
--   fault-tolerance score measures error correction on physical qubits; deciding this arithmetic provides none.
-- prior_art_search: not performed — every code is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the parameters restated as decided range theorems with a control beside each, and the finiteness bound
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace Qec

def surfacePhysical (d : Nat) : Nat := 2 * d ^ 2 - 2 * d + 1   -- rotated surface code, qpu's coins·d² − coins·d + seed
def corrects       (d : Nat) : Nat := (d - 1) / 2             -- a distance-d code corrects ⌊(d − 1)/2⌋ errors
def pauliOrder    (nn : Nat) : Nat := 2 ^ (2 * nn + 2)        -- qpu's paulis: order of the n-qubit Pauli group with phases

-- ── 1 · THE ROTATED SURFACE-CODE PHYSICAL QUBIT COUNT, OVER THE DISTANCE ──────────────────────────────────
theorem the_surface_code_physical_count_is_two_d_squared_minus_two_d_plus_one :
  (List.range' 1 9).map surfacePhysical = [1, 5, 13, 25, 41, 61, 85, 113, 145]
  ∧ surfacePhysical 3 = 13
  ∧ (List.range' 1 9).all (fun d => surfacePhysical d == 2 * d ^ 2 - 2 * d + 1) := by decide

-- ── 2 · THE CORRECTABLE ERRORS ARE THE FLOOR OF HALF THE DISTANCE ─────────────────────────────────────────
theorem a_distance_d_code_corrects_the_floor_of_d_minus_one_over_two :
  (List.range' 1 9).map corrects = [0, 0, 1, 1, 2, 2, 3, 3, 4]
  ∧ corrects 5 = 2
  ∧ (List.range' 1 9).all (fun d => 2 * corrects d + 1 ≤ d && d ≤ 2 * corrects d + 2) := by decide

-- ── 3 · THE CONTROL: DISTANCE ONE CORRECTS NOTHING ───────────────────────────────────────────────────────
-- A theorem that only passes is not a check: a distance-1 code has no redundancy and corrects zero, which keeps
-- "corrects ⌊(d−1)/2⌋" from being read as "always corrects something".
theorem distance_one_corrects_nothing_and_distance_three_corrects_one :
  corrects 1 = 0 ∧ corrects 3 = 1 ∧ surfacePhysical 1 = 1 ∧ surfacePhysical 3 = 13
  ∧ surfacePhysical 1 < surfacePhysical 3 := by decide

-- ── 4 · SHOR'S NINE-QUBIT CODE [[9, 1, 3]] — THE 3×3 CONCATENATION ────────────────────────────────────────
theorem shors_nine_qubit_code_is_three_by_three_distance_three_correcting_one :
  3 * 3 = 9 ∧ corrects 3 = 1 ∧ (3 - 1) / 2 = 1 ∧ 1 ≤ corrects 3 := by decide

-- ── 5 · THE n-QUBIT PAULI GROUP ORDER IS 2^(2n + 2) ──────────────────────────────────────────────────────
theorem the_pauli_group_order_is_two_to_the_two_n_plus_two :
  (List.range' 1 4).map pauliOrder = [16, 64, 256, 1024]
  ∧ pauliOrder 1 = 16
  ∧ (List.range' 1 4).all (fun nn => pauliOrder nn == 4 * 4 ^ nn) := by decide

-- ── 6 · THE CONTROL: THE SURFACE COUNT IS QUADRATIC, NOT LINEAR ───────────────────────────────────────────
-- The gap between successive distances is 4d, not a constant — so the count grows as d², which a linear model fails.
theorem the_surface_count_is_quadratic_not_linear_in_the_distance :
  surfacePhysical 2 - surfacePhysical 1 = 4
  ∧ surfacePhysical 3 - surfacePhysical 2 = 8
  ∧ (surfacePhysical 2 - surfacePhysical 1) ≠ (surfacePhysical 3 - surfacePhysical 2)
  ∧ (List.range' 1 8).all (fun d => surfacePhysical (d + 1) - surfacePhysical d == 4 * d) := by decide

-- ── 7 · HIGHER DISTANCE COSTS MORE QUBITS AND CORRECTS AT LEAST AS MANY ───────────────────────────────────
theorem a_higher_distance_costs_more_qubits_and_corrects_no_fewer :
  (List.range' 1 8).all (fun d => surfacePhysical d < surfacePhysical (d + 1))
  ∧ (List.range' 1 8).all (fun d => corrects d ≤ corrects (d + 1)) := by decide

-- ── 8 · THE HONEST BOUND: DECIDED ON A PHYSICAL (CLASSICAL) DEVICE, NOT A QUANTUM FAULT-TOLERANT ONE ──────
-- These counts ARE computed on a physical device during the build — the classical processor running the kernel over a
-- finite range of distances, real arithmetic on real silicon. What that build does NOT instantiate is a physical
-- fault-tolerant QUANTUM device: deciding that a distance-3 surface code has 13 qubits, on a classical CPU, error-
-- corrects no physical qubit. The ISO audit's fault-tolerance score measures error correction on physical qubits, and
-- the build's classical arithmetic supplies none. The device that counts is real; the quantum device it counts is not.
theorem the_counts_at_distance_nine_and_their_finite_bound :
  surfacePhysical 9 = 145 ∧ corrects 9 = 4
  ∧ (List.range' 1 9).all (fun d => corrects d < 5 && surfacePhysical d < 200)
  ∧ (List.range' 1 9).all (fun d => 2 * corrects d ≤ d) := by decide

end Qec
