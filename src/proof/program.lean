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

-- DERIVED FROM THE RENDERING, NOT TYPED. `[48, 49, 50, 51, 64, 65]` is the right answer written the wrong
-- way: those six positions are a consequence of where RFC 9562 puts the version and the variant — the high
-- nibble of byte 6 and the top two bits of byte 8 — and typed as six numerals nothing connects them to it.
-- Every partition theorem below would hold just as well over the WRONG six, and the codec would emit
-- identifiers that are not uuids. The 8-4-4-4-12 group sizes are the one thing stated; everything else is
-- arithmetic on them, on both sides of the kernel (src/0/program.ts derives the same way).
def GROUPS : List Nat := [4, 2, 2, 2, 6]
def byteAt (g : Nat) : Nat := ((GROUPS.take g).foldl (· + ·) 0)

def RESERVED : List Nat :=
  ((List.range 4).map (fun i => byteAt 2 * 8 + i)) ++ ((List.range 2).map (fun i => byteAt 3 * 8 + i))
def checkF   : List Nat := List.range (byteAt 1 * 8)
def middleF  : List Nat := (List.range ((byteAt 4 - byteAt 1) * 8)).map (· + byteAt 1 * 8)
def programF : List Nat := middleF.filter (fun i => !(RESERVED.contains i))
def messageF : List Nat := (List.range ((GROUPS.getD 4 0) * 8)).map (· + byteAt 4 * 8)

-- the derivation lands exactly where the rendering says, or nothing below means what it claims
theorem the_reserved_six_are_where_the_rendering_puts_them :
  RESERVED = [48, 49, 50, 51, 64, 65] ∧ byteAt 2 = 6 ∧ byteAt 3 = 8 ∧ byteAt 4 = 10 := by decide

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

-- ── THE CODEC ITSELF, NOT ONLY WHERE ITS FIELDS SIT ─────────────────────────────────────────────────────
-- Everything above decides the LAYOUT: which of the 128 positions each field owns, that they are disjoint,
-- that they cover the uuid. None of it decides that the codec built on that layout WORKS. That a program
-- and a message read back exactly as written, that the version and variant survive whatever payload is
-- poured around them, and that altering one payload bit moves the check — all three were checked only by
-- scripts/crypto-kat.ts, in TypeScript, on one sample each. A layout is not a codec.
--
-- The construction below is the real one: the real field maps, the real 128 positions, the deposit's own
-- FNV over the payload packed to bytes. What is bounded is the FAMILY of payloads quantified over, and it
-- is stated rather than implied — a handful of patterns, and every single-bit flip of one of them.

/-- where a position falls, and which index of its field it is -/
def rankIn (idx : List Nat) (i : Nat) : Nat := (idx.filter (fun j => j < i)).length

def packByte (bs : List Bool) : Nat := bs.foldl (fun a b => a * 2 + (if b then 1 else 0)) 0

def chunk8 : Nat → List Bool → List (List Bool)
  | 0, _ => []
  | _, [] => []
  | Nat.succ f, l => l.take 8 :: chunk8 f (l.drop 8)

/-- the payload the check covers: program then message, zero-padded to whole bytes -/
def payloadBytes (prog msg : List Bool) : List Nat :=
  (chunk8 16 ((prog ++ msg) ++ List.replicate ((8 - (prog.length + msg.length) % 8) % 8) false)).map packByte

def bitsOf (width n : Nat) : List Bool :=
  (List.range width).map (fun i => (n / (2 ^ (width - 1 - i))) % 2 == 1)

def checkBits (prog msg : List Bool) : List Bool := bitsOf 32 (hash32 0 (payloadBytes prog msg))

/-- the whole 128, every position taken from the field that owns it -/
def encodeBits (prog msg : List Bool) : List Bool :=
  let chk := checkBits prog msg
  (List.range 128).map (fun i =>
    if i == 48 then true else if i == 49 || i == 50 || i == 51 then false
    else if i == 64 then true else if i == 65 then false
    else if checkF.contains i then chk.getD (rankIn checkF i) false
    else if programF.contains i then prog.getD (rankIn programF i) false
    else msg.getD (rankIn messageF i) false)

def readField (idx : List Nat) (bs : List Bool) : List Bool := idx.map (fun i => bs.getD i false)

-- the two sample payloads: a 42-bit program and a 48-bit message, and their alternating twins
def P0 : List Bool := (List.range 42).map (fun i => i % 2 == 0)
def M0 : List Bool := (List.range 48).map (fun i => i % 3 == 0)
def P1 : List Bool := (List.range 42).map (fun i => i % 5 == 0)
def M1 : List Bool := (List.range 48).map (fun i => i % 7 == 0)

