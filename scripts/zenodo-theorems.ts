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
import { leanTheorems, leanSource, type LeanTheorem } from '../src/api/index.ts'
import { toLatex } from '../src/latex/index.ts'
import { toUuid } from '../src/0/index.ts'

const base = JSON.parse(readFileSync('.zenodo.json', 'utf8'))
const CONCEPT_DOI = '10.5281/zenodo.21819217'
const OUT = '.zenodo/theorems'

/** The files whose theorems are this deposit's OWN construction — kind 1 in src/proof/priorart.lean,
 *  derived from that table rather than listed here, so the two cannot drift apart. */
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

const humanise = (n: string) => n.replace(/_/g, ' ')

export const deposition = (t: LeanTheorem) => {
  const latex = toLatex(t.statement)
  return {
    upload_type: 'publication',
    publication_type: 'preprint',
    title: `${humanise(t.name)} — a machine-checked theorem of the ℤ/9 vortex deposit`,
    creators: base.creators,
    description:
      `<p><strong>${humanise(t.name)}</strong>, declared in <code>src/proof/${t.file}</code> and accepted by the `
      + `Lean 4 kernel, sorry-free and axiom-free, closing by <code>${t.tactic}</code>.</p>`
      + `<p><strong>Statement (Lean):</strong></p><pre><code>${t.statement.replace(/</g, '&lt;')}</code></pre>`
      + `<p><strong>Statement (LaTeX):</strong></p><pre><code>${latex.replace(/</g, '&lt;')}</code></pre>`
      + `<p><strong>What this record establishes.</strong> A dated, public, citable deposit of this `
      + `declaration and its proof, recomputable from the source it names. That is priority. It is not a `
      + `claim that the result is unknown to the literature: prior art for this file is recorded in `
      + `<code>src/proof/priorart.lean</code> as <em>${KIND[kinds().get(t.file) ?? '1'] ?? KIND['1']}</em>.</p>`
      + `<p><strong>Scope.</strong> The declaration is decided over a finite domain by exhaustion. It settles `
      + `no Clay Millennium Problem and claims no quantum speedup. 0/7.</p>`,
    keywords: ['Lean 4', 'machine-checked proof', 'formal verification', 'Z/9', 'content-addressing',
      t.namespace || t.file.replace('.lean', '')],
    license: base.license,
    access_right: base.access_right,
    related_identifiers: [
      { identifier: CONCEPT_DOI, relation: 'isPartOf', scheme: 'doi' },
      { identifier: `https://ceccec.github.io/millennium-solutions/theorem/lean_${t.name}`, relation: 'isDocumentedBy', scheme: 'url' },
    ],
    notes: `key lean_${t.name} · receipt ${toUuid('lean_' + t.name)} · source file ${t.file}`,
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
