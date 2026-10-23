-- prior_art: unclassified
-- lean/answer.lean — the pure decisions of the answer system (src/answer/verify-lean.ts and verify-arith.ts), stated
-- and proved. These are the rules the TypeScript decision functions implement; the link between the two is a runtime
-- test until the TypeScript is generated from this file.

namespace Answer

inductive Value
  | TRUE
  | FALSE
  | UNKNOWN
  deriving DecidableEq

/-- What lean-ask reports for one theorem. -/
structure LeanReport where
  answered : Bool
  compiles : Bool
  hasSorry : Bool
  noAxioms : Bool

/-- C1: TRUE only for a theorem that is answered, compiles, contains no unfinished proof, and depends on no axiom. -/
def decideC1 (r : LeanReport) : Value :=
  if r.answered && r.compiles && !r.hasSorry && r.noAxioms then Value.TRUE else Value.UNKNOWN

theorem c1_true_only_when_clean (r : LeanReport) (h : decideC1 r = Value.TRUE) :
    r.answered = true ∧ r.compiles = true ∧ r.hasSorry = false ∧ r.noAxioms = true := by
  unfold decideC1 at h
  by_cases hc : (r.answered && r.compiles && !r.hasSorry && r.noAxioms) = true
  · simp only [Bool.and_eq_true, Bool.not_eq_true'] at hc
    exact ⟨hc.1.1.1, hc.1.1.2, hc.1.2, hc.2⟩
  · simp [hc] at h

inductive Verdict
  | prime
  | composite
  | probablePrime
  | other
  deriving DecidableEq

/-- What task-route reports for one integer. `factorChecked` is a found factor whose product check passes. -/
structure RouteReport where
  verdict : Verdict
  proved : Bool
  factorChecked : Bool

/-- C2: "is N prime?" answered TRUE or FALSE only from an exact witness, otherwise UNKNOWN. -/
def decideC2 (r : RouteReport) : Value :=
  if r.verdict = Verdict.prime && r.proved then Value.TRUE
  else if r.verdict = Verdict.composite && r.factorChecked then Value.FALSE
  else Value.UNKNOWN

/-- A probable prime is never a certificate: it can never be TRUE or FALSE. -/
theorem c2_probable_prime_is_unknown (p : Bool) (f : Bool) :
    decideC2 { verdict := Verdict.probablePrime, proved := p, factorChecked := f } = Value.UNKNOWN := by
  unfold decideC2
  simp

/-- TRUE is reached only from a proved prime. -/
theorem c2_true_only_for_proved_prime (r : RouteReport) (h : decideC2 r = Value.TRUE) :
    r.verdict = Verdict.prime ∧ r.proved = true := by
  unfold decideC2 at h
  by_cases h1 : (r.verdict = Verdict.prime && r.proved) = true
  · simp only [Bool.and_eq_true, decide_eq_true_eq] at h1
    exact ⟨h1.1, h1.2⟩
  · by_cases h2 : (r.verdict = Verdict.composite && r.factorChecked) = true <;> simp_all

/-- FALSE is reached only from a composite with a checked factor. -/
theorem c2_false_only_for_checked_composite (r : RouteReport) (h : decideC2 r = Value.FALSE) :
    r.verdict = Verdict.composite ∧ r.factorChecked = true := by
  unfold decideC2 at h
  by_cases h1 : (r.verdict = Verdict.prime && r.proved) = true
  · simp_all
  · by_cases h2 : (r.verdict = Verdict.composite && r.factorChecked) = true
    · simp only [Bool.and_eq_true, decide_eq_true_eq] at h2
      exact ⟨h2.1, h2.2⟩
    · simp_all

end Answer

/-! Exhaustive: every element of each finite domain, checked by `decide`. These replace sampled runtime tests. -/

namespace Answer

def allBools : List Bool := [false, true]

/-- Every LeanReport: 2^4 = 16. -/
def allReports : List LeanReport :=
  allBools.flatMap fun a => allBools.flatMap fun c => allBools.flatMap fun s => allBools.flatMap fun n => [⟨a, c, s, n⟩]

theorem c1_exhaustive :
    allReports.all (fun r => (decideC1 r == Value.TRUE) == (r.answered && r.compiles && !r.hasSorry && r.noAxioms)) = true := by
  decide

def allVerdicts : List Verdict := [Verdict.prime, Verdict.composite, Verdict.probablePrime, Verdict.other]

/-- Every RouteReport: 4 × 2 × 2 = 16 (the verdict, proved, factor-checked). -/
def allRoutes : List RouteReport :=
  allVerdicts.flatMap fun v => allBools.flatMap fun p => allBools.flatMap fun f => [⟨v, p, f⟩]

theorem c2_exhaustive :
    allRoutes.all (fun r =>
      (decideC2 r == Value.TRUE) == (r.verdict == Verdict.prime && r.proved) &&
      (decideC2 r == Value.FALSE) == (!(r.verdict == Verdict.prime && r.proved) && r.verdict == Verdict.composite && r.factorChecked)) = true := by
  decide

/-- The certificate kinds an answer can carry, and the four values. -/
inductive Cert
  | none
  | C1
  | C2
  | C3
  deriving DecidableEq

inductive Val
  | TRUE
  | FALSE
  | SOURCED
  | UNKNOWN
  deriving DecidableEq

/-- The gate: which pairs of value and certificate the rules accept. -/
def gateOk : Val → Cert → Bool
  | .TRUE, .C1 => true
  | .TRUE, .C2 => true
  | .FALSE, .C1 => true
  | .FALSE, .C2 => true
  | .SOURCED, .C3 => true
  | .UNKNOWN, .none => true
  | _, _ => false

/-- The rules, written once, as the specification the gate must match. -/
def ruleOk (v : Val) (c : Cert) : Bool :=
  ((v == Val.TRUE || v == Val.FALSE) && (c == Cert.C1 || c == Cert.C2)) ||
  (v == Val.SOURCED && c == Cert.C3) || (v == Val.UNKNOWN && c == Cert.none)

theorem gate_matches_rules :
    [Val.TRUE, Val.FALSE, Val.SOURCED, Val.UNKNOWN].all (fun v =>
      [Cert.none, Cert.C1, Cert.C2, Cert.C3].all (fun c => gateOk v c == ruleOk v c)) = true := by
  decide

/-- No TRUE or FALSE without a proof certificate: the gate's refusal, over every pair. -/
theorem gate_refuses_uncertified_truth :
    [Val.TRUE, Val.FALSE].all (fun v => gateOk v Cert.none == false) = true := by
  decide

end Answer
