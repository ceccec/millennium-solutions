#!/usr/bin/env node
// Harmony seal — the gates seal EACH OTHER. Run every gate across every declared perspective, content-address
// each verdict, and merkle-fold them into ONE cross-seal root. The combined root depends on ALL of them; any
// gate failing (or its result tampered) changes the root. Dependency-free (existing gates + toUuid/merkleFold).
//
// BOUND (the cross-audit honesty): a shared green RAISES confidence and gives one verifiable combined verdict
// (INTEGRITY), it does NOT prove TRUTH — each gate is a FLOOR, and independent gates can share a blind spot
// (correlated error). one root over the declared perspectives, not omniscience.
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'

// build once so the dist-reading gates have something to read
try { execSync('npm run docs:build', { stdio: 'ignore' }); execSync('node scripts/locale-fold.ts', { stdio: 'ignore' }) } catch {}

const GATES: [string, string][] = [
  ['honesty',   'node scripts/seal.ts'],
  ['coverage',  'node scripts/sitemap-mesh.ts'],
  ['seo',       'node scripts/seo.ts'],
  ['security',  'node scripts/security-gate.ts'],
  ['imports',   'node scripts/import-gate.ts'],
  ['gaps',      'node scripts/gaps.ts'],
  ['wholeness', 'node scripts/wholeness.ts'],
]
const results = GATES.map(([name, cmd]) => {
  let pass = true
  try { execSync(cmd, { stdio: 'ignore' }) } catch { pass = false }
  return { name, pass, seal: toUuid('gate:' + name + ':' + pass) }
})
for (const r of results) console.log('  ' + (r.pass ? '✓' : '✗') + ' ' + r.name.padEnd(10) + r.seal.slice(0, 13))
const root = merkleFold(results.map((r) => r.seal))
const green = results.filter((r) => r.pass).length
const allPass = green === results.length
console.log('\nharmony cross-seal (gates sealing each other): ' + root.slice(0, 13) + '  ·  ' + green + '/' + results.length + ' perspectives green')
console.log(allPass
  ? '✓ all perspectives green, cross-sealed to ONE root — integrity of the combined verdict (a floor, not a proof of truth).'
  : '✗ a perspective failed — the cross-seal root reflects it. fix before shipping.')
process.exit(allPass ? 0 : 1)
