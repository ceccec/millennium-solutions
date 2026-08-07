#!/usr/bin/env node
// Wire — read-only provenance waves over the SINGLE uuid-stamped API path (scripts/api.ts).
// Every call is content-addressed there, so nothing bypasses the seal. ADVISORY, not a hard gate:
// a network miss is INCONCLUSIVE (retry), not a build failure. The only blocking signal is OUR OWN
// live site failing the honesty gate (a real 0/7 regression).
import { merkleFold } from '../src/0/index.ts'
import { apiFetch, type ApiRecord } from './api.ts'

export const WAVES = [
  { label: 'live-site',   url: 'https://ceccec.psg.bg/millennium-solutions/' },
  { label: 'github-tags', url: 'https://api.github.com/repos/ceccec/millennium-solutions/tags' },
  { label: 'zenodo',      url: 'https://zenodo.org/api/records?q=ceccec+millennium&size=1' },
]

export async function wire(): Promise<(ApiRecord & { label: string })[]> {
  return Promise.all(WAVES.map(async (w) => ({ label: w.label, ...(await apiFetch(w.url)) })))
}

// CLI / self-test:  node scripts/wire.ts
if (process.argv[1]?.endsWith('wire.ts')) {
  const results = await wire()
  for (const r of results)
    console.log('  ' + r.verdict.padEnd(13) + r.label.padEnd(13) + r.uuid.slice(0, 13) + '  ' + r.note)
  const root = merkleFold(results.map((r) => r.uuid))
  const n = (v: string) => results.filter((r) => r.verdict === v).length
  console.log('\nwire seal (one place): ' + root.slice(0, 13) + '…')
  console.log('waves: ' + n('REACHED') + ' reached · ' + n('INCONCLUSIVE') + ' inconclusive · ' + n('DRAINS') + ' drains   (read-only · every call uuid-stamped)')
  const ourSiteDrains = results.some((r) => r.label === 'live-site' && r.verdict === 'DRAINS')
  if (ourSiteDrains) console.log('✗ live site failed the honesty gate — a real 0/7 regression.')
  process.exit(ourSiteDrains ? 1 : 0)
}
