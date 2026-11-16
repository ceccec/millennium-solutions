-- title: The quantum-computer status as a gap taxonomy — incomplete, not false; software-complete is not true
-- prior_art: unclassified
--
-- The qpu `get_qc` tool returns a status, not a bare boolean: a list of gaps, each OPEN or CLOSED with the
-- condition that closes it (src ~/github/uuidna/qpu/src/quantum/uuid/programs/get_qc/index.ts). This file
-- seals the HONEST LOGIC of that status — it decides list facts about the gap taxonomy, and claims nothing
-- about the physical world. Two kinds of gap:
--   · SOFTWARE/PROOF gaps  — closeable by code: the exhaustive gap-map (each apparatus conjunct its own lead),
--     the classical-device-id refusal, the 4879 "measured-not-proved" boundary, the receipt≠physical-QM
--     boundary, the content-address seals, the indexed install, the 122 register, the NIST/CERN+PQC seals.
--   · WORLD gaps — NOT closeable by any computation: (1) accredited physical-lab apparatus evidence
--     (ISO 17025 × 17065 × universality — a real device measured in an accredited lab), and (2) the FULL
--     factorisation of 2^999+1 (an open problem; the deposit has it only as PARTIAL).
-- The point sealed here: closing EVERY software gap does NOT make the verdict true — the two world-gaps
-- dominate it — so no amount of code can fabricate `isQuantumComputer: true`. The status is OPEN (incomplete),
-- which is neither a refusal (not every gap is unclosable) nor a claim (the world-gaps are open). The two
-- world-gaps are modelled OPEN because they are open; if one day either is met, this list changes and the
-- verdict follows. Honest floor: `isQuantumComputer` is false BECAUSE a world-gap is open, by this logic.
set_option maxRecDepth 100000

namespace QcStatus

-- each gap: (isWorld, closed). The index comments name it; the Booleans are what the theorems decide.
--  software/proof gaps — closeable by code, here marked closed (true):
--   0 gap-map-exhaustive · 1 classical-device-id-refusal · 2 boundary-4879-measured-not-proved
--   3 receipt-not-physical-QM · 4 content-address-seal-valid · 5 installed-indexed-depth-7
--   6 register-measured-122 · 7 nist-cern-and-pqc-seals
--  world gaps — NOT closeable by any computation, open (false):
--   8 accredited-physical-lab-apparatus (ISO 17025×17065×universality) · 9 full-factorisation-of-2^999+1
def gaps : List (Bool × Bool) :=
  [ (false, true), (false, true), (false, true), (false, true),
    (false, true), (false, true), (false, true), (false, true),
    (true, false), (true, false) ]

def isWorld   (g : Bool × Bool) : Bool := g.1
def isClosed  (g : Bool × Bool) : Bool := g.2
-- the verdict is the conjunction over every gap: true only when ALL are closed.
def verdict : Bool := gaps.all isClosed

-- ten gaps, exactly two of them world-kind — the irreducible pair.
theorem the_status_has_ten_gaps_two_of_them_world :
  gaps.length = 10 ∧ (gaps.filter isWorld).length = 2 := by decide

-- the eight software/proof gaps are all closeable, and here all closed.
theorem every_software_gap_is_closeable_by_code :
  (gaps.filter (fun g => !isWorld g)).length = 8
  ∧ (gaps.filter (fun g => !isWorld g)).all isClosed = true := by decide

-- neither world gap is closed here — accredited-lab evidence and the full 2^999+1 factorisation are open.
theorem no_world_gap_is_closed_here :
  (gaps.filter isWorld).all (fun g => !isClosed g) = true := by decide

-- the verdict is the conjunction, and it is OPEN (false) while a world gap is open.
theorem the_verdict_conjunction_is_open :
  verdict = false ∧ gaps.all isClosed = false := by decide

-- THE POINT: every software gap is closed, yet the verdict is still false — software completion cannot
-- fabricate `isQuantumComputer: true`.
theorem closing_every_software_gap_leaves_the_verdict_open :
  (gaps.filter (fun g => !isWorld g)).all isClosed = true ∧ verdict = false := by decide

