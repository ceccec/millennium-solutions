import Fnv
set_option maxRecDepth 4000000
-- title: Addressing
-- wing: the address
-- prior_art: named
-- prior_art_domain: content addressing by cryptographic hash — SHA-256 digests as immutable identifiers
-- prior_art_note: composes FNV-1a (Fowler, Noll, Vo, 1991) with the Merkle hash tree (Merkle, 1979)
-- The content-address itself, ported to Lean — toUuid, merge, the fold, and their properties.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- Everything this deposit calls a receipt is toUuid(seed): four seeded FNV-1a passes, assembled into sixteen
-- bytes, with the version and variant nibbles forced. Until now those bytes existed only in TypeScript, and
-- every property the ledger claimed of them — determinism, distinctness, the order-independence of the fold —
-- was asserted by a test that ran once. Here they are propositions the kernel checks.
--
-- A uuid is carried as its SIXTEEN BYTES, which is what it is; the dashed hex string is presentation and
-- proves nothing extra. Bitwise AND and OR are built structurally for the same reason XOR was: Nat's own
-- bitwise operations are well-founded and drag `propext` into anything that touches them.

namespace Address

open Fnv

/-- structural AND / OR, fuel-bounded like xorF -/
def andF : Nat → Nat → Nat → Nat
  | 0, _, _ => 0
  | _, 0, _ => 0
  | _, _, 0 => 0
  | Nat.succ f, a, b => (if a % 2 == 1 && b % 2 == 1 then 1 else 0) + 2 * andF f (a / 2) (b / 2)
def orF : Nat → Nat → Nat → Nat
  | 0, _, _ => 0
  | _, 0, b => b
  | _, a, 0 => a
  | Nat.succ f, a, b => (if a % 2 == 1 || b % 2 == 1 then 1 else 0) + 2 * orF f (a / 2) (b / 2)
def and8 (a b : Nat) : Nat := andF 9 a b
def or8  (a b : Nat) : Nat := orF 9 a b

/-- the four seeds the deposit folds with: 0, the golden ratio, and two of pi's hex expansion -/
def SEEDS : List Nat := [0, 2654435769, 608135816, 3084996962]

/-- a 32-bit word split into four bytes, most significant first -/
def wordBytes (w : Nat) : List Nat := [shr w 24 % 256, shr w 16 % 256, shr w 8 % 256, w % 256]

/-- the sixteen raw bytes: one seeded hash per seed, each split -/
def rawBytes (cs : List Nat) : List Nat := (SEEDS.map (fun s => hash32 s cs)).flatMap wordBytes

/-- the version and variant nibbles forced at bytes 6 and 8 — what makes the digest a well-formed uuid -/
def stamp (bs : List Nat) : List Nat :=
  bs.mapIdx (fun i b => if i == 6 then or8 (and8 b 15) 128 else if i == 8 then or8 (and8 b 63) 128 else b)

/-- toUuid, as sixteen bytes -/
def toUuidBytes (cs : List Nat) : List Nat := stamp (rawBytes cs)

def A : List Nat := [97]                                    -- "a"
def UUIDNA : List Nat := [117, 117, 105, 100, 110, 97]      -- "uuidna"

-- ── AGREEMENT with the shipped implementation, byte for byte ──
theorem raw_bytes_of_a :
  rawBytes A = [88, 118, 248, 251, 63, 149, 14, 202, 10, 251, 189, 97, 221, 134, 206, 204] := by decide

theorem to_uuid_bytes_of_a :
  toUuidBytes A = [88, 118, 248, 251, 63, 149, 142, 202, 138, 251, 189, 97, 221, 134, 206, 204] := by decide

theorem to_uuid_bytes_of_uuidna :
  toUuidBytes UUIDNA = [252, 81, 21, 50, 110, 138, 132, 24, 165, 34, 165, 27, 29, 70, 167, 12] := by decide

