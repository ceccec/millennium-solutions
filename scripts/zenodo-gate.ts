#!/usr/bin/env node
// THE DEPOSITIONS AGREE WITH THE PROOF TREE AND WITH THE PUBLISHED DOI, or the build fails.
//
// 336 records that will carry their own DOIs are worth exactly as much as their agreement with what the
// kernel accepts. A deposition naming a theorem that no longer exists, or quoting a statement that has
// since changed, is a citable false record — worse than no record, because a DOI is permanent.
//
// The concept DOI is read from CITATION.cff, not typed here, and cross-checked against README.md and
// .zenodo.json. Three files stating one identifier is three chances for it to drift.
import { readFileSync, existsSync, readdirSync } from 'node:fs'
import { leanTheorems } from '../src/api/index.ts'
import { deposition, namesIn, keyOf } from './zenodo-theorems.ts'
import { ownFiles, creditedIn, closureOf } from '../src/publication/index.ts'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }
const OUT = '.zenodo/theorems'

if (!existsSync(OUT)) { console.log('  ✗ no depositions — run `node scripts/zenodo-theorems.ts --write`'); process.exit(1) }

// ── the DOI is one identifier, stated in three places ────────────────────────────────────────────────────
const doi = (readFileSync('CITATION.cff', 'utf8').match(/^doi:\s*"?(10\.\d{4,}\/[^\s"]+)"?/m) ?? [])[1]
if (!doi) fail('CITATION.cff states no concept DOI, so the depositions have nothing to be part of')
else {
  if (!readFileSync('README.md', 'utf8').includes(doi)) fail(`README.md does not carry the concept DOI ${doi} that CITATION.cff states`)
  const z = readFileSync('.zenodo.json', 'utf8')
  if (!z.includes(doi.split('/')[1])) fail(`.zenodo.json does not reference ${doi}`)
}

// ── every own-work theorem has a deposition, and every deposition has a theorem ──────────────────────────
const own = new Set(ownFiles())
const rows = leanTheorems().filter((t) => own.has(t.file))
const onDisk = new Set(readdirSync(OUT).filter((f) => f.endsWith('.json')).map((f) => f.replace(/\.json$/, '')))
for (const t of rows) if (!onDisk.has('lean_' + t.name)) fail(`${t.file}: ${t.name} is this deposit's own work and has no deposition`)
for (const k of onDisk) if (!rows.some((t) => 'lean_' + t.name === k)) fail(`${k}.json deposits a theorem the tree no longer holds — a citable record of something that is gone`)

// ── each deposition still says what the tree says ────────────────────────────────────────────────────────
let drifted = 0
for (const t of rows) {
  const p = `${OUT}/lean_${t.name}.json`
  if (!existsSync(p)) continue
  const want = deposition(t), got = JSON.parse(readFileSync(p, 'utf8'))
  if (JSON.stringify(want) !== JSON.stringify(got)) { drifted++; if (drifted <= 5) fail(`${p} no longer matches the theorem it deposits — regenerate with --write`) }
  if (doi && !JSON.stringify(got.related_identifiers).includes(doi)) fail(`${p} does not name the concept DOI as isPartOf`)
}
if (drifted > 5) fail(`…and ${drifted - 5} more depositions have drifted from the tree`)

// ── THE PROOF IN THE RECORD MUST BE CHECKABLE BY WHOEVER DOWNLOADS IT ───────────────────────────────────
// Measured before this check existed: 245 of 336 records attached one file that opened with `import` and
// could not compile alone. This deposit's claim is that a stranger recomputes rather than trusts, and a
// record carrying an unbuildable proof fails that claim at the only point where it is tested.
for (const t of rows) {
  const p5 = `${OUT}/lean_${t.name}.json`
  if (!existsSync(p5)) continue
  const d = JSON.parse(readFileSync(p5, 'utf8'))
  const listed: string[] = d.files ?? []
  if (!listed.length) { fail(`${p5} attaches no source at all`); continue }
  for (const f of listed) if (!existsSync(f)) fail(`${p5} names ${f}, which is not in the tree`)
  for (const need of closureOf(t.file))
    if (!listed.includes('src/proof/' + need))
      fail(`${p5} omits src/proof/${need}, which its proof imports — the record would not compile for a reader`)
}

