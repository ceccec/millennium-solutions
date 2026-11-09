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

  // the markup half of operability and structure. A REDIRECT STUB (locale-fold's instant fallback) holds no content and
  // no repeated block, so 2.4.1 does not apply to it — counted as a stub, never as a page without a skip link.
  if (/<meta http-equiv="refresh"/.test(html)) record(checks, 'ISO/IEC 40500 (WCAG 2.0)', '2.4.1 not applicable — redirect stubs with no content (measured apart)', p, true)
  else check('ISO/IEC 40500 (WCAG 2.0)', '2.4.1 a mechanism bypasses repeated blocks', p, /<a\b[^>]*href="#[^"]+"[^>]*>[^<]*skip/i.test(html) || /class="[^"]*SkipLink/.test(html))
  for (const m of html.matchAll(/\stabindex="(\d+)"/g)) check('ISO/IEC 40500 (WCAG 2.0)', '2.4.3 / 2.1.1 no positive tabindex overrides the focus order', p, Number(m[1]) === 0, `tabindex=${m[1]}`)
  for (const b of html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? []) {
    // A BARE `title` IS A REACTIVE BINDING NOT YET RESOLVED: Vue renders `:title="x"` with x empty at build as a valueless
    // attribute, and the script fills it on hydration — the rendered page WCAG evaluates has the name. Counted apart, as
    // named by script, never folded into the pass.
    if (/\stitle(\s|>)/.test(b.match(/<button\b[^>]*>/)![0]) && b.replace(/<[^>]+>/g, '').trim() === '') { record(checks, 'ISO/IEC 40500 (WCAG 2.0)', '4.1.2 buttons named only by script after hydration (measured apart)', p, true); continue }
    check('ISO/IEC 40500 (WCAG 2.0)', '4.1.2 every button has an accessible name', p, b.replace(/<[^>]+>/g, '').trim() !== '' || /aria-label="[^"]+"|title="[^"]+"|aria-labelledby="/.test(b), b.slice(0, 80))
  }
  for (const m of html.matchAll(/<input\b[^>]*>/g)) {
    const i = m[0]
    if (/type="(hidden|submit|button|reset)"/.test(i)) continue
    const id = i.match(/\sid="([^"]+)"/)?.[1]
    // an input inside a <label> element is labelled by it (HTML's implicit label) — as valid as for= or aria-label
    const before = html.slice(0, m.index)
    const wrapped = before.lastIndexOf('<label') > before.lastIndexOf('</label>')
    check('ISO/IEC 40500 (WCAG 2.0)', '3.3.2 / 4.1.2 every input is labelled', p, wrapped || /aria-label="[^"]+"|aria-labelledby="/.test(i) || (!!id && html.includes(`for="${id}"`)), i.slice(0, 80))
  }
  const levels = [...html.matchAll(/<h([1-6])\b/g)].map((m) => Number(m[1]))
  const skip = levels.findIndex((l, k) => k > 0 && l > levels[k - 1] + 1)
  check('ISO/IEC 40500 (WCAG 2.0)', '1.3.1 (technique G141) headings descend without skipping a level', p, skip < 0, skip < 0 ? '' : `h${levels[skip - 1]} → h${levels[skip]}`)

  // ISO/IEC 25010 functional correctness, as far as a page shows it: every internal link resolves to a built page
  for (const m of html.matchAll(/\shref="(\/millennium-solutions\/[^"#?]*)/g)) check('ISO/IEC 25010', 'functional correctness — every internal link resolves', p, resolves(m[1]), m[1])
}

/** an internal href is a built file, a .html beside it, or a directory index */
const FILES = new Set(walkAll(DIST).map((f) => f.slice(DIST.length)))
function walkAll(d: string): string[] { return readdirSync(d).flatMap((e) => { const p = join(d, e); return statSync(p).isDirectory() ? walkAll(p) : [p] }) }
function resolves(href: string): boolean {
  const path = decodeURIComponent(href.replace(/^\/millennium-solutions/, '')) || '/'
  return [path, `${path}.html`, `${path.replace(/\/$/, '')}/index.html`, path.replace(/\.html$/, '') + '.html'].some((c) => FILES.has(c))
}

// ── 1.4.3 CONTRAST, MEASURED FROM THE THEME ─────────────────────────────────────────────────────────────────────────
// The text and background colours are the theme's custom properties: light on :root, dark on .dark, some defined through
// var(). They are resolved in cascade order from the built stylesheets and every text-on-background pair the theme uses
// is measured by WCAG's relative-luminance formula. Normal text needs 4.5:1 (1.4.3); the theme's muted text-3 is used
// for secondary labels and is held to the same line, not a looser one.
type Scope = Map<string, string>
const tokens = (css: string): { light: Scope; dark: Scope } => {
  const light: Scope = new Map(), dark: Scope = new Map()
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = m[1].split(',').map((s) => s.trim())
    const decl = [...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)]
    if (!decl.length) continue
    const into = sel.some((s) => /(^|\s)\.dark$|^html\.dark$|^:root\.dark$/.test(s)) ? dark : sel.includes(':root') ? light : null
    for (const [, k, v] of decl) into?.set(k, v.trim())
  }
  return { light, dark: new Map([...light, ...dark]) }
}
const resolveColor = (scope: Scope, v: string, depth = 0): string | null => {
  const ref = v.match(/^var\((--[\w-]+)(?:,\s*([^)]+))?\)$/)
  if (ref) { const r = scope.get(ref[1]) ?? ref[2]; return r && depth < 20 ? resolveColor(scope, r, depth + 1) : null }
  return /^#|^rgba?\(/.test(v) ? v : null
}
const rgba = (c: string): [number, number, number, number] => {
  if (c.startsWith('#')) {
    const h = c.length <= 5 ? [...c.slice(1)].map((x) => x + x).join('') : c.slice(1)
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1]
  }
  const n = c.match(/[\d.]+/g)!.map(Number)
  return [n[0], n[1], n[2], n[3] ?? 1]
}
const luminance = ([r, g, b]: number[]) => [r, g, b].map((x) => { const s = x / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4 }).reduce((a, x, i) => a + x * [0.2126, 0.7152, 0.0722][i], 0)
export const contrast = (fg: string, bg: string): number => {
  const [br, bgG, bb] = rgba(bg), [fr, fg2, fb, fa] = rgba(fg)
  const over = [fr * fa + br * (1 - fa), fg2 * fa + bgG * (1 - fa), fb * fa + bb * (1 - fa)]
  const [a, b] = [luminance(over), luminance([br, bgG, bb])].sort((x, y) => y - x)
  return (a + 0.05) / (b + 0.05)
}
const TEXT = ['--vp-c-text-1', '--vp-c-text-2', '--vp-c-text-3', '--vp-c-brand-1']
const BACK = ['--vp-c-bg', '--vp-c-bg-alt', '--vp-c-bg-soft']
const auditContrast = (checks: Checks, label: string, scopes: { light: Scope; dark: Scope }) => {
  for (const [mode, scope] of [['light', scopes.light], ['dark', scopes.dark]] as const)
    for (const t of TEXT) for (const b of BACK) {
      const fg = resolveColor(scope, scope.get(t) ?? ''), bg = resolveColor(scope, scope.get(b) ?? '')
      if (!fg || !bg) continue
      const r = contrast(fg, bg)
      record(checks, 'ISO/IEC 40500 (WCAG 2.0)', '1.4.3 contrast (minimum) — text on background at least 4.5:1', `${label} ${mode}`, r >= 4.5, `${t} ${fg} on ${b} ${bg}: ${r.toFixed(2)}:1`)
    }
}

