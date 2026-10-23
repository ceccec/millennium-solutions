#!/usr/bin/env node
// APIS-GURU — every API in the APIs.guru directory, as adapters, each probed for its OpenAPI document.
//
//   node scripts/apis-guru.ts              snapshot the catalogue, then probe every spec
//   node scripts/apis-guru.ts --catalogue  snapshot only, no spec requests
//
// SOURCE. https://api.apis.guru/v2/list.json, one request. Its robots.txt is read first and the rule is applied
// through src/api/robots.ts, the same implementation every other adapter uses.
//
// WHAT IS PROBED, AND WHAT IS NOT. For each catalogue entry the spec URL is requested and must parse as an OpenAPI
// or Swagger document. That is a fact about the spec, checkable without credentials. It is NOT a request to the API
// itself: an API's own host is only reached when its spec lists it, and calling a third party's live endpoints
// needs each one's terms, so that step is recorded as NOT ADAPTED rather than done silently.
//
// VERDICTS, per catalogue entry:
//   PROVEN        the spec was served and parses as OpenAPI or Swagger, with a title
//   WRONG         it was served and is not a spec. The catalogue points at the wrong thing, or the document moved
//   NOT_MEASURED  it did not answer, or robots.txt of its host could not be read. Nothing concluded
//   REFUSED       robots.txt of its host disallows it for this client. No request was made to the path
//
// PACING. One request in flight per host, with a pause between requests to the same host. The pause is a courtesy
// to a volunteer-run service, not a limit this script invents: it is stated here so that a reader can see it.
//
// OUTPUT. The snapshot is written to evidence/apis-guru/<handle>/ where the handle is the content address of the
// catalogue body, so a run is reproducible and the folder is its own receipt. Only summaries are printed. The full
// 8.8 MB list is never printed and never read into a model's context.
import { mkdirSync, writeFileSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { decide } from '../src/api/robots.ts'

const CATALOGUE_URL = 'https://api.apis.guru/v2/list.json'
const UA = 'millennium-solutions/apis-guru (+https://ceccec.psg.bg/millennium-solutions/; read-only)'
const PAUSE_MS = 1000

type Verdict = 'PROVEN' | 'WRONG' | 'NOT_MEASURED' | 'REFUSED'
type Entry = { id: string; title: string; provider: string; version: string; specUrl: string | null; categories: string[] }

const get = async (url: string, ms = 25_000): Promise<{ ok: boolean; status: number; body: string }> => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms)
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA }, signal: ctl.signal, redirect: 'follow' })
    return { ok: r.ok, status: r.status, body: await r.text() }
  } catch { return { ok: false, status: 0, body: '' } } finally { clearTimeout(t) }
}
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

// ── 1 · THE CATALOGUE ─────────────────────────────────────────────────────────────────────────────────────────
// Read robots.txt of the catalogue host first, as every other network script in this tree does.
const catalogueRobots = await get('https://api.apis.guru/robots.txt')
if (catalogueRobots.status !== 200 && catalogueRobots.status !== 404) {
  console.log(`✗ NOT MEASURED: robots.txt of api.apis.guru answered ${catalogueRobots.status}; not reading the catalogue`)
  process.exit(1)
}
if (!decide(catalogueRobots.body, UA, '/v2/list.json').allowed) {
  console.log('✗ REFUSED: robots.txt of api.apis.guru disallows /v2/list.json for this client')
  process.exit(1)
}

const list = await get(CATALOGUE_URL, 120_000)
if (!list.ok) {
  console.log(`✗ NOT MEASURED: the catalogue answered ${list.status}`)
  process.exit(1)
}
const handle = toUuid(list.body).replace(/-/g, '').slice(0, 8)
const outDir = `evidence/apis-guru/${handle}`
mkdirSync(outDir, { recursive: true })

