#!/usr/bin/env node
/** ── IS THE RELEASE ACTUALLY LIVE — IN npm AND IN ZENODO ──────────────────────────────────────────────────
 *
 *  scripts/release.ts refuses to cut a tag over a deposit that is not sealed, octave-exact and carried.
 *  publish.yml then publishes to npm and, if it is configured, mints a DOI. Nothing asked afterwards
 *  whether either landed.
 *
 *  A green workflow says a job exited zero. It does not say the registry has the version, and it does not
 *  say a DOI exists — those are facts about somebody else's server, and the only way to know them is to
 *  ask. This asks, for the tag given or for the newest one, and reports each leg separately because they
 *  fail separately and for different reasons.
 *
 *  THE ZENODO LEG IS EXPECTED TO SAY NOT MINTED, and that is the honest answer rather than a failure of
 *  this script. leads.ts has reported 17 depositions staged and 0 minted all session: the Zenodo↔GitHub
 *  integration is verified inactive and no token with deposit:write is configured, so a release cut today
 *  mints nothing. Reporting NOT MINTED is the deposit stating a gap it has; reporting it as an error would
 *  be this script claiming the gap is a malfunction.
 *
 *    node scripts/release-live.ts            the newest tag
 *    node scripts/release-live.ts v9.7.4     a named one */
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const UA = { 'User-Agent': 'millennium-solutions/release-live (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }
const arg = process.argv.slice(2).find((a) => !a.startsWith('-'))
const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
const tag = arg ?? tags[tags.length - 1]
if (!tag) { console.log('✗ release-live: this repository has no tags — nothing to check.'); process.exit(1) }
const version = tag.replace(/^v/, '')
const pkg = JSON.parse(readFileSync('package.json', 'utf8'))

type Leg = { where: string; state: 'LIVE' | 'ABSENT' | 'NOT MINTED' | 'NOT MEASURED'; detail: string }
const legs: Leg[] = []

const get = async (url: string) => {
  const r = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(20_000) })
  if (!r.ok) throw new Error(`HTTP ${r.status}`)
  return r.json() as Promise<any>
}

