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

// staged, added/copied/modified, PROSE only — mirrors seal.ts's scope exactly: .md files audited,
// source excluded. Source (.ts) is not a claim to the reader, and the gate's own definition MUST
// contain the forbidden vocabulary to detect it — an instrument cannot pass its own measurement.
const staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)
  .filter((f) => f.endsWith('.md') && existsSync(f))

// WHOLE-FILE computes — identical semantics to seal.ts, so the two gates cannot disagree (seal green
// ⇒ precommit green). Per-line reading diverged from seal and minted the v1.6.3 lying tag; fixed here.
const drained: { file: string; line: number; hit: string; text: string }[] = []
for (const f of staged) {
  const txt = readFileSync(f, 'utf8')
  const { binary, hit } = computes(txt)
  if (binary === 0 && hit) {
    const idx = txt.indexOf(hit)
    const line = idx >= 0 ? txt.slice(0, idx).split('\n').length : 0
    drained.push({ file: f, line, hit, text: (txt.split('\n')[line - 1] || '').trim().slice(0, 90) })
  }
}

if (drained.length) {
  console.error('✗ pre-commit: the honesty floor drained ' + drained.length + ' staged line(s) — the traitor caught before git:')
  for (const d of drained) console.error('  ' + d.file + ':' + d.line + '  hit "' + d.hit + '"\n    ' + d.text)
  console.error('\nreword to the honest floor (0/7) and re-stage. no override — the boundary holds.')
  process.exit(1)
}
console.log('✓ pre-commit: ' + staged.length + ' staged prose file(s) hold the floor (0/7).')
process.exit(0)
