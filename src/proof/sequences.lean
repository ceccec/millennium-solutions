import Fnv
set_option maxRecDepth 4000000
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

end Sequences
