#!/usr/bin/env node
// Generate the millennium-challenges + discovered-theorems UI page — COMPUTED from the core, never
// hand-written. The challenge status is cited (Poincaré settled externally); the deposit's own count
// and the discovered theorems are computed from src/proof/discovered.json. gitignored (generated at
// build), so it never enters the content-address and never churns a phantom version.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'

const CLAY = [
  { name: 'Poincaré conjecture', status: 'settled', by: 'Perelman, 2003 (external)' },
  { name: 'Riemann hypothesis', status: 'open' },
  { name: 'P vs NP', status: 'open' },
  { name: 'Yang–Mills mass gap', status: 'open' },
  { name: 'Navier–Stokes regularity', status: 'open' },
  { name: 'Hodge conjecture', status: 'open' },
  { name: 'Birch–Swinnerton-Dyer', status: 'open' },
]
const settled = CLAY.filter((c) => c.status === 'settled').length
const open = CLAY.length - settled
const ledger: { key: string; name: string; receipt: string; revoked?: boolean; reason?: string }[] =
  existsSync('src/proof/discovered.json') ? __ledger() : []

let o = '---\ntitle: Challenges\n---\n\n# Millennium challenges — computed status\n\n'
o += '<NextObserver />\n\n' // when no next is defined, next computes from the observer\'s referrer\n
o += '| # | challenge | status |\n|---|---|---|\n'
CLAY.forEach((c, i) => { o += '| ' + (i + 1) + ' | ' + c.name + ' | ' + (c.status === 'settled' ? 'settled — ' + c.by : 'open') + ' |\n' })
o += '\n**Humanity: ' + settled + ' / 7** (' + open + ' open). **This deposit: 0 / 7** — it settles none of the seven itself.\n\n'
// group by family (the key's first token) so theorems are easy to spot; each is its own monograph page.
const catOf = (k: string) => k.replace(/^REF_/, '').split('_')[0]
// The record is append-only: a revoked entry is never deleted (that would break the chain), but it is no
// longer a live theorem, so it is rendered WITHOUT a /theorem/ citation — marked history, with its reason.
const liveL = ledger.filter((e) => !e.revoked)
const goneL = ledger.filter((e) => e.revoked)
const groups: Record<string, typeof ledger> = {}
for (const e of liveL) (groups[catOf(e.key)] ??= []).push(e)
const cats = Object.keys(groups).sort()
const multi = cats.filter((c) => groups[c].length >= 2)
const singles = cats.filter((c) => groups[c].length === 1)
// escape markdown/Vue hazards so a stray angle-tag in a theorem name renders as literal text, never a
// broken build — prose cannot poison the reproducible material.
const esc = (s: string) => s.replace(/</g, '&lt;').replace(/>/g, '&gt;')
const line = (e: typeof ledger[number]) => '- [' + e.key + '](/theorem/' + e.key + ') — ' + esc(e.name) + '  ·  `' + e.receipt.slice(0, 13) + '…`\n'
o += '## Discovered theorems (decidable, over ℤ/9) — ' + ledger.length + ' standing in ' + cats.length + ' families\n\n'
o += 'Computed by exhaustion, each a monograph with its own page (`/theorem/<key>`) and chained receipt. Grouped by family (largest first) — easy to spot; use the search box for any keyword:\n\n'
for (const c of multi.sort((a, b) => groups[b].length - groups[a].length || a.localeCompare(b))) {
  o += '### ' + c + ' (' + groups[c].length + ')\n\n'
  for (const e of groups[c]) o += line(e)
  o += '\n'
}
o += '### other — one-of-a-kind (' + singles.length + ')\n\n'
for (const c of singles.sort()) o += line(groups[c][0])
o += '\n'
if (goneL.length) {
  const why: Record<string, number> = {}
  for (const e of goneL) why[(e.reason ?? 'revoked').split('.')[0]] = (why[(e.reason ?? 'revoked').split('.')[0]] ?? 0) + 1
  o += '\n## Revoked — ' + goneL.length + ' entries that no longer stand\n\n'
  o += 'The ledger is append-only: an entry that stops holding is marked in place, never deleted — deleting would break the receipt chain, and rewriting a receipt is tamper. These keep their receipts and stay in the record, but they are **not citable** and have no `/theorem/` page. Grouped by the reason they went:\n\n'
  for (const [r, n] of Object.entries(why).sort((a, b) => b[1] - a[1])) o += '- **' + n + '** — ' + esc(r) + '\n'
  o += '\n<details><summary>List all ' + goneL.length + ' revoked keys</summary>\n\n'
  for (const e of goneL) o += '- ~~`' + e.key + '`~~ — ' + esc(e.name) + '  ·  `' + e.receipt.slice(0, 13) + '…`\n'
  o += '\n</details>\n'
}

const root = merkleFold(ledger.map((e) => e.receipt).concat(CLAY.map((c) => toUuid(c.name + ':' + c.status))))
o += '\nPage content-address: `' + root + '`. Integrity, not truth — decidable facts and cited status, never a proof of the six open conjectures.\n'
writeFileSync('CHALLENGES.md', o)
console.log('challenges page — humanity ' + settled + '/7, deposit 0/7, ' + ledger.length + ' theorems computed → ' + root.slice(0, 13) + '…')
