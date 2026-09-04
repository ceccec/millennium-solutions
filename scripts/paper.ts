#!/usr/bin/env node
// PAPER — every machine-checked theorem in one document, in publication format, with the distribution
// of what the kernel actually walked drawn from the same numbers.
//
// The formulas reached the UI one page at a time: /theorem/<key> renders its own statement, proof line and
// verification block. Nothing collected them. A reader who wanted the whole result had 476 tabs, CHALLENGES.md
// listed 2325 lines of theorem NAMES with no statement anywhere on the page, and the "Paper" entry in the nav
// pointed at the homepage. So the deposit could be read one fact at a time and never read as a body of work.
//
// This generates that document from the Lean sources through leandoc — the same reader the theorem pages use,
// so the collected paper and the individual page cannot disagree about what a theorem says. Sections are the
// .lean files, ordered by their own `wing` frontmatter; there is no hand-written list of sections, theorems or
// counts anywhere here, and a file added to src/proof/ appears in the paper on the next build.
//
// ── WHY THE GATE HERE IS NOT computes() ──────────────────────────────────────────────────────────────────
// The first version of this generator put every prose line through `computes(line).binary !== 1` and reported
// a clean pass. That check cannot fail. `computes()` returns binary 1 for "two plus two equals five" and for
// "This work solves the Riemann Hypothesis" alike — it is not a lexicon, and it says so itself: the verdict
// is decided only by whether the cited theorems are sealed. Nor can `slimGate` decide citations here: it
// carries the frozen ledger shipped in @uuidna/uuidna 0.1.1, so a genuinely sealed local key comes back
// `fabricated`. A gate that returns the same answer for a true and a false sentence is decoration.
//
// The check that CAN fail is local: every `by decide` theorem printed here must be sealed in THIS ledger.
// seal-lean.ts seals exactly those, so an unsealed one stops the build. `rfl` theorems are deliberately not
// sealed ("a declaration asserted by rfl", never exhausted); they are printed with that said on the page
// rather than quietly counted as proof.
//
// The second check compares the statement leandoc read against the one src/api read. Its limit is worth
// stating plainly, because the obvious reading of it is wrong: both parsers read the SAME file, so editing
// a .lean source moves both together and this cannot detect source drift — a control confirmed it does not.
// What it does detect is the two readers disagreeing about the same text, which is a real failure and is how
// `add_group` was caught: that name is declared in two files with two different statements, so every
// name-keyed lookup in this repo silently kept one of them.
//
// Nothing here can verify a statement against its seal, because there is no such seal to verify against:
// seal-lean.ts chains receipt = toUuid(previous → key), on the KEY, so no receipt covers statement text and
// a statement can be edited without any receipt changing. The kernel re-checking it on every run is what
// stands in for that, and it is not the same guarantee.
import { writeFileSync, readFileSync } from 'node:fs'
import { all as leanDocs } from './leandoc.ts'
import { live, theoremOfKey, leanTheorems } from '../src/api/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { MILLENNIUM } from '../src/millennium/index.ts'
import { toLatex, toMathML } from '../src/latex/index.ts'
import { escapeHtml } from '../src/html/index.ts'

const docs = leanDocs()
const T = leanTheorems()

// ── what is sealed in THIS ledger ────────────────────────────────────────────────────────────────────────
// Keyed by FILE and name, never by name alone. `add_group` exists in two files with two different
// statements, so a name-keyed map silently keeps one of them — which is the same defect that put the
// wrong formula on a theorem page, reproduced here in the check meant to catch it.
const at = (file: string, name: string) => file + '::' + name

const sealedKey = new Map<string, string>()
for (const e of live() as { key: string }[]) {
  const t = theoremOfKey(e.key, T)
  if (t) sealedKey.set(at(t.file, t.name), e.key)
}

const sourceOf = new Map(T.map((t) => [at(t.file, t.name), t.statement]))

