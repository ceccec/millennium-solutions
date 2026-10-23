// THE ADAPTERS — every external API this tree reaches, as data. One entry per endpoint, typed, with the fact a
// correct reply must contain.
//
// DATA ONLY. No fetch, no network reachable from this module. scripts/api-adapters.ts does the asking, and the
// registry is kept import-safe for the same reason src/readers/index.ts is: anything on the verification path
// must not be able to reach a network by importing a list.
//
// THE SOURCES OF THE LIST. Two, and both are read, not recalled:
//   · src/readers/index.ts — the citation and attribution readers. Each becomes an adapter below, derived by
//     a loop, so the readers are never listed twice.
//   · the endpoints scripts/ and src/ actually call, read with grep and written here once. An endpoint that is
//     called but not listed is the gap this file exists to close, and scripts/api-adapters-test.ts counts those
//     gaps by checking every host the code names against this registry.
//
// EACH ENTRY STATES WHAT A CORRECT ANSWER CONTAINS. A reply that comes back but does not contain that fact is
// WRONG, which fails: it means either the adapter points at the wrong thing or the expected fact is my
// recollection, and both are reported as defects rather than softened into "no data".

import { READERS } from '../readers/index.ts'

// 'no-endpoint' is a source with no documented anonymous request at all, which is a different gap from a credential.
export type Auth = 'none' | 'key' | 'licence' | 'no-endpoint'

export type Adapter = {
  /** Stable name. Unique across the registry; the test enforces it. */
  name: string
  /** Where the adapter came from, so a reader is never mistaken for a hand-written one. */
  source: 'readers' | 'code'
  /** The host whose robots.txt governs the request. */
  host: string
  /** The request. Absent for an adapter that needs a credential or a licence and is recorded as GATED. */
  url?: string
  method?: 'GET' | 'POST'
  body?: string
  /** What a correct reply contains. Required whenever `url` is set. */
  expect?: (body: string) => boolean
  auth: Auth
  /** Why the endpoint is useful to this tree, in one line. */
  purpose: string
  /** Why it must not be read as more than it is. Required, because a source without a limit is the hazard. */
  notFor: string
}

// ── THE READERS, AS ADAPTERS ───────────────────────────────────────────────────────────────────────────────────
// Derived by a loop over READERS. A reader with no URL is a gated adapter: it is named, with its reason, and never
// requested.
const fromReaders: Adapter[] = READERS.map((r) => {
  const host = r.url ? new URL(r.url).host : r.source
  return {
    name: r.source,
    source: 'readers' as const,
    host,
    url: r.url ?? undefined,
    method: r.method,
    body: r.body,
    expect: r.expect,
    auth: r.url !== null ? 'none'
      : /licen[cs]/i.test(r.why) ? 'licence'
      : /key|OAuth|credential/i.test(r.why) ? 'key'
      : 'no-endpoint',
    purpose: r.why,
    notFor: r.notFor,
  }
})

