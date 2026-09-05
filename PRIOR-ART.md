---
title: Prior art
description: What this deposit restates from named earlier work, what it claims as its own, and why claiming is not the same as establishing novelty.
head:
  - ['meta', { name: 'robots', content: 'index, follow' }]
---
# Prior art — what is restated, what is claimed, and the difference

Of 534 machine-checked declarations, **448** restate work that already has an author and
**86** are about this deposit's own construction. Each source file declares which it is, in its own
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
| attributed to named earlier work | **448** |
| unclassified — no search performed, status unknown | **86** |
| claimed as novel | **0** |

**Zero claims is not full attribution.** Stated alone, "this deposit claims no novelty" reads as a concession
that everything here already has an author. It is not that. **86** theorems have had no prior-art
search at all, so their status is unknown rather than conceded — and of the 25 distinct years the
attributions carry, **23** predate the DOI system (2000); the earliest is 628. "Every
theorem has registered prior art" is therefore not merely unproven here, it is impossible. The zero has exactly one meaning: **nobody has
looked.** It is a statement about work not done, not about work found.

`zero_claims_is_not_full_attribution` decides those two facts together in the kernel, so the count and its
caveat cannot be separated by an edit.

A source may claim novelty only if it names a prior-art search that was actually performed — what was
searched, where, and when. An earlier version of this page claimed novelty for 8 sources and
86 theorems on the strength of their own self-description, with nobody having looked. Asserting
that nothing earlier exists because no one went to check is the same defect as asserting a proof because no
one went to read it.

## Restated from named earlier work — 22 sources, 448 theorems

No novelty is claimed over any of these. What is done here is to decide each over a stated finite domain,
which is a contribution of verification, not of discovery.

