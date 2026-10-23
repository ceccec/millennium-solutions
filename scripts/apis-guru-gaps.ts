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
let unused = 0
let covered = 0
for (const row of live) {
  const host = row.server ? new URL(row.server).host : null
  if (!host) { unused++; continue }
  if (COVERED_HOSTS.has(host)) { covered++; continue }
  if (named.has(host)) gaps.push(row)
  else unused++
}

console.log(`catalogue: ${live.length} API(s) · their server hosts named by this tree and covered by an adapter: ${covered}`)
console.log(`  GAPS — named by the code, no adapter: ${gaps.length}`)
for (const g of gaps) console.log(`    ${g.verdict.padEnd(13)} ${g.id}  ${byId.get(g.id)?.title ?? ''}  → ${g.server}`)
console.log(`  UNUSED — no line of this tree names the host: ${unused}`)