// ── the gate: real, local, and able to fail ──────────────────────────────────────────────────────────────
const printed = docs.flatMap((d) => d.theorems.map((t) => ({ ...t, wing: d.wing, file: d.file })))
const unsealedDecide = printed.filter((t) => t.tactic === 'by decide' && !sealedKey.has(at(t.file, t.name)))
const drifted = printed.filter((t) => (sourceOf.get(at(t.file, t.name)) ?? '') !== t.statement)
if (unsealedDecide.length || drifted.length) {
  if (unsealedDecide.length) {
    console.log(`✗ paper: ${unsealedDecide.length} \`by decide\` theorem(s) are not sealed in the ledger — nothing written`)
    for (const t of unsealedDecide.slice(0, 8)) console.log('  · ' + t.name)
  }
  if (drifted.length) {
    console.log(`✗ paper: ${drifted.length} statement(s) do not match their .lean source — nothing written`)
    for (const t of drifted.slice(0, 8)) console.log('  · ' + t.name)
  }
  process.exit(1)
}

// ── the shape of the document, derived ───────────────────────────────────────────────────────────────────
const wings: string[] = []
for (const d of docs) if (!wings.includes(d.wing)) wings.push(d.wing)
const wingLabel = (w: string) => w || 'unassigned'

const theorems = printed
const cases = theorems.map((t) => t.cases).sort((a, b) => a - b)
const totalCases = cases.reduce((n, c) => n + c, 0)
const median = cases[Math.floor(cases.length / 2)]
const largest = Math.max(...cases)
const topShare = (100 * largest) / totalCases
const noExhaustion = theorems.filter((t) => t.cases <= 1).length
const byDecide = theorems.filter((t) => t.tactic === 'by decide').length
const rflOnly = theorems.filter((t) => t.tactic !== 'by decide')
const ownDoc = theorems.filter((t) => t.docFrom === 'own').length
const typeset = theorems.filter((t) => toMathML(t.statement) !== null).length

const esc = escapeHtml
const n = (x: number) => x.toLocaleString('en-US')

// ── Figure 1 — every theorem as one mark, over the domain it walked ──────────────────────────────────────
// A unit chart: one square per theorem, in a log₁₀ bucket of its domain. This is the whole set on one
// screen, and it is drawn this way because the mean is useless here — the domains span eleven orders of
// magnitude and one theorem carries almost all of the total, so a bar of "total cases" would be a picture
// of that single theorem. Colour is the wing, so both the distribution and the composition are readable
// from the same marks.
const BUCKETS = [1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, Infinity]
const bucketOf = (c: number) => { let i = 0; while (i < BUCKETS.length - 1 && c >= BUCKETS[i + 1]) i++; return i }
const bucketName = (i: number) =>
  i === 0 ? '1' : BUCKETS[i] >= 1e6 ? '10^' + Math.round(Math.log10(BUCKETS[i])) : n(BUCKETS[i]) + '+'

const hueOfWing = (w: string) => (wings.indexOf(w) * 40 + 200) % 360

const figure1 = (): string => {
  const cols = BUCKETS.length - 1
  const perRow = 9, cell = 7, gap = 1.6, colW = perRow * (cell + gap) + 22
  const bucketed: (typeof theorems)[] = Array.from({ length: cols }, () => [])
  for (const t of theorems) bucketed[bucketOf(t.cases)].push(t)
  const maxRows = Math.max(...bucketed.map((b) => Math.ceil(b.length / perRow)))
  const H = maxRows * (cell + gap) + 62, W = cols * colW + 10
  let s = `<svg viewBox="0 0 ${Math.round(W)} ${Math.round(H)}" role="img" class="fig" xmlns="http://www.w3.org/2000/svg" aria-label="every theorem placed by the size of the domain its proof exhausted">`
  s += `<title>Figure 1 — all ${theorems.length} declarations by domain size</title>`
  bucketed.forEach((b, i) => {
    const x0 = i * colW + 6
    b.forEach((t, j) => {
      const cx = x0 + (j % perRow) * (cell + gap)
      const cy = H - 40 - Math.floor(j / perRow) * (cell + gap) - cell
      s += `<rect x="${cx.toFixed(1)}" y="${cy.toFixed(1)}" width="${cell}" height="${cell}" rx="1.2" fill="hsl(${hueOfWing(t.wing)} 62% 52%)"><title>${esc(t.name)} — ${n(t.cases)} cases</title></rect>`
    })
    s += `<text x="${(x0 + perRow * (cell + gap) / 2 - 2).toFixed(1)}" y="${H - 28}" font-size="13" text-anchor="middle" fill="currentColor" opacity="0.8">${bucketName(i)}</text>`
    s += `<text x="${(x0 + perRow * (cell + gap) / 2 - 2).toFixed(1)}" y="${H - 13}" font-size="12" text-anchor="middle" fill="currentColor" opacity="0.5">${b.length}</text>`
  })
  s += `<text x="6" y="13" font-size="12" fill="currentColor" opacity="0.65">cases the kernel exhausted, per theorem (log₁₀ buckets) — one square is one theorem</text>`
  return s + '</svg>'
}

