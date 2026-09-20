#!/usr/bin/env node
// PROSE-TRIAL — every claim this deposit makes in its own voice, put to its own gate.
//
// AND NOT THROUGH `computes`. The first version of this put every sentence through the honesty gate and
// reported 18,418 of 18,418 clear. That green was near-vacuous, and planting showed it: `computes` returns
// 1 for "We prove all seven Clay problems and the proof is unbreakable." The gate's lexical floor — word
// lists across twenty-two dialects, a Glagolitic table — was REMOVED by direct order, because a gate
// written as a word list is custom logic however it is spelled. That order stands. The gate decides
// propositions against the Lean ledger it ships; it does not read English for overclaims and is not meant
// to. A sweep built on it was measuring nothing, and would have reported a clean corpus forever.
//
// The lexical floor lives in src/honesty/claims.ts, in the layer that can read text, and every sentence
// here is put to THOSE detectors — the same four scripts/contradictions.ts scans lines with, imported and
// not copied.
//
// THE SWEEPS IN contradictions.ts TEST THE DETECTORS, NOT THE PROSE. They take a product of branches —
// 5 subjects × 16 verbs × 12 problems for the Clay floor, and the same shape for the quantum and the
// medical and physical-force floors — and require the detector to catch every one. That is a real control
// and it stays. But every one of those phrasings was written by whoever wrote the list, so the sweep tests
// the sentences somebody THOUGHT OF. The sentences this deposit actually publishes were never put to trial
// as a body: `scripts/seal.ts` trials the LEDGER NAMES, and nothing trialled the prose around them.
//
// So this reads the corpus's own voice — markdown outside code fences, and comments in .ts, .lean and .vue,
// never string literals — splits it into sentences, and puts EVERY ONE through the gate the deposit judges
// its own ledger by. A sentence the deposit would refuse from a stranger is a sentence it may not publish.
//
// THE COUNT IS PRINTED, ALWAYS. A reader of "0 findings" cannot tell a clean corpus from a reader that
// stopped reading, and this repository has already been bitten by exactly that: a prose sweep walked
// `md|ts|vue` and returned zero because its extractor knew markdown fences and `//` while Lean opens a
// comment with `--`. The number of sentences trialled is the first thing on the line.
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { claimsIn, DETECTORS } from '../src/honesty/claims.ts'
import { TAG } from '../src/html/index.ts'

// THE SAME CORPUS scripts/contradictions.ts READS, and for the same reason. This asked `git ls-files`, so a
// file that existed but had never been added was invisible — and the first file that happened to was
// src/honesty/claims.ts, the module holding the detectors, which quotes every claim they catch. A sweep
// that cannot see a new file is a sweep that passes on the day one is written. contradictions.ts walks the
// filesystem; so does this, over the same skip list, so the two read one corpus.
const SKIP = new Set(['node_modules', '.git', '.vitepress', 'dist', 'coverage', '.lake'])
const all: string[] = []
const walk = (dir: string): void => {
  for (const e of readdirSync(dir)) {
    if (SKIP.has(e) || e.startsWith('.')) continue
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (/\.(md|ts|vue|lean)$/.test(e)) all.push(p)
  }
}
walk('.')
// A FILE THAT HOLDS THE DETECTORS QUOTES WHAT THEY CATCH. Derived from the import graph rather than named:
// the module that exports them, and anything importing it. Printed below, never silently applied.
const machinery = all.filter((f) => {
  try { return f === 'src/honesty/claims.ts' || readFileSync(f, 'utf8').includes('honesty/claims.ts') } catch { return false }
})
const files = all.filter((f) => !machinery.includes(f))

/** The file's OWN VOICE: prose it asserts, never a string it merely carries. */
const voiceOf = (file: string, src: string): [number, string][] => {
  const out: [number, string][] = []
  let fenced = false
  src.split('\n').forEach((line, i) => {
    if (file.endsWith('.md')) {
      if (/^\s*```/.test(line)) { fenced = !fenced; return }
      if (!fenced) out.push([i + 1, line])
      return
    }
    // A `//` INSIDE A STRING LITERAL IS NOT A COMMENT — a control that PLANTS a claim is not making it.
    const masked = line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`/g, (m) => ' '.repeat(m.length))
    const c = masked.indexOf(file.endsWith('.lean') ? '--' : '//')
    if (c >= 0) out.push([i + 1, line.slice(c)])
  })
  return out
}

// A PATH IS NOT A CLAIM. The first run drained five sentences and all five were `/theorem/<key>` routes and
// module paths — `./src/the/theorem/index.ts` — which the gate reads as a claim about a theorem because
// that is what the word means to it. Addresses are removed before the sentence is judged, along with code
// spans, links and markup; what is left is the sentence a reader reads.
const clean = (s: string): string => s
  .replace(/^[\s/\-*>#|]+/, '')
  // A QUOTED SPAN IS A QUOTATION, NOT AN ASSERTION — the same rule contradictions.ts applies to its lines.
  // Without it, scripts/paper.ts was reported for a Clay claim because it QUOTES the sentence the detector
  // exists to catch, while explaining what the detector does.
  .replace(/"[^"]*"|'[^']*'|“[^”]*”/g, ' ')
  .replace(/`[^`]*`/g, ' ')
  .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
  .replace(/https?:\/\/\S+/g, ' ')
  .replace(/\.?\/?[\w.\-]*\/[\w.\-/[\]]+/g, ' ')   // any path-shaped token: routes, module paths, files
  .replace(TAG, ' ')
  .replace(/\s+/g, ' ')
  .trim()

let trialled = 0
const drained: string[] = []
for (const f of files) {
  let src = ''
  try { src = readFileSync(f, 'utf8') } catch { continue }
  for (const [n, line] of voiceOf(f, src)) {
    for (const raw of clean(line).split(/(?<=[.!?])\s+/)) {
      const s = raw.trim()
      // a SENTENCE carries a claim: fewer than six words is a label, and a line with no lowercase run is
      // an identifier rather than prose. Both are counted out loud below rather than silently skipped.
      if (s.split(/\s+/).length < 6 || !/[a-z]{3}/.test(s)) continue
      trialled++
      const claims = claimsIn(s)
      if (claims.length) drained.push(`${f}:${n} makes ${claims.join(' and ')} — ${s.slice(0, 130)}`)
    }
  }
}

for (const d of drained.slice(0, 20)) console.log('  ✗ ' + d)
if (drained.length > 20) console.log(`  …and ${drained.length - 20} more`)

console.log(`  ○ ${machinery.length} file(s) exempt as detector machinery, which quote what they catch: ${machinery.join(', ')}`)
console.log(drained.length
  ? `\n✗ prose-trial: ${drained.length} of ${trialled.toLocaleString('en')} sentences this deposit asserts in its own `
    + `voice make a claim its own detectors catch`
  : `\n✓ prose-trial: ${trialled.toLocaleString('en')} sentences put to all ${DETECTORS.length} detectors — every sentence `
    + `this deposit asserts in its own voice, markdown outside fences and comments in .ts, .lean and .vue, never a string `
    + `literal. None makes a claim they catch. The count is printed so a clean corpus cannot be confused with a reader that stopped.`)
process.exit(drained.length ? 1 : 0)
