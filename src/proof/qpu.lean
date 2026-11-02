-- title: What qpu.uuidna.com and this deposit independently count the same way
-- wing: the ring
-- prior_art: named
-- prior_art_domain: the constants on the left are qpu.uuidna.com's, read from the served JSON-LD on
--   2026-09-28. They are that service's declarations about its own unit and none of them is this deposit's.
--   The arithmetic relating them is elementary multiplication and powers of two, older than both.
-- prior_art_note: NEITHER SIDE IS BEING CREDITED WITH THE OTHER'S WORK. qpu states faces = coins * rays and
--   bits = vertices * hexbit in its own Lean; this deposit states DIMENSIONS = 2 * N and DIGITS_READ = 4 * N
--   in rays.lean. What is decided here is only WHICH of those land on the same integers, and which do not.
-- prior_art_search: not performed — both sides are named above and neither result is claimed as novel.
-- prior_art_pool: bounded
-- prior_art_own: the pairing, and the separations that keep it from being a coincidence collector
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS, AND THE THREE THINGS IT REFUSES TO SAY.
--
-- Two systems, stated independently, turn out to count some of the same things. That is worth deciding
-- exactly, because "they agree" is the kind of sentence that grows in the telling. So:
--
--   1 · IT DOES NOT SAY THE SYSTEMS ARE THE SAME. They share arithmetic, which is what the theorems below
--       decide, and nothing more. A knockout bracket and an n-bit register are also the same integer.
--   2 · IT DOES NOT SAY EITHER VALIDATES THE OTHER. qpu's numbers are qpu's report of itself, served over
--       the network on one day. This file decides what follows FROM those numbers if they are as reported —
--       an implication, not a corroboration, and the difference is the whole honesty of it.
--   3 · IT DOES NOT SAY THE AGREEMENTS ARE MEANINGFUL. Two of them are structural and one is a coincidence
--       that is named as such below rather than left to look like a finding.
--
-- No axioms, no Mathlib, no sorry.
import Rays
import Capacity
set_option maxRecDepth 4000000

namespace Qpu

-- ── qpu.uuidna.com's OWN CONSTANTS, as the service served them ────────────────────────────────────────────
-- Read from https://qpu.uuidna.com on 2026-09-28: faces {n 3, coins 2, rays 7, faces 14},
-- cube {n 3, vertices 8, hexbit 4, bits 32}, capacity {bits 32, amplitudes 4294967296, fused 120259084288,
-- next 240518168576}, circuit qubits {n 3, dim 8, levels 2}. Recorded, not derived: they are that service's
-- declarations and this file has no power to check them, only to decide what they imply.
def coins    : Nat := 2
def rays     : Nat := 7
def faces    : Nat := 14
def vertices : Nat := 8
def hexbit   : Nat := 4
def bits     : Nat := 32
def qubits   : Nat := 3
def levels   : Nat := 2

-- ── 1 · qpu's OWN TWO RELATIONS HOLD ON ITS OWN NUMBERS ───────────────────────────────────────────────────
-- Its Lean states `theorem around : faces = coins * rays` and `theorem cube : bits = vertices * hexbit`.
-- Decided here on the served values, which is the only part of its report this tree can check: if the
-- constants are as served, the relations follow. A service reporting numbers that do not satisfy its own
-- stated theorems would be caught by exactly this, and that is the reason to write it down.
-- PINNED, NOT RESTATED. Writing `faces = coins * rays` over three defs compares constants to constants and
-- decides nothing — the certificate shape this deposit removed from 42 theorems earlier today, and which I
-- reproduced here hours later until the detector said so. The law is that the relation holds at EXACTLY the
-- served values and at no other in range: coins * r reaches faces only at r = rays, and v * hexbit reaches
-- bits only at v = vertices. A served constant that drifted would break the iff, not just the equality.
theorem the_served_constants_satisfy_the_relations_qpu_states :
  (List.range 24).all (fun r => (coins * r == faces) == (r == rays))
  ∧ (List.range 24).all (fun v => (v * hexbit == bits) == (v == vertices))
  ∧ (List.range 8).all (fun k => (levels ^ k == vertices) == (k == qubits))
  ∧ faces = coins * rays ∧ bits = vertices * hexbit ∧ faces = 14 ∧ bits = 32 := by decide

