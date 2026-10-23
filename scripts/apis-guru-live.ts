#!/usr/bin/env node
// APIS-GURU-LIVE — each catalogued API's own server, asked once, when its spec allows it without a key.
//
//   node scripts/apis-guru-live.ts
//
// The spec probe (scripts/apis-guru.ts) asks whether each OpenAPI document is served and parses. This asks the next
// question: does the API's own server answer? It is a reachability fact, not a correctness fact. A 200 on the root of
// a server says the server is up; it says nothing about what the API does.
//
// For each catalogue entry, in order:
//   1 · SPEC        the spec is fetched from the catalogue. Unreadable → NOT_MEASURED.
//   2 · KEYED       the spec declares security (securitySchemes or a security requirement). Such an API is not
//                   called: a key is needed, and this tree holds none. → GATED.
//   3 · SERVER      the server is taken from the spec (`servers[0].url`, or `host` + `basePath` + `schemes` for
//                   Swagger 2). A server URL with a template variable is not guessed at → NOT_MEASURED.
//   4 · ROBOTS      robots.txt of the server's host is read once and applied with src/api/robots.ts. A disallowed
//                   root is REFUSED and not requested. An unreadable robots.txt is NOT_MEASURED.
//   5 · PROBE       one unauthenticated GET to the server root, paced to one request per second per host.
//                   Status 200–399 → REACHABLE. Anything else → NOT_REACHABLE.
//
// Concurrency: a pool of eight workers. The pacing is per host, so eight different hosts can be asked at once, and
// two requests to the same host are never closer than one second apart.
//
// The spec host and the server host are distinct hosts in general, so each is paced on its own.
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { toUuid } from '../src/0/index.ts'
import { decide } from '../src/api/robots.ts'

const UA = 'millennium-solutions/apis-guru-live (+https://ceccec.psg.bg/millennium-solutions/; read-only)'
const PAUSE_MS = 1000
const WORKERS = 8

type Entry = { id: string; title: string; provider: string; version: string; specUrl: string | null; categories: string[] }
type Verdict = 'REACHABLE' | 'NOT_REACHABLE' | 'REFUSED' | 'GATED' | 'NOT_MEASURED'
type Row = { id: string; verdict: Verdict; server: string | null; why: string }

const request = async (url: string, ms = 15_000) => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms)
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, accept: 'application/json, application/yaml, */*' }, signal: ctl.signal, redirect: 'follow' })
    return { ok: r.ok, status: r.status, text: await r.text() }
  } catch (e: any) {
    return { ok: false, status: 0, text: '', err: String(e?.name ?? 'error') }
  } finally { clearTimeout(t) }
}

// ── the catalogue snapshot written by scripts/apis-guru.ts ─────────────────────────────────────────────────────
const outRoot = 'evidence/apis-guru'
const folder = readdirSync(outRoot).find((f) => existsSync(`${outRoot}/${f}/catalogue.json`))
if (!folder) { console.log('✗ NOT MEASURED: no catalogue snapshot; run scripts/apis-guru.ts --catalogue first'); process.exit(1) }
const entries: Entry[] = JSON.parse(readFileSync(`${outRoot}/${folder}/catalogue.json`, 'utf8'))

// ── robots, read once per host ──────────────────────────────────────────────────────────────────────────────────
const robotsByHost = new Map<string, Promise<string | null>>()
const robotsFor = (origin: string): Promise<string | null> => {
  if (!robotsByHost.has(origin)) {
    robotsByHost.set(origin, request(`${origin}/robots.txt`, 10_000).then((r) =>
      r.status === 200 ? r.text : r.status === 404 ? '' : null))
  }
  return robotsByHost.get(origin)!
}

// ── pacing, per host ────────────────────────────────────────────────────────────────────────────────────────────
const lastByHost = new Map<string, number>()
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
const paced = async (host: string) => {
  const wait = PAUSE_MS - (Date.now() - (lastByHost.get(host) ?? 0))
  if (wait > 0) await sleep(wait)
  lastByHost.set(host, Date.now())
}

