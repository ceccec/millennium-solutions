#!/usr/bin/env node
// LINKS-CHECK — every external link in README.md and index.md, checked once, the same way every time.
//
//   node scripts/links-check.ts
//
// Each host's robots.txt is read first. A link whose path that robots.txt disallows for this client is skipped and named,
// never requested. One request is in flight per host, with a pause between requests to the same host. A HEAD request is
// tried first; a refusal of HEAD (405 or 403) is retried as GET. A 429 is backed off and retried. A link is reported as
// LIVE (2xx or 3xx), DEAD (4xx or 5xx after the retries, with the status), or UNREACHABLE (no answer, with the reason).
import { readFileSync } from 'node:fs'

const UA = 'millennium-solutions-links-check/1.0 (+https://ceccec.psg.bg; one request per host at a time)'
const PAUSE_MS = 1000

const links = new Set<string>()
for (const f of ['README.md', 'index.md']) {
  for (const m of readFileSync(f, 'utf8').matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)) links.add(m[1]!.replace(/[.,;]+$/, ''))
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const lastAt = new Map<string, number>()
const robots = new Map<string, string[]>()

async function fetchOnce(url: string, method: 'HEAD' | 'GET'): Promise<{ status: number; err?: string }> {
  const c = new AbortController()
  const t = setTimeout(() => c.abort(), 15000)
  try {
    const r = await fetch(url, { method, redirect: 'follow', headers: { 'user-agent': UA }, signal: c.signal })
    if (method === 'GET') await r.body?.cancel()
    return { status: r.status }
  } catch (e) {
    return { status: 0, err: (e as Error).name === 'AbortError' ? 'timeout after 15 s' : String((e as Error).message).slice(0, 80) }
  } finally {
    clearTimeout(t)
  }
}

// a request to one host at a time, with a pause; a 429 is backed off up to three times
async function request(url: string, method: 'HEAD' | 'GET'): Promise<{ status: number; err?: string }> {
  const host = new URL(url).host
  let last: { status: number; err?: string } = { status: 0 }
  for (let attempt = 0; attempt < 4; attempt++) {
    const wait = (lastAt.get(host) ?? 0) + PAUSE_MS * (attempt + 1) - Date.now()
    if (wait > 0) await sleep(wait)
    lastAt.set(host, Date.now())
    last = await fetchOnce(url, method)
    if (last.status !== 429) return last
  }
  return { status: 429, err: 'rate limited (HTTP 429) after three retries' }
}

async function disallowedBy(url: string): Promise<string | null> {
  const u = new URL(url)
  if (!robots.has(u.host)) {
    const r = await request(`${u.protocol}//${u.host}/robots.txt`, 'GET')
    const text = r.status === 200 ? await fetch(`${u.protocol}//${u.host}/robots.txt`, { headers: { 'user-agent': UA } }).then((x) => x.text()).catch(() => '') : ''
    const rules: string[] = []
    let applies = false
    for (const line of text.split('\n')) {
      const m = /^(user-agent|disallow)\s*:\s*(.*)$/i.exec(line.split('#')[0]!.trim())
      if (!m) continue
      if (/^user-agent$/i.test(m[1]!)) applies = m[2] === '*' || /millennium/i.test(m[2]!)
      else if (applies && m[2]) rules.push(m[2]!)
    }
    robots.set(u.host, rules)
  }
  const hit = robots.get(u.host)!.find((d) => u.pathname.startsWith(d))
  return hit ? `robots.txt of ${u.host} disallows ${hit}` : null
}

const rows: { url: string; verdict: string; status?: number; why?: string }[] = []
for (const url of [...links].sort()) {
  const skip = await disallowedBy(url)
  if (skip) { rows.push({ url, verdict: 'SKIPPED', why: skip }); continue }
  let r = await request(url, 'HEAD')
  if (r.status === 405 || r.status === 403 || r.status === 0) r = await request(url, 'GET')
  const verdict = r.status >= 200 && r.status < 400 ? 'LIVE' : r.status >= 400 ? 'DEAD' : 'UNREACHABLE'
  rows.push({ url, verdict, status: r.status || undefined, why: r.err })
}
const tally: Record<string, number> = {}
for (const r of rows) tally[r.verdict] = (tally[r.verdict] ?? 0) + 1
console.log(JSON.stringify({ checked: rows.length, tally, rows }, null, 1))

export {}
