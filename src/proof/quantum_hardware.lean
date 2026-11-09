-- title: When a quantum device's counts are above the classical bound, decided on exact integers
-- wing: the machine
-- prior_art: named
-- prior_art_domain: the CHSH inequality (Clauser, Horne, Shimony, Holt, 1969) — no local classical strategy gives
--   |S| > 2 for S = E(a,b) + E(a,b') + E(a',b) − E(a',b'); Tsirelson's bound 2√2 (1980) for quantum strategies;
--   ISO/IEC 4879:2024 §3.4.8 and §3.4.10 (quantum processor, quantum computer) and ISO/IEC 2382:2015 (hardware).
-- prior_art_note: NONE OF THE PHYSICS OR THE INEQUALITY IS THIS DEPOSIT'S. What is decided here is only the integer
--   form of the verdict src/quantum/hardware.ts `chshVerdict` applies to a device's counts, so that the rule a run on
--   IBM Quantum is judged by is the kernel's, not a float comparison.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: named
-- prior_art_own: the cross-multiplied integer form of S > 2 and its one-count controls on both sides of the bound
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT THIS DECIDES AND WHAT IT REFUSES TO SAY. Per CHSH setting i, D_i = n00 + n11 − n01 − n10 and N_i is its shots,
-- so E_i = D_i / N_i. S > 2 is decided as D₀N₁N₂N₃ + D₁N₀N₂N₃ + D₂N₀N₁N₃ − D₃N₀N₁N₂ > 2·N₀N₁N₂N₃, with no division.
-- The kernel decides the rule and the classical bound. It decides nothing about any device: whether a run's counts
-- came from a quantum processor is the provider's job record, read by scripts/quantum-hardware.ts, never this file.

namespace QuantumHardware

def lhs (d0 n0 d1 n1 d2 n2 d3 n3 : Int) : Int := d0 * n1 * n2 * n3 + d1 * n0 * n2 * n3 + d2 * n0 * n1 * n3 - d3 * n0 * n1 * n2
def rhs (n0 n1 n2 n3 : Int) : Int := 2 * n0 * n1 * n2 * n3
def aboveClassical (d0 n0 d1 n1 d2 n2 d3 n3 : Int) : Bool := decide (lhs d0 n0 d1 n1 d2 n2 d3 n3 > rhs n0 n1 n2 n3)

/-- THE BOUND ITSELF: every deterministic local strategy — each side answers ±1 per setting — gives S = ±2 exactly,
    which is why 2 is the line and why a device must cross it strictly. -/
theorem every_deterministic_local_strategy_gives_chsh_plus_or_minus_two :
  [1, -1].all (fun a0 : Int => [1, -1].all (fun a1 : Int => [1, -1].all (fun b0 : Int => [1, -1].all (fun b1 : Int =>
    let s := a0 * b0 + a0 * b1 + a1 * b0 - a1 * b1; s == 2 || s == -2)))) = true := by decide

/-- REFUTED CONTROL AT THE LINE: the best classical strategy (equal bits every time) reaches S = 2 and is not above. -/
theorem the_classical_strategy_at_s_two_is_not_above_classical :
  aboveClassical 1000 1000 1000 1000 1000 1000 1000 1000 = false := by decide

/-- One count past the line is seen: E₃ = 998/1000 gives S = 2.002. No rounding stands between the counts and it. -/
theorem one_count_above_s_two_is_above_classical :
  aboveClassical 1000 1000 1000 1000 1000 1000 998 1000 = true := by decide

/-- REFUTED CONTROL ONE COUNT UNDER: E₀ = 998/1000 gives S = 1.998. -/
theorem one_count_below_s_two_is_not_above_classical :
  aboveClassical 998 1000 1000 1000 1000 1000 1000 1000 = false := by decide

/-- REFUTED CONTROL: uniform noise, every outcome equally often, gives S = 0. -/
theorem uniform_noise_is_not_above_classical :
  aboveClassical 0 1000 0 1000 0 1000 0 1000 = false := by decide

/-- The ideal device at 10 000 shots per setting: n00 = n11 = 4268 and n01 = n10 = 732 (E ≈ +1/√2), the sign flipped on
    the last setting, gives S·10 000 = 28 288 — above 20 000, and a hair above 2√2 ≈ 2.82843 only because each count
    is rounded to a whole shot. -/
theorem ideal_counts_at_ten_thousand_shots_are_above_classical :
  4268 + 732 + 732 + 4268 = 10000 ∧ 4268 + 4268 - 732 - 732 = 7072
  ∧ aboveClassical 7072 10000 7072 10000 7072 10000 (-7072) 10000 = true := by decide

/-- The register as the run reads it: value bit 0 is Alice's outcome c[0], bit 1 is Bob's c[1]. -/
theorem register_bit_zero_is_alice_and_bit_one_is_bob :
  (List.range 4).map (fun v => (v % 2, v / 2 % 2)) = [(0, 0), (1, 0), (0, 1), (1, 1)] := by decide

/-- The one-count control's own counts: 499 + 500 − 1 − 0 = 998 over 1000 shots. -/
theorem the_one_count_control_is_four_hundred_ninety_nine_agreements_short_of_five_hundred :
  (499 + 500 - 1 - 0 : Int) = 998 ∧ (499 + 1 + 0 + 500 : Int) = 1000 := by decide

end QuantumHardware
