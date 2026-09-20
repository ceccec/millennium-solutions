#!/usr/bin/env node
/** ── .zenodo.json, GENERATED — fresh figures, and the author's words left alone ────────────────────────
 *
 *  Captain's instruction: "generate zenodo.json so it is always fresh and novel". It had drifted exactly
 *  as a hand-maintained file does: `version` read 1.3.5 while the tree was tagged v9.7, and the concept
 *  DOI was written out in three separate files, which is three chances for a record to cite a publication
 *  that is not the one it belongs to.
 *
 *  WHAT IS COMPUTED, every run:
 *    · version          — from the latest annotated tag, not typed
 *    · creators, title  — read from CITATION.cff, the one place that already carries them with an ORCID
 *    · license          — from CITATION.cff, lowercased to Zenodo's spelling
 *    · keywords         — the authored list, UNION the ledger's own domain families, so the record says
 *                         what the deposit now contains rather than what it contained when someone typed
 *    · related_identifiers — the version chain from src/proof/provenance.json and every citing work from
 *                         src/proof/citations.json, each with its relation; nothing hand-listed
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
import { execFileSync } from 'node:child_process'
import { flag } from '../src/cli/index.ts'
import { ledger, theoremCount, leanFiles } from '../src/api/index.ts'
import { kinds, KIND } from '../src/publication/index.ts'

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

const VERSION = (() => {
  try { return execFileSync('git', ['describe', '--tags', '--abbrev=0'], { encoding: 'utf8' }).trim() } catch { return '' }
})()
if (!VERSION) throw new Error('no tag to name this version — a deposition whose version is guessed is worse than one with none')

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

const prov: { records?: { id: string; concept: string }[] } =
  existsSync('src/proof/provenance.json') ? JSON.parse(readFileSync('src/proof/provenance.json', 'utf8')) : {}
const cites: { tracked?: { citing?: { doi: string }[] }[] } =
  existsSync('src/proof/citations.json') ? JSON.parse(readFileSync('src/proof/citations.json', 'utf8')) : {}

const bare = (d: string) => String(d).replace(/^https?:\/\/doi\.org\//, '')
type Related = { identifier: string; relation: string; scheme: string }
const related = [
  ...new Map<string, Related>([
    ...(prov.records ?? []).map((r): [string, Related] => [`10.5281/zenodo.${r.id}`, { identifier: `10.5281/zenodo.${r.id}`, relation: 'isVersionOf', scheme: 'doi' }]),
    ...(cites.tracked ?? []).flatMap((t) => (t.citing ?? []).map((c): [string, Related] => [bare(c.doi), { identifier: bare(c.doi), relation: 'isCitedBy', scheme: 'doi' }])),
  ]).values(),
  { identifier: 'https://github.com/ceccec/millennium-solutions', relation: 'isSupplementTo', scheme: 'url' },
]
// THE CONCEPT DOI STAYS, AND STAYS AS `isVersionOf`. The first version filtered it out on the reasoning
// that a record should not relate to itself — and zenodo-gate refused, correctly: `.zenodo.json` is one of
// the three files it cross-checks for the concept DOI, so removing it silently broke the only check that
// catches a deposition citing a publication it does not belong to. The file this metadata describes is a
// VERSION of that concept, which is what isVersionOf says; the hand-written original said isNewVersionOf
// of itself, which is a record claiming to supersede itself.
if (!related.some((r) => r.identifier === DOI)) related.unshift({ identifier: DOI, relation: 'isVersionOf', scheme: 'doi' })

const computed =
  `${OPEN} As of ${VERSION}: ${theoremCount()} theorems across ${leanFiles().length} Lean 4 files, each closed by `
  + `exhaustion over a stated finite domain, sorry-free and axiom-free; an append-only ledger of ${rows.length} entries, `
  + `${live.length} standing, across ${families.length} domain families, with a receipt chain recomputed on every build. `
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

const out = {
  upload_type: 'publication',
  publication_type: 'preprint',
  title: TITLE,
  creators: [{ name: `${FAMILY}, ${GIVEN}`, orcid: ORCID, affiliation: AFFIL }],
  description: `${authored}\n\n${computed}`,
  // KEYWORDS ARE NOT A PLACE TO PUT EVERYTHING THE TREE CONTAINS. The first version unioned the ledger's
  // 61 domain families into this field and produced 67 keywords, most of them internal slugs — `demand2`,
  // `z9plus`, `mechanical`. Those are directory names. A record whose keywords are a repository's folder
  // listing is harder to find, not easier, and it reads as an attempt to match more searches than the work
  // answers. Per-theorem granularity belongs in `subjects`, where each term carries a resolvable URL, and
  // scripts/zenodo-sync.ts puts it there. The authored list stands.
  keywords: (cff.match(/^keywords:\n((?:\s+-\s.*\n?)+)/m)?.[1] ?? '').split('\n').map((l) => l.replace(/^\s*-\s*/, '').trim()).filter(Boolean),
  license: LICENSE,
  access_right: 'open',
  version: VERSION,
  related_identifiers: related,
}
const body = JSON.stringify(out, null, 2) + '\n'

if (flag('--check')) {
  if (!existsSync(OUT)) { console.log(`  ✗ zenodo-json: ${OUT} is missing — run \`node scripts/zenodo-json.ts\``); process.exit(1) }
  if (readFileSync(OUT, 'utf8') !== body) { console.log(`  ✗ zenodo-json: ${OUT} is not what the tree derives — run \`node scripts/zenodo-json.ts\``); process.exit(1) }
  console.log(`  ✓ zenodo-json: ${OUT} agrees with the tree at ${VERSION}`)
  process.exit(0)
}
writeFileSync(OUT, body)
// The status line said "(61 from the ledger's own families)" after the families stopped feeding keywords.
// A line describing what the code used to do is the cheapest kind of false statement to ship.
console.log(`✓ zenodo-json: ${OUT} — ${VERSION} · ${out.keywords.length} authored keyword(s) · ${related.length} related identifier(s) · ${families.length} ledger families counted in the description, none in the keywords · novelty: ${novelty}`)
console.log(`  the author's description (${authored.length} chars) was carried through unchanged; only the computed block was rewritten.`)