// ── THE ENDPOINTS THE CODE CALLS THAT THE READERS DO NOT COVER ─────────────────────────────────────────────────
const fromCode: Adapter[] = [
  { name: 'openalex:work', source: 'code', host: 'api.openalex.org',
    url: 'https://api.openalex.org/works/doi:10.1038/nature12373', auth: 'none',
    expect: (b) => /10\.1038\/nature12373/i.test(b),
    purpose: 'the work record for a DOI, with its authors and referenced works, for attribution and for the citation graph',
    notFor: 'the quality of a work. Its presence in a graph is a fact about the graph' },
  { name: 'crossref:doi', source: 'code', host: 'api.crossref.org',
    url: 'https://api.crossref.org/works/10.5281/zenodo.21819217', auth: 'none',
    expect: (b) => /10\.5281\/zenodo\.21819217/i.test(b),
    purpose: 'the registered metadata for a DOI, including the funder and the license a publisher declared',
    notFor: 'the content of the work behind the DOI' },
  { name: 'datacite:doi', source: 'code', host: 'api.datacite.org',
    url: 'https://api.datacite.org/dois/10.5281/zenodo.21819217', auth: 'none',
    expect: (b) => /10\.5281\/zenodo\.21819217/i.test(b),
    purpose: 'the DataCite record for a DOI minted by a repository such as Zenodo',
    notFor: 'anything beyond the record\'s own metadata' },
  { name: 'doi:resolve', source: 'code', host: 'doi.org',
    url: 'https://doi.org/10.5281/zenodo.21819217', auth: 'none',
    expect: (b) => /zenodo/i.test(b),
    purpose: 'resolving a DOI to its landing page, so a citation can be followed to its record',
    notFor: 'whether the landing page is the work\'s own; a DOI resolves to whoever registered it' },
  { name: 'zenodo:record', source: 'code', host: 'zenodo.org',
    url: 'https://zenodo.org/api/records/21781603', auth: 'none',
    expect: (b) => /"id"\s*:\s*21781603\b/.test(b),
    purpose: 'a deposit record: its files, its version and its concept identifier',
    notFor: 'the files\' contents. A record names them; it does not vouch for them' },
  { name: 'orcid:person', source: 'code', host: 'pub.orcid.org',
    url: 'https://pub.orcid.org/v3.0/0009-0000-7312-9778/person', auth: 'none',
    expect: (b) => /0009-0000-7312-9778/.test(b),
    purpose: 'the public person record for an ORCID iD, for attribution',
    notFor: 'anything the person has not published in their own record' },
  { name: 'arxiv:abs', source: 'code', host: 'arxiv.org',
    url: 'https://arxiv.org/abs/math/0211159', auth: 'none',
    expect: (b) => /entropy formula/i.test(b),
    purpose: 'the abstract page of an arXiv preprint, read to match its stated title',
    notFor: 'the correctness of the preprint. A title match is a citation check, not a review' },
  { name: 'arxiv:api', source: 'code', host: 'export.arxiv.org',
    url: 'https://export.arxiv.org/api/query?search_query=all:riemann%20hypothesis&max_results=1', auth: 'none',
    expect: (b) => /<feed/.test(b),
    purpose: 'the arXiv query API, for finding prior art by search',
    notFor: 'a result count taken as novelty. An empty result is not an absence of the work' },
  { name: 'oeis:search', source: 'code', host: 'oeis.org',
    url: 'https://oeis.org/search?q=id:A000079&fmt=json', auth: 'none',
    expect: (b) => /A000079/.test(b),
    purpose: 'the sequence record for an OEIS identifier, for checking a numerical claim against a published sequence',
    notFor: 'a match on terms as proof a sequence is the one meant. Terms can coincide' },
  { name: 'cern:opendata', source: 'code', host: 'opendata.cern.ch',
    url: 'https://opendata.cern.ch/api/records?size=1&type=Dataset', auth: 'none',
    expect: (b) => /"hits"/.test(b),
    purpose: 'the open-data record list for CERN, the corpus the cern lean file reads from a cache',
    notFor: 'a total taken as complete. A list and its total can disagree when the service pages' },
  { name: 'hn:search', source: 'code', host: 'hn.algolia.com',
    url: 'https://hn.algolia.com/api/v1/search?query=millennium+prize&hitsPerPage=1', auth: 'none',
    expect: (b) => /"hits"/.test(b),
    purpose: 'public discussion of a topic, used to find where a claim has been discussed',
    notFor: 'the truth of anything discussed there' },
  { name: 'npm:package', source: 'code', host: 'registry.npmjs.org',
    url: 'https://registry.npmjs.org/@ceccec%2Fmillennium-solutions', auth: 'none',
    expect: (b) => /"name"\s*:\s*"@ceccec\/millennium-solutions"/.test(b),
    purpose: 'the published metadata of this tree\'s npm package, for the release check',
    notFor: 'what the published tarball contains. The registry describes a version; it is not the bytes' },
  { name: 'wikidata:entity', source: 'code', host: 'www.wikidata.org',
    url: 'https://www.wikidata.org/wiki/Special:EntityData/Q158695.json', auth: 'none',
    expect: (b) => /"Q158695"/.test(b),
    purpose: 'a structured entity record, for the links between a plant and a compound',
    notFor: 'treating an edit as a sourced fact. Wikidata is editable' },
  { name: 'wikipedia:article', source: 'code', host: 'en.wikipedia.org',
    url: 'https://en.wikipedia.org/wiki/Conventional_superconductor', auth: 'none',
    expect: (b) => /superconduct/i.test(b),
    purpose: 'an article page, for a plain-language pointer to a topic',
    notFor: 'a definition used as a proof. An article is a secondary source' },
  { name: 'wikipedia:api', source: 'code', host: 'en.wikipedia.org',
    url: 'https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srlimit=1&srsearch=prime', auth: 'none',
    expect: (b) => /"search"/.test(b),
    purpose: 'the search API, for finding an article by title',
    notFor: 'the article text. Search returns titles and snippets' },
  { name: 'huggingface:models', source: 'code', host: 'huggingface.co',
    url: 'https://huggingface.co/api/models?search=bert&limit=1', auth: 'none',
    expect: (b) => /"id"/.test(b),
    purpose: 'the model listing, for the prior-art check of machine-learning claims',
    notFor: 'a model card taken as evidence of a result' },
  { name: 'gdelt:doc', source: 'code', host: 'api.gdeltproject.org',
    url: 'https://api.gdeltproject.org/api/v2/doc/doc?query=millennium%20prize&mode=artlist&format=json&maxrecords=1', auth: 'none',
    expect: (b) => /"articles"|"status"|"url"/.test(b),
    purpose: 'the news article index, for where a claim has been reported',
    notFor: 'a report taken as corroboration of its content' },
]

