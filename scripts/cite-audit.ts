#!/usr/bin/env node
/** ── EVERY CITATION IN EVERY PROSE FILE, AGAINST THE LEDGER — ON EVERY RUN, NOT ONLY AT RELEASE ───────────
 *
 *  Found by scripts/blind.ts. A seeded trial repointed a `/theorem/…` link in CHALLENGES.md at a key that is
 *  not live, and the routine chain stayed green — twice, at two different seeds. The check exists: scripts/
 *  audit.ts decides whether a cited key stands, and it is exactly what caught a page citing a withdrawn
 *  theorem earlier today. But it runs in only two places, and neither covers the ordinary case:
 *
 *    scripts/seal.ts   audits ALL prose — and runs only in `release`
 *    scripts/precommit audits STAGED prose — so a drifted citation in a file nobody happens to be
 *                      committing is invisible to it
 *
 *  A citation that survives every routine run until release day is a citation nobody is checking. This is
 *  the same audit over the same file set as seal.ts, without the sealing, wired into the chain that runs on
 *  every build.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { audit, citations, LIVE } from './audit.ts'

// The same globbed set seal.ts audits, so the two cannot disagree about what counts as prose.
const EXCLUDE = /(^|[/\\])(node_modules|\.git|\.claude)([/\\]|$)|\.vitepress[/\\](dist|cache)[/\\]|[/\\](en|bg|de|es|fr|ru|zh)[/\\]/
const FILES = [...readdirSync('.', { recursive: true }).map(String).filter((f) => f.endsWith('.md') && !EXCLUDE.test(f))].sort()

let cited = 0
const bad: { f: string; hit: string; why: string }[] = []
for (const f of FILES) {
  let txt = ''
  try { txt = readFileSync(f, 'utf8') } catch { continue }
  cited += citations(txt).length
  const { binary, hit, why } = audit(txt)
  if (!binary && hit) bad.push({ f, hit, why })
}

if (bad.length) {
  console.log(`✗ cite-audit: ${bad.length} prose file(s) cite a key the ledger does not stand behind:`)
  for (const b of bad) console.log(`    ${b.f} — ${b.hit}  (${b.why})`)
  console.log(`  A published /theorem/ link that resolves to nothing sends a reader to a page saying the`)
  console.log(`  theorem is not there. Until now this was decided at release and on staged files only.`)
  process.exit(1)
}
console.log(`✓ cite-audit: ${cited} citation(s) across ${FILES.length} prose file(s), every one of them live in the ledger`)
console.log(`  ${LIVE.size} keys stand.`)
