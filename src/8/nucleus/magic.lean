import Mathlib
/-- Nuclear shell-model magic numbers as exact cumulative sums of level
    capacities (2j+1), in shell-model filling order. 2,8,20 from the oscillator;
    28,50,82,126 from spin-orbit intruders. -/
namespace Vortex.D8.Nucleus
def caps : List ℕ := [2, 4, 2, 6, 2, 4, 8, 4, 6, 2, 10, 8, 6, 4, 2, 12, 10, 8, 6, 4, 2, 14]
theorem magic_2   : (caps.take 1).sum  = 2   := by decide
theorem magic_8   : (caps.take 3).sum  = 8   := by decide
theorem magic_20  : (caps.take 6).sum  = 20  := by decide
theorem magic_28  : (caps.take 7).sum  = 28  := by decide
theorem magic_50  : (caps.take 11).sum = 50  := by decide
theorem magic_82  : (caps.take 16).sum = 82  := by decide
theorem magic_126 : (caps.take 22).sum = 126 := by decide
theorem total_126 : caps.sum = 126 := by decide
end Vortex.D8.Nucleus