<table><thead><tr><th>source</th><th>theorems</th><th>domain</th><th>whose work</th></tr></thead><tbody>
<tr><td><code>address.lean</code></td><td>14</td><td>content addressing</td><td>composes FNV-1a (Fowler, Noll, Vo, 1991) with the Merkle hash tree (Merkle, 1979)</td></tr>
<tr><td><code>coin.lean</code></td><td>12</td><td>the method of complements</td><td>the reflection d ↦ 10 − d is the TEN'S COMPLEMENT, and its sibling 9 − d the nines' complement — the method of complements, used to turn subtraction into addition in Pascal's calculator (1642), the Comptometer and the Curta, and in modern computer arithmetic. That it is an involution with a single fixed point is the property those machines rely on. Searched 2026-09-04, term "method of complements / nines' complement / ten's complement"; prior art found and credited</td></tr>
<tr><td><code>demand.lean</code></td><td>8</td><td>elementary number theory</td><td>the named results the search data asks for — Bézout’s identity (Étienne Bézout, 1779; Bachet, 1624), the Chinese remainder theorem (Sunzi, c. 3rd–5th century), and others named in their theorems</td></tr>
<tr><td><code>demand2.lean</code></td><td>8</td><td>elementary number theory, second tier</td><td>Wilson’s theorem — John Wilson; first proved by Joseph-Louis Lagrange, 1771; the Catalan conjecture on consecutive perfect powers — Eugène Catalan, 1844; proved by Preda Mihăilescu, 2002</td></tr>
<tr><td><code>demand3.lean</code></td><td>7</td><td>elementary number theory, named results</td><td>Legendre’s three-square theorem — Adrien-Marie Legendre, 1797; Carmichael numbers — Robert Carmichael, 1910; amicable pairs — known to antiquity</td></tr>
<tr><td><code>energy.lean</code></td><td>18</td><td>electrochemistry and combustion</td><td>the laws of electrolysis — Michael Faraday, 1834; the enthalpy of combustion of hydrogen, standard physical chemistry</td></tr>
<tr><td><code>families.lean</code></td><td>12</td><td>modular arithmetic, quantified</td><td>quantifies the ℤ/9 arithmetic above; the underlying results are Fermat’s, Euler’s and Gauss’s</td></tr>
<tr><td><code>fnv.lean</code></td><td>13</td><td>non-cryptographic hashing</td><td>FNV-1a — Glenn Fowler, Landon Curt Noll and Phong Vo, 1991</td></tr>
<tr><td><code>imagined.lean</code></td><td>120</td><td>elementary number theory — the unit group of Z/9</td><td>the doubling orbit 1,2,4,8,7,5 is the cyclic group U(9), which is cyclic of order 6 generated by 2, with units {1,2,4,5,7,8} = φ(9); 2 and 5 are its only generators. Standard elementary number theory, in Gauss and in every abstract-algebra text. The closure statements quantify that structure. Searched 2026-09-04, term "multiplicative group of units mod 9 cyclic order 6 generated by 2"; prior art found and credited</td></tr>
<tr><td><code>involution.lean</code></td><td>8</td><td>elementary group theory — orbit decomposition of an order-two permutation</td><td>that a permutation of order two decomposes a finite set into fixed points and</td></tr>
<tr><td><code>light.lean</code></td><td>11</td><td>metrology — the International System of Units</td><td>the exact numerical values below are DEFINITIONS adopted by the Conférence Générale des</td></tr>
<tr><td><code>mechanical.lean</code></td><td>105</td><td>Boolean algebra and elementary modular arithmetic</td><td>the Boolean rows are De Morgan's laws — Augustus De Morgan, 1847 — written in the arithmetic of {0,1}; the group rows are the additive group of Z/9. Both long prior. Searched 2026-09-04, terms "De Morgan's laws boolean algebra" and "additive group mod 9"; prior art found and credited</td></tr>
<tr><td><code>merkaba.lean</code></td><td>8</td><td>elementary group theory — subgroups and cosets of Z/9</td><td>the partition into {3,6,9} and two three-element classes closed under doubling is the subgroup and coset structure of Z/9 under the action of U(9); Lagrange. One theorem already credits Euler for the polyhedron formula. Searched 2026-09-04; prior art found and credited</td></tr>
<tr><td><code>merkle.lean</code></td><td>9</td><td>hash trees and membership proofs</td><td>the hash tree — Ralph Merkle, 1979 (thesis); CRYPTO 1987</td></tr>
<tr><td><code>nim.lean</code></td><td>8</td><td>combinatorial game theory</td><td>Nim — Charles L. Bouton, 1901; the Sprague–Grundy theorem — Roland Sprague, 1935 and Patrick M. Grundy, 1939</td></tr>
<tr><td><code>phenomena.lean</code></td><td>4</td><td>metrology and classical physical chemistry</td><td>the SI base quantities and their defining constants are definitions of the Conférence</td></tr>
<tr><td><code>reach.lean</code></td><td>5</td><td>elementary set theory — the naturals are not exhausted by any finite list</td><td>that no finite set contains every natural number is Euclid's argument in form and is as</td></tr>
<tr><td><code>reversal.lean</code></td><td>9</td><td>elementary arithmetic</td><td>digit reversal and digit sums; casting out nines, in use by the 12th century</td></tr>
<tr><td><code>sequences.lean</code></td><td>8</td><td>integer sequences and identities</td><td>Cassini’s identity — G. D. Cassini, 1680; Lucas sequences — Édouard Lucas, 1878; the Brahmagupta–Fibonacci identity — Brahmagupta, 628; Pascal’s triangle mod 2 — Blaise Pascal, 1654</td></tr>
<tr><td><code>theorems.lean</code></td><td>8</td><td>the method of complements</td><td>the universal reflection here is the same ten's complement d ↦ 10 − d as coin.lean, with its centre and its pairs summing to ten. Method of complements, long prior to this deposit. Searched 2026-09-04</td></tr>
<tr><td><code>z9.lean</code></td><td>21</td><td>modular arithmetic</td><td>Fermat’s little theorem — Pierre de Fermat, 1640; Euler’s theorem — Leonhard Euler, 1763; primitive roots — Carl Friedrich Gauss, 1801</td></tr>
<tr><td><code>z9plus.lean</code></td><td>32</td><td>modular arithmetic and periodicity</td><td>digital roots (casting out nines) — in use by the 12th century; the Pisano period — after Leonardo Pisano; studied by Joseph-Louis Lagrange, 1774</td></tr>
</tbody></table>

