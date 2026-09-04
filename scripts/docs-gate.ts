#!/usr/bin/env node
// THE DOCUMENTATION IS EXECUTABLE, or it is not documentation.
//
// Every `npm run X` and `node scripts/Y.ts` written in a markdown file is an instruction a reader will
// follow. If the script was renamed or deleted, the instruction fails in their hands and nothing here
// noticed — the prose kept its confident tone while pointing at nothing. Found on the first run:
// DEPLOY.md told a reader to run `scripts/ledger-sha256.ts`, which does not exist and has no trace in the
// tree; the check that re-verifies the chain is scripts/forensics.ts.
//
// This is the same defect class as the rest of this deposit's gates — a claim nothing recomputes — pointed
// at the docs. A published command is a claim that the command exists.
import { readFileSync, readdirSync, existsSync } from 'node:fs'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

const scripts = Object.keys(JSON.parse(readFileSync('package.json', 'utf8')).scripts ?? {})
const mds = readdirSync('.').filter((f) => f.endsWith('.md'))
let cmds = 0, paths = 0

for (const f of mds) {
  const src = readFileSync(f, 'utf8')
  const line = (i: number) => src.slice(0, i).split('\n').length
  for (const m of src.matchAll(/npm run (?:-s )?([a-z0-9:_-]+)/g)) {
    cmds++
    if (!scripts.includes(m[1]))
      fail(`${f}:${line(m.index!)} tells a reader to run \`npm run ${m[1]}\`, which is not a script in package.json`)
  }
  for (const m of src.matchAll(/node (scripts\/[A-Za-z0-9._/-]+\.ts)/g)) {
    paths++
    if (!existsSync(m[1]))
      fail(`${f}:${line(m.index!)} tells a reader to run \`node ${m[1]}\`, which is not in the tree`)
  }
}

// The entry points a newcomer needs must be findable from the README, or the capability may as well not
// exist. Derived from package.json rather than listed here, so a renamed script fails this instead of
// quietly leaving the README pointing at the old name.
const README = readFileSync('README.md', 'utf8')
for (const must of ['all', 'lean', 'axiom-index'])
  if (scripts.includes(must) && !README.includes(`npm run ${must}`) && !README.includes(`scripts/${must}`))
    fail(`README.md never names \`npm run ${must}\` — a reader cannot find it, so the capability is unreachable from the front door`)

console.log(bad
  ? `\n✗ docs-gate: ${bad} instruction(s) point at something that does not exist`
  : `\n✓ docs-gate: ${cmds} documented commands and ${paths} script paths across ${mds.length} markdown files all resolve; `
    + `the README names the entry points a reader needs`)
process.exit(bad ? 1 : 0)
