import Mathlib
/-- The vortex "fit" to the proton/electron mass ratio is 108·17 = 1836 — an exact
    integer identity. It is NOT the measured ratio (≈ 1836.152673, a non-integer),
    so the fit misses the physical value; and the same 1836 fits any nearby target
    (see proton-mass-fit.mjs). Curve-fitting, not a prediction. -/
namespace Vortex.D8.Nucleus.ProtonFit
theorem vortex_fit : 108 * 17 = 1836 := by norm_num
/-- The integer fit is not the measured ratio 1836.1527… -/
theorem fit_is_not_the_ratio : (1836 : ℚ) ≠ 18361527 / 10000 := by norm_num
end Vortex.D8.Nucleus.ProtonFit
