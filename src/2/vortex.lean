import Mathlib
/-- Digit 2 — the generator: doubling circuit ⟨2⟩ = [1,2,4,8,7,5], order 6,
    never touches the axis; 2⁻¹ = 5; ten's-complement partner of 8 (wave ↔ matter). -/
namespace Vortex.D2
theorem doubling_circuit : (List.range 6).map (fun k => (2 : ZMod 9) ^ k) = [1, 2, 4, 8, 7, 5] := by decide
theorem order_six  : (2 : ZMod 9) ^ 6 = 1 := by decide
theorem avoids_axis : ∀ k, k < 6 → (2 : ZMod 9) ^ k ≠ 0 := by decide
theorem inv_five   : (2 : ZMod 9) * 5 = 1 := by decide
theorem complement_eight : 2 + 8 = 10 := by norm_num
end Vortex.D2
