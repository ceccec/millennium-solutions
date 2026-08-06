import Mathlib
/-- Digit 1 — unity: self-inverse in ℤ/9; ten's-complement partner of 9. -/
namespace Vortex.D1
theorem self_inverse : (1 : ZMod 9) * 1 = 1 := by decide
theorem complement_nine : 1 + 9 = 10 := by norm_num
end Vortex.D1
