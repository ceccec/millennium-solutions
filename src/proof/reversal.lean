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


-- ── reflections, from the rev batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
-- ═══ REFLECTIONS ═══════════════════════════════════════════════════════════════════════════════════════
theorem digitsF_zero : ∀ f : Nat, digitsF f 0 = [] := by
  intro f; cases f <;> rfl

theorem every_digit_is_below_ten : ∀ f n : Nat, ∀ d ∈ digitsF f n, d < 10 := by
  intro f
  induction f with
  | zero => intro n d h; simp [digitsF] at h
  | succ f ih =>
    intro n d h
    cases n with
    | zero => simp [digitsF] at h
    | succ m =>
      simp only [digitsF, List.mem_cons] at h
      rcases h with h | h
      · omega
      · exact ih _ _ h

-- the number rebuilt from its digits (reflection of the digit-sum law)
theorem the_digits_rebuild_the_number_when_the_fuel_covers_them :
    ∀ f n : Nat, n < 10 ^ f → (digitsF f n).foldr (fun d a => a * 10 + d) 0 = n := by
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
      simp only [digitsF, List.foldr]
      have hlt : (m + 1) / 10 < 10 ^ f := by
        rw [Nat.pow_succ] at h
        omega
      rw [ih _ hlt]
      omega

theorem the_number_is_rebuilt_from_its_digits_for_every_n :
    ∀ n : Nat, (digits n).foldr (fun d a => a * 10 + d) 0 = n := by
  intro n
  unfold digits
  split
  · rename_i h
    have : n = 0 := by simpa using h
    subst this
    rfl
  · exact the_digits_rebuild_the_number_when_the_fuel_covers_them (n + 1) n (a_number_is_below_ten_to_its_own_successor n)

-- the sum does not see the order (reflection of foldl_add_start)
theorem a_sum_is_the_same_read_backwards : ∀ (l : List Nat), l.reverse.foldl (· + ·) 0 = l.foldl (· + ·) 0 := by
  intro l
  induction l with
  | nil => rfl
  | cons x xs ih =>
    rw [List.reverse_cons, List.foldl_append, ih]
    simp only [List.foldl]
    rw [foldl_add_start xs (0 + x)]
    omega

theorem the_top_digit_is_nonzero :
    ∀ f n : Nat, 0 < n → n < 10 ^ f → ∃ L b, digitsF f n = L ++ [b] ∧ 0 < b ∧ b < 10 := by
  intro f
  induction f with
  | zero => intro n h0 h; exfalso; simp at h; omega
  | succ f ih =>
    intro n h0 h
    obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
    simp only [digitsF]
    by_cases hq : (m + 1) / 10 = 0
    · refine ⟨[], (m + 1) % 10, ?_, by omega, by omega⟩
      rw [hq, digitsF_zero]
      rfl
    · have hlt : (m + 1) / 10 < 10 ^ f := by
        rw [Nat.pow_succ] at h
        omega
      obtain ⟨L, b, e, hb, hb10⟩ := ih ((m + 1) / 10) (by omega) hlt
      exact ⟨(m + 1) % 10 :: L, b, by rw [e]; rfl, hb, hb10⟩

theorem reversal_leaves_no_trailing_zero : ∀ n : Nat, 0 < n → 0 < reverseNum n ∧ reverseNum n % 10 ≠ 0 := by
  intro n hn
  obtain ⟨L, b, e, hb, hb10⟩ := the_top_digit_is_nonzero (n + 1) n hn (a_number_is_below_ten_to_its_own_successor n)
  have hd : digits n = L ++ [b] := by
    unfold digits
    rw [if_neg (by simp; omega)]
    exact e
  unfold reverseNum
  rw [hd, List.foldl_append]
  show 0 < (L.foldl (fun a d => a * 10 + d) 0) * 10 + b ∧ ((L.foldl (fun a d => a * 10 + d) 0) * 10 + b) % 10 ≠ 0
  exact ⟨by omega, by omega⟩

