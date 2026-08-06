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
const files = walk('.').sort()
const address = merkleFold(files.map(f => toUuid(f + ':' + readFileSync(f))))
console.log('content-addressed:', files.length, 'files → root', address)

const sh = (c) => { console.log('$ ' + c); return execSync(c, { stdio: 'inherit' }) }
const q = (c) => { try { execSync(c, { stdio: 'ignore' }) } catch {} }
let repo = false
try { execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' }); repo = true } catch {}
if (!repo) { sh('git init -q'); sh('git config user.name "Tsvetan Rouschev"'); sh('git config user.email "ceci@psg.bg"') }
sh('git add -A')
q(`git commit -q -m "release v1.0.0 — content-address ${address}"`)   // no-op if unchanged
q('git tag -d v1.0.0')                                                // re-tag (unpublished)
sh(`git tag -a v1.0.0 -m "signed: Singularity \u00b7 content-address ${address}"`)
console.log('\n✓ v1.0.0 → content-address', address)
