#!/usr/bin/env node
// THE ATTRIBUTION TABLE IS GENERATED — adding a proof file must not mean renumbering a list by hand.
//
// src/proof/priorart.lean carried a positional table: one row per .lean file, each numbered, each with a
// hand-written description. Every fact in it was ALREADY declared in the file it described, in that file's
// own frontmatter. So the table was a second copy, kept in step by hand — and when involution.lean was
// added earlier today, twenty-six rows had to be renumbered to make room for it. Manual work of that shape
// is not merely tedious; it is where a credit silently stops matching the file it credits.
//
// Now each .lean file describes its own attribution completely — `prior_art:`, and either
// `prior_art_note:`/`prior_art_domain:` when it restates named work or `prior_art_own:` when it does not —
// and this writes the table from those declarations. Adding a file requires editing that file and nothing
// else.
//
// IDEMPOTENT BY REQUIREMENT: run on an unchanged tree it must produce byte-identical output. A generator
// that rewrites what it did not need to change makes every diff unreadable, and this deposit has been
// bitten by generators that silently dropped content they carried.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'

const KINDS: Record<string, string> = { named: '0', unclassified: '1', 'none-known': '2' }
const TARGET = 'src/proof/priorart.lean'

export const table = (): string => {
  const files = readdirSync('src/proof').filter((f) => f.endsWith('.lean')).sort()
  const rows: string[] = []
  const width = Math.max(...files.map((f) => f.length))
  files.forEach((f, i) => {
    const src = readFileSync('src/proof/' + f, 'utf8')
    // A note may wrap across continuation lines (`--   more text`); joining them keeps a credit whole.
    // The first draft took only the first line and truncated Euler's attribution mid-sentence.
    const get = (k: string) => {
      const lines = src.split('\n')
      const i = lines.findIndex((l) => new RegExp(`^--\\s*${k}:`).test(l))
      if (i < 0) return ''
      let out = lines[i].replace(new RegExp(`^--\\s*${k}:\\s*`), '').trim()
      for (let j = i + 1; j < lines.length && /^--\s{2,}\S/.test(lines[j]); j++) out += ' ' + lines[j].replace(/^--\s+/, '').trim()
      return out.trim()
    }
    const kind = KINDS[get('prior_art')] ?? '1'
    // A row may claim novelty only when its file records a search that was actually performed. The default
    // is not to claim, and the register refuses to let a file opt itself into a claim without the receipt.
    const claims = kind === '2' && !!get('prior_art_search')
    const note = kind === '0' ? (get('prior_art_note') || get('prior_art_domain')) : get('prior_art_own')
    // NO PADDING BEFORE THE INDEX. scripts/priorart.ts parses these rows with a regex requiring a digit
    // immediately after `(`, so `( 1,` matched nothing and the first nine rows vanished from its view while
    // the table looked right to a reader. Padding goes after the comma, where it aligns without hiding rows.
    const n = String(i + 1)
    rows.push(`  ${i === 0 ? '[' : ','} (${n},${' '.repeat(3 - n.length)}${kind}, ${claims})   -- ${f.padEnd(width)} — ${note}`)
  })
  return `def sources : List Source :=\n${rows.join('\n')}\n  ]`
}

const src = readFileSync(TARGET, 'utf8')
const re = /def sources : List Source :=\n(?:.*\n)*?  \]/
if (!re.test(src)) { console.error('✗ priorart-gen: no `sources` block found in ' + TARGET); process.exit(1) }
const next = src.replace(re, table())

if (process.argv[2] === '--check') {
  if (next === src) console.log('✓ priorart-gen: the table equals what the frontmatter generates — no drift')
  else console.log('✗ priorart-gen: the table in ' + TARGET + ' is not what the files declare; run `npm run priorart:gen`')
  process.exit(next === src ? 0 : 1)
}
writeFileSync(TARGET, next)
console.log(next === src
  ? '✓ priorart-gen: already in step — byte-identical, nothing rewritten'
  : '✓ priorart-gen: table regenerated from the frontmatter of every .lean file')
