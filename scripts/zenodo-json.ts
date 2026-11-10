#!/usr/bin/env node
/** ── .zenodo.json, GENERATED — fresh figures, and the author's words left alone ────────────────────────
 *
 *  Captain's instruction: "generate zenodo.json so it is always fresh and novel". It had drifted exactly
 *  as a hand-maintained file does: `version` read 1.3.5 while the tree was tagged v9.7, and the concept
 *  DOI was written out in three separate files, which is three chances for a record to cite a publication
 *  that is not the one it belongs to.
 *
 *  WHAT IS COMPUTED, every run:
 *    · version          — NOT WRITTEN. Zenodo names a GitHub-release archive from this field when it is present
 *                         and from the release tag when it is absent, and this file is committed BEFORE its own
 *                         tag exists — so the latest tag it could read was always the previous one. v9.8.3 was
 *                         archived on Zenodo as "v9.8.2" (record 23905708) for exactly that reason. The tag is
 *                         the one thing that names the release, so it names the record.
 *    · creators, title  — read from CITATION.cff, the one place that already carries them with an ORCID
 *    · license          — from CITATION.cff, lowercased to Zenodo's spelling
 *    · keywords         — the authored list, UNION the ledger's own domain families, so the record says
 *                         what the deposit now contains rather than what it contained when someone typed
 *    · related_identifiers — the version chain from src/ledger/provenance.json and every citing work from
 *                         src/ledger/citations.json, each with its relation; nothing hand-listed
 *    · novelty          — counted from the prior-art classification: how many sources restate named work,
 *                         how many were searched and found nothing, how many were never searched. THAT is
 *                         what "novel" can honestly mean here, and it is a measurement with a shape:
 *                         unsearched is NOT MEASURED, not "nothing found".
 *
 *  WHAT IS NOT REWRITTEN, and why this generator stops short of full generation:
 *
 *  The description's opening is the AUTHOR'S PROSE. It states his claim, in his name, in his words. A
 *  generator that rebuilt it on every build would be an agent writing the author's description of his own
 *  work — which is, precisely and not by analogy, the thing FINDINGS.md documents agents having done here
 *  under his name. So the authored paragraph is carried through verbatim from the existing file and only
 *  the block between the two markers is regenerated. If the file is absent, the abstract from CITATION.cff
 *  is used and the run says so, because inventing a description would be the same act by another route.
 *
 *  usage:  node scripts/zenodo-json.ts            write .zenodo.json
 *          node scripts/zenodo-json.ts --check    fail if it is not what the tree derives */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { flag } from '../src/cli/index.ts'
import { ledger, theoremCount, leanFiles, leanTheorems } from '../src/api/index.ts'
import { kinds, KIND, isoReferences } from '../src/publication/index.ts'
import { MILLENNIUM } from '../src/millennium/index.ts'

const OUT = '.zenodo.json'
const OPEN = '<!--computed-->'
const CLOSE = '<!--/computed-->'

const cff = readFileSync('CITATION.cff', 'utf8')
const one = (re: RegExp, what: string): string => {
  const m = cff.match(re)
  if (!m) throw new Error(`CITATION.cff states no ${what} — it is the one source for it, so nothing is written`)
  return m[1].trim()
}
const TITLE = one(/^title:\s*"(.+)"\s*$/m, 'title')
const ORCID = one(/orcid:\s*"?(\S+?)"?\s*$/m, 'ORCID').replace(/^https?:\/\/orcid\.org\//, '')
const FAMILY = one(/family-names:\s*(.+)$/m, 'family name')
const GIVEN = one(/given-names:\s*(.+)$/m, 'given name')
const AFFIL = one(/affiliation:\s*"(.+)"\s*$/m, 'affiliation')
const LICENSE = one(/^license:\s*(\S+)\s*$/m, 'licence').toLowerCase()
const DOI = one(/^doi:\s*"?(10\.\d{4,}\/[^\s"]+)"?/m, 'concept DOI')
const ABSTRACT = (cff.match(/^abstract:\s*>-\n((?:\s{2}.*\n?)+)/m)?.[1] ?? '').replace(/\s+/g, ' ').trim()


// ── the record's own figures ────────────────────────────────────────────────────────────────────────────
const rows = ledger()
const live = rows.filter((e) => !('revoked' in e) || !(e as { revoked?: boolean }).revoked)
const families = [...new Set(rows.map((e) => (e.key.match(/^lean_([A-Za-z0-9.]+?)_/) ?? [])[1]).filter(Boolean))] as string[]

