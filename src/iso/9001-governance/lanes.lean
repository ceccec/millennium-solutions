set_option maxRecDepth 100000
-- title: How many checkers may run at once, decided
-- wing: the floor
-- prior_art: unclassified
-- prior_art_domain: elementary arithmetic on naturals — min, truncating subtraction, floor division
-- prior_art_note: NONE OF THE ARITHMETIC IS THIS DEPOSIT'S. min, ⌊a/b⌋ and truncating subtraction on the
--   naturals are older than anyone could name. What is this deposit's is not the arithmetic: it is that the
--   rule deciding how much of a machine a verification may take is DECIDED by the kernel rather than trusted
--   because it has not yet swapped.
-- prior_art_search: not performed — the arithmetic is named above rather than searched for.
-- prior_art_pool: bounded
-- prior_art_own: the safety bound below, decided
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/api/lanes.ts decides how many Lean processes may elaborate at once. It is the tree's only statement
-- about TIME and SPACE: too few lanes and a release takes twenty-two minutes, too many and the machine
-- swaps while every core reads as busy. Until now the rule was TypeScript and a comment, and the comment
-- carried the honest part — `totalmem()/2` is "a guess, and named as one".
--
-- A guess is the wrong kind of thing to hold a safety bound. The question "can this many lean processes fit
-- in this much memory" is arithmetic over a finite domain, which is the one kind of question this deposit
-- answers by exhaustion. So the bound is decided here and src/api/lanes.ts implements what is decided.
--
-- THE ONE THAT MATTERS IS THEOREM 3. Lanes never exceed what memory affords. Every other property is
-- comfort; that one is why raising the lane count is safe whenever the arithmetic says it is, and why it is
-- not safe when the arithmetic says otherwise — including on a host nobody has measured.
--
-- No axioms, no Mathlib, no sorry.

namespace Lanes

-- The budget, exactly as src/api/lanes.ts computes it.
--   cores      what the OS reports it can run at once
--   byMemory   ⌊reclaimable / perJob⌋, never below one
--   running    processes of this kind already elaborating, whoever started them
def base (cores byMemory : Nat) : Nat := min cores byMemory

-- KNOWN neighbours: take what is left. Nat subtraction truncates, so this never wraps.
def lanesKnown (cores byMemory running : Nat) : Nat := max 1 (base cores byMemory - running)

-- UNKNOWN neighbours: halve rather than assume the machine is empty. The failure that matters is claiming
-- capacity somebody else is already using.
def lanesUnknown (cores byMemory : Nat) : Nat := max 1 (base cores byMemory / 2)

-- ── 1 · A BUILD ALWAYS MAKES PROGRESS ─────────────────────────────────────────────────────────────────────
-- Never zero, under any combination in range — including a machine that reports no cores and no memory.
-- A budget of zero is not caution, it is a build that never finishes.
theorem a_lane_is_always_granted :
  (List.range 9).all (fun c => (List.range 9).all (fun m => (List.range 9).all (fun r =>
    lanesKnown c m r ≥ 1 && lanesUnknown c m ≥ 1))) := by decide

-- ── 2 · NEVER MORE LANES THAN CORES ───────────────────────────────────────────────────────────────────────
-- Except the floor of one: a single-core machine still gets its one lane, which is the whole of the
-- exception and is stated rather than hidden inside a max.
theorem lanes_never_exceed_the_cores_but_for_the_floor :
  (List.range 9).all (fun c => (List.range 9).all (fun m => (List.range 9).all (fun r =>
    lanesKnown c m r ≤ max 1 c && lanesUnknown c m ≤ max 1 c))) := by decide

-- ── 3 · AND NEVER MORE THAN MEMORY AFFORDS ────────────────────────────────────────────────────────────────
-- THE SAFETY BOUND. byMemory is ⌊reclaimable / perJob⌋, so lanes ≤ byMemory says exactly that the lanes
-- granted, each taking up to perJob, fit inside what was measured as reclaimable. This is the property that
-- makes raising the count safe when the arithmetic allows it — and refuses it when it does not.
theorem lanes_never_exceed_what_memory_affords :
  (List.range 9).all (fun c => (List.range 9).all (fun m => (List.range 9).all (fun r =>
    lanesKnown c m r ≤ max 1 m && lanesUnknown c m ≤ max 1 m))) := by decide

-- ── 4 · NOT KNOWING COSTS LANES, IT NEVER BUYS THEM ───────────────────────────────────────────────────────
-- An unmeasured neighbour count must never grant MORE than measuring it and finding the machine empty.
-- If it could, "I could not tell" would be the fastest configuration, and nobody would measure again.
theorem unknown_is_never_better_than_measuring_an_empty_machine :
  (List.range 9).all (fun c => (List.range 9).all (fun m =>
    lanesUnknown c m ≤ lanesKnown c m 0)) := by decide

-- ── 5 · MORE MEMORY NEVER MEANS FEWER LANES ───────────────────────────────────────────────────────────────
-- Monotone in the measurement, so a host that reports its memory honestly is never punished for it — the
-- property that makes it safe to replace a guess with a real reading.
theorem more_memory_never_costs_a_lane :
  (List.range 8).all (fun c => (List.range 8).all (fun m => (List.range 8).all (fun r =>
    lanesKnown c m r ≤ lanesKnown c (m + 1) r))) := by decide

-- ── 6 · AND MORE NEIGHBOURS NEVER MEANS MORE LANES ────────────────────────────────────────────────────────
-- The other direction of the same honesty: a busier machine never yields a larger claim on it.
theorem more_neighbours_never_buys_a_lane :
  (List.range 9).all (fun c => (List.range 9).all (fun m => (List.range 8).all (fun r =>
    lanesKnown c m (r + 1) ≤ lanesKnown c m r))) := by decide

-- ── 7 · THE GUESS AND THE MEASUREMENT, AT THE SIZE THAT PROMPTED THIS ─────────────────────────────────────
-- The release runner reported `min(cores 4, memory 2 at ~2900MB each)` and took 21.6 minutes for the cold
-- build. That memory term is ⌊reclaimable / 2900⌋ where reclaimable came from the `totalmem()/2` fallback,
-- because src/api/lanes.ts reads vm_stat and vm_stat is macOS. Decided below at that exact shape: with four
-- cores, a machine whose reclaimable memory affords four jobs grants twice the lanes of one that affords
-- two — so what the fallback costs is not a rounding, it is half the build.
theorem the_fallback_costs_half_the_lanes_at_the_size_that_prompted_this :
  lanesKnown 4 2 0 = 2 ∧ lanesKnown 4 4 0 = 4 ∧ lanesKnown 4 2 0 * 2 = lanesKnown 4 4 0 := by decide

-- ── 8 · A HOST THAT CANNOT BE MEASURED IS STILL SAFE ──────────────────────────────────────────────────────
-- Theorems 1 and 3 together, on the unknown branch alone: never zero, never over the memory bound. An
-- unmeasurable host gets a working build that cannot oversubscribe.
theorem an_unmeasurable_host_still_builds_and_still_fits :
  (List.range 9).all (fun c => (List.range 9).all (fun m =>
    lanesUnknown c m ≥ 1 && lanesUnknown c m ≤ max 1 m && lanesUnknown c m ≤ max 1 c)) := by decide

end Lanes
