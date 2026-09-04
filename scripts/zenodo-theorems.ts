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
import { toLatex } from '../src/latex/index.ts'
import { toUuid } from '../src/0/index.ts'

const base = JSON.parse(readFileSync('.zenodo.json', 'utf8'))
const CONCEPT_DOI = '10.5281/zenodo.21819217'
const OUT = '.zenodo/theorems'
const SITE = 'https://ceccec.github.io/millennium-solutions'
const HOME = 'https://ceccec.psg.bg'
const REPO = 'https://github.com/ceccec/millennium-solutions'
const PKG = 'https://www.npmjs.com/package/@uuidna/uuidna'

/** The files whose theorems are this deposit's OWN construction — kind 1 in src/proof/priorart.lean,
 *  derived from that table rather than listed here, so the two cannot drift apart. */
// Surfaced in the record itself, in bold, rather than left to a file-level table nobody reads. A deposit
// that will not say what it claims is not being modest, it is being unreadable.
const NOVELTY: Record<string, string> = {
  '0': 'Prior art: NAMED AND CREDITED. This declaration restates or builds on work with an earlier author, '
    + 'recorded in src/proof/priorart.lean. No priority over that work is claimed here.',
  '1': 'Novelty: UNCLASSIFIED — an open question, not a claim. No prior-art search has been performed for '
    + 'this source file, so this record asserts priority of deposit and nothing about the literature.',
  '2': 'Novelty: CLAIMED. A named prior-art search was performed for this source file and returned nothing; '
    + 'the search itself is on the record in src/proof/priorart.lean.',
}
const KIND: Record<string, string> = {
  '0': 'restates named prior art, the earlier author credited',
  '1': 'unclassified — no prior-art search has been performed, so no novelty is asserted',
  '2': 'a named prior-art search was performed and found nothing',
}
/** file -> its row in the table, so a deposition quotes the ledger rather than a guess. */
export const kinds = (): Map<string, string> =>
  new Map([...leanSource('priorart.lean').matchAll(/\(\s*\d+,\s*(\d+),\s*(?:true|false)\)\s*--\s*(\S+\.lean)/g)]
    .map((m) => [m[2], m[1]] as [string, string]))
export const ownFiles = (): string[] => [...kinds()].filter(([, k]) => k === '1').map(([f]) => f)

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

/** PER-THEOREM ATTRIBUTION, read from `-- prior_art_theorem: <name> — <credit>` in a file's frontmatter.
 *  Prior art was routed on the FILE, and a file-level row cannot say "own work except theorem 7". That is
 *  exactly merkaba.lean: its own construction throughout, with one declaration whose third conjunct
 *  4 + 4 - 6 = 2 is the Euler characteristic. The register now carries the exception where the exception
 *  is, and a credited theorem says so in its own deposition instead of inheriting the file's status. */
export const creditedIn = (file: string): Map<string, string> => {
  const out = new Map<string, string>()
  const lines = leanSource(file).split('\n')
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^--\s*prior_art_theorem:\s*(\w+)\s*[—-]\s*(.*)$/)
    if (!m) continue
    let credit = m[2].trim()
    for (let j = i + 1; j < lines.length && /^--\s{2,}\S/.test(lines[j]); j++) credit += ' ' + lines[j].replace(/^--\s+/, '').trim()
    out.set(m[1], credit)
  }
  return out
}

/** Prior artists this theorem's own text names. */
export const namesIn = (t: LeanTheorem): string[] => {
  const block = blockAbove(t.file, t.name)
  return knownNames().filter((n) => new RegExp(`\\b${n}`).test(block))
}

const humanise = (n: string) => n.replace(/_/g, ' ')

