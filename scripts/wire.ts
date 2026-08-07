#!/usr/bin/env node
// Wire — read-only waves over the SINGLE uuid-stamped API path (scripts/api.ts), in GROUPS.
// Every call is content-addressed + honesty-gated there, so nothing bypasses the seal. ADVISORY, not a
// hard gate: a network miss is INCONCLUSIVE (retry), not a build failure. The only blocking signal is
// OUR OWN live site failing the honesty gate.
//
// GROUPS (organised in threes where NATURAL — not padded to force a "trinity"):
//   • provenance — self, remote tags, external anchor
//   • vulnerability — OSV.dev advisory lookup per dependency (learning from public vuln data)
//
// BOUND: vuln lookups are PACKAGE-LEVEL + ADVISORY. an advisory found != we are vulnerable — confirming
// that needs version-matching against a committed lockfile (absent). read-only, never auto-patches.
// ("quantum" drained: these are classical read-only HTTP fetches.)
import { readFileSync } from 'node:fs'
import { merkleFold } from '../src/0/index.ts'
import { apiFetch, apiQuery, type ApiRecord } from './api.ts'

const PROVENANCE = [
  { label: 'live-site',   url: 'https://ceccec.psg.bg/millennium-solutions/' },
  { label: 'github-tags', url: 'https://api.github.com/repos/ceccec/millennium-solutions/tags' },
  { label: 'zenodo',      url: 'https://zenodo.org/api/records?q=ceccec+millennium&size=1' },
]
const deps = Object.keys(JSON.parse(readFileSync('package.json', 'utf8')).devDependencies || {})

export async function wire() {
  const provenance = await Promise.all(PROVENANCE.map(async (w) => ({ label: w.label, group: 'provenance', ...(await apiFetch(w.url)) })))
  const vulnerability = await Promise.all(deps.map(async (name) => {
    const r = await apiQuery('https://api.osv.dev/v1/query', { package: { name, ecosystem: 'npm' } }) as ApiRecord & { raw?: string }
    let advisories = -1
    try { advisories = (JSON.parse(r.raw || '{}').vulns || []).length } catch {}
    return { label: 'osv:' + name, group: 'vulnerability', ...r, note: r.verdict === 'REACHED' ? advisories + ' advisor(y/ies) [package-level, advisory]' : r.note }
  }))
  return [...provenance, ...vulnerability]
}

if (process.argv[1]?.endsWith('wire.ts')) {
  const results = await wire()
  let group = ''
  for (const r of results) {
    if (r.group !== group) { group = r.group; console.log('\n[' + group + ']') }
    console.log('  ' + r.verdict.padEnd(13) + r.label.padEnd(16) + r.uuid.slice(0, 13) + '  ' + r.note)
  }
  const root = merkleFold(results.map((r) => r.uuid))
  const n = (v: string) => results.filter((r) => r.verdict === v).length
  console.log('\nwire seal (one place): ' + root.slice(0, 13) + '…')
  console.log('waves: ' + n('REACHED') + ' reached · ' + n('INCONCLUSIVE') + ' inconclusive · ' + n('DRAINS') + ' drains   (read-only · every call uuid-stamped · advisory)')
  const ourSiteDrains = results.some((r) => r.label === 'live-site' && r.verdict === 'DRAINS')
  if (ourSiteDrains) console.log('✗ live site failed the honesty gate — a real 0/7 regression.')
  process.exit(ourSiteDrains ? 1 : 0)
}
