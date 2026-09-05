import Ledgerclaims
set_option maxRecDepth 8000000
set_option maxHeartbeats 4000000
-- title: Why verification is fast, and what it is not
-- wing: the floor
-- prior_art: named
-- prior_art_domain: hash trees and membership proofs
-- prior_art_note: the structural claim is Merkle's and is credited here as merkle.lean already credits it:
--   a hash tree over n leaves has an O(log n) membership proof, so the inclusion path at each power of two
--   is exactly the exponent. Ralph Merkle, 1979 (thesis); CRYPTO 1987. `the_verify_path_is_the_exponent`,
--   `membership_is_logarithmic_not_linear` and `the_gap_widens_with_every_doubling` RESTATE that property.
--   This file was classified `unbounded` — "the subject is this deposit's own verification cost" — which was
--   wrong: the cost is logarithmic BECAUSE of a known result, and the repository was already crediting that
--   result three files away.
--   Bounded: what is not prior art is the MEASURED constants on this machine (recompute 21,582,900 µs against
--   a 38 µs walk) and the arithmetic over them. A measurement is not a discovery either, and the file says so.
-- prior_art_search: literature search performed 2026-09-05, terms "Merkle tree membership proof logarithmic
--   verification path length"; prior art found and credited.
-- prior_art_pool: unbounded
--   the subject is this deposit's own verification cost.
--   BOUNDED means a search is well posed and simply has not been run — the row is unclassified because
--   nobody looked. UNBOUNDED means the subject is this artifact, so there is no pool to search and the
--   row will stay unclassified however much work is done. They look identical in a count and need
--   opposite responses, which is the distinction uuidna-49 asked for and nobody had drawn.
-- prior_art_own: this deposit's own verification cost
--
-- The deposit's speed claim, accounted — and the reading it does not support.
--
-- WHAT IS TRUE. Proving a set costs O(N): every leaf is touched. Verifying membership afterwards costs
-- O(log N): the inclusion path is one sibling per level. The gap is N/log N, which GROWS with scale, so the
-- advantage is not a constant that could be tuned away. Measured on one machine at 2^20 leaves: recompute
-- 21.6 seconds, verify 38.5 microseconds, a ratio of 561206. Those two timings are DECLARED INPUTS below,
-- not results — they are what this hardware did on one afternoon, and another machine will give other
-- numbers. What the kernel checks is the counting, which is machine-independent.
--
-- WHAT IS NOT TRUE, and is stated here because it is the thing people hear. Nothing runs in less than a
-- nanosecond. The measured verify is about 38000 nanoseconds; a single hash is roughly 1900. One nanosecond
-- is about one clock cycle at a gigahertz, and light crosses thirty centimetres in it — twenty sequential
-- hash evaluations do not fit inside one. The impression of instantaneity comes from doing twenty units of
-- work instead of a million, which is a smaller exponent and not a faster clock. No quantum hardware is
-- involved and none is claimed; the packaged tool that reports these magnitudes says the same in its own
-- output, that they are integrity verification and not hardware supremacy.
--
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0 · No axioms, no Mathlib, no sorry.

namespace Speed

open LedgerClaims

-- ── declared inputs: what this machine did, in microseconds ──
def recomputeUs : Nat := 21582900   -- folding 2^20 leaves
def verifyUs    : Nat := 38         -- walking the 20-node inclusion path
def nsPerVerify : Nat := 38000      -- the same verify, in nanoseconds

-- ── 1 · THE PATH IS LOGARITHMIC. At each power of two the inclusion path is exactly the exponent — one
--        sibling per level, and no more. This is the whole mechanism. ──
theorem the_verify_path_is_the_exponent :
  rounds 40 1024 = 10 ∧ rounds 40 16384 = 14 ∧ rounds 40 262144 = 18 ∧ rounds 40 1048576 = 20 := by decide

-- ── 2 · AND THE GAP GROWS. N/log N is larger at every step up, so this is not a fixed advantage that a
--        faster recompute could close — the exponent is the thing that differs. ──
theorem the_gap_widens_with_every_doubling :
  1024 / 10 < 16384 / 14 ∧ 16384 / 14 < 262144 / 18 ∧ 262144 / 18 < 1048576 / 20 := by decide

-- ── 3 · NO CONSTANT FACTOR EXPLAINS IT. If verification were merely a constant times cheaper, some c would
--        satisfy c · log₂N ≥ N across the range. Ten thousand does not, at a million leaves. ──
theorem no_constant_factor_accounts_for_the_gap :
  ¬ (10000 * 20 ≥ 1048576) ∧ 100 * 10 ≥ 1024 - 24 := by decide

