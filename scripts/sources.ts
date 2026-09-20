#!/usr/bin/env node
// SOURCES — every live API this deposit investigates through, proven against an answer already known.
//
// An investigation is only as good as its readers, and a broken reader does not announce itself: it returns
// nothing and reads as "found nothing". This deposit has been bitten exactly there. A CERN filter once
// returned EXACTLY the API's own total and was believed because the number agreed; `uses.ts` reported one
// citation across 85 leads, on a page that cites nobody, because it matched the User-Agent it had just sent.
// Both looked like findings. Both were the instrument.
//
// So each source is asked a question whose answer is KNOWN before it is asked, the way
// src/proof/fixtures/axiom-control.lean makes the kernel prove something false is false before its verdicts
// are trusted. Three outcomes, kept apart on purpose:
//
//   PROVEN        it answered, and the answer is the one that was already known — its results may be used
//   WRONG         it answered, and the answer is not — the reader is broken, and anything it reports today
//                 is evidence about the reader. This FAILS. A source that lies is worse than one that is down.
//   NOT MEASURED  it did not answer. Nothing is concluded, and no investigation may report "found nothing"
//                 from it. Silence is not absence.
//
// FOURTEEN PROBES, asked at once, in the deposit's own 2×7. They are independent, and asking them in turn
// would only teach the habit of stopping at the first failure — the interesting answer is WHICH source is
// unreliable today, not that one was.
import { flag } from '../src/cli/index.ts'

type Probe = { source: string; why: string; url: string; expect: (body: string) => boolean }