// ── THE LINK GRAPH IS COMPLETE, AND NOTHING IT PUBLISHES IS DEAD ────────────────────────────────────────
// A permanent record pointing at a URL that 404s is worse than one with no link: it sends a reader, and an
// indexer, into nothing. The first draft addressed theorem pages as /theorem/lean_<name> and 330 of 336
// were dead, because the site serves one page per LEDGER KEY and a key is an address, not a name.
// Checked against the built site when there is one; when there is not, this says so instead of passing
// quietly, because a check that skips in silence reports the health of nothing.
const REQUIRED = ['isPartOf', 'isSupplementTo', 'isSupplementedBy']
for (const t of rows) {
  const p2 = `${OUT}/lean_${t.name}.json`
  if (!existsSync(p2)) continue
  const d = JSON.parse(readFileSync(p2, 'utf8'))
  const rels: string[] = (d.related_identifiers ?? []).map((r: { relation: string }) => r.relation)
  for (const need of REQUIRED)
    if (!rels.includes(need)) fail(`${p2} publishes no ${need} relation — the record does not reach the repository or the package`)
  if (!Array.isArray(d.references) || d.references.length < 4)
    fail(`${p2} carries ${d.references?.length ?? 0} references; a record that cites nothing indexes as nothing`)
}

// ── EVERY RECORD SAYS WHAT IT CLAIMS, AND SAYS ITS NOVELTY STATUS OUT LOUD ──────────────────────────────
// A deposit that will not state its claim is not being modest, it is being unreadable — and an
// unclassified status left implicit reads to a reader as a claim of novelty that was never made. Both
// must be present, in the record itself, not only in a table in the repository.
for (const t of rows) {
  const p3 = `${OUT}/lean_${t.name}.json`
  if (!existsSync(p3)) continue
  const d = JSON.parse(readFileSync(p3, 'utf8'))
  const desc = String(d.description ?? '')
  if (!/^<p><strong>/.test(desc)) fail(`${p3} does not open with its claim — the reader meets provenance before the theorem`)
  if (!/(Novelty: (UNCLASSIFIED|CLAIMED))|(Prior art: NAMED AND CREDITED)/.test(desc))
    fail(`${p3} states no novelty status; an unstated status reads as a claim nobody made`)
  if (!/0\/7/.test(desc)) fail(`${p3} omits the scope line`)
}

const DIST0 = '.vitepress/dist'
// ── THE PUBLICATION AND THE WEB PAGE ARE THE SAME TEXT ──────────────────────────────────────────────────
// They were not. Both were maintained, separately and carefully, and they had drifted into disagreeing in
// public about the same theorem: the page said `superposition_collapses_to_one` was proved "exhausting 4
// cases" while the deposition omitted the number as inexact, and the page told all 336 the kernel had
// walked their whole domain when 112 are closed identities that walk none. One body in src/publication
// now feeds both, and this compares what actually shipped.
const strip = (x: string) => x.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
  .replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
if (existsSync(DIST0)) {
  let drift = 0
  for (const t of rows) {
    const p6 = `${OUT}/lean_${t.name}.json`
    const k = keyOf(t)
    if (!existsSync(p6) || !k) continue
    const page = `${DIST0}/theorem/${k}.html`
    if (!existsSync(page)) continue
    const body = strip(JSON.parse(readFileSync(p6, 'utf8')).description)
    if (!strip(readFileSync(page, 'utf8')).includes(body)) {
      drift++
      if (drift <= 3) fail(`${page} does not carry the text deposited as ${k} — the publication and the page disagree`)
    }
  }
  if (drift > 3) fail(`…and ${drift - 3} more pages differ from what would be deposited for them`)
}

