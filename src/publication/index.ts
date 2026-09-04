// THE PUBLICATION BODY — one text, rendered on the web page and deposited at Zenodo, byte for byte.
//
// These had drifted apart while both were being improved. The page said a theorem was proved "exhausting
// 4 cases"; the deposition deliberately omitted that number because domainOf() reads numerals off the
// statement and returns 4 for a proposition that walks the 24 permutations its neighbour counts. Both were
// written carefully. They still disagreed, in public, about the same theorem — which is what happens to
// two descriptions of one thing that are maintained in two places.
//
// So there is one place now. The page imports it, the Zenodo record imports it, and a gate compares them.
//
// THE COUNT IS PUBLISHED AS A LOWER BOUND, because that is what it is. domainOf() multiplies the numerals
// it finds in a statement: for `List.range 9` that is exact, and for the permutations of [1,2,4,8] it
// returns 4 while the kernel walks the 24 that perms_of_four_is_factorial decides there are. The page has
// been printing it as an exact count, and a citable record must not. Calling it a lower bound is true of
// both cases and costs the claim nothing.
//
// THE CASE COUNT IS HANDLED THE WAY THE PAPER ALREADY HANDLED IT. paper.ts has long distinguished
// `cases > 1` — "exhausting N cases" — from a single-case declaration, which it calls "by evaluation; no
// domain is walked". That distinction is honest and it is the deposit's own, and it was missing from my
// deposition prose, which told every record it had walked its whole domain. 112 of 336 had not.
import { readFileSync } from 'node:fs'
import { domainOf, leanSource, type LeanTheorem } from '../api/index.ts'
import { toLatex } from '../latex/index.ts'

/** THE FUNDING STATEMENT, read from .github/FUNDING.yml so the repository declares it in one place.
 *
 *  Zenodo's `grants` field accepts only awards registered with OpenAIRE, and its custom-award lookup is
 *  powered by ROR — a funder must exist in one of those registries to be named. This work has no
 *  institutional grant and no registered funder, so NO `grants` entry is emitted. Inventing one, or
 *  attaching an unrelated funder DOI to make the record look institutionally backed, would be a false
 *  statement in permanent metadata about who paid for the work.
 *
 *  What is true is stated instead, in the record's own text: independent, unfunded by any grant, supported
 *  by direct contribution. That is a funding statement a reader can act on, and it costs nothing to be
 *  accurate about. */
