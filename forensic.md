---
title: Every state change, dated
---

# Provenance of this deposit's ledger

**Recomputed on every build** from git history and the append-only ledger. Regenerate with
`npm run forensic`. Content-address `bcac0cf7-3a5d-8a03-a42d-15ac4356d540`.

## What this record establishes

| | |
|---|---:|
| ledger entries | **2,880** |
| standing — proved and sealed | 924 |
| carried — withdrawn, proved by a live theorem | 435 |
| withdrawn — nothing currently proves them | 1,521 |
| receipt chain, recomputed | **0 breaks — intact** |
| commits that changed ledger state | 599 |

## Why entries were withdrawn — the reason recorded at the time

Verbatim, as written when the entry was revoked. Not inferred afterwards.

| withdrawn | reason as recorded |
|---:|---|
| 1,011 | dirty: not backed by a Lean proof. Its evidence is a TypeScript test, which reports that a compu |
| 443 | revoked in place: its test asserted a lexical drain (computes(boast).binary === 0). The word-lis |
| 35 | orphaned: the theorem this key was sealed from is no longer in src/proof. It was deleted or rena |
| 12 | revoked in place: circular by construction AND dependent on the removed lexical gate. |
| 10 | revoked in place: circular by construction — the test defines the answer it checks, proving a de |
| 7 | renamed to what it decides (2026-09-18, by the author's order). The theorem carried a Clay probl |

**1,011** of
**1,521** withdrawn entries — 66.5% —
were withdrawn for want of a Lean proof while their evidence was a TypeScript test that **computed**.
Withdrawal costs one line of record; proving costs real work, and a green gate rewards both identically.

At least one of them was recoverable: `thue_morse_doubling_recurrence` was withdrawn as having
"no stated decidable form yet", and was proved in twenty lines on 2026-09-05. Its reason was false of it.

## Largest single-commit state changes

| date | net withdrawn | commit | subject |
|---|---:|---|---|
| 2026-08-20 | 1,864 | `e6bb01bb5` | gates: green the three that were red — by fixing the authority |
| 2026-08-20 | 25 | `959f8af2a` | lean: verify once instead of twice, and cache what the kernel  |
| 2026-09-04 | 24 | `5d319470d` | Item 12 executed: 24 duplicate addresses retired, and it broke |
| 2026-09-14 | 19 | `1c1b53f9a` | Nineteen more certificates become laws — the energy, speed, li |
| 2026-09-07 | 13 | `301c67798` | `namespace Classical` shadowed Lean's, in a deposit whose stan |

## What this record does NOT establish

**It does not establish intent.** It records what changed, when, and the reason written at the time.
Whether a change was a mistake, a judgement call, a shortcut or something worse is not a thing this or
any instrument can measure, and a record claiming otherwise would be worth less than one that says so.

**It does not establish authorship** beyond the git author field. Every commit here carries the
repository owner, including those made by automated sessions acting on their behalf, so that field
distinguishes nothing and is reported as such rather than presented as evidence.

**Net deltas hide compensating changes.** The largest withdrawal event above is not a deletion commit:
it changed 55 files with 24,661 insertions and added 174 Lean theorems in the same change, and its own
message records that six dangling claims were proved rather than dropped. A record assembled to support
one reading would be the same defect as a check that cannot fail.

*Integrity, not truth. A content-address fixes which record was produced, not that its subject is significant.*