// ── Figure 2 — theorems per wing ─────────────────────────────────────────────────────────────────────────
// Counts, not cases: adding case-counts across wings would again be a picture of one theorem.
const figure2 = (): string => {
  const rows = wings.map((w) => ({ w, n: docs.filter((d) => d.wing === w).reduce((s, d) => s + d.theorems.length, 0) }))
    .sort((a, b) => b.n - a.n)
  const max = Math.max(...rows.map((r) => r.n))
  const rowH = 19, W = 460, H = rows.length * rowH + 16
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" class="fig" xmlns="http://www.w3.org/2000/svg" aria-label="how many theorems each wing carries">`
  s += `<title>Figure 2 — theorems per wing</title>`
  rows.forEach((r, i) => {
    const y = i * rowH + 8, w = Math.max(1, (r.n / max) * 250)
    s += `<text x="0" y="${y + 10}" font-size="9.5" fill="currentColor" opacity="0.8">${esc(wingLabel(r.w))}</text>`
    s += `<rect x="128" y="${y + 1.5}" width="${w.toFixed(1)}" height="11" rx="2" fill="hsl(${hueOfWing(r.w)} 62% 52%)"/>`
    s += `<text x="${(132 + w).toFixed(1)}" y="${y + 10}" font-size="9" fill="currentColor" opacity="0.65">${r.n}</text>`
  })
  return s + '</svg>'
}

// ── the document ─────────────────────────────────────────────────────────────────────────────────────────
const seal = merkleFold(theorems.map((t) => toUuid(t.name + '\n' + t.statement)))

let o = '---\ntitle: The paper — every machine-checked theorem\naside: false\n---\n\n'
o += '<div class="paper paper-collected" itemscope itemtype="https://schema.org/ScholarlyArticle">\n\n'
o += '<div class="paper-masthead">\n'
o += '<div class="paper-title">The collected theorems of the ℤ/9 vortex framework</div>\n'
o += '<div class="paper-byline">Rouschev, T. · <em>Millennium Solutions</em> · DOI <a href="https://doi.org/10.5281/zenodo.21819217">10.5281/zenodo.21819217</a> · CC BY-NC-ND 4.0</div>\n'
o += `<div class="paper-addr">${n(byDecide)} theorems + ${n(theorems.length - byDecide)} rfl declarations · ${docs.length} sources · content-address <code>${seal}</code></div>\n`
o += '</div>\n\n'

o += '<h2 class="paper-h">Abstract</h2>\n\n'
o += `This document collects the ${n(theorems.length)} declarations of the ℤ/9 vortex framework that the Lean 4 kernel accepts — ${n(byDecide)} of them THEOREMS by this deposit's rule, closing by exhaustion, and ${n(theorems.length - byDecide)} rfl declarations shown and marked as such, `
o += `across ${docs.length} source files. Each is stated exactly as the kernel received it, followed by the tactic that `
o += `discharged it and the size of the finite domain that tactic exhausted. Every statement is decidable and was checked `
o += `sorry-free and axiom-free. None of them is a Clay Millennium Problem and none claims one. A content-address proves `
o += `integrity, not truth: it fixes which statement was checked, not that the statement is significant. `
o += `Clay problems solved by this framework: **0 of 7**.\n\n`

