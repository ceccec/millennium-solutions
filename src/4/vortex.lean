import Mathlib
/-- Digit 4 — unit; 4⁻¹ = 7; ten's-complement partner of 6. -/
namespace Vortex.D4
theorem inv_seven : (4 : ZMod 9) * 7 = 1 := by decide
theorem complement_six : 4 + 6 = 10 := by norm_num
end Vortex.D4
