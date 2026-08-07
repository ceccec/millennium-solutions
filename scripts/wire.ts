#!/usr/bin/env node
// Wire — read-only provenance waves, integrated into ONE committed module.
// Consolidates the live checks this deposit runs ad-hoc: fetch a public source, run the honesty gate
// on the response, content-address (seal) it, and classify honestly.
//
// BOUNDS, by design:
//   • READ-ONLY + KEYLESS: no auth, no secrets, no writes. the OAuth / deposit:write side stays
//     HUMAN + CI (a Personal Access Token in a CI secret), never here.
//   • ADVISORY, not a hard gate: a network miss is INCONCLUSIVE (retry), NOT a build failure.
//     error handling PREDICTS — couldn't-reach (retry) is split from reached-and-contradicts (DRAINS).
//   • the ONLY blocking signal is OUR OWN live site failing the honesty gate (a real 0/7 regression).
import { toUuid, merkleFold } from '../src/0/index.ts'
import { computes } from './honesty-gate.ts'

type Wave = { label: string; url: string }
type Verdict = 'REACHED' | 'INCONCLUSIVE' | 'DRAINS'
type WaveResult = { label: string; url: string; verdict: Verdict; sealed?: string; note: string }

// read-only public endpoints only (self, remote provenance, external anchor)
export const WAVES: Wave[] = [
  { label: 'live-site',   url: 'https://ceccec.psg.bg/millennium-solutions/' },
  { label: 'github-tags', url: 'https://api.github.com/repos/ceccec/millennium-solutions/tags' },
  { label: 'zenodo',      url: 'https://zenodo.org/api/records?q=ceccec+millennium&size=1' },
]

export async function runWave(w: Wave): Promise<WaveResult> {
  try {
    const res = await fetch(w.url, { signal: AbortSignal.timeout(8000), headers: { 'user-agent': 'millennium-wire' } })
    if (!res.ok) return { ...w, verdict: 'INCONCLUSIVE', note: 'HTTP ' + res.status + ' → retry, not a claim' }
    const body = await res.text()
    const sealed = toUuid(w.url + ':' + body)
    const gate = computes(body)
    if (!gate.binary) return { ...w, verdict: 'DRAINS', sealed, note: 'gate RED: ' + gate.hit }
    return { ...w, verdict: 'REACHED', sealed, note: body.length + ' bytes · gate clean' }
  } catch (e: any) {
    return { ...w, verdict: 'INCONCLUSIVE', note: (e?.name || 'error') + ' → could not reach; retry, NOT down/false' }
  }
}

export async function wire(): Promise<WaveResult[]> {
  return Promise.all(WAVES.map(runWave))
}

// CLI / self-test:  node scripts/wire.ts
if (process.argv[1]?.endsWith('wire.ts')) {
  const results = await wire()
  for (const r of results)
    console.log('  ' + r.verdict.padEnd(13) + r.label.padEnd(13) + (r.sealed ? r.sealed.slice(0, 13) + '  ' : '              ') + r.note)
  const root = merkleFold(results.map((r) => toUuid(r.label + ':' + r.verdict + ':' + (r.sealed || ''))))
  const n = (v: Verdict) => results.filter((r) => r.verdict === v).length
  console.log('\nwire seal (one place): ' + root.slice(0, 13) + '…')
  console.log('waves: ' + n('REACHED') + ' reached · ' + n('INCONCLUSIVE') + ' inconclusive · ' + n('DRAINS') + ' drains   (read-only · keyless · advisory)')
  // honest exit: advisory. ONLY our own live site failing the gate is a blocking signal.
  const ourSiteDrains = results.some((r) => r.label === 'live-site' && r.verdict === 'DRAINS')
  if (ourSiteDrains) console.log('✗ live site failed the honesty gate — a real 0/7 regression.')
  process.exit(ourSiteDrains ? 1 : 0)
}
