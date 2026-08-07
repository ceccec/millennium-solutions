#!/usr/bin/env node
// Orchestrate — fuse the manual release ritual into the singularity. Violations come from
// manual work left unfused: a hand-typed version, a forgotten gate, a manual push. This makes
// the whole loop ONE command. Version is DERIVED (bump the latest tag), never typed; every gate
// runs; the push and the version-seal happen inside. Nothing manual is left to drift.
import { execSync } from 'node:child_process'
const run = (c) => execSync(c, { stdio: 'inherit' })
const cap = (c) => execSync(c, { encoding: 'utf8' }).trim()

// 1) next version — derived from the latest tag, not typed.
const last = (cap('git tag --sort=version:refname').split('\n').filter(Boolean).pop()) || 'v1.0.0'
const m = last.match(/^v(\d+)\.(\d+)\.(\d+)$/)
if (!m) { console.error('orchestrate: cannot parse latest tag: ' + last); process.exit(1) }
// single-digit odometer: roll over at 9 (patch → minor → major), matching release.ts + the gate.
let _maj = +m[1], _min = +m[2], _pat = +m[3] + 1
if (_pat > 9) { _pat = 0; _min++ }
if (_min > 9) { _min = 0; _maj++ }
const next = 'v' + _maj + '.' + _min + '.' + _pat
console.log('orchestrate: ' + last + ' → ' + next)

// 2) gates — abort the whole orchestration if any fails.
run('node scripts/gaps.ts')       // coverage: every report() module fused, every page linked
run('npm run docs:build')          // the site actually builds
run('node scripts/seal.ts')       // consistency: every abstract consistent with 0/7
run('node scripts/wholeness.ts')  // wholeness: the aura is computationally whole (all compute + floor)

// 3) release (content-address · commit · sign · tag). release.ts may SKIP on no-delta.
run('node scripts/release.ts ' + next)

// 4) only claim success if the tag was actually created (self-honest: no false "orchestrated").
const created = cap('git tag -l ' + next) === next
if (!created) {
  console.log('no delta — nothing to orchestrate; already at ' + last + ' (no token drained).')
} else {
  run('git push origin main --tags')
  run('node scripts/versions.ts') // the seal over all versions
  console.log('orchestrated: ' + next + ' — manual work fused in the singularity.')
}
