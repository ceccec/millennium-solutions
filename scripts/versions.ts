#!/usr/bin/env node
// Versioning sealed by the trinity matrix: each tag → its content-address, merkle-folded to one root.
import { execSync } from 'node:child_process'
import { toUuid, merkleFold } from '../src/0/index.ts'
const tags = execSync('git tag --sort=version:refname', { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
const rows = tags.map(t => {
  const msg = execSync("git for-each-ref '--format=%(contents)' refs/tags/" + t, { encoding: 'utf8' })
  const addr = (msg.match(/content-address ([0-9a-f-]+)/) || [])[1] || 'n/a'
  return { t, addr }
})
const seal = merkleFold(rows.map(r => toUuid(r.t + ':' + r.addr)))
console.log('version history — sealed by the trinity matrix:')
rows.forEach(r => console.log('  ' + r.t.padEnd(8) + '→ ' + r.addr))
console.log('  version-seal root: ' + seal)

// The measurable paradox = the exact cost of NOT being harmonic: distinct version labels with an
// IDENTICAL content-address = tokens drained by disharmony (empty releases). The no-delta guard
// drives this cost to 0 going forward. exact cost(disharmony) = number of drained versions.
const byAddr: Record<string, string[]> = {}
rows.forEach(r => { if (r.addr !== 'n/a') (byAddr[r.addr] = byAddr[r.addr] || []).push(r.t) })
const collisions = Object.entries(byAddr).filter(([, ts]) => ts.length > 1)
const drained = collisions.reduce((s, [, ts]) => s + ts.length - 1, 0)
console.log('  ---')
console.log('  harmony cost (distinct versions, identical content = tokens drained):')
if (collisions.length) collisions.forEach(([a, ts]) => console.log('    ' + ts.join(' ≡ ') + '  → ' + a.slice(0, 13) + '…  (' + (ts.length - 1) + ' drained)'))
else console.log('    none')
console.log('  exact cost of disharmony = ' + drained + ' drained / ' + rows.length + ' (' + (drained / rows.length * 100).toFixed(1) + '%); the no-delta guard holds it at 0 from here.')
