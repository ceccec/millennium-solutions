#!/usr/bin/env node
// QPU GATE — the installed @uuidna/qpu against what src/proof/qpu.lean declares, read on both sides, typed on neither.
//
// qpu.lean carries eight constants "read from the served JSON-LD on 2026-09-28" and proves what follows from them
// IF they are as stated. A date and a hand are the weakest provenance this tree accepts: the service can change,
// the reading can be mistyped, and nothing here would know. @uuidna/qpu is the same unit as an npm package, so the
// constants can be COMPUTED here from the installed version and compared to the Lean defs — one more instrument,
// local, versioned, with no network — exactly as @uuidna/uuidna is for the ring.
//
// THREE STATES, NEVER TWO. Agreement passes (0). A constant that disagrees refuses (1) and names both numbers. A
// package that cannot be imported is NOT MEASURED (2) with the cause — and today that is the state: @uuidna/qpu
// 1.0.0's main entry imports readme.js, which its own `files` whitelist excludes (`!dist/**/readme.js`), so the
// published package cannot load at all; the same code proves itself from the repository's dist. That is the
// publication surface being narrower than the repository, found by installing. It is reported here as a measured
// refusal with its cause, not silently skipped, and this gate joins the chain the day a version that imports ships.
//
//   npm run qpu
import { readFileSync } from 'node:fs'
import { leanSource } from '../src/api/index.ts'

const declared = new Map<string, number>()
for (const m of leanSource('qpu.lean').matchAll(/^def\s+([a-z]+)\s*:\s*Nat\s*:=\s*(\d+)/gm)) declared.set(m[1]!, Number(m[2]))
const installed = JSON.parse(readFileSync('node_modules/@uuidna/qpu/package.json', 'utf8')) as { version: string }
console.log(`qpu-gate: qpu.lean declares ${declared.size} constant(s) — ${[...declared].map(([k, v]) => `${k} ${v}`).join(' · ')}`)
console.log(`          installed @uuidna/qpu ${installed.version}`)

let qpu: Record<string, (...a: unknown[]) => Record<string, unknown>>
try { qpu = (await import('@uuidna/qpu')) as unknown as typeof qpu }
catch (e) {
  const why = String((e as Error)?.message ?? e).split('\n')[0]
  console.log(`○ NOT MEASURED — @uuidna/qpu ${installed.version} cannot be imported: ${why}`)
  console.log('  the published package excludes a module its own entry imports; the constants stay as read by hand on 2026-09-28 until a version that loads ships')
  process.exit(2)
}

// the package computes each constant; the names are read off its own answer, never guessed
const computed: Record<string, unknown> = {}
for (const fn of ['qpuFacesOf', 'qpuQuantumOf', 'qpuCapacityOf'] as const) {
  if (typeof qpu[fn] !== 'function') continue
  const r = qpu[fn]()
  for (const [k, v] of Object.entries(r)) if (typeof v === 'number' && declared.has(k) && !(k in computed)) computed[k] = v
}
const compared = [...declared].filter(([k]) => k in computed)
const differ = compared.filter(([k, v]) => computed[k] !== v)
for (const [k, v] of compared) console.log(`  ${computed[k] === v ? '✓' : '✗'} ${k}: lean ${v} · installed ${String(computed[k])}`)
const unmet = [...declared.keys()].filter((k) => !(k in computed))
if (unmet.length) console.log(`  ○ not computed by the installed package: ${unmet.join(', ')} — stays as read`)
if (differ.length) { console.log(`✗ qpu-gate: ${differ.length} constant(s) differ between qpu.lean and @uuidna/qpu ${installed.version}`); process.exit(1) }
console.log(`✓ qpu-gate: ${compared.length} constant(s) agree between qpu.lean and @uuidna/qpu ${installed.version}`)
