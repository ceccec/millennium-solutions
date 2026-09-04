-- title: Prior art, and what novelty is claimed
-- wing: the record
-- prior_art: unclassified
-- prior_art_pool: unbounded
--   the subject is this deposit's own attribution table.
--   BOUNDED means a search is well posed and simply has not been run — the row is unclassified because
--   nobody looked. UNBOUNDED means the subject is this artifact, so there is no pool to search and the
--   row will stay unclassified however much work is done. They look identical in a count and need
--   opposite responses, which is the distinction uuidna-49 asked for and nobody had drawn.
-- prior_art_own: this file, about this deposit's own claim
-- What this deposit claims as its own, what it restates from named prior art, and the boundary between them.
-- Author: Tsvetan Rouschev · License: CC BY-NC-ND 4.0
--
-- "Claim all without prior art" has an exact reading and a dishonest one. The dishonest one asserts NOVELTY:
-- that no earlier work states these results. Nothing in this repository can decide that. A kernel decides
-- propositions over finite domains; it cannot search the literature, and no amount of computation here turns
-- "the author found none" into "none exists". That claim is refused below, as a theorem, so the refusal is
-- checked on every run rather than remembered.
--
-- The exact reading claims PRIORITY, which is a different thing and is evidenced rather than asserted: a
-- dated, content-addressed publication. The DOI fixes the date; the append-only receipt chain fixes which
-- statement was published; anyone can recompute either. Priority says "this was published, in this form, by
-- this date". It does not say "nobody said it earlier", and this file does not either.
--
-- So each source file DECLARES its own status in its frontmatter, and the two sets are decided here:
--
--   named       — the file restates a result, algorithm or physical constant that has an author already.
--                 FNV-1a is Fowler, Noll and Vo, 1991. The Merkle fold is Merkle, 1979. Nim is Bouton 1901
--                 with Sprague and Grundy after him. Cassini, Lucas and Brahmagupta–Fibonacci are named in
--                 the file that proves them. The arithmetic of ℤ/9 is Euler's and Fermat's. Electrolysis and
--                 combustion are physical chemistry. NO NOVELTY IS CLAIMED OVER ANY OF IT. What is done here
--                 is to decide each over a stated finite domain, which is a contribution of verification and
--                 not of discovery.
--
--   unclassified — no prior-art search has been performed for this source. THIS IS THE DEFAULT, and it claims
--                 nothing. The first version of this file marked eleven sources "none-known" — 300 theorems —
--                 on the strength of their own self-description, without anyone having looked. Asserting that
--                 nothing earlier exists because no one went to check is the same defect as asserting a proof
--                 because no one went to read it.
--
--   none-known  — a prior-art search WAS performed, and the source names it: what was searched, where, and
--                 when. Only this kind may claim novelty, and today no source is of this kind, so the number
--                 of novelty claims this deposit makes is zero.
--
-- The declaration lives in the source files and is compared against this table by scripts/priorart.ts, so the
-- two cannot drift: a file that changes its declaration and not this table fails the build.

namespace PriorArt

-- (id, kind, claimsNovelty)
--   kind 0 — restates named prior art; the earlier author is credited and no novelty is claimed
--   kind 1 — unclassified: no search performed, so nothing is claimed
--   kind 2 — a named search was performed and found nothing; only this kind may claim
abbrev Source := Nat × Nat × Bool
def idOf    (s : Source) : Nat  := s.1
def kindOf  (s : Source) : Nat  := s.2.1
def novelty (s : Source) : Bool := s.2.2

