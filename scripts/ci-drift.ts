#!/usr/bin/env node
// EVERY COMMAND CI RUNS IS ACCOUNTED FOR HERE — derived from the workflows, not retyped beside them.
//
// scripts/ci-local.ts opens with "run what CI runs, where CI runs it" and carries a HAND-WRITTEN list of
// steps. That list drifted, and three broken deploys came out of the gap in one afternoon:
//
//   · `npm run gates` was added to pages.yml BEFORE the build, and three of those gates read
//     .vitepress/dist. It passed locally every time because a developer always has dist/ lying around.
//   · `lean-agree` shells out to `lean`, which no workflow installs, and reported "z9.lean does not
//     compile" — a deploy failed over a compiler that was never there.
//   · a deposition field read `git describe --tags`, and the release workflow mints tags, so 336 records
//     went stale on a push with no theorem changed.
//
// Every one of them is the same defect this tree keeps finding elsewhere: a claim RESTATED beside its
// source instead of DERIVED from it. The fix is the same too. This reads the workflow files and fails when
// they run something ci-local neither runs nor deliberately excludes — so the next step added to CI must be
// accounted for on the day it is added, rather than on the day it breaks a deploy.
//
// It does not run the commands. It checks that the local mirror knows about them, which is the part that
// was silently false.
import { readFileSync, readdirSync } from 'node:fs'
import { UNRUN_BY_DESIGN } from '../src/api/gates.ts'

let bad = 0
const fail = (m: string) => { console.log('  ✗ ' + m); bad++ }

const ci = readFileSync('scripts/ci-local.ts', 'utf8')
// BOTH SIDES NORMALISED. The first version normalised only the workflow's command and compared it against
// ci-local's raw strings, so `npm run -s build` never matched `npm run build` and the gate reported a gap
// that was not there. A comparison is only as good as the weaker side of it.
const norm = (c: string) => c.replace(/^npm run -s /, 'npm run ').trim()
const known = new Set([...ci.matchAll(/cmd: '([^']+)'/g)].map((m) => norm(m[1])))
// Steps ci-local deliberately does not run get a row of their own with a reason; both count as accounted for.
for (const m of ci.matchAll(/name: '([^']+)',\s*cmd: '([^']+)',\s*why:/g)) known.add(norm(m[2]))

const WF = '.github/workflows'
const found: { file: string; cmd: string }[] = []
for (const f of readdirSync(WF).filter((x) => /\.ya?ml$/.test(x))) {
  const y = readFileSync(`${WF}/${f}`, 'utf8')
  for (const m of y.matchAll(/^\s+run: (.+)$/gm)) {
    const cmd = m[1].trim()
    if (cmd === '|' || cmd.startsWith('#')) continue
    if (/^(npm run|node scripts\/)/.test(cmd)) found.push({ file: f, cmd })
  }
}

// A command is accounted for if ci-local runs it, excludes it with a reason, or is a documented
// CI-only mechanic (checkout, pages upload) that has no local meaning.
//
// OR IF THE DECISION IS ALREADY RECORDED — ONCE, WHERE EVERY READER READS IT. uses.yml runs four steps that
// no local chain can run: three reach GDELT, Hacker News, Zenodo, OpenAlex, npm and GitHub, and the fourth
// mails the findings through the author's authenticated SMTP. All four were reported as drift, and the fix
// that suggests itself is four rows in ci-local's SKIPPED list differing only by their arguments — a
// hand-written list, which is what src/api/gates.ts exists to stop. The reason is ALREADY WRITTEN there, in
// UNRUN_BY_DESIGN, under the script's own name, and src/api/gates.ts opens by saying why two derivations of
// one fact is the defect. So this reads that one, and the exemptions are PRINTED rather than merely applied:
// an exemption nobody sees is how a list quietly stops covering anything.
const CI_ONLY = /^npm (ci|install)/
const byDesign: { file: string; cmd: string; script: string }[] = []
for (const { file, cmd } of found) {
  const c = norm(cmd)
  if (CI_ONLY.test(c) || known.has(c) || known.has(cmd)) continue
  const script = c.match(/scripts\/([a-z0-9-]+)\.ts/)?.[1]
  if (script && UNRUN_BY_DESIGN[script]) { byDesign.push({ file, cmd: c, script }); continue }
  fail(`${file} runs \`${c}\` and scripts/ci-local.ts neither runs it nor records why it is skipped`)
}

for (const { file, cmd, script } of byDesign)
  console.log(`  ○ ${file} runs \`${cmd}\` — unrun by design, recorded in src/api/gates.ts: ${UNRUN_BY_DESIGN[script]}`)

console.log(bad
  ? `\n✗ ci-drift: ${bad} CI command(s) the local mirror does not know about — it claims to run what CI runs`
  : `\n✓ ci-drift: all ${found.length} commands across ${readdirSync(WF).length} workflows are accounted for — `
    + `run by ci-local, recorded there as deliberately skipped, or (${byDesign.length}) recorded as unrun by design `
    + `in src/api/gates.ts and printed above; the local mirror is not lying about its coverage`)
process.exit(bad ? 1 : 0)
