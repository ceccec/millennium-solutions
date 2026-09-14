#!/usr/bin/env node
// USES — who uses this work, and whether each use CITES and PAYS.
//
// The author's definition, 2026-09-14: "Violations are exactly not citing and not paying." So this measures
// exactly two bits per use it finds, and nothing else — not licence wording, not how much was copied:
//   CITES — does the using page name the author: his name, ORCID, a DOI of his, or a link to his site or code?
//   PAYS  — if the use is commercial, has it paid the fixed two coins? No payment record exists anywhere yet, so
//           this bit is NOT MEASURED for every lead, and the report says so rather than guessing.
//
// WHY THIS EXISTS. Every rights mechanism before it checked the repository against itself — attribution-gate,
// rights.ts, notice.ts, citations-gate — and nothing looked outside it (survey, 2026-09-14). This fuses every
// source that answers without a key or an account:
//   gdelt · hackernews · zenodo · openalex · npm · github (code search, through gh when it is authenticated)
// A source that does not answer is NOT MEASURED — never "found nothing". A hit must contain a marker VERBATIM,
// because two of these searches are fuzzy (OpenAlex returned coal chemistry for "Rouschev"; the bare string
// "ceccec" matches random letter runs in chord and DFA test data, so it is not a marker). The author's own
// surfaces are removed: his domains, his GitHub organisations, his npm account, records authored by his ORCID.
//
//   node scripts/uses.ts               markers — the work's identifiers, searched in every source
//   node scripts/uses.ts --news        news after publication — for each day he published, same-topic news in the
//                                      3 days AFTER against the 4 days BEFORE as the control. His observation:
//                                      "a day after I publish news appear for similar breakthroughs". Timing is a
//                                      lead for him to judge, never proof that anyone copied anything.
//   --out <file.json>                  write the report as JSON
//   --summary <file.md>                append it as Markdown (CI passes $GITHUB_STEP_SUMMARY)
//
// Exit 0 when at least one source measured, whatever it found: a use by someone else is not a defect in this
// tree. Exit 1 only when NO source measured anything — a report that looked nowhere must not read as clean.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

// ── what THIS work is, read from CITATION.cff and package.json — not retyped ──────────────────────────────────
const cff = readFileSync('CITATION.cff', 'utf8')
const ORCID = cff.match(/orcid:\s*"?https?:\/\/orcid\.org\/([0-9X-]+)"?/)?.[1] ?? ''
const DOI = cff.match(/^doi:\s*"?([^"\s]+)"?/m)?.[1] ?? ''
const FAMILY = cff.match(/family-names:\s*"?([^"\n]+?)"?\s*$/m)?.[1] ?? ''
const GIVEN = cff.match(/given-names:\s*"?([^"\n]+?)"?\s*$/m)?.[1] ?? ''
const PKG = (JSON.parse(readFileSync('package.json', 'utf8')) as { name: string }).name
if (!ORCID || !DOI || !FAMILY) { console.log('✗ uses: CITATION.cff no longer carries orcid, doi and family-names — nothing to search for'); process.exit(1) }
// The sibling work by the same author, which this CITATION.cff does not describe — declared, each with its source.
const SIBLING = [
  '10.5281/zenodo.21787144', // ceccec.github.io — the repository DOI in its CITATION.cff
  '@ceccec/double-torus', //    ceccec.github.io — its npm package
  '12487536901', //             ceccec.github.io — the sequence its abstract names
]
const MARKERS = [FAMILY, ORCID, DOI, PKG, ...SIBLING]
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const CITES = new RegExp([FAMILY, ORCID, DOI, ...SIBLING.slice(0, 1), 'ceccec\\.github\\.io', 'github\\.com/ceccec/'].map((s, i) => (i < 4 ? esc(s) : s)).join('|'), 'i')
const OWN_URL = /ceccec\.github\.io|github\.com\/(ceccec|uuidna|erpax)\/|psg\.bg|uuidna\.com|erpax\.com|npmjs\.com\/package\/@(ceccec|uuidna)\//i
const OWN_AUTHOR = new RegExp(`${esc(ORCID)}|${esc(FAMILY)},?\\s*${esc(GIVEN)}|${esc(GIVEN)}\\s+${esc(FAMILY)}|^ceccec$`, 'i')

