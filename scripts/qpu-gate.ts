#!/usr/bin/env node
// QPU GATE — qpu.lean theorems are the authority. No package `*Of` constructors.
//
// qpu.lean carries eight constants and proves what follows from them. Every `@uuidna/qpu` export whose
// name ends in `Of` (the JSON-LD / capacity constructors) is REMOVED from this tree: they walk capped
// graphs, overflow the Node stack, and never consult a quantum theorem. This gate:
//   1 · refuses any `qpu…Of` identifier under scripts/ or src/
//   2 · never imports or calls those constructors on the installed package
//   3 · checks the declared Lean constants against the relations the theorems seal
//   4 · checks lock ↔ tree version drift for @uuidna/qpu and @uuidna/uuidna
//
// THREE STATES, NEVER TWO. Relations hold → pass (0). A constant breaks a sealed relation → refuse (1).
// A package that cannot be version-read is NOT MEASURED (2) with the cause.
//
//   npm run qpu
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { leanSource } from '../src/api/index.ts'

/** every package constructor `qpu…Of` — banned in this tree; theorems only */
const BANNED_OF = /\bqpu[A-Za-z0-9]*Of\b/g

/** Walk scripts/ and src/; refuse if any banned `qpu…Of` name appears (except this file's ban pattern). */
function refuseBannedOf(): void {
  const hits: string[] = []
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      if (name === 'node_modules' || name === '.git' || name.startsWith('.')) continue
      const p = join(dir, name)
      const st = statSync(p)
      if (st.isDirectory()) { walk(p); continue }
      if (!/\.(ts|js|mjs|lean|md|vue)$/.test(name)) continue
      const text = readFileSync(p, 'utf8')
      if (p === 'scripts/qpu-gate.ts') {
        // this file may hold the ban regex; refuse an actual call or import of a qpu…Of
        if (/(?:import\s*\{[^}]*\bqpu[A-Za-z0-9]*Of\b|\bqpu[A-Za-z0-9]*Of\s*\()/.test(text)) hits.push(p)
        continue
      }
      BANNED_OF.lastIndex = 0
      if (BANNED_OF.test(text)) hits.push(p)
    }
  }
  for (const r of ['scripts', 'src']) walk(r)
  if (hits.length) {
    console.log(`✗ qpu-gate: qpu…Of constructors are removed from this tree — found in ${hits.length} file(s):`)
    for (const h of hits) console.log(`    ${h}`)
    console.log('  use qpu.lean theorems only; never a package export ending in Of')
    process.exit(1)
  }
}

refuseBannedOf()

const declared = new Map<string, number>()
for (const m of leanSource('qpu.lean').matchAll(/^def\s+([a-z]+)\s*:\s*Nat\s*:=\s*(\d+)/gm)) declared.set(m[1]!, Number(m[2]))
const need = ['coins', 'rays', 'faces', 'vertices', 'hexbit', 'bits', 'qubits', 'levels'] as const
const missing = need.filter((k) => !declared.has(k))
if (missing.length) {
  console.log(`✗ qpu-gate: qpu.lean missing def(s): ${missing.join(', ')}`)
  process.exit(1)
}
const n = Object.fromEntries(declared) as Record<(typeof need)[number], number>
console.log(`qpu-gate: qpu.lean declares ${declared.size} constant(s) — ${[...declared].map(([k, v]) => `${k} ${v}`).join(' · ')}`)
console.log(`          qpu…Of constructors: banned under scripts/ and src/ — theorems only`)

// sealed relations from qpu.lean (the_served_constants_satisfy_the_relations_qpu_states and kin)
const relationFails: string[] = []
if (n.faces !== n.coins * n.rays) relationFails.push(`faces = coins × rays → ${n.faces} ≠ ${n.coins}×${n.rays}`)
if (n.bits !== n.vertices * n.hexbit) relationFails.push(`bits = vertices × hexbit → ${n.bits} ≠ ${n.vertices}×${n.hexbit}`)
if (n.vertices !== n.levels ** n.qubits) relationFails.push(`vertices = levels ^ qubits → ${n.vertices} ≠ ${n.levels}^${n.qubits}`)
if (relationFails.length) {
  console.log(`✗ qpu-gate: ${relationFails.length} sealed relation(s) broken in qpu.lean:`)
  for (const f of relationFails) console.log(`    ${f}`)
  process.exit(1)
}
for (const [k, v] of declared) console.log(`  ✓ ${k}: lean ${v} · theorem relations hold`)

// lock ↔ tree version drift (no package *Of call)
let installed: { version: string }
try {
  installed = JSON.parse(readFileSync('node_modules/@uuidna/qpu/package.json', 'utf8')) as { version: string }
} catch (e) {
  const why = String((e as Error)?.message ?? e).split('\n')[0]
  console.log(`○ NOT MEASURED — @uuidna/qpu package.json unreadable: ${why}`)
  process.exit(2)
}
console.log(`          installed @uuidna/qpu ${installed.version} (version only — no Of constructor called)`)

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8')) as { packages: Record<string, { version: string }> }
const drift = ['@uuidna/qpu', '@uuidna/uuidna'].flatMap((u) => {
  const locked = lock.packages[`node_modules/${u}`]?.version
  const tree = (JSON.parse(readFileSync(`node_modules/${u}/package.json`, 'utf8')) as { version: string }).version
  return locked === tree ? [] : [`${u}: lock resolves ${locked ?? 'nothing'}, the tree runs ${tree}`]
})
if (drift.length) {
  console.log(`✗ qpu-gate: ${drift.length} unit(s) installed outside the lock — ${drift.join(' · ')}`)
  console.log('  npm ci installs the lock; a gate that passes on the tree certifies nothing about CI. npm update <unit> brings the lock to the registry')
  process.exit(1)
}

console.log(`✓ qpu-gate: ${declared.size} constant(s) satisfy qpu.lean theorem relations · lock agrees · no qpu…Of in tree`)