set_option maxRecDepth 100000 in
theorem the_fields_read_back_exactly :
  readField programF (encodeBits P0 M0) = P0 ∧ readField messageF (encodeBits P0 M0) = M0
    ∧ readField programF (encodeBits P1 M1) = P1 ∧ readField messageF (encodeBits P1 M1) = M1 := by decide

set_option maxRecDepth 100000 in
theorem the_check_field_carries_the_check :
  readField checkF (encodeBits P0 M0) = checkBits P0 M0 := by decide

-- THE VERSION AND VARIANT SURVIVE WHATEVER IS POURED AROUND THEM. Six bits are not the codec's to spend,
-- and a codec that spent them would emit identifiers that are not uuids — silently, since every other
-- property above would still hold.
-- AND THE FAMILY MUST CONTAIN A PAYLOAD THAT WOULD SHOW THE THEFT. Written first over P0/P1 and M0/M1
-- only, this passed a mutation that DELETED the version bit — because with the clause gone, position 48
-- takes the message's first bit, and in all four of those payloads that bit is `true`, the very value the
-- version puts there. The theorem held by coincidence. An all-false payload is in the family now: if a
-- reserved bit is spent on the payload it reads false, and the theorem sees it.
def PZ : List Bool := List.replicate 42 false
def MZ : List Bool := List.replicate 48 false

set_option maxRecDepth 100000 in
theorem the_reserved_six_survive_any_payload :
  [(P0, M0), (P1, M1), (P0, M1), (P1, M0), (PZ, MZ)].all (fun pm =>
    let b := encodeBits pm.1 pm.2
    (b.getD 48 false == true) && (b.getD 49 false == false) && (b.getD 50 false == false)
      && (b.getD 51 false == false) && (b.getD 64 false == true) && (b.getD 65 false == false)) := by decide

-- ── AND THE CHECK MOVES WHEN THE PAYLOAD DOES ───────────────────────────────────────────────────────────
-- The whole purpose of the first group. scripts/crypto-kat.ts counts this over the 122 free bits of one
-- built identifier and requires all 122; here it is decided over every single-bit flip of the payload
-- itself, which is the 90 bits the check is computed from. A check that missed a flip would leave a
-- damaged identifier reading as intact, which is the one thing a checksum is for.
def flipAt (l : List Bool) (i : Nat) : List Bool :=
  (List.range l.length).map (fun j => if j == i then !(l.getD j false) else l.getD j false)

-- the flip is not vacuous: it lands, at every position
theorem the_flip_reaches_every_payload_position :
  (List.range 42).all (fun i => flipAt P0 i != P0) ∧ (List.range 48).all (fun i => flipAt M0 i != M0) := by decide

set_option maxRecDepth 400000 in
set_option maxHeartbeats 4000000 in
theorem flipping_any_program_bit_moves_the_check :
  (List.range 42).all (fun i => checkBits (flipAt P0 i) M0 != checkBits P0 M0) := by decide

set_option maxRecDepth 400000 in
set_option maxHeartbeats 4000000 in
theorem flipping_any_message_bit_moves_the_check :
  (List.range 48).all (fun i => checkBits P0 (flipAt M0 i) != checkBits P0 M0) := by decide

-- ── THE READER'S SIDE: THE VERDICT, NOT ONLY THE CONSTRUCTION ───────────────────────────────────────────
-- Everything above decides what ENCODE builds. A verifier does not encode; it receives 128 bits it did not
-- make and asks one question — does the check still cover the payload? That verdict is the whole of what
-- the first group is for, and it was decided nowhere: `intact` existed only in TypeScript, and the flip
-- theorems above prove the CHECK moves without ever asking what the reader concludes when it does.
def intact (bs : List Bool) : Bool :=
  readField checkF bs == checkBits (readField programF bs) (readField messageF bs)

def flipBit (bs : List Bool) (i : Nat) : List Bool :=
  (List.range bs.length).map (fun j => if j == i then !(bs.getD j false) else bs.getD j false)

-- the control first, or the refusal below proves nothing: an untouched container must READ intact, over
-- every payload family this file uses, including the all-false one
set_option maxRecDepth 400000 in
set_option maxHeartbeats 4000000 in
theorem an_untouched_container_reads_intact :
  [(P0, M0), (P1, M1), (PZ, MZ)].all (fun pm => intact (encodeBits pm.1 pm.2)) := by decide

-- and one flipped PROGRAM bit, anywhere in the forty-two, is refused by the reader — the check is not
-- recomputed for it, because a damaged container carries the check it was built with
set_option maxRecDepth 400000 in
set_option maxHeartbeats 4000000 in
theorem a_damaged_container_is_refused_at_every_program_position :
  (List.range 42).all (fun i => !(intact (flipBit (encodeBits P0 M0) (programF.getD i 0)))) := by decide

def settledHere : Nat := 21
theorem program_settles_its_range : settledHere = 21 := rfl

end Program
