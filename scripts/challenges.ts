#!/usr/bin/env node
// Generate the millennium-challenges + discovered-theorems UI page — COMPUTED from the core, never
// hand-written. The challenge status is cited (Poincaré settled externally); the deposit's own count
// and the discovered theorems are computed from src/proof/discovered.json. gitignored (generated at
// build), so it never enters the content-address and never churns a phantom version.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { toUuid, merkleFold } from '../src/0/index.ts'

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
const ledger: { key: string; name: string; receipt: string }[] =
  existsSync('src/proof/discovered.json') ? JSON.parse(readFileSync('src/proof/discovered.json', 'utf8')) : []

let o = '---\ntitle: Challenges\n---\n\n# Millennium challenges — computed status\n\n'
o += '<NextObserver />\n\n' // when no next is defined, next computes from the observer\'s referrer\n
o += '| # | challenge | status |\n|---|---|---|\n'
CLAY.forEach((c, i) => { o += '| ' + (i + 1) + ' | ' + c.name + ' | ' + (c.status === 'settled' ? 'settled — ' + c.by : 'open') + ' |\n' })
o += '\n**Humanity: ' + settled + ' / 7** (' + open + ' open). **This deposit: 0 / 7** — it settles none of the seven itself.\n\n'
// group by family (the key's first token) so theorems are easy to spot; each is its own monograph page.
const catOf = (k: string) => k.replace(/^REF_/, '').split('_')[0]
const groups: Record<string, typeof ledger> = {}
for (const e of ledger) (groups[catOf(e.key)] ??= []).push(e)
const cats = Object.keys(groups).sort()
const multi = cats.filter((c) => groups[c].length >= 2)
const singles = cats.filter((c) => groups[c].length === 1)
const line = (e: typeof ledger[number]) => '- [' + e.key + '](/theorem/' + e.key + ') — ' + e.name + '  ·  `' + e.receipt.slice(0, 13) + '…`\n'
o += '## Discovered theorems (decidable, over ℤ/9) — ' + ledger.length + ' recorded in ' + cats.length + ' families\n\n'
o += 'Computed by exhaustion, each a monograph with its own page (`/theorem/<key>`) and chained receipt. Grouped by family (largest first) — easy to spot; use the search box for any keyword:\n\n'
for (const c of multi.sort((a, b) => groups[b].length - groups[a].length || a.localeCompare(b))) {
  o += '### ' + c + ' (' + groups[c].length + ')\n\n'
  for (const e of groups[c]) o += line(e)
  o += '\n'
}
o += '### other — one-of-a-kind (' + singles.length + ')\n\n'
for (const c of singles.sort()) o += line(groups[c][0])
o += '\n'
const root = merkleFold(ledger.map((e) => e.receipt).concat(CLAY.map((c) => toUuid(c.name + ':' + c.status))))
o += '\nPage content-address: `' + root + '`. Integrity, not truth — decidable facts and cited status, never a proof of the six open conjectures.\n'
writeFileSync('CHALLENGES.md', o)
console.log('challenges page — humanity ' + settled + '/7, deposit 0/7, ' + ledger.length + ' theorems computed → ' + root.slice(0, 13) + '…')