export const FUNDING = (() => {
  try {
    const y = readFileSync('.github/FUNDING.yml', 'utf8')
    const url = (y.match(/https?:\/\/[^\s"'\]]+/) ?? [])[0] ?? ''
    return { url, statement: 'Independent research. No institutional grant and no funder registered with '
      + 'OpenAIRE or ROR, so no award is claimed in this record'
      + (url ? `. Development is supported by direct contribution: ${url}` : '.') }
  } catch { return { url: '', statement: 'Independent research; no grant funding is claimed in this record.' } }
})()

export const SITE = 'https://ceccec.github.io/millennium-solutions'
export const REPO = 'https://github.com/ceccec/millennium-solutions'
/** READ FROM CITATION.cff, not typed. It was written out in two modules — this one and
 *  scripts/zenodo-theorems.ts — which is two places for the identifier that every deposition names as
 *  isPartOf and that the page prints. Two copies of a DOI is one drift away from a record citing a
 *  publication that is not the one it belongs to. zenodo-gate.ts already treats CITATION.cff as the
 *  authority and cross-checks README.md and .zenodo.json against it; this makes the code agree. */
export const CONCEPT_DOI = (() => {
  const m = readFileSync('CITATION.cff', 'utf8').match(/^doi:\s*"?(10\.\d{4,}\/[^\s"]+)"?/m)
  if (!m) throw new Error('CITATION.cff states no concept DOI — every deposition needs something to be part of')
  return m[1]
})()

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
export const humanise = (n: string) => n.replace(/_/g, ' ')

/** Exhaustion is a claim about a domain. A closed identity is not one, and must not be dressed as one. */
export const walksADomain = (t: LeanTheorem): boolean => domainOf(t.statement) > 1

export const claimLine = (t: LeanTheorem): string =>
  walksADomain(t)
    ? `<strong>decided over the whole of its finite domain by exhaustion, every case walked by the Lean 4 `
      + `kernel.</strong> Not sampled and not argued: within that domain there is no residual uncertainty and no `
      + `case left untested. The domain read off the statement is ${domainOf(t.statement).toLocaleString('en')} `
      + `cases — a LOWER BOUND, not a count: where a statement generates its own domain the kernel walks more `
      + `than the numerals name, and this one is read the same way the paper ranks by it.`
    : `<strong>a closed identity, evaluated by the Lean 4 kernel.</strong> No domain is walked here — the `
      + `proposition reduces, and the kernel confirms the reduction. It is checked, not exhausted, and it is `
      + `not offered as the larger claim.`

export const proofLine = (t: LeanTheorem): string =>
  `<em>Proof.</em> <code>${t.tactic}</code>`
  + (walksADomain(t) ? ` — exhausting its domain, of which the statement names ${domainOf(t.statement).toLocaleString('en')} cases.` : ' — by evaluation; no domain is walked.')
  + ` Checked sorry-free; <code>#print axioms</code> reports no axiom dependency. No Mathlib, no <code>native_decide</code>. □`

/** The canonical body. `novelty` and `files` come from the register and the import closure. */
export const publicationHtml = (t: LeanTheorem, opts: { novelty: string; files: string[]; key: string | null }): string =>
  `<p><strong>${humanise(t.name)}</strong> — ${claimLine(t)}</p>`
  + `<p><strong>Statement (Lean):</strong></p><pre><code>${esc(t.statement)}</code></pre>`
  + `<p><strong>Statement (LaTeX):</strong></p><pre><code>${esc(toLatex(t.statement))}</code></pre>`
  + `<p>${proofLine(t)}</p>`
  + `<p><strong>What this record establishes.</strong> <strong>A dated, public, citable deposit</strong> of this `
  + `declaration and its machine-checked proof, recomputable from the sources attached to it. That is priority, `
  + `and the record proves it on its own. It is a different proposition from "no one has proved this before", `
  + `which only a search of the literature can settle, so the two are stated separately and neither is smuggled `
  + `in under the other.</p>`
  + `<p><strong>${opts.novelty}</strong></p>`
  + `<p><strong>Verification.</strong> The proof needs ${opts.files.length === 1 ? 'one file' : `${opts.files.length} files`}, `
  + `all attached: <code>${opts.files.join('</code>, <code>')}</code>. Check it with `
  + `<code>lake env lean ${opts.files.join(' ')}</code>, or clone <a href="${REPO}">${REPO}</a> and run `
  + `<code>npm run lean</code>.`
  + (opts.key ? ` The content-address of this declaration is recorded as <code>${opts.key}</code> at <a href="${SITE}/theorem/${opts.key}">${SITE}/theorem/${opts.key}</a>.` : '')
  + ` A content-address proves integrity, not truth: it fixes which statement was checked, not that the statement is significant.</p>`
  + `<p><strong>Funding.</strong> ${FUNDING.statement}</p>`
  + `<p><strong>Scope, stated as plainly as the claim.</strong> The declaration is decided over a finite domain. `
  + `It settles no Clay Millennium Problem, asserts no quantum speedup, and describes no physical system. `
  + `<strong>0/7.</strong></p>`

// ── the register, shared by the page and the deposition ─────────────────────────────────────────────────

// Surfaced in the record itself, in bold, rather than left to a file-level table nobody reads. A deposit
// that will not say what it claims is not being modest, it is being unreadable.
export const NOVELTY: Record<string, string> = {
  '0': 'Prior art: NAMED AND CREDITED. This declaration restates or builds on work with an earlier author, '
    + 'recorded in src/proof/priorart.lean. No priority over that work is claimed here.',
  '1': 'Novelty: UNCLASSIFIED — an open question, not a claim. No prior-art search has been performed for '
    + 'this source file, so this record asserts priority of deposit and nothing about the literature.',
  '2': 'Novelty: CLAIMED. A named prior-art search was performed for this source file and returned nothing; '
    + 'the search itself is on the record in src/proof/priorart.lean.',
}
export const KIND: Record<string, string> = {
  '0': 'restates named prior art, the earlier author credited',
  '1': 'unclassified — no prior-art search has been performed, so no novelty is asserted',
  '2': 'a named prior-art search was performed and found nothing',
}
/** file -> its row in the table, so a deposition quotes the ledger rather than a guess. */
export const kinds = (): Map<string, string> =>
  new Map([...leanSource('priorart.lean').matchAll(/\(\s*\d+,\s*(\d+),\s*(?:true|false)\)\s*--\s*(\S+\.lean)/g)]
    .map((m) => [m[2], m[1]] as [string, string]))
export const ownFiles = (): string[] => [...kinds()].filter(([, k]) => k === '1').map(([f]) => f)

/** THE FILES A RECORD MUST CARRY FOR ITS PROOF TO CHECK — the transitive closure of its imports.
 *
 *  Measured before this existed: 245 of 336 depositions attached ONE file that needed others to compile.
 *  A reader downloading `lean_relation_eight` got mechanical.lean, which opens `import Address` and cannot
 *  be checked without address.lean and fnv.lean. For a deposit whose whole claim is that a stranger can
 *  recompute it rather than trust it, a record carrying an unbuildable proof is the claim failing at the
 *  one place it is tested. speed.lean is the deepest: four files behind it. */
export const closureOf = (file: string, seen = new Set<string>()): string[] => {
  for (const m of leanSource(file).matchAll(/^import (\w+)/gm)) {
    const dep = m[1].toLowerCase() + '.lean'
    if (!seen.has(dep)) { seen.add(dep); closureOf(dep, seen) }
  }
  return [...seen].sort()
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

