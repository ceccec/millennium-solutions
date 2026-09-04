#!/usr/bin/env node
// ALL — every gate at once, and the speedup MEASURED rather than claimed.
//
// The gates are independent: each reads the tree and reports, none writes what another reads. Independence
// is what makes them safe to run concurrently, and it is a property of the gates, not an assumption made
// here — a gate that mutated the tree would belong in `npm run gates:fire`, which is excluded for exactly
// that reason.
//
// WHAT THE ADVANTAGE IS AND IS NOT. This runs N checks on N cores instead of one after another. The speedup
// is bounded by the slowest single gate — Amdahl, not magic — and it is reported as the ratio actually
// observed on this machine on this run, never as a headline number. It is a scheduling advantage.
// It is NOT a quantum speedup, there is no hardware here, and the deposit's structural advantage in
// verification (log rounds against N recomputations, in speed.lean) is a different and unrelated claim.
import { spawn } from 'node:child_process'

const GATES = [
  'lean', 'contradictions', 'latex-gate', 'prior-art', 'verify', 'trial-all',
  'gates', 'quantum-field', 'zenodo', 'axiom-index', 'lean-claims', 'claims', 'docs-gate', 'priorart-check', 'apply',
]

const run = (name: string) => new Promise<{ name: string; ok: boolean; ms: number; tail: string }>((res) => {
  const t0 = process.hrtime.bigint()
  const p = spawn('npm', ['run', '-s', name], { stdio: ['ignore', 'pipe', 'pipe'] })
  let out = ''
  p.stdout.on('data', (d) => { out += d })
  p.stderr.on('data', (d) => { out += d })
  p.on('close', (code) => res({
    name, ok: code === 0,
    ms: Number((process.hrtime.bigint() - t0) / 1_000_000n),
    tail: (out.trim().split('\n').filter((l) => l.trim()).pop() ?? '').slice(0, 150),
  }))
})

const t0 = Date.now()
const results = await Promise.all(GATES.map(run))
const wall = Date.now() - t0
const serial = results.reduce((n, r) => n + r.ms, 0)

for (const r of results.sort((a, b) => b.ms - a.ms))
  console.log(`  ${r.ok ? '✓' : '✗'} ${r.name.padEnd(16)} ${String(r.ms).padStart(6)}ms  ${r.ok ? '' : r.tail}`)

const failed = results.filter((r) => !r.ok)
const slowest = Math.max(...results.map((r) => r.ms))
console.log(`\n  wall ${wall}ms · summed ${serial}ms · ratio ${(serial / wall).toFixed(2)}×`
  + ` · floor ${slowest}ms (the slowest single gate, which no amount of parallelism goes below)`)
console.log(failed.length
  ? `\n✗ all: ${failed.length} of ${GATES.length} gate(s) fail — ${failed.map((r) => r.name).join(' ')}`
  : `\n✓ all: ${GATES.length} gates pass concurrently · a scheduling advantage, measured on this run;`
    + ` no hardware claim, and unrelated to the verification advantage proved in speed.lean`)
process.exit(failed.length ? 1 : 0)