const UA = { 'User-Agent': 'millennium-solutions/sources (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }

// Each `expect` names a fact that is true independently of this deposit and stable over time.
const PROBES: Probe[] = [
  { source: 'zenodo', why: "the captain's own first deposit, by record id",
    url: 'https://zenodo.org/api/records/21781603',
    expect: (b) => /Clay Millennium/i.test(b) && /"publication_date"\s*:\s*"2026-08-04"/.test(b) },
  { source: 'zenodo:concept', why: 'the concept DOI that groups its versions',
    url: 'https://zenodo.org/api/records/22256707',
    expect: (b) => /"conceptrecid"\s*:\s*"21781602"/.test(b) },
  { source: 'doi.org', why: 'content negotiation resolves a DOI to metadata',
    url: 'https://doi.org/api/handles/10.5281/zenodo.21819217',
    expect: (b) => /"responseCode"\s*:\s*1/.test(b) },
  { source: 'orcid', why: "the author's ORCID resolves to a public record",
    url: 'https://pub.orcid.org/v3.0/0009-0000-7312-9778/person',
    expect: (b) => /Rouschev/i.test(b) },
  { source: 'oeis', why: 'A000079 is the powers of two — catalogued long before this deposit',
    url: 'https://oeis.org/search?q=id:A000079&fmt=json',
    expect: (b) => /Powers of 2/i.test(b) },
  { source: 'oeis:orbit', why: 'the doubling orbit 1,2,4,8,7,5 is A153130, credited not claimed',
    url: 'https://oeis.org/search?q=1,2,4,8,7,5&fmt=json',
    expect: (b) => /A153130|Period 6/i.test(b) },
  // A ZENODO DOI IS NOT IN CROSSREF. The first version of this probe asked Crossref for 10.5281/zenodo.…
  // and read the 404 as "Crossref is down". Zenodo registers through DATACITE; the two registries divide the
  // DOI space between them, and asking the wrong one is a question about my knowledge, not about the source.
  { source: 'datacite', why: "the registry that actually issued the captain's DOI",
    url: 'https://api.datacite.org/dois/10.5281/zenodo.21819217',
    expect: (b) => /"doi"\s*:\s*"10.5281\/zenodo.21819217"/.test(b) },
  // ASKED A QUESTION, NOT AN IDENTIFIER. Two versions of this probe named a specific DOI from memory and
  // both 404'd — the first because Zenodo DOIs live in DataCite, the second because I recalled an identifier
  // that does not exist. A probe whose expected answer depends on my recollection tests my recollection.
  // A query does not: Crossref either answers with its standard envelope or it does not.
  { source: 'crossref', why: 'the other half of the DOI space answers a query in its own envelope',
    url: 'https://api.crossref.org/works?query=riemann+hypothesis&rows=1',
    expect: (b) => /"status"\s*:\s*"ok"/.test(b) && /"message-type"/.test(b) },
  { source: 'openalex', why: 'an open scholarly index answers a known query',
    url: 'https://api.openalex.org/works?search=millennium%20prize%20problems&per-page=1',
    expect: (b) => /"meta"/.test(b) && /"count"\s*:\s*[1-9]/.test(b) },
  { source: 'arxiv', why: 'the preprint server returns a feed for a known term',
    url: 'https://export.arxiv.org/api/query?search_query=all:riemann%20hypothesis&max_results=1',
    expect: (b) => /<entry>/.test(b) && /riemann/i.test(b) },
  { source: 'zbmath', why: 'the mathematics review database answers',
    url: 'https://api.zbmath.org/v1/document/_search?search_string=millennium%20problems&results_per_page=1',
    expect: (b) => /"result"|"total"|"database"/i.test(b) },
  { source: 'cern', why: 'CERN Open Data answers, and its total is not this deposit’s filter',
    url: 'https://opendata.cern.ch/api/records?size=1&type=Dataset',
    expect: (b) => /"hits"/.test(b) && /"total"\s*:\s*[1-9]/.test(b) },
  // Q864689 IS BIOROCK, an engineering material. I typed a Q-number from memory and the probe reported
  // wikidata as a broken reader — it was answering perfectly, about something else entirely. The right
  // entity is Q727000, found by asking Wikidata's own search rather than by recalling an identifier.
  { source: 'wikidata', why: 'Q727000 is the Millennium Problems, checked by label not by recollection',
    url: 'https://www.wikidata.org/wiki/Special:EntityData/Q727000.json',
    expect: (b) => /Millennium Problems/i.test(b) },
  { source: 'npm', why: 'the registry answers for this deposit’s own package',
    url: 'https://registry.npmjs.org/@ceccec%2Fmillennium-solutions',
    expect: (b) => /"name"\s*:\s*"@ceccec\/millennium-solutions"/.test(b) },
  // THE TWO SIDES OF SILENCE. A news scan ran today and printed "topic news per day: after 1.47, before
  // 3.33" from a GDELT that had failed 30 of 35 windows with HTTP TypeError. Five points became a rate, and
  // a rate became a comparison. NOT MEASURED and FOUND NOTHING are the two sides of one boundary and they
  // lead to opposite conclusions: one says look again, the other says there is nothing there. Neither news
  // source was proven before its numbers were used, so they are proven here now.
  { source: 'gdelt', why: 'the news index that carried five of thirty-five windows and was still quoted',
    url: 'https://api.gdeltproject.org/api/v2/doc/doc?query=mathematics&mode=artlist&maxrecords=1&format=json',
    expect: (b) => /"articles"\s*:/.test(b) || /"url"\s*:/.test(b) },
  { source: 'hackernews', why: 'the other half of the same scan',
    url: 'https://hn.algolia.com/api/v1/search?query=millennium+prize&hitsPerPage=1',
    expect: (b) => /"hits"\s*:/.test(b) && /"nbHits"\s*:/.test(b) },
  { source: 'claymath', why: 'the body that defines the problems is reachable',
    url: 'https://www.claymath.org/millennium-problems/',
    expect: (b) => /millennium/i.test(b) },
]

const LIMIT_MS = Number(flag('--slow') ? 45_000 : 20_000)

type Result = { source: string; why: string; state: 'PROVEN' | 'WRONG' | 'NOT MEASURED'; note: string }

async function probe(p: Probe): Promise<Result> {
  try {
    const r = await fetch(p.url, { headers: UA, signal: AbortSignal.timeout(LIMIT_MS), redirect: 'follow' })
    if (!r.ok) return { ...p, state: 'NOT MEASURED', note: `HTTP ${r.status}` }
    const body = await r.text()
    return p.expect(body)
      ? { ...p, state: 'PROVEN', note: `${body.length.toLocaleString()} bytes, and the known answer is in them` }
      : { ...p, state: 'WRONG', note: `answered ${body.length.toLocaleString()} bytes WITHOUT the answer that is known to be there` }
  } catch (e) {
    return { ...p, state: 'NOT MEASURED', note: (e as Error).name === 'TimeoutError' ? `no answer in ${LIMIT_MS / 1000}s` : (e as Error).message }
  }
}

const results = await Promise.all(PROBES.map(probe))   // 2×7 at once
const mark = { PROVEN: '✓', WRONG: '✗', 'NOT MEASURED': '⏱' } as const
for (const r of results) console.log(`  ${mark[r.state]} ${r.source.padEnd(15)} ${r.state.padEnd(12)} ${r.note}`)

const wrong = results.filter((r) => r.state === 'WRONG')
const quiet = results.filter((r) => r.state === 'NOT MEASURED')
const proven = results.filter((r) => r.state === 'PROVEN')

console.log(`\n${proven.length} of ${results.length} source(s) proven against an answer known before it was asked.`)
if (quiet.length) {
  console.log(`${quiet.length} did not answer — ${quiet.map((r) => r.source).join(', ')}. Nothing may be`)
  console.log(`concluded from their silence, and no investigation may report "found nothing" from them today.`)
}
if (wrong.length) {
  console.log(`\n✗ sources: ${wrong.length} reader(s) answered WITHOUT the answer that is known to be there —`)
  console.log(`  ${wrong.map((r) => r.source).join(', ')}. A source that answers wrongly is worse than one that is`)
  console.log(`  down: its results read as findings. Fix the reader before believing anything it reported.`)
  process.exit(1)
}
console.log(`\n✓ sources: every reader that answered, answered correctly — investigation results may be used,`)
console.log(`  and the ${quiet.length} silent one(s) are named rather than counted as empty.`)
