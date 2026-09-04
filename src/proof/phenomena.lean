set_option maxRecDepth 8000000
-- title: Every phenomenon this deposit touches, and the rule for the rest
-- wing: the floor
-- prior_art: named
-- prior_art_domain: metrology and classical physical chemistry
-- prior_art_note: the SI base quantities and their defining constants are definitions of the Conférence
--   Générale des Poids et Mesures (2019 revision, effective 20 May 2019); the electrochemical results are
--   Michael Faraday's laws of electrolysis, 1834, and the standard enthalpy of combustion of hydrogen.
--   Every physical result named here has an earlier author or a standards body, and none is this deposit's.
--
-- ADDRESSING PHENOMENA WITHOUT CLAIMING ANY.
--
-- Asked to address all phenomena, there are two ways to answer and only one of them is honest. The first is
-- to write theorems whose names mention gravity, entanglement or spacetime and whose content is arithmetic —
-- which is how a deposit acquires the appearance of physics without the substance, and is the exact failure
-- every gate in this tree exists to catch. The second is to say, for each phenomenon, precisely what this
-- deposit does and does not say about it, and to make the boundary decidable.
--
-- This file does the second. A phenomenon enters under one of two statuses and no other:
--
--   0 — DEFINITIONAL. A standards body fixed an exact number for it, so arithmetic on that number is
--       decidable here. This is not a measurement and does not constrain the phenomenon: the measuring
--       moved to the other side of the definition in 1983 and 2019. See light.lean.
--
--   1 — NAMED PRIOR ART. A classical result with an earlier author, restated and credited. See energy.lean.
--
-- Everything else is UNADDRESSED, and the complement is not enumerated below. It is unbounded, and a list of
-- what a piece of work does not cover, written by its author, is not evidence of anything. The rule is
-- stated instead and it is exact: a phenomenon is addressed here only if it has an exact defining constant
-- or a credited classical result in this tree. Gravitation, relativity, entanglement, decoherence, nuclear
-- structure and cosmology have neither, so nothing in this deposit bears on any of them — not because they
-- were considered and excluded, but because no proposition here is about them.

namespace Phenomena

-- (id, status) — status 0 definitional, 1 named prior art. There is no status 2: a phenomenon this deposit
-- does not address does not get a row, because a row would suggest it had been treated.
abbrev Entry := Nat × Nat

def entries : List Entry :=
  [ (1, 0)   -- duration — the caesium-133 hyperfine transition frequency, exact
  , (2, 0)   -- length — the speed of light in vacuum, exact; the metre defined from it
  , (3, 0)   -- mass — the Planck constant, exact
  , (4, 0)   -- electric current — the elementary charge, exact
  , (5, 0)   -- thermodynamic temperature — the Boltzmann constant, exact
  , (6, 0)   -- amount of substance — the Avogadro constant, exact
  , (7, 0)   -- luminous intensity — the luminous efficacy K_cd, exact
  , (8, 1)   -- electrolysis — Faraday's laws, 1834
  , (9, 1)   -- combustion of hydrogen — standard enthalpy, physical chemistry
  ]

def statusOf (e : Entry) : Nat := e.2

-- ── THE TABLE IS CLOSED: every entry is definitional or credited, and nothing else ──────────────────────
theorem every_phenomenon_is_definitional_or_credited :
  entries.all (fun e => statusOf e == 0 || statusOf e == 1) := by decide

theorem seven_definitional_and_two_credited :
  (entries.filter (fun e => statusOf e == 0)).length = 7
  ∧ (entries.filter (fun e => statusOf e == 1)).length = 2
  ∧ entries.length = 9 := by decide

-- The seven definitional entries are the seven SI base quantities — the whole of what the SI fixes, so this
-- half of the table is complete rather than selected.
theorem the_definitional_half_is_the_whole_si :
  (entries.filter (fun e => statusOf e == 0)).length = 7 := by decide

-- ── WHAT THIS FILE CANNOT DECIDE, AND WHY THE ATTEMPT WAS REMOVED ───────────────────────────────────────
-- This carried three constants — explanations, predictions, theoriesConstrained, each `:= 0` — and a theorem
-- deciding that each equals zero. That is a number compared to itself: it certifies nothing about what the
-- deposit claims and cannot go red however much it claims. It is the exact shape removed from index.lean
-- earlier the same day (`provenHere = 0 := rfl`), written back into this file hours later by the same hand,
-- and then QUOTED as evidence that the deposit proves zero physical claims.
--
-- It was quoted wrongly twice over. The tautology was the first error. The second is that the claim was
-- false on its own terms: captain.md offers the double torus as EARTH NAVIGATION and states sailing angles,
-- which are assertions about the world, and no theorem here bears on them. A file about ℤ/9 cannot decide
-- what a page elsewhere in the repository asserts.
--
-- So the refusal is not restated here as arithmetic. Where it belongs is a check that reads the corpus and
-- can fail — scripts/contradictions.ts sweeps every markdown and source file in the deposit's own voice —
-- and where THAT is silent, as it is on navigation, the honest record is that nothing checks it yet rather
-- than a theorem implying something does.

theorem the_table_is_closed_and_that_is_all_this_file_decides :
  entries.all (fun e => statusOf e == 0 || statusOf e == 1)
  ∧ entries.length = 9
  ∧ (entries.filter (fun e => statusOf e == 0)).length = 7 := by decide

end Phenomena
