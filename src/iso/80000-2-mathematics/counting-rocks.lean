-- title: Counting Rocks — the counting identities
-- wing: the ring
-- prior_art: named
-- prior_art_domain: undergraduate enumerative combinatorics
-- prior_art_note: Adams, Emmrich, Gillespie, Golden and Pries, "Counting Rocks! An Introduction to Combinatorics"
--   (Colorado State University, May 4 2025), licensed CC BY 4.0 on its copyright page. Each theorem restates a formula or
--   value the book gives, and the kernel decides it over a stated range. None of the results is this deposit's.
-- prior_art_search: the source is the book named above; its licence was read from its own copyright page.
-- prior_art_pool: named
-- Counting identities from Counting Rocks!, decided by the kernel over the ranges the theorems state.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- Section numbers in each comment are the book's. The book's text is not copied; only its formulas and values are restated.
-- The Catalan numbers, the Cayley count of labeled trees, and the other sections are not in this file yet.

namespace CountingRocks

/-- The factorial, n! = n·(n−1)···1 (Section 3.3). -/
def fact : Nat → Nat
  | 0 => 1
  | n+1 => (n+1) * fact n

/-- The binomial coefficient C(n,k) by the factorial formula (Sections 4.1–4.2); zero when k > n. -/
def choose (n k : Nat) : Nat := if k ≤ n then fact n / (fact k * fact (n - k)) else 0

/-- The sum of the entries in row n of Pascal's triangle (Section 4.3). -/
def rowSum (n : Nat) : Nat := (List.range (n+1)).foldl (fun acc k => acc + choose n k) 0

/-- Pascal's rule, C(n+1,k+1) = C(n,k) + C(n,k+1) (Section 4.1), for every n below 12 and every k below n. -/
theorem pascal_rule : ∀ n < 12, ∀ k < n, choose (n+1) (k+1) = choose n k + choose n (k+1) := by decide

/-- The sum of the entries in row n is 2^n (Section 4.3), for every n below 12. -/
theorem row_sum_is_power_of_two : ∀ n < 12, rowSum n = 2^n := by decide

/-- The number of handshakes among n people, each pair shaking hands once: n(n−1)/2 (Section 1.1). -/
def handshakes (n : Nat) : Nat := n * (n-1) / 2

/-- Ten people shake hands with everyone else: 10 handshakes (Section 1.1). -/
theorem handshakes_five_people : handshakes 5 = 10 := by decide

/-- Each of n people shakes n−1 hands, so the degrees sum to n(n−1), which is twice the handshake count (Section 1.1 and
    the handshake lemma of Section 8.3), for every n below 60. -/
theorem degrees_sum_to_twice_handshakes : ∀ n < 60, n * (n-1) = 2 * handshakes n := by decide

/-- Four objects have 4! = 24 orderings (Section 3.3). -/
theorem four_objects_have_24_orderings : fact 4 = 24 := by decide

/-- Derangements, Definition 6.5.3 and Proposition 6.5.4: D1 = 0, D2 = 1, and D_n = (n−1)(D_{n−1} + D_{n−2}) for n ≥ 3.
    The value at 0 is never used by the recurrence, which starts at n = 3. -/
def der : Nat → Nat
  | 0 => 0
  | 1 => 0
  | 2 => 1
  | n+3 => (n+2) * (der (n+2) + der (n+1))

/-- The first derangement values the book computes (Section 6.5). -/
theorem derangement_values : der 3 = 2 ∧ der 4 = 9 ∧ der 5 = 44 ∧ der 6 = 265 ∧ der 7 = 1854 ∧ der 8 = 14833 := by decide

/-- Proposition 6.5.5: D_n = n·D_{n−1} + (−1)^n for n ≥ 2, checked for every n from 2 to 11. -/
theorem derangement_second_recurrence : ∀ n < 12, 2 ≤ n →
    (der n : Int) = (n : Int) * (der (n-1) : Int) + (if n % 2 = 0 then 1 else -1) := by decide

/-- Fibonacci numbers: F1 = F2 = 1 and F_n = F_{n−1} + F_{n−2} for n ≥ 3 (Definition 6.1.2). -/
def fib : Nat → Nat
  | 0 => 0
  | 1 => 1
  | 2 => 1
  | n+3 => fib (n+2) + fib (n+1)

/-- The tenth Fibonacci number is 55. -/
theorem fibonacci_ten : fib 10 = 55 := by decide

/-- The sum F1 + ··· + Fn = F_{n+2} − 1 (Section 6.1 exercise 9), for every n from 1 to 19. -/
theorem fibonacci_partial_sums : ∀ n < 20, 1 ≤ n →
    (List.range n).foldl (fun acc k => acc + fib (k+1)) 0 + 1 = fib (n+2) := by decide

end CountingRocks