### The domains this touches

- **Boolean algebra and elementary modular arithmetic** — 105 theorems, in `mechanical.lean`
- **combinatorial game theory** — 8 theorems, in `nim.lean`
- **content addressing** — 14 theorems, in `address.lean`
- **electrochemistry and combustion** — 18 theorems, in `energy.lean`
- **elementary arithmetic** — 9 theorems, in `reversal.lean`
- **elementary group theory — orbit decomposition of an order-two permutation** — 8 theorems, in `involution.lean`
- **elementary group theory — subgroups and cosets of Z/9** — 8 theorems, in `merkaba.lean`
- **elementary number theory** — 8 theorems, in `demand.lean`
- **elementary number theory — the unit group of Z/9** — 120 theorems, in `imagined.lean`
- **elementary number theory, named results** — 7 theorems, in `demand3.lean`
- **elementary number theory, second tier** — 8 theorems, in `demand2.lean`
- **elementary set theory — the naturals are not exhausted by any finite list** — 5 theorems, in `reach.lean`
- **hash trees and membership proofs** — 9 theorems, in `merkle.lean`
- **integer sequences and identities** — 8 theorems, in `sequences.lean`
- **metrology and classical physical chemistry** — 4 theorems, in `phenomena.lean`
- **metrology — the International System of Units** — 11 theorems, in `light.lean`
- **modular arithmetic** — 21 theorems, in `z9.lean`
- **modular arithmetic and periodicity** — 32 theorems, in `z9plus.lean`
- **modular arithmetic, quantified** — 12 theorems, in `families.lean`
- **non-cryptographic hashing** — 13 theorems, in `fnv.lean`
- **the method of complements** — 20 theorems, in `coin.lean`, `theorems.lean`

Each is a field with an existing literature, and each is where this deposit's contribution actually sits: not
a new result, but an exhaustive machine-checked decision of a known one over a **stated finite domain**. That
is worth saying precisely, because it is both smaller than a discovery claim and more checkable than one.

Author and year are given rather than a resolver identifier. Asserting a DOI for someone else's paper without
verifying it would be a fabricated citation, and this is the worst document in the deposit to put one in.

## This deposit's own construction — 8 sources, 86 theorems, none claimed

The ℤ/9 vortex framework, its ledger, its receipts, and the enumeration its own generators proposed. These are
**unclassified**: no prior-art search has been performed for them, so nothing is claimed about them either
way. They are listed because a reader deserves to know which parts of the deposit are its own construction —
not as an assertion that no one has been here before.

To move a source out of this table, add `-- prior_art_search:` to it naming the search performed; the build
refuses a `none-known` declaration that does not carry one.

<table><thead><tr><th>source</th><th>theorems</th><th>note</th></tr></thead><tbody>
<tr><td><code>generated.lean</code></td><td>14</td><td>—</td></tr>
<tr><td><code>index.lean</code></td><td>11</td><td>—</td></tr>
<tr><td><code>ledgerclaims.lean</code></td><td>8</td><td>—</td></tr>
<tr><td><code>priorart.lean</code></td><td>9</td><td>—</td></tr>
<tr><td><code>quantum.lean</code></td><td>9</td><td>—</td></tr>
<tr><td><code>rights.lean</code></td><td>8</td><td>—</td></tr>
<tr><td><code>speed.lean</code></td><td>8</td><td>—</td></tr>
<tr><td><code>split.lean</code></td><td>19</td><td>—</td></tr>
</tbody></table>

## Defensive publication

These are decidable mathematical facts, and mathematical methods as such are excluded subject matter under
EPC Art. 52(2)(a) — see [Rights](/rights). Publishing them openly and with a date is **defensive publication**:
it keeps them available to everyone rather than granting anyone a monopoly. That is the purpose of the
priority claim above, and it is the whole of it.

---

Partition seal `3c7b4967-2b1c-89ce-acb6-911454c2d09e` · recompute with `node scripts/priorart.ts` · the kernel re-decides
`priorart.lean` on every run. A content-address proves integrity, not truth. `entails → 0/7`.