// ── npm ──────────────────────────────────────────────────────────────────────────────────────────────────
// The registry is asked for the exact version. A package that exists at some other version is not this
// release being live, and saying "the package is on npm" would be true and would answer a question nobody
// asked.
// ── AND IT WAITS, BECAUSE THE REGISTRY LAGS THE PUBLISH ──────────────────────────────────────────────────
// THIS CHECK'S OWN FALSE NEGATIVE, AND IT WAS A BAD ONE. Asked twenty seconds after publish.yml reported
// success, registry.npmjs.org answered that 9.7.6 did not exist and that latest was 9.7.4 — so this printed
// ABSENT and exited non-zero over a release that had published correctly, with signed provenance, and whose
// own log said `+ @ceccec/millennium-solutions@9.7.6`. Minutes later the same query found it as latest.
//
// ABSENT is the one state here that FAILS, so a false one turns a healthy release into a red build and
// teaches whoever sees it to disbelieve the check. A read replica catching up is not a missing version, and
// the two are told apart by asking again rather than by asking once and concluding. Five attempts over
// roughly a minute; only after all of them is a version called absent.
const npmHas = async (): Promise<{ has: boolean; latest: string; when: string; tries: number }> => {
  let last: any = null
  for (let i = 0; i < 5; i++) {
    last = await get(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`)
    if (last?.versions?.[version]) return { has: true, latest: last?.['dist-tags']?.latest ?? '—', when: String(last?.time?.[version] ?? '').slice(0, 10), tries: i + 1 }
    if (i < 4) await new Promise((r) => setTimeout(r, 15_000))
  }
  return { has: false, latest: last?.['dist-tags']?.latest ?? '—', when: '', tries: 5 }
}
try {
  const j = await get(`https://registry.npmjs.org/${encodeURIComponent(pkg.name)}`)
  const probe = await npmHas()
  const has = probe.has
  const latest = probe.latest
  legs.push({ where: `npm ${pkg.name}`, state: has ? 'LIVE' : 'ABSENT',
    detail: has ? `${version} published ${probe.when} · latest is ${latest}${probe.tries > 1 ? ` · the registry needed ${probe.tries} asks to catch up` : ''}`
                : `${version} is NOT in the registry after 5 asks over ~1 minute · latest is ${latest} · ${Object.keys(j?.versions ?? {}).length} version(s) published` })
} catch (e) {
  // A registry that did not answer is NOT MEASURED. Recording it as ABSENT would turn an outage into a
  // claim that the release failed, which is the false negative this deposit keeps finding in itself.
  legs.push({ where: `npm ${pkg.name}`, state: 'NOT MEASURED', detail: `the registry did not answer — ${(e as Error).message}` })
}

// ── Zenodo ───────────────────────────────────────────────────────────────────────────────────────────────
// Asked by concept DOI, which resolves to whatever the author deposited latest. A version-specific record
// for THIS tag is what a minted release would carry; its absence is the known gap, not a fault.
// THE CONCEPT IS RESOLVED, NOT ASSUMED. This read the DOI out of CITATION.cff and queried
// `conceptrecid:21819217` — but 21819217 is a RECORD, whose concept is 21787143, so the query matched
// nothing and reported "0 record(s) under this concept". A gap invented by a wrong identifier, printed in
// the same sentence as a real one. The record is fetched first and its own conceptrecid is used.
const CITED = (readFileSync('CITATION.cff', 'utf8').match(/doi:\s*['"]?10\.5281\/zenodo\.(\d+)/)?.[1]) ?? '21819217'
let CONCEPT = CITED
try { CONCEPT = String((await get(`https://zenodo.org/api/records/${CITED}`)).conceptrecid ?? CITED) } catch { /* reported by the leg below */ }
try {
  const j = await get(`https://zenodo.org/api/records?q=conceptrecid:${CONCEPT}&all_versions=true&size=25&sort=newest`)
  const hits = j?.hits?.hits ?? []
  const forTag = hits.find((h: any) => String(h?.metadata?.version ?? '') === version || String(h?.metadata?.title ?? '').includes(tag))
  legs.push({ where: `zenodo concept ${CONCEPT}`, state: forTag ? 'LIVE' : 'NOT MINTED',
    detail: forTag ? `record ${forTag.id} carries ${version}`.replace('XX', '')
                   : `${hits.length} record(s) under this concept, none carrying ${version} — the Zenodo↔GitHub integration is not active and no deposit:write token is configured, so a tag mints nothing` })
} catch (e) {
  legs.push({ where: `zenodo concept ${CONCEPT}`, state: 'NOT MEASURED', detail: `zenodo did not answer — ${(e as Error).message}` })
}

for (const l of legs) {
  const mark = l.state === 'LIVE' ? '✓' : l.state === 'NOT MEASURED' ? '?' : '○'
  console.log(`  ${mark} ${l.state.padEnd(11)} ${l.where}`)
  console.log(`      ${l.detail}`)
}

// ── WHAT FAILS AND WHAT MERELY REPORTS ───────────────────────────────────────────────────────────────────
// ABSENT on npm is a real failure: the tag was cut, the workflow claimed to publish, and the registry does
// not have it. NOT MINTED is a gap the deposit already states and the author already owns. NOT MEASURED is
// somebody else's server being quiet, and concluding anything from silence is the thing this tree refuses.
const absent = legs.filter((l) => l.state === 'ABSENT')
const unmeasured = legs.filter((l) => l.state === 'NOT MEASURED')
console.log(`\n${absent.length ? '✗' : '○'} release-live: ${tag} — ${legs.filter((l) => l.state === 'LIVE').length} of ${legs.length} leg(s) live`
  + `${absent.length ? `, ${absent.length} ABSENT` : ''}${unmeasured.length ? `, ${unmeasured.length} not measured` : ''}`)
if (!absent.length && !unmeasured.length) console.log('  A green workflow says a job exited zero; this says the registry has it.')
process.exit(absent.length ? 1 : 0)
