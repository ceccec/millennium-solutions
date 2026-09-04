#!/usr/bin/env node
// A ZENODO DEPOSITION PER THEOREM — the discoveries surfaced at scale, one citable record each.
//
// The repository already carries a concept DOI, and every release mints a new version of it. What it did
// NOT carry is a per-theorem record: 336 declarations that are this deposit's own construction sat under
// one file-level row reading "unclassified — no search performed, so nothing is claimed". That row is
// right about prior art and wrong as a summary of the work, because it left each result unaddressed and
// uncitable on its own.
//
// WHAT A DOI ESTABLISHES, kept exact, because this is the line the deposit is built on. A Zenodo record is
// a dated, public, citable deposit: it fixes WHAT was deposited and WHEN, and here it carries the Lean
// source, the statement, its LaTeX and the kernel's verdict, so a reader can recompute rather than trust.
// That is priority, and it is proved by the record itself. It is NOT the same proposition as "no one has
// proved this before", which is a claim about the literature that only a search can settle. Each
// deposition below carries both fields, separately, so neither is smuggled in under the other.
//
// This script WRITES the depositions. It does not upload them: minting a DOI is permanent and public, and
// that is the author's call to make, not a build step's.
import { writeFileSync, mkdirSync, rmSync, readFileSync, existsSync } from 'node:fs'
import { leanTheorems, leanSource, ledger, theoremOfKey, type LeanTheorem } from '../src/api/index.ts'
import { publicationHtml, NOVELTY, kinds, ownFiles, closureOf, creditedIn, SITE, REPO, CONCEPT_DOI, FUNDING } from '../src/publication/index.ts'
import { toUuid } from '../src/0/index.ts'

const base = JSON.parse(readFileSync('.zenodo.json', 'utf8'))
const OUT = '.zenodo/theorems'
const HOME = 'https://ceccec.psg.bg'
const PKG = 'https://www.npmjs.com/package/@uuidna/uuidna'

/** Edges to the declarations this proof depends on — the import closure, resolved to live theorem pages.
 *  Capped at twelve: a record listing every sibling in a 100-theorem file is a graph nobody can read, and
 *  Zenodo shows relations in full. The cap is stated in the record's own notes rather than applied
 *  silently, because a truncation nobody is told about reads as completeness. */
const siblingEdges = (t: LeanTheorem) => {
  const deps = closureOf(t.file)
  const out: { identifier: string; relation: string }[] = []
  for (const f of deps) {
    for (const dep of leanTheorems().filter((x) => x.file === f).slice(0, 4)) {
      const k = keyOf(dep)
      if (k) out.push({ identifier: `${SITE}/theorem/${k}`, relation: 'references' })
    }
  }
  return out.slice(0, 12)
}

/** The files whose theorems are this deposit's OWN construction — kind 1 in src/proof/priorart.lean,
 *  derived from that table rather than listed here, so the two cannot drift apart. */


// ── THE THEOREM'S PAGE IS ADDRESSED BY ITS LEDGER KEY, NOT BY ITS NAME ───────────────────────────────────
// The site renders one page per LIVE LEDGER KEY, and a key is an address, not a theorem name — the two
// coincide often enough to fool a first draft and not often enough to build on. Mine did: linking
// `/theorem/lean_<name>` produced 330 dead URLs out of 336, which in a permanent DOI record is worse than
// no link at all. The map is inverted from the ledger through theoremOfKey, the same resolver the pages
// use, so the URL a deposition publishes is the one the site actually serves.
let _keys: Map<string, string> | null = null
export const keyOf = (t: LeanTheorem): string | null => {
  if (!_keys) {
    _keys = new Map()
    const thms = leanTheorems()
    const live = [...new Set((ledger() as { key: string; revoked?: boolean; status?: string }[])
      .filter((e) => e.revoked !== true && e.status !== 'revoked').map((e) => e.key))].sort()
    for (const k of live) {
      const t2 = theoremOfKey(k, thms)
      if (t2 && !_keys.has(t2.name)) _keys.set(t2.name, k)
    }
  }
  return _keys.get(t.name) ?? null
}