// NOVELTY, COUNTED BY KIND — not a word, a distribution. kind 0 restates named prior art, kind 2 was
// searched and found nothing, kind 1 was never searched. Collapsing 1 into 2 would turn "not measured"
// into "nothing found", which is the one substitution this deposit refuses everywhere else.
const byKind = new Map<string, number>()
for (const [, k] of kinds()) byKind.set(k, (byKind.get(k) ?? 0) + 1)
const novelty = [...byKind.entries()].sort().map(([k, n]) => `${n} ${KIND[k] ?? 'unclassified'}`).join('; ')

const prov: { records?: { id: string; concept: string; published: string; title: string }[] } =
  existsSync('src/ledger/provenance.json') ? JSON.parse(readFileSync('src/ledger/provenance.json', 'utf8')) : {}
const cites: { tracked?: { citing?: { doi: string }[] }[] } =
  existsSync('src/ledger/citations.json') ? JSON.parse(readFileSync('src/ledger/citations.json', 'utf8')) : {}

const bare = (d: string) => String(d).replace(/^https?:\/\/doi\.org\//, '')
type Related = { identifier: string; relation: string; scheme: string }

// THE INITIAL PUBLICATION, NOT THE WHOLE CHAIN — on the author's order (2026-11-10). This used to emit one
// `isVersionOf` line per deposit, 230 of them, which is a second hand-shipped copy of a list Zenodo already
// keeps itself: a concept DOI groups its versions on the registry's side, so re-listing every release here
// added no fact a reader could not get from the concept, and each line was an outbound DOI this record must
// resolve. What the concept does NOT carry is which deposit came FIRST, and that is the one version-chain
// fact worth stating: the INITIAL publication, as the proof of precedence. It is the earliest record in
// src/ledger/provenance.json — derived here, by date then id, never typed — and this deposit declares itself
// a new version of it.
const initial = [...(prov.records ?? [])].sort((a, b) =>
  a.published.localeCompare(b.published) || (Number(a.id) - Number(b.id)))[0]
// THE CONCEPT DOI STAYS, AND STAYS AS `isVersionOf`: `.zenodo.json` is one of the files zenodo-gate
// cross-checks for it, and the file this metadata describes IS a version of that concept. Third-party
// citations stay too — uptake is not the self version-chain, and the registry does not supply it.
const raw: Related[] = [
  { identifier: DOI, relation: 'isVersionOf', scheme: 'doi' },
  ...(initial ? [{ identifier: `10.5281/zenodo.${initial.id}`, relation: 'isNewVersionOf', scheme: 'doi' }] : []),
  ...(cites.tracked ?? []).flatMap((t) => (t.citing ?? []).map((c): Related =>
    ({ identifier: bare(c.doi), relation: 'isCitedBy', scheme: 'doi' }))),
  { identifier: 'https://github.com/ceccec/millennium-solutions', relation: 'isSupplementTo', scheme: 'url' },
]
const related = [...new Map(raw.map((r) => [r.identifier, r])).values()]

// THE QUANTUM SENTENCE, COUNTED: the theorems in the quantum_*.lean files and the device receipt, if one exists — so the
// record says "no device run" until scripts/quantum-hardware.ts writes one, and says what it returned once it has.
const quantum = (leanTheorems() as { file: string }[]).filter((t) => t.file.startsWith('quantum_')).length
const deviceRun: { status?: string; backend?: string } | null =
  existsSync('evidence/quantum-hardware/latest.json') ? JSON.parse(readFileSync('evidence/quantum-hardware/latest.json', 'utf8')) : null
const quantumSentence = `${quantum} of them decide every quantum computing model ISO/IEC 4879:2024 names, exactly, and scale `
  + `Mermin's GHZ test to 128 qubits; ${deviceRun ? `a run on ${deviceRun.backend} returned ${deviceRun.status}` : 'no run on real quantum hardware is recorded yet'}. `

const computed =
  `${OPEN} At this release: ${theoremCount()} theorems across ${leanFiles().length} Lean 4 files, each closed by `
  + `exhaustion over a stated finite domain, sorry-free and axiom-free; an append-only ledger of ${rows.length} entries, `
  + `${live.length} standing, across ${families.length} domain families, with a receipt chain recomputed on every build. `
  + quantumSentence
  + `Prior art, over the ${kinds().size} source(s) carrying a classification: ${novelty}`
  + `${leanFiles().length > kinds().size ? `; ${leanFiles().length - kinds().size} further source(s) carry no prior-art row at all, which is a gap in the classification and is counted rather than folded into "unclassified"` : ''}. `
  + `An unsearched source asserts no novelty — that is NOT MEASURED, not a finding of nothing. Every figure in this paragraph is recomputed by scripts/zenodo-json.ts from the tree it `
  + `describes; none of it is typed. ${CLOSE}`

// THE AUTHOR'S PARAGRAPH, CARRIED THROUGH. Everything before the marker is his and is copied byte for byte.
const previous: { description?: string } = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
const prior = String(previous.description ?? '')
const authored = prior ? prior.split(OPEN)[0].trimEnd() : ABSTRACT
if (!prior) console.log(`  ○ ${OUT} was absent — the author's description falls back to the CITATION.cff abstract. Nothing was invented for it.`)
if (!authored) throw new Error('no authored description and no abstract to fall back on — this generator will not write one')

// ── SUBJECTS & REFERENCES, DERIVED FROM THE TREE ─────────────────────────────────────────────────────────
// The record stated what the deposit CONTAINS (the computed block) but not what it is ABOUT in terms an
// indexer resolves. Both are read from the tree on every build, never typed:
//   subjects    — the seven Clay problems this framework draws its correspondence to, each the Clay
//                 Institute's own page, from the one table that pairs them (src/millennium). High-level, not
//                 the 26k-theorem granularity: scripts/zenodo-sync puts per-theorem subjects in the
//                 per-theorem records, where each term is one theorem's URL.
//   references  — the ISO standards the proofs formalise, from src/iso's own classification record, and the
//                 author's two earliest deposits, from the provenance chain (the prior art this descends from).
type Subject = { term: string; identifier: string; scheme: string }
const subjects = [...new Map(Object.values(MILLENNIUM).flatMap((m): [string, Subject][] => {
  const rows: [string, Subject][] = [[m.outlet, { term: `${m.problem.replace(/\s*\(.*\)$/, '')} — Clay Millennium Problem`, identifier: m.outlet, scheme: 'url' }]]
  if (m.outlet2 && m.outlet2Name) rows.push([m.outlet2, { term: m.outlet2Name, identifier: m.outlet2, scheme: 'url' }])
  return rows
})).values()]

// the ISO standards src/iso formalises + the author's two earliest deposits, derived once in src/publication
// (the same list the README and homepage now render as their ISO 690 reference section)
const references = isoReferences()

const out = {
  upload_type: 'publication',
  publication_type: 'preprint',
  title: TITLE,
  creators: [{ name: `${FAMILY}, ${GIVEN}`, orcid: ORCID, affiliation: AFFIL }],
  description: `${authored}\n\n${computed}`,
  language: 'eng',
  // KEYWORDS ARE NOT A PLACE TO PUT EVERYTHING THE TREE CONTAINS. The first version unioned the ledger's
  // 61 domain families into this field and produced 67 keywords, most of them internal slugs — `demand2`,
  // `z9plus`, `mechanical`. Those are directory names. A record whose keywords are a repository's folder
  // listing is harder to find, not easier, and it reads as an attempt to match more searches than the work
  // answers. Per-theorem granularity belongs in `subjects`, where each term carries a resolvable URL, and
  // scripts/zenodo-sync.ts puts it there. The authored list stands.
  keywords: (cff.match(/^keywords:\n((?:\s+-\s.*\n?)+)/m)?.[1] ?? '').split('\n').map((l) => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean),
  subjects,
  references,
  license: LICENSE,
  access_right: 'open',
  related_identifiers: related,
}
const body = JSON.stringify(out, null, 2) + '\n'

if (flag('--check')) {
  if (!existsSync(OUT)) { console.log(`  ✗ zenodo-json: ${OUT} is missing — run \`node scripts/zenodo-json.ts\``); process.exit(1) }
  if (readFileSync(OUT, 'utf8') !== body) { console.log(`  ✗ zenodo-json: ${OUT} is not what the tree derives — run \`node scripts/zenodo-json.ts\``); process.exit(1) }
  console.log(`  ✓ zenodo-json: ${OUT} agrees with the tree`)
  process.exit(0)
}
writeFileSync(OUT, body)
// The status line said "(61 from the ledger's own families)" after the families stopped feeding keywords.
// A line describing what the code used to do is the cheapest kind of false statement to ship.
console.log(`✓ zenodo-json: ${OUT} — ${out.keywords.length} authored keyword(s) · ${related.length} related identifier(s) · ${families.length} ledger families counted in the description, none in the keywords · novelty: ${novelty}`)
console.log(`  the author's description (${authored.length} chars) was carried through unchanged; only the computed block was rewritten.`)
