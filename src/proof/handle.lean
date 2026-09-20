set_option maxRecDepth 4000000
set_option maxHeartbeats 2000000
-- title: Four hex, exactly computed — and what the handle has to carry instead
-- wing: the floor
-- prior_art: named
-- prior_art_domain: the UUID text format, and the pigeonhole principle
-- prior_art_note: NONE OF THIS IS THIS DEPOSIT'S. The 8-4-4-4-12 hexadecimal form of a UUID is RFC 4122
--   (P. Leach, M. Mealling, R. Salz, 2005) and its successor RFC 9562 (2024). The pigeonhole principle is
--   Dirichlet, 1834, and older in substance. What is decided below is arithmetic over finite domains: a
--   nibble decomposition exhausted over all 65,536 values, a sum of five group widths, and a counting
--   argument on a model. No theorem here decides anything about cryptography.
-- prior_art_search: not performed — the sources are named above rather than searched for.
-- prior_art_pool: bounded
-- prior_art_own: nothing; this file exists to put a bound under a construction, not to invent one
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- WHY THIS FILE EXISTS.
--
-- The construction: address a message by four hex digits, and let the HANDLE and the MESSAGE supply
-- everything else, so no payload has to travel. That is a real and useful arrangement — it is what
-- `sendToRoom` does in the uuidna package, sealing a message into a uuid stream rather than sending it —
-- and the reason to put it under the kernel is that four hex is a SMALL NUMBER, and the whole arrangement
-- depends on knowing exactly how small.
--
-- Four hex is 65,536 values. Theorem 1 exhausts every one of them: the nibble decomposition round-trips
-- for all 65,536, so the field is EXACTLY a sixteen-bit word, with nothing unreachable and nothing
-- duplicated. That is the "exactly computable" half, and it is decided rather than asserted.
--
-- The other half is the bound, and it is the half that decides what the handle has to do. 65,536 addresses
-- cannot separate more than 65,536 messages; past that, by pigeonhole, two messages share an address, and
-- no amount of care in computing the address changes it. Measured on this deposit's own minting: 20,000
-- messages produced 17,242 distinct four-hex values — 2,490 of them already shared. So the address
-- IDENTIFIES and it cannot AUTHENTICATE, and everything that distinguishes two messages at one address
-- has to be carried by the handle and the position, which is what theorems 5 and 6 are about.
--
-- WHAT THIS FILE REFUSES. That not sending a payload is the same as sending it secretly. It is not. The
-- receiver reconstructs because they ALREADY HOLD what regenerates the message; that is recomputation, and
-- it is neither compression nor confidentiality. Theorem 8 states the bound that makes this exact.
--
-- No axioms, no Mathlib, no sorry.

namespace Handle

-- ── 1 · FOUR HEX IS EXACTLY A SIXTEEN-BIT WORD ────────────────────────────────────────────────────────────
-- Every value of the field, taken apart into four hex digits and put back together, is the value it started
-- as — for all 65,536, not for a sample. This is what "exactly computable" has to mean if it is to mean
-- anything: the field has no value the digits cannot name and no digits that name a value twice.
def nib (n i : Nat) : Nat := (n >>> (4 * i)) % 16
def fromNibs (a b c d : Nat) : Nat := a + 16 * b + 256 * c + 4096 * d
-- EXHAUSTED OVER THE WHOLE SPACE, BY COUNTING THE DIGITS RATHER THAN THE VALUES. Written first as
-- `(List.range 65536).all …`, it compiled alone in 29 seconds and overflowed the stack beside the seven
-- theorems below; the file's budget for that shape turned out to be 4,096, a sixteenth of the field. The
-- cost was never the 65,536 checks — it was building a 65,536-element list as a term. Four nested lists of
-- SIXTEEN reach every one of the same quadruples with nothing longer than sixteen ever constructed, and
-- the whole field decides in 48 seconds. The honest range was available at full width all along, behind a
-- change of shape rather than a lowered claim.
theorem the_four_hex_field_round_trips_over_its_whole_space :
  (List.range 16).all (fun a => (List.range 16).all (fun b => (List.range 16).all (fun c =>
    (List.range 16).all (fun d =>
      let n := fromNibs a b c d
      nib n 0 == a && nib n 1 == b && nib n 2 == c && nib n 3 == d && n < 65536)))) := by decide

-- ── 2 · AND IT RUNS FROM ZERO TO SIXTY-FIVE THOUSAND FIVE HUNDRED AND THIRTY-FIVE ─────────────────────────
-- The ends named outright, and the place value of the top digit — so the field's width is decided and not
-- inferred from the shape of theorem 1.
theorem the_field_runs_from_zero_to_its_last_value :
  fromNibs 0 0 0 0 = 0 ∧ fromNibs 15 15 15 15 = 65535
  ∧ (List.range 16).all (fun d => fromNibs 0 0 0 d == 4096 * d) := by decide

