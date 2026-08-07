#!/usr/bin/env node
// Language fallback (post-build). The UI is translated for six locales, but deep content
// is English until translated. VitePress's language switcher links every content page to a
// per-locale path (/bg/DEVELOP …) that isn't built. Rather than leave those as dead ends,
// emit a standard fallback stub at each: canonical → the English page, instant redirect,
// noindex+follow (no duplicate content, link equity flows). Every switcher link then
// resolves — "all messages compute true" — while content honestly stays English for now.
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

const DIST = '.vitepress/dist'
const BASE = '/millennium-solutions/'
const LOCALES = ['bg', 'de', 'fr', 'es', 'ru', 'zh']

// English content pages = top-level .html, except 404 and the home index (locale homes exist)
const rootHtml = readdirSync(DIST).filter((n) => n.endsWith('.html') && n !== '404.html' && n !== 'index.html')
let made = 0
for (const code of LOCALES) {
  for (const page of rootHtml) {
    const outPath = join(DIST, code, page)
    if (existsSync(outPath)) continue // a real translated page already exists — never overwrite it
    const url = BASE + page.replace(/\.html$/, '')
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath,
      `<!doctype html><html lang="${code}"><head><meta charset="utf-8">`
      + `<meta name="viewport" content="width=device-width,initial-scale=1">`
      + `<title>English until translated · Millennium Solutions</title>`
      + `<link rel="canonical" href="${url}">`
      + `<meta http-equiv="refresh" content="0; url=${url}">`
      + `<meta name="robots" content="noindex,follow">`
      + `</head><body>This content is English until translated — `
      + `<a href="${url}">continue in English</a>.</body></html>`)
    made++
  }
}
console.log(`locale fallback: ${made} stub(s) → English content (canonical + noindex,follow). No dead ends.`)
