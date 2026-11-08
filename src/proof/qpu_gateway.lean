-- title: The two gateway bits are constant, so the teleport analogy has no bits to send
-- wing: the ring
-- prior_art: named
-- prior_art_domain: quantum teleportation (Bennett, Brassard, Crépeau, Jozsa, Peres, Wootters, Phys. Rev.
--   Lett. 70, 1895, 1993), which sends two classical bits per teleported qubit and proves fewer than two
--   would permit superluminal signalling, so the two bits are random and must be transmitted; and RFC 9562
--   (2024), which fixes the UUID variant field to the two-bit pattern 10.
-- prior_art_note: NEITHER IS THIS DEPOSIT'S. The teleportation protocol and its two-bit minimum are Bennett
--   et al.'s; the variant field is the RFC's. What is this deposit's is the decision, on qpu's own variant
--   rule read from ~/github/uuidna/qpu/src/quantum/uuid/index.ts at 4ce19dde6 on 2026-11-08, that the two
--   bits qpu calls "gateway" and offers as the carrier of a faster-than-light teleport are CONSTANT across
--   every coin — so they are not the random, transmitted bits the protocol needs, and the analogy's premise
--   fails by computation rather than by prose.
-- prior_art_search: not performed — the protocol and the field are named above and neither is claimed as new.
-- prior_art_pool: bounded
-- prior_art_own: the decision that qpu's gateway bits are a constant of zero entropy, the tautology that
--   follows for its `ftl` flag's gateway check, and the contrast with a free two-bit field and with the four
--   messages teleportation actually sends, each with a control that separates the constant from the free.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- qpu's law `textbook_hexbit_gateway_ftl` reads "hexbit + 2 gateway bits teleport any hexbit faster than
-- light". Its TypeScript `ftl` flag is `gateway === 2 && …`, where `gateway` is the top two bits of the UUID
-- variant nibble. In teleportation those two bits are the heart of the protocol: they are a uniformly random
-- two-bit message, they must be SENT from one party to the other, and sending them is exactly what holds the
-- protocol to the speed of light — Bennett et al. prove that fewer than two bits of channel would let the
-- receiver signal superluminally. So the analogy stands or falls on whether qpu's two bits are that message.
--
-- THEY ARE NOT, AND IT IS DECIDABLE. qpu computes the variant nibble as `(low % 4) + 8` and reads its gateway
-- as that nibble's top two bits. Over every possible low nibble 0..15 the gateway is the single value 2 (the
-- pattern 10), and `uuidFromParts` fixes the nibble to 8 outright. A field that takes one value across every
-- input carries zero bits: there is nothing in it to transmit, and nothing is transmitted. The protocol's two
-- bits range over four values and are the thing that is sent; qpu's range over one and are a format constant.
-- This file decides that gap, with the free two-bit field and the four teleportation messages as the controls
-- that keep "constant" from being mistaken for "two bits".
--
-- No axioms, no Mathlib, no sorry.
set_option maxRecDepth 4000000

namespace QpuGateway

-- qpu's variant nibble, from the low fold nibble `low` (uuid/index.ts: `(parseInt(low.slice(0,1),16) % 4) + 8`).
def variant (low : Nat) : Nat := (low % 4) + 8
-- the two "gateway" bits qpu reads are the top two bits of that nibble: its value divided by four.
def gateway (low : Nat) : Nat := variant low / 4
-- `uuidFromParts` fills the variant slot with the literal nibble 8 (uuid/index.ts, the `…8${…}` middle).
def fromPartsVariant : Nat := 8

-- ── 1 · THE VARIANT NIBBLE IS ALWAYS RFC 9562's 10xx, i.e. 8 THROUGH b ────────────────────────────────────
-- Control: the bound is tight — the nibble reaches 8 and reaches 11, so "8..11" is the exact range, not a
-- loose envelope, and no input escapes it.
theorem the_variant_nibble_is_always_eight_through_eleven :
  (List.range 16).all (fun low => 8 ≤ variant low && variant low ≤ 11)
  ∧ (List.range 16).any (fun low => variant low == 8)
  ∧ (List.range 16).any (fun low => variant low == 11)
  ∧ (List.range 16).all (fun low => variant low != 7 && variant low != 12) := by decide

-- ── 2 · THE TWO GATEWAY BITS ARE ALWAYS THE PATTERN 10 (= 2) ──────────────────────────────────────────────
-- The top two bits of a nibble in 8..11 are 10 in binary, which is 2. Decided over every input.
theorem the_two_gateway_bits_are_always_the_pattern_two :
  (List.range 16).all (fun low => gateway low == 2)
  ∧ (List.range 16).all (fun low => variant low / 4 == 2 && variant low % 4 == low % 4) := by decide