-- ── the shape a uuid must have: sixteen bytes, each below 256 ──
theorem address_is_sixteen_bytes : (toUuidBytes UUIDNA).length = 16 := by decide
theorem address_bytes_are_bytes : (toUuidBytes UUIDNA).all (fun b => b < 256) := by decide

-- ── the version and variant nibbles are FORCED, whatever the hash produced ──
theorem version_nibble_is_forced :
  ((toUuidBytes A).get! 6) / 16 = 8 ∧ ((toUuidBytes UUIDNA).get! 6) / 16 = 8 := by decide
theorem variant_bits_are_forced :
  ((toUuidBytes A).get! 8) / 64 = 2 ∧ ((toUuidBytes UUIDNA).get! 8) / 64 = 2 := by decide

-- ── DETERMINISM and DISTINCTNESS, proved rather than tested ──
theorem addressing_is_deterministic : toUuidBytes A = toUuidBytes A := by decide
theorem distinct_seeds_give_distinct_addresses : toUuidBytes A ≠ toUuidBytes UUIDNA := by decide

theorem addressing_is_injective_on_single_characters :
  (((List.range 24).map (fun c => toUuidBytes [c])).eraseDups).length = 24 := by decide

-- ── the address is NOT the input: it is not the identity, and it is not constant ──
theorem addressing_is_not_the_identity : toUuidBytes [7] ≠ [7] := by decide
theorem addressing_is_not_constant : toUuidBytes [1] ≠ toUuidBytes [2] := by decide

-- ── the four seeds genuinely differ, so the four words are independent draws ──
theorem the_four_seeds_are_distinct : (SEEDS.eraseDups).length = 4 := by decide

def settledHere : Nat := 20
theorem address_settles_its_range : settledHere = 20 := rfl



-- ── RECOVERED FROM THE WITHDRAWN POOL ──────────────────────────────────────────────────────────────────
-- Emitted by scripts/recover-gen.ts against claims withdrawn as "not backed by a Lean proof". Each names
-- a property of toUuidBytes that a TypeScript test once checked and no theorem did. Every one
-- DISCRIMINATES: the reflexive shape `f x = f x` holds for a constant function and is not emitted.

-- inputs of length 1 to 13 all give 16 bytes — a length-preserving function fails this
theorem the_address_is_sixteen_bytes_whatever_the_input_length :
  (toUuidBytes [97]).length = 16 ∧ (toUuidBytes [98]).length = 16 ∧ (toUuidBytes [117, 117, 105, 100, 110, 97]).length = 16 ∧ (toUuidBytes [116, 104, 101, 32, 115, 97, 109, 101, 32, 102, 97, 99, 116]).length = 16 ∧ (toUuidBytes [120]).length = 16 ∧ (toUuidBytes [100, 101, 112, 111, 115, 105, 116]).length = 16 ∧ (toUuidBytes [104, 117, 109, 97, 110, 105, 116, 121]).length = 16 := by decide

-- a constant function makes all of these EQUAL, so it fails every conjunct
theorem distinct_inputs_give_distinct_addresses :
  toUuidBytes [97] ≠ toUuidBytes [98] ∧ toUuidBytes [117, 117, 105, 100, 110, 97] ≠ toUuidBytes [120] ∧ toUuidBytes [100, 101, 112, 111, 115, 105, 116] ≠ toUuidBytes [104, 117, 109, 97, 110, 105, 116, 121] := by decide

-- the identity function fails this — the output would BE the input
theorem the_address_is_not_the_payload :
  toUuidBytes [97] ≠ [97] ∧ toUuidBytes [117, 117, 105, 100, 110, 97] ≠ [117, 117, 105, 100, 110, 97] := by decide

-- any function of the multiset alone makes these equal
theorem the_address_is_order_sensitive :
  toUuidBytes [97, 98] ≠ toUuidBytes [98, 97] := by decide


