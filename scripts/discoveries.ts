#!/usr/bin/env node
/** ── DISCOVERIES — THE COMBINATORIAL MACHINERY, CONSOLIDATED AND POINTED AT WHAT MIGHT BE NEW ─────────────
 *
 *  Four generators have grown separately in this tree and none of them knows about the others:
 *
 *    imagine.ts   enumerates the whole statement space the ℤ/9 vocabulary can express and keeps what the
 *                 kernel accepts, what is not already said, and what DISCRIMINATES between siblings
 *    coils.ts     clusters expressions that compute the same thing — cross formulas proving each other
 *    novelty.ts   searches OEIS, zbMATH, OpenAlex, Crossref and arXiv per theorem, and records the result
 *    priorart     classifies each SOURCE FILE as restating named work or as the deposit's own
 *
 *  Separately each answers a narrow question. Together they answer the one that matters: WHERE SHOULD THE
 *  NEXT SEARCH GO. A theorem in a file that declares its own work, with no search ever recorded against it,
 *  sitting in a family the tree has grown to octave scale, is a far better candidate than a restatement of
 *  Euler nobody needs to look up.
 *
 *  THE NUMBER THIS EXISTS TO SURFACE. Measured 2026-09-25: 35 novelty searches are recorded against 1,168
 *  theorems — three per cent — while 357 theorems sit in files declaring `prior_art_own` with nothing
 *  looked up at all. The deposit's own rule is that `none-known` is the only class allowed to claim
 *  novelty, and it requires "a named prior-art search that was performed and found nothing". At 3% coverage
 *  almost nothing in this tree has earned that class, and the honest reading is that novelty is UNMEASURED
 *  here, not absent and not present.
 *
 *  RANKING IS NOT NOVELTY, AND NOTHING BELOW ESTABLISHES ANYTHING. This orders a queue. Only a performed
 *  search, recorded with its queries and its results, can say whether a statement has an earlier author —
 *  and a high rank here means "worth looking at", never "unprecedented". Calling a ranking a discovery is
 *  exactly the overclaim the rest of this tree is built to refuse.
 *
 *    node scripts/discoveries.ts            the ranked queue
 *    node scripts/discoveries.ts --all      every candidate, not the head of the list */
import { readFileSync, existsSync } from 'node:fs'
import { leanTheorems, leanFiles, leanSource, ledger as __ledger, live as __live } from '../src/api/index.ts'

const T = leanTheorems() as { name: string; file: string; namespace: string; tactic: string; statement: string }[]
const LIVE = new Set((__live(__ledger()) as { key: string }[]).map((e) => e.key))
const FILES = leanFiles() as string[]

const header = (f: string, field: string) => leanSource(f).match(new RegExp(`^--\\s*${field}:\\s*(.+)$`, 'm'))?.[1]?.trim() ?? ''
const meta = new Map(FILES.map((f) => [f, {
  cls: header(f, 'prior_art'), own: header(f, 'prior_art_own'), pool: header(f, 'prior_art_pool'), wing: header(f, 'wing'),
}]))

/** ── FILES WHOSE SUBJECT IS THIS DEPOSIT'S OWN RECORD, DECLARED RATHER THAN DETECTED ─────────────────────
 *  The first version of this queue put nine `priorart.lean` theorems at the top — statements about whether
 *  this tree's own prior-art table classifies its own sources. There is no literature to find for those;
 *  searching OEIS for "an_unsearched_source_claims_nothing" is not a search.
 *
 *  TWO MECHANICAL SIGNALS WERE TRIED AND BOTH FAILED, and they are recorded here because the failure is the
 *  reason this list is hand-written. (1) "does the statement contain a numeral or an operator" — priorart's
 *  statements contain `== 1` and `== 0`, so it separated nothing. (2) "how many files mention the
 *  identifiers this statement uses" — `sources` reaches 3 files, but so does `solutions` in dimensions.lean,
 *  which is an ordinary file-local helper inside a perfectly searchable claim about Planck exponents. The
 *  signal confused "bookkeeping" with "local definition", and shipping it would have demoted real
 *  mathematics to make a ranking look clever.
 *
 *  So it is declared, with a reason each, the way src/api/gates.ts declares gates nothing runs. A named
 *  hand-list that says why beats a mechanical signal that is wrong. */
const SELF_REFERENTIAL: Record<string, string> = {
  'priorart.lean': 'its subject is this deposit\'s own prior-art table — whether ITS sources are classified, not whether any mathematics has an earlier author',
  'ledgerclaims.lean': 'its subject is what this deposit\'s own ledger claims; there is no external literature about this tree\'s bookkeeping',
  'authority.lean': 'its subject is who may speak for this deposit — a rule about the record, not a proposition anyone else has stated',
}

