#!/usr/bin/env node
// DOI-PRECEDENCE-TEST — every DOI the repository names as this work must resolve to this work.
//
//   node scripts/doi-precedence-test.ts
//
// The canonical DOI and title come from CITATION.cff. Every other DOI named in README.md, CITATION.cff, or package.json is
// resolved through the MCP (web_fetch of https://doi.org/<doi>) and its record title is read. A DOI passes only when its
// record title is the canonical title. A DOI that resolves to a different record is a violation: it cites a different
// work as this one. This test checks attribution metadata. It does not decide what any license permits.
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cff = readFileSync(resolve(ROOT, 'CITATION.cff'), 'utf8')
const canonicalDoi = /^doi:\s*"?([^"\s]+)"?/m.exec(cff)?.[1] ?? ''
const canonicalTitle = /^title:\s*"(.+)"\s*$/m.exec(cff)?.[1] ?? ''
// The record title carries the head of the citation title, before its colon: "The ℤ/9 Vortex Framework" (without the article).
const titleHead = canonicalTitle.split(':')[0]!.replace(/^The\s+/, '').trim()
if (!canonicalDoi || !canonicalTitle) {
  console.log('✗ doi-precedence: CITATION.cff names no doi or title')
  process.exit(1)
}

const doiPattern = /10\.\d{4,}\/[A-Za-z0-9._()\-/]+[A-Za-z0-9]/g
const named = new Set<string>()
for (const f of ['README.md', 'CITATION.cff', 'package.json']) {
  const text = readFileSync(resolve(ROOT, f), 'utf8')
  for (const m of text.matchAll(doiPattern)) named.add(m[0].replace(/[).,;]+$/, ''))
}

const resolveDoi = (doi: string): { title: string | null; status: string } => {
  const out = spawnSync('node', ['scripts/mcp-call.ts', 'web_fetch', JSON.stringify({ url: `https://doi.org/${doi}`, pattern: '<title>[^<]{0,200}</title>', window: 0, raw: true })], { cwd: ROOT, encoding: 'utf8', timeout: 180_000 })
  try {
    const j = JSON.parse(String(out.stdout)) as { status: string; passages?: string[] }
    const raw = (j.passages?.[0] ?? '').replace(/<\/?title>/g, '').replace(/\s*\|\s*Zenodo\s*$/, '').replace(/\s+/g, ' ').trim()
    return { title: raw || null, status: j.status }
  } catch {
    return { title: null, status: 'UNPARSED' }
  }
}

let failed = 0
for (const doi of [...named].sort()) {
  const r = resolveDoi(doi)
  const same = r.title !== null && r.title.includes(titleHead)
  if (!same) failed++
  console.log(`${same ? '✓' : '✗'} ${doi} — ${r.status}: ${r.title ?? 'no title'}${same ? '' : `  (cited as this work, but its record is not the canonical title head "${titleHead}")`}`)
}
console.log(`\n${failed === 0 ? '✓' : '✗'} doi-precedence: ${named.size - failed}/${named.size} DOIs resolve to the canonical record (${canonicalDoi})`)
process.exit(failed === 0 ? 0 : 1)
