#!/usr/bin/env node
// LESSONS — what this tree has already learned, derived from the tree rather than written down again.
//
// Every gate here carries its own war story in its own header: the version that was vacuous, the scan whose
// domain was narrower than the defect it claimed, the constant somebody typed instead of deriving. There
// are 128 of them. Each is written where it happened, which is the right place for the fix and the worst
// place for the pattern — an agent reads one file and learns one lesson, and the same mistake is made in the
// next file by somebody who read a different one.
//
// This derives the classes from the corpus instead. It is measurement, not memoir: the counts come from the
// tree's own comments on every run, so a lesson recorded tomorrow appears here without anyone adding it, and
// a class nobody has hit reads zero rather than being quietly believed.
//
// THE CLASSES ARE A CHOICE, and are typed out as one. No fact about this repository fixes how many kinds of
// error there are; these six are the ones the record actually shows, and a seventh would be added by someone
// who had seen it. They are stated here so a reader can disagree with the taxonomy rather than the count.
//
// IT EXCLUDES ITSELF, and that is not tidiness. Every pattern below appears in this file, because this file
// explains them — the same trap that made canon-gate flag the module documenting it and made orphan-gate
// call a module live because a comment about it mentioned its path. A check that reads the whole tree reads
// its own explanation.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { flag } from '../src/cli/index.ts'
import { execSync } from 'node:child_process'

const CLASSES: { name: string; pattern: RegExp; why: string }[] = [
  { name: 'a constant typed instead of derived', pattern: /typed .*constant|hand-?(typed|listed|written)|retyped|literal instead/i,
    why: 'the value and its meaning drift apart, and the copy is the one nobody updates' },
  { name: 'a check that could not go red', pattern: /vacuous|no-?op|cannot fail|could never|always true|accepts .* that/i,
    why: 'it reports health it never measured, and deleting it would change nothing' },
  { name: 'the instrument was wrong, not the code', pattern: /the instrument|not the code|my own detector|detector was|false positive/i,
    why: 'a finding is evidence about the finder until the finder has been run against a known case' },
  { name: 'domain narrower than the defect', pattern: /narrower than|only scanned|did not scan|scoped to|read only src|missed .* because/i,
    why: 'the claim reads over the whole tree and the scan covered part of it' },
  { name: 'the check read its own explanation', pattern: /reads its own|its own explanation|own mutation string|quoting the pattern|own comment/i,
    why: 'a gate that scans the tree scans the prose describing what it scans for' },
  { name: 'a flattering number survived', pattern: /flattering|exonerat|cleared me|clean result/i,
    why: 'a result that clears you is checked less than one that accuses you' },
]

const SELF = 'scripts/lessons.ts'
const files = execSync('git ls-files "scripts/*.ts" "src/**/*.ts" "src/proof/*.lean"', { encoding: 'utf8' })
  .split('\n').filter(Boolean).filter((f) => f !== SELF)

const found = CLASSES.map((c) => ({ ...c, at: [] as string[] }))
for (const f of files) {
  readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
    if (!/^\s*(\/\/|--)/.test(l)) return
    for (const c of found) if (c.pattern.test(l)) c.at.push(`${f}:${i + 1}`)
  })
}
const total = found.reduce((n, c) => n + c.at.length, 0)
const byFile: Record<string, number> = {}
for (const c of found) for (const a of c.at) { const f = a.split(':')[0]; byFile[f] = (byFile[f] ?? 0) + 1 }

const rows = [...found].sort((a, b) => b.at.length - a.at.length)
const worst = Object.entries(byFile).sort((a, b) => b[1] - a[1]).slice(0, 8)

const md = [
  // The heading is short because scripts/seo.ts measures the rendered <title>, site suffix included, and
  // refuses one a search result would truncate. 67 characters was the first attempt.
  '# Lessons — what the tree has learned',
  '',
  `Derived on every run from ${files.length} sources: **${total} corrections** the deposit recorded about itself,`,
  'in the comments of the files where each one happened. Nobody wrote this list; it is counted.',
  '',
  'The taxonomy is a choice — six classes, because six are what the record shows — and it is stated so a',
  'reader can disagree with the classes rather than with the arithmetic.',
  '',
  '| corrections | class | why it costs something |',
  '| ---: | --- | --- |',
  ...rows.map((c) => `| ${c.at.length} | ${c.name} | ${c.why} |`),
  '',
  '## Where they were learned',
  '',
  'A file near the top has been corrected often. That is a record of attention, not of poor quality —',
  'the untouched files are the ones nobody has checked this hard.',
  '',
  ...worst.map(([f, n]) => `- \`${f}\` — ${n}`),
  '',
  `_Generated by \`scripts/lessons.ts\`. It excludes itself: every pattern above appears in it, because it_`,
  `_explains them, and a check that reads the whole tree reads its own explanation._`,
  '',
].join('\n')
// TWO MODES, LIKE priorart-gen AND priorart. `--write` regenerates; the default CHECKS and refuses when the
// published page disagrees with what the tree now says. Without the check this is a generator — it exits
// zero whatever it finds, nothing can make it red, and gates-fire would list it among the steps that reject
// nothing. The drift refusal is what makes the count load-bearing: a page claiming 128 corrections after the
// corpus has moved is a figure with no source, which is the class it exists to name.
const WRITE = flag('--write')
const published = existsSync('LESSONS.md') ? readFileSync('LESSONS.md', 'utf8') : ''
if (WRITE) writeFileSync('LESSONS.md', md)
else if (published !== md) {
  const was = (/\*\*(\d+) corrections\*\*/.exec(published) ?? [])[1] ?? 'none'
  console.log(`✗ lessons: LESSONS.md says ${was} correction(s); the tree now records ${total}. Re-run with --write —`)
  console.log(`  a published count the corpus no longer supports is exactly the defect this page is counting.`)
  process.exit(1)
}

console.log(`lessons — ${total} correction(s) recorded across ${files.length} sources, in ${CLASSES.length} classes:`)
for (const c of rows) console.log(`  ${String(c.at.length).padStart(4)}  ${c.name}`)
if (!total) { console.log('\n✗ lessons: the corpus records no corrections at all — the reader is broken, not the tree'); process.exit(1) }
console.log(`\n✓ lessons: ${total} recorded, counted from the tree rather than remembered${WRITE ? ' → LESSONS.md' : ' · the page agrees'}`)