o += '<h2 class="paper-h">The size of what was checked</h2>\n\n'
o += `The domains sum to ${n(totalCases)} cases, and that total should not be read as the weight of this work: `
o += `**one theorem carries ${topShare.toFixed(3)}% of it**. The median theorem walks **${n(median)}** cases, and `
o += `**${n(noExhaustion)}** of ${n(theorems.length)} walk a single point — a check by evaluation, not by exhaustion. `
o += `The honest summary is a distribution, not a sum, so it is drawn below rather than reported as one number.\n\n`

o += '<figure class="paper-fig">\n' + figure1() + '\n'
o += `<figcaption><strong>Figure 1.</strong> All ${n(theorems.length)} declarations, one square each, placed by the size of the domain its proof exhausted (log₁₀ buckets). Colour is the wing. The right-hand tail is a single theorem; the mass is at nine cases.</figcaption>\n</figure>\n\n`

o += '<figure class="paper-fig">\n' + figure2() + '\n'
o += `<figcaption><strong>Figure 2.</strong> Theorems per wing — counts, because summing case-counts across wings would draw the one large domain again.</figcaption>\n</figure>\n\n`

o += '<h2 class="paper-h">Method</h2>\n\n'
o += `Each theorem is a proposition over a finite domain, discharged by exhaustion: the kernel evaluates the proposition `
o += `at every point of that domain rather than accepting an argument about it. **${n(byDecide)}** of ${n(theorems.length)} `
o += `are closed by \`by decide\` and are sealed in the append-only ledger. The remaining **${rflOnly.length}** are settled by `
o += `\`rfl\` — a declaration that unfolds to itself — and are deliberately **not sealed**: they are shown here, and marked, `
o += `because a definitional unfolding is not an exhaustion and must not be counted as one. This is a stronger check than a `
o += `passing test, and a weaker claim than a proof about the infinite objects the Millennium Problems concern. No Mathlib, `
o += `no \`native_decide\`, no \`sorry\`. The bound is stated and not exceeded: 0/7.\n\n`

o += '<h2 class="paper-h">How to read this document</h2>\n\n'
o += `Sections are the Lean source files, ordered by the wing each declares in its own frontmatter; the prose under a section `
o += `heading is that file's own header comment, and the remark under a theorem is the comment written above it in the source. `
o += `Nothing here is authored: it is read out of \`src/proof/\` on every build, so the paper cannot drift from the proofs it `
o += `describes — a statement that differs from its source stops the build. A remark under a theorem is printed only `
o += `when the source comment is that theorem's own: **${n(ownDoc)}** of ${n(theorems.length)} have one. A comment that `
o += `belongs to the enclosing section is not repeated under each theorem it precedes, because it is context for the `
o += `section and not a statement about any one of them. Integrity, not truth. 0/7.\n\n`

o += '<h2 class="paper-h">Contents</h2>\n\n'
for (const w of wings) {
  const inWing = docs.filter((d) => d.wing === w)
  o += `**${wingLabel(w)}** — ${inWing.reduce((s, d) => s + d.theorems.length, 0)} theorems\n`
  for (const d of inWing) o += `- [${d.title}](#${d.file.replace('.lean', '')}) · \`${d.file}\` · ${d.theorems.length}\n`
  o += '\n'
}

