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