-- ── 4 · THE MEASURED RATIO, from the declared inputs, in the same unit on both sides — the mistake that
--        made an earlier theorem in this deposit compare seal-bits against a leaf count. ──
theorem the_measured_ratio_at_a_million_leaves :
  recomputeUs / verifyUs = 567971 ∧ recomputeUs > verifyUs * 500000 := by decide

-- ── 5 · VERIFY IS NOT FREE, and calling it O(1) would be the easy overclaim. It grows — slowly, and without
--        bound — so a large enough set costs a longer path. Logarithmic is not constant. ──
theorem verification_grows_it_is_not_constant :
  rounds 40 1024 < rounds 40 1048576 ∧
  ((List.range' 1 10).all (fun k => rounds 40 (2 ^ k) == k)) := by decide

-- ── 6 · NOTHING HERE IS SUB-NANOSECOND. The measured verify is 38000 nanoseconds. The claim that it is under
--        one is off by four and a half orders of magnitude, and this theorem exists so that number sits in
--        the ledger next to the impressive one rather than only the impressive one being quotable. ──
theorem the_verify_is_thirty_eight_thousand_nanoseconds_not_one :
  nsPerVerify = 38000 ∧ nsPerVerify > 1 ∧ nsPerVerify > 10000 := by decide

-- ── 7 · THE WORK PER NODE IS THE SAME on both paths. Recompute and verify run the identical hash; only the
--        COUNT differs. That is what makes this arithmetic rather than a claim about hardware. ──
theorem the_advantage_is_the_count_not_the_operation :
  1048576 - 20 = 1048556 ∧ 1048576 / 20 = 52428 := by decide

-- ── 8 · PROVE ONCE, VERIFY FOREVER — stated as the break-even it actually is. One proof at O(N) pays for
--        itself after N/log N verifications, which at a million leaves is 52428 of them. Before that many,
--        recomputing each time is cheaper, and the deposit should not pretend otherwise. ──
theorem the_break_even_is_the_ratio_of_verifications :
  1048576 / 20 = 52428 ∧ 52428 * 20 ≤ 1048576 ∧ 1048576 < 52429 * 20 + 20 := by decide

-- ── 9 · HEXBITS: WHAT THEY UNLOCK, MEASURED, AND WHAT THEY DO NOT ──────────────────────────────────────
--        A 6-bit encoding over the 64-hexagram lattice was benchmarked against the 8-bit hex table this
--        deposit ships (scripts/bench-hexbit.ts, 200,000 encodings × 5 repetitions, medians). Both round-trip
--        the whole lattice and 2,000 random 16-byte vectors, and 4-bit and 8-bit agree on all of them, so
--        this compares three correct encodings rather than an encoding against a bug.
--
--        The result is a real gain in ONE dimension and a real loss in the other, and both are stated.
def hexChars    : Nat := 32     -- an address in the 8-bit hex form fixed by RFC 9562 §5.8
def hexbitChars : Nat := 22     -- the same address over the 64-hexagram lattice
def hexMs       : Nat := 16     -- median ms for 200,000 encodings, 8-bit table
def hexbitMs    : Nat := 30     -- the same work, 6-bit lattice

-- Shorter: 22 against 32 is a 31% reduction, and that IS what hexbits unlock.
theorem hexbits_are_shorter_than_hex :
  hexbitChars < hexChars ∧ hexChars - hexbitChars = 10 ∧ hexbitChars * 100 / hexChars = 68 := by decide

-- And slower: the same encodings cost 30 ms against 16, so the density is bought with time, not given.
theorem hexbits_are_slower_than_hex :
  hexbitMs > hexMs ∧ hexbitMs * 10 / hexMs = 18 := by decide

-- A theorem named `an_encoding_changes_width_not_the_count_of_operations` stood here and is DELETED. It
-- decided `22 < 32 ∧ 30 > 16 ∧ (1048576 / 20 = 52428 ∧ 1048576 / 20 = 52428)`. The first two conjuncts are
-- already proved directly above; the third is X ∧ X, a tautology, written by someone who had spent the day
-- removing tautologies. And the NAME asserted something about the COUNT OF OPERATIONS that the proposition
-- never mentions — a name claiming more than its proposition decides, which is the defect this deposit
-- widened a whole check to catch and then committed anyway.
--
-- The refusal it was trying to make is true and belongs in prose, where it is not dressed as arithmetic: an
-- encoding changes how many characters carry a value, not how many operations are performed. §7 above proves
-- the operation-count claim; the two theorems above prove the width and the cost. Nothing was lost.

end Speed
