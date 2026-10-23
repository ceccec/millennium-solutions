#!/usr/bin/env node
// APIS-GURU-GAPS — the hosts this tree names, set against the catalogue, offline.
//
//   node scripts/apis-guru-gaps.ts
//
// Two sets, both read, neither fetched:
//   · the hosts the source names (scripts/ and src/), the same walk the adapter registry is checked against
//   · the catalogue's APIs, each with the host of its own server (live.json, from scripts/apis-guru-live.ts)
//
// A GAP is a catalogued API whose server host the code names but the adapter registry does not cover. The code
// points at that host, nothing measures it, and it is therefore an online API this tree uses without a test.
// The other catalogued APIs are UNUSED: no line of this tree names their host.
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { COVERED_HOSTS } from '../src/api/adapters.ts'

// The catalogue names github.com as the server of three GitHub Cloud specs. Their REST API is served at api.github.com, which
// the github:api adapter calls. The live verdict in live.json is still the one against github.com; the alias says which
// adapter covers the service, and the output shows each alias rather than dropping it.
const ALIASED: Record<string, { to: string; why: string }> = {
  'github.com:ghec': { to: 'api.github.com', why: 'GitHub Enterprise Cloud REST API is served at api.github.com (github:api)' },
  'github.com:ghec.2022-11-28': { to: 'api.github.com', why: 'GitHub Enterprise Cloud REST API, 2022-11-28 version, served at api.github.com (github:api)' },
  'github.com:api.github.com.2022-11-28': { to: 'api.github.com', why: 'the api.github.com REST API, 2022-11-28 version (github:api)' },
}
// GitHub Enterprise Server and GitHub AE run on a customer's own host. github.com is not one of those instances, so no live
// adapter can be pointed at them without reporting reachability that was never measured. Recorded here, with the reason.
const UNFILLABLE: Record<string, string> = {
  ...Object.fromEntries(['3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8'].map((v) => [`github.com:ghes-${v}`, 'GitHub Enterprise Server runs on a customer host; github.com is not a GHES instance'])),
  'github.com:github.ae': 'GitHub AE runs on a customer-specific host; github.com is not that instance',
}

const walk = (dir: string): string[] => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f)
  if (statSync(p).isDirectory()) return walk(p)
  return p.endsWith('.ts') ? [p] : []
})
const named = new Set<string>()
for (const file of [...walk('scripts'), ...walk('src')]) {
  if (file.endsWith('apis-guru-gaps.ts')) continue
  for (const m of readFileSync(file, 'utf8').matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) named.add(m[1].toLowerCase().replace(/\.$/, ''))
}

const root = 'evidence/apis-guru'
const folder = readdirSync(root).find((f) => existsSync(`${root}/${f}/live.json`))
if (!folder) { console.log('✗ MISSING: no live.json. Run scripts/apis-guru-live.ts first.'); process.exit(1) }
type Live = { id: string; verdict: string; server: string | null }
const live = JSON.parse(readFileSync(`${root}/${folder}/live.json`, 'utf8')) as Live[]
const catalogue = JSON.parse(readFileSync(`${root}/${folder}/catalogue.json`, 'utf8')) as { id: string; title: string; categories: string[] }[]
const byId = new Map(catalogue.map((c) => [c.id, c]))

const gaps: Live[] = []
const aliased: Live[] = []
const unfillable: Live[] = []
let unused = 0
let covered = 0
for (const row of live) {
  const host = row.server ? new URL(row.server).host : null
  if (!host) { unused++; continue }
  if (COVERED_HOSTS.has(host)) { covered++; continue }
  if (ALIASED[row.id]) { aliased.push(row); continue }
  if (UNFILLABLE[row.id]) { unfillable.push(row); continue }
  if (named.has(host)) gaps.push(row)
  else unused++
}

console.log(`catalogue: ${live.length} API(s) · their server hosts named by this tree and covered by an adapter: ${covered}`)
console.log(`  GAPS — named by the code, no adapter: ${gaps.length}`)
for (const g of gaps) console.log(`    ${g.verdict.padEnd(13)} ${g.id}  ${byId.get(g.id)?.title ?? ''}  → ${g.server}`)
console.log(`  ALIASED — covered by an adapter for the service it serves: ${aliased.length}`)
for (const a of aliased) console.log(`    ${a.id}  → ${ALIASED[a.id].to}  (${ALIASED[a.id].why})`)
console.log(`  UNFILLABLE BY DESIGN — recorded with the reason: ${unfillable.length}`)
for (const u of unfillable) console.log(`    ${u.id}  (${UNFILLABLE[u.id]})`)
console.log(`  UNUSED — no line of this tree names the host: ${unused}`)
