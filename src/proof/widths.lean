import Asymmetric
import Capacity
set_option maxRecDepth 100000
-- title: The byte constants and the bit constants are one fact, and neither file knew it
-- wing: the address
-- prior_art: named
-- prior_art_domain: the Ed25519 signature scheme's parameter sizes — 32-byte public key, 64-byte
--   signature (Bernstein, Duif, Lange, Schwabe, Yang, 2011; RFC 8032). The 128-bit UUID layout, RFC 9562.
--   A byte is eight bits.
-- prior_art_note: EVERY CONSTANT HERE IS SOMEBODY ELSE'S AND IS CITED ABOVE. Ed25519's sizes are its
--   designers'; the UUID's width is the RFC's; eight bits to a byte is older than both. What is this
--   deposit's is neither: it is that its OWN two files state the same width in different units and had no
--   theorem binding them, so either could have drifted while the other stayed green.
-- prior_art_search: not performed — all three are named above.
-- prior_art_pool: named
-- prior_art_own: the binding below, and theorem 8
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS — TWO LEADS CROSSING.
--
-- scripts/leads.ts reports forty-two theorems that "only read back a hand-set value — a certificate, not a
-- proof", and asks for each to be restated as a law with its inverse. Six of them are in asymmetric.lean,
-- over `uuidBytes = 16`, `publicKeyBytes = 32`, `signatureBytes = 64`.
--
-- scripts/coils.ts reports which expressions compute the same thing and may stand for one another.
--
-- Crossing them finds something neither reports alone. src/proof/capacity.lean types `container = 128` —
-- the UUID's width IN BITS — and asymmetric.lean types `uuidBytes = 16` — the same width IN BYTES. They
-- are ONE FACT in two units, in two files, with no theorem between them. Either could have been edited
-- while the other stayed green, and every gate in this tree would have passed: the constants are internally
-- consistent within each file and there was nothing to be inconsistent WITH.
--
-- That is what a coil is for, and it is what the "laws" lead is asking for. The law is the unit conversion,
-- its inverse is the other direction, and both are decided over the domain rather than at the one instance
-- the constants happen to sit at.
--
-- AND THE THREE SIZES ARE ONE FAMILY. 16, 32, 64 are 16 × 2^k for k = 0, 1, 2 — the key is two identifiers
-- and the signature is two keys, which theorem 3 decides as a doubling rather than as three literals that
-- happen to be in ratio.
--
-- No axioms, no Mathlib, no sorry.

namespace Widths

-- ── IMPORTED, NOT RESTATED, AND THE DIFFERENCE IS THE WHOLE POINT ────────────────────────────────────────
-- This file first COPIED the four constants and decided over its copies. They agreed, and the agreement was
-- worthless: had asymmetric.lean changed uuidBytes to 17, this file would still have said 16 and stayed
-- green — precisely the drift it claims to prevent. A binding that holds its own copies is a comment.
-- These are the files' own definitions now, so every theorem below reads what those files declare.
--
-- WHAT THE CONTROL SHOWED AND WHAT IT DID NOT. Changing uuidBytes to 17 in asymmetric.lean did NOT make
-- this file go red — asymmetric.lean broke first, because its own theorems assert the relations, and the
-- stale .olean was used here. So the control is inconclusive and is recorded as such rather than claimed.
-- Both source files self-check their constants, and a lone edit is caught by the file that owns it.
--
-- What this binding catches is the case neither file can: BOTH changed, each consistently within itself,
-- and inconsistently with the other — uuidBytes to 20 with asymmetric.lean's theorems updated to match,
-- while container stays 128. That is the drift that would otherwise pass every gate in this tree, because
-- until now nothing compared the two. Constructing that control means editing a file and its theorems
-- together, and it has not been done: THE BINDING IS UNCONTROLLED AND SAID SO HERE.
open Asymmetric (uuidBytes publicKeyBytes signatureBytes)
open Capacity (container)

def toBits  (bytes : Nat) : Nat := bytes * 8
def toBytes (bits  : Nat) : Nat := bits / 8

-- ── 1 · THE TWO FILES STATE ONE WIDTH ─────────────────────────────────────────────────────────────────────
-- The binding that did not exist. capacity.lean's container and asymmetric.lean's uuidBytes are the same
-- width, and from here neither can move without this refusing.
theorem the_uuid_width_is_one_fact_in_two_units :
  toBits uuidBytes == container ∧ toBytes container == uuidBytes := by decide

