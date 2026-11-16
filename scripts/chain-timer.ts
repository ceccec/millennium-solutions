#!/usr/bin/env node
/** ── CHAIN-TIMER — where the ship's minutes go, measured on the chain as it really runs ─────────────────────
 *
 *  Measured 2026-11-16: one `next` ran 31 minutes (17:42 → 18:13) and refused at a gate near its end, and
 *  nothing said which step took the time — the chain prints verdicts, never durations. Re-running its steps one
 *  by one would change how they run (npm's PATH, env-prefixed steps, pre/post hooks); this times it unchanged.
 *
 *  As a preload (NODE_OPTIONS=--import=<abs>/scripts/chain-timer.ts with CHAIN_TIME=<file.jsonl>) every node
 *  process in the chain — npm itself, each script, nested ones — appends {pid, parent, start, end, code, argv}
 *  when it exits. The parent travels in the environment (CHAIN_TIME_PARENT), so a step run through `sh -c`
 *  still finds the node process above it; nesting by time alone would read parallel siblings as children.
 *
 *      node scripts/chain-timer.ts run <command…>   run it with the timer loaded, then rank its steps
 *      node scripts/chain-timer.ts report <file>     rank the steps of an earlier run
 *      npm run chain:time                            the ship's gates (orchestrate --gates-only), timed — no release
 *
 *  SELF time is a step's wall time less the union of its timed children's, so `npm run docs:build` keeps the
 *  vitepress build (which resets NODE_OPTIONS and so is not timed on its own) and gives up the scripts it ran.
 *  A process killed by a signal writes nothing; the report ranks what exited. The timer never changes a verdict.
 */
import { appendFileSync, readFileSync, mkdtempSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { isMainThread } from 'node:worker_threads'

type Rec = { pid: number; parent: number; start: number; end: number; code: number; argv: string }

const SELF = fileURLToPath(import.meta.url)
const isMain = !!process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url

// ── preload: record this process ──
if (process.env.CHAIN_TIME && isMainThread && !isMain) {
  const out = process.env.CHAIN_TIME
  const parent = Number(process.env.CHAIN_TIME_PARENT || 0)
  process.env.CHAIN_TIME_PARENT = String(process.pid)
  const cwd = process.cwd() + '/'
  // `node -e` has no script in argv — name it by its code, or every eval step merges into one blank row
  const ev = process.execArgv.findIndex((a) => a === '-e' || a === '--eval')
  const argv = (process.argv.length > 1
    ? process.argv.slice(1).map((a) => a.split(cwd).join('')).join(' ')
    : ev >= 0 ? '-e ' + (process.execArgv[ev + 1] ?? '').replace(/\s+/g, ' ') : '(node)')
    .replace(/^\S*npm-cli\.js\b/, 'npm')
  process.on('exit', (code) => {
    const end = performance.timeOrigin + performance.now()
    try { appendFileSync(out, JSON.stringify({ pid: process.pid, parent, start: performance.timeOrigin, end, code, argv }) + '\n') } catch { /* a lost record, never a changed verdict */ }
  })
}

const dur = (ms: number) => {
  if (ms < 10_000) return `${(ms / 1000).toFixed(1)}s`
  const s = Math.round(ms / 1000)
  return s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`
}

// total length of the union of intervals — parallel children share wall time, they do not add to it
const covered = (iv: [number, number][]) => {
  let total = 0, s = 0, e = -1
  for (const [a, b] of [...iv].sort((x, y) => x[0] - y[0])) {
    if (a > e) { if (e > s) total += e - s; s = a; e = b }
    else e = Math.max(e, b)
  }
  return total + (e > s ? e - s : 0)
}

const report = (file: string) => {
  const recs: Rec[] = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l))
  if (!recs.length) { console.log(`chain-time: no node process exited under the timer (${file})`); return }
  const kids = new Map<number, Rec[]>()
  for (const r of recs) kids.set(r.parent, [...(kids.get(r.parent) ?? []), r])
  const pids = new Set(recs.map((r) => r.pid))
  const roots = recs.filter((r) => !pids.has(r.parent))
  const wall = Math.max(...roots.map((r) => r.end)) - Math.min(...roots.map((r) => r.start))
  const steps = new Map<string, { self: number; runs: number }>()
  for (const r of recs) {
    const self = Math.max(0, r.end - r.start - covered((kids.get(r.pid) ?? []).map((k) => [k.start, k.end])))
    const s = steps.get(r.argv) ?? { self: 0, runs: 0 }
    s.self += self; s.runs++
    steps.set(r.argv, s)
  }
  const ranked = [...steps].sort((a, b) => b[1].self - a[1].self)
  const TOP = 20
  console.log(`\nchain-time: ${recs.length} node process(es) · wall ${dur(wall)} · ${file}`)
  console.log('     self   share  runs  step')
  for (const [argv, s] of ranked.slice(0, TOP)) {
    const note = /^npm run docs:build\b/.test(argv) ? '   ← holds the vitepress build itself' : ''
    console.log(`  ${dur(s.self).padStart(7)}  ${(100 * s.self / wall).toFixed(1).padStart(5)}%  ${String(s.runs).padStart(4)}  ${argv.slice(0, 90)}${note}`)
  }
  const rest = ranked.slice(TOP)
  if (rest.length) console.log(`  ${dur(rest.reduce((t, [, s]) => t + s.self, 0)).padStart(7)}          the other ${rest.length} step(s)`)
  const failed = recs.filter((r) => r.code !== 0)
  for (const f of failed) console.log(`  exited ${f.code}: ${f.argv.slice(0, 100)}`)
}

if (isMain) {
  const [mode, ...rest] = process.argv.slice(2)
  if (mode === 'report' && rest[0]) report(rest[0])
  else if (mode === 'run' && rest.length) {
    const file = join(mkdtempSync(join(tmpdir(), 'chain-time-')), 'chain.jsonl')
    const r = spawnSync(rest[0], rest.slice(1), {
      stdio: 'inherit',
      env: { ...process.env, CHAIN_TIME: file, CHAIN_TIME_PARENT: '0', NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --import=${SELF}`.trim() },
    })
    report(file)
    process.exitCode = r.status ?? 1
  } else console.log('usage: node scripts/chain-timer.ts run <command…> | report <file.jsonl>')
}
