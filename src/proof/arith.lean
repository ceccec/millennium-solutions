-- src/proof/arith.lean — the arithmetic decision of the answer system, as kernel-checked definitions.
--
-- The C2 verifier (src/answer/verify-arith.ts) PROPOSES a verdict: a prime to be proved by trial division, or a
-- composite with a factor. The kernel decides it here. A proposal the kernel cannot check comes back UNKNOWN, so a
-- wrong proposal can never become a TRUE or FALSE. The lemmas below say why a checked factor rules out primality, and
-- that a missing witness can never produce FALSE.

namespace Answer.Arith

/-- The four answer values of the answer system, restricted to what the arithmetic decision returns. -/
inductive Value
  | TRUE
  | FALSE
  | UNKNOWN
  deriving DecidableEq

/-- Trial division: n is at least 2, and no d with 2 ≤ d < n divides it. Closed by `decide` for each literal. -/
def primeB (n : Nat) : Bool :=
  2 ≤ n && (List.range n).all (fun d => d < 2 || n % d != 0)

/-- A compositeness witness: a factor f and cofactor c, both at least 2, with f * c = n. -/
def factorOk (n f c : Nat) : Bool :=
  2 ≤ f && 2 ≤ c && f * c == n

/-- The C2 verdict. A witness gives FALSE only if the product check passes. No witness gives TRUE only for a prime
    decided by trial division, and UNKNOWN otherwise (a composite with no factor reported is UNKNOWN). -/
def verdictOf (n : Nat) : Option (Nat × Nat) → Value
  | some (f, c) => if factorOk n f c then Value.FALSE else Value.UNKNOWN
  | none => if primeB n then Value.TRUE else Value.UNKNOWN

/-- A checked factor rules out primality: the trial division finds that same factor. -/
theorem factor_rules_out_prime (n f c : Nat) (h : factorOk n f c = true) : primeB n = false := by
  unfold factorOk at h
  simp only [Bool.and_eq_true, decide_eq_true_eq, beq_iff_eq] at h
  obtain ⟨⟨hf, hc⟩, hmul⟩ := h
  have hfn : f < n := by
    rw [← hmul]
    have h2 : f * 2 ≤ f * c := Nat.mul_le_mul_left f hc
    omega
  have hmod : n % f = 0 := by
    rw [← hmul]
    exact Nat.mul_mod_right f c
  unfold primeB
  have hall : (List.range n).all (fun d => d < 2 || n % d != 0) = false := by
    cases hb : (List.range n).all (fun d => d < 2 || n % d != 0)
    · rfl
    · exfalso
      have hmem := (List.all_eq_true.mp hb) f (List.mem_range.mpr hfn)
      simp [hmod] at hmem
      omega
  simp [hall]

/-- The three checked cases, each closed by `decide`. -/
theorem case_91_false : verdictOf 91 (some (7, 13)) = Value.FALSE := by decide
theorem case_97_true : verdictOf 97 none = Value.TRUE := by decide
theorem case_91_no_witness_unknown : verdictOf 91 none = Value.UNKNOWN := by decide

/-- A wrong witness is refused: 13 × 7 is not a factorisation of 97, so the verdict stays UNKNOWN. -/
theorem wrong_witness_refused : verdictOf 97 (some (7, 13)) = Value.UNKNOWN := by decide

/-- Without a witness FALSE is impossible, for every integer: the verdict is TRUE or UNKNOWN. -/
theorem no_witness_never_false (n : Nat) : verdictOf n none ≠ Value.FALSE := by
  show (if primeB n then Value.TRUE else Value.UNKNOWN) ≠ Value.FALSE
  split <;> decide

/-- FALSE is only ever a composite: a FALSE verdict implies the number is not prime. -/
theorem false_implies_not_prime (n : Nat) (w : Nat × Nat) (h : verdictOf n (some w) = Value.FALSE) :
    primeB n = false := by
  obtain ⟨f, c⟩ := w
  have hok : factorOk n f c = true := by
    cases hb : factorOk n f c
    · simp [verdictOf, hb] at h
    · rfl
  exact factor_rules_out_prime n f c hok

end Answer.Arith
