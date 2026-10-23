#!/usr/bin/env node
// SUITE-RUN — run one named test suite and return its verdict. It is the MCP tool `run_suite`, so every test in the
// repository is callable through the server, and the server reports which suite passed, failed, or was skipped.
//
//   node scripts/suite-run.ts <suite>
//
// The suites are an allowlist: a name not listed here is refused, not guessed. Each suite's exit code decides its
// verdict: 0 is PASS, a skip printed by the environment runner is SKIPPED (never PASS), anything else is FAIL.
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// name → command. The list is the single place a test becomes callable.
import { SUITES } from '../src/mcp/suites.ts'

const suite = process.argv[2] ?? ''
if (!(suite in SUITES)) {
  console.log(JSON.stringify({ status: 'REFUSED', suite, why: `not a known suite; known: ${Object.keys(SUITES).join(', ')}` }, null, 1))
  process.exit(0)
}

const run = spawnSync(SUITES[suite]![0]!, SUITES[suite]!.slice(1), { cwd: ROOT, encoding: 'utf8', timeout: 900_000 })
const out = String(run.stdout ?? '') + String(run.stderr ?? '')
const lines = out.trim().split('\n')
const skipped = /^SKIPPED/m.test(out)
const verdict = skipped ? 'SKIPPED' : run.status === 0 ? 'PASS' : 'FAIL'
console.log(JSON.stringify({
  status: verdict,
  suite,
  exit: run.status,
  lastLines: lines.slice(-12),
  note: verdict === 'SKIPPED' ? 'skipped by the environment: not a pass' : 'verdict from the suite exit code',
}, null, 1))