const nov = existsSync('src/proof/novelty.json') ? JSON.parse(readFileSync('src/proof/novelty.json', 'utf8')) : {}
const searched = new Set(Object.keys(nov))
const keyOf = (t: { name: string }) => [...LIVE].find((k) => k.endsWith('_' + t.name)) ?? ''

/** How many theorems share this file — a family the tree has grown is a family it thinks in. */
const famSize = new Map<string, number>()
for (const t of T) famSize.set(t.file, (famSize.get(t.file) ?? 0) + 1)

type Cand = { t: typeof T[number]; score: number; why: string[] }
const cands: Cand[] = []
for (const t of T) {
  const m = meta.get(t.file)!
  const key = keyOf(t)
  const why: string[] = []
  let score = 0
  // The file claims something of its own — that is where an earlier author would actually matter.
  if (m.own) { score += 3; why.push('file declares its own work') }
  // Nobody has looked. This is the whole point of the queue.
  if (!searched.has(key) && key) { score += 3; why.push('no search recorded') }
  // An unbounded pool means the tree could not name the prior art exhaustively, so a search can still find one.
  if (m.pool === 'unbounded') { score += 1; why.push('prior-art pool unbounded') }
  // A file with no classification at all has not even been asked the question.
  if (!m.cls || m.cls === 'unclassified') { score += 2; why.push('file unclassified for prior art') }
  // A grown family is a structure the deposit reasons in; a singleton is usually an aside.
  if ((famSize.get(t.file) ?? 0) >= 8) { score += 1; why.push('family at octave scale') }
  // Proved for every value rather than by exhaustion — a general statement is likelier to have a literature.
  if (t.tactic !== 'by decide') { score += 1; why.push('general, not by exhaustion') }
  if (!key) why.push('NOT SEALED')
  // Declared above: nothing external to find, so it never enters the queue however it scores.
  if (SELF_REFERENTIAL[t.file]) continue
  cands.push({ t, score, why })
}

/** A QUEUE THAT RANKS EVERYTHING EQUALLY IS NOT A RANKING. If every candidate scores the same, or the
 *  corpus reads as empty, the signals have collapsed and this would print a work plan built on nothing. */
const spread = new Set(cands.map((c) => c.score)).size
if (cands.length < 100 || spread < 3) {
  console.log(`✗ discoveries: ${cands.length} candidate(s) across ${spread} distinct score(s) — the signals have`)
  console.log(`  collapsed, and a queue that cannot tell its own entries apart is not a queue.`)
  process.exit(1)
}

cands.sort((a, b) => b.score - a.score || a.t.file.localeCompare(b.t.file) || a.t.name.localeCompare(b.t.name))
const ownFiles = FILES.filter((f) => meta.get(f)!.own)
const unsearchedOwn = cands.filter((c) => meta.get(c.t.file)!.own && !searched.has(keyOf(c.t)))

console.log(`  ${T.length} theorems · ${searched.size} novelty search(es) recorded (${(100 * searched.size / T.length).toFixed(1)}%)`)
console.log(`  ${ownFiles.length} of ${FILES.length} files declare prior_art_own · ${unsearchedOwn.length} of their theorems have no search`)
console.log(`  ${cands.filter((c) => !keyOf(c.t)).length} candidate(s) are not sealed · score spread ${spread}`)
console.log(`  ${T.length - cands.length} theorem(s) excluded as self-referential: ${Object.keys(SELF_REFERENTIAL).join(', ')} — nothing external to find`)
console.log()
const show = process.argv.includes('--all') ? cands : cands.slice(0, 20)
for (const c of show) {
  console.log(`  ${String(c.score).padStart(2)}  ${c.t.file.replace('.lean', '').padEnd(14)} ${c.t.name.slice(0, 58)}`)
  console.log(`      ${c.why.join(' · ')}`)
}
console.log(`\n  showing ${show.length} of ${cands.length}${process.argv.includes('--all') ? '' : ' — run with --all for the rest'}`)
// THE RANKING IS COARSER THAN A SORTED LIST LOOKS, and src/proof/ranking.lean counts exactly how much:
// six binary signals make 64 distinguishable states and this scoring collapses them onto 12 scores, with
// NINE different signal sets sharing the score 4, and nine more sharing 5, 6 and 7. That is the middle of
// this queue, where most theorems sit. Only 0 and 11 identify their evidence uniquely. Printed here
// because a reader meets the list, not the theorem.
console.log(`  ORDINAL ONLY: 64 signal states collapse onto 12 scores — nine sets share each of 4, 5, 6, 7.`)
console.log(`  Only the extremes are unambiguous. See src/proof/ranking.lean, which decides it.`)
console.log(`  A RANK IS NOT A NOVELTY CLAIM. This orders where to look; only a performed search, recorded`)
console.log(`  with its queries and results, can say whether a statement has an earlier author. Run`)
console.log(`  \`npm run novelty\` to perform them — it reaches five registries, so no build chain runs it.`)
