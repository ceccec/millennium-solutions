#!/usr/bin/env node
// SEO self-audit — the deposit audits its own discoverability. Reads the BUILT html (run after
// docs:build). ERRORS (missing required tags) fail the gate; WARNINGS (SERP length heuristics)
// are advisory. All pages fold to ONE place — a single SEO seal (content-address of the state).
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'

const DIST = '.vitepress/dist'
if (!existsSync(DIST)) { console.error('seo: no dist/ — run `npm run docs:build` first.'); process.exit(1) }

// ERRORS — required in <head> (missing → fail)
const HEAD: [string, RegExp][] = [
  ['description', /name="description"/], ['og:title', /property="og:title"/],
  ['og:description', /property="og:description"/], ['og:url', /property="og:url"/],
  ['og:image', /property="og:image"/], ['og:locale', /property="og:locale"/],
  ['twitter:card', /name="twitter:card"/], ['canonical', /rel="canonical"/],
  ['author', /name="author"/], ['robots', /name="robots"/], ['keywords', /name="keywords"/],
  ['json-ld', /application\/ld\+json/],
]
const DOC: [string, RegExp][] = [['html-lang', /<html[^>]*\blang=/]]

const pages = readdirSync(DIST).filter((f) => f.endsWith('.html') && f !== '404.html')
let totalErr = 0, totalWarn = 0
const sigs: string[] = []
for (const p of pages) {
  const html = readFileSync(join(DIST, p), 'utf8')
  const head = html.slice(0, (html.indexOf('</head>') + 1) || html.length)
  const errs = [
    ...HEAD.filter(([, re]) => !re.test(head)).map(([n]) => n),
    ...DOC.filter(([, re]) => !re.test(html)).map(([n]) => n),
  ]
  // WARNINGS — SERP length heuristics (advisory; learn from what Search Console flags)
  const title = (head.match(/<title>([^<]*)<\/title>/) || [])[1] || ''
  const desc = (head.match(/name="description" content="([^"]*)"/) || [])[1] || ''
  const warns: string[] = []
  if (title.length > 60) warns.push('title ' + title.length + '>60 (SERP truncates)')
  if (title.length && title.length < 10) warns.push('title <10 (thin)')
  if (desc.length > 160) warns.push('description ' + desc.length + '>160 (SERP truncates)')
  if (desc.length && desc.length < 50) warns.push('description <50 (thin)')

  if (errs.length) console.log('  ✗ ' + p + '  ERR: ' + errs.join(', '))
  if (warns.length) console.log('  ⚠ ' + p + '  WARN: ' + warns.join(', '))
  totalErr += errs.length; totalWarn += warns.length
  sigs.push(toUuid(p + '|err:' + errs.length + '|warn:' + warns.length))
}

const seoSeal = merkleFold(sigs) // compute towards 1 place: the whole SEO state → one root
console.log('\nSEO: ' + totalErr + ' errors · ' + totalWarn + ' warnings across ' + pages.length + ' pages')
console.log('SEO seal (one place): ' + seoSeal.slice(0, 13) + '…')
console.log(totalErr === 0 ? '✓ SEO self-audit — 0 errors (warnings advisory)' : '✗ SEO errors present — fix before shipping')
process.exit(totalErr === 0 ? 0 : 1)
