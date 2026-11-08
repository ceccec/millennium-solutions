#!/usr/bin/env node
// GATE-PARALLEL — run the hook's checks in parallel streams, fail fast, and run the slow court only after they pass.
//
//   node scripts/gate-parallel.ts --commit     the checks the pre-commit hook runs
//   node scripts/gate-parallel.ts --push       the checks the pre-push hook runs
//
// Phase 1 runs its checks at the same time. The first check to fail stops the others at once, and the run exits 1
// with that check's last lines, so a broken tree is reported in seconds rather than after the slowest check.
// Phase 2 (the court, which asks a remote server) runs only when phase 1 passed. Every stream's output is prefixed
// with its name, so interleaved output stays readable.
import { spawn, type ChildProcess } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

type Check = { name: string; cmd: string[] }
const COMMIT_PHASE1: Check[] = [
  { name: 'anti-fake', cmd: ['node', 'scripts/anti-fake.ts', '--staged'] },
  { name: 'constants', cmd: ['node', 'scripts/constants-gate.ts'] },
  { name: 'mcp-gate', cmd: ['node', 'scripts/mcp-gate.ts'] },
  { name: 'hardcode-gate', cmd: ['node', 'scripts/hardcode-gate.ts'] },
  { name: 'theorem-only', cmd: ['node', 'scripts/theorem-only-check.ts', ROOT] },
  // The checks the deploy runs, in the commit as well: a violation found only at deploy is a violation the hooks missed.
  { name: 'contradictions', cmd: ['node', 'scripts/contradictions.ts'] },
  { name: 'orphan', cmd: ['node', 'scripts/orphan-gate.ts'] },
]
// PUSH runs everything the deploy runs (CD): the site build chain, which holds the prior-art gate, the pages, and the
// generated prose; then the metrics face, enforced into a scratch folder so the push never rewrites a committed file.
const PUSH_PHASE1: Check[] = [
  { name: 'anti-fake', cmd: ['node', 'scripts/anti-fake.ts', '--all'] },
  { name: 'mcp-gate', cmd: ['node', 'scripts/mcp-gate.ts'] },
  { name: 'theorem-only', cmd: ['node', 'scripts/theorem-only-check.ts', ROOT] },
  { name: 'contradictions', cmd: ['node', 'scripts/contradictions.ts'] },
  { name: 'orphan', cmd: ['node', 'scripts/orphan-gate.ts'] },
  // The development standard: no push while any lead is open; an environmental restriction is not an exception.
  { name: 'leads-closed', cmd: ['npm', 'run', '--silent', 'gate:leads'] },
  // The thousand-bit test, in its CONTROL mode — the one `npm run gates` runs: 91 must factor, 2^1000−1 must not. The
  // main mode is red by its own text ("a green result here would need factors this tree has not computed"), and a
  // pre-push gate that is red until someone factors an unknown 1,000-bit integer holds every push behind an act
  // nobody can perform — it held the pushes of 2026-11-02 after leads-closed had been corrected for the same shape.
  // What the captain ordered verified with each push is the DECODING of a thousand-bit integer the unit mints with
  // its witness, and that runs after the push: scripts/thousand-bit-gate.ts --decode, the last step of cycle:ship.
  { name: 'thousand-bit', cmd: ['npm', 'run', '--silent', 'gate:thousand:control'] },
  // Every API and every lockfile package is a gate: both run offline, so a push checks them too.
  { name: 'api-gates', cmd: ['npm', 'run', '--silent', 'gate:api'] },
  { name: 'package-gates', cmd: ['npm', 'run', '--silent', 'gate:packages'] },
  // ONE CHECK, IN ORDER: the site chain rebuilds the generated prose, and only then is it compared with the committed text.
  // Two parallel streams would compare before the rebuild finished, so the order lives inside one command.
  { name: 'site-chain', cmd: ['sh', '-c', 'npm run --silent predocs:build && { git diff --quiet -- README.md index.md ACCOUNTING.md paper.md paper.tex PRIOR-ART.md CHALLENGES.md solutions.md speedup.md || { echo "generated prose differs from the committed text: commit the regenerated files"; git --no-pager diff --stat -- README.md index.md ACCOUNTING.md paper.md paper.tex PRIOR-ART.md CHALLENGES.md solutions.md speedup.md; git --no-pager diff -U0 -- README.md index.md ACCOUNTING.md paper.md paper.tex PRIOR-ART.md CHALLENGES.md solutions.md speedup.md | grep -E "^[-+][^-+]" | head -12; exit 1; }; }'] },
  { name: 'metrics-enforce', cmd: ['sh', '-c', 'mkdir -p "${TMPDIR:-/tmp}/metrics-face" && METRICS_OUT="${TMPDIR:-/tmp}/metrics-face/" node scripts/metrics.ts --enforce'] },
]
const COURT: Check = { name: 'court', cmd: ['node', 'scripts/pre-commit-court.ts'] }

