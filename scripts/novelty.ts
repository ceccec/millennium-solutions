#!/usr/bin/env node
// NOVELTY — a prior-art search for every theorem, performed and recorded: the per-theorem half of the table.
//
// src/proof/priorart.lean classifies the 33 SOURCE FILES: 32 restate named work, one is the deposit's own table,
// and none is `none-known` — the only kind allowed to claim novelty, because it requires "a named prior-art search
// that was performed and found nothing". Until now no such search had been performed for any single theorem:
// a file is `named` because the ℤ/9 arithmetic under it is Euler's, while a statement inside it may have no
// earlier author at all, and nothing looked. The author asked for novelty discovery at scale; this is it.
//
// For each of the 632 theorems — the kernel's 641 declarations less the 9 that close by rfl, which the seal calls
// declarations, not theorems — with no key and no account:
//   OEIS       — every integer list in the statement that could be a sequence (not a hash digest, not ASCII
//                text, not a constant run) is looked up by its terms: the most exact prior-art check there is;
//   zbMATH Open, OpenAlex, Crossref, arXiv — the theorem's own terms, with its file's declared domain.
// A hit is RELEVANT when it carries most of the theorem's distinctive terms AND a specific word of its file's domain.
// The OEIS result is recorded beside the verdict, not as one: a sequence being catalogued credits the SEQUENCE by its
// A-number, and says nothing about what the theorem claims of it. The verdict is the literature's, per theorem:
//   CANDIDATES    relevant literature to read before anything is claimed;
//   NONE_FOUND    every source answered and nothing relevant came back. This is the exact content of kind 2 —
//                 "these searches, on this date, returned nothing" — and NOT "nothing earlier exists": a search
//                 by keywords can miss what it does not name. It is recorded with what, where and when.
//   NOT_MEASURED  a source did not answer; nothing is concluded.
//
// INCREMENTAL, so it can run every week at this scale: src/proof/novelty.json is keyed by the theorem's ledger key
// and carries the hash of the statement it searched. A theorem is searched again only when its statement changed
// or its record is older than --days. The file is written every ten theorems, so a long run resumes.
//
//   node scripts/novelty.ts                     search what is new, changed or stale (default: older than 30 days)
//   node scripts/novelty.ts --limit 12          at most 12 theorems this run
//   node scripts/novelty.ts --only flow.lean    one source file
//   node scripts/novelty.ts --all               search everything again
//   --days N · --summary <file.md>
import { readFileSync, writeFileSync, existsSync, appendFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { leanTheorems } from '../src/api/index.ts'

const OUT = 'src/proof/novelty.json'
const arg = (f: string) => { const i = process.argv.indexOf(f); return i > 0 ? process.argv[i + 1] : undefined }
const LIMIT = Number(arg('--limit') ?? Infinity), DAYS = Number(arg('--days') ?? 30), ONLY = arg('--only'), ALL = process.argv.includes('--all')
const UA = { 'User-Agent': 'millennium-solutions-novelty/1.0 (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
async function get(url: string, as: 'json' | 'text' = 'json', tries = 4): Promise<any> {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000), redirect: 'follow' }).catch((e: Error) => ({ ok: false, status: e.name } as const))
    if (r.ok) return as === 'json' ? (r as Response).json() : (r as Response).text()
    if (![429, 503, 'TimeoutError', 'AbortError'].includes(r.status as never)) throw new Error(`HTTP ${r.status}`)
    await sleep(10000 * (i + 1)) // arXiv and OpenAlex rate-limit and time out: back off rather than record a false NOT_MEASURED
  }
  throw new Error('rate-limited after backoff')
}
const q = encodeURIComponent

// ── the theorem's own terms, and its file's declared domain ───────────────────────────────────────────────────────
const STOP = new Set(('the a an and or of to in on by for with as at is are be it its this that these those one two three four five six seven eight nine ' +
  'ten every each all any no not only same exactly from under over into onto which when where while than then there here holds hold decide decided ' +
  'decides list range theorem lemma true false what why how both either first second third last next under per via also more most less least').split(' '))
