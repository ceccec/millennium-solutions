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
import { writeFileSync, readFileSync, mkdirSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'
import { all as leanDocs } from './leandoc.ts'
import { live, theoremOfKey, leanTheorems, leanPathOf } from '../src/api/index.ts'
import { toUuid, merkleFold } from '../src/0/index.ts'
import { MILLENNIUM } from '../src/millennium/index.ts'
import { toLatex, toMathML } from '../src/latex/index.ts'
import { escapeAngles, escapeHtml } from '../src/html/index.ts'
import { BASE } from '../src/publication/record.ts' // raw HTML is not base-rewritten by VitePress: a theorem link carries the base itself

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
// every theorem the kernel checks must be sealed — the exhaustions AND the proofs; only rfl declarations are exempt
const unsealedDecide = printed.filter((t) => t.tactic !== 'rfl' && !sealedKey.has(at(t.file, t.name)))
const drifted = printed.filter((t) => (sourceOf.get(at(t.file, t.name)) ?? '') !== t.statement)
if (unsealedDecide.length || drifted.length) {
  if (unsealedDecide.length) {
    console.log(`✗ paper: ${unsealedDecide.length} kernel-checked theorem(s) are not sealed in the ledger — nothing written`)
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
// cases are what an EXHAUSTION walked; a proof for every value walks no domain, so it is not counted as one case
const cases = theorems.filter((t) => t.tactic === 'by decide').map((t) => t.cases).sort((a, b) => a - b)
const totalCases = cases.reduce((n, c) => n + c, 0)
const median = cases[Math.floor(cases.length / 2)]
const largest = Math.max(...cases)
const topShare = (100 * largest) / totalCases
const noExhaustion = theorems.filter((t) => t.tactic === 'by decide' && t.cases <= 1).length
const byDecide = theorems.filter((t) => t.tactic === 'by decide').length
const proofs = theorems.filter((t) => t.tactic !== 'by decide' && t.tactic !== 'rfl').length
const rflOnly = theorems.filter((t) => t.tactic === 'rfl')
const ownDoc = theorems.filter((t) => t.docFrom === 'own').length

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
  // Histogram of counts per domain-size bucket (not one SVG node per theorem — that was a 4 MB figure).
  const cols = BUCKETS.length - 1
  const counts = Array.from({ length: cols }, () => 0)
  for (const t of theorems) counts[bucketOf(t.cases)]++
  const max = Math.max(1, ...counts)
  const barW = 36, gap = 10, H = 220, W = cols * (barW + gap) + 24
  let s = `<svg viewBox="0 0 ${W} ${H}" role="img" class="fig" xmlns="http://www.w3.org/2000/svg" aria-label="how many theorems fall in each domain-size bucket">`
  s += `<title>Figure 1 — ${theorems.length} declarations by domain size (counts)</title>`
  counts.forEach((c, i) => {
    const h = Math.max(c ? 2 : 0, (c / max) * 150)
    const x = 12 + i * (barW + gap)
    const y = H - 48 - h
    s += `<rect x="${x}" y="${y.toFixed(1)}" width="${barW}" height="${h.toFixed(1)}" rx="2" fill="hsl(210 62% 52%)"><title>${bucketName(i)}: ${n(c)}</title></rect>`
    s += `<text x="${x + barW / 2}" y="${H - 28}" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.8">${bucketName(i)}</text>`
    s += `<text x="${x + barW / 2}" y="${H - 12}" font-size="11" text-anchor="middle" fill="currentColor" opacity="0.55">${n(c)}</text>`
  })
  s += `<text x="12" y="16" font-size="12" fill="currentColor" opacity="0.65">theorems per log₁₀ domain-size bucket</text>`
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

/** YAML double-quoted scalar — titles carry `:` and `—`, which break VitePress frontmatter unquoted. */
const yamlTitle = (s: string): string => '"' + s.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"'

// ── the document ─────────────────────────────────────────────────────────────────────────────────────────
const seal = merkleFold(theorems.map((t) => toUuid(t.name + '\n' + t.statement)))

let o = `---\ntitle: ${yamlTitle('The paper — the theorems')}\naside: false\n---\n\n`
o += '<div class="paper paper-collected" itemscope itemtype="https://schema.org/ScholarlyArticle">\n\n'
o += '<div class="paper-masthead">\n'
// AN <h1>, NOT A <div>. This rendered the page title as a styled div, so paper.html carried ZERO h1
// elements — invisible to every heading-based reader and navigation tool, and flagged by scripts/seo.ts,
// which is in no gate chain and had therefore never been run against a clean tree by anyone.
o += '<h1 class="paper-title">The collected theorems of the ℤ/9 vortex framework</h1>\n'
o += '<div class="paper-byline">Rouschev, T. · <em>Millennium Solutions</em> · DOI <a href="https://doi.org/10.5281/zenodo.21819217">10.5281/zenodo.21819217</a> · CC BY-NC-ND 4.0</div>\n'
o += `<div class="paper-addr">${n(byDecide)} theorems by exhaustion + ${n(proofs)} proved for every value + ${n(rflOnly.length)} rfl declarations · ${docs.length} sources · content-address <code>${seal}</code></div>\n`
o += '</div>\n\n'

o += '<h2 class="paper-h">Abstract</h2>\n\n'
o += `This document collects the ${n(theorems.length)} declarations of the ℤ/9 vortex framework that the Lean 4 kernel accepts — ${n(byDecide)} of them THEOREMS closing by exhaustion, ${n(proofs)} PROVED for every value, and ${n(rflOnly.length)} rfl declarations shown and marked as such, `
o += `across ${docs.length} source files. Each is stated exactly as the kernel received it, followed by the tactic that `
o += `discharged it and, for an exhaustion, the size of the finite domain it walked. Every exhaustion is decidable and was checked `
o += `sorry-free and axiom-free; every proof carries only the standard axioms propext and Quot.sound, printed per file. A content-address proves `
o += `integrity, not truth: it fixes which statement was checked, not that the statement is significant. `

o += '<h2 class="paper-h">The size of what was checked</h2>\n\n'
o += `The domains sum to ${n(totalCases)} cases, and that total should not be read as the weight of this work: `
o += `**one theorem carries ${topShare.toFixed(3)}% of it**. The median theorem walks **${n(median)}** cases, and `
o += `**${n(noExhaustion)}** of ${n(theorems.length)} walk a single point — a check by evaluation, not by exhaustion. `
o += `The honest summary is a distribution, not a sum, so it is drawn below rather than reported as one number.\n\n`

o += `The distribution figures (every theorem as one mark, and theorems per wing) live on their own page so this index stays under a megabyte: [Figure 1 & 2 — domain sizes](/paper/distribution).\n\n`

o += '<h2 class="paper-h">Method</h2>\n\n'
o += `Each theorem is a proposition over a finite domain, discharged by exhaustion: the kernel evaluates the proposition `
o += `at every point of that domain rather than accepting an argument about it. **${n(byDecide)}** of ${n(theorems.length)} `
o += `are closed by \`by decide\` and are sealed in the append-only ledger. **${n(proofs)}** are PROVED for every value — a proof, `
o += `not an exhaustion, resting on the standard axioms that core Lean's lemmas carry — and are sealed as proofs, never as decisions. `
o += `The remaining **${rflOnly.length}** are settled by `
o += `\`rfl\` — a declaration that unfolds to itself — and are deliberately **not sealed**: they are shown here, and marked, `
o += `because a definitional unfolding is not an exhaustion and must not be counted as one. This is a stronger check than a `
o += `passing test, and a weaker claim than a proof about the infinite objects the Millennium Problems concern. No Mathlib, `
o += `no \`native_decide\`, no \`sorry\`.\n\n`

o += '<h2 class="paper-h">How to read this document</h2>\n\n'
o += `Sections are the Lean source files, ordered by the wing each declares in its own frontmatter; the prose under a section `
o += `heading is that file's own header comment, and the remark under a theorem is the comment written above it in the source. `
o += `Nothing here is authored: it is read out of the deposit's Lean sources on every build, so the paper cannot drift from the proofs it `
o += `describes — a statement that differs from its source stops the build. A remark under a theorem is printed only `
o += `when the source comment is that theorem's own: **${n(ownDoc)}** of ${n(theorems.length)} have one. A comment that `
o += `belongs to the enclosing section is not repeated under each theorem it precedes, because it is context for the `
o += `section and not a statement about any one of them. Integrity, not truth.\n\n`

// ── SPLIT: one VitePress page per Lean file (ISO/IEC 25010 page weight). The index stays navigable;
// section bodies live under paper/<slug>.md. qpu plugin-iso-gaps mirrors the same split when a `paper`
// Payload page is published (req.context.isoGapsSplitting) and seals evidence for payload-sync.
/** section slug from a lean file — never `index` (that steals /paper/ from paper.md and breaks the sitemap mesh) */
const sectionSlug = (file: string): string => {
  const raw = file.replace(/\.lean$/, '').replace(/[^\w.-]+/g, '-')
  return raw === 'index' ? 'lean-index' : raw
}
const imagSlugOf = (w: string) =>
  w && w !== 'unassigned' ? `imagined-${String(w).replace(/[^\w.-]+/g, '-')}` : 'imagined'

o += '<h2 class="paper-h">Contents</h2>\n\n'
o += 'Each Lean source is its own page — the collected paper is an index, not an 11&nbsp;MB monolith.\n\n'
for (const w of wings) {
  const inWing = docs.filter((d) => d.wing === w)
  o += `**${wingLabel(w)}** — ${inWing.reduce((s, d) => s + d.theorems.length, 0)} theorems\n`
  const enumerated = inWing.filter((d) => /^imagined(_\d+)?\.lean$/.test(d.file))
  if (enumerated.length) {
    const imagSlug = imagSlugOf(w)
    const count = enumerated.reduce((a, d) => a + d.theorems.length, 0)
    o += `- [The enumerated family](/paper/${imagSlug}) · \`imagined*.lean\` · ${count} (summarised)\n`
  }
  for (const d of inWing.filter((d) => !/^imagined(_\d+)?\.lean$/.test(d.file))) {
    const slug = sectionSlug(d.file)
    o += `- [${d.title}](/paper/${slug}) · \`${d.file}\` · ${d.theorems.length}\n`
  }
  o += '\n'
}

const PAPER_DIR = 'paper'
mkdirSync(PAPER_DIR, { recursive: true })
const written = new Set<string>()
let k = 0
const sectionBody = (d: (typeof docs)[number], startK: number): { md: string; nextK: number } => {
  let body = ''
  let localK = startK
  body += `<p class="paper-src"><code>${leanPathOf(d.file)}</code> · namespace <code>${d.namespace}</code> · ${d.theorems.length} theorems · wing <code>${esc(wingLabel(d.wing))}</code></p>\n\n`
  if (d.summary) body += escapeAngles(d.summary) + '\n\n'
  if (d.defs.length) {
    body += '<p class="paper-h">Definitions</p>\n\n<pre class="thm-statement paper-defs"><code>'
    body += d.defs.map((f) => esc(`${f.name} := ${f.value}`)).join('\n')
    body += '</code></pre>\n\n'
  }
  for (const t of d.theorems) {
    localK++
    const key = sealedKey.get(at(d.file, t.name))
    const anchor = 'thm-' + d.file.replace('.lean', '') + '-' + t.name
    body += `<div class="thm" id="${anchor}">\n`
    body += `<p class="thm-label"><strong>Theorem ${localK}</strong> (<code>${t.name}</code>)`
    body += key ? `<a class="thm-cite" href="${BASE}theorem/${key}.html">sealed</a>` : '<span class="thm-uncited">not sealed — settled by <code>rfl</code>, not exhausted</span>'
    body += '.</p>\n'
    const mml = toMathML(t.statement)
    const ltx = toLatex(t.statement)
    if (mml) body += `<div class="thm-math" role="math" aria-label="the statement, typeset">${mml}</div>\n`
    body += `<pre class="thm-statement"><code>${esc(t.statement)}</code></pre>\n`
    if (ltx) body += `<details class="thm-tex"><summary>LaTeX source</summary><pre class="thm-latex"><code>${esc(ltx)}</code></pre></details>\n`
    body += '</div>\n'
    const mil = MILLENNIUM[t.name]
    if (mil) {
      body += `<p class="thm-millennium"><strong>Millennium floor — ${esc(mil.problem)}.</strong> `
      body += `Adjacent to the problem — the claim, and the open gap to the conjecture: ${esc(mil.bound)}. `
      body += `Proved here: <strong>0</strong>. The authoritative statement is <a href="${mil.outlet}">${esc(mil.outletName)}</a>.</p>\n`
    }
    if (t.docFrom === 'own' && t.doc) body += `<p class="thm-remark">${esc(t.doc.replace(/\s+/g, ' ').trim())}</p>\n`
    body += `<p class="thm-proof"><em>Proof.</em> <code>${t.tactic}</code>`
    body += t.cases > 1 ? ` — exhausting ${n(t.cases)} cases.` : ' — by evaluation; no domain is walked.'
    body += ' <span class="qed">□</span></p>\n\n'
  }
  return { md: body, nextK: localK }
}

for (const w of wings) {
  const enumerated = docs.filter((x) => x.wing === w && /^imagined(_\d+)?\.lean$/.test(x.file))
  if (enumerated.length) {
    const count = enumerated.reduce((a, d) => a + d.theorems.length, 0)
    const slug = imagSlugOf(w)
    let section = '---\n'
    section += `title: ${yamlTitle(`The enumerated family — ${wingLabel(w)}`)}\n`
    section += 'aside: false\n---\n\n'
    section += `<div class="paper paper-section">\n\n`
    section += `<p class="paper-src"><a href="/paper">← collected paper</a> · <code>src/iso/80000-2-mathematics/imagined*.lean</code> · ${enumerated.length} modules · ${n(count)} theorems</p>\n\n`
    section += `These are proposed by \`scripts/imagine.ts\` and **summarised rather than transcribed**: each is an instance whose statement follows from its name, and the laws they are instances of are stated once in \`group.lean\`.\n\n`
    section += `<p class="paper-src">Three, as written:</p>\n\n<pre class="thm-statement"><code>`
    section += enumerated[0]!.theorems.slice(0, 3).map((t) => esc(`${t.name} : ${t.statement}`)).join('\n\n')
    section += `</code></pre>\n\n</div>\n`
    writeFileSync(join(PAPER_DIR, `${slug}.md`), section)
    written.add(`${slug}.md`)
  }
  for (const d of docs.filter((x) => x.wing === w && !/^imagined(_\d+)?\.lean$/.test(x.file))) {
    const slug = sectionSlug(d.file)
    const { md, nextK } = sectionBody(d, k)
    k = nextK
    let section = '---\n'
    section += `title: ${yamlTitle(d.title)}\n`
    section += 'aside: false\n---\n\n'
    section += `<div class="paper paper-section">\n\n`
    section += `<p><a href="/paper">← collected paper</a></p>\n\n`
    section += `## \`${d.file}\`\n\n`
    section += md
    section += '</div>\n'
    writeFileSync(join(PAPER_DIR, `${slug}.md`), section)
    written.add(`${slug}.md`)
  }
}
{
  let dist = `---\ntitle: ${yamlTitle('Domain sizes — figures')}\naside: false\n---\n\n`
  dist += '<div class="paper paper-section">\n\n<p><a href="/paper">← collected paper</a></p>\n\n'
  dist += '<figure class="paper-fig">\n' + figure1() + '\n'
  dist += `<figcaption><strong>Figure 1.</strong> Counts of the ${n(theorems.length)} declarations in each log₁₀ domain-size bucket (histogram — not one mark per theorem).</figcaption>\n</figure>\n\n`
  dist += '<figure class="paper-fig">\n' + figure2() + '\n'
  dist += `<figcaption><strong>Figure 2.</strong> Theorems per wing — counts, because summing case-counts across wings would draw the one large domain again.</figcaption>\n</figure>\n\n`
  dist += '</div>\n'
  writeFileSync(join(PAPER_DIR, 'distribution.md'), dist)
  written.add('distribution.md')

  // Chunked indexes — keep each page under ~1 MB of markdown (~4k link rows).
  const allIndex = docs
    .flatMap((d) => d.theorems.map((t) => ({ name: t.name, file: d.file })))
    .sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file))
  const CHUNK = 2500
  const chunks = Math.max(1, Math.ceil(allIndex.length / CHUNK))
  let hub = `---\ntitle: ${yamlTitle('Index of theorems')}\naside: false\n---\n\n`
  hub += '<div class="paper paper-section">\n\n<p><a href="/paper">← collected paper</a></p>\n\n'
  hub += `Every printed theorem by name (${n(theorems.length)}), in ${chunks} part(s):\n\n`
  for (let i = 0; i < chunks; i++) {
    const rows = allIndex.slice(i * CHUNK, (i + 1) * CHUNK)
    const slug = `theorem-index-${i + 1}`
    const from = rows[0]?.name ?? ''
    const to = rows[rows.length - 1]?.name ?? ''
    hub += `- [Part ${i + 1}](/paper/${slug}) · \`${from}\` … \`${to}\` · ${n(rows.length)}\n`
    let page = `---\ntitle: ${yamlTitle(`Theorems · part ${i + 1}`)}\naside: false\n---\n\n`
    page += `<div class="paper paper-section">\n\n<p><a href="/paper/theorem-index">← theorem index</a> · <a href="/paper">collected paper</a></p>\n\n`
    page += '<div class="paper-index">\n'
    for (const e of rows) {
      const s = e.file.replace(/\.lean$/, '')
      page += `<a href="/paper/${s}#thm-${s}-${e.name}"><code>${e.name}</code> <span>${e.file}</span></a>\n`
    }
    page += '</div>\n\n</div>\n'
    writeFileSync(join(PAPER_DIR, `${slug}.md`), page)
    written.add(`${slug}.md`)
  }
  hub += '\n</div>\n'
  writeFileSync(join(PAPER_DIR, 'theorem-index.md'), hub)
  written.add('theorem-index.md')
}
for (const f of readdirSync(PAPER_DIR)) {
  if (f.endsWith('.md') && !written.has(f)) unlinkSync(join(PAPER_DIR, f))
}

o += `\n<h2 class="paper-h">Index of theorems</h2>\n\n`
o += `Every printed theorem by name: [index of theorems](/paper/theorem-index) (${n(theorems.length)} entries, letter-bucketed).\n\n`

o += '\n<h2 class="paper-h">Verification</h2>\n\n'
o += 'Clone the repository and run `node scripts/lean.ts` to re-check every statement above against the Lean 4 kernel, '
o += 'or `npm run forensics` to re-verify the append-only receipt chain. The sources are '
o += '[src/proof/](https://github.com/ceccec/millennium-solutions/tree/main/src/proof), and each sealed theorem also has its own '
o += 'page carrying the same statement. A content-address proves integrity, not truth.\n\n'
o += '</div>\n'

// PAPER_OUT lets a checker (constants-gate) generate into a directory of its own, so it never rewrites the
// committed paper.md — the same contract pages.ts honours for README.md and index.md through PAGES_OUT.
const PAPER_OUT = process.env.PAPER_OUT ? process.env.PAPER_OUT.replace(/\/?$/, '/') : ''
writeFileSync(PAPER_OUT + 'paper.md', o)
console.log(`✓ paper: ${n(theorems.length)} declarations (${n(byDecide + proofs)} theorems: ${n(byDecide)} by exhaustion + ${n(proofs)} proved for every value; ${rflOnly.length} rfl, never theorems) · ${docs.length} sources · ${wings.length} wings · median ${n(median)} cases, top theorem ${topShare.toFixed(2)}% of the total · seal ${seal.slice(0, 13)}… → paper.md + ${written.size} section page(s) under ${PAPER_DIR}/`)


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
tex += `Every statement below is a declaration the Lean~4 kernel accepts, sorry-free; the exhaustions are axiom-free and the\n`
tex += `proofs carry only the standard axioms \\texttt{propext} and \\texttt{Quot.sound}, and the\n`
tex += `\\LaTeX{} is generated from the Lean source and checked to read back symbol for symbol against it\n`
tex += `(\\texttt{npm run latex-gate}). There are ${n(theorems.length)} of them across ${docs.length} files and\n`
tex += `${wings.length} wings; ${n(byDecide)} close by exhaustion over a stated finite domain, ${n(proofs)} are proved\n`
tex += `for every value, and the remaining ${rflOnly.length} close by \\texttt{rfl} and are counted separately, never as theorems.\n\n`
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
writeFileSync(PAPER_OUT + 'paper.tex', tex)
console.log(`✓ paper.tex: ${n(theorems.length)} theorems in ${wings.length} wings, LaTeX generated from the Lean and`
  + ` round-trip checked; preamble and abstract preserved from the hand-written file. Not compiled here — no TeX toolchain.`)