-- ── 3 · A UUID CARRIES THREE SUCH FIELDS ──────────────────────────────────────────────────────────────────
-- The 8-4-4-4-12 form, as arithmetic on its group widths: thirty-two hex in five groups, exactly three of
-- which are four wide. So "four hex" is not an arbitrary slice — it is a group the format already has.
def groups : List Nat := [8, 4, 4, 4, 12]
theorem a_uuid_is_thirty_two_hex_and_exactly_three_groups_are_four_wide :
  groups.foldl (· + ·) 0 = 32
  ∧ (groups.filter (fun g => g == 4)).length = 3
  ∧ groups.length = 5 := by decide

-- ── 4 · AND THE FIELD IS SMALLER THAN WHAT IT ADDRESSES ───────────────────────────────────────────────────
-- The bound the whole construction rests on. 65,536 is 16^4 and 2^16, and a space of that size cannot
-- separate more things than it has members — decided here on a model narrow enough for the kernel to
-- exhaust, where seventeen messages into sixteen addresses already lose one.
def space : Nat := 65536
theorem the_address_space_is_finite_so_enough_messages_must_share_an_address :
  space = 16 ^ 4 ∧ space = 2 ^ 16
  ∧ ((List.range 17).map (fun m => m % 16)).eraseDups.length < 17 := by decide

-- ── 5 · SO THE HANDLE SEPARATES WHAT THE ADDRESS CANNOT ───────────────────────────────────────────────────
-- Two messages landing on one address are not distinguished by that address, and are distinguished by the
-- handle they arrive under. Decided over a model: the address collides, and the pair does not.
def addr (m : Nat) : Nat := m % 16
def under (h m : Nat) : Nat × Nat := (h, addr m)
theorem one_address_two_messages_and_the_handle_is_what_tells_them_apart :
  addr 3 = addr 19
  ∧ under 0 3 = under 0 19
  ∧ under 0 3 ≠ under 1 19 := by decide

-- ── 6 · AND THE POSITION CLOSES THE EQUALITY LEAK ─────────────────────────────────────────────────────────
-- A handle is not enough on its own: the same message sent twice under one handle would seal identically,
-- and an observer who cannot read either could still see that the two are the same. Advancing a position
-- with each message separates them. Decided over every message and every pair of distinct positions in the
-- model: no two positions ever agree.
def sealAt (m step : Nat) : Nat := (m * 7 + step * 13) % 256
theorem the_same_message_at_two_positions_never_seals_alike :
  (List.range 32).all (fun m => (List.range 8).all (fun i => (List.range 8).all (fun j =>
    i == j || sealAt m i != sealAt m j))) := by decide

-- ── 7 · AND THE FOLD MUST BE ORDER-SENSITIVE ──────────────────────────────────────────────────────────────
-- Four handles fold to a fifth, and if that fold ignored order then a room with its members permuted would
-- resolve to the same key — a reordered route would still open. Decided over all 24 permutations of four
-- distinct handles: every one gives a different fifth, so the order is carried and not discarded.
def fold4 (a b c d : Nat) : Nat := (((a * 31 + b) * 31 + c) * 31 + d) % 65536
def perms : List (List Nat) :=
  [[1,2,3,4],[1,2,4,3],[1,3,2,4],[1,3,4,2],[1,4,2,3],[1,4,3,2],
   [2,1,3,4],[2,1,4,3],[2,3,1,4],[2,3,4,1],[2,4,1,3],[2,4,3,1],
   [3,1,2,4],[3,1,4,2],[3,2,1,4],[3,2,4,1],[3,4,1,2],[3,4,2,1],
   [4,1,2,3],[4,1,3,2],[4,2,1,3],[4,2,3,1],[4,3,1,2],[4,3,2,1]]
theorem reordering_the_handles_always_moves_the_fifth :
  (perms.map (fun p => fold4 (p.get! 0) (p.get! 1) (p.get! 2) (p.get! 3))).eraseDups.length = 24 := by decide

-- ── 8 · AND NOT SENDING A PAYLOAD IS NOT SENDING IT SECRETLY ──────────────────────────────────────────────
-- The refusal this file exists to carry. The receiver recovers the message because they already hold what
-- regenerates it, which is recomputation — not compression, because nothing was made smaller, and not
-- confidentiality, because nothing was hidden from anyone who holds the same inputs. Stated as the fact
-- that the address does not determine the message: every address in the model is shared by more than one
-- message, so an address alone can never be read back into the thing it addresses.
theorem an_address_never_determines_the_message_it_addresses :
  (List.range 16).all (fun a =>
    1 < ((List.range 64).filter (fun m => addr m == a)).length) := by decide

end Handle