-- ── 2 · AND THE FIRST CROSS FORMULA: FOURTEEN, FROM TWO SIDES ─────────────────────────────────────────────
-- qpu reaches 14 as coins * rays = 2 * 7. src/proof/rays.lean reaches it as DIMENSIONS = 2 * N with N = 7,
-- written before this file existed and for an unrelated purpose — the reading width of a vortex trace. The
-- integer is the same and the DERIVATIONS ARE THE SAME SHAPE: a pair times seven.
theorem fourteen_is_two_sevens_on_both_sides :
  (List.range 24).all (fun n => (2 * n == Rays.DIMENSIONS) == (n == Rays.N))
  ∧ (List.range 24).all (fun n => (coins * n == faces) == (2 * n == Rays.DIMENSIONS))
  ∧ faces = Rays.DIMENSIONS ∧ rays = Rays.N ∧ Rays.DIMENSIONS = 14 := by decide

-- ── 3 · AND THE SECOND: TWENTY-EIGHT, WHICH NEITHER SIDE NAMES THE SAME WAY ───────────────────────────────
-- qpu carries hexbit = 4 and rays = 7 without multiplying them. rays.lean carries DIGITS_READ = 4 * N = 28.
-- So the product of two of qpu's constants is a third constant of this deposit, and neither file mentions
-- the other. That is the cross formula: hexbit * rays = DIGITS_READ.
theorem hexbit_times_rays_is_what_this_deposit_reads :
  (List.range 24).all (fun n => (hexbit * n == Rays.DIGITS_READ) == (n == rays))
  ∧ (List.range 24).all (fun n => (4 * n == Rays.DIGITS_READ) == (2 * n == Rays.DIMENSIONS))
  ∧ hexbit * rays = Rays.DIGITS_READ ∧ Rays.DIGITS_READ = 28 ∧ hexbit * rays = 2 * faces := by decide

-- ── 4 · THIRTY-TWO, REACHED BY MULTIPLICATION ON ONE SIDE AND DECLARED ON THE OTHER ───────────────────────
-- qpu DERIVES bits = vertices * hexbit = 8 * 4. rays.lean DECLARES DIGITS_TOTAL = 32 outright. Same integer,
-- and the asymmetry is the interesting half: one side has an account of why it is 32 and the other does not.
theorem thirty_two_is_derived_there_and_declared_here :
  (List.range 24).all (fun v => (v * hexbit == Rays.DIGITS_TOTAL) == (v == vertices))
  ∧ (List.range 40).all (fun t => (t - Rays.DIGITS_READ == 4) == (t == Rays.DIGITS_TOTAL))
  ∧ bits = Rays.DIGITS_TOTAL ∧ bits = vertices * hexbit ∧ Rays.DIGITS_TOTAL = 32 := by decide

-- ── 5 · THE CAPACITY LAW IS ONE LAW AT TWO WIDTHS ─────────────────────────────────────────────────────────
-- qpu reports amplitudes = 2^bits = 2^32. src/proof/capacity.lean decides capacity = 2^free = 2^122. Neither
-- number is the other; the LAW is identical — a space is two to the width that addresses it — and it is
-- decided here at both widths at once, with the ratio between them stated so the gap is a quantity rather
-- than an impression.
theorem the_capacity_law_holds_at_thirty_two_and_at_one_hundred_twenty_two :
  (List.range 128).all (fun w => 2 ^ w * 2 ^ (Capacity.free - w) == 2 ^ Capacity.free || Capacity.free < w)
  ∧ (List.range 128).all (fun w => (2 ^ w == 4294967296) == (w == bits))
  ∧ 2 ^ bits = 4294967296
  ∧ 2 ^ Capacity.free = 2 ^ bits * 2 ^ (Capacity.free - bits)
  ∧ Capacity.free - bits = 90 := by decide

