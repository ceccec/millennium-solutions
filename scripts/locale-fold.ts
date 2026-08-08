#!/usr/bin/env node
// Language fallback (post-build). The UI is translated for six locales, but deep content
// is English until translated. VitePress's language switcher links every content page to a
// per-locale path (/bg/DEVELOP …) that isn't built. Rather than leave those as dead ends,
// emit a standard fallback stub at each: canonical → the English page, instant redirect,
// noindex+follow (no duplicate content, link equity flows). Every switcher link then
// resolves — "all messages compute true" — while content honestly stays English for now.
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { CSP } from '../src/0/csp.ts'
import { LOCALES as CHROME } from '../src/7/locale.ts' // the verified per-locale UI table (fallback strings)

const DIST = '.vitepress/dist'
const BASE = '/millennium-solutions/'
const LOCALES = ['bg', 'de', 'fr', 'es', 'ru', 'zh']
// CSP imported from the single source (src/0/csp.ts) — stubs carry the SAME policy, no drift.

// English content pages = top-level .html, except 404 and the home index (locale homes exist),
// PLUS the dynamic /theorem/<key> pages (the language switcher links to a per-locale path for each).
const rootHtml = readdirSync(DIST).filter((n) => n.endsWith('.html') && n !== '404.html' && n !== 'index.html')
const theoremHtml = existsSync(join(DIST, 'theorem'))
  ? readdirSync(join(DIST, 'theorem')).filter((n) => n.endsWith('.html')).map((n) => 'theorem/' + n)
  : []
const pages = [...rootHtml, ...theoremHtml]
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