// ── the sources ──────────────────────────────────────────────────────────────────────────────────────────────
type Row = { url: string; text: string; by?: string; when?: string; raw?: string }
const UA = { 'User-Agent': 'millennium-solutions-uses/1.0 (+https://ceccec.github.io; read-only)' }
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
async function get(url: string, as: 'json' | 'text' = 'json', tries = 4): Promise<any> {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(25000), redirect: 'follow' }).catch((e: Error) => ({ ok: false, status: e.name } as const))
    if (r.ok) return as === 'json' ? (r as Response).json() : (r as Response).text()
    if (r.status !== 429) throw new Error(`HTTP ${r.status}`)
    await sleep(7000 * (i + 1)) // GDELT and OpenAlex rate-limit: back off rather than report a false NOT MEASURED
  }
  throw new Error('HTTP 429 after backoff')
}
const q = encodeURIComponent
const ghReady = (() => { try { execFileSync('gh', ['auth', 'status'], { stdio: 'pipe' }); return true } catch { return false } })()
const SOURCES: Record<string, { pace: number; run: (m: string) => Promise<Row[]> }> = {
  gdelt: { pace: 6000, run: async (m) => ((await get(`https://api.gdeltproject.org/api/v2/doc/doc?query=${q(`"${m}"`)}&mode=artlist&format=json&maxrecords=50&timespan=12m`)).articles ?? []).map((a: any) => ({ url: a.url, text: a.title ?? '', when: a.seendate })) },
  hackernews: { pace: 700, run: async (m) => (await get(`https://hn.algolia.com/api/v1/search?query=${q(`"${m}"`)}&hitsPerPage=50`)).hits.map((h: any) => ({ url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, text: `${h.title ?? ''} ${h.url ?? ''} ${h.comment_text ?? h.story_text ?? ''}`, by: h.author, when: h.created_at })) },
  // unauthenticated Zenodo caps a page at 25 records (HTTP 400 above that, measured)
  zenodo: { pace: 800, run: async (m) => (await get(`https://zenodo.org/api/records?q=${q(`"${m}"`)}&size=25`)).hits.hits.map((h: any) => ({ url: h.links?.self_html ?? `https://zenodo.org/records/${h.id}`, text: `${h.metadata?.title ?? ''} ${h.metadata?.description ?? ''} ${JSON.stringify(h.metadata?.related_identifiers ?? [])}`, by: (h.metadata?.creators ?? []).map((c: any) => `${c.name} ${c.orcid ?? ''}`).join('; '), when: h.created })) },
  openalex: { pace: 1200, run: async (m) => (await get(`https://api.openalex.org/works?search=${q(m)}&per-page=50`)).results.map((w: any) => ({ url: w.doi ?? w.id, text: `${w.title ?? ''} ${w.doi ?? ''}`, by: (w.authorships ?? []).map((a: any) => `${a.author?.display_name} ${a.author?.orcid ?? ''}`).join('; '), when: w.publication_date })) },
  npm: { pace: 700, run: async (m) => (await get(`https://registry.npmjs.org/-/v1/search?text=${q(m)}&size=50`)).objects.map((o: any) => ({ url: `https://www.npmjs.com/package/${o.package.name}`, text: JSON.stringify(o.package), by: o.package.publisher?.username, when: o.package.date })) },
  github: { pace: 7000, run: async (m) => {
    if (!ghReady) throw new Error('gh is not authenticated here')
    const hits = JSON.parse(execFileSync('gh', ['search', 'code', `"${m}"`, '--limit', '50', '--json', 'repository,path,sha,url'], { encoding: 'utf8' }))
    return hits.map((c: any) => ({ url: c.url, text: `${c.repository.nameWithOwner}/${c.path} ${m}`, by: c.repository.nameWithOwner, raw: `https://raw.githubusercontent.com/${c.repository.nameWithOwner}/${c.sha}/${c.path}` }))
  } },
}

