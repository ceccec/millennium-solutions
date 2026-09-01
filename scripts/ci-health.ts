#!/usr/bin/env node
// CI-HEALTH — what the workflows are actually doing, read from GitHub rather than assumed.
//
// The cross-runtime conformance matrix was red on every push for two weeks and nothing in this repository
// noticed. Twenty-seven gates, a gate that tests the gates, a reader that names the next wave — and the way
// the failure surfaced was the owner asking "again failed after push! why?". Every instrument here looks
// INWARD at the tree; none of them looks at what happened after the push, which is where the deposit meets
// anyone else.
//
// This reads the last run of every workflow and reports it. It is not a gate on the release chain — a failing
// remote run is not a reason to refuse a local build, and gating on network state would make the build
// unrunnable offline. It is a READER, like wave.ts: it says what is true so a two-week silence cannot happen
// again. Without gh, or offline, it says so and exits zero rather than pretending.
import { execSync } from 'node:child_process'
import { readFileSync, readdirSync, existsSync } from 'node:fs'

type Run = { name: string; conclusion: string; status: string; createdAt: string; displayTitle: string; url: string }

let runs: Run[] = []
try {
  const raw = execSync('gh run list --limit 40 --json name,conclusion,status,createdAt,displayTitle,url',
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  runs = JSON.parse(raw)
} catch {
  console.log('ci-health: gh is unavailable or not authenticated — nothing read, nothing claimed.')
  process.exit(0)
}

if (!runs.length) { console.log('ci-health: no runs reported.'); process.exit(0) }

// the LATEST run per workflow is the one that describes the current state
const latest = new Map<string, Run>()
for (const r of runs) if (!latest.has(r.name)) latest.set(r.name, r)

const days = (iso: string) => Math.floor((Date.now() - Date.parse(iso)) / 86400000)
const rows = [...latest.values()].sort((a, b) => a.name.localeCompare(b.name))
const failing = rows.filter((r) => r.conclusion === 'failure')

console.log(`ci-health — the latest run of each workflow (${rows.length} workflows, from ${runs.length} runs):`)
for (const r of rows) {
  const mark = r.status !== 'completed' ? '·' : r.conclusion === 'success' ? '✓' : '✗'
  const age = days(r.createdAt)
  console.log(`  ${mark} ${r.name.slice(0, 46).padEnd(46)} ${(r.conclusion || r.status).padEnd(9)} ${age === 0 ? 'today' : age + 'd ago'}`)
}

// A WORKFLOW THAT HAS NOT RUN IS NOT A WORKFLOW THAT IS GREEN. Only three appeared in the last forty runs;
// the repository defines more. publish fires on a release and trinity on a schedule, so both can sit
// unexercised for weeks while everything reads as fine — which is the same silence the conformance matrix
// hid in, wearing different clothes. Declared but unseen is its own state and is named as one.
const declared = existsSync('.github/workflows')
  ? readdirSync('.github/workflows').filter((f) => /\.ya?ml$/.test(f))
      .map((f) => readFileSync('.github/workflows/' + f, 'utf8').match(/^name:\s*(.+)$/m)?.[1]?.trim() ?? f)
  : []
const unseen = declared.filter((n) => ![...latest.keys()].some((k) => k.startsWith(n.slice(0, 40))))
if (unseen.length) {
  console.log(`\n· ${unseen.length} declared workflow(s) with no run in the last ${runs.length}. Not green — unobserved:`)
  for (const n of unseen) console.log(`    ${n}`)
}

if (failing.length) {
  console.log(`\n✗ ${failing.length} workflow(s) failing. How long each has been red matters more than that it is:`)
  for (const r of failing) {
    // how many consecutive runs of THIS workflow have failed — a run red for weeks is a different problem
    const mine = runs.filter((x) => x.name === r.name)
    let streak = 0
    for (const x of mine) { if (x.conclusion === 'failure') streak++; else break }
    console.log(`    ${r.name} — ${streak} consecutive failure(s), latest ${days(r.createdAt)}d ago`)
    console.log(`      ${r.url}`)
  }
  console.log('\n  Reported, not gated: a failing remote run is not a reason to refuse a local build, and')
  console.log('  gating on network state would make this repository unbuildable offline.')
} else {
  console.log('\n✓ ci-health: every workflow is green on its latest run')
}