theorem reading_a_list_back_from_the_top :
    ∀ r : List Nat, r ≠ [] → (∀ d ∈ r, d < 10) → r.reverse.head? ≠ some 0 →
      0 < r.reverse.foldl (fun a d => a * 10 + d) 0 ∧ r.length ≤ r.reverse.foldl (fun a d => a * 10 + d) 0 ∧
      ∀ f, r.length ≤ f → digitsF f (r.reverse.foldl (fun a d => a * 10 + d) 0) = r := by
  intro r
  induction r with
  | nil => intro h; exact absurd rfl h
  | cons b r' ih =>
    intro _ hlt hhead
    have hb : b < 10 := hlt b (List.mem_cons_self b r')
    cases r' with
    | nil =>
      have hb0 : b ≠ 0 := by
        intro e; apply hhead; simp [e]
      simp only [List.reverse_cons, List.reverse_nil, List.nil_append, List.foldl, List.length_cons,
        List.length_nil, Nat.zero_mul, Nat.zero_add]
      refine ⟨by omega, by omega, ?_⟩
      intro f hf
      obtain ⟨f', rfl⟩ : ∃ f', f = f' + 1 := ⟨f - 1, by omega⟩
      obtain ⟨b', rfl⟩ : ∃ b', b = b' + 1 := ⟨b - 1, by omega⟩
      simp only [digitsF]
      rw [show (b' + 1) / 10 = 0 by omega, show (b' + 1) % 10 = b' + 1 by omega, digitsF_zero]
    | cons x xs =>
      have hne : (x :: xs) ≠ [] := List.cons_ne_nil x xs
      have hlt' : ∀ d ∈ (x :: xs), d < 10 := fun d hd => hlt d (List.mem_cons_of_mem b hd)
      have hhead' : (x :: xs).reverse.head? ≠ some 0 := by
        have hrev : (b :: x :: xs).reverse = (x :: xs).reverse ++ [b] := List.reverse_cons b (x :: xs)
        rw [hrev] at hhead
        cases h : (x :: xs).reverse with
        | nil => simp at h
        | cons y ys => rw [h] at hhead; exact hhead
      obtain ⟨hpos, hlen, hdig⟩ := ih hne hlt' hhead'
      rw [List.reverse_cons b (x :: xs), List.foldl_append]
      simp only [List.foldl, List.length_cons] at hlen hdig ⊢
      generalize (x :: xs).reverse.foldl (fun a d => a * 10 + d) 0 = v at hpos hlen hdig ⊢
      refine ⟨by omega, by omega, ?_⟩
      intro f hf
      obtain ⟨f', rfl⟩ : ∃ f', f = f' + 1 := ⟨f - 1, by omega⟩
      obtain ⟨w, hw⟩ : ∃ w, v * 10 + b = w + 1 := ⟨v * 10 + b - 1, by omega⟩
      rw [hw]
      simp only [digitsF]
      rw [← hw, show (v * 10 + b) % 10 = b by omega, show (v * 10 + b) / 10 = v by omega, hdig f' (by omega)]

theorem the_digits_of_the_reversal_are_the_reversed_digits :
    ∀ n : Nat, n % 10 ≠ 0 → digits (reverseNum n) = (digitsF (n + 1) n).reverse ∧ digits n = digitsF (n + 1) n := by
  intro n h10
  have hds : digits n = digitsF (n + 1) n := by
    unfold digits
    rw [if_neg (by simp; omega)]
  have hne : digitsF (n + 1) n ≠ [] := by
    obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
    simp [digitsF]
  have hhead : (digitsF (n + 1) n).head? = some (n % 10) := by
    obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
    simp [digitsF]
  have hlt : ∀ d ∈ (digitsF (n + 1) n).reverse, d < 10 :=
    fun d hd => every_digit_is_below_ten _ _ d (List.mem_reverse.mp hd)
  have key := reading_a_list_back_from_the_top (digitsF (n + 1) n).reverse
    (by simpa using hne) hlt
    (by rw [List.reverse_reverse, hhead]; intro e; apply h10; exact Option.some.inj e)
  rw [List.reverse_reverse] at key
  obtain ⟨hpos, hlen, hdig⟩ := key
  have hrn : reverseNum n = (digitsF (n + 1) n).foldl (fun a d => a * 10 + d) 0 := by
    unfold reverseNum; rw [hds]
  refine ⟨?_, hds⟩
  unfold digits
  rw [hrn, if_neg (by simp; omega)]
  exact hdig _ (Nat.le_succ_of_le hlen)

-- reflection of reversal_keeps_the_residue_mod_nine_for_every_n: reversal undoes itself off the trailing zeros
theorem reversal_is_involutive_off_the_trailing_zeros_for_every_n :
    ∀ n : Nat, n % 10 ≠ 0 → reverseNum (reverseNum n) = n := by
  intro n h10
  obtain ⟨hdrn, _⟩ := the_digits_of_the_reversal_are_the_reversed_digits n h10
  show (digits (reverseNum n)).foldl (fun a d => a * 10 + d) 0 = n
  rw [hdrn, List.foldl_reverse]
  exact the_digits_rebuild_the_number_when_the_fuel_covers_them (n + 1) n (a_number_is_below_ten_to_its_own_successor n)

theorem reversal_is_involutive_exactly_off_the_trailing_zeros_for_every_n :
    ∀ n : Nat, 0 < n → (reverseNum (reverseNum n) = n ↔ n % 10 ≠ 0) := by
  intro n hn
  constructor
  · intro e h0
    obtain ⟨hp, _⟩ := reversal_leaves_no_trailing_zero n hn
    obtain ⟨_, hz⟩ := reversal_leaves_no_trailing_zero (reverseNum n) hp
    rw [e] at hz
    exact hz h0
  · exact reversal_is_involutive_off_the_trailing_zeros_for_every_n n

-- more fuel changes nothing once it covers the number
theorem more_fuel_changes_no_digit : ∀ f n k : Nat, n < 10 ^ f → digitsF (f + k) n = digitsF f n := by
  intro f
  induction f with
  | zero =>
    intro n k h
    have : n = 0 := by simp at h; omega
    subst this
    rw [digitsF_zero, digitsF_zero]
  | succ f ih =>
    intro n k h
    cases n with
    | zero => rw [digitsF_zero, digitsF_zero]
    | succ m =>
      rw [show f + 1 + k = (f + k) + 1 by omega]
      simp only [digitsF]
      have hlt : (m + 1) / 10 < 10 ^ f := by
        rw [Nat.pow_succ] at h
        omega
      rw [ih _ k hlt]

theorem a_trailing_zero_is_a_leading_zero_of_the_digits :
    ∀ m : Nat, 0 < m → digits (10 * m) = 0 :: digits m := by
  intro m hm
  unfold digits
  rw [if_neg (by simp; omega), if_neg (by simp; omega)]
  obtain ⟨p, hp⟩ : ∃ p, 10 * m = p + 1 := ⟨10 * m - 1, by omega⟩
  rw [show 10 * m + 1 = (10 * m) + 1 from rfl, hp]
  simp only [digitsF]
  rw [← hp, show 10 * m % 10 = 0 by omega, show 10 * m / 10 = m by omega,
    show 10 * m = (m + 1) + (9 * m - 1) by omega,
    more_fuel_changes_no_digit (m + 1) m (9 * m - 1) (a_number_is_below_ten_to_its_own_successor m)]

-- reversal_preserves_digit_sum was decided for 1 ≤ n < 300; for every n:
theorem reversal_preserves_the_digit_sum_for_every_n : ∀ n : Nat, digitSum (reverseNum n) = digitSum n := by
  intro n
  induction n using Nat.strongRecOn with
  | _ n ih =>
    by_cases h0 : n = 0
    · subst h0; rfl
    by_cases h10 : n % 10 = 0
    · obtain ⟨m, rfl⟩ : ∃ m, n = 10 * m := ⟨n / 10, by omega⟩
      have hm : 0 < m := by omega
      have hd := a_trailing_zero_is_a_leading_zero_of_the_digits m hm
      have hr : reverseNum (10 * m) = reverseNum m := by
        unfold reverseNum; rw [hd]; rfl
      have hs : digitSum (10 * m) = digitSum m := by
        unfold digitSum; rw [hd]; rfl
      rw [hr, hs]
      exact ih m (by omega)
    · obtain ⟨hdrn, hds⟩ := the_digits_of_the_reversal_are_the_reversed_digits n h10
      unfold digitSum
      rw [hdrn, hds, a_sum_is_the_same_read_backwards]

-- palindromes_are_the_fixed_points counted them below 100; for every n without a trailing zero:
-- the fixed points of the reversal are exactly the numbers whose digits read the same both ways
theorem the_fixed_points_of_reversal_are_the_palindromes_for_every_n :
    ∀ n : Nat, n % 10 ≠ 0 → (reverseNum n = n ↔ (digits n).reverse = digits n) := by
  intro n h10
  obtain ⟨hdrn, hds⟩ := the_digits_of_the_reversal_are_the_reversed_digits n h10
  constructor
  · intro e
    have := congrArg digits e
    rw [hdrn, ← hds] at this
    exact this
  · intro p
    have hd : digits (reverseNum n) = digits n := by rw [hdrn, ← hds, p]
    rw [← the_number_is_rebuilt_from_its_digits_for_every_n (reverseNum n), hd,
      the_number_is_rebuilt_from_its_digits_for_every_n]

end Reversal