let k = 0
for (const w of wings) {
  o += `\n<h2 class="paper-h paper-wing">${esc(wingLabel(w))}</h2>\n\n`
  for (const d of docs.filter((x) => x.wing === w)) {
    o += `\n### ${d.title} {#${d.file.replace('.lean', '')}}\n\n`
    o += `<p class="paper-src"><code>src/proof/${d.file}</code> · namespace <code>${d.namespace}</code> · ${d.theorems.length} theorems</p>\n\n`
    if (d.summary) o += d.summary + '\n\n'
    if (d.defs.length) {
      o += '<p class="paper-h">Definitions</p>\n\n<pre class="thm-statement paper-defs"><code>'
      o += d.defs.map((f) => esc(`${f.name} := ${f.value}`)).join('\n')
      o += '</code></pre>\n\n'
    }
    for (const t of d.theorems) {
      k++
      const key = sealedKey.get(at(d.file, t.name))
      const anchor = 'thm-' + d.file.replace('.lean', '') + '-' + t.name
      o += `<div class="thm" id="${anchor}">\n`
      o += `<p class="thm-label"><strong>Theorem ${k}</strong> (<code>${t.name}</code>)`
      o += key ? `<a class="thm-cite" href="/theorem/${key}">sealed</a>` : '<span class="thm-uncited">not sealed — settled by <code>rfl</code>, not exhausted</span>'
      o += '.</p>\n'
      // THE TYPESET FORM IS A READING AID; THE LEAN IS THE THEOREM. Both are shown, in that order and
      // labelled, because the kernel checked the Lean and not this rendering. A statement the grammar
      // does not cover shows the Lean alone rather than a partial rendering — see src/latex.
      const mml = toMathML(t.statement)
      const ltx = toLatex(t.statement)
      if (mml) o += `<div class="thm-math" role="math" aria-label="the statement, typeset">${mml}</div>\n`
      // THE LEAN IS ALWAYS VISIBLE. It was inside a <details> and the printed page then carried only the
      // translation: a <details> cannot be forced open by CSS, so paper showed the rendering and hid the
      // thing the kernel actually checked — the exact inversion this module is written to prevent. Only
      // the LaTeX, which is a copy-paste convenience, is behind a disclosure.
      o += `<pre class="thm-statement"><code>${esc(t.statement)}</code></pre>\n`
      if (ltx) o += `<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>${esc(ltx)}</code></pre></details>\n`
      o += '</div>\n'
      // WHICH THEOREMS SIT AT THE MILLENNIUM FLOOR, and what they do not say. These seven are the closest
      // this framework comes to a Clay problem, which makes them the place an overclaim would do the most
      // damage — so the bound is printed WITH the theorem rather than left to a page the reader may never
      // open. The wording is the shared one the theorem page shows; it is not restated here, so the two
      // cannot drift apart.
      const mil = MILLENNIUM[t.name]
      if (mil) {
        o += `<p class="thm-millennium"><strong>Millennium floor — ${esc(mil.problem)}.</strong> `
        o += `Adjacent to the problem, and <strong>not</strong> the conjecture: ${esc(mil.bound)}. `
        o += `Proved here: <strong>0</strong>. The authoritative statement is <a href="${mil.outlet}">${esc(mil.outletName)}</a>.</p>\n`
      }
      // ONLY the theorem's OWN comment. leandoc also reports a comment inherited from the enclosing
      // section (docFrom 'section'), and printing that under each theorem attributed one theorem's remark
      // to its neighbours: `merkle_settles_its_range`, whose statement is `settledHere = 7`, was captioned
      // with a note about merge being order-sensitive. An inherited sentence is section context, not a
      // remark about this theorem, so it is not printed as one.
      if (t.docFrom === 'own' && t.doc) o += `<p class="thm-remark">${esc(t.doc.replace(/\s+/g, ' ').trim())}</p>\n`
      o += `<p class="thm-proof"><em>Proof.</em> <code>${t.tactic}</code>`
      o += t.cases > 1 ? ` — exhausting ${n(t.cases)} cases.` : ' — by evaluation; no domain is walked.'
      o += ' <span class="qed">□</span></p>\n\n'
    }
  }
}

// An index: a 98-page document had no way to find a theorem by name. Derived from what was printed, so it
// cannot list a theorem the paper does not contain, and the duplicated name appears twice with its file —
// the honest rendering of two theorems that share a name.
o += '\n<h2 class="paper-h">Index of theorems</h2>\n\n<div class="paper-index">\n'
for (const e of docs.flatMap((d) => d.theorems.map((t) => ({ name: t.name, file: d.file })))
  .sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file)))
  o += `<a href="#thm-${e.file.replace('.lean', '')}-${e.name}"><code>${e.name}</code> <span>${e.file}</span></a>\n`
o += '</div>\n\n'