const termsOf = (name: string) => [...new Set(name.split('_').map((w) => w.toLowerCase()).filter((w) => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w)))]
// A theorem named for a Clay problem is ABOUT the ℤ/9 structure, not the problem: navier_stokes_flow_is_bounded
// states 2^k mod 9, and searching its label returned fluid-dynamics textbooks as "prior art". The labels are
// dropped from the query and from relevance; the record keeps the name as it is.
const LABELS = new Set('navier stokes riemann hodge yang mills birch swinnerton dyer poincare poincaré clay millennium hypothesis conjecture'.split(' '))
// Domain words a hit must share to be relevant — the specific ones: "number" is in every Reynolds-number paper.
const GENERIC = new Set(('elementary theory number numbers second tier named results quantified classical ' +
  'unit units group groups order orders set sets form forms law laws').split(' ')) // a pain-scale study of intensive-care units and a Chandra study of galaxy groups both passed as "unit group"
// THE DOMAIN'S MATHEMATICAL ANCHOR. A theorem's name speaks in ordinary words (root, single, token, pair), and
// split.lean's domain ("the unit group of ℤ/9") is all generic, so the second trial let "Mandibular first molar
// with single root" and vision-transformer papers through. A hit must now carry an anchor of its file's field.
const NUMBER_THEORY = ['modulo', 'modular', 'residue', 'congruen', 'divisib', 'prime', 'integer', 'arithmetic', 'multiplicative', 'cyclic group']
const anchorCache = new Map<string, string[]>()
const anchorsOf = (file: string): string[] => {
  if (!anchorCache.has(file)) {
    const line = readFileSync(`src/proof/${file}`, 'utf8').split('\n').find((l) => /^--\s*prior_art_domain:/.test(l)) ?? ''
    anchorCache.set(file, /number theory|modular|ℤ\/9|Z\/9|unit group|residue|digital root|sequences|group theory/i.test(line)
      ? NUMBER_THEORY : domainOf(file).filter((w) => w.length >= 5))
  }
  return anchorCache.get(file)!
}
const domainCache = new Map<string, string[]>()
const domainOf = (file: string) => {
  if (!domainCache.has(file)) {
    const line = readFileSync(`src/proof/${file}`, 'utf8').split('\n').find((l) => /^--\s*prior_art_domain:/.test(l)) ?? ''
    domainCache.set(file, termsOf(line.replace(/^--\s*prior_art_domain:\s*/, '').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, '_')).filter((w) => !GENERIC.has(w)).slice(0, 4))
  }
  return domainCache.get(file)!
}
// A hit is relevant when it carries most of the theorem's distinctive (4+ letter) terms.
const relevance = (terms: string[], text: string) => {
  const t = text.toLowerCase(), key = terms.filter((w) => w.length >= 4)
  if (key.length < 2) return 0
  return key.filter((w) => t.includes(w.replace(/s$/, ''))).length / key.length
}

// ── integer lists worth asking the OEIS about ────────────────────────────────────────────────────────────────────
function sequencesIn(statement: string): string[] {
  const out: string[] = []
  for (const m of statement.matchAll(/\[(\s*-?\d+\s*(?:,\s*-?\d+\s*){3,})\]/g)) {
    const xs = m[1].split(',').map((s) => Number(s.trim()))
    if (new Set(xs).size < 3) continue //                                                   a constant or near-constant run
    if (xs.every((x, i) => i === 0 || x - xs[i - 1] === xs[1] - xs[0])) continue //         an arithmetic progression: a domain enumerated, not a sequence claimed
    if ((xs.length === 16 || xs.length === 32) && Math.max(...xs) <= 255) continue //       a hash digest
    // ASCII text: every term printable and at least three of them letters — "wave-1", "temp:21.4" and "error:404:/m"
    // mix letters with digits and punctuation, and an earlier 70%-letters rule let all five through to the OEIS.
    if (xs.every((x) => x >= 32 && x <= 126) && xs.filter((x) => /[A-Za-z]/.test(String.fromCharCode(x))).length >= 3) continue
    out.push(xs.slice(0, 12).join(','))
  }
  return [...new Set(out)]
}

