#!/usr/bin/env node
// ONE RESULT, ONE PUBLICATION — across five repositories depositing into one registry.
//
// Two repositories proving the same proposition and minting two DOIs publishes one result twice, and
// neither record knows about the other. A theorem's NAME cannot decide this (names are local and
// namespaced) and neither can its ledger key (an address for one repo's ledger). What is shared is the
// statement, so src/publication computes an address over it that any repository can reproduce from the
// published spec.
//
// WHAT THIS REPORTS AND WHAT IT DOES NOT. A collision is a candidate for a reader, not a verdict: identical
// text can be different propositions when it references namespace-local definitions, and different text can
// be the same proposition. Measured here — six collisions in this tree, four genuine and two of them
// `settledHere = 8` under three different namespaces. Nothing is merged automatically. Publishing a
// duplicate is bad; silently merging two distinct results because their text matched would be worse.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { leanTheorems } from '../src/api/index.ts'
import { statementAddress, STATEMENT_ADDRESS_SPEC, ownFiles } from '../src/publication/index.ts'

const T = leanTheorems()
const own = new Set(ownFiles())

// ── within this repository ──────────────────────────────────────────────────────────────────────────────
const byAddr = new Map<string, typeof T>()
for (const t of T) byAddr.set(statementAddress(t.statement), [...(byAddr.get(statementAddress(t.statement)) ?? []), t])
const dupes = [...byAddr.values()].filter((g) => g.length > 1)

console.log(`  spec: ${STATEMENT_ADDRESS_SPEC}\n`)
if (dupes.length) {
  console.log(`  ○ ${dupes.length} statement(s) appear more than once in this tree — each is a CANDIDATE for review,`)
  console.log(`    because identical text under different namespaces is not one proposition:`)
  for (const g of dupes) {
    const sameNs = new Set(g.map((t) => t.namespace)).size === 1
    console.log(`      ${sameNs ? '✗ same namespace — likely one result under two names' : '· different namespaces — probably distinct'}`)
    for (const t of g) console.log(`          ${t.file} · ${t.namespace || '(none)'}.${t.name}`)
  }
}

// ── against the other repositories, when their ledgers are readable ──────────────────────────────────────
const FUSION = homedir() + '/.erpax/fusion'
if (!existsSync(FUSION)) {
  console.log(`\n  ○ no shared ledger directory — other repositories were NOT checked. That is not the same as`)
  console.log(`    their holding nothing of ours.`)
} else {
  const mine = new Map<string, string>()
  for (const t of T) if (own.has(t.file)) mine.set(statementAddress(t.statement), t.name)
  let hits = 0, scanned = 0
  for (const f of readdirSync(FUSION).filter((x) => x.endsWith('.jsonl') && !x.startsWith('millennium'))) {
    for (const line of readFileSync(`${FUSION}/${f}`, 'utf8').split('\n')) {
      if (!line.trim()) continue
      let o: { claim?: string; name?: string; statement?: string }
      try { o = JSON.parse(line) } catch { continue }
      const c = o.statement ?? o.claim ?? o.name
      if (!c) continue
      scanned++
      const hit = mine.get(statementAddress(c))
      if (hit) { hits++; console.log(`\n  ✗ ${f.replace('.jsonl', '')} states a proposition addressed identically to our \`${hit}\`` ) }
    }
  }
  console.log(`\n  ${hits ? '✗' : '·'} ${scanned} claim(s) across sibling repositories scanned, ${hits} sharing an address with one of ours`)
}

console.log(`\n✓ unique: ${T.length} declarations, ${byAddr.size} distinct statement addresses. A collision is a`)
console.log(`  candidate for a reader and never a merge performed here — the address identifies TEXT, and text`)
console.log(`  is not a proposition in either direction.`)
