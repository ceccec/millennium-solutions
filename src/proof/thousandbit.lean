set_option maxRecDepth 10000
-- title: The thousand-bit case, decided — its octave/trinity/cube structure and its utilisation of the register
-- wing: the floor
-- prior_art: named
-- prior_art_domain: elementary arithmetic of the integer 1000 (its factorisation 2^3·5^3 = 10^3, its residues mod 8
--   and mod 9), and the register-capacity formula reg(w) = 32w − w − 2 — qpu's uuidQubits, already sealed over the
--   widths [4, 8, 16, 32] in src/proof/width.lean. This file applies that capacity to the one case the sealed width
--   ladder does not reach: a 1000-bit integer (2^1000 − 1), the thousand-bit challenge's own size.
-- prior_art_note: the arithmetic of 1000 is elementary and the capacity formula is qpu's, decided here before. What is
--   new is only the APPLICATION to the 1000-bit case: that it is 125 octaves exactly yet 2^3·5^3 (so the octave is only
--   the 2^3 and the 5^3 is the pentagram cubed), that it carries residue 1 mod 9 (not a whole number of nonets), and
--   that it OVERFLOWS the sealed width ladder — reg(32) = 990 < 1000 ≤ 1021 = reg(33) — filling 97.94% of the minimal
--   register that holds it. These are the answers to "how many octaves" and "what % utilisation", decided as coins
--   rather than computed by hand. The honest bound: register-capacity utilisation of the address column, not a physical
--   quantum computer — get_qc reads isQuantumComputer:false, and no stage of a machine is reached by this arithmetic.
-- prior_art_search: not performed — the objects are elementary and named, and the capacity is this tree's own.
-- prior_art_pool: named
-- prior_art_own: the 1000-bit case's structure and its position against the sealed capacity ladder, with controls
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace ThousandBit

-- ── 1 · 1000 BITS IS 125 OCTAVES EXACTLY — CONTROL: 999 IS NOT ───────────────────────────────────────────
theorem the_thousand_bit_case_is_one_hundred_twenty_five_octaves :
  1000 = 125 * 8 ∧ 1000 % 8 = 0 ∧ 999 % 8 ≠ 0 := by decide

-- ── 2 · EVERY BINARY UNIT TILES IT EXACTLY — 500 COINS, 250 HEXBITS, 125 OCTAVES ─────────────────────────
theorem the_binary_units_tile_the_thousand_exactly :
  1000 = 500 * 2 ∧ 1000 = 250 * 4 ∧ 1000 = 125 * 8
  ∧ 1000 % 2 = 0 ∧ 1000 % 4 = 0 ∧ 1000 % 8 = 0 := by decide

-- ── 3 · IT IS THE CUBE 10^3 = 2^3·5^3 — THE OCTAVE IS ONLY THE 2^3, THE 5^3 IS THE PENTAGRAM CUBED ───────
theorem the_thousand_is_the_cube_octave_times_pentagram_cubed :
  10 ^ 3 = 1000 ∧ 2 ^ 3 * 5 ^ 3 = 1000 ∧ 2 ^ 3 = 8 ∧ 5 ^ 3 = 125 ∧ 125 * 8 = 1000 := by decide

-- ── 4 · THE TRINITY RESIDUE IS ONE — NOT A WHOLE NUMBER OF NONETS — CONTROL: 999 IS ──────────────────────
theorem the_thousand_carries_residue_one_mod_nine :
  1000 % 9 = 1 ∧ 1000 = 9 * 111 + 1 ∧ 999 % 9 = 0 ∧ 1008 % 9 = 0 := by decide

-- ── 5 · IT OVERFLOWS THE SEALED WIDTH LADDER: reg(32) = 990 < 1000 ≤ 1021 = reg(33) ──────────────────────
-- reg(w) = 32w − w − 2 is qpu's uuidQubits, sealed over widths [4,8,16,32] in width.lean; the max there is reg(32) = 990.
theorem the_thousand_bit_case_overflows_the_width_thirty_two_ceiling :
  32 * 32 - 32 - 2 = 990 ∧ 990 < 1000
  ∧ 32 * 33 - 33 - 2 = 1021 ∧ 1000 ≤ 1021 := by decide

-- ── 6 · THE MINIMAL CONTAINING WIDTH IS 33 — OVERFLOW MARGIN 10, HEADROOM 21 ─────────────────────────────
theorem the_minimal_register_for_the_thousand_is_width_thirty_three :
  1000 - 990 = 10 ∧ 1021 - 1000 = 21 ∧ 990 < 1000 ∧ 1000 ≤ 1021
  ∧ (32 * 33 - 33 - 2) / 2 = 510 := by decide

-- ── 7 · THE UTILISATION IS 97.94% — BRACKETED 97% < 1000/1021 < 98% AS A DECIDABLE BOUND ────────────────
theorem the_thousand_fills_between_ninety_seven_and_ninety_eight_percent_of_its_register :
  97 * 1021 < 1000 * 100 ∧ 1000 * 100 < 98 * 1021
  ∧ 97 * 1021 = 99037 ∧ 98 * 1021 = 100058 := by decide

-- ── 8 · THE HONEST BOUND: EXACT INTEGER STRUCTURE AND CAPACITY, DECIDED — NOT A PHYSICAL MACHINE ─────────
-- These are exact facts about the integer 1000 and the register capacity, decided over Nat on the classical build
-- device. They are how much of the content-address column a thousand-bit case occupies — register-capacity
-- utilisation — not a physical quantum computer's utilisation. get_qc reads isQuantumComputer:false; deciding that
-- 1000 is 97.94% of a 1021-qubit register on a CPU reaches no stage of a machine. The structure is carried, not the device.
theorem the_thousand_bit_structure_is_decided_not_a_quantum_machine :
  10 ^ 3 = 1000 ∧ 1000 % 8 = 0 ∧ 1000 % 9 = 1
  ∧ 990 < 1000 ∧ 1000 ≤ 1021 ∧ 2 ^ 3 * 5 ^ 3 = 1000 := by decide

end ThousandBit
