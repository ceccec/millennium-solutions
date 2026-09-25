set_option maxRecDepth 100000
-- title: A coverage figure is worth what its control does not already explain
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the false-positive rate of a classifier, and the correction of a raw count by a
--   negative control. Signal detection theory; a blank in analytical chemistry; a scrambled-label baseline.
-- prior_art_note: NOT THIS DEPOSIT'S, AND OLD. Subtracting what a control already produces is what a blank
--   is for and has been since titration. What is this deposit's is that the rule is decided by the kernel
--   and sits beside the measurement it governs, so the raw figure cannot be quoted without it.
-- prior_art_search: not performed — the idea is named above rather than searched for.
-- prior_art_pool: unbounded
-- prior_art_own: the discount rule below, and the blindness bound in theorem 5
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- Following the posters in Zenodo record 22934883 meant asking how much of their ring of domain labels
-- this deposit covers. The matcher was crude — does any word of the label appear anywhere in src/proof —
-- and it answered 15 of 28, which is 54% and is a flattering number about my own tree.
--
-- So it was run against a control ring of twenty-eight domains this deposit demonstrably says nothing
-- about: equine dentistry, neon bending, competitive dachshund grooming. It scored 4 of 28. The matcher
-- has a FALSE-POSITIVE FLOOR of about one in seven, earned on words like "tea", "shoe" and "competitive"
-- that occur in English prose and therefore in the comments of a Lean file.
--
-- 54% is not the answer. 54% is the answer plus the floor, and the part of it that is not the floor is
-- eleven labels, not fifteen. The figure is reported discounted or it is not reported.
--
-- THE RULE IS DECIDED HERE, THE NUMBERS ARE NOT. Theorems 1 to 5 quantify over every raw count, floor and
-- population in range and say nothing about this particular measurement — so the rule cannot be tuned to
-- flatter the run that prompted it. Only theorem 6 names the measured triple, and it names it as a
-- citation to a run, not as a law.
--
-- No axioms, no Mathlib, no sorry.

namespace Discount

-- What a measurement is worth once the control is paid for. Nat subtraction truncates, which is the right
-- behaviour: a raw count at or below its own floor is worth nothing, not a negative amount.
def discounted (raw floor : Nat) : Nat := raw - floor

-- ── 1 · DISCOUNTING NEVER INFLATES ────────────────────────────────────────────────────────────────────────
-- The property that makes this safe to apply everywhere: it can only ever lower a claim. A correction that
-- could raise one would be a second way to overstate, wearing the clothes of caution.
theorem the_discount_never_raises_the_figure :
  (List.range 30).all (fun raw => (List.range 30).all (fun fl =>
    discounted raw fl ≤ raw)) := by decide

-- ── 2 · A FIGURE AT OR BELOW ITS FLOOR IS WORTH NOTHING ───────────────────────────────────────────────────
-- Not "worth less" — worth nothing. A matcher that scores 4 on domains it knows nothing about has not
-- established anything by scoring 4 on domains it might.
theorem a_figure_at_or_below_its_floor_is_worth_nothing :
  (List.range 30).all (fun raw => (List.range 30).all (fun fl =>
    (raw ≤ fl) == (discounted raw fl == 0))) := by decide

-- ── 3 · AND A FIGURE ABOVE ITS FLOOR IS WORTH SOMETHING ───────────────────────────────────────────────────
-- THE CONTROL ON THE CONTROL. Theorems 1 and 2 are both satisfied by a rule that always returns zero,
-- which would be maximally cautious and useless. This requires the opposite answer whenever the raw count
-- clears the floor, so the discount is a measurement and not a refusal.
theorem a_figure_above_its_floor_is_worth_something :
  (List.range 30).all (fun raw => (List.range 30).all (fun fl =>
    (raw > fl) == (discounted raw fl > 0))) := by decide

-- ── 4 · THE DISCOUNT IS EXACTLY THE EXCESS OVER THE CONTROL ───────────────────────────────────────────────
-- Stated as an identity rather than an inequality, so no slack hides in it: whatever clears the floor is
-- counted in full, and nothing else is counted at all.
theorem the_discount_is_exactly_the_excess_over_the_control :
  (List.range 30).all (fun raw => (List.range 30).all (fun fl =>
    discounted raw fl + min raw fl == raw)) := by decide

-- ── 5 · A MATCHER IS BLIND BELOW ITS OWN FLOOR ────────────────────────────────────────────────────────────
-- The consequence that matters for reading any coverage table: every raw count from zero up to the floor
-- discounts to the same nothing, so this matcher cannot tell a tree that covers four of the labels from
-- one that covers none. A gap is not a gap when the instrument invents one that size.
--
-- WRITTEN ONCE AS `… → discounted a fl == discounted b fl || true`, WHICH IS THE DEFECT THIS TREE IS FOR.
-- That version passed `decide` because `|| true` is true, and it was reached for because the claim it was
-- decorating — that any two counts within the floor of EACH OTHER agree — is simply false: 10 and 9
-- discount to 8 and 7. The false claim was made unfalsifiable rather than dropped. What is true is the
-- statement below, about counts below the floor rather than near one another, and it needs no decoration.
--
-- The second conjunct is the control: the blindness is real, not vacuous — there are distinct counts that
-- collapse together, and above the floor distinct counts stay distinct.
theorem the_matcher_is_blind_below_its_floor_and_not_above :
  (List.range 16).all (fun fl => (List.range 16).all (fun a => (List.range 16).all (fun b =>
    (!(a ≤ fl && b ≤ fl) || discounted a fl == discounted b fl)
    && (!(a > fl && b > fl && a != b) || discounted a fl != discounted b fl)))) := by decide

-- ── 6 · THE MEASURED TRIPLE, CITED TO ITS RUN ─────────────────────────────────────────────────────────────
-- Measured 2026-09-25 against src/proof at 46 files: the ring of 28 labels from record 22934883 scored 15,
-- the control ring of 28 domains this deposit is silent on scored 4. So the deposit's demonstrated reach
-- over that ring is 11 labels and not 15 — and 11 of 28 is 39%, which is the figure that may be quoted.
--
-- 15 of 28 is 53.6%. The run that produced it printed 54% because it rounded; the theorem below truncates
-- and says 53. Both are that same ratio and neither is the figure to quote, which is why the arithmetic is
-- recorded rather than a sentence: the rounding is visible instead of being a discrepancy someone finds.
--
-- THESE THREE NUMBERS ARE A CITATION, NOT A LAW. They are what one crude matcher returned on one day
-- against one tree; re-run it and they move. Theorems 1 to 5 do not.
theorem the_measured_ring_clears_its_floor_by_eleven :
  discounted 15 4 == 11 && discounted 15 4 * 100 / 28 == 39 && 15 * 100 / 28 == 53 := by decide

end Discount
