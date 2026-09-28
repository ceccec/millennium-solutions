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

end Qpu
