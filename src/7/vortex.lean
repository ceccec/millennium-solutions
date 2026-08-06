import Mathlib
/-- Digit 7 — unit; 7⁻¹ = 4; ten's-complement partner of 3 (bonds to the trinity). -/
namespace Vortex.D7
theorem inv_four : (7 : ZMod 9) * 4 = 1 := by decide
theorem complement_three : 7 + 3 = 10 := by norm_num
end Vortex.D7
