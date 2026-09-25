set_option maxRecDepth 100000
-- title: The prior-art verdict is total, exclusive, and never improved by silence
-- wing: the record
-- prior_art: named
-- prior_art_domain: the classification of a test outcome under partial information — the distinction
--   between a negative result and an absent one, which is ordinary experimental practice and older than
--   statistics. Monotonicity of a decision rule in its evidence.
-- prior_art_note: NEITHER IS THIS DEPOSIT'S. "Absence of evidence is not evidence of absence" is a
--   commonplace, and requiring a decision rule to be total and exclusive is what a classification IS. What
--   is this deposit's is that ITS OWN verdict rule — the one standing behind every novelty claim it makes —
--   is decided by the kernel rather than left as a line of TypeScript nobody checks.
-- prior_art_search: not performed — both notions are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the four properties below, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/proof/priorart.lean's kind 2 — the only class allowed to claim novelty — rests on a record whose rows
-- each carry a VERDICT: CANDIDATES, NONE_FOUND, NONE_FOUND_PARTIAL, NOT_MEASURED, TOO_FEW_TERMS. Those
-- verdicts are what a reader of this deposit is asked to believe about prior art, and the rule producing
-- them was four lines of TypeScript in src/novelty/index.ts that nothing verified.
--
-- The rule is arithmetic over two counts — how many hits cleared the relevance floor, and how many sources
-- failed to answer — so it is the one kind of question this deposit settles by exhaustion. Decided here
-- over every combination in range, and the properties that matter are not "it returns a string":
--
--   TOTAL       every input gets a verdict; there is no state the rule falls through
--   EXCLUSIVE   never two verdicts for one input, so a row cannot be read two ways
--   MONOTONE    a source going silent NEVER improves the verdict — the property that stops an outage from
--               being recorded as a clean search, which is the failure mode that would matter
--   GROUNDED    NONE_FOUND requires every source to have answered; anything less is NONE_FOUND_PARTIAL
--
-- No axioms, no Mathlib, no sorry.

namespace Verdict

-- 0 TOO_FEW_TERMS · 1 CANDIDATES · 2 NONE_FOUND · 3 NONE_FOUND_PARTIAL · 4 NOT_MEASURED
def sources : Nat := 5

/-- The rule exactly as src/novelty/index.ts applies it. `keyTerms` is how many distinctive terms the
    statement offered, `relevant` how many hits cleared the floor, `silent` how many sources did not answer. -/
def verdict (keyTerms relevant silent : Nat) : Nat :=
  if keyTerms < 2 then 0
  else if relevant > 0 then 1
  else if silent ≥ sources then 4
  else if silent > 0 then 3
  else 2

def R : List Nat := List.range 8

-- ── 1 · TOTAL — EVERY INPUT GETS A VERDICT ────────────────────────────────────────────────────────────────
-- No combination falls through to something outside the five, which is what a classification must mean.
theorem every_input_receives_one_of_the_five_verdicts :
  R.all (fun k => R.all (fun r => R.all (fun s => verdict k r s ≤ 4))) := by decide

-- ── 2 · EXCLUSIVE — NEVER TWO READINGS OF ONE ROW ─────────────────────────────────────────────────────────
-- The verdict is a function, so exclusivity is the statement that it agrees with itself on equal inputs —
-- trivial for a function and NOT trivial for the property a reader depends on, which is that the five
-- classes do not overlap. Stated as: each verdict value is produced by a condition no other value shares.
theorem the_five_classes_do_not_overlap :
  R.all (fun k => R.all (fun r => R.all (fun s =>
    (verdict k r s == 0) == (k < 2)
    && (verdict k r s == 1) == (k ≥ 2 && r > 0)
    && (verdict k r s == 4) == (k ≥ 2 && r == 0 && s ≥ sources)
    && (verdict k r s == 3) == (k ≥ 2 && r == 0 && s > 0 && s < sources)
    && (verdict k r s == 2) == (k ≥ 2 && r == 0 && s == 0)))) := by decide

-- ── 3 · SILENCE NEVER IMPROVES THE VERDICT ────────────────────────────────────────────────────────────────
-- THE ONE THAT MATTERS. If a source going quiet could turn NONE_FOUND_PARTIAL into NONE_FOUND, an outage
-- would be recorded as a clean search — the record would report "nothing found" when the truth is "nobody
-- looked". Decided: adding silence never moves the verdict toward the cleaner class.
theorem a_source_going_silent_never_cleans_the_verdict :
  R.all (fun k => R.all (fun r => R.all (fun s =>
    (verdict k r s == 1) || verdict k r (s + 1) ≥ verdict k r s))) := by decide

-- ── 4 · NONE_FOUND REQUIRES EVERY SOURCE TO HAVE ANSWERED ─────────────────────────────────────────────────
-- The verdict this deposit's kind 2 rests on is the strictest, and it is reachable only from complete
-- evidence. One unanswered source and it is NONE_FOUND_PARTIAL, which the record names and re-searches.
theorem the_clean_verdict_is_reachable_only_from_complete_evidence :
  R.all (fun k => R.all (fun r => R.all (fun s =>
    !(verdict k r s == 2) || (s == 0 && r == 0 && k ≥ 2)))) := by decide

-- ── 5 · EVIDENCE OUTRANKS SILENCE ─────────────────────────────────────────────────────────────────────────
-- A relevant hit is CANDIDATES however many sources failed: something was found, and what else might have
-- been found does not unfind it. The asymmetry is deliberate and is stated rather than left implicit.
theorem a_relevant_hit_outranks_any_amount_of_silence :
  R.all (fun k => R.all (fun r => R.all (fun s =>
    !(k ≥ 2 && r > 0) || verdict k r s == 1))) := by decide

-- ── 6 · THE CONTROL: THE RULE IS NOT CONSTANT ─────────────────────────────────────────────────────────────
-- Theorems 1, 3 and 4 are all satisfied by a rule that always returns one value, which would be a much
-- worse defect and would make this file evidence of the wrong thing. All five verdicts occur.
theorem all_five_verdicts_occur :
  (R.flatMap (fun k => R.flatMap (fun r => R.map (fun s => verdict k r s)))).eraseDups.length == 5 := by decide

-- ── 7 · TOO FEW TERMS IS NOT A RESULT ABOUT THE LITERATURE ────────────────────────────────────────────────
-- It precedes every other test, because a statement offering fewer than two distinctive terms was never
-- searched for — recording it as NONE_FOUND would be the record's own worst overclaim, a clean verdict on
-- a search that did not happen.
theorem too_few_terms_precedes_every_other_test :
  R.all (fun r => R.all (fun s => verdict 0 r s == 0 && verdict 1 r s == 0)) := by decide

-- ── 8 · WHAT THE CLEAN VERDICT STILL DOES NOT SAY ─────────────────────────────────────────────────────────
-- NONE_FOUND means every source answered and nothing cleared the floor, ON THE DAY, AT THAT FLOOR, IN THAT
-- MANY RESULTS. It does not mean nothing earlier exists, and no arithmetic here could make it mean that: a
-- keyword search misses what it does not name, and the floor is a judgement about how much noise to accept.
-- What is decided above is that the rule is total, exclusive and never flattered by silence. Whether the
-- literature was actually searched well is not a property of the rule, and this file does not claim it.
theorem the_rule_is_decided_and_the_search_quality_is_not :
  verdict 5 0 0 == 2 && verdict 5 1 0 == 1 && verdict 5 0 5 == 4 && verdict 5 0 1 == 3 && verdict 1 9 9 == 0
  && sources == 5 := by decide

end Verdict