export const deposition = (t: LeanTheorem) => {
  const latex = toLatex(t.statement)
  const key = keyOf(t)
  const page = key ? `${SITE}/theorem/${key}` : null
  const credit = creditedIn(t.file).get(t.name) ?? null
  return {
    upload_type: 'publication',
    publication_type: 'preprint',
    title: `${humanise(t.name)} — a machine-checked theorem of the ℤ/9 vortex deposit`,
    creators: base.creators,
    description:
      // ── THE CLAIM LEADS, IN BOLD, AND THE LIMIT FOLLOWS IN THE SAME VOICE ─────────────────────────────
      // NO CASE COUNT IS PUBLISHED HERE, deliberately. domainOf() reads numerals off the statement text and
      // is good enough to rank theorems on the front pages; it is not exact. For
      // `superposition_collapses_to_one` it returns 4, counting the elements of [1,2,4,8], while the
      // statement walks the 24 permutations that perms_of_four_is_factorial decides there are. Ranking
      // survives that; a permanent citable record does not. The qualitative claim — decided over the whole
      // domain, every case walked — is exact, and it is the part that carries the weight anyway.
      // An earlier draft opened with "declared in <file> and accepted by the kernel" and put the result
      // nowhere: a reader met the provenance before they met the theorem. What this deposit actually has
      // is stronger than how it had been writing itself down — a proposition decided over its ENTIRE
      // domain, every case walked by the kernel, no axioms and no `sorry`. That is the first sentence now.
      // The scope stays, in the same weight, because a claim that hides its limit is not clearer, it is
      // just louder.
      `<p><strong>${humanise(t.name)}</strong> — <strong>decided over the whole of its finite domain by `
      + `exhaustion, every case walked by the Lean 4 kernel.</strong> Not sampled and not argued: within `
      + `that domain there is no residual uncertainty and no case left untested.</p>`
      + `<p><strong>Statement (Lean):</strong></p><pre><code>${t.statement.replace(/</g, '&lt;')}</code></pre>`
      + `<p><strong>Statement (LaTeX):</strong></p><pre><code>${latex.replace(/</g, '&lt;')}</code></pre>`
      + `<p><strong>What this record establishes.</strong> <strong>A dated, public, citable deposit</strong> of `
      + `this declaration and its machine-checked proof, recomputable from the source it names — `
      + `<strong>sorry-free, axiom-free, and free of any Mathlib dependency</strong>. That is priority, and `
      + `the record proves it on its own. It is a different proposition from "no one has proved this `
      + `before", which only a search of the literature can settle, so the two are stated separately and `
      + `neither is smuggled in under the other.</p>`
      + (credit
        ? `<p><strong>Prior art: NAMED AND CREDITED for this declaration specifically.</strong> ${credit} `
          + `The file it sits in is otherwise this deposit's own construction; this record claims no priority `
          + `over the earlier work it names.</p>`
        : `<p><strong>${NOVELTY[kinds().get(t.file) ?? '1'] ?? NOVELTY['1']}</strong></p>`)
      + `<p><strong>Scope, stated as plainly as the claim.</strong> The declaration is decided over a finite `
      + `domain. It settles no Clay Millennium Problem, asserts no quantum speedup, and describes no `
      + `physical system. <strong>0/7.</strong></p>`,
    keywords: ['Lean 4', 'machine-checked proof', 'formal verification', 'Z/9', 'content-addressing',
      t.namespace || t.file.replace('.lean', ''), ...(credit ? ['Euler characteristic', 'polyhedron formula'] : [])],
    license: base.license,
    access_right: base.access_right,
    language: 'eng',
    communities: base.communities ?? [],
    // ── THE LINK GRAPH ────────────────────────────────────────────────────────────────────────────────
    // Every record points back at the things that make it checkable: the concept DOI it belongs to, the
    // exact source line that declares it, the page that renders it, the paper that typesets it, the site
    // and the repository. These are the relations Zenodo exposes to indexers and to DataCite, so a search
    // for the theorem's own name reaches the deposit rather than dead-ending at a bare record.
    related_identifiers: [
      { identifier: CONCEPT_DOI, relation: 'isPartOf', scheme: 'doi' },
      ...(page ? [{ identifier: page, relation: 'isDocumentedBy', scheme: 'url' }] : []),
      { identifier: `${SITE}/paper`, relation: 'isDocumentedBy', scheme: 'url' },
      { identifier: `${SITE}/proofs`, relation: 'isDocumentedBy', scheme: 'url' },
      { identifier: `${REPO}/blob/main/src/proof/${t.file}`, relation: 'isSupplementTo', scheme: 'url' },
      { identifier: REPO, relation: 'isSupplementTo', scheme: 'url' },
      { identifier: HOME, relation: 'isPartOf', scheme: 'url' },
      { identifier: PKG, relation: 'isSupplementedBy', scheme: 'url' },
    ],
    references: [
      `Rouschev, T. The ℤ/9 Vortex Framework. Zenodo. https://doi.org/${CONCEPT_DOI}`,
      `Declaration \`${t.name}\`, src/proof/${t.file}, Lean 4, closed by ${t.tactic}. ${REPO}/blob/main/src/proof/${t.file}`,
      `Typeset statement and proof census: ${SITE}/paper`,
      ...(page ? [`Content-addressed record ${key}, receipt ${toUuid(key!)}: ${page}`] : []),
      `Verifier and recomputation instructions: ${SITE}/verify`,
      `Reference implementation, @uuidna/uuidna: ${PKG}`,
    ],
    notes: `key ${key ?? '(no live ledger key)'} · receipt ${key ? toUuid(key) : '—'} · source file src/proof/${t.file} · `
      + `namespace ${t.namespace || '(none)'} · closed by ${t.tactic} · concept DOI ${CONCEPT_DOI} · `
      + `recompute: git clone ${REPO} && npm ci && npm run lean`,
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
