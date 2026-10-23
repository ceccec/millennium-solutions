-- Worker invocations per hour for the QPU discovery endpoint, with and without an edge cache.
--
-- ASSUMPTIONS (inputs, not measured here): `reqPerSec` is the client request rate at one point of presence (POP);
-- `windowSec` is the cache's max-age. Dollars are not modelled: the price per invocation belongs to the account's billing.
namespace CostModel

/-- Invocations per hour when every request reaches the Worker (`no-cache`: revalidated each time). -/
def uncachedPerHour (reqPerSec : Nat) : Nat := 3600 * reqPerSec

/-- Invocations per hour with a cache window: one origin fetch per window while requests keep arriving. -/
def cachedPerHour (reqPerSec windowSec : Nat) : Nat :=
  if reqPerSec * windowSec = 0 then uncachedPerHour reqPerSec else 3600 / windowSec

/-- A cache never increases the invocations, for any rate and window of at least one second. -/
theorem cache_never_adds_invocations : ∀ r < 20, ∀ w < 20, 1 ≤ w → cachedPerHour r w ≤ uncachedPerHour r := by decide

/-- At a rate of one request per second and a one-minute window, the origin is hit 60 times an hour, not 3600. -/
theorem one_per_second_one_minute_window : cachedPerHour 1 60 = 60 ∧ uncachedPerHour 1 = 3600 := by decide

#eval (uncachedPerHour 1, cachedPerHour 1 60, cachedPerHour 1 300)

end CostModel
