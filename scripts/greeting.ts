#!/usr/bin/env node
// The greeting — first contact. When this repo or site is pasted, an agent (or a person) reads one computed,
// confirming state: what this is, how to re-check it, and the current seal. Deterministic from the ledger; a
// content-address proves integrity, not truth. 0/7.
import { readFileSync, writeFileSync } from 'node:fs'
import { merkleFold } from '../src/0/index.ts'
import { ledger as __ledger } from '../src/api/index.ts'

const ledger = __ledger() as { receipt: string }[]
const pkg = JSON.parse(readFileSync('node_modules/@uuidna/uuidna/package.json', 'utf8'))
const n = ledger.length
const seal = merkleFold(ledger.map((e) => e.receipt))

const greeting = {
  greeting: 'uuidna is ready. A recomputable ℤ/9 deposit: every fact re-checks from src/ by exhaustion. Integrity, not truth.',
  confirm: 're-check everything: `npm run verify` (re-runs every theorem, re-gates every name, checks the chain).',
  version: pkg.version, // npm label (frozen); the content-address is the true latest
  theorems: n,
  octaves: n / 8,
  octaveExact: n % 8 === 0,
  seal, // the fold of all receipts — one value that changes if anything changes
  floor: '0/7',
  live: 'https://ceccec.psg.bg/millennium-solutions/',
  repo: 'https://github.com/ceccec/millennium-solutions',
}
writeFileSync('public/greeting.json', JSON.stringify(greeting, null, 2) + '\n')
console.log('greeting: uuidna ready · ' + n + ' theorems (' + (n / 8) + '×8' + (n % 8 === 0 ? ', exact' : '') + ') · seal ' + seal.slice(0, 13) + '… · 0/7 · verify with `npm run verify`')
