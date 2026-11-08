-- title: What qpu.uuidna.com's cryptographic surface is, decided on its own integers
-- wing: the ring
-- prior_art: named
-- prior_art_domain: Fermat's difference-of-squares factorisation (1643); RSA (Rivest, Shamir, Adleman, 1977) on
--   the textbook modulus 91 = 7 · 13 with φ(91) = 72; the classical half of Shor's reduction (1994) — an even
--   period r with a^(r/2) ≢ −1 (mod N) gives the factors gcd(a^(r/2) ± 1, N); Grover's square-root search cost
--   (1996) and the birthday bound; the lifting-the-exponent lemma, v_3(2^n + 1) = v_3(3) + v_3(n) for odd n, and
--   the algebraic split a^3 + 1 = (a + 1)(a^2 − a + 1); Fermat's little theorem as a compositeness witness; RFC
--   9562's version and variant fields; and the 128-quantum-bit floor that qpu.uuidna.com reads from the Classic
--   McEliece ISO page.
-- prior_art_note: NONE OF THE MATHEMATICS IS THIS DEPOSIT'S, AND NONE OF IT IS qpu's. qpu.uuidna.com's seal,
--   σ-trapdoor, Shor run and thousand-bit surface are that service's constructions, read from ~/github/uuidna/qpu
--   on 2026-11-08 (src/quantum/uuid/index.ts `version`, `seal`, `uuidQubits`; src/quantum/processing/algorithms.ts
--   `createImpossible`, `decodeImpossible`; src/quantum/CRYPTO.md). What is decided here is only which NAMED LAW
--   each construction is, on the same integers, and exactly where each one stops.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: bounded
-- prior_art_own: the pairing of each construction with its law, the refuted controls beside each pairing, and the
--   multiply-back of this deposit's own factor route on the thousand-bit integer
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS, AND WHAT IT REFUSES TO SAY.
--
-- src/proof/qpu.lean decides what qpu.uuidna.com's REGISTER constants imply. This file does the same for its
-- CRYPTOGRAPHIC surface, which is the part a reader is most likely to quote and least likely to check. The
-- method is the one that file set: the service's numbers are recorded as its own declarations, and the kernel
-- decides what follows from them — never that the service is right, never that this deposit is.
--
--   1 · IT DOES NOT SAY THE SEAL IS SECURE. It says what the seal IS: a textbook RSA permutation of a residue
--       mod 91, folded mod 8. A permutation loses nothing; the fold is where the one-in-eight miss comes from.
--   2 · IT DOES NOT SAY THE TRAPDOOR IS IMPOSSIBLE. It says what the trapdoor IS: Fermat's difference of
--       squares, whose blind cost is the gap between the primes — and it decides the case where that cost is one.
--   3 · IT DOES NOT SAY THIS DEPOSIT FACTORS A THOUSAND-BIT INTEGER. It records what the factor route returned
--       on 2^999 + 1 — PARTIAL — and decides that the partial account multiplies back exactly.
--
-- No axioms, no Mathlib, no sorry.
import Qpu
import Capacity
set_option exponentiation.threshold 1100
set_option maxRecDepth 4000000

namespace QpuCrypto

-- ── 1 · THE SEAL NIBBLE IS TEXTBOOK RSA ON 91, THEN FOLDED MOD 8 ──────────────────────────────────────────
-- qpu's `version(digits)` reads the other 31 nibbles as a number r mod 91 and writes the version nibble as
-- 1 + (r^7 mod 91) mod 8. Its own comment names the parts: the exponent is rays, the modulus is C(faces, coins)
-- = rays · (faces − 1), the fold is mint(n) = 2^n. On those integers x ↦ x^7 mod 91 is RSA encryption with the
-- public exponent 7 on the textbook modulus 7 · 13: φ(91) = 72, gcd(7, 72) = 1, and 31 is the private exponent
-- because 7 · 31 = 217 = 3 · 72 + 1. A permutation of the 91 residues loses nothing; everything the seal
-- forgets, it forgets in the fold.
def sealModulus  : Nat := Qpu.rays * (Qpu.faces - 1)
def sealExponent : Nat := Qpu.rays
def sealFold     : Nat := 2 ^ Qpu.qubits
def totient      : Nat := (Qpu.rays - 1) * (Qpu.faces - 1 - 1)
def rsaInverse   : Nat := 31
def rsa (e r : Nat) : Nat := r ^ e % sealModulus
def sealOf (r : Nat) : Nat := 1 + rsa sealExponent r % sealFold
def permutes (e : Nat) : Bool := (List.range sealModulus).all (fun y => ((List.range sealModulus).filter (fun r => rsa e r == y)).length == 1)

