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
// ORDER AND MEMBERSHIP FAIL DIFFERENTLY AND THE SUMMARY MUST SAY WHICH. The first version routed the
// ordering failures through `fail` and then reported them as "N CI command(s) the local mirror does not know
// about" — which is false of an ordering defect: the command IS known, it simply runs too early. A true
// detection with a misleading summary is the shape this deposit keeps finding, and it is worse here than a
// miss would be, because the reader is sent looking for a missing command that is not missing.
let order = 0
const failOrder = (m: string) => { console.log('  ✗ ' + m); order++ }

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

// ── AND THE ORDER, NOT ONLY THE MEMBERSHIP ────────────────────────────────────────────────────────────────
// This gate compared WHICH commands a workflow runs against which ones ci-local runs, as a Set. Order was
// nowhere in it, and that is precisely how a release broke: release.yml ran `npm run gates` BEFORE
// `npm run docs:build`, six gates in that chain read .vitepress/dist, import-gate refused with "no dist/",
// and no tag was minted for days. Every command was present and accounted for; the sequence was wrong, and a
// Set cannot see a sequence.
//
// IT PASSED LOCALLY EVERY TIME because a developer always has dist/ from the last build. The local chain has
// the right order — `npm run release` runs docs:build before import-gate — so the workflow was an unfaithful
// mirror in the one respect that decided whether a tag existed.
//
// WHAT IS CHECKED, AND IT IS DERIVED. Which scripts read the build is read from their own source, not listed
// here: a script that mentions .vitepress/dist needs the build to exist. Then for every workflow, if a step
// runs such a script — directly, or through an npm script that expands to it — a build step must appear
// EARLIER in the file. Adding a sixth dist-reading gate is picked up without anybody remembering to.
// A MENTION IS NOT A READ, AND AN fs CALL IS NOT THE ONLY READ. Both crude rules were wrong, in opposite
// directions, and measuring them is how each was caught:
//   · the path appearing ANYWHERE in the file gave 16 and included ci-drift and ci-local — the two scripts
//     that mention .vitepress/dist because they are the ones checking it. Four false positives.
//   · requiring the path inside a readFileSync/existsSync call gave 12 and dropped gates-fire, which
//     genuinely needs the build: its control mutates .vitepress/dist/formulas.html, but the path is a DATA
//     FIELD in its control table and the harness reads it through a variable. A false NEGATIVE, and that is
//     the direction that matters — a gate needing the build would not have been flagged.
// The rule that is right for both: the path in a STRING LITERAL with comments stripped. 14 scripts, keeping
// gates-fire and dropping only the two checkers. Third time today that "a mention is not an invocation" has
// been the distinction, after a YAML comment read as a chain step and a failure message's advice read as one.
const noComments = (t: string) => t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1')
const distReaders = new Set(
  readdirSync('scripts').filter((f) => f.endsWith('.ts'))
    .filter((f) => /['"`][^'"`\n]*\.vitepress\/dist/.test(noComments(readFileSync(`scripts/${f}`, 'utf8'))))
    .map((f) => f.replace(/\.ts$/, '')))

// an npm script "contains" a dist reader if it, or anything it calls, runs one
const pkgScripts = JSON.parse(readFileSync('package.json', 'utf8')).scripts as Record<string, string>
const containsDistReader = (name: string, seen = new Set<string>()): boolean => {
  if (seen.has(name)) return false
  seen.add(name)
  for (const n of [`pre${name}`, name, `post${name}`]) {
    const body = pkgScripts[n]
    if (!body) continue
    for (const m of body.matchAll(/node scripts\/([a-z0-9-]+)\.ts/g)) if (distReaders.has(m[1])) return true
    for (const m of body.matchAll(/npm run ([a-zA-Z0-9:._-]+)/g)) if (containsDistReader(m[1], seen)) return true
  }
  return false
}
const BUILDS = /npm run (docs:build|build)\b/

for (const f of readdirSync(WF).filter((x) => /\.ya?ml$/.test(x))) {
  const lines = readFileSync(`${WF}/${f}`, 'utf8').split('\n')
  let firstBuild = -1
  const needsBuild: { at: number; cmd: string; why: string }[] = []
  lines.forEach((l, i) => {
    const m = l.match(/^\s+run: (.+)$/)
    if (!m) return
    const cmd = m[1].trim()
    if (firstBuild < 0 && BUILDS.test(cmd)) { firstBuild = i; return }
    for (const d of cmd.matchAll(/node scripts\/([a-z0-9-]+)\.ts/g)) {
      if (distReaders.has(d[1])) needsBuild.push({ at: i, cmd, why: `scripts/${d[1]}.ts reads .vitepress/dist` })
    }
    for (const n of cmd.matchAll(/npm run ([a-zA-Z0-9:._-]+)/g)) {
      if (!BUILDS.test(cmd) && containsDistReader(n[1])) needsBuild.push({ at: i, cmd, why: `npm run ${n[1]} expands to a script that reads .vitepress/dist` })
    }
  })
  const early = needsBuild.filter((n) => firstBuild < 0 || n.at < firstBuild)
  for (const e of early) {
    failOrder(`${f}:${e.at + 1} runs \`${e.cmd}\` ${firstBuild < 0 ? 'and the workflow never builds the site' : `BEFORE the build at line ${firstBuild + 1}`} — ${e.why}. `
      + 'On a cold runner there is no dist/ and it refuses; on a developer machine there always is, so this passes locally and fails only where it matters.')
  }
}

if (order) {
  console.log(`\n✗ ci-drift: ${order} step(s) run BEFORE the build they depend on. Every command is accounted for —`)
  console.log(`  this is not a missing step, it is a step in the wrong place, and a Set of commands cannot see`)
  console.log(`  it. That blindness is how release.yml ran the gates before docs:build and minted no tag for`)
  console.log(`  days while every command was present and every run passed locally.`)
}
console.log(bad
  ? `\n✗ ci-drift: ${bad} CI command(s) the local mirror does not know about — it claims to run what CI runs`
  : `\n✓ ci-drift: all ${found.length} commands across ${readdirSync(WF).length} workflows are accounted for — `
    + `run by ci-local, recorded there as deliberately skipped, or (${byDesign.length}) recorded as unrun by design `
    + `in src/api/gates.ts and printed above; the local mirror is not lying about its coverage`)
process.exit(bad || order ? 1 : 0)
