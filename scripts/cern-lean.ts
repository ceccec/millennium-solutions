#!/usr/bin/env node
// CERN-LEAN — the measured figures of src/proof/cern.lean, derived from the cache the measurement scripts wrote.
//
//   node scripts/cern-lean.ts          rewrite the literals in src/proof/cern.lean from .cern/corpus.json and .cern/oai.json
//
// The theorems are not generated and are not touched: only the numbers in the definitions change, so each theorem is
// checked again against the current measurement. Before this existed, the literals were typed by hand and went stale:
// the file proved the September counts while the cache held the October ones.
import { readFileSync, writeFileSync } from 'node:fs'

const corpus = JSON.parse(readFileSync('.cern/corpus.json', 'utf8')) as Record<string, number | number[]>
const oai = JSON.parse(readFileSync('.cern/oai.json', 'utf8')) as Record<string, number>
const FROM_CORPUS = ['sitemaps', 'urls', 'listedRecordUrls', 'duplicatedInSitemap', 'records', 'distinctRecids', 'nonRecordUrls',
  'numericIds', 'slugAliases', 'canonicalRecords', 'addresses', 'collisions', 'notInvolutive', 'fixed', 'swapped'] as const
const FROM_OAI: Record<string, string> = { oaiHarvested: 'harvested', oaiCompleteListSize: 'completeListSize', oaiInBoth: 'inBoth',
  oaiOnly: 'oaiOnly', siteOnly: 'siteOnly', oaiUnion: 'union' }

const value = new Map<string, number>()
for (const k of FROM_CORPUS) value.set(k, corpus[k] as number)
for (const [name, key] of Object.entries(FROM_OAI)) value.set(name, oai[key]!)

const PATH = 'src/proof/cern.lean'
let src = readFileSync(PATH, 'utf8')
let changed = 0
src = src.replace(/^def ([A-Za-z]+) : Nat := (\d+)$/gm, (line, name: string, old: string) => {
  if (!value.has(name)) throw new Error(`cern-lean: no measured figure for def ${name}`)
  const next = String(value.get(name))
  if (next !== old) changed++
  return `def ${name} : Nat := ${next}`
})
const roots = corpus.roots as number[]
src = src.replace(/^def roots : List Nat := \[[^\]]*\]$/m, `def roots : List Nat := [${roots.join(', ')}]`)
writeFileSync(PATH, src)
console.log(`✓ cern-lean: ${value.size} figures read from the cache; ${changed} literal(s) changed in ${PATH}`)
