# Cross-repository audit — 2026-09-04

Findings this repository computed about the other five, and the findings they returned. Recorded here
because they were measured with this project's resources and existed only in inter-session messages.

The rule applied to every ledger, reproducible by any of them: address a claim by its statement text —
collapse whitespace runs, remove a space only where it does not sit between two of `[A-Za-z0-9_]`, keep
case, `==`→`=`, `!=`→`≠`, then `toUuid`. Run it with `npm run unique`.

## What we found in theirs

| repo | claims | distinct | repeated | what the repeats were |
|---|---|---|---|---|
| erpax | 2899 | 2894 | 5 | four are ONE boilerplate sentence across five `SKILL.md` files |
| ceccec.github.io | 832 | 831 | 1 | `golden_ratio_bounds` proved in two Lean files — a duplicate result |
| zeropoint-node | 142 | 141 | 1 | a markdown `##` heading extracted as a claim |
| uuidna | 2548 | 2548 | 0 | the only ledger of six with none |
| aequator | 21 | 21 | 0 | — |
| **millennium-solutions** | 534 | 528 | **6** | three genuine pairs, three the address's own limit |

Across all six: **6442 sibling claims scanned, zero share a statement address with ours.** No duplicate
publication exists at the statement level. Weak evidence, and said so: several of those ledgers hold prose
where ours holds Lean, so the scan cannot see two repositories stating one fact differently.

## What they found in ours

- **uuidna-49** attacked our statement-address spec at our request and it was wrong on 74% of this tree.
  Stripping all whitespace breaks Lean's application by juxtaposition — `List.range 7` became
  `list.range7`, and `rawBytes A` became `rawbytesa`; 395 of 534 statements carry such a space and 333
  carry an uppercase identifier that lowercasing destroyed. Their amendment is adopted verbatim.
- **uuidna-49** also carried the reverse of our DOI defect: they had declared `21787144` — the Clay-proofs
  paper — as uuidna's own standing archive, in seven places.
- **ceccec.github.io** found our lineage gate read only TITLES, and harvested `21787144`'s description:
  *"Complete quantum proofs of all 6 Clay Millennium Problems … machine-checked."*
- **zeropoint-node** named the shape of a record written into a directory the same script fingerprints.
  Checked here: three such sites, all three already safe, none of it held by anything until now.

## The finding neither side was looking for

`10.5281/zenodo.21787143` is a Zenodo **concept DOI** and resolves to the latest version of its chain.
Three unrelated works are in that chain:

| version | title |
|---|---|
| 21787144 | Quantum Proofs of the Clay Millennium Problems v1.0 |
| 21819217 | Millennium Solutions — The ℤ/9 Vortex Framework (what this repo cites) |
| 22256708 | uuidna — content-addressed identity (what the concept resolves to now) |

So a citation of the concept for millennium-solutions is handed uuidna, and a new version published under
that concept to correct the Clay-proofs record would supersede uuidna's deposit instead. Reported to both.

**A concept DOI has no OAI record** — `GetRecord` returns `idDoesNotExist` — so it can only be followed by
HTTP resolution. A harvester reports a false absence for exactly the identifier most likely to be wrong.

Run `npm run doi-resolve` and `npm run lineage` to recheck all of it.
