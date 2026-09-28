#!/usr/bin/env node
// ACCOUNTING — the real numbers, COMPUTED from the repo at build. Every figure recomputes from src/
// and the git tree; nothing is entered by hand. The page carries its own content-address (change any
// number and the address moves). Integrity, not valuation: a coin proves the bytes, not their worth.
// gitignored (generated at build), so it never enters the tracked content-address and never churns a
// phantom version. Mirrors challenges.ts / dashboard.ts.
import { readdirSync, existsSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'

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
const latest = cap('git describe --tags --abbrev=0', 'v0')
const ledgerTag = cap('git describe --tags --abbrev=0 $(git log -1 --format=%H -- src/proof/discovered.json)', latest)
const files = cap('git ls-files').split('\n').filter(Boolean).length

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
  ['Tracked, content-addressed files', files],
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
