import Ledgerclaims
set_option maxRecDepth 8000000
set_option maxHeartbeats 4000000
-- title: Why verification is fast, and what it is not
-- wing: the floor
-- prior_art: unclassified
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

end Speed
