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
  , (2,  0, false)   -- asymmetric.lean   — Ed25519 — Daniel J. Bernstein, Niels Duif, Tanja Lange, Peter Schwabe and Bo-Yin Yang, 2011; standardised as RFC 8032 (Josefsson and Liusvaara, 2017). SHA-512 is FIPS 180-4 (NIST). The curve, the signature scheme and the hash are all theirs and none is this deposit's. The implementation in src/0/ed25519.ts is checked against their published vectors by scripts/crypto-kat.ts, which is where the assurance for the PRIMITIVE lives — not here. Nothing below decides that Ed25519 is secure, and a file that appeared to would be claiming a result nobody has.
  , (3,  1, false)   -- authority.lean    — the authority rule, decided rather than asserted
  , (4,  0, false)   -- capacity.lean     — NEITHER IS THIS DEPOSIT'S. RFC 9562 reserves the six bits and the birthday bound is classical probability, older than computing. What is this deposit's is that the CONSEQUENCE of the reservation is decided here rather than left to prose — the capacity and the collision exponent that follow from a count this tree already seals in imprint.lean.
  , (5,  0, false)   -- closure.lean      — THE METHOD IS CANTOR'S AND THE FINITE CASE IS ELEMENTARY. What is this deposit's is the direction it is pointed: src/proof/diagonal.lean applies it to a diagram somebody else published, and this file applies the identical construction to THIS deposit's own vocabulary, over this deposit's own ring, using the nine properties its own files name. A limit exhibited rather than conceded.
  , (6,  0, false)   -- coils.lean        — NOT THIS DEPOSIT'S. "Two descriptions of the same set are equal" is the definition of a set. What is this deposit's is which descriptions in ITS vocabulary turn out to coincide, and that the clustering is derived rather than listed — this file is generated by scripts/coils.ts and hand-editing it would be overwritten.
  , (7,  0, false)   -- coin.lean         — the reflection d ↦ 10 − d is the TEN'S COMPLEMENT, and its sibling 9 − d the nines' complement — the method of complements, used to turn subtraction into addition in Pascal's calculator (1642), the Comptometer and the Curta, and in modern computer arithmetic. That it is an involution with a single fixed point is the property those machines rely on. Searched 2026-09-04, term "method of complements / nines' complement / ten's complement"; prior art found and credited
  , (8,  0, false)   -- demand.lean       — the named results the search data asks for — Bézout’s identity (Étienne Bézout, 1779; Bachet, 1624), the Chinese remainder theorem (Sunzi, c. 3rd–5th century), and others named in their theorems
  , (9,  0, false)   -- demand2.lean      — Wilson’s theorem — John Wilson; first proved by Joseph-Louis Lagrange, 1771; the Catalan conjecture on consecutive perfect powers — Eugène Catalan, 1844; proved by Preda Mihăilescu, 2002
  , (10, 0, false)   -- demand3.lean      — Legendre’s three-square theorem — Adrien-Marie Legendre, 1797; Carmichael numbers — Robert Carmichael, 1910; amicable pairs — known to antiquity
  , (11, 0, false)   -- diagonal.lean     — THE ARGUMENT IS CANTOR'S AND NOTHING HERE IMPROVES IT. It is one of the most cited arguments in mathematics and the finite case is the easy one. What is this deposit's is neither the argument nor its finite case: it is that a specific published ring of labels, drawn three times around three different subjects and captioned "THE ALGEBRA OF EVERYTHING", is put to it by the kernel and the subject it misses is exhibited rather than described.
  , (12, 0, false)   -- digits.lean       — COMPLEMENT ARITHMETIC IS NOT THIS DEPOSIT'S AND IS OLDER THAN THE DECIMAL POINT. That a number and its digitwise ten's-complement sum to a repunit-times-ten is a consequence of place value that any accountant's method already relies on. What is this deposit's is the accounting below: that the ring's four reflection pairs, written as two-digit numbers, are all congruent to one mod nine, and that zero's exception reappears one place up as an excursion rather than a failure.
  , (13, 0, false)   -- discount.lean     — NOT THIS DEPOSIT'S, AND OLD. Subtracting what a control already produces is what a blank is for and has been since titration. What is this deposit's is that the rule is decided by the kernel and sits beside the measurement it governs, so the raw figure cannot be quoted without it.
  , (14, 0, false)   -- domain.lean       — THE BOUND IS NOT NEW AND IS NOT CLAIMED. "One point per property" is the counting that makes Cantor work and it is older than any of this. What this deposit adds is which DOMAIN its own structure offers: the sequence it already defines is eleven positions and not nine, and the two extra ones are exactly the fold and the return.
  , (15, 0, false)   -- elementary.lean   — Euclid (Elements IX.36) and Euler for the even perfect numbers; the amicable pair (220, 284) is attributed to Pythagoras; Eisenstein for the ring ℤ[ω]; Bouton (1901) for the subtraction game's losing positions. None of these results is this deposit's. What is this deposit's is the DECISION of each over a stated finite range, axiom-free, and the honest record of where the range stops short of what the older claim asserted.
  , (16, 0, false)   -- energy.lean       — the laws of electrolysis — Michael Faraday, 1834; the enthalpy of combustion of hydrogen, standard physical chemistry
  , (17, 0, false)   -- families.lean     — quantifies the ℤ/9 arithmetic above; the underlying results are Fermat’s, Euler’s and Gauss’s
  , (18, 0, false)   -- flow.lean         — 2⁶ = 64 ≡ 1 (mod 9), so the powers of two modulo 9 repeat with period six — Euler's theorem for φ(9) = 6, and the order of 2 in U(9), both textbook. Credited, and bounded: what this file adds is the kernel proof that the flow used by `navier_stokes_flow_is_bounded` stays bounded at EVERY step, not only at the 48 that theorem checks.
  , (19, 0, false)   -- fnv.lean          — FNV-1a — Glenn Fowler, Landon Curt Noll and Phong Vo, 1991
  , (20, 0, false)   -- generated.lean    — the structure underneath is standard and is credited. The doubling orbit 1 → 2 → 4 → 8 → 7 → 5 → 1 modulo 9 is the cyclic group generated by 2 in U(9), of order 6 because that is the multiplicative order of 2 mod 9; the units are {1,2,4,5,7,8} and the non-units {0,3,6}. Textbook abstract algebra, and treated directly in the literature on doubling maps modulo odd integers. Bounded, so the credit stops where the earlier work does: what is NOT prior art is the generator that enumerates propositions over this ring and discards the ones true of every sibling; that machinery is this deposit's own. Verification by exhaustion in Lean is this deposit's contribution, and verification is not discovery.
  , (21, 0, false)   -- handle.lean       — NONE OF THIS IS THIS DEPOSIT'S. The 8-4-4-4-12 hexadecimal form of a UUID is RFC 4122 (P. Leach, M. Mealling, R. Salz, 2005) and its successor RFC 9562 (2024). The pigeonhole principle is Dirichlet, 1834, and older in substance. What is decided below is arithmetic over finite domains: a nibble decomposition exhausted over all 65,536 values, a sum of five group widths, and a counting argument on a model. No theorem here decides anything about cryptography.
  , (22, 0, false)   -- imagined.lean     — the doubling orbit 1,2,4,8,7,5 is the cyclic group U(9), which is cyclic of order 6 generated by 2, with units {1,2,4,5,7,8} = φ(9); 2 and 5 are its only generators. Standard elementary number theory, in Gauss and in every abstract-algebra text. The closure statements quantify that structure. Searched 2026-09-04, term "multiplicative group of units mod 9 cyclic order 6 generated by 2"; prior art found and credited
  , (23, 0, false)   -- imprint.lean      — the UUID layout and its version and variant fields are RFC 9562 (2024, obsoleting RFC 4122, 2005). A length-prefixed payload is ordinary practice with no single author and no priority is claimed for it. What is decided here is only that THIS deposit's codec is reversible where it says it is, and refuses where it says it refuses.
  , (24, 0, false)   -- index.lean        — the structure underneath is standard and is credited. The doubling orbit 1 → 2 → 4 → 8 → 7 → 5 → 1 modulo 9 is the cyclic group generated by 2 in U(9), of order 6 because that is the multiplicative order of 2 mod 9; the units are {1,2,4,5,7,8} and the non-units {0,3,6}. Textbook abstract algebra, and treated directly in the literature on doubling maps modulo odd integers. Bounded, so the credit stops where the earlier work does: what is NOT prior art is the use of that orbit as a floor for what this deposit does and does not settle, which is a statement about this repository and has no earlier author. Verification by exhaustion in Lean is this deposit's contribution, and verification is not discovery.
  , (25, 1, false)   -- instruments.lean  — 
  , (26, 0, false)   -- involution.lean   — that a permutation of order two decomposes a finite set into fixed points and transpositions, and that the number of fixed points therefore matches the parity of the set, is classical and long predates this deposit. It is the orbit-counting argument in any first course. What is this deposit's own here is the EXHAUSTIVE decision over ℤ/9 and the measured refusal below.
  , (27, 1, false)   -- lanes.lean        — the safety bound below, decided
  , (28, 0, false)   -- ledgerclaims.lean — `membership_grows_by_one_seal_per_doubling` and `membership_is_logarithmic_not_linear` restate the O(log n) membership proof of a hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987 — which merkle.lean in this same deposit already credits. Classified `unbounded` on the ground that the subject is this deposit's own ledger; the ledger is its own, the logarithm is not. Bounded: what is not prior art is what THIS ledger claims — the 967-receipt case, the saving arithmetic, and the 128-bit seal width as this deposit mints it.
  , (29, 0, false)   -- light.lean        — the exact numerical values below are DEFINITIONS adopted by the Conférence Générale des Poids et Mesures, not results of this deposit: the metre from the speed of light (17th CGPM, 1983) and the seven defining constants fixed exactly in the 2019 revision of the SI, effective 20 May 2019 (BIPM, https://www.bipm.org/en/measurement-units/si-defining-constants). Nothing here measures anything.
  , (30, 0, false)   -- mechanical.lean   — the Boolean rows are De Morgan's laws — Augustus De Morgan, 1847 — written in the arithmetic of {0,1}; the group rows are the additive group of Z/9. Both long prior. Searched 2026-09-04, terms "De Morgan's laws boolean algebra" and "additive group mod 9"; prior art found and credited
  , (31, 0, false)   -- merkaba.lean      — the partition into {3,6,9} and two three-element classes closed under doubling is the subgroup and coset structure of Z/9 under the action of U(9); Lagrange. One theorem already credits Euler for the polyhedron formula. Searched 2026-09-04; prior art found and credited
  , (32, 0, false)   -- merkle.lean       — the hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987
  , (33, 0, false)   -- mirror.lean       — NONE OF IT IS THIS DEPOSIT'S. That an involution is fixed points plus 2-cycles is the first thing anyone proves about involutions, and the tens-complement is how children subtract. What is this deposit's is the accounting below — which residues pair, which is the centre, and which one the reflection carries out of the ring so that it must fold instead.
  , (34, 0, false)   -- nim.lean          — Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939
  , (35, 0, false)   -- nucleus.lean      — THE PHYSICS IS NOT THIS DEPOSIT'S AND NONE OF IT IS CLAIMED. The shell model and its closed-shell numbers 2, 8, 20, 28, 50, 82, 126 are Maria Goeppert Mayer and J. Hans D. Jensen, 1949, who shared the 1963 Nobel Prize for them; the level capacities below are 2j+1 in the standard filling order, which is textbook. The proton-to-electron mass ratio is measured, and CODATA publishes it. What is decided here is ARITHMETIC over lists of small naturals and nothing else: that certain prefix sums of a typed capacity list take certain values, that a product of numerators equals a product of denominators, and that one integer is not another. No theorem below decides anything about a nucleus.
  , (36, 0, false)   -- phenomena.lean    — the SI base quantities and their defining constants are definitions of the Conférence Générale des Poids et Mesures (2019 revision, effective 20 May 2019); the electrochemical results are Michael Faraday's laws of electrolysis, 1834, and the standard enthalpy of combustion of hydrogen. Every physical result named here has an earlier author or a standards body, and none is this deposit's.
  , (37, 0, false)   -- planck.lean       — NONE OF THE PHYSICS IS THIS DEPOSIT'S AND NONE OF IT IS CLAIMED. The Planck units are Max Planck, 1899. The numerical values below are digit sequences published by CODATA and served by NIST at physics.nist.gov/cgi-bin/cuu — the Planck length 1.616255(18)e-35 m, the Planck time 5.391247(60)e-44 s, the Planck mass 2.176434(24)e-8 kg, and the Newtonian constant of gravitation 6.67430(15)e-11 m^3 kg^-1 s^-2, each read from that service on 2026-09-20. No measurement is performed here and none is asserted. What is decided below is arithmetic on those digit sequences: a quotient, a list length, a residue, and an exhaustion over 2,197 products.
  , (38, 0, false)   -- preimage.lean     — NOT THIS DEPOSIT'S AND WELL KNOWN. That a Merkle tree without domain separation lets an internal node be presented as a leaf is textbook, and RFC 6962 fixes it with one prefix byte. What is this deposit's is the finding: that ITS OWN fold has the weakness, in a specific shape, and that the shape is decided here rather than asserted.
  , (39, 1, false)   -- priorart.lean     — this file, about this deposit's own claim
  , (40, 0, false)   -- program.lean      — the UUID layout and its version and variant fields are RFC 9562 (2024, obsoleting RFC 4122, 2005); FNV-1a, used here as the check function, is Glenn Fowler, Landon Curt Noll and Phong Vo, 1991, and is credited in fnv.lean where it is ported. A checksum placed in one field of an identifier over the remaining fields is ordinary practice and no priority is claimed for it. What is decided here is only that THIS deposit's layout is the partition it says it is.
  , (41, 0, false)   -- quantum.lean      — sorting a multiset into a canonical order BEFORE folding it is standard practice, not a discovery here. Sorted-leaf Merkle trees are the recommended construction for multiproofs and are shipped that way in OpenZeppelin's merkle-tree library; canonical ordering before hashing is long-established in cryptographic serialisation generally. The mathematical content is elementary: any function of a canonical form is invariant under permutation of its input, which is why `receipt_is_order_invariant` holds. What this file contributes is the Lean verification over a stated finite domain and the negative controls beside it — `naive_fold_is_not_order_invariant` shows the property is bought by the sort and not free, and `the_receipt_is_not_injective` and `the_invariance_is_canonicalisation_not_physics` state its limits. Verification and refusal, not discovery.
  , (42, 0, false)   -- rays.lean         — that 3 is a primitive root modulo 7 and that (ℤ/7)* is cyclic of order six is Gauss and is elementary number theory; the involution x ↦ ¬x on bit words is Boolean algebra. Neither is this deposit's. What is decided here is only that THIS deposit's ray order is that orbit and that its trace is that involution — the facts a reader would otherwise have to take from a comment.
  , (43, 0, false)   -- reach.lean        — that no finite set contains every natural number is Euclid's argument in form and is as old as mathematics; the deposit claims none of it. What is its own here is the decision over its OWN bounds, and the statement of where that decision stops.
  , (44, 0, false)   -- reached.lean      — NONE OF THE MATHEMATICS IS THIS DEPOSIT'S. That every element of a finite additive group has an inverse, that negation is an involution, that the cosets of a subgroup partition the group, and that the 3-cube has 8 vertices and 12 edges are all textbook and long prior — Lagrange for the cosets, the hypercube counts older still. The RGB/CMY hue relations are ordinary colour theory: complements sit 180° apart on the wheel. What is NOT prior art is that these particular statements sat WITHDRAWN in this deposit's ledger, each marked `portable` — its own judgement that a Lean proof was reachable — and each recorded as "not backed by a Lean proof. Its evidence is a TypeScript test" while nobody wrote one.
  , (45, 0, false)   -- recovered.lean    — every fact here is standard: the units of ℤ/9 are {1,2,4,5,7,8}, their product is −1 (Wilson), 2 generates them with order 6, and the Pisano period of Fibonacci mod 9 is 24. Textbook material, credited. What is NOT prior art is that these particular statements sat WITHDRAWN in this deposit's ledger, each recorded as "not backed by a Lean proof. Its evidence is a TypeScript test", while every one is decidable in a line.
  , (46, 0, false)   -- reflection.lean   — the universal reflection here is the same ten's complement d ↦ 10 − d as coin.lean, with its centre and its pairs summing to ten. Method of complements, long prior to this deposit. Searched 2026-09-04
  , (47, 0, false)   -- reversal.lean     — digit reversal and digit sums; casting out nines, in use by the 12th century
  , (48, 0, false)   -- rights.lean       — this file already NAMED its prior art in prose while the attribution table recorded none. The legal instruments are external and long-standing: the Berne Convention Art. 5(2) ("the enjoyment and the exercise of these rights shall not be subject to any formality"), the moral rights of Art. 6bis, and the sui generis database right of Directive 96/9/EC. `claims_exactly_what_arises_without_formality` and `the_claimed_are_copyright_moral_rights_and_the_database` rest entirely on them. Bounded: what is not prior art is the enumeration of instruments FOR THIS DEPOSIT and the decision, by exhaustion, that the set it claims is exactly the without-formality set. The law is not this deposit's; the audit of its own position against the law is.
  , (49, 0, false)   -- roots.lean        — SHA-512 and its constants are FIPS 180-4 (NIST, 2015): K[t] is the first 64 bits of the fractional part of the cube root of the t-th prime (§4.2.3) and H[i] the same of the square root (§5.3.5). Newton's method for integer roots is classical. Neither is this deposit's. What is decided here is only that THIS deposit's derivation computes those definitions and not something near them.
  , (50, 0, false)   -- separation.lean   — NEITHER IDEA IS THIS DEPOSIT'S. "A family of maps is worth having when it tells two points apart" is as old as the definition of a separating family, and `x = x + y → y = 0` is cancellation, which predates notation. What is this deposit's is neither: it is that the test is run by the kernel, on a specific ring of labels published on a specific day, with a control that fires.
  , (51, 0, false)   -- sequences.lean    — Cassini’s identity — G. D. Cassini, 1680; Lucas sequences — Édouard Lucas, 1878; the Brahmagupta–Fibonacci identity — Brahmagupta, 628; Pascal’s triangle mod 2 — Blaise Pascal, 1654
  , (52, 0, false)   -- speed.lean        — the structural claim is Merkle's and is credited here as merkle.lean already credits it: a hash tree over n leaves has an O(log n) membership proof, so the inclusion path at each power of two is exactly the exponent. Ralph Merkle, 1979 (thesis); CRYPTO 1987. `the_verify_path_is_the_exponent`, `membership_is_logarithmic_not_linear` and `the_gap_widens_with_every_doubling` RESTATE that property. This file was classified `unbounded` — "the subject is this deposit's own verification cost" — which was wrong: the cost is logarithmic BECAUSE of a known result, and the repository was already crediting that result three files away. Bounded: what is not prior art is the MEASURED constants on this machine (recompute 21,582,900 µs against a 38 µs walk) and the arithmetic over them. A measurement is not a discovery either, and the file says so.
  , (53, 0, false)   -- split.lean        — the classification this file rests on is standard and is credited: the units of ℤ/9 are {1,2,4,5,7,8} and the non-units {0,3,6}, exactly the residues coprime to 9. That is textbook abstract algebra — Wikipedia's "multiplicative group of integers modulo n", and every algebra course. So `the_singles_are_exactly_the_non_units` and `the_pairs_are_exactly_the_units_in_order` RESTATE known mathematics and claim nothing. Stated precisely so the credit does not run past the earlier work: what is NOT claimed as prior art is the tokenisation itself — reading the digits as 0|12|3|45|6|78|9 by concatenating consecutive units into two-digit tokens, and the arithmetic that follows from it (every token a multiple of three, closure of the tokens under addition and multiplication). That arrangement is this deposit's presentation of a standard fact, and its verification is by exhaustion here. Crediting an earlier author for a presentation they did not make is the same defect as claiming their result, pointed the other way.
  , (54, 0, false)   -- theology.lean     — the structure is the same standard one index.lean credits: U(9) = {1,2,4,5,7,8}, the non-units {0,3,6}, and the doubling orbit 1 → 2 → 4 → 8 → 7 → 5 → 1 of order six because 2 has multiplicative order six mod 9. Textbook abstract algebra, not this deposit's. The permutation count 7! = 5040 is likewise classical. What is NOT prior art is which facts were chosen and why — and that choosing is not a mathematical act, which is the whole subject of this file.
  , (55, 0, false)   -- turns.lean        — NONE OF IT IS THIS DEPOSIT'S. Cycle decomposition is the first structure theorem for permutations, the order of 2 mod 9 is Euler, and χ = 2 − 2g is Euler again. What is this deposit's is the accounting: that doubling leaves exactly TWO non-trivial loops on this ring, that their step angles are 60° and 180°, and that both close at 360° — and theorem 8, which says plainly that the surface is an interpretation of the cycle structure and not a theorem about it.
  , (56, 0, false)   -- z9.lean           — Fermat’s little theorem — Pierre de Fermat, 1640; Euler’s theorem — Leonhard Euler, 1763; primitive roots — Carl Friedrich Gauss, 1801
  , (57, 0, false)   -- z9plus.lean       — digital roots (casting out nines) — in use by the 12th century; the Pisano period — after Leonardo Pisano; studied by Joseph-Louis Lagrange, 1774
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
-- canonical: this_deposit_claims_no_novelty_today
-- SAME STATEMENT, AND SAYING SO IS THE POINT. What is left of this theorem after the self-certifying
-- literal was cut out is `(sources.filter novelty).length = 0` — which is, character for character, what
-- `this_deposit_claims_no_novelty_today` already decides eighty lines above. The reduction that made this
-- theorem honest also made it a second name for an existing result, and two names for one result is two
-- publications waiting to happen. It is kept, because the passage above it records a real correction that
-- a reader arriving at this end of the file should see, and it is pointed at its canonical form.
theorem novelty_is_claimed_of_no_source :
  (sources.filter novelty).length = 0 := by decide

end PriorArt
