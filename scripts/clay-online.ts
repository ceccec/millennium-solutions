#!/usr/bin/env node
// CLAY-ONLINE — the online evidence for each Clay problem, gathered the same way every time.
//
//   node scripts/clay-online.ts
//
// For each problem it asks OpenAlex and Crossref for the three nearest literature records, and reads the Clay Institute's
// own page. Every host's robots.txt is read first, and a path it disallows for this client is skipped and named as skipped.
// One request is in flight per host, with a pause between requests to the same host.
//
// What this reports is what the sources say, nothing more. A literature hit is not a proof, and the Clay page's status is
// NOT DETERMINED from its text: the page wording is not a reliable verdict, so none is inferred here. The answer system
// (scripts/answer.ts) decides the verdicts, from the Lean statements and the citations, and this evidence does not change them.
const UA = 'millennium-solutions-clay-online/1.0 (+https://ceccec.psg.bg; one request per host at a time)'
const PAUSE_MS = 1000

const PROBLEMS: { problem: string; term: string; clay: string }[] = [
  { problem: 'Riemann Hypothesis', term: 'riemann hypothesis', clay: 'https://www.claymath.org/millennium/riemann-hypothesis/' },
  { problem: 'P versus NP', term: 'P versus NP', clay: 'https://www.claymath.org/millennium/p-vs-np/' },
  { problem: 'Navier-Stokes existence and smoothness', term: 'Navier-Stokes existence and smoothness', clay: 'https://www.claymath.org/millennium/navier-stokes-equation/' },
  { problem: 'Yang-Mills existence and mass gap', term: 'Yang-Mills existence and mass gap', clay: 'https://www.claymath.org/millennium/yang-mills-the-maths-gap/' },
  { problem: 'Hodge conjecture', term: 'Hodge conjecture', clay: 'https://www.claymath.org/millennium/hodge-conjecture/' },
  { problem: 'Birch and Swinnerton-Dyer conjecture', term: 'Birch and Swinnerton-Dyer conjecture', clay: 'https://www.claymath.org/millennium/birch-and-swinnerton-dyer-conjecture/' },
  { problem: 'Poincaré conjecture', term: 'Poincare conjecture Perelman', clay: 'https://www.claymath.org/millennium/poincare-conjecture/' },
]

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const lastAt = new Map<string, number>()

// robots.txt for this client: the rules for * and for this name, and whether a path is disallowed by a prefix match
const robotsCache = new Map<string, string[]>()
const disallowed = async (url: string): Promise<string | null> => {
  const u = new URL(url)
  if (!robotsCache.has(u.host)) {
    const r = await get(`${u.protocol}//${u.host}/robots.txt`).catch(() => ({ status: 0, text: '' }))
    const rules: string[] = []
    let applies = false
    for (const line of (r.status === 200 ? r.text : '').split('\n')) {
      const m = /^(user-agent|disallow)\s*:\s*(.*)$/i.exec(line.split('#')[0].trim())
      if (!m) continue
      if (/^user-agent$/i.test(m[1]!)) applies = m[2] === '*' || /millennium/i.test(m[2]!)
      else if (applies && m[2]) rules.push(m[2]!)
    }
    robotsCache.set(u.host, rules)
  }
  const hit = robotsCache.get(u.host)!.find((d) => u.pathname.startsWith(d))
  return hit ? `robots.txt of ${u.host} disallows ${hit}` : null
}

// A rate limit (HTTP 429) is backed off and retried, up to three times, with a longer pause each time. It is never
// read as an absence of results: a source still limited after the retries is reported as limited.
async function get(url: string): Promise<{ status: number; text: string; err?: string }> {
  const host = new URL(url).host
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = (lastAt.get(host) ?? 0) + PAUSE_MS * (attempt + 1) - Date.now()
    if (wait > 0) await sleep(wait)
    lastAt.set(host, Date.now())
    const c = new AbortController()
    const t = setTimeout(() => c.abort(), 15000)
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json, text/html' }, signal: c.signal })
      const text = await r.text()
      if (r.status !== 429) return { status: r.status, text }
      if (attempt === 3) return { status: 429, text: '', err: 'rate limited (HTTP 429) after three retries' }
    } catch (e) {
      return { status: 0, text: '', err: (e as Error).name === 'AbortError' ? 'timeout after 15 s' : String((e as Error).message).slice(0, 80) }
    } finally {
      clearTimeout(t)
    }
  }
  return { status: 429, text: '', err: 'rate limited (HTTP 429)' }
}

async function source(url: string, parse: (text: string) => unknown): Promise<unknown> {
  const skip = await disallowed(url)
  if (skip) return { skipped: skip }
  const r = await get(url)
  if (r.err) return { error: r.err }
  if (r.status !== 200) return { error: `HTTP ${r.status}` }
  return parse(r.text)
}

const rows = []
for (const p of PROBLEMS) {
  const q = encodeURIComponent(p.term)
  const openalex = await source(`https://api.openalex.org/works?search=${q}&per-page=3&select=title,publication_year,cited_by_count`, (t) =>
    (JSON.parse(t).results as { title: string; publication_year: number }[]).map((w) => `${w.title} (${w.publication_year})`))
  const crossref = await source(`https://api.crossref.org/works?query.title=${q}&rows=3&select=title,DOI`, (t) =>
    (JSON.parse(t).message.items as { title?: string[]; DOI: string }[]).map((w) => `${w.title?.[0] ?? ''} [${w.DOI}]`))
  const clay = await source(p.clay, (t) => ({ title: (/<title>([^<]*)<\/title>/.exec(t)?.[1] ?? '').trim(), verdict: 'NOT DETERMINED from page text' }))
  rows.push({ problem: p.problem, openalex, crossref, clay })
}
console.log(JSON.stringify({
  reading: 'What each source returns, not a verdict. Literature hits are not proofs; the Clay page status is not determined from its text.',
  clientRules: 'robots.txt read first per host; disallowed paths skipped and named; one request in flight per host, 1 s apart.',
  problems: rows,
}, null, 1))

export {}