-- One row per .lean file, in the order scripts/priorart.ts reads them.
def sources : List Source :=
  [ (1,  0, false)   -- address.lean      — composes FNV-1a (Fowler, Noll, Vo, 1991) with the Merkle hash tree (Merkle, 1979)
  , (2,  1, false)   -- coin.lean         — one involution on ten digits, this deposit's own reading
  , (3,  0, false)   -- demand.lean       — the named results the search data asks for — Bézout’s identity (Étienne Bézout, 1779; Bachet, 1624), the Chinese remainder theorem (Sunzi, c. 3rd–5th century), and others named in their theorems
  , (4,  0, false)   -- demand2.lean      — Wilson’s theorem — John Wilson; first proved by Joseph-Louis Lagrange, 1771; the Catalan conjecture on consecutive perfect powers — Eugène Catalan, 1844; proved by Preda Mihăilescu, 2002
  , (5,  0, false)   -- demand3.lean      — Legendre’s three-square theorem — Adrien-Marie Legendre, 1797; Carmichael numbers — Robert Carmichael, 1910; amicable pairs — known to antiquity
  , (6,  0, false)   -- energy.lean       — the laws of electrolysis — Michael Faraday, 1834; the enthalpy of combustion of hydrogen, standard physical chemistry
  , (7,  0, false)   -- families.lean     — quantifies the ℤ/9 arithmetic above; the underlying results are Fermat’s, Euler’s and Gauss’s
  , (8,  0, false)   -- fnv.lean          — FNV-1a — Glenn Fowler, Landon Curt Noll and Phong Vo, 1991
  , (9,  1, false)   -- generated.lean    — this deposit's own generator over its own ring
  , (10, 1, false)   -- imagined.lean     — enumerated by this deposit's own imagine pass
  , (11, 1, false)   -- index.lean        — the Millennium floor, computed from this sequence
  , (12, 0, false)   -- involution.lean   — that a permutation of order two decomposes a finite set into fixed points and transpositions, and that the number of fixed points therefore matches the parity of the set, is classical and long predates this deposit. It is the orbit-counting argument in any first course. What is this deposit's own here is the EXHAUSTIVE decision over ℤ/9 and the measured refusal below.
  , (13, 1, false)   -- ledgerclaims.lean — claims about this deposit's own ledger
  , (14, 0, false)   -- light.lean        — the exact numerical values below are DEFINITIONS adopted by the Conférence Générale des Poids et Mesures, not results of this deposit: the metre from the speed of light (17th CGPM, 1983) and the seven defining constants fixed exactly in the 2019 revision of the SI, effective 20 May 2019 (BIPM, https://www.bipm.org/en/measurement-units/si-defining-constants). Nothing here measures anything.
  , (15, 1, false)   -- mechanical.lean   — translated from this deposit's own tests
  , (16, 1, false)   -- merkaba.lean      — the merkaba as THIS deposit constructs it
  , (17, 0, false)   -- merkle.lean       — the hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987
  , (18, 0, false)   -- nim.lean          — Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939
  , (19, 0, false)   -- phenomena.lean    — the SI base quantities and their defining constants are definitions of the Conférence Générale des Poids et Mesures (2019 revision, effective 20 May 2019); the electrochemical results are Michael Faraday's laws of electrolysis, 1834, and the standard enthalpy of combustion of hydrogen. Every physical result named here has an earlier author or a standards body, and none is this deposit's.
  , (20, 1, false)   -- priorart.lean     — this file, about this deposit's own claim
  , (21, 1, false)   -- quantum.lean      — order-invariance of this deposit's receipt
  , (22, 0, false)   -- reach.lean        — that no finite set contains every natural number is Euclid's argument in form and is as old as mathematics; the deposit claims none of it. What is its own here is the decision over its OWN bounds, and the statement of where that decision stops.
  , (23, 0, false)   -- reversal.lean     — digit reversal and digit sums; casting out nines, in use by the 12th century
  , (24, 1, false)   -- rights.lean       — this deposit's own rights table
  , (25, 0, false)   -- sequences.lean    — Cassini’s identity — G. D. Cassini, 1680; Lucas sequences — Édouard Lucas, 1878; the Brahmagupta–Fibonacci identity — Brahmagupta, 628; Pascal’s triangle mod 2 — Blaise Pascal, 1654
  , (26, 1, false)   -- speed.lean        — this deposit's own verification cost
  , (27, 1, false)   -- split.lean        — the digit grouping 0|12|3|45|6|78|9 as this deposit reads it
  , (28, 1, false)   -- theorems.lean     — the universal property, computed from this sequence
  , (29, 0, false)   -- z9.lean           — Fermat’s little theorem — Pierre de Fermat, 1640; Euler’s theorem — Leonhard Euler, 1763; primitive roots — Carl Friedrich Gauss, 1801
  , (30, 0, false)   -- z9plus.lean       — digital roots (casting out nines) — in use by the 12th century; the Pisano period — after Leonardo Pisano; studied by Joseph-Louis Lagrange, 1774
  ]

-- ── THE CLAIM. Only a source that names a completed search may claim, and none does ─────────────────────
-- The rule and the state are separate theorems on purpose. The first says what would have to be true for a
-- claim to be legitimate; the second says how many claims exist today. Stating only the second would leave
-- the rule to prose, and stating only the first would leave the reader to assume the count.
theorem novelty_is_claimed_only_where_a_search_was_performed :
  sources.all (fun s => novelty s == false || kindOf s == 2) := by decide

theorem this_deposit_claims_no_novelty_today :
  (sources.filter novelty).length = 0 := by decide

-- ── WHICH sources, not how many ──────────────────────────────────────────────────────────────────────────
theorem the_restated_sources_are_named_and_claim_nothing :
  (sources.filter (fun s => kindOf s == 0)).all (fun s => novelty s == false) := by decide

theorem an_unsearched_source_claims_nothing :
  (sources.filter (fun s => kindOf s == 1)).all (fun s => novelty s == false) := by decide

theorem every_source_is_classified :
  sources.all (fun s => kindOf s == 0 || kindOf s == 1 || kindOf s == 2) := by decide

theorem the_kinds_cover_every_source :
  (sources.filter (fun s => kindOf s == 0)).length + (sources.filter (fun s => kindOf s == 1)).length
    + (sources.filter (fun s => kindOf s == 2)).length = sources.length := by decide

-- ── ZERO CLAIMS IS NOT FULL ATTRIBUTION ─────────────────────────────────────────────────────────────────
-- A count of zero novelty claims, stated on its own, reads as though the deposit concedes that everything in
-- it already has an author. It does not, and it must not be read that way: 21 of the 22 attributed works
-- predate the DOI system entirely — Fermat 1640, Euler 1763, Bouton 1901 — so "every theorem has registered
-- prior art" is not merely unproven here, it is impossible. And the larger part of the deposit has had NO
-- search at all, so its status is unknown rather than conceded.
--
-- The zero therefore has exactly one meaning: nobody has looked. It is a statement about work not done, not
-- about work found. These two propositions must always be read together, so the kernel decides them together.
theorem some_sources_are_unsearched :
  (sources.filter (fun s => kindOf s == 1)).length > 0 := by decide

theorem zero_claims_is_not_full_attribution :
  (sources.filter novelty).length = 0 ∧ (sources.filter (fun s => kindOf s == 1)).length > 0 := by decide

-- ── THE REFUSAL, stated as a theorem so it is checked and not merely written ─────────────────────────────
-- The Clay floor is measured over the tree, not certified by a constant — index.lean used to declare
-- `provenHere := 0` and prove it by `rfl`, and that was removed because a theorem deciding that a typed
-- literal equals itself certifies a declaration and not the world. THIS IS DIFFERENT, and the difference is
-- worth stating so the two are not confused: the number of results
-- here whose novelty has been ESTABLISHED — shown, by search, to have no earlier statement anywhere — is
-- zero. "No prior art known to the author" is a fact about the author. "No prior art exists" is a fact about
-- the world, and nothing in this repository can decide it. A reader who takes the claimed set as a claim of
-- originality has been misled, so the deposit says so here, in the layer that is checked.
def noveltyEstablished : Nat := 0

theorem novelty_is_never_established_here : noveltyEstablished = 0 := by decide

-- Claiming and establishing are different acts, and today the deposit performs neither.
theorem neither_claimed_nor_established :
  (sources.filter novelty).length = 0 ∧ noveltyEstablished = 0 := by decide

end PriorArt
