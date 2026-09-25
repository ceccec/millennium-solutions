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

end Widths
