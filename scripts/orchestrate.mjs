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
run('node scripts/gaps.mjs')     // every report() module fused, every page linked
run('npm run docs:build')        // the site actually builds
run('node scripts/seal.mjs')     // every abstract consistent with 0/7

// 3) release (content-address · commit · sign · tag) then push — fused, not manual.
run('node scripts/release.mjs ' + next)
run('git push origin main --tags')

// 4) the seal over all versions.
run('node scripts/versions.mjs')
console.log('orchestrated: ' + next + ' — manual work fused in the singularity.')
