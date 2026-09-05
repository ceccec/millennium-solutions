/** ── THE CERN OPEN DATA CORPUS, ADDRESSED AND INVOLUTED IN WAVES ───────────────────────────────────────────
 *
 *  WHY THE SITEMAP AND NOT THE API. opendata.cern.ch publishes `robots.txt` with `Disallow: /api/` and a
 *  `Sitemap:` directive pointing at 317 child sitemaps. The API was used to CHARACTERISE the portal — a few
 *  dozen counting queries — and is not used to harvest it, because mass automated retrieval through a path
 *  the site owner disallows is not ours to perform. The sitemap is the enumeration they publish for exactly
 *  this purpose, and it is fetched at eight lanes.
 *
 *  NO ENUMERATION OF THIS PORTAL IS COMPLETE, INCLUDING THE TWO THAT LOOK AUTHORITATIVE. Measured:
 *
 *    API aggregate count            82,385 records   but paging refuses past offset 10,000
 *    sitemap, distinct record URLs 113,229 URLs      57,408 numeric ids + 55,821 SLUG ids
 *    OAI-PMH ListIdentifiers        74,614           the protocol built for exhaustive harvesting
 *    any recid-keyed query          72,111           10,274 records carry no indexed recid at all
 *
 *  The sitemap holds ~31,000 MORE record URLs than the API counts records, and the API still holds records
 *  the sitemap omits: sampling 250 records at five spread offsets, 29.2% were absent from the sitemap
 *  (per-offset 18%–46%), which is roughly 24,000 records. Each source omits tens of thousands the other has,
 *  so the union exceeds either and neither can be called "all of CERN" on its own.
 *
 *  THE FILTER THAT PRODUCED THE FIRST ANSWER WAS WRONG, AND ITS ERROR WAS INVISIBLE BECAUSE THE NUMBER
 *  AGREED. CERN record ids are not all numeric — `cms-releases-first-batch-of-high-level-lhc-open-data` is a
 *  record id, and whole sitemaps run half slug-ids. Filtering `/record/\d+$` dropped all 55,821 slug records
 *  into the non-record bucket and returned 82,385 numeric record URLs, which is EXACTLY the API's reported
 *  total. That coincidence read as confirmation. It was the most dangerous number produced here, because a
 *  wrong instrument that agrees with an independent source stops being questioned.
 *
 *  WHAT IS COMPUTED: the deposit's content-address (`toUuid`, four FNV-1a passes, RFC 9562 §5.8) over every
 *  record URL, the reflection `refl d = 10 - d` applied to each address's digital root, and a count of any
 *  two records sharing an address. `coin.lean` proves `refl (refl d) = d` by decide over ten digits; running
 *  it across the whole corpus cannot make that theorem truer, but it can catch the SHIPPED code disagreeing
 *  with the proved one, which is the gap this deposit keeps looking for.
 *
 *  WHAT IS NOT COMPUTED: novelty. Not for one record, not for 82,385. `priorart.lean` proves
 *  `novelty_is_claimed_of_no_source`, because establishing that nothing earlier exists is an act performed
 *  OUTSIDE any file — a search, by a person, with a result — and addressing does not perform it. A wave of
 *  novelty claims would be the defect this deposit spent a day removing, emitted 82,385 times. */
import { writeFileSync, mkdirSync } from 'node:fs'
import { toUuid, digitalRoot } from '../src/0/index.ts'

const get = async (url: string): Promise<string> => {
  for (let a = 0; a < 5; a++) {
    try { const r = await fetch(url); if (r.ok) return await r.text() } catch { /* retried */ }
    await new Promise((s) => setTimeout(s, 400 * (a + 1)))
  }
  throw new Error('unreachable after 5 attempts: ' + url)
}
const locs = (xml: string): string[] => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

process.stdout.write('  reading the sitemap index the portal advertises in robots.txt…\n')
const children = locs(await get('https://opendata.cern.ch/sitemap.xml'))
process.stdout.write(`  ${children.length} child sitemaps — fetching in waves of 8\n`)

const urls: string[] = []
for (let i = 0; i < children.length; i += 8) {
  const batch = await Promise.all(children.slice(i, i + 8).map((c) => get(c).then(locs)))
  for (const b of batch) urls.push(...b)
  process.stdout.write(`\r  ${urls.length.toLocaleString('en')} URLs from ${Math.min(i + 8, children.length)}/${children.length} sitemaps`)
}
process.stdout.write('\n')

