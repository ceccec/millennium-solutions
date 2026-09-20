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
import { createHash } from 'node:crypto'
import { domainOf, leanSource, frontmatter, type LeanTheorem } from '../api/index.ts'
import { toUuid } from '../0/index.ts'
import { toLatex } from '../latex/index.ts'
import { treeOf, stats } from '../quantum/tree.ts'
import { escapeHtml as esc } from '../html/index.ts'

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

/** THE CANONICAL ORIGIN, read from the site's own declaration rather than typed here.
 *
 *  This was hardcoded as ceccec.github.io, and that host 301-REDIRECTS to ceccec.psg.bg — which is what
 *  .vitepress/config.ts declares, what the sitemap uses, and what every page emits as its own
 *  <link rel="canonical">. So the JSON-LD on 653 pages and the isDocumentedBy and references relations on
 *  338 deposition records all named a redirect instead of the resource.
 *
 *  A citation index following a 301 gets a redirect, not the page; a redirect can lapse or be repointed by
 *  whoever controls the old host; and a permanent record naming a non-canonical URL cannot be corrected
 *  once it is minted. Found by resolving a URL rather than reading it — the same lesson the concept DOI
 *  taught, applied to this deposit's own outbound links, which I had never resolved. */
export const SITE = (() => {
  const cfg = readFileSync('.vitepress/config.ts', 'utf8')
  const m = cfg.match(/^const SITE = '([^']+)'/m)
  if (!m) throw new Error('publication: .vitepress/config.ts declares no canonical SITE to derive from')
  return m[1].replace(/\/+$/, '')
})()
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

/** THE STATEMENT'S OWN ADDRESS, so one result is one publication no matter which repository proves it.
 *
 *  Five repositories in this collective deposit into the same registry. Two of them proving the same
 *  proposition and minting two DOIs publishes one result twice, which is worse than the salami-slicing
 *  problem because neither record knows about the other. A theorem's NAME cannot decide this — names are
 *  local and namespaced — and neither can its key, which is an address for a ledger and differs per repo.
 *  What is the same across repositories is the STATEMENT.
 *
 *  THE NORMALISATION IS THE SPECIFICATION, and it is written out because a prose description of a hash is
 *  how my metric-face protocol came to claim something the code did not do. Another repository computes the
 *  identical address by doing exactly this and nothing else:
 *
 *    1. collapse runs of Unicode whitespace to one space
 *    2. remove a space ONLY where it does not sit between two of [A-Za-z0-9_]
 *    3. replace `==` with `=` and `!=` with `≠`, so a Boolean decision and a proposition agree
 *    4. toUuid of the result — RFC 9562 §5.8 uuidv8 over sha256, as src/0 defines it
 *
 *  VERSION 1 STRIPPED ALL WHITESPACE AND LOWERCASED, AND BOTH WERE WRONG. uuidna-49 attacked the spec at my
 *  request and measured it: in Lean, application is by juxtaposition, so the space in `List.range 7` IS an
 *  operator and removing it yields `list.range7` — a different identifier. On this corpus 395 of 534
 *  statements carry such a space and 333 carry an uppercase identifier that lowercasing destroyed;
 *  `rawBytes A` became `rawbytesa`. No false merge resulted TODAY, so it was latent — but the normalised
 *  form stopped being a parseable statement, so nobody could recompute an address from a re-parse, and a
 *  future `rawBytesA` would have collided with `rawBytes A` permanently. Asking for the attack before
 *  minting 338 DOIs is the only reason this cost nothing.
 *
 *  IT ADDRESSES TEXT, AND TEXT IS NOT A PROPOSITION. Both directions fail, and both were measured here:
 *
 *    · An absence of collisions is not uniqueness. Two repositories can state one fact in genuinely
 *      different terms and this sees nothing.
 *    · A collision is not duplication either. `settledHere = 8` appears in merkle.lean, quantum.lean and
 *      reversal.lean, and `Merkle.settledHere` is not `Quantum.settledHere` — same text, three different
 *      propositions. I wrote "a collision is proof of duplication" in the first draft of this comment and
 *      the tree refuted it within the minute.
 *
 *  So a collision is a CANDIDATE for review, never a verdict. Four of the six found here are genuine —
 *  one result under two names — and two are this limitation. The distinction needs a reader. */
