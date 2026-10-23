#!/usr/bin/env node
// QPU-CROSSCHECK — an independent, attributed check of the GHZ cancellation claim against the qpu connector.
// It is corroboration, never proof: the verdict comes from the Lean theorem (src/proof/interference.lean), and qpu's
// answer is a third party's report of itself. Nothing here runs on the verification path. Token free: a script decides,
// no reading by hand. Until qpu returns the X-basis amplitudes, the result is NOT MEASURED, never a pass.
//
//   node scripts/qpu-crosscheck.ts
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const bit = (n: number, i: number): number => Math.floor(n / 2 ** i) % 2
const par3 = (n: number): number => (bit(n, 0) + bit(n, 1) + bit(n, 2)) % 2
// the same definitions as interference.lean, computed here so the expectation is never typed by hand
const sgn = (x: number, s: number): number => (par3(x & s) === 0 ? 1 : -1)
const expectedGhz = [...Array(8).keys()].map((s) => sgn(0, s) + sgn(7, s))
const expectedCoinWeight = [...Array(8).keys()].map((s) => sgn(0, s) ** 2 + sgn(7, s) ** 2)

const run = spawnSync('node', ['scripts/mcp-call.ts', 'connect', JSON.stringify({ connector: 'qpu', tool: 'quantum', arguments: {} })], { cwd: ROOT, encoding: 'utf8', timeout: 120_000, maxBuffer: 8 << 20 })
let answer: unknown = null
try { answer = JSON.parse(String(run.stdout)) } catch { /* no answer */ }
const text = JSON.stringify(answer ?? '')

// the amplitudes must arrive as an array of eight integers, under a key that names GHZ or the coin in the X basis
const arrays = [...text.matchAll(/"([A-Za-z_]*(?:ghz|coin)[A-Za-z_]*(?:x|X)[A-Za-z_]*)":\s*\[([-0-9,\s]+)\]/g)]
  .map((m) => ({ key: m[1], values: m[2].split(',').map((v) => Number(v.trim())) }))
const ghz = arrays.find((a) => /ghz/i.test(a.key))
const coin = arrays.find((a) => /coin/i.test(a.key))
const status = !ghz && !coin ? 'NOT MEASURED' : (ghz && JSON.stringify(ghz.values) !== JSON.stringify(expectedGhz)) || (coin && JSON.stringify(coin.values) !== JSON.stringify(expectedCoinWeight)) ? 'DISAGREES' : 'AGREES'
console.log(JSON.stringify({
  status,
  attribution: 'qpu.uuidna.com (a third party, read-only connector): corroboration only, never proof',
  verdictSource: 'src/proof/interference.lean, theorem ghz_cancels_exactly_on_odd_parity',
  expected: { ghz: expectedGhz, coinWeight: expectedCoinWeight },
  qpu: { ghz: ghz ?? null, coin: coin ?? null },
  reason: status === 'NOT MEASURED' ? 'qpu did not return X-basis amplitudes under a ghz or coin key' : status,
}, null, 1))
process.exit(status === 'DISAGREES' ? 1 : 0)
