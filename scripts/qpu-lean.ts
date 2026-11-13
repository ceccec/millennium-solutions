#!/usr/bin/env node
// QPU LEAN/TEX — the qpu unit's novel Lean theorems, read from its checkout and rendered to LaTeX here, ATTRIBUTED.
//
// The qpu connector is DOWN (src/mcp/connectors.ts): its served MCP answers 503 and its source MCP entry moved,
// so `connect` no longer calls it. But the unit's novelty is its Lean — ~56 files under
// src/quantum/processing/unit/lean/Qpu in the qpu checkout (Clay, Shor, Grover, Qft, Lattice, Stabilizer, …),
// each a theorem the kernel at qpu accepts. This reads them from the sibling checkout (QPU_DIR, default
// ~/github/uuidna/qpu) at its HEAD sha, pulls each theorem's type and its docstring, and renders the type to
// LaTeX with THIS deposit's own toLatex — the "tex" beside the Lean.
//
// NOT THIS DEPOSIT'S WORK, and never folded into the sealed proof tree. Every record is attributed to
// qpu.uuidna.com and dated by the qpu commit it was read at, so it is qpu's content AS OF that sha — re-checkable,
// and its drift from a later qpu is visible the next time this runs. Same discipline scripts/textbooks.ts uses for
// Qpu/Textbook.lean. On a clone without the sibling it says NOT MEASURED, never zero. toLatex returns null for a
// type it does not typeset; the raw Lean is always kept, so nothing is lost when the LaTeX is absent.
//
//   node scripts/qpu-lean.ts            read QPU_DIR, write evidence/qpu-lean/latest.json
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { toLatex } from '../src/latex/index.ts'

const QPU = process.env.QPU_DIR ?? join(homedir(), 'github', 'uuidna', 'qpu')
const SUB = 'src/quantum/processing/unit/lean/Qpu'
const DIR = join(QPU, SUB)
const OUT = 'evidence/qpu-lean'

if (!existsSync(DIR)) {
  console.log(JSON.stringify({ status: 'NOT MEASURED', needs: DIR, note: "qpu's Lean is read from its checkout; set QPU_DIR to the uuidna/qpu clone" }))
  process.exit(0)
}

const git = (...a: string[]): string => { try { return execFileSync('git', ['-C', QPU, ...a], { encoding: 'utf8' }).trim() } catch { return '' } }
const sha = git('rev-parse', 'HEAD')

const walk = (d: string, a: string[] = []): string[] => {
  for (const n of readdirSync(d)) { const p = join(d, n); if (statSync(p).isDirectory()) walk(p, a); else if (p.endsWith('.lean')) a.push(p) }
  return a
}
const files = walk(DIR).sort()

// An optional /-- doc -/ then `theorem|lemma <name> <binders>? : <type up to :=>`. Simple binder groups
// ((…)/{…}/[…]) and the type-annotation colon are consumed so the captured type is the proposition itself;
// toLatex renders what it can and returns null otherwise. The raw type is kept, so nothing is lost. The proof
// after := is not read.
const THM = /(?:\/--\s*([\s\S]*?)\s*-\/\s*)?\b(?:theorem|lemma)\s+([A-Za-z_][\w'.]*)\s*(?:[({[][^)}\]]*[)}\]]\s*)*:\s*([\s\S]*?)\s*:=/g

type Thm = { name: string; type: string; latex: string | null; doc: string | null }
const perFile = files.map((f) => {
  const src = readFileSync(f, 'utf8')
  const rel = f.slice(QPU.length + 1)
  const theorems: Thm[] = []
  for (const m of src.matchAll(THM)) {
    const type = m[3].replace(/\s+/g, ' ').trim()
    if (!type) continue
    theorems.push({ name: m[2], type, latex: toLatex(type) ?? null, doc: m[1]?.replace(/\s+/g, ' ').trim() || null })
  }
  return { file: rel, theorems }
}).filter((x) => x.theorems.length)

const total = perFile.reduce((n, x) => n + x.theorems.length, 0)
const typeset = perFile.reduce((n, x) => n + x.theorems.filter((t) => t.latex).length, 0)
const record = {
  status: sha ? 'INGESTED' : 'NOT MEASURED',
  attribution: "qpu.uuidna.com — the QPU unit, built from github.com/uuidna/qpu. These theorems are qpu's, NOT this "
    + "deposit's: read from the sibling checkout and rendered here, attributed and dated by the commit below, and never "
    + "folded into this deposit's sealed proof tree or ledger. The connector that would forward them is down; this is the "
    + "unit's Lean preserved by reading, not a claim this deposit proves them.",
  qpuCommit: sha || null,
  measured: new Date().toISOString().slice(0, 10),
  files: perFile.length,
  theorems: total,
  typeset,
  lean: perFile,
}
mkdirSync(OUT, { recursive: true })
writeFileSync(`${OUT}/latest.json`, JSON.stringify(record, null, 1) + '\n')
console.log(`✓ qpu-lean: ingested ${total} theorem(s) across ${perFile.length} file(s) from qpu@${(sha || '?').slice(0, 9)}, `
  + `${typeset} typeset to LaTeX → ${OUT}/latest.json — attributed to qpu, not this deposit's work`)
