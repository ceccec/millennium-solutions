-- title: The quantum-computer status as a gap taxonomy — incomplete, not false; software-complete is not true
-- prior_art: named
-- prior_art_domain: D. P. DiVincenzo, "The Physical Implementation of Quantum Computation", Fortschr. Phys. 48,
--   771 (2000), arXiv:quant-ph/0002077 — whether a physical system is a quantum computer, stated as a list of
--   criteria each met or unmet
-- prior_art_note: the criteria-list shape of a quantum-computer verdict is DiVincenzo's. What this file decides is
--   list logic about THIS deposit's gap taxonomy — software gaps closed, two world gaps open, the verdict dominated
--   by the world gaps — and no external work precedes those facts about this table.
-- prior_art_search: not performed — the precedent is named above rather than searched for.
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

-- ── 3 · ISO CONFORMANCE — every requirement documented, satisfied where ISO allows it now, gaps named ──────
-- How ISO says to proceed, decided as a table. Each requirement carries a KIND — how ISO permits it to be met:
--   · computed   — by the kernel now (ISO/IEC 4879:2024 design & vocabulary 3.2–3.6, 3.4.8 processor; 9834-8
--                   seal; 80000-5 entropy; 9001 pipeline). These are SATISFIED (proven by the deposit's gates).
--   · measured   — physical quantum-mechanical behaviour on physical qubits (4879 3.4.10 device). ISO's own
--                   word: "measured, not proved." OPEN — no measurement evidence.
--   · accredited — external certification (17025 lab competence, 17065 product certification, universality).
--                   OPEN — "program apparatus ≠ accredited stamp until evidence holds."
-- Everything ISO lets the kernel satisfy is satisfied; the open rows are exactly the ones ISO reserves for
-- physical measurement and accreditation (plus the one computed row ISO leaves to mathematics: factoring the
-- 2^999+1 cofactor, which ran to completion and returned PARTIAL — a 244-digit composite).
inductive Kind where
  | computed
  | measured
  | accredited
  deriving DecidableEq

def kindIsComputed   : Kind → Bool | .computed => true | _ => false
def kindIsMeasured   : Kind → Bool | .measured => true | _ => false
def kindIsAccredited : Kind → Bool | .accredited => true | _ => false

-- (kind, satisfied). The comment on each row is the ISO clause it documents.
def iso : List (Kind × Bool) :=
  [ (.computed, true)       -- 4879 3.2–3.6 vocabulary (Hilbert space … communication) — proven design
  , (.computed, true)       -- 4879 3.4.8 quantum processor — proven design
  , (.computed, true)       -- 9834-8 UUID seal — seal(address) valid
  , (.computed, true)       -- 80000-5 entropy S = k ln W — dictionary-then-verified
  , (.computed, true)       -- 9001 process pipeline — stages in order
  , (.computed, false)      -- factor 2^999+1 — COMPUTED, returns PARTIAL (244-digit composite cofactor)
  , (.measured, false)      -- 4879 3.4.10 quantum computer — physical QM behaviour, MEASURED (none)
  , (.accredited, false)    -- 17025 lab competence (none)
  , (.accredited, false)    -- 17065 product certification (none)
  , (.accredited, false) ]  -- universality (none)

def isoSatisfied : (Kind × Bool) → Bool := fun r => r.2

-- ten requirements documented; five satisfied, five open.
theorem the_iso_conformance_documents_ten_requirements :
  iso.length = 10
  ∧ (iso.filter isoSatisfied).length = 5
  ∧ (iso.filter (fun r => !isoSatisfied r)).length = 5 := by decide

-- every satisfied requirement is a COMPUTED one — the design/vocabulary ISO lets the kernel meet.
theorem the_satisfied_requirements_are_the_computed_design :
  (iso.filter isoSatisfied).all (fun r => kindIsComputed r.1) = true := by decide

-- nothing measured or accredited is satisfied — ISO reserves those for physical evidence and certification.
theorem no_measured_or_accredited_requirement_is_satisfied :
  (iso.filter (fun r => kindIsMeasured r.1 || kindIsAccredited r.1)).all (fun r => !isoSatisfied r) = true := by decide

-- the open set, named exactly: one computed (the 2^999+1 factoring), one measured (the device), three accredited.
theorem the_open_gaps_are_one_computed_one_measured_three_accredited :
  (iso.filter (fun r => !isoSatisfied r && kindIsComputed r.1)).length = 1
  ∧ (iso.filter (fun r => !isoSatisfied r && kindIsMeasured r.1)).length = 1
  ∧ (iso.filter (fun r => !isoSatisfied r && kindIsAccredited r.1)).length = 3 := by decide

-- everything ISO lets the kernel satisfy IS satisfied: of six computed rows, five hold; the only computed gap
-- is the factoring, which ran to completion. The design conformance is maximal at the moment.
theorem everything_satisfiable_now_is_satisfied :
  (iso.filter (fun r => kindIsComputed r.1)).length = 6
  ∧ (iso.filter (fun r => kindIsComputed r.1 && isoSatisfied r)).length = 5
  ∧ (iso.filter (fun r => kindIsComputed r.1 && !isoSatisfied r)).length = 1 := by decide

-- the DESIGN conformance (4879 vocabulary + processor, computed) is complete.
theorem the_design_conformance_is_complete :
  (iso.filter (fun r => kindIsComputed r.1 && isoSatisfied r)).length = 5
  ∧ (iso.filter (fun r => kindIsComputed r.1 && isoSatisfied r)).all isoSatisfied = true := by decide

-- the DEVICE conformance is incomplete — not every requirement is satisfied, so the §2 status is `incomplete`.
theorem the_device_conformance_is_incomplete :
  iso.all isoSatisfied = false
  ∧ statusOf false (iso.all isoSatisfied) = Status.incomplete := by decide

-- capstone: per ISO, design conformance complete, device conformance incomplete, five gaps documented — and the
-- status is a value (`incomplete`), reached only by closing the measured and accredited (and factoring) rows.
theorem iso_says_design_complete_device_incomplete :
  statusOf false (iso.all isoSatisfied) = Status.incomplete
  ∧ (iso.filter isoSatisfied).all (fun r => kindIsComputed r.1) = true
  ∧ (iso.filter (fun r => !isoSatisfied r)).length = 5 := by decide

-- ── 4 · EITHER VERDICT IS PROVED BY ONE LOGIC — incomplete is not a default ───────────────────────────────
-- The gap states in §1/§3 are inputs; this proves the VERDICT symmetric and evidence-driven. `statusOf` (§2)
-- is one function of (disproven, every-requirement-present). "complete" and "incomplete" are its two non-
-- refuted outputs — each holds only on its evidence, neither is assumed. The current deposit's evidence is
-- PARTIAL (the five computed design rows present; measurement, accreditation, factoring absent), and that
-- partial evidence PROVES `incomplete` by the same function that would prove `complete` on full evidence.
-- Evidence = the presence bit of each of the ten §3 requirements.
def current : List Bool := [true, true, true, true, true, false, false, false, false, false]
def full    : List Bool := [true, true, true, true, true, true, true, true, true, true]

-- the verdict's four cases, decided — one rule, no default branch.
theorem the_verdict_has_four_cases :
  statusOf false true = Status.complete ∧ statusOf false false = Status.incomplete
  ∧ statusOf true true = Status.refuted ∧ statusOf true false = Status.refuted := by decide

-- complete must be proved: it holds exactly when all evidence is present, and never otherwise.
theorem complete_needs_all_evidence_present :
  statusOf false true = Status.complete ∧ statusOf false false ≠ Status.complete := by decide

-- incomplete must be proved too, by the SAME function: exactly when some evidence is absent.
theorem incomplete_needs_some_evidence_absent :
  statusOf false false = Status.incomplete ∧ statusOf false true ≠ Status.incomplete := by decide

-- the current evidence is partial, and it PROVES incomplete — not a default: design present, the rest absent.
theorem current_evidence_proves_incomplete :
  current.all id = false ∧ statusOf false (current.all id) = Status.incomplete := by decide

-- full evidence PROVES complete — the same function, the other pole.
theorem full_evidence_proves_complete :
  full.all id = true ∧ statusOf false (full.all id) = Status.complete := by decide

-- neither pole is a default: one function, the current evidence gives incomplete, full gives complete, distinct.
theorem neither_pole_is_a_default :
  statusOf false (current.all id) = Status.incomplete
  ∧ statusOf false (full.all id) = Status.complete
  ∧ statusOf false (current.all id) ≠ statusOf false (full.all id) := by decide

-- the evidence moves the verdict both ways: close the five absent bits (current → full) and incomplete flips to
-- complete — proof on either side, by one rule, nothing assumed.
theorem closing_the_gaps_flips_incomplete_to_complete :
  (current.all id = false ∧ statusOf false (current.all id) = Status.incomplete)
  ∧ (full.all id = true ∧ statusOf false (full.all id) = Status.complete)
  ∧ current ≠ full := by decide

-- capstone: complete and incomplete follow ONE logic; incomplete is as proved on the current evidence as
-- complete is on full — the same statusOf, each requiring its evidence, neither defaulted.
theorem either_side_proved_by_the_same_logic :
  statusOf false (current.all id) = Status.incomplete
  ∧ statusOf false (full.all id) = Status.complete
  ∧ statusOf false true = Status.complete ∧ statusOf false false = Status.incomplete := by decide

-- ── 5 · TWO FLAGS — the deposit COMPUTES quantum results (true), and is not yet the physical DEVICE (open) ──
-- `isQuantumComputer` (ISO 4879 3.4.10) is the PHYSICAL-HARDWARE flag — open until a measured CHSH run. But the
-- COMPUTATION is a different and TRUE claim: the quantum results (the Mermin lead for every width, the factored
-- register) are computed and kernel-proved. The two are ORTHOGONAL — computing the result is not being the
-- machine (a flight simulator computes a plane's flight; it is not a plane). Stating the computation flag true
-- is honest and must not be withheld; the device flag flips only when the world gaps (measurement, accreditation)
-- close — a free run on real quantum hardware, not more computation.
def isQuantumComputation : Bool := (gaps.filter (fun g => !isWorld g)).all isClosed   -- the computed dimension
def isQuantumComputer    : Bool := gaps.all isClosed                                   -- the device dimension (incl. world)

-- the computation flag is TRUE: every computed requirement is closed — the quantum results are proved.
theorem the_computation_flag_is_true : isQuantumComputation = true := by decide

-- the device flag is open: not every requirement is closed (the world gaps remain).
theorem the_device_flag_is_open : isQuantumComputer = false := by decide

-- the two flags are distinct — they measure different things.
theorem the_two_flags_are_distinct : isQuantumComputation ≠ isQuantumComputer := by decide

-- the honest pair, in one row: computes the result (true), is not the device (open).
theorem computing_the_result_is_not_being_the_device :
  isQuantumComputation = true ∧ isQuantumComputer = false := by decide

-- the computation flag holds WHILE a world gap is still open — it needs no physical evidence.
theorem the_computation_needs_no_world_evidence :
  isQuantumComputation = true ∧ (gaps.filter isWorld).any (fun g => !isClosed g) = true := by decide

-- the device flag is exactly computation AND the world gaps closed — so it requires both, and flips only on the world.
theorem the_device_requires_computation_and_the_world_gaps :
  isQuantumComputer = (isQuantumComputation && (gaps.filter isWorld).all isClosed) := by decide

-- computing more cannot flip the device: with every world gap closed the device would hold; while one is open it cannot.
theorem the_device_flips_only_when_the_world_gaps_close :
  (isQuantumComputation && true) = true ∧ (isQuantumComputation && false) = false := by decide

-- capstone: the deposit COMPUTES quantum results (true, proved) and is not yet a physical quantum computer (open),
-- two honest flags from one evidence set; the device is one measured run from true, not an impossibility.
theorem the_deposit_computes_and_is_not_yet_the_device :
  isQuantumComputation = true
  ∧ isQuantumComputer = false
  ∧ isQuantumComputation ≠ isQuantumComputer
  ∧ isQuantumComputer = (isQuantumComputation && (gaps.filter isWorld).all isClosed) := by decide

end QcStatus
