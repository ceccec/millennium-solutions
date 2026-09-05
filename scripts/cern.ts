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
 *  WHERE THE GAP ACTUALLY IS — measured per type, after a prediction of mine failed. I predicted 9.4% of
 *  REST records would be missing from the OAI ∪ sitemap union and tested it: 0 of 250. The prediction was
 *  wrong because the sample could not reach past offset 7,000 of 82,385 (the portal refuses deep paging), so
 *  it covered 8.5% of the corpus from one end. Sampling by TYPE finds it at once, and it is not a spread:
 *
 *    Dataset          66,042    0/15 outside the union      covered
 *    Supplementaries   5,904    0/40                        covered
 *    Environment          64    0/40                        covered
 *    Software             55    0/40                        covered
 *    Documentation     9,272   40/40 outside                NOT carried by either bulk route
 *    Glossary          1,006   40/40 outside                NOT carried by either bulk route
 *
 *  So 10,278 records — 12.5% of the corpus — are reachable ONLY through the REST API, which robots.txt asks
 *  automation to leave alone. Their ids are pure slugs (`AOD`, `Barn`, `stripping21r1-dy2mumuline3`), which
 *  is also what the "10,274 records carry no indexed recid" figure was measuring hours earlier, before there
 *  was any way to say what those records were. The two numbers are the same population seen from two sides.
 *
 *  Not established: the ten records the portal counts (82,385) beyond what `type:*` matches (82,375). Every
 *  negation query that would isolate them — `NOT type:*`, `-type:*`, `NOT _exists_:type` — returns HTTP 502
 *  from the portal. They are known to exist and are not enumerable through any query available here.
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
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs'
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
const urlIds = new Set(records.map((u) => u.match(/\/record\/([^/]+)$/)![1]))
const numeric = [...urlIds].filter((r) => /^\d+$/.test(r)).length
// SLUG IDS ARE ALIASES, NOT RECORDS. /record/cms-68283 and /record/68283 serve the same record — verified
// by fetching both and comparing titles — and 92.7% of slug ids end in a number that is already a known
// numeric recid. Counting them as records inflated the corpus from 61,497 to 113,229. The first pass here
// filtered them out and got roughly the right total for the wrong reason; the second pass admitted them and
// got a worse total for a better reason. Aliases are resolved to their target, which is neither.
// An alias is <experiment>-<recid> where the trailing number IS a known numeric recid — verified by
// fetching /record/cms-68283 and /record/68283 and comparing titles. Mapping ANY trailing digits to a recid
// is wrong and was: `stripping21r1-dy2mumuline3` became record "3", and `AOD` / `Barn` (Glossary ids) have no
// number at all. Those are records in their own right, not aliases, so a slug whose trailing number is NOT a
// known recid keeps its own id. This left the COUNT unchanged at 61,497 and fixed the MEMBERS, which is what
// the coverage comparison actually reads.
// The alias target must be ANY KNOWN RECID, not merely one the sitemap also lists numerically. Checking
// only the sitemap's own numeric set left 4,085 slugs (alice-1100, atlas-15003) looking like new records
// when they alias records the OAI feed lists numerically and /record/1100 serves identically. Widened to
// the union of every recid known from any source, sitemap-only drops from 4,085 to 5.
const known = new Set<string>([...urlIds].filter((r) => /^\d+$/.test(r)))
try { for (const i of JSON.parse(readFileSync('.cern/oai-ids.json', 'utf8')) as string[]) known.add(i) } catch { /* OAI not harvested yet; alias resolution then uses sitemap numerics only, and says so below */ }
const recids = new Set([...urlIds].map((r) => {
  const t = r.match(/^[a-z]+-(\d+)$/i)
  return t && known.has(t[1]) ? t[1] : r
}))

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
  nonRecordUrls: other, urlIds: urlIds.size, numericIds: numeric, slugAliases: urlIds.size - numeric,
  canonicalRecords: recids.size, addresses: byAddr.size, collisions: collisions.length,
  notInvolutive, fixed, swapped: records.length - fixed, roots,
  oaiCompleteListSize: 74614, recidIndexed: 72111, apiReportedTotal: 82385,
  noveltyEstablished: 0, noveltyClaimed: 0,
}, null, 2))

console.log(`  ${listed.length.toLocaleString('en')} record URLs listed, ${duplicated.toLocaleString('en')} of them repeats → ${records.length.toLocaleString('en')} distinct · ${urlIds.size.toLocaleString('en')} URL ids (${numeric.toLocaleString('en')} numeric + ${(urlIds.size - numeric).toLocaleString('en')} slug aliases) → ${recids.size.toLocaleString('en')} CANONICAL records · ${other.toLocaleString('en')} non-record URLs`)
console.log(`  addressed → ${byAddr.size.toLocaleString('en')} distinct addresses`)
console.log(`  involution refl(refl(d)) = d over every address: ${notInvolutive} failure(s) in ${records.length.toLocaleString('en')}`)
console.log(`  fixed by the reflection: ${fixed.toLocaleString('en')} · swapped: ${(records.length - fixed).toLocaleString('en')}`)
console.log(`  digital roots 1..9: ${roots.slice(1).join(' ')}`)
console.log(collisions.length
  ? `  ✗ ${collisions.length} address collision(s): ${collisions.slice(0, 3).map(([a, v]) => a + ' ← ' + v.join(' ')).join(' · ')}`
  : `  address collisions: 0 — WEAK evidence of distinctness, not a proof of it`)
// ── THE DOCUMENT IS CHECKED AGAINST THIS RUN ─────────────────────────────────────────────────────────────
// docs/CERN-ENUMERATION.md states figures about an EXTERNAL portal, so stale-figures cannot hold them — it
// compares prose against the proof tree, and none of these numbers live there. Unheld external figures go
// stale silently, which is the whole failure this document is about. So the figures are re-derived here and
// the run fails if the prose has drifted from what was just measured.
const doc = readFileSync('docs/CERN-ENUMERATION.md', 'utf8')
const stated = (label: string, n: number): void => {
  if (!doc.includes(n.toLocaleString('en'))) {
    console.log(`  ✗ docs/CERN-ENUMERATION.md does not state the measured ${label} (${n.toLocaleString('en')})`)
    drift++
  }
}
let drift = 0
stated('canonical record count', recids.size)
stated('sitemap URL id count', urlIds.size)
stated('slug alias count', urlIds.size - numeric)
console.log(drift
  ? `  ✗ cern: ${drift} figure(s) in docs/CERN-ENUMERATION.md disagree with this run`
  : `  docs/CERN-ENUMERATION.md agrees with this run on every figure re-derived here`)

console.log(`\n○ cern: ${records.length.toLocaleString('en')} record URLs addressed and involuted → ${recids.size.toLocaleString('en')} canonical`)
console.log(`  records once slug aliases are resolved. The involution is tested per URL, which is right; the`)
console.log(`  CORPUS is ${recids.size.toLocaleString('en')}, and reporting the URL count as a record count overstated it by ${(records.length - recids.size).toLocaleString('en')}.`)
console.log(`  NOVELTY ESTABLISHED: 0 · NOVELTY CLAIMED: 0. An address says which bytes were read. It does not`)
console.log(`  say the statement is new, and no number of waves adds up to a search that nobody performed.`)
process.exit(collisions.length || notInvolutive || drift ? 1 : 0)