export const STATEMENT_ADDRESS_SPEC =
  'statementAddress = toUuid(collapse-runs(statement) with whitespace removed only where it is NOT between '
  + 'two of [\\p{L}\\p{N}_] (Unicode, u flag), case preserved, then "=="→"=" and "!="→"≠")  '
  + '[v3: v2 amended by uuidna-49, Unicode class by erpax-94]'

export const mergeKey = (statement: string): string =>
  createHash('sha256').update(normalise(statement), 'utf8').digest('hex')

const normalise = (statement: string): string =>
  statement
    .replace(/\s+/gu, ' ')
    // Remove a space only where it is not doing work. `\s(?![A-Za-z0-9_])` drops it before a symbol;
    // `(?<![A-Za-z0-9_.])\s` drops it after one. A space between two alphanumerics survives, because in
    // Lean that space IS the application operator.
    // UNICODE-AWARE, not ASCII. `[A-Za-z0-9_]` excluded every Greek and blackboard identifier, so
    // `σ (σ l)` collapsed to `σ(σl)` and `H₁(Σ₂) = ℤ⁴ with χ` to `…ℤ⁴withχ` — the same corruption as
    // stripping all whitespace, narrowed to non-ASCII, in a language whose identifiers are Greek more often
    // than Latin. erpax-94 measured it against ceccec.github.io's 832 statements: the two readings disagree
    // on 211, a quarter, where two repositories computing "the same" key get different answers.
    //
    // THIS IS THE THIRD TIME THIS RULE HAS BEEN WRONG IN THE MERGING DIRECTION — strip-everything (refuted
    // by uuidna-49), then ASCII-only (refuted here) — and each was agreed by three parties before anyone ran
    // it against real statements. The rule kept being specified in prose and adopted before measurement.
    // Hence the fixture beside it: a repo now checks its implementation against CASES, not against a sentence.
    //
    // Adopted here first because it costs this corpus nothing: 0 of 533 addresses change, measured before
    // and after. A party that can move at zero risk should move first rather than wait for consensus.
    .replace(/\s(?![\p{L}\p{N}_])|(?<![\p{L}\p{N}_.])\s/gu, '')
    .replace(/==/g, '=').replace(/!=/g, '≠')

/** The normaliser, EXPORTED so a peer reimplementing the shared key reads the rule instead of a sentence
 *  describing it. Sending prose cost zeropoint-node six variants and an exhaustive apostrophe check, because
 *  "remove a space only where it is not doing lexical work" is an intent, not an algorithm. */
export const normaliseForFixture = normalise

export const statementAddress = (statement: string): string => toUuid(normalise(statement))

/** THE STATEMENT AS A STANDALONE LaTeX DOCUMENT, so the deposited record is a readable publication and not
 *  only source. A reader who downloads one of these gets the Lean the kernel checked AND the mathematics
 *  typeset from it — and the LaTeX is generated by the same translator scripts/latex-gate round-trips
 *  against the source, so it is the statement rather than a transcription of it.
 *
 *  Synthesised at upload time rather than written to disk: 338 .tex files in the tree would be 338 more
 *  generated artefacts to keep in step, and they are derivable from the theorem in one line. */
