#!/usr/bin/env node
/** ── CACHE-CLEAN — after a receipt is sealed, give the disk back ─────────────────────────────────────────
 *
 *  Runs from .githooks/post-commit whenever a commit changed src/ledger/discovered.json, i.e. once per sealed
 *  receipt wave, whoever's hand made the commit. It is a steward, not a gate: it never refuses (a post-commit
 *  hook cannot refuse anyway), it prints one line, and it deletes only what is regenerable AND provably ours.
 *
 *  Measured 2026-11-16: the data volume reached 99% (7 GiB free) mid-`next`, during the vitepress build. The
 *  npm content cache alone held 15 GiB, all of it re-downloadable. This repo's own temp dirs were small; the
 *  danger was the shared caches nobody clears, so the global one is cleared when the disk is below the floor.
 *
 *  What it removes:
 *    1. temp dirs THIS repo's scripts create — the prefixes are DERIVED from every `mkdtempSync(join(tmpdir(),
 *       '<prefix>'))` in scripts/*.ts, never typed here — once nothing inside them has been written for
 *       STALE_MIN minutes. A script that crashes before its own rmSync leaves one behind; this collects it.
 *       Another repo's temp dirs are not ours to guess at, so they are never touched.
 *    2. the npm content cache (~/.npm/_cacache) — only while free space is under the floor. `npm cache clean`
 *       removes _cacache alone; packages that running `npm exec` MCP servers use live in ~/.npm/_npx and stay.
 *
 *      node scripts/cache-clean.ts            clean, then report
 *      node scripts/cache-clean.ts --report   report disk only, delete nothing (used by `next --status`)
 *      node scripts/cache-clean.ts --dry      list what would be removed, delete nothing
 *
 *  Env: CACHE_CLEAN_FLOOR_GIB (default 20) — below it the npm cache is cleared and a warning printed.
 */
import { readdirSync, readFileSync, statSync, lstatSync, rmSync, statfsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const GIB = 1024 ** 3, MIB = 1024 ** 2
const FLOOR_GIB = Number(process.env.CACHE_CLEAN_FLOOR_GIB || 20)
const STALE_MIN = 120
const reportOnly = process.argv.includes('--report')
const dry = process.argv.includes('--dry')

const disk = () => {
  const s = statfsSync(process.cwd())
  const free = s.bavail * s.bsize, total = s.blocks * s.bsize
  return { free, total, used: Math.round(100 * (1 - s.bfree / s.blocks)) }
}
const gib = (b: number) => (b / GIB).toFixed(1) + ' GiB'
const diskLine = (d = disk()) => `disk ${gib(d.free)} free of ${gib(d.total)} (${d.used}% used)`

if (reportOnly) { console.log('  disk:             ' + diskLine().slice(5)); process.exit(0) }

// 1. our own stale temp dirs — prefixes derived from the scripts that create them.
const prefixes = [...new Set(readdirSync('scripts').filter((f) => f.endsWith('.ts'))
  .flatMap((f) => [...readFileSync(join('scripts', f), 'utf8').matchAll(/mkdtempSync\(\s*join\(\s*tmpdir\(\)\s*,\s*'([^']+)'\s*\)/g)].map((m) => m[1])))]
  .sort()

// size and newest write time of a tree, without following symlinks out of it
const walk = (p: string): { bytes: number; newest: number } => {
  const st = lstatSync(p)
  if (!st.isDirectory()) return { bytes: st.isSymbolicLink() ? 0 : st.size, newest: st.mtimeMs }
  let bytes = 0, newest = st.mtimeMs
  for (const e of readdirSync(p)) { const r = walk(join(p, e)); bytes += r.bytes; if (r.newest > newest) newest = r.newest }
  return { bytes, newest }
}

const T = tmpdir(), now = Date.now()
let removed = 0, removedBytes = 0, skippedFresh = 0
for (const name of readdirSync(T)) {
  if (!prefixes.some((p) => name.startsWith(p))) continue
  const p = join(T, name)
  try {
    if (!statSync(p).isDirectory()) continue
    const { bytes, newest } = walk(p)
    if (now - newest < STALE_MIN * 60_000) { skippedFresh++; continue }
    if (dry) console.log(`  would remove ${p} (${(bytes / MIB).toFixed(1)} MiB)`)
    else rmSync(p, { recursive: true, force: true })
    removed++; removedBytes += bytes
  } catch { /* vanished or unreadable mid-walk: someone else's moment, leave it */ }
}

// 2. the npm content cache, only under the floor.
let npmNote = 'npm cache kept'
const before = disk()
if (before.free < FLOOR_GIB * GIB) {
  if (dry) npmNote = 'npm cache would be cleared'
  else try {
    execSync('npm cache clean --force', { stdio: 'ignore' })
    npmNote = `npm cache cleared (+${gib(Math.max(0, disk().free - before.free))})`
  } catch { npmNote = 'npm cache clear failed' }
}

const after = disk()
console.log(`  cache-clean: ${diskLine(after)} · ${removed} stale temp dir(s) ${dry ? 'to remove' : 'removed'} (${(removedBytes / MIB).toFixed(1)} MiB)` +
  (skippedFresh ? `, ${skippedFresh} in use kept` : '') + ` · ${npmNote}`)
if (after.free < FLOOR_GIB * GIB) {
  console.log(`  ⚠ disk below the ${FLOOR_GIB} GiB floor after cleaning — the rest is outside this repo's caches ` +
    `(other repos' .claude/worktrees, other sessions' temp, ~/Library/Caches); nothing there is deleted from here`)
}