// ── the two bits ─────────────────────────────────────────────────────────────────────────────────────────────
async function citesBit(row: Row): Promise<string> {
  if (CITES.test(row.text)) return 'YES'
  try { return CITES.test(await get(row.raw ?? row.url, 'text', 1)) ? 'YES' : 'NO' } catch (e) { return `UNREADABLE (${(e as Error).message})` }
}
const PAYS = 'NOT MEASURED — no payment record exists to check against'

type Lead = Row & { source: string; markers: string[]; cites?: string }
const report: { mode: string; when: string; sources: Record<string, { measured: number; notMeasured: string[] }>; leads: Lead[]; news?: Record<string, unknown> } =
  { mode: process.argv.includes('--news') ? 'news' : 'markers', when: new Date().toISOString(), sources: {}, leads: [] }

// ── mode 1: markers ──────────────────────────────────────────────────────────────────────────────────────────
async function markers() {
  const leads = new Map<string, Lead>()
  for (const [name, s] of Object.entries(SOURCES)) {
    report.sources[name] = { measured: 0, notMeasured: [] }
    for (const m of MARKERS) {
      try {
        const rows = await s.run(m); report.sources[name].measured++
        for (const r of rows) {
          if (!`${r.url} ${r.text}`.toLowerCase().includes(m.toLowerCase())) continue // verbatim, not fuzzy
          if (OWN_URL.test(r.url) || OWN_AUTHOR.test(r.by ?? '')) continue // his own surface
          const l = leads.get(r.url) ?? { ...r, source: name, markers: [] }
          if (!l.markers.includes(m)) l.markers.push(m)
          leads.set(r.url, l)
        }
      } catch (e) { report.sources[name].notMeasured.push(`${m}: ${(e as Error).message}`) }
      await sleep(s.pace)
    }
  }
  for (const l of leads.values()) { l.cites = await citesBit(l); report.leads.push(l); await sleep(300) }
}

