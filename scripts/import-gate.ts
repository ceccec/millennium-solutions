#!/usr/bin/env node
// External-import gate — FAIL the build if any page loads a THIRD-PARTY resource.
// Blocks external script / stylesheet / preload / font / img / media / iframe / @import.
// ALLOWS: <a href> navigation links (DOI, GitHub, donation), <meta property=og:image>, rel=canonical/
// alternate (metadata), and same-origin resources. This is the deterministic "block external at the gate"
// — stronger than the meta-CSP (which the browser enforces but GitHub Pages can't set as a header).
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIST = '.vitepress/dist'
if (!existsSync(DIST)) { console.error('import-gate: no dist/ — run `npm run docs:build` first.'); process.exit(1) }

const SELF = /^https?:\/\/(ceccec\.psg\.bg|ceccec\.github\.io|localhost(:\d+)?)(\/|$)/i
const isExternal = (url: string) => /^https?:\/\//i.test(url) && !SELF.test(url)
const RESOURCE_REL = /stylesheet|preload|prefetch|modulepreload|(^|\s)icon|apple-touch-icon|manifest/

function scan(html: string): string[] {
  const hits: string[] = []
  // resource tags with src=
  for (const m of html.matchAll(/<(script|img|source|video|audio|track|embed|iframe)\b[^>]*\bsrc="([^"]+)"/gi))
    if (isExternal(m[2])) hits.push(m[1] + ' src=' + m[2])
  // <link rel=RESOURCE href=…> (both attribute orders); resource rels only, NOT canonical/alternate/dns-prefetch
  for (const m of html.matchAll(/<link\b[^>]*>/gi)) {
    const tag = m[0]
    const rel = (tag.match(/\brel="([^"]+)"/i)?.[1] || '').toLowerCase()
    const href = tag.match(/\bhref="([^"]+)"/i)?.[1] || ''
    if (RESOURCE_REL.test(rel) && isExternal(href)) hits.push('link rel=' + rel + ' href=' + href)
  }
  // @import / url(…) inside inline styles
  for (const m of html.matchAll(/(?:@import\s+|url\(\s*)["']?([^"')\s]+)/gi))
    if (isExternal(m[1])) hits.push('css-import ' + m[1])
  return [...new Set(hits)]
}

const pages = readdirSync(DIST, { recursive: true }).map(String).filter((f) => f.endsWith('.html'))
let total = 0
for (const p of pages) {
  const hits = scan(readFileSync(join(DIST, p), 'utf8'))
  if (hits.length) { console.log('  ✗ ' + p + '  EXTERNAL: ' + hits.join(' · ')); total += hits.length }
}
console.log('\nimport-gate: ' + pages.length + ' pages scanned · ' + total + ' external resource-import(s)')
console.log(total === 0
  ? '✓ no external imports — pages load only self-origin resources (links out are allowed).'
  : '✗ external imports present — inline or self-host them, or the gate blocks the build.')
process.exit(total === 0 ? 0 : 1)