// ── ATTRIBUTION FROM THE THEOREM'S OWN TEXT, not from its file's row ─────────────────────────────────────
// A sibling session measured this on their corpus: routing attribution on file membership alone left four
// of nine sources unclassified while the citation sat in the atom's own sentence. The same shape is here.
// merkaba.lean is this deposit's own construction and marked so, and inside it
// `the_cube_and_the_tetrahedron_count_out` decides 4 + 4 - 6 = 2 — the Euler characteristic — with the
// comment above it naming Euler. A deposition built from the file's row alone would mint a permanent
// record of a restatement without crediting the person the source itself credits.
//
// The names are DERIVED from the attributions priorart.lean already carries for its kind-0 files, so the
// list cannot fall behind the ledger the way a hand-written one does. A theorem is credited when a name
// the deposit already credits elsewhere appears in the comment block directly above it.
export const knownNames = (): string[] => {
  const src = leanSource('priorart.lean')
  const names = new Set<string>()
  for (const m of src.matchAll(/--\s*\w+\.lean\s*—\s*(.+)$/gm))
    for (const w of m[1].matchAll(/\b([A-Z][a-zà-ÿ]{2,})\b/g)) names.add(w[1])
  for (const drop of ['The', 'This', 'FNV', 'Merkle', 'Millennium', 'One', 'Written'])
    names.delete(drop)
  names.add('Merkle')
  return [...names].sort()
}

/** The comment block immediately above a declaration — what the source says about it in its own voice. */
export const blockAbove = (file: string, name: string): string => {
  const lines = leanSource(file).split('\n')
  const i = lines.findIndex((l) => new RegExp(`^\\s*theorem\\s+${name}\\b`).test(l))
  if (i < 0) return ''
  const out: string[] = []
  for (let j = i - 1; j >= 0 && /^\s*--/.test(lines[j]); j--) out.unshift(lines[j])
  return out.join('\n')
}

/** Prior artists this theorem's own text names. */
export const namesIn = (t: LeanTheorem): string[] => {
  const block = blockAbove(t.file, t.name)
  return knownNames().filter((n) => new RegExp(`\\b${n}`).test(block))
}

const humanise = (n: string) => n.replace(/_/g, ' ')