// ── THE REMAINING ENDPOINTS THE CODE CALLS, FOUND BY THE COVERAGE TEST ───────────────────────────────────────────
const fromCodeRest: Adapter[] = [
  { name: 'github:api', source: 'code', host: 'api.github.com',
    url: 'https://api.github.com/repos/ceccec/millennium-solutions/tags', auth: 'none',
    expect: (b) => /"name"\s*:/.test(b),
    purpose: 'the tags of this tree\'s repository, the provenance a release is checked against',
    notFor: 'the contents of a tag. A tag names a commit; it does not vouch for it' },
  { name: 'github:raw', source: 'code', host: 'raw.githubusercontent.com',
    url: 'https://raw.githubusercontent.com/ceccec/millennium-solutions/main/README.md', auth: 'none',
    expect: (b) => /millennium/i.test(b),
    purpose: 'the raw text of a file in a repository, read where a search hit points at a file',
    notFor: 'the file at any commit other than the one named. A branch URL moves' },
  { name: 'claymath:rules', source: 'code', host: 'www.claymath.org',
    url: 'https://www.claymath.org/millennium-problems/rules/', auth: 'none',
    expect: (b) => /millennium/i.test(b),
    purpose: 'the official prize rules page, read to check the conditions a solution must meet',
    notFor: 'a legal reading of the rules. The text is quoted, and any reading of it is a claim for a court to decide' },
  { name: 'zbmath:search', source: 'code', host: 'api.zbmath.org',
    url: 'https://api.zbmath.org/v1/document/_search?search_string=millennium%20problems&results_per_page=1', auth: 'none',
    expect: (b) => /"(hits|results|total)"/.test(b),
    purpose: 'the zbMATH document search, for mathematical literature on a topic',
    notFor: 'a hit as a review. zbMATH indexes documents; it does not assess them' },
  { name: 'zbmath:site', source: 'code', host: 'zbmath.org',
    url: 'https://zbmath.org/?q=millennium', auth: 'none',
    expect: (b) => /zbMATH/i.test(b),
    purpose: 'the zbMATH search page, read where the search API does not carry a field',
    notFor: 'the same limit as the search API' },
]