// ── the sources ──────────────────────────────────────────────────────────────────────────────────────────────────
type Hit = { source: string; title: string; year?: number | string; url: string; relevance: number; text?: string }
const invert = (ix: Record<string, number[]> | undefined) => ix ? Object.entries(ix).flatMap(([w, ps]) => ps.map((p) => [p, w] as [number, string])).sort((a, b) => a[0] - b[0]).map(([, w]) => w).join(' ') : ''
const SOURCES: Record<string, { pace: number; run: (terms: string[], query: string) => Promise<Hit[]> }> = {
  // zbMATH answers an empty search with HTTP 404 and "successful access. No results found." — an answer, not a failure.
  zbmath: { pace: 1200, run: async (terms, query) => {
    const url = `https://api.zbmath.org/v1/document/_search?search_string=${q(query)}&results_per_page=5`
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
  openalex: { pace: 1200, run: async (terms, query) => ((await get(`https://api.openalex.org/works?search=${q(query)}&per-page=5`)).results ?? [])
    // mathematics or computer science only, by OpenAlex's own classification of the work
    .filter((w: any) => ['Mathematics', 'Computer Science'].includes(w.primary_topic?.field?.display_name ?? ''))
    .map((w: any) => { const text = `${w.title ?? ''} ${invert(w.abstract_inverted_index)}`; return { source: 'openalex', title: w.title ?? '', year: w.publication_year, url: w.doi ?? w.id, relevance: relevance(terms, text), text } }) },
  crossref: { pace: 1200, run: async (terms, query) => ((await get(`https://api.crossref.org/works?query=${q(query)}&rows=5`)).message?.items ?? [])
    // Crossref carries no subject, so a hit there must carry EVERY distinctive term of the theorem
    .map((w: any) => { const text = `${(w.title ?? [''])[0]} ${String(w.abstract ?? '').replace(/<[^>]+>/g, ' ')}`; const r = relevance(terms, text); return { source: 'crossref', title: (w.title ?? [''])[0], year: w.issued?.['date-parts']?.[0]?.[0], url: w.DOI ? `https://doi.org/${w.DOI}` : w.URL, relevance: r < 1 ? 0 : r, text } }) },
  arxiv: { pace: 6000, run: async (terms) => {
    // two tries, not four: a refusing arXiv costs half a minute per call, and three in a row set it aside for the run
    const x: string = await get(`https://export.arxiv.org/api/query?search_query=${q(terms.slice(0, 5).map((t) => `all:${t}`).join(' AND '))}&max_results=5`, 'text', 2)
    return x.split('<entry>').slice(1).filter((e) => /<category term="(math|cs)\./.test(e)).map((e) => {
      const tag = (t: string) => (e.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) ?? ['', ''])[1].replace(/\s+/g, ' ').trim()
      const text = `${tag('title')} ${tag('summary')}`
      return { source: 'arxiv', title: tag('title'), year: tag('published').slice(0, 4), url: tag('id'), relevance: relevance(terms, text), text }
    })
  } },
}

// ── the record ───────────────────────────────────────────────────────────────────────────────────────────────────
type Verdict = 'CANDIDATES' | 'NONE_FOUND' | 'NONE_FOUND_PARTIAL' | 'NOT_MEASURED' | 'TOO_FEW_TERMS'
type Rec = { key: string; file: string; name: string; statementHash: string; searched: string; queries: Record<string, string>
  notMeasured: string[]; oeis: { a: string; name: string; query: string }[]; catalogued: boolean; candidates: Hit[]; verdict: Verdict }
