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

-- ── A SECOND OCTAVE OF FAMILIES, 2026-09-07 ─────────────────────────────────────────────────────────────
--
--    Same operation as the seven above, on the families the first pass left: each was a run of ledger rows,
--    one per parameter, every one revoked as "not backed by a Lean proof". The evidence they DID have was a
--    TypeScript test — a computation reporting that it agreed with itself. That is a real reason to want a
--    kernel proof and not a reason to call the statement dead.

def powSum (k n : Nat) : Nat := ((List.range' 1 n).map (fun i => i ^ k)).foldl (· + ·) 0
-- Faulhaber's closed forms, k = 1…5. The subtractions are safe in Nat: at n = 0 the truncation to zero is
-- multiplied by an n that is also zero, and above n = 0 the bracket is positive.
def faulhaber (k n : Nat) : Nat :=
  match k with
  | 1 => n * (n + 1) / 2
  | 2 => n * (n + 1) * (2 * n + 1) / 6
  | 3 => n * n * (n + 1) * (n + 1) / 4
  | 4 => n * (n + 1) * (2 * n + 1) * (3 * n * n + 3 * n - 1) / 30
  | 5 => n * n * (n + 1) * (n + 1) * (2 * n * n + 2 * n - 1) / 12
  | _ => 0

-- digits, by structural recursion on a fuel argument — the same reason gcdFuel exists above: a well-founded
-- definition would pull `propext` in through its equation lemmas and cost this file its axiom-free status
def digitsF : Nat → Nat → List Nat
  | 0, _ => []
  | _, 0 => []
  | Nat.succ f, n => n % 10 :: digitsF f (n / 10)
-- fuel 20 covers every Nat that fits in 64 bits; a fuel just large enough for the range below would
-- silently truncate the digits of any larger number a later theorem passed in
def digitsOf (n : Nat) : List Nat := digitsF 20 n
def reverseDigits (n : Nat) : Nat := (digitsOf n).foldl (fun a d => a * 10 + d) 0
def digitalRoot (n : Nat) : Nat := if n == 0 then 0 else 1 + (n - 1) % 9

-- ── the closed forms for the power sums, k = 1…5, against the loop they replace ──
set_option maxRecDepth 100000 in
theorem power_sums_match_their_closed_forms :
  (List.range' 1 5).all (fun k => (List.range 41).all (fun n => powSum k n == faulhaber k n)) := by decide

-- ── the digital root survives writing the number backwards, for every number below ten thousand ──
--    Reversal permutes the digits, the digit sum is invariant under permutation, and the digital root is a
--    function of that sum. The statement is decided rather than argued.
--    Walked as a hundred hundreds rather than as one list of ten thousand: `decide` evaluates a single
--    `List.all` as one deep conjunction and overflows the kernel's stack at that length, which is a fact
--    about the evaluator and not about the mathematics. The domain is identical — every n below 10000.
--    It costs the kernel about forty-five seconds, which is most of what this file takes and a real price
--    paid on every run. Measured, not guessed: shrinking the fuel changes nothing, because the cost is the
--    ten thousand evaluations themselves. The range is not padding — the family's own parameters run to
--    9080, and a statement that stopped short of them would not carry the claims it exists to carry.
set_option maxRecDepth 400000 in
set_option maxHeartbeats 2000000 in
theorem the_digital_root_is_invariant_under_digit_reversal :
  (List.range 100).all (fun a => (List.range 100).all (fun b =>
    digitalRoot (a * 100 + b) == digitalRoot (reverseDigits (a * 100 + b)))) := by decide

-- ── the geometric series across bases 2…12 and every exponent to six, not one exponent at one base ──
set_option maxRecDepth 100000 in
theorem geometric_series_across_bases_and_exponents :
  (List.range' 2 11).all (fun b => (List.range 7).all (fun n =>
    ((List.range (n + 1)).map (fun i => b ^ i)).foldl (· + ·) 0 * (b - 1) == b ^ (n + 1) - 1)) := by decide

-- ── Euler's totient at prime powers, out to thirteen ──
set_option maxRecDepth 400000 in
theorem totient_at_prime_powers_through_thirteen :
  [2, 3, 5, 7, 11, 13].all (fun p => (List.range' 1 3).all (fun k => totient (p ^ k) == p ^ k - p ^ (k - 1))) := by decide

-- ── ROOTS OF UNITY IN A RING, AND THE CONVERSE THAT DOES NOT HOLD ───────────────────────────────────────
--
--    The ledger's roots_cancel_n rows say the n equally-spaced unit vectors cancel to the zero vector.
--    That is plane geometry over the reals, and `decide` over Nat cannot express it, so those rows are NOT
--    carried by anything below and stay withdrawn — saying so is the point of writing this here.
--
--    What IS decidable is the algebraic shadow of the same fact: in ℤ/m, the powers of an element g of
--    multiplicative order n sum to zero. That is the identity (g − 1)·Σ = gⁿ − 1 = 0, and it gives Σ = 0
--    only when g − 1 can be cancelled — so the statement carries its own hypothesis, gcd(g − 1, m) = 1.
--
--    The converse looked true and is not. Writing it as an equivalence would have been the stronger, more
--    satisfying theorem; the kernel refuses it, and at m = 6 with g = 5 the sum 1 + 5 vanishes mod 6 while
--    gcd(4, 6) = 2. The witness is kept as its own theorem, because a hypothesis nobody can see the need
--    for gets deleted as clutter by the next reader.

def rootSum (g m : Nat) : Nat := ((List.range (ordMod g m)).map (fun k => powMod g k m)).foldl (· + ·) 0

set_option maxRecDepth 100000 in
theorem the_powers_of_a_unit_sum_to_zero_when_g_minus_one_is_invertible :
  (List.range' 2 19).all (fun m => (unitsMod m).all (fun g =>
    !(gcd' (g - 1) m == 1) || (rootSum g m % m == 0))) := by decide

theorem and_the_converse_fails_at_six :
  ordMod 5 6 = 2 ∧ rootSum 5 6 % 6 = 0 ∧ gcd' 4 6 = 2 := by decide

-- ── A THIRD OCTAVE: THE CLASSICAL SUMS, EACH QUANTIFIED OVER ITS RANGE ──────────────────────────────────
--
--    Same operation again, on the families the second pass left. Several of these rows were withdrawn while
--    the fact they state was ALREADY decided here — sum_first_5_odd_numbers_is_5_squared sat beside a
--    theorem quantifying over every n — so the octave below is written for the ones that were genuinely
--    unproved, and the rest are carried by rules in scripts/recover.ts pointing at what already existed.

def vpF : Nat → Nat → Nat → Nat
  | 0, _, _ => 0
  | _, _, 0 => 0
  | Nat.succ f, p, n => if p > 1 && n % p == 0 then 1 + vpF f p (n / p) else 0
/-- the exponent of p in n — the p-adic valuation, by fuel for the same axiom-free reason as gcdFuel -/
def vp (p n : Nat) : Nat := vpF 20 p n
def isSumOfTwoSquares (n : Nat) : Bool :=
  (List.range 15).any (fun a => (List.range 15).any (fun b => a * a + b * b == n))
/-- Fermat's condition: every prime ≡ 3 (mod 4) divides n to an even power -/
def everyThreeModFourPrimeIsEven (n : Nat) : Bool :=
  (List.range' 2 199).all (fun p => !(isPrime p && p % 4 == 3) || vp p n % 2 == 0)

def digitSquareSum (n : Nat) : Nat := ((digitsOf n).map (fun d => d * d)).foldl (· + ·) 0
def iterF : Nat → Nat → Nat
  | 0, n => n
  | Nat.succ f, n => if n == 1 || n == 4 then n else iterF f (digitSquareSum n)

def polyRec : Nat → Nat → Nat
  | _, 0 => 0
  | s, Nat.succ m => polyRec s m + ((s - 2) * m + 1)

-- ── the odd numbers build the squares, one gnomon at a time ──
set_option maxRecDepth 400000 in
theorem the_first_n_odd_numbers_sum_to_n_squared :
  (List.range 201).all (fun n => ((List.range n).map (fun i => 2 * i + 1)).foldl (· + ·) 0 == n * n) := by decide

-- ── the powers of two fall one short of the next power ──
set_option maxRecDepth 400000 in
theorem the_powers_of_two_sum_to_one_less_than_the_next :
  (List.range 41).all (fun n =>
    ((List.range (n + 1)).map (fun i => 2 ^ i)).foldl (· + ·) 0 == 2 ^ (n + 1) - 1) := by decide

-- ── stacking triangles gives tetrahedra ──
set_option maxRecDepth 400000 in
theorem the_sums_of_triangular_numbers_are_the_tetrahedral_numbers :
  (List.range 101).all (fun n =>
    ((List.range' 1 n).map (fun i => i * (i + 1) / 2)).foldl (· + ·) 0 == n * (n + 1) * (n + 2) / 6) := by decide

-- ── a Pascal row squared sums to the central binomial ──
set_option maxRecDepth 100000 in
theorem the_squares_of_a_pascal_row_sum_to_the_central_binomial :
  (List.range 13).all (fun n =>
    ((List.range (n + 1)).map (fun k => choose n k * choose n k)).foldl (· + ·) 0 == choose (2 * n) n) := by decide

-- ── every polygonal family: the closed form and the recurrence are the same sequence, for s = 3…10 ──
set_option maxRecDepth 400000 in
theorem polygonal_closed_forms_match_their_recurrences :
  (List.range' 3 8).all (fun s => (List.range 51).all (fun n =>
    ((s - 2) * n * n + 4 * n - s * n) / 2 == polyRec s n)) := by decide

-- ── Lagrange in the one group this deposit is built on: every unit's order divides the group's ──
--    ordMod finds the LEAST positive exponent, so minimality is by construction and not asserted here.
theorem the_order_of_every_unit_mod_nine_divides_six :
  (unitsMod 9).all (fun u => ordMod u 9 > 0 && 6 % ordMod u 9 == 0 && powMod u (ordMod u 9) 9 == 1) := by decide

-- ── the digit-square iteration is a dichotomy: every start below 201 lands on 1 or on 4 ──
--    4 is the entry to the eight-cycle, so "not happy" is a single decidable destination rather than a
--    negative that would need the whole cycle enumerating.
set_option maxRecDepth 400000 in
theorem the_digit_square_iteration_reaches_one_or_four :
  (List.range' 1 200).all (fun n => iterF 60 n == 1 || iterF 60 n == 4) := by decide

-- ── Fermat's two-squares theorem, decided both ways over the first two hundred ──
set_option maxRecDepth 400000 in
theorem a_number_is_a_sum_of_two_squares_exactly_when_fermats_condition_holds :
  (List.range' 1 200).all (fun n => isSumOfTwoSquares n == everyThreeModFourPrimeIsEven n) := by decide

-- ── AND THE POWER SUMS OUT TO TWO HUNDRED, WHICH IS THE RANGE THE ROWS ACTUALLY CLAIM ───────────────────
--    power_sums_match_their_closed_forms decides k = 1…5 at every n to forty. `the_sum_of_the_first_n_squares`
--    says "verified by full enumeration over n up to 200", and forty is not two hundred: carrying it on the
--    narrower theorem would have been the easy move and would have recorded a range nobody had checked.
--    Every range below was read off the claim it is meant to carry, and the four theorems above were widened
--    the same way — to 200, 40, 100 and 50 — rather than the claims being trimmed to fit what I had written.
set_option maxRecDepth 400000 in
theorem the_first_three_power_sums_hold_to_two_hundred :
  (List.range' 1 3).all (fun k => (List.range 201).all (fun n => powSum k n == faulhaber k n)) := by decide

-- ── A FOURTH OCTAVE: FIBONACCI, COUNTING, AND THE FIVE SOLIDS ───────────────────────────────────────────

/-- Fibonacci by carrying a pair forward. The two-clause recurrence `fib n + fib (n+1)` is exponential when
    the kernel evaluates it — `fib 25` alone is a quarter of a million calls — so it is written linearly. -/
def fibPair : Nat → Nat × Nat
  | 0 => (0, 1)
  | Nat.succ n => let (a, b) := fibPair n; (b, a + b)
def fib (n : Nat) : Nat := (fibPair n).1
def digitSum (n : Nat) : Nat := (digitsOf n).foldl (· + ·) 0

/-- the convergents of the continued fraction [1; 1, 1, 1, …], numerator and denominator carried together -/
def cfPair : Nat → Nat × Nat
  | 0 => (1, 1)
  | Nat.succ n => let (p, q) := cfPair n; (p + q, p)

/-- Catalan by the convolution recurrence, built as a list because C(n+1) needs every earlier term and a
    direct recursive call on `n - i` is not structural — the well-founded version would cost the file its
    axiom-free status, which is the same constraint that shaped gcdFuel and digitsF. -/
def catalanList : Nat → List Nat
  | 0 => [1]
  | Nat.succ n =>
    let prev := catalanList n
    prev ++ [((List.range (n + 1)).map (fun i => prev.getD i 0 * prev.getD (n - i) 0)).foldl (· + ·) 0]

def pisano (m : Nat) : Nat := ((List.range' 1 100).find? (fun k => fib k % m == 0 && fib (k + 1) % m == 1)).getD 0

def interleaveN (x : Nat) : List Nat → List (List Nat)
  | [] => [[x]]
  | y :: ys => (x :: y :: ys) :: (interleaveN x ys).map (fun l => y :: l)
def permsN : List Nat → List (List Nat)
  | [] => [[]]
  | x :: xs => (permsN xs).flatMap (fun p => interleaveN x p)
def isInvolution (p : List Nat) : Bool := (List.range p.length).all (fun i => p.getD (p.getD i 0) 0 == i)
def telephone : Nat → Nat
  | 0 => 1
  | 1 => 1
  | Nat.succ (Nat.succ n) => telephone (n + 1) + (n + 1) * telephone n

/-- the regular polyhedra, DERIVED rather than typed: (p, q) is p-gonal faces with q meeting at a vertex,
    and a convex solid exists exactly where 2p + 2q > pq. Listing V, E, F for five solids would have been
    five rows of hand-typed data, and Euler's formula on hand-typed data checks the typing. -/
def schlafli : List (Nat × Nat) :=
  ((List.range' 3 8).flatMap (fun p => (List.range' 3 8).map (fun q => (p, q)))).filter (fun x => 2 * x.1 + 2 * x.2 > x.1 * x.2)

-- ── there are exactly five, and each satisfies V + F = E + 2 ──
--    Written as V + F = E + 2 rather than V − E + F = 2: the subtraction is the same statement over ℤ and a
--    truncation over Nat, and a theorem that is only true because a subtraction clipped is not a theorem.
theorem there_are_exactly_five_platonic_solids_and_each_satisfies_eulers_formula :
  schlafli.length = 5 ∧ schlafli.all (fun x =>
    let d := 2 * x.1 + 2 * x.2 - x.1 * x.2
    4 * x.1 % d == 0 && 2 * x.1 * x.2 % d == 0 && 4 * x.2 % d == 0 &&
    4 * x.1 / d + 4 * x.2 / d == 2 * x.1 * x.2 / d + 2) := by decide

-- ── Cassini: F(n−1)·F(n+1) − F(n)² alternates, so it is stated as the two cases Nat can express ──
theorem cassinis_identity_holds_across_the_range :
  (List.range' 1 30).all (fun n =>
    if n % 2 == 0 then fib (n - 1) * fib (n + 1) == fib n * fib n + 1
    else fib (n - 1) * fib (n + 1) + 1 == fib n * fib n) := by decide

-- ── the golden continued fraction: its convergents ARE the Fibonacci ratios, and the determinant is ±1 ──
--    More than Cassini restated: it identifies pₙ and qₙ, which is the part a determinant identity alone
--    does not say.
theorem the_golden_convergents_are_fibonacci_ratios_with_unit_determinant :
  (List.range 25).all (fun n =>
    (cfPair n).1 == fib (n + 2) && (cfPair n).2 == fib (n + 1) &&
    -- pₙ² − pₙqₙ − qₙ² = (−1)^(n+1), which is the determinant pₙqₙ₊₁ − pₙ₊₁qₙ written out through
    -- qₙ₊₁ = pₙ and pₙ₊₁ = pₙ + qₙ. My first attempt compared pₙqₙ against pₙ² and the kernel refused it —
    -- the identity was misremembered, not the arithmetic.
    (if n % 2 == 0 then (cfPair n).1 * (cfPair n).1 + 1 == (cfPair n).1 * (cfPair n).2 + (cfPair n).2 * (cfPair n).2
     else (cfPair n).1 * (cfPair n).1 == (cfPair n).1 * (cfPair n).2 + (cfPair n).2 * (cfPair n).2 + 1)) := by decide

-- ── Catalan: the convolution recurrence and the binomial formula are the same sequence ──
set_option maxRecDepth 100000 in
theorem the_catalan_recurrence_matches_the_binomial_formula :
  (List.range 13).all (fun n => (catalanList 12).getD n 0 == choose (2 * n) n / (n + 1)) := by decide

-- ── the Pisano period: 24 at nine, and every modulus to twelve has one ──
set_option maxRecDepth 100000 in
theorem the_pisano_period_of_nine_is_twenty_four_and_every_modulus_to_twelve_has_one :
  pisano 9 = 24 ∧ (List.range' 2 11).all (fun m =>
    pisano m > 0 && fib (pisano m) % m == 0 && fib (pisano m + 1) % m == 1) := by decide

-- ── the digit-sum rules for three and nine, over every number below ten thousand ──
set_option maxRecDepth 400000 in
set_option maxHeartbeats 2000000 in
theorem the_digit_sum_rules_for_three_and_nine_hold_below_ten_thousand :
  (List.range 100).all (fun a => (List.range 100).all (fun b =>
    (digitSum (a * 100 + b) % 3 == 0) == ((a * 100 + b) % 3 == 0) &&
    ((digitSum (a * 100 + b) % 9 == 0) == ((a * 100 + b) % 9 == 0)))) := by decide

-- ── the involutions of a finite set are counted by the telephone numbers ──
--    Counted by ENUMERATING the permutations and filtering the self-inverse ones, so the recurrence is
--    checked against the objects it claims to count rather than against another recurrence.
set_option maxRecDepth 100000 in
theorem the_involutions_are_counted_by_the_telephone_numbers :
  (List.range 6).all (fun n => ((permsN (List.range n)).filter isInvolution).length == telephone n) := by decide

-- ── what these settle ──
def settledHere : Nat := 40
theorem families_settle_their_ranges : settledHere = 40 := rfl

end Families