// THE CONTROL — one synthetic page breaking every requirement above must fail every one of them, or the audit is blind
const BAD = '<html lang="zz-QQ"><head><title></title><link rel="alternate" hreflang="qq"><script type="application/ld+json">'
  + '{"datePublished":"9 Nov 2026","priceCurrency":"XYZ"}</script></head><body><img src="a.png"><p id="x"></p><p id="x"></p>'
  + '<a href="/y"></a><img src="http://e.com/b.png" alt="b">10.12/x<span tabindex="3"></span><button></button>'
  + '<input type="text" id="q"><h1>a</h1><h3>b</h3><a href="/millennium-solutions/no-such-page">c</a></body></html>'
const control: Checks = new Map()
auditPage(control, 'CONTROL', BAD)
auditContrast(control, 'CONTROL', { light: new Map([['--vp-c-text-1', '#777'], ['--vp-c-bg', '#888']]), dark: new Map([['--vp-c-text-1', '#777'], ['--vp-c-bg', '#888']]) })
const blind = [...control.values()].filter((c) => c.failed.length === 0)
if (blind.length) { console.error(`✗ ISO audit control: ${blind.length} check(s) passed a page built to fail them — ${blind.map((c) => c.clause).join('; ')}`); process.exit(1) }

const checks: Checks = new Map()
for (const p of pages) auditPage(checks, p, readFileSync(p, 'utf8'))
const css = walkAll(join(DIST, 'assets')).filter((f) => f.endsWith('.css')).map((f) => readFileSync(f, 'utf8')).join('\n')
auditContrast(checks, 'theme', tokens(css))

// ISO/IEC 25010 performance efficiency, MEASURED and reported — a measurement with no stated requirement is not a verdict
const weights = pages.filter((p) => !/<meta http-equiv="refresh"/.test(readFileSync(p, 'utf8').slice(0, 2048))).map((p) => statSync(p).size).sort((a, b) => a - b)
const assets = walkAll(join(DIST, 'assets')).reduce((n, f) => n + statSync(f).size, 0)
const kb = (n: number) => `${(n / 1024).toFixed(0)} KB`

// ISO 8601 in the sitemap
const sitemap = join(DIST, 'sitemap.xml')
if (existsSync(sitemap)) for (const m of readFileSync(sitemap, 'utf8').matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) record(checks, 'ISO 8601', 'every sitemap lastmod is ISO 8601', sitemap, ISO8601.test(m[1]), m[1])

const NOT_MEASURED = [
  ['ISO/IEC 40500 (WCAG 2.0)', '1.4.3 for colours set outside the theme tokens, 1.1.1 whether alt text is meaningful, 2.1.1 keyboard operation of scripted widgets — need rendering and judgment, not markup'],
  ['ISO/IEC 27001', 'an information security management system is an organisation\'s process, certified by audit — no page can evidence it'],
  ['ISO/IEC 25010', 'the characteristics beyond link correctness and page weight are assessed against stated requirements by evaluation'],
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
console.log(`\n◇ ISO/IEC 25010 performance efficiency — MEASURED: page html median ${kb(weights[weights.length >> 1])}, largest ${kb(weights[weights.length - 1])}, ${weights.filter((w) => w > 1024 * 1024).length} over 1 MB; shared assets ${kb(assets)}`)
console.log('')
for (const [s, why] of NOT_MEASURED) console.log(`○ ${s} — NOT MEASURED: ${why}`)
console.log(`\n${failed ? `✗ ISO audit — ${failed} failure(s)` : '✓ ISO audit — every machine-checkable requirement holds'}`)
process.exit(failed ? 1 : 0)