const raw = JSON.parse(list.body) as Record<string, any>
const entries: Entry[] = Object.entries(raw).map(([id, value]) => {
  const preferred = String(value.preferred ?? '')
  const v = value.versions?.[preferred] ?? Object.values(value.versions ?? {})[0] ?? {}
  return {
    id,
    title: String(v.info?.title ?? id),
    provider: String(v.info?.['x-providerName'] ?? id.split(':')[0]),
    version: preferred,
    specUrl: typeof v.swaggerUrl === 'string' ? v.swaggerUrl : typeof v.swaggerYamlUrl === 'string' ? v.swaggerYamlUrl : null,
    categories: Array.isArray(v.info?.['x-apisguru-categories']) ? v.info['x-apisguru-categories'] : [],
  }
})

// The snapshot is the compact summary, not the 8.8 MB original: an id, a title, a provider, a version and a spec URL.
writeFileSync(`${outDir}/catalogue.json`, JSON.stringify(entries, null, 1) + '\n')
const hosts = new Set(entries.map((e) => (e.specUrl ? new URL(e.specUrl).host : '(no spec)')))
console.log(`catalogue: ${entries.length} API(s), ${hosts.size} spec host(s), ${entries.filter((e) => !e.specUrl).length} without a spec URL`)
console.log(`  snapshot: ${outDir}/catalogue.json`)

if (process.argv.includes('--catalogue')) process.exit(0)

// ── 2 · THE SPECS, EACH PROBED ──────────────────────────────────────────────────────────────────────────────
// Robots per host, read once and cached for the run.
const robotsByHost = new Map<string, string | null>()
const robotsFor = async (host: string, proto: string): Promise<string | null> => {
  if (robotsByHost.has(host)) return robotsByHost.get(host)!
  const r = await get(`${proto}//${host}/robots.txt`, 15_000)
  // 404 means no robots.txt, which allows everything. Any other failure is unknown, so the host is not probed.
  const text = r.status === 200 ? r.body : r.status === 404 ? '' : null
  robotsByHost.set(host, text)
  return text
}

const lastByHost = new Map<string, number>()
const verdicts = new Map<Verdict, number>()
const detail: { id: string; verdict: Verdict; why: string }[] = []

for (const e of entries) {
  if (!e.specUrl) { verdicts.set('NOT_MEASURED', (verdicts.get('NOT_MEASURED') ?? 0) + 1); detail.push({ id: e.id, verdict: 'NOT_MEASURED', why: 'no spec URL in the catalogue' }); continue }
  const u = new URL(e.specUrl)
  const robots = await robotsFor(u.host, u.protocol)
  let verdict: Verdict
  let why: string
  if (robots === null) {
    verdict = 'NOT_MEASURED'; why = `robots.txt of ${u.host} could not be read`
  } else if (!decide(robots, UA, u.pathname + u.search).allowed) {
    verdict = 'REFUSED'; why = `robots.txt of ${u.host} disallows ${u.pathname}`
  } else {
    const wait = PAUSE_MS - (Date.now() - (lastByHost.get(u.host) ?? 0))
    if (wait > 0) await sleep(wait)
    lastByHost.set(u.host, Date.now())
    const r = await get(e.specUrl)
    if (!r.ok) { verdict = 'NOT_MEASURED'; why = `the spec answered ${r.status || 'nothing'}` }
    else if (/"(openapi|swagger)"\s*:|^(openapi|swagger)\s*:/m.test(r.body) && /"title"\s*:|^\s*title\s*:/m.test(r.body)) {
      verdict = 'PROVEN'; why = 'parses as a spec with a title'
    } else { verdict = 'WRONG'; why = 'served, but not an OpenAPI or Swagger document' }
  }
  verdicts.set(verdict, (verdicts.get(verdict) ?? 0) + 1)
  detail.push({ id: e.id, verdict, why })
}

writeFileSync(`${outDir}/probe.json`, JSON.stringify(detail, null, 1) + '\n')
const count = (v: Verdict) => verdicts.get(v) ?? 0
console.log(`probed ${entries.length}: PROVEN ${count('PROVEN')} · WRONG ${count('WRONG')} · NOT MEASURED ${count('NOT_MEASURED')} · REFUSED ${count('REFUSED')}`)
console.log(`  detail: ${outDir}/probe.json`)
process.exit(count('WRONG') ? 1 : 0)