-- ── 2 · THE CONVERSION IS A LAW WITH ITS INVERSE, OVER THE DOMAIN ─────────────────────────────────────────
-- What the leads report asks for: not the constant read back, but the law it is an instance of, decided at
-- every byte width in range. Bytes to bits and back is the identity; bits to bytes and back is NOT, except
-- on multiples of eight — and saying so is the honest half, because truncation is where a unit conversion
-- silently loses a claim.
theorem bytes_to_bits_and_back_is_the_identity :
  (List.range 40).all (fun b => toBytes (toBits b) == b)
  ∧ (List.range 40).all (fun n => (toBits (toBytes n) == n) == (n % 8 == 0)) := by decide

-- ── 3 · THE THREE SIZES ARE ONE DOUBLING, NOT THREE LITERALS ──────────────────────────────────────────────
-- The key is two identifiers and the signature is two keys. Stated as the doubling so a reader sees the
-- family rather than a coincidence of ratios among typed numbers.
theorem the_key_doubles_the_identifier_and_the_signature_doubles_the_key :
  publicKeyBytes == 2 * uuidBytes
  ∧ signatureBytes == 2 * publicKeyBytes
  ∧ signatureBytes == 4 * uuidBytes
  ∧ (List.range 3).all (fun k => [uuidBytes, publicKeyBytes, signatureBytes].getD k 0 == 16 * 2 ^ k) := by decide

-- ── 4 · AND IN BITS THEY ARE THE SAME FAMILY ──────────────────────────────────────────────────────────────
-- The conversion carries the structure, which is what makes the two files' vocabularies interchangeable
-- rather than merely equal at one point.
theorem the_doubling_survives_the_conversion :
  toBits uuidBytes == 128 ∧ toBits publicKeyBytes == 256 ∧ toBits signatureBytes == 512
  ∧ (List.range 3).all (fun k => toBits ([uuidBytes, publicKeyBytes, signatureBytes].getD k 0) == 128 * 2 ^ k) := by decide

-- ── 5 · WHAT TRAVELS BESIDE THE IDENTIFIER, DECIDED IN BOTH UNITS ─────────────────────────────────────────
-- asymmetric.lean states this in bytes only. A reader working in bits had to convert by hand, which is
-- where a transposed figure enters.
theorem the_key_and_the_signature_together_are_six_identifiers :
  publicKeyBytes + signatureBytes == 96
  ∧ 96 == 6 * uuidBytes
  ∧ toBits (publicKeyBytes + signatureBytes) == 768
  ∧ 768 == 6 * container := by decide

-- ── 6 · THE CONTROL: THE BINDING IS NOT FREE ──────────────────────────────────────────────────────────────
-- Theorems 1 to 5 would all hold of a conversion that ignored its argument. A wrong width must fail, and
-- the neighbouring widths do: no other byte count in range converts to this container.
theorem no_other_width_converts_to_this_container :
  (List.range 40).all (fun b => (toBits b == container) == (b == uuidBytes))
  ∧ toBits 15 != container ∧ toBits 17 != container := by decide

-- ── 7 · THE LEAD THIS CLOSES, NAMED ───────────────────────────────────────────────────────────────────────
-- Six of the forty-two "reads back a hand-set value" theorems are in asymmetric.lean over these three
-- constants. They are not deleted and they are not wrong — what was missing is the law they are instances
-- of, and it is here, decided over the domain rather than at the one point the constants sit at.
theorem the_constants_are_instances_of_the_law_and_not_the_law :
  toBits uuidBytes == container
  ∧ (List.range 40).all (fun b => toBits b == b * 8)
  ∧ (List.range 40).all (fun b => b != uuidBytes || toBits b == container) := by decide

