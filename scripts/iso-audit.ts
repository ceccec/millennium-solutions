#!/usr/bin/env node
// ISO AUDIT — the built site against every ISO standard whose requirements a machine can check, read from the built html
// (run after docs:build), the way scripts/seo.ts audits discoverability.
//
// What a machine can check is checked, per page, and a failure fails the gate. What it cannot — colour contrast,
// meaningful alt text, a management system — is reported NOT MEASURED with the reason, never as a pass. No code list is
// typed: languages, regions and currencies are the runtime's own ISO 639 / ISO 3166 / ISO 4217 data (Intl), so a code
// is valid exactly when the platform's registry knows it.
//
//   node scripts/iso-audit.ts            audit .vitepress/dist
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const DIST = '.vitepress/dist'
if (!existsSync(DIST)) { console.log('NOT MEASURED — no built site; run npm run docs:build first'); process.exit(2) }
const walk = (d: string): string[] => readdirSync(d).flatMap((e) => { const p = join(d, e); return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [] })
const pages = walk(DIST).filter((p) => !p.endsWith('404.html'))

const languages = new Intl.DisplayNames(['en'], { type: 'language', fallback: 'none' })
const regions = new Intl.DisplayNames(['en'], { type: 'region', fallback: 'none' })
const currencies = new Set(Intl.supportedValuesOf('currency'))
/** a BCP 47 tag whose language is ISO 639 and whose region, if any, is ISO 3166 */
const validTag = (tag: string): boolean => {
  const [lang, region] = tag.split('-')
  return /^[a-z]{2,3}$/.test(lang) && languages.of(lang) !== undefined && (!region || (/^[A-Z]{2}$/.test(region) && regions.of(region) !== undefined))
}
const ISO8601 = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})?)?$/
const DOI = /\b10\.\d{4,9}\/[^\s"'<>]+/g

type Check = { standard: string; clause: string; checked: number; failed: string[] }
type Checks = Map<string, Check>
const record = (checks: Checks, standard: string, clause: string, page: string, ok: boolean, what = '') => {
  const k = `${standard} · ${clause}`
  const c = checks.get(k) ?? { standard, clause, checked: 0, failed: [] }
  c.checked++
  if (!ok) c.failed.push(`${page.replace(DIST + '/', '')}${what ? ` — ${what}` : ''}`)
  checks.set(k, c)
}

/** every machine-checkable requirement, on one page */
const auditPage = (checks: Checks, p: string, html: string) => {
  const check = (standard: string, clause: string, page: string, ok: boolean, what = '') => record(checks, standard, clause, page, ok, what)
  const lang = html.match(/<html[^>]*\slang="([^"]*)"/)?.[1] ?? ''
  check('ISO 639 / ISO 3166 (BCP 47)', 'the page declares a valid language tag', p, validTag(lang), lang || 'no lang')
  for (const m of html.matchAll(/hreflang="([^"]+)"/g)) if (m[1] !== 'x-default') check('ISO 639 / ISO 3166 (BCP 47)', 'every hreflang is a valid tag', p, validTag(m[1]), m[1])

  // ISO/IEC 40500:2012 is WCAG 2.0, adopted as an International Standard; its machine-checkable success criteria
  check('ISO/IEC 40500 (WCAG 2.0)', '2.4.2 page titled', p, /<title>[^<]+<\/title>/.test(html))
  // 3.1.1 asks that the language be programmatically determined: present AND a tag a machine can resolve
  check('ISO/IEC 40500 (WCAG 2.0)', '3.1.1 language of page', p, lang !== '' && validTag(lang), lang || 'no lang')
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) check('ISO/IEC 40500 (WCAG 2.0)', '1.1.1 non-text content has a text alternative', p, /\salt="/.test(img), img.slice(0, 80))
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  const dup = ids.filter((id, i) => ids.indexOf(id) !== i)
  check('ISO/IEC 40500 (WCAG 2.0)', '4.1.1 parsing — no duplicate id', p, dup.length === 0, [...new Set(dup)].slice(0, 3).join(', '))
  for (const a of html.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) ?? []) {
    const text = a.replace(/<[^>]+>/g, '').trim()
    check('ISO/IEC 40500 (WCAG 2.0)', '2.4.4 every link has discernible text', p, text !== '' || /aria-label="[^"]+"|title="[^"]+"|<img[^>]+alt="[^"]+"/.test(a), a.slice(0, 80))
  }

  // ISO 8601 dates in structured data
  for (const m of html.matchAll(/"(date(?:Published|Modified|Created)|uploadDate)"\s*:\s*"([^"]+)"/g)) check('ISO 8601', 'every structured date is ISO 8601', p, ISO8601.test(m[2]), `${m[1]} ${m[2]}`)
  // ISO 4217 currencies in structured data
  for (const m of html.matchAll(/"(?:priceCurrency|currency)"\s*:\s*"([^"]+)"/g)) check('ISO 4217', 'every currency is an ISO 4217 code', p, currencies.has(m[1]), m[1])
  // ISO 26324 — every DOI on the page has DOI syntax: prefix 10.<registrant>/<suffix>
  for (const m of html.matchAll(DOI)) check('ISO 26324 (DOI)', 'every DOI has the 10.<registrant>/<suffix> syntax', p, /^10\.\d{4,9}\/\S+$/.test(m[0].replace(/[.,;)]+$/, '')), m[0])
  // ISO/IEC 27002 technical controls a page can evidence: a content-security policy and no mixed content
  check('ISO/IEC 27002 (technical controls)', '8.26 a content-security policy is declared', p, /http-equiv="Content-Security-Policy"/.test(html))
  check('ISO/IEC 27002 (technical controls)', '8.24 no resource loaded over plain http', p, !/\s(?:src|href)="http:\/\//.test(html))
}

