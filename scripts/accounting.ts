#!/usr/bin/env node
// ACCOUNTING — the real numbers, COMPUTED from the repo at build. Every figure recomputes from src/
// and the git tree; nothing is entered by hand. The page carries its own content-address (change any
// number and the address moves). Integrity, not valuation: a coin proves the bytes, not their worth.
// gitignored (generated at build), so it never enters the tracked content-address and never churns a
// phantom version. Mirrors challenges.ts / dashboard.ts.
import { readdirSync, existsSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { ledger as __ledger, releasedBefore } from '../src/api/index.ts'

const COINS_PER_RECEIPT = 2 // 110 − 108 = 2 = −χ(genus-2); the fair-exchange unit (2 coins = 2 bits)
const cap = (c: string, fallback = '') => { try { return execSync(c, { encoding: 'utf8' }).trim() } catch { return fallback } }

const ledger: { key: string }[] = existsSync('src/proof/discovered.json') ? __ledger() : []
const theorems = ledger.length
const signed = existsSync('src/receipts') ? readdirSync('src/receipts').filter((f) => f.endsWith('.json')).length : 0
// ── THE RELEASE COUNT IS THE OBSERVER, NOT THE SUBJECT, AND IT POISONED EVERY RELEASE AFTER ONE ──────────
// This counted `git tag` into a COMMITTED document. Minting a tag is what a release DOES, so the moment one
// succeeded this file was stale — the next release regenerated it, found the tree dirty, and scripts/
// release.ts refused to tag against a content-address HEAD does not carry. Correctly. Predicted here before
// it fired, and it fired exactly as described: 925 -> 926 the instant v9.7.8 landed.
//
// Same shape as docs/forensic-audit.json recording its own commit: a derived file whose value the act of
// deriving-and-shipping changes has no fixed point. There the fix was to record the SUBJECT — the last commit
// that touched the ledger. Here the subject is the ledger too: releases are counted as of the tag that was
// current when the LEDGER last moved, which a release of documents does not change.
//
// The live count is still printed to the console and still on the site, which rebuilds every deploy. What
// leaves the committed document is only the number that cannot be committed.
const tags = cap('git tag').split('\n').filter(Boolean).length
// the release BEFORE this commit (src/api releasedBefore): a tag at HEAD is the one the runner is minting right now
const latest = releasedBefore()
// the same exclusion for the tag that last moved the ledger: a describe from that commit would pick a tag at HEAD on the runner
const excludeAtHead = cap('git tag --points-at HEAD').split('\n').filter(Boolean).map((t) => `--exclude='${t}'`).join(' ')
// AND WHILE THE LEDGER IS UNCOMMITTED, ITS LAST CHANGE IS THE COMMIT ABOUT TO BE MADE. Read from `git log` alone, a page
// generated before sealing named the tag before the PREVIOUS ledger commit (v9.8.6) and the same page checked after the
// commit named v9.8.8 — so every octave sealed made this page stale, and the push refused v9.8.9 on it. The commit that
// will carry the change has HEAD as its parent, so the release before it is `latest`: a fixed point either side.
const ledgerDirty = cap('git status --porcelain -- src/proof/discovered.json') !== ''
const ledgerTag = ledgerDirty ? latest : cap(`git describe --tags --abbrev=0 ${excludeAtHead} $(git log -1 --format=%H -- src/proof/discovered.json)`, latest)
// tracked PLUS what `git add -A` is about to track: the chain regenerates this page and then commits new files it made in
// the same run (a constants snapshot under a new handle), so a count of tracked files alone moved by 2 across the commit it
// rode in, and the pre-push regeneration refused the push (2026-11-03). Counting the not-ignored set is stable across that commit.
// A FIGURE ABOUT THE OBSERVER, NOT THE SUBJECT. The count of files in this repository changes with the very commit that
// records it (the chain adds a constants snapshot in the same run) and with what a given machine leaves untracked (a
// release runner refused the tag push on 2026-11-03 over exactly this row, after the chain's own commit had moved it by
// 2 the day before). It is printed to the console and left out of the committed page, as the live count was before it.
const files = cap('git ls-files --cached --others --exclude-standard').split('\n').filter(Boolean).length
console.log(`  files in the not-ignored set on this machine: ${files} (console only — an observer figure, not committed)`)

// each row is (label, value), and every value is MEASURED above — never typed here. Most are counts; the
// released-version row is the tag that last moved the ledger, which is a name rather than a number, so the
// row type says so instead of the tag being coerced into looking like a count.
const rows: [string, number | string][] = [
  ['Decidable theorems (chained receipts)', theorems],
  ['Signed statement receipts', signed],
  ['Coins per receipt', COINS_PER_RECEIPT],
  ['Coins on the ledger (theorems × 2)', theorems * COINS_PER_RECEIPT],
  ['Coins on signed receipts (× 2)', signed * COINS_PER_RECEIPT],
  ['Released versions (as of the last ledger change)', ledgerTag],
]
const address = merkleFold(rows.map(([k, v]) => toUuid(k + ':' + v)))

let o = '---\ntitle: Accounting\n---\n\n# Accounting — the real numbers, computed\n\n'
o += 'Every figure recomputes from `src/` and the git tree on each build; nothing is entered by hand. '
o += 'This page carries its own content-address — change any number and the address moves. '
o += '**Integrity, not valuation:** a coin proves the bytes, not their worth.\n\n'
o += '| Quantity | Value |\n|---|---|\n'
for (const [k, v] of rows) o += '| ' + k + ' | **' + v.toLocaleString('en-US') + '** |\n'
o += '\nLatest release: **' + latest + '**. The fair-exchange unit is **2 coins = 2 bits** '
o += '(110 − 108 = 2 = −χ genus-2) per receipt. One 64-bit harmony coin is minted per fused `src` '
o += '`report()` module — see the [state dashboard](/dashboard) for the harmonic root.\n\n'
o += '## Bounty — denominated in bits\n\n'
o += 'The bounty for each accepted contribution is **2 bits (2 coins)** — the same fair-exchange unit, '
o += 'earned by the deed (a gate-passing, receipted contribution) and owed by commercial use. '
o += 'Total bounty accounted on the ledger so far: **' + (theorems * COINS_PER_RECEIPT).toLocaleString('en-US') + ' bits**. '
o += 'This is an accounting bounty in bits/coins — **integrity, not a cash prize**. Heroes and traitors by deeds, not claims.\n\n'
o += '**Not tracked here: tokens.** This repo measures coins (2 per receipt) and 64-bit harmony coins; '
o += 'it does not measure tokens, so no token count or token-to-coin rate is shown — measuring an '
o += 'unmeasured quantity would be an assertion without a receipt. Measure, do not assert.\n\n'
o += 'Page content-address: `' + address + '`. Integrity, not truth.\n'
writeFileSync('ACCOUNTING.md', o)
console.log('accounting page — ' + theorems + ' theorems, ' + signed + ' signed receipts, ' + (theorems * COINS_PER_RECEIPT) + ' ledger coins, ' + tags + ' releases → ' + address.slice(0, 13) + '…')
