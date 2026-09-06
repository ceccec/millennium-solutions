---
title: Provenance — every state change, dated
---

# Provenance of this deposit's ledger

**Recomputed on every build** from git history and the append-only ledger. Regenerate with
`npm run forensic`. Content-address `eeeb52d9-6aaa-8bad-b8fc-cdad16dd7813`.

## What this record establishes

| | |
|---|---:|
| ledger entries | **2,449** |
| standing — proved and sealed | 540 |
| carried — withdrawn, proved by a live theorem | 218 |
| withdrawn — nothing currently proves them | 1,691 |
| receipt chain, recomputed | **0 breaks — intact** |
| commits that changed ledger state | 560 |

## Why entries were withdrawn — the reason recorded at the time

Verbatim, as written when the entry was revoked. Not inferred afterwards.

| withdrawn | reason as recorded |
|---:|---|
| 1,211 | dirty: not backed by a Lean proof. Its evidence is a TypeScript test, which reports that a compu |
| 443 | revoked in place: its test asserted a lexical drain (computes(boast).binary === 0). The word-lis |
| 12 | revoked in place: circular by construction AND dependent on the removed lexical gate. |
| 12 | orphaned: the theorem this key was sealed from is no longer in src/proof. It was deleted or rena |
| 10 | revoked in place: circular by construction — the test defines the answer it checks, proving a de |
| 1 | carried: withdrawn for having only a TypeScript test behind it, and since proved — `euler_units_ |

**1,211** of
**1,691** withdrawn entries — 71.6% —
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
| 2026-09-05 | 7 | `43253e80b` | The self-certifying check knew one NAME, so it missed four — i |
| 2026-09-04 | 4 | `810b378e5` | Prior art: attributed 167, unclassified 303, claimed 0 — and z |

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