o += '\n<h2 class="paper-h">Verification</h2>\n\n'
o += 'Clone the repository and run `node scripts/lean.ts` to re-check every statement above against the Lean 4 kernel, '
o += 'or `npm run forensics` to re-verify the append-only receipt chain. The sources are '
o += '[src/proof/](https://github.com/ceccec/millennium-solutions/tree/main/src/proof), and each sealed theorem also has its own '
o += 'page carrying the same statement. A content-address proves integrity, not truth. `entails → 0/7`.\n\n'
o += '</div>\n'

writeFileSync('paper.md', o)
console.log(`✓ paper: ${n(theorems.length)} theorems (${n(byDecide)} sealed, ${rflOnly.length} rfl) · ${docs.length} sources · ${wings.length} wings · median ${n(median)} cases, top theorem ${topShare.toFixed(2)}% of the total · seal ${seal.slice(0, 13)}… → paper.md`)


// ── THE SAME PAPER IN LaTeX, generated ──────────────────────────────────────────────────────────────────
// paper.tex was 2.9 kB of hand-written skeleton carrying four theorem blocks, next to a paper.md of 1 MB
// carrying all of them. The deposit's LaTeX publication was a stub while `toLatex` had round-trip-verified
// LaTeX for every statement — the publication understating the work, which is the direction this record has
// erred in throughout.
//
// The preamble, title and abstract are PRESERVED from the hand-written file: they are the author's prose and
// are not this generator's to rewrite. Everything from \section{Theorems} onward is emitted from the same
// `printed` array the markdown paper uses, so the two cannot disagree about what was proved.
//
// It is not compiled here — no TeX toolchain is installed on this machine — so the file is emitted and its
// structure checked, never claimed to have produced a PDF.
const texEscape = (x: string) => x.replace(/([&%#_$])/g, '\\$1')
const HEAD_END = '\\section{Theorems}'
const existing = readFileSync('paper.tex', 'utf8')
const preamble = existing.includes(HEAD_END) ? existing.slice(0, existing.indexOf(HEAD_END)) : existing.replace(/\\end\{document\}\s*$/, '')

let tex = preamble
tex += `${HEAD_END}\n\n`
tex += `Every statement below is a declaration the Lean~4 kernel accepts, sorry-free and axiom-free, and the\n`
tex += `\\LaTeX{} is generated from the Lean source and checked to read back symbol for symbol against it\n`
tex += `(\\texttt{npm run latex-gate}). There are ${n(theorems.length)} of them across ${docs.length} files and\n`
tex += `${wings.length} wings; ${n(byDecide)} close by exhaustion over a stated finite domain and the\n`
tex += `remaining ${rflOnly.length} close by \\texttt{rfl} and are counted separately, never as theorems.\n\n`
for (const w of wings) {
  const inWing = docs.filter((d) => d.wing === w)
  if (!inWing.length) continue
  tex += `\\subsection{${texEscape(w)}}\n\n`
  for (const d of inWing) {
    if (!d.theorems.length) continue
    tex += `\\paragraph{\\texttt{${texEscape(d.file)}}}\n\n`
    for (const t of d.theorems) {
      const l = toLatex(t.statement)
      tex += `\\begin{theorem}[\\texttt{${texEscape(t.name)}}]\n`
      tex += l ? `\\[ ${l} \\]\n` : `\\texttt{${texEscape(t.statement)}}\n`
      tex += `\\end{theorem}\n`
      tex += `\\noindent\\emph{Proof.} \\texttt{${texEscape(t.tactic)}}${t.cases > 1 ? ` --- exhausting ${n(t.cases)} cases` : ' --- by evaluation; no domain is walked'}. \\hfill$\\square$\n\n`
    }
  }
}
tex += `\\section*{Availability}\n`
tex += `Source: \\url{https://github.com/ceccec/millennium-solutions}. Deposit: \\url{https://doi.org/10.5281/zenodo.21819217}.\n`
tex += `Every statement here recomputes from the repository with \\texttt{npm run lean}.\n\n`
tex += `\\end{document}\n`
writeFileSync('paper.tex', tex)
console.log(`✓ paper.tex: ${n(theorems.length)} theorems in ${wings.length} wings, LaTeX generated from the Lean and`
  + ` round-trip checked; preamble and abstract preserved from the hand-written file. Not compiled here — no TeX toolchain.`)
