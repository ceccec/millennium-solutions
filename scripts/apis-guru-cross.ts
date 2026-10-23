#!/usr/bin/env node
// APIS-GURU-CROSS — the spec verdict and the live verdict of every catalogued API, read against each other, offline.
//
//   node scripts/apis-guru-cross.ts
//
// No network. It reads the two committed runs for the catalogue snapshot: probe.json (scripts/apis-guru.ts, is the
// spec served and a spec?) and live.json (scripts/apis-guru-live.ts, does the API's own server answer?).
//
// The two are independent measurements of different things, so they can be cross-checked:
//   AGREE             the spec is a spec and the server answers, or both are not established
//   SERVER-ONLY       the server answers but its spec is not a served spec. The API exists; its description does not
//   SPEC-ONLY         the spec is a served spec but its server does not answer. The description exists; the API does not
//   UNCHECKED         one side was not measured, so nothing is concluded
//
// A disagreement is a finding about the catalogue or about the server, not a failure of this tool, so the exit is 0
// whenever both files are read. A missing file is a failure, named as missing.
import { readdirSync, readFileSync, existsSync } from 'node:fs'

const root = 'evidence/apis-guru'
const folder = readdirSync(root).find((f) => existsSync(`${root}/${f}/live.json`) && existsSync(`${root}/${f}/probe.json`))
if (!folder) {
  console.log('✗ MISSING: a folder with both probe.json and live.json. Run scripts/apis-guru.ts and scripts/apis-guru-live.ts first.')
  process.exit(1)
}
type Spec = { id: string; verdict: 'PROVEN' | 'WRONG' | 'NOT_MEASURED' | 'REFUSED'; why: string }
type Live = { id: string; verdict: 'REACHABLE' | 'NOT_REACHABLE' | 'REFUSED' | 'GATED' | 'NOT_MEASURED'; server: string | null; why: string }
const spec = new Map<string, Spec>((JSON.parse(readFileSync(`${root}/${folder}/probe.json`, 'utf8')) as Spec[]).map((r) => [r.id, r]))
const live = new Map<string, Live>((JSON.parse(readFileSync(`${root}/${folder}/live.json`, 'utf8')) as Live[]).map((r) => [r.id, r]))

const pairs = new Map<string, number>()
const examples: string[] = []
for (const [id, s] of spec) {
  const l = live.get(id)
  const lv = l?.verdict ?? 'MISSING'
  let relation: string
  if (s.verdict === 'PROVEN' && lv === 'REACHABLE') relation = 'AGREE'
  else if (s.verdict !== 'PROVEN' && lv === 'REACHABLE') relation = 'SERVER-ONLY'
  else if (s.verdict === 'PROVEN' && lv === 'NOT_REACHABLE') relation = 'SPEC-ONLY'
  else if (s.verdict !== 'PROVEN' && lv !== 'REACHABLE' && lv !== 'NOT_REACHABLE') relation = 'UNCHECKED'
  else relation = 'AGREE'
  const key = `${relation} · spec ${s.verdict} · live ${lv}`
  pairs.set(key, (pairs.get(key) ?? 0) + 1)
  if (relation !== 'AGREE' && relation !== 'UNCHECKED' && examples.length < 20) examples.push(`${relation.padEnd(11)} ${id}  (${s.why}; ${l?.why ?? 'no live row'})`)
}

console.log(`cross-check of ${spec.size} catalogued API(s), run ${folder}`)
for (const [k, n] of [...pairs].sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(5)}  ${k}`)
if (examples.length) { console.log('\nfirst disagreements:'); for (const e of examples) console.log(`  ${e}`) }
const missingLive = [...spec.keys()].filter((id) => !live.has(id)).length
if (missingLive) console.log(`\n${missingLive} API(s) have no live row. They are UNCHECKED, not agreed.`)