// THE CONTROL — one synthetic page breaking every requirement above must fail every one of them, or the audit is blind
const BAD = '<html lang="zz-QQ"><head><title></title><link rel="alternate" hreflang="qq"><script type="application/ld+json">'
  + '{"datePublished":"9 Nov 2026","priceCurrency":"XYZ"}</script></head><body><img src="a.png"><p id="x"></p><p id="x"></p>'
  + '<a href="/y"></a><img src="http://e.com/b.png" alt="b">10.12/x</body></html>'
const control: Checks = new Map()
auditPage(control, 'CONTROL', BAD)
const blind = [...control.values()].filter((c) => c.failed.length === 0)
if (blind.length) { console.error(`✗ ISO audit control: ${blind.length} check(s) passed a page built to fail them — ${blind.map((c) => c.clause).join('; ')}`); process.exit(1) }

const checks: Checks = new Map()
for (const p of pages) auditPage(checks, p, readFileSync(p, 'utf8'))

// ISO 8601 in the sitemap
const sitemap = join(DIST, 'sitemap.xml')
if (existsSync(sitemap)) for (const m of readFileSync(sitemap, 'utf8').matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) record(checks, 'ISO 8601', 'every sitemap lastmod is ISO 8601', sitemap, ISO8601.test(m[1]), m[1])

const NOT_MEASURED = [
  ['ISO/IEC 40500 (WCAG 2.0)', '1.4.3 contrast, 1.1.1 whether alt text is meaningful, 2.1.1 keyboard operation — need rendering and judgment, not markup'],
  ['ISO/IEC 27001', 'an information security management system is an organisation\'s process, certified by audit — no page can evidence it'],
  ['ISO/IEC 25010', 'product quality characteristics are assessed against stated requirements by evaluation, not read from html'],
  ['ISO/IEC 4879', 'the quantum vocabulary is realised in src/quantum/terminology.ts (all 86 terms, each a coin) — audited there, not per page'],
]

let failed = 0
console.log(`ISO audit — ${pages.length} pages from ${DIST} · control: all ${control.size} checks failed the page built to fail them\n`)
// A CHECK THAT NEVER RAN IS NOT A PASS: a requirement the control exercises but no real page gave it anything to test
for (const k of control.keys()) if (!checks.has(k)) { const c = control.get(k)!; console.log(`○ ${c.standard} — ${c.clause}: nothing on the site to check (0 instances)`) }
for (const c of checks.values()) {
  failed += c.failed.length
  console.log(`${c.failed.length ? '✗' : '✓'} ${c.standard} — ${c.clause}: ${c.checked - c.failed.length}/${c.checked}`)
  for (const f of c.failed.slice(0, 5)) console.log(`    ${f}`)
  if (c.failed.length > 5) console.log(`    … ${c.failed.length - 5} more`)
}
console.log('')
for (const [s, why] of NOT_MEASURED) console.log(`○ ${s} — NOT MEASURED: ${why}`)
console.log(`\n${failed ? `✗ ISO audit — ${failed} failure(s)` : '✓ ISO audit — every machine-checkable requirement holds'}`)
process.exit(failed ? 1 : 0)
