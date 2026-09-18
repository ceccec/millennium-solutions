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
//   node scripts/uses.ts --constructs  his EXPRESSION, not his identifiers — the two-coin fare and its captain (mode 3):
//                                      two signals of the construct within one passage (600 characters) of each other
//   --quick                            a short local pass: three phrases, two sources, one topic query
//   --out <file.json>                  write the report as JSON
//   --summary <file.md>                append it as Markdown (CI passes $GITHUB_STEP_SUMMARY)
//
// Exit 0 when at least one source measured, whatever it found: a use by someone else is not a defect in this
// tree. Exit 1 only when NO source measured anything — a report that looked nowhere must not read as clean.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { unreflect } from '../src/honesty/index.ts'

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
// THE SCANNER MUST NOT READ ITS OWN REFLECTION. This returned exactly one CITES **YES** across 85 news leads,
// on a YouTube page — and the page cited nobody. YouTube echoes the request's User-Agent back into the HTML it
// serves, the User-Agent above carries `+https://ceccec.github.io` so a machine reading the log knows who is
// asking, and `ceccec.github.io` is one of the CITES alternatives. The single flattering result in the whole
// run was the instrument matching the string it had just sent. Any site that reflects request headers into its
// body would have done the same, so this is a class, not one page.
//
// `unreflect` is in src/honesty/index.ts with the rest of the reusable honesty tests, because the rule has
// nothing to do with citations: before testing a response for a signal, remove what the request injected.
// It is decided by the ledger — lean_… what_the_measurer_injected_is_not_evidence — over the echo, the honest
// page and the empty witness, so a strip that silently stopped removing anything would go red at the court
// rather than here, where it would be this file checking its own guard.
const SELF = UA['User-Agent']
async function citesBit(row: Row): Promise<string> {
  if (CITES.test(unreflect(row.text, SELF))) return 'YES'
  try { return CITES.test(unreflect(await get(row.raw ?? row.url, 'text', 1), SELF)) ? 'YES' : 'NO' } catch (e) { return `UNREADABLE (${(e as Error).message})` }
}
const PAYS = 'NOT MEASURED — no payment record exists to check against'

type Lead = Row & { source: string; markers: string[]; cites?: string; signals?: string[]; priority?: string; licence?: string; kind?: string }
const report: { mode: string; when: string; sources: Record<string, { measured: number; notMeasured: string[] }>; leads: Lead[]; news?: Record<string, unknown>
  constructs?: { firstUse: Record<string, string>; priorArt: { url: string; when: string; signals: string[]; firstUse: string }[]; notALead: { physics: number; wordOnly: number; unreadable: number }; forks: number } } =
  { mode: process.argv.includes('--news') ? 'news' : process.argv.includes('--constructs') ? 'constructs' : 'markers', when: new Date().toISOString(), sources: {}, leads: [] }

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