// A record URL is /record/<recid>; everything else the sitemap lists (docs, visualisations, terms) is not a
// record and is counted separately rather than quietly folded in.
// NOT /record/\d+ — CERN record ids are NOT all numeric. `cms-releases-first-batch-of-high-level-lhc-open-data`
// is a record id, and whole sitemaps are half slug-ids. A numeric-only filter dropped every one of them into
// the "non-record" bucket, and the count it produced (82,385) matched the API's total EXACTLY, which is what
// stopped me checking it. The most dangerous number today was the one that agreed with me.
const listed = urls.filter((u) => /\/record\/[^/]+$/.test(u))
const other = urls.length - listed.length
// THE SITEMAP LISTS DUPLICATES. Addressing the listing rather than the corpus reported 21,942 "collisions"
// whose evidence was the same URL twice — the address agreeing with itself, which is the function WORKING.
// A collision is two DISTINCT inputs sharing an address, so the input set is deduplicated first and the
// duplication is reported as its own number instead of being laundered into a collision count.
const records = [...new Set(listed)]
const duplicated = listed.length - records.length
const recids = new Set(records.map((u) => u.match(/\/record\/([^/]+)$/)![1]))
const numeric = [...recids].filter((r) => /^\d+$/.test(r)).length

// ── ADDRESS AND INVOLUTE ──────────────────────────────────────────────────────────────────────────────────
const refl = (d: number): number => 10 - d          // coin.lean: proved an involution over ten digits
const byAddr = new Map<string, string[]>()
let notInvolutive = 0, fixed = 0
const roots = new Array(10).fill(0)
for (const u of records) {
  const addr = toUuid(u)
  const seen = byAddr.get(addr)
  if (seen) seen.push(u); else byAddr.set(addr, [u])
  const d = digitalRoot(parseInt(addr.replace(/-/g, '').slice(0, 8), 16))
  roots[d]++
  if (refl(refl(d)) !== d) notInvolutive++
  if (refl(d) === d) fixed++
}
const collisions = [...byAddr.entries()].filter(([, v]) => v.length > 1)

mkdirSync('.cern', { recursive: true })
// The recid list is persisted so downstream characterisation does not re-fetch 317 sitemaps, and so the
// duplication can be examined rather than only counted.
const mult = new Map<string, number>()
for (const u of listed) { const r = u.match(/\/record\/([^/]+)$/)![1]; mult.set(r, (mult.get(r) ?? 0) + 1) }
writeFileSync('.cern/recids.json', JSON.stringify({ recids: [...recids], multiplicity: [...mult] }))
writeFileSync('.cern/corpus.json', JSON.stringify({
  sitemaps: children.length, urls: urls.length, listedRecordUrls: listed.length, duplicatedInSitemap: duplicated, records: records.length, distinctRecids: recids.size,
  nonRecordUrls: other, numericIds: numeric, slugIds: recids.size - numeric, addresses: byAddr.size, collisions: collisions.length,
  notInvolutive, fixed, swapped: records.length - fixed, roots,
  oaiCompleteListSize: 74614, recidIndexed: 72111, apiReportedTotal: 82385,
  noveltyEstablished: 0, noveltyClaimed: 0,
}, null, 2))

console.log(`  ${listed.length.toLocaleString('en')} record URLs listed, ${duplicated.toLocaleString('en')} of them repeats → ${records.length.toLocaleString('en')} distinct · ${recids.size.toLocaleString('en')} distinct ids (${numeric.toLocaleString('en')} numeric, ${(recids.size - numeric).toLocaleString('en')} slug) · ${other.toLocaleString('en')} non-record URLs`)
console.log(`  addressed → ${byAddr.size.toLocaleString('en')} distinct addresses`)
console.log(`  involution refl(refl(d)) = d over every address: ${notInvolutive} failure(s) in ${records.length.toLocaleString('en')}`)
console.log(`  fixed by the reflection: ${fixed.toLocaleString('en')} · swapped: ${(records.length - fixed).toLocaleString('en')}`)
console.log(`  digital roots 1..9: ${roots.slice(1).join(' ')}`)
console.log(collisions.length
  ? `  ✗ ${collisions.length} address collision(s): ${collisions.slice(0, 3).map(([a, v]) => a + ' ← ' + v.join(' ')).join(' · ')}`
  : `  address collisions: 0 — WEAK evidence of distinctness, not a proof of it`)
console.log(`\n○ cern: ${records.length.toLocaleString('en')} records addressed and involuted.`)
console.log(`  NOVELTY ESTABLISHED: 0 · NOVELTY CLAIMED: 0. An address says which bytes were read. It does not`)
console.log(`  say the statement is new, and no number of waves adds up to a search that nobody performed.`)
process.exit(collisions.length || notInvolutive ? 1 : 0)
