set_option maxRecDepth 8000000
-- title: What a signature is for, and where it cannot go
-- wing: the address
-- prior_art: named
-- prior_art_domain: public-key signatures on elliptic curves
-- prior_art_note: Ed25519 — Daniel J. Bernstein, Niels Duif, Tanja Lange, Peter Schwabe and Bo-Yin Yang,
--   2011; standardised as RFC 8032 (Josefsson and Liusvaara, 2017). SHA-512 is FIPS 180-4 (NIST). The
--   curve, the signature scheme and the hash are all theirs and none is this deposit's. The implementation
--   in src/0/ed25519.ts is checked against their published vectors by scripts/crypto-kat.ts, which is where
--   the assurance for the PRIMITIVE lives — not here. Nothing below decides that Ed25519 is secure, and a
--   file that appeared to would be claiming a result nobody has.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHAT THIS FILE IS FOR. Everything cryptographic in this deposit before now was SYMMETRIC — FNV, SHA-256,
-- HMAC, ChaCha20-Poly1305 — and a symmetric tag proves possession of a shared secret. It cannot say WHO
-- produced something, because both parties can produce it. That is a boundary the deposit kept in prose.
--
-- Two facts are decidable, and they are the two that keep the container honest:
--
--   1 · A CHECKSUM IS NOT AUTHENTICATION. The container's first group holds 32 bits computed by a public
--       function of the payload, so anyone who edits the payload recomputes it. Deciding this needs no
--       cryptography at all — it is a counting statement about what a public function can distinguish.
--
--   2 · THE SIGNATURE DOES NOT FIT. An Ed25519 public key is 32 bytes and a signature is 64. A uuid is 16
--       bytes in total, of which 6 BITS are already spoken for. So a signature is carried beside the
--       identifier, never inside it, and "the signature is in the uuid" is arithmetic, not policy.
--
-- No axioms, no Mathlib, no sorry.

namespace Asymmetric

-- ── THE SIZES, in bytes, as the standards fix them ───────────────────────────────────────────────────────
def uuidBytes      : Nat := 16
def publicKeyBytes : Nat := 32
def signatureBytes : Nat := 64
def checkBits      : Nat := 32
def payloadBits    : Nat := 42 + 48

theorem a_signature_is_four_uuids_and_a_key_is_two :
  signatureBytes = 4 * uuidBytes ∧ publicKeyBytes = 2 * uuidBytes := by decide

theorem neither_the_key_nor_the_signature_fits_in_a_uuid :
  uuidBytes < publicKeyBytes ∧ uuidBytes < signatureBytes
    ∧ uuidBytes * 8 < signatureBytes * 8 := by decide

-- and not even if the whole identifier were given over to it, reserved bits and all
theorem not_even_the_whole_uuid_would_hold_one :
  uuidBytes * 8 = 128 ∧ signatureBytes * 8 = 512 ∧ 128 < 512 := by decide

-- the pair travels together, and together they are six times the thing they attest
theorem what_travels_beside_the_identifier :
  publicKeyBytes + signatureBytes = 96 ∧ 96 = 6 * uuidBytes := by decide

-- ── A CHECKSUM CANNOT AUTHENTICATE, AND THIS IS COUNTING, NOT CRYPTOGRAPHY ───────────────────────────────
-- 90 bits of payload cannot be separated by 32 bits of check, so distinct payloads share a check by the
-- pigeonhole alone — before any question of how good the function is.
theorem the_check_cannot_separate_the_payloads :
  2 ^ checkBits < 2 ^ payloadBits ∧ payloadBits = 90 ∧ checkBits = 32 := by decide

-- the gap is not marginal: there are 2^58 payloads per check value on average
theorem the_gap_is_fifty_eight_bits :
  payloadBits - checkBits = 58 ∧ 2 ^ payloadBits = 2 ^ 58 * 2 ^ checkBits := by decide

-- ── AND THE DIFFERENCE A KEY MAKES, stated as the property that separates the two, not as a claim about
--    how hard anything is. A checksum is a function of the payload ALONE: give two parties the same payload
--    and they produce the same tag. A signature is a function of the payload AND a secret: the same payload
--    under two different secrets gives two different tags, which is precisely what lets a verifier tell
--    them apart. Modelled here in miniature over a finite domain — the SHAPE is decidable, the SECURITY is
--    not, and nothing below pretends otherwise.
-- BOTH ARE GIVEN THE SECRET, so the two statements below are the SAME question asked of two functions and
-- the difference is in the answers, not in the shapes. A first version wrote the checksum with no secret
-- parameter and then "proved" that two parties agree by writing `checkOf p == checkOf p` — which is true of
-- everything and decides nothing. A comparison whose sides cannot differ is not a comparison.
def checkOf (_secret payload : Nat) : Nat := payload % 4
def tagOf (secret payload : Nat) : Nat := (secret * 7 + payload * 3) % 16

-- A CHECKSUM IGNORES THE SECRET: every party computes the same value for the same payload, so it names
-- nobody. Over every pair of secrets and every payload in range.
theorem a_checksum_is_the_same_whoever_computes_it :
  (List.range 6).all (fun s => (List.range 6).all (fun t =>
    (List.range 12).all (fun p => checkOf s p == checkOf t p))) := by decide

-- A TAG DOES NOT: distinct secrets give distinct tags on every payload, which is what lets a verifier tell
-- two parties apart. The identical quantification, and it comes out the other way.
theorem two_secrets_part_company_on_every_payload :
  (List.range 12).all (fun p => tagOf 1 p != tagOf 2 p) ∧
  ¬ ((List.range 6).all (fun s => (List.range 6).all (fun t =>
    (List.range 12).all (fun p => tagOf s p == tagOf t p)))) := by decide

-- and the tag really does depend on the payload too, or it would name the party and attest nothing
theorem the_tag_moves_with_the_payload :
  (List.range 11).all (fun p => tagOf 1 p != tagOf 1 (p + 1)) := by decide

-- ── THE FIELD THE IMPLEMENTATION RESTS ON, AND THE ONE FACT IT BRANCHES ON ───────────────────────────────
-- src/0/ed25519.ts recovers x from y by raising to (p+3)/8 and multiplying by a square root of −1 when that
-- misses. That rule is not general: it is valid exactly for a prime ≡ 5 (mod 8), and for p ≡ 3 (mod 4) the
-- rule is the different (p+1)/4 with no fallback. The implementation therefore depends on an arithmetic
-- property of this specific prime, and depending on it silently is how a curve implementation ports itself
-- to another field and stops working. It is decided here, with the rule that does NOT apply stated beside
-- it so the theorem distinguishes rather than merely asserts.
def p : Nat := 2 ^ 255 - 19
def L : Nat := 2 ^ 252 + 27742317777372353535851937790883648493

theorem the_square_root_rule_is_the_one_this_prime_admits :
  p % 8 = 5 ∧ (p + 3) % 8 = 0 ∧ p % 4 = 1 ∧ p % 4 ≠ 3 := by decide

-- and the base point's order is the prime part of a group whose cofactor is eight — bracketed, so the 8 is
-- pinned by two inequalities rather than restated as a number somebody could edit to anything
theorem the_cofactor_is_bracketed_at_eight :
  4 * L < p ∧ p < 8 * L ∧ L < p := by decide

def settledHere : Nat := 11
theorem asymmetric_settles_its_range : settledHere = 11 := rfl

end Asymmetric
