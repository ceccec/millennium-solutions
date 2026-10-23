#!/usr/bin/env node
// API GATES — every API in the registry is a gate. Filesystem gates are checked here, on every run; online gates are
// counted and named, and are not requested (the network is asked by scripts/api-adapters.ts, when it is asked).
//
//   node scripts/api-gates.ts
//
// REFUSES when a filesystem API's file is missing, or its file no longer states the fact the adapter expects, or two
// adapters share a name. It never reaches a network: that is what keeps it safe to run on a commit.
import { existsSync, readFileSync } from 'node:fs'
import { ADAPTERS } from '../src/api/adapters.ts'
import { apiGates } from '../src/api/api-gates.ts'

const gates = apiGates()
const names = ADAPTERS.map((a) => a.name)
const dupes = names.filter((n, i) => names.indexOf(n) !== i)
const failures: string[] = []
if (dupes.length) failures.push(`duplicate adapter name(s): ${[...new Set(dupes)].join(', ')}`)

for (const a of ADAPTERS.filter((x) => x.path)) {
  if (!existsSync(a.path!)) { failures.push(`${a.name}: the file ${a.path} is missing`); continue }
  const body = readFileSync(a.path!, 'utf8')
  if (!a.expect?.(body)) failures.push(`${a.name}: ${a.path} no longer states the fact the adapter expects`)
}

const count = (k: string) => gates.filter((g) => g.kind === k).length
if (failures.length) {
  for (const f of failures) console.log(`✗ ${f}`)
  console.log(`✗ api-gates: ${failures.length} failure(s) across ${gates.length} API gate(s)`)
  process.exit(1)
}
console.log(`✓ api-gates: ${count('fs')} filesystem gate(s) hold; ${count('online')} online and ${count('gated')} gated are named, not requested — ${gates.length} API gate(s) in all`)
