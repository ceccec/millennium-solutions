import Mathlib
/-- Pliska rosette (7 rays) — arithmetic on (ℤ/7)*: cyclic of order 6 = φ(7),
    the same group C₆ as the (ℤ/9)* doubling vortex. Ray generators (primitive
    roots mod 7): 3 and 5. -/
namespace Vortex.D7.Rosetta
theorem three_pow_six   : (3 : ZMod 7) ^ 6 = 1 := by decide
theorem three_primitive : ∀ k, 0 < k → k < 6 → (3 : ZMod 7) ^ k ≠ 1 := by decide
theorem three_ray_orbit : (List.range 6).map (fun k => (3 : ZMod 7) ^ (k + 1)) = [3, 2, 6, 4, 5, 1] := by decide
theorem five_pow_six    : (5 : ZMod 7) ^ 6 = 1 := by decide
theorem five_primitive  : ∀ k, 0 < k → k < 6 → (5 : ZMod 7) ^ k ≠ 1 := by decide
end Vortex.D7.Rosetta
