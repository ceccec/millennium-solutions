#!/usr/bin/env node
/** ── /formulas — ONE schema.org ItemList, NOT A HAND-ROLLED PAGE ──────────────────────────────────────────
 *
 *  The first version of this wrote 545 KB of bespoke HTML: an <article> per formula, its own escaping, its
 *  own CSS, its own filter script. It worked, and it was the wrong shape twice over. This tree ALREADY
 *  emits schema.org for every theorem — `structuredData` in src/publication builds a ScholarlyArticle with
 *  author, licence, citation, the source files and the cross-repository statement address — and a second
 *  format beside it is a second thing to keep in step, readable by nothing but this one page.
 *
 *  So the data is a schema.org ItemList of the entries structuredData already produces, written once to
 *  public/formulas.jsonld, and the page is a few lines that render it. A search engine, a citation index
 *  and another agent read the same file with no bespoke parser, and the page has no copy of the content to
 *  drift from it.
 *
 *  WHAT THIS REMOVED: 545 KB of generated markup, a duplicate HTML escaper canon-gate had already refused,
 *  and every field name invented here rather than taken from a vocabulary someone else maintains. */
import { writeFileSync, mkdirSync } from 'node:fs'
import { leanTheorems, leanFiles, leanSource, ledger as __ledger, live as __live } from '../src/api/index.ts'
import { SITE, CONCEPT_DOI } from '../src/publication/index.ts'

const T = leanTheorems() as any[]
const LIVE = new Set((__live(__ledger()) as { key: string }[]).map((e) => e.key))
const wingOf = new Map((leanFiles() as string[]).map((f) => [f, leanSource(f).match(/^--\s*wing:\s*(.+)$/m)?.[1]?.trim() ?? 'unfiled']))
const keyOf = (t: { name: string }) => [...LIVE].find((k) => k.endsWith('_' + t.name)) ?? null
// The ledger's receipt for each key, so ONE component can serve both the formula list and the ledger list
// that AllTheorems.vue used to render from a bundled copy of discovered.json.
const receiptOf = new Map((__ledger() as { key: string; receipt: string }[]).map((e) => [e.key, e.receipt]))

// ── WHAT IS THE SAME FOR EVERY ENTRY GOES ON THE LIST, ONCE ──────────────────────────────────────────────
// The first schema.org version reused `structuredData` per formula and produced 2.6 MB — larger than the
// 545 KB of hand-rolled HTML it replaced — because author, licence, isPartOf and a three-item citation
// array were repeated 1,168 times. That is not a size problem, it is a MODELLING problem: schema.org puts
// what a collection shares on the collection. Each entry now carries only what distinguishes it, and the
// per-theorem ScholarlyArticle with its full provenance stays where it belongs, on the theorem's own page.
const items = T.map((t, i) => {
  const key = keyOf(t)
  return {
    '@type': 'ListItem', position: i + 1,
    item: {
      '@type': 'ScholarlyArticle',
      name: t.name,
      description: t.statement,
      ...(key ? { identifier: key, url: `${SITE}/theorem/${key}`, receipt: receiptOf.get(key) } : {}),
      about: { '@type': 'DefinedTerm', name: t.namespace || t.file.replace('.lean', '') },
      // ALIASED IN THE CONTEXT, NOT WRAPPED PER ITEM. Three PropertyValue objects per formula cost more
      // than the statements they annotate. A local @context maps these names onto schema.org properties
      // once, which is what a context is FOR — the data means the same to a consumer and stops repeating
      // the scaffolding 1,168 times.
      wing: wingOf.get(t.file), source: t.file,
      proof: t.tactic === 'by decide' ? 'by exhaustion' : 'for every value',
    },
  }
})

const wings = [...new Set(T.map((t) => wingOf.get(t.file)))].sort()
const files = [...new Set(T.map((t) => t.file))].sort()
/** A CATALOGUE OF NOTHING IS NOT A CLEAN RUN. */
if (items.length < 100 || wings.length < 2) {
  console.log(`✗ formulas: ${items.length} formula(s) across ${wings.length} wing(s) — the reader has broken, not the tree.`)
  process.exit(1)
}

mkdirSync('public', { recursive: true })
writeFileSync('public/formulas.jsonld', JSON.stringify({
  '@context': [
    'https://schema.org',
    // Three local terms, each a schema.org property under a shorter name.
    { wing: 'https://schema.org/genre', source: 'https://schema.org/isBasedOn', proof: 'https://schema.org/creativeWorkStatus', receipt: 'https://schema.org/sameAs' },
  ],
  '@type': 'ItemList',
  name: 'Formulas — every proposition this deposit decides',
  description: 'Each entry is the statement the Lean 4 kernel accepted, character for character, with its source, its wing and how it was proved.',
  numberOfItems: items.length,
  itemListOrder: 'https://schema.org/ItemListUnordered',
  // Shared by every member, stated once — which is both smaller and the vocabulary's own shape.
  author: { '@type': 'Person', name: 'Tsvetan Rouschev', '@id': 'https://orcid.org/0009-0000-7312-9778' },
  license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  inLanguage: 'en',
  isPartOf: { '@type': 'Dataset', name: 'Millennium Solutions — the ℤ/9 vortex framework', identifier: `https://doi.org/${CONCEPT_DOI}` },
  itemListElement: items,
}, null, 1) + '\n')

writeFileSync('formulas.md', `---
title: Formulas
description: Every formula this deposit decides, as a schema.org ItemList, filterable by wing, source and proof.
---
<!-- GENERATED BY scripts/formulas.ts — DO NOT EDIT BY HAND -->

# Formulas

${items.length} formulas, each the proposition the Lean 4 kernel accepted, character for character.
${T.filter((t) => t.tactic === 'by decide').length} decided by exhaustion over a finite domain,
${T.filter((t) => t.tactic !== 'by decide').length} proved for every value,
${T.filter((t) => keyOf(t)).length} carrying a live ledger key.

The data is **[public/formulas.jsonld](/formulas.jsonld)** — one schema.org \`ItemList\` of
\`ScholarlyArticle\`, the same structured data every theorem page carries. This page renders that file
and holds no copy of it, so the two cannot drift. Nothing here is authored: a formula that stops
compiling stops appearing.

<FormulaList />
`)
console.log(`✓ formulas: ${items.length} in a schema.org ItemList → public/formulas.jsonld (${(JSON.stringify(items).length / 1024).toFixed(0)} KB) + a page that renders it`)
console.log(`  ${wings.length} wing(s) · ${files.length} source file(s) · ${T.filter((t) => keyOf(t)).length} with a live ledger key`)
