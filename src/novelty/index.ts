/** ── THE PRIOR-ART SEARCH, AS A MODULE ANYONE CAN CALL ────────────────────────────────────────────────────
 *
 *  scripts/novelty.ts performed this search and was the only thing that could: the five sources, the term
 *  extraction, the relevance floor and the verdict vocabulary all lived inside a script that runs once,
 *  writes src/proof/novelty.json and exits. A reader wanting to check a claim of novelty could read the
 *  recorded answer and could not ask the question themselves.
 *
 *  The search is now here, and the script is one caller. The MCP server is the other, so the public can run
 *  the deposit's own prior-art search against any statement and get the same verdict vocabulary the record
 *  uses — CANDIDATES, NONE_FOUND, NOT_MEASURED — computed the same way.
 *
 *  NOTHING HERE WRITES. Recording a search in src/proof/novelty.json is the depositor's act: the file is
 *  what priorart.lean's kind 2 rests on, and a public caller must be able to ASK without being able to
 *  amend the deposit's evidence. Searching is free; filing is not.
 *
 *  AND NOTHING HERE DECIDES NOVELTY. NONE_FOUND means "these searches, on this date, returned nothing" —
 *  never "nothing earlier exists". A keyword search misses what it does not name, and the floors below are
 *  judgements, which is why they are carried in every result rather than buried. */

/** ── THE FLOORS, TYPED OUT BECAUSE THEY ARE CHOICES ──────────────────────────────────────────────────────
 *  There is no fact about the literature that fixes where "relevant" begins; any number here is a judgement
 *  about how much noise to accept. So they are written AS choices, returned with every verdict, and a
 *  reader can disagree with a floor they can see. */
export const LIMITS = {
  relevanceFloor: 0.6,   // word-overlap at or above which a hit is considered for candidacy
  perSource: 5,          // results requested from each literature source
  sources: ['zbmath', 'openalex', 'crossref', 'arxiv', 'oeis'],
}

export type Hit = { source: string; title: string; year?: number | string; url: string; relevance: number; text?: string }
export type Verdict = 'CANDIDATES' | 'NONE_FOUND' | 'NONE_FOUND_PARTIAL' | 'NOT_MEASURED' | 'TOO_FEW_TERMS'

const UA = { 'User-Agent': 'millennium-solutions-novelty/1.0 (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
export const q = encodeURIComponent

export async function get(url: string, as: 'json' | 'text' = 'json', tries = 4): Promise<any> {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000), redirect: 'follow' }).catch((e: Error) => ({ ok: false, status: e.name } as const))
    if (r.ok) return as === 'json' ? (r as Response).json() : (r as Response).text()
    if (![429, 503, 'TimeoutError', 'AbortError'].includes(r.status as never)) throw new Error(`HTTP ${r.status}`)
    await sleep(10000 * (i + 1)) // arXiv and OpenAlex rate-limit and time out: back off rather than record a false NOT_MEASURED
  }
  throw new Error('rate-limited after backoff')
}

const STOP = new Set(('the a an and or of to in on by for with as at is are be it its this that these those one two three four five six seven eight nine ' +
  'ten every each all any no not only same exactly from under over into onto which when where while than then there here holds hold decide decided ' +
  'decides list range theorem lemma true false what why how both either first second third last next under per via also more most less least').split(' '))
/** A theorem named for a Clay problem is ABOUT the ℤ/9 structure, not the problem: searching its label
 *  returned fluid-dynamics textbooks as "prior art". Labels are dropped from the query and from relevance. */
export const LABELS = new Set('navier stokes riemann hodge yang mills birch swinnerton dyer poincare poincaré clay millennium hypothesis conjecture'.split(' '))
/** Domain words too generic to anchor a hit — "number" is in every Reynolds-number paper. */
export const GENERIC = new Set(('elementary theory number numbers second tier named results quantified classical ' +
  'unit units group groups order orders set sets form forms law laws ' +
  // ADDED after 13 CANDIDATES for address.lean turned out to be the English verb. Its declared domain was
  // "content addressing", so the anchors were `content` and `addressing`, and "Addressing identity/
  // redressing the museum" and "Addressing Order Sensitivity of In-Context Demonstrations" both cleared
  // them. An anchor made of ordinary English anchors nothing.
  'content addressing address addresses identity mapping data information system systems').split(' '))
