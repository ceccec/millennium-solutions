-- title: The hexbit route's combinatorics
-- wing: the floor
-- prior_art: unclassified
-- prior-art note: not applicable — arithmetic on powers of two, decided by the kernel
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- The arithmetic that scripts/hexbit-route.ts depends on. A handle is the first 8 hex digits of a content address.
-- Each hex digit carries 4 bits, so a handle carries 8 × 4 = 32 bits, and the folders are 16^8 = 2^32 in number.
--
-- Each theorem below was put to the two-sided court (scripts/court-trial.ts, MCP `court_trial`) and returned SEALED.
-- The control, `16 ^ 8 = 4294967295`, is false by construction and returned REFUSED: a trial that could not refuse
-- would seal anything. The control is not compiled into this file, because a false theorem would break the build.

/-! # The hexbit route's combinatorics -/

theorem handle_has_thirty_two_bits : 4 * 8 = 32 := by decide

theorem folders_are_sixteen_to_the_eight : 16 ^ 8 = 4294967296 := by decide

theorem folders_are_two_to_the_thirty_two : 2 ^ 32 = 16 ^ 8 := by decide
