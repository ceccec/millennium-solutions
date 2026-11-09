#!/usr/bin/env node
// RELEASE REACH — for every version tag on origin, did it reach the three places a release is for?
//
// A tag is provenance; it is not a release anyone receives. Three things follow a published GitHub release: the
// GitHub release itself (what a reader browses), npm (what an `npm install` gets, through publish.yml) and Zenodo
// (the citable archive, through the GitHub integration). On 2026-11-09 four tags — v9.8.4 to v9.8.7 — had reached
// none of them while every gate was green: next pushed the tags, and only release.yml cut releases, for tags it
// minted itself. Nothing in the tree could see that, because it is a fact about three other people's servers.
//
// WHAT EACH COLUMN READS, and from where:
//   release   GitHub's releases API, through `gh` (the depositor's own login): published, draft, or absent
//   npm       the registry's version list for this package — present or absent
//   zenodo    the Zenodo record whose related identifier is this repository (derived from the git remote, never
//             typed) created within ten minutes after that release was published: a TIME JOIN, because Zenodo's
//             archive names only the repository, not the tag. Beside it, the version label Zenodo gave the
//             record — which disagrees with the tag whenever the tagged tree's .zenodo.json carried a version
//             (v9.8.3 to v9.8.7 were archived as "v9.8.2" and "v9.8.6" for that reason)
//
// A READER, like published.ts: it reports and never gates — a registry outage must not decide whether a local build
// is allowed. A column that could not be read says NOT MEASURED rather than absent.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { publishedTags, semverOf, byVersion } from '../src/api/index.ts'
import { flag } from '../src/cli/index.ts'

const q = (cmd: string, args: string[]): string | null => {
  try { return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 60_000 }).trim() } catch { return null }
}
const getJson = async (url: string): Promise<any> => {
  try { const r = await fetch(url, { headers: { 'user-agent': 'millennium-solutions release-reach' } }); return r.ok ? await r.json() : null } catch { return null }
}

const remote = q('git', ['remote', 'get-url', 'origin']) ?? ''
const repo = remote.match(/github\.com[:/]([^/]+\/[^/.]+)/)?.[1] ?? ''
const pkg = (JSON.parse(readFileSync('package.json', 'utf8')) as { name: string }).name
const since = (process.argv.find((a) => a.startsWith('--since=')) ?? '--since=v9.8.0').split('=')[1]
if (!repo) { console.log('NOT MEASURED — origin is not a GitHub repository, so there is no release to read'); process.exit(0) }

const tags = publishedTags().filter((t) => semverOf(t) && byVersion(t, since) >= 0)
if (!tags.length) { console.log(`NOT MEASURED — no version tag on origin at or after ${since} (or origin did not answer)`); process.exit(0) }

const npmRaw = q('npm', ['view', pkg, 'versions', '--json'])
const npm: Set<string> | null = npmRaw ? new Set(JSON.parse(npmRaw) as string[]) : null
const zen = await getJson(`https://zenodo.org/api/records?q=${encodeURIComponent(`metadata.related_identifiers.identifier:"https://github.com/${repo}"`)}&all_versions=true&sort=newest&size=25`)   // Zenodo answers 400 above 25 for an anonymous caller
const records: { id: number; version: string; created: number }[] | null = zen
  ? (zen.hits?.hits ?? []).map((h: any) => ({ id: h.id, version: h.metadata?.version ?? '', created: Date.parse(h.created) }))
  : null

// THE LABEL A RECORD SHOULD CARRY IS READ FROM THE TAGGED TREE, and it is half the join. Four releases published
// within seconds of each other all fall in one record's time window, so time alone matched one record to all four.
// Zenodo names a record from the tagged .zenodo.json's `version` when it has one, and from the tag otherwise — so a
// record is joined to a release only if it carries that release's expected label, and each record joins at most once.
const expectedLabel = (tag: string): string => {
  const z = q('git', ['show', `${tag}:.zenodo.json`])
  try { return (z ? (JSON.parse(z) as { version?: string }).version : undefined) ?? tag } catch { return tag }
}
const used = new Set<number>()

type Row = { tag: string; release: string; npm: string; zenodo: string; label: string; reached: boolean; want: string; at: number }
const rows: Row[] = []
for (const tag of tags) {
  const rel = q('gh', ['api', `repos/${repo}/releases/tags/${tag}`, '--jq', '[.draft, .published_at] | @tsv'])
  const [draft, at] = rel ? rel.split('\t') : []
  const release = rel === null ? 'absent' : draft === 'true' ? 'draft' : 'published'
  const onNpm = npm === null ? 'NOT MEASURED' : npm.has(tag.slice(1)) ? 'present' : 'absent'
  const t = at ? Date.parse(at) : NaN
  const want = expectedLabel(tag)
  const rec = records && Number.isFinite(t)
    ? records.filter((r) => !used.has(r.id) && r.version === want && r.created >= t && r.created - t < 600_000).sort((a, b) => a.created - b.created)[0]
    : undefined
  if (rec) used.add(rec.id)
  const zenodo = records === null ? 'NOT MEASURED' : rec ? `record ${rec.id}` : release === 'published' ? 'absent' : '— (no release to archive)'
  const label = rec ? (rec.version === tag ? 'matches' : `labelled "${rec.version || '(none)'}"`) : ''
  rows.push({ tag, release, npm: onNpm, zenodo, label, reached: release === 'published' && onNpm === 'present' && !!rec, want, at: t })
}
// AND WHERE THE JOIN CANNOT DECIDE, IT SAYS SO. Releases that expect the same label and were published within one window
// (v9.8.4, v9.8.5 and v9.8.6 all expect "v9.8.2", published within three seconds) cannot be told apart by any field
// Zenodo returns — which record is whose is assigned earliest-first, and marked rather than asserted.
for (const r of rows) {
  const twins = rows.filter((o) => o !== r && o.want === r.want && Number.isFinite(o.at) && Math.abs(o.at - r.at) < 600_000)
  if (twins.length && r.zenodo.startsWith('record')) r.label += ` · ambiguous with ${twins.map((o) => o.tag).join(' ')}`
}

if (flag('--json')) { console.log(JSON.stringify({ repo, package: pkg, since, rows }, null, 1)); process.exit(0) }
console.log(`release reach — ${repo} · ${pkg} · tags on origin from ${since}\n`)
console.log('  tag      release    npm       zenodo')
for (const r of rows) console.log(`  ${r.reached ? '✓' : '○'} ${r.tag.padEnd(7)} ${r.release.padEnd(10)} ${r.npm.padEnd(9)} ${r.zenodo}${r.label ? ` · ${r.label}` : ''}`)
const missing = rows.filter((r) => !r.reached)
console.log(`\n${rows.length - missing.length} of ${rows.length} tag(s) reached GitHub, npm and Zenodo.${missing.length ? ` Not yet: ${missing.map((r) => r.tag).join(' ')}.` : ''}`)
console.log('Reports, never gates. The zenodo column joins on the label the tagged .zenodo.json implies and a record created within ten minutes after the release.')