export const NUMBER_THEORY = ['modulo', 'modular', 'residue', 'congruen', 'divisib', 'prime', 'integer', 'arithmetic', 'multiplicative', 'cyclic group']

export const termsOf = (name: string) => [...new Set(name.split(/[_\s]+/).map((w) => w.toLowerCase())
  .filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w)))]

/** A hit is relevant when it carries most of the statement's distinctive (4+ letter) terms. */
export const relevance = (terms: string[], text: string) => {
  const t = text.toLowerCase(), key = terms.filter((w) => w.length >= 4)
  if (key.length < 2) return 0
  return key.filter((w) => t.includes(w.replace(/s$/, ''))).length / key.length
}

/** Integer lists worth asking the OEIS about — and the four kinds that are not sequences. */
export function sequencesIn(statement: string): string[] {
  const out: string[] = []
  for (const m of statement.matchAll(/\[(\s*-?\d+\s*(?:,\s*-?\d+\s*){3,})\]/g)) {
    const xs = m[1].split(',').map((s) => Number(s.trim()))
    if (new Set(xs).size < 3) continue //                                              a constant or near-constant run
    if (xs.every((x, i) => i === 0 || x - xs[i - 1] === xs[1] - xs[0])) continue //     an arithmetic progression: a domain enumerated, not a sequence claimed
    if ((xs.length === 16 || xs.length === 32) && Math.max(...xs) <= 255) continue //   a hash digest
    if (xs.every((x) => x >= 32 && x <= 126) && xs.filter((x) => /[A-Za-z]/.test(String.fromCharCode(x))).length >= 3) continue // ASCII text
    out.push(xs.slice(0, 12).join(','))
  }
  return [...new Set(out)]
}

const invert = (ix: Record<string, number[]> | undefined) => ix ? Object.entries(ix).flatMap(([w, ps]) => ps.map((p) => [p, w] as [number, string])).sort((a, b) => a[0] - b[0]).map(([, w]) => w).join(' ') : ''

export const SOURCES: Record<string, { pace: number; run: (terms: string[], query: string) => Promise<Hit[]> }> = {
  // zbMATH answers an empty search with HTTP 404 and "successful access. No results found." — an answer, not a failure.
  zbmath: { pace: 1200, run: async (terms, query) => {
    const url = `https://api.zbmath.org/v1/document/_search?search_string=${q(query)}&results_per_page=${LIMITS.perSource}`
    let j: any
    try { j = await get(url) } catch (e) {
      if (!/HTTP 404/.test((e as Error).message)) throw e
      const body = await (await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) })).json().catch(() => ({}))
      if (/no results found/i.test(body?.status?.internal_code ?? '')) return []
      throw e
    }
    return (j.result ?? []).map((d: any) => { const title = d.title?.title ?? d.title ?? ''; const text = `${title} ${JSON.stringify(d.editorial_contributions ?? d.abstract ?? '').slice(0, 3000)}`
      return { source: 'zbmath', title: String(title), year: d.year, url: d.zbmath_url ?? (d.identifier ? `https://zbmath.org/?q=an:${d.identifier}` : `https://zbmath.org/?q=${q(query)}`), relevance: relevance(terms, text), text } })
  } },
  openalex: { pace: 1200, run: async (terms, query) => ((await get(`https://api.openalex.org/works?search=${q(query)}&per-page=${LIMITS.perSource}`)).results ?? [])
    .filter((w: any) => ['Mathematics', 'Computer Science'].includes(w.primary_topic?.field?.display_name ?? ''))
    .map((w: any) => { const text = `${w.title ?? ''} ${invert(w.abstract_inverted_index)}`; return { source: 'openalex', title: w.title ?? '', year: w.publication_year, url: w.doi ?? w.id, relevance: relevance(terms, text), text } }) },
  // Crossref carries no subject, so a hit there must carry EVERY distinctive term.
  crossref: { pace: 1200, run: async (terms, query) => ((await get(`https://api.crossref.org/works?query=${q(query)}&rows=${LIMITS.perSource}`)).message?.items ?? [])
    .map((w: any) => { const text = `${(w.title ?? [''])[0]} ${String(w.abstract ?? '').replace(/<[^>]+>/g, ' ')}`; const r = relevance(terms, text); return { source: 'crossref', title: (w.title ?? [''])[0], year: w.issued?.['date-parts']?.[0]?.[0], url: w.DOI ? `https://doi.org/${w.DOI}` : w.URL, relevance: r < 1 ? 0 : r, text } }) },
  arxiv: { pace: 6000, run: async (terms) => {
    // two tries, not four: a refusing arXiv costs half a minute per call
    const x: string = await get(`https://export.arxiv.org/api/query?search_query=${q(terms.slice(0, 5).map((t) => `all:${t}`).join(' AND '))}&max_results=${LIMITS.perSource}`, 'text', 2)
    return x.split('<entry>').slice(1).filter((e) => /<category term="(math|cs)\./.test(e)).map((e) => {
      const tag = (t: string) => (e.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) ?? ['', ''])[1].replace(/\s+/g, ' ').trim()
      const text = `${tag('title')} ${tag('summary')}`
      return { source: 'arxiv', title: tag('title'), year: tag('published').slice(0, 4), url: tag('id'), relevance: relevance(terms, text), text }
    })
  } },
}

