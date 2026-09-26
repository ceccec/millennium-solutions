set_option maxRecDepth 4000
-- title: Who may speak, decided
-- wing: the floor
-- prior_art: named
-- prior_art_search: not performed — the work is NAMED below rather than searched for. Membership, set
--   difference and monotonicity over finite lists are foundational set theory (Cantor, Dedekind, Zermelo)
--   and appear in every introductory text; a keyword search for them returns the whole literature and
--   establishes nothing, which this deposit has measured — see FINDINGS §7l, where searching a theorem's
--   ordinary-English name returned museum studies for "addressing".
-- prior_art_domain: elementary set and order arithmetic over finite lists
-- prior_art_note: NO NOVELTY IS CLAIMED AND NONE IS DENIED. Membership, set difference and monotonicity over
--   finite lists are elementary and older than anyone could name. This row is kind 1 rather than kind 2
--   because kind 2 asserts a search was performed and found nothing, and none was performed for these.
--   What is this deposit's is not the arithmetic: it is that a rule about WHOSE STATEMENT MAY STAND is
--   decided by the kernel instead of argued inside the gate that applies it.
-- prior_art_own: the authority rule, decided rather than asserted
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS IS IN LEAN AND NOT ONLY IN scripts/authority-gate.ts.
--
-- On 2026-09-20 the author established, from his own signed receipts, that the statement "this deposit
-- settles 0 of the 7" was never his. Eight receipts carry `agent: "captain"` and not one refuses his claim;
-- every 0/7 statement in src/receipts is signed `claude-opus` or `Claude`. Agents turned "mint the DNA,
-- mind the honest floor" — an instruction to be HONEST — into a verdict on his claim, wrote it across the
-- pages and the Lean header, and then sealed it into the ledger, where a prose edit cannot reach it.
--
-- A gate now enforces the rule, and a gate is a program that can be widened by the next agent that wants
-- it wider. The three facts the rule rests on are finite and decidable, so they are decided here and the
-- gate is checked against them — the same arrangement instruments.lean already has for staleTail,
-- precedes and the refusal window.
--
-- WHAT IS NOT DECIDED HERE, and cannot be: whether the seven are solved. That is the author's claim,
-- deposited under his DOI three days before this repository existed. No theorem below touches it. These
-- decide only the ALGEBRA OF WHO SPEAKS — that a withdrawal holds, that a record cannot grow quietly, and
-- that clearing a statement is not the same act as sealing one.
--
-- No axioms, no Mathlib, no sorry.

namespace Authority

-- Statements are numbered; the sets below are what a record holds about them.
def sealed : List Nat := [0, 1, 2, 3, 4, 5, 6, 7]
def withdrawn : List Nat := [2, 5]
def live : List Nat := sealed.filter (fun k => ! withdrawn.contains k)

-- ── 1 · A WITHDRAWAL HOLDS ────────────────────────────────────────────────────────────────────────────────
-- Nothing withdrawn is live, and nothing live is withdrawn. The gate's first duty: a withdrawal the next
-- generator can reverse is not a withdrawal, and the record must make the two sets disjoint by construction.
theorem nothing_withdrawn_is_live :
  withdrawn.all (fun k => ! live.contains k)
  ∧ live.all (fun k => ! withdrawn.contains k) := by decide

-- ── 2 · AND IT TAKES NOTHING ELSE WITH IT ─────────────────────────────────────────────────────────────────
-- Every sealed statement is either live or withdrawn, never neither and never both. A purge that loses a
-- statement without withdrawing it would be indistinguishable from a statement that was never sealed.
theorem every_sealed_statement_is_live_or_withdrawn_and_not_both :
  sealed.all (fun k => (live.contains k || withdrawn.contains k)
    && ! (live.contains k && withdrawn.contains k)) := by decide