-- ── 3 · REASSEMBLY FIXES THE NIBBLE TO EIGHT, AND ITS GATEWAY IS STILL TWO ────────────────────────────────
-- `uuidFromParts` does not even read the content: the variant is the literal 8, whose gateway bits are 10.
theorem reassembly_fixes_the_variant_to_eight_gateway_still_two :
  fromPartsVariant = 8 ∧ fromPartsVariant / 4 = 2 ∧ fromPartsVariant % 4 = 0
  ∧ gateway (fromPartsVariant % 4) = 2 := by decide

-- ── 4 · SO qpu's `ftl` FLAG'S `gateway === 2` IS A TAUTOLOGY ──────────────────────────────────────────────
-- The flag is true on every coin and false for no input. A check that cannot fail decides nothing about the
-- coin it is attached to. Control: a genuinely discriminating check (variant == 8) is false for most inputs.
theorem the_ftl_gateway_check_is_a_tautology :
  ((List.range 16).filter (fun low => gateway low != 2)).length = 0
  ∧ ((List.range 16).filter (fun low => gateway low == 2)).length = 16
  ∧ ((List.range 16).filter (fun low => variant low == 8)).length = 4 := by decide

-- ── 5 · THE GATEWAY BITS CARRY ZERO ENTROPY: ONE VALUE ACROSS EVERY INPUT ─────────────────────────────────
-- A field that takes exactly one distinct value over all inputs holds log₂ 1 = 0 bits. There is nothing in it
-- to transmit. Control: 2 is actually reached (it is not an empty field), and no other value ever is.
theorem the_gateway_bits_take_one_value_so_carry_zero_entropy :
  (List.range 16).any (fun low => gateway low == 2)
  ∧ (List.range 16).all (fun low => gateway low == 2)
  ∧ (List.range 4).all (fun v => (v == 2) || ((List.range 16).filter (fun low => gateway low == v)).length == 0)
  ∧ 1 = 2 ^ 0 := by decide

-- ── 6 · A FREE TWO-BIT FIELD TAKES ALL FOUR VALUES; THE GATEWAY TAKES ONE ─────────────────────────────────
-- The control the whole file turns on. Model a free two-bit field as `low % 4`: over 0..15 it reaches each of
-- 0,1,2,3, four inputs apiece — two bits of entropy. The gateway, on the same inputs, reaches only 2.
def freeField (low : Nat) : Nat := low % 4
theorem a_free_two_bit_field_takes_four_values_the_gateway_takes_one :
  [0, 1, 2, 3].all (fun v => (List.range 16).any (fun low => freeField low == v))
  ∧ [0, 1, 2, 3].all (fun v => ((List.range 16).filter (fun low => freeField low == v)).length == 4)
  ∧ [0, 1, 3].all (fun v => (List.range 16).all (fun low => gateway low != v))
  ∧ (4 = 2 ^ 2 ∧ 1 = 2 ^ 0) := by decide

-- ── 7 · TELEPORTATION SENDS ONE OF FOUR MESSAGES; THE GATEWAY NEVER VARIES ────────────────────────────────
-- Bennett et al.: the correction is one of four two-bit messages (00,01,10,11), chosen by the Bell measurement
-- and transmitted. qpu's gateway is the single value 2 (the message 10) and is never chosen, never sent.
def teleportMessages : List Nat := [0, 1, 2, 3]
theorem teleportation_sends_one_of_four_the_gateway_is_fixed_to_one :
  teleportMessages.length = 4 ∧ teleportMessages = [0, 1, 2, 3]
  ∧ teleportMessages.contains 2 = true
  ∧ (teleportMessages.filter (fun m => m == 2)).length = 1
  ∧ (List.range 16).all (fun low => gateway low == 2) := by decide

-- ── 8 · THE PREMISE OF THE FTL LAW FAILS: THE CARRIER IT NAMES CARRIES NOTHING ────────────────────────────
-- Gathered: the law needs two transmitted random bits (4 values, entropy 2); qpu offers two constant bits
-- (1 value, entropy 0). The register arithmetic the law also states is true and untouched — 32·4 − 4 − 2 = 122
-- and 1 < 16¹⁰ — so what fails is only the physical reading, exactly where this deposit always draws the line.
theorem the_ftl_premise_fails_the_named_carrier_carries_nothing :
  ((List.range 16).map gateway).all (fun g => g == 2)
  ∧ (teleportMessages.filter (fun m => (List.range 16).all (fun low => gateway low == m))).length = 1
  ∧ (teleportMessages.filter (fun m => (List.range 16).any (fun low => gateway low == m && m != 2))).length = 0
  ∧ 32 * 4 - 4 - 2 = 122 ∧ 1 < 16 ^ 10 := by decide

end QpuGateway
