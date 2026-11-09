-- title: The certificate gate, as kernel-checked rules
-- wing: the floor
-- prior_art: unclassified
-- prior-art note: not applicable — rules of the answer system, docs/ANSWER-SYSTEM.md
-- prior_art_search: none performed; the claims are finite rules over flags, decided exhaustively.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- THE RULES (docs/ANSWER-SYSTEM.md, "Answer rules"): TRUE and FALSE need a proof certificate (C1 or C2); SOURCED needs a
-- DOI certificate (C3); UNKNOWN carries no certificate and names its blocking step; every answer names what checked it.
-- An answer is a record of flags. The gate decides it by `ok`, and scripts/answer-gate.ts asks the kernel for each
-- stored answer, so the verdict is the kernel's and not a TypeScript function's.

namespace AnswerGate

inductive Val
  | TRUE
  | FALSE
  | SOURCED
  | UNKNOWN
  deriving DecidableEq

/-- The certificate of an answer: none, a proof (C1 Lean, C2 arithmetic), a DOI (C3), or any other kind. -/
inductive Cert
  | none
  | C1
  | C2
  | C3
  | other
  deriving DecidableEq

/-- One answer, as the flags the gate reads. `blocking` is whether a blocking step is named. -/
structure Flags where
  value : Val
  cert : Cert
  checkedBy : Bool
  blocking : Bool

/-- The value and certificate rule. -/
def certOk (f : Flags) : Bool :=
  match f.value with
  | Val.TRUE => f.cert == Cert.C1 || f.cert == Cert.C2
  | Val.FALSE => f.cert == Cert.C1 || f.cert == Cert.C2
  | Val.SOURCED => f.cert == Cert.C3
  | Val.UNKNOWN => f.cert == Cert.none && f.blocking

/-- An answer is accepted when something checked it and its value and certificate agree. -/
def ok (f : Flags) : Bool := f.checkedBy && certOk f

def allVals : List Val := [Val.TRUE, Val.FALSE, Val.SOURCED, Val.UNKNOWN]
def allCerts : List Cert := [Cert.none, Cert.C1, Cert.C2, Cert.C3, Cert.other]
def allBools : List Bool := [false, true]

/-- Every combination of flags: 4 × 5 × 2 × 2 = 80. -/
def allFlags : List Flags :=
  allVals.flatMap fun v => allCerts.flatMap fun c => allBools.flatMap fun ch => allBools.flatMap fun b =>
    [⟨v, c, ch, b⟩]

-- ── THE EXTENT OF THE RULES, COUNTED: exactly these 11 of the 80 flag combinations are accepted ───────────
-- TRUE: a C1 or C2 certificate (2), a checker (1), blocking step either way (2): 4.
-- FALSE: the same, 4.
-- SOURCED: a C3 certificate (1), a checker (1), blocking step either way (2): 2.
-- UNKNOWN: no certificate (1), a blocking step (1), a checker (1): 1.
-- Total 4 + 4 + 2 + 1 = 11.
theorem exactly_eleven_are_accepted :
  (allFlags.filter ok).length = 11 := by decide

-- ── THE REFUSALS, EACH AS ITS OWN THEOREM ───────────────────────────────────────────────────────────────
-- TRUE without a proof is refused, whatever else is set.
theorem truth_without_a_proof_is_refused (f : Flags) (hv : f.value = Val.TRUE) (hc : f.cert = Cert.none) :
    ok f = false := by
  unfold ok certOk
  simp [hv, hc]

-- FALSE without a proof is refused, whatever else is set.
theorem falsehood_without_a_proof_is_refused (f : Flags) (hv : f.value = Val.FALSE) (hc : f.cert = Cert.none) :
    ok f = false := by
  unfold ok certOk
  simp [hv, hc]

-- SOURCED without a DOI certificate is refused.
theorem sourced_without_a_doi_is_refused (f : Flags) (hv : f.value = Val.SOURCED) (hc : f.cert ≠ Cert.C3) :
    ok f = false := by
  unfold ok certOk
  have hne : (f.cert == Cert.C3) = false := by simp [hc]
  simp [hv, hne]

-- UNKNOWN that carries a certificate is refused.
theorem unknown_with_a_certificate_is_refused (f : Flags) (hv : f.value = Val.UNKNOWN) (hc : f.cert ≠ Cert.none) :
    ok f = false := by
  unfold ok certOk
  have hne : (f.cert == Cert.none) = false := by simp [hc]
  simp [hv, hne]

-- UNKNOWN without a blocking step is refused.
theorem unknown_without_a_blocking_step_is_refused (f : Flags) (hv : f.value = Val.UNKNOWN) (hb : f.blocking = false) :
    ok f = false := by
  unfold ok certOk
  simp [hv, hb]

-- An answer that names no checker is refused, whatever its value.
theorem unchecked_is_refused (f : Flags) (hc : f.checkedBy = false) : ok f = false := by
  unfold ok
  simp [hc]

end AnswerGate
