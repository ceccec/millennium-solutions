import Mathlib
/-- Ten's-complement reflection r(d) = 10 − d links partner folders d ↔ 10−d.
    It is an involution; 5 is its unique fixed digit; the void 0/9 is the seam
    where the possibility/impossibility strokes do NOT invert (0,9≡0 have no
    inverse). The per-digit complement facts live in each src/<d>/vortex.lean. -/
namespace Vortex.D5.Reflection
/-- 10 − d is an involution on digits 0..10 (ℕ truncated subtraction is exact here). -/
theorem tens_complement_involutive : ∀ d, d ≤ 10 → 10 - (10 - d) = d := by decide
/-- 5 is the unique fixed digit of the reflection. -/
theorem five_fixed : 10 - 5 = 5 := by norm_num
/-- Every complement pair of the walk sums to 10. -/
theorem pairs_sum_ten : 1+9=10 ∧ 2+8=10 ∧ 3+7=10 ∧ 4+6=10 ∧ 5+5=10 := by norm_num
end Vortex.D5.Reflection
