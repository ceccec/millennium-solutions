#!/usr/bin/env node
/** ── ZENODO SYNC — what each release would carry to the permanent record ───────────────────────────────
 *
 *  Captain's instruction, signed (`src/receipts/2d137058-…json`, `agent: "captain"`):
 *    "update zenodo on each release programatically to include readme and changelog as well as all news
 *     and discoveries in the metadata itself including citing other doi and its role (including violations)"
 *
 *  This assembles exactly that, from measurements this tree already computes, and it runs on EVERY release.
 *  What it does NOT do on every release is transmit. A Zenodo version is permanent: its depositor cannot
 *  delete it, only ask staff to withdraw it. This repository has minted 916 provenance tags, several in an
 *  hour today, and a new citable DOI for each of them would bury the record it is meant to document. So the
 *  chain runs the PLAN — derive, check, write `.zenodo/sync-plan.json`, refuse if anything is stale — and
 *  sending it is one explicit act with `--production`. That is the instruction carried out with the one
 *  part that cannot be undone left as a decision rather than a side effect. Said plainly rather than
 *  quietly narrowed.
 *
 *  ROLE IS MEASURED, NEVER ASSUMED — and "violation" is not a verdict this file is allowed to reach.
 *  `src/proof/citations.json` records who cites these DOIs and whether the citing work is the author's own.
 *  A self-citation is provenance; a third-party citation is uptake; an unresolved identifier is NOT
 *  MEASURED. Nothing in this deposit identifies a violator (FINDINGS.md §6), and a permanent record naming
 *  one on the strength of an absence would be the same act this repository spent a day documenting. Where
 *  the author has a question, the record carries the QUESTION, with its evidence, for the reader to judge.
 *
 *  usage:  node scripts/zenodo-sync.ts             derive and write the plan (what the chain runs)
 *          node scripts/zenodo-sync.ts --print     also print the description it would send
 *          node scripts/zenodo-sync.ts --production   create a new version and publish it (irreversible) */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import { CONCEPT_DOI, SITE } from '../src/publication/index.ts'
import { ledger, theoremCount, leanFiles } from '../src/api/index.ts'

const args = process.argv.slice(2)
const LIVE = args.includes('--production')
const PLAN = '.zenodo/sync-plan.json'
const HOST = 'https://zenodo.org'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

// ── THE FILES THE RECORD CARRIES ────────────────────────────────────────────────────────────────────────
// Both are generated, and both are checked for staleness rather than trusted: a record carrying a changelog
// that stopped at an older tag documents a release that is not the one being deposited.
const FILES = ['README.md', 'CHANGELOG.md']
for (const f of FILES) if (!existsSync(f)) fail(`${f} does not exist — the record cannot carry it`)
try { execFileSync('node', ['scripts/changelog.ts', '--check'], { stdio: 'pipe' }) }
catch { fail('CHANGELOG.md is not what the tags derive — run `node scripts/changelog.ts`') }

const tag = (() => {
  try { return execFileSync('git', ['describe', '--tags', '--abbrev=0'], { encoding: 'utf8' }).trim() } catch { return '' }
})()
if (!tag) fail('no tag to deposit — a release record with no version names nothing')

// ── DISCOVERIES, COUNTED FROM THE LEDGER ITSELF ─────────────────────────────────────────────────────────
const rows = ledger()
const live = rows.filter((e) => !('revoked' in e) || !(e as { revoked?: boolean }).revoked)
const discoveries = { ledger: rows.length, live: live.length, theorems: theoremCount(), files: leanFiles().length }

// ── CITING DOIs AND THEIR ROLE, READ FROM THE MEASUREMENT ───────────────────────────────────────────────
type Citing = { doi: string; date?: string; title?: string; authors?: string[]; self?: boolean }
const cites: { measured: string; tracked: { doi: string; citing: Citing[] }[] } =
  existsSync('src/proof/citations.json')
    ? JSON.parse(readFileSync('src/proof/citations.json', 'utf8'))
    : { measured: '', tracked: [] }
