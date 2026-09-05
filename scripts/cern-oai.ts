/** Exact OAI identifier set, to replace a SAMPLED overlap with a counted one.
 *
 *  The overlap between the sitemap and the portal's own record list was reported as 29.2% from 250 sampled
 *  records. A percentage from a sample is what you report when the set is out of reach; this one was not.
 *  ListIdentifiers returns headers only — no metadata — so the whole identifier space is a few hundred small
 *  requests, and robots.txt disallows /api/, not /oai2d. What comes back is counted, not estimated. */
import { writeFileSync, readFileSync } from 'node:fs'

const get = async (url: string): Promise<string> => {
  for (let a = 0; a < 5; a++) {
    try { const r = await fetch(url); if (r.ok) return await r.text() } catch { /* retried */ }
    await new Promise((s) => setTimeout(s, 500 * (a + 1)))
  }
  throw new Error('unreachable: ' + url)
}
const BASE = 'https://opendata.cern.ch/oai2d'
const ids: string[] = []
let token: string | null = null
let complete = 0
for (let page = 0; ; page++) {
  const xml = await get(token
    ? `${BASE}?verb=ListIdentifiers&resumptionToken=${encodeURIComponent(token)}`
    : `${BASE}?verb=ListIdentifiers&metadataPrefix=oai_dc`)
  for (const m of xml.matchAll(/<identifier>([^<]+)<\/identifier>/g)) ids.push(m[1])
  const size = xml.match(/completeListSize="(\d+)"/)
  if (size) complete = Number(size[1])
  const t = xml.match(/<resumptionToken[^>]*>([^<]+)<\/resumptionToken>/)
  token = t ? t[1] : null
  process.stdout.write(`\r  ${ids.length.toLocaleString('en')} / ${complete.toLocaleString('en')} identifiers`)
  if (!token) break
}
process.stdout.write('\n')

// oai:cernopendata.cern:38555 → 38555
const oai = new Set(ids.map((i) => i.split(':').pop()!))
const site = new Set<string>(JSON.parse(readFileSync('.cern/recids.json', 'utf8')).recids)
const inBoth = [...oai].filter((i) => site.has(i)).length
const oaiOnly = oai.size - inBoth
const siteOnly = site.size - inBoth

writeFileSync('.cern/oai.json', JSON.stringify({ harvested: ids.length, completeListSize: complete, distinct: oai.size, inBoth, oaiOnly, siteOnly, union: oai.size + siteOnly }, null, 2))
console.log(`  OAI: ${ids.length.toLocaleString('en')} harvested, ${oai.size.toLocaleString('en')} distinct (completeListSize said ${complete.toLocaleString('en')})`)
console.log(`  sitemap: ${site.size.toLocaleString('en')} distinct`)
console.log(`  ── EXACT, not sampled ──`)
console.log(`  in both        ${inBoth.toLocaleString('en')}`)
console.log(`  OAI only       ${oaiOnly.toLocaleString('en')}`)
console.log(`  sitemap only   ${siteOnly.toLocaleString('en')}`)
console.log(`  union          ${(oai.size + siteOnly).toLocaleString('en')}   vs the API's reported 82,385`)