const ledger: Record<string, Rec> = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
const save = () => writeFileSync(OUT, JSON.stringify(Object.fromEntries(Object.entries(ledger).sort(([a], [b]) => a.localeCompare(b))), null, 1) + '\n')
const hash = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 16)
// A record a source did not answer is searched again on the next run, whatever its age: NOT_MEASURED is a gap, not a result.
const stale = (r: Rec | undefined, h: string) => ALL || !r || r.statementHash !== h || r.verdict === 'NOT_MEASURED' || r.verdict === 'NONE_FOUND_PARTIAL' || Date.now() - Date.parse(r.searched) > DAYS * 86400000

const todo = leanTheorems().filter((t) => (!ONLY || t.file === ONLY) && t.tactic !== 'rfl')
  .map((t) => ({ t, key: `lean_${t.namespace.toLowerCase()}_${t.name}`, h: hash(t.statement) }))
  .filter(({ key, h }) => stale(ledger[key], h)).slice(0, LIMIT)
console.log(`novelty: ${todo.length} theorem(s) to search this run · ${Object.keys(ledger).length} already on record`)

// THREE REFUSALS IN A ROW AND A SOURCE IS LEFT FOR THE NEXT RUN — any source, not only arXiv. The first full run stalled
// on OpenAlex answering 429 to every call, each refusal costing ~100 s of backoff: hours spent learning nothing. A
// refusing source now costs seconds, its records say so, and the next run asks it again.
let measured = 0, n = 0
const refusals = new Map<string, number>()
const oeisSeen = new Map<string, { a: string; name: string; query: string }[] | Error>()
for (const { t, key, h } of todo) {
  const terms = termsOf(t.name).filter((w) => !LABELS.has(w)), dom = domainOf(t.file)
  const query = [...terms.slice(0, 5), ...dom.filter((d) => !terms.includes(d)).slice(0, 3)].join(' ')
  const rec: Rec = { key, file: t.file, name: t.name, statementHash: h, searched: new Date().toISOString(), queries: {}, notMeasured: [], oeis: [], catalogued: false, candidates: [], verdict: 'NOT_MEASURED' }
  for (const seq of sequencesIn(t.statement)) {
    rec.queries[`oeis ${seq}`] = seq
    // ONE QUESTION PER SEQUENCE: the units 1,2,4,5,7,8 sit in 43 statements and would be asked 43 times.
    if (!oeisSeen.has(seq)) {
      try {
        const j = await get(`https://oeis.org/search?q=${q(seq)}&fmt=json`); measured++
        const rows = Array.isArray(j) ? j : (j?.results ?? [])
        // a sequence that merely CONTAINS the terms somewhere is not the statement's sequence: its data must begin with them
        oeisSeen.set(seq, (rows ?? []).filter((s: any) => String(s.data ?? '').replace(/\s+/g, '').startsWith(seq)).slice(0, 3)
          .map((s: any) => ({ a: `A${String(s.number).padStart(6, '0')}`, name: String(s.name ?? '').slice(0, 160), query: seq })))
      } catch (e) { oeisSeen.set(seq, new Error((e as Error).message)) }
      await sleep(1500)
    }
    const got = oeisSeen.get(seq)!
    if (got instanceof Error) rec.notMeasured.push(`oeis ${seq}: ${got.message}`); else rec.oeis.push(...got)
  }
  for (const [name, s] of Object.entries(SOURCES)) {
    rec.queries[name] = name === 'arxiv' ? terms.slice(0, 5).join(' AND ') : query
    if (terms.filter((w) => w.length >= 4).length < 2) continue
    if ((refusals.get(name) ?? 0) >= 3) { rec.notMeasured.push(`${name}: refusing this run (three refusals in a row) — retried next run`); continue }
    try {
      const hits = await s.run(terms, query); measured++; refusals.set(name, 0)
      // RELEVANT = most of the theorem's own terms AND a specific word of its file's domain, in the same hit.
      // RELEVANT = most of the theorem's own terms AND an anchor of its file's field; no anchor, no candidate claimed.
      const anchors = anchorsOf(t.file)
      rec.candidates.push(...hits.filter((x) => x.relevance >= 0.6 && anchors.length > 0 && anchors.some((a) => (x.text ?? '').toLowerCase().includes(a)))
        .map((x) => ({ ...x, text: (x.text ?? '').replace(/\s+/g, ' ').slice(0, 300) })))
    } catch (e) { rec.notMeasured.push(`${name}: ${(e as Error).message}`); refusals.set(name, (refusals.get(name) ?? 0) + 1) }
    await sleep(s.pace)
  }
  const searchable = terms.filter((w) => w.length >= 4).length >= 2
  rec.catalogued = rec.oeis.length > 0
  // ONE SOURCE DOWN IS NOT EVERY SOURCE DOWN. arXiv refused every call of the first trial, and the strict verdict filed
  // all of them NOT_MEASURED while zbMATH, OpenAlex and Crossref had answered. Three of four answering with nothing is
  // NONE_FOUND_PARTIAL — the missing source is named in the record, and the next run asks it again.
  const litMissing = rec.notMeasured.filter((m) => !m.startsWith('oeis')).length
  const oeisMissing = rec.notMeasured.some((m) => m.startsWith('oeis'))
  rec.verdict = rec.candidates.length ? 'CANDIDATES'
    : !searchable && !Object.keys(rec.queries).some((k) => k.startsWith('oeis')) ? 'TOO_FEW_TERMS'
    : !rec.notMeasured.length ? 'NONE_FOUND'
    : searchable && litMissing <= 1 && !oeisMissing ? 'NONE_FOUND_PARTIAL' : 'NOT_MEASURED'
  ledger[key] = rec
  if (++n % 10 === 0) { save(); console.log(`  … ${n}/${todo.length}`) }
}
save()

