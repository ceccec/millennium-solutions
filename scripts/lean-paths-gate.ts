#!/usr/bin/env node
// LEAN PATH GATE — a path a .lean file names in a header or comment must resolve on disk.
//
// The citations gate's domain was narrower than its name: it passed stale file paths written inside .lean
// frontmatter (prior_art_note) and comments, so when the crypto and quantum .ts moved into src/crypto/ and
// src/quantum/ families, and the .lean themselves into src/proof/<domain>/, the old paths were left dangling
// and nothing turned red. A path a proof file names is a claim about where its code lives; a claim that no
// longer resolves is false, and a move that can leave one unseen is a move that can rot the record.
//
// This reads every .lean (recursively, through leanFiles/leanSource — so the subdirs are covered), finds every
// `src/…` path it names, and refuses on any that does not exist. External paths (…/qpu/src/…, ~/…) are left
// alone: the lookbehind only matches a path that starts a word, not one nested under another repository's root.
import { existsSync } from 'node:fs'
import { leanFiles, leanSource, leanPathOf } from '../src/api/index.ts'

const PATH_RE = /(?<![\w/~.])(src\/[A-Za-z0-9_./-]+\.(?:ts|lean|vue|mjs))/g
// EXTERNAL — qpu.uuidna.com's own tree, cited as prior art ("read from ~/github/uuidna/qpu"). Its src/quantum/
// subdirs (uuid, processing, …) and its /Qpu/ Lean modules are not this repository's files and never resolve here.
const EXTERNAL = /^src\/quantum\/(uuid|processing|net|os|generators|apps)\/|\/Qpu\//
// HISTORICAL — prose that names a file reorganised away before this gate existed; the reference is to what a now
// absent file once stated, not a claim it is present. Documented here rather than rephrased in load-bearing prose.
const HISTORICAL = new Set(['src/5/vortex.lean', 'src/8/nucleus/proton-mass.lean', 'src/proof/claimed.lean'])
const dangling: { file: string; path: string; hint: string }[] = []
for (const f of leanFiles()) {
  for (const m of leanSource(f).matchAll(PATH_RE)) {
    const p = m[1]
    if (existsSync(p) || EXTERNAL.test(p) || HISTORICAL.has(p)) continue
    // a .lean that moved (into a domain folder) still resolves by basename — name its current path as the fix
    const resolved = leanPathOf(p.slice(p.lastIndexOf('/') + 1))
    const hint = resolved !== p && existsSync(resolved) ? ` → now ${resolved}` : ''
    dangling.push({ file: f, path: p, hint })
  }
}
if (dangling.length) {
  console.log(`\n✗ lean-paths: ${dangling.length} path(s) a .lean names do not resolve on disk:`)
  for (const d of dangling) console.log(`    ${d.file}: ${d.path}${d.hint}`)
  process.exit(1)
}
console.log(`\n✓ lean-paths: every src/… path named in a .lean file resolves on disk — ${leanFiles().length} files read, no dangling citation`)
