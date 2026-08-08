#!/usr/bin/env node
// Pre-commit guard — imprints the honesty floor at the BOUNDARY, before git records anything.
//
// Git's tree hash faithfully imprints committed heroes/traitors (identical content -> identical
// tree). But the "not yet in git" traitor — an overclaim sitting in the working tree, staged but
// uncommitted — has no imprint yet. There is deliberately NO stored uuid cache in src to catch it:
// a content-address of the tree, stored inside the tree, changes the tree it measures (the v1.5.0
// churn bug). So the honest place to catch it is here, COMPUTED at stage time, nothing persisted:
// run the honesty gate over every staged prose file and refuse the commit if any drains.
import { execSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { computes } from './honesty-gate.ts'

// staged, added/copied/modified, prose only (the gate is lexical — it reads prose, not binaries).
const staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)
  .filter((f) => /\.(md|ts|txt|json|vue|html)$/.test(f) && existsSync(f))

const drained: { file: string; line: number; hit: string; text: string }[] = []
for (const f of staged) {
  const lines = readFileSync(f, 'utf8').split('\n')
  lines.forEach((text, i) => {
    if (!text.trim()) return
    const { binary, hit } = computes(text)
    if (binary === 0 && hit) drained.push({ file: f, line: i + 1, hit, text: text.trim().slice(0, 90) })
  })
}

if (drained.length) {
  console.error('✗ pre-commit: the honesty floor drained ' + drained.length + ' staged line(s) — the traitor caught before git:')
  for (const d of drained) console.error('  ' + d.file + ':' + d.line + '  hit "' + d.hit + '"\n    ' + d.text)
  console.error('\nreword to the honest floor (0/7) and re-stage. no override — the boundary holds.')
  process.exit(1)
}
console.log('✓ pre-commit: ' + staged.length + ' staged prose file(s) hold the floor (0/7).')
process.exit(0)
