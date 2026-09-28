#!/usr/bin/env node
// CI-WATCH — read the verdict CI gave on a commit, and say what failed.
//
// WHY THIS EXISTS. A push took both workflows red — Deploy in three minutes, Release after thirty-four —
// and the session moved on to the next thing. Nothing was hiding: `gh run list` says "failure" in the first
// column. The defect was that reading it was a thing somebody had to remember, so it was a thing that got
// skipped, and the tree sat broken while work continued on top of it.
//
// IT REPORTS, IT DOES NOT JUDGE. A run still queued is queued and is not a pass; the exit code is 1 only for
// a run that actually concluded in failure, so `ci:watch` in a chain cannot go green on a run nobody has
// finished yet. That distinction is the whole point: "not failed" and "passed" are different words.
//
//   node scripts/ci-watch.ts              the workflows for HEAD
//   node scripts/ci-watch.ts --wait       poll until every run for HEAD concludes
//   node scripts/ci-watch.ts <sha>        a particular commit
import { execFileSync } from 'node:child_process'
import { flag, arg } from '../src/cli/index.ts'

const sha = process.argv.slice(2).find((a) => /^[0-9a-f]{7,40}$/.test(a))
  ?? execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()

type Run = { databaseId: number; name: string; status: string; conclusion: string | null; headSha: string }
const runs = (): Run[] => {
  // NO TOOLCHAIN IS NOT A VERDICT, which this repository has had to learn more than once: without `gh`, or
  // without credentials, this says so and refuses rather than reporting an empty list as "nothing failed".
  try {
    const out = execFileSync('gh', ['run', 'list', '--limit', '30', '--json',
      'databaseId,name,status,conclusion,headSha'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    return (JSON.parse(out) as Run[]).filter((r) => r.headSha === sha)
  } catch (e) {
    console.error('  ○ NOT MEASURED — `gh run list` did not answer, so nothing is known about CI here.')
    console.error('    ' + String((e as { stderr?: Buffer }).stderr ?? (e as Error).message).split('\n')[0])
    process.exit(2)
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let mine = runs()
if (flag('--wait')) {
  const deadline = Date.now() + Number(arg('--for') ?? 2700) * 1000
  while (mine.length === 0 || mine.some((r) => r.status !== 'completed')) {
    if (Date.now() > deadline) { console.error('  ○ NOT MEASURED — still running when the wait ran out'); process.exit(2) }
    process.stderr.write(`  · ${mine.filter((r) => r.status !== 'completed').length || '…'} run(s) still going\n`)
    await sleep(20_000)
    mine = runs()
  }
}
if (!mine.length) { console.log(`  ○ no workflow run for ${sha.slice(0, 12)} — pushed?`); process.exit(2) }

const failed = mine.filter((r) => r.conclusion && r.conclusion !== 'success' && r.conclusion !== 'skipped')
for (const r of mine) console.log(`  ${r.conclusion === 'success' ? '✓' : r.status !== 'completed' ? '·' : '✗'} ${r.name} — ${r.conclusion ?? r.status}`)
if (!failed.length) {
  console.log(mine.every((r) => r.status === 'completed')
    ? `✓ ci-watch: every workflow for ${sha.slice(0, 12)} concluded green`
    : `○ ci-watch: nothing has failed for ${sha.slice(0, 12)}, but not every run has finished — that is not a pass`)
  process.exit(0)
}
// THE ERROR LINE, NOT THE CLEANUP. A --log-failed dump is mostly the runner tearing down its git config, and
// the one line that matters scrolls past it. Checkout noise is dropped and what remains is printed.
for (const r of failed) {
  console.log(`\n── ${r.name}`)
  try {
    const log = execFileSync('gh', ['run', 'view', String(r.databaseId), '--log-failed'],
      { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] })
    const lines = log.split('\n')
      // `refus` MATCHED THE PASSES — crypto-kat prints "✓ an altered message is refused" four times, and
      // this reported those as the failure, burying the line that mattered. Narrowing the vocabulary then
      // dropped the real diagnostic, which was "release: tag-only refuses a dirty tree" and carries neither
      // a ✗ nor the word error. The word was never the discriminator: whether the line is a PASS is. Lines
      // marked ✓ are dropped and the error vocabulary is kept wide, so a gate that reports its refusal in
      // its own words still reaches the reader.
      .filter((l) => !/✓/.test(l))
      .filter((l) => /✗|##\[error\]|\bfatal:|does not compile|Cannot find|refuse|FATAL|exit code [1-9]/i.test(l))
      .filter((l) => !/extraheader|sshCommand|credentials|includeIf|submodule|orphan process/i.test(l))
      .map((l) => l.replace(/^\S+\t\S+ ?\S*\t\S+Z /, ''))
    for (const l of [...new Set(lines)].slice(0, 12)) console.log('    ' + l.trim())
  } catch { console.log('    (could not read the log)') }
}
console.log(`\n✗ ci-watch: ${failed.length} workflow(s) failed for ${sha.slice(0, 12)}`)
process.exit(1)
