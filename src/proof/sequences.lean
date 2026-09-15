import Fnv
set_option maxRecDepth 4000000
set_option maxHeartbeats 2000000
-- title: Sequences
-- wing: the ring
-- prior_art: named
-- prior_art_domain: integer sequences and identities
-- prior_art_note: Cassini’s identity — G. D. Cassini, 1680; Lucas sequences — Édouard Lucas, 1878; the Brahmagupta–Fibonacci identity — Brahmagupta, 628; Pascal’s triangle mod 2 — Blaise Pascal, 1654
-- Sequences and identities — Cassini, Lucas, Brahmagupta–Fibonacci, and Pascal mod two.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The ledger held these as TypeScript tests. Each is a classical identity with a real proof; what is done
-- here is to DECIDE each over a stated finite range, which is what `decide` can honestly deliver — the range
-- is named in every theorem rather than implied, and no theorem claims the general case.
--
-- Cassini alternates in sign, which the naturals cannot express directly, so it is stated in the two forms it
-- takes: the product exceeds the square by one at even indices and falls short by one at odd ones. Stating it
-- as a single subtraction would truncate at zero and quietly hold for the wrong reason.

namespace Sequences

def fib : Nat → Nat
  | 0 => 0
  | 1 => 1
  | Nat.succ (Nat.succ n) => fib n + fib (n + 1)

def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))

/-- bitwise AND, structural: Nat's own is well-founded and would drag propext into every theorem here -/
def andF : Nat → Nat → Nat → Nat
  | 0, _, _ => 0
  | _, 0, _ => 0
  | _, _, 0 => 0
  | Nat.succ f, a, b => (if a % 2 == 1 && b % 2 == 1 then 1 else 0) + 2 * andF f (a / 2) (b / 2)
def andN (a b : Nat) : Nat := andF 33 a b