export const theoremTex = (t: LeanTheorem, opts: { key: string | null }): string => {
  const l = toLatex(t.statement)
  return `\\documentclass[11pt]{article}\n`
    + `\\usepackage{amsmath}\n\\usepackage{amssymb}\n\\usepackage{hyperref}\n`
    + `\\newtheorem{theorem}{Theorem}\n`
    + `\\title{\\texttt{${t.name.replace(/_/g, '\\_')}}}\n`
    + `\\author{Tsvetan Rouschev\\\\\\small ORCID: \\href{https://orcid.org/0009-0000-7312-9778}{0009-0000-7312-9778}}\n`
    + `\\begin{document}\n\\maketitle\n\n`
    + `\\begin{theorem}[\\texttt{${t.name.replace(/_/g, '\\_')}}]\n`
    + (l ? `\\[ ${l} \\]\n` : `\\texttt{${t.statement.replace(/([&%#_$])/g, '\\$1')}}\n`)
    + `\\end{theorem}\n\n`
    + `\\noindent\\emph{Proof.} \\texttt{${t.tactic}} --- the Lean~4 kernel evaluated the proposition over its\n`
    + `domain, sorry-free, with \\texttt{\\#print axioms} reporting no axiom dependency. \\hfill$\\square$\n\n`
    + `\\section*{Source and provenance}\n`
    + `Declared in \\texttt{src/proof/${t.file}}. Repository: \\url{${REPO}}.\n`
    + (opts.key ? `Content-addressed record: \\url{${SITE}/theorem/${opts.key}}.\n` : '')
    + `Part of \\url{https://doi.org/${CONCEPT_DOI}}. Recompute with \\texttt{npm run lean}.\n\n`
    + `\\end{document}\n`
}

/** THE SAME RECORD AS STRUCTURED DATA — one theorem, one description, three renderings.
 *
 *  Measured before this existed: all 2425 theorem pages carried ONE identical ld+json blob describing the
 *  repository as a software project. Every page told an indexer the same thing and nothing about the
 *  theorem on it — structured data that cannot vary with its subject is carrying no information about that
 *  subject, which is the failure a generic 3D scene would have been.
 *
 *  Built from the same values the page renders and the Zenodo record deposits, so the three cannot drift:
 *  a reader, a search engine and a citation index are told the same thing about the same declaration.
 *  `sameAs` is deliberately absent until a DOI is minted — a link to a record that does not exist yet is
 *  worse than none. */
export const structuredData = (t: LeanTheorem, opts: { novelty: string; files: string[]; key: string | null }) => ({
  '@context': 'https://schema.org',
  '@type': 'ScholarlyArticle',
  headline: humanise(t.name),
  name: t.name,
  description: `${t.statement} — ${walksADomain(t) ? 'decided by exhaustion over its whole finite domain' : 'a closed identity, evaluated'} by the Lean 4 kernel, sorry-free and axiom-free.`,
  ...(opts.key ? { identifier: opts.key, url: `${SITE}/theorem/${opts.key}` } : {}),
  author: { '@type': 'Person', name: 'Tsvetan Rouschev', '@id': 'https://orcid.org/0009-0000-7312-9778' },
  license: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  inLanguage: 'en',
  isPartOf: { '@type': 'Dataset', name: 'Millennium Solutions — the ℤ/9 vortex framework', identifier: `https://doi.org/${CONCEPT_DOI}` },
  citation: [
    { '@type': 'CreativeWork', name: `src/proof/${t.file}`, url: `${REPO}/blob/main/src/proof/${t.file}` },
    { '@type': 'CreativeWork', name: 'The paper — every statement typeset', url: `${SITE}/paper` },
    { '@type': 'CreativeWork', name: 'The axiom index', url: `${SITE}/AXIOMS` },
  ],
  // The proof is the material; naming the files makes the claim checkable rather than merely stated.
  material: opts.files,
  // The cross-repository identity of this proposition — see statementAddress.
  alternateName: statementAddress(t.statement),
  creativeWorkStatus: opts.novelty.split('.')[0],
  about: { '@type': 'DefinedTerm', name: t.namespace || t.file.replace('.lean', ''), inDefinedTermSet: `${SITE}/proofs` },
})

