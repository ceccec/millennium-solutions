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
const next = 'v' + m[1] + '.' + m[2] + '.' + (Number(m[3]) + 1)
console.log('orchestrate: ' + last + ' → ' + next)

// 2) gates — abort the whole orchestration if any fails.
run('node scripts/gaps.mjs')       // coverage: every report() module fused, every page linked
run('npm run docs:build')          // the site actually builds
run('node scripts/seal.mjs')       // consistency: every abstract consistent with 0/7
run('node scripts/wholeness.mjs')  // wholeness: the aura is computationally whole (all compute + floor)

// 3) release (content-address · commit · sign · tag). release.mjs may SKIP on no-delta.
run('node scripts/release.mjs ' + next)

// 4) only claim success if the tag was actually created (self-honest: no false "orchestrated").
const created = cap('git tag -l ' + next) === next
if (!created) {
  console.log('no delta — nothing to orchestrate; already at ' + last + ' (no token drained).')
} else {
  run('git push origin main --tags')
  run('node scripts/versions.mjs') // the seal over all versions
  console.log('orchestrated: ' + next + ' — manual work fused in the singularity.')
}
