#!/usr/bin/env node
// Language fallback (post-build). The UI is translated for six locales, but deep content
// is English until translated. VitePress's language switcher links every content page to a
// per-locale path (/bg/DEVELOP …) that isn't built. Rather than leave those as dead ends,
// emit a standard fallback stub at each: canonical → the English page, instant redirect,
// noindex+follow (no duplicate content, link equity flows). Every switcher link then
// resolves — "all messages compute true" — while content honestly stays English for now.
import { statSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { CSP } from '../src/0/csp.ts'
import { LOCALES as CHROME } from '../src/7/locale.ts' // the verified per-locale UI table (fallback strings)

const DIST = '.vitepress/dist'
const BASE = '/millennium-solutions/'
const LOCALES = ['bg', 'de', 'fr', 'es', 'ru', 'zh']
// CSP imported from the single source (src/0/csp.ts) — stubs carry the SAME policy, no drift.

// English content pages, DERIVED FROM THE BUILT TREE rather than named. This listed two kinds — top-level
// .html plus /theorem/<key> — and every content page in any OTHER directory still rendered a language
// switcher pointing at locale paths the fold never built. docs/ was the live case: three pages there each
// linked to six non-existent locale routes, 18 broken links, and adding docs/CERN-ENUMERATION.md today made
// it 18 from 12 without a word, because sitemap-mesh runs in the release chain and not in ci:local.
//
// The fold's domain has to cover everywhere a switcher can appear, and a switcher appears on every content
// page. Walking the tree means a new directory of pages is covered the day it is built, rather than the day
// someone remembers this list.
const walk = (dir: string, prefix = ''): string[] => {
  const out: string[] = []
  for (const n of readdirSync(dir)) {
    const rel = prefix + n
    const full = join(dir, n)
    if (statSync(full).isDirectory()) {
      // locale outputs are what this script WRITES; assets carry no switcher
      if (prefix === '' && (LOCALES.includes(n) || n === 'assets')) continue
      out.push(...walk(full, rel + '/'))
    } else if (n.endsWith('.html') && rel !== '404.html' && rel !== 'index.html') {
      out.push(rel)
    }
  }
  return out
}
const pages = walk(DIST)
let made = 0
for (const code of LOCALES) {
  for (const page of pages) {
    const outPath = join(DIST, code, page)
    if (existsSync(outPath)) continue // a real translated page already exists — never overwrite it
    const url = BASE + page.replace(/\.html$/, '')
    const chrome = CHROME[code as keyof typeof CHROME]
    const fb = chrome.fallback // localized "English until translated" notice + call-to-action
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath,
      `<!doctype html><html lang="${code}"><head><meta charset="utf-8">`
      + `<meta http-equiv="Content-Security-Policy" content="${CSP}">`
      + `<meta name="viewport" content="width=device-width,initial-scale=1">`
      + `<title>${fb.notice} · ${chrome.title}</title>`
      + `<link rel="canonical" href="${url}">`
      + `<meta http-equiv="refresh" content="0; url=${url}">`
      + `<meta name="robots" content="noindex,follow">`
      + `</head><body>${fb.notice} — `
      + `<a href="${url}">${fb.cta}</a>.</body></html>`)
    made++
  }
}
console.log(`locale fallback: ${made} stub(s) → English content (canonical + noindex,follow). No dead ends.`)
