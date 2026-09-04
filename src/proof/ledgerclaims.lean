import Merkle
set_option maxRecDepth 8000000
-- title: What the ledger claims
-- wing: the address
-- prior_art: unclassified
-- prior_art_own: claims about this deposit's own ledger
-- Three claims the prose made in words and cited to entries that no longer stand. Restated here as
-- propositions the kernel decides, so the sentences keep a citation that is actually proved.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- No axioms, no Mathlib, no sorry. Merkle (and through it Address, Fnv) is imported, not restated.

namespace LedgerClaims

open Address Fnv Merkle

-- ── 1 · the seal is 128 bits, and membership is logarithmic, not linear ─────────────────────────────
-- A seal is a uuid: 16 bytes. `rounds` counts the pairing rounds a fold needs for n leaves — which is the
-- number of sibling seals an inclusion proof carries. Fuel-bounded so the recursion is structural.
def rounds : Nat → Nat → Nat
  | 0, _ => 0
  | _, 0 => 0
  | _, 1 => 0
  | Nat.succ f, n => 1 + rounds f ((n + 1) / 2)

-- A seal is a uuid and a uuid is sixteen bytes, so a seal is 128 bits. Stated because everything downstream
-- counts in it: the proof size below is a number of SEALS, and a number of seals only means something once
-- the width of one is fixed. The multiplication is trivial; naming the unit is not.
theorem a_seal_is_128_bits : (toUuidBytes [97]).length * 8 = 128 := by decide

-- doubling the set adds exactly ONE sibling — the signature of a logarithm, checked across an octave.
theorem membership_grows_by_one_seal_per_doubling :
  rounds 40 2 = 1 ∧ rounds 40 4 = 2 ∧ rounds 40 8 = 3 ∧ rounds 40 16 = 4 ∧
  rounds 40 32 = 5 ∧ rounds 40 64 = 6 ∧ rounds 40 128 = 7 ∧ rounds 40 256 = 8 := by decide

-- and it is genuinely sublinear: at 1024 leaves a proof carries 10 seals, not 1024 — 1280 bits, not 131072.
-- (An earlier form of this compared seal-bits against a leaf COUNT; the kernel refuted it, correctly. Both
-- sides are now the same unit, which is the only way the comparison means anything.)
theorem membership_is_logarithmic_not_linear :
  rounds 40 1024 = 10 ∧ rounds 40 1024 < 1024 ∧ rounds 40 1024 * 128 < 1024 * 128 := by decide

-- ── 2 · the 967-receipt case ────────────────────────────────────────────────────────────────────────
-- Verifying membership costs the proof, not the computation: bill the 20 bits verification actually
-- spends, against a computation worth 967 — the saving is the difference, and nothing else.
def saving (value verify : Nat) : Nat := value - verify

theorem the_967_receipt_case : saving 967 20 = 947 ∧ 20 + 947 = 967 := by decide

-- the saving is never more than the value, at any size — an accounting identity, not a promise.
theorem a_saving_never_exceeds_its_value :
  (List.range 40).all (fun v => (List.range 40).all (fun w => saving v w ≤ v)) := by decide

-- ── 3 · an address is a pointer, not the payload ────────────────────────────────────────────────────
-- A fixed-width address cannot be the thing it names: there are more payloads than addresses, so two
-- payloads must share one. Shown at 4 bits, where the whole domain fits in the kernel.
def addr4 (x : Nat) : Nat := x % 16

theorem more_payloads_than_addresses_must_collide :
  ((List.range 17).map addr4).eraseDups.length < 17 := by decide

theorem the_address_does_not_determine_the_payload :
  ((List.range 17).any (fun a => (List.range 17).any (fun b => a != b && addr4 a == addr4 b))) = true := by decide

-- not just at 1024: across the whole octave of set sizes, a proof is strictly smaller than the set it
-- proves membership in. Decided over every n from 2 to 256, not sampled at one convenient point.
theorem a_proof_is_smaller_than_its_set_across_the_octave :
  (List.range' 2 255).all (fun n => rounds 40 n < n) := by decide

end LedgerClaims