// ── mode 3: constructs — his EXPRESSION, not his identifiers ─────────────────────────────────────────────────
// The author, 2026-09-14: "Find where the 2bits are used to unlock quantum. This is not algebra and is protected by
// license … This is the core and is easy to find violations of captain rights." Mode 1 finds pages that NAME him;
// this finds pages that use what he MADE — the two-coin fare and its captain — whether or not they name him. It is
// saved from two hand-run sweeps of the same day (about 150 queries across GitHub, Zenodo, arXiv, npm, OpenAlex and
// Hugging Face, which found no third-party use), so the search runs every week instead of once.
//
// NOT MERELY THE WORD. "Captain", "two coins" and "save 64" are ordinary words: Destiny 2 has Captain Coins, a
// Minecraft mod has a Captain's Commission. A hit is a lead only when its full text carries at least TWO distinct
// signals below. Textbook two-bit physics — teleportation (Bennett et al. 1993), superdense coding (Bennett and
// Wiesner 1992) — is decades older and a different expression: counted as NOT A LEAD, never reported as one.
//
// PRIORITY IS MEASURED, NOT TYPED. His first dated use of each signal is read from GitHub commit search over his own
// repositories. A code hit is dated by when its FILE first appeared in its repository (the file's oldest commit), not
// by a paper: Prove2Me's "captain" reads 2026-08-28 from its paper and 2026-07-05 from its repository, and the second
// is the true one. A hit older than his first use of what it matches is PRIOR ART, listed apart and never mailed.
const OWNERS = ['ceccec', 'uuidna', 'erpax', 'hitsol']
const SIGNALS: [string, RegExp, string][] = [ // name · recogniser · the commit-search query for his first dated use
  ['the fare 110 − 108', /110\s*[−-]\s*108/, '"110 − 108"'],
  ['two coins', /\btwo coins\b/i, '"two coins"'],
  ['genus-2 · −χ', /genus[- ]?2|euler characteristic|[−-]χ/i, '"genus-2"'],
  ['contribute 2 · save 64', /contribute 2|save 64|up to 64 per wave/i, '"save 64"'],
  ['128-bit seal = 64 payments', /128[- ]bit (seal|address|fuse)|64 verifications|\bsealBits\b/i, '"128-bit"'],
  ['the doubling orbit mod 9', /2\s*\^\s*6\s*(≡|mod)|doubling orbit|\b1\W{1,3}2\W{1,3}4\W{1,3}8\W{1,3}7\W{1,3}5\b/i, '"doubling orbit"'],
  ['the captain construct', /captain('s)?\s+(coins?|commission|payment|message|unlocks?)/i, '"captain"'],
  ['the 64→128 fuse · quantum rosette', /quantum rosette|21\s*→\s*42|two 8\s*[×x]\s*8 boards|\bcoin64\b/i, '"quantum rosette"'],
]
const PHYSICS = /teleportation|superdense|dense coding|holevo/i
const QUICK = process.argv.includes('--quick')
const GH_PHRASES = ['"110 - 108 = 2"', '"110 − 108 = 2"', '"two coins" genus', '"two coins" "Euler characteristic"', '"contribute 2 to save 64"',
  '"contribute 2 to earn up to 64"', '"save 64" contribute', '"128-bit seal"', '"64 verifications"', 'sealBits coins', '"quantum rosette"',
  '"two 8×8 boards"', '"two 8x8 boards"', 'coin64', '"captain coins"', '"captain\'s commission"', '"captain payment"', '"captain\'s message"',
  '"free sailing angle"', '"two bits unlock"', '"the two coins" license']
const OPEN_PHRASES = ['110 − 108', 'contribute 2 to save 64', 'two coins genus', 'quantum rosette', 'captain coins', "captain's commission", '128-bit seal', 'coin64']
const TOPIC_Q = ['"Navier-Stokes" AND vortex AND ("mod 9" OR "Z/9" OR "digital root" OR "124875")', '"mod 9" AND (Millennium OR Clay OR Riemann OR "Navier-Stokes")',
  'involution AND (Millennium OR Clay) AND seven', 'captain AND (Millennium OR Clay)']
const signalsIn = (t: string) => SIGNALS.filter(([, re]) => re.test(t)).map(([n]) => n)
// TOGETHER, NOT MERELY IN THE SAME FILE. The first full run took a 320 KB collection of olympiad problems as a lead:
// "two coins" sat in a chessboard game and "Euler characteristic" in the tag of an unrelated problem, a long way
// apart. His construct states the signals together, so two of them must fall within one passage of each other.
const NEAR = 600
function signalsNear(t: string): string[] {
  const at = SIGNALS.map(([n, re]) => [n, [...t.matchAll(new RegExp(re.source, re.flags + 'g'))].slice(0, 200).map((m) => m.index ?? 0)] as [string, number[]])
  const found = new Set<string>()
  for (let i = 0; i < at.length; i++) for (let j = i + 1; j < at.length; j++)
    if (at[i][1].some((a) => at[j][1].some((b) => Math.abs(a - b) <= NEAR))) { found.add(at[i][0]); found.add(at[j][0]) }
  return [...found]
}
const ghApi = (path: string, fields: string[] = []) => JSON.parse(execFileSync('gh', ['api', '-X', 'GET', path, ...fields.flatMap((f) => ['-f', f])], { encoding: 'utf8', maxBuffer: 64 << 20 }))
const isOwn = (owner: string) => OWNERS.includes(owner.toLowerCase())
async function firstUses(): Promise<Record<string, string>> {
  const out: Record<string, string> = {}
  for (const [name, , query] of SIGNALS) {
    try {
      const j = ghApi('search/commits', [`q=${query} ${OWNERS.map((o) => (o === 'ceccec' || o === 'uuidna' || o === 'erpax' || o === 'hitsol') ? `user:${o}` : '').join(' ')}`, 'sort=committer-date', 'order=asc', 'per_page=1'])
      const c = j.items?.[0]
      out[name] = c ? `${c.commit.committer.date.slice(0, 10)} ${c.repository.full_name}@${c.sha.slice(0, 9)}` : 'NOT FOUND in his commit messages'
    } catch (e) { out[name] = `NOT MEASURED (${(e as Error).message.split('\n')[0]})` }
    await sleep(2500)
  }
  return out
}
const dateOf = (s: string) => (/^\d{4}-\d{2}-\d{2}/.exec(s) ?? [''])[0]
function priorityOf(when: string, sigs: string[], first: Record<string, string>): { prior: boolean; text: string } {
  const dates = sigs.map((n) => dateOf(first[n] ?? '')).filter(Boolean).sort()
  if (!when || !dates.length) return { prior: false, text: 'NOT MEASURED — no date for the hit or for his first use' }
  const his = dates[0]
  return when.slice(0, 10) < his
    ? { prior: true, text: `PREDATES his first dated use (${his}) — prior art, not a lead` }
    : { prior: false, text: `AFTER his first dated use of what it matches (${his}; ${sigs.map((n) => `${n}: ${first[n]}`).join(' · ')})` }
}
async function constructs() {
  const first = await firstUses()
  const cx = report.constructs = { firstUse: first, priorArt: [] as { url: string; when: string; signals: string[]; firstUse: string }[], notALead: { physics: 0, wordOnly: 0, unreadable: 0 }, forks: 0 }
  const leads = new Map<string, Lead>()
  const judge = async (r: Row, source: string, kind: 'expression' | 'topic', full?: string) => {
    if (OWN_URL.test(r.url) || OWN_AUTHOR.test(r.by ?? '') || leads.has(r.url)) return
    // THE SIGNALS ARE COUNTED IN WHAT THE HIT SAYS, NEVER IN WHAT WAS ASKED. The first run put the search query into
    // the text it then judged, so a query carrying two signals confirmed itself, and a file nobody could read (its raw
    // URL was built from the BLOB sha, which 404s) came out as a lead. A hit whose content cannot be read is counted
    // UNREADABLE and judged nothing.
    let text = `${r.text} ${full ?? ''}`
    if (!full && r.raw) {
      try { text += ' ' + await get(r.raw, 'text', 1) } catch { if (kind === 'expression') { cx.notALead.unreadable++; return } }
    }
    const sigs = kind === 'expression' ? signalsNear(text) : signalsIn(text)
    if (kind === 'expression' && sigs.length < 2) { if (PHYSICS.test(text)) cx.notALead.physics++; else cx.notALead.wordOnly++; return }
    const pr = priorityOf(r.when ?? '', sigs, first)
    if (pr.prior) { cx.priorArt.push({ url: r.url, when: r.when ?? '', signals: sigs, firstUse: pr.text }); return }
    leads.set(r.url, { ...r, source, kind, markers: [], signals: sigs, priority: pr.text })
  }
  // GitHub code — the phrases as real search queries (the gh CLI would send a multi-word query as one exact phrase)
  report.sources.github = { measured: 0, notMeasured: [] }
  for (const ph of QUICK ? GH_PHRASES.slice(0, 3) : GH_PHRASES) {
    try {
      const items = ghApi('search/code', [`q=${ph}`, 'per_page=50']).items ?? []; report.sources.github.measured++
      for (const it of items) {
        const repo = it.repository.full_name as string
        if (isOwn(repo.split('/')[0]) || it.repository.fork) continue
        let when = ''
        try { const cs = ghApi(`repos/${repo}/commits`, [`path=${it.path}`, 'per_page=100']); when = cs.length ? cs[cs.length - 1].commit.committer.date : '' } catch { /* undated */ }
        const raw = String(it.html_url).replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/')
        await judge({ url: it.html_url, text: `${repo}/${it.path}`, by: repo, when, raw }, 'github', 'expression')
      }
    } catch (e) { report.sources.github.notMeasured.push(`${ph}: ${(e as Error).message.split('\n')[0]}`) }
    await sleep(7000)
  }
  // the open sources, the distinctive phrases verbatim
  for (const name of QUICK ? ['zenodo'] : ['zenodo', 'openalex', 'npm', 'hackernews']) {
    report.sources[name] = { measured: 0, notMeasured: [] }
    for (const ph of QUICK ? OPEN_PHRASES.slice(0, 3) : OPEN_PHRASES) {
      try { for (const r of await SOURCES[name].run(ph)) await judge(r, name, 'expression'); report.sources[name].measured++ }
      catch (e) { report.sources[name].notMeasured.push(`${ph}: ${(e as Error).message}`) }
      await sleep(SOURCES[name].pace)
    }
  }
  // arXiv and Hugging Face
  if (!QUICK) {
    report.sources.arxiv = { measured: 0, notMeasured: [] }
    for (const ph of OPEN_PHRASES) {
      try {
        const x: string = await get(`https://export.arxiv.org/api/query?search_query=${q(`all:"${ph}"`)}&max_results=25`, 'text')
        for (const e of x.split('<entry>').slice(1)) {
          const tag = (t: string) => (e.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)) ?? ['', ''])[1].replace(/\s+/g, ' ').trim()
          await judge({ url: tag('id'), text: `${tag('title')} ${tag('summary')}`, by: tag('name'), when: tag('published') }, 'arxiv', 'expression', tag('summary'))
        }
        report.sources.arxiv.measured++
      } catch (e) { report.sources.arxiv.notMeasured.push(`${ph}: ${(e as Error).message}`) }
      await sleep(3500)
    }
    report.sources.huggingface = { measured: 0, notMeasured: [] }
    for (const kind of ['models', 'datasets', 'spaces']) for (const term of ['coin64', 'quantum-rosette', 'captain-coins', 'two-coins']) {
      try { for (const h of await get(`https://huggingface.co/api/${kind}?search=${q(term)}&limit=50`)) await judge({ url: `https://huggingface.co/${kind === 'models' ? '' : kind + '/'}${h.id}`, text: h.id, by: String(h.id).split('/')[0], when: h.createdAt ?? h.lastModified }, 'huggingface', 'expression'); report.sources.huggingface.measured++ }
      catch (e) { report.sources.huggingface.notMeasured.push(`${kind} ${term}: ${(e as Error).message}`) }
      await sleep(800)
    }
  }
  // the Zenodo topic watch — the same field after his first dated use, each record read for its licence and references
  report.sources['zenodo-topic'] = { measured: 0, notMeasured: [] }
  const earliest = Object.values(first).map(dateOf).filter(Boolean).sort()[0] ?? ''
  for (const tq of QUICK ? TOPIC_Q.slice(0, 1) : TOPIC_Q) {
    try {
      const j = await get(`https://zenodo.org/api/records?q=${q(tq)}&size=25&sort=mostrecent`); report.sources['zenodo-topic'].measured++
      for (const h of j.hits.hits) {
        const m = h.metadata ?? {}
        const by = (m.creators ?? []).map((c: any) => `${c.name} ${c.orcid ?? ''}`).join('; ')
        if (OWN_AUTHOR.test(by) || (earliest && String(m.publication_date ?? '') < earliest)) continue
        const url = h.links?.self_html ?? `https://zenodo.org/records/${h.id}`
        if (leads.has(url)) continue
        const text = `${m.title ?? ''} ${String(m.description ?? '').replace(/<[^>]+>/g, ' ')} ${JSON.stringify(m.references ?? [])} ${JSON.stringify(m.related_identifiers ?? [])}`
        const sigs = signalsIn(text)
        leads.set(url, { url, text: `${m.title ?? ''}`, by, when: m.publication_date, source: 'zenodo-topic', kind: 'topic', markers: [], signals: sigs,
          licence: typeof m.license === 'object' ? m.license?.id : m.license, cites: CITES.test(text) ? 'YES' : 'NO',
          priority: `published ${m.publication_date}, after his earliest dated use (${earliest}) — the same field, not his expression${sigs.length ? `; signals: ${sigs.join(', ')}` : ''}` })
      }
    } catch (e) { report.sources['zenodo-topic'].notMeasured.push(`${tq}: ${(e as Error).message}`) }
    await sleep(3000)
  }
  // forks of his repositories by anyone else — a fork is a copy of the whole work
  report.sources.forks = { measured: 0, notMeasured: [] }
  for (const o of QUICK ? ['ceccec'] : OWNERS) {
    try {
      const repos = ghApi(`users/${o}/repos`, ['per_page=100']) as any[]; report.sources.forks.measured++
      for (const r of repos.filter((x) => !x.fork && x.forks_count > 0)) {
        for (const f of ghApi(`repos/${r.full_name}/forks`, ['per_page=100']) as any[]) {
          if (isOwn(f.owner.login)) continue
          cx.forks++
          leads.set(f.html_url, { url: f.html_url, text: `fork of ${r.full_name} (${r.license?.spdx_id ?? 'licence not detected'})`, by: f.owner.login, when: f.created_at,
            source: 'forks', kind: 'expression', markers: [], signals: ['a fork of his repository'], priority: `forked ${f.created_at.slice(0, 10)} from ${r.full_name}`,
            cites: `YES — GitHub records it as forked from ${r.full_name}` })
        }
      }
    } catch (e) { report.sources.forks.notMeasured.push(`${o}: ${(e as Error).message.split('\n')[0]}`) }
  }
  for (const l of leads.values()) { if (!l.cites) { l.cites = await citesBit(l); await sleep(300) } report.leads.push(l) }
}

