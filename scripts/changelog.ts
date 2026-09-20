#!/usr/bin/env node
/** ── CHANGELOG.md — DERIVED FROM THE PROVENANCE TAGS, NEVER WRITTEN BY HAND ────────────────────────────
 *
 *  Every release here is an annotated git tag whose message carries the content-address of the tree it
 *  names. That is already a complete, immutable, third-party-checkable history: a hand-written changelog
 *  beside it would be a SECOND derivation of one fact, which is this repository's named defect — and the
 *  hand-written one is the copy that drifts.
 *
 *  So this file is computed. Each row is read from `git for-each-ref`: the version, the date the tag was
 *  created, and the content-address parsed out of the tag's own message. Nothing is typed, which means a
 *  row cannot claim an address the tag does not carry.
 *
 *  THE FULL TABLE, NOT A WINDOW. The captain's instruction (receipt 08ac1f15, `agent: "captain"`) is that
 *  Zenodo carry the README and the changelog on each release. A changelog attached to a permanent citable
 *  record that silently shows only its last few entries would misrepresent the history it is there to
 *  document, so every tag is listed. The most recent releases additionally carry the commit subjects
 *  between them, which is the part a reader actually reads.
 *
 *  usage:  node scripts/changelog.ts            write CHANGELOG.md
 *          node scripts/changelog.ts --check    fail if CHANGELOG.md is not what the tags derive */
// ARGUMENTS, NOT A SHELL STRING. The first version built these commands as strings for `execSync`, which
// runs them through /bin/sh: the tab separator in the --format arrived as the two characters \ and t, every
// row parsed as one field, and the ranges handed to `git log` were whole tag messages — 40 shell syntax
// errors, and a CHANGELOG.md written anyway, claiming 0 of 916 tags carried a content-address when every
// one of them does. A flattering-looking failure (it wrote a file and exited 0) caused entirely by the
// shell. execFileSync passes argv straight to git, so a tab is a tab and a message with parentheses in it
// is data rather than syntax.
import { execFileSync } from 'node:child_process'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { fitsSerp, serpRoom } from '../src/7/serp.ts'

const OUT = 'CHANGELOG.md'
const DETAIL = 20 // releases carried with their commit subjects; every release is in the table regardless

const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

type Tag = { name: string; date: string; address: string; sha: string }

// version:refname sorts v9.6.8 after v9.6.7 and after v10.x correctly; refname alone would not.
const tags: Tag[] = git('for-each-ref', '--sort=version:refname', '--format=%(refname:short)\t%(creatordate:short)\t%(objectname)\t%(contents:subject)', 'refs/tags')
  .split('\n').filter(Boolean)
  .map((line) => {
    const [name, date, sha, subject = ''] = line.split('\t')
    // THE ADDRESS IS PARSED, NOT ASSUMED. A tag minted before the address was part of the message has
    // none, and says so rather than borrowing its neighbour's.
    const m = subject.match(/content-address\s+([0-9a-f-]{36})/)
    return { name, date, sha, address: m ? m[1] : '' }
  })

if (!tags.length) { console.log('  ○ changelog: no tags — nothing to derive from'); process.exit(0) }

// REFUSE TO WRITE A CHANGELOG THAT LOST ITS PARSE. Every tag this repository mints carries a content-address;
// a run that parses none of them has not found old tags, it has broken its own reader — which is exactly what
// happened, silently, with exit 0. Below the threshold the file is not written at all.
const parsed = tags.filter((t) => t.address).length
if (tags.length > 8 && parsed === 0) {
  console.log(`  ✗ changelog: parsed ${tags.length} tags and found a content-address in none of them — the reader is broken, not the history. Nothing written.`)
  process.exit(1)
}

const withAddress = tags.filter((t) => t.address).length
const recent = tags.slice(-DETAIL).reverse()

// The commits a release contains: everything reachable from its tag but not from the previous one, minus
// the release commit itself, which says nothing a reader wants (it names the address, which the table has).
const subjectsFor = (t: Tag, prev: Tag | undefined): string[] => {
  const range = prev ? `${prev.name}..${t.name}` : t.name
  try {
    return git('log', '--no-merges', '--format=%s', range).split('\n').filter(Boolean)
      .filter((s) => !/^release uuidna /.test(s))
  } catch { return [] }
}

const lines: string[] = []
lines.push('---')
// THE TITLE IS A SERP LINE, NOT A SUMMARY. The first one ran to 85 characters with the site suffix and
// seo.ts refused the release: a title Google truncates is a title whose end nobody reads. The second ran to
// 61 against a cap of 60 — one character over, chosen by counting on fingers against a limit in another
// file, in the commit whose own message said the title now fits a search result.
//
// So it is no longer counted here. `fitsSerp` composes the site suffix and applies the cap from
// src/7/serp.ts, the same values seo.ts judges with and .vitepress/config.ts renders with, and this refuses
// at the GENERATOR rather than shipping a page for a gate seven chain steps later to reject.
const CHANGELOG_TITLE = 'Changelog — each release from its tag'
if (!fitsSerp(CHANGELOG_TITLE)) {
  console.error(`  ✗ changelog: the title is ${CHANGELOG_TITLE.length} characters and a search result leaves`
    + ` room for ${serpRoom()} — shorten it here, not in the gate that refuses it`)
  process.exit(1)
}
lines.push('title: ' + CHANGELOG_TITLE)
lines.push('description: One row per annotated git tag, each with the content-address that tag carries. Computed by scripts/changelog.ts; nothing here is typed.')
lines.push('---')
lines.push('')
lines.push('# Changelog')
lines.push('')
lines.push(`Derived by \`node scripts/changelog.ts\` from this repository's annotated tags. **${tags.length} releases**, `
  + `${withAddress} of them carrying a content-address in the tag itself. A row cannot claim an address its `
  + `tag does not carry, because the row is read out of the tag.`)
lines.push('')
lines.push(`## The last ${recent.length} releases, with what they contain`)
lines.push('')
for (const t of recent) {
  const prev = tags[tags.indexOf(t) - 1]
  const subs = subjectsFor(t, prev)
  lines.push(`### ${t.name} — ${t.date}`)
  lines.push('')
  lines.push(t.address ? `Content-address \`${t.address}\`.` : '_This tag carries no content-address in its message._')
  lines.push('')
  if (subs.length) for (const s of subs) lines.push(`- ${s}`)
  else lines.push('- _no commits between this tag and the previous one — a re-tag of the same tree_')
  lines.push('')
}
lines.push('## Every release')
lines.push('')
lines.push('| version | date | content-address |')
lines.push('| --- | --- | --- |')
for (const t of [...tags].reverse()) lines.push(`| ${t.name} | ${t.date} | ${t.address ? '`' + t.address + '`' : '—' } |`)
lines.push('')

const body = lines.join('\n')

if (process.argv.includes('--check')) {
  if (!existsSync(OUT)) { console.log(`  ✗ changelog: ${OUT} is missing — run \`node scripts/changelog.ts\``); process.exit(1) }
  if (readFileSync(OUT, 'utf8') !== body) { console.log(`  ✗ changelog: ${OUT} is not what the tags derive — run \`node scripts/changelog.ts\``); process.exit(1) }
  console.log(`  ✓ changelog: ${OUT} agrees with ${tags.length} tags`)
  process.exit(0)
}

writeFileSync(OUT, body)
console.log(`✓ changelog: ${OUT} — ${tags.length} releases, ${withAddress} with a content-address, last ${recent.length} itemised`)
