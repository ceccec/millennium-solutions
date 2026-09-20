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
const RECORDS = ['21781603', '21819217', '22256707']

const day = (s: string) => s.slice(0, 10)
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86_400_000)

async function measure() {
  const recs = await Promise.all(RECORDS.map(async (id) => {
    const r = await fetch(`https://zenodo.org/api/records/${id}`, { headers: UA, signal: AbortSignal.timeout(25_000) })
    if (!r.ok) throw new Error(`zenodo ${id}: HTTP ${r.status}`)
    const j = await r.json() as any
    return {
      id, concept: String(j.conceptrecid ?? ''),
      title: String(j.metadata?.title ?? '').slice(0, 80),
      published: String(j.metadata?.publication_date ?? ''),
      created: day(String(j.created ?? '')),
      creators: (j.metadata?.creators ?? []).map((c: any) => ({ name: c.name, orcid: c.orcid ?? '' })),
    }
  }))
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
  if (was.earliestDeposit !== now.earliestDeposit) drift.push(`earliest deposit ${was.earliestDeposit} → ${now.earliestDeposit}`)
  if (was.repository?.firstCommit !== now.repository.firstCommit) drift.push(`first commit ${was.repository?.firstCommit} → ${now.repository.firstCommit}`)
  if (was.leadDays !== now.leadDays) drift.push(`lead ${was.leadDays} → ${now.leadDays} day(s)`)
  for (const r of now.records) {
    const old = (was.records ?? []).find((x: any) => x.id === r.id)
    if (!old) { drift.push(`record ${r.id} is new to the registry`); continue }
    if (old.published !== r.published) drift.push(`${r.id} published ${old.published} → ${r.published}`)
    if (old.concept !== r.concept) drift.push(`${r.id} concept ${old.concept} → ${r.concept}`)
  }
  if (drift.length) {
    console.log(`✗ provenance: the registry no longer says what this record says — ${drift.join(' · ')}`)
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
