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
// ROOT ONLY was the bug: `readdirSync('.')` never descended, so every command written in docs/*.md was
// unchecked while the summary line said "across 40 markdown files" and sounded exhaustive. The gate exists
// because DEPLOY.md once told a reader to run a script that does not exist; docs/CERN-ENUMERATION.md tells a
// reader to run `npm run cern`, and nothing verified that until now. Same root-only domain that left
// locale-fold blind to docs/ in the same session.
const walkMd = (dir: string): string[] => {
  const out: string[] = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', '.vitepress', 'dist', '.lake', 'packages'].includes(e.name)) continue
    const p = dir === '.' ? e.name : `${dir}/${e.name}`
    if (e.isDirectory()) out.push(...walkMd(p))
    else if (e.name.endsWith('.md')) out.push(p)
  }
  return out
}
const mds = walkMd('.')
let cmds = 0, paths = 0

// A command quoted as an EXAMPLE OF A BROKEN COMMAND is not an instruction. docs/SESSION-FINDINGS.md
// records "ran `npm run build` at the repo root, where no such script exists" — a finding about a command
// that does not exist, which this gate would otherwise report as a command that does not exist. Same shape
// stale-figures solved with a past-tense marker, and handled the same way: exempted, COUNTED and PRINTED,
// because an exemption nobody sees is how a check quietly stops covering anything.
const DENIED = /\b(no such|does not exist|never existed|not a script|is not in the tree|which does not|nonexistent)\b/i
const exempt: string[] = []
const nearby = (src: string, i: number): string => src.slice(Math.max(0, i - 160), i + 160)

for (const f of mds) {
  const src = readFileSync(f, 'utf8')
  const line = (i: number) => src.slice(0, i).split('\n').length
  for (const m of src.matchAll(/npm run (?:-s )?([a-z0-9:_-]+)/g)) {
    cmds++
    if (scripts.includes(m[1])) continue
    if (DENIED.test(nearby(src, m.index!))) { exempt.push(`${f}:${line(m.index!)} npm run ${m[1]}`); continue }
    fail(`${f}:${line(m.index!)} tells a reader to run \`npm run ${m[1]}\`, which is not a script in package.json`)
  }
  for (const m of src.matchAll(/node (scripts\/[A-Za-z0-9._/-]+\.ts)/g)) {
    paths++
    if (existsSync(m[1])) continue
    if (DENIED.test(nearby(src, m.index!))) { exempt.push(`${f}:${line(m.index!)} node ${m[1]}`); continue }
    fail(`${f}:${line(m.index!)} tells a reader to run \`node ${m[1]}\`, which is not in the tree`)
  }
}
if (exempt.length) console.log(`  ○ ${exempt.length} command(s) quoted as examples of broken commands, exempted and named: ${exempt.join(' · ')}`)

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
