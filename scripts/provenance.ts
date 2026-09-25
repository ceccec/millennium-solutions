#!/usr/bin/env node
// PROVENANCE — the priority record, COMPUTED from the registry and the repository, never typed.
//
// The word carries `prove` and this deposit's rule is that a number on a page must be derived or it is a
// copy of a fact somebody once checked. A hand-written "published 2026-08-04" is exactly that: it reads as
// evidence, ages silently, and nothing fails when it drifts. Priority is the strongest thing the author has
// — it is what a DOI is FOR — so it is the last place a typed constant belongs.
//
// Every figure here comes from one of two places, both re-checkable by anyone:
//   · zenodo.org/api/records/<id>   the registry that issued the DOI and timestamped it, a third party
//   · git log                        this repository's own first commit
// and the interesting quantity — that the deposit predates the code — is the difference between them, so it
// is subtracted rather than asserted.
//
// `--write` records it; the default CHECKS the record against the live registry and refuses on drift. The
// reader is proven separately by scripts/sources.ts before any of this is believed: a registry that answers
// wrongly would otherwise rewrite the priority record with a straight face.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { flag } from '../src/cli/index.ts'
import { toUuid } from '../src/0/index.ts'

const OUT = 'src/proof/provenance.json'
const UA = { 'User-Agent': 'millennium-solutions/provenance (+https://ceccec.psg.bg/millennium-solutions/; read-only)' }
// THE POPULATION IS DISCOVERED, NOT LISTED. This read `const RECORDS = ['21781603', '21819217',
// '22256707']` and then printed "proven against the registry that issued the DOIs — not one figure above is
// typed into a page". Every FIGURE was derived and the POPULATION was typed, which is the half nobody
// checks: a deposit the author published yesterday could not appear, and two did.
//
// Measured 2026-09-25: nine records carry this ORCID. The three listed above are not among the current
// latest versions at all — 22875750 (2026-09-21) is a newer ℤ/9 Vortex Framework and 22933794 (2026-09-24)
// a newer "All Seven Clay Millennium Problems Sealed", both published while this file kept pointing at
// August. A priority claim computed over a hand-listed subset understates itself by construction, and
// understating is the direction this tree has erred in all along.
//
// The ORCID is read from CITATION.cff, so the identity this queries by is the same one the citation
// metadata resolves to and cannot drift from it.
const ORCID = (readFileSync('CITATION.cff', 'utf8').match(/orcid:\s*['"]?(\S+?)['"]?\s*$/m)?.[1] ?? '')
  .replace(/^https?:\/\/orcid\.org\//, '')
if (!ORCID) throw new Error('CITATION.cff states no ORCID — the record population cannot be discovered from nothing')

// THE LISTED RECORDS ARE NOT A HAND-LIST TO PURGE — THEY ARE THE ONES THE SEARCH CANNOT FIND.
// Measured 2026-09-25: 21781603 (created 2026-08-03), 21819217 and 22256707 carry NO ORCID on their
// creators, while every record from 2026-08-19 onward does. So an ORCID search returns 238 records and not
// one of those three, and replacing the list with discovery moved the earliest deposit from 2026-08-03 to
// 2026-09-02 and the lead from +3 days to MINUS 27 — the code appearing to predate the deposit, which is
// the claim destroyed rather than measured. The drift check refused to write it, which is what it is for.
//
// So the population is the UNION: these three, plus everything the ORCID finds. Not a fallback — both, every
// run, because neither source contains the other.
//
// FOR THE AUTHOR, AND HIS TO DO: the three records that establish priority do not resolve to his ORCID.
// Attaching it to them would let any third party find them by identifier instead of by being told the ids.
const SEEDED = ['21781603', '21819217', '22256707']

const discover = async (): Promise<any[]> => {
  // SIZE 25 IS THE CEILING THIS ENDPOINT ACCEPTS. Measured: 25 answers 200, 50 and 100 both answer 400.
  // Paged rather than assumed, so a tenth deposit does not silently fall off the end of one page — the
  // failure mode a fixed page size shares with the hand-written list this replaced.
  const PAGE = 25
  const pageUrl = (n: number) => `https://zenodo.org/api/records?q=creators.orcid:%22${ORCID}%22&size=${PAGE}&page=${n}&sort=oldest&all_versions=true`
  const ids: any[] = []
  for (let page = 1; page <= 10; page++) {
    const j = await getJson(pageUrl(page), `zenodo record search page ${page}`) as { hits?: { hits?: any[]; total?: number } }
    const got = (j.hits?.hits ?? [])
    ids.push(...got)
    if (got.length < PAGE) break
  }
  // ONE FETCH EACH FOR THE SEEDED THREE, AND NOT ONE MORE. The search already returns full metadata per
  // record, so re-fetching all 241 individually asked Zenodo for what it had just sent — and it answered
  // HTTP 429, correctly. Only the records the search cannot see are fetched by id.
  const have = new Set(ids.map((h) => String(h.id)))
  for (const id of SEEDED) {
    if (have.has(id)) continue
    ids.push(await getJson(`https://zenodo.org/api/records/${id}`, `zenodo seeded ${id}`))
  }
  // A SEARCH THAT RETURNS NOTHING IS AN OUTAGE, NOT AN AUTHOR WITH NO DEPOSITS. Refuse rather than write a
  // provenance record claiming zero — the flattering direction here is the empty one, because it would also
  // report no drift.
  if (!ids.length) throw new Error(`zenodo returned no records for ORCID ${ORCID} — that is an outage or a changed query, not an absence of deposits`)
  return ids
}

// A 429 IS "SLOW DOWN", NOT "ABSENT". Asking for 241 records individually earned one, and the honest
// response to a rate limit is to wait and ask again — treating it as a missing record would write a
// provenance file claiming deposits had vanished. Bounded retries, so an outage still fails loudly rather
// than looping.
const getJson = async (url: string, what: string): Promise<any> => {
  for (let attempt = 0; attempt < 5; attempt++) {
    const r = await fetch(url, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(25_000) })
    if (r.ok) return r.json()
    if (r.status !== 429) throw new Error(`${what}: HTTP ${r.status}`)
    const wait = 2000 * 2 ** attempt
    console.log(`  … ${what}: rate limited, waiting ${wait / 1000}s`)
    await new Promise((res) => setTimeout(res, wait))
  }
  throw new Error(`${what}: still rate limited after 5 attempts — the registry is throttling, not silent`)
}

const day = (s: string) => s.slice(0, 10)
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)

async function measure() {
  const RECORDS = await discover()
  const recs = RECORDS.map((j: any) => {
    const id = String(j.id)
    return {
      id, concept: String(j.conceptrecid ?? ''),
      title: String(j.metadata?.title ?? '').slice(0, 80),
      published: String(j.metadata?.publication_date ?? ''),
      created: day(String(j.created ?? '')),
      creators: (j.metadata?.creators ?? []).map((c: any) => ({ name: c.name, orcid: c.orcid ?? '' })),
    }
  })
  // THE ROOT COMMIT, NOT THE LAST ONE. `git log --reverse -1` applies the limit BEFORE reversing, so it
  // returns the newest commit — this reported the first commit as today and put the lead at 48 days instead
  // of 3. It inflated the author's priority, which is the direction a wrong number survives longest in: it
  // flatters the claim the page is about. `rev-list --max-parents=0` names the root commit and cannot drift.
  const root = execSync('git rev-list --max-parents=0 HEAD', { encoding: 'utf8' }).trim().split('\n').pop() as string
  const firstCommit = execSync(`git log -1 --format=%aI ${root}`, { encoding: 'utf8' }).trim()
  const firstHash = execSync(`git log -1 --format=%h ${root}`, { encoding: 'utf8' }).trim()
  // the earliest thing the registry holds, whichever record it sits in
  const earliest = recs.map((r) => r.created).filter(Boolean).sort()[0]
  const lead = daysBetween(earliest, day(firstCommit))
  const body = {
    measured: new Date().toISOString().slice(0, 10),
    records: recs,
    repository: { firstCommit: day(firstCommit), hash: firstHash },
    earliestDeposit: earliest,
    leadDays: lead,
    commits: Number(execSync('git rev-list --count HEAD', { encoding: 'utf8' }).trim()),
    authors: execSync('git log --format=%an', { encoding: 'utf8' }).split('\n').filter(Boolean)
      .reduce((m: Record<string, number>, a) => ({ ...m, [a]: (m[a] ?? 0) + 1 }), {}),
  }
  return { ...body, receipt: toUuid(JSON.stringify({ ...body, measured: '' })) }
}

const now = await measure()
const priorityHolds = now.leadDays > 0

if (flag('--write')) {
  writeFileSync(OUT, JSON.stringify(now, null, 2) + '\n')
  console.log(`✓ provenance recorded → ${OUT}`)
} else if (!existsSync(OUT)) {
  console.log(`✗ provenance: ${OUT} does not exist — run with --write. A priority record that is not recorded`)
  console.log(`  cannot be checked, and an unchecked priority record is a sentence rather than evidence.`)
  process.exit(1)
} else {
  // The measurement date and the receipt over it are expected to move; the FACTS must not.
  const was = JSON.parse(readFileSync(OUT, 'utf8'))
  const drift: string[] = []
  const newRecords: string[] = []
  if (was.earliestDeposit !== now.earliestDeposit) drift.push(`earliest deposit ${was.earliestDeposit} → ${now.earliestDeposit}`)
  if (was.repository?.firstCommit !== now.repository.firstCommit) drift.push(`first commit ${was.repository?.firstCommit} → ${now.repository.firstCommit}`)
  if (was.leadDays !== now.leadDays) drift.push(`lead ${was.leadDays} → ${now.leadDays} day(s)`)
  for (const r of now.records) {
    const old = (was.records ?? []).find((x: any) => x.id === r.id)
    if (!old) { newRecords.push(r.id); continue }   // summarised below; 238 of these in one line is not a report
    if (old.published !== r.published) drift.push(`${r.id} published ${old.published} → ${r.published}`)
    if (old.concept !== r.concept) drift.push(`${r.id} concept ${old.concept} → ${r.concept}`)
  }
  // A NEW RECORD IS NOT DRIFT. Drift is a timestamped deposit CHANGING — a published date or a concept
  // moving under a record already on file, which is the thing that must never happen silently. A record
  // appearing is the author depositing, which is ordinary and is reported as a count rather than as 238
  // clauses joined by a bullet. Mixing them made the one that matters unreadable.
  if (newRecords.length) {
    console.log(`  ○ ${newRecords.length} record(s) new to this file since it was last written — the author has deposited since.`)
    console.log(`    newest: ${newRecords.slice(-3).join(', ')}`)
  }
  if (drift.length) {
    console.log(`✗ provenance: a record already on file CHANGED — ${drift.slice(0, 8).join(' · ')}${drift.length > 8 ? ` · …and ${drift.length - 8} more` : ''}`)
    console.log(`  Re-record with --write only after understanding WHY a timestamped deposit moved.`)
    process.exit(1)
  }
}

console.log(`  earliest deposit ${now.earliestDeposit} · first commit ${now.repository.firstCommit} (${now.repository.hash})`)
console.log(`  lead: ${now.leadDays} day(s) — ${priorityHolds ? 'the deposit predates the code' : 'THE CODE PREDATES THE DEPOSIT'}`)
console.log(`  ${now.commits} commit(s), authored by: ${Object.entries(now.authors).map(([a, n]) => `${a} (${n})`).join(', ')}`)
for (const r of now.records) console.log(`  ${r.id} · concept ${r.concept} · published ${r.published} · ${r.creators.map((c: any) => c.name + (c.orcid ? ' ' + c.orcid : '')).join(', ')}`)
if (!priorityHolds) {
  console.log(`\n✗ provenance: the repository is older than the deposit it claims priority from.`)
  process.exit(1)
}
console.log(`\n✓ provenance: proven against the registry that issued the DOIs and this repository's own history —`)
console.log(`  not one figure above is typed into a page. receipt ${now.receipt.slice(0, 13)}…`)