// ── the server of a spec, and whether it needs a key ────────────────────────────────────────────────────────────
const serverOf = (spec: any, specUrl: string): string | null | 'TEMPLATED' => {
  if (Array.isArray(spec.servers) && spec.servers.length) {
    const u = String(spec.servers[0].url ?? '')
    if (u.includes('{')) return 'TEMPLATED'
    try { return new URL(u, specUrl).href } catch { return null }
  }
  if (typeof spec.host === 'string') {
    const scheme = Array.isArray(spec.schemes) && spec.schemes.length ? spec.schemes[0] : 'https'
    if (spec.host.includes('{')) return 'TEMPLATED'
    return `${scheme}://${spec.host}${spec.basePath ?? ''}`
  }
  return null
}
const needsKey = (spec: any): boolean => {
  const schemes = spec.components?.securitySchemes ?? spec.securityDefinitions
  if (schemes && Object.keys(schemes).length) return true
  if (Array.isArray(spec.security) && spec.security.length) return true
  return false
}

// ── one API ─────────────────────────────────────────────────────────────────────────────────────────────────────
const check = async (e: Entry): Promise<Row> => {
  if (!e.specUrl) return { id: e.id, verdict: 'NOT_MEASURED', server: null, why: 'no spec URL in the catalogue' }
  const s = await request(e.specUrl)
  if (!s.ok) return { id: e.id, verdict: 'NOT_MEASURED', server: null, why: `the spec answered ${s.status || s.err}` }
  let spec: any
  try { spec = JSON.parse(s.text) } catch { return { id: e.id, verdict: 'NOT_MEASURED', server: null, why: 'the spec is not JSON' } }
  if (needsKey(spec)) return { id: e.id, verdict: 'GATED', server: null, why: 'the spec declares security; no key is held, so the API is not called' }
  const server = serverOf(spec, e.specUrl)
  if (server === 'TEMPLATED') return { id: e.id, verdict: 'NOT_MEASURED', server: null, why: 'the server URL has a template variable and is not guessed at' }
  if (!server) return { id: e.id, verdict: 'NOT_MEASURED', server: null, why: 'the spec names no server' }
  const u = new URL(server)
  const robots = await robotsFor(u.origin)
  if (robots === null) return { id: e.id, verdict: 'NOT_MEASURED', server, why: `robots.txt of ${u.host} could not be read` }
  const rule = decide(robots, UA, u.pathname + u.search)
  if (!rule.allowed) return { id: e.id, verdict: 'REFUSED', server, why: `robots.txt of ${u.host} disallows ${rule.rule?.path}` }
  await paced(u.host)
  const r = await request(server)
  if (r.status >= 200 && r.status < 400) return { id: e.id, verdict: 'REACHABLE', server, why: `answered ${r.status}` }
  return { id: e.id, verdict: 'NOT_REACHABLE', server, why: r.status ? `answered ${r.status}` : `no answer (${r.err ?? 'error'})` }
}

// ── the pool ────────────────────────────────────────────────────────────────────────────────────────────────────
const rows: Row[] = new Array(entries.length)
let next = 0
const worker = async () => {
  while (next < entries.length) {
    const i = next++
    rows[i] = await check(entries[i])
  }
}
await Promise.all(Array.from({ length: WORKERS }, worker))

const handle = toUuid(JSON.stringify(rows.map((r) => [r.id, r.verdict, r.server]))).replace(/-/g, '').slice(0, 8)
const outDir = `${outRoot}/${folder}`
mkdirSync(outDir, { recursive: true })
writeFileSync(`${outDir}/live.json`, JSON.stringify(rows, null, 1) + '\n')
const tally = (v: Verdict) => rows.filter((r) => r.verdict === v).length
console.log(`live reachability of ${rows.length} API server(s): REACHABLE ${tally('REACHABLE')} · NOT REACHABLE ${tally('NOT_REACHABLE')} · REFUSED ${tally('REFUSED')} · GATED ${tally('GATED')} · NOT MEASURED ${tally('NOT_MEASURED')}`)
console.log(`  detail: ${outDir}/live.json · run ${handle}`)
