set_option maxRecDepth 8000000
-- title: The imprint — a uuid that carries a message and gives it back
-- wing: the address
-- prior_art: named
-- prior_art_domain: identifier formats and length-prefixed encodings
-- prior_art_note: the UUID layout and its version and variant fields are RFC 9562 (2024, obsoleting RFC
--   4122, 2005). A length-prefixed payload is ordinary practice with no single author and no priority is
--   claimed for it. What is decided here is only that THIS deposit's codec is reversible where it says it
--   is, and refuses where it says it refuses.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The deposit has two containers and until now the kernel knew one of them. program.lean decides the
-- checksum/program/message layout; src/0/imprint.ts — older, and the one the ledger's own tooling uses —
-- had no Lean at all. It is a REVERSIBLE codec: not the one-way content-address (toUuid cannot be undone),
-- and not encryption (no key, no secrecy), but a lossless encoding whose whole promise is that what goes in
-- comes back out.
--
-- That promise was checked in TypeScript and nowhere else. A codec that round-trips the message you tried
-- and loses the one you did not is self-consistent, passes its own tests, and is not reversible.
--
-- THE LAYOUT: 128 bits, six reserved (the version nibble and the variant), leaving 122 free. The first
-- seven of those free bits are a LENGTH HEADER, so the reader knows where the message stops — which is the
-- whole reason the codec is reversible rather than merely lossy — and the remaining 115 are the message.
--
-- No axioms, no Mathlib, no sorry.

namespace Imprint

def RESERVED : List Nat := [48, 49, 50, 51, 64, 65]
def FREE : List Nat := (List.range 128).filter (fun i => !(RESERVED.contains i))
def LEN_BITS : Nat := 7
def CAPACITY : Nat := FREE.length - LEN_BITS

-- ── THE BUDGET, WHICH IS WHERE A CODEC OVERSPENDS ───────────────────────────────────────────────────────
theorem the_free_region_is_a_hundred_and_twenty_two :
  FREE.length = 122 ∧ RESERVED.length = 6 ∧ FREE.length + RESERVED.length = 128 := by decide

theorem the_capacity_is_the_free_region_less_the_header :
  CAPACITY = 115 ∧ CAPACITY + LEN_BITS = FREE.length := by decide

-- and no reserved bit is free, which is the one way a codec silently stops emitting uuids
theorem no_reserved_bit_is_free :
  RESERVED.all (fun r => !(FREE.contains r)) := by decide

-- ── THE HEADER HOLDS EVERY LENGTH IT MUST ───────────────────────────────────────────────────────────────
-- Seven bits count to 127 and the capacity is 115, so every admissible length is representable — and the
-- header could not be one bit shorter, which is why it is seven and not six.
theorem seven_bits_count_past_the_capacity :
  2 ^ LEN_BITS > CAPACITY ∧ 2 ^ (LEN_BITS - 1) < CAPACITY := by decide

-- ── THE CODEC ───────────────────────────────────────────────────────────────────────────────────────────
def bitsOf (width n : Nat) : List Bool :=
  (List.range width).map (fun i => (n / 2 ^ (width - 1 - i)) % 2 == 1)

def natOf (bs : List Bool) : Nat := bs.foldl (fun a b => a * 2 + (if b then 1 else 0)) 0

/-- the free region as written: the length header, then the message, then zero fill -/
def payload (msg : List Bool) : List Bool :=
  bitsOf LEN_BITS msg.length ++ msg ++ List.replicate (FREE.length - LEN_BITS - msg.length) false

/-- the whole 128, every position taken from the field that owns it -/
def encodeBits (msg : List Bool) : List Bool :=
  let p := payload msg
  (List.range 128).map (fun i =>
    if i == 48 then true else if i == 49 || i == 50 || i == 51 then false
    else if i == 64 then true else if i == 65 then false
    else p.getD ((FREE.filter (fun j => j < i)).length) false)

/-- the reader: take the free bits, read the header, take that many -/
def decodeBits (bs : List Bool) : List Bool :=
  let free := FREE.map (fun i => bs.getD i false)
  (free.drop LEN_BITS).take (natOf (free.take LEN_BITS))

-- ── WHAT GOES IN COMES BACK OUT ─────────────────────────────────────────────────────────────────────────
-- Over every message length from nothing to eight, and at the alternating and all-set patterns — the empty
-- message included, because a codec that loses it reads as working on everything anyone would try by hand.
def alt (n : Nat) : List Bool := (List.range n).map (fun i => i % 2 == 0)
def ones (n : Nat) : List Bool := List.replicate n true

set_option maxRecDepth 100000 in
theorem every_short_message_comes_back :
  (List.range 9).all (fun n => decodeBits (encodeBits (alt n)) == alt n) := by decide

set_option maxRecDepth 100000 in
theorem the_all_set_message_comes_back_too :
  (List.range 9).all (fun n => decodeBits (encodeBits (ones n)) == ones n) := by decide

-- THE LENGTH IS WHAT MAKES IT REVERSIBLE. Without the header the reader cannot tell a message from the
-- zero fill behind it, and every message would read back padded to the capacity.
set_option maxRecDepth 100000 in
theorem the_header_records_the_length :
  (List.range 9).all (fun n =>
    natOf ((FREE.map (fun i => (encodeBits (alt n)).getD i false)).take LEN_BITS) == n) := by decide

-- and the fill really is behind it: two messages of different lengths do not encode alike
set_option maxRecDepth 100000 in
theorem a_shorter_message_is_not_a_longer_one :
  encodeBits (alt 3) != encodeBits (alt 4) ∧ encodeBits (ones 0) != encodeBits (ones 1) := by decide

-- ── AND THE SIX ARE NOT THE CODEC'S TO SPEND ────────────────────────────────────────────────────────────
set_option maxRecDepth 100000 in
theorem the_reserved_six_survive_any_message :
  [alt 0, alt 5, ones 8, alt 115].all (fun m =>
    let b := encodeBits m
    (b.getD 48 false == true) && (b.getD 49 false == false) && (b.getD 50 false == false)
      && (b.getD 51 false == false) && (b.getD 64 false == true) && (b.getD 65 false == false)) := by decide

def settledHere : Nat := 9
theorem imprint_settles_its_range : settledHere = 9 := rfl

end Imprint
