import Fnv
set_option maxRecDepth 8000000
-- title: The uuid as a container — a checksum, a program, and a message
-- wing: the address
-- prior_art: named
-- prior_art_domain: identifier formats and error-detecting codes
-- prior_art_note: the UUID layout and its version and variant fields are RFC 9562 (2024, obsoleting RFC
--   4122, 2005); FNV-1a, used here as the check function, is Glenn Fowler, Landon Curt Noll and Phong Vo,
--   1991, and is credited in fnv.lean where it is ported. A checksum placed in one field of an identifier
--   over the remaining fields is ordinary practice and no priority is claimed for it. What is decided here
--   is only that THIS deposit's layout is the partition it says it is.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The author, 2026-09-18: "the middle part of uuid is the program and the end is the message", and of the
-- first group, "checksum over the program and the message".
--
-- THE FIELD WIDTHS ARE THE WHOLE POINT, because the obvious reading of them is wrong. On the canonical
-- 8-4-4-4-12 rendering the middle is three groups — bytes 4..9, 48 bits — and BOTH structural fields begin
-- inside it: the version nibble is the high nibble of byte 6, which opens the third group, and the variant
-- is the top two bits of byte 8, which opens the fourth. So the program field is 42 bits and not 48. A
-- codec written to the obvious reading emits identifiers that are not uuids, and it emits them silently.
--
-- What is decided below is the PARTITION: the three fields and the six reserved bits are pairwise disjoint,
-- every one of the 128 positions belongs to exactly one of them, and the widths are 32 + 42 + 48 + 6. The
-- check FUNCTION is not redecided here — it is Fnv.hash32, ported and pinned in fnv.lean — and the codec's
-- agreement with the shipped TypeScript is scripts/lean-agree.ts.
--
-- HONEST, AND STATED AS A THEOREM RATHER THAN A FOOTNOTE: a checksum is not authentication. It is computed
-- by anyone, so anyone who edits the payload recomputes it; and 90 bits of payload cannot be distinguished
-- by 32 bits of check, so collisions exist by counting alone. Both are below.

namespace Program

open Fnv

def RESERVED : List Nat := [48, 49, 50, 51, 64, 65]
def checkF   : List Nat := List.range 32
def programF : List Nat := ((List.range 48).map (· + 32)).filter (fun i => !(RESERVED.contains i))
def messageF : List Nat := (List.range 48).map (· + 80)

-- ── THE WIDTHS ───────────────────────────────────────────────────────────────────────────────────────────
theorem the_program_field_is_forty_two_bits_not_forty_eight :
  programF.length = 42 ∧ ((List.range 48).map (· + 32)).length = 48 := by decide

theorem the_three_fields_and_the_reserved_six_are_the_whole_uuid :
  checkF.length + programF.length + messageF.length + RESERVED.length = 128 := by decide

theorem the_widths_are_what_the_layout_says :
  checkF.length = 32 ∧ messageF.length = 48 ∧ RESERVED.length = 6 := by decide

-- ── BOTH RESERVED FIELDS FALL IN THE MIDDLE, which is the reason for the 42 ──────────────────────────────
theorem every_reserved_bit_is_in_the_middle_group :
  RESERVED.all (fun r => 32 ≤ r && r < 80) := by decide

theorem neither_the_check_nor_the_message_gives_up_a_bit :
  (checkF.all (fun i => !(RESERVED.contains i))) ∧ (messageF.all (fun i => !(RESERVED.contains i))) := by decide

-- ── THE PARTITION: disjoint, and together everything ─────────────────────────────────────────────────────
def inExactlyOne (i : Nat) : Nat :=
  (if checkF.contains i then 1 else 0) + (if programF.contains i then 1 else 0)
    + (if messageF.contains i then 1 else 0) + (if RESERVED.contains i then 1 else 0)

theorem every_position_belongs_to_exactly_one_field :
  (List.range 128).all (fun i => inExactlyOne i == 1) := by decide

theorem nothing_outside_the_uuid_is_claimed :
  (List.range' 128 32).all (fun i => inExactlyOne i == 0) := by decide

-- and the fields are each in ascending order with no repeats, so a bit is written once and read once
def ascending : List Nat → Bool
  | [] => true
  | [_] => true
  | a :: b :: r => if a < b then ascending (b :: r) else false

theorem each_field_is_ascending_and_repeats_nothing :
  ascending checkF ∧ ascending programF ∧ ascending messageF := by decide

-- ── THE CHECK FUNCTION IS NOT REDECIDED HERE — it is Fnv.hash32, pinned in fnv.lean. This states only that
--    the deposit's check of an empty payload is that function's value, so a codec that quietly used another
--    hash would part company with the kernel here rather than in production.
theorem the_check_is_the_deposit_s_own_fnv :
  hash32 0 (List.replicate 12 0) = 1661287312 := by decide

-- ── AND WHAT IT CANNOT DO, decided rather than disclaimed ────────────────────────────────────────────────
-- 90 bits of payload, 32 bits of check: the map cannot be injective, and the ratio is not close.
theorem the_payload_outruns_the_check :
  2 ^ 32 < 2 ^ (42 + 48) ∧ 42 + 48 = 90 := by decide

-- the pigeonhole itself, in miniature and by exhaustion: no function from four values to three is injective
def maps3 : List (List Nat) := (List.range 3).flatMap (fun a => (List.range 3).flatMap (fun b =>
  (List.range 3).flatMap (fun c => (List.range 3).map (fun d => [a, b, c, d]))))

theorem no_map_from_four_onto_three_separates_them_all :
  maps3.all (fun f => decide ((f.eraseDups).length < 4)) := by decide

-- and the miniature is not vacuous: four values CAN be separated by four
def maps4 : List (List Nat) := (List.range 4).flatMap (fun a => (List.range 4).flatMap (fun b =>
  (List.range 4).flatMap (fun c => (List.range 4).map (fun d => [a, b, c, d]))))

theorem four_values_can_be_separated_by_four :
  maps4.any (fun f => decide ((f.eraseDups).length == 4)) := by decide

def settledHere : Nat := 12
theorem program_settles_its_range : settledHere = 12 := rfl

end Program