// ── run, report ─────────────────────────────────────────────────────────────────────────────────────────────
await (report.mode === 'news' ? news() : report.mode === 'constructs' ? constructs() : markers())
const lines: string[] = []
lines.push(`## uses — ${report.mode === 'news' ? 'news after publication' : report.mode === 'constructs' ? 'who uses the constructs — the two-coin fare and its captain' : 'who uses the work'} · ${report.when.slice(0, 16)}Z`)
lines.push(`Violations are exactly not citing and not paying. Each lead carries both bits; pays is ${PAYS.split(' — ')[0]} until a payment record exists.`)
for (const [n, s] of Object.entries(report.sources)) lines.push(`- ${n}: measured ${s.measured}${s.notMeasured.length ? ` · NOT MEASURED ${s.notMeasured.length} (${s.notMeasured[0]})` : ''}`)
if (report.constructs) {
  const c = report.constructs
  lines.push(`- his first dated use, per signal (GitHub commit search over his repositories): ${Object.entries(c.firstUse).map(([k, v]) => `${k}: ${v}`).join(' · ')}`)
  lines.push(`- not a lead: ${c.notALead.physics} textbook two-bit physics · ${c.notALead.wordOnly} the words only (under two signals) · ${c.notALead.unreadable} unreadable (not judged) · prior art (older than his first use): ${c.priorArt.length} · third-party forks: ${c.forks}`)
}
if (report.news) lines.push(`- topic news per day: **after** his publications ${report.news.perDayAfter} · **before** (control) ${report.news.perDayBefore} — a pattern only if after clearly exceeds before`)
lines.push(`- leads: ${report.leads.length} (own surfaces removed${report.mode === 'markers' ? ', marker verbatim' : ''})`)
for (const l of report.leads.slice(0, 200)) lines.push(`  - [${l.source}] ${l.url} — cites: **${l.cites}** · pays: NOT MEASURED${l.markers.length ? ` · markers: ${l.markers.join(', ')}` : ''}${l.signals?.length ? ` · signals: ${l.signals.join(', ')}` : ''}${l.licence ? ` · licence: ${l.licence}` : ''}${l.by ? ` · ${String(l.by).slice(0, 60)}` : ''}`)
const text = lines.join('\n')
console.log(text)
const arg = (flag: string) => { const i = process.argv.indexOf(flag); return i > 0 ? process.argv[i + 1] : undefined }
const out = arg('--out'); if (out) writeFileSync(out, JSON.stringify(report, null, 2) + '\n')
const summary = arg('--summary'); if (summary) appendFileSync(summary, text + '\n\n')
const measured = Object.values(report.sources).reduce((n, s) => n + s.measured, 0)
if (measured === 0) { console.log('✗ uses: no source measured anything — this report looked nowhere and is not a clean result'); process.exit(1) }
