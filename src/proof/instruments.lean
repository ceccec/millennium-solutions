set_option maxRecDepth 8000000
-- title: The instruments, and the three rules they are allowed to have
-- wing: the floor
-- prior_art: unclassified
-- prior_art_domain: elementary order theory, list processing and string matching
-- prior_art_note: NO NOVELTY IS CLAIMED AND NONE IS DENIED. The three rules are elementary — a strict order
--   with an unknown value, a partition of a list at its last marked position, and removal of every
--   occurrence of a substring — and each is standard enough that naming one author would be arbitrary. This
--   row is kind 1 rather than kind 2 because kind 2 asserts that a search was performed and found nothing,
--   and no such search was performed for these. What is this deposit's is not the rules: it is that three of
--   its own instruments hold them by decision of the kernel, instead of by a block of reasoning written
--   inside the instrument that needs them and checked by that same instrument.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THESE THREE ARE IN LEAN AND NOT IN THE GATE THAT USES THEM.
--
-- Three instruments in this tree were corrected in one week, and every one of them was corrected in the same
-- place: the reasoning it did about itself.
--
--   uses.ts            searched pages for whether they cite the author, and returned exactly one YES across
--                      85 leads — on a page that cites nobody. The page echoed the scanner's own User-Agent
--                      back, and that User-Agent names the author's site. The instrument matched the string
--                      it had just sent, and it was the single flattering result in the run.
--   receipt-audit.ts   failed forever on 29 receipts written five weeks before the rule they are judged by.
--                      Excusing them needs a boundary in time, and a boundary that widens by one instant
--                      excuses a receipt written today.
--   theorem-pages-gate printed one line per missing page and read as hundreds of broken theorems, when the
--                      only thing wrong was a build nobody had run since the ledger grew.
--
-- Each fix was a rule, and each rule was first written as logic inside the gate, checked — where it was
-- checked at all — by that same gate. A gate reporting on its own guard is the shape this deposit refuses
-- everywhere else. So the rules are decided here, over their whole cases, and the TypeScript is required to
-- agree with what the kernel decided (scripts/lean-agree.ts).
--
-- No axioms, no Mathlib, no sorry. Every theorem closes by exhaustion over a stated finite domain.

namespace Instruments

-- ── 1 · A BOUNDARY IN TIME ADMITS EXACTLY WHAT PRECEDES IT ────────────────────────────────────────────────
-- An instant is KNOWN (`some t`) or not (`none`). A rule made at an instant cannot be broken by something
-- written strictly before it; everything else — the instant itself, everything after, and anything whose
-- date cannot be read — falls outside. The last of those is the one that matters: the excusing side must
-- take no case it cannot prove, because that is the side a new unsigned receipt would quietly slip into.
def precedes : Option Nat → Option Nat → Bool
  | some a, some b => a < b
  | _, _ => false

theorem the_strict_order_is_what_is_admitted :
  precedes (some 4) (some 5) = true ∧ precedes (some 5) (some 5) = false
    ∧ precedes (some 6) (some 5) = false := by decide

-- and it is not an accident of one triple: over every pair of instants below twelve
theorem admission_is_exactly_the_strict_order :
  (List.range 12).all (fun a => (List.range 12).all (fun b =>
    precedes (some a) (some b) == decide (a < b))) := by decide

-- THE UNKNOWN IS NEVER ADMITTED, in either position, whatever the other one is
theorem an_unknown_instant_is_never_admitted :
  (List.range 12).all (fun t => precedes none (some t) == false && precedes (some t) none == false)
    ∧ precedes none none = false := by decide

-- and the admitted cases are a proper fraction of the whole: a rule that admitted everything would satisfy
-- every line above except this one
theorem the_boundary_refuses_more_than_it_admits :
  let cases := (List.range 8).map (fun a => precedes (some a) (some 4))
  cases.count true = 4 ∧ cases.count false = 4 := by decide

-- ── 2 · A STALE BUILD IS A TAIL; A REAL DEFECT IS A HOLE ──────────────────────────────────────────────────
-- Given, in append-only order, whether each entry has its artefact, the two causes of "missing" are told
-- apart WITHOUT a flag anyone sets: a build that has not been run since the record grew has artefacts for a
-- prefix and none after, while a genuine defect leaves a HOLE — an absence with a later presence.
-- `built` is the last index that has one, and `none` when nothing is built at all.
def lastPresent : List Bool → Option Nat
  | [] => none
  | b :: bs => match lastPresent bs with
    | some k => some (k + 1)
    | none => if b then some 0 else none

