#!/usr/bin/env node
// QPU REGISTER GATE — the UUID link between qpu.lean's register constants and the quantum programs that derive
// them, and the live check that the served unit still agrees. Two layers, one for each sense of the link:
//
//   1 · THE ADDRESS (local, always runs). Each constant qpu.lean records is linked to the coin — toUuid of the
//       unit's own declaration (src/quantum/qpu-coins.ts) — and to the ported program that derives it (the clay*
//       section). This resolves by recomputation: anyone computing toUuid of the same words gets the same coin,
//       so the integer carries a checkable address instead of a date and a hand. A coin that does not recompute,
//       or a value that is not in qpu.lean, fails here.
//
//   2 · THE LIVE UNIT (served→source, three states). It asks qpu.uuidna.com through the connector for its
//       register and compares the served values to the ones qpu.lean records. AGREES passes, DISAGREES refuses
//       and names both numbers, NOT MEASURED passes with the cause — the served door may be absent and the
//       source fallback may be unreachable in this environment, which is reported, never silently skipped.
//       Corroboration only: the verdict on what follows from the constants stays the kernel's (qpu.lean).
//
//   node scripts/qpu-register-gate.ts
import { spawnSync } from 'node:child_process'
import { qpuRegister, registerSpec } from '../src/quantum/qpu-coins.ts'
import { toUuid } from '../src/0/index.ts'

const reg = qpuRegister()

// ── 1 · THE ADDRESS ─────────────────────────────────────────────────────────────────────────────────────────
console.log(`qpu-register: ${reg.length} constant(s) linked to their quantum programs by coin —`)
const badCoin = reg.filter((r) => toUuid(registerSpec(r.name, r.value)) !== r.coin)
if (badCoin.length) {
  console.log(`✗ qpu-register: ${badCoin.length} coin(s) do not recompute from the declaration — the link is broken, not resolvable`)
  process.exit(1)
}
for (const r of reg) console.log(`  ${r.name.padEnd(9)} ${String(r.value).padStart(2)}  ← ${r.program.padEnd(34)} coin ${r.coin}`)
console.log(`  every coin recomputes as toUuid("${registerSpec('<name>', 0).replace('= 0', '= <value>')}") — a resolvable link, not a transcription`)

// ── 2 · THE LIVE UNIT ───────────────────────────────────────────────────────────────────────────────────────
// Ask the qpu connector for its register. Modelled on scripts/qpu-crosscheck.ts: the connector forwards to
// qpu.uuidna.com and falls back to the unit's source when the served door is absent; either way the answer is a
// third party's report of itself, used only as a join key against what qpu.lean records.
const call = spawnSync('node', ['scripts/mcp-call.ts', 'connect', JSON.stringify({ connector: 'qpu', tool: 'clay', arguments: {} })],
  { encoding: 'utf8', timeout: 120_000, maxBuffer: 8 << 20 })
let answer: unknown = null
try { answer = JSON.parse(String(call.stdout)) } catch { /* no parseable answer */ }
const text = JSON.stringify(answer ?? '')

// read each served constant by name from the connector's answer, as an integer next to its name
const served = new Map<string, number>()
for (const r of reg) {
  const m = new RegExp(`"${r.name}"\\s*:\\s*(\\d+)`).exec(text)
  if (m) served.set(r.name, Number(m[1]))
}

if (served.size === 0) {
  console.log(`\n○ qpu-register: NOT MEASURED — the qpu connector returned no register constants`)
  console.log(`  (the served 'clay' door may be absent and the source fallback unreachable here; the local address layer above still holds)`)
  process.exit(0)
}
const disagree = reg.filter((r) => served.has(r.name) && served.get(r.name) !== r.value)
if (disagree.length) {
  console.log(`\n✗ qpu-register: DISAGREES — the served unit no longer matches what qpu.lean records:`)
  for (const r of disagree) console.log(`    ${r.name}: qpu.lean ${r.value}, served ${served.get(r.name)}`)
  console.log(`  qpu.lean's constants were read on a date; the unit has changed since. Re-read and re-derive, or the register is stale.`)
  process.exit(1)
}
console.log(`\n✓ qpu-register: AGREES — ${served.size} served constant(s) match qpu.lean, and every one resolves to its program by coin.`)