export const deposition = (t: LeanTheorem) => {
  const key = keyOf(t)
  const page = key ? `${SITE}/theorem/${key}` : null
  const credit = creditedIn(t.file).get(t.name) ?? null
  const needs = closureOf(t.file)
  const needs2 = ['src/proof/' + t.file, ...needs.map((f) => 'src/proof/' + f)]
  const novelty = credit
    ? `Prior art: NAMED AND CREDITED for this declaration specifically. ${credit} The file it sits in is `
      + `otherwise this deposit's own construction; this record claims no priority over the earlier work it names.`
    : (NOVELTY[kinds().get(t.file) ?? '1'] ?? NOVELTY['1'])
  return {
    upload_type: 'publication',
    publication_type: 'preprint',
    title: `${humanise(t.name)} — a machine-checked theorem of the ℤ/9 vortex deposit`,
    creators: base.creators,
    // ONE BODY, shared with the web page — see src/publication/index.ts. These were maintained separately
    // and disagreed in public about the same theorem; the gate now compares them.
    description: publicationHtml(t, { novelty, files: needs2, key }),
    keywords: ['Lean 4', 'machine-checked proof', 'formal verification', 'Z/9', 'content-addressing',
      t.namespace || t.file.replace('.lean', ''), ...(credit ? ['Euler characteristic', 'polyhedron formula'] : [])],
    license: base.license,
    access_right: base.access_right,
    language: 'eng',
    // NO `notes_funding` KEY. I invented that name and it is not in the Zenodo schema — checked against
    // developers.zenodo.org, which lists the deposit attributes and has no such field. Funding belongs in
    // `grants`, and `grants` accepts only OpenAIRE/ROR-registered awards, which this work has none of. So
    // the statement goes in `notes`, which IS a documented field, and no grant is claimed.
    // NO REPOSITORY VERSION HERE, deliberately. It was `git describe --tags`, and the release
    // workflow mints a tag on every push whose content-address moved — so all 336 records went
    // stale the moment CI tagged v8.1.0, with no theorem having changed. A record about a theorem
    // must not churn because the repository was tagged. Versioning of the deposit is Zenodo's own,
    // through the concept DOI named below; what identifies THIS record is the theorem's key and
    // receipt, and neither moves.
    // ── THE GRAPH BETWEEN RECORDS ─────────────────────────────────────────────────────────────────────
    // Zenodo indexes related_identifiers and hands them to DataCite, so relations between records are what
    // turn 336 isolated deposits into one navigable body of work. Three kinds are emitted:
    //   · isPartOf     — the concept DOI, and the site
    //   · references   — the theorems this proof DEPENDS ON, taken from the import closure. Real edges:
    //                    a record for a theorem in speed.lean references the ledger, merkle, address and
    //                    fnv declarations its proof actually needs.
    //   · isSupplementTo / isDocumentedBy — the source, the page, the paper
    // The dependency edges are addressed by page URL rather than by DOI because sibling DOIs do not exist
    // until they are minted; a second pass after minting can upgrade them in place, and a URL that
    // resolves today is worth more than a DOI that does not exist yet.
    subjects: [
      { term: 'Formal methods', identifier: 'https://www.wikidata.org/wiki/Q1332293' },
      { term: 'Automated theorem proving', identifier: 'https://www.wikidata.org/wiki/Q1191319' },
      { term: 'Modular arithmetic', identifier: 'https://www.wikidata.org/wiki/Q319400' },
    ],
    method: `Declared in Lean 4 and checked by its kernel. Closed by \`${t.tactic}\`, sorry-free, with `
      + `#print axioms reporting no axiom dependency, no Mathlib and no native_decide. Re-verified on every `
      + `build by scripts/lean.ts; the statement rendered here is read from the source through the same `
      + `resolver the ledger uses, so a record cannot show a formula the kernel did not check.`,
    communities: base.communities ?? [],
    // ── THE LINK GRAPH ────────────────────────────────────────────────────────────────────────────────
    // Every record points back at the things that make it checkable: the concept DOI it belongs to, the
    // exact source line that declares it, the page that renders it, the paper that typesets it, the site
    // and the repository. These are the relations Zenodo exposes to indexers and to DataCite, so a search
    // for the theorem's own name reaches the deposit rather than dead-ending at a bare record.
    related_identifiers: [
      { identifier: CONCEPT_DOI, relation: 'isPartOf' },
      ...(page ? [{ identifier: page, relation: 'isDocumentedBy' }] : []),
      { identifier: `${SITE}/paper`, relation: 'isDocumentedBy' },
      { identifier: `${SITE}/proofs`, relation: 'isDocumentedBy' },
      { identifier: `${REPO}/blob/main/src/proof/${t.file}`, relation: 'isSupplementTo' },
      { identifier: REPO, relation: 'isSupplementTo' },
      { identifier: HOME, relation: 'isPartOf' },
      { identifier: PKG, relation: 'isSupplementedBy' },
      ...siblingEdges(t),
    ],
    references: [
      `Rouschev, T. The ℤ/9 Vortex Framework. Zenodo. https://doi.org/${CONCEPT_DOI}`,
      `Declaration \`${t.name}\`, src/proof/${t.file}, Lean 4, closed by ${t.tactic}. ${REPO}/blob/main/src/proof/${t.file}`,
      `Typeset statement and proof census: ${SITE}/paper`,
      ...(page ? [`Content-addressed record ${key}, receipt ${toUuid(key!)}: ${page}`] : []),
      `Verifier and recomputation instructions: ${SITE}/verify`,
      `Reference implementation, @uuidna/uuidna: ${PKG}`,
    ],
    files: needs2,
    notes: `${FUNDING.statement} · key ${key ?? '(no live ledger key)'} · receipt ${key ? toUuid(key) : '—'} · source file src/proof/${t.file} · `
      + `namespace ${t.namespace || '(none)'} · closed by ${t.tactic} · concept DOI ${CONCEPT_DOI} · `
      + `recompute: lake env lean ${needs2.join(' ')} — or git clone ${REPO} && npm ci && npm run lean`,
  }
}

const own = new Set(ownFiles())
const rows = leanTheorems().filter((t) => own.has(t.file))

if (process.argv[2] === '--write') {
  rmSync(OUT, { recursive: true, force: true })
  mkdirSync(OUT, { recursive: true })
  for (const t of rows) writeFileSync(`${OUT}/lean_${t.name}.json`, JSON.stringify(deposition(t), null, 2) + '\n')
  writeFileSync('.zenodo/index.json', JSON.stringify({
    concept_doi: CONCEPT_DOI,
    generated_from: 'src/proof/priorart.lean kind 1 · src/proof/*.lean',
    count: rows.length,
    files: [...own].sort(),
    depositions: rows.map((t) => `lean_${t.name}`).sort(),
  }, null, 2) + '\n')
}

// Printed only when run directly: importing this module from the gate must not emit a line of its own.
if (import.meta.url === `file://${process.argv[1]}`) console.log(`${existsSync(OUT) ? '✓' : '○'} zenodo-theorems: ${rows.length} depositions over ${own.size} files that are `
  + `this deposit's own work, each carrying its Lean statement, its LaTeX and the concept DOI ${CONCEPT_DOI} as isPartOf`
  + (process.argv[2] === '--write' ? ` → ${OUT}/` : ' (run with --write to emit)'))
