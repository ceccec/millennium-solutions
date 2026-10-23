#!/usr/bin/env node
// API-ADAPTERS — every adapter in src/api/adapters.ts, asked live, one verdict each.
//
//   node scripts/api-adapters.ts             probe every adapter
//   node scripts/api-adapters.ts --name osv  only the adapters whose name contains "osv"
//
// For each adapter, in order:
//   1 · GATED         it needs a key, a licence or an endpoint that does not exist. No request is made.
//   2 · ROBOTS        robots.txt of its host is read once and applied with src/api/robots.ts. A disallowed path
//                     is REFUSED and never requested. A robots.txt that cannot be read is NOT MEASURED, because
//                     an unknown rule is not a permission.
//   3 · PROBE         the request is made, paced to one per second per host.
//   4 · CHECK         the reply must contain the fact the adapter states. A reply that does not is WRONG.
//
// VERDICTS
//   PROVEN        the reply contains the fact the adapter states
//   WRONG         the host answered, and the fact is not in the reply. Either the adapter points at the wrong
//                 thing, or the fact is my recollection. Both are defects and this run fails on them
//   NOT_MEASURED  the host did not answer, or its robots.txt could not be read. Nothing is concluded
//   REFUSED       robots.txt disallows the path for this client
//   GATED         the adapter needs a credential or licence, or has no endpoint to ask
//
// NETWORK. Registered in src/api/gates.ts NETWORK, so it is never in a build chain.
import { ADAPTERS, type Adapter } from '../src/api/adapters.ts'
import { decide } from '../src/api/robots.ts'

const UA = 'millennium-solutions/api-adapters (+https://ceccec.psg.bg/millennium-solutions/; read-only)'
const PAUSE_MS = 1000
const nameArg = process.argv.includes('--name') ? process.argv[process.argv.indexOf('--name') + 1] : null

type Verdict = 'PROVEN' | 'WRONG' | 'NOT_MEASURED' | 'REFUSED' | 'GATED'
const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))

const request = async (url: string, method: 'GET' | 'POST', body?: string, ms = 15_000) => {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms)
  try {
    const r = await fetch(url, {
      method, body, redirect: 'follow', signal: ctl.signal,
      headers: { 'user-agent': UA, ...(body ? { 'content-type': 'application/json', accept: 'application/json' } : {}) },
    })
    return { ok: r.ok, status: r.status, text: await r.text() }
  } catch (e: any) {
    return { ok: false, status: 0, text: '', err: String(e?.name ?? 'error') }
  } finally { clearTimeout(t) }
}

// robots.txt per host, read once per run. 404 means no robots.txt, which allows everything; any other failure is unknown.
const robotsByHost = new Map<string, string | null>()
const robotsFor = async (host: string): Promise<string | null> => {
  if (!robotsByHost.has(host)) {
    const r = await request(`https://${host}/robots.txt`, 'GET', undefined, 10_000)
    robotsByHost.set(host, r.status === 200 ? r.text : r.status === 404 ? '' : null)
  }
  return robotsByHost.get(host)!
}

const lastByHost = new Map<string, number>()
const paced = async (host: string) => {
  const wait = PAUSE_MS - (Date.now() - (lastByHost.get(host) ?? 0))
  if (wait > 0) await sleep(wait)
  lastByHost.set(host, Date.now())
}

const probe = async (a: Adapter): Promise<{ verdict: Verdict; why: string }> => {
  if (a.auth !== 'none' || !a.url) return { verdict: 'GATED', why: a.auth === 'none' ? 'no endpoint to ask' : `needs ${a.auth}` }
  const robots = await robotsFor(a.host)
  if (robots === null) return { verdict: 'NOT_MEASURED', why: `robots.txt of ${a.host} could not be read` }
  const path = new URL(a.url).pathname + new URL(a.url).search
  const rule = decide(robots, UA, path)
  if (!rule.allowed) return { verdict: 'REFUSED', why: `robots.txt of ${a.host} disallows ${rule.rule?.path}` }
  await paced(a.host)
  const r = await request(a.url, a.method ?? 'GET', a.body)
  if (!r.ok) return { verdict: 'NOT_MEASURED', why: r.status ? `answered ${r.status}` : `no answer (${r.err ?? 'error'})` }
  if (!a.expect) return { verdict: 'WRONG', why: 'no fact to check the reply against' }
  return a.expect(r.text)
    ? { verdict: 'PROVEN', why: 'the reply contains the stated fact' }
    : { verdict: 'WRONG', why: `answered ${r.status}, but the stated fact is not in the reply` }
}

const selected = ADAPTERS.filter((a) => !nameArg || a.name.includes(nameArg))
const tally = new Map<Verdict, number>()
for (const a of selected) {
  const { verdict, why } = await probe(a)
  tally.set(verdict, (tally.get(verdict) ?? 0) + 1)
  console.log(`${verdict.padEnd(12)} ${a.name.padEnd(20)} ${why}`)
}
const n = (v: Verdict) => tally.get(v) ?? 0
console.log(`\n${selected.length} adapter(s): PROVEN ${n('PROVEN')} · WRONG ${n('WRONG')} · NOT MEASURED ${n('NOT_MEASURED')} · REFUSED ${n('REFUSED')} · GATED ${n('GATED')}`)
process.exit(n('WRONG') ? 1 : 0)