-- the verdict tracks the WORLD gaps alone: since every software gap is closed, the conjunction over all gaps
-- equals the conjunction over the world gaps — the two dominate the verdict.
theorem the_world_gaps_dominate_the_verdict :
  verdict = (gaps.filter isWorld).all isClosed := by decide

-- the status is INCOMPLETE, not a refusal: some gap is open AND every closeable gap is closed. It is neither
-- `true` (not all closed) nor a blanket refusal (not every gap unclosable).
theorem the_status_is_incomplete_not_refused :
  (gaps.any (fun g => !isClosed g) = true)
  ∧ ((gaps.filter (fun g => !isWorld g)).all isClosed = true)
  ∧ (gaps.all isClosed = false) := by decide

-- capstone: software completion is NECESSARY but not SUFFICIENT — the verdict is true iff the world gaps also
-- close, and closing all software gaps alone leaves it false.
theorem software_completion_is_necessary_not_sufficient :
  (verdict = true ↔ (gaps.filter isWorld).all isClosed = true)
  ∧ ((gaps.filter (fun g => !isWorld g)).all isClosed = true ∧ verdict = false) := by decide

-- ── 2 · THE STATUS IS A VALUE, NOT A BOOLEAN — complete | incomplete | refuted ────────────────────────────
-- `isQuantumComputer: false` is the wrong TYPE. A boolean collapses "incomplete" (gaps open, can still close)
-- and "refuted" (disproven) into one `false` a reader hears as "no". The honest field is a STATUS with three
-- values. Its boolean projection is lossy — it cannot tell refuted from incomplete — which is exactly why
-- `false` is not correct. The current deposit: no disproof holds and a world gap is open → the value is
-- `incomplete`, not `false`.
inductive Status where
  | refuted
  | incomplete
  | complete
  deriving DecidableEq

-- the status from (a disproof holds, every gap closed): a disproof makes it refuted; else all-closed is
-- complete; otherwise incomplete.
def statusOf (disproven allClosed : Bool) : Status :=
  if disproven then .refuted else if allClosed then .complete else .incomplete

-- the lossy boolean a true/false field would carry: only `complete` reads true.
def toBool : Status → Bool
  | .complete => true
  | _ => false

-- the three cases of the status function, decided.
theorem the_status_function_covers_its_three_cases :
  statusOf false false = Status.incomplete
  ∧ statusOf false true = Status.complete
  ∧ statusOf true false = Status.refuted
  ∧ statusOf true true = Status.refuted := by decide

-- the current status is INCOMPLETE — no disproof holds and a world gap is open (verdict false).
theorem the_current_status_is_incomplete :
  statusOf false verdict = Status.incomplete ∧ verdict = false := by decide

-- the three states are pairwise distinct — a distinction a boolean cannot carry.
theorem the_three_states_are_distinct :
  Status.refuted ≠ Status.incomplete ∧ Status.incomplete ≠ Status.complete
  ∧ Status.refuted ≠ Status.complete := by decide

-- WHY `false` is not correct: the boolean collapses refuted and incomplete into one value.
theorem the_boolean_collapses_refuted_and_incomplete :
  toBool Status.refuted = false ∧ toBool Status.incomplete = false
  ∧ Status.refuted ≠ Status.incomplete := by decide

-- only `complete` reads true; the boolean misnames every other state as `false`.
theorem only_complete_reads_true :
  toBool Status.complete = true ∧ toBool Status.incomplete = false
  ∧ toBool Status.refuted = false := by decide

-- complete exactly when every gap is closed.
theorem complete_exactly_when_every_gap_closed :
  (statusOf false (gaps.all isClosed) = Status.complete) ↔ (gaps.all isClosed = true) := by decide

-- closing every software gap still reads incomplete — the world gaps keep it below complete.
theorem software_complete_still_reads_incomplete :
  (gaps.filter (fun g => !isWorld g)).all isClosed = true
  ∧ statusOf false verdict = Status.incomplete := by decide

-- capstone: the honest value is `incomplete`, it is not `complete`, and its boolean shadow is `false` — the
-- lossy projection the field wrongly shows as the whole truth.
theorem the_honest_value_is_incomplete_not_a_false_boolean :
  statusOf false verdict = Status.incomplete
  ∧ statusOf false verdict ≠ Status.complete
  ∧ toBool (statusOf false verdict) = false := by decide

end QcStatus