// ── THE LAST THREE, FOUND BY THE SAME TEST ──────────────────────────────────────────────────────────────────────
const fromCodeLast: Adapter[] = [
  { name: 'apis-guru:list', source: 'code', host: 'api.apis.guru',
    url: 'https://api.apis.guru/v2/list.json', auth: 'none',
    expect: (b) => /"preferred"\s*:/.test(b),
    purpose: 'the APIs.guru directory of OpenAPI specifications, the catalogue scripts/apis-guru.ts snapshots',
    notFor: 'the APIs it lists. A directory entry says a spec exists; the spec may be out of date or wrong' },
  { name: 'crossref:events', source: 'code', host: 'api.eventdata.crossref.org',
    url: 'https://api.eventdata.crossref.org/v1/events?rows=1', auth: 'none',
    expect: (b) => /"status"\s*:\s*"ok"/.test(b),
    purpose: 'events that mention a registered DOI on the web, such as a citation in a blog or a dataset',
    notFor: 'the event as endorsement. A mention is that the DOI appeared somewhere, not that the mention is right' },
  { name: 'osv:query', source: 'code', host: 'api.osv.dev', method: 'POST',
    url: 'https://api.osv.dev/v1/query', body: JSON.stringify({ package: { name: 'lodash', ecosystem: 'npm' } }), auth: 'none',
    expect: (b) => /"vulns"\s*:\s*\[/.test(b),
    purpose: 'known vulnerabilities for a package version, for the supply-chain check on this tree\'s dependencies',
    notFor: 'a clean result as proof of safety. OSV lists what has been reported, not what is absent' },
]

// ── THE NIST SERVICES NOT YET COVERED ──────────────────────────────────────────────────────────────────────────
const fromNist: Adapter[] = [
  { name: 'nist:nvd', source: 'code', host: 'services.nvd.nist.gov',
    url: 'https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2021-44228', auth: 'none',
    expect: (b) => /CVE-2021-44228/.test(b),
    purpose: 'the National Vulnerability Database record for a CVE identifier',
    notFor: 'the exploitability or the exposure of any system. A CVE record describes a weakness; it is not a measurement of risk' },
  { name: 'nist:beacon', source: 'code', host: 'beacon.nist.gov',
    url: 'https://beacon.nist.gov/beacon/2.0/pulse/last', auth: 'none',
    expect: (b) => /outputValue|pulse/i.test(b),
    purpose: 'the latest value of the NIST Randomness Beacon, a public and independently verifiable random output',
    notFor: 'a proof that a value is random. The beacon publishes a value; its unpredictability is a claim the beacon makes about itself' },
  { name: 'nist:webbook', source: 'code', host: 'webbook.nist.gov',
    url: 'https://webbook.nist.gov/cgi/cbook.cgi?ID=C50782&Units=SI', auth: 'none',
    expect: (b) => /C9H8O4|Aspirin|acetylsalicylic/i.test(b),
    purpose: 'the NIST Chemistry WebBook entry for a compound, with its measured thermochemical and phase data',
    notFor: 'the properties of a compound in a body or in a process. A tabulated value is measured under stated conditions' },
  { name: 'nist:asd', source: 'code', host: 'physics.nist.gov',
    url: 'https://physics.nist.gov/PhysRefData/ASD/levels_form.html', auth: 'none',
    expect: (b) => /Atomic Spectra Database/i.test(b),
    purpose: 'the NIST Atomic Spectra Database, the reference for energy levels and spectral lines of atoms and ions',
    notFor: 'a line as a prediction of a particular source. A tabulated line is a measured or computed value with its own uncertainty' },
  { name: 'nist:dlmf', source: 'code', host: 'dlmf.nist.gov',
    url: 'https://dlmf.nist.gov/', auth: 'none',
    expect: (b) => /Digital Library of Mathematical Functions/i.test(b),
    purpose: 'the NIST Digital Library of Mathematical Functions, the reference for special functions and their identities',
    notFor: 'a numerical value at a point without the section that states its domain' },
]

export const ADAPTERS: Adapter[] = [...fromReaders, ...fromCode, ...fromCodeRest, ...fromCodeLast, ...fromNist]

/** The hosts this registry covers. scripts/api-adapters-test.ts checks the code against it. */
export const COVERED_HOSTS = new Set(ADAPTERS.map((a) => a.host))
