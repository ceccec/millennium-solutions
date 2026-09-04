#!/usr/bin/env node
// A FIGURE WRITTEN IN THE PRESENT TENSE MUST STILL BE TRUE.
//
// The `settledHere` defect — a hand-typed count beside generated content, drifting one way because the tree
// only grows — was fixed in the Lean files this morning and left standing everywhere else. Comments across
// src/ and scripts/ carry counts of theorems, declarations, live keys and ledger entries, and some of them
// describe a tree that no longer exists. `src/api/index.ts` said "24 theorems carry two" keys hours after
// those 24 duplicate addresses were retired: the API's own documentation describing a condition its author
// had removed.
//
// HISTORY IS NOT STALENESS, and separating them is the whole difficulty. "Measured before this existed: all
// 2425 theorem pages carried one identical blob" is TRUE and must stay — it records what was found, and
// rewriting it to today's number would destroy the finding. "1757 entries are withdrawn" is a claim about
// now, and now it is 1748.
//
// So the test is TENSE, not the number. A figure inside a sentence that marks itself as past — measured,
// was, had, before, until, earlier, at the time, then — is left alone. A figure asserting the present is
// checked against the tree.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { census, ledger, leanFiles, statusOf } from '../src/api/index.ts'

const C = census(), L = ledger()
const TRUTH: Record<string, number> = {
  theorems: C.byDecide,
  declarations: C.theorems,
  'live keys': L.filter((e) => !e.revoked).length,
  entries: L.length,
  receipts: L.length,
  withdrawn: L.filter((e) => statusOf(e, L) === 'withdrawn').length,
  carried: L.filter((e) => statusOf(e, L) === 'carried').length,
  files: leanFiles().length,
}
const NOUN = /\b(\d[\d,]{1,6})\s+(theorems?|declarations?|live keys?|entries|receipts?|withdrawn|carried|files)\b/gi
// Marks the sentence as a record of the past rather than a claim about now.
// WIDENED AFTER MEASURING ITS OWN ACCURACY: the first version flagged 8 and 6 were false. "it returned
// UNVERIFIED for all 2184 entries" is a past run; "at 1024 theorems the merkle tree is balanced" is a
// conditional about a milestone, not a count; "uuidna's own corpus (1329 theorems)" is about ANOTHER
// repository. Markers widened, and the script REPORTS rather than fails — a 75% false-positive rate is not
// something to gate a build on, and the same rate in the carry matcher was why that one reports too.
const PAST = /\b(measured|was|were|had|before|until|earlier|at the time|then|used to|once|previously|no longer|first draft|it said|said|returned|sat|stood|reported|this line|uuidna|another repo)\b/i
// A figure inside "at N theorems, X holds" states a condition, not a census.
const CONDITIONAL = /\b(at|reaches?|when|if|once)\s+[\d,]+\s+(theorems?|declarations?|entries|receipts?)\b/i

const files: string[] = []
const walk = (d: string) => {
  for (const e of readdirSync(d)) {
    if (['node_modules', '.git', '.vitepress', 'dist', '.lake', '.zenodo', 'fixtures'].includes(e)) continue
    const p = `${d}/${e}`
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(ts|lean)$/.test(e)) files.push(p)
  }
}
walk('src'); walk('scripts')

let bad = 0, history = 0, checked = 0
for (const f of files) {
  if (f.endsWith('stale-figures.ts')) continue
  const lines = readFileSync(f, 'utf8').split('\n')
  lines.forEach((line, i) => {
    if (!/^\s*(--|\/\/|\*|\/\*)/.test(line)) return
    for (const m of line.matchAll(NOUN)) {
      const n = Number(m[1].replace(/,/g, ''))
      const key = m[2].toLowerCase().replace(/s$/, '').replace('live key', 'live keys')
      const truth = TRUTH[key] ?? TRUTH[key + 's'] ?? TRUTH[m[2].toLowerCase()]
      if (truth === undefined) continue
      checked++
      if (n === truth) continue
      // A neighbouring line may carry the past marker; a sentence wraps.
      const ctx = [lines[i - 1] ?? '', line, lines[i + 1] ?? ''].join(' ')
      if (PAST.test(ctx) || CONDITIONAL.test(ctx)) { history++; continue }
      console.log(`  ✗ ${f}:${i + 1}`)
      console.log(`      "${m[0]}" asserted in the present — ${key} is ${truth.toLocaleString('en')}`)
      bad++
    }
  })
}

console.log(bad
  ? `\n○ stale-figures: ${bad} figure(s) claim a present that has moved (${history} historical, left alone; ${checked} checked)`
  : `\n✓ stale-figures: ${checked} figure(s) in comments across ${files.length} files agree with the tree, and ${history} more`
    + `\n  are marked as records of the past and left as written — rewriting those to today's number would destroy`
    + `\n  the finding they record.`)
// Reports; does not fail. See the note on the PAST marker above.
process.exit(0)