// ── report ───────────────────────────────────────────────────────────────────────────────────────────────────────
const all = Object.values(ledger)
const by = (v: Verdict) => all.filter((r) => r.verdict === v)
const lines = [
  `## novelty — a prior-art search per theorem · ${new Date().toISOString().slice(0, 16)}Z`,
  `${all.length} theorems on record · searched this run: ${todo.length} · source calls answered: ${measured}`,
  `- CANDIDATES ${by('CANDIDATES').length} — relevant literature to read before anything is claimed`,
  `- NONE_FOUND ${by('NONE_FOUND').length} — every source answered and nothing relevant came back: these searches, on this date — not "nothing earlier exists"`,
  `- NONE_FOUND_PARTIAL ${by('NONE_FOUND_PARTIAL').length} — three of the four literature sources answered with nothing relevant; the fourth is named in the record and asked again next run`,
  `- NOT_MEASURED ${by('NOT_MEASURED').length} — too many sources did not answer; nothing concluded, and the next run searches it again`,
  `- TOO_FEW_TERMS ${by('TOO_FEW_TERMS').length} — the theorem's name gives fewer than two distinctive terms and its statement no sequence to look up`,
  `- beside the verdict: ${all.filter((r) => r.catalogued).length} statements carry a sequence catalogued in the OEIS — the sequence is credited by its A-number; the claim is judged by the verdict`,
]
for (const r of all.filter((x) => x.catalogued).slice(0, 12)) lines.push(`  - ${r.key}: ${r.oeis.map((o) => `${o.a} ${o.name.slice(0, 60)}`).join(' · ')}`)
const text = lines.join('\n')
console.log(text)
const summary = arg('--summary'); if (summary) appendFileSync(summary, text + '\n\n')
if (todo.length && !measured) { console.log('✗ novelty: no source answered anything — this run looked nowhere and is not a result'); process.exit(1) }
