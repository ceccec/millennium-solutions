#!/usr/bin/env node
// Content-addressed release orchestration (idempotent).
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { toUuid, merkleFold } from '../src/0/index.ts'

const SKIP_DIR = new Set(['node_modules', '.git', 'cache', 'dist'])
function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) { if (!SKIP_DIR.has(name)) walk(p, acc) }
    else acc.push(p)
  }
  return acc
}
// Version: explicit arg wins; otherwise DERIVE the next patch from the latest tag.
// (Never default to v1.0.0 — that would re-tag an already-published release.)
function nextVersion() {
  try {
    const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
    const last = tags[tags.length - 1]
    const m = last && last.match(/^v(\d+)\.(\d+)\.(\d+)$/)
    if (m) {
      // single-digit odometer: components are 0..9; roll over at 9 (patch → minor → major).
      let maj = +m[1], min = +m[2], pat = +m[3] + 1
      if (pat > 9) { pat = 0; min++ }
      if (min > 9) { min = 0; maj++ }
      return 'v' + maj + '.' + min + '.' + pat
    }
  } catch { /* no repo/tags yet */ }
  return 'v1.0.0' // first release only
}
const V = process.argv[2] || nextVersion()

// Gate: every version component is a SINGLE DIGIT (0..9) — the vortex odometer, enforced.
// (Roll over at 9; the historical 1.0.10..57 predate this rule and remain as immutable history.)
{
  const vm = V.match(/^v(\d+)\.(\d+)\.(\d+)$/)
  if (!vm || [vm[1], vm[2], vm[3]].some((x) => +x > 9)) {
    console.error('release: ' + V + ' violates the single-digit rule (each of major.minor.patch must be 0..9; roll over at 9).')
    process.exit(1)
  }
}
const files = walk('.').sort()
const address = merkleFold(files.map(f => toUuid(f + ':' + readFileSync(f))))
console.log('content-addressed:', files.length, 'files → root', address)

// Useless work drains tokens: refuse to mint a new version for identical content.
try {
  const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
  const last = tags[tags.length - 1]
  if (last) {
    const msg = execSync("git for-each-ref '--format=%(contents)' refs/tags/" + last, { encoding: 'utf8' })
    if (msg.includes(address)) { console.log('no delta — ' + last + ' already carries ' + address.slice(0, 13) + '…; skipping (no token drained).'); process.exit(0) }
  }
} catch { /* no repo/tags yet */ }

const sh = (c) => { console.log('$ ' + c); return execSync(c, { stdio: 'inherit' }) }
const q = (c) => { try { execSync(c, { stdio: 'ignore' }) } catch {} }
let repo = false
try { execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' }); repo = true } catch {}
if (!repo) { sh('git init -q'); sh('git config user.name "Tsvetan Rouschev"'); sh('git config user.email "ceci@psg.bg"') }
sh('git add -A')
q(`git commit -q -m "release ${V} — content-address ${address}"`)   // no-op if unchanged
q(`git tag -d ${V}`)                                              // re-tag (unpublished)
sh(`git tag -a ${V} -m "signed: Singularity \u00b7 content-address ${address}"`)
console.log(`\n\u2713 ${V} → content-address ${address}`)