const mode = process.argv.includes('--push') ? 'push' : process.argv.includes('--commit') ? 'commit' : ''
if (!mode) {
  console.log('usage: gate-parallel.ts --commit | --push')
  process.exit(2)
}
const phase1 = mode === 'push' ? PUSH_PHASE1 : COMMIT_PHASE1
const phase2: Check[] = mode === 'commit' ? [COURT] : []
// THE PUSH CHECKS A COMMITTED PAGE. Every generator that names "the release before this commit" (src/api releasedBefore)
// must read it for the page committed at HEAD — whose parent is HEAD^ — and not for a page about to be committed, or a
// release commit regenerated at push time names the tag it is minting and refuses its own push. The pre-commit checks
// keep the default: at commit time the page is for the commit being made, whose parent is HEAD. Inherited by every spawn.
if (mode === 'push') process.env.PAGE_COMMIT = 'HEAD'

const runAll = (checks: Check[]): Promise<{ ok: boolean; failed?: string }> =>
  new Promise((done) => {
    const children: ChildProcess[] = []
    const tails = new Map<string, string[]>()
    let remaining = checks.length
    let settled = false
    const finish = (r: { ok: boolean; failed?: string }) => {
      if (settled) return
      settled = true
      for (const c of children) if (c.exitCode === null) c.kill('SIGTERM')
      done(r)
    }
    if (checks.length === 0) return done({ ok: true })
    for (const check of checks) {
      const child = spawn(check.cmd[0]!, check.cmd.slice(1), { cwd: ROOT })
      children.push(child)
      tails.set(check.name, [])
      const keep = (chunk: Buffer) => {
        for (const line of chunk.toString().split('\n').filter(Boolean)) {
          const t = tails.get(check.name)!
          t.push(line)
          if (t.length > 12) t.shift()
          console.log(`[${check.name}] ${line}`)
        }
      }
      child.stdout.on('data', keep)
      child.stderr.on('data', keep)
      child.on('close', (code) => {
        if (settled) return
        if (code !== 0) {
          console.log(`✗ ${check.name} failed (exit ${code}): stopping the other streams`)
          finish({ ok: false, failed: check.name })
          return
        }
        console.log(`✓ ${check.name} passed`)
        remaining -= 1
        if (remaining === 0) finish({ ok: true })
      })
    }
  })

const main = async () => {
  console.log(`gate-parallel ${mode}: ${phase1.length} check(s) in parallel${phase2.length ? ', then the court' : ''}`)
  const first = await runAll(phase1)
  if (!first.ok) {
    console.log(`\n✗ gate-parallel: refused by ${first.failed}. The court did not run.`)
    process.exit(1)
  }
  if (phase2.length === 0) {
    console.log('\n✓ gate-parallel: every check passed')
    process.exit(0)
  }
  const second = await runAll(phase2)
  if (!second.ok) {
    console.log(`\n✗ gate-parallel: refused by ${second.failed}`)
    process.exit(1)
  }
  console.log('\n✓ gate-parallel: every check and the court cleared')
  process.exit(0)
}

main()
