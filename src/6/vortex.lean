import Mathlib
/-- Digit 6 — nilpotent (6² ≡ 0), no inverse; trinity axis with 3, 9; partner of 4. -/
namespace Vortex.D6
theorem sq_zero    : (6 : ZMod 9) ^ 2 = 0 := by decide
theorem no_inverse : ¬ ∃ x : ZMod 9, (6 : ZMod 9) * x = 1 := by decide
theorem complement_four : 6 + 4 = 10 := by norm_num
end Vortex.D6