const DIST = '.vitepress/dist'
if (!existsSync(DIST)) {
  console.log('  ○ site not built — the 336 published theorem-page URLs were NOT checked for resolution here;'
    + ' run `npm run docs:build` then this gate to check them')
} else {
  let dead = 0
  for (const t of rows) {
    const p2 = `${OUT}/lean_${t.name}.json`
    if (!existsSync(p2)) continue
    const d = JSON.parse(readFileSync(p2, 'utf8'))
    for (const r of d.related_identifiers ?? []) {
      const m = String(r.identifier).match(/\/millennium-solutions\/(.+)$/)
      if (!m || String(r.identifier).startsWith('https://github.com')) continue
      const slug = m[1]
      if (!existsSync(`${DIST}/${slug}.html`) && !existsSync(`${DIST}/${slug}/index.html`)) {
        dead++
        if (dead <= 5) fail(`${p2} publishes ${r.identifier}, which the built site does not serve`)
      }
    }
  }
  if (dead > 5) fail(`…and ${dead - 5} more published URLs do not resolve in the built site`)
}

// ── A PER-THEOREM CREDIT MUST NAME A REAL THEOREM, AND MUST REACH ITS RECORD ────────────────────────────
// `prior_art_theorem:` credits one declaration inside a file whose row says own work. A credit naming a
// theorem that does not exist credits nobody, and one that never reaches the deposition is a credit the
// citable record does not carry — which is the only place it matters.
for (const f of new Set(leanTheorems().map((t) => t.file))) {
  for (const [name, credit] of creditedIn(f)) {
    const t = leanTheorems().find((x) => x.file === f && x.name === name)
    if (!t) { fail(`src/proof/${f} credits prior art to \`${name}\`, which is not a theorem in that file`); continue }
    if (!credit.trim()) { fail(`src/proof/${f}: the credit for ${name} is empty`); continue }
    const p4 = `${OUT}/lean_${name}.json`
    if (existsSync(p4) && !readFileSync(p4, 'utf8').includes('NAMED AND CREDITED for this declaration'))
      fail(`${p4} does not carry the per-theorem credit its source declares`)
  }
}

// ── SURFACED, NOT ACTED ON: own-work theorems whose OWN TEXT names an earlier author ────────────────────
// A sibling session measured that routing attribution on file membership alone left four of nine sources
// unclassified while the citation sat in the atom's own sentence, and measured the opposite failure too —
// a surname inside a body is not a citation. Both are true here. Of three candidates this scan raises,
// one is real: merkaba.lean's `the_cube_and_the_tetrahedron_count_out` decides 4 + 4 - 6 = 2, the Euler
// characteristic, with Euler named in the comment above it. The other two are the false-positive shape —
// `relation_eight` says "the Fibonacci MINOR", which is this repo's own version scheme, and priorart.lean
// names everyone because it IS the attribution table.
//
// So this REPORTS and does not classify. Writing an unverified attribution into a permanent DOI record is
// the failure that cannot be taken back, and which of these is a restatement is the author's call.
const leads = rows.map((t) => ({ t, names: namesIn(t) })).filter((x) => x.names.length)
if (leads.length) {
  console.log(`\n  ○ ${leads.length} own-work theorem(s) name an earlier author in their own source text — for`)
  console.log('    classification, not automatically credited (a surname in a comment is not a citation):')
  for (const l of leads) console.log(`      ${l.t.file} · ${l.t.name} → ${l.names.join(', ')}`)
}

console.log(bad
  ? `\n✗ zenodo: ${bad} finding(s) — a deposition disagrees with the proof tree or the published DOI`
  : `\n✓ zenodo: ${rows.length} per-theorem depositions over ${own.size} files, each quoting its Lean statement and `
    + `LaTeX, each naming ${doi} as isPartOf; every one agrees with the kernel-accepted declaration it deposits`)
process.exit(bad ? 1 : 0)
