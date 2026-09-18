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

def settledHere : Nat := 17
theorem instruments_settles_its_range : settledHere = 17 := rfl

end Instruments