export type Search = { terms: string[]; query: string; queries: Record<string, string>; hits: Hit[]; notMeasured: string[]; oeis: { a: string; name: string; query: string }[]; verdict: Verdict; limits: typeof LIMITS; searched: string }

/** Run the search. `anchors` are domain words a hit must also carry; pass none to skip that floor. */
export async function search(statement: string, anchors: string[] = []): Promise<Search> {
  const terms = termsOf(statement).filter((w) => !LABELS.has(w))
  const searched = new Date().toISOString()
  if (terms.filter((w) => w.length >= 4).length < 2) {
    return { terms, query: '', queries: {}, hits: [], notMeasured: [], oeis: [], verdict: 'TOO_FEW_TERMS', limits: LIMITS, searched }
  }
  const query = terms.slice(0, 8).join(' ')
  const queries: Record<string, string> = {}
  const hits: Hit[] = []
  const notMeasured: string[] = []
  for (const [name, s] of Object.entries(SOURCES)) {
    queries[name] = query
    try { hits.push(...await s.run(terms, query)) } catch { notMeasured.push(name) }
    await sleep(s.pace)
  }
  // OEIS, for any integer list in the statement. A catalogued sequence credits the SEQUENCE by its A-number
  // and says nothing about what a theorem claims of it, so it is recorded beside the verdict, never as one.
  const oeis: { a: string; name: string; query: string }[] = []
  for (const seq of sequencesIn(statement)) {
    queries['oeis:' + seq] = seq
    try {
      const j = await get(`https://oeis.org/search?q=${q(seq)}&fmt=json`)
      for (const r of (Array.isArray(j) ? j : j?.results ?? []).slice(0, 3)) oeis.push({ a: 'A' + String(r.number).padStart(6, '0'), name: String(r.name ?? '').slice(0, 160), query: seq })
    } catch { notMeasured.push('oeis:' + seq) }
    await sleep(1200)
  }
  const relevant = hits.filter((h) => h.relevance >= LIMITS.relevanceFloor
    && (anchors.length === 0 || anchors.some((a) => (h.text ?? h.title).toLowerCase().includes(a))))
    .sort((a, b) => b.relevance - a.relevance)
  const verdict: Verdict = relevant.length ? 'CANDIDATES'
    : notMeasured.length >= LIMITS.sources.length ? 'NOT_MEASURED'
    : notMeasured.length ? 'NONE_FOUND_PARTIAL' : 'NONE_FOUND'
  return { terms, query, queries, hits: relevant, notMeasured, oeis, verdict, limits: LIMITS, searched }
}
