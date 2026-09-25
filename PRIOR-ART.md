---
title: Prior art
description: What this deposit restates from named earlier work, what it claims as its own, and why claiming is not the same as establishing novelty.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
# Prior art — what is restated, what is claimed, and the difference

Of 1,160 machine-checked declarations, **1,106** restate work that already has an author and
**54** are about this deposit's own construction. Each source file declares which it is, in its own
frontmatter; [`src/proof/priorart.lean`](https://github.com/ceccec/millennium-solutions/blob/main/src/proof/priorart.lean)
holds the same partition as a table the kernel decides over, and the build fails if the two disagree.

## What is claimed

**Priority, which is evidenced.** A dated, content-addressed publication: the DOI fixes the date, the
append-only receipt chain fixes which statement was published, and anyone can recompute either. Priority says
*this was published, in this form, by this date*.

**Not novelty, which is not.** Nothing here can decide that no earlier work states a result — a kernel decides
propositions over finite domains, it does not search the literature. `noveltyEstablished = 0` is a theorem in
`priorart.lean` for the same reason `provenHere = 0` is one: the boundary is checked on every run rather
than remembered. **No prior art known to the author** is a fact about the author. **No prior art exists** is a
fact about the world, and this deposit does not assert it.

### The partition, which must be read as three numbers and never as one

| | theorems |
|---|---|
| attributed to named earlier work | **1,106** |
| unclassified — no search performed, status unknown | **54** |
| claimed as novel | **0** |

**Zero claims is not full attribution.** Stated alone, "this deposit claims no novelty" reads as a concession
that everything here already has an author. It is not that. **54** theorems have had no prior-art
search at all, so their status is unknown rather than conceded — and of the 27 distinct years the
attributions carry, **23** predate the DOI system (2000); the earliest is 628. "Every
theorem has registered prior art" is therefore not merely unproven here, it is impossible. The zero has exactly one meaning: **nobody has
looked.** It is a statement about work not done, not about work found.

`zero_claims_is_not_full_attribution` decides those two facts together in the kernel, so the count and its
caveat cannot be separated by an edit.

A source may claim novelty only if it names a prior-art search that was actually performed — what was
searched, where, and when. An earlier version of this page claimed novelty for 4 sources and
54 theorems on the strength of their own self-description, with nobody having looked. Asserting
that nothing earlier exists because no one went to check is the same defect as asserting a proof because no
one went to read it.

## Restated from named earlier work — 53 sources, 1,106 theorems

No novelty is claimed over any of these. What is done here is to decide each over a stated finite domain,
which is a contribution of verification, not of discovery.

<table><thead><tr><th>source</th><th>theorems</th><th>domain</th><th>whose work</th></tr></thead><tbody>
<tr><td><code>address.lean</code></td><td>26</td><td>content addressing</td><td>composes FNV-1a (Fowler, Noll, Vo, 1991) with the Merkle hash tree (Merkle, 1979)</td></tr>
<tr><td><code>asymmetric.lean</code></td><td>12</td><td>public-key signatures on elliptic curves</td><td>Ed25519 — Daniel J. Bernstein, Niels Duif, Tanja Lange, Peter Schwabe and Bo-Yin Yang,</td></tr>
<tr><td><code>capacity.lean</code></td><td>8</td><td>the UUID layout and its version and variant fields — RFC 9562 (2024, obsoleting RFC</td><td>NEITHER IS THIS DEPOSIT'S. RFC 9562 reserves the six bits and the birthday bound is</td></tr>
<tr><td><code>closure.lean</code></td><td>8</td><td>Cantor's diagonal argument again, turned on a vocabulary rather than a set; the</td><td>THE METHOD IS CANTOR'S AND THE FINITE CASE IS ELEMENTARY. What is this deposit's is the</td></tr>
<tr><td><code>coils.lean</code></td><td>27</td><td>extensional equality of predicates over a finite set — that two definitions picking out</td><td>NOT THIS DEPOSIT'S. "Two descriptions of the same set are equal" is the definition of a</td></tr>
<tr><td><code>coin.lean</code></td><td>12</td><td>the method of complements</td><td>the reflection d ↦ 10 − d is the TEN'S COMPLEMENT, and its sibling 9 − d the nines' complement — the method of complements, used to turn subtraction into addition in Pascal's calculator (1642), the Comptometer and the Curta, and in modern computer arithmetic. That it is an involution with a single fixed point is the property those machines rely on. Searched 2026-09-04, term "method of complements / nines' complement / ten's complement"; prior art found and credited</td></tr>
<tr><td><code>demand.lean</code></td><td>11</td><td>elementary number theory</td><td>the named results the search data asks for — Bézout’s identity (Étienne Bézout, 1779; Bachet, 1624), the Chinese remainder theorem (Sunzi, c. 3rd–5th century), and others named in their theorems</td></tr>
<tr><td><code>demand2.lean</code></td><td>12</td><td>elementary number theory, second tier</td><td>Wilson’s theorem — John Wilson; first proved by Joseph-Louis Lagrange, 1771; the Catalan conjecture on consecutive perfect powers — Eugène Catalan, 1844; proved by Preda Mihăilescu, 2002</td></tr>
<tr><td><code>demand3.lean</code></td><td>19</td><td>elementary number theory, named results</td><td>Legendre’s three-square theorem — Adrien-Marie Legendre, 1797; Carmichael numbers — Robert Carmichael, 1910; amicable pairs — known to antiquity</td></tr>
<tr><td><code>diagonal.lean</code></td><td>7</td><td>Cantor's diagonal argument (1891), in its finite form: no list of subsets of a finite</td><td>THE ARGUMENT IS CANTOR'S AND NOTHING HERE IMPROVES IT. It is one of the most cited</td></tr>
<tr><td><code>digits.lean</code></td><td>8</td><td>the nines' and tens' complement, the basis of complement subtraction and of the</td><td>COMPLEMENT ARITHMETIC IS NOT THIS DEPOSIT'S AND IS OLDER THAN THE DECIMAL POINT. That a</td></tr>
<tr><td><code>discount.lean</code></td><td>6</td><td>the false-positive rate of a classifier, and the correction of a raw count by a</td><td>NOT THIS DEPOSIT'S, AND OLD. Subtracting what a control already produces is what a blank</td></tr>
<tr><td><code>domain.lean</code></td><td>8</td><td>Cantor's diagonal argument, and the elementary fact that a diagonal over a domain of n</td><td>THE BOUND IS NOT NEW AND IS NOT CLAIMED. "One point per property" is the counting that</td></tr>
<tr><td><code>elementary.lean</code></td><td>41</td><td>elementary number theory and combinatorial game theory</td><td>Euclid (Elements IX.36) and Euler for the even perfect numbers; the amicable pair</td></tr>
<tr><td><code>energy.lean</code></td><td>28</td><td>electrochemistry and combustion</td><td>the laws of electrolysis — Michael Faraday, 1834; the enthalpy of combustion of hydrogen, standard physical chemistry</td></tr>
<tr><td><code>families.lean</code></td><td>64</td><td>modular arithmetic, quantified</td><td>quantifies the ℤ/9 arithmetic above; the underlying results are Fermat’s, Euler’s and Gauss’s</td></tr>
<tr><td><code>flow.lean</code></td><td>16</td><td>elementary number theory — the multiplicative order of 2 modulo 9</td><td>2⁶ = 64 ≡ 1 (mod 9), so the powers of two modulo 9 repeat with period six — Euler's</td></tr>
<tr><td><code>fnv.lean</code></td><td>15</td><td>non-cryptographic hashing</td><td>FNV-1a — Glenn Fowler, Landon Curt Noll and Phong Vo, 1991</td></tr>
<tr><td><code>generated.lean</code></td><td>13</td><td>elementary number theory — the unit group of ℤ/9 and the doubling orbit</td><td>the structure underneath is standard and is credited. The doubling orbit</td></tr>
<tr><td><code>handle.lean</code></td><td>8</td><td>the UUID text format, and the pigeonhole principle</td><td>NONE OF THIS IS THIS DEPOSIT'S. The 8-4-4-4-12 hexadecimal form of a UUID is RFC 4122</td></tr>
<tr><td><code>imagined.lean</code></td><td>91</td><td>elementary number theory — the unit group of Z/9</td><td>the doubling orbit 1,2,4,8,7,5 is the cyclic group U(9), which is cyclic of order 6 generated by 2, with units {1,2,4,5,7,8} = φ(9); 2 and 5 are its only generators. Standard elementary number theory, in Gauss and in every abstract-algebra text. The closure statements quantify that structure. Searched 2026-09-04, term "multiplicative group of units mod 9 cyclic order 6 generated by 2"; prior art found and credited</td></tr>
<tr><td><code>imprint.lean</code></td><td>10</td><td>identifier formats and length-prefixed encodings</td><td>the UUID layout and its version and variant fields are RFC 9562 (2024, obsoleting RFC</td></tr>
<tr><td><code>index.lean</code></td><td>11</td><td>elementary number theory — the unit group of ℤ/9 and the doubling orbit</td><td>the structure underneath is standard and is credited. The doubling orbit</td></tr>
<tr><td><code>involution.lean</code></td><td>8</td><td>elementary group theory — orbit decomposition of an order-two permutation</td><td>that a permutation of order two decomposes a finite set into fixed points and</td></tr>
<tr><td><code>ledgerclaims.lean</code></td><td>8</td><td>hash trees and membership proofs</td><td>`membership_grows_by_one_seal_per_doubling` and `membership_is_logarithmic_not_linear`</td></tr>
<tr><td><code>light.lean</code></td><td>17</td><td>metrology — the International System of Units</td><td>the exact numerical values below are DEFINITIONS adopted by the Conférence Générale des</td></tr>
<tr><td><code>mechanical.lean</code></td><td>127</td><td>Boolean algebra and elementary modular arithmetic</td><td>the Boolean rows are De Morgan's laws — Augustus De Morgan, 1847 — written in the arithmetic of {0,1}; the group rows are the additive group of Z/9. Both long prior. Searched 2026-09-04, terms "De Morgan's laws boolean algebra" and "additive group mod 9"; prior art found and credited</td></tr>
<tr><td><code>merkaba.lean</code></td><td>8</td><td>elementary group theory — subgroups and cosets of Z/9</td><td>the partition into {3,6,9} and two three-element classes closed under doubling is the subgroup and coset structure of Z/9 under the action of U(9); Lagrange. One theorem already credits Euler for the polyhedron formula. Searched 2026-09-04; prior art found and credited</td></tr>
<tr><td><code>merkle.lean</code></td><td>17</td><td>hash trees and membership proofs</td><td>the hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987</td></tr>
<tr><td><code>mirror.lean</code></td><td>8</td><td>an involution on a finite set decomposes into fixed points and transpositions — the</td><td>NONE OF IT IS THIS DEPOSIT'S. That an involution is fixed points plus 2-cycles is the</td></tr>
<tr><td><code>nim.lean</code></td><td>28</td><td>combinatorial game theory</td><td>Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939</td></tr>
<tr><td><code>nucleus.lean</code></td><td>8</td><td>the nuclear shell model, and the proton-to-electron mass ratio</td><td>THE PHYSICS IS NOT THIS DEPOSIT'S AND NONE OF IT IS CLAIMED. The shell model and its</td></tr>
<tr><td><code>phenomena.lean</code></td><td>4</td><td>metrology and classical physical chemistry</td><td>the SI base quantities and their defining constants are definitions of the Conférence</td></tr>
<tr><td><code>planck.lean</code></td><td>35</td><td>the CODATA recommended values, and the SI's 2019 definition of the seven base constants</td><td>NONE OF THE PHYSICS IS THIS DEPOSIT'S AND NONE OF IT IS CLAIMED. The Planck units are</td></tr>
<tr><td><code>preimage.lean</code></td><td>8</td><td>the second-preimage weakness of unpadded Merkle trees, and the standard remedy of</td><td>NOT THIS DEPOSIT'S AND WELL KNOWN. That a Merkle tree without domain separation lets an</td></tr>
<tr><td><code>program.lean</code></td><td>22</td><td>identifier formats and error-detecting codes</td><td>the UUID layout and its version and variant fields are RFC 9562 (2024, obsoleting RFC</td></tr>
<tr><td><code>quantum.lean</code></td><td>12</td><td>canonical forms and order-invariant commitments</td><td>sorting a multiset into a canonical order BEFORE folding it is standard practice, not a</td></tr>
<tr><td><code>rays.lean</code></td><td>14</td><td>cyclic groups and primitive roots</td><td>that 3 is a primitive root modulo 7 and that (ℤ/7)* is cyclic of order six is Gauss and</td></tr>
<tr><td><code>reach.lean</code></td><td>12</td><td>elementary set theory — the naturals are not exhausted by any finite list</td><td>that no finite set contains every natural number is Euclid's argument in form and is as</td></tr>
<tr><td><code>reached.lean</code></td><td>80</td><td>elementary finite group theory over ℤ/9, and the hue circle of colour theory</td><td>NONE OF THE MATHEMATICS IS THIS DEPOSIT'S. That every element of a finite additive group</td></tr>
<tr><td><code>recovered.lean</code></td><td>15</td><td>elementary number theory — the unit group of ℤ/9</td><td>every fact here is standard: the units of ℤ/9 are {1,2,4,5,7,8}, their product is −1</td></tr>
<tr><td><code>reflection.lean</code></td><td>8</td><td>the method of complements</td><td>the universal reflection here is the same ten's complement d ↦ 10 − d as coin.lean, with its centre and its pairs summing to ten. Method of complements, long prior to this deposit. Searched 2026-09-04</td></tr>
<tr><td><code>reversal.lean</code></td><td>30</td><td>elementary arithmetic</td><td>digit reversal and digit sums; casting out nines, in use by the 12th century</td></tr>
<tr><td><code>rights.lean</code></td><td>9</td><td>copyright law — rights arising without formality</td><td>this file already NAMED its prior art in prose while the attribution table recorded none.</td></tr>
<tr><td><code>roots.lean</code></td><td>8</td><td>cryptographic hash standards and integer root extraction</td><td>SHA-512 and its constants are FIPS 180-4 (NIST, 2015): K[t] is the first 64 bits of the</td></tr>
<tr><td><code>separation.lean</code></td><td>8</td><td>the separation of points by a family of functions — the notion behind a separating</td><td>NEITHER IDEA IS THIS DEPOSIT'S. "A family of maps is worth having when it tells two</td></tr>
<tr><td><code>sequences.lean</code></td><td>28</td><td>integer sequences and identities</td><td>Cassini’s identity — G. D. Cassini, 1680; Lucas sequences — Édouard Lucas, 1878; the Brahmagupta–Fibonacci identity — Brahmagupta, 628; Pascal’s triangle mod 2 — Blaise Pascal, 1654</td></tr>
<tr><td><code>speed.lean</code></td><td>12</td><td>hash trees and membership proofs</td><td>the structural claim is Merkle's and is credited here as merkle.lean already credits it:</td></tr>
<tr><td><code>split.lean</code></td><td>22</td><td>elementary number theory — the unit group of ℤ/9</td><td>the classification this file rests on is standard and is credited: the units of ℤ/9 are</td></tr>
<tr><td><code>theology.lean</code></td><td>8</td><td>elementary number theory — the unit group of ℤ/9, the doubling map, and the ten's complement</td><td>the structure is the same standard one index.lean credits: U(9) = {1,2,4,5,7,8}, the</td></tr>
<tr><td><code>turns.lean</code></td><td>8</td><td>the cycle decomposition of a permutation into disjoint cycles; the order of 2 in</td><td>NONE OF IT IS THIS DEPOSIT'S. Cycle decomposition is the first structure theorem for</td></tr>
<tr><td><code>z9.lean</code></td><td>25</td><td>modular arithmetic</td><td>Fermat’s little theorem — Pierre de Fermat, 1640; Euler’s theorem — Leonhard Euler, 1763; primitive roots — Carl Friedrich Gauss, 1801</td></tr>
<tr><td><code>z9plus.lean</code></td><td>48</td><td>modular arithmetic and periodicity</td><td>digital roots (casting out nines) — in use by the 12th century; the Pisano period — after Leonardo Pisano; studied by Joseph-Louis Lagrange, 1774</td></tr>
</tbody></table>

### The domains this touches

- **Boolean algebra and elementary modular arithmetic** — 127 theorems, in `mechanical.lean`
- **Cantor's diagonal argument (1891), in its finite form: no list of subsets of a finite** — 7 theorems, in `diagonal.lean`
- **Cantor's diagonal argument again, turned on a vocabulary rather than a set; the** — 8 theorems, in `closure.lean`
- **Cantor's diagonal argument, and the elementary fact that a diagonal over a domain of n** — 8 theorems, in `domain.lean`
- **an involution on a finite set decomposes into fixed points and transpositions — the** — 8 theorems, in `mirror.lean`
- **canonical forms and order-invariant commitments** — 12 theorems, in `quantum.lean`
- **combinatorial game theory** — 28 theorems, in `nim.lean`
- **content addressing** — 26 theorems, in `address.lean`
- **copyright law — rights arising without formality** — 9 theorems, in `rights.lean`
- **cryptographic hash standards and integer root extraction** — 8 theorems, in `roots.lean`
- **cyclic groups and primitive roots** — 14 theorems, in `rays.lean`
- **electrochemistry and combustion** — 28 theorems, in `energy.lean`
- **elementary arithmetic** — 30 theorems, in `reversal.lean`
- **elementary finite group theory over ℤ/9, and the hue circle of colour theory** — 80 theorems, in `reached.lean`
- **elementary group theory — orbit decomposition of an order-two permutation** — 8 theorems, in `involution.lean`
- **elementary group theory — subgroups and cosets of Z/9** — 8 theorems, in `merkaba.lean`
- **elementary number theory** — 11 theorems, in `demand.lean`
- **elementary number theory and combinatorial game theory** — 41 theorems, in `elementary.lean`
- **elementary number theory — the multiplicative order of 2 modulo 9** — 16 theorems, in `flow.lean`
- **elementary number theory — the unit group of Z/9** — 91 theorems, in `imagined.lean`
- **elementary number theory — the unit group of ℤ/9** — 37 theorems, in `recovered.lean`, `split.lean`
- **elementary number theory — the unit group of ℤ/9 and the doubling orbit** — 24 theorems, in `generated.lean`, `index.lean`
- **elementary number theory — the unit group of ℤ/9, the doubling map, and the ten's complement** — 8 theorems, in `theology.lean`
- **elementary number theory, named results** — 19 theorems, in `demand3.lean`
- **elementary number theory, second tier** — 12 theorems, in `demand2.lean`
- **elementary set theory — the naturals are not exhausted by any finite list** — 12 theorems, in `reach.lean`
- **extensional equality of predicates over a finite set — that two definitions picking out** — 27 theorems, in `coils.lean`
- **hash trees and membership proofs** — 37 theorems, in `ledgerclaims.lean`, `merkle.lean`, `speed.lean`
- **identifier formats and error-detecting codes** — 22 theorems, in `program.lean`
- **identifier formats and length-prefixed encodings** — 10 theorems, in `imprint.lean`
- **integer sequences and identities** — 28 theorems, in `sequences.lean`
- **metrology and classical physical chemistry** — 4 theorems, in `phenomena.lean`
- **metrology — the International System of Units** — 17 theorems, in `light.lean`
- **modular arithmetic** — 25 theorems, in `z9.lean`
- **modular arithmetic and periodicity** — 48 theorems, in `z9plus.lean`
- **modular arithmetic, quantified** — 64 theorems, in `families.lean`
- **non-cryptographic hashing** — 15 theorems, in `fnv.lean`
- **public-key signatures on elliptic curves** — 12 theorems, in `asymmetric.lean`
- **the CODATA recommended values, and the SI's 2019 definition of the seven base constants** — 35 theorems, in `planck.lean`
- **the UUID layout and its version and variant fields — RFC 9562 (2024, obsoleting RFC** — 8 theorems, in `capacity.lean`
- **the UUID text format, and the pigeonhole principle** — 8 theorems, in `handle.lean`
- **the cycle decomposition of a permutation into disjoint cycles; the order of 2 in** — 8 theorems, in `turns.lean`
- **the false-positive rate of a classifier, and the correction of a raw count by a** — 6 theorems, in `discount.lean`
- **the method of complements** — 20 theorems, in `coin.lean`, `reflection.lean`
- **the nines' and tens' complement, the basis of complement subtraction and of the** — 8 theorems, in `digits.lean`
- **the nuclear shell model, and the proton-to-electron mass ratio** — 8 theorems, in `nucleus.lean`
- **the second-preimage weakness of unpadded Merkle trees, and the standard remedy of** — 8 theorems, in `preimage.lean`
- **the separation of points by a family of functions — the notion behind a separating** — 8 theorems, in `separation.lean`

Each is a field with an existing literature, and each is where this deposit's contribution actually sits: not
a new result, but an exhaustive machine-checked decision of a known one over a **stated finite domain**. That
is worth saying precisely, because it is both smaller than a discovery claim and more checkable than one.

Author and year are given rather than a resolver identifier. Asserting a DOI for someone else's paper without
verifying it would be a fabricated citation, and this is the worst document in the deposit to put one in.

## This deposit's own construction — 4 sources, 54 theorems, none claimed

The ℤ/9 vortex framework, its ledger, its receipts, and the enumeration its own generators proposed. These are
**unclassified**: no prior-art search has been performed for them, so nothing is claimed about them either
way. They are listed because a reader deserves to know which parts of the deposit are its own construction —
not as an assertion that no one has been here before.

To move a source out of this table, add `-- prior_art_search:` to it naming the search performed; the build
refuses a `none-known` declaration that does not carry one.

<table><thead><tr><th>source</th><th>theorems</th><th>note</th></tr></thead><tbody>
<tr><td><code>authority.lean</code></td><td>8</td><td>NO NOVELTY IS CLAIMED AND NONE IS DENIED. Membership, set difference and monotonicity over</td></tr>
<tr><td><code>instruments.lean</code></td><td>29</td><td>NO NOVELTY IS CLAIMED AND NONE IS DENIED. The three rules are elementary — a strict order</td></tr>
<tr><td><code>lanes.lean</code></td><td>8</td><td>NONE OF THE ARITHMETIC IS THIS DEPOSIT'S. min, ⌊a/b⌋ and truncating subtraction on the</td></tr>
<tr><td><code>priorart.lean</code></td><td>9</td><td>THE PRACTICE IS PRIOR ART AND IS CREDITED. Recording provenance and attribution per</td></tr>
</tbody></table>

## Defensive publication

These are decidable mathematical facts, and mathematical methods as such are excluded subject matter under
EPC Art. 52(2)(a) — see [Rights](/rights). Publishing them openly and with a date is **defensive publication**:
it keeps them available to everyone rather than granting anyone a monopoly. That is the purpose of the
priority claim above, and it is the whole of it.

---

Partition seal `e1bf8b83-ccd5-8a11-a0de-aafa0e749c55` · recompute with `node scripts/priorart.ts` · the kernel re-decides
`priorart.lean` on every run. A content-address proves integrity, not truth.
