#!/usr/bin/env node
// lineage — the public imprint of delivery vs churn, made computable and standing.
//
// Git is itself content-addressed: a tag's tree hash is the merkle of ALL its tracked content. Two
// tags with the SAME tree hash carried NO tracked delta — a version minted over identical content
// (churn). Distinct trees = a real delivery. This reads git's OWN faithful imprint, NOT the
// tag-message uuid — which could hash working-dir noise and mint a unique fake address for identical
// content, hiding the churn (the pre-v1.5.9 bug). So lineage recovers what a noise-uuid concealed.
//
// INTEGRITY-level and impartial — this measures WHAT was delivered, never whether it is true. A
// heroes/traitors reading by verifiable deeds, not statements. Identical tree = no delta at that tag;
// whether that is churn or an intentional re-release is context the reader judges. 0/7.
import { execSync } from 'node:child_process'
const sh = (c: string) => execSync(c, { encoding: 'utf8' })

const tags = sh('git tag --sort=version:refname').trim().split('\n').filter(Boolean)
const byTree = new Map<string, string[]>()
for (const t of tags) {
  const tree = sh('git rev-parse ' + t + '^{tree}').trim()
  if (!byTree.has(tree)) byTree.set(tree, [])
  byTree.get(tree)!.push(t)
}
const churn = [...byTree.values()].filter((ts) => ts.length > 1)

console.log('lineage — delivery vs churn by git tree hash (the faithful content-address)\n')
console.log('  tags: ' + tags.length + '   distinct trees (delivered): ' + byTree.size + '   churn-collisions: ' + churn.length + '\n')
if (churn.length) for (const ts of churn) console.log('  churn: ' + ts.join(' ≡ ') + '  (identical tracked content — a tag minted over no delta)')
else console.log('  ✓ no churn — every tag carried a distinct tracked-content delta.')

const last = tags[tags.length - 1]
if (last) {
  const lastTree = sh('git rev-parse ' + last + '^{tree}').trim()
  const headTree = sh('git rev-parse HEAD^{tree}').trim()
  const clean = sh('git status --porcelain').trim() === ''
  console.log('\n  head vs ' + last + ': ' + (headTree === lastTree ? 'same tree — no delta since tag' : 'delta present') +
    (clean ? ' · working tree clean' : ' · working tree dirty (a not-yet-in-git delta)'))
}
console.log('\n  integrity-level: measures WHAT was delivered, not whether it is true. entails → 0/7.')
process.exit(0)
