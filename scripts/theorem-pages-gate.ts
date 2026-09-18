#!/usr/bin/env node
// Hard gate — "each theorem is a referrer-able page" enforced. Every discovered theorem MUST have a
// built page at /theorem/<key> carrying its schema.org microdata (itemprop identifier) and its 7D
// animation (animateTransform). The build fails if any theorem lacks its page/microdata/animation.
// Runs after docs:build (needs the rendered dist).
//
// AND IT MUST NOT BLAME THE LEDGER FOR AN UNRUN BUILD. Sealing two theorems once left dist far behind the
// ledger, and this printed a finding per missing key — a list that reads as hundreds of theorems with
// something wrong with them. Nothing was wrong with any of them; the build had not been run since the
// ledger grew. A gate reporting the state of its own prerequisite as a defect of its subject is the failure
// the rest of this repository's instruments were corrected for this week. (No count is written here: a
// figure in a comment is a claim about the present, and stale-figures reads it as one.)
//
// The two are told apart WITHOUT a flag anyone has to set, because the ledger is append-only: a stale build
// has pages for a PREFIX of it and none after, while a genuine defect is a HOLE — a key with no page that
// has a later key with one. So the missing keys are split at the last key that does have a page.
import { readFileSync, existsSync } from 'node:fs'
import { ledger as __ledger } from '../src/api/index.ts'

const DIST = '.vitepress/dist/theorem'
const ledger: { key: string }[] = __ledger()

const present = ledger.map((e) => existsSync(DIST + '/' + e.key + '.html'))
const built = present.lastIndexOf(true)                     // -1 when nothing is built at all
const holes = ledger.filter((_, i) => !present[i] && i < built)   // missing, with a later page — a real defect
const tail = ledger.filter((_, i) => !present[i] && i > built)    // missing, and nothing after — the build is behind

let bad = 0
for (const e of holes) { console.log('  ✗ no page: ' + e.key); bad++ }
for (const [i, e] of ledger.entries()) {
  if (!present[i]) continue
  const html = readFileSync(DIST + '/' + e.key + '.html', 'utf8')
  if (!html.includes('itemprop="identifier"')) { console.log('  ✗ no microdata: ' + e.key); bad++ }
  if (!html.includes('animateTransform')) { console.log('  ✗ no 7D animation: ' + e.key); bad++ }
}

// THE PREREQUISITE, REPORTED AS ONE LINE ABOUT THE BUILD — never as N lines about N theorems.
if (tail.length) {
  console.log(built < 0
    ? '\n✗ theorem-pages: nothing is built — ' + DIST + ' holds no page for any of the ' + ledger.length + ' ledger entries.'
    : '\n✗ theorem-pages: the build is ' + tail.length + ' entr' + (tail.length === 1 ? 'y' : 'ies') + ' behind the ledger — pages stop at '
      + ledger[built].key + ' and the ' + tail.length + ' sealed after it have none.')
  console.log('  This is the state of the BUILD, not a defect in those theorems: run `npm run docs:build`')
  console.log('  and run this again. ' + (bad ? bad + ' finding(s) above are about pages that ARE built.' : 'Nothing is wrong with any page that is built.'))
  process.exit(1)
}

console.log(bad
  ? '\n✗ theorem-pages: ' + bad + ' finding(s) — a theorem lacks its referrer-able page, microdata, or 7D animation'
  : '\n✓ theorem-pages: all ' + ledger.length + ' theorems have a referrer-able page with microdata + 7D animation')
process.exit(bad ? 1 : 0)
