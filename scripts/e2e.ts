#!/usr/bin/env node
/** ── E2E — THE SITE CHECKED AS A READER MEETS IT, AND THE CHECK IS THE DOCUMENTATION ──────────────────────
 *
 *  Every gate in this tree checks a SOURCE: the Lean compiles, the ledger chains, the prose cites live
 *  keys. Nothing checked the ARTEFACT a reader actually opens. The published page could reference a data
 *  file that was never written, link to theorem pages that do not exist, or state a count its own data
 *  contradicts, and every gate would stay green because each was looking at the material rather than at
 *  what was built from it.
 *
 *  This walks .vitepress/dist and checks the contracts a reader depends on, then WRITES WHAT IT CHECKED to
 *  E2E.md. The documentation is not a description of the tests; it is their output, so it cannot describe a
 *  check that did not run.
 *
 *  WHAT IT CANNOT DO, said plainly: it reads built files, not a browser. It cannot tell you the filter
 *  responds to a keystroke or that the layout holds at phone width — only that the page references its data,
 *  that the data parses, that the counts agree and that every address it offers a reader resolves. Behaviour
 *  in a browser was confirmed by hand and is recorded as confirmed by hand, not as covered here. */
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs'

const DIST = '.vitepress/dist'
type Check = { name: string; ok: boolean; detail: string }
const checks: Check[] = []
const add = (name: string, ok: boolean, detail: string) => checks.push({ name, ok, detail })

if (!existsSync(DIST)) {
  console.log(`✗ e2e: ${DIST} does not exist — run npm run docs:build first. A check of the artefact needs the artefact.`)
  process.exit(1)
}

// ── 1 · the page a reader opens exists and references its data rather than embedding it ──────────────────
const page = existsSync(`${DIST}/formulas.html`) ? readFileSync(`${DIST}/formulas.html`, 'utf8') : ''
add('the formulas page is built', page.length > 0, `${page.length} bytes`)
add('it references the data file rather than embedding it',
  /formulas\.jsonld/.test(page) && page.length < 200_000,
  `page ${(page.length / 1024).toFixed(0)} KB, references formulas.jsonld: ${/formulas\.jsonld/.test(page)}`)

// ── 2 · the data is schema.org and parses ────────────────────────────────────────────────────────────────
let list: any = null
try { list = JSON.parse(readFileSync(`${DIST}/formulas.jsonld`, 'utf8')) } catch (e) { /* reported below */ }
add('the data file parses as JSON-LD', !!list, list ? `${(JSON.stringify(list).length / 1024).toFixed(0)} KB` : 'did not parse')
const ctx = JSON.stringify(list?.['@context'] ?? '')
add('it declares the schema.org context', /schema\.org/.test(ctx), ctx.slice(0, 80))
add('it is an ItemList', list?.['@type'] === 'ItemList', String(list?.['@type']))

// ── 3 · THE COUNT THE PAGE STATES AND THE COUNT THE DATA HOLDS ARE THE SAME ──────────────────────────────
// The failure this exists for: a page that says 1,200 over a file holding 1,192, which no source gate can
// see because each is correct about its own half.
const items = list?.itemListElement ?? []
add('numberOfItems matches what the list holds', list?.numberOfItems === items.length,
  `declared ${list?.numberOfItems}, holds ${items.length}`)
const stated = Number((page.match(/>(\d[\d,]*) formulas/) ?? page.match(/(\d[\d,]*) formulas/) ?? [])[1]?.replace(/,/g, '') ?? NaN)
add('the page and the data agree on the count', Number.isNaN(stated) || stated === items.length,
  Number.isNaN(stated) ? 'the page states no count to compare' : `page says ${stated}, data holds ${items.length}`)

// ── 4 · EVERY ADDRESS THE PAGE OFFERS A READER RESOLVES ──────────────────────────────────────────────────
// A link to a theorem page that was never built is a dead end a reader finds and no gate does.
const built = new Set(existsSync(`${DIST}/theorem`) ? readdirSync(`${DIST}/theorem`).filter((f) => f.endsWith('.html')).map((f) => f.replace('.html', '')) : [])
const linked = items.map((e: any) => e.item?.identifier).filter(Boolean)
const dead = linked.filter((k: string) => !built.has(k))
add('every linked theorem page is built', dead.length === 0,
  `${linked.length} links, ${built.size} pages built, ${dead.length} dead${dead.length ? ': ' + dead.slice(0, 3).join(', ') : ''}`)

// ── 5 · the facets the widget filters by are present on every item ────────────────────────────────────────
const missing = items.filter((e: any) => !e.item?.wing || !e.item?.source || !e.item?.proof).length
add('every item carries the three facets the widget filters by', missing === 0, `${items.length - missing} of ${items.length} complete`)

// ── A CHECK THAT EXAMINED NOTHING IS NOT A PASS ──────────────────────────────────────────────────────────
if (items.length < 100 || checks.length < 5) {
  console.log(`✗ e2e: ${items.length} item(s) over ${checks.length} check(s) — the reader has broken, not the site.`)
  process.exit(1)
}

const failed = checks.filter((c) => !c.ok)
for (const c of checks) console.log(`  ${c.ok ? '✓' : '✗'} ${c.name} — ${c.detail}`)

writeFileSync('E2E.md', `---
title: End-to-end
description: What the built site was checked for, written by the check itself.
---
<!-- GENERATED BY scripts/e2e.ts — DO NOT EDIT BY HAND -->

# End-to-end

Every other gate here checks a **source**: the Lean compiles, the ledger chains, the prose cites live keys.
This checks the **artefact a reader opens**, and this page is its output — so it cannot describe a check
that did not run.

Last run: **${checks.filter((c) => c.ok).length} of ${checks.length} passed**${failed.length ? `, ${failed.length} failing` : ''}.

| check | result | measured |
| --- | :---: | --- |
${checks.map((c) => `| ${c.name} | ${c.ok ? '✓' : '✗'} | ${c.detail} |`).join('\n')}

## What this cannot tell you

It reads built files, not a browser. It cannot tell you the filter responds to a keystroke, or that the
layout holds at phone width — only that the page references its data, that the data parses as schema.org,
that the counts agree, and that every address the page offers a reader resolves to a page that exists.

Browser behaviour was confirmed by hand on 2026-09-25 — the filter narrowing 1,192 to 24 on "reflection",
and showing *"nothing matches that filter"* rather than an empty page on a term with no hits — and is
recorded here as **confirmed by hand, not as covered by this check**.
`)

console.log(`\n${failed.length ? '✗' : '✓'} e2e: ${checks.length - failed.length} of ${checks.length} checks pass over ${items.length} published formulas → E2E.md`)
process.exit(failed.length ? 1 : 0)
