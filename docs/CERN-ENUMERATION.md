# Enumerating CERN Open Data: four routes, none complete

Measured 2026-09-05 against `opendata.cern.ch`. Reproduce with `npm run cern` and `npm run cern:oai`.

## The headline

**No route enumerates the portal completely, and two of them fail silently.** The four sources do not
even agree on what a record *is*.

| route | count | what it misses |
|---|---:|---|
| REST aggregate count | 82,385 | nothing known, but refuses paging past offset 10,000 |
| OAI-PMH `ListIdentifiers` | 74,614 | 9.4% short of REST — **and reports no error** |
| sitemap, canonical records | 61,497 | Documentation, Glossary, and 13,126 OAI records |
| any `recid`-keyed query | 72,111 | 10,274 records carry no indexed `recid` at all |

`robots.txt` carries `Disallow: /api/` and advertises the sitemap, so the sitemap and OAI are the
sanctioned bulk routes. Their union is 74,619 canonical records.

## Where the gap actually is

It is **concentrated by record type**, not spread across the corpus:

| type | total | outside the OAI ∪ sitemap union |
|---|---:|---|
| Dataset | 66,042 | 0 / 15 sampled |
| Supplementaries | 5,904 | 0 / 40 |
| Environment | 64 | 0 / 40 |
| Software | 55 | 0 / 40 |
| **Documentation** | **9,272** | **40 / 40** |
| **Glossary** | **1,006** | **40 / 40** |

**10,278 records — 12.5% of the corpus — are reachable only through the REST API.** Their ids are pure
slugs (`AOD`, `Barn`, `stripping21r1-dy2mumuline3`) with no trailing recid, which is the same population
as the "10,274 records carry no indexed `recid`" figure seen from the other side.

## Slug ids are aliases, except when they are not

`/record/cms-68283` and `/record/68283` serve the same record — verified by fetching both. 51,732 of the
55,821 slug URLs in the sitemap are aliases of this form, so counting them as records inflates the corpus
from 61,497 to 113,229.

The alias rule that survives testing: **`<prefix>-<N>` is an alias iff `N` is a recid known from ANY
source.** Two narrower rules both failed —

- *any trailing digits* → turned `stripping21r1-dy2mumuline3` into record `"3"`
- *trailing digits in the sitemap's own numeric set* → left 4,085 slugs (`alice-1100`, `atlas-15003`)
  looking like new records, when they alias records only the OAI feed lists numerically

Five records resist every rule: `cms-93957`–`cms-93961`. `/record/cms-93957` returns 200 with the title
"Sign in to CERN", `/record/93957` is 404, and REST returns 0 hits for both forms. **Listed in the public
sitemap, not publicly retrievable, absent from every public API.** Reported, not probed.

## Not established

The portal reports 82,385 records while `type:*` matches 82,375. **Those ten cannot be isolated.** Every
negation the query interface accepts returns HTTP 502, and the one form that answers cannot be trusted:

| query | result |
|---|---|
| `NOT type:*`, `-type:*`, `NOT _exists_:type` | 502 |
| `NOT type.primary:*`, `-type.primary:*`, `type.primary:(NOT *)` | 502 |
| `NOT _exists_:type.primary`, `*:* -type.primary:*` | 502 |
| `_missing_:type` | **0** — indistinguishable from unsupported |

That last row is the important one: a `0` from a syntax the server may simply not implement is not a
measurement, it is a vacuous zero of exactly the kind this document exists to warn about. Set difference
would find them, but only from a full REST enumeration, which the 10,000-offset cap and `robots.txt`
both preclude. **They exist, they are uncharacterised, and the search is exhausted at this access level** —
recorded so it is not repeated.

## What this cost, and the rules that came out of it

The corpus size was answered wrongly twice and the membership wrongly twice more, across five passes.

1. **Corroboration is not correctness.** The broken numeric-only filter returned 82,385 record URLs —
   exactly REST's independently reported total. That agreement is what stopped the checking. A lone
   convenient number still invites scrutiny; a *matching* one closes the question.
2. **A correction gets less scrutiny than what it replaces.** Having found the filter defect, the
   replacement (113,229) shipped 84% too high with no check on what the newly admitted ids were.
3. **A right count with wrong members passes every check that counts and fails every check that
   compares.** 61,497 was correct from the third pass on and never moved, while the membership was
   wrong twice underneath it. Only comparison against a second corpus exposed it.
4. **Sample a partition, not a slice.** A prediction that 9.4% of REST records would fall outside the
   union measured 0 of 250 — because deep paging is capped, so the sample covered 8.5% of the corpus
   from one end. Sampling by *type* found the gap in one request.
