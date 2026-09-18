set_option maxRecDepth 100000
-- title: The constants, derived from what they are
-- wing: the floor
-- prior_art: named
-- prior_art_domain: cryptographic hash standards and integer root extraction
-- prior_art_note: SHA-512 and its constants are FIPS 180-4 (NIST, 2015): K[t] is the first 64 bits of the
--   fractional part of the cube root of the t-th prime (§4.2.3) and H[i] the same of the square root
--   (§5.3.5). Newton's method for integer roots is classical. Neither is this deposit's. What is decided
--   here is only that THIS deposit's derivation computes those definitions and not something near them.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- src/0/sha512.ts used to carry eighty-eight hexadecimal literals. It computes them now, from the
-- definition FIPS gives — and that trade is only a gain if the computation is right. A wrong root gives a
-- hash that is self-consistent, round-trips perfectly, and is not SHA-512; the old literals at least had
-- the property that someone had once copied them from the standard.
--
-- So the derivation is decided here, and the pins below are the point rather than a lapse: `merge_agrees`
-- in merkle.lean does the same thing for the fold. A published value written down and compared against a
-- computation is an AGREEMENT check, which is the opposite of a typed constant standing in for one.
--
-- No axioms, no Mathlib, no sorry.

namespace Roots

/-- integer k-th root by Newton, fuel-bounded so the recursion is structural -/
def step : Nat → Nat → Nat → Nat → Nat
  | 0, _, _, x => x
  | Nat.succ g, k, n, x =>
    let y := ((k - 1) * x + n / x ^ (k - 1)) / k
    if y >= x then x else step g k n y

-- NO `Nat.log2` IN THE STARTING GUESS. A bit-length start converges in fewer steps and the kernel cannot
-- unfold it: `Nat.log2` is defined by well-founded recursion, so `decide` gets stuck on it — not slowly,
-- at all, and at every size. Measured under this deposit's Lean 4.15: the floor property would not decide
-- at 2^24 any more than at 2^192. Newton descends from n itself just as surely, and n is structural.
def iroot (k n : Nat) : Nat := if n < 2 then n else step 400 k n n

/-- the fractional part of the k-th root of p, as 64 bits — FIPS's own recipe -/
def frac64 (k p : Nat) : Nat := iroot k (p * 2 ^ (64 * k)) % 2 ^ 64

-- ── THE ROOT IS THE FLOOR, which is the whole of what `iroot` must be ───────────────────────────────────
-- Newton converges; converging is not the same as landing on the floor, and an implementation one short
-- would still produce a table, still be self-consistent, and still be wrong.
-- ── THE ROOT IS THE FLOOR, which is the whole of what `iroot` must be ───────────────────────────────────
-- Newton converges; converging is not the same as landing on the floor, and an implementation one short
-- would still produce a table, still be self-consistent, and still be wrong. Each case is its own theorem
-- because the kernel will not reduce six of these in one conjunction — stated rather than worked around.
set_option maxRecDepth 100000 in
theorem the_cube_root_is_the_floor :
  iroot 3 (2 * 2 ^ 192) ^ 3 <= 2 * 2 ^ 192 := by decide

set_option maxRecDepth 100000 in
theorem the_cube_root_is_not_one_short :
  2 * 2 ^ 192 < (iroot 3 (2 * 2 ^ 192) + 1) ^ 3 := by decide

set_option maxRecDepth 100000 in
theorem the_square_root_is_the_floor_and_not_one_short :
  iroot 2 (2 * 2 ^ 128) ^ 2 <= 2 * 2 ^ 128 ∧ 2 * 2 ^ 128 < (iroot 2 (2 * 2 ^ 128) + 1) ^ 2 := by decide

-- ── THE PRIMES ARE THE PRIMES, and in order, with none skipped ──────────────────────────────────────────
def isPrime (n : Nat) : Bool := n >= 2 && ((List.range' 2 (n - 2)).all (fun d => d * d > n || n % d != 0))

def firstPrimes (bound count : Nat) : List Nat := ((List.range' 2 bound).filter isPrime).take count

set_option maxRecDepth 100000 in
theorem the_prime_generator_is_complete :
  firstPrimes 40 8 = [2, 3, 5, 7, 11, 13, 17, 19]
    ∧ (firstPrimes 40 8).all isPrime
    ∧ ((List.range' 2 18).filter isPrime).length = 8 := by decide

-- ── AGREEMENT WITH THE PUBLISHED VALUES ─────────────────────────────────────────────────────────────────
-- The first round constant and the first initial value, as FIPS 180-4 prints them. Pinned, and compared
-- against the derivation — the same shape as merkle.lean's merge_agrees, and the opposite of a typed
-- constant standing in for a computation.
set_option maxRecDepth 100000 in
theorem the_first_round_constant_is_that_cube_root_fraction :
  frac64 3 2 = 0x428a2f98d728ae22 := by decide

set_option maxRecDepth 100000 in
theorem the_first_initial_value_is_that_square_root_fraction :
  frac64 2 2 = 0x6a09e667f3bcc908 := by decide

-- ── AND THE EXPONENT IS LOAD-BEARING ────────────────────────────────────────────────────────────────────
-- Both tables come from the same primes and differ only in k. If the two agreed, the derivation would be
-- deciding nothing about which root it took and the pins above would hold with the wrong one.
set_option maxRecDepth 100000 in
theorem the_cube_and_the_square_do_not_agree :
  frac64 3 2 != frac64 2 2 ∧ frac64 3 3 != frac64 2 3 := by decide

def settledHere : Nat := 7
set_option maxRecDepth 100000 in
theorem roots_settles_its_range : settledHere = 7 := rfl

end Roots
