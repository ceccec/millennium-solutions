set_option exponentiation.threshold 400
set_option maxRecDepth 10000
-- title: The register is a dial — a wider hexbit width clears the ISO floor, and costs exactly that much more to simulate
-- wing: the address
-- prior_art: named
-- prior_art_domain: the UUID 128-bit layout and its version/variant reservation (RFC 9562); qpu.uuidna.com's register
--   formula 32·w − w − 2 and its four hexbit widths 4 / 8 / 16 / 32; the birthday/Grover square-root exponent; the ISO
--   128-bit post-quantum floor qpu reads from the Classic McEliece ISO page; and the 2^n cost of a classical
--   state-vector over n qubits.
-- prior_art_note: none of this mathematics is new. The register formula and the widths are qpu's; the square root and
--   the ISO floor are standard. What is decided here is only that the floor is a FUNCTION of the width — a dial — so the
--   128-bit UUID (width 4) sitting 67 bits below it is one instance and a wider identifier clears it; and that the SAME
--   dial is the exponent of the simulation cost, so capacity and the cost of simulating it rise together. The capability
--   gap (quantum speedup) is untouched: a wider register is a bigger classical simulation, never a faster one.
-- prior_art_search: not performed — every law is named above and none is claimed as new.
-- prior_art_pool: bounded
-- prior_art_own: the pairing of the width to the floor it clears, and the control that the clearing width is also the
--   cost exponent, so raising it never buys an advantage.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry.

namespace Width

def reg    (w : Nat) : Nat := 32 * w - w - 2   -- qpu's uuidQubits: the free register at hexbit width w (also the state-vector cost exponent: 2^(reg w) amplitudes)
def grover (w : Nat) : Nat := reg w / 2        -- the square-root (Grover / birthday) exponent on that register
def isoFloor : Nat := 128                       -- the ISO post-quantum floor
def widths : List Nat := [4, 8, 16, 32]         -- qpu's four hexbit widths; width 4 is the 128-bit UUID

-- ── 1 · THE REGISTER AT EACH WIDTH, AND THE TWO FORMULAS AGREE ───────────────────────────────────────────
theorem the_register_at_each_width :
  widths.map reg = [122, 246, 494, 990]
  ∧ widths.all (fun w => reg w == 32 * w - w - 2)
  ∧ widths.all (fun w => reg w == 31 * w - 2) := by decide

-- ── 2 · THE GROVER EXPONENT AT EACH WIDTH ───────────────────────────────────────────────────────────────
theorem the_grover_exponent_at_each_width :
  widths.map grover = [61, 123, 247, 495]
  ∧ widths.all (fun w => grover w == reg w / 2) := by decide

-- ── 3 · THE FLOOR IS A FUNCTION OF THE WIDTH: CLEARED EXACTLY FROM WIDTH SIXTEEN ─────────────────────────
-- The 67-bit shortfall of the UUID is not fixed — it is the width-4 instance. Among the four widths the floor is
-- cleared iff w ≥ 16; width 8 (a 256-bit identifier) still falls five bits short, which is why the name is 16.
theorem the_iso_floor_is_cleared_exactly_from_width_sixteen :
  widths.all (fun w => (isoFloor ≤ grover w) == (16 ≤ w))
  ∧ grover 4 < isoFloor ∧ grover 8 < isoFloor
  ∧ isoFloor ≤ grover 16 ∧ isoFloor ≤ grover 32 := by decide

-- ── 4 · AND THAT IS EXACTLY TWO HUNDRED FIFTY-SIX FREE BITS — capacity.lean's threshold, read on the width ──
theorem clearing_the_floor_is_two_hundred_fifty_six_free_bits :
  widths.all (fun w => (isoFloor ≤ grover w) == (256 ≤ reg w))
  ∧ reg 8 < 256 ∧ 256 ≤ reg 16 := by decide

-- ── 5 · THE UUID IS WIDTH FOUR — the 122 register, 67 below the floor, that the deposit already seals ──────
theorem the_uuid_is_width_four_and_sits_sixty_seven_below :
  reg 4 = 122 ∧ grover 4 = 61 ∧ isoFloor - grover 4 = 67 ∧ 32 * 4 = 128 := by decide

-- ── 6 · THE DIAL ONLY TURNS UP: register and Grover exponent strictly increase across the widths ──────────
theorem the_register_grows_strictly_with_the_width :
  reg 4 < reg 8 ∧ reg 8 < reg 16 ∧ reg 16 < reg 32
  ∧ grover 4 < grover 8 ∧ grover 8 < grover 16 ∧ grover 16 < grover 32 := by decide

-- ── 7 · THE COST OF CLEARING IT: the register IS the amplitude exponent, so clearing needs ≥ 256 bits of it ─
-- A classical state-vector over the register is 2^(reg w) amplitudes. Clearing the floor means reg ≥ 256, i.e.
-- at least 2^256 amplitudes — the same number as the security the floor asks for. Decided on the exponents.
theorem clearing_the_floor_needs_a_cost_exponent_of_at_least_256 :
  256 ≤ reg 16 ∧ reg 8 < 256 ∧ 2 ^ 128 < 2 ^ 256 := by decide

-- ── 8 · THE CONTROL — CAPACITY IS NOT CAPABILITY ─────────────────────────────────────────────────────────
-- The cost exponent (reg w) is always MORE than the square-root exponent (grover w = reg w / 2), by exactly half
-- the register, and the gap WIDENS with the dial. So the width that clears the floor is the width that makes the
-- simulation larger: raising it buys capacity and never a speedup. This is the control the whole file rests on —
-- if raising the width ever made grover w ≥ reg w, capacity would have bought capability, and it never does.
theorem the_cost_exponent_is_more_than_the_square_root_exponent_at_every_width :
  widths.all (fun w => grover w < reg w)
  ∧ widths.all (fun w => reg w - grover w == (reg w + 1) / 2)
  ∧ (reg 4 - grover 4) < (reg 32 - grover 32) := by decide

end Width