-- ── CASSINI: F(n−1)·F(n+1) − F(n)² = ±1, alternating. Stated in both directions over 1..20. ──
theorem cassini_at_even_indices :
  (List.range' 1 20).all (fun n => n % 2 == 1 || fib (n - 1) * fib (n + 1) == fib n * fib n + 1) := by decide

theorem cassini_at_odd_indices :
  (List.range' 1 20).all (fun n => n % 2 == 0 || fib (n - 1) * fib (n + 1) + 1 == fib n * fib n) := by decide

-- ── and the deviation is never more than one, in either direction — the identity is tight ──
theorem cassini_deviation_is_exactly_one :
  (List.range' 1 20).all (fun n =>
    (fib (n - 1) * fib (n + 1) == fib n * fib n + 1) || (fib (n - 1) * fib (n + 1) + 1 == fib n * fib n)) := by decide

-- ── LUCAS mod two: C(n,k) is odd exactly when k AND n = k — the Sierpiński rule behind Rule 90 ──
theorem lucas_mod_two_is_the_and_rule :
  (List.range 14).all (fun n => (List.range (n + 1)).all (fun k =>
    (choose n k % 2 == 1) == (andN k n == k))) := by decide

-- ── NON-VACUITY: both cases actually occur in that range — odd and even entries are both present ──
theorem pascal_has_both_parities :
  ((List.range 14).flatMap (fun n => (List.range (n + 1)).map (fun k => choose n k % 2))).contains 1
  ∧ ((List.range 14).flatMap (fun n => (List.range (n + 1)).map (fun k => choose n k % 2))).contains 0 := by decide

-- ── BRAHMAGUPTA–FIBONACCI: sums of two squares are closed under multiplication ──
theorem sums_of_two_squares_are_closed :
  (List.range 8).all (fun a => (List.range 8).all (fun b => (List.range 8).all (fun c => (List.range 8).all (fun d =>
    (a*a + b*b) * (c*c + d*d) == (a*c - b*d) * (a*c - b*d) + (a*d + b*c) * (a*d + b*c)
    || (a*c) < (b*d))))) := by decide

-- ── the Fibonacci triple three, five, eight — consecutive, and summing as the recurrence requires ──
theorem three_five_eight_are_consecutive :
  fib 4 = 3 ∧ fib 5 = 5 ∧ fib 6 = 8 ∧ fib 4 + fib 5 = fib 6 := by decide

-- ── the Pisano period binds Fibonacci to the ring: mod 9 it repeats every 24, four times the doubling six ──
theorem pisano_twentyfour_is_four_sixes :
  (List.range 30).all (fun k => fib k % 9 == fib (k + 24) % 9) ∧ 24 = 4 * 6 := by decide

-- ── THUE–MORSE, RECOMPUTED AS LEAN ─────────────────────────────────────────────────────────────────────
-- The ledger carried `thue_morse_doubling_recurrence` and WITHDREW it, with the reason recorded: "not
-- backed by a Lean proof. Its evidence is a TypeScript test, which reports that a computation agreed once
-- on one machine; the kernel checks a proposition over its whole domain. Its content has no stated
-- decidable form yet."
--
-- Withdrawn for want of a proof, not because it is false — and it HAS a decidable form. t(n) is the parity
-- of the 1-bits of n. Doubling shifts every bit one place and introduces no new one, so the popcount is
-- unchanged and t(2n) = t(n). 2n+1 sets exactly one further bit, so the parity flips: t(2n+1) = 1 − t(n).
-- Both are decided below over a stated finite domain, which is what the withdrawal said was missing, and
-- proved for every n at the end of this file.
-- The fuel is n + 1, which covers every bit of every n (n < 2^(n+1)); the earlier fuel of 12 counted only the
-- low twelve bits — a cap every statement here had to stay under.
def popcount (n : Nat) : Nat := (List.range (n + 1)).foldl (fun a i => a + n / 2 ^ i % 2) 0
def tm (n : Nat) : Nat := popcount n % 2

-- Domain: n < 200 — the decided instance of the law proved for every n at the end of this file. The popcount
-- no longer stops at twelve bits, so no statement here can hold for the wrong reason at any size.
theorem thue_morse_doubling_recurrence :
  (List.range 200).all (fun n => tm (2 * n) == tm n && tm (2 * n + 1) == 1 - tm n) := by decide

-- The two halves separately, so a reader can see which one a counterexample would break.
theorem doubling_preserves_the_parity_of_the_bits :
  (List.range 200).all (fun n => popcount (2 * n) == popcount n) := by decide

theorem the_odd_step_sets_exactly_one_further_bit :
  (List.range 200).all (fun n => popcount (2 * n + 1) == popcount n + 1) := by decide

-- And the domain is not vacuous: the sequence actually takes both values inside it, so `all` is not
-- passing over a set on which the property is trivially true.
theorem the_sequence_takes_both_values :
  ((List.range 200).filter (fun n => tm n == 0)).length = 100
  ∧ ((List.range 200).filter (fun n => tm n == 1)).length = 100 := by decide


-- ── the capped rows above, proved for every value — no bound ─────────────────────────────────────────────────
-- cassini_at_even_indices, cassini_at_odd_indices and cassini_deviation_is_exactly_one were checked n ≤ 20; one law
-- carries all three: at every index the product of the neighbours is the square, plus or minus one.
theorem cassinis_identity_for_every_m :
    ∀ m : Nat, fib (2 * m + 1) * fib (2 * m + 3) = fib (2 * m + 2) * fib (2 * m + 2) + 1 ∧
      fib (2 * m) * fib (2 * m + 2) + 1 = fib (2 * m + 1) * fib (2 * m + 1) := by
  intro m
  induction m with
  | zero => decide
  | succ m ih =>
    have r3 : fib (2 * m + 3) = fib (2 * m + 1) + fib (2 * m + 2) := rfl
    have r4 : fib (2 * m + 4) = fib (2 * m + 2) + fib (2 * m + 3) := rfl
    have r5 : fib (2 * m + 5) = fib (2 * m + 3) + fib (2 * m + 4) := rfl
    show fib (2 * m + 3) * fib (2 * m + 5) = fib (2 * m + 4) * fib (2 * m + 4) + 1 ∧
      fib (2 * m + 2) * fib (2 * m + 4) + 1 = fib (2 * m + 3) * fib (2 * m + 3)
    have h := ih.1
    rw [r5, r4, r3]
    rw [r3] at h
    generalize fib (2 * m + 1) = a at h ⊢
    generalize fib (2 * m + 2) = b at h ⊢
    constructor
    · try simp only [Nat.mul_add, Nat.add_mul, Nat.pow_succ, Nat.pow_zero, Nat.one_mul, Nat.mul_one, Nat.reduceMul, Nat.reduceAdd] at *
      try simp only [Nat.mul_assoc, Nat.mul_comm, Nat.mul_left_comm, Nat.reduceMul] at *
      try simp only [Nat.mul_comm _ (OfNat.ofNat _), Nat.mul_left_comm _ (OfNat.ofNat _), Nat.reduceMul] at *
      all_goals omega
    · try simp only [Nat.mul_add, Nat.add_mul, Nat.pow_succ, Nat.pow_zero, Nat.one_mul, Nat.mul_one, Nat.reduceMul, Nat.reduceAdd] at *
      try simp only [Nat.mul_assoc, Nat.mul_comm, Nat.mul_left_comm, Nat.reduceMul] at *
      try simp only [Nat.mul_comm _ (OfNat.ofNat _), Nat.mul_left_comm _ (OfNat.ofNat _), Nat.reduceMul] at *
      all_goals omega


-- ── the popcount rows above, proved for every n — no bound ───────────────────────────────────────────────
-- thue_morse_doubling_recurrence, doubling_preserves_the_parity_of_the_bits and the_odd_step_sets_exactly_one_
-- further_bit were decided over n < 200; these prove them for every n. The bits of m are its low bit and then the
-- bits of m / 2; positions above the number add nothing; so doubling keeps the count and the odd step adds one.
theorem a_bit_sum_over_one_more_position_adds_that_bit :
    ∀ F m : Nat, (List.range (F + 1)).foldl (fun a i => a + m / 2 ^ i % 2) 0 =
      (List.range F).foldl (fun a i => a + m / 2 ^ i % 2) 0 + m / 2 ^ F % 2 := by
  intro F m
  rw [List.range_succ, List.foldl_append]
  rfl

theorem halving_shifts_every_bit_down_by_one : ∀ m i : Nat, m / 2 ^ (i + 1) = m / 2 / 2 ^ i := by
  intro m i
  rw [Nat.div_div_eq_div_mul, Nat.pow_succ, Nat.mul_comm]

theorem the_bits_of_a_number_are_its_low_bit_then_the_bits_of_its_half :
    ∀ F m : Nat, (List.range (F + 1)).foldl (fun a i => a + m / 2 ^ i % 2) 0 =
      m % 2 + (List.range F).foldl (fun a i => a + m / 2 / 2 ^ i % 2) 0 := by
  intro F
  induction F with
  | zero => intro m; show 0 + m / 2 ^ 0 % 2 = m % 2 + 0; rw [Nat.pow_zero, Nat.div_one]; omega
  | succ F ih =>
    intro m
    rw [a_bit_sum_over_one_more_position_adds_that_bit (F + 1) m, ih m,
      a_bit_sum_over_one_more_position_adds_that_bit F (m / 2), halving_shifts_every_bit_down_by_one]
    omega

theorem bits_above_the_number_add_nothing :
    ∀ k F n : Nat, n < 2 ^ F → (List.range (F + k)).foldl (fun a i => a + n / 2 ^ i % 2) 0 =
      (List.range F).foldl (fun a i => a + n / 2 ^ i % 2) 0 := by
  intro k
  induction k with
  | zero => intro F n _; rfl
  | succ k ih =>
    intro F n h
    rw [← Nat.add_assoc, a_bit_sum_over_one_more_position_adds_that_bit, ih F n h]
    have hp : 2 ^ F ≤ 2 ^ (F + k) := Nat.pow_le_pow_right (by decide) (Nat.le_add_right F k)
    rw [Nat.div_eq_of_lt (by omega), Nat.zero_mod, Nat.add_zero]

theorem a_number_is_below_two_to_its_own_power : ∀ n : Nat, n < 2 ^ n := by
  intro n
  induction n with
  | zero => decide
  | succ n ih =>
    rw [Nat.pow_succ]
    omega

theorem a_number_is_below_two_to_its_own_successor : ∀ n : Nat, n < 2 ^ (n + 1) := by
  intro n
  have h := a_number_is_below_two_to_its_own_power n
  rw [Nat.pow_succ]
  omega

theorem doubling_preserves_the_bit_count_for_every_n : ∀ n : Nat, popcount (2 * n) = popcount n := by
  intro n
  unfold popcount
  rw [the_bits_of_a_number_are_its_low_bit_then_the_bits_of_its_half (2 * n) (2 * n),
    show 2 * n / 2 = n by omega, show 2 * n % 2 = 0 by omega, Nat.zero_add]
  cases n with
  | zero => rfl
  | succ m =>
    have hlt : m + 1 < 2 ^ (m + 1 + 1) := a_number_is_below_two_to_its_own_successor (m + 1)
    rw [show 2 * (m + 1) = m + 1 + 1 + m by omega, bits_above_the_number_add_nothing m (m + 1 + 1) (m + 1) hlt]

theorem the_odd_step_sets_exactly_one_further_bit_for_every_n : ∀ n : Nat, popcount (2 * n + 1) = popcount n + 1 := by
  intro n
  unfold popcount
  rw [the_bits_of_a_number_are_its_low_bit_then_the_bits_of_its_half (2 * n + 1) (2 * n + 1),
    show (2 * n + 1) / 2 = n by omega, show (2 * n + 1) % 2 = 1 by omega]
  have hlt : n < 2 ^ (n + 1) := a_number_is_below_two_to_its_own_successor n
  rw [show 2 * n + 1 = n + 1 + n by omega, bits_above_the_number_add_nothing n (n + 1) n hlt]
  omega

theorem thue_morse_doubling_recurrence_for_every_n : ∀ n : Nat, tm (2 * n) = tm n ∧ tm (2 * n + 1) = 1 - tm n := by
  intro n
  unfold tm
  rw [doubling_preserves_the_bit_count_for_every_n, the_odd_step_sets_exactly_one_further_bit_for_every_n]
  exact ⟨rfl, by omega⟩

end Sequences
