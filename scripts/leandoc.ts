#!/usr/bin/env node
// LEANDOC — read the Lean sources as the documents they already are.
//
// The front pages were computed from claim functions written in TypeScript: a second place where the deposit
// described itself, kept in step with the proofs by hand. That is the arrangement every drift in this repo has
// come from — a page saying a theorem is re-verified when it is not, a memory index quoting a ledger 504
// theorems stale. The proofs are the only thing the kernel checks, so they are the only honest place for the
// prose about them to live.
//
// Every .lean file here already carries its documentation inline: a header block saying what the file is for,
// and a comment above each theorem saying what that theorem establishes and why it is stated the way it is.
// This reads them out. Nothing is invented: a file with no header reports no summary, a theorem with no
// comment reports no doc, and the generator shows the gap rather than filling it with a template.
//
// FRONTMATTER is the explicit part — `-- key: value` lines in a leading block, before the prose. Only `title`
// and `wing` are read; anything else is carried through untouched so a field can be added without editing
// this file. A file without frontmatter falls back to its own name, which is honest but plainer.
import { readFileSync, readdirSync } from 'node:fs'

const DIR = 'src/proof'

export type Theorem = { name: string; doc: string; docFrom: 'own' | 'section' | 'none'; statement: string; tactic: string; cases: number }
export type Def = { name: string; value: string }
export type LeanDoc = {
  file: string; namespace: string; title: string; wing: string
  frontmatter: Record<string, string>; summary: string; theorems: Theorem[]; defs: Def[]
}

/** The domain `by decide` actually walked, read off the statement — the count of cases the kernel exhausted. */
export const domainOf = (statement: string): number => {
  let n = 1
  for (const m of statement.matchAll(/List\.range'\s+\d+\s+(\d+)/g)) n *= Number(m[1])
  for (const m of statement.matchAll(/List\.range\s+(\d+)/g)) n *= Number(m[1])
  for (const m of statement.matchAll(/\[([0-9,\s]+)\]/g)) n *= Math.max(1, m[1].split(',').filter((x) => x.trim()).length)
  return n
}

const stripComment = (block: string) =>
  block.split('\n').map((l) => l.replace(/^\s*--\s?/, '').replace(/^[─\s]*$/, '')).join('\n')
    .replace(/\n{3,}/g, '\n\n').trim()

export function read(file: string): LeanDoc {
  const src = readFileSync(`${DIR}/${file}`, 'utf8')
  const ns = src.match(/^namespace\s+([A-Za-z_0-9.]+)/m)?.[1] ?? file.replace('.lean', '')

  // the header: the run of comment lines before the first namespace/def/theorem
  const head = src.slice(0, src.search(/^(namespace|def|theorem)\s/m))
  const headComment = head.split('\n').filter((l) => /^\s*--/.test(l)).join('\n')

  // frontmatter — `-- key: value` lines at the top of the header, stopping at the first prose line
  const frontmatter: Record<string, string> = {}
  for (const line of headComment.split('\n')) {
    const m = line.match(/^\s*--\s*([a-z][a-z0-9_]*):\s*(.+?)\s*$/)
    if (!m) break
    frontmatter[m[1]] = m[2]
  }
  const fmLines = Object.keys(frontmatter).length
  const summary = stripComment(headComment.split('\n').slice(fmLines).join('\n'))
    .replace(/^Author:.*$/gm, '').trim()

  // Each theorem, with the comment block immediately above it — OR, failing that, the section heading it
  // sits under. Files here group related theorems beneath one `-- ── HEADING ──` and let the group speak for
  // all of them, which is good writing and was being counted as 17 undocumented theorems. Reporting a parser
  // limitation as a documentation gap would have been answered by writing 17 redundant comments to satisfy a
  // number — describing the same thing twice so a count came out right. The provenance is recorded instead:
  // 'own' is a comment written for this theorem, 'section' is the heading it inherits, 'none' is a real gap.
  const theorems: Theorem[] = []
  let lastSection = ''
  for (const m of src.matchAll(/((?:^[ \t]*--.*\n)*)^theorem\s+([A-Za-z_0-9]+)\s*:([\s\S]*?):=\s*(by decide|rfl|by\s+\w+)/gm)) {
    const statement = m[3].replace(/^\s*--.*$/gm, '').replace(/\s+/g, ' ').trim()
    const own = stripComment(m[1])
    if (own) lastSection = own
    theorems.push({
      name: m[2],
      doc: own || lastSection,
      docFrom: own ? 'own' : lastSection ? 'section' : 'none',
      statement, tactic: m[4], cases: domainOf(statement),
    })
  }

  // the file's own definitions, so a constant can be compared against the one the runtime uses
  const defs: Def[] = [...src.matchAll(/^def\s+([A-Za-z_0-9]+)\s*(?::\s*[^:=]+)?:=\s*([^\n]+)$/gm)]
    .map((m) => ({ name: m[1], value: m[2].trim() }))

  return {
    file, namespace: ns, defs,
    title: frontmatter.title ?? file.replace('.lean', ''),
    wing: frontmatter.wing ?? '',
    frontmatter, summary, theorems,
  }
}

export const all = (): LeanDoc[] =>
  readdirSync(DIR).filter((f) => f.endsWith('.lean')).sort().map(read)

if (import.meta.url === `file://${process.argv[1]}`) {
  const docs = all()
  const withFm = docs.filter((d) => Object.keys(d.frontmatter).length)
  const withSummary = docs.filter((d) => d.summary)
  const thms = docs.flatMap((d) => d.theorems)
  const documented = thms.filter((t) => t.docFrom === 'own')
  const inherited = thms.filter((t) => t.docFrom === 'section')
  console.log(`leandoc — ${docs.length} files · ${thms.length} theorems`)
  console.log(`  frontmatter   : ${withFm.length}/${docs.length} files`)
  console.log(`  file summary  : ${withSummary.length}/${docs.length} files`)
  console.log(`  theorem doc   : ${documented.length}/${thms.length} carry a comment of their own`)
  console.log(`  inherited     : ${inherited.length} sit under a section heading that covers them`)
  console.log(`  undocumented  : ${thms.length - documented.length - inherited.length} — a real gap, never filled with a template`)
  for (const d of docs) console.log(`    ${d.file.padEnd(18)} ${String(d.theorems.length).padStart(3)} thm · ${d.summary ? 'summary' : 'NO SUMMARY'} · ${Object.keys(d.frontmatter).length ? 'frontmatter' : 'no frontmatter'}`)
}