// ── mode 2: news after publication ───────────────────────────────────────────────────────────────────────────
const TOPIC = '("Millennium Prize" OR "Clay Mathematics Institute" OR "Riemann hypothesis" OR "Navier-Stokes" OR "P versus NP" OR "Yang-Mills" OR "Hodge conjecture" OR "Swinnerton-Dyer" OR "Poincare conjecture")'
const HN_TERMS = ['Millennium Prize', 'Riemann hypothesis', 'Navier-Stokes', 'P vs NP', 'Yang-Mills', 'Hodge conjecture', 'Swinnerton-Dyer']
const DAY = 86400000
const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:T]/g, '').slice(0, 14)
async function publicationDays(): Promise<string[]> {
  const days = new Set<string>()
  if (ghReady) for (const r of ['ceccec/millennium-solutions', 'ceccec/ceccec.github.io']) {
    for (const x of JSON.parse(execFileSync('gh', ['release', 'list', '-R', r, '--limit', '200', '--json', 'publishedAt'], { encoding: 'utf8' })))
      if (x.publishedAt && !x.publishedAt.startsWith('0001')) days.add(x.publishedAt.slice(0, 10))
  }
  for (const p of [PKG, SIBLING[1]]) {
    const t = (await get(`https://registry.npmjs.org/${p.replace('/', '%2f')}`).catch(() => ({}))).time ?? {}
    for (const [k, v] of Object.entries(t)) if (k !== 'created' && k !== 'modified') days.add(String(v).slice(0, 10))
  }
  return [...days].sort()
}
async function news() {
  const pubs = await publicationDays()
  let after = 0, before = 0
  report.sources = { gdelt: { measured: 0, notMeasured: [] }, hackernews: { measured: 0, notMeasured: [] } }
  const leads = new Map<string, Lead>()
  for (const d of pubs) {
    const t0 = Date.parse(`${d}T00:00:00Z`)
    for (const [label, from, to] of [['before', t0 - 4 * DAY, t0], ['after', t0 + DAY / 24, t0 + 3 * DAY]] as const) {
      if (to > Date.now()) continue
      const rows: Row[] = []
      try {
        const j = await get(`https://api.gdeltproject.org/api/v2/doc/doc?query=${q(TOPIC)}&mode=artlist&format=json&maxrecords=75&startdatetime=${stamp(from)}&enddatetime=${stamp(to)}`)
        rows.push(...(j.articles ?? []).map((a: any) => ({ url: a.url, text: a.title ?? '', when: a.seendate }))); report.sources.gdelt.measured++
      } catch (e) { report.sources.gdelt.notMeasured.push(`${d} ${label}: ${(e as Error).message}`) }
      await sleep(6000)
      try {
        for (const term of HN_TERMS) {
          const j = await get(`https://hn.algolia.com/api/v1/search?query=${q(`"${term}"`)}&tags=story&numericFilters=created_at_i>${Math.floor(from / 1000)},created_at_i<${Math.floor(to / 1000)}&hitsPerPage=50`)
          rows.push(...j.hits.map((h: any) => ({ url: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, text: h.title ?? '', by: h.author, when: h.created_at })))
          await sleep(600)
        }
        report.sources.hackernews.measured++
      } catch (e) { report.sources.hackernews.notMeasured.push(`${d} ${label}: ${(e as Error).message}`) }
      if (label === 'before') before += rows.length
      else { after += rows.length; for (const r of rows) if (!leads.has(r.url)) leads.set(r.url, { ...r, source: `after ${d}`, markers: [] }) }
    }
  }
  report.news = { publicationDays: pubs, after, before, perDayAfter: +(after / (3 * pubs.length || 1)).toFixed(2), perDayBefore: +(before / (4 * pubs.length || 1)).toFixed(2) }
  for (const l of leads.values()) { l.cites = await citesBit(l); report.leads.push(l); await sleep(300) }
}

// ── run, report ─────────────────────────────────────────────────────────────────────────────────────────────
await (report.mode === 'news' ? news() : markers())
const lines: string[] = []
lines.push(`## uses — ${report.mode === 'news' ? 'news after publication' : 'who uses the work'} · ${report.when.slice(0, 16)}Z`)
lines.push(`Violations are exactly not citing and not paying. Each lead carries both bits; pays is ${PAYS.split(' — ')[0]} until a payment record exists.`)
for (const [n, s] of Object.entries(report.sources)) lines.push(`- ${n}: measured ${s.measured}${s.notMeasured.length ? ` · NOT MEASURED ${s.notMeasured.length} (${s.notMeasured[0]})` : ''}`)
if (report.news) lines.push(`- topic news per day: **after** his publications ${report.news.perDayAfter} · **before** (control) ${report.news.perDayBefore} — a pattern only if after clearly exceeds before`)
lines.push(`- leads: ${report.leads.length} (own surfaces removed${report.mode === 'markers' ? ', marker verbatim' : ''})`)
for (const l of report.leads.slice(0, 200)) lines.push(`  - [${l.source}] ${l.url} — cites: **${l.cites}** · pays: NOT MEASURED${l.markers.length ? ` · markers: ${l.markers.join(', ')}` : ''}${l.by ? ` · ${String(l.by).slice(0, 60)}` : ''}`)
const text = lines.join('\n')
console.log(text)
const arg = (flag: string) => { const i = process.argv.indexOf(flag); return i > 0 ? process.argv[i + 1] : undefined }
const out = arg('--out'); if (out) writeFileSync(out, JSON.stringify(report, null, 2) + '\n')
const summary = arg('--summary'); if (summary) appendFileSync(summary, text + '\n\n')
const measured = Object.values(report.sources).reduce((n, s) => n + s.measured, 0)
if (measured === 0) { console.log('✗ uses: no source measured anything — this report looked nowhere and is not a clean result'); process.exit(1) }
