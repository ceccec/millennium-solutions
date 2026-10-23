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
]
const PUSH_PHASE1: Check[] = [
  { name: 'anti-fake', cmd: ['node', 'scripts/anti-fake.ts', '--all'] },
  { name: 'mcp-gate', cmd: ['node', 'scripts/mcp-gate.ts'] },
  { name: 'theorem-only', cmd: ['node', 'scripts/theorem-only-check.ts', ROOT] },
]
const COURT: Check = { name: 'court', cmd: ['node', 'scripts/pre-commit-court.ts'] }

const mode = process.argv.includes('--push') ? 'push' : process.argv.includes('--commit') ? 'commit' : ''
if (!mode) {
  console.log('usage: gate-parallel.ts --commit | --push')
  process.exit(2)
}
const phase1 = mode === 'push' ? PUSH_PHASE1 : COMMIT_PHASE1
const phase2: Check[] = mode === 'commit' ? [COURT] : []

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