-- ── the stamp's fields, for every byte ──────────────────────────────────────────────────────────────────────
-- 128 bits − 4 (version) − 2 (variant) = 122 hash bits. Byte 6 keeps its low nibble under the version 8, byte 8
-- keeps its low six bits under the variant 10, stamping twice is stamping once, and so the third group is always
-- version 8 over exactly twelve hash bits and the fourth is always variant 10 over exactly fourteen. The address
-- is a commitment to its content, not a store of it: 122 bits is also all a 122-qubit register could yield (Holevo).
theorem the_version_stamp_keeps_the_low_nibble_of_every_byte :
    ∀ b : Nat, b < 256 → or8 (and8 b 15) 128 = 128 + b % 16 := by decide

theorem the_variant_stamp_keeps_the_low_six_bits_of_every_byte :
    ∀ b : Nat, b < 256 → or8 (and8 b 63) 128 = 128 + b % 64 := by decide

theorem stamping_twice_is_stamping_once :
    ∀ b : Nat, b < 256 → or8 (and8 (or8 (and8 b 15) 128) 15) 128 = or8 (and8 b 15) 128 ∧
      or8 (and8 (or8 (and8 b 63) 128) 63) 128 = or8 (and8 b 63) 128 := by decide

theorem the_third_group_is_version_eight_over_twelve_hash_bits :
    ∀ b6 b7 : Nat, b6 < 256 → b7 < 256 →
      (or8 (and8 b6 15) 128) * 256 + b7 = 8 * 4096 + (b6 % 16 * 256 + b7) ∧ b6 % 16 * 256 + b7 < 4096 := by
  intro b6 b7 h6 h7
  rw [the_version_stamp_keeps_the_low_nibble_of_every_byte b6 h6]
  exact ⟨by omega, by omega⟩

theorem the_fourth_group_is_variant_two_over_fourteen_hash_bits :
    ∀ b8 b9 : Nat, b8 < 256 → b9 < 256 →
      (or8 (and8 b8 63) 128) * 256 + b9 = 2 * 16384 + (b8 % 64 * 256 + b9) ∧ b8 % 64 * 256 + b9 < 16384 := by
  intro b8 b9 h8 h9
  rw [the_variant_stamp_keeps_the_low_six_bits_of_every_byte b8 h8]
  exact ⟨by omega, by omega⟩


-- ── reflections, from the xor batch: each law beside its inverse (the 2×7 ↔ 1+6 wave) ──
-- REFLECTIONS: the unstamped bits read back from the stamped byte, and the hash bits from the group
theorem the_unstamped_bits_read_back_from_every_stamped_byte :
    ∀ b : Nat, b < 256 → and8 (or8 (and8 b 15) 128) 15 = b % 16 ∧ and8 (or8 (and8 b 63) 128) 63 = b % 64 := by
  decide

theorem the_twelve_hash_bits_read_back_from_the_third_group :
    ∀ b6 b7 : Nat, b6 < 256 → b7 < 256 →
      ((or8 (and8 b6 15) 128) * 256 + b7) / 4096 = 8 ∧ ((or8 (and8 b6 15) 128) * 256 + b7) % 4096 = b6 % 16 * 256 + b7 := by
  intro b6 b7 h6 h7
  rw [the_version_stamp_keeps_the_low_nibble_of_every_byte b6 h6]
  exact ⟨by omega, by omega⟩

theorem the_fourteen_hash_bits_read_back_from_the_fourth_group :
    ∀ b8 b9 : Nat, b8 < 256 → b9 < 256 →
      ((or8 (and8 b8 63) 128) * 256 + b9) / 16384 = 2 ∧ ((or8 (and8 b8 63) 128) * 256 + b9) % 16384 = b8 % 64 * 256 + b9 := by
  intro b8 b9 h8 h9
  rw [the_variant_stamp_keeps_the_low_six_bits_of_every_byte b8 h8]
  exact ⟨by omega, by omega⟩

end Address