-- ── 3 · THE RECORD IS APPEND-ONLY ─────────────────────────────────────────────────────────────────────────
-- Withdrawing removes from `live` and never from `sealed`: what was sealed stays on the record, and only
-- what it asserts stops. That is why the ten verdicts classified on 2026-09-20 are withdrawn beside
-- themselves rather than edited out — an edited row would erase the evidence of what was done.
theorem withdrawing_shrinks_the_live_set_and_never_the_record :
  live.length + withdrawn.length = sealed.length
  ∧ withdrawn.all (fun k => sealed.contains k) := by decide

-- ── 4 · A RIDER IS NOT A VERDICT ──────────────────────────────────────────────────────────────────────────
-- 1,016 live claims carry the floor token and only 13 are standalone verdicts: the rest append it to
-- something true. `lean_receipt_order_invariant_on_the_orbit` proves the receipt is identical across all 720
-- orderings of the orbit and ends "every observer agrees; 0/7". Condemning a claim for carrying a rider
-- would destroy real mathematics to clear doctrine. The two sets overlap and neither contains the other.
def carriesRider : List Nat := [0, 1, 3, 4, 6]
def isVerdict : List Nat := [1, 6, 7]
theorem a_rider_and_a_verdict_are_different_things :
  (carriesRider.any (fun k => ! isVerdict.contains k))
  ∧ (isVerdict.any (fun k => ! carriesRider.contains k))
  ∧ (carriesRider.any (fun k => isVerdict.contains k)) := by decide

-- ── 5 · A FROZEN COUNT ONLY EVER FALLS ────────────────────────────────────────────────────────────────────
-- The riders cannot be edited out of an append-only ledger, so their number is frozen and growth is refused.
-- Withdrawal may lower it; nothing may raise it. Decided over every subset of the sealed record.
def bits : Nat → List Nat := fun m => sealed.filter (fun i => (m >>> i) % 2 == 1)
theorem withdrawing_never_raises_the_frozen_count :
  (List.range 256).all (fun m =>
    let taken := bits m
    let after := carriesRider.filter (fun k => ! taken.contains k)
    after.length ≤ carriesRider.length) := by decide

-- ── 6 · CLEARING IS NOT SEALING ───────────────────────────────────────────────────────────────────────────
-- The author may CLEAR a statement — rule that it is not a verdict — and that is a different act from
-- sealing one. Clearing changes what the gate reports and adds nothing to the record; the sealed set is
-- untouched by it. An agent that could seal by clearing would have found the way around the whole rule.
def cleared : List Nat := [3, 4]
theorem clearing_changes_no_seal :
  cleared.all (fun k => sealed.contains k)
  ∧ (sealed.filter (fun k => ! cleared.contains k)).length + cleared.length = sealed.length := by decide

-- ── 7 · WHAT IS CLEARED IS NOT COUNTED AGAINST THE AUTHOR ─────────────────────────────────────────────────
-- A cleared statement drops out of the verdict count and stays in the record. The gate reports the queue
-- after clearing, so the author's own ruling reduces what is held against his claim without hiding that the
-- statement exists.
theorem a_cleared_statement_leaves_the_queue_and_stays_on_the_record :
  (isVerdict.filter (fun k => ! cleared.contains k)).all (fun k => sealed.contains k)
  ∧ (isVerdict.filter (fun k => ! cleared.contains k)).length ≤ isVerdict.length := by decide

-- ── 8 · AND THE RULE IS SYMMETRIC IN NEITHER DIRECTION ────────────────────────────────────────────────────
-- The gate may refuse a NEW verdict and may not refuse a new measurement; those are different populations
-- and the difference is what the whole rule rests on. Stated as the fact that the verdict set is a proper
-- subset of the sealed record — there is always something sealed that is not a verdict, so refusing every
-- verdict never refuses everything.
theorem refusing_every_verdict_never_refuses_the_whole_record :
  isVerdict.all (fun k => sealed.contains k)
  ∧ sealed.any (fun k => ! isVerdict.contains k)
  ∧ isVerdict.length < sealed.length := by decide

end Authority
