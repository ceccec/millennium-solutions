set_option maxRecDepth 100000
-- title: The discovery ranking is monotone, and it is far coarser than it looks
-- wing: the record
-- prior_art: named
-- prior_art_domain: additive scoring over binary criteria — a weighted sum, the simplest form of
--   multi-criteria decision analysis; and the pigeonhole counting that says a sum over few weights cannot
--   separate many subsets.
-- prior_art_note: NEITHER IS THIS DEPOSIT'S. A weighted sum of indicators is the oldest scoring rule there
--   is, and counting how many subsets share a total is pigeonhole. What is this deposit's is that ITS OWN
--   queue — which decides where the next prior-art search goes — is put to both, and that the second
--   answer is unflattering and recorded anyway.
-- prior_art_search: not performed — both are named above.
-- prior_art_pool: unbounded
-- prior_art_own: the coarseness count in theorem 4, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- scripts/discoveries.ts orders every theorem by six binary signals with weights I chose: the file declares
-- its own work (3), no search is recorded (3), the prior-art pool is unbounded (1), the file is
-- unclassified (2), the family is at octave scale (1), the theorem is general rather than exhaustive (1).
--
-- Nothing justified those numbers and nothing checked them. A ranking that decides where scarce attention
-- goes is exactly the kind of rule that gets trusted because it produces a sorted list, and a sorted list
-- looks like a finding whatever it is sorting on.
--
-- TWO QUESTIONS, AND THE SECOND IS THE ONE WORTH ASKING.
--
-- Is it MONOTONE — does turning a signal on ever LOWER a score? If it did, the queue would push work away
-- from the evidence that recommended it, and no reader would see that in a sorted list. It does not:
-- theorem 1, over all sixty-four signal combinations.
--
-- And how much can it actually SEPARATE? Sixty-four combinations collapse onto twelve scores. Nine
-- different signal sets share the score 4, and nine more share 5, 6 and 7 — so at the middle of the queue,
-- where most theorems sit, the ranking is holding nine distinguishable states as one. It is an ORDINAL
-- HINT over a partial order, not a ranking, and reading the top of the list as "the nine best candidates"
-- reads a precision the arithmetic does not carry. Theorem 4 counts it.
--
-- THE WEIGHTS ARE NOT DEFENDED HERE AND CANNOT BE. There is no fact about prior art that fixes whether an
-- unclassified file is worth two of something and an unbounded pool worth one. They are a judgement, like
-- the relevance floor in src/novelty, and the honest treatment is the same: carry them where they can be
-- seen and disagreed with, and decide only what is decidable about them.
--
-- No axioms, no Mathlib, no sorry.

namespace Ranking

-- own · nosearch · unbounded · unclassified · octave · general, in the order scripts/discoveries.ts applies
def weights : List Nat := [3, 3, 1, 2, 1, 1]

/-- A signal set is a six-bit mask; the score is the sum of the weights it turns on. -/
def bit (m i : Nat) : Bool := (m / 2 ^ i) % 2 == 1
def score (m : Nat) : Nat :=
  (List.range 6).foldl (fun acc i => acc + (if bit m i then weights.getD i 0 else 0)) 0

def masks : List Nat := List.range 64

-- ── 1 · MONOTONE — EVIDENCE NEVER LOWERS A SCORE ──────────────────────────────────────────────────────────
-- Turning a signal on never moves a candidate down the queue. Without this the ranking could push work
-- away from the very evidence that recommended it, invisibly, behind a sorted list.
theorem turning_a_signal_on_never_lowers_the_score :
  masks.all (fun m => (List.range 6).all (fun i =>
    bit m i || score (m + 2 ^ i) ≥ score m)) := by decide

-- ── 2 · AND STRICTLY, BECAUSE EVERY WEIGHT IS POSITIVE ────────────────────────────────────────────────────
-- A zero weight would be a signal collected and then ignored — worse than not collecting it, because the
-- code would read as if it counted.
theorem every_signal_strictly_raises_the_score :
  masks.all (fun m => (List.range 6).all (fun i =>
    bit m i || score (m + 2 ^ i) > score m))
  && weights.all (fun w => w > 0) := by decide