-- PINNED, NOT RESTATED. The exponent 7 permutes, and 31 undoes it on every residue — but 7 is not the smallest
-- exponent that would: 5 permutes too (gcd(5, 72) = 1), while 2, 3, 4 and 6 do not. The control is the whole
-- row from 2 to 7, so a reader cannot take "7 permutes" for "7 was forced".
theorem the_seal_exponent_is_an_rsa_permutation_of_the_residues_mod_ninety_one :
  sealModulus = 91 ∧ sealExponent = 7 ∧ sealFold = 8 ∧ totient = 72
  ∧ sealExponent * rsaInverse = 3 * totient + 1
  ∧ (List.range sealModulus).all (fun r => rsa rsaInverse (rsa sealExponent r) == r)
  ∧ (List.range' 2 6).map permutes = [false, false, false, true, false, true] := by decide

-- THE FOLD IS WHERE THE SEAL MISSES. 91 residues fall into 8 nibble classes, and 91 = 11 · 8 + 3, so three
-- classes hold 12 residues and five hold 11. A middle tampered to a uniformly random residue wears the right
-- nibble with probability Σ count² / 91² = 1037 / 8281, which is 15 / 8281 ABOVE one in eight — the seal
-- detects slightly less than seven tampers in eight, not more. Decided as the counts, not as the fraction.
def nibbleCount (v : Nat) : Nat := ((List.range sealModulus).filter (fun r => sealOf r == v)).length
theorem the_fold_mod_eight_is_where_the_seal_misses_one_tamper_in_eight :
  (List.range' 1 8).all (fun v => nibbleCount v == (if v ≤ 3 then 12 else 11))
  ∧ nibbleCount 0 = 0 ∧ (List.range' 9 7).all (fun v => nibbleCount v == 0)
  ∧ (List.range' 1 8).foldl (fun acc v => acc + nibbleCount v) 0 = sealModulus
  ∧ (List.range' 1 8).foldl (fun acc v => acc + nibbleCount v * nibbleCount v) 0 = 1037
  ∧ 8 * 1037 - sealModulus * sealModulus = 15 := by decide

-- TWO SEALS, ONE NIBBLE, ABOUT ONE ADDRESS IN EIGHT IN COMMON. This deposit's toUuid fixes the version nibble
-- to 8 (RFC 9562 v8); qpu decides it from the content, and 8 is one of its eight values. So a toUuid address
-- passes qpu's seal exactly when its other 31 nibbles fall in one of the 11 residue classes that fold to 8,
-- and a qpu address passes the RFC v8 check exactly when its nibble came out 8 — 11 residues of 91 either way.
-- Neither seal is the other's; they agree on a fraction the kernel can count.
theorem the_fixed_version_eight_and_the_decided_nibble_agree_on_eleven_residues_in_ninety_one :
  nibbleCount 8 = 11 ∧ 11 * 8 < sealModulus ∧ sealModulus < 12 * 8
  ∧ (List.range sealModulus).all (fun r => 1 ≤ sealOf r && sealOf r ≤ 8)
  ∧ (List.range sealModulus).any (fun r => sealOf r == 8)
  ∧ (List.range sealModulus).all (fun r => sealOf r != 0 && sealOf r != 15) := by decide

-- ── 2 · BOTH SIDES SPEND THE SAME SIX BITS, AND THE FREE REGISTER IS 122 ON BOTH ──────────────────────────
-- qpu's `uuidQubits` writes the register as 32 · width − width − 2 and calls it 122 effective qubits at width 4.
-- src/proof/capacity.lean decides free = container − reserved = 128 − 6 = 122 for the same six bits (four of
-- version, two of variant) under RFC 9562. One formula is in qubits per hex digit, the other in reserved bits;
-- they land on one integer, and only at width 4.
def qpuRegister (width : Nat) : Nat := 32 * width - width - 2
theorem the_free_register_is_one_hundred_twenty_two_on_both_sides :
  (List.range 9).all (fun w => (qpuRegister w == Capacity.free) == (w == Qpu.hexbit))
  ∧ qpuRegister Qpu.hexbit = Capacity.free ∧ Capacity.free = 122
  ∧ 32 * Qpu.hexbit = Capacity.container ∧ Qpu.hexbit + 2 = Capacity.reserved
  ∧ qpuRegister Qpu.hexbit = Capacity.container - Capacity.reserved := by decide

-- ── 3 · THE GROVER FLOOR: A SQUARE ROOT OF THE FREE REGISTER, AND WHERE 128 SITS ──────────────────────────
-- qpu's CRYPTO.md writes 2^(122/3) < 2^61 < 2^128 < 2^256 and reads the 128 as the floor ISO asked of its
-- post-quantum mechanisms. Decided here on Capacity.free: Grover's exponent is free / 2 = 61, the collision
-- exponent free / 3 sits between 40 and 41, and the floor is 67 bits above the coin. The 61 is the SAME integer
-- capacity.lean reaches as the birthday exponent, and for the same reason — both are the square root of the
-- space — so that agreement is a law shared, not a coincidence found. A register clears the 128 floor under a
-- square-root attack only from 256 free bits, which no 128-bit container has.
def groverExponent    : Nat := Capacity.free / 2
def collisionExponent : Nat := Capacity.free / 3
def isoFloor          : Nat := 128
theorem one_coin_sits_sixty_seven_bits_below_the_iso_post_quantum_floor_under_grover :
  groverExponent = 61 ∧ collisionExponent = 40
  ∧ 3 * collisionExponent < Capacity.free ∧ Capacity.free < 3 * (collisionExponent + 1)
  ∧ 2 ^ collisionExponent < 2 ^ groverExponent ∧ 2 ^ groverExponent < 2 ^ isoFloor ∧ 2 ^ isoFloor < 2 ^ (2 * isoFloor)
  ∧ isoFloor - groverExponent = 67
  ∧ (List.range 300).all (fun n => (n / 2 ≥ isoFloor) == (n ≥ 2 * isoFloor))
  ∧ Capacity.container < 2 * isoFloor := by decide

-- ── 4 · SHOR ON 91: qpu's BASE IS ONE OF FIFTY-FOUR THAT SPLIT, AND SEVENTEEN DO NOT ──────────────────────
-- qpu's Lean runs the classical half of Shor on shorModulus = rays · (faces − 1) = 91 with shorBase = mint n = 8:
-- period 4, a^2 = 64, gcd(63, 91) = 7, gcd(65, 91) = 13. That is one base. Decided over EVERY unit mod 91: 54
-- of the 71 split, 8 have an odd period and 9 land on −1 at the half period, and those 17 split nothing. The
-- choice of 8 was not luck, but it was a choice, and the row that says so is written down.
def powMod (a e m : Nat) : Nat := a ^ e % m
def periodAux : Nat → Nat → Nat → Nat → Nat
  | 0, _, _, _ => 0
  | fuel + 1, a, m, r => if powMod a r m = 1 then r else periodAux fuel a m (r + 1)
def period (a m : Nat) : Nat := periodAux m a m 1
def shorBase : Nat := 2 ^ Qpu.qubits
-- gcd by fuel, as qpu's own Lean writes it: Nat.gcd's termination proof carries an axiom into `#print axioms`,
-- and this file's law is that a `by decide` theorem depends on none.
def gcdAux : Nat → Nat → Nat → Nat
  | 0, a, _ => a
  | fuel + 1, a, b => if b = 0 then a else gcdAux fuel b (a % b)
def gcd (a b : Nat) : Nat := gcdAux (a + b) a b
def units : List Nat := (List.range' 2 (sealModulus - 2)).filter (fun a => gcd a sealModulus == 1)
def oddPeriod (a : Nat) : Bool := period a sealModulus % 2 == 1
def landsOnMinusOne (a : Nat) : Bool := period a sealModulus % 2 == 0 && powMod a (period a sealModulus / 2) sealModulus == sealModulus - 1
def splitsBy (a : Nat) : Bool := !(oddPeriod a || landsOnMinusOne a)
theorem shor_on_ninety_one_splits_from_qpus_base_and_from_fifty_three_others :
  shorBase = 8 ∧ period shorBase sealModulus = 4
  ∧ gcd (powMod shorBase 2 sealModulus - 1) sealModulus = Qpu.rays
  ∧ gcd (powMod shorBase 2 sealModulus + 1) sealModulus = Qpu.faces - 1
  ∧ (List.range' 1 20).all (fun a => (List.range' 1 20).all (fun b =>
      a % gcd a b == 0 && b % gcd a b == 0 && (List.range' (gcd a b + 1) 20).all (fun d => a % d != 0 || b % d != 0)))
  ∧ Qpu.rays * (Qpu.faces - 1) = sealModulus
  ∧ units.length = 71 ∧ (units.filter splitsBy).length = 54
  ∧ (units.filter oddPeriod).length = 8 ∧ (units.filter landsOnMinusOne).length = 9
  ∧ period 9 sealModulus = 3 ∧ period (sealModulus - 1) sealModulus = 2
  ∧ splitsBy 9 = false ∧ splitsBy (sealModulus - 1) = false ∧ splitsBy shorBase = true := by decide

-- ── 5 · THE σ-TRAPDOOR IS FERMAT'S DIFFERENCE OF SQUARES ──────────────────────────────────────────────────
-- qpu's `createImpossible` mints N = p · q from two odd primes with the witness w = (p + q) / 2, and
-- `decodeImpossible` opens it as p = w − b, q = w + b with b = √(w² − N). That is Fermat, 1643: w² − N =
-- ((q − p) / 2)². The witness is unique because a semiprime has one split into two factors above 1, and a wrong
-- witness decodes nothing for exactly that reason — decided over every witness position in the blind range.
def isPrime (n : Nat) : Bool := n ≥ 2 && (List.range' 2 (n - 2)).all (fun d => n % d != 0)
def oddPrimes : List Nat := (List.range' 3 27).filter isPrime
def small     : List Nat := (List.range' 3 17).filter isPrime
def splits (N : Nat) : List (Nat × Nat) := ((List.range' 2 N).filter (fun u => N % u == 0 && u * u ≤ N)).map (fun u => (u, N / u))
def ceilSqrt (N : Nat) : Nat := ((List.range' 0 (N + 1)).find? (fun x => x * x ≥ N)).getD 0
def witness (p q : Nat) : Nat := (p + q) / 2
def decodes (N x : Nat) : Bool := (List.range' 0 (x - 1)).any (fun b => (x - b) * (x + b) == N)
theorem the_sigma_trapdoor_is_fermats_difference_of_squares :
  oddPrimes = [3, 5, 7, 11, 13, 17, 19, 23, 29]
  ∧ oddPrimes.all (fun p => oddPrimes.all (fun q => !(p < q) || witness p q * witness p q - p * q == ((q - p) / 2) * ((q - p) / 2)))
  ∧ oddPrimes.all (fun p => oddPrimes.all (fun q => !(p < q) || splits (p * q) == [(p, q)]))
  ∧ oddPrimes.all (fun p => oddPrimes.all (fun q => !(p < q) || decodes (p * q) (witness p q)))
  ∧ oddPrimes.all (fun q => (2 + q) % 2 == 1) := by decide

theorem a_wrong_witness_decodes_nothing_because_a_semiprime_has_one_split :
  small = [3, 5, 7, 11, 13, 17, 19]
  ∧ small.all (fun p => small.all (fun q => !(p < q)
      || (List.range' (ceilSqrt (p * q)) ((p * q + 1) / 2 - ceilSqrt (p * q))).all (fun x => decodes (p * q) x == (x == witness p q)))) := by decide

-- THE CRACK qpu's OWN FIELD REPORTS. `createImpossible` returns `blindReflections` = w − ⌈√N⌉ + 1: the number
-- of positions a search without the witness walks from ⌈√N⌉ up to w. For twin primes that number is ONE — the
-- integer is opened blind in a single reflection — and it grows with the gap between the primes. "Impossible"
-- is a statement about the gap, not about the width, and it is decided here on every twin pair below thirty.
def blind (p q : Nat) : Nat := witness p q - ceilSqrt (p * q) + 1
theorem an_impossible_integer_with_twin_primes_is_opened_blind_in_one_reflection :
  blind 11 13 = 1 ∧ blind 5 7 = 1 ∧ blind 3 29 = 7
  ∧ (oddPrimes.filter (fun p => isPrime (p + 2))) = [3, 5, 11, 17, 29]
  ∧ oddPrimes.all (fun p => !(isPrime (p + 2)) || blind p (p + 2) == 1)
  ∧ oddPrimes.all (fun p => oddPrimes.all (fun q => !(p < q) || blind p q ≥ 1))
  ∧ blind 3 29 > blind 3 5 := by decide

-- ── 6 · THE THOUSAND-BIT INTEGER qpu FACTORS, AND WHAT THIS DEPOSIT'S ROUTE RETURNS ON IT ────────────────
-- qpu's CRYPTO.md: 2^999 + 1 has 1000 bits, three divides it, and it splits into cyclotomic pieces. Decided
-- here with the bound on the threes: 3^4 divides it and 3^5 does not, which is the lifting-the-exponent lemma
-- at this instance (v_3(2^999 + 1) = v_3(2 + 1) + v_3(999) = 1 + 3). The algebraic split a^3 + 1 =
-- (a + 1)(a^2 − a + 1) is applied three times, 999 = 3 · 3 · 3 · 37, down to 2^37 + 1 = 3 · 1777 · 25781083.
def thousand : Nat := 2 ^ 999 + 1
theorem the_thousand_bit_integer_has_a_thousand_bits_and_exactly_four_threes :
  2 ^ 999 ≤ thousand ∧ thousand < 2 ^ 1000
  ∧ (List.range' 1 6).all (fun k => (thousand % 3 ^ k == 0) == (k ≤ 4))
  ∧ 999 = 27 * 37
  ∧ (2 ^ 333 + 1) * (2 ^ 666 - 2 ^ 333 + 1) = thousand
  ∧ (2 ^ 111 + 1) * (2 ^ 222 - 2 ^ 111 + 1) = 2 ^ 333 + 1
  ∧ (2 ^ 37 + 1) * (2 ^ 74 - 2 ^ 37 + 1) = 2 ^ 111 + 1
  ∧ 2 ^ 37 + 1 = 3 * 1777 * 25781083 := by decide

-- MEASURED 2026-11-08 with src/factor/index.ts on the decimal of 2^999 + 1: status PARTIAL, fourteen factors
-- found below the trial bound (3 four times, then 19 … 97377658867), and a 244-digit cofactor that Pollard rho
-- did not split in 500 000 steps, reported composite by a witness. The route does not factor the integer and
-- does not say it does. What the kernel adds is that the account is an IDENTITY: the fourteen factors times the
-- cofactor are the integer, no found prime still divides the cofactor, and 2 is a Fermat witness against it —
-- 2^(c − 1) ≢ 1 (mod c), computed by square-and-multiply so the exponent is never expanded.
def found : List Nat := [3, 3, 3, 3, 19, 1777, 3331, 17539, 23977, 87211, 304363, 25781083, 5814899281, 97377658867]
def cofactor : Nat := 3609104950099351833043508337831612057396401348775709961277801618185533776454902446192620269318904367011984674065478055484306453675012250321071523714940753877783971448660823020399749748515419197076882611704620121314559503976901003284138222351507
def powModAux : Nat → Nat → Nat → Nat → Nat → Nat
  | 0, _, _, _, acc => acc
  | fuel + 1, b, e, m, acc => if e = 0 then acc else powModAux fuel (b * b % m) (e / 2) m (if e % 2 = 1 then acc * b % m else acc)
def powModBin (b e m : Nat) : Nat := powModAux 1024 (b % m) e m (1 % m)
theorem this_deposits_factor_route_returns_a_partial_answer_that_multiplies_back :
  found.foldl (· * ·) 1 * cofactor = thousand
  ∧ found.length = 14 ∧ (found.filter (· == 3)).length = 4
  ∧ found.all (fun p => 1 < p && cofactor % p != 0)
  ∧ cofactor % 2 = 1 ∧ cofactor % 3 = 1
  ∧ powModBin 2 (cofactor - 1) cofactor ≠ 1
  ∧ powModBin 2 4 7 = 2 ∧ powModBin 3 6 7 = 1 := by decide

end QpuCrypto
