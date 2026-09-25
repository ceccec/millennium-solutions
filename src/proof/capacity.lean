set_option maxRecDepth 100000
-- title: The capacity a reserved bit costs, and the birthday bound that follows
-- wing: the address
-- prior_art: named
-- prior_art_domain: the UUID layout and its version and variant fields — RFC 9562 (2024, obsoleting RFC
--   4122, 2005), which fixes 4 bits of version and 2 of variant. The birthday bound: a collision among
--   uniformly drawn values from a space of size 2^n is expected near 2^(n/2) draws.
-- prior_art_note: NEITHER IS THIS DEPOSIT'S. RFC 9562 reserves the six bits and the birthday bound is
--   classical probability, older than computing. What is this deposit's is that the CONSEQUENCE of the
--   reservation is decided here rather than left to prose — the capacity and the collision exponent that
--   follow from a count this tree already seals in imprint.lean.
-- prior_art_search: not performed — both are named above.
-- prior_art_pool: named
-- prior_art_own: the capacity and birthday figures derived from the sealed bit count, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- src/proof/imprint.lean already decides the bit count: `FREE.length = 122 ∧ RESERVED.length = 6 ∧
-- FREE.length + RESERVED.length = 128`. That is sealed and it is honest.
--
-- WHAT WAS NOT DECIDED ANYWHERE IS WHAT FOLLOWS FROM IT. The number a reader actually quotes is not the bit
-- count — it is the CAPACITY (how many addresses) and the COLLISION EXPONENT (how hard a forgery is), and
-- neither had a theorem. src/proof/address.lean states 122 correctly in a COMMENT; the ledger, which is
-- what the MCP server, the site and the trial all consume, carried nothing. A gap where the honest figure
-- should be does not stay empty: prose fills it with the container size, 2^128, because 128 is the number
-- printed on the tin.
--
-- The gap is exactly a factor of 64 — one doubling per reserved bit — and on the birthday bound it is a
-- factor of 8. Those are not rounding. A claim of 2^128 addresses overstates the space by 64×, and 2^64
-- overstates the work a collision search faces by 8×.
--
-- THIS IS A HEAL, NOT A WITHDRAWAL. Nothing above is being taken back: the container really is 128 bits and
-- imprint.lean's count really is 122. What is added is the cross formula between them, so the honest figure
-- and the nominal one sit in one place where they cannot be quoted apart. After this, writing 2^128 as the
-- capacity contradicts a sealed theorem rather than merely disagreeing with a comment.
--
-- No axioms, no Mathlib, no sorry.

namespace Capacity

def container : Nat := 128    -- the bits a UUID occupies
def reserved  : Nat := 6      -- 4 version + 2 variant, RFC 9562
def free      : Nat := container - reserved

-- ── 1 · THE COUNT, AGREEING WITH imprint.lean ─────────────────────────────────────────────────────────────
-- Restated here so this file stands on the same arithmetic rather than on a citation to it.
theorem the_container_is_one_hundred_twenty_eight_and_six_are_spent :
  free = 122 ∧ reserved = 6 ∧ free + reserved = container ∧ container = 128 := by decide

-- ── 2 · SO THE CAPACITY IS TWO TO THE HUNDRED AND TWENTY-SECOND ───────────────────────────────────────────
-- The figure a reader quotes, decided. Both numbers written out, because "2^122" and "2^128" look alike on
-- a page and the difference between them does not.
theorem the_capacity_is_two_to_the_free_bits_and_not_the_container :
  2 ^ free = 5316911983139663491615228241121378304
  ∧ 2 ^ container = 340282366920938463463374607431768211456
  ∧ 2 ^ free < 2 ^ container := by decide

-- ── 3 · AND THE GAP IS ONE DOUBLING PER RESERVED BIT ──────────────────────────────────────────────────────
-- Not an unexplained discrepancy: the ratio is exactly 2^6, which is what six reserved bits cost, so the
-- overstatement has a cause a reader can check rather than a size they must accept.
theorem the_nominal_overstates_the_real_by_two_to_the_reserved :
  2 ^ container / 2 ^ free = 2 ^ reserved
  ∧ 2 ^ reserved = 64
  ∧ 2 ^ container = 64 * 2 ^ free := by decide

-- ── 4 · THE BIRTHDAY BOUND HALVES THE EXPONENT, AND HALVES THE HONEST ONE ─────────────────────────────────
-- A collision is expected near 2^(n/2). Taken on the container that is 2^64; taken on what is actually
-- free it is 2^61 — the number a forgery attempt really faces.
theorem the_collision_exponent_follows_the_free_bits :
  free / 2 = 61 ∧ container / 2 = 64
  ∧ 2 ^ (free / 2) = 2305843009213693952
  ∧ 2 ^ (container / 2) = 18446744073709551616 := by decide

-- ── 5 · AND THAT GAP IS A FACTOR OF EIGHT ─────────────────────────────────────────────────────────────────
-- Half the reservation, because the exponent was halved: three bits, not six.
theorem the_birthday_gap_is_half_the_reservation :
  2 ^ (container / 2) / 2 ^ (free / 2) = 8
  ∧ 8 = 2 ^ (reserved / 2)
  ∧ reserved / 2 = 3 := by decide

-- ── 6 · THE CONTROL: THE GAP MEASURES THE RESERVATION AND NOTHING ELSE ────────────────────────────────────
-- THE THEOREM THAT STOPS 3 AND 5 FROM BEING ARITHMETIC COINCIDENCES. Reserve nothing and the two figures
-- coincide; reserve more and the gap grows by exactly that much. Decided across every reservation in range,
-- so the relation is the rule and not a property of six.
theorem the_gap_is_zero_exactly_when_nothing_is_reserved :
  (List.range 33).all (fun r =>
    (2 ^ 128 / 2 ^ (128 - r) == 2 ^ r) && ((r == 0) == (2 ^ 128 / 2 ^ (128 - r) == 1))) := by decide

-- ── 7 · WHAT A CLAIM OF 2^128 ADDRESSES ACTUALLY ASSERTS ──────────────────────────────────────────────────
-- Stated as the difference itself, so the overstatement is a quantity rather than an adjective: writing the
-- container size as the capacity claims this many addresses that do not exist.
theorem the_overclaim_is_this_many_addresses_that_do_not_exist :
  2 ^ container - 2 ^ free = 334965454937798799971759379190646833152
  ∧ 2 ^ container - 2 ^ free = 63 * 2 ^ free := by decide

-- ── 8 · WHAT THIS FILE DOES NOT SAY ───────────────────────────────────────────────────────────────────────
-- IT SAYS NOTHING ABOUT ANY HASH. The birthday bound above is counting over a space of a stated size; it
-- assumes values are drawn uniformly and it does not test that SHA-256, FNV or anything else produces them
-- that way. A construction whose outputs are not uniform has a WORSE bound than this, never a better one,
-- so the figures here are a ceiling on the difficulty and not a measurement of it. Nor does anything here
-- decide that 2^61 is enough for any purpose — that is a judgement about a threat, and this deposit's rule
-- is that judgements are not typed into theorems.
theorem the_bound_is_a_ceiling_on_difficulty_and_not_a_measurement :
  2 ^ (free / 2) < 2 ^ free
  ∧ 2 ^ (free / 2) < 2 ^ (container / 2)
  ∧ free / 2 < free := by decide

end Capacity
