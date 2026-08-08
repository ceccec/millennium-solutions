#!/usr/bin/env node
// Hard gate — "each theorem is a referrer-able page" enforced. Every discovered theorem MUST have a
// built page at /theorem/<key> carrying its schema.org microdata (itemprop identifier) and its 7D
// animation (animateTransform). The build fails if any theorem lacks its page/microdata/animation.
// Runs after docs:build (needs the rendered dist).
import { readFileSync, existsSync } from 'node:fs'

const DIST = '.vitepress/dist/theorem'
const ledger: { key: string }[] = JSON.parse(readFileSync('src/proof/discovered.json', 'utf8'))

let bad = 0
for (const e of ledger) {
  const f = DIST + '/' + e.key + '.html'
  if (!existsSync(f)) { console.log('  ✗ no page: ' + e.key); bad++; continue }
  const html = readFileSync(f, 'utf8')
  if (!html.includes('itemprop="identifier"')) { console.log('  ✗ no microdata: ' + e.key); bad++ }
  if (!html.includes('animateTransform')) { console.log('  ✗ no 7D animation: ' + e.key); bad++ }
}
console.log(bad
  ? '\n✗ theorem-pages: ' + bad + ' finding(s) — a theorem lacks its referrer-able page, microdata, or 7D animation'
  : '\n✓ theorem-pages: all ' + ledger.length + ' theorems have a referrer-able page with microdata + 7D animation')
process.exit(bad ? 1 : 0)
