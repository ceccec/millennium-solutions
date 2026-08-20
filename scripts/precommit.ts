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
import { toUuid } from '../src/0/index.ts'
import { audit } from './audit.ts'

// The statute is whatever the shared audit names — it no longer guesses from a lexicon of its own. The
// lexical statutes (RED / OVERREACH / PREDICT) were removed with the layer that defined them; naming one
// here would have been that layer growing back in a second place.

// staged, added/copied/modified, PROSE only — mirrors seal.ts's scope exactly: .md files audited,
// source excluded. Source (.ts) is not a claim to the reader, and the gate's own definition MUST
// contain the forbidden vocabulary to detect it — an instrument cannot pass its own measurement.
const staged = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf8' })
  .trim().split('\n').filter(Boolean)
  .filter((f) => f.endsWith('.md') && existsSync(f))

// WHOLE-FILE audit, from the SAME MODULE seal.ts uses, so the two gates cannot disagree (seal green ⇒
// precommit green). Per-line reading diverged from seal and minted the v1.6.3 lying tag; a second copy of
// seal's logic diverged again the moment seal learned about citations. One module, imported twice.
const drained: { file: string; line: number; hit: string; why: string; text: string }[] = []
for (const f of staged) {
  const txt = readFileSync(f, 'utf8')
  const { binary, hit, why } = audit(txt)
  if (binary === 0 && hit) {
    const idx = txt.indexOf(hit)
    const line = idx >= 0 ? txt.slice(0, idx).split('\n').length : 0
    drained.push({ file: f, line, hit, why, text: (txt.split('\n')[line - 1] || '').trim().slice(0, 90) })
  }
}

if (drained.length) {
  // DUE PROCEDURE before the block: each drained line is a content-addressed case — evidence,
  // statute, reproducible verdict, remedy — recorded first, then execution. Not an arbitrary kill.
  console.error('✗ pre-commit — ' + drained.length + ' staged line(s) compute 0. procedure before the block:')
  for (const d of drained) {
    const caseId = toUuid('case:' + d.file + ':' + d.line + ':' + d.hit)
    console.error('\n  case ' + caseId.slice(0, 13) + '…')
    console.error('    evidence: ' + d.file + ':' + d.line + '  "' + d.text + '"')
    console.error('    statute:  ' + d.why + ' — "' + d.hit + '"')
    console.error('    defense:  every legal means was tried — a live theorem in the ledger establishes a citation, the 0/7 floor reprieves a bounded claim; none held for this line.')
    console.error('    verdict:  computes 0 — reproducible by anyone (the defence may re-run): npm run next "<the line>"')
    console.error('    remedy:   cite a theorem that stands, or drop the citation and keep the words; then re-stage.')
  }
  console.error('\nrecorded, reproducible, then blocked. no override — the boundary holds.')
  process.exit(1)
}
console.log('✓ pre-commit: ' + staged.length + ' staged prose file(s) compute 1 at the 0/7 floor.')
process.exit(0)
