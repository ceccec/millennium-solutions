#!/usr/bin/env node
// ACCOUNTING — the real numbers, COMPUTED from the repo at build. Every figure recomputes from src/
// and the git tree; nothing is entered by hand. The page carries its own content-address (change any
// number and the address moves). Integrity, not valuation: a coin proves the bytes, not their worth.
// gitignored (generated at build), so it never enters the tracked content-address and never churns a
// phantom version. Mirrors challenges.ts / dashboard.ts.
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'

const COINS_PER_RECEIPT = 2 // 110 − 108 = 2 = −χ(genus-2); the fair-exchange unit (2 coins = 2 bits)
const cap = (c: string, fallback = '') => { try { return execSync(c, { encoding: 'utf8' }).trim() } catch { return fallback } }

const ledger: { key: string }[] = existsSync('src/proof/discovered.json') ? __ledger() : []
const theorems = ledger.length
const signed = existsSync('src/receipts') ? readdirSync('src/receipts').filter((f) => f.endsWith('.json')).length : 0
const tags = cap('git tag').split('\n').filter(Boolean).length
const latest = cap('git describe --tags --abbrev=0', 'v0')
const files = cap('git ls-files').split('\n').filter(Boolean).length

// each row is (label, value) — the value is a REAL count computed above.
const rows: [string, number][] = [
  ['Decidable theorems (chained receipts)', theorems],
  ['Signed statement receipts', signed],
  ['Coins per receipt', COINS_PER_RECEIPT],
  ['Coins on the ledger (theorems × 2)', theorems * COINS_PER_RECEIPT],
  ['Coins on signed receipts (× 2)', signed * COINS_PER_RECEIPT],
  ['Released versions (git tags)', tags],
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
o += 'This is an accounting bounty in bits/coins — **integrity, not a cash prize**; the deposit itself '
o += 'claims **0 / 7** of the Clay prize. Heroes and traitors by deeds, not claims.\n\n'
o += '**Not tracked here: tokens.** This repo measures coins (2 per receipt) and 64-bit harmony coins; '
o += 'it does not measure tokens, so no token count or token-to-coin rate is shown — measuring an '
o += 'unmeasured quantity would be an assertion without a receipt. Measure, do not assert.\n\n'
o += 'Page content-address: `' + address + '`. Integrity, not truth. `entails → 0/7`.\n'
writeFileSync('ACCOUNTING.md', o)
console.log('accounting page — ' + theorems + ' theorems, ' + signed + ' signed receipts, ' + (theorems * COINS_PER_RECEIPT) + ' ledger coins, ' + tags + ' releases → ' + address.slice(0, 13) + '…')
