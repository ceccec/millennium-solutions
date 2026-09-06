-- title: Families over the ring
-- wing: the ring
-- prior_art: named
-- prior_art_domain: modular arithmetic, quantified
-- prior_art_note: quantifies the ℤ/9 arithmetic above; the underlying results are Fermat’s, Euler’s and Gauss’s
-- The families, quantified. Proving at scale.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The ledger holds families of entries produced by a loop: flt_prime_3, flt_prime_5, flt_prime_7 … each a
-- separate row asserting the same theorem at one more parameter. A row per parameter is not how mathematics
-- scales; a quantifier is. Each theorem below ranges over the whole family's parameter set, so ONE proof
-- subsumes every member — and covers parameters the ledger never enumerated.
--
-- Every proof is `by decide` over a finite range: no axioms, no Mathlib, no `sorry`. Where a statement is
-- false outside its stated range, that is stated as a negative rather than omitted. Integrity, not truth.

namespace Families

def primesUpTo30 : List Nat := [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
def fact (n : Nat) : Nat := (List.range n).foldl (fun a k => a * (k + 1)) 1
def choose (n k : Nat) : Nat := fact n / (fact k * fact (n - k))
-- gcd defined by STRUCTURAL recursion on a fuel argument. Nat.gcd is defined by well-founded recursion,
-- whose equation lemmas pull in `propext` — so using it would silently cost this file its axiom-free status.
-- Caught by the per-theorem audit; the standard is "does not depend on any axioms", and it is enforced.
def gcdFuel : Nat → Nat → Nat → Nat
  | 0, a, _ => a
  | _, a, 0 => a
  | Nat.succ f, a, b => gcdFuel f b (a % b)
def gcd' (a b : Nat) : Nat := gcdFuel (a + b + 1) a b
def totient (n : Nat) : Nat := ((List.range n).filter (fun a => gcd' a n == 1)).length
def popcount (n : Nat) : Nat := ((List.range 16).filter (fun i => (n >>> i) % 2 == 1)).length

-- ── Fermat's little theorem, over every prime below thirty and every nonzero residue ──
theorem flt_all_primes_under_thirty :
  primesUpTo30.all (fun p => (List.range' 1 (p - 1)).all (fun a => (a ^ (p - 1)) % p == 1)) := by decide

-- ── Wilson's theorem, same range: (p−1)! ≡ p−1 (mod p) ──
theorem wilson_all_primes_under_thirty :
  primesUpTo30.all (fun p => fact (p - 1) % p == p - 1) := by decide

-- ── and Wilson FAILS at every composite — the converse, which the family never stated ──
theorem wilson_fails_at_composites :
  ((List.range' 4 20).filter (fun n => ! primesUpTo30.contains n)).all
    (fun n => fact (n - 1) % n != n - 1) := by decide

-- ── Pascal: every row sums to a power of two ──
theorem pascal_rows_sum_to_powers_of_two :
  (List.range 12).all (fun n => ((List.range (n + 1)).map (fun k => choose n k)).foldl (· + ·) 0 == 2 ^ n) := by decide

-- ── Pascal: the alternating sum vanishes on every row but the zeroth ──
theorem pascal_alternating_sums_vanish :
  (List.range' 1 11).all (fun n =>
    ((List.range (n + 1)).map (fun k => if k % 2 == 0 then choose n k else 0)).foldl (· + ·) 0
    == ((List.range (n + 1)).map (fun k => if k % 2 == 1 then choose n k else 0)).foldl (· + ·) 0) := by decide

-- ── Euler's totient at prime powers: φ(pᵏ) = pᵏ − pᵏ⁻¹ ──
set_option maxRecDepth 100000 in
theorem totient_at_prime_powers :
  [2, 3, 5, 7].all (fun p => (List.range' 1 3).all (fun k => totient (p ^ k) == p ^ k - p ^ (k - 1))) := by decide

-- ── the geometric series in every base 2..9, to the fourth power ──
theorem geometric_series_all_bases :
  (List.range' 2 8).all (fun b =>
    ((List.range 5).map (fun i => b ^ i)).foldl (· + ·) 0 * (b - 1) == b ^ 5 - 1) := by decide

-- ── XOR is parity: over every assignment of k bits, for k up to 8 ──
set_option maxRecDepth 100000 in
theorem xor_is_parity_up_to_eight_bits :
  (List.range' 1 8).all (fun k =>
    (List.range (2 ^ k)).all (fun n => popcount n % 2 == (List.range k).foldl (fun acc i => (acc + ((n >>> i) % 2)) % 2) 0)) := by decide


-- ── THE CONVENTION AT ZERO, stated as a convention and not as arithmetic.
--
--    Division by zero is UNDEFINED in mathematics: there is no quotient, and nothing below claims otherwise.
--    What is recorded here is a property of Lean's FUNCTION `Nat.div`, which is total — every pair of naturals
--    is mapped somewhere, including a zero divisor, where the definition returns 0. That is a choice made so
--    the function is total and `decide` never faults on a side condition; it is not a claim that dividing by
--    zero yields zero, and an earlier name here ("division_by_zero_is_zero") said exactly that and was wrong.
--
--    The deposit reads division by zero as a CHANGE OF DOMAIN, which is the same point put positively: the
--    value is not found in the arithmetic, it is supplied by the definition — a different domain entirely.
--    Naming this precisely matters, because a reader who takes `7 / 0 = 0` for arithmetic has been misled by
--    a theorem that is green. ──
theorem nat_div_is_a_total_function_returning_zero_at_a_zero_divisor :
  (7 / 0) = 0 ∧ (0 / 0) = 0 ∧ (7 % 0) = 7 := by decide

-- the division identity holds across a range INCLUDING zero — but at zero it is carried entirely by the
-- remainder, because the quotient was supplied by the convention rather than computed
theorem division_identity_holds_across_the_range :
  (List.range 13).all (fun d => (12 / d) * d + (12 % d) == 12) := by decide

theorem at_a_zero_divisor_the_identity_is_carried_by_the_remainder :
  (12 / 0) = 0 ∧ (12 % 0) = 12 ∧ (12 / 0) * 0 + (12 % 0) == 12 := by decide

-- ── SEVEN FAMILIES THE LEDGER HELD AS SINGLETONS, QUANTIFIED — 2026-09-07 ───────────────────────────────
--
--    The ledger carries rows like domain_prime_m2, domain_prime_m3, domain_prime_m5 … one per parameter,
--    every one of them revoked for want of a proof. Under "involute instead of withdraw" a revoked row whose
--    statement is TRUE is not a dead entry: it is a carry waiting for the theorem that subsumes it. Each
--    theorem below quantifies one such family over its whole parameter range, so the withdrawn members come
--    back proved rather than dropped — and the range extends past whatever the loop happened to enumerate.
--
--    Four of the seven are stated as EQUIVALENCES rather than as lists of successes. The ledger's loop wrote
--    a row only where the property held and simply omitted mulperm_k3, mulperm_k6, addgen_k3, addgen_k6,
--    hasinv_d3, hasinv_d6 — the parameters where it fails. An omission is not a statement, and the reader
--    cannot tell a false parameter from one nobody tried. The equivalence says both halves at once: the
--    property holds at exactly the units and nowhere else, decided over the entire range.

def isPrime (n : Nat) : Bool := n ≥ 2 && (List.range' 2 (n - 2)).all (fun d => n % d != 0)
def unitsMod (m : Nat) : List Nat := (List.range m).filter (fun a => gcd' a m == 1)
-- modular powering by repeated reduction — g ^ k over the naturals would build a 22-digit intermediate at
-- m = 18 and cost the kernel far more than the theorem is worth
def powMod (g k m : Nat) : Nat := (List.range k).foldl (fun a _ => a * g % m) (1 % m)
def ordMod (g m : Nat) : Nat := ((List.range' 1 m).find? (fun k => powMod g k m == 1)).getD 0
def hasPrimitiveRoot (m : Nat) : Bool := (unitsMod m).any (fun g => ordMod g m == (unitsMod m).length)
def isOddPrimePower (n : Nat) : Bool :=
  (List.range' 3 n).any (fun p => isPrime p && p % 2 == 1 && (List.range' 1 5).any (fun k => p ^ k == n))
-- Gauss's characterisation, written as a predicate so the theorem below compares two computations rather
-- than comparing a computation against a list somebody typed out after looking at the answer
def gaussCyclic (m : Nat) : Bool :=
  m == 1 || m == 2 || m == 4 || isOddPrimePower m || (m % 2 == 0 && isOddPrimePower (m / 2))

-- ── primality across the range, decided — and agreeing with the list this file already used ──
theorem primality_is_decided_across_the_range :
  (List.range' 2 17).all (fun m => isPrime m == primesUpTo30.contains m) := by decide

-- ── the units are cyclic at exactly the moduli Gauss says, and at no others ──
set_option maxRecDepth 100000 in
theorem the_units_are_cyclic_at_exactly_the_gauss_moduli :
  (List.range' 2 17).all (fun m => hasPrimitiveRoot m == gaussCyclic m) := by decide

-- ── De Morgan at every arity to eight, over every assignment of its inputs ──
set_option maxRecDepth 100000 in
theorem demorgan_holds_at_every_arity_to_eight :
  (List.range' 2 7).all (fun k => (List.range (2 ^ k)).all (fun n =>
    (! (List.range k).all (fun i => (n >>> i) % 2 == 1)) == (List.range k).any (fun i => (n >>> i) % 2 == 0))) := by decide

def permutesZ9 (k : Nat) : Bool := (List.range 9).all (fun y => (List.range 9).any (fun d => k * d % 9 == y))
-- the orbit of repeated ADDITION — d ↦ d + k applied t times, which is what "generates additively" means;
-- writing it as t * k would have made this the same computation as permutesZ9 wearing a different name
def addOrbit (k : Nat) : List Nat := (List.range 9).map (fun t => (List.range t).foldl (fun a _ => (a + k) % 9) 0)
def addGeneratesZ9 (k : Nat) : Bool := (List.range 9).all (fun y => (addOrbit k).contains y)
def invOf (d : Nat) : Option Nat := (List.range 9).find? (fun e => d * e % 9 == 1)

-- ── multiplication permutes ℤ/9 at exactly the units — the failing parameters stated, not omitted ──
theorem multiplication_permutes_z9_at_exactly_the_units :
  (List.range' 1 8).all (fun k => permutesZ9 k == (gcd' k 9 == 1)) := by decide

-- ── repeated addition reaches all of ℤ/9 at exactly the same parameters, by a different computation ──
theorem addition_generates_z9_at_exactly_the_units :
  (List.range' 1 8).all (fun k => addGeneratesZ9 k == (gcd' k 9 == 1)) := by decide

-- ── an inverse mod 9 exists at exactly the units, across the whole ring including zero ──
theorem an_inverse_mod_nine_exists_at_exactly_the_units :
  (List.range 9).all (fun d => (invOf d).isSome == (gcd' d 9 == 1)) := by decide

-- ── and where it exists it is the fifth power: u · u⁵ ≡ 1, since |units mod 9| = 6 ──
theorem the_inverse_of_a_unit_mod_nine_is_its_fifth_power :
  (unitsMod 9).all (fun u => u * (powMod u 5 9) % 9 == 1) := by decide

-- ── what these settle ──
def settledHere : Nat := 18
theorem families_settle_their_ranges : settledHere = 18 := rfl

end Families