def idx (l : List Bool) : List (Nat × Bool) := (List.range l.length).map (fun i => (i, l.getD i false))

def holes (l : List Bool) : List Nat :=
  (idx l).filterMap (fun p => if !p.2 && precedes (some p.1) (lastPresent l) then some p.1 else none)

def tail (l : List Bool) : List Nat :=
  (idx l).filterMap (fun p => if !p.2 && !precedes (some p.1) (lastPresent l) then some p.1 else none)

theorem a_hole_is_an_absence_with_a_later_presence :
  holes [true, false, true, true] = [1] ∧ tail [true, false, true, true] = [] := by decide

theorem a_stale_tail_is_an_absence_with_nothing_after_it :
  tail [true, true, false, false] = [2, 3] ∧ holes [true, true, false, false] = [] := by decide

theorem the_two_causes_occur_together_and_stay_apart :
  holes [true, false, true, false] = [1] ∧ tail [true, false, true, false] = [3] := by decide

theorem nothing_built_is_all_tail_and_no_hole :
  holes [false, false, false] = [] ∧ tail [false, false, false] = [0, 1, 2]
    ∧ lastPresent [false, false, false] = none := by decide

theorem everything_built_accuses_nobody :
  holes [true, true, true] = [] ∧ tail [true, true, true] = [] := by decide

-- ── AND OVER EVERY PATTERN, NOT THE FIVE ABOVE. Five hand-written cases are five chances to have picked the
--    ones that work. Every list of booleans up to length five is generated and checked: the two causes never
--    overlap, and together they account for every absence — nothing counted twice, nothing dropped.
def bits : Nat → List (List Bool)
  | 0 => [[]]
  | Nat.succ n => (bits n).flatMap (fun l => [false :: l, true :: l])

theorem the_pattern_generator_is_complete :
  (bits 5).length = 32 ∧ (bits 3).length = 8 ∧ ((bits 3).eraseDups).length = 8 := by decide

set_option maxRecDepth 100000 in
theorem every_absence_is_charged_to_exactly_one_cause :
  ((bits 1) ++ (bits 2) ++ (bits 3) ++ (bits 4) ++ (bits 5)).all (fun l =>
    let h := holes l
    let t := tail l
    let missing := (idx l).filterMap (fun p => if !p.2 then some p.1 else none)
    (h.all (fun x => !(t.contains x))) && ((h ++ t).length == missing.length)
      && missing.all (fun m => (h ++ t).contains m)) := by decide

-- ── 3 · WHAT THE MEASURER INJECTED IS NOT EVIDENCE ────────────────────────────────────────────────────────
-- Before a response is tested for a signal, whatever the request put into it is removed. Text is a list of
-- character codes, as in address.lean and merkle.lean; `self` is what the measurer sent. An empty witness
-- removes nothing, which is the case that keeps this from being a licence to erase.
def startsWith : List Nat → List Nat → Bool
  | _, [] => true
  | [], _ :: _ => false
  | x :: xs, y :: ys => if x == y then startsWith xs ys else false

def unreflect (fuel : Nat) (self : List Nat) (t : List Nat) : List Nat :=
  match fuel, t with
  | 0, r => r
  | _, [] => []
  | Nat.succ f, x :: xs =>
    if self.isEmpty then x :: xs
    else if startsWith (x :: xs) self then 32 :: unreflect f self ((x :: xs).drop self.length)
    else x :: unreflect f self xs

def UA : List Nat := [117, 97, 58, 115, 105, 116, 101]          -- "ua:site"
def SITE : List Nat := [115, 105, 116, 101]                     -- "site" — the signal a citation is read by
def clip (t : List Nat) : List Nat := unreflect t.length UA t

def contains (t : List Nat) (n : List Nat) : Bool :=
  ((List.range t.length).map (fun i => startsWith (t.drop i) n)).any id

-- a page that only echoes the measurer back carries the signal BEFORE the subtraction and not after:
-- both halves are stated, because the first is what makes the second mean anything
def echoed : List Nat := [60, 112, 62] ++ UA ++ [60, 47, 112, 62]        -- "<p>ua:site</p>"
theorem an_echo_carries_the_signal_only_until_it_is_subtracted :
  contains echoed SITE = true ∧ contains (clip echoed) SITE = false := by decide