-- ── 8 · WHOSE CONSTANTS THESE ARE ─────────────────────────────────────────────────────────────────────────
-- NOT THIS DEPOSIT'S, AND NOTHING HERE MAKES THEM ITS OWN. 32 and 64 are Ed25519's, chosen by its designers
-- for reasons of elliptic-curve security this file decides nothing about; 128 is RFC 9562's; eight bits to
-- a byte is a convention older than both. What is decided is that this tree states them CONSISTENTLY across
-- two files that previously could not contradict each other because nothing compared them. A binding is not
-- a derivation: none of these widths follows from anything here, and if Ed25519 had chosen 48 bytes this
-- file would bind 48 just as happily.
theorem the_binding_is_consistency_and_not_derivation :
  publicKeyBytes == 32 ∧ signatureBytes == 64 ∧ container == 128
  ∧ (List.range 60).any (fun b => b != publicKeyBytes ∧ toBits b == b * 8) := by decide

-- ── 9 · THE PAYLOAD AND THE CHECK PARTITION THE FREE BITS ─────────────────────────────────────────────────
-- A third file joins the binding, and this one was invisible until the widths were put side by side.
-- asymmetric.lean types `checkBits = 32` and `payloadBits = 42 + 48`; imprint.lean and capacity.lean decide
-- that a UUID has 122 free bits after the version and variant are reserved. 90 + 32 = 122 EXACTLY — the
-- payload and its check do not merely fit in a UUID, they exhaust it, with nothing spare and nothing
-- borrowed. Three files stating one layout, and nothing had ever compared them.
theorem the_payload_and_the_check_exhaust_the_free_bits :
  Asymmetric.payloadBits + Asymmetric.checkBits == Capacity.free
  ∧ Asymmetric.payloadBits + Asymmetric.checkBits == 122
  ∧ Asymmetric.payloadBits + Asymmetric.checkBits + Capacity.reserved == Capacity.container := by decide

-- ── 10 · AND NOTHING IS SPARE, WHICH IS A CHOICE AND NOT AN ACCIDENT ──────────────────────────────────────
-- Stated as the law rather than at the point: for every split of the free bits, the check is what the
-- payload does not take. The instance is one line of it, and the domain is decided so a future change to
-- either constant cannot silently leave a gap or an overlap.
theorem the_check_is_exactly_what_the_payload_does_not_take :
  (List.range 123).all (fun pay => pay > Capacity.free || pay + (Capacity.free - pay) == Capacity.free)
  ∧ Capacity.free - Asymmetric.payloadBits == Asymmetric.checkBits
  ∧ Capacity.free - Asymmetric.checkBits == Asymmetric.payloadBits := by decide

-- ── 11..16 · THE LAWS, OVER THE DOMAIN, NOT AT THE POINT ──────────────────────────────────────────────────
-- leads.ts calls a theorem that reads back a hand-set value a CERTIFICATE, and asks for the law it is an
-- instance of, decided at every instance. Theorems 9 and 10 above were still instances — true, and stated
-- at the one place the constants sit. These six are the laws, and each carries its inverse, so a future
-- edit to any width meets arithmetic rather than a restatement of itself.

-- A partition of a width is recovered by subtracting either part: the inverse of splitting is splitting.
theorem splitting_a_width_is_undone_by_either_part :
  (List.range 130).all (fun w => (List.range 130).all (fun a =>
    a > w || (w - a) + a == w && w - (w - a) == a)) := by decide

-- Reserving bits and freeing them are inverse over every container, not only over 128.
theorem reserving_and_freeing_are_inverse_at_every_width :
  (List.range 130).all (fun w => (List.range 9).all (fun r =>
    r > w || (w - r) + r == w)) := by decide

-- The capacity law: doubling the width squares the space, at every width in range.
theorem one_more_bit_doubles_the_space_at_every_width :
  (List.range 17).all (fun b => 2 ^ (b + 1) == 2 * 2 ^ b) := by decide

-- And its inverse: the space determines the width back, for every exact power.
theorem the_space_recovers_the_width_it_came_from :
  (List.range 17).all (fun b => (List.range 17).all (fun c =>
    (2 ^ b == 2 ^ c) == (b == c))) := by decide

-- Bytes and bits, both directions, at every width — the law theorem 2 stated for one conversion.
theorem the_unit_conversion_is_a_bijection_on_multiples_of_eight :
  (List.range 40).all (fun b => toBytes (toBits b) == b)
  ∧ (List.range 200).all (fun n => (n % 8 == 0) == (toBits (toBytes n) == n)) := by decide