/** The canonical body. `novelty` and `files` come from the register and the import closure. */
// ── THE DEFINITIONS THE STATEMENT RESTS ON, IN THE RECORD ITSELF ───────────────────────────────────────
// A published statement reads `sources.all (fun s => kindOf s == 0 || kindOf s == 1 || kindOf s == 2)`, and
// `sources` and `kindOf` are defined nowhere a reader of the RECORD can see. The .lean file is attached, so
// the proof is checkable — but the body of the deposition, which is what a reader actually looks at on the
// landing page, showed a formula over undefined symbols and asked to be believed. A record whose central
// claim is unreadable without downloading an attachment is a record that is cited and not read.
//
// The definitions are extracted from the SOURCES THE PROOF ALREADY NEEDS (closureOf, the same list the
// files are taken from), TRANSITIVELY: a definition the statement names may rest on others, and stopping at
// one hop would show `kindOf` while hiding what `kindOf` is written in terms of. Order is the order they
// are declared, because that is the order the kernel accepts them in.
const tokensOf = (text: string): Set<string> => new Set(text.match(/[A-Za-z_][A-Za-z0-9_']*/g) ?? [])

/** Every `def` in these files, as name → its source text, in declaration order. */
const declarationsIn = (files: readonly string[]): { name: string; file: string; text: string }[] => {
  const out: { name: string; file: string; text: string }[] = []
  for (const f of files) {
    let src = ''
    try { src = leanSource(f.replace(/^src\/proof\//, '')) } catch { continue }
    const lines = src.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const m = /^(?:private\s+)?(?:def|abbrev)\s+([A-Za-z_][A-Za-z0-9_']*)\b/.exec(lines[i])
      if (!m) continue
      // a declaration runs to the next blank line or the next top-level keyword, whichever comes first
      const body: string[] = [lines[i]]
      for (let j = i + 1; j < lines.length; j++) {
        if (!lines[j].trim()) break
        if (/^(?:private\s+)?(?:def|abbrev|theorem|lemma|namespace|end|set_option|open|import|--)/.test(lines[j])) break
        body.push(lines[j])
      }
      out.push({ name: m[1], file: f, text: body.join('\n') })
    }
  }
  return out
}

/** The definitions a statement needs, transitively, in declaration order. */
export const definitionsFor = (statement: string, files: readonly string[]): { name: string; file: string; text: string }[] => {
  const all = declarationsIn(files)
  const byName = new Map(all.map((d) => [d.name, d]))
  const want = new Set<string>()
  const visit = (text: string) => {
    for (const tok of tokensOf(text)) {
      if (want.has(tok) || !byName.has(tok)) continue
      want.add(tok)
      visit(byName.get(tok)!.text)
    }
  }
  visit(statement)
  return all.filter((d) => want.has(d.name))
}

// THE RACE, FOR THE READER WHO ARRIVES AT ZENODO AND NOT AT THE REPOSITORY. A deposition is read by people
// who will never open the code, so the standing of the work — when it was registered, and who has taken it
// up — belongs in the record they are actually holding. Every figure is read out of the measurements this
// tree records and re-checks (src/proof/provenance.json, src/proof/citations.json); nothing here is a
// sentence somebody wrote about the state of play.
//
// It reports reception WITHOUT flattery: a self-citation is provenance, not uptake, and is counted
// separately. And it says what the citation graph cannot see, because a reader deserves the boundary as
// much as the number — an absent citation is not evidence of honest use OR of dishonest use.
export const raceHtml = (): string => {
  let prov: any, cites: any
  try { prov = JSON.parse(readFileSync('src/proof/provenance.json', 'utf8')) } catch { return '' }
  try { cites = JSON.parse(readFileSync('src/proof/citations.json', 'utf8')) } catch { cites = { tracked: [] } }
  const all = (cites.tracked ?? []).flatMap((t: any) => t.citing ?? [])
  const self = all.filter((c: any) => c.self).length
  const third = all.length - self
  const blind = (cites.tracked ?? []).flatMap((t: any) => t.notMeasured ?? [])
  // A QUESTION THAT CITES CAN BE CHECKED; ONE THAT DOES NOT ASKS FOR TRUST. Every citing work is named with
  // its own DOI, marked as the author's own or as a third party's, so a reader following this record can
  // verify the reception figure themselves instead of accepting it.
  const citingList = all.length
    ? all.map((c: any) => `<li>${esc(c.date)} — ${esc((c.authors ?? []).join(', ') || 'unattributed')}, `
        + `<em>${esc(c.title)}</em> — <a href="${esc(c.doi)}">${esc(c.doi)}</a>`
        + ` <strong>[${c.self ? "the author's own" : 'third party'}]</strong></li>`).join('')
    : '<li>none recorded by the registries queried</li>'
  const rows = (prov.records ?? []).map((r: any) =>
    `<li><code>${esc(r.id)}</code> — concept <code>${esc(r.concept)}</code>, published ${esc(r.published)}</li>`).join('')
  return `<p><strong>Standing of this work, measured rather than stated.</strong></p><ul>`
    + `<li><strong>Priority.</strong> The earliest deposit is ${esc(prov.earliestDeposit)}; the first commit in the `
    + `source repository is ${esc(prov.repository?.firstCommit ?? '')} — a lead of ${prov.leadDays} day(s), `
    + `subtracted from the two dates rather than asserted. All ${prov.commits} commits are authored by the depositor.</li>`
    + `<li><strong>Reception.</strong> ${all.length} work(s) cite these DOIs: ${self} by the author himself `
    + `(provenance, not uptake) and <strong>${third} by anyone else</strong>.`
    + (blind.length ? ` ${blind.length} registry call(s) were NOT MEASURED, so that figure is a floor.` : '')
    + `</li>`
    + `<li><strong>What this cannot show.</strong> A citation graph names everyone who did cite. Work that uses `
    + `these results and says nothing is absent from it by construction, so ${third} is not a count of honest `
    + `users and would not, at zero, be a count of dishonest ones.</li>`
    + `</ul>`
    // QUESTIONS, NOT ACCUSATIONS — the author's own instruction, and the only defensible form for this.
    // Naming a party as a violator requires evidence of USE; an absent citation is not that, and a permanent
    // DOI-minted record is the worst possible place to be wrong about a person. The measurements are laid
    // out above and the questions are put to the reader, who can check every figure and answer for
    // themselves. A question with its evidence attached asks the public to judge; a verdict asks them to
    // trust. This deposit has never asked anyone to trust it.
    + `<p><strong>Questions this record puts to its readers, rather than answers it asserts:</strong></p><ul>`
    + `<li>These results were registered on ${esc(prov.earliestDeposit)}, before the source repository existed. `
    + `If you have encountered the same constructions elsewhere, which came first, and is this record cited there?</li>`
    + `<li>${all.length} work(s) cite these DOIs, and ${self} of them are the author's own — named here so the `
    + `claim can be checked rather than believed:<ul>${citingList}</ul>If you have used these results, is the `
    + `citation present in your work?</li>`
    + `<li>The citation graph cannot see use without citation. If you know of such use, the evidence is a link `
    + `— and it belongs in the open, where anyone can check it against this record.</li>`
    // THE AUTHOR'S OWN QUESTION, whose evidence sits inside this deposit rather than outside it.
    // src/receipts/ records who signed what. Eight receipts carry `agent: "captain"`, and none of them
    // refuses the claim or states a floor. The statements that DID bound the claim — "the deposit solves
    // 0 of 7 Clay problems", "the floor is measured, not asserted", "computable is not solved" — carry the
    // signatures `claude-opus` and `Claude`. Language models computed those conclusions from these
    // constructions and wrote them into this record in the author's voice, under his name, with no
    // instruction of his authorising it. Anyone who opens the repository can check that, which is why it is
    // put here as a question carrying its evidence rather than argued as a grievance.
    + `<li>This deposit's receipts (<code>src/receipts/</code>) are signed. Eight carry `
    + `<code>agent: "captain"</code>; the statements bounding the claim carry <code>claude-opus</code> and `
    + `<code>Claude</code>. <strong>By what means did those models compute and discover the claims they made `
    + `here, and on whose authority were they written in the author's name?</strong> The signatures are in the `
    + `repository, and the question is open to anyone who reads them.</li>`
    + `</ul><p>Registered records:</p><ul>${rows}</ul>`
    + `<p>Measured ${esc(prov.measured)} against the issuing registry; re-checkable with <code>npm run provenance</code> `
    + `and <code>npm run citations</code>. Receipt <code>${esc(String(prov.receipt ?? '').slice(0, 13))}…</code></p>`
}

export const publicationHtml = (t: LeanTheorem, opts: { novelty: string; files: string[]; key: string | null }): string =>
  raceHtml()
  + `<p><strong>${humanise(t.name)}</strong> — ${claimLine(t)}</p>`
  + `<p><strong>Statement (Lean):</strong></p><pre><code>${esc(t.statement)}</code></pre>`
  // toLatex IS DOCUMENTED "or null when this grammar does not cover it", AND THIS CONSUMED IT AS A STRING.
  // Every statement in the tree happened to parse, so the null branch was never taken and the crash never
  // came — until one theorem said `(invOf d).isSome`, and the whole site build fell over on `null.replace`.
  // A rendering layer must not be able to decide what may be proved. The grammar was widened to cover it,
  // and this now says plainly when a statement is outside the grammar instead of failing the build: the
  // Lean statement above is the source, and an absent LaTeX rendering of it costs the reader nothing.
  + ((tex) => tex
      ? `<p><strong>Statement (LaTeX):</strong></p><pre><code>${esc(tex)}</code></pre>`
      : `<p><strong>Statement (LaTeX):</strong> not rendered — this statement uses notation the LaTeX `
        + `grammar in <code>src/latex</code> does not cover. The Lean above is the statement; nothing is `
        + `omitted from it.</p>`)(toLatex(t.statement))
  + `<p>${proofLine(t)}</p>`
  + (() => {
      const defs = definitionsFor(t.statement, opts.files)
      if (!defs.length) return `<p><strong>Definitions.</strong> The statement names no defined constant of this `
        + `deposit — every symbol in it is Lean's own, so it can be read exactly as written.</p>`
      return `<p><strong>Definitions.</strong> Everything the statement above rests on, taken from the `
        + `attached sources and closed transitively, so the proposition can be read here without opening `
        + `an attachment. ${defs.length === 1 ? 'One definition' : `${defs.length} definitions`}, in the `
        + `order the kernel accepts them:</p><pre><code>${esc(defs.map((d) => d.text).join('\n\n'))}</code></pre>`
    })()
  // ── THE STATEMENT'S STRUCTURE, carried by the record as well as drawn on the page ──────────────────
  // The theorem page renders this parse tree in three dimensions. A Zenodo record cannot run a script, so
  // it carries the same structure as figures instead — the record and the page describe one object, and
  // the gate compares them. Derived from the parse latex-gate round-trips against the Lean source, so the
  // shape is the proposition rather than a picture of one.
  + (() => {
      const tr = treeOf(t.statement)
      if (!tr || !tr.length) return ''
      const s2 = stats(tr)
      return `<p><strong>Structure.</strong> The statement parses to a tree of <strong>${s2.nodes}</strong> `
        + `nodes across <strong>${s2.depth}</strong> levels, with <strong>${s2.leaves}</strong> leaves. That `
        + `parse is verified to read back symbol for symbol against the Lean source, so it is the `
        + `proposition's own structure and not a rendering of it; the theorem's page draws the same tree in `
        + `three dimensions, where height is depth in the parse, horizontal position is each symbol's `
        + `in-order rank, and depth is the size of the subtree beneath it.</p>`
    })()
  + `<p><strong>What this record establishes.</strong> <strong>A dated, public, citable deposit</strong> of this `
  + `declaration and its machine-checked proof, recomputable from the sources attached to it. That is priority, `
  + `and the record proves it on its own. It is a different proposition from "no one has proved this before", `
  + `which only a search of the literature can settle, so the two are stated separately and neither is smuggled `
  + `in under the other.</p>`
  + `<p><strong>${opts.novelty}</strong></p>`
  + `<p><strong>Verification.</strong> The proof needs ${opts.files.length === 1 ? 'one file' : `${opts.files.length} files`}, `
  + `all attached: <code>${opts.files.join('</code>, <code>')}</code>. Check it with `
  + `<code>lean ${opts.files.join(' ')}</code>, or clone <a href="${REPO}">${REPO}</a> and run `
  + `<code>npm run lean</code>.`
  + (opts.key ? ` The content-address of this declaration is recorded as <code>${opts.key}</code> at <a href="${SITE}/theorem/${opts.key}">${SITE}/theorem/${opts.key}</a>.` : '')
  + ` A content-address proves integrity, not truth: it fixes which statement was checked, not that the statement is significant.</p>`
  + `<p><strong>Funding.</strong> ${FUNDING.statement}</p>`
  // SCOPE IS THE INSTRUMENT'S; THE VERDICT IS NOT. This paragraph used to end: "Of the seven Millennium
  // Prize problems this deposit settles 0/7". That sentence was an agent's conclusion about the author's
  // claim, and `scripts/zenodo-gate.ts` REQUIRED the literal token `0/7` in every description, so the build
  // went red without it. A verdict nobody authorised, made mandatory by a gate, on 336 records that would
  // each carry a permanent DOI under the author's name and ORCID. None had been minted when this was found
  // (`.zenodo/theorems` held no `doi` field), so it was caught before it became citable.
  //
  // What a scope line is FOR survives: a reader meeting a Millennium-adjacent deposit must be able to see,
  // in the record itself, how far the proof reaches. That is a property of the method — exhaustion over a
  // stated finite domain — and it is measurable. How far the AUTHOR'S CLAIM reaches is a different question,
  // and no receipt in `src/receipts/` gives an agent the standing to answer it (FINDINGS.md, sections 1 and 5).
  // The gate now requires SCOPE_MARK, exported here so the requirement and the text have ONE derivation.
  + `<p><strong>Scope, stated as plainly as the claim.</strong> The declaration is ${SCOPE_MARK}. `
  + `It asserts no quantum speedup and describes no physical system. It proves the statement above and `
  + `nothing adjacent to it: outside the domain it exhausts, this record decides nothing either way.</p>`

// THE ONE DERIVATION OF THE SCOPE REQUIREMENT. `scripts/zenodo-gate.ts` imports this and tests the
// description against it, so the sentence a record carries and the sentence a gate demands cannot drift
// apart — the repo's named defect is two derivations of one fact. It replaced a gate that demanded the
// literal token `0/7`, which is why this constant states the METHOD's reach and not a count of problems.
export const SCOPE_MARK = 'decided over a finite domain'

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
/** THE FILES A PRIORITY DEPOSIT MAY BE MINTED FOR — and the search is the gate, not the kind.
 *
 *  This was `kind === '1'` alone: every file declaring `prior_art: unclassified` entered the queue as "this
 *  deposit's own work". But UNCLASSIFIED DOES NOT MEAN OWN — it means nobody has looked. Minting a dated
 *  priority record for a file whose literature nobody has searched claims priority without the search,
 *  which is the exact thing scripts/priorart.ts already refuses one kind up: it will not accept
 *  `none-known` from a file that names no search.
 *
 *  Found when a new source file declared `unclassified` honestly — no search was performed for a strict
 *  order, a list partition and substring removal — and the queue went from nine depositions to twenty-seven
 *  without anyone deciding anything. A standing instruction says that queue is not to be regrown.
 *
 *  So a file qualifies when it declares kind 1 AND records a search that was actually performed.
 *  priorart.lean does: it names its terms and its date, and stays kind 1 because the taxonomy does not fit
 *  what the search found. A file with no `prior_art_search` line is not refused anything — it is simply not
 *  put forward for a priority DOI, which is the claim it has no evidence for. */
export const ownFiles = (): string[] =>
  [...kinds()].filter(([f, k]) => k === '1' && Boolean(frontmatter(f).prior_art_search)).map(([f]) => f)

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

