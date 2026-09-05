-- title: Prior art, and what novelty is claimed
-- wing: the record
-- prior_art: unclassified
-- prior_art_search: literature search PERFORMED 2026-09-05, terms "provenance metadata schema prior art
--   classification per-file attribution taxonomy research software credit". Prior art found and named below.
--   This row stays kind 1 — see why, because the taxonomy does not fit and forcing it would be the lie.
-- prior_art_note: THE PRACTICE IS PRIOR ART AND IS CREDITED. Recording provenance and attribution per
--   artefact is long established and formalised: W3C PROV-O, the DataCite metadata schema, Dublin Core
--   Metadata Terms, PREMIS for archived digital objects, the Open Provenance Model, and the software
--   citation principles' credit-and-attribution requirement. Nothing about keeping an attribution table is
--   new, and this deposit does not suggest otherwise.
--
--   THE PROPOSITIONS ARE NOT RESTATEMENTS OF IT. `every_source_is_classified`, `novelty_is_claimed_of_no_
--   source` and `zero_claims_is_not_full_attribution` decide facts about THIS table — its rows, its kinds,
--   its counts. PROV-O does not entail them and could not; no external work precedes a statement about the
--   contents of this file.
--
--   SO THE TAXONOMY HAS A GAP, AND IT IS NAMED RATHER THAN PAPERED OVER. Kind 0 would say these theorems
--   restate named work, which is false. Kind 2 requires a search that found NOTHING, and this one found a
--   great deal. Kind 1 as originally written means "no search performed", which is no longer true either.
--   The row remains kind 1 because kind 1 claims nothing, and claiming nothing is still correct — but it is
--   now unclassified having been SEARCHED, which is a different state from unclassified for want of looking,
--   and the deposit should not let those two look alike in a count.
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
  , (2,  0, false)   -- coin.lean         — the reflection d ↦ 10 − d is the TEN'S COMPLEMENT, and its sibling 9 − d the nines' complement — the method of complements, used to turn subtraction into addition in Pascal's calculator (1642), the Comptometer and the Curta, and in modern computer arithmetic. That it is an involution with a single fixed point is the property those machines rely on. Searched 2026-09-04, term "method of complements / nines' complement / ten's complement"; prior art found and credited
  , (3,  0, false)   -- demand.lean       — the named results the search data asks for — Bézout’s identity (Étienne Bézout, 1779; Bachet, 1624), the Chinese remainder theorem (Sunzi, c. 3rd–5th century), and others named in their theorems
  , (4,  0, false)   -- demand2.lean      — Wilson’s theorem — John Wilson; first proved by Joseph-Louis Lagrange, 1771; the Catalan conjecture on consecutive perfect powers — Eugène Catalan, 1844; proved by Preda Mihăilescu, 2002
  , (5,  0, false)   -- demand3.lean      — Legendre’s three-square theorem — Adrien-Marie Legendre, 1797; Carmichael numbers — Robert Carmichael, 1910; amicable pairs — known to antiquity
  , (6,  0, false)   -- energy.lean       — the laws of electrolysis — Michael Faraday, 1834; the enthalpy of combustion of hydrogen, standard physical chemistry
  , (7,  0, false)   -- families.lean     — quantifies the ℤ/9 arithmetic above; the underlying results are Fermat’s, Euler’s and Gauss’s
  , (8,  0, false)   -- fnv.lean          — FNV-1a — Glenn Fowler, Landon Curt Noll and Phong Vo, 1991
  , (9,  0, false)   -- generated.lean    — the structure underneath is standard and is credited. The doubling orbit 1 → 2 → 4 → 8 → 7 → 5 → 1 modulo 9 is the cyclic group generated by 2 in U(9), of order 6 because that is the multiplicative order of 2 mod 9; the units are {1,2,4,5,7,8} and the non-units {0,3,6}. Textbook abstract algebra, and treated directly in the literature on doubling maps modulo odd integers. Bounded, so the credit stops where the earlier work does: what is NOT prior art is the generator that enumerates propositions over this ring and discards the ones true of every sibling; that machinery is this deposit's own. Verification by exhaustion in Lean is this deposit's contribution, and verification is not discovery.
  , (10, 0, false)   -- imagined.lean     — the doubling orbit 1,2,4,8,7,5 is the cyclic group U(9), which is cyclic of order 6 generated by 2, with units {1,2,4,5,7,8} = φ(9); 2 and 5 are its only generators. Standard elementary number theory, in Gauss and in every abstract-algebra text. The closure statements quantify that structure. Searched 2026-09-04, term "multiplicative group of units mod 9 cyclic order 6 generated by 2"; prior art found and credited
  , (11, 0, false)   -- index.lean        — the structure underneath is standard and is credited. The doubling orbit 1 → 2 → 4 → 8 → 7 → 5 → 1 modulo 9 is the cyclic group generated by 2 in U(9), of order 6 because that is the multiplicative order of 2 mod 9; the units are {1,2,4,5,7,8} and the non-units {0,3,6}. Textbook abstract algebra, and treated directly in the literature on doubling maps modulo odd integers. Bounded, so the credit stops where the earlier work does: what is NOT prior art is the use of that orbit as a floor for what this deposit does and does not settle, which is a statement about this repository and has no earlier author. Verification by exhaustion in Lean is this deposit's contribution, and verification is not discovery.
  , (12, 0, false)   -- involution.lean   — that a permutation of order two decomposes a finite set into fixed points and transpositions, and that the number of fixed points therefore matches the parity of the set, is classical and long predates this deposit. It is the orbit-counting argument in any first course. What is this deposit's own here is the EXHAUSTIVE decision over ℤ/9 and the measured refusal below.
  , (13, 0, false)   -- ledgerclaims.lean — `membership_grows_by_one_seal_per_doubling` and `membership_is_logarithmic_not_linear` restate the O(log n) membership proof of a hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987 — which merkle.lean in this same deposit already credits. Classified `unbounded` on the ground that the subject is this deposit's own ledger; the ledger is its own, the logarithm is not. Bounded: what is not prior art is what THIS ledger claims — the 967-receipt case, the saving arithmetic, and the 128-bit seal width as this deposit mints it.
  , (14, 0, false)   -- light.lean        — the exact numerical values below are DEFINITIONS adopted by the Conférence Générale des Poids et Mesures, not results of this deposit: the metre from the speed of light (17th CGPM, 1983) and the seven defining constants fixed exactly in the 2019 revision of the SI, effective 20 May 2019 (BIPM, https://www.bipm.org/en/measurement-units/si-defining-constants). Nothing here measures anything.
  , (15, 0, false)   -- mechanical.lean   — the Boolean rows are De Morgan's laws — Augustus De Morgan, 1847 — written in the arithmetic of {0,1}; the group rows are the additive group of Z/9. Both long prior. Searched 2026-09-04, terms "De Morgan's laws boolean algebra" and "additive group mod 9"; prior art found and credited
  , (16, 0, false)   -- merkaba.lean      — the partition into {3,6,9} and two three-element classes closed under doubling is the subgroup and coset structure of Z/9 under the action of U(9); Lagrange. One theorem already credits Euler for the polyhedron formula. Searched 2026-09-04; prior art found and credited
  , (17, 0, false)   -- merkle.lean       — the hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987
  , (18, 0, false)   -- nim.lean          — Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939
  , (19, 0, false)   -- phenomena.lean    — the SI base quantities and their defining constants are definitions of the Conférence Générale des Poids et Mesures (2019 revision, effective 20 May 2019); the electrochemical results are Michael Faraday's laws of electrolysis, 1834, and the standard enthalpy of combustion of hydrogen. Every physical result named here has an earlier author or a standards body, and none is this deposit's.
  , (20, 1, false)   -- priorart.lean     — this file, about this deposit's own claim
  , (21, 0, false)   -- quantum.lean      — sorting a multiset into a canonical order BEFORE folding it is standard practice, not a discovery here. Sorted-leaf Merkle trees are the recommended construction for multiproofs and are shipped that way in OpenZeppelin's merkle-tree library; canonical ordering before hashing is long-established in cryptographic serialisation generally. The mathematical content is elementary: any function of a canonical form is invariant under permutation of its input, which is why `receipt_is_order_invariant` holds. What this file contributes is the Lean verification over a stated finite domain and the negative controls beside it — `naive_fold_is_not_order_invariant` shows the property is bought by the sort and not free, and `the_receipt_is_not_injective` and `the_invariance_is_canonicalisation_not_physics` state its limits. Verification and refusal, not discovery.
  , (22, 0, false)   -- reach.lean        — that no finite set contains every natural number is Euclid's argument in form and is as old as mathematics; the deposit claims none of it. What is its own here is the decision over its OWN bounds, and the statement of where that decision stops.
  , (23, 0, false)   -- reversal.lean     — digit reversal and digit sums; casting out nines, in use by the 12th century
  , (24, 0, false)   -- rights.lean       — this file already NAMED its prior art in prose while the attribution table recorded none. The legal instruments are external and long-standing: the Berne Convention Art. 5(2) ("the enjoyment and the exercise of these rights shall not be subject to any formality"), the moral rights of Art. 6bis, and the sui generis database right of Directive 96/9/EC. `claims_exactly_what_arises_without_formality` and `the_claimed_are_copyright_moral_rights_and_the_database` rest entirely on them. Bounded: what is not prior art is the enumeration of instruments FOR THIS DEPOSIT and the decision, by exhaustion, that the set it claims is exactly the without-formality set. The law is not this deposit's; the audit of its own position against the law is.
  , (25, 0, false)   -- sequences.lean    — Cassini’s identity — G. D. Cassini, 1680; Lucas sequences — Édouard Lucas, 1878; the Brahmagupta–Fibonacci identity — Brahmagupta, 628; Pascal’s triangle mod 2 — Blaise Pascal, 1654
  , (26, 0, false)   -- speed.lean        — the structural claim is Merkle's and is credited here as merkle.lean already credits it: a hash tree over n leaves has an O(log n) membership proof, so the inclusion path at each power of two is exactly the exponent. Ralph Merkle, 1979 (thesis); CRYPTO 1987. `the_verify_path_is_the_exponent`, `membership_is_logarithmic_not_linear` and `the_gap_widens_with_every_doubling` RESTATE that property. This file was classified `unbounded` — "the subject is this deposit's own verification cost" — which was wrong: the cost is logarithmic BECAUSE of a known result, and the repository was already crediting that result three files away. Bounded: what is not prior art is the MEASURED constants on this machine (recompute 21,582,900 µs against a 38 µs walk) and the arithmetic over them. A measurement is not a discovery either, and the file says so.
  , (27, 0, false)   -- split.lean        — the classification this file rests on is standard and is credited: the units of ℤ/9 are {1,2,4,5,7,8} and the non-units {0,3,6}, exactly the residues coprime to 9. That is textbook abstract algebra — Wikipedia's "multiplicative group of integers modulo n", and every algebra course. So `the_singles_are_exactly_the_non_units` and `the_pairs_are_exactly_the_units_in_order` RESTATE known mathematics and claim nothing. Stated precisely so the credit does not run past the earlier work: what is NOT claimed as prior art is the tokenisation itself — reading the digits as 0|12|3|45|6|78|9 by concatenating consecutive units into two-digit tokens, and the arithmetic that follows from it (every token a multiple of three, closure of the tokens under addition and multiplication). That arrangement is this deposit's presentation of a standard fact, and its verification is by exhaustion here. Crediting an earlier author for a presentation they did not make is the same defect as claiming their result, pointed the other way.
  , (28, 0, false)   -- theorems.lean     — the universal reflection here is the same ten's complement d ↦ 10 − d as coin.lean, with its centre and its pairs summing to ten. Method of complements, long prior to this deposit. Searched 2026-09-04
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
--
-- ── IS CLAIMING NOTHING ITSELF AN UNDERCLAIM? ASKED, SEARCHED, AND ANSWERED NO. ─────────────────────────
-- Every source here is kind 0 and no source claims novelty, on the stated ground that verification is not
-- discovery. That policy deserved the same scrutiny as a boast, because an under-claim misrepresents the
-- record exactly as an over-claim does — it just fails in the direction nobody audits.
--
-- The argument against the policy is real: formal verification of KNOWN mathematics is a recognised
-- contribution in its own right — Flyspeck, the Four Colour Theorem in Coq, mathlib itself — so a deposit
-- that machine-checks known results and claims nothing might be giving away work it actually did. This
-- taxonomy has no slot for "restates known mathematics AND contributes a formalisation that did not exist".
--
-- So the question was put to the literature on 2026-09-05, terms "Lean 4 mathlib ZMod 9 units group
-- formalization decide finite modular arithmetic". Mathlib already carries ZMod n, IsUnit, cyclic group
-- structure and the general machinery these facts follow from, across some 232,000 theorems. The
-- FORMALISATION is therefore not new either, and the policy stands — not by assumption, which is how it
-- stood until today, but by a search that could have overturned it and did not.
--
-- What remains distinctive here is a METHOD and not a result: axiom-free, Mathlib-free, closing by decide
-- over stated finite domains. A method is not a discovery, and this file goes on claiming nothing.
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
-- `def noveltyEstablished : Nat := 0` stood here, decided against its own literal — a refusal certifying
-- itself, which is the worst place for this defect, because a refusal is the line a reader trusts without
-- checking it. Establishment is an act performed OUTSIDE this file (a search, with a result), so nothing
-- declared inside it can witness the count. What survives is the conjunct that reads a real list.
theorem novelty_is_claimed_of_no_source :
  (sources.filter novelty).length = 0 := by decide

end PriorArt