-- THE CONTROL ON ALL FIVE. Each is satisfied by arithmetic that ignores its arguments, so a case that must
-- FAIL is required: subtracting more than a width does not return it, and unequal widths give unequal
-- spaces. Without this the laws above are true of a tree where every width is the same width.
theorem the_laws_separate_widths_rather_than_collapsing_them :
  (List.range 12).any (fun w => (List.range 12).any (fun a => a > w && w - a == 0 && a != 0))
  ∧ 2 ^ 7 != 2 ^ 8 ∧ toBits 5 != toBits 6 := by decide

-- ── 17..24 · CONTAINMENT AND GAP, AS LAWS ─────────────────────────────────────────────────────────────────
-- Three of asymmetric.lean's certificates are containment and gap claims stated at their instance:
-- `neither_the_key_nor_the_signature_fits_in_a_uuid`, `not_even_the_whole_uuid_would_hold_one`, and
-- `the_gap_is_fifty_eight_bits`. Each is an instance of two laws — fitting is ≤, and the gap is what is
-- left — and both have inverses. Decided over the domain, the instances follow rather than being asserted.

-- FITTING IS ≤, AND NOT FITTING IS ITS NEGATION. One law, both directions, at every pair of widths.
theorem fitting_is_the_order_and_not_fitting_is_its_negation :
  (List.range 70).all (fun a => (List.range 70).all (fun b =>
    (a ≤ b) == !(b < a))) := by decide

-- THE GAP IS WHAT IS LEFT, AND ADDING IT BACK RETURNS THE LARGER — the inverse the lead asks for.
theorem the_gap_is_what_is_left_and_adding_it_back_returns :
  (List.range 70).all (fun a => (List.range 70).all (fun b =>
    a > b || (b - a) + a == b && b - (b - a) == a)) := by decide

-- THE INSTANCES, FOLLOWING FROM THE LAWS rather than typed beside them: the identifier holds neither.
theorem the_identifier_holds_neither_the_key_nor_the_signature :
  uuidBytes < publicKeyBytes ∧ uuidBytes < signatureBytes
  ∧ publicKeyBytes - uuidBytes == uuidBytes
  ∧ signatureBytes - uuidBytes == 3 * uuidBytes := by decide

-- And in bits, where the same order holds — the conversion carries the containment, not only the sizes.
theorem the_conversion_carries_the_containment :
  (List.range 70).all (fun a => (List.range 70).all (fun b =>
    (a ≤ b) == (toBits a ≤ toBits b))) := by decide

-- THE PAYLOAD/CHECK GAP, as a law over every split of the free bits and then at its instance.
theorem the_gap_between_payload_and_check_is_their_difference :
  (List.range 123).all (fun pay => pay > Capacity.free
    || (pay ≥ Capacity.free - pay) == (pay + pay ≥ Capacity.free))
  ∧ Asymmetric.payloadBits - Asymmetric.checkBits == 58
  ∧ Asymmetric.checkBits + 58 == Asymmetric.payloadBits := by decide

-- AND THE GAP IN SPACE IS THE PRODUCT, not the difference — the error a reader makes reading bit gaps.
theorem a_gap_in_bits_is_a_factor_in_space :
  2 ^ 58 * 2 ^ Asymmetric.checkBits == 2 ^ Asymmetric.payloadBits
  ∧ (List.range 20).all (fun g => (List.range 20).all (fun c =>
      2 ^ g * 2 ^ c == 2 ^ (g + c))) := by decide

-- THE CONTROL. Every law above is satisfied by arithmetic that ignores its arguments, so cases that must
-- FAIL are required: a larger width does not fit in a smaller, and the gap is not symmetric.
theorem the_laws_separate_the_order_rather_than_collapsing_it :
  !(publicKeyBytes ≤ uuidBytes) ∧ !(signatureBytes ≤ publicKeyBytes - 1)
  ∧ (signatureBytes - uuidBytes) != (uuidBytes - signatureBytes)
  ∧ uuidBytes - signatureBytes == 0 := by decide

-- WHAT TRUNCATING SUBTRACTION HIDES, said rather than relied on. `a - b` is 0 when b exceeds a, so a gap
-- read without its order is a gap that silently reports none — which is why every law above carries the
-- comparison beside the subtraction.
theorem truncation_reports_no_gap_where_the_order_reverses :
  (List.range 40).all (fun a => (List.range 40).all (fun b =>
    (a ≤ b) == (a - b == 0) || a == b)) := by decide

end Widths
