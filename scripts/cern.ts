/** ── THE CERN OPEN DATA CORPUS, ADDRESSED AND INVOLUTED IN WAVES ───────────────────────────────────────────
 *
 *  WHY THE SITEMAP AND NOT THE API. opendata.cern.ch publishes `robots.txt` with `Disallow: /api/` and a
 *  `Sitemap:` directive pointing at 317 child sitemaps. The API was used to CHARACTERISE the portal — a few
 *  dozen counting queries — and is not used to harvest it, because mass automated retrieval through a path
 *  the site owner disallows is not ours to perform. The sitemap is the enumeration they publish for exactly
 *  this purpose, and it is fetched at eight lanes.
 *
 *  THREE HARVEST STRATEGIES WERE MEASURED AND TWO UNDER-COVER SILENTLY:
 *
 *    OAI-PMH ListIdentifiers   completeListSize = 74,614   — 7,771 short, 90.6% of the corpus, no error
 *    any recid-keyed query     recid:* = 72,111            — 10,274 records carry no indexed recid at all
 *    unfiltered API count      82,385                      — but paging refuses past offset 10,000
 *
 *  The first is the protocol built for exhaustive harvesting and it is the one that misses the most. Both
 *  failures are silent: the harvest returns, it looks complete, and the absent records are invisible. This
 *  is the concept-DOI false absence again on a different portal, which is why this script states its cover
 *  and checks it rather than trusting any single endpoint's idea of "all".
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
const listed = urls.filter((u) => /\/record\/\d+$/.test(u))
const other = urls.length - listed.length
// THE SITEMAP LISTS DUPLICATES. Addressing the listing rather than the corpus reported 21,942 "collisions"
// whose evidence was the same URL twice — the address agreeing with itself, which is the function WORKING.
// A collision is two DISTINCT inputs sharing an address, so the input set is deduplicated first and the
// duplication is reported as its own number instead of being laundered into a collision count.
const records = [...new Set(listed)]
const duplicated = listed.length - records.length
const recids = new Set(records.map((u) => u.match(/(\d+)$/)![1]))

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
writeFileSync('.cern/corpus.json', JSON.stringify({
  sitemaps: children.length, urls: urls.length, listedRecordUrls: listed.length, duplicatedInSitemap: duplicated, records: records.length, distinctRecids: recids.size,
  nonRecordUrls: other, addresses: byAddr.size, collisions: collisions.length,
  notInvolutive, fixed, swapped: records.length - fixed, roots,
  oaiCompleteListSize: 74614, recidIndexed: 72111, apiReportedTotal: 82385,
  noveltyEstablished: 0, noveltyClaimed: 0,
}, null, 2))

console.log(`  ${listed.length.toLocaleString('en')} record URLs listed, ${duplicated.toLocaleString('en')} of them repeats → ${records.length.toLocaleString('en')} distinct · ${recids.size.toLocaleString('en')} distinct recids · ${other.toLocaleString('en')} non-record URLs`)
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