-- and a page that really does carry the signal still carries it after the subtraction
def genuine : List Nat := [60, 112, 62] ++ SITE ++ [60, 47, 112, 62]     -- "<p>site</p>"
theorem the_page_s_own_words_survive_the_subtraction :
  contains genuine SITE = true ∧ contains (clip genuine) SITE = true := by decide

-- EVERY copy goes, not the first — an instrument that removed one of two would still read its own reflection
def twice : List Nat := UA ++ [32] ++ UA
theorem every_copy_of_the_witness_is_removed :
  contains (clip twice) SITE = false := by decide

-- the subtraction is idempotent: applying it again changes nothing, so it cannot keep eating the page
theorem subtracting_twice_is_subtracting_once :
  clip (clip echoed) = clip echoed ∧ clip (clip genuine) = clip genuine := by decide

-- AND AN EMPTY WITNESS REMOVES NOTHING. Without this the definition would be satisfied by one that erases
-- everything, and a scanner that erased every page would report a world that cites nobody.
theorem an_empty_witness_removes_nothing :
  unreflect genuine.length [] genuine = genuine ∧ unreflect echoed.length [] echoed = echoed := by decide

-- text that never carried the witness is returned unchanged
theorem text_without_the_witness_is_untouched :
  clip SITE = SITE ∧ clip [60, 112, 62] = [60, 112, 62] := by decide

-- ── 4 · THE REFUSAL WINDOW, WHICH IS THE LENIENT SIDE OF EVERY CLAIM DETECTOR ───────────────────────────
-- A detector that caught every sentence containing "we prove the Riemann hypothesis" would drain this
-- deposit's own refusals and push its boundaries out of the prose that carries them. So a match is CLEARED
-- when a negator stands before it — "this work proves no Clay problem" matches the detector and is refused
-- by the window. That window is the one path in the whole sweep that turns a catch into a pass, which makes
-- it the place a widening would go unnoticed: widen it and every claim is excused while the report stays
-- green and the count stays large.
--
-- The rule quantifies over a LIST — ANY negator before the claim — and that is the part worth deciding. A
-- single position would be `precedes` from section 1 wearing a different name, and one derivation of a fact
-- is this file's whole subject.
def refused (negs : List Nat) (claim : Nat) : Bool := negs.any (fun n => n < claim)

theorem any_negator_before_the_claim_refuses_it :
  refused [7, 2, 9] 5 = true ∧ refused [7, 9] 5 = false ∧ refused [5] 5 = false := by decide

-- MOVING THE CLAIM LATER CAN ONLY REFUSE IT MORE. If it were not monotone, a sentence could be cleared by a
-- negator and then un-cleared by adding words after it, which is not a property of English or of this sweep.
theorem the_window_is_monotone_in_the_claim_s_position :
  (List.range 10).all (fun c => (List.range 10).all (fun d =>
    if c ≤ d then (!(refused [3] c) || refused [3] d) else true)) := by decide

-- AND A SENTENCE THAT REFUSES NOTHING CLEARS NOTHING. Without this the definition is satisfied by a window
-- that excuses everything, which is exactly the failure it exists to prevent — and it is the empty case,
-- the one a reader assumes rather than checks.
theorem with_no_negator_nothing_is_cleared :
  (List.range 10).all (fun c => refused [] c == false) := by decide

