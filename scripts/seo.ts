#!/usr/bin/env node
// SEO self-audit — the deposit checks its own discoverability. Reads the BUILT html (run after
// docs:build) and verifies every page carries the required SEO/OpenGraph/structured-data tags.
// Fails loudly if any page regresses. A gate like gaps/seal/wholeness, for discoverability.
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIST = '.vitepress/dist'
if (!existsSync(DIST)) { console.error('seo: no dist/ — run `npm run docs:build` first.'); process.exit(1) }

const REQUIRED: [string, RegExp][] = [
  ['description', /name="description"/],
  ['og:title', /property="og:title"/],
  ['og:description', /property="og:description"/],
  ['og:url', /property="og:url"/],
  ['og:image', /property="og:image"/],
  ['twitter:card', /name="twitter:card"/],
  ['canonical', /rel="canonical"/],
  ['author', /name="author"/],
  ['keywords', /name="keywords"/],
  ['json-ld', /application\/ld\+json/],
]

const pages = readdirSync(DIST).filter((f) => f.endsWith('.html') && f !== '404.html')
let fails = 0
for (const p of pages) {
  const html = readFileSync(join(DIST, p), 'utf8')
  const head = html.slice(0, html.indexOf('</head>') + 1 || html.length)
  const missing = REQUIRED.filter(([, re]) => !re.test(head)).map(([n]) => n)
  if (missing.length) { console.log('  ✗ ' + p + ' — missing: ' + missing.join(', ')); fails++ }
}
console.log(fails === 0
  ? '✓ SEO self-audit — all ' + pages.length + ' pages carry OpenGraph · Twitter · canonical · JSON-LD · description'
  : '\n✗ ' + fails + ' page(s) with SEO gaps')
process.exit(fails === 0 ? 0 : 1)