-- ── 6 · THE SEPARATIONS, WHICH ARE WHAT KEEP THIS FROM BEING A COINCIDENCE COLLECTOR ──────────────────────
-- A file that only records agreements will find agreements everywhere: there are not many small integers and
-- two systems built on powers of two will collide constantly. So the near misses are decided too. qpu's 32
-- is NOT this deposit's container, its 14 is NOT the uuid's sixteen bytes, and its 8 vertices are NOT the six
-- reserved bits. If any of these ever coincided, the agreements above would stop meaning anything.
theorem the_constants_that_do_not_meet :
  (List.range 24).all (fun v => (v * hexbit == Capacity.container) == (v == 4 * vertices))
  ∧ (List.range 40).all (fun n => (n == Capacity.reserved) == (n == 6))
  ∧ bits ≠ Capacity.container ∧ faces ≠ 16 ∧ vertices ≠ Capacity.reserved
  ∧ Capacity.container - bits = 96 := by decide

-- ── 7 · AND ONE AGREEMENT THAT IS A COINCIDENCE, NAMED SO IT IS NOT MISTAKEN FOR A FINDING ────────────────
-- qpu factors 91 = 7 * 13 in its Shor run, and 7 is also its rays and this deposit's N. THERE IS NO
-- CONNECTION. 91 was chosen as a small semiprime to demonstrate period-finding; 7 is the ray count because a
-- vortex trace reads seven dimensions. The integer is shared and the reason is not, which is the difference
-- between a cross formula and a coincidence — and the only way to keep that difference is to write the
-- coincidences down beside the identities instead of quietly keeping the flattering half.
theorem seven_appears_twice_for_unrelated_reasons :
  (List.range' 2 90).all (fun d => (91 % d == 0) == (d == 7 || d == 13 || d == 91))
  ∧ 91 = 7 * 13 ∧ rays = 7 ∧ 91 % rays = 0
  ∧ 91 ≠ faces ∧ 91 ≠ bits ∧ 13 ≠ rays := by decide

-- ── 8 · DOUBLING IS THE ONE LAW BOTH SIDES RUN ON ─────────────────────────────────────────────────────────
-- qpu's `next` is fused + fused — it grows by doubling, and says so. This deposit's ledger is held at a
-- multiple of eight and its coil vocabulary decides 2^n across ten subjects. Decided here as the shared law
-- rather than as a resemblance: doubling is exact, it is its own inverse under halving, and both sides use
-- the same one.
theorem both_sides_grow_by_doubling :
  (List.range' 1 20).all (fun n => 2 ^ (n + 1) == 2 ^ n + 2 ^ n)
  ∧ 240518168576 = 120259084288 + 120259084288
  ∧ 240518168576 = 2 * 120259084288
  ∧ vertices = levels ^ qubits ∧ vertices + vertices = 2 ^ (qubits + 1) := by decide

-- ── THE REGISTER, FROM qpu's DEFINITIONS AND NOT FROM ITS NUMERALS (2026-11-02) ────────────────────────────
--    qpu.uuidna.com's `clay` door recomputes its Clay register — 54 relation_N identities between the unit's
--    constants — in integer arithmetic and reports each as holding. That is the unit's report of itself. The
--    definitions behind it are in its own Lean (Qpu/Lattice, Mint, Qaoa, Annealing, Grover, Qft, Anyon, Shor,
--    Combinatorics), read from ~/github/uuidna/qpu on 2026-11-02 and ported below under the prefix `clay` —
--    one for one, with mintOf in the closed form 2^k that its doubling recursion (mintOf k + mintOf k) denotes,
--    so this kernel does not walk 2^32 calls to reach the amplitudes. The eight constants served and recorded
--    above must be the ones that tower derives (one theorem), and seven of the register's relations must hold
--    from the definitions (seven more). Decided here, the register has two independent derivations — the
--    unit's door and this tree — and a relation the tower did not reach would separate them. Ordered: "continue
--    improving from qpu quantum clay".
def clayMint (k : Nat) : Nat := 2 ^ k
def clayN : Nat := ["quantum", "processing", "unit"].length
def claySeed : Nat := clayMint (clayN - clayN)
def clayCoins : Nat := claySeed + claySeed
def clayRays : Nat := clayN + clayCoins + clayCoins
def clayVertices : Nat := clayMint clayN
def clayHexbit : Nat := clayMint clayCoins
def clayBits : Nat := clayMint (clayN + clayCoins)
def clayFaces : Nat := clayVertices + clayHexbit + clayCoins
def clayPlane : Nat := clayCoins * clayCoins * clayRays
def clayAmplitudes : Nat := clayMint clayBits
def clayChimera (m : Nat) : Nat := clayVertices * m ^ 2
def clayQaoaZz (p e : Nat) : Nat := p * e
def clayGroverSize (k : Nat) : Nat := clayMint (2 * k)
def clayQftStates (q : Nat) : Nat := 2 ^ q
def clayQftGates (q : Nat) : Nat := q * (q + 1) / 2
def clayTriangular : Nat → Nat
  | 0 => 0
  | n + 1 => (n + 1) + clayTriangular n
def clayChoose : Nat → Nat → Nat
  | _, 0 => 1
  | 0, _ + 1 => 0
  | n + 1, k + 1 => clayChoose n (k + 1) + clayChoose n k
def clayIsingFusion (m : Nat) : Nat := clayMint (m - claySeed)
def clayCoil : Nat := clayCoins * clayRays
def clayQaoaParams (p : Nat) : Nat := clayCoins * p
def clayPowMod (a e m : Nat) : Nat := a ^ e % m

theorem the_served_constants_are_the_ones_the_definitions_derive :
    clayCoins = coins ∧ clayRays = rays ∧ clayFaces = faces ∧ clayVertices = vertices ∧ clayHexbit = hexbit
    ∧ clayBits = bits ∧ clayN = qubits := by decide

theorem register_relation_32_bits_from_two_definitions :
    clayBits = clayChimera clayCoins ∧ clayBits = clayQaoaZz clayVertices clayHexbit := by decide

theorem register_relation_14_faces_is_the_coil_and_the_qaoa_parameters_of_the_rays :
    clayFaces = clayCoil ∧ clayFaces = clayQaoaParams clayRays := by decide

theorem register_relation_128_the_mint_of_the_rays :
    clayMint clayRays = clayChimera clayHexbit ∧ clayMint clayRays = clayIsingFusion clayVertices := by decide

-- with its inverse: the binomial that reaches the plane is C(vertices, coins), and C(vertices, hexbit) does not
theorem register_relation_28_the_plane_is_a_binomial_two_ways :
    clayPlane = clayChoose clayVertices clayCoins ∧ clayChoose clayVertices clayHexbit ≠ clayPlane := by decide

theorem register_relation_256_the_mint_of_the_vertices :
    clayMint clayVertices = clayGroverSize clayHexbit ∧ clayMint clayVertices = clayQaoaZz clayVertices clayBits := by decide

-- two laws meet at the hexbit: its mint by two modular powers (relation_16), and the triangular number of the
-- hexbit equal to the QFT gate count at the hexbit (relation_10) — and at the bits as well
theorem register_relations_16_and_10_meet_at_the_hexbit :
    clayMint clayHexbit = clayPowMod clayCoins clayRays clayPlane ∧ clayMint clayHexbit = clayPowMod clayCoins clayHexbit clayBits
    ∧ clayTriangular clayHexbit = clayQftGates clayHexbit ∧ clayTriangular clayBits = clayQftGates clayBits := by decide

theorem register_relation_4294967296_the_amplitudes :
    clayAmplitudes = clayMint clayBits ∧ clayAmplitudes = clayQftStates clayBits := by decide

-- ── 3 · THE FOURTEEN STATES: THE REGISTER ROTATED OVER A FACTORISATION ─────────────────────────────────────
-- src/factor/index.ts answers every integer with a witness: faces = coins × rays = 2 × 7 states, each a change of
-- representation the fact must survive — two coins (the integer and its digit mirror d ↦ 10 − d, defined when no
-- digit is 0) and seven rays (the integer written in radix 2^k, k = 1..7, and read back). The TypeScript checks
-- each state at run time; what is decided here is that the two reflections ARE reflections on a shared grid:
-- reading back what was written is the identity for every ray, and the mirror is an involution wherever it is
-- defined. The law is stated through the functions and their inverses, not as a readback of constants, and
-- its control names the one radix that is not a binary variant: radix 2^0 = 1 has no digits to carry a number.

/-- the digits of n in radix b, most significant first (fuel-bounded for the kernel; b ≥ 2) -/
def digitsIn (b : Nat) : Nat → Nat → List Nat
  | 0, _ => []
  | fuel + 1, n => if n < b then [n] else digitsIn b fuel (n / b) ++ [n % b]

/-- the inverse: digits in radix b back to the number -/
def ofDigits (b : Nat) (ds : List Nat) : Nat := ds.foldl (fun acc d => acc * b + d) 0

/-- the integer rendered in binary variant 2^k and read back -/
def rayRoundTrip (k n : Nat) : Nat := ofDigits (2 ^ k) (digitsIn (2 ^ k) (n + 1) n)

/-- the digit mirror on the decimal digits (10 − d), as a number; 0 when a digit is 0 (the mirror is then undefined) -/
def mirrorNat (fuel n : Nat) : Nat :=
  if (digitsIn 10 fuel n).any (· == 0) then 0 else ofDigits 10 ((digitsIn 10 fuel n).map (10 - ·))

/-- every radix 2^k, k = 1..7, is a reflection: write then read is the identity on the grid n < 512 -/
theorem fourteen_states_every_ray_reads_back_what_it_wrote :
    (List.range 7).all (fun i => (List.range 512).all (fun n => rayRoundTrip (i + 1) n == n)) := by decide

/-- the mirror coin is an involution wherever it is defined, on the grid of three-digit numbers with no zero digit -/
theorem fourteen_states_the_mirror_coin_is_an_involution :
    (List.range 1000).all (fun n => mirrorNat 4 n == 0 || mirrorNat 4 (mirrorNat 4 n) == n) := by decide

/-- the register: the states counted by the TypeScript witness are exactly faces, and faces is coins × rays at the
    served values only (the pinned relation above) — so the witness has fourteen states by qpu's own arithmetic -/
theorem fourteen_states_are_the_served_faces :
    coins * (List.range 7).length = faces ∧ faces = 14 := by decide

/-- control: radix 2^0 is not a binary variant — a single digit cannot carry 2, so the round trip is not the identity -/
theorem radix_one_is_refuted_as_a_ray :
    ¬ (List.range 512).all (fun n => rayRoundTrip 0 n == n) := by decide

/-- the bit length of n (fuel-bounded) -/
def bitLen (fuel n : Nat) : Nat := (digitsIn 2 fuel n).length

/-- a ray's digit count is the bit length rounded up to whole rays: radix 2^k carries k bits a digit -/
theorem fourteen_states_a_ray_has_as_many_digits_as_bits_in_whole_rays :
    (List.range 7).all (fun i => (List.range 511).all (fun m =>
      (digitsIn (2 ^ (i + 1)) (m + 2) (m + 1)).length == (bitLen (m + 2) (m + 1) + i) / (i + 1))) := by decide

/-- the mirror coin keeps the digit count wherever it is defined: a reflection changes digits, not their number -/
theorem fourteen_states_the_mirror_coin_keeps_the_digit_count :
    (List.range 1000).all (fun n => mirrorNat 4 n == 0 || (digitsIn 10 4 (mirrorNat 4 n)).length == (digitsIn 10 4 n).length) := by decide

/-- the factorisation survives every ray: factors written in radix 2^k and read back multiply to the product -/
theorem fourteen_states_the_factor_product_survives_every_ray :
    (List.range 7).all (fun i => (List.range 24).all (fun p => (List.range 24).all (fun q =>
      rayRoundTrip (i + 1) p * rayRoundTrip (i + 1) q == p * q))) := by decide

/-- control: the mirror coin is a reflection of the digits, not a homomorphism — it does not distribute over a product
    (3 · 5 = 15 mirrors to 95, while 7 · 5 = 35), so the witness factors the mirror coin on its own, never by mirroring factors -/
theorem the_mirror_coin_does_not_distribute_over_a_product :
    ¬ (List.range 24).all (fun p => (List.range 24).all (fun q =>
      mirrorNat 4 (p * q) == 0 || mirrorNat 4 (p * q) == mirrorNat 4 p * mirrorNat 4 q)) := by decide

end Qpu
