-- The caps of the QPU observation waves, derived from one stated budget, not typed as literals.
--
-- The single assumption is `loadBudget`: the total number of requests the operator of the public service has agreed
-- may be sent in one observation. No theorem can choose that number; it is named here so it is the only input.
-- Every other cap is a definition over it, and the kernel checks that the caps fit the budget.
namespace WaveCaps

/-- The agreed total for one observation (the one assumption; change it only with the operator's agreement). -/
def loadBudget : Nat := 15

/-- The number of waves. Chosen so the waves divide the budget exactly. -/
def waves : Nat := 3

/-- Requests per wave, derived from the budget and the wave count. -/
def perWave : Nat := loadBudget / waves

/-- Spacing between waves in milliseconds: a defined function of the wave count, not a free literal. -/
def spacingMs : Nat := 1000 * (waves - 1)

theorem caps_fit_budget : waves * perWave ≤ loadBudget := by decide

theorem budget_is_spent_exactly : waves * perWave = loadBudget := by decide

theorem per_wave_is_five : perWave = 5 := by decide

theorem spacing_is_two_seconds_between_three_waves : spacingMs = 2000 := by decide

end WaveCaps

-- ── AUTO-BALANCE: the wave size follows the measured latency, and never exceeds what the budget has left. ──
namespace Balance
open WaveCaps

/-- The agreed latency target in milliseconds (a policy input, like the budget; not a measured fact). -/
def targetMs : Nat := 1000

/-- The next wave's size: double while the latency is within target, halve when it is not, at least one request,
    and never more than the budget that remains. -/
def nextSize (remaining cur : Nat) (withinTarget : Bool) : Nat :=
  min remaining (max 1 (if withinTarget then cur * 2 else cur / 2))

/-- Simulated schedule while every wave stays within target: each wave is sized by the current size and the budget
    still unspent, and the schedule stops when the budget is spent. -/
def schedule : Nat → Nat → Nat → List Nat
  | 0, _, _ => []
  | fuel + 1, cur, remaining =>
      if remaining = 0 then []
      else
        let size := min remaining (max 1 cur)
        size :: schedule fuel (nextSize (remaining - size) size true) (remaining - size)

theorem next_never_exceeds_remaining : ∀ r < 16, ∀ c < 16, ∀ ok : Bool, nextSize r c ok ≤ r := by decide

theorem next_is_at_least_one_while_budget_remains : ∀ r < 16, ∀ c < 16, ∀ ok : Bool, 1 ≤ r → 1 ≤ nextSize r c ok := by decide

theorem schedule_spends_within_budget : (schedule 8 1 loadBudget).sum ≤ loadBudget := by decide

theorem schedule_spends_the_whole_budget : (schedule 8 1 loadBudget).sum = loadBudget := by decide

#eval schedule 8 1 loadBudget
#eval (schedule 8 1 loadBudget).sum

end Balance