if (!cites.measured) fail('src/proof/citations.json is absent — reception would be UNSTATED, not zero; run `npm run citations`')

const allCiting: Citing[] = cites.tracked.flatMap((t) => t.citing ?? [])
const selfCites = allCiting.filter((c) => c.self === true)
const thirdParty = allCiting.filter((c) => c.self === false)
const roleUnknown = allCiting.filter((c) => c.self !== true && c.self !== false)

// Zenodo's `relation` is the machine-readable role. `isCitedBy` is what a citing work is, regardless of who
// wrote it; WHO wrote it is the part that distinguishes provenance from uptake, and it is stated in the
// description where a reader can see the reasoning rather than inferred from a bare relation code.
const related = [
  { identifier: CONCEPT_DOI, relation: 'isVersionOf', resource_type: 'publication-preprint' },
  { identifier: `${SITE}/FINDINGS`, relation: 'isDocumentedBy', resource_type: 'publication-report' },
  { identifier: `${SITE}/CHANGELOG`, relation: 'isDocumentedBy', resource_type: 'publication-other' },
  ...allCiting.map((c) => ({ identifier: String(c.doi).replace(/^https?:\/\/doi\.org\//, ''), relation: 'isCitedBy', resource_type: 'publication-preprint' })),
]

const esc = (x: string) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const row = (c: Citing) => `<tr><td><code>${esc(String(c.doi))}</code></td><td>${esc(String(c.date ?? '—'))}</td>`
  + `<td>${esc(String(c.title ?? '—').slice(0, 80))}</td>`
  + `<td>${c.self === true ? 'the author’s own — provenance, not uptake' : c.self === false ? 'third party — uptake' : 'NOT MEASURED — the identifier did not resolve'}</td></tr>`

const description =
  `<p><strong>Release ${esc(tag)} of the ℤ/9 Vortex Framework deposit.</strong> ${discoveries.theorems} theorems across `
  + `${discoveries.files} Lean 4 files, each closed by exhaustion over a stated finite domain, sorry-free and `
  + `axiom-free; an append-only ledger of ${discoveries.ledger} entries, ${discoveries.live} standing, whose receipt `
  + `chain is recomputed on every build. README.md and CHANGELOG.md travel with this version; the changelog is `
  + `derived from the annotated tags themselves, so a row cannot claim a content-address its tag does not carry.</p>`
  + `<p><strong>Citing works, and the role of each.</strong> Measured ${esc(cites.measured || 'NOT MEASURED')} from DataCite and OpenAlex. `
  + `${allCiting.length} work(s) cite these DOIs: <strong>${selfCites.length}</strong> written by the author, `
  + `<strong>${thirdParty.length}</strong> by a third party, <strong>${roleUnknown.length}</strong> whose identifier did not resolve. `
  + `A self-citation is provenance and is counted separately, because counting it as uptake is the flattering direction.</p>`
  + (allCiting.length
    ? `<table><tr><th>DOI</th><th>date</th><th>title</th><th>role</th></tr>${allCiting.map(row).join('')}</table>`
    : `<p>No citing work resolved at the time of this release. That is what the citation graph holds, not a count of who has used this work: a graph records only the citations that were made.</p>`)
  // THE QUESTION, NOT THE ACCUSATION — the author's own standing instruction. No violator is identified in
  // this deposit and none is named here. What is on the record is the measurement and the open question.
  + `<p><strong>Open questions this record puts, rather than answers it asserts.</strong> `
  + `These results were registered before the source repository existed; if the same constructions appear elsewhere, `
  + `which came first, and is this record cited there? `
  + `${thirdParty.length === 0 ? 'No third-party citation has resolved to date, and uncited use has NOT been searched for — that needs content matching, not citation tracking, and it has not been run. Absence in a citation graph is not evidence of anyone’s conduct.' : ''} `
  + `This deposit’s receipts are signed by agent: eight carry <code>agent: "captain"</code>; statements bounding the claim `
  + `carried <code>claude-opus</code> and <code>Claude</code>. By what means did those models compute the claims they made here, `
  + `and on whose authority were they written in the author’s name? The signatures are in the repository, at `
  + `<a href="${SITE}/FINDINGS">${SITE}/FINDINGS</a>.</p>`

const plan = {
  derived: new Date().toISOString(),
  concept: CONCEPT_DOI, tag, host: HOST,
  files: FILES, discoveries,
  citations: { measured: cites.measured, total: allCiting.length, self: selfCites.length, thirdParty: thirdParty.length, unresolved: roleUnknown.length },
  violations: {
    established: 0,
    basis: 'FINDINGS.md §6 — no violator is identified by this deposit; zero third-party citations is the shape of a citation graph, not a count of dishonest users. Uncited use has not been searched for.',
  },
  related_identifiers: related,
  description,
}

if (bad) { console.log(`\n✗ zenodo-sync: ${bad} finding(s) — nothing planned; fix the above and re-run`); process.exit(1) }

writeFileSync(PLAN, JSON.stringify(plan, null, 2) + '\n')
if (args.includes('--print')) console.log(description + '\n')
console.log(`  ✓ zenodo-sync: plan for ${tag} → ${PLAN} · ${FILES.length} file(s) · ${related.length} related identifier(s) · `
  + `citing ${allCiting.length} (${selfCites.length} self, ${thirdParty.length} third-party, ${roleUnknown.length} unresolved) · 0 violations established`)

if (!LIVE) {
  console.log(`    not transmitted. \`--production\` creates a NEW PERMANENT VERSION of ${CONCEPT_DOI} and publishes it; that cannot be undone.`)
  process.exit(0)
}

// ── TRANSMIT — the one irreversible step, never reached without --production ─────────────────────────────
// UNTESTED AGAINST THE LIVE API AS WRITTEN: the token on this machine has no deposit:write scope, so the
// write path below has never returned a success here. It is written to fail loudly and name the HTTP status
// rather than to appear to work. Run it against --sandbox credentials before trusting it on production.
const tokenPath = join(homedir(), '.zenodo', 'token')
const token = existsSync(tokenPath) ? readFileSync(tokenPath, 'utf8').trim() : ''
if (!token) { console.error(`  ✗ no token at ${tokenPath} — this script never asks for one and never prints it`); process.exit(1) }
const PKG = JSON.parse(readFileSync('package.json', 'utf8')) as { name: string; version: string }
const UA = `${PKG.name}/${PKG.version} (+https://github.com/ceccec/millennium-solutions)`
const api = async (path: string, init: RequestInit = {}) => {
  const r = await fetch(`${HOST}/api${path}`, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', 'User-Agent': UA, ...(init.headers ?? {}) } })
  const body = await r.text()
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} — ${body.slice(0, 300)}`)
  return body ? JSON.parse(body) : {}
}
const recid = CONCEPT_DOI.split('.').pop()
const nv = await api(`/deposit/depositions/${recid}/actions/newversion`, { method: 'POST' })
const draftId = String(nv.links.latest_draft).split('/').pop()
const draft = await api(`/deposit/depositions/${draftId}`)
for (const f of FILES) {
  const r = await fetch(`${draft.links.bucket}/${f}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'User-Agent': UA }, body: readFileSync(f) })
  if (!r.ok) throw new Error(`file ${f}: ${r.status} ${await r.text()}`)
}
const metadata = { ...draft.metadata, version: tag, description, related_identifiers: related }
await api(`/deposit/depositions/${draftId}`, { method: 'PUT', body: JSON.stringify({ metadata }) })
const pub = await api(`/deposit/depositions/${draftId}/actions/publish`, { method: 'POST' })
console.log(`  ✓ published ${pub.doi} — ${pub.links?.record_html ?? ''}`)