-- ── THE FOURTH INSTRUMENT, AND THE RULE IT GOT WRONG TWICE ───────────────────────────────────────────────
-- control-probe.ts perturbs files to find out whether a gate notices, and then has to put the tree back. It
-- put it back with `git checkout -- .` — the whole tree — defended by one sentence: the probe refuses to
-- start on a dirty tree, so anything dirty afterwards is the probe's own doing. On 2026-09-20 that reverted
-- two source files being edited while it ran. The first repair narrowed the claim: record what is dirty
-- BEFORE each gate runs, attribute only what appeared during it. That was still wrong, and the test said so
-- — a marker written mid-run was destroyed again and reported as the probe's own.
--
-- The rule is small enough to decide, so it is decided here rather than argued in the instrument. `mine` is
-- the scoped attribution exactly as it was written: of the paths dirty afterwards, those that are tracked
-- and were not dirty before. Four theorems say what it gets right — and they are worth having, because the
-- rule is not stupid. The fifth says what it cannot do, and that one is the finding: there is a case where a
-- path somebody else wrote during the run is attributed to the run, and no examination of the sets can tell
-- it from the run's own output. A revert built on `mine` deletes that person's work.
--
-- The sixth and seventh are why the second repair is different in kind rather than merely tighter. If the
-- run changes nothing in a tree, `mine` is empty there for every prior state whatsoever — so a probe that
-- does its work in a disposable worktree reverts nothing in this one, and the question the first two
-- versions were trying to answer stops being asked. The eighth says the split is a partition: nothing is
-- both reverted and left alone, and nothing is neither.
def paths : List Nat := List.range 4
def setOf (m : Nat) : List Nat := paths.filter (fun i => (m >>> i) % 2 == 1)
def mine (pre post tracked : List Nat) : List Nat :=
  post.filter (fun p => tracked.contains p && ! pre.contains p)
def subset (a b : List Nat) : Bool := a.all (fun x => b.contains x)

-- 1 · what was already dirty is never charged to the run
theorem a_path_dirty_before_the_run_is_never_attributed_to_it :
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun t =>
    (mine (setOf a) (setOf b) (setOf t)).all (fun p => ! (setOf a).contains p)))) := by decide

-- 2 · nor is anything the tool was told not to touch
theorem an_untracked_path_is_never_attributed :
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun t =>
    (mine (setOf a) (setOf b) (setOf t)).all (fun p => (setOf t).contains p)))) := by decide

-- 3 · the attribution is contained in what is actually dirty — it never invents a path
theorem nothing_is_attributed_that_is_not_dirty_afterwards :
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun t =>
    subset (mine (setOf a) (setOf b) (setOf t)) (setOf b)))) := by decide

-- 4 · knowing MORE was already dirty can only ever charge the run with less
theorem a_wider_record_of_what_was_dirty_attributes_no_more :
  (List.range 16).all (fun a => (List.range 16).all (fun a' => (List.range 16).all (fun b =>
    ! subset (setOf a) (setOf a') || subset (mine (setOf a') (setOf b) paths) (mine (setOf a) (setOf b) paths)))) := by decide

-- 5 · THE FINDING. A path that was clean when the run began, was written by somebody else during it, and is
--     tracked, is attributed to the run. The sets cannot distinguish it from the run's own output, so a
--     revert built on this rule deletes that work. This is the case that was hit twice.
theorem a_change_made_by_another_hand_during_the_run_is_charged_to_the_run :
  (List.range 16).any (fun a => (List.range 16).any (fun b => paths.any (fun p =>
    ! (setOf a).contains p && (setOf b).contains p && (mine (setOf a) (setOf b) paths).contains p))) := by decide

-- 6 · a run that changed nothing here charges nothing here, whatever was dirty before
theorem a_run_that_changes_nothing_attributes_nothing :
  (List.range 16).all (fun a => (List.range 16).all (fun t => mine (setOf a) (setOf a) (setOf t) == [])) := by decide

-- 7 · THIS WAS A SECOND SPELLING OF 6 — `.length = 0` beside `== []`, two derivations of one fact, which is
--     the defect this repository is named for catching. It says something of its own now: the revert is
--     complete in ONE pass. Attribute again over what is left after reverting and nothing is attributed, so
--     no sweep can find more to delete on a second look. An instrument that had to run its own revert twice
--     would be one whose first pass did not mean what it said.
theorem reverting_once_leaves_nothing_further_to_attribute :
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun t =>
    let m := mine (setOf a) (setOf b) (setOf t)
    mine (setOf a) ((setOf b).filter (fun p => ! m.contains p)) (setOf t) == []))) := by decide

-- 8 · reverted and left-alone partition what is dirty: nothing is both, nothing is neither
theorem the_reverted_and_the_untouched_partition_what_is_dirty :
  (List.range 16).all (fun a => (List.range 16).all (fun b =>
    let m := mine (setOf a) (setOf b) paths
    let rest := (setOf b).filter (fun p => ! m.contains p)
    m.all (fun p => ! rest.contains p) && (setOf b).all (fun p => m.contains p || rest.contains p))) := by decide

def settledHere : Nat := 28
theorem instruments_settles_its_range : settledHere = 28 := rfl

end Instruments
