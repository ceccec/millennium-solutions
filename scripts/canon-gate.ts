#!/usr/bin/env node
// CANON — one derivation for one job, enforced instead of tidied.
//
// src/html/index.ts exists because four byte-identical copies of HTML escaping had grown across the tree and
// a fifth, in scripts/rights.ts, escaped `&` and `<` but not `>`. Its own header says so. That consolidation
// was done, and then FOUR MORE copies grew — scripts/challenges.ts and scripts/discover.ts escaping `<` and
// `>` but not `&`, src/publication/index.ts escaping `&` and `<` but not `>`, scripts/clusters.ts complete
// and still its own. Four more copies of the tag STRIPPER grew beside them. On 2026-09-20 a missing escape
// in scripts/paper.ts killed the VitePress build, and the error pointed at a file hundreds of lines from the
// cause.
//
// A leaf helper does not stay consolidated because somebody tidied it once. The tidying is not the fix; this
// is. Every pattern below names a job the tree has exactly one implementation of, and the check fails when a
// second one appears anywhere outside its owner.
//
// WHAT THIS DOES NOT DO. It does not look for similar code, and it is not a duplicate detector: it knows a
// fixed list of jobs, each with an owner. A new job is added here deliberately, by someone who has decided
// the tree should have one of them. That keeps the gate's own claim narrow enough to be true.
import { readFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { stripComments } from '../src/source/index.ts'

type Canon = { job: string; owner: string; pattern: RegExp; use: string }
const CANON: Canon[] = [
  { job: 'HTML escaping', owner: 'src/html/index.ts', use: 'escapeHtml from src/html',
    pattern: /\.replace\(\/[<>&]\/g,\s*'&(?:lt|gt|amp);'\)/ },
  { job: 'stripping HTML tags', owner: 'src/html/index.ts', use: 'stripTags (or TAG, mid-chain) from src/html',
    pattern: /\.replace\(\/<\[\^>\]\+>\/g,/ },
  // Three copies, and they were not the same function: two tested `i > 0` and returned a string, one tested
  // `i >= 0` and coerced to a number. The difference could not bite — argv[0] is the node binary — which is
  // what makes it the kind of divergence that survives until the day it can.
  { job: 'reading an argv flag value', owner: 'src/cli/index.ts', use: 'arg/num/flag from src/cli',
    pattern: /process\.argv\.indexOf\(/ },
  // Four copies of the line that enumerates the proof directory, each re-deriving what leanFiles() returns —
  // and each missing the existsSync guard the canonical one carries.
  { job: 'enumerating the Lean sources', owner: 'src/api/index.ts', use: 'leanFiles() from src/api',
    pattern: /readdirSync\((?:'|")src\/proof/ },
  // Two copies, and the second was about to be written when this caught it. A gate reading the tree reads
  // its own explanation; both gates need the same answer to "is this code or prose about code".
  // Eleven copies of one pinned SHA across eight workflows. A pin is a supply-chain decision, and a decision
  // recorded in eleven places is updated in ten. The owner is a composite action; `actions/checkout` cannot
  // move into it, because a local action does not exist until the checkout has run.
  { job: 'the workflow node setup', owner: '.github/actions/node/action.yml', use: './.github/actions/node',
    pattern: /actions\/setup-node@/ },
  { job: 'reading source as code', owner: 'src/source/index.ts', use: 'stripComments from src/source',
    pattern: /filter\(\(l\) => !\/\^\\s\*\(\\\/\\\//  },
]

const files = execSync('git ls-files "*.ts" "*.vue" ".github/**/*.yml"', { encoding: 'utf8' }).split('\n').filter(Boolean)
  .filter((f) => !f.startsWith('packages/'))

let bad = 0
for (const c of CANON) {
  // The owner is where the job lives; a hit there is the implementation, not a copy.
  const copies = files.filter((f) => f !== c.owner && c.pattern.test(stripComments(readFileSync(f, 'utf8'))))
  if (copies.length) {
    bad += copies.length
    console.log(`  ✗ ${copies.length} file(s) carry their own ${c.job} instead of using ${c.use}:`)
    for (const f of copies) console.log(`      ${f}`)
  } else {
    console.log(`  ✓ ${c.job.padEnd(22)} one implementation, in ${c.owner}`)
  }
}

// A COMMENT QUOTING THE PATTERN IS NOT A COPY OF IT. This file quotes both patterns in its own header, and
// so does src/html/index.ts; a gate that counts its own explanation as a violation is the instrument lying
// about its subject, which is the defect this repository keeps finding in its own checks.

if (bad) {
  console.log(`\n✗ canon: ${bad} second implementation(s) of a job this tree derives once — fold them into the owner`)
  process.exit(1)
}
console.log(`\n✓ canon: ${CANON.length} job(s) checked over ${files.length} files — each has exactly one implementation, in the module that owns it`)
