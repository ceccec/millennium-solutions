import Mathlib
/-- Consolidated, buildable formalization of the exact ℤ/9, ℤ/7 and arithmetic
    facts. The per-digit `src/<d>/vortex.lean` files are the mesh view; numeric
    directory names ("1".."9") are not valid Lean modules, so THIS file is the
    lake target. All proofs are `decide` / `norm_num`. -/
namespace Vortex

-- ℤ/9 : nilradical, inverses, doubling circuit
theorem three_sq_zero    : (3 : ZMod 9) ^ 2 = 0 := by decide
theorem six_sq_zero      : (6 : ZMod 9) ^ 2 = 0 := by decide
theorem three_no_inverse : ¬ ∃ x : ZMod 9, (3 : ZMod 9) * x = 1 := by decide
theorem two_mul_five     : (2 : ZMod 9) * 5 = 1 := by decide
theorem four_mul_seven   : (4 : ZMod 9) * 7 = 1 := by decide
theorem eight_self_inv   : (8 : ZMod 9) * 8 = 1 := by decide
theorem doubling_circuit : (List.range 6).map (fun k => (2 : ZMod 9) ^ k) = [1, 2, 4, 8, 7, 5] := by decide
theorem two_order_six    : (2 : ZMod 9) ^ 6 = 1 := by decide

-- reflection: 10−d is an involution
theorem tens_complement_involutive : ∀ d, d ≤ 10 → 10 - (10 - d) = d := by
  intro d hd; omega

-- ℤ/7 rosette ≅ C₆
theorem rosette_pow_six : (3 : ZMod 7) ^ 6 = 1 := by decide
theorem rosette_orbit   : (List.range 6).map (fun k => (3 : ZMod 7) ^ (k + 1)) = [3, 2, 6, 4, 5, 1] := by decide

-- 432 and the doubling digit-sum
theorem k432 : (432 : ℕ) = 2 ^ 4 * 3 ^ 3 ∧ (432 : ℕ) = 16 * 27 := by norm_num
theorem doubling_digit_sum : 1 + 2 + 4 + 8 + 7 + 5 = 27 := by norm_num

-- nuclear shell-model magic numbers
def caps : List ℕ := [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
theorem magic_2   : (caps.take 1).sum  = 2   := by decide
theorem magic_8   : (caps.take 3).sum  = 8   := by decide
theorem magic_20  : (caps.take 6).sum  = 20  := by decide
theorem magic_28  : (caps.take 7).sum  = 28  := by decide
theorem magic_50  : (caps.take 11).sum = 50  := by decide
theorem magic_82  : (caps.take 16).sum = 82  := by decide
theorem magic_126 : (caps.take 22).sum = 126 := by decide

-- proton fit is exact arithmetic, and is NOT the measured ratio
theorem proton_fit    : 108 * 17 = 1836 := by norm_num
theorem fit_not_ratio : (1836 : ℚ) ≠ 18361527 / 10000 := by norm_num

-- the self-sealing vortex-fraction product
theorem self_seal : (1/2 : ℚ) * (1/2) * (1/2) * (8/7) * (7/5) * (5/3) * (1/2) * (2/3) * 9 = 1 := by norm_num

end Vortex
