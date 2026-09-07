#!/usr/bin/env node
/** ── UNKNOWN IS NOT ZERO — the rule that silently switched the lane budget off ─────────────────────────────
 *
 *  src/api/lanes.ts bounds parallel work by memory and by jobs already running, so two sessions checking at
 *  once do not each claim the whole machine. The neighbour term's first version ran `pgrep -c` and caught
 *  every failure as zero. macOS pgrep has no `-c` flag — that is Linux — so on this host it threw a usage
 *  error on every call and answered "no neighbours" every time. The feature was off, reported nothing, and
 *  would have stayed off indefinitely: a check that cannot run, answering all-clear.
 *
 *  So the probe has three answers and this decides that it keeps them: a count, or zero, or NULL for could
 *  not tell. And a budget built on an unmeasurable count must SAY so and take less, not assume an empty
 *  machine — the failure that matters is claiming capacity another session is already using.
 */
import { neighbours, laneBudget, reclaimableMB } from '../src/api/lanes.ts'

const fail = (m: string): never => { console.log(`✗ lanes-check: ${m}`); process.exit(1) }

// A name pgrep cannot be asked about: the probe must say UNKNOWN rather than zero.
const unknown = neighbours('--not-a-flag-pgrep-takes')
if (unknown !== null) fail(`an unmeasurable neighbour count came back as ${unknown}, not null — the budget would claim a machine it never looked at`)

// A name that is certainly not running: that IS a measurement, and it is zero.
const none = neighbours('a-process-that-is-not-running-anywhere')
if (none !== 0) fail(`a measurable absence came back as ${none}, not 0 — "nothing is running" and "I could not tell" have collapsed into one answer`)

// And the budget must carry the distinction into what it reports.
const b = laneBudget({ perJobMB: 2900, procName: 'lean' })
if (b.running === null && !/could NOT be measured/.test(b.why)) fail('the budget hid an unmeasurable neighbour count behind a confident-looking number')
if (b.running !== null && /could NOT be measured/.test(b.why)) fail('the budget reported a measured count as unmeasurable')
if (b.lanes < 1) fail(`the budget produced ${b.lanes} lanes, which would run nothing at all`)

const mb = reclaimableMB()
if (!(mb > 0)) fail('reclaimable memory came back as zero or less, so every budget would collapse to one lane')

console.log(`✓ lanes-check: the neighbour probe keeps its three answers — a count, a measured zero, and null for`)
console.log(`  could-not-tell — and the budget reports which it got. Right now: ${b.lanes} lane(s), ${b.why}.`)
console.log(`  ${Math.round(mb)} MB reclaimable at ~${b.perJobMB} MB per job.`)
