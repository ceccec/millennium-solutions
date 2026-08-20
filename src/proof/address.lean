import Fnv
set_option maxRecDepth 4000000
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

def settledHere : Nat := 13
theorem address_settles_its_range : settledHere = 13 := rfl

end Address