-- ── 3 · THE RANGE IS ZERO TO ELEVEN ───────────────────────────────────────────────────────────────────────
theorem the_score_runs_from_zero_to_eleven :
  score 0 == 0 && score 63 == 11 && weights.foldl (· + ·) 0 == 11
  && masks.all (fun m => score m ≤ 11) := by decide

-- ── 4 · SIXTY-FOUR STATES COLLAPSE ONTO TWELVE SCORES ─────────────────────────────────────────────────────
-- THE THEOREM THIS FILE IS FOR, and it is unflattering. The ranking cannot separate what it collects: nine
-- distinct signal sets share the score 4, nine share 5, nine share 6, nine share 7 — and the middle of the
-- queue is where most theorems sit. A sorted list of these is an ordinal hint over a partial order.
theorem the_ranking_holds_nine_distinguishable_states_as_one :
  (masks.map score).eraseDups.length == 12
  && (masks.filter (fun m => score m == 4)).length == 9
  && (masks.filter (fun m => score m == 5)).length == 9
  && (masks.filter (fun m => score m == 6)).length == 9
  && (masks.filter (fun m => score m == 7)).length == 9 := by decide

-- ── 5 · ONLY THE EXTREMES ARE UNAMBIGUOUS ─────────────────────────────────────────────────────────────────
-- Exactly one signal set scores 0 and exactly one scores 11, so the very top and the very bottom of the
-- queue mean something precise and nothing between them does.
theorem only_the_top_and_the_bottom_identify_their_evidence :
  (masks.filter (fun m => score m == 0)).length == 1
  && (masks.filter (fun m => score m == 11)).length == 1
  && (masks.filter (fun m => score m == 0)) == [0]
  && (masks.filter (fun m => score m == 11)) == [63] := by decide

-- ── 6 · THE CONTROL: A FINER RULE WOULD SEPARATE MORE ─────────────────────────────────────────────────────
-- Theorems 4 and 5 would hold of any coarse rule, including a broken one. Powers of two separate all
-- sixty-four states, so the collapse measures THESE weights and not the counting method. It is also what
-- the weights would have to become to carry the precision a sorted list implies — and they should not,
-- because they are a judgement and not a measurement.
theorem distinct_powers_would_separate_every_state :
  (masks.map (fun m => (List.range 6).foldl (fun acc i => acc + (if bit m i then 2 ^ i else 0)) 0)).eraseDups.length == 64 := by decide

-- ── 7 · THE TWO HEAVIEST SIGNALS ARE THE TWO THAT MEAN THE MOST ───────────────────────────────────────────
-- Stated so the judgement is visible rather than buried in a list of numbers: "the file claims its own
-- work" and "nobody has looked" each outweigh any other single signal, and together they outweigh all four
-- of the rest.
theorem the_two_heaviest_signals_outweigh_all_the_others :
  weights.getD 0 0 == 3 && weights.getD 1 0 == 3
  && weights.getD 0 0 + weights.getD 1 0 > weights.getD 2 0 + weights.getD 3 0 + weights.getD 4 0 + weights.getD 5 0 := by decide

-- ── 8 · WHAT A HIGH SCORE DOES NOT MEAN ───────────────────────────────────────────────────────────────────
-- It does not mean a statement is novel, or interesting, or unpublished. It means six checkable facts about
-- WHERE IT SITS IN THIS TREE happen to coincide, and the queue exists to spend a search on it. Only a
-- performed search says anything about the literature, which is decided in src/proof/verdict.lean and is a
-- different file for a reason. A ranking that could establish novelty would not need the search.
theorem a_high_score_orders_attention_and_settles_nothing :
  score 63 == 11 && score 0 == 0
  && (masks.filter (fun m => score m ≥ 8)).length == 14
  && (masks.filter (fun m => score m ≥ 8)).length < masks.length := by decide

end Ranking
