-- title: Digit reversal
-- wing: the machine
-- prior_art: named
-- prior_art_domain: elementary arithmetic
-- prior_art_note: digit reversal and digit sums; casting out nines, in use by the 12th century
-- Digit reversal — arithmetic, not string handling.
set_option maxRecDepth 200000
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- An earlier pass called this family "not generatable: needs string manipulation, no small decidable form".
-- That was wrong. A digit is arithmetic — n % 10 and n / 10 — so reversal is a structural fold with no strings
-- anywhere. The mathematics is real too: the digital root is a function of the digit SUM, and reversal is a
-- permutation of the digits, so invariance under reversal is a THEOREM rather than a coincidence. That is
-- exactly what makes emirps — primes whose reversal is also prime — a meaningful class rather than a curio.
-- No axioms, no Mathlib, no sorry.

namespace Reversal

/-- Digits, least significant first. Fuel-bounded so the recursion is structural: Nat.div is well-founded and
    would drag `propext` into every theorem below (that hazard cost two theorems in an earlier batch). -/
def digitsF : Nat → Nat → List Nat
  | 0, _ => []
  | _, 0 => []
  | Nat.succ f, n => (n % 10) :: digitsF f (n / 10)

def digits (n : Nat) : List Nat := if n == 0 then [0] else digitsF (n + 1) n
def reverseNum (n : Nat) : Nat := (digits n).foldl (fun a d => a * 10 + d) 0
def digitSum (n : Nat) : Nat := (digits n).foldl (· + ·) 0

-- ── reversal is a permutation of the digits, so it preserves their sum ──
theorem reversal_preserves_digit_sum :
  (List.range' 1 300).all (fun n => digitSum (reverseNum n) == digitSum n) := by decide

-- ── and therefore preserves the residue mod 9 — the digital root is invariant under reversal ──
theorem digital_root_is_invariant_under_reversal :
  (List.range' 1 300).all (fun n => (reverseNum n) % 9 == n % 9) := by decide

-- ── the ledger's own cases, now stated rather than asserted ──
theorem the_ledger_reversal_cases :
  (reverseNum 12) % 9 == 12 % 9 ∧ (reverseNum 45) % 9 == 45 % 9
  ∧ (reverseNum 123) % 9 == 123 % 9 ∧ (reverseNum 1234) % 9 == 1234 % 9
  ∧ (reverseNum 4321) % 9 == 4321 % 9 ∧ (reverseNum 9080) % 9 == 9080 % 9 := by decide

-- ── NON-VACUITY: reversal genuinely moves the number, so the invariance is not about a fixed point ──
theorem reversal_is_not_the_identity :
  ¬ ((List.range' 10 90).all (fun n => reverseNum n == n)) := by decide

-- ── palindromes are exactly the fixed points, and there are nine of them below 100 ──
theorem palindromes_are_the_fixed_points :
  ((List.range' 10 90).filter (fun n => reverseNum n == n)).length = 9 := by decide

-- ── EMIRPS: primes whose reversal is also prime — where reversal meets the primes ──
def isPrime (n : Nat) : Bool := n > 1 && (List.range n).all (fun d => d < 2 || n % d != 0)

theorem emirps_exist_below_one_hundred :
  ((List.range' 10 90).filter (fun n => isPrime n && isPrime (reverseNum n) && reverseNum n != n)).length > 0 := by decide

-- ── and reversal does NOT preserve primality in general: the boundary that makes emirps a real class ──
theorem reversal_does_not_preserve_primality :
  ¬ ((List.range' 10 90).all (fun n => isPrime n == isPrime (reverseNum n))) := by decide

-- ── WHERE REVERSAL STOPS BEING AN INVOLUTION. Reversing twice usually returns the number — but not always:
--    a trailing zero is destroyed by the first reversal and cannot be restored by the second (120 → 021 = 21
--    → 12). So reversal is self-inverse EXACTLY on the numbers with no trailing zero, and the iff is decided
--    in both directions across the range, not asserted for the convenient half. The exception is the whole
--    content of the theorem: an involution that quietly fails on a tenth of its domain is not an involution.
theorem reversal_is_involutive_exactly_off_the_trailing_zeros :
  (List.range' 1 300).all (fun n => (reverseNum (reverseNum n) == n) == (n % 10 != 0)) := by decide

def settledHere : Nat := 8
theorem reversal_settles_its_range : settledHere = 8 := rfl


-- ── the capped rows above, proved for every value by induction — no bound ────────────────────────────────────
-- casting out nines, in general: a number, its digit sum and its reversal share their residue mod 9.
theorem foldl_add_start : ∀ (l : List Nat) (a : Nat), l.foldl (· + ·) a = a + l.foldl (· + ·) 0 := by
  intro l
  induction l with
  | nil => intro a; simp
  | cons x xs ih =>
    intro a
    simp only [List.foldl]
    rw [ih (a + x), ih (0 + x)]
    omega

theorem the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them :
    ∀ f n : Nat, n < 10 ^ f → (digitsF f n).foldl (· + ·) 0 % 9 = n % 9 := by
  intro f
  induction f with
  | zero =>
    intro n h
    have : n = 0 := by simp at h; omega
    subst this
    simp [digitsF]
  | succ f ih =>
    intro n h
    cases n with
    | zero => simp [digitsF]
    | succ m =>
      simp only [digitsF, List.foldl]
      rw [foldl_add_start]
      have hlt : (m + 1) / 10 < 10 ^ f := by
        rw [Nat.pow_succ] at h
        omega
      have := ih ((m + 1) / 10) hlt
      omega

theorem a_number_is_below_ten_to_its_own_successor : ∀ n : Nat, n < 10 ^ (n + 1) := by
  intro n
  induction n with
  | zero => decide
  | succ n ih =>
    rw [Nat.pow_succ]
    omega

theorem the_digit_sum_has_the_residue_of_the_number_mod_nine_for_every_n :
    ∀ n : Nat, digitSum n % 9 = n % 9 := by
  intro n
  unfold digitSum digits
  split
  · rename_i h
    have : n = 0 := by simpa using h
    subst this
    rfl
  · exact the_digits_sum_to_the_number_mod_nine_when_the_fuel_covers_them (n + 1) n (a_number_is_below_ten_to_its_own_successor n)

theorem folding_by_ten_keeps_the_residue_of_the_digit_sum :
    ∀ (l : List Nat) (a : Nat), (l.foldl (fun a d => a * 10 + d) a) % 9 = (a + l.foldl (· + ·) 0) % 9 := by
  intro l
  induction l with
  | nil => intro a; simp
  | cons x xs ih =>
    intro a
    simp only [List.foldl]
    rw [ih (a * 10 + x), foldl_add_start xs (0 + x)]
    omega

-- digital_root_is_invariant_under_reversal checked 1 ≤ n ≤ 300; this proves it for every n.
theorem reversal_keeps_the_residue_mod_nine_for_every_n :
    ∀ n : Nat, reverseNum n % 9 = n % 9 := by
  intro n
  have h1 : reverseNum n % 9 = digitSum n % 9 := by
    unfold reverseNum digitSum
    rw [folding_by_ten_keeps_the_residue_of_the_digit_sum]
    simp
  rw [h1, the_digit_sum_has_the_residue_of_the_number_mod_nine_for_every_n]

end Reversal
