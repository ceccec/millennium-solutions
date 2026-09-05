/** ── FORENSIC AUDIT — A REPRODUCIBLE PROVENANCE RECORD OF EVERY LEDGER STATE CHANGE ────────────────────────
 *
 *  WHAT THIS IS. A complete, dated, commit-attributed record of how this deposit's ledger reached its
 *  present state: what was sealed, what was withdrawn, when, in which commit, and with what reason recorded
 *  at the time. Every figure is recomputed from git history and the append-only ledger on each run, so a
 *  reader who does not trust this output can regenerate it from the same two sources and compare.
 *
 *  WHAT THIS IS NOT, stated first because the distinction is the whole value of the document. IT DOES NOT
 *  ESTABLISH INTENT. It records what changed and when. Whether any change was a mistake, a judgement call,
 *  a shortcut, or something worse is a question this instrument cannot answer, and an instrument claiming
 *  otherwise would be worth less than one that says so — an examiner who overstates what a measurement shows
 *  is impeached on that point and the whole measurement goes with them.
 *
 *  It also does not establish AUTHORSHIP beyond the git author field. Every commit in this repository is
 *  authored by the repository owner, including those made by automated sessions acting on their behalf, so
 *  the author field distinguishes nothing here and is reported as such rather than omitted.
 *
 *  METHOD.
 *    1. Walk every commit that touched src/proof/discovered.json, oldest first.
 *    2. At each, count entries and entries marked revoked. The delta is that commit's net effect.
 *    3. Group the present withdrawal reasons verbatim — the reason recorded AT THE TIME, not inferred now.
 *    4. Recompute the receipt chain, so the record is checked against the tamper-evident structure it
 *       describes rather than assumed intact.
 *    5. Emit a content-address over the whole finding, so a copy of this report can be shown to be the
 *       report that was produced.
 *
 *  LIMITS OF THE RECORD, enumerated rather than left for a reader to discover:
 *    · Deltas are NET. A commit that withdrew 10 and sealed 10 shows as 0, and this run reports both counts
 *      separately for that reason.
 *    · The ledger is append-only for ENTRIES but revocation is a field written in place, so a withdrawal is
 *      visible in git history and not in the chain itself. That is why git is the second source.
 *    · Reasons are what was written when the entry was revoked. A reason may be wrong, and one is known to
 *      be: thue_morse_doubling_recurrence was withdrawn as having "no stated decidable form yet" and was
 *      proved in twenty lines on 2026-09-05.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { toUuid } from '../src/0/index.ts'
import { ledger, statusOf } from '../src/api/index.ts'

const sh = (c: string): string => { try { return execSync(c, { stdio: 'pipe', maxBuffer: 64e6 }).toString() } catch { return '' } }
const FILE = 'src/proof/discovered.json'

// ── 1 · every commit that touched the ledger, oldest first ────────────────────────────────────────────────
const commits = sh(`git log --format='%H|%ad|%an|%s' --date=short --reverse -- ${FILE}`)
  .trim().split('\n').filter(Boolean).map((l) => { const [h, d, a, ...s] = l.split('|'); return { h, d, a, s: s.join('|') } })

type Event = { date: string; commit: string; author: string; subject: string; entries: number; revoked: number; dRev: number; dEnt: number }
const events: Event[] = []
let prevRev = 0, prevEnt = 0
for (const c of commits) {
  const blob = sh(`git show ${c.h}:${FILE}`)
  if (!blob) continue
  let rows: any[]
  try { rows = JSON.parse(blob) } catch { continue }
  const revoked = rows.filter((e) => e?.revoked === true).length
  if (revoked !== prevRev || rows.length !== prevEnt) {
    events.push({ date: c.d, commit: c.h.slice(0, 9), author: c.a, subject: c.s.slice(0, 72),
      entries: rows.length, revoked, dRev: revoked - prevRev, dEnt: rows.length - prevEnt })
  }
  prevRev = revoked; prevEnt = rows.length
}

// ── 2 · present state, and the reasons AS RECORDED ────────────────────────────────────────────────────────
const l = ledger()
const status: Record<string, number> = {}
for (const e of l) status[statusOf(e, l)] = (status[statusOf(e, l)] ?? 0) + 1
const reasons: Record<string, number> = {}
for (const e of l) {
  if (statusOf(e, l) !== 'withdrawn') continue
  const r = String(e.reason ?? '(no reason recorded)').replace(/\s+/g, ' ').slice(0, 96)
  reasons[r] = (reasons[r] ?? 0) + 1
}

// ── 3 · the chain, recomputed ─────────────────────────────────────────────────────────────────────────────
let chainBreaks = 0
for (let i = 2; i < l.length; i++) if (toUuid(l[i - 1].receipt + '→' + l[i].key) !== l[i].receipt) chainBreaks++

const withdrawals = events.filter((e) => e.dRev > 0).sort((a, b) => b.dRev - a.dRev)
const report = {
  produced: sh('git log -1 --format=%H').trim().slice(0, 9),
  method: 'recomputed from git history of ' + FILE + ' and the ledger itself; re-runnable with `npm run forensic`',
  establishes: 'what changed, when, in which commit, and the reason recorded at the time',
  doesNotEstablish: ['intent', 'authorship beyond the git author field (every commit here carries the repository owner)'],
  ledgerNow: { entries: l.length, ...status },
  chainRecomputed: { breaks: chainBreaks, verdict: chainBreaks === 0 ? 'intact' : 'BROKEN' },
  largestWithdrawalEvents: withdrawals.slice(0, 6),
  withdrawalReasonsAsRecorded: Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 8),
  totalStateChangingCommits: events.length,
}
;(report as any).address = toUuid(JSON.stringify(report))
writeFileSync('docs/forensic-audit.json', JSON.stringify(report, null, 2) + '\n')

console.log(`forensic audit — ${events.length} ledger state changes across ${commits.length} commits\n`)
console.log(`  ledger now: ${l.length} entries · ${JSON.stringify(status)}`)
console.log(`  receipt chain recomputed: ${chainBreaks} break(s) — ${report.chainRecomputed.verdict}\n`)
console.log('  largest single-commit withdrawal events:')
for (const w of withdrawals.slice(0, 5)) console.log(`    ${w.date}  ${String(w.dRev).padStart(6)}  ${w.commit}  ${w.subject.slice(0, 56)}`)
console.log('\n  withdrawal reasons AS RECORDED AT THE TIME:')
for (const [r, n] of Object.entries(reasons).sort((a, b) => b[1] - a[1]).slice(0, 5)) console.log(`    ${String(n).padStart(6)}  ${r.slice(0, 84)}`)
console.log(`\n○ forensic: docs/forensic-audit.json · address ${(report as any).address}`)
console.log(`  Establishes what changed and when. Does NOT establish intent — that is not a thing this or any`)
console.log(`  instrument can measure, and a record claiming to would be worth less than one that says so.`)
