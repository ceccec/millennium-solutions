import Mathlib
/-- Digit 9 — the void / modulus: 9 ≡ 0 in ℤ/9; ten's-complement partner of 1.
    Holds the digital-root-9 facts: the doubling circuit's digit sum (27 = 3³)
    and 432 = 2⁴·3³ = 16·27 (digital root 4+3+2 = 9). -/
namespace Vortex.D9
theorem nine_is_zero : (9 : ZMod 9) = 0 := by decide
theorem complement_one : 9 + 1 = 10 := by norm_num
theorem doubling_digit_sum : 1 + 2 + 4 + 8 + 7 + 5 = 27 := by norm_num
theorem k432 : (432 : ℕ) = 2 ^ 4 * 3 ^ 3 ∧ (432 : ℕ) = 16 * 27 := by norm_num
theorem k432_digital_root : 4 + 3 + 2 = 9 := by norm_num
end Vortex.D9
