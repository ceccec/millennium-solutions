/** ── HOW MANY JOBS THIS MACHINE CAN ACTUALLY HOLD, WHICH IS NOT HOW MANY CORES IT HAS ─────────────────────
 *
 *  `availableParallelism()` answers "how many things can run at once" and says nothing about whether they
 *  FIT. On this host that gap is not academic — measured, one `lean` process elaborating families.lean
 *  peaks at about 2.9 GB, so ten lanes is 29 GB of demand on a 32 GB machine from a single session. The
 *  machine does not refuse; it swaps, and the run gets slower while every core reads as busy.
 *
 *  A peer session on uuidna reported a window where this host sat at 88% system time against 9% user with
 *  swap climbing — ten times more kernel than work, a machine moving pages rather than computing — and
 *  named the cause as a capacity function that is honest per process and blind to its neighbours. I could
 *  not verify that recording: the host has rebooted since and currently shows no swap in use at all. What I
 *  could verify is the arithmetic, and the arithmetic is worse than the framing, because cores were never
 *  the binding constraint. Memory is.
 *
 *  So a lane budget is the smallest of three numbers, and the third is the neighbour term:
 *
 *    cores            what can run at once
 *    memory / perJob  what fits, from memory that is actually reclaimable
 *    minus neighbours jobs of this kind already running, whoever started them
 *
 *  THE NEIGHBOUR TERM NEEDS NO AGREEMENT BETWEEN SESSIONS. A shared budget would have to be negotiated,
 *  which means a protocol, which means every repo adopting it before any repo benefits. Yielding to jobs
 *  that are already running is unilateral: if each session does it alone, the sum is bounded anyway.
 */
import { availableParallelism, totalmem } from 'node:os'
import { execFileSync } from 'node:child_process'

/** Memory a checker may actually take: free plus the pages the OS can reclaim without swapping. `freemem()`
 *  counts only the free list and reports a few gigabytes on a machine with twenty reclaimable — budgeting
 *  from it would refuse lanes the machine can easily afford. */
export const reclaimableMB = (): number => {
  try {
    const out = String(execFileSync('vm_stat', [], { stdio: 'pipe' }))
    const page = Number(out.match(/page size of (\d+)/)?.[1] ?? 4096)
    const pages = (k: string) => Number(out.match(new RegExp(`Pages ${k}:\\s+(\\d+)`))?.[1] ?? 0)
    const usable = pages('free') + pages('inactive') + pages('speculative') + pages('purgeable')
    if (usable > 0) return (usable * page) / (1024 * 1024)
  } catch { /* not macOS, or vm_stat unavailable — fall through */ }
  return (totalmem() / (1024 * 1024)) / 2   // half of physical: a guess, and named as one
}

/** Jobs of this kind already running, whoever started them — or NULL when it could not be measured.
 *
 *  The first version ran `pgrep -c`, counted the output, and caught every failure as zero. macOS pgrep has
 *  no `-c` flag — that is Linux — so it printed a usage error to stderr, threw, and the catch reported "no
 *  neighbours" on every call. The term never fired once, and nothing said so: a check that cannot run,
 *  answering all-clear. Three answers, not two, is the rule that catches this — none, some, and unknown are
 *  different, and only the first two are a measurement. */
export const neighbours = (procName: string): number | null => {
  try {
    const out = String(execFileSync('pgrep', ['-x', procName], { stdio: ['ignore', 'pipe', 'ignore'] }))
    return out.split('\n').filter((l) => l.trim().length).length
  } catch (e: any) {
    // pgrep exits 1 with NO output when nothing matched: that is a real measurement of zero.
    if (e?.status === 1 && !String(e?.stdout ?? '').trim()) return 0
    return null   // anything else — missing pgrep, wrong flag, no permission — is UNKNOWN, not zero
  }
}

export type Budget = { lanes: number; cores: number; byMemory: number; running: number | null; perJobMB: number; why: string }

/** The lane count, with every term it was derived from, so a caller can print WHY rather than a bare number. */
export const laneBudget = (opts: { perJobMB: number; procName: string; envLanes?: string }): Budget => {
  const cores = availableParallelism?.() ?? 4
  const forced = Number(opts.envLanes ?? '')
  const perJobMB = Math.max(1, opts.perJobMB)
  const byMemory = Math.max(1, Math.floor(reclaimableMB() / perJobMB))
  const running = neighbours(opts.procName)
  // UNKNOWN IS NOT ZERO. When the neighbour count cannot be measured the budget halves rather than assuming
  // the machine is empty — the failure that matters here is claiming capacity somebody else is already using.
  const base = Math.min(cores, byMemory)
  const lanes = forced > 0 ? forced
    : running === null ? Math.max(1, Math.floor(base / 2))
    : Math.max(1, base - running)
  const why = forced > 0
    ? `forced to ${forced} by the environment`
    : running === null
      ? `min(cores ${cores}, memory ${byMemory} at ~${perJobMB}MB each) halved — the neighbour count could NOT be measured on this host`
      : `min(cores ${cores}, memory ${byMemory} at ~${perJobMB}MB each) minus ${running} already running`
  return { lanes, cores, byMemory, running, perJobMB, why }
}
